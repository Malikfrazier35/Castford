import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function fmt(v: number): string { const a=Math.abs(v); if(a>=1e6)return'$'+(v/1e6).toFixed(1)+'M'; if(a>=1e3)return'$'+(v/1e3).toFixed(0)+'K'; return'$'+v.toFixed(0); }

/*
  budget-brain v1
  Budget creation, variance analysis, and budget-vs-actual tracking.
  
  Actions:
  - create_version: Create a new budget version (draft)
  - set_budget: Set budget amount for an account + period
  - variance: Compare actuals vs budget with drill-down
  - summary: High-level budget vs actual overview
  - list_versions: List all budget versions for the org
  - approve: Mark a version as approved/active
  - auto_budget: Generate budget from historical actuals + growth rate
*/

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const authHeader = req.headers.get('Authorization')
  const cronSecret = req.headers.get('x-cron-secret')
  const expectedSecret = Deno.env.get('CRON_SECRET') || ''
  let userId: string | null = null, orgId: string | null = null

  if (cronSecret && expectedSecret && cronSecret === expectedSecret) {
    // cron ok
  } else if (authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
    if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })
    userId = user.id
    const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
    orgId = profile?.org_id || null
  } else return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })

  try {
    const body = await req.json()
    const action = body.action || 'summary'
    const targetOrgId = body.org_id || orgId
    if (!targetOrgId) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })

    // === LIST VERSIONS ===
    if (action === 'list_versions') {
      const { data: versions } = await sb.from('budget_versions').select('id, name, fiscal_year, status, total_revenue, total_opex, total_net_income, approved_at, created_at').eq('org_id', targetOrgId).order('created_at', { ascending: false })
      return new Response(JSON.stringify({ versions: versions || [] }), { headers })
    }

    // === CREATE VERSION ===
    if (action === 'create_version') {
      const name = body.name || 'Operating Budget'
      const fy = body.fiscal_year || new Date().getFullYear().toString()
      const { data: version } = await sb.from('budget_versions').insert({ org_id: targetOrgId, name, fiscal_year: fy, status: 'draft' }).select('id').single()
      return new Response(JSON.stringify({ status: 'created', version_id: version?.id, name, fiscal_year: fy }), { headers })
    }

    // === SET BUDGET (create/update budget entry for account + period) ===
    if (action === 'set_budget') {
      const { account_id, period, amount } = body
      if (!account_id || !period || amount === undefined) return new Response(JSON.stringify({ error: 'account_id, period, and amount required' }), { status: 400, headers })
      await sb.from('gl_budgets').upsert({ org_id: targetOrgId, account_id, period, amount: Number(amount) }, { onConflict: 'org_id,account_id,period' })
      return new Response(JSON.stringify({ status: 'set', account_id, period, amount }), { headers })
    }

    // === APPROVE VERSION ===
    if (action === 'approve') {
      if (!body.version_id) return new Response(JSON.stringify({ error: 'version_id required' }), { status: 400, headers })
      await sb.from('budget_versions').update({ status: 'approved', approved_by: userId, approved_at: new Date().toISOString() }).eq('id', body.version_id)
      return new Response(JSON.stringify({ status: 'approved' }), { headers })
    }

    // === VARIANCE (detailed budget vs actual by account) ===
    if (action === 'variance') {
      const period = body.period // optional: filter to specific period
      let txnQuery = sb.from('gl_transactions').select('account_id, amount, period, gl_accounts(name, account_type)').eq('org_id', targetOrgId)
      let budgetQuery = sb.from('gl_budgets').select('account_id, amount, period, gl_accounts(name, account_type)').eq('org_id', targetOrgId)
      if (period) { txnQuery = txnQuery.eq('period', period); budgetQuery = budgetQuery.eq('period', period) }

      const [{ data: txns }, { data: budgets }] = await Promise.all([txnQuery, budgetQuery])

      const actualByAcct: Record<string, { total: number, name: string, type: string }> = {}
      const budgetByAcct: Record<string, { total: number, name: string, type: string }> = {}
      ;(txns || []).forEach((t: any) => { const aid = t.account_id; if (!actualByAcct[aid]) actualByAcct[aid] = { total: 0, name: t.gl_accounts?.name || 'Unknown', type: t.gl_accounts?.account_type || '' }; actualByAcct[aid].total += Math.abs(Number(t.amount) || 0) })
      ;(budgets || []).forEach((b: any) => { const aid = b.account_id; if (!budgetByAcct[aid]) budgetByAcct[aid] = { total: 0, name: b.gl_accounts?.name || 'Unknown', type: b.gl_accounts?.account_type || '' }; budgetByAcct[aid].total += Math.abs(Number(b.amount) || 0) })

      const allAccounts = new Set([...Object.keys(actualByAcct), ...Object.keys(budgetByAcct)])
      const variances: any[] = []
      let totalActual = 0, totalBudget = 0

      for (const aid of allAccounts) {
        const actual = actualByAcct[aid]?.total || 0
        const budget = budgetByAcct[aid]?.total || 0
        const variance = actual - budget
        const variancePct = budget > 0 ? Math.round((variance / budget) * 1000) / 10 : 0
        const name = actualByAcct[aid]?.name || budgetByAcct[aid]?.name || 'Unknown'
        const type = actualByAcct[aid]?.type || budgetByAcct[aid]?.type || ''
        variances.push({ account_id: aid, name, type, actual, budget, variance, variance_pct: variancePct, status: Math.abs(variancePct) > 15 ? 'alert' : 'ok' })
        totalActual += actual; totalBudget += budget
      }

      variances.sort((a, b) => Math.abs(b.variance_pct) - Math.abs(a.variance_pct))

      return new Response(JSON.stringify({
        period: period || 'all', total_actual: totalActual, total_budget: totalBudget,
        total_variance: totalActual - totalBudget, total_variance_pct: totalBudget > 0 ? Math.round((totalActual - totalBudget) / totalBudget * 1000) / 10 : 0,
        accounts: variances, alerts: variances.filter(v => v.status === 'alert').length,
      }), { headers })
    }

    // === SUMMARY (high-level budget vs actual) ===
    if (action === 'summary') {
      const { data: txns } = await sb.from('gl_transactions').select('amount, gl_accounts(account_type)').eq('org_id', targetOrgId)
      const { data: budgets } = await sb.from('gl_budgets').select('amount, gl_accounts(account_type)').eq('org_id', targetOrgId)

      let actRev = 0, actCogs = 0, actOpex = 0, budRev = 0, budCogs = 0, budOpex = 0
      ;(txns || []).forEach((t: any) => { const at = t.gl_accounts?.account_type; const amt = Math.abs(Number(t.amount) || 0); if (at === 'revenue' || at === 'other_income') actRev += amt; else if (at === 'cost_of_revenue') actCogs += amt; else actOpex += amt })
      ;(budgets || []).forEach((b: any) => { const at = b.gl_accounts?.account_type; const amt = Math.abs(Number(b.amount) || 0); if (at === 'revenue' || at === 'other_income') budRev += amt; else if (at === 'cost_of_revenue') budCogs += amt; else budOpex += amt })

      const actNI = actRev - actCogs - actOpex; const budNI = budRev - budCogs - budOpex

      return new Response(JSON.stringify({
        actual: { revenue: actRev, cogs: actCogs, opex: actOpex, net_income: actNI, gross_margin: actRev > 0 ? Math.round((actRev - actCogs) / actRev * 1000) / 10 : 0 },
        budget: { revenue: budRev, cogs: budCogs, opex: budOpex, net_income: budNI, gross_margin: budRev > 0 ? Math.round((budRev - budCogs) / budRev * 1000) / 10 : 0 },
        variance: {
          revenue: { amount: actRev - budRev, pct: budRev > 0 ? Math.round((actRev - budRev) / budRev * 1000) / 10 : 0, display: fmt(actRev - budRev) },
          opex: { amount: actOpex - budOpex, pct: budOpex > 0 ? Math.round((actOpex - budOpex) / budOpex * 1000) / 10 : 0, display: fmt(actOpex - budOpex) },
          net_income: { amount: actNI - budNI, pct: budNI !== 0 ? Math.round((actNI - budNI) / Math.abs(budNI) * 1000) / 10 : 0, display: fmt(actNI - budNI) },
        },
        summary: { revenue: fmt(actRev) + ' vs ' + fmt(budRev), opex: fmt(actOpex) + ' vs ' + fmt(budOpex), net_income: fmt(actNI) + ' vs ' + fmt(budNI) },
      }), { headers })
    }

    // === AUTO BUDGET (generate budget from historical actuals + growth rate) ===
    if (action === 'auto_budget') {
      const growthRate = body.growth_rate || 0.10 // default 10% growth
      const { data: txns } = await sb.from('gl_transactions').select('account_id, amount, period, gl_accounts(name, account_type)').eq('org_id', targetOrgId)
      if (!txns?.length) return new Response(JSON.stringify({ error: 'No historical data' }), { status: 200, headers })

      // Get monthly averages by account
      const byAcctMonth: Record<string, Record<string, number>> = {}
      ;(txns || []).forEach((t: any) => { const aid = t.account_id; const p = t.period || ''; if (!p) return; if (!byAcctMonth[aid]) byAcctMonth[aid] = {}; byAcctMonth[aid][p] = (byAcctMonth[aid][p] || 0) + Math.abs(Number(t.amount) || 0) })

      const budgetEntries: any[] = []
      const now = new Date()
      const nextYear = now.getFullYear() + (now.getMonth() >= 10 ? 1 : 0)

      for (const [aid, months] of Object.entries(byAcctMonth)) {
        const vals = Object.values(months)
        const avg = vals.reduce((s, v) => s + v, 0) / vals.length
        const budgetAmount = Math.round(avg * (1 + growthRate))
        for (let m = 1; m <= 12; m++) {
          const period = `${nextYear}-${String(m).padStart(2, '0')}`
          budgetEntries.push({ org_id: targetOrgId, account_id: aid, period, amount: budgetAmount })
        }
      }

      // Upsert budgets
      for (const entry of budgetEntries) {
        await sb.from('gl_budgets').upsert(entry, { onConflict: 'org_id,account_id,period' })
      }

      return new Response(JSON.stringify({ status: 'generated', accounts: Object.keys(byAcctMonth).length, entries: budgetEntries.length, growth_rate: growthRate, fiscal_year: nextYear }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown action. Use: summary, variance, create_version, set_budget, approve, list_versions, auto_budget' }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers })
  }
})
