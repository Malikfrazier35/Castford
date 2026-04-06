// ─── Plan Gate Utility ────────────────────────────────────────────────
// Client-side utilities for checking plan access.
// This runs the checkpoint on EVERY dashboard load — no cache, no skip.

// Feature matrix (mirrors server-side, used for instant UI decisions)
export const PLAN_FEATURES = {
  free: {
    label: "Free Trial",
    features: ["dashboard_overview"],
    maxSeats: 1,
    maxConnectors: 0,
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
    maxSeats: -1,
    maxConnectors: -1,
  },
};

// Maps sidebar nav labels → feature keys
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

// Tier ranking for upgrade prompts
const TIER_ORDER = ["free", "starter", "growth", "business"];

/**
 * Check if a plan tier has access to a feature.
 */
export function canAccess(planKey, featureKey) {
  const plan = PLAN_FEATURES[planKey];
  if (!plan) return false;
  return plan.features.includes(featureKey);
}

/**
 * Get the minimum plan required for a feature.
 */
export function requiredPlanFor(featureKey) {
  for (const tier of TIER_ORDER) {
    if (PLAN_FEATURES[tier]?.features?.includes(featureKey)) return tier;
  }
  return "business";
}

/**
 * Get the upgrade tier (next tier above current).
 */
export function nextTierUp(currentPlan) {
  const idx = TIER_ORDER.indexOf(currentPlan);
  if (idx === -1 || idx >= TIER_ORDER.length - 1) return null;
  return TIER_ORDER[idx + 1];
}

/**
 * Get all features that are locked for a given plan.
 */
export function getLockedFeatures(planKey) {
  const plan = PLAN_FEATURES[planKey];
  if (!plan) return [];
  const allFeatures = PLAN_FEATURES.business.features;
  return allFeatures.filter((f) => !plan.features.includes(f));
}

/**
 * Fetch plan from /api/plan — ALWAYS hits Stripe, no cache.
 * This is the checkpoint. Called on every dashboard mount.
 */
export async function fetchPlanCheckpoint(email) {
  if (!email) return { plan: "free", ...PLAN_FEATURES.free };
  try {
    const res = await fetch(`/api/plan?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) return { plan: "free", ...PLAN_FEATURES.free };
    return await res.json();
  } catch {
    return { plan: "free", ...PLAN_FEATURES.free };
  }
}

/**
 * Stripe checkout URLs for each plan (Stripe Payment Links or checkout sessions).
 * Update these with your actual Stripe payment links.
 */
export const UPGRADE_URLS = {
  starter: {
    monthly: "https://castford.com/api/checkout?plan=starter&interval=month",
    annual: "https://castford.com/api/checkout?plan=starter&interval=year",
  },
  growth: {
    monthly: "https://castford.com/api/checkout?plan=growth&interval=month",
    annual: "https://castford.com/api/checkout?plan=growth&interval=year",
  },
  business: {
    monthly: "https://castford.com/api/checkout?plan=business&interval=month",
    annual: "https://castford.com/api/checkout?plan=business&interval=year",
  },
};
