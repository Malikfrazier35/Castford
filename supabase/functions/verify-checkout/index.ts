import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.7.0";
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-12-18.acacia' });
const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const ALLOWED_ORIGINS = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000'];
function cors(req: Request) { const o = req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(o)?o:ALLOWED_ORIGINS[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey' }; }
Deno.serve(async (req: Request) => {
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
    const sessionId = body.session_id;
    if (!sessionId || !sessionId.startsWith('cs_')) return new Response(JSON.stringify({ error: 'Invalid session ID' }), { status: 400, headers: { 'Content-Type': 'application/json', ...headers } });
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['subscription', 'subscription.items.data.price.product'] });
    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') return new Response(JSON.stringify({ verified: false, reason: 'payment_incomplete' }), { status: 200, headers: { 'Content-Type': 'application/json', ...headers } });
    const subscription = session.subscription as any;
    if (!subscription) return new Response(JSON.stringify({ verified: false, reason: 'no_subscription' }), { status: 200, headers: { 'Content-Type': 'application/json', ...headers } });
    const productId = subscription.items?.data?.[0]?.price?.product?.id || '';
    const plan = session.metadata?.plan || 'starter';
    const { data: profile } = await supabaseAdmin.from('users').select('org_id').eq('id', user.id).maybeSingle();
    if (profile?.org_id) await supabaseAdmin.from('organizations').update({ plan, stripe_customer_id: session.customer as string, stripe_subscription_id: subscription.id }).eq('id', profile.org_id);
    try { await supabaseAdmin.from('audit_log').insert({ user_id: user.id, org_id: profile?.org_id||null, action: 'checkout.verified', resource_type: 'stripe', resource_id: sessionId, metadata: { plan, subscription_id: subscription.id } }); } catch {}
    return new Response(JSON.stringify({ verified: true, plan, subscription_status: subscription.status, subscription_id: subscription.id }), { status: 200, headers: { 'Content-Type': 'application/json', ...headers } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Verification failed' }), { status: 500, headers: { 'Content-Type': 'application/json', ...headers } });
  }
});
