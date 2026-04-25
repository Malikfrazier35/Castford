// app/lib/castford-client.js
//
// Minimal shared client for calling Castford Supabase edge functions.
// Handles JWT auth + active org resolution from localStorage.
//
// Usage:
//   import { castfordApi } from '@/lib/castford-client';
//   const me = await castfordApi.me();
//   const r = await castfordApi.org.invite({ email, primary_role, ... });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const FN_BASE = `${SUPABASE_URL}/functions/v1`;

// Singleton Supabase client (avoids GoTrueClient duplicate warning)
let _sb = null;
export function getSupabase() {
  if (typeof window === 'undefined') {
    // Server-side: return fresh client (no shared state)
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  if (!_sb) {
    _sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return _sb;
}

// Active org management — stored in localStorage, fallback to first membership
const ACTIVE_ORG_KEY = 'castford-active-org';

export function getActiveOrgId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_ORG_KEY);
}

export function setActiveOrgId(orgId) {
  if (typeof window === 'undefined') return;
  if (orgId) localStorage.setItem(ACTIVE_ORG_KEY, orgId);
  else localStorage.removeItem(ACTIVE_ORG_KEY);
}

// ────────────────────────────────────────────────────────────────────────
// Core fetch wrapper — adds auth headers + handles JSON parsing
// ────────────────────────────────────────────────────────────────────────

async function callFn(path, options = {}) {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  const token = session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.includeOrg !== false && getActiveOrgId() && { 'X-Org-Id': getActiveOrgId() }),
    ...options.headers,
  };

  const res = await fetch(`${FN_BASE}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data = null;
  const text = await res.text();
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ────────────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────────────

export const castfordApi = {
  // User + memberships
  async me() {
    return callFn('/me', { includeOrg: false });
  },

  async setActiveOrg(orgId) {
    const result = await callFn('/set-active-org', {
      method: 'POST',
      body: { org_id: orgId },
      includeOrg: false,
    });
    if (result?.success) setActiveOrgId(orgId);
    return result;
  },

  // Dashboards
  async dashboardData(role) {
    return callFn(`/dashboard-data?role=${encodeURIComponent(role)}`);
  },

  // Org membership management
  org: {
    async invite({ email, primary_role, permission_level = 'member', seat_type = 'full', secondary_dashboards, manager_scope, personal_note }) {
      return callFn('/org-invite', {
        method: 'POST',
        body: { email, primary_role, permission_level, seat_type, secondary_dashboards, manager_scope, personal_note },
      });
    },

    async previewInvite(token) {
      return callFn(`/org-invite-preview?token=${encodeURIComponent(token)}`, { includeOrg: false });
    },

    async acceptInvite(token) {
      return callFn('/org-accept-invite', {
        method: 'POST',
        body: { token },
        includeOrg: false,
      });
    },

    async revokeInvite(invitationId) {
      return callFn('/org-revoke-invite', {
        method: 'POST',
        body: { invitation_id: invitationId },
      });
    },

    async updateMember(membershipId, updates) {
      return callFn('/org-update-member', {
        method: 'POST',
        body: { membership_id: membershipId, ...updates },
      });
    },

    async removeMember(membershipId) {
      return callFn('/org-remove-member', {
        method: 'POST',
        body: { membership_id: membershipId },
      });
    },
  },
};

// ────────────────────────────────────────────────────────────────────────
// Auth helpers (for invite acceptance flow)
// ────────────────────────────────────────────────────────────────────────

export async function signInWithApple(redirectTo) {
  const sb = getSupabase();
  return sb.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: redirectTo || window.location.href },
  });
}

export async function signInWithEmail(email, redirectTo) {
  const sb = getSupabase();
  return sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo || window.location.href },
  });
}

export async function signOut() {
  const sb = getSupabase();
  setActiveOrgId(null);
  return sb.auth.signOut();
}
