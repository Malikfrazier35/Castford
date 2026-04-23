// supabase/functions/org-remove-member/index.ts
//
// Admin/owner removes a member. Soft delete (status='removed').
// Protections:
//   - Cannot remove self (use future org-leave endpoint)
//   - Cannot remove the last owner of the org
//
// POST { membership_id }

import {
  authenticate, sb, corsHeaders, jsonError, jsonOk, parseJsonBody,
  requirePermission, logAudit,
} from '../_shared/auth.ts';

Deno.serve(async (req) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST' && req.method !== 'DELETE') return jsonError(405, 'POST or DELETE required', headers);

  const auth = await authenticate(req);
  if (!auth.ok) return auth.res;
  const { ctx } = auth;

  if (!requirePermission(ctx, 'admin')) {
    return jsonError(403, 'Admin or owner required', headers);
  }

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.res;
  const membershipId = parsed.body.membership_id;

  if (!membershipId || typeof membershipId !== 'string') {
    return jsonError(400, 'membership_id required', headers);
  }

  const { data: target, error } = await sb.from('org_members')
    .select('id, org_id, user_id, permission_level, status').eq('id', membershipId).maybeSingle();

  if (error) return jsonError(500, 'Lookup failed', headers, { details: error.message });
  if (!target) return jsonError(404, 'Membership not found', headers);
  if (target.org_id !== ctx.org_id) return jsonError(403, 'Membership does not belong to your active organization', headers);
  if (target.status !== 'active') return jsonError(409, 'Membership is not active', headers);

  // Self-removal disallowed
  if (target.user_id === ctx.user.id) {
    return jsonError(403, 'You cannot remove yourself — use organization leave flow', headers);
  }

  // Last-owner protection
  if (target.permission_level === 'owner') {
    const { count: ownerCount } = await sb.from('org_members')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', ctx.org_id).eq('permission_level', 'owner').eq('status', 'active');
    if ((ownerCount || 0) <= 1) {
      return jsonError(409, 'Cannot remove the last owner — transfer ownership first', headers);
    }
  }

  const { error: upErr } = await sb.from('org_members')
    .update({ status: 'removed' }).eq('id', membershipId);

  if (upErr) return jsonError(500, 'Removal failed', headers, { details: upErr.message });

  const { data: targetUser } = await sb.from('users').select('email').eq('id', target.user_id).maybeSingle();
  await logAudit(ctx, 'member_removed',
    { user_id: target.user_id, email: targetUser?.email },
    { membership_id: membershipId, removed_permission_level: target.permission_level }, req);

  return jsonOk({ success: true, membership_id: membershipId, status: 'removed' }, headers);
});
