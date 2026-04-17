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
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const { data: profile } = await supabase.from("users").select("org_id, role").eq("id", user.id).maybeSingle();
  if (!profile?.org_id) return new Response(JSON.stringify({ error: "No org" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  if (!['owner','admin'].includes(profile.role)) return new Response(JSON.stringify({ error: "Admin required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  const orgId = profile.org_id;
  try {
    const body = await req.json();
    const action = body.action || 'scan';

    if (action === 'scan') {
      const signals: any[] = [];

      // 1. Anomalous amounts: transactions > 3 std dev from mean
      const { data: txns } = await supabase.from('gl_transactions').select('id, amount, description, period, account_id').eq('org_id', orgId);
      if (txns && txns.length > 10) {
        const amounts = txns.map(t => Math.abs(Number(t.amount)));
        const mean = amounts.reduce((a,b) => a+b, 0) / amounts.length;
        const stdDev = Math.sqrt(amounts.reduce((a,b) => a + Math.pow(b - mean, 2), 0) / amounts.length);
        const threshold = mean + 3 * stdDev;
        for (const t of txns) {
          if (Math.abs(Number(t.amount)) > threshold) {
            signals.push({ signal_type: 'anomalous_amount', severity: Math.abs(Number(t.amount)) > mean + 5 * stdDev ? 'critical' : 'high', source_table: 'gl_transactions', source_id: t.id, description: `Transaction amount $${Math.round(Number(t.amount)/100)/10}K is ${((Math.abs(Number(t.amount)) - mean) / stdDev).toFixed(1)} std deviations from mean`, evidence: { amount: t.amount, mean: Math.round(mean), std_dev: Math.round(stdDev), threshold: Math.round(threshold), description: t.description }, risk_score: Math.min(95, Math.round(50 + ((Math.abs(Number(t.amount)) - threshold) / stdDev) * 15)) });
          }
        }

        // 2. Round number patterns (potential manual entries / fraud)
        const roundTxns = txns.filter(t => { const a = Math.abs(Number(t.amount)); return a >= 1000 && a % 1000 === 0; });
        const roundPct = roundTxns.length / txns.length;
        if (roundPct > 0.3 && roundTxns.length > 5) {
          signals.push({ signal_type: 'round_number_pattern', severity: 'medium', source_table: 'gl_transactions', description: `${Math.round(roundPct*100)}% of transactions (${roundTxns.length}/${txns.length}) are round thousands — may indicate manual journal entries`, evidence: { round_count: roundTxns.length, total_count: txns.length, percentage: Math.round(roundPct*100) }, risk_score: Math.min(70, Math.round(30 + roundPct * 80)) });
        }

        // 3. Duplicate transactions
        const seen = new Map<string, any[]>();
        for (const t of txns) {
          const key = `${t.amount}-${t.period}-${t.account_id}`;
          if (!seen.has(key)) seen.set(key, []);
          seen.get(key)!.push(t);
        }
        for (const [key, dupes] of seen) {
          if (dupes.length >= 3) {
            signals.push({ signal_type: 'duplicate_transaction', severity: 'medium', source_table: 'gl_transactions', source_id: dupes[0].id, description: `${dupes.length} identical transactions: $${dupes[0].amount} in ${dupes[0].period}`, evidence: { count: dupes.length, amount: dupes[0].amount, period: dupes[0].period, ids: dupes.map((d:any) => d.id).slice(0, 5) }, risk_score: Math.min(75, 35 + dupes.length * 10) });
          }
        }
      }

      // 4. Auth anomalies: failed logins
      const { data: failedLogins } = await supabase.from('session_events').select('id, ip_address, user_agent, created_at').eq('org_id', orgId).eq('event_type', 'failed_login').order('created_at', { ascending: false }).limit(50);
      if (failedLogins && failedLogins.length > 10) {
        const ipCounts = new Map<string, number>();
        for (const f of failedLogins) { const ip = String(f.ip_address || 'unknown'); ipCounts.set(ip, (ipCounts.get(ip) || 0) + 1); }
        for (const [ip, count] of ipCounts) {
          if (count >= 5) {
            signals.push({ signal_type: 'auth_anomaly', severity: count >= 15 ? 'critical' : 'high', source_table: 'session_events', description: `${count} failed login attempts from IP ${ip}`, evidence: { ip, failed_count: count, window: '24 hours' }, risk_score: Math.min(90, 40 + count * 5) });
          }
        }
      }

      // 5. Velocity spike: unusual number of transactions in a period
      if (txns && txns.length > 0) {
        const periodCounts = new Map<string, number>();
        for (const t of txns) { periodCounts.set(t.period, (periodCounts.get(t.period) || 0) + 1); }
        const counts = Array.from(periodCounts.values());
        const avgCount = counts.reduce((a,b) => a+b, 0) / counts.length;
        for (const [period, count] of periodCounts) {
          if (count > avgCount * 2.5 && count > 10) {
            signals.push({ signal_type: 'velocity_spike', severity: 'medium', source_table: 'gl_transactions', description: `${count} transactions in ${period} — ${(count/avgCount).toFixed(1)}x the average (${Math.round(avgCount)})`, evidence: { period, count, average: Math.round(avgCount), multiplier: (count/avgCount).toFixed(1) }, risk_score: Math.min(65, Math.round(25 + (count/avgCount) * 10)) });
          }
        }
      }

      // Insert signals
      if (signals.length > 0) {
        const inserts = signals.map(s => ({ ...s, org_id: orgId }));
        await supabase.from('fraud_signals').insert(inserts);
      }

      // Update risk profile
      const finRisk = signals.filter(s => ['anomalous_amount','round_number_pattern','duplicate_transaction','velocity_spike'].includes(s.signal_type)).reduce((max, s) => Math.max(max, s.risk_score), 0);
      const authRisk = signals.filter(s => ['auth_anomaly','geo_anomaly'].includes(s.signal_type)).reduce((max, s) => Math.max(max, s.risk_score), 0);
      const overall = Math.round((finRisk * 0.4 + authRisk * 0.3 + 15 * 0.3));
      
      await supabase.from('fraud_risk_profile').upsert({ org_id: orgId, overall_score: overall, financial_risk: finRisk, auth_risk: authRisk, data_risk: 10, compliance_risk: 15, open_signals: signals.length, total_signals: signals.length, last_scan_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: 'org_id' });

      await supabase.from('audit_log').insert({ user_id: user.id, org_id: orgId, action: 'fraud.scan_completed', resource_type: 'fraud', metadata: { signals_found: signals.length, overall_risk: overall } }).catch(() => {});

      return new Response(JSON.stringify({ success: true, signals_found: signals.length, risk_score: overall, signals: signals.slice(0, 20) }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'status') {
      const { data: rp } = await supabase.from('fraud_risk_profile').select('*').eq('org_id', orgId).maybeSingle();
      const { data: openSignals } = await supabase.from('fraud_signals').select('id, signal_type, severity, description, risk_score, status, created_at').eq('org_id', orgId).eq('status', 'open').order('risk_score', { ascending: false }).limit(20);
      return new Response(JSON.stringify({ risk_profile: rp || { overall_score: 0 }, open_signals: openSignals || [] }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'resolve') {
      const { signal_id, resolution, status: newStatus } = body;
      if (!signal_id) return new Response(JSON.stringify({ error: 'signal_id required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      await supabase.from('fraud_signals').update({ status: newStatus || 'resolved', resolution_notes: resolution || '', investigated_by: user.id, investigated_at: new Date().toISOString(), resolved_at: new Date().toISOString() }).eq('id', signal_id).eq('org_id', orgId);
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use: scan, status, resolve' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
