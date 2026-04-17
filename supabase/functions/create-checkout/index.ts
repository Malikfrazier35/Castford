import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.7.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-12-18.acacia' });
const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000'];
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey' }; }

const PRICE_MAP: Record<string, Record<string, string>> = {
  starter: { monthly: 'price_1TJQ5dFNFhtB2ZujJKkVC1TQ', annual: 'price_1TJQ5hFNFhtB2Zuj1npnIHRr' },
  growth:  { monthly: 'price_1TJQ5tFNFhtB2Zuj3zLMf5cE', annual: 'price_1TJQ5yFNFhtB2Zujv4gzP5LG' },
  business:{ monthly: 'price_1TJQ68FNFhtB2ZujuWy9vUcG', annual: 'price_1TJQ6EFNFhtB2Zujm9DDUIdb' },
};
const PLAN_FEATURES: Record<string, { seats: number; entities: number; label: string }> = {
  starter: { seats: 5, entities: 3, label: 'Starter' },
  growth:  { seats: 25, entities: 10, label: 'Growth' },
  business:{ seats: 999, entities: 999, label: 'Business' },
};

Deno.serve(async (req) => {
  const headers = cors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401, headers });
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers });
  try {
    const body = await req.json();
    const plan = body.plan?.toLowerCase();
    const interval = body.interval === 'annual' ? 'annual' : 'monthly';
    if (!plan || !PRICE_MAP[plan]) return new Response(JSON.stringify({ error: `Invalid plan: ${plan}` }), { status: 400, headers: { 'Content-Type': 'application/json', ...headers } });
    const priceId = PRICE_MAP[plan][interval];
    const planInfo = PLAN_FEATURES[plan];
    const origin = req.headers.get('origin') || 'https://castford.com';
    const { data: userProfile } = await supabaseAdmin.from('users').select('org_id').eq('id', user.id).maybeSingle();
    let customerId: string | undefined; let orgId: string | undefined;
    if (userProfile?.org_id) {
      orgId = userProfile.org_id;
      const { data: org } = await supabaseAdmin.from('organizations').select('stripe_customer_id').eq('id', userProfile.org_id).maybeSingle();
      if (org?.stripe_customer_id) customerId = org.stripe_customer_id;
    }
    const sessionParams: any = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/login?checkout=success&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?checkout=cancel&plan=${plan}`,
      metadata: { user_id: user.id, org_id: orgId || '', plan, plan_label: planInfo.label, interval },
      subscription_data: { metadata: { user_id: user.id, org_id: orgId || '', plan, plan_label: planInfo.label } },
      allow_promotion_codes: true,
    };
    if (customerId) sessionParams.customer = customerId;
    else sessionParams.customer_email = user.email;
    const session = await stripe.checkout.sessions.create(sessionParams);
    try { await supabaseAdmin.from('audit_log').insert({ user_id: user.id, org_id: orgId || null, action: 'checkout.initiated', resource_type: 'stripe', resource_id: session.id, metadata: { plan, plan_label: planInfo.label, interval, price_id: priceId } }); } catch {}
    return new Response(JSON.stringify({ url: session.url, session_id: session.id, plan, plan_label: planInfo.label, interval }), { status: 200, headers: { 'Content-Type': 'application/json', ...headers } });
  } catch (err: any) {
    console.error('create-checkout error:', err?.message);
    return new Response(JSON.stringify({ error: 'Checkout failed', detail: err?.message }), { status: 500, headers: { 'Content-Type': 'application/json', ...headers } });
  }
});
