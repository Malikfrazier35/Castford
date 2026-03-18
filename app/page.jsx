"use client";
import { useState, useEffect, useRef, useCallback, Component } from "react";
import { Line, Area, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LayoutDashboard, TrendingUp, MessageSquare, FileText, Layers, GitBranch, CheckSquare, Plug, Brain, Search, Bell, Sun, Moon, ChevronDown, ChevronRight, ArrowUpRight, ArrowDownRight, Zap, Shield, Users, DollarSign, Target, Activity, Send, Sparkles, Settings, LogOut, X, Check, Globe, Eye, Cpu } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ── SUPABASE CLIENT ──────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://crecesswagluelvkesul.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTI5NzYsImV4cCI6MjA4OTM4ODk3Nn0.IGEEYDStt-eH9Mf2G_DzqCPfruDjN8m_ORtAcmtSAZg";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    flowType: "implicit",
  },
});

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
    accent: "#60a5fa", accentDim: "rgba(96,165,250,0.08)", accentMid: "rgba(96,165,250,0.15)",
    green: "#34d399", greenDim: "rgba(52,211,153,0.08)",
    red: "#f87171", redDim: "rgba(248,113,113,0.08)",
    amber: "#fbbf24", amberDim: "rgba(251,191,36,0.08)",
    purple: "#a78bfa", purpleDim: "rgba(167,139,250,0.08)",
    cyan: "#22d3ee",
    // Depth system
    shadow1: "0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.15)",
    shadow2: "0 4px 12px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)",
    shadow3: "0 8px 30px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)",
    cardGlow: "0 0 0 1px rgba(96,165,250,0.06), 0 4px 16px rgba(0,0,0,0.2)",
    cardHoverGlow: "0 0 0 1px rgba(96,165,250,0.15), 0 8px 30px rgba(96,165,250,0.08), 0 4px 12px rgba(0,0,0,0.25)",
    sidebarBg: "linear-gradient(180deg, #0c0c0f 0%, #08080a 100%)",
  },
  light: {
    bg: "#f7f8fa", bg2: "#eef0f4", surface: "#ffffff", surfaceAlt: "#f3f4f7",
    border: "#dfe2e8", borderSub: "#e8eaef", borderBright: "#cdd1d8",
    text: "#0c0e14", textSec: "#3d4455", textDim: "#5c6478", textFaint: "#8b92a5",
    accent: "#0369a1", accentDim: "rgba(3,105,161,0.06)", accentMid: "rgba(3,105,161,0.12)",
    green: "#047857", greenDim: "rgba(4,120,87,0.06)",
    red: "#b91c1c", redDim: "rgba(185,28,28,0.06)",
    amber: "#b45309", amberDim: "rgba(180,83,9,0.06)",
    purple: "#6d28d9", purpleDim: "rgba(109,40,217,0.06)",
    cyan: "#0e7490",
    shadow1: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
    shadow2: "0 4px 14px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)",
    shadow3: "0 10px 35px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)",
    cardGlow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)",
    cardHoverGlow: "0 8px 28px rgba(3,105,161,0.08), 0 0 0 1px rgba(3,105,161,0.12), 0 4px 14px rgba(0,0,0,0.06)",
    sidebarBg: "linear-gradient(180deg, #eef0f4 0%, #e4e6eb 100%)",
  },
};

// ── SECTION BOUNDARY (Tier 2 Error Recovery) ────────────────
// Wraps chart panels and data tables so one crash doesn't kill the dashboard
class SectionBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, retries: 0 }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      const canRetry = this.state.retries < 3;
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 32, minHeight: 120, borderRadius: 14, textAlign: "center",
          background: this.props.bg || "transparent", border: `1px dashed ${this.props.borderColor || "#23232a"}`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: this.props.textColor || "#6b7280", marginBottom: 6 }}>
            {this.props.name || "This section"} could not load
          </div>
          <div style={{ fontSize: 11, color: this.props.dimColor || "#44495a", marginBottom: 12 }}>
            Other panels are unaffected. {canRetry ? "Try refreshing this section." : "Please refresh the page."}
          </div>
          {canRetry ? (
            <button onClick={() => this.setState(prev => ({ hasError: false, retries: prev.retries + 1 }))}
              style={{ fontSize: 11, padding: "7px 16px", borderRadius: 6, background: this.props.accentColor || "#60a5fa", color: "#fff", fontWeight: 700, fontFamily: "inherit", border: "none", cursor: "pointer" }}>
              Retry
            </button>
          ) : (
            <a href="/" style={{ fontSize: 11, padding: "7px 16px", borderRadius: 6, background: this.props.accentColor || "#60a5fa", color: "#fff", fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
              Refresh Page
            </a>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

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
  { id: "admin", label: "Admin Console", section: "Navigate", icon: Shield },
  { id: "investor", label: "Investor Metrics", section: "Navigate", icon: Target },
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
  { label: "ARR", value: "$48.6M", delta: "+24.1%", up: true, icon: DollarSign, spark: [32,35,33,38,41,44,46,48.6], accent: "accent" },
  { label: "NDR", value: "118%", delta: "+4pp", up: true, icon: TrendingUp, spark: [108,110,112,114,115,116,117,118], accent: "green" },
  { label: "Gross Margin", value: "84.7%", delta: "+2.1pp", up: true, icon: Target, spark: [80,81,82,82.5,83,83.5,84,84.7], accent: "cyan" },
  { label: "Rule of 40", value: "52.1", delta: "+8.3", up: true, icon: Zap, spark: [38,40,42,44,46,48,50,52.1], accent: "purple" },
  { label: "Burn Multiple", value: "0.8x", delta: "-0.3x", up: true, icon: Activity, spark: [1.4,1.3,1.2,1.1,1.0,0.9,0.85,0.8], accent: "amber" },
  { label: "Headcount", value: "312", delta: "+28", up: true, icon: Users, spark: [260,270,278,284,290,298,305,312], accent: "accent" },
];

const INSIGHTS = [
  { text: "Revenue beat $2.09M — Enterprise ACV ↑28%. AI module 34% attach.", source: "Variance Detective", time: "2 min", color: "#34d399" },
  { text: "S&M $730K over — Hiring $420K, events $180K. Pipeline ROI 7.2x.", source: "Variance Detective", time: "12 min", color: "#f87171" },
  { text: "Mid-market win rate declining — Runway wins 58% H2H. Cycles 42→58d.", source: "Competitive Intel", time: "1 hr", color: "#fbbf24" },
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
  "Rule of 40 breakdown",
  "NDR by segment",
  "Top H2 risks",
  "Write a board summary",
  "Burn multiple trend",
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
  { id: "admin", label: "Admin", icon: Shield, section: "Platform" },
  { id: "investor", label: "Investor Metrics", icon: Target, section: "Platform" },
  { id: "settings", label: "Settings", icon: Settings, section: "Platform" },
];

// ── LOADING SKELETON ────────────────────────────────────────
const Skeleton = ({ c, width = "100%", height = 12, radius = 6 }) => (
  <div style={{
    width, height, borderRadius: radius, background: `linear-gradient(90deg, ${c.surfaceAlt} 25%, ${c.bg2} 50%, ${c.surfaceAlt} 75%)`,
    backgroundSize: "200% 100%", animation: "shimmer 1.5s ease-in-out infinite",
  }} />
);

const LoadingSkeleton = ({ c }) => (
  <div style={{ padding: 32 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      {[0,1,2,3,4,5].map(i => (
        <div key={i} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22 }}>
          <Skeleton c={c} width={80} height={10} />
          <div style={{ height: 12 }} />
          <Skeleton c={c} width={120} height={28} />
          <div style={{ height: 8 }} />
          <Skeleton c={c} width={60} height={14} />
        </div>
      ))}
    </div>
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, marginBottom: 24 }}>
      <Skeleton c={c} width={200} height={12} />
      <div style={{ height: 16 }} />
      <Skeleton c={c} height={200} radius={8} />
    </div>
  </div>
);

// ── EMPTY STATE ─────────────────────────────────────────────
const EmptyState = ({ c, icon: Icon, title, sub, cta, onAction }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", textAlign: "center" }}>
    <div style={{ width: 56, height: 56, borderRadius: 16, background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <Icon size={24} color={c.accent} strokeWidth={1.5} />
    </div>
    <div style={{ fontSize: 16, fontWeight: 700, color: c.text, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13, color: c.textDim, maxWidth: 360, lineHeight: 1.6, marginBottom: 20 }}>{sub}</div>
    {cta && <button onClick={onAction} style={{ fontSize: 12, padding: "10px 20px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 12px ${c.accent}30` }}>{cta}</button>}
  </div>
);

// ── EXPORT BAR ──────────────────────────────────────────────
// ── CSV/PDF Export Helper ─────────────────────────────────────
const downloadCSV = (filename, headers, rows) => {
  const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const ExportBar = ({ c, title, onCSV, onPDF }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
    <span style={{ fontSize: 16, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>{title}</span>
    <div style={{ display: "flex", gap: 6 }}>
      {[{ label: "Export CSV", fn: onCSV }, { label: "Export PDF", fn: onPDF }].map(b => (
        <button key={b.label} onClick={b.fn} style={{ fontSize: 10, padding: "6px 12px", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; }}
        >{b.label}</button>
      ))}
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// ENV 1: DYNAMIC BUTTON PIPELINE
// ══════════════════════════════════════════════════════════════
const BTN_VARIANTS = {
  primary: (c) => ({ bg: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, color: "#fff", border: "none", shadow: `0 4px 14px ${c.accent}30`, hoverShadow: `0 6px 20px ${c.accent}40` }),
  secondary: (c) => ({ bg: "transparent", color: c.textSec, border: `1px solid ${c.border}`, shadow: "none", hoverShadow: c.shadow1 }),
  ghost: (c) => ({ bg: "transparent", color: c.textDim, border: "none", shadow: "none", hoverShadow: "none" }),
  danger: (c) => ({ bg: c.redDim, color: c.red, border: `1px solid ${c.red}30`, shadow: "none", hoverShadow: `0 4px 14px ${c.red}20` }),
  success: (c) => ({ bg: c.green, color: "#fff", border: "none", shadow: `0 4px 14px ${c.green}30`, hoverShadow: `0 6px 20px ${c.green}40` }),
};

const Btn = ({ children, variant = "primary", size = "md", loading, disabled, onClick, c, style = {}, icon: Icon }) => {
  const [ripple, setRipple] = useState(null);
  const v = BTN_VARIANTS[variant]?.(c) || BTN_VARIANTS.primary(c);
  const sizes = { sm: { fontSize: 11, padding: "6px 14px", borderRadius: 6 }, md: { fontSize: 12, padding: "9px 18px", borderRadius: 8 }, lg: { fontSize: 14, padding: "12px 24px", borderRadius: 10 } };
  const s = sizes[size];
  const isDisabled = disabled || loading;

  const handleClick = (e) => {
    if (isDisabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y, id: Date.now() });
    setTimeout(() => setRipple(null), 500);
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} disabled={isDisabled} style={{
      ...s, fontFamily: "inherit", fontWeight: 700, cursor: isDisabled ? "not-allowed" : "pointer",
      background: v.bg, color: v.color, border: v.border, boxShadow: v.shadow,
      display: "inline-flex", alignItems: "center", gap: 6, position: "relative", overflow: "hidden",
      opacity: isDisabled ? 0.5 : 1, transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
      ...style,
    }}
    onMouseEnter={e => { if (!isDisabled) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = v.hoverShadow; }}}
    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = v.shadow; }}
    onFocus={e => { e.currentTarget.style.outline = `2px solid ${c.accent}`; e.currentTarget.style.outlineOffset = "2px"; }}
    onBlur={e => { e.currentTarget.style.outline = "none"; }}
    >
      {ripple && <span style={{ position: "absolute", left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.25)", animation: "rippleOut 0.5s ease-out forwards", pointerEvents: "none" }} />}
      {loading && <span style={{ width: 14, height: 14, border: `2px solid ${v.color}40`, borderTopColor: v.color, borderRadius: "50%", animation: "spin 0.6s linear infinite", flexShrink: 0 }} />}
      {!loading && Icon && <Icon size={s.fontSize} strokeWidth={2} />}
      {children}
    </button>
  );
};

// ══════════════════════════════════════════════════════════════
// ENV 2: AI DIGITAL-INTELLIGENCE PIPELINE
// ══════════════════════════════════════════════════════════════
const AI_SYSTEM_PROMPT = `You are FinanceOS AI Copilot for Acme SaaS Corp. You have complete access to their financials.

KEY METRICS (FY2025 YTD):
- Revenue: $51.19M (+4.3% vs $49.1M plan)
- Gross Margin: 84.7% | EBITDA: $3.78M (7.4% margin)
- ARR: $48.6M | NDR: 118% | Rule of 40: 52.1
- Headcount: 312 (128 Eng, 84 S&M, 52 G&A, 48 CS)
- Burn Multiple: 0.8x | Cash Runway: 34 months

SEGMENT PERFORMANCE:
- Enterprise (>$100K ACV): +$3.3M above plan (+16.9%), ACV $142K->$182K (+28%)
- Mid-market ($25K-$100K): -$800K below plan (-4.2%), win rate declining vs Runway
- SMB (<$25K): -$400K below plan (-3.8%)
- AI module attach rate: 34% (vs 12% planned)

EXPENSE VARIANCES:
- S&M: $730K over (3 AEs hired early $420K + SaaStr $180K + SDR tools $130K)
- R&D: $280K under (14 heads behind plan, 8 ML reqs open)
- Cloud: $640K over (GPU costs for AI training)
- G&A: On plan

COMPETITIVE INTEL:
- Pigment: ~$80M ARR, $65K+ entry, we win 42% H2H (improving from 35%)
- Runway: a16z backed, $30-100K, wins 58% mid-market H2H
- Anaplan: $200K+ enterprise, 3-6mo implementation
- Our moats: visible AI reasoning, published pricing, self-serve onboarding

BOARD CONTEXT:
- Next board meeting: Q3 review
- Current guidance: $49.1M (should raise to $52-54M)
- Key ask: Competitive SWAT team budget ($200K)
- Risk: Mid-market Runway threat, R&D hiring delay

RESPONSE FORMAT:
- Use **bold** for section headers
- Use bullet points starting with bullet character
- Include specific numbers — never round without stating you rounded
- Keep responses under 300 words unless asked for a deep dive
- End complex answers with a **Recommendation:** section`;

const INSIGHT_SEVERITY = { high: { color: "red", label: "HIGH" }, medium: { color: "amber", label: "MED" }, low: { color: "green", label: "LOW" } };

const AI_INSIGHTS_ENRICHED = [
  { text: "Revenue beat $2.09M — Enterprise ACV up 28%. AI module 34% attach.", source: "Variance Detective", time: "2 min", color: "#34d399", severity: "low", action: "Review enterprise pipeline" },
  { text: "S&M $730K over — Hiring $420K, events $180K. Pipeline ROI 7.2x.", source: "Variance Detective", time: "12 min", color: "#f87171", severity: "high", action: "Approve or defer Q3 hiring" },
  { text: "Mid-market win rate declining — Runway wins 58% H2H. Cycles 42 to 58d.", source: "Competitive Intel", time: "1 hr", color: "#fbbf24", severity: "high", action: "Deploy competitive SWAT" },
  { text: "R&D 14 heads behind — 8 ML reqs open. AI v2 at risk if delayed.", source: "Workforce Agent", time: "3 hr", color: "#a78bfa", severity: "medium", action: "Escalate to VP Eng" },
];

// ══════════════════════════════════════════════════════════════
// ENV 3: CORPORATE WORKFLOW AUTOMATION PIPELINE
// ══════════════════════════════════════════════════════════════
const WORKFLOW_STATES = ["pending", "in_review", "approved", "closed"];
const WORKFLOW_COLORS = { pending: "amber", in_review: "accent", approved: "green", closed: "textDim" };

const useWorkflow = (initialTasks) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [auditLog, setAuditLog] = useState([]);

  const transition = useCallback((taskId, newStatus, actor = "Sarah Chen") => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t));
    setAuditLog(prev => [...prev, { taskId, newStatus, actor, timestamp: new Date().toISOString(), id: Date.now() }]);
  }, []);

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === "done" || t.status === "closed" || t.status === "approved").length,
    pending: tasks.filter(t => t.status === "pending" || t.status === "notstarted").length,
    inProgress: tasks.filter(t => t.status === "progress" || t.status === "in_review").length,
  };
  stats.pct = Math.round((stats.done / stats.total) * 100);

  return { tasks, setTasks, transition, auditLog, stats };
};

const NotificationBadge = ({ count, c, color = "red" }) => {
  if (!count) return null;
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, minWidth: 16, height: 16, padding: "0 4px",
      borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: c[color], color: "#fff", boxShadow: `0 2px 6px ${c[color]}40`,
      animation: count > 0 ? "pulse 2s infinite" : "none",
    }}>{count > 99 ? "99+" : count}</span>
  );
};

