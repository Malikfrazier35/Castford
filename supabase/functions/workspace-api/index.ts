import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }

/*
  workspace-api v1
  Unified brain for the Team Workspace page.
  
  Actions:
  MEMBERS: list_members, invite_member
  MESSAGES: list_messages, send_message, mark_read
  TASKS: list_tasks, create_task, update_task
  ACTIVITY: list_activity, log_activity
  PREFERENCES: get_preferences, save_preferences
*/

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })

  const { data: profile } = await sb.from('users').select('org_id, role, full_name').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return new Response(JSON.stringify({ error: 'No organization' }), { status: 404, headers })
  const orgId = profile.org_id

  try {
    const body = await req.json()
    const action = body.action || 'list_members'

    // ═══ MEMBERS ═══
    if (action === 'list_members') {
      const { data: members } = await sb.from('users').select('id, full_name, email, role, last_active_at, auth_provider, created_at').eq('org_id', orgId).order('role').order('full_name')
      const now = Date.now()
      const enriched = (members || []).map((m: any) => {
        const lastActive = m.last_active_at ? new Date(m.last_active_at).getTime() : 0
        const minutesAgo = Math.round((now - lastActive) / 60000)
        return {
          ...m,
          status: minutesAgo <= 5 ? 'online' : minutesAgo <= 30 ? 'away' : minutesAgo <= 1440 ? 'offline' : 'inactive',
          minutes_ago: minutesAgo,
          initials: (m.full_name || '').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
        }
      })
      const online = enriched.filter((m: any) => m.status === 'online').length
      return new Response(JSON.stringify({ members: enriched, online, total: enriched.length }), { headers })
    }

    // ═══ MESSAGES ═══
    if (action === 'list_messages') {
      const channel = body.channel || 'general'
      const limit = body.limit || 30
      const { data: messages } = await sb.from('workspace_messages').select('id, user_id, channel, body, mentions, parent_id, read_by, created_at, users(full_name)').eq('org_id', orgId).eq('channel', channel).order('created_at', { ascending: false }).limit(limit)
      const { count: unread } = await sb.from('workspace_messages').select('id', { count: 'exact', head: true }).eq('org_id', orgId).not('read_by', 'cs', `{${user.id}}`)
      return new Response(JSON.stringify({ messages: (messages || []).reverse(), unread: unread || 0, channel }), { headers })
    }

    if (action === 'send_message') {
      if (!body.body?.trim()) return new Response(JSON.stringify({ error: 'Message body required' }), { status: 400, headers })
      const { data: msg } = await sb.from('workspace_messages').insert({
        org_id: orgId, user_id: user.id, channel: body.channel || 'general',
        body: body.body.trim(), mentions: body.mentions || [], parent_id: body.parent_id || null,
        read_by: [user.id],
      }).select('id, body, channel, created_at').single()
      // Log activity
      await sb.from('workspace_activity').insert({ org_id: orgId, user_id: user.id, action: 'sent_message', entity_type: 'message', entity_id: msg?.id, description: `Sent message in #${body.channel || 'general'}` }).catch(() => {})
      return new Response(JSON.stringify({ status: 'sent', message: msg }), { headers })
    }

    if (action === 'mark_read') {
      if (!body.message_ids?.length) return new Response(JSON.stringify({ error: 'message_ids required' }), { status: 400, headers })
      for (const msgId of body.message_ids) {
        await sb.rpc('array_append_unique', { table_name: 'workspace_messages', row_id: msgId, column_name: 'read_by', value: user.id }).catch(async () => {
          // Fallback: direct update
          const { data: existing } = await sb.from('workspace_messages').select('read_by').eq('id', msgId).single()
          if (existing && !existing.read_by?.includes(user.id)) {
            await sb.from('workspace_messages').update({ read_by: [...(existing.read_by || []), user.id] }).eq('id', msgId)
          }
        })
      }
      return new Response(JSON.stringify({ status: 'read', count: body.message_ids.length }), { headers })
    }

    // ═══ TASKS ═══
    if (action === 'list_tasks') {
      const status = body.status || null
      let query = sb.from('workspace_tasks').select('id, title, description, status, priority, assigned_to, due_date, period, category, completed_at, created_at, users!workspace_tasks_assigned_to_fkey(full_name)').eq('org_id', orgId).order('due_date', { ascending: true, nullsFirst: false })
      if (status) query = query.eq('status', status)
      if (body.assigned_to) query = query.eq('assigned_to', body.assigned_to)
      if (body.category) query = query.eq('category', body.category)
      const { data: tasks } = await query.limit(body.limit || 50)
      const stats = {
        total: (tasks || []).length,
        pending: (tasks || []).filter((t: any) => t.status === 'pending').length,
        in_progress: (tasks || []).filter((t: any) => t.status === 'in_progress').length,
        done: (tasks || []).filter((t: any) => t.status === 'done').length,
        overdue: (tasks || []).filter((t: any) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length,
      }
      return new Response(JSON.stringify({ tasks: tasks || [], stats }), { headers })
    }

    if (action === 'create_task') {
      if (!body.title?.trim()) return new Response(JSON.stringify({ error: 'title required' }), { status: 400, headers })
      const { data: task } = await sb.from('workspace_tasks').insert({
        org_id: orgId, title: body.title.trim(), description: body.description || null,
        status: 'pending', priority: body.priority || 'medium',
        assigned_to: body.assigned_to || user.id, created_by: user.id,
        due_date: body.due_date || null, period: body.period || null,
        category: body.category || 'general',
      }).select('id, title, status, priority, due_date').single()
      await sb.from('workspace_activity').insert({ org_id: orgId, user_id: user.id, action: 'created_task', entity_type: 'task', entity_id: task?.id, description: `Created task: ${body.title}` }).catch(() => {})
      // Notify assignee if different from creator
      if (body.assigned_to && body.assigned_to !== user.id) {
        await sb.from('notifications').insert({ org_id: orgId, user_id: body.assigned_to, channel: 'in_app', title: `New task assigned: ${body.title}`, body: `${profile.full_name} assigned you a task${body.due_date ? ` due ${body.due_date}` : ''}.`, link: '/dashboard/workspace' }).catch(() => {})
      }
      return new Response(JSON.stringify({ status: 'created', task }), { headers })
    }

    if (action === 'update_task') {
      if (!body.task_id) return new Response(JSON.stringify({ error: 'task_id required' }), { status: 400, headers })
      const updates: any = {}
      if (body.status) updates.status = body.status
      if (body.priority) updates.priority = body.priority
      if (body.assigned_to) updates.assigned_to = body.assigned_to
      if (body.title) updates.title = body.title
      if (body.due_date) updates.due_date = body.due_date
      if (body.status === 'done') updates.completed_at = new Date().toISOString()
      await sb.from('workspace_tasks').update(updates).eq('id', body.task_id).eq('org_id', orgId)
      await sb.from('workspace_activity').insert({ org_id: orgId, user_id: user.id, action: 'updated_task', entity_type: 'task', entity_id: body.task_id, description: `Updated task: ${body.status ? `→ ${body.status}` : 'modified'}` }).catch(() => {})
      return new Response(JSON.stringify({ status: 'updated' }), { headers })
    }

    // ═══ ACTIVITY ═══
    if (action === 'list_activity') {
      const { data: activity } = await sb.from('workspace_activity').select('id, user_id, action, entity_type, description, created_at, users(full_name)').eq('org_id', orgId).order('created_at', { ascending: false }).limit(body.limit || 20)
      return new Response(JSON.stringify({ activity: activity || [] }), { headers })
    }

    if (action === 'log_activity') {
      await sb.from('workspace_activity').insert({ org_id: orgId, user_id: user.id, action: body.activity_action || 'custom', entity_type: body.entity_type || null, entity_id: body.entity_id || null, description: body.description || '' })
      return new Response(JSON.stringify({ status: 'logged' }), { headers })
    }

    // ═══ PREFERENCES ═══
    if (action === 'get_preferences') {
      const { data: prefs } = await sb.from('user_preferences').select('*').eq('user_id', user.id).maybeSingle()
      if (!prefs) {
        // Create default preferences
        const { data: newPrefs } = await sb.from('user_preferences').insert({ user_id: user.id, org_id: orgId }).select('*').single()
        return new Response(JSON.stringify({ preferences: newPrefs }), { headers })
      }
      return new Response(JSON.stringify({ preferences: prefs }), { headers })
    }

    if (action === 'save_preferences') {
      const allowed = ['theme', 'layout', 'default_role', 'sidebar_collapsed', 'copilot_position', 'notifications_enabled', 'email_digest', 'timezone', 'date_format', 'currency_display']
      const updates: any = { updated_at: new Date().toISOString() }
      for (const key of allowed) { if (body[key] !== undefined) updates[key] = body[key] }

      const { data: existing } = await sb.from('user_preferences').select('id').eq('user_id', user.id).maybeSingle()
      if (existing) {
        await sb.from('user_preferences').update(updates).eq('user_id', user.id)
      } else {
        await sb.from('user_preferences').insert({ user_id: user.id, org_id: orgId, ...updates })
      }
      await sb.from('workspace_activity').insert({ org_id: orgId, user_id: user.id, action: 'updated_preferences', entity_type: 'preferences', description: `Updated: ${Object.keys(updates).filter(k => k !== 'updated_at').join(', ')}` }).catch(() => {})
      return new Response(JSON.stringify({ status: 'saved', updates }), { headers })
    }

    // ═══ WORKSPACE SUMMARY ═══
    if (action === 'summary') {
      const [membersRes, tasksRes, msgsRes, activityRes, alertsRes] = await Promise.all([
        sb.from('users').select('id, full_name, last_active_at').eq('org_id', orgId),
        sb.from('workspace_tasks').select('status').eq('org_id', orgId).neq('status', 'done'),
        sb.from('workspace_messages').select('id', { count: 'exact', head: true }).eq('org_id', orgId).not('read_by', 'cs', `{${user.id}}`),
        sb.from('workspace_activity').select('id, user_id, action, description, created_at, users(full_name)').eq('org_id', orgId).order('created_at', { ascending: false }).limit(5),
        sb.from('financial_alerts').select('id', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'active'),
      ])
      const now = Date.now()
      const online = (membersRes.data || []).filter((m: any) => m.last_active_at && (now - new Date(m.last_active_at).getTime()) < 300000).length
      return new Response(JSON.stringify({
        members: { total: (membersRes.data || []).length, online },
        tasks: { open: (tasksRes.data || []).length, in_progress: (tasksRes.data || []).filter((t: any) => t.status === 'in_progress').length },
        messages: { unread: msgsRes.count || 0 },
        alerts: { active: alertsRes.count || 0 },
        recent_activity: activityRes.data || [],
      }), { headers })
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), { status: 400, headers })
  } catch (err: any) {
    console.error('workspace-api error:', err)
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers })
  }
})
