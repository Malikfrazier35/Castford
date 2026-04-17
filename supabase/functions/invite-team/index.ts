import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const ALLOWED_ORIGINS = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o = req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(o)?o:ALLOWED_ORIGINS[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey' }; }
const VALID_ROLES = ['admin','manager','budget_owner','viewer']
Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401, headers })
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })
  try {
    const body = await req.json()
    const action = body.action || 'invite'
    const { data: inviter } = await supabaseAdmin.from('users').select('org_id, role, full_name').eq('id', user.id).maybeSingle()
    if (!inviter?.org_id) return new Response(JSON.stringify({ error: 'No organization found' }), { status: 404, headers })
    if (!['owner','admin'].includes(inviter.role) && action !== 'accept') return new Response(JSON.stringify({ error: 'Only owners and admins can manage team' }), { status: 403, headers })
    const { data: org } = await supabaseAdmin.from('organizations').select('id, name, plan, seats_limit, seats_used').eq('id', inviter.org_id).maybeSingle()
    if (!org) return new Response(JSON.stringify({ error: 'Organization not found' }), { status: 404, headers })
    if (action === 'invite') {
      const email = body.email?.trim()?.toLowerCase()
      const role = VALID_ROLES.includes(body.role) ? body.role : 'viewer'
      if (!email || !/^[^@]+@[^@]+\.[a-z]{2,}$/i.test(email)) return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers })
      const { count: currentMembers } = await supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).eq('org_id', org.id)
      const { count: pendingInvites } = await supabaseAdmin.from('invitations').select('id', { count: 'exact', head: true }).eq('org_id', org.id).eq('status', 'pending')
      const totalSeats = (currentMembers||0) + (pendingInvites||0)
      if (totalSeats >= (org.seats_limit||5)) return new Response(JSON.stringify({ error: 'Seat limit reached' }), { status: 403, headers })
      const { data: existingMember } = await supabaseAdmin.from('users').select('id').eq('email', email).eq('org_id', org.id).maybeSingle()
      if (existingMember) return new Response(JSON.stringify({ error: 'Already a member' }), { status: 409, headers })
      const { data: existingInvite } = await supabaseAdmin.from('invitations').select('id').eq('org_id', org.id).eq('email', email).eq('status', 'pending').maybeSingle()
      if (existingInvite) return new Response(JSON.stringify({ error: 'Invitation already pending' }), { status: 409, headers })
      const { data: invitation, error: inviteErr } = await supabaseAdmin.from('invitations').insert({ org_id: org.id, invited_by: user.id, email, role }).select('id, token, email, role, expires_at').single()
      if (inviteErr || !invitation) return new Response(JSON.stringify({ error: 'Failed to create invitation' }), { status: 500, headers })
      await supabaseAdmin.from('audit_log').insert({ user_id: user.id, org_id: org.id, action: 'team.invited', resource_type: 'invitation', resource_id: invitation.id, metadata: { email, role } }).catch(() => {})
      return new Response(JSON.stringify({ status: 'invited', invitation: { id: invitation.id, email: invitation.email, role: invitation.role, expires_at: invitation.expires_at, invite_url: `https://castford.com?invite=${invitation.token}` }, seats: { used: totalSeats+1, limit: org.seats_limit } }), { status: 201, headers: { 'Content-Type': 'application/json', ...headers } })
    }
    if (action === 'list') {
      const { data: members } = await supabaseAdmin.from('users').select('id, email, full_name, role, last_active_at, created_at').eq('org_id', org.id).order('created_at', { ascending: true })
      const { data: invitations } = await supabaseAdmin.from('invitations').select('id, email, role, status, expires_at, created_at').eq('org_id', org.id).in('status', ['pending']).order('created_at', { ascending: false })
      return new Response(JSON.stringify({ members: members||[], pending_invitations: invitations||[], seats: { used: members?.length||0, limit: org.seats_limit }, plan: org.plan }), { status: 200, headers: { 'Content-Type': 'application/json', ...headers } })
    }
    if (action === 'revoke') {
      const { data: inv } = await supabaseAdmin.from('invitations').select('id, email, org_id').eq('id', body.invitation_id).eq('org_id', org.id).eq('status', 'pending').maybeSingle()
      if (!inv) return new Response(JSON.stringify({ error: 'Invitation not found' }), { status: 404, headers })
      await supabaseAdmin.from('invitations').update({ status: 'revoked' }).eq('id', inv.id)
      return new Response(JSON.stringify({ status: 'revoked' }), { status: 200, headers: { 'Content-Type': 'application/json', ...headers } })
    }
    if (action === 'remove') {
      if (body.member_id === user.id) return new Response(JSON.stringify({ error: 'Cannot remove yourself' }), { status: 400, headers })
      const { data: member } = await supabaseAdmin.from('users').select('id, email, role').eq('id', body.member_id).eq('org_id', org.id).maybeSingle()
      if (!member) return new Response(JSON.stringify({ error: 'Member not found' }), { status: 404, headers })
      if (member.role === 'owner') return new Response(JSON.stringify({ error: 'Cannot remove owner' }), { status: 403, headers })
      await supabaseAdmin.from('users').update({ org_id: null }).eq('id', body.member_id)
      return new Response(JSON.stringify({ status: 'removed' }), { status: 200, headers: { 'Content-Type': 'application/json', ...headers } })
    }
    if (action === 'accept') {
      const { data: invitation } = await supabaseAdmin.from('invitations').select('id, org_id, email, role, status, expires_at').eq('token', body.token).maybeSingle()
      if (!invitation || invitation.status !== 'pending') return new Response(JSON.stringify({ error: 'Invalid or used invitation' }), { status: 404, headers })
      if (new Date(invitation.expires_at) < new Date()) { await supabaseAdmin.from('invitations').update({ status: 'expired' }).eq('id', invitation.id); return new Response(JSON.stringify({ error: 'Invitation expired' }), { status: 410, headers }) }
      if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) return new Response(JSON.stringify({ error: 'Email mismatch' }), { status: 403, headers })
      await supabaseAdmin.from('users').upsert({ id: user.id, org_id: invitation.org_id, email: user.email||'', full_name: user.user_metadata?.full_name||user.email?.split('@')[0]||'User', role: invitation.role, auth_provider: user.app_metadata?.provider||'email' }, { onConflict: 'id' })
      await supabaseAdmin.from('invitations').update({ status: 'accepted', accepted_at: new Date().toISOString() }).eq('id', invitation.id)
      const { data: acceptedOrg } = await supabaseAdmin.from('organizations').select('id, name, plan, slug').eq('id', invitation.org_id).maybeSingle()
      return new Response(JSON.stringify({ status: 'accepted', org: acceptedOrg, role: invitation.role }), { status: 200, headers: { 'Content-Type': 'application/json', ...headers } })
    }
    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...headers } })
  }
})
