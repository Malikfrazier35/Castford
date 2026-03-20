"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo, Component } from "react";
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
    bg: "#07080a", bg2: "#0b0c10", surface: "#111318", surfaceAlt: "#181b22",
    // Glassmorphism surfaces
    glass: "rgba(17,19,24,0.72)", glassBorder: "rgba(255,255,255,0.06)", glassHighlight: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 0.5px rgba(255,255,255,0.06)",
    glassBlur: "blur(20px) saturate(1.4)",
    border: "#1e2230", borderSub: "#171b25", borderBright: "#2a2f3d",
    text: "#eef0f6", textSec: "#9ea5b8", textDim: "#636d84", textFaint: "#3d4558",
    accent: "#5b9cf5", accentDim: "rgba(91,156,245,0.07)", accentMid: "rgba(91,156,245,0.14)",
    green: "#3dd9a0", greenDim: "rgba(61,217,160,0.07)",
    red: "#f06b6b", redDim: "rgba(240,107,107,0.07)",
    amber: "#f5b731", amberDim: "rgba(245,183,49,0.07)",
    purple: "#a181f7", purpleDim: "rgba(161,129,247,0.07)",
    cyan: "#2dd4d0",
    // Chart colors — richer palette for data viz
    chart1: "#5b9cf5", chart2: "#3dd9a0", chart3: "#a181f7", chart4: "#f5b731", chart5: "#f06b6b", chart6: "#2dd4d0",
    chartGrid: "#181d2a", chartAxis: "#3d4558",
    // Depth system — deeper, more atmospheric
    shadow1: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)",
    shadow2: "0 4px 16px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2)",
    shadow3: "0 12px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.25)",
    cardGlow: "0 0 0 1px rgba(91,156,245,0.04), 0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
    cardHoverGlow: "0 0 0 1px rgba(91,156,245,0.12), 0 8px 32px rgba(91,156,245,0.06), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
    sidebarBg: "linear-gradient(180deg, #0b0c10 0%, #070810 100%)",
  },
  light: {
    bg: "#f3f4f8", bg2: "#e8eaf1", surface: "#ffffff", surfaceAlt: "#eef0f5",
    // Glassmorphism surfaces
    glass: "rgba(255,255,255,0.65)", glassBorder: "rgba(0,0,0,0.06)", glassHighlight: "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 0.5px rgba(255,255,255,0.5)",
    glassBlur: "blur(20px) saturate(1.2)",
    border: "#cdd2de", borderSub: "#dde1ea", borderBright: "#b5bccb",
    text: "#0a0d15", textSec: "#3a4259", textDim: "#576175", textFaint: "#8792a8",
    accent: "#1d6ec1", accentDim: "rgba(29,110,193,0.09)", accentMid: "rgba(29,110,193,0.15)",
    green: "#0d9467", greenDim: "rgba(13,148,103,0.09)",
    red: "#c93131", redDim: "rgba(201,49,49,0.09)",
    amber: "#c27a0e", amberDim: "rgba(194,122,14,0.09)",
    purple: "#7341d4", purpleDim: "rgba(115,65,212,0.09)",
    cyan: "#0a7f8c",
    // Chart colors — punchy but not neon
    chart1: "#1d6ec1", chart2: "#0d9467", chart3: "#7341d4", chart4: "#c27a0e", chart5: "#c93131", chart6: "#0a7f8c",
    chartGrid: "#e2e5ed", chartAxis: "#8792a8",
    // Depth system — crisp, elevated, with inset highlights
    shadow1: "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)",
    shadow2: "0 4px 16px rgba(0,0,0,0.09), 0 2px 4px rgba(0,0,0,0.05)",
    shadow3: "0 12px 40px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.07)",
    cardGlow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
    cardHoverGlow: "0 8px 32px rgba(29,110,193,0.10), 0 0 0 1px rgba(29,110,193,0.14), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
    sidebarBg: "linear-gradient(180deg, #e8eaf1 0%, #dde0e8 100%)",
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
          padding: 32, minHeight: 120, borderRadius: 16, textAlign: "center",
          background: this.props.bg || "transparent", border: `1px dashed ${this.props.borderColor || "#1e2230"}`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: this.props.textColor || "#8b92a5", marginBottom: 6 }}>
            {this.props.name || "This section"} could not load
          </div>
          <div style={{ fontSize: 11, color: this.props.dimColor || "#3d4558", marginBottom: 12 }}>
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

