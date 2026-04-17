import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import Stripe from 'https://esm.sh/stripe@17.7.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-12-18.acacia' })
const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
const BASE_URL = Deno.env.get('SUPABASE_URL')!

/*
  stripe-webhook v37
  v36: Castford Stripe price IDs
  v37: Added client_reference_id org resolution for Payment Links
       Resolution order: metadata.org_id > client_reference_id > stripe_customer_id > email match
       Also resolves auth.users email (not just public.users)
*/

const PRICE_TO_PLAN: Record<string, { plan: string, interval: string }> = {
  'price_1TLtt4FV8yRihVmr0ou6Nkbk': { plan: 'starter', interval: 'monthly' },
  'price_1TLtt4FV8yRihVmrYfF6W7gx': { plan: 'starter', interval: 'annual' },
  'price_1TLttbFV8yRihVmrnahm3ggj': { plan: 'growth', interval: 'monthly' },
  'price_1TLtu7FV8yRihVmrNLEtEilH': { plan: 'growth', interval: 'annual' },
  'price_1TLtuZFV8yRihVmrkNhEVjwR': { plan: 'business', interval: 'monthly' },
  'price_1TLtv6FV8yRihVmraug5FV7F': { plan: 'business', interval: 'annual' },
}

async function findOrgByCustomer(customerId: string, customerEmail?: string): Promise<string | null> {
  // 1. Direct stripe_customer_id match
  const { data: byId } = await sb.from('organizations').select('id').eq('stripe_customer_id', customerId).maybeSingle()
  if (byId?.id) return byId.id
  // 2. Email match in public.users
  if (customerEmail) {
    const { data: byEmail } = await sb.from('users').select('org_id').eq('email', customerEmail).maybeSingle()
    if (byEmail?.org_id) { await sb.from('organizations').update({ stripe_customer_id: customerId, billing_email: customerEmail }).eq('id', byEmail.org_id); return byEmail.org_id }
    // 3. Email match in auth.users (covers OAuth users whose email might not be in public.users yet)
    const { data: { users: authUsers } } = await sb.auth.admin.listUsers({ perPage: 1 })
    // Use SQL to find by email since listUsers doesn't filter well
    const { data: authMatch } = await sb.rpc('find_user_by_email', { target_email: customerEmail }).maybeSingle()
    if (authMatch?.org_id) { await sb.from('organizations').update({ stripe_customer_id: customerId, billing_email: customerEmail }).eq('id', authMatch.org_id); return authMatch.org_id }
  }
  return null
}

async function resolveOrgId(session: any): Promise<string | null> {
  // Priority order: metadata > client_reference_id > customer lookup > email
  if (session.metadata?.org_id) return session.metadata.org_id
  if (session.client_reference_id) {
    // Validate it's a real org UUID
    const { data: org } = await sb.from('organizations').select('id').eq('id', session.client_reference_id).maybeSingle()
    if (org?.id) return org.id
  }
  const email = session.customer_details?.email || session.customer_email
  return await findOrgByCustomer(session.customer, email)
}

async function inferPlanFromSubscription(subscriptionId: string): Promise<{ plan: string, interval: string, priceId: string, amount: number } | null> {
  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['items.data.price'] })
    const item = sub.items?.data?.[0]
    if (!item?.price?.id) return null
    const priceId = item.price.id
    const mapping = PRICE_TO_PLAN[priceId]
    if (mapping) return { ...mapping, priceId, amount: item.price.unit_amount || 0 }
    try {
      const productId = typeof item.price.product === 'string' ? item.price.product : (item.price.product as any)?.id
      if (productId) {
        const product = await stripe.products.retrieve(productId)
        const name = product.name?.toLowerCase() || ''
        if (name.includes('starter')) return { plan: 'starter', interval: item.price.recurring?.interval === 'year' ? 'annual' : 'monthly', priceId, amount: item.price.unit_amount || 0 }
        if (name.includes('growth')) return { plan: 'growth', interval: item.price.recurring?.interval === 'year' ? 'annual' : 'monthly', priceId, amount: item.price.unit_amount || 0 }
        if (name.includes('business')) return { plan: 'business', interval: item.price.recurring?.interval === 'year' ? 'annual' : 'monthly', priceId, amount: item.price.unit_amount || 0 }
      }
    } catch {}
    return null
  } catch { return null }
}

