# Castford scripts

## setup-stripe-catalog.js

Creates (or upserts via `lookup_key`) the 4 L3 pro pack products + 8 prices in
Stripe. Idempotent — safe to re-run.

### Prereqs

- Node.js installed
- Stripe SDK: `npm install --no-save stripe` (one-time)
- Your Stripe secret key in env

### Run

```bash
# Test mode first
export STRIPE_SECRET_KEY=sk_test_...
node scripts/setup-stripe-catalog.js

# Then live
export STRIPE_SECRET_KEY=sk_live_...
node scripts/setup-stripe-catalog.js
```

### What it creates

| Product | Slug | Monthly | Annual |
|---|---|---|---|
| Castford CFO Pack | `cfo` | $999/mo | $9,990/yr |
| Castford Controller Pack | `controller` | $999/mo | $9,990/yr |
| Castford FP&A Pack | `fp_a` | $999/mo | $9,990/yr |
| Castford CEO Pack | `ceo` | $999/mo | $9,990/yr |

Each product is tagged with `metadata.castford_pack_slug` for upsert idempotency.

### Output

Writes `public/site/stripe-catalog.js` with the resulting product + price IDs.
The dashboard pricing page will read `window.STRIPE_CATALOG` to launch checkout.

### Re-running

The script uses `metadata['castford_pack_slug']` to find existing products and
`lookup_key` to find existing prices. Re-running:

- **Products:** updates name/description/statement_descriptor in place
- **Prices:** if amount or interval matches → reuses; if mismatch → deactivates
  the old price and creates a fresh one (Stripe prices are immutable)

### Rolling back

To remove the catalog: in Stripe Dashboard → Products, archive each `castford-pack-*`
product. The script never deletes anything — only upserts and deactivates mismatched
prices. Archived products stop showing up in checkout but remain in subscription history.
