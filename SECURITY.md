# Castford Security Architecture

## Infrastructure
- **Hosting**: Vercel (us-east-1, SOC 2 compliant)
- **Database**: Supabase (PostgreSQL 15, us-west-2, AES-256 at rest)
- **Auth**: Supabase Auth (Apple, Google, Email/Password)
- **Payments**: Stripe (PCI DSS Level 1)
- **AI**: Anthropic Claude (server-side proxy via Edge Function)

## Row-Level Security (RLS)
All 6 tables have RLS enabled with 24 policies:
- **organizations**: Users can only read/update their own org
- **users**: Users can only modify their own profile; read limited to org members
- **integrations**: Admin/owner-only create/update/delete; org-scoped reads
- **audit_log**: Immutable — no UPDATE/DELETE allowed (trigger-enforced)
- **session_events**: Users can only read their own events
- **waitlist**: Rate-limited to 3 entries per email per 24 hours

## Enterprise Protections
- **Audit log immutability**: Trigger blocks all UPDATE/DELETE operations
- **Role escalation prevention**: Only org owners can change user roles
- **Org transfer prevention**: Users cannot change their own org_id
- **Account closure pipeline**: Soft delete with 90-day data retention
- **Plan limit enforcement**: Server-side seat/entity limit checks
- **Data isolation**: `verify_org_access()` function for cross-org protection

## Edge Function Security
All 5 Edge Functions require JWT authentication (`verify_jwt: true`):
1. **verify-session** v5: Auth verification, rate limiting, closed account detection
2. **onboard** v4: Input validation, idempotency, allowlist enforcement
3. **create-checkout** v1: Server-side Stripe session creation
4. **stripe-webhook** v5: Signature verification, plan activation
5. **copilot** v2: Server-side API key, JWT auth

## Client-Side Security
- Zero hardcoded secrets in source code
- Environment variables via `.env.production` (publishable anon key only)
- Console outputs sanitized (no error objects leaked)
- CSP headers: script-src, connect-src, upgrade-insecure-requests
- COOP header for OAuth popup security

## Compliance Readiness
- SOC 2 architecture (audit trails, access controls, encryption)
- GDPR-ready (data retention policy, account deletion pipeline)
- 30-day money-back guarantee tracked via `mbg_expires_at`

## Manual Actions Required
1. Enable leaked password protection: Supabase → Auth → Security
2. Set STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET in Edge Function secrets
3. Set ANTHROPIC_API_KEY in copilot Edge Function secrets
4. Connect castford.com DNS (A: 76.76.21.21, CNAME: www → cname.vercel-dns.com)
