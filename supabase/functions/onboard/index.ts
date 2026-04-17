import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const supabaseAdmin = createClient(
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
  }
}

function sanitize(input: string | null | undefined, maxLen = 200): string {
  if (!input) return ''
  return input.replace(/<[^>]*>/g, '').replace(/[\x00-\x1f]/g, '').trim().slice(0, maxLen)
}

function sanitizeSlug(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 30)
}

const VALID_PLANS = ['demo', 'pending', 'starter', 'growth', 'business', 'enterprise', 'suite']
const VALID_INDUSTRIES = ['saas', 'fintech', 'healthcare', 'ecommerce', 'marketplace', 'enterprise', 'other', '']
const VALID_ERPS = ['netsuite', 'quickbooks', 'xero', 'sage', 'sap', 'oracle', 'none', 'other', '']

Deno.serve(async (req) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })

  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
  const userAgent = req.headers.get('user-agent') || null

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  }
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) {
    if (clientIp) {
      await supabaseAdmin.from('session_events').insert({
        event_type: 'failed_login', ip_address: clientIp, user_agent: userAgent,
        metadata: { source: 'onboard', error: authError?.message || 'Invalid token' },
      }).catch(() => {})
    }
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })
  }

  try {
    const body = await req.json()
    const orgName = sanitize(body.orgName, 100) || `${sanitize(user.user_metadata?.full_name || user.email?.split('@')[0], 50)}'s Org`
    const industry = VALID_INDUSTRIES.includes(body.industry?.toLowerCase()) ? body.industry.toLowerCase() : ''
    const erp = VALID_ERPS.includes(body.erp?.toLowerCase()) ? body.erp.toLowerCase() : ''
    const plan = VALID_PLANS.includes(body.plan) ? body.plan : 'demo'
    const slug = sanitizeSlug(orgName) + '-' + Date.now().toString(36)

    const { data: existingUser } = await supabaseAdmin
      .from('users').select('org_id').eq('id', user.id).maybeSingle()

    if (existingUser?.org_id) {
      const { data: existingOrg } = await supabaseAdmin
        .from('organizations').select('id, onboarding_completed_at')
        .eq('id', existingUser.org_id).maybeSingle()

      if (existingOrg?.onboarding_completed_at) {
        return new Response(JSON.stringify({ status: 'already_completed', org_id: existingUser.org_id }), {
          status: 200, headers: { 'Content-Type': 'application/json', ...headers },
        })
      }

      await supabaseAdmin.from('organizations').update({
        name: orgName, plan, onboarding_completed_at: new Date().toISOString(),
      }).eq('id', existingUser.org_id)

      await supabaseAdmin.from('session_events').insert({
        user_id: user.id, org_id: existingUser.org_id, event_type: 'login',
        auth_provider: user.app_metadata?.provider || 'email',
        ip_address: clientIp, user_agent: userAgent,
        metadata: { source: 'onboard_update', plan },
      }).catch(() => {})

      return new Response(JSON.stringify({ status: 'updated', org_id: existingUser.org_id }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...headers },
      })
    }

    const { data: newOrg, error: orgError } = await supabaseAdmin
      .from('organizations').insert({
        name: orgName, slug, plan, onboarding_completed_at: new Date().toISOString(),
      }).select('id').single()

    if (orgError || !newOrg) {
      return new Response(JSON.stringify({ error: 'Failed to create organization' }), { status: 500, headers })
    }

    await supabaseAdmin.from('users').upsert({
      id: user.id, org_id: newOrg.id, email: user.email || '',
      full_name: sanitize(user.user_metadata?.full_name || user.email?.split('@')[0], 100),
      role: 'owner', auth_provider: user.app_metadata?.provider || 'email',
    }, { onConflict: 'id' })

    await supabaseAdmin.from('session_events').insert({
      user_id: user.id, org_id: newOrg.id, event_type: 'login',
      auth_provider: user.app_metadata?.provider || 'email',
      ip_address: clientIp, user_agent: userAgent,
      metadata: { source: 'onboard_create', plan, industry, erp },
    }).catch(() => {})

    await supabaseAdmin.from('audit_log').insert({
      org_id: newOrg.id, user_id: user.id,
      action: 'org.created', resource_type: 'organization', resource_id: newOrg.id,
      metadata: { industry, erp, plan, source: 'onboarding' }, ip_address: clientIp,
    }).catch(() => {})

    return new Response(JSON.stringify({ status: 'created', org_id: newOrg.id }), {
      status: 201, headers: { 'Content-Type': 'application/json', ...headers },
    })
  } catch (err) {
    console.error('Onboarding error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers })
  }
})
