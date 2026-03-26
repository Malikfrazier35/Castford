import { NextResponse } from "next/server";

// ─── Stripe Product → Plan Mapping ───────────────────────────────────
const PRODUCT_PLAN_MAP = {
  prod_U8tgVF7YBpllg3: "starter",
  prod_U8thZLVQ5TrvmI: "growth",
  prod_U8thcOFxz4Niy1: "business",
};

// ─── Feature Matrix ──────────────────────────────────────────────────
// This is the single source of truth for what each plan unlocks.
export const PLAN_FEATURES = {
  free: {
    label: "Free Trial",
    features: ["dashboard_overview"],
    maxSeats: 1,
    maxConnectors: 0,
    support: "community",
  },
  starter: {
    label: "Starter",
    price: { monthly: 499, annual: 399 },
    features: [
      "dashboard_overview",
      "pnl",
      "basic_kpis",
      "integrations",
      "email_support",
    ],
    maxSeats: 5,
    maxConnectors: 5,
    support: "email",
  },
  growth: {
    label: "Growth",
    price: { monthly: 999, annual: 799 },
    features: [
      "dashboard_overview",
      "pnl",
      "basic_kpis",
      "integrations",
      "email_support",
      "forecast",
      "scenarios",
      "ai_copilot",
      "multi_entity",
      "slack_integration",
    ],
    maxSeats: 25,
    maxConnectors: 25,
    support: "priority",
  },
  business: {
    label: "Business",
    price: { monthly: 2499, annual: 1999 },
    features: [
      "dashboard_overview",
      "pnl",
      "basic_kpis",
      "integrations",
      "email_support",
      "forecast",
      "scenarios",
      "ai_copilot",
      "multi_entity",
      "slack_integration",
      "command_center",
      "close_tasks",
      "investor_metrics",
      "sox_audit",
      "sso",
      "custom_ml",
      "team_management",
    ],
    maxSeats: -1, // unlimited
    maxConnectors: -1,
    support: "dedicated_csm",
  },
};

// ─── Sidebar → Feature Key mapping ───────────────────────────────────
// Maps sidebar nav items to feature keys for gating
export const NAV_FEATURE_MAP = {
  Dashboard: "dashboard_overview",
  "AI Copilot": "ai_copilot",
  "P&L": "pnl",
  Forecast: "forecast",
  Scenarios: "scenarios",
  "Close Tasks": "close_tasks",
  Team: "team_management",
  Integrations: "integrations",
  "Command Center": "command_center",
};

// ─── Helper: check if a plan includes a feature ─────────────────────
export function planHasFeature(planKey, featureKey) {
  const plan = PLAN_FEATURES[planKey];
  if (!plan) return false;
  return plan.features.includes(featureKey);
}

// ─── Helper: get minimum plan required for a feature ─────────────────
export function minimumPlanFor(featureKey) {
  const tiers = ["starter", "growth", "business"];
  for (const tier of tiers) {
    if (PLAN_FEATURES[tier].features.includes(featureKey)) return tier;
  }
  return "business"; // default to highest if unknown
}

// ─── API Route: GET /api/plan?email=user@example.com ─────────────────
// This is the CHECKPOINT — called on EVERY dashboard load (including
// returning users). No caching, no bypass. Always fresh from Stripe.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          plan: "free",
          ...PLAN_FEATURES.free,
          _checkpoint: true,
          _reason: "no_email_provided",
        },
        { status: 200 }
      );
    }

    // ── Step 1: Look up customer in Stripe by email ────────────────
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      console.error("[/api/plan] STRIPE_SECRET_KEY not set");
      return NextResponse.json(
        {
          plan: "free",
          ...PLAN_FEATURES.free,
          _checkpoint: true,
          _reason: "stripe_not_configured",
        },
        { status: 200 }
      );
    }

    // Search Stripe customers by email
    const custRes = await fetch(
      `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`,
      {
        headers: { Authorization: `Bearer ${stripeKey}` },
      }
    );
    const custData = await custRes.json();

    if (!custData.data || custData.data.length === 0) {
      return NextResponse.json({
        plan: "free",
        ...PLAN_FEATURES.free,
        _checkpoint: true,
        _reason: "no_stripe_customer",
        email,
      });
    }

    const customerId = custData.data[0].id;

    // ── Step 2: Get active subscriptions ───────────────────────────
    const subRes = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${customerId}&status=active&limit=10`,
      {
        headers: { Authorization: `Bearer ${stripeKey}` },
      }
    );
    const subData = await subRes.json();

    if (!subData.data || subData.data.length === 0) {
      // Check for trialing subscriptions too
      const trialRes = await fetch(
        `https://api.stripe.com/v1/subscriptions?customer=${customerId}&status=trialing&limit=10`,
        {
          headers: { Authorization: `Bearer ${stripeKey}` },
        }
      );
      const trialData = await trialRes.json();

      if (!trialData.data || trialData.data.length === 0) {
        return NextResponse.json({
          plan: "free",
          ...PLAN_FEATURES.free,
          _checkpoint: true,
          _reason: "no_active_subscription",
          customerId,
          email,
        });
      }

      // Use trialing subscription
      subData.data = trialData.data;
    }

    // ── Step 3: Find the highest-tier active plan ──────────────────
    // If user has multiple subs, grant them the highest tier
    const tierRank = { starter: 1, growth: 2, business: 3 };
    let bestPlan = "free";
    let bestSub = null;

    for (const sub of subData.data) {
      for (const item of sub.items.data) {
        const productId = item.price.product;
        const planKey = PRODUCT_PLAN_MAP[productId];
        if (planKey && (tierRank[planKey] || 0) > (tierRank[bestPlan] || 0)) {
          bestPlan = planKey;
          bestSub = sub;
        }
      }
    }

    if (bestPlan === "free") {
      return NextResponse.json({
        plan: "free",
        ...PLAN_FEATURES.free,
        _checkpoint: true,
        _reason: "no_matching_product",
        customerId,
        email,
      });
    }

    // ── Step 4: Return plan details ────────────────────────────────
    const planDetails = PLAN_FEATURES[bestPlan];
    return NextResponse.json({
      plan: bestPlan,
      ...planDetails,
      _checkpoint: true,
      _verified: true,
      subscription: {
        id: bestSub.id,
        status: bestSub.status,
        currentPeriodEnd: bestSub.current_period_end,
        cancelAtPeriodEnd: bestSub.cancel_at_period_end,
      },
      customerId,
      email,
    });
  } catch (err) {
    console.error("[/api/plan] Error:", err);
    // On error, default to free — never grant access on failure
    return NextResponse.json(
      {
        plan: "free",
        ...PLAN_FEATURES.free,
        _checkpoint: true,
        _reason: "error",
        _error: err.message,
      },
      { status: 200 }
    );
  }
}
