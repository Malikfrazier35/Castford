import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }

/*
  billing-brain v3
  v2: ai_model propagation
  v3: Updated to Castford Stripe account (acct_1SsLDtFV8yRihVmr) price IDs
*/

const PLAN_TO_STRIPE_PRICE: Record<string, { monthly: string, annual: string }> = {
  starter: { monthly: 'price_1TLtt4FV8yRihVmr0ou6Nkbk', annual: 'price_1TLtt4FV8yRihVmrYfF6W7gx' },
  growth: { monthly: 'price_1TLttbFV8yRihVmrnahm3ggj', annual: 'price_1TLtu7FV8yRihVmrNLEtEilH' },
  business: { monthly: 'price_1TLtuZFV8yRihVmrkNhEVjwR', annual: 'price_1TLtv6FV8yRihVmraug5FV7F' },
}

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const authHeader = req.headers.get('Authorization')
  const cronSecret = req.headers.get('x-cron-secret')
  const expectedSecret = Deno.env.get('CRON_SECRET') || ''
  let userId: string | null = null, orgId: string | null = null, isAdmin = false
  if (cronSecret && expectedSecret && cronSecret === expectedSecret) isAdmin = true
  else if (authHeader?.startsWith('Bearer ')) { const { data: { user } } = await sb.auth.getUser(authHeader.replace('Bearer ', '')); if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers }); userId = user.id; const { data: profile } = await sb.from('users').select('org_id, role').eq('id', user.id).maybeSingle(); orgId = profile?.org_id || null; if (profile?.role === 'owner') isAdmin = true }
  else return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })

  try {
    const body = await req.json()
    const action = body.action || 'current_plan'
    const targetOrgId = body.org_id || orgId

    if (action === 'get_plans') {
      const { data: plans } = await sb.from('plan_limits').select('*').eq('active', true).order('sort_order')
      return new Response(JSON.stringify({ plans: (plans || []).map((p: any) => ({ ...p, stripe_prices: PLAN_TO_STRIPE_PRICE[p.plan] || null, ai_model_display: (p.ai_model || '').includes('opus') ? 'Claude Opus 4.6' : 'Claude Sonnet 4.6' })) }), { headers })
    }

    if (action === 'current_plan') {
      if (!targetOrgId) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })
      const { data: org } = await sb.from('organizations').select('id, name, plan, ai_model, stripe_customer_id, stripe_subscription_id, billing_email, billing_interval, seats_limit, entities_limit, integrations_limit, copilot_limit, api_access, sso_enabled, trial_ends_at, cancel_at_period_end, mbg_expires_at, mrr, plan_updated_at').eq('id', targetOrgId).maybeSingle()
      if (!org) return new Response(JSON.stringify({ error: 'Org not found' }), { status: 404, headers })
      const { data: planLimits } = await sb.from('plan_limits').select('*').eq('plan', org.plan).maybeSingle()
      const now = new Date(); const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const [seatsRes, integrationsRes, copilotRes] = await Promise.all([
        sb.from('users').select('id', { count: 'exact', head: true }).eq('org_id', targetOrgId),
        sb.from('integrations').select('id', { count: 'exact', head: true }).eq('org_id', targetOrgId).eq('status', 'connected'),
        sb.from('usage_events').select('id', { count: 'exact', head: true }).eq('org_id', targetOrgId).eq('event_type', 'ai_query').gte('created_at', periodStart),
      ])
      return new Response(JSON.stringify({ org: { id: org.id, name: org.name, plan: org.plan, billing_interval: org.billing_interval, mrr: org.mrr, ai_model: org.ai_model, ai_model_display: (org.ai_model || '').includes('opus') ? 'Claude Opus 4.6' : 'Claude Sonnet 4.6' }, plan_details: planLimits, usage: { seats: { used: seatsRes.count || 0, limit: planLimits?.seats_limit || 1 }, copilot_queries: { used: copilotRes.count || 0, limit: planLimits?.copilot_queries_limit || 50, unlimited: (planLimits?.copilot_queries_limit || 50) === 0 }, integrations: { used: integrationsRes.count || 0, limit: planLimits?.integrations_limit || 5 } }, stripe_prices: PLAN_TO_STRIPE_PRICE[org.plan] || null }), { headers })
    }

    if (action === 'enforce') {
      if (!targetOrgId) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })
      const feature = body.feature; if (!feature) return new Response(JSON.stringify({ error: 'feature required' }), { status: 400, headers })
      const { data: org } = await sb.from('organizations').select('plan').eq('id', targetOrgId).maybeSingle()
      const { data: planLimits } = await sb.from('plan_limits').select('*').eq('plan', org?.plan || 'demo').maybeSingle()
      if (!planLimits) return new Response(JSON.stringify({ allowed: false, reason: 'Unknown plan' }), { headers })
      let allowed = false, reason = '', upgrade_to = ''
      const now = new Date(); const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      switch (feature) {
        case 'add_seat': { if (planLimits.seats_limit === 0) { allowed = true; break } const { count } = await sb.from('users').select('id', { count: 'exact', head: true }).eq('org_id', targetOrgId); allowed = (count || 0) < planLimits.seats_limit; if (!allowed) { reason = `Seat limit (${count}/${planLimits.seats_limit})`; upgrade_to = 'growth' } break }
        case 'copilot_query': { if (planLimits.copilot_queries_limit === 0) { allowed = true; break } const { count } = await sb.from('usage_events').select('id', { count: 'exact', head: true }).eq('org_id', targetOrgId).eq('event_type', 'ai_query').gte('created_at', periodStart); allowed = (count || 0) < planLimits.copilot_queries_limit; if (!allowed) { reason = `Copilot limit (${count}/${planLimits.copilot_queries_limit}/mo)`; upgrade_to = 'growth' } break }
        case 'api_access': { allowed = planLimits.api_access === true; if (!allowed) { reason = 'API requires Growth+'; upgrade_to = 'growth' } break }
        case 'sso': { allowed = planLimits.sso_enabled === true; if (!allowed) { reason = 'SSO requires Business'; upgrade_to = 'business' } break }
        case 'opus_model': { allowed = (planLimits.ai_model || '').includes('opus'); if (!allowed) { reason = 'Claude Opus 4.6 requires Growth+. Starter uses Sonnet 4.6.'; upgrade_to = 'growth' } break }
        default: allowed = true
      }
      return new Response(JSON.stringify({ allowed, feature, current_plan: org?.plan, reason, upgrade_to }), { headers })
    }

    if (action === 'upgrade_preview') {
      if (!targetOrgId) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })
      const targetPlan = body.target_plan; if (!targetPlan) return new Response(JSON.stringify({ error: 'target_plan required' }), { status: 400, headers })
      const { data: org } = await sb.from('organizations').select('plan, billing_interval, ai_model').eq('id', targetOrgId).maybeSingle()
      const [cl, tl] = await Promise.all([sb.from('plan_limits').select('*').eq('plan', org?.plan || 'demo').maybeSingle(), sb.from('plan_limits').select('*').eq('plan', targetPlan).maybeSingle()])
      if (!tl.data) return new Response(JSON.stringify({ error: `Unknown plan: ${targetPlan}` }), { status: 400, headers })
      const t = tl.data as any; const c = cl.data || {} as any
      const interval = body.interval || org?.billing_interval || 'monthly'
      const newPrice = interval === 'annual' ? t.annual_price : t.monthly_price; const oldPrice = interval === 'annual' ? (c.annual_price || 0) : (c.monthly_price || 0)
      const modelUpgrade = (c.ai_model || '').includes('sonnet') && (t.ai_model || '').includes('opus')
      return new Response(JSON.stringify({ direction: (t.sort_order || 0) > (c.sort_order || 0) ? 'upgrade' : 'downgrade', from: { plan: org?.plan, price: oldPrice, ai_model: c.ai_model }, to: { plan: targetPlan, price: newPrice, ai_model: t.ai_model, ai_model_display: (t.ai_model || '').includes('opus') ? 'Claude Opus 4.6' : 'Claude Sonnet 4.6' }, delta: { price: newPrice - oldPrice }, model_upgrade: modelUpgrade, model_upgrade_note: modelUpgrade ? 'Upgrading from Sonnet 4.6 to Opus 4.6' : null, stripe_price: PLAN_TO_STRIPE_PRICE[targetPlan]?.[interval] || null }), { headers })
    }

    if (action === 'revenue_snapshot') {
      if (!isAdmin) return new Response(JSON.stringify({ error: 'Admin required' }), { status: 403, headers })
      const { data: orgs } = await sb.from('organizations').select('plan, mrr, cancel_at_period_end').not('plan', 'is', null)
      const planCounts: Record<string, number> = {}; let totalMrr = 0, payingCount = 0, totalCount = 0
      ;(orgs || []).forEach((o: any) => { totalCount++; planCounts[o.plan] = (planCounts[o.plan] || 0) + 1; if (o.mrr > 0) { totalMrr += o.mrr; payingCount++ } })
      try { await sb.from('revenue_metrics').upsert({ snapshot_date: new Date().toISOString().split('T')[0], total_mrr: totalMrr, total_arr: totalMrr * 12, total_customers: totalCount, paying_customers: payingCount, starter_count: planCounts.starter || 0, growth_count: planCounts.growth || 0, business_count: planCounts.business || 0, trial_count: planCounts.demo || 0, avg_revenue_per_customer: payingCount > 0 ? Math.round(totalMrr / payingCount) : 0 }, { onConflict: 'snapshot_date' }) } catch {}
      return new Response(JSON.stringify({ total_mrr: totalMrr, total_arr: totalMrr * 12, total_customers: totalCount, paying_customers: payingCount, by_plan: planCounts }), { headers })
    }

    if (action === 'apply_plan') {
      if (!isAdmin && !targetOrgId) return new Response(JSON.stringify({ error: 'Auth required' }), { status: 403, headers })
      const plan = body.plan; if (!plan) return new Response(JSON.stringify({ error: 'plan required' }), { status: 400, headers })
      const { data: limits } = await sb.from('plan_limits').select('*').eq('plan', plan).maybeSingle()
      if (!limits) return new Response(JSON.stringify({ error: `Unknown plan: ${plan}` }), { status: 400, headers })
      const applyOrgId = body.org_id || targetOrgId
      await sb.from('organizations').update({ plan, seats_limit: limits.seats_limit, entities_limit: limits.entities_limit, integrations_limit: limits.integrations_limit, copilot_limit: limits.copilot_queries_limit, api_access: limits.api_access, sso_enabled: limits.sso_enabled, ai_model: limits.ai_model || 'claude-sonnet-4-6-20250514', plan_updated_at: new Date().toISOString(), mrr: body.interval === 'annual' ? limits.annual_price : limits.monthly_price, billing_interval: body.interval || 'monthly' }).eq('id', applyOrgId)
      return new Response(JSON.stringify({ status: 'applied', plan, ai_model: limits.ai_model }), { headers })
    }

    if (action === 'usage_summary') {
      if (!targetOrgId) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })
      const now = new Date(); const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const { data: thisMonth } = await sb.from('usage_events').select('event_type, tokens_used').eq('org_id', targetOrgId).gte('created_at', periodStart)
      const summarize = (events: any[]) => { const r: Record<string, { count: number, tokens: number }> = {}; (events || []).forEach(e => { if (!r[e.event_type]) r[e.event_type] = { count: 0, tokens: 0 }; r[e.event_type].count++; r[e.event_type].tokens += e.tokens_used || 0 }); return r }
      return new Response(JSON.stringify({ current_period: { start: periodStart, events: summarize(thisMonth || []), total: (thisMonth || []).length } }), { headers })
    }

    if (action === 'log_billing_event') {
      try { await sb.from('billing_events').insert({ org_id: body.org_id || targetOrgId, event_type: body.event_type, stripe_event_id: body.stripe_event_id, from_plan: body.from_plan, to_plan: body.to_plan, amount: body.amount, metadata: body.metadata || {} }) } catch {}
      return new Response(JSON.stringify({ status: 'logged' }), { headers })
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), { status: 400, headers })
  } catch (err: any) { return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers }) }
})
