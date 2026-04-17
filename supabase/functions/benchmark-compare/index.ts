import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }

/*
  benchmark-compare v1
  Compares customer's financial metrics against industry benchmarks.
  Returns a scorecard showing where they outperform/underperform peers.
*/

function percentile(value: number, p25: number, p50: number, p75: number): { percentile: number, label: string } {
  if (value >= p75) return { percentile: 75, label: 'Top quartile' }
  if (value >= p50) return { percentile: 50, label: 'Above median' }
  if (value >= p25) return { percentile: 25, label: 'Below median' }
  return { percentile: 10, label: 'Bottom quartile' }
}

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })

  const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return new Response(JSON.stringify({ error: 'No organization' }), { status: 404, headers })
  const orgId = profile.org_id

  try {
    const body = await req.json()
    const industry = body.industry || 'saas'

    // Get benchmarks for this industry
    const { data: benchmarks } = await sb.from('industry_benchmarks').select('metric, percentile_25, percentile_50, percentile_75, unit, source').eq('industry', industry)
    if (!benchmarks?.length) return new Response(JSON.stringify({ error: `No benchmarks for industry: ${industry}`, available: ['saas','fintech','healthcare','ecommerce','manufacturing','services','marketplace'] }), { status: 400, headers })

    // Calculate customer's actual metrics from GL data
    const { data: txns } = await sb.from('gl_transactions').select('amount, period, gl_accounts(account_type)').eq('org_id', orgId)
    if (!txns?.length) return new Response(JSON.stringify({ error: 'No GL data for benchmarking' }), { status: 200, headers })

    let revenue = 0, cogs = 0, opex = 0
    const byMonth: Record<string, number> = {}
    txns.forEach((t: any) => {
      const at = t.gl_accounts?.account_type; const amt = Math.abs(Number(t.amount) || 0)
      if (at === 'revenue' || at === 'other_income') { revenue += amt; const p = t.period || ''; if (p) byMonth[p] = (byMonth[p] || 0) + amt }
      else if (at === 'cost_of_revenue') cogs += amt
      else if (at === 'expense' || at === 'other_expense') opex += amt
    })

    const gp = revenue - cogs; const ni = revenue - cogs - opex
    const grossMargin = revenue > 0 ? (gp / revenue) * 100 : 0
    const netMargin = revenue > 0 ? (ni / revenue) * 100 : 0

    // Revenue growth YoY (approximate from monthly trend)
    const months = Object.entries(byMonth).sort()
    let revenueGrowth = 0
    if (months.length >= 6) {
      const firstHalf = months.slice(0, Math.floor(months.length / 2)).reduce((s, [, v]) => s + v, 0)
      const secondHalf = months.slice(Math.floor(months.length / 2)).reduce((s, [, v]) => s + v, 0)
      if (firstHalf > 0) revenueGrowth = ((secondHalf - firstHalf) / firstHalf) * 100 * 2 // Annualize
    }

    // Map customer metrics to benchmark metrics
    const customerMetrics: Record<string, number> = {
      gross_margin: grossMargin,
      net_margin: netMargin,
      revenue_growth_yoy: revenueGrowth,
    }

    // Build scorecard
    const scorecard = benchmarks.map((b: any) => {
      const customerValue = customerMetrics[b.metric]
      if (customerValue === undefined) return { metric: b.metric, available: false, unit: b.unit, source: b.source }

      const position = percentile(customerValue, b.percentile_25, b.percentile_50, b.percentile_75)
      return {
        metric: b.metric,
        your_value: Math.round(customerValue * 10) / 10,
        p25: b.percentile_25, p50: b.percentile_50, p75: b.percentile_75,
        position: position.label,
        percentile_rank: position.percentile,
        unit: b.unit, source: b.source,
        outperforming: position.percentile >= 50,
      }
    }).filter((s: any) => s.available !== false)

    const outperforming = scorecard.filter((s: any) => s.outperforming).length
    const total = scorecard.length

    return new Response(JSON.stringify({
      industry,
      scorecard,
      summary: {
        metrics_compared: total,
        outperforming,
        underperforming: total - outperforming,
        overall_grade: outperforming >= total * 0.75 ? 'A' : outperforming >= total * 0.5 ? 'B' : outperforming >= total * 0.25 ? 'C' : 'D',
      },
      kpis: { revenue, cogs, gross_profit: gp, gross_margin: grossMargin, opex, net_income: ni, net_margin: netMargin, revenue_growth_yoy: revenueGrowth },
    }), { headers })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Benchmark failed' }), { status: 500, headers })
  }
})
