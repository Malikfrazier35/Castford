import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000'];
function cors(req: Request) { const o = req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin': AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }

Deno.serve(async (req: Request) => {
  const headers = cors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return new Response(JSON.stringify({ error: 'Missing token' }), { status: 401, headers });
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
    if (authErr || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
    const body = await req.json();
    const { action } = body;
    const { data: profile } = await supabaseAdmin.from('users').select('org_id, role, full_name').eq('id', user.id).maybeSingle();
    const orgId = profile?.org_id;
    if (action === 'export') {
      const exportData: Record<string, any> = { account: { id: user.id, email: user.email, name: profile?.full_name, role: profile?.role, created_at: user.created_at }, organization: null, gl_accounts: [], gl_transactions: [], gl_budgets: [], audit_log: [], export_metadata: { exported_at: new Date().toISOString(), format: 'json', gdpr_article: '20', platform: 'Castford' } };
      if (orgId) {
        const { data: org } = await supabaseAdmin.from('organizations').select('*').eq('id', orgId).maybeSingle();
        exportData.organization = org;
        const { data: accounts } = await supabaseAdmin.from('gl_accounts').select('*').eq('org_id', orgId);
        exportData.gl_accounts = accounts || [];
        const { data: txns } = await supabaseAdmin.from('gl_transactions').select('*').eq('org_id', orgId).limit(1000);
        exportData.gl_transactions = txns || [];
        const { data: budgets } = await supabaseAdmin.from('gl_budgets').select('*').eq('org_id', orgId).limit(1000);
        exportData.gl_budgets = budgets || [];
      }
      const { data: auditLog } = await supabaseAdmin.from('audit_log').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(500);
      exportData.audit_log = auditLog || [];
      try { await supabaseAdmin.from('audit_log').insert({ user_id: user.id, org_id: orgId || null, action: 'data.exported', resource_type: 'user', resource_id: user.id, metadata: { format: 'json' } }); } catch {}
      return new Response(JSON.stringify({ success: true, data: exportData, exported_at: new Date().toISOString() }), { status: 200, headers });
    }
    if (action === 'delete') {
      if (profile?.role !== 'owner') return new Response(JSON.stringify({ error: 'Only owners can delete accounts' }), { status: 403, headers });
      if (orgId) {
        await supabaseAdmin.from('gl_budgets').delete().eq('org_id', orgId);
        await supabaseAdmin.from('gl_transactions').delete().eq('org_id', orgId);
        await supabaseAdmin.from('gl_accounts').delete().eq('org_id', orgId);
        await supabaseAdmin.from('audit_log').delete().eq('org_id', orgId);
        await supabaseAdmin.from('users').delete().eq('org_id', orgId);
        await supabaseAdmin.from('organizations').delete().eq('id', orgId);
      }
      const { error: authDeleteErr } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      return new Response(JSON.stringify({ success: true, message: 'All personal data deleted.', auth_deleted: !authDeleteErr }), { status: 200, headers });
    }
    return new Response(JSON.stringify({ error: 'Invalid action. Use: export or delete' }), { status: 400, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500, headers: cors(req) });
  }
});
