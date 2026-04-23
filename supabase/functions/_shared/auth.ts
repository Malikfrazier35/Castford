// supabase/functions/_shared/auth.ts
//
// The standard authentication + authorization envelope used by every
// Castford edge function. Drop-in helpers:
//
//   const auth = await authenticate(req);
//   if (!auth.ok) return auth.res;
//   const { ctx } = auth;
//
//   if (!requirePermission(ctx, 'admin')) {
//     return jsonError(403, 'Admin required', corsHeaders(req));
//   }
//
// ctx contains: { user, org_id, org, membership } — everything you need
// to make permission/tier decisions and execute business logic.

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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
// authenticate(req) — full envelope
// ────────────────────────────────────────────────────────────────────────

export async function authenticate(
  req: Request,
  options: { requireOrg?: boolean } = { requireOrg: true }
): Promise<AuthResult> {
  const headers = corsHeaders(req);

  // 1. Verify JWT
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return { ok: false, res: jsonError(401, 'Missing token', headers) };

  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) {
    return { ok: false, res: jsonError(401, 'Invalid token', headers) };
  }

  // 2. Resolve active org from header or fall back to first active membership
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
      // Allow callers like /me that handle no-org case themselves
      return {
        ok: true,
        ctx: {
          user: { id: user.id, email: user.email! },
          org_id: '',
          org: null as any,
          membership: null as any,
        },
      };
    }
    return { ok: false, res: jsonError(403, 'No active organization', headers) };
  }

  // 3. Verify membership exists and is active
  const { data: membership, error: memErr } = await sb.from('org_members')
    .select('id, primary_role, secondary_dashboards, permission_level, seat_type, manager_scope')
    .eq('user_id', user.id)
    .eq('org_id', orgId)
    .eq('status', 'active')
    .maybeSingle();

  if (memErr || !membership) {
    return { ok: false, res: jsonError(403, 'Not a member of this organization', headers) };
  }

  // 4. Load org details
  const { data: org, error: orgErr } = await sb.from('organizations')
    .select('id, name, slug, tier, acquisition_path')
    .eq('id', orgId)
    .maybeSingle();

  if (orgErr || !org) {
    return { ok: false, res: jsonError(404, 'Organization not found', headers) };
  }

  return {
    ok: true,
    ctx: {
      user: { id: user.id, email: user.email! },
      org_id: orgId,
      org: org as any,
      membership: {
        ...membership,
        secondary_dashboards: membership.secondary_dashboards || [],
      } as any,
    },
  };
}

// ────────────────────────────────────────────────────────────────────────
// Permission checks
// ────────────────────────────────────────────────────────────────────────

export const PERMISSION_RANK: Record<string, number> = {
  owner: 4, admin: 3, member: 2, viewer: 1, external: 1,
};

export function requirePermission(
  ctx: AuthContext,
  level: 'owner' | 'admin' | 'member' | 'viewer'
): boolean {
  const required = PERMISSION_RANK[level] ?? 0;
  const have = PERMISSION_RANK[ctx.membership.permission_level] ?? 0;
  return have >= required;
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

const TIER_AI_BUDGET: Record<string, number> = {
  starter: 50, growth: 500, business: 99999, enterprise: 99999,
};

const TIER_FULL_SEAT_LIMIT: Record<string, number> = {
  starter: 1, growth: 5, business: 15, enterprise: 9999,
};

const TIER_VIEWER_SEAT_LIMIT: Record<string, number> = {
  starter: 1, growth: 5, business: 25, enterprise: 9999,
};

export function tierAllowsRole(tier: string, role: string): boolean {
  return TIER_DASHBOARDS[tier]?.includes(role) ?? false;
}

export function tierLimits(tier: string) {
  return {
    full_seats: TIER_FULL_SEAT_LIMIT[tier] ?? 1,
    viewer_seats: TIER_VIEWER_SEAT_LIMIT[tier] ?? 1,
    ai_queries: TIER_AI_BUDGET[tier] ?? 0,
    dashboards: TIER_DASHBOARDS[tier] ?? [],
  };
}

// User is authorized for a dashboard if it's their primary role OR
// in their secondary_dashboards OR they're owner/admin (executive override).
export function userCanAccessRole(ctx: AuthContext, role: string): boolean {
  if (!tierAllowsRole(ctx.org.tier, role)) return false;
  if (ctx.membership.primary_role === role) return true;
  if (ctx.membership.secondary_dashboards.includes(role)) return true;
  if (['owner', 'admin'].includes(ctx.membership.permission_level)) return true;
  return false;
}

// ────────────────────────────────────────────────────────────────────────
// Audit log helper (use for mutations, NOT for reads)
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
    // Audit log failures should never break the user-facing request
    console.error('[audit_log] insert failed:', e);
  }
}