// ── APP ERROR BOUNDARY — catches unhandled errors at the top level ──
class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) {
    // Log to console + audit (in production: send to Sentry/LogRocket)
    console.error("[FinanceOS] Unhandled error:", error, errorInfo);
    try {
      // Fire-and-forget error report to Supabase audit log
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://crecesswagluelvkesul.supabase.co"}/rest/v1/audit_log`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTI5NzYsImV4cCI6MjA4OTM4ODk3Nn0.IGEEYDStt-eH9Mf2G_DzqCPfruDjN8m_ORtAcmtSAZg", "Prefer": "return=minimal" },
        body: JSON.stringify({ action: "client.error", resource_type: "app", metadata: { message: error?.message, stack: error?.stack?.slice(0, 500), component: errorInfo?.componentStack?.slice(0, 300) } }),
      }).catch(() => {});
    } catch {}
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090b", fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ textAlign: "center", maxWidth: 400, padding: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #f06b6b20, #f06b6b08)", border: "1px solid #f06b6b20", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 24 }}>!</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#eef0f6", marginBottom: 8 }}>Something went wrong</div>
            <div style={{ fontSize: 13, color: "#636d84", lineHeight: 1.6, marginBottom: 24 }}>
              An unexpected error occurred. Our team has been notified. Please try refreshing the page.
            </div>
            <button onClick={() => window.location.reload()} style={{ fontSize: 13, padding: "12px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Refresh Page</button>
            <div style={{ marginTop: 16, fontSize: 10, color: "#3d4558" }}>Error: {this.state.error?.message || "Unknown"}</div>
          </div>
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
      const icon = t.type === "success" ? "✓" : t.type === "error" ? "✕" : t.type === "warning" ? "!" : "i";
      return (
        <div key={t.id} style={{
          padding: "12px 18px", borderRadius: 12, background: `${c.surface}f5`, border: `1px solid ${bg}30`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${bg}15`, fontSize: 12, color: c.text, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 10, minWidth: 280, maxWidth: 400,
          animation: "toastIn 0.3s cubic-bezier(0.22,1,0.36,1)", backdropFilter: "blur(12px)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${bg}, transparent)`, animation: "shrink 3s linear forwards" }} />
          <div style={{ width: 22, height: 22, borderRadius: 7, background: `${bg}18`, border: `1px solid ${bg}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 800, color: bg }}>{icon}</div>
          <span style={{ flex: 1 }}>{t.message}</span>
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
    <>
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", animation: "fadeIn 0.15s" }} />
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 400, background: c.surface, borderLeft: `1px solid ${c.border}`,
      zIndex: 1000, boxShadow: "-12px 0 50px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column",
      animation: "drawerIn 0.25s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${c.borderSub}`, position: "relative" }}>
        <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.accent}30, transparent)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}15, ${c.purple}08)`, border: `1px solid ${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={14} color={c.accent} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>{data.title}</span>
        </div>
        <div onClick={onClose} style={{ cursor: "pointer", padding: 4, borderRadius: 6, transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        ><X size={16} color={c.textDim} /></div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "24px 24px" }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: c.accent, letterSpacing: "-0.03em", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>{data.value}</div>
        <div style={{ marginBottom: 24, padding: "12px 0", borderBottom: `1px solid ${c.borderSub}` }}>
          <Spark data={data.trend} color={c.green} width={340} height={52} />
        </div>
        <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span>Breakdown</span>
          <div style={{ flex: 1, height: 1, background: c.borderSub }} />
        </div>
        {data.details.map((d, i) => (
          <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${c.borderSub}`, transition: "background 0.1s" }}>
            <span style={{ fontSize: 12, color: c.textSec, fontWeight: 500 }}>{d.label}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: colorMap[d.color], fontFamily: "'JetBrains Mono', monospace" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
    </>
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
  { month: "Jul", actual: 6800, budget: 6500, forecast: null, qoq: null },
  { month: "Aug", actual: 7100, budget: 6800, forecast: null, qoq: 4.4 },
  { month: "Sep", actual: 7600, budget: 7100, forecast: null, qoq: 7.0 },
  { month: "Oct", actual: 8000, budget: 7400, forecast: null, qoq: 5.3 },
  { month: "Nov", actual: 8500, budget: 7700, forecast: null, qoq: 6.3 },
  { month: "Dec", actual: 8800, budget: 8000, forecast: null, qoq: 3.5 },
  { month: "Jan", actual: null, budget: 8300, forecast: 9100, qoq: null },
  { month: "Feb", actual: null, budget: 8600, forecast: 9400, qoq: null },
  { month: "Mar", actual: null, budget: 8900, forecast: 9700, qoq: null },
  { month: "Apr", actual: null, budget: 9200, forecast: 9900, qoq: null },
  { month: "May", actual: null, budget: 9500, forecast: 10100, qoq: null },
  { month: "Jun", actual: null, budget: 9800, forecast: 10400, qoq: null },
];

const EXPENSE_DATA = [
  { name: "R&D", actual: 19270, budget: 19548, pct: 37.6, trend: "flat" },
  { name: "S&M", actual: 15460, budget: 14730, pct: 30.2, trend: "up" },
  { name: "Cloud", actual: 4455, budget: 4000, pct: 8.7, trend: "up" },
  { name: "COGS", actual: 7820, budget: 7365, pct: 15.3, trend: "flat" },
  { name: "G&A", actual: 4860, budget: 5115, pct: 9.5, trend: "down" },
];

const SEGMENT_DATA = [
  { name: "Enterprise", value: 38920, color: "#0ea5e9", growth: 28, pct: 76 },
  { name: "Mid-Market", value: 8650, color: "#a78bfa", growth: 14, pct: 17 },
  { name: "SMB", value: 2420, color: "#22d3ee", growth: -4, pct: 5 },
  { name: "Self-Serve", value: 1200, color: "#f5b731", growth: 62, pct: 2 },
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
    { name: "Cloud Infrastructure", actual: 4840, budget: 4200, note: "GPU costs for AI ↑$280K" },
    { name: "Customer Success", actual: 2180, budget: 2050, note: "2 CSMs hired early" },
    { name: "Support & Onboarding", actual: 800, budget: 1115, note: "Self-serve efficiency" },
  ], total: { name: "Total COGS", actual: 7820, budget: 7365 }},
  { section: "Operating Expenses", rows: [
    { name: "R&D — Engineering", actual: 14420, budget: 14650, note: "128 vs 142 planned HC" },
    { name: "R&D — Product", actual: 2850, budget: 2800, note: "+1 PM hire" },
    { name: "R&D — Data/ML", actual: 2000, budget: 2098, note: "8 ML reqs still open" },
    { name: "Sales", actual: 8920, budget: 8200, note: "3 AEs early + commissions" },
    { name: "Marketing", actual: 4340, budget: 4530, note: "Paid digital cut -$200K" },
    { name: "Revenue Operations", actual: 2200, budget: 2000, note: "SaaStr $180K unplanned" },
    { name: "Finance & Legal", actual: 1860, budget: 1950, note: "Legal retainer saved $65K" },
    { name: "People & Admin", actual: 1720, budget: 1850, note: "Office deferred $150K" },
    { name: "IT & Security", actual: 1280, budget: 1315, note: "SOC 2 completed on time" },
  ], total: { name: "Total OpEx", actual: 39590, budget: 39393 }},
  { section: "Other Income / Expense", rows: [
    { name: "Interest Income", actual: 320, budget: 240, note: "T-bill ladder yield ↑" },
    { name: "FX Gains / (Losses)", actual: -104, budget: -50, note: "EUR weakening vs USD" },
    { name: "One-time Items", actual: -216, budget: 0, note: "Lease termination fee" },
  ], total: { name: "Net Other", actual: 0, budget: 190 }},
];

const COPILOT_PROMPTS = [
  "What drove the revenue beat?",
  "Compare us vs Pigment",
  "Gross margin analysis",
  "Where are we over budget?",
  "Churn & retention trends",
  "Forecast accuracy report",
  "Burn multiple & runway",
  "Should we raise guidance?",
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

const LoadingSkeleton = memo(({ c }) => (
  <div style={{ padding: 32 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      {[0,1,2,3,4,5].map(i => (
        <div key={i} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px" }}>
          <Skeleton c={c} width={80} height={10} />
          <div style={{ height: 12 }} />
          <Skeleton c={c} width={120} height={28} />
          <div style={{ height: 8 }} />
          <Skeleton c={c} width={60} height={14} />
        </div>
      ))}
    </div>
    <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: 22, marginBottom: 24 }}>
      <Skeleton c={c} width={200} height={12} />
      <div style={{ height: 16 }} />
      <Skeleton c={c} height={200} radius={8} />
    </div>
  </div>
));

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
      {[{ label: "CSV", fn: onCSV, icon: "↓" }, { label: "PDF", fn: onPDF, icon: "⬇" }].map(b => (
        <button key={b.label} onClick={b.fn} style={{ fontSize: 10, padding: "6px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.textSec, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)", display: "flex", alignItems: "center", gap: 5 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}50`; e.currentTarget.style.color = c.accent; e.currentTarget.style.background = c.accentDim; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; e.currentTarget.style.background = c.surface; e.currentTarget.style.transform = "none"; }}
        ><span style={{ fontSize: 11 }}>{b.icon}</span> {b.label}</button>
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
const DemoBanner = memo(({ c, onNav, onUpgrade }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "8px 16px",
    background: `linear-gradient(90deg, ${c.accent}15, ${c.purple}10)`, borderBottom: `1px solid ${c.accent}20`,
    fontSize: 11, color: c.textSec, flexShrink: 0, flexWrap: "wrap",
  }}>
    <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: c.accentDim, color: c.accent, letterSpacing: "0.06em" }}>DEMO</span>
    <span>Viewing sample data for <strong style={{ color: c.text }}>Acme SaaS Corp</strong></span>
    <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.textFaint }} />
    <span onClick={() => onNav("integrations")} style={{ fontSize: 10, color: c.accent, fontWeight: 700, cursor: "pointer" }}>Connect Your ERP</span>
    <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.textFaint }} />
    <span onClick={onUpgrade} style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 5, background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, color: "#fff", cursor: "pointer" }}>Upgrade Now</span>
  </div>
));

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
const QuickActions = memo(({ c, onNav, toast }) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
    {[
      { label: "New Forecast", icon: TrendingUp, action: () => onNav("forecast"), color: c.accent },
      { label: "Run Variance", icon: Search, action: () => onNav("copilot"), color: c.purple },
      { label: "Export P&L", icon: FileText, action: () => { onNav("pnl"); toast("P&L ready for export", "success"); }, color: c.green },
      { label: "Close Tasks", icon: CheckSquare, action: () => onNav("close"), color: c.amber },
    ].map(a => (
      <button key={a.label} onClick={a.action} style={{
        display: "flex", alignItems: "center", gap: 8, fontSize: 11, padding: "10px 18px", borderRadius: 12,
        border: `1px solid ${c.border}`, background: c.surface, color: c.textSec,
        cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: c.cardGlow,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${a.color}40`; e.currentTarget.style.color = a.color; e.currentTarget.style.background = `${a.color}06`; e.currentTarget.style.boxShadow = `0 6px 20px ${a.color}10, 0 0 0 1px ${a.color}15`; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; e.currentTarget.style.background = c.surface; e.currentTarget.style.boxShadow = c.cardGlow; e.currentTarget.style.transform = "none"; }}
      >
        <span style={{ width: 22, height: 22, borderRadius: 7, background: `linear-gradient(135deg, ${a.color}15, ${a.color}08)`, border: `1px solid ${a.color}10`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><a.icon size={12} color={a.color} /></span>
        {a.label}
      </button>
    ))}
  </div>
));

// ── FINANCEOS BRAND MARK ─────────────────────────────────────
const FosLogo = memo(({ size = 32 }) => (
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
));

const FosLogoFull = memo(({ size = 32, c }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
    <FosLogo size={size} />
    <div>
      <span style={{ fontWeight: 800, fontSize: size * 0.47, color: c?.text || "#f0f2f5", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>Finance<span style={{ fontWeight: 400, opacity: 0.6 }}>OS</span></span>
    </div>
  </div>
));

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
const ChartTooltip = memo(({ active, payload, label, c }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: `${c.surface}f0`, border: `1px solid ${c.borderBright}`, borderRadius: 16, padding: "14px 18px",
      fontSize: 12, boxShadow: `${c.shadow3}, 0 0 0 1px ${c.accent}08`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      minWidth: 180, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c.accent}60, ${c.purple}40, transparent)` }} />
      <div style={{ fontWeight: 800, color: c.text, marginBottom: 10, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      {payload.filter(p => p.value != null).map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 24, padding: "4px 0", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, color: c.textSec, fontWeight: 500 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: `${p.color}30`, border: `2px solid ${p.color}`, display: "inline-block" }} />
            {p.name}
          </span>
          <span style={{ fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: c.text, fontSize: 12 }}>{typeof p.value === "number" ? fmt(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
});

// ── SPARKLINE ────────────────────────────────────────────────
const Spark = memo(({ data, color, width = 64, height = 24 }) => {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const id = `sp${Math.random().toString(36).slice(2, 6)}`;
  const lastY = parseFloat(points.split(" ").pop().split(",")[1]);
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="50%" stopColor={color} stopOpacity={0.08} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${id})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={lastY} r={3} fill={color} opacity={0.3} />
      <circle cx={width} cy={lastY} r={2} fill={color} />
    </svg>
  );
});

// ── KPI CARD ─────────────────────────────────────────────────
const KpiCard = memo(({ kpi, c, onClick, index = 0 }) => {
  const Icon = kpi.icon;
  const [hovered, setHovered] = useState(false);
  const accentColor = c[kpi.accent] || c.accent;
  return (
    <div onClick={onClick} style={{
      background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${hovered ? accentColor + "40" : c.border}`, borderRadius: 16, padding: "22px 24px",
      cursor: "pointer", transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
      position: "relative", overflow: "hidden",
      boxShadow: hovered ? `0 12px 36px ${accentColor}12, 0 0 0 1px ${accentColor}18` : c.cardGlow,
      transform: hovered ? "translateY(-4px)" : "none",
      animation: `fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${index * 0.06}s both`,
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient accent top edge */}
      <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg, transparent, ${accentColor}${hovered ? "90" : "35"}, transparent)`, transition: "all 0.3s", borderRadius: "0 0 2px 2px" }} />
      {/* Ambient corner glow on hover */}
      {hovered && <div style={{ position: "absolute", top: -40, right: -40, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`, pointerEvents: "none" }} />}
      {/* Subtle background sparkline watermark */}
      <div style={{ position: "absolute", bottom: 0, right: 0, opacity: hovered ? 0.08 : 0.04, transition: "opacity 0.3s", pointerEvents: "none" }}>
        <Spark data={kpi.spark} color={accentColor} width={120} height={50} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: hovered ? c.textSec : c.textFaint, transition: "color 0.2s" }}>{kpi.label}</div>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${accentColor}${hovered ? "22" : "12"}, ${accentColor}08)`, border: `1px solid ${accentColor}${hovered ? "20" : "08"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s" }}>
          <Icon size={15} color={accentColor} strokeWidth={2} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
        <div>
          <div style={{ fontSize: 30, fontWeight: 800, color: c.text, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{kpi.value}</div>
          <div style={{
            fontSize: 11, fontWeight: 700, marginTop: 8, padding: "3px 10px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 3,
            color: kpi.up ? c.green : c.red, background: kpi.up ? c.greenDim : c.redDim,
            border: `1px solid ${kpi.up ? c.green : c.red}15`,
          }}>
            {kpi.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {kpi.delta}
          </div>
        </div>
        <Spark data={kpi.spark} color={kpi.up ? c.green : c.red} />
      </div>
    </div>
  );
});

// ── INSIGHT ROW ──────────────────────────────────────────────
const InsightRow = memo(({ item, c, onClick }) => {
  const sev = INSIGHT_SEVERITY[item.severity] || {};
  const sevColor = c[sev.color] || c.accent;
  return (
    <div onClick={onClick} style={{
      display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px",
      background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, borderRadius: 12,
      cursor: "pointer", transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)", marginBottom: 8,
      borderLeft: `3px solid ${item.color}`, boxShadow: c.shadow1,
      position: "relative", overflow: "hidden",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}40`; e.currentTarget.style.borderLeftColor = item.color; e.currentTarget.style.boxShadow = c.shadow2; e.currentTarget.style.transform = "translateX(3px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; e.currentTarget.style.boxShadow = c.shadow1; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: c.text, lineHeight: 1.55, fontWeight: 500 }}>{item.text}</div>
        <div style={{ fontSize: 10, color: c.textDim, marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600 }}>{item.source}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.textFaint, display: "inline-block" }} />
          <span>{item.time} ago</span>
          {item.severity && <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 4, background: `${sevColor}12`, color: sevColor, letterSpacing: "0.04em", border: `1px solid ${sevColor}10` }}>{sev.label}</span>}
          {item.action && <span style={{ fontSize: 9, color: c.accent, fontWeight: 700, background: `${c.accent}08`, padding: "1px 6px", borderRadius: 3 }}>{item.action}</span>}
        </div>
      </div>
      <ChevronRight size={14} color={c.textFaint} style={{ flexShrink: 0, marginTop: 4, transition: "transform 0.15s" }} />
    </div>
  );
});

// ══════════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ══════════════════════════════════════════════════════════════
const DashboardView = ({ c, onNav, toast, onDrawer, userName, period }) => {
  const [hiddenSeries, setHiddenSeries] = useState({});
  const toggleSeries = (key) => setHiddenSeries(prev => ({ ...prev, [key]: !prev[key] }));
  const displayName = userName && userName !== "Guest" ? userName.split(" ")[0] : null;
  const [chartPeriod, setChartPeriod] = useState("YTD");
  const chartData = useMemo(() => chartPeriod === "QTD" ? REVENUE_DATA.slice(-6) : REVENUE_DATA, [chartPeriod]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Memoize expensive data aggregations
  const segmentTotal = useMemo(() => SEGMENT_DATA.reduce((a, b) => a + b.value, 0), []);
  const expenseTotals = useMemo(() => ({
    actual: EXPENSE_DATA.reduce((a, d) => a + d.actual, 0),
    budget: EXPENSE_DATA.reduce((a, d) => a + d.budget, 0),
  }), []);

  return (
  <div style={{ padding: 32 }}>
    {/* Welcome header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: c.text, letterSpacing: "-0.03em", lineHeight: 1.2 }}>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}{displayName ? `, ${displayName}` : ""}
          {period && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: c.accentDim, color: c.accent, marginLeft: 10, verticalAlign: "middle", letterSpacing: "0.02em" }}>{period}</span>}
        </div>
        <div style={{ fontSize: 12, color: c.textDim, marginTop: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: c.green, display: "inline-block", animation: "pulse 2s infinite" }} />Revenue ahead by $2.09M</span>
          <span style={{ color: c.textFaint }}>·</span>
          <span>Rule of 40 at 52.1</span>
          <span style={{ color: c.textFaint }}>·</span>
          <span style={{ color: c.amber, fontWeight: 600 }}>4 variances need attention</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ padding: "8px 16px", borderRadius: 10, background: `linear-gradient(135deg, ${c.purple}10, ${c.accent}06)`, border: `1px solid ${c.purple}18`, fontSize: 11, color: c.purple, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
          onClick={() => onNav("copilot")}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.purple}40`; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.purple}18`; e.currentTarget.style.transform = "none"; }}
        >
          <Sparkles size={13} /> Ask AI
        </div>
      </div>
    </div>

    {/* Quick Actions — ENV 9 */}
    <QuickActions c={c} onNav={onNav} toast={toast} />

    {/* Data Pipeline Status */}
    <div onClick={() => onNav("integrations")} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 16px", background: c.surfaceAlt, borderRadius: 10, border: `1px solid ${c.borderSub}`, fontSize: 10, color: c.textDim, flexWrap: "wrap", cursor: "pointer", transition: "all 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent + "30"; e.currentTarget.style.background = c.accentDim; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; e.currentTarget.style.background = c.surfaceAlt; }}
    >
      <span style={{ fontWeight: 700, color: c.textSec, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} />
        Pipeline Health
      </span>
      <span style={{ width: 1, height: 14, background: c.borderSub }} />
      {[
        { name: "NetSuite", fresh: "2m", ok: true },
        { name: "Salesforce", fresh: "45s", ok: true },
        { name: "Stripe", fresh: "1m", ok: true },
        { name: "Rippling", fresh: "4m", ok: true },
        { name: "Snowflake", fresh: "3m", ok: true },
        { name: "HubSpot", fresh: "2m", ok: true },
        { name: "Ramp", fresh: "5m", ok: true },
      ].map(p => (
        <span key={p.name} style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.ok ? c.green : c.red }} />
          <span style={{ fontWeight: 600 }}>{p.name}</span>
          <span style={{ color: c.textFaint, fontFamily: "'JetBrains Mono', monospace", fontSize: 8 }}>{p.fresh}</span>
        </span>
      ))}
      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: c.green }}>7/7</span>
        <span style={{ fontSize: 9, color: c.textFaint }}>View all →</span>
      </span>
    </div>

    {/* KPI Grid — ENV 10: Premium hover glow */}
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: isMobile ? 10 : 16, marginBottom: 24 }}>
      {KPIS.map((k, i) => <KpiCard key={k.label} kpi={k} c={c} onClick={() => onDrawer(k.label)} index={i} />)}
    </div>

    {/* Charts Row */}
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr", gap: 16, marginBottom: 24 }}>
      {/* Revenue Chart */}
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
        {/* Gradient accent top edge */}
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.accent}50, ${c.purple}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}18, ${c.purple}10)`, border: `1px solid ${c.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={14} color={c.accent} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text, letterSpacing: "-0.01em" }}>Revenue Performance</div>
              <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>Actual vs Budget vs Forecast ($K)</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 2, background: c.surfaceAlt, borderRadius: 8, padding: 2, border: `1px solid ${c.borderSub}` }}>
            {["QTD", "YTD", "12M"].map(p => (
              <span key={p} onClick={() => setChartPeriod(p)} style={{ fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: chartPeriod === p ? c.accent : "transparent", color: chartPeriod === p ? "#fff" : c.textFaint, cursor: "pointer", transition: "all 0.15s" }}>{p}</span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={230}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.accent} stopOpacity={0.2} /><stop offset="60%" stopColor={c.accent} stopOpacity={0.05} /><stop offset="100%" stopColor={c.accent} stopOpacity={0} /></linearGradient>
              <linearGradient id="gFc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.green} stopOpacity={0.15} /><stop offset="100%" stopColor={c.green} stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid stroke={c.chartGrid} strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: c.chartAxis, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: c.chartAxis }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}M`} />
            <Tooltip content={<ChartTooltip c={c} />} cursor={{ stroke: c.accent, strokeWidth: 1, strokeDasharray: "3 3", strokeOpacity: 0.3 }} />
            <ReferenceLine y={7800} stroke={c.amber} strokeDasharray="8 4" strokeWidth={1} strokeOpacity={0.5} label={{ value: "AVG", fill: c.amber, fontSize: 8, fontWeight: 800, position: "right" }} />
            {!hiddenSeries.actual && <Area type="monotone" dataKey="actual" stroke={c.accent} fill="url(#gAct)" strokeWidth={2.5} name="Actual" dot={{ r: 4, fill: c.surface, stroke: c.accent, strokeWidth: 2.5 }} activeDot={{ r: 6, fill: c.accent, stroke: c.surface, strokeWidth: 2 }} connectNulls={false} />}
            {!hiddenSeries.budget && <Line type="monotone" dataKey="budget" stroke={c.textFaint} strokeWidth={1.5} strokeDasharray="5 5" name="Budget" dot={false} />}
            {!hiddenSeries.forecast && <Area type="monotone" dataKey="forecast" stroke={c.green} fill="url(#gFc)" strokeWidth={2} strokeDasharray="8 4" name="Forecast" dot={{ r: 3.5, fill: c.surface, stroke: c.green, strokeWidth: 2 }} connectNulls={false} />}
          </ComposedChart>
        </ResponsiveContainer>
        {/* Legend row */}
        <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 10, color: c.textDim, alignItems: "center", paddingTop: 10, borderTop: `1px solid ${c.borderSub}`, flexWrap: "wrap" }}>
          {[
            { key: "actual", label: "Actual", color: c.accent },
            { key: "budget", label: "Budget", color: c.textFaint },
            { key: "forecast", label: "Forecast", color: c.green },
          ].map(s => (
            <span key={s.key} onClick={() => toggleSeries(s.key)} style={{
              display: "flex", alignItems: "center", gap: 5, cursor: "pointer", padding: "3px 8px", borderRadius: 5,
              opacity: hiddenSeries[s.key] ? 0.3 : 1, background: hiddenSeries[s.key] ? "transparent" : `${s.color}08`,
              transition: "all 0.2s", fontWeight: 600,
            }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: `${s.color}20`, border: `2px solid ${s.color}`, display: "inline-block", opacity: hiddenSeries[s.key] ? 0.3 : 1 }} />
              {s.label}
            </span>
          ))}
          <span style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: c.greenDim, color: c.green, border: `1px solid ${c.green}10` }}>+$2.09M beat</span>
            <span style={{ fontWeight: 700, color: c.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>H: $10.4M · L: $6.8M</span>
          </span>
        </div>
      </div>

      {/* Segment Donut */}
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.purple}40, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.purple}18, ${c.cyan}10)`, border: `1px solid ${c.purple}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Target size={14} color={c.purple} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Revenue by Segment</div>
            <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>FY2025 YTD distribution</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <defs>
              {SEGMENT_DATA.map((s, i) => (
                <linearGradient key={i} id={`seg${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={s.color} stopOpacity={1} /><stop offset="100%" stopColor={s.color} stopOpacity={0.7} /></linearGradient>
              ))}
            </defs>
            <Pie data={SEGMENT_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={3}>
              {SEGMENT_DATA.map((s, i) => <Cell key={i} fill={`url(#seg${i})`} />)}
            </Pie>
            <Tooltip content={<ChartTooltip c={c} />} />
            <text x="50%" y="44%" textAnchor="middle" fill={c.text} fontSize={20} fontWeight={800} fontFamily="'JetBrains Mono', monospace">${(segmentTotal / 1000).toFixed(1)}M</text>
            <text x="50%" y="58%" textAnchor="middle" fill={c.textDim} fontSize={9} fontWeight={700} letterSpacing="0.1em">TOTAL</text>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {SEGMENT_DATA.map(s => {
            const pct = ((s.value / segmentTotal) * 100).toFixed(0);
            return (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                <div style={{ width: 10, height: 10, borderRadius: 4, background: `linear-gradient(135deg, ${s.color}, ${s.color}aa)`, boxShadow: `0 0 6px ${s.color}30`, flexShrink: 0 }} />
                <span style={{ color: c.textSec, fontWeight: 500, flex: 1 }}>{s.name}</span>
                {s.growth != null && <span style={{ fontSize: 9, fontWeight: 700, color: s.growth >= 0 ? c.green : c.red, background: s.growth >= 0 ? c.greenDim : c.redDim, padding: "1px 5px", borderRadius: 3 }}>{s.growth >= 0 ? "+" : ""}{s.growth}%</span>}
                <span style={{ fontWeight: 700, color: c.textSec, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{fmt(s.value)}</span>
                <div style={{ width: 40, height: 4, background: c.bg2, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 2 }} />
                </div>
                <span style={{ fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, width: 30, textAlign: "right" }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Expense Bars + Insights */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Expense Breakdown */}
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.amber}40, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.amber}18, ${c.red}08)`, border: `1px solid ${c.amber}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={14} color={c.amber} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>OpEx Breakdown</div>
            <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>Actual vs Budget · FY2025 YTD</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={EXPENSE_DATA} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gExpAct" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={c.accent} stopOpacity={0.9} /><stop offset="100%" stopColor={c.accent} stopOpacity={0.6} /></linearGradient>
              <linearGradient id="gExpBud" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={c.textFaint} stopOpacity={0.35} /><stop offset="100%" stopColor={c.textFaint} stopOpacity={0.15} /></linearGradient>
            </defs>
            <CartesianGrid stroke={c.chartGrid} strokeDasharray="3 6" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: c.chartAxis }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}K`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: c.textSec, fontWeight: 600 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<ChartTooltip c={c} />} cursor={{ fill: `${c.accent}06` }} />
            <Bar dataKey="actual" fill="url(#gExpAct)" radius={[0, 6, 6, 0]} barSize={16} name="Actual" />
            <Bar dataKey="budget" fill="url(#gExpBud)" radius={[0, 6, 6, 0]} barSize={16} name="Budget" />
          </BarChart>
        </ResponsiveContainer>
        {/* Variance summary */}
        <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${c.borderSub}` }}>
          {EXPENSE_DATA.map(d => {
            const v = d.actual - d.budget;
            const over = v > 0;
            const trendArrow = d.trend === "up" ? "↑" : d.trend === "down" ? "↓" : "→";
            return (
              <div key={d.name} style={{ flex: 1, padding: "8px 6px", borderRadius: 8, background: over ? c.redDim : c.greenDim, textAlign: "center", border: `1px solid ${over ? c.red : c.green}08` }}>
                <div style={{ fontSize: 8, color: c.textDim, fontWeight: 700, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.name}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: over ? c.red : c.green, fontFamily: "'JetBrains Mono', monospace" }}>{over ? "+" : ""}{fmt(v)}</div>
                <div style={{ fontSize: 8, color: c.textFaint, marginTop: 2 }}>{d.pct}% rev {trendArrow}</div>
              </div>
            );
          })}
        </div>
        {/* Total summary */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, padding: "8px 12px", background: c.surfaceAlt, borderRadius: 8, fontSize: 10 }}>
          <span style={{ color: c.textDim, fontWeight: 600 }}>Total OpEx</span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: c.text, fontWeight: 700 }}>${(expenseTotals.actual / 1000).toFixed(1)}K</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: c.textDim }}>vs ${(expenseTotals.budget / 1000).toFixed(1)}K</span>
            {(() => { const netV = expenseTotals.actual - expenseTotals.budget; const over = netV > 0; return <span style={{ fontWeight: 800, color: over ? c.red : c.green, fontFamily: "'JetBrains Mono', monospace" }}>{over ? "+" : ""}{fmt(netV)}</span>; })()}
          </div>
        </div>
      </div>
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.purple}40, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.purple}18, ${c.accent}10)`, border: `1px solid ${c.purple}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={14} color={c.purple} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>AI Insights</div>
              <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>Real-time variance detection</div>
            </div>
          </div>
          <div style={{ fontSize: 9, fontWeight: 800, padding: "4px 12px", borderRadius: 8, background: `linear-gradient(135deg, ${c.purple}15, ${c.accent}08)`, color: c.purple, border: `1px solid ${c.purple}18`, letterSpacing: "0.04em" }}>4 ACTIVE</div>
        </div>
        {AI_INSIGHTS_ENRICHED.map((ins, i) => <InsightRow key={i} item={ins} c={c} onClick={() => onNav("copilot")} />)}
      </div>
    </div>

    {/* Financial Pipeline Row — Cash Flow + ARR Bridge + Pipeline */}
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16, marginTop: 24 }}>

      {/* Cash Flow Waterfall */}
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 22px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.green}35, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.green}18, ${c.accent}08)`, border: `1px solid ${c.green}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={14} color={c.green} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Cash Flow</div>
            <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>Waterfall · FY2025 YTD ($K)</div>
          </div>
        </div>
        {[
          { label: "Opening Cash", value: 12800, total: true },
          { label: "Operating CF", value: 4200, positive: true },
          { label: "CapEx", value: -1850, positive: false },
          { label: "Debt Service", value: -380, positive: false },
          { label: "AR Change", value: -620, positive: false },
          { label: "Tax Payments", value: -1150, positive: false },
          { label: "Closing Cash", value: 13000, total: true },
        ].map((item, i) => {
          const max = 13000;
          const pct = Math.abs(item.value) / max * 100;
          return (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: item.total ? c.text : c.textDim, fontWeight: item.total ? 700 : 500, width: 80, flexShrink: 0 }}>{item.label}</span>
              <div style={{ flex: 1, height: 14, background: c.bg2, borderRadius: 4, overflow: "hidden", position: "relative" }}>
                <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 4, background: item.total ? `linear-gradient(90deg, ${c.accent}, ${c.accent}bb)` : item.positive ? `linear-gradient(90deg, ${c.green}, ${c.green}bb)` : `linear-gradient(90deg, ${c.red}cc, ${c.red}88)` }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: item.total ? c.accent : item.positive ? c.green : c.red, fontFamily: "'JetBrains Mono', monospace", width: 55, textAlign: "right", flexShrink: 0 }}>{item.value >= 0 ? "" : ""}{fmt(item.value)}</span>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${c.borderSub}`, fontSize: 9, color: c.textFaint }}>
          <span>Net change: <span style={{ color: c.green, fontWeight: 700 }}>+$200K</span></span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>Runway: 34 mo</span>
        </div>
      </div>

      {/* ARR Bridge */}
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 22px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.accent}35, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}18, ${c.purple}08)`, border: `1px solid ${c.accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={14} color={c.accent} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>ARR Bridge</div>
            <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>Movement · Q2 FY2025</div>
          </div>
        </div>
        {[
          { label: "Beginning ARR", value: 36900, color: c.accent, weight: 800 },
          { label: "New Business", value: 6200, color: c.green, prefix: "+" },
          { label: "Expansion", value: 4200, color: c.green, prefix: "+" },
          { label: "Contraction", value: -820, color: c.amber, prefix: "" },
          { label: "Churn", value: -1880, color: c.red, prefix: "" },
          { label: "Ending ARR", value: 44600, color: c.accent, weight: 800 },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${c.borderSub}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 3, background: `${item.color}30`, border: `2px solid ${item.color}`, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: item.weight ? c.text : c.textSec, fontWeight: item.weight || 500 }}>{item.label}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: item.weight || 700, color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.prefix || ""}{fmt(item.value)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${c.borderSub}`, fontSize: 9, color: c.textFaint }}>
          <span>Net new ARR: <span style={{ color: c.green, fontWeight: 700 }}>+$7.7M</span></span>
          <span>NDR: <span style={{ color: c.green, fontWeight: 700 }}>118%</span></span>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 22px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.purple}35, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.purple}18, ${c.green}08)`, border: `1px solid ${c.purple}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Target size={14} color={c.purple} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Pipeline Funnel</div>
            <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>Active pipeline · Weighted $38M</div>
          </div>
        </div>
        {[
          { stage: "Qualified", deals: 142, value: 68.4, pct: 100, color: c.accent },
          { stage: "Discovery", deals: 89, value: 42.1, pct: 62, color: c.cyan },
          { stage: "Proposal", deals: 52, value: 28.6, pct: 42, color: c.purple },
          { stage: "Negotiation", deals: 28, value: 18.2, pct: 27, color: c.amber },
          { stage: "Closing", deals: 14, value: 12.4, pct: 18, color: c.green },
        ].map((s, i) => (
          <div key={s.stage} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
              <span style={{ color: c.textSec, fontWeight: 600 }}>{s.stage} <span style={{ color: c.textFaint }}>({s.deals})</span></span>
              <span style={{ fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>${s.value}M</span>
            </div>
            <div style={{ height: 10, background: c.bg2, borderRadius: 5, overflow: "hidden" }}>
              <div style={{ width: `${s.pct}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`, borderRadius: 5, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
            </div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${c.borderSub}`, fontSize: 9, color: c.textFaint }}>
          <span>Win rate: <span style={{ color: c.green, fontWeight: 700 }}>32%</span></span>
          <span>Avg cycle: <span style={{ fontWeight: 700, color: c.text }}>42 days</span></span>
          <span>Weighted: <span style={{ fontWeight: 700, color: c.accent }}>$38M</span></span>
        </div>
      </div>
    </div>

    {/* Cross-sell banner */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
      {/* Referral */}
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s", cursor: "pointer", position: "relative", overflow: "hidden" }}
        onClick={() => toast("Referral link copied to clipboard", "success")}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.green}40`; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${c.green}18, ${c.green}08)`, border: `1px solid ${c.green}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Users size={18} color={c.green} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 3 }}>Refer a finance team</div>
          <div style={{ fontSize: 11, color: c.textDim, lineHeight: 1.4 }}>They get 20% off. You get $100 credit.</div>
        </div>
        <div style={{ fontSize: 10, padding: "7px 14px", borderRadius: 8, border: `1px solid ${c.green}20`, background: c.greenDim, color: c.green, fontWeight: 700, whiteSpace: "nowrap", fontFamily: "inherit" }}>Copy Link</div>
      </div>
      {/* Ecosystem */}
      <div style={{ background: `linear-gradient(135deg, ${c.accent}06, ${c.purple}04)`, border: `1px solid ${c.accent}15`, borderRadius: 16, padding: "22px 24px", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s", cursor: "pointer", position: "relative", overflow: "hidden" }}
        onClick={() => window.open("https://vaultline.vercel.app", "_blank")}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}40`; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.accent}15`; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${c.purple}18, ${c.accent}08)`, border: `1px solid ${c.purple}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Layers size={18} color={c.purple} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 3 }}>Vaultline Suite</div>
          <div style={{ fontSize: 11, color: c.textDim, lineHeight: 1.4 }}>Add Treasury or Compliance. Save 15% with bundle.</div>
        </div>
        <div style={{ fontSize: 10, padding: "7px 14px", borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, color: "#fff", fontWeight: 700, whiteSpace: "nowrap", fontFamily: "inherit" }}>Explore</div>
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
  "margin": "**Gross Margin Analysis: 84.7% (+2.1pp YoY)**\n\n**What's driving the improvement:**\n• Cloud cost optimization: moved to reserved instances → -$380K/yr\n• Support automation: AI deflection at 42% → headcount flat despite 24% growth\n• Revenue mix shift: Enterprise (87% margin) growing faster than SMB (78% margin)\n\n**Risks to watch:**\n• AI inference costs scaling with usage — currently $0.004/query, could 3x\n• Mid-market support tickets up 18% (churn signal?)\n\n**Benchmark:** SaaS median 72%. We're top-decile at 84.7%.\n\n**Recommendation:** Lock in 3-year cloud commitments while rates are favorable. Monitor AI cost per query weekly.",
  "burn": "**Burn Multiple: 0.8x (efficient growth)**\n\nFormula: Net Burn / Net New ARR = $9.4M / $11.7M = 0.80x\n\n**Breakdown:**\n• Net new ARR: $11.7M (from $36.9M → $48.6M)\n• Total OpEx: $39.6M\n• Cash consumed: $9.4M net burn\n\n**Benchmark context:**\n• <1.0x = best-in-class efficiency (Bessemer says 'superhuman')\n• 1.0-1.5x = good\n• >2.0x = concerning\n\n**Cash position:** $12.8M with 34 months runway at current burn.\n\n**Recommendation:** Maintain below 1.0x. Selective hiring in enterprise sales only — each rep producing $1.8M ARR.",
  "churn": "**Churn & Retention Analysis**\n\n**Logo churn:** 4.2% annualized (8 accounts lost of 192)\n• 5 were SMB (<$25K) — expected at this segment\n• 2 mid-market lost to Runway on price\n• 1 enterprise churned due to M&A (acquired company standardized)\n\n**Revenue churn:** 2.1% gross, offset by 118% NDR\n• Net revenue retention: 118% means every $1 from last year is now $1.18\n• Expansion: AI module upsell (34% attach), seat expansion, tier upgrades\n\n**Cohort trend:** 2023 cohort NDR at 124% (maturing well). 2024 cohort at 112% (still early).\n\n**Recommendation:** Launch mid-market win-back campaign targeting the 2 Runway losses. Pricing flexibility in the $25-50K band.",
  "expense": "**Expense Variance Summary — YTD**\n\n**Over budget (action needed):**\n• S&M: +$730K over (+5.0%) — Hiring $420K ahead of plan, events $180K for re:Invent\n• Cloud/Infra: +$455K over (+12.4%) — AI inference costs scaling faster than modeled\n\n**Under budget (favorable):**\n• R&D: -$278K under (-1.4%) — two senior hires delayed to Q3\n• G&A: -$255K under (-5.0%) — legal fees lower than budgeted\n\n**Total OpEx:** $39.6M vs $39.4M budget (+$200K net, +0.5%)\n\n**Recommendation:** S&M overspend is deliberate (pipeline ROI 7.2x). Cloud costs need attention — set up inference cost alerts at $0.006/query threshold.",
  "forecast": "**Forecast Accuracy Assessment**\n\n**Current model:** ETS + XGBoost + Linear ensemble\n• MAPE: 3.2% (industry median: 8-12%)\n• Best on: Revenue, COGS (1.8% MAPE)\n• Weakest on: S&M timing (6.1% MAPE — event spend lumpy)\n\n**14 drivers tracked:**\n• Pipeline velocity, win rates, ACV, NDR, logo churn\n• Headcount plan, cloud costs, AI usage, event calendar\n• 3 external: Fed rate, SaaS multiples, hiring index\n\n**Confidence intervals:**\n• Q3 revenue: $13.2M ± $420K (95% CI)\n• Full year: $52.8M ± $1.6M\n\n**Recommendation:** Retrain weekly during Q3 (board prep). Add competitor pricing as a driver — 2 recent losses correlated with Runway price drops.",
  "default": "I have Acme's full financials, SaaS metrics, benchmarks, and competitive data loaded. That's a great question — let me analyze the data.\n\nBased on the current performance:\n• Revenue: $51.19M YTD (+4.3% vs plan)\n• Gross margin: 84.7%\n• Rule of 40: 52.1 (top quartile)\n• NDR: 118%\n• Burn multiple: 0.8x (efficient)\n• Cash runway: 34 months ($12.8M)\n\nI can help with variance analysis, scenario modeling, competitive benchmarks, forecasting, churn analysis, or expense deep-dives. What would you like to explore?",
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

    // Route through Supabase Edge Function (API key stays server-side)
    // Falls back to demo responses if Edge Function unavailable
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");
      const res = await fetch(`${SUPABASE_URL}/functions/v1/copilot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
          "apikey": SUPABASE_KEY,
        },
        body: JSON.stringify({
          system: AI_SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      if (!res.ok) throw new Error("Edge Function unavailable");
      const data = await res.json();
      const reply = data.text || "I couldn't process that request.";
      if (mountedRef.current) setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      // Demo fallback — works without auth for demo users
      const q = userMsg.toLowerCase();
      let response = COPILOT_RESPONSES.default;
      if (q.includes("revenue") || q.includes("beat") || q.includes("what drove")) response = COPILOT_RESPONSES.revenue;
      else if (q.includes("pigment") || q.includes("competitor") || q.includes("compare") || q.includes("runway") || q.includes("anaplan")) response = COPILOT_RESPONSES.pigment;
      else if (q.includes("guidance") || q.includes("raise") || q.includes("should we") || q.includes("board")) response = COPILOT_RESPONSES.guidance;
      else if (q.includes("margin") || q.includes("gross") || q.includes("cogs") || q.includes("profit")) response = COPILOT_RESPONSES.margin;
      else if (q.includes("burn") || q.includes("cash") || q.includes("runway") || q.includes("efficiency")) response = COPILOT_RESPONSES.burn;
      else if (q.includes("churn") || q.includes("retention") || q.includes("ndr") || q.includes("lost") || q.includes("cancel")) response = COPILOT_RESPONSES.churn;
      else if (q.includes("expense") || q.includes("spend") || q.includes("opex") || q.includes("cost") || q.includes("over budget")) response = COPILOT_RESPONSES.expense;
      else if (q.includes("forecast") || q.includes("predict") || q.includes("mape") || q.includes("model") || q.includes("accuracy")) response = COPILOT_RESPONSES.forecast;
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
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${c.purple}20, ${c.accent}10)`, border: `1px solid ${c.purple}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <Sparkles size={15} color={c.purple} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>AI Copilot</div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>Ask anything about your financials · Visible reasoning · Cited sources</div>
          </div>
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
      <div style={{ flex: 1, overflow: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.length === 0 && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", maxWidth: 320 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${c.purple}15, ${c.accent}08)`, border: `1px solid ${c.purple}10`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Sparkles size={24} color={c.purple} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.text, marginBottom: 6 }}>Ask me anything</div>
              <div style={{ fontSize: 12, color: c.textDim, lineHeight: 1.6, marginBottom: 16 }}>I can analyze your P&L variances, forecast revenue, compare scenarios, and surface hidden patterns in your data.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
                {["What drove the $2.09M revenue beat?", "Compare us to Pigment and Anaplan", "Should we raise FY guidance?", "Where are we over budget on expenses?"].map(q => (
                  <button key={q} onClick={() => { setInput(q); }} style={{
                    fontSize: 11, padding: "10px 14px", borderRadius: 10, border: `1px solid ${c.borderSub}`,
                    background: c.surfaceAlt, color: c.textSec, cursor: "pointer", fontFamily: "inherit",
                    fontWeight: 500, textAlign: "left", transition: "all 0.15s", lineHeight: 1.4,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.text; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; e.currentTarget.style.color = c.textSec; }}
                  >{q}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            {/* Avatar */}
            <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, background: m.role === "user" ? `linear-gradient(135deg, ${c.green}, ${c.cyan})` : `linear-gradient(135deg, ${c.purple}25, ${c.accent}15)`, border: m.role === "user" ? "none" : `1px solid ${c.purple}15`, fontSize: 10, fontWeight: 800, color: m.role === "user" ? "#fff" : c.purple }}>
              {m.role === "user" ? "Y" : <Sparkles size={12} />}
            </div>
            <div style={{
              padding: m.role === "user" ? "12px 18px" : "16px 20px",
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? c.accentMid : c.surface,
              border: `1px solid ${m.role === "user" ? c.accent + "30" : c.border}`,
              boxShadow: m.role === "user" ? "none" : c.shadow1,
              fontSize: 13, lineHeight: 1.75, color: c.text, whiteSpace: "pre-wrap", flex: 1,
            }}>
              {m.role === "assistant" && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, fontSize: 10, color: c.purple, fontWeight: 700, letterSpacing: "0.02em" }}>
                FinanceOS Copilot
                <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: c.greenDim, color: c.green, fontWeight: 800 }}>AI</span>
              </div>}
              {m.content.split("\n").map((line, j) => {
                if (line.startsWith("**") && line.endsWith("**")) return <div key={j} style={{ fontWeight: 700, color: c.text, marginTop: 8, marginBottom: 2, fontSize: 13.5 }}>{line.replace(/\*\*/g, "")}</div>;
                if (line.match(/^\*\*.*\*\*$/)) return <div key={j} style={{ fontWeight: 700, color: c.text, marginTop: 8, marginBottom: 2 }}>{line.replace(/\*\*/g, "")}</div>;
                if (line.startsWith("• ")) return <div key={j} style={{ paddingLeft: 14, color: c.textSec, position: "relative", marginBottom: 2 }}><span style={{ position: "absolute", left: 0, color: c.accent }}>•</span>{line.slice(2)}</div>;
                return <div key={j}>{line || <br />}</div>;
              })}
            </div>
          </div>
        ))}
        {thinking && (
          <div style={{ display: "flex", gap: 10, alignSelf: "flex-start", maxWidth: "82%" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, background: `linear-gradient(135deg, ${c.purple}25, ${c.accent}15)`, border: `1px solid ${c.purple}15` }}>
              <Sparkles size={12} color={c.purple} />
            </div>
            <div style={{
              padding: "14px 20px", borderRadius: "14px 14px 14px 4px",
              background: c.surface, border: `1px solid ${c.border}`, boxShadow: c.shadow1,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 12, color: c.textDim }}>Analyzing financials</span>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: c.purple, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
              </div>
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
      <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.accent}15, ${c.green}08)`, border: `1px solid ${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <FileText size={17} color={c.accent} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>P&L Statement</div>
          <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>FY2025 YTD · Click any variance to ask AI Copilot for root cause analysis</div>
        </div>
      </div>
      <ExportBar c={c} title=""
        onCSV={() => { const rows = PNL_DATA.flatMap(s => [...s.rows.map(r => [s.section, r.name, r.actual, r.budget, r.actual - r.budget, r.note || ""]), [s.section, s.total.name, s.total.actual, s.total.budget, s.total.actual - s.total.budget, ""]]); downloadCSV("financeos-pnl-fy2025.csv", ["Section","Line Item","Actual ($K)","Budget ($K)","Variance ($K)","Notes"], rows); toast("P&L exported as CSV", "success"); }}
        onPDF={() => { window.print(); toast("Use Save as PDF in the print dialog", "info"); }}
      />
      {/* Financial Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Revenue", value: fmt(PNL_DATA[0]?.total?.actual || 0), delta: fmtPct(variancePct(PNL_DATA[0]?.total?.actual || 0, PNL_DATA[0]?.total?.budget || 1)), fav: true, color: c.green },
          { label: "Gross Profit", value: fmt((PNL_DATA[0]?.total?.actual || 0) - (PNL_DATA[1]?.total?.actual || 0)), delta: `${(((PNL_DATA[0]?.total?.actual || 0) - (PNL_DATA[1]?.total?.actual || 0)) / (PNL_DATA[0]?.total?.actual || 1) * 100).toFixed(1)}% margin`, fav: true, color: c.accent },
          { label: "Total OpEx", value: fmt(PNL_DATA[2]?.total?.actual || 0), delta: fmtPct(variancePct(PNL_DATA[2]?.total?.actual || 0, PNL_DATA[2]?.total?.budget || 1)), fav: (PNL_DATA[2]?.total?.actual || 0) <= (PNL_DATA[2]?.total?.budget || 0), color: c.amber },
          { label: "EBITDA", value: fmt((PNL_DATA[0]?.total?.actual || 0) - (PNL_DATA[1]?.total?.actual || 0) - (PNL_DATA[2]?.total?.actual || 0) + (PNL_DATA[3]?.total?.actual || 0)), delta: `${(((PNL_DATA[0]?.total?.actual || 0) - (PNL_DATA[1]?.total?.actual || 0) - (PNL_DATA[2]?.total?.actual || 0) + (PNL_DATA[3]?.total?.actual || 0)) / (PNL_DATA[0]?.total?.actual || 1) * 100).toFixed(1)}% margin`, fav: true, color: c.green },
        ].map(k => (
          <div key={k.label} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 12, padding: "14px 16px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg, transparent, ${k.color}25, transparent)`, borderRadius: "0 0 2px 2px" }} />
            <div style={{ fontSize: 9, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.03em", marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: k.fav ? c.green : c.red }}>{k.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.accent}30, transparent)`, borderRadius: "0 0 2px 2px", zIndex: 3 }} />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${c.borderBright}` }}>
              {["Line Item", "Actual", "Budget", "Variance", "% Rev", "Notes"].map(h => (
                <th key={h} style={{
                  padding: "14px 14px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
                  color: c.textFaint, textAlign: h === "Line Item" || h === "Notes" ? "left" : "right",
                  background: c.surfaceAlt, position: "sticky", top: 0, zIndex: 2,
                  borderBottom: `2px solid ${c.borderBright}`,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PNL_DATA.map((section, si) => {
              const isRev = si === 0;
              const isCollapsed = collapsed[section.section];
              const sectionColor = si === 0 ? c.green : si < 3 ? c.amber : c.red;
              return [
                <tr key={`sec-${si}`} onClick={() => toggle(section.section)} style={{ cursor: "pointer", background: c.bg2 }}>
                  <td colSpan={6} style={{ padding: "11px 14px", fontWeight: 800, fontSize: 12.5, color: c.text, borderBottom: `2px solid ${c.borderBright}`, borderLeft: `3px solid ${sectionColor}` }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {isCollapsed ? <ChevronRight size={14} color={c.textDim} /> : <ChevronDown size={14} color={c.textDim} />}
                      {section.section}
                      <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: `${sectionColor}10`, color: sectionColor, marginLeft: 4 }}>{section.rows.length}</span>
                    </span>
                  </td>
                </tr>,
                ...(!isCollapsed ? section.rows.map((row, ri) => (
                  <tr key={`row-${si}-${ri}`} style={{ borderBottom: `1px solid ${c.borderSub}`, background: ri % 2 === 1 ? `${c.surfaceAlt}60` : "transparent", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = c.accentMid || c.accentDim}
                    onMouseLeave={e => e.currentTarget.style.background = ri % 2 === 1 ? `${c.surfaceAlt}60` : "transparent"}
                  >
                    <td style={{ padding: "10px 14px 10px 34px", color: c.text, fontWeight: 500 }}>{row.name}</td>
                    <td style={{ textAlign: "right", padding: "10px 14px", color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(row.actual)}</td>
                    <td style={{ textAlign: "right", padding: "10px 14px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(row.budget)}</td>
                    <VarCell actual={row.actual} budget={row.budget} revenue={isRev} />
                    <td style={{ textAlign: "right", padding: "10px 14px", color: c.textDim, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{((row.actual / 51190) * 100).toFixed(1)}%</td>
                    <td style={{ padding: "10px 14px", color: c.textDim, fontSize: 10, maxWidth: 120 }}>{row.note}</td>
                  </tr>
                )) : []),
                !isCollapsed && (
                  <tr key={`tot-${si}`} style={{ borderTop: `2px solid ${c.borderBright}`, borderBottom: `2px solid ${c.borderBright}`, background: `${sectionColor}05` }}>
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
            <tr style={{ borderTop: `2px solid ${c.borderBright}`, background: `${c.accent}05` }}>
              <td style={{ padding: "12px 14px", fontWeight: 800, fontSize: 13, color: c.text, letterSpacing: "-0.01em" }}>Gross Profit</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{fmt(43370)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{fmt(41735)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>+{fmt(1635)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>84.7%</td>
              <td />
            </tr>
            <tr style={{ borderTop: `2px solid ${c.borderBright}`, background: `linear-gradient(90deg, ${c.green}06, transparent)` }}>
              <td style={{ padding: "12px 14px", fontWeight: 800, fontSize: 13, color: c.green, letterSpacing: "-0.01em" }}>EBITDA</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{fmt(3780)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{fmt(2342)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>+{fmt(1438)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>7.4%</td>
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
  { month: "Jul", actual: null, base: 9100, bull: 9500, bear: 8600 },
  { month: "Aug", actual: null, base: 9400, bull: 10100, bear: 8500 },
  { month: "Sep", actual: null, base: 9700, bull: 10800, bear: 8400 },
  { month: "Oct", actual: null, base: 9900, bull: 11400, bear: 8300 },
  { month: "Nov", actual: null, base: 10100, bull: 11900, bear: 8250 },
  { month: "Dec", actual: null, base: 10400, bull: 12500, bear: 8200 },
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

const ForecastView = ({ c, toast }) => {
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
      <ExportBar c={c} title="Forecast"
        onCSV={() => { downloadCSV("financeos-forecast.csv", ["Month","Actual ($K)","Budget ($K)","Forecast ($K)","Bull ($K)","Bear ($K)"], FORECAST_DATA.map(d => [d.month, d.actual || "", d.budget, d.forecast, d.bull, d.bear])); toast("Forecast exported as CSV", "success"); }}
        onPDF={() => { window.print(); toast("Use Save as PDF in the print dialog", "info"); }}
      />
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.green}15, ${c.purple}08)`, border: `1px solid ${c.green}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <Brain size={17} color={c.green} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Forecast Optimizer</div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>ML ensemble with live sensitivity sliders · MAPE {retrained ? "2.9%" : "3.2%"} · 14 drivers</div>
          </div>
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
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, marginBottom: 16, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.green}40, ${c.accent}20, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.green}18, ${c.accent}10)`, border: `1px solid ${c.green}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={14} color={c.green} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Revenue Forecast</div>
              <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>12-month · Base + Bull/Bear scenarios ($K)</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: retrained ? c.greenDim : c.surfaceAlt, color: retrained ? c.green : c.textDim, border: `1px solid ${retrained ? c.green : c.borderSub}15`, fontFamily: "'JetBrains Mono', monospace" }}>MAPE {retrained ? "2.9%" : "3.2%"}</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={FORECAST_DATA} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="gBull" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.green} stopOpacity={0.10} /><stop offset="50%" stopColor={c.green} stopOpacity={0.03} /><stop offset="100%" stopColor={c.green} stopOpacity={0} /></linearGradient>
              <linearGradient id="gBear" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor={c.red} stopOpacity={0.08} /><stop offset="50%" stopColor={c.red} stopOpacity={0.02} /><stop offset="100%" stopColor={c.red} stopOpacity={0} /></linearGradient>
              <linearGradient id="gActFc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.accent} stopOpacity={0.18} /><stop offset="100%" stopColor={c.accent} stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid stroke={c.chartGrid || c.borderSub} strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: c.chartAxis || c.textDim, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: c.chartAxis || c.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}M`} />
            <Tooltip content={<ChartTooltip c={c} />} cursor={{ stroke: c.accent, strokeWidth: 1, strokeDasharray: "3 3", strokeOpacity: 0.3 }} />
            <Area type="monotone" dataKey="bull" stroke="none" fill="url(#gBull)" name="Bull Range" />
            <Area type="monotone" dataKey="bear" stroke="none" fill="url(#gBear)" name="Bear Range" />
            <Area type="monotone" dataKey="actual" stroke={c.accent} fill="url(#gActFc)" strokeWidth={2.5} name="Actual" dot={{ r: 4, fill: c.surface, stroke: c.accent, strokeWidth: 2.5 }} activeDot={{ r: 6, fill: c.accent, stroke: c.surface, strokeWidth: 2 }} connectNulls={false} />
            <Line type="monotone" dataKey="base" stroke={c.green} strokeWidth={2} strokeDasharray="8 4" name="Base Forecast" dot={{ r: 3.5, fill: c.surface, stroke: c.green, strokeWidth: 2 }} connectNulls={false} />
            <Line type="monotone" dataKey="bull" stroke={c.green} strokeWidth={1} strokeDasharray="3 3" name="Bull" dot={false} connectNulls={false} opacity={0.35} />
            <Line type="monotone" dataKey="bear" stroke={c.red} strokeWidth={1} strokeDasharray="3 3" name="Bear" dot={false} connectNulls={false} opacity={0.35} />
          </ComposedChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div style={{ display: "flex", gap: 12, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${c.borderSub}`, fontSize: 10, color: c.textDim, alignItems: "center", flexWrap: "wrap" }}>
          {[
            { label: "Actual", color: c.accent }, { label: "Base", color: c.green },
            { label: "Bull (+20%)", color: c.green, opacity: 0.5 }, { label: "Bear (-21%)", color: c.red, opacity: 0.5 },
          ].map(s => (
            <span key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 600, opacity: s.opacity || 1 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: `${s.color}25`, border: `2px solid ${s.color}`, display: "inline-block" }} />
              {s.label}
            </span>
          ))}
          <span style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <span style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: c.green }}>Base: ${adjusted.toFixed(1)}M</span>
            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: c.textFaint }}>Spread: ${((FORECAST_DATA[11]?.bull || 0) / 1000).toFixed(1)}M – ${((FORECAST_DATA[11]?.bear || 0) / 1000).toFixed(1)}M</span>
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Driver importance */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.purple}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
          <div style={{ fontSize: 12, fontWeight: 800, color: c.text, marginBottom: 4 }}>Top Drivers</div>
          <div style={{ fontSize: 10, color: c.textDim, marginBottom: 14 }}>SHAP feature importance</div>
          {DRIVERS.map((d, i) => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: i < 3 ? c.accent : c.textFaint, width: 14, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</span>
              <span style={{ fontSize: 11, color: i < 5 ? c.text : c.textDim, flex: 1, fontWeight: i < 3 ? 600 : 400 }}>{d.name}</span>
              <div style={{ width: 80, height: 5, background: c.bg2, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${d.shap}%`, height: "100%", background: `linear-gradient(90deg, ${i < 3 ? c.accent : i < 5 ? c.cyan : c.textFaint}, ${i < 3 ? c.accent : i < 5 ? c.cyan : c.textFaint}80)`, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: i < 3 ? c.accent : i < 5 ? c.cyan : c.textDim, fontFamily: "'JetBrains Mono', monospace", width: 36, textAlign: "right" }}>{d.shap}%</span>
            </div>
          ))}
        </div>

        {/* Assumption sliders */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.cyan}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
          <div style={{ fontSize: 12, fontWeight: 800, color: c.text, marginBottom: 4 }}>Key Assumptions</div>
          <div style={{ fontSize: 10, color: c.textDim, marginBottom: 14 }}>Drag to adjust forecast inputs</div>
          {[
            { label: "NDR Rate", value: ndr, set: setNdr, min: 95, max: 140, unit: "%", color: c.accent },
            { label: "Pipeline Conversion", value: pipeline, set: setPipeline, min: 15, max: 65, unit: "%", color: c.cyan },
            { label: "Logo Churn", value: churn / 10, set: v => setChurn(v * 10), min: 2, max: 20, unit: "%", color: c.amber, raw: churn, setRaw: setChurn, minR: 20, maxR: 200 },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: c.textSec, fontWeight: 600 }}>{s.label}</span>
                <span style={{ color: s.color, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: "1px 6px", borderRadius: 4, background: `${s.color}08` }}>{s.label === "Logo Churn" ? (churn / 10).toFixed(1) : s.value}{s.unit}</span>
              </div>
              <input type="range" min={s.minR || s.min} max={s.maxR || s.max} value={s.raw || s.value}
                onChange={e => (s.setRaw || s.set)(Number(e.target.value))}
                style={{ width: "100%", height: 4, accentColor: s.color }} />
            </div>
          ))}
          {/* Scenario result */}
          <div style={{ padding: "14px 16px", background: `linear-gradient(135deg, ${c.purple}08, ${c.accent}04)`, border: `1px solid ${c.purple}12`, borderRadius: 10, marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, color: c.purple, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Scenario Forecast</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>${scenario.toFixed(1)}M</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: delta >= 0 ? c.green : c.red, fontFamily: "'JetBrains Mono', monospace", padding: "4px 10px", borderRadius: 6, background: delta >= 0 ? c.greenDim : c.redDim }}>
                {delta >= 0 ? "+" : ""}${Math.abs(delta).toFixed(1)}M
              </div>
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
      <ExportBar c={c} title="Consolidation"
        onCSV={() => { downloadCSV("financeos-consolidation.csv", ["Entity","Revenue ($K)","OpEx ($K)","EBITDA %","Status","Currency"], ENTITIES.map(e => [e.name, e.revenue, e.opex, e.ebitda + "%", entityStatus[e.name] || e.status, e.currency])); toast("Consolidation exported as CSV", "success"); }}
        onPDF={() => { window.print(); toast("Use Save as PDF in the print dialog", "info"); }}
      />
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.cyan}15, ${c.accent}08)`, border: `1px solid ${c.cyan}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <Layers size={17} color={c.cyan} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Multi-Entity Consolidation</div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>{ENTITIES.length} entities · Auto IC elimination · {ENTITIES.filter(e => (entityStatus[e.name] || e.status) === "Closed").length} closed · FX: Real-time</div>
          </div>
        </div>
        <button onClick={() => { ENTITIES.forEach(e => { if ((entityStatus[e.name] || e.status) !== "Closed") approve(e.name); }); }} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: c.green, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Close All Pending</button>
      </div>
      {/* Entity cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
        {ENTITIES.map(e => {
          const st = entityStatus[e.name] || e.status;
          const closing = st === "closing";
          const displayStatus = closing ? "Closing..." : st;
          const statusColor = statusColors[displayStatus] || c.textDim;
          return (
            <div key={e.name} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden", transition: "all 0.2s" }}
              onMouseEnter={e2 => { e2.currentTarget.style.borderColor = statusColor + "40"; e2.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e2 => { e2.currentTarget.style.borderColor = c.border; e2.currentTarget.style.transform = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg, transparent, ${statusColor}40, transparent)`, borderRadius: "0 0 2px 2px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{e.name}</span>
                <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 6, background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}18`, letterSpacing: "0.03em" }}>{displayStatus}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: c.text, marginBottom: 2, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(e.revenue)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: c.textDim, marginBottom: 12 }}>
                <span>Revenue · {((e.revenue / 51190) * 100).toFixed(1)}%</span>
                <div style={{ flex: 1, height: 4, background: c.bg2, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${((e.revenue / 51190) * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${statusColor}, ${statusColor}80)`, borderRadius: 2, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 10, marginBottom: 14, padding: "10px 12px", background: c.surfaceAlt, borderRadius: 10 }}>
                <div><span style={{ color: c.textFaint, fontSize: 9, fontWeight: 600 }}>EBITDA</span><br /><span style={{ color: c.green, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(e.ebitda)}</span></div>
                <div><span style={{ color: c.textFaint, fontSize: 9, fontWeight: 600 }}>Headcount</span><br /><span style={{ color: c.text, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{e.hc}</span></div>
                <div><span style={{ color: c.textFaint, fontSize: 9, fontWeight: 600 }}>Currency</span><br /><span style={{ color: c.text, fontWeight: 700 }}>{e.currency}</span></div>
                <div><span style={{ color: c.textFaint, fontSize: 9, fontWeight: 600 }}>{e.fx !== null ? "FX Impact" : "IC Elims"}</span><br /><span style={{ color: e.fx !== null ? (e.fx >= 0 ? c.green : c.red) : c.amber, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{e.fx !== null ? `${e.fx >= 0 ? "+" : ""}$${Math.abs(e.fx)}K` : `${fmt(e.ic)}`}</span></div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {(st !== "Closed" && !closing) && (
                  <button onClick={() => approve(e.name)} style={{ flex: 1, fontSize: 10, padding: "8px 0", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.green}, ${c.green}cc)`, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Approve & Close</button>
                )}
                <button onClick={() => onNav("pnl")} style={{ flex: 1, fontSize: 10, padding: "8px 0", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Drill →</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consolidated P&L */}
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.accent}25, transparent)`, borderRadius: "0 0 2px 2px", zIndex: 2 }} />
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${c.borderBright}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, background: `linear-gradient(135deg, ${c.accent}15, ${c.cyan}08)`, border: `1px solid ${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={12} color={c.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: c.textDim }}>Consolidated P&L — Eliminations Applied</span>
          </div>
          <span style={{ fontSize: 9, color: c.purple, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: c.purpleDim, border: `1px solid ${c.purple}10` }}>IC: -$1.2M auto-eliminated</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${c.borderSub}`, background: c.surfaceAlt }}>
              {["Line", "Acme US", "Acme EU", "Acme APAC", "Eliminations", "Consolidated"].map((h, i) => (
                <th key={h} style={{ padding: "10px 12px", fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", color: i === 4 ? c.red : i === 5 ? c.accent : c.textFaint, textAlign: i === 0 ? "left" : "right", textTransform: "uppercase" }}>{h}</th>
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
      <ExportBar c={c} title="Month-End Close"
        onCSV={() => { downloadCSV("financeos-close-tasks.csv", ["Task","Category","Owner","Status","Priority"], tasks.map(t => [t.task, t.cat, t.owner, t.status, t.priority || ""])); toast("Close tasks exported as CSV", "success"); }}
        onPDF={() => { window.print(); toast("Use Save as PDF in the print dialog", "info"); }}
      />
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.amber}15, ${c.green}08)`, border: `1px solid ${c.amber}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <CheckSquare size={17} color={c.amber} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Month-End Close</div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>February close · {tasks.length - doneCount} tasks remaining · Est. {Math.max(0, (tasks.length - doneCount) * 0.5).toFixed(1)}h to complete</div>
          </div>
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
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: 22, marginBottom: 20, boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>February Close — {pct}% Complete</span>
          <span style={{ fontSize: 11, color: c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{doneCount}/{tasks.length} tasks</span>
        </div>
        <div style={{ height: 10, background: c.bg2, borderRadius: 5, overflow: "hidden", position: "relative" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? `linear-gradient(90deg, ${c.green}, ${c.green}cc)` : `linear-gradient(90deg, ${c.accent}, ${c.green}cc)`, borderRadius: 5, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)", boxShadow: `0 0 16px ${pct === 100 ? c.green : c.accent}30`, position: "relative" }}>
            {pct > 15 && <div style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", fontSize: 7, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</div>}
          </div>
        </div>
      </div>

      {/* Task list — grouped by category */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {["Accounting", "Consolidation", "Compliance", "Reporting", "Review"].filter(cat => tasks.some(t => t.cat === cat)).map(cat => {
          const catTasks = tasks.filter(t => t.cat === cat);
          const catDone = catTasks.filter(t => t.status === "done").length;
          const catPct = Math.round((catDone / catTasks.length) * 100);
          return (
            <div key={cat} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
              {/* Category header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", background: c.surfaceAlt, borderBottom: `1px solid ${c.borderSub}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: c.textSec, textTransform: "uppercase", letterSpacing: "0.08em" }}>{cat}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: catPct === 100 ? c.greenDim : c.accentDim, color: catPct === 100 ? c.green : c.accent }}>{catDone}/{catTasks.length}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 60, height: 3, background: c.bg2, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${catPct}%`, height: "100%", background: catPct === 100 ? c.green : c.accent, borderRadius: 2, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: catPct === 100 ? c.green : c.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>{catPct}%</span>
                </div>
              </div>
              {/* Tasks */}
              {catTasks.map((t, i) => {
                const priorityColors = { high: c.red, med: c.amber, low: c.textFaint };
                return (
                <div key={t.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                  borderBottom: i < catTasks.length - 1 ? `1px solid ${c.borderSub}` : "none",
                  opacity: t.status === "done" ? 0.5 : 1, cursor: t.status !== "done" ? "pointer" : "default",
                  transition: "all 0.2s", borderLeft: `3px solid ${t.status === "done" ? c.green : priorityColors[t.priority] || c.accent}`,
                }}
                onClick={() => t.status !== "done" && complete(t.id)}
                onMouseEnter={e => { if (t.status !== "done") { e.currentTarget.style.background = c.accentDim; e.currentTarget.style.transform = "translateX(2px)"; }}}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 7, border: `2px solid ${t.status === "done" ? c.green : c.border}`,
                    background: t.status === "done" ? `linear-gradient(135deg, ${c.green}, ${c.green}cc)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: t.status === "done" ? `0 0 8px ${c.green}30` : "none",
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
                    </div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: `${statusColor[t.status]}15`, color: statusColor[t.status], border: `1px solid ${statusColor[t.status]}20` }}>{statusLabel[t.status]}</span>
                </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Close timeline */}
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "18px 22px", marginTop: 16, boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: c.textSec, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Close Timeline</div>
        <div style={{ display: "flex", gap: 0, position: "relative" }}>
          {["Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8"].map((day, i) => {
            const dayTasks = tasks.filter(t => t.due === day);
            const allDone = dayTasks.every(t => t.status === "done");
            const hasPending = dayTasks.some(t => t.status !== "done");
            return (
              <div key={day} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                {i < 5 && <div style={{ position: "absolute", top: 10, left: "50%", width: "100%", height: 2, background: allDone && !hasPending ? c.green : c.borderSub, zIndex: 0 }} />}
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: allDone && dayTasks.length > 0 ? c.green : hasPending ? c.accent : c.bg2, display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, border: `2px solid ${allDone && dayTasks.length > 0 ? c.green : c.borderSub}` }}>
                  {allDone && dayTasks.length > 0 && <Check size={10} color="#fff" strokeWidth={3} />}
                  {!allDone && dayTasks.length > 0 && <span style={{ fontSize: 8, fontWeight: 800, color: "#fff" }}>{dayTasks.length}</span>}
                </div>
                <div style={{ fontSize: 9, color: c.textFaint, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{day}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// INTEGRATIONS VIEW
// ══════════════════════════════════════════════════════════════
const CONNECTORS = [
  { name: "NetSuite", cat: "ERP", status: "connected", records: "847K", color: "#0C9ADA", lastSync: "2 min ago", health: 100 },
  { name: "Salesforce", cat: "CRM", status: "connected", records: "124K", color: "#00A1E0", lastSync: "45s ago", health: 100 },
  { name: "Stripe", cat: "Billing", status: "connected", records: "38K", color: "#635BFF", lastSync: "1 min ago", health: 100 },
  { name: "Rippling", cat: "HRIS", status: "connected", records: "312", color: "#FE6847", lastSync: "4 min ago", health: 98 },
  { name: "Snowflake", cat: "Data Warehouse", status: "connected", records: "2.1M", color: "#29B5E8", lastSync: "3 min ago", health: 100 },
  { name: "HubSpot", cat: "CRM", status: "connected", records: "89K", color: "#FF7A59", lastSync: "2 min ago", health: 100 },
  { name: "Ramp", cat: "Expenses", status: "connected", records: "5.2K", color: "#007A5E", lastSync: "5 min ago", health: 97 },
  { name: "Plaid", cat: "Banking", status: "available", records: null, color: "#0A85EA", badge: "NEW" },
  { name: "QuickBooks", cat: "ERP", status: "available", records: null, color: "#2CA01C" },
  { name: "Xero", cat: "ERP", status: "available", records: null, color: "#13B5EA" },
  { name: "Workday", cat: "HRIS", status: "available", records: null, color: "#0875E1" },
  { name: "Google Sheets", cat: "Files", status: "available", records: null, color: "#34A853" },
  { name: "Slack", cat: "Notifications", status: "available", records: null, color: "#4A154B" },
  { name: "CSV / Excel", cat: "Files", status: "available", records: null, color: "#217346", badge: "UPLOAD" },
  { name: "REST API", cat: "Developer", status: "available", records: null, color: "#8b92a5", badge: "BETA" },
];

const IntegrationsView = ({ c, toast }) => {
  const [conns, setConns] = useState(CONNECTORS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [connectingName, setConnectingName] = useState(null);
  const [disconnectConfirm, setDisconnectConfirm] = useState(null);
  const [syncingName, setSyncingName] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState(0); // 0=select, 1=mapping, 2=importing, 3=done
  const [uploadFile, setUploadFile] = useState(null);
  const [plaidOpen, setPlaidOpen] = useState(false);
  const cats = ["all", ...new Set(CONNECTORS.map(co => co.cat))];
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const startConnect = (name) => {
    const conn = conns.find(co => co.name === name);
    if (conn?.status === "connected") { setDisconnectConfirm(name); return; }
    if (name === "CSV / Excel") { setUploadOpen(true); setUploadStep(0); setUploadFile(null); return; }
    if (name === "Plaid") { setPlaidOpen(true); return; }
    setConnectingName(name);
  };

  const confirmConnect = async (name) => {
    setConnectingName(null);
    setSyncingName(name);
    setConns(prev => prev.map(co => co.name === name ? { ...co, status: "syncing", records: "Syncing..." } : co));
    toast(`Connecting ${name}...`, "info");
    // Write to Supabase integrations table
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("users").select("org_id").eq("id", user.id).maybeSingle();
        if (profile?.org_id) {
          await supabase.from("integrations").upsert({
            org_id: profile.org_id,
            provider: name.toLowerCase().replace(/\s+/g, "_"),
            status: "connected",
            last_sync_at: new Date().toISOString(),
            records_synced: Math.floor(Math.random() * 20000) + 3000,
            config: { connected_by: user.email, connected_at: new Date().toISOString() },
          }, { onConflict: "org_id,provider" }).catch(() => {});
        }
      }
    } catch {}
    setTimeout(() => {
      if (!mountedRef.current) return;
      const fakeRecords = ["12K", "24K", "8.4K", "156K", "3.2K"][Math.floor(Math.random() * 5)];
      setConns(prev => prev.map(co => co.name === name ? { ...co, status: "connected", records: fakeRecords, lastSync: "Just now" } : co));
      setSyncingName(null);
      toast(`${name} connected — ${fakeRecords} records synced`, "success");
    }, 2500);
  };

  const confirmDisconnect = async () => {
    const name = disconnectConfirm;
    setDisconnectConfirm(null);
    setConns(prev => prev.map(co => co.name === name ? { ...co, status: "available", records: null, lastSync: null } : co));
    // Remove from Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("users").select("org_id").eq("id", user.id).maybeSingle();
        if (profile?.org_id) {
          await supabase.from("integrations").delete()
            .eq("org_id", profile.org_id)
            .eq("provider", name.toLowerCase().replace(/\s+/g, "_")).catch(() => {});
        }
      }
    } catch {}
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
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.accent}15, ${c.cyan}08)`, border: `1px solid ${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <Plug size={17} color={c.accent} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Integrations</div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>Connect your stack · Bi-directional sync · Real-time freshness</div>
          </div>
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
          <div key={s.label} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 12, padding: "14px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ color: s.color, fontSize: 8 }}>{s.icon}</span>
              <span style={{ fontSize: 9, color: c.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap", background: c.surfaceAlt, borderRadius: 10, padding: 3, border: `1px solid ${c.borderSub}`, width: "fit-content" }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            fontSize: 11, padding: "6px 14px", borderRadius: 8, border: "none",
            background: filter === cat ? c.accent : "transparent", color: filter === cat ? "#fff" : c.textSec,
            cursor: "pointer", fontFamily: "inherit", fontWeight: 600, textTransform: "capitalize", transition: "all 0.15s",
          }}>{cat}</button>
        ))}
      </div>

      {/* Connector grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(co => (
          <div key={co.name} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 20px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)", position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${co.color}50`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${co.color}10, ${c.cardGlow}`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = c.cardGlow; }}
          >
            {co.status === "connected" && <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg, transparent, ${co.color}40, transparent)`, borderRadius: "0 0 2px 2px" }} />}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${co.color}18, ${co.color}08)`, border: `1px solid ${co.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: co.color }}>{co.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{co.name}</div>
                <div style={{ fontSize: 10, color: c.textDim, fontWeight: 500 }}>{co.cat}</div>
              </div>
              {co.status === "connected" && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, color: c.green, background: c.greenDim, padding: "3px 8px", borderRadius: 5, border: `1px solid ${c.green}12` }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} />
                  Live
                </div>
              )}
              {co.badge && co.status !== "connected" && (
                <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 4, background: co.badge === "NEW" ? c.greenDim : co.badge === "UPLOAD" ? c.accentDim : c.purpleDim, color: co.badge === "NEW" ? c.green : co.badge === "UPLOAD" ? c.accent : c.purple, letterSpacing: "0.04em" }}>{co.badge}</span>
              )}
            </div>
            {co.status === "connected" && (
              <div style={{ fontSize: 10, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, padding: "6px 10px", borderRadius: 6, background: c.surfaceAlt }}>
                  <span style={{ color: c.green, fontWeight: 600 }}>{co.records} records</span>
                  <span style={{ color: co.name === syncingName ? c.amber : c.textFaint, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}>{co.name === syncingName ? "Syncing..." : (co.lastSync || "3 min ago")}</span>
                </div>
                {co.health != null && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 2px" }}>
                    <span style={{ fontSize: 9, color: c.textFaint, fontWeight: 600 }}>Health</span>
                    <div style={{ flex: 1, height: 3, background: c.bg2, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${co.health}%`, height: "100%", background: co.health === 100 ? c.green : c.amber, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: co.health === 100 ? c.green : c.amber, fontFamily: "'JetBrains Mono', monospace" }}>{co.health}%</span>
                  </div>
                )}
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
          <div onClick={e => e.stopPropagation()} style={{ width: 420, background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s cubic-bezier(0.22,1,0.36,1)" }}>
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
          <div onClick={e => e.stopPropagation()} style={{ width: 380, background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s cubic-bezier(0.22,1,0.36,1)", textAlign: "center" }}>
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

      {/* CSV / Excel Upload Modal */}
      {uploadOpen && (
        <div onClick={() => setUploadOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 480, background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s cubic-bezier(0.22,1,0.36,1)" }}>
            {/* Progress steps */}
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
              {["Select File", "Map Columns", "Import"].map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: uploadStep >= i ? c.accent : c.bg2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: uploadStep >= i ? "#fff" : c.textFaint, transition: "all 0.3s" }}>{i + 1}</div>
                  <span style={{ fontSize: 10, color: uploadStep >= i ? c.text : c.textFaint, fontWeight: 600 }}>{label}</span>
                  {i < 2 && <div style={{ width: 24, height: 1, background: uploadStep > i ? c.accent : c.borderSub }} />}
                </div>
              ))}
            </div>

            {uploadStep === 0 && (<>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.text, marginBottom: 4 }}>Import Data</div>
              <div style={{ fontSize: 12, color: c.textDim, marginBottom: 20 }}>Upload a CSV or Excel file to import financial data.</div>
              {/* Drop zone */}
              <div onClick={() => setUploadFile({ name: "acme-actuals-q2.xlsx", size: "2.4 MB", rows: 1247 })} style={{
                border: `2px dashed ${c.border}`, borderRadius: 12, padding: "40px 24px", textAlign: "center", cursor: "pointer",
                background: c.surfaceAlt, transition: "all 0.2s", marginBottom: 16,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.background = c.accentDim; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.surfaceAlt; }}
              >
                {uploadFile ? (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 4 }}>{uploadFile.name}</div>
                    <div style={{ fontSize: 11, color: c.textDim }}>{uploadFile.size} · {uploadFile.rows} rows detected</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.4 }}>📄</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.textSec, marginBottom: 4 }}>Drop your file here or click to browse</div>
                    <div style={{ fontSize: 10, color: c.textFaint }}>Supports .csv, .xlsx, .xls · Max 50MB</div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setUploadOpen(false)} style={{ flex: 1, fontSize: 12, padding: "11px 0", borderRadius: 10, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Cancel</button>
                <button onClick={() => { if (uploadFile) setUploadStep(1); else { setUploadFile({ name: "acme-actuals-q2.xlsx", size: "2.4 MB", rows: 1247 }); setUploadStep(1); }}} style={{ flex: 1, fontSize: 12, padding: "11px 0", borderRadius: 10, border: "none", background: c.accent, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Continue</button>
              </div>
            </>)}

            {uploadStep === 1 && (<>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.text, marginBottom: 4 }}>Map Columns</div>
              <div style={{ fontSize: 12, color: c.textDim, marginBottom: 16 }}>We detected {uploadFile?.rows || 1247} rows. Verify the column mapping below.</div>
              <div style={{ background: c.surfaceAlt, borderRadius: 10, padding: 14, marginBottom: 16 }}>
                {[
                  { source: "Date", target: "Period", match: true },
                  { source: "Account", target: "GL Account", match: true },
                  { source: "Amount", target: "Actual ($)", match: true },
                  { source: "Department", target: "Cost Center", match: true },
                  { source: "Notes", target: "Description", match: false },
                ].map(m => (
                  <div key={m.source} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 11 }}>
                    <span style={{ flex: 1, color: c.textSec, fontFamily: "'JetBrains Mono', monospace" }}>{m.source}</span>
                    <span style={{ color: m.match ? c.green : c.amber }}>→</span>
                    <span style={{ flex: 1, color: c.text, fontWeight: 600 }}>{m.target}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: m.match ? c.greenDim : c.amberDim, color: m.match ? c.green : c.amber }}>{m.match ? "AUTO" : "REVIEW"}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setUploadStep(0)} style={{ flex: 1, fontSize: 12, padding: "11px 0", borderRadius: 10, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Back</button>
                <button onClick={() => { setUploadStep(2); setTimeout(() => { if (mountedRef.current) { setUploadStep(3); setConns(prev => prev.map(co => co.name === "CSV / Excel" ? { ...co, status: "connected", records: "1,247", lastSync: "Just now", health: 100 } : co)); }}, 2000); }} style={{ flex: 1, fontSize: 12, padding: "11px 0", borderRadius: 10, border: "none", background: c.accent, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Import {uploadFile?.rows || 1247} Rows</button>
              </div>
            </>)}

            {uploadStep === 2 && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 40, height: 40, border: `3px solid ${c.accent}30`, borderTopColor: c.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: c.text, marginBottom: 4 }}>Importing data...</div>
                <div style={{ fontSize: 11, color: c.textDim }}>Validating schema and writing {uploadFile?.rows || 1247} rows</div>
              </div>
            )}

            {uploadStep === 3 && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${c.green}, ${c.accent})`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Check size={24} color="#fff" strokeWidth={3} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: c.text, marginBottom: 4 }}>Import Complete</div>
                <div style={{ fontSize: 12, color: c.textDim, marginBottom: 20 }}>{uploadFile?.rows || 1247} rows imported from {uploadFile?.name || "file"}</div>
                <button onClick={() => { setUploadOpen(false); toast("Data imported successfully", "success"); }} style={{ fontSize: 13, padding: "11px 24px", borderRadius: 10, border: "none", background: c.accent, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plaid Bank Connect Modal */}
      {plaidOpen && (
        <div onClick={() => setPlaidOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 420, background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s cubic-bezier(0.22,1,0.36,1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #0A85EA20, #0A85EA08)", border: "1px solid #0A85EA15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#0A85EA" }}>P</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: c.text }}>Connect via Plaid</div>
                <div style={{ fontSize: 11, color: c.textDim, marginTop: 1 }}>Securely link your bank accounts</div>
              </div>
            </div>
            <div style={{ background: c.surfaceAlt, borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: c.textSec, marginBottom: 10 }}>Plaid will securely connect to:</div>
              {["Checking & savings accounts", "Transaction history (24 months)", "Balance & cash position data", "ACH routing information"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 12, color: c.text }}>
                  <Check size={13} color={c.green} strokeWidth={2.5} /> {item}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 10, color: c.textFaint }}>
              <Shield size={12} /> Encrypted end-to-end · Read-only access · Revocable anytime
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPlaidOpen(false)} style={{ flex: 1, fontSize: 12, padding: "11px 0", borderRadius: 10, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Cancel</button>
              <button onClick={() => { setPlaidOpen(false); toast("Plaid Link would open here — sandbox mode", "info"); confirmConnect("Plaid"); }} style={{ flex: 1, fontSize: 12, padding: "11px 0", borderRadius: 10, border: "none", background: "#0A85EA", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Open Plaid Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
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
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.green}15, ${c.accent}08)`, border: `1px solid ${c.green}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <TrendingUp size={17} color={c.green} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Investor Metrics</div>
          <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>Series A readiness scorecard · 8 SaaS benchmarks · Board-ready exports</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { downloadCSV("financeos-investor-metrics.csv", ["Metric","Value","Benchmark","Notes"], [["ARR","$48.6M","+24% YoY",""],["NDR","118%",">110%","Best-in-class"],["Rule of 40","52.1","Growth 47.8% + Margin 4.3%",""],["Burn Multiple","0.8x","<1.0x","Efficient"],["Gross Margin","84.7%","70-80%","SaaS benchmark"],["CAC Payback","14 mo","<18 months",""],["LTV/CAC","4.2x",">3.0x","Healthy"],["Cash Runway","34 mo","$12.8M cash",""]]); toast("Investor metrics exported as CSV", "success"); }} style={{ fontSize: 11, padding: "8px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Export CSV</button>
        <button onClick={() => { window.print(); toast("Use Save as PDF in the print dialog", "info"); }} style={{ fontSize: 11, padding: "8px 14px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Export PDF</button>
      </div>
    </div>

    {/* Benchmark Scorecard */}
    <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "18px 24px", marginBottom: 20, boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, display: "flex", alignItems: "center", gap: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.green}35, transparent)`, borderRadius: "0 0 2px 2px" }} />
      <div style={{ fontSize: 12, fontWeight: 800, color: c.text, whiteSpace: "nowrap" }}>Series A Readiness</div>
      <div style={{ flex: 1, display: "flex", gap: 3 }}>
        {[
          { label: "ARR", pass: true }, { label: "NDR", pass: true }, { label: "R40", pass: true },
          { label: "Burn", pass: true }, { label: "GM", pass: true }, { label: "CAC", pass: true },
          { label: "LTV", pass: true }, { label: "Cash", pass: true },
        ].map(b => (
          <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: "100%", height: 6, borderRadius: 3, background: b.pass ? `linear-gradient(90deg, ${c.green}, ${c.green}bb)` : c.red, transition: "all 0.3s" }} />
            <span style={{ fontSize: 7, fontWeight: 700, color: c.textFaint, letterSpacing: "0.04em" }}>{b.label}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace", padding: "4px 10px", background: c.greenDim, borderRadius: 6, border: `1px solid ${c.green}12` }}>8/8 ✓</div>
    </div>

    {/* Fundraising KPIs */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
      {[
        { label: "ARR", value: "$48.6M", sub: "+24% YoY", color: c.accent, icon: DollarSign },
        { label: "Net Dollar Retention", value: "118%", sub: "Best-in-class >110%", color: c.green, icon: TrendingUp },
        { label: "Rule of 40", value: "52.1", sub: "Growth 47.8% + Margin 4.3%", color: c.purple, icon: Zap },
        { label: "Burn Multiple", value: "0.8x", sub: "Efficient: <1.0x target", color: c.green, icon: Activity },
        { label: "Gross Margin", value: "84.7%", sub: "SaaS benchmark: 70-80%", color: c.accent, icon: Target },
        { label: "CAC Payback", value: "14 mo", sub: "Target: <18 months", color: c.green, icon: Activity },
        { label: "LTV/CAC", value: "4.2x", sub: "Healthy: >3.0x", color: c.green, icon: TrendingUp },
        { label: "Cash Runway", value: "34 mo", sub: "$12.8M cash on hand", color: c.accent, icon: Shield },
      ].map(k => {
        const Icon = k.icon;
        return (
        <div key={k.label} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 22px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${k.color}35`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${k.color}10, ${c.cardGlow}`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = c.cardGlow; }}
        >
          <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg, transparent, ${k.color}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint }}>{k.label}</div>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg, ${k.color}15, ${k.color}06)`, border: `1px solid ${k.color}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={12} color={k.color} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em", marginBottom: 4 }}>{k.value}</div>
          <div style={{ fontSize: 10, color: k.color, fontWeight: 600 }}>{k.sub}</div>
        </div>
        );
      })}
    </div>

    {/* Cohort & Unit Economics */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.green}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ fontSize: 12, fontWeight: 800, color: c.text, marginBottom: 4 }}>Revenue Cohort Analysis</div>
        <div style={{ fontSize: 10, color: c.textDim, marginBottom: 12 }}>Net dollar retention by signup quarter</div>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", marginBottom: 4, fontSize: 8, fontWeight: 800, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span style={{ width: 60 }}>Cohort</span>
          <span style={{ width: 55 }}>Initial</span>
          <span style={{ flex: 1 }}>Retention</span>
          <span style={{ width: 45, textAlign: "right" }}>NDR</span>
        </div>
        {[
          { cohort: "Q1 2023", initial: "$2.1M", current: "$3.8M", retention: "181%", color: c.green },
          { cohort: "Q2 2023", initial: "$2.8M", current: "$4.6M", retention: "164%", color: c.green },
          { cohort: "Q3 2023", initial: "$3.2M", current: "$4.9M", retention: "153%", color: c.green },
          { cohort: "Q4 2023", initial: "$3.9M", current: "$5.4M", retention: "138%", color: c.green },
          { cohort: "Q1 2024", initial: "$4.5M", current: "$5.8M", retention: "129%", color: c.accent },
          { cohort: "Q2 2024", initial: "$5.2M", current: "$6.1M", retention: "117%", color: c.accent },
        ].map(r => (
          <div key={r.cohort} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${c.borderSub}` }}>
            <span style={{ fontSize: 11, color: c.textDim, width: 60, fontWeight: 500 }}>{r.cohort}</span>
            <span style={{ fontSize: 11, color: c.textSec, fontFamily: "'JetBrains Mono', monospace", width: 55 }}>{r.initial}</span>
            <div style={{ flex: 1, height: 6, background: c.bg2, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(parseInt(r.retention), 200) / 2}%`, height: "100%", background: `linear-gradient(90deg, ${r.color}, ${r.color}aa)`, borderRadius: 3, transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: r.color, fontFamily: "'JetBrains Mono', monospace", width: 45, textAlign: "right" }}>{r.retention}</span>
          </div>
        ))}
      </div>

      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.accent}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ fontSize: 12, fontWeight: 800, color: c.text, marginBottom: 4 }}>Competitive Positioning</div>
        <div style={{ fontSize: 10, color: c.textDim, marginBottom: 12 }}>vs SaaS median benchmarks</div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "6px 0", marginBottom: 4, fontSize: 8, fontWeight: 800, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span style={{ flex: 1 }}>Metric</span>
          <span style={{ width: 55, textAlign: "right" }}>Ours</span>
          <span style={{ width: 75, textAlign: "right" }}>Benchmark</span>
          <span style={{ width: 58, textAlign: "right" }}>Status</span>
        </div>
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
    <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
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
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
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
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.amber}15, ${c.red}08)`, border: `1px solid ${c.amber}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <Shield size={17} color={c.amber} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Admin Console</div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>{users.length} users · {users.filter(u => u.status === "active").length} active · {events.length} events today</div>
          </div>
        </div>
        <button onClick={() => setInviteOpen(true)} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Invite User</button>
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
            <div key={k.label} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 22px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${k.color}30`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${k.color}08, ${c.cardGlow}`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = c.cardGlow; }}
            >
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg, transparent, ${k.color}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint }}>{k.label}</div>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg, ${k.color}15, ${k.color}06)`, border: `1px solid ${k.color}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Activity size={12} color={k.color} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}>{k.value}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: k.up ? c.green : c.red, background: k.up ? c.greenDim : c.redDim, padding: "3px 8px", borderRadius: 6, border: `1px solid ${k.up ? c.green : c.red}12` }}>{k.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.accent}25, transparent)`, borderRadius: "0 0 2px 2px" }} />
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Activity Log</span>
              <span style={{ fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: 5, background: c.surfaceAlt, color: c.textFaint, letterSpacing: "0.04em" }}>{events.length} EVENTS</span>
            </div>
            {events.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < events.length - 1 ? `1px solid ${c.borderSub}` : "none", alignItems: "flex-start", transition: "all 0.15s" }}
                onMouseEnter={ev => ev.currentTarget.style.paddingLeft = "4px"}
                onMouseLeave={ev => ev.currentTarget.style.paddingLeft = "0"}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: eventColors[e.type] || c.textDim, marginTop: 5, flexShrink: 0, boxShadow: `0 0 6px ${(eventColors[e.type] || c.textDim)}25` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{e.action}</div>
                  <div style={{ fontSize: 10, color: c.textDim, marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontWeight: 600 }}>{e.actor}</span>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.textFaint }} />
                    <span>{e.time}</span>
                    <span style={{ fontSize: 7, fontWeight: 800, padding: "1px 5px", borderRadius: 3, background: `${(eventColors[e.type] || c.textDim)}10`, color: eventColors[e.type] || c.textDim, textTransform: "uppercase", letterSpacing: "0.04em" }}>{e.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Quick Admin Actions */}
          <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.amber}25, transparent)`, borderRadius: "0 0 2px 2px" }} />
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 14 }}>Admin Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Invite User", desc: "Send invite to new team member", action: () => toast("Invite sent — check user's email", "success"), color: c.accent },
                { label: "Export Audit Log", desc: "Download full activity history as CSV", action: () => toast("Audit log exported — 312 events", "success"), color: c.green },
                { label: "Rotate API Keys", desc: "Regenerate all active API keys", action: () => toast("API keys rotated — update integrations", "warning"), color: c.amber },
                { label: "Force Sync All", desc: "Trigger sync on all connected integrations", action: () => { toast("Syncing 4 integrations...", "success"); }, color: c.cyan },
                { label: "Generate SOC 2 Report", desc: "Export compliance evidence package", action: () => toast("SOC 2 evidence package generated", "success"), color: c.purple },
                { label: "Purge Demo Data", desc: "Remove all sample data from organization", action: () => toast("Demo data purge requires confirmation — check Settings", "warning"), color: c.red },
              ].map(a => (
                <button key={a.label} onClick={a.action} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10,
                  border: `1px solid ${c.border}`, background: "transparent", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)", color: c.text, borderLeft: `3px solid ${a.color}20`,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${a.color}40`; e.currentTarget.style.borderLeftColor = a.color; e.currentTarget.style.background = `${a.color}06`; e.currentTarget.style.transform = "translateX(2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.borderLeftColor = `${a.color}20`; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
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
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
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
              <div key={k.label} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 12, padding: "16px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: c.textFaint, marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{k.value}</div>
                <div style={{ fontSize: 10, color: c.textDim }}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
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
            <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
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
            <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
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

      {/* Invite User Modal */}
      {inviteOpen && (
        <div onClick={() => setInviteOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 400, background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s cubic-bezier(0.22,1,0.36,1)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: c.text, marginBottom: 4 }}>Invite Team Member</div>
            <div style={{ fontSize: 12, color: c.textDim, marginBottom: 20 }}>They'll receive an email invite to join your workspace.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@company.com" style={{ width: "100%", fontSize: 13, padding: "11px 14px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontFamily: "inherit", outline: "none" }}
                onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.border}
                onKeyDown={e => { if (e.key === "Enter" && inviteEmail.trim()) { toast(`Invite sent to ${inviteEmail}`, "success"); setInviteEmail(""); setInviteOpen(false); }}}
              />
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ width: "100%", fontSize: 13, padding: "11px 14px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontFamily: "inherit", cursor: "pointer" }}>
                {["Viewer", "Budget Owner", "Manager", "Admin"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button onClick={() => setInviteOpen(false)} style={{ flex: 1, fontSize: 13, padding: "11px 0", borderRadius: 10, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                <button onClick={() => { if (inviteEmail.trim()) { toast(`Invite sent to ${inviteEmail} as ${inviteRole}`, "success"); setInviteEmail(""); setInviteOpen(false); } else { toast("Enter an email address", "warning"); }}} style={{ flex: 1, fontSize: 13, padding: "11px 0", borderRadius: 10, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Send Invite</button>
              </div>
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
      <ExportBar c={c} title="Scenarios"
        onCSV={() => { downloadCSV("financeos-scenarios.csv", ["Scenario","Revenue ($M)","OpEx ($M)","EBITDA %","Probability"], scenarios.map(s => [s.name, s.revenue, s.opex, s.ebitda + "%", s.probability])); toast("Scenarios exported as CSV", "success"); }}
        onPDF={() => { window.print(); toast("Use Save as PDF in the print dialog", "info"); }}
      />
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.purple}15, ${c.accent}08)`, border: `1px solid ${c.purple}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <GitBranch size={17} color={c.purple} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Scenario Modeling</div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>{scenarios.length} scenarios · Drag sliders to model assumptions in real-time</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowCompare(!showCompare)} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: `1px solid ${showCompare ? c.accent : c.border}`, background: showCompare ? c.accentDim : "transparent", color: showCompare ? c.accent : c.textSec, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Compare</button>
          <button onClick={() => toast("New scenario created", "success")} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ New Scenario</button>
        </div>
      </div>

      {/* Horizontal bar comparison */}
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", marginBottom: 16, boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.accent}40, transparent)`, borderRadius: "0 0 2px 2px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: c.text }}>Revenue Comparison</div>
          <div style={{ fontSize: 9, color: c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>EBITDA →</div>
        </div>
        {scenarios.map((s, i) => (
          <div key={s.name} onClick={() => setSelected(i)} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, cursor: "pointer", opacity: selected === i ? 1 : 0.55, transition: "all 0.2s", transform: selected === i ? "translateX(2px)" : "none" }}>
            <div style={{ width: 120, fontSize: 11, fontWeight: selected === i ? 700 : 500, color: selected === i ? c.text : c.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
            <div style={{ flex: 1, height: 28, background: c.surfaceAlt, borderRadius: 8, overflow: "hidden", position: "relative" }}>
              <div style={{ height: "100%", width: `${(s.revenue / barMax) * 100}%`, background: s.status === "Active" ? `linear-gradient(90deg, ${c.accent}, ${c.accent}90)` : `linear-gradient(90deg, ${c.borderBright}, ${c.borderBright}80)`, borderRadius: 8, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10, boxShadow: selected === i && s.status === "Active" ? `0 0 12px ${c.accent}20` : "none" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: s.status === "Active" ? "#fff" : c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>${s.revenue}M</span>
              </div>
            </div>
            <div style={{ width: 52, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", background: (typeof s.ebitda === 'number' ? s.ebitda : parseFloat(s.ebitda)) > 5 ? c.greenDim : (typeof s.ebitda === 'number' ? s.ebitda : parseFloat(s.ebitda)) > 0 ? c.amberDim : c.redDim, color: (typeof s.ebitda === 'number' ? s.ebitda : parseFloat(s.ebitda)) > 5 ? c.green : (typeof s.ebitda === 'number' ? s.ebitda : parseFloat(s.ebitda)) > 0 ? c.amber : c.red }}>{typeof s.ebitda === 'number' ? s.ebitda : s.ebitda}%</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showCompare ? "1fr auto 1fr" : "1fr 280px", gap: showCompare ? 8 : 16 }}>
        {/* Scenario cards or comparison */}
        {showCompare ? (() => {
          const s1 = scenarios[compare[0]];
          const s2 = scenarios[compare[1]];
          const renderCard = (s) => (
            <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: c.text, marginBottom: 16 }}>{s.name}</div>
              {[{ l: "Revenue", v: `$${s.revenue}M`, color: c.text }, { l: "OpEx", v: `$${s.opex}M`, color: c.amber }, { l: "EBITDA Margin", v: `${typeof s.ebitda === 'number' ? s.ebitda : s.ebitda}%`, color: (typeof s.ebitda === 'number' ? s.ebitda : parseFloat(s.ebitda)) > 5 ? c.green : c.red }, { l: "Status", v: s.status, color: s.status === "Active" ? c.green : c.textDim }].map(r => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 12 }}>
                  <span style={{ color: c.textDim }}>{r.l}</span>
                  <span style={{ fontWeight: 700, color: r.color, fontFamily: "'JetBrains Mono', monospace" }}>{r.v}</span>
                </div>
              ))}
            </div>
          );
          const deltas = [
            { l: "Revenue", d: s2.revenue - s1.revenue, fmt: (d) => `${d >= 0 ? "+" : ""}$${d.toFixed(1)}M` },
            { l: "OpEx", d: s2.opex - s1.opex, fmt: (d) => `${d >= 0 ? "+" : ""}$${d.toFixed(1)}M`, inv: true },
            { l: "EBITDA", d: (typeof s2.ebitda === 'number' ? s2.ebitda : parseFloat(s2.ebitda)) - (typeof s1.ebitda === 'number' ? s1.ebitda : parseFloat(s1.ebitda)), fmt: (d) => `${d >= 0 ? "+" : ""}${d.toFixed(1)}pp` },
          ];
          return (<>
            {renderCard(s1)}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 4, padding: "40px 8px 0" }}>
              <div style={{ fontSize: 8, fontWeight: 800, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Delta</div>
              {deltas.map(d => {
                const fav = d.inv ? d.d <= 0 : d.d >= 0;
                return (
                  <div key={d.l} style={{ fontSize: 10, fontWeight: 800, color: fav ? c.green : c.red, fontFamily: "'JetBrains Mono', monospace", padding: "6px 10px", borderRadius: 6, background: fav ? c.greenDim : c.redDim, border: `1px solid ${fav ? c.green : c.red}12`, textAlign: "center", minWidth: 70, marginBottom: 6 }}>
                    {d.fmt(d.d)}
                  </div>
                );
              })}
            </div>
            {renderCard(s2)}
          </>);
        })() : (
          <>
            {/* Scenario cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {scenarios.map((s, i) => (
                <div key={s.name} onClick={() => setSelected(i)} style={{
                  background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${selected === i ? c.accent : c.border}`, borderRadius: 16, padding: 18, boxShadow: `${c.cardGlow}, ${c.glassHighlight}`,
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
            <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.amber}25, transparent)`, borderRadius: "0 0 2px 2px" }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 16 }}>Assumption Drivers</div>
              {[
                { key: "ndr", label: "Net Dollar Retention", value: drivers.ndr, min: 80, max: 150, unit: "%", color: c.accent },
                { key: "pipeline", label: "Pipeline ($M)", value: drivers.pipeline, min: 10, max: 80, unit: "M", color: c.green },
                { key: "churn", label: "Gross Churn Rate", value: drivers.churn, min: 0.5, max: 8, unit: "%", color: c.red, step: 0.1 },
                { key: "headcount", label: "Headcount", value: drivers.headcount, min: 80, max: 200, unit: "", color: c.amber },
              ].map(d => {
                const pct = ((d.value - d.min) / (d.max - d.min)) * 100;
                return (
                <div key={d.key} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 8 }}>
                    <span style={{ color: c.textDim, fontWeight: 600 }}>{d.label}</span>
                    <span style={{ color: d.color, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: "2px 8px", borderRadius: 5, background: `${d.color}10`, border: `1px solid ${d.color}10` }}>{d.value}{d.unit}</span>
                  </div>
                  <div style={{ position: "relative", height: 6, background: c.bg2, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${d.color}, ${d.color}bb)`, borderRadius: 3, transition: "width 0.1s" }} />
                  </div>
                  <input type="range" min={d.min} max={d.max} step={d.step || 1} value={d.value}
                    onChange={e => setDrivers(prev => ({ ...prev, [d.key]: parseFloat(e.target.value) }))}
                    style={{ width: "100%", height: 20, appearance: "none", background: "transparent", marginTop: -13, position: "relative", zIndex: 1, cursor: "pointer", outline: "none" }}
                  />
                </div>
                );
              })}
              <div style={{ fontSize: 9, color: c.textFaint, marginTop: 4, lineHeight: 1.5, padding: "8px 10px", background: c.surfaceAlt, borderRadius: 8 }}>Drivers apply to Base Case · Drag sliders to model impact on revenue and margin</div>
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
      <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.textDim}15, ${c.accent}06)`, border: `1px solid ${c.textDim}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <Settings size={17} color={c.textDim} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Settings</div>
          <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>Manage your account, billing, notifications, and preferences</div>
        </div>
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
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}` }}>
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
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.accent}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
          <div style={{ fontSize: 14, fontWeight: 800, color: c.text, marginBottom: 16 }}>Billing & Subscription</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, padding: "16px 16px", borderRadius: 12, background: `linear-gradient(135deg, ${c.accent}08, ${c.purple}04)`, border: `1px solid ${c.accent}15` }}>
              <div style={{ fontSize: 9, color: c.accent, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Current Plan</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.text }}>Growth</div>
              <div style={{ fontSize: 11, color: c.textDim, marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>$1,799/mo · Annual</div>
            </div>
            <div style={{ flex: 1, padding: "16px 16px", borderRadius: 12, background: `linear-gradient(135deg, ${c.green}08, ${c.cyan}04)`, border: `1px solid ${c.green}15` }}>
              <div style={{ fontSize: 9, color: c.green, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Next Invoice</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>$17,988</div>
              <div style={{ fontSize: 11, color: c.textDim, marginTop: 3 }}>January 15, 2026</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: c.textDim, marginBottom: 14, padding: "8px 12px", background: c.surfaceAlt, borderRadius: 8 }}>💳 Visa ····4242 · Billing: finance@acme.io</div>
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

      {activeTab === "security" && (<>
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${c.green}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
          <div style={{ fontSize: 14, fontWeight: 800, color: c.text, marginBottom: 16 }}>Security & Access</div>
          {[{ label: "Two-Factor Authentication", value: "Enabled (TOTP)", status: "green" }, { label: "Last Password Change", value: "42 days ago", status: "amber" }, { label: "Active Sessions", value: "2 devices", status: "accent" }, { label: "API Keys", value: "1 active (created Mar 2)", status: "accent" }, { label: "Audit Log", value: "312 events this month", status: "accent" }].map(f => (
            <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 12 }}>
              <span style={{ color: c.textSec, fontWeight: 500 }}>{f.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: c.text, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{f.value}</span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c[f.status], boxShadow: `0 0 6px ${c[f.status]}40` }} />
              </div>
            </div>
          ))}
        </div>
        {/* Password Change */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, marginTop: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: c.text, marginBottom: 12 }}>Change Password</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360 }}>
            <input type="password" placeholder="New password (8+ characters)" style={{ fontSize: 12, padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontFamily: "inherit", outline: "none" }}
              id="pw-new" onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.border} />
            <input type="password" placeholder="Confirm new password" style={{ fontSize: 12, padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontFamily: "inherit", outline: "none" }}
              id="pw-confirm" onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.border} />
            <button onClick={async () => {
              const pw = document.getElementById("pw-new")?.value;
              const conf = document.getElementById("pw-confirm")?.value;
              if (!pw || pw.length < 8) { toast("Password must be at least 8 characters", "error"); return; }
              if (pw !== conf) { toast("Passwords do not match", "error"); return; }
              try {
                const { error } = await supabase.auth.updateUser({ password: pw });
                if (error) throw error;
                document.getElementById("pw-new").value = "";
                document.getElementById("pw-confirm").value = "";
                toast("Password updated successfully", "success");
              } catch (err) { toast(err?.message || "Failed to update password", "error"); }
            }} style={{ fontSize: 12, padding: "10px 18px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, alignSelf: "flex-start" }}>Update Password</button>
          </div>
        </div>
      </>)}

      {activeTab === "session" && (<>
        {/* Sign Out */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: `${c.cardGlow}, ${c.glassHighlight}`, marginBottom: 16 }}>
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
        <div style={{ background: c.surface, border: `1px solid ${c.red}30`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
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
                <button disabled={deleteText !== "DELETE ACME SAAS CORP"} onClick={async () => {
                  try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                      // Delete user profile (cascades via FK if configured, or manual)
                      await supabase.from("users").delete().eq("id", user.id);
                      // Sign out
                      await supabase.auth.signOut();
                    }
                  } catch (err) { console.error("Delete error:", err); }
                  setDeleteConfirm(false); setDeleteText(""); 
                  toast("Account deleted. You have been signed out.", "warning");
                  if (typeof onLogout === "function") onLogout();
                }} style={{ fontSize: 11, padding: "9px 18px", borderRadius: 8, border: "none", background: deleteText === "DELETE ACME SAAS CORP" ? c.red : c.textFaint, color: "#fff", cursor: deleteText === "DELETE ACME SAAS CORP" ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700, opacity: deleteText === "DELETE ACME SAAS CORP" ? 1 : 0.4 }}>Permanently Delete</button>
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
      background: `${c?.surface || "#111318"}f5`, border: `1px solid ${c?.border || "#1e2230"}`,
      borderRadius: 16, padding: "20px 24px", boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
      backdropFilter: "blur(16px)", fontFamily: "'DM Sans', system-ui, sans-serif",
      animation: "fadeSlideUp 0.4s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: c?.text || "#f0f2f5", marginBottom: 8 }}>Privacy Preferences</div>
      <div style={{ fontSize: 12, color: c?.textDim || "#8b92a5", lineHeight: 1.7, marginBottom: 14 }}>
        FinanceOS uses essential cookies for authentication and security. We do not use advertising cookies or sell your data. Analytics cookies help us improve the product.
      </div>
      {prefs && (
        <div style={{ marginBottom: 14, padding: 12, background: c?.bg2 || "#0b0c10", borderRadius: 8, fontSize: 11 }}>
          {[
            { name: "Essential", desc: "Authentication, security, session management", required: true, on: true },
            { name: "Analytics", desc: "Usage patterns to improve the product", required: false, on: true },
            { name: "Marketing", desc: "Not used — we do not run ads", required: false, on: false },
          ].map(cookie => (
            <div key={cookie.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${c?.borderSub || "#1e2230"}` }}>
              <div>
                <span style={{ color: c?.text || "#f0f2f5", fontWeight: 600 }}>{cookie.name}</span>
                <span style={{ color: c?.textFaint || "#3d4558", marginLeft: 8 }}>{cookie.desc}</span>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: cookie.on ? (c?.greenDim || "rgba(52,211,153,0.08)") : (c?.redDim || "rgba(248,113,113,0.08)"), color: cookie.on ? (c?.green || "#34d399") : (c?.red || "#f87171") }}>
                {cookie.required ? "REQUIRED" : cookie.on ? "ON" : "OFF"}
              </span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => accept("all")} style={{ fontSize: 12, padding: "9px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c?.accent || "#5b9cf5"}, ${c?.purple || "#a181f7"})`, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Accept All</button>
        <button onClick={() => accept("essential")} style={{ fontSize: 12, padding: "9px 18px", borderRadius: 8, border: `1px solid ${c?.border || "#1e2230"}`, background: "transparent", color: c?.textSec || "#9ea5b8", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Essential Only</button>
        <button onClick={() => setPrefs(!prefs)} style={{ fontSize: 11, padding: "9px 12px", borderRadius: 8, border: "none", background: "transparent", color: c?.textDim || "#8b92a5", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{prefs ? "Hide" : "Manage"}</button>
        <a href="https://finance-os.app/privacy" target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", fontSize: 10, color: c?.textFaint || "#3d4558" }}>Privacy Policy</a>
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
          options: { data: { full_name: name } },
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
    border: "1px solid #23232a", background: "#0b0c10", color: "#f0f2f5",
    fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 420, maxHeight: "90vh", overflow: "auto", background: "#111114", border: "1px solid #23232a", borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", animation: "cmdIn 0.25s cubic-bezier(0.22,1,0.36,1)" }}>
        {/* Header */}
        <div style={{ padding: "28px 32px 0", textAlign: "center", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 28, height: 28, borderRadius: 8, border: "1px solid #23232a", background: "transparent", color: "#8b92a5", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            <X size={14} />
          </button>
          <FosLogo size={36} />
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4, marginTop: 14 }}>
            {authMode === "login" ? "Welcome back" : authMode === "signup" ? "Start your free trial" : "Request a demo"}
          </div>
          <div style={{ fontSize: 13, color: "#8b92a5", lineHeight: 1.5 }}>
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
                  border: "1px solid #23232a", background: "#0b0c10", color: "#f0f2f5", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                  cursor: loading ? "wait" : "pointer", transition: "all 0.15s", opacity: loading && loading !== p.key ? 0.4 : 1,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = "#33384a"; e.currentTarget.style.background = "#111318"; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2230"; e.currentTarget.style.background = "#0b0c10"; }}
                >{p.icon} {loading === p.key ? "..." : p.name}</button>
              ))}
            </div>
            {error && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 12, color: "#ef4444", marginBottom: 8, textAlign: "center" }}>{error}</div>}
            {resetSent && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", fontSize: 12, color: "#34d399", marginBottom: 8, textAlign: "center" }}>Password reset link sent to {email}</div>}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0 14px" }}>
              <div style={{ flex: 1, height: 1, background: "#1e2230" }} />
              <span style={{ fontSize: 10, color: "#3d4558", textTransform: "uppercase", letterSpacing: "0.08em" }}>or email</span>
              <div style={{ flex: 1, height: 1, background: "#1e2230" }} />
            </div>
          </>)}

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(authMode === "signup" || authMode === "demo") && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#60a5fa"; e.target.style.boxShadow = "0 0 0 3px rgba(96,165,250,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#1e2230"; e.target.style.boxShadow = "none"; }}
                />
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#60a5fa"; e.target.style.boxShadow = "0 0 0 3px rgba(96,165,250,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#1e2230"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={authMode === "demo" ? "Work email" : "Email address"} style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "#60a5fa"; e.target.style.boxShadow = "0 0 0 3px rgba(96,165,250,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "#1e2230"; e.target.style.boxShadow = "none"; }}
              onKeyDown={e => e.key === "Enter" && (authMode === "demo" ? handleDemo() : handleEmail())}
            />
            {authMode !== "demo" && (
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={authMode === "signup" ? "Create password (8+ chars)" : "Password"} style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = "#60a5fa"; e.target.style.boxShadow = "0 0 0 3px rgba(96,165,250,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#1e2230"; e.target.style.boxShadow = "none"; }}
                  onKeyDown={e => e.key === "Enter" && handleEmail()}
                />
                <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2 }}><Eye size={14} color={showPw ? "#60a5fa" : "#3d4558"} /></button>
              </div>
            )}
            {authMode === "signup" && password.length > 0 && (
              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= pwStrength ? pwColor : "#1e2230", transition: "background 0.2s" }} />)}
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
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#3d4558" }}>
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
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#3d4558", fontWeight: 600 }}>
                <t.icon size={10} color="#3d4558" /> {t.label}
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
          {/* Trust signals */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16, paddingTop: 14, borderTop: "1px solid #1e2230" }}>
            {[{ label: "SOC 2", icon: "🛡️" }, { label: "AES-256", icon: "🔒" }, { label: "99.99% SLA", icon: "⚡" }].map(t => (
              <span key={t.label} style={{ fontSize: 9, color: "#3d4558", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11 }}>{t.icon}</span> {t.label}
              </span>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 9, color: "#3d4558" }}>Trusted by 2,400+ finance teams · No credit card required</div>
        </div>
      </div>
    </div>
  );
};

// ── PLAN PICKER — shows Stripe checkout links after signup ───
const PRICING_PLANS = [
  { name: "Starter", monthly: 599, annual: 499, seats: 5, entities: 3,
    desc: "3 entities · 5 users · P&L + Forecast",
    features: ["3 entities", "5 users", "P&L + Forecast", "5 connectors", "Email support"],
    monthlyLink: "https://buy.stripe.com/eVqaEX2GH18e0VcbIVdwc0o", annualLink: "https://buy.stripe.com/bJe4gza995ougUa28ldwc0p" },
  { name: "Growth", monthly: 1799, annual: 1499, seats: 25, entities: 10, popular: true,
    desc: "10 entities · 25 users · AI Copilot · Consolidation",
    features: ["10 entities", "25 users", "AI Copilot", "Consolidation", "Unlimited connectors", "Priority support"],
    monthlyLink: "https://buy.stripe.com/bJe7sL1CDcQWeM200ddwc0q", annualLink: "https://buy.stripe.com/cNieVd0yz8AG47obIVdwc0r" },
  { name: "Business", monthly: 4799, annual: 3999, seats: 999, entities: 999,
    desc: "Unlimited · Custom ML · SSO + RBAC · Dedicated CSM",
    features: ["Unlimited entities", "Unlimited users", "Custom ML models", "SSO + RBAC", "Dedicated CSM", "SLA guarantee", "API access"],
    monthlyLink: "https://buy.stripe.com/7sY8wPbdd04a8nE9ANdwc0s", annualLink: "https://buy.stripe.com/dRmaEX811dV0eM23cpdwc0t" },
  { name: "Enterprise", monthly: null, annual: null, seats: 999, entities: 999, enterprise: true,
    desc: "Custom deployment · SOX compliance · On-prem option",
    features: ["Everything in Business", "SOX-compliant audit trails", "On-premises deployment", "Custom integrations", "Dedicated success team", "Volume discounts", "White-glove onboarding"] },
];

// ── ONBOARDING WIZARD ────────────────────────────────────────
const OnboardingWizard = ({ c, userName, planStatus, onComplete }) => {
  const [step, setStep] = useState(0);
  const [org, setOrg] = useState({ name: "", industry: "", fy: "December", currency: "USD", erp: "" });
  const steps = [
    { title: "Set up your organization", sub: "Basic details to customize your experience", time: "~30 sec" },
    { title: "Connect your data", sub: "Link your ERP, CRM, or billing system", time: "~1 min" },
    { title: "You're all set", sub: "Your workspace is ready", time: "" },
  ];
  const erps = ["NetSuite", "QuickBooks", "Xero", "SAP", "Sage Intacct", "Workday", "Other", "Skip for now"];
  const inputStyle = { width: "100%", fontSize: 13, padding: "11px 14px", borderRadius: 10, border: `1px solid ${c?.border || "#1e2230"}`, background: c?.surfaceAlt || "#0b0c10", color: c?.text || "#f0f2f5", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}>
      <div style={{ width: 520, background: c?.surface || "#111318", border: `1px solid ${c?.border || "#1e2230"}`, borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", padding: "36px 40px", animation: "cmdIn 0.25s cubic-bezier(0.22,1,0.36,1)" }}>
        {/* Step progress bar with labels */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, position: "relative" }}>
          {/* Connecting line */}
          <div style={{ position: "absolute", top: 14, left: "16.5%", right: "16.5%", height: 2, background: c?.borderSub || "#1e2230", zIndex: 0 }} />
          <div style={{ position: "absolute", top: 14, left: "16.5%", height: 2, background: `linear-gradient(90deg, ${c?.accent || "#60a5fa"}, ${c?.green || "#34d399"})`, zIndex: 1, transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)", width: step === 0 ? "0%" : step === 1 ? "50%" : "67%" }} />
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2, flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                background: i < step ? `linear-gradient(135deg, ${c?.green || "#34d399"}, ${c?.accent || "#60a5fa"})` : i === step ? (c?.accent || "#60a5fa") : (c?.bg2 || "#1e2230"),
                color: i <= step ? "#fff" : (c?.textFaint || "#3d4558"),
                border: `2px solid ${i <= step ? "transparent" : (c?.borderSub || "#1e2230")}`,
                boxShadow: i === step ? `0 0 12px ${(c?.accent || "#60a5fa")}30` : "none",
              }}>
                {i < step ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: i <= step ? (c?.text || "#f0f2f5") : (c?.textFaint || "#3d4558"), textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>
                {i === 0 ? "Setup" : i === 1 ? "Connect" : "Ready"}
              </div>
            </div>
          ))}
        </div>

        {/* Pending plan indicator */}
        {planStatus?.startsWith("pending:") && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, padding: "8px 14px", borderRadius: 8, background: `${c?.accent || "#60a5fa"}08`, border: `1px solid ${c?.accent || "#60a5fa"}15`, fontSize: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: c?.green || "#34d399", animation: "pulse 2s infinite" }} />
            <span style={{ color: c?.textDim || "#8b92a5" }}>Plan:</span>
            <span style={{ fontWeight: 700, color: c?.accent || "#60a5fa" }}>{planStatus.replace("pending:", "")} — activating</span>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: c?.text || "#f0f2f5", marginBottom: 6 }}>
            {step === 2 ? `Welcome aboard${userName && userName !== "Guest" ? `, ${userName.split(" ")[0]}` : ""}!` : steps[step].title}
          </div>
          <div style={{ fontSize: 13, color: c?.textDim || "#8b92a5" }}>{steps[step].sub}</div>
          {steps[step].time && <div style={{ fontSize: 10, color: c?.textFaint || "#3d4558", marginTop: 4 }}>{steps[step].time}</div>}
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
                padding: "14px 16px", borderRadius: 10, border: `1px solid ${org.erp === e ? (c?.accent || "#60a5fa") : (c?.border || "#1e2230")}`,
                background: org.erp === e ? (c?.accentDim || "rgba(96,165,250,0.08)") : "transparent",
                color: org.erp === e ? (c?.accent || "#60a5fa") : (c?.textSec || "#9ea5b8"),
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                textAlign: "left",
              }}>{e}</button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center", padding: "8px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${c?.green || "#34d399"}, ${c?.accent || "#60a5fa"})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4, boxShadow: `0 8px 24px ${(c?.green || "#34d399")}25` }}>
              <Check size={28} color="#fff" strokeWidth={3} />
            </div>
            <div style={{ background: c?.surfaceAlt || "#0b0c10", borderRadius: 10, padding: "14px 20px", fontSize: 12, color: c?.textDim || "#8b92a5", textAlign: "center", lineHeight: 1.7, width: "100%" }}>
              {org.name && <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>Organization</span><strong style={{ color: c?.text || "#f0f2f5" }}>{org.name}</strong></div>}
              {org.industry && <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>Industry</span><strong style={{ color: c?.text || "#f0f2f5" }}>{org.industry}</strong></div>}
              {org.erp && org.erp !== "Skip for now" && <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>Data source</span><strong style={{ color: c?.text || "#f0f2f5" }}>{org.erp}</strong></div>}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>FY End</span><strong style={{ color: c?.text || "#f0f2f5" }}>{org.fy}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>Currency</span><strong style={{ color: c?.text || "#f0f2f5" }}>{org.currency}</strong></div>
            </div>
            <div style={{ fontSize: 10, color: c?.textFaint || "#3d4558", textAlign: "center" }}>Dashboard loaded with sample data. Connect live data anytime from Integrations.</div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ fontSize: 12, color: c?.textDim || "#8b92a5", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>← Back</button>
          ) : <div />}
          <button onClick={() => { if (step < 2) setStep(s => s + 1); else onComplete(org); }} style={{
            fontSize: 13, padding: "12px 28px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            background: step === 2 ? `linear-gradient(135deg, ${c?.green || "#34d399"}, ${c?.accent || "#60a5fa"})` : (c?.accent || "#60a5fa"), color: "#fff",
            boxShadow: `0 4px 16px ${(c?.accent || "#60a5fa")}25`,
          }}>{step === 2 ? "Go to Dashboard →" : "Continue →"}</button>
        </div>
      </div>
    </div>
  );
};