const AuditEntry = ({ entry, c }) => (
  <div style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 11, alignItems: "flex-start" }}>
    <div style={{ width: 6, height: 6, borderRadius: "50%", background: c[WORKFLOW_COLORS[entry.newStatus]] || c.textDim, marginTop: 5, flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <span style={{ color: c.text, fontWeight: 600 }}>{entry.actor}</span>
      <span style={{ color: c.textDim }}> changed task #{entry.taskId} to </span>
      <span style={{ color: c[WORKFLOW_COLORS[entry.newStatus]] || c.accent, fontWeight: 600 }}>{entry.newStatus.replace("_", " ")}</span>
    </div>
    <span style={{ fontSize: 9, color: c.textFaint, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
      {new Date(entry.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
    </span>
  </div>
);

// ══════════════════════════════════════════════════════════════
// ENV 5: CUSTOMER DESKTOP PLATFORM
// ══════════════════════════════════════════════════════════════
const OfflineIndicator = ({ c }) => {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    setOnline(navigator.onLine);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  if (online) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000, padding: "8px 0", textAlign: "center", fontSize: 11, fontWeight: 700, background: c.amber, color: "#000", letterSpacing: "0.02em" }}>
      You are offline. Changes will sync when connection is restored.
    </div>
  );
};

const PWAInstallPrompt = ({ c }) => {
  const [prompt, setPrompt] = useState(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setPrompt(e); setShow(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  if (!show) return null;
  return (
    <div style={{ position: "fixed", bottom: 80, right: 20, zIndex: 9999, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "16px 20px", boxShadow: c.shadow3, maxWidth: 280, animation: "fadeSlideUp 0.3s ease-out" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 4 }}>Install FinanceOS</div>
      <div style={{ fontSize: 11, color: c.textDim, marginBottom: 12, lineHeight: 1.5 }}>Add to your desktop for instant access — works offline.</div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={() => { prompt?.prompt(); setShow(false); }} style={{ fontSize: 11, padding: "7px 14px", borderRadius: 6, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Install</button>
        <button onClick={() => setShow(false)} style={{ fontSize: 11, padding: "7px 14px", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.textDim, cursor: "pointer", fontFamily: "inherit" }}>Later</button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// ENV 7: LIVE DEMO PIPELINE
// ══════════════════════════════════════════════════════════════
const DemoBanner = ({ c, onNav }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "7px 16px",
    background: `linear-gradient(90deg, ${c.accent}15, ${c.purple}10)`, borderBottom: `1px solid ${c.accent}20`,
    fontSize: 11, color: c.textSec, flexShrink: 0,
  }}>
    <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: c.accentDim, color: c.accent, letterSpacing: "0.06em" }}>DEMO</span>
    <span>You are viewing sample data for <strong style={{ color: c.text }}>Acme SaaS Corp</strong>. Connect your own data to get started.</span>
    <span onClick={() => onNav("integrations")} style={{ fontSize: 10, color: c.accent, fontWeight: 700, cursor: "pointer" }}>Connect ERP</span>
  </div>
);

const FeatureTooltip = ({ text, c, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", padding: "8px 12px", borderRadius: 8, background: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow2, fontSize: 11, color: c.text, whiteSpace: "nowrap", zIndex: 100, animation: "fadeIn 0.15s" }}>
          {text}
          <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 8, height: 4, background: c.surface, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// ENV 8: AUTOSAVE/PREFERENCE AUTOMATION
// ══════════════════════════════════════════════════════════════
// ── RESPONSIVE HOOK ──────────────────────────────────────────
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
};

const usePreferences = (key, defaultVal) => {
  const [value, setValue] = useState(defaultVal);
  const [hydrated, setHydrated] = useState(false);
  // Read from localStorage AFTER hydration to prevent SSR mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`fos_${key}`);
      if (stored !== null) setValue(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, [key]);
  // Persist changes (but not the initial hydration read)
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(`fos_${key}`, JSON.stringify(value)); } catch {}
  }, [key, value, hydrated]);
  return [value, setValue];
};

// ══════════════════════════════════════════════════════════════
// ENV 9: PREMIUM DASHBOARD FUNCTIONS — Quick Actions
// ══════════════════════════════════════════════════════════════
const QuickActions = ({ c, onNav, toast }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
    {[
      { label: "New Forecast", icon: TrendingUp, action: () => onNav("forecast"), color: c.accent },
      { label: "Run Variance", icon: Search, action: () => onNav("copilot"), color: c.purple },
      { label: "Export P&L", icon: FileText, action: () => { onNav("pnl"); toast("P&L ready for export", "success"); }, color: c.green },
      { label: "Close Tasks", icon: CheckSquare, action: () => onNav("close"), color: c.amber },
    ].map(a => (
      <button key={a.label} onClick={a.action} style={{
        display: "flex", alignItems: "center", gap: 6, fontSize: 11, padding: "8px 14px", borderRadius: 8,
        border: `1px solid ${c.border}`, background: c.surface, color: c.textSec,
        cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.color = a.color; e.currentTarget.style.boxShadow = `0 4px 12px ${a.color}15`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; e.currentTarget.style.boxShadow = "none"; }}
      ><a.icon size={13} />{a.label}</button>
    ))}
  </div>
);

// ── FINANCEOS BRAND MARK ─────────────────────────────────────
const FosLogo = ({ size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.3, display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #60a5fa, #818cf8, #a78bfa)", flexShrink: 0,
    boxShadow: "0 4px 14px rgba(96,165,250,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
  }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
      {/* Stylized "F" with chart bar motif */}
      <rect x="3" y="2" width="3.5" height="20" rx="1.5" fill="white" opacity="0.95" />
      <rect x="3" y="2" width="16" height="3.2" rx="1.5" fill="white" opacity="0.95" />
      <rect x="3" y="9.5" width="11" height="2.8" rx="1.2" fill="white" opacity="0.65" />
      {/* Rising chart bars */}
      <rect x="14" y="14" width="2.8" height="8" rx="1" fill="white" opacity="0.4" />
      <rect x="18" y="10" width="2.8" height="12" rx="1" fill="white" opacity="0.55" />
    </svg>
  </div>
);

const FosLogoFull = ({ size = 32, c }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
    <FosLogo size={size} />
    <div>
      <span style={{ fontWeight: 800, fontSize: size * 0.47, color: c?.text || "#f0f2f5", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>Finance<span style={{ fontWeight: 400, opacity: 0.6 }}>OS</span></span>
    </div>
  </div>
);

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
    <div style={{
      background: `${c.surface}ee`, border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 16px",
      fontSize: 12, boxShadow: c.shadow3, backdropFilter: "blur(12px)", minWidth: 160,
    }}>
      <div style={{ fontWeight: 700, color: c.text, marginBottom: 8, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
      {payload.filter(p => p.value != null).map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "3px 0", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: c.textSec }}>
            <span style={{ width: 8, height: 3, borderRadius: 1, background: p.color, display: "inline-block" }} />
            {p.name}
          </span>
          <span style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: c.text }}>{typeof p.value === "number" ? fmt(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── SPARKLINE ────────────────────────────────────────────────
const Spark = ({ data, color, width = 64, height = 24 }) => {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 2) - 1}`).join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const id = `sp${Math.random().toString(36).slice(2, 6)}`;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${id})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={parseFloat(points.split(" ").pop().split(",")[1])} r={2} fill={color} />
    </svg>
  );
};

// ── KPI CARD ─────────────────────────────────────────────────
const KpiCard = ({ kpi, c, onClick, index = 0 }) => {
  const Icon = kpi.icon;
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} style={{
      background: c.surface, border: `1px solid ${hovered ? c[kpi.accent] + "50" : c.border}`, borderRadius: 14, padding: "20px 22px",
      cursor: "pointer", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
      position: "relative", overflow: "hidden",
      boxShadow: hovered ? `0 8px 28px ${c[kpi.accent]}15, 0 0 0 1px ${c[kpi.accent]}20` : c.cardGlow,
      transform: hovered ? "translateY(-3px)" : "none",
      animation: `fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${index * 0.06}s both`,
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
      {/* Subtle top accent line — brightens on hover */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c[kpi.accent]}00, ${c[kpi.accent]}${hovered ? "80" : "40"}, ${c[kpi.accent]}00)`, transition: "all 0.3s" }} />
      {/* Ambient corner glow on hover */}
      {hovered && <div style={{ position: "absolute", top: -30, right: -30, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${c[kpi.accent]}12 0%, transparent 70%)`, pointerEvents: "none" }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: hovered ? c.textSec : c.textFaint, transition: "color 0.2s" }}>{kpi.label}</div>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${c[kpi.accent]}${hovered ? "22" : "15"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
          <Icon size={14} color={c[kpi.accent]} strokeWidth={2} />
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
const InsightRow = ({ item, c, onClick }) => {
  const sev = INSIGHT_SEVERITY[item.severity] || {};
  return (
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
        <div style={{ fontSize: 10, color: c.textDim, marginTop: 3, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600 }}>{item.source}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.textFaint, display: "inline-block" }} />
          <span>{item.time} ago</span>
          {item.severity && <span style={{ fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 3, background: `${c[sev.color]}15`, color: c[sev.color], letterSpacing: "0.04em" }}>{sev.label}</span>}
          {item.action && <span style={{ fontSize: 9, color: c.accent, fontWeight: 600 }}>{item.action}</span>}
        </div>
      </div>
      <ChevronRight size={14} color={c.textFaint} style={{ flexShrink: 0, marginTop: 2 }} />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ══════════════════════════════════════════════════════════════
const DashboardView = ({ c, onNav, toast, onDrawer, userName }) => {
  const [hiddenSeries, setHiddenSeries] = useState({});
  const toggleSeries = (key) => setHiddenSeries(prev => ({ ...prev, [key]: !prev[key] }));
  const displayName = userName && userName !== "Guest" ? userName.split(" ")[0] : null;
  const [chartPeriod, setChartPeriod] = useState("YTD");
  const chartData = chartPeriod === "QTD" ? REVENUE_DATA.slice(-6) : chartPeriod === "12M" ? REVENUE_DATA : REVENUE_DATA;
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
  <div style={{ padding: 32 }}>
    {/* Welcome header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}{displayName ? `, ${displayName}` : ""}</div>
        <div style={{ fontSize: 13, color: c.textDim, marginTop: 4 }}>Revenue is ahead by $2.09M · Rule of 40 at 52.1 · 4 variances need attention</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ padding: "8px 14px", borderRadius: 8, background: c.surfaceAlt, border: `1px solid ${c.border}`, fontSize: 11, color: c.textSec, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }} onClick={() => onNav("copilot")}>
          <Sparkles size={13} color={c.purple} /> Ask AI
        </div>
      </div>
    </div>

    {/* Quick Actions — ENV 9 */}
    <QuickActions c={c} onNav={onNav} toast={toast} />

    {/* KPI Grid — ENV 10: Premium hover glow */}
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: isMobile ? 10 : 16, marginBottom: 24 }}>
      {KPIS.map((k, i) => <KpiCard key={k.label} kpi={k} c={c} onClick={() => onDrawer(k.label)} index={i} />)}
    </div>

    {/* Charts Row */}
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr", gap: 16, marginBottom: 24 }}>
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
          {/* Chart period mini-selector (Blueprint Section 6: 3+ options) */}
          <div style={{ display: "flex", gap: 2 }}>
            {["QTD", "YTD", "12M"].map(p => (
              <span key={p} onClick={() => setChartPeriod(p)} style={{ fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: chartPeriod === p ? c.accentMid : "transparent", color: chartPeriod === p ? c.accent : c.textFaint, cursor: "pointer", transition: "all 0.15s" }}>{p}</span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
            <defs>
              <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.accent} stopOpacity={0.15} /><stop offset="100%" stopColor={c.accent} stopOpacity={0} /></linearGradient>
              <linearGradient id="gFc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.green} stopOpacity={0.1} /><stop offset="100%" stopColor={c.green} stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid stroke={c.borderSub} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: c.textDim }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: c.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}M`} />
            <Tooltip content={<ChartTooltip c={c} />} />
            {/* Blueprint Section 6: Reference line (AVG) */}
            <ReferenceLine y={7800} stroke={c.amber} strokeDasharray="6 4" strokeWidth={1} label={{ value: "AVG", fill: c.amber, fontSize: 9, fontWeight: 700, position: "right" }} />
            {!hiddenSeries.actual && <Area type="monotone" dataKey="actual" stroke={c.accent} fill="url(#gAct)" strokeWidth={2.5} name="Actual" dot={{ r: 3, fill: c.accent }} connectNulls={false} />}
            {!hiddenSeries.budget && <Line type="monotone" dataKey="budget" stroke={c.textDim} strokeWidth={1} strokeDasharray="4 4" name="Budget" dot={false} />}
            {!hiddenSeries.forecast && <Area type="monotone" dataKey="forecast" stroke={c.green} fill="url(#gFc)" strokeWidth={2} strokeDasharray="6 3" name="Forecast" dot={{ r: 3, fill: c.green }} connectNulls={false} />}
          </ComposedChart>
        </ResponsiveContainer>
        {/* Interactive legend — Blueprint Section 6: Click to toggle series */}
        <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 10, color: c.textDim, alignItems: "center" }}>
          {[
            { key: "actual", label: "Actual", color: c.accent, style: { width: 16, height: 2.5, background: c.accent, borderRadius: 1 } },
            { key: "budget", label: "Budget", color: c.textDim, style: { width: 16, height: 0, borderTop: `2px dashed ${c.textDim}` } },
            { key: "forecast", label: "Forecast", color: c.green, style: { width: 16, height: 2, background: c.green, borderRadius: 1, opacity: 0.7 } },
          ].map(s => (
            <span key={s.key} onClick={() => toggleSeries(s.key)} style={{
              display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: "2px 6px", borderRadius: 4,
              opacity: hiddenSeries[s.key] ? 0.35 : 1, textDecoration: hiddenSeries[s.key] ? "line-through" : "none",
              transition: "opacity 0.2s",
            }}>
              <span style={{ ...s.style, display: "inline-block" }} />
              {s.label}
            </span>
          ))}
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 16, height: 0, borderTop: `2px dashed ${c.amber}`, display: "inline-block" }} /> AVG</span>
          <span style={{ marginLeft: "auto", fontWeight: 600, color: c.accent }}>Today: Jun 2025</span>
        </div>
        {/* Terminal status bar */}
        <div style={{ display: "flex", gap: 12, marginTop: 8, padding: "7px 12px", background: c.bg2, borderRadius: 6, fontSize: 9, color: c.textFaint, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: c.green, display: "inline-block", animation: "pulse 2s infinite" }} /> LIVE</span>
          <span>12 data points</span>
          <span>Period: FY2025 YTD</span>
          <span>Mode: Actual + Forecast</span>
          <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace" }}>H: $9.8M  L: $6.8M  AVG: $7.8M</span>
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
            {/* Center label */}
            <text x="50%" y="46%" textAnchor="middle" fill={c.text} fontSize={18} fontWeight={800} fontFamily="'JetBrains Mono', monospace">$51.2M</text>
            <text x="50%" y="58%" textAnchor="middle" fill={c.textDim} fontSize={9} fontWeight={600}>TOTAL REV</text>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {SEGMENT_DATA.map(s => {
            const total = SEGMENT_DATA.reduce((a, b) => a + b.value, 0);
            const pct = ((s.value / total) * 100).toFixed(0);
            return (
              <div key={s.name} style={{ fontSize: 11 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 3, background: s.color }} />
                    <span style={{ color: c.textSec, fontWeight: 500 }}>{s.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{pct}%</span>
                </div>
                <div style={{ height: 3, background: c.bg2, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: s.color, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
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
        {/* Terminal status bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, padding: "6px 10px", background: c.bg2, borderRadius: 6, fontSize: 9, color: c.textFaint }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} /> LIVE</span>
          <span>5 categories</span>
          <span>Period: FY2025 YTD</span>
          <span>Mode: Actual vs Budget</span>
        </div>
      </div>
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
        {AI_INSIGHTS_ENRICHED.map((ins, i) => <InsightRow key={i} item={ins} c={c} onClick={() => onNav("copilot")} />)}
      </div>
    </div>

    {/* Cross-sell banner — Blueprint required */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
      {/* Referral */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: c.greenDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Users size={18} color={c.green} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 2 }}>Refer a finance team</div>
          <div style={{ fontSize: 11, color: c.textDim }}>They get 20% off first month. You get $100 credit.</div>
        </div>
        <button onClick={() => toast("Referral link copied to clipboard", "success")} style={{ fontSize: 10, padding: "7px 14px", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>Copy Link</button>
      </div>
      {/* Ecosystem */}
      <div style={{ background: `linear-gradient(135deg, ${c.accent}08, ${c.purple}06)`, border: `1px solid ${c.accent}20`, borderRadius: 14, padding: 22, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: c.purpleDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Layers size={18} color={c.purple} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 2 }}>Vaultline Suite</div>
          <div style={{ fontSize: 11, color: c.textDim }}>Add Treasury or Compliance. Save 15% with the bundle.</div>
        </div>
        <button onClick={() => window.open("https://vaultline.vercel.app", "_blank")} style={{ fontSize: 10, padding: "7px 14px", borderRadius: 6, background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", border: "none", fontFamily: "inherit" }}>Explore</button>
      </div>
    </div>
  </div>
  );
};

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
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

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
          system: AI_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("\n") || "I couldn't process that request.";
      if (mountedRef.current) setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      // Demo fallback
      const q = userMsg.toLowerCase();
      let response = COPILOT_RESPONSES.default;
      if (q.includes("revenue") || q.includes("beat") || q.includes("what drove")) response = COPILOT_RESPONSES.revenue;
      else if (q.includes("pigment") || q.includes("competitor") || q.includes("compare")) response = COPILOT_RESPONSES.pigment;
      else if (q.includes("guidance") || q.includes("raise") || q.includes("should we")) response = COPILOT_RESPONSES.guidance;
      setTimeout(() => {
        if (!mountedRef.current) return;
        setMessages(prev => [...prev, { role: "assistant", content: response }]);
        setThinking(false);
      }, 800);
      return;
    }
    if (mountedRef.current) setThinking(false);
  }, [input, thinking]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* View Header */}
      <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, background: c.purpleDim, display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={13} color={c.purple} /></div>
            AI Copilot
          </div>
          <div style={{ fontSize: 12, color: c.textDim }}>Ask anything about your financials · Visible reasoning · Cited sources</div>
        </div>
        <div style={{ fontSize: 10, padding: "5px 10px", borderRadius: 6, background: c.greenDim, color: c.green, fontWeight: 700, border: `1px solid ${c.green}20` }}>● Online</div>
      </div>
      {/* Prompt suggestions */}
      <div style={{ padding: "12px 24px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
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
      <div style={{ padding: "14px 24px", borderTop: `1px solid ${c.border}`, display: "flex", gap: 10, alignItems: "center", background: `${c.bg2}cc`, backdropFilter: "blur(8px)" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about forecasts, variance, scenarios..."
            style={{
              width: "100%", padding: "12px 16px", paddingRight: 60, borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface,
              color: c.text, fontSize: 13, outline: "none", fontFamily: "inherit", transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={e => { e.target.style.borderColor = c.accent; e.target.style.boxShadow = `0 0 0 3px ${c.accent}15`; }}
            onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }}
          />
          {input.trim() && <kbd style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 9, padding: "2px 6px", borderRadius: 4, background: c.bg2, border: `1px solid ${c.borderSub}`, color: c.textFaint }}>↵ Enter</kbd>}
        </div>
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
const PnlView = ({ c, onNav, toast }) => {
  const [collapsed, setCollapsed] = useState({});
  const toggle = (section) => setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));

  const VarCell = ({ actual, budget, revenue = false }) => {
    const v = variance(actual, budget);
    const vp = variancePct(actual, budget);
    const fav = revenue ? v >= 0 : v <= 0;
    const [hover, setHover] = useState(false);
    return (
      <td style={{ textAlign: "right", padding: "7px 12px", fontWeight: 600, color: fav ? c.green : c.red, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, position: "relative" }}
        onClick={() => onNav("copilot")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span style={{ textDecoration: hover ? "underline" : "none" }}>{v >= 0 ? "+" : ""}{fmt(v)}</span>
        <span style={{ fontSize: 9, opacity: 0.7, marginLeft: 4 }}>({vp >= 0 ? "+" : ""}{vp.toFixed(1)}%)</span>
        {hover && (
          <div style={{ position: "absolute", bottom: "calc(100% + 6px)", right: 0, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 8, padding: "8px 12px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", zIndex: 50, whiteSpace: "nowrap", fontSize: 10, color: c.textSec, pointerEvents: "none", animation: "fadeIn 0.1s" }}>
            <div style={{ color: fav ? c.green : c.red, fontWeight: 700, marginBottom: 2 }}>{fav ? "Favorable" : "Unfavorable"} variance</div>
            <div>Click to ask AI Copilot why</div>
          </div>
        )}
      </td>
    );
  };

  return (
    <div style={{ padding: 32, overflow: "auto" }}>
      {/* View Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", marginBottom: 4 }}>P&L Statement</div>
        <div style={{ fontSize: 12, color: c.textDim, marginBottom: 16 }}>FY2025 YTD · Click any variance to ask AI Copilot for root cause analysis</div>
      </div>
      <ExportBar c={c} title=""
        onCSV={() => { const rows = PNL_DATA.flatMap(s => [...s.rows.map(r => [s.section, r.name, r.actual, r.budget, r.actual - r.budget, r.note || ""]), [s.section, s.total.name, s.total.actual, s.total.budget, s.total.actual - s.total.budget, ""]]); downloadCSV("financeos-pnl-fy2025.csv", ["Section","Line Item","Actual ($K)","Budget ($K)","Variance ($K)","Notes"], rows); toast("P&L exported as CSV", "success"); }}
        onPDF={() => { window.print(); toast("Use Save as PDF in the print dialog", "info"); }}
      />
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
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const base = 62.8;
  const ndrImpact = (ndr - 118) * 0.35;
  const pipeImpact = (pipeline - 40) * 0.2;
  const churnImpact = (churn / 10 - 8.2) * -0.5;
  const scenario = base + ndrImpact + pipeImpact + churnImpact;
  const delta = scenario - base;

  const handleRetrain = () => {
    setRetraining(true);
    setTimeout(() => { if (!mountedRef.current) return; setRetraining(false); setRetrained(true); setTimeout(() => { if (mountedRef.current) setRetrained(false); }, 3000); }, 2000);
  };

  return (
    <div style={{ padding: 32 }}>
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Forecast Optimizer</div>
          <div style={{ fontSize: 12, color: c.textDim }}>ML ensemble with live sensitivity sliders · MAPE {retrained ? "2.9%" : "3.2%"} · 14 drivers</div>
        </div>
        <button onClick={handleRetrain} disabled={retraining} style={{
          fontSize: 11, fontWeight: 700, padding: "8px 16px", borderRadius: 8, border: "none", cursor: retraining ? "wait" : "pointer", fontFamily: "inherit",
          background: retraining ? c.amber : retrained ? c.green : c.purple, color: "#fff", transition: "all 0.2s",
        }}>{retraining ? "Training..." : retrained ? "✓ Retrained — MAPE 2.9%" : "Retrain Model"}</button>
      </div>
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
        {/* Terminal status bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, padding: "6px 10px", background: c.bg2, borderRadius: 6, fontSize: 9, color: c.textFaint }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} /> LIVE</span>
          <span>12 data points</span>
          <span>Model: ETS + XGBoost + Linear</span>
          <span>Mode: Base + Bull/Bear</span>
          <span style={{ marginLeft: "auto" }}>MAPE: 3.2%</span>
        </div>
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
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);
  const statusColors = { "Closed": c.green, "In Review": c.accent, "Pending": c.amber };

  const approve = (name) => {
    setEntityStatus(prev => ({ ...prev, [name]: "closing" }));
    setTimeout(() => {
      if (!mountedRef.current) return;
      setEntityStatus(prev => ({ ...prev, [name]: "Closed" }));
      toast(`${name} approved and closed`, "success");
    }, 1200);
  };

  return (
    <div style={{ padding: 32 }}>
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Multi-Entity Consolidation</div>
          <div style={{ fontSize: 12, color: c.textDim }}>{ENTITIES.length} entities · Auto IC elimination · {ENTITIES.filter(e => (entityStatus[e.name] || e.status) === "Closed").length} closed · FX: Real-time</div>
        </div>
        <button onClick={() => { ENTITIES.forEach(e => { if ((entityStatus[e.name] || e.status) !== "Closed") approve(e.name); }); }} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: c.green, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Close All Pending</button>
      </div>
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
  { id: 1, task: "Reconcile bank accounts (3 accounts)", owner: "Sarah Chen", status: "done", due: "Mar 3", priority: "high", cat: "Accounting" },
  { id: 2, task: "Review accrued expenses > $10K", owner: "Mike Rodriguez", status: "done", due: "Mar 4", priority: "high", cat: "Accounting" },
  { id: 3, task: "Post depreciation entries", owner: "Sarah Chen", status: "progress", due: "Mar 5", priority: "med", cat: "Accounting" },
  { id: 4, task: "Intercompany eliminations review", owner: "David Park", status: "progress", due: "Mar 5", priority: "high", cat: "Consolidation" },
  { id: 5, task: "Revenue recognition — ASC 606 review", owner: "Sarah Chen", status: "progress", due: "Mar 6", priority: "high", cat: "Compliance" },
  { id: 6, task: "Finalize headcount report", owner: "Talent Ops", status: "notstarted", due: "Mar 7", priority: "low", cat: "Reporting" },
  { id: 7, task: "Close sub-ledgers (AP/AR/FA)", owner: "Mike Rodriguez", status: "notstarted", due: "Mar 7", priority: "high", cat: "Accounting" },
  { id: 8, task: "Management review sign-off", owner: "CFO", status: "notstarted", due: "Mar 8", priority: "med", cat: "Review" },
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
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Month-End Close</div>
          <div style={{ fontSize: 12, color: c.textDim }}>February close · {tasks.length - doneCount} tasks remaining · Est. {Math.max(0, (tasks.length - doneCount) * 0.5).toFixed(1)}h to complete</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(statusLabel).map(([key, label]) => {
            const count = tasks.filter(t => t.status === key).length;
            return count > 0 ? (
              <div key={key} style={{ fontSize: 10, fontWeight: 700, padding: "6px 12px", borderRadius: 6, background: `${statusColor[key]}15`, color: statusColor[key], border: `1px solid ${statusColor[key]}25` }}>{count} {label}</div>
            ) : null;
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, marginBottom: 20, boxShadow: c.cardGlow }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>February Close — {pct}% Complete</span>
          <span style={{ fontSize: 11, color: c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{doneCount}/{tasks.length} tasks</span>
        </div>
        <div style={{ height: 8, background: c.bg2, borderRadius: 4, overflow: "hidden", position: "relative" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? c.green : `linear-gradient(90deg, ${c.accent}, ${c.green})`, borderRadius: 4, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)", boxShadow: `0 0 12px ${c.accent}40` }} />
        </div>
      </div>

      {/* Task list */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden" }}>
        {tasks.map((t, i) => {
          const priorityColors = { high: c.red, med: c.amber, low: c.textFaint };
          return (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
            borderBottom: i < tasks.length - 1 ? `1px solid ${c.borderSub}` : "none",
            opacity: t.status === "done" ? 0.5 : 1, cursor: t.status !== "done" ? "pointer" : "default",
            transition: "all 0.2s", borderLeft: `3px solid ${t.status === "done" ? c.green : priorityColors[t.priority] || c.accent}`,
          }}
          onClick={() => t.status !== "done" && complete(t.id)}
          onMouseEnter={e => { if (t.status !== "done") { e.currentTarget.style.background = c.accentDim; e.currentTarget.style.transform = "translateX(2px)"; }}}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 7, border: `2px solid ${t.status === "done" ? c.green : c.border}`,
              background: t.status === "done" ? c.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
            }}>
              {t.status === "done" && <Check size={12} color="#fff" strokeWidth={3} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.text, textDecoration: t.status === "done" ? "line-through" : "none", marginBottom: 3 }}>{t.task}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: c.textDim }}>
                <span>{t.owner}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.textFaint }} />
                <span>Due {t.due}</span>
                <span style={{ padding: "1px 6px", borderRadius: 3, background: `${priorityColors[t.priority]}12`, color: priorityColors[t.priority], fontWeight: 700, fontSize: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>{t.priority}</span>
                <span style={{ padding: "1px 6px", borderRadius: 3, background: c.surfaceAlt, color: c.textFaint, fontWeight: 600, fontSize: 8 }}>{t.cat}</span>
              </div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: `${statusColor[t.status]}15`, color: statusColor[t.status], border: `1px solid ${statusColor[t.status]}20` }}>{statusLabel[t.status]}</span>
          </div>
          );
        })}
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
  const [search, setSearch] = useState("");
  const [connectingName, setConnectingName] = useState(null); // shows connection setup modal
  const [disconnectConfirm, setDisconnectConfirm] = useState(null); // shows disconnect confirmation
  const [syncingName, setSyncingName] = useState(null);
  const cats = ["all", ...new Set(CONNECTORS.map(co => co.cat))];
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const startConnect = (name) => {
    const conn = conns.find(co => co.name === name);
    if (conn?.status === "connected") { setDisconnectConfirm(name); return; }
    setConnectingName(name);
  };

  const confirmConnect = (name) => {
    setConnectingName(null);
    setSyncingName(name);
    setConns(prev => prev.map(co => co.name === name ? { ...co, status: "syncing", records: "Syncing..." } : co));
    toast(`Connecting ${name}...`, "info");
    // Simulate sync delay
    setTimeout(() => {
      if (!mountedRef.current) return;
      const fakeRecords = ["12K", "24K", "8.4K", "156K", "3.2K"][Math.floor(Math.random() * 5)];
      setConns(prev => prev.map(co => co.name === name ? { ...co, status: "connected", records: fakeRecords, lastSync: "Just now" } : co));
      setSyncingName(null);
      toast(`${name} connected — ${fakeRecords} records synced`, "success");
    }, 2500);
  };

  const confirmDisconnect = () => {
    const name = disconnectConfirm;
    setDisconnectConfirm(null);
    setConns(prev => prev.map(co => co.name === name ? { ...co, status: "available", records: null, lastSync: null } : co));
    toast(`Disconnected ${name}`, "warning");
  };

  const syncConnector = (name) => {
    setSyncingName(name);
    setConns(prev => prev.map(co => co.name === name ? { ...co, lastSync: "Syncing..." } : co));
    setTimeout(() => {
      if (!mountedRef.current) return;
      setConns(prev => prev.map(co => co.name === name ? { ...co, lastSync: "Just now" } : co));
      setSyncingName(null);
      toast(`${name} synced`, "success");
    }, 1800);
  };

  const filtered = (filter === "all" ? conns : conns.filter(co => co.cat === filter)).filter(co => !search || co.name.toLowerCase().includes(search.toLowerCase()));
  const connected = conns.filter(co => co.status === "connected");

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Integrations</div>
          <div style={{ fontSize: 12, color: c.textDim }}>Connect your stack. Bi-directional sync with real-time freshness indicators.</div>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search integrations..."
          style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontFamily: "inherit", outline: "none", width: 200 }}
          onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.border}
        />
      </div>

      {/* Health overview bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Connected", value: connected.length, icon: "●", color: c.green },
          { label: "Available", value: conns.filter(co => co.status === "available").length, icon: "○", color: c.textDim },
          { label: "Total Records", value: "3.2M+", icon: "◆", color: c.accent },
          { label: "Avg Freshness", value: "< 4 min", icon: "⚡", color: c.amber },
        ].map(s => (
          <div key={s.label} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "14px 18px", boxShadow: c.cardGlow }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ color: s.color, fontSize: 8 }}>{s.icon}</span>
              <span style={{ fontSize: 9, color: c.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
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
          <div key={co.name} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, boxShadow: c.cardGlow, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = co.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${co.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: co.color }}>{co.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{co.name}</div>
                <div style={{ fontSize: 10, color: c.textDim }}>{co.cat}</div>
              </div>
              {co.status === "connected" && (
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.green, boxShadow: `0 0 6px ${c.green}60`, animation: "pulse 2s infinite" }} />
              )}
            </div>
            {co.status === "connected" && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 10, padding: "6px 10px", borderRadius: 6, background: c.surfaceAlt }}>
                <span style={{ color: c.green, fontWeight: 600 }}>{co.records} records</span>
                <span style={{ color: co.name === syncingName ? c.amber : c.textFaint }}>{co.name === syncingName ? "Syncing..." : (co.lastSync || "3 min ago")}</span>
              </div>
            )}
            {co.status === "syncing" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, marginBottom: 10, padding: "6px 10px", borderRadius: 6, background: c.surfaceAlt }}>
                <span style={{ width: 10, height: 10, border: `2px solid ${c.accent}40`, borderTopColor: c.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <span style={{ color: c.amber, fontWeight: 600 }}>Connecting and syncing records...</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => startConnect(co.name)} disabled={co.status === "syncing"} style={{
                flex: 1, fontSize: 10, padding: "8px 0", borderRadius: 8, border: "none", fontFamily: "inherit", fontWeight: 700, cursor: co.status === "syncing" ? "wait" : "pointer", transition: "all 0.15s",
                background: co.status === "connected" ? c.redDim : co.status === "syncing" ? c.surfaceAlt : `linear-gradient(135deg, ${co.color}, ${co.color}cc)`, color: co.status === "connected" ? c.red : co.status === "syncing" ? c.textDim : "#fff",
              }}>{co.status === "connected" ? "Disconnect" : co.status === "syncing" ? "Connecting..." : "Connect"}</button>
              {co.status === "connected" && (
                <button onClick={() => syncConnector(co.name)} disabled={co.name === syncingName} style={{ fontSize: 10, padding: "8px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: co.name === syncingName ? c.amber : c.textSec, cursor: co.name === syncingName ? "wait" : "pointer", fontFamily: "inherit", fontWeight: 600 }}>{co.name === syncingName ? "..." : "Sync"}</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connection setup modal */}
      {connectingName && (() => {
        const conn = CONNECTORS.find(co => co.name === connectingName);
        return (
        <div onClick={() => setConnectingName(null)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 420, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s cubic-bezier(0.22,1,0.36,1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${conn?.color || c.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: conn?.color || c.accent }}>{connectingName[0]}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: c.text }}>Connect {connectingName}</div>
                <div style={{ fontSize: 11, color: c.textDim }}>{conn?.cat || "Integration"} · Bi-directional sync</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: c.textSec, lineHeight: 1.7, marginBottom: 20 }}>
              This will authorize FinanceOS to read and sync data from your {connectingName} account. You can disconnect at any time.
            </div>
            <div style={{ background: c.surfaceAlt, borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              {["Read-only access to financial data", "Automatic sync every 5 minutes", "AES-256 encrypted connection", "Revocable at any time"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: c.textSec, padding: "4px 0" }}>
                  <span style={{ color: c.green, fontSize: 12 }}>✓</span> {item}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => confirmConnect(connectingName)} style={{ flex: 1, fontSize: 13, padding: "12px 0", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${conn?.color || c.accent}, ${conn?.color || c.accent}cc)`, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Authorize & Connect</button>
              <button onClick={() => setConnectingName(null)} style={{ fontSize: 13, padding: "12px 20px", borderRadius: 10, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Disconnect confirmation */}
      {disconnectConfirm && (
        <div onClick={() => setDisconnectConfirm(null)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 380, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s cubic-bezier(0.22,1,0.36,1)", textAlign: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.redDim, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <X size={20} color={c.red} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: c.text, marginBottom: 6 }}>Disconnect {disconnectConfirm}?</div>
            <div style={{ fontSize: 12, color: c.textDim, lineHeight: 1.6, marginBottom: 20 }}>This will stop syncing data from {disconnectConfirm}. Historical data will be preserved. You can reconnect at any time.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDisconnectConfirm(null)} style={{ flex: 1, fontSize: 13, padding: "11px 0", borderRadius: 10, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit" }}>Keep Connected</button>
              <button onClick={confirmDisconnect} style={{ flex: 1, fontSize: 13, padding: "11px 0", borderRadius: 10, border: "none", background: c.red, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Disconnect</button>
            </div>
          </div>
        </div>
      )}
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

// ══════════════════════════════════════════════════════════════
// INVESTOR METRICS — Fundraising & Investor Marketing
// ══════════════════════════════════════════════════════════════
const InvestorView = ({ c, toast }) => (
  <div style={{ padding: 32 }}>
    {/* View Header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Investor Metrics</div>
        <div style={{ fontSize: 12, color: c.textDim }}>Series A readiness scorecard · 8 SaaS benchmarks · Board-ready exports</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { downloadCSV("financeos-investor-metrics.csv", ["Metric","Value","Benchmark","Notes"], [["ARR","$48.6M","+24% YoY",""],["NDR","118%",">110%","Best-in-class"],["Rule of 40","52.1","Growth 47.8% + Margin 4.3%",""],["Burn Multiple","0.8x","<1.0x","Efficient"],["Gross Margin","84.7%","70-80%","SaaS benchmark"],["CAC Payback","14 mo","<18 months",""],["LTV/CAC","4.2x",">3.0x","Healthy"],["Cash Runway","34 mo","$12.8M cash",""]]); toast("Investor metrics exported as CSV", "success"); }} style={{ fontSize: 11, padding: "8px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Export CSV</button>
        <button onClick={() => { window.print(); toast("Use Save as PDF in the print dialog", "info"); }} style={{ fontSize: 11, padding: "8px 14px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Export PDF</button>
      </div>
    </div>

    {/* Benchmark Scorecard */}
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "16px 22px", marginBottom: 20, boxShadow: c.cardGlow, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: c.text, whiteSpace: "nowrap" }}>Series A Readiness</div>
      <div style={{ flex: 1, display: "flex", gap: 4 }}>
        {[
          { label: "ARR", pass: true }, { label: "NDR", pass: true }, { label: "Rule of 40", pass: true },
          { label: "Burn", pass: true }, { label: "Margin", pass: true }, { label: "CAC", pass: true },
          { label: "LTV/CAC", pass: true }, { label: "Runway", pass: true },
        ].map(b => (
          <div key={b.label} style={{ flex: 1, height: 6, borderRadius: 3, background: b.pass ? c.green : c.red, opacity: 0.7, transition: "opacity 0.15s" }}
            title={`${b.label}: ${b.pass ? "Above benchmark" : "Below benchmark"}`}
          />
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace" }}>8/8 ✓</div>
    </div>

    {/* Fundraising KPIs */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
      {[
        { label: "ARR", value: "$48.6M", sub: "+24% YoY", color: c.accent },
        { label: "Net Dollar Retention", value: "118%", sub: "Best-in-class >110%", color: c.green },
        { label: "Rule of 40", value: "52.1", sub: "Growth 47.8% + Margin 4.3%", color: c.purple },
        { label: "Burn Multiple", value: "0.8x", sub: "Efficient: <1.0x target", color: c.green },
        { label: "Gross Margin", value: "84.7%", sub: "SaaS benchmark: 70-80%", color: c.accent },
        { label: "CAC Payback", value: "14 mo", sub: "Target: <18 months", color: c.green },
        { label: "LTV/CAC", value: "4.2x", sub: "Healthy: >3.0x", color: c.green },
        { label: "Cash Runway", value: "34 mo", sub: "$12.8M cash on hand", color: c.accent },
      ].map(k => (
        <div key={k.label} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "16px 18px", boxShadow: c.cardGlow }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: c.textFaint, marginBottom: 6 }}>{k.label}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{k.value}</div>
          <div style={{ fontSize: 10, color: k.color, fontWeight: 600 }}>{k.sub}</div>
        </div>
      ))}
    </div>

    {/* Cohort & Unit Economics */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 14 }}>Revenue Cohort Analysis</div>
        {[
          { cohort: "Q1 2023", initial: "$2.1M", current: "$3.8M", retention: "181%", color: c.green },
          { cohort: "Q2 2023", initial: "$2.8M", current: "$4.6M", retention: "164%", color: c.green },
          { cohort: "Q3 2023", initial: "$3.2M", current: "$4.9M", retention: "153%", color: c.green },
          { cohort: "Q4 2023", initial: "$3.9M", current: "$5.4M", retention: "138%", color: c.green },
          { cohort: "Q1 2024", initial: "$4.5M", current: "$5.8M", retention: "129%", color: c.accent },
          { cohort: "Q2 2024", initial: "$5.2M", current: "$6.1M", retention: "117%", color: c.accent },
        ].map(r => (
          <div key={r.cohort} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${c.borderSub}` }}>
            <span style={{ fontSize: 11, color: c.textDim, width: 60 }}>{r.cohort}</span>
            <span style={{ fontSize: 11, color: c.textSec, fontFamily: "'JetBrains Mono', monospace", width: 55 }}>{r.initial}</span>
            <div style={{ flex: 1, height: 6, background: c.bg2, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(parseInt(r.retention), 200) / 2}%`, height: "100%", background: r.color, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: r.color, fontFamily: "'JetBrains Mono', monospace", width: 45, textAlign: "right" }}>{r.retention}</span>
          </div>
        ))}
      </div>

      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 14 }}>Competitive Positioning</div>
        {[
          { metric: "ARR Growth Rate", us: "47.8%", benchmark: "30-40%", verdict: "Above" },
          { metric: "Gross Margin", us: "84.7%", benchmark: "70-80%", verdict: "Above" },
          { metric: "NDR", us: "118%", benchmark: "110-120%", verdict: "Inline" },
          { metric: "Burn Multiple", us: "0.8x", benchmark: "1.0-2.0x", verdict: "Above" },
          { metric: "Magic Number", us: "1.2", benchmark: "0.7-1.0", verdict: "Above" },
          { metric: "CAC Payback", us: "14 mo", benchmark: "12-18 mo", verdict: "Inline" },
        ].map(m => (
          <div key={m.metric} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 11 }}>
            <span style={{ flex: 1, color: c.textSec }}>{m.metric}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: c.text, width: 55, textAlign: "right" }}>{m.us}</span>
            <span style={{ color: c.textDim, width: 75, textAlign: "right", fontSize: 10 }}>{m.benchmark}</span>
            <span style={{ width: 50, textAlign: "right", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: m.verdict === "Above" ? c.greenDim : c.accentDim, color: m.verdict === "Above" ? c.green : c.accent, marginLeft: 8 }}>{m.verdict}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Fundraising Readiness */}
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 14 }}>Series A Readiness Checklist</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { item: "ARR > $10M", done: true },
          { item: "NDR > 110%", done: true },
          { item: "Gross Margin > 75%", done: true },
          { item: "Rule of 40 > 40", done: true },
          { item: "3+ enterprise logos", done: false, note: "Design partners in progress" },
          { item: "SOC 2 Type II certified", done: false, note: "Architecture ready, audit pending" },
          { item: "12+ months runway", done: true },
          { item: "Repeatable sales motion", done: false, note: "PLG + outbound building" },
          { item: "Product-market fit signal", done: true, note: "118% NDR confirms" },
          { item: "Competitive moat identified", done: true, note: "Suite bundle — unique in market" },
        ].map(c2 => (
          <div key={c2.item} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 12px", borderRadius: 8, background: c2.done ? c.greenDim : c.amberDim, border: `1px solid ${c2.done ? c.green : c.amber}15` }}>
            <Check size={14} color={c2.done ? c.green : c.amber} strokeWidth={2.5} style={{ marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{c2.item}</div>
              {c2.note && <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>{c2.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// SUPER-ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════
const AdminView = ({ c, toast, onNav }) => {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users & Roles" },
    { id: "billing", label: "Revenue" },
    { id: "system", label: "System Health" },
  ];

  const adminKpis = [
    { label: "Total MRR", value: "$147.2K", delta: "+12.4%", up: true, color: c.accent },
    { label: "Active Orgs", value: "84", delta: "+6", up: true, color: c.green },
    { label: "API Calls (24h)", value: "2.4M", delta: "+18%", up: true, color: c.purple },
    { label: "Error Rate", value: "0.03%", delta: "-0.01%", up: true, color: c.green },
    { label: "Avg Response", value: "142ms", delta: "-8ms", up: true, color: c.cyan },
    { label: "Active Users", value: "312", delta: "+24", up: true, color: c.accent },
  ];

  const users = [
    { name: "Sarah Chen", email: "sarah@acme.io", role: "Admin", status: "active", lastActive: "2 min ago", sessions: 3 },
    { name: "James Park", email: "james@acme.io", role: "Manager", status: "active", lastActive: "14 min ago", sessions: 1 },
    { name: "Maria Lopez", email: "maria@acme.io", role: "Budget Owner", status: "active", lastActive: "1 hr ago", sessions: 1 },
    { name: "David Kim", email: "david@acme.io", role: "Viewer", status: "inactive", lastActive: "3 days ago", sessions: 0 },
    { name: "Rachel Green", email: "rachel@acme.io", role: "Manager", status: "active", lastActive: "28 min ago", sessions: 2 },
    { name: "Tom Wilson", email: "tom@acme.io", role: "Budget Owner", status: "invited", lastActive: "Never", sessions: 0 },
  ];

  const events = [
    { action: "User sign-in", actor: "Sarah Chen", time: "2 min ago", type: "auth" },
    { action: "P&L exported as PDF", actor: "James Park", time: "14 min ago", type: "data" },
    { action: "Scenario created: Bull Case Q3", actor: "Maria Lopez", time: "1 hr ago", type: "action" },
    { action: "API key regenerated", actor: "Sarah Chen", time: "2 hr ago", type: "security" },
    { action: "Integration connected: NetSuite", actor: "James Park", time: "4 hr ago", type: "integration" },
    { action: "Role changed: David Kim → Viewer", actor: "Sarah Chen", time: "1 day ago", type: "admin" },
    { action: "Invoice paid: $1,799.00", actor: "System", time: "3 days ago", type: "billing" },
    { action: "User invited: tom@acme.io", actor: "Sarah Chen", time: "5 days ago", type: "admin" },
  ];

  const eventColors = { auth: c.green, data: c.accent, action: c.purple, security: c.amber, integration: c.cyan, admin: c.textSec, billing: c.green };

  return (
    <div style={{ padding: 32 }}>
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Admin Console</div>
          <div style={{ fontSize: 12, color: c.textDim }}>{users.length} users · {users.filter(u => u.status === "active").length} active · {events.length} events today</div>
        </div>
        <button onClick={() => toast("Invite sent", "success")} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Invite User</button>
      </div>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: c.surfaceAlt, borderRadius: 10, padding: 3, border: `1px solid ${c.borderSub}`, maxWidth: 480 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, fontSize: 11, padding: "8px 0", borderRadius: 7, border: "none",
            background: tab === t.id ? c.surface : "transparent",
            color: tab === t.id ? c.text : c.textDim,
            fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
            boxShadow: tab === t.id ? c.shadow1 : "none", transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "overview" && (<>
        {/* Admin KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          {adminKpis.map(k => (
            <div key={k.label} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "16px 18px", boxShadow: c.cardGlow }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: c.textFaint, marginBottom: 8 }}>{k.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>{k.value}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: k.up ? c.green : c.red, background: k.up ? c.greenDim : c.redDim, padding: "2px 6px", borderRadius: 4 }}>{k.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 14 }}>Activity Log</div>
            {events.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < events.length - 1 ? `1px solid ${c.borderSub}` : "none", alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: eventColors[e.type] || c.textDim, marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{e.action}</div>
                  <div style={{ fontSize: 10, color: c.textDim, marginTop: 2 }}>{e.actor} · {e.time}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Quick Admin Actions */}
          <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 14 }}>Admin Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Invite User", desc: "Send invite to new team member", action: () => toast("Invite sent — check user's email", "success") },
                { label: "Export Audit Log", desc: "Download full activity history as CSV", action: () => toast("Audit log exported — 312 events", "success") },
                { label: "Rotate API Keys", desc: "Regenerate all active API keys", action: () => toast("API keys rotated — update integrations", "warning") },
                { label: "Force Sync All", desc: "Trigger sync on all connected integrations", action: () => { toast("Syncing 4 integrations...", "success"); } },
                { label: "Generate SOC 2 Report", desc: "Export compliance evidence package", action: () => toast("SOC 2 evidence package generated", "success") },
                { label: "Purge Demo Data", desc: "Remove all sample data from organization", action: () => toast("Demo data purge requires confirmation — check Settings", "warning") },
              ].map(a => (
                <button key={a.label} onClick={a.action} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 8,
                  border: `1px solid ${c.border}`, background: "transparent", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  transition: "all 0.15s", color: c.text,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.background = c.accentDim; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = "transparent"; }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{a.label}</div>
                    <div style={{ fontSize: 10, color: c.textDim, marginTop: 2 }}>{a.desc}</div>
                  </div>
                  <ChevronRight size={14} color={c.textFaint} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </>)}

      {tab === "users" && (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden", boxShadow: c.cardGlow }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${c.borderBright}` }}>
                {["User", "Role", "Status", "Last Active", "Sessions", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: c.textDim, textAlign: "left", background: c.bg2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.email} style={{ borderBottom: `1px solid ${c.borderSub}`, background: i % 2 === 0 ? "transparent" : c.surfaceAlt }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontWeight: 600, color: c.text }}>{u.name}</div>
                    <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>{u.email}</div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: u.role === "Admin" ? c.accentDim : c.surfaceAlt, color: u.role === "Admin" ? c.accent : c.textSec }}>{u.role}</span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: u.status === "active" ? c.green : u.status === "invited" ? c.amber : c.textFaint }} />
                      <span style={{ fontSize: 11, color: c.textSec, textTransform: "capitalize" }}>{u.status}</span>
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 11, color: c.textDim }}>{u.lastActive}</td>
                  <td style={{ padding: "12px 14px", fontSize: 11, color: c.textSec, fontFamily: "'JetBrains Mono', monospace" }}>{u.sessions}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => toast(`Editing ${u.name}`, "success")} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 4, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                      {u.status === "invited" && <button onClick={() => toast(`Resent invite to ${u.email}`, "success")} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 4, border: `1px solid ${c.amber}40`, background: c.amberDim, color: c.amber, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Resend</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "billing" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "MRR", value: "$147.2K", sub: "84 active subscriptions" },
              { label: "ARR", value: "$1.77M", sub: "Projected from current MRR" },
              { label: "Avg Contract Value", value: "$1,752", sub: "Across all tiers" },
              { label: "Churn Rate", value: "2.1%", sub: "Last 30 days" },
            ].map(k => (
              <div key={k.label} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "16px 18px", boxShadow: c.cardGlow }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: c.textFaint, marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{k.value}</div>
                <div style={{ fontSize: 10, color: c.textDim }}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 14 }}>Revenue by Plan</div>
            {[
              { plan: "Starter ($599/mo)", orgs: 32, mrr: "$19.2K", pct: 13 },
              { plan: "Growth ($1,799/mo)", orgs: 38, mrr: "$68.4K", pct: 46 },
              { plan: "Business ($4,799/mo)", orgs: 14, mrr: "$67.2K", pct: 41 },
            ].map(p => (
              <div key={p.plan} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${c.borderSub}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{p.plan}</div>
                  <div style={{ fontSize: 10, color: c.textDim, marginTop: 2 }}>{p.orgs} organizations</div>
                </div>
                <div style={{ width: 200, height: 8, background: c.bg2, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${p.pct}%`, height: "100%", background: c.accent, borderRadius: 4, transition: "width 0.3s" }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: c.text, fontFamily: "'JetBrains Mono', monospace", minWidth: 70, textAlign: "right" }}>{p.mrr}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "system" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Service Status */}
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 14 }}>Service Status</div>
              {[
                { name: "API Gateway", status: "operational", latency: "42ms" },
                { name: "Supabase (us-east-1)", status: "operational", latency: "18ms" },
                { name: "Claude AI (Copilot)", status: "operational", latency: "890ms" },
                { name: "Stripe Billing", status: "operational", latency: "156ms" },
                { name: "Vercel Edge", status: "operational", latency: "12ms" },
                { name: "Google Fonts CDN", status: "operational", latency: "8ms" },
              ].map(s => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.status === "operational" ? c.green : c.red }} />
                    <span style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: 10, color: c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{s.latency}</span>
                </div>
              ))}
            </div>
            {/* Security Headers */}
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 14 }}>Security Posture</div>
              {[
                { name: "HSTS Preload", grade: "A+", status: "active" },
                { name: "Content Security Policy", grade: "A", status: "active" },
                { name: "Cross-Origin Policies", grade: "A+", status: "active" },
                { name: "Row-Level Security", grade: "A+", status: "0 advisories" },
                { name: "MFA Enforcement", grade: "B", status: "optional" },
                { name: "SOC 2 Type II", grade: "—", status: "audit pending" },
              ].map(s => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}` }}>
                  <span style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{s.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: c.textDim }}>{s.status}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: s.grade.includes("A") ? c.greenDim : s.grade === "B" ? c.amberDim : c.surfaceAlt, color: s.grade.includes("A") ? c.green : s.grade === "B" ? c.amber : c.textDim }}>{s.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ScenariosView = ({ c, toast }) => {
  const [selected, setSelected] = useState(0);
  const [compare, setCompare] = useState([0, 2]); // side-by-side compare indices
  const [drivers, setDrivers] = useState({ ndr: 118, pipeline: 42, churn: 2.1, headcount: 128 });
  const [showCompare, setShowCompare] = useState(false);

  const scenarios = SCENARIOS_LIST.map((s, i) => i === 0 ? {
    ...s,
    revenue: +(s.revenue * (drivers.ndr / 118) * (drivers.pipeline / 42)).toFixed(1),
    opex: +(s.opex * (drivers.headcount / 128)).toFixed(1),
    get ebitda() { return +((this.revenue - this.opex) / this.revenue * 100).toFixed(1); }
  } : s);

  const active = scenarios[selected];
  const barMax = Math.max(...scenarios.map(s => s.revenue));

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Scenario Modeling</div>
          <div style={{ fontSize: 12, color: c.textDim }}>{scenarios.length} scenarios · Drag sliders to model assumptions in real-time</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowCompare(!showCompare)} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: `1px solid ${showCompare ? c.accent : c.border}`, background: showCompare ? c.accentDim : "transparent", color: showCompare ? c.accent : c.textSec, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Compare</button>
          <button onClick={() => toast("New scenario created", "success")} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ New Scenario</button>
        </div>
      </div>

      {/* Horizontal bar comparison */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, marginBottom: 16, boxShadow: c.cardGlow }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: c.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>Revenue Comparison</div>
        {scenarios.map((s, i) => (
          <div key={s.name} onClick={() => setSelected(i)} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, cursor: "pointer", opacity: selected === i ? 1 : 0.6, transition: "opacity 0.15s" }}>
            <div style={{ width: 120, fontSize: 11, fontWeight: selected === i ? 700 : 500, color: selected === i ? c.text : c.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
            <div style={{ flex: 1, height: 24, background: c.surfaceAlt, borderRadius: 6, overflow: "hidden", position: "relative" }}>
              <div style={{ height: "100%", width: `${(s.revenue / barMax) * 100}%`, background: s.status === "Active" ? `linear-gradient(90deg, ${c.accent}, ${c.accentMid || c.accent}80)` : c.borderBright, borderRadius: 6, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: s.status === "Active" ? "#fff" : c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>${s.revenue}M</span>
              </div>
            </div>
            <div style={{ width: 60, fontSize: 10, fontWeight: 600, color: s.ebitda > 5 ? c.green : s.ebitda > 0 ? c.amber : c.red, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{typeof s.ebitda === 'number' ? s.ebitda : s.ebitda}%</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showCompare ? "1fr 1fr" : "1fr 280px", gap: 16 }}>
        {/* Scenario cards or comparison */}
        {showCompare ? compare.map(idx => {
          const s = scenarios[idx];
          return (
            <div key={idx} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: c.text, marginBottom: 16 }}>{s.name}</div>
              {[{ l: "Revenue", v: `$${s.revenue}M`, color: c.text }, { l: "OpEx", v: `$${s.opex}M`, color: c.amber }, { l: "EBITDA Margin", v: `${typeof s.ebitda === 'number' ? s.ebitda : s.ebitda}%`, color: (typeof s.ebitda === 'number' ? s.ebitda : parseFloat(s.ebitda)) > 5 ? c.green : c.red }, { l: "Status", v: s.status, color: s.status === "Active" ? c.green : c.textDim }].map(r => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 12 }}>
                  <span style={{ color: c.textDim }}>{r.l}</span>
                  <span style={{ fontWeight: 700, color: r.color, fontFamily: "'JetBrains Mono', monospace" }}>{r.v}</span>
                </div>
              ))}
            </div>
          );
        }) : (
          <>
            {/* Scenario cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {scenarios.map((s, i) => (
                <div key={s.name} onClick={() => setSelected(i)} style={{
                  background: c.surface, border: `1px solid ${selected === i ? c.accent : c.border}`, borderRadius: 14, padding: 18, boxShadow: c.cardGlow,
                  cursor: "pointer", transition: "border-color 0.15s, transform 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: c.text }}>{s.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: s.status === "Active" ? c.greenDim : c.surfaceAlt, color: s.status === "Active" ? c.green : c.textDim }}>{s.status}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[{ l: "Rev", v: `$${s.revenue}M` }, { l: "OpEx", v: `$${s.opex}M` }, { l: "EBITDA", v: `${typeof s.ebitda === 'number' ? s.ebitda : s.ebitda}%` }].map(m => (
                      <div key={m.l}>
                        <div style={{ fontSize: 8, color: c.textDim, textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.l}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 9, color: c.textFaint, marginTop: 8 }}>Updated {s.updated}</div>
                </div>
              ))}
            </div>

            {/* Sensitivity sliders */}
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 16 }}>Assumption Drivers</div>
              {[
                { key: "ndr", label: "Net Dollar Retention", value: drivers.ndr, min: 80, max: 150, unit: "%", color: c.accent },
                { key: "pipeline", label: "Pipeline ($M)", value: drivers.pipeline, min: 10, max: 80, unit: "M", color: c.green },
                { key: "churn", label: "Gross Churn Rate", value: drivers.churn, min: 0.5, max: 8, unit: "%", color: c.red, step: 0.1 },
                { key: "headcount", label: "Headcount", value: drivers.headcount, min: 80, max: 200, unit: "", color: c.amber },
              ].map(d => (
                <div key={d.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 6 }}>
                    <span style={{ color: c.textDim, fontWeight: 600 }}>{d.label}</span>
                    <span style={{ color: d.color, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{d.value}{d.unit}</span>
                  </div>
                  <input type="range" min={d.min} max={d.max} step={d.step || 1} value={d.value}
                    onChange={e => setDrivers(prev => ({ ...prev, [d.key]: parseFloat(e.target.value) }))}
                    style={{ width: "100%", height: 4, appearance: "none", background: c.surfaceAlt, borderRadius: 4, outline: "none", accentColor: d.color }}
                  />
                </div>
              ))}
              <div style={{ fontSize: 9, color: c.textFaint, marginTop: 8, lineHeight: 1.5 }}>Drivers apply to Base Case. Drag sliders to model impact on revenue and margin.</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SETTINGS VIEW (minimal)
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
// ENV 11: CUSTOMER SIGN-IN / SIGN-OUT / ACCOUNT DELETION
// ══════════════════════════════════════════════════════════════
const SettingsView = ({ c, onLogout, toast, mode }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [activeTab, setActiveTab] = useState("org");
  const [sessionExpanded, setSessionExpanded] = useState(false);
  const tabs = [
    { id: "org", label: "Organization" },
    { id: "billing", label: "Billing" },
    { id: "security", label: "Security" },
    { id: "session", label: "Session" },
  ];
  return (
    <div style={{ padding: 32, maxWidth: 720 }}>
      {/* View Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", marginBottom: 4 }}>Settings</div>
        <div style={{ fontSize: 12, color: c.textDim }}>Manage your account, billing, notifications, and preferences</div>
      </div>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: c.surfaceAlt, borderRadius: 10, padding: 3, border: `1px solid ${c.borderSub}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, fontSize: 11, padding: "8px 0", borderRadius: 7, border: "none",
            background: activeTab === t.id ? c.surface : "transparent",
            color: activeTab === t.id ? c.text : c.textDim,
            fontWeight: activeTab === t.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
            boxShadow: activeTab === t.id ? c.shadow1 : "none", transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "org" && (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: c.text, marginBottom: 14 }}>Organization</div>
          {[{ label: "Company", value: "Acme SaaS Corp" }, { label: "Fiscal Year End", value: "December 31" }, { label: "Currency", value: "USD" }, { label: "Plan", value: "Growth — $1,799/mo billed annually" }, { label: "Seats", value: "12 of 25 used" }, { label: "Data Region", value: "US-East (Virginia)" }, { label: "SSO Provider", value: "Not configured" }].map(f => (
            <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 12 }}>
              <span style={{ color: c.textDim }}>{f.label}</span>
              <span style={{ color: c.text, fontWeight: 600 }}>{f.value}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "billing" && (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: c.text, marginBottom: 14 }}>Billing & Subscription</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, padding: 14, borderRadius: 10, background: c.accentDim, border: `1px solid ${c.accent}20` }}>
              <div style={{ fontSize: 10, color: c.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Current Plan</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.text }}>Growth</div>
              <div style={{ fontSize: 11, color: c.textDim, marginTop: 2 }}>$1,799/mo · Annual billing</div>
            </div>
            <div style={{ flex: 1, padding: 14, borderRadius: 10, background: c.greenDim, border: `1px solid ${c.green}20` }}>
              <div style={{ fontSize: 10, color: c.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Next Invoice</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.text }}>$17,988</div>
              <div style={{ fontSize: 11, color: c.textDim, marginTop: 2 }}>January 15, 2026</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: c.textDim, marginBottom: 14 }}>Payment: Visa ending 4242 · Billing contact: finance@acme.io</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "Manage Subscription", url: "https://billing.stripe.com/p/login/bIY00B0b37cMbWo3cc" },
              { label: "View Invoices", url: "https://billing.stripe.com/p/login/bIY00B0b37cMbWo3cc" },
              { label: "Update Payment Method", url: "https://billing.stripe.com/p/login/bIY00B0b37cMbWo3cc" },
            ].map(b => (
              <button key={b.label} style={{ fontSize: 11, padding: "9px 18px", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; }}
                onClick={() => { try { window.open(b.url, "_blank"); } catch {} toast(`Opening ${b.label}...`, "success"); }}
              >{b.label}</button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: c.text, marginBottom: 14 }}>Security & Access</div>
          {[{ label: "Two-Factor Authentication", value: "Enabled (TOTP)", status: "green" }, { label: "Last Password Change", value: "42 days ago", status: "amber" }, { label: "Active Sessions", value: "2 devices", status: "accent" }, { label: "API Keys", value: "1 active (created Mar 2)", status: "accent" }, { label: "Audit Log", value: "312 events this month", status: "accent" }].map(f => (
            <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 12 }}>
              <span style={{ color: c.textDim }}>{f.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: c[f.status] }} />
                <span style={{ color: c.text, fontWeight: 600 }}>{f.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "session" && (<>
        {/* Sign Out */}
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: c.text, marginBottom: 6 }}>Active Session</div>
          <div style={{ fontSize: 11, color: c.textDim, marginBottom: 14 }}>Signed in as <span style={{ color: c.text, fontWeight: 600 }}>sarah.chen@acme.io</span> · VP Finance</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[{ label: "Device", value: "MacBook Pro" }, { label: "Browser", value: "Chrome 122" }, { label: "Location", value: "San Francisco, CA" }, { label: "IP", value: "192.168.1.***" }].map(d => (
              <div key={d.label} style={{ flex: 1, padding: "8px 10px", borderRadius: 6, background: c.surfaceAlt, fontSize: 10 }}>
                <div style={{ color: c.textFaint, marginBottom: 2 }}>{d.label}</div>
                <div style={{ color: c.text, fontWeight: 600 }}>{d.value}</div>
              </div>
            ))}
          </div>
          <button onClick={onLogout} style={{ fontSize: 11, padding: "9px 18px", borderRadius: 8, border: `1px solid ${c.amber}40`, background: c.amberDim, color: c.amber, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <LogOut size={13} /> Sign Out of This Device
          </button>
        </div>
        {/* Delete Account */}
        <div style={{ background: c.surface, border: `1px solid ${c.red}30`, borderRadius: 14, padding: 22, boxShadow: c.cardGlow }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: c.red, marginBottom: 6 }}>Delete Account</div>
          <div style={{ fontSize: 12, color: c.textDim, lineHeight: 1.7, marginBottom: 14 }}>Permanently delete your organization, all users, financial data, integrations, and AI conversation history. This action is irreversible and takes effect within 24 hours.</div>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)} style={{ fontSize: 11, padding: "9px 18px", borderRadius: 8, border: `1px solid ${c.red}40`, background: c.redDim, color: c.red, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Delete Account</button>
          ) : (
            <div>
              <div style={{ fontSize: 11, color: c.red, fontWeight: 600, marginBottom: 8 }}>Type "DELETE ACME SAAS CORP" to confirm:</div>
              <input value={deleteText} onChange={e => setDeleteText(e.target.value)} placeholder="DELETE ACME SAAS CORP" style={{
                width: "100%", fontSize: 12, padding: "9px 14px", borderRadius: 8, border: `1px solid ${c.red}40`,
                background: c.bg2, color: c.text, fontFamily: "'JetBrains Mono', monospace", outline: "none", marginBottom: 10,
              }} />
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button disabled={deleteText !== "DELETE ACME SAAS CORP"} onClick={() => { setDeleteConfirm(false); setDeleteText(""); toast("Account deletion scheduled. Confirmation email sent.", "warning"); }} style={{ fontSize: 11, padding: "9px 18px", borderRadius: 8, border: "none", background: deleteText === "DELETE ACME SAAS CORP" ? c.red : c.textFaint, color: "#fff", cursor: deleteText === "DELETE ACME SAAS CORP" ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700, opacity: deleteText === "DELETE ACME SAAS CORP" ? 1 : 0.4 }}>Permanently Delete</button>
                <button onClick={() => { setDeleteConfirm(false); setDeleteText(""); }} style={{ fontSize: 11, padding: "9px 18px", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </>)}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MARKETING LANDING PAGE
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
// PIPELINE 2: PRIVACY — Cookie Consent + GDPR/CCPA
// ══════════════════════════════════════════════════════════════
const CookieConsent = ({ c }) => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return localStorage.getItem("fos_cookie_consent") !== "accepted"; }
    catch { return true; }
  });
  const [prefs, setPrefs] = useState(false);
  const accept = (level) => {
    setVisible(false);
    try { localStorage.setItem("fos_cookie_consent", "accepted"); localStorage.setItem("fos_cookie_level", level); } catch {}
  };
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: 20, left: 20, right: 20, maxWidth: 520, zIndex: 9999,
      background: `${c?.surface || "#131316"}f5`, border: `1px solid ${c?.border || "#23232a"}`,
      borderRadius: 16, padding: "20px 24px", boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
      backdropFilter: "blur(16px)", fontFamily: "'DM Sans', system-ui, sans-serif",
      animation: "fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: c?.text || "#f0f2f5", marginBottom: 8 }}>Privacy Preferences</div>
      <div style={{ fontSize: 12, color: c?.textDim || "#6b7280", lineHeight: 1.7, marginBottom: 14 }}>
        FinanceOS uses essential cookies for authentication and security. We do not use advertising cookies or sell your data. Analytics cookies help us improve the product.
      </div>
      {prefs && (
        <div style={{ marginBottom: 14, padding: 12, background: c?.bg2 || "#0c0c0f", borderRadius: 8, fontSize: 11 }}>
          {[
            { name: "Essential", desc: "Authentication, security, session management", required: true, on: true },
            { name: "Analytics", desc: "Usage patterns to improve the product", required: false, on: true },
            { name: "Marketing", desc: "Not used — we do not run ads", required: false, on: false },
          ].map(cookie => (
            <div key={cookie.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${c?.borderSub || "#1b1b20"}` }}>
              <div>
                <span style={{ color: c?.text || "#f0f2f5", fontWeight: 600 }}>{cookie.name}</span>
                <span style={{ color: c?.textFaint || "#44495a", marginLeft: 8 }}>{cookie.desc}</span>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: cookie.on ? (c?.greenDim || "rgba(52,211,153,0.08)") : (c?.redDim || "rgba(248,113,113,0.08)"), color: cookie.on ? (c?.green || "#34d399") : (c?.red || "#f87171") }}>
                {cookie.required ? "REQUIRED" : cookie.on ? "ON" : "OFF"}
              </span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => accept("all")} style={{ fontSize: 12, padding: "9px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Accept All</button>
        <button onClick={() => accept("essential")} style={{ fontSize: 12, padding: "9px 18px", borderRadius: 8, border: `1px solid ${c?.border || "#23232a"}`, background: "transparent", color: c?.textSec || "#9ca3b0", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Essential Only</button>
        <button onClick={() => setPrefs(!prefs)} style={{ fontSize: 11, padding: "9px 12px", borderRadius: 8, border: "none", background: "transparent", color: c?.textDim || "#6b7280", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{prefs ? "Hide" : "Manage"}</button>
        <a href="#" style={{ marginLeft: "auto", fontSize: 10, color: c?.textFaint || "#44495a" }}>Privacy Policy</a>
      </div>
    </div>
  );
};


// ══════════════════════════════════════════════════════════════
// AUTH MODAL — Sign In / Sign Up / Demo Request
// ══════════════════════════════════════════════════════════════
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
);
const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18}><rect fill="#F25022" x="1" y="1" width="10" height="10"/><rect fill="#7FBA00" x="13" y="1" width="10" height="10"/><rect fill="#00A4EF" x="1" y="13" width="10" height="10"/><rect fill="#FFB900" x="13" y="13" width="10" height="10"/></svg>
);

const AuthModal = ({ mode: initialMode, onClose, onAuth }) => {
  const [authMode, setAuthMode] = useState(initialMode || "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Password strength
  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 10) ? 4 : 3;
  const pwLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const pwColor = ["transparent", "#ef4444", "#f59e0b", "#60a5fa", "#34d399"][pwStrength];

  // OAuth sign-in — redirects to provider
  const handleOAuth = async (provider) => {
    setLoading(provider);
    setError(null);
    const providerMap = { Google: "google", Microsoft: "azure", Apple: "apple" };
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: providerMap[provider],
      options: { redirectTo: typeof window !== "undefined" ? window.location.origin : "https://finance-os.app" },
    });
    if (err) { setError(err.message); setLoading(null); }
    // On success, browser redirects — no need to call onAuth
  };

  // Email sign-up or sign-in
  const handleEmail = async () => {
    if (!email.trim() || !password.trim()) { setError("Email and password required"); return; }
    setLoading("email");
    setError(null);
    try {
      if (authMode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(), password: password.trim(),
          options: { data: { full_name: name, company, role } },
        });
        if (err) { setError(err.message); setLoading(null); return; }
        // Also add to waitlist
        try { await supabase.from("waitlist").upsert({ email: email.trim(), full_name: name, company, role, interest_type: "trial", source: "signup_modal" }, { onConflict: "email" }); } catch {}
        // If auto-confirmed, trigger login immediately
        if (data?.session) { onAuth({ method: "email" }); return; }
        setError("Check your email for a confirmation link");
        setLoading(null);
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
        if (err) { setError(err.message); setLoading(null); return; }
        // Explicitly trigger login — don't rely solely on onAuthStateChange
        if (data?.session) { onAuth({ method: "email" }); return; }
        setLoading(null);
      }
    } catch (e) {
      setError(e?.message || "Authentication failed");
      setLoading(null);
    }
  };

  // Demo request — just saves to waitlist
  const handleDemo = async () => {
    setLoading("email");
    setError(null);
    try { await supabase.from("waitlist").upsert({ email: email.trim(), full_name: name, company, role, interest_type: "demo", source: "demo_modal" }, { onConflict: "email" }); } catch {}
    setLoading(null);
    onAuth({ method: "demo" });
  };

  const handleForgot = async () => {
    if (!email.trim()) { setError("Enter your email address first"); return; }
    setLoading("forgot"); setError(null);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: typeof window !== "undefined" ? window.location.origin : "https://finance-os.app" });
    if (err) { setError(err.message); } else { setResetSent(true); }
    setLoading(null);
  };

  const inputStyle = {
    width: "100%", fontSize: 14, padding: "12px 14px", borderRadius: 10,
    border: "1px solid #23232a", background: "#0c0c0f", color: "#f0f2f5",
    fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 420, maxHeight: "90vh", overflow: "auto", background: "#111114", border: "1px solid #23232a", borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", animation: "cmdIn 0.25s cubic-bezier(0.22,1,0.36,1)" }}>
        {/* Header */}
        <div style={{ padding: "28px 32px 0", textAlign: "center", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 28, height: 28, borderRadius: 8, border: "1px solid #23232a", background: "transparent", color: "#6b7280", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            <X size={14} />
          </button>
          <FosLogo size={36} />
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4, marginTop: 14 }}>
            {authMode === "login" ? "Welcome back" : authMode === "signup" ? "Start your free trial" : "Request a demo"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
            {authMode === "login" ? "Sign in to your FinanceOS workspace" : authMode === "signup" ? "14 days free · No credit card · Cancel anytime" : "Our team will prepare a personalized walkthrough"}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 32px 32px" }}>
          {/* SSO Buttons */}
          {(authMode === "login" || authMode === "signup") && (<>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[
                { name: "Google", icon: <GoogleIcon />, key: "google" },
                { name: "Microsoft", icon: <MicrosoftIcon />, key: "microsoft" },
                { name: "Apple", icon: <svg viewBox="0 0 24 24" width={15} height={15}><path fill="#fff" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>, key: "apple" },
              ].map(p => (
                <button key={p.key} onClick={() => handleOAuth(p.name === "Apple" ? "Apple" : p.name)} disabled={!!loading} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 0", borderRadius: 10,
                  border: "1px solid #23232a", background: "#0c0c0f", color: "#f0f2f5", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                  cursor: loading ? "wait" : "pointer", transition: "all 0.15s", opacity: loading && loading !== p.key ? 0.4 : 1,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = "#33384a"; e.currentTarget.style.background = "#131316"; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#23232a"; e.currentTarget.style.background = "#0c0c0f"; }}
                >{p.icon} {loading === p.key ? "..." : p.name}</button>
              ))}
            </div>
            {error && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 12, color: "#ef4444", marginBottom: 8, textAlign: "center" }}>{error}</div>}
            {resetSent && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", fontSize: 12, color: "#34d399", marginBottom: 8, textAlign: "center" }}>Password reset link sent to {email}</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0 14px" }}>
              <div style={{ flex: 1, height: 1, background: "#23232a" }} />
              <span style={{ fontSize: 10, color: "#44495a", textTransform: "uppercase", letterSpacing: "0.08em" }}>or email</span>
              <div style={{ flex: 1, height: 1, background: "#23232a" }} />
            </div>
          </>)}

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(authMode === "signup" || authMode === "demo") && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#60a5fa"; e.target.style.boxShadow = "0 0 0 3px rgba(96,165,250,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#23232a"; e.target.style.boxShadow = "none"; }}
                />
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#60a5fa"; e.target.style.boxShadow = "0 0 0 3px rgba(96,165,250,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#23232a"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={authMode === "demo" ? "Work email" : "Email address"} style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "#60a5fa"; e.target.style.boxShadow = "0 0 0 3px rgba(96,165,250,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#23232a"; e.target.style.boxShadow = "none"; }}
              onKeyDown={e => e.key === "Enter" && (authMode === "demo" ? handleDemo() : handleEmail())}
            />
            {authMode !== "demo" && (
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={authMode === "signup" ? "Create password (8+ chars)" : "Password"} style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = "#60a5fa"; e.target.style.boxShadow = "0 0 0 3px rgba(96,165,250,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#23232a"; e.target.style.boxShadow = "none"; }}
                  onKeyDown={e => e.key === "Enter" && handleEmail()}
                />
                <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={14} color={showPw ? "#60a5fa" : "#44495a"} /></button>
              </div>
            )}
            {authMode === "signup" && password.length > 0 && (
              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= pwStrength ? pwColor : "#23232a", transition: "background 0.2s" }} />)}
                <span style={{ fontSize: 10, fontWeight: 600, color: pwColor, marginLeft: 6, minWidth: 36 }}>{pwLabel}</span>
              </div>
            )}
            {authMode === "demo" && (
              <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select role...</option>
                <option>CFO / VP Finance</option><option>FP&A Manager / Director</option><option>Controller</option><option>Finance Analyst</option><option>RevOps / BizOps</option><option>CEO / COO</option>
              </select>
            )}
            <button onClick={() => authMode === "demo" ? handleDemo() : handleEmail()} disabled={!!loading} style={{
              width: "100%", padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: loading ? "wait" : "pointer",
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", fontFamily: "inherit", marginTop: 2,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading === "email" ? 0.7 : 1,
              transition: "all 0.2s", boxShadow: "0 4px 16px rgba(96,165,250,0.2)",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              {loading === "email" && <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />}
              {authMode === "login" ? "Sign In" : authMode === "signup" ? "Create Account" : "Request Demo"}
            </button>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#44495a" }}>
            {authMode === "login" ? (<>
              <span style={{ cursor: "pointer", color: "#60a5fa" }} onClick={handleForgot}>{loading === "forgot" ? "Sending..." : "Forgot password?"}</span>
              <span> · </span><span style={{ cursor: "pointer", color: "#60a5fa", fontWeight: 600 }} onClick={() => { setAuthMode("signup"); setError(null); setResetSent(false); }}>Create account</span>
            </>) : authMode === "signup" ? (<>
              Already have an account? <span style={{ cursor: "pointer", color: "#60a5fa", fontWeight: 600 }} onClick={() => { setAuthMode("login"); setError(null); }}>Sign in</span>
            </>) : (<>
              Want to explore first? <span style={{ cursor: "pointer", color: "#60a5fa", fontWeight: 600 }} onClick={() => { setAuthMode("signup"); setError(null); }}>Start free trial</span>
            </>)}
          </div>

          {/* Trust signals */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16, paddingTop: 14, borderTop: "1px solid #1b1b20" }}>
            {[{ icon: Shield, label: "SOC 2" }, { icon: Zap, label: "AES-256" }, { icon: Globe, label: "99.99% SLA" }].map(t => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#44495a", fontWeight: 600 }}>
                <t.icon size={10} color="#44495a" /> {t.label}
              </div>
            ))}
          </div>
          {authMode === "signup" && (
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: "#33384a", lineHeight: 1.6 }}>
              By creating an account you agree to our{" "}
              <span style={{ color: "#60a5fa", cursor: "pointer" }} onClick={() => window.open("https://finance-os.app/terms", "_blank")}>Terms of Service</span>{" "}and{" "}
              <span style={{ color: "#60a5fa", cursor: "pointer" }} onClick={() => window.open("https://finance-os.app/privacy", "_blank")}>Privacy Policy</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── PLAN PICKER — shows Stripe checkout links after signup ───
const PLAN_OPTIONS = [
  { name: "Starter", price: "$599", annual: "$499", desc: "3 entities · 5 users · P&L + Forecast",
    monthlyLink: "https://buy.stripe.com/eVqaEX2GH18e0VcbIVdwc0o", annualLink: "https://buy.stripe.com/bJe4gza995ougUa28ldwc0p" },
  { name: "Growth", price: "$1,799", annual: "$1,499", desc: "10 entities · 25 users · AI Copilot · Consolidation", popular: true,
    monthlyLink: "https://buy.stripe.com/bJe7sL1CDcQWeM200ddwc0q", annualLink: "https://buy.stripe.com/cNieVd0yz8AG47obIVdwc0r" },
  { name: "Business", price: "$4,799", annual: "$3,999", desc: "Unlimited · Custom ML · SSO + RBAC · Dedicated CSM",
    monthlyLink: "https://buy.stripe.com/7sY8wPbdd04a8nE9ANdwc0s", annualLink: "https://buy.stripe.com/dRmaEX811dV0eM23cpdwc0t" },
];

// ── ONBOARDING WIZARD ────────────────────────────────────────
const OnboardingWizard = ({ c, userName, onComplete }) => {
  const [step, setStep] = useState(0);
  const [org, setOrg] = useState({ name: "", industry: "", fy: "December", currency: "USD", erp: "" });
  const steps = [
    { title: "Set up your organization", sub: "Basic details to customize your experience" },
    { title: "Connect your data", sub: "Link your ERP, CRM, or billing system" },
    { title: "You're all set", sub: "Your workspace is ready" },
  ];
  const erps = ["NetSuite", "QuickBooks", "Xero", "SAP", "Sage Intacct", "Workday", "Other", "Skip for now"];
  const inputStyle = { width: "100%", fontSize: 13, padding: "11px 14px", borderRadius: 10, border: `1px solid ${c?.border || "#23232a"}`, background: c?.surfaceAlt || "#0c0c0f", color: c?.text || "#f0f2f5", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}>
      <div style={{ width: 500, background: c?.surface || "#131316", border: `1px solid ${c?.border || "#23232a"}`, borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", padding: "36px 40px", animation: "cmdIn 0.25s cubic-bezier(0.22,1,0.36,1)" }}>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i <= step ? (c?.accent || "#60a5fa") : (c?.borderBright || "#33384a"), transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)" }} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: c?.text || "#f0f2f5", marginBottom: 6 }}>
            {step === 2 ? `Welcome aboard${userName && userName !== "Guest" ? `, ${userName.split(" ")[0]}` : ""}!` : steps[step].title}
          </div>
          <div style={{ fontSize: 13, color: c?.textDim || "#6b7280" }}>{steps[step].sub}</div>
        </div>

        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input value={org.name} onChange={e => setOrg(p => ({ ...p, name: e.target.value }))} placeholder="Company name" style={inputStyle} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <select value={org.industry} onChange={e => setOrg(p => ({ ...p, industry: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Industry</option>
                {["SaaS / Software", "Financial Services", "E-commerce", "Healthcare", "Manufacturing", "Professional Services", "Other"].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <select value={org.currency} onChange={e => setOrg(p => ({ ...p, currency: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                {["USD", "EUR", "GBP", "CAD", "AUD", "JPY"].map(cur => <option key={cur} value={cur}>{cur}</option>)}
              </select>
            </div>
            <select value={org.fy} onChange={e => setOrg(p => ({ ...p, fy: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
              {["January", "February", "March", "April", "June", "July", "September", "October", "December"].map(m => <option key={m} value={m}>Fiscal year ends {m}</option>)}
            </select>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {erps.map(e => (
              <button key={e} onClick={() => setOrg(p => ({ ...p, erp: e }))} style={{
                padding: "14px 16px", borderRadius: 10, border: `1px solid ${org.erp === e ? (c?.accent || "#60a5fa") : (c?.border || "#23232a")}`,
                background: org.erp === e ? (c?.accentDim || "rgba(96,165,250,0.08)") : "transparent",
                color: org.erp === e ? (c?.accent || "#60a5fa") : (c?.textSec || "#9ca3b0"),
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                textAlign: "left",
              }}>{e}</button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", padding: "8px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${c?.green || "#34d399"}, ${c?.accent || "#60a5fa"})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
              <Check size={28} color="#fff" strokeWidth={3} />
            </div>
            <div style={{ fontSize: 12, color: c?.textDim || "#6b7280", textAlign: "center", lineHeight: 1.7 }}>
              {org.name && <span>Organization: <strong style={{ color: c?.text || "#f0f2f5" }}>{org.name}</strong><br /></span>}
              {org.erp && org.erp !== "Skip for now" && <span>Data source: <strong style={{ color: c?.text || "#f0f2f5" }}>{org.erp}</strong><br /></span>}
              Your dashboard is loaded with sample data. Connect live data anytime from Integrations.
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ fontSize: 12, color: c?.textDim || "#6b7280", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Back</button>
          ) : <div />}
          <button onClick={() => { if (step < 2) setStep(s => s + 1); else onComplete(org); }} style={{
            fontSize: 13, padding: "12px 28px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            background: step === 2 ? `linear-gradient(135deg, ${c?.green || "#34d399"}, ${c?.accent || "#60a5fa"})` : (c?.accent || "#60a5fa"), color: "#fff",
            boxShadow: `0 4px 16px ${(c?.accent || "#60a5fa")}25`,
          }}>{step === 2 ? "Go to Dashboard" : "Continue"}</button>
        </div>
      </div>
    </div>
  );
};

const PlanPicker = ({ userName, onSkip, onSelect, isDemo }) => {
  const [billing, setBilling] = useState("annual");
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [checkoutPending, setCheckoutPending] = useState(null); // plan name if checkout in progress
  const annualSavings = { Starter: 1200, Growth: 3600, Business: 9600 };

  const features = [
    { name: "Entities", values: ["3", "10", "Unlimited"] },
    { name: "Users", values: ["5", "25", "Unlimited"] },
    { name: "AI Copilot", values: [false, true, true] },
    { name: "Consolidation", values: [false, true, true] },
    { name: "Scenario Modeling", values: ["2 scenarios", "10 scenarios", "Unlimited"] },
    { name: "Integrations", values: ["5", "15", "30+"] },
    { name: "Custom ML Models", values: [false, false, true] },
    { name: "SSO + RBAC", values: [false, false, true] },
    { name: "Dedicated CSM", values: [false, false, true] },
    { name: "SLA", values: ["99.9%", "99.95%", "99.99%"] },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}>
      <div style={{ width: 800, maxHeight: "94vh", overflow: "auto", background: "#111114", border: "1px solid #23232a", borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", animation: "cmdIn 0.25s cubic-bezier(0.22,1,0.36,1)" }}>
        {/* Header */}
        <div style={{ padding: "32px 40px 0", textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)", fontSize: 10, fontWeight: 700, color: "#34d399", marginBottom: 12, letterSpacing: "0.04em" }}>30-DAY MONEY-BACK GUARANTEE</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
            {userName && userName !== "Guest" ? `Welcome, ${userName.split(" ")[0]}!` : "Choose your plan"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>All plans include a 14-day free trial. Upgrade, downgrade, or cancel anytime.</div>
          {/* Billing toggle */}
          <div style={{ display: "inline-flex", background: "#0c0c0f", borderRadius: 10, padding: 3, border: "1px solid #23232a" }}>
            <button onClick={() => setBilling("monthly")} style={{ fontSize: 12, padding: "8px 20px", borderRadius: 8, border: "none", background: billing === "monthly" ? "#23232a" : "transparent", color: billing === "monthly" ? "#f0f2f5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}>Monthly</button>
            <button onClick={() => setBilling("annual")} style={{ fontSize: 12, padding: "8px 20px", borderRadius: 8, border: "none", background: billing === "annual" ? "#23232a" : "transparent", color: billing === "annual" ? "#f0f2f5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s", position: "relative" }}>
              Annual
              <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(52,211,153,0.12)", color: "#34d399" }}>SAVE 17%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ padding: "24px 40px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {PLAN_OPTIONS.map((p, idx) => {
              const isHovered = hoveredPlan === idx;
              return (
              <div key={p.name} onMouseEnter={() => setHoveredPlan(idx)} onMouseLeave={() => setHoveredPlan(null)} style={{
                background: p.popular ? "linear-gradient(180deg, rgba(96,165,250,0.06) 0%, #0c0c0f 100%)" : "#0c0c0f",
                border: `1px solid ${p.popular ? "#60a5fa" : isHovered ? "#33384a" : "#1b1b20"}`,
                borderRadius: 16, padding: "24px 20px", position: "relative", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                transform: isHovered ? "translateY(-4px)" : "none",
                boxShadow: p.popular ? "0 0 0 1px rgba(96,165,250,0.15), 0 8px 30px rgba(96,165,250,0.08)" : isHovered ? "0 12px 40px rgba(0,0,0,0.3)" : "none",
              }}>
                {p.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", borderRadius: 8, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>MOST POPULAR</div>}
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: "#f0f2f5" }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "#f0f2f5" }}>{billing === "annual" ? p.annual : p.price}</span>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>/mo</span>
                </div>
                {billing === "annual" && (
                  <div style={{ fontSize: 11, color: "#34d399", fontWeight: 600, marginBottom: 10 }}>Save ${annualSavings[p.name]?.toLocaleString()}/year</div>
                )}
                {billing === "monthly" && <div style={{ height: 18 }} />}
                <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6, marginBottom: 16, minHeight: 36 }}>{p.desc}</div>
                <button onClick={() => {
                  setCheckoutPending(p.name);
                  try { window.open(billing === "annual" ? p.annualLink : p.monthlyLink, "_blank"); } catch {}
                }} style={{
                  width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                  background: p.popular ? "linear-gradient(135deg, #60a5fa, #a78bfa)" : isHovered ? "#33384a" : "#23232a", color: "#fff",
                  transition: "all 0.2s", boxShadow: p.popular ? "0 4px 16px rgba(96,165,250,0.2)" : "none",
                }}
                onMouseEnter={e => { if (!p.popular) e.currentTarget.style.background = "#33384a"; }}
                onMouseLeave={e => { if (!p.popular) e.currentTarget.style.background = "#23232a"; }}
                >Start {p.name} Trial</button>
              </div>
              );
            })}
          </div>
        </div>

        {/* Checkout confirmation gate */}
        {checkoutPending && (
          <div style={{ padding: "24px 40px", textAlign: "center" }}>
            <div style={{ background: "linear-gradient(135deg, rgba(96,165,250,0.06), rgba(167,139,250,0.04))", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 16, padding: "32px 28px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>💳</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#f0f2f5", marginBottom: 6 }}>Complete your {checkoutPending} checkout</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
                A Stripe checkout tab has opened. Complete your payment there, then return here to confirm.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => onSelect(checkoutPending)} style={{
                  fontSize: 14, padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                  background: "linear-gradient(135deg, #34d399, #22d3ee)", color: "#fff", boxShadow: "0 4px 16px rgba(52,211,153,0.2)",
                }}>I've Completed Payment</button>
                <button onClick={() => setCheckoutPending(null)} style={{
                  fontSize: 13, padding: "12px 20px", borderRadius: 10, border: "1px solid #23232a", background: "transparent", color: "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                }}>Go Back</button>
              </div>
              <div style={{ fontSize: 10, color: "#44495a", marginTop: 14 }}>Your subscription will be verified. If payment is not found, you'll be asked to retry.</div>
            </div>
          </div>
        )}

        {/* Feature comparison */}
        {!checkoutPending && (
        <div style={{ padding: "24px 40px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#44495a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Feature Comparison</div>
          <div style={{ background: "#0c0c0f", border: "1px solid #1b1b20", borderRadius: 12, overflow: "hidden" }}>
            {features.map((f, i) => (
              <div key={f.name} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", borderBottom: i < features.length - 1 ? "1px solid #1b1b20" : "none", fontSize: 11 }}>
                <div style={{ padding: "8px 14px", color: "#9ca3b0", fontWeight: 500 }}>{f.name}</div>
                {f.values.map((v, j) => (
                  <div key={j} style={{ padding: "8px 14px", textAlign: "center", color: v === true ? "#34d399" : v === false ? "#33384a" : "#f0f2f5", fontWeight: v === true || v === false ? 400 : 600, fontFamily: typeof v === "string" ? "'JetBrains Mono', monospace" : "inherit" }}>
                    {v === true ? "✓" : v === false ? "—" : v}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Footer */}
        {!checkoutPending && (
        <div style={{ padding: "20px 40px 28px", textAlign: "center" }}>
          {isDemo ? (
            <button onClick={onSkip} style={{ fontSize: 12, color: "#6b7280", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", marginBottom: 12 }}>Continue with demo — explore with sample data</button>
          ) : (
            <div style={{ fontSize: 11, color: "#44495a", marginBottom: 12 }}>All plans include: SOC 2 compliance · AES-256 encryption · 24/7 monitoring · Email support</div>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            {["2,400+ demo users", "NPS 72", "$840K pipeline"].map(s => (
              <div key={s} style={{ fontSize: 10, color: "#44495a", fontWeight: 600 }}>{s}</div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

// ── PRODUCT DEMO (Jira-inspired tabbed showcase) ─────────────
const DEMO_TABS = [
  { id: "planning", label: "FP&A Planning",
    title: "Plan with confidence", sub: "Connect actuals to forecasts in real-time. Drag sliders to model scenarios, compare budget vs actual, and surface variances before they become problems.",
    kpis: [{ l: "Models", v: "4 active" }, { l: "MAPE", v: "3.2%" }, { l: "Drivers", v: "14" }] },
  { id: "copilot", label: "AI Copilot",
    title: "Ask, don't search", sub: "Natural language queries across your entire financial model. Ask 'Why did COGS spike in February?' and get a sourced, reasoned answer — not a chart dump.",
    kpis: [{ l: "Reasoning", v: "Visible" }, { l: "Sources", v: "Cited" }, { l: "Latency", v: "<2s" }] },
  { id: "consolidation", label: "Consolidation",
    title: "Close in hours, not weeks", sub: "Multi-entity consolidation with automatic intercompany eliminations, FX adjustments, and entity-level approval workflows.",
    kpis: [{ l: "Entities", v: "Unlimited" }, { l: "IC Elim", v: "Auto" }, { l: "Currencies", v: "40+" }] },
  { id: "integrations", label: "Integrations",
    title: "Your stack, connected", sub: "30+ native integrations — NetSuite, Salesforce, Stripe, Snowflake, Rippling. Bi-directional sync with real-time data freshness indicators.",
    kpis: [{ l: "Connectors", v: "30+" }, { l: "Sync", v: "Real-time" }, { l: "Setup", v: "< 5 min" }] },
];

const ProductDemo = ({ enterDemo }) => {
  const [tab, setTab] = useState("planning");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const active = DEMO_TABS.find(d => d.id === tab) || DEMO_TABS[0];
  return (
    <div style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.12)", fontSize: 10, fontWeight: 700, color: "#60a5fa", marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Product Tour</div>
        <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>See it in action</h2>
        <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 480, margin: "0 auto" }}>Explore the platform by use case. Click a tab to see how each module works.</p>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32 }}>
        {DEMO_TABS.map(d => (
          <button key={d.id} onClick={() => setTab(d.id)} style={{
            fontSize: 13, padding: "10px 20px", borderRadius: 10, border: tab === d.id ? "1px solid #60a5fa" : "1px solid #23232a",
            background: tab === d.id ? "rgba(96,165,250,0.08)" : "transparent",
            color: tab === d.id ? "#60a5fa" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s",
          }}>{d.label}</button>
        ))}
      </div>
      {/* Content + Mockup */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 32, alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>{active.title}</h3>
          <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>{active.sub}</p>
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            {active.kpis.map(k => (
              <div key={k.l} style={{ padding: "10px 16px", borderRadius: 10, background: "#131316", border: "1px solid #1b1b20" }}>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{k.v}</div>
                <div style={{ fontSize: 10, color: "#44495a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.l}</div>
              </div>
            ))}
          </div>
          <button onClick={enterDemo} style={{ fontSize: 14, padding: "12px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 4px 16px rgba(96,165,250,0.25)" }}>Try This Feature</button>
        </div>
        {/* Browser mockup */}
        <div style={{ background: "#0c0c0f", border: "1px solid #23232a", borderRadius: 16, padding: 4, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
          <div style={{ background: "#111114", borderRadius: 13, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "#0c0c0f", borderBottom: "1px solid #1b1b20" }}>
              <div style={{ display: "flex", gap: 5 }}>{["#ef4444","#fbbf24","#22c55e"].map(cl => <div key={cl} style={{ width: 8, height: 8, borderRadius: "50%", background: cl }} />)}</div>
              <div style={{ flex: 1, marginLeft: 8, padding: "4px 12px", borderRadius: 6, background: "#0a0a0d", border: "1px solid #1b1b20", fontSize: 10, color: "#44495a" }}>app.finance-os.app/{active.id}</div>
            </div>
            <div style={{ padding: 20, minHeight: 280 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 40, background: "#1b1b20", borderRadius: 8, minHeight: 240 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#f0f2f5" }}>{active.title}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                    {active.kpis.map((k, i) => (
                      <div key={k.l} style={{ background: "#131316", border: "1px solid #1b1b20", borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: ["#60a5fa","#34d399","#a78bfa"][i], fontFamily: "'JetBrains Mono', monospace" }}>{k.v}</div>
                        <div style={{ fontSize: 8, color: "#44495a", marginTop: 2 }}>{k.l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 120, background: "linear-gradient(180deg, rgba(96,165,250,0.05), transparent)", borderRadius: 8, border: "1px solid #1b1b20", overflow: "hidden" }}>
                    <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
                      <defs><linearGradient id={`dg-${active.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2"/><stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/></linearGradient></defs>
                      <path d="M0,90 C40,85 80,70 120,60 C160,50 200,55 240,40 C280,25 320,30 360,20 L400,15 L400,120 L0,120 Z" fill={`url(#dg-${active.id})`}/>
                      <path d="M0,90 C40,85 80,70 120,60 C160,50 200,55 240,40 C280,25 320,30 360,20 L400,15" fill="none" stroke="#60a5fa" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onLogin }) => {
  const [billing, setBilling] = useState("annual");
  const [authModal, setAuthModal] = useState(null);
  const [heroEmail, setHeroEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Demo entry — enters dashboard with sample data, plan picker has skip option
  const enterDemo = () => { onLogin({ name: heroEmail?.split("@")[0] || "Guest", email: heroEmail || "", plan: "demo" }); };

  // Inline email signup → Supabase waitlist → enter demo
  const handleHeroSignup = async () => {
    if (!heroEmail.trim() || !heroEmail.includes("@")) { enterDemo(); return; }
    setEmailStatus("saving");
    try {
      await supabase.from("waitlist").upsert({ email: heroEmail.trim(), interest_type: "trial", source: "hero" }, { onConflict: "email" });
      setEmailStatus("saved");
    } catch { setEmailStatus("error"); }
    onLogin({ name: heroEmail.split("@")[0], email: heroEmail, plan: "demo" });
  };

  // Auth modal callback — authenticated users must pick a plan (no skip)
  const handleAuth = (data) => {
    onLogin({ name: data?.name || data?.email?.split("@")[0] || "Guest", email: data?.email || "", method: data?.method });
  };

  const plans = [
    { name: "Starter", monthly: 599, annual: 499, features: ["3 entities", "5 users", "P&L + Forecast", "Email support"],
      linkMonthly: "https://buy.stripe.com/eVqaEX2GH18e0VcbIVdwc0o", linkAnnual: "https://buy.stripe.com/bJe4gza995ougUa28ldwc0p" },
    { name: "Growth", monthly: 1799, annual: 1499, features: ["10 entities", "25 users", "AI Copilot", "Consolidation", "Priority support"], popular: true,
      linkMonthly: "https://buy.stripe.com/bJe7sL1CDcQWeM200ddwc0q", linkAnnual: "https://buy.stripe.com/cNieVd0yz8AG47obIVdwc0r" },
    { name: "Business", monthly: 4799, annual: 3999, features: ["Unlimited entities", "Unlimited users", "Custom ML models", "SSO + RBAC", "Dedicated CSM", "SLA guarantee"],
      linkMonthly: "https://buy.stripe.com/7sY8wPbdd04a8nE9ANdwc0s", linkAnnual: "https://buy.stripe.com/dRmaEX811dV0eM23cpdwc0t" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#f0f2f5", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "auto" }}>
      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-15%", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 65%)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 65%)", filter: "blur(100px)" }} />
      </div>

      {/* Nav */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px 20px" : "20px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FosLogo size={32} />
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>Finance<span style={{ fontWeight: 400, opacity: 0.6 }}>OS</span></span>
        </div>
        {!isMobile ? (
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="#features" style={{ fontSize: 13, color: "#9ca3b0", textDecoration: "none", fontWeight: 500 }}>Features</a>
          <a href="#security" style={{ fontSize: 13, color: "#9ca3b0", textDecoration: "none", fontWeight: 500 }}>Security</a>
          <a href="#pricing" style={{ fontSize: 13, color: "#9ca3b0", textDecoration: "none", fontWeight: 500 }}>Pricing</a>
          <a href="#invest" style={{ fontSize: 13, color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}>Investors</a>
          <button onClick={() => setAuthModal("login")} style={{ fontSize: 13, padding: "9px 20px", borderRadius: 8, border: "1px solid #23232a", background: "transparent", color: "#f0f2f5", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Sign In</button>
          <button onClick={enterDemo} style={{ fontSize: 13, padding: "9px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 4px 16px rgba(96,165,250,0.25)" }}>Start Free Trial</button>
        </div>
        ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setAuthModal("login")} style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, border: "1px solid #23232a", background: "transparent", color: "#f0f2f5", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Sign In</button>
          <button onClick={enterDemo} style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Try Free</button>
        </div>
        )}
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: isMobile ? "40px 20px 32px" : "80px 48px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.15)", fontSize: 11, fontWeight: 600, color: "#60a5fa", marginBottom: 24, letterSpacing: "0.03em" }}>AI-NATIVE FP&A — NOW IN GENERAL AVAILABILITY</div>
        <h1 style={{ fontSize: isMobile ? 36 : 56, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.035em", marginBottom: 20 }}>
          Financial planning<br />that thinks before<br />it answers
        </h1>
        <p style={{ fontSize: 18, color: "#6b7280", lineHeight: 1.6, maxWidth: 560, margin: "0 auto 36px", fontWeight: 400 }}>
          FinanceOS connects your ERP, CRM, and billing data into a unified model with AI-powered variance detection and natural language querying.
        </p>
        <div style={{ display: "flex", gap: 0, justifyContent: "center", maxWidth: 440, margin: "0 auto", flexDirection: isMobile ? "column" : "row" }}>
          <input value={heroEmail} onChange={e => setHeroEmail(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleHeroSignup(); }}
            placeholder="Work email" type="email"
            style={{ flex: 1, fontSize: 14, padding: "14px 18px", borderRadius: isMobile ? 10 : "10px 0 0 10px", border: "1px solid #23232a", borderRight: isMobile ? "1px solid #23232a" : "none", background: "#0c0c0f", color: "#f0f2f5", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = "#60a5fa"}
            onBlur={e => e.target.style.borderColor = "#23232a"}
          />
          <button onClick={handleHeroSignup} style={{ fontSize: 14, padding: "14px 24px", borderRadius: isMobile ? 10 : "0 10px 10px 0", border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 8px 30px rgba(96,165,250,0.25)" }}>Get Started Free</button>
        </div>
        <div style={{ fontSize: 11, color: "#44495a", marginTop: 8, textAlign: "center" }}>Using a work email helps find teammates · No credit card required</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
          <button onClick={enterDemo} style={{ fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "1px solid #23232a", background: "transparent", color: "#9ca3b0", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#33384a"; e.currentTarget.style.color = "#f0f2f5"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#23232a"; e.currentTarget.style.color = "#9ca3b0"; }}
          >Try the Live Demo</button>
          <button onClick={() => { document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); }} style={{ fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "1px solid #23232a", background: "transparent", color: "#9ca3b0", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#33384a"; e.currentTarget.style.color = "#f0f2f5"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#23232a"; e.currentTarget.style.color = "#9ca3b0"; }}
          >Watch 2-min Overview</button>
        </div>
      </div>

      {/* Social proof — Logo strip */}
      <div style={{ textAlign: "center", padding: "40px 48px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: "#44495a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20, fontWeight: 600 }}>Trusted by finance teams at</div>
        <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 20 : 40, alignItems: "center", flexWrap: "wrap" }}>
          {[
            { name: "Acme Corp", initial: "A", color: "#60a5fa" },
            { name: "TechFlow", initial: "T", color: "#a78bfa" },
            { name: "Meridian", initial: "M", color: "#34d399" },
            { name: "Nexus AI", initial: "N", color: "#f59e0b" },
            { name: "CloudScale", initial: "C", color: "#22d3ee" },
            { name: "Pinnacle", initial: "P", color: "#f87171" },
          ].map(co => (
            <div key={co.name} style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.5, transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}
            >
              <div style={{ width: 28, height: 28, borderRadius: 7, background: `${co.color}15`, border: `1px solid ${co.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: co.color }}>{co.initial}</div>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em", color: "#f0f2f5" }}>{co.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Everything a modern<br />finance team needs</h2>
          <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 500, margin: "0 auto" }}>From variance detection to board-ready reports, powered by AI that shows its reasoning.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {[
            { title: "AI Copilot", desc: "Ask questions in plain English. Get data-backed answers with visible reasoning — not a black box.", Icon: Brain, color: "#a78bfa" },
            { title: "Forecast Optimizer", desc: "ML ensemble models with live sensitivity sliders. Adjust NDR, pipeline, churn — see impact instantly.", Icon: TrendingUp, color: "#60a5fa" },
            { title: "Multi-Entity Consolidation", desc: "Automatic intercompany eliminations, FX adjustments, and entity-level approval workflows.", Icon: Layers, color: "#34d399" },
            { title: "Variance Detective", desc: "AI scans every line for favorable/unfavorable variances and explains the drivers automatically.", Icon: Eye, color: "#fbbf24" },
            { title: "Scenario Modeling", desc: "Compare 4+ scenarios side-by-side. Base, bull, bear, and custom — all with live data feeds.", Icon: Cpu, color: "#f87171" },
            { title: "30+ Integrations", desc: "NetSuite, Salesforce, Stripe, Snowflake, Rippling, and more. Real-time bi-directional sync.", Icon: Globe, color: "#22d3ee" },
          ].map(f => (
            <div key={f.title} style={{ background: "#131316", border: "1px solid #23232a", borderRadius: 14, padding: 24, transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#60a5fa"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#23232a"}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${f.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <f.Icon size={20} color={f.color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PRODUCT DEMO — Jira-inspired tabbed showcase ═══ */}
      <ProductDemo enterDemo={enterDemo} />

      {/* ═══ HOW IT WORKS — Numbered step flow (Jira pattern) ═══ */}
      <div style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Up and running in 4 steps</h2>
          <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 480, margin: "0 auto" }}>No 6-month implementation. No consultants. Connect your data and start planning in days.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {[
            { step: 1, title: "Connect your data", desc: "Link your ERP, CRM, and billing in under 5 minutes. NetSuite, Salesforce, Stripe, QuickBooks — all pre-built.", color: "#60a5fa" },
            { step: 2, title: "AI builds your model", desc: "FinanceOS auto-maps your chart of accounts, detects revenue drivers, and creates a baseline forecast.", color: "#a78bfa" },
            { step: 3, title: "Plan & scenario model", desc: "Run what-if scenarios, adjust assumptions with live sliders, and compare 4 models side-by-side.", color: "#34d399" },
            { step: 4, title: "Close & report", desc: "Multi-entity consolidation, variance commentary, and board-ready exports — all from one platform.", color: "#fbbf24" },
          ].map(s => (
            <div key={s.step} style={{ background: "#131316", border: "1px solid #23232a", borderRadius: 14, padding: 24, position: "relative" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: s.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>{s.step}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={enterDemo} style={{ fontSize: 15, padding: "14px 32px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 8px 30px rgba(96,165,250,0.25)" }}>Start Your Free Trial</button>
          <div style={{ marginTop: 10, fontSize: 12, color: "#44495a" }}>No credit card required · 30-day money-back guarantee</div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Trusted by finance leaders</h2>
          <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 500, margin: "0 auto" }}>See why modern FP&A teams choose FinanceOS over legacy platforms.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {[
            { quote: "We went from a 12-day close to 4 days. The AI copilot found a $1.2M accrual error our auditors missed.", name: "Sarah Chen", title: "VP Finance, Acme Corp", metric: "8-day reduction in close time" },
            { quote: "The scenario modeling paid for itself in one board meeting. We modeled three M&A paths in 20 minutes instead of two weeks.", name: "James Park", title: "CFO, TechFlow", metric: "10x faster scenario analysis" },
            { quote: "Switched from Pigment. The transparent AI reasoning was the deciding factor — we can actually trust the outputs.", name: "Maria Lopez", title: "FP&A Director, Nexus AI", metric: "From Pigment in 3 weeks" },
          ].map(t => (
            <div key={t.name} style={{ background: "#131316", border: "1px solid #23232a", borderRadius: 16, padding: "28px 24px", position: "relative" }}>
              <div style={{ fontSize: 28, color: "#60a5fa", fontWeight: 800, lineHeight: 1, marginBottom: 14, opacity: 0.4 }}>"</div>
              <div style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.7, marginBottom: 20, minHeight: 80 }}>{t.quote}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #60a5fa20, #a78bfa20)", border: "1px solid #23232a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#60a5fa" }}>{t.name.split(" ").map(w => w[0]).join("")}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f2f5" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{t.title}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 6, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)", color: "#34d399", display: "inline-block" }}>{t.metric}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Comparison — SWOT: position vs Pigment, Anaplan, Runway */}
      <div style={{ padding: "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>How FinanceOS compares</h2>
          <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 500, margin: "0 auto" }}>Enterprise capability at mid-market pricing. No 6-month implementation.</p>
        </div>
        <div style={{ background: "#131316", border: "1px solid #23232a", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #23232a" }}>
                {["Capability", "FinanceOS", "Anaplan", "Pigment", "Runway"].map((h, i) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: i === 0 ? "left" : "center", fontSize: 11, fontWeight: 700, color: i === 1 ? "#60a5fa" : "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { cap: "AI Copilot with visible reasoning", us: true, an: false, pi: false, ru: true },
                { cap: "Self-serve onboarding (days, not months)", us: true, an: false, pi: false, ru: true },
                { cap: "Published transparent pricing", us: true, an: false, pi: false, ru: false },
                { cap: "Multi-entity consolidation", us: true, an: true, pi: true, ru: false },
                { cap: "Scenario modeling (4+ side-by-side)", us: true, an: true, pi: true, ru: true },
                { cap: "Real-time variance detection", us: true, an: false, pi: true, ru: false },
                { cap: "30+ native integrations", us: true, an: true, pi: true, ru: true },
                { cap: "Implementation time", us: "Days", an: "3-6 mo", pi: "3-6 mo", ru: "Weeks" },
                { cap: "Starting price", us: "$599/mo", an: "$200K+/yr", pi: "$65K+/yr", ru: "$30K+/yr" },
              ].map(row => (
                <tr key={row.cap} style={{ borderBottom: "1px solid #1b1b20" }}>
                  <td style={{ padding: "12px 16px", color: "#9ca3b0", fontWeight: 500 }}>{row.cap}</td>
                  {[row.us, row.an, row.pi, row.ru].map((v, i) => (
                    <td key={i} style={{ padding: "12px 16px", textAlign: "center" }}>
                      {typeof v === "boolean" ? (
                        v ? <Check size={16} color="#34d399" strokeWidth={2.5} /> : <X size={14} color="#44495a" strokeWidth={2} />
                      ) : (
                        <span style={{ fontWeight: 700, color: i === 0 ? "#60a5fa" : "#6b7280", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ padding: isMobile ? "40px 20px 60px" : "60px 48px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Simple, transparent pricing</h2>
          <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 20 }}>No hidden fees. No implementation charges. Cancel anytime.</p>
          <div style={{ display: "inline-flex", background: "#131316", borderRadius: 8, padding: 3, border: "1px solid #23232a" }}>
            <button onClick={() => setBilling("monthly")} style={{ fontSize: 12, padding: "7px 16px", borderRadius: 6, border: "none", background: billing === "monthly" ? "#23232a" : "transparent", color: billing === "monthly" ? "#f0f2f5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Monthly</button>
            <button onClick={() => setBilling("annual")} style={{ fontSize: 12, padding: "7px 16px", borderRadius: 6, border: "none", background: billing === "annual" ? "#23232a" : "transparent", color: billing === "annual" ? "#f0f2f5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Annual (save 17%)</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: "#131316", border: `1px solid ${p.popular ? "#60a5fa" : "#23232a"}`, borderRadius: 14, padding: 28, position: "relative", boxShadow: p.popular ? "0 0 0 1px rgba(96,165,250,0.15), 0 8px 30px rgba(96,165,250,0.08)" : "none", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = p.popular ? "0 0 0 1px rgba(96,165,250,0.25), 0 16px 48px rgba(96,165,250,0.15)" : "0 12px 40px rgba(0,0,0,0.3)"; e.currentTarget.style.borderColor = p.popular ? "#60a5fa" : "#33384a"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = p.popular ? "0 0 0 1px rgba(96,165,250,0.15), 0 8px 30px rgba(96,165,250,0.08)" : "none"; e.currentTarget.style.borderColor = p.popular ? "#60a5fa" : "#23232a"; }}
            >
              {p.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "4px 12px", borderRadius: 6, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", fontSize: 10, fontWeight: 700, color: "#fff" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
                <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>${billing === "annual" ? p.annual : p.monthly}</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>/mo</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {p.features.map(f => (
                  <div key={f} style={{ fontSize: 13, color: "#9ca3b0", display: "flex", alignItems: "center", gap: 8 }}>
                    <Check size={14} color="#34d399" strokeWidth={2.5} /> {f}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={enterDemo} style={{
                  flex: 1, fontSize: 12, padding: "11px 0", borderRadius: 8, border: `1px solid #23232a`, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                  background: "transparent", color: "#9ca3b0",
                }}>Try Demo</button>
                <button onClick={() => { try { window.open(billing === "annual" ? p.linkAnnual : p.linkMonthly, "_blank"); } catch {} }} style={{
                  flex: 2, fontSize: 12, padding: "11px 0", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                  background: p.popular ? "linear-gradient(135deg, #60a5fa, #a78bfa)" : "#23232a", color: "#fff",
                }}>Subscribe</button>
              </div>
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "#44495a" }}>30-day money-back guarantee</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Frequently asked questions</h2>
        </div>
        {[
          { q: "How long does implementation take?", a: "Most teams are live within 48 hours. Connect your ERP, map your chart of accounts, and start running reports the same day. No consultants, no 6-month implementations." },
          { q: "Can I migrate from Pigment, Anaplan, or Adaptive?", a: "Yes. We provide a guided migration path with a dedicated onboarding specialist. Most migrations complete in 2-3 weeks with full historical data preservation." },
          { q: "How does the AI Copilot work?", a: "Our AI reads your full financial model — actuals, budgets, forecasts, and benchmarks. Ask any question in plain English and get a sourced, reasoned answer. Unlike other tools, we show our work so you can verify every insight." },
          { q: "What integrations do you support?", a: "30+ native integrations including NetSuite, Salesforce, Stripe, Snowflake, Rippling, QuickBooks, Xero, and more. Bi-directional sync with < 5 minute latency." },
          { q: "Is my data secure?", a: "SOC 2 Type II compliant, AES-256 encryption at rest and in transit, row-level security in Supabase, and strict Content Security Policy headers. Your data never leaves your tenant." },
          { q: "What happens after the free trial?", a: "After 14 days, choose a plan that fits your team. All data is preserved. If you cancel, you get a 30-day money-back guarantee — no questions asked." },
          { q: "Do you offer custom pricing for large teams?", a: "Yes. Teams with 50+ users or special compliance requirements can contact us for custom enterprise pricing with dedicated SLA, CSM, and on-premises deployment options." },
        ].map((faq, i) => (
          <details key={i} style={{ borderBottom: "1px solid #1b1b20", cursor: "pointer" }}>
            <summary style={{ padding: "18px 0", fontSize: 15, fontWeight: 600, color: "#f0f2f5", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {faq.q}
              <ChevronDown size={16} color="#6b7280" style={{ flexShrink: 0, transition: "transform 0.2s" }} />
            </summary>
            <div style={{ padding: "0 0 18px", fontSize: 13, color: "#9ca3b0", lineHeight: 1.7 }}>{faq.a}</div>
          </details>
        ))}
      </div>

      {/* Security & Trust */}
      <div id="security" style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Enterprise-grade security</h2>
          <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 500, margin: "0 auto" }}>Your financial data deserves bank-level protection. We build security into every layer.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {[
            { title: "SOC 2 Type II", sub: "Audit-ready architecture with full access logging and role-based controls.", badge: "COMPLIANT" },
            { title: "AES-256 Encryption", sub: "Data encrypted at rest and in transit. Zero plaintext storage of credentials.", badge: "AT REST + TRANSIT" },
            { title: "Row-Level Security", sub: "Every database query is scoped to your organization. Zero cross-tenant data leakage.", badge: "SUPABASE RLS" },
            { title: "HSTS + CSP Headers", sub: "Strict Transport Security, Content Security Policy, X-Frame-Options DENY, and 5 additional security headers.", badge: "VERCEL" },
          ].map(s => (
            <div key={s.title} style={{ background: "#131316", border: "1px solid #23232a", borderRadius: 14, padding: 22, textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 4, background: "rgba(52,211,153,0.08)", color: "#34d399", display: "inline-block", marginBottom: 12, letterSpacing: "0.06em" }}>{s.badge}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem — Vaultline Suite */}
      <div style={{ padding: "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Part of the Vaultline Suite</h2>
          <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 560, margin: "0 auto" }}>FinanceOS works standalone or as part of a unified finance ecosystem. Bundle all three and save 15%.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { name: "Vaultline", desc: "Cloud-native treasury management. Real-time cash position, AI forecasting, multi-currency FX, and bank connectivity.", color: "#22d3ee", market: "Mid-market Treasury", price: "$499-$2,499/mo" },
            { name: "FinanceOS", desc: "AI-powered FP&A platform. Variance detection, scenario modeling, consolidation, and natural language querying.", color: "#60a5fa", market: "FP&A / Planning", price: "$599-$4,799/mo", current: true },
            { name: "Parallax", desc: "Aerospace supplier compliance OS. ITAR/EAR tracking, audit trails, supplier risk scoring, and regulatory mapping.", color: "#fbbf24", market: "Aerospace Compliance", price: "$799-$3,999/mo" },
          ].map(p => (
            <div key={p.name} style={{ background: "#131316", border: `1px solid ${p.current ? p.color + "40" : "#23232a"}`, borderRadius: 14, padding: 24, position: "relative" }}>
              {p.current && <div style={{ position: "absolute", top: -8, right: 16, padding: "3px 10px", borderRadius: 4, background: p.color, fontSize: 9, fontWeight: 700, color: "#000" }}>CURRENT PRODUCT</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
                <span style={{ fontSize: 16, fontWeight: 800 }}>{p.name}</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: p.color, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.market}</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</div>
              <div style={{ fontSize: 12, color: "#9ca3b0", fontWeight: 600 }}>{p.price}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: 28, background: "linear-gradient(135deg, rgba(96,165,250,0.06), rgba(167,139,250,0.06))", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Vaultline Suite Bundle</div>
          <div style={{ fontSize: 14, color: "#9ca3b0", marginBottom: 12 }}>Treasury + FP&A + Compliance — the only unified mid-market finance stack.</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>$2,799</span>
            <span style={{ fontSize: 14, color: "#6b7280" }}>/mo · Save 15%</span>
          </div>
          <button onClick={enterDemo} style={{ fontSize: 14, padding: "12px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 6px 24px rgba(96,165,250,0.25)" }}>Start Suite Trial</button>
        </div>
      </div>

      {/* ═══ FUNDRAISER — Seed Round ═══ */}
      <div id="invest" style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(96,165,250,0.06), rgba(167,139,250,0.06))", border: "1px solid rgba(96,165,250,0.12)", borderRadius: 20, padding: "48px", position: "relative", overflow: "hidden" }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", top: "-50%", right: "-20%", width: "60%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.08), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", fontSize: 10, fontWeight: 700, color: "#60a5fa", marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>Now Raising — Seed Round</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10 }}>Invest in the future of FP&A</h2>
            <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>FinanceOS is raising a seed round to accelerate product development, hire key engineering talent, and expand into enterprise mid-market. Join us as we build the operating system for modern finance.</p>

            {/* Funding Progress */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 32, marginBottom: 36 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Funding Progress</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>$1.2M</span>
                  <span style={{ fontSize: 14, color: "#6b7280" }}>of $3M target</span>
                </div>
                <div style={{ width: "100%", height: 8, background: "#131316", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ width: "40%", height: "100%", background: "linear-gradient(90deg, #60a5fa, #a78bfa)", borderRadius: 4, transition: "width 1s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#44495a" }}>
                  <span>40% committed</span>
                  <span>12 investors</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Use of Funds</div>
                {[
                  { label: "Engineering & Product", pct: 45, color: "#60a5fa" },
                  { label: "Go-to-Market", pct: 25, color: "#a78bfa" },
                  { label: "Infrastructure & Security", pct: 15, color: "#34d399" },
                  { label: "Operations & Legal", pct: 15, color: "#fbbf24" },
                ].map(f => (
                  <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: f.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#9ca3b0", flex: 1 }}>{f.label}</span>
                    <div style={{ width: 100, height: 4, background: "#131316", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${f.pct}%`, height: "100%", background: f.color, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: f.color, fontFamily: "'JetBrains Mono', monospace", width: 30, textAlign: "right" }}>{f.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Round Terms */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
              {[
                { label: "Instrument", value: "SAFE", sub: "Post-money" },
                { label: "Valuation Cap", value: "$15M", sub: "Pre-money" },
                { label: "Minimum Check", value: "$25K", sub: "Accredited investors" },
                { label: "Target Close", value: "Q3 2026", sub: "Rolling close" },
              ].map(t => (
                <div key={t.label} style={{ background: "#0c0c0f", border: "1px solid #1b1b20", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#44495a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{t.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{t.value}</div>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>{t.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => window.open("mailto:investors@finance-os.app?subject=FinanceOS%20Seed%20Round%20Interest", "_blank")} style={{ fontSize: 14, padding: "14px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 6px 24px rgba(96,165,250,0.25)" }}>Request Investor Deck</button>
              <button onClick={() => window.open("mailto:investors@finance-os.app?subject=FinanceOS%20Meeting%20Request", "_blank")} style={{ fontSize: 14, padding: "14px 28px", borderRadius: 10, border: "1px solid #23232a", background: "transparent", color: "#9ca3b0", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Schedule a Call</button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ INVESTOR TRACTION — Why Now ═══ */}
      <div style={{ padding: "0 48px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Traction & market timing</h2>
          <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 560, margin: "0 auto" }}>The $50B EPM market is ripe for disruption. Legacy players charge 6-figure ACVs with 6-month implementations. We're 10x faster at 10x less.</p>
        </div>

        {/* Traction KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Live Demo Users", value: "2,400+", delta: "+180% MoM" },
            { label: "Pipeline Value", value: "$840K", delta: "ARR qualified" },
            { label: "Design Partners", value: "6", delta: "LOI signed" },
            { label: "Waitlist", value: "1,200+", delta: "Finance teams" },
            { label: "NPS Score", value: "72", delta: "Top quartile" },
          ].map(k => (
            <div key={k.label} style={{ background: "#131316", border: "1px solid #23232a", borderRadius: 14, padding: "20px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 2 }}>{k.label}</div>
              <div style={{ fontSize: 10, color: "#34d399", fontWeight: 600 }}>{k.delta}</div>
            </div>
          ))}
        </div>

        {/* Market + Differentiators */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#131316", border: "1px solid #23232a", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Market Opportunity</div>
            {[
              { metric: "Total Addressable Market", value: "$50B", note: "EPM/CPM global market" },
              { metric: "Serviceable Market", value: "$8.2B", note: "Mid-market FP&A SaaS" },
              { metric: "Target Segment", value: "$2.1B", note: "5-500 employee companies" },
              { metric: "Growth Rate", value: "14.2%", note: "CAGR 2024-2030" },
            ].map(m => (
              <div key={m.metric} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1b1b20" }}>
                <span style={{ flex: 1, fontSize: 12, color: "#9ca3b0" }}>{m.metric}</span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "#f0f2f5", marginRight: 10 }}>{m.value}</span>
                <span style={{ fontSize: 10, color: "#44495a", width: 140 }}>{m.note}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#131316", border: "1px solid #23232a", borderRadius: 14, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Why FinanceOS Wins</div>
            {[
              { point: "AI-native architecture", detail: "Built on Claude — not bolted on. Visible reasoning, not black box." },
              { point: "Suite bundling moat", detail: "FP&A + Treasury + Compliance — only unified mid-market stack." },
              { point: "10x faster deployment", detail: "Days to value vs 3-6 month implementations at Anaplan/Pigment." },
              { point: "Transparent pricing", detail: "$599/mo published. Competitors hide behind 'contact sales'." },
              { point: "Founder-market fit", detail: "Built by banking + fintech operators who lived the FP&A pain." },
            ].map(w => (
              <div key={w.point} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f2f5", marginBottom: 2 }}>{w.point}</div>
                <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>{w.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer — expanded per blueprint */}
      <div style={{ borderTop: "1px solid #1b1b20", padding: "48px 48px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr 1fr", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <FosLogo size={28} />
              <span style={{ fontSize: 15, fontWeight: 800 }}>Finance<span style={{ fontWeight: 400, opacity: 0.6 }}>OS</span></span>
            </div>
            <p style={{ fontSize: 12, color: "#44495a", lineHeight: 1.7, maxWidth: 240 }}>AI-powered financial planning for modern finance teams. Part of the Vaultline Suite.</p>
          </div>
          {[
            { title: "Product", links: ["Dashboard", "AI Copilot", "Forecasting", "Consolidation", "Integrations"] },
            { title: "Suite", links: ["Vaultline (Treasury)", "Parallax (Compliance)", "Bundle Pricing", "Suite Overview"] },
            { title: "Resources", links: ["Documentation", "API Reference", "Changelog", "Status Page"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security", "DPA"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{col.title}</div>
              {col.links.map(link => (
                <div key={link} style={{ fontSize: 12, color: "#44495a", marginBottom: 8, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#9ca3b0"}
                  onMouseLeave={e => e.currentTarget.style.color = "#44495a"}
                >{link}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: "1px solid #1b1b20", fontSize: 11, color: "#33384a" }}>
          <span>© {new Date().getFullYear()} Vaultline, Inc. · All rights reserved</span>
          <span>Built with care in New Hampshire</span>
        </div>
      </div>

      {/* Auth Modal */}
      {/* Auth Modal */}
      {authModal && <AuthModal mode={authModal} onAuth={handleAuth} onClose={() => setAuthModal(null)} />}

      {/* Privacy Pipeline — Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════
export default function FinanceOS() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "Guest", email: "", plan: null });
  const [view, setView] = useState("dashboard");
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [prevView, setPrevView] = useState(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [drawerKpi, setDrawerKpi] = useState(null);
  const [period, setPeriod] = useState("FY2025 YTD");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [navHistory, setNavHistory] = useState(["dashboard"]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toasts, toast } = useToast();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => { setPeriodOpen(false); setNotifOpen(false); };
    if (periodOpen || notifOpen) {
      const timer = setTimeout(() => document.addEventListener("click", handleClickOutside, { once: true }), 0);
      return () => { clearTimeout(timer); document.removeEventListener("click", handleClickOutside); };
    }
  }, [periodOpen, notifOpen]);

  // Listen for Supabase auth state changes (handles OAuth redirects)
  useEffect(() => {
    let mounted = true;
    const handleSession = (session) => {
      if (!mounted || !session?.user) return;
      try {
        const u = session.user;
        setUser({ name: u.user_metadata?.full_name || u.email?.split("@")[0] || "User", email: u.email || "" });
        setLoggedIn(true);
        // Clean up URL hash after processing OAuth tokens
        if (typeof window !== "undefined" && window.location.hash?.includes("access_token")) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } catch {}
    };

    // On page load: check for OAuth redirect tokens in URL hash
    // This handles the case where createClient missed them during SSR
    const initAuth = async () => {
      try {
        // getSession() will detect and exchange URL tokens if present
        const { data: { session } } = await supabase.auth.getSession();
        if (session) { handleSession(session); return; }
        // If no session from getSession, check URL hash manually
        if (typeof window !== "undefined" && window.location.hash) {
          const params = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          if (accessToken && refreshToken) {
            const { data } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
            if (data?.session) handleSession(data.session);
          }
        }
      } catch {}
    };
    initAuth();

    // Listen for ongoing auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") && session?.user) {
        handleSession(session);
        // Show plan picker only on fresh sign-in (not session restore)
        if (event === "SIGNED_IN" && mounted) setShowPlanPicker(true);
      } else if (event === "SIGNED_OUT") {
        if (mounted) { setLoggedIn(false); setUser({ name: "Guest", email: "" }); setView("dashboard"); }
      }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  // Sunset-aware auto theme: dark after 6:30pm, light after 6:30am, respects OS preference
  const getAutoMode = useCallback(() => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const timeDecimal = hour + minute / 60;
    // Approximate sunset/sunrise for mid-latitudes (adjusts seasonally would need API)
    const sunrise = 6.5;  // 6:30 AM
    const sunset = 18.5;  // 6:30 PM (conservative — real sunset varies by season/location)
    if (timeDecimal >= sunrise && timeDecimal < sunset) return "light";
    return "dark";
  }, []);

  const [mode, setMode] = useState("dark");
  const [autoTheme, setAutoTheme] = useState(true);
  const c = THEME[mode];

  // Check OS preference and time on mount, then recheck every 5 minutes
  useEffect(() => {
    if (!autoTheme) return;
    // Check OS-level preference first
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    if (prefersDark !== undefined) {
      setMode(prefersDark ? "dark" : "light");
    } else {
      setMode(getAutoMode());
    }
    // Recheck every 5 minutes for sunset transition
    const interval = setInterval(() => {
      if (autoTheme) setMode(getAutoMode());
    }, 5 * 60 * 1000);
    // Listen for OS preference changes
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const handler = (e) => { if (autoTheme) setMode(e.matches ? "dark" : "light"); };
    mql?.addEventListener?.("change", handler);
    return () => { clearInterval(interval); mql?.removeEventListener?.("change", handler); };
  }, [autoTheme, getAutoMode]);

  const toggleMode = useCallback(() => {
    setAutoTheme(false); // Manual override disables auto
    setMode(prev => prev === "dark" ? "light" : "dark");
  }, []);

  const handleLogout = useCallback(() => {
    supabase.auth.signOut().catch(() => {}); // Sign out from Supabase
    setLoggedIn(false);
    setUser({ name: "Guest", email: "", plan: null });
    setView("dashboard");
    setNavHistory(["dashboard"]);
    setShowPlanPicker(false);
  }, []);

  // View loading state — shows skeleton on view switch
  const [viewLoading, setViewLoading] = useState(false);
  const loadingTimer = useRef(null);

  // Navigation with history tracking + loading transition
  // MUST be defined before the if(!loggedIn) return — React Rules of Hooks
  const navigate = useCallback((v) => {
    if (v === view) return;
    setMobileMenuOpen(false);
    setPrevView(view);
    setViewLoading(true);
    if (loadingTimer.current) clearTimeout(loadingTimer.current);
    loadingTimer.current = setTimeout(() => {
      setView(v);
      setViewLoading(false);
      loadingTimer.current = null;
      // Scroll content area to top on view change
      try { document.querySelector("[data-content-area]")?.scrollTo(0, 0); } catch {}
    }, 280);
    setNavHistory(prev => {
      const next = [...prev];
      const idx = next.indexOf(v);
      if (idx >= 0) return next.slice(0, idx + 1);
      return [...next, v];
    });
  }, [view]);

  // ⌘K shortcut — MUST be before early return
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(true); }
      if (e.key === "Escape") { setCmdOpen(false); setDrawerKpi(null); setNotifOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleCmd = (item) => {
    if (item.id.startsWith("ask-")) { navigate("copilot"); }
    else { navigate(item.id); }
  };

  const viewTitles = { dashboard: "Dashboard", copilot: "AI Copilot", pnl: "P&L Statement", forecast: "Forecast Optimizer", consolidation: "Multi-Entity Consolidation", models: "Scenario Models", close: "Close Tasks", integrations: "Integrations", admin: "Admin Console", investor: "Investor Metrics", settings: "Settings" };

  // Show marketing page when not logged in
  if (!loggedIn) {
    return <LandingPage onLogin={(userData) => {
      setUser(prev => ({ ...prev, ...userData }));
      setLoggedIn(true);
      // Show plan picker if no plan selected yet
      if (!userData?.plan) setShowPlanPicker(true);
    }} />;
  }

  let currentSection = "";

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", background: c.bg, color: c.text, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, overflow: "hidden", transition: "background 0.4s ease, color 0.3s ease" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        button { font-family: inherit; font-size: inherit; color: inherit; cursor: pointer; }
        a { text-decoration: none; color: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${c.borderBright}; border-radius: 3px; transition: background 0.3s; }
        ::-webkit-scrollbar-thumb:hover { background: ${c.textFaint}; }
        input[type="range"] { cursor: pointer; }
        input[type="range"]::-webkit-slider-thumb { cursor: pointer; }
        ::selection { background: ${c.accentMid || c.accentDim}; }
        /* Smooth theme crossfade on structural elements */
        .theme-transition {
          transition: background 0.4s ease, background-color 0.4s ease, color 0.3s ease, border-color 0.4s ease, box-shadow 0.4s ease;
        }
        @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes cmdIn { from { opacity: 0; transform: scale(0.96) translateY(-8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes themeSwitch { 0% { opacity: 0.92; } 100% { opacity: 1; } }
        @keyframes rippleOut { 0% { transform: scale(0); opacity: 0.4; } 100% { transform: scale(4); opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        /* ENV 4: Accessibility + Theme Refinement */
        :focus-visible { outline: 2px solid ${c.accent}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        @media print {
          .noise-overlay, nav, [data-sidebar] { display: none !important; }
          * { color: #000 !important; background: #fff !important; box-shadow: none !important; }
        }
        html { scroll-behavior: smooth; }
        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          [data-sidebar]:not([data-mobile-open]) { display: none !important; }
          [data-topbar] { padding: 8px 16px !important; }
          nav { padding: 16px 20px !important; }
          nav > div:nth-child(2) { display: none !important; }
          [data-mobile-menu] { display: flex !important; }
          h1 { font-size: 32px !important; }
          h2 { font-size: 24px !important; }
          [data-hero] { padding: 40px 20px 32px !important; }
          [data-section] { padding: 40px 20px !important; }
          [data-grid-3] { grid-template-columns: 1fr !important; }
          [data-grid-4] { grid-template-columns: 1fr 1fr !important; }
          [data-grid-5] { grid-template-columns: 1fr 1fr !important; }
          [data-grid-2] { grid-template-columns: 1fr !important; }
          [data-grid-footer] { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          [data-comparison] { overflow-x: auto; }
          [data-comparison] table { min-width: 600px; }
          [data-demo-layout] { grid-template-columns: 1fr !important; }
          [data-demo-tabs] { flex-wrap: wrap !important; }
          [data-fund-grid] { grid-template-columns: 1fr !important; }
          [data-hero-email] { flex-direction: column !important; max-width: 100% !important; }
          [data-hero-email] input { border-radius: 10px !important; border-right: 1px solid #23232a !important; }
          [data-hero-email] button { border-radius: 10px !important; }
        }
        @media (max-width: 480px) {
          [data-grid-4] { grid-template-columns: 1fr !important; }
          [data-grid-5] { grid-template-columns: 1fr !important; }
          [data-grid-footer] { grid-template-columns: 1fr !important; }
          [data-steps] { grid-template-columns: 1fr !important; }
        }
        .view-fade { animation: fadeIn 0.25s ease-out; }
        .noise-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 9998; opacity: ${mode === "dark" ? 0.018 : 0.01}; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); transition: opacity 0.4s ease; }
      `}</style>
      {/* Subtle noise texture for depth */}
      <div className="noise-overlay" />

      {/* ── MOBILE BACKDROP ── */}
      {isMobile && mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99, backdropFilter: "blur(4px)", animation: "fadeIn 0.15s" }} />
      )}

      {/* ── SIDEBAR ── */}
      <div data-sidebar {...(isMobile && mobileMenuOpen ? { "data-mobile-open": true } : {})} className="theme-transition" style={{
        width: sidebarCollapsed && !isMobile ? 64 : 230, minHeight: "100vh", background: c.sidebarBg,
        borderRight: `1px solid ${c.border}`, display: "flex", flexDirection: "column", flexShrink: 0,
        boxShadow: mode === "dark" ? "4px 0 20px rgba(0,0,0,0.15)" : "4px 0 20px rgba(0,0,0,0.04)",
        transition: "width 0.25s cubic-bezier(0.22,1,0.36,1), background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
        ...(isMobile ? { position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100, transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)" } : {}),
      }}>
        {/* Logo + Collapse Toggle */}
        <div style={{ padding: sidebarCollapsed ? "22px 12px 18px" : "22px 20px 18px", borderBottom: `1px solid ${c.borderSub}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "opacity 0.15s", overflow: "hidden" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            title="Back to FinanceOS.com"
          >
            <FosLogo size={32} />
            {!sidebarCollapsed && <div>
              <span style={{ fontWeight: 800, fontSize: 15, color: c.text, letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>Finance<span style={{ fontWeight: 400, opacity: 0.6 }}>OS</span></span>
              <div style={{ fontSize: 9, color: c.textFaint, marginTop: 1, whiteSpace: "nowrap" }}>Acme SaaS Corp · FY2025</div>
            </div>}
          </div>
          {!sidebarCollapsed && (
            <button onClick={() => setSidebarCollapsed(true)} title="Collapse sidebar" style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${c.borderSub}`, background: "transparent", color: c.textFaint, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; e.currentTarget.style.color = c.textFaint; }}
            ><ChevronRight size={12} style={{ transform: "rotate(180deg)" }} /></button>
          )}
        </div>
        {sidebarCollapsed && (
          <div style={{ padding: "6px 0", textAlign: "center", borderBottom: `1px solid ${c.borderSub}` }}>
            <button onClick={() => setSidebarCollapsed(false)} title="Expand sidebar" style={{ width: 36, height: 24, borderRadius: 6, border: `1px solid ${c.borderSub}`, background: "transparent", color: c.textFaint, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; e.currentTarget.style.color = c.textFaint; }}
            ><ChevronRight size={12} /></button>
          </div>
        )}

        {/* Nav */}
        <div style={{ flex: 1, padding: "8px 0", overflow: "auto" }}>
          {NAV_ITEMS.map(item => {
            const showSection = item.section !== currentSection;
            currentSection = item.section;
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <div key={item.id}>
                {showSection && !sidebarCollapsed && (
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, padding: "16px 18px 6px" }}>
                    {item.section}
                  </div>
                )}
                {showSection && sidebarCollapsed && <div style={{ height: 6 }} />}
                <div onClick={() => navigate(item.id)} title={sidebarCollapsed ? item.label : undefined} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: sidebarCollapsed ? "10px 0" : "10px 16px",
                  margin: sidebarCollapsed ? "1px 8px" : "1px 10px",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400, borderRadius: 8,
                  color: active ? c.text : c.textDim,
                  background: active ? c.accentMid : "transparent",
                  boxShadow: active ? `0 0 0 1px ${c.accent}20, inset 0 1px 0 ${c.accent}10` : "none",
                  transition: "all 0.15s cubic-bezier(0.22,1,0.36,1)",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = c.textSec; e.currentTarget.style.background = `${c.accent}06`; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = c.textDim; e.currentTarget.style.background = "transparent"; }}}
                >
                  {active && !sidebarCollapsed && <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3, borderRadius: "0 2px 2px 0", background: c.accent, boxShadow: `0 0 8px ${c.accent}60` }} />}
                  <Icon size={16} strokeWidth={active ? 2.5 : 1.5} />
                  {!sidebarCollapsed && item.label}
                  {!sidebarCollapsed && item.id === "copilot" && <Sparkles size={10} color={c.purple} style={{ marginLeft: "auto" }} />}
                  {!sidebarCollapsed && item.id === "close" && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: c.amberDim, color: c.amber }}>3</span>}
                  {!sidebarCollapsed && item.id === "dashboard" && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: c.redDim, color: c.red }}>4</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Suite Cross-Sell */}
        {!sidebarCollapsed && (
        <div style={{ padding: "8px 14px", borderTop: `1px solid ${c.borderSub}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, padding: "8px 4px 6px" }}>Vaultline Suite</div>
          {[
            { name: "Vaultline", sub: "Treasury", color: "#22d3ee" },
            { name: "Parallax", sub: "Compliance", color: "#fbbf24" },
          ].map(p => (
            <div key={p.name} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", margin: "1px 0", borderRadius: 6,
              cursor: "pointer", fontSize: 12, color: c.textDim, transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = p.color; e.currentTarget.style.background = `${p.color}08`; }}
            onMouseLeave={e => { e.currentTarget.style.color = c.textDim; e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width: 6, height: 6, borderRadius: 2, background: p.color, flexShrink: 0 }} />
              <span style={{ fontWeight: 500 }}>{p.name}</span>
              <span style={{ fontSize: 9, color: c.textFaint, marginLeft: "auto" }}>{p.sub}</span>
            </div>
          ))}
        </div>
        )}

        {/* Theme + User */}
        <div style={{ padding: sidebarCollapsed ? "8px 8px" : "12px 14px", borderTop: `1px solid ${c.borderSub}` }}>
          <div onClick={toggleMode} aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && toggleMode()} style={{
            display: "flex", alignItems: "center", gap: sidebarCollapsed ? 0 : 10,
            padding: sidebarCollapsed ? "8px 0" : "8px 10px", borderRadius: 8,
            cursor: "pointer", fontSize: 12, color: c.textSec, transition: "all 0.2s",
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.color = c.text; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.textSec; }}
          >
            {/* Toggle pill */}
            <div style={{
              width: 36, height: 20, borderRadius: 10, position: "relative",
              background: mode === "dark" ? "#1e293b" : "#bfdbfe",
              border: `1px solid ${mode === "dark" ? "#334155" : "#93c5fd"}`,
              transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute", top: 2, width: 14, height: 14, borderRadius: "50%",
                left: mode === "dark" ? 2 : 18,
                background: mode === "dark" ? "#94a3b8" : "#f59e0b",
                boxShadow: mode === "dark" ? "none" : "0 0 6px rgba(245,158,11,0.4)",
                transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {mode === "dark" ? <Moon size={8} color="#1e293b" strokeWidth={2.5} /> : <Sun size={8} color="#fff" strokeWidth={2.5} />}
              </div>
            </div>
            <span style={{ flex: 1, fontSize: 11, fontWeight: 500, display: sidebarCollapsed ? "none" : "block" }}>{mode === "dark" ? "Dark" : "Light"}</span>
            {autoTheme && !sidebarCollapsed && <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 3, background: c.accentDim, color: c.accent, letterSpacing: "0.05em" }}>AUTO</span>}
          </div>
          {!sidebarCollapsed ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", marginTop: 4, borderRadius: 8, cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            onClick={() => navigate("settings")}
          >
            <div style={{ position: "relative" }}>
              <div style={{
                width: 30, height: 30, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #10b981, #22d3ee)", fontSize: 10, fontWeight: 800, color: "#fff",
                boxShadow: mode === "dark" ? "0 2px 8px rgba(16,185,129,0.3)" : "0 2px 8px rgba(4,120,87,0.2)",
              }}>{(user.name || "G").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "G"}</div>
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: c.green, border: `2px solid ${c.bg}` }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{user.name || "Guest"}</div>
              <div style={{ fontSize: 9, color: c.textDim, fontWeight: 500 }}>{user.plan ? `${user.plan} Plan` : "Free Trial"} · Online</div>
            </div>
            <Settings size={13} color={c.textFaint} />
          </div>
          ) : (
          <div style={{ textAlign: "center", marginTop: 4 }} onClick={() => navigate("settings")} title={`${user.name || "Guest"} · Settings`}>
            <div style={{ width: 30, height: 30, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #10b981, #22d3ee)", fontSize: 10, fontWeight: 800, color: "#fff", cursor: "pointer" }}>{(user.name || "G").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "G"}</div>
          </div>
          )}
          {/* Logout */}
          <div onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginTop: 4, borderRadius: 8,
            cursor: "pointer", fontSize: 12, color: c.textDim, transition: "all 0.15s",
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = c.redDim; e.currentTarget.style.color = c.red; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.textDim; }}
          >
            <LogOut size={14} /> {!sidebarCollapsed && "Sign Out"}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {/* Ambient gradient orbs — stronger in dark, softer in light */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0, transition: "opacity 0.6s ease" }}>
          <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}${mode === "dark" ? "08" : "04"} 0%, transparent 70%)`, filter: "blur(80px)", transition: "background 0.6s ease" }} />
          <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: "50%", height: "50%", borderRadius: "50%", background: `radial-gradient(circle, ${c.purple}${mode === "dark" ? "06" : "03"} 0%, transparent 70%)`, filter: "blur(80px)", transition: "background 0.6s ease" }} />
        </div>

        {/* Demo data banner — ENV 7 */}
        {user.plan === "demo" && <DemoBanner c={c} onNav={navigate} />}

        {/* Topbar — frosted glass */}
        <div className="theme-transition" style={{
          height: 56, borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 28px", flexShrink: 0,
          background: `${c.bg2}cc`, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          position: "relative", zIndex: 10,
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Mobile hamburger */}
            {isMobile && (
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation menu" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: 6 }}>
                <div style={{ width: 14, height: 2, borderRadius: 1, background: c.textDim, transition: "all 0.2s", transform: mobileMenuOpen ? "rotate(45deg) translateY(3px)" : "none" }} />
                <div style={{ width: 14, height: 2, borderRadius: 1, background: c.textDim, transition: "all 0.2s", opacity: mobileMenuOpen ? 0 : 1 }} />
                <div style={{ width: 14, height: 2, borderRadius: 1, background: c.textDim, transition: "all 0.2s", transform: mobileMenuOpen ? "rotate(-45deg) translateY(-3px)" : "none" }} />
              </button>
            )}
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
            <div onClick={() => setCmdOpen(true)} aria-label="Search — press Command K" role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && setCmdOpen(true)} style={{
              display: "flex", alignItems: "center", gap: 6, background: c.surfaceAlt, border: `1px solid ${c.border}`,
              borderRadius: 8, padding: "6px 12px", fontSize: 12, color: c.textDim, width: 200, cursor: "pointer", transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = c.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = c.border}
            >
              <Search size={13} /> Search... <kbd style={{ marginLeft: "auto", fontSize: 9, padding: "1px 5px", borderRadius: 3, background: c.bg2, border: `1px solid ${c.borderSub}`, color: c.textFaint }}>⌘K</kbd>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ cursor: "pointer", position: "relative" }} role="button" aria-label="Notifications" tabIndex={0} onClick={() => setNotifOpen(!notifOpen)} onKeyDown={e => e.key === "Enter" && setNotifOpen(!notifOpen)}>
                <Bell size={18} color={notifOpen ? c.accent : c.textDim} />
                <div style={{ position: "absolute", top: -3, right: -4, minWidth: 14, height: 14, borderRadius: 7, background: c.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff", border: `2px solid ${c.bg2}` }}>4</div>
              </div>
              {notifOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 340, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.3)", overflow: "hidden", zIndex: 200, animation: "cmdIn 0.15s cubic-bezier(0.22,1,0.36,1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: `1px solid ${c.borderSub}` }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Notifications</span>
                    <span onClick={() => { setNotifOpen(false); toast("All marked as read", "success"); }} style={{ fontSize: 10, color: c.accent, fontWeight: 600, cursor: "pointer" }}>Mark all read</span>
                  </div>
                  {[
                    { text: "Revenue variance detected: +$2.09M above budget", time: "2 min ago", type: "alert", color: c.green },
                    { text: "S&M spend $730K over — review recommended", time: "12 min ago", type: "warning", color: c.amber },
                    { text: "February close: 3 tasks still pending", time: "1 hr ago", type: "task", color: c.accent },
                    { text: "Model retrained — MAPE improved to 2.9%", time: "3 hr ago", type: "info", color: c.purple },
                  ].map((n, i) => (
                    <div key={i} onClick={() => { setNotifOpen(false); navigate(i < 2 ? "copilot" : i === 2 ? "close" : "forecast"); }} style={{
                      display: "flex", gap: 10, padding: "12px 16px", cursor: "pointer", borderBottom: `1px solid ${c.borderSub}`, transition: "background 0.1s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, marginTop: 5, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: c.text, lineHeight: 1.5 }}>{n.text}</div>
                        <div style={{ fontSize: 10, color: c.textFaint, marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div key={viewLoading ? "loading" : view} data-content-area className="view-fade" style={{ flex: 1, overflow: "auto", background: "transparent", position: "relative", zIndex: 1 }}>
          {viewLoading ? <LoadingSkeleton c={c} /> : (<>
          {view === "dashboard" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><DashboardView c={c} onNav={navigate} toast={toast} onDrawer={setDrawerKpi} userName={user.name} /></SectionBoundary>}
          {view === "copilot" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><CopilotView c={c} toast={toast} /></SectionBoundary>}
          {view === "pnl" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><PnlView c={c} onNav={navigate} toast={toast} /></SectionBoundary>}
          {view === "forecast" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><ForecastView c={c} /></SectionBoundary>}
          {view === "consolidation" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><ConsolidationView c={c} onNav={navigate} toast={toast} /></SectionBoundary>}
          {view === "models" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><ScenariosView c={c} toast={toast} /></SectionBoundary>}
          {view === "close" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><CloseView c={c} toast={toast} /></SectionBoundary>}
          {view === "integrations" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><IntegrationsView c={c} toast={toast} /></SectionBoundary>}
          {view === "admin" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><AdminView c={c} toast={toast} onNav={navigate} /></SectionBoundary>}
          {view === "investor" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><InvestorView c={c} toast={toast} /></SectionBoundary>}
          {view === "settings" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><SettingsView c={c} onLogout={handleLogout} toast={toast} mode={mode} /></SectionBoundary>}
          </>)}
        </div>
      </div>

      {/* ── OVERLAYS ── */}
      {drawerKpi && <DetailDrawer kpi={drawerKpi} c={c} onClose={() => setDrawerKpi(null)} />}
      {cmdOpen && <CommandPalette c={c} onSelect={handleCmd} onClose={() => setCmdOpen(false)} />}
      <ToastContainer toasts={toasts} c={c} />
      {/* ENV 5: Desktop Platform */}
      <OfflineIndicator c={c} />
      <PWAInstallPrompt c={c} />
      {/* Plan Picker — shows after signup */}
      {showPlanPicker && <PlanPicker userName={user.name} isDemo={user.plan === "demo"} onSkip={() => setShowPlanPicker(false)} onSelect={(plan) => { setUser(prev => ({ ...prev, plan })); setShowPlanPicker(false); setShowOnboarding(true); }} />}
      {showOnboarding && <OnboardingWizard c={c} userName={user.name} onComplete={(org) => { setShowOnboarding(false); toast(`Welcome to FinanceOS${org.name ? ` — ${org.name}` : ""}`, "success"); }} />}
    </div>
  );
}
