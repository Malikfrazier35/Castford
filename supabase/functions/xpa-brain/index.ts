import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function fmt(v: number): string { const a=Math.abs(v); if(a>=1e6)return'$'+(v/1e6).toFixed(1)+'M'; if(a>=1e3)return'$'+(v/1e3).toFixed(0)+'K'; return'$'+v.toFixed(0); }

/*
  xpa-brain v1
  Extended Planning & Analysis — cross-departmental financial planning.
  Business plan feature (Growth gets 4 depts, Business gets 7).
  
  Actions:
  - overview: Cross-departmental summary with roll-up to P&L impact
  - department: Get/update a specific department's plan and KPIs
  - headcount_plan: Organization-wide headcount plan with burden costs
  - revenue_bridge: Bridge from current revenue to target with drivers
  - opex_waterfall: OpEx waterfall by department showing budget vs actual
  - seed_departments: Create initial department plans from GL data
*/

const DEPARTMENTS = [
  { key: 'sales', name: 'Sales', revenue_generating: true, default_kpis: ['quota_attainment', 'pipeline_coverage', 'win_rate', 'avg_deal_size', 'sales_cycle_days'] },
  { key: 'engineering', name: 'Engineering', revenue_generating: false, default_kpis: ['velocity', 'deployment_frequency', 'uptime', 'tech_debt_ratio', 'cost_per_engineer'] },
  { key: 'marketing', name: 'Marketing', revenue_generating: true, default_kpis: ['cac', 'mqls', 'pipeline_generated', 'brand_awareness', 'content_velocity'] },
  { key: 'customer_success', name: 'Customer Success', revenue_generating: true, default_kpis: ['nrr', 'churn_rate', 'nps', 'time_to_value', 'expansion_revenue'] },
  { key: 'product', name: 'Product', revenue_generating: false, default_kpis: ['feature_adoption', 'dau_mau', 'activation_rate', 'support_tickets', 'release_cadence'] },
  { key: 'operations', name: 'Operations', revenue_generating: false, default_kpis: ['cost_efficiency', 'vendor_spend', 'compliance_score', 'process_automation_pct'] },
  { key: 'hr', name: 'People & HR', revenue_generating: false, default_kpis: ['attrition_rate', 'time_to_hire', 'engagement_score', 'dei_metrics', 'training_hours'] },
]

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const authHeader = req.headers.get('Authorization')
  const cronSecret = req.headers.get('x-cron-secret')
  const expectedSecret = Deno.env.get('CRON_SECRET') || ''
  let userId: string | null = null, orgId: string | null = null

  if (cronSecret && expectedSecret && cronSecret === expectedSecret) { /* cron */ }
  else if (authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
    if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })
    userId = user.id; const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle(); orgId = profile?.org_id || null
  } else return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })

  try {
    const body = await req.json()
    const action = body.action || 'overview'
    const targetOrgId = body.org_id || orgId
    if (!targetOrgId) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })

    const fy = body.fiscal_year || new Date().getFullYear().toString()

    // === OVERVIEW ===
    if (action === 'overview') {
      const { data: plans } = await sb.from('department_plans').select('*').eq('org_id', targetOrgId).eq('fiscal_year', fy)
      if (!plans?.length) return new Response(JSON.stringify({ message: 'No department plans. Use action: seed_departments to create initial plans.', departments: DEPARTMENTS.map(d => d.key) }), { headers })

      let totalHeadcount = 0, totalPlanned = 0, totalBudget = 0, totalSpent = 0, totalRevTarget = 0, totalSalaryCost = 0
      const deptSummaries = plans.map((p: any) => {
        totalHeadcount += p.headcount_current || 0; totalPlanned += p.headcount_planned || 0
        totalBudget += Number(p.budget_total) || 0; totalSpent += Number(p.budget_spent) || 0
        totalRevTarget += Number(p.revenue_target) || 0
        const salaryCost = (p.headcount_current || 0) * (Number(p.avg_salary) || 0) * 1.3
        totalSalaryCost += salaryCost
        return {
          department: p.department, headcount: p.headcount_current, planned: p.headcount_planned,
          budget: Number(p.budget_total), spent: Number(p.budget_spent),
          utilization: p.budget_total > 0 ? Math.round(Number(p.budget_spent) / Number(p.budget_total) * 100) : 0,
          revenue_target: Number(p.revenue_target), salary_cost: Math.round(salaryCost),
        }
      })

      return new Response(JSON.stringify({
        fiscal_year: fy, departments: deptSummaries.length,
        totals: { headcount_current: totalHeadcount, headcount_planned: totalPlanned, net_new: totalPlanned - totalHeadcount, total_budget: totalBudget, total_spent: totalSpent, budget_utilization: totalBudget > 0 ? Math.round(totalSpent / totalBudget * 100) : 0, revenue_target: totalRevTarget, total_salary_cost: Math.round(totalSalaryCost) },
        summary: { headcount: `${totalHeadcount} current → ${totalPlanned} planned (+${totalPlanned - totalHeadcount})`, budget: `${fmt(totalSpent)} / ${fmt(totalBudget)} (${totalBudget > 0 ? Math.round(totalSpent / totalBudget * 100) : 0}%)`, salary_burden: fmt(totalSalaryCost) },
        departments: deptSummaries,
      }), { headers })
    }

    // === DEPARTMENT (get/update single department) ===
    if (action === 'department') {
      const dept = body.department
      if (!dept) return new Response(JSON.stringify({ error: 'department required', valid: DEPARTMENTS.map(d => d.key) }), { status: 400, headers })

      if (body.update) {
        // Update department plan
        await sb.from('department_plans').update({ ...body.update, updated_at: new Date().toISOString() }).eq('org_id', targetOrgId).eq('department', dept).eq('fiscal_year', fy)
        return new Response(JSON.stringify({ status: 'updated', department: dept }), { headers })
      }

      const { data: plan } = await sb.from('department_plans').select('*').eq('org_id', targetOrgId).eq('department', dept).eq('fiscal_year', fy).maybeSingle()
      if (!plan) return new Response(JSON.stringify({ error: `No plan for ${dept} in ${fy}` }), { status: 404, headers })
      const deptMeta = DEPARTMENTS.find(d => d.key === dept)
      return new Response(JSON.stringify({ ...plan, department_name: deptMeta?.name, revenue_generating: deptMeta?.revenue_generating, available_kpis: deptMeta?.default_kpis }), { headers })
    }

    // === HEADCOUNT PLAN ===
    if (action === 'headcount_plan') {
      const { data: plans } = await sb.from('department_plans').select('department, headcount_current, headcount_planned, avg_salary').eq('org_id', targetOrgId).eq('fiscal_year', fy)
      if (!plans?.length) return new Response(JSON.stringify({ error: 'No department plans' }), { status: 404, headers })

      const rows = plans.map((p: any) => {
        const netNew = (p.headcount_planned || 0) - (p.headcount_current || 0)
        const currentCost = (p.headcount_current || 0) * (Number(p.avg_salary) || 0) * 1.3
        const plannedCost = (p.headcount_planned || 0) * (Number(p.avg_salary) || 0) * 1.3
        return { department: p.department, current: p.headcount_current, planned: p.headcount_planned, net_new: netNew, avg_salary: Number(p.avg_salary), current_burden: Math.round(currentCost), planned_burden: Math.round(plannedCost), incremental_cost: Math.round(plannedCost - currentCost) }
      })

      const totalCurrent = rows.reduce((s, r) => s + r.current, 0)
      const totalPlanned = rows.reduce((s, r) => s + r.planned, 0)
      const totalCurrentBurden = rows.reduce((s, r) => s + r.current_burden, 0)
      const totalPlannedBurden = rows.reduce((s, r) => s + r.planned_burden, 0)

      return new Response(JSON.stringify({
        fiscal_year: fy, departments: rows,
        totals: { current_headcount: totalCurrent, planned_headcount: totalPlanned, net_new: totalPlanned - totalCurrent, current_burden: totalCurrentBurden, planned_burden: totalPlannedBurden, incremental_cost: totalPlannedBurden - totalCurrentBurden },
        summary: { headcount: `${totalCurrent} → ${totalPlanned} (+${totalPlanned - totalCurrent})`, burden: `${fmt(totalCurrentBurden)} → ${fmt(totalPlannedBurden)} (+${fmt(totalPlannedBurden - totalCurrentBurden)})` },
      }), { headers })
    }

    // === REVENUE BRIDGE ===
    if (action === 'revenue_bridge') {
      const { data: txns } = await sb.from('gl_transactions').select('amount, gl_accounts(account_type)').eq('org_id', targetOrgId)
      let currentRevenue = 0
      ;(txns || []).forEach((t: any) => { if (t.gl_accounts?.account_type === 'revenue' || t.gl_accounts?.account_type === 'other_income') currentRevenue += Math.abs(Number(t.amount) || 0) })

      const { data: salesPlan } = await sb.from('department_plans').select('revenue_target, pipeline_value, quota_attainment, kpis').eq('org_id', targetOrgId).eq('department', 'sales').eq('fiscal_year', fy).maybeSingle()
      const { data: csPlan } = await sb.from('department_plans').select('revenue_target, churn_rate, kpis').eq('org_id', targetOrgId).eq('department', 'customer_success').eq('fiscal_year', fy).maybeSingle()

      const targetRevenue = Number(salesPlan?.revenue_target) || currentRevenue * 1.2
      const gap = targetRevenue - currentRevenue
      const churnRate = Number(csPlan?.churn_rate) || 5
      const churnImpact = currentRevenue * (churnRate / 100)
      const expansionRevenue = Number(csPlan?.revenue_target) || currentRevenue * 0.1
      const newBizNeeded = gap + churnImpact - expansionRevenue

      return new Response(JSON.stringify({
        current_revenue: currentRevenue, target_revenue: targetRevenue, gap,
        bridge: [
          { driver: 'Current run rate', amount: currentRevenue, cumulative: currentRevenue },
          { driver: 'Expected churn', amount: -churnImpact, cumulative: currentRevenue - churnImpact },
          { driver: 'Expansion revenue', amount: expansionRevenue, cumulative: currentRevenue - churnImpact + expansionRevenue },
          { driver: 'New business needed', amount: newBizNeeded, cumulative: targetRevenue },
        ],
        summary: { current: fmt(currentRevenue), target: fmt(targetRevenue), gap: fmt(gap), churn_offset: fmt(churnImpact), expansion: fmt(expansionRevenue), new_biz: fmt(newBizNeeded) },
      }), { headers })
    }

    // === OPEX WATERFALL ===
    if (action === 'opex_waterfall') {
      const { data: plans } = await sb.from('department_plans').select('department, budget_total, budget_spent').eq('org_id', targetOrgId).eq('fiscal_year', fy)
      if (!plans?.length) return new Response(JSON.stringify({ error: 'No department plans' }), { status: 404, headers })

      const waterfall = plans.map((p: any) => ({ department: p.department, budget: Number(p.budget_total), actual: Number(p.budget_spent), variance: Number(p.budget_spent) - Number(p.budget_total), variance_pct: Number(p.budget_total) > 0 ? Math.round((Number(p.budget_spent) - Number(p.budget_total)) / Number(p.budget_total) * 1000) / 10 : 0 }))
      waterfall.sort((a: any, b: any) => Math.abs(b.variance) - Math.abs(a.variance))
      const totalBudget = waterfall.reduce((s: number, w: any) => s + w.budget, 0)
      const totalActual = waterfall.reduce((s: number, w: any) => s + w.actual, 0)

      return new Response(JSON.stringify({ fiscal_year: fy, waterfall, totals: { budget: totalBudget, actual: totalActual, variance: totalActual - totalBudget, variance_pct: totalBudget > 0 ? Math.round((totalActual - totalBudget) / totalBudget * 1000) / 10 : 0 } }), { headers })
    }

    // === SEED DEPARTMENTS (create initial plans from GL data) ===
    if (action === 'seed_departments') {
      const { data: txns } = await sb.from('gl_transactions').select('amount, gl_accounts(name, account_type)').eq('org_id', targetOrgId)
      let revenue = 0, opex = 0
      const opexByDept: Record<string, number> = {}
      ;(txns || []).forEach((t: any) => {
        const at = t.gl_accounts?.account_type; const name = t.gl_accounts?.name || ''; const amt = Math.abs(Number(t.amount) || 0)
        if (at === 'revenue' || at === 'other_income') revenue += amt
        else if (at === 'expense' || at === 'other_expense') { opex += amt; opexByDept[name] = (opexByDept[name] || 0) + amt }
      })

      // Distribute opex across departments using typical SaaS ratios
      const deptRatios: Record<string, number> = { sales: 0.25, engineering: 0.30, marketing: 0.15, customer_success: 0.10, product: 0.08, operations: 0.07, hr: 0.05 }
      const plans = DEPARTMENTS.map(d => ({
        org_id: targetOrgId, department: d.key, fiscal_year: fy,
        headcount_current: Math.round((deptRatios[d.key] || 0.1) * 50), // Estimate ~50 total employees
        headcount_planned: Math.round((deptRatios[d.key] || 0.1) * 60), // Plan for 20% growth
        avg_salary: d.key === 'engineering' ? 150000 : d.key === 'sales' ? 130000 : 110000,
        budget_total: Math.round(opex * (deptRatios[d.key] || 0.1)),
        budget_spent: Math.round(opex * (deptRatios[d.key] || 0.1) * (0.7 + Math.random() * 0.4)), // 70-110% utilization
        revenue_target: d.revenue_generating ? Math.round(revenue * (d.key === 'sales' ? 0.7 : d.key === 'marketing' ? 0.2 : 0.1)) : 0,
        pipeline_value: d.key === 'sales' ? Math.round(revenue * 2.5) : 0,
        quota_attainment: d.key === 'sales' ? 85 + Math.round(Math.random() * 20) : 0,
        cac: d.key === 'marketing' ? Math.round(5000 + Math.random() * 10000) : 0,
        churn_rate: d.key === 'customer_success' ? Math.round(3 + Math.random() * 5) : 0,
        nps_score: d.key === 'customer_success' ? Math.round(30 + Math.random() * 40) : 0,
        status: 'active',
      }))

      for (const plan of plans) {
        await sb.from('department_plans').upsert(plan, { onConflict: 'org_id,department,fiscal_year' })
      }

      return new Response(JSON.stringify({ status: 'seeded', departments: plans.length, fiscal_year: fy }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown action. Use: overview, department, headcount_plan, revenue_bridge, opex_waterfall, seed_departments' }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers })
  }
})
