// supabase/functions/cfo-command-center/index.ts
// v1 — single payload for the CFO command center dashboard.
// Returns everything cfo.html needs in one round trip. No placeholders, no * 0.7 math.

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

// 3-month inline linear forecast (same as dashboard-summary for consistency)
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

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function monthLabel(period: string): string {
  const parts = period.split('-')
  if (parts.length < 2) return period
  const idx = parseInt(parts[1], 10) - 1
  return (idx >= 0 && idx < 12) ? MONTH_NAMES[idx] : period
}

Deno.serve(async (req) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  }

  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })
  }

  const { data: profile } = await sb
    .from('users')
    .select('org_id, full_name, role, dashboard_role')
    .eq('id', user.id)
    .maybeSingle()

  const orgId = profile?.org_id
  if (!orgId) {
    return new Response(JSON.stringify({ error: 'No organization' }), { status: 404, headers })
  }

  // Role gate: only cfo + owner roles can access this endpoint
  const hasAccess = profile?.dashboard_role === 'cfo' || profile?.role === 'owner' || profile?.role === 'admin'
  if (!hasAccess) {
    return new Response(JSON.stringify({ error: 'Forbidden', required_role: 'cfo' }), { status: 403, headers })
  }

  try {
    const [org, accounts, transactions, budgets, auditLog, integrations] = await Promise.all([
      sb.from('organizations').select('id, name, plan, slug').eq('id', orgId).maybeSingle(),
      sb.from('gl_accounts').select('*').eq('org_id', orgId),
      sb.from('gl_transactions')
        .select('*, gl_accounts(name, account_type)')
        .eq('org_id', orgId)
        .order('txn_date', { ascending: false })
        .limit(1000),
      sb.from('gl_budgets').select('*, gl_accounts(name, account_type)').eq('org_id', orgId),
      sb.from('audit_log')
        .select('action, created_at, metadata')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false })
        .limit(20),
      sb.from('integrations')
        .select('provider, status, last_sync_at, records_synced')
        .eq('org_id', orgId),
    ])

    const txns = transactions.data || []
    const accts = accounts.data || []
    const bdgts = budgets.data || []
    const integs = integrations.data || []
    const demo_mode = txns.length === 0

    // ── KPIs: aggregate across all transactions ──
    let revenue = 0, cogs = 0, opex = 0
    txns.forEach((t: any) => {
      const atype = t.gl_accounts?.account_type
      const amt = Math.abs(Number(t.amount) || 0)
      if (atype === 'revenue' || atype === 'other_income') revenue += amt
      else if (atype === 'cost_of_revenue') cogs += amt
      else if (atype === 'expense' || atype === 'other_expense') opex += amt
    })
    const grossProfit = revenue - cogs
    const netIncome = revenue - cogs - opex
    const ebitda = netIncome // simplified: assume D&A included in opex; refine when we track D&A separately

    // ── Monthly aggregation ──
    const byMonth: Record<string, { revenue: number; cogs: number; opex: number }> = {}
    txns.forEach((t: any) => {
      const month = t.period || (t.txn_date || '').slice(0, 7)
      if (!month) return
      if (!byMonth[month]) byMonth[month] = { revenue: 0, cogs: 0, opex: 0 }
      const amt = Math.abs(Number(t.amount) || 0)
      const atype = t.gl_accounts?.account_type
      if (atype === 'revenue' || atype === 'other_income') byMonth[month].revenue += amt
      else if (atype === 'cost_of_revenue') byMonth[month].cogs += amt
      else if (atype === 'expense' || atype === 'other_expense') byMonth[month].opex += amt
    })

    // Budget monthly aggregation
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

    // ── P&L bars (Actual / Budget %) ──
    const totals = monthlyTrend.reduce(
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
      revenue: {
        actual: totals.revenue,
        budget: totals.budget_revenue,
        pct: totals.budget_revenue > 0 ? Math.round(totals.revenue / totals.budget_revenue * 100) : null,
      },
      cogs: {
        actual: totals.cogs,
        budget: totals.budget_cogs,
        pct: totals.budget_cogs > 0 ? Math.round(totals.cogs / totals.budget_cogs * 100) : null,
      },
      opex: {
        actual: totals.opex,
        budget: totals.budget_opex,
        pct: totals.budget_opex > 0 ? Math.round(totals.opex / totals.budget_opex * 100) : null,
      },
    }

    // ── Cash bars: last 6 months revenue, normalized to max ──
    const recent6 = monthlyTrend.slice(-6)
    const maxRev = recent6.length ? Math.max(...recent6.map(m => m.revenue)) : 0
    const cash_bars = recent6.map(m => ({
      month: m.month,
      label: m.label,
      value: m.revenue,
      pct: maxRev > 0 ? Math.round(m.revenue / maxRev * 100) : 0,
    }))

    // ── P&L breakdown by account (sub-line items) ──
    const byAccount: Record<string, { name: string; type: string; amount: number }> = {}
    txns.forEach((t: any) => {
      const name = t.gl_accounts?.name
      const type = t.gl_accounts?.account_type
      if (!name || !type) return
      const key = name
      if (!byAccount[key]) byAccount[key] = { name, type, amount: 0 }
      byAccount[key].amount += Math.abs(Number(t.amount) || 0)
    })
    const accountList = Object.values(byAccount)
    const pl = {
      revenue_breakdown: accountList.filter(a => a.type === 'revenue' || a.type === 'other_income').sort((a, b) => b.amount - a.amount),
      cogs_breakdown: accountList.filter(a => a.type === 'cost_of_revenue').sort((a, b) => b.amount - a.amount),
      opex_breakdown: accountList.filter(a => a.type === 'expense' || a.type === 'other_expense').sort((a, b) => b.amount - a.amount),
    }

    // ── 3-month forecast trend ──
    let forecast_trend: any[] = []
    if (monthlyTrend.length >= 3) {
      const revSeries = monthlyTrend.map(m => m.revenue)
      const forecasted = linearForecast(revSeries, 3)
      const lastPeriod = monthlyTrend[monthlyTrend.length - 1].month
      const [ly, lm] = lastPeriod.split('-').map(Number)
      forecast_trend = forecasted.map((val, i) => {
        const m = ((lm + i) % 12) + 1
        const y = ly + Math.floor((lm + i) / 12)
        const period = `${y}-${String(m).padStart(2, '0')}`
        return { month: period, label: monthLabel(period), forecast_revenue: val, type: 'forecast' }
      })
    }

    // ── Recent activity ──
    const recent_transactions = txns.slice(0, 10).map((t: any) => ({
      date: t.txn_date,
      account: t.gl_accounts?.name,
      type: t.gl_accounts?.account_type,
      amount: Number(t.amount),
      description: t.description,
      period: t.period,
    }))

    // ── Alerts: simple heuristics for v1 ──
    const alerts: any[] = []
    if (bars.opex.pct !== null && bars.opex.pct > 110) {
      alerts.push({ severity: 'warning', type: 'budget_overrun', message: `OpEx running ${bars.opex.pct}% of budget YTD` })
    }
    if (bars.revenue.pct !== null && bars.revenue.pct < 85) {
      alerts.push({ severity: 'warning', type: 'revenue_shortfall', message: `Revenue at ${bars.revenue.pct}% of plan YTD` })
    }
    if (totals.revenue > 0 && netIncome < 0) {
      alerts.push({ severity: 'critical', type: 'negative_margin', message: `Net margin negative: ${((netIncome / totals.revenue) * 100).toFixed(1)}%` })
    }

    // ── Integrations summary ──
    const connected = integs.filter((i: any) => i.status === 'connected')
    const integrationsSummary = {
      connected: connected.length,
      total: integs.length,
      providers: connected.map((i: any) => ({ provider: i.provider, last_sync_at: i.last_sync_at })),
    }
    const lastSync = connected
      .map((i: any) => i.last_sync_at)
      .filter(Boolean)
      .sort()
      .reverse()[0] || null

    return new Response(JSON.stringify({
      meta: {
        org_id: orgId,
        org_name: org.data?.name || null,
        plan: org.data?.plan || null,
        user_name: profile?.full_name || null,
        dashboard_role: profile?.dashboard_role || null,
        demo_mode,
        generated_at: new Date().toISOString(),
        last_sync_at: lastSync,
      },
      kpis: {
        revenue,
        cogs,
        gross_profit: grossProfit,
        opex,
        net_income: netIncome,
        ebitda,
        gross_margin: revenue > 0 ? Number(((grossProfit / revenue) * 100).toFixed(1)) : 0,
        net_margin: revenue > 0 ? Number(((netIncome / revenue) * 100).toFixed(1)) : 0,
      },
      bars,
      cash_bars,
      pl,
      monthly_trend: monthlyTrend,
      forecast_trend,
      recent_transactions,
      recent_activity: auditLog.data || [],
      alerts,
      integrations: integrationsSummary,
    }), { headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500, headers })
  }
})
