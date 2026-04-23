// supabase/functions/_shared/auth.ts
//
// Castford standard authentication + authorization envelope.

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

export const sb: SupabaseClient = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// ────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────

export interface AuthContext {
  user: { id: string; email: string };
  org_id: string;
  org: {
    id: string;
    name: string;
    slug: string | null;
    tier: 'starter' | 'growth' | 'business' | 'enterprise';
    acquisition_path: 'native' | 'hub_standalone' | 'enterprise';
  };
  membership: {
    id: string;
    primary_role: string;
    secondary_dashboards: string[];
    permission_level: 'owner' | 'admin' | 'member' | 'viewer' | 'external';
    seat_type: 'full' | 'view_only' | 'external_observer';
    manager_scope: any;
  };
}

export type AuthResult =
  | { ok: true; ctx: AuthContext }
  | { ok: false; res: Response };

// ────────────────────────────────────────────────────────────────────────
// CORS
// ────────────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  'https://castford.com',
  'https://www.castford.com',
  'https://castford.vercel.app',
  'http://localhost:3000',
];

export function corsHeaders(req: Request): HeadersInit {
  const o = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(o) ? o : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Org-Id, apikey, x-castford-version',
    'Access-Control-Max-Age': '3600',
    'Content-Type': 'application/json',
  };
}

export function jsonError(status: number, error: string, headers: HeadersInit, extra?: any): Response {
  return new Response(JSON.stringify({ error, ...extra }), { status, headers });
}

export function jsonOk(data: any, headers: HeadersInit, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers });
}

// ────────────────────────────────────────────────────────────────────────
// parseJsonBody — defensive body parser for all POST endpoints
//
// Handles a Supabase Edge Runtime + Cloudflare quirk where parsed HTTP
// headers can get prepended to the body stream when accessed via .text().
// Detects HTTP header preamble and strips it. Falls through to first `{`
// as a belt-and-suspenders fallback.
// ────────────────────────────────────────────────────────────────────────

export async function parseJsonBody(req: Request): Promise<{ ok: true; body: any } | { ok: false; res: Response }> {
  const headers = corsHeaders(req);
  let rawText = '';
  try {
    rawText = await req.text();
  } catch (e) {
    return { ok: false, res: jsonError(400, 'Could not read request body', headers, { error: String(e) }) };
  }

  if (!rawText || rawText.trim() === '') {
    return { ok: false, res: jsonError(400, 'Empty request body', headers) };
  }

  // Strip HTTP header preamble if present
  const sepIdx = rawText.indexOf('\r\n\r\n');
  if (sepIdx >= 0) {
    const preamble = rawText.substring(0, sepIdx);
    if (/^[A-Za-z][A-Za-z0-9-]+:\s/.test(preamble)) {
      rawText = rawText.substring(sepIdx + 4);
    }
  }

  // Trim to first `{` if any leading garbage remains
  const jsonStart = rawText.indexOf('{');
  if (jsonStart > 0) rawText = rawText.substring(jsonStart);

  try {
    return { ok: true, body: JSON.parse(rawText) };
  } catch (e) {
    return {
      ok: false,
      res: jsonError(400, 'Body is not valid JSON', headers, {
        received_first_100_chars: rawText.substring(0, 100),
        parse_error: String(e),
      }),
    };
  }
}

// ────────────────────────────────────────────────────────────────────────
// authenticate — full envelope
// ────────────────────────────────────────────────────────────────────────

export async function authenticate(
  req: Request,
  options: { requireOrg?: boolean } = { requireOrg: true }
): Promise<AuthResult> {
  const headers = corsHeaders(req);

  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return { ok: false, res: jsonError(401, 'Missing token', headers) };

  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) return { ok: false, res: jsonError(401, 'Invalid token', headers) };

  let orgId = req.headers.get('X-Org-Id');
  if (!orgId) {
    const { data: firstMembership } = await sb.from('org_members')
      .select('org_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('accepted_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    orgId = firstMembership?.org_id ?? null;
  }

  if (!orgId) {
    if (!options.requireOrg) {
      return {
        ok: true,
        ctx: { user: { id: user.id, email: user.email! }, org_id: '', org: null as any, membership: null as any },
      };
    }
    return { ok: false, res: jsonError(403, 'No active organization', headers) };
  }

  const { data: membership, error: memErr } = await sb.from('org_members')
    .select('id, primary_role, secondary_dashboards, permission_level, seat_type, manager_scope')
    .eq('user_id', user.id).eq('org_id', orgId).eq('status', 'active').maybeSingle();

  if (memErr || !membership) {
    return { ok: false, res: jsonError(403, 'Not a member of this organization', headers) };
  }

  const { data: org, error: orgErr } = await sb.from('organizations')
    .select('id, name, slug, tier, acquisition_path').eq('id', orgId).maybeSingle();

  if (orgErr || !org) return { ok: false, res: jsonError(404, 'Organization not found', headers) };

  return {
    ok: true,
    ctx: {
      user: { id: user.id, email: user.email! },
      org_id: orgId,
      org: org as any,
      membership: { ...membership, secondary_dashboards: membership.secondary_dashboards || [] } as any,
    },
  };
}

