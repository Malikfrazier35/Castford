// supabase/functions/cfo-command-center/index.ts
// v2 — Extended KPIs (OCF, ROIC proxy, burn, YoY, QoQ) + subpage views.
//
// Views:
//   ?view=hub       (default) — dashboard hub KPIs, P&L bars, cash bars, alerts
//   ?view=pnl       — detailed P&L by account, month-by-month drill-down
//   ?view=cash      — cash position, AR, AP, runway calc
//   ?view=budget    — budget vs actual variance grid
//   ?view=forecast  — forecast with linear/EMA projections + scenarios

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const AO = [
  'https://castford.com',
  'https://www.castford.com',
  'https://castford.vercel.app',
  'http://localhost:3000',
]

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
function monthLabel(period: string): string {
  const parts = (period || '').split('-')
  if (parts.length < 2) return period || ''
  const idx = parseInt(parts[1], 10) - 1
  return (idx >= 0 && idx < 12) ? MONTH_NAMES[idx] : period
}

function linearForecast(data: number[], periods: number): number[] {
  const n = data.length
  if (n < 2) return Array(periods).fill(data[0] || 0)
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  for (let i = 0; i < n; i++) {
    sumX += i; sumY += data[i]; sumXY += i * data[i]; sumX2 += i * i
  }
  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const b = (sumY - m * sumX) / n
  return Array.from({ length: periods }, (_, i) => Math.round(m * (n + i) + b))
}

function emaForecast(data: number[], periods: number, alpha = 0.3): number[] {
  if (!data.length) return Array(periods).fill(0)
  let ema = data[0]
  for (let i = 1; i < data.length; i++) ema = alpha * data[i] + (1 - alpha) * ema
  return Array(periods).fill(Math.round(ema))
}

function pctDelta(current: number, prior: number): number | null {
  if (!prior || prior === 0) return null
  return Number((((current - prior) / Math.abs(prior)) * 100).toFixed(1))
}

function classifyTxn(t: any): 'revenue' | 'cogs' | 'opex' | 'other' {
  const atype = t.gl_accounts?.account_type
  if (atype === 'revenue' || atype === 'other_income') return 'revenue'
  if (atype === 'cost_of_revenue') return 'cogs'
  if (atype === 'expense' || atype === 'other_expense') return 'opex'
  return 'other'
}

// ── Authentication + role gate ──
async function authorize(req: Request, headers: HeadersInit) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { ok: false, res: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers }) }
  }
  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) {
    return { ok: false, res: new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers }) }
  }
  const { data: profile } = await sb
    .from('users')
    .select('org_id, full_name, role, dashboard_role')
    .eq('id', user.id)
    .maybeSingle()
  const orgId = profile?.org_id
  if (!orgId) {
    return { ok: false, res: new Response(JSON.stringify({ error: 'No organization' }), { status: 404, headers }) }
  }
  const hasAccess = profile?.dashboard_role === 'cfo' || profile?.role === 'owner' || profile?.role === 'admin'
  if (!hasAccess) {
    return { ok: false, res: new Response(JSON.stringify({ error: 'Forbidden', required_role: 'cfo' }), { status: 403, headers }) }
  }
  return { ok: true, user, profile, orgId }
}

