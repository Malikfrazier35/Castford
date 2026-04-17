import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o = req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin': AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey' }; }
function json(d: any, s=200, h: any={}) { return new Response(JSON.stringify(d), { status: s, headers: { 'Content-Type':'application/json', ...h } }); }
Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405, headers)
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401, headers)
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return json({ error: 'Invalid token' }, 401, headers)
  const { data: profile } = await supabase.from('users').select('org_id').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return json({ error: 'No org', pnl: [], source: 'no_org' }, 200, headers)
  const orgId = profile.org_id
  try {
    const body = await req.json()
    const action = body.action || 'pnl'
    if (action === 'pnl') {
      const { data: accounts } = await supabase.from('gl_accounts').select('id, name, account_type, account_subtype, external_id').eq('org_id', orgId).eq('active', true).order('name')
      if (!accounts?.length) return json({ pnl: [], source: 'no_data' }, 200, headers)
      const { data: txnData, error: txnErr } = await supabase.from('gl_transactions').select('account_id, amount, period').eq('org_id', orgId)
      if (txnErr) return json({ error: txnErr.message, pnl: [], source: 'error' }, 200, headers)
      const actualMap: Record<string,number> = {}; const txnPeriods = new Set<string>()
      if (txnData) for (const t of txnData) { actualMap[t.account_id] = (actualMap[t.account_id]||0) + Number(t.amount); if (t.period) txnPeriods.add(t.period) }
      const { data: budgetData } = await supabase.from('gl_budgets').select('account_id, amount, period').eq('org_id', orgId)
      const budgetMap: Record<string,number> = {}
      if (budgetData) for (const b of budgetData) { if (txnPeriods.has(b.period)) budgetMap[b.account_id] = (budgetMap[b.account_id]||0) + Number(b.amount) }
      const ts: Record<string,string> = { revenue:'Revenue', cost_of_revenue:'Cost of Revenue', expense:'Operating Expenses', other_income:'Other Income / Expense', other_expense:'Other Income / Expense' }
      const sections: Record<string,any[]> = { 'Revenue':[], 'Cost of Revenue':[], 'Operating Expenses':[], 'Other Income / Expense':[] }
      for (const a of accounts) { const s = ts[a.account_type]; if (!s) continue; const actual = Math.round((actualMap[a.id]||0)/1000); const budget = Math.round((budgetMap[a.id]||0)/1000); sections[s].push({ name: a.name, actual, budget, variance: actual-budget, variance_pct: budget!==0?((actual-budget)/Math.abs(budget)*100).toFixed(1):'0.0' }) }
      const pnl = Object.entries(sections).map(([section, rows]) => { const tA = rows.reduce((s,r)=>s+r.actual,0); const tB = rows.reduce((s,r)=>s+r.budget,0); return { section, rows, total: { name: `Total ${section==='Operating Expenses'?'OpEx':section==='Cost of Revenue'?'COGS':section}`, actual: tA, budget: tB, variance: tA-tB } } })
      const tR = pnl.find(s=>s.section==='Revenue')?.total.actual||0; const tC = pnl.find(s=>s.section==='Cost of Revenue')?.total.actual||0; const tO = pnl.find(s=>s.section==='Operating Expenses')?.total.actual||0
      return json({ pnl, summary: { total_revenue:tR, total_cogs:tC, gross_profit:tR-tC, gross_margin:tR>0?((tR-tC)/tR*100).toFixed(1):'0.0', total_opex:tO, net_income:tR-tC-tO+(pnl.find(s=>s.section==='Other Income / Expense')?.total.actual||0), periods: Array.from(txnPeriods).sort() }, source:'database', account_count:accounts.length, transaction_count:txnData?.length||0 }, 200, headers)
    }
    if (action === 'monthly') {
      const { data: monthly } = await supabase.from('gl_transactions').select('account_id, amount, period').eq('org_id', orgId).order('period')
      const { data: accounts } = await supabase.from('gl_accounts').select('id, account_type').eq('org_id', orgId)
      const typeMap: Record<string,string> = {}; if (accounts) for (const a of accounts) typeMap[a.id] = a.account_type
      const pd: Record<string,{revenue:number;expenses:number}> = {}; if (monthly) for (const t of monthly) { if (!pd[t.period]) pd[t.period]={revenue:0,expenses:0}; const tp=typeMap[t.account_id]; if (tp==='revenue') pd[t.period].revenue+=Number(t.amount); else if (tp==='cost_of_revenue'||tp==='expense') pd[t.period].expenses+=Number(t.amount) }
      const { data: budgets } = await supabase.from('gl_budgets').select('account_id, amount, period').eq('org_id', orgId)
      const bp: Record<string,{revenue:number;expenses:number}> = {}; if (budgets) for (const b of budgets) { if (!bp[b.period]) bp[b.period]={revenue:0,expenses:0}; const tp=typeMap[b.account_id]; if (tp==='revenue') bp[b.period].revenue+=Number(b.amount); else if (tp==='cost_of_revenue'||tp==='expense') bp[b.period].expenses+=Number(b.amount) }
      const trend = Object.keys(pd).sort().map(p => ({ period:p, label:new Date(p+'-15').toLocaleDateString('en-US',{month:'short'}), actual_revenue:Math.round(pd[p].revenue/1000), budget_revenue:Math.round((bp[p]?.revenue||0)/1000), actual_expenses:Math.round(pd[p].expenses/1000), budget_expenses:Math.round((bp[p]?.expenses||0)/1000) }))
      return json({ trend, source:'database' }, 200, headers)
    }
    if (action === 'accounts') { const { data: accounts } = await supabase.from('gl_accounts').select('*').eq('org_id', orgId).eq('active', true).order('account_type, name'); return json({ accounts:accounts||[], source:'database' }, 200, headers) }
    return json({ error: `Unknown action: ${action}` }, 400, headers)
  } catch (err: any) { return json({ error: err?.message||'Internal error', pnl:[], source:'error' }, 200, headers) }
})
