import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }

/*
  onboarding-brain v1
  Tracks and manages the onboarding checklist.
  
  The guided tour shows 8 steps. As the user completes each step naturally
  (connects an integration, asks the copilot, runs a forecast etc.),
  the brain auto-advances. The frontend reads progress and renders
  the checklist with green checkmarks.
  
  Actions:
  - get: Returns current onboarding progress for the org
  - complete_step: Marks a step as done
  - check_auto: Scans Supabase tables to auto-detect completed steps
  - dismiss: Hides the onboarding banner (doesn't reset progress)
*/

const STEPS = [
  { key: 'profile_completed', label: 'Complete your profile', description: 'Add your name and company info' },
  { key: 'integration_connected', label: 'Connect your ERP', description: 'QuickBooks, Xero, NetSuite, or CSV upload' },
  { key: 'first_copilot_query', label: 'Ask the AI copilot', description: 'Try: "Why did OPEX increase?"' },
  { key: 'first_forecast_run', label: 'Run a forecast', description: 'Generate revenue projections with AI' },
  { key: 'budget_created', label: 'Set a budget', description: 'Create budget targets for your accounts' },
  { key: 'team_invited', label: 'Invite your team', description: 'Add your controller or FP&A analyst' },
  { key: 'first_report_generated', label: 'Generate a report', description: 'Create your first board-ready report' },
  { key: 'dashboard_customized', label: 'Customize your dashboard', description: 'Choose a theme and layout' },
]

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })

  const { data: profile } = await sb.from('users').select('org_id, full_name').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })
  const orgId = profile.org_id

  try {
    const body = await req.json()
    const action = body.action || 'get'

    // Ensure onboarding record exists
    const { data: existing } = await sb.from('onboarding_progress').select('*').eq('org_id', orgId).maybeSingle()
    if (!existing) {
      await sb.from('onboarding_progress').insert({ org_id: orgId, profile_completed: !!(profile.full_name && profile.full_name !== 'User') })
    }

    // === GET PROGRESS ===
    if (action === 'get') {
      const { data: progress } = await sb.from('onboarding_progress').select('*').eq('org_id', orgId).maybeSingle()
      const p = progress || {} as any
      const completedCount = STEPS.filter(s => p[s.key] === true).length
      const pct = Math.round((completedCount / STEPS.length) * 100)

      return new Response(JSON.stringify({
        steps: STEPS.map(s => ({ ...s, completed: p[s.key] === true })),
        completed: completedCount,
        total: STEPS.length,
        completion_pct: pct,
        all_done: completedCount === STEPS.length,
        dismissed: p.metadata?.dismissed === true,
      }), { headers })
    }

    // === COMPLETE STEP ===
    if (action === 'complete_step') {
      const step = body.step
      if (!step || !STEPS.find(s => s.key === step)) return new Response(JSON.stringify({ error: 'Invalid step. Valid: ' + STEPS.map(s => s.key).join(', ') }), { status: 400, headers })

      const { data: current } = await sb.from('onboarding_progress').select('*').eq('org_id', orgId).maybeSingle()
      if (current && !current[step]) {
        const updates: any = { [step]: true, steps_completed: [...(current.steps_completed || []), step] }
        const completedAfter = STEPS.filter(s => s.key === step ? true : current[s.key] === true).length
        updates.completion_pct = Math.round((completedAfter / STEPS.length) * 100)
        if (completedAfter === STEPS.length) updates.completed_at = new Date().toISOString()
        await sb.from('onboarding_progress').update(updates).eq('org_id', orgId)
      }

      return new Response(JSON.stringify({ status: 'completed', step }), { headers })
    }

    // === AUTO-CHECK (scan tables to detect completed steps) ===
    if (action === 'check_auto') {
      const updates: any = {}

      // Profile completed: user has a name
      if (profile.full_name && profile.full_name !== 'User') updates.profile_completed = true

      // Integration connected
      const { count: intCount } = await sb.from('integrations').select('id', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'connected')
      if ((intCount || 0) > 0) updates.integration_connected = true

      // First copilot query
      const { count: copilotCount } = await sb.from('copilot_actions').select('id', { count: 'exact', head: true }).eq('org_id', orgId)
      if ((copilotCount || 0) > 0) updates.first_copilot_query = true

      // First forecast
      const { count: forecastCount } = await sb.from('audit_log').select('id', { count: 'exact', head: true }).eq('org_id', orgId).eq('action', 'forecast.generated')
      if ((forecastCount || 0) > 0) updates.first_forecast_run = true

      // Budget created
      const { count: budgetCount } = await sb.from('gl_budgets').select('id', { count: 'exact', head: true }).eq('org_id', orgId)
      if ((budgetCount || 0) > 0) updates.budget_created = true

      // Team invited
      const { count: teamCount } = await sb.from('users').select('id', { count: 'exact', head: true }).eq('org_id', orgId)
      if ((teamCount || 0) > 1) updates.team_invited = true

      // Report generated
      const { count: reportCount } = await sb.from('generated_reports').select('id', { count: 'exact', head: true }).eq('org_id', orgId)
      if ((reportCount || 0) > 0) updates.first_report_generated = true

      // Dashboard customized
      const { data: prefs } = await sb.from('user_preferences').select('theme').eq('user_id', user.id).maybeSingle()
      if (prefs && prefs.theme !== 'arctic') updates.dashboard_customized = true

      // Apply updates
      if (Object.keys(updates).length > 0) {
        const { data: current } = await sb.from('onboarding_progress').select('steps_completed').eq('org_id', orgId).maybeSingle()
        const newSteps = [...new Set([...(current?.steps_completed || []), ...Object.keys(updates).filter(k => updates[k] === true)])]
        updates.steps_completed = newSteps
        updates.completion_pct = Math.round((STEPS.filter(s => updates[s.key] === true || (current as any)?.[s.key] === true).length / STEPS.length) * 100)
        await sb.from('onboarding_progress').update(updates).eq('org_id', orgId)
      }

      return new Response(JSON.stringify({ status: 'checked', auto_completed: Object.keys(updates).filter(k => updates[k] === true) }), { headers })
    }

    // === DISMISS (hide banner, keep progress) ===
    if (action === 'dismiss') {
      const { data: current } = await sb.from('onboarding_progress').select('metadata').eq('org_id', orgId).maybeSingle()
      await sb.from('onboarding_progress').update({ metadata: { ...(current?.metadata || {}), dismissed: true } }).eq('org_id', orgId)
      return new Response(JSON.stringify({ status: 'dismissed' }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown action. Use: get, complete_step, check_auto, dismiss' }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers })
  }
})
