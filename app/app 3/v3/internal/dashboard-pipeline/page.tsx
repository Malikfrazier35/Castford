'use client';

import { useEffect } from 'react';

export default function V3InternalDashboardPipelinePage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  :root {
    --bg: #06080c;
    --bg2: #0a0c12;
    --surface: #10131a;
    --border: #1a1f2e;
    --border-bright: #282e40;
    --text: #eef0f6;
    --text-sec: #9ea5b8;
    --text-dim: #636d84;
    --text-faint: #3d4558;
    --accent: #5b9cf5;
    --green: #3dd9a0;
    --red: #f06b6b;
    --amber: #f5b731;
    --purple: #a181f7;
    --cyan: #2dd4d0;
    --glass: rgba(16,19,26,0.78);
    --glass-border: rgba(255,255,255,0.07);
    --radius: 16px;
    --font: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg); color: var(--text); font-family: var(--font); min-height: 100vh; padding: 40px 24px; }

  .container { max-width: 1440px; margin: 0 auto; }

  /* Header */
  .doc-header { text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
  .doc-header h1 { font-size: 32px; font-weight: 800; letter-spacing: -0.04em; background: linear-gradient(135deg, var(--accent), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
  .doc-header .subtitle { font-size: 15px; color: var(--text-sec); max-width: 600px; margin: 0 auto; line-height: 1.7; }
  .doc-header .meta { font-size: 11px; color: var(--text-faint); margin-top: 12px; font-family: var(--mono); }

  /* Section */
  .section { margin-bottom: 56px; }
  .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-faint); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  .section-title::before { content: ''; width: 20px; height: 2px; border-radius: 1px; background: linear-gradient(90deg, var(--accent), transparent); }

  /* Tier Pipeline */
  .tier-pipeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
  .tier-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 24px 20px; position: relative; overflow: hidden; transition: all 0.3s; }
  .tier-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
  .tier-card .tier-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .tier-card.free .tier-accent { background: var(--text-dim); }
  .tier-card.starter .tier-accent { background: linear-gradient(90deg, #34d399, #3dd9a0); }
  .tier-card.growth .tier-accent { background: linear-gradient(90deg, var(--accent), #60a5fa); }
  .tier-card.business .tier-accent { background: linear-gradient(90deg, var(--purple), #c084fc); }
  .tier-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
  .tier-card.free .tier-label { color: var(--text-dim); }
  .tier-card.starter .tier-label { color: #34d399; }
  .tier-card.growth .tier-label { color: var(--accent); }
  .tier-card.business .tier-label { color: var(--purple); }
  .tier-name { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 2px; }
  .tier-price { font-size: 13px; color: var(--text-dim); margin-bottom: 16px; font-family: var(--mono); }
  .tier-features { list-style: none; }
  .tier-features li { font-size: 12px; color: var(--text-sec); padding: 6px 0; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .tier-features li:last-child { border-bottom: none; }
  .check { color: var(--green); font-size: 11px; font-weight: 800; width: 16px; text-align: center; flex-shrink: 0; }
  .lock { color: var(--text-faint); font-size: 9px; width: 16px; text-align: center; flex-shrink: 0; }
  .tier-features li.locked { color: var(--text-faint); }
  .tier-seats { font-size: 10px; color: var(--text-faint); font-family: var(--mono); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }

  /* Flow Diagram */
  .flow-grid { display: grid; grid-template-columns: 240px 1fr; gap: 24px; margin-bottom: 40px; }
  .flow-sidebar { display: flex; flex-direction: column; gap: 6px; }
  .flow-nav { padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; color: var(--text-dim); border: 1px solid transparent; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s; }
  .flow-nav:hover { background: rgba(255,255,255,0.02); color: var(--text-sec); }
  .flow-nav.active { background: rgba(91,156,245,0.08); color: var(--accent); border-color: rgba(91,156,245,0.15); }
  .flow-nav .nav-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  .flow-nav .badge { font-size: 8px; font-weight: 800; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em; margin-left: auto; text-transform: uppercase; }
  .badge-free { background: rgba(255,255,255,0.05); color: var(--text-faint); }
  .badge-starter { background: rgba(52,211,153,0.12); color: #34d399; }
  .badge-growth { background: rgba(91,156,245,0.12); color: var(--accent); }
  .badge-business { background: rgba(161,129,247,0.12); color: var(--purple); }

  .flow-main { background: var(--glass); border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 28px; }
  .flow-main h3 { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
  .flow-main .desc { font-size: 13px; color: var(--text-dim); line-height: 1.7; margin-bottom: 20px; }
  .feature-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .feature-item { padding: 14px 16px; border-radius: 10px; border: 1px solid var(--border); background: rgba(255,255,255,0.01); }
  .feature-item .feat-name { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .feature-item .feat-desc { font-size: 11px; color: var(--text-dim); line-height: 1.5; }
  .feature-item .feat-status { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 6px; }
  .status-live { color: var(--green); }
  .status-built { color: var(--accent); }
  .status-wip { color: var(--amber); }
  .status-planned { color: var(--text-faint); }

  /* Architecture Table */
  .arch-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .arch-table th { text-align: left; padding: 10px 14px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-faint); border-bottom: 1px solid var(--border); }
  .arch-table td { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.03); color: var(--text-sec); vertical-align: top; }
  .arch-table tr:hover td { background: rgba(255,255,255,0.01); }
  .arch-table .file { font-family: var(--mono); font-size: 11px; color: var(--accent); }
  .arch-table .role { font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 700; display: inline-block; }
  .role-api { background: rgba(91,156,245,0.12); color: var(--accent); }
  .role-component { background: rgba(52,211,153,0.12); color: var(--green); }
  .role-utility { background: rgba(245,183,49,0.12); color: var(--amber); }
  .role-page { background: rgba(161,129,247,0.12); color: var(--purple); }

  /* Status Legend */
  .legend { display: flex; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-dim); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
  .legend-dot.live { background: var(--green); }
  .legend-dot.built { background: var(--accent); }
  .legend-dot.wip { background: var(--amber); }
  .legend-dot.planned { background: var(--text-faint); }

  /* Data Flow Arrows */
  .data-flow { display: flex; align-items: center; gap: 0; margin: 40px 0; overflow-x: auto; padding: 10px 0; }
  .flow-node { padding: 16px 20px; border-radius: 12px; border: 1px solid var(--glass-border); background: var(--glass); text-align: center; min-width: 140px; flex-shrink: 0; }
  .flow-node .node-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-faint); margin-bottom: 4px; }
  .flow-node .node-value { font-size: 14px; font-weight: 700; color: var(--text); }
  .flow-arrow { font-size: 18px; color: var(--text-faint); padding: 0 8px; flex-shrink: 0; }

  /* Stripe Integration */
  .stripe-flow { background: linear-gradient(135deg, rgba(99,91,255,0.06), rgba(91,156,245,0.04)); border: 1px solid rgba(99,91,255,0.15); border-radius: var(--radius); padding: 28px; margin-bottom: 32px; }
  .stripe-flow h4 { font-size: 14px; font-weight: 800; color: var(--text); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .stripe-flow h4 .stripe-badge { font-size: 9px; padding: 3px 8px; border-radius: 4px; background: rgba(99,91,255,0.15); color: #635bff; font-weight: 800; letter-spacing: 0.04em; }

  /* Responsive */
  @media (max-width: 1024px) {
    .tier-pipeline { grid-template-columns: repeat(2, 1fr); }
    .flow-grid { grid-template-columns: 1fr; }
    .feature-list { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .tier-pipeline { grid-template-columns: 1fr; }
    body { padding: 20px 12px; }
  }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `
<div class="container">

  <!-- HEADER -->
  <div class="doc-header">
    <h1>FinanceOS — Dashboard Flow & Feature Pipeline</h1>
    <div class="subtitle">Complete architecture map of all dashboard views, plan-gated features, Stripe integration, and the data pipeline from auth to rendering. This document serves as the single source of truth for the platform's premium tier structure.</div>
    <div class="meta">Last Updated: March 27, 2026 · finance-os.app · Malik Frazier, CFO</div>
  </div>

  <!-- SECTION 1: TIER PIPELINE -->
  <div class="section">
    <div class="section-title">Plan Tiers & Feature Matrix</div>
    <div class="tier-pipeline">

      <!-- Free -->
      <div class="tier-card free">
        <div class="tier-accent"></div>
        <div class="tier-label">Free Trial</div>
        <div class="tier-name">Free</div>
        <div class="tier-price">$0/mo</div>
        <ul class="tier-features">
          <li><span class="check">&#10003;</span> Dashboard Overview</li>
          <li class="locked"><span class="lock">&#128274;</span> P&L Statement</li>
          <li class="locked"><span class="lock">&#128274;</span> KPI Cards</li>
          <li class="locked"><span class="lock">&#128274;</span> Integrations</li>
          <li class="locked"><span class="lock">&#128274;</span> AI Copilot</li>
          <li class="locked"><span class="lock">&#128274;</span> Forecast Engine</li>
          <li class="locked"><span class="lock">&#128274;</span> Scenario Models</li>
          <li class="locked"><span class="lock">&#128274;</span> Command Center</li>
        </ul>
        <div class="tier-seats">1 seat · 0 connectors</div>
      </div>

      <!-- Starter -->
      <div class="tier-card starter">
        <div class="tier-accent"></div>
        <div class="tier-label">Starter</div>
        <div class="tier-name">Starter</div>
        <div class="tier-price">$499/mo · $399/mo annual</div>
        <ul class="tier-features">
          <li><span class="check">&#10003;</span> Dashboard Overview</li>
          <li><span class="check">&#10003;</span> P&L Statement</li>
          <li><span class="check">&#10003;</span> Basic KPI Cards</li>
          <li><span class="check">&#10003;</span> Integrations (5 connectors)</li>
          <li><span class="check">&#10003;</span> Email Support</li>
          <li class="locked"><span class="lock">&#128274;</span> AI Copilot</li>
          <li class="locked"><span class="lock">&#128274;</span> Forecast Engine</li>
          <li class="locked"><span class="lock">&#128274;</span> Command Center</li>
        </ul>
        <div class="tier-seats">5 seats · 5 connectors</div>
      </div>

      <!-- Growth -->
      <div class="tier-card growth">
        <div class="tier-accent"></div>
        <div class="tier-label">Growth</div>
        <div class="tier-name">Growth</div>
        <div class="tier-price">$999/mo · $799/mo annual</div>
        <ul class="tier-features">
          <li><span class="check">&#10003;</span> Everything in Starter</li>
          <li><span class="check">&#10003;</span> AI Copilot (Claude-powered)</li>
          <li><span class="check">&#10003;</span> Forecast Engine (ML)</li>
          <li><span class="check">&#10003;</span> Scenario Modeling</li>
          <li><span class="check">&#10003;</span> Multi-Entity Consolidation</li>
          <li><span class="check">&#10003;</span> Slack Integration</li>
          <li class="locked"><span class="lock">&#128274;</span> Command Center</li>
          <li class="locked"><span class="lock">&#128274;</span> SOX Audit Trails</li>
        </ul>
        <div class="tier-seats">25 seats · 25 connectors</div>
      </div>

      <!-- Business -->
      <div class="tier-card business">
        <div class="tier-accent"></div>
        <div class="tier-label">Business</div>
        <div class="tier-name">Business</div>
        <div class="tier-price">$2,499/mo · $1,999/mo annual</div>
        <ul class="tier-features">
          <li><span class="check">&#10003;</span> Everything in Growth</li>
          <li><span class="check">&#10003;</span> Command Center (CEO/CFO/Controller)</li>
          <li><span class="check">&#10003;</span> Close Task Manager</li>
          <li><span class="check">&#10003;</span> Investor Metrics & Board Packs</li>
          <li><span class="check">&#10003;</span> SOX Audit Trails</li>
          <li><span class="check">&#10003;</span> SSO / SAML</li>
          <li><span class="check">&#10003;</span> Custom ML Models</li>
          <li><span class="check">&#10003;</span> Team Management</li>
        </ul>
        <div class="tier-seats">Unlimited seats · Unlimited connectors</div>
      </div>
    </div>
  </div>

  <!-- SECTION 2: AUTH → PLAN GATE DATA FLOW -->
  <div class="section">
    <div class="section-title">Plan Verification Pipeline (Every Dashboard Load)</div>

    <div class="stripe-flow">
      <h4>&#9889; Stripe Checkpoint Flow <span class="stripe-badge">STRIPE API</span></h4>
      <div style="font-size: 13px; color: var(--text-sec); line-height: 1.8; margin-bottom: 20px;">
        Every time a user loads the dashboard, a real-time checkpoint runs against Stripe. There is <strong style="color:var(--text)">no caching</strong> — the plan is verified fresh on every mount. If Stripe is unreachable or the user has no subscription, they default to Free.
      </div>

      <div class="data-flow">
        <div class="flow-node" style="border-color: rgba(52,211,153,0.2);">
          <div class="node-label">Step 1</div>
          <div class="node-value">User Loads Dashboard</div>
          <div style="font-size:10px;color:var(--text-faint);margin-top:4px;">Supabase Auth session</div>
        </div>
        <div class="flow-arrow">&#8594;</div>
        <div class="flow-node" style="border-color: rgba(91,156,245,0.2);">
          <div class="node-label">Step 2</div>
          <div class="node-value">GET /api/plan</div>
          <div style="font-size:10px;color:var(--text-faint);margin-top:4px;">?email=user@co.com</div>
        </div>
        <div class="flow-arrow">&#8594;</div>
        <div class="flow-node" style="border-color: rgba(99,91,255,0.3);">
          <div class="node-label">Step 3</div>
          <div class="node-value">Stripe Lookup</div>
          <div style="font-size:10px;color:var(--text-faint);margin-top:4px;">customers → subscriptions</div>
        </div>
        <div class="flow-arrow">&#8594;</div>
        <div class="flow-node" style="border-color: rgba(161,129,247,0.2);">
          <div class="node-label">Step 4</div>
          <div class="node-value">Product → Plan Map</div>
          <div style="font-size:10px;color:var(--text-faint);margin-top:4px;">prod_U8tg... → "starter"</div>
        </div>
        <div class="flow-arrow">&#8594;</div>
        <div class="flow-node" style="border-color: rgba(52,211,153,0.3);">
          <div class="node-label">Step 5</div>
          <div class="node-value">Render Gates</div>
          <div style="font-size:10px;color:var(--text-faint);margin-top:4px;">FeatureGate / UpgradePrompt</div>
        </div>
      </div>
    </div>

    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
      <h4 style="font-size: 14px; font-weight: 800; color: var(--text); margin-bottom: 12px;">Stripe Product ID Mapping</h4>
      <table class="arch-table">
        <thead><tr><th>Stripe Product ID</th><th>Plan Tier</th><th>Monthly</th><th>Annual</th><th>Features Unlocked</th></tr></thead>
        <tbody>
          <tr><td class="file">prod_U8tgVF7YBpllg3</td><td><span class="role role-component">Starter</span></td><td>$499</td><td>$399</td><td>P&L, KPIs, Integrations, Email Support</td></tr>
          <tr><td class="file">prod_U8thZLVQ5TrvmI</td><td><span class="role role-api">Growth</span></td><td>$999</td><td>$799</td><td>+ Forecast, Scenarios, AI Copilot, Multi-Entity, Slack</td></tr>
          <tr><td class="file">prod_U8thcOFxz4Niy1</td><td><span class="role role-page">Business</span></td><td>$2,499</td><td>$1,999</td><td>+ Command Center, Close Tasks, Investor, SOX, SSO, ML, Team</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- SECTION 3: SIDEBAR NAV → VIEW MAPPING -->
  <div class="section">
    <div class="section-title">Dashboard Navigation & View Routing</div>
    <div class="legend">
      <div class="legend-item"><div class="legend-dot live"></div> Live — Fully built, real data</div>
      <div class="legend-item"><div class="legend-dot built"></div> Built — Complete UI, demo data</div>
      <div class="legend-item"><div class="legend-dot wip"></div> WIP — Partial implementation</div>
      <div class="legend-item"><div class="legend-dot planned"></div> Planned — Not yet started</div>
    </div>

    <div class="flow-grid">
      <div class="flow-sidebar">
        <div class="flow-nav active">
          <div class="nav-icon" style="background:rgba(91,156,245,0.12);color:var(--accent);">&#9632;</div>
          Dashboard
          <span class="badge badge-free">Free</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(161,129,247,0.12);color:var(--purple);">&#9733;</div>
          AI Copilot
          <span class="badge badge-growth">Growth</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(52,211,153,0.12);color:var(--green);">&#9881;</div>
          P&L Statement
          <span class="badge badge-starter">Starter</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(91,156,245,0.12);color:var(--accent);">&#8599;</div>
          Forecast
          <span class="badge badge-growth">Growth</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(245,183,49,0.12);color:var(--amber);">&#9878;</div>
          Scenarios
          <span class="badge badge-growth">Growth</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(45,212,208,0.12);color:var(--cyan);">&#9881;</div>
          Consolidation
          <span class="badge badge-growth">Growth</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(240,107,107,0.12);color:var(--red);">&#10003;</div>
          Close Tasks
          <span class="badge badge-business">Business</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(161,129,247,0.12);color:var(--purple);">&#9827;</div>
          Team
          <span class="badge badge-business">Business</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(52,211,153,0.12);color:var(--green);">&#9889;</div>
          Integrations
          <span class="badge badge-starter">Starter</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(245,183,49,0.12);color:var(--amber);">&#9670;</div>
          Investor Metrics
          <span class="badge badge-business">Business</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(91,156,245,0.12);color:var(--accent);">&#9881;</div>
          Command Center
          <span class="badge badge-business">Business</span>
        </div>
        <div class="flow-nav">
          <div class="nav-icon" style="background:rgba(255,255,255,0.05);color:var(--text-dim);">&#9881;</div>
          Settings
          <span class="badge badge-free">Free</span>
        </div>
      </div>

      <div class="flow-main">
        <h3>All 13 Dashboard Views</h3>
        <div class="desc">Each sidebar nav item maps to a view ID and a feature key. The plan gate checks the user's Stripe-verified tier against the feature key. If locked, an upgrade prompt renders instead of the view content.</div>

        <div class="feature-list">
          <div class="feature-item">
            <div class="feat-name">Dashboard Overview</div>
            <div class="feat-desc">6 KPI cards (ARR, NDR, Gross Margin, Rule of 40, Burn Multiple, Headcount), revenue chart, department spend donut, activity feed, AI insights bar.</div>
            <div class="feat-status status-live">&#9679; Live — Full interactivity</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">AI Copilot</div>
            <div class="feat-desc">Claude-powered financial assistant with visible chain-of-thought reasoning. Chat interface, suggested prompts, connects to live financial data across 7 systems.</div>
            <div class="feat-status status-built">&#9679; Built — Claude API integrated</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">P&L Statement</div>
            <div class="feat-desc">Full income statement: Revenue breakdown (Subscription, Services, AI Module), COGS, Gross Profit, OpEx by department, EBITDA. Drill-down drawers on every line item.</div>
            <div class="feat-status status-built">&#9679; Built — Clickable drill-downs</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">Forecast Engine</div>
            <div class="feat-desc">ML-powered 12-month revenue forecast with confidence intervals, sensitivity sliders (churn, expansion, pipeline), actual vs. predicted tracking, MAPE accuracy scoring.</div>
            <div class="feat-status status-built">&#9679; Built — ML model + sliders</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">Scenario Modeling</div>
            <div class="feat-desc">3-scenario comparison engine (Base, Optimistic, Conservative) with adjustable drivers: growth rate, churn, headcount, burn. Exportable board-ready outputs.</div>
            <div class="feat-status status-built">&#9679; Built — 3 scenarios + export</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">Multi-Entity Consolidation</div>
            <div class="feat-desc">Acme US, Acme EU (EUR), Acme APAC (SGD). Intercompany eliminations, FX translation, entity-level close status, drill-down by entity with currency conversion.</div>
            <div class="feat-status status-built">&#9679; Built — 3 entities + FX</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">Close Task Manager</div>
            <div class="feat-desc">Month-end close workflow: checklist items with assignees, due dates, status tracking (done/in-progress/pending). Revenue recognition, reconciliations, accruals.</div>
            <div class="feat-status status-built">&#9679; Built — Full task workflow</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">Team Management</div>
            <div class="feat-desc">Team member list, roles, activity chat (Slack-like), task assignments, real-time presence indicators. Role-based access for CEO/CFO/Controller views.</div>
            <div class="feat-status status-built">&#9679; Built — Chat + presence</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">Integrations Hub</div>
            <div class="feat-desc">Data connector marketplace: QuickBooks (live OAuth), Stripe, Salesforce, HubSpot, Netsuite, Workday, Slack. Sync status, last-sync timestamps, health monitoring.</div>
            <div class="feat-status status-built">&#9679; Built — QuickBooks OAuth live</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">Investor Metrics</div>
            <div class="feat-desc">Series A readiness scorecard (8/8 benchmarks), SaaS metrics grid, cohort retention heatmap, fundraising readiness bar. CSV/PDF export for board packs.</div>
            <div class="feat-status status-built">&#9679; Built — Board-ready exports</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">Command Center</div>
            <div class="feat-desc">Executive hub with role-based tabs (CEO, CFO, Controller). AI insights carousel, deal pipeline, activity feed. CEO: pipeline coverage + win rate. CFO: cash flow + margins. Controller: close checklist + SOX.</div>
            <div class="feat-status status-built">&#9679; Built — 3 role dashboards</div>
          </div>
          <div class="feature-item">
            <div class="feat-name">Admin / Settings</div>
            <div class="feat-desc">Workspace configuration, connected systems, API key management, notification preferences, data export controls, team permissions.</div>
            <div class="feat-status status-built">&#9679; Built — Full settings panel</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 4: FILE ARCHITECTURE -->
  <div class="section">
    <div class="section-title">File Architecture & Code Map</div>
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; overflow-x: auto;">
      <table class="arch-table">
        <thead><tr><th>File</th><th>Role</th><th>Description</th><th>Lines</th></tr></thead>
        <tbody>
          <tr><td class="file">app/page.jsx</td><td><span class="role role-page">Page</span></td><td>Main dashboard — all 13 views, charts, KPI drawers, plan gating, theme system, AI copilot, error boundaries</td><td style="font-family:var(--mono);font-size:11px;">~11,979</td></tr>
          <tr><td class="file">app/api/plan/route.js</td><td><span class="role role-api">API</span></td><td>Stripe checkpoint — customer lookup → subscription check → product-to-plan mapping → feature matrix return</td><td style="font-family:var(--mono);font-size:11px;">260</td></tr>
          <tr><td class="file">app/lib/planGate.js</td><td><span class="role role-utility">Utility</span></td><td>Client-side plan utilities — canAccess(), requiredPlanFor(), fetchPlanCheckpoint(), UPGRADE_URLS</td><td style="font-family:var(--mono);font-size:11px;">161</td></tr>
          <tr><td class="file">app/components/PlanGate.jsx</td><td><span class="role role-component">Component</span></td><td>PlanProvider context, FeatureGate wrapper, UpgradePrompt UI, SidebarLockBadge, PlanBadge</td><td style="font-family:var(--mono);font-size:11px;">482</td></tr>
          <tr><td class="file">middleware.js</td><td><span class="role role-utility">Middleware</span></td><td>Next.js edge middleware — route protection, auth redirects, UTM capture</td><td style="font-family:var(--mono);font-size:11px;">—</td></tr>
          <tr><td class="file">app/api/drip/route.js</td><td><span class="role role-api">API</span></td><td>Email drip / onboarding automation trigger</td><td style="font-family:var(--mono);font-size:11px;">—</td></tr>
          <tr><td class="file">app/api/integrations/intuit/*</td><td><span class="role role-api">API</span></td><td>QuickBooks OAuth flow — connect, callback, disconnect routes</td><td style="font-family:var(--mono);font-size:11px;">—</td></tr>
          <tr><td class="file">public/sage-stone.html</td><td><span class="role role-page">Theme</span></td><td>Spring template #1 — Sage & Stone with customize panel + pages.js nav</td><td style="font-family:var(--mono);font-size:11px;">~1,300</td></tr>
          <tr><td class="file">public/botanical.html</td><td><span class="role role-page">Theme</span></td><td>Spring template #2 — Botanical Corporate with customize panel + pages.js nav</td><td style="font-family:var(--mono);font-size:11px;">~920</td></tr>
          <tr><td class="file">public/executive-blossom.html</td><td><span class="role role-page">Theme</span></td><td>Spring template #3 — Executive Blossom with customize panel + pages.js nav</td><td style="font-family:var(--mono);font-size:11px;">~950</td></tr>
          <tr><td class="file">public/pages.js</td><td><span class="role role-utility">Utility</span></td><td>Shared navigation system for Spring templates — Copilot, Forecast, P&L, Scenarios, Consolidation, Settings</td><td style="font-family:var(--mono);font-size:11px;">~700</td></tr>
          <tr><td class="file">public/themes/index.html</td><td><span class="role role-page">Theme</span></td><td>Theme chooser landing page with live iframe previews of all 3 Spring templates</td><td style="font-family:var(--mono);font-size:11px;">~340</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- SECTION 5: FEATURE STATUS BY TIER -->
  <div class="section">
    <div class="section-title">Feature Status & Completeness Audit</div>
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; overflow-x: auto;">
      <table class="arch-table">
        <thead><tr><th>Feature Key</th><th>Required Plan</th><th>UI Status</th><th>Backend Status</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>dashboard_overview</td><td><span class="role badge-free" style="background:rgba(255,255,255,0.05);color:var(--text-dim);">Free</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--green);">&#9679; Complete</td><td>6 KPIs, charts, activity feed, AI bar</td></tr>
          <tr><td>pnl</td><td><span class="role badge-starter" style="background:rgba(52,211,153,0.12);color:#34d399;">Starter</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--accent);">&#9679; Demo data</td><td>Full P&L with drill-down drawers</td></tr>
          <tr><td>basic_kpis</td><td><span class="role badge-starter" style="background:rgba(52,211,153,0.12);color:#34d399;">Starter</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--accent);">&#9679; Demo data</td><td>Clickable KPI cards with trend sparklines</td></tr>
          <tr><td>integrations</td><td><span class="role badge-starter" style="background:rgba(52,211,153,0.12);color:#34d399;">Starter</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--green);">&#9679; QuickBooks live</td><td>OAuth flow for QuickBooks; others are mock</td></tr>
          <tr><td>email_support</td><td><span class="role badge-starter" style="background:rgba(52,211,153,0.12);color:#34d399;">Starter</span></td><td style="color:var(--text-faint);">&#9679; N/A (service)</td><td style="color:var(--text-faint);">&#9679; N/A</td><td>Support channel access, not a dashboard view</td></tr>
          <tr><td>forecast</td><td><span class="role badge-growth" style="background:rgba(91,156,245,0.12);color:var(--accent);">Growth</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--accent);">&#9679; Demo data</td><td>ML forecast with sensitivity sliders + MAPE</td></tr>
          <tr><td>scenarios</td><td><span class="role badge-growth" style="background:rgba(91,156,245,0.12);color:var(--accent);">Growth</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--accent);">&#9679; Demo data</td><td>3-scenario engine with adjustable drivers</td></tr>
          <tr><td>ai_copilot</td><td><span class="role badge-growth" style="background:rgba(91,156,245,0.12);color:var(--accent);">Growth</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--green);">&#9679; Claude API</td><td>Visible reasoning, financial data context</td></tr>
          <tr><td>multi_entity</td><td><span class="role badge-growth" style="background:rgba(91,156,245,0.12);color:var(--accent);">Growth</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--accent);">&#9679; Demo data</td><td>3 entities (US, EU, APAC) + FX + eliminations</td></tr>
          <tr><td>slack_integration</td><td><span class="role badge-growth" style="background:rgba(91,156,245,0.12);color:var(--accent);">Growth</span></td><td style="color:var(--amber);">&#9679; Partial</td><td style="color:var(--text-faint);">&#9679; Not connected</td><td>UI exists in integrations hub; no live Slack OAuth</td></tr>
          <tr><td>command_center</td><td><span class="role badge-business" style="background:rgba(161,129,247,0.12);color:var(--purple);">Business</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--accent);">&#9679; Demo data</td><td>CEO/CFO/Controller role tabs, AI insights, pipeline</td></tr>
          <tr><td>close_tasks</td><td><span class="role badge-business" style="background:rgba(161,129,247,0.12);color:var(--purple);">Business</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--accent);">&#9679; Demo data</td><td>Month-end workflow with drag-to-complete</td></tr>
          <tr><td>investor_metrics</td><td><span class="role badge-business" style="background:rgba(161,129,247,0.12);color:var(--purple);">Business</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--accent);">&#9679; Demo data</td><td>8/8 Series A scorecard, CSV/PDF export</td></tr>
          <tr><td>sox_audit</td><td><span class="role badge-business" style="background:rgba(161,129,247,0.12);color:var(--purple);">Business</span></td><td style="color:var(--amber);">&#9679; Partial</td><td style="color:var(--text-faint);">&#9679; Planned</td><td>Referenced in Controller tab; needs dedicated view</td></tr>
          <tr><td>sso</td><td><span class="role badge-business" style="background:rgba(161,129,247,0.12);color:var(--purple);">Business</span></td><td style="color:var(--text-faint);">&#9679; Planned</td><td style="color:var(--text-faint);">&#9679; Planned</td><td>SAML/OIDC — needs integration with Supabase Auth</td></tr>
          <tr><td>custom_ml</td><td><span class="role badge-business" style="background:rgba(161,129,247,0.12);color:var(--purple);">Business</span></td><td style="color:var(--text-faint);">&#9679; Planned</td><td style="color:var(--text-faint);">&#9679; Planned</td><td>Custom ML model training UI — not yet started</td></tr>
          <tr><td>team_management</td><td><span class="role badge-business" style="background:rgba(161,129,247,0.12);color:var(--purple);">Business</span></td><td style="color:var(--green);">&#9679; Complete</td><td style="color:var(--accent);">&#9679; Demo data</td><td>Team view with chat, roles, task assignments</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- SECTION 6: WHAT'S NEXT -->
  <div class="section">
    <div class="section-title">Remaining Pipeline — What Needs to be Built</div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">

      <div style="background: var(--glass); border: 1px solid rgba(240,107,107,0.15); border-radius: var(--radius); padding: 24px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--red); margin-bottom: 8px;">Priority 1 — High Impact</div>
        <div style="font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 12px;">SOX Audit Trails View</div>
        <div style="font-size: 12px; color: var(--text-dim); line-height: 1.7; margin-bottom: 12px;">
          Dedicated view for SOX compliance: audit log table with timestamps, user actions, control sign-offs, automated evidence collection. Currently only partially referenced in the Controller tab of Command Center.
        </div>
        <div style="font-size: 10px; color: var(--text-faint); font-family: var(--mono);">Feature key: sox_audit · Business tier</div>
      </div>

      <div style="background: var(--glass); border: 1px solid rgba(245,183,49,0.15); border-radius: var(--radius); padding: 24px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--amber); margin-bottom: 8px;">Priority 2 — Revenue Enabler</div>
        <div style="font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 12px;">SSO / SAML Integration</div>
        <div style="font-size: 12px; color: var(--text-dim); line-height: 1.7; margin-bottom: 12px;">
          Enterprise SSO via SAML 2.0 or OIDC. Requires Supabase Auth extension or custom identity provider hook. Admin UI for configuring IdP settings, domain verification, and user provisioning.
        </div>
        <div style="font-size: 10px; color: var(--text-faint); font-family: var(--mono);">Feature key: sso · Business tier</div>
      </div>

      <div style="background: var(--glass); border: 1px solid rgba(161,129,247,0.15); border-radius: var(--radius); padding: 24px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--purple); margin-bottom: 8px;">Priority 3 — Differentiation</div>
        <div style="font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 12px;">Custom ML Models</div>
        <div style="font-size: 12px; color: var(--text-dim); line-height: 1.7; margin-bottom: 12px;">
          UI for uploading training data, selecting model type (forecast, anomaly detection, classification), training status dashboard, A/B model comparison, and deployment to live forecasting pipeline.
        </div>
        <div style="font-size: 10px; color: var(--text-faint); font-family: var(--mono);">Feature key: custom_ml · Business tier</div>
      </div>

      <div style="background: var(--glass); border: 1px solid rgba(91,156,245,0.15); border-radius: var(--radius); padding: 24px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); margin-bottom: 8px;">Priority 4 — Growth Tier</div>
        <div style="font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 12px;">Live Slack OAuth</div>
        <div style="font-size: 12px; color: var(--text-dim); line-height: 1.7; margin-bottom: 12px;">
          The Slack integration card exists in the Integrations view but has no live OAuth flow. Needs: Slack App creation, OAuth callback route, channel selector, and notification rules (budget alerts, close reminders).
        </div>
        <div style="font-size: 10px; color: var(--text-faint); font-family: var(--mono);">Feature key: slack_integration · Growth tier</div>
      </div>

      <div style="background: var(--glass); border: 1px solid rgba(52,211,153,0.15); border-radius: var(--radius); padding: 24px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--green); margin-bottom: 8px;">Priority 5 — Polish</div>
        <div style="font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 12px;">Spring Themes → Vercel Deploy</div>
        <div style="font-size: 12px; color: var(--text-dim); line-height: 1.7; margin-bottom: 12px;">
          3 Spring 2026 templates (Sage & Stone, Botanical, Executive Blossom) + theme chooser page are built and in the public/ folder. Need to push to GitHub to trigger Vercel auto-deploy to finance-os.app.
        </div>
        <div style="font-size: 10px; color: var(--text-faint); font-family: var(--mono);">Routes: /themes, /sage-stone.html, /botanical.html, /executive-blossom.html</div>
      </div>

      <div style="background: var(--glass); border: 1px solid rgba(45,212,208,0.15); border-radius: var(--radius); padding: 24px;">
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--cyan); margin-bottom: 8px;">Priority 6 — Data</div>
        <div style="font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 12px;">Live Data Connections</div>
        <div style="font-size: 12px; color: var(--text-dim); line-height: 1.7; margin-bottom: 12px;">
          Most views use hardcoded demo data. Connecting to live Supabase tables (already provisioned) would make P&L, Forecast, and Consolidation views pull real financial data. QuickBooks is the only live integration so far.
        </div>
        <div style="font-size: 10px; color: var(--text-faint); font-family: var(--mono);">Supabase tables: transactions, forecasts, entities, audit_log</div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="text-align: center; padding: 40px 0 20px; border-top: 1px solid var(--border); margin-top: 20px;">
    <div style="font-size: 14px; font-weight: 800; background: linear-gradient(135deg, var(--accent), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px;">FinanceOS</div>
    <div style="font-size: 11px; color: var(--text-faint);">Dashboard Flow & Pipeline Document · Confidential · March 2026</div>
  </div>
</div>
` }} />
    </>
  );
}
