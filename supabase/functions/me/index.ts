// supabase/functions/me/index.ts
//
// Returns: user profile + ALL their org memberships + computed permissions
// for the active org. Frontend calls this once on app boot to populate
// CastfordContext.
//
// Auth: requires JWT, but does NOT require X-Org-Id (returns memberships
// across all orgs). If X-Org-Id is provided, that becomes active_org_id.
// Otherwise active_org_id is the most recently accepted membership.

import { authenticate, sb, corsHeaders, jsonError, jsonOk, tierLimits, PERMISSION_RANK } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  // Auth — but don't require an org (we return all memberships)
  const auth = await authenticate(req, { requireOrg: false });
  if (!auth.ok) return auth.res;
  const { ctx } = auth;

  try {
    // Fetch user profile from users table
    const { data: profile } = await sb.from('users')
      .select('full_name, role, dashboard_role, created_at')
      .eq('id', ctx.user.id)
      .maybeSingle();

    // Fetch ALL active memberships across all orgs
    const { data: memberships, error: memErr } = await sb.from('org_members')
      .select(`
        id, org_id, primary_role, secondary_dashboards, permission_level,
        seat_type, manager_scope, accepted_at, status,
        organizations:org_id ( id, name, slug, tier, acquisition_path )
      `)
      .eq('user_id', ctx.user.id)
      .eq('status', 'active')
      .order('accepted_at', { ascending: false, nullsFirst: false });

    if (memErr) {
      return jsonError(500, 'Failed to load memberships', headers, { details: memErr.message });
    }

    // Determine active org
    let activeOrgId = req.headers.get('X-Org-Id');
    if (!activeOrgId && memberships && memberships.length > 0) {
      activeOrgId = memberships[0].org_id;
    }

    // Build memberships array with computed flags
    const membershipsOut = (memberships || []).map((m: any) => ({
      id: m.id,
      org_id: m.org_id,
      org_name: m.organizations?.name,
      org_slug: m.organizations?.slug,
      tier: m.organizations?.tier,
      acquisition_path: m.organizations?.acquisition_path,
      primary_role: m.primary_role,
      secondary_dashboards: m.secondary_dashboards || [],
      permission_level: m.permission_level,
      seat_type: m.seat_type,
      manager_scope: m.manager_scope,
      member_since: m.accepted_at,
      is_active_org: m.org_id === activeOrgId,
      tier_limits: m.organizations?.tier ? tierLimits(m.organizations.tier) : null,
    }));

    // For active org, compute permission shortcuts (used by frontend rendering)
    const activeMembership = membershipsOut.find(m => m.is_active_org);
    const permissions = activeMembership ? computePermissions(activeMembership) : null;

    // Pending invitations addressed to this user's email
    const { data: pending } = await sb.from('org_invitations')
      .select(`
        id, org_id, primary_role, permission_level, seat_type, expires_at, created_at,
        organizations:org_id ( name )
      `)
      .ilike('email', ctx.user.email)
      .is('accepted_at', null)
      .is('declined_at', null)
      .is('revoked_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    const pendingInvitations = (pending || []).map((p: any) => ({
      id: p.id,
      org_id: p.org_id,
      org_name: p.organizations?.name,
      primary_role: p.primary_role,
      permission_level: p.permission_level,
      seat_type: p.seat_type,
      expires_at: p.expires_at,
      created_at: p.created_at,
    }));

    return jsonOk({
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
        full_name: profile?.full_name ?? null,
        member_since: profile?.created_at ?? null,
      },
      active_org_id: activeOrgId,
      memberships: membershipsOut,
      permissions,
      pending_invitations: pendingInvitations,
      pending_invitations_count: pendingInvitations.length,
    }, headers);
  } catch (err: any) {
    console.error('[me] error:', err);
    return jsonError(500, err?.message || 'Internal error', headers);
  }
});

function computePermissions(membership: any) {
  const rank = PERMISSION_RANK[membership.permission_level] ?? 0;
  return {
    can_view: rank >= 1,
    can_edit_data: rank >= 2,
    can_invite_members: rank >= 3,
    can_manage_members: rank >= 3,
    can_change_billing: rank >= 4,
    can_transfer_ownership: rank >= 4,
    can_delete_org: rank >= 4,
  };
}
