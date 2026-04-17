import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import Stripe from 'https://esm.sh/stripe@17.7.0'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-12-18.acacia' })
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }

/*
  billing-portal v2 — Castford Stripe account (acct_1SsLDtFV8yRihVmr)
*/

const PRICE_MAP: Record<string, { monthly: string, annual: string }> = {
  starter: { monthly: 'price_1TLtt4FV8yRihVmr0ou6Nkbk', annual: 'price_1TLtt4FV8yRihVmrYfF6W7gx' },
  growth: { monthly: 'price_1TLttbFV8yRihVmrnahm3ggj', annual: 'price_1TLtu7FV8yRihVmrNLEtEilH' },
  business: { monthly: 'price_1TLtuZFV8yRihVmrkNhEVjwR', annual: 'price_1TLtv6FV8yRihVmraug5FV7F' },
}

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  const { data: { user }, error } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (error || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })

  const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })
  const { data: org } = await sb.from('organizations').select('stripe_customer_id, plan, name, billing_email').eq('id', profile.org_id).maybeSingle()

  try {
    const body = await req.json()
    const action = body.action || 'create_portal'

    if (action === 'create_portal') {
      if (!org?.stripe_customer_id) return new Response(JSON.stringify({ error: 'No Stripe customer linked.', redirect: 'https://castford.com/site/pricing.html' }), { status: 400, headers })
      const session = await stripe.billingPortal.sessions.create({ customer: org.stripe_customer_id, return_url: body.return_url || 'https://castford.com/site/dashboard/billing.html' })
      return new Response(JSON.stringify({ url: session.url }), { headers })
    }

    if (action === 'create_checkout') {
      const plan = body.plan || 'starter'
      const interval = body.interval || 'monthly'
      const prices = PRICE_MAP[plan]
      if (!prices) return new Response(JSON.stringify({ error: `Unknown plan: ${plan}` }), { status: 400, headers })
      const priceId = interval === 'annual' ? prices.annual : prices.monthly

      let customerId = org?.stripe_customer_id
      if (!customerId) {
        const customer = await stripe.customers.create({ email: user.email || org?.billing_email || '', name: org?.name || 'Castford Customer', metadata: { org_id: profile.org_id, user_id: user.id } })
        customerId = customer.id
        await sb.from('organizations').update({ stripe_customer_id: customerId }).eq('id', profile.org_id)
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId, mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: 'https://castford.com/site/dashboard/billing.html?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://castford.com/site/pricing.html',
        subscription_data: { metadata: { org_id: profile.org_id, user_id: user.id, plan } },
        metadata: { org_id: profile.org_id, user_id: user.id, plan },
        allow_promotion_codes: true,
      })
      return new Response(JSON.stringify({ url: session.url, session_id: session.id }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown action. Use: create_portal, create_checkout' }), { status: 400, headers })
  } catch (err: any) { return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers }) }
})
