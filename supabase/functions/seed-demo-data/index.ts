import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

/*
  seed-demo-data v1
  Called automatically after org creation (from verify-session or onboard).
  Seeds realistic GL accounts, transactions, and budgets so the dashboard
  isn't empty on first login. Purged when customer connects a real integration.

  Actions:
  - seed: Creates demo GL data for an org
  - purge: Removes all demo data when real data arrives
  - status: Check if org has demo or real data
*/

const DEMO_ACCOUNTS = [
  { name: 'Subscription Revenue', account_type: 'revenue', code: '4000' },
  { name: 'Services Revenue', account_type: 'revenue', code: '4100' },
  { name: 'Usage-Based Revenue', account_type: 'revenue', code: '4200' },
  { name: 'Hosting & Infrastructure', account_type: 'cost_of_revenue', code: '5000' },
  { name: 'Customer Support', account_type: 'cost_of_revenue', code: '5100' },
  { name: 'Third-Party Licenses', account_type: 'cost_of_revenue', code: '5200' },
  { name: 'Research & Development', account_type: 'expense', code: '6000' },
  { name: 'Sales & Marketing', account_type: 'expense', code: '6100' },
  { name: 'General & Administrative', account_type: 'expense', code: '6200' },
  { name: 'Payroll', account_type: 'expense', code: '6300' },
  { name: 'Software & Tools', account_type: 'expense', code: '6400' },
  { name: 'Office & Facilities', account_type: 'expense', code: '6500' },
]

