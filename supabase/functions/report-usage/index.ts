import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000'];
function cors(req: Request) { const o=req.headers.get('origin')||''; return {'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0],'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization, apikey','Content-Type':'application/json'}; }

Deno.serve(async (req: Request) => {
  const headers = cors(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return new Response(JSON.stringify({ error: 'Missing token' }), { status: 401, headers });
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '');
    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
    if (authErr || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
    const body = await req.json();
    const { event_type, metadata = {}, tokens_used = 0 } = body;
    const validTypes = ['ai_query', 'connector_sync', 'report_export', 'scenario_run', 'api_call'];
    if (!validTypes.includes(event_type)) return new Response(JSON.stringify({ error: 'Invalid event_type' }), { status: 400, headers });
    const { data: userData } = await supabaseAdmin.from('users').select('org_id').eq('id', user.id).single();
    if (!userData?.org_id) return new Response(JSON.stringify({ error: 'No organization found' }), { status: 400, headers });
    const { data: usageEvent, error: insertErr } = await supabaseAdmin.from('usage_events').insert({ org_id: userData.org_id, user_id: user.id, event_type, metadata, tokens_used, reported_to_stripe: false }).select('id').single();
    if (insertErr) return new Response(JSON.stringify({ error: 'Failed to log usage' }), { status: 500, headers });
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    let stripeReported = false;
    if (stripeKey) {
      try {
        const { data: orgData } = await supabaseAdmin.from('organizations').select('stripe_customer_id').eq('id', userData.org_id).single();
        if (orgData?.stripe_customer_id) {
          const meterMap: Record<string, string> = { ai_query: 'castford_ai_queries', connector_sync: 'castford_connector_syncs', report_export: 'castford_report_exports', scenario_run: 'castford_scenario_runs', api_call: 'castford_api_calls' };
          const meterEventName = meterMap[event_type];
          if (meterEventName) {
            const meterRes = await fetch('https://api.stripe.com/v1/billing/meter_events', { method: 'POST', headers: { 'Authorization': `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ event_name: meterEventName, 'payload[value]': String(tokens_used || 1), 'payload[stripe_customer_id]': orgData.stripe_customer_id }) });
            if (meterRes.ok) { stripeReported = true; const md = await meterRes.json(); await supabaseAdmin.from('usage_events').update({ reported_to_stripe: true, stripe_meter_event_id: md.identifier || null }).eq('id', usageEvent?.id); }
          }
        }
      } catch {}
    }
    const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
    const { count } = await supabaseAdmin.from('usage_events').select('id', { count: 'exact', head: true }).eq('org_id', userData.org_id).eq('event_type', event_type).gte('created_at', startOfMonth.toISOString());
    return new Response(JSON.stringify({ success: true, event_id: usageEvent?.id, stripe_reported: stripeReported, current_month_count: count || 0 }), { status: 200, headers });
  } catch (err) {
    console.error('report-usage error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: cors(req) });
  }
});
