// supabase/functions/org-invite/index.ts
//
// Creates an invitation for someone to join the active org. Admin/owner only.
// Sends an email via Resend with a one-click accept link. Returns the
// invitation record + the accept URL (so admins can copy-paste manually).
//
// POST {
//   email: string (required),
//   primary_role: 'cfo'|'ceo'|'fpa'|'controller'|'treasurer'|'manager' (required),
//   permission_level: 'owner'|'admin'|'member'|'viewer'|'external' (default: 'member'),
//   seat_type: 'full'|'view_only'|'external_observer' (default: 'full'),
//   secondary_dashboards?: string[],
//   manager_scope?: { departments?, cost_centers?, kpi_categories? },
//   personal_note?: string (max 500 chars)
// }

import {
  authenticate, sb, corsHeaders, jsonError, jsonOk, parseJsonBody,
  requirePermission, tierAllowsRole, tierLimits, getSeatUsage, logAudit,
} from '../_shared/auth.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM = Deno.env.get('RESEND_FROM_EMAIL') || 'Castford <invites@castford.com>';
const APP_BASE_URL = Deno.env.get('APP_BASE_URL') || 'https://castford.com';

const VALID_ROLES = ['cfo', 'ceo', 'fpa', 'controller', 'treasurer', 'manager'];
const VALID_PERMS = ['owner', 'admin', 'member', 'viewer', 'external'];
const VALID_SEATS = ['full', 'view_only', 'external_observer'];

