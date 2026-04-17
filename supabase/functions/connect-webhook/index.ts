import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import Stripe from 'https://esm.sh/stripe@17.7.0'

// Connect Webhook: Handles events from connected accounts
// Subscription lifecycle + account requirement changes

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-12-18.acacia' })
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// PLACEHOLDER: Set this in Supabase Edge Function secrets
// Create a separate webhook endpoint in Stripe Dashboard for Connect events
const CONNECT_WEBHOOK_SECRET = Deno.env.get('STRIPE_CONNECT_WEBHOOK_SECRET') || ''

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: CORS })

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !CONNECT_WEBHOOK_SECRET) {
    console.error('connect-webhook: Missing signature or webhook secret')
    return new Response(JSON.stringify({ error: 'Missing signature' }), { status: 400, headers: CORS })
  }

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, CONNECT_WEBHOOK_SECRET)
  } catch (err) {
    console.error('connect-webhook: Signature verification failed:', err)
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400, headers: CORS })
  }

  console.log(`connect-webhook: ${event.type} (${event.id})`)

  try {
    switch (event.type) {
      // ── SUBSCRIPTION EVENTS ──

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const connectedAccountId = event.account || sub.metadata?.connected_account_id

        if (connectedAccountId) {
          await supabaseAdmin.from('connected_accounts').update({
            subscription_status: sub.status === 'active' ? 'active'
              : sub.status === 'past_due' ? 'past_due'
              : sub.status === 'canceled' ? 'canceled'
              : sub.status === 'trialing' ? 'trialing'
              : 'none',
            subscription_id: sub.id,
            updated_at: new Date().toISOString(),
          }).eq('stripe_account_id', connectedAccountId)

          console.log(`connect-webhook: Subscription ${sub.status} for ${connectedAccountId}`)
        } else {
          // Platform-level subscription (from metadata)
          const orgId = sub.metadata?.org_id
          const acctId = sub.metadata?.connected_account_id
          if (acctId) {
            await supabaseAdmin.from('connected_accounts').update({
              subscription_status: sub.status === 'active' ? 'active' : sub.status,
              subscription_id: sub.id,
              updated_at: new Date().toISOString(),
            }).eq('stripe_account_id', acctId)
          }
        }

        await supabaseAdmin.from('audit_log').insert({
          action: `connect.subscription.${event.type.split('.').pop()}`,
          resource_type: 'stripe_connect',
          resource_id: sub.id,
          metadata: { status: sub.status, account: event.account || '' },
        }).catch(() => {})
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const connectedAccountId = event.account || sub.metadata?.connected_account_id

        if (connectedAccountId) {
          await supabaseAdmin.from('connected_accounts').update({
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          }).eq('stripe_account_id', connectedAccountId)
        }

        await supabaseAdmin.from('audit_log').insert({
          action: 'connect.subscription.deleted',
          resource_type: 'stripe_connect',
          resource_id: sub.id,
          metadata: { account: connectedAccountId || '' },
        }).catch(() => {})
        break
      }

      // ── ACCOUNT EVENTS ──

      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        const paymentsEnabled = account.charges_enabled || false
        const detailsSubmitted = account.details_submitted || false
        const onboardingComplete = detailsSubmitted && !account.requirements?.currently_due?.length

        await supabaseAdmin.from('connected_accounts').update({
          onboarding_complete: onboardingComplete,
          payments_enabled: paymentsEnabled,
          details_submitted: detailsSubmitted,
          capabilities_status: account.capabilities || {},
          updated_at: new Date().toISOString(),
        }).eq('stripe_account_id', account.id)

        console.log(`connect-webhook: Account ${account.id} updated. Payments: ${paymentsEnabled}, Onboarded: ${onboardingComplete}`)

        await supabaseAdmin.from('audit_log').insert({
          action: 'connect.account.updated',
          resource_type: 'stripe_connect',
          resource_id: account.id,
          metadata: { payments_enabled: paymentsEnabled, onboarding_complete: onboardingComplete },
        }).catch(() => {})
        break
      }

      // ── PAYMENT METHOD EVENTS ──
      case 'payment_method.attached':
      case 'payment_method.detached': {
        console.log(`connect-webhook: ${event.type} for account ${event.account}`)
        break
      }

      // ── INVOICE EVENTS ──
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`connect-webhook: Invoice paid ${invoice.id} for account ${event.account}`)
        await supabaseAdmin.from('audit_log').insert({
          action: 'connect.invoice.paid',
          resource_type: 'stripe_connect',
          resource_id: invoice.id as string,
          metadata: { amount: invoice.amount_paid, account: event.account || '' },
        }).catch(() => {})
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log(`connect-webhook: Invoice payment failed ${invoice.id} for account ${event.account}`)
        await supabaseAdmin.from('audit_log').insert({
          action: 'connect.invoice.payment_failed',
          resource_type: 'stripe_connect',
          resource_id: invoice.id as string,
          metadata: { amount: invoice.amount_due, account: event.account || '' },
        }).catch(() => {})
        break
      }

      default:
        console.log(`connect-webhook: Unhandled event ${event.type}`)
    }
  } catch (err) {
    console.error(`connect-webhook: Error processing ${event.type}:`, err)
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200, headers: { 'Content-Type': 'application/json', ...CORS },
  })
})
