import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.7.0";

/*
  create-pack-checkout v1 — Castford Phase 3 part 2

  Creates a Stripe Checkout Session for an L3 pro pack subscription.
  Pack slugs: cfo, controller, fp_a, ceo
  Intervals: monthly, annual

  Distinct from `create-checkout` which handles L1 tier subscriptions.
  Looks up Stripe prices by `lookup_key` (resilient to catalog regeneration).

  Body: { pack_slug, interval, success_path?, cancel_path? }
  Returns: { url, session_id }
*/

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-12-18.acacia' });
const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const ALLOWED_ORIGINS = [
  'https://castford.com',
  'https://www.castford.com',
  'https://castford.vercel.app',
  'http://localhost:3000'
];

function cors(req: Request) {
  const o = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(o) ? o : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    'Content-Type': 'application/json'
  };
}

const VALID_PACKS = ['cfo', 'controller', 'fp_a', 'ceo'] as const;
const VALID_INTERVALS = ['monthly', 'annual'] as const;

// fp_a uses 'fp-a' in the Stripe lookup key (Stripe doesn't allow underscores in lookup keys without escaping)
function lookupKey(packSlug: string, interval: string): string {
  const slugForKey = packSlug === 'fp_a' ? 'fp-a' : packSlug;
  return `castford-pack-${slugForKey}-${interval}`;
}

Deno.serve(async (req: Request) => {
  const headers = cors(req);

  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }

  // ─── Auth ─────────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401, headers });
  }
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers });
  }

  // ─── Validate body ────────────────────────────────────────────────
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers });
  }

  const packSlug = String(body.pack_slug || '').toLowerCase();
  const interval = String(body.interval || '').toLowerCase();

  if (!VALID_PACKS.includes(packSlug as any)) {
    return new Response(JSON.stringify({ error: `Invalid pack_slug. Must be one of: ${VALID_PACKS.join(', ')}` }), { status: 400, headers });
  }
  if (!VALID_INTERVALS.includes(interval as any)) {
    return new Response(JSON.stringify({ error: `Invalid interval. Must be one of: ${VALID_INTERVALS.join(', ')}` }), { status: 400, headers });
  }

  // ─── Resolve user → org ───────────────────────────────────────────
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('users')
    .select('id, org_id, role, email')
    .eq('id', user.id)
    .maybeSingle();

  if (profileErr || !profile) {
    return new Response(JSON.stringify({ error: 'User profile not found' }), { status: 404, headers });
  }
  if (!profile.org_id) {
    return new Response(JSON.stringify({ error: 'User has no organization' }), { status: 404, headers });
  }
  if (!['owner', 'admin'].includes(profile.role)) {
    return new Response(JSON.stringify({ error: 'Only owners and admins can purchase pro packs' }), { status: 403, headers });
  }

  const { data: org, error: orgErr } = await supabaseAdmin
    .from('organizations')
    .select('id, name, stripe_customer_id, billing_email')
    .eq('id', profile.org_id)
    .maybeSingle();

  if (orgErr || !org) {
    return new Response(JSON.stringify({ error: 'Organization not found' }), { status: 404, headers });
  }

  // ─── Idempotency: refuse if pack already active ───────────────────
  const { data: existingPurchase } = await supabaseAdmin
    .from('org_pack_purchases')
    .select('id, status, stripe_subscription_id')
    .eq('org_id', org.id)
    .eq('pack_slug', packSlug)
    .in('status', ['active', 'trialing'])
    .maybeSingle();

  if (existingPurchase) {
    return new Response(JSON.stringify({
      error: 'already_subscribed',
      message: `Your organization already has an active ${packSlug.toUpperCase()} pack subscription. Use the billing portal to manage it.`,
      subscription_id: existingPurchase.stripe_subscription_id
    }), { status: 409, headers });
  }

  // ─── Resolve Stripe price via lookup_key ──────────────────────────
  const lk = lookupKey(packSlug, interval);
  let priceId: string;
  try {
    const prices = await stripe.prices.list({ lookup_keys: [lk], active: true, limit: 1 });
    if (!prices.data || prices.data.length === 0) {
      return new Response(JSON.stringify({
        error: `Stripe price not found for lookup_key=${lk}. Run scripts/setup-stripe-catalog.js to create the catalog.`
      }), { status: 500, headers });
    }
    priceId = prices.data[0].id;
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Stripe price lookup failed: ${err?.message}` }), { status: 502, headers });
  }

  // ─── Resolve or create Stripe Customer for the org ────────────────
  let customerId = org.stripe_customer_id;
  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: org.billing_email || profile.email || user.email || undefined,
        name: org.name || undefined,
        metadata: {
          org_id: org.id,
          created_by_user_id: user.id,
          source: 'create-pack-checkout'
        }
      });
      customerId = customer.id;
      await supabaseAdmin
        .from('organizations')
        .update({ stripe_customer_id: customerId })
        .eq('id', org.id);
    } catch (err: any) {
      return new Response(JSON.stringify({ error: `Stripe customer creation failed: ${err?.message}` }), { status: 502, headers });
    }
  }

  // ─── Create Checkout Session ──────────────────────────────────────
  const origin = req.headers.get('origin') || 'https://castford.com';
  const successPath = typeof body.success_path === 'string' && body.success_path.startsWith('/')
    ? body.success_path
    : `/dashboard?pack_purchased=${packSlug}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelPath = typeof body.cancel_path === 'string' && body.cancel_path.startsWith('/')
    ? body.cancel_path
    : `/pricing?canceled=${packSlug}`;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId!,
      line_items: [{ price: priceId, quantity: 1 }],
      // Tax & promo
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      allow_promotion_codes: true,
      // Metadata for webhook reconciliation in part 3
      metadata: {
        org_id: org.id,
        pack_slug: packSlug,
        billing_interval: interval,
        type: 'pro_pack',
        created_by_user_id: user.id
      },
      subscription_data: {
        metadata: {
          org_id: org.id,
          pack_slug: packSlug,
          billing_interval: interval,
          type: 'pro_pack'
        }
      },
      success_url: `${origin}${successPath}`,
      cancel_url: `${origin}${cancelPath}`
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Checkout session creation failed: ${err?.message}` }), { status: 502, headers });
  }

  // ─── Audit log (best-effort, never block the response) ────────────
  try {
    await supabaseAdmin.from('audit_log').insert({
      user_id: user.id,
      org_id: org.id,
      action: 'pro_pack.checkout_started',
      resource_type: 'stripe_checkout_session',
      resource_id: session.id,
      metadata: { pack_slug: packSlug, interval, price_id: priceId }
    });
  } catch (_) { /* swallow */ }

  return new Response(JSON.stringify({
    url: session.url,
    session_id: session.id,
    pack_slug: packSlug,
    interval
  }), { status: 200, headers });
});