Deno.serve(async (req) => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return jsonError(405, 'POST required', headers);

  // Auth + admin check
  const auth = await authenticate(req);
  if (!auth.ok) return auth.res;
  const { ctx } = auth;

  if (!requirePermission(ctx, 'admin')) {
    return jsonError(403, 'Admin or owner required to invite members', headers, {
      your_permission: ctx.membership.permission_level,
    });
  }

  // Parse + validate
  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.res;
  const body = parsed.body;

  const email = String(body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError(400, 'Valid email required', headers);
  }

  const primary_role = body.primary_role;
  if (!VALID_ROLES.includes(primary_role)) {
    return jsonError(400, 'Invalid primary_role', headers, { valid: VALID_ROLES });
  }
  if (!tierAllowsRole(ctx.org.tier, primary_role)) {
    return jsonError(403, `Your tier does not include the ${primary_role} dashboard`, headers, {
      tier: ctx.org.tier,
      tier_dashboards: tierLimits(ctx.org.tier).dashboards,
      action: 'upgrade_tier',
    });
  }

  const permission_level = body.permission_level || 'member';
  if (!VALID_PERMS.includes(permission_level)) {
    return jsonError(400, 'Invalid permission_level', headers, { valid: VALID_PERMS });
  }
  if (permission_level === 'owner') {
    return jsonError(400, 'Cannot invite as owner — use org-transfer-ownership after they join', headers);
  }

  const seat_type = body.seat_type || 'full';
  if (!VALID_SEATS.includes(seat_type)) {
    return jsonError(400, 'Invalid seat_type', headers, { valid: VALID_SEATS });
  }

  const secondary_dashboards = Array.isArray(body.secondary_dashboards) ? body.secondary_dashboards : [];
  for (const r of secondary_dashboards) {
    if (!VALID_ROLES.includes(r)) return jsonError(400, `Invalid secondary dashboard: ${r}`, headers);
    if (!tierAllowsRole(ctx.org.tier, r)) return jsonError(403, `Tier does not include ${r}`, headers);
  }

  const personal_note = typeof body.personal_note === 'string' ? body.personal_note.substring(0, 500) : null;

  // Manager scope only valid for primary_role=manager
  let manager_scope = null;
  if (primary_role === 'manager') {
    manager_scope = body.manager_scope || null;
  }

  // ── Seat limit check ──
  const usage = await getSeatUsage(ctx.org_id);
  const limits = tierLimits(ctx.org.tier);
  if (seat_type === 'full' && (usage.full + usage.pending_full) >= limits.full_seats) {
    return jsonError(403, 'Full seat limit reached for your tier', headers, {
      current_full_seats: usage.full,
      pending_full_invites: usage.pending_full,
      tier_limit: limits.full_seats,
      tier: ctx.org.tier,
      action: 'upgrade_tier_or_purchase_overage',
      overage_pricing_per_seat: ctx.org.tier === 'business' ? 200 : ctx.org.tier === 'growth' ? 80 : null,
    });
  }
  if (seat_type === 'view_only' && (usage.view_only + usage.pending_view_only) >= limits.viewer_seats) {
    return jsonError(403, 'View-only seat limit reached for your tier', headers, {
      current_view_only_seats: usage.view_only,
      pending_view_only_invites: usage.pending_view_only,
      tier_limit: limits.viewer_seats,
      action: 'upgrade_tier_or_purchase_overage',
      overage_pricing_per_seat: 25,
    });
  }
  if (seat_type === 'external_observer' && (usage.external + usage.pending_external) >= limits.external_seats) {
    return jsonError(403, 'External observer seat limit reached for your tier', headers, {
      current_external: usage.external,
      pending_external: usage.pending_external,
      tier_limit: limits.external_seats,
      action: 'upgrade_tier',
    });
  }

  // ── Check for existing membership (conflict) ──
  const { data: existingUser } = await sb.from('users').select('id').ilike('email', email).maybeSingle();
  if (existingUser?.id) {
    const { data: existingMem } = await sb.from('org_members')
      .select('id, status').eq('user_id', existingUser.id).eq('org_id', ctx.org_id).maybeSingle();
    if (existingMem && existingMem.status === 'active') {
      return jsonError(409, 'This person is already an active member of this organization', headers);
    }
  }

  // ── Auto-revoke any existing pending invitation for same email + org ──
  await sb.from('org_invitations')
    .update({ revoked_at: new Date().toISOString() })
    .eq('org_id', ctx.org_id).ilike('email', email)
    .is('accepted_at', null).is('declined_at', null).is('revoked_at', null);

  // ── Insert new invitation ──
  const { data: invitation, error: insErr } = await sb.from('org_invitations')
    .insert({
      org_id: ctx.org_id,
      email,
      primary_role,
      secondary_dashboards,
      permission_level,
      seat_type,
      manager_scope,
      invited_by: ctx.user.id,
      personal_note,
    })
    .select('id, invitation_token, expires_at, created_at')
    .single();

  if (insErr || !invitation) {
    return jsonError(500, 'Failed to create invitation', headers, { details: insErr?.message });
  }

  const acceptUrl = `${APP_BASE_URL}/invite/${invitation.invitation_token}`;

  // ── Send email via Resend (non-blocking failure) ──
  let emailSent = false;
  let emailError: string | null = null;
  if (RESEND_API_KEY) {
    try {
      const { html, text, subject } = buildEmail({
        org_name: ctx.org.name,
        inviter_email: ctx.user.email,
        recipient_email: email,
        primary_role,
        permission_level,
        seat_type,
        personal_note,
        accept_url: acceptUrl,
        expires_at: invitation.expires_at,
      });

      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [email],
          subject,
          html,
          text,
          tags: [
            { name: 'category', value: 'invitation' },
            { name: 'org_id', value: ctx.org_id },
          ],
        }),
      });
      if (r.ok) emailSent = true;
      else emailError = `Resend ${r.status}: ${(await r.text()).substring(0, 200)}`;
    } catch (e) {
      emailError = String(e);
    }
  } else {
    emailError = 'RESEND_API_KEY not configured';
  }

  // ── Audit log ──
  await logAudit(ctx, 'invitation_created', { email },
    { primary_role, permission_level, seat_type, email_sent: emailSent }, req);

  return jsonOk({
    success: true,
    invitation: {
      id: invitation.id,
      email,
      primary_role,
      permission_level,
      seat_type,
      expires_at: invitation.expires_at,
      created_at: invitation.created_at,
    },
    accept_url: acceptUrl,
    email_sent: emailSent,
    email_error: emailError,
  }, headers, 201);
});

// ────────────────────────────────────────────────────────────────────────
// Email template (denim/gold branded)
// ────────────────────────────────────────────────────────────────────────