// ────────────────────────────────────────────────────────────────────────
// Permissions
// ────────────────────────────────────────────────────────────────────────

export const PERMISSION_RANK: Record<string, number> = {
  owner: 4, admin: 3, member: 2, viewer: 1, external: 1,
};

export function requirePermission(ctx: AuthContext, level: 'owner' | 'admin' | 'member' | 'viewer'): boolean {
  return (PERMISSION_RANK[ctx.membership.permission_level] ?? 0) >= (PERMISSION_RANK[level] ?? 0);
}

// ────────────────────────────────────────────────────────────────────────
// Tier feature gating
// ────────────────────────────────────────────────────────────────────────

const TIER_DASHBOARDS: Record<string, string[]> = {
  starter: ['ceo'],
  growth: ['ceo', 'controller', 'fpa', 'treasurer', 'manager'],
  business: ['ceo', 'controller', 'fpa', 'treasurer', 'manager', 'cfo'],
  enterprise: ['ceo', 'controller', 'fpa', 'treasurer', 'manager', 'cfo', 'multi_entity'],
};

const TIER_AI_BUDGET: Record<string, number> = { starter: 50, growth: 500, business: 99999, enterprise: 99999 };
const TIER_FULL_SEAT_LIMIT: Record<string, number> = { starter: 1, growth: 5, business: 15, enterprise: 9999 };
const TIER_VIEWER_SEAT_LIMIT: Record<string, number> = { starter: 1, growth: 5, business: 25, enterprise: 9999 };
const TIER_EXTERNAL_SEAT_LIMIT: Record<string, number> = { starter: 2, growth: 5, business: 15, enterprise: 9999 };

export function tierAllowsRole(tier: string, role: string): boolean {
  return TIER_DASHBOARDS[tier]?.includes(role) ?? false;
}

export function tierLimits(tier: string) {
  return {
    full_seats: TIER_FULL_SEAT_LIMIT[tier] ?? 1,
    viewer_seats: TIER_VIEWER_SEAT_LIMIT[tier] ?? 1,
    external_seats: TIER_EXTERNAL_SEAT_LIMIT[tier] ?? 2,
    ai_queries: TIER_AI_BUDGET[tier] ?? 0,
    dashboards: TIER_DASHBOARDS[tier] ?? [],
  };
}

export function userCanAccessRole(ctx: AuthContext, role: string): boolean {
  if (!tierAllowsRole(ctx.org.tier, role)) return false;
  if (ctx.membership.primary_role === role) return true;
  if (ctx.membership.secondary_dashboards.includes(role)) return true;
  if (['owner', 'admin'].includes(ctx.membership.permission_level)) return true;
  return false;
}

// ────────────────────────────────────────────────────────────────────────
// Seat usage helper (used by org-invite + org-update-member)
// ────────────────────────────────────────────────────────────────────────

export async function getSeatUsage(orgId: string): Promise<{
  full: number; view_only: number; external: number;
  pending_full: number; pending_view_only: number; pending_external: number;
}> {
  const now = new Date().toISOString();
  const [memQ, invQ] = await Promise.all([
    sb.from('org_members').select('seat_type').eq('org_id', orgId).eq('status', 'active'),
    sb.from('org_invitations').select('seat_type')
      .eq('org_id', orgId)
      .is('accepted_at', null).is('declined_at', null).is('revoked_at', null)
      .gt('expires_at', now),
  ]);
  const counts = { full: 0, view_only: 0, external: 0, pending_full: 0, pending_view_only: 0, pending_external: 0 };
  (memQ.data || []).forEach((m: any) => {
    if (m.seat_type === 'full') counts.full++;
    else if (m.seat_type === 'view_only') counts.view_only++;
    else if (m.seat_type === 'external_observer') counts.external++;
  });
  (invQ.data || []).forEach((i: any) => {
    if (i.seat_type === 'full') counts.pending_full++;
    else if (i.seat_type === 'view_only') counts.pending_view_only++;
    else if (i.seat_type === 'external_observer') counts.pending_external++;
  });
  return counts;
}

// ────────────────────────────────────────────────────────────────────────
// Audit log
// ────────────────────────────────────────────────────────────────────────

export async function logAudit(
  ctx: AuthContext,
  action: string,
  target?: { user_id?: string; email?: string },
  metadata?: any,
  req?: Request
) {
  try {
    await sb.from('audit_log').insert({
      org_id: ctx.org_id,
      actor_user_id: ctx.user.id,
      actor_email: ctx.user.email,
      action,
      target_user_id: target?.user_id ?? null,
      target_email: target?.email ?? null,
      metadata: metadata ?? null,
      ip_address: req?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      user_agent: req?.headers.get('user-agent') ?? null,
    });
  } catch (e) {
    console.error('[audit_log] insert failed:', e);
  }
}
