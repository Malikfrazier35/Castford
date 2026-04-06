export const metadata = {
  title: "Castford vs Pigment — FP&A Platform Comparison 2026",
  description: "Compare Castford and Pigment for financial planning. Castford starts at $499/mo with AI copilot and same-day setup. Pigment starts at $65K+/year with longer implementation cycles.",
  keywords: ["Castford vs Pigment", "Pigment alternative", "FP&A software comparison", "Pigment pricing", "best FP&A platform 2026"],
  openGraph: { title: "Castford vs Pigment — FP&A Comparison 2026", url: "https://castford.com/compare/pigment" },
  alternates: { canonical: "https://castford.com/compare/pigment" },
};

import Link from "next/link";

export default function ComparePigment() {
  const B="#06080c",S="#10131a",BD="#1a1f2e",T="#eef0f6",TD="#636d84",TF="#3d4558",AC="#5b9cf5",PU="#a181f7",GN="#3dd9a0",AM="#f5b731";
  const rows = [
    { f: "Starting Price", us: "$499/mo flat", them: "$65K+/year", w: "us" },
    { f: "Time to Value", us: "Same day", them: "4–12 weeks", w: "us" },
    { f: "AI Copilot with Reasoning", us: "✓ Claude-powered, SHAP values", them: "✓ Analyst/Modeler agents", w: "tie" },
    { f: "Self-Serve Onboarding", us: "✓ 15 minutes, no consultants", them: "✕ Requires SI partner", w: "us" },
    { f: "Scenario Modeling", us: "✓ Unlimited, live sliders", them: "✓ Strong, native versions", w: "tie" },
    { f: "Multi-Entity Consolidation", us: "✓ Auto IC & FX (20+ currencies)", them: "✓ Strong", w: "tie" },
    { f: "Revenue Forecasting", us: "ML ensemble (ETS + XGBoost)", them: "Formula + driver-based", w: "us" },
    { f: "Forecast Accuracy (MAPE)", us: "3.2%", them: "Not published", w: "us" },
    { f: "Real-Time Planning", us: "✓ Single source of truth", them: "✓ Single platform", w: "tie" },
    { f: "Model Maintenance", us: "✓ Business user-friendly", them: "✓ Natural syntax", w: "tie" },
    { f: "Native Integrations", us: "15+ (QuickBooks, Stripe, Salesforce)", them: "50+ native connectors", w: "them" },
    { f: "Headcount Planning", us: "Roadmap", them: "✓ Strong module", w: "them" },
    { f: "Published Pricing", us: "✓ Transparent, online", them: "✕ Custom quotes only", w: "us" },
    { f: "Scalable ML Forecasting", us: "✓ Thousands of series", them: "✓ State-of-art models", w: "tie" },
    { f: "Enterprise / On-Prem", us: "✓ Custom plan", them: "✓ Enterprise tier", w: "tie" },
  ];

  return (
    <div style={{ background: B, color: T, fontFamily: "'Manrope', system-ui, sans-serif", minHeight: "100vh" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 48px", maxWidth: 1200, margin: "0 auto", borderBottom: `1px solid ${BD}50` }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor={AC} /><stop offset="100%" stopColor={PU} /></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)" /><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="22" r="3" fill={GN} /></svg>
          <span style={{ fontSize: 16, fontWeight: 800, color: T }}>Castford</span>
        </Link>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/use-cases/finance" style={{ fontSize: 13, color: TD, textDecoration: "none" }}>Use Cases</Link>
          <Link href="/" style={{ fontSize: 13, padding: "9px 20px", borderRadius: 10, background: `linear-gradient(135deg,${AC},${PU})`, color: "#fff", textDecoration: "none", fontWeight: 700 }}>Try Demo →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 48px" }}>
        <nav style={{ fontSize: 12, color: TF, marginBottom: 32 }}>
          <Link href="/" style={{ color: AC, textDecoration: "none" }}>Castford</Link>
          <span style={{ margin: "0 8px" }}>/</span><span>Compare</span>
          <span style={{ margin: "0 8px" }}>/</span><span style={{ color: T }}>Pigment</span>
        </nav>

        <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 20 }}>Castford vs Pigment</h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: TD, marginBottom: 40, maxWidth: 720 }}>
          Castford is an AI-native FP&A platform starting at $499/month that deploys the same day. Pigment is an enterprise business planning platform starting at $65K+/year with 4–12 week implementations. Both offer strong scenario modeling — Castford adds ML-powered forecasting and visible AI reasoning at a fraction of the cost.
        </p>

        {/* Quick metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 48 }}>
          {[
            { us: "$499/mo", them: "$65K+/yr", l: "Starting price" },
            { us: "Same day", them: "4-12 weeks", l: "Time to value" },
            { us: "3.2%", them: "N/A", l: "MAPE score" },
            { us: "Self-serve", them: "SI required", l: "Onboarding" },
          ].map(m => (
            <div key={m.l} style={{ padding: "20px 16px", borderRadius: 14, background: S, border: `1px solid ${BD}`, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: AC, fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{m.us}</div>
              <div style={{ fontSize: 10, color: TF, marginBottom: 6 }}>vs {m.them}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: TD, textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div style={{ borderRadius: 18, border: `1px solid ${BD}`, overflow: "hidden", background: S, marginBottom: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", borderBottom: `1px solid ${BD}` }}>
            <div style={{ padding: "16px 24px", fontSize: 10, fontWeight: 800, color: TF, textTransform: "uppercase", letterSpacing: ".1em" }}>Feature</div>
            <div style={{ padding: "16px 24px", fontSize: 10, fontWeight: 800, color: AC, textTransform: "uppercase", letterSpacing: ".1em", textAlign: "center", background: `${AC}04`, borderLeft: `1px solid ${BD}`, borderRight: `1px solid ${BD}` }}>Castford</div>
            <div style={{ padding: "16px 24px", fontSize: 10, fontWeight: 800, color: TF, textTransform: "uppercase", letterSpacing: ".1em", textAlign: "center" }}>Pigment</div>
          </div>
          {rows.map((r, i) => (
            <div key={r.f} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", borderBottom: i < rows.length - 1 ? `1px solid ${BD}40` : "none" }}>
              <div style={{ padding: "13px 24px", fontSize: 13, color: TD, fontWeight: 500 }}>{r.f}</div>
              <div style={{ padding: "13px 24px", fontSize: 12, color: r.w === "us" || r.w === "tie" ? GN : TD, fontWeight: r.w === "us" ? 700 : 400, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", background: `${AC}03`, borderLeft: `1px solid ${BD}40`, borderRight: `1px solid ${BD}40` }}>{r.us}</div>
              <div style={{ padding: "13px 24px", fontSize: 12, color: r.w === "them" ? GN : TF, fontWeight: r.w === "them" ? 700 : 400, textAlign: "center" }}>{r.them}</div>
            </div>
          ))}
        </div>

        {/* When to choose */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
          <div style={{ padding: "28px 24px", borderRadius: 16, background: `${AC}04`, border: `1px solid ${AC}15` }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: T, marginBottom: 12 }}>Choose Castford when you need</h3>
            {["Same-day deployment, no consultants", "ML-powered forecasting with 3.2% MAPE", "AI copilot with visible reasoning (SHAP)", "Transparent pricing starting at $499/mo", "Self-serve onboarding in 15 minutes"].map(p => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: TD, marginBottom: 6 }}>
                <span style={{ color: GN, fontWeight: 700 }}>✓</span> {p}
              </div>
            ))}
          </div>
          <div style={{ padding: "28px 24px", borderRadius: 16, background: S, border: `1px solid ${BD}` }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: T, marginBottom: 12 }}>Consider Pigment when you need</h3>
            {["50+ native connectors for large enterprise", "Strong headcount planning module", "Real-time multi-user collaboration at scale", "Established enterprise brand recognition", "Custom deployment with SI partners"].map(p => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: TF, marginBottom: 6 }}>
                <span style={{ color: TF }}>•</span> {p}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "48px 0", borderTop: `1px solid ${BD}` }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>See why teams are switching to Castford</h2>
          <p style={{ fontSize: 14, color: TD, marginBottom: 28 }}>Try the full platform. No credit card, no sales call required.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <Link href="/" style={{ padding: "14px 32px", borderRadius: 12, background: `linear-gradient(135deg,${AC},${PU})`, color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Try Castford Free →</Link>
            <a href="https://calendly.com/castford-support/30min" target="_blank" rel="noopener" style={{ padding: "14px 32px", borderRadius: 12, border: `1px solid ${BD}`, color: T, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Book a Demo</a>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Is Castford cheaper than Pigment?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Castford starts at $499 per month. Pigment typically starts at $65,000 or more per year, making Castford roughly 90% less expensive." }},
            { "@type": "Question", "name": "Can Castford replace Pigment?", "acceptedAnswer": { "@type": "Answer", "text": "Castford covers core FP&A: P&L analysis, scenario modeling, multi-entity consolidation, ML forecasting, and month-end close. Pigment has stronger headcount planning and more native integrations. Castford has a stronger AI copilot with visible reasoning." }},
            { "@type": "Question", "name": "Does Castford have AI like Pigment?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Castford uses Claude AI for its copilot with visible reasoning, SHAP feature importance, and confidence intervals. Pigment offers Analyst and Modeler agents." }},
          ]
        }) }} />
      </div>
    </div>
  );
}
