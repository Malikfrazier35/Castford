// supabase/functions/dashboard-data/index.ts
//
// V2: Refactored to use the standard auth envelope + org_members table.
// Old behavior: looked up users.org_id directly.
// New behavior:
//   - X-Org-Id header determines active org (falls back to first membership)
//   - org_members table determines role + permission + manager_scope
//   - Role from URL (?role=ceo) is checked against user's authorized roles
//   - Tier check: requested role must be included in org's tier
//
// Backwards compatible: existing /ceo, /cfo dashboards continue to work
// because the migration backfilled org_members from users.org_id.

import {
  authenticate, sb, corsHeaders, jsonError, jsonOk,
  tierAllowsRole, userCanAccessRole, tierLimits,
} from '../_shared/auth.ts';

// ────────────────────────────────────────────────────────────────────────
// Helpers (preserved from v1)
// ────────────────────────────────────────────────────────────────────────

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function monthLabel(p: string): string {
  const x = (p||'').split('-'); if (x.length<2) return p||'';
  const i = parseInt(x[1],10)-1; return (i>=0&&i<12)?MONTH_NAMES[i]:p;
}

function classifyTxn(t: any): 'revenue'|'cogs'|'opex'|'other' {
  const a = t.gl_accounts?.account_type;
  if (a === 'revenue' || a === 'other_income') return 'revenue';
  if (a === 'cost_of_revenue') return 'cogs';
  if (a === 'expense' || a === 'other_expense') return 'opex';
  return 'other';
}

function pctDelta(current: number, prior: number): number | null {
  if (!prior || prior === 0) return null;
  return Number((((current - prior) / Math.abs(prior)) * 100).toFixed(1));
}

// v1 role mapping: treasurer reuses controller logic until v2 gets dedicated config
function effectiveRole(role: string): string {
  return role === 'treasurer' ? 'controller' : role;
}

