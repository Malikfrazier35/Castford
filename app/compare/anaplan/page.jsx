export const metadata = {
  title: "FinanceOS vs Anaplan — FP&A Platform Comparison 2026",
  description: "Compare FinanceOS and Anaplan for financial planning and analysis. See pricing, features, implementation time, and AI capabilities side-by-side. FinanceOS starts at $499/mo vs Anaplan's $200K+/year.",
  keywords: ["FinanceOS vs Anaplan", "Anaplan alternative", "FP&A software comparison", "Anaplan pricing", "best FP&A tool", "financial planning software"],
  openGraph: {
    title: "FinanceOS vs Anaplan — FP&A Platform Comparison 2026",
    description: "Side-by-side comparison of FinanceOS and Anaplan. AI copilot, pricing, implementation time, and more.",
    url: "https://finance-os.app/compare/anaplan",
  },
  alternates: { canonical: "https://finance-os.app/compare/anaplan" },
};

export default function CompareAnaplan() {
  const rows = [
    { feature: "Starting Price", fos: "$499/month", competitor: "$200K+/year", winner: "fos" },
    { feature: "Implementation Time", fos: "Under 48 hours", competitor: "3–6 months", winner: "fos" },
    { feature: "AI Copilot", fos: "Built-in (Claude)", competitor: "No native AI", winner: "fos" },
    { feature: "Scenario Modeling", fos: "4+ scenarios, live sliders", competitor: "Yes, complex setup", winner: "tie" },
    { feature: "Multi-Entity Consolidation", fos: "Yes, automatic IC elimination", competitor: "Yes, enterprise-grade", winner: "tie" },
    { feature: "Self-Serve Onboarding", fos: "Yes — connect ERP, start same day", competitor: "No — requires consultants", winner: "fos" },
    { feature: "Revenue Forecasting", fos: "ML ensemble (3.2% MAPE)", competitor: "Formula-based", winner: "fos" },
    { feature: "Variance Detection", fos: "Real-time, AI-powered", competitor: "Manual, report-based", winner: "fos" },
    { feature: "Published Pricing", fos: "Yes, transparent", competitor: "No — custom quotes only", winner: "fos" },
    { feature: "Native Integrations", fos: "QuickBooks, Stripe, Salesforce, Snowflake", competitor: "150+ via marketplace", winner: "competitor" },
    { feature: "Enterprise Scale", fos: "Up to $200M ARR customers", competitor: "Fortune 500", winner: "competitor" },
    { feature: "SOC 2 Compliance", fos: "Architecture compliant", competitor: "SOC 2 Type II certified", winner: "competitor" },
    { feature: "Money-Back Guarantee", fos: "30 days, no questions", competitor: "Annual contract", winner: "fos" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#0a0e1a", color: "#c8cdd8", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 12, color: "#5a6178", marginBottom: 32 }}>
          <a href="/" style={{ color: "#60a5fa", textDecoration: "none" }}>FinanceOS</a>
          <span style={{ margin: "0 8px" }}>/</span>
          <span>Compare</span>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#c8cdd8" }}>Anaplan</span>
        </nav>

        {/* H1 — concise answer block for AI extraction (40-60 words) */}
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f0f2f7", lineHeight: 1.2, marginBottom: 16 }}>
          FinanceOS vs Anaplan: Which FP&A Platform Is Right for You?
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#9ea5b8", marginBottom: 40, maxWidth: 700 }}>
          FinanceOS is a cloud-native FP&A platform that starts at $499/month and deploys in under 48 hours. Anaplan is an enterprise planning platform that starts at $200K+/year and typically takes 3–6 months to implement. FinanceOS includes an AI copilot for natural language financial querying; Anaplan does not offer native AI capabilities.
        </p>

        {/* Comparison Table */}
        <div style={{ borderRadius: 12, border: "1px solid #1e2230", overflow: "hidden", marginBottom: 48 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#111827" }}>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#5a6178", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "2px solid #1e2230" }}>Feature</th>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "2px solid #1e2230" }}>FinanceOS</th>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#5a6178", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "2px solid #1e2230" }}>Anaplan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.feature} style={{ borderBottom: "1px solid #1e2230", background: i % 2 === 0 ? "transparent" : "#0d1120" }}>
                  <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#c8cdd8" }}>{r.feature}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: r.winner === "fos" ? "#34d399" : "#9ea5b8", fontWeight: r.winner === "fos" ? 700 : 400 }}>{r.fos}</td>
                  <td style={{ padding: "12px 20px", fontSize: 13, color: r.winner === "competitor" ? "#34d399" : "#9ea5b8", fontWeight: r.winner === "competitor" ? 700 : 400 }}>{r.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Who should choose which */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
          <div style={{ padding: 24, borderRadius: 12, border: "1px solid #60a5fa30", background: "#60a5fa08" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#60a5fa", marginBottom: 12 }}>Choose FinanceOS if you:</h2>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: "#9ea5b8", paddingLeft: 20 }}>
              <li>Have $5M–$200M ARR</li>
              <li>Need to be live in days, not months</li>
              <li>Want AI-powered variance detection and natural language querying</li>
              <li>Need transparent, published pricing</li>
              <li>Have a finance team of 3–25 people</li>
            </ul>
          </div>
          <div style={{ padding: 24, borderRadius: 12, border: "1px solid #5a617830", background: "#5a617808" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#9ea5b8", marginBottom: 12 }}>Choose Anaplan if you:</h2>
            <ul style={{ fontSize: 14, lineHeight: 1.8, color: "#5a6178", paddingLeft: 20 }}>
              <li>Are Fortune 500 with $1B+ revenue</li>
              <li>Need 150+ integrations from day one</li>
              <li>Have a dedicated FP&A implementation team</li>
              <li>Require full SOC 2 Type II certification today</li>
              <li>Have budget for $200K+/year licensing</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "48px 0", borderTop: "1px solid #1e2230" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#f0f2f7", marginBottom: 12 }}>Ready to see FinanceOS in action?</h2>
          <p style={{ fontSize: 14, color: "#5a6178", marginBottom: 24 }}>Try the full platform free. No credit card required.</p>
          <a href="/?ref=compare-anaplan" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Try FinanceOS Free
          </a>
        </div>

        {/* Schema.org FAQ for this page */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How much does Anaplan cost compared to FinanceOS?", "acceptedAnswer": { "@type": "Answer", "text": "Anaplan typically costs $200,000 or more per year, with custom pricing based on the number of users, models, and data volume. FinanceOS starts at $499 per month (billed annually) with transparent, published pricing for all tiers." }},
            { "@type": "Question", "name": "Can FinanceOS replace Anaplan?", "acceptedAnswer": { "@type": "Answer", "text": "For SaaS companies with $5M to $200M in ARR, FinanceOS can replace Anaplan at a fraction of the cost. FinanceOS offers AI-powered variance detection, scenario modeling, multi-entity consolidation, and revenue forecasting. However, Fortune 500 companies with complex supply chain planning may still need Anaplan's broader enterprise capabilities." }},
            { "@type": "Question", "name": "How long does it take to implement FinanceOS vs Anaplan?", "acceptedAnswer": { "@type": "Answer", "text": "FinanceOS can be implemented in under 48 hours through self-serve onboarding. Anaplan typically requires 3 to 6 months of implementation with dedicated consultants and a professional services engagement." }},
          ]
        }) }} />
      </div>
    </div>
  );
}
