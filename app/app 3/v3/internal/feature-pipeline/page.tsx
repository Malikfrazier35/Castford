'use client';

import { useEffect } from 'react';

export default function V3InternalFeaturePipelinePage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  :root {
    --bg: #06080c;
    --surface: #10131a;
    --border: #1a1f2e;
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
    --font: 'DM Sans', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--bg); color:var(--text); font-family:var(--font); padding:48px 24px; }
  .wrap { max-width:1400px; margin:0 auto; }

  /* Header */
  .hdr { text-align:center; margin-bottom:56px; }
  .hdr h1 { font-size:36px; font-weight:800; letter-spacing:-0.04em; margin-bottom:8px; }
  .hdr h1 span { background:linear-gradient(135deg,var(--accent),var(--purple),var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-size:300% 300%; animation:gradShift 6s ease-in-out infinite; }
  @keyframes gradShift { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
  .hdr p { font-size:15px; color:var(--text-sec); max-width:660px; margin:0 auto; line-height:1.7; }
  .hdr .meta { font-size:11px; color:var(--text-faint); font-family:var(--mono); margin-top:10px; }

  /* Legend */
  .legend { display:flex; gap:24px; justify-content:center; margin-bottom:40px; flex-wrap:wrap; }
  .legend-item { display:flex; align-items:center; gap:6px; font-size:11px; color:var(--text-dim); }
  .leg-dot { width:10px; height:10px; border-radius:3px; }

  /* Pipeline Stage */
  .stage { margin-bottom:48px; position:relative; }
  .stage-header { display:flex; align-items:center; gap:16px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border); }
  .stage-num { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:#fff; flex-shrink:0; }
  .stage-info h2 { font-size:20px; font-weight:800; letter-spacing:-0.02em; }
  .stage-info p { font-size:12px; color:var(--text-dim); margin-top:2px; }
  .stage-badge { font-size:9px; font-weight:800; padding:3px 10px; border-radius:6px; text-transform:uppercase; letter-spacing:0.08em; margin-left:auto; }

  /* Pipeline connector */
  .connector { width:2px; height:32px; margin:0 auto; background:linear-gradient(180deg, var(--border), var(--text-faint), var(--border)); border-radius:1px; }

  /* Feature cards — pipeline rows */
  .pipe-row { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:14px; }
  .pipe-card { background:var(--glass); border:1px solid var(--glass-border); border-radius:14px; padding:22px; position:relative; overflow:hidden; transition:all 0.25s; }
  .pipe-card:hover { border-color:rgba(255,255,255,0.12); transform:translateY(-2px); box-shadow:0 12px 40px rgba(0,0,0,0.3); }
  .pipe-card .accent-bar { position:absolute; top:0; left:0; width:100%; height:3px; }
  .pipe-card .card-head { display:flex; align-items:flex-start; gap:12px; margin-bottom:12px; }
  .pipe-card .icon-box { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }
  .pipe-card h3 { font-size:15px; font-weight:800; letter-spacing:-0.01em; margin-bottom:2px; }
  .pipe-card .tier-badge { font-size:8px; font-weight:800; padding:2px 7px; border-radius:4px; text-transform:uppercase; letter-spacing:0.06em; display:inline-block; margin-top:2px; }
  .pipe-card .desc { font-size:12px; color:var(--text-dim); line-height:1.65; margin-bottom:14px; }

  /* Sub-features list */
  .sub-features { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
  .sub-feat { display:flex; align-items:center; gap:6px; font-size:11px; color:var(--text-sec); padding:5px 8px; border-radius:6px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.03); }
  .sub-feat .sf-icon { font-size:10px; flex-shrink:0; width:14px; text-align:center; }

  /* Status */
  .status { display:flex; align-items:center; gap:6px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.04); }
  .status-dot { width:7px; height:7px; border-radius:50%; }

  /* Tier colors */
  .t-free { background:rgba(255,255,255,0.06); color:var(--text-dim); }
  .t-starter { background:rgba(52,211,153,0.1); color:#34d399; }
  .t-growth { background:rgba(91,156,245,0.1); color:var(--accent); }
  .t-business { background:rgba(161,129,247,0.1); color:var(--purple); }

  .a-free { background:var(--text-dim); }
  .a-starter { background:linear-gradient(90deg,#34d399,#3dd9a0); }
  .a-growth { background:linear-gradient(90deg,var(--accent),#60a5fa); }
  .a-business { background:linear-gradient(90deg,var(--purple),#c084fc); }

  /* Data flow section */
  .flow-strip { display:flex; align-items:center; gap:0; overflow-x:auto; padding:16px 0; margin-bottom:16px; }
  .flow-box { padding:14px 18px; border-radius:10px; border:1px solid var(--glass-border); background:var(--glass); text-align:center; min-width:130px; flex-shrink:0; }
  .flow-box .fb-label { font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-faint); margin-bottom:3px; }
  .flow-box .fb-value { font-size:13px; font-weight:700; color:var(--text); }
  .flow-arrow { font-size:16px; color:var(--text-faint); padding:0 6px; flex-shrink:0; }

  /* Footer */
  .footer { text-align:center; padding-top:32px; border-top:1px solid var(--border); margin-top:24px; }
  .footer-brand { font-size:15px; font-weight:800; background:linear-gradient(135deg,var(--accent),var(--purple)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }

  @media(max-width:768px) {
    .pipe-row { grid-template-columns:1fr; }
    .sub-features { grid-template-columns:1fr; }
    .hdr h1 { font-size:26px; }
  }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `
<div class="wrap">

  <div class="hdr">
    <h1>FinanceOS <span>Feature Pipeline Map</span></h1>
    <p>Every feature in the platform — organized by pipeline stage, from data ingestion through executive reporting. Each card maps to a sidebar view, plan tier, and build status.</p>
    <div class="meta">17 feature keys · 4 plan tiers · 13 sidebar views · March 2026</div>
  </div>

  <div class="legend">
    <div class="legend-item"><div class="leg-dot" style="background:var(--green);"></div> Live — Shipped</div>
    <div class="legend-item"><div class="leg-dot" style="background:var(--accent);"></div> Built — Demo Data</div>
    <div class="legend-item"><div class="leg-dot" style="background:var(--amber);"></div> In Progress</div>
    <div class="legend-item"><div class="leg-dot" style="background:var(--text-faint);"></div> Planned</div>
    <div class="legend-item"><div class="leg-dot t-free" style="width:auto;height:auto;padding:1px 6px;font-size:9px;font-weight:800;">FREE</div></div>
    <div class="legend-item"><div class="leg-dot t-starter" style="width:auto;height:auto;padding:1px 6px;font-size:9px;font-weight:800;">STARTER</div></div>
    <div class="legend-item"><div class="leg-dot t-growth" style="width:auto;height:auto;padding:1px 6px;font-size:9px;font-weight:800;">GROWTH</div></div>
    <div class="legend-item"><div class="leg-dot t-business" style="width:auto;height:auto;padding:1px 6px;font-size:9px;font-weight:800;">BUSINESS</div></div>
  </div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- STAGE 1: DATA INGESTION & AUTHENTICATION -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div class="stage">
    <div class="stage-header">
      <div class="stage-num" style="background:linear-gradient(135deg,#34d399,var(--cyan));">1</div>
      <div class="stage-info">
        <h2>Data Ingestion & Auth</h2>
        <p>How data enters the platform — integrations, authentication, and plan verification</p>
      </div>
      <span class="stage-badge t-starter">Starter+</span>
    </div>

    <!-- Data flow visualization -->
    <div class="flow-strip">
      <div class="flow-box"><div class="fb-label">Source</div><div class="fb-value">QuickBooks / Stripe / CRM</div></div>
      <div class="flow-arrow">→</div>
      <div class="flow-box"><div class="fb-label">Auth</div><div class="fb-value">Supabase + OAuth</div></div>
      <div class="flow-arrow">→</div>
      <div class="flow-box"><div class="fb-label">Gate</div><div class="fb-value">GET /api/plan</div></div>
      <div class="flow-arrow">→</div>
      <div class="flow-box"><div class="fb-label">Verify</div><div class="fb-value">Stripe Checkpoint</div></div>
      <div class="flow-arrow">→</div>
      <div class="flow-box"><div class="fb-label">Unlock</div><div class="fb-value">FeatureGate Render</div></div>
    </div>

    <div class="pipe-row">
      <!-- Integrations Hub -->
      <div class="pipe-card">
        <div class="accent-bar a-starter"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(52,211,153,0.1);">&#9889;</div>
          <div>
            <h3>Integrations Hub</h3>
            <span class="tier-badge t-starter">Starter</span>
          </div>
        </div>
        <div class="desc">Connect financial data sources with one-click OAuth. Real-time sync status, health monitoring, and error recovery. QuickBooks is the first live connector.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> QuickBooks OAuth (live)</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--accent);">&#9679;</span> Stripe connector</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--accent);">&#9679;</span> Salesforce connector</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--accent);">&#9679;</span> HubSpot connector</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--accent);">&#9679;</span> NetSuite connector</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--accent);">&#9679;</span> Workday connector</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--green);"></div> Live — QuickBooks OAuth active</div>
      </div>

      <!-- Slack Integration -->
      <div class="pipe-card">
        <div class="accent-bar a-growth"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(91,156,245,0.1);">&#128172;</div>
          <div>
            <h3>Slack Integration</h3>
            <span class="tier-badge t-growth">Growth</span>
          </div>
        </div>
        <div class="desc">Deliver financial alerts, close reminders, and AI insights directly to Slack channels. Budget threshold alerts, weekly digest summaries.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--amber);">&#9679;</span> Slack OAuth flow</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Channel selector</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Budget alert rules</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Weekly digest bot</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--amber);"></div> In Progress — UI card exists, needs OAuth</div>
      </div>

      <!-- SSO / SAML -->
      <div class="pipe-card">
        <div class="accent-bar a-business"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#128272;</div>
          <div>
            <h3>SSO / SAML</h3>
            <span class="tier-badge t-business">Business</span>
          </div>
        </div>
        <div class="desc">Enterprise single sign-on via SAML 2.0 or OIDC. Domain verification, auto-provisioning, centralized access policies. Integrates with Okta, Azure AD, Google Workspace.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> SAML 2.0 config</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> OIDC support</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Domain verification</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Auto-provisioning</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--text-faint);"></div> Planned — Feature key exists, needs Supabase Auth extension</div>
      </div>
    </div>
  </div>

  <div class="connector"></div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- STAGE 2: CORE FINANCIAL VIEWS -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div class="stage">
    <div class="stage-header">
      <div class="stage-num" style="background:linear-gradient(135deg,var(--accent),var(--cyan));">2</div>
      <div class="stage-info">
        <h2>Core Financial Views</h2>
        <p>The primary financial data views — dashboard, P&L, KPIs, and chart of accounts</p>
      </div>
      <span class="stage-badge t-free">Free+</span>
    </div>

    <div class="pipe-row">
      <!-- Dashboard Overview -->
      <div class="pipe-card">
        <div class="accent-bar" style="background:var(--text-dim);"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(255,255,255,0.05);">&#128200;</div>
          <div>
            <h3>Dashboard Overview</h3>
            <span class="tier-badge t-free">Free</span>
          </div>
        </div>
        <div class="desc">The home view. 6 interactive KPI cards with sparkline trends and drill-down drawers. Revenue vs plan chart, department spend donut, AI insights bar, and real-time activity feed.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> 6 KPI cards + drawers</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Revenue chart (Recharts)</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Department spend donut</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Activity feed</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> AI insights bar</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Dark/light theme toggle</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--green);"></div> Live — Full interactivity</div>
      </div>

      <!-- P&L Statement -->
      <div class="pipe-card">
        <div class="accent-bar a-starter"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(52,211,153,0.1);">&#128203;</div>
          <div>
            <h3>P&L Statement</h3>
            <span class="tier-badge t-starter">Starter</span>
          </div>
        </div>
        <div class="desc">Full income statement with clickable line items. Revenue (Subscription $46.4M, Services $3.2M, AI Module $1.6M), COGS, Gross Profit, OpEx by department, EBITDA $3.8M. Each row opens a detail drawer.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Revenue breakdown</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> COGS detail</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> OpEx by department</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Drill-down drawers</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Budget vs Actual</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> CSV/PDF export</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--accent);"></div> Built — Demo data, needs live GL connection</div>
      </div>

      <!-- Basic KPIs -->
      <div class="pipe-card">
        <div class="accent-bar a-starter"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(52,211,153,0.1);">&#128202;</div>
          <div>
            <h3>Basic KPI Cards</h3>
            <span class="tier-badge t-starter">Starter</span>
          </div>
        </div>
        <div class="desc">ARR ($48.6M), NDR (118%), Gross Margin (84.7%), Rule of 40 (52.1), Burn Multiple (0.8x), Headcount (312). Each card is clickable — opens a detail drawer with 6-8 sub-metrics and a trend sparkline.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> ARR + NDR</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Gross Margin</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Rule of 40</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Burn Multiple</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Headcount</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Sparkline trends</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--accent);"></div> Built — 20+ KPI detail drawers</div>
      </div>
    </div>
  </div>

  <div class="connector"></div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- STAGE 3: INTELLIGENCE & PREDICTION -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div class="stage">
    <div class="stage-header">
      <div class="stage-num" style="background:linear-gradient(135deg,var(--accent),var(--purple));">3</div>
      <div class="stage-info">
        <h2>Intelligence & Prediction</h2>
        <p>AI-powered analytics — copilot, forecasting, scenario modeling, and custom ML</p>
      </div>
      <span class="stage-badge t-growth">Growth+</span>
    </div>

    <div class="pipe-row">
      <!-- AI Copilot -->
      <div class="pipe-card">
        <div class="accent-bar a-growth"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(91,156,245,0.1);">&#129302;</div>
          <div>
            <h3>AI Copilot</h3>
            <span class="tier-badge t-growth">Growth</span>
          </div>
        </div>
        <div class="desc">Claude-powered financial assistant with visible chain-of-thought reasoning. Chat interface with suggested prompts. Accesses real-time data across all 7 connected systems. Can explain variances, project revenue, flag churn risk, and prep board summaries.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Claude API integration</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Visible reasoning</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Suggested prompts</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Financial data context</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Conversation history</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--accent);">&#9679;</span> Multi-system queries</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--green);"></div> Live — Claude API connected</div>
      </div>

      <!-- Forecast Engine -->
      <div class="pipe-card">
        <div class="accent-bar a-growth"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(91,156,245,0.1);">&#128201;</div>
          <div>
            <h3>Forecast Engine</h3>
            <span class="tier-badge t-growth">Growth</span>
          </div>
        </div>
        <div class="desc">ML-powered 12-month revenue forecast. Confidence intervals (82-96%), sensitivity sliders for churn/expansion/pipeline, actual vs predicted tracking, MAPE accuracy score (3.2%). Auto-retrains every 6 hours.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> 12-month projections</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Confidence intervals</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Sensitivity sliders</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> MAPE scoring</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Auto-retrain</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Actual vs Predicted</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--accent);"></div> Built — Full UI with demo ML model</div>
      </div>

      <!-- Scenario Modeling -->
      <div class="pipe-card">
        <div class="accent-bar a-growth"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(91,156,245,0.1);">&#9878;</div>
          <div>
            <h3>Scenario Modeling</h3>
            <span class="tier-badge t-growth">Growth</span>
          </div>
        </div>
        <div class="desc">3-scenario comparison: Base ($62.8M), Optimistic ($73.2M), Conservative ($54.1M). Adjustable drivers: growth rate, churn multiplier, headcount ramp, burn rate. Board-ready export with assumption tables.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Base / Optimistic / Conservative</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Adjustable drivers</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Sensitivity table</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Export to PDF</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--accent);"></div> Built — 3 scenarios + drivers</div>
      </div>

      <!-- Custom ML Models -->
      <div class="pipe-card">
        <div class="accent-bar a-business"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#129504;</div>
          <div>
            <h3>Custom ML Models</h3>
            <span class="tier-badge t-business">Business</span>
          </div>
        </div>
        <div class="desc">Train models on your own financial data — revenue forecasting, anomaly detection, churn prediction, expense classification. Model training dashboard, A/B comparison, one-click deploy to live pipeline.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Training data upload</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Model type selection</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Training status UI</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> A/B model comparison</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Deploy to live</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Accuracy monitoring</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--text-faint);"></div> Planned — Feature key exists, view not yet built</div>
      </div>
    </div>
  </div>

  <div class="connector"></div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- STAGE 4: MULTI-ENTITY & CONSOLIDATION -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div class="stage">
    <div class="stage-header">
      <div class="stage-num" style="background:linear-gradient(135deg,var(--cyan),var(--green));">4</div>
      <div class="stage-info">
        <h2>Multi-Entity & Consolidation</h2>
        <p>Cross-entity financial management — consolidation, FX translation, intercompany eliminations</p>
      </div>
      <span class="stage-badge t-growth">Growth+</span>
    </div>

    <div class="pipe-row">
      <div class="pipe-card">
        <div class="accent-bar a-growth"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(45,212,208,0.1);">&#127758;</div>
          <div>
            <h3>Multi-Entity Consolidation</h3>
            <span class="tier-badge t-growth">Growth</span>
          </div>
        </div>
        <div class="desc">Consolidate across Acme US ($38.9M), Acme EU (€7.97M → $8.65M), Acme APAC (S$4.85M → $3.62M). Automatic FX translation, intercompany eliminations (-$1.2M), entity-level close tracking.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> 3 entities (US, EU, APAC)</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> FX translation (EUR, SGD)</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> IC eliminations</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Entity close status</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Entity drill-down drawers</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--accent);">&#9679;</span> Consolidated P&L</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--accent);"></div> Built — Full UI with FX</div>
      </div>
    </div>
  </div>

  <div class="connector"></div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- STAGE 5: OPERATIONS & CLOSE -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div class="stage">
    <div class="stage-header">
      <div class="stage-num" style="background:linear-gradient(135deg,var(--amber),var(--red));">5</div>
      <div class="stage-info">
        <h2>Operations & Month-End Close</h2>
        <p>Close task management, audit trails, and compliance workflows</p>
      </div>
      <span class="stage-badge t-business">Business</span>
    </div>

    <div class="pipe-row">
      <!-- Close Tasks -->
      <div class="pipe-card">
        <div class="accent-bar a-business"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#10003;</div>
          <div>
            <h3>Close Task Manager</h3>
            <span class="tier-badge t-business">Business</span>
          </div>
        </div>
        <div class="desc">Month-end close workflow automation. Checklist items with assignees, due dates, dependencies. Revenue recognition review, intercompany eliminations, accruals, bank rec, tax provision.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Task checklists</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Assignee + due dates</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Status tracking</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Progress bar</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Activity logging</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--accent);">&#9679;</span> Dependencies</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--accent);"></div> Built — Full workflow UI</div>
      </div>

      <!-- SOX Audit Trails -->
      <div class="pipe-card">
        <div class="accent-bar a-business"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#128274;</div>
          <div>
            <h3>SOX Audit Trails</h3>
            <span class="tier-badge t-business">Business</span>
          </div>
        </div>
        <div class="desc">Section 404 compliance. Full audit log with timestamps, user actions, control sign-offs, automated evidence collection. Currently referenced in Controller tab of Command Center — needs dedicated view.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--amber);">&#9679;</span> Audit log table</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Control sign-offs</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Evidence collection</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Compliance reports</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--amber);">&#9679;</span> Supabase audit_log table</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--text-faint);">&#9679;</span> Dedicated sidebar view</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--amber);"></div> Partial — Referenced in Controller tab, needs full view</div>
      </div>
    </div>
  </div>

  <div class="connector"></div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- STAGE 6: EXECUTIVE REPORTING -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div class="stage">
    <div class="stage-header">
      <div class="stage-num" style="background:linear-gradient(135deg,var(--purple),#ec4899);">6</div>
      <div class="stage-info">
        <h2>Executive Reporting & Board Readiness</h2>
        <p>Command center, investor metrics, and board-ready exports</p>
      </div>
      <span class="stage-badge t-business">Business</span>
    </div>

    <div class="pipe-row">
      <!-- Command Center -->
      <div class="pipe-card">
        <div class="accent-bar a-business"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#127919;</div>
          <div>
            <h3>Command Center</h3>
            <span class="tier-badge t-business">Business</span>
          </div>
        </div>
        <div class="desc">Executive hub with role-based dashboards. CEO view: pipeline coverage (4.2x), win rate (34%), deal size ($182K), sales velocity ($1.2M/wk). CFO view: operating cash flow, D/E ratio, working capital. Controller: close checklist + SOX status.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> CEO dashboard</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> CFO dashboard</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Controller dashboard</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> AI insights carousel</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> KPI grid</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Deal pipeline</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--accent);"></div> Built — 3 role-based views + AI</div>
      </div>

      <!-- Investor Metrics -->
      <div class="pipe-card">
        <div class="accent-bar a-business"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#128202;</div>
          <div>
            <h3>Investor Metrics & Board Packs</h3>
            <span class="tier-badge t-business">Business</span>
          </div>
        </div>
        <div class="desc">Series A readiness scorecard — 8/8 SaaS benchmarks passing. ARR, NDR, Rule of 40, Burn Multiple, Gross Margin, CAC Payback, LTV/CAC, Cash Runway. Cohort retention analysis. One-click CSV/PDF board pack export.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> 8-metric scorecard</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Cohort retention</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> CSV export</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> PDF export</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Benchmark comparison</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Drill-down drawers</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--accent);"></div> Built — Board-ready with exports</div>
      </div>
    </div>
  </div>

  <div class="connector"></div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- STAGE 7: COLLABORATION & TEAM -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div class="stage">
    <div class="stage-header">
      <div class="stage-num" style="background:linear-gradient(135deg,#ec4899,var(--amber));">7</div>
      <div class="stage-info">
        <h2>Collaboration & Administration</h2>
        <p>Team management, workspace settings, and platform administration</p>
      </div>
      <span class="stage-badge t-business">Business</span>
    </div>

    <div class="pipe-row">
      <!-- Team Management -->
      <div class="pipe-card">
        <div class="accent-bar a-business"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#128101;</div>
          <div>
            <h3>Team Management</h3>
            <span class="tier-badge t-business">Business</span>
          </div>
        </div>
        <div class="desc">Team member list with roles, Slack-style chat channel, task assignments with priority and due dates. Real-time presence indicators. Role-based access controls.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Member list + roles</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Team chat</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Task assignments</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Presence indicators</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Activity log</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--accent);">&#9679;</span> Permission policies</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--accent);"></div> Built — Chat + roles + tasks</div>
      </div>

      <!-- Admin -->
      <div class="pipe-card">
        <div class="accent-bar" style="background:var(--text-dim);"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(255,255,255,0.05);">&#9881;</div>
          <div>
            <h3>Admin Console</h3>
            <span class="tier-badge t-free">Free</span>
          </div>
        </div>
        <div class="desc">Workspace configuration, notification preferences, connected systems overview, API key management, data export controls. Available on all plans.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Workspace config</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Notification prefs</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> API key management</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Data export</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--accent);"></div> Built — Full settings panel</div>
      </div>

      <!-- Email Support -->
      <div class="pipe-card">
        <div class="accent-bar a-starter"></div>
        <div class="card-head">
          <div class="icon-box" style="background:rgba(52,211,153,0.1);">&#128231;</div>
          <div>
            <h3>Email Support</h3>
            <span class="tier-badge t-starter">Starter</span>
          </div>
        </div>
        <div class="desc">Dedicated email support channel. Starter gets email support, Growth gets priority support, Business gets a dedicated Customer Success Manager.</div>
        <div class="sub-features">
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Starter: Email</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Growth: Priority</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--green);">&#10003;</span> Business: Dedicated CSM</div>
          <div class="sub-feat"><span class="sf-icon" style="color:var(--accent);">&#9679;</span> In-app help widget</div>
        </div>
        <div class="status"><div class="status-dot" style="background:var(--green);"></div> Live — Service tier, not a dashboard view</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-brand">FinanceOS</div>
    <div style="font-size:11px; color:var(--text-faint); margin-top:4px;">Complete Feature Pipeline Map · 17 Features · 7 Pipeline Stages · March 2026</div>
  </div>

</div>
` }} />
    </>
  );
}
