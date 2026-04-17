import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY') || Deno.env.get('AI_GATEWAY_API_KEY') || ''
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function fmt(v: number): string { const a=Math.abs(v); if(a>=1e6)return'$'+(v/1e6).toFixed(1)+'M'; if(a>=1e3)return'$'+(v/1e3).toFixed(0)+'K'; return'$'+v.toFixed(0); }

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  let orgId: string|null = null, userId: string|null = null
  const authHeader = req.headers.get('Authorization')
  const cronSecret = req.headers.get('x-cron-secret')
  const expectedSecret = Deno.env.get('CRON_SECRET') || ''
  if (cronSecret && expectedSecret && cronSecret === expectedSecret) { /* cron ok */ }
  else if (authHeader?.startsWith('Bearer ')) { const { data: { user }, error } = await sb.auth.getUser(authHeader.replace('Bearer ', '')); if (error || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers }); userId = user.id; const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle(); orgId = profile?.org_id || null }
  else return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })

  try {
    const body = await req.json()
    const action = body.action || 'generate'

    if (action === 'list') { if (!orgId) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers }); const { data: reports } = await sb.from('generated_reports').select('id, report_type, title, period, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(20); return new Response(JSON.stringify({ reports: reports || [] }), { headers }) }
    if (action === 'get') { if (!body.report_id) return new Response(JSON.stringify({ error: 'report_id required' }), { status: 400, headers }); const { data: report } = await sb.from('generated_reports').select('*').eq('id', body.report_id).maybeSingle(); return new Response(JSON.stringify({ report }), { headers }) }

    if (action === 'generate') {
      const targetOrgId = body.org_id || orgId
      if (!targetOrgId) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })
      const reportType = body.report_type || 'monthly_board'
      const now = new Date()
      const period = body.period || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      const [txnRes, budgetRes, acctRes, alertRes, orgRes] = await Promise.all([
        sb.from('gl_transactions').select('amount, period, gl_accounts(name, account_type)').eq('org_id', targetOrgId),
        sb.from('gl_budgets').select('amount, period, gl_accounts(name, account_type)').eq('org_id', targetOrgId),
        sb.from('gl_accounts').select('name, account_type').eq('org_id', targetOrgId).eq('active', true),
        sb.from('financial_alerts').select('title, severity, description').eq('org_id', targetOrgId).eq('status', 'active').order('created_at', { ascending: false }).limit(10),
        sb.from('organizations').select('name').eq('id', targetOrgId).maybeSingle(),
      ])
      const txns = txnRes.data || []; const budgets = budgetRes.data || []
      if (!txns.length) return new Response(JSON.stringify({ error: 'No GL data' }), { status: 200, headers })

      let revenue = 0, cogs = 0, opex = 0
      const byMonth: Record<string, { revenue: number, cogs: number, opex: number }> = {}
      txns.forEach((t: any) => { const at = t.gl_accounts?.account_type; const amt = Math.abs(Number(t.amount) || 0); if (at === 'revenue' || at === 'other_income') revenue += amt; else if (at === 'cost_of_revenue') cogs += amt; else if (at === 'expense' || at === 'other_expense') opex += amt; const p = t.period || ''; if (p) { if (!byMonth[p]) byMonth[p] = { revenue: 0, cogs: 0, opex: 0 }; if (at === 'revenue' || at === 'other_income') byMonth[p].revenue += amt; else if (at === 'cost_of_revenue') byMonth[p].cogs += amt; else byMonth[p].opex += amt } })
      const gp = revenue - cogs; const ni = revenue - cogs - opex
      const gm = revenue > 0 ? ((gp / revenue) * 100).toFixed(1) : '0'; const nm = revenue > 0 ? ((ni / revenue) * 100).toFixed(1) : '0'
      let budgetRevenue = 0, budgetOpex = 0; budgets.forEach((b: any) => { const at = b.gl_accounts?.account_type; const amt = Math.abs(Number(b.amount) || 0); if (at === 'revenue') budgetRevenue += amt; else budgetOpex += amt })

      const reportContent = { organization: orgRes.data?.name || 'Organization', period, report_type: reportType, generated_at: now.toISOString(),
        kpis: { revenue, cogs, gross_profit: gp, gross_margin: gm, opex, net_income: ni, net_margin: nm, accounts: (acctRes.data || []).length, transactions: txns.length },
        budget_comparison: { budget_revenue: budgetRevenue, actual_revenue: revenue, revenue_variance: revenue - budgetRevenue, budget_opex: budgetOpex, actual_opex: opex, opex_variance: opex - budgetOpex },
        monthly_trend: Object.entries(byMonth).sort().map(([month, d]) => ({ month, revenue: d.revenue, cogs: d.cogs, opex: d.opex, net: d.revenue - d.cogs - d.opex })),
        active_alerts: (alertRes.data || []).map((a: any) => ({ title: a.title, severity: a.severity, description: a.description })),
      }

      let summaryText = ''
      if (ANTHROPIC_KEY) {
        try {
          const prompt = `Write a concise 3-paragraph executive summary for a board report.\n\nRevenue: ${fmt(revenue)} | COGS: ${fmt(cogs)} | GP: ${fmt(gp)} (${gm}%)\nOpEx: ${fmt(opex)} | NI: ${fmt(ni)} (${nm}%)\nBudget Rev: ${fmt(budgetRevenue)} | Actual: ${fmt(revenue)} | Variance: ${fmt(revenue - budgetRevenue)}\nAlerts: ${(alertRes.data || []).length}\n\nP1: Performance summary. P2: Variances and trends. P3: Outlook. Use specific numbers. CFO audience.`
          const aiRes = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 500, messages: [{ role: 'user', content: prompt }] }) })
          if (aiRes.ok) { const aiData = await aiRes.json(); summaryText = aiData.content?.map((c: any) => c.text || '').join('') || '' }
        } catch {}
      }

      const title = `${reportContent.organization} \u2014 ${reportType === 'monthly_board' ? 'Monthly Board Report' : 'Financial Report'} (${period})`
      const { data: report } = await sb.from('generated_reports').insert({ org_id: targetOrgId, report_type: reportType, title, period, content: reportContent, summary_text: summaryText, generated_by: userId ? 'user' : 'system', status: 'generated' }).select('id').single()

      try { await sb.from('audit_log').insert({ user_id: userId, org_id: targetOrgId, action: 'report.generated', resource_type: 'report', metadata: { report_type: reportType, period, report_id: report?.id } }) } catch {}

      return new Response(JSON.stringify({ status: 'generated', report_id: report?.id, title, period, summary: summaryText, kpis: reportContent.kpis, alerts: reportContent.active_alerts.length }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers })
  } catch (err: any) {
    console.error('report-generate error:', err)
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers })
  }
})
