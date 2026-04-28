#!/usr/bin/env node
/**
 * Castford Phase 3 part 5 — Stripe Customer Portal configuration
 *
 * Configures (or upserts) the Stripe Billing Portal so customers can:
 *   - Update payment methods
 *   - Update billing address (required for Stripe Tax)
 *   - View and download invoices
 *   - Cancel any subscription (at period end) — works for both L1 tiers and L3 packs
 *
 * Plan switching is intentionally disabled — Stripe's portal applies one
 * config to all subscriptions per customer, so a customer on a CFO pack
 * would otherwise see L1 tiers as "upgrade" targets, which is incorrect.
 * Customers who want to switch tiers can cancel + repurchase from /pricing.
 *
 * Idempotent — finds the existing default portal config and updates it,
 * or creates a new default if none exists.
 *
 * Usage:
 *   1. cd ~/Desktop/Castford
 *   2. npm install --no-save stripe   (one-time, if not already)
 *   3. STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe-portal.js
 *      (or sk_test_... for test mode)
 *
 * Output:
 *   - logs the resulting portal configuration ID
 *   - exits 0 on success, 1 on any error
 *
 * Note: Stripe billing portals are configured per-account, not per-product.
 * This script sets the *default* configuration which billing-portal.ts uses.
 */

const fs = require('fs');
const path = require('path');

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not set. Export it first:');
  console.error('   export STRIPE_SECRET_KEY=sk_live_...');
  console.error('   node scripts/setup-stripe-portal.js');
  process.exit(1);
}
if (!STRIPE_KEY.startsWith('sk_test_') && !STRIPE_KEY.startsWith('sk_live_')) {
  console.error('❌ STRIPE_SECRET_KEY must start with sk_test_ or sk_live_');
  process.exit(1);
}
const MODE = STRIPE_KEY.startsWith('sk_live_') ? 'LIVE' : 'TEST';
console.log(`▸ Mode: ${MODE}`);

let Stripe;
try {
  Stripe = require('stripe');
} catch (err) {
  console.error('❌ stripe package not found. Install it first:');
  console.error('   npm install --no-save stripe');
  process.exit(1);
}
const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2024-12-18.acacia' });

async function buildConfig() {
  return {
    business_profile: {
      headline: 'Castford — manage your subscription',
      privacy_policy_url: 'https://castford.com/privacy',
      terms_of_service_url: 'https://castford.com/terms'
    },
    default_return_url: 'https://castford.com/site/dashboard/billing.html',
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ['email', 'address', 'name', 'phone', 'tax_id']
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: {
        enabled: true,
        mode: 'at_period_end',
        proration_behavior: 'none',
        cancellation_reason: {
          enabled: true,
          options: [
            'too_expensive',
            'missing_features',
            'switched_service',
            'unused',
            'customer_service',
            'too_complex',
            'low_quality',
            'other'
          ]
        }
      },
      // Plan switching disabled by design:
      //  - A customer on a CFO pack shouldn't see L1 tiers as "upgrade" targets.
      //  - Stripe's portal config is a single shape; can't differentiate L1 vs L3.
      //  - Cancel + buy new flow handles all real upgrade paths cleanly.
      subscription_update: { enabled: false }
    }
  };
}

async function findDefaultConfig() {
  let cursor;
  while (true) {
    const page = await stripe.billingPortal.configurations.list({
      limit: 100,
      ...(cursor ? { starting_after: cursor } : {})
    });
    for (const cfg of page.data) {
      if (cfg.is_default) return cfg;
    }
    if (!page.has_more) break;
    cursor = page.data[page.data.length - 1].id;
  }
  return null;
}

async function main() {
  console.log('▸ Building portal configuration…');
  const config = await buildConfig();

  console.log('▸ Looking for existing default portal config…');
  const existing = await findDefaultConfig();

  let result;
  if (existing) {
    console.log(`  ↪ Found existing default: ${existing.id} — updating`);
    result = await stripe.billingPortal.configurations.update(existing.id, config);
  } else {
    console.log('  ↪ None found — creating new default');
    result = await stripe.billingPortal.configurations.create({
      ...config,
      // The first config you create automatically becomes default,
      // but be explicit just in case:
    });
    // If a non-default config was created somehow, mark it default:
    if (!result.is_default) {
      result = await stripe.billingPortal.configurations.update(result.id, { default: true });
    }
  }

  console.log('');
  console.log('✅ Stripe Customer Portal configured');
  console.log('   Configuration ID:', result.id);
  console.log('   Default:         ', result.is_default);
  console.log('   Active:          ', result.active);
  console.log('   Mode:            ', MODE);
  console.log('');
  console.log('   Features enabled:');
  console.log('   - customer_update:        ', result.features.customer_update.enabled);
  console.log('   - invoice_history:        ', result.features.invoice_history.enabled);
  console.log('   - payment_method_update:  ', result.features.payment_method_update.enabled);
  console.log('   - subscription_cancel:    ', result.features.subscription_cancel.enabled,
                '(' + (result.features.subscription_cancel.mode || '—') + ')');
  console.log('   - subscription_update:    ', result.features.subscription_update.enabled);
  console.log('');
  console.log('▸ Test it:');
  console.log('  1. Sign in to Castford as an org with a Stripe customer');
  console.log('  2. Go to /site/dashboard/billing.html');
  console.log('  3. Click "Manage Payment" → portal opens');
}

main().catch(err => {
  console.error('');
  console.error('❌ Portal setup failed:');
  console.error('   ', err?.message || err);
  if (err?.raw) console.error('   ', JSON.stringify(err.raw, null, 2));
  process.exit(1);
});
