import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

Deno.serve(async (req: Request) => {
  const cronSecret = req.headers.get('x-cron-secret')
  const expectedSecret = Deno.env.get('CRON_SECRET') || ''
  const authHeader = req.headers.get('Authorization')
  let isAuthorized = false
  if (cronSecret && expectedSecret && cronSecret === expectedSecret) isAuthorized = true
  if (!isAuthorized && authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
    if (user) { const { data: p } = await sb.from('users').select('role').eq('id', user.id).maybeSingle(); if (p?.role === 'owner') isAuthorized = true }
  }
  if (!isAuthorized) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString()
    const { data: orgs } = await sb.from('organizations').select('id, plan, seats_limit, entities_limit').not('plan', 'is', null)
    if (!orgs?.length) return new Response(JSON.stringify({ message: 'No organizations', processed: 0 }), { headers: { 'Content-Type': 'application/json' } })

    const results: any[] = []
    for (const org of orgs) {
      const orgId = org.id
      const { count: logins30d } = await sb.from('session_events').select('id', { count: 'exact', head: true }).eq('org_id', orgId).eq('event_type', 'session_verify').gte('created_at', thirtyDaysAgo)
      const { data: lastLogin } = await sb.from('session_events').select('created_at').eq('org_id', orgId).eq('event_type', 'session_verify').order('created_at', { ascending: false }).limit(1)
      const lastLoginAt = lastLogin?.[0]?.created_at || null
      const daysSinceLogin = lastLoginAt ? Math.round((now.getTime() - new Date(lastLoginAt).getTime()) / 86400000) : 999
      const loginScore = daysSinceLogin <= 1 ? 25 : daysSinceLogin <= 7 ? 20 : daysSinceLogin <= 14 ? 15 : daysSinceLogin <= 30 ? 10 : 0

      const features: string[] = []
      const { count: copilotQ } = await sb.from('copilot_actions').select('id', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', thirtyDaysAgo)
      if ((copilotQ || 0) > 0) features.push('copilot')
      const { count: integrations } = await sb.from('integrations').select('id', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'connected')
      if ((integrations || 0) > 0) features.push('integrations')
      const { count: teamMembers } = await sb.from('users').select('id', { count: 'exact', head: true }).eq('org_id', orgId)
      if ((teamMembers || 0) > 1) features.push('team')
      const { count: reports } = await sb.from('generated_reports').select('id', { count: 'exact', head: true }).eq('org_id', orgId)
      if ((reports || 0) > 0) features.push('reports')
      const { count: forecasts } = await sb.from('audit_log').select('id', { count: 'exact', head: true }).eq('org_id', orgId).eq('action', 'forecast.generated')
      if ((forecasts || 0) > 0) features.push('forecast')
      const adoptionScore = Math.round((features.length / 5) * 25)

      const { data: lastSync } = await sb.from('sync_log').select('completed_at').eq('org_id', orgId).order('completed_at', { ascending: false }).limit(1)
      const hoursSinceSync = lastSync?.[0] ? (now.getTime() - new Date(lastSync[0].completed_at).getTime()) / 3600000 : 999
      const freshnessScore = hoursSinceSync <= 6 ? 25 : hoursSinceSync <= 24 ? 20 : hoursSinceSync <= 72 ? 10 : 0

      const { count: usageCount } = await sb.from('usage_events').select('id', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', thirtyDaysAgo)
      const engagementScore = (usageCount || 0) >= 50 ? 25 : (usageCount || 0) >= 20 ? 20 : (usageCount || 0) >= 5 ? 10 : (usageCount || 0) >= 1 ? 5 : 0

      const totalScore = loginScore + adoptionScore + freshnessScore + engagementScore
      const churnRisk = totalScore >= 80 ? 'low' : totalScore >= 60 ? 'medium' : totalScore >= 40 ? 'high' : 'critical'
      const expansionReady = (teamMembers || 0) >= (org.seats_limit || 5) * 0.8 || (integrations || 0) >= 3 || (copilotQ || 0) >= 50

      await sb.from('customer_health').upsert({
        org_id: orgId, health_score: totalScore, login_frequency_score: loginScore,
        feature_adoption_score: adoptionScore, data_freshness_score: freshnessScore,
        engagement_score: engagementScore, churn_risk: churnRisk, expansion_ready: expansionReady,
        features_used: features, last_login_at: lastLoginAt, days_since_login: daysSinceLogin,
        logins_last_30d: logins30d || 0, copilot_queries_30d: copilotQ || 0,
        reports_generated_30d: reports || 0, integrations_connected: integrations || 0,
        computed_at: now.toISOString(),
      }, { onConflict: 'org_id' })

      results.push({ org_id: orgId, score: totalScore, risk: churnRisk, expansion: expansionReady })
    }

    // Log run — use try/catch instead of .catch()
    try { await sb.from('automation_runs').insert({ status: 'success', trigger_source: 'customer_health', input_data: { orgs_scored: results.length }, output_data: { scores: results }, completed_at: now.toISOString() }) } catch {}

    return new Response(JSON.stringify({ processed: results.length, results }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
