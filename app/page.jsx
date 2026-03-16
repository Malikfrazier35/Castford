"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Line, Area, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LayoutDashboard, TrendingUp, MessageSquare, FileText, Layers, GitBranch, CheckSquare, Plug, Brain, Search, Bell, Sun, Moon, ChevronDown, ChevronRight, ArrowUpRight, ArrowDownRight, Zap, Shield, Users, DollarSign, Target, Activity, Send, Sparkles, Settings, LogOut, X } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// FINANCEOS — React Production Build
// Design: Zinc-black dark + optional light, DM Sans + JetBrains Mono
// Charts: Recharts (interactive hover, zoom)
// AI: Claude API with visible reasoning
// ═══════════════════════════════════════════════════════════════

const THEME = {
  dark: {
    bg: "#09090b", bg2: "#0c0c0f", surface: "#131316", surfaceAlt: "#1a1a1f",
    border: "#23232a", borderSub: "#1b1b20", borderBright: "#33333a",
    text: "#f0f2f5", textSec: "#9ca3b0", textDim: "#6b7280", textFaint: "#44495a",
    accent: "#38bdf8", accentDim: "rgba(56,189,248,0.08)", accentMid: "rgba(56,189,248,0.15)",
    green: "#34d399", greenDim: "rgba(52,211,153,0.08)",
    red: "#f87171", redDim: "rgba(248,113,113,0.08)",
    amber: "#fbbf24", amberDim: "rgba(251,191,36,0.08)",
    purple: "#a78bfa", purpleDim: "rgba(167,139,250,0.08)",
    cyan: "#22d3ee",
    // Depth system
    shadow1: "0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.15)",
    shadow2: "0 4px 12px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)",
    shadow3: "0 8px 30px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)",
    cardGlow: "0 0 0 1px rgba(56,189,248,0.06), 0 4px 16px rgba(0,0,0,0.2)",
    cardHoverGlow: "0 0 0 1px rgba(56,189,248,0.15), 0 8px 30px rgba(56,189,248,0.08), 0 4px 12px rgba(0,0,0,0.25)",
    sidebarBg: "linear-gradient(180deg, #0c0c0f 0%, #08080a 100%)",
  },
  light: {
    bg: "#f8f9fb", bg2: "#f0f1f4", surface: "#ffffff", surfaceAlt: "#f5f6f8",
    border: "#e2e4e9", borderSub: "#eaecf0", borderBright: "#d1d5db",
    text: "#0f1117", textSec: "#4b5563", textDim: "#6b7280", textFaint: "#9ca3af",
    accent: "#0284c7", accentDim: "rgba(2,132,199,0.06)", accentMid: "rgba(2,132,199,0.12)",
    green: "#059669", greenDim: "rgba(5,150,105,0.06)",
    red: "#dc2626", redDim: "rgba(220,38,38,0.06)",
    amber: "#d97706", amberDim: "rgba(217,119,6,0.06)",
    purple: "#7c3aed", purpleDim: "rgba(124,58,237,0.06)",
    cyan: "#0891b2",
    shadow1: "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
    shadow2: "0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
    shadow3: "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
    cardGlow: "0 0 0 1px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)",
    cardHoverGlow: "0 0 0 1px rgba(2,132,199,0.15), 0 8px 24px rgba(2,132,199,0.06), 0 4px 12px rgba(0,0,0,0.06)",
    sidebarBg: "linear-gradient(180deg, #f0f1f4 0%, #e8e9ed 100%)",
  },
};

// ── TOAST SYSTEM ──────────────────────────────────────────────
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, toast: add };
};

const ToastContainer = ({ toasts, c }) => (
  <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
    {toasts.map(t => {
      const bg = t.type === "success" ? c.green : t.type === "error" ? c.red : t.type === "warning" ? c.amber : c.accent;
      return (
        <div key={t.id} style={{
          padding: "10px 16px", borderRadius: 10, background: c.surface, border: `1px solid ${bg}40`,
          boxShadow: `0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px ${bg}20`, fontSize: 12, color: c.text,
          display: "flex", alignItems: "center", gap: 8, minWidth: 260, maxWidth: 380,
          animation: "toastIn 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: bg, flexShrink: 0 }} />
          {t.message}
        </div>
      );
    })}
  </div>
);

// ── KPI DETAIL DRAWER ────────────────────────────────────────
const DETAIL_DATA = {
  "ARR": { title: "Annual Recurring Revenue", value: "$48.6M", trend: [32,35,38,41,44,46,48.6], details: [
    { label: "New ARR (Q2)", value: "$6.2M", color: "green" }, { label: "Expansion ARR", value: "$4.2M", color: "green" },
    { label: "Churned ARR", value: "-$1.8M", color: "red" }, { label: "Net New ARR", value: "$8.6M", color: "accent" },
    { label: "Enterprise %", value: "76%", color: "text" }, { label: "Avg Contract", value: "$142K", color: "text" },
  ]},
  "NDR": { title: "Net Dollar Retention", value: "118%", trend: [108,110,112,114,116,117,118], details: [
    { label: "Gross Retention", value: "94.2%", color: "green" }, { label: "Expansion Rate", value: "23.8%", color: "green" },
    { label: "Downgrades", value: "4.1%", color: "amber" }, { label: "Logo Churn", value: "1.7%", color: "red" },
    { label: "Enterprise NDR", value: "126%", color: "accent" }, { label: "SMB NDR", value: "104%", color: "amber" },
  ]},
  "Gross Margin": { title: "Gross Margin", value: "84.7%", trend: [80,81,82,82.5,83,84,84.7], details: [
    { label: "Revenue", value: "$51.19M", color: "text" }, { label: "COGS", value: "$7.82M", color: "red" },
    { label: "Cloud Infra", value: "$4.84M", color: "amber" }, { label: "CS Team", value: "$2.18M", color: "text" },
    { label: "Margin Trend", value: "+2.1pp YoY", color: "green" }, { label: "Benchmark (p75)", value: "78%", color: "text" },
  ]},
  "Rule of 40": { title: "Rule of 40 Score", value: "52.1", trend: [38,40,42,44,46,48,50,52.1], details: [
    { label: "Revenue Growth", value: "44.7%", color: "green" }, { label: "EBITDA Margin", value: "7.4%", color: "green" },
    { label: "Growth Component", value: "44.7 pts", color: "accent" }, { label: "Profit Component", value: "7.4 pts", color: "accent" },
    { label: "Benchmark (p90)", value: "45", color: "text" }, { label: "Percentile", value: "Top 10%", color: "green" },
  ]},
  "Burn Multiple": { title: "Burn Multiple", value: "0.8x", trend: [1.4,1.3,1.2,1.1,1.0,0.9,0.85,0.8], details: [
    { label: "Net Burn", value: "$6.8M", color: "red" }, { label: "Net New ARR", value: "$8.6M", color: "green" },
    { label: "Burn / ARR", value: "0.8x", color: "green" }, { label: "Cash Runway", value: "34 months", color: "green" },
    { label: "Benchmark (good)", value: "<1.5x", color: "text" }, { label: "Trend", value: "Improving", color: "green" },
  ]},
  "Headcount": { title: "Headcount", value: "312", trend: [260,270,278,284,290,298,305,312], details: [
    { label: "Engineering", value: "128", color: "accent" }, { label: "Sales & Marketing", value: "84", color: "purple" },
    { label: "G&A", value: "52", color: "text" }, { label: "Customer Success", value: "48", color: "green" },
    { label: "Open Reqs", value: "22", color: "amber" }, { label: "Revenue per Head", value: "$164K", color: "text" },
  ]},
};

const DetailDrawer = ({ kpi, c, onClose }) => {
  const data = DETAIL_DATA[kpi] || DETAIL_DATA["ARR"];
  const colorMap = { green: c.green, red: c.red, amber: c.amber, accent: c.accent, text: c.text };
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 380, background: c.surface, borderLeft: `1px solid ${c.border}`,
      zIndex: 1000, boxShadow: "-8px 0 40px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column",
      animation: "drawerIn 0.25s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${c.borderSub}` }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{data.title}</span>
        <div onClick={onClose} style={{ cursor: "pointer", padding: 4 }}><X size={18} color={c.textDim} /></div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: c.accent, letterSpacing: "-0.03em", marginBottom: 4 }}>{data.value}</div>
        <div style={{ marginBottom: 20 }}>
          <Spark data={data.trend} color={c.green} width={320} height={48} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: c.textDim, marginBottom: 12 }}>Breakdown</div>
        {data.details.map(d => (
          <div key={d.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}` }}>
            <span style={{ fontSize: 12, color: c.textSec }}>{d.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: colorMap[d.color], fontFamily: "'JetBrains Mono', monospace" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── COMMAND PALETTE (⌘K) ─────────────────────────────────────
const CMD_ITEMS = [
  { id: "dashboard", label: "Go to Dashboard", section: "Navigate", icon: LayoutDashboard },
  { id: "copilot", label: "Open AI Copilot", section: "Navigate", icon: Brain },
  { id: "pnl", label: "View P&L Statement", section: "Navigate", icon: FileText },
  { id: "forecast", label: "Forecast Optimizer", section: "Navigate", icon: TrendingUp },
  { id: "consolidation", label: "Multi-Entity Consolidation", section: "Navigate", icon: Layers },
  { id: "close", label: "Close Tasks", section: "Navigate", icon: CheckSquare },
  { id: "integrations", label: "Integrations", section: "Navigate", icon: Plug },
  { id: "ask-revenue", label: "Ask: What drove the revenue beat?", section: "AI Copilot", icon: Sparkles },
  { id: "ask-benchmark", label: "Ask: Show benchmark scorecard", section: "AI Copilot", icon: Sparkles },
  { id: "ask-risk", label: "Ask: Top H2 risks", section: "AI Copilot", icon: Sparkles },
];

const CommandPalette = ({ c, onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query ? CMD_ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : CMD_ITEMS;
  let lastSection = "";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "15vh", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14,
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)", overflow: "hidden",
        animation: "cmdIn 0.15s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${c.borderSub}` }}>
          <Search size={16} color={c.textDim} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search views, ask AI, run commands..."
            onKeyDown={e => { if (e.key === "Escape") onClose(); if (e.key === "Enter" && filtered.length > 0) { onSelect(filtered[0]); onClose(); } }}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: c.text, fontSize: 14, fontFamily: "inherit" }}
          />
          <kbd style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: c.bg2, border: `1px solid ${c.borderSub}`, color: c.textDim }}>ESC</kbd>
        </div>
        <div style={{ maxHeight: 340, overflow: "auto", padding: "8px 0" }}>
          {filtered.map(item => {
            const showSection = item.section !== lastSection;
            lastSection = item.section;
            const Icon = item.icon;
            return (
              <div key={item.id}>
                {showSection && <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint, padding: "8px 18px 4px" }}>{item.section}</div>}
                <div onClick={() => { onSelect(item); onClose(); }} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 18px", cursor: "pointer", fontSize: 13, color: c.textSec, transition: "all 0.1s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = c.accentDim; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.textSec; }}
                >
                  <Icon size={15} strokeWidth={1.5} />
                  {item.label}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ padding: "20px 18px", fontSize: 12, color: c.textDim, textAlign: "center" }}>No results for "{query}"</div>}
        </div>
      </div>
    </div>
  );
};

