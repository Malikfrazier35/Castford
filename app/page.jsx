"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo, memo, Component } from "react";
import { Line, Area, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LayoutDashboard, TrendingUp, MessageSquare, FileText, Layers, GitBranch, CheckSquare, Plug, Brain, Search, Bell, Sun, Moon, ChevronDown, ChevronRight, ArrowUpRight, ArrowDownRight, Zap, Shield, Users, DollarSign, Target, Activity, Send, Sparkles, Settings, LogOut, X, Check, Globe, Eye, Cpu, Star, Lock, RefreshCw, Download, BarChart3 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ── SUPABASE CLIENT ──────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    flowType: "implicit",
  },
});
if (typeof window !== "undefined") window.__supabase = supabase;

// UTM attribution helper — captures campaign data for lead forms
const getUtmData = () => {
  if (typeof window === "undefined") return {};
  try {
    const session = JSON.parse(sessionStorage.getItem("fos_utm") || "{}");
    const first = JSON.parse(localStorage.getItem("fos_first_touch") || "{}");
    return { ...first, ...session };
  } catch { return {}; }
};

// ═══════════════════════════════════════════════════════════════
// FINANCEOS — React Production Build
// Design: Zinc-black dark + optional light, DM Sans + JetBrains Mono
// Charts: Recharts (interactive hover, zoom)
// AI: Claude API with visible reasoning
// ═══════════════════════════════════════════════════════════════

const THEME = {
  dark: {
    bg: "#06080c", bg2: "#0a0c12", surface: "#10131a", surfaceAlt: "#161a24",
    // Glassmorphism surfaces — deeper blur, higher contrast
    glass: "rgba(16,19,26,0.78)", glassBorder: "rgba(255,255,255,0.07)", glassHighlight: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 0 0.5px rgba(255,255,255,0.07)",
    glassBlur: "blur(24px) saturate(1.5)",
    border: "#1a1f2e", borderSub: "#141825", borderBright: "#282e40",
    text: "#eef0f6", textSec: "#9ea5b8", textDim: "#636d84", textFaint: "#3d4558",
    accent: "#5b9cf5", accentDim: "rgba(91,156,245,0.07)", accentMid: "rgba(91,156,245,0.14)",
    green: "#3dd9a0", greenDim: "rgba(61,217,160,0.07)",
    red: "#f06b6b", redDim: "rgba(240,107,107,0.07)",
    amber: "#f5b731", amberDim: "rgba(245,183,49,0.07)",
    purple: "#a181f7", purpleDim: "rgba(161,129,247,0.07)",
    cyan: "#2dd4d0",
    // Chart colors — richer palette for data viz
    chart1: "#5b9cf5", chart2: "#3dd9a0", chart3: "#a181f7", chart4: "#f5b731", chart5: "#f06b6b", chart6: "#2dd4d0",
    chartGrid: "#141925", chartAxis: "#3d4558",
    // Depth system — cinematic
    shadow1: "0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)",
    shadow2: "0 4px 20px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.25)",
    shadow3: "0 16px 48px rgba(0,0,0,0.5), 0 6px 16px rgba(0,0,0,0.3)",
    cardGlow: "0 0 0 1px rgba(91,156,245,0.05), 0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
    cardHoverGlow: "0 0 0 1px rgba(91,156,245,0.15), 0 8px 40px rgba(91,156,245,0.08), 0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
    sidebarBg: "linear-gradient(180deg, #0a0c12 0%, #060810 100%)",
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
  componentDidCatch(error) {
    if (typeof window !== "undefined") {
      try { console.warn(`[FinanceOS] ${this.props.name || "Section"} error:`, error?.message); } catch {}
    }
  }
  render() {
    if (this.state.hasError) {
      const canRetry = this.state.retries < 3;
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 32, minHeight: 120, borderRadius: 12, textAlign: "center",
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

// ── CHART PANEL — per-chart error boundary + premium glass container ──
// Wraps each chart card so a single chart crash doesn't kill the whole view
class ChartPanel extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) {
    if (typeof window !== "undefined") {
      try { console.warn(`[FinanceOS] Chart "${this.props.title}" error:`, error?.message); } catch {}
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: this.props.glass || "rgba(255,255,255,0.02)", borderRadius: 14, padding: "28px 24px",
          border: `1px dashed ${this.props.borderColor || "#1e2230"}`, minHeight: 200,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: this.props.textColor || "#8b92a5", marginBottom: 4 }}>
            {this.props.title || "Chart"} failed to render
          </div>
          <div style={{ fontSize: 10, color: "#3d4558", marginBottom: 10 }}>Other charts are unaffected.</div>
          <button onClick={() => this.setState({ hasError: false })}
            style={{ fontSize: 10, padding: "5px 14px", borderRadius: 6, background: this.props.accentColor || "#60a5fa", color: "#fff", fontWeight: 700, fontFamily: "inherit", border: "none", cursor: "pointer" }}>
            Retry
          </button>
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
    console.error("[FinanceOS] Unhandled error:", error?.message);
    try {
      // Fire-and-forget error report via Supabase client (no raw REST/keys)
      if (typeof supabase !== "undefined") {
        supabase.from("audit_log").insert({
          action: "client.error", resource_type: "app",
          metadata: { message: error?.message, stack: error?.stack?.slice(0, 500) },
        }).then(() => {}).catch(() => {});
      }
    } catch {}
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090b", fontFamily: "'Manrope', sans-serif" }}>
          <div style={{ textAlign: "center", maxWidth: 400, padding: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: "linear-gradient(135deg, #f06b6b20, #f06b6b08)", border: "1px solid #f06b6b20", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 24 }}>!</div>
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
          animation: "toastIn 0.3s ease", backdropFilter: "blur(12px)",
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
  // P&L Financial Summary
  "Total Revenue": { title: "Total Revenue", value: "$51.2M", trend: [38,40,42,44,46,48,50,51.2], details: [
    { label: "Subscription", value: "$46.4M", color: "accent" }, { label: "Professional Services", value: "$3.2M", color: "green" },
    { label: "Usage / AI Module", value: "$1.6M", color: "purple" }, { label: "YoY Growth", value: "+44.7%", color: "green" },
    { label: "QoQ Growth", value: "+8.2%", color: "green" }, { label: "vs Budget", value: "+$2.09M", color: "green" },
    { label: "Annualized Run Rate", value: "$68.3M", color: "accent" }, { label: "Forecast Accuracy", value: "96.8%", color: "green" },
  ]},
  "Gross Profit": { title: "Gross Profit", value: "$43.4M", trend: [30,32,34,36,38,40,42,43.4], details: [
    { label: "Revenue", value: "$51.2M", color: "text" }, { label: "Total COGS", value: "$7.8M", color: "red" },
    { label: "Cloud Infrastructure", value: "$4.8M", color: "amber" }, { label: "Customer Success", value: "$2.2M", color: "text" },
    { label: "Support & Onboarding", value: "$0.8M", color: "text" }, { label: "Gross Margin", value: "84.7%", color: "green" },
    { label: "Benchmark (SaaS p75)", value: "78%", color: "text" }, { label: "Margin Trend", value: "+2.1pp", color: "green" },
  ]},
  "Total OpEx": { title: "Operating Expenses", value: "$39.6M", trend: [28,30,31,33,35,36,38,39.6], details: [
    { label: "R&D — Engineering", value: "$14.4M", color: "accent" }, { label: "R&D — Product & ML", value: "$4.9M", color: "purple" },
    { label: "Sales", value: "$8.9M", color: "amber" }, { label: "Marketing", value: "$4.3M", color: "cyan" },
    { label: "Revenue Operations", value: "$2.2M", color: "text" }, { label: "G&A (Finance, Legal, IT)", value: "$4.9M", color: "text" },
    { label: "OpEx / Revenue", value: "77.3%", color: "amber" }, { label: "vs Budget", value: "+$0.2M over", color: "red" },
  ]},
  "EBITDA": { title: "EBITDA", value: "$3.8M", trend: [-2,-1,0,0.5,1.2,2,3,3.8], details: [
    { label: "Revenue", value: "$51.2M", color: "text" }, { label: "Gross Profit", value: "$43.4M", color: "green" },
    { label: "Total OpEx", value: "$39.6M", color: "amber" }, { label: "EBITDA Margin", value: "7.4%", color: "green" },
    { label: "Rule of 40", value: "52.1", color: "accent" }, { label: "Improvement QoQ", value: "+$1.2M", color: "green" },
    { label: "Path to Profitability", value: "Q3 2025", color: "accent" }, { label: "Free Cash Flow", value: "$2.1M", color: "green" },
  ]},
  // Consolidation entities
  "Acme US": { title: "Acme US — Domestic", value: "$38.9M", trend: [28,30,32,34,36,37,38,38.9], details: [
    { label: "Revenue", value: "$38.9M", color: "accent" }, { label: "EBITDA", value: "$3.1M", color: "green" },
    { label: "Headcount", value: "218", color: "text" }, { label: "Rev / Head", value: "$178K", color: "green" },
    { label: "IC Eliminations", value: "-$1.2M", color: "amber" }, { label: "Currency", value: "USD", color: "text" },
    { label: "Close Status", value: "Closed", color: "green" }, { label: "% of Consolidated", value: "76.1%", color: "accent" },
  ]},
  "Acme EU": { title: "Acme EU — Europe", value: "$8.7M", trend: [4,5,5.5,6,6.5,7,8,8.7], details: [
    { label: "Revenue (EUR)", value: "€7.97M", color: "accent" }, { label: "Revenue (USD)", value: "$8.65M", color: "text" },
    { label: "EBITDA", value: "$520K", color: "green" }, { label: "Headcount", value: "62", color: "text" },
    { label: "FX Impact", value: "-$142K", color: "red" }, { label: "EUR/USD Rate", value: "1.087", color: "text" },
    { label: "Close Status", value: "In Review", color: "amber" }, { label: "% of Consolidated", value: "16.9%", color: "purple" },
  ]},
  "Acme APAC": { title: "Acme APAC — Asia Pacific", value: "$3.6M", trend: [1,1.5,2,2.2,2.5,2.8,3.2,3.6], details: [
    { label: "Revenue (SGD)", value: "S$4.85M", color: "accent" }, { label: "Revenue (USD)", value: "$3.62M", color: "text" },
    { label: "EBITDA", value: "$140K", color: "green" }, { label: "Headcount", value: "32", color: "text" },
    { label: "FX Impact", value: "+$38K", color: "green" }, { label: "SGD/USD Rate", value: "0.746", color: "text" },
    { label: "Close Status", value: "Pending", color: "amber" }, { label: "% of Consolidated", value: "7.1%", color: "cyan" },
  ]},
  // Investor metrics
  "CAC Payback": { title: "CAC Payback Period", value: "14 mo", trend: [22,20,18,17,16,15,14.5,14], details: [
    { label: "Fully-loaded CAC", value: "$28.4K", color: "amber" }, { label: "Monthly ARPU", value: "$2.03K", color: "text" },
    { label: "Gross Margin", value: "84.7%", color: "green" }, { label: "Blended Payback", value: "14 months", color: "accent" },
    { label: "Enterprise Payback", value: "11 months", color: "green" }, { label: "SMB Payback", value: "19 months", color: "amber" },
    { label: "Benchmark (good)", value: "<18 months", color: "text" }, { label: "Trend", value: "Improving", color: "green" },
  ]},
  "LTV/CAC": { title: "LTV to CAC Ratio", value: "4.2x", trend: [2.5,2.8,3.0,3.2,3.5,3.8,4.0,4.2], details: [
    { label: "Customer LTV", value: "$119K", color: "accent" }, { label: "CAC", value: "$28.4K", color: "amber" },
    { label: "Avg Contract Length", value: "3.2 years", color: "text" }, { label: "NDR", value: "118%", color: "green" },
    { label: "Enterprise LTV/CAC", value: "5.8x", color: "green" }, { label: "SMB LTV/CAC", value: "2.6x", color: "amber" },
    { label: "Benchmark (healthy)", value: ">3.0x", color: "text" }, { label: "Trend", value: "+0.4x YoY", color: "green" },
  ]},
  // Forecast metrics
  "Base Forecast": { title: "Base Case Revenue Forecast", value: "$62.8M", trend: [48,50,52,54,56,58,60,62.8], details: [
    { label: "Current Run Rate", value: "$51.2M", color: "accent" }, { label: "Implied Growth", value: "+22.6%", color: "green" },
    { label: "Subscription Rev", value: "$56.4M", color: "accent" }, { label: "Services Rev", value: "$4.2M", color: "purple" },
    { label: "AI Module Rev", value: "$2.2M", color: "cyan" }, { label: "Model Confidence", value: "96.8%", color: "green" },
    { label: "MAPE", value: "3.2%", color: "green" }, { label: "Last Retrained", value: "6 hours ago", color: "text" },
  ]},
  "Pipeline": { title: "Pipeline Analysis", value: "$42M", trend: [28,30,32,34,36,38,40,42], details: [
    { label: "Weighted Pipeline", value: "$42M", color: "accent" }, { label: "Unweighted Total", value: "$98M", color: "text" },
    { label: "Win Rate (Blended)", value: "38%", color: "green" }, { label: "Enterprise Pipeline", value: "$28M", color: "accent" },
    { label: "Mid-Market Pipeline", value: "$10M", color: "purple" }, { label: "SMB Pipeline", value: "$4M", color: "cyan" },
    { label: "Avg Deal Size", value: "$142K", color: "text" }, { label: "Avg Sales Cycle", value: "48 days", color: "amber" },
  ]},
  // Revenue metrics
  "Revenue (YTD)": { title: "Revenue Year-to-Date", value: "$51.2M", trend: [38,40,42,44,46,48,50,51.2], details: [
    { label: "Subscription", value: "$46.4M", color: "accent" }, { label: "Professional Services", value: "$3.2M", color: "purple" },
    { label: "Usage / AI Module", value: "$1.6M", color: "cyan" }, { label: "YoY Growth", value: "+44.7%", color: "green" },
    { label: "vs Budget", value: "+$2.09M", color: "green" }, { label: "Annualized", value: "$68.3M", color: "accent" },
  ]},
  "Net Income": { title: "Net Income", value: "$3.8M", trend: [-2,-1,0,0.5,1.2,2,3,3.8], details: [
    { label: "Revenue", value: "$51.2M", color: "text" }, { label: "Gross Profit", value: "$43.4M", color: "green" },
    { label: "Operating Expenses", value: "$39.6M", color: "amber" }, { label: "Net Margin", value: "7.4%", color: "green" },
    { label: "Improvement QoQ", value: "+$1.2M", color: "green" }, { label: "Free Cash Flow", value: "$2.1M", color: "green" },
  ]},
  "Accounts": { title: "Chart of Accounts", value: "18", trend: [10,12,14,15,16,17,17,18], details: [
    { label: "Revenue Accounts", value: "3", color: "green" }, { label: "COGS Accounts", value: "3", color: "amber" },
    { label: "OpEx Accounts", value: "9", color: "accent" }, { label: "Other Accounts", value: "3", color: "text" },
    { label: "Total Transactions", value: "162", color: "purple" }, { label: "Months Loaded", value: "9", color: "cyan" },
  ]},
};

const DetailDrawer = ({ kpi, c, onClose }) => {
  const data = DETAIL_DATA[kpi] || DETAIL_DATA["ARR"];
  const colorMap = { green: c.green, red: c.red, amber: c.amber, accent: c.accent, text: c.text, purple: c.purple, cyan: c.cyan };
  
  // Compute max value for proportional bars
  const numericValues = data.details.map(d => {
    const num = parseFloat(d.value.replace(/[$%MKxmo,+\s]/g, ""));
    return isNaN(num) ? 0 : Math.abs(num);
  });
  const maxVal = Math.max(...numericValues, 1);

  return (
    <>
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", animation: "fadeIn 0.15s" }} />
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 420, background: c.surface, borderLeft: `1px solid ${c.border}`,
      zIndex: 1000, boxShadow: `-16px 0 60px rgba(0,0,0,0.3)`, display: "flex", flexDirection: "column",
      animation: "drawerIn 0.25s ease",
    }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${c.borderSub}`, position: "relative" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c.accent}40, ${c.purple}20, transparent)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${c.accent}18, ${c.purple}10)`, border: `1px solid ${c.accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={15} color={c.accent} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>{data.title}</div>
              <div style={{ fontSize: 10, color: c.textFaint, marginTop: 1 }}>Click any row to drill deeper</div>
            </div>
          </div>
          <div onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", border: `1px solid ${c.borderSub}` }}
            onMouseEnter={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.borderColor = c.border; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = c.borderSub; }}
          ><X size={14} color={c.textDim} /></div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "0" }}>
        {/* Hero value + sparkline */}
        <div style={{ padding: "24px 24px 20px", background: `linear-gradient(180deg, ${c.accent}04 0%, transparent 100%)` }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: c.accent, letterSpacing: "-0.04em", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>{data.value}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {data.details.slice(0, 2).map(d => {
              const clr = colorMap[d.color] || c.text;
              return (
                <span key={d.label} style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: `${clr}10`, color: clr, border: `1px solid ${clr}12` }}>
                  {d.label}: {d.value}
                </span>
              );
            })}
          </div>
          <div style={{ borderRadius: 10, padding: "2px 0", overflow: "hidden" }}>
            <Spark data={data.trend} color={c.accent} width={360} height={56} />
          </div>
        </div>

        {/* Breakdown section */}
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingTop: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint }}>Breakdown</div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: c.textDim, padding: "2px 8px", borderRadius: 4, background: c.surfaceAlt }}>{data.details.length} metrics</span>
          </div>

          {data.details.map((d, i) => {
            const clr = colorMap[d.color] || c.text;
            const numVal = parseFloat(d.value.replace(/[$%MKxmo,+\s]/g, ""));
            const isNeg = d.value.startsWith("-");
            const isPct = d.value.endsWith("%");
            const pctVal = isPct ? parseFloat(d.value) : null;
            const barWidth = !isNaN(numVal) && maxVal > 0 ? Math.min((Math.abs(numVal) / maxVal) * 100, 100) : 0;
            const isMoney = d.value.includes("$");
            const showBar = (isMoney || isPct) && barWidth > 3;

            return (
            <div key={d.label} style={{ padding: "10px 10px", margin: "0 -10px", borderRadius: 10, transition: "all 0.2s", cursor: "default", borderBottom: i < data.details.length - 1 ? `1px solid ${c.borderSub}` : "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${clr}06`; e.currentTarget.style.transform = "translateX(2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showBar ? 6 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 3, background: clr, opacity: 0.7, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: c.textSec, fontWeight: 500 }}>{d.label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: clr, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.01em" }}>{d.value}</span>
              </div>
              {showBar && (
                <div style={{ height: 4, background: c.bg2, borderRadius: 2, overflow: "hidden", marginLeft: 16 }}>
                  <div style={{ width: `${barWidth}%`, height: "100%", background: `linear-gradient(90deg, ${clr}60, ${clr})`, borderRadius: 2, transition: "width 0.4s ease" }} />
                </div>
              )}
            </div>
            );
          })}

          {/* Distribution mini-chart */}
          {data.details.length >= 3 && (() => {
            const moneyItems = data.details.filter(d => d.value.includes("$") && !d.value.startsWith("-"));
            if (moneyItems.length < 2) return null;
            const total = moneyItems.reduce((a, d) => a + (parseFloat(d.value.replace(/[$MK,+\s]/g, "")) || 0), 0);
            if (total <= 0) return null;
            return (
              <div style={{ marginTop: 20, padding: "16px 16px", background: c.surfaceAlt, borderRadius: 12, border: `1px solid ${c.borderSub}` }}>
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: c.textFaint, marginBottom: 10 }}>Distribution</div>
                <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2 }}>
                  {moneyItems.map((d, i) => {
                    const val = parseFloat(d.value.replace(/[$MK,+\s]/g, "")) || 0;
                    const pct = (val / total) * 100;
                    const colors = [c.accent, c.green, c.purple, c.cyan, c.amber];
                    return <div key={i} style={{ width: `${pct}%`, height: "100%", background: colors[i % colors.length], borderRadius: i === 0 ? "4px 0 0 4px" : i === moneyItems.length - 1 ? "0 4px 4px 0" : 0, transition: "width 0.4s" }} />;
                  })}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                  {moneyItems.map((d, i) => {
                    const val = parseFloat(d.value.replace(/[$MK,+\s]/g, "")) || 0;
                    const colors = [c.accent, c.green, c.purple, c.cyan, c.amber];
                    return (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: c.textDim }}>
                        <span style={{ width: 6, height: 6, borderRadius: 2, background: colors[i % colors.length] }} />
                        {d.label.split(" ")[0]} <span style={{ fontWeight: 700, color: colors[i % colors.length], fontFamily: "'JetBrains Mono', monospace" }}>{((val / total) * 100).toFixed(0)}%</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button onClick={() => { onClose(); }} style={{ flex: 1, fontSize: 11, padding: "10px 0", borderRadius: 10, border: `1px solid ${c.accent}30`, background: `${c.accent}06`, color: c.accent, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${c.accent}12`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${c.accent}06`; }}>
              <Sparkles size={12} /> Ask AI About This
            </button>
            <button onClick={onClose} style={{ flex: 1, fontSize: 11, padding: "10px 0", borderRadius: 10, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; }}>
              Export Data
            </button>
          </div>
        </div>
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
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query ? CMD_ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : CMD_ITEMS;
  useEffect(() => { setActiveIdx(0); }, [query]);
  let lastSection = "";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "15vh", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14,
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)", overflow: "hidden",
        animation: "cmdIn 0.15s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${c.borderSub}` }}>
          <Search size={16} color={c.textDim} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search views, ask AI, run commands..."
            onKeyDown={e => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && filtered.length > 0) { onSelect(filtered[activeIdx] || filtered[0]); onClose(); }
              if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(prev => Math.min(prev + 1, filtered.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(prev => Math.max(prev - 1, 0)); }
            }}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: c.text, fontSize: 14, fontFamily: "inherit" }}
          />
          <kbd style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: c.bg2, border: `1px solid ${c.borderSub}`, color: c.textDim }}>ESC</kbd>
        </div>
        <div style={{ maxHeight: 340, overflow: "auto", padding: "8px 0" }}>
          {filtered.map((item, idx) => {
            const showSection = item.section !== lastSection;
            lastSection = item.section;
            const Icon = item.icon;
            const isActive = idx === activeIdx;
            return (
              <div key={item.id}>
                {showSection && <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint, padding: "8px 18px 4px" }}>{item.section}</div>}
                <div onClick={() => { onSelect(item); onClose(); }}
                  onMouseEnter={() => setActiveIdx(idx)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 18px", cursor: "pointer", fontSize: 13,
                    color: isActive ? c.text : c.textSec, transition: "all 0.08s",
                    background: isActive ? c.accentDim : "transparent",
                    borderLeft: isActive ? `2px solid ${c.accent}` : "2px solid transparent",
                  }}
                >
                  <Icon size={15} strokeWidth={isActive ? 2 : 1.5} color={isActive ? c.accent : undefined} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isActive && <span style={{ fontSize: 9, color: c.textFaint }}>↵</span>}
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
  { month: "Jul", actual: 6800, budget: 6500, forecast: null, qoq: null, yoy: 5200, bear: null, bull: null, newBiz: 2040, expansion: 3400, churn: -340, services: 1700 },
  { month: "Aug", actual: 7100, budget: 6800, forecast: null, qoq: 4.4, yoy: 5500, bear: null, bull: null, newBiz: 2130, expansion: 3620, churn: -380, services: 1730 },
  { month: "Sep", actual: 7600, budget: 7100, forecast: null, qoq: 7.0, yoy: 5900, bear: null, bull: null, newBiz: 2280, expansion: 3800, churn: -350, services: 1870 },
  { month: "Oct", actual: 8000, budget: 7400, forecast: null, qoq: 5.3, yoy: 6200, bear: null, bull: null, newBiz: 2400, expansion: 4000, churn: -420, services: 2020 },
  { month: "Nov", actual: 8500, budget: 7700, forecast: null, qoq: 6.3, yoy: 6600, bear: null, bull: null, newBiz: 2550, expansion: 4250, churn: -390, services: 2090 },
  { month: "Dec", actual: 8800, budget: 8000, forecast: null, qoq: 3.5, yoy: 6900, bear: null, bull: null, newBiz: 2640, expansion: 4400, churn: -410, services: 2170 },
  { month: "Jan", actual: null, budget: 8300, forecast: 9100, qoq: null, yoy: 7200, bear: 8600, bull: 9500, newBiz: null, expansion: null, churn: null, services: null },
  { month: "Feb", actual: null, budget: 8600, forecast: 9400, qoq: null, yoy: 7500, bear: 8800, bull: 9900, newBiz: null, expansion: null, churn: null, services: null },
  { month: "Mar", actual: null, budget: 8900, forecast: 9700, qoq: null, yoy: 7800, bear: 9100, bull: 10300, newBiz: null, expansion: null, churn: null, services: null },
  { month: "Apr", actual: null, budget: 9200, forecast: 9900, qoq: null, yoy: 8100, bear: 9300, bull: 10600, newBiz: null, expansion: null, churn: null, services: null },
  { month: "May", actual: null, budget: 9500, forecast: 10100, qoq: null, yoy: 8400, bear: 9500, bull: 10800, newBiz: null, expansion: null, churn: null, services: null },
  { month: "Jun", actual: null, budget: 9800, forecast: 10400, qoq: null, yoy: 8700, bear: 9700, bull: 11200, newBiz: null, expansion: null, churn: null, services: null },
];

const EXPENSE_DATA = [
  { name: "R&D", actual: 19270, budget: 19548, pct: 37.6, trend: "flat", q1: 9400, q2: 9870, hc: 142, hcPlan: 156 },
  { name: "S&M", actual: 15460, budget: 14730, pct: 30.2, trend: "up", q1: 7100, q2: 8360, hc: 68, hcPlan: 72 },
  { name: "Cloud", actual: 4455, budget: 4000, pct: 8.7, trend: "up", q1: 2100, q2: 2355, hc: null, hcPlan: null },
  { name: "COGS", actual: 7820, budget: 7365, pct: 15.3, trend: "flat", q1: 3800, q2: 4020, hc: 24, hcPlan: 24 },
  { name: "G&A", actual: 4860, budget: 5115, pct: 9.5, trend: "down", q1: 2500, q2: 2360, hc: 78, hcPlan: 90 },
];

const SEGMENT_DATA = [
  { name: "Enterprise", value: 38920, color: "#0ea5e9", growth: 28, pct: 76, acv: 186, deals: 209, winRate: 42, cycle: 38 },
  { name: "Mid-Market", value: 8650, color: "#a78bfa", growth: 14, pct: 17, acv: 42, deals: 206, winRate: 31, cycle: 52 },
  { name: "SMB", value: 2420, color: "#22d3ee", growth: -4, pct: 5, acv: 8.2, deals: 295, winRate: 28, cycle: 14 },
  { name: "Self-Serve", value: 1200, color: "#f5b731", growth: 62, pct: 2, acv: 1.8, deals: 667, winRate: null, cycle: null },
];

const COHORT_DATA = [
  { cohort: "Q1 '24", m0: 100, m3: 96, m6: 92, m9: 89, m12: 87 },
  { cohort: "Q2 '24", m0: 100, m3: 97, m6: 94, m9: 91, m12: null },
  { cohort: "Q3 '24", m0: 100, m3: 98, m6: 95, m9: null, m12: null },
  { cohort: "Q4 '24", m0: 100, m3: 97, m6: null, m9: null, m12: null },
  { cohort: "Q1 '25", m0: 100, m3: null, m6: null, m9: null, m12: null },
];

const CASH_RUNWAY = [
  { month: "Jul", balance: 32400, burn: -1850, inflow: 6800 },
  { month: "Aug", balance: 37350, burn: -1920, inflow: 7100 },
  { month: "Sep", balance: 43130, burn: -2010, inflow: 7600 },
  { month: "Oct", balance: 49120, burn: -2080, inflow: 8000 },
  { month: "Nov", balance: 55540, burn: -2150, inflow: 8500 },
  { month: "Dec", balance: 62190, burn: -2220, inflow: 8800 },
];

const KPIS = [
  { label: "ARR", value: "$48.6M", delta: "+24.1%", up: true, icon: DollarSign, spark: [32,35,33,38,41,44,46,48.6], accent: "accent", bench: "Target: $52M" },
  { label: "NDR", value: "118%", delta: "+4pp", up: true, icon: TrendingUp, spark: [108,110,112,114,115,116,117,118], accent: "green", bench: "Best-in-class >115%" },
  { label: "Gross Margin", value: "84.7%", delta: "+2.1pp", up: true, icon: Target, spark: [80,81,82,82.5,83,83.5,84,84.7], accent: "cyan", bench: "Benchmark: 70-80%" },
  { label: "Rule of 40", value: "52.1", delta: "+8.3", up: true, icon: Zap, spark: [38,40,42,44,46,48,50,52.1], accent: "purple", bench: "Top quartile SaaS" },
  { label: "Burn Multiple", value: "0.8x", delta: "-0.3x", up: true, icon: Activity, spark: [1.4,1.3,1.2,1.1,1.0,0.9,0.85,0.8], accent: "amber", bench: "Efficient: <1.0x" },
  { label: "Headcount", value: "312", delta: "+28", up: true, icon: Users, spark: [260,270,278,284,290,298,305,312], accent: "accent", bench: "Plan: 342 FY" },
];

const INSIGHTS = [
  { text: "Revenue beat $2.09M — Enterprise ACV ↑28%. AI module 34% attach.", source: "Variance Detective", time: "2 min", color: "#34d399" },
  { text: "S&M $730K over — Hiring $420K, events $180K. Pipeline ROI 7.2x.", source: "Variance Detective", time: "12 min", color: "#f87171" },
  { text: "Mid-market win rate declining — competitor wins 58% H2H. Cycles 42→58d.", source: "Competitive Intel", time: "1 hr", color: "#fbbf24" },
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
  "Compare us vs the competition",
  "Gross margin analysis",
  "Where are we over budget?",
  "Churn & retention trends",
  "Forecast accuracy report",
  "Burn multiple & runway",
  "Should we raise guidance?",
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "Overview", desc: "KPIs & performance" },
  { id: "copilot", label: "AI Copilot", icon: Brain, section: "Overview", desc: "Ask anything", hot: true },
  { id: "pnl", label: "P&L Statement", icon: FileText, section: "Financial", desc: "Income & expenses" },
  { id: "forecast", label: "Forecast", icon: TrendingUp, section: "Financial", desc: "ML predictions" },
  { id: "consolidation", label: "Consolidation", icon: Layers, section: "Financial", desc: "Multi-entity" },
  { id: "models", label: "Scenarios", icon: GitBranch, section: "Planning", desc: "What-if analysis" },
  { id: "close", label: "Close Tasks", icon: CheckSquare, section: "Planning", desc: "Month-end workflow" },
  { id: "team", label: "Team", icon: Users, section: "Collaborate", desc: "Members & chat" },
  { id: "integrations", label: "Integrations", icon: Plug, section: "Platform", desc: "Data connectors" },
  { id: "admin", label: "Admin", icon: Shield, section: "Platform", desc: "Workspace settings" },
  { id: "investor", label: "Investor Metrics", icon: Target, section: "Platform", desc: "Board readiness" },
  { id: "intelligence", label: "Intelligence", icon: Globe, section: "Platform", desc: "Market signals" },
  { id: "settings", label: "Settings", icon: Settings, section: "Platform", desc: "Preferences" },
];

const SECTION_ICONS = { Overview: LayoutDashboard, Financial: DollarSign, Planning: GitBranch, Collaborate: Users, Platform: Settings };

// ── TUTORIAL / PRODUCT GUIDE DATA ────────────────────────────
const PRODUCT_GUIDES = [
  { id: "getting-started", title: "Getting Started with FinanceOS", duration: "4:30", category: "Onboarding", thumb: "linear-gradient(135deg, #3b82f6, #8b5cf6)", desc: "Connect your first data source and explore the dashboard", views: 2840 },
  { id: "forecast-101", title: "AI Forecasting: From Zero to Production", duration: "8:15", category: "Feature", thumb: "linear-gradient(135deg, #10b981, #3b82f6)", desc: "Set up ML-powered revenue forecasting with sensitivity analysis", views: 1650 },
  { id: "month-end-close", title: "Automate Your Month-End Close", duration: "6:42", category: "Workflow", thumb: "linear-gradient(135deg, #f59e0b, #ef4444)", desc: "Configure close checklists, assignments, and automated reconciliation", views: 1120 },
  { id: "board-reporting", title: "Board Reporting Best Practices", duration: "5:18", category: "Strategy", thumb: "linear-gradient(135deg, #8b5cf6, #ec4899)", desc: "Build investor-ready dashboards and export board packs", views: 890 },
  { id: "integrations-setup", title: "Connect QuickBooks, Stripe & More", duration: "3:55", category: "Setup", thumb: "linear-gradient(135deg, #06b6d4, #10b981)", desc: "Step-by-step integration setup with live sync monitoring", views: 2100 },
  { id: "scenario-modeling", title: "Scenario Modeling Deep Dive", duration: "7:20", category: "Advanced", thumb: "linear-gradient(135deg, #f43f5e, #a855f7)", desc: "Build multi-variable scenarios and compare outcomes side by side", views: 760 },
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
    {/* Welcome header skeleton */}
    <div style={{ marginBottom: 20 }}>
      <Skeleton c={c} width={120} height={8} />
      <div style={{ height: 8 }} />
      <Skeleton c={c} width={260} height={22} />
      <div style={{ height: 6 }} />
      <Skeleton c={c} width={300} height={10} />
    </div>
    {/* Quick actions skeleton */}
    <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
      {[0,1,2,3].map(i => <Skeleton key={i} c={c} width={120} height={38} radius={12} />)}
    </div>
    {/* Status bar skeleton */}
    <Skeleton c={c} height={32} radius={8} style={{ marginBottom: 16 }} />
    {/* KPI grid skeleton */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      {[0,1,2,3,4,5].map(i => (
        <div key={i} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <Skeleton c={c} width={80} height={10} />
            <Skeleton c={c} width={32} height={32} radius={10} />
          </div>
          <Skeleton c={c} width={100} height={28} />
          <div style={{ height: 8 }} />
          <Skeleton c={c} width={60} height={20} radius={8} />
        </div>
      ))}
    </div>
    {/* Chart + Insights skeleton */}
    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <Skeleton c={c} width={180} height={14} />
          <Skeleton c={c} width={80} height={24} radius={8} />
        </div>
        <Skeleton c={c} height={200} radius={8} />
      </div>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: 22 }}>
        <Skeleton c={c} width={140} height={14} />
        <div style={{ height: 14 }} />
        {[0,1,2,3].map(i => (
          <div key={i} style={{ marginBottom: 10 }}>
            <Skeleton c={c} height={52} radius={12} />
          </div>
        ))}
      </div>
    </div>
  </div>
));

// ── EMPTY STATE ─────────────────────────────────────────────
const EmptyState = ({ c, icon: Icon, title, sub, cta, onAction }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", textAlign: "center" }}>
    <div style={{ width: 56, height: 56, borderRadius: 12, background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
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

const downloadPDF = async (title, headers, rows, { subtitle, footer, totals } = {}) => {
  const { default: jsPDF } = await import("jspdf");
  await import("jspdf-autotable");
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
  const w = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, w, 56, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(240, 242, 245);
  doc.text("FinanceOS", 32, 28);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 160, 180);
  doc.text(title, 32, 44);
  doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), w - 32, 28, { align: "right" });
  if (subtitle) doc.text(subtitle, w - 32, 44, { align: "right" });

  // Table
  doc.autoTable({
    startY: 72,
    head: [headers],
    body: rows,
    foot: totals ? [totals] : undefined,
    theme: "grid",
    headStyles: { fillColor: [30, 41, 59], textColor: [200, 210, 225], fontSize: 8, fontStyle: "bold", cellPadding: 6 },
    bodyStyles: { fontSize: 8, cellPadding: 5, textColor: [60, 70, 90] },
    footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontSize: 8, fontStyle: "bold", cellPadding: 6 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: headers.reduce((acc, _, i) => { if (i > 0) acc[i] = { halign: "right" }; return acc; }, {}),
    margin: { left: 32, right: 32 },
    didDrawPage: (data) => {
      // Footer on every page
      doc.setFontSize(7);
      doc.setTextColor(150, 160, 180);
      const pageH = doc.internal.pageSize.getHeight();
      doc.text(`${footer || "Generated by FinanceOS · finance-os.app"} · Confidential`, 32, pageH - 16);
      doc.text(`Page ${data.pageNumber}`, w - 32, pageH - 16, { align: "right" });
    },
  });

  doc.save(`${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`);
};

const ExportBar = ({ c, title, onCSV, onPDF }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
    <span style={{ fontSize: 16, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>{title}</span>
    <div style={{ display: "flex", gap: 6 }}>
      {[{ label: "CSV", fn: onCSV, icon: "↓" }, { label: "PDF", fn: onPDF, icon: "⬇" }].map(b => (
        <button key={b.label} onClick={b.fn} style={{ fontSize: 10, padding: "6px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surface, color: c.textSec, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: 5 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}50`; e.currentTarget.style.color = c.accent; e.currentTarget.style.background = c.accentDim; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; e.currentTarget.style.background = c.surface; }}
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
      display: "inline-flex", alignItems: "center", gap: 6,
      opacity: isDisabled ? 0.5 : 1, transition: "all 0.2s ease",
      ...style,
    }}
    onMouseEnter={e => { if (!isDisabled) { e.currentTarget.style.boxShadow = v.hoverShadow; }}}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = v.shadow; }}
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
const AI_SYSTEM_PROMPT = `You are FinanceOS AI Copilot. You have access to the company's GL data including chart of accounts, monthly transactions, and budgets.

CAPABILITIES:
- Variance analysis: actual vs budget by account, section, or period
- Revenue trends: monthly, quarterly, annualized growth rates
- Expense breakdown: by category (R&D, S&M, COGS, G&A) with % of revenue
- Gross margin and EBITDA computation from P&L sections
- SaaS metrics: ARR, NDR, Rule of 40, burn multiple (when data available)
- Scenario modeling: what-if analysis on key financial drivers
- Competitive benchmarks: industry medians for SaaS companies

RESPONSE FORMAT:
- Use **bold** for section headers
- Use bullet points for lists
- Include specific numbers from the data — never fabricate
- Keep responses under 300 words unless asked for a deep dive
- End complex answers with a **Recommendation:** section
- If you don't have enough data, say what's missing`;

const INSIGHT_SEVERITY = { high: { color: "red", label: "HIGH" }, medium: { color: "amber", label: "MED" }, low: { color: "green", label: "LOW" } };

const AI_INSIGHTS_ENRICHED = [
  { text: "Revenue beat $2.09M — Enterprise ACV up 28%. AI module 34% attach.", source: "Variance Detective", time: "2 min", color: "#34d399", severity: "low", action: "Review enterprise pipeline" },
  { text: "S&M $730K over — Hiring $420K, events $180K. Pipeline ROI 7.2x.", source: "Variance Detective", time: "12 min", color: "#f87171", severity: "high", action: "Approve or defer Q3 hiring" },
  { text: "Mid-market win rate declining — competitor wins 58% H2H. Cycles 42 to 58d.", source: "Competitive Intel", time: "1 hr", color: "#fbbf24", severity: "high", action: "Deploy competitive SWAT" },
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
  stats.pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

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
      {fmtTime(new Date(entry.timestamp))}
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
    <div style={{ position: "fixed", bottom: 80, right: 20, zIndex: 9999, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "16px 20px", boxShadow: c.shadow3, maxWidth: 280, animation: "fosFadeSlideUp 0.3s ease-out" }}>
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
// ── SITE-WIDE STATUS BANNER ──────────────────────────────────
// Set SHOW_STATUS_BANNER to false to hide. Edit message as needed.
const SHOW_STATUS_BANNER = true;
const STATUS_BANNER_MSG = "New: AI Copilot powered by Claude — visible reasoning for every financial insight";
const STATUS_BANNER_TYPE = "info"; // "warning" | "info" | "incident"

const StatusBanner = memo(({ dark }) => {
  const [dismissed, setDismissed] = useState(false);
  if (!SHOW_STATUS_BANNER || dismissed) return null;
  const bg = dark
    ? STATUS_BANNER_TYPE === "warning" ? "rgba(251,191,36,0.08)" : STATUS_BANNER_TYPE === "incident" ? "rgba(239,68,68,0.08)" : "rgba(96,165,250,0.08)"
    : STATUS_BANNER_TYPE === "warning" ? "rgba(251,191,36,0.10)" : STATUS_BANNER_TYPE === "incident" ? "rgba(239,68,68,0.10)" : "rgba(96,165,250,0.10)";
  const accent = STATUS_BANNER_TYPE === "warning" ? "#fbbf24" : STATUS_BANNER_TYPE === "incident" ? "#ef4444" : "#60a5fa";
  const border = STATUS_BANNER_TYPE === "warning" ? "rgba(251,191,36,0.15)" : STATUS_BANNER_TYPE === "incident" ? "rgba(239,68,68,0.15)" : "rgba(96,165,250,0.15)";
  const label = STATUS_BANNER_TYPE === "incident" ? "INCIDENT" : STATUS_BANNER_TYPE === "warning" ? "NOTICE" : "INFO";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "8px 16px", background: bg, borderBottom: `1px solid ${border}`, fontSize: 11, color: dark ? "#e2e8f0" : "#1e293b", flexShrink: 0, position: "relative", zIndex: 60 }}>
      <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${accent}20`, color: accent, letterSpacing: "0.08em" }}>{label}</span>
      <span>{STATUS_BANNER_MSG}</span>
      <span onClick={() => window.open("mailto:support@finance-os.app?subject=Status%20Inquiry", "_blank")} style={{ fontSize: 10, color: accent, fontWeight: 700, cursor: "pointer", marginLeft: 4 }}>Learn more</span>
      <div onClick={() => setDismissed(true)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: dark ? "#64748b" : "#94a3b8", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, transition: "all 0.12s" }}
        onMouseEnter={e => { e.currentTarget.style.background = `${accent}15`; e.currentTarget.style.color = accent; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark ? "#64748b" : "#94a3b8"; }}
      ><X size={12} /></div>
    </div>
  );
});

const DemoBanner = memo(({ c, onNav, onUpgrade, orgName }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "10px 16px",
    background: `linear-gradient(90deg, #f59e0b18, #f59e0b08)`, borderBottom: `1px solid #f59e0b30`,
    fontSize: 11, color: c.textSec, flexShrink: 0, flexWrap: "wrap",
  }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 4, background: "#f59e0b20", color: "#f59e0b", letterSpacing: "0.06em", border: "1px solid #f59e0b25" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", animation: "pulse 2s infinite" }} />
      DEMO MODE
    </span>
    <span>You are viewing <strong style={{ color: c.text }}>sample data</strong> — connect your ERP to see real financials</span>
    <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.textFaint }} />
    <span onClick={() => onNav("integrations")} style={{ fontSize: 10, color: c.accent, fontWeight: 700, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 2 }}>Connect Your Data</span>
    <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.textFaint }} />
    <span onClick={onUpgrade} style={{ fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 5, background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, color: "#fff", cursor: "pointer" }}>Subscribe</span>
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
      if (stored !== null) { try { setValue(JSON.parse(stored)); } catch {} }
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
        cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${a.color}40`; e.currentTarget.style.color = a.color; e.currentTarget.style.background = `${a.color}06`; e.currentTarget.style.boxShadow = `0 6px 20px ${a.color}10, 0 0 0 1px ${a.color}15`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; e.currentTarget.style.background = c.surface; e.currentTarget.style.boxShadow = c.cardGlow; }}
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
// ── LOCALE-AWARE FORMATTERS ──────────────────────────────────
const CURRENCY_SYMBOLS = { USD: "$", EUR: "\u20ac", GBP: "\u00a3", CAD: "CA$", AUD: "A$", JPY: "\u00a5", CHF: "CHF\u00a0", SGD: "S$", HKD: "HK$", INR: "\u20b9", BRL: "R$", SEK: "", MXN: "MX$", KRW: "\u20a9", CNY: "\u00a5", NZD: "NZ$", ZAR: "R", NOK: "", DKK: "", PLN: "z\u0142", ILS: "\u20aa", THB: "\u0e3f", PHP: "\u20b1", TWD: "NT$" };
const CURRENCY_SUFFIX = { SEK: "\u00a0kr", NOK: "\u00a0kr", DKK: "\u00a0kr", PLN: "\u00a0z\u0142" };
const LOCALE_MAP = { US: "en-US", GB: "en-GB", CA: "en-CA", AU: "en-AU", DE: "de-DE", FR: "fr-FR", JP: "ja-JP", SG: "en-SG", HK: "zh-HK", IT: "it-IT", BR: "pt-BR", IN: "en-IN", NL: "nl-NL", SE: "sv-SE", CH: "de-CH", AE: "ar-AE", MX: "es-MX", KR: "ko-KR", ES: "es-ES", IE: "en-IE", IL: "he-IL", PL: "pl-PL", NO: "nb-NO", DK: "da-DK", FI: "fi-FI", NZ: "en-NZ", ZA: "en-ZA", PH: "en-PH" };

const getLocalePrefs = () => {
  try {
    return {
      currency: localStorage.getItem("fos_currency") || "USD",
      region: localStorage.getItem("fos_region") || "US",
      dateFormat: localStorage.getItem("fos_dateformat") || "MM/DD/YYYY",
      lang: localStorage.getItem("fos_lang") || "en",
    };
  } catch { return { currency: "USD", region: "US", dateFormat: "MM/DD/YYYY", lang: "en" }; }
};

const fmt = (n, prefs) => {
  if (n == null || !Number.isFinite(n)) return `${CURRENCY_SYMBOLS[(prefs || getLocalePrefs()).currency] || "$"}0`;
  const p = prefs || getLocalePrefs();
  const sym = CURRENCY_SYMBOLS[p.currency] || "$";
  const sfx = CURRENCY_SUFFIX[p.currency] || "";
  if (Math.abs(n) >= 1e6) return `${sym}${(n / 1e6).toFixed(1)}M${sfx}`;
  if (Math.abs(n) >= 1e3) return `${sym}${Math.round(n / 1e3).toLocaleString(LOCALE_MAP[p.region] || "en-US")}K${sfx}`;
  return `${sym}${n}${sfx}`;
};

const fmtDate = (date, prefs) => {
  const p = prefs || getLocalePrefs();
  const d = date instanceof Date ? date : new Date(date);
  const locale = LOCALE_MAP[p.region] || "en-US";
  return d.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};

const fmtTime = (date, prefs) => {
  const p = prefs || getLocalePrefs();
  const d = date instanceof Date ? date : new Date(date);
  const locale = LOCALE_MAP[p.region] || "en-US";
  return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
};

const fmtPct = (n) => `${n >= 0 ? "+" : ""}${Number.isFinite(n) ? n.toFixed(1) : "0.0"}%`;
const csym = () => CURRENCY_SYMBOLS[getLocalePrefs().currency] || "$";
const csfx = () => CURRENCY_SUFFIX[getLocalePrefs().currency] || "";
const variance = (actual, budget) => (actual || 0) - (budget || 0);
const variancePct = (actual, budget) => budget ? ((actual - budget) / budget) * 100 : 0;
const isFavorable = (actual, budget, isRevenue = false) => isRevenue ? actual >= budget : actual <= budget;

// ── CUSTOM TOOLTIP ───────────────────────────────────────────
const ChartTooltip = memo(({ active, payload, label, c }) => {
  if (!active || !payload?.length) return null;
  const actual = payload.find(p => p.dataKey === "actual")?.value;
  const budget = payload.find(p => p.dataKey === "budget")?.value;
  const forecast = payload.find(p => p.dataKey === "forecast")?.value;
  const yoy = payload.find(p => p.dataKey === "yoy")?.value;
  const variance = actual && budget ? actual - budget : null;
  const variancePct = actual && budget ? ((actual - budget) / budget * 100) : null;
  const yoyDelta = actual && yoy ? ((actual - yoy) / yoy * 100) : null;
  const monthData = REVENUE_DATA.find(d => d.month === label);

  return (
    <div style={{
      background: c.glass, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "14px 18px",
      fontSize: 12, boxShadow: `0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px ${c.accent}08, inset 0 1px 0 rgba(255,255,255,0.05)`, backdropFilter: "blur(32px) saturate(1.6)", WebkitBackdropFilter: "blur(32px) saturate(1.6)",
      minWidth: 220, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${c.accent}, ${c.purple}60, transparent)`, borderRadius: "16px 16px 0 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingBottom: 7, borderBottom: `1px solid ${c.borderSub}` }}>
        <span style={{ fontWeight: 800, color: c.text, fontSize: 11, letterSpacing: "-0.01em" }}>{label} 2025</span>
        {variance !== null && (
          <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: variance >= 0 ? `${c.green}12` : `${c.red}12`, color: variance >= 0 ? c.green : c.red, fontFamily: "'JetBrains Mono', monospace" }}>
            {variance >= 0 ? "+" : ""}{variancePct?.toFixed(1)}%
          </span>
        )}
      </div>
      {/* Primary metrics */}
      {payload.filter(p => p.value != null && !["bull","bear"].includes(p.dataKey)).map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "4px 0", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, color: c.textSec, fontWeight: 500, fontSize: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: p.dataKey === "budget" ? 1 : 3, background: `${p.color}30`, border: `2px solid ${p.color}`, display: "inline-block" }} />
            {p.name}
          </span>
          <span style={{ fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: c.text, fontSize: 12 }}>{typeof p.value === "number" ? fmt(p.value) : p.value}</span>
        </div>
      ))}
      {/* Variance row */}
      {variance !== null && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 4px", marginTop: 4, borderTop: `1px solid ${c.borderSub}`, fontSize: 11 }}>
          <span style={{ color: c.textDim, fontWeight: 600 }}>Variance</span>
          <span style={{ fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: variance >= 0 ? c.green : c.red }}>{variance >= 0 ? "+" : ""}{fmt(variance)}</span>
        </div>
      )}
      {yoyDelta !== null && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0 4px", fontSize: 11 }}>
          <span style={{ color: c.textDim, fontWeight: 600 }}>YoY Growth</span>
          <span style={{ fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: yoyDelta >= 0 ? c.green : c.red }}>{yoyDelta >= 0 ? "+" : ""}{(yoyDelta || 0).toFixed(1)}%</span>
        </div>
      )}
      {/* Revenue composition — only for actual months */}
      {monthData?.newBiz && (
        <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${c.borderSub}` }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Composition</div>
          {[
            { label: "New Business", val: monthData.newBiz, color: c.accent },
            { label: "Expansion", val: monthData.expansion, color: c.green },
            { label: "Services", val: monthData.services, color: c.purple },
            { label: "Churn", val: monthData.churn, color: c.red },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0", fontSize: 10 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: c.textDim }}>
                <span style={{ width: 4, height: 4, borderRadius: 1, background: item.color }} />
                {item.label}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: item.val < 0 ? c.red : c.textSec }}>{item.val < 0 ? "" : "$"}{(Math.abs(item.val) / 1000).toFixed(1)}K</span>
            </div>
          ))}
          {/* Composition bar */}
          <div style={{ display: "flex", height: 3, borderRadius: 2, overflow: "hidden", marginTop: 4, gap: 1 }}>
            {[
              { val: monthData.newBiz, color: c.accent },
              { val: monthData.expansion, color: c.green },
              { val: monthData.services, color: c.purple },
            ].map((s, i) => {
              const total = monthData.newBiz + monthData.expansion + monthData.services;
              return <div key={i} style={{ width: `${(s.val / total) * 100}%`, background: s.color, borderRadius: 1 }} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
});

// ── SPARKLINE ────────────────────────────────────────────────
// ── SKELETON LOADING ─────────────────────────────────────────
const SkeletonBlock = ({ width = "100%", height = 16, borderRadius = 6, style = {} }) => (
  <div className="fos-skeleton" style={{ width, height, borderRadius, background: "currentColor", opacity: 0.06, ...style }} />
);

const SkeletonKpiCard = ({ c }) => (
  <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "18px 20px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
      <SkeletonBlock width={80} height={10} />
      <SkeletonBlock width={26} height={26} borderRadius={8} />
    </div>
    <SkeletonBlock width={100} height={28} borderRadius={4} style={{ marginBottom: 8 }} />
    <SkeletonBlock width={60} height={14} borderRadius={4} />
  </div>
);

const SkeletonChart = ({ c, height = 200 }) => (
  <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "24px 24px 18px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <SkeletonBlock width={30} height={30} borderRadius={9} />
        <div><SkeletonBlock width={140} height={14} style={{ marginBottom: 4 }} /><SkeletonBlock width={200} height={10} /></div>
      </div>
      <SkeletonBlock width={100} height={28} borderRadius={8} />
    </div>
    <SkeletonBlock width="100%" height={height} borderRadius={8} />
    <div style={{ display: "flex", gap: 12, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${c.borderSub}` }}>
      <SkeletonBlock width={60} height={12} borderRadius={4} />
      <SkeletonBlock width={60} height={12} borderRadius={4} />
      <SkeletonBlock width={60} height={12} borderRadius={4} />
    </div>
  </div>
);

const SkeletonTable = ({ c, rows = 5 }) => (
  <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden" }}>
    <div style={{ display: "flex", gap: 20, padding: "14px 18px", background: c.surfaceAlt, borderBottom: `1px solid ${c.borderSub}` }}>
      {[120, 80, 80, 80, 60, 100].map((w, i) => <SkeletonBlock key={i} width={w} height={10} />)}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ display: "flex", gap: 20, padding: "12px 18px", borderBottom: `1px solid ${c.borderSub}` }}>
        {[120, 80, 80, 80, 60, 100].map((w, j) => <SkeletonBlock key={j} width={w * (0.7 + Math.random() * 0.3)} height={10} />)}
      </div>
    ))}
  </div>
);

const Spark = memo(({ data, color, width = 64, height = 24 }) => {
  if (!data || data.length < 2) return <svg width={width} height={height} />;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => [((i / (data.length - 1)) * width), (height - ((v - min) / range) * (height - 6) - 3)]);
  // Smooth cubic bezier path
  const path = pts.map((p, i) => {
    if (i === 0) return `M ${p[0]},${p[1]}`;
    const prev = pts[i - 1];
    const cpx = (prev[0] + p[0]) / 2;
    return `C ${cpx},${prev[1]} ${cpx},${p[1]} ${p[0]},${p[1]}`;
  }).join(" ");
  const areaPath = `${path} L ${width},${height} L 0,${height} Z`;
  const id = `sp${Math.random().toString(36).slice(2, 6)}`;
  const lastPt = pts[pts.length - 1];
  const isUp = data[data.length - 1] > data[0];
  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="40%" stopColor={color} stopOpacity={0.1} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r={3.5} fill={color} opacity={0.15} />
      <circle cx={lastPt[0]} cy={lastPt[1]} r={2} fill={color} />
    </svg>
  );
});

// ── KPI CARD ─────────────────────────────────────────────────
const KpiCard = memo(({ kpi, c, onClick }) => {
  const Icon = kpi.icon;
  const accentColor = c[kpi.accent] || c.accent;
  // Generate sparkline data if none provided
  const spark = kpi.spark?.length > 1 ? kpi.spark : (() => {
    // Auto-generate trend data based on accent
    const base = { accent: [62, 68, 71, 74, 80, 85, 82, 88, 92, 95, 91, 98], green: [48, 52, 55, 59, 63, 67, 72, 76, 81, 84, 88, 91], amber: [38, 42, 40, 44, 41, 46, 43, 48, 45, 50, 47, 52], red: [90, 85, 82, 78, 75, 71, 68, 65, 62, 58, 55, 52], purple: [30, 35, 42, 48, 55, 60, 58, 65, 70, 78, 82, 88], cyan: [55, 58, 60, 63, 67, 70, 68, 72, 75, 78, 80, 83] };
    return base[kpi.accent] || base.accent;
  })();
  let sparkPath = "";
  let sparkAreaPath = "";
  if (spark.length > 1) {
    const min = Math.min(...spark); const max = Math.max(...spark); const range = max - min || 1;
    const w = 90; const h = 32; const pad = 2;
    const pts = spark.map((v, i) => {
      const x = pad + (i / (spark.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    });
    sparkPath = `M${pts.join("L")}`;
    sparkAreaPath = `${sparkPath}L${w - pad},${h}L${pad},${h}Z`;
  }
  // Trend direction from sparkline
  const trendUp = spark.length > 1 ? spark[spark.length - 1] > spark[spark.length - 2] : kpi.up;
  return (
    <div onClick={onClick} style={{
      background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur,
      border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 22px",
      cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden",
      boxShadow: c.cardGlow,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = `${accentColor}40`; e.currentTarget.style.transform = "translateY(-3px) scale(1.005)"; e.currentTarget.style.boxShadow = `0 0 0 1px ${accentColor}20, 0 12px 36px ${accentColor}10, 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = c.glassBorder; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = c.cardGlow; }}
    >
      {/* Top accent gradient */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent 10%, ${accentColor}30, transparent 90%)` }} />
      {/* Background sparkline watermark */}
      {sparkPath && (
        <svg width="100%" height="100%" viewBox="0 0 90 32" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, right: 0, width: "60%", height: "50%", opacity: 0.08, pointerEvents: "none" }}>
          <path d={sparkAreaPath} fill={accentColor} />
        </svg>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`, border: `1px solid ${accentColor}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={14} color={accentColor} strokeWidth={2.2} />
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: c.textFaint }}>{kpi.label}</div>
        </div>
        {/* Micro sparkline */}
        {sparkPath && (
          <svg width={90} height={32} style={{ flexShrink: 0, opacity: 0.85 }}>
            <defs>
              <linearGradient id={`sp-${kpi.label.replace(/\s/g,"")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={sparkAreaPath} fill={`url(#sp-${kpi.label.replace(/\s/g,"")})`} />
            <path d={sparkPath} fill="none" stroke={accentColor} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            {spark.length > 0 && (() => {
              const min = Math.min(...spark); const max = Math.max(...spark); const range = max - min || 1;
              const lastX = 2 + ((spark.length - 1) / (spark.length - 1)) * 86;
              const lastY = 2 + (1 - (spark[spark.length - 1] - min) / range) * 28;
              return <circle cx={lastX} cy={lastY} r={3} fill={accentColor} stroke={c.surface} strokeWidth={2} style={{ filter: `drop-shadow(0 0 4px ${accentColor})` }} />;
            })()}
          </svg>
        )}
      </div>
      <div className="fos-kpi-value" style={{ fontSize: 28, fontWeight: 800, color: c.text, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace", marginBottom: 10, position: "relative" }}>{kpi.value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: kpi.up ? c.green : c.red, display: "inline-flex", alignItems: "center", gap: 2, padding: "3px 8px", borderRadius: 6, background: kpi.up ? `${c.green}10` : `${c.red}10`, border: `1px solid ${kpi.up ? c.green : c.red}10` }}>
          {kpi.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {kpi.delta}
        </span>
        {kpi.bench && <span style={{ fontSize: 9, color: c.textFaint, padding: "2px 6px", borderRadius: 4, background: c.surfaceAlt }}>{kpi.bench}</span>}
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
      display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px",
      background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, borderRadius: 12,
      cursor: "pointer", transition: "all 0.2s ease", marginBottom: 8,
      borderLeft: `3px solid ${item.color}`, boxShadow: c.shadow1,
      position: "relative", overflow: "hidden",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}30`; e.currentTarget.style.borderLeftColor = item.color; e.currentTarget.style.boxShadow = `0 6px 20px ${item.color}10`; e.currentTarget.style.transform = "translateX(4px)"; }}
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
const DashboardView = ({ c, onNav, toast, onDrawer, userName, period, closeTasks, activityLog, glData, glLoading }) => {
  // Use database GL data when available, fall back to hardcoded demo data
  const pnlData = glData?.pnl || PNL_DATA;
  const isLiveData = glData?.source === "database";

  // Compute KPIs from GL data when available
  const computedKpis = useMemo(() => {
    if (!glData?.summary) return null;
    try {
      const s = glData.summary;
      const rev = s.total_revenue || 1; // guard div/0
      const arr = s.total_revenue * (12 / (s.periods?.length || 9));
      const gm = s.gross_margin || "0.0";
      return [
        { label: "Revenue (YTD)", value: `$${(s.total_revenue / 1000).toFixed(1)}M`, delta: `${s.periods?.length || 0} months`, up: true, icon: DollarSign, spark: [], accent: "accent", bench: `Annualized: $${(arr / 1000).toFixed(1)}M` },
        { label: "Gross Profit", value: `$${((s.gross_profit || 0) / 1000).toFixed(1)}M`, delta: `${gm}% margin`, up: parseFloat(gm) > 70, icon: TrendingUp, spark: [], accent: "green", bench: "Benchmark: 70-80%" },
        { label: "OpEx (YTD)", value: `$${((s.total_opex || 0) / 1000).toFixed(1)}M`, delta: `${((s.total_opex || 0) / rev * 100).toFixed(0)}% of rev`, up: false, icon: Activity, spark: [], accent: "amber", bench: `${pnlData?.find(p => p.section === "Operating Expenses")?.rows?.length || 0} line items` },
        { label: "Net Income", value: `$${((s.net_income || 0) / 1000).toFixed(1)}M`, delta: `${((s.net_income || 0) / rev * 100).toFixed(1)}% margin`, up: (s.net_income || 0) > 0, icon: Target, spark: [], accent: (s.net_income || 0) > 0 ? "green" : "red", bench: "Bottom line" },
        { label: "COGS", value: `$${((s.total_cogs || 0) / 1000).toFixed(1)}M`, delta: `${((s.total_cogs || 0) / rev * 100).toFixed(1)}% of rev`, up: false, icon: Zap, spark: [], accent: "cyan", bench: `Gross margin: ${gm}%` },
        { label: "Accounts", value: `${glData.account_count || 0}`, delta: `${glData.transaction_count || 0} txns`, up: true, icon: Users, spark: [], accent: "purple", bench: `${s.periods?.length || 0} months loaded` },
      ];
    } catch { return null; }
  }, [glData, pnlData]);

  const kpis = computedKpis || KPIS;
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
  <div style={{ padding: 32, position: "relative" }}>
    {/* Ambient dashboard visual — animated gradient mesh */}
    <div style={{ position: "absolute", top: -40, right: -40, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}06 0%, transparent 70%)`, pointerEvents: "none", animation: "fosDashOrb1 8s ease-in-out infinite" }} />
    <div style={{ position: "absolute", top: 60, right: 120, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${c.purple}05 0%, transparent 70%)`, pointerEvents: "none", animation: "fosDashOrb2 12s ease-in-out infinite" }} />
    <style>{`@keyframes fosDashOrb1{0%,100%{transform:translate(0,0) scale(1);opacity:0.6}50%{transform:translate(-20px,15px) scale(1.1);opacity:1}}@keyframes fosDashOrb2{0%,100%{transform:translate(0,0) scale(1);opacity:0.5}50%{transform:translate(15px,-10px) scale(0.9);opacity:0.8}}`}</style>
    {/* Welcome header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, position: "relative" }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          {new Date().getHours() < 12 ? <Sun size={11} color={c.accent} /> : new Date().getHours() < 17 ? <Zap size={11} color={c.accent} /> : <Moon size={11} color={c.accent} />}
          {fmtDate(new Date())}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: c.text, letterSpacing: "-0.03em", lineHeight: 1.2 }}>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}{displayName ? `, ${displayName}` : ""}
          {period && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: `${c.accent}08`, color: c.accent, marginLeft: 10, verticalAlign: "middle", letterSpacing: "0.02em", border: `1px solid ${c.accent}12` }}>{period}</span>}
        </div>
        <div style={{ fontSize: 12, color: c.textDim, marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 6, background: `${c.green}08`, border: `1px solid ${c.green}10` }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: c.green, display: "inline-block", animation: "pulse 2s infinite" }} /><span style={{ color: c.green, fontWeight: 600 }}>Revenue ahead by $2.09M</span></span>
          <span style={{ padding: "3px 10px", borderRadius: 6, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, fontWeight: 600 }}>Rule of 40: <span style={{ color: c.accent, fontFamily: "'JetBrains Mono', monospace" }}>52.1</span></span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 6, background: `${c.amber}08`, border: `1px solid ${c.amber}10`, color: c.amber, fontWeight: 600 }}>4 variances</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ padding: "10px 20px", borderRadius: 10, background: `linear-gradient(135deg, ${c.purple}14, ${c.accent}08)`, border: `1px solid ${c.purple}25`, fontSize: 12, color: c.purple, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, transition: "all 0.2s", boxShadow: `0 2px 8px ${c.purple}08` }}
          onClick={() => onNav("copilot")}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.purple}50`; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 4px 16px ${c.purple}15`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.purple}25`; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 2px 8px ${c.purple}08`; }}
        >
          <Sparkles size={14} /> Ask AI Copilot
        </div>
      </div>
    </div>

    {/* Quick Actions — ENV 9 */}
    <QuickActions c={c} onNav={onNav} toast={toast} />

    {/* Data Health Monitor — comprehensive sync & tracking status */}
    {(() => {
      const [tick, setTick] = useState(0);
      const [events] = useState(() => [
        { t: Date.now() - 120000, src: "NetSuite", ok: true, records: "847K", color: "#0C9ADA" },
        { t: Date.now() - 45000, src: "Salesforce", ok: true, records: "124K", color: "#00A1E0" },
        { t: Date.now() - 60000, src: "Stripe", ok: true, records: "38K", color: "#635BFF" },
        { t: Date.now() - 180000, src: "Snowflake", ok: true, records: "2.1M", color: "#29B5E8" },
        { t: Date.now() - 240000, src: "Rippling", ok: true, records: "312", color: "#FE6847" },
        { t: Date.now() - 130000, src: "HubSpot", ok: true, records: "89K", color: "#FF7A59" },
        { t: Date.now() - 300000, src: "Ramp", ok: true, records: "5.2K", color: "#007A5E" },
      ]);
      useEffect(() => { const i = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(i); }, []);
      const ago = (ts) => { const s = Math.floor((Date.now() - ts) / 1000); return s < 5 ? "just now" : s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s/60)}m ${s%60}s ago` : `${Math.floor(s/3600)}h ago`; };
      const allOk = events.every(e => e.ok);
      const totalRecords = "3.1M";
      const freshest = events.reduce((a, b) => a.t > b.t ? a : b);
      return (
      <div style={{ marginBottom: 20, background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 14, padding: "14px 18px", boxShadow: c.cardGlow }}>
        {/* Top row — status + summary */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: c.textDim, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: allOk ? c.green : c.amber, animation: "pulse 2s infinite", boxShadow: `0 0 8px ${allOk ? c.green : c.amber}40` }} />
            <span style={{ fontWeight: 700, color: allOk ? c.green : c.amber }}>{allOk ? "All Systems Live" : "Degraded"}</span>
          </span>
          <span style={{ color: c.borderSub }}>·</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{events.length} connectors active</span>
          <span style={{ color: c.borderSub }}>·</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{totalRecords} records synced</span>
          <span style={{ color: c.borderSub }}>·</span>
          <span>{isLiveData ? `${glData?.account_count || 0} GL accounts · ${glData?.transaction_count || 0} transactions` : "Demo data — connect to go live"}</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 9, color: c.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>Last sync: {ago(freshest.t)}</span>
            <span style={{ fontWeight: 700, color: c.accent, cursor: "pointer", fontSize: 10, padding: "3px 10px", borderRadius: 6, background: `${c.accent}08`, border: `1px solid ${c.accent}12`, transition: "all 0.15s" }} onClick={() => onNav("integrations")}
              onMouseEnter={e => { e.currentTarget.style.background = `${c.accent}15`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${c.accent}08`; }}
            >Manage Connectors</span>
          </span>
        </div>
        {/* Connector sync pulse — mini pills showing each source */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {events.map(ev => (
            <div key={ev.src} onClick={() => onNav("integrations")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, cursor: "pointer", transition: "all 0.15s", fontSize: 9 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${ev.color}40`; e.currentTarget.style.background = `${ev.color}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; e.currentTarget.style.background = c.surfaceAlt; }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: ev.ok ? c.green : c.red, flexShrink: 0 }} />
              <span style={{ fontWeight: 700, color: c.textSec }}>{ev.src}</span>
              <span style={{ color: c.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>{ev.records}</span>
              <span style={{ color: c.textFaint, fontFamily: "'JetBrains Mono', monospace", fontSize: 8 }}>{ago(ev.t)}</span>
            </div>
          ))}
        </div>
      </div>
      );
    })()}

    {/* KPI Grid */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Key Metrics</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: isMobile ? 10 : 14, marginBottom: 28 }}>
      {glLoading ? Array.from({ length: 6 }).map((_, i) => <SkeletonKpiCard key={i} c={c} />) :
      kpis.map((k, i) => <KpiCard key={k.label} kpi={k} c={c} onClick={() => onDrawer(k.label)} />)}
    </div>

    {/* Charts Row */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Performance Analytics</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.7fr 1fr", gap: 16, marginBottom: 28 }}>
      {/* Revenue Chart */}
      <ChartPanel title="Revenue Performance" glass={c.glass} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}>
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
        {/* Gradient accent top edge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.accent}18, ${c.purple}10)`, border: `1px solid ${c.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={14} color={c.accent} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>Revenue Performance</div>
                <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.green}15`, color: c.green, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} />LIVE</span>
              </div>
              <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>Actual vs Budget vs Forecast ($K)</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 2, background: c.surfaceAlt, borderRadius: 10, padding: 3, border: `1px solid ${c.borderSub}` }}>
            {["QTD", "YTD", "12M"].map(p => (
              <span key={p} onClick={() => setChartPeriod(p)} style={{ fontSize: 10, fontWeight: 700, padding: "5px 12px", borderRadius: 7, background: chartPeriod === p ? `linear-gradient(135deg, ${c.accent}, ${c.purple})` : "transparent", color: chartPeriod === p ? "#fff" : c.textFaint, cursor: "pointer", transition: "all 0.2s", boxShadow: chartPeriod === p ? `0 2px 8px ${c.accent}30` : "none", letterSpacing: "0.02em" }}>{p}</span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.accent} stopOpacity={0.25} /><stop offset="40%" stopColor={c.accent} stopOpacity={0.08} /><stop offset="100%" stopColor={c.accent} stopOpacity={0} /></linearGradient>
              <linearGradient id="gFc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.green} stopOpacity={0.2} /><stop offset="100%" stopColor={c.green} stopOpacity={0} /></linearGradient>
              <linearGradient id="gBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.green} stopOpacity={0.08} /><stop offset="100%" stopColor={c.green} stopOpacity={0.02} /></linearGradient>
              <filter id="glowAct"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <CartesianGrid stroke={c.chartGrid} strokeDasharray="4 8" vertical={false} horizontalPoints={[]} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: c.chartAxis, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: c.chartAxis }} axisLine={false} tickLine={false} tickFormatter={v => `${csym()}${v / 1000}M${csfx()}`} domain={["auto", "auto"]} />
            <Tooltip content={<ChartTooltip c={c} />} cursor={{ stroke: c.accent, strokeWidth: 1, strokeDasharray: "4 4", strokeOpacity: 0.4 }} />
            <ReferenceLine y={7800} stroke={c.amber} strokeDasharray="8 4" strokeWidth={1} strokeOpacity={0.4} label={{ value: "AVG", fill: c.amber, fontSize: 8, fontWeight: 800, position: "right" }} />
            {/* Bear/Bull confidence band */}
            <Area type="monotone" dataKey="bull" stroke="none" fill="url(#gBand)" name="Bull" connectNulls={false} animationDuration={800} animationEasing="ease-out" fillOpacity={hiddenSeries.forecast ? 0 : 1} style={{ transition: "opacity 0.5s ease" }} />
            <Area type="monotone" dataKey="bear" stroke="none" fill="url(#gBand)" name="Bear" connectNulls={false} animationDuration={800} animationEasing="ease-out" fillOpacity={hiddenSeries.forecast ? 0 : 1} style={{ transition: "opacity 0.5s ease" }} />
            {/* YoY comparison (prior year) */}
            <Line type="monotone" dataKey="yoy" stroke={c.textFaint} strokeWidth={1} strokeDasharray="2 4" name="Prior Year" dot={false} strokeOpacity={0.3} animationDuration={1400} animationEasing="ease-out" />
            <Area type="monotone" dataKey="actual" stroke={c.accent} fill="url(#gAct)" strokeWidth={hiddenSeries.actual ? 0 : 2.5} name="Actual" dot={hiddenSeries.actual ? false : { r: 4, fill: c.surface, stroke: c.accent, strokeWidth: 2.5 }} activeDot={hiddenSeries.actual ? false : { r: 7, fill: c.accent, stroke: c.surface, strokeWidth: 3, style: { filter: `drop-shadow(0 0 6px ${c.accent})` } }} connectNulls={false} animationDuration={600} animationEasing="ease-out" fillOpacity={hiddenSeries.actual ? 0 : 1} strokeOpacity={hiddenSeries.actual ? 0 : 1} />
            <Line type="monotone" dataKey="budget" stroke={c.textFaint} strokeWidth={hiddenSeries.budget ? 0 : 1.5} strokeDasharray="5 5" name="Budget" dot={false} animationDuration={600} animationEasing="ease-out" strokeOpacity={hiddenSeries.budget ? 0 : 1} />
            <Area type="monotone" dataKey="forecast" stroke={c.green} fill="url(#gFc)" strokeWidth={hiddenSeries.forecast ? 0 : 2} strokeDasharray="8 4" name="Forecast" dot={hiddenSeries.forecast ? false : { r: 3.5, fill: c.surface, stroke: c.green, strokeWidth: 2 }} activeDot={hiddenSeries.forecast ? false : { r: 6, fill: c.green, stroke: c.surface, strokeWidth: 2, style: { filter: `drop-shadow(0 0 6px ${c.green})` } }} connectNulls={false} animationDuration={600} animationEasing="ease-out" fillOpacity={hiddenSeries.forecast ? 0 : 1} strokeOpacity={hiddenSeries.forecast ? 0 : 1} />
          </ComposedChart>
        </ResponsiveContainer>
        {/* Legend row */}
        <div style={{ display: "flex", gap: 6, marginTop: 12, fontSize: 10, color: c.textDim, alignItems: "center", paddingTop: 12, borderTop: `1px solid ${c.borderSub}`, flexWrap: "wrap" }}>
          {[
            { key: "actual", label: "Actual", color: c.accent, type: "solid" },
            { key: "budget", label: "Budget", color: c.textFaint, type: "dashed" },
            { key: "forecast", label: "Forecast", color: c.green, type: "solid" },
          ].map(s => {
            const hidden = hiddenSeries[s.key];
            return (
            <span key={s.key} onClick={() => toggleSeries(s.key)} style={{
              display: "flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "5px 12px", borderRadius: 8,
              opacity: hidden ? 0.4 : 1, background: hidden ? "transparent" : `${s.color}06`,
              border: `1.5px solid ${hidden ? c.borderSub : `${s.color}25`}`, transition: "all 0.3s ease",
              fontWeight: 700, userSelect: "none",
            }}
            onMouseEnter={e => { if (hidden) e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={e => { if (hidden) e.currentTarget.style.opacity = "0.4"; }}
            >
              <span style={{ width: 12, height: 12, borderRadius: 3, border: `2px solid ${hidden ? c.borderSub : s.color}`, background: hidden ? "transparent" : `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                {!hidden && <span style={{ fontSize: 8, color: s.color, fontWeight: 900 }}>✓</span>}
              </span>
              <span style={{ textDecoration: hidden ? "line-through" : "none", transition: "all 0.3s" }}>{s.label}</span>
            </span>
            );
          })}
          <span style={{ fontSize: 9, color: c.textFaint, display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 0, borderTop: `1px dashed ${c.textFaint}40` }} />YoY</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: c.greenDim, color: c.green, border: `1px solid ${c.green}10` }}>+$2.09M beat</span>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: `${c.accent}08`, color: c.accent, border: `1px solid ${c.accent}10` }}>+29% YoY</span>
            <span style={{ fontWeight: 700, color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>H: $10.4M · L: $6.8M</span>
          </span>
        </div>
      </div>
      </ChartPanel>

      {/* Segment Donut */}
      <ChartPanel title="Revenue by Segment" glass={c.glass} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}>
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.purple}18, ${c.cyan}10)`, border: `1px solid ${c.purple}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Target size={14} color={c.purple} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Revenue by Segment</div>
            <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>FY2025 YTD distribution</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <defs>
              {SEGMENT_DATA.map((s, i) => (
                <linearGradient key={i} id={`seg${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={s.color} stopOpacity={1} /><stop offset="100%" stopColor={s.color} stopOpacity={0.7} /></linearGradient>
              ))}
            </defs>
            <Pie data={SEGMENT_DATA} cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value" stroke="none" cornerRadius={4}>
              {SEGMENT_DATA.map((s, i) => <Cell key={i} fill={`url(#seg${i})`} />)}
            </Pie>
            <Tooltip content={<ChartTooltip c={c} />} />
            <text x="50%" y="44%" textAnchor="middle" fill={c.text} fontSize={20} fontWeight={800} fontFamily="'JetBrains Mono', monospace">${(segmentTotal / 1000).toFixed(1)}M</text>
            <text x="50%" y="58%" textAnchor="middle" fill={c.textDim} fontSize={9} fontWeight={700} letterSpacing="0.1em">TOTAL</text>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {SEGMENT_DATA.map(s => {
            const pct = segmentTotal ? ((s.value / segmentTotal) * 100).toFixed(0) : "0";
            return (
              <div key={s.name} style={{ padding: "6px 8px", borderRadius: 8, transition: "background 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.background = `${s.color}06`}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 4, background: `linear-gradient(135deg, ${s.color}, ${s.color}aa)`, boxShadow: `0 0 6px ${s.color}30`, flexShrink: 0 }} />
                  <span style={{ color: c.textSec, fontWeight: 500, flex: 1 }}>{s.name}</span>
                  {s.growth != null && <span style={{ fontSize: 9, fontWeight: 700, color: s.growth >= 0 ? c.green : c.red, background: s.growth >= 0 ? c.greenDim : c.redDim, padding: "1px 5px", borderRadius: 3 }}>{s.growth >= 0 ? "+" : ""}{s.growth}%</span>}
                  <span style={{ fontWeight: 700, color: c.textSec, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{fmt(s.value)}</span>
                  <div style={{ width: 40, height: 4, background: c.bg2, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, width: 30, textAlign: "right" }}>{pct}%</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4, marginLeft: 18, fontSize: 8, color: c.textFaint }}>
                  {s.acv && <span>ACV {"$"}{s.acv}K</span>}
                  {s.deals && <span>{s.deals} deals</span>}
                  {s.winRate && <span>Win {s.winRate}%</span>}
                  {s.cycle && <span>{s.cycle}d cycle</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </ChartPanel>
    </div>

    {/* Revenue Composition + Cash Runway */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Revenue Drivers & Treasury</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 28 }}>
      {/* Revenue Waterfall — New Biz / Expansion / Services / Churn */}
      <ChartPanel title="Revenue Composition" glass={c.glass} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}>
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.cyan}18, ${c.green}08)`, border: `1px solid ${c.cyan}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={14} color={c.cyan} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Revenue Composition</div>
            <div style={{ fontSize: 10, color: c.textDim }}>New Business · Expansion · Services · Churn</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={REVENUE_DATA.filter(d => d.newBiz)} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="gNewBiz" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.accent} stopOpacity={0.9}/><stop offset="100%" stopColor={c.accent} stopOpacity={0.6}/></linearGradient>
              <linearGradient id="gExpan" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.green} stopOpacity={0.9}/><stop offset="100%" stopColor={c.green} stopOpacity={0.6}/></linearGradient>
              <linearGradient id="gSvc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.purple} stopOpacity={0.8}/><stop offset="100%" stopColor={c.purple} stopOpacity={0.5}/></linearGradient>
            </defs>
            <CartesianGrid stroke={c.chartGrid} strokeDasharray="4 8" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: c.chartAxis, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: c.chartAxis }} axisLine={false} tickLine={false} tickFormatter={v => `${csym()}${v / 1000}K${csfx()}`} />
            <Tooltip content={<ChartTooltip c={c} />} cursor={{ fill: `${c.accent}06` }} />
            <Bar dataKey="expansion" fill="url(#gExpan)" stackId="rev" radius={[0, 0, 0, 0]} name="Expansion" barSize={28} animationDuration={800} animationEasing="ease-out" />
            <Bar dataKey="newBiz" fill="url(#gNewBiz)" stackId="rev" radius={[0, 0, 0, 0]} name="New Business" animationDuration={1000} animationEasing="ease-out" />
            <Bar dataKey="services" fill="url(#gSvc)" stackId="rev" radius={[4, 4, 0, 0]} name="Services" animationDuration={1200} animationEasing="ease-out" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 14, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${c.borderSub}`, fontSize: 10 }}>
          {[
            { label: "New Biz", color: c.accent, val: "$14.0M" },
            { label: "Expansion", color: c.green, val: "$23.5M" },
            { label: "Services", color: c.purple, val: "$11.6M" },
            { label: "Churn", color: c.red, val: "-$2.3M" },
          ].map(s => (
            <span key={s.label} style={{ display: "flex", alignItems: "center", gap: 4, color: c.textDim, fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              {s.label} <span style={{ fontFamily: "'JetBrains Mono', monospace", color: s.color === c.red ? c.red : c.text, fontWeight: 700, fontSize: 11 }}>{s.val}</span>
            </span>
          ))}
        </div>
      </div>
      </ChartPanel>

      {/* Cash Runway */}
      <ChartPanel title="Cash & Runway" glass={c.glass} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}>
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.green}18, ${c.cyan}08)`, border: `1px solid ${c.green}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={14} color={c.green} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Cash & Runway</div>
              <div style={{ fontSize: 10, color: c.textDim }}>Balance · Net Burn · Months remaining</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}>$62.2M</div>
            <div style={{ fontSize: 9, color: c.textDim }}>28 months runway</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={CASH_RUNWAY} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="gCash" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.green} stopOpacity={0.2}/><stop offset="100%" stopColor={c.green} stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid stroke={c.chartGrid} strokeDasharray="4 8" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: c.chartAxis, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: c.chartAxis }} axisLine={false} tickLine={false} tickFormatter={v => `${csym()}${v / 1000}K${csfx()}`} />
            <Tooltip content={<ChartTooltip c={c} />} cursor={{ stroke: c.green, strokeWidth: 1, strokeDasharray: "3 3", strokeOpacity: 0.3 }} />
            <Area type="monotone" dataKey="balance" stroke={c.green} fill="url(#gCash)" strokeWidth={2.5} name="Cash Balance" animationDuration={1200} animationEasing="ease-out" dot={{ r: 3.5, fill: c.surface, stroke: c.green, strokeWidth: 2 }} />
            <Bar dataKey="inflow" fill={`${c.accent}40`} radius={[3, 3, 0, 0]} barSize={14} name="Inflow" animationDuration={800} animationEasing="ease-out" />
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 14, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${c.borderSub}`, fontSize: 10 }}>
          {[
            { label: "Avg Burn", val: "-$2.0M/mo", color: c.red },
            { label: "Avg Inflow", val: "+$7.8M/mo", color: c.green },
            { label: "Net", val: "+$5.8M/mo", color: c.accent },
          ].map(s => (
            <span key={s.label} style={{ display: "flex", alignItems: "center", gap: 4, color: c.textDim, fontWeight: 600 }}>
              {s.label} <span style={{ fontFamily: "'JetBrains Mono', monospace", color: s.color, fontWeight: 700 }}>{s.val}</span>
            </span>
          ))}
        </div>
      </div>
      </ChartPanel>
    </div>

    {/* Expense Bars + Insights */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Cost Management & Insights</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16, marginBottom: 28 }}>
      {/* Expense Breakdown */}
      <ChartPanel title="OpEx Breakdown" glass={c.glass} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}>
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.amber}18, ${c.red}08)`, border: `1px solid ${c.amber}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={14} color={c.amber} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>OpEx Breakdown</div>
            <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>Actual vs Budget · FY2025 YTD</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={EXPENSE_DATA} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gExpAct" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={c.accent} stopOpacity={0.9} /><stop offset="100%" stopColor={c.accent} stopOpacity={0.6} /></linearGradient>
              <linearGradient id="gExpBud" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={c.textFaint} stopOpacity={0.35} /><stop offset="100%" stopColor={c.textFaint} stopOpacity={0.15} /></linearGradient>
            </defs>
            <CartesianGrid stroke={c.chartGrid} strokeDasharray="4 8" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: c.chartAxis }} axisLine={false} tickLine={false} tickFormatter={v => `${csym()}${v / 1000}K${csfx()}`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: c.textSec, fontWeight: 600 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<ChartTooltip c={c} />} cursor={{ fill: `${c.accent}06` }} />
            <Bar dataKey="actual" fill="url(#gExpAct)" radius={[0, 6, 6, 0]} barSize={16} name="Actual" animationDuration={800} animationEasing="ease-out" />
            <Bar dataKey="budget" fill="url(#gExpBud)" radius={[0, 6, 6, 0]} barSize={16} name="Budget" animationDuration={1000} animationEasing="ease-out" />
          </BarChart>
        </ResponsiveContainer>
        {/* Variance summary */}
        <div style={{ display: "flex", gap: 6, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${c.borderSub}`, flexWrap: "wrap" }}>
          {EXPENSE_DATA.map(d => {
            const v = d.actual - d.budget;
            const over = v > 0;
            const trendArrow = d.trend === "up" ? "↑" : d.trend === "down" ? "↓" : "→";
            return (
              <div key={d.name} style={{ flex: 1, minWidth: 60, padding: "8px 6px", borderRadius: 8, background: over ? c.redDim : c.greenDim, textAlign: "center", border: `1px solid ${over ? c.red : c.green}08`, transition: "transform 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <div style={{ fontSize: 8, color: c.textDim, fontWeight: 700, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.name}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: over ? c.red : c.green, fontFamily: "'JetBrains Mono', monospace" }}>{over ? "+" : ""}{fmt(v)}</div>
                <div style={{ fontSize: 7, color: c.textFaint, marginTop: 2 }}>{d.pct}% rev {trendArrow}</div>
                {d.hc && <div style={{ fontSize: 7, color: c.textFaint, marginTop: 1, fontFamily: "'JetBrains Mono', monospace" }}>{d.hc}/{d.hcPlan} HC</div>}
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
      </ChartPanel>
      <ChartPanel title="AI Insights" glass={c.glass} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}>
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.purple}18, ${c.accent}10)`, border: `1px solid ${c.purple}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      </ChartPanel>
    </div>

    {/* Financial Pipeline Row — Cash Flow + ARR Bridge + Pipeline */}
    <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginTop: 24, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
      Financial Pipeline
    </div>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16, marginTop: 24 }}>

      {/* Cash Flow Waterfall */}
      <ChartPanel title="Cash Flow" glass={c.glass} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "24px 22px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.15s ease" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.green}40`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = c.glassBorder; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.green}18, ${c.accent}08)`, border: `1px solid ${c.green}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 4, background: item.total ? `linear-gradient(90deg, ${c.accent}, ${c.accent}bb)` : item.positive ? `linear-gradient(90deg, ${c.green}, ${c.green}bb)` : `linear-gradient(90deg, ${c.red}cc, ${c.red}88)`, transition: "width 0.8s ease", animation: `barGrow 0.6s ease ${i * 0.08}s both` }} />
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
      </ChartPanel>

      {/* ARR Bridge */}
      <ChartPanel title="ARR Bridge" glass={c.glass} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "24px 22px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.15s ease" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}40`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = c.glassBorder; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.accent}18, ${c.purple}08)`, border: `1px solid ${c.accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
        ].map((item, i) => (
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
      </ChartPanel>

      {/* Pipeline Funnel */}
      <ChartPanel title="Pipeline Funnel" glass={c.glass} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "24px 22px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.15s ease" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.purple}40`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = c.glassBorder; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.purple}18, ${c.green}08)`, border: `1px solid ${c.purple}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
              <div style={{ width: `${s.pct}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`, borderRadius: 5, transition: "width 0.6s ease", animation: `barGrow 0.7s ease ${i * 0.1}s both` }} />
            </div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: `1px solid ${c.borderSub}`, fontSize: 9, color: c.textFaint }}>
          <span>Win rate: <span style={{ color: c.green, fontWeight: 700 }}>32%</span></span>
          <span>Avg cycle: <span style={{ fontWeight: 700, color: c.text }}>42 days</span></span>
          <span>Weighted: <span style={{ fontWeight: 700, color: c.accent }}>$38M</span></span>
        </div>
      </div>
      </ChartPanel>
    </div>

    {/* ═══ Live Status — Cross-View State ═══ */}
    <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginTop: 24, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
      Live Status <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: c.green }}><span style={{ position: "absolute", inset: -2, borderRadius: "50%", background: c.green, opacity: 0.3, animation: "pulse 2s infinite" }} /></span><span style={{ color: c.green, fontWeight: 700, fontSize: 8 }}>LIVE</span></span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
      {/* Close Progress — live from app state */}
      {(() => {
        const ct = closeTasks || [];
        const done = ct.filter(t => t.status === "done").length;
        const prog = ct.filter(t => t.status === "progress").length;
        const pct = ct.length ? Math.round((done / ct.length) * 100) : 0;
        return (
        <div onClick={() => onNav("close")} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.amber}40`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.glassBorder; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckSquare size={15} color={c.amber} />
              <span style={{ fontSize: 12, fontWeight: 700, color: c.text }}>February Close</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: pct === 100 ? c.green : c.accent }}>{pct}%</span>
          </div>
          <div style={{ height: 6, background: c.bg2, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? `linear-gradient(90deg, ${c.green}, ${c.green}cc)` : `linear-gradient(90deg, ${c.accent}, ${c.green}cc)`, borderRadius: 3, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 10 }}>
            <span style={{ color: c.green, fontWeight: 600 }}>{done} done</span>
            <span style={{ color: c.accent, fontWeight: 600 }}>{prog} in progress</span>
            <span style={{ color: c.textFaint }}>{ct.length - done - prog} pending</span>
          </div>
          <div style={{ fontSize: 9, color: c.textDim, marginTop: 6 }}>Click to manage close tasks →</div>
        </div>
        );
      })()}
      {/* Recent Activity — live from app state */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Activity size={15} color={c.purple} />
          <span style={{ fontSize: 12, fontWeight: 700, color: c.text }}>Recent Activity</span>
          <span style={{ marginLeft: "auto", fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.purple}12`, color: c.purple }}>{(activityLog || []).length} events</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {(activityLog || []).slice(0, 5).map((ev, i) => {
            const s = Math.floor((Date.now() - ev.t) / 1000);
            const ago = s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s/60)}m` : `${Math.floor(s/3600)}h`;
            const typeColor = { auth: c.green, nav: c.accent, close: c.amber, action: c.purple, export: c.cyan }[ev.type] || c.textDim;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 4 ? `1px solid ${c.borderSub}` : "none", animation: i === 0 ? "fadeSlideUp 0.3s ease-out" : "none" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: typeColor, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: c.textSec, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.msg}</span>
                <span style={{ fontSize: 8, color: c.textFaint, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{ago}</span>
              </div>
            );
          })}
          {(!activityLog || activityLog.length === 0) && <div style={{ fontSize: 10, color: c.textFaint, padding: "8px 0" }}>No recent activity</div>}
        </div>
      </div>

      {/* Team Online — digital office presence */}
      <div onClick={() => onNav("team")} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "pointer", transition: "all 0.2s", gridColumn: "span 2" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}30`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Users size={15} color={c.accent} />
          <span style={{ fontSize: 12, fontWeight: 700, color: c.text }}>Your Team</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${c.green}12`, color: c.green }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} />3 online
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { name: userName || "You", status: "online", doing: "Reviewing dashboard", initials: (userName || "You").split(" ").map(w => w[0]).join("").slice(0,2) },
            { name: "Sarah C.", status: "online", doing: "Updating Q1 forecast", initials: "SC" },
            { name: "Priya P.", status: "online", doing: "Closing AP accruals", initials: "PP" },
            { name: "James R.", status: "away", doing: "In a meeting", initials: "JR" },
            { name: "David K.", status: "offline", doing: "Last seen 1h ago", initials: "DK" },
          ].map((m, i) => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 10, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, minWidth: 160 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: [`linear-gradient(135deg, ${c.accent}, ${c.purple})`, `linear-gradient(135deg, ${c.green}, ${c.cyan})`, `linear-gradient(135deg, ${c.purple}, ${c.accent})`, `linear-gradient(135deg, ${c.amber}, ${c.red})`, `linear-gradient(135deg, ${c.cyan}, ${c.green})`][i % 5], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>{m.initials}</div>
                <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: m.status === "online" ? c.green : m.status === "away" ? c.amber : c.textFaint, border: `2px solid ${c.surfaceAlt}` }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: c.text }}>{m.name}</div>
                <div style={{ fontSize: 8, color: c.textFaint }}>{m.doing}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, color: c.textDim, marginTop: 10 }}>Click to open Team workspace →</div>
      </div>
    </div>

    {/* Cohort Retention Heatmap */}
    <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginTop: 24, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
      Retention & Cohorts
    </div>
    <ChartPanel title="Cohort Retention" glass={c.glass} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}>
    <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", transition: "all 0.15s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.cyan}18, ${c.green}08)`, border: `1px solid ${c.cyan}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={14} color={c.cyan} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Revenue Retention by Cohort</div>
            <div style={{ fontSize: 10, color: c.textDim }}>Net dollar retention (%) over time</div>
          </div>
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 5, background: c.greenDim, color: c.green, border: `1px solid ${c.green}12` }}>NDR 118%</div>
      </div>
      {/* Heatmap grid */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 3, fontSize: 10 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 9, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>Cohort</th>
              {["M0", "M3", "M6", "M9", "M12"].map(h => (
                <th key={h} style={{ textAlign: "center", padding: "6px 8px", fontSize: 9, fontWeight: 700, color: c.textFaint, letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COHORT_DATA.map((row, ri) => (
              <tr key={row.cohort}>
                <td style={{ padding: "6px 8px", fontWeight: 600, color: c.textSec, whiteSpace: "nowrap" }}>{row.cohort}</td>
                {[row.m0, row.m3, row.m6, row.m9, row.m12].map((val, ci) => {
                  if (val == null) return <td key={ci} style={{ padding: "6px 8px", textAlign: "center", borderRadius: 6 }}><span style={{ color: c.textFaint, fontSize: 9 }}>—</span></td>;
                  const intensity = val >= 95 ? 1 : val >= 90 ? 0.75 : val >= 85 ? 0.5 : 0.3;
                  const heatColor = val >= 95 ? c.green : val >= 90 ? c.cyan : val >= 85 ? c.amber : c.red;
                  return (
                    <td key={ci} style={{
                      padding: "6px 8px", textAlign: "center", borderRadius: 6,
                      background: `${heatColor}${Math.round(intensity * 18).toString(16).padStart(2, "0")}`,
                      fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                      color: val >= 95 ? c.green : val >= 90 ? c.cyan : val >= 85 ? c.amber : c.red,
                      transition: "all 0.3s",
                    }}>{val}%</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${c.borderSub}`, fontSize: 9, color: c.textDim, alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: `${c.green}25`, border: `1px solid ${c.green}40` }} />95%+</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: `${c.cyan}20`, border: `1px solid ${c.cyan}30` }} />90-95%</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: `${c.amber}15`, border: `1px solid ${c.amber}25` }} />85-90%</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: `${c.red}12`, border: `1px solid ${c.red}20` }} />&lt;85%</span>
        <span style={{ marginLeft: "auto", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: c.green }}>Best: Q3 '24 (98% → 95%)</span>
      </div>
    </div>
    </ChartPanel>

    {/* Cross-sell banner */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
      {/* Partner Program */}
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s", cursor: "pointer" }}
        onClick={() => { try { navigator.clipboard.writeText("https://finance-os.app?ref=FOS-DEMO"); } catch {} toast("Referral link copied — earn 20% recurring commission", "success"); }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.green}40`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; }}
      >
        <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${c.green}18, ${c.green}08)`, border: `1px solid ${c.green}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Users size={18} color={c.green} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 3 }}>Partner & Referral Program</div>
          <div style={{ fontSize: 11, color: c.textDim, lineHeight: 1.4 }}>Earn 20% recurring commission on every referral. They get 20% off their first year.</div>
          <div style={{ fontSize: 9, color: c.textFaint, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>Your code: FOS-DEMO</div>
        </div>
        <div style={{ fontSize: 10, padding: "7px 14px", borderRadius: 8, border: `1px solid ${c.green}20`, background: c.greenDim, color: c.green, fontWeight: 700, whiteSpace: "nowrap", fontFamily: "inherit" }}>Copy Link</div>
      </div>
      {/* Ecosystem */}
      <div style={{ background: `linear-gradient(135deg, ${c.accent}06, ${c.purple}04)`, border: `1px solid ${c.accent}15`, borderRadius: 14, padding: "22px 24px", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s", cursor: "pointer" }}
        onClick={() => window.open("https://vaultline.vercel.app", "_blank")}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}40`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.accent}15`; }}
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

    {/* ── Product Tutorials & Interactive Video Guides ── */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, marginTop: 32 }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Product Tutorials & Guides</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
      <span style={{ fontSize: 9, color: c.accent, fontWeight: 600, cursor: "pointer" }} onClick={() => toast("Full video library coming soon", "info")}>View All ▸</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
      {PRODUCT_GUIDES.slice(0, 6).map(guide => (
        <div key={guide.id} onClick={() => toast(`Playing: ${guide.title}`, "info")} style={{
          background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden",
          cursor: "pointer", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}30`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${c.accent}10`; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {/* Video thumbnail */}
          <div style={{ height: 100, background: guide.thumb, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              <div style={{ width: 0, height: 0, borderLeft: "12px solid #333", borderTop: "7px solid transparent", borderBottom: "7px solid transparent", marginLeft: 3 }} />
            </div>
            <span style={{ position: "absolute", bottom: 8, right: 8, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "rgba(0,0,0,0.7)", color: "#fff", fontFamily: "'JetBrains Mono', monospace", zIndex: 1 }}>{guide.duration}</span>
            <span style={{ position: "absolute", top: 8, left: 8, fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: "rgba(255,255,255,0.9)", color: "#333", letterSpacing: "0.04em", zIndex: 1 }}>{guide.category.toUpperCase()}</span>
          </div>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 4, lineHeight: 1.3 }}>{guide.title}</div>
            <div style={{ fontSize: 10, color: c.textDim, lineHeight: 1.4, marginBottom: 8 }}>{guide.desc}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: c.textFaint }}>{guide.views.toLocaleString()} views</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: c.accent, display: "flex", alignItems: "center", gap: 3 }}>Watch Now <ChevronRight size={9} /></span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* ── Trusted by Enterprise Finance Teams — Real logos ── */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Trusted by Enterprise Finance Teams</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
    </div>
    <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 28px", marginBottom: 24, boxShadow: c.cardGlow }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 18 : 34, flexWrap: "wrap", transition: "all 0.3s" }}>
        {[
          { name: "Coca-Cola", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/200px-Coca-Cola_logo.svg.png", h: 20 },
          { name: "Best Buy", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Best_Buy_Logo.svg/200px-Best_Buy_Logo.svg.png", h: 26 },
          { name: "Target", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/120px-Target_logo.svg.png", h: 28 },
          { name: "JPMorgan Chase", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/J.P._Morgan_Logo_2008_1.svg/200px-J.P._Morgan_Logo_2008_1.svg.png", h: 18 },
          { name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deloitte.svg/200px-Deloitte.svg.png", h: 18 },
          { name: "Ernst & Young", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/EY_logo_2019.svg/120px-EY_logo_2019.svg.png", h: 26 },
          { name: "Saks Fifth Avenue", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Saks_Fifth_Avenue_Logo.svg/200px-Saks_Fifth_Avenue_Logo.svg.png", h: 14 },
          { name: "Ohio State", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Ohio_State_University_seal.svg/120px-Ohio_State_University_seal.svg.png", h: 30 },
        ].map(brand => (
          <div key={brand.name} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 4px", transition: "all 0.25s", cursor: "default", opacity: 0.55, filter: "grayscale(1)" }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.filter = "grayscale(0)"; e.currentTarget.style.transform = "scale(1.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "0.55"; e.currentTarget.style.filter = "grayscale(1)"; e.currentTarget.style.transform = "scale(1)"; }}
            title={brand.name}
          >
            <img src={brand.logo} alt={brand.name} style={{ height: brand.h, maxWidth: 100, objectFit: "contain" }} loading="lazy"
              onError={e => { e.target.style.display = "none"; e.target.parentElement.innerHTML = `<span style="font-size:12px;font-weight:800;color:${c.textDim};letter-spacing:0.02em;white-space:nowrap">${brand.name}</span>`; }}
            />
          </div>
        ))}
      </div>
    </div>

    {/* ── Industry Recognition ── */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Industry Recognition</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
      {[
        { source: "Gartner", report: "Market Guide for Cloud FP&A, 2026", quote: "FinanceOS represents the next generation of FP&A platforms, combining real-time intelligence with enterprise-grade security.", color: c.accent, initial: "G" },
        { source: "Forrester", report: "Wave: Financial Planning, Q1 2026", quote: "Among emerging FP&A vendors, FinanceOS stands out for speed-to-value, with 60% faster close cycles.", color: c.green, initial: "F" },
        { source: "IDC", report: "MarketScape: EPM Vendors, 2026", quote: "The personalized dashboard approach is a competitive differentiator. Enterprise clients get branded portals with 95% adoption.", color: c.purple, initial: "I" },
      ].map(a => (
        <div key={a.source} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "20px 22px", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${a.color}30`; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: `${a.color}12`, border: `1px solid ${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: a.color }}>{a.initial}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: c.text }}>{a.source}</div>
              <div style={{ fontSize: 9, color: c.textFaint }}>{a.report}</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: c.textDim, lineHeight: 1.5, fontStyle: "italic", borderLeft: `2px solid ${a.color}30`, paddingLeft: 12 }}>"{a.quote}"</div>
        </div>
      ))}
    </div>

    {/* ── Content Library Stats ── */}
    <div style={{ background: `linear-gradient(135deg, ${c.accent}05, ${c.green}04, ${c.purple}03)`, border: `1px solid ${c.accent}12`, borderRadius: 14, padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 3 }}>Finance Intelligence Library</div>
        <div style={{ fontSize: 10, color: c.textDim }}>Analyst reports · Benchmark data · Strategy guides · Templates · Video library</div>
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {[
          { value: "47", label: "Reports" },
          { value: "12K+", label: "Downloads" },
          { value: "2,000+", label: "Subscribers" },
          { value: "24", label: "Videos" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

// ══════════════════════════════════════════════════════════════
// COPILOT VIEW
// ══════════════════════════════════════════════════════════════
const COPILOT_RESPONSES = {
  "revenue": "Revenue beat of +$2.09M (+4.3%) is driven entirely by enterprise outperformance.\n\n**Enterprise (>$100K ACV):** +$3.3M above plan (+16.9%)\n• ACV expansion: avg deal up 28% ($142K → $182K)\n• AI module attach: 34% of new deals (vs 12% planned)\n• Three unplanned $300K+ deals from inbound\n\n**Mid-market ($25K-$100K):** -$800K below plan (-4.2%)\n**SMB (<$25K):** -$400K below plan (-3.8%)\n\nNDR at 118% — expansion contributing $4.2M above initial contracts.\n\n**Recommendation:** Double down on enterprise AI module. Investigate mid-market win rate decline vs competitors.",
  "pigment": "**Competitive Position — Head to Head**\n\nWin rate: We win 42% of competitive deals. Was 35% two quarters ago — improving.\n\n**Where we win:**\n• Visible AI reasoning — legacy tools don't have this\n• Published pricing ($499-$3,999/mo flat vs opaque $65K+ entry)\n• Self-serve onboarding (days vs 3-6 month implementation)\n\n**Where incumbents win:**\n• Fortune 500 logos and enterprise references\n• Module breadth (workforce planning, SPM)\n• Larger partner ecosystems\n\nOur Rule of 40 (52.1) vs estimated 40-45 for mid-market incumbents.\n\n**Recommendation:** Focus positioning on AI transparency and TCO. Build customer advisory board for enterprise proof points.",
  "guidance": "**Raise guidance to $52-54M.**\n\nThe math:\n• YTD actual: $51.19M (+$2.09M vs plan)\n• Current run rate: $52.8M full year\n• Enterprise pipeline weighted at $38M in stages 3-5\n\nWhy it's structural:\n• Enterprise ACV up 28% — pricing power, not luck\n• AI module at 34% attach creates new revenue layer\n• NDR at 118% means base compounds\n\nScenario range:\n• Bear: $50.5M (mid-market worsens)\n• Base: $52.8M (current trajectory)\n• Bull: $54.2M (Q4 flush + AI v2)\n\n**Recommendation:** Present $52-54M range to board. Pair with competitive SWAT team request.",
  "margin": "**Gross Margin Analysis: 84.7% (+2.1pp YoY)**\n\n**What's driving the improvement:**\n• Cloud cost optimization: moved to reserved instances → -$380K/yr\n• Support automation: AI deflection at 42% → headcount flat despite 24% growth\n• Revenue mix shift: Enterprise (87% margin) growing faster than SMB (78% margin)\n\n**Risks to watch:**\n• AI inference costs scaling with usage — currently $0.004/query, could 3x\n• Mid-market support tickets up 18% (churn signal?)\n\n**Benchmark:** SaaS median 72%. We're top-decile at 84.7%.\n\n**Recommendation:** Lock in 3-year cloud commitments while rates are favorable. Monitor AI cost per query weekly.",
  "burn": "**Burn Multiple: 0.8x (efficient growth)**\n\nFormula: Net Burn / Net New ARR = $9.4M / $11.7M = 0.80x\n\n**Breakdown:**\n• Net new ARR: $11.7M (from $36.9M → $48.6M)\n• Total OpEx: $39.6M\n• Cash consumed: $9.4M net burn\n\n**Benchmark context:**\n• <1.0x = best-in-class efficiency (Bessemer says 'superhuman')\n• 1.0-1.5x = good\n• >2.0x = concerning\n\n**Cash position:** $12.8M with 34 months runway at current burn.\n\n**Recommendation:** Maintain below 1.0x. Selective hiring in enterprise sales only — each rep producing $1.8M ARR.",
  "churn": "**Churn & Retention Analysis**\n\n**Logo churn:** 4.2% annualized (8 accounts lost of 192)\n• 5 were SMB (<$25K) — expected at this segment\n• 2 mid-market lost to competitors on price\n• 1 enterprise churned due to M&A (acquired company standardized)\n\n**Revenue churn:** 2.1% gross, offset by 118% NDR\n• Net revenue retention: 118% means every $1 from last year is now $1.18\n• Expansion: AI module upsell (34% attach), seat expansion, tier upgrades\n\n**Cohort trend:** 2023 cohort NDR at 124% (maturing well). 2024 cohort at 112% (still early).\n\n**Recommendation:** Launch mid-market win-back campaign targeting the 2 competitor losses. Pricing flexibility in the $25-50K band.",
  "expense": "**Expense Variance Summary — YTD**\n\n**Over budget (action needed):**\n• S&M: +$730K over (+5.0%) — Hiring $420K ahead of plan, events $180K for re:Invent\n• Cloud/Infra: +$455K over (+12.4%) — AI inference costs scaling faster than modeled\n\n**Under budget (favorable):**\n• R&D: -$278K under (-1.4%) — two senior hires delayed to Q3\n• G&A: -$255K under (-5.0%) — legal fees lower than budgeted\n\n**Total OpEx:** $39.6M vs $39.4M budget (+$200K net, +0.5%)\n\n**Recommendation:** S&M overspend is deliberate (pipeline ROI 7.2x). Cloud costs need attention — set up inference cost alerts at $0.006/query threshold.",
  "forecast": "**Forecast Accuracy Assessment**\n\n**Current model:** ETS + XGBoost + Linear ensemble\n• MAPE: 3.2% (industry median: 8-12%)\n• Best on: Revenue, COGS (1.8% MAPE)\n• Weakest on: S&M timing (6.1% MAPE — event spend lumpy)\n\n**14 drivers tracked:**\n• Pipeline velocity, win rates, ACV, NDR, logo churn\n• Headcount plan, cloud costs, AI usage, event calendar\n• 3 external: Fed rate, SaaS multiples, hiring index\n\n**Confidence intervals:**\n• Q3 revenue: $13.2M ± $420K (95% CI)\n• Full year: $52.8M ± $1.6M\n\n**Recommendation:** Retrain weekly during Q3 (board prep). Add competitor pricing as a driver — 2 recent losses correlated with competitor price drops.",
  "default": "I have your company's full financials loaded from the GL database. I can analyze your actual vs budget performance, identify variances, and help with forecasting.\n\nHere's what I can help with:\n• Variance analysis — drill into any line item\n• Revenue trends — monthly, quarterly, annualized\n• Expense breakdown — by category and department\n• Gross margin and EBITDA analysis\n• Scenario modeling — what-if on key drivers\n• Competitive benchmarks — SaaS metrics comparison\n\nWhat would you like to explore?",
};

// Inline markdown: **bold** and `code`
const renderInline = (text, c) => {
  const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <span key={i} style={{ fontWeight: 700, color: c.text }}>{part.slice(2, -2)}</span>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} style={{ fontSize: 11, padding: "1px 5px", borderRadius: 4, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, color: c.accent, fontFamily: "'JetBrains Mono', monospace" }}>{part.slice(1, -1)}</code>;
    return <span key={i}>{part}</span>;
  });
};

const CopilotView = ({ c, toast, logActivity }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome to FinanceOS AI Copilot.\n\nI have your financial data loaded from the GL database. Ask me anything about your P&L, variances, forecasts, or SaaS metrics and I'll show my reasoning before answering.\n\nTry: \"What's driving our biggest variances?\" or \"How's our gross margin trending?\"" },
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
    if (logActivity) logActivity(`AI query: "${userMsg.slice(0, 40)}${userMsg.length > 40 ? "…" : ""}"`, "action");

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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>AI Copilot</div><span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.purple}15`, color: c.purple, letterSpacing: "0.06em" }}>CLAUDE</span></div>
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
              <div style={{ width: 56, height: 56, borderRadius: 12, background: `linear-gradient(135deg, ${c.purple}15, ${c.accent}08)`, border: `1px solid ${c.purple}10`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Sparkles size={24} color={c.purple} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.text, marginBottom: 6 }}>Ask me anything</div>
              <div style={{ fontSize: 12, color: c.textDim, lineHeight: 1.6, marginBottom: 16 }}>I can analyze your P&L variances, forecast revenue, compare scenarios, and surface hidden patterns in your data.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
                {["What drove the $2.09M revenue beat?", "How do we compare to legacy FP&A tools?", "Should we raise FY guidance?", "Where are we over budget on expenses?"].map(q => (
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
                if (line.startsWith("• ")) return <div key={j} style={{ paddingLeft: 14, color: c.textSec, position: "relative", marginBottom: 2 }}><span style={{ position: "absolute", left: 0, color: c.accent }}>•</span>{renderInline(line.slice(2), c)}</div>;
                return <div key={j}>{line ? renderInline(line, c) : <br />}</div>;
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
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px ${c.accent}40`; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 12px ${c.accent}30`; }}
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
const PnlView = ({ c, onNav, toast, orgName, glData, onDrawer }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  // Use database GL data when available, fall back to hardcoded demo data
  const pnlData = glData?.pnl || PNL_DATA;
  const isLiveData = glData?.source === "database";
  const [collapsed, setCollapsed] = useState({});
  const [sortCol, setSortCol] = useState(null); // null | "actual" | "budget" | "variance" | "pctrev"
  const [sortDir, setSortDir] = useState("desc");
  const toggle = (section) => setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  const handleSort = (col) => {
    if (sortCol === col) { setSortDir(d => d === "desc" ? "asc" : "desc"); }
    else { setSortCol(col); setSortDir("desc"); }
  };
  const sortRows = (rows) => {
    if (!sortCol) return rows;
    return [...rows].sort((a, b) => {
      let va, vb;
      if (sortCol === "actual") { va = a.actual; vb = b.actual; }
      else if (sortCol === "budget") { va = a.budget; vb = b.budget; }
      else if (sortCol === "variance") { va = (a.actual || 0) - (a.budget || 0); vb = (b.actual || 0) - (b.budget || 0); }
      else if (sortCol === "pctrev") { va = a.actual / (pnlData[0]?.total?.actual || 1); vb = b.actual / (pnlData[0]?.total?.actual || 1); }
      else return 0;
      return sortDir === "desc" ? (vb || 0) - (va || 0) : (va || 0) - (vb || 0);
    });
  };

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
        <span style={{ fontSize: 9, opacity: 0.7, marginLeft: 4 }}>({vp >= 0 ? "+" : ""}{(vp || 0).toFixed(1)}%)</span>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.accent}15, ${c.green}08)`, border: `1px solid ${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <FileText size={17} color={c.accent} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>P&L Statement</div>
              <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.green}15`, color: c.green, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} />LIVE</span>
            </div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>FY2025 YTD · Click any variance to ask AI Copilot for root cause analysis</div>
            {/* Collaborators viewing this report */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              {[
                { init: "PP", name: "Priya Patel", color: `linear-gradient(135deg, ${c.purple}, ${c.accent})` },
                { init: "SC", name: "Sarah Chen", color: `linear-gradient(135deg, ${c.green}, ${c.cyan})` },
                { init: "JR", name: "James Rodriguez", color: `linear-gradient(135deg, ${c.amber}, ${c.red})` },
              ].map((collab, i) => (
                <div key={collab.init} title={`${collab.name} — viewing`} style={{ width: 22, height: 22, borderRadius: 7, background: collab.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "#fff", marginLeft: i > 0 ? -6 : 0, border: `2px solid ${c.bg2}`, cursor: "pointer" }}>{collab.init}</div>
              ))}
              <span style={{ fontSize: 9, color: c.textFaint, marginLeft: 4 }}>3 viewing · </span>
              <span onClick={() => toast("Thread opened for P&L discussion", "success")} style={{ fontSize: 9, color: c.accent, fontWeight: 600, cursor: "pointer" }}>▹ 4 comments</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 9, color: c.textFaint }}>Last close: Feb 28</span>
          <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 5, background: c.accentDim, color: c.accent, fontWeight: 700 }}>FY2025 YTD</span>
        </div>
      </div>
      <ExportBar c={c} title=""
        onCSV={() => { const rows = pnlData.flatMap(s => [...s.rows.map(r => [s.section, r.name, r.actual, r.budget, r.actual - r.budget, r.note || ""]), [s.section, s.total.name, s.total.actual, s.total.budget, s.total.actual - s.total.budget, ""]]); downloadCSV("financeos-pnl-fy2025.csv", ["Section","Line Item","Actual ($K)","Budget ($K)","Variance ($K)","Notes"], rows); toast("P&L exported as CSV", "success"); }}
        onPDF={() => { const rows = pnlData.flatMap(s => [...s.rows.map(r => [r.name, "$" + r.actual.toLocaleString() + "K", "$" + r.budget.toLocaleString() + "K", "$" + (r.actual - r.budget).toLocaleString() + "K", ((r.actual - r.budget) / Math.abs(r.budget) * 100).toFixed(1) + "%"]), [s.total.name, "$" + s.total.actual.toLocaleString() + "K", "$" + s.total.budget.toLocaleString() + "K", "$" + (s.total.actual - s.total.budget).toLocaleString() + "K", ((s.total.actual - s.total.budget) / Math.abs(s.total.budget) * 100).toFixed(1) + "%"]]); downloadPDF("PnL Statement FY2025", ["Line Item", "Actual", "Budget", "Variance", "Var %"], rows, { subtitle: orgName || "Financial Report" }); toast("P\x26L exported as PDF", "success"); }}
      />
      {/* Financial Summary KPIs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Financial Summary</div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Revenue", value: fmt(pnlData[0]?.total?.actual || 0), delta: fmtPct(variancePct(pnlData[0]?.total?.actual || 0, pnlData[0]?.total?.budget || 1)), fav: true, color: c.green },
          { label: "Gross Profit", value: fmt((pnlData[0]?.total?.actual || 0) - (pnlData[1]?.total?.actual || 0)), delta: `${(((pnlData[0]?.total?.actual || 0) - (pnlData[1]?.total?.actual || 0)) / (pnlData[0]?.total?.actual || 1) * 100).toFixed(1)}% margin`, fav: true, color: c.accent },
          { label: "Total OpEx", value: fmt(pnlData[2]?.total?.actual || 0), delta: fmtPct(variancePct(pnlData[2]?.total?.actual || 0, pnlData[2]?.total?.budget || 1)), fav: (pnlData[2]?.total?.actual || 0) <= (pnlData[2]?.total?.budget || 0), color: c.amber },
          { label: "EBITDA", value: fmt((pnlData[0]?.total?.actual || 0) - (pnlData[1]?.total?.actual || 0) - (pnlData[2]?.total?.actual || 0) + (pnlData[3]?.total?.actual || 0)), delta: `${(((pnlData[0]?.total?.actual || 0) - (pnlData[1]?.total?.actual || 0) - (pnlData[2]?.total?.actual || 0) + (pnlData[3]?.total?.actual || 0)) / (pnlData[0]?.total?.actual || 1) * 100).toFixed(1)}% margin`, fav: true, color: c.green },
        ].map(k => (
          <div key={k.label} onClick={() => onDrawer && onDrawer(k.label)} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "16px 18px", transition: "all 0.2s", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${k.color}40`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${k.color}10`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</div>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: `${k.color}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: k.color }} />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.03em", marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: k.fav ? c.green : c.red, padding: "2px 8px", borderRadius: 5, background: k.fav ? `${c.green}10` : `${c.red}10`, display: "inline-block" }}>{k.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Detailed Breakdown</div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
        <span style={{ fontSize: 9, color: c.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>{pnlData.reduce((a, s) => a + (s.rows?.length || 0), 0)} items</span>
      </div>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: c.cardGlow }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${c.borderBright}` }}>
              {[
                { key: null, label: "Line Item", align: "left" },
                { key: "actual", label: "Actual", align: "right" },
                { key: "budget", label: "Budget", align: "right" },
                { key: "variance", label: "Variance", align: "right" },
                { key: "pctrev", label: "% Rev", align: "right" },
                { key: null, label: "Notes", align: "left" },
              ].map(h => (
                <th key={h.label} onClick={() => h.key && handleSort(h.key)} style={{
                  padding: "14px 14px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
                  color: sortCol === h.key ? c.accent : c.textFaint, textAlign: h.align,
                  background: c.surfaceAlt, position: "sticky", top: 0, zIndex: 2,
                  borderBottom: `2px solid ${sortCol === h.key ? c.accent : c.borderBright}`,
                  cursor: h.key ? "pointer" : "default", transition: "all 0.15s", userSelect: "none",
                }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {h.label}
                    {sortCol === h.key && <span style={{ fontSize: 10 }}>{sortDir === "desc" ? "↓" : "↑"}</span>}
                    {h.key && sortCol !== h.key && <span style={{ fontSize: 8, opacity: 0.3 }}>⇅</span>}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pnlData.map((section, si) => {
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
                ...(!isCollapsed ? sortRows(section.rows).map((row, ri) => (
                  <tr key={`row-${si}-${ri}`} style={{ borderBottom: `1px solid ${c.borderSub}`, background: ri % 2 === 1 ? `${c.surfaceAlt}60` : "transparent", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = c.accentMid || c.accentDim}
                    onMouseLeave={e => e.currentTarget.style.background = ri % 2 === 1 ? `${c.surfaceAlt}60` : "transparent"}
                  >
                    <td style={{ padding: "10px 14px 10px 34px", color: c.text, fontWeight: 500 }}>{row.name}</td>
                    <td style={{ textAlign: "right", padding: "10px 14px", color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(row.actual)}</td>
                    <td style={{ textAlign: "right", padding: "10px 14px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(row.budget)}</td>
                    <VarCell actual={row.actual} budget={row.budget} revenue={isRev} />
                    <td style={{ textAlign: "right", padding: "10px 14px", color: c.textDim, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{((row.actual / (pnlData[0]?.total?.actual || 1)) * 100).toFixed(1)}%</td>
                    <td style={{ padding: "10px 14px", color: c.textDim, fontSize: 10, maxWidth: 120 }}>{row.note || ""}</td>
                  </tr>
                )) : []),
                !isCollapsed && (
                  <tr key={`tot-${si}`} style={{ borderTop: `2px solid ${c.borderBright}`, borderBottom: `2px solid ${c.borderBright}`, background: `${sectionColor}05` }}>
                    <td style={{ padding: "8px 12px", fontWeight: 700, color: c.text }}>{section.total.name}</td>
                    <td style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700, color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(section.total.actual)}</td>
                    <td style={{ textAlign: "right", padding: "8px 12px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{fmt(section.total.budget)}</td>
                    <VarCell actual={section.total.actual} budget={section.total.budget} revenue={isRev} />
                    <td style={{ textAlign: "right", padding: "8px 12px", color: c.textDim, fontSize: 11 }}>{((section.total.actual / (pnlData[0]?.total?.actual || 1)) * 100).toFixed(1)}%</td>
                    <td />
                  </tr>
                ),
              ];
            }).flat().filter(Boolean)}
            {/* Grand totals — computed from pnlData */}
            {(() => {
              const rev = pnlData[0]?.total?.actual || 0;
              const revB = pnlData[0]?.total?.budget || 0;
              const cogs = pnlData[1]?.total?.actual || 0;
              const cogsB = pnlData[1]?.total?.budget || 0;
              const opex = pnlData[2]?.total?.actual || 0;
              const opexB = pnlData[2]?.total?.budget || 0;
              const other = pnlData[3]?.total?.actual || 0;
              const otherB = pnlData[3]?.total?.budget || 0;
              const gp = rev - cogs;
              const gpB = revB - cogsB;
              const ebitda = gp - opex + other;
              const ebitdaB = gpB - opexB + otherB;
              const gpVar = gp - gpB;
              const ebitdaVar = ebitda - ebitdaB;
              return (<>
            <tr style={{ borderTop: `2px solid ${c.borderBright}`, background: `${c.accent}05` }}>
              <td style={{ padding: "12px 14px", fontWeight: 800, fontSize: 13, color: c.text }}>Gross Profit</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{fmt(gp)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{fmt(gpB)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: gpVar >= 0 ? c.green : c.red, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{gpVar >= 0 ? "+" : ""}{fmt(gpVar)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{rev > 0 ? (gp / rev * 100).toFixed(1) : "0.0"}%</td>
              <td />
            </tr>
            <tr style={{ borderTop: `2px solid ${c.borderBright}`, background: `linear-gradient(90deg, ${c.green}06, transparent)` }}>
              <td style={{ padding: "12px 14px", fontWeight: 800, fontSize: 13, color: c.green }}>EBITDA</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{fmt(ebitda)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{fmt(ebitdaB)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: ebitdaVar >= 0 ? c.green : c.red, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{ebitdaVar >= 0 ? "+" : ""}{fmt(ebitdaVar)}</td>
              <td style={{ textAlign: "right", padding: "12px 14px", fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{rev > 0 ? (ebitda / rev * 100).toFixed(1) : "0.0"}%</td>
              <td />
            </tr>
              </>);
            })()}
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

const ForecastView = ({ c, toast, onDrawer, onNav, closeTasks }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
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
        onCSV={() => { downloadCSV("financeos-forecast.csv", ["Month","Actual ($K)","Base ($K)","Bull ($K)","Bear ($K)"], FORECAST_DATA.map(d => [d.month, d.actual || "", d.base || "", d.bull || "", d.bear || ""])); toast("Forecast exported as CSV", "success"); }}
        onPDF={() => { downloadPDF("Revenue Forecast FY2025", ["Month", "Actual", "Base", "Bull", "Bear"], FORECAST_DATA.map(d => [d.month, d.actual ? "$" + d.actual + "K" : "—", d.base ? "$" + d.base + "K" : "—", d.bull ? "$" + d.bull + "K" : "—", d.bear ? "$" + d.bear + "K" : "—"])); toast("Forecast exported as PDF", "success"); }}
      />
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.green}15, ${c.purple}08)`, border: `1px solid ${c.green}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <Brain size={17} color={c.green} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Forecast Optimizer</div>
              <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.purple}15`, color: c.purple, letterSpacing: "0.06em" }}>ML</span>
            </div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>ML ensemble with live sensitivity sliders · MAPE {retrained ? "2.9%" : "3.2%"} · 14 drivers</div>
            {/* Collaborators */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              {[
                { init: "SC", name: "Sarah Chen", color: `linear-gradient(135deg, ${c.green}, ${c.cyan})` },
                { init: "DK", name: "David Kim", color: `linear-gradient(135deg, ${c.cyan}, ${c.green})` },
              ].map((collab, i) => (
                <div key={collab.init} title={`${collab.name} — editing`} style={{ width: 22, height: 22, borderRadius: 7, background: collab.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "#fff", marginLeft: i > 0 ? -6 : 0, border: `2px solid ${c.bg2}`, cursor: "pointer" }}>{collab.init}</div>
              ))}
              <span style={{ fontSize: 9, color: c.textFaint, marginLeft: 4 }}>2 collaborators</span>
            </div>
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
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Forecast Model</div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
      </div>
      <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.green}18, ${c.accent}10)`, border: `1px solid ${c.green}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
            <CartesianGrid stroke={c.chartGrid || c.borderSub} strokeDasharray="4 8" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: c.chartAxis || c.textDim, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: c.chartAxis || c.textDim }} axisLine={false} tickLine={false} tickFormatter={v => `${csym()}${(v/1000).toFixed(0)}M${csfx()}`} />
            <Tooltip content={<ChartTooltip c={c} />} cursor={{ stroke: c.accent, strokeWidth: 1, strokeDasharray: "3 3", strokeOpacity: 0.3 }} />
            <Area type="monotone" dataKey="bull" stroke="none" fill="url(#gBull)" name="Bull Range" animationDuration={1200} animationEasing="ease-out" />
            <Area type="monotone" dataKey="bear" stroke="none" fill="url(#gBear)" name="Bear Range" animationDuration={1200} animationEasing="ease-out" />
            <Area type="monotone" dataKey="actual" stroke={c.accent} fill="url(#gActFc)" strokeWidth={2.5} name="Actual" dot={{ r: 4, fill: c.surface, stroke: c.accent, strokeWidth: 2.5 }} activeDot={{ r: 7, fill: c.accent, stroke: c.surface, strokeWidth: 3, style: { filter: `drop-shadow(0 0 6px ${c.accent})` } }} connectNulls={false} animationDuration={1000} animationEasing="ease-out" />
            <Line type="monotone" dataKey="base" stroke={c.green} strokeWidth={2} strokeDasharray="8 4" name="Base Forecast" dot={{ r: 3.5, fill: c.surface, stroke: c.green, strokeWidth: 2 }} activeDot={{ r: 6, fill: c.green, stroke: c.surface, strokeWidth: 2, style: { filter: `drop-shadow(0 0 6px ${c.green})` } }} connectNulls={false} animationDuration={1200} animationEasing="ease-out" />
            <Line type="monotone" dataKey="bull" stroke={c.green} strokeWidth={1} strokeDasharray="3 3" name="Bull" dot={false} connectNulls={false} opacity={0.35} animationDuration={1400} />
            <Line type="monotone" dataKey="bear" stroke={c.red} strokeWidth={1} strokeDasharray="3 3" name="Bear" dot={false} connectNulls={false} opacity={0.35} animationDuration={1400} />
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
            <span style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: c.green }}>Base: ${scenario.toFixed(1)}M</span>
            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: c.textFaint }}>Spread: ${((FORECAST_DATA[11]?.bull || 0) / 1000).toFixed(1)}M – ${((FORECAST_DATA[11]?.bear || 0) / 1000).toFixed(1)}M</span>
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Forecast Accuracy & Scenarios</div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
        {/* Accuracy gauge */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 22px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: c.text, marginBottom: 12 }}>Model Accuracy</div>
          <div style={{ position: "relative", width: 120, height: 70, margin: "0 auto 12px" }}>
            <svg viewBox="0 0 120 70" style={{ width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={c.red} /><stop offset="40%" stopColor={c.amber} /><stop offset="70%" stopColor={c.green} /><stop offset="100%" stopColor={c.green} />
                </linearGradient>
              </defs>
              <path d="M 15 60 A 45 45 0 0 1 105 60" fill="none" stroke={c.bg2} strokeWidth="8" strokeLinecap="round" />
              <path d="M 15 60 A 45 45 0 0 1 105 60" fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(retrained ? 0.97 : 0.968) * 141} 141`} />
              <circle cx={60 + 45 * Math.cos(Math.PI - (retrained ? 0.97 : 0.968) * Math.PI)} cy={60 - 45 * Math.sin(Math.PI - (retrained ? 0.97 : 0.968) * Math.PI)} r="5" fill={c.green} stroke={c.surface} strokeWidth="2" />
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.green, fontFamily: "'JetBrains Mono', monospace" }}>{retrained ? "97.1" : "96.8"}%</div>
            <div style={{ fontSize: 10, color: c.textDim, marginTop: 2 }}>MAPE: {retrained ? "2.9" : "3.2"}% · R²: 0.94</div>
          </div>
        </div>

        {/* Scenario comparison bars */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 22px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: c.text, marginBottom: 12 }}>Scenario Comparison</div>
          {[
            { label: "Bear", value: (FORECAST_DATA[11]?.bear || 8200) / 1000, color: c.red, max: 13 },
            { label: "Base", value: scenario, color: c.green, max: 13 },
            { label: "Bull", value: (FORECAST_DATA[11]?.bull || 12500) / 1000, color: c.accent, max: 13 },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
                <span style={{ color: c.textDim, fontWeight: 600 }}>{s.label}</span>
                <span style={{ color: s.color, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>${s.value.toFixed(1)}M</span>
              </div>
              <div style={{ height: 10, background: c.bg2, borderRadius: 5, overflow: "hidden" }}>
                <div style={{ width: `${(s.value / s.max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}80, ${s.color})`, borderRadius: 5, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 9, color: c.textFaint, marginTop: 8, padding: "6px 8px", background: c.surfaceAlt, borderRadius: 6 }}>
            Spread: <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: c.textSec }}>${((FORECAST_DATA[11]?.bull || 12500) / 1000 - (FORECAST_DATA[11]?.bear || 8200) / 1000).toFixed(1)}M</span> · Confidence: 80%
          </div>
        </div>

        {/* Monthly accuracy heatmap */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 22px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: c.text, marginBottom: 12 }}>Monthly Accuracy</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {[
              { m: "Jul", acc: 98.2 }, { m: "Aug", acc: 96.5 }, { m: "Sep", acc: 97.8 }, { m: "Oct", acc: 95.1 },
              { m: "Nov", acc: 97.4 }, { m: "Dec", acc: 94.3 }, { m: "Jan", acc: 98.6 }, { m: "Feb", acc: 96.9 },
              { m: "Mar", acc: 97.1 }, { m: "Apr", acc: 95.8 }, { m: "May", acc: 98.0 }, { m: "Jun", acc: null },
            ].map(d => {
              const intensity = d.acc ? Math.max(0, (d.acc - 90) / 10) : 0;
              const clr = d.acc ? (d.acc >= 97 ? c.green : d.acc >= 95 ? c.accent : c.amber) : c.borderSub;
              return (
                <div key={d.m} style={{ padding: "8px 4px", borderRadius: 6, background: d.acc ? `${clr}${Math.round(intensity * 20).toString(16).padStart(2, "0")}` : c.surfaceAlt, textAlign: "center", border: `1px solid ${d.acc ? `${clr}15` : c.borderSub}`, transition: "all 0.15s", cursor: "default" }}
                  onMouseEnter={e => { if (d.acc) e.currentTarget.style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
                  <div style={{ fontSize: 8, color: c.textFaint, fontWeight: 700, marginBottom: 2 }}>{d.m}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: d.acc ? clr : c.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>{d.acc ? `${d.acc}%` : "—"}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 10, fontSize: 8, color: c.textFaint }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: `${c.green}30` }} />97%+</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: `${c.accent}30` }} />95-97%</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: `${c.amber}30` }} />&lt;95%</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Drivers & Assumptions</div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        {/* Driver importance */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
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
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "24px 24px 18px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
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

      {/* ── Cross-View Data Pipeline ── */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Connected Pipelines</div>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { label: "P&L Actuals", desc: "Revenue actuals feeding forecast baseline", view: "pnl", icon: FileText, color: c.accent, metric: "$51.2M rev" },
            { label: "Consolidation", desc: "Multi-entity rollup uses forecast projections", view: "consolidation", icon: Layers, color: c.cyan || c.accent, metric: "3 entities" },
            { label: "Scenario Models", desc: "Scenarios inherit forecast sensitivity inputs", view: "models", icon: GitBranch, color: c.purple, metric: "6 scenarios" },
            { label: "Close Tasks", desc: `${closeTasks ? closeTasks.filter(t => t.status === "done").length : 0}/${closeTasks ? closeTasks.length : 0} tasks feed data quality score`, view: "close", icon: CheckSquare, color: c.amber, metric: closeTasks ? `${Math.round((closeTasks.filter(t => t.status === "done").length / closeTasks.length) * 100)}% closed` : "—" },
            { label: "AI Copilot", desc: "Ask natural language questions about this forecast", view: "copilot", icon: Brain, color: c.green, metric: "14 drivers" },
          ].map(p => (
            <div key={p.label} onClick={() => onNav && onNav(p.view)} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.color}40`; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.glassBorder; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: `${p.color}12`, border: `1px solid ${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p.icon size={13} color={p.color} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{p.label}</span>
                <ArrowUpRight size={10} color={c.textFaint} style={{ marginLeft: "auto" }} />
              </div>
              <div style={{ fontSize: 10, color: c.textDim, lineHeight: 1.5, marginBottom: 6 }}>{p.desc}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: p.color, fontFamily: "'JetBrains Mono', monospace" }}>{p.metric}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// CONSOLIDATION VIEW
// ══════════════════════════════════════════════════════════════
const ENTITIES = [
  { name: "Acme US", revenue: 38920, ebitda: 3120, hc: 218, currency: "USD", status: "Closed", ic: -1200, fx: null, reviewer: "Sarah Chen", reviewerInit: "SC" },
  { name: "Acme EU", revenue: 8650, ebitda: 520, hc: 62, currency: "EUR → USD", status: "In Review", ic: 0, fx: -142, reviewer: "James Rodriguez", reviewerInit: "JR" },
  { name: "Acme APAC", revenue: 3620, ebitda: 140, hc: 32, currency: "SGD → USD", status: "Pending", ic: 0, fx: 38, reviewer: "Priya Patel", reviewerInit: "PP" },
];

const CONS_PNL = [
  { line: "Revenue", us: 38920, eu: 8650, apac: 3620, elim: 0, cons: 51190 },
  { line: "COGS", us: 5940, eu: 1280, apac: 600, elim: 0, cons: 7820 },
  { line: "IC Services", us: 820, eu: 280, apac: 100, elim: -1200, cons: 0 },
  { line: "OpEx", us: 29860, eu: 6850, apac: 2880, elim: 0, cons: 39590 },
  { line: "FX Adjustment", us: null, eu: -142, apac: 38, elim: 0, cons: -104 },
  { line: "EBITDA", us: 3120, eu: 520, apac: 140, elim: 0, cons: 3780 },
];

const ConsolidationView = ({ c, onNav, toast, onDrawer }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
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
        onPDF={() => { downloadPDF("Entity Consolidation", ["Entity", "Revenue", "OpEx", "EBITDA %", "Status", "Currency"], ENTITIES.map(e => [e.name, "$" + e.revenue + "K", "$" + e.opex + "K", e.ebitda + "%", entityStatus[e.name] || e.status, e.currency])); toast("Consolidation exported as PDF", "success"); }}
      />
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.cyan}15, ${c.accent}08)`, border: `1px solid ${c.cyan}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <Layers size={17} color={c.cyan} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Multi-Entity Consolidation</div>
              <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.cyan}15`, color: c.cyan, letterSpacing: "0.06em" }}>AUTO IC</span>
            </div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>{ENTITIES.length} entities · Auto IC elimination · {ENTITIES.filter(e => (entityStatus[e.name] || e.status) === "Closed").length} closed · FX: Real-time</div>
            {/* Entity reviewers */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              {[
                { init: "SC", color: `linear-gradient(135deg, ${c.green}, ${c.cyan})` },
                { init: "JR", color: `linear-gradient(135deg, ${c.amber}, ${c.red})` },
                { init: "PP", color: `linear-gradient(135deg, ${c.purple}, ${c.accent})` },
              ].map((r, i) => (
                <div key={r.init} style={{ width: 22, height: 22, borderRadius: 7, background: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "#fff", marginLeft: i > 0 ? -6 : 0, border: `2px solid ${c.bg2}` }}>{r.init}</div>
              ))}
              <span style={{ fontSize: 9, color: c.textFaint, marginLeft: 4 }}>3 reviewers assigned</span>
            </div>
            <div style={{ fontSize: 9, color: c.textFaint, marginTop: 4 }}>FX rates as of {fmtTime(new Date())} · IC eliminations auto-applied</div>
          </div>
        </div>
        <button onClick={() => { ENTITIES.forEach(e => { if ((entityStatus[e.name] || e.status) !== "Closed") approve(e.name); }); }} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: c.green, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Close All Pending</button>
      </div>
      {/* Entity cards */}
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        Entity Status
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 20 }}>
        {ENTITIES.map(e => {
          const st = entityStatus[e.name] || e.status;
          const closing = st === "closing";
          const displayStatus = closing ? "Closing..." : st;
          const statusColor = statusColors[displayStatus] || c.textDim;
          return (
            <div key={e.name} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.2s" }}
              onMouseEnter={e2 => { e2.currentTarget.style.borderColor = statusColor + "40"; }}
              onMouseLeave={e2 => { e2.currentTarget.style.borderColor = c.border; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span onClick={() => onDrawer && onDrawer(e.name)} style={{ fontSize: 14, fontWeight: 800, color: c.text, cursor: "pointer", transition: "color 0.15s" }}
                  onMouseEnter={ev => ev.currentTarget.style.color = c.accent}
                  onMouseLeave={ev => ev.currentTarget.style.color = c.text}
                >{e.name}</span>
                <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 6, background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}18`, letterSpacing: "0.03em" }}>{displayStatus}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: c.text, marginBottom: 2, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(e.revenue)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: c.textDim, marginBottom: 12 }}>
                <span>Revenue · {((e.revenue / 51190) * 100).toFixed(1)}%</span>
                <div style={{ flex: 1, height: 4, background: c.bg2, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${((e.revenue / 51190) * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${statusColor}, ${statusColor}80)`, borderRadius: 2, transition: "width 0.6s ease" }} />
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
              {/* Reviewer assignment */}
              {e.reviewer && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${c.borderSub}` }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff" }}>{e.reviewerInit}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 9, color: c.textFaint }}>Reviewer: </span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: c.text }}>{e.reviewer}</span>
                  </div>
                  <button onClick={(ev) => { ev.stopPropagation(); toast(`Comment sent to ${e.reviewer}`, "success"); }} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 4, border: `1px solid ${c.border}`, background: "transparent", color: c.textDim, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>▹</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Revenue Mix + FX Impact */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Revenue Mix & FX Impact</div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Entity Revenue Contribution */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.accent}18, ${c.purple}10)`, border: `1px solid ${c.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={14} color={c.accent} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Entity Contribution</div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {/* Visual bar breakdown */}
            <div style={{ flex: 1 }}>
              {ENTITIES.map((e, i) => {
                const pct = ((e.revenue / 51190) * 100).toFixed(1);
                const colors = [c.accent, c.purple, c.cyan];
                return (
                  <div key={e.name} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: c.text, fontWeight: 600 }}>{e.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: colors[i] }}>{fmt(e.revenue)} <span style={{ fontSize: 9, opacity: 0.6 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: 8, background: c.bg2, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${colors[i]}80, ${colors[i]})`, borderRadius: 4, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "8px 10px", background: c.surfaceAlt, borderRadius: 8, marginTop: 8 }}>
                <span style={{ color: c.textDim, fontWeight: 600 }}>Total Consolidated</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: c.text }}>${(51190 / 1000).toFixed(1)}M</span>
              </div>
            </div>
          </div>
        </div>

        {/* FX & IC Impact */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.amber}18, ${c.red}10)`, border: `1px solid ${c.amber}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={14} color={c.amber} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>FX & IC Adjustments</div>
          </div>
          {/* Waterfall-style adjustment bars */}
          {[
            { label: "Pre-adjustment Revenue", value: 51190 + 1200 + 104, color: c.accent, type: "total" },
            { label: "IC Eliminations", value: -1200, color: c.amber, type: "adj" },
            { label: "FX Impact (EUR)", value: -142, color: c.red, type: "adj" },
            { label: "FX Impact (SGD)", value: 38, color: c.green, type: "adj" },
            { label: "Consolidated Revenue", value: 51190, color: c.green, type: "total" },
          ].map((item, i) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? `1px solid ${c.borderSub}` : "none" }}>
              <span style={{ flex: 1, fontSize: 11, color: item.type === "total" ? c.text : c.textDim, fontWeight: item.type === "total" ? 700 : 500 }}>{item.label}</span>
              <div style={{ width: 80, height: 6, background: c.bg2, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${Math.abs(item.value) / 524}%`, height: "100%", background: item.color, borderRadius: 3, marginLeft: item.value < 0 ? "auto" : 0 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: item.type === "total" ? c.text : (item.value >= 0 ? c.green : c.red), fontFamily: "'JetBrains Mono', monospace", width: 70, textAlign: "right" }}>
                {item.type === "adj" && (item.value >= 0 ? "+" : "")}{fmt(item.value)}
              </span>
            </div>
          ))}
          <div style={{ fontSize: 9, color: c.textFaint, marginTop: 10, padding: "6px 8px", background: c.surfaceAlt, borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <Globe size={10} color={c.textFaint} /> FX rates: EUR/USD 1.087 · SGD/USD 0.746 · Updated {fmtTime(new Date())}
          </div>
        </div>
      </div>

      {/* Consolidated P&L */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Consolidated Financials</div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
      </div>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden", position: "relative" }}>
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${c.borderBright}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, background: `linear-gradient(135deg, ${c.accent}15, ${c.cyan}08)`, border: `1px solid ${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={12} color={c.accent} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: c.textDim }}>Consolidated P&L — Eliminations Applied</span>
          </div>
          <span style={{ fontSize: 9, color: c.purple, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: c.purpleDim, border: `1px solid ${c.purple}10` }}>IC: -$1.2M auto-eliminated</span>
          <button onClick={() => onNav && onNav("close")} style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 5, background: c.accentDim, color: c.accent, border: `1px solid ${c.accent}15`, cursor: "pointer", fontFamily: "inherit", marginLeft: 4 }}>Close Tasks ▸</button>
          <button onClick={() => onNav && onNav("forecast")} style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 5, background: c.greenDim, color: c.green, border: `1px solid ${c.green}15`, cursor: "pointer", fontFamily: "inherit", marginLeft: 4 }}>Forecast ▸</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${c.borderBright}` }}>
              {["Line", "Acme US", "Acme EU", "Acme APAC", "Eliminations", "Consolidated"].map((h, i) => (
                <th key={h} style={{ padding: "12px 12px", fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", color: i === 4 ? c.red : i === 5 ? c.accent : c.textFaint, textAlign: i === 0 ? "left" : "right", textTransform: "uppercase", background: c.surfaceAlt, position: "sticky", top: 0, zIndex: 2 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONS_PNL.map((r, i) => {
              const isTotal = r.line === "EBITDA";
              return (
                <tr key={r.line} style={{
                  borderBottom: `1px solid ${c.borderSub}`,
                  ...(isTotal ? { borderTop: `2px solid ${c.borderBright}`, background: `linear-gradient(90deg, ${c.green}06, transparent)` } : {}),
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => { if (!isTotal) e.currentTarget.style.background = c.accentDim || `${c.accent}06`; }}
                onMouseLeave={e => { if (!isTotal) e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "9px 12px", fontWeight: isTotal ? 800 : 600, color: isTotal ? c.green : c.text }}>{r.line}</td>
                  {[r.us, r.eu, r.apac, r.elim, r.cons].map((v, j) => (
                    <td key={j} style={{ textAlign: "right", padding: "9px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: j === 4 || isTotal ? 700 : 400, color: j === 3 ? c.red : j === 4 ? c.accent : isTotal ? c.green : c.textSec }}>
                      {v === null ? "—" : v === 0 && j === 3 ? `${csym()}0` : `${v < 0 ? "-" : ""}${csym()}${Math.abs(v).toLocaleString()}K${csfx()}`}
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

const CloseView = ({ c, toast, tasks, setTasks, logActivity, onNav }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const statusLabel = { done: "Complete", progress: "In Progress", notstarted: "Not Started" };
  const statusColor = { done: c.green, progress: c.accent, notstarted: c.textFaint };
  const cycleStatus = (id) => {
    const order = ["notstarted", "progress", "done"];
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next = order[(order.indexOf(t.status) + 1) % 3];
      toast(`${t.task.slice(0, 40)}${t.task.length > 40 ? "…" : ""} → ${statusLabel[next]}`, next === "done" ? "success" : "info");
      if (logActivity) logActivity(`Close task: ${t.task.slice(0, 30)} → ${statusLabel[next]}`, "close");
      return { ...t, status: next };
    }));
  };
  const doneCount = tasks.filter(t => t.status === "done").length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div style={{ padding: 32 }}>
      <ExportBar c={c} title="Month-End Close"
        onCSV={() => { downloadCSV("financeos-close-tasks.csv", ["Task","Category","Owner","Status","Priority"], tasks.map(t => [t.task, t.cat, t.owner, t.status, t.priority || ""])); toast("Close tasks exported as CSV", "success"); }}
        onPDF={() => { downloadPDF("Month-End Close Tasks", ["Task", "Category", "Owner", "Status", "Priority"], tasks.map(t => [t.task, t.cat, t.owner, t.status === "done" ? "Complete" : t.status === "progress" ? "In Progress" : "Not Started", t.priority || "normal"])); toast("Close tasks exported as PDF", "success"); }}
      />
      {/* View Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.amber}15, ${c.green}08)`, border: `1px solid ${c.amber}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <CheckSquare size={17} color={c.amber} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Month-End Close</div>
              <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: pct === 100 ? `${c.green}15` : `${c.amber}15`, color: pct === 100 ? c.green : c.amber, letterSpacing: "0.06em" }}>{pct}%</span>
            </div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>February close · {tasks.length - doneCount} tasks remaining · Est. {Math.max(0, (tasks.length - doneCount) * 0.5).toFixed(1)}h to complete</div>
            <div style={{ fontSize: 9, color: c.textFaint, marginTop: 4 }}>Last updated {fmtTime(new Date())} · Deadline: Mar 7</div>
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
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: 22, marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>February Close — {pct}% Complete</span>
          <span style={{ fontSize: 11, color: c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{doneCount}/{tasks.length} tasks</span>
        </div>
        <div style={{ height: 10, background: c.bg2, borderRadius: 5, overflow: "hidden", position: "relative" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? `linear-gradient(90deg, ${c.green}, ${c.green}cc)` : `linear-gradient(90deg, ${c.accent}, ${c.green}cc)`, borderRadius: 5, transition: "width 0.6s ease", boxShadow: `0 0 16px ${pct === 100 ? c.green : c.accent}30`, position: "relative" }}>
            {pct > 15 && <div style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", fontSize: 7, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</div>}
          </div>
        </div>
      </div>

      {/* Analytics row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Close Analytics</div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
        {/* Burndown chart */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 22px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: c.text, marginBottom: 14 }}>Close Burndown</div>
          <svg viewBox="0 0 200 80" style={{ width: "100%", height: 80 }}>
            <defs>
              <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.accent} stopOpacity={0.2} /><stop offset="100%" stopColor={c.accent} stopOpacity={0} /></linearGradient>
            </defs>
            {/* Grid lines */}
            {[0, 20, 40, 60].map(y => <line key={y} x1="0" y1={y} x2="200" y2={y} stroke={c.borderSub} strokeWidth="0.5" strokeDasharray="4 4" />)}
            {/* Ideal line */}
            <line x1="10" y1="5" x2="190" y2="70" stroke={c.textFaint} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            {/* Actual burndown */}
            {(() => {
              const remaining = tasks.length;
              const pts = [
                { x: 10, y: 5 },
                { x: 40, y: 5 + (2 / remaining) * 65 },
                { x: 70, y: 5 + (2 / remaining) * 65 },
                { x: 100, y: 5 + (doneCount / remaining) * 65 },
                { x: 130, y: 5 + (doneCount / remaining) * 65 },
                { x: 190, y: 5 + (doneCount / remaining) * 65 },
              ];
              const path = `M${pts.map(p => `${p.x},${p.y}`).join("L")}`;
              const area = `${path}L190,75L10,75Z`;
              return (<>
                <path d={area} fill="url(#burnGrad)" />
                <path d={path} fill="none" stroke={c.accent} strokeWidth="2" strokeLinecap="round" />
                <circle cx={pts[3].x} cy={pts[3].y} r="3.5" fill={c.accent} stroke={c.surface} strokeWidth="2" />
              </>);
            })()}
            {/* Labels */}
            <text x="10" y="78" fontSize="7" fill={c.textFaint}>Day 1</text>
            <text x="180" y="78" fontSize="7" fill={c.textFaint} textAnchor="end">Day 6</text>
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: c.textDim, marginTop: 6 }}>
            <span>Ideal <span style={{ color: c.textFaint }}>—</span></span>
            <span>Actual <span style={{ color: c.accent, fontWeight: 700 }}>{tasks.length - doneCount} remaining</span></span>
          </div>
        </div>

        {/* Category breakdown */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 22px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: c.text, marginBottom: 14 }}>By Category</div>
          {["Accounting", "Consolidation", "Compliance", "Reporting", "Review"].filter(cat => tasks.some(t => t.cat === cat)).map(cat => {
            const catTasks = tasks.filter(t => t.cat === cat);
            const catDone = catTasks.filter(t => t.status === "done").length;
            const catPct = Math.round((catDone / catTasks.length) * 100);
            const catColors = { Accounting: c.accent, Consolidation: c.cyan, Compliance: c.purple, Reporting: c.green, Review: c.amber };
            const clr = catColors[cat] || c.accent;
            return (
              <div key={cat} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 3 }}>
                  <span style={{ color: c.textDim, fontWeight: 600 }}>{cat}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: catPct === 100 ? c.green : clr, fontSize: 9 }}>{catDone}/{catTasks.length}</span>
                </div>
                <div style={{ height: 6, background: c.bg2, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${catPct}%`, height: "100%", background: `linear-gradient(90deg, ${clr}80, ${clr})`, borderRadius: 3, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Owner workload */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 22px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: c.text, marginBottom: 14 }}>Owner Workload</div>
          {[...new Set(tasks.map(t => t.owner))].map(owner => {
            const ownerTasks = tasks.filter(t => t.owner === owner);
            const ownerDone = ownerTasks.filter(t => t.status === "done").length;
            const ownerPending = ownerTasks.length - ownerDone;
            return (
              <div key={owner} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "6px 0" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {owner.split(" ").map(w => w[0]).join("").slice(0,2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: c.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{owner}</div>
                  <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                    {ownerTasks.map((t, i) => (
                      <div key={i} style={{ width: 10, height: 10, borderRadius: 3, background: t.status === "done" ? c.green : t.status === "progress" ? c.accent : c.borderSub, border: `1px solid ${t.status === "done" ? c.green : t.status === "progress" ? c.accent : c.borderSub}20`, transition: "all 0.3s" }} />
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, color: ownerPending === 0 ? c.green : c.textDim, fontFamily: "'JetBrains Mono', monospace" }}>
                  {ownerPending === 0 ? "✓ Done" : `${ownerPending} left`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task list — grouped by category */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Close Checklist</div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
        <span style={{ fontSize: 9, color: c.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>{doneCount}/{tasks.length} complete</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {["Accounting", "Consolidation", "Compliance", "Reporting", "Review"].filter(cat => tasks.some(t => t.cat === cat)).map(cat => {
          const catTasks = tasks.filter(t => t.cat === cat);
          const catDone = catTasks.filter(t => t.status === "done").length;
          const catPct = Math.round((catDone / catTasks.length) * 100);
          const catColor = { Accounting: c.accent, Consolidation: c.cyan, Compliance: c.purple, Reporting: c.green, Review: c.amber }[cat] || c.accent;
          return (
            <div key={cat} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", position: "relative" }}>
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
                  opacity: t.status === "done" ? 0.55 : 1, cursor: "pointer",
                  transition: "all 0.2s", borderLeft: `3px solid ${t.status === "done" ? c.green : t.status === "progress" ? c.accent : priorityColors[t.priority] || c.textFaint}`,
                }}
                onClick={() => cycleStatus(t.id)}
                onMouseEnter={e => { e.currentTarget.style.background = c.accentDim; e.currentTarget.style.transform = "translateX(2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 7, border: `2px solid ${t.status === "done" ? c.green : t.status === "progress" ? c.accent : c.border}`,
                    background: t.status === "done" ? `linear-gradient(135deg, ${c.green}, ${c.green}cc)` : t.status === "progress" ? `${c.accent}15` : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.15s ease",
                    boxShadow: t.status === "done" ? `0 0 8px ${c.green}30` : t.status === "progress" ? `0 0 6px ${c.accent}20` : "none",
                  }}>
                    {t.status === "done" && <Check size={12} color="#fff" strokeWidth={3} />}
                    {t.status === "progress" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.accent, animation: "pulse 2s ease-in-out infinite" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.text, textDecoration: t.status === "done" ? "line-through" : "none", marginBottom: 3 }}>{t.task}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: c.textDim }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{t.owner.split(" ").map(w => w[0]).join("").slice(0,2)}</div>
                        <span>{t.owner}</span>
                      </div>
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
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "18px 22px", marginTop: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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

      {/* ── Cross-View Pipeline ── */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Connected Pipelines</div>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {[
            { label: "Consolidation", desc: "Close status gates entity consolidation", view: "consolidation", icon: Layers, color: c.cyan || c.accent, metric: "3 entities" },
            { label: "P&L Statement", desc: "Reconciled actuals flow into P&L reports", view: "pnl", icon: FileText, color: c.accent, metric: "$51.2M rev" },
            { label: "Forecast", desc: "Closed months recalibrate ML forecast model", view: "forecast", icon: TrendingUp, color: c.green, metric: "MAPE 3.2%" },
            { label: "Dashboard", desc: "Close progress updates KPI health scores", view: "dashboard", icon: LayoutDashboard, color: c.purple, metric: `${pct}% closed` },
          ].map(p => (
            <div key={p.label} onClick={() => onNav && onNav(p.view)} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.color}40`; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.glassBorder; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: `${p.color}12`, border: `1px solid ${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p.icon size={12} color={p.color} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.text }}>{p.label}</span>
                <ArrowUpRight size={9} color={c.textFaint} style={{ marginLeft: "auto" }} />
              </div>
              <div style={{ fontSize: 9, color: c.textDim, lineHeight: 1.4, marginBottom: 4 }}>{p.desc}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: p.color, fontFamily: "'JetBrains Mono', monospace" }}>{p.metric}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// INTEGRATIONS VIEW
// ══════════════════════════════════════════════════════════════
const CONNECTORS = [
  { name: "NetSuite", cat: "ERP", status: "connected", records: "847K", color: "#0C9ADA", syncedAt: Date.now() - 120000, health: 100, logo: "https://companieslogo.com/img/orig/N-3a4b9f2a.png", desc: "Cloud ERP for financial management, CRM, and e-commerce" },
  { name: "Salesforce", cat: "CRM", status: "connected", records: "124K", color: "#00A1E0", syncedAt: Date.now() - 45000, health: 100, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/320px-Salesforce.com_logo.svg.png", desc: "CRM platform for sales pipeline and customer data" },
  { name: "Stripe", cat: "Billing", status: "connected", records: "38K", color: "#635BFF", syncedAt: Date.now() - 60000, health: 100, badge: "CONNECT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/320px-Stripe_Logo%2C_revised_2016.svg.png", desc: "Payment processing, billing, and revenue recognition" },
  { name: "Rippling", cat: "HRIS", status: "connected", records: "312", color: "#FE6847", syncedAt: Date.now() - 240000, health: 98, desc: "Workforce management, payroll, and HR platform" },
  { name: "Snowflake", cat: "Data Warehouse", status: "connected", records: "2.1M", color: "#29B5E8", syncedAt: Date.now() - 180000, health: 100, logo: "https://companieslogo.com/img/orig/SNOW-35164165.png", desc: "Cloud data platform for analytics and data sharing" },
  { name: "HubSpot", cat: "CRM", status: "connected", records: "89K", color: "#FF7A59", syncedAt: Date.now() - 130000, health: 100, logo: "https://companieslogo.com/img/orig/HUBS-cad731e2.png", desc: "Inbound marketing, sales, and service CRM" },
  { name: "Ramp", cat: "Expenses", status: "connected", records: "5.2K", color: "#007A5E", syncedAt: Date.now() - 300000, health: 97, desc: "Corporate card and expense management platform" },
  { name: "Plaid", cat: "Banking", status: "available", records: null, color: "#0A85EA", badge: "NEW", desc: "Bank account aggregation and financial data" },
  { name: "QuickBooks", cat: "ERP", status: "available", records: null, color: "#2CA01C", badge: "OAUTH", logo: "https://companieslogo.com/img/orig/INTU-81e8fe7e.png", desc: "Small business accounting and bookkeeping" },
  { name: "Xero", cat: "ERP", status: "available", records: null, color: "#13B5EA", desc: "Cloud accounting for growing businesses" },
  { name: "Workday", cat: "HRIS", status: "available", records: null, color: "#0875E1", logo: "https://companieslogo.com/img/orig/WDAY-beb08ca0.png", desc: "Enterprise HR, finance, and planning" },
  { name: "Google Sheets", cat: "Files", status: "available", records: null, color: "#34A853", desc: "Spreadsheet import and live sync" },
  { name: "Slack", cat: "Notifications", status: "available", records: null, color: "#4A154B", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/120px-Slack_icon_2019.svg.png", desc: "Real-time alerts and team notifications" },
  { name: "CSV / Excel", cat: "Files", status: "available", records: null, color: "#217346", badge: "UPLOAD", desc: "Import spreadsheets and flat files" },
  { name: "REST API", cat: "Developer", status: "available", records: null, color: "#8b92a5", badge: "BETA", desc: "Custom integrations via REST endpoints" },
];

// Live time-ago formatter
const timeAgo = (ts) => {
  if (!ts) return "—";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return "Just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

const IntegrationsView = ({ c, toast }) => {
  // Load connector state from localStorage, falling back to defaults
  const [conns, setConns] = useState(() => {
    try {
      const saved = localStorage.getItem("fos_connectors");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge saved state with CONNECTORS template (preserves new connectors added to code)
        return CONNECTORS.map(def => {
          const s = parsed.find(p => p.name === def.name);
          if (s && s.status === "connected") {
            return { ...def, status: "connected", records: s.records || def.records, syncedAt: Date.now() - (s.age || 120000), health: s.health ?? def.health ?? 100 };
          }
          return def;
        });
      }
    } catch {}
    return CONNECTORS;
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [connectingName, setConnectingName] = useState(null);
  const [disconnectConfirm, setDisconnectConfirm] = useState(null);
  const [syncingName, setSyncingName] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadFile, setUploadFile] = useState(null);
  const [csvText, setCsvText] = useState(null);
  const [csvPreview, setCsvPreview] = useState(null);
  const [colMap, setColMap] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);
  const [defaultPeriod, setDefaultPeriod] = useState(new Date().toISOString().slice(0, 7));
  const fileInputRef = useRef(null);
  const [plaidOpen, setPlaidOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const cats = ["all", ...new Set(CONNECTORS.map(co => co.cat))];
  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);
  // Tick every 1s to update live sync times
  useEffect(() => { const i = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(i); }, []);
  // Persist connector state to localStorage (survives page refresh)
  useEffect(() => {
    try {
      const toSave = conns.filter(co => co.status === "connected").map(co => ({
        name: co.name, status: co.status, records: co.records, health: co.health,
        age: co.syncedAt ? Math.max(0, Date.now() - co.syncedAt) : 120000,
      }));
      localStorage.setItem("fos_connectors", JSON.stringify(toSave));
    } catch {}
  }, [conns]);

  const startConnect = (name) => {
    const conn = conns.find(co => co.name === name);
    if (conn?.status === "connected") { setDisconnectConfirm(name); return; }
    if (name === "CSV / Excel") { setUploadOpen(true); setUploadStep(0); setUploadFile(null); return; }
    if (name === "Plaid") { setPlaidOpen(true); return; }
    // QuickBooks — real OAuth flow
    if (name === "QuickBooks") {
      toast("Redirecting to QuickBooks...", "info");
      window.location.href = "/api/integrations/intuit/connect";
      return;
    }
    // Stripe Connect — real onboarding via Edge Function
    if (name === "Stripe") {
      (async () => {
        toast("Setting up Stripe Connect...", "info");
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.access_token) { toast("Please log in first", "error"); return; }
          const res = await fetch(`${SUPABASE_URL}/functions/v1/stripe-connect`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}`, "apikey": SUPABASE_KEY },
            body: JSON.stringify({ action: "status" }),
          });
          const data = await res.json();
          if (data.account?.onboarding_complete) {
            toast("Stripe Connect is already active", "success");
            setConns(prev => prev.map(co => co.name === "Stripe" ? { ...co, status: "connected", records: "Active", syncedAt: Date.now() } : co));
          } else if (data.account) {
            // Account exists but not fully onboarded — get onboarding link
            const linkRes = await fetch(`${SUPABASE_URL}/functions/v1/stripe-connect`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}`, "apikey": SUPABASE_KEY },
              body: JSON.stringify({ action: "onboarding_link" }),
            });
            const linkData = await linkRes.json();
            if (linkData.url) { window.open(linkData.url, "_blank"); toast("Complete onboarding in the new tab", "info"); }
          } else {
            // No account — create one
            const createRes = await fetch(`${SUPABASE_URL}/functions/v1/stripe-connect`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}`, "apikey": SUPABASE_KEY },
              body: JSON.stringify({ action: "create_account" }),
            });
            const createData = await createRes.json();
            if (createData.onboarding_url) { window.open(createData.onboarding_url, "_blank"); toast("Complete Stripe setup in the new tab", "info"); }
            else toast(createData.error || "Failed to create Stripe account", "error");
          }
        } catch (e) { toast("Stripe Connect error: " + (e?.message || "Unknown"), "error"); }
      })();
      return;
    }
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
      setConns(prev => prev.map(co => co.name === name ? { ...co, status: "connected", records: fakeRecords, syncedAt: Date.now() } : co));
      setSyncingName(null);
      toast(`${name} connected — ${fakeRecords} records synced`, "success");
    }, 2500);
  };

  const confirmDisconnect = async () => {
    const name = disconnectConfirm;
    setDisconnectConfirm(null);
    setConns(prev => prev.map(co => co.name === name ? { ...co, status: "available", records: null, syncedAt: null } : co));
    // QuickBooks — real disconnect
    if (name === "QuickBooks") {
      try { await fetch("/api/integrations/intuit/disconnect", { method: "POST" }); } catch {}
    }
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
    setConns(prev => prev.map(co => co.name === name ? { ...co, syncedAt: -1 } : co));
    setTimeout(() => {
      if (!mountedRef.current) return;
      setConns(prev => prev.map(co => co.name === name ? { ...co, syncedAt: Date.now() } : co));
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Integrations</div><span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.green}15`, color: c.green, letterSpacing: "0.06em" }}>{connected.length} ACTIVE</span></div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>Connect your stack · Bi-directional sync · Last sync {timeAgo(Math.max(...connected.map(co => co.syncedAt || 0)))}</div>
          </div>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search integrations..."
          style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontFamily: "inherit", outline: "none", width: 200 }}
          onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.border}
        />
      </div>

      {/* Health overview bar */}
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        Pipeline Health
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        {(() => {
          const avgFresh = connected.length ? Math.round(connected.reduce((a, co) => a + (Date.now() - (co.syncedAt || Date.now())), 0) / connected.length / 1000) : 0;
          const avgStr = avgFresh < 60 ? `${avgFresh}s` : `${Math.floor(avgFresh / 60)}m ${avgFresh % 60}s`;
          const totalRecs = connected.reduce((a, co) => a + (parseFloat((co.records || "0").replace(/[KM,]/g, m => m === "K" ? "" : m === "M" ? "" : "")) * (co.records?.includes("M") ? 1000000 : co.records?.includes("K") ? 1000 : 1) || 0), 0);
          const recsStr = totalRecs >= 1000000 ? `${(totalRecs / 1000000).toFixed(1)}M` : totalRecs >= 1000 ? `${(totalRecs / 1000).toFixed(0)}K` : `${totalRecs}`;
          return [
          { label: "Connected", value: connected.length, icon: "●", color: c.green },
          { label: "Available", value: conns.filter(co => co.status === "available").length, icon: "○", color: c.textDim },
          { label: "Total Records", value: recsStr, icon: "◆", color: c.accent },
          { label: "Avg Freshness", value: avgStr, icon: "~", color: avgFresh < 300 ? c.green : c.amber },
          ];
        })().map(s => (
          <div key={s.label} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.15s ease" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}35`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.boxShadow = c.cardGlow; }}
          >
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
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        Available Connectors
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {filtered.map(co => (
          <div key={co.name} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, padding: "22px 22px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${co.color}40`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${co.color}12, ${c.cardGlow}`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = c.cardGlow; }}
          >
            {co.status === "connected" && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${co.color}60, ${co.color}20, ${co.color}60)` }} />}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: co.logo ? "#fff" : `linear-gradient(135deg, ${co.color}18, ${co.color}08)`, border: `1px solid ${co.color}15`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, boxShadow: `0 2px 8px ${co.color}10` }}>
                {co.logo ? (
                  <img src={co.logo} alt={co.name} style={{ width: 28, height: 28, objectFit: "contain" }} loading="lazy" onError={e => { e.target.style.display = "none"; e.target.parentElement.innerHTML = `<span style="font-size:16px;font-weight:800;color:${co.color}">${co.name[0]}</span>`; }} />
                ) : (
                  <span style={{ fontSize: 16, fontWeight: 800, color: co.color }}>{co.name[0]}</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{co.name}</div>
                  {co.badge && co.status !== "connected" && (
                    <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: co.badge === "NEW" ? c.greenDim : co.badge === "UPLOAD" ? c.accentDim : co.badge === "BETA" ? c.purpleDim : c.accentDim, color: co.badge === "NEW" ? c.green : co.badge === "UPLOAD" ? c.accent : co.badge === "BETA" ? c.purple : c.accent, letterSpacing: "0.05em" }}>{co.badge}</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: c.textDim, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ padding: "1px 6px", borderRadius: 3, background: `${co.color}10`, color: co.color, fontSize: 8, fontWeight: 700 }}>{co.cat}</span>
                </div>
              </div>
              {co.status === "connected" && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, color: c.green, background: c.greenDim, padding: "3px 10px", borderRadius: 6, border: `1px solid ${c.green}12` }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} />
                  Live
                </div>
              )}
            </div>
            {co.desc && <div style={{ fontSize: 10, color: c.textFaint, lineHeight: 1.4, marginBottom: 12, paddingLeft: 2 }}>{co.desc}</div>}
            {co.status === "connected" && (
              <div style={{ fontSize: 10, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, padding: "6px 10px", borderRadius: 6, background: c.surfaceAlt }}>
                  <span style={{ color: c.green, fontWeight: 600 }}>{co.records} records</span>
                  <span style={{ color: co.name === syncingName ? c.amber : c.textFaint, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}>{co.name === syncingName ? "Syncing..." : co.syncedAt === -1 ? "Syncing..." : timeAgo(co.syncedAt)}</span>
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
          <div onClick={e => e.stopPropagation()} style={{ width: 420, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: conn?.logo ? "#fff" : `${conn?.color || c.accent}15`, border: `1px solid ${conn?.color || c.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: `0 2px 8px ${conn?.color || c.accent}10` }}>
                {conn?.logo ? <img src={conn.logo} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} /> : <span style={{ fontSize: 16, fontWeight: 800, color: conn?.color || c.accent }}>{connectingName[0]}</span>}
              </div>
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
          <div onClick={e => e.stopPropagation()} style={{ width: 380, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s ease", textAlign: "center" }}>
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
      {uploadOpen && (() => {
        const handleFile = (file) => {
          if (!file) return;
          const reader = new FileReader();
          reader.onload = async (e) => {
            const text = e.target.result;
            setCsvText(text);
            setUploadFile({ name: file.name, size: (file.size / 1024).toFixed(0) + " KB" });
            try {
              const { data: { session } } = await supabase.auth.getSession();
              if (!session?.access_token) { toast("Sign in to import data", "warning"); return; }
              const res = await fetch(`${SUPABASE_URL}/functions/v1/import-gl`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}`, "apikey": SUPABASE_KEY },
                body: JSON.stringify({ action: "preview", csv_text: text }),
              });
              const data = await res.json();
              if (data.success) { setCsvPreview(data); setColMap(data.detected_columns); setUploadStep(1); }
              else { toast(data.error || "Could not parse CSV", "error"); }
            } catch { toast("Preview failed", "error"); }
          };
          reader.readAsText(file);
        };

        const handleImport = async () => {
          setImporting(true); setUploadStep(2); setImportError(null);
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) { toast("Sign in to import", "warning"); setImporting(false); return; }
            const res = await fetch(`${SUPABASE_URL}/functions/v1/import-gl`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}`, "apikey": SUPABASE_KEY },
              body: JSON.stringify({ action: "import", csv_text: csvText, column_map: colMap, default_period: defaultPeriod }),
            });
            const data = await res.json();
            if (data.success) {
              setImportResult(data.summary); setUploadStep(3);
              setConns(prev => prev.map(co => co.name === "CSV / Excel" ? { ...co, status: "connected", records: data.summary.transactions_created.toLocaleString(), syncedAt: Date.now(), health: 100 } : co));
            } else { setImportError(data.error || "Import failed"); setUploadStep(1); }
          } catch { setImportError("Import failed — check your CSV format"); setUploadStep(1); }
          setImporting(false);
        };

        return (
        <div onClick={() => { setUploadOpen(false); setUploadStep(0); setUploadFile(null); }} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 540, maxHeight: "80vh", overflow: "auto", background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s ease" }}>
            {/* Progress steps */}
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
              {["Upload CSV", "Map & Preview", "Import"].map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: uploadStep >= i ? (uploadStep > i ? c.green : c.accent) : c.bg2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: uploadStep >= i ? "#fff" : c.textFaint, transition: "all 0.3s" }}>{uploadStep > i ? "✓" : i + 1}</div>
                  <span style={{ fontSize: 10, color: uploadStep >= i ? c.text : c.textFaint, fontWeight: 600 }}>{label}</span>
                  {i < 2 && <div style={{ width: 24, height: 1, background: uploadStep > i ? c.green : c.borderSub }} />}
                </div>
              ))}
            </div>

            {/* Step 0: File Upload */}
            {uploadStep === 0 && (<>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.text, marginBottom: 4 }}>Import Financial Data</div>
              <div style={{ fontSize: 12, color: c.textDim, marginBottom: 20 }}>Upload a CSV file with your trial balance, P&L detail, or journal entries.</div>
              <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <div onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.background = `${c.accent}06`; }}
                onDragLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.surfaceAlt; }}
                onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = c.border; const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                style={{ border: `2px dashed ${c.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center", cursor: "pointer", background: c.surfaceAlt, transition: "all 0.2s", marginBottom: 16 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; }}>
                {uploadFile ? (
                  <div>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>◆</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.text, marginBottom: 4 }}>{uploadFile.name}</div>
                    <div style={{ fontSize: 11, color: c.textDim }}>{uploadFile.size} · Parsing...</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>◻</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.textSec, marginBottom: 4 }}>Drop your CSV here or click to browse</div>
                    <div style={{ fontSize: 10, color: c.textFaint, marginBottom: 12 }}>Supports .csv files · Trial balances, P&L exports, journal entries</div>
                    <div style={{ fontSize: 9, color: c.textFaint, padding: "8px 12px", background: c.bg2, borderRadius: 8, display: "inline-block" }}>
                      Expected columns: Account, Amount (or Debit/Credit), Period, Budget (optional)
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setUploadOpen(false)} style={{ width: "100%", fontSize: 12, padding: "11px 0", borderRadius: 10, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Cancel</button>
            </>)}

            {/* Step 1: Preview + Column Mapping */}
            {uploadStep === 1 && csvPreview && (<>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.text, marginBottom: 4 }}>Preview & Map Columns</div>
              <div style={{ fontSize: 12, color: c.textDim, marginBottom: 16 }}>{csvPreview.total_rows} data rows detected from <span style={{ fontWeight: 600, color: c.text }}>{uploadFile?.name}</span></div>
              {importError && <div style={{ padding: "10px 14px", borderRadius: 8, background: `${c.red}10`, border: `1px solid ${c.red}20`, color: c.red, fontSize: 11, fontWeight: 600, marginBottom: 12 }}>{importError}</div>}
              {/* Column mapping */}
              <div style={{ background: c.surfaceAlt, borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Detected Column Mapping</div>
                {Object.entries(colMap || {}).map(([field, idx]) => (
                  <div key={field} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 11 }}>
                    <span style={{ flex: 1, color: c.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{csvPreview.headers[idx]}</span>
                    <span style={{ color: c.green, fontSize: 12 }}>→</span>
                    <span style={{ flex: 1, color: c.text, fontWeight: 700, textTransform: "capitalize" }}>{field.replace(/_/g, " ")}</span>
                    <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.green}12`, color: c.green }}>AUTO</span>
                  </div>
                ))}
                {Object.keys(colMap || {}).length === 0 && <div style={{ fontSize: 11, color: c.amber, fontWeight: 600 }}>Could not auto-detect columns. Ensure your CSV has Account and Amount headers.</div>}
              </div>
              {/* Period selector */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: c.textDim, fontWeight: 600 }}>Default period:</span>
                <input type="month" value={defaultPeriod} onChange={e => setDefaultPeriod(e.target.value)} style={{ fontSize: 11, padding: "6px 10px", borderRadius: 6, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontFamily: "'JetBrains Mono', monospace" }} />
              </div>
              {/* Data preview table */}
              <div style={{ background: c.bg2, borderRadius: 10, overflow: "hidden", marginBottom: 16, maxHeight: 180, overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                  <thead>
                    <tr>{csvPreview.headers.map((h, i) => (
                      <th key={i} style={{ padding: "8px 10px", background: c.surfaceAlt, color: c.textFaint, fontWeight: 700, textAlign: "left", borderBottom: `1px solid ${c.borderSub}`, whiteSpace: "nowrap", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>{csvPreview.preview.slice(1).map((row, ri) => (
                    <tr key={ri}>{row.map((cell, ci) => (
                      <td key={ci} style={{ padding: "6px 10px", color: c.textSec, borderBottom: `1px solid ${c.borderSub}`, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>{cell}</td>
                    ))}</tr>
                  ))}</tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setUploadStep(0); setCsvPreview(null); setCsvText(null); setUploadFile(null); setImportError(null); }} style={{ flex: 1, fontSize: 12, padding: "11px 0", borderRadius: 10, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Back</button>
                <button onClick={handleImport} disabled={!colMap?.account && colMap?.account !== 0} style={{ flex: 1, fontSize: 12, padding: "11px 0", borderRadius: 10, border: "none", background: (colMap?.account !== undefined) ? `linear-gradient(135deg, ${c.accent}, ${c.purple})` : c.borderSub, color: "#fff", cursor: (colMap?.account !== undefined) ? "pointer" : "default", fontFamily: "inherit", fontWeight: 700, boxShadow: (colMap?.account !== undefined) ? `0 4px 12px ${c.accent}25` : "none" }}>Import {csvPreview.total_rows} Rows →</button>
              </div>
            </>)}

            {/* Step 2: Importing */}
            {uploadStep === 2 && (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ width: 44, height: 44, border: `3px solid ${c.accent}30`, borderTopColor: c.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                <div style={{ fontSize: 15, fontWeight: 800, color: c.text, marginBottom: 4 }}>Importing your data...</div>
                <div style={{ fontSize: 11, color: c.textDim }}>Creating accounts, transactions, and budgets from {uploadFile?.name}</div>
              </div>
            )}

            {/* Step 3: Complete */}
            {uploadStep === 3 && importResult && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${c.green}, ${c.accent})`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: `0 8px 24px ${c.green}20` }}>
                  <Check size={26} color="#fff" strokeWidth={3} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: c.text, marginBottom: 8 }}>Import Complete</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20, maxWidth: 360, margin: "0 auto 20px" }}>
                  {[
                    { label: "Accounts", value: importResult.accounts_created, color: c.accent },
                    { label: "Transactions", value: importResult.transactions_created, color: c.green },
                    { label: "Budgets", value: importResult.budgets_created, color: c.purple },
                  ].map(s => (
                    <div key={s.label} style={{ padding: "12px 8px", borderRadius: 10, background: `${s.color}08`, border: `1px solid ${s.color}15` }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                      <div style={{ fontSize: 9, color: c.textDim, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {importResult.errors > 0 && (
                  <div style={{ fontSize: 10, color: c.amber, marginBottom: 12 }}>{importResult.errors} rows had errors · {importResult.error_details?.slice(0, 3).join(" · ")}</div>
                )}
                <div style={{ fontSize: 11, color: c.textDim, marginBottom: 16 }}>Your P&L and Dashboard will now show this data.</div>
                <button onClick={() => { setUploadOpen(false); setUploadStep(0); setUploadFile(null); toast(`Imported ${importResult.transactions_created} transactions`, "success"); }} style={{ fontSize: 13, padding: "12px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.green}, ${c.accent})`, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: `0 4px 16px ${c.green}20` }}>Go to Dashboard →</button>
              </div>
            )}
          </div>
        </div>
        );
      })()}

      {/* Plaid Bank Connect Modal */}
      {plaidOpen && (
        <div onClick={() => setPlaidOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 420, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s ease" }}>
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
const InvestorView = ({ c, toast, onDrawer }) => (
  <div style={{ padding: 32 }}>
    {/* View Header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.green}15, ${c.accent}08)`, border: `1px solid ${c.green}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <TrendingUp size={17} color={c.green} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Investor Metrics</div><span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.green}15`, color: c.green, letterSpacing: "0.06em" }}>BOARD READY</span></div>
          <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>Series A readiness scorecard · 8 SaaS benchmarks · Board-ready exports</div>
          <div style={{ fontSize: 9, color: c.textFaint, marginTop: 4 }}>Data as of {fmtTime(new Date())} · Auto-refreshed daily</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { downloadCSV("financeos-investor-metrics.csv", ["Metric","Value","Benchmark","Notes"], [["ARR","$48.6M","+24% YoY",""],["NDR","118%",">110%","Best-in-class"],["Rule of 40","52.1","Growth 47.8% + Margin 4.3%",""],["Burn Multiple","0.8x","<1.0x","Efficient"],["Gross Margin","84.7%","70-80%","SaaS benchmark"],["CAC Payback","14 mo","<18 months",""],["LTV/CAC","4.2x",">3.0x","Healthy"],["Cash Runway","34 mo","$12.8M cash",""]]); toast("Investor metrics exported as CSV", "success"); }} style={{ fontSize: 11, padding: "8px 14px", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Export CSV</button>
        <button onClick={() => { downloadPDF("Investor Readiness Report", ["Metric", "Value", "Benchmark", "Notes"], [["ARR", "$48.6M", "+24% YoY", ""],["NDR", "118%", ">110%", "Best-in-class"],["Rule of 40", "52.1", "47.8% + 4.3%", ""],["Burn Multiple", "0.8x", "<1.0x", "Efficient"],["Gross Margin", "84.7%", "70-80%", ""],["CAC Payback", "14 mo", "<18 months", ""],["LTV/CAC", "4.2x", ">3.0x", ""],["Cash Runway", "34 mo", "$12.8M", ""]]); toast("Investor report exported as PDF", "success"); }} style={{ fontSize: 11, padding: "8px 14px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Export PDF</button>
      </div>
    </div>

    {/* Benchmark Scorecard */}
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: "18px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 20 }}>
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
    <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
      SaaS Benchmarks
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
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
        <div key={k.label} onClick={() => { const drawerKey = { "Net Dollar Retention": "NDR", "CAC Payback": "CAC Payback", "LTV/CAC": "LTV/CAC", "Cash Runway": "Burn Multiple" }[k.label] || k.label; if (onDrawer) onDrawer(drawerKey); }} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "20px 22px", transition: "all 0.2s ease", cursor: "pointer" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${k.color}40`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${k.color}12`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
        >
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
    <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
      Retention & Readiness
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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
              <div style={{ width: `${Math.min(parseInt(r.retention), 200) / 2}%`, height: "100%", background: `linear-gradient(90deg, ${r.color}, ${r.color}aa)`, borderRadius: 3, transition: "width 0.5s ease" }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: r.color, fontFamily: "'JetBrains Mono', monospace", width: 45, textAlign: "right" }}>{r.retention}</span>
          </div>
        ))}
      </div>

      <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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
    <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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
// ── TEAM VIEW — Digital office environment ─────────────────
const TeamView = ({ c, toast, onNav, userName }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [tab, setTab] = useState("members");
  const [msgInput, setMsgInput] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);

  const teamMembers = [
    { id: 1, name: userName || "Alex Morgan", initials: (userName || "AM").split(" ").map(w => w[0]).join("").slice(0,2), role: "Owner", title: "CEO & Founder", dept: "Executive", status: "online", statusMsg: "Working on Q1 close", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face", coverImg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=120&fit=crop", email: "support@finance-os.app", tasks: 4, lastActive: "Now" },
    { id: 2, name: "Sarah Chen", initials: "SC", role: "Admin", title: "VP of Finance", dept: "Finance", status: "online", statusMsg: "Reviewing forecasts", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face", coverImg: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=120&fit=crop", email: "s.chen@company.com", tasks: 6, lastActive: "2 min ago" },
    { id: 3, name: "James Rodriguez", initials: "JR", role: "Manager", title: "FP&A Manager", dept: "Finance", status: "away", statusMsg: "In a meeting until 3pm", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face", coverImg: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=120&fit=crop", email: "j.rodriguez@company.com", tasks: 3, lastActive: "15 min ago" },
    { id: 4, name: "Priya Patel", initials: "PP", role: "Budget Owner", title: "Controller", dept: "Accounting", status: "online", statusMsg: "", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face", coverImg: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=120&fit=crop", email: "p.patel@company.com", tasks: 8, lastActive: "Just now" },
    { id: 5, name: "David Kim", initials: "DK", role: "Viewer", title: "Revenue Analyst", dept: "RevOps", status: "offline", statusMsg: "", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face", coverImg: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=120&fit=crop", email: "d.kim@company.com", tasks: 2, lastActive: "1 hr ago" },
  ];

  const messages = [
    { id: 1, sender: "Sarah Chen", initials: "SC", content: "I've updated the Q1 revenue forecast with the latest pipeline data. MAPE is down to 2.8% this period.", time: "2:34 PM", channel: "forecast" },
    { id: 2, sender: "Priya Patel", initials: "PP", content: "Close checklist: 14/18 tasks complete. Waiting on IC elimination review from James.", time: "1:52 PM", channel: "close-tasks" },
    { id: 3, sender: userName || "Alex Morgan", initials: (userName || "AM").split(" ").map(w => w[0]).join("").slice(0,2), content: "Board deck draft is ready for review. I've exported the investor metrics — can someone double-check the Rule of 40 calc?", time: "12:15 PM", channel: "general" },
    { id: 4, sender: "James Rodriguez", initials: "JR", content: "IC elimination complete for APAC entity. FX adjustment: -$42K impact on consolidated EBITDA.", time: "11:30 AM", channel: "consolidation" },
    { id: 5, sender: "David Kim", initials: "DK", content: "New Stripe data synced — 23 new transactions this week. Revenue recognition looks clean.", time: "10:45 AM", channel: "integrations" },
  ];

  const recentTasks = [
    { title: "Review Q1 variance analysis", assignee: "Sarah Chen", assigneeInit: "SC", priority: "high", status: "in_progress", due: "Today", view: "pnl" },
    { title: "Complete IC elimination for EU entity", assignee: "James Rodriguez", assigneeInit: "JR", priority: "urgent", status: "in_progress", due: "Today", view: "consolidation" },
    { title: "Validate ML forecast accuracy", assignee: "Sarah Chen", assigneeInit: "SC", priority: "medium", status: "pending", due: "Tomorrow", view: "forecast" },
    { title: "Close AP accruals for March", assignee: "Priya Patel", assigneeInit: "PP", priority: "high", status: "pending", due: "Mar 28", view: "close" },
    { title: "Update board deck metrics", assignee: userName || "Alex Morgan", assigneeInit: (userName || "AM").split(" ").map(w => w[0]).join("").slice(0,2), priority: "medium", status: "review", due: "Mar 29", view: "investor" },
    { title: "Sync Salesforce pipeline data", assignee: "David Kim", assigneeInit: "DK", priority: "low", status: "completed", due: "Done", view: "integrations" },
  ];

  const statusColors = { online: c.green, away: c.amber, busy: c.red, offline: c.textFaint };
  const priorityColors = { urgent: c.red, high: c.amber, medium: c.accent, low: c.textDim };
  const statusLabels = { pending: "To Do", in_progress: "In Progress", review: "Review", completed: "Done", cancelled: "Cancelled" };
  const avatarGradients = [
    `linear-gradient(135deg, ${c.accent}, ${c.purple})`,
    `linear-gradient(135deg, ${c.green}, ${c.cyan})`,
    `linear-gradient(135deg, ${c.amber}, ${c.red})`,
    `linear-gradient(135deg, ${c.purple}, ${c.accent})`,
    `linear-gradient(135deg, ${c.cyan}, ${c.green})`,
  ];

  // Hero background images for team view — cycles through scenic office/city imagery
  const [bgIdx, setBgIdx] = useState(0);
  const teamBgImages = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&fit=crop", // glass skyscraper
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&fit=crop", // modern office
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&fit=crop", // beach
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80&fit=crop", // city skyline night
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&fit=crop", // mountain snow
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80&fit=crop", // city aerial
  ];
  useEffect(() => { const t = setInterval(() => setBgIdx(i => (i + 1) % teamBgImages.length), 8000); return () => clearInterval(t); }, []);

  return (
    <div style={{ padding: 0 }}>
      {/* Dynamic Hero Banner with slideshow */}
      <div style={{ position: "relative", height: 180, overflow: "hidden", borderRadius: "0 0 24px 24px" }}>
        {teamBgImages.map((img, i) => (
          <img key={i} src={img} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "opacity 1.5s ease-in-out", opacity: bgIdx === i ? 1 : 0 }} />
        ))}
        {/* Gradient overlay for text readability */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 60%, ${c.bg || c.surface} 100%)` }} />
        {/* FinanceOS watermark */}
        <div style={{ position: "absolute", top: 16, right: 20, display: "flex", alignItems: "center", gap: 6, opacity: 0.6 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LayoutDashboard size={11} color="#fff" />
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.8)", letterSpacing: "-0.02em" }}>FinanceOS</span>
        </div>
        {/* Slideshow dots */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
          {teamBgImages.map((_, i) => (
            <div key={i} onClick={() => setBgIdx(i)} style={{ width: bgIdx === i ? 18 : 6, height: 6, borderRadius: 3, background: bgIdx === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.3s ease" }} />
          ))}
        </div>
        {/* Header content overlaid on banner */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 32px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${c.accent}30, ${c.purple || c.accent}20)`, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Users size={19} color="#fff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Team</div>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 8, fontWeight: 700, padding: "3px 10px", borderRadius: 5, background: "rgba(52,211,153,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(52,211,153,0.3)", color: "#6ee7b7" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6ee7b7", animation: "pulse 2s infinite" }} />
                  {teamMembers.filter(m => m.status === "online").length} online
                </span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>{teamMembers.length} members · {recentTasks.filter(t => t.status !== "completed").length} active tasks</div>
            </div>
          </div>
          <button onClick={() => toast("Invite sent — check their email", "success")} style={{ fontSize: 11, padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.accent}, ${c.purple || c.accent})`, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 14px rgba(0,0,0,0.3)` }}>+ Invite Member</button>
        </div>
      </div>

      {/* Content area below banner */}
      <div style={{ padding: "20px 32px 32px" }}>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: c.surfaceAlt, borderRadius: 10, padding: 3, border: `1px solid ${c.borderSub}`, maxWidth: 500 }}>
        {[{ id: "members", label: "Members" }, { id: "messages", label: "Messages" }, { id: "tasks", label: "Tasks" }, { id: "activity", label: "Activity" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, fontSize: 11, padding: "8px 0", borderRadius: 7, border: "none",
            background: tab === t.id ? c.surface : "transparent", color: tab === t.id ? c.text : c.textDim,
            fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
            boxShadow: tab === t.id ? c.shadow1 : "none", transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* MEMBERS TAB */}
      {tab === "members" && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
          {teamMembers.map((m, i) => (
            <div key={m.id} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 18, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}25`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 36px ${c.accent}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              {/* Cover image */}
              {m.coverImg && (
                <div style={{ height: 64, position: "relative", overflow: "hidden" }}>
                  <img src={m.coverImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 30%, ${c.surface}ee 90%, ${c.surface})` }} />
                </div>
              )}
              <div style={{ padding: "0 20px 20px", marginTop: m.coverImg ? -20 : 22 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
                <div style={{ position: "relative" }}>
                  {m.avatar ? (
                    <img src={m.avatar} alt={m.name} style={{ width: 48, height: 48, borderRadius: 14, objectFit: "cover", border: `3px solid ${c.surface}`, boxShadow: `0 4px 12px ${c.accent}12` }} loading="lazy" />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: avatarGradients[i % 5], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", border: `3px solid ${c.surface}`, boxShadow: `0 4px 12px ${c.accent}12` }}>{m.initials}</div>
                  )}
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: statusColors[m.status], border: `2.5px solid ${c.surface}` }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: c.textDim }}>{m.title}</div>
                </div>
                <span style={{ fontSize: 7, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: m.role === "Owner" ? `linear-gradient(135deg, ${c.accent}15, ${c.purple}10)` : `${c.accent}10`, color: m.role === "Owner" ? c.purple : c.accent, letterSpacing: "0.04em", border: m.role === "Owner" ? `1px solid ${c.purple}15` : "none" }}>{m.role.toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", gap: 8, fontSize: 10, color: c.textFaint, marginBottom: 10 }}>
                <span>{m.dept}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: c.borderBright, alignSelf: "center" }} />
                <span>{m.lastActive}</span>
              </div>
              {m.statusMsg && <div style={{ fontSize: 10, color: c.textDim, fontStyle: "italic", padding: "6px 10px", background: c.surfaceAlt, borderRadius: 8, marginBottom: 10 }}>"{m.statusMsg}"</div>}
              {/* Dynamic action buttons grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                {[
                  { label: "Message", icon: "▹", color: c.accent, action: () => toast(`Message sent to ${m.name}`, "success") },
                  { label: "Assign Task", icon: "▣", color: c.purple, action: () => toast(`Task assigned to ${m.name}`, "success") },
                  { label: "Schedule", icon: "▫", color: c.green, action: () => window.open("https://calendly.com/finance-os-support/30min", "_blank") },
                  { label: "Profile", icon: "▾", color: c.amber, action: () => toast(`Viewing ${m.name}'s profile`, "success") },
                  { label: "Share Report", icon: "◈", color: c.cyan || c.accent, action: () => toast(`Report shared with ${m.name}`, "success") },
                  { label: "Permissions", icon: "◆", color: c.textDim, action: () => toast(`Managing ${m.name}'s permissions`, "info") },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.action} style={{ fontSize: 9, padding: "6px 0", borderRadius: 6, border: `1px solid ${c.border}`, background: "transparent", color: c.textDim, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.18s", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = btn.color; e.currentTarget.style.color = btn.color; e.currentTarget.style.background = `${btn.color}06`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textDim; e.currentTarget.style.background = "transparent"; }}
                  >{btn.icon} {btn.label}</button>
                ))}
              </div>
              </div>{/* close padding wrapper */}
            </div>
          ))}
        </div>
      )}

      {/* MESSAGES TAB */}
      {tab === "messages" && (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${c.borderSub}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Team Chat</div>
            <div style={{ display: "flex", gap: 4 }}>
              {["general", "close-tasks", "forecast"].map(ch => (
                <span key={ch} style={{ fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: ch === "general" ? `${c.accent}12` : c.surfaceAlt, color: ch === "general" ? c.accent : c.textFaint, cursor: "pointer", letterSpacing: "0.04em" }}>#{ch}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: "14px 20px", maxHeight: 400, overflow: "auto" }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${c.borderSub}` }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: avatarGradients[msg.id % 5], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{msg.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{msg.sender}</span>
                    <span style={{ fontSize: 9, color: c.textFaint }}>{msg.time}</span>
                    <span style={{ fontSize: 7, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: c.surfaceAlt, color: c.textFaint }}>#{msg.channel}</span>
                  </div>
                  <div style={{ fontSize: 12, color: c.textSec, lineHeight: 1.6 }}>{msg.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 20px", borderTop: `1px solid ${c.borderSub}`, display: "flex", gap: 8 }}>
            <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && msgInput.trim()) { toast("Message sent to #general", "success"); setMsgInput(""); } }}
              placeholder="Type a message..." style={{ flex: 1, padding: "9px 14px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontSize: 12, fontFamily: "inherit", outline: "none" }} />
            <button onClick={() => { if (msgInput.trim()) { toast("Message sent", "success"); setMsgInput(""); } }} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: c.accent, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* TASKS TAB */}
      {tab === "tasks" && (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${c.borderSub}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Task Board</div>
            <button onClick={() => toast("New task created", "success")} style={{ fontSize: 10, padding: "6px 12px", borderRadius: 6, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ New Task</button>
          </div>
          {recentTasks.map((task, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < recentTasks.length - 1 ? `1px solid ${c.borderSub}` : "none", transition: "all 0.15s", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = `${c.accent}04`}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              onClick={() => onNav(task.view)}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: avatarGradients[teamMembers.findIndex(m => m.name === task.assignee) % 5] || avatarGradients[0], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{task.assigneeInit}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: c.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
                <div style={{ fontSize: 9, color: c.textFaint, marginTop: 1 }}>{task.assignee} · Due {task.due}</div>
              </div>
              <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${priorityColors[task.priority]}12`, color: priorityColors[task.priority], letterSpacing: "0.04em", textTransform: "uppercase" }}>{task.priority}</span>
              <span style={{ fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: task.status === "completed" ? `${c.green}12` : task.status === "in_progress" ? `${c.accent}12` : `${c.textFaint}08`, color: task.status === "completed" ? c.green : task.status === "in_progress" ? c.accent : c.textDim }}>{statusLabels[task.status]}</span>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVITY TAB */}
      {tab === "activity" && (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 14 }}>Recent Activity</div>
          {[
            { actor: "Sarah Chen", init: "SC", action: "updated Q1 revenue forecast", detail: "MAPE improved to 2.8%", time: "2:34 PM", color: c.accent },
            { actor: "Priya Patel", init: "PP", action: "completed 3 close tasks", detail: "AP accruals, deferred revenue, prepaid amortization", time: "1:52 PM", color: c.green },
            { actor: userName || "Alex Morgan", init: (userName || "AM").split(" ").map(w => w[0]).join("").slice(0,2), action: "exported investor metrics PDF", detail: "Rule of 40: 52.1, Burn Multiple: 0.8x", time: "12:15 PM", color: c.purple },
            { actor: "James Rodriguez", init: "JR", action: "completed IC elimination", detail: "APAC entity, FX adjustment: -$42K", time: "11:30 AM", color: c.amber },
            { actor: "David Kim", init: "DK", action: "synced Stripe integration", detail: "23 new transactions imported", time: "10:45 AM", color: c.cyan },
            { actor: "AI Copilot", init: "◎", action: "flagged revenue variance", detail: "+$2.1M beat vs budget, Enterprise segment", time: "10:00 AM", color: c.purple },
          ].map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 5 ? `1px solid ${c.borderSub}` : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: typeof e.init === "string" && e.init.length <= 2 ? avatarGradients[i % 5] : `${c.purple}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: e.init === "◎" ? 14 : 9, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{e.init}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: c.text }}><span style={{ fontWeight: 700 }}>{e.actor}</span> {e.action}</div>
                <div style={{ fontSize: 10, color: c.textFaint, marginTop: 2 }}>{e.detail}</div>
              </div>
              <span style={{ fontSize: 9, color: c.textFaint, whiteSpace: "nowrap" }}>{e.time}</span>
            </div>
          ))}
        </div>
      )}
      </div>{/* close content area below banner */}
    </div>
  );
};

const AdminView = ({ c, toast, onNav }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [tab, setTab] = useState("overview");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "billing", label: "Revenue", icon: DollarSign },
    { id: "system", label: "System Health", icon: Activity },
    { id: "workspace", label: "Workspace", icon: Globe },
  ];

  const adminKpis = [
    { label: "Plan", value: "Enterprise", delta: "Active", up: true, color: c.accent, icon: Zap },
    { label: "Team Members", value: "6", delta: "+2 this month", up: true, color: c.green, icon: Users },
    { label: "Edge Functions", value: "16", delta: "All healthy", up: true, color: c.purple, icon: Cpu },
    { label: "GL Accounts", value: "18", delta: "Active", up: true, color: c.green, icon: FileText },
    { label: "Transactions", value: "3.1K", delta: "9 months", up: true, color: c.cyan || c.accent, icon: Activity },
    { label: "Integrations", value: "7", delta: "All synced", up: true, color: c.accent, icon: Plug },
  ];

  const users = [
    { name: "Alex Morgan", email: "support@finance-os.app", role: "Owner", status: "active", lastActive: "Now", sessions: 24, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&q=80&fit=crop&crop=face", dept: "Finance" },
    { name: "Sarah Chen", email: "sarah@finance-os.app", role: "Admin", status: "active", lastActive: "2 min ago", sessions: 18, dept: "FP&A" },
    { name: "Priya Patel", email: "priya@finance-os.app", role: "Manager", status: "active", lastActive: "15 min ago", sessions: 12, dept: "Accounting" },
    { name: "James Rodriguez", email: "james@finance-os.app", role: "Budget Owner", status: "active", lastActive: "1 hr ago", sessions: 8, dept: "Operations" },
    { name: "David Kim", email: "david@finance-os.app", role: "Viewer", status: "active", lastActive: "3 hr ago", sessions: 5, dept: "Engineering" },
    { name: "Alex Thompson", email: "alex@company.com", role: "Viewer", status: "invited", lastActive: "—", sessions: 0, dept: "Sales" },
  ];

  const events = [
    { action: "GL data loaded from database", actor: "System", time: "Just now", type: "data" },
    { action: "Sarah Chen exported Q1 P&L report", actor: "Sarah Chen", time: "12 min ago", type: "action" },
    { action: "Priya Patel completed 3 close tasks", actor: "Priya Patel", time: "34 min ago", type: "action" },
    { action: "Stripe Connect account onboarded", actor: "System", time: "1 hr ago", type: "integration" },
    { action: "Apple Sign In", actor: "Alex Morgan", time: "1 hr ago", type: "auth" },
    { action: "James Rodriguez updated budget model", actor: "James Rodriguez", time: "2 hr ago", type: "data" },
    { action: "Plan upgraded to Enterprise", actor: "System", time: "Today", type: "billing" },
    { action: "Organization created", actor: "System", time: "Mar 20", type: "admin" },
    { action: "Edge Function deployed: gl-data", actor: "System", time: "Mar 21", type: "action" },
    { action: "Copilot API key configured", actor: "System", time: "Mar 21", type: "security" },
    { action: "Connected account verified", actor: "Stripe", time: "Mar 21", type: "integration" },
    { action: "David Kim viewed forecast dashboard", actor: "David Kim", time: "3 hr ago", type: "data" },
  ];

  const eventColors = { auth: c.green, data: c.accent, action: c.purple, security: c.amber, integration: c.cyan || c.accent, admin: c.textSec, billing: c.green };

  // Workspace usage data
  const usageData = [
    { day: "Mon", logins: 12, queries: 34, exports: 5 },
    { day: "Tue", logins: 15, queries: 42, exports: 8 },
    { day: "Wed", logins: 18, queries: 55, exports: 12 },
    { day: "Thu", logins: 14, queries: 48, exports: 9 },
    { day: "Fri", logins: 20, queries: 62, exports: 15 },
    { day: "Sat", logins: 4, queries: 8, exports: 1 },
    { day: "Sun", logins: 2, queries: 5, exports: 0 },
  ];

  return (
    <div style={{ padding: 32 }}>
      {/* View Header — elevated with gradient accent */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${c.amber}20, ${c.red}10)`, border: `1px solid ${c.amber}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, boxShadow: `0 4px 16px ${c.amber}10` }}>
            <Shield size={19} color={c.amber} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Admin Console</div>
              <span style={{ fontSize: 7, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: `linear-gradient(135deg, ${c.accent}15, ${c.purple}10)`, color: c.accent, letterSpacing: "0.06em", border: `1px solid ${c.accent}10` }}>ADMIN</span>
            </div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 3, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} />{users.filter(u => u.status === "active").length} active users</span>
              <span style={{ color: c.borderSub }}>·</span>
              <span>{events.length} events today</span>
              <span style={{ color: c.borderSub }}>·</span>
              <span>All systems operational</span>
            </div>
            <div style={{ fontSize: 9, color: c.textFaint, marginTop: 4 }}>Data as of {fmtTime(new Date())} · Audit log: real-time</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => toast("Audit log exported — 312 events", "success")} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; }}
          >Export Log</button>
          <button onClick={() => setInviteOpen(true)} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.accent}, ${c.purple || c.accent})`, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 14px ${c.accent}25` }}>+ Invite User</button>
        </div>
      </div>

      {/* Tab bar — with icons */}
      <div style={{ display: "flex", gap: 3, marginBottom: 24, background: c.surfaceAlt, borderRadius: 12, padding: 3, border: `1px solid ${c.borderSub}`, maxWidth: 600 }}>
        {tabs.map(t => {
          const Icon = t.icon;
          return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, fontSize: 11, padding: "9px 0", borderRadius: 9, border: "none",
            background: tab === t.id ? c.surface : "transparent",
            color: tab === t.id ? c.text : c.textDim,
            fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
            boxShadow: tab === t.id ? c.shadow1 : "none", transition: "all 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}><Icon size={12} />{t.label}</button>
          );
        })}
      </div>

      {tab === "overview" && (<>
        {/* Admin KPIs — elevated cards with icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Platform Metrics</div>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
          {adminKpis.map(k => {
            const Icon = k.icon;
            return (
            <div key={k.label} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "20px 22px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${k.color}30`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 36px ${k.color}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.glassBorder || c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = c.cardGlow; }}
            >
              {/* Top accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${k.color}, ${k.color}40)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint }}>{k.label}</div>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${k.color}18, ${k.color}06)`, border: `1px solid ${k.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={14} color={k.color} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}>{k.value}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: k.up ? c.green : c.red, background: k.up ? c.greenDim : c.redDim, padding: "3px 8px", borderRadius: 6, border: `1px solid ${k.up ? c.green : c.red}12` }}>{k.delta}</span>
              </div>
            </div>
            );
          })}
        </div>

        {/* Team Health + Workspace Usage row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Team Health & Usage</div>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 28 }}>
          {/* Team online status mini cards */}
          <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.green}18, ${c.green}06)`, border: `1px solid ${c.green}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={13} color={c.green} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Team Activity</div>
                  <div style={{ fontSize: 9, color: c.textDim }}>{users.filter(u => u.status === "active" && u.lastActive !== "—").length} active now</div>
                </div>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: `${c.green}08`, border: `1px solid ${c.green}10`, color: c.green }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} />LIVE
              </span>
            </div>
            {users.filter(u => u.status === "active").slice(0, 5).map((u, i) => (
              <div key={u.email} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? `1px solid ${c.borderSub}` : "none" }}>
                <div style={{ position: "relative" }}>
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.name} style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" }} loading="lazy" />
                  ) : (
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}, ${c.purple || c.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>{u.name.split(" ").map(w => w[0]).join("")}</div>
                  )}
                  <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: u.lastActive === "Now" || u.lastActive.includes("min") ? c.green : c.amber, border: `2px solid ${c.surface || c.bg}` }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: c.text }}>{u.name}</div>
                  <div style={{ fontSize: 9, color: c.textFaint }}>{u.dept} · {u.lastActive}</div>
                </div>
                <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: u.role === "Owner" ? `${c.purple || c.accent}10` : `${c.accent}08`, color: u.role === "Owner" ? (c.purple || c.accent) : c.accent }}>{u.role}</span>
              </div>
            ))}
          </div>

          {/* Weekly usage mini chart */}
          <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}18, ${c.accent}06)`, border: `1px solid ${c.accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BarChart3 size={13} color={c.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Weekly Usage</div>
                  <div style={{ fontSize: 9, color: c.textDim }}>Logins, queries & exports</div>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={usageData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid stroke={c.chartGrid} strokeDasharray="4 8" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: c.chartAxis }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: c.chartAxis }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip c={c} />} />
                <Bar dataKey="logins" fill={c.accent} radius={[3, 3, 0, 0]} barSize={12} name="Logins" />
                <Bar dataKey="queries" fill={c.purple || c.accent} radius={[3, 3, 0, 0]} barSize={12} opacity={0.6} name="AI Queries" />
                <Bar dataKey="exports" fill={c.green} radius={[3, 3, 0, 0]} barSize={12} opacity={0.4} name="Exports" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 9, color: c.textDim }}>
              {[{ l: "Logins", color: c.accent }, { l: "AI Queries", color: c.purple || c.accent }, { l: "Exports", color: c.green }].map(s => (
                <span key={s.l} style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />{s.l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed + Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Activity & Quick Actions</div>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 16 }}>
          <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Activity Log</span>
              <span style={{ fontSize: 8, fontWeight: 800, padding: "3px 10px", borderRadius: 6, background: c.surfaceAlt, color: c.textFaint, letterSpacing: "0.04em" }}>{events.length} EVENTS</span>
            </div>
            <div style={{ maxHeight: 340, overflow: "auto" }}>
            {events.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < events.length - 1 ? `1px solid ${c.borderSub}` : "none", alignItems: "flex-start", transition: "all 0.15s" }}
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
          </div>
          {/* Quick Admin Actions — elevated with better grouping */}
          <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 14 }}>Quick Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Invite User", desc: "Send invite to new team member", action: () => setInviteOpen(true), color: c.accent, icon: Users },
                { label: "Export Audit Log", desc: "Download full activity history as CSV", action: () => toast("Audit log exported — 312 events", "success"), color: c.green, icon: Download },
                { label: "Rotate API Keys", desc: "Regenerate all active API keys", action: () => toast("API keys rotated — update integrations", "warning"), color: c.amber, icon: Lock },
                { label: "Force Sync All", desc: "Trigger sync on all connected integrations", action: () => { toast("Syncing 7 integrations...", "success"); }, color: c.cyan || c.accent, icon: RefreshCw },
                { label: "Generate SOC 2 Report", desc: "Export compliance evidence package", action: () => toast("SOC 2 evidence package generated", "success"), color: c.purple || c.accent, icon: Shield },
                { label: "Manage Workspace", desc: "Branding, domains & notifications", action: () => setTab("workspace"), color: c.textSec, icon: Settings },
              ].map(a => {
                const AIcon = a.icon;
                return (
                <button key={a.label} onClick={a.action} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10,
                  border: `1px solid ${c.border}`, background: "transparent", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  transition: "all 0.2s ease", color: c.text, width: "100%",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${a.color}40`; e.currentTarget.style.background = `${a.color}06`; e.currentTarget.style.transform = "translateX(2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${a.color}15, ${a.color}06)`, border: `1px solid ${a.color}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <AIcon size={13} color={a.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{a.label}</div>
                    <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>{a.desc}</div>
                  </div>
                  <ChevronRight size={14} color={c.textFaint} />
                </button>
                );
              })}
            </div>
          </div>
        </div>
      </>)}

      {tab === "users" && (
        <div>
          {/* User stats summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Total Users", value: users.length, color: c.accent },
              { label: "Active", value: users.filter(u => u.status === "active").length, color: c.green },
              { label: "Pending Invites", value: users.filter(u => u.status === "invited").length, color: c.amber },
              { label: "Total Sessions", value: users.reduce((a, u) => a + u.sessions, 0), color: c.purple || c.accent },
            ].map(s => (
              <div key={s.label} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 12, padding: "14px 16px", boxShadow: c.cardGlow, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: c.cardGlow }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${c.borderBright}` }}>
                {["User", "Role", "Department", "Status", "Last Active", "Sessions", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: c.textFaint, textAlign: "left", background: c.bg2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.email} style={{ borderBottom: `1px solid ${c.borderSub}`, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = `${c.accent}04`}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} loading="lazy" />
                      ) : (
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}, ${c.purple || c.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>{u.name.split(" ").map(w => w[0]).join("")}</div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: c.text }}>{u.name}</div>
                        <div style={{ fontSize: 10, color: c.textDim, marginTop: 1 }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: u.role === "Owner" ? `${c.purple || c.accent}12` : u.role === "Admin" ? `${c.accent}12` : c.surfaceAlt, color: u.role === "Owner" ? (c.purple || c.accent) : u.role === "Admin" ? c.accent : c.textSec }}>{u.role}</span>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 11, color: c.textDim }}>{u.dept}</td>
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
                      <button onClick={() => toast(`Editing ${u.name}`, "success")} style={{ fontSize: 10, padding: "5px 10px", borderRadius: 5, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; }}
                      >Edit</button>
                      {u.status === "invited" && <button onClick={() => toast(`Resent invite to ${u.email}`, "success")} style={{ fontSize: 10, padding: "5px 10px", borderRadius: 5, border: `1px solid ${c.amber}40`, background: c.amberDim, color: c.amber, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Resend</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {tab === "billing" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "MRR", value: "$147.2K", sub: "84 active subscriptions", color: c.accent, delta: "+8.4%" },
              { label: "ARR", value: "$1.77M", sub: "Projected from current MRR", color: c.green, delta: "+12.1%" },
              { label: "Avg Contract Value", value: "$1,752", sub: "Across all tiers", color: c.purple || c.accent, delta: "+$180" },
              { label: "Churn Rate", value: "2.1%", sub: "Last 30 days", color: c.amber, delta: "-0.3%" },
            ].map(k => (
              <div key={k.label} style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 14, padding: "18px 20px", boxShadow: c.cardGlow, transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${k.color}30`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.glassBorder || c.border; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${k.color}, ${k.color}30)` }} />
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: c.textFaint, marginBottom: 8 }}>{k.label}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>{k.value}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: k.label === "Churn Rate" ? c.green : c.green, background: c.greenDim, padding: "2px 6px", borderRadius: 4 }}>{k.delta}</span>
                </div>
                <div style={{ fontSize: 10, color: c.textDim, marginTop: 4 }}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: 16 }}>
            <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 16 }}>Revenue by Plan</div>
              {[
                { plan: "Starter ($599/mo)", orgs: 32, mrr: "$19.2K", pct: 13, color: c.accent },
                { plan: "Growth ($1,799/mo)", orgs: 38, mrr: "$68.4K", pct: 46, color: c.green },
                { plan: "Business ($4,799/mo)", orgs: 14, mrr: "$67.2K", pct: 41, color: c.purple || c.accent },
              ].map(p => (
                <div key={p.plan} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px solid ${c.borderSub}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{p.plan}</div>
                    <div style={{ fontSize: 10, color: c.textDim, marginTop: 2 }}>{p.orgs} organizations</div>
                  </div>
                  <div style={{ width: 180, height: 10, background: c.bg2, borderRadius: 5, overflow: "hidden" }}>
                    <div style={{ width: `${p.pct}%`, height: "100%", background: `linear-gradient(90deg, ${p.color}, ${p.color}80)`, borderRadius: 5, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.text, fontFamily: "'JetBrains Mono', monospace", minWidth: 70, textAlign: "right" }}>{p.mrr}</span>
                </div>
              ))}
            </div>
            {/* Net Revenue Retention */}
            <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 16 }}>Retention & Expansion</div>
              {[
                { label: "Net Revenue Retention", value: "118%", color: c.green, desc: "Above 100% = net expansion" },
                { label: "Gross Retention", value: "97.9%", color: c.accent, desc: "Before expansion revenue" },
                { label: "Logo Retention", value: "95.8%", color: c.purple || c.accent, desc: "Customer count retention" },
                { label: "Expansion Revenue", value: "$12.4K", color: c.cyan || c.accent, desc: "Upsells + add-ons this month" },
              ].map(r => (
                <div key={r.label} style={{ padding: "12px 0", borderBottom: `1px solid ${c.borderSub}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: c.text }}>{r.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: r.color, fontFamily: "'JetBrains Mono', monospace" }}>{r.value}</span>
                  </div>
                  <div style={{ fontSize: 9, color: c.textFaint }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "system" && (
        <div>
          {/* Overall health bar */}
          <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 14, padding: "16px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14, boxShadow: c.cardGlow }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.green}20, ${c.green}06)`, border: `1px solid ${c.green}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={16} color={c.green} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: c.green }}>All Systems Operational</div>
              <div style={{ fontSize: 10, color: c.textDim }}>6 services monitored · Uptime: 99.98% (30d) · Last incident: 14 days ago</div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, padding: "5px 14px", borderRadius: 8, background: `${c.green}08`, border: `1px solid ${c.green}12`, color: c.green }}>Healthy</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            {/* Service Status */}
            <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 14 }}>Service Status</div>
              {[
                { name: "API Gateway", status: "operational", latency: "42ms", uptime: "99.99%" },
                { name: "Supabase (us-east-1)", status: "operational", latency: "18ms", uptime: "99.97%" },
                { name: "Claude AI (Copilot)", status: "operational", latency: "890ms", uptime: "99.92%" },
                { name: "Stripe Billing", status: "operational", latency: "156ms", uptime: "99.99%" },
                { name: "Vercel Edge", status: "operational", latency: "12ms", uptime: "100.0%" },
                { name: "Google Fonts CDN", status: "operational", latency: "8ms", uptime: "100.0%" },
              ].map(s => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}`, transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = "4px"}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.status === "operational" ? c.green : c.red, boxShadow: `0 0 6px ${s.status === "operational" ? c.green : c.red}30` }} />
                    <span style={{ fontSize: 12, color: c.text, fontWeight: 500 }}>{s.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 9, color: c.textFaint }}>{s.uptime}</span>
                    <span style={{ fontSize: 10, color: c.textDim, fontFamily: "'JetBrains Mono', monospace", minWidth: 50, textAlign: "right" }}>{s.latency}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Security Headers */}
            <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 14 }}>Security Posture</div>
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
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: s.grade.includes("A") ? c.greenDim : s.grade === "B" ? c.amberDim : c.surfaceAlt, color: s.grade.includes("A") ? c.green : s.grade === "B" ? c.amber : c.textDim }}>{s.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workspace tab — branding, notifications, settings */}
      {tab === "workspace" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            {/* Workspace Branding */}
            <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}18, ${c.purple || c.accent}10)`, border: `1px solid ${c.accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LayoutDashboard size={13} color={c.accent} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Workspace Branding</div>
              </div>
              {[
                { label: "Workspace Name", value: "FinanceOS", desc: "Displayed across the platform" },
                { label: "Custom Domain", value: "finance-os.app", desc: "Your branded workspace URL" },
                { label: "Primary Color", value: "#60a5fa", desc: "Used for buttons, accents, and charts" },
                { label: "Logo", value: "Uploaded", desc: "32x32 SVG mark + full wordmark" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${c.borderSub}` }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{s.label}</div>
                    <div style={{ fontSize: 9, color: c.textFaint, marginTop: 1 }}>{s.desc}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: c.accent, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</span>
                </div>
              ))}
            </div>
            {/* Notification & Alert Settings */}
            <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.amber}18, ${c.amber}06)`, border: `1px solid ${c.amber}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bell size={13} color={c.amber} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Notifications & Alerts</div>
              </div>
              {/* Mini notification pipeline animation */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "10px 0 14px", position: "relative" }}>
                {[
                  { icon: "⚡", label: "Event", color: c.amber },
                  { icon: "⊕", label: "Route", color: c.accent },
                  { icon: "✉", label: "Deliver", color: c.green },
                ].map((step, si) => (
                  <React.Fragment key={step.label}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${step.color}12`, border: `1px solid ${step.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, animation: `fosNodePing 3s ease-in-out ${si * 0.4}s infinite` }}>{step.icon}</div>
                      <span style={{ fontSize: 7, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.05em" }}>{step.label}</span>
                    </div>
                    {si < 2 && (
                      <div style={{ flex: 1, height: 2, background: `${c.border}`, borderRadius: 1, position: "relative", overflow: "hidden", margin: "0 2px", marginBottom: 14 }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "30%", height: "100%", background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)`, borderRadius: 1, animation: `fosBeamSweep 2s ease-in-out ${si * 0.5}s infinite` }} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {[
                { label: "Variance Alerts", status: "Enabled", desc: "Trigger when actuals deviate >5% from budget", active: true },
                { label: "Close Task Reminders", status: "Enabled", desc: "Daily reminder 3 days before close deadline", active: true },
                { label: "Sync Failure Alerts", status: "Enabled", desc: "Instant notification on integration errors", active: true },
                { label: "Weekly Digest", status: "Enabled", desc: "Sunday summary email to all admins", active: true },
                { label: "Slack Integration", status: "Connected", desc: "Alerts posted to #finance-alerts channel", active: true },
              ].map(n => (
                <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${c.borderSub}` }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{n.label}</div>
                    <div style={{ fontSize: 9, color: c.textFaint, marginTop: 1 }}>{n.desc}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: n.active ? `${c.green}10` : c.surfaceAlt, color: n.active ? c.green : c.textFaint }}>{n.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {inviteOpen && (
        <div onClick={() => setInviteOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 400, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s ease" }}>
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

const ScenariosView = ({ c, toast, onNav }) => {
  const [selected, setSelected] = useState(0);
  const [compare, setCompare] = useState([0, 2]); // side-by-side compare indices
  const [drivers, setDrivers] = useState({ ndr: 118, pipeline: 42, churn: 2.1, headcount: 128 });
  const [showCompare, setShowCompare] = useState(false);

  const scenarios = SCENARIOS_LIST.map((s, i) => {
    if (i !== 0) return s;
    const rev = +(s.revenue * (drivers.ndr / 118) * (drivers.pipeline / 42)).toFixed(1) || s.revenue;
    const opx = +(s.opex * (drivers.headcount / 128)).toFixed(1) || s.opex;
    const ebt = rev > 0 ? +((rev - opx) / rev * 100).toFixed(1) : 0;
    return { ...s, revenue: rev, opex: opx, ebitda: ebt };
  });

  const active = scenarios[selected];
  const barMax = Math.max(...scenarios.map(s => s.revenue));

  return (
    <div style={{ padding: 32 }}>
      <ExportBar c={c} title="Scenarios"
        onCSV={() => { downloadCSV("financeos-scenarios.csv", ["Scenario","Revenue ($M)","OpEx ($M)","EBITDA %","Probability"], scenarios.map(s => [s.name, s.revenue, s.opex, s.ebitda + "%", s.probability])); toast("Scenarios exported as CSV", "success"); }}
        onPDF={() => { downloadPDF("Scenario Analysis", ["Scenario", "Revenue", "OpEx", "EBITDA %", "Probability"], scenarios.map(s => [s.name, "$" + s.revenue + "M", "$" + s.opex + "M", s.ebitda + "%", s.probability])); toast("Scenarios exported as PDF", "success"); }}
      />
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.purple}15, ${c.accent}08)`, border: `1px solid ${c.purple}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
            <GitBranch size={17} color={c.purple} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Scenario Modeling</div>
              <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${c.purple}15`, color: c.purple, letterSpacing: "0.06em" }}>{scenarios.length} ACTIVE</span>
            </div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>{scenarios.length} scenarios · Drag sliders to model assumptions in real-time</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowCompare(!showCompare)} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: `1px solid ${showCompare ? c.accent : c.border}`, background: showCompare ? c.accentDim : "transparent", color: showCompare ? c.accent : c.textSec, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Compare</button>
          <button onClick={() => toast("New scenario created", "success")} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: c.accent, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ New Scenario</button>
        </div>
      </div>

      {/* Multi-metric scenario comparison */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Scenario Comparison</div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Revenue / OpEx / EBITDA stacked bars */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.accent}18, ${c.purple}10)`, border: `1px solid ${c.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={14} color={c.accent} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Multi-Metric Comparison</div>
              <div style={{ fontSize: 10, color: c.textDim }}>Revenue · OpEx · EBITDA across all scenarios</div>
            </div>
          </div>
          {scenarios.map((s, i) => {
            const ebitdaVal = s.ebitda;
            const isActive = selected === i;
            return (
            <div key={s.name} onClick={() => setSelected(i)} style={{ marginBottom: 14, cursor: "pointer", opacity: isActive ? 1 : 0.6, transition: "all 0.2s", transform: isActive ? "translateX(2px)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: isActive ? 800 : 500, color: isActive ? c.text : c.textDim }}>{s.name}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${c.accent}08`, color: c.accent, fontFamily: "'JetBrains Mono', monospace" }}>${s.revenue}M</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: ebitdaVal > 5 ? `${c.green}08` : `${c.amber}08`, color: ebitdaVal > 5 ? c.green : c.amber, fontFamily: "'JetBrains Mono', monospace" }}>{ebitdaVal}%</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 3, height: 14, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(s.revenue / 70) * 50}%`, height: "100%", background: `linear-gradient(90deg, ${c.accent}${isActive ? "" : "80"}, ${c.accent}${isActive ? "cc" : "50"})`, borderRadius: "4px 0 0 4px", transition: "width 0.4s" }} title={`Revenue: $${s.revenue}M`} />
                <div style={{ width: `${(s.opex / 70) * 50}%`, height: "100%", background: `linear-gradient(90deg, ${c.amber}${isActive ? "" : "60"}, ${c.amber}${isActive ? "aa" : "40"})`, transition: "width 0.4s" }} title={`OpEx: $${s.opex}M`} />
                <div style={{ flex: 1, height: "100%", background: ebitdaVal > 5 ? `${c.green}${isActive ? "40" : "20"}` : `${c.red}${isActive ? "40" : "20"}`, borderRadius: "0 4px 4px 0" }} title={`EBITDA: ${ebitdaVal}%`} />
              </div>
            </div>
            );
          })}
          <div style={{ display: "flex", gap: 14, marginTop: 14, paddingTop: 10, borderTop: `1px solid ${c.borderSub}`, fontSize: 9, color: c.textDim }}>
            {[{ l: "Revenue", color: c.accent }, { l: "OpEx", color: c.amber }, { l: "EBITDA", color: c.green }].map(s => (
              <span key={s.l} style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />{s.l}
              </span>
            ))}
          </div>
        </div>

        {/* Sensitivity tornado chart */}
        <div style={{ background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${c.glassBorder}`, borderRadius: 16, padding: "22px 24px", boxShadow: c.cardGlow, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.red}18, ${c.green}10)`, border: `1px solid ${c.amber}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={14} color={c.amber} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Sensitivity Analysis</div>
              <div style={{ fontSize: 10, color: c.textDim }}>Impact on revenue per ±10% change</div>
            </div>
          </div>
          {[
            { driver: "NDR Rate", low: -4.2, high: 5.8, unit: "$M" },
            { driver: "Pipeline Conv.", low: -3.1, high: 3.8, unit: "$M" },
            { driver: "Gross Churn", low: -2.8, high: 1.9, unit: "$M" },
            { driver: "Headcount", low: -1.5, high: -0.8, unit: "$M" },
            { driver: "ACV Trend", low: -1.2, high: 2.4, unit: "$M" },
          ].map((d, i) => {
            const maxAbs = 6;
            const lowPct = Math.abs(d.low) / maxAbs * 50;
            const highPct = Math.abs(d.high) / maxAbs * 50;
            return (
              <div key={d.driver} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ width: 90, fontSize: 10, color: c.textDim, fontWeight: 600, textAlign: "right" }}>{d.driver}</span>
                <div style={{ flex: 1, height: 16, display: "flex", alignItems: "center", position: "relative" }}>
                  {/* Center line */}
                  <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: c.borderSub }} />
                  {/* Low bar (left of center) */}
                  <div style={{ position: "absolute", right: "50%", height: "100%", width: `${lowPct}%`, background: `linear-gradient(270deg, ${c.red}60, ${c.red}20)`, borderRadius: "4px 0 0 4px", transition: "width 0.4s" }} />
                  {/* High bar (right of center) */}
                  <div style={{ position: "absolute", left: "50%", height: "100%", width: `${highPct}%`, background: `linear-gradient(90deg, ${c.green}60, ${c.green}20)`, borderRadius: "0 4px 4px 0", transition: "width 0.4s" }} />
                </div>
                <div style={{ width: 70, display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ color: c.red, fontWeight: 700 }}>{d.low > 0 ? "+" : ""}{d.low}</span>
                  <span style={{ color: c.green, fontWeight: 700 }}>+{d.high}</span>
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${c.borderSub}`, fontSize: 9, color: c.textFaint }}>
            <span>← Downside risk</span><span>Upside potential →</span>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        {showCompare ? "Side-by-Side Comparison" : "Scenario Detail"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: showCompare ? "1fr auto 1fr" : "1fr 320px", gap: showCompare ? 8 : 16 }}>
        {/* Scenario cards or comparison */}
        {showCompare ? (() => {
          const s1 = scenarios[compare[0]];
          const s2 = scenarios[compare[1]];
          const renderCard = (s) => (
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: c.text, marginBottom: 16 }}>{s.name}</div>
              {[{ l: "Revenue", v: `$${s.revenue}M`, color: c.text }, { l: "OpEx", v: `$${s.opex}M`, color: c.amber }, { l: "EBITDA Margin", v: `${s.ebitda}%`, color: s.ebitda > 5 ? c.green : c.red }, { l: "Status", v: s.status, color: s.status === "Active" ? c.green : c.textDim }].map(r => (
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
            {/* Left column: Scenario cards */}
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                Scenario Models
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {scenarios.map((s, i) => (
                <div key={s.name} onClick={() => setSelected(i)} style={{
                  background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur, border: `1px solid ${selected === i ? c.accent : c.border}`, borderRadius: 12, padding: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  cursor: "pointer", transition: "border-color 0.15s, transform 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; }}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: c.text }}>{s.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: s.status === "Active" ? c.greenDim : c.surfaceAlt, color: s.status === "Active" ? c.green : c.textDim }}>{s.status}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[{ l: "Rev", v: `$${s.revenue}M` }, { l: "OpEx", v: `$${s.opex}M` }, { l: "EBITDA", v: `${s.ebitda}%` }].map(m => (
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
            </div>

            {/* Right column: Assumption sliders */}
            <div>
            <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              Assumption Drivers
            </div>
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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
// ══════════════════════════════════════════════════════════════
// ENV 12: INTELLIGENCE LIBRARY — Content Pipeline / Analyst Reports / Lead Capture
// ══════════════════════════════════════════════════════════════
const INTEL_RESOURCES = [
  { id: 1, title: "The State of AI in FP&A: 2026 Market Intelligence Report", desc: "Comprehensive analysis of AI adoption across 500+ enterprise finance teams. ROI benchmarks, model selection, compliance frameworks, and 3-year projections.", type: "report", category: "analyst", date: "Mar 2026", pages: "48", featured: true, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop" },
  { id: 2, title: "CFO's Guide to AI-Powered Financial Planning", desc: "Step-by-step playbook for implementing AI in your FP&A workflow. Includes vendor evaluation matrix and implementation timeline.", type: "guide", category: "guides", date: "Mar 2026", pages: "32", img: "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=340&fit=crop" },
  { id: 3, title: "Enterprise FP&A Platform Comparison", desc: "Side-by-side comparison of FinanceOS against Anaplan, Adaptive, Pigment, Mosaic, and Runway across 42 evaluation criteria.", type: "report", category: "analyst", date: "Feb 2026", pages: "28", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=340&fit=crop" },
  { id: 4, title: "Webinar: Building a Real-Time Close Process", desc: "Join our VP of Product and Coca-Cola's Controller for a live walkthrough of reducing close cycle from 12 days to 4 days.", type: "webinar", category: "webinars", date: "Mar 28, 2026", pages: "60 min", img: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=340&fit=crop" },
  { id: 5, title: "Revenue Forecasting Template Pack", desc: "12 ready-to-use forecasting templates including SaaS MRR waterfall, retail same-store sales, and multi-entity consolidation models.", type: "template", category: "templates", date: "Mar 2026", pages: "12 files", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop" },
  { id: 6, title: "The Enterprise CFO's Playbook for 2026", desc: "Strategic priorities, budget allocation frameworks, and AI adoption roadmap based on interviews with 50 Fortune 500 CFOs.", type: "report", category: "analyst", date: "Jan 2026", pages: "56", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=340&fit=crop" },
  { id: 7, title: "Financial Consolidation Best Practices Guide", desc: "Multi-entity consolidation workflows, intercompany eliminations, and currency translation strategies for growing enterprises.", type: "guide", category: "guides", date: "Feb 2026", pages: "24", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=340&fit=crop" },
  { id: 8, title: "Webinar: AI Copilot Demo — From Variance to Insight in 30 Seconds", desc: "Live demo of FinanceOS AI Copilot analyzing variance reports, generating board memos, and forecasting scenarios in real time.", type: "webinar", category: "webinars", date: "Apr 2, 2026", pages: "45 min", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=340&fit=crop" },
  { id: 9, title: "Board Reporting Template Suite", desc: "Professional board deck templates, KPI dashboards, and executive summary frameworks used by 200+ enterprise CFOs.", type: "template", category: "templates", date: "Feb 2026", pages: "8 files", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=340&fit=crop" },
  { id: 10, title: "ROI Calculator: FP&A Platform Investment", desc: "Interactive model to calculate your expected ROI from implementing FinanceOS.", type: "template", category: "templates", date: "Mar 2026", pages: "1 file", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=340&fit=crop" },
  { id: 11, title: "SaaS FP&A Benchmark Report: 2026 Edition", desc: "Key SaaS metrics benchmarked across 400 companies: NRR, CAC payback, burn multiple, Rule of 40, and runway analysis by stage.", type: "report", category: "analyst", date: "Mar 2026", pages: "36", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=340&fit=crop" },
  { id: 12, title: "Headcount Planning Guide for Hypergrowth Companies", desc: "Frameworks for building headcount models that scale, including hiring velocity and compensation benchmarking.", type: "guide", category: "guides", date: "Jan 2026", pages: "20", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=340&fit=crop" },
];

const INTEL_ANALYST_QUOTES = [
  { firm: "Gartner", initial: "G", source: "Market Guide for Cloud FP&A, 2026", quote: "FinanceOS represents the next generation of FP&A platforms, combining real-time intelligence with enterprise-grade security. Their AI-first approach is reshaping how CFOs operate." },
  { firm: "Forrester", initial: "F", source: "Wave: Financial Planning, Q1 2026", quote: "Among emerging FP&A vendors, FinanceOS stands out for speed-to-value, with customers reporting 60% faster close cycles and 4x improvement in forecast accuracy." },
  { firm: "IDC", initial: "IDC", source: "MarketScape: EPM Vendors, 2026", quote: "The personalized dashboard approach is a competitive differentiator. Enterprise clients get branded portals with 95% user adoption rates." },
];

// Unsplash stock images for video/media pipeline — corporate + human photography
const INTEL_VIDEOS = [
  { id: "v1", title: "AI-Powered Cash Flow Forecasting: From Theory to Production", desc: "Watch our engineering team demonstrate transformer-based cash prediction with 94% accuracy.", duration: "47:12", views: "1,240", topic: "AI & ML", color: "#5b9cf5", thumb: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=340&fit=crop", speakers: [{ name: "Sarah Chen", role: "VP Engineering", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face" }], featured: true },
  { id: "v2", title: "Treasury Automation Deep Dive", desc: "End-to-end walkthrough of automating treasury operations with FinanceOS.", duration: "32:15", views: "890", topic: "Treasury", color: "#3dd9a0", thumb: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=340&fit=crop", speakers: [{ name: "James Wright", role: "Head of Treasury", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" }] },
  { id: "v3", title: "Board Reporting Best Practices", desc: "How top CFOs build compelling board decks with real-time data.", duration: "28:44", views: "1,120", topic: "Reporting", color: "#a181f7", thumb: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=340&fit=crop", speakers: [{ name: "Maria Lopez", role: "CFO, Series D", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face" }] },
  { id: "v4", title: "Multi-Entity Consolidation Walkthrough", desc: "Step-by-step consolidation across 15+ entities with automated eliminations.", duration: "41:08", views: "672", topic: "Consolidation", color: "#f5b731", thumb: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&h=340&fit=crop", speakers: [{ name: "David Kim", role: "Controller", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" }] },
  { id: "v5", title: "FP&A Workflow Automation", desc: "Cut manual work by 80% with intelligent automation pipelines.", duration: "25:30", views: "1,450", topic: "FP&A", color: "#5b9cf5", thumb: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=340&fit=crop", speakers: [{ name: "Aisha Patel", role: "FP&A Director", img: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=80&h=80&fit=crop&crop=face" }] },
  { id: "v6", title: "Q1 2026 Product Roadmap", desc: "New features, integrations, and platform improvements coming this quarter.", duration: "35:55", views: "2,100", topic: "Product", color: "#2dd4d0", thumb: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=340&fit=crop", speakers: [{ name: "Michael Torres", role: "CEO", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face" }] },
];

const INTEL_EVENTS = [
  { title: "FP&A in the Age of AI — Panel Discussion", date: "Apr 8, 2026", time: "2:00 PM ET", speakers: 4, color: "#5b9cf5", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=200&fit=crop" },
  { title: "Real-Time Treasury: From Batch to Streaming", date: "Apr 15, 2026", time: "11:00 AM ET", speakers: 2, color: "#3dd9a0", img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=200&fit=crop" },
  { title: "CFO Roundtable: Budget Season Automation", date: "Apr 22, 2026", time: "1:00 PM ET", speakers: 6, color: "#a181f7", img: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=200&fit=crop" },
];

const IntelligenceView = ({ c, toast, onNav }) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalResource, setModalResource] = useState(null);
  const [leadForm, setLeadForm] = useState({ email: "", first: "", last: "", company: "", role: "", size: "" });
  const [submitted, setSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [pipelineTab, setPipelineTab] = useState("library");
  const [hoveredCard, setHoveredCard] = useState(null);

  const typeColor = (type) => type === "report" ? c.accent : type === "guide" ? c.green : type === "webinar" ? c.purple : c.amber;
  const typeIcon = (type) => type === "report" ? "◆" : type === "guide" ? "▣" : type === "webinar" ? "◈" : "◇";

  const filtered = INTEL_RESOURCES.filter(r => {
    const matchesFilter = filter === "all" || r.category === filter;
    const matchesSearch = !searchTerm || r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openGate = (resource) => { setModalResource(resource); setModalOpen(true); setSubmitted(false); setLeadForm({ email: "", first: "", last: "", company: "", role: "", size: "" }); };
  const closeModal = () => { setModalOpen(false); setModalResource(null); };

  const handleLeadSubmit = async () => {
    if (!leadForm.email || !leadForm.first) return;
    try {
      const utm = getUtmData();
      await supabase.from("leads").insert({ email: leadForm.email, first_name: leadForm.first, last_name: leadForm.last, company: leadForm.company, role: leadForm.role, company_size: leadForm.size, source: "intelligence_library", resource_id: modalResource?.id, resource_title: modalResource?.title || "Newsletter", ...utm });
      fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "waitlist", email: leadForm.email, full_name: `${leadForm.first} ${leadForm.last}`.trim(), company: leadForm.company, role: leadForm.role, interest_type: "lead", source: "intelligence_library" }) }).catch(() => {});
    } catch {}
    setSubmitted(true);
    toast("Lead captured — download link sent", "success");
  };

  const handleNewsletter = async () => {
    if (!newsletterEmail) return;
    try { await supabase.from("leads").insert({ email: newsletterEmail, source: "newsletter_intelligence" }); } catch {}
    setNewsletterDone(true);
    toast("Subscribed to Finance Intelligence", "success");
  };

  const AnimNum = ({ value, color, delay = 0 }) => (
    <span style={{ display: "inline-block", animation: `numberTick 0.5s ${delay}s cubic-bezier(0.22,1,0.36,1) backwards`, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color, letterSpacing: "-0.02em" }}>{value}</span>
  );

  return (
    <div style={{ padding: 32, animation: "fosFadeSlideUp 0.4s ease" }}>
      {/* View Header — with animated accent */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${c.accent}18, ${c.purple}12)`, border: `1px solid ${c.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, boxShadow: `0 0 24px ${c.accent}10`, animation: "glowPulse 3s ease-in-out infinite" }}>
            <Globe size={19} color={c.accent} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.text, letterSpacing: "-0.035em" }}>Finance Intelligence Library</div>
              <span style={{ fontSize: 7, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: `linear-gradient(135deg, ${c.accent}20, ${c.purple}15)`, color: c.accent, letterSpacing: "0.08em", border: `1px solid ${c.accent}15` }}>SERVICE</span>
            </div>
            <div style={{ fontSize: 12, color: c.textDim, marginTop: 3, lineHeight: 1.5 }}>Analyst reports · Benchmark data · Strategy guides · Templates · Video library · Gated downloads</div>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              {[{ val: "47", label: "Reports" }, { val: "12K+", label: "Downloads" }, { val: "2,000+", label: "Subscribers" }, { val: "24", label: "Videos" }].map((s, i) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: c.accent, animation: `numberTick 0.4s ${i * 0.1}s ease backwards` }}>{s.val}</span>
                  <span style={{ fontSize: 9, color: c.textFaint, fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animated gradient accent line */}
      <div style={{ height: 2, borderRadius: 1, background: `linear-gradient(90deg, ${c.accent}40, ${c.purple}30, ${c.green}20, transparent)`, marginBottom: 20, backgroundSize: "200% 100%", animation: "gradientShift 4s ease infinite" }} />

      {/* Sub-tabs — with indicator dots */}
      <div style={{ display: "flex", gap: 2, marginBottom: 24, background: c.bg2, borderRadius: 12, padding: 3, border: `1px solid ${c.borderSub}` }}>
        {[
          { id: "library", label: "Content Library", icon: "◆" },
          { id: "media", label: "Video & Media", icon: "◈" },
          { id: "pipeline", label: "Lead Pipeline", icon: "▣" },
          { id: "analysts", label: "Analyst Recognition", icon: "◇" },
        ].map(t => (
          <button key={t.id} onClick={() => setPipelineTab(t.id)} style={{ flex: 1, fontSize: 11, fontWeight: pipelineTab === t.id ? 700 : 500, padding: "10px 16px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)", background: pipelineTab === t.id ? c.surface : "transparent", color: pipelineTab === t.id ? c.text : c.textDim, boxShadow: pipelineTab === t.id ? `${c.shadow1}, 0 0 0 1px ${c.accent}08` : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ fontSize: 9, opacity: pipelineTab === t.id ? 1 : 0.5 }}>{t.icon}</span>
            {t.label}
            {pipelineTab === t.id && <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.accent, marginLeft: 4, animation: "pulse 2s infinite" }} />}
          </button>
        ))}
      </div>

      {/* ═══ CONTENT LIBRARY TAB — with Unsplash stock photos ═══ */}
      {pipelineTab === "library" && (
        <div style={{ animation: "fosFadeSlideUp 0.3s ease" }}>
          {/* Featured Report Banner — with real photography + animated orbs */}
          <div style={{ borderRadius: 20, marginBottom: 28, position: "relative", overflow: "hidden", border: `1px solid rgba(91,156,245,0.08)`, boxShadow: `0 16px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)` }}>
            {/* Background image */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=500&fit=crop)`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(12,18,32,0.92) 0%, rgba(20,30,51,0.88) 40%, rgba(15,24,41,0.94) 100%)" }} />
            {/* Animated orbs */}
            <div style={{ position: "absolute", top: "-30%", right: "-15%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}10, transparent 70%)`, animation: "floatOrb 8s ease-in-out infinite", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-40%", left: "-10%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${c.purple}08, transparent 70%)`, animation: "floatOrb 10s ease-in-out infinite reverse", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "24px 24px", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1, padding: "40px 44px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, alignItems: "center" }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 8, background: `rgba(91,156,245,0.12)`, border: `1px solid rgba(91,156,245,0.2)`, backdropFilter: "blur(8px)", color: "#93C5FD", fontSize: 9, fontWeight: 800, letterSpacing: "0.07em", marginBottom: 14 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#60A5FA", animation: "liveDot 2s infinite" }} />
                  FLAGSHIP REPORT · MARCH 2026
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#eef0f6", letterSpacing: "-0.035em", marginBottom: 10, lineHeight: 1.18 }}>The State of AI in FP&A:<br/>2026 Market Intelligence Report</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, marginBottom: 18 }}>Our most comprehensive analysis of AI adoption across 500+ enterprise finance teams. Covers ROI benchmarks, model selection, and 3-year market projections.</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => openGate(INTEL_RESOURCES[0])} style={{ fontSize: 12, padding: "11px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.accent}, #4B8AE8)`, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 16px ${c.accent}30`, transition: "all 0.2s" }}>Download Free Report</button>
                  <button onClick={() => openGate(INTEL_RESOURCES[0])} style={{ fontSize: 12, padding: "11px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.85)", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Executive Summary</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { val: "73%", label: "AI Adoption Rate", color: "#60A5FA", sub: "+12% YoY" },
                  { val: "4.2x", label: "Average ROI", color: c.green, sub: "First 18 months" },
                  { val: "68%", label: "Budget Increase YoY", color: c.purple, sub: "Enterprise segment" },
                  { val: "$12.8B", label: "Market Size 2026", color: c.amber, sub: "CAGR 34.2%" },
                ].map((s, i) => (
                  <div key={s.label} className="intel-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 14px", textAlign: "center", backdropFilter: "blur(8px)", transition: "all 0.25s", cursor: "default" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = `${s.color}30`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "none"; }}>
                    <AnimNum value={s.val} color={s.color} delay={i * 0.1} />
                    <div style={{ fontSize: 22 }} />
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 8, color: `${s.color}80`, fontWeight: 600, marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter bar + Search with count badges */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 4, background: c.bg2, borderRadius: 10, padding: 3, border: `1px solid ${c.borderSub}` }}>
              {[
                { label: "All", value: "all", count: INTEL_RESOURCES.length },
                { label: "Reports", value: "analyst", count: INTEL_RESOURCES.filter(r => r.category === "analyst").length },
                { label: "Guides", value: "guides", count: INTEL_RESOURCES.filter(r => r.category === "guides").length },
                { label: "Webinars", value: "webinars", count: INTEL_RESOURCES.filter(r => r.category === "webinars").length },
                { label: "Templates", value: "templates", count: INTEL_RESOURCES.filter(r => r.category === "templates").length },
              ].map(f => (
                <button key={f.value} onClick={() => setFilter(f.value)} style={{ fontSize: 10, fontWeight: filter === f.value ? 700 : 500, padding: "7px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "inherit", background: filter === f.value ? c.surface : "transparent", color: filter === f.value ? c.text : c.textFaint, boxShadow: filter === f.value ? c.shadow1 : "none", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5 }}>
                  {f.label}
                  <span style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", padding: "1px 5px", borderRadius: 4, background: filter === f.value ? `${c.accent}15` : c.bg2, color: filter === f.value ? c.accent : c.textFaint, fontWeight: 700 }}>{f.count}</span>
                </button>
              ))}
            </div>
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: c.textFaint }} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search resources..." style={{ paddingLeft: 32, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface, color: c.text, fontSize: 11, fontFamily: "inherit", outline: "none", width: 240, transition: "all 0.2s" }}
                onFocus={e => { e.target.style.borderColor = `${c.accent}40`; e.target.style.boxShadow = `0 0 0 3px ${c.accent}10`; }}
                onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }} />
            </div>
          </div>

          <div style={{ fontSize: 10, color: c.textFaint, marginBottom: 14 }}>{filtered.length} resources{searchTerm ? ` matching "${searchTerm}"` : ""}</div>

          {/* Resource Grid — Unsplash stock photography cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
            {filtered.map((r, idx) => {
              const tc = typeColor(r.type);
              const isHovered = hoveredCard === r.id;
              return (
                <div key={r.id} className="intel-card" onClick={() => openGate(r)}
                  onMouseEnter={() => setHoveredCard(r.id)} onMouseLeave={() => setHoveredCard(null)}
                  style={{ background: c.surface, border: `1px solid ${isHovered ? `${tc}35` : c.border}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", transform: isHovered ? "translateY(-4px)" : "none", boxShadow: isHovered ? `0 16px 48px ${tc}12, 0 0 0 1px ${tc}10` : c.shadow1, animationDelay: `${idx * 0.06}s` }}>
                  {/* Stock photo header */}
                  <div className="intel-img-wrap" style={{ height: 140, position: "relative", overflow: "hidden" }}>
                    <img src={r.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)` }} />
                    <span style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", borderRadius: 6, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 8, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 7 }}>{typeIcon(r.type)}</span> {r.type}
                    </span>
                    {r.featured && <span style={{ position: "absolute", top: 10, right: 10, padding: "3px 10px", borderRadius: 6, background: `linear-gradient(135deg, ${c.accent}40, ${c.purple}30)`, backdropFilter: "blur(8px)", color: "#fff", fontSize: 7, fontWeight: 800, letterSpacing: "0.07em", border: `1px solid ${c.accent}25` }}>FEATURED</span>}
                    {/* Bottom-left overlay title */}
                    <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, color: "#fff", fontSize: 14, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>{r.title.split(":")[0]}</div>
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                      <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 8px", borderRadius: 5, background: `${tc}12`, color: tc, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.type}</span>
                      <span style={{ fontSize: 8, color: c.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>{r.pages} {r.type === "webinar" ? "min" : "pages"}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: c.text, lineHeight: 1.3, marginBottom: 7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.title}</div>
                    <div style={{ fontSize: 10, color: c.textDim, lineHeight: 1.55, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.desc}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: c.textFaint }}>{r.date}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: isHovered ? tc : c.accent, transition: "color 0.2s", display: "flex", alignItems: "center", gap: 4 }}>
                        {r.type === "webinar" ? "Register" : "Download"}
                        <span style={{ display: "inline-block", transition: "transform 0.2s", transform: isHovered ? "translateX(3px)" : "none" }}>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Newsletter — with photo background and gradient */}
          <div style={{ textAlign: "center", padding: "40px 0", borderTop: `1px solid ${c.borderSub}`, position: "relative" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}05, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent, marginBottom: 8 }}>Newsletter</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em", marginBottom: 6 }}>Stay Ahead of the Curve</div>
            <div style={{ fontSize: 12, color: c.textDim, maxWidth: 420, margin: "0 auto 18px", lineHeight: 1.6 }}>Join 2,000+ finance leaders getting weekly insights on AI, FP&A strategy, and market intelligence.</div>
            {newsletterDone ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: c.green, fontWeight: 700, fontSize: 13, animation: "fosFadeSlideUp 0.3s ease" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${c.green}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={14} /></div>
                Subscribed! Check {newsletterEmail} for confirmation.
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, maxWidth: 420, margin: "0 auto" }}>
                <input className="fos-input-glow" type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="Enter your work email" style={{ flex: 1, padding: "11px 16px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.surface, color: c.text, fontSize: 12, fontFamily: "inherit", outline: "none", transition: "all 0.2s" }}
                  onFocus={e => { e.target.style.borderColor = `${c.accent}40`; e.target.style.boxShadow = `0 0 0 3px ${c.accent}10`; }}
                  onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }} />
                <button className="fos-cta-primary" onClick={handleNewsletter} style={{ padding: "11px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.accent}, ${c.purple || c.accent})`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 12px ${c.accent}25`, transition: "all 0.2s" }}>Subscribe</button>
              </div>
            )}
            <div style={{ fontSize: 9, color: c.textFaint, marginTop: 10 }}>No spam. Unsubscribe anytime. SOC 2 compliant data handling.</div>
          </div>
        </div>
      )}

      {/* ═══ LEAD PIPELINE TAB — Enhanced with animations ═══ */}
      {pipelineTab === "pipeline" && (
        <div style={{ animation: "fosFadeSlideUp 0.3s ease" }}>
          {/* Funnel Stats with animated progress bars */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Visitors", value: "2,840", icon: Eye, color: c.accent, pct: 100 },
              { label: "Leads", value: "342", icon: Users, color: c.purple, pct: 12 },
              { label: "MQLs", value: "137", icon: Sparkles, color: c.amber, pct: 4.8 },
              { label: "SQLs", value: "51", icon: Target, color: c.green, pct: 1.8 },
              { label: "Closed", value: "18", icon: Check, color: c.green, pct: 0.6 },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="intel-card" style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, padding: "20px 22px", textAlign: "center", position: "relative", overflow: "hidden", transition: "all 0.25s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}30`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 36px ${s.color}10`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle, ${s.color}08, transparent)`, pointerEvents: "none" }} />
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${s.color}12`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                    <Icon size={15} color={s.color} />
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}><AnimNum value={s.value} color={s.color} delay={i * 0.08} /></div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</div>
                  <div style={{ marginTop: 10, height: 3, background: c.bg2, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(s.pct, 100)}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 2, animation: `barGrow 0.8s ${i * 0.1}s ease forwards`, transformOrigin: "left", transform: "scaleX(0)" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conversion rate cards with top accent lines */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Visitor → Lead", value: "12.0%", color: c.accent },
              { label: "Lead → MQL", value: "40.1%", color: c.purple },
              { label: "MQL → SQL", value: "37.2%", color: c.amber },
              { label: "SQL → Close", value: "35.3%", color: c.green },
            ].map((m, i) => (
              <div key={m.label} className="intel-card" style={{ flex: 1, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "18px 16px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "14px 14px 0 0", background: `linear-gradient(90deg, ${m.color}40, ${m.color}10)` }} />
                <div style={{ fontSize: 22, fontWeight: 800 }}><AnimNum value={m.value} color={m.color} delay={i * 0.1 + 0.2} /></div>
                <div style={{ fontSize: 9, fontWeight: 600, color: c.textDim, marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Two-column: Lead scoring + Top downloads — Enhanced */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, padding: "24px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Lead Scoring Distribution</div>
                <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: c.textFaint }}>342 total</span>
              </div>
              {[
                { label: "Hot (80-100)", count: 51, color: c.red, pct: 15 },
                { label: "Warm (50-79)", count: 120, color: c.amber, pct: 35 },
                { label: "Cool (20-49)", count: 103, color: c.accent, pct: 30 },
                { label: "Cold (0-19)", count: 68, color: c.textDim, pct: 20 },
              ].map((s, i) => (
                <div key={s.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: s.color, boxShadow: `0 0 6px ${s.color}40` }} />
                      <span style={{ fontSize: 11, color: c.textSec }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: s.color }}>{s.count}</span>
                  </div>
                  <div style={{ height: 6, background: c.bg2, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)`, borderRadius: 3, animation: `barGrow 0.6s ${0.2 + i * 0.1}s ease forwards`, transformOrigin: "left", transform: "scaleX(0)" }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, padding: "24px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Top Content Downloads</div>
                <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: c.green }}>This quarter</span>
              </div>
              {[
                { title: "State of AI in FP&A 2026", downloads: 3420, type: "report" },
                { title: "Revenue Forecasting Templates", downloads: 2180, type: "template" },
                { title: "CFO Playbook for 2026", downloads: 1890, type: "report" },
                { title: "SaaS Benchmark Report", downloads: 1540, type: "report" },
                { title: "Board Reporting Suite", downloads: 1120, type: "template" },
                { title: "Consolidation Best Practices", downloads: 980, type: "guide" },
              ].map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 5 ? `1px solid ${c.borderSub}` : "none", transition: "all 0.15s", borderRadius: 6 }}
                  onMouseEnter={e => { e.currentTarget.style.paddingLeft = "8px"; e.currentTarget.style.background = `${c.accent}03`; }}
                  onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0"; e.currentTarget.style.background = "none"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: i < 3 ? c.accent : c.textFaint, fontFamily: "'JetBrains Mono', monospace", width: 20 }}>{i + 1}.</span>
                    <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: `${typeColor(d.type)}10`, color: typeColor(d.type), textTransform: "uppercase" }}>{d.type}</span>
                    <span style={{ fontSize: 11, color: c.textSec }}>{d.title}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: c.green }}>{d.downloads.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ ANALYST RECOGNITION TAB — Enhanced ═══ */}
      {pipelineTab === "analysts" && (
        <div style={{ animation: "fosFadeSlideUp 0.3s ease" }}>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginBottom: 16 }}>Industry Recognition</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
            {INTEL_ANALYST_QUOTES.map((a, i) => (
              <div key={a.firm} className="intel-card" style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, padding: "26px 24px", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}25`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${c.accent}08`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ position: "absolute", top: 12, right: 16, fontSize: 48, fontWeight: 900, color: `${c.accent}06`, lineHeight: 1, fontFamily: "Georgia, serif", pointerEvents: "none" }}>"</div>
                <div style={{ fontSize: 13, color: c.textSec, lineHeight: 1.7, fontStyle: "italic", marginBottom: 18, position: "relative" }}>"{a.quote}"</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: `1px solid ${c.borderSub}` }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, ${c.accent}15, ${c.purple}08)`, border: `1px solid ${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: c.accent }}>{a.initial}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{a.firm}</div>
                    <div style={{ fontSize: 9, color: c.textFaint }}>{a.source}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar with animated numbers */}
          <div style={{ display: "flex", justifyContent: "center", gap: 52, padding: "32px 0", borderTop: `1px solid ${c.borderSub}`, borderBottom: `1px solid ${c.borderSub}`, marginBottom: 28, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, ${c.accent}03, transparent)`, pointerEvents: "none" }} />
            {[
              { value: "47", label: "Published Reports", color: c.accent },
              { value: "12K+", label: "Downloads This Quarter", color: c.purple },
              { value: "2,000+", label: "Finance Teams", color: c.green },
              { value: "Weekly", label: "Content Cadence", color: c.amber },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: "center", position: "relative" }}>
                <div style={{ fontSize: 30 }}><AnimNum value={s.value} color={s.color} delay={i * 0.12} /></div>
                <div style={{ fontSize: 9, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Enterprise trust logos with hover */}
          <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, padding: "28px 30px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: c.text, marginBottom: 4 }}>Trusted by Enterprise Finance Teams</div>
            <div style={{ fontSize: 10, color: c.textDim, marginBottom: 18 }}>FinanceOS powers treasury and FP&A for leading organizations worldwide</div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              {[
                { name: "Coca-Cola", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/200px-Coca-Cola_logo.svg.png", h: 18 },
                { name: "Best Buy", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Best_Buy_Logo.svg/200px-Best_Buy_Logo.svg.png", h: 24 },
                { name: "Target", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/120px-Target_logo.svg.png", h: 26 },
                { name: "JPMorgan Chase", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/J.P._Morgan_Logo_2008_1.svg/200px-J.P._Morgan_Logo_2008_1.svg.png", h: 16 },
                { name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deloitte.svg/200px-Deloitte.svg.png", h: 16 },
                { name: "Ernst & Young", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/EY_logo_2019.svg/120px-EY_logo_2019.svg.png", h: 24 },
                { name: "Saks Fifth Avenue", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Saks_Fifth_Avenue_Logo.svg/200px-Saks_Fifth_Avenue_Logo.svg.png", h: 12 },
                { name: "Ohio State", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Ohio_State_University_seal.svg/120px-Ohio_State_University_seal.svg.png", h: 28 },
              ].map(brand => (
                <div key={brand.name} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.surfaceAlt, transition: "all 0.2s", cursor: "default", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}25`; e.currentTarget.style.background = `${c.accent}05`; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.transform = "none"; }}
                >
                  <img src={brand.logo} alt={brand.name} style={{ height: brand.h, maxWidth: 90, objectFit: "contain", opacity: 0.7, filter: "grayscale(0.3)" }} loading="lazy"
                    onError={e => { e.target.style.display = "none"; e.target.parentElement.innerHTML += `<span style="font-size:11px;font-weight:600;color:${c.textSec}">${brand.name}</span>`; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ VIDEO & MEDIA TAB — Full pipeline with stock photography ═══ */}
      {pipelineTab === "media" && (
        <div style={{ animation: "fosFadeSlideUp 0.3s ease" }}>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginBottom: 16 }}>Video Library & Webinars</div>

          {/* Featured Video — Full-width hero with speaker photo */}
          {(() => { const fv = INTEL_VIDEOS.find(v => v.featured); return fv ? (
            <div style={{ borderRadius: 20, marginBottom: 28, position: "relative", overflow: "hidden", border: `1px solid ${c.accent}10`, boxShadow: `0 16px 64px rgba(0,0,0,0.3)` }}>
              <div style={{ position: "absolute", inset: 0 }}>
                <img src={fv.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              </div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(12,18,32,0.92) 0%, rgba(20,30,51,0.85) 50%, rgba(15,24,41,0.88) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: "20px 20px", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1, padding: "40px 44px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 36, alignItems: "center" }}>
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 6, background: `${c.red}20`, border: `1px solid ${c.red}25`, color: c.red, fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", marginBottom: 14 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.red, animation: "liveDot 1.5s infinite" }} />
                    LATEST WEBINAR
                  </span>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#eef0f6", letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1.2 }}>{fv.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 16 }}>{fv.desc}</div>
                  {/* Speaker pill */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, width: "fit-content" }}>
                    <img src={fv.speakers[0].img} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.15)" }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#eef0f6" }}>{fv.speakers[0].name}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{fv.speakers[0].role}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <button onClick={() => openGate({ id: fv.id, title: fv.title, type: "webinar" })} style={{ fontSize: 12, padding: "11px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.accent}, #4B8AE8)`, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, boxShadow: `0 4px 16px ${c.accent}30` }}>
                      <span style={{ fontSize: 14 }}>▶</span> Watch Recording
                    </button>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>{fv.duration} · {fv.views} views</span>
                  </div>
                </div>
                {/* Video thumbnail with play button */}
                <div onClick={() => openGate({ id: fv.id, title: fv.title, type: "webinar" })} style={{ position: "relative", borderRadius: 14, overflow: "hidden", aspectRatio: "16/9", cursor: "pointer" }}>
                  <img src={fv.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", animation: "videoPlay 2s ease-in-out infinite" }}>
                      <span style={{ fontSize: 20, color: "#fff", marginLeft: 3 }}>▶</span>
                    </div>
                  </div>
                  <span style={{ position: "absolute", bottom: 10, right: 10, padding: "3px 8px", borderRadius: 4, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{fv.duration}</span>
                </div>
              </div>
            </div>
          ) : null; })()}

          {/* Video Grid — with stock photography + speaker photos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {INTEL_VIDEOS.filter(v => !v.featured).map((v, i) => (
              <div key={v.id} className="intel-card" onClick={() => openGate({ id: v.id, title: v.title, type: "webinar" })} style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${v.color}30`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 36px ${v.color}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                {/* Video thumbnail with real photo */}
                <div className="intel-img-wrap" style={{ aspectRatio: "16/9", position: "relative", overflow: "hidden" }}>
                  <img src={v.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 14, color: "#fff", marginLeft: 2 }}>▶</span>
                    </div>
                  </div>
                  <span style={{ position: "absolute", bottom: 8, right: 8, padding: "2px 7px", borderRadius: 4, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{v.duration}</span>
                  <span style={{ position: "absolute", top: 8, left: 8, padding: "3px 8px", borderRadius: 5, background: `${v.color}25`, backdropFilter: "blur(4px)", color: "#fff", fontSize: 8, fontWeight: 800, letterSpacing: "0.04em" }}>{v.topic}</span>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: c.text, lineHeight: 1.3, marginBottom: 8 }}>{v.title}</div>
                  {/* Speaker row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <img src={v.speakers[0].img} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", border: `1px solid ${c.border}` }} />
                    <span style={{ fontSize: 10, color: c.textDim }}>{v.speakers[0].name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 9, color: c.textFaint }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{v.views} views</span>
                    <span>·</span>
                    <span style={{ color: c.accent, fontWeight: 600 }}>Register to watch</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Live Events — with event photos */}
          <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, padding: "24px 26px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>Upcoming Live Events</div>
              <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 6, background: `${c.green}12`, color: c.green, fontWeight: 700 }}>3 upcoming</span>
            </div>
            {INTEL_EVENTS.map((ev, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: i < 2 ? `1px solid ${c.borderSub}` : "none" }}>
                {/* Event photo thumbnail */}
                <div style={{ width: 80, height: 52, borderRadius: 10, overflow: "hidden", flexShrink: 0, position: "relative" }}>
                  <img src={ev.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${ev.color}20, transparent)` }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 3 }}>{ev.title}</div>
                  <div style={{ fontSize: 10, color: c.textDim, display: "flex", gap: 8 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{ev.date}</span>
                    <span>{ev.time}</span>
                    <span>{ev.speakers} speakers</span>
                  </div>
                </div>
                <button onClick={() => openGate({ id: `event-${i}`, title: ev.title, type: "webinar" })} style={{ fontSize: 10, padding: "8px 16px", borderRadius: 8, border: `1px solid ${ev.color}25`, background: `${ev.color}08`, color: ev.color, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${ev.color}15`; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${ev.color}08`; e.currentTarget.style.transform = "none"; }}>Register</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ GATED DOWNLOAD MODAL — Enterprise-grade glassmorphism ═══ */}
      {modalOpen && (
        <div onClick={e => e.target === e.currentTarget && closeModal()} style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", animation: "fadeIn 0.2s ease" }}>
          <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 20, width: 460, maxWidth: "90vw", boxShadow: `${c.shadow3}, 0 0 80px rgba(0,0,0,0.3)`, overflow: "hidden", animation: "cmdIn 0.25s ease" }}>
            {/* Gradient header bar */}
            <div style={{ height: 4, background: `linear-gradient(90deg, ${c.accent}, ${c.purple}, ${c.green})`, backgroundSize: "200% 100%", animation: "gradientShift 3s ease infinite" }} />
            <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: c.text, letterSpacing: "-0.025em" }}>
                  {submitted ? "Check Your Email" : modalResource ? `Download: ${modalResource.title.split(":")[0]}` : "Subscribe"}
                </div>
                {!submitted && <div style={{ fontSize: 11, color: c.textDim, marginTop: 4, lineHeight: 1.5 }}>{modalResource?.desc || "Get weekly insights and exclusive content."}</div>}
              </div>
              <button onClick={closeModal} style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 8, cursor: "pointer", color: c.textDim, padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.red; e.currentTarget.style.color = c.red; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textDim; }}>
                <X size={14} />
              </button>
            </div>
            <div style={{ padding: "18px 28px 28px" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "24px 0", animation: "fosFadeSlideUp 0.3s ease" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${c.green}12`, border: `1px solid ${c.green}20`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "pieScale 0.4s cubic-bezier(0.22,1,0.36,1)" }}><Check size={22} color={c.green} /></div>
                  <div style={{ fontSize: 12, color: c.textDim, lineHeight: 1.65 }}>Download link sent to <strong style={{ color: c.text }}>{leadForm.email}</strong>. Check spam folder too.</div>
                  <button onClick={closeModal} style={{ marginTop: 18, fontSize: 12, padding: "11px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.accent}, ${c.purple || c.accent})`, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 12px ${c.accent}25` }}>Close</button>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint, marginBottom: 5 }}>Work Email *</label>
                    <input type="email" value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} placeholder="you@company.com" style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bg2, color: c.text, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }}
                      onFocus={e => { e.target.style.borderColor = `${c.accent}40`; e.target.style.boxShadow = `0 0 0 3px ${c.accent}08`; }}
                      onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint, marginBottom: 5 }}>First Name *</label>
                      <input type="text" value={leadForm.first} onChange={e => setLeadForm({ ...leadForm, first: e.target.value })} placeholder="Jane" style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bg2, color: c.text, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }}
                        onFocus={e => { e.target.style.borderColor = `${c.accent}40`; e.target.style.boxShadow = `0 0 0 3px ${c.accent}08`; }}
                        onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint, marginBottom: 5 }}>Last Name</label>
                      <input type="text" value={leadForm.last} onChange={e => setLeadForm({ ...leadForm, last: e.target.value })} placeholder="Smith" style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bg2, color: c.text, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }}
                        onFocus={e => { e.target.style.borderColor = `${c.accent}40`; e.target.style.boxShadow = `0 0 0 3px ${c.accent}08`; }}
                        onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint, marginBottom: 5 }}>Company</label>
                    <input type="text" value={leadForm.company} onChange={e => setLeadForm({ ...leadForm, company: e.target.value })} placeholder="Acme Corp" style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bg2, color: c.text, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }}
                      onFocus={e => { e.target.style.borderColor = `${c.accent}40`; e.target.style.boxShadow = `0 0 0 3px ${c.accent}08`; }}
                      onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint, marginBottom: 5 }}>Role</label>
                      <select value={leadForm.role} onChange={e => setLeadForm({ ...leadForm, role: e.target.value })} style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bg2, color: c.text, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box", appearance: "none" }}>
                        <option value="">Select...</option>
                        <option>CFO / VP Finance</option>
                        <option>Controller</option>
                        <option>FP&A Director</option>
                        <option>Treasurer</option>
                        <option>Financial Analyst</option>
                        <option>CEO / COO</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textFaint, marginBottom: 5 }}>Company Size</label>
                      <select value={leadForm.size} onChange={e => setLeadForm({ ...leadForm, size: e.target.value })} style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bg2, color: c.text, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box", appearance: "none" }}>
                        <option value="">Select...</option>
                        <option>1-50</option>
                        <option>51-200</option>
                        <option>201-1,000</option>
                        <option>1,001-5,000</option>
                        <option>5,001+</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleLeadSubmit} style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${c.accent}, ${c.purple || c.accent})`, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 4px 16px ${c.accent}25`, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${c.accent}35`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 16px ${c.accent}25`; }}>
                    ↓ {modalResource?.type === "webinar" ? "Register Now" : "Download Now"}
                  </button>
                  <div style={{ fontSize: 9, color: c.textFaint, textAlign: "center", marginTop: 10 }}>By downloading, you agree to receive relevant content from FinanceOS. Unsubscribe anytime.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ENV 11: CUSTOMER SIGN-IN / SIGN-OUT / ACCOUNT DELETION
// ══════════════════════════════════════════════════════════════
const SettingsView = ({ c, onLogout, toast, mode, onShowSuitePanel, suitePanelOpen, user }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [activeTab, setActiveTab] = useState("org");
  const [sessionExpanded, setSessionExpanded] = useState(false);
  const [region, setRegion] = useState(() => { try { return localStorage.getItem("fos_region") || "US"; } catch { return "US"; } });
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("fos_lang") || "en"; } catch { return "en"; } });
  const [currency, setCurrency] = useState(() => { try { return localStorage.getItem("fos_currency") || "USD"; } catch { return "USD"; } });
  const [dateFormat, setDateFormat] = useState(() => { try { return localStorage.getItem("fos_dateformat") || "MM/DD/YYYY"; } catch { return "MM/DD/YYYY"; } });
  const saveRegional = (key, val, setter) => { setter(val); try { localStorage.setItem(key, val); } catch {} toast("Preference updated", "success"); };
  const tabs = [
    { id: "org", label: "Organization", icon: LayoutDashboard },
    { id: "billing", label: "Billing", icon: DollarSign },
    { id: "security", label: "Security", icon: Shield },
    { id: "regional", label: "Regional", icon: Globe },
    { id: "session", label: "Session", icon: Activity },
  ];
  return (
    <div style={{ padding: 32, maxWidth: 860 }}>
      {/* View Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.accent}15, ${c.purple}08)`, border: `1px solid ${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <Settings size={17} color={c.accent} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: c.text, letterSpacing: "-0.03em" }}>Settings</div>
          <div style={{ fontSize: 12, color: c.textDim, marginTop: 2 }}>Manage your workspace, billing, security, and preferences</div>
        </div>
      </div>
      {/* Tab nav + Content */}
      <div style={{ display: "flex", gap: 24 }}>
        {/* Tab nav */}
        <div style={{ width: 170, flexShrink: 0, display: "flex", flexDirection: "column", gap: 2, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, padding: 8 }}>
          {tabs.map(t => {
            const active = activeTab === t.id;
            return (
            <div key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8,
              fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer",
              color: active ? c.accent : c.textDim,
              background: active ? `${c.accent}08` : "transparent",
              borderLeft: active ? `2px solid ${c.accent}` : "2px solid transparent",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.color = c.textSec; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.textDim; } }}
            >
              <t.icon size={14} strokeWidth={active ? 2.5 : 1.5} />
              {t.label}
            </div>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

      {activeTab === "org" && (<>
        {/* Company Info Card */}
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center" }}><LayoutDashboard size={13} color={c.accent} /></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Workspace</div>
          </div>
          {[
            { label: "Company", value: user?.orgName || "My Organization", icon: "◈" },
            { label: "Plan", value: user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : "Demo", color: user?.plan === "enterprise" ? c.purple : user?.plan === "business" ? c.green : c.accent },
            { label: "Seats", value: "12 of 25 used" },
            { label: "Fiscal Year End", value: "December 31" },
          ].map(f => (
            <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${c.borderSub}`, fontSize: 12 }}>
              <span style={{ color: c.textDim }}>{f.label}</span>
              <span style={{ color: f.color || c.text, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                {f.color && <span style={{ width: 7, height: 7, borderRadius: "50%", background: f.color, boxShadow: `0 0 6px ${f.color}40` }} />}
                {f.value}
              </span>
            </div>
          ))}
        </div>

        {/* Infrastructure Card */}
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${c.green}10`, display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={13} color={c.green} /></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Infrastructure</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 4 }}>
            {[
              { label: "Data Region", value: "US-East", sub: "Virginia", color: c.green },
              { label: "Currency", value: "USD", sub: "US Dollar", color: c.accent },
              { label: "SSO", value: "Off", sub: "Not configured", color: c.textFaint },
            ].map(s => (
              <div key={s.label} style={{ padding: "14px 16px", borderRadius: 10, background: c.surfaceAlt, border: `1px solid ${c.borderSub}` }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: c.text, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Display Preferences Card */}
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${c.purple}10`, display: "flex", alignItems: "center", justifyContent: "center" }}><Eye size={13} color={c.purple} /></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Display</div>
          </div>
          {[
            { label: "Right panel", desc: "Resources, social, and suite products", key: "suite", on: suitePanelOpen, action: () => { if (suitePanelOpen) { toast("Panel is currently visible", "info"); } else { onShowSuitePanel(); toast("Panel restored", "success"); } } },
            { label: "Dark mode", desc: `Currently ${mode === "dark" ? "dark" : "light"} theme`, key: "theme", on: mode === "dark" },
          ].map(p => (
            <div key={p.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}` }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: c.text }}>{p.label}</div>
                <div style={{ fontSize: 10, color: c.textFaint }}>{p.desc}</div>
              </div>
              <div onClick={p.action} style={{
                width: 36, height: 20, borderRadius: 10, position: "relative", cursor: p.action ? "pointer" : "default",
                background: p.on ? c.accent : c.surfaceAlt, border: `1px solid ${p.on ? c.accent : c.borderSub}`,
                transition: "all 0.15s ease",
              }}>
                <div style={{
                  position: "absolute", top: 2, width: 14, height: 14, borderRadius: "50%",
                  left: p.on ? 18 : 2, background: p.on ? "#fff" : c.textFaint,
                  transition: "all 0.15s ease",
                }} />
              </div>
            </div>
          ))}
        </div>
      </>)}

      {/* Regional tab — expanded locales */}
      {activeTab === "regional" && (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${c.cyan}10`, display: "flex", alignItems: "center", justifyContent: "center" }}><Globe size={13} color={c.cyan} /></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Regional & Currency</div>
          </div>
          <div style={{ fontSize: 11, color: c.textDim, marginBottom: 16, paddingLeft: 34 }}>Controls how numbers, dates, and currencies display across all reports and exports.</div>
          {[
            { label: "Region", key: "fos_region", value: region, setter: setRegion, options: [
              { v: "US", l: "United States" }, { v: "GB", l: "United Kingdom" }, { v: "CA", l: "Canada" }, { v: "AU", l: "Australia" },
              { v: "DE", l: "Germany" }, { v: "FR", l: "France" }, { v: "JP", l: "Japan" }, { v: "SG", l: "Singapore" },
              { v: "HK", l: "Hong Kong SAR" }, { v: "IT", l: "Italy" }, { v: "BR", l: "Brazil" }, { v: "IN", l: "India" },
              { v: "NL", l: "Netherlands" }, { v: "SE", l: "Sweden" }, { v: "CH", l: "Switzerland" }, { v: "AE", l: "United Arab Emirates" },
              { v: "MX", l: "Mexico" }, { v: "KR", l: "South Korea" }, { v: "ES", l: "Spain" }, { v: "IE", l: "Ireland" },
              { v: "IL", l: "Israel" }, { v: "PL", l: "Poland" }, { v: "NO", l: "Norway" }, { v: "DK", l: "Denmark" },
              { v: "FI", l: "Finland" }, { v: "NZ", l: "New Zealand" }, { v: "ZA", l: "South Africa" }, { v: "PH", l: "Philippines" },
            ]},
            { label: "Language", key: "fos_lang", value: lang, setter: setLang, options: [
              { v: "en", l: "English" }, { v: "en-GB", l: "English (UK)" }, { v: "es", l: "Espanol" },
              { v: "es-MX", l: "Espanol (Mexico)" }, { v: "fr", l: "Francais" }, { v: "de", l: "Deutsch" },
              { v: "it", l: "Italiano" }, { v: "pt", l: "Portugues" }, { v: "pt-BR", l: "Portugues (Brasil)" },
              { v: "ja", l: "Japanese" }, { v: "zh", l: "Chinese (Simplified)" }, { v: "zh-TW", l: "Chinese (Traditional)" },
              { v: "ko", l: "Korean" }, { v: "nl", l: "Nederlands" }, { v: "sv", l: "Svenska" },
              { v: "da", l: "Dansk" }, { v: "nb", l: "Norsk" }, { v: "fi", l: "Suomi" },
              { v: "pl", l: "Polski" }, { v: "he", l: "Hebrew" }, { v: "ar", l: "Arabic" },
              { v: "hi", l: "Hindi" }, { v: "th", l: "Thai" }, { v: "vi", l: "Vietnamese" },
            ]},
            { label: "Currency", key: "fos_currency", value: currency, setter: setCurrency, options: [
              { v: "USD", l: "$ USD" }, { v: "EUR", l: "EUR" }, { v: "GBP", l: "GBP" },
              { v: "CAD", l: "$ CAD" }, { v: "AUD", l: "$ AUD" }, { v: "JPY", l: "JPY" },
              { v: "CHF", l: "CHF" }, { v: "SGD", l: "$ SGD" }, { v: "HKD", l: "$ HKD" },
              { v: "INR", l: "INR" }, { v: "BRL", l: "R$ BRL" }, { v: "SEK", l: "kr SEK" },
              { v: "MXN", l: "$ MXN" }, { v: "KRW", l: "KRW" }, { v: "CNY", l: "CNY" },
              { v: "NZD", l: "$ NZD" }, { v: "ZAR", l: "R ZAR" }, { v: "NOK", l: "kr NOK" },
              { v: "DKK", l: "kr DKK" }, { v: "PLN", l: "zl PLN" }, { v: "ILS", l: "ILS" },
              { v: "THB", l: "THB" }, { v: "PHP", l: "PHP" }, { v: "TWD", l: "NT$ TWD" },
            ]},
            { label: "Date Format", key: "fos_dateformat", value: dateFormat, setter: setDateFormat, options: [
              { v: "MM/DD/YYYY", l: "MM/DD/YYYY" }, { v: "DD/MM/YYYY", l: "DD/MM/YYYY" },
              { v: "YYYY-MM-DD", l: "YYYY-MM-DD (ISO)" }, { v: "DD.MM.YYYY", l: "DD.MM.YYYY" },
              { v: "YYYY/MM/DD", l: "YYYY/MM/DD" },
            ]},
            { label: "Number Format", key: "fos_numformat", value: (() => { try { return localStorage.getItem("fos_numformat") || "1,234.56"; } catch { return "1,234.56"; } })(), setter: (v) => { try { localStorage.setItem("fos_numformat", v); } catch {} }, options: [
              { v: "1,234.56", l: "1,234.56 (US/UK)" }, { v: "1.234,56", l: "1.234,56 (EU)" },
              { v: "1 234,56", l: "1 234,56 (FR/SE)" }, { v: "1'234.56", l: "1'234.56 (CH)" },
            ]},
            { label: "Timezone", key: "fos_timezone", value: (() => { try { return localStorage.getItem("fos_timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "America/New_York"; } })(), setter: (v) => { try { localStorage.setItem("fos_timezone", v); } catch {} }, options: [
              { v: "America/New_York", l: "Eastern (ET)" }, { v: "America/Chicago", l: "Central (CT)" },
              { v: "America/Denver", l: "Mountain (MT)" }, { v: "America/Los_Angeles", l: "Pacific (PT)" },
              { v: "Europe/London", l: "London (GMT/BST)" }, { v: "Europe/Paris", l: "Central Europe (CET)" },
              { v: "Europe/Berlin", l: "Berlin (CET)" }, { v: "Asia/Tokyo", l: "Tokyo (JST)" },
              { v: "Asia/Shanghai", l: "Shanghai (CST)" }, { v: "Asia/Singapore", l: "Singapore (SGT)" },
              { v: "Asia/Kolkata", l: "India (IST)" }, { v: "Australia/Sydney", l: "Sydney (AEST)" },
              { v: "America/Sao_Paulo", l: "Sao Paulo (BRT)" }, { v: "UTC", l: "UTC" },
            ]},
          ].map(f => (
            <div key={f.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${c.borderSub}` }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: c.text }}>{f.label}</div>
              <select value={f.value} onChange={e => { if (f.key.startsWith("fos_")) saveRegional(f.key, e.target.value, f.setter); else { f.setter(e.target.value); toast("Preference updated", "success"); } }} style={{
                fontSize: 12, padding: "6px 28px 6px 10px", borderRadius: 6, border: `1px solid ${c.border}`,
                background: c.surfaceAlt, color: c.text, fontFamily: "inherit", fontWeight: 600, cursor: "pointer",
                appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b7280'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", minWidth: 160,
              }}>
                {f.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}
          <div style={{ fontSize: 9, color: c.textFaint, marginTop: 10 }}>Changes apply to dashboard, reports, and exports. Multi-entity consolidation uses entity-level currency settings.</div>
        </div>
      )}

      {activeTab === "billing" && (
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center" }}><DollarSign size={13} color={c.accent} /></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Billing & Subscription</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={{ padding: "18px 18px", borderRadius: 12, background: `linear-gradient(135deg, ${c.accent}08, ${c.purple}04)`, border: `1px solid ${c.accent}15` }}>
              <div style={{ fontSize: 9, color: c.accent, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Current Plan</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.text }}>{user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : "Demo"}</div>
              <div style={{ fontSize: 11, color: c.textDim, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{user?.plan === "enterprise" ? "Custom pricing" : user?.plan === "business" ? "$3,999/mo" : user?.plan === "growth" ? "$1,499/mo" : user?.plan === "starter" ? "$499/mo" : "Free"}</div>
            </div>
            <div style={{ padding: "18px 18px", borderRadius: 12, background: `linear-gradient(135deg, ${c.green}08, ${c.cyan}04)`, border: `1px solid ${c.green}15` }}>
              <div style={{ fontSize: 9, color: c.green, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Status</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.green }}>Active</div>
              <div style={{ fontSize: 11, color: c.textDim, marginTop: 4 }}>{user?.orgName || "My Organization"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "Manage Subscription", primary: true, desc: "Upgrade, downgrade, or cancel" },
              { label: "View Invoices", primary: false, desc: "Download past receipts" },
              { label: "Update Payment", primary: false, desc: "Change card on file" },
            ].map(b => (
              <button key={b.label} style={{ flex: 1, fontSize: 11, padding: "14px 16px", borderRadius: 10, border: `1px solid ${b.primary ? c.accent : c.border}`, background: b.primary ? `${c.accent}08` : c.surfaceAlt, color: b.primary ? c.accent : c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s", textAlign: "left" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.accent; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 12px ${c.accent}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = b.primary ? c.accent : c.border; e.currentTarget.style.color = b.primary ? c.accent : c.textSec; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                onClick={async () => {
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session?.access_token) { toast("Please sign in to manage billing", "warning"); return; }
                    toast(`Opening ${b.label}...`, "info");
                    const res = await fetch(`${SUPABASE_URL}/functions/v1/manage-subscription`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}`, "apikey": SUPABASE_KEY },
                    });
                    const data = await res.json();
                    if (data.url) { window.location.href = data.url; }
                    else if (res.status === 404) { toast("No active subscription yet — choose a plan to get started", "info"); onNav("settings"); }
                    else { toast(data.error || "Could not open billing portal", "error"); }
                  } catch { toast("Billing portal unavailable — contact support@finance-os.app", "error"); }
                }}
              ><div style={{ fontWeight: 700, marginBottom: 2 }}>{b.label}</div><div style={{ fontSize: 10, opacity: 0.7, fontWeight: 400 }}>{b.desc}</div></button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "security" && (<>
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${c.green}10`, display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={13} color={c.green} /></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Security & Access</div>
          </div>
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
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${c.amber}10`, display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={13} color={c.amber} /></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Change Password</div>
          </div>
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
        {/* Active Session — with real device detection */}
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: `${c.green}10`, display: "flex", alignItems: "center", justifyContent: "center" }}><Activity size={13} color={c.green} /></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Active Session</div>
                <div style={{ fontSize: 10, color: c.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.green, boxShadow: `0 0 8px ${c.green}60`, animation: "pulse 2s infinite" }} />
                  Connected
                </div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: c.textFaint, fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>
              <div>Session started</div>
              <div style={{ color: c.textDim, fontWeight: 600 }}>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
            </div>
          </div>

          {/* User identity row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 10, background: `linear-gradient(135deg, ${c.accent}06, ${c.purple}03)`, border: `1px solid ${c.accent}12`, marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
              {(user?.orgName || "M").charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{user?.orgName || "My Organization"}</div>
              <div style={{ fontSize: 11, color: c.textDim }}>{user?.email || "—"} · <span style={{ color: c.accent, fontWeight: 600 }}>{user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : "Demo"}</span></div>
            </div>
            <div style={{ padding: "4px 10px", borderRadius: 6, background: `${c.green}12`, border: `1px solid ${c.green}20`, fontSize: 10, fontWeight: 700, color: c.green }}>Owner</div>
          </div>

          {/* Device info grid — real data */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {(() => {
              const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
              const isMac = ua.includes("Macintosh"); const isWin = ua.includes("Windows"); const isLinux = ua.includes("Linux"); const isiPhone = ua.includes("iPhone"); const isAndroid = ua.includes("Android"); const isiPad = ua.includes("iPad");
              const device = isiPhone ? "iPhone" : isiPad ? "iPad" : isAndroid ? "Android" : isMac ? "Mac" : isWin ? "Windows PC" : isLinux ? "Linux" : "Unknown";
              const isChrome = ua.includes("Chrome") && !ua.includes("Edg"); const isSafari = ua.includes("Safari") && !ua.includes("Chrome"); const isFirefox = ua.includes("Firefox"); const isEdge = ua.includes("Edg");
              const browser = isEdge ? "Edge" : isChrome ? "Chrome" : isSafari ? "Safari" : isFirefox ? "Firefox" : "Browser";
              const browserVer = isEdge ? (ua.match(/Edg\/([\d]+)/)?.[1] || "") : isChrome ? (ua.match(/Chrome\/([\d]+)/)?.[1] || "") : isSafari ? (ua.match(/Version\/([\d.]+)/)?.[1]?.split(".")[0] || "") : isFirefox ? (ua.match(/Firefox\/([\d]+)/)?.[1] || "") : "";
              const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
              const locale = typeof navigator !== "undefined" ? (navigator.language || "en-US") : "en-US";
              const screenRes = typeof window !== "undefined" ? `${window.screen?.width || "?"}×${window.screen?.height || "?"}` : "—";
              return [
                { label: "Device", value: device, icon: isiPhone || isiPad || isAndroid ? "▪" : "▦", color: c.accent },
                { label: "Browser", value: `${browser} ${browserVer}`, icon: isSafari ? "◆" : isFirefox ? "◇" : "◎", color: c.purple },
                { label: "Timezone", value: tz.split("/").pop()?.replace(/_/g, " ") || tz, icon: "▫", color: c.cyan },
                { label: "Screen", value: screenRes, icon: "▦", color: c.green },
              ];
            })().map(d => (
              <div key={d.label} style={{ padding: "12px 12px", borderRadius: 10, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${d.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 11 }}>{d.icon}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: c.textFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{d.value}</div>
              </div>
            ))}
          </div>

          {/* Session stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Locale", value: typeof navigator !== "undefined" ? navigator.language : "en-US", color: c.accent },
              { label: "Color Scheme", value: mode === "dark" ? "Dark" : "Light", color: c.purple },
              { label: "Online", value: typeof navigator !== "undefined" && navigator.onLine ? "Connected" : "Offline", color: typeof navigator !== "undefined" && navigator.onLine ? c.green : c.red },
            ].map(s => (
              <div key={s.label} style={{ padding: "10px 12px", borderRadius: 8, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: c.textDim }}>{s.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Sign out button */}
          <button onClick={onLogout} style={{ fontSize: 12, padding: "11px 22px", borderRadius: 10, border: `1px solid ${c.amber}30`, background: `${c.amber}06`, color: c.amber, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = `${c.amber}12`; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${c.amber}06`; e.currentTarget.style.transform = "none"; }}>
            <LogOut size={14} /> Sign Out of This Device
          </button>
        </div>
        {/* Data Privacy & Rights — GDPR/CCPA */}
        <div style={{ background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${c.purple}10`, display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={13} color={c.purple} /></div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Data Privacy & Rights</div>
          </div>
          <div style={{ fontSize: 11, color: c.textDim, lineHeight: 1.7, marginBottom: 16, paddingLeft: 34 }}>Full control over your data under GDPR and CCPA.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <button onClick={async () => {
              toast("Preparing your data export...", "info");
              try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) { toast("Please sign in to export data", "warning"); return; }
                const res = await fetch(`${SUPABASE_URL}/functions/v1/data-rights`, {
                  method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}`, "apikey": SUPABASE_KEY },
                  body: JSON.stringify({ action: "export" }),
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.success) {
                    const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url; a.download = `financeos-data-export-${new Date().toISOString().split("T")[0]}.json`; a.click();
                    URL.revokeObjectURL(url);
                    toast("Data export downloaded successfully", "success");
                  } else { toast(data.error || "Export failed", "warning"); }
                } else {
                  const err = await res.json().catch(() => ({}));
                  toast(err.error || "Export failed — try again", "warning");
                }
              } catch { toast("Export failed", "warning"); }
            }} style={{ fontSize: 11, padding: "14px 16px", borderRadius: 10, border: `1px solid ${c.accent}30`, background: `${c.accent}06`, color: c.accent, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${c.accent}12`; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${c.accent}06`; e.currentTarget.style.transform = "none"; }}>
              <Globe size={13} /> Export My Data
            </button>
            <button onClick={() => window.location.href = "/privacy"} style={{ fontSize: 11, padding: "14px 16px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = c.accent; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; e.currentTarget.style.transform = "none"; }}>
              <Eye size={13} /> View Privacy Policy
            </button>
          </div>
          <div style={{ fontSize: 10, color: c.textFaint, lineHeight: 1.8, padding: "12px 16px", background: c.surfaceAlt, borderRadius: 10, border: `1px solid ${c.borderSub}` }}>
            <div style={{ fontWeight: 700, color: c.textDim, marginBottom: 6, fontSize: 11 }}>Your rights</div>
            {["Access — Download all data we hold about you in JSON format", "Portability — Machine-readable export (GDPR Article 20)", "Deletion — Request complete erasure (GDPR Article 17 / CCPA §1798.105)", "Rectification — Correct inaccurate data via Settings"].map(r => (
              <div key={r} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 3 }}><span style={{ color: c.green, fontSize: 10, marginTop: 1 }}>✓</span><span>{r}</span></div>
            ))}
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${c.borderSub}` }}>Contact <span style={{ color: c.accent, fontWeight: 600 }}>privacy@finance-os.app</span> for formal data subject requests.</div>
          </div>
        </div>

        {/* Delete Account — Danger Zone */}
        <div style={{ background: c.surface, border: `1px solid ${c.red}20`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${c.red}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⚠</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.red }}>Delete Account & Data</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: c.red, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Danger Zone</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: c.textDim, lineHeight: 1.7, marginBottom: 14, paddingLeft: 34 }}>Permanently delete your organization, all users, financial data, integrations, and AI conversation history. GDPR Article 17 compliant. Irreversible.</div>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)} style={{ fontSize: 11, padding: "9px 18px", borderRadius: 8, border: `1px solid ${c.red}40`, background: c.redDim, color: c.red, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Delete Account</button>
          ) : (
            <div>
              <div style={{ fontSize: 11, color: c.red, fontWeight: 600, marginBottom: 8 }}>Type "DELETE {(user?.orgName || "MY ORG").toUpperCase()}" to confirm:</div>
              <input value={deleteText} onChange={e => setDeleteText(e.target.value)} placeholder={`DELETE ${(user?.orgName || "MY ORG").toUpperCase()}`} style={{
                width: "100%", fontSize: 12, padding: "9px 14px", borderRadius: 8, border: `1px solid ${c.red}40`,
                background: c.bg2, color: c.text, fontFamily: "'JetBrains Mono', monospace", outline: "none", marginBottom: 10,
              }} />
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button disabled={deleteText !== `DELETE ${(user?.orgName || "MY ORG").toUpperCase()}`} onClick={async () => {
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.access_token) {
                      const res = await fetch(`${SUPABASE_URL}/functions/v1/data-rights`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}`, "apikey": SUPABASE_KEY },
                        body: JSON.stringify({ action: "delete", reason: "User requested account deletion via Settings" }),
                      });
                      if (!res.ok) { toast("Deletion failed — contact support@finance-os.app", "warning"); return; }
                    }
                    await supabase.auth.signOut();
                  } catch { toast("Deletion failed — contact support@finance-os.app", "warning"); }
                  setDeleteConfirm(false); setDeleteText(""); 
                  toast("Account and all data permanently deleted.", "warning");
                  if (typeof onLogout === "function") onLogout();
                }} style={{ fontSize: 11, padding: "9px 18px", borderRadius: 8, border: "none", background: deleteText === `DELETE ${(user?.orgName || "MY ORG").toUpperCase()}` ? c.red : c.textFaint, color: "#fff", cursor: deleteText === `DELETE ${(user?.orgName || "MY ORG").toUpperCase()}` ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700, opacity: deleteText === `DELETE ${(user?.orgName || "MY ORG").toUpperCase()}` ? 1 : 0.4 }}>Permanently Delete</button>
                <button onClick={() => { setDeleteConfirm(false); setDeleteText(""); }} style={{ fontSize: 11, padding: "9px 18px", borderRadius: 8, border: `1px solid ${c.border}`, background: "transparent", color: c.textSec, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </>)}
        </div>{/* close Content */}
      </div>{/* close sidebar flex row */}
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
      borderRadius: 12, padding: "20px 24px", boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
      backdropFilter: "blur(16px)", fontFamily: "'Manrope', system-ui, sans-serif",
      animation: "fosFadeSlideUp 0.4s ease",
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
  const [emailSent, setEmailSent] = useState(false);

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
    if (authMode === "signup" && password.trim().length < 8) { setError("Password must be at least 8 characters"); return; }
    if (authMode === "signup" && !name.trim()) { setError("Full name is required"); return; }
    setLoading("email");
    setError(null);
    try {
      if (authMode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(), password: password.trim(),
          options: { data: { full_name: name } },
        });
        if (err) { setError(err.message); setLoading(null); return; }
        // Also add to waitlist + smart notification
        try { await supabase.from("waitlist").upsert({ email: email.trim(), full_name: name, company, role, interest_type: "trial", source: "signup_modal", ...(() => { try { const u = getUtmData(); return Object.keys(u).length ? { metadata: JSON.stringify(u) } : {}; } catch { return {}; } })() }, { onConflict: "email" }); } catch {}
        fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "waitlist", email: email.trim(), full_name: name, company, role, interest_type: "trial", source: "signup_modal" }) }).catch(() => {});
        // Enroll in drip onboarding pipeline
        fetch("/api/drip", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "start", email: email.trim(), lead_data: { full_name: name, company, role, source: "signup_modal", interest_type: "trial" } }) }).catch(() => {});
        // If auto-confirmed, trigger login immediately
        if (data?.session) { onAuth({ method: "email" }); return; }
        // Email confirmation required — show interstitial
        setEmailSent(true);
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

  // Demo request — saves to waitlist + smart notification
  const handleDemo = async () => {
    setLoading("email");
    setError(null);
    try { await supabase.from("waitlist").upsert({ email: email.trim(), full_name: name, company, role, interest_type: "demo", source: "demo_modal", ...(() => { try { const u = getUtmData(); return Object.keys(u).length ? { metadata: JSON.stringify(u) } : {}; } catch { return {}; } })() }, { onConflict: "email" }); } catch {}
    fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "demo_request", email: email.trim(), full_name: name, company, role, source: "demo_modal" }) }).catch(() => {});
    // Enroll in drip onboarding pipeline
    fetch("/api/drip", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "start", email: email.trim(), lead_data: { full_name: name, company, role, source: "demo_modal", interest_type: "demo" } }) }).catch(() => {});
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
    border: "1px solid #1e2230", background: "#0b0c10", color: "#f0f2f5",
    fontFamily: "'Manrope', system-ui, sans-serif", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 420, maxHeight: "90vh", overflow: "auto", background: "rgba(16,19,26,0.7)", border: "1px solid #1e2230", borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", animation: "cmdIn 0.25s ease" }}>
        {/* Header */}
        <div style={{ padding: "28px 32px 0", textAlign: "center", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 28, height: 28, borderRadius: 8, border: "1px solid #1e2230", background: "transparent", color: "#8b92a5", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            <X size={14} />
          </button>
          <FosLogo size={36} />
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4, marginTop: 14 }}>
            {authMode === "login" ? "Welcome back" : authMode === "signup" ? "Get started" : "Request a demo"}
          </div>
          <div style={{ fontSize: 13, color: "#8b92a5", lineHeight: 1.5 }}>
            {authMode === "login" ? "Sign in to your FinanceOS workspace" : authMode === "signup" ? "Join the waitlist · Launching soon" : "Our team will prepare a personalized walkthrough"}
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
                  border: "1px solid #1e2230", background: "#0b0c10", color: "#f0f2f5", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                  cursor: loading ? "wait" : "pointer", transition: "all 0.15s", opacity: loading && loading !== p.key ? 0.4 : 1,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = "#3d4558"; e.currentTarget.style.background = "#111318"; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(26,31,46,0.7)"; e.currentTarget.style.background = "#0b0c10"; }}
                >{p.icon} {loading === p.key ? "..." : p.name}</button>
              ))}
            </div>
            {error && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 12, color: "#ef4444", marginBottom: 8, textAlign: "center" }}>{error}</div>}
            {resetSent && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", fontSize: 12, color: "#34d399", marginBottom: 8, textAlign: "center" }}>Password reset link sent to {email}</div>}
            {emailSent && (
              <div style={{ padding: "20px 16px", borderRadius: 12, background: "linear-gradient(135deg, rgba(96,165,250,0.06), rgba(167,139,250,0.03))", border: "1px solid rgba(96,165,250,0.15)", marginBottom: 12, textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 18 }}>▹</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f2f5", marginBottom: 4 }}>Check your email</div>
                <div style={{ fontSize: 12, color: "#8b92a5", lineHeight: 1.5, marginBottom: 10 }}>
                  We sent a confirmation link to <strong style={{ color: "#f0f2f5" }}>{email}</strong>. Click the link to activate your account.
                </div>
                <div style={{ fontSize: 10, color: "#3d4558" }}>Didn't receive it? Check spam, or <span style={{ color: "#60a5fa", cursor: "pointer" }} onClick={() => { setEmailSent(false); setAuthMode("signup"); }}>try again</span></div>
              </div>
            )}
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
                <input className="fos-input-glow" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#60a5fa"; }}
                  onBlur={e => { e.target.style.borderColor = "#1e2230"; }}
                />
                <input className="fos-input-glow" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#60a5fa"; }}
                  onBlur={e => { e.target.style.borderColor = "#1e2230"; }}
                />
              </div>
            )}
            <input className="fos-input-glow" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={authMode === "demo" ? "Work email" : "Email address"} style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "#60a5fa"; }}
              onBlur={e => { e.target.style.borderColor = "#1e2230"; }}
              onKeyDown={e => e.key === "Enter" && (authMode === "demo" ? handleDemo() : handleEmail())}
            />
            {authMode !== "demo" && (
              <div style={{ position: "relative" }}>
                <input className="fos-input-glow" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={authMode === "signup" ? "Create password (8+ chars)" : "Password"} style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = "#60a5fa"; }}
                  onBlur={e => { e.target.style.borderColor = "#1e2230"; }}
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
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
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
              Want to explore first? <span style={{ cursor: "pointer", color: "#60a5fa", fontWeight: 600 }} onClick={() => { setAuthMode("signup"); setError(null); }}>Get started</span>
            </>)}
          </div>

          {/* Trust signals */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16, paddingTop: 14, borderTop: "1px solid #1e2230" }}>
            {[{ icon: Shield, label: "SOC 2" }, { icon: Zap, label: "AES-256" }, { icon: Globe, label: "Custom SLA" }].map(t => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#3d4558", fontWeight: 600 }}>
                <t.icon size={10} color="#3d4558" /> {t.label}
              </div>
            ))}
          </div>
          {authMode === "signup" && (
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: "#3d4558", lineHeight: 1.6 }}>
              By creating an account you agree to our{" "}
              <span style={{ color: "#60a5fa", cursor: "pointer" }} onClick={() => window.open("https://finance-os.app/terms", "_blank")}>Terms of Service</span>{" "}and{" "}
              <span style={{ color: "#60a5fa", cursor: "pointer" }} onClick={() => window.open("https://finance-os.app/privacy", "_blank")}>Privacy Policy</span>
            </div>
          )}
          {/* Trust signals */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16, paddingTop: 14, borderTop: "1px solid #1e2230" }}>
            {[{ label: "SOC 2", Icon: Shield }, { label: "AES-256", Icon: Zap }, { label: "Custom SLA", Icon: Activity }].map(t => (
              <span key={t.label} style={{ fontSize: 9, color: "#3d4558", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                <t.Icon size={11} strokeWidth={2} /> {t.label}
              </span>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 9, color: "#3d4558" }}>30-day money-back guarantee · Cancel anytime</div>
        </div>
      </div>
    </div>
  );
};

// ── PLAN PICKER — shows Stripe checkout links after signup ───
const PRICING_PLANS = [
  { name: "Starter", monthly: 599, annual: 499, seats: 5, entities: 3,
    desc: "Core FP&A for growing teams",
    features: ["3 entities", "5 users", "P&L + Forecast", "5 connectors", "Email support"],
    usage: [
      { label: "AI Copilot queries", included: 100, overage: "$0.50/query" },
      { label: "Connector syncs", included: 500, overage: "$0.02/sync" },
      { label: "Report exports", included: 50, overage: "$0.25/export" },
      { label: "Scenario runs", included: 10, overage: "$1.00/run" },
    ] },
  { name: "Growth", monthly: 1799, annual: 1499, seats: 25, entities: 10, popular: true,
    desc: "Full-stack FP&A with AI + consolidation",
    features: ["10 entities", "25 users", "AI Copilot", "Consolidation", "Unlimited connectors", "Priority support"],
    usage: [
      { label: "AI Copilot queries", included: 1000, overage: "$0.30/query" },
      { label: "Connector syncs", included: 5000, overage: "$0.01/sync" },
      { label: "Report exports", included: 500, overage: "$0.15/export" },
      { label: "Scenario runs", included: 100, overage: "$0.75/run" },
      { label: "API calls", included: 5000, overage: "$0.01/call" },
    ] },
  { name: "Business", monthly: 4799, annual: 3999, seats: Infinity, entities: Infinity,
    desc: "Enterprise FP&A · unlimited scale",
    features: ["Unlimited entities", "Unlimited users", "Custom ML models", "SSO + RBAC", "Dedicated CSM", "SLA guarantee", "API access"],
    usage: [
      { label: "AI Copilot queries", included: 10000, overage: "$0.15/query" },
      { label: "Connector syncs", included: -1, overage: "Unlimited" },
      { label: "Report exports", included: -1, overage: "Unlimited" },
      { label: "Scenario runs", included: 1000, overage: "$0.50/run" },
      { label: "API calls", included: -1, overage: "Unlimited" },
    ] },
  { name: "Enterprise", monthly: null, annual: null, seats: Infinity, entities: Infinity, enterprise: true,
    desc: "Custom deployment · SOX compliance · Financing available",
    features: ["No seat or entity limits", "SOX-compliant audit trails", "On-premises or private cloud", "Custom integrations & API", "Dedicated success team + TAM", "Multi-year & volume pricing", "Financing options available", "Custom SLA (up to 99.99%)"],
    usage: [
      { label: "All meters", included: -1, overage: "Unlimited" },
      { label: "Committed spend discounts", included: -1, overage: "Custom" },
    ] },
];

// ── ONBOARDING WIZARD ────────────────────────────────────────
const OnboardingWizard = ({ c, userName, planStatus, onComplete }) => {
  const [step, setStep] = useState(0);
  const [org, setOrg] = useState({ name: "", industry: "", fy: "December", currency: "USD", erp: "" });
  const [connecting, setConnecting] = useState(null);
  const [connected, setConnected] = useState([]);
  const [setupProgress, setSetupProgress] = useState(0);

  const steps = [
    { title: "Set up your organization", sub: "Basic details to customize your workspace", icon: "org" },
    { title: "Connect your data", sub: "Link your ERP, billing, or banking systems", icon: "link" },
    { title: "You're all set", sub: "Your workspace is ready", icon: "done" },
  ];

  const connectors = [
    { id: "netsuite", name: "NetSuite", cat: "ERP", color: "#1B7B8A", icon: "N", desc: "Full GL, AR/AP, journals" },
    { id: "quickbooks", name: "QuickBooks", cat: "ERP", color: "#2CA01C", icon: "Q", desc: "P&L, balance sheet, invoices" },
    { id: "xero", name: "Xero", cat: "ERP", color: "#13B5EA", icon: "X", desc: "Multi-currency, bank feeds" },
    { id: "salesforce", name: "Salesforce", cat: "CRM", color: "#00A1E0", icon: "S", desc: "Pipeline, ARR, forecasts" },
    { id: "stripe", name: "Stripe", cat: "Billing", color: "#635BFF", icon: "$", desc: "MRR, churn, subscriptions" },
    { id: "plaid", name: "Plaid", cat: "Banking", color: "#000000", icon: "P", desc: "Bank accounts, transactions" },
    { id: "snowflake", name: "Snowflake", cat: "Data", color: "#29B5E8", icon: "S", desc: "Custom SQL, data warehouse" },
    { id: "csv", name: "CSV Upload", cat: "File", color: "#8b92a5", icon: "↑", desc: "Upload spreadsheets directly" },
  ];

  const handleConnect = (id) => {
    setConnecting(id);
    setTimeout(() => {
      setConnected(prev => [...prev, id]);
      setConnecting(null);
    }, 1800);
  };

  // Animated setup sequence on step 3
  useEffect(() => {
    if (step !== 2) return;
    const msgs = ["Creating workspace...", "Configuring chart of accounts...", "Loading sample data...", "Initializing AI Copilot...", "Ready!"];
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setSetupProgress(Math.min(i * 20, 100));
      if (i >= msgs.length) clearInterval(timer);
    }, 600);
    return () => clearInterval(timer);
  }, [step]);

  const setupMsgs = ["Creating workspace...", "Configuring chart of accounts...", "Loading sample data...", "Initializing AI Copilot...", "Ready!"];
  const currentMsg = setupMsgs[Math.min(Math.floor(setupProgress / 20), setupMsgs.length - 1)];

  const accentC = c?.accent || "#60a5fa";
  const greenC = c?.green || "#34d399";
  const surfC = c?.surface || "#111318";
  const txtC = c?.text || "#f0f2f5";
  const dimC = c?.textDim || "#8b92a5";
  const faintC = c?.textFaint || "#3d4558";
  const bdrC = c?.border || "#1e2230";
  const bgC = c?.surfaceAlt || "#0b0c10";

  // Mini sparkline for step 3
  const MiniChart = () => {
    const pts = [20,35,28,42,38,55,48,62,58,72,65,78];
    const w = 280, h = 60;
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${h - (p / 80) * h}`).join(" ");
    return (
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 60, overflow: "visible" }}>
        <defs>
          <linearGradient id="ogFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentC} stopOpacity="0.15" />
            <stop offset="100%" stopColor={accentC} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#ogFill)" />
        <path d={path} fill="none" stroke={accentC} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 500, strokeDashoffset: setupProgress < 60 ? 500 - (setupProgress / 60) * 500 : 0, transition: "stroke-dashoffset 0.8s ease" }} />
        {setupProgress >= 80 && <circle cx={w} cy={h - (78 / 80) * h} r="4" fill={accentC} style={{ animation: "pulse 2s infinite" }} />}
      </svg>
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}>
      <div style={{ width: 560, maxWidth: "95vw", maxHeight: "92vh", overflow: "auto", background: surfC, border: `1px solid ${bdrC}`, borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", padding: "36px 40px", animation: "cmdIn 0.25s ease", position: "relative" }}>
        {/* Gradient accent edge */}

        {/* Step progress */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, position: "relative" }}>
          <div style={{ position: "absolute", top: 14, left: "16.5%", right: "16.5%", height: 2, background: c?.borderSub || "#1e2230", zIndex: 0 }} />
          <div style={{ position: "absolute", top: 14, left: "16.5%", height: 2, background: `linear-gradient(90deg, ${accentC}, ${greenC})`, zIndex: 1, transition: "width 0.4s ease", width: step === 0 ? "0%" : step === 1 ? "50%" : "67%" }} />
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 2, flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, transition: "all 0.15s ease",
                background: i < step ? `linear-gradient(135deg, ${greenC}, ${accentC})` : i === step ? accentC : (c?.bg2 || "#1e2230"),
                color: i <= step ? "#fff" : faintC,
                border: `2px solid ${i <= step ? "transparent" : (c?.borderSub || "#1e2230")}`,
                boxShadow: i === step ? `0 0 12px ${accentC}30` : "none",
              }}>
                {i < step ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: i <= step ? txtC : faintC, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {["Setup", "Connect", "Ready"][i]}
              </div>
            </div>
          ))}
        </div>

        {/* Pending plan */}
        {planStatus?.startsWith("pending:") && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, padding: "8px 14px", borderRadius: 8, background: `${accentC}08`, border: `1px solid ${accentC}15`, fontSize: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: greenC, animation: "pulse 2s infinite" }} />
            <span style={{ color: dimC }}>Plan:</span>
            <span style={{ fontWeight: 700, color: accentC }}>{planStatus.replace("pending:", "")} — activating</span>
          </div>
        )}

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: txtC, marginBottom: 6 }}>
            {step === 2 ? `Welcome aboard${userName && userName !== "Guest" ? `, ${userName.split(" ")[0]}` : ""}!` : steps[step].title}
          </div>
          <div style={{ fontSize: 13, color: dimC }}>{steps[step].sub}</div>
        </div>

        {/* ═══ STEP 1: Organization Setup ═══ */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ position: "relative" }}>
              <input value={org.name} onChange={e => setOrg(p => ({ ...p, name: e.target.value }))} placeholder="Company name"
                style={{ width: "100%", fontSize: 14, padding: "13px 16px 13px 42px", borderRadius: 12, border: `1px solid ${bdrC}`, background: bgC, color: txtC, fontFamily: "inherit", outline: "none", transition: "border-color 0.2s", fontWeight: 600 }}
                onFocus={e => e.target.style.borderColor = accentC} onBlur={e => e.target.style.borderColor = bdrC}
              />
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}><LayoutDashboard size={14} color={accentC} /></span>
            </div>
            {/* Live preview card */}
            {org.name && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: `${accentC}06`, border: `1px solid ${accentC}12`, display: "flex", alignItems: "center", gap: 10, animation: "fosFadeSlideUp 0.2s ease" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${accentC}, ${c?.purple || "#a78bfa"})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>
                  {org.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: txtC }}>{org.name}</div>
                  <div style={{ fontSize: 10, color: faintC }}>Your workspace URL: {org.name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 20)}.finance-os.app</div>
                </div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <select value={org.industry} onChange={e => setOrg(p => ({ ...p, industry: e.target.value }))} style={{ width: "100%", fontSize: 12, padding: "11px 14px", borderRadius: 10, border: `1px solid ${bdrC}`, background: bgC, color: org.industry ? txtC : faintC, fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
                <option value="">Industry</option>
                {["SaaS / Software", "Financial Services", "E-commerce", "Healthcare", "Manufacturing", "Professional Services", "Other"].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <select value={org.currency} onChange={e => setOrg(p => ({ ...p, currency: e.target.value }))} style={{ width: "100%", fontSize: 12, padding: "11px 14px", borderRadius: 10, border: `1px solid ${bdrC}`, background: bgC, color: txtC, fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
                {["USD", "EUR", "GBP", "CAD", "AUD", "JPY"].map(cur => <option key={cur} value={cur}>{cur}</option>)}
              </select>
            </div>
            <select value={org.fy} onChange={e => setOrg(p => ({ ...p, fy: e.target.value }))} style={{ width: "100%", fontSize: 12, padding: "11px 14px", borderRadius: 10, border: `1px solid ${bdrC}`, background: bgC, color: txtC, fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
              {["January", "February", "March", "April", "June", "July", "September", "October", "December"].map(m => <option key={m} value={m}>Fiscal year ends {m}</option>)}
            </select>
          </div>
        )}

        {/* ═══ STEP 2: Connect Data Sources ═══ */}
        {step === 1 && (
          <div>
            {/* Category labels */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {["All", "ERP", "CRM", "Billing", "Banking", "Data"].map(cat => (
                <span key={cat} style={{ fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: bgC, border: `1px solid ${bdrC}`, color: dimC, letterSpacing: "0.04em" }}>{cat}</span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {connectors.map(co => {
                const isConnected = connected.includes(co.id);
                const isConnecting = connecting === co.id;
                return (
                  <div key={co.id} onClick={() => !isConnected && !isConnecting && handleConnect(co.id)} style={{
                    padding: "16px 16px", borderRadius: 14, cursor: isConnected ? "default" : "pointer",
                    border: `1px solid ${isConnected ? `${greenC}30` : isConnecting ? `${co.color}40` : bdrC}`,
                    background: isConnected ? `${greenC}06` : isConnecting ? `${co.color}06` : "transparent",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => { if (!isConnected && !isConnecting) { e.currentTarget.style.borderColor = `${co.color}50`; e.currentTarget.style.boxShadow = `0 6px 20px ${co.color}10`; }}}
                  onMouseLeave={e => { if (!isConnected && !isConnecting) { e.currentTarget.style.borderColor = bdrC; e.currentTarget.style.boxShadow = "none"; }}}
                  >
                    {/* Syncing progress bar */}
                    {isConnecting && <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: `linear-gradient(90deg, ${co.color}, ${co.color}80)`, animation: "shrink 1.8s linear reverse", borderRadius: 1 }} />}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${co.color}15`, border: `1px solid ${co.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: co.color, flexShrink: 0 }}>
                        {co.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: txtC, display: "flex", alignItems: "center", gap: 6 }}>
                          {co.name}
                          {isConnected && <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 5px", borderRadius: 3, background: `${greenC}15`, color: greenC }}>SYNCED</span>}
                        </div>
                        <div style={{ fontSize: 9, color: faintC }}>{co.cat}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: isConnecting ? co.color : dimC, fontWeight: isConnecting ? 600 : 400, lineHeight: 1.4 }}>
                      {isConnecting ? "Connecting..." : isConnected ? "✓ Connected · Real-time sync" : co.desc}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <span style={{ fontSize: 10, color: faintC }}>
                {connected.length > 0 ? `${connected.length} source${connected.length > 1 ? "s" : ""} connected · ` : ""}
                Skip to use sample data — connect live sources anytime
              </span>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Ready — Dynamic Preview ═══ */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            {/* Animated setup progress */}
            {setupProgress < 100 ? (
              <div style={{ width: "100%", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${accentC}15, ${c?.purple || "#a78bfa"}08)`, border: `1px solid ${accentC}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", animation: "pulse 1.5s infinite" }}>
                  <Cpu size={22} color={accentC} />
                </div>
                <div style={{ fontSize: 12, color: accentC, fontWeight: 600, marginBottom: 10 }}>{currentMsg}</div>
                <div style={{ height: 4, background: c?.bg2 || "#1e2230", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ width: `${setupProgress}%`, height: "100%", background: `linear-gradient(90deg, ${accentC}, ${greenC})`, borderRadius: 2, transition: "width 0.5s ease" }} />
                </div>
                <div style={{ fontSize: 9, color: faintC, fontFamily: "'JetBrains Mono', monospace" }}>{setupProgress}%</div>
              </div>
            ) : (
              <>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${greenC}, ${accentC})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px ${greenC}25`, animation: "fosFadeSlideUp 0.3s ease" }}>
                  <Check size={26} color="#fff" strokeWidth={3} />
                </div>
                {/* Dashboard preview card */}
                <div style={{ width: "100%", background: bgC, borderRadius: 14, padding: "18px 20px", border: `1px solid ${bdrC}`, animation: "fosFadeSlideUp 0.4s ease 0.15s both" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: txtC }}>Revenue Preview</span>
                    <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 3, background: `${greenC}15`, color: greenC, display: "flex", alignItems: "center", gap: 3 }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: greenC, animation: "pulse 2s infinite" }} />LIVE
                    </span>
                  </div>
                  <MiniChart />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
                    {[{ label: "ARR", value: "$48.6M", color: accentC }, { label: "NDR", value: "118%", color: greenC }, { label: "Rule of 40", value: "52.1", color: c?.purple || "#a78bfa" }].map(k => (
                      <div key={k.label} style={{ padding: "8px 10px", borderRadius: 8, background: `${k.color}06`, border: `1px solid ${k.color}10`, textAlign: "center" }}>
                        <div style={{ fontSize: 8, fontWeight: 700, color: faintC, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{k.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: k.color, fontFamily: "'JetBrains Mono', monospace" }}>{k.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Org summary */}
                <div style={{ width: "100%", fontSize: 11, color: dimC, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", animation: "fosFadeSlideUp 0.4s ease 0.3s both" }}>
                  {org.name && <span style={{ padding: "4px 10px", borderRadius: 6, background: bgC, border: `1px solid ${bdrC}`, display: "inline-flex", alignItems: "center", gap: 4 }}><LayoutDashboard size={11} /> {org.name}</span>}
                  {org.industry && <span style={{ padding: "4px 10px", borderRadius: 6, background: bgC, border: `1px solid ${bdrC}` }}>{org.industry}</span>}
                  {connected.length > 0 && <span style={{ padding: "4px 10px", borderRadius: 6, background: `${greenC}06`, border: `1px solid ${greenC}15`, color: greenC, display: "inline-flex", alignItems: "center", gap: 4 }}><Plug size={11} /> {connected.length} connected</span>}
                  <span style={{ padding: "4px 10px", borderRadius: 6, background: bgC, border: `1px solid ${bdrC}` }}>{org.currency} · FY {org.fy}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ fontSize: 12, color: dimC, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, padding: "8px 12px", borderRadius: 8, transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = txtC}
              onMouseLeave={e => e.currentTarget.style.color = dimC}
            >← Back</button>
          ) : (
            <button onClick={() => onComplete(org)} style={{ fontSize: 11, color: faintC, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Skip setup</button>
          )}
          <button onClick={() => { if (step < 2) setStep(s => s + 1); else if (setupProgress >= 100) onComplete(org); }}
            disabled={step === 2 && setupProgress < 100}
            style={{
              fontSize: 13, padding: "12px 28px", borderRadius: 10, border: "none", fontWeight: 700, fontFamily: "inherit",
              cursor: step === 2 && setupProgress < 100 ? "wait" : "pointer",
              background: step === 2 && setupProgress >= 100 ? `linear-gradient(135deg, ${greenC}, ${accentC})` : accentC,
              color: "#fff", boxShadow: `0 4px 16px ${accentC}25`,
              opacity: step === 2 && setupProgress < 100 ? 0.6 : 1,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => { if (!(step === 2 && setupProgress < 100)) { e.currentTarget.style.boxShadow = `0 8px 24px ${accentC}35`; }}}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${accentC}25`; }}
          >{step === 2 ? (setupProgress < 100 ? "Setting up..." : "Go to Dashboard →") : step === 1 ? (connected.length > 0 ? `Continue with ${connected.length} source${connected.length > 1 ? "s" : ""} →` : "Continue with sample data →") : "Continue →"}</button>
        </div>
      </div>
    </div>
  );
};

const PlanPicker = ({ c, userName, onSkip, onSelect, isDemo, isAuthenticated }) => {
  const [billing, setBilling] = useState("annual");
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [checkoutPending, setCheckoutPending] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verifyFailed, setVerifyFailed] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const canSkip = !isAuthenticated; // Authenticated users MUST pick a plan — no skip allowed
  // Theme helper — uses dashboard theme if available, falls back to dark
  const t = { bg: c?.surface || "#111318", bg2: c?.bg2 || "#0b0c10", alt: c?.surfaceAlt || "#181b22", bdr: c?.border || "#1e2230", bdrSub: c?.borderSub || "#171b25", bdrBright: c?.borderBright || "#2a2f3d", tx: c?.text || "#eef0f6", txD: c?.textDim || "#636d84", txF: c?.textFaint || "#3d4558", txS: c?.textSec || "#9ea5b8", ac: c?.accent || "#5b9cf5", pu: c?.purple || "#a181f7", gn: c?.green || "#3dd9a0", rd: c?.red || "#f06b6b" };

  const features = [
    { name: "Entities", values: ["3", "10", "Unlimited"] },
    { name: "Users", values: ["5", "25", "Unlimited"] },
    { name: "AI Copilot (Claude)", values: [false, true, true] },
    { name: "Multi-Entity Consolidation", values: [false, true, true] },
    { name: "Scenario Modeling", values: ["2", "10", "Unlimited"] },
    { name: "Integrations", values: ["5", "15", "All"] },
    { name: "Variance Detective", values: [true, true, true] },
    { name: "Forecast Optimizer", values: ["Basic", "ML-Powered", "Custom ML"] },
    { name: "Board Reporting", values: [false, true, true] },
    { name: "Custom ML Models", values: [false, false, true] },
    { name: "SSO / SAML / RBAC", values: [false, false, true] },
    { name: "Dedicated CSM", values: [false, false, true] },
    { name: "Uptime Target", values: ["99.9%", "99.95%", "Custom"] },
    { name: "API Access", values: [false, "REST", "REST + GQL"] },
    { name: "Support", values: ["Email", "Priority", "Dedicated"] },
  ];

  return (
    <div onClick={canSkip ? onSkip : undefined} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "95vw", maxWidth: 860, maxHeight: "94vh", overflow: "auto", background: t.bg, border: `1px solid ${t.bdr}`, borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.4)", animation: "cmdIn 0.25s ease" }}>
        {/* Header */}
        <div style={{ padding: "32px 40px 0", textAlign: "center", position: "relative" }}>
          {/* Accent edge */}
          {/* Close button — only when skip is allowed */}
          {canSkip && <button onClick={onSkip} aria-label="Go back" style={{
            position: "absolute", top: 20, left: 20, width: 36, height: 36, borderRadius: 10,
            border: `1px solid ${t.bdr}`, background: "transparent", color: t.txD, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
            fontFamily: "inherit", fontSize: 16,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.bdrBright; e.currentTarget.style.color = t.tx; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.bdr; e.currentTarget.style.color = t.txD; }}
          >←</button>}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
            <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: `${t.gn}10`, border: `1px solid ${t.gn}18`, fontSize: 10, fontWeight: 700, color: t.gn, letterSpacing: "0.04em" }}>30-DAY MONEY-BACK GUARANTEE</div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6, color: t.tx }}>
            {userName && userName !== "Guest" ? `${userName.split(" ")[0]}, choose your plan` : "Choose your plan"}
          </div>
          <div style={{ fontSize: 13, color: t.txD, marginBottom: 16 }}>
            {"Select a plan to get started. 30-day money-back guarantee."}
          </div>
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
              const priceDisplay = p.enterprise ? "Custom" : `${csym()}${billing === "annual" ? p.annual?.toLocaleString() : p.monthly?.toLocaleString()}${csfx()}`;
              const savings = p.monthly && p.annual ? (p.monthly - p.annual) * 12 : 0;
              return (
              <div key={p.name} onMouseEnter={() => setHoveredPlan(idx)} onMouseLeave={() => setHoveredPlan(null)} style={{
                background: isHovered ? `linear-gradient(180deg, ${p.popular ? t.ac : t.pu}12 0%, ${t.bg2} 100%)` : p.popular ? `linear-gradient(180deg, ${t.ac}08 0%, ${t.bg2} 100%)` : t.bg2,
                border: `1.5px solid ${isHovered ? (p.popular ? t.ac : t.pu) : p.popular ? t.ac : t.bdrSub}`,
                borderRadius: 12, padding: "24px 20px", position: "relative", transition: "all 0.2s ease",
                transform: isHovered ? "translateY(-6px) scale(1.01)" : "none",
                boxShadow: isHovered ? `0 0 0 1px ${p.popular ? t.ac : t.pu}25, 0 16px 48px ${p.popular ? t.ac : t.pu}15, 0 8px 24px rgba(0,0,0,0.3)` : p.popular ? `0 0 0 1px ${t.ac}18, 0 8px 30px ${t.ac}10` : "none",
                cursor: "pointer",
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
                {p.enterprise && <div style={{ fontSize: 11, color: t.txD, marginBottom: 10, lineHeight: 1.5 }}>No seat, entity, or usage limits.<br />Multi-year & volume pricing available.</div>}
                <div style={{ fontSize: 11, color: t.txD, lineHeight: 1.6, marginBottom: 16, minHeight: 36 }}>{p.desc}</div>
                <button onClick={async () => {
                  if (p.enterprise) { window.open("https://calendly.com/finance-os-support/30min", "_blank"); return; }
                  setCheckoutLoading(p.name);
                  try {
                    const { data: { session: authSession } } = await supabase.auth.getSession();
                    if (!authSession?.access_token) {
                      // Not logged in — redirect to signup first
                      toast("Create an account to subscribe", "warning");
                      setCheckoutLoading(null);
                      return;
                    }
                    // Call create-checkout Edge Function → Stripe Checkout
                    const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authSession.access_token}`,
                        "apikey": SUPABASE_KEY,
                      },
                      body: JSON.stringify({ plan: p.name.toLowerCase(), interval: billing }),
                    });
                    const data = await res.json();
                    if (data.url) {
                      // Redirect to Stripe Checkout
                      window.location.href = data.url;
                    } else {
                      toast(data.error || "Checkout unavailable — contact support@finance-os.app", "error");
                    }
                  } catch (err) {
                    toast("Checkout error — please try again", "error");
                  }
                  setCheckoutLoading(null);
                }} disabled={checkoutLoading === p.name} style={{
                  width: "100%", padding: "12px", borderRadius: 10, border: p.enterprise ? `1px solid ${t.bdr}` : "none", cursor: checkoutLoading === p.name ? "wait" : "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                  background: checkoutLoading === p.name ? t.bdr : p.popular ? `linear-gradient(135deg, ${t.ac}, ${t.pu})` : p.enterprise ? "transparent" : isHovered ? t.bdrBright : t.bdr, color: p.enterprise ? t.txS : "#fff",
                  transition: "all 0.2s", boxShadow: p.popular ? `0 4px 16px ${t.ac}25` : "none", opacity: checkoutLoading === p.name ? 0.6 : 1,
                }}
                onMouseEnter={e => { if (!p.popular && checkoutLoading !== p.name) e.currentTarget.style.background = t.bdrBright; }}
                onMouseLeave={e => { if (!p.popular && checkoutLoading !== p.name) e.currentTarget.style.background = t.bdr; }}
                >{checkoutLoading === p.name ? "Redirecting..." : p.enterprise ? "Let's Talk →" : `Subscribe — ${p.name}`}</button>
                {/* Platform features */}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${t.bdrSub}` }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: t.txF, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Platform</div>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: t.txS, padding: "2px 0" }}>
                      <span style={{ color: t.gn, fontSize: 10 }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                {/* Usage-based consumption tiers */}
                {p.usage && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.bdrSub}` }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: t.txF, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      Consumption Included <span style={{ fontSize: 7, padding: "1px 5px", borderRadius: 3, background: `${t.ac}12`, color: t.ac, fontWeight: 800 }}>PAY-PER-USE</span>
                    </div>
                    {p.usage.map(u => {
                      const unlimited = u.included === -1;
                      const maxRef = p.name === "Starter" ? 1000 : p.name === "Growth" ? 5000 : 10000;
                      const pct = unlimited ? 100 : Math.min((u.included / maxRef) * 100, 100);
                      return (
                      <div key={u.label} style={{ marginBottom: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, marginBottom: 2 }}>
                          <span style={{ color: t.txD, fontWeight: 500 }}>{u.label}</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: unlimited ? t.gn : t.tx }}>
                            {unlimited ? "Unlimited" : u.included.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ height: 3, background: `${t.bdr}`, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: unlimited ? `linear-gradient(90deg, ${t.gn}, ${t.gn}88)` : p.popular ? `linear-gradient(90deg, ${t.ac}, ${t.pu})` : `linear-gradient(90deg, ${t.ac}bb, ${t.ac}66)`, transition: "width 0.6s ease" }} />
                        </div>
                        {!unlimited && u.overage && (
                          <div style={{ fontSize: 8, color: t.txF, marginTop: 1 }}>then {u.overage}</div>
                        )}
                      </div>
                      );
                    })}
                    {p.enterprise && (
                      <div style={{ fontSize: 9, color: t.txD, marginTop: 4, padding: "4px 8px", borderRadius: 4, background: `${t.gn}06`, border: `1px solid ${t.gn}10` }}>
                        Committed spend discounts available
                      </div>
                    )}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </div>

        {/* Checkout redirect confirmation */}
        {checkoutPending && !verifyingPayment && !verifyFailed && (
          <div style={{ padding: "24px 40px", textAlign: "center" }}>
            <div style={{ background: `linear-gradient(135deg, ${t.ac}06, ${t.pu}04)`, border: `1px solid ${t.ac}15`, borderRadius: 12, padding: "48px 28px" }}>
              <div style={{ width: 40, height: 40, border: `3px solid ${t.ac}30`, borderTopColor: t.ac, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <div style={{ fontSize: 16, fontWeight: 800, color: t.tx, marginBottom: 4 }}>Redirecting to checkout...</div>
              <div style={{ fontSize: 12, color: t.txD }}>Setting up your {checkoutPending} plan with Stripe</div>
              <button onClick={() => setCheckoutPending(null)} style={{ marginTop: 16, fontSize: 12, padding: "8px 20px", borderRadius: 8, border: `1px solid ${t.bdr}`, background: "transparent", color: t.txD, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Verification in progress */}
        {verifyingPayment && (
          <div style={{ padding: "24px 40px", textAlign: "center" }}>
            <div style={{ background: `linear-gradient(135deg, ${t.ac}06, ${t.pu}04)`, border: `1px solid ${t.ac}15`, borderRadius: 12, padding: "48px 28px" }}>
              <div style={{ width: 40, height: 40, border: `3px solid ${t.ac}30`, borderTopColor: t.ac, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <div style={{ fontSize: 16, fontWeight: 800, color: t.tx, marginBottom: 4 }}>Verifying payment...</div>
              <div style={{ fontSize: 12, color: t.txD }}>Checking with Stripe for {checkoutPending} subscription</div>
            </div>
          </div>
        )}

        {/* Verification failed */}
        {verifyFailed && (
          <div style={{ padding: "24px 40px", textAlign: "center" }}>
            <div style={{ background: `linear-gradient(135deg, ${t.rd}06, ${t.rd}03)`, border: `1px solid ${t.rd}20`, borderRadius: 12, padding: "32px 28px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${t.rd}15`, border: `1px solid ${t.rd}20`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 20 }}>✕</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.tx, marginBottom: 6 }}>Payment not found</div>
              <div style={{ fontSize: 13, color: t.txD, lineHeight: 1.6, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
                We couldn't verify a completed payment for the {checkoutPending} plan. This usually means the checkout was cancelled or is still processing.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => {
                  setVerifyFailed(false);
                  try { window.open("mailto:sales@finance-os.app?subject=Checkout%20Issue%20—%20" + encodeURIComponent(checkoutPending + " plan"), "_blank"); } catch {}
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
          <div style={{ background: t.bg2, border: `1px solid ${t.bdrSub}`, borderRadius: 14, overflow: "hidden" }}>
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
          <div style={{ fontSize: 11, color: t.txF, marginBottom: 10 }}>All plans include: SOC 2 compliance · AES-256 encryption · 24/7 monitoring · 30-day MBG</div>
          {canSkip ? (
            <button onClick={onSkip} style={{ fontSize: 11, color: t.txD, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>
              {isDemo ? "Continue with demo data →" : "Skip for now →"}
            </button>
          ) : (
            <div style={{ fontSize: 11, color: t.ac, fontWeight: 600, marginBottom: 8 }}>Select a plan to access your workspace</div>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            {["12-view dashboard", "AI-powered insights", "30-day money-back guarantee"].map(s => (
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
    title: "Your stack, connected", sub: "Native integrations — NetSuite, Salesforce, Stripe, Snowflake, Rippling. Bi-directional sync with real-time data freshness indicators.",
    kpis: [{ l: "Connectors", v: "15+" }, { l: "Sync", v: "Real-time" }, { l: "Setup", v: "< 5 min" }] },
];

const ProductDemo = ({ enterDemo, lp, lpMode }) => {
  const [tab, setTab] = useState("planning");
  const [tabKey, setTabKey] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const active = DEMO_TABS.find(d => d.id === tab) || DEMO_TABS[0];
  const [demoRef, demoVis] = useScrollReveal(0.08);
  const t = lpMode === "dark" ? { bg: "#0b0c10", surface: "rgba(16,19,26,0.7)", border: "#1e2230", text: "#f0f2f5", dim: "#8b92a5", faint: "#3d4558", accent: "#60a5fa", green: "#34d399", purple: "#a78bfa" } : { bg: "#f0f2f5", surface: "rgba(255,255,255,0.8)", border: "#e0e3ea", text: "#0f1118", dim: "#636d84", faint: "#9ea5b8", accent: "#3b82f6", green: "#10b981", purple: "#8b5cf6" };
  return (
    <div ref={demoRef} style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse, ${lp.accent}05 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ textAlign: "center", marginBottom: 48, position: "relative", opacity: demoVis ? 1 : 0, transform: demoVis ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 24, background: `${lp.accent}0a`, border: `1px solid ${lp.accent}14`, fontSize: 10, fontWeight: 700, color: lp.accent, marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <Eye size={12} color={lp.accent} strokeWidth={2.5} />Product Tour
        </div>
        <h2 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, color: lp.text }}>See it in action</h2>
        <p style={{ fontSize: 16, color: lp.textDim, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Explore the platform by use case. Click a tab to see how each module works.</p>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 36, opacity: demoVis ? 1 : 0, transform: demoVis ? "translateY(0)" : "translateY(16px)", transition: "all 0.5s ease 0.15s" }}>
        {DEMO_TABS.map((d, di) => (
          <button key={d.id} onClick={() => { setTab(d.id); setTabKey(k => k + 1); }} style={{
            fontSize: 13, padding: "10px 22px", borderRadius: 12, border: tab === d.id ? `1px solid ${lp.accent}` : `1px solid ${lp.border}`,
            background: tab === d.id ? `${lp.accent}0c` : "transparent",
            color: tab === d.id ? lp.accent : lp.textDim, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
            boxShadow: tab === d.id ? `0 4px 16px ${lp.accent}10` : "none",
            transform: tab === d.id ? "scale(1.04)" : "scale(1)",
          }}>{d.label}</button>
        ))}
      </div>
      {/* Content + Mockup */}
      <div key={tabKey} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 36, alignItems: "center", animation: "fosTabSlide 0.4s ease-out both" }}>
        <div>
          <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 14, color: lp.text }}>{active.title}</h3>
          <p style={{ fontSize: 15, color: lp.textDim, lineHeight: 1.75, marginBottom: 24 }}>{active.sub}</p>
          <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
            {active.kpis.map((k, i) => (
              <div key={k.l} style={{ padding: "12px 18px", borderRadius: 12, background: lpMode === "dark" ? "rgba(16,19,26,0.7)" : "rgba(255,255,255,0.8)", border: `1px solid ${lp.border}`, backdropFilter: "blur(8px)", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${[lp.accent, lp.green, lp.purple][i]}30`}
                onMouseLeave={e => e.currentTarget.style.borderColor = lp.border}
              >
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: 3, color: [lp.accent, lp.green, lp.purple][i] }}>{k.v}</div>
                <div style={{ fontSize: 9, color: lp.textFaint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.l}</div>
              </div>
            ))}
          </div>
          <button className="fos-cta-primary" onClick={enterDemo} style={{ fontSize: 14, padding: "14px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${lp.gradFrom}, ${lp.gradTo})`, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: `0 6px 24px ${lp.accent}25`, transition: "all 0.2s" }}
          >Try This Feature</button>
        </div>
        {/* Browser mockup — theme aware */}
        <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 4, boxShadow: lpMode === "dark" ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.08)" }}>
          <div style={{ background: t.surface, borderRadius: 13, overflow: "hidden", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: t.bg, borderBottom: `1px solid ${t.border}60` }}>
              <div style={{ display: "flex", gap: 5 }}>{["#ef4444","#fbbf24","#22c55e"].map(cl => <div key={cl} style={{ width: 8, height: 8, borderRadius: "50%", background: cl }} />)}</div>
              <div style={{ flex: 1, marginLeft: 8, padding: "4px 12px", borderRadius: 6, background: lpMode === "dark" ? "#0a0a0d" : "#f5f6f8", border: `1px solid ${t.border}`, fontSize: 10, color: t.faint }}>app.finance-os.app/{active.id}</div>
            </div>
            <div style={{ padding: 20, minHeight: 280 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 40, background: lpMode === "dark" ? "#1e2230" : "#e5e7ec", borderRadius: 8, minHeight: 240 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: t.text }}>{active.title}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                    {active.kpis.map((k, i) => (
                      <div key={k.l} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: [t.accent, t.green, t.purple][i], fontFamily: "'JetBrains Mono', monospace" }}>{k.v}</div>
                        <div style={{ fontSize: 8, color: t.faint, marginTop: 2 }}>{k.l}</div>
                      </div>
                    ))}
                  </div>
                  {/* Tab-specific mockup visual */}
                  <div style={{ height: 120, background: `linear-gradient(180deg, ${t.accent}08, transparent)`, borderRadius: 10, border: `1px solid ${t.border}`, overflow: "hidden", position: "relative" }}>
                    {active.id === "planning" && (
                      <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
                        <defs><linearGradient id="dg-plan" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.accent} stopOpacity="0.15"/><stop offset="100%" stopColor={t.accent} stopOpacity="0"/></linearGradient></defs>
                        <path d="M0,90 C40,85 80,70 120,60 C160,50 200,55 240,40 C280,25 320,30 360,20 L400,15 L400,120 L0,120 Z" fill="url(#dg-plan)"/>
                        <path d="M0,90 C40,85 80,70 120,60 C160,50 200,55 240,40 C280,25 320,30 360,20 L400,15" fill="none" stroke={t.accent} strokeWidth="2"/>
                        <path d="M0,95 C60,88 130,82 200,75 C270,68 340,55 400,50" fill="none" stroke={t.faint} strokeWidth="1" strokeDasharray="4 3"/>
                        <text x="360" y="12" fill={t.green} fontSize="9" fontWeight="700">+4.3%</text>
                      </svg>
                    )}
                    {active.id === "copilot" && (
                      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6, height: "100%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: t.purple }}><Sparkles size={12} color={t.purple} />FinanceOS Copilot</div>
                        <div style={{ fontSize: 10, color: t.dim, lineHeight: 1.5 }}>Revenue beat of +$2.09M is driven by enterprise outperformance. ACV expansion up 28%.</div>
                        <div style={{ display: "flex", gap: 4, marginTop: "auto" }}>
                          {["Enterprise +16.9%", "NDR 118%", "AI attach 34%"].map(tag => <span key={tag} style={{ fontSize: 7, padding: "2px 6px", borderRadius: 3, background: `${t.green}10`, color: t.green, fontWeight: 700 }}>{tag}</span>)}
                        </div>
                      </div>
                    )}
                    {active.id === "consolidation" && (
                      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                        {[
                          { entity: "Acme Corp (USD)", status: "Approved", color: t.green },
                          { entity: "Acme EU (EUR)", status: "In Review", color: "#fbbf24" },
                          { entity: "Acme APAC (JPY)", status: "Pending", color: t.accent },
                        ].map(e => (
                          <div key={e.entity} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${t.border}60` }}>
                            <span style={{ fontSize: 10, color: t.dim }}>{e.entity}</span>
                            <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: `${e.color}10`, color: e.color }}>{e.status}</span>
                          </div>
                        ))}
                        <div style={{ fontSize: 8, color: t.faint, marginTop: 4 }}>IC eliminations: 3 auto-reconciled · FX gain: +$42K</div>
                      </div>
                    )}
                    {active.id === "integrations" && (
                      <div style={{ padding: "10px 16px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                        {[
                          { name: "NetSuite", color: "#1B7B8A", status: "●" },
                          { name: "Salesforce", color: "#00A1E0", status: "●" },
                          { name: "Stripe", color: "#635BFF", status: "●" },
                          { name: "Snowflake", color: "#29B5E8", status: "●" },
                          { name: "Plaid", color: t.text, status: "●" },
                          { name: "Rippling", color: t.green, status: "●" },
                          { name: "QuickBooks", color: "#2CA01C", status: "●" },
                          { name: "Xero", color: "#13B5EA", status: "○" },
                        ].map(cc => (
                          <div key={cc.name} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 6, padding: "6px 8px", textAlign: "center" }}>
                            <div style={{ fontSize: 8, color: cc.color, marginBottom: 2 }}>{cc.status}</div>
                            <div style={{ fontSize: 7, color: t.dim, fontWeight: 600 }}>{cc.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
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
  const [previewIndustry, setPreviewIndustry] = useState("saas");
  const [demoModal, setDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ full_name: "", email: "", company: "", title: "", company_size: "", use_case: "", current_tools: "" });
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Landing page light/dark theme
  const [lpMode, setLpMode] = useState("light");
  const lp = lpMode === "dark" ? {
    bg: "#06080c", surface: "#10131a", surfaceAlt: "#0b0c10", border: "#1a1f2e", borderLight: "#1e2230",
    text: "#f0f2f5", textSub: "#c8cdd8", textDim: "#8b92a5", textFaint: "#3d4558",
    accent: "#60a5fa", green: "#3dd9a0", purple: "#a78bfa", gold: "#f5b731",
    navBg: "rgba(6,8,12,0.85)", cardBg: "rgba(16,19,26,0.7)", inputBg: "#0b0c10",
    gradFrom: "#60a5fa", gradTo: "#a78bfa",
  } : {
    bg: "#ffffff", surface: "#f8f9fb", surfaceAlt: "#ffffff", border: "#e5e7ec", borderLight: "#eef0f4",
    text: "#0f1118", textSub: "#2d3348", textDim: "#636d84", textFaint: "#9ea5b8",
    accent: "#3b82f6", green: "#10b981", purple: "#8b5cf6", gold: "#d97706",
    navBg: "rgba(255,255,255,0.88)", cardBg: "rgba(248,249,251,0.9)", inputBg: "#ffffff",
    gradFrom: "#3b82f6", gradTo: "#8b5cf6",
  };

  // ── Scroll-triggered animations via IntersectionObserver ──
  const useScrollReveal = (threshold = 0.15) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return [ref, visible];
  };

  // ── Animated counter hook ──
  const useCountUp = (target, duration = 1800, visible = false) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
      if (!visible) return;
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setVal(target); clearInterval(timer); }
        else setVal(Math.floor(start));
      }, 16);
      return () => clearInterval(timer);
    }, [visible, target, duration]);
    return val;
  };

  // Demo entry — gated behind email capture for lead tracking
  const enterDemo = () => {
    if (!heroEmail || !heroEmail.trim() || !heroEmail.includes("@")) {
      // No email — prompt signup instead of allowing free access
      setAuthModal("signup");
      return;
    }
    onLogin({ name: heroEmail.split("@")[0], email: heroEmail.trim(), plan: "demo" });
  };

  // Inline email signup → Supabase waitlist → drip pipeline → enter demo
  const handleHeroSignup = async () => {
    if (!heroEmail.trim() || !heroEmail.includes("@")) { setAuthModal("signup"); return; }
    setEmailStatus("saving");
    try {
      await supabase.from("waitlist").upsert({ email: heroEmail.trim(), interest_type: "trial", source: getUtmData().utm_source || "hero" }, { onConflict: "email" });
      // Smart notification — email alert to sales team
      fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "waitlist", email: heroEmail.trim(), interest_type: "trial", source: "hero_signup" }) }).catch(() => {});
      // Enroll in drip onboarding pipeline
      fetch("/api/drip", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "start", email: heroEmail.trim(), lead_data: { source: "hero_signup", interest_type: "trial" } }) }).catch(() => {});
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
    <div style={{ minHeight: "100vh", background: lp.bg, color: lp.text, fontFamily: "'Manrope', system-ui, sans-serif", overflow: "auto", position: "relative", transition: "background 0.4s ease, color 0.4s ease" }}>
      {/* Ambient depth — dot grid + gradient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, ${lpMode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"} 0.5px, transparent 0.5px)`, backgroundSize: "40px 40px" }} />
      </div>
      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", right: "-15%", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 65%)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 65%)", filter: "blur(100px)" }} />
      </div>

      {/* Site-wide status banner */}
      <StatusBanner dark={true} />

      {/* Nav — sticky with dropdown menus */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: lp.navBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${lp.border}50`, transition: "background 0.4s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "12px 20px" : "14px 48px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FosLogo size={32} />
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px", color: lp.text }}>Finance<span style={{ fontWeight: 400, opacity: 0.6 }}>OS</span></span>
          </div>
          {!isMobile ? (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {/* Dropdown buttons */}
            {[
              { label: "Solutions", items: [
                { name: "Budget Planning", href: "/use-cases/budget-planning" },
                { name: "Revenue Forecasting", href: "/use-cases/forecasting" },
                { name: "Financial Consolidation", href: "/use-cases/consolidation" },
                { name: "Revenue Planning", href: "/use-cases/revenue-planning" },
                { name: "Headcount Planning", href: "/use-cases/headcount-planning" },
                { name: "All Solutions", href: "/use-cases", accent: true },
              ]},
              { label: "Integrations", items: [
                { name: "Stripe", tag: "PAYMENTS" }, { name: "Square", tag: "PAYMENTS" }, { name: "Plaid", tag: "BANKING" },
                { name: "S&P Global", tag: "MARKET DATA" }, { name: "Morningstar", tag: "RESEARCH" }, { name: "FactSet", tag: "FINANCIAL DATA" },
                { name: "QuickBooks", tag: "ERP" }, { name: "Anthropic", tag: "AI PARTNER", accent: true },
                { name: "Supabase", tag: "DATABASE" }, { name: "Vercel", tag: "HOSTING" }, { name: "Cloudflare", tag: "SECURITY" }, { name: "AWS", tag: "CLOUD" },
                { name: "Ramp", tag: "EXPENSE MGMT" }, { name: "DocuSign", tag: "ESIGNATURE" },
                { name: "Slack", tag: "MESSAGING" }, { name: "Gmail", tag: "EMAIL" },
                { name: "HubSpot", tag: "CRM" }, { name: "Salesforce", tag: "CRM" }, { name: "Intercom", tag: "SUPPORT" },
                { name: "Calendly", tag: "SCHEDULING" }, { name: "Linear", tag: "PROJECTS" },
              ]},
              { label: "Trust", items: [
                { name: "SOC 2 Type II", tag: "COMPLIANCE" }, { name: "AES-256", tag: "ENCRYPTION" },
                { name: "99.9% Uptime", tag: "RELIABILITY" }, { name: "GDPR Ready", tag: "PRIVACY" },
                { name: "Row-Level Security", tag: "DATABASE" }, { name: "HSTS + CSP", tag: "HEADERS" },
              ]},
              { label: "Pricing", href: "#pricing" },
              { label: "Compare", items: [
                { name: "vs Pigment", href: "/compare/financeos-vs-pigment" },
                { name: "vs Anaplan", href: "/compare/financeos-vs-anaplan" },
                { name: "vs Adaptive", href: "/compare/financeos-vs-adaptive" },
                { name: "vs Mosaic", href: "/compare/financeos-vs-mosaic" },
                { name: "vs Runway", href: "/compare/financeos-vs-runway" },
              ]},
            ].map(menu => (
              <div key={menu.label} style={{ position: "relative" }} className="nav-dd-wrap">
                {menu.href && !menu.items ? (
                  <a href={menu.href} style={{ fontSize: 13, color: lp.textDim, textDecoration: "none", fontWeight: 600, padding: "8px 14px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = lp.text}
                    onMouseLeave={e => e.currentTarget.style.color = lp.textDim}
                  >{menu.label}</a>
                ) : (
                  <button className="nav-dd-btn" style={{ fontSize: 13, color: lp.textDim, background: "none", border: "none", fontWeight: 600, padding: "8px 14px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                    {menu.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.5, transition: "transform 0.2s" }}><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                )}
                {menu.items && (
                  <div className="nav-dd-panel" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", paddingTop: 10, display: "none", zIndex: 100 }}>
                    <div style={{ background: lpMode === "dark" ? "#0f1118" : "#fff", border: `1px solid ${lpMode === "dark" ? "#1e2230" : "#e5e7ec"}`, borderRadius: 20, padding: menu.label === "Integrations" ? "20px 22px" : "14px 12px", boxShadow: lpMode === "dark" ? "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(96,165,250,0.04)" : "0 20px 60px rgba(0,0,0,0.12)", minWidth: menu.label === "Integrations" ? 560 : menu.label === "Solutions" ? 340 : 240, maxHeight: 440, overflowY: "auto" }}>
                      {/* Panel title */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${lpMode === "dark" ? "#1e2230" : "#eef0f4"}` }}>
                        <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: lpMode === "dark" ? "#3d4558" : "#9ea5b8" }}>{menu.label}</span>
                        {menu.label === "Integrations" && <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${lp.accent}10`, color: lp.accent }}>40+ CONNECTED</span>}
                      </div>
                      {menu.label === "Integrations" ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
                          {menu.items.map(item => (
                            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, transition: "all 0.15s", cursor: "default" }}
                              onMouseEnter={e => { e.currentTarget.style.background = lpMode === "dark" ? "rgba(96,165,250,0.06)" : "rgba(59,130,246,0.04)"; e.currentTarget.style.transform = "translateX(2px)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                            >
                              <div style={{ width: 24, height: 24, borderRadius: 6, background: item.accent ? `${lp.accent}15` : (lpMode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>
                                <Plug size={10} color={item.accent ? lp.accent : lp.textFaint} />
                              </div>
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: item.accent ? lp.accent : lp.text, lineHeight: 1.2 }}>{item.name}</div>
                                <div style={{ fontSize: 7, fontWeight: 700, color: lpMode === "dark" ? "#3d4558" : "#9ea5b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.tag}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : menu.label === "Solutions" ? (
                        menu.items.map(item => (
                          <a key={item.name} href={item.href || "#"} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, textDecoration: "none", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = lpMode === "dark" ? "rgba(96,165,250,0.06)" : "rgba(59,130,246,0.04)"; e.currentTarget.style.transform = "translateX(3px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                          >
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: item.accent ? `linear-gradient(135deg, ${lp.accent}20, ${lp.purple}15)` : (lpMode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"), border: `1px solid ${item.accent ? `${lp.accent}20` : (lpMode === "dark" ? "#1e2230" : "#eef0f4")}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <TrendingUp size={12} color={item.accent ? lp.accent : lp.textDim} />
                            </div>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: item.accent ? 700 : 600, color: item.accent ? lp.accent : lp.text, lineHeight: 1.2 }}>{item.name}</div>
                              <div style={{ fontSize: 9, color: lp.textDim, marginTop: 1 }}>{item.accent ? "See all use cases" : "AI-powered automation"}</div>
                            </div>
                            <ChevronRight size={12} color={lp.textFaint} style={{ marginLeft: "auto" }} />
                          </a>
                        ))
                      ) : (
                        menu.items.map(item => (
                          item.href ? (
                            <a key={item.name} href={item.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, textDecoration: "none", fontSize: 12, fontWeight: item.accent ? 700 : 600, color: item.accent ? lp.accent : lp.text, transition: "all 0.15s" }}
                              onMouseEnter={e => { e.currentTarget.style.background = lpMode === "dark" ? "rgba(96,165,250,0.06)" : "rgba(59,130,246,0.04)"; e.currentTarget.style.transform = "translateX(2px)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                            >
                              <div style={{ width: 6, height: 6, borderRadius: 2, background: item.accent ? lp.accent : lp.textFaint, flexShrink: 0 }} />
                              {item.name}
                              {item.tag && <span style={{ fontSize: 8, fontWeight: 700, color: lpMode === "dark" ? "#3d4558" : "#9ea5b8", letterSpacing: "0.06em", marginLeft: "auto" }}>{item.tag}</span>}
                            </a>
                          ) : (
                            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600, color: lp.text, transition: "all 0.15s" }}
                              onMouseEnter={e => { e.currentTarget.style.background = lpMode === "dark" ? "rgba(96,165,250,0.06)" : "rgba(59,130,246,0.04)"; e.currentTarget.style.transform = "translateX(2px)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                            >
                              <div style={{ width: 6, height: 6, borderRadius: 2, background: lp.textFaint, flexShrink: 0 }} />
                              {item.name}
                              {item.tag && <span style={{ fontSize: 8, fontWeight: 700, color: lpMode === "dark" ? "#3d4558" : "#9ea5b8", letterSpacing: "0.06em", marginLeft: "auto" }}>{item.tag}</span>}
                            </div>
                          )
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div style={{ width: 1, height: 20, background: lp.border, margin: "0 4px" }} />
            <a href="#invest" style={{ fontSize: 12, color: lp.accent, textDecoration: "none", fontWeight: 600, padding: "8px 12px" }}>Investors</a>
            <button onClick={() => setLpMode(p => p === "dark" ? "light" : "dark")} title={lpMode === "dark" ? "Switch to light" : "Switch to dark"} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${lp.border}`, background: lp.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.25s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = lp.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = lp.border}
            >{lpMode === "dark" ? <Sun size={15} color={lp.textDim} /> : <Moon size={15} color={lp.textDim} />}</button>
            <button onClick={() => setAuthModal("login")} style={{ fontSize: 12, padding: "8px 18px", borderRadius: 8, border: `1px solid ${lp.border}`, background: "transparent", color: lp.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}>Sign In</button>
            <button className="fos-cta-primary" onClick={() => setAuthModal("signup")} style={{ fontSize: 12, padding: "8px 18px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${lp.gradFrom}, ${lp.gradTo})`, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: `0 4px 16px ${lp.accent}33` }}>Subscribe</button>
          </div>
          ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="fos-cta-secondary" onClick={() => setAuthModal("login")} style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, border: "1px solid #1e2230", background: "transparent", color: "#f0f2f5", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Sign In</button>
            <button className="fos-cta-primary" onClick={() => setAuthModal("signup")} style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Subscribe</button>
          </div>
          )}
        </div>
        <style>{`.nav-dd-wrap:hover .nav-dd-panel{display:block!important;animation:fadeSlideUp 0.2s ease}.nav-dd-wrap:hover .nav-dd-btn{color:${lpMode === "dark" ? "#f0f2f5" : "#0f1118"}!important;background:${lpMode === "dark" ? "rgba(96,165,250,0.06)" : "rgba(59,130,246,0.05)"}}.nav-dd-wrap:hover .nav-dd-btn svg{transform:rotate(180deg)}`}</style>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: isMobile ? "40px 20px 32px" : "80px 48px 40px", maxWidth: 960, margin: "0 auto" }}>
        {/* GA announcement badge — premium design */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 20px", borderRadius: 40, background: `linear-gradient(135deg, ${lp.accent}08, ${lp.purple}06)`, border: `1px solid ${lp.accent}20`, marginBottom: 28, animation: "fosFadeSlideUp 0.6s ease", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, ${lp.accent}05, transparent)`, animation: "shimmer 3s ease infinite" }} />
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: `linear-gradient(135deg, ${lp.green}, ${lp.accent})`, boxShadow: `0 0 12px ${lp.green}50`, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", background: `linear-gradient(135deg, ${lp.accent}, ${lp.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI-NATIVE FP&A</span>
          <span style={{ width: 1, height: 14, background: `${lp.textFaint}30` }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: lp.textDim, letterSpacing: "0.02em" }}>Now in General Availability</span>
          <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 8px", borderRadius: 4, background: `${lp.green}12`, color: lp.green, letterSpacing: "0.06em" }}>NEW</span>
        </div>

        <h1 style={{ fontSize: isMobile ? 38 : 64, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.04em", color: lp.text, marginBottom: 22, animation: "fosFadeSlideUp 0.6s ease 0.1s both" }}>
          Financial planning<br />that <span className="fos-gradient-text" style={{ position: "relative", display: "inline-block" }}>thinks before</span><br />it answers
        </h1>
        <p style={{ fontSize: isMobile ? 16 : 19, color: lp.textDim, lineHeight: 1.65, maxWidth: 560, margin: "0 auto 36px", fontWeight: 400, animation: "fosFadeSlideUp 0.6s ease 0.2s both" }}>
          Connect your ERP, CRM, and billing data into a unified model with AI-powered variance detection, natural language querying, and visible reasoning.
        </p>

        {/* CTA — sign-up focused, demo requires account */}
        <div style={{ display: "flex", gap: 0, justifyContent: "center", maxWidth: 480, margin: "0 auto", flexDirection: isMobile ? "column" : "row", animation: "fosFadeSlideUp 0.6s ease 0.3s both" }}>
          <input className="fos-input-glow" value={heroEmail} onChange={e => setHeroEmail(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleHeroSignup(); }}
            placeholder="Work email" type="email"
            style={{ flex: 1, fontSize: 15, padding: "16px 20px", borderRadius: isMobile ? 12 : "12px 0 0 12px", border: `1px solid ${lp.border}`, borderRight: isMobile ? `1px solid ${lp.border}` : "none", background: lp.inputBg, color: lp.text, fontFamily: "inherit", outline: "none" }}
          />
          <button className="fos-cta-primary" onClick={handleHeroSignup} style={{ fontSize: 15, padding: "16px 28px", borderRadius: isMobile ? 12 : "0 12px 12px 0", border: "none", background: `linear-gradient(135deg, ${lp.gradFrom}, ${lp.gradTo})`, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, whiteSpace: "nowrap", boxShadow: `0 8px 30px ${lp.accent}33` }}
          >Get Started Free</button>
        </div>
        <div style={{ fontSize: 11, color: lp.textFaint, marginTop: 10, textAlign: "center" }}>No credit card required · 14-day free trial · Interactive demo after signup</div>

        {/* Live notification indicator — animated social proof */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, animation: "fosFadeSlideUp 0.6s ease 0.5s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 10, background: lpMode === "dark" ? "rgba(16,19,26,0.7)" : "rgba(248,249,251,0.9)", border: `1px solid ${lp.border}`, backdropFilter: "blur(8px)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: lp.green, boxShadow: `0 0 8px ${lp.green}60`, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: lp.textDim }}>Smart alerts active</span>
            <span style={{ width: 1, height: 12, background: `${lp.border}` }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: lp.green }}>Real-time email notifications</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 14 }}>
          <button className="fos-cta-secondary" onClick={() => setDemoModal(true)} style={{ fontSize: 13, padding: "11px 22px", borderRadius: 10, border: `1px solid ${lp.accent}30`, background: `${lp.accent}06`, color: lp.accent, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
          ><Eye size={14} />Request a Guided Demo</button>
          <button className="fos-cta-secondary" onClick={() => setAuthModal("signup")} style={{ fontSize: 13, padding: "11px 22px", borderRadius: 10, border: `1px solid ${lp.border}`, background: "transparent", color: lp.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = lp.textFaint; e.currentTarget.style.color = lp.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; e.currentTarget.style.color = lp.textSub; }}
          >Sign In to Explore</button>
        </div>

        {/* ROI Impact Stats — animated counters with staggered entrance */}
        {(() => { const [statsRef, statsVisible] = useScrollReveal(0.2);
          const c80 = useCountUp(80, 1600, statsVisible);
          const c3 = useCountUp(3, 1200, statsVisible);
          const c95 = useCountUp(95, 1800, statsVisible);
          const c12 = useCountUp(12, 1400, statsVisible);
          return (
        <div ref={statsRef} style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 16, marginTop: 40 }}>
          {[
            { value: `${c80}%`, label: "Faster Planning Cycles", color: lp.accent, icon: Zap },
            { value: `${c3} weeks`, label: "Saved on Budgeting", color: lp.green, icon: CheckSquare },
            { value: `${c95}%`, label: "Faster Financial Reporting", color: lp.purple, icon: TrendingUp },
            { value: `${c12}-day`, label: "Decrease in Close Times", color: lp.gold || lp.amber || "#d97706", icon: Activity },
          ].map((s, i) => (
            <div key={s.label} className="fos-glow-pulse" style={{ textAlign: "center", padding: "22px 14px", borderRadius: 16, background: lpMode === "dark" ? `linear-gradient(135deg, ${s.color}08, ${s.color}03)` : `linear-gradient(135deg, ${s.color}06, ${s.color}02)`, border: `1px solid ${s.color}15`, transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", opacity: statsVisible ? 1 : 0, transform: statsVisible ? "translateY(0)" : "translateY(24px)", transitionDelay: `${i * 0.12}s`, position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}40`; e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; e.currentTarget.style.boxShadow = `0 12px 32px ${s.color}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${s.color}15`; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* Ambient glow orb */}
              <div style={{ position: "absolute", top: -20, right: -20, width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle, ${s.color}12 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}12`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10, transition: "transform 0.3s", position: "relative", zIndex: 1 }}>
                <s.icon size={17} color={s.color} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: lp.text, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, position: "relative", zIndex: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: lp.textDim, fontWeight: 600, marginTop: 7, lineHeight: 1.3, position: "relative", zIndex: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>); })()}

        {/* Trust logos — bold enterprise wordmarks */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 20 : 40, marginTop: 36, flexWrap: "wrap" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: lp.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 8 }}>Trusted by</div>
          {[
            { name: "Coca-Cola", logo: "https://cdn.simpleicons.org/cocacola", sz: 22 },
            { name: "JPMorgan", logo: "https://cdn.simpleicons.org/jpmorgan", sz: 20 },
            { name: "Deloitte", logo: "https://cdn.simpleicons.org/deloitte", sz: 20 },
            { name: "Target", logo: "https://cdn.simpleicons.org/target", sz: 26 },
            { name: "EY", logo: "https://cdn.simpleicons.org/ey", sz: 22 },
            { name: "Accenture", logo: "https://cdn.simpleicons.org/accenture", sz: 20 },
          ].map((b, i) => (
            <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0, animation: `fosFadeSlideUp 0.5s ease-out ${0.4 + i * 0.1}s forwards`, transition: "all 0.3s ease" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.style.opacity = ""}
            >
              <img src={b.logo} alt={b.name} style={{ height: b.sz, objectFit: "contain", filter: lpMode === "light" ? "grayscale(1) brightness(0.2)" : "grayscale(1) brightness(3) invert(1)", transition: "filter 0.3s ease" }} loading="lazy"
                onError={e => { e.target.onerror = null; e.target.style.display = "none"; const fb = document.createElement("span"); fb.style.cssText = `font-size:${b.sz - 4}px;font-weight:900;letter-spacing:-0.04em;color:${lpMode === "light" ? "#1a1f2e" : "#d0d5e0"};opacity:0.6;font-family:'Manrope',system-ui,sans-serif`; fb.textContent = b.name; e.target.parentElement.insertBefore(fb, e.target.nextSibling); }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Shimmer keyframe for GA badge */}
      <style>{`
        @keyframes shimmer{0%{transform:translateX(-100%)}50%{transform:translateX(100%)}100%{transform:translateX(100%)}}
        @keyframes fosKenBurns{0%{transform:scale(1) translate(0,0)}50%{transform:scale(1.08) translate(-1%,-1%)}100%{transform:scale(1) translate(0,0)}}
        @keyframes fosFadeSlideUp{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes fosRevealLeft{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0 0 0)}}
        @keyframes fosGradientText{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fosTypewriter{0%{width:0}100%{width:100%}}
        @keyframes fosBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fosPulseSubtle{0%,100%{opacity:0.7;transform:scale(1)}50%{opacity:1;transform:scale(1.02)}}
        @keyframes fosFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes fosGlowPulse{0%,100%{box-shadow:0 0 20px rgba(91,156,245,0.1)}50%{box-shadow:0 0 40px rgba(91,156,245,0.25)}}
        @keyframes fosSplashFade{0%{opacity:1}80%{opacity:1}100%{opacity:0;pointer-events:none}}
        @keyframes fosSplashLogo{0%{transform:scale(0.8);opacity:0}30%{transform:scale(1.05);opacity:1}50%{transform:scale(1);opacity:1}100%{transform:scale(1);opacity:1}}
        @keyframes fosSplashBar{0%{width:0}100%{width:100%}}
        @keyframes fosSplashPulse{0%,100%{opacity:0.4}50%{opacity:1}}
        .fos-ken-burns{animation:fosKenBurns 12s ease-in-out infinite}
        .fos-fade-up{animation:fosFadeSlideUp 0.6s ease-out both}
        .fos-reveal{animation:fosRevealLeft 0.8s ease-out both}
        .fos-gradient-text{background:linear-gradient(135deg,#5b9cf5,#a181f7,#3dd9a0,#5b9cf5);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:fosGradientText 6s ease infinite}
        .fos-float{animation:fosFloat 4s ease-in-out infinite}
        .fos-glow-pulse{animation:fosGlowPulse 3s ease-in-out infinite}
        .fos-testimonial-img{transition:transform 0.5s cubic-bezier(0.22,1,0.36,1),filter 0.5s ease;will-change:transform}
        .fos-testimonial-img:hover{transform:scale(1.03)}
        .fos-testimonial-card{transition:all 0.35s cubic-bezier(0.22,1,0.36,1)}
        .fos-testimonial-card:hover .fos-testimonial-img{transform:scale(1.05);filter:brightness(1.05)}
      `}</style>

      {/* Section Connector — animated flowing line */}
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
        <div style={{ position: "relative", width: 2, height: 48 }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent, ${lp.accent}20, transparent)`, borderRadius: 1 }} />
          <div style={{ position: "absolute", width: 2, height: 12, background: `linear-gradient(180deg, ${lp.accent}60, ${lp.accent}00)`, borderRadius: 1, animation: "fosFlowDown 2s ease-in-out infinite" }} />
          <style>{`@keyframes fosFlowDown{0%{top:-12px;opacity:0}20%{opacity:1}80%{opacity:1}100%{top:48px;opacity:0}}`}</style>
        </div>
      </div>

      {/* ═══ Premium Dashboard Preview — animated like a live video ═══ */}
      <style>{`
        @keyframes fosDrawLine{0%{stroke-dashoffset:800}100%{stroke-dashoffset:0}}
        @keyframes fosCountUp{0%{opacity:0;transform:translateY(6px)}40%{opacity:1;transform:translateY(0)}100%{opacity:1}}
        @keyframes fosSlideIn{0%{opacity:0;transform:translateX(12px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes fosPulseGlow{0%,100%{box-shadow:0 0 4px rgba(52,211,153,0.3)}50%{box-shadow:0 0 12px rgba(52,211,153,0.6)}}
        @keyframes fosChartDot{0%,50%{r:3.5}75%{r:5}100%{r:3.5}}
        @keyframes fosBarGrow{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
        @keyframes fosPreviewFloat{0%,100%{transform:perspective(1200px) rotateX(2deg) translateY(0)}50%{transform:perspective(1200px) rotateX(0deg) translateY(-6px)}}
        @keyframes fosPreviewGlow{0%,100%{box-shadow:0 40px 100px rgba(0,0,0,0.6),0 0 0 1px rgba(96,165,250,0.05)}50%{box-shadow:0 50px 120px rgba(0,0,0,0.5),0 0 0 1px rgba(96,165,250,0.12),0 0 60px rgba(96,165,250,0.04)}}
        @keyframes fosCursorBlink{0%,45%{opacity:1}50%,95%{opacity:0}100%{opacity:1}}
        @keyframes fosTyping{0%{width:0}100%{width:100%}}
        @keyframes fosNotifSlide{0%{transform:translateX(100%) scale(0.9);opacity:0}10%{transform:translateX(0) scale(1);opacity:1}90%{transform:translateX(0) scale(1);opacity:1}100%{transform:translateX(100%) scale(0.9);opacity:0}}
        @keyframes fosDataPulse{0%{opacity:0.5;transform:scale(0.98)}50%{opacity:1;transform:scale(1)}100%{opacity:0.5;transform:scale(0.98)}}
        @keyframes fosSparkle{0%{opacity:0;transform:scale(0) rotate(0deg)}50%{opacity:1;transform:scale(1) rotate(180deg)}100%{opacity:0;transform:scale(0) rotate(360deg)}}
        .fos-preview-line{stroke-dasharray:800;animation:fosDrawLine 3s ease-out forwards}
        .fos-preview-kpi{animation:fosCountUp 0.6s ease-out both}
        .fos-preview-insight{animation:fosSlideIn 0.5s ease-out both}
        .fos-preview-dot{animation:fosChartDot 2s ease-in-out infinite}
        .fos-preview-live{animation:fosPulseGlow 2s ease-in-out infinite}
        .fos-preview-float{animation:fosPreviewFloat 6s ease-in-out infinite}
        .fos-preview-wrapper{animation:fosPreviewGlow 4s ease-in-out infinite}
        .fos-cursor-blink{animation:fosCursorBlink 1.2s ease-in-out infinite}
        @keyframes fosScaleIn{0%{opacity:0;transform:scale(0.92) translateY(16px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes fosRowReveal{0%{opacity:0;transform:translateX(-12px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes fosCardPop{0%{opacity:0;transform:scale(0.9) translateY(20px)}60%{transform:scale(1.02) translateY(-2px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes fosPricePulse{0%,100%{box-shadow:0 0 0 0 rgba(96,165,250,0)}50%{box-shadow:0 0 0 6px rgba(96,165,250,0.08)}}
        @keyframes fosShieldSpin{0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)}}
        @keyframes fosTabSlide{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes fosAccordionOpen{0%{opacity:0;max-height:0}100%{opacity:1;max-height:400px}}
        @keyframes fosStaggerLeft{0%{opacity:0;transform:translateX(-20px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes fosCheckPop{0%{transform:scale(0)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
        .fos-card-pop{animation:fosCardPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both}
        .fos-row-reveal{animation:fosRowReveal 0.4s ease-out both}
        .fos-scale-in{animation:fosScaleIn 0.5s ease-out both}
        .fos-price-pulse{animation:fosPricePulse 3s ease-in-out infinite}
        .fos-tab-slide{animation:fosTabSlide 0.35s ease-out both}
        .fos-stagger-left{animation:fosStaggerLeft 0.5s ease-out both}
        @keyframes fosNotifRipple{0%{transform:scale(0.8);opacity:0.6}100%{transform:scale(1.4);opacity:0}}
        @keyframes fosNotifPulse{0%{box-shadow:0 0 0 0 rgba(96,165,250,0.4)}70%{box-shadow:0 0 0 12px rgba(96,165,250,0)}100%{box-shadow:0 0 0 0 rgba(96,165,250,0)}}
        @keyframes fosAlertSlide{0%{opacity:0;transform:translateY(-100%) scale(0.95)}10%{opacity:1;transform:translateY(0) scale(1)}90%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-20px) scale(0.98)}}
        .fos-notif-pulse{animation:fosNotifPulse 2s ease-in-out infinite}
        .fos-alert-slide{animation:fosAlertSlide 4s ease-in-out both}
        @keyframes fosBeamSweepBtn{0%{left:-100%;opacity:0}20%{opacity:0.6}80%{opacity:0.6}100%{left:150%;opacity:0}}
        @keyframes fosRippleOut{0%{transform:scale(0);opacity:0.5}100%{transform:scale(4);opacity:0}}
        @keyframes fosGlowTrail{0%{box-shadow:0 0 20px rgba(96,165,250,0.3)}50%{box-shadow:0 0 40px rgba(96,165,250,0.15),0 4px 24px rgba(96,165,250,0.2)}100%{box-shadow:0 0 20px rgba(96,165,250,0.3)}}
        @keyframes fosMagneticReturn{0%{transform:translate(var(--mx),var(--my)) scale(1.02)}100%{transform:translate(0,0) scale(1)}}
        @keyframes fosShimmerLine{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        @keyframes fosProgressFill{0%{width:0%}100%{width:100%}}
        @keyframes fosBorderRotate{0%{background-position:0% 0%}100%{background-position:100% 100%}}
        .fos-logo-card{position:relative;overflow:visible}
        .fos-logo-card::before{content:'';position:absolute;top:-1px;left:-1px;right:-1px;bottom:-1px;border-radius:15px;background:linear-gradient(135deg,transparent 40%,rgba(96,165,250,0.15) 50%,transparent 60%);background-size:200% 200%;opacity:0;transition:opacity 0.3s ease;pointer-events:none}
        .fos-logo-card:hover::before{opacity:1;animation:fosBorderRotate 3s linear infinite}
        .fos-cta-primary{position:relative;overflow:hidden;transition:all 0.3s cubic-bezier(0.22,1,0.36,1)}
        .fos-cta-primary::after{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);pointer-events:none}
        .fos-cta-primary:hover::after{animation:fosShimmerLine 0.8s ease-out}
        .fos-cta-primary:hover{transform:translateY(-2px) scale(1.02)}
        .fos-cta-primary:active{transform:translateY(0) scale(0.98);transition-duration:0.1s}
        .fos-cta-secondary{position:relative;overflow:hidden;transition:all 0.25s cubic-bezier(0.22,1,0.36,1)}
        .fos-cta-secondary:hover{transform:translateY(-1px);border-color:rgba(96,165,250,0.4)!important}
        .fos-cta-secondary:active{transform:translateY(0) scale(0.98);transition-duration:0.1s}
        .fos-input-glow:focus{box-shadow:0 0 0 3px rgba(96,165,250,0.12),0 0 16px rgba(96,165,250,0.06)!important;border-color:#60a5fa!important}
        .fos-input-glow{transition:all 0.25s cubic-bezier(0.22,1,0.36,1)}
        .fos-data-pulse{animation:fosDataPulse 3s ease-in-out infinite}
        .fos-sparkle{animation:fosSparkle 2s ease-in-out infinite}
        .fos-notif-slide{animation:fosNotifSlide 5s ease-in-out infinite}
        .fos-auth-overlay{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,0.7);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease}
        .fos-auth-card{background:#10131a;border:1px solid #1e2230;border-radius:20px;box-shadow:0 40px 100px rgba(0,0,0,0.6),0 0 0 1px rgba(96,165,250,0.05);position:relative;overflow:hidden}
        .fos-auth-card::before{content:'';position:absolute;top:-1px;left:-1px;right:-1px;bottom:-1px;border-radius:21px;background:linear-gradient(135deg,rgba(96,165,250,0.1),transparent 40%,transparent 60%,rgba(167,139,250,0.08));pointer-events:none}
        .fos-gate-lock{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:8px;background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.12);font-size:9px;font-weight:700;color:#34d399;letter-spacing:0.06em;text-transform:uppercase}
        .fos-paywall-blur{filter:blur(6px);pointer-events:none;user-select:none;-webkit-user-select:none}
        .fos-paywall-gate{position:absolute;inset:0;z-index:10;display:flex;align-items:center;justify-content:center;background:rgba(6,8,12,0.6);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);border-radius:inherit}
      `}</style>
      <div className="fos-preview-float" style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 20px 40px" : "0 48px 60px" }}>
        <div style={{ position: "relative", background: lpMode === "dark" ? "rgba(16,19,26,0.8)" : "rgba(248,249,251,0.9)", border: `1px solid ${lp.border}`, borderRadius: 24, padding: 3, boxShadow: lpMode === "dark" ? "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(96,165,250,0.05)" : "0 40px 100px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)", overflow: "hidden" }}>
          {/* Browser chrome bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: lpMode === "dark" ? "#0b0c10" : "#f0f1f4", borderRadius: "21px 21px 0 0" }}>
            <div style={{ display: "flex", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca41" }} />
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 16px", borderRadius: 8, background: lpMode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", fontSize: 11, color: lp.textFaint }}>
                <Lock size={9} /> app.finance-os.app/dashboard
              </div>
            </div>
          </div>
          {/* Dashboard mockup content */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "180px 1fr 220px", background: lpMode === "dark" ? "#0d0f14" : "#f7f8fa", minHeight: 380 }}>
            {/* Sidebar mock */}
            {!isMobile && <div style={{ borderRight: `1px solid ${lp.border}40`, padding: "16px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", marginBottom: 14 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(135deg, ${lp.accent}, ${lp.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LayoutDashboard size={10} color="#fff" />
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: lp.text }}>FinanceOS</span>
              </div>
              {["Dashboard", "AI Copilot", "P&L", "Forecast", "Scenarios", "Close Tasks", "Team", "Integrations"].map((item, i) => (
                <div key={item} style={{ padding: "7px 10px", borderRadius: 7, fontSize: 10, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? lp.accent : lp.textDim, background: i === 0 ? `${lp.accent}10` : "transparent", marginBottom: 2, display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 1, background: i === 0 ? lp.accent : lp.textFaint, opacity: i === 0 ? 1 : 0.4 }} />
                  {item}
                  {item === "AI Copilot" && <span style={{ fontSize: 6, fontWeight: 800, padding: "1px 4px", borderRadius: 2, background: `${lp.purple}20`, color: lp.purple, marginLeft: "auto" }}>AI</span>}
                </div>
              ))}
            </div>}
            {/* Main content mock */}
            <div style={{ padding: isMobile ? 16 : 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: lp.text, marginBottom: 4 }}>Good afternoon, Alex</div>
              <div style={{ fontSize: 10, color: lp.textDim, marginBottom: 16 }}>FY2025 YTD · Revenue ahead by $2.09M</div>
              {/* Mini KPI cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Revenue", value: "$12.4M", delta: "+12.3%", color: lp.accent },
                  { label: "Gross Margin", value: "78.2%", delta: "+2.1%", color: lp.green },
                  { label: "Net Income", value: "$1.8M", delta: "+8.7%", color: lp.purple },
                ].map((k, i) => (
                  <div key={k.label} className="fos-preview-kpi" style={{ background: lpMode === "dark" ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${lp.border}40`, borderRadius: 10, padding: "10px 12px", position: "relative", overflow: "hidden", animationDelay: `${i * 0.2}s` }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${k.color}, ${k.color}40)`, transformOrigin: "left", animation: "fosBarGrow 1s ease-out both", animationDelay: `${0.5 + i * 0.2}s` }} />
                    <div style={{ fontSize: 8, fontWeight: 700, color: lp.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{k.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: lp.text, fontFamily: "'JetBrains Mono', monospace" }}>{k.value}</div>
                    <span style={{ fontSize: 8, fontWeight: 700, color: lp.green }}>{k.delta}</span>
                  </div>
                ))}
              </div>
              {/* Mini chart mockup */}
              <div style={{ background: lpMode === "dark" ? "rgba(255,255,255,0.03)" : "#fff", border: `1px solid ${lp.border}40`, borderRadius: 10, padding: "12px 14px", height: 140, position: "relative", overflow: "hidden" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: lp.text, marginBottom: 8 }}>Revenue Performance</div>
                <svg viewBox="0 0 400 80" style={{ width: "100%", height: 80 }}>
                  <defs>
                    <linearGradient id="lpChartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={lp.accent} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={lp.accent} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 65 L40 58 L80 50 L120 52 L160 40 L200 35 L240 30 L280 22 L320 18 L360 12 L400 8 L400 80 L0 80Z" fill="url(#lpChartFill)" style={{ opacity: 0.7 }} />
                  <path className="fos-preview-line" d="M0 65 L40 58 L80 50 L120 52 L160 40 L200 35 L240 30 L280 22 L320 18 L360 12 L400 8" fill="none" stroke={lp.accent} strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M0 70 L40 68 L80 64 L120 62 L160 58 L200 56 L240 52 L280 48 L320 46 L360 42 L400 40" fill="none" stroke={lp.textFaint} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                  <circle className="fos-preview-dot" cx="400" cy="8" r="3.5" fill={lp.accent} style={{ filter: `drop-shadow(0 0 8px ${lp.accent})` }} />
                </svg>
              </div>
            </div>
            {/* Right panel mock — AI Copilot / insights */}
            {!isMobile && <div style={{ borderLeft: `1px solid ${lp.border}40`, padding: "16px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: `linear-gradient(135deg, ${lp.purple}30, ${lp.accent}20)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={10} color={lp.purple} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: lp.text }}>AI Copilot</span>
                <span className="fos-preview-live" style={{ fontSize: 6, fontWeight: 800, padding: "2px 5px", borderRadius: 3, background: `${lp.green}15`, color: lp.green, marginLeft: "auto" }}>LIVE</span>
              </div>
              {[
                { text: "Revenue is tracking 12.3% above budget driven by Enterprise expansion", color: lp.green, Icon: ArrowUpRight },
                { text: "COGS increased 3.2% — AWS hosting costs up, recommend reserved instances", color: lp.amber || lp.gold, Icon: Activity },
                { text: "Q2 forecast confidence: 94.2% — MAPE below 3% threshold", color: lp.accent, Icon: Target },
              ].map((insight, i) => (
                <div key={i} className="fos-preview-insight" style={{ padding: "10px 10px", marginBottom: 6, borderRadius: 8, background: `${insight.color}06`, border: `1px solid ${insight.color}12`, fontSize: 9, lineHeight: 1.5, color: lp.textSub || lp.textDim, animationDelay: `${1.2 + i * 0.4}s` }}>
                  <insight.Icon size={10} color={insight.color} style={{ marginRight: 4, flexShrink: 0 }} />
                  {insight.text}
                </div>
              ))}
              <div style={{ marginTop: 12, padding: "8px 10px", borderRadius: 8, border: `1px solid ${lp.border}40`, background: lpMode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", fontSize: 10, color: lp.textFaint, display: "flex", alignItems: "center", gap: 6 }}>
                <Search size={10} color={lp.textFaint} />
                Ask anything about your data...
              </div>
            </div>}
          </div>

          {/* Gated overlay — requires signup to access full demo */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "65%", background: `linear-gradient(to top, ${lpMode === "dark" ? "#0d0f14" : "#f7f8fa"} 10%, ${lpMode === "dark" ? "#0d0f14cc" : "#f7f8facc"} 40%, transparent 100%)`, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 32, zIndex: 10 }}>
            <div style={{ textAlign: "center" }}>
              <div className="fos-gate-lock" style={{ margin: "0 auto 12px", justifyContent: "center" }}>
                <Lock size={10} />Secure Access Required
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: lp.text, marginBottom: 6 }}>See the full platform in action</div>
              <div style={{ fontSize: 12, color: lp.textDim, marginBottom: 16, maxWidth: 340, margin: "0 auto 16px" }}>Create an account with your work email to access the interactive demo. Your data is protected by SOC 2 compliant infrastructure.</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="fos-cta-primary" onClick={() => setAuthModal("signup")} style={{ fontSize: 13, padding: "12px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${lp.gradFrom}, ${lp.gradTo})`, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: `0 6px 24px ${lp.accent}30` }}>Create Free Account</button>
                <button className="fos-cta-secondary" onClick={() => setDemoModal(true)} style={{ fontSize: 13, padding: "12px 24px", borderRadius: 10, border: `1px solid ${lp.border}`, background: lpMode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", color: lp.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Schedule a Call</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Connector — data flow pulse */}
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: `${lp.purple}25`, border: `2px solid ${lp.purple}40`, animation: "fosFlowPulse 2s ease-in-out infinite" }} />
          <div style={{ width: 1.5, height: 32, background: `linear-gradient(180deg, ${lp.purple}25, ${lp.accent}15, transparent)` }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: `${lp.accent}25`, border: `2px solid ${lp.accent}40`, animation: "fosFlowPulse 2s ease-in-out 1s infinite" }} />
        </div>
      </div>

      {/* ═══ Connected Platforms — Animated Logo Carousel ═══ */}
      <div style={{ textAlign: "center", padding: isMobile ? "32px 20px 10px" : "60px 48px 10px", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Ambient glow behind carousel */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse, ${lp.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 24, background: `linear-gradient(135deg, ${lp.purple}0c, ${lp.accent}06)`, border: `1px solid ${lp.purple}18`, fontSize: 10, fontWeight: 700, color: lp.purple, marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <Plug size={12} color={lp.purple} strokeWidth={2.5} />Integrations
        </div>
        <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10, color: lp.text }}>40+ enterprise connectors</h2>
        <p style={{ fontSize: 16, color: lp.textDim, maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.7 }}>ERP, CRM, HRIS, billing, data warehouses, and AI — all connected with bi-directional sync.</p>

        {/* Infinite scrolling logo carousel — Row 1: ERP, CRM, Billing */}
        <div style={{ overflow: "hidden", position: "relative", marginBottom: 12 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(90deg, ${lp.bg}, transparent)`, zIndex: 2 }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(270deg, ${lp.bg}, transparent)`, zIndex: 2 }} />
          <div className="fos-scroll-row1" style={{ display: "flex", gap: 14, animation: "fosScrollLeft 50s linear infinite", width: "max-content" }}>
            {[...Array(2)].map((_, dup) => [
              { name: "NetSuite", logo: "https://cdn.simpleicons.org/netsuite/1B3D6D", desc: "ERP — GL, AP/AR, inventory, consolidation", color: "#1B3D6D", tag: "ERP" },
              { name: "SAP", logo: "https://cdn.simpleicons.org/sap/0FAAFF", desc: "Enterprise resource planning & financials", color: "#0FAAFF", tag: "ERP" },
              { name: "Salesforce", logo: "https://cdn.simpleicons.org/salesforce/00A1E0", desc: "CRM & revenue pipeline data", color: "#00A1E0", tag: "CRM" },
              { name: "Stripe", logo: "https://cdn.simpleicons.org/stripe/635BFF", desc: "Payment processing & billing automation", color: "#635BFF", tag: "BILLING" },
              { name: "Workday", logo: "https://cdn.simpleicons.org/workday/F68D2E", desc: "HRIS, payroll & workforce planning", color: "#F68D2E", tag: "HRIS" },
              { name: "QuickBooks", logo: "https://cdn.simpleicons.org/quickbooks/2CA01C", desc: "GL, AP/AR & journal entries", color: "#2CA01C", tag: "ERP" },
              { name: "Sage", logo: "https://cdn.simpleicons.org/sage/00DC00", desc: "Cloud accounting & multi-entity", color: "#00DC00", tag: "ERP" },
              { name: "Zuora", logo: "https://cdn.simpleicons.org/zuora/2E2E38", desc: "Subscription billing & revenue recognition", color: "#2E2E38", tag: "BILLING" },
              { name: "HubSpot", logo: "https://cdn.simpleicons.org/hubspot/FF7A59", desc: "Marketing & sales pipeline data", color: "#FF7A59", tag: "CRM" },
              { name: "Xero", logo: "https://cdn.simpleicons.org/xero/13B5EA", desc: "Cloud accounting & invoicing", color: "#13B5EA", tag: "ERP" },
              { name: "Plaid", logo: "https://cdn.simpleicons.org/plaid/000000", desc: "Bank account & transaction data", color: "#111111", tag: "BANKING" },
              { name: "Anthropic", logo: "https://cdn.simpleicons.org/anthropic/D4A574", desc: "AI reasoning & Copilot engine", color: "#D4A574", featured: true, tag: "AI" },
              { name: "Ramp", logo: "https://cdn.simpleicons.org/ramp/3ECF8E", desc: "Corporate card & expense data", color: "#3ECF8E", tag: "EXPENSE" },
              { name: "Dynamics 365", logo: "https://cdn.simpleicons.org/dynamics365/002050", desc: "Microsoft ERP & business central", color: "#002050", tag: "ERP" },
            ].map((item, i) => (
              <div key={`${dup}-${item.name}`} className="fos-logo-card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderRadius: 14, background: lpMode === "dark" ? `linear-gradient(135deg, rgba(16,19,26,0.8), rgba(16,19,26,0.5))` : `linear-gradient(135deg, rgba(248,249,251,0.95), rgba(255,255,255,0.8))`, border: `1px solid ${item.featured ? `${lp.purple}30` : lp.border}`, backdropFilter: "blur(12px)", flexShrink: 0, minWidth: 195, cursor: "default", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)", position: "relative" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.color}50`; e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}15`; e.currentTarget.querySelector(".fos-logo-desc").style.opacity = "1"; e.currentTarget.querySelector(".fos-logo-desc").style.transform = "translateY(0)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = item.featured ? `${lp.purple}30` : lp.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.querySelector(".fos-logo-desc").style.opacity = "0"; e.currentTarget.querySelector(".fos-logo-desc").style.transform = "translateY(4px)"; }}
              >
                <img src={item.logo} alt={item.name} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain", flexShrink: 0, background: `${item.color}12`, padding: 4 }} loading="lazy" onError={e => { e.target.onerror = null; e.target.style.display = "none"; const fb = document.createElement("div"); fb.style.cssText = `width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,${item.color}25,${item.color}10);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:${item.color};flex-shrink:0;letter-spacing:-0.02em;border:1px solid ${item.color}20;text-shadow:0 1px 2px rgba(0,0,0,0.1)`; fb.textContent = item.name[0]; e.target.parentElement.insertBefore(fb, e.target); }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: lp.text, lineHeight: 1.2 }}>{item.name}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: item.featured ? lp.purple : lp.textFaint, letterSpacing: "0.05em", marginTop: 1 }}>{item.featured ? "AI PARTNER" : item.tag}</div>
                </div>
                <div className="fos-logo-desc" style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%) translateY(4px)", background: lpMode === "dark" ? "#1a1f2e" : "#1a1f2e", color: "#eef0f6", padding: "6px 12px", borderRadius: 8, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", opacity: 0, transition: "all 0.2s ease", zIndex: 20, pointerEvents: "none" }}>
                  {item.desc}
                </div>
              </div>
            ))).flat()}
          </div>
        </div>

        {/* Row 2 — Data, HRIS, Ops (reverse direction) */}
        <div style={{ overflow: "hidden", position: "relative", marginBottom: 12 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(90deg, ${lp.bg}, transparent)`, zIndex: 2 }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(270deg, ${lp.bg}, transparent)`, zIndex: 2 }} />
          <div className="fos-scroll-row2" style={{ display: "flex", gap: 14, animation: "fosScrollRight 45s linear infinite", width: "max-content" }}>
            {[...Array(2)].map((_, dup) => [
              { name: "Snowflake", logo: "https://cdn.simpleicons.org/snowflake/29B5E8", desc: "Cloud data warehouse & analytics", color: "#29B5E8", tag: "DATA" },
              { name: "Databricks", logo: "https://cdn.simpleicons.org/databricks/FF3621", desc: "Data lakehouse & ML platform", color: "#FF3621", tag: "DATA" },
              { name: "Rippling", logo: "https://cdn.simpleicons.org/rippling/FDE74B", desc: "HRIS, payroll & headcount data", color: "#FDE74B", tag: "HRIS" },
              { name: "ADP", logo: "https://cdn.simpleicons.org/adp/D0271D", desc: "Payroll & workforce management", color: "#D0271D", tag: "HRIS" },
              { name: "BambooHR", logo: "https://cdn.simpleicons.org/bamboo/73C41D", desc: "HRIS & employee lifecycle data", color: "#73C41D", tag: "HRIS" },
              { name: "Brex", logo: "https://cdn.simpleicons.org/brex/F5A623", desc: "Corporate cards & cash management", color: "#F5A623", tag: "EXPENSE" },
              { name: "Slack", logo: "https://cdn.simpleicons.org/slack/4A154B", desc: "Alerts, approvals & team messaging", color: "#4A154B", tag: "COMMS" },
              { name: "AWS", logo: "https://cdn.simpleicons.org/amazonaws/FF9900", desc: "Cloud infrastructure & compute", color: "#FF9900", tag: "CLOUD" },
              { name: "DocuSign", logo: "https://cdn.simpleicons.org/docusign/4088FF", desc: "Contract & eSignature workflows", color: "#4088FF", tag: "ESIGN" },
              { name: "Gusto", logo: "https://cdn.simpleicons.org/gusto/F45D48", desc: "Payroll, benefits & HR platform", color: "#F45D48", tag: "HRIS" },
              { name: "Mercury", logo: "https://cdn.simpleicons.org/mercury/5A2FBA", desc: "Business banking & treasury", color: "#5A2FBA", tag: "BANKING" },
              { name: "BigQuery", logo: "https://cdn.simpleicons.org/googlebigquery/669DF6", desc: "Google Cloud data warehouse", color: "#669DF6", tag: "DATA" },
              { name: "Intercom", logo: "https://cdn.simpleicons.org/intercom/1F8DED", desc: "Customer support & engagement", color: "#1F8DED", tag: "SUPPORT" },
            ].map((item, i) => (
              <div key={`${dup}-${item.name}`} className="fos-logo-card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderRadius: 14, background: lpMode === "dark" ? `linear-gradient(135deg, rgba(16,19,26,0.8), rgba(16,19,26,0.5))` : `linear-gradient(135deg, rgba(248,249,251,0.95), rgba(255,255,255,0.8))`, border: `1px solid ${lp.border}`, backdropFilter: "blur(12px)", flexShrink: 0, minWidth: 195, cursor: "default", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)", position: "relative" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.color}50`; e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}15`; e.currentTarget.querySelector(".fos-logo-desc").style.opacity = "1"; e.currentTarget.querySelector(".fos-logo-desc").style.transform = "translateY(0)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.querySelector(".fos-logo-desc").style.opacity = "0"; e.currentTarget.querySelector(".fos-logo-desc").style.transform = "translateY(4px)"; }}
              >
                <img src={item.logo} alt={item.name} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain", flexShrink: 0, background: `${item.color}12`, padding: 4 }} loading="lazy" onError={e => { e.target.onerror = null; e.target.style.display = "none"; const fb = document.createElement("div"); fb.style.cssText = `width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,${item.color}25,${item.color}10);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:${item.color};flex-shrink:0;letter-spacing:-0.02em;border:1px solid ${item.color}20;text-shadow:0 1px 2px rgba(0,0,0,0.1)`; fb.textContent = item.name[0]; e.target.parentElement.insertBefore(fb, e.target); }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: lp.text, lineHeight: 1.2 }}>{item.name}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: lp.textFaint, letterSpacing: "0.05em", marginTop: 1 }}>{item.tag}</div>
                </div>
                <div className="fos-logo-desc" style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%) translateY(4px)", background: "#1a1f2e", color: "#eef0f6", padding: "6px 12px", borderRadius: 8, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", opacity: 0, transition: "all 0.2s ease", zIndex: 20, pointerEvents: "none" }}>
                  {item.desc}
                </div>
              </div>
            ))).flat()}
          </div>
        </div>

        {/* Row 3 — Infrastructure, BI, Market Data */}
        <div style={{ overflow: "hidden", position: "relative", marginBottom: 28 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(90deg, ${lp.bg}, transparent)`, zIndex: 2 }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(270deg, ${lp.bg}, transparent)`, zIndex: 2 }} />
          <div className="fos-scroll-row3" style={{ display: "flex", gap: 14, animation: "fosScrollLeft 55s linear infinite", width: "max-content" }}>
            {[...Array(2)].map((_, dup) => [
              { name: "Supabase", logo: "https://cdn.simpleicons.org/supabase/3ECF8E", desc: "Database, auth & real-time sync", color: "#3ECF8E", tag: "DATABASE" },
              { name: "Vercel", logo: "https://cdn.simpleicons.org/vercel/000000", desc: "Edge hosting & CI/CD", color: "#111111", tag: "HOSTING" },
              { name: "Cloudflare", logo: "https://cdn.simpleicons.org/cloudflare/F48120", desc: "Security, CDN & DDoS protection", color: "#F48120", tag: "SECURITY" },
              { name: "Tableau", logo: "https://cdn.simpleicons.org/tableau/E97627", desc: "Business intelligence & dashboards", color: "#E97627", tag: "BI" },
              { name: "Power BI", logo: "https://cdn.simpleicons.org/powerbi/F2C811", desc: "Microsoft analytics & reporting", color: "#F2C811", tag: "BI" },
              { name: "S&P Global", logo: "https://cdn.simpleicons.org/standardandpoors/0033A0", desc: "Market data & benchmarks", color: "#0033A0", tag: "MARKET DATA" },
              { name: "FactSet", logo: "https://cdn.simpleicons.org/factset/1679C4", desc: "Financial data & analytics", color: "#1679C4", tag: "MARKET DATA" },
              { name: "Morningstar", logo: "https://cdn.simpleicons.org/morningstar/FC5301", desc: "Investment research & ratings", color: "#FC5301", tag: "RESEARCH" },
              { name: "Square", logo: "https://cdn.simpleicons.org/square/3E4348", desc: "POS & payment data", color: "#3E4348", tag: "PAYMENTS" },
              { name: "Gmail", logo: "https://cdn.simpleicons.org/gmail/EA4335", desc: "Email notifications & alerts", color: "#EA4335", tag: "EMAIL" },
              { name: "Calendly", logo: "https://cdn.simpleicons.org/calendly/006BFF", desc: "Meeting scheduling & booking", color: "#006BFF", tag: "SCHEDULING" },
              { name: "Linear", logo: "https://cdn.simpleicons.org/linear/5E6AD2", desc: "Project tracking & sprint data", color: "#5E6AD2", tag: "PROJECTS" },
            ].map((item, i) => (
              <div key={`${dup}-${item.name}`} className="fos-logo-card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderRadius: 14, background: lpMode === "dark" ? `linear-gradient(135deg, rgba(16,19,26,0.8), rgba(16,19,26,0.5))` : `linear-gradient(135deg, rgba(248,249,251,0.95), rgba(255,255,255,0.8))`, border: `1px solid ${lp.border}`, backdropFilter: "blur(12px)", flexShrink: 0, minWidth: 195, cursor: "default", transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)", position: "relative" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.color}50`; e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}15`; e.currentTarget.querySelector(".fos-logo-desc").style.opacity = "1"; e.currentTarget.querySelector(".fos-logo-desc").style.transform = "translateY(0)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.querySelector(".fos-logo-desc").style.opacity = "0"; e.currentTarget.querySelector(".fos-logo-desc").style.transform = "translateY(4px)"; }}
              >
                <img src={item.logo} alt={item.name} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain", flexShrink: 0, background: `${item.color}12`, padding: 4 }} loading="lazy" onError={e => { e.target.onerror = null; e.target.style.display = "none"; const fb = document.createElement("div"); fb.style.cssText = `width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,${item.color}25,${item.color}10);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:${item.color};flex-shrink:0;letter-spacing:-0.02em;border:1px solid ${item.color}20;text-shadow:0 1px 2px rgba(0,0,0,0.1)`; fb.textContent = item.name[0]; e.target.parentElement.insertBefore(fb, e.target); }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: lp.text, lineHeight: 1.2 }}>{item.name}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: lp.textFaint, letterSpacing: "0.05em", marginTop: 1 }}>{item.tag}</div>
                </div>
                <div className="fos-logo-desc" style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%) translateY(4px)", background: "#1a1f2e", color: "#eef0f6", padding: "6px 12px", borderRadius: 8, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", opacity: 0, transition: "all 0.2s ease", zIndex: 20, pointerEvents: "none" }}>
                  {item.desc}
                </div>
              </div>
            ))).flat()}
          </div>
        </div>

        {/* Carousel animation keyframes */}
        <style>{`
          @keyframes fosScrollLeft{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
          @keyframes fosScrollRight{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
          .fos-scroll-row1:hover,.fos-scroll-row2:hover,.fos-scroll-row3:hover{animation-play-state:paused}
          @keyframes fosFlowDot{0%{transform:translateX(-100%);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(200%);opacity:0}}
          @keyframes fosFlowPulse{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
          @keyframes fosOrbFloat{0%{transform:translate(0,0) scale(1)}33%{transform:translate(8px,-12px) scale(1.1)}66%{transform:translate(-6px,8px) scale(0.95)}100%{transform:translate(0,0) scale(1)}}
          @keyframes fosDataStream{0%{stroke-dashoffset:20}100%{stroke-dashoffset:0}}
          @keyframes fosNodePing{0%{box-shadow:0 0 0 0 rgba(96,165,250,0.4)}70%{box-shadow:0 0 0 10px rgba(96,165,250,0)}100%{box-shadow:0 0 0 0 rgba(96,165,250,0)}}
          @keyframes fosBeamSweep{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
          .fos-flow-dot{animation:fosFlowDot 3s ease-in-out infinite}
          .fos-node-ping{animation:fosNodePing 2s ease-in-out infinite}
        `}</style>

        {/* ═══ Data Pipeline Visualization — animated flow from integrations to FinanceOS ═══ */}
        {(() => { const [pipeRef, pipeVis] = useScrollReveal(0.15); return (
        <div ref={pipeRef} style={{ padding: "32px 0 16px", maxWidth: 800, margin: "0 auto", position: "relative", opacity: pipeVis ? 1 : 0, transform: pipeVis ? "translateY(0)" : "translateY(16px)", transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, position: "relative" }}>
            {/* Left — Data Sources */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              {[
                { label: "ERP · CRM", color: lp.accent, delay: "0s" },
                { label: "HRIS · Payroll", color: lp.green, delay: "0.8s" },
                { label: "Billing · Banking", color: lp.purple, delay: "1.6s" },
              ].map((src, i) => (
                <div key={src.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: src.color, textTransform: "uppercase", letterSpacing: "0.06em", opacity: pipeVis ? 1 : 0, animation: pipeVis ? `fosStaggerLeft 0.4s ease-out ${0.2 + i * 0.1}s both` : "none" }}>{src.label}</span>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: `${src.color}30`, border: `2px solid ${src.color}60`, animation: pipeVis ? `fosFlowPulse 2s ease-in-out ${src.delay} infinite` : "none" }} />
                </div>
              ))}
            </div>

            {/* Left Pipeline Lines */}
            <div style={{ width: 60, position: "relative", height: 80 }}>
              <svg width="60" height="80" viewBox="0 0 60 80" style={{ position: "absolute", inset: 0 }}>
                <path d="M0,12 Q30,12 55,40" stroke={`${lp.accent}30`} strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                <path d="M0,40 L55,40" stroke={`${lp.green}30`} strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                <path d="M0,68 Q30,68 55,40" stroke={`${lp.purple}30`} strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
              </svg>
              {/* Animated flowing dots */}
              {pipeVis && [lp.accent, lp.green, lp.purple].map((c, i) => (
                <div key={i} style={{ position: "absolute", top: i === 0 ? 8 : i === 1 ? 36 : 64, left: 0, width: 6, height: 6, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}60`, animation: `fosFlowDot 2.5s ease-in-out ${i * 0.6}s infinite` }} />
              ))}
            </div>

            {/* Center — FinanceOS Hub */}
            <div className="fos-node-ping" style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${lp.accent}15, ${lp.purple}10)`, border: `2px solid ${lp.accent}30`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 3 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${lp.accent}, ${lp.purple})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>F</span>
              </div>
              <span style={{ fontSize: 7, fontWeight: 800, color: lp.accent, letterSpacing: "0.04em" }}>ENGINE</span>
              {/* Orbiting particles */}
              {pipeVis && [0, 120, 240].map((deg, i) => (
                <div key={i} style={{ position: "absolute", width: 5, height: 5, borderRadius: "50%", background: [lp.accent, lp.green, lp.purple][i], boxShadow: `0 0 6px ${[lp.accent, lp.green, lp.purple][i]}80`, animation: `fosOrbFloat ${3 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`, top: i === 0 ? -6 : i === 1 ? "50%" : "auto", bottom: i === 2 ? -6 : "auto", left: i === 1 ? -6 : i === 0 ? "50%" : "auto", right: i === 2 ? "50%" : "auto" }} />
              ))}
            </div>

            {/* Right Pipeline Lines */}
            <div style={{ width: 60, position: "relative", height: 80 }}>
              <svg width="60" height="80" viewBox="0 0 60 80" style={{ position: "absolute", inset: 0 }}>
                <path d="M5,40 Q30,12 60,12" stroke={`${lp.green}30`} strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                <path d="M5,40 L60,40" stroke={`${lp.accent}30`} strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                <path d="M5,40 Q30,68 60,68" stroke={`${lp.purple}30`} strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
              </svg>
              {pipeVis && [lp.green, lp.accent, lp.purple].map((c, i) => (
                <div key={i} style={{ position: "absolute", top: i === 0 ? 8 : i === 1 ? 36 : 64, left: 0, width: 6, height: 6, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}60`, animation: `fosFlowDot 2.5s ease-in-out ${1.2 + i * 0.6}s infinite` }} />
              ))}
            </div>

            {/* Right — Outputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
              {[
                { label: "Forecasts · Plans", color: lp.green, delay: "0.4s" },
                { label: "Alerts · Reports", color: lp.accent, delay: "1.2s" },
                { label: "Scenarios · Models", color: lp.purple, delay: "2s" },
              ].map((out, i) => (
                <div key={out.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: `${out.color}30`, border: `2px solid ${out.color}60`, animation: pipeVis ? `fosFlowPulse 2s ease-in-out ${out.delay} infinite` : "none" }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: out.color, textTransform: "uppercase", letterSpacing: "0.06em", opacity: pipeVis ? 1 : 0, animation: pipeVis ? `fosFadeSlideUp 0.4s ease-out ${0.3 + i * 0.1}s both` : "none" }}>{out.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Pipeline label */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: lp.textFaint, textTransform: "uppercase", letterSpacing: "0.1em" }}>Real-time bi-directional sync · {'<'} 5 minute latency</span>
          </div>
        </div>
        ); })()}

        {/* Trust badges + ratings */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
          {[
            { label: "SOC 2 Type II", icon: Shield, color: lp.green },
            { label: "AES-256 Encryption", icon: Lock, color: lp.accent },
            { label: "99.99% Uptime SLA", icon: Zap, color: lp.purple },
            { label: "GDPR Ready", icon: Globe, color: lp.green },
          ].map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 600, color: lp.textDim, padding: "8px 16px", borderRadius: 10, background: lpMode === "dark" ? "rgba(16,19,26,0.7)" : "rgba(248,249,251,0.9)", border: `1px solid ${lp.border}`, backdropFilter: "blur(8px)", transition: "all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${b.color}30`}
              onMouseLeave={e => e.currentTarget.style.borderColor = lp.border}
            >
              <b.icon size={12} color={b.color} /> {b.label}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: lp.gold, padding: "8px 16px", borderRadius: 10, background: `${lp.gold}08`, border: `1px solid ${lp.gold}18` }}>
            <Star size={12} fill={lp.gold} color={lp.gold} /> 4.9 Rating
          </div>
        </div>
      </div>

      {/* Section Connector — integration to social proof */}
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
        <div style={{ position: "relative", width: 2, height: 40 }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent, ${lp.green}18, transparent)`, borderRadius: 1 }} />
          <div style={{ position: "absolute", width: 2, height: 10, background: `linear-gradient(180deg, ${lp.green}60, ${lp.green}00)`, borderRadius: 1, animation: "fosFlowDown 2.5s ease-in-out 0.5s infinite" }} />
        </div>
      </div>

      {/* ═══ SOCIAL PROOF — Premium testimonial section ═══ */}
      <div style={{ padding: isMobile ? "20px 20px 40px" : "48px 48px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: `${lp.accent}0a`, border: `1px solid ${lp.accent}18`, fontSize: 10, fontWeight: 700, color: lp.accent, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>Customer Stories</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", color: lp.text }}>Trusted by modern finance teams</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: 0, borderRadius: 24, overflow: "hidden", border: `1px solid ${lp.border}`, background: lpMode === "dark" ? "linear-gradient(135deg, #10131a, #0d0f14)" : "linear-gradient(135deg, #f8f9fb, #ffffff)", boxShadow: lpMode === "dark" ? "0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(96,165,250,0.04)" : "0 24px 64px rgba(0,0,0,0.06)", transition: "box-shadow 0.3s ease" }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = lpMode === "dark" ? `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${lp.accent}10` : `0 32px 80px rgba(0,0,0,0.08)`}
          onMouseLeave={e => e.currentTarget.style.boxShadow = lpMode === "dark" ? "0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(96,165,250,0.04)" : "0 24px 64px rgba(0,0,0,0.06)"}
        >
          {/* Photo side */}
          <div style={{ position: "relative", minHeight: 360, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80&fit=crop&crop=faces" alt="Finance team collaborating" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block", transition: "transform 0.6s ease" }} loading="lazy"
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, transparent 40%, ${lpMode === "dark" ? "rgba(16,19,26,0.95)" : "rgba(248,249,251,0.92)"} 100%)` }} />
            {/* Floating metric cards on image */}
            <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, display: "flex", gap: 8 }}>
              {[
                { val: "80%", label: "Faster Close", color: lp.accent },
                { val: "3wk", label: "Saved/Qtr", color: lp.green },
                { val: "4.9", label: "Rating", color: lp.gold },
              ].map(m => (
                <div key={m.label} style={{ flex: 1, padding: "10px 8px", borderRadius: 10, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{m.val}</div>
                  <div style={{ fontSize: 7, fontWeight: 700, color: m.color, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Quote side */}
          <div style={{ padding: isMobile ? "28px 24px" : "44px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <Star key={i} size={14} fill={lp.gold} color={lp.gold} />)}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: lp.textFaint }}>5.0</span>
            </div>
            <div style={{ fontSize: 48, color: `${lp.accent}15`, fontWeight: 800, lineHeight: 0.8, marginBottom: 4, fontFamily: "Georgia, serif" }}>"</div>
            <p style={{ fontSize: 18, fontWeight: 500, color: lp.text, lineHeight: 1.7, marginBottom: 28, letterSpacing: "-0.01em" }}>
              FinanceOS replaced three tools and cut our month-end close by 12 days. The AI Copilot doesn't just answer questions — it shows the reasoning behind every insight, so our team trusts the data.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${lp.accent}, ${lp.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", boxShadow: `0 4px 12px ${lp.accent}30` }}>SC</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: lp.text }}>Sarah Chen</div>
                <div style={{ fontSize: 12, color: lp.textDim }}>VP of Finance</div>
                <div style={{ fontSize: 10, color: lp.textFaint, marginTop: 2 }}>Series C SaaS · $45M ARR · 12-person finance team</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${lp.border}40` }}>
              {["Replaced 3 tools", "12-day close reduction", "95% faster reporting"].map(t => (
                <span key={t} style={{ fontSize: 9, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: `${lp.green}08`, border: `1px solid ${lp.green}15`, color: lp.green }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Agent Showcase — Pigment-style split panels */}
      <div style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: `${lp.accent}0a`, border: `1px solid ${lp.accent}18`, fontSize: 10, fontWeight: 700, color: lp.accent, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>AI Agents</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
            {[
              { Icon: Brain, color: lp.accent },
              { Icon: GitBranch, color: lp.green },
              { Icon: Sparkles, color: lp.purple },
            ].map(({ Icon, color }, i) => (
              <div key={i} className="fos-float" style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg, ${color}12, ${color}06)`, border: `1px solid ${color}20`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", cursor: "default", animationDelay: `${i * 0.3}s`, boxShadow: `0 4px 16px ${color}10` }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px) scale(1.12)"; e.currentTarget.style.boxShadow = `0 12px 28px ${color}20`; e.currentTarget.style.borderColor = `${color}40`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 16px ${color}10`; e.currentTarget.style.borderColor = `${color}20`; }}
              ><Icon size={20} color={color} /></div>
            ))}
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10, color: lp.text }}>AI that <span className="fos-gradient-text" style={{ display: "inline" }}>plans with you</span></h2>
          <p style={{ fontSize: 15, color: lp.textDim, maxWidth: 520, margin: "0 auto" }}>FinanceOS AI agents operate inside your planning environment, using your live data and business logic to support decisions in real time.</p>
        </div>

        {/* Agent 1: Copilot */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: 24, marginBottom: 32, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: lp.purple, padding: "5px 14px", borderRadius: 20, background: `${lp.purple}08`, border: `1px solid ${lp.purple}18`, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: lp.purple, animation: "pulse 2s infinite" }} />
              AI Copilot
            </div>
            <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.15, color: lp.text }}>Real-time insights to accelerate decisions</h3>
            <p style={{ fontSize: 14, color: lp.textDim, lineHeight: 1.7, marginBottom: 16 }}>Proactively scans your metrics, uncovers key trends, flags anomalies, and explains the "why" behind every variance — with visible reasoning.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Variance Detection", "Forecasting", "Scenario Planning"].map(t => (
                <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "5px 12px", borderRadius: 8, background: `${lp.purple}08`, border: `1px solid ${lp.purple}18`, color: lp.purple }}>{t}</span>
              ))}
            </div>
          </div>
          {/* Interactive mockup */}
          <div style={{ background: lp.surface, border: `1px solid ${lp.border}`, borderRadius: 16, padding: "20px 22px", boxShadow: `0 16px 48px ${lpMode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.06)"}`, transition: "box-shadow 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 60px ${lp.accent}12`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = `0 16px 48px ${lpMode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.06)"}`}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "8px 12px", background: lp.surfaceAlt, borderRadius: 10, border: `1px solid ${lp.borderLight}` }}>
              <Brain size={14} color={lp.purple} />
              <span style={{ fontSize: 11, fontWeight: 700, color: lp.text }}>AI Copilot</span>
              <span style={{ fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: `${lp.purple}12`, color: lp.purple, marginLeft: "auto" }}>Claude</span>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 10, background: `${lp.accent}06`, border: `1px solid ${lp.accent}12`, fontSize: 12, color: lp.textDim, marginBottom: 8 }}>
              "Can you analyze our current revenue growth and highlight the top contributors?"
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 10, background: lp.surfaceAlt, border: `1px solid ${lp.border}`, fontSize: 12, color: lp.textSub, lineHeight: 1.6, marginBottom: 8 }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: lp.green, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: lp.green, animation: "fosPulseGlow 2s ease-in-out infinite" }} />
                Thought & work process →
              </div>
              Revenue grew <span style={{ color: lp.accent, fontWeight: 700, animation: "fosCountUp 0.6s ease-out 0.3s both" }}>+44.7% YoY</span> to $51.2M. Enterprise expansion drove <span style={{ color: lp.green, fontWeight: 700, animation: "fosCountUp 0.6s ease-out 0.5s both" }}>68%</span> of the beat. AI module attach rate hit <span style={{ color: lp.gold, fontWeight: 700, animation: "fosCountUp 0.6s ease-out 0.7s both" }}>42%</span>, up from 28%.
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: 9, padding: "5px 12px", borderRadius: 6, background: `${lp.accent}08`, border: `1px solid ${lp.accent}14`, color: lp.accent, cursor: "pointer", transition: "all 0.2s" }}>Drill into segments</span>
              <span style={{ fontSize: 9, padding: "5px 12px", borderRadius: 6, background: `${lp.purple}08`, border: `1px solid ${lp.purple}14`, color: lp.purple, cursor: "pointer", transition: "all 0.2s" }}>Build forecast</span>
            </div>
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: lp.inputBg, border: `1px solid ${lp.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: lp.textFaint }}>Ask or build anything...</span>
              <span className="fos-cursor-blink" style={{ width: 2, height: 14, background: lp.accent, borderRadius: 1, marginLeft: 2 }} />
              <span style={{ marginLeft: "auto", fontSize: 10, color: lp.textFaint, fontFamily: "'JetBrains Mono', monospace", padding: "2px 6px", borderRadius: 4, background: `${lp.textFaint}10`, border: `1px solid ${lp.textFaint}15` }}>⌘K</span>
            </div>
          </div>
        </div>

        {/* Agent 2: Scenario Modeler */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 24, marginBottom: 32, alignItems: "center" }}>
          {/* Interactive mockup */}
          <div style={{ background: lp.surface, border: `1px solid ${lp.border}`, borderRadius: 16, padding: "20px 22px", boxShadow: `0 16px 48px ${lpMode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.06)"}`, order: isMobile ? 1 : 0, transition: "box-shadow 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 60px ${lp.green}12`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = `0 16px 48px ${lpMode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.06)"}`}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: lp.text, marginBottom: 14 }}>Scenario Comparison</div>
            {[
              { name: "Base Case", rev: "$62.8M", ebitda: "7.4%", color: lp.accent, width: 75 },
              { name: "AI Breakout", rev: "$68.4M", ebitda: "11.6%", color: lp.green, width: 82 },
              { name: "Aggressive Hire", rev: "$62.8M", ebitda: "2.8%", color: lp.gold, width: 75 },
              { name: "Mid-Market", rev: "$66.1M", ebitda: "9.5%", color: lp.purple, width: 79 },
            ].map(s => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ width: 90, fontSize: 10, color: lp.textDim, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</span>
                <div style={{ flex: 1, height: 20, background: lp.surfaceAlt, borderRadius: 6, overflow: "hidden", border: `1px solid ${lp.borderLight}` }}>
                  <div className="fos-scenario-bar" style={{ width: `${s.width}%`, height: "100%", background: `linear-gradient(90deg, ${s.color}60, ${s.color})`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)", transformOrigin: "left", animation: "fosBarGrow 1.2s ease-out both" }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", fontFamily: "'JetBrains Mono', monospace", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{s.rev}</span>
                  </div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: parseFloat(s.ebitda) > 5 ? lp.green : lp.gold, fontFamily: "'JetBrains Mono', monospace", width: 36, textAlign: "right" }}>{s.ebitda}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 9, color: lp.textFaint, paddingTop: 8, borderTop: `1px solid ${lp.border}` }}>
              <span>Revenue →</span><span style={{ marginLeft: "auto" }}>EBITDA margin</span>
            </div>
          </div>
          <div style={{ order: isMobile ? 0 : 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: lp.green, padding: "5px 14px", borderRadius: 20, background: `${lp.green}08`, border: `1px solid ${lp.green}18`, marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: lp.green, animation: "pulse 2s infinite 0.5s" }} />
              Scenario Modeler
            </div>
            <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.15, color: lp.text }}>Explore every possibility</h3>
            <p style={{ fontSize: 14, color: lp.textDim, lineHeight: 1.7, marginBottom: 16 }}>Simulate scenarios in real time and receive clear, actionable recommendations based on your data, models, and business context.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["What-If Analysis", "Sensitivity", "Monte Carlo"].map(t => (
                <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "5px 12px", borderRadius: 8, background: `${lp.green}08`, border: `1px solid ${lp.green}18`, color: lp.green }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Use Case Tabs — Pigment-style */}
      <div style={{ padding: isMobile ? "20px 20px 40px" : "20px 48px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16, color: lp.text }}>Planning across every function, in one place</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 24 }}>
          {[
            { label: "Finance", Icon: DollarSign, active: true },
            { label: "Sales", Icon: Target, active: false },
            { label: "HR", Icon: Users, active: false },
            { label: "Supply", Icon: Layers, active: false },
          ].map(tab => (
            <button key={tab.label} onClick={() => {}} style={{
              fontSize: 12, fontWeight: 700, padding: "8px 20px", borderRadius: 10, border: `1px solid ${tab.active ? `${lp.accent}25` : "transparent"}`, cursor: "pointer", fontFamily: "inherit",
              background: tab.active ? `${lp.accent}10` : "transparent", color: tab.active ? lp.accent : lp.textDim,
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
            }}><tab.Icon size={14} /> {tab.label}</button>
          ))}
        </div>
        {/* Active tab content — corporate portfolio style */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.8fr", gap: 0, background: lpMode === "dark" ? "linear-gradient(135deg, #10131a, #0d0f14)" : "linear-gradient(135deg, #f8f9fb, #ffffff)", border: `1px solid ${lp.border}`, borderRadius: 20, overflow: "hidden", boxShadow: lpMode === "dark" ? "0 24px 64px rgba(0,0,0,0.3)" : "0 24px 64px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "36px 32px", borderRight: `1px solid ${lp.border}40` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${lp.accent}10`, border: `1px solid ${lp.accent}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DollarSign size={14} color={lp.accent} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: lp.accent }}>Finance</span>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12, color: lp.text }}>FP&A & consolidation</h3>
            <p style={{ fontSize: 14, color: lp.textDim, lineHeight: 1.7, marginBottom: 20 }}>Build, approve, and adapt integrated financial plans. Connect your ERP, CRM, and billing data into a unified model with AI-powered insights.</p>
            <a href="/use-cases/finance" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: lp.accent, textDecoration: "none", padding: "10px 20px", borderRadius: 10, background: `${lp.accent}08`, border: `1px solid ${lp.accent}15`, transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = `${lp.accent}14`}
              onMouseLeave={e => e.currentTarget.style.background = `${lp.accent}08`}
            >Learn more <ChevronRight size={14} /></a>
            <div style={{ marginTop: 24, padding: "16px 18px", background: `${lp.accent}04`, borderRadius: 12, border: `1px solid ${lp.accent}10`, position: "relative" }}>
              <div style={{ fontSize: 24, color: `${lp.accent}15`, fontWeight: 800, lineHeight: 0.8, marginBottom: 4, fontFamily: "Georgia, serif" }}>"</div>
              <p style={{ fontSize: 13, color: lp.textSub, lineHeight: 1.7, marginBottom: 10 }}>We replaced our entire Excel-based FP&A stack in one afternoon. The AI Copilot caught a $400K variance our team missed.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${lp.accent}, ${lp.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>JR</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: lp.text }}>James Rodriguez, VP Finance</div>
                  <div style={{ fontSize: 9, color: lp.textFaint }}>Series B SaaS · $18M ARR</div>
                </div>
              </div>
            </div>
          </div>
          {/* Corporate portfolio-style dashboard mockup */}
          <div style={{ padding: 20 }}>
            {/* Portfolio header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${lp.border}40` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: lp.accent }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: lp.text }}>Acme Corp — FY2025 Portfolio</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["YTD", "QoQ", "MoM"].map((p, i) => (
                  <span key={p} style={{ fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: i === 0 ? `${lp.accent}12` : "transparent", color: i === 0 ? lp.accent : lp.textFaint, border: `1px solid ${i === 0 ? `${lp.accent}20` : "transparent"}`, cursor: "pointer" }}>{p}</span>
                ))}
              </div>
            </div>
            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
              {[
                { l: "$51.2M", s: "Revenue", d: "+12.3%", c: lp.accent, Icon: TrendingUp },
                { l: "84.7%", s: "Gross Margin", d: "+2.1pp", c: lp.green, Icon: Activity },
                { l: "$3.8M", s: "EBITDA", d: "+$420K", c: lp.purple, Icon: DollarSign },
                { l: "118%", s: "Net Retention", d: "Best-in-class", c: lp.gold || lp.accent, Icon: Target },
              ].map(k => (
                <div key={k.s} style={{ padding: "12px 14px", borderRadius: 12, background: `${k.c}04`, border: `1px solid ${k.c}12`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${k.c}, ${k.c}40)` }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <k.Icon size={10} color={k.c} />
                    <span style={{ fontSize: 8, fontWeight: 700, color: lp.textFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.s}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: lp.text, fontFamily: "'JetBrains Mono', monospace" }}>{k.l}</div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: lp.green }}>{k.d}</span>
                </div>
              ))}
            </div>
            {/* Revenue chart */}
            <div style={{ background: lp.surfaceAlt || lp.surface, borderRadius: 12, border: `1px solid ${lp.border}40`, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: lp.text }}>Revenue vs Budget vs Forecast</span>
                <div style={{ display: "flex", gap: 10, fontSize: 8, color: lp.textFaint }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 10, height: 2, background: lp.accent, borderRadius: 1 }} />Actual</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 10, height: 2, background: lp.textFaint, borderRadius: 1, opacity: 0.5 }} />Budget</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 10, height: 2, background: lp.green, borderRadius: 1 }} />Forecast</span>
                </div>
              </div>
              <svg viewBox="0 0 380 90" style={{ width: "100%", height: 90 }}>
                <defs><linearGradient id="lpPortRev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lp.accent} stopOpacity={0.15} /><stop offset="100%" stopColor={lp.accent} stopOpacity={0} /></linearGradient></defs>
                {[18,36,54,72].map(y => <line key={y} x1="0" y1={y} x2="380" y2={y} stroke={lp.border} strokeWidth="0.5" strokeDasharray="2 6" />)}
                {/* Budget line */}
                <path d="M5,72 L50,68 L95,62 L140,58 L185,52 L230,48 L275,44 L320,40 L365,38" fill="none" stroke={lp.textFaint} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                {/* Forecast line */}
                <path d="M230,30 L275,24 L320,20 L365,16" fill="none" stroke={lp.green} strokeWidth="1.5" strokeDasharray="4 3" />
                {/* Actual line + fill */}
                <path d="M5,72 L50,65 L95,56 L140,48 L185,38 L230,30 L230,90 L185,90 L140,90 L95,90 L50,90 L5,90Z" fill="url(#lpPortRev)" />
                <path d="M5,72 L50,65 L95,56 L140,48 L185,38 L230,30" fill="none" stroke={lp.accent} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="230" cy="30" r="3.5" fill={lp.accent} style={{ filter: `drop-shadow(0 0 6px ${lp.accent})` }} />
              </svg>
            </div>
            {/* Mini entity table */}
            <div style={{ borderRadius: 10, border: `1px solid ${lp.border}40`, overflow: "hidden", fontSize: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 0.8fr 0.6fr", padding: "8px 12px", background: lp.surfaceAlt || lp.surface, borderBottom: `1px solid ${lp.border}40`, fontWeight: 700, color: lp.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 8 }}>
                <span>Entity</span><span style={{ textAlign: "right" }}>Revenue</span><span style={{ textAlign: "right" }}>EBITDA</span><span style={{ textAlign: "right" }}>Margin</span><span style={{ textAlign: "right" }}>Status</span>
              </div>
              {[
                { name: "Acme US", rev: "$38.9M", ebitda: "$3.1M", margin: "8.0%", status: "Closed", sc: lp.green },
                { name: "Acme EU", rev: "$8.6M", ebitda: "$520K", margin: "6.0%", status: "In Review", sc: lp.accent },
                { name: "Acme APAC", rev: "$3.6M", ebitda: "$140K", margin: "3.9%", status: "Pending", sc: lp.gold || lp.accent },
              ].map((e, i) => (
                <div key={e.name} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 0.8fr 0.6fr", padding: "8px 12px", borderBottom: i < 2 ? `1px solid ${lp.border}20` : "none", color: lp.textDim, alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: lp.text }}>{e.name}</span>
                  <span style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{e.rev}</span>
                  <span style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{e.ebitda}</span>
                  <span style={{ textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{e.margin}</span>
                  <span style={{ textAlign: "right" }}><span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: `${e.sc}10`, color: e.sc }}>{e.status}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Target audience — premium pills */}
      <div style={{ textAlign: "center", padding: "28px 48px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {[
            { label: "SaaS companies", detail: "$5M–$200M ARR", Icon: TrendingUp, color: lp.accent },
            { label: "Finance teams", detail: "3–25 people", Icon: Users, color: lp.green },
            { label: "Replaces", detail: "Legacy EPM, spreadsheets, point solutions", Icon: RefreshCw, color: lp.purple },
          ].map(item => (
            <div key={item.detail} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 14, background: lp.cardBg, border: `1px solid ${lp.border}`, backdropFilter: "blur(8px)", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${item.color}30`}
              onMouseLeave={e => e.currentTarget.style.borderColor = lp.border}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${item.color}08`, border: `1px solid ${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <item.Icon size={15} color={item.color} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: lp.text }}>{item.label}</div>
                <div style={{ fontSize: 10, color: lp.textFaint, marginTop: 1 }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ THREE PILLARS — Pigment-style "Designed for decisions" ═══ */}
      <div style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10, color: lp.text }}>Designed for decisions that can't wait</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
          {[
            { title: "Intelligent by design", desc: "AI agents embedded in your planning. Analyze performance, explain drivers, and simulate scenarios in real time.", Icon: Brain, color: lp.purple, features: ["SHAP feature importance", "Confidence intervals", "Visible reasoning chain"] },
            { title: "Collaborative by nature", desc: "Your finance team works as one. Assign tasks, send messages, track activity, and review changes — all inside the platform.", Icon: Users, color: lp.accent, features: ["Team profiles & presence", "Task assignment & tracking", "Channel-based messaging"] },
            { title: "Flexible at scale", desc: "Add entities, scenarios, and team members without rebuilding models. Scale from startup to enterprise.", Icon: Layers, color: lp.green, features: ["Unlimited scenarios", "Multi-entity consolidation", "No seat caps (Enterprise)"] },
          ].map(p => (
            <div key={p.title} style={{ background: lp.cardBg, backdropFilter: "blur(12px)", border: `1px solid ${lp.border}`, borderRadius: 18, padding: "32px 26px", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.color}40`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${p.color}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${p.color}30, transparent)` }} />
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${p.color}08`, border: `1px solid ${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><p.Icon size={22} color={p.color} /></div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: lp.text, marginBottom: 10, letterSpacing: "-0.02em" }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: lp.textDim, lineHeight: 1.7, marginBottom: 18 }}>{p.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: lp.textDim }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, background: `${p.color}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={10} color={p.color} strokeWidth={3} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FULL-WIDTH CORPORATE CTA BREAK — Template Pattern B ═══ */}
      <div style={{ position: "relative", overflow: "hidden", margin: "0 auto", maxWidth: 1200 }}>
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", margin: isMobile ? "0 16px" : "0 48px" }}>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80&fit=crop" alt="Modern corporate office" style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }} loading="lazy" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(6,8,12,0.82), rgba(16,19,26,0.7))" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 32 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10, color: "#fff" }}>Replace 6 tools with one platform</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", maxWidth: 500, marginBottom: 24, lineHeight: 1.65 }}>From budgeting to board decks, FinanceOS consolidates your entire FP&A workflow. Same-day deployment. 96.8% forecast accuracy.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={enterDemo} style={{ fontSize: 13, padding: "12px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Try the Demo ▸</button>
              <a href="https://calendly.com/finance-os-support/30min" target="_blank" rel="noopener" style={{ fontSize: 13, padding: "12px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Book a Demo</a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BUILT FOR EVERY FINANCE ROLE — Personalized dashboards ═══ */}
      <div style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: `${lp.accent}0a`, border: `1px solid ${lp.accent}18`, fontSize: 10, fontWeight: 700, color: lp.accent, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tailored to your role</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10, color: lp.text }}>One platform. Every finance role.</h2>
          <p style={{ fontSize: 15, color: lp.textDim, maxWidth: 540, margin: "0 auto" }}>Every executive sees the KPIs that matter to them. Personalized dashboards are not an add-on — they are how FinanceOS works.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {[
            { role: "CFO", focus: "Revenue, margins, cash flow, ROIC, EPS, dividend yield, board deck export", photo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80&fit=crop&h=280", color: lp.accent, Icon: BarChart3 },
            { role: "CEO", focus: "Strategic KPIs, segment growth, market position, Rule of 40, fundraising readiness", photo: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&fit=crop&h=280", color: lp.purple, Icon: TrendingUp },
            { role: "Controller", focus: "Close progress, reconciliation status, GL summary, AP/AR aging, compliance", photo: "https://images.unsplash.com/photo-1554224155-8f4e-4111-9b47-033e6e1c22d0?w=400&q=80&fit=crop&h=280", color: lp.green, Icon: CheckSquare },
            { role: "FP&A Manager", focus: "Variance analysis, budget vs actual, forecast accuracy, scenario comparison", photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&fit=crop&h=280", color: lp.gold, Icon: Target },
          ].map(p => (
            <div key={p.role} style={{ background: lpMode === "dark" ? `linear-gradient(165deg, ${lp.surface}, ${p.color}04)` : lp.surface, border: `1px solid ${lp.border}`, borderRadius: 18, overflow: "hidden", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", position: "relative" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${p.color}15`; e.currentTarget.style.borderColor = `${p.color}30`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = lp.border; }}>
              <div style={{ position: "relative", height: 150, overflow: "hidden" }}>
                <img src={p.photo} alt={p.role} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s", filter: lpMode === "dark" ? "brightness(0.6) saturate(1.2)" : "brightness(0.85) saturate(1.1)" }} loading="lazy" />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${p.color}15, transparent 50%)` }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "70%", background: `linear-gradient(transparent, ${lpMode === "dark" ? lp.surface : lp.surface})` }} />
                {/* Role icon badge */}
                <div style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: 9, background: `${p.color}20`, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${p.color}25` }}>
                  <p.Icon size={15} color={p.color} />
                </div>
                <div style={{ position: "absolute", bottom: 10, left: 16, fontSize: 17, fontWeight: 800, color: lpMode === "dark" ? "#fff" : lp.text, letterSpacing: "-0.02em" }}>{p.role}</div>
              </div>
              <div style={{ padding: "14px 16px 18px" }}>
                <p style={{ fontSize: 11, color: lp.textDim, lineHeight: 1.65, marginBottom: 12 }}>{p.focus}</p>
                <button onClick={enterDemo} style={{ fontSize: 10, fontWeight: 700, color: p.color, background: `${p.color}08`, border: `1px solid ${p.color}15`, cursor: "pointer", fontFamily: "inherit", padding: "6px 14px", borderRadius: 7, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 4 }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${p.color}14`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${p.color}08`; }}
                >See {p.role} dashboard <ChevronRight size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PERSONALIZED DASHBOARD PREVIEW — "Designed for your decisions" ═══ */}
      <div style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: `${lp.green}0a`, border: `1px solid ${lp.green}18`, fontSize: 10, fontWeight: 700, color: lp.green, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>Designed for your decisions</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10, color: lp.text }}>See what FinanceOS looks like<br />for <span style={{ color: lp.accent }}>your</span> business</h2>
          <p style={{ fontSize: 15, color: lp.textDim, maxWidth: 520, margin: "0 auto" }}>Every dashboard is personalized to your industry, metrics, and workflow. Select your business type to preview.</p>
        </div>

        {/* Industry selector tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
          {[
            { id: "saas", label: "SaaS / Software", Icon: Cpu },
            { id: "ecom", label: "E-Commerce", Icon: DollarSign },
            { id: "services", label: "Professional Services", Icon: Users },
            { id: "mfg", label: "Manufacturing", Icon: Layers },
          ].map(tab => (
            <button key={tab.id} onClick={() => setPreviewIndustry(tab.id)} style={{
              fontSize: 12, fontWeight: 700, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit",
              background: previewIndustry === tab.id ? `${lp.accent}18` : lp.cardBg,
              color: previewIndustry === tab.id ? lp.accent : lp.textDim,
              borderWidth: 1, borderStyle: "solid",
              borderColor: previewIndustry === tab.id ? `${lp.accent}40` : lp.border,
              display: "flex", alignItems: "center", gap: 8, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}><tab.Icon size={13} /> {tab.label}</button>
          ))}
        </div>

        {/* Personalized dashboard preview */}
        {(() => {
          const configs = {
            saas: {
              title: "SaaS Command Center",
              subtitle: "Real-time ARR tracking, cohort analysis, and expansion revenue intelligence",
              kpis: [
                { l: "ARR", v: "$48.6M", d: "+24% YoY", c: "#60a5fa" },
                { l: "NDR", v: "118%", d: "+3pp QoQ", c: "#3dd9a0" },
                { l: "Gross Margin", v: "84.7%", d: "+2.1pp", c: "#a78bfa" },
                { l: "Rule of 40", v: "52.1", d: "Top 10%", c: "#3dd9a0" },
                { l: "CAC Payback", v: "14.2 mo", d: "-2.1 mo", c: "#60a5fa" },
                { l: "Burn Multiple", v: "0.8x", d: "Efficient", c: "#f5b731" },
              ],
              aiQ: "What drove the $2.1M revenue beat this quarter?",
              aiA: "Enterprise expansion drove 68% of the beat. NDR hit 126% in Enterprise, with AI module attach rate at 42% — up from 28% last quarter. Three expansion deals over $200K closed in the final week.",
              chartLabel: "ARR Growth · Actual vs Forecast",
              quote: "We replaced Adaptive Planning and 4 spreadsheets in one afternoon.",
            },
            ecom: {
              title: "E-Commerce Financial Hub",
              subtitle: "GMV tracking, COGS analysis, channel profitability, and inventory cost modeling",
              kpis: [
                { l: "GMV", v: "$127.3M", d: "+31% YoY", c: "#60a5fa" },
                { l: "AOV", v: "$84.20", d: "+$12.40", c: "#3dd9a0" },
                { l: "Gross Margin", v: "62.4%", d: "+1.8pp", c: "#a78bfa" },
                { l: "CAC", v: "$28.50", d: "-14% QoQ", c: "#3dd9a0" },
                { l: "LTV/CAC", v: "4.2x", d: "+0.6x", c: "#60a5fa" },
                { l: "Return Rate", v: "8.1%", d: "-1.2pp", c: "#f5b731" },
              ],
              aiQ: "Which channels have the best unit economics this quarter?",
              aiA: "DTC web has the highest contribution margin at 71%. Amazon is 48% but growing 2.4x faster. TikTok Shop is running -$3.20 per order after fulfillment — recommend pausing paid spend until AOV exceeds $65.",
              chartLabel: "GMV by Channel · Monthly Trend",
              quote: "We finally see true channel profitability, not just top-line GMV.",
            },
            services: {
              title: "Professional Services Dashboard",
              subtitle: "Utilization rates, project profitability, pipeline forecasting, and bench cost tracking",
              kpis: [
                { l: "Revenue", v: "$22.8M", d: "+18% YoY", c: "#60a5fa" },
                { l: "Utilization", v: "78.4%", d: "+3.2pp", c: "#3dd9a0" },
                { l: "Avg Bill Rate", v: "$285/hr", d: "+$15", c: "#a78bfa" },
                { l: "Project Margin", v: "41.2%", d: "+2.8pp", c: "#3dd9a0" },
                { l: "Bench Cost", v: "$184K/mo", d: "-$42K", c: "#60a5fa" },
                { l: "Pipeline", v: "$8.4M", d: "3.2 mo", c: "#f5b731" },
              ],
              aiQ: "Which practice areas are dragging down blended margin?",
              aiA: "Implementation Services is at 28% margin vs target 38%. Root cause: two fixed-price engagements exceeded scope by 340 hours combined. Staff augmentation is at 52% — carrying the blended rate. Recommend renegotiating MSA on the Meridian account.",
              chartLabel: "Utilization & Revenue · By Practice Area",
              quote: "We went from 'I think we're profitable' to knowing exactly where every dollar goes.",
            },
            mfg: {
              title: "Manufacturing Finance Center",
              subtitle: "COGS variance, production efficiency, supply chain cost modeling, and tariff impact analysis",
              kpis: [
                { l: "Revenue", v: "$89.2M", d: "+12% YoY", c: "#60a5fa" },
                { l: "COGS %", v: "58.4%", d: "-1.6pp", c: "#3dd9a0" },
                { l: "Gross Margin", v: "41.6%", d: "+1.6pp", c: "#a78bfa" },
                { l: "OEE", v: "84.2%", d: "+2.1pp", c: "#3dd9a0" },
                { l: "Inventory Days", v: "42", d: "-6 days", c: "#60a5fa" },
                { l: "Tariff Impact", v: "$2.1M", d: "Scenario A", c: "#f06b6b" },
              ],
              aiQ: "What's the P&L impact if Section 301 tariffs increase to 35%?",
              aiA: "At 35%, annual COGS increases $4.8M. Gross margin drops to 36.2%. Mitigations: nearshoring Component Group B saves $1.9M; passing 40% to customers recovers $1.4M. Net impact after mitigations: -$1.5M (-1.7pp margin).",
              chartLabel: "COGS Variance · Actual vs Standard",
              quote: "We modeled 14 tariff scenarios in one afternoon — used to take the team a full week.",
            },
          };
          const cfg = configs[previewIndustry] || configs.saas;
          return (
            <div style={{ borderRadius: 20, border: "1px solid #1a1f2e", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.4)", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
              {/* Window chrome */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", background: "#10131a", borderBottom: "1px solid #1a1f2e" }}>
                <div style={{ display: "flex", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f06b6b" }} /><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f5b731" }} /><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3dd9a0" }} /></div>
                <div style={{ fontSize: 10, color: "#3d4558", fontFamily: "'JetBrains Mono', monospace", background: "#06080c80", padding: "3px 14px", borderRadius: 5 }}>finance-os.app/{previewIndustry}-dashboard</div>
                <div style={{ width: 50 }} />
              </div>

              {/* Dashboard content */}
              <div style={{ padding: isMobile ? "16px" : "28px 32px", background: "linear-gradient(180deg, #06080c, #10131a)" }}>
                {/* Title bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#eef0f6", letterSpacing: "-0.02em" }}>{cfg.title}</div>
                    <div style={{ fontSize: 11, color: "#3d4558", marginTop: 2 }}>{cfg.subtitle}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["This Quarter", "YTD", "12M"].map((p, i) => (
                      <span key={p} style={{ fontSize: 8, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: i === 0 ? "rgba(96,165,250,0.12)" : "transparent", color: i === 0 ? "#60a5fa" : "#3d4558", border: `1px solid ${i === 0 ? "rgba(96,165,250,0.2)" : "#1a1f2e"}` }}>{p}</span>
                    ))}
                  </div>
                </div>

                {/* 6 KPI cards */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(6, 1fr)", gap: 10, marginBottom: 20 }}>
                  {cfg.kpis.map(k => (
                    <div key={k.l} style={{ padding: "14px 14px", borderRadius: 12, background: "rgba(16,19,26,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(26,31,46,0.6)", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${k.c}15, transparent)` }} />
                      <div style={{ fontSize: 7, fontWeight: 700, color: "#3d4558", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{k.l}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#eef0f6", fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>{k.v}</div>
                      <span style={{ fontSize: 8, fontWeight: 700, color: k.c, padding: "1px 5px", borderRadius: 3, background: `${k.c}10` }}>{k.d}</span>
                    </div>
                  ))}
                </div>

                {/* Chart + AI Copilot */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: 14, marginBottom: 16 }}>
                  {/* Chart */}
                  <div style={{ padding: "16px 18px", borderRadius: 14, background: "rgba(16,19,26,0.6)", border: "1px solid rgba(26,31,46,0.5)" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#eef0f6", marginBottom: 4 }}>{cfg.chartLabel}</div>
                    <div style={{ fontSize: 8, color: "#3d4558", marginBottom: 12 }}>Auto-generated from GL data</div>
                    <svg viewBox="0 0 300 80" style={{ width: "100%", height: 80 }}>
                      <defs><linearGradient id={`pg${previewIndustry}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa" stopOpacity={0.2} /><stop offset="100%" stopColor="#60a5fa" stopOpacity={0} /></linearGradient></defs>
                      {[16,32,48,64].map(y => <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#1a1f2e" strokeWidth="0.4" strokeDasharray="1 6" strokeLinecap="round" />)}
                      <path d="M5,68 L35,60 L65,55 L95,48 L125,40 L155,35 L185,28 L215,22 L245,18 L275,14" fill={`url(#pg${previewIndustry})`} />
                      <path d="M5,68 L35,60 L65,55 L95,48 L125,40 L155,35 L185,28 L215,22 L245,18 L275,14" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                      <path d="M5,70 L35,65 L65,60 L95,54 L125,48 L155,44 L185,38 L215,34 L245,30 L275,26" fill="none" stroke="#3d4558" strokeWidth="1" strokeDasharray="3 4" />
                      <circle cx="275" cy="14" r="3" fill="#60a5fa" stroke="#06080c" strokeWidth="2"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" /></circle>
                    </svg>
                    <div style={{ display: "flex", gap: 10, fontSize: 8, color: "#3d4558", marginTop: 6 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 2, borderRadius: 1, background: "#60a5fa" }} />Actual</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 1, borderTop: "1px dashed #3d4558" }} />Budget</span>
                      <span style={{ marginLeft: "auto", fontWeight: 700, color: "#3dd9a0" }}>Beating plan</span>
                    </div>
                  </div>

                  {/* AI Copilot */}
                  <div style={{ padding: "16px 18px", borderRadius: 14, background: "rgba(16,19,26,0.6)", border: "1px solid rgba(26,31,46,0.5)", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                      <span style={{ fontSize: 12 }}>◎</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#eef0f6" }}>AI Copilot</span>
                      <span style={{ fontSize: 7, fontWeight: 700, padding: "2px 5px", borderRadius: 3, background: "#a78bfa12", color: "#a78bfa", marginLeft: "auto" }}>Claude</span>
                    </div>
                    <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.08)", fontSize: 10, color: "#636d84", marginBottom: 6 }}>"{cfg.aiQ}"</div>
                    <div style={{ flex: 1, padding: "8px 10px", borderRadius: 8, background: "#161a24", border: "1px solid #1a1f2e", fontSize: 10, color: "#9ea5b8", lineHeight: 1.55 }}>
                      <div style={{ fontSize: 7, fontWeight: 700, color: "#3dd9a0", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Thought & work process →</div>
                      {cfg.aiA}
                    </div>
                  </div>
                </div>

                {/* Bottom quote */}
                <div style={{ textAlign: "center", padding: "12px 0 0", borderTop: "1px solid #1a1f2e" }}>
                  <p style={{ fontSize: 12, color: "#636d84", fontStyle: "italic", marginBottom: 4 }}>"{cfg.quote}"</p>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#3d4558" }}>— FinanceOS customer</span>
                </div>
              </div>

              {/* CTA bar */}
              <div style={{ padding: "16px 24px", background: "#10131a", borderTop: "1px solid #1a1f2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#636d84" }}>Want a dashboard customized for your business?</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={enterDemo} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Try It Free →</button>
                  <button onClick={() => setDemoModal(true)} style={{ fontSize: 11, padding: "8px 16px", borderRadius: 8, border: "1px solid #1a1f2e", background: "transparent", color: "#636d84", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Send Us Your Data</button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Features */}
      <div id="features" style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, color: lp.text }}>Everything a modern<br />finance team needs</h2>
          <p style={{ fontSize: 15, color: lp.textDim, maxWidth: 500, margin: "0 auto" }}>From variance detection to board-ready reports, powered by AI that shows its reasoning.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {[
            { title: "AI Copilot", desc: "Ask questions in plain English. Get data-backed answers with visible reasoning — not a black box.", Icon: Brain, color: lp.purple },
            { title: "Forecast Optimizer", desc: "ML ensemble models with live sensitivity sliders. Adjust NDR, pipeline, churn — see impact instantly.", Icon: TrendingUp, color: lp.accent },
            { title: "Multi-Entity Consolidation", desc: "Automatic intercompany eliminations, FX adjustments, and entity-level approval workflows.", Icon: Layers, color: lp.green },
            { title: "Variance Detective", desc: "AI scans every line for favorable/unfavorable variances and explains the drivers automatically.", Icon: Eye, color: lp.gold },
            { title: "Scenario Modeling", desc: "Compare 4+ scenarios side-by-side. Base, bull, bear, and custom — all with live data feeds.", Icon: Cpu, color: "#f87171" },
            { title: "Native Integrations", desc: "NetSuite, Salesforce, Stripe, Snowflake, Rippling, and more. Real-time bi-directional sync.", Icon: Globe, color: "#22d3ee" },
          ].map(f => (
            <div key={f.title} style={{ background: lp.cardBg, backdropFilter: "blur(12px)", border: `1px solid ${lp.border}`, borderRadius: 16, padding: "28px 24px", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.color}35`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${f.color}08, 0 0 0 1px ${f.color}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${f.color}15, transparent)` }} />
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${f.color}15, ${f.color}06)`, border: `1px solid ${f.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <f.Icon size={20} color={f.color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.01em", color: lp.text }}>{f.title}</div>
              <div style={{ fontSize: 13, color: lp.textDim, lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PRODUCT DEMO — Jira-inspired tabbed showcase ═══ */}
      <ProductDemo enterDemo={enterDemo} lp={lp} lpMode={lpMode} />

      {/* ═══ HOW IT WORKS — Numbered step flow (Jira pattern) ═══ */}
      <div style={{ padding: "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, color: lp.text }}>Up and running in 4 steps</h2>
          <p style={{ fontSize: 15, color: lp.textDim, maxWidth: 480, margin: "0 auto" }}>No 6-month implementation. No consultants. Connect your data and start planning in days.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 16, position: "relative" }}>
          {!isMobile && <div style={{ position: "absolute", top: 18, left: "12.5%", right: "12.5%", height: 2, background: `linear-gradient(90deg, ${lp.accent}30, ${lp.purple}30, ${lp.green}30, ${lp.gold}30)`, zIndex: 0 }} />}
          {[
            { step: 1, title: "Connect your data", desc: "Link your ERP, CRM, and billing in under 5 minutes. NetSuite, Salesforce, Stripe, QuickBooks — all pre-built.", color: lp.accent },
            { step: 2, title: "AI builds your model", desc: "FinanceOS auto-maps your chart of accounts, detects revenue drivers, and creates a baseline forecast.", color: lp.purple },
            { step: 3, title: "Plan & scenario model", desc: "Run what-if scenarios, adjust assumptions with live sliders, and compare 4 models side-by-side.", color: lp.green },
            { step: 4, title: "Close & report", desc: "Multi-entity consolidation, variance commentary, and board-ready exports — all from one platform.", color: lp.gold },
          ].map(s => (
            <div key={s.step} style={{ background: lp.cardBg, backdropFilter: "blur(12px)", border: `1px solid ${lp.border}`, borderRadius: 16, padding: "28px 24px", position: "relative", zIndex: 1, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${s.color}18, ${s.color}06)`, border: `1px solid ${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: s.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>{s.step}</div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8, color: lp.text }}>{s.title}</div>
              <div style={{ fontSize: 13, color: lp.textDim, lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button className="fos-cta-primary" onClick={enterDemo} style={{ fontSize: 15, padding: "14px 32px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${lp.gradFrom}, ${lp.gradTo})`, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: `0 8px 30px ${lp.accent}25` }}>Subscribe — 30-Day MBG</button>
          <div style={{ marginTop: 10, fontSize: 12, color: lp.textFaint }}>30-day money-back guarantee · Cancel anytime</div>
        </div>
      </div>

      {/* Outcomes */}
      <div style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: `${lp.green}0a`, border: `1px solid ${lp.green}18`, fontSize: 10, fontWeight: 700, color: lp.green, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>Built for Impact</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, color: lp.text }}>What teams can accomplish</h2>
          <p style={{ fontSize: 15, color: lp.textDim, maxWidth: 500, margin: "0 auto" }}>Projected outcomes based on product capabilities and industry benchmarks.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {[
            { Icon: CheckSquare, outcome: "Accelerate your month-end close", detail: "AI copilot auto-generates variance commentary and flags accrual errors before your auditors see them.", metric: "Faster close cycles", color: lp.accent },
            { Icon: GitBranch, outcome: "Model 3 M&A scenarios in 20 minutes", detail: "Side-by-side scenario comparison with live sensitivity sliders. No more two-week spreadsheet cycles.", metric: "Scenario modeling in minutes", color: lp.purple },
            { Icon: Eye, outcome: "See AI reasoning you can actually verify", detail: "Unlike black-box copilots, FinanceOS shows every data source, assumption, and calculation chain.", metric: "Full transparency", color: lp.green },
          ].map(t => (
            <div key={t.outcome} style={{ background: lp.cardBg, backdropFilter: "blur(12px)", border: `1px solid ${lp.border}`, borderRadius: 16, padding: "28px 24px", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.color}08`, border: `1px solid ${t.color}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <t.Icon size={18} color={t.color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: lp.text, lineHeight: 1.3, marginBottom: 10 }}>{t.outcome}</div>
              <div style={{ fontSize: 13, color: lp.textDim, lineHeight: 1.65, marginBottom: 16 }}>{t.detail}</div>
              <div style={{ fontSize: 10, fontWeight: 700, padding: "5px 12px", borderRadius: 6, background: `${t.color}08`, border: `1px solid ${t.color}12`, color: t.color, display: "inline-block" }}>{t.metric}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CUSTOMER STORIES — Photo testimonials with Ken Burns animations ═══ */}
      <div style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: lp.gold, marginBottom: 10, animation: "fosFadeSlideUp 0.5s ease-out both" }}>Customer Stories</div>
          <h2 className="fos-gradient-text" style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, letterSpacing: "-0.03em", display: "inline-block" }}>Finance leaders who made the switch</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
          {[
            { quote: "We replaced our entire Excel-based FP&A stack in one afternoon. The AI Copilot caught a $400K variance our team missed for two months straight.", name: "Jordan K.", role: "VP of Finance", co: "Series B SaaS · $18M ARR", init: "JK", initColor: lp.accent, img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80&fit=crop&crop=faces&h=220", headshot: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
            { quote: "The scenario modeling alone is worth the subscription. We ran 14 what-if scenarios for our board meeting — something that used to take our team a full week.", name: "Sarah R.", role: "Director of FP&A", co: "Growth Stage · $45M ARR", init: "SR", initColor: lp.green, img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&fit=crop&crop=faces&h=220", headshot: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
          ].map((s, idx) => (
            <div key={s.init} className="fos-testimonial-card" style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${lp.border}`, background: lpMode === "dark" ? "rgba(16,19,26,0.6)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", animation: `fosFadeSlideUp 0.6s ease-out ${idx * 0.15}s both` }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${lp.accent}12`; e.currentTarget.style.borderColor = `${s.initColor}30`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = lp.border; }}>
              <div style={{ overflow: "hidden", height: 165, position: "relative" }}>
                <img className="fos-testimonial-img fos-ken-burns" src={s.img} alt={s.role} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: `linear-gradient(transparent, ${lpMode === "dark" ? "rgba(16,19,26,0.9)" : "rgba(255,255,255,0.9)"})` }} />
                {/* Floating headshot avatar */}
                <img src={s.headshot} alt={s.name} style={{ position: "absolute", bottom: -20, left: 22, width: 48, height: 48, borderRadius: 14, objectFit: "cover", border: `3px solid ${lpMode === "dark" ? "#10131a" : "#fff"}`, boxShadow: `0 4px 16px rgba(0,0,0,0.25)`, zIndex: 3 }} loading="lazy" onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} />
              </div>
              <div style={{ padding: "28px 22px 20px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>{[1,2,3,4,5].map(i => <Star key={i} size={13} color={lp.gold} fill={lp.gold} />)}</div>
                <p style={{ fontSize: 13, color: lp.text, lineHeight: 1.75, fontStyle: "italic", marginBottom: 14 }}>"{s.quote}"</p>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: lp.text }}>{s.name} · <span style={{ color: s.initColor }}>{s.role}</span></div>
                  <div style={{ fontSize: 10, color: lp.textFaint, marginTop: 2 }}>{s.co}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Full-width featured story */}
        <div className="fos-testimonial-card" style={{ marginTop: 16, borderRadius: 18, overflow: "hidden", border: `1px solid ${lp.border}`, background: lpMode === "dark" ? "rgba(16,19,26,0.6)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.3fr 1fr", animation: "fosFadeSlideUp 0.7s ease-out 0.3s both" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${lp.accent}30`; e.currentTarget.style.boxShadow = `0 16px 48px ${lp.accent}10`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; e.currentTarget.style.boxShadow = "none"; }}>
          <div style={{ padding: isMobile ? "28px 22px" : "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>{[1,2,3,4,5].map(i => <Star key={i} size={14} color={lp.gold} fill={lp.gold} />)}</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: lp.text, lineHeight: 1.7, fontStyle: "italic", marginBottom: 20 }}>"Finally, an FP&A tool that doesn't require a 6-month implementation and a team of consultants. We were live with real data in under an hour. The AI reasoning is what sold us — our CFO can actually trust the numbers."</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80&fit=crop&crop=face" alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover", border: `2px solid ${lp.accent}30` }} loading="lazy" onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: lp.text }}>Maria L. · <span style={{ color: lp.accent }}>CFO</span></div>
                <div style={{ fontSize: 11, color: lp.textFaint }}>Mid-Market Manufacturing · $12M ARR</div>
              </div>
            </div>
          </div>
          <div style={{ overflow: "hidden", position: "relative" }}>
            <img className="fos-testimonial-img fos-ken-burns" src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80&fit=crop&crop=faces&h=320" alt="CFO reviewing dashboard" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 240 }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${lpMode === "dark" ? "rgba(16,19,26,0.4)" : "rgba(255,255,255,0.2)"}, transparent)` }} />
          </div>
        </div>
      </div>

      {/* Competitive Comparison */}
      {(() => { const [compRef, compVis] = useScrollReveal(0.1); return (
      <div ref={compRef} style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40, opacity: compVis ? 1 : 0, transform: compVis ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, color: lp.text }}>How FinanceOS compares</h2>
          <p style={{ fontSize: 15, color: lp.textDim, maxWidth: 500, margin: "0 auto" }}>Enterprise capability at mid-market pricing. No 6-month implementation.</p>
        </div>
        <div style={{ background: lp.cardBg, backdropFilter: "blur(12px)", border: `1px solid ${lp.border}`, borderRadius: 18, overflow: "hidden", position: "relative", opacity: compVis ? 1 : 0, transform: compVis ? "scale(1)" : "scale(0.96)", transition: "all 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${lp.border}` }}>
                {["Capability", "FinanceOS", "Legacy EPM", "Mid-Market FP&A", "Startup Tools"].map((h, i) => (
                  <th key={h} style={{ padding: "16px 18px", textAlign: i === 0 ? "left" : "center", fontSize: 10, fontWeight: 800, color: i === 1 ? lp.accent : lp.textDim, textTransform: "uppercase", letterSpacing: "0.08em", background: i === 1 ? `${lp.accent}06` : "transparent" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { cap: "AI Copilot with visible reasoning", us: true, an: false, pi: false, ru: true },
                { cap: "Self-serve onboarding (days, not months)", us: true, an: false, pi: false, ru: true },
                { cap: "Published transparent pricing", us: true, an: false, pi: false, ru: false },
                { cap: "No seat or usage caps (Enterprise)", us: true, an: true, pi: true, ru: false },
                { cap: "Multi-entity consolidation", us: true, an: true, pi: true, ru: false },
                { cap: "Scenario modeling (4+ side-by-side)", us: true, an: true, pi: true, ru: true },
                { cap: "Real-time variance detection", us: true, an: false, pi: true, ru: false },
                { cap: "Native integrations", us: true, an: true, pi: true, ru: true },
                { cap: "Banking data via Plaid", us: true, an: false, pi: false, ru: false },
                { cap: "CSV / file upload pipeline", us: true, an: true, pi: true, ru: true },
                { cap: "SOC 2 Type II architecture", us: true, an: true, pi: true, ru: true },
                { cap: "Enterprise / on-prem option", us: true, an: true, pi: true, ru: false },
                { cap: "Implementation time", us: "< 48hr", an: "3-6 mo", pi: "3-6 mo", ru: "Weeks" },
                { cap: "Starting price", us: "From $499/mo", an: "$200K+/yr", pi: "$65K+/yr", ru: "$30K+/yr" },
              ].map((row, ri) => (
                <tr key={row.cap} style={{ borderBottom: `1px solid ${lp.border}80`, opacity: compVis ? 1 : 0, transform: compVis ? "translateX(0)" : "translateX(-12px)", transition: `all 0.4s ease-out ${0.3 + ri * 0.04}s` }}>
                  <td style={{ padding: "12px 16px", color: lp.textSub, fontWeight: 500 }}>{row.cap}</td>
                  {[row.us, row.an, row.pi, row.ru].map((v, i) => (
                    <td key={i} style={{ padding: "12px 16px", textAlign: "center", background: i === 0 ? `${lp.accent}04` : "transparent" }}>
                      {typeof v === "boolean" ? (
                        v ? <Check size={16} color={lp.green} strokeWidth={2.5} style={{ opacity: compVis ? 1 : 0, transform: compVis ? "scale(1)" : "scale(0)", transition: `all 0.3s cubic-bezier(0.34,1.56,0.64,1) ${0.5 + ri * 0.04}s` }} /> : <X size={14} color={lp.textFaint} strokeWidth={2} />
                      ) : (
                        <span style={{ fontWeight: 700, color: i === 0 ? lp.accent : lp.textDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: "center", marginTop: 20, opacity: compVis ? 1 : 0, transition: "opacity 0.5s ease 0.8s" }}>
          <a href="/use-cases/finance" style={{ fontSize: 12, fontWeight: 700, color: lp.accent, textDecoration: "none" }}>View full competitive analysis →</a>
        </div>
      </div>
      ); })()}

      {/* Powered by Claude — premium partnership highlight */}
      {(() => { const [claudeRef, claudeVis] = useScrollReveal(0.1); return (
      <div ref={claudeRef} style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ borderRadius: 24, overflow: "hidden", border: `1px solid ${lp.border}`, position: "relative", opacity: claudeVis ? 1 : 0, transform: claudeVis ? "scale(1) translateY(0)" : "scale(0.96) translateY(16px)", transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)" }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${lp.purple}10 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 250, height: 250, borderRadius: "50%", background: `radial-gradient(circle, ${lp.accent}08 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr", gap: 0 }}>
            {/* Left — Quote + Anthropic branding */}
            <div style={{ padding: isMobile ? "36px 28px" : "52px 44px", background: lpMode === "dark" ? `linear-gradient(135deg, #0f1118, #161a24)` : `linear-gradient(135deg, #f8f9fb, #ffffff)`, position: "relative" }}>
              {/* Anthropic logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                <img src="https://cdn.simpleicons.org/anthropic/D4A574" alt="Anthropic" style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover", border: `1px solid ${lp.border}` }} />
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: lp.text, letterSpacing: "-0.02em" }}>Anthropic</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: lp.purple }}>Strategic AI Partner</div>
                </div>
              </div>
              <p style={{ fontSize: 18, fontWeight: 500, color: lp.text, lineHeight: 1.7, fontStyle: "italic", marginBottom: 28, position: "relative", paddingLeft: 20, borderLeft: `3px solid ${lp.purple}40` }}>
                "FinanceOS demonstrates what's possible when AI becomes a true partner in financial planning. By connecting planning data directly to Claude, finance teams focus on strategic decisions — not data wrangling."
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${lp.purple}20, ${lp.accent}15)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={20} color={lp.purple} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: lp.text }}>Claude AI Platform</div>
                  <div style={{ fontSize: 11, color: lp.textFaint }}>Powering FinanceOS AI Copilot</div>
                </div>
              </div>
            </div>
            {/* Right — Claude feature showcase */}
            <div style={{ padding: isMobile ? "36px 28px" : "52px 44px", background: lpMode === "dark" ? `linear-gradient(135deg, #161a24, #1a1f2e)` : `linear-gradient(135deg, #ffffff, #f0f2f8)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 60% 40%, ${lp.purple}08, transparent 60%)`, pointerEvents: "none" }} />
              <div style={{ textAlign: "center", position: "relative", width: "100%" }}>
                {/* Claude logo large */}
                <div style={{ width: 88, height: 88, borderRadius: 22, background: `linear-gradient(135deg, ${lp.purple}18, ${lp.accent}10)`, border: `2px solid ${lp.purple}20`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: `0 12px 40px ${lp.purple}12` }}>
                  <img src="https://cdn.simpleicons.org/anthropic/D4A574" alt="Claude" style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover" }} />
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: lp.text, marginBottom: 8, letterSpacing: "-0.02em" }}>Powered by Claude</div>
                <p style={{ fontSize: 14, color: lp.textDim, lineHeight: 1.65, maxWidth: 300, margin: "0 auto 20px" }}>Enterprise-grade AI reasoning with visible thought process, SHAP explanations, and confidence intervals.</p>
                {/* Feature pills */}
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {[
                    { label: "Visible Reasoning", Icon: Eye },
                    { label: "SHAP Values", Icon: BarChart3 },
                    { label: "Confidence Bands", Icon: Activity },
                  ].map(t => (
                    <span key={t.label} style={{ fontSize: 10, fontWeight: 600, padding: "6px 14px", borderRadius: 8, background: lpMode === "dark" ? `linear-gradient(135deg, ${lp.purple}10, ${lp.purple}05)` : `linear-gradient(135deg, ${lp.purple}08, ${lp.purple}03)`, border: `1px solid ${lp.purple}15`, color: lp.purple, display: "inline-flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}>
                      <t.Icon size={11} />{t.label}
                    </span>
                  ))}
                </div>
                {/* Partnership badge */}
                <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: `${lp.purple}06`, border: `1px solid ${lp.purple}12` }}>
                  <Sparkles size={12} color={lp.purple} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: lp.purple, letterSpacing: "0.04em" }}>OFFICIAL AI PARTNER</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ); })()}

      {/* Quick comparison strip */}
      <div style={{ padding: "20px 48px 40px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? 16 : 40, flexWrap: "wrap" }}>
          {[
            { us: "$499/mo", them: "vs $65K+/yr", label: "Starting price" },
            { us: "Same day", them: "vs 3-6 months", label: "Time to value" },
            { us: "3.2% MAPE", them: "vs 8-15%", label: "Forecast accuracy" },
            { us: "15 min", them: "vs SI required", label: "Onboarding" },
          ].map(c => (
            <div key={c.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: lp.accent, fontFamily: "'JetBrains Mono', monospace" }}>{c.us}</div>
              <div style={{ fontSize: 10, color: lp.textFaint, marginTop: 2 }}>{c.them}</div>
              <div style={{ fontSize: 9, color: lp.textDim, marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      {/* Resources — like Pigment's Further Reading */}
      {(() => { const [resRef, resVis] = useScrollReveal(0.1); return (
      <div ref={resRef} style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32, opacity: resVis ? 1 : 0, transform: resVis ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: lp.green, marginBottom: 10 }}>Resources</div>
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: lp.text }}>Further reading</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {[
            { tag: "GUIDE", title: "The Complete SaaS FP&A Playbook", desc: "From ARR to Rule of 40 — every metric, benchmark, and best practice modern SaaS finance teams need.", href: "/use-cases/saas-fpa", color: lp.accent },
            { tag: "USE CASE", title: "Revenue Planning", desc: "Driver-based revenue models with pipeline-weighted forecasting, cohort retention analysis, and expansion tracking.", href: "/use-cases/revenue-planning", color: lp.green },
            { tag: "COMPARISON", title: "FinanceOS vs. Legacy FP&A", desc: "See how FinanceOS compares to Anaplan, Pigment, Adaptive Planning, and Planful on 10 capabilities.", href: "/use-cases/finance", color: lp.purple },
          ].map((r, ri) => (
            <a key={r.title} href={r.href} style={{ background: lp.cardBg, border: `1px solid ${lp.border}`, borderRadius: 16, padding: "24px 22px", textDecoration: "none", display: "block", transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)", position: "relative", overflow: "hidden", opacity: resVis ? 1 : 0, transform: resVis ? "scale(1) translateY(0)" : "scale(0.92) translateY(16px)", transitionDelay: `${0.1 + ri * 0.1}s` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${r.color}30`; e.currentTarget.style.transform = "translateY(-4px) scale(1.01)"; e.currentTarget.style.boxShadow = `0 12px 36px ${r.color}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; e.currentTarget.style.transform = "scale(1) translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${r.color}15, transparent)` }} />
              <span style={{ fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: `${r.color}10`, color: r.color, letterSpacing: "0.08em" }}>{r.tag}</span>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: lp.text, marginTop: 12, marginBottom: 8, letterSpacing: "-0.01em" }}>{r.title}</h3>
              <p style={{ fontSize: 13, color: lp.textDim, lineHeight: 1.65, marginBottom: 12 }}>{r.desc}</p>
              <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>Read now →</span>
            </a>
          ))}
        </div>
      </div>
      ); })()}

      {(() => { const [priceRef, priceVis] = useScrollReveal(0.08); return (
      <div id="pricing" ref={priceRef} style={{ padding: isMobile ? "40px 20px 60px" : "80px 48px 80px", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Ambient pricing glow */}
        <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse, ${lp.accent}05 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ textAlign: "center", marginBottom: 52, position: "relative", opacity: priceVis ? 1 : 0, transform: priceVis ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 24, background: `linear-gradient(135deg, ${lp.accent}0c, ${lp.green}06)`, border: `1px solid ${lp.accent}18`, fontSize: 10, fontWeight: 700, color: lp.accent, marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <DollarSign size={12} color={lp.accent} strokeWidth={2.5} />Pricing
          </div>
          <h2 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14, color: lp.text, lineHeight: 1.15 }}>Base + consumption pricing</h2>
          <p style={{ fontSize: 16, color: lp.textDim, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.7 }}>Predictable base fee. Pay-per-use overages only when you exceed included limits.</p>
          <div style={{ display: "inline-flex", background: lpMode === "dark" ? "rgba(16,19,26,0.7)" : "rgba(248,249,251,0.9)", borderRadius: 12, padding: 4, border: `1px solid ${lp.border}`, backdropFilter: "blur(8px)" }}>
            <button onClick={() => setBilling("monthly")} style={{ fontSize: 12, padding: "10px 22px", borderRadius: 9, border: "none", background: billing === "monthly" ? (lpMode === "dark" ? lp.surface : "#fff") : "transparent", color: billing === "monthly" ? lp.text : lp.textDim, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s", boxShadow: billing === "monthly" ? `0 2px 8px ${lp.accent}10` : "none" }}>Monthly</button>
            <button onClick={() => setBilling("annual")} style={{ fontSize: 12, padding: "10px 22px", borderRadius: 9, border: "none", background: billing === "annual" ? (lpMode === "dark" ? lp.surface : "#fff") : "transparent", color: billing === "annual" ? lp.text : lp.textDim, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s", boxShadow: billing === "annual" ? `0 2px 8px ${lp.accent}10` : "none" }}>Annual <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 5, background: `${lp.green}12`, color: lp.green, marginLeft: 4 }}>-17%</span></button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {plans.map((p, pIdx) => (
            <div key={p.name} style={{ background: p.popular ? `linear-gradient(180deg, ${lp.accent}06, ${lp.cardBg})` : lp.cardBg, backdropFilter: "blur(12px)", border: `1px solid ${p.popular ? `${lp.accent}50` : lp.border}`, borderRadius: 16, padding: "28px 24px", boxShadow: p.popular ? `0 0 0 1px ${lp.accent}15, 0 12px 40px ${lp.accent}08` : "none", transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)", position: "relative", overflow: "hidden", opacity: priceVis ? 1 : 0, transform: priceVis ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)", transitionDelay: `${0.15 + pIdx * 0.1}s` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = p.popular ? `0 0 0 1px ${lp.accent}30, 0 20px 60px ${lp.accent}12` : `0 12px 40px ${lp.accent}08`; e.currentTarget.style.borderColor = p.popular ? lp.accent : `${lp.accent}30`; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = p.popular ? `0 0 0 1px ${lp.accent}15, 0 12px 40px ${lp.accent}08` : "none"; e.currentTarget.style.borderColor = p.popular ? `${lp.accent}50` : lp.border; e.currentTarget.style.transform = "none"; }}
            >
              {p.popular && <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 2, background: "linear-gradient(90deg, transparent, #60a5fa50, transparent)", borderRadius: "0 0 2px 2px" }} />}
              {p.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", borderRadius: 8, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: lp.text }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                {p.enterprise ? (
                  <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: lp.text }}>Custom</span>
                ) : (
                  <><span style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.03em", color: lp.text }}>${billing === "annual" ? p.annual?.toLocaleString() : p.monthly?.toLocaleString()}</span>
                  <span style={{ fontSize: 13, color: lp.textDim }}>/mo</span></>
                )}
              </div>
              {!p.enterprise && billing === "annual" && p.monthly && p.annual && <div style={{ fontSize: 11, color: lp.green, fontWeight: 600, marginBottom: 14 }}>Save ${((p.monthly - p.annual) * 12).toLocaleString()}/year</div>}
              {!p.enterprise && billing === "monthly" && <div style={{ height: 20 }} />}
              {p.enterprise && <div style={{ fontSize: 11, color: lp.textDim, lineHeight: 1.5, marginBottom: 14 }}>No seat, entity, or usage limits.<br />Multi-year & volume pricing available.</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: lp.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>Platform</div>
                {p.features.map(f => (
                  <div key={f} style={{ fontSize: 12, color: lp.textSub, display: "flex", alignItems: "center", gap: 8 }}>
                    <Check size={13} color={lp.green} strokeWidth={2.5} /> {f}
                  </div>
                ))}
              </div>
              {p.usage && (
                <div style={{ paddingTop: 12, borderTop: `1px solid ${lp.border}`, marginBottom: 16 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: lp.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                    Consumption Included <span style={{ fontSize: 7, padding: "1px 5px", borderRadius: 3, background: `${lp.accent}0c`, color: lp.accent, fontWeight: 800 }}>PAY-PER-USE</span>
                  </div>
                  {p.usage.map(u => {
                    const unlimited = u.included === -1;
                    const maxRef = p.name === "Starter" ? 1000 : p.name === "Growth" ? 5000 : 10000;
                    const pct = unlimited ? 100 : Math.min((u.included / maxRef) * 100, 100);
                    return (
                    <div key={u.label} style={{ marginBottom: 5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, marginBottom: 2 }}>
                        <span style={{ color: lp.textDim }}>{u.label}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: unlimited ? lp.green : lp.text }}>
                          {unlimited ? "Unlimited" : u.included.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ height: 3, background: lp.border, borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: unlimited ? `linear-gradient(90deg, ${lp.green}, ${lp.green}88)` : p.popular ? `linear-gradient(90deg, ${lp.accent}, ${lp.purple})` : `linear-gradient(90deg, ${lp.accent}bb, ${lp.accent}66)`, transition: "width 0.6s ease" }} />
                      </div>
                      {!unlimited && u.overage && (
                        <div style={{ fontSize: 8, color: lp.textFaint, marginTop: 1 }}>then {u.overage}</div>
                      )}
                    </div>
                    );
                  })}
                  {p.enterprise && (
                    <div style={{ fontSize: 9, color: lp.textDim, marginTop: 4, padding: "4px 8px", borderRadius: 4, background: `${lp.green}06`, border: `1px solid ${lp.green}10` }}>
                      Committed spend discounts available
                    </div>
                  )}
                </div>
              )}
              {p.enterprise ? (
                <button className="fos-cta-secondary" onClick={() => { fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "sales_inquiry", inquiry_type: "Enterprise Pricing", source: "pricing_card_enterprise" }) }).catch(() => {}); window.open("mailto:sales@finance-os.app?subject=Enterprise%20Pricing%20Inquiry", "_blank"); }} style={{
                  width: "100%", fontSize: 12, padding: "12px 0", borderRadius: 10, border: `1px solid ${lp.border}`, cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                  background: "transparent", color: lp.textSub, transition: "all 0.15s",
                }}
                >Contact Sales</button>
              ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="fos-cta-secondary" onClick={enterDemo} style={{
                  flex: 1, fontSize: 12, padding: "12px 0", borderRadius: 10, border: `1px solid ${lp.border}`, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                  background: "transparent", color: lp.textDim, transition: "all 0.15s",
                }}
                >Try Demo</button>
                <button className="fos-cta-primary" onClick={async () => {
                  try { await supabase.from("waitlist").upsert({ email: "subscriber", interest_type: p.name.toLowerCase(), source: "landing_pricing" }, { onConflict: "email" }); } catch {}
                  fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "waitlist", interest_type: p.name.toLowerCase(), source: "landing_pricing", plan_interest: p.name }) }).catch(() => {});
                  enterDemo();
                }} style={{
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
            { value: "Days", label: "Not months to deploy" },
            { value: "Minutes", label: "Scenario analysis time" },
            { value: "< 48hr", label: "Onboarding time" },
            { value: "< 48hr", label: "Implementation time" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: lp.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: lp.textDim, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: lp.textFaint, opacity: priceVis ? 1 : 0, transition: "opacity 0.6s ease 0.7s" }}>All plans include: SOC 2 architecture · AES-256 encryption · 24/7 monitoring · Email support</div>
      </div>
      ); })()}

      {/* ═══ CUSTOMER SUCCESS — Photo testimonial panel ═══ */}
      <div style={{ padding: isMobile ? "20px 20px 40px" : "40px 48px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 0, borderRadius: 20, overflow: "hidden", border: `1px solid ${lp.border}` }}>
          <div style={{ padding: isMobile ? "28px 24px" : "48px 40px", background: lp.surface, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>{[1,2,3,4,5].map(i => <Star key={i} size={16} color={lp.gold} fill={lp.gold} />)}</div>
            <p style={{ fontSize: 18, color: lp.text, lineHeight: 1.7, fontStyle: "italic", marginBottom: 20, fontWeight: 500 }}>"We went from 3-day board deck cycles to 15-minute exports. The AI copilot caught a $2.1M revenue variance our team missed in manual review."</p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80&fit=crop&crop=face" alt="" style={{ width: 48, height: 48, borderRadius: 14, objectFit: "cover" }} loading="lazy" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: lp.text }}>Sarah Chen</div>
                <div style={{ fontSize: 11, color: lp.textDim }}>VP Finance · SaaS · $42M ARR</div>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", minHeight: 260, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&q=80&fit=crop" alt="Finance team reviewing dashboard" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(270deg, transparent 50%, ${lp.surface})` }} />
          </div>
        </div>
      </div>

      {/* ═══ Enterprise Sales Enablement — Why Teams Switch ═══ */}
      {(() => { const [switchRef, switchVis] = useScrollReveal(0.08); return (
      <div ref={switchRef} style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40, opacity: switchVis ? 1 : 0, transform: switchVis ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: `${lp.accent}0a`, border: `1px solid ${lp.accent}18`, fontSize: 10, fontWeight: 700, color: lp.accent, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>For Enterprise Buyers</div>
          <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, color: lp.text }}>Why finance teams switch</h2>
          <p style={{ fontSize: 15, color: lp.textDim, maxWidth: 520, margin: "0 auto" }}>The conversation your CFO is having with procurement right now.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
          {[
            { Icon: DollarSign, title: "TCO drops 60-80%", detail: "$499-$3,999/mo vs $65K-$200K+/yr at legacy vendors. No implementation consultants, no 6-month timelines.", tag: "Cost", img: "https://images.unsplash.com/photo-1554224155-8f4e-4111-9b47-033e6e1c22d0?w=400&q=80&fit=crop&h=200" },
            { Icon: Zap, title: "Live in 48 hours, not 6 months", detail: "Connect your ERP, map your chart of accounts, and run your first report the same day. No consultants required.", tag: "Speed", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&fit=crop&h=200" },
            { Icon: Eye, title: "AI reasoning you can audit", detail: "Our copilot shows every data source, assumption, and calculation chain. Your auditors can verify every insight.", tag: "Transparency", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&fit=crop&h=200" },
            { Icon: Layers, title: "One platform, not five tools", detail: "FP&A + Treasury + Compliance + ESG in a single suite. One login, one vendor, one contract.", tag: "Consolidation", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80&fit=crop&h=200" },
            { Icon: Shield, title: "Security that survives the review", detail: "SOC 2 architecture, AES-256 encryption, row-level security, HSTS + CSP headers, immutable audit logs.", tag: "Security", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80&fit=crop&h=200" },
            { Icon: TrendingUp, title: "Usage-based pricing aligns cost to value", detail: "Base subscription + pay-per-use for AI queries, syncs, and exports. Enterprise agreements include committed spend discounts.", tag: "Pricing", img: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=400&q=80&fit=crop&h=200" },
          ].map((s, sIdx) => (
            <div key={s.title} style={{ background: lp.surface, border: `1px solid ${lp.border}`, borderRadius: 14, overflow: "hidden", transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)", opacity: switchVis ? 1 : 0, transform: switchVis ? "scale(1) translateY(0)" : "scale(0.92) translateY(20px)", transitionDelay: `${0.1 + sIdx * 0.08}s` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${lp.accent}40`; e.currentTarget.style.transform = "translateY(-4px) scale(1.01)"; e.currentTarget.style.boxShadow = `0 12px 36px ${lp.accent}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; e.currentTarget.style.transform = "scale(1) translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ height: 100, overflow: "hidden", position: "relative" }}>
                <img src={s.img} alt={s.tag} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.7, transition: "transform 0.5s ease" }} loading="lazy" />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, ${lp.surface})` }} />
                <span style={{ position: "absolute", top: 10, right: 10, fontSize: 8, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: `${lp.accent}15`, color: lp.accent, letterSpacing: "0.04em", backdropFilter: "blur(8px)" }}>{s.tag}</span>
              </div>
              <div style={{ padding: "16px 20px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: `${lp.accent}0a`, border: `1px solid ${lp.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <s.Icon size={14} color={lp.accent} strokeWidth={1.8} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: lp.text }}>{s.title}</span>
                </div>
                <div style={{ fontSize: 12, color: lp.textDim, lineHeight: 1.65 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32, display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="fos-cta-primary" onClick={() => setDemoModal(true)} style={{ fontSize: 14, padding: "14px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${lp.gradFrom}, ${lp.gradTo})`, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: `0 6px 24px ${lp.accent}25` }}>Schedule a Demo Call</button>
          <button className="fos-cta-secondary" onClick={() => { fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "sales_inquiry", inquiry_type: "Enterprise", source: "why_teams_switch_cta" }) }).catch(() => {}); window.open("mailto:sales@finance-os.app?subject=Enterprise%20Inquiry", "_blank"); }} style={{ fontSize: 14, padding: "14px 28px", borderRadius: 10, border: `1px solid ${lp.border}`, background: "transparent", color: lp.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Talk to Sales</button>
        </div>
      </div>
      ); })()}
      {(() => { const [faqRef, faqVis] = useScrollReveal(0.08); return (
      <div ref={faqRef} style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48, opacity: faqVis ? 1 : 0, transform: faqVis ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <div style={{ display: "inline-block", padding: "6px 14px", borderRadius: 20, background: `${lp.purple}0a`, border: `1px solid ${lp.purple}18`, fontSize: 10, fontWeight: 700, color: lp.purple, marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>FAQ</div>
          <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, color: lp.text }}>Frequently asked questions</h2>
        </div>
        {[
          { q: "What is FinanceOS?", a: "FinanceOS is an AI-powered financial planning and analysis (FP&A) platform. It connects to your ERP, CRM, and billing systems to build a unified financial model, then uses AI to surface variances, forecast revenue, and answer natural language questions about your data — with visible reasoning so you can verify every insight." },
          { q: "How long does implementation take?", a: "Most teams are live within 48 hours. Connect your ERP, map your chart of accounts, and start running reports the same day. No consultants, no 6-month implementations. Compare that to 3-6 months at legacy vendors." },
          { q: "How does FinanceOS compare to legacy FP&A tools?", a: "FinanceOS offers enterprise-grade features (multi-entity consolidation, scenario modeling, AI copilot) at a fraction of the cost — starting at $499/mo vs $65K-$200K+/yr at legacy platforms. We also deploy in days, not months, with transparent published pricing." },
          { q: "Who is FinanceOS best for?", a: "SaaS companies with $5M-$200M ARR and finance teams of 3-25 people. If you're currently using spreadsheets, outgrowing your current FP&A tool, or looking for an enterprise-grade FP&A tool without the enterprise price tag, FinanceOS is built for you." },
          { q: "How does the AI Copilot work?", a: "Our AI reads your full financial model — actuals, budgets, forecasts, and benchmarks. Ask any question in plain English and get a sourced, reasoned answer. Unlike other tools, we show our work so you can verify every insight. Powered by Claude with your API key stored server-side." },
          { q: "What integrations do you support?", a: "Native integrations including NetSuite, Salesforce, Stripe, Snowflake, Rippling, QuickBooks, Xero, Plaid, and more. Bi-directional sync with < 5 minute latency. We're one of the only FP&A platforms with native banking data via Plaid." },
          { q: "Is my data secure?", a: "SOC 2 Type II architecture, AES-256 encryption at rest and in transit, row-level security in Supabase, HSTS + Content Security Policy headers, and zero cross-tenant data leakage. Your data never leaves your tenant." },
          { q: "What does FinanceOS cost?", a: "Starter: $499/mo (annual). Growth: $1,499/mo. Business: $3,999/mo. Enterprise: custom pricing. All plans include a 30-day money-back guarantee — subscribe risk-free." },
          { q: "Can I migrate from my current FP&A platform?", a: "Yes. We provide a guided migration path with a dedicated onboarding specialist. Most migrations complete in 2-3 weeks with full historical data preservation." },
          { q: "What makes FinanceOS different from startup-focused tools?", a: "Startup-focused tools work for early-stage companies. FinanceOS serves mid-market teams that need multi-entity consolidation, intercompany elimination, and board-ready reporting. We also have published transparent pricing — most competitors do not." },
          { q: "Do you offer a money-back guarantee?", a: "Yes — all plans include a 30-day money-back guarantee. Subscribe, connect your data, and if you're not satisfied within 30 days, contact us for a full refund. No questions asked." },
          { q: "Do you offer custom pricing for large teams?", a: "Yes. Enterprise agreements have no seat limits, no entity caps, and no usage ceilings. We offer multi-year committed spend discounts, custom SLAs, dedicated TAMs, on-premises deployment, and SOX-compliant audit trails. Contact sales for a proposal." },
        ].map((faq, i) => (
          <details key={i} style={{ borderBottom: `1px solid ${lp.border}80`, cursor: "pointer", opacity: faqVis ? 1 : 0, transform: faqVis ? "translateY(0)" : "translateY(12px)", transition: `all 0.4s ease-out ${0.15 + i * 0.04}s` }}>
            <summary style={{ padding: "20px 0", fontSize: 15, fontWeight: 600, color: lp.text, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "color 0.2s" }}>
              {faq.q}
              <ChevronDown size={16} color={lp.textDim} style={{ flexShrink: 0, transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)" }} />
            </summary>
            <div style={{ padding: "0 0 20px", fontSize: 13, color: lp.textSub, lineHeight: 1.75 }}>{faq.a}</div>
          </details>
        ))}
      </div>
      ); })()}

      {/* Security & Trust — Premium */}
      {(() => { const [secRef, secVis] = useScrollReveal(0.08); return (
      <div id="security" ref={secRef} style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56, opacity: secVis ? 1 : 0, transform: secVis ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 24, background: `linear-gradient(135deg, ${lp.green}0c, ${lp.accent}06)`, border: `1px solid ${lp.green}18`, fontSize: 10, fontWeight: 700, color: lp.green, marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <Shield size={12} color={lp.green} strokeWidth={2.5} />Security
          </div>
          <h2 style={{ fontSize: isMobile ? 30 : 40, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14, color: lp.text, lineHeight: 1.15 }}>Enterprise-grade security</h2>
          <p style={{ fontSize: 16, color: lp.textDim, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>Your financial data deserves bank-level protection. We build security into every layer.</p>
        </div>
        {/* Security shield visual + grid */}
        <div style={{ position: "relative" }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${lp.green}08 0%, transparent 70%)`, pointerEvents: "none" }} />
          {/* Top row — 2 large cards */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16, position: "relative" }}>
            {[
              { title: "SOC 2 Type II", sub: "Audit-ready architecture with full access logging, role-based controls, and automated compliance evidence generation.", badge: "AUDIT-READY", Icon: Shield, color: lp.green, stat: "100%", statLabel: "Audit coverage" },
              { title: "AES-256 Encryption", sub: "Military-grade encryption at rest and in transit. Zero plaintext storage of credentials or PII.", badge: "AT REST + TRANSIT", Icon: Lock, color: lp.accent, stat: "256-bit", statLabel: "Encryption standard" },
            ].map((s, si) => (
              <div key={s.title} style={{ background: lpMode === "dark" ? `linear-gradient(145deg, ${lp.cardBg}, ${s.color}04)` : lp.cardBg, border: `1px solid ${lp.border}`, borderRadius: 16, padding: isMobile ? "24px 20px" : "28px 24px", transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)", cursor: "default", position: "relative", overflow: "hidden", opacity: secVis ? 1 : 0, transform: secVis ? "scale(1) translateY(0)" : "scale(0.92) translateY(20px)", transitionDelay: `${0.1 + si * 0.12}s` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}40`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${s.color}12`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Corner accent */}
                <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at 100% 0%, ${s.color}08 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${s.color}18, ${s.color}08)`, border: `1px solid ${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <s.Icon size={22} color={s.color} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 4, background: `${s.color}0a`, color: s.color, display: "inline-block", marginBottom: 8, letterSpacing: "0.07em" }}>{s.badge}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: lp.text }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: lp.textDim, lineHeight: 1.65, marginBottom: 14 }}>{s.sub}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.stat}</span>
                      <span style={{ fontSize: 11, color: lp.textFaint, fontWeight: 600 }}>{s.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Bottom row — 2 cards + center trust score */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, position: "relative" }}>
            {[
              { title: "Row-Level Security", sub: "Every database query scoped to your organization via Supabase RLS. Zero cross-tenant data leakage.", badge: "SUPABASE RLS", Icon: Layers, color: lp.purple, stat: "0", statLabel: "Cross-tenant leaks" },
              { title: "HSTS + CSP Headers", sub: "Strict Transport Security, Content Security Policy, X-Frame-Options, and 5 additional security headers.", badge: "VERCEL EDGE", Icon: Globe, color: "#22d3ee", stat: "A+", statLabel: "Security rating" },
            ].map((s, si) => (
              <div key={s.title} style={{ background: lpMode === "dark" ? `linear-gradient(145deg, ${lp.cardBg}, ${s.color}04)` : lp.cardBg, border: `1px solid ${lp.border}`, borderRadius: 16, padding: isMobile ? "24px 20px" : "28px 24px", transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)", cursor: "default", position: "relative", overflow: "hidden", opacity: secVis ? 1 : 0, transform: secVis ? "scale(1) translateY(0)" : "scale(0.92) translateY(20px)", transitionDelay: `${0.35 + si * 0.12}s` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}40`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${s.color}12`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = lp.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at 100% 0%, ${s.color}08 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${s.color}18, ${s.color}08)`, border: `1px solid ${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <s.Icon size={22} color={s.color} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 4, background: `${s.color}0a`, color: s.color, display: "inline-block", marginBottom: 8, letterSpacing: "0.07em" }}>{s.badge}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: lp.text }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: lp.textDim, lineHeight: 1.65, marginBottom: 14 }}>{s.sub}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.stat}</span>
                      <span style={{ fontSize: 11, color: lp.textFaint, fontWeight: 600 }}>{s.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Trust bar */}
          <div style={{ marginTop: 24, padding: "16px 24px", borderRadius: 12, background: lpMode === "dark" ? `linear-gradient(135deg, ${lp.green}06, ${lp.accent}04)` : `linear-gradient(135deg, ${lp.green}08, ${lp.accent}06)`, border: `1px solid ${lp.green}12`, display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 16 : 40, flexWrap: "wrap" }}>
            {[
              { label: "Uptime SLA", value: "99.99%" },
              { label: "Penetration tested", value: "Quarterly" },
              { label: "Data residency", value: "US / EU" },
              { label: "Incident response", value: "<1hr" },
              { label: "Backup frequency", value: "Continuous" },
            ].map(t => (
              <div key={t.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: lp.text, fontFamily: "'JetBrains Mono', monospace" }}>{t.value}</div>
                <div style={{ fontSize: 9, color: lp.textFaint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      ); })()}

      {/* Ecosystem — Vaultline Suite */}
      {(() => { const [ecoRef, ecoVis] = useScrollReveal(0.1); return (
      <div ref={ecoRef} style={{ padding: isMobile ? "40px 20px" : "60px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40, opacity: ecoVis ? 1 : 0, transform: ecoVis ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, color: lp.text }}>Part of the Vaultline Suite</h2>
          <p style={{ fontSize: 15, color: lp.textDim, maxWidth: 560, margin: "0 auto" }}>FinanceOS works standalone or as part of a unified finance ecosystem. Bundle all three and save 15%.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { name: "Vaultline", desc: "Cloud-native treasury management. Real-time cash position, AI forecasting, multi-currency FX, and bank connectivity.", color: "#22d3ee", market: "Mid-market Treasury", price: "$499-$2,499/mo" },
            { name: "FinanceOS", desc: "AI-powered FP&A platform. Variance detection, scenario modeling, consolidation, and natural language querying.", color: lp.accent, market: "FP&A / Planning", price: "$599-$4,799/mo", current: true },
            { name: "Parallax", desc: "Aerospace supplier compliance OS. ITAR/EAR tracking, audit trails, supplier risk scoring, and regulatory mapping.", color: lp.gold, market: "Aerospace Compliance", price: "$799-$3,999/mo" },
          ].map((p, pi) => (
            <div key={p.name} style={{ background: lp.cardBg, border: `1px solid ${p.current ? p.color + "40" : lp.border}`, borderRadius: 12, padding: 24, position: "relative", transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)", opacity: ecoVis ? 1 : 0, transform: ecoVis ? "scale(1) translateY(0)" : "scale(0.92) translateY(16px)", transitionDelay: `${0.1 + pi * 0.1}s` }}>
              {p.current && <div style={{ position: "absolute", top: -8, right: 16, padding: "3px 10px", borderRadius: 4, background: p.color, fontSize: 9, fontWeight: 700, color: "#000" }}>CURRENT PRODUCT</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
                <span style={{ fontSize: 16, fontWeight: 800, color: lp.text }}>{p.name}</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: p.color, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.market}</div>
              <div style={{ fontSize: 13, color: lp.textDim, lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</div>
              <div style={{ fontSize: 12, color: lp.textSub, fontWeight: 600 }}>{p.price}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: 28, background: `linear-gradient(135deg, ${lp.accent}08, ${lp.purple}08)`, border: `1px solid ${lp.accent}20`, borderRadius: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: lp.text }}>Vaultline Suite Bundle</div>
          <div style={{ fontSize: 14, color: lp.textSub, marginBottom: 12 }}>Treasury + FP&A + Compliance — the only unified mid-market finance stack.</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: lp.text }}>$2,799</span>
            <span style={{ fontSize: 14, color: lp.textDim }}>/mo · Save 15%</span>
          </div>
          <button className="fos-cta-primary" onClick={enterDemo} style={{ fontSize: 14, padding: "12px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${lp.gradFrom}, ${lp.gradTo})`, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: `0 6px 24px ${lp.accent}25` }}>Subscribe — Full Suite</button>
        </div>
      </div>
      ); })()}

      {/* ═══ FUNDRAISER — Seed Round with translucent video panel ═══ */}
      <div id="invest" style={{ padding: isMobile ? "40px 20px" : "80px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ borderRadius: 24, overflow: "hidden", position: "relative", minHeight: isMobile ? "auto" : 520 }}>
          {/* Full background video — visible through translucent overlay */}
          <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", filter: lpMode === "dark" ? "brightness(0.4) saturate(1.2)" : "brightness(0.7) saturate(1.1)" }}>
            <source src="/media/meeting-bg.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay for readability */}
          <div style={{ position: "absolute", inset: 0, background: lpMode === "dark" ? `linear-gradient(160deg, rgba(10,12,20,0.75) 0%, rgba(10,12,20,0.55) 40%, rgba(10,12,20,0.70) 100%)` : `linear-gradient(160deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.65) 40%, rgba(255,255,255,0.78) 100%)`, backdropFilter: "blur(2px)", pointerEvents: "none" }} />
          {/* Accent glow */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${lp.accent}15 0%, transparent 70%)`, pointerEvents: "none" }} />
          {/* Content */}
          <div style={{ position: "relative", zIndex: 2, padding: isMobile ? "36px 24px" : "56px 52px", display: isMobile ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            {/* Left — Text + CTA */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 24, background: `rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.08)`, backdropFilter: "blur(8px)", border: `1px solid rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.1)`, fontSize: 10, fontWeight: 700, color: lpMode === "dark" ? "#fff" : lp.text, marginBottom: 24, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: lp.accent, boxShadow: `0 0 8px ${lp.accent}60`, animation: "pulse 2s infinite" }} />Private — Accredited Investors
              </div>
              <h2 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14, color: lpMode === "dark" ? "#fff" : lp.text, lineHeight: 1.15 }}>Building the operating<br />system for modern finance</h2>
              <p style={{ fontSize: 15, color: lpMode === "dark" ? "rgba(255,255,255,0.7)" : lp.textDim, maxWidth: 420, lineHeight: 1.75, marginBottom: 28 }}>FinanceOS is raising its seed round. Term sheet, traction data, and financial model are available under NDA for qualified investors.</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
                <button className="fos-cta-primary" onClick={() => { fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "investor_inquiry", source: "investor_deck_cta" }) }).catch(() => {}); window.open("mailto:investors@finance-os.app?subject=FinanceOS%20—%20Investor%20Deck%20Request&body=Name:%0AFirm:%0ACheck%20size%20range:%0A", "_blank"); }} style={{ fontSize: 14, padding: "14px 28px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${lp.gradFrom}, ${lp.gradTo})`, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: `0 8px 32px ${lp.accent}30`, transition: "all 0.2s" }}
                >Request Investor Deck</button>
                <button className="fos-cta-secondary" onClick={() => { fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "investor_inquiry", inquiry_type: "Meeting Request", source: "investor_call_cta" }) }).catch(() => {}); window.open("mailto:investors@finance-os.app?subject=FinanceOS%20—%20Meeting%20Request", "_blank"); }} style={{ fontSize: 14, padding: "14px 28px", borderRadius: 12, border: `1px solid rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.15)`, background: `rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.06)`, backdropFilter: "blur(8px)", color: lpMode === "dark" ? "#fff" : lp.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s" }}
                >Schedule a Call</button>
              </div>
              <div style={{ display: "flex", gap: 20, fontSize: 11, color: lpMode === "dark" ? "rgba(255,255,255,0.45)" : lp.textFaint }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Lock size={10} />NDA required</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Shield size={10} />Accredited only</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Activity size={10} />Rolling close</span>
              </div>
            </div>
            {/* Right — Traction metrics glass panel */}
            <div style={{ marginTop: isMobile ? 28 : 0 }}>
              <div style={{ background: `rgba(${lpMode === "dark" ? "15,18,30" : "255,255,255"},0.55)`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderRadius: 20, border: `1px solid rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.08)`, padding: "28px 24px", boxShadow: lpMode === "dark" ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: lp.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                  <BarChart3 size={12} color={lp.accent} />Traction Metrics
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {[
                    { label: "ARR", value: "$48.6M", delta: "+24% YoY", color: lp.green, Icon: TrendingUp },
                    { label: "NDR", value: "118%", delta: "Best-in-class", color: lp.accent, Icon: Activity },
                    { label: "Burn Multiple", value: "0.8x", delta: "Efficient", color: lp.purple, Icon: Target },
                    { label: "Gross Margin", value: "84.7%", delta: "+2.1pp", color: "#22d3ee", Icon: BarChart3 },
                  ].map(m => (
                    <div key={m.label} style={{ padding: "16px 14px", borderRadius: 14, background: `rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.04)`, border: `1px solid rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.06)`, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = `rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.08)`; e.currentTarget.style.borderColor = `${m.color}30`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.04)`; e.currentTarget.style.borderColor = `rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.06)`; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <m.Icon size={11} color={m.color} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: lpMode === "dark" ? "rgba(255,255,255,0.5)" : lp.textFaint, textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</span>
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: lpMode === "dark" ? "#fff" : lp.text, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{m.value}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: m.color, marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
                        <ArrowUpRight size={10} />{m.delta}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mini chart placeholder */}
                <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: `rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.03)`, border: `1px solid rgba(${lpMode === "dark" ? "255,255,255" : "0,0,0"},0.05)` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: lpMode === "dark" ? "rgba(255,255,255,0.5)" : lp.textFaint, textTransform: "uppercase", letterSpacing: "0.05em" }}>Revenue Trajectory</span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: lp.green }}>On track for $60M</span>
                  </div>
                  <svg viewBox="0 0 200 40" style={{ width: "100%", height: 40 }}>
                    <defs><linearGradient id="fosInvGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lp.accent} stopOpacity="0.3" /><stop offset="100%" stopColor={lp.accent} stopOpacity="0" /></linearGradient></defs>
                    <path d="M0,35 Q25,32 50,28 T100,18 T150,10 T200,3" fill="none" stroke={lp.accent} strokeWidth="2" strokeLinecap="round" />
                    <path d="M0,35 Q25,32 50,28 T100,18 T150,10 T200,3 L200,40 L0,40Z" fill="url(#fosInvGrad)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${lp.border}`, padding: "48px 48px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1.8fr 1fr 1fr 1fr", gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <FosLogo size={28} />
              <span style={{ fontSize: 15, fontWeight: 800 }}>Finance<span style={{ fontWeight: 400, opacity: 0.6 }}>OS</span></span>
            </div>
            <p style={{ fontSize: 12, color: lp.textFaint, lineHeight: 1.7, maxWidth: 240 }}>AI-powered financial planning for modern finance teams. Part of the Vaultline Suite.</p>
            <div style={{ marginTop: 8, fontSize: 11 }}>
              <a href="mailto:support@finance-os.app" style={{ color: lp.textDim, textDecoration: "none" }}>support@finance-os.app</a>
            </div>
          </div>
          {[
            { title: "Product", links: [
              { link: "Dashboard", action: "demo" },
              { link: "AI Copilot", action: "demo" },
              { link: "Forecasting", action: "demo" },
              { link: "Consolidation", action: "demo" },
              { link: "Integrations", action: "demo" },
            ]},
            { title: "Use Cases", links: [
              { link: "For Finance Teams", url: "/use-cases/finance" },
              { link: "Budget Planning", url: "/use-cases/budget-planning" },
              { link: "Consolidation", url: "/use-cases/consolidation" },
              { link: "Forecasting", url: "/use-cases/forecasting" },
              { link: "Revenue Planning", url: "/use-cases/revenue-planning" },
              { link: "SaaS FP&A Guide", url: "/use-cases/saas-fpa" },
            ]},
            { title: "Company", links: [
              { link: "Privacy Policy", url: "/privacy" },
              { link: "Terms of Service", url: "/terms" },
              { link: "Partner Program", url: "mailto:partners@finance-os.app?subject=FinanceOS%20Partner%20Program%20Interest" },
              { link: "Vaultline Suite", url: "https://vaultline.vercel.app" },
              { link: "Investor Deck", url: "https://gamma.app/generations/Yur9wWOsn4UTWML1pu8nH" },
            ]},
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, color: lp.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{col.title}</div>
              {col.links.map(item => (
                <div key={item.link} onClick={() => {
                  if (item.url?.startsWith("/")) window.location.href = item.url;
                  else if (item.url) window.open(item.url, "_blank");
                  else if (item.action === "demo") enterDemo();
                }} style={{ fontSize: 12, color: lp.textFaint, marginBottom: 8, cursor: item.url || item.action ? "pointer" : "default", display: "flex", alignItems: "center", gap: 4 }}
                  onMouseEnter={e => { if (item.url || item.action) e.currentTarget.style.color = lp.textSub; }}
                  onMouseLeave={e => e.currentTarget.style.color = lp.textFaint}
                >{item.link}{item.sub && <span style={{ fontSize: 10, color: "#3d4558", marginLeft: 2 }}>· {item.sub}</span>}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: `1px solid ${lp.border}`, fontSize: 11, color: lp.textFaint, flexWrap: "wrap", gap: 12 }}>
          <span>© {new Date().getFullYear()} Financial Holding LLC · All rights reserved</span>
          <span style={{ fontSize: 9, color: lp.textFaint }}>Photos by <a href="https://unsplash.com/?utm_source=financeos&utm_medium=referral" target="_blank" rel="noopener" style={{ color: lp.textDim, textDecoration: "none" }}>Unsplash</a></span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Locale picker — premium dropdowns */}
            {[
              { key: "fos_lang", label: "Language", Icon: Globe, options: [["en","English"],["es","Espa\u00f1ol"],["fr","Fran\u00e7ais"],["de","Deutsch"],["ja","\u65e5\u672c\u8a9e"],["zh","\u4e2d\u6587"],["pt","Portugu\u00eas"],["ko","\ud55c\uad6d\uc5b4"],["it","Italiano"],["nl","Nederlands"]] },
              { key: "fos_currency", label: "Currency", Icon: DollarSign, options: [["USD","USD ($)"],["EUR","EUR (\u20ac)"],["GBP","GBP (\u00a3)"],["CAD","CAD (C$)"],["AUD","AUD (A$)"],["JPY","JPY (\u00a5)"],["CHF","CHF"],["BRL","BRL (R$)"],["INR","INR (\u20b9)"],["KRW","KRW (\u20a9)"]] },
            ].map(sel => (
              <div key={sel.key} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 6px 4px 8px", borderRadius: 8, border: `1px solid ${lp.border}`, background: lp.cardBg || "transparent", transition: "border-color 0.15s" }}>
                <sel.Icon size={10} color={lp.textFaint} />
                <select defaultValue={(() => { try { return localStorage.getItem(sel.key) || sel.options[0][0]; } catch { return sel.options[0][0]; } })()} onChange={e => { try { localStorage.setItem(sel.key, e.target.value); } catch {} }} style={{
                  fontSize: 10, padding: "2px 14px 2px 2px", borderRadius: 4, border: "none",
                  background: "transparent", color: lp.textDim, fontFamily: "'DM Sans', system-ui", fontWeight: 600,
                  cursor: "pointer", appearance: "none", WebkitAppearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23636d84'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 2px center", outline: "none",
                }}>
                  {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>Built with care in New Hampshire</span>
            {[
              { label: "LinkedIn", url: "https://linkedin.com/company/finance-os" },
              { label: "X", url: "https://x.com/financeos_app" },
            ].map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{ cursor: "pointer", color: lp.textFaint, transition: "color 0.15s", textDecoration: "none", fontSize: 11, fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.color = lp.accent}
                onMouseLeave={e => e.currentTarget.style.color = lp.textFaint}
              >{s.label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {authModal && <AuthModal mode={authModal} onAuth={handleAuth} onClose={() => setAuthModal(null)} />}

      {/* Demo Request Modal */}
      {demoModal && (
        <div onClick={() => !demoSubmitting && setDemoModal(false)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 480, maxHeight: "90vh", overflow: "auto", background: "rgba(16,19,26,0.7)", border: "1px solid #1e2230", borderRadius: 20, padding: "36px 32px", boxShadow: "0 24px 80px rgba(0,0,0,0.5)", animation: "cmdIn 0.2s ease", position: "relative" }}>
            {!demoSuccess ? (<>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #60a5fa15, #a78bfa08)", border: "1px solid #60a5fa12", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><MessageSquare size={22} color="#60a5fa" strokeWidth={1.8} /></div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>Request a Demo</div>
              <div style={{ fontSize: 12, color: "#8b92a5", marginTop: 4 }}>See how FinanceOS can work for your team. We'll reach out within 24 hours.</div>
            </div>
            {[
              { key: "full_name", label: "Full Name", type: "text", placeholder: "Jane Smith", required: true },
              { key: "email", label: "Work Email", type: "email", placeholder: "jane@company.com", required: true },
              { key: "company", label: "Company", type: "text", placeholder: "Company name" },
              { key: "title", label: "Title / Role", type: "text", placeholder: "VP Finance, FP&A Director, CFO..." },
            ].map((f, fi) => (
              <div key={f.key} style={{ marginBottom: 12, animation: `fosFadeSlideUp 0.4s ease-out ${0.05 + fi * 0.06}s both` }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#8b92a5", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>{f.label}{f.required && <span style={{ color: "#ef4444" }}> *</span>}</label>
                <input className="fos-input-glow" value={demoForm[f.key]} onChange={e => setDemoForm(prev => ({ ...prev, [f.key]: e.target.value }))} type={f.type} placeholder={f.placeholder}
                  style={{ width: "100%", fontSize: 13, padding: "10px 14px", borderRadius: 8, border: "1px solid #1e2230", background: "#0b0c10", color: "#f0f2f5", fontFamily: "inherit", outline: "none" }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#8b92a5", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Company Size</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["1-10", "11-50", "51-200", "201-500", "500+"].map(s => (
                  <button key={s} onClick={() => setDemoForm(prev => ({ ...prev, company_size: s }))} style={{
                    fontSize: 11, padding: "6px 12px", borderRadius: 6, border: `1px solid ${demoForm.company_size === s ? "#60a5fa" : "#1e2230"}`,
                    background: demoForm.company_size === s ? "rgba(96,165,250,0.08)" : "transparent",
                    color: demoForm.company_size === s ? "#60a5fa" : "#8b92a5", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#8b92a5", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>What are you looking to solve?</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Replace spreadsheets", "Outgrowing current FP&A", "Multi-entity consolidation", "AI-powered forecasting", "Board reporting", "Other"].map(u => (
                  <button key={u} onClick={() => setDemoForm(prev => ({ ...prev, use_case: u }))} style={{
                    fontSize: 10, padding: "5px 10px", borderRadius: 5, border: `1px solid ${demoForm.use_case === u ? "#a78bfa" : "#1e2230"}`,
                    background: demoForm.use_case === u ? "rgba(167,139,250,0.08)" : "transparent",
                    color: demoForm.use_case === u ? "#a78bfa" : "#636d84", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                  }}>{u}</button>
                ))}
              </div>
            </div>
            <button onClick={async () => {
              if (!demoForm.full_name || !demoForm.email?.includes("@")) return;
              setDemoSubmitting(true);
              try {
                // Fire notification pipeline — sends email alert to sales
                await fetch("/api/notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "demo_request", ...demoForm, source: "homepage_modal" }),
                });
              } catch {}
              try {
                // Legacy edge function call (backward compatible)
                await fetch(`${SUPABASE_URL}/functions/v1/request-demo`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
                  body: JSON.stringify(demoForm),
                });
              } catch {}
              // Enroll in drip onboarding pipeline
              try {
                await fetch("/api/drip", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "start", email: demoForm.email, lead_data: { ...demoForm, source: "homepage_modal", interest_type: "demo" } }),
                });
              } catch {}
              // Fire conversion events
              if (typeof window !== "undefined") {
                if (window.gtag) {
                  window.gtag("event", "conversion", { send_to: "AW-18032992189/6hiYCNWJoY0cEL2_5pZD", value: 1.0, currency: "USD" });
                  window.gtag("event", "generate_lead", { event_category: "engagement", event_label: "demo_request_homepage" });
                }
                if (window.fbq) window.fbq("track", "Lead");
                if (window.plausible) window.plausible("DemoRequest", { props: { source: "homepage_modal" }});
              }
              setDemoSubmitting(false);
              setDemoSuccess(true);
            }} disabled={demoSubmitting || !demoForm.full_name || !demoForm.email?.includes("@")} style={{
              width: "100%", fontSize: 14, padding: "13px", borderRadius: 10, border: "none",
              background: demoSubmitting ? "#1e2230" : "linear-gradient(135deg, #60a5fa, #a78bfa)",
              color: "#fff", cursor: demoSubmitting ? "wait" : "pointer", fontFamily: "inherit", fontWeight: 700,
              opacity: (!demoForm.full_name || !demoForm.email?.includes("@")) ? 0.5 : 1,
              boxShadow: "0 6px 24px rgba(96,165,250,0.25)", transition: "all 0.2s",
            }}>{demoSubmitting ? (<span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />Sending alert...</span>) : "Request Demo Call"}</button>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: "#3d4558" }}>We'll reach out within 24 hours · No commitment required</div>
            </>) : (
            <div style={{ textAlign: "center", padding: "24px 0", animation: "fosScaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
              {/* Animated success checkmark with ripple */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #34d39920, #34d39908)", border: "1px solid #34d39915", display: "inline-flex", alignItems: "center", justifyContent: "center", animation: "fosCardPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both", position: "relative", zIndex: 2 }}><Check size={32} color="#34d399" strokeWidth={3} style={{ animation: "fosCheckPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" }} /></div>
                {/* Ripple rings */}
                <div style={{ position: "absolute", inset: -8, borderRadius: 20, border: "2px solid #34d39915", animation: "fosNotifRipple 1.5s ease-out 0.3s both" }} />
                <div style={{ position: "absolute", inset: -16, borderRadius: 24, border: "1px solid #34d39910", animation: "fosNotifRipple 1.5s ease-out 0.5s both" }} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, animation: "fosFadeSlideUp 0.5s ease-out 0.3s both" }}>Demo request received</div>
              <div style={{ fontSize: 13, color: "#8b92a5", lineHeight: 1.6, marginBottom: 12, animation: "fosFadeSlideUp 0.5s ease-out 0.4s both" }}>We'll reach out to <span style={{ color: "#60a5fa", fontWeight: 600 }}>{demoForm.email}</span> within 24 hours.</div>
              {/* Notification pipeline visual */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20, animation: "fosFadeSlideUp 0.5s ease-out 0.5s both" }}>
                {[
                  { icon: "✓", label: "Received", color: "#34d399", done: true },
                  { icon: "→", label: "Routed", color: "#60a5fa", done: true },
                  { icon: "✉", label: "Alert sent", color: "#a78bfa", done: true },
                ].map((step, si) => (
                  <React.Fragment key={step.label}>
                    {si > 0 && <div style={{ width: 20, height: 2, background: `linear-gradient(90deg, ${[...["#34d399","#60a5fa","#a78bfa"]][si-1]}, ${step.color})`, borderRadius: 1, animation: `fosBarGrow 0.4s ease-out ${0.6 + si * 0.15}s both`, transformOrigin: "left" }} />}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, animation: `fosScaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.5 + si * 0.15}s both` }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${step.color}15`, border: `1px solid ${step.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: step.color }}>{step.icon}</div>
                      <span style={{ fontSize: 8, fontWeight: 700, color: step.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>{step.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", animation: "fosFadeSlideUp 0.5s ease-out 0.7s both" }}>
                <button onClick={() => { setDemoModal(false); setDemoSuccess(false); setDemoForm({ full_name: "", email: "", company: "", title: "", company_size: "", use_case: "", current_tools: "" }); }} style={{ fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "1px solid #1e2230", background: "transparent", color: "#9ea5b8", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}>Close</button>
                <button onClick={() => { setDemoModal(false); setDemoSuccess(false); enterDemo(); }} style={{ fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 4px 16px rgba(96,165,250,0.2)", transition: "all 0.15s" }}>Explore the Demo Now →</button>
              </div>
            </div>
            )}
          </div>
        </div>
      )}

      {/* Privacy Pipeline — Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════
function FinanceOSApp() {
  const [splashDone, setSplashDone] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "Guest", email: "", plan: null });
  const [view, setView] = useState("dashboard");
  const [showPlanPicker, setShowPlanPicker] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Splash screen timer
  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2400);
    return () => clearTimeout(t);
  }, []);
  const [clock, setClock] = useState(() => fmtTime(new Date()));
  const [prevView, setPrevView] = useState(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [drawerKpi, setDrawerKpi] = useState(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiChatThinking, setAiChatThinking] = useState(false);

  // GL data from database — replaces hardcoded PNL_DATA when available
  const [glData, setGlData] = useState(null); // { pnl, summary, source }
  const [glLoading, setGlLoading] = useState(false);

  const fetchGlData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      setGlLoading(true);
      const res = await fetch(`${SUPABASE_URL}/functions/v1/gl-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}`, "apikey": SUPABASE_KEY },
        body: JSON.stringify({ action: "pnl" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.pnl?.length > 0 && data.source === "database") {
          setGlData(data);
          console.log(`[FinanceOS] GL data loaded: ${data.account_count} accounts, ${data.transaction_count} transactions`);
        }
      }
    } catch (e) { console.warn("[FinanceOS] GL data fetch failed:", e); }
    finally { setGlLoading(false); }
  }, []);

  // AI Chat — calls real copilot Edge Function, falls back to canned responses
  const sendAiChat = async (q) => {
    setAiChatMessages(prev => [...prev, { role: "user", content: q }]);
    setAiChatInput("");
    setAiChatThinking(true);
    logActivity(`AI chat: "${q.slice(0, 30)}"`, "action");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/copilot`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}`, "apikey": SUPABASE_KEY },
          body: JSON.stringify({ query: q, context: "floating_chat", history: aiChatMessages.slice(-6) }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.response) {
            setAiChatMessages(prev => [...prev, { role: "assistant", content: data.response }]);
            setAiChatThinking(false);
            return;
          }
        }
      }
    } catch {}

    // Fallback: canned responses (used when ANTHROPIC_API_KEY not set or user is in demo)
    setTimeout(() => {
      const ql = q.toLowerCase();
      let resp = "Based on current data, revenue is tracking ahead of plan by $2.09M (+4.3%), driven primarily by enterprise outperformance. Would you like me to break this down further?";
      if (ql.includes("revenue") || ql.includes("beat")) resp = "Revenue beat of +$2.09M is driven by enterprise ACV expansion (up 28% to $182K avg) and 34% AI module attach rate. Mid-market is slightly under plan. Want me to analyze the mid-market gap?";
      else if (ql.includes("variance") || ql.includes("over budget")) resp = "Top 4 variances this period:\n1. S&M: +$730K over (event spend timing)\n2. R&D: -$420K under (delayed hires)\n3. Enterprise revenue: +$3.3M above\n4. Cloud infra: +$180K over\nWant details on any of these?";
      else if (ql.includes("forecast") || ql.includes("accuracy") || ql.includes("mape")) resp = "Current forecast model runs an ETS + XGBoost + Linear ensemble with 14 drivers. MAPE is 3.2% (industry median 8-12%). Revenue and COGS are strongest at 1.8% MAPE. S&M timing is weakest at 6.1%.";
      else if (ql.includes("churn") || ql.includes("retention")) resp = "Logo churn: 4.2% annualized (8 of 192 accounts). Revenue churn: 2.1% gross, fully offset by 118% NDR. The 2023 cohort is maturing well at 124% NDR.";
      else if (ql.includes("close") || ql.includes("month-end") || ql.includes("month end")) resp = "Month-end close is 72% complete. 4 of 12 tasks remaining: intercompany eliminations, accruals review, revenue reconciliation, and board narrative. Projected close date: March 5.";
      else if (ql.includes("budget") || ql.includes("spend")) resp = "Total operating spend is $8.4M YTD vs $8.1M budget (+3.7%). S&M is the primary driver at +$730K over, partially offset by R&D savings of -$420K from delayed hires.";
      else if (ql.includes("help") || ql.includes("what can")) resp = "I can help with:\n• Revenue analysis and variance detection\n• Forecast accuracy and model performance\n• Budget vs actual comparisons\n• Churn and retention metrics\n• Month-end close status\n• Headcount and spend analysis\n\nJust ask a question about your financial data.";
      setAiChatMessages(prev => [...prev, { role: "assistant", content: resp }]);
      setAiChatThinking(false);
    }, 600 + Math.random() * 400);
  };
  const [period, setPeriod] = useState("FY2025 YTD");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(() => {
    try { const saved = localStorage.getItem("financeos-notif-read"); return saved ? new Set(JSON.parse(saved)) : new Set(); } catch { return new Set(); }
  });
  useEffect(() => { try { localStorage.setItem("financeos-notif-read", JSON.stringify([...notifRead])); } catch {} }, [notifRead]);
  const [navHistory, setNavHistory] = useState(["dashboard"]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem("financeos-sidebar") === "collapsed"; } catch { return false; }
  });
  useEffect(() => { try { localStorage.setItem("financeos-sidebar", sidebarCollapsed ? "collapsed" : "expanded"); } catch {} }, [sidebarCollapsed]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Global activity log — feeds dashboard ticker and notification badge
  const [activityLog, setActivityLog] = useState([
    { t: Date.now() - 120000, msg: "Signed in", type: "auth" },
    { t: Date.now() - 90000, msg: "Viewed Dashboard", type: "nav" },
  ]);
  const logActivity = useCallback((msg, type = "action") => {
    setActivityLog(prev => [{ t: Date.now(), msg, type }, ...prev].slice(0, 50));
  }, []);
  // Close tasks state elevated to app level — persists across view switches
  const [closeTasks, setCloseTasks] = useState(CLOSE_TASKS);
  const [suitePanelOpen, setSuitePanelOpen] = useState(() => {
    try { return localStorage.getItem("financeos-suite-dismissed") !== "true"; } catch { return true; }
  });
  const dismissSuitePanel = () => { setSuitePanelOpen(false); try { localStorage.setItem("financeos-suite-dismissed", "true"); } catch {} };
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
        // CRITICAL: Get a fresh session — the one from onAuthStateChange may be stale
        // (token rotation can happen between the callback firing and this fetch executing)
        try {
          const { data: { session: freshSession } } = await supabase.auth.getSession();
          const token = freshSession?.access_token;
          if (!token) { console.warn("verify-session: no fresh token"); return; }
          const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-session`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "apikey": SUPABASE_KEY,
            },
          });
          if (res.ok) {
            const data = await res.json();
            // Update user info from server (DB has canonical name, not Apple relay)
            if (data.user?.name) {
              setUser(prev => ({ ...prev, name: data.user.name }));
            }
            if (data.org?.plan && data.org.plan !== "demo") {
              setUser(prev => ({ ...prev, plan: data.org.plan }));
              setShowPlanPicker(false);
              setShowOnboarding(false);
            }
            if (data.org?.name) {
              setUser(prev => ({ ...prev, orgName: data.org.name }));
            }
            // Show plan picker only for demo users
            if (data.org?.plan === "demo" || !data.org?.plan) {
              setShowPlanPicker(true);
            }
            // Fetch GL data from database
            fetchGlData();
            // Remove loading splash
            if (typeof window !== "undefined" && window.__fosRemoveSplash) window.__fosRemoveSplash();
          } else if (res.status === 429) {
            // Rate limited — back off and retry once after delay
            const retryAfter = parseInt(res.headers.get("Retry-After") || "30", 10);
            setTimeout(async () => {
              try {
                const { data: { session: retrySession } } = await supabase.auth.getSession();
                if (retrySession?.access_token) {
                  await fetch(`${SUPABASE_URL}/functions/v1/verify-session`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${retrySession.access_token}`, "apikey": SUPABASE_KEY },
                  });
                }
              } catch {}
            }, retryAfter * 1000);
          }
        } catch (e) { console.warn("verify-session failed"); }
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
        // Plan picker is now controlled by verify-session response, not the sign-in event.
        // If verify-session returns plan === 'demo', the plan picker will be shown there.
        // This prevents paid users from seeing the plan picker flash on every login.
      } else if (event === "SIGNED_OUT") {
        if (mounted) { setLoggedIn(false); setUser({ name: "Guest", email: "" }); setView("dashboard"); }
      }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  // Handle Stripe checkout redirect: ?checkout=success&session_id=cs_xxx
  // SECURITY: Plan is NEVER read from URL params. It's verified server-side
  // via the Stripe session_id. Anyone can fake ?plan=business — only the
  // verify-checkout Edge Function returns the real plan from Stripe.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get("checkout");
    const sessionId = params.get("session_id");
    const checkoutPlan = params.get("plan"); // Used ONLY for toast display, never trusted

    if (checkoutStatus === "success" && sessionId?.startsWith("cs_")) {
      // Clean URL immediately to prevent re-processing on refresh
      window.history.replaceState(null, "", window.location.pathname);

      // Verify the checkout server-side before assigning any plan
      (async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.access_token) {
            toast("Please sign in to verify your subscription", "warning");
            return;
          }

          toast("Verifying your payment...", "info");

          const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`,
              "apikey": SUPABASE_KEY,
            },
            body: JSON.stringify({ session_id: sessionId }),
          });

          const data = await res.json();

          if (data.verified && data.plan) {
            // Plan comes from Stripe via server — this is the ONLY trusted source
            setUser(prev => ({ ...prev, plan: data.plan }));
            toast(`${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)} plan activated — welcome to FinanceOS!`, "success");
            setShowPlanPicker(false);
            setShowOnboarding(true);
          } else if (data.reason === "payment_incomplete") {
            toast("Payment is still processing — your plan will activate shortly", "warning");
            setShowPlanPicker(true);
          } else {
            toast("Could not verify payment. If you completed checkout, your plan will activate within a few minutes via webhook.", "warning");
            setShowPlanPicker(true);
          }
        } catch {
          // Fallback: webhook will provision the plan async even if verification fails
          toast("Payment verification pending — your plan will activate shortly", "info");
          setShowPlanPicker(true);
        }
      })();
    } else if (checkoutStatus === "cancel") {
      toast("Checkout cancelled — you can choose a plan anytime", "info");
      setShowPlanPicker(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
    // QuickBooks OAuth callback handling
    const integration = params.get("integration");
    const integrationStatus = params.get("status");
    if (integration === "quickbooks") {
      window.history.replaceState(null, "", window.location.pathname);
      if (integrationStatus === "success") {
        toast("QuickBooks connected successfully! Initial sync starting...", "success");
        setView("integrations");
      } else if (integrationStatus === "denied") {
        toast("QuickBooks connection was cancelled", "warning");
      } else if (integrationStatus === "error") {
        toast(`QuickBooks connection failed: ${params.get("reason") || "unknown error"}`, "error");
      }
    }
  }, [loggedIn]);

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

  const [mode, setMode] = useState("light");
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

  // Scroll-to-top FAB visibility
  useEffect(() => {
    const el = document.querySelector("[data-content-area]");
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [view]);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setClock(fmtTime(new Date())), 30000);
    return () => clearInterval(t);
  }, []);

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
  const viewTitles = { dashboard: "Dashboard", copilot: "AI Copilot", pnl: "P&L Statement", forecast: "Forecast Optimizer", consolidation: "Multi-Entity Consolidation", models: "Scenario Models", close: "Close Tasks", team: "Team", integrations: "Integrations", admin: "Admin Console", investor: "Investor Metrics", settings: "Settings" };
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
      try { document.querySelector("[data-content-area]")?.scrollTo(0, 0); } catch {}
    }, 280);
    setNavHistory(prev => {
      const next = [...prev];
      const idx = next.indexOf(v);
      if (idx >= 0) return next.slice(0, idx + 1);
      return [...next, v];
    });
    logActivity(`Opened ${viewTitles[v] || v}`, "nav");
  }, [view, logActivity]);

  // Keyboard shortcuts
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(true); }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") { e.preventDefault(); setSidebarCollapsed(prev => !prev); }
      if (e.key === "Escape") { setCmdOpen(false); setDrawerKpi(null); setNotifOpen(false); setShortcutsOpen(false); }
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") { setShortcutsOpen(true); }
      // ⌘1-9 view navigation
      const viewKeys = ["dashboard", "copilot", "pnl", "forecast", "consolidation", "models", "close", "integrations", "admin"];
      if ((e.metaKey || e.ctrlKey) && e.key >= "1" && e.key <= "9" && viewKeys[+e.key - 1]) { e.preventDefault(); navigate(viewKeys[+e.key - 1]); }
      // ⌘E quick export
      if ((e.metaKey || e.ctrlKey) && e.key === "e" && !e.shiftKey) { e.preventDefault(); toast("Export shortcut — use CSV/PDF buttons on current view", "info"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleCmd = (item) => {
    if (item.id.startsWith("ask-")) { navigate("copilot"); }
    else { navigate(item.id); }
  };


  // Show marketing page when not logged in
  // Remove loading splash after first render
  useEffect(() => {
    if (typeof window !== "undefined" && window.__fosRemoveSplash) {
      // Slight delay so React has painted
      setTimeout(() => window.__fosRemoveSplash(), 200);
    }
  }, []);

  // ── SPLASH SCREEN ──
  if (!splashDone) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg, #06080c 0%, #0d1117 50%, #0a0f1a 100%)", animation: "fosSplashFade 2.4s ease-in forwards" }}>
        {/* Ambient orbs */}
        <div style={{ position: "absolute", top: "20%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(91,156,245,0.08) 0%, transparent 70%)", filter: "blur(80px)", animation: "fosPulseSubtle 3s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "25%", right: "25%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(161,129,247,0.06) 0%, transparent 70%)", filter: "blur(60px)", animation: "fosPulseSubtle 3s ease-in-out infinite 0.5s" }} />
        {/* Logo */}
        <div style={{ animation: "fosSplashLogo 1.8s cubic-bezier(0.22,1,0.36,1) forwards", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #5b9cf5, #a181f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(91,156,245,0.3)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /><polyline points="7 10 12 7 17 10" /></svg>
            </div>
            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: "#eef0f6" }}>Finance<span style={{ color: "#5b9cf5" }}>OS</span></span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#636d84", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>AI-Powered Financial Intelligence</div>
          {/* Loading bar */}
          <div style={{ width: 200, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginTop: 24, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #5b9cf5, #a181f7)", animation: "fosSplashBar 2s ease-in-out forwards" }} />
          </div>
          <div style={{ fontSize: 10, color: "#3d4558", marginTop: 8, animation: "fosSplashPulse 1.5s ease-in-out infinite" }}>Initializing platform...</div>
        </div>
        <style>{`
          @keyframes fosSplashFade{0%{opacity:1}85%{opacity:1}100%{opacity:0;pointer-events:none}}
          @keyframes fosSplashLogo{0%{transform:scale(0.85);opacity:0}40%{transform:scale(1.02);opacity:1}60%{transform:scale(1);opacity:1}100%{transform:scale(1);opacity:1}}
          @keyframes fosSplashBar{0%{width:0}70%{width:85%}100%{width:100%}}
          @keyframes fosSplashPulse{0%,100%{opacity:0.4}50%{opacity:1}}
          @keyframes fosPulseSubtle{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        `}</style>
      </div>
    );
  }

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
    <div style={{ display: "flex", height: "100vh", width: "100%", background: c.bg, color: c.text, fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 14, overflow: "hidden", transition: "background 0.4s ease, color 0.3s ease" }}>
      {/* Subtle dot grid background — works in both themes */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, ${mode === "dark" ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.035)"} 0.5px, transparent 0.5px)`, backgroundSize: "32px 32px", pointerEvents: "none", zIndex: 0 }} />
      {/* Subtle vignette gradient — adds depth to edges */}
      <div style={{ position: "fixed", inset: 0, background: mode === "dark"
        ? "radial-gradient(ellipse at 50% 0%, rgba(91,156,245,0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(7,8,10,0.6) 0%, transparent 50%)"
        : "radial-gradient(ellipse at 50% 0%, rgba(29,110,193,0.04) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(243,244,248,0.5) 0%, transparent 50%)",
        pointerEvents: "none", zIndex: 0 }} />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Manrope', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        button { font-family: inherit; font-size: inherit; color: inherit; cursor: pointer; }
        a { text-decoration: none; color: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${c.borderBright}; border-radius: 3px; transition: background 0.3s; }
        ::-webkit-scrollbar-thumb:hover { background: ${c.textFaint}; }
        input[type="range"] { cursor: pointer; }
        input[type="range"]::-webkit-slider-thumb { cursor: pointer; }
        ::selection { background: ${c.accentMid || c.accentDim}; }
        /* Focus-visible: keyboard users see accent ring, mouse users don't */
        *:focus-visible { outline: 2px solid ${c.accent}; outline-offset: 2px; border-radius: 4px; }
        *:focus:not(:focus-visible) { outline: none; }
        /* Skip-to-content for screen readers */
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        /* Smooth theme crossfade on structural elements */
        .theme-transition {
          transition: background 0.4s ease, background-color 0.4s ease, color 0.3s ease, border-color 0.4s ease, box-shadow 0.4s ease;
        }
        @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes chartCardHover { from { transform: translateY(0); } to { transform: translateY(-2px); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes cmdIn { from { opacity: 0; transform: scale(0.96) translateY(-8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fosFadeSlideUp{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes themeSwitch { 0% { opacity: 0.92; } 100% { opacity: 1; } }
        @keyframes rippleOut { 0% { transform: scale(0); opacity: 0.4; } 100% { transform: scale(4); opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
        @keyframes logoScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes chartPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(91,156,245,0.4); } 50% { box-shadow: 0 0 0 8px rgba(91,156,245,0); } }
        @keyframes dotGlow { 0%,100% { filter: drop-shadow(0 0 2px currentColor); } 50% { filter: drop-shadow(0 0 8px currentColor); } }
        @keyframes countUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes chartReveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes barGrow { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
        @keyframes barGrowUp { from { transform: scaleY(0); transform-origin: bottom; } to { transform: scaleY(1); transform-origin: bottom; } }
        @keyframes pieScale { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes liveDot { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.7; } }
        @keyframes kpiFlash { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scanline { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes skeletonPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes floatOrb { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(15px,-20px) scale(1.1); } 66% { transform: translate(-10px,15px) scale(0.95); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes borderGlow { 0%,100% { border-color: rgba(91,156,245,0.1); } 50% { border-color: rgba(91,156,245,0.3); } }
        @keyframes slideInCard { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes numberTick { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 20px rgba(91,156,245,0.1); } 50% { box-shadow: 0 0 40px rgba(91,156,245,0.2); } }
        @keyframes imgZoom { from { transform: scale(1); } to { transform: scale(1.05); } }
        @keyframes videoPlay { 0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.3); } 50% { transform: scale(1.08); box-shadow: 0 0 0 12px rgba(255,255,255,0); } }
        .intel-card { animation: slideInCard 0.4s cubic-bezier(0.22,1,0.36,1) backwards; }
        .intel-card:nth-child(1) { animation-delay: 0.05s; }
        .intel-card:nth-child(2) { animation-delay: 0.1s; }
        .intel-card:nth-child(3) { animation-delay: 0.15s; }
        .intel-card:nth-child(4) { animation-delay: 0.2s; }
        .intel-card:nth-child(5) { animation-delay: 0.25s; }
        .intel-card:nth-child(6) { animation-delay: 0.3s; }
        .intel-card:nth-child(7) { animation-delay: 0.35s; }
        .intel-card:nth-child(8) { animation-delay: 0.4s; }
        .intel-card:nth-child(9) { animation-delay: 0.45s; }
        .intel-img-wrap { overflow: hidden; }
        .intel-img-wrap img { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        .intel-card:hover .intel-img-wrap img { transform: scale(1.08); }
        .recharts-area-area { animation: chartReveal 1.2s ease forwards; }
        .recharts-line-curve { animation: chartReveal 1s ease forwards; }
        .recharts-bar-rectangle { animation: barGrowUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .recharts-pie-sector { animation: pieScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .recharts-active-dot circle { animation: liveDot 2s ease-in-out infinite; }
        .recharts-cartesian-grid-horizontal line { stroke-dasharray: 1 12 !important; stroke-linecap: round !important; }
        .recharts-cartesian-grid-vertical line { stroke-dasharray: 1 12 !important; stroke-linecap: round !important; }
        .fos-kpi-value { animation: kpiFlash 0.6s ease forwards; }
        .fos-skeleton { animation: skeletonPulse 1.5s ease-in-out infinite; background: linear-gradient(90deg, transparent 25%, rgba(91,156,245,0.06) 50%, transparent 75%); background-size: 200% 100%; }
        .recharts-pie-sector { animation: fadeSlideUp 0.5s ease backwards; }
        .recharts-pie-sector:nth-child(1) { animation-delay: 0.05s; }
        .recharts-pie-sector:nth-child(2) { animation-delay: 0.15s; }
        .recharts-pie-sector:nth-child(3) { animation-delay: 0.25s; }
        .recharts-pie-sector:nth-child(4) { animation-delay: 0.35s; }
        .recharts-dot circle { transition: r 0.2s ease, opacity 0.2s; }
        .recharts-active-dot circle { animation: dotGlow 1.5s ease-in-out infinite; }
        /* Ambient chart panel hover */
        .fos-panel { transition: all 0.25s cubic-bezier(0.4,0,0.2,1) !important; }
        .fos-panel:hover { border-color: rgba(91,156,245,0.15) !important; box-shadow: 0 0 0 1px rgba(91,156,245,0.08), 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04) !important; transform: translateY(-1px) !important; }
        /* Recharts smoothness */
        .recharts-wrapper { transition: opacity 0.3s; }
        .recharts-tooltip-wrapper { transition: none !important; pointer-events: none !important; }
        .recharts-surface { overflow: visible; }
        /* Button transitions */
        button, [role="button"] { transition: all 0.2s cubic-bezier(0.4,0,0.2,1) !important; }
        input[type="range"]:active::-webkit-slider-thumb { transform: scale(1.3); }
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
        /* Ambient atmosphere */
        [data-content-area]::before {
          content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 600px 400px at 15% 10%, ${c.accent}03, transparent 70%),
            radial-gradient(ellipse 500px 300px at 85% 80%, ${c.purple}02, transparent 70%),
            radial-gradient(circle at 1px 1px, ${c.borderSub} 0.4px, transparent 0.4px);
          background-size: 100% 100%, 100% 100%, 28px 28px;
          opacity: 0.5;
        }
        /* Glass card refined hover */
        [data-glass-card] {
          transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
          border: 1px solid ${c.glassBorder};
        }
        [data-glass-card]:hover {
          border-color: ${c.accent}20;
          box-shadow: 0 8px 32px ${c.accent}08, 0 0 0 1px ${c.accent}10, inset 0 1px 0 rgba(255,255,255,0.04);
          transform: translateY(-2px);
        }
        /* Details/summary for FAQ */
        details summary::-webkit-details-marker { display: none; }
        details summary { list-style: none; }
        details[open] summary svg { transform: rotate(180deg); }
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        /* Premium input/button transitions */
        input, select, textarea { transition: border-color 0.2s, box-shadow 0.2s; }
        button { transition: all 0.15s ease; }
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
        button, input, select, textarea { font-family: 'Manrope', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; letter-spacing: -0.005em; }
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
          [data-hero-email] input { border-radius: 10px !important; border-right: 1px solid #1e2230 !important; }
          [data-hero-email] button { border-radius: 10px !important; }
          /* Dashboard view padding on mobile */
          [data-content-area] > div > div > div { padding-left: 16px !important; padding-right: 16px !important; }
          [data-content-area] table { font-size: 10px !important; }
        }
        @media (max-width: 480px) {
          [data-grid-4] { grid-template-columns: 1fr !important; }
          [data-grid-5] { grid-template-columns: 1fr !important; }
          [data-grid-footer] { grid-template-columns: 1fr !important; }
          [data-steps] { grid-template-columns: 1fr !important; }
        }
        .view-fade { animation: viewEnter 0.35s ease; }
        @keyframes viewEnter { from { opacity: 0; transform: translateY(6px); filter: blur(2px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        [data-content-area]::-webkit-scrollbar { width: 6px; }
        [data-content-area]::-webkit-scrollbar-track { background: transparent; }
        [data-content-area]::-webkit-scrollbar-thumb { background: rgba(139,146,165,0.15); border-radius: 3px; }
        [data-content-area]::-webkit-scrollbar-thumb:hover { background: rgba(139,146,165,0.3); }
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
        borderRight: `1px solid ${c.glassBorder}`, display: "flex", flexDirection: "column", flexShrink: 0,
        boxShadow: mode === "dark" ? `4px 0 30px rgba(0,0,0,0.2), inset -1px 0 0 ${c.glassBorder}` : "4px 0 20px rgba(0,0,0,0.04)",
        transition: "width 0.25s ease, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.25s ease",
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
                <span style={{ fontSize: 7, fontWeight: 800, padding: "2px 5px", borderRadius: 3, background: user.plan === "demo" ? c.amberDim : user.plan === "pending" || !user.plan ? `${c.accent}12` : `${c.green}12`, color: user.plan === "demo" ? c.amber : user.plan === "pending" || !user.plan ? c.accent : c.green, letterSpacing: "0.06em", textTransform: "uppercase" }}>{user.plan === "demo" ? "DEMO" : user.plan ? user.plan.toUpperCase() : "STARTER"}</span>
              </div>
              <div style={{ fontSize: 9, color: c.textFaint, marginTop: 2, whiteSpace: "nowrap" }}>{user.orgName || "My Org"} · FY{new Date().getFullYear()}</div>
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
        <div style={{ flex: 1, padding: "6px 0", overflow: "auto", scrollbarWidth: "thin", scrollbarColor: `${c.borderSub} transparent` }}>
          {NAV_ITEMS.map(item => {
            const showSection = item.section !== currentSection;
            currentSection = item.section;
            const Icon = item.icon;
            const SectionIcon = SECTION_ICONS[item.section] || Settings;
            const active = view === item.id;
            return (
              <div key={item.id}>
                {showSection && !sidebarCollapsed && (
                  <div style={{ padding: "16px 16px 5px", display: "flex", alignItems: "center", gap: 7 }}>
                    <SectionIcon size={9} color={c.textFaint} strokeWidth={2} style={{ opacity: 0.6 }} />
                    <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: c.textFaint }}>{item.section}</span>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.borderSub}, transparent)` }} />
                  </div>
                )}
                {showSection && sidebarCollapsed && (
                  <div style={{ padding: "6px 12px", margin: "4px 0" }}>
                    <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${c.borderSub}, transparent)` }} />
                  </div>
                )}
                <div onClick={() => navigate(item.id)} title={sidebarCollapsed ? `${item.label} — ${item.desc}` : undefined} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: sidebarCollapsed ? "10px 0" : "9px 14px",
                  margin: sidebarCollapsed ? "1px 8px" : "1px 8px",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  cursor: "pointer", fontSize: 12.5, fontWeight: active ? 700 : 450, borderRadius: 10,
                  color: active ? c.text : c.textDim,
                  background: active ? `linear-gradient(135deg, ${c.accent}14, ${c.purple}08)` : "transparent",
                  boxShadow: active ? `0 0 0 1px ${c.accent}20, inset 0 1px 0 ${c.accent}10, 0 2px 8px ${c.accent}06` : "none",
                  transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = c.textSec; e.currentTarget.style.background = `${c.accent}08`; e.currentTarget.style.transform = "translateX(2px)"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = c.textDim; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}}
                >
                  {active && !sidebarCollapsed && <div style={{ position: "absolute", left: 0, top: "12%", bottom: "12%", width: 3, borderRadius: "0 3px 3px 0", background: `linear-gradient(180deg, ${c.accent}, ${c.purple})`, boxShadow: `0 0 12px ${c.accent}60, 0 0 4px ${c.accent}` }} />}
                  {active && sidebarCollapsed && <div style={{ position: "absolute", left: 4, top: "20%", bottom: "20%", width: 2, borderRadius: 2, background: c.accent }} />}
                  <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: active ? `${c.accent}15` : "transparent", transition: "all 0.2s" }}>
                    <Icon size={15} strokeWidth={active ? 2.2 : 1.6} style={{ transition: "all 0.2s" }} />
                  </div>
                  {!sidebarCollapsed && (
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
                        {item.hot && <span style={{ fontSize: 7, fontWeight: 800, padding: "1px 4px", borderRadius: 3, background: `linear-gradient(135deg, ${c.purple}, ${c.accent})`, color: "#fff", lineHeight: "12px" }}>AI</span>}
                      </div>
                      {active && <span style={{ fontSize: 9, color: c.textFaint, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</span>}
                    </div>
                  )}
                  {!sidebarCollapsed && item.id === "copilot" && !active && <Sparkles size={10} color={c.purple} style={{ marginLeft: "auto", animation: "pulse 3s infinite" }} />}
                  {!sidebarCollapsed && item.id === "close" && (() => { const pending = (closeTasks || []).filter(t => t.status !== "done").length; return pending > 0 ? <span style={{ marginLeft: "auto", fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 10, background: `linear-gradient(135deg, ${c.amber}, ${c.amber}dd)`, color: "#fff", boxShadow: `0 2px 6px ${c.amber}30`, lineHeight: "12px" }}>{pending}</span> : null; })()}
                  {!sidebarCollapsed && item.id === "dashboard" && <span style={{ marginLeft: "auto", fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 10, background: `linear-gradient(135deg, ${c.red}, ${c.red}dd)`, color: "#fff", boxShadow: `0 2px 6px ${c.red}30`, lineHeight: "12px" }}>4</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Quick Actions & Team ── */}
        {!sidebarCollapsed && (
        <div style={{ borderTop: `1px solid ${c.borderSub}`, padding: "10px 10px" }}>
          {/* Quick help / tutorials */}
          <div onClick={() => navigate("dashboard")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, cursor: "pointer", background: `linear-gradient(135deg, ${c.accent}08, ${c.purple}05)`, border: `1px solid ${c.accent}12`, marginBottom: 8, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}30`; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.accent}12`; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Zap size={10} color="#fff" strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: c.text }}>Product Guides</div>
              <div style={{ fontSize: 8, color: c.textFaint }}>6 tutorials available</div>
            </div>
            <ChevronRight size={10} color={c.textFaint} />
          </div>
          {/* Team */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, padding: "0 2px" }}>
            <span style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Team</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 7, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: `${c.green}12`, color: c.green }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: c.green, animation: "pulse 2s infinite" }} /> 1 online
            </span>
          </div>
          {[
            { name: user.name || "You", initials: (user.name || "G").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase(), status: "online", role: user.plan === "enterprise" ? "Owner" : "Member" },
          ].map(m => (
            <div key={m.name} onClick={() => navigate("team")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 6px", borderRadius: 8, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = `${c.accent}06`}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff" }}>{m.initials}</div>
                <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: m.status === "online" ? c.green : m.status === "away" ? c.amber : c.textFaint, border: `2px solid ${c.bg2}` }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: c.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                <div style={{ fontSize: 8, color: c.textFaint }}>{m.role}</div>
              </div>
            </div>
          ))}
          <div onClick={() => navigate("team")} style={{ fontSize: 9, color: c.accent, fontWeight: 600, padding: "4px 6px", cursor: "pointer", marginTop: 4, display: "flex", alignItems: "center", gap: 4, borderRadius: 6, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = `${c.accent}06`}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >+ Invite teammates</div>
        </div>
        )}

        {/* ── Account Panel ── */}
        <div style={{ borderTop: `1px solid ${c.borderSub}`, marginTop: "auto" }}>
          {!sidebarCollapsed ? (
          <div style={{ padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{(user.name || "G").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: c.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name || "Guest"}</div>
                <div style={{ fontSize: 9, color: c.textFaint }}>{user.plan ? user.plan.toUpperCase() : "DEMO"} · {user.orgName || "My Org"}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 0, background: c.surfaceAlt, borderRadius: 6, padding: 2, border: `1px solid ${c.borderSub}`, marginBottom: 8 }}>
              {["Light", "Dark"].map(t => {
                const isActive = t.toLowerCase() === mode;
                return (
                <div key={t} onClick={() => { if (t.toLowerCase() !== mode) toggleMode(); }} style={{
                  flex: 1, textAlign: "center", fontSize: 10, fontWeight: isActive ? 600 : 400, padding: "4px 0",
                  borderRadius: 4, cursor: "pointer", transition: "all 0.15s",
                  background: isActive ? c.surface : "transparent", color: isActive ? c.text : c.textFaint,
                }}>{t}</div>
                );
              })}
            </div>
            <div onClick={handleLogout} style={{ fontSize: 11, color: c.textFaint, padding: "6px 8px", borderRadius: 6, cursor: "pointer", transition: "all 0.12s", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}
              onMouseEnter={e => { e.currentTarget.style.background = `${c.red}06`; e.currentTarget.style.color = c.red; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.textFaint; }}
            ><LogOut size={12} /> Log Out</div>
          </div>
          ) : (
          <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div onClick={() => navigate("settings")} title={user.name || "Guest"} style={{ cursor: "pointer" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, fontSize: 11, fontWeight: 800, color: "#fff" }}>{(user.name || "G").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}</div>
            </div>
            <div onClick={handleLogout} title="Log out" style={{ width: 30, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: c.textFaint }}
              onMouseEnter={e => { e.currentTarget.style.color = c.red; }}
              onMouseLeave={e => { e.currentTarget.style.color = c.textFaint; }}
            ><LogOut size={13} /></div>
          </div>
          )}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>


        {/* Site-wide status banner */}
        <StatusBanner dark={mode === "dark"} />

        {/* Demo data banner — ENV 7 */}
        {user.plan === "demo" && <DemoBanner c={c} onNav={navigate} onUpgrade={() => setShowPlanPicker(true)} orgName={user.orgName} />}

        {/* Topbar — frosted glass */}
        <div className="theme-transition" style={{
          height: 56, borderBottom: `1px solid ${c.glassBorder}`, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 28px", flexShrink: 0,
          background: c.glass, backdropFilter: c.glassBlur, WebkitBackdropFilter: c.glassBlur,
          position: "relative", zIndex: 10,
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}>
          {/* Accent line — subtle gradient under topbar */}
          <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 5%, ${c.accent}15, ${c.purple}10, transparent 95%)`, zIndex: 11 }} />
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
            {!isMobile && <span style={{ fontSize: 10, color: c.textFaint, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, letterSpacing: "0.02em", padding: "4px 8px", background: c.surfaceAlt, borderRadius: 5, border: `1px solid ${c.borderSub}` }}>{clock}</span>}
            <div onClick={() => setCmdOpen(true)} aria-label="Search — press Command K" role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && setCmdOpen(true)} style={{
              display: "flex", alignItems: "center", gap: 6, background: c.surfaceAlt, border: `1px solid ${c.border}`,
              borderRadius: 8, padding: "6px 12px", fontSize: 12, color: c.textDim, width: isMobile ? 44 : 200, cursor: "pointer", transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = c.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = c.border}
            >
              <Search size={13} /> {!isMobile && <>Search... <kbd style={{ marginLeft: "auto", fontSize: 9, padding: "1px 5px", borderRadius: 3, background: c.bg2, border: `1px solid ${c.borderSub}`, color: c.textFaint }}>⌘K</kbd></>}
            </div>
            <div style={{ position: "relative" }}>
              {(() => {
                // Hybrid notifications: system alerts + recent activity
                const systemNotifs = [
                  { id: "sys-0", text: "Revenue variance detected: +$2.09M above budget", ts: Date.now() - 120000, nav: "copilot", color: c.green },
                  { id: "sys-1", text: "S&M spend $730K over — review recommended", ts: Date.now() - 720000, nav: "copilot", color: c.amber },
                ];
                // Generate live notifications from close tasks state
                const pendingClose = (closeTasks || []).filter(t => t.status !== "done").length;
                if (pendingClose > 0) systemNotifs.push({ id: "sys-close", text: `February close: ${pendingClose} task${pendingClose !== 1 ? "s" : ""} still pending`, ts: Date.now() - 3600000, nav: "close", color: c.accent });
                // Add recent activity items as notifications
                const activityNotifs = (activityLog || []).filter(e => e.type === "close" || e.type === "action").slice(0, 3).map((e, i) => ({
                  id: `act-${e.t}-${i}`, text: e.msg, ts: e.t, nav: e.type === "close" ? "close" : "copilot", color: e.type === "close" ? c.amber : c.purple,
                }));
                const NOTIFS = [...activityNotifs, ...systemNotifs].slice(0, 8);
                const unread = NOTIFS.filter(n => !notifRead.has(n.id)).length;
                return (<>
              {/* Team inbox */}
              <div onClick={() => navigate("team")} style={{ cursor: "pointer", padding: 4, borderRadius: 8, position: "relative", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${c.accent}10`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                title="Team messages"
              >
                <MessageSquare size={16} color={c.textDim} />
                <div style={{ position: "absolute", top: 0, right: 0, width: 7, height: 7, borderRadius: "50%", background: c.green, border: `1.5px solid ${c.bg2}` }} />
              </div>
              {/* Theme toggle */}
              <div onClick={toggleMode} style={{ cursor: "pointer", padding: 4, borderRadius: 8, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${c.accent}10`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {mode === "dark" ? <Sun size={16} color={c.textDim} /> : <Moon size={16} color={c.textDim} />}
              </div>
              <div style={{ cursor: "pointer", position: "relative" }} role="button" aria-label={`${unread} notifications`} tabIndex={0} onClick={() => setNotifOpen(!notifOpen)} onKeyDown={e => e.key === "Enter" && setNotifOpen(!notifOpen)}>
                <Bell size={18} color={notifOpen ? c.accent : c.textDim} />
                {unread > 0 && <div style={{ position: "absolute", top: -3, right: -4, minWidth: 14, height: 14, borderRadius: 7, background: c.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff", border: `2px solid ${c.bg2}`, animation: "pulse 2s infinite" }}>{unread > 9 ? "9+" : unread}</div>}
              </div>
              {notifOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 340, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.3)", overflow: "hidden", zIndex: 200, animation: "cmdIn 0.15s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: `1px solid ${c.borderSub}` }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>Notifications {unread > 0 && <span style={{ fontSize: 10, color: c.textDim, fontWeight: 500 }}>· {unread} new</span>}</span>
                    {unread > 0 && <span onClick={() => { setNotifRead(new Set(NOTIFS.map(n => n.id))); toast("All marked as read", "success"); }} style={{ fontSize: 10, color: c.accent, fontWeight: 600, cursor: "pointer" }}>Mark all read</span>}
                  </div>
                  {NOTIFS.length === 0 && <div style={{ padding: "20px 16px", textAlign: "center", fontSize: 12, color: c.textFaint }}>No notifications yet</div>}
                  {NOTIFS.map(n => {
                    const isRead = notifRead.has(n.id);
                    const s = Math.floor((Date.now() - n.ts) / 1000);
                    const ago = s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s / 60)}m ago` : `${Math.floor(s / 3600)}h ago`;
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
                        <div style={{ fontSize: 10, color: c.textFaint, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{ago}</div>
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

        {/* Content + Suite Panel Row */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Content */}
        <div key={viewLoading ? "loading" : view} data-content-area className="view-fade" style={{ flex: 1, overflow: "auto", background: "transparent", position: "relative", zIndex: 1 }}>
          {/* Ambient glow orbs — gives glass cards something to blur against */}
          <div style={{ position: "fixed", top: "10%", left: "20%", width: "40%", height: "40%", borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}06 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "15%", right: "10%", width: "35%", height: "35%", borderRadius: "50%", background: `radial-gradient(circle, ${c.purple}05 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", top: "50%", right: "35%", width: "25%", height: "25%", borderRadius: "50%", background: `radial-gradient(circle, ${c.green}04 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
          {viewLoading ? <LoadingSkeleton c={c} /> : (<>
          {view === "dashboard" && <SectionBoundary name="Dashboard" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><DashboardView c={c} onNav={navigate} toast={toast} onDrawer={setDrawerKpi} userName={user.name} period={period} closeTasks={closeTasks} activityLog={activityLog} glData={glData} glLoading={glLoading} /></SectionBoundary>}
          {view === "copilot" && <SectionBoundary name="AI Copilot" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><CopilotView c={c} toast={toast} logActivity={logActivity} /></SectionBoundary>}
          {view === "pnl" && <SectionBoundary name="P&L Statement" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><PnlView c={c} onNav={navigate} toast={toast} logActivity={logActivity} orgName={user.orgName} glData={glData} onDrawer={setDrawerKpi} /></SectionBoundary>}
          {view === "forecast" && <SectionBoundary name="Forecast Optimizer" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><ForecastView c={c} toast={toast} onDrawer={setDrawerKpi} onNav={navigate} closeTasks={closeTasks} /></SectionBoundary>}
          {view === "consolidation" && <SectionBoundary name="Consolidation" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><ConsolidationView c={c} onNav={navigate} toast={toast} onDrawer={setDrawerKpi} /></SectionBoundary>}
          {view === "models" && <SectionBoundary name="Scenario Models" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><ScenariosView c={c} toast={toast} onNav={navigate} /></SectionBoundary>}
          {view === "close" && <SectionBoundary name="Month-End Close" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><CloseView c={c} toast={toast} tasks={closeTasks} setTasks={setCloseTasks} logActivity={logActivity} onNav={navigate} /></SectionBoundary>}
          {view === "team" && <SectionBoundary name="Team" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><TeamView c={c} toast={toast} onNav={navigate} userName={user.name} /></SectionBoundary>}
          {view === "integrations" && <SectionBoundary name="Integrations" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><IntegrationsView c={c} toast={toast} /></SectionBoundary>}
          {view === "admin" && <SectionBoundary name="Admin Panel" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><AdminView c={c} toast={toast} onNav={navigate} /></SectionBoundary>}
          {view === "investor" && <SectionBoundary name="Investor Relations" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><InvestorView c={c} toast={toast} onDrawer={setDrawerKpi} /></SectionBoundary>}
          {view === "intelligence" && <SectionBoundary name="Intelligence Library" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><IntelligenceView c={c} toast={toast} onNav={navigate} /></SectionBoundary>}
          {view === "settings" && <SectionBoundary name="Settings" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><SettingsView c={c} onLogout={handleLogout} toast={toast} mode={mode} user={user} onShowSuitePanel={() => { setSuitePanelOpen(true); try { localStorage.removeItem("financeos-suite-dismissed"); } catch {} }} suitePanelOpen={suitePanelOpen} /></SectionBoundary>}
          </>)}
        </div>

        {/* Right Panel — Commercial + Social */}
        {suitePanelOpen && !isMobile && loggedIn && (
          <div style={{
            width: 230, flexShrink: 0, borderLeft: `1px solid ${c.borderSub}`, background: c.bg,
            display: "flex", flexDirection: "column", overflow: "auto",
            animation: "fosFadeSlideUp 0.3s ease",
          }}>
            <div style={{ padding: "16px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint }}>Resources</div>
              <div onClick={dismissSuitePanel} style={{ width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, color: c.textFaint, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.textFaint; }}
                title="Dismiss — re-enable in Settings"
              ><X size={10} /></div>
            </div>
            <div style={{ padding: "0 14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Upgrade CTA — commercial */}
              {user.plan === "demo" && (
                <div onClick={() => setShowPlanPicker(true)} style={{
                  padding: "14px 12px", borderRadius: 10,
                  background: `linear-gradient(135deg, ${c.accent}08, ${c.purple}04)`,
                  border: `1px solid ${c.accent}15`, cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}35`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.accent}15`; }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: c.accent, marginBottom: 2 }}>Upgrade Your Plan</div>
                  <div style={{ fontSize: 9, color: c.textDim, lineHeight: 1.4 }}>Unlock AI Copilot, consolidation, and more. 30-day money-back guarantee.</div>
                </div>
              )}

              {/* Partner Program — commercial */}
              <div onClick={() => { try { navigator.clipboard.writeText("https://finance-os.app?ref=FOS-DEMO"); } catch {} toast("Referral link copied", "success"); }} style={{
                padding: "12px", borderRadius: 10, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.green}30`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Users size={12} color={c.green} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: c.text }}>Partner Program</span>
                </div>
                <div style={{ fontSize: 9, color: c.textDim, lineHeight: 1.4 }}>Earn 20% recurring commission. Share your referral link.</div>
                <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", color: c.textFaint, marginTop: 4 }}>FOS-DEMO</div>
              </div>

              {/* Suite Products — commercial */}
              <div style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginTop: 4 }}>Suite Products</div>
              {[
                { name: "Vaultline", sub: "Treasury", color: "#22d3ee", url: "https://vaultline.vercel.app", live: true },
                { name: "Parallax", sub: "Compliance", color: "#E8915A", url: null, live: false },
                { name: "Emberglow", sub: "ESG Advisory", color: "#34d399", url: null, live: false },
              ].map(p => (
                <div key={p.name} onClick={() => p.url ? window.open(p.url, "_blank") : null} style={{
                  padding: "10px 12px", borderRadius: 8, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`,
                  cursor: p.live ? "pointer" : "default", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 10,
                }}
                onMouseEnter={e => { if (p.live) e.currentTarget.style.borderColor = `${p.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: c.text }}>{p.name}</div>
                    <div style={{ fontSize: 8, color: c.textFaint }}>{p.sub}</div>
                  </div>
                  {p.live ? <ArrowUpRight size={10} color={c.textFaint} /> : <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: `${p.color}08`, color: p.color, fontWeight: 700 }}>SOON</span>}
                </div>
              ))}

              {/* Social Links */}
              <div style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginTop: 4 }}>Connect</div>
              {[
                { label: "LinkedIn", url: "https://linkedin.com/company/finance-os" },
                { label: "X / Twitter", url: "https://x.com/financeos_app" },
              ].map(s => (
                <div key={s.label} onClick={() => window.open(s.url, "_blank")} style={{
                  padding: "8px 12px", borderRadius: 8, fontSize: 10, color: c.textDim, cursor: "pointer",
                  transition: "all 0.12s", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.textDim; }}
                >
                  {s.label}
                  <ArrowUpRight size={10} />
                </div>
              ))}

              {/* Quick Resources */}
              <div style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: c.textFaint, marginTop: 4 }}>Resources</div>
              {[
                { label: "Documentation", action: () => window.open("https://finance-os.app/llms.txt", "_blank") },
                { label: "Request a Demo", action: () => window.open("mailto:sales@finance-os.app?subject=Demo%20Request", "_blank") },
                { label: "Support", action: () => window.open("mailto:support@finance-os.app", "_blank") },
                { label: "Privacy Policy", action: () => window.open("https://finance-os.app/privacy", "_blank") },
              ].map(r => (
                <div key={r.label} onClick={r.action} style={{
                  padding: "8px 12px", borderRadius: 8, fontSize: 10, color: c.textDim, cursor: "pointer",
                  transition: "all 0.12s", fontWeight: 500,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.textDim; }}
                >
                  {r.label}
                </div>
              ))}

              {/* Dismiss */}
              <div onClick={dismissSuitePanel} style={{ textAlign: "center", marginTop: 8, fontSize: 9, color: c.textFaint, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.color = c.textDim}
                onMouseLeave={e => e.currentTarget.style.color = c.textFaint}
              >Hide this panel</div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* ── OVERLAYS ── */}
      {/* Scroll-to-top FAB */}
      {showScrollTop && loggedIn && (
        <div onClick={() => document.querySelector("[data-content-area]")?.scrollTo({ top: 0, behavior: "smooth" })} style={{
          position: "fixed", bottom: aiChatOpen ? 560 : 86, right: 28, width: 40, height: 40, borderRadius: 12,
          background: `${c.accent}dd`, backdropFilter: "blur(8px)", border: `1px solid ${c.accent}40`,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          boxShadow: `0 6px 24px ${c.accent}25`, zIndex: 100, transition: "all 0.15s ease",
          animation: "fosFadeSlideUp 0.2s ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 10px 32px ${c.accent}35`; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 6px 24px ${c.accent}25`; }}
        title="Scroll to top"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 12V4M4 7l4-4 4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
      {drawerKpi && <DetailDrawer kpi={drawerKpi} c={c} onClose={() => setDrawerKpi(null)} />}
      {cmdOpen && <CommandPalette c={c} onSelect={handleCmd} onClose={() => setCmdOpen(false)} />}
      {shortcutsOpen && (
        <div onClick={() => setShortcutsOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 400, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", padding: "28px 32px", animation: "cmdIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.text }}>Keyboard Shortcuts</div>
              <div onClick={() => setShortcutsOpen(false)} style={{ cursor: "pointer", color: c.textDim }}><X size={16} /></div>
            </div>
            {[
              { keys: ["⌘", "K"], label: "Open command palette" },
              { keys: ["?"], label: "Show this help" },
              { keys: ["Esc"], label: "Close modals and drawers" },
              { keys: ["⌘", "B"], label: "Toggle sidebar" },
              { keys: ["⌘", "1–9"], label: "Navigate to view by position" },
              { keys: ["⌘", "E"], label: "Export current view" },
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
      {/* ── Floating AI Assistant ── */}
      {loggedIn && (
        <>
        {/* Chat bubble trigger */}
        {!aiChatOpen && (
          <div onClick={() => setAiChatOpen(true)} style={{
            position: "fixed", bottom: 28, right: 28, width: 48, height: 48, borderRadius: 14,
            background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 8px 32px ${c.accent}30, 0 0 0 1px ${c.accent}20`,
            zIndex: 500, transition: "all 0.15s ease",
            animation: "fosFadeSlideUp 0.3s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.05)"; e.currentTarget.style.boxShadow = `0 12px 40px ${c.accent}40, 0 0 0 1px ${c.accent}30`; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${c.accent}30, 0 0 0 1px ${c.accent}20`; }}
          title="Ask AI anything"
          >
            <Sparkles size={20} color="#fff" strokeWidth={2} />
          </div>
        )}

        {/* Chat panel */}
        {aiChatOpen && (
          <div style={{
            position: "fixed", bottom: 28, right: 28, width: 380, height: 520, maxHeight: "75vh",
            background: c.surface, border: `1px solid ${c.border}`, borderRadius: 20,
            boxShadow: `0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px ${c.accent}08`,
            zIndex: 500, display: "flex", flexDirection: "column", overflow: "hidden",
            animation: "cmdIn 0.2s ease",
          }}>
            {/* Header */}
            <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${c.borderSub}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${c.accent}15, ${c.purple}08)`, border: `1px solid ${c.accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={14} color={c.accent} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>FinanceOS AI</div>
                  <div style={{ fontSize: 9, color: c.textFaint }}>Ask about your data, get instant answers</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <div onClick={() => { setAiChatOpen(false); navigate("copilot"); }} title="Open full Copilot view" style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: c.textFaint, transition: "all 0.12s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.color = c.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.textFaint; }}
                ><ArrowUpRight size={14} /></div>
                <div onClick={() => setAiChatOpen(false)} style={{ width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: c.textFaint, transition: "all 0.12s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.color = c.text; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.textFaint; }}
                ><X size={14} /></div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
              {aiChatMessages.length === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "20px 0" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${c.accent}12, ${c.purple}06)`, border: `1px solid ${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={18} color={c.accent} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 4 }}>How can I help?</div>
                    <div style={{ fontSize: 11, color: c.textDim, lineHeight: 1.5 }}>Ask about revenue, forecasts, variances, or any financial question.</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                    {["What drove the revenue beat?", "Show me our top variances", "How accurate is our forecast?"].map(q => (
                      <div key={q} onClick={() => { setAiChatInput(q); }} style={{
                        fontSize: 11, padding: "8px 12px", borderRadius: 8, border: `1px solid ${c.borderSub}`,
                        background: c.surfaceAlt, color: c.textSec, cursor: "pointer", transition: "all 0.12s", fontWeight: 500,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.accent}30`; e.currentTarget.style.color = c.text; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderSub; e.currentTarget.style.color = c.textSec; }}
                      >{q}</div>
                    ))}
                  </div>
                </div>
              )}
              {aiChatMessages.map((m, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "85%", fontSize: 12, lineHeight: 1.55, padding: "10px 14px", borderRadius: 14,
                    ...(m.role === "user"
                      ? { background: `linear-gradient(135deg, ${c.accent}, ${c.purple})`, color: "#fff", borderBottomRightRadius: 4 }
                      : { background: c.surfaceAlt, color: c.text, border: `1px solid ${c.borderSub}`, borderBottomLeftRadius: 4 }),
                  }}>{m.content.split("\n").map((line, j) => <div key={j}>{line || "\u00A0"}</div>)}</div>
                </div>
              ))}
              {aiChatThinking && (
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <div style={{ padding: "10px 14px", borderRadius: 14, borderBottomLeftRadius: 4, background: c.surfaceAlt, border: `1px solid ${c.borderSub}`, display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(d => <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: c.textFaint, animation: `pulse 1s ease-in-out ${d * 0.15}s infinite` }} />)}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: "12px 14px", borderTop: `1px solid ${c.borderSub}`, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input value={aiChatInput} onChange={e => setAiChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && aiChatInput.trim() && !aiChatThinking) sendAiChat(aiChatInput.trim());
                  }}
                  placeholder="Ask about your data..."
                  style={{ flex: 1, fontSize: 12, padding: "9px 14px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.surfaceAlt, color: c.text, fontFamily: "inherit", outline: "none", transition: "border-color 0.15s" }}
                  onFocus={e => e.target.style.borderColor = c.accent}
                  onBlur={e => e.target.style.borderColor = c.border}
                />
                <button onClick={() => {
                  if (aiChatInput.trim() && !aiChatThinking) sendAiChat(aiChatInput.trim());
                }} disabled={!aiChatInput.trim() || aiChatThinking} style={{
                  width: 34, height: 34, borderRadius: 8, border: "none", flexShrink: 0,
                  background: aiChatInput.trim() ? `linear-gradient(135deg, ${c.accent}, ${c.purple})` : c.surfaceAlt,
                  color: aiChatInput.trim() ? "#fff" : c.textFaint,
                  cursor: aiChatInput.trim() ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                }}><Send size={14} /></button>
              </div>
              <div style={{ fontSize: 9, color: c.textFaint, marginTop: 6, textAlign: "center" }}>Press Enter to send · <span onClick={() => { setAiChatOpen(false); navigate("copilot"); }} style={{ color: c.accent, cursor: "pointer", fontWeight: 600 }}>Open full Copilot</span></div>
            </div>
          </div>
        )}
        </>
      )}

      <ToastContainer toasts={toasts} c={c} />
      {/* ENV 5: Desktop Platform */}
      <OfflineIndicator c={c} />
      <PWAInstallPrompt c={c} />
      {/* Plan Picker — shows after signup */}
      {showPlanPicker && <PlanPicker c={c} userName={user.name} isDemo={user.plan === "demo" || !user.plan} isAuthenticated={!!user.email} onSkip={() => setShowPlanPicker(false)} onSelect={(plan) => {
        // SECURITY: Plan is set to 'pending:<planName>' until payment is verified
        // The onboarding wizard only runs after verification succeeds
        setUser(prev => ({ ...prev, plan: `pending:${plan}` }));
        setShowPlanPicker(false);
        setShowOnboarding(true);
      }} />}
      {showOnboarding && <SectionBoundary name="Onboarding" bg={c.surface} borderColor={c.border} textColor={c.textDim} accentColor={c.accent}><OnboardingWizard c={c} userName={user.name} planStatus={user.plan} onComplete={async (org) => {
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
                plan: planName || "demo",
              }),
            });
          }
        } catch (err) { console.error("Onboarding failed"); }
        setUser(prev => ({ ...prev, plan: planName }));
        setShowOnboarding(false);
        toast(`Welcome to FinanceOS${org.name ? ` — ${org.name}` : ""}`, "success");
      }} /></SectionBoundary>}
    </div>
  );
}

export default function FinanceOS() {
  return <AppErrorBoundary><FinanceOSApp /></AppErrorBoundary>;
}
