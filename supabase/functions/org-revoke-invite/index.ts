// supabase/functions/org-revoke-invite/index.ts
//
// Admin/owner revokes a pending invitation. Idempotent — already-revoked
// invitations return success without re-marking.
//
// POST { invitation_id }

import {
  authenticate, sb, corsHeaders, jsonError, jsonOk, parseJsonBody,
  requirePermission, logAudit,
} from '../_shared/auth.ts';

Deno.serve(async (req) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return jsonError(405, 'POST required', headers);

  const auth = await authenticate(req);
  if (!auth.ok) return auth.res;
  const { ctx } = auth;

  if (!requirePermission(ctx, 'admin')) {
    return jsonError(403, 'Admin or owner required', headers);
  }

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.res;
  const invitationId = parsed.body.invitation_id;

  if (!invitationId || typeof invitationId !== 'string') {
    return jsonError(400, 'invitation_id required', headers);
  }

  // Fetch invitation, verify same org
  const { data: inv, error } = await sb.from('org_invitations')
    .select('id, org_id, email, accepted_at, declined_at, revoked_at')
    .eq('id', invitationId)
    .maybeSingle();

  if (error) return jsonError(500, 'Lookup failed', headers, { details: error.message });
  if (!inv) return jsonError(404, 'Invitation not found', headers);
  if (inv.org_id !== ctx.org_id) {
    return jsonError(403, 'Invitation does not belong to your active organization', headers);
  }
  if (inv.accepted_at) return jsonError(409, 'Cannot revoke an already-accepted invitation', headers);
  if (inv.revoked_at) return jsonOk({ success: true, already_revoked: true }, headers);

  const now = new Date().toISOString();
  const { error: upErr } = await sb.from('org_invitations')
    .update({ revoked_at: now })
    .eq('id', invitationId);

  if (upErr) return jsonError(500, 'Failed to revoke', headers, { details: upErr.message });

  await logAudit(ctx, 'invitation_revoked', { email: inv.email }, { invitation_id: inv.id }, req);

  return jsonOk({ success: true, invitation_id: inv.id, revoked_at: now }, headers);
});