// ────────────────────────────────────────────────────────────────────────
// Main handler
// ────────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  // Standard auth envelope
  const auth = await authenticate(req);
  if (!auth.ok) return auth.res;
  const { ctx } = auth;

  // Determine which dashboard role is being requested (URL > primary_role)
  const url = new URL(req.url);
  const requestedRole = url.searchParams.get('role') || ctx.membership.primary_role;
  const validRoles = ['cfo', 'ceo', 'fpa', 'controller', 'treasurer', 'manager'];
  if (!validRoles.includes(requestedRole)) {
    return jsonError(400, 'Invalid role', headers, { valid: validRoles });
  }

  // Tier check: does the org's plan include this dashboard?
  if (!tierAllowsRole(ctx.org.tier, requestedRole)) {
    return jsonError(403, 'Dashboard not included in your plan', headers, {
      tier: ctx.org.tier,
      requested_role: requestedRole,
      tier_dashboards: tierLimits(ctx.org.tier).dashboards,
      action: 'upgrade_tier',
    });
  }

  // User authorization check: does THIS user have access to THIS dashboard?
  if (!userCanAccessRole(ctx, requestedRole)) {
    return jsonError(403, 'You are not authorized for this dashboard', headers, {
      your_primary_role: ctx.membership.primary_role,
      your_secondary_dashboards: ctx.membership.secondary_dashboards,
      requested_role: requestedRole,
      action: 'request_access',
    });
  }

  const eff = effectiveRole(requestedRole);

  try {
    // ─────────────────────────────────────────────────────────────────────
    // STANDALONE PATH: read from dashboard_cache (Session 6 will populate via /v1/ingest)
    // ─────────────────────────────────────────────────────────────────────
    if (ctx.org.acquisition_path === 'hub_standalone') {
      const { data: cache } = await sb.from('dashboard_cache')
        .select('data, refreshed_at, data_source')
        .eq('org_id', ctx.org_id)
        .maybeSingle();

      if (!cache) {
        return jsonOk({
          meta: {
            org_id: ctx.org_id, org_name: ctx.org.name, user_role: eff, tier: ctx.org.tier,
            demo_mode: true, data_source: 'none',
            message: 'No data ingested yet. POST canonical shape to /v1/ingest with your API key.',
          },
          kpis: {}, deltas: {}, trends: {}, pnl: null, alerts: [],
        }, headers);
      }
      const cached: any = cache.data;
      cached.meta = cached.meta || {};
      cached.meta.org_id = ctx.org_id;
      cached.meta.org_name = ctx.org.name;
      cached.meta.user_role = eff;
      cached.meta.tier = ctx.org.tier;
      cached.meta.last_sync_at = cache.refreshed_at;
      cached.meta.data_source = cache.data_source;
      return jsonOk(cached, headers);
    }

    // ─────────────────────────────────────────────────────────────────────
    // NATIVE PATH: query gl_transactions live, build canonical shape
    // ─────────────────────────────────────────────────────────────────────
    const [txnsR, bdgtsR, integsR, accountsR] = await Promise.all([
      sb.from('gl_transactions')
        .select('*, gl_accounts(name, account_type, subtype)')
        .eq('org_id', ctx.org_id).order('txn_date', { ascending: false }).limit(2000),
      sb.from('gl_budgets')
        .select('*, gl_accounts(name, account_type)')
        .eq('org_id', ctx.org_id),
      sb.from('integrations')
        .select('provider, status, last_sync_at, records_synced')
        .eq('org_id', ctx.org_id),
      sb.from('gl_accounts')
        .select('id, name, account_type, subtype')
        .eq('org_id', ctx.org_id),
    ]);

    const txns = txnsR.data || [];
    const bdgts = bdgtsR.data || [];
    const integs = integsR.data || [];
    const accounts = accountsR.data || [];
    const demo_mode = txns.length === 0;

    // ── Monthly trend ──
    const byMonth: Record<string, { revenue:number; cogs:number; opex:number }> = {};
    txns.forEach((t: any) => {
      const m = t.period || (t.txn_date||'').slice(0,7); if (!m) return;
      if (!byMonth[m]) byMonth[m] = { revenue:0, cogs:0, opex:0 };
      const amt = Math.abs(Number(t.amount)||0); const c = classifyTxn(t);
      if (c==='revenue') byMonth[m].revenue+=amt;
      else if (c==='cogs') byMonth[m].cogs+=amt;
      else if (c==='opex') byMonth[m].opex+=amt;
    });
    const budgetByMonth: Record<string, { revenue:number; cogs:number; opex:number }> = {};
    bdgts.forEach((b: any) => {
      const p = b.period; if (!p) return;
      if (!budgetByMonth[p]) budgetByMonth[p] = { revenue:0, cogs:0, opex:0 };
      const a = b.gl_accounts?.account_type; const amt = Math.abs(Number(b.amount)||0);
      if (a==='revenue') budgetByMonth[p].revenue+=amt;
      else if (a==='cost_of_revenue') budgetByMonth[p].cogs+=amt;
      else budgetByMonth[p].opex+=amt;
    });
    const monthly = Object.entries(byMonth).sort().map(([month, d]) => {
      const bm = budgetByMonth[month] || { revenue:0, cogs:0, opex:0 };
      return {
        month, label: monthLabel(month),
        revenue: d.revenue, cogs: d.cogs, opex: d.opex, net: d.revenue - d.cogs - d.opex,
        budget_revenue: bm.revenue, budget_cogs: bm.cogs, budget_opex: bm.opex,
        mrr: null, ar: null, ap: null,
      };
    });

    // ── TTM math ──
    const ttm = monthly.slice(-12);
    const priorTTM = monthly.slice(-24, -12);
    const ttmTotals = ttm.reduce((a,m)=>({revenue:a.revenue+m.revenue, cogs:a.cogs+m.cogs, opex:a.opex+m.opex}), {revenue:0,cogs:0,opex:0});
    const ptTotals = priorTTM.reduce((a,m)=>({revenue:a.revenue+m.revenue, cogs:a.cogs+m.cogs, opex:a.opex+m.opex}), {revenue:0,cogs:0,opex:0});

    const revenue_ttm = ttmTotals.revenue;
    const cogs_ttm = ttmTotals.cogs;
    const opex_ttm = ttmTotals.opex;
    const gross_profit_ttm = revenue_ttm - cogs_ttm;
    const net_income_ttm = revenue_ttm - cogs_ttm - opex_ttm;
    const operating_cash_flow_ttm = revenue_ttm - opex_ttm;

    // ── Period subtotals ──
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonth = `${yyyy}-${mm}`;
    const currentQ = Math.floor(now.getMonth() / 3);
    const qStartMonth = currentQ * 3 + 1;
    const qStartKey = `${yyyy}-${String(qStartMonth).padStart(2, '0')}`;

    const mtdRow = monthly.find(m => m.month === currentMonth);
    const revenue_mtd = mtdRow ? mtdRow.revenue : 0;
    const qtdMonths = monthly.filter(m => m.month >= qStartKey);
    const revenue_qtr = qtdMonths.reduce((s, m) => s + m.revenue, 0);

    // ── Burn / runway ──
    const last3 = monthly.slice(-3);
    const last3NetAvg = last3.length ? last3.reduce((a,m)=>a+m.net, 0) / last3.length : 0;
    const burn_rate_monthly = last3NetAvg < 0 ? Math.abs(last3NetAvg) : 0;
    const cash_position = operating_cash_flow_ttm;
    const runway_months = burn_rate_monthly > 0 ? Math.floor(cash_position / burn_rate_monthly) : null;

    // ── Margins / ROIC ──
    const gross_margin_pct = revenue_ttm > 0 ? Number(((gross_profit_ttm / revenue_ttm) * 100).toFixed(1)) : 0;
    const net_margin_pct = revenue_ttm > 0 ? Number(((net_income_ttm / revenue_ttm) * 100).toFixed(1)) : 0;
    const roic_pct = net_margin_pct;

    // ── AR / AP (Controller only) ──
    let ar_total: number | null = null;
    let ap_total: number | null = null;
    let ar_aging_30: number | null = null;
    let ar_aging_60: number | null = null;
    let ar_aging_90: number | null = null;
    let dso_days: number | null = null;
    let dpo_days: number | null = null;
    if (eff === 'controller') {
      const arAccountIds = accounts.filter(a => a.subtype === 'ar').map(a => a.id);
      const apAccountIds = accounts.filter(a => a.subtype === 'ap').map(a => a.id);
      const arTxns = txns.filter((t: any) => arAccountIds.includes(t.account_id));
      const apTxns = txns.filter((t: any) => apAccountIds.includes(t.account_id));
      ar_total = arTxns.reduce((s: number, t: any) => s + Math.abs(Number(t.amount) || 0), 0);
      ap_total = apTxns.reduce((s: number, t: any) => s + Math.abs(Number(t.amount) || 0), 0);
      const today = Date.now();
      const ageBucket = (t: any) => Math.floor((today - new Date(t.txn_date).getTime()) / (1000 * 60 * 60 * 24));
      ar_aging_30 = arTxns.filter((t: any) => ageBucket(t) >= 30 && ageBucket(t) < 60)
        .reduce((s: number, t: any) => s + Math.abs(Number(t.amount) || 0), 0);
      ar_aging_60 = arTxns.filter((t: any) => ageBucket(t) >= 60 && ageBucket(t) < 90)
        .reduce((s: number, t: any) => s + Math.abs(Number(t.amount) || 0), 0);
      ar_aging_90 = arTxns.filter((t: any) => ageBucket(t) >= 90)
        .reduce((s: number, t: any) => s + Math.abs(Number(t.amount) || 0), 0);
      dso_days = revenue_ttm > 0 && ar_total > 0 ? Math.round((ar_total / revenue_ttm) * 365) : 45;
      dpo_days = cogs_ttm > 0 && (ap_total || 0) > 0 ? Math.round(((ap_total || 0) / cogs_ttm) * 365) : 30;
    }

    // ── Growth metrics (CEO/FP&A only) ──
    let mrr: number | null = null;
    let arr: number | null = null;
    let growth_mom_pct: number | null = null;
    if (eff === 'ceo' || eff === 'fpa') {
      mrr = monthly.length ? monthly[monthly.length - 1].revenue : 0;
      arr = mrr ? mrr * 12 : null;
      const recent2 = monthly.slice(-2);
      growth_mom_pct = recent2.length === 2 && recent2[0].revenue > 0
        ? Number((((recent2[1].revenue - recent2[0].revenue) / recent2[0].revenue) * 100).toFixed(1))
        : null;
    }

    // ── Manager scope filter (Manager dashboard only) ──
    // If the user is a manager with a defined manager_scope, this would filter
    // gl_transactions to only their cost centers. v1 stub — full implementation
    // requires GL accounts to have department/cost_center tagging.
    if (eff === 'manager' && ctx.membership.manager_scope) {
      // TODO: filter trends and KPIs by manager_scope.cost_centers
      // For now, the manager sees full org data (matches CEO view)
    }

    // ── Deltas ──
    const deltas = {
      revenue_yoy_pct: pctDelta(ttmTotals.revenue, ptTotals.revenue),
      revenue_qoq_pct: (() => {
        const q1 = monthly.slice(-6, -3).reduce((s, m) => s + m.revenue, 0);
        const q2 = monthly.slice(-3).reduce((s, m) => s + m.revenue, 0);
        return pctDelta(q2, q1);
      })(),
      net_income_yoy_pct: pctDelta(
        ttmTotals.revenue - ttmTotals.cogs - ttmTotals.opex,
        ptTotals.revenue - ptTotals.cogs - ptTotals.opex
      ),
      gross_margin_qoq_pts: (() => {
        const q1 = monthly.slice(-6, -3); const q2 = monthly.slice(-3);
        const r1 = q1.reduce((s, m) => s + m.revenue, 0);
        const r2 = q2.reduce((s, m) => s + m.revenue, 0);
        const gp1 = q1.reduce((s, m) => s + (m.revenue - m.cogs), 0);
        const gp2 = q2.reduce((s, m) => s + (m.revenue - m.cogs), 0);
        const gm1 = r1 > 0 ? gp1 / r1 * 100 : 0;
        const gm2 = r2 > 0 ? gp2 / r2 * 100 : 0;
        return Number((gm2 - gm1).toFixed(1));
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
    };

    // ── Weekly cash ──
    const weekly: Record<string, { inflow:number; outflow:number }> = {};
    txns.forEach((t: any) => {
      const d = new Date(t.txn_date); if (isNaN(d.getTime())) return;
      const ws = new Date(d); ws.setDate(d.getDate() - d.getDay());
      const k = ws.toISOString().slice(0,10);
      if (!weekly[k]) weekly[k] = { inflow:0, outflow:0 };
      const amt = Math.abs(Number(t.amount)||0); const c = classifyTxn(t);
      if (c==='revenue') weekly[k].inflow += amt;
      else weekly[k].outflow += amt;
    });
    const weekly_cash = Object.entries(weekly).sort()
      .slice(-13)
      .map(([w, d]) => ({ week: w, inflow: d.inflow, outflow: d.outflow, net: d.inflow - d.outflow, forecast: false }));

    // ── Alerts ──
    const alerts: any[] = [];
    if (revenue_ttm > 0 && net_income_ttm < 0) {
      alerts.push({ severity: 'critical', message: `Negative TTM net margin: ${net_margin_pct.toFixed(1)}%` });
    }
    if (runway_months !== null && runway_months < 6) {
      alerts.push({ severity: 'critical', message: `Runway under 6 months: ${runway_months} months remaining` });
    } else if (runway_months !== null && runway_months < 12) {
      alerts.push({ severity: 'warning', message: `Runway tightening: ${runway_months} months remaining` });
    }

    // ─────────────────────────────────────────────────────────────────────
    // Assemble canonical shape
    // ─────────────────────────────────────────────────────────────────────
    const canonical = {
      meta: {
        org_id: ctx.org_id,
        org_name: ctx.org.name,
        user_role: eff,
        user_permission_level: ctx.membership.permission_level,
        user_seat_type: ctx.membership.seat_type,
        tier: ctx.org.tier,
        ai_query_budget: tierLimits(ctx.org.tier).ai_queries,
        demo_mode,
        last_sync_at: integs.filter((i:any)=>i.status==='connected')
          .map((i:any)=>i.last_sync_at).filter(Boolean).sort().reverse()[0] || null,
        data_source: 'castford_native',
        generated_at: new Date().toISOString(),
      },
      kpis: {
        revenue_ttm, revenue_qtr, revenue_mtd,
        cogs_ttm, opex_ttm, gross_profit_ttm,
        gross_margin_pct, net_income_ttm, net_margin_pct,
        operating_cash_flow_ttm,
        cash_position, burn_rate_monthly, runway_months,
        roic_pct,
        mrr, arr, growth_mom_pct,
        cac: null, ltv: null, nrr_pct: null, logo_churn_pct: null,
        ar_total, ap_total, ar_aging_30, ar_aging_60, ar_aging_90,
        dso_days, dpo_days,
        close_status: null, open_close_tasks: null,
      },
      deltas,
      trends: { monthly, weekly_cash },
      pnl: null, budget: null, forecast: null,
      alerts,
      integrations: {
        connected: integs.filter((i:any)=>i.status==='connected').length,
        total: integs.length,
        providers: integs,
      },
    };

    return jsonOk(canonical, headers);
  } catch (err: any) {
    console.error('[dashboard-data] Error:', err);
    return jsonError(500, err?.message || 'Internal error', headers);
  }
});
