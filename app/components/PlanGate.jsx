"use client";
// ─── PlanGate Components ─────────────────────────────────────────────
// Drop-in components for plan-gated features.
// Includes: usePlanCheckpoint hook, FeatureGate wrapper, UpgradePrompt.

import { useState, useEffect, createContext, useContext } from "react";

// ─── Plan Context ────────────────────────────────────────────────────
const PlanContext = createContext({
  plan: "free",
  features: ["dashboard_overview"],
  loading: true,
  subscription: null,
});

export function usePlan() {
  return useContext(PlanContext);
}

// ─── Feature matrix (inline for zero-import usage) ───────────────────
const FEATURES_BY_PLAN = {
  free: ["dashboard_overview"],
  starter: [
    "dashboard_overview",
    "pnl",
    "basic_kpis",
    "integrations",
    "email_support",
  ],
  growth: [
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
  business: [
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
};

const PLAN_LABELS = {
  free: "Free Trial",
  starter: "Starter",
  growth: "Growth",
  business: "Business",
};

const PLAN_PRICES = {
  starter: "$499/mo",
  growth: "$999/mo",
  business: "$2,499/mo",
};

const TIER_ORDER = ["free", "starter", "growth", "business"];

function requiredPlanFor(featureKey) {
  for (const tier of TIER_ORDER) {
    if (FEATURES_BY_PLAN[tier]?.includes(featureKey)) return tier;
  }
  return "business";
}

// ─── PlanProvider ────────────────────────────────────────────────────
// Wraps the entire dashboard. Runs checkpoint on EVERY mount.
// No caching. Returning users hit Stripe every time.
export function PlanProvider({ email, children }) {
  const [planData, setPlanData] = useState({
    plan: "free",
    features: ["dashboard_overview"],
    loading: true,
    subscription: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function runCheckpoint() {
      if (!email) {
        setPlanData({
          plan: "free",
          features: ["dashboard_overview"],
          loading: false,
          subscription: null,
        });
        return;
      }

      try {
        const res = await fetch(
          `/api/plan?email=${encodeURIComponent(email)}`,
          {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          }
        );
        const data = await res.json();
        if (!cancelled) {
          setPlanData({
            plan: data.plan || "free",
            features: FEATURES_BY_PLAN[data.plan] || ["dashboard_overview"],
            loading: false,
            subscription: data.subscription || null,
            label: PLAN_LABELS[data.plan] || "Free Trial",
          });
        }
      } catch {
        if (!cancelled) {
          setPlanData({
            plan: "free",
            features: ["dashboard_overview"],
            loading: false,
            subscription: null,
          });
        }
      }
    }

    runCheckpoint();
    return () => {
      cancelled = true;
    };
  }, [email]);

  return (
    <PlanContext.Provider value={planData}>{children}</PlanContext.Provider>
  );
}

// ─── FeatureGate ─────────────────────────────────────────────────────
// Wraps any section. Shows content if user has access, upgrade prompt if not.
export function FeatureGate({ feature, children, theme }) {
  const { plan, features, loading } = usePlan();

  if (loading) {
    return <PlanLoadingSkeleton theme={theme} />;
  }

  if (features.includes(feature)) {
    return children;
  }

  return <UpgradePrompt feature={feature} currentPlan={plan} theme={theme} />;
}

// ─── UpgradePrompt ───────────────────────────────────────────────────
// Shown when a user tries to access a feature above their plan tier.
export function UpgradePrompt({ feature, currentPlan, theme }) {
  const needed = requiredPlanFor(feature);
  const neededLabel = PLAN_LABELS[needed] || needed;
  const neededPrice = PLAN_PRICES[needed] || "";
  const isDark = theme?.mode !== "light";

  const featureLabels = {
    ai_copilot: "AI Copilot",
    forecast: "Forecast Engine",
    scenarios: "Scenario Modeling",
    close_tasks: "Close Task Manager",
    command_center: "Command Center",
    team_management: "Team Management",
    investor_metrics: "Investor Metrics",
    sox_audit: "SOX Audit Trails",
    sso: "Single Sign-On",
    custom_ml: "Custom ML Models",
    multi_entity: "Multi-Entity Consolidation",
    slack_integration: "Slack Integration",
  };

  const featureLabel = featureLabels[feature] || feature;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 400,
        padding: "48px 24px",
        textAlign: "center",
        background: isDark
          ? "linear-gradient(135deg, rgba(91,156,245,0.04) 0%, rgba(167,139,250,0.04) 100%)"
          : "linear-gradient(135deg, rgba(91,156,245,0.06) 0%, rgba(167,139,250,0.06) 100%)",
        borderRadius: 20,
        border: isDark
          ? "1px solid rgba(91,156,245,0.15)"
          : "1px solid rgba(91,156,245,0.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated glow background */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(91,156,245,0.08) 0%, transparent 70%)",
          animation: "upgradeGlow 3s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Lock icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: isDark
            ? "linear-gradient(135deg, rgba(91,156,245,0.15), rgba(167,139,250,0.15))"
            : "linear-gradient(135deg, rgba(91,156,245,0.1), rgba(167,139,250,0.1))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          fontSize: 28,
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isDark ? "#5b9cf5" : "#4a8de8"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: isDark ? "#ffffff" : "#1a1a2e",
          margin: "0 0 8px 0",
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        Unlock {featureLabel}
      </h3>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 15,
          color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
          margin: "0 0 24px 0",
          maxWidth: 420,
          lineHeight: 1.6,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {featureLabel} is available on the{" "}
        <strong style={{ color: isDark ? "#5b9cf5" : "#4a8de8" }}>
          {neededLabel}
        </strong>{" "}
        plan{neededPrice ? ` (${neededPrice})` : ""}. Upgrade to access this
        feature and supercharge your finance operations.
      </p>

      {/* CTA Button */}
      <button
        onClick={() => {
          // Navigate to pricing section or Stripe checkout
          window.location.hash = "";
          setTimeout(() => {
            const pricingEl = document.getElementById("pricing");
            if (pricingEl) {
              pricingEl.scrollIntoView({ behavior: "smooth" });
            } else {
              window.location.href = "/#pricing";
            }
          }, 50);
        }}
        style={{
          padding: "14px 32px",
          borderRadius: 12,
          border: "none",
          background: "linear-gradient(135deg, #5b9cf5 0%, #a78bfa 100%)",
          color: "#fff",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Manrope', sans-serif",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 20px rgba(91,156,245,0.3)",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 8px 30px rgba(91,156,245,0.4)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 20px rgba(91,156,245,0.3)";
        }}
      >
        Upgrade to {neededLabel}
      </button>

      {/* Current plan badge */}
      <p
        style={{
          fontSize: 12,
          color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
          marginTop: 16,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        You're currently on the {PLAN_LABELS[currentPlan] || "Free"} plan
      </p>

      {/* Keyframe animation */}
      <style>{`
        @keyframes upgradeGlow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </div>
  );
}

// ─── Loading skeleton while plan checkpoint runs ─────────────────────
function PlanLoadingSkeleton({ theme }) {
  const isDark = theme?.mode !== "light";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        padding: 40,
        borderRadius: 20,
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `3px solid ${isDark ? "rgba(91,156,245,0.2)" : "rgba(91,156,245,0.15)"}`,
          borderTopColor: "#5b9cf5",
          animation: "planSpin 0.8s linear infinite",
        }}
      />
      <p
        style={{
          marginTop: 16,
          fontSize: 14,
          color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        Verifying your plan...
      </p>
      <style>{`
        @keyframes planSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Sidebar lock badge (small icon for nav items) ───────────────────
export function SidebarLockBadge({ feature, plan, theme }) {
  const hasAccess =
    FEATURES_BY_PLAN[plan]?.includes(feature) ?? false;
  if (hasAccess) return null;

  const isDark = theme?.mode !== "light";
  const needed = requiredPlanFor(feature);

  return (
    <span
      title={`Requires ${PLAN_LABELS[needed]} plan`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginLeft: 8,
        padding: "2px 6px",
        borderRadius: 6,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: isDark
          ? "rgba(91,156,245,0.12)"
          : "rgba(91,156,245,0.08)",
        color: "#5b9cf5",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        style={{ marginRight: 3 }}
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
      {PLAN_LABELS[needed]}
    </span>
  );
}

// ─── Plan badge for header/sidebar ───────────────────────────────────
export function PlanBadge({ theme }) {
  const { plan, label, loading } = usePlan();
  const isDark = theme?.mode !== "light";

  if (loading) return null;

  const colors = {
    free: { bg: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.5)" },
    starter: { bg: "rgba(52,211,153,0.12)", text: "#34d399" },
    growth: { bg: "rgba(91,156,245,0.12)", text: "#5b9cf5" },
    business: { bg: "rgba(167,139,250,0.12)", text: "#a78bfa" },
  };

  const c = colors[plan] || colors.free;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: isDark ? c.bg : c.bg,
        color: c.text,
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {label || "Free Trial"}
    </span>
  );
}
