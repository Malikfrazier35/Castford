// supabase/functions/dashboard-data/index.ts
//
// Returns the canonical dashboard data shape consumed by dashboard-engine.js.
// One endpoint, role-aware via ?role= param. Tier-gated.
//
// In Session 2A this runs ALONGSIDE existing cfo-command-center (no cutover yet).
// In Session 2B the new engine + hub.html will fetch from here.
// In Session 3+ subpage views (?view=pnl, ?view=cash) get added.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const ALLOWED_ORIGINS = [
  'https://castford.com', 'https://www.castford.com',
  'https://castford.vercel.app', 'http://localhost:3000',
]
function cors(req: Request) {
  const o = req.headers.get('origin') || ''
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(o) ? o : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    'Content-Type': 'application/json',
  }
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function monthLabel(p: string): string {
  const x = (p||'').split('-'); if (x.length<2) return p||''
  const i = parseInt(x[1],10)-1; return (i>=0&&i<12)?MONTH_NAMES[i]:p
}

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

// Tier-based access matrix
const TIER_DASHBOARDS: Record<string, string[]> = {
  starter:    ['ceo'],
  growth:     ['ceo', 'controller', 'treasurer', 'fpa'],
  business:   ['ceo', 'controller', 'treasurer', 'fpa', 'cfo'],
  enterprise: ['ceo', 'controller', 'treasurer', 'fpa', 'cfo', 'multi_entity'],
}

const TIER_AI_BUDGETS: Record<string, number> = {
  starter:    50,
  growth:     500,
  business:   99999,
  enterprise: 99999,
}

// v1 role mapping: treasurer uses controller config until v2 differentiates
function effectiveRole(role: string): string {
  if (role === 'treasurer') return 'controller'
  return role
}

async function authorize(req: Request, headers: HeadersInit, requestedRole: string) {
  const a = req.headers.get('Authorization')
  if (!a?.startsWith('Bearer ')) {
    return { ok: false, res: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers }) }
  }
  const { data: { user }, error } = await sb.auth.getUser(a.replace('Bearer ', ''))
  if (error || !user) {
    return { ok: false, res: new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers }) }
  }
  const { data: profile } = await sb.from('users')
    .select('org_id, full_name, role, dashboard_role')
    .eq('id', user.id).maybeSingle()
  const orgId = profile?.org_id
  if (!orgId) {
    return { ok: false, res: new Response(JSON.stringify({ error: 'No organization' }), { status: 404, headers }) }
  }
  const { data: org } = await sb.from('organizations')
    .select('id, name, plan, slug, tier, acquisition_path')
    .eq('id', orgId).maybeSingle()
  if (!org) {
    return { ok: false, res: new Response(JSON.stringify({ error: 'Organization not found' }), { status: 404, headers }) }
  }

  const tier = org.tier || 'starter'
  const allowed = TIER_DASHBOARDS[tier] || []
  if (!allowed.includes(effectiveRole(requestedRole))) {
    return {
      ok: false,
      res: new Response(JSON.stringify({
        error: 'Dashboard not included in your tier',
        tier,
        requested_role: requestedRole,
        allowed_dashboards: allowed,
        upgrade_to: tier === 'starter' ? 'growth' : tier === 'growth' ? 'business' : 'enterprise',
      }), { status: 403, headers }),
    }
  }

  return { ok: true, user, profile, org, orgId, tier }
}