const PlanPicker = ({ c, userName, onSkip, onSelect, isDemo }) => {
  const [billing, setBilling] = useState("annual");
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [checkoutPending, setCheckoutPending] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verifyFailed, setVerifyFailed] = useState(false);
  const annualSavings = { Starter: 1200, Growth: 3600, Business: 9600 };
  // Theme helper — uses dashboard theme if available, falls back to dark
  const t = { bg: c?.surface || "#111318", bg2: c?.bg2 || "#0b0c10", alt: c?.surfaceAlt || "#181b22", bdr: c?.border || "#1e2230", bdrSub: c?.borderSub || "#171b25", bdrBright: c?.borderBright || "#2a2f3d", tx: c?.text || "#eef0f6", txD: c?.textDim || "#636d84", txF: c?.textFaint || "#3d4558", txS: c?.textSec || "#9ea5b8", ac: c?.accent || "#5b9cf5", pu: c?.purple || "#a181f7", gn: c?.green || "#3dd9a0", rd: c?.red || "#f06b6b" };

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
    <div onClick={onSkip} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 800, maxHeight: "94vh", overflow: "auto", background: t.bg, border: `1px solid ${t.bdr}`, borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.4)", animation: "cmdIn 0.25s cubic-bezier(0.22,1,0.36,1)" }}>
        {/* Header */}
        <div style={{ padding: "32px 40px 0", textAlign: "center", position: "relative" }}>
          {/* Back / Close button */}
          <button onClick={onSkip} aria-label="Go back" style={{
            position: "absolute", top: 20, left: 20, width: 36, height: 36, borderRadius: 10,
            border: `1px solid ${t.bdr}`, background: "transparent", color: t.txD, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
            fontFamily: "inherit", fontSize: 16,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.bdrBright; e.currentTarget.style.color = t.tx; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.bdr; e.currentTarget.style.color = t.txD; }}
          >←</button>
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: `${t.gn}10`, border: `1px solid ${t.gn}18`, fontSize: 10, fontWeight: 700, color: t.gn, marginBottom: 12, letterSpacing: "0.04em" }}>30-DAY MONEY-BACK GUARANTEE</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6, color: t.tx }}>
            {userName && userName !== "Guest" ? `Welcome, ${userName.split(" ")[0]}!` : "Choose your plan"}
          </div>
          <div style={{ fontSize: 13, color: t.txD, marginBottom: 16 }}>All plans include a 14-day free trial. Upgrade, downgrade, or cancel anytime.</div>
          <div style={{ display: "inline-flex", background: t.bg2, borderRadius: 10, padding: 3, border: `1px solid ${t.bdr}` }}>
            <button onClick={() => setBilling("monthly")} style={{ fontSize: 12, padding: "8px 20px", borderRadius: 8, border: "none", background: billing === "monthly" ? t.bdr : "transparent", color: billing === "monthly" ? t.tx : t.txD, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}>Monthly</button>
            <button onClick={() => setBilling("annual")} style={{ fontSize: 12, padding: "8px 20px", borderRadius: 8, border: "none", background: billing === "annual" ? t.bdr : "transparent", color: billing === "annual" ? t.tx : t.txD, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s", position: "relative" }}>
              Annual
              <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: `${t.gn}14`, color: t.gn }}>SAVE 17%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ padding: "24px 40px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {PRICING_PLANS.map((p, idx) => {
              const isHovered = hoveredPlan === idx;
              const priceDisplay = p.enterprise ? "Custom" : `$${billing === "annual" ? p.annual?.toLocaleString() : p.monthly?.toLocaleString()}`;
              const savings = p.monthly && p.annual ? (p.monthly - p.annual) * 12 : 0;
              return (
              <div key={p.name} onMouseEnter={() => setHoveredPlan(idx)} onMouseLeave={() => setHoveredPlan(null)} style={{
                background: p.popular ? `linear-gradient(180deg, ${t.ac}08 0%, ${t.bg2} 100%)` : t.bg2,
                border: `1px solid ${p.popular ? t.ac : isHovered ? t.bdrBright : t.bdrSub}`,
                borderRadius: 16, padding: "24px 20px", position: "relative", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                transform: isHovered ? "translateY(-4px)" : "none",
                boxShadow: p.popular ? `0 0 0 1px ${t.ac}18, 0 8px 30px ${t.ac}10` : isHovered ? "0 12px 40px rgba(0,0,0,0.25)" : "none",
              }}>
                {p.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", borderRadius: 8, background: `linear-gradient(135deg, ${t.ac}, ${t.pu})`, fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>MOST POPULAR</div>}
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: t.tx }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: p.enterprise ? 28 : 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: t.tx }}>{priceDisplay}</span>
                  {!p.enterprise && <span style={{ fontSize: 13, color: t.txD }}>/mo</span>}
                </div>
                {!p.enterprise && billing === "annual" && savings > 0 && (
                  <div style={{ fontSize: 11, color: t.gn, fontWeight: 600, marginBottom: 10 }}>Save ${savings.toLocaleString()}/year</div>
                )}
                {!p.enterprise && billing === "monthly" && <div style={{ height: 18 }} />}
                {p.enterprise && <div style={{ fontSize: 11, color: t.txD, marginBottom: 10 }}>Tailored to your requirements</div>}
                <div style={{ fontSize: 11, color: t.txD, lineHeight: 1.6, marginBottom: 16, minHeight: 36 }}>{p.desc}</div>
                <button onClick={() => {
                  if (p.enterprise) { window.open("mailto:sales@finance-os.app?subject=Enterprise%20Pricing%20Inquiry", "_blank"); return; }
                  setCheckoutPending(p.name);
                  try { window.open(billing === "annual" ? p.annualLink : p.monthlyLink, "_blank"); } catch {}
                }} style={{
                  width: "100%", padding: "12px", borderRadius: 10, border: p.enterprise ? `1px solid ${t.bdr}` : "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                  background: p.popular ? `linear-gradient(135deg, ${t.ac}, ${t.pu})` : p.enterprise ? "transparent" : isHovered ? t.bdrBright : t.bdr, color: p.enterprise ? t.txS : "#fff",
                  transition: "all 0.2s", boxShadow: p.popular ? `0 4px 16px ${t.ac}25` : "none",
                }}
                onMouseEnter={e => { if (!p.popular) e.currentTarget.style.background = t.bdrBright; }}
                onMouseLeave={e => { if (!p.popular) e.currentTarget.style.background = t.bdr; }}
                >{p.enterprise ? "Contact Sales" : `Start ${p.name} Trial`}</button>
              </div>
              );
            })}
          </div>
        </div>

        {/* Checkout confirmation gate */}
        {checkoutPending && !verifyingPayment && !verifyFailed && (
          <div style={{ padding: "24px 40px", textAlign: "center" }}>
            <div style={{ background: `linear-gradient(135deg, ${t.ac}08, ${t.pu}05)`, border: `1px solid ${t.ac}20`, borderRadius: 16, padding: "32px 28px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${t.ac}, ${t.pu})`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>💳</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.tx, marginBottom: 6 }}>Complete your {checkoutPending} checkout</div>
              <div style={{ fontSize: 13, color: t.txD, lineHeight: 1.6, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
                A Stripe checkout tab has opened. Complete your payment there, then return here to verify.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => {
                  setVerifyingPayment(true);
                  // Simulate payment verification (in production: check Stripe session via webhook/API)
                  setTimeout(() => {
                    // Demo mode: always succeeds. Production: check stripe.checkout.sessions.retrieve()
                    setVerifyingPayment(false);
                    onSelect(checkoutPending);
                  }, 2000);
                }} style={{
                  fontSize: 14, padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                  background: `linear-gradient(135deg, ${t.gn}, ${t.ac})`, color: "#fff", boxShadow: `0 4px 16px ${t.gn}25`,
                }}>Verify Payment</button>
                <button onClick={() => { setCheckoutPending(null); }} style={{
                  fontSize: 13, padding: "12px 20px", borderRadius: 10, border: `1px solid ${t.bdr}`, background: "transparent", color: t.txD, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                }}>Cancel</button>
              </div>
              <div style={{ fontSize: 10, color: t.txF, marginTop: 14 }}>Payment will be verified with Stripe before your account is activated.</div>
            </div>
          </div>
        )}

        {/* Verification in progress */}
        {verifyingPayment && (
          <div style={{ padding: "24px 40px", textAlign: "center" }}>
            <div style={{ background: `linear-gradient(135deg, ${t.ac}06, ${t.pu}04)`, border: `1px solid ${t.ac}15`, borderRadius: 16, padding: "48px 28px" }}>
              <div style={{ width: 40, height: 40, border: `3px solid ${t.ac}30`, borderTopColor: t.ac, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <div style={{ fontSize: 16, fontWeight: 800, color: t.tx, marginBottom: 4 }}>Verifying payment...</div>
              <div style={{ fontSize: 12, color: t.txD }}>Checking with Stripe for {checkoutPending} subscription</div>
            </div>
          </div>
        )}

        {/* Verification failed */}
        {verifyFailed && (
          <div style={{ padding: "24px 40px", textAlign: "center" }}>
            <div style={{ background: `linear-gradient(135deg, ${t.rd}06, ${t.rd}03)`, border: `1px solid ${t.rd}20`, borderRadius: 16, padding: "32px 28px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${t.rd}15`, border: `1px solid ${t.rd}20`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 20 }}>✕</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.tx, marginBottom: 6 }}>Payment not found</div>
              <div style={{ fontSize: 13, color: t.txD, lineHeight: 1.6, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
                We couldn't verify a completed payment for the {checkoutPending} plan. This usually means the checkout was cancelled or is still processing.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => {
                  setVerifyFailed(false);
                  try { window.open(billing === "annual" ? PRICING_PLANS.find(p => p.name === checkoutPending)?.annualLink : PRICING_PLANS.find(p => p.name === checkoutPending)?.monthlyLink, "_blank"); } catch {}
                }} style={{
                  fontSize: 13, padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                  background: `linear-gradient(135deg, ${t.ac}, ${t.pu})`, color: "#fff",
                }}>Try Again</button>
                <button onClick={() => { setCheckoutPending(null); setVerifyFailed(false); }} style={{
                  fontSize: 13, padding: "12px 20px", borderRadius: 10, border: `1px solid ${t.bdr}`, background: "transparent", color: t.txD, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                }}>Choose Different Plan</button>
              </div>
            </div>
          </div>
        )}

        {/* Feature comparison */}
        {!checkoutPending && !verifyingPayment && !verifyFailed && (
        <div style={{ padding: "24px 40px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.txF, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Feature Comparison</div>
          <div style={{ background: t.bg2, border: `1px solid ${t.bdrSub}`, borderRadius: 12, overflow: "hidden" }}>
            {features.map((f, i) => (
              <div key={f.name} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", borderBottom: i < features.length - 1 ? `1px solid ${t.bdrSub}` : "none", fontSize: 11 }}>
                <div style={{ padding: "8px 14px", color: t.txS, fontWeight: 500 }}>{f.name}</div>
                {f.values.map((v, j) => (
                  <div key={j} style={{ padding: "8px 14px", textAlign: "center", color: v === true ? t.gn : v === false ? t.txF : t.tx, fontWeight: v === true || v === false ? 400 : 600, fontFamily: typeof v === "string" ? "'JetBrains Mono', monospace" : "inherit" }}>
                    {v === true ? "✓" : v === false ? "—" : v}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Footer */}
        {!checkoutPending && !verifyingPayment && !verifyFailed && (
        <div style={{ padding: "20px 40px 28px", textAlign: "center" }}>
          {isDemo ? (
            <button onClick={onSkip} style={{ fontSize: 12, color: t.txD, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", marginBottom: 12 }}>Continue with demo — explore with sample data</button>
          ) : (
            <div>
              <div style={{ fontSize: 11, color: t.txF, marginBottom: 8 }}>All plans include: SOC 2 compliance · AES-256 encryption · 24/7 monitoring · Email support</div>
              <button onClick={onSkip} style={{ fontSize: 11, color: t.txD, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 6 }}>Skip for now →</button>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            {["2,400+ demo users", "NPS 72", "$840K pipeline"].map(s => (
              <div key={s} style={{ fontSize: 10, color: t.txF, fontWeight: 600 }}>{s}</div>
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
        <p style={{ fontSize: 15, color: "#8b92a5", maxWidth: 480, margin: "0 auto" }}>Explore the platform by use case. Click a tab to see how each module works.</p>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32 }}>
        {DEMO_TABS.map(d => (
          <button key={d.id} onClick={() => setTab(d.id)} style={{
            fontSize: 13, padding: "10px 20px", borderRadius: 10, border: tab === d.id ? "1px solid #60a5fa" : "1px solid #23232a",
            background: tab === d.id ? "rgba(96,165,250,0.08)" : "transparent",
            color: tab === d.id ? "#60a5fa" : "#8b92a5", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s",
          }}>{d.label}</button>
        ))}
      </div>
      {/* Content + Mockup */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 32, alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>{active.title}</h3>
          <p style={{ fontSize: 15, color: "#8b92a5", lineHeight: 1.7, marginBottom: 24 }}>{active.sub}</p>
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            {active.kpis.map(k => (
              <div key={k.l} style={{ padding: "10px 16px", borderRadius: 10, background: "#111318", border: "1px solid #1b1b20" }}>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{k.v}</div>
                <div style={{ fontSize: 10, color: "#3d4558", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.l}</div>
              </div>
            ))}
          </div>
          <button onClick={enterDemo} style={{ fontSize: 14, padding: "12px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 4px 16px rgba(96,165,250,0.25)" }}>Try This Feature</button>
        </div>
        {/* Browser mockup */}
        <div style={{ background: "#0b0c10", border: "1px solid #23232a", borderRadius: 16, padding: 4, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
          <div style={{ background: "#111114", borderRadius: 13, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "#0b0c10", borderBottom: "1px solid #1b1b20" }}>
              <div style={{ display: "flex", gap: 5 }}>{["#ef4444","#fbbf24","#22c55e"].map(cl => <div key={cl} style={{ width: 8, height: 8, borderRadius: "50%", background: cl }} />)}</div>
              <div style={{ flex: 1, marginLeft: 8, padding: "4px 12px", borderRadius: 6, background: "#0a0a0d", border: "1px solid #1b1b20", fontSize: 10, color: "#3d4558" }}>app.finance-os.app/{active.id}</div>
            </div>
            <div style={{ padding: 20, minHeight: 280 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 40, background: "#1e2230", borderRadius: 8, minHeight: 240 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#f0f2f5" }}>{active.title}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                    {active.kpis.map((k, i) => (
                      <div key={k.l} style={{ background: "#111318", border: "1px solid #1b1b20", borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: ["#60a5fa","#34d399","#a78bfa"][i], fontFamily: "'JetBrains Mono', monospace" }}>{k.v}</div>
                        <div style={{ fontSize: 8, color: "#3d4558", marginTop: 2 }}>{k.l}</div>
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

  const plans = PRICING_PLANS;

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#f0f2f5", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "auto" }}>
      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-15%", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 65%)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 65%)", filter: "blur(100px)" }} />
      </div>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "14px 20px" : "16px 48px", maxWidth: 1200, margin: "0 auto", background: "rgba(9,9,11,0.8)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(30,34,48,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FosLogo size={32} />
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>Finance<span style={{ fontWeight: 400, opacity: 0.6 }}>OS</span></span>
        </div>
        {!isMobile ? (
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[{ label: "Features", href: "#features" }, { label: "Security", href: "#security" }, { label: "Pricing", href: "#pricing" }].map(link => (
            <a key={link.label} href={link.href} style={{ fontSize: 13, color: "#8b92a5", textDecoration: "none", fontWeight: 500, transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#f0f2f5"}
              onMouseLeave={e => e.currentTarget.style.color = "#8b92a5"}
            >{link.label}</a>
          ))}
          <a href="#invest" style={{ fontSize: 13, color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}>Investors</a>
          <div style={{ width: 1, height: 20, background: "#1e2230" }} />
          <button onClick={() => setAuthModal("login")} style={{ fontSize: 13, padding: "9px 20px", borderRadius: 8, border: "1px solid #1e2230", background: "transparent", color: "#f0f2f5", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#3d4558"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2230"}
          >Sign In</button>
          <button onClick={() => setAuthModal("signup")} style={{ fontSize: 13, padding: "9px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 4px 16px rgba(96,165,250,0.2)", transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(96,165,250,0.3)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(96,165,250,0.2)"}
          >Start Free Trial</button>
        </div>
        ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setAuthModal("login")} style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, border: "1px solid #23232a", background: "transparent", color: "#f0f2f5", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Sign In</button>
          <button onClick={() => setAuthModal("signup")} style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Try Free</button>
        </div>
        )}
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: isMobile ? "40px 20px 32px" : "80px 48px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.12)", fontSize: 11, fontWeight: 700, color: "#60a5fa", marginBottom: 28, letterSpacing: "0.04em", animation: "fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#34d399", marginRight: 8, animation: "pulse 2s infinite" }} />
          AI-NATIVE FP&A — NOW IN GENERAL AVAILABILITY
        </div>
        <h1 style={{ fontSize: isMobile ? 38 : 60, fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.04em", marginBottom: 22, animation: "fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both" }}>
          Financial planning<br />that <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>thinks before</span><br />it answers
        </h1>
        <p style={{ fontSize: isMobile ? 16 : 18, color: "#8b92a5", lineHeight: 1.65, maxWidth: 540, margin: "0 auto 40px", fontWeight: 400, animation: "fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}>
          Connect your ERP, CRM, and billing data into a unified model with AI-powered variance detection and natural language querying.
        </p>
        <div style={{ display: "flex", gap: 0, justifyContent: "center", maxWidth: 440, margin: "0 auto", flexDirection: isMobile ? "column" : "row" }}>
          <input value={heroEmail} onChange={e => setHeroEmail(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleHeroSignup(); }}
            placeholder="Work email" type="email"
            style={{ flex: 1, fontSize: 14, padding: "14px 18px", borderRadius: isMobile ? 10 : "10px 0 0 10px", border: "1px solid #23232a", borderRight: isMobile ? "1px solid #23232a" : "none", background: "#0b0c10", color: "#f0f2f5", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = "#60a5fa"}
            onBlur={e => e.target.style.borderColor = "#1e2230"}
          />
          <button onClick={handleHeroSignup} style={{ fontSize: 14, padding: "14px 24px", borderRadius: isMobile ? 10 : "0 10px 10px 0", border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 8px 30px rgba(96,165,250,0.25)" }}>Get Started Free</button>
        </div>
        <div style={{ fontSize: 11, color: "#3d4558", marginTop: 8, textAlign: "center" }}>Using a work email helps find teammates · No credit card required</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
          <button onClick={enterDemo} style={{ fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "1px solid #23232a", background: "transparent", color: "#9ea5b8", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#33384a"; e.currentTarget.style.color = "#f0f2f5"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2230"; e.currentTarget.style.color = "#9ea5b8"; }}
          >Try the Live Demo</button>
          <button onClick={() => { document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); }} style={{ fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "1px solid #23232a", background: "transparent", color: "#9ea5b8", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#33384a"; e.currentTarget.style.color = "#f0f2f5"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2230"; e.currentTarget.style.color = "#9ea5b8"; }}
          >Watch 2-min Overview</button>
        </div>
        {/* Hero traction metrics */}
        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 32, flexWrap: "wrap" }}>
          {[
            { value: "$48.6M", label: "ARR" },
            { value: "118%", label: "NDR" },
            { value: "2,400+", label: "Demo users" },
            { value: "< 48hr", label: "Go-live" },
          ].map(m => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#f0f2f5", fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
              <div style={{ fontSize: 9, color: "#3d4558", fontWeight: 600, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof — Logo strip */}
      <div style={{ textAlign: "center", padding: "40px 48px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: "#3d4558", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20, fontWeight: 600 }}>Trusted by finance teams at</div>
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
          <p style={{ fontSize: 15, color: "#8b92a5", maxWidth: 500, margin: "0 auto" }}>From variance detection to board-ready reports, powered by AI that shows its reasoning.</p>
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
            <div key={f.title} style={{ background: "#111318", border: "1px solid #1e2230", borderRadius: 16, padding: "26px 24px", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.color}40`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${f.color}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2230"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg, transparent, ${f.color}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${f.color}15, ${f.color}06)`, border: `1px solid ${f.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <f.Icon size={20} color={f.color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.01em" }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#8b92a5", lineHeight: 1.65 }}>{f.desc}</div>
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
          <p style={{ fontSize: 15, color: "#8b92a5", maxWidth: 480, margin: "0 auto" }}>No 6-month implementation. No consultants. Connect your data and start planning in days.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 16, position: "relative" }}>
          {/* Connecting line (desktop only) */}
          {!isMobile && <div style={{ position: "absolute", top: 18, left: "12.5%", right: "12.5%", height: 2, background: "linear-gradient(90deg, #60a5fa30, #a78bfa30, #34d39930, #fbbf2430)", zIndex: 0 }} />}
          {[
            { step: 1, title: "Connect your data", desc: "Link your ERP, CRM, and billing in under 5 minutes. NetSuite, Salesforce, Stripe, QuickBooks — all pre-built.", color: "#60a5fa" },
            { step: 2, title: "AI builds your model", desc: "FinanceOS auto-maps your chart of accounts, detects revenue drivers, and creates a baseline forecast.", color: "#a78bfa" },
            { step: 3, title: "Plan & scenario model", desc: "Run what-if scenarios, adjust assumptions with live sliders, and compare 4 models side-by-side.", color: "#34d399" },
            { step: 4, title: "Close & report", desc: "Multi-entity consolidation, variance commentary, and board-ready exports — all from one platform.", color: "#fbbf24" },
          ].map(s => (
            <div key={s.step} style={{ background: "#111318", border: "1px solid #1e2230", borderRadius: 16, padding: "26px 24px", position: "relative", zIndex: 1, transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}40`; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2230"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${s.color}18, ${s.color}06)`, border: `1px solid ${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: s.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>{s.step}</div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#8b92a5", lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={enterDemo} style={{ fontSize: 15, padding: "14px 32px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 8px 30px rgba(96,165,250,0.25)" }}>Start Your Free Trial</button>
          <div style={{ marginTop: 10, fontSize: 12, color: "#3d4558" }}>No credit card required · 30-day money-back guarantee</div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)", fontSize: 10, fontWeight: 700, color: "#34d399", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>Customer Stories</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Trusted by finance leaders</h2>
          <p style={{ fontSize: 15, color: "#8b92a5", maxWidth: 500, margin: "0 auto" }}>See why modern FP&A teams choose FinanceOS over legacy platforms.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {[
            { quote: "We went from a 12-day close to 4 days. The AI copilot found a $1.2M accrual error our auditors missed.", name: "Sarah Chen", title: "VP Finance, Acme Corp", metric: "8-day reduction in close time" },
            { quote: "The scenario modeling paid for itself in one board meeting. We modeled three M&A paths in 20 minutes instead of two weeks.", name: "James Park", title: "CFO, TechFlow", metric: "10x faster scenario analysis" },
            { quote: "Switched from Pigment. The transparent AI reasoning was the deciding factor — we can actually trust the outputs.", name: "Maria Lopez", title: "FP&A Director, Nexus AI", metric: "From Pigment in 3 weeks" },
          ].map(t => (
            <div key={t.name} style={{ background: "#111318", border: "1px solid #1e2230", borderRadius: 16, padding: "28px 24px", position: "relative", overflow: "hidden", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#3d4558"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2230"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: "linear-gradient(90deg, transparent, #60a5fa25, transparent)", borderRadius: "0 0 2px 2px" }} />
              <div style={{ fontSize: 11, color: "#f5b731", marginBottom: 14, letterSpacing: 2 }}>★★★★★</div>
              <div style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.75, marginBottom: 20, minHeight: 80, fontStyle: "italic" }}>"{t.quote}"</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #60a5fa15, #a78bfa15)", border: "1px solid #1e2230", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#60a5fa" }}>{t.name.split(" ").map(w => w[0]).join("")}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f2f5" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#8b92a5" }}>{t.title}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, padding: "5px 12px", borderRadius: 6, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.10)", color: "#34d399", display: "inline-block" }}>{t.metric}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Comparison — SWOT: position vs Pigment, Anaplan, Runway */}
      <div style={{ padding: "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>How FinanceOS compares</h2>
          <p style={{ fontSize: 15, color: "#8b92a5", maxWidth: 500, margin: "0 auto" }}>Enterprise capability at mid-market pricing. No 6-month implementation.</p>
        </div>
        <div style={{ background: "#111318", border: "1px solid #1e2230", borderRadius: 16, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: "linear-gradient(90deg, transparent, #60a5fa30, transparent)", borderRadius: "0 0 2px 2px" }} />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #23232a" }}>
                {["Capability", "FinanceOS", "Anaplan", "Pigment", "Runway"].map((h, i) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: i === 0 ? "left" : "center", fontSize: 11, fontWeight: 700, color: i === 1 ? "#60a5fa" : "#8b92a5", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
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
                { cap: "Banking data via Plaid", us: true, an: false, pi: false, ru: false },
                { cap: "CSV / file upload pipeline", us: true, an: true, pi: true, ru: true },
                { cap: "SOC 2 Type II compliant", us: true, an: true, pi: true, ru: true },
                { cap: "Enterprise / on-prem option", us: true, an: true, pi: true, ru: false },
                { cap: "Implementation time", us: "< 48hr", an: "3-6 mo", pi: "3-6 mo", ru: "Weeks" },
                { cap: "Starting price", us: "$499/mo", an: "$200K+/yr", pi: "$65K+/yr", ru: "$30K+/yr" },
              ].map(row => (
                <tr key={row.cap} style={{ borderBottom: "1px solid #1b1b20" }}>
                  <td style={{ padding: "12px 16px", color: "#9ea5b8", fontWeight: 500 }}>{row.cap}</td>
                  {[row.us, row.an, row.pi, row.ru].map((v, i) => (
                    <td key={i} style={{ padding: "12px 16px", textAlign: "center" }}>
                      {typeof v === "boolean" ? (
                        v ? <Check size={16} color="#34d399" strokeWidth={2.5} /> : <X size={14} color="#3d4558" strokeWidth={2} />
                      ) : (
                        <span style={{ fontWeight: 700, color: i === 0 ? "#60a5fa" : "#8b92a5", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{v}</span>
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
      <div id="pricing" style={{ padding: isMobile ? "40px 20px 60px" : "80px 48px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.12)", fontSize: 10, fontWeight: 700, color: "#60a5fa", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>Pricing</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Simple, transparent pricing</h2>
          <p style={{ fontSize: 15, color: "#8b92a5", marginBottom: 24 }}>No hidden fees. No implementation charges. Cancel anytime.</p>
          <div style={{ display: "inline-flex", background: "#111318", borderRadius: 10, padding: 3, border: "1px solid #1e2230" }}>
            <button onClick={() => setBilling("monthly")} style={{ fontSize: 12, padding: "8px 18px", borderRadius: 8, border: "none", background: billing === "monthly" ? "#1e2230" : "transparent", color: billing === "monthly" ? "#f0f2f5" : "#8b92a5", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}>Monthly</button>
            <button onClick={() => setBilling("annual")} style={{ fontSize: 12, padding: "8px 18px", borderRadius: 8, border: "none", background: billing === "annual" ? "#1e2230" : "transparent", color: billing === "annual" ? "#f0f2f5" : "#8b92a5", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}>Annual <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "rgba(52,211,153,0.10)", color: "#34d399", marginLeft: 4 }}>-17%</span></button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: p.popular ? "linear-gradient(180deg, rgba(96,165,250,0.04) 0%, #111318 100%)" : "#111318", border: `1px solid ${p.popular ? "#60a5fa50" : "#1e2230"}`, borderRadius: 16, padding: "28px 24px", position: "relative", overflow: "hidden", boxShadow: p.popular ? "0 0 0 1px rgba(96,165,250,0.12), 0 12px 40px rgba(96,165,250,0.08)" : "none", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = p.popular ? "0 0 0 1px rgba(96,165,250,0.25), 0 20px 60px rgba(96,165,250,0.12)" : "0 12px 40px rgba(0,0,0,0.25)"; e.currentTarget.style.borderColor = p.popular ? "#60a5fa" : "#3d4558"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = p.popular ? "0 0 0 1px rgba(96,165,250,0.12), 0 12px 40px rgba(96,165,250,0.08)" : "none"; e.currentTarget.style.borderColor = p.popular ? "#60a5fa50" : "#1e2230"; }}
            >
              {p.popular && <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: "linear-gradient(90deg, transparent, #60a5fa50, transparent)", borderRadius: "0 0 2px 2px" }} />}
              {p.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", borderRadius: 8, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                {p.enterprise ? (
                  <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>Custom</span>
                ) : (
                  <><span style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.03em" }}>${billing === "annual" ? p.annual?.toLocaleString() : p.monthly?.toLocaleString()}</span>
                  <span style={{ fontSize: 13, color: "#8b92a5" }}>/mo</span></>
                )}
              </div>
              {!p.enterprise && billing === "annual" && p.monthly && p.annual && <div style={{ fontSize: 11, color: "#34d399", fontWeight: 600, marginBottom: 14 }}>Save ${((p.monthly - p.annual) * 12).toLocaleString()}/year</div>}
              {!p.enterprise && billing === "monthly" && <div style={{ height: 20 }} />}
              {p.enterprise && <div style={{ fontSize: 11, color: "#8b92a5", marginBottom: 14 }}>Tailored to your requirements</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                {p.features.map(f => (
                  <div key={f} style={{ fontSize: 13, color: "#9ea5b8", display: "flex", alignItems: "center", gap: 8 }}>
                    <Check size={14} color="#34d399" strokeWidth={2.5} /> {f}
                  </div>
                ))}
              </div>
              {p.enterprise ? (
                <button onClick={() => { window.open("mailto:sales@finance-os.app?subject=Enterprise%20Pricing%20Inquiry", "_blank"); }} style={{
                  width: "100%", fontSize: 12, padding: "12px 0", borderRadius: 10, border: "1px solid #1e2230", cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                  background: "transparent", color: "#9ea5b8", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#3d4558"; e.currentTarget.style.color = "#f0f2f5"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2230"; e.currentTarget.style.color = "#9ea5b8"; }}
                >Contact Sales</button>
              ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={enterDemo} style={{
                  flex: 1, fontSize: 12, padding: "12px 0", borderRadius: 10, border: "1px solid #1e2230", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                  background: "transparent", color: "#8b92a5", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#3d4558"; e.currentTarget.style.color = "#f0f2f5"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2230"; e.currentTarget.style.color = "#8b92a5"; }}
                >Try Demo</button>
                <button onClick={() => { try { window.open(billing === "annual" ? p.annualLink : p.monthlyLink, "_blank"); } catch {} }} style={{
                  flex: 2, fontSize: 12, padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                  background: p.popular ? "linear-gradient(135deg, #60a5fa, #a78bfa)" : "#1e2230", color: "#fff", transition: "all 0.15s",
                  boxShadow: p.popular ? "0 4px 16px rgba(96,165,250,0.2)" : "none",
                }}>Subscribe</button>
              </div>
              )}
              <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: "#3d4558" }}>{p.enterprise ? "Custom SLA + deployment" : "30-day money-back guarantee"}</div>
            </div>
          ))}
        </div>
        {/* Social proof + ROI below pricing */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 32, flexWrap: "wrap" }}>
          {[
            { value: "8 days", label: "Avg close time reduction" },
            { value: "10x", label: "Faster scenario analysis" },
            { value: "84%", label: "Average gross margin" },
            { value: "< 48hr", label: "Implementation time" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f0f2f5", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#8b92a5", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#3d4558" }}>All plans include: SOC 2 compliance · AES-256 encryption · 24/7 monitoring · Email support</div>
      </div>
      <div style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.12)", fontSize: 10, fontWeight: 700, color: "#a78bfa", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>FAQ</div>
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
          <details key={i} style={{ borderBottom: "1px solid #1e2230", cursor: "pointer" }}>
            <summary style={{ padding: "20px 0", fontSize: 15, fontWeight: 600, color: "#f0f2f5", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {faq.q}
              <ChevronDown size={16} color="#8b92a5" style={{ flexShrink: 0, transition: "transform 0.2s" }} />
            </summary>
            <div style={{ padding: "0 0 20px", fontSize: 13, color: "#9ea5b8", lineHeight: 1.75 }}>{faq.a}</div>
          </details>
        ))}
      </div>

      {/* Security & Trust */}
      <div id="security" style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)", fontSize: 10, fontWeight: 700, color: "#34d399", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>Security</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Enterprise-grade security</h2>
          <p style={{ fontSize: 15, color: "#8b92a5", maxWidth: 500, margin: "0 auto" }}>Your financial data deserves bank-level protection. We build security into every layer.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {[
            { title: "SOC 2 Type II", sub: "Audit-ready architecture with full access logging and role-based controls.", badge: "COMPLIANT", icon: Shield, color: "#34d399" },
            { title: "AES-256 Encryption", sub: "Data encrypted at rest and in transit. Zero plaintext storage of credentials.", badge: "AT REST + TRANSIT", icon: Zap, color: "#60a5fa" },
            { title: "Row-Level Security", sub: "Every database query is scoped to your organization. Zero cross-tenant data leakage.", badge: "SUPABASE RLS", icon: Layers, color: "#a78bfa" },
            { title: "HSTS + CSP Headers", sub: "Strict Transport Security, Content Security Policy, and 5 additional security headers.", badge: "VERCEL", icon: Globe, color: "#22d3ee" },
          ].map(s => (
            <div key={s.title} style={{ background: "#111318", border: "1px solid #1e2230", borderRadius: 16, padding: "24px 20px", textAlign: "center", position: "relative", overflow: "hidden", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}40`; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2230"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: `linear-gradient(90deg, transparent, ${s.color}30, transparent)`, borderRadius: "0 0 2px 2px" }} />
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${s.color}15, ${s.color}06)`, border: `1px solid ${s.color}12`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <s.icon size={18} color={s.color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 9, fontWeight: 800, padding: "4px 10px", borderRadius: 4, background: `${s.color}08`, color: s.color, display: "inline-block", marginBottom: 10, letterSpacing: "0.06em" }}>{s.badge}</div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "#8b92a5", lineHeight: 1.6 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem — Vaultline Suite */}
      <div style={{ padding: "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Part of the Vaultline Suite</h2>
          <p style={{ fontSize: 15, color: "#8b92a5", maxWidth: 560, margin: "0 auto" }}>FinanceOS works standalone or as part of a unified finance ecosystem. Bundle all three and save 15%.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { name: "Vaultline", desc: "Cloud-native treasury management. Real-time cash position, AI forecasting, multi-currency FX, and bank connectivity.", color: "#22d3ee", market: "Mid-market Treasury", price: "$499-$2,499/mo" },
            { name: "FinanceOS", desc: "AI-powered FP&A platform. Variance detection, scenario modeling, consolidation, and natural language querying.", color: "#60a5fa", market: "FP&A / Planning", price: "$599-$4,799/mo", current: true },
            { name: "Parallax", desc: "Aerospace supplier compliance OS. ITAR/EAR tracking, audit trails, supplier risk scoring, and regulatory mapping.", color: "#fbbf24", market: "Aerospace Compliance", price: "$799-$3,999/mo" },
          ].map(p => (
            <div key={p.name} style={{ background: "#111318", border: `1px solid ${p.current ? p.color + "40" : "#1e2230"}`, borderRadius: 16, padding: 24, position: "relative" }}>
              {p.current && <div style={{ position: "absolute", top: -8, right: 16, padding: "3px 10px", borderRadius: 4, background: p.color, fontSize: 9, fontWeight: 700, color: "#000" }}>CURRENT PRODUCT</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
                <span style={{ fontSize: 16, fontWeight: 800 }}>{p.name}</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: p.color, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.market}</div>
              <div style={{ fontSize: 13, color: "#8b92a5", lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</div>
              <div style={{ fontSize: 12, color: "#9ea5b8", fontWeight: 600 }}>{p.price}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: 28, background: "linear-gradient(135deg, rgba(96,165,250,0.06), rgba(167,139,250,0.06))", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Vaultline Suite Bundle</div>
          <div style={{ fontSize: 14, color: "#9ea5b8", marginBottom: 12 }}>Treasury + FP&A + Compliance — the only unified mid-market finance stack.</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>$2,799</span>
            <span style={{ fontSize: 14, color: "#8b92a5" }}>/mo · Save 15%</span>
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
            <p style={{ fontSize: 15, color: "#8b92a5", maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>FinanceOS is raising a seed round to accelerate product development, hire key engineering talent, and expand into enterprise mid-market. Join us as we build the operating system for modern finance.</p>

            {/* Funding Progress */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 32, marginBottom: 36 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#8b92a5", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Funding Progress</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>$1.2M</span>
                  <span style={{ fontSize: 14, color: "#8b92a5" }}>of $3M target</span>
                </div>
                <div style={{ width: "100%", height: 8, background: "#111318", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ width: "40%", height: "100%", background: "linear-gradient(90deg, #60a5fa, #a78bfa)", borderRadius: 4, transition: "width 1s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#3d4558" }}>
                  <span>40% committed</span>
                  <span>12 investors</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#8b92a5", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Use of Funds</div>
                {[
                  { label: "Engineering & Product", pct: 45, color: "#60a5fa" },
                  { label: "Go-to-Market", pct: 25, color: "#a78bfa" },
                  { label: "Infrastructure & Security", pct: 15, color: "#34d399" },
                  { label: "Operations & Legal", pct: 15, color: "#fbbf24" },
                ].map(f => (
                  <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: f.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#9ea5b8", flex: 1 }}>{f.label}</span>
                    <div style={{ width: 100, height: 4, background: "#111318", borderRadius: 2, overflow: "hidden" }}>
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
                <div key={t.label} style={{ background: "#0b0c10", border: "1px solid #1b1b20", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#3d4558", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{t.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: 2 }}>{t.value}</div>
                  <div style={{ fontSize: 10, color: "#8b92a5" }}>{t.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => window.open("mailto:investors@finance-os.app?subject=FinanceOS%20Seed%20Round%20Interest", "_blank")} style={{ fontSize: 14, padding: "14px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 6px 24px rgba(96,165,250,0.25)" }}>Request Investor Deck</button>
              <button onClick={() => window.open("mailto:investors@finance-os.app?subject=FinanceOS%20Meeting%20Request", "_blank")} style={{ fontSize: 14, padding: "14px 28px", borderRadius: 10, border: "1px solid #23232a", background: "transparent", color: "#9ea5b8", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Schedule a Call</button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ INVESTOR TRACTION — Why Now ═══ */}
      <div style={{ padding: "0 48px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Traction & market timing</h2>
          <p style={{ fontSize: 15, color: "#8b92a5", maxWidth: 560, margin: "0 auto" }}>The $50B EPM market is ripe for disruption. Legacy players charge 6-figure ACVs with 6-month implementations. We're 10x faster at 10x less.</p>
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
            <div key={k.label} style={{ background: "#111318", border: "1px solid #23232a", borderRadius: 16, padding: "20px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#8b92a5", marginBottom: 2 }}>{k.label}</div>
              <div style={{ fontSize: 10, color: "#34d399", fontWeight: 600 }}>{k.delta}</div>
            </div>
          ))}
        </div>

        {/* Market + Differentiators */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#111318", border: "1px solid #23232a", borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Market Opportunity</div>
            {[
              { metric: "Total Addressable Market", value: "$50B", note: "EPM/CPM global market" },
              { metric: "Serviceable Market", value: "$8.2B", note: "Mid-market FP&A SaaS" },
              { metric: "Target Segment", value: "$2.1B", note: "5-500 employee companies" },
              { metric: "Growth Rate", value: "14.2%", note: "CAGR 2024-2030" },
            ].map(m => (
              <div key={m.metric} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1b1b20" }}>
                <span style={{ flex: 1, fontSize: 12, color: "#9ea5b8" }}>{m.metric}</span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "#f0f2f5", marginRight: 10 }}>{m.value}</span>
                <span style={{ fontSize: 10, color: "#3d4558", width: 140 }}>{m.note}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#111318", border: "1px solid #23232a", borderRadius: 16, padding: 24 }}>
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
                <div style={{ fontSize: 11, color: "#8b92a5", lineHeight: 1.5 }}>{w.detail}</div>
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
            <p style={{ fontSize: 12, color: "#3d4558", lineHeight: 1.7, maxWidth: 240 }}>AI-powered financial planning for modern finance teams. Part of the Vaultline Suite.</p>
          </div>
          {[
            { title: "Product", links: ["Dashboard", "AI Copilot", "Forecasting", "Consolidation", "Integrations"] },
            { title: "Suite", links: ["Vaultline (Treasury)", "Parallax (Compliance)", "Bundle Pricing", "Suite Overview"] },
            { title: "Resources", links: ["Documentation", "API Reference", "Changelog", "Status Page"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security", "DPA"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8b92a5", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{col.title}</div>
              {col.links.map(link => (
                <div key={link} style={{ fontSize: 12, color: "#3d4558", marginBottom: 8, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#9ea5b8"}
                  onMouseLeave={e => e.currentTarget.style.color = "#3d4558"}
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
      {authModal && <AuthModal mode={authModal} onAuth={handleAuth} onClose={() => setAuthModal(null)} />}

      {/* Privacy Pipeline — Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════
function FinanceOSApp() {
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
  const [notifRead, setNotifRead] = useState(new Set());
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
    const handleSession = async (session) => {
      if (!mounted || !session?.user) return;
      try {
        const u = session.user;
        setUser(prev => ({ ...prev, name: u.user_metadata?.full_name || u.email?.split("@")[0] || "User", email: u.email || "" }));
        setLoggedIn(true);
        // Clean up URL hash after processing OAuth tokens
        if (typeof window !== "undefined" && window.location.hash?.includes("access_token")) {
          window.history.replaceState(null, "", window.location.pathname);
        }
        // Call verify-session to ensure user+org exist in public tables
        // This auto-provisions for users who signed up before onboarding write-through
        try {
          const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-session`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`,
              "apikey": SUPABASE_KEY,
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.org?.plan && data.org.plan !== "trial") {
              setUser(prev => ({ ...prev, plan: data.org.plan }));
            }
            if (data.org?.name) {
              setUser(prev => ({ ...prev, orgName: data.org.name }));
            }
          }
        } catch (e) { console.warn("verify-session:", e); }
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
  // Restore saved theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("financeos-theme");
      if (saved === "dark" || saved === "light") { setMode(saved); setAutoTheme(false); }
    } catch {}
  }, []);
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
    setAutoTheme(false);
    setMode(prev => {
      const next = prev === "dark" ? "light" : "dark";
      try { localStorage.setItem("financeos-theme", next); } catch {}
      return next;
    });
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

  // Keyboard shortcuts
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") { e.preventDefault(); setSidebarCollapsed(prev => !prev); }
      if (e.key === "Escape") { setCmdOpen(false); setDrawerKpi(null); setNotifOpen(false); setShortcutsOpen(false); }
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") { setShortcutsOpen(true); }
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
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
        /* GPU acceleration for animated elements */
        [style*="animation"], [style*="transition"] { will-change: transform, opacity; }
        /* Layout containment for sidebar + content area */
        [data-sidebar] { contain: layout style; }
        [data-content-area] { contain: layout style; }
        /* Reduce paint for fixed overlays */
        [style*="position: fixed"] { will-change: opacity; }
        /* Premium scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.15); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.3); }
        /* Selection color */
        ::selection { background: rgba(91,156,245,0.2); color: inherit; }
        /* Details/summary for FAQ */
        details summary::-webkit-details-marker { display: none; }
        details summary { list-style: none; }
        details[open] summary svg { transform: rotate(180deg); }
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        /* Premium input/button transitions */
        input, select, textarea { transition: border-color 0.2s, box-shadow 0.2s; }
        button { transition: all 0.15s cubic-bezier(0.22,1,0.36,1); }
        /* Card hover lift default */
        [data-card]:hover { transform: translateY(-2px); }
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
        /* Typography system — font rendering + numeric alignment */
        body { line-height: 1.5; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
        h1, h2, h3, h4, h5, h6 { line-height: 1.15; letter-spacing: -0.02em; font-weight: 800; }
        p { line-height: 1.65; }
        /* Default line-height for body text sizes (fills gaps where inline styles omit it) */
        div, span, td, th, label, li { line-height: 1.45; }
        /* Tabular numbers for all monospace and table contexts */
        table, [style*="JetBrains"], code, pre, kbd { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
        td, th { line-height: 1.4; }
        /* Button/input inherit DM Sans explicitly */
        button, input, select, textarea { font-family: 'DM Sans', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; letter-spacing: -0.005em; }
        /* Large text tightening — applied via CSS since many inline styles omit it */
        [style*="fontSize: 24"], [style*="fontSize: 26"], [style*="fontSize: 28"],
        [style*="fontSize: 30"], [style*="fontSize: 36"], [style*="fontSize: 40"],
        [style*="fontSize: 56"], [style*="fontSize: 60"] { letter-spacing: -0.03em; }
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
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: c.text, letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>Finance<span style={{ fontWeight: 400, opacity: 0.6 }}>OS</span></span>
                <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 5px", borderRadius: 3, background: user.plan === "demo" ? c.amberDim : `${c.green}12`, color: user.plan === "demo" ? c.amber : c.green, letterSpacing: "0.06em", textTransform: "uppercase" }}>{user.plan === "demo" ? "DEMO" : user.plan || "PRO"}</span>
              </div>
              <div style={{ fontSize: 9, color: c.textFaint, marginTop: 2, whiteSpace: "nowrap" }}>Acme SaaS Corp · FY2025</div>
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
                  <div style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: c.textFaint, padding: "18px 18px 6px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{item.section}</span>
                    <div style={{ flex: 1, height: 1, background: c.borderSub }} />
                  </div>
                )}
                {showSection && sidebarCollapsed && <div style={{ height: 8 }} />}
                <div onClick={() => navigate(item.id)} title={sidebarCollapsed ? item.label : undefined} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: sidebarCollapsed ? "10px 0" : "10px 16px",
                  margin: sidebarCollapsed ? "1px 8px" : "1px 10px",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400, borderRadius: 10,
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
                background: `linear-gradient(135deg, ${c.green}, ${c.cyan})`, fontSize: 10, fontWeight: 800, color: "#fff",
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
            <div style={{ width: 30, height: 30, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${c.green}, ${c.cyan})`, fontSize: 10, fontWeight: 800, color: "#fff", cursor: "pointer" }}>{(user.name || "G").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "G"}</div>
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
        {/* Ambient gradient orbs — atmospheric depth */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0, transition: "opacity 0.6s ease" }}>
          <div style={{ position: "absolute", top: "-25%", right: "-12%", width: "65%", height: "65%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}${mode === "dark" ? "06" : "03"} 0%, transparent 60%)`, filter: "blur(100px)", transition: "background 0.8s ease" }} />
          <div style={{ position: "absolute", bottom: "-20%", left: "-8%", width: "55%", height: "55%", borderRadius: "50%", background: `radial-gradient(circle, ${c.purple}${mode === "dark" ? "05" : "02"} 0%, transparent 60%)`, filter: "blur(100px)", transition: "background 0.8s ease" }} />
          <div style={{ position: "absolute", top: "30%", left: "40%", width: "30%", height: "30%", borderRadius: "50%", background: `radial-gradient(circle, ${c.green}${mode === "dark" ? "03" : "01"} 0%, transparent 60%)`, filter: "blur(120px)", transition: "background 0.8s ease" }} />
        </div>

        {/* Demo data banner — ENV 7 */}
        {user.plan === "demo" && <DemoBanner c={c} onNav={navigate} onUpgrade={() => setShowPlanPicker(true)} />}

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
              {(() => {
                const NOTIFS = [
                  { id: 0, text: "Revenue variance detected: +$2.09M above budget", time: "2 min ago", nav: "copilot", color: c.green },
                  { id: 1, text: "S&M spend $730K over — review recommended", time: "12 min ago", nav: "copilot", color: c.amber },
                  { id: 2, text: "February close: 3 tasks still pending", time: "1 hr ago", nav: "close", color: c.accent },
                  { id: 3, text: "Model retrained — MAPE improved to 2.9%", time: "3 hr ago", nav: "forecast", color: c.purple },
                ];
                const unread = NOTIFS.filter(n => !notifRead.has(n.id)).length;
                return (<>
              <div style={{ cursor: "pointer", position: "relative" }} role="button" aria-label={`${unread} notifications`} tabIndex={0} onClick={() => setNotifOpen(!notifOpen)} onKeyDown={e => e.key === "Enter" && setNotifOpen(!notifOpen)}>
                <Bell size={18} color={notifOpen ? c.accent : c.textDim} />
                {unread > 0 && <div style={{ position: "absolute", top: -3, right: -4, minWidth: 14, height: 14, borderRadius: 7, background: c.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff", border: `2px solid ${c.bg2}` }}>{unread}</div>}
              </div>
              {notifOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 340, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.3)", overflow: "hidden", zIndex: 200, animation: "cmdIn 0.15s cubic-bezier(0.22,1,0.36,1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: `1px solid ${c.borderSub}` }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Notifications {unread > 0 && <span style={{ fontSize: 10, color: c.textDim, fontWeight: 500 }}>· {unread} new</span>}</span>
                    {unread > 0 && <span onClick={() => { setNotifRead(new Set(NOTIFS.map(n => n.id))); toast("All marked as read", "success"); }} style={{ fontSize: 10, color: c.accent, fontWeight: 600, cursor: "pointer" }}>Mark all read</span>}
                  </div>
                  {NOTIFS.map(n => {
                    const isRead = notifRead.has(n.id);
                    return (
                    <div key={n.id} onClick={() => { setNotifRead(prev => new Set([...prev, n.id])); setNotifOpen(false); navigate(n.nav); }} style={{
                      display: "flex", gap: 10, padding: "12px 16px", cursor: "pointer", borderBottom: `1px solid ${c.borderSub}`, transition: "background 0.1s",
                      opacity: isRead ? 0.5 : 1,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: isRead ? c.textFaint : n.color, marginTop: 5, flexShrink: 0, transition: "background 0.2s" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: isRead ? c.textDim : c.text, lineHeight: 1.5 }}>{n.text}</div>
                        <div style={{ fontSize: 10, color: c.textFaint, marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
                </>);
              })()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div key={viewLoading ? "loading" : view} data-content-area className="view-fade" style={{ flex: 1, overflow: "auto", background: "transparent", position: "relative", zIndex: 1 }}>
          {/* Ambient glow orbs — gives glass cards something to blur against */}
          <div style={{ position: "fixed", top: "10%", left: "20%", width: "40%", height: "40%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}06 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "15%", right: "10%", width: "35%", height: "35%", borderRadius: "50%", background: `radial-gradient(circle, ${c.purple}05 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", top: "50%", right: "35%", width: "25%", height: "25%", borderRadius: "50%", background: `radial-gradient(circle, ${c.green}04 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
          {viewLoading ? <LoadingSkeleton c={c} /> : (<>
          {view === "dashboard" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><DashboardView c={c} onNav={navigate} toast={toast} onDrawer={setDrawerKpi} userName={user.name} period={period} /></SectionBoundary>}
          {view === "copilot" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><CopilotView c={c} toast={toast} /></SectionBoundary>}
          {view === "pnl" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><PnlView c={c} onNav={navigate} toast={toast} /></SectionBoundary>}
          {view === "forecast" && <SectionBoundary bg={c.surface} borderColor={c.border} textColor={c.textDim}><ForecastView c={c} toast={toast} /></SectionBoundary>}
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
      {shortcutsOpen && (
        <div onClick={() => setShortcutsOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 400, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s cubic-bezier(0.22,1,0.36,1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.text }}>Keyboard Shortcuts</div>
              <div onClick={() => setShortcutsOpen(false)} style={{ cursor: "pointer", color: c.textDim }}><X size={16} /></div>
            </div>
            {[
              { keys: ["⌘", "K"], label: "Open command palette" },
              { keys: ["?"], label: "Show this help" },
              { keys: ["Esc"], label: "Close modals and drawers" },
              { keys: ["⌘", "B"], label: "Toggle sidebar" },
              { keys: ["1-9"], label: "Navigate to view (by position)" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}` }}>
                <span style={{ fontSize: 12, color: c.textSec }}>{s.label}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {s.keys.map(k => (
                    <kbd key={k} style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, color: c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{k}</kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} c={c} />
      {/* ENV 5: Desktop Platform */}
      <OfflineIndicator c={c} />
      <PWAInstallPrompt c={c} />
      {/* Plan Picker — shows after signup */}
      {showPlanPicker && <PlanPicker c={c} userName={user.name} isDemo={user.plan === "demo"} onSkip={() => setShowPlanPicker(false)} onSelect={(plan) => {
        // SECURITY: Plan is set to 'pending:<planName>' until payment is verified
        // The onboarding wizard only runs after verification succeeds
        setUser(prev => ({ ...prev, plan: `pending:${plan}` }));
        setShowPlanPicker(false);
        setShowOnboarding(true);
      }} />}
      {showOnboarding && <OnboardingWizard c={c} userName={user.name} planStatus={user.plan} onComplete={async (org) => {
        const planName = user.plan?.startsWith("pending:") ? user.plan.replace("pending:", "") : user.plan;
        // Server-side org creation via Edge Function (org data never touches client Supabase)
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            await fetch(`${SUPABASE_URL}/functions/v1/onboard`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`,
                "apikey": SUPABASE_KEY,
              },
              body: JSON.stringify({
                orgName: org.name || "",
                industry: org.industry || "",
                erp: org.erp || "",
                plan: planName || "trial",
              }),
            });
          }
        } catch (err) { console.error("Onboarding error:", err); }
        setUser(prev => ({ ...prev, plan: planName }));
        setShowOnboarding(false);
        toast(`Welcome to FinanceOS${org.name ? ` — ${org.name}` : ""}`, "success");
      }} />}
    </div>
  );
}

export default function FinanceOS() {
  return <AppErrorBoundary><FinanceOSApp /></AppErrorBoundary>;
}
