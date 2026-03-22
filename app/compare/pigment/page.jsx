export const metadata = {
  title: "FinanceOS vs Pigment — FP&A Platform Comparison 2026",
  description: "Compare FinanceOS and Pigment for financial planning. FinanceOS starts at $499/mo with AI copilot and 48-hour setup. Pigment starts at $65K+/year with longer implementation cycles.",
  keywords: ["FinanceOS vs Pigment", "Pigment alternative", "FP&A software comparison", "Pigment pricing", "best FP&A platform 2026"],
  openGraph: { title: "FinanceOS vs Pigment — FP&A Comparison 2026", url: "https://finance-os.app/compare/pigment" },
  alternates: { canonical: "https://finance-os.app/compare/pigment" },
};

export default function ComparePigment() {
  const rows = [
    { feature: "Starting Price", fos: "$499/month", competitor: "$65K+/year", winner: "fos" },
    { feature: "Implementation Time", fos: "Under 48 hours", competitor: "4–12 weeks", winner: "fos" },
    { feature: "AI Copilot", fos: "Built-in (Claude AI)", competitor: "Limited AI features", winner: "fos" },
    { feature: "Scenario Modeling", fos: "4+ scenarios, sensitivity sliders", competitor: "Advanced, visual modeling", winner: "tie" },
    { feature: "Multi-Entity Consolidation", fos: "Automatic IC elimination + FX", competitor: "Yes, strong", winner: "tie" },
    { feature: "Collaboration", fos: "Role-based access, 5 roles", competitor: "Strong real-time collaboration", winner: "competitor" },
    { feature: "Revenue Forecasting", fos: "ML ensemble (ETS + XGBoost)", competitor: "Formula + driver-based", winner: "fos" },
    { feature: "Published Pricing", fos: "Yes — transparent tiers", competitor: "No — custom quotes", winner: "fos" },
    { feature: "Headcount Planning", fos: "Roadmap (HRIS connectors)", competitor: "Yes, strong module", winner: "competitor" },
    { feature: "Native Integrations", fos: "QuickBooks, Stripe, Salesforce, Snowflake", competitor: "50+ native connectors", winner: "competitor" },
    { feature: "Money-Back Guarantee", fos: "30 days, full refund", competitor: "Annual contract", winner: "fos" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#0a0e1a", color: "#c8cdd8", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
        <nav style={{ fontSize: 12, color: "#5a6178", marginBottom: 32 }}>
          <a href="/" style={{ color: "#60a5fa", textDecoration: "none" }}>FinanceOS</a>
          <span style={{ margin: "0 8px" }}>/</span><span>Compare</span>
          <span style={{ margin: "0 8px" }}>/</span><span style={{ color: "#c8cdd8" }}>Pigment</span>
        </nav>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f0f2f7", lineHeight: 1.2, marginBottom: 16 }}>FinanceOS vs Pigment: FP&A Platform Comparison</h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#9ea5b8", marginBottom: 40, maxWidth: 700 }}>
          FinanceOS is an AI-native FP&A platform starting at $499/month that deploys in under 48 hours. Pigment is a business planning platform starting at $65K+/year with typical 4–12 week implementations. Both offer strong scenario modeling and consolidation, but FinanceOS adds AI-powered natural language querying and ML-based forecasting at a fraction of the price.
        </p>

        <div style={{ borderRadius: 12, border: "1px solid #1e2230", overflow: "hidden", marginBottom: 48 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#111827" }}>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#5a6178", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "2px solid #1e2230" }}>Feature</th>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "2px solid #1e2230" }}>FinanceOS</th>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#5a6178", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "2px solid #1e2230" }}>Pigment</th>
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

        <div style={{ textAlign: "center", padding: "48px 0", borderTop: "1px solid #1e2230" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#f0f2f7", marginBottom: 12 }}>See why teams are switching from Pigment to FinanceOS</h2>
          <p style={{ fontSize: 14, color: "#5a6178", marginBottom: 24 }}>Try the full platform free. No credit card, no sales call required.</p>
          <a href="/?ref=compare-pigment" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 10, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Try FinanceOS Free</a>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Is FinanceOS cheaper than Pigment?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. FinanceOS starts at $499 per month billed annually. Pigment typically starts at $65,000 or more per year, making FinanceOS roughly 90% less expensive for comparable FP&A functionality." }},
            { "@type": "Question", "name": "Can FinanceOS do everything Pigment does?", "acceptedAnswer": { "@type": "Answer", "text": "FinanceOS covers the core FP&A workflow: P&L analysis, scenario modeling, multi-entity consolidation, revenue forecasting, and month-end close. Pigment has stronger headcount planning and real-time collaboration features. FinanceOS has a stronger AI copilot and ML-based forecasting." }},
          ]
        }) }} />
      </div>
    </div>
  );
}
