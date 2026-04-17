import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const ALLOWED_ORIGINS = [
  'https://castford.com',
  'https://www.castford.com',
  'https://castford.vercel.app',
  'http://localhost:3000',
]

function cors(req: Request) {
  const origin = req.headers.get('origin') || ''
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    'Content-Type': 'application/json',
  }
}

// ROI calculation logic based on industry benchmarks
function calculateROI(input: any) {
  const closeDays = input.current_close_days || 10
  const forecastAccuracy = input.current_forecast_accuracy || 70
  const toolCount = input.current_tools_count || 5
  const teamSize = input.team_size || 5
  const revenueRange = input.annual_revenue_range || '10m-50m'

  // Time savings: close reduction
  const newCloseDays = Math.max(2, Math.round(closeDays * 0.35))
  const closeDaysSaved = closeDays - newCloseDays
  const closeHoursSavedMonthly = closeDaysSaved * 8 * Math.min(teamSize, 4)
  const closeHoursSavedAnnual = closeHoursSavedMonthly * 12

  // Time savings: tool consolidation
  const toolsEliminated = Math.max(0, toolCount - 2)
  const contextSwitchHoursSaved = toolsEliminated * 2 * teamSize * 52 // 2hrs/week per tool eliminated

  // Time savings: forecast improvement
  const newForecastAccuracy = Math.min(95, forecastAccuracy + 20)
  const forecastTimeSaved = teamSize * 4 * 12 // 4hrs/month per person on forecast rework

  const totalHoursSaved = closeHoursSavedAnnual + contextSwitchHoursSaved + forecastTimeSaved

  // Cost savings (assuming $75/hr blended rate for finance team)
  const hourlyRate = 75
  const laborSavings = totalHoursSaved * hourlyRate

  // Tool cost savings (assuming $500/mo avg per tool eliminated)
  const toolSavings = toolsEliminated * 500 * 12

  const totalSavings = laborSavings + toolSavings

  // Castford cost (based on team size)
  let castfordAnnual = 0
  if (teamSize <= 5) castfordAnnual = 665 * 12
  else if (teamSize <= 25) castfordAnnual = 2079 * 12
  else castfordAnnual = 4999 * 12

  const netROI = totalSavings - castfordAnnual
  const roiMultiple = castfordAnnual > 0 ? (totalSavings / castfordAnnual).toFixed(1) : '0'

  return {
    inputs: { close_days: closeDays, forecast_accuracy: forecastAccuracy, tools: toolCount, team_size: teamSize, revenue_range: revenueRange },
    results: {
      new_close_days: newCloseDays,
      close_days_saved: closeDaysSaved,
      new_forecast_accuracy: newForecastAccuracy,
      tools_eliminated: toolsEliminated,
      total_hours_saved_annual: totalHoursSaved,
      labor_savings_annual: laborSavings,
      tool_savings_annual: toolSavings,
      total_savings_annual: totalSavings,
      castford_cost_annual: castfordAnnual,
      net_roi_annual: netROI,
      roi_multiple: roiMultiple + 'x',
      payback_months: totalSavings > 0 ? Math.round((castfordAnnual / totalSavings) * 12) : 0,
    }
  }
}

Deno.serve(async (req) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  try {
    const body = await req.json()
    const result = calculateROI(body)

    // Save to database if user is authenticated
    const authHeader = req.headers.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await sb.auth.getUser(token)
      if (user) {
        const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
        if (profile?.org_id) {
          await sb.from('roi_calculations').insert({
            org_id: profile.org_id,
            current_close_days: result.inputs.close_days,
            current_forecast_accuracy: result.inputs.forecast_accuracy,
            current_tools_count: result.inputs.tools,
            team_size: result.inputs.team_size,
            annual_revenue_range: result.inputs.revenue_range,
            estimated_time_saved_hours: result.results.total_hours_saved_annual,
            estimated_cost_saved_annual: result.results.total_savings_annual,
          }).catch(() => {})
        }
      }
    }

    return new Response(JSON.stringify(result), { headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message }), { status: 500, headers })
  }
})
