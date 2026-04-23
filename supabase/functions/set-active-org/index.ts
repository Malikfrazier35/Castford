// supabase/functions/set-active-org/index.ts
//
// v3: Defensive body parsing. In some Supabase Edge Runtime + Cloudflare
// configurations, the parsed HTTP headers get prepended to the body stream
// when accessed via req.text(). We detect this by looking for the JSON
// start marker and skipping any preamble.

import { authenticate, sb, corsHeaders, jsonError, jsonOk, tierLimits } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  if (req.method !== 'POST') {
    return jsonError(405, 'POST required', headers);
  }

  let rawText = '';
  try {
    rawText = await req.text();
  } catch (e) {
    return jsonError(400, 'Could not read request body', headers, { error: String(e) });
  }

  if (!rawText || rawText.trim() === '') {
    return jsonError(400, 'Empty request body', headers);
  }

  // ── Defensive: strip HTTP header preamble if Edge Runtime injected it ──
  // Look for `\r\n\r\n` (HTTP header/body separator). If found AND the
  // preamble looks like HTTP headers, skip past it.
  const headerSep = '\r\n\r\n';
  const sepIdx = rawText.indexOf(headerSep);
  if (sepIdx >= 0) {
    const preamble = rawText.substring(0, sepIdx);
    if (/^[A-Za-z][A-Za-z0-9-]+:\s/.test(preamble)) {
      rawText = rawText.substring(sepIdx + headerSep.length);
    }
  }

  // ── Belt + suspenders: also trim to first `{` if leading garbage remains ──
  const jsonStart = rawText.indexOf('{');
  if (jsonStart > 0) {
    rawText = rawText.substring(jsonStart);
  }

  let body: any;
  try {
    body = JSON.parse(rawText);
  } catch (e) {
    return jsonError(400, 'Body is not valid JSON', headers, {
      received_first_100_chars: rawText.substring(0, 100),
      received_length: rawText.length,
      parse_error: String(e),
    });
  }

  // Auth
  const auth = await authenticate(req, { requireOrg: false });
  if (!auth.ok) return auth.res;
  const { ctx } = auth;

  const newOrgId = body.org_id;
  if (!newOrgId || typeof newOrgId !== 'string') {
    return jsonError(400, 'org_id required (string)', headers);
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newOrgId)) {
    return jsonError(400, 'org_id must be a UUID', headers);
  }

  // Verify membership
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
