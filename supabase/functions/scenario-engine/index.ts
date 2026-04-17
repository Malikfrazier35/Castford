import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function fmt(v: number): string { const a=Math.abs(v); if(a>=1e6)return'$'+(v/1e6).toFixed(1)+'M'; if(a>=1e3)return'$'+(v/1e3).toFixed(0)+'K'; return'$'+v.toFixed(0); }

/*
  scenario-engine v1
  What-if analysis for CFOs.
  
  Actions:
  - create: Create a new scenario with assumptions
  - compute: Run the scenario against live GL data and compute P&L impact
  - list: Get all scenarios for the org
  - get: Get a specific scenario with results
  - templates: Get pre-built scenario templates
  
  Scenario types:
  - revenue_change: What if revenue drops/grows by X%?
  - headcount: What if we hire/fire N people at $Y avg salary?
  - cost_reduction: What if we cut department X by Y%?
  - pricing_change: What if we increase prices by X%?
  - custom: Arbitrary assumption set
*/

const TEMPLATES = [
  { name: 'Revenue downturn', type: 'revenue_change', description: 'Model the impact of a revenue decline', assumptions: { revenue_change_pct: -20 } },
  { name: 'Aggressive growth', type: 'revenue_change', description: 'Project P&L at 30% revenue growth', assumptions: { revenue_change_pct: 30 } },
  { name: 'Hiring plan', type: 'headcount', description: 'Add headcount and see margin impact', assumptions: { new_hires: 5, avg_salary: 120000, departments: ['Engineering'] } },
  { name: 'Cost reduction', type: 'cost_reduction', description: 'Cut a department budget and see savings', assumptions: { target_department: 'Cloud Infrastructure', reduction_pct: 25 } },
  { name: 'Price increase', type: 'pricing_change', description: 'Raise prices and model revenue impact', assumptions: { price_increase_pct: 15, churn_increase_pct: 5 } },
  { name: 'Recession scenario', type: 'custom', description: 'Revenue -15%, freeze hiring, cut OpEx 10%', assumptions: { revenue_change_pct: -15, opex_change_pct: -10, hiring_freeze: true } },
]

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  const { data: { user }, error: ae } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (ae || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })
  const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })
  const orgId = profile.org_id

  try {
    const body = await req.json()
    const action = body.action || 'templates'

    // === TEMPLATES ===
    if (action === 'templates') {
      return new Response(JSON.stringify({ templates: TEMPLATES }), { headers })
    }

    // === LIST ===
    if (action === 'list') {
      const { data: scenarios } = await sb.from('scenarios').select('id, name, scenario_type, status, assumptions, results, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(20)
      return new Response(JSON.stringify({ scenarios: scenarios || [] }), { headers })
    }

    // === GET ===
    if (action === 'get') {
      if (!body.scenario_id) return new Response(JSON.stringify({ error: 'scenario_id required' }), { status: 400, headers })
      const { data: scenario } = await sb.from('scenarios').select('*').eq('id', body.scenario_id).eq('org_id', orgId).maybeSingle()
      return new Response(JSON.stringify({ scenario }), { headers })
    }

    // === CREATE ===
    if (action === 'create') {
      const { data: scenario } = await sb.from('scenarios').insert({
        org_id: orgId, user_id: user.id, name: body.name || 'New Scenario',
        description: body.description || '', scenario_type: body.scenario_type || 'custom',
        assumptions: body.assumptions || {}, status: 'draft',
      }).select('id').single()
      return new Response(JSON.stringify({ status: 'created', scenario_id: scenario?.id }), { headers })
    }

    // === COMPUTE ===
    if (action === 'compute') {
      const scenarioId = body.scenario_id
      let assumptions = body.assumptions || {}

      if (scenarioId) {
        const { data: s } = await sb.from('scenarios').select('assumptions').eq('id', scenarioId).eq('org_id', orgId).maybeSingle()
        if (s) assumptions = { ...s.assumptions, ...assumptions }
      }

      // Pull current GL data
      const { data: txns } = await sb.from('gl_transactions').select('amount, period, gl_accounts(name, account_type)').eq('org_id', orgId)
      if (!txns?.length) return new Response(JSON.stringify({ error: 'No GL data to model against' }), { status: 200, headers })

      let revenue = 0, cogs = 0, opex = 0
      const opexByDept: Record<string, number> = {}
      ;(txns || []).forEach((t: any) => {
        const at = t.gl_accounts?.account_type; const name = t.gl_accounts?.name || ''; const amt = Math.abs(Number(t.amount) || 0)
        if (at === 'revenue' || at === 'other_income') revenue += amt
        else if (at === 'cost_of_revenue') cogs += amt
        else if (at === 'expense' || at === 'other_expense') { opex += amt; opexByDept[name] = (opexByDept[name] || 0) + amt }
      })

      const gp = revenue - cogs; const ni = revenue - cogs - opex
      const baseline = { revenue, cogs, gross_profit: gp, gross_margin: revenue > 0 ? Math.round(gp / revenue * 1000) / 10 : 0, opex, net_income: ni, net_margin: revenue > 0 ? Math.round(ni / revenue * 1000) / 10 : 0 }

      // Apply assumptions
      let adjRevenue = revenue, adjCogs = cogs, adjOpex = opex

      if (assumptions.revenue_change_pct) adjRevenue = revenue * (1 + assumptions.revenue_change_pct / 100)
      if (assumptions.cogs_change_pct) adjCogs = cogs * (1 + assumptions.cogs_change_pct / 100)
      if (assumptions.opex_change_pct) adjOpex = opex * (1 + assumptions.opex_change_pct / 100)

      // Headcount changes
      if (assumptions.new_hires && assumptions.avg_salary) {
        const additionalCost = assumptions.new_hires * assumptions.avg_salary * 1.3 // 30% burden
        adjOpex += additionalCost
      }
      if (assumptions.layoffs && assumptions.avg_salary) {
        const savings = assumptions.layoffs * assumptions.avg_salary * 1.3
        adjOpex -= savings
      }

      // Department-specific cuts
      if (assumptions.target_department && assumptions.reduction_pct) {
        const deptCost = opexByDept[assumptions.target_department] || 0
        const cut = deptCost * (assumptions.reduction_pct / 100)
        adjOpex -= cut
      }

      // Pricing changes (revenue impact with churn offset)
      if (assumptions.price_increase_pct) {
        const churnOffset = assumptions.churn_increase_pct ? (1 - assumptions.churn_increase_pct / 100) : 1
        adjRevenue = revenue * (1 + assumptions.price_increase_pct / 100) * churnOffset
      }

      // COGS scales with revenue proportionally
      if (adjRevenue !== revenue) adjCogs = cogs * (adjRevenue / revenue)

      const adjGp = adjRevenue - adjCogs; const adjNi = adjRevenue - adjCogs - adjOpex
      const scenario_result = {
        baseline, adjusted: {
          revenue: Math.round(adjRevenue), cogs: Math.round(adjCogs), gross_profit: Math.round(adjGp),
          gross_margin: adjRevenue > 0 ? Math.round(adjGp / adjRevenue * 1000) / 10 : 0,
          opex: Math.round(adjOpex), net_income: Math.round(adjNi),
          net_margin: adjRevenue > 0 ? Math.round(adjNi / adjRevenue * 1000) / 10 : 0,
        },
        impact: {
          revenue_delta: Math.round(adjRevenue - revenue), revenue_delta_pct: revenue > 0 ? Math.round((adjRevenue - revenue) / revenue * 1000) / 10 : 0,
          opex_delta: Math.round(adjOpex - opex), opex_delta_pct: opex > 0 ? Math.round((adjOpex - opex) / opex * 1000) / 10 : 0,
          ni_delta: Math.round(adjNi - ni), ni_delta_pct: ni !== 0 ? Math.round((adjNi - ni) / Math.abs(ni) * 1000) / 10 : 0,
          margin_delta: Math.round((adjNi / (adjRevenue || 1) - ni / (revenue || 1)) * 1000) / 10,
        },
        summary: {
          revenue: fmt(adjRevenue) + ' (' + (adjRevenue >= revenue ? '+' : '') + fmt(adjRevenue - revenue) + ')',
          net_income: fmt(adjNi) + ' (' + (adjNi >= ni ? '+' : '') + fmt(adjNi - ni) + ')',
          margin: (adjRevenue > 0 ? (adjNi / adjRevenue * 100).toFixed(1) : '0') + '% (' + (adjNi / (adjRevenue || 1) >= ni / (revenue || 1) ? '+' : '') + ((adjNi / (adjRevenue || 1) - ni / (revenue || 1)) * 100).toFixed(1) + 'pp)',
        },
        assumptions_applied: assumptions,
      }

      // Save results if scenario exists
      if (scenarioId) {
        await sb.from('scenarios').update({ results: scenario_result, status: 'computed', updated_at: new Date().toISOString() }).eq('id', scenarioId)
      }

      try { await sb.from('audit_log').insert({ user_id: user.id, org_id: orgId, action: 'scenario.computed', resource_type: 'scenario', metadata: { scenario_id: scenarioId, assumptions, impact: scenario_result.impact } }) } catch {}

      return new Response(JSON.stringify(scenario_result), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown action. Use: templates, create, compute, list, get' }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers })
  }
})
