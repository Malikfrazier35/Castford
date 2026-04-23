// supabase/functions/set-active-org/index.ts
//
// Validates that the authenticated user has an active membership in the
// requested org. Returns success/failure. Frontend stores active_org_id
// in localStorage; this endpoint exists to:
//   1. Verify the user is allowed to switch (security)
//   2. Return the membership details for that org (so frontend has fresh state)
//   3. (Future) Set an httpOnly cookie for SSR scenarios
//
// POST { org_id: "uuid" }
// → 200 { active_org_id, membership } on success
// → 403 if user not a member of that org

import { authenticate, sb, corsHeaders, jsonError, jsonOk, tierLimits } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  if (req.method !== 'POST') {
    return jsonError(405, 'POST required', headers);
  }

  // Auth — don't require org context (we're switching it)
  const auth = await authenticate(req, { requireOrg: false });
  if (!auth.ok) return auth.res;
  const { ctx } = auth;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, 'Invalid JSON body', headers);
  }

  const newOrgId = body.org_id;
  if (!newOrgId || typeof newOrgId !== 'string') {
    return jsonError(400, 'org_id required (string)', headers);
  }

  // Validate UUID shape (cheap defense before DB hit)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newOrgId)) {
    return jsonError(400, 'org_id must be a UUID', headers);
  }

  // Verify membership in the requested org
  const { data: membership, error } = await sb.from('org_members')
    .select(`
      id, primary_role, secondary_dashboards, permission_level,
      seat_type, manager_scope, accepted_at,
      organizations:org_id ( id, name, slug, tier, acquisition_path )
    `)
    .eq('user_id', ctx.user.id)
    .eq('org_id', newOrgId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    return jsonError(500, 'Membership lookup failed', headers, { details: error.message });
  }

  if (!membership) {
    return jsonError(403, 'You are not a member of that organization', headers);
  }

  const org = (membership as any).organizations;
  return jsonOk({
    success: true,
    active_org_id: newOrgId,
    membership: {
      id: membership.id,
      org_id: newOrgId,
      org_name: org?.name,
      tier: org?.tier,
      acquisition_path: org?.acquisition_path,
      primary_role: membership.primary_role,
      secondary_dashboards: membership.secondary_dashboards || [],
      permission_level: membership.permission_level,
      seat_type: membership.seat_type,
      manager_scope: membership.manager_scope,
      tier_limits: org?.tier ? tierLimits(org.tier) : null,
    },
  }, headers);
});
