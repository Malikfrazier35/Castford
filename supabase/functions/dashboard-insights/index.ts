import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, GET, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function fmt(v: number): string { const a=Math.abs(v); if(a>=1e6)return'$'+(v/1e6).toFixed(1)+'M'; if(a>=1e3)return'$'+(v/1e3).toFixed(0)+'K'; return'$'+v.toFixed(0); }

/*
  dashboard-insights v1
  Proactive intelligence: on dashboard load, surfaces the top 3 most important
  financial observations without the user asking.
  
  Checks:
  1. Revenue trend (growing/declining/flat)
  2. Biggest budget variance
  3. Active alerts count
  4. Cash burn acceleration/deceleration
  5. Forecast vs actual deviation
  6. Data freshness (last sync)
*/

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })

  const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return new Response(JSON.stringify({ insights: [], message: 'Connect an integration to get started' }), { headers })
  const orgId = profile.org_id

  try {
    const insights: { icon: string, title: string, detail: string, type: string, priority: number }[] = []

    // Pull data in parallel
    const [txnRes, budgetRes, alertRes, integrationRes, lastSyncRes] = await Promise.all([
      sb.from('gl_transactions').select('amount, period, gl_accounts(name, account_type)').eq('org_id', orgId).order('period').limit(500),
      sb.from('gl_budgets').select('amount, period, gl_accounts(name, account_type)').eq('org_id', orgId),
      sb.from('financial_alerts').select('id, severity').eq('org_id', orgId).eq('status', 'active'),
      sb.from('integrations').select('provider, status, last_sync_at').eq('org_id', orgId),
      sb.from('sync_log').select('completed_at').eq('org_id', orgId).order('completed_at', { ascending: false }).limit(1),
    ])

    const txns = txnRes.data || []; const budgets = budgetRes.data || []; const alerts = alertRes.data || []
    if (!txns.length) {
      return new Response(JSON.stringify({ insights: [{ icon: 'info', title: 'No data yet', detail: 'Connect your ERP in Settings > Integrations to see proactive insights.', type: 'setup', priority: 0 }] }), { headers })
    }

    // === INSIGHT 1: Revenue trend ===
    const revByMonth: Record<string, number> = {}
    txns.forEach((t: any) => {
      if ((t.gl_accounts?.account_type === 'revenue' || t.gl_accounts?.account_type === 'other_income') && t.period) {
        revByMonth[t.period] = (revByMonth[t.period] || 0) + Math.abs(Number(t.amount) || 0)
      }
    })
    const months = Object.entries(revByMonth).sort()
    if (months.length >= 2) {
      const [, prevRev] = months[months.length - 2]
      const [currPeriod, currRev] = months[months.length - 1]
      const change = ((currRev - prevRev) / prevRev) * 100
      if (Math.abs(change) > 3) {
        insights.push({
          icon: change > 0 ? 'trending_up' : 'trending_down',
          title: `Revenue ${change > 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(1)}% in ${currPeriod}`,
          detail: `${fmt(currRev)} vs ${fmt(prevRev)} prior month — ${change > 0 ? 'growth' : 'decline'} of ${fmt(Math.abs(currRev - prevRev))}`,
          type: change > 0 ? 'positive' : 'negative',
          priority: Math.abs(change) > 15 ? 1 : 3,
        })
      }
    }

    // === INSIGHT 2: Biggest budget variance ===
    const actualByAcct: Record<string, { total: number, name: string }> = {}
    const budgetByAcct: Record<string, number> = {}
    txns.forEach((t: any) => {
      const name = t.gl_accounts?.name || 'Unknown'
      if (!actualByAcct[name]) actualByAcct[name] = { total: 0, name }
      actualByAcct[name].total += Math.abs(Number(t.amount) || 0)
    })
    budgets.forEach((b: any) => {
      const name = b.gl_accounts?.name || 'Unknown'
      budgetByAcct[name] = (budgetByAcct[name] || 0) + Math.abs(Number(b.amount) || 0)
    })

    let biggestVar = { name: '', pct: 0, actual: 0, budget: 0 }
    for (const [name, data] of Object.entries(actualByAcct)) {
      const budget = budgetByAcct[name]
      if (!budget || budget === 0) continue
      const pct = ((data.total - budget) / budget) * 100
      if (Math.abs(pct) > Math.abs(biggestVar.pct)) {
        biggestVar = { name, pct, actual: data.total, budget }
      }
    }
    if (Math.abs(biggestVar.pct) > 10) {
      insights.push({
        icon: 'warning',
        title: `${biggestVar.name}: ${biggestVar.pct > 0 ? 'over' : 'under'} budget by ${Math.abs(biggestVar.pct).toFixed(0)}%`,
        detail: `Actual ${fmt(biggestVar.actual)} vs Budget ${fmt(biggestVar.budget)} — ${fmt(Math.abs(biggestVar.actual - biggestVar.budget))} variance`,
        type: Math.abs(biggestVar.pct) > 30 ? 'negative' : 'warning',
        priority: 2,
      })
    }

    // === INSIGHT 3: Active alerts ===
    if (alerts.length > 0) {
      const critical = alerts.filter((a: any) => a.severity === 'critical' || a.severity === 'high').length
      insights.push({
        icon: 'notifications',
        title: `${alerts.length} active alert${alerts.length > 1 ? 's' : ''}${critical ? ` (${critical} high priority)` : ''}`,
        detail: 'Review financial alerts in your notification center for anomalies detected in your GL data.',
        type: critical ? 'negative' : 'warning',
        priority: critical ? 1 : 4,
      })
    }

    // === INSIGHT 4: Gross margin health ===
    let totalRev = 0, totalCogs = 0
    txns.forEach((t: any) => {
      const at = t.gl_accounts?.account_type; const amt = Math.abs(Number(t.amount) || 0)
      if (at === 'revenue' || at === 'other_income') totalRev += amt
      else if (at === 'cost_of_revenue') totalCogs += amt
    })
    if (totalRev > 0) {
      const gm = ((totalRev - totalCogs) / totalRev) * 100
      if (gm < 50) {
        insights.push({ icon: 'analytics', title: `Gross margin at ${gm.toFixed(1)}%`, detail: 'Below 50% threshold — review COGS line items for cost optimization opportunities.', type: 'warning', priority: 3 })
      } else if (gm > 80) {
        insights.push({ icon: 'check_circle', title: `Strong gross margin: ${gm.toFixed(1)}%`, detail: 'Well above industry median. Healthy unit economics position.', type: 'positive', priority: 5 })
      }
    }

    // === INSIGHT 5: Data freshness ===
    const connected = (integrationRes.data || []).filter((i: any) => i.status === 'connected')
    const lastSync = lastSyncRes.data?.[0]?.completed_at
    if (connected.length === 0) {
      insights.push({ icon: 'link_off', title: 'No integrations connected', detail: 'Connect QuickBooks, Xero, or NetSuite to see live data. Go to Settings > Integrations.', type: 'setup', priority: 1 })
    } else if (lastSync) {
      const hoursSince = (Date.now() - new Date(lastSync).getTime()) / 3600000
      if (hoursSince > 48) {
        insights.push({ icon: 'sync_problem', title: `Data is ${Math.round(hoursSince)} hours old`, detail: `Last sync: ${new Date(lastSync).toLocaleDateString()}. Auto-sync should run every 6 hours — check integration health.`, type: 'warning', priority: 2 })
      }
    }

    // Sort by priority (lower = more important) and take top 3
    insights.sort((a, b) => a.priority - b.priority)
    const top3 = insights.slice(0, 3)

    return new Response(JSON.stringify({ insights: top3, total_insights: insights.length }), { headers })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message, insights: [] }), { status: 500, headers })
  }
})