Deno.serve(async (req) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })

  const url = new URL(req.url)
  const role = url.searchParams.get('role') || 'cfo'
  const validRoles = ['cfo', 'ceo', 'fpa', 'controller', 'treasurer']
  if (!validRoles.includes(role)) {
    return new Response(JSON.stringify({ error: 'Invalid role', valid: validRoles }), { status: 400, headers })
  }

  const auth = await authorize(req, headers, role)
  if (!auth.ok) return (auth as any).res
  const { profile, org, orgId, tier } = auth as any
  const eff = effectiveRole(role)

  try {
    // ─────────────────────────────────────────────────────────────────────
    // STANDALONE PATH: read from dashboard_cache (Session 6 will populate via /v1/ingest)
    // ─────────────────────────────────────────────────────────────────────
    if (org.acquisition_path === 'hub_standalone') {
      const { data: cache } = await sb.from('dashboard_cache')
        .select('data, refreshed_at, data_source')
        .eq('org_id', orgId).maybeSingle()
      if (!cache) {
        return new Response(JSON.stringify({
          meta: {
            org_id: orgId, org_name: org.name, user_role: eff, tier,
            demo_mode: true, data_source: 'none',
            message: 'No data ingested yet. POST canonical shape to /v1/ingest with your API key.',
          },
          kpis: {}, deltas: {}, trends: {}, pnl: {}, alerts: [],
        }), { headers })
      }
      const cached = cache.data as any
      cached.meta = cached.meta || {}
      cached.meta.org_id = orgId
      cached.meta.org_name = org.name
      cached.meta.user_role = eff
      cached.meta.tier = tier
      cached.meta.last_sync_at = cache.refreshed_at
      cached.meta.data_source = cache.data_source
      return new Response(JSON.stringify(cached), { headers })
    }

    // ─────────────────────────────────────────────────────────────────────
    // NATIVE PATH: query gl_transactions live, build canonical shape
    // ─────────────────────────────────────────────────────────────────────
    const [txnsR, bdgtsR, integsR, accountsR] = await Promise.all([
      sb.from('gl_transactions')
        .select('*, gl_accounts(name, account_type, subtype)')
        .eq('org_id', orgId).order('txn_date', { ascending: false }).limit(2000),
      sb.from('gl_budgets')
        .select('*, gl_accounts(name, account_type)')
        .eq('org_id', orgId),
      sb.from('integrations')
        .select('provider, status, last_sync_at, records_synced')
        .eq('org_id', orgId),
      sb.from('gl_accounts')
        .select('id, name, account_type, subtype')
        .eq('org_id', orgId),
    ])

    const txns = txnsR.data || []
    const bdgts = bdgtsR.data || []
    const integs = integsR.data || []
    const accounts = accountsR.data || []
    const demo_mode = txns.length === 0

    // ── Monthly trend (12+ months) ──
    const byMonth: Record<string, { revenue:number; cogs:number; opex:number }> = {}
    txns.forEach((t: any) => {
      const m = t.period || (t.txn_date||'').slice(0,7); if (!m) return
      if (!byMonth[m]) byMonth[m] = { revenue:0, cogs:0, opex:0 }
      const amt = Math.abs(Number(t.amount)||0); const c = classifyTxn(t)
      if (c==='revenue') byMonth[m].revenue+=amt
      else if (c==='cogs') byMonth[m].cogs+=amt
      else if (c==='opex') byMonth[m].opex+=amt
    })
    const budgetByMonth: Record<string, { revenue:number; cogs:number; opex:number }> = {}
    bdgts.forEach((b: any) => {
      const p = b.period; if (!p) return
      if (!budgetByMonth[p]) budgetByMonth[p] = { revenue:0, cogs:0, opex:0 }
      const a = b.gl_accounts?.account_type; const amt = Math.abs(Number(b.amount)||0)
      if (a==='revenue') budgetByMonth[p].revenue+=amt
      else if (a==='cost_of_revenue') budgetByMonth[p].cogs+=amt
      else budgetByMonth[p].opex+=amt
    })
    const monthly = Object.entries(byMonth).sort().map(([month, d]) => {
      const bm = budgetByMonth[month] || { revenue:0, cogs:0, opex:0 }
      return {
        month, label: monthLabel(month),
        revenue: d.revenue, cogs: d.cogs, opex: d.opex, net: d.revenue - d.cogs - d.opex,
        budget_revenue: bm.revenue, budget_cogs: bm.cogs, budget_opex: bm.opex,
        mrr: null, ar: null, ap: null,
      }
    })

    // ── TTM math ──
    const ttm = monthly.slice(-12)
    const priorTTM = monthly.slice(-24, -12)
    const ttmTotals = ttm.reduce((a,m)=>({revenue:a.revenue+m.revenue, cogs:a.cogs+m.cogs, opex:a.opex+m.opex}), {revenue:0,cogs:0,opex:0})
    const ptTotals = priorTTM.reduce((a,m)=>({revenue:a.revenue+m.revenue, cogs:a.cogs+m.cogs, opex:a.opex+m.opex}), {revenue:0,cogs:0,opex:0})

    const revenue_ttm = ttmTotals.revenue
    const cogs_ttm = ttmTotals.cogs
    const opex_ttm = ttmTotals.opex
    const gross_profit_ttm = revenue_ttm - cogs_ttm
    const net_income_ttm = revenue_ttm - cogs_ttm - opex_ttm
    const operating_cash_flow_ttm = revenue_ttm - opex_ttm

    // ── Period subtotals ──
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const currentMonth = `${yyyy}-${mm}`
    const currentQ = Math.floor(now.getMonth() / 3)
    const qStartMonth = currentQ * 3 + 1
    const qStartKey = `${yyyy}-${String(qStartMonth).padStart(2, '0')}`

    const mtdRow = monthly.find(m => m.month === currentMonth)
    const revenue_mtd = mtdRow ? mtdRow.revenue : 0
    const qtdMonths = monthly.filter(m => m.month >= qStartKey)
    const revenue_qtr = qtdMonths.reduce((s, m) => s + m.revenue, 0)

    // ── Burn / runway ──
    const last3 = monthly.slice(-3)
    const last3NetAvg = last3.length ? last3.reduce((a,m)=>a+m.net, 0) / last3.length : 0
    const burn_rate_monthly = last3NetAvg < 0 ? Math.abs(last3NetAvg) : 0
    const cash_position = operating_cash_flow_ttm  // proxy until cash accounts integrated
    const runway_months = burn_rate_monthly > 0 ? Math.floor(cash_position / burn_rate_monthly) : null

    // ── Margins / ROIC ──
    const gross_margin_pct = revenue_ttm > 0 ? Number(((gross_profit_ttm / revenue_ttm) * 100).toFixed(1)) : 0
    const net_margin_pct = revenue_ttm > 0 ? Number(((net_income_ttm / revenue_ttm) * 100).toFixed(1)) : 0
    const roic_pct = net_margin_pct  // proxy until balance sheet integrated

    // ── AR / AP (Controller only, derived from subtype-tagged accounts) ──
    let ar_total: number | null = null
    let ap_total: number | null = null
    let ar_aging_30: number | null = null
    let ar_aging_60: number | null = null
    let ar_aging_90: number | null = null
    let dso_days: number | null = null
    let dpo_days: number | null = null
    if (eff === 'controller') {
      const arAccountIds = accounts.filter(a => a.subtype === 'ar').map(a => a.id)
      const apAccountIds = accounts.filter(a => a.subtype === 'ap').map(a => a.id)
      const arTxns = txns.filter((t: any) => arAccountIds.includes(t.account_id))
      const apTxns = txns.filter((t: any) => apAccountIds.includes(t.account_id))

      ar_total = arTxns.reduce((s: number, t: any) => s + Math.abs(Number(t.amount) || 0), 0)
      ap_total = apTxns.reduce((s: number, t: any) => s + Math.abs(Number(t.amount) || 0), 0)

      const today = Date.now()
      const ageBucket = (t: any) => {
        const d = new Date(t.txn_date).getTime()
        const days = Math.floor((today - d) / (1000 * 60 * 60 * 24))
        return days
      }
      ar_aging_30 = arTxns.filter((t: any) => ageBucket(t) >= 30 && ageBucket(t) < 60)
        .reduce((s: number, t: any) => s + Math.abs(Number(t.amount) || 0), 0)
      ar_aging_60 = arTxns.filter((t: any) => ageBucket(t) >= 60 && ageBucket(t) < 90)
        .reduce((s: number, t: any) => s + Math.abs(Number(t.amount) || 0), 0)
      ar_aging_90 = arTxns.filter((t: any) => ageBucket(t) >= 90)
        .reduce((s: number, t: any) => s + Math.abs(Number(t.amount) || 0), 0)

      // DSO = (AR / Revenue) * 365
      dso_days = revenue_ttm > 0 && ar_total > 0
        ? Math.round((ar_total / revenue_ttm) * 365)
        : 45  // industry default
      dpo_days = cogs_ttm > 0 && (ap_total || 0) > 0
        ? Math.round(((ap_total || 0) / cogs_ttm) * 365)
        : 30  // industry default
    }

    // ── Growth metrics (CEO/FP&A only, proxy from revenue trend) ──
    let mrr: number | null = null
    let arr: number | null = null
    let growth_mom_pct: number | null = null
    if (eff === 'ceo' || eff === 'fpa') {
      // MRR proxy: most recent month's revenue
      mrr = monthly.length ? monthly[monthly.length - 1].revenue : 0
      arr = mrr ? mrr * 12 : null
      const recent2 = monthly.slice(-2)
      growth_mom_pct = recent2.length === 2 && recent2[0].revenue > 0
        ? Number((((recent2[1].revenue - recent2[0].revenue) / recent2[0].revenue) * 100).toFixed(1))
        : null
    }

    // ── Deltas ──
    const deltas = {
      revenue_yoy_pct: pctDelta(ttmTotals.revenue, ptTotals.revenue),
      revenue_qoq_pct: (() => {
        const q1 = monthly.slice(-6, -3).reduce((s, m) => s + m.revenue, 0)
        const q2 = monthly.slice(-3).reduce((s, m) => s + m.revenue, 0)
        return pctDelta(q2, q1)
      })(),
      net_income_yoy_pct: pctDelta(
        ttmTotals.revenue - ttmTotals.cogs - ttmTotals.opex,
        ptTotals.revenue - ptTotals.cogs - ptTotals.opex
      ),
      gross_margin_qoq_pts: (() => {
        const q1 = monthly.slice(-6, -3); const q2 = monthly.slice(-3)
        const r1 = q1.reduce((s, m) => s + m.revenue, 0)
        const r2 = q2.reduce((s, m) => s + m.revenue, 0)
        const gp1 = q1.reduce((s, m) => s + (m.revenue - m.cogs), 0)
        const gp2 = q2.reduce((s, m) => s + (m.revenue - m.cogs), 0)
        const gm1 = r1 > 0 ? gp1 / r1 * 100 : 0
        const gm2 = r2 > 0 ? gp2 / r2 * 100 : 0
        return Number((gm2 - gm1).toFixed(1))
      })(),
      ocf_qoq_pct: pctDelta(
        monthly.slice(-3).reduce((s, m) => s + (m.revenue - m.opex), 0),
        monthly.slice(-6, -3).reduce((s, m) => s + (m.revenue - m.opex), 0)
      ),
      roic_yoy_pts: pctDelta(
        ttmTotals.revenue > 0 ? ((ttmTotals.revenue - ttmTotals.cogs - ttmTotals.opex) / ttmTotals.revenue) * 100 : 0,
        ptTotals.revenue > 0 ? ((ptTotals.revenue - ptTotals.cogs - ptTotals.opex) / ptTotals.revenue) * 100 : 0
      ),
      mrr_growth_pct: growth_mom_pct,
    }

    // ── Weekly cash (last 13 weeks) ──
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
    const weekly_cash = Object.entries(weekly).sort()
      .slice(-13)
      .map(([w, d]) => ({ week: w, inflow: d.inflow, outflow: d.outflow, net: d.inflow - d.outflow, forecast: false }))

    // ── Alerts ──
    const alerts: any[] = []
    if (revenue_ttm > 0 && net_income_ttm < 0) {
      alerts.push({ severity: 'critical', message: `Negative TTM net margin: ${net_margin_pct.toFixed(1)}%` })
    }
    if (runway_months !== null && runway_months < 6) {
      alerts.push({ severity: 'critical', message: `Runway under 6 months: ${runway_months} months remaining` })
    } else if (runway_months !== null && runway_months < 12) {
      alerts.push({ severity: 'warning', message: `Runway tightening: ${runway_months} months remaining` })
    }

    // ─────────────────────────────────────────────────────────────────────
    // Assemble canonical shape
    // ─────────────────────────────────────────────────────────────────────
    const canonical = {
      meta: {
        org_id: orgId,
        org_name: org.name,
        user_role: eff,
        tier,
        ai_query_budget: TIER_AI_BUDGETS[tier] ?? 0,
        demo_mode,
        last_sync_at: integs.filter((i:any)=>i.status==='connected')
          .map((i:any)=>i.last_sync_at).filter(Boolean).sort().reverse()[0] || null,
        data_source: 'castford_native',
        generated_at: new Date().toISOString(),
      },
      kpis: {
        // Universal financials
        revenue_ttm, revenue_qtr, revenue_mtd,
        cogs_ttm, opex_ttm, gross_profit_ttm,
        gross_margin_pct, net_income_ttm, net_margin_pct,
        operating_cash_flow_ttm,
        cash_position, burn_rate_monthly, runway_months,
        roic_pct,
        // Growth (CEO/FP&A)
        mrr, arr, growth_mom_pct,
        cac: null, ltv: null, nrr_pct: null, logo_churn_pct: null,
        // Controller
        ar_total, ap_total, ar_aging_30, ar_aging_60, ar_aging_90,
        dso_days, dpo_days,
        close_status: null, open_close_tasks: null,
      },
      deltas,
      trends: {
        monthly,
        weekly_cash,
      },
      pnl: null,       // Subpage scope; added in Session 3
      budget: null,    // Subpage scope; added in Session 3
      forecast: null,  // Subpage scope; added in Session 3
      alerts,
      integrations: {
        connected: integs.filter((i:any)=>i.status==='connected').length,
        total: integs.length,
        providers: integs,
      },
    }

    return new Response(JSON.stringify(canonical), { headers })
  } catch (err: any) {
    console.error('[dashboard-data] Error:', err)
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500, headers })
  }
})
