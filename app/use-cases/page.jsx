"use client";
import Link from "next/link";

export default function UseCasesIndex() {
  const BG = "#06080c", S = "#10131a", B = "#1a1f2e", T = "#eef0f6", TD = "#636d84", TF = "#3d4558";
  const AC = "#5b9cf5", PU = "#a181f7", GN = "#3dd9a0", AM = "#f5b731";

  const cases = [
    { title: "For Finance Teams", desc: "AI-native FP&A with variance detection, scenario modeling, and natural language querying. Replace 6 tools with one platform.", href: "/use-cases/finance", color: AC, badge: "Flagship" },
    { title: "Budget Planning & Forecasting", desc: "Driver-based budgeting with rolling forecasts, what-if scenarios, and ML-powered accuracy tracking.", href: "/use-cases/budget-planning", color: GN, badge: null },
    { title: "Financial Consolidation", desc: "Multi-entity consolidation with automatic intercompany elimination, real-time FX rates, and one-click period close.", href: "/use-cases/consolidation", color: PU, badge: null },
    { title: "Revenue Forecasting", desc: "ML ensemble models with 96.8% accuracy, SHAP feature importance, live sensitivity sliders, and bear/base/bull scenarios.", href: "/use-cases/forecasting", color: AM, badge: "ML" },
    { title: "SaaS FP&A Guide", desc: "The complete guide to financial planning and analysis for SaaS companies — metrics, benchmarks, and best practices.", href: "/use-cases/saas-fpa", color: AC, badge: "Guide" },
    { title: "Month-End Close", desc: "Checklist-driven close workflow with task assignment, owner tracking, category grouping, and burndown analytics.", href: "/", color: GN, badge: null },
    { title: "Investor Metrics & Reporting", desc: "Board-ready SaaS metrics, cohort analysis, fundraising readiness scorecards, and one-click PDF export.", href: "/", color: PU, badge: null },
    { title: "P&L, Cash Flow & Balance Sheet", desc: "Automated three-statement model with real-time variance detection, budget-to-actual comparison, and drill-down detail.", href: "/", color: AM, badge: null },
  ];

  return (
    <div style={{ background: BG, color: T, fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .uc-card { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .uc-card:hover { transform: translateY(-4px); border-color: rgba(91,156,245,0.3) !important; box-shadow: 0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(91,156,245,0.1) !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 48px", maxWidth: 1200, margin: "0 auto", borderBottom: `1px solid ${B}50` }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${AC}, ${PU})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff" }}>F</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: T, letterSpacing: "-0.03em" }}>FinanceOS</span>
        </Link>
        <Link href="/" style={{ fontSize: 13, padding: "9px 20px", borderRadius: 10, background: `linear-gradient(135deg, ${AC}, ${PU})`, color: "#fff", textDecoration: "none", fontWeight: 700 }}>Try the Demo →</Link>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 48px 60px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: PU, marginBottom: 16 }}>Use Cases</div>
        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 20 }}>Every workflow your finance team needs</h1>
        <p style={{ fontSize: 16, color: TD, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>From budget planning to investor reporting — explore how FinanceOS replaces your entire FP&A stack with one AI-native platform.</p>
      </section>

      {/* Grid */}
      <section style={{ padding: "20px 48px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {cases.map((uc, i) => (
            <Link key={uc.title} href={uc.href} className="uc-card" style={{
              padding: "32px 28px", borderRadius: 18, background: `${S}90`, border: `1px solid ${B}`,
              textDecoration: "none", display: "block", position: "relative", overflow: "hidden",
              animation: `fadeUp 0.5s ease ${i * 0.06}s both`,
            }}>
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${uc.color}20, transparent)` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${uc.color}10`, border: `1px solid ${uc.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: uc.color }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: T, letterSpacing: "-0.02em" }}>{uc.title}</h3>
                {uc.badge && <span style={{ fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: `${uc.color}12`, color: uc.color, letterSpacing: "0.06em" }}>{uc.badge}</span>}
              </div>
              <p style={{ fontSize: 14, color: TD, lineHeight: 1.7, marginBottom: 16 }}>{uc.desc}</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: uc.color }}>Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px 48px", borderTop: `1px solid ${B}`, maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: TF }}>
        <span>© 2026 Financial Holding LLC</span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/privacy" style={{ color: TF, textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms" style={{ color: TF, textDecoration: "none" }}>Terms</Link>
          <Link href="/" style={{ color: TF, textDecoration: "none" }}>Platform</Link>
        </div>
      </footer>
    </div>
  );
}