async function applyPlan(orgId: string, plan: string, interval: string): Promise<void> {
  try { await fetch(`${BASE_URL}/functions/v1/billing-brain`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-cron-secret': Deno.env.get('CRON_SECRET') || '' }, body: JSON.stringify({ action: 'apply_plan', org_id: orgId, plan, interval }) }) } catch {}
}

async function logEvent(orgId: string, eventType: string, details: any): Promise<void> {
  try { await sb.from('billing_events').insert({ org_id: orgId, event_type: eventType, stripe_event_id: details.stripe_event_id, stripe_subscription_id: details.stripe_subscription_id, stripe_invoice_id: details.stripe_invoice_id, from_plan: details.from_plan, to_plan: details.to_plan, amount: details.amount, metadata: details.metadata || {} }) } catch {}
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')
    let event: any

    if (webhookSecret && sig) {
      try { event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret) }
      catch (err: any) { console.error('Signature failed:', err.message); return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 }) }
    } else { event = JSON.parse(body) }

    const { data: existing } = await sb.from('webhook_events').select('status').eq('event_id', event.id).maybeSingle()
    if (existing?.status === 'processed') return new Response(JSON.stringify({ received: true, deduplicated: true }), { status: 200 })
    try { await sb.from('webhook_events').upsert({ event_id: event.id, provider: 'stripe', event_type: event.type, status: 'processing' }, { onConflict: 'event_id' }) } catch {}

    console.log(`stripe-webhook v37: ${event.type} | ${event.id}`)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const customerId = session.customer; const subscriptionId = session.subscription
      const email = session.customer_details?.email || session.customer_email
      let orgId = await resolveOrgId(session)
      let plan = session.metadata?.plan, interval = 'monthly', amount = session.amount_total || 0
      if (subscriptionId) { const inf = await inferPlanFromSubscription(subscriptionId); if (inf) { plan = plan || inf.plan; interval = inf.interval; amount = inf.amount } }
      if (orgId && plan) {
        const { data: org } = await sb.from('organizations').select('plan').eq('id', orgId).maybeSingle()
        await sb.from('organizations').update({ plan, stripe_customer_id: customerId, stripe_subscription_id: subscriptionId, billing_email: email, billing_interval: interval, plan_updated_at: new Date().toISOString(), mbg_expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }).eq('id', orgId)
        await applyPlan(orgId, plan, interval)
        await logEvent(orgId, org?.plan === 'demo' ? 'subscription_created' : 'upgrade', { stripe_event_id: event.id, stripe_subscription_id: subscriptionId, from_plan: org?.plan || 'demo', to_plan: plan, amount })
        const { data: owner } = await sb.from('users').select('id').eq('org_id', orgId).eq('role', 'owner').maybeSingle()
        if (owner) { try { await sb.from('notifications').insert({ org_id: orgId, user_id: owner.id, channel: 'in_app', title: `Welcome to Castford ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`, body: `Your plan is active. 30-day money-back guarantee started.`, link: '/dashboard/standard' }) } catch {} }
      } else {
        console.warn(`stripe-webhook: checkout completed but no org found. customer=${customerId}, email=${email}, client_ref=${session.client_reference_id}`)
      }
      try { await sb.from('audit_log').insert({ org_id: orgId, action: 'checkout.completed', resource_type: 'stripe', resource_id: session.id, metadata: { plan, customer_id: customerId, subscription_id: subscriptionId, amount, interval, resolution_method: session.metadata?.org_id ? 'metadata' : session.client_reference_id ? 'client_reference_id' : 'email_match' } }) } catch {}
    }

    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object; const orgId = sub.metadata?.org_id || await findOrgByCustomer(sub.customer)
      if (orgId) {
        const inf = await inferPlanFromSubscription(sub.id); const { data: org } = await sb.from('organizations').select('plan').eq('id', orgId).maybeSingle()
        if (inf && inf.plan !== org?.plan) { await sb.from('organizations').update({ plan: inf.plan, stripe_subscription_id: sub.id, billing_interval: inf.interval, cancel_at_period_end: sub.cancel_at_period_end || false }).eq('id', orgId); await applyPlan(orgId, inf.plan, inf.interval); await logEvent(orgId, 'plan_change', { stripe_event_id: event.id, stripe_subscription_id: sub.id, from_plan: org?.plan, to_plan: inf.plan, amount: inf.amount }) }
        if (sub.cancel_at_period_end) { await sb.from('organizations').update({ cancel_at_period_end: true }).eq('id', orgId) }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object; const orgId = sub.metadata?.org_id || await findOrgByCustomer(sub.customer)
      if (orgId) { const { data: org } = await sb.from('organizations').select('plan').eq('id', orgId).maybeSingle(); await sb.from('organizations').update({ plan: 'demo', stripe_subscription_id: null, cancel_at_period_end: false, mrr: 0 }).eq('id', orgId); await applyPlan(orgId, 'demo', 'monthly'); await logEvent(orgId, 'subscription_canceled', { stripe_event_id: event.id, stripe_subscription_id: sub.id, from_plan: org?.plan, to_plan: 'demo' }) }
    }

    if (event.type === 'invoice.paid') { const inv = event.data.object; const orgId = await findOrgByCustomer(inv.customer); if (orgId) await logEvent(orgId, 'payment_succeeded', { stripe_event_id: event.id, stripe_invoice_id: inv.id, amount: inv.amount_paid }) }

    if (event.type === 'invoice.payment_failed') {
      const inv = event.data.object; const orgId = await findOrgByCustomer(inv.customer)
      if (orgId) { await logEvent(orgId, 'payment_failed', { stripe_event_id: event.id, stripe_invoice_id: inv.id, amount: inv.amount_due }); const { data: owner } = await sb.from('users').select('id').eq('org_id', orgId).eq('role', 'owner').maybeSingle(); if (owner) { try { await sb.from('notifications').insert({ org_id: orgId, user_id: owner.id, channel: 'in_app', title: 'Payment failed', body: 'Please update your payment method to avoid service interruption.', link: '/dashboard/standard' }) } catch {} } }
    }

    try { await sb.from('webhook_events').update({ status: 'processed', processed_at: new Date().toISOString() }).eq('event_id', event.id) } catch {}
    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err: any) {
    console.error('stripe-webhook error:', err?.message)
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 200 })
  }
})
