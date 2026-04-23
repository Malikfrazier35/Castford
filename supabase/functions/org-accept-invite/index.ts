// supabase/functions/org-accept-invite/index.ts
//
// Authenticated user accepts an invitation by token. Validates that the
// authenticated user's email matches the invitation email, then creates
// the org_members row.
//
// POST { token }
// Requires: valid JWT (user must be signed up + signed in)

import {
  authenticate, sb, corsHeaders, jsonError, jsonOk, parseJsonBody, logAudit,
} from '../_shared/auth.ts';

Deno.serve(async (req) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return jsonError(405, 'POST required', headers);

  // Auth — but no org context required (they're joining one)
  const auth = await authenticate(req, { requireOrg: false });
  if (!auth.ok) return auth.res;
  const { ctx } = auth;

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.res;
  const token = parsed.body.token;

  if (!token || typeof token !== 'string') {
    return jsonError(400, 'token required', headers);
  }

  // Look up invitation
  const { data: inv, error } = await sb.from('org_invitations')
    .select('id, org_id, email, primary_role, secondary_dashboards, permission_level, seat_type, manager_scope, invited_by, expires_at, accepted_at, declined_at, revoked_at')
    .eq('invitation_token', token).maybeSingle();

  if (error) return jsonError(500, 'Lookup failed', headers, { details: error.message });
  if (!inv) return jsonError(404, 'Invitation not found', headers);
  if (inv.accepted_at) return jsonError(409, 'Invitation already accepted', headers);
  if (inv.declined_at) return jsonError(409, 'Invitation was declined', headers);
  if (inv.revoked_at) return jsonError(409, 'Invitation was revoked', headers);
  if (new Date(inv.expires_at) < new Date()) return jsonError(410, 'Invitation expired', headers);

  // Verify email match (case-insensitive)
  if (ctx.user.email.toLowerCase() !== inv.email.toLowerCase()) {
    return jsonError(403, 'Invitation was for a different email address', headers, {
      invitation_email: inv.email,
      your_email: ctx.user.email,
      action: 'sign_in_with_correct_email',
    });
  }

  // Check for existing active membership in this org
  const { data: existingMem } = await sb.from('org_members')
    .select('id, status')
    .eq('user_id', ctx.user.id)
    .eq('org_id', inv.org_id)
    .maybeSingle();

  if (existingMem && existingMem.status === 'active') {
    // Already a member — just mark invitation accepted and return success
    await sb.from('org_invitations').update({ accepted_at: new Date().toISOString() }).eq('id', inv.id);
    return jsonOk({
      success: true,
      already_member: true,
      org_id: inv.org_id,
      membership_id: existingMem.id,
    }, headers);
  }

  // ── Create or reactivate membership ──
  const now = new Date().toISOString();
  let membershipId: string;

  if (existingMem && existingMem.status !== 'active') {
    // Reactivate previously-removed/inactive membership with new invitation params
    const { data: updated, error: upErr } = await sb.from('org_members')
      .update({
        primary_role: inv.primary_role,
        secondary_dashboards: inv.secondary_dashboards || [],
        permission_level: inv.permission_level,
        seat_type: inv.seat_type,
        manager_scope: inv.manager_scope,
        invited_by: inv.invited_by,
        status: 'active',
        accepted_at: now,
        access_expires_at: null,
      })
      .eq('id', existingMem.id)
      .select('id').single();
    if (upErr || !updated) return jsonError(500, 'Failed to reactivate membership', headers, { details: upErr?.message });
    membershipId = updated.id;
  } else {
    // Insert new membership
    const { data: created, error: insErr } = await sb.from('org_members')
      .insert({
        org_id: inv.org_id,
        user_id: ctx.user.id,
        primary_role: inv.primary_role,
        secondary_dashboards: inv.secondary_dashboards || [],
        permission_level: inv.permission_level,
        seat_type: inv.seat_type,
        manager_scope: inv.manager_scope,
        invited_by: inv.invited_by,
        status: 'active',
        accepted_at: now,
      })
      .select('id').single();
    if (insErr || !created) return jsonError(500, 'Failed to create membership', headers, { details: insErr?.message });
    membershipId = created.id;
  }

  // Mark invitation accepted
  await sb.from('org_invitations').update({ accepted_at: now }).eq('id', inv.id);

  // Audit log — log against the joined org
  const acceptCtx = { ...ctx, org_id: inv.org_id, org: { id: inv.org_id, name: '', slug: null, tier: 'starter', acquisition_path: 'native' } as any, membership: { id: membershipId, primary_role: inv.primary_role, secondary_dashboards: inv.secondary_dashboards || [], permission_level: inv.permission_level, seat_type: inv.seat_type, manager_scope: inv.manager_scope } as any };
  await logAudit(acceptCtx as any, 'invitation_accepted',
    { user_id: ctx.user.id, email: ctx.user.email },
    { invitation_id: inv.id, primary_role: inv.primary_role, permission_level: inv.permission_level }, req);

  return jsonOk({
    success: true,
    already_member: false,
    org_id: inv.org_id,
    membership_id: membershipId,
    primary_role: inv.primary_role,
    permission_level: inv.permission_level,
    seat_type: inv.seat_type,
  }, headers, 201);
});