// ── PERIODS ──────────────────────────────────────────────────
const PERIODS = ["FY2025 YTD", "Q2 2025", "Q1 2025", "FY2024", "Q4 2024"];

// ── DATA ──────────────────────────────────────────────────────
const REVENUE_DATA = [
  { month: "Jul", actual: 6800, budget: 6500, forecast: null },
  { month: "Aug", actual: 7100, budget: 6800, forecast: null },
  { month: "Sep", actual: 7600, budget: 7100, forecast: null },
  { month: "Oct", actual: 8000, budget: 7400, forecast: null },
  { month: "Nov", actual: 8500, budget: 7700, forecast: null },
  { month: "Dec", actual: 8800, budget: 8000, forecast: null },
  { month: "Jan", actual: null, budget: 8300, forecast: 9100 },
  { month: "Feb", actual: null, budget: 8600, forecast: 9400 },
  { month: "Mar", actual: null, budget: 8900, forecast: 9700 },
  { month: "Apr", actual: null, budget: 9200, forecast: 9900 },
  { month: "May", actual: null, budget: 9500, forecast: 10100 },
  { month: "Jun", actual: null, budget: 9800, forecast: 10400 },
];

const EXPENSE_DATA = [
  { name: "R&D", actual: 19270, budget: 19548, pct: 37.6 },
  { name: "S&M", actual: 15460, budget: 14730, pct: 30.2 },
  { name: "COGS", actual: 7820, budget: 7365, pct: 15.3 },
  { name: "G&A", actual: 4860, budget: 5115, pct: 9.5 },
];

const SEGMENT_DATA = [
  { name: "Enterprise", value: 38920, color: "#0ea5e9" },
  { name: "Mid-Market", value: 8650, color: "#a78bfa" },
  { name: "SMB", value: 3620, color: "#22d3ee" },
];

const KPIS = [
  { label: "ARR", value: "$48.6M", delta: "+24.1%", up: true, icon: DollarSign, spark: [32,35,33,38,41,44,46,48.6] },
  { label: "NDR", value: "118%", delta: "+4pp", up: true, icon: TrendingUp, spark: [108,110,112,114,115,116,117,118] },
  { label: "Gross Margin", value: "84.7%", delta: "+2.1pp", up: true, icon: Target, spark: [80,81,82,82.5,83,83.5,84,84.7] },
  { label: "Rule of 40", value: "52.1", delta: "+8.3", up: true, icon: Zap, spark: [38,40,42,44,46,48,50,52.1] },
  { label: "Burn Multiple", value: "0.8x", delta: "-0.3x", up: true, icon: Activity, spark: [1.4,1.3,1.2,1.1,1.0,0.9,0.85,0.8] },
  { label: "Headcount", value: "312", delta: "+28", up: true, icon: Users, spark: [260,270,278,284,290,298,305,312] },
];

const INSIGHTS = [
  { text: "Revenue beat $2.09M — Enterprise ACV ↑28%. AI module 34% attach.", source: "Variance Detective", time: "2 min", color: "#10b981" },
  { text: "S&M $730K over — Hiring $420K, events $180K. Pipeline ROI 7.2x.", source: "Variance Detective", time: "12 min", color: "#ef4444" },
  { text: "Mid-market win rate declining — Runway wins 58% H2H. Cycles 42→58d.", source: "Competitive Intel", time: "1 hr", color: "#f59e0b" },
  { text: "R&D 14 heads behind — 8 ML reqs open. AI v2 at risk if delayed.", source: "Workforce Agent", time: "3 hr", color: "#a78bfa" },
];

const PNL_DATA = [
  { section: "Revenue", rows: [
    { name: "Subscription Revenue", actual: 46420, budget: 44100, note: "Enterprise ACV ↑28%" },
    { name: "Professional Services", actual: 3180, budget: 3400, note: "Deferred 2 implementations" },
    { name: "Usage / AI Module", actual: 1590, budget: 1600, note: "34% attach, trending up" },
  ], total: { name: "Total Revenue", actual: 51190, budget: 49100 }},
  { section: "Cost of Revenue", rows: [
    { name: "Cloud Infrastructure", actual: 4840, budget: 4200, note: "GPU costs for AI ↑ $280K" },
    { name: "Customer Success", actual: 2180, budget: 2050, note: "2 CSMs hired early" },
    { name: "Support & Onboarding", actual: 800, budget: 1115, note: "Self-serve driving efficiency" },
  ], total: { name: "Total COGS", actual: 7820, budget: 7365 }},
  { section: "Operating Expenses", rows: [
    { name: "R&D — Engineering", actual: 14420, budget: 14650, note: "128 vs 142 planned" },
    { name: "R&D — Product", actual: 2850, budget: 2800, note: "1 PM hire" },
    { name: "R&D — Data/ML", actual: 2000, budget: 2098, note: "8 ML reqs still open" },
    { name: "Sales", actual: 8920, budget: 8200, note: "3 AEs early + commissions" },
    { name: "Marketing", actual: 4340, budget: 4530, note: "Paid digital cut -$200K" },
    { name: "Revenue Operations", actual: 2200, budget: 2000, note: "SaaStr $180K unplanned" },
    { name: "Finance & Legal", actual: 1860, budget: 1950, note: "Legal retainer -$65K" },
    { name: "People & Admin", actual: 1720, budget: 1850, note: "Deferred office $150K" },
    { name: "IT & Security", actual: 1280, budget: 1315, note: "SOC 2 completed" },
  ], total: { name: "Total OpEx", actual: 39590, budget: 39393 }},
];

