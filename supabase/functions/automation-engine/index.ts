import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ah = req.headers.get("Authorization");
  if (!ah?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const { data: { user }, error: authErr } = await supabase.auth.getUser(ah.replace("Bearer ", ""));
  if (authErr || !user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const { data: profile } = await supabase.from("users").select("org_id, role, timezone").eq("id", user.id).maybeSingle();
  if (!profile?.org_id) return new Response(JSON.stringify({ error: "No org" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const orgId = profile.org_id;

  try {
    const body = await req.json();
    const action = body.action;

    // List all rules for this org
    if (action === 'list') {
      const { data: rules } = await supabase.from('automation_rules').select('*').eq('org_id', orgId).order('name');
      return new Response(JSON.stringify({ rules: rules || [] }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get execution history
    if (action === 'history') {
      const { data: runs } = await supabase.from('automation_runs').select('*, automation_rules(name, slug)').eq('org_id', orgId).order('started_at', { ascending: false }).limit(50);
      return new Response(JSON.stringify({ runs: runs || [] }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Toggle rule on/off
    if (action === 'toggle') {
      if (!['owner','admin'].includes(profile.role)) return new Response(JSON.stringify({ error: 'Admin required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const { rule_id, enabled } = body;
      await supabase.from('automation_rules').update({ enabled, updated_at: new Date().toISOString() }).eq('id', rule_id).eq('org_id', orgId);
      await supabase.from('audit_log').insert({ user_id: user.id, org_id: orgId, action: enabled ? 'automation.enabled' : 'automation.disabled', resource_type: 'automation_rule', resource_id: rule_id }).catch(() => {});
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Run a specific rule manually
    if (action === 'run') {
      if (!['owner','admin'].includes(profile.role)) return new Response(JSON.stringify({ error: 'Admin required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const { rule_id } = body;
      const { data: rule } = await supabase.from('automation_rules').select('*').eq('id', rule_id).eq('org_id', orgId).maybeSingle();
      if (!rule) return new Response(JSON.stringify({ error: 'Rule not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

      const startTime = Date.now();
      const { data: run } = await supabase.from('automation_runs').insert({ rule_id: rule.id, org_id: orgId, status: 'running', trigger_source: 'manual' }).select('id').single();

      let output: any = {};
      let error: string | null = null;

      try {
        // Execute based on action_type
        if (rule.action_type === 'run_analysis') {
          // Variance watchdog
          const { data: txns } = await supabase.from('gl_transactions').select('account_id, amount, period').eq('org_id', orgId);
          const { data: budgets } = await supabase.from('gl_budgets').select('account_id, amount, period').eq('org_id', orgId);
          const { data: accounts } = await supabase.from('gl_accounts').select('id, name, account_type').eq('org_id', orgId);
          
          if (txns && budgets && accounts) {
            const actuals: Record<string, number> = {};
            for (const t of txns) actuals[t.account_id] = (actuals[t.account_id] || 0) + Number(t.amount);
            const budgetMap: Record<string, number> = {};
            for (const b of budgets) budgetMap[b.account_id] = (budgetMap[b.account_id] || 0) + Number(b.amount);
            
            const variances: any[] = [];
            for (const a of accounts) {
              const actual = actuals[a.id] || 0;
              const budget = budgetMap[a.id] || 0;
              if (budget !== 0) {
                const pct = ((actual - budget) / Math.abs(budget)) * 100;
                if (Math.abs(pct) > 10) variances.push({ account: a.name, type: a.account_type, actual: Math.round(actual), budget: Math.round(budget), variance_pct: pct.toFixed(1) });
              }
            }
            output = { variances_found: variances.length, variances: variances.slice(0, 20) };
          }
        }

        if (rule.action_type === 'enforce_policy') {
          // Consent expiry check
          const { data: staleConsents, count } = await supabase.from('consent_log').select('user_id, consent_type, created_at', { count: 'exact' }).lt('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()).eq('granted', true);
          output = { stale_consents: count || 0 };
        }

        if (rule.action_type === 'copilot_brief') {
          // Generate daily digest data
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          const { count: newTxns } = await supabase.from('gl_transactions').select('id', { count: 'exact', head: true }).eq('org_id', orgId).gte('synced_at', yesterday);
          const { count: newEvents } = await supabase.from('session_events').select('id', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', yesterday);
          const { count: openSignals } = await supabase.from('fraud_signals').select('id', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'open');
          output = { new_transactions: newTxns || 0, session_events: newEvents || 0, open_fraud_signals: openSignals || 0, digest_for: new Date().toISOString().split('T')[0] };
        }
      } catch (e: any) {
        error = e.message;
      }

      const duration = Date.now() - startTime;
      await supabase.from('automation_runs').update({ status: error ? 'error' : 'success', output_data: output, error_message: error, duration_ms: duration, completed_at: new Date().toISOString() }).eq('id', run?.id);
      await supabase.from('automation_rules').update({ last_run_at: new Date().toISOString(), run_count: rule.run_count + 1, error_count: error ? rule.error_count + 1 : rule.error_count }).eq('id', rule.id);

      return new Response(JSON.stringify({ success: !error, run_id: run?.id, duration_ms: duration, output, error }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get theme schedule for current user
    if (action === 'theme') {
      const tz = profile.timezone || 'America/New_York';
      const { data: u } = await supabase.from('users').select('theme_mode, theme_daylight_start, theme_moonlight_start').eq('id', user.id).maybeSingle();
      return new Response(JSON.stringify({ theme_mode: u?.theme_mode || 'auto', daylight_start: u?.theme_daylight_start || '08:00', moonlight_start: u?.theme_moonlight_start || '18:00', timezone: tz }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Update theme preference
    if (action === 'set_theme') {
      const { mode, daylight_start, moonlight_start } = body;
      const updates: any = {};
      if (mode && ['auto','light','dark'].includes(mode)) updates.theme_mode = mode;
      if (daylight_start) updates.theme_daylight_start = daylight_start;
      if (moonlight_start) updates.theme_moonlight_start = moonlight_start;
      await supabase.from('users').update(updates).eq('id', user.id);
      return new Response(JSON.stringify({ success: true, ...updates }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use: list, history, toggle, run, theme, set_theme' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
