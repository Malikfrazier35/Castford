import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function isValidIp(ip: string|null): boolean { if(!ip)return false; return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)||ip.includes(':'); }
const rlCache = new Map<string,{count:number,resetAt:number}>();
function rl(key:string,max:number):boolean { const now=Date.now();const e=rlCache.get(key);if(!e||now>e.resetAt){rlCache.set(key,{count:1,resetAt:now+60000});return true;}if(e.count>=max)return false;e.count++;return true;}

Deno.serve(async (req) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })

  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
  const validIp = isValidIp(clientIp) ? clientIp : null
  const userAgent = req.headers.get('user-agent') || null
  if (clientIp && !rl(`ip:${clientIp}`, 60)) return new Response(JSON.stringify({ error: 'Rate limited.' }), { status: 429, headers: { ...headers, 'Retry-After': '60' } })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  const token = authHeader.replace('Bearer ', '')

  let user: any = null
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data?.user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })
    user = data.user
  } catch { return new Response(JSON.stringify({ error: 'Auth error' }), { status: 500, headers }) }

  if (!rl(`user:${user.id}`, 30)) return new Response(JSON.stringify({ error: 'Rate limited.' }), { status: 429, headers: { ...headers, 'Retry-After': '30' } })

  try {
    const { data: existingUser, error: userErr } = await supabaseAdmin.from('users').select('id, org_id, role, full_name').eq('id', user.id).maybeSingle()
    if (userErr) return new Response(JSON.stringify({ error: 'User lookup failed' }), { status: 500, headers })

    if (existingUser?.org_id) {
      const { data: org } = await supabaseAdmin.from('organizations').select('id, name, plan, slug, closed_at, seats_limit, entities_limit, mbg_expires_at').eq('id', existingUser.org_id).maybeSingle()
      if (org?.closed_at) return new Response(JSON.stringify({ status: 'closed', message: 'Account closed.' }), { status: 403, headers })

      try { await supabaseAdmin.from('session_events').insert({ user_id: user.id, org_id: existingUser.org_id, event_type: 'session_verify', auth_provider: user.app_metadata?.provider || 'email', ip_address: validIp, user_agent: userAgent }); } catch {}
      try { await supabaseAdmin.from('users').update({ last_active_at: new Date().toISOString() }).eq('id', user.id); } catch {}

      return new Response(JSON.stringify({
        status: 'active',
        user: { id: existingUser.id, name: existingUser.full_name, role: existingUser.role },
        org: org ? { id: org.id, name: org.name, plan: org.plan, slug: org.slug, limits: { seats: org.seats_limit || 5, entities: org.entities_limit || 3 }, mbg_active: org.mbg_expires_at ? new Date(org.mbg_expires_at) > new Date() : false } : null,
      }), { status: 200, headers })
    }

    // === NEW ORG PROVISIONING ===
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
    const provider = user.app_metadata?.provider || 'email'
    const slug = displayName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) + '-' + Date.now().toString(36)

    const { data: newOrg, error: orgError } = await supabaseAdmin.from('organizations').insert({ name: `${displayName}'s Org`, slug, plan: 'demo' }).select('id, name, plan, slug').single()
    if (orgError || !newOrg) return new Response(JSON.stringify({ error: 'Failed to provision' }), { status: 500, headers })

    await supabaseAdmin.from('users').upsert({ id: user.id, org_id: newOrg.id, email: user.email || '', full_name: displayName, role: 'owner', auth_provider: provider }, { onConflict: 'id' }).catch(() => {})

    // === POST-SIGNUP AUTOMATIONS (all non-blocking) ===
    const baseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // 1. Seed demo data
    fetch(`${baseUrl}/functions/v1/seed-demo-data`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceKey}` },
      body: JSON.stringify({ action: 'seed', org_id: newOrg.id }),
    }).catch(() => {})

    // 2. Start onboarding drip campaign
    supabaseAdmin.from('drip_campaigns').insert({
      org_id: newOrg.id, user_id: user.id, campaign_type: 'onboarding',
      step: 0, total_steps: 5, next_send_at: new Date().toISOString(), status: 'active',
    }).catch(() => {})

    // 3. Create welcome notification
    supabaseAdmin.from('notifications').insert({
      org_id: newOrg.id, user_id: user.id, channel: 'in_app',
      title: 'Welcome to Castford!',
      body: 'Your dashboard is ready with sample data. Connect your ERP to see real numbers.',
      link: '/login',
    }).catch(() => {})

    return new Response(JSON.stringify({
      status: 'provisioned',
      user: { id: user.id, name: displayName, role: 'owner' },
      org: { id: newOrg.id, name: newOrg.name, plan: newOrg.plan, slug: newOrg.slug, limits: { seats: 5, entities: 3 }, mbg_active: false },
    }), { status: 201, headers })
  } catch {
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers })
  }
})