const COPILOT_PROMPTS = [
  "What drove the revenue beat?",
  "Compare us vs Pigment",
  "Should we raise guidance?",
  "Show benchmark scorecard",
  "Top H2 risks",
  "Write a board summary",
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "Overview" },
  { id: "copilot", label: "AI Copilot", icon: Brain, section: "Overview" },
  { id: "pnl", label: "P&L Statement", icon: FileText, section: "Financial" },
  { id: "forecast", label: "Forecast", icon: TrendingUp, section: "Financial" },
  { id: "consolidation", label: "Consolidation", icon: Layers, section: "Financial" },
  { id: "models", label: "Scenarios", icon: GitBranch, section: "Planning" },
  { id: "close", label: "Close Tasks", icon: CheckSquare, section: "Planning" },
  { id: "integrations", label: "Integrations", icon: Plug, section: "Platform" },
  { id: "settings", label: "Settings", icon: Settings, section: "Platform" },
];

// ── HELPERS ───────────────────────────────────────────────────
const fmt = (n) => {
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `$${Math.round(n / 1e3).toLocaleString()}K`;
  return `$${n}`;
};
const fmtPct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
const variance = (actual, budget) => actual - budget;
const variancePct = (actual, budget) => ((actual - budget) / budget) * 100;
const isFavorable = (actual, budget, isRevenue = false) => isRevenue ? actual >= budget : actual <= budget;

// ── CUSTOM TOOLTIP ───────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, c }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
      <div style={{ fontWeight: 700, color: c.text, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ opacity: 0.7 }}>{p.name}</span>
          <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{typeof p.value === "number" ? fmt(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── SPARKLINE ────────────────────────────────────────────────
const Spark = ({ data, color, width = 64, height = 24 }) => {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ── KPI CARD ─────────────────────────────────────────────────
const KpiCard = ({ kpi, c, onClick, index = 0 }) => {
  const Icon = kpi.icon;
  return (
    <div onClick={onClick} style={{
      background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "20px 22px",
      cursor: "pointer", transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
      position: "relative", overflow: "hidden", boxShadow: c.cardGlow,
      animation: `fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${index * 0.06}s both`,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = c.cardHoverGlow; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = c.cardGlow; }}
    >
      {/* Subtle top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c.accent}00, ${c.accent}40, ${c.accent}00)`, opacity: 0.5 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: c.textFaint }}>{kpi.label}</div>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={14} color={c.accent} strokeWidth={2} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: c.text, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{kpi.value}</div>
          <div style={{
            fontSize: 11, fontWeight: 700, marginTop: 6, padding: "3px 8px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 3,
            color: kpi.up ? c.green : c.red, background: kpi.up ? c.greenDim : c.redDim,
            border: `1px solid ${kpi.up ? c.green : c.red}20`,
          }}>
            {kpi.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {kpi.delta}
          </div>
        </div>
        <Spark data={kpi.spark} color={kpi.up ? c.green : c.red} />
      </div>
    </div>
  );
};

// ── INSIGHT ROW ──────────────────────────────────────────────
const InsightRow = ({ item, c, onClick }) => (
  <div onClick={onClick} style={{
    display: "flex", gap: 12, alignItems: "flex-start", padding: "11px 14px",
    background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, borderRadius: 10,
    cursor: "pointer", transition: "all 0.15s", marginBottom: 8,
    borderLeft: `3px solid ${item.color}`, boxShadow: c.shadow1,
    position: "relative",
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.borderLeftColor = item.color; e.currentTarget.style.boxShadow = c.shadow2; e.currentTarget.style.transform = "translateX(2px)"; }}
  onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; e.currentTarget.style.boxShadow = c.shadow1; e.currentTarget.style.transform = "none"; }}
  >
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12.5, color: c.text, lineHeight: 1.55, fontWeight: 500 }}>{item.text}</div>
      <div style={{ fontSize: 10, color: c.textDim, marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontWeight: 600 }}>{item.source}</span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.textFaint, display: "inline-block" }} />
        <span>{item.time} ago</span>
      </div>
    </div>
    <ChevronRight size={14} color={c.textFaint} style={{ flexShrink: 0, marginTop: 2 }} />
  </div>
);

// ══════════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ══════════════════════════════════════════════════════════════
const DashboardView = ({ c, onNav, toast, onDrawer }) => (
  <div style={{ padding: 32 }}>
    {/* Welcome header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, Sarah</div>
        <div style={{ fontSize: 13, color: c.textDim, marginTop: 4 }}>Here's your financial snapshot for {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ padding: "8px 14px", borderRadius: 8, background: c.surfaceAlt, border: `1px solid ${c.border}`, fontSize: 11, color: c.textSec, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }} onClick={() => onNav("copilot")}>
          <Sparkles size={13} color={c.purple} /> Ask AI
        </div>
      </div>
    </div>

    {/* KPI Grid */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      {KPIS.map((k, i) => <KpiCard key={k.label} kpi={k} c={c} onClick={() => onDrawer(k.label)} index={i} />)}
    </div>

    {/* Charts Row */}
    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 24 }}>
      {/* Revenue Chart */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${c.border}, transparent)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={13} color={c.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: c.textDim }}>Revenue — Actual vs Budget vs Forecast</span>
          </div>
          <span style={{ fontSize: 10, color: c.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>$K</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={REVENUE_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
            <defs>
              <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.accent} stopOpacity={0.15} /><stop offset="100%" stopColor={c.accent} stopOpacity={0} /></linearGradient>
              <linearGradient id="gFc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.green} stopOpacity={0.1} /><stop offset="100%" stopColor={c.green} stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid stroke={c.borderSub} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: c.textDim }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: c.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}M`} />
            <Tooltip content={<ChartTooltip c={c} />} />
            <Area type="monotone" dataKey="actual" stroke={c.accent} fill="url(#gAct)" strokeWidth={2.5} name="Actual" dot={{ r: 3, fill: c.accent }} connectNulls={false} />
            <Line type="monotone" dataKey="budget" stroke={c.textDim} strokeWidth={1} strokeDasharray="4 4" name="Budget" dot={false} />
            <Area type="monotone" dataKey="forecast" stroke={c.green} fill="url(#gFc)" strokeWidth={2} strokeDasharray="6 3" name="Forecast" dot={{ r: 3, fill: c.green }} connectNulls={false} />
            {/* Today marker */}
            <Line type="monotone" dataKey={() => null} stroke="none" />
          </ComposedChart>
        </ResponsiveContainer>
        {/* Chart legend with today indicator */}
        <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 10, color: c.textDim, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 16, height: 2.5, background: c.accent, borderRadius: 1, display: "inline-block" }} /> Actual</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 16, height: 1, background: c.textDim, borderRadius: 1, display: "inline-block", borderTop: "1px dashed " + c.textDim }} /> Budget</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 16, height: 2, background: c.green, borderRadius: 1, display: "inline-block", opacity: 0.7 }} /> Forecast</span>
          <span style={{ marginLeft: "auto", fontWeight: 600, color: c.accent }}>Today: Jun 2025</span>
        </div>
      </div>

      {/* Segment Donut */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${c.border}, transparent)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: c.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Target size={13} color={c.purple} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: c.textDim }}>Revenue by Segment</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={SEGMENT_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
              {SEGMENT_DATA.map((s, i) => <Cell key={i} fill={s.color} />)}
            </Pie>
            <Tooltip content={<ChartTooltip c={c} />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
          {SEGMENT_DATA.map(s => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                <span style={{ color: c.textSec }}>{s.name}</span>
              </div>
              <span style={{ fontWeight: 700, color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(s.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Expense Bars + Insights */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Expense Breakdown */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${c.border}, transparent)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: c.amberDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={13} color={c.amber} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: c.textDim }}>OpEx Breakdown — Actual vs Budget</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={EXPENSE_DATA} layout="vertical" margin={{ top: 0, right: 5, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={c.borderSub} strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: c.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: c.textSec }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<ChartTooltip c={c} />} />
            <Bar dataKey="actual" fill={c.accent} radius={[0, 4, 4, 0]} barSize={14} name="Actual" />
            <Bar dataKey="budget" fill={c.textFaint} radius={[0, 4, 4, 0]} barSize={14} name="Budget" opacity={0.4} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights Feed */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${c.purple}30, transparent)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: c.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={13} color={c.purple} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: c.textDim }}>AI Insights</span>
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: c.purpleDim, color: c.purple, border: `1px solid ${c.purple}20` }}>4 active</div>
        </div>
        {INSIGHTS.map((ins, i) => <InsightRow key={i} item={ins} c={c} onClick={() => onNav("copilot")} />)}
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// COPILOT VIEW
// ══════════════════════════════════════════════════════════════
const COPILOT_RESPONSES = {
  "revenue": "Revenue beat of +$2.09M (+4.3%) is driven entirely by enterprise outperformance.\n\n**Enterprise (>$100K ACV):** +$3.3M above plan (+16.9%)\n• ACV expansion: avg deal up 28% ($142K → $182K)\n• AI module attach: 34% of new deals (vs 12% planned)\n• Three unplanned $300K+ deals from inbound\n\n**Mid-market ($25K-$100K):** -$800K below plan (-4.2%)\n**SMB (<$25K):** -$400K below plan (-3.8%)\n\nNDR at 118% — expansion contributing $4.2M above initial contracts.\n\n**Recommendation:** Double down on enterprise AI module. Investigate mid-market win rate decline vs Runway.",
  "pigment": "**Acme vs Pigment — Head to Head**\n\nScale: Pigment ~$80M ARR vs our $48.6M (they're ~1.6x).\nWin rate: We win 42% of competitive deals. Was 35% two quarters ago — improving.\n\n**Where we win:**\n• Visible AI reasoning — they don't have this\n• Published pricing ($499-$3,999/mo flat vs their opaque $65K+ entry)\n• Self-serve onboarding (days vs 3-6 month implementation)\n\n**Where they win:**\n• Fortune 500 logos and enterprise references\n• Module breadth (workforce planning, SPM)\n• Larger partner ecosystem\n\nOur Rule of 40 (52.1) vs estimated 40-45 for Pigment.\n\n**Recommendation:** Focus positioning on AI transparency and TCO. Build customer advisory board for enterprise proof points.",
  "guidance": "**Raise guidance to $52-54M.**\n\nThe math:\n• YTD actual: $51.19M (+$2.09M vs plan)\n• Current run rate: $52.8M full year\n• Enterprise pipeline weighted at $38M in stages 3-5\n\nWhy it's structural:\n• Enterprise ACV up 28% — pricing power, not luck\n• AI module at 34% attach creates new revenue layer\n• NDR at 118% means base compounds\n\nScenario range:\n• Bear: $50.5M (mid-market worsens)\n• Base: $52.8M (current trajectory)\n• Bull: $54.2M (Q4 flush + AI v2)\n\n**Recommendation:** Present $52-54M range to board. Pair with competitive SWAT team request.",
  "default": "I have Acme's full financials, SaaS metrics, benchmarks, and competitive data loaded. That's a great question — let me analyze the data.\n\nBased on the current performance:\n• Revenue: $51.19M YTD (+4.3% vs plan)\n• Gross margin: 84.7%\n• Rule of 40: 52.1 (top quartile)\n• NDR: 118%\n\nWant me to drill deeper into any specific metric or run a scenario analysis?",
};

