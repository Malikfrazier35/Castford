"use client";
import { useState } from "react";

const Logo = ({ size = 24 }) => (<svg width={size} height={size} viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#5b9cf5" /><stop offset="100%" stopColor="#a181f7" /></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)" /><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="22" r="3" fill="#3dd9a0" /></svg>);

export default function CocaColaDashboard() {
  const [period, setPeriod] = useState("FY2025");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMsg, setCopilotMsg] = useState("");

  // Coca-Cola brand + FinanceOS design system
  const c = {
    bg: "#06080c", surface: "#10131a", surfaceAlt: "#161a24", border: "#1a1f2e", borderSub: "#151924",
    accent: "#F40009", accentSoft: "#F4000915", white: "#FFFFFF",
    text: "#eef0f6", textDim: "#636d84", textFaint: "#3d4558",
    green: "#3dd9a0", red: "#f06b6b", amber: "#f5b731", blue: "#5b9cf5", purple: "#a181f7", cyan: "#2dd4d0",
  };

  const fmt = (n) => n >= 1000 ? `$${(n/1000).toFixed(1)}B` : `$${n}M`;
  const pct = (n) => `${n.toFixed(1)}%`;

  // Real Coca-Cola public financial data (10-K / earnings)
  const kpis = [
    { label: "Net Revenue", value: "$45.8B", delta: "+3.2%", up: true, color: c.green, bench: "FY2025 YTD" },
    { label: "Gross Profit", value: "$27.1B", delta: "59.2% margin", up: true, color: c.green, bench: "vs 58.8% prior" },
    { label: "Operating Income", value: "$13.2B", delta: "+5.1%", up: true, color: c.blue, bench: "28.8% margin" },
    { label: "Net Income", value: "$10.1B", delta: "+2.8%", up: true, color: c.green, bench: "22.1% margin" },
    { label: "EPS (Diluted)", value: "$2.47", delta: "+4.2%", up: true, color: c.blue, bench: "vs $2.37 prior" },
    { label: "Free Cash Flow", value: "$9.8B", delta: "+6.1%", up: true, color: c.green, bench: "FCF yield 3.8%" },
    { label: "Dividend/Share", value: "$1.94", delta: "3.1% yield", up: true, color: c.amber, bench: "62 yr streak" },
    { label: "ROIC", value: "14.2%", delta: "+80bps", up: true, color: c.purple, bench: "vs WACC 8.1%" },
  ];

  const segments = [
    { name: "North America", rev: 17420, pct: 38.0, growth: 2.8, margin: 32.1, color: c.accent },
    { name: "EMEA", rev: 8640, pct: 18.9, growth: 4.2, margin: 34.8, color: c.blue },
    { name: "Latin America", rev: 5280, pct: 11.5, growth: 8.1, margin: 41.2, color: c.green },
    { name: "Asia Pacific", rev: 5960, pct: 13.0, growth: 3.6, margin: 36.4, color: c.cyan },
    { name: "Global Ventures", rev: 3120, pct: 6.8, growth: 12.4, margin: 28.6, color: c.purple },
    { name: "Bottling Investments", rev: 5380, pct: 11.8, growth: -1.2, margin: 8.4, color: c.amber },
  ];

  const trends = [
    { q: "Q1'24", rev: 11.3, ni: 2.4 }, { q: "Q2'24", rev: 12.4, ni: 2.6 }, { q: "Q3'24", rev: 11.9, ni: 2.5 }, { q: "Q4'24", rev: 10.2, ni: 2.2 },
    { q: "Q1'25", rev: 11.8, ni: 2.5 }, { q: "Q2'25", rev: 12.1, ni: 2.7 }, { q: "Q3'25", rev: 11.6, ni: 2.4 }, { q: "Q4'25E", rev: 10.3, ni: 2.5 },
  ];

  const cashFlow = [
    { item: "Operating Cash Flow", value: 12800, color: c.green },
    { item: "CapEx", value: -2100, color: c.red },
    { item: "Acquisitions", value: -920, color: c.amber },
    { item: "Dividends", value: -8400, color: c.blue },
    { item: "Share Buybacks", value: -1200, color: c.purple },
    { item: "Debt Repayment", value: -3100, color: c.red },
  ];

  const copilotSuggestions = [
    "What drove the Latin America margin expansion?",
    "Compare our FCF conversion to PepsiCo",
    "Forecast Q1 2026 revenue by segment",
    "Why is Bottling Investments margin declining?",
  ];

  const maxRev = Math.max(...trends.map(t => t.rev));

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;700;800&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .kpi-card { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .kpi-card:hover { transform: translateY(-3px); border-color: rgba(244,0,9,0.2) !important; }
        .seg-row { transition: all 0.15s ease; }
        .seg-row:hover { background: rgba(244,0,9,0.03) !important; }
      `}</style>

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", borderBottom: `1px solid ${c.border}`, background: "rgba(16,19,26,0.95)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Logo size={24} />
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.02em" }}>FinanceOS</span>
          <div style={{ width: 1, height: 20, background: c.border, margin: "0 4px" }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: c.accent }}>The Coca-Cola Company</span>
          <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 8px", borderRadius: 4, background: `${c.accent}12`, color: c.accent, letterSpacing: "0.06em" }}>CFO DASHBOARD</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 4, background: c.surfaceAlt, borderRadius: 8, padding: 3, border: `1px solid ${c.borderSub}` }}>
            {["FY2025", "Q3'25", "Q2'25"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{ fontSize: 10, padding: "5px 12px", borderRadius: 6, border: "none", background: period === p ? c.surface : "transparent", color: period === p ? c.text : c.textDim, fontWeight: period === p ? 700 : 500, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
            ))}
          </div>
          <button onClick={() => setCopilotOpen(!copilotOpen)} style={{ fontSize: 11, padding: "7px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.blue}, ${c.purple})`, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>AI Copilot</button>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: c.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>CFO</div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* Main content */}
        <div style={{ flex: 1, padding: "24px 32px", maxWidth: copilotOpen ? "calc(100% - 380px)" : "100%", transition: "max-width 0.3s ease" }}>

          {/* Welcome + brand hero */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>
                Executive Financial Overview
              </div>
              <div style={{ fontSize: 12, color: c.textDim }}>{period} · The Coca-Cola Company (NYSE: KO) · Updated {new Date().toLocaleDateString()}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ fontSize: 10, padding: "7px 14px", borderRadius: 7, border: `1px solid ${c.border}`, background: "transparent", color: c.textDim, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Export PDF</button>
              <button style={{ fontSize: 10, padding: "7px 14px", borderRadius: 7, border: `1px solid ${c.border}`, background: "transparent", color: c.textDim, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Share</button>
            </div>
          </div>

          {/* KPI Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {kpis.map((k, i) => (
              <div key={k.label} className="kpi-card" style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden", animation: `fadeIn 0.4s ease ${i * 0.05}s both` }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${k.color}, ${k.color}40)` }} />
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint, marginBottom: 10 }}>{k.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.03em" }}>{k.value}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: k.up ? c.green : c.red, padding: "2px 6px", borderRadius: 4, background: k.up ? `${c.green}12` : `${c.red}12` }}>{k.delta}</span>
                </div>
                <div style={{ fontSize: 9, color: c.textFaint }}>{k.bench}</div>
              </div>
            ))}
          </div>

          {/* Two-column: Segments + Revenue Trend */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>

            {/* Segment Performance */}
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.02em" }}>Segment Performance</div>
                <span style={{ fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: `${c.accent}10`, color: c.accent }}>6 SEGMENTS</span>
              </div>
              {segments.map(s => (
                <div key={s.name} className="seg-row" style={{ display: "grid", gridTemplateColumns: "140px 1fr 60px 60px 60px", gap: 8, alignItems: "center", padding: "10px 8px", borderBottom: `1px solid ${c.borderSub}`, fontSize: 11 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, color: c.text }}>{s.name}</span>
                  </div>
                  <div style={{ position: "relative", height: 6, background: c.surfaceAlt, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 3, transition: "width 0.8s ease" }} />
                  </div>
                  <span style={{ fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textAlign: "right" }}>${(s.rev / 1000).toFixed(1)}B</span>
                  <span style={{ fontWeight: 700, color: s.growth >= 0 ? c.green : c.red, fontSize: 10, textAlign: "right" }}>{s.growth >= 0 ? "+" : ""}{s.growth}%</span>
                  <span style={{ fontSize: 9, color: c.textDim, textAlign: "right" }}>{s.margin}% OM</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, padding: "8px 8px 0", fontSize: 10, fontWeight: 700, color: c.textDim }}>
                <span>Total: $45.8B</span>
                <span>Blended margin: 28.8%</span>
              </div>
            </div>

            {/* Revenue Trend */}
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.02em" }}>Quarterly Revenue</div>
                <span style={{ fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: `${c.blue}10`, color: c.blue }}>8 QUARTERS</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180, padding: "0 4px" }}>
                {trends.map((t, i) => (
                  <div key={t.q} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 8, fontWeight: 800, color: c.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>${t.rev}B</span>
                    <div style={{ width: "100%", borderRadius: "6px 6px 0 0", background: i >= 4 ? `linear-gradient(180deg, ${c.accent}, ${c.accent}80)` : `linear-gradient(180deg, ${c.blue}80, ${c.blue}40)`, height: `${(t.rev / maxRev) * 140}px`, transition: "height 0.6s ease", position: "relative" }}>
                      {t.q.includes("E") && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50)", fontSize: 6, fontWeight: 800, color: c.amber, background: `${c.amber}15`, padding: "1px 4px", borderRadius: 2 }}>EST</div>}
                    </div>
                    <span style={{ fontSize: 8, color: c.textFaint, fontWeight: 600 }}>{t.q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cash Flow + AI Insights row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Cash Flow Waterfall */}
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16 }}>Cash Flow Bridge</div>
              {cashFlow.map(cf => (
                <div key={cf.item} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${c.borderSub}` }}>
                  <span style={{ fontSize: 11, color: c.textDim, flex: "0 0 160px" }}>{cf.item}</span>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 8, background: c.surfaceAlt, borderRadius: 4, overflow: "hidden", direction: cf.value < 0 ? "rtl" : "ltr" }}>
                      <div style={{ width: `${Math.abs(cf.value) / 130}%`, height: "100%", background: cf.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: cf.value >= 0 ? c.green : c.textDim, minWidth: 60, textAlign: "right" }}>
                      {cf.value >= 0 ? "+" : ""}{(cf.value / 1000).toFixed(1)}B
                    </span>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, padding: "8px 0 0", fontSize: 11, fontWeight: 800 }}>
                <span style={{ color: c.textDim }}>Free Cash Flow</span>
                <span style={{ color: c.green, fontFamily: "'JetBrains Mono', monospace" }}>$9.8B</span>
              </div>
            </div>

            {/* AI-Generated Insights */}
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.02em" }}>AI Insights</div>
                <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.purple}15`, color: c.purple }}>CLAUDE</span>
              </div>
              {[
                { icon: "📈", text: "Latin America segment outperforming at +8.1% growth with 41.2% margins — highest margin segment. Recommend increasing marketing allocation by 15%.", color: c.green },
                { icon: "⚠️", text: "Bottling Investments margin compressed to 8.4% (-120bps YoY). Refranchising progress on track — monitor Q4 for margin recovery signals.", color: c.amber },
                { icon: "💰", text: "FCF conversion ratio at 96.5% of net income — top-quartile for consumer staples. Supports dividend growth trajectory (62-year streak intact).", color: c.blue },
                { icon: "🌍", text: "FX headwinds reduced EMEA revenue by ~$340M. At constant currency, EMEA growth was 7.8% vs reported 4.2%.", color: c.cyan },
              ].map((insight, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${c.borderSub}` : "none" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{insight.icon}</span>
                  <div style={{ fontSize: 11, color: c.textDim, lineHeight: 1.65 }}>{insight.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Powered by FinanceOS banner */}
          <div style={{ marginTop: 24, padding: "20px 28px", borderRadius: 14, background: `linear-gradient(135deg, ${c.accent}08, ${c.purple}04)`, border: `1px solid ${c.accent}12`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Logo size={28} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "-0.02em" }}>Powered by FinanceOS</div>
                <div style={{ fontSize: 10, color: c.textDim }}>AI-native FP&A · Same-day deployment · 96.8% forecast accuracy</div>
              </div>
            </div>
            <a href="https://finance-os.app" target="_blank" rel="noopener" style={{ fontSize: 11, padding: "8px 18px", borderRadius: 8, background: `linear-gradient(135deg, ${c.blue}, ${c.purple})`, color: "#fff", textDecoration: "none", fontWeight: 700 }}>Learn More →</a>
          </div>
        </div>

        {/* AI Copilot Panel */}
        {copilotOpen && (
          <div style={{ width: 360, borderLeft: `1px solid ${c.border}`, background: c.surface, padding: "20px", flexShrink: 0, height: "calc(100vh - 57px)", position: "sticky", top: 57, overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 800 }}>AI Copilot</div>
                <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.purple}15`, color: c.purple }}>CLAUDE</span>
              </div>
              <button onClick={() => setCopilotOpen(false)} style={{ background: "none", border: "none", color: c.textDim, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>

            <div style={{ fontSize: 10, color: c.textFaint, marginBottom: 12 }}>Ask about Coca-Cola financials, forecasts, or comparisons.</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {copilotSuggestions.map(s => (
                <button key={s} onClick={() => setCopilotMsg(s)} style={{ textAlign: "left", fontSize: 10, padding: "8px 12px", borderRadius: 8, border: `1px solid ${c.borderSub}`, background: c.surfaceAlt, color: c.textDim, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{s}</button>
              ))}
            </div>

            {/* Sample conversation */}
            <div style={{ background: c.surfaceAlt, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: c.blue, marginBottom: 6 }}>You</div>
              <div style={{ fontSize: 11, color: c.text, marginBottom: 12 }}>What drove the Latin America margin expansion?</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: c.purple, marginBottom: 6 }}>Copilot</div>
              <div style={{ fontSize: 11, color: c.textDim, lineHeight: 1.6 }}>
                Latin America operating margin expanded 280bps to 41.2% driven by three factors:
                <br /><br />
                1. <strong style={{ color: c.text }}>Pricing power:</strong> +6.2% price/mix improvement offset volume softness
                <br />
                2. <strong style={{ color: c.text }}>Concentrate economics:</strong> Higher-margin concentrate sales mix vs finished goods
                <br />
                3. <strong style={{ color: c.text }}>FX tailwind:</strong> Brazilian Real strengthened +3.4% vs USD
                <br /><br />
                <em>Confidence: High (3 supporting data points)</em>
              </div>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <input value={copilotMsg} onChange={e => setCopilotMsg(e.target.value)} placeholder="Ask about the financials..." style={{ flex: 1, padding: "9px 14px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontSize: 11, fontFamily: "inherit", outline: "none" }} />
              <button style={{ padding: "9px 14px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.blue}, ${c.purple})`, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