function generateMonthlyData(baseAmount: number, volatility: number, months: number, growthRate: number = 0.02): number[] {
  const data: number[] = []
  let current = baseAmount
  for (let i = 0; i < months; i++) {
    const noise = (Math.random() - 0.5) * 2 * volatility * baseAmount
    current = current * (1 + growthRate) + noise
    data.push(Math.round(current))
  }
  return data
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-cron-secret' } })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers: { 'Content-Type': 'application/json' } })

  // Auth: service role (internal call) or user JWT
  const authHeader = req.headers.get('Authorization')
  let orgId: string | null = null
  let userId: string | null = null

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    // Try as user JWT first
    const { data: { user } } = await sb.auth.getUser(token)
    if (user) {
      userId = user.id
      const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
      orgId = profile?.org_id || null
    }
  }

  try {
    const body = await req.json()
    const action = body.action || 'seed'
    orgId = body.org_id || orgId

    if (!orgId) return new Response(JSON.stringify({ error: 'org_id required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })

    // === SEED ===
    if (action === 'seed') {
      // Check if org already has real data
      const { count: realTxns } = await sb.from('gl_transactions').select('id', { count: 'exact', head: true }).eq('org_id', orgId).neq('provider', 'demo_seed').not('provider', 'is', null)
      if ((realTxns || 0) > 0) return new Response(JSON.stringify({ status: 'skipped', reason: 'org_has_real_data' }), { headers: { 'Content-Type': 'application/json' } })

      // Check if demo data already exists
      const { count: demoTxns } = await sb.from('gl_transactions').select('id', { count: 'exact', head: true }).eq('org_id', orgId).eq('provider', 'demo_seed')
      if ((demoTxns || 0) > 0) return new Response(JSON.stringify({ status: 'skipped', reason: 'demo_already_seeded' }), { headers: { 'Content-Type': 'application/json' } })

      // Generate 9 months of data
      const now = new Date()
      const months: string[] = []
      for (let i = 8; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
      }

      // Create accounts
      const accountIds: Record<string, string> = {}
      for (const acct of DEMO_ACCOUNTS) {
        const { data: created } = await sb.from('gl_accounts').insert({
          org_id: orgId, name: acct.name, account_type: acct.account_type,
          external_id: `demo_${acct.code}`, provider: 'demo_seed', code: acct.code, active: true,
        }).select('id').single()
        if (created) accountIds[acct.code] = created.id
      }

      // Revenue profiles (monthly $K)
      const profiles: Record<string, { base: number, vol: number, growth: number }> = {
        '4000': { base: 4800, vol: 0.05, growth: 0.03 },  // Subscription: ~$4.8M/mo, growing
        '4100': { base: 530, vol: 0.1, growth: 0.01 },     // Services: ~$530K/mo
        '4200': { base: 190, vol: 0.15, growth: 0.05 },    // Usage: ~$190K/mo, growing fast
        '5000': { base: 420, vol: 0.08, growth: 0.02 },    // Hosting: ~$420K/mo
        '5100': { base: 270, vol: 0.05, growth: 0.01 },    // Support: ~$270K/mo
        '5200': { base: 130, vol: 0.03, growth: 0 },       // Licenses: ~$130K/mo
        '6000': { base: 1580, vol: 0.04, growth: 0.02 },   // R&D: ~$1.58M/mo
        '6100': { base: 1400, vol: 0.08, growth: 0.03 },   // Sales: ~$1.4M/mo
        '6200': { base: 700, vol: 0.05, growth: 0.01 },    // G&A: ~$700K/mo
        '6300': { base: 1200, vol: 0.02, growth: 0.015 },  // Payroll: ~$1.2M/mo
        '6400': { base: 180, vol: 0.1, growth: 0.02 },     // Software: ~$180K/mo
        '6500': { base: 95, vol: 0.03, growth: 0 },        // Office: ~$95K/mo
      }

      let txnCount = 0, budgetCount = 0

      for (const [code, profile] of Object.entries(profiles)) {
        const accountId = accountIds[code]
        if (!accountId) continue
        const monthly = generateMonthlyData(profile.base * 1000, profile.vol, 9, profile.growth)
        const isRevenue = code.startsWith('4')

        for (let m = 0; m < months.length; m++) {
          // Transaction
          const amount = isRevenue ? monthly[m] : -monthly[m]
          await sb.from('gl_transactions').insert({
            org_id: orgId, account_id: accountId, amount, period: months[m],
            txn_date: `${months[m]}-15`, description: 'Monthly aggregate',
            provider: 'demo_seed', external_id: `demo_${code}_${months[m]}`,
            currency: 'USD',
          })
          txnCount++

          // Budget (slightly different from actual to create variance)
          const budgetVariance = 1 + (Math.random() - 0.5) * 0.1 // ±5%
          await sb.from('gl_budgets').insert({
            org_id: orgId, account_id: accountId,
            amount: Math.round(monthly[m] * budgetVariance) * (isRevenue ? 1 : -1),
            period: months[m], version: 'v1',
          })
          budgetCount++
        }
      }

      await sb.from('audit_log').insert({
        org_id: orgId, user_id: userId, action: 'demo.data_seeded', resource_type: 'gl_data',
        metadata: { accounts: DEMO_ACCOUNTS.length, transactions: txnCount, budgets: budgetCount, months: months.length },
      }).catch(() => {})

      return new Response(JSON.stringify({
        status: 'seeded', accounts: Object.keys(accountIds).length,
        transactions: txnCount, budgets: budgetCount, months: months.length,
      }), { headers: { 'Content-Type': 'application/json' } })
    }

    // === PURGE ===
    if (action === 'purge') {
      const { count: purgedTxns } = await sb.from('gl_transactions').delete({ count: 'exact' }).eq('org_id', orgId).eq('provider', 'demo_seed')
      const { count: purgedBudgets } = await sb.from('gl_budgets').delete({ count: 'exact' }).eq('org_id', orgId).in('account_id',
        (await sb.from('gl_accounts').select('id').eq('org_id', orgId).eq('provider', 'demo_seed')).data?.map((a: any) => a.id) || []
      )
      const { count: purgedAccts } = await sb.from('gl_accounts').delete({ count: 'exact' }).eq('org_id', orgId).eq('provider', 'demo_seed')

      await sb.from('audit_log').insert({
        org_id: orgId, user_id: userId, action: 'demo.data_purged', resource_type: 'gl_data',
        metadata: { transactions: purgedTxns, budgets: purgedBudgets, accounts: purgedAccts },
      }).catch(() => {})

      return new Response(JSON.stringify({ status: 'purged', transactions: purgedTxns, budgets: purgedBudgets, accounts: purgedAccts }), { headers: { 'Content-Type': 'application/json' } })
    }

    // === STATUS ===
    if (action === 'status') {
      const { count: demoCount } = await sb.from('gl_transactions').select('id', { count: 'exact', head: true }).eq('org_id', orgId).eq('provider', 'demo_seed')
      const { count: realCount } = await sb.from('gl_transactions').select('id', { count: 'exact', head: true }).eq('org_id', orgId).neq('provider', 'demo_seed').not('provider', 'is', null)
      return new Response(JSON.stringify({ demo_transactions: demoCount || 0, real_transactions: realCount || 0, data_source: (realCount || 0) > 0 ? 'live' : (demoCount || 0) > 0 ? 'demo' : 'empty' }), { headers: { 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: 'Unknown action. Use: seed, purge, status' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    console.error('seed-demo-data error:', err)
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
