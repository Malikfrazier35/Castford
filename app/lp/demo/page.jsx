"use client";
import { useState } from "react";

export default function DemoLanding() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.includes("@") || !name.trim()) return;
    setLoading(true);
    try {
      // Capture UTM data from session
      let utmData = {};
      try { utmData = JSON.parse(sessionStorage.getItem("fos_utm") || "{}"); } catch {}

      // Call the request-demo Edge Function (handles DB insert + lead creation + notifications)
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/request-demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
        body: JSON.stringify({
          email: email.trim(),
          full_name: name.trim(),
          company: company.trim(),
          use_case: "ad_landing",
          utm_data: utmData,
        }),
      });
      setSubmitted(true);

      // Fire conversion events if pixels are loaded
      if (typeof window !== "undefined") {
        // Google Ads conversion
        if (window.gtag) {
          window.gtag("event", "conversion", { send_to: "AW-18032992189/6hiYCNWJoY0cEL2_5pZD", value: 1.0, currency: "USD" });
          window.gtag("event", "generate_lead", { event_category: "engagement", event_label: "demo_request" });
        }
        // Meta Pixel
        if (window.fbq) window.fbq("track", "Lead");
        // LinkedIn
        if (window.lintrk) window.lintrk("track", { conversion_id: 0 });
        // Plausible custom event
        if (window.plausible) window.plausible("DemoRequest", { props: { source: utmData.utm_source || "direct" }});
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Manrope', system-ui, sans-serif", background: "#0a0e1a", color: "#c8cdd8", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Subtle dot grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 0.5px, transparent 0.5px)", backgroundSize: "32px 32px", pointerEvents: "none", zIndex: 0 }} />
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "-20%", right: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 65%)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-15%", left: "-10%", width: "45%", height: "45%", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 65%)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />
      {/* Minimal header — no nav links, just logo */}
      <header style={{ padding: "20px 32px", display: "flex", alignItems: "center", borderBottom: "1px solid #1e2230" }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff" }}>F</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#f0f2f7", letterSpacing: "-0.02em" }}>Castford</span>
        </a>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 960, width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Left — value prop */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>AI-Powered FP&A Platform</div>
            <h1 style={{ fontSize: 40, fontWeight: 800, color: "#f0f2f7", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.03em" }}>
              Replace spreadsheets with AI-powered financial planning
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#9ea5b8", marginBottom: 32 }}>
              Connect your ERP in minutes, not months. Get real-time variance detection, scenario modeling, and an AI copilot that answers questions about your financials.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Live in under 48 hours — not 6 months",
                "AI copilot answers 'Why is COGS up 12%?'",
                "Starts at $499/mo — not $200K/year",
                "30-day money-back guarantee",
              ].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#c8cdd8" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: "#34d39915", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#34d399", fontSize: 12, fontWeight: 800 }}>✓</span>
                  </div>
                  {item}
                </div>
              ))}
            </div>
            {/* Social proof */}
            <div style={{ marginTop: 32, padding: "16px 0", borderTop: "1px solid #1e2230", display: "flex", gap: 32 }}>
              {[
                { label: "Implementation", value: "< 48 hrs" },
                { label: "Starting at", value: "$499/mo" },
                { label: "AI Accuracy", value: "3.2% MAPE" },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#f0f2f7", fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#5a6178", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div style={{ background: "#111827", border: "1px solid #1e2230", borderRadius: 16, padding: 32 }}>
            {!submitted ? (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f2f7", marginBottom: 4 }}>See Castford in action</h2>
                <p style={{ fontSize: 13, color: "#5a6178", marginBottom: 24 }}>Get a personalized demo for your finance team.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #1e2230", background: "#0a0e1a", color: "#f0f2f7", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Work email" type="email" style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #1e2230", background: "#0a0e1a", color: "#f0f2f7", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                  <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company name" style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #1e2230", background: "#0a0e1a", color: "#f0f2f7", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                  <button onClick={handleSubmit} disabled={loading || !email.includes("@") || !name.trim()}
                    style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: (!email.includes("@") || !name.trim()) ? "#1e2230" : "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: (!email.includes("@") || !name.trim()) ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: (!email.includes("@") || !name.trim()) ? 0.5 : 1 }}>
                    {loading ? "Submitting..." : "Request Demo"}
                  </button>
                </div>
                <p style={{ fontSize: 10, color: "#3d4558", marginTop: 12, textAlign: "center" }}>No credit card required. 30-day money-back guarantee.</p>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#34d39915", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>✓</div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f2f7", marginBottom: 8 }}>Demo requested</h2>
                <p style={{ fontSize: 14, color: "#9ea5b8", marginBottom: 24 }}>We'll reach out within 24 hours to schedule your personalized walkthrough.</p>
                <a href="/" style={{ display: "inline-block", padding: "12px 24px", borderRadius: 8, background: "#60a5fa15", color: "#60a5fa", fontWeight: 600, fontSize: 13, textDecoration: "none", border: "1px solid #60a5fa30" }}>
                  Explore Castford →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
