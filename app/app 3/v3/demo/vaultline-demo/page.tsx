'use client';

import { useEffect } from 'react';

export default function V3DemoVaultlineDemoPage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #030711;
    color: #F1F5F9;
    font-family: 'DM Sans', system-ui, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .ad-frame {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0;
    background: #030711;
  }

  /* === TOP BANNER === */
  .top-banner {
    background: linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(129,140,248,0.04) 100%);
    border-bottom: 1px solid rgba(34,211,238,0.12);
    padding: 20px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .top-banner-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .logo-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .logo-text span { color: #22D3EE; }
  .top-banner-tagline {
    color: #94A3B8;
    font-size: 14px;
    border-left: 1px solid rgba(148,163,184,0.3);
    padding-left: 16px;
    margin-left: 4px;
  }
  .top-banner-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .live-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #34D399;
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.15);
    padding: 4px 12px;
    border-radius: 9999px;
  }
  .live-dot {
    width: 6px; height: 6px;
    background: #34D399;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .demo-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* === DASHBOARD === */
  .dashboard {
    display: grid;
    grid-template-columns: 200px 1fr;
    min-height: 720px;
    border: 1px solid rgba(30,48,80,0.4);
    border-top: none;
  }

  /* === SIDEBAR === */
  .sidebar {
    background: #070D19;
    border-right: 1px solid rgba(30,48,80,0.4);
    padding: 20px 0;
    display: flex;
    flex-direction: column;
  }
  .sidebar-header {
    padding: 0 16px 20px;
    border-bottom: 1px solid rgba(30,48,80,0.25);
    margin-bottom: 16px;
  }
  .sidebar-logo {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 18px;
    font-weight: 700;
  }
  .sidebar-logo span { color: #22D3EE; }
  .sidebar-org {
    font-size: 11px;
    color: #64748B;
    margin-top: 4px;
  }
  .nav-section {
    padding: 0 12px;
    margin-bottom: 16px;
  }
  .nav-section-label {
    font-size: 10px;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0 8px;
    margin-bottom: 6px;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 13px;
    color: #94A3B8;
    position: relative;
  }
  .nav-item.active {
    background: rgba(34,211,238,0.08);
    color: #F1F5F9;
    border-left: 2px solid #22D3EE;
    margin-left: -2px;
  }
  .nav-item svg { width: 16px; height: 16px; opacity: 0.7; }
  .nav-item.active svg { opacity: 1; }
  .nav-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 9999px;
    margin-left: auto;
  }
  .badge-growth { background: rgba(129,140,248,0.15); color: #818CF8; }
  .badge-enterprise { background: rgba(52,211,153,0.12); color: #34D399; }
  .sidebar-user {
    margin-top: auto;
    padding: 16px;
    border-top: 1px solid rgba(30,48,80,0.25);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .user-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #22D3EE, #818CF8);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #030711;
  }
  .user-name { font-size: 13px; font-weight: 500; color: #F1F5F9; }
  .user-role { font-size: 11px; color: #64748B; }

  /* === MAIN === */
  .main {
    background: #0B1120;
    padding: 24px 28px;
    overflow: hidden;
  }
  .main-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .greeting-date {
    font-size: 11px;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .greeting-date svg { width: 12px; height: 12px; }
  .greeting-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #F1F5F9;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .period-badge {
    font-size: 11px;
    font-weight: 600;
    background: rgba(34,211,238,0.1);
    color: #22D3EE;
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid rgba(34,211,238,0.15);
  }
  .status-pills {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  .status-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 9999px;
    border: 1px solid;
  }
  .pill-green { color: #34D399; background: rgba(52,211,153,0.08); border-color: rgba(52,211,153,0.2); }
  .pill-cyan { color: #22D3EE; background: rgba(34,211,238,0.06); border-color: rgba(34,211,238,0.15); }
  .pill-amber { color: #FBBF24; background: rgba(251,191,36,0.06); border-color: rgba(251,191,36,0.15); }
  .copilot-btn {
    display: flex; align-items: center; gap: 8px;
    background: rgba(129,140,248,0.08);
    border: 1px solid rgba(129,140,248,0.2);
    padding: 8px 18px;
    border-radius: 8px;
    color: #818CF8;
    font-size: 13px;
    font-weight: 500;
  }
  .copilot-btn svg { width: 16px; height: 16px; }

  /* === CONNECTOR BAR === */
  .connector-bar {
    background: rgba(12,19,35,0.65);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    backdrop-filter: blur(16px);
  }
  .connector-status {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 500; color: #34D399;
    white-space: nowrap;
  }
  .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #34D399;
  }
  .connector-stats {
    font-size: 11px;
    color: #64748B;
    white-space: nowrap;
    border-left: 1px solid rgba(30,48,80,0.4);
    padding-left: 12px;
  }
  .connectors-list {
    display: flex;
    gap: 12px;
    margin-left: auto;
    border-left: 1px solid rgba(30,48,80,0.4);
    padding-left: 12px;
  }
  .connector-chip {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: #94A3B8;
    white-space: nowrap;
  }
  .connector-chip .dot { width: 5px; height: 5px; }
  .connector-chip .sync { color: #475569; font-size: 10px; }

  /* === KPI GRID === */
  .section-label {
    font-size: 11px;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 12px;
  }
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }
  .kpi-card {
    background: rgba(12,19,35,0.65);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 16px 18px;
    backdrop-filter: blur(16px);
    position: relative;
    overflow: hidden;
  }
  .kpi-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .kpi-icon {
    width: 8px; height: 8px;
    border-radius: 50%;
  }
  .kpi-label {
    font-size: 11px;
    font-weight: 500;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .kpi-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 28px;
    font-weight: 500;
    color: #F1F5F9;
    margin-bottom: 6px;
    letter-spacing: -0.02em;
  }
  .kpi-sub {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }
  .kpi-trend {
    display: flex;
    align-items: center;
    gap: 3px;
    font-weight: 500;
  }
  .trend-up { color: #34D399; }
  .trend-down { color: #FB7185; }
  .kpi-benchmark { color: #475569; font-size: 11px; }
  .sparkline {
    position: absolute;
    top: 14px; right: 14px;
    width: 80px; height: 36px;
  }
  .sparkline svg { width: 100%; height: 100%; }

  /* === CHARTS === */
  .charts-row {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 14px;
  }
  .chart-card {
    background: rgba(12,19,35,0.65);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 18px 20px;
    backdrop-filter: blur(16px);
  }
  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .chart-title {
    font-size: 14px;
    font-weight: 700;
    color: #F1F5F9;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .chart-live {
    font-size: 10px;
    font-weight: 600;
    color: #34D399;
    background: rgba(52,211,153,0.1);
    padding: 2px 8px;
    border-radius: 9999px;
  }
  .chart-tabs { display: flex; gap: 4px; }
  .chart-tab {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 6px;
    color: #64748B;
  }
  .chart-tab.active {
    background: rgba(34,211,238,0.1);
    color: #22D3EE;
  }
  .chart-subtitle {
    font-size: 11px;
    color: #64748B;
    margin-top: -8px;
    margin-bottom: 12px;
  }
  .revenue-chart {
    height: 180px;
    position: relative;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    padding-bottom: 24px;
  }
  .chart-y-labels {
    position: absolute;
    left: 0; top: 0; bottom: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 40px;
  }
  .chart-y-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #475569;
  }
  .chart-bars-area {
    margin-left: 44px;
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 100%;
  }
  .chart-bar-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    height: 100%;
    justify-content: flex-end;
  }
  .chart-bar {
    width: 100%;
    border-radius: 4px 4px 0 0;
  }
  .bar-actual {
    background: linear-gradient(180deg, #22D3EE 0%, rgba(34,211,238,0.4) 100%);
  }
  .bar-forecast {
    background: linear-gradient(180deg, rgba(34,211,238,0.25) 0%, rgba(34,211,238,0.08) 100%);
    border: 1px dashed rgba(34,211,238,0.3);
    border-bottom: none;
  }
  .bar-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #475569;
  }
  .donut-container {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 12px 0;
  }
  .donut-svg {
    width: 140px; height: 140px;
    flex-shrink: 0;
  }
  .donut-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .legend-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .legend-label { font-size: 12px; color: #94A3B8; }
  .legend-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #F1F5F9;
    font-weight: 500;
    margin-left: auto;
  }

  /* === BOTTOM CTA === */
  .bottom-cta {
    background: linear-gradient(135deg, rgba(34,211,238,0.04) 0%, rgba(129,140,248,0.04) 100%);
    border-top: 1px solid rgba(34,211,238,0.1);
    padding: 24px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cta-left h3 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #F1F5F9;
    margin-bottom: 4px;
  }
  .cta-left p {
    font-size: 14px;
    color: #94A3B8;
  }
  .cta-buttons {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .cta-primary {
    background: linear-gradient(135deg, #22D3EE, #06B6D4);
    color: #030711;
    font-size: 14px;
    font-weight: 700;
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    letter-spacing: -0.01em;
  }
  .cta-secondary {
    color: #94A3B8;
    font-size: 13px;
    padding: 10px 20px;
    border: 1px solid rgba(148,163,184,0.2);
    border-radius: 8px;
    background: transparent;
  }
  .cta-url {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #64748B;
    margin-top: 12px;
  }
  .cta-url span { color: #22D3EE; }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `
<div class="ad-frame">

  <div class="top-banner">
    <div class="top-banner-left">
      <div class="logo-text">Vault<span>line</span></div>
      <div class="top-banner-tagline">Enterprise Treasury Intelligence</div>
    </div>
    <div class="top-banner-right">
      <div class="live-badge"><div class="live-dot"></div> Live Platform Demo</div>
      <div class="demo-label">PRODUCT PREVIEW</div>
    </div>
  </div>

  <div class="dashboard">
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">Vault<span>line</span></div>
        <div class="sidebar-org">Acme Corp &middot; Enterprise</div>
      </div>
      <div class="nav-section">
        <div class="nav-section-label">Overview</div>
        <div class="nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/></svg>
          AI Copilot
          <span class="nav-badge badge-growth">GROWTH</span>
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-section-label">Treasury</div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          Cash Position
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
          Forecast
          <span class="nav-badge badge-growth">GROWTH</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/></svg>
          Reports
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-section-label">Operations</div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          Entities
          <span class="nav-badge badge-enterprise">ENT</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          Scenarios
          <span class="nav-badge badge-growth">GROWTH</span>
        </div>
      </div>
      <div class="sidebar-user">
        <div class="user-avatar">JR</div>
        <div>
          <div class="user-name">James Rivera</div>
          <div class="user-role">CFO</div>
        </div>
      </div>
    </div>

    <div class="main">
      <div class="main-header">
        <div>
          <div class="greeting-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Thursday, March 26, 2026
          </div>
          <div class="greeting-title">
            Treasury Overview
            <span class="period-badge">FY2026 YTD</span>
          </div>
          <div class="status-pills">
            <div class="status-pill pill-green">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Cash positive +$12.4M
            </div>
            <div class="status-pill pill-cyan">Rule of 40: 58.2</div>
            <div class="status-pill pill-amber">3 variances</div>
          </div>
        </div>
        <div class="copilot-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z"/></svg>
          Ask AI Copilot
        </div>
      </div>

      <div class="connector-bar">
        <div class="connector-status"><div class="dot"></div> All Systems Live</div>
        <div class="connector-stats">12 accounts &middot; 4 entities &middot; 3 currencies</div>
        <div class="connectors-list">
          <div class="connector-chip"><div class="dot"></div> Chase <span class="sync">2m ago</span></div>
          <div class="connector-chip"><div class="dot"></div> BofA <span class="sync">2m ago</span></div>
          <div class="connector-chip"><div class="dot"></div> Wells <span class="sync">5m ago</span></div>
          <div class="connector-chip"><div class="dot"></div> SVB <span class="sync">5m ago</span></div>
          <div class="connector-chip"><div class="dot"></div> HSBC <span class="sync">12m ago</span></div>
        </div>
      </div>

      <div class="section-label">Key Metrics</div>
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,28 12,24 24,20 36,22 48,16 60,12 72,8 80,4" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#34D399"></div><div class="kpi-label">Total Cash</div></div>
          <div class="kpi-value">$84.2M</div>
          <div class="kpi-sub"><span class="kpi-trend trend-up">&#9650; 12.4%</span><span class="kpi-benchmark">vs $74.9M last quarter</span></div>
        </div>
        <div class="kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,20 12,18 24,22 36,16 48,14 60,18 72,10 80,6" fill="none" stroke="#22D3EE" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#22D3EE"></div><div class="kpi-label">Net Inflows (MTD)</div></div>
          <div class="kpi-value">$6.8M</div>
          <div class="kpi-sub"><span class="kpi-trend trend-up">&#9650; 8.2%</span><span class="kpi-benchmark">vs $6.3M target</span></div>
        </div>
        <div class="kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,14 12,16 24,12 36,18 48,14 60,10 72,12 80,8" fill="none" stroke="#818CF8" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#818CF8"></div><div class="kpi-label">90-Day Forecast</div></div>
          <div class="kpi-value">$91.7M</div>
          <div class="kpi-sub"><span class="kpi-trend trend-up">&#9650; AI confidence 94%</span><span class="kpi-benchmark">3-model ensemble</span></div>
        </div>
        <div class="kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,30 12,26 24,28 36,22 48,18 60,20 72,14 80,10" fill="none" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#FBBF24"></div><div class="kpi-label">Accounts Payable</div></div>
          <div class="kpi-value">$12.1M</div>
          <div class="kpi-sub"><span class="kpi-trend trend-down">&#9660; 4.2%</span><span class="kpi-benchmark">DSO: 34 days</span></div>
        </div>
        <div class="kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,24 12,20 24,16 36,18 48,12 60,14 72,8 80,6" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#34D399"></div><div class="kpi-label">Accounts Receivable</div></div>
          <div class="kpi-value">$18.4M</div>
          <div class="kpi-sub"><span class="kpi-trend trend-up">&#9650; 6.8%</span><span class="kpi-benchmark">Collection rate: 97.2%</span></div>
        </div>
        <div class="kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,18 12,14 24,16 36,10 48,12 60,8 72,6 80,4" fill="none" stroke="#FB7185" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#FB7185"></div><div class="kpi-label">Burn Rate</div></div>
          <div class="kpi-value">$3.2M<span style="font-size:14px;color:#64748B">/mo</span></div>
          <div class="kpi-sub"><span class="kpi-trend trend-up" style="color:#34D399">&#9650; 26.3 mo runway</span><span class="kpi-benchmark">Healthy</span></div>
        </div>
      </div>

      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">Cash Flow Trend <span class="chart-live">LIVE</span></div>
            <div class="chart-tabs"><div class="chart-tab">QTD</div><div class="chart-tab active">YTD</div><div class="chart-tab">12M</div></div>
          </div>
          <div class="chart-subtitle">Actual vs Budget vs AI Forecast ($M)</div>
          <div class="revenue-chart">
            <div class="chart-y-labels">
              <div class="chart-y-label">$12M</div><div class="chart-y-label">$9M</div><div class="chart-y-label">$6M</div><div class="chart-y-label">$3M</div><div class="chart-y-label">$0</div>
            </div>
            <div class="chart-bars-area">
              <div class="chart-bar-group"><div class="chart-bar bar-actual" style="height:55%"></div><div class="bar-label">Jan</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-actual" style="height:62%"></div><div class="bar-label">Feb</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-actual" style="height:58%"></div><div class="bar-label">Mar</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-actual" style="height:72%"></div><div class="bar-label">Apr</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-actual" style="height:68%"></div><div class="bar-label">May</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-actual" style="height:78%"></div><div class="bar-label">Jun</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-actual" style="height:84%"></div><div class="bar-label">Jul</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-actual" style="height:75%"></div><div class="bar-label">Aug</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-actual" style="height:88%"></div><div class="bar-label">Sep</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-forecast" style="height:82%"></div><div class="bar-label">Oct</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-forecast" style="height:90%"></div><div class="bar-label">Nov</div></div>
              <div class="chart-bar-group"><div class="chart-bar bar-forecast" style="height:95%"></div><div class="bar-label">Dec</div></div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header"><div class="chart-title">Cash by Entity</div></div>
          <div class="chart-subtitle">FY2026 YTD distribution</div>
          <div class="donut-container">
            <svg class="donut-svg" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="18"/>
              <circle cx="70" cy="70" r="54" fill="none" stroke="#22D3EE" stroke-width="18" stroke-dasharray="135.72 203.58" stroke-dashoffset="0" transform="rotate(-90 70 70)"/>
              <circle cx="70" cy="70" r="54" fill="none" stroke="#818CF8" stroke-width="18" stroke-dasharray="84.82 254.47" stroke-dashoffset="-135.72" transform="rotate(-90 70 70)"/>
              <circle cx="70" cy="70" r="54" fill="none" stroke="#34D399" stroke-width="18" stroke-dasharray="67.86 271.43" stroke-dashoffset="-220.54" transform="rotate(-90 70 70)"/>
              <circle cx="70" cy="70" r="54" fill="none" stroke="#FBBF24" stroke-width="18" stroke-dasharray="50.89 288.4" stroke-dashoffset="-288.4" transform="rotate(-90 70 70)"/>
              <text x="70" y="66" text-anchor="middle" fill="#F1F5F9" font-family="JetBrains Mono" font-size="16" font-weight="500">$84.2M</text>
              <text x="70" y="82" text-anchor="middle" fill="#64748B" font-family="DM Sans" font-size="10">Total</text>
            </svg>
            <div class="donut-legend">
              <div class="legend-item"><div class="legend-dot" style="background:#22D3EE"></div><span class="legend-label">US Operations</span><span class="legend-value">$33.6M</span></div>
              <div class="legend-item"><div class="legend-dot" style="background:#818CF8"></div><span class="legend-label">EU Holdings</span><span class="legend-value">$21.0M</span></div>
              <div class="legend-item"><div class="legend-dot" style="background:#34D399"></div><span class="legend-label">APAC Division</span><span class="legend-value">$16.8M</span></div>
              <div class="legend-item"><div class="legend-dot" style="background:#FBBF24"></div><span class="legend-label">LATAM Subsidiary</span><span class="legend-value">$12.8M</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bottom-cta">
    <div class="cta-left">
      <h3>See your treasury in real time.</h3>
      <p>Multi-bank visibility, AI forecasting, and board-ready reporting &mdash; in one platform.</p>
      <div class="cta-url"><span>vaultline.app</span> &middot; SOC 2 Type II &middot; Bank-grade encryption &middot; 30-day money-back guarantee</div>
    </div>
    <div class="cta-buttons">
      <button class="cta-secondary">Request Demo</button>
      <button class="cta-primary">Start Free &#8594;</button>
    </div>
  </div>

</div>
` }} />
    </>
  );
}
