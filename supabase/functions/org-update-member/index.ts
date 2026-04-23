// supabase/functions/org-update-member/index.ts
//
// Admin/owner updates a member's role, permission, seat type, etc.
// Protections:
//   - Cannot change own permission_level (must be done by another admin/owner)
//   - Cannot demote the last owner of the org
//   - If seat_type changes to 'full', re-checks tier seat limit
//   - Tier check on new primary_role and secondary_dashboards
//
// POST {
//   membership_id (required),
//   primary_role?, permission_level?, seat_type?,
//   secondary_dashboards?, manager_scope?
// }

import {
  authenticate, sb, corsHeaders, jsonError, jsonOk, parseJsonBody,
  requirePermission, tierAllowsRole, tierLimits, getSeatUsage, logAudit, PERMISSION_RANK,
} from '../_shared/auth.ts';

const VALID_ROLES = ['cfo', 'ceo', 'fpa', 'controller', 'treasurer', 'manager'];
const VALID_PERMS = ['owner', 'admin', 'member', 'viewer', 'external'];
const VALID_SEATS = ['full', 'view_only', 'external_observer'];

Deno.serve(async (req) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST' && req.method !== 'PATCH') return jsonError(405, 'POST or PATCH required', headers);

  const auth = await authenticate(req);
  if (!auth.ok) return auth.res;
  const { ctx } = auth;

  if (!requirePermission(ctx, 'admin')) {
    return jsonError(403, 'Admin or owner required', headers);
  }

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.res;
  const body = parsed.body;

  const membershipId = body.membership_id;
  if (!membershipId || typeof membershipId !== 'string') {
    return jsonError(400, 'membership_id required', headers);
  }

  // Fetch target membership
  const { data: target, error } = await sb.from('org_members')
    .select('id, org_id, user_id, primary_role, secondary_dashboards, permission_level, seat_type, manager_scope, status')
    .eq('id', membershipId).maybeSingle();

  if (error) return jsonError(500, 'Lookup failed', headers, { details: error.message });
  if (!target) return jsonError(404, 'Membership not found', headers);
  if (target.org_id !== ctx.org_id) return jsonError(403, 'Membership does not belong to your active organization', headers);
  if (target.status !== 'active') return jsonError(409, 'Membership is not active', headers);

  // Cannot edit own permission_level
  if (target.user_id === ctx.user.id && body.permission_level && body.permission_level !== target.permission_level) {
    return jsonError(403, 'Cannot change your own permission level — ask another owner/admin', headers);
  }

  // ── Build update payload + validate ──
  const updates: any = {};

  if (body.primary_role !== undefined) {
    if (!VALID_ROLES.includes(body.primary_role)) return jsonError(400, 'Invalid primary_role', headers);
    if (!tierAllowsRole(ctx.org.tier, body.primary_role)) {
      return jsonError(403, `Tier does not include ${body.primary_role}`, headers, { tier: ctx.org.tier });
    }
    updates.primary_role = body.primary_role;
  }

  if (body.secondary_dashboards !== undefined) {
    if (!Array.isArray(body.secondary_dashboards)) return jsonError(400, 'secondary_dashboards must be array', headers);
    for (const r of body.secondary_dashboards) {
      if (!VALID_ROLES.includes(r)) return jsonError(400, `Invalid secondary dashboard: ${r}`, headers);
      if (!tierAllowsRole(ctx.org.tier, r)) return jsonError(403, `Tier does not include ${r}`, headers);
    }
    updates.secondary_dashboards = body.secondary_dashboards;
  }

  if (body.permission_level !== undefined) {
    if (!VALID_PERMS.includes(body.permission_level)) return jsonError(400, 'Invalid permission_level', headers);

    // Owner-promotion gate: only existing owners can create new owners
    if (body.permission_level === 'owner' && ctx.membership.permission_level !== 'owner') {
      return jsonError(403, 'Only owners can promote another member to owner', headers);
    }

    // Last-owner protection: if demoting an owner, ensure another owner exists
    if (target.permission_level === 'owner' && body.permission_level !== 'owner') {
      const { count: ownerCount } = await sb.from('org_members')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', ctx.org_id).eq('permission_level', 'owner').eq('status', 'active');
      if ((ownerCount || 0) <= 1) {
        return jsonError(409, 'Cannot demote the last owner — transfer ownership first', headers);
      }
    }

    updates.permission_level = body.permission_level;
  }

  if (body.seat_type !== undefined) {
    if (!VALID_SEATS.includes(body.seat_type)) return jsonError(400, 'Invalid seat_type', headers);
    // If upgrading to full or view_only, check seat capacity
    if (body.seat_type !== target.seat_type) {
      const usage = await getSeatUsage(ctx.org_id);
      const limits = tierLimits(ctx.org.tier);
      if (body.seat_type === 'full' && (usage.full + usage.pending_full) >= limits.full_seats) {
        return jsonError(403, 'Full seat limit reached', headers, {
          current_full: usage.full, tier_limit: limits.full_seats, action: 'upgrade_tier_or_purchase_overage',
        });
      }
      if (body.seat_type === 'view_only' && (usage.view_only + usage.pending_view_only) >= limits.viewer_seats) {
        return jsonError(403, 'View-only seat limit reached', headers, {
          current_view_only: usage.view_only, tier_limit: limits.viewer_seats, action: 'upgrade_tier_or_purchase_overage',
        });
      }
    }
    updates.seat_type = body.seat_type;
  }

  if (body.manager_scope !== undefined) {
    updates.manager_scope = body.manager_scope;
  }

  if (Object.keys(updates).length === 0) {
    return jsonError(400, 'No updates provided', headers);
  }

  const { data: updated, error: upErr } = await sb.from('org_members')
    .update(updates).eq('id', membershipId)
    .select('id, primary_role, secondary_dashboards, permission_level, seat_type, manager_scope').single();

  if (upErr || !updated) return jsonError(500, 'Update failed', headers, { details: upErr?.message });

  // Audit
  const { data: targetUser } = await sb.from('users').select('email').eq('id', target.user_id).maybeSingle();
  await logAudit(ctx, 'member_updated',
    { user_id: target.user_id, email: targetUser?.email },
    { membership_id: membershipId, before: target, after: updated }, req);

  return jsonOk({ success: true, membership: updated }, headers);
});
