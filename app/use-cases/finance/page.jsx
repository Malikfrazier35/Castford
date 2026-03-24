"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function FinanceUseCasePage() {
  const [vis, setVis] = useState({});
  const refs = useRef({});
  
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setVis(p => ({ ...p, [e.target.dataset.section]: true })); });
    }, { threshold: 0.15 });
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const reg = (id) => (el) => { if (el) { el.dataset.section = id; refs.current[id] = el; } };
  const show = (id) => vis[id];

  const BG = "#06080c";
  const S = "#10131a";
  const B = "#1a1f2e";
  const T = "#eef0f6";
  const TD = "#636d84";
  const TF = "#3d4558";
  const AC = "#5b9cf5";
  const PU = "#a181f7";
  const GN = "#3dd9a0";
  const AM = "#f5b731";

  return (
    <div style={{ background: BG, color: T, fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh", overflow: "hidden" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes gradShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes countUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .uc-fade { animation: fadeUp 0.7s ease both; }
        .uc-fade-d1 { animation: fadeUp 0.7s ease 0.1s both; }
        .uc-fade-d2 { animation: fadeUp 0.7s ease 0.2s both; }
        .uc-fade-d3 { animation: fadeUp 0.7s ease 0.3s both; }
        .uc-fade-d4 { animation: fadeUp 0.7s ease 0.4s both; }
        .uc-btn { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .uc-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(91,156,245,0.2); }
        .uc-card { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .uc-card:hover { transform: translateY(-4px); border-color: rgba(91,156,245,0.3) !important; box-shadow: 0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px rgba(91,156,245,0.1) !important; }
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 48px", maxWidth: 1200, margin: "0 auto", background: "rgba(6,8,12,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${B}50` }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${AC}, ${PU})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff" }}>F</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: T, letterSpacing: "-0.03em" }}>FinanceOS</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/use-cases/budget-planning" style={{ fontSize: 13, color: TD, textDecoration: "none", fontWeight: 500 }}>Budget Planning</Link>
          <Link href="/use-cases/consolidation" style={{ fontSize: 13, color: TD, textDecoration: "none", fontWeight: 500 }}>Consolidation</Link>
          <Link href="/use-cases/forecasting" style={{ fontSize: 13, color: TD, textDecoration: "none", fontWeight: 500 }}>Forecasting</Link>
          <Link href="/" className="uc-btn" style={{ fontSize: 13, padding: "9px 20px", borderRadius: 10, background: `linear-gradient(135deg, ${AC}, ${PU})`, color: "#fff", textDecoration: "none", fontWeight: 700, border: "none" }}>Try the Demo →</Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", textAlign: "center", padding: "100px 48px 80px", maxWidth: 900, margin: "0 auto" }}>
        {/* Ambient orbs */}
        <div style={{ position: "absolute", top: -100, left: "20%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${AC}08, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: "10%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${PU}06, transparent 70%)`, pointerEvents: "none" }} />
        
        <div className="uc-fade" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: AC, marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: `${AC}08`, border: `1px solid ${AC}15` }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: GN, animation: "pulse 2s infinite" }} />
          For Finance Teams
        </div>
        
        <h1 className="uc-fade-d1" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.04em", marginBottom: 24, background: `linear-gradient(135deg, ${T} 30%, ${AC} 70%, ${PU})`, backgroundSize: "200% 200%", animation: "gradShift 8s ease infinite", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Financial planning that thinks before it answers
        </h1>
        
        <p className="uc-fade-d2" style={{ fontSize: 18, color: TD, lineHeight: 1.65, maxWidth: 580, margin: "0 auto 40px", fontWeight: 400 }}>
          AI-native variance detection, scenario modeling, and natural language querying — built for modern finance teams who refuse to compromise on speed or accuracy.
        </p>
        
        <div className="uc-fade-d3" style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <Link href="/" className="uc-btn" style={{ fontSize: 15, padding: "14px 32px", borderRadius: 12, background: `linear-gradient(135deg, ${AC}, ${PU})`, color: "#fff", textDecoration: "none", fontWeight: 700, boxShadow: `0 4px 24px ${AC}30` }}>Explore the Demo →</Link>
          <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" className="uc-btn" style={{ fontSize: 15, padding: "14px 32px", borderRadius: 12, border: `1px solid ${B}`, background: "transparent", color: TD, textDecoration: "none", fontWeight: 600 }}>Book a Demo Call</a>
        </div>
      </section>

      {/* ═══ METRICS BAR ═══ */}
      <section ref={reg("metrics")} style={{ padding: "60px 48px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, opacity: show("metrics") ? 1 : 0, transform: show("metrics") ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          {[
            { value: "96.8%", label: "Forecast Accuracy", sub: "ML ensemble model" },
            { value: "3.2%", label: "MAPE Score", sub: "Best-in-class" },
            { value: "<5 min", label: "Month-End Close Prep", sub: "vs 2-3 days manual" },
            { value: "118%", label: "Avg NDR Tracked", sub: "Real-time metrics" },
          ].map((m, i) => (
            <div key={m.label} style={{ textAlign: "center", padding: "28px 20px", borderRadius: 16, background: `${S}80`, border: `1px solid ${B}`, backdropFilter: "blur(12px)", animation: show("metrics") ? `countUp 0.5s ease ${i * 0.1}s both` : "none" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: AC, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.03em", marginBottom: 6 }}>{m.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T, marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: TF }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ INTERACTIVE DEMO PREVIEW ═══ */}
      <section ref={reg("demo")} style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48, opacity: show("demo") ? 1 : 0, transform: show("demo") ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: PU, marginBottom: 12 }}>See FinanceOS in action</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Your command center for financial intelligence</h2>
          <p style={{ fontSize: 15, color: TD, maxWidth: 500, margin: "0 auto" }}>12 specialized views. AI copilot. Real-time variance detection. One unified platform.</p>
        </div>
        
        {/* Dashboard mockup */}
        <Link href="/" style={{ textDecoration: "none" }}>
        <div className="uc-card" style={{ borderRadius: 20, border: `1px solid ${B}`, overflow: "hidden", position: "relative", cursor: "pointer", boxShadow: `0 20px 60px rgba(0,0,0,0.4)` }}>
          {/* Top bar mockup */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: `linear-gradient(90deg, ${S}, ${S}ee)`, borderBottom: `1px solid ${B}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f06b6b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: AM }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: GN }} />
            </div>
            <div style={{ fontSize: 11, color: TF, fontFamily: "'JetBrains Mono', monospace" }}>finance-os.app/dashboard</div>
            <div style={{ width: 60 }} />
          </div>
          {/* Content area */}
          <div style={{ padding: "32px 40px", background: `linear-gradient(180deg, ${BG}, ${S})`, minHeight: 340 }}>
            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
              {[
                { label: "ARR", value: "$48.6M", delta: "+24%", color: AC },
                { label: "NDR", value: "118%", delta: "+3pp", color: GN },
                { label: "Gross Margin", value: "84.7%", delta: "+2.1pp", color: PU },
                { label: "Rule of 40", value: "52.1", delta: "Top 10%", color: GN },
              ].map(k => (
                <div key={k.label} style={{ padding: "16px 18px", borderRadius: 14, background: `rgba(16,19,26,0.7)`, border: `1px solid ${B}60`, backdropFilter: "blur(8px)" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: TF, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: T, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{k.value}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: k.color, padding: "2px 6px", borderRadius: 4, background: `${k.color}12` }}>{k.delta}</span>
                </div>
              ))}
            </div>
            {/* Chart area mockup */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
              <div style={{ padding: "20px 24px", borderRadius: 14, background: `rgba(16,19,26,0.6)`, border: `1px solid ${B}60` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: T, marginBottom: 4 }}>Revenue Performance</div>
                <div style={{ fontSize: 10, color: TF, marginBottom: 16 }}>Actual vs Budget vs Forecast</div>
                {/* SVG chart mockup */}
                <svg viewBox="0 0 400 120" style={{ width: "100%", height: 120 }}>
                  <defs>
                    <linearGradient id="ucAct" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={AC} stopOpacity={0.3} /><stop offset="100%" stopColor={AC} stopOpacity={0} /></linearGradient>
                  </defs>
                  {[20, 40, 60, 80, 100].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke={B} strokeWidth="0.5" strokeDasharray="1 8" strokeLinecap="round" />)}
                  <path d="M10,95 L60,85 L110,78 L160,70 L210,58 L260,50 L310,38 L360,30 L400,25" fill="url(#ucAct)" stroke="none" />
                  <path d="M10,95 L60,85 L110,78 L160,70 L210,58 L260,50 L310,38 L360,30 L400,25" fill="none" stroke={AC} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="10" y1="98" x2="400" y2="32" stroke={TF} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                  <circle cx="360" cy="30" r="4" fill={AC} stroke={BG} strokeWidth="2">
                    <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
              <div style={{ padding: "20px 24px", borderRadius: 14, background: `rgba(16,19,26,0.6)`, border: `1px solid ${B}60` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: T, marginBottom: 12 }}>AI Copilot</div>
                <div style={{ padding: "10px 14px", borderRadius: 10, background: `${AC}08`, border: `1px solid ${AC}12`, fontSize: 11, color: TD, marginBottom: 8 }}>"What drove the $2.1M revenue beat?"</div>
                <div style={{ padding: "10px 14px", borderRadius: 10, background: `${PU}06`, border: `1px solid ${PU}10`, fontSize: 11, color: T, lineHeight: 1.5 }}>
                  Enterprise expansion drove 68% of the beat, with NDR at 126% in that segment...
                </div>
              </div>
            </div>
          </div>
          {/* CTA overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 0 24px", background: "linear-gradient(transparent, rgba(6,8,12,0.95))", textAlign: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: AC, display: "inline-flex", alignItems: "center", gap: 8 }}>
              Launch Interactive Demo →
            </span>
          </div>
        </div>
        </Link>
      </section>

      {/* ═══ FEATURE SHOWCASE — NUMBERED ═══ */}
      <section ref={reg("features")} style={{ padding: "100px 48px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64, opacity: show("features") ? 1 : 0, transform: show("features") ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: GN, marginBottom: 12 }}>Platform capabilities</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em" }}>Built for how finance teams actually work</h2>
        </div>
        
        {[
          { num: "01", title: "Connect your data in minutes, not months", desc: "Native connectors for QuickBooks, Xero, NetSuite, Sage, Stripe, and 15+ platforms. CSV import with auto-column detection. No implementation consultants required.", icon: "🔗", color: AC },
          { num: "02", title: "AI that explains its reasoning", desc: "Ask any question in natural language. The AI Copilot shows its work — SHAP feature importance, confidence intervals, and variance drivers. No black boxes.", icon: "🧠", color: PU },
          { num: "03", title: "Scenario modeling with live sensitivity", desc: "Drag sliders to adjust NDR, pipeline, churn, headcount — see P&L impact instantly. Bear/base/bull scenarios with ML-powered confidence bands.", icon: "📊", color: GN },
          { num: "04", title: "Multi-entity consolidation with auto-IC", desc: "Consolidate across unlimited entities with automatic intercompany elimination, real-time FX rates, and one-click period close.", icon: "🏢", color: AM },
          { num: "05", title: "Month-end close in hours, not days", desc: "Checklist-driven close workflow with category grouping, owner assignment, burndown tracking, and audit trail. Every task has an owner and a deadline.", icon: "✅", color: AC },
          { num: "06", title: "Investor-grade reporting on demand", desc: "Rule of 40, burn multiple, CAC payback, LTV/CAC, cohort analysis — all auto-calculated from your GL data. Board deck-ready in one click.", icon: "📈", color: PU },
        ].map((f, i) => (
          <div key={f.num} style={{
            display: "grid", gridTemplateColumns: "80px 1fr", gap: 32, marginBottom: 56, alignItems: "flex-start",
            opacity: show("features") ? 1 : 0, transform: show("features") ? "none" : "translateX(-20px)",
            transition: `all 0.5s ease ${i * 0.1}s`,
          }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: `${f.color}20`, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.05em", lineHeight: 1 }}>{f.num}</div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.02em", color: T }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: TD, lineHeight: 1.7, maxWidth: 600 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══ USE CASE GRID ═══ */}
      <section ref={reg("usecases")} style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48, opacity: show("usecases") ? 1 : 0, transform: show("usecases") ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: AM, marginBottom: 12 }}>Use Cases</div>
          <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em" }}>Every workflow your finance team needs</h2>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { title: "Budget Planning & Forecasting", desc: "Driver-based budgeting with rolling forecasts and what-if scenarios", href: "/use-cases/budget-planning", color: AC },
            { title: "P&L, Cash Flow & Balance Sheet", desc: "Automated three-statement model with real-time variance detection", href: "/use-cases/saas-fpa", color: GN },
            { title: "Financial Consolidation", desc: "Multi-entity consolidation with IC elimination and FX management", href: "/use-cases/consolidation", color: PU },
            { title: "Revenue Forecasting", desc: "ML ensemble models with 96.8% accuracy and live sensitivity analysis", href: "/use-cases/forecasting", color: AM },
            { title: "Month-End Close", desc: "Checklist-driven close with task assignment, burndown tracking, and audit trail", href: "/", color: AC },
            { title: "Investor Reporting", desc: "Board-ready SaaS metrics, cohort analysis, and fundraising readiness scorecards", href: "/", color: PU },
          ].map((uc, i) => (
            <Link key={uc.title} href={uc.href} className="uc-card" style={{
              padding: "28px 24px", borderRadius: 16, background: `${S}90`, border: `1px solid ${B}`,
              textDecoration: "none", display: "block",
              opacity: show("usecases") ? 1 : 0, transform: show("usecases") ? "none" : "translateY(16px)",
              transition: `all 0.4s ease ${i * 0.08}s`,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${uc.color}10`, border: `1px solid ${uc.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: uc.color }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: T, marginBottom: 8, letterSpacing: "-0.01em" }}>{uc.title}</h3>
              <p style={{ fontSize: 13, color: TD, lineHeight: 1.6, marginBottom: 12 }}>{uc.desc}</p>
              <span style={{ fontSize: 12, fontWeight: 600, color: uc.color }}>Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section ref={reg("compare")} style={{ padding: "80px 48px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48, opacity: show("compare") ? 1 : 0, transform: show("compare") ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Why teams switch from legacy tools</h2>
          <p style={{ fontSize: 15, color: TD }}>FinanceOS vs Anaplan, Pigment, Adaptive, Planful</p>
        </div>
        
        <div style={{ borderRadius: 16, border: `1px solid ${B}`, overflow: "hidden", background: S }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 0 }}>
            <div style={{ padding: "14px 20px", background: `${BG}80`, fontSize: 10, fontWeight: 800, color: TF, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${B}` }}>Capability</div>
            <div style={{ padding: "14px 20px", background: `${AC}06`, fontSize: 10, fontWeight: 800, color: AC, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${B}`, textAlign: "center" }}>FinanceOS</div>
            <div style={{ padding: "14px 20px", background: `${BG}80`, fontSize: 10, fontWeight: 800, color: TF, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${B}`, textAlign: "center" }}>Legacy FP&A</div>
          </div>
          {[
            { cap: "Time to value", us: "Same day", them: "3-6 months" },
            { cap: "AI copilot with reasoning", us: "✓ Built-in", them: "✕ or add-on" },
            { cap: "Starting price", us: "$499/mo", them: "$65K+/yr" },
            { cap: "Self-serve onboarding", us: "✓ 15 minutes", them: "✕ Required SI" },
            { cap: "Multi-entity consolidation", us: "✓ Auto IC/FX", them: "✓ Manual config" },
            { cap: "Forecast accuracy (MAPE)", us: "3.2%", them: "8-15%" },
            { cap: "Real-time variance detection", us: "✓ ML-powered", them: "✕ Manual review" },
            { cap: "Published pricing", us: "✓ Transparent", them: "✕ Sales call only" },
          ].map((r, i) => (
            <div key={r.cap} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 0, borderBottom: i < 7 ? `1px solid ${B}50` : "none" }}>
              <div style={{ padding: "12px 20px", fontSize: 13, color: TD, fontWeight: 500 }}>{r.cap}</div>
              <div style={{ padding: "12px 20px", fontSize: 13, color: GN, fontWeight: 700, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", background: `${AC}03` }}>{r.us}</div>
              <div style={{ padding: "12px 20px", fontSize: 13, color: TF, fontWeight: 500, textAlign: "center" }}>{r.them}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: "100px 48px 120px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", bottom: 0, left: "30%", width: 500, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${AC}06, transparent 70%)`, pointerEvents: "none" }} />
        <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>Ready to outgrow spreadsheets?</h2>
        <p style={{ fontSize: 16, color: TD, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>Join finance teams who replaced 6 tools with one platform. Start with our interactive demo — no credit card required.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <Link href="/" className="uc-btn" style={{ fontSize: 16, padding: "16px 36px", borderRadius: 12, background: `linear-gradient(135deg, ${AC}, ${PU})`, color: "#fff", textDecoration: "none", fontWeight: 700, boxShadow: `0 6px 28px ${AC}30` }}>Launch Demo →</Link>
          <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" className="uc-btn" style={{ fontSize: 16, padding: "16px 36px", borderRadius: 12, border: `1px solid ${B}`, background: "transparent", color: T, textDecoration: "none", fontWeight: 600 }}>Talk to Sales</a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "40px 48px", borderTop: `1px solid ${B}`, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: `linear-gradient(135deg, ${AC}, ${PU})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: "#fff" }}>F</div>
            <span style={{ fontSize: 12, fontWeight: 700, color: TD }}>FinanceOS</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 12, color: TF }}>
            <Link href="/privacy" style={{ color: TF, textDecoration: "none" }}>Privacy</Link>
            <Link href="/terms" style={{ color: TF, textDecoration: "none" }}>Terms</Link>
            <Link href="/" style={{ color: TF, textDecoration: "none" }}>Platform</Link>
          </div>
          <div style={{ fontSize: 11, color: TF }}>© 2026 Financial Holding LLC</div>
        </div>
      </footer>
    </div>
  );
}
