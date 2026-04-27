#!/usr/bin/env node
/**
 * Castford Phase 3 part 1 — Stripe catalog setup
 *
 * Creates (or upserts via lookup_key) the 4 L3 pro pack products + 8 prices.
 * Idempotent — safe to re-run. Will not create duplicates.
 *
 * Usage:
 *   1. cd ~/Desktop/Castford
 *   2. npm install --no-save stripe   (one-time)
 *   3. STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe-catalog.js
 *      (or sk_test_... for test mode)
 *
 * Output:
 *   - logs each create/update with resulting IDs
 *   - writes public/site/stripe-catalog.js with product + price IDs
 *   - exits 0 on success, 1 on any error
 */

const fs = require('fs');
const path = require('path');

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not set. Export it first:');
  console.error('   export STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)');
  process.exit(1);
}

let stripe;
try {
  stripe = require('stripe')(STRIPE_KEY);
} catch (e) {
  console.error('❌ stripe SDK not installed. Run: npm install --no-save stripe');
  process.exit(1);
}

const isTestMode = STRIPE_KEY.startsWith('sk_test_');
console.log('═══════════════════════════════════════════════════════════');
console.log('  Castford Phase 3 part 1 — Stripe catalog setup');
console.log('  Mode: ' + (isTestMode ? 'TEST' : 'LIVE'));
console.log('═══════════════════════════════════════════════════════════\n');

const PACKS = [
  {
    slug: 'cfo',
    productLookupKey: 'castford-pack-cfo',
    name: 'Castford CFO Pack',
    description: 'Executive close-of-books surface, board-ready KPIs, board pack export, scenarios summary view. Per-org license.',
    statementDescriptor: 'CASTFORD CFO',
    monthlyAmount: 99900,
    annualAmount: 999000
  },
  {
    slug: 'controller',
    productLookupKey: 'castford-pack-controller',
    name: 'Castford Controller Pack',
    description: 'Close workflow, accruals automation, journal entries, audit log, reconciliations. Per-org license.',
    statementDescriptor: 'CASTFORD CTRL',
    monthlyAmount: 99900,
    annualAmount: 999000
  },
  {
    slug: 'fp_a',
    productLookupKey: 'castford-pack-fp-a',
    name: 'Castford FP&A Pack',
    description: 'Driver-based forecasting, multi-scenario, sensitivity analysis, unit economics, formula engine. Per-org license.',
    statementDescriptor: 'CASTFORD FPA',
    monthlyAmount: 99900,
    annualAmount: 999000
  },
  {
    slug: 'ceo',
    productLookupKey: 'castford-pack-ceo',
    name: 'Castford CEO Pack',
    description: 'Investor metrics, runway model, hiring plan, board narrative, KPI tile customizer. Per-org license.',
    statementDescriptor: 'CASTFORD CEO',
    monthlyAmount: 99900,
    annualAmount: 999000
  }
];

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

async function findProductByMetadata(slug) {
  // Stripe doesn't allow searching products by lookup_key directly, but they support
  // the search API which queries metadata. Using metadata.castford_pack_slug as our
  // upsert key.
  const result = await stripe.products.search({
    query: `metadata['castford_pack_slug']:'${slug}'`
  });
  return result.data && result.data.length > 0 ? result.data[0] : null;
}

async function findPriceByLookupKey(lookupKey) {
  const result = await stripe.prices.list({
    lookup_keys: [lookupKey],
    expand: ['data.product']
  });
  return result.data && result.data.length > 0 ? result.data[0] : null;
}