Deno.serve(async (req) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })

  const auth = await authorize(req, headers)
  if (!auth.ok) return (auth as any).res
  const { profile, orgId } = auth as any

  const url = new URL(req.url)
  const view = url.searchParams.get('view') || 'hub'

  try {
    // ── Shared: fetch base datasets ──
    const [org, transactions, budgets, integrations] = await Promise.all([
      sb.from('organizations').select('id, name, plan, slug').eq('id', orgId).maybeSingle(),
      sb.from('gl_transactions')
        .select('*, gl_accounts(name, account_type)')
        .eq('org_id', orgId)
        .order('txn_date', { ascending: false })
        .limit(2000),
      sb.from('gl_budgets').select('*, gl_accounts(name, account_type)').eq('org_id', orgId),
      sb.from('integrations').select('provider, status, last_sync_at, records_synced').eq('org_id', orgId),
    ])

    const txns = transactions.data || []
    const bdgts = budgets.data || []
    const integs = integrations.data || []
    const demo_mode = txns.length === 0

    // ── Monthly aggregation (used by all views) ──
    const byMonth: Record<string, { revenue: number; cogs: number; opex: number }> = {}
    txns.forEach((t: any) => {
      const month = t.period || (t.txn_date || '').slice(0, 7)
      if (!month) return
      if (!byMonth[month]) byMonth[month] = { revenue: 0, cogs: 0, opex: 0 }
      const amt = Math.abs(Number(t.amount) || 0)
      const c = classifyTxn(t)
      if (c === 'revenue') byMonth[month].revenue += amt
      else if (c === 'cogs') byMonth[month].cogs += amt
      else if (c === 'opex') byMonth[month].opex += amt
    })

    const budgetByMonth: Record<string, { revenue: number; cogs: number; opex: number }> = {}
    bdgts.forEach((b: any) => {
      const p = b.period
      if (!p) return
      if (!budgetByMonth[p]) budgetByMonth[p] = { revenue: 0, cogs: 0, opex: 0 }
      const atype = b.gl_accounts?.account_type
      const amt = Math.abs(Number(b.amount) || 0)
      if (atype === 'revenue') budgetByMonth[p].revenue += amt
      else if (atype === 'cost_of_revenue') budgetByMonth[p].cogs += amt
      else budgetByMonth[p].opex += amt
    })

    const monthlyTrend = Object.entries(byMonth).sort().map(([month, d]) => {
      const bm = budgetByMonth[month] || { revenue: 0, cogs: 0, opex: 0 }
      return {
        month,
        label: monthLabel(month),
        revenue: d.revenue,
        cogs: d.cogs,
        opex: d.opex,
        net: d.revenue - d.cogs - d.opex,
        budget_revenue: bm.revenue,
        budget_cogs: bm.cogs,
        budget_opex: bm.opex,
      }
    })

    const meta = {
      org_id: orgId,
      org_name: org.data?.name || null,
      plan: org.data?.plan || null,
      user_name: profile?.full_name || null,
      dashboard_role: profile?.dashboard_role || null,
      demo_mode,
      view,
      generated_at: new Date().toISOString(),
      last_sync_at: integs
        .filter((i: any) => i.status === 'connected')
        .map((i: any) => i.last_sync_at)
        .filter(Boolean)
        .sort()
        .reverse()[0] || null,
    }

    // ──────────────────── VIEW: HUB ────────────────────
    if (view === 'hub') {
      let revenue = 0, cogs = 0, opex = 0
      txns.forEach((t: any) => {
        const amt = Math.abs(Number(t.amount) || 0)
        const c = classifyTxn(t)
        if (c === 'revenue') revenue += amt
        else if (c === 'cogs') cogs += amt
        else if (c === 'opex') opex += amt
      })
      const grossProfit = revenue - cogs
      const netIncome = revenue - cogs - opex

      // YoY: current TTM vs prior TTM
      const now = new Date()
      const currentYearStart = new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 7)
      const priorYearStart = new Date(now.getFullYear() - 1, 0, 1).toISOString().slice(0, 7)
      const priorYearEnd = new Date(now.getFullYear() - 1, 11, 1).toISOString().slice(0, 7)

      const ytd = monthlyTrend.filter(m => m.month >= currentYearStart)
      const ly = monthlyTrend.filter(m => m.month >= priorYearStart && m.month <= priorYearEnd)

      const ytdTotals = ytd.reduce((a, m) => ({ revenue: a.revenue + m.revenue, net: a.net + m.net }), { revenue: 0, net: 0 })
      const lyTotals = ly.reduce((a, m) => ({ revenue: a.revenue + m.revenue, net: a.net + m.net }), { revenue: 0, net: 0 })

      const revenueYoY = pctDelta(ytdTotals.revenue, lyTotals.revenue)
      const netYoY = pctDelta(ytdTotals.net, lyTotals.net)

      // QoQ: last 3 months vs prior 3 months
      const recent6 = monthlyTrend.slice(-6)
      const q1 = recent6.slice(0, 3).reduce((a, m) => a + m.revenue, 0)
      const q2 = recent6.slice(3, 6).reduce((a, m) => a + m.revenue, 0)
      const revenueQoQ = pctDelta(q2, q1)

      // Gross margin QoQ (in percentage points, not %)
      const gm2 = recent6.slice(3, 6).reduce((a, m) => a + (m.revenue - m.cogs), 0)
      const gmPct2 = q2 > 0 ? gm2 / q2 * 100 : 0
      const gm1 = recent6.slice(0, 3).reduce((a, m) => a + (m.revenue - m.cogs), 0)
      const gmPct1 = q1 > 0 ? gm1 / q1 * 100 : 0
      const grossMarginQoQ = Number((gmPct2 - gmPct1).toFixed(1))

      // Operating Cash Flow — simplified: revenue inflows minus operating outflows (non-accrual)
      const operatingCashFlow = revenue - opex // excludes cogs since COGS ≈ paid when matched; refine when accruals tracked
      const ocfQoQ = pctDelta(
        recent6.slice(3, 6).reduce((a, m) => a + (m.revenue - m.opex), 0),
        recent6.slice(0, 3).reduce((a, m) => a + (m.revenue - m.opex), 0),
      )

      // Burn rate — avg monthly net outflow over last 3 months; 0 if profitable
      const last3 = monthlyTrend.slice(-3)
      const last3NetAvg = last3.length ? last3.reduce((a, m) => a + m.net, 0) / last3.length : 0
      const burnRate = last3NetAvg < 0 ? Math.abs(last3NetAvg) : 0
      const burnStatus = burnRate === 0 ? 'profitable' : burnRate < operatingCashFlow * 0.1 ? 'stable' : 'elevated'

      // ROIC proxy — until balance sheet arrives, use net margin as approximation
      const roic = revenue > 0 ? Number(((netIncome / revenue) * 100).toFixed(1)) : 0
      const roicYoY = pctDelta(
        lyTotals.revenue > 0 ? lyTotals.net / lyTotals.revenue * 100 : 0,
        ytdTotals.revenue > 0 ? ytdTotals.net / ytdTotals.revenue * 100 : 0,
      )

      // P&L bar totals
      const ytdAgg = monthlyTrend.slice(-12).reduce(
        (acc, m) => {
          acc.revenue += m.revenue
          acc.cogs += m.cogs
          acc.opex += m.opex
          acc.budget_revenue += m.budget_revenue
          acc.budget_cogs += m.budget_cogs
          acc.budget_opex += m.budget_opex
          return acc
        },
        { revenue: 0, cogs: 0, opex: 0, budget_revenue: 0, budget_cogs: 0, budget_opex: 0 }
      )

      const bars = {
        revenue: { actual: ytdAgg.revenue, budget: ytdAgg.budget_revenue, pct: ytdAgg.budget_revenue > 0 ? Math.round(ytdAgg.revenue / ytdAgg.budget_revenue * 100) : null },
        cogs:    { actual: ytdAgg.cogs,    budget: ytdAgg.budget_cogs,    pct: ytdAgg.budget_cogs > 0    ? Math.round(ytdAgg.cogs / ytdAgg.budget_cogs * 100)       : null },
        opex:    { actual: ytdAgg.opex,    budget: ytdAgg.budget_opex,    pct: ytdAgg.budget_opex > 0    ? Math.round(ytdAgg.opex / ytdAgg.budget_opex * 100)       : null },
      }

      // Cash bars — last 6 months revenue normalized
      const recent6_cash = monthlyTrend.slice(-6)
      const maxRev = recent6_cash.length ? Math.max(...recent6_cash.map(m => m.revenue)) : 0
      const cash_bars = recent6_cash.map(m => ({ month: m.month, label: m.label, value: m.revenue, pct: maxRev > 0 ? Math.round(m.revenue / maxRev * 100) : 0 }))

      // Sparklines (for Net Income, Burn Rate cards)
      const sparklines = {
        net_income: monthlyTrend.slice(-12).map(m => m.net),
        burn_rate: monthlyTrend.slice(-12).map(m => Math.max(0, -m.net)),
      }

      // Alerts
      const alerts: any[] = []
      if (bars.opex.pct !== null && bars.opex.pct > 110) alerts.push({ severity: 'warning', message: `OpEx running ${bars.opex.pct}% of budget YTD` })
      if (bars.revenue.pct !== null && bars.revenue.pct < 85) alerts.push({ severity: 'warning', message: `Revenue at ${bars.revenue.pct}% of plan YTD` })
      if (revenue > 0 && netIncome < 0) alerts.push({ severity: 'critical', message: `Net margin negative: ${((netIncome / revenue) * 100).toFixed(1)}%` })
      if (burnRate > 0 && last3.length === 3) {
        const cashBuffer = ytdAgg.revenue - ytdAgg.cogs - ytdAgg.opex // rough proxy
        const runway = cashBuffer > 0 ? Math.floor(cashBuffer / burnRate) : 0
        if (runway < 12 && runway > 0) alerts.push({ severity: 'warning', message: `Est. runway: ${runway} months at current burn` })
      }

      return new Response(JSON.stringify({
        meta,
        kpis: {
          revenue,
          cogs,
          gross_profit: grossProfit,
          opex,
          net_income: netIncome,
          operating_cash_flow: operatingCashFlow,
          burn_rate: burnRate,
          burn_status: burnStatus,
          roic,
          cash_position: operatingCashFlow, // proxy until we ingest cash accounts
          gross_margin: revenue > 0 ? Number(((grossProfit / revenue) * 100).toFixed(1)) : 0,
          net_margin: revenue > 0 ? Number(((netIncome / revenue) * 100).toFixed(1)) : 0,
        },
        deltas: {
          revenue_yoy: revenueYoY,
          revenue_qoq: revenueQoQ,
          net_income_yoy: netYoY,
          gross_margin_qoq: grossMarginQoQ,
          ocf_qoq: ocfQoQ,
          roic_yoy: roicYoY,
        },
        bars,
        cash_bars,
        sparklines,
        monthly_trend: monthlyTrend,
        alerts,
        integrations: { connected: integs.filter((i: any) => i.status === 'connected').length, total: integs.length },
      }), { headers })
    }

    // ──────────────────── VIEW: PNL ────────────────────
    if (view === 'pnl') {
      const byAccount: Record<string, { name: string; type: string; amount: number; monthly: Record<string, number> }> = {}
      txns.forEach((t: any) => {
        const name = t.gl_accounts?.name
        const type = t.gl_accounts?.account_type
        if (!name || !type) return
        const month = t.period || (t.txn_date || '').slice(0, 7)
        if (!byAccount[name]) byAccount[name] = { name, type, amount: 0, monthly: {} }
        const amt = Math.abs(Number(t.amount) || 0)
        byAccount[name].amount += amt
        byAccount[name].monthly[month] = (byAccount[name].monthly[month] || 0) + amt
      })

      const accountList = Object.values(byAccount)
      const revenueAccts = accountList.filter(a => a.type === 'revenue' || a.type === 'other_income').sort((a, b) => b.amount - a.amount)
      const cogsAccts = accountList.filter(a => a.type === 'cost_of_revenue').sort((a, b) => b.amount - a.amount)
      const opexAccts = accountList.filter(a => a.type === 'expense' || a.type === 'other_expense').sort((a, b) => b.amount - a.amount)

      const periods = Array.from(new Set(txns.map((t: any) => t.period || (t.txn_date || '').slice(0, 7)).filter(Boolean))).sort().slice(-12) as string[]

      return new Response(JSON.stringify({
        meta,
        periods: periods.map(p => ({ period: p, label: monthLabel(p) })),
        sections: [
          { key: 'revenue', label: 'Revenue', accounts: revenueAccts, total: revenueAccts.reduce((a, x) => a + x.amount, 0) },
          { key: 'cogs',    label: 'Cost of Revenue', accounts: cogsAccts, total: cogsAccts.reduce((a, x) => a + x.amount, 0) },
          { key: 'opex',    label: 'Operating Expenses', accounts: opexAccts, total: opexAccts.reduce((a, x) => a + x.amount, 0) },
        ],
        monthly_trend: monthlyTrend.slice(-12),
      }), { headers })
    }

    // ──────────────────── VIEW: CASH ────────────────────
    if (view === 'cash') {
      // Weekly cash flow
      const weekly: Record<string, { inflow: number; outflow: number }> = {}
      txns.forEach((t: any) => {
        const d = new Date(t.txn_date)
        if (isNaN(d.getTime())) return
        const ws = new Date(d); ws.setDate(d.getDate() - d.getDay())
        const key = ws.toISOString().slice(0, 10)
        if (!weekly[key]) weekly[key] = { inflow: 0, outflow: 0 }
        const amt = Math.abs(Number(t.amount) || 0)
        const c = classifyTxn(t)
        if (c === 'revenue') weekly[key].inflow += amt
        else weekly[key].outflow += amt
      })
      const weeks = Object.entries(weekly).sort().map(([week, d]) => ({ week, ...d, net: d.inflow - d.outflow }))

      // AR / AP approximation (placeholder — refine when we have AR/AP tables)
      const ar = 0
      const ap = 0

      // Cash position (sum of revenue - all outflows YTD)
      const ytdNet = monthlyTrend.slice(-12).reduce((a, m) => a + m.net, 0)
      const last3 = monthlyTrend.slice(-3)
      const burn = last3.length ? Math.max(0, -last3.reduce((a, m) => a + m.net, 0) / last3.length) : 0
      const runwayMonths = burn > 0 ? Math.floor(ytdNet / burn) : null

      return new Response(JSON.stringify({
        meta,
        summary: {
          cash_position: ytdNet,
          ar,
          ap,
          working_capital: ytdNet + ar - ap,
          monthly_burn: burn,
          runway_months: runwayMonths,
        },
        weekly_cashflow: weeks.slice(-13), // last 13 weeks
        monthly_net: monthlyTrend.slice(-12),
      }), { headers })
    }

    // ──────────────────── VIEW: BUDGET ────────────────────
    if (view === 'budget') {
      // Group by account, actual vs budget across all periods
      const accountBudget: Record<string, { name: string; type: string; actual: number; budget: number }> = {}
      txns.forEach((t: any) => {
        const name = t.gl_accounts?.name
        const type = t.gl_accounts?.account_type
        if (!name || !type) return
        if (!accountBudget[name]) accountBudget[name] = { name, type, actual: 0, budget: 0 }
        accountBudget[name].actual += Math.abs(Number(t.amount) || 0)
      })
      bdgts.forEach((b: any) => {
        const name = b.gl_accounts?.name
        const type = b.gl_accounts?.account_type
        if (!name || !type) return
        if (!accountBudget[name]) accountBudget[name] = { name, type, actual: 0, budget: 0 }
        accountBudget[name].budget += Math.abs(Number(b.amount) || 0)
      })

      const rows = Object.values(accountBudget).map(r => ({
        ...r,
        variance: r.actual - r.budget,
        variance_pct: r.budget > 0 ? Number(((r.actual - r.budget) / r.budget * 100).toFixed(1)) : null,
      })).sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))

      const totals = rows.reduce((acc, r) => {
        acc.actual += r.actual; acc.budget += r.budget; return acc
      }, { actual: 0, budget: 0 })

      return new Response(JSON.stringify({
        meta,
        totals: {
          ...totals,
          variance: totals.actual - totals.budget,
          variance_pct: totals.budget > 0 ? Number(((totals.actual - totals.budget) / totals.budget * 100).toFixed(1)) : null,
        },
        rows,
        monthly_trend: monthlyTrend.slice(-12),
      }), { headers })
    }

    // ──────────────────── VIEW: FORECAST ────────────────────
    if (view === 'forecast') {
      const revSeries = monthlyTrend.map(m => m.revenue)
      const netSeries = monthlyTrend.map(m => m.net)

      const linearRev = monthlyTrend.length >= 3 ? linearForecast(revSeries, 6) : []
      const emaRev = monthlyTrend.length >= 3 ? emaForecast(revSeries, 6) : []
      const linearNet = monthlyTrend.length >= 3 ? linearForecast(netSeries, 6) : []

      const lastPeriod = monthlyTrend.length ? monthlyTrend[monthlyTrend.length - 1].month : new Date().toISOString().slice(0, 7)
      const [ly, lm] = lastPeriod.split('-').map(Number)

      const futurePeriods = Array.from({ length: 6 }, (_, i) => {
        const m = ((lm + i) % 12) + 1
        const y = ly + Math.floor((lm + i) / 12)
        return `${y}-${String(m).padStart(2, '0')}`
      })

      const forecast = futurePeriods.map((p, i) => ({
        month: p,
        label: monthLabel(p),
        base: linearRev[i] || 0,
        bull: Math.round((linearRev[i] || 0) * 1.15),
        bear: Math.round((linearRev[i] || 0) * 0.85),
        ema: emaRev[i] || 0,
        net: linearNet[i] || 0,
      }))

      // Backtest: fit first N-3 months, predict last 3, compare
      let mape = null
      if (monthlyTrend.length >= 6) {
        const train = revSeries.slice(0, -3)
        const actual = revSeries.slice(-3)
        const predicted = linearForecast(train, 3)
        const errors = actual.map((a, i) => predicted[i] > 0 ? Math.abs((a - predicted[i]) / a) : 0)
        mape = Number((errors.reduce((s, x) => s + x, 0) / errors.length * 100).toFixed(1))
      }

      return new Response(JSON.stringify({
        meta,
        historical: monthlyTrend.slice(-12).map(m => ({
          month: m.month, label: m.label, revenue: m.revenue, net: m.net,
        })),
        forecast,
        backtest_mape: mape,
        methodology: 'Linear regression + EMA blend; bull/bear scenarios at ±15%',
      }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown view', available: ['hub', 'pnl', 'cash', 'budget', 'forecast'] }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error', stack: err?.stack }), { status: 500, headers })
  }
})
