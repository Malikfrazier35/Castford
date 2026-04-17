import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'GET, POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }

// Simple linear forecast for dashboard trend overlay
function linearForecast(data: number[], periods: number): number[] {
  const n = data.length; if (n < 2) return Array(periods).fill(data[0] || 0);
  let sumX=0, sumY=0, sumXY=0, sumX2=0;
  for (let i=0; i<n; i++) { sumX+=i; sumY+=data[i]; sumXY+=i*data[i]; sumX2+=i*i; }
  const m = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX);
  const b = (sumY - m*sumX) / n;
  return Array.from({length: periods}, (_,i) => Math.round(m*(n+i) + b));
}

Deno.serve(async (req) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })
  const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
  const orgId = profile?.org_id
  if (!orgId) return new Response(JSON.stringify({ error: 'No organization' }), { status: 404, headers })

  const url = new URL(req.url)
  const view = url.searchParams.get('view') || 'summary'

  try {
    if (view === 'summary') {
      const [accounts, transactions, budgets, auditLog, integrations] = await Promise.all([
        sb.from('gl_accounts').select('*').eq('org_id', orgId),
        sb.from('gl_transactions').select('*, gl_accounts(name, account_type)').eq('org_id', orgId).order('txn_date', { ascending: false }).limit(500),
        sb.from('gl_budgets').select('*, gl_accounts(name, account_type)').eq('org_id', orgId),
        sb.from('audit_log').select('action, created_at, metadata').eq('org_id', orgId).order('created_at', { ascending: false }).limit(20),
        sb.from('integrations').select('provider, status, last_sync_at, records_synced').eq('org_id', orgId),
      ])

      const txns = transactions.data || []; const accts = accounts.data || []; const bdgts = budgets.data || []
      let revenue = 0, cogs = 0, opex = 0
      txns.forEach((t: any) => {
        const atype = t.gl_accounts?.account_type; const amt = Math.abs(Number(t.amount) || 0)
        if (atype === 'revenue' || atype === 'other_income') revenue += amt
        else if (atype === 'cost_of_revenue') cogs += amt
        else if (atype === 'expense' || atype === 'other_expense') opex += amt
      })
      const grossProfit = revenue - cogs; const netIncome = revenue - cogs - opex

      // Monthly breakdown
      const byMonth: Record<string, { revenue: number, cogs: number, opex: number }> = {}
      txns.forEach((t: any) => {
        const month = t.period || (t.txn_date || '').slice(0, 7); if (!month) return
        if (!byMonth[month]) byMonth[month] = { revenue: 0, cogs: 0, opex: 0 }
        const amt = Math.abs(Number(t.amount) || 0); const atype = t.gl_accounts?.account_type
        if (atype === 'revenue' || atype === 'other_income') byMonth[month].revenue += amt
        else if (atype === 'cost_of_revenue') byMonth[month].cogs += amt
        else if (atype === 'expense' || atype === 'other_expense') byMonth[month].opex += amt
      })

      const monthlyTrend = Object.entries(byMonth).sort().map(([month, d]) => ({
        month, revenue: d.revenue, cogs: d.cogs, opex: d.opex, net: d.revenue - d.cogs - d.opex,
        budget_revenue: 0, budget_opex: 0,
      }))

      // Add budget overlay to monthly trend
      const budgetByMonth: Record<string, { revenue: number, opex: number }> = {}
      bdgts.forEach((b: any) => {
        const p = b.period; if (!p) return; const atype = b.gl_accounts?.account_type
        if (!budgetByMonth[p]) budgetByMonth[p] = { revenue: 0, opex: 0 }
        if (atype === 'revenue') budgetByMonth[p].revenue += Math.abs(Number(b.amount) || 0)
        else budgetByMonth[p].opex += Math.abs(Number(b.amount) || 0)
      })
      monthlyTrend.forEach(m => {
        const bm = budgetByMonth[m.month]
        if (bm) { m.budget_revenue = bm.revenue; m.budget_opex = bm.opex; }
      })

      // Inline forecast: 3-month revenue projection
      let forecast_trend: any[] = []
      if (monthlyTrend.length >= 3) {
        const revSeries = monthlyTrend.map(m => m.revenue)
        const forecasted = linearForecast(revSeries, 3)
        const lastPeriod = monthlyTrend[monthlyTrend.length - 1].month
        const [ly, lm] = lastPeriod.split('-').map(Number)
        forecast_trend = forecasted.map((val, i) => {
          const m = ((lm + i) % 12) + 1; const y = ly + Math.floor((lm + i) / 12)
          return { month: `${y}-${String(m).padStart(2, '0')}`, forecast_revenue: val, type: 'forecast' }
        })
      }

      // Connected integrations count
      const connectedCount = (integrations.data || []).filter((i: any) => i.status === 'connected').length

      const recentTxns = txns.slice(0, 10).map((t: any) => ({
        date: t.txn_date, account: t.gl_accounts?.name, type: t.gl_accounts?.account_type,
        amount: Number(t.amount), description: t.description, period: t.period,
      }))

      return new Response(JSON.stringify({
        demo_mode: txns.length === 0,
        kpis: {
          total_revenue: revenue, cogs, gross_profit: grossProfit, opex, net_income: netIncome,
          gross_margin: revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : '0',
          net_margin: revenue > 0 ? ((netIncome / revenue) * 100).toFixed(1) : '0',
          total_accounts: accts.length, total_transactions: txns.length, total_budgets: bdgts.length,
          connected_integrations: connectedCount,
        },
        monthly_trend: monthlyTrend,
        forecast_trend,
        recent_transactions: recentTxns,
        recent_activity: auditLog.data || [],
      }), { headers })
    }

    if (view === 'accounts') {
      const { data } = await sb.from('gl_accounts').select('*').eq('org_id', orgId).order('name')
      return new Response(JSON.stringify({ accounts: data }), { headers })
    }

    if (view === 'cashflow') {
      const { data: txns } = await sb.from('gl_transactions').select('txn_date, amount, gl_accounts(account_type)').eq('org_id', orgId).order('txn_date')
      const weekly: Record<string, { inflow: number, outflow: number }> = {}
      ;(txns || []).forEach((t: any) => {
        const d = new Date(t.txn_date); const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay())
        const key = weekStart.toISOString().slice(0, 10)
        if (!weekly[key]) weekly[key] = { inflow: 0, outflow: 0 }
        const atype = t.gl_accounts?.account_type
        if (atype === 'revenue' || atype === 'other_income') weekly[key].inflow += Math.abs(Number(t.amount))
        else weekly[key].outflow += Math.abs(Number(t.amount))
      })
      return new Response(JSON.stringify({ weeks: Object.entries(weekly).sort().map(([week, d]) => ({ week, ...(d as any) })) }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown view' }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message }), { status: 500, headers })
  }
})
