// supabase/functions/org-invite-preview/index.ts
//
// Public endpoint (no auth) that returns invitation details by token.
// Used by the /invite/[token] page to render org name, role, etc.
// before the user signs in to accept.
//
// GET /org-invite-preview?token=xxx OR POST { token }

import { sb, corsHeaders, jsonError, jsonOk, parseJsonBody } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  let token: string | null = null;
  if (req.method === 'GET') {
    token = new URL(req.url).searchParams.get('token');
  } else if (req.method === 'POST') {
    const parsed = await parseJsonBody(req);
    if (!parsed.ok) return parsed.res;
    token = parsed.body.token;
  } else {
    return jsonError(405, 'GET or POST required', headers);
  }

  if (!token || typeof token !== 'string' || token.length < 32) {
    return jsonError(400, 'Valid token required', headers);
  }

  const { data: inv, error } = await sb.from('org_invitations')
    .select(`
      id, email, primary_role, secondary_dashboards, permission_level, seat_type,
      manager_scope, personal_note, expires_at, accepted_at, declined_at, revoked_at,
      created_at, invited_by,
      organizations:org_id ( id, name, slug, tier ),
      inviter:invited_by ( email, full_name )
    `)
    .eq('invitation_token', token)
    .maybeSingle();

  if (error) return jsonError(500, 'Lookup failed', headers, { details: error.message });
  if (!inv) return jsonError(404, 'Invitation not found', headers);

  // Status checks
  let status: 'valid' | 'accepted' | 'declined' | 'revoked' | 'expired' = 'valid';
  let status_message: string | null = null;
  if (inv.accepted_at) { status = 'accepted'; status_message = 'This invitation has already been accepted'; }
  else if (inv.declined_at) { status = 'declined'; status_message = 'This invitation was declined'; }
  else if (inv.revoked_at) { status = 'revoked'; status_message = 'This invitation has been revoked'; }
  else if (new Date(inv.expires_at) < new Date()) { status = 'expired'; status_message = 'This invitation has expired'; }

  return jsonOk({
    status,
    status_message,
    invitation: {
      id: inv.id,
      email: inv.email,
      org_id: (inv as any).organizations?.id,
      org_name: (inv as any).organizations?.name,
      org_tier: (inv as any).organizations?.tier,
      primary_role: inv.primary_role,
      secondary_dashboards: inv.secondary_dashboards || [],
      permission_level: inv.permission_level,
      seat_type: inv.seat_type,
      manager_scope: inv.manager_scope,
      personal_note: inv.personal_note,
      inviter_email: (inv as any).inviter?.email,
      inviter_name: (inv as any).inviter?.full_name,
      expires_at: inv.expires_at,
      created_at: inv.created_at,
    },
  }, headers);
});
