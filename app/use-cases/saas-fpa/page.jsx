export const metadata = {
  title: "SaaS FP&A: The Complete Guide to Financial Planning for SaaS Companies [2026]",
  description: "Everything SaaS finance teams need to know about FP&A: budget vs actual analysis, revenue forecasting, SaaS metrics (ARR, NDR, Rule of 40), scenario modeling, and month-end close automation.",
  keywords: ["SaaS FP&A", "financial planning SaaS", "FP&A for SaaS companies", "SaaS budget vs actual", "SaaS revenue forecasting", "SaaS financial metrics", "ARR analysis", "NDR calculation", "Rule of 40", "SaaS month-end close"],
  openGraph: { title: "SaaS FP&A: Complete Guide 2026", description: "Everything SaaS finance teams need for modern FP&A.", url: "https://finance-os.app/use-cases/saas-fpa" },
  alternates: { canonical: "https://finance-os.app/use-cases/saas-fpa" },
};

export default function SaaSFPAGuide() {
  const sections = [
    { id: "what-is", title: "What Is SaaS FP&A?", content: "Financial Planning & Analysis (FP&A) for SaaS companies is the process of budgeting, forecasting, and analyzing financial performance specific to recurring revenue business models. Unlike traditional FP&A, SaaS FP&A focuses on subscription metrics (ARR, MRR, NDR, churn), unit economics (LTV/CAC, payback period), and growth efficiency (Rule of 40, burn multiple).", answer: "SaaS FP&A is the practice of budgeting, forecasting, and analyzing financial performance for subscription-based software businesses, focusing on recurring revenue metrics like ARR, NDR, and churn rather than traditional revenue recognition." },
    { id: "metrics", title: "Core SaaS FP&A Metrics", content: null, metrics: [
      { name: "ARR (Annual Recurring Revenue)", desc: "The annualized value of all active subscriptions. The north star metric for SaaS valuation.", formula: "MRR × 12" },
      { name: "NDR (Net Dollar Retention)", desc: "Revenue retained from existing customers including expansion and contraction. Above 115% is best-in-class.", formula: "(Beginning ARR + Expansion - Contraction - Churn) / Beginning ARR" },
      { name: "Rule of 40", desc: "Revenue growth rate + profit margin. Above 40 indicates a healthy SaaS business.", formula: "YoY Revenue Growth % + EBITDA Margin %" },
      { name: "Burn Multiple", desc: "How much cash you burn to generate each dollar of new ARR. Below 1.0x is efficient.", formula: "Net Cash Burned / Net New ARR" },
      { name: "LTV/CAC", desc: "Lifetime value divided by customer acquisition cost. Above 3x is healthy.", formula: "(ARPA × Gross Margin × (1/Churn Rate)) / CAC" },
      { name: "Gross Margin", desc: "Revenue minus cost of goods sold. SaaS benchmark is 70–85%.", formula: "(Revenue - COGS) / Revenue" },
    ]},
    { id: "budget-vs-actual", title: "Budget vs Actual Analysis", content: "The budget vs actual (BvA) process compares planned spending and revenue against what actually happened. For SaaS companies, this means tracking variances across revenue lines (subscription, usage, services), COGS (cloud infrastructure, customer success), and operating expenses (R&D, S&M, G&A). The most effective BvA analysis explains why variances occurred, not just that they exist. Modern FP&A tools use AI to automatically detect and explain variances, eliminating hours of manual spreadsheet work." },
    { id: "forecasting", title: "Revenue Forecasting for SaaS", content: "SaaS revenue forecasting combines bottom-up models (pipeline × win rate × ACV) with top-down models (historical growth trends + market sizing). Modern approaches use ML ensemble methods — combining exponential smoothing (ETS), gradient boosting (XGBoost), and linear regression — to achieve 3–5% MAPE (Mean Absolute Percentage Error). The best forecasts incorporate leading indicators: pipeline coverage ratio, website traffic trends, product usage patterns, and expansion signals from existing customers." },
    { id: "scenarios", title: "Scenario Modeling", content: "Scenario modeling lets finance teams compare multiple possible futures side by side. A standard SaaS scenario set includes: Base case (current trajectory), Bull case (accelerated growth + hiring), Bear case (market downturn + churn increase), and Board case (conservative for external reporting). Each scenario should model the impact on revenue, margins, headcount, cash, and runway. The best tools let you adjust key drivers (growth rate, churn, pricing) with live sliders and see the downstream impact immediately." },
    { id: "close", title: "Month-End Close for SaaS", content: "The month-end close is the process of finalizing financial statements for a given month. SaaS-specific close tasks include: revenue recognition (ASC 606 compliance), deferred revenue reconciliation, commission accruals, cloud cost allocation, and ARR/MRR waterfall calculation. Best-in-class SaaS companies close in 3–5 business days. The key is automation: auto-reconciliation of bank transactions, automatic journal entries for recurring items, and close checklists with owner assignment and status tracking." },
    { id: "tools", title: "Choosing an FP&A Tool", content: "The FP&A tool market ranges from spreadsheets ($0) to enterprise platforms ($200K+/year). For SaaS companies with $5M–$200M ARR, the sweet spot is cloud-native platforms that offer native integrations (ERP, CRM, billing), AI-powered analysis, and self-serve onboarding. Key evaluation criteria: time to value (days vs months), total cost of ownership, AI capabilities, integration depth, and whether the tool is purpose-built for SaaS or adapted from legacy EPM.", comparison: [
      { tool: "Spreadsheets", cost: "$0", ttv: "Immediate", ai: "None", scale: "Breaks at $10M ARR" },
      { tool: "Adaptive (Workday)", cost: "$100K+/yr", ttv: "3–6 months", ai: "Limited", scale: "Enterprise" },
      { tool: "Anaplan", cost: "$200K+/yr", ttv: "3–6 months", ai: "None", scale: "Enterprise" },
      { tool: "Pigment", cost: "$65K+/yr", ttv: "4–12 weeks", ai: "Limited", scale: "Mid-market+" },
      { tool: "FinanceOS", cost: "$499/mo", ttv: "< 48 hours", ai: "AI Copilot (Claude)", scale: "$5M–$200M ARR" },
    ]},
  ];

  return (
    <div style={{ fontFamily: "'Manrope', system-ui, sans-serif", background: "#0a0e1a", color: "#c8cdd8", minHeight: "100vh", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 0.5px, transparent 0.5px)", backgroundSize: "32px 32px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "-20%", right: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 65%)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px" }}>
        <nav style={{ fontSize: 12, color: "#5a6178", marginBottom: 32 }}>
          <a href="/" style={{ color: "#60a5fa", textDecoration: "none" }}>FinanceOS</a>
          <span style={{ margin: "0 8px" }}>/</span><span>Use Cases</span>
          <span style={{ margin: "0 8px" }}>/</span><span style={{ color: "#c8cdd8" }}>SaaS FP&A</span>
        </nav>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f0f2f7", lineHeight: 1.2, marginBottom: 16 }}>SaaS FP&A: The Complete Guide to Financial Planning for SaaS Companies</h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#9ea5b8", marginBottom: 16, maxWidth: 700 }}>
          SaaS FP&A is the practice of budgeting, forecasting, and analyzing financial performance for subscription-based software businesses. This guide covers the core metrics, processes, and tools that modern SaaS finance teams use to drive growth and profitability.
        </p>
        <p style={{ fontSize: 12, color: "#5a6178", marginBottom: 40 }}>Updated March 2026 · 12 min read</p>

        {/* Table of contents */}
        <div style={{ padding: "20px 24px", borderRadius: 12, border: "1px solid #1e2230", background: "#111827", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#5a6178", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Contents</div>
          {sections.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} style={{ display: "block", fontSize: 14, color: "#60a5fa", textDecoration: "none", padding: "6px 0", lineHeight: 1.4 }}>
              {i + 1}. {s.title}
            </a>
          ))}
        </div>

        {/* Sections */}
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#f0f2f7", marginBottom: 16, paddingTop: 24 }}>{i + 1}. {s.title}</h2>
            
            {s.content && <p style={{ fontSize: 15, lineHeight: 1.8, color: "#9ea5b8" }}>{s.content}</p>}

            {s.metrics && (
              <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
                {s.metrics.map(m => (
                  <div key={m.name} style={{ padding: "16px 20px", borderRadius: 10, border: "1px solid #1e2230", background: "#111827" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f2f7", marginBottom: 4 }}>{m.name}</h3>
                    <p style={{ fontSize: 13, color: "#9ea5b8", marginBottom: 8 }}>{m.desc}</p>
                    <code style={{ fontSize: 12, color: "#60a5fa", background: "#60a5fa10", padding: "4px 10px", borderRadius: 6 }}>{m.formula}</code>
                  </div>
                ))}
              </div>
            )}

            {s.comparison && (
              <div style={{ borderRadius: 12, border: "1px solid #1e2230", overflow: "hidden", marginTop: 20 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#111827" }}>
                      {["Tool", "Cost", "Time to Value", "AI", "Scale"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#5a6178", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "2px solid #1e2230" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.comparison.map((r, j) => (
                      <tr key={r.tool} style={{ borderBottom: "1px solid #1e2230", background: r.tool === "FinanceOS" ? "#60a5fa08" : j % 2 === 0 ? "transparent" : "#0d1120" }}>
                        <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: r.tool === "FinanceOS" ? 700 : 500, color: r.tool === "FinanceOS" ? "#60a5fa" : "#c8cdd8" }}>{r.tool}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: "#9ea5b8" }}>{r.cost}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: "#9ea5b8" }}>{r.ttv}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: "#9ea5b8" }}>{r.ai}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: "#9ea5b8" }}>{r.scale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "48px 0", borderTop: "1px solid #1e2230" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#f0f2f7", marginBottom: 12 }}>Ready to modernize your SaaS FP&A?</h2>
          <p style={{ fontSize: 14, color: "#5a6178", marginBottom: 24 }}>FinanceOS connects to your ERP, CRM, and billing systems in under 48 hours.</p>
          <a href="/lp/demo?ref=saas-fpa-guide" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", marginRight: 12 }}>Request Demo</a>
          <a href="/?ref=saas-fpa-guide" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, border: "1px solid #60a5fa30", color: "#60a5fa", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Try Free</a>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Article",
          "headline": "SaaS FP&A: The Complete Guide to Financial Planning for SaaS Companies",
          "author": { "@type": "Organization", "name": "FinanceOS" },
          "publisher": { "@type": "Organization", "name": "Financial Holding LLC" },
          "datePublished": "2026-03-21", "dateModified": "2026-03-21",
          "description": "Complete guide to financial planning and analysis for SaaS companies covering metrics, forecasting, scenario modeling, and tool selection.",
          "mainEntityOfPage": "https://finance-os.app/use-cases/saas-fpa"
        }) }} />
      </div>
    </div>
  );
}
