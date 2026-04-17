import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000'];
function cors(req: Request) {
  const o = req.headers.get('origin') || '';
  return { 'Access-Control-Allow-Origin': AO.includes(o) ? o : AO[0], 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey', 'Content-Type': 'application/json' };
}

function fmt(v: number): string {
  if (v === 0) return '\u2014';
  const abs = Math.abs(v);
  const str = abs >= 1e6 ? '$' + (abs / 1e6).toFixed(1) + 'M' : abs >= 1e3 ? '$' + Math.round(abs / 1e3).toLocaleString() + 'K' : '$' + abs.toFixed(0);
  return v < 0 ? '(' + str + ')' : str;
}

function pct(v: number): string { return v.toFixed(1) + '%'; }
function delta(v: number): string { return (v > 0 ? '+' : '') + v.toFixed(1) + '%'; }

Deno.serve(async (req: Request) => {
  const headers = cors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers });

  const ah = req.headers.get('authorization') || '';
  const token = ah.replace('Bearer ', '');
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers });

  const { data: profile } = await supabase.from('users').select('org_id, role, full_name').eq('id', user.id).maybeSingle();
  if (!profile?.org_id) return new Response(JSON.stringify({ error: 'No organization' }), { status: 400, headers });
  const orgId = profile.org_id;

  // Check plan — board deck requires Growth+
  const { data: org } = await supabase.from('organizations').select('name, plan').eq('id', orgId).maybeSingle();
  const plan = org?.plan || 'demo';
  if (plan === 'demo' || plan === 'starter') {
    return new Response(JSON.stringify({ error: 'Board deck generation requires Growth plan or above.', upgrade_required: true }), { status: 403, headers });
  }

  try {
    const body = await req.json();
    const { action, period_start, period_end, title } = body;
    const reportTitle = title || `Board Report \u2014 ${org?.name || 'Company'}`;

    // === PULL ALL DATA ===

    // 1. GL Transactions — group by account type and period
    const { data: txns } = await supabase.from('gl_transactions').select('amount, period, gl_accounts!inner(name, account_type)').eq('org_id', orgId).order('period');

    if (!txns || txns.length === 0) {
      return new Response(JSON.stringify({ error: 'No financial data available. Upload GL data first.' }), { status: 400, headers });
    }

    // Compute P&L
    let totalRevenue = 0, totalCOGS = 0, totalOpEx = 0, totalOtherIncome = 0, totalOtherExpense = 0;
    const accountTotals: Record<string, { name: string; type: string; total: number }> = {};
    const monthlyData: Record<string, { revenue: number; cogs: number; opex: number; ni: number }> = {};

    for (const t of txns) {
      const acct = (t as any).gl_accounts;
      const type = acct.account_type;
      const name = acct.name;
      const amt = t.amount;
      const period = t.period;

      if (!accountTotals[name]) accountTotals[name] = { name, type, total: 0 };
      accountTotals[name].total += amt;

      if (!monthlyData[period]) monthlyData[period] = { revenue: 0, cogs: 0, opex: 0, ni: 0 };

      if (type === 'revenue') { totalRevenue += amt; monthlyData[period].revenue += amt; }
      else if (type === 'cost_of_revenue') { totalCOGS += Math.abs(amt); monthlyData[period].cogs += Math.abs(amt); }
      else if (type === 'expense') { totalOpEx += Math.abs(amt); monthlyData[period].opex += Math.abs(amt); }
      else if (type === 'other_income') { totalOtherIncome += amt; }
      else if (type === 'other_expense') { totalOtherExpense += Math.abs(amt); }
    }

    const grossProfit = totalRevenue - totalCOGS;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const netIncome = grossProfit - totalOpEx + totalOtherIncome - totalOtherExpense;
    const netMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    // Monthly trend
    const months = Object.keys(monthlyData).sort();
    const trend = months.map(m => {
      const d = monthlyData[m];
      d.ni = d.revenue - d.cogs - d.opex;
      return { period: m, ...d };
    });

    // MoM growth
    let revGrowth = 0;
    if (trend.length >= 2) {
      const last = trend[trend.length - 1].revenue;
      const prev = trend[trend.length - 2].revenue;
      revGrowth = prev > 0 ? ((last - prev) / prev) * 100 : 0;
    }

    // 2. Budget variance
    const { data: budgets } = await supabase.from('gl_budgets').select('amount, gl_accounts!inner(name, account_type)').eq('org_id', orgId);
    let totalBudget = 0;
    const budgetByAccount: Record<string, number> = {};
    if (budgets) {
      for (const b of budgets) {
        const name = (b as any).gl_accounts.name;
        if (!budgetByAccount[name]) budgetByAccount[name] = 0;
        budgetByAccount[name] += b.amount;
        totalBudget += b.amount;
      }
    }

    // Variance analysis — top 5 deviations
    const variances = Object.values(accountTotals)
      .filter(a => budgetByAccount[a.name])
      .map(a => {
        const budget = budgetByAccount[a.name];
        const actual = Math.abs(a.total);
        const diff = actual - Math.abs(budget);
        const pctVar = Math.abs(budget) > 0 ? (diff / Math.abs(budget)) * 100 : 0;
        return { name: a.name, type: a.type, actual, budget: Math.abs(budget), diff, pct: pctVar };
      })
      .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
      .slice(0, 5);

    // 3. Top accounts by size
    const topAccounts = Object.values(accountTotals)
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
      .slice(0, 10);

    // 4. Alerts
    const { data: alerts } = await supabase.from('financial_alerts').select('title, severity, deviation_pct').eq('org_id', orgId).eq('resolved', false).order('severity');

    // 5. Department plans
    const { data: deptPlans } = await supabase.from('department_plans').select('*').eq('org_id', orgId);
    const totalHeadcount = deptPlans ? deptPlans.reduce((s, d) => s + d.current + d.net_new, 0) : 0;
    const totalDeptBudget = deptPlans ? deptPlans.reduce((s, d) => s + d.budget, 0) : 0;

    // === BUILD REPORT ===
    const now = new Date();
    const report = {
      title: reportTitle,
      generated_at: now.toISOString(),
      generated_by: profile.full_name || user.email,
      company: org?.name || 'Company',
      period_covered: months.length > 0 ? `${months[0]} to ${months[months.length - 1]}` : 'N/A',

      executive_summary: {
        headline: `${fmt(totalRevenue)} revenue with ${pct(netMargin)} net margin`,
        revenue: totalRevenue,
        revenue_formatted: fmt(totalRevenue),
        revenue_growth_mom: revGrowth,
        revenue_growth_formatted: delta(revGrowth),
        gross_profit: grossProfit,
        gross_profit_formatted: fmt(grossProfit),
        gross_margin: grossMargin,
        gross_margin_formatted: pct(grossMargin),
        net_income: netIncome,
        net_income_formatted: fmt(netIncome),
        net_margin: netMargin,
        net_margin_formatted: pct(netMargin),
        total_opex: totalOpEx,
        total_opex_formatted: fmt(totalOpEx),
        total_headcount: totalHeadcount,
        active_alerts: alerts ? alerts.length : 0,
      },

      pnl_statement: {
        revenue: { total: totalRevenue, formatted: fmt(totalRevenue) },
        cogs: { total: totalCOGS, formatted: fmt(totalCOGS) },
        gross_profit: { total: grossProfit, formatted: fmt(grossProfit), margin: grossMargin },
        opex: { total: totalOpEx, formatted: fmt(totalOpEx) },
        other_income: { total: totalOtherIncome, formatted: fmt(totalOtherIncome) },
        other_expense: { total: totalOtherExpense, formatted: fmt(totalOtherExpense) },
        net_income: { total: netIncome, formatted: fmt(netIncome), margin: netMargin },
      },

      monthly_trend: trend.map(m => ({
        period: m.period,
        revenue: m.revenue,
        revenue_formatted: fmt(m.revenue),
        cogs: m.cogs,
        opex: m.opex,
        net_income: m.ni,
        net_income_formatted: fmt(m.ni),
      })),

      top_accounts: topAccounts.map(a => ({
        name: a.name,
        type: a.type,
        total: a.total,
        formatted: fmt(Math.abs(a.total)),
        budget: budgetByAccount[a.name] ? fmt(Math.abs(budgetByAccount[a.name])) : '\u2014',
      })),

      budget_variance: {
        total_budget: totalBudget,
        total_budget_formatted: fmt(totalBudget),
        top_variances: variances.map(v => ({
          account: v.name,
          actual: fmt(v.actual),
          budget: fmt(v.budget),
          variance: fmt(v.diff),
          variance_pct: delta(v.pct),
          status: Math.abs(v.pct) > 15 ? 'critical' : Math.abs(v.pct) > 5 ? 'warning' : 'on_track',
        })),
      },

      headcount: deptPlans ? {
        total: totalHeadcount,
        total_budget: fmt(totalDeptBudget),
        departments: deptPlans.map(d => ({
          name: d.department.replace(/_/g, ' '),
          current: d.current,
          planned: d.current + d.net_new,
          net_new: d.net_new,
          budget: fmt(d.budget),
          utilization: pct(d.utilization * 100),
        })),
      } : null,

      alerts_summary: alerts ? {
        total: alerts.length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        items: alerts.slice(0, 5).map(a => ({
          title: a.title,
          severity: a.severity,
          deviation: a.deviation_pct ? pct(a.deviation_pct) : null,
        })),
      } : { total: 0, critical: 0, high: 0, items: [] },

      key_observations: [
        totalRevenue > 0 ? `Revenue of ${fmt(totalRevenue)} across ${months.length} months` : null,
        revGrowth > 5 ? `Strong revenue momentum at ${delta(revGrowth)} MoM growth` : revGrowth < -5 ? `Revenue declining at ${delta(revGrowth)} MoM \u2014 requires attention` : null,
        grossMargin > 80 ? `Healthy gross margins at ${pct(grossMargin)}` : grossMargin < 60 ? `Gross margin pressure at ${pct(grossMargin)} \u2014 review COGS structure` : null,
        netMargin < 0 ? `Operating at a loss (${pct(netMargin)} net margin) \u2014 path to profitability needed` : netMargin > 15 ? `Strong profitability at ${pct(netMargin)} net margin` : null,
        variances.length > 0 && variances[0].pct > 15 ? `${variances[0].name} is ${delta(variances[0].pct)} over budget \u2014 largest variance` : null,
        alerts && alerts.filter(a => a.severity === 'critical').length > 0 ? `${alerts.filter(a => a.severity === 'critical').length} critical alert(s) require immediate attention` : null,
      ].filter(Boolean),
    };

    // Save to generated_reports
    try {
      await supabase.from('generated_reports').insert({
        org_id: orgId,
        user_id: user.id,
        report_type: 'board_deck',
        title: reportTitle,
        data: report,
        format: 'json',
      });
    } catch {}

    // Audit log
    try {
      await supabase.from('audit_log').insert({
        user_id: user.id,
        org_id: orgId,
        action: 'report.board_deck_generated',
        resource_type: 'report',
        metadata: { title: reportTitle, periods: months.length, accounts: topAccounts.length },
      });
    } catch {}

    return new Response(JSON.stringify({ success: true, report }), { status: 200, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Board deck generation failed' }), { status: 500, headers });
  }
});
