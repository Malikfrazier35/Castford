import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const RESEND_KEY = Deno.env.get('RESEND_API_KEY') || ''
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'Castford <notifications@castford.com>'
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }

/*
  Notify v1 — Unified notification delivery
  Channels: in_app, email
  
  Actions:
  - send: Create + deliver a notification
  - list: Get user's unread notifications
  - read: Mark notification as read
  - read_all: Mark all as read
*/

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_KEY) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    })
    return res.ok
  } catch { return false }
}

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })

  const { data: profile } = await sb.from('users').select('org_id, role').eq('id', user.id).maybeSingle()
  const orgId = profile?.org_id

  try {
    const body = await req.json()
    const action = body.action || 'list'

    // === LIST unread notifications ===
    if (action === 'list') {
      const { data: notifs } = await sb.from('notifications').select('id, title, body, link, channel, read, sent_at').eq('user_id', user.id).order('sent_at', { ascending: false }).limit(body.limit || 20)
      const { count: unread } = await sb.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false)
      return new Response(JSON.stringify({ notifications: notifs || [], unread_count: unread || 0 }), { headers })
    }

    // === READ single notification ===
    if (action === 'read') {
      if (!body.notification_id) return new Response(JSON.stringify({ error: 'notification_id required' }), { status: 400, headers })
      await sb.from('notifications').update({ read: true, read_at: new Date().toISOString() }).eq('id', body.notification_id).eq('user_id', user.id)
      return new Response(JSON.stringify({ status: 'read' }), { headers })
    }

    // === READ ALL ===
    if (action === 'read_all') {
      const { count } = await sb.from('notifications').update({ read: true, read_at: new Date().toISOString() }, { count: 'exact' }).eq('user_id', user.id).eq('read', false)
      return new Response(JSON.stringify({ status: 'all_read', marked: count || 0 }), { headers })
    }

    // === SEND notification (admin/system only) ===
    if (action === 'send') {
      if (profile?.role !== 'owner' && profile?.role !== 'admin') return new Response(JSON.stringify({ error: 'Admin required' }), { status: 403, headers })

      const channels = body.channels || ['in_app']
      const targetUserId = body.user_id || user.id
      const results: string[] = []

      // In-app
      if (channels.includes('in_app')) {
        await sb.from('notifications').insert({ org_id: orgId, user_id: targetUserId, channel: 'in_app', title: body.title, body: body.body, link: body.link || null })
        results.push('in_app')
      }

      // Email
      if (channels.includes('email')) {
        const { data: targetUser } = await sb.from('users').select('email, full_name').eq('id', targetUserId).maybeSingle()
        if (targetUser?.email) {
          const html = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px"><h2 style="color:#0C1420;margin:0 0 8px">${body.title}</h2><p style="color:#4b5563;font-size:14px;line-height:1.6">${body.body || ''}</p>${body.link ? `<p style="margin-top:16px"><a href="https://castford.com${body.link}" style="background:#5B7FCC;color:#fff;padding:10px 24px;text-decoration:none;font-weight:700;font-size:13px">View in Dashboard</a></p>` : ''}<p style="font-size:11px;color:#9ca3af;margin-top:24px">Castford FP&A Platform</p></div>`
          const sent = await sendEmail(targetUser.email, body.title, html)
          if (sent) results.push('email')
        }
      }

      return new Response(JSON.stringify({ status: 'sent', channels: results }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown action. Use: list, read, read_all, send' }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers })
  }
})