function buildEmail(p: {
  org_name: string; inviter_email: string; recipient_email: string;
  primary_role: string; permission_level: string; seat_type: string;
  personal_note: string | null; accept_url: string; expires_at: string;
}) {
  const roleLabels: Record<string, string> = {
    cfo: 'CFO Hub', ceo: 'Founder Dashboard', controller: 'Controller',
    fpa: 'FP&A', treasurer: 'Treasurer', manager: 'Manager Dashboard',
  };
  const permLabels: Record<string, string> = {
    owner: 'Owner', admin: 'Admin', member: 'Member', viewer: 'Viewer', external: 'External Observer',
  };
  const seatLabels: Record<string, string> = {
    full: 'Full seat', view_only: 'View-only seat', external_observer: 'External observer',
  };

  const subject = `${p.inviter_email} invited you to ${p.org_name} on Castford`;
  const expiryStr = new Date(p.expires_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#F8F9FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a2332">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#F8F9FC;padding:40px 16px">
<tr><td align="center">
<table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.06),0 1px 2px rgba(15,23,42,0.04)">
<tr><td style="padding:32px 40px;background:#5B7FCC;background:linear-gradient(135deg,#5B7FCC 0%,#4A6BB3 100%)">
<div style="color:#ffffff;font-family:'Instrument Serif',Georgia,serif;font-size:28px;letter-spacing:-0.02em">Castford</div>
<div style="color:rgba(255,255,255,0.78);font-size:13px;margin-top:4px">AI-native FP&amp;A</div>
</td></tr>
<tr><td style="padding:40px 40px 24px">
<h1 style="margin:0 0 16px;font-family:'Instrument Serif',Georgia,serif;font-size:24px;font-weight:400;color:#1a2332;line-height:1.3">You've been invited to ${escapeHtml(p.org_name)}</h1>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569">
<strong style="color:#1a2332">${escapeHtml(p.inviter_email)}</strong> invited you to join their organization on Castford.
</p>
${p.personal_note ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px"><tr><td style="padding:16px 18px;background:#F8F9FC;border-left:3px solid #C4884A;border-radius:4px;font-size:14px;line-height:1.6;color:#475569;font-style:italic">"${escapeHtml(p.personal_note)}"</td></tr></table>` : ''}
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;background:#F8F9FC;border-radius:6px"><tr><td style="padding:16px 18px">
<div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;margin-bottom:10px">Your role</div>
<div style="font-size:14px;line-height:1.8;color:#1a2332">
<strong>Dashboard:</strong> ${escapeHtml(roleLabels[p.primary_role] || p.primary_role)}<br>
<strong>Permission:</strong> ${escapeHtml(permLabels[p.permission_level] || p.permission_level)}<br>
<strong>Seat type:</strong> ${escapeHtml(seatLabels[p.seat_type] || p.seat_type)}
</div></td></tr></table>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px"><tr><td align="center">
<a href="${escapeHtml(p.accept_url)}" style="display:inline-block;padding:14px 28px;background:#5B7FCC;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:6px;letter-spacing:-0.005em">Accept invitation →</a>
</td></tr></table>
<p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;text-align:center">
This invitation expires on ${expiryStr}.<br>
If the button doesn't work, paste this link: <a href="${escapeHtml(p.accept_url)}" style="color:#5B7FCC;word-break:break-all">${escapeHtml(p.accept_url)}</a>
</p>
</td></tr>
<tr><td style="padding:24px 40px;background:#F8F9FC;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center">
<div>Sent to ${escapeHtml(p.recipient_email)}</div>
<div style="margin-top:6px">Castford · castford.com</div>
</td></tr>
</table>
</td></tr></table>
</body></html>`;

  const text = `You've been invited to ${p.org_name}

${p.inviter_email} invited you to join their organization on Castford.
${p.personal_note ? `\n"${p.personal_note}"\n` : ''}
Your role:
  Dashboard: ${roleLabels[p.primary_role] || p.primary_role}
  Permission: ${permLabels[p.permission_level] || p.permission_level}
  Seat type: ${seatLabels[p.seat_type] || p.seat_type}

Accept invitation: ${p.accept_url}

This invitation expires on ${expiryStr}.

—
Castford · castford.com
Sent to ${p.recipient_email}
`;

  return { html, text, subject };
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
