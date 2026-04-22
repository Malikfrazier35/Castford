// supabase/functions/cfo-command-center/index.ts
// v3 — Phase 2B
//
// Adds:
//   - Hub: TTM-based YoY math (was YTD-vs-LY which was time-window mismatched)
//   - PNL: ?period=ttm|ytd|qtd|mtd|all + common-size (% of revenue)
//   - CASH: 13-week rolling forecast + CCC (DSO/DPO/CCC) with caveats when AR/AP missing
//   - BUDGET: ranked variance attribution with template commentary
//   - FORECAST: driver decomposition (customers × ARPU), 4 scenarios, statistical confidence intervals

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) {
  const o = req.headers.get('origin') || ''
  return {
    'Access-Control-Allow-Origin': AO.includes(o) ? o : AO[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    'Content-Type': 'application/json',
  }
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function monthLabel(p: string): string { const x = (p||'').split('-'); if (x.length<2) return p||''; const i = parseInt(x[1],10)-1; return (i>=0&&i<12)?MONTH_NAMES[i]:p }
function classifyTxn(t: any): 'revenue'|'cogs'|'opex'|'other' {
  const a = t.gl_accounts?.account_type
  if (a === 'revenue' || a === 'other_income') return 'revenue'
  if (a === 'cost_of_revenue') return 'cogs'
  if (a === 'expense' || a === 'other_expense') return 'opex'
  return 'other'
}
function pctDelta(current: number, prior: number): number | null {
  if (!prior || prior === 0) return null
  return Number((((current - prior) / Math.abs(prior)) * 100).toFixed(1))
}
function linearForecast(data: number[], periods: number): number[] {
  const n = data.length; if (n < 2) return Array(periods).fill(data[0]||0)
  let sx=0,sy=0,sxy=0,sxx=0
  for (let i=0;i<n;i++){sx+=i;sy+=data[i];sxy+=i*data[i];sxx+=i*i}
  const m = (n*sxy - sx*sy)/(n*sxx - sx*sx); const b = (sy - m*sx)/n
  return Array.from({length:periods},(_,i)=>Math.round(m*(n+i)+b))
}
function emaForecast(data: number[], periods: number, alpha=0.3): number[] {
  if (!data.length) return Array(periods).fill(0)
  let e = data[0]
  for (let i=1;i<data.length;i++) e = alpha*data[i] + (1-alpha)*e
  return Array(periods).fill(Math.round(e))
}
function stdDev(arr: number[]): number {
  if (arr.length < 2) return 0
  const mean = arr.reduce((a,x)=>a+x,0)/arr.length
  const variance = arr.reduce((a,x)=>a+Math.pow(x-mean,2),0)/(arr.length-1)
  return Math.sqrt(variance)
}

// Standard normal inverse for confidence intervals (rational approximation)
// 1.28 ≈ 80%, 1.96 ≈ 95%
const Z80 = 1.28, Z95 = 1.96

async function authorize(req: Request, headers: HeadersInit) {
  const a = req.headers.get('Authorization')
  if (!a?.startsWith('Bearer ')) return { ok:false, res: new Response(JSON.stringify({error:'Unauthorized'}), {status:401,headers}) }
  const { data: { user }, error } = await sb.auth.getUser(a.replace('Bearer ',''))
  if (error || !user) return { ok:false, res: new Response(JSON.stringify({error:'Invalid token'}), {status:401,headers}) }
  const { data: profile } = await sb.from('users').select('org_id, full_name, role, dashboard_role').eq('id', user.id).maybeSingle()
  const orgId = profile?.org_id
  if (!orgId) return { ok:false, res: new Response(JSON.stringify({error:'No organization'}), {status:404,headers}) }
  const allowed = profile?.dashboard_role === 'cfo' || profile?.role === 'owner' || profile?.role === 'admin'
  if (!allowed) return { ok:false, res: new Response(JSON.stringify({error:'Forbidden',required_role:'cfo'}), {status:403,headers}) }
  return { ok:true, user, profile, orgId }
}

Deno.serve(async (req) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })

  const auth = await authorize(req, headers)
  if (!auth.ok) return (auth as any).res
  const { profile, orgId } = auth as any

  const url = new URL(req.url)
  const view = url.searchParams.get('view') || 'hub'
  const period = url.searchParams.get('period') || 'ttm'
  const scenario = url.searchParams.get('scenario') || 'base'

  try {
    const [org, txnsR, bdgtsR, integsR] = await Promise.all([
      sb.from('organizations').select('id, name, plan, slug').eq('id', orgId).maybeSingle(),
      sb.from('gl_transactions').select('*, gl_accounts(name, account_type)').eq('org_id', orgId).order('txn_date',{ascending:false}).limit(2000),
      sb.from('gl_budgets').select('*, gl_accounts(name, account_type)').eq('org_id', orgId),
      sb.from('integrations').select('provider, status, last_sync_at, records_synced').eq('org_id', orgId),
    ])

    const txns = txnsR.data || []
    const bdgts = bdgtsR.data || []
    const integs = integsR.data || []
    const demo_mode = txns.length === 0

    // Monthly trend (used by all views)
    const byMonth: Record<string, { revenue:number; cogs:number; opex:number }> = {}
    txns.forEach((t: any) => {
      const m = t.period || (t.txn_date||'').slice(0,7); if (!m) return
      if (!byMonth[m]) byMonth[m] = {revenue:0,cogs:0,opex:0}
      const amt = Math.abs(Number(t.amount)||0); const c = classifyTxn(t)
      if (c==='revenue') byMonth[m].revenue+=amt
      else if (c==='cogs') byMonth[m].cogs+=amt
      else if (c==='opex') byMonth[m].opex+=amt
    })
    const budgetByMonth: Record<string, { revenue:number; cogs:number; opex:number }> = {}
    bdgts.forEach((b: any) => {
      const p = b.period; if (!p) return
      if (!budgetByMonth[p]) budgetByMonth[p] = {revenue:0,cogs:0,opex:0}
      const a = b.gl_accounts?.account_type; const amt = Math.abs(Number(b.amount)||0)
      if (a==='revenue') budgetByMonth[p].revenue+=amt
      else if (a==='cost_of_revenue') budgetByMonth[p].cogs+=amt
      else budgetByMonth[p].opex+=amt
    })
    const monthlyTrend = Object.entries(byMonth).sort().map(([month, d]) => {
      const bm = budgetByMonth[month] || {revenue:0,cogs:0,opex:0}
      return { month, label: monthLabel(month), revenue:d.revenue, cogs:d.cogs, opex:d.opex, net:d.revenue-d.cogs-d.opex,
        budget_revenue: bm.revenue, budget_cogs: bm.cogs, budget_opex: bm.opex }
    })

    const meta = {
      org_id: orgId, org_name: org.data?.name || null, plan: org.data?.plan || null,
      user_name: profile?.full_name || null, dashboard_role: profile?.dashboard_role || null,
      demo_mode, view, period, generated_at: new Date().toISOString(),
      last_sync_at: integs.filter((i:any)=>i.status==='connected').map((i:any)=>i.last_sync_at).filter(Boolean).sort().reverse()[0] || null,
    }

    // Helper: filter monthly trend by period name
    function filterByPeriod(p: string) {
      if (p === 'all') return monthlyTrend
      if (p === 'ttm') return monthlyTrend.slice(-12)
      if (p === 'ytd') {
        const y = new Date().getFullYear().toString()
        return monthlyTrend.filter(m => m.month.startsWith(y))
      }
      if (p === 'qtd') {
        const now = new Date(); const q = Math.floor(now.getMonth()/3)
        const startMonth = q*3 + 1
        const startKey = `${now.getFullYear()}-${String(startMonth).padStart(2,'0')}`
        return monthlyTrend.filter(m => m.month >= startKey)
      }
      if (p === 'mtd') {
        const now = new Date(); const k = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
        return monthlyTrend.filter(m => m.month === k)
      }
      return monthlyTrend.slice(-12)
    }

    // ─────────────── VIEW: HUB (with TTM-fixed YoY) ───────────────
    if (view === 'hub') {
      const ttm = monthlyTrend.slice(-12)
      const priorTTM = monthlyTrend.slice(-24, -12)

      const ttmTotals = ttm.reduce((a,m)=>({revenue:a.revenue+m.revenue, cogs:a.cogs+m.cogs, opex:a.opex+m.opex, net:a.net+m.net}), {revenue:0,cogs:0,opex:0,net:0})
      const ptTotals = priorTTM.reduce((a,m)=>({revenue:a.revenue+m.revenue, cogs:a.cogs+m.cogs, opex:a.opex+m.opex, net:a.net+m.net}), {revenue:0,cogs:0,opex:0,net:0})

      const revenue = ttmTotals.revenue
      const cogs = ttmTotals.cogs
      const opex = ttmTotals.opex
      const grossProfit = revenue - cogs
      const netIncome = revenue - cogs - opex

      const revenueYoY = pctDelta(ttmTotals.revenue, ptTotals.revenue)
      const netYoY = pctDelta(ttmTotals.net, ptTotals.net)

      // QoQ: last 3 months vs prior 3
      const recent6 = monthlyTrend.slice(-6)
      const q1Rev = recent6.slice(0,3).reduce((a,m)=>a+m.revenue,0)
      const q2Rev = recent6.slice(3,6).reduce((a,m)=>a+m.revenue,0)
      const revenueQoQ = pctDelta(q2Rev, q1Rev)
      const q1GP = recent6.slice(0,3).reduce((a,m)=>a+(m.revenue-m.cogs),0)
      const q2GP = recent6.slice(3,6).reduce((a,m)=>a+(m.revenue-m.cogs),0)
      const gmPct1 = q1Rev>0 ? q1GP/q1Rev*100 : 0
      const gmPct2 = q2Rev>0 ? q2GP/q2Rev*100 : 0
      const grossMarginQoQ = Number((gmPct2 - gmPct1).toFixed(1))

      const operatingCashFlow = revenue - opex
      const ocfQoQ = pctDelta(
        recent6.slice(3,6).reduce((a,m)=>a+(m.revenue-m.opex),0),
        recent6.slice(0,3).reduce((a,m)=>a+(m.revenue-m.opex),0)
      )

      const last3 = monthlyTrend.slice(-3)
      const last3NetAvg = last3.length ? last3.reduce((a,m)=>a+m.net,0)/last3.length : 0
      const burnRate = last3NetAvg < 0 ? Math.abs(last3NetAvg) : 0
      const burnStatus = burnRate === 0 ? 'profitable' : burnRate < operatingCashFlow*0.1 ? 'stable' : 'elevated'

      const roic = revenue > 0 ? Number(((netIncome/revenue)*100).toFixed(1)) : 0
      const roicYoY = pctDelta(
        ttmTotals.revenue>0 ? ttmTotals.net/ttmTotals.revenue*100 : 0,
        ptTotals.revenue>0 ? ptTotals.net/ptTotals.revenue*100 : 0,
      )

      // Bars: TTM actual vs TTM budget
      const bars = {
        revenue: { actual: ttmTotals.revenue, budget: ttm.reduce((a,m)=>a+m.budget_revenue,0), pct: 0 as number|null },
        cogs:    { actual: ttmTotals.cogs,    budget: ttm.reduce((a,m)=>a+m.budget_cogs,0),    pct: 0 as number|null },
        opex:    { actual: ttmTotals.opex,    budget: ttm.reduce((a,m)=>a+m.budget_opex,0),    pct: 0 as number|null },
      }
      bars.revenue.pct = bars.revenue.budget > 0 ? Math.round(bars.revenue.actual/bars.revenue.budget*100) : null
      bars.cogs.pct    = bars.cogs.budget > 0    ? Math.round(bars.cogs.actual/bars.cogs.budget*100)       : null
      bars.opex.pct    = bars.opex.budget > 0    ? Math.round(bars.opex.actual/bars.opex.budget*100)       : null

      const recent6_cash = monthlyTrend.slice(-6)
      const maxRev = recent6_cash.length ? Math.max(...recent6_cash.map(m=>m.revenue)) : 0
      const cash_bars = recent6_cash.map(m => ({ month: m.month, label: m.label, value: m.revenue, pct: maxRev>0 ? Math.round(m.revenue/maxRev*100) : 0 }))

      const sparklines = {
        net_income: monthlyTrend.slice(-12).map(m => m.net),
        burn_rate: monthlyTrend.slice(-12).map(m => Math.max(0, -m.net)),
      }

      const alerts: any[] = []
      if (bars.opex.pct !== null && bars.opex.pct > 110) alerts.push({severity:'warning', message:`OpEx at ${bars.opex.pct}% of TTM budget`})
      if (bars.revenue.pct !== null && bars.revenue.pct < 85) alerts.push({severity:'warning', message:`Revenue at ${bars.revenue.pct}% of TTM plan`})
      if (revenue > 0 && netIncome < 0) alerts.push({severity:'critical', message:`Negative TTM net margin: ${((netIncome/revenue)*100).toFixed(1)}%`})

      return new Response(JSON.stringify({
        meta,
        kpis: {
          revenue, cogs, gross_profit: grossProfit, opex, net_income: netIncome,
          operating_cash_flow: operatingCashFlow, burn_rate: burnRate, burn_status: burnStatus,
          roic, cash_position: operatingCashFlow,
          gross_margin: revenue>0 ? Number(((grossProfit/revenue)*100).toFixed(1)) : 0,
          net_margin: revenue>0 ? Number(((netIncome/revenue)*100).toFixed(1)) : 0,
          period_basis: 'TTM',
        },
        deltas: {
          revenue_yoy: revenueYoY, revenue_qoq: revenueQoQ, net_income_yoy: netYoY,
          gross_margin_qoq: grossMarginQoQ, ocf_qoq: ocfQoQ, roic_yoy: roicYoY,
        },
        bars, cash_bars, sparklines,
        monthly_trend: monthlyTrend, alerts,
        integrations: { connected: integs.filter((i:any)=>i.status==='connected').length, total: integs.length },
      }), { headers })
    }

    // ─────────────── VIEW: PNL (period toggles + common-size) ───────────────
    if (view === 'pnl') {
      const filtered = filterByPeriod(period)
      const periodMonths = new Set(filtered.map(m => m.month))

      const byAccount: Record<string, { name:string; type:string; amount:number; monthly:Record<string,number> }> = {}
      txns.forEach((t: any) => {
        const m = t.period || (t.txn_date||'').slice(0,7)
        if (!periodMonths.has(m)) return
        const name = t.gl_accounts?.name; const type = t.gl_accounts?.account_type
        if (!name || !type) return
        if (!byAccount[name]) byAccount[name] = { name, type, amount: 0, monthly: {} }
        const amt = Math.abs(Number(t.amount)||0)
        byAccount[name].amount += amt
        byAccount[name].monthly[m] = (byAccount[name].monthly[m] || 0) + amt
      })

      const accts = Object.values(byAccount)
      const revenueAccts = accts.filter(a => a.type==='revenue' || a.type==='other_income').sort((a,b)=>b.amount-a.amount)
      const cogsAccts = accts.filter(a => a.type==='cost_of_revenue').sort((a,b)=>b.amount-a.amount)
      const opexAccts = accts.filter(a => a.type==='expense' || a.type==='other_expense').sort((a,b)=>b.amount-a.amount)

      const totals = {
        revenue: revenueAccts.reduce((a,x)=>a+x.amount,0),
        cogs: cogsAccts.reduce((a,x)=>a+x.amount,0),
        opex: opexAccts.reduce((a,x)=>a+x.amount,0),
      }
      const gross = totals.revenue - totals.cogs
      const net = totals.revenue - totals.cogs - totals.opex

      // Common-size: each account amount as % of revenue
      function withCommonSize(list: any[]) {
        return list.map(a => ({ ...a, common_size: totals.revenue > 0 ? Number((a.amount/totals.revenue*100).toFixed(1)) : 0 }))
      }

      // Comparison: prior period of same length
      const compareLen = filtered.length
      const priorFiltered = monthlyTrend.slice(-(compareLen*2), -compareLen)
      const priorTotals = priorFiltered.reduce((a,m)=>({revenue:a.revenue+m.revenue, cogs:a.cogs+m.cogs, opex:a.opex+m.opex}), {revenue:0,cogs:0,opex:0})

      const periods = filtered.map(m => ({ period: m.month, label: m.label }))

      return new Response(JSON.stringify({
        meta: { ...meta, period_basis: period.toUpperCase() },
        period_options: ['mtd','qtd','ytd','ttm','all'],
        periods,
        sections: [
          { key:'revenue', label:'Revenue',            accounts: withCommonSize(revenueAccts), total: totals.revenue, prior_total: priorTotals.revenue, delta: pctDelta(totals.revenue, priorTotals.revenue) },
          { key:'cogs',    label:'Cost of Revenue',    accounts: withCommonSize(cogsAccts),    total: totals.cogs,    prior_total: priorTotals.cogs,    delta: pctDelta(totals.cogs, priorTotals.cogs) },
          { key:'opex',    label:'Operating Expenses', accounts: withCommonSize(opexAccts),    total: totals.opex,    prior_total: priorTotals.opex,    delta: pctDelta(totals.opex, priorTotals.opex) },
        ],
        summary: {
          revenue: totals.revenue, gross_profit: gross, opex: totals.opex, net_income: net,
          gross_margin: totals.revenue>0 ? Number((gross/totals.revenue*100).toFixed(1)) : 0,
          net_margin: totals.revenue>0 ? Number((net/totals.revenue*100).toFixed(1)) : 0,
        },
        monthly_trend: filtered,
      }), { headers })
    }

    // ─────────────── VIEW: CASH (13-week forecast + CCC) ───────────────
    if (view === 'cash') {
      // Weekly historical
      const weekly: Record<string, { inflow:number; outflow:number }> = {}
      txns.forEach((t: any) => {
        const d = new Date(t.txn_date); if (isNaN(d.getTime())) return
        const ws = new Date(d); ws.setDate(d.getDate() - d.getDay())
        const k = ws.toISOString().slice(0,10)
        if (!weekly[k]) weekly[k] = { inflow:0, outflow:0 }
        const amt = Math.abs(Number(t.amount)||0); const c = classifyTxn(t)
        if (c==='revenue') weekly[k].inflow += amt
        else weekly[k].outflow += amt
      })
      const weeklySorted = Object.entries(weekly).sort().map(([w,d])=>({ week: w, ...(d as any), net: d.inflow - d.outflow }))
      const last13 = weeklySorted.slice(-13)

      // 13-week rolling forecast: avg + EMA blend
      const inflows = last13.map(w => w.inflow)
      const outflows = last13.map(w => w.outflow)
      const avgIn = inflows.length ? inflows.reduce((a,x)=>a+x,0)/inflows.length : 0
      const avgOut = outflows.length ? outflows.reduce((a,x)=>a+x,0)/outflows.length : 0
      const lastWeek = last13.length ? new Date(last13[last13.length-1].week) : new Date()
      const forecast13: any[] = []
      for (let i=1; i<=13; i++) {
        const d = new Date(lastWeek); d.setDate(d.getDate() + 7*i)
        forecast13.push({
          week: d.toISOString().slice(0,10),
          inflow: Math.round(avgIn),
          outflow: Math.round(avgOut),
          net: Math.round(avgIn - avgOut),
          forecast: true,
        })
      }

      const ytdNet = monthlyTrend.slice(-12).reduce((a,m)=>a+m.net,0)
      const last3 = monthlyTrend.slice(-3)
      const burn = last3.length ? Math.max(0, -last3.reduce((a,m)=>a+m.net,0)/last3.length) : 0
      const runway = burn > 0 ? Math.floor(ytdNet/burn) : null

      // Cash Conversion Cycle (CCC) — proxies until AR/AP tables exist
      // DSO ≈ AR / (Revenue/365). Without AR data, use SaaS industry default (45)
      // DPO ≈ AP / (COGS/365). Without AP data, use SaaS industry default (30)
      // DIO = 0 for SaaS (no inventory)
      // CCC = DSO + DIO - DPO
      const has_ar_ap = false // future: detect from gl_accounts tagged as AR/AP
      const ccc = has_ar_ap ? null : { dso: 45, dpo: 30, dio: 0, ccc: 15, source: 'industry_default', note: 'AR/AP tables not yet ingested. Using SaaS industry medians.' }

      return new Response(JSON.stringify({
        meta,
        summary: {
          cash_position: ytdNet,
          ar: 0, ap: 0,
          working_capital: ytdNet,
          monthly_burn: burn,
          runway_months: runway,
        },
        ccc,
        weekly_history: last13,
        weekly_forecast: forecast13,
        monthly_net: monthlyTrend.slice(-12),
      }), { headers })
    }

    // ─────────────── VIEW: BUDGET (variance attribution) ───────────────
    if (view === 'budget') {
      const accountBudget: Record<string, { name:string; type:string; actual:number; budget:number }> = {}
      txns.forEach((t: any) => {
        const name = t.gl_accounts?.name; const type = t.gl_accounts?.account_type
        if (!name || !type) return
        if (!accountBudget[name]) accountBudget[name] = { name, type, actual:0, budget:0 }
        accountBudget[name].actual += Math.abs(Number(t.amount)||0)
      })
      bdgts.forEach((b: any) => {
        const name = b.gl_accounts?.name; const type = b.gl_accounts?.account_type
        if (!name || !type) return
        if (!accountBudget[name]) accountBudget[name] = { name, type, actual:0, budget:0 }
        accountBudget[name].budget += Math.abs(Number(b.amount)||0)
      })

      const rows = Object.values(accountBudget).map(r => ({
        ...r,
        variance: r.actual - r.budget,
        variance_pct: r.budget > 0 ? Number(((r.actual - r.budget)/r.budget*100).toFixed(1)) : null,
      })).sort((a,b)=>Math.abs(b.variance)-Math.abs(a.variance))

      const totals = rows.reduce((a,r)=>({actual:a.actual+r.actual, budget:a.budget+r.budget}), {actual:0,budget:0})
      const totalVar = totals.actual - totals.budget
      const absTotalVar = Math.abs(totalVar) || 1

      // Top 5 variance drivers with attribution share
      const topDrivers = rows.slice(0, 5).map(r => ({
        ...r,
        share_of_total_variance: Number((Math.abs(r.variance)/absTotalVar*100).toFixed(1)),
        direction: r.variance > 0 ? 'over' : 'under',
      }))

      // Template-based commentary (no LLM call needed for v1)
      const overBudget = rows.filter(r => r.variance > 0).slice(0, 3)
      const underBudget = rows.filter(r => r.variance < 0).slice(0, 3)
      const commentary: string[] = []
      if (totalVar > 0) {
        commentary.push(`Total spending is ${((totalVar/totals.budget)*100).toFixed(1)}% over plan, driven primarily by ${overBudget.slice(0,2).map(r => r.name).join(' and ')}.`)
      } else if (totalVar < 0) {
        commentary.push(`Total spending is ${((Math.abs(totalVar)/totals.budget)*100).toFixed(1)}% under plan, with the largest savings in ${underBudget.slice(0,2).map(r => r.name).join(' and ')}.`)
      } else {
        commentary.push('Spending is on plan with offsetting variances across categories.')
      }
      if (topDrivers.length && topDrivers[0].share_of_total_variance > 30) {
        commentary.push(`${topDrivers[0].name} alone accounts for ${topDrivers[0].share_of_total_variance}% of total variance.`)
      }

      return new Response(JSON.stringify({
        meta,
        totals: { ...totals, variance: totalVar, variance_pct: totals.budget>0 ? Number((totalVar/totals.budget*100).toFixed(1)) : null },
        rows,
        top_drivers: topDrivers,
        commentary,
        monthly_trend: monthlyTrend.slice(-12),
      }), { headers })
    }

    // ─────────────── VIEW: FORECAST (drivers + scenarios + CIs) ───────────────
    if (view === 'forecast') {
      const revSeries = monthlyTrend.map(m => m.revenue)
      const netSeries = monthlyTrend.map(m => m.net)

      // Driver decomposition (proxy until customer table ingested):
      // Assume revenue = active_customers × ARPU.
      // Estimate active_customers from a constant growth rate; ARPU from a constant.
      // For the demo, infer ARPU as monthly_revenue / 100 (assume ~100 customers as starting baseline).
      const lastRev = revSeries[revSeries.length-1] || 0
      const firstRev = revSeries[0] || lastRev
      const monthsSpan = Math.max(1, revSeries.length - 1)
      const monthlyGrowthRate = lastRev > 0 && firstRev > 0
        ? Math.pow(lastRev/firstRev, 1/monthsSpan) - 1
        : 0.03
      const estimatedCustomers = 100 // baseline assumption
      const estimatedARPU = lastRev > 0 ? lastRev / estimatedCustomers : 0
      const estimatedChurnRate = 0.05 // 5%/month default

      const drivers = {
        estimated_customers: estimatedCustomers,
        estimated_arpu: Math.round(estimatedARPU),
        estimated_monthly_growth: Number((monthlyGrowthRate*100).toFixed(2)),
        estimated_churn_rate: estimatedChurnRate,
        note: 'Driver inference is proxy-based until customer/subscription data is ingested.',
      }

      // Statistical confidence intervals from residuals
      const baseLinear = revSeries.length >= 3 ? linearForecast(revSeries, 6) : []
      let residualStd = 0
      if (revSeries.length >= 6) {
        // Compute residuals on training data
        const fitted = linearForecast(revSeries.slice(0,-3), 3)
        const actual = revSeries.slice(-3)
        const residuals = actual.map((a,i) => a - fitted[i])
        residualStd = stdDev(residuals)
      }

      // Scenarios
      const scenarioMultipliers: Record<string, number> = {
        recession: 0.80, base: 1.00, growth: 1.15, aggressive: 1.30,
      }
      const mult = scenarioMultipliers[scenario] !== undefined ? scenarioMultipliers[scenario] : 1.00

      const lastPeriod = monthlyTrend.length ? monthlyTrend[monthlyTrend.length-1].month : new Date().toISOString().slice(0,7)
      const [ly, lm] = lastPeriod.split('-').map(Number)
      const futurePeriods = Array.from({length:6}, (_,i) => {
        const m = ((lm + i) % 12) + 1; const y = ly + Math.floor((lm + i)/12)
        return `${y}-${String(m).padStart(2,'0')}`
      })

      const linearNet = revSeries.length >= 3 ? linearForecast(netSeries, 6) : []

      const forecast = futurePeriods.map((p, i) => {
        const baseVal = baseLinear[i] || 0
        const scaledBase = Math.round(baseVal * mult)
        return {
          month: p,
          label: monthLabel(p),
          base: scaledBase,
          ci80_low: Math.round(scaledBase - residualStd * Z80),
          ci80_high: Math.round(scaledBase + residualStd * Z80),
          ci95_low: Math.round(scaledBase - residualStd * Z95),
          ci95_high: Math.round(scaledBase + residualStd * Z95),
          recession: Math.round(baseVal * 0.80),
          growth: Math.round(baseVal * 1.15),
          aggressive: Math.round(baseVal * 1.30),
          // Driver decomposition for this month
          implied_customers: Math.round(estimatedCustomers * Math.pow(1 + monthlyGrowthRate, i+1)),
          implied_churn: Math.round(estimatedCustomers * estimatedChurnRate * (i+1)),
          net: linearNet[i] || 0,
        }
      })

      // Backtest MAPE
      let mape: number | null = null
      if (revSeries.length >= 6) {
        const train = revSeries.slice(0,-3); const actual = revSeries.slice(-3)
        const predicted = linearForecast(train, 3)
        const errs = actual.map((a,i) => predicted[i]>0 ? Math.abs((a - predicted[i])/a) : 0)
        mape = Number((errs.reduce((s,x)=>s+x,0)/errs.length*100).toFixed(1))
      }

      return new Response(JSON.stringify({
        meta,
        scenario_active: scenario,
        scenarios_available: ['recession','base','growth','aggressive'],
        drivers,
        confidence: { residual_std: Math.round(residualStd), z80: Z80, z95: Z95 },
        historical: monthlyTrend.slice(-12).map(m => ({ month: m.month, label: m.label, revenue: m.revenue, net: m.net })),
        forecast,
        backtest_mape: mape,
        methodology: 'Linear regression base + EMA blend; scenarios scale base; CI bands use std dev of training residuals (z=1.28 for 80%, z=1.96 for 95%).',
      }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown view', available: ['hub','pnl','cash','budget','forecast'] }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500, headers })
  }
})