async function upsertProduct(pack) {
  const existing = await findProductByMetadata(pack.slug);
  if (existing) {
    // Update name/description in case the spec evolved
    const updated = await stripe.products.update(existing.id, {
      name: pack.name,
      description: pack.description,
      statement_descriptor: pack.statementDescriptor,
      tax_code: 'txcd_10103001', // SaaS — Software as a Service
      metadata: {
        castford_pack_slug: pack.slug,
        castford_layer: 'l3_pro_pack',
        castford_licensing: 'per_org'
      }
    });
    console.log('  ↻ updated ' + pack.slug + ' product: ' + updated.id);
    return updated;
  }
  const created = await stripe.products.create({
    name: pack.name,
    description: pack.description,
    statement_descriptor: pack.statementDescriptor,
    tax_code: 'txcd_10103001',
    metadata: {
      castford_pack_slug: pack.slug,
      castford_layer: 'l3_pro_pack',
      castford_licensing: 'per_org'
    }
  });
  console.log('  ✓ created ' + pack.slug + ' product: ' + created.id);
  return created;
}

async function upsertPrice(productId, pack, interval) {
  const lookupKey = pack.productLookupKey + '-' + (interval === 'year' ? 'annual' : 'monthly');
  const amount = interval === 'year' ? pack.annualAmount : pack.monthlyAmount;

  const existing = await findPriceByLookupKey(lookupKey);
  if (existing) {
    // Verify it points to the right product and amount
    if (existing.product === productId && existing.unit_amount === amount && existing.recurring && existing.recurring.interval === interval) {
      console.log('  • exists ' + lookupKey + ': ' + existing.id);
      return existing;
    }
    // Mismatch — deactivate the old one and create a fresh one. Stripe doesn't allow
    // mutating a price's amount or recurring interval after creation.
    await stripe.prices.update(existing.id, { active: false, lookup_key: null });
    console.log('  ⚠ deactivated mismatched ' + lookupKey + ' (' + existing.id + ')');
  }

  const created = await stripe.prices.create({
    product: productId,
    unit_amount: amount,
    currency: 'usd',
    recurring: { interval: interval },
    lookup_key: lookupKey,
    tax_behavior: 'exclusive',
    metadata: {
      castford_pack_slug: pack.slug,
      castford_billing_interval: interval === 'year' ? 'annual' : 'monthly'
    }
  });
  console.log('  ✓ created ' + lookupKey + ': ' + created.id);
  return created;
}

// ──────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────

(async function main() {
  const catalog = {};
  let errors = 0;

  for (const pack of PACKS) {
    console.log('▸ ' + pack.name + ' (slug: ' + pack.slug + ')');
    try {
      const product = await upsertProduct(pack);
      const monthly = await upsertPrice(product.id, pack, 'month');
      const annual = await upsertPrice(product.id, pack, 'year');
      catalog[pack.slug] = {
        product: product.id,
        monthly: monthly.id,
        annual: annual.id,
        lookup_keys: {
          monthly: pack.productLookupKey + '-monthly',
          annual: pack.productLookupKey + '-annual'
        },
        amounts_cents: {
          monthly: pack.monthlyAmount,
          annual: pack.annualAmount
        }
      };
    } catch (e) {
      console.error('  ✗ FAILED for ' + pack.slug + ': ' + e.message);
      errors++;
    }
    console.log('');
  }

  // Write catalog file for the dashboard to read
  const catalogPath = path.join(__dirname, '..', 'public', 'site', 'stripe-catalog.js');
  const fileContent =
    '// Auto-generated by scripts/setup-stripe-catalog.js — DO NOT EDIT BY HAND\n' +
    '// Last generated: ' + new Date().toISOString() + '\n' +
    '// Mode: ' + (isTestMode ? 'TEST' : 'LIVE') + '\n' +
    'window.STRIPE_CATALOG = ' + JSON.stringify(catalog, null, 2) + ';\n';
  fs.writeFileSync(catalogPath, fileContent, 'utf8');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Catalog written to: public/site/stripe-catalog.js');
  console.log('  Products created/updated: ' + Object.keys(catalog).length + ' / ' + PACKS.length);
  console.log('  Prices: ' + Object.keys(catalog).length * 2 + ' total');
  console.log('  Errors: ' + errors);
  console.log('═══════════════════════════════════════════════════════════');

  if (errors > 0) process.exit(1);
  process.exit(0);
})().catch(function(e){
  console.error('FATAL: ' + e.stack);
  process.exit(1);
});