const CopilotView = ({ c, toast }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome to FinanceOS AI Copilot.\n\nI have Acme's full financials, SaaS metrics, benchmarks, and competitive data loaded. Ask me anything and I'll show my reasoning before answering.\n\n**6 active variances** — Revenue +$2.09M, S&M and Cloud over. Rule of 40 at 52.1 (top quartile)." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  const send = useCallback(async () => {
    if (!input.trim() || thinking) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setThinking(true);

    // Try real Claude API first, fall back to demo responses
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are the FinanceOS AI Copilot for Acme SaaS Corp. You have access to their full financials: Revenue $51.19M YTD (+4.3% vs $49.1M plan), Gross Margin 84.7%, EBITDA $3.78M (7.4% margin), ARR $48.6M, NDR 118%, Rule of 40: 52.1, Headcount 312. Enterprise ACV up 28% ($142K→$182K), AI module 34% attach rate. S&M $730K over budget (3 AEs hired early + SaaStr $180K). R&D 14 heads behind plan. Mid-market win rate declining vs Runway (they win 58% H2H). Competitors: Pigment (~$80M ARR, $100K+ pricing), Runway (a16z backed, $30-100K), Anaplan ($200K+ enterprise). Be specific with numbers. Format with **bold headers** and bullet points starting with •. Keep answers concise but data-rich.",
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("\n") || "I couldn't process that request.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      // Demo fallback
      const q = userMsg.toLowerCase();
      let response = COPILOT_RESPONSES.default;
      if (q.includes("revenue") || q.includes("beat") || q.includes("what drove")) response = COPILOT_RESPONSES.revenue;
      else if (q.includes("pigment") || q.includes("competitor") || q.includes("compare")) response = COPILOT_RESPONSES.pigment;
      else if (q.includes("guidance") || q.includes("raise") || q.includes("should we")) response = COPILOT_RESPONSES.guidance;
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: response }]);
        setThinking(false);
      }, 800);
      return;
    }
    setThinking(false);
  }, [input, thinking]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Prompt suggestions */}
      <div style={{ padding: "12px 20px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {COPILOT_PROMPTS.map(p => (
          <button key={p} onClick={() => { setInput(p); }} style={{
            fontSize: 10, padding: "5px 10px", borderRadius: 6, border: `1px solid ${c.border}`,
            background: c.surfaceAlt, color: c.textSec, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; }}
          >{p}</button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%",
            padding: m.role === "user" ? "12px 18px" : "16px 20px",
            borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            background: m.role === "user" ? c.accentMid : `${c.surface}dd`,
            border: `1px solid ${m.role === "user" ? c.accent + "40" : c.border}`,
            boxShadow: m.role === "user" ? "none" : c.shadow1,
            backdropFilter: m.role === "assistant" ? "blur(8px)" : "none",
            fontSize: 13, lineHeight: 1.75, color: c.text, whiteSpace: "pre-wrap",
          }}>
            {m.role === "assistant" && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, fontSize: 10, color: c.purple, fontWeight: 700, letterSpacing: "0.02em" }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: c.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={10} color={c.purple} />
              </div>
              FinanceOS Copilot
            </div>}
            {m.content.split("\n").map((line, j) => {
              if (line.startsWith("**") && line.endsWith("**")) return <div key={j} style={{ fontWeight: 700, color: c.text, marginTop: 8, marginBottom: 2, fontSize: 13.5 }}>{line.replace(/\*\*/g, "")}</div>;
              if (line.match(/^\*\*.*\*\*$/)) return <div key={j} style={{ fontWeight: 700, color: c.text, marginTop: 8, marginBottom: 2 }}>{line.replace(/\*\*/g, "")}</div>;
              if (line.startsWith("• ")) return <div key={j} style={{ paddingLeft: 14, color: c.textSec, position: "relative", marginBottom: 2 }}><span style={{ position: "absolute", left: 0, color: c.accent }}>•</span>{line.slice(2)}</div>;
              return <div key={j}>{line || <br />}</div>;
            })}
          </div>
        ))}
        {thinking && (
          <div style={{
            alignSelf: "flex-start", padding: "14px 20px", borderRadius: "16px 16px 16px 4px",
            background: `${c.surface}dd`, border: `1px solid ${c.border}`, boxShadow: c.shadow1,
            backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: c.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={10} color={c.purple} />
            </div>
            <span style={{ fontSize: 12, color: c.textDim }}>Analyzing financials...</span>
            <div style={{ display: "flex", gap: 3 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: c.purple, opacity: 0.5, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "14px 24px", borderTop: `1px solid ${c.border}`, display: "flex", gap: 10, background: `${c.bg2}cc`, backdropFilter: "blur(8px)" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about forecasts, variance, scenarios..."
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface,
            color: c.text, fontSize: 13, outline: "none", fontFamily: "inherit", transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={e => { e.target.style.borderColor = c.accent; e.target.style.boxShadow = `0 0 0 3px ${c.accent}15`; }}
          onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }}
        />
        <button onClick={send} style={{
          background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, border: "none", borderRadius: 10, padding: "12px 20px", color: "#fff",
          fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
          boxShadow: `0 4px 12px ${c.accent}30`, transition: "transform 0.1s, box-shadow 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${c.accent}40`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 12px ${c.accent}30`; }}
        >
          <Send size={14} /> Send
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// P&L VIEW
// ══════════════════════════════════════════════════════════════
const PnlView = ({ c, onNav }) => {
  const [collapsed, setCollapsed] = useState({});
  const toggle = (section) => setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));

  const VarCell = ({ actual, budget, revenue = false }) => {
    const v = variance(actual, budget);
    const vp = variancePct(actual, budget);
    const fav = revenue ? v >= 0 : v <= 0;
    return (
      <td style={{ textAlign: "right", padding: "7px 12px", fontWeight: 600, color: fav ? c.green : c.red, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}
        onClick={() => onNav("copilot")}
        onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
        onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
      >
        {v >= 0 ? "+" : ""}{fmt(v)}
      </td>
    );
  };

  return (
    <div style={{ padding: 32, overflow: "auto" }}>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${c.borderBright}` }}>
              {["Line Item", "Actual", "Budget", "Variance", "% Rev", "Notes"].map(h => (
                <th key={h} style={{
                  padding: "10px 12px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em",
                  color: c.textDim, textAlign: h === "Line Item" || h === "Notes" ? "left" : "right",
                  background: c.bg2, position: "sticky", top: 0, zIndex: 2,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PNL_DATA.map((section, si) => {
              const isRev = si === 0;
              const isCollapsed = collapsed[section.section];
              return [
                <tr key={`sec-${si}`} onClick={() => toggle(section.section)} style={{ cursor: "pointer", background: c.bg2 }}>
                  <td colSpan={6} style={{ padding: "10px 12px", fontWeight: 800, fontSize: 12.5, color: c.text, borderBottom: `2px solid ${c.borderBright}` }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                      {section.section}
                    </span>
                  </td>
                </tr>,
                ...(!isCollapsed ? section.rows.map((row, ri) => (
                  <tr key={`row-${si}-${ri}`} style={{ borderBottom: `1px solid ${c.borderSub}`, background: ri % 2 === 1 ? `${c.surfaceAlt}60` : "transparent", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = c.accentMid || c.accentDim}
                    onMouseLeave={e => e.currentTarget.style.background = ri % 2 === 1 ? `${c.surfaceAlt}60` : "transparent"}
                  >
                    <td style={{ padding: "9px 14px 9px 32px", color: c.text, fontWeight: 500 }}>{row.name}</td>
                    <td style={{ textAlign: "right", padding: "9px 14px", color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(row.actual)}</td>
                    <td style={{ textAlign: "right", padding: "9px 14px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(row.budget)}</td>
                    <VarCell actual={row.actual} budget={row.budget} revenue={isRev} />
                    <td style={{ textAlign: "right", padding: "9px 14px", color: c.textDim, fontSize: 11 }}>{((row.actual / 51190) * 100).toFixed(1)}%</td>
                    <td style={{ padding: "9px 14px", color: c.textDim, fontSize: 10 }}>{row.note}</td>
                  </tr>
                )) : []),
                !isCollapsed && (
                  <tr key={`tot-${si}`} style={{ borderTop: `2px solid ${c.borderBright}`, borderBottom: `2px solid ${c.borderBright}` }}>
                    <td style={{ padding: "8px 12px", fontWeight: 700, color: c.text }}>{section.total.name}</td>
                    <td style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700, color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(section.total.actual)}</td>
                    <td style={{ textAlign: "right", padding: "8px 12px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(section.total.budget)}</td>
                    <VarCell actual={section.total.actual} budget={section.total.budget} revenue={isRev} />
                    <td style={{ textAlign: "right", padding: "8px 12px", color: c.textDim, fontSize: 11 }}>{((section.total.actual / 51190) * 100).toFixed(1)}%</td>
                    <td />
                  </tr>
                ),
              ];
            }).flat().filter(Boolean)}
            {/* Grand totals */}
            <tr style={{ borderTop: `3px double ${c.textDim}` }}>
              <td style={{ padding: "10px 12px", fontWeight: 800, fontSize: 13, color: c.text }}>Gross Profit</td>
              <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(43370)}</td>
              <td style={{ textAlign: "right", padding: "10px 12px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(41735)}</td>
              <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700, color: c.green, fontFamily: "'JetBrains Mono', monospace" }}>+{fmt(1635)}</td>
              <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 800, color: c.text }}>84.7%</td>
              <td />
            </tr>
            <tr style={{ borderTop: `3px double ${c.textDim}` }}>
              <td style={{ padding: "10px 12px", fontWeight: 800, fontSize: 13, color: c.text }}>EBITDA</td>
              <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(3780)}</td>
              <td style={{ textAlign: "right", padding: "10px 12px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(2342)}</td>
              <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 700, color: c.green, fontFamily: "'JetBrains Mono', monospace" }}>+{fmt(1438)}</td>
              <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 800, color: c.text }}>7.4%</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// FORECAST OPTIMIZER VIEW
// ══════════════════════════════════════════════════════════════
const FORECAST_DATA = [
  { month: "Jan", actual: 6800, base: null, bull: null, bear: null },
  { month: "Feb", actual: 7100, base: null, bull: null, bear: null },
  { month: "Mar", actual: 7600, base: null, bull: null, bear: null },
  { month: "Apr", actual: 8000, base: null, bull: null, bear: null },
  { month: "May", actual: 8500, base: null, bull: null, bear: null },
  { month: "Jun", actual: 8800, base: 8800, bull: 8800, bear: 8800 },
  { month: "Jul", actual: null, base: 9100, bull: 9400, bear: 8700 },
  { month: "Aug", actual: null, base: 9400, bull: 9900, bear: 8800 },
  { month: "Sep", actual: null, base: 9700, bull: 10500, bear: 8900 },
  { month: "Oct", actual: null, base: 9900, bull: 11000, bear: 8950 },
  { month: "Nov", actual: null, base: 10100, bull: 11400, bear: 9000 },
  { month: "Dec", actual: null, base: 10400, bull: 11900, bear: 9050 },
];

const DRIVERS = [
  { name: "Pipeline weighted value", shap: 34.2 },
  { name: "NDR expansion rate", shap: 22.8 },
  { name: "Enterprise ACV trend", shap: 14.1 },
  { name: "AI module attach rate", shap: 11.6 },
  { name: "Sales cycle length", shap: 8.3 },
  { name: "Logo churn rate", shap: 4.9 },
  { name: "Macro index (ext.)", shap: 2.8 },
  { name: "Seasonal pattern", shap: 1.3 },
];

const ForecastView = ({ c }) => {
  const [ndr, setNdr] = useState(118);
  const [pipeline, setPipeline] = useState(40);
  const [churn, setChurn] = useState(82);
  const [retrained, setRetrained] = useState(false);
  const [retraining, setRetraining] = useState(false);

  const base = 62.8;
  const ndrImpact = (ndr - 118) * 0.35;
  const pipeImpact = (pipeline - 40) * 0.2;
  const churnImpact = (churn / 10 - 8.2) * -0.5;
  const scenario = base + ndrImpact + pipeImpact + churnImpact;
  const delta = scenario - base;

  const handleRetrain = () => {
    setRetraining(true);
    setTimeout(() => { setRetraining(false); setRetrained(true); setTimeout(() => setRetrained(false), 3000); }, 2000);
  };

  return (
    <div style={{ padding: 32 }}>
      {/* Model info badges */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["ML: ETS + XGBoost + Linear ensemble", "MAPE: 3.2%", "14 drivers + 3 external signals", "Last trained 6h ago"].map(b => (
          <span key={b} style={{ fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, color: c.textSec }}>{b}</span>
        ))}
        <button onClick={handleRetrain} disabled={retraining} style={{
          fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "inherit",
          background: retraining ? c.amber : retrained ? c.green : c.purple, color: "#fff",
        }}>{retraining ? "Training..." : retrained ? "MAPE → 2.9%" : "Retrain Model"}</button>
      </div>

      {/* Chart */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: c.textDim, marginBottom: 14 }}>
          Revenue Forecast — 12-Month with Scenarios ($K)
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={FORECAST_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
            <defs>
              <linearGradient id="gBull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.green} stopOpacity={0.08} /><stop offset="100%" stopColor={c.green} stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid stroke={c.borderSub} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: c.textDim }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: c.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}M`} />
            <Tooltip content={<ChartTooltip c={c} />} />
            <Area type="monotone" dataKey="bull" stroke="none" fill="url(#gBull)" name="Bull Case" />
            <Line type="monotone" dataKey="actual" stroke={c.accent} strokeWidth={2.5} name="Actual" dot={{ r: 3, fill: c.accent }} connectNulls={false} />
            <Line type="monotone" dataKey="base" stroke={c.green} strokeWidth={2} strokeDasharray="6 3" name="Base Forecast" dot={{ r: 3, fill: c.green }} connectNulls={false} />
            <Line type="monotone" dataKey="bull" stroke={c.green} strokeWidth={1} strokeDasharray="3 3" name="Bull" dot={false} connectNulls={false} opacity={0.5} />
            <Line type="monotone" dataKey="bear" stroke={c.red} strokeWidth={1} strokeDasharray="3 3" name="Bear" dot={false} connectNulls={false} opacity={0.5} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Driver importance */}
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: c.textDim, marginBottom: 12 }}>
            Top Drivers (SHAP Importance)
          </div>
          {DRIVERS.map((d, i) => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: i < 5 ? c.text : c.textDim, flex: 1 }}>{i + 1}. {d.name}</span>
              <div style={{ width: 80, height: 6, background: c.bg2, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${d.shap}%`, height: "100%", background: i < 3 ? c.accent : i < 5 ? c.cyan : c.textFaint, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: i < 5 ? c.accent : c.textDim, fontFamily: "'JetBrains Mono', monospace", width: 40, textAlign: "right" }}>{d.shap}%</span>
            </div>
          ))}
        </div>

        {/* Assumption sliders */}
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: c.textDim, marginBottom: 12 }}>
            Adjust Key Assumptions
          </div>
          {[
            { label: "NDR Rate", value: ndr, set: setNdr, min: 95, max: 140, unit: "%", color: c.accent },
            { label: "Pipeline Conversion", value: pipeline, set: setPipeline, min: 15, max: 65, unit: "%", color: c.cyan },
            { label: "Logo Churn", value: churn / 10, set: v => setChurn(v * 10), min: 2, max: 20, unit: "%", color: c.amber, raw: churn, setRaw: setChurn, minR: 20, maxR: 200 },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: c.textSec }}>{s.label}</span>
                <span style={{ color: s.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{s.label === "Logo Churn" ? (churn / 10).toFixed(1) : s.value}{s.unit}</span>
              </div>
              <input type="range" min={s.minR || s.min} max={s.maxR || s.max} value={s.raw || s.value}
                onChange={e => (s.setRaw || s.set)(Number(e.target.value))}
                style={{ width: "100%", height: 4, accentColor: s.color }} />
            </div>
          ))}
          {/* Scenario result */}
          <div style={{ padding: 12, background: c.bg2, borderRadius: 8, marginTop: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: c.purple, marginBottom: 4 }}>Scenario Forecast</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.text }}>${scenario.toFixed(1)}M</div>
            <div style={{ fontSize: 11, color: delta >= 0 ? c.green : c.red, fontWeight: 600 }}>
              {delta >= 0 ? "+" : ""}${Math.abs(delta).toFixed(1)}M vs base
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// CONSOLIDATION VIEW
// ══════════════════════════════════════════════════════════════
const ENTITIES = [
  { name: "Acme US", revenue: 38920, ebitda: 3120, hc: 218, currency: "USD", status: "Closed", ic: -1200, fx: null },
  { name: "Acme EU", revenue: 8650, ebitda: 520, hc: 62, currency: "EUR → USD", status: "In Review", ic: 0, fx: -142 },
  { name: "Acme APAC", revenue: 3620, ebitda: 140, hc: 32, currency: "SGD → USD", status: "Pending", ic: 0, fx: 38 },
];

const CONS_PNL = [
  { line: "Revenue", us: 38920, eu: 8650, apac: 3620, elim: 0, cons: 51190 },
  { line: "COGS", us: 5940, eu: 1280, apac: 600, elim: 0, cons: 7820 },
  { line: "IC Services", us: 820, eu: 280, apac: 100, elim: -1200, cons: 0 },
  { line: "OpEx", us: 29860, eu: 6850, apac: 2880, elim: 0, cons: 39590 },
  { line: "FX Adjustment", us: null, eu: -142, apac: 38, elim: 0, cons: -104 },
  { line: "EBITDA", us: 3120, eu: 520, apac: 140, elim: 0, cons: 3780 },
];

const ConsolidationView = ({ c, onNav, toast }) => {
  const [entityStatus, setEntityStatus] = useState({});
  const statusColors = { "Closed": c.green, "In Review": c.accent, "Pending": c.amber };

  const approve = (name) => {
    setEntityStatus(prev => ({ ...prev, [name]: "closing" }));
    setTimeout(() => {
      setEntityStatus(prev => ({ ...prev, [name]: "Closed" }));
      toast(`${name} approved and closed`, "success");
    }, 1200);
  };

  return (
    <div style={{ padding: 32 }}>
      {/* Entity cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        {ENTITIES.map(e => {
          const st = entityStatus[e.name] || e.status;
          const closing = st === "closing";
          const displayStatus = closing ? "Closing..." : st;
          return (
            <div key={e.name} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, boxShadow: c.cardGlow }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{e.name}</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: `${(statusColors[displayStatus] || c.textDim)}18`, color: statusColors[displayStatus] || c.textDim }}>{displayStatus}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: c.text, marginBottom: 4 }}>{fmt(e.revenue)}</div>
              <div style={{ fontSize: 10, color: c.textDim, marginBottom: 10 }}>Revenue · {((e.revenue / 51190) * 100).toFixed(1)}% of consolidated</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 10, marginBottom: 10 }}>
                <div><span style={{ color: c.textDim }}>EBITDA</span><br /><span style={{ color: c.green, fontWeight: 700 }}>{fmt(e.ebitda)}</span></div>
                <div><span style={{ color: c.textDim }}>Headcount</span><br /><span style={{ color: c.text, fontWeight: 700 }}>{e.hc}</span></div>
                <div><span style={{ color: c.textDim }}>Currency</span><br /><span style={{ color: c.text, fontWeight: 700 }}>{e.currency}</span></div>
                <div><span style={{ color: c.textDim }}>{e.fx !== null ? "FX Impact" : "IC Elims"}</span><br /><span style={{ color: e.fx !== null ? (e.fx >= 0 ? c.green : c.red) : c.amber, fontWeight: 700 }}>{e.fx !== null ? `${e.fx >= 0 ? "+" : ""}$${Math.abs(e.fx)}K` : `${fmt(e.ic)}`}</span></div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {(st !== "Closed" && !closing) && (
                  <button onClick={() => approve(e.name)} style={{ flex: 1, fontSize: 10, padding: "7px 0", borderRadius: 6, border: "none", background: c.green, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Approve & Close</button>
                )}
                <button onClick={() => onNav("pnl")} style={{ flex: 1, fontSize: 10, padding: "7px 0", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Drill →</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consolidated P&L */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${c.borderSub}` }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: c.textDim }}>Consolidated P&L — Eliminations Applied</span>
          <span style={{ fontSize: 9, color: c.purple, fontWeight: 700 }}>Auto-eliminated $1.2M IC transactions</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.borderSub}` }}>
              {["Line", "Acme US", "Acme EU", "Acme APAC", "Eliminations", "Consolidated"].map((h, i) => (
                <th key={h} style={{ padding: "8px 12px", fontSize: 10, fontWeight: 700, color: i === 4 ? c.red : i === 5 ? c.accent : c.textDim, textAlign: i === 0 ? "left" : "right" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONS_PNL.map((r, i) => {
              const isTotal = r.line === "EBITDA";
              return (
                <tr key={r.line} style={{ borderBottom: `1px solid ${c.borderSub}`, ...(isTotal ? { borderTop: `2px solid ${c.borderBright}` } : {}) }}>
                  <td style={{ padding: "7px 12px", fontWeight: isTotal ? 800 : 600, color: c.text }}>{r.line}</td>
                  {[r.us, r.eu, r.apac, r.elim, r.cons].map((v, j) => (
                    <td key={j} style={{ textAlign: "right", padding: "7px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: j === 4 || isTotal ? 700 : 400, color: j === 3 ? c.red : j === 4 ? c.accent : isTotal ? c.green : c.textSec }}>
                      {v === null ? "—" : v === 0 && j === 3 ? "$0" : `${v < 0 ? "-" : ""}$${Math.abs(v).toLocaleString()}K`}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// CLOSE TASKS VIEW
// ══════════════════════════════════════════════════════════════
const CLOSE_TASKS = [
  { id: 1, task: "Reconcile bank accounts (3 accounts)", owner: "Sarah Chen", status: "done", due: "Mar 3" },
  { id: 2, task: "Review accrued expenses > $10K", owner: "Mike Rodriguez", status: "done", due: "Mar 4" },
  { id: 3, task: "Post depreciation entries", owner: "Sarah Chen", status: "progress", due: "Mar 5" },
  { id: 4, task: "Intercompany eliminations review", owner: "David Park", status: "progress", due: "Mar 5" },
  { id: 5, task: "Revenue recognition — ASC 606 review", owner: "Sarah Chen", status: "progress", due: "Mar 6" },
  { id: 6, task: "Finalize headcount report", owner: "Talent Ops", status: "notstarted", due: "Mar 7" },
  { id: 7, task: "Close sub-ledgers (AP/AR/FA)", owner: "Mike Rodriguez", status: "notstarted", due: "Mar 7" },
  { id: 8, task: "Management review sign-off", owner: "CFO", status: "notstarted", due: "Mar 8" },
];

const CloseView = ({ c, toast }) => {
  const [tasks, setTasks] = useState(CLOSE_TASKS);

  const complete = (id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "done" } : t));
    if (task) toast(`Completed: ${task.task}`, "success");
  };
  const doneCount = tasks.filter(t => t.status === "done").length;
  const pct = Math.round((doneCount / tasks.length) * 100);
  const statusLabel = { done: "Complete", progress: "In Progress", notstarted: "Not Started" };
  const statusColor = { done: c.green, progress: c.accent, notstarted: c.textFaint };

  return (
    <div style={{ padding: 32 }}>
      {/* Progress bar */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, marginBottom: 24, boxShadow: c.cardGlow }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>February Close — {pct}% Complete</span>
          <span style={{ fontSize: 11, color: c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{doneCount}/{tasks.length} tasks</span>
        </div>
        <div style={{ height: 10, background: c.bg2, borderRadius: 5, overflow: "hidden", boxShadow: `inset 0 1px 3px ${c.bg}` }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${c.accent}, ${c.green})`, borderRadius: 5, transition: "width 0.5s ease", boxShadow: `0 0 12px ${c.accent}40` }} />
        </div>
      </div>

      {/* Task list */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden" }}>
        {tasks.map((t, i) => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
            borderBottom: i < tasks.length - 1 ? `1px solid ${c.borderSub}` : "none",
            opacity: t.status === "done" ? 0.55 : 1, cursor: t.status !== "done" ? "pointer" : "default",
            transition: "opacity 0.3s, background 0.15s",
          }}
          onClick={() => t.status !== "done" && complete(t.id)}
          onMouseEnter={e => { if (t.status !== "done") e.currentTarget.style.background = c.accentDim; }}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 6, border: `2px solid ${t.status === "done" ? c.green : c.border}`,
              background: t.status === "done" ? c.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.2s",
            }}>
              {t.status === "done" && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: c.text, textDecoration: t.status === "done" ? "line-through" : "none" }}>{t.task}</div>
              <div style={{ fontSize: 10, color: c.textDim, marginTop: 2 }}>{t.owner} · Due {t.due}</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: `${statusColor[t.status]}15`, color: statusColor[t.status] }}>{statusLabel[t.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// INTEGRATIONS VIEW
// ══════════════════════════════════════════════════════════════
const CONNECTORS = [
  { name: "NetSuite", cat: "ERP", status: "connected", records: "847K", color: "#0C9ADA" },
  { name: "Salesforce", cat: "CRM", status: "connected", records: "124K", color: "#00A1E0" },
  { name: "Stripe", cat: "Billing", status: "connected", records: "38K", color: "#635BFF" },
  { name: "Rippling", cat: "HRIS", status: "connected", records: "312", color: "#FE6847" },
  { name: "Snowflake", cat: "Data Warehouse", status: "connected", records: "2.1M", color: "#29B5E8" },
  { name: "HubSpot", cat: "CRM", status: "connected", records: "89K", color: "#FF7A59" },
  { name: "Ramp", cat: "Expenses", status: "connected", records: "5.2K", color: "#007A5E" },
  { name: "QuickBooks", cat: "ERP", status: "available", records: null, color: "#2CA01C" },
  { name: "Xero", cat: "ERP", status: "available", records: null, color: "#13B5EA" },
  { name: "Workday", cat: "HRIS", status: "available", records: null, color: "#0875E1" },
  { name: "Google Sheets", cat: "Files", status: "available", records: null, color: "#34A853" },
  { name: "Slack", cat: "Notifications", status: "available", records: null, color: "#4A154B" },
];

const IntegrationsView = ({ c, toast }) => {
  const [conns, setConns] = useState(CONNECTORS);
  const [filter, setFilter] = useState("all");
  const cats = ["all", ...new Set(CONNECTORS.map(co => co.cat))];

  const toggleConnect = (name) => {
    const conn = conns.find(co => co.name === name);
    const wasConnected = conn?.status === "connected";
    setConns(prev => prev.map(co => co.name === name ? { ...co, status: wasConnected ? "available" : "connected", records: wasConnected ? null : "Syncing..." } : co));
    toast(wasConnected ? `Disconnected ${name}` : `Connected ${name} — syncing records...`, wasConnected ? "warning" : "success");
  };

  const filtered = filter === "all" ? conns : conns.filter(co => co.cat === filter);

  return (
    <div style={{ padding: 32 }}>
      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        {[{ label: "Connected", value: conns.filter(co => co.status === "connected").length, color: c.green }, { label: "Available", value: conns.filter(co => co.status === "available").length, color: c.textDim }, { label: "Total Records", value: "3.2M+", color: c.accent }].map(s => (
          <div key={s.label} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 10, padding: "12px 20px" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: c.textDim }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            fontSize: 11, padding: "6px 14px", borderRadius: 6, border: `1px solid ${filter === cat ? c.accent : c.border}`,
            background: filter === cat ? c.accentDim : "transparent", color: filter === cat ? c.accent : c.textSec,
            cursor: "pointer", fontFamily: "inherit", fontWeight: 600, textTransform: "capitalize",
          }}>{cat}</button>
        ))}
      </div>

      {/* Connector grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(co => (
          <div key={co.name} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, boxShadow: c.cardGlow, transition: "border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = co.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = c.border}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${co.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: co.color }}>{co.name[0]}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{co.name}</div>
                <div style={{ fontSize: 10, color: c.textDim }}>{co.cat}</div>
              </div>
            </div>
            {co.status === "connected" && (
              <div style={{ fontSize: 10, color: c.green, fontWeight: 600, marginBottom: 8 }}>● Connected · {co.records} records</div>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => toggleConnect(co.name)} style={{
                flex: 1, fontSize: 10, padding: "7px 0", borderRadius: 6, border: "none", fontFamily: "inherit", fontWeight: 700, cursor: "pointer",
                background: co.status === "connected" ? c.redDim : c.green, color: co.status === "connected" ? c.red : "#fff",
              }}>{co.status === "connected" ? "Disconnect" : "Connect"}</button>
              {co.status === "connected" && (
                <button style={{ fontSize: 10, padding: "7px 12px", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit" }}>Sync</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SCENARIOS VIEW
// ══════════════════════════════════════════════════════════════
const SCENARIOS_LIST = [
  { name: "Base Case", revenue: 62.8, opex: 39.6, ebitda: 7.4, status: "Active", updated: "Mar 12" },
  { name: "Aggressive Hiring", revenue: 62.8, opex: 44.2, ebitda: 2.8, status: "Draft", updated: "Mar 10" },
  { name: "AI Module Breakout", revenue: 68.4, opex: 41.0, ebitda: 11.6, status: "Draft", updated: "Mar 8" },
  { name: "Mid-Market Recovery", revenue: 66.1, opex: 40.8, ebitda: 9.5, status: "Draft", updated: "Mar 5" },
];

const ScenariosView = ({ c }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: c.textSec }}>{SCENARIOS_LIST.length} scenarios · Compare up to 4 side-by-side</div>
        <button style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ New Scenario</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {SCENARIOS_LIST.map((s, i) => (
          <div key={s.name} onClick={() => setSelected(i === selected ? null : i)} style={{
            background: c.surface, border: `1px solid ${selected === i ? c.accent : c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow,
            cursor: "pointer", transition: "border-color 0.15s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{s.name}</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: s.status === "Active" ? c.greenDim : c.surfaceAlt, color: s.status === "Active" ? c.green : c.textDim }}>{s.status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[{ label: "Revenue", value: s.revenue, color: c.text }, { label: "OpEx", value: s.opex, color: c.amber }, { label: "EBITDA Margin", value: s.ebitda, color: s.ebitda > 5 ? c.green : c.red }].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 9, color: c.textDim, textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>${m.value}M</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 9, color: c.textFaint, marginTop: 8 }}>Updated {s.updated}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SETTINGS VIEW (minimal)
// ══════════════════════════════════════════════════════════════
const SettingsView = ({ c }) => (
  <div style={{ padding: 32, maxWidth: 640 }}>
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow, marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 12 }}>Organization</div>
      {[{ label: "Company", value: "Acme SaaS Corp" }, { label: "Fiscal Year End", value: "December 31" }, { label: "Currency", value: "USD" }, { label: "Plan", value: "Growth — $1,499/mo billed annually" }].map(f => (
        <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 12 }}>
          <span style={{ color: c.textDim }}>{f.label}</span>
          <span style={{ color: c.text, fontWeight: 600 }}>{f.value}</span>
        </div>
      ))}
    </div>
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 12 }}>Billing</div>
      <div style={{ fontSize: 12, color: c.textSec, lineHeight: 1.7, marginBottom: 12 }}>Your Growth plan renews annually on January 15. Next charge: $17,988. Payment method: Visa ending 4242.</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit" }}>Manage Subscription</button>
        <button style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit" }}>View Invoices</button>
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════
export default function FinanceOS() {
  const [view, setView] = useState("dashboard");
  const [prevView, setPrevView] = useState(null);
  const [mode, setMode] = useState("dark");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [drawerKpi, setDrawerKpi] = useState(null);
  const [period, setPeriod] = useState("FY2025 YTD");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [navHistory, setNavHistory] = useState(["dashboard"]);
  const { toasts, toast } = useToast();
  const c = THEME[mode];

  // Navigation with history tracking
  const navigate = useCallback((v) => {
    setPrevView(view);
    setView(v);
    setNavHistory(prev => {
      const next = [...prev];
      const idx = next.indexOf(v);
      if (idx >= 0) return next.slice(0, idx + 1);
      return [...next, v];
    });
  }, [view]);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(true); }
      if (e.key === "Escape") { setCmdOpen(false); setDrawerKpi(null); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleCmd = (item) => {
    if (item.id.startsWith("ask-")) { navigate("copilot"); }
    else { navigate(item.id); }
  };

  const viewTitles = { dashboard: "Dashboard", copilot: "AI Copilot", pnl: "P&L Statement", forecast: "Forecast Optimizer", consolidation: "Multi-Entity Consolidation", models: "Scenario Models", close: "Close Tasks", integrations: "Integrations", settings: "Settings" };

  let currentSection = "";

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", background: c.bg, color: c.text, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${c.borderBright}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${c.textFaint}; }
        input[type="range"] { cursor: pointer; }
        input[type="range"]::-webkit-slider-thumb { cursor: pointer; }
        ::selection { background: ${c.accentMid || c.accentDim}; }
        @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes cmdIn { from { opacity: 0; transform: scale(0.96) translateY(-8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .view-fade { animation: fadeIn 0.25s ease-out; }
        .noise-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 9998; opacity: 0.018; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
      `}</style>
      {/* Subtle noise texture for depth */}
      <div className="noise-overlay" />

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 230, minHeight: "100vh", background: c.sidebarBg,
        borderRight: `1px solid ${c.border}`, display: "flex", flexDirection: "column", flexShrink: 0,
        boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
      }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${c.borderSub}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #0ea5e9, #7c3aed)", fontSize: 14, fontWeight: 900, color: "#fff",
              boxShadow: "0 4px 12px rgba(14,165,233,0.25)",
            }}>F</div>
            <div>
              <span style={{ fontWeight: 800, fontSize: 15, color: c.text, letterSpacing: "-0.3px" }}>FinanceOS</span>
              <div style={{ fontSize: 9, color: c.textFaint, marginTop: 1 }}>Acme SaaS Corp · FY2025</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "8px 0", overflow: "auto" }}>
          {NAV_ITEMS.map(item => {
            const showSection = item.section !== currentSection;
            currentSection = item.section;
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <div key={item.id}>
                {showSection && (
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, padding: "16px 18px 6px" }}>
                    {item.section}
                  </div>
                )}
                <div onClick={() => navigate(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", margin: "1px 10px", cursor: "pointer",
                  fontSize: 13, fontWeight: active ? 600 : 400, borderRadius: 8,
                  color: active ? c.text : c.textDim,
                  background: active ? c.accentMid : "transparent",
                  boxShadow: active ? `0 0 0 1px ${c.accent}20, inset 0 1px 0 ${c.accent}10` : "none",
                  transition: "all 0.15s cubic-bezier(0.22,1,0.36,1)",
                  position: "relative",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = c.textSec; e.currentTarget.style.background = `${c.accent}06`; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = c.textDim; e.currentTarget.style.background = "transparent"; }}}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 1.5} />
                  {item.label}
                  {item.id === "copilot" && <Sparkles size={10} color={c.purple} style={{ marginLeft: "auto" }} />}
                  {item.id === "close" && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: c.amberDim, color: c.amber }}>3</span>}
                  {item.id === "dashboard" && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: c.redDim, color: c.red }}>4</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Theme + User */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${c.borderSub}` }}>
          <div onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8,
            cursor: "pointer", fontSize: 12, color: c.textSec, transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {mode === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {mode === "dark" ? "Light Mode" : "Dark Mode"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginTop: 4 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #10b981, #22d3ee)", fontSize: 10, fontWeight: 700, color: "#fff",
            }}>SC</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: c.text }}>Sarah Chen</div>
              <div style={{ fontSize: 9, color: c.textDim }}>VP Finance</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {/* Ambient gradient orbs — inspired by bg-themes mesh gradients */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}06 0%, transparent 70%)`, filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: "50%", height: "50%", borderRadius: "50%", background: `radial-gradient(circle, ${c.purple}05 0%, transparent 70%)`, filter: "blur(80px)" }} />
        </div>

        {/* Topbar — frosted glass */}
        <div style={{
          height: 56, borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 28px", flexShrink: 0,
          background: `${c.bg2}cc`, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          position: "relative", zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Breadcrumb */}
            {navHistory.length > 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginRight: 4 }}>
                {navHistory.slice(0, -1).map((v, i) => (
                  <span key={i}>
                    <span onClick={() => navigate(v)} style={{ fontSize: 11, color: c.textDim, cursor: "pointer", transition: "color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = c.accent}
                      onMouseLeave={e => e.currentTarget.style.color = c.textDim}
                    >{viewTitles[v]}</span>
                    <span style={{ fontSize: 10, color: c.textFaint, margin: "0 4px" }}>/</span>
                  </span>
                ))}
              </div>
            )}
            <span style={{ fontSize: 16, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>{viewTitles[view]}</span>
            {/* Period selector */}
            <div style={{ position: "relative" }}>
              <div onClick={() => setPeriodOpen(!periodOpen)} style={{
                fontSize: 10, color: c.textDim, padding: "4px 10px", borderRadius: 4, background: c.surfaceAlt,
                border: `1px solid ${c.borderSub}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
              }}>
                {period} <ChevronDown size={10} />
              </div>
              {periodOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, overflow: "hidden", zIndex: 100, boxShadow: "0 8px 30px rgba(0,0,0,0.3)", minWidth: 140 }}>
                  {PERIODS.map(p => (
                    <div key={p} onClick={() => { setPeriod(p); setPeriodOpen(false); toast(`Period changed to ${p}`); }} style={{
                      padding: "8px 14px", fontSize: 11, color: p === period ? c.accent : c.textSec, cursor: "pointer",
                      background: p === period ? c.accentDim : "transparent", fontWeight: p === period ? 700 : 400,
                    }}
                    onMouseEnter={e => { if (p !== period) e.currentTarget.style.background = c.surfaceAlt; }}
                    onMouseLeave={e => { if (p !== period) e.currentTarget.style.background = "transparent"; }}
                    >{p}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => setCmdOpen(true)} style={{
              display: "flex", alignItems: "center", gap: 6, background: c.surfaceAlt, border: `1px solid ${c.border}`,
              borderRadius: 8, padding: "6px 12px", fontSize: 12, color: c.textDim, width: 200, cursor: "pointer", transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = c.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = c.border}
            >
              <Search size={13} /> Search... <kbd style={{ marginLeft: "auto", fontSize: 9, padding: "1px 5px", borderRadius: 3, background: c.bg2, border: `1px solid ${c.borderSub}`, color: c.textFaint }}>⌘K</kbd>
            </div>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => toast("4 unread notifications", "info")}>
              <Bell size={18} color={c.textDim} />
              <div style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: c.red }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div key={view} className="view-fade" style={{ flex: 1, overflow: "auto", background: "transparent", position: "relative", zIndex: 1 }}>
          {view === "dashboard" && <DashboardView c={c} onNav={navigate} toast={toast} onDrawer={setDrawerKpi} />}
          {view === "copilot" && <CopilotView c={c} toast={toast} />}
          {view === "pnl" && <PnlView c={c} onNav={navigate} />}
          {view === "forecast" && <ForecastView c={c} />}
          {view === "consolidation" && <ConsolidationView c={c} onNav={navigate} toast={toast} />}
          {view === "models" && <ScenariosView c={c} />}
          {view === "close" && <CloseView c={c} toast={toast} />}
          {view === "integrations" && <IntegrationsView c={c} toast={toast} />}
          {view === "settings" && <SettingsView c={c} />}
        </div>
      </div>

      {/* ── OVERLAYS ── */}
      {drawerKpi && <DetailDrawer kpi={drawerKpi} c={c} onClose={() => setDrawerKpi(null)} />}
      {cmdOpen && <CommandPalette c={c} onSelect={handleCmd} onClose={() => setCmdOpen(false)} />}
      <ToastContainer toasts={toasts} c={c} />
    </div>
  );
}
