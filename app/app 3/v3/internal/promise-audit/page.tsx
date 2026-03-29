'use client';

import { useEffect } from 'react';

export default function V3InternalPromiseAuditPage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Manrope', sans-serif;
    background: #0a0e1a;
    color: #e0e0e0;
    line-height: 1.7;
    padding: 0;
  }

  /* ── Header ── */
  .audit-header {
    background: linear-gradient(135deg, #0f1629 0%, #1a1040 50%, #0f1629 100%);
    border-bottom: 1px solid rgba(91,156,245,0.15);
    padding: 48px 32px 40px;
    text-align: center;
  }
  .audit-header h1 {
    font-size: 36px;
    font-weight: 800;
    background: linear-gradient(135deg, #5b9cf5, #a78bfa, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }
  .audit-header .subtitle {
    font-size: 15px;
    color: rgba(255,255,255,0.45);
  }
  .audit-header .date-badge {
    display: inline-block;
    margin-top: 14px;
    padding: 5px 14px;
    border-radius: 20px;
    background: rgba(91,156,245,0.1);
    border: 1px solid rgba(91,156,245,0.2);
    font-size: 12px;
    color: #5b9cf5;
    font-weight: 600;
  }

  /* ── Scorecard ── */
  .scorecard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    max-width: 1100px;
    margin: -28px auto 32px;
    padding: 0 24px;
    position: relative;
    z-index: 2;
  }
  .score-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 20px;
    text-align: center;
  }
  .score-card .num {
    font-size: 32px;
    font-weight: 800;
  }
  .score-card .lbl {
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 4px;
  }
  .green { color: #34d399; }
  .yellow { color: #fbbf24; }
  .orange { color: #fb923c; }
  .red { color: #f87171; }
  .blue { color: #5b9cf5; }

  /* ── Content ── */
  .content { max-width: 1100px; margin: 0 auto; padding: 0 24px 60px; }

  /* ── Legend ── */
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 32px;
    padding: 16px 20px;
    border-radius: 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
  }
  .legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; }
  .legend-dot {
    width: 10px; height: 10px; border-radius: 50%;
  }

  /* ── Feature Rows ── */
  .feature-section {
    margin-bottom: 28px;
  }
  .feature-section h2 {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .feature-row {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 12px;
    transition: border-color 0.2s;
  }
  .feature-row:hover { border-color: rgba(91,156,245,0.25); }

  .fr-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
  }
  .fr-name {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
  }
  .fr-badges { display: flex; gap: 8px; flex-wrap: wrap; }
  .badge {
    padding: 3px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .badge-tier {
    background: rgba(167,139,250,0.12);
    color: #a78bfa;
  }
  .badge-live {
    background: rgba(52,211,153,0.12);
    color: #34d399;
  }
  .badge-partial {
    background: rgba(251,191,36,0.12);
    color: #fbbf24;
  }
  .badge-shell {
    background: rgba(251,146,60,0.12);
    color: #fb923c;
  }
  .badge-missing {
    background: rgba(248,113,113,0.12);
    color: #f87171;
  }
  .badge-gated {
    background: rgba(91,156,245,0.1);
    color: #5b9cf5;
  }

  /* Status bar */
  .status-bar {
    height: 6px;
    border-radius: 3px;
    background: rgba(255,255,255,0.05);
    margin-bottom: 12px;
    overflow: hidden;
  }
  .status-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s ease;
  }

  .fr-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media (max-width: 700px) {
    .fr-details { grid-template-columns: 1fr; }
  }
  .detail-box {
    padding: 14px 16px;
    border-radius: 10px;
    font-size: 13px;
  }
  .detail-promised {
    background: rgba(91,156,245,0.04);
    border: 1px solid rgba(91,156,245,0.1);
  }
  .detail-reality {
    background: rgba(52,211,153,0.04);
    border: 1px solid rgba(52,211,153,0.1);
  }
  .detail-box h4 {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.35);
    margin-bottom: 6px;
  }
  .detail-box ul {
    list-style: none;
    padding: 0;
  }
  .detail-box li {
    padding: 3px 0;
    padding-left: 18px;
    position: relative;
    color: rgba(255,255,255,0.7);
  }
  .detail-box li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    width: 8px; height: 8px;
    border-radius: 50%;
  }
  .detail-promised li::before { background: #5b9cf5; }
  .detail-reality li::before { background: #34d399; }
  .detail-reality li.gap::before { background: #f87171; }
  .detail-reality li.partial::before { background: #fbbf24; }

  .fr-verdict {
    margin-top: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
  }
  .verdict-green { background: rgba(52,211,153,0.06); border-left: 3px solid #34d399; }
  .verdict-yellow { background: rgba(251,191,36,0.06); border-left: 3px solid #fbbf24; }
  .verdict-orange { background: rgba(251,146,60,0.06); border-left: 3px solid #fb923c; }
  .verdict-red { background: rgba(248,113,113,0.06); border-left: 3px solid #f87171; }

  /* ── Summary Section ── */
  .summary-section {
    margin-top: 40px;
    padding: 32px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(91,156,245,0.04), rgba(167,139,250,0.04));
    border: 1px solid rgba(91,156,245,0.12);
  }
  .summary-section h2 {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 18px;
  }
  .risk-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }
  .risk-card {
    padding: 18px 20px;
    border-radius: 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
  }
  .risk-card h4 {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .risk-card p {
    font-size: 13px;
    color: rgba(255,255,255,0.55);
  }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `

<div class="audit-header">
  <h1>FinanceOS — Promise vs Reality Audit</h1>
  <p class="subtitle">Honest assessment of every feature promised in the pipeline map against what exists in the codebase</p>
  <span class="date-badge">Audit Date: March 27, 2026</span>
</div>

<!-- ── Scorecard ── -->
<div class="scorecard">
  <div class="score-card">
    <div class="num green">10</div>
    <div class="lbl">Fully Built (Demo)</div>
  </div>
  <div class="score-card">
    <div class="num yellow">3</div>
    <div class="lbl">Partial / Shell</div>
  </div>
  <div class="score-card">
    <div class="num red">3</div>
    <div class="lbl">Not Built</div>
  </div>
  <div class="score-card">
    <div class="num blue">1</div>
    <div class="lbl">Live API</div>
  </div>
  <div class="score-card">
    <div class="num" style="color:#a78bfa;">17</div>
    <div class="lbl">Total Features Promised</div>
  </div>
</div>

<div class="content">

  <!-- Legend -->
  <div class="legend">
    <div class="legend-item"><div class="legend-dot" style="background:#34d399;"></div> Fully Built (demo data)</div>
    <div class="legend-item"><div class="legend-dot" style="background:#5b9cf5;"></div> Live API Connected</div>
    <div class="legend-item"><div class="legend-dot" style="background:#fbbf24;"></div> Partial / Needs Work</div>
    <div class="legend-item"><div class="legend-dot" style="background:#fb923c;"></div> Shell Only</div>
    <div class="legend-item"><div class="legend-dot" style="background:#f87171;"></div> Not Built</div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- STAGE 1: Core Financial Views -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="feature-section">
    <h2>Stage 1 — Core Financial Views (Starter Tier — $499/mo)</h2>

    <!-- Dashboard Overview -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Dashboard Overview</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Free+</span>
          <span class="badge badge-live">Fully Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:95%; background: linear-gradient(90deg,#34d399,#5b9cf5);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Revenue, expenses, net income KPI tiles</li>
            <li>Monthly trend charts</li>
            <li>Cash flow summary</li>
            <li>Quick-action cards</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>All KPI tiles with animated counters (demo data)</li>
            <li>Recharts area/bar charts for monthly trends</li>
            <li>Cash flow card present</li>
            <li>Quick actions + recent activity feed</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> Delivered. Full view with polished UI, animations, and responsive layout. Running on demo data — needs live connector integration to populate with real numbers.
      </div>
    </div>

    <!-- P&L -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">P&L Statement</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Starter</span>
          <span class="badge badge-live">Fully Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:90%; background: linear-gradient(90deg,#34d399,#5b9cf5);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Full P&L breakdown (revenue → COGS → gross profit → opex → net)</li>
            <li>Period-over-period comparison</li>
            <li>Drill-down by category</li>
            <li>Export capability</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>Complete P&L table with expandable rows</li>
            <li>Month-over-month comparison columns</li>
            <li>Category breakdown with variance indicators</li>
            <li class="partial">Export button exists — outputs demo data only</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> Delivered. The view is comprehensive with proper accounting hierarchy. Demo data is realistic and structured correctly for when live data connects.
      </div>
    </div>

    <!-- Basic KPIs -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Basic KPIs</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Starter</span>
          <span class="badge badge-live">Fully Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:90%; background: linear-gradient(90deg,#34d399,#5b9cf5);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Burn rate, runway, MRR, ARR</li>
            <li>Gross margin, net margin</li>
            <li>Revenue growth rate</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>KPI tiles on Dashboard view with all listed metrics</li>
            <li>Animated counters and trend arrows</li>
            <li>Charts in both Dashboard and Investor views</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> Delivered. KPIs are well-displayed across Dashboard and Investor views. Metrics match what's advertised.
      </div>
    </div>

    <!-- Integrations -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Integrations Hub</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Starter</span>
          <span class="badge badge-partial">Partial</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:60%; background: linear-gradient(90deg,#fbbf24,#fb923c);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>QuickBooks, Xero, Stripe connectors</li>
            <li>Plaid bank feeds</li>
            <li>One-click data sync</li>
            <li>Connector health monitoring</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>QuickBooks OAuth flow is LIVE (real API)</li>
            <li class="gap">Xero, Plaid — cards displayed but no live OAuth</li>
            <li class="gap">Stripe connector card present — not wired to real data</li>
            <li class="partial">Health badges shown — static status, no real monitoring</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-yellow">
        <strong>Verdict:</strong> Partially delivered. QuickBooks is the only live integration. Other connectors have UI cards but clicking "Connect" doesn't do anything real. Need to build out Xero OAuth, Plaid Link, and Stripe data pull.
      </div>
    </div>

    <!-- Email Support -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Email Support</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Starter</span>
          <span class="badge badge-live">Delivered</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:100%; background:#34d399;"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul><li>Email-based customer support for Starter+</li></ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul><li>Operational process — not a code feature. Fully deliverable as-is.</li></ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> This is an operational commitment, not a software feature. Deliverable immediately with any helpdesk tool.
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- STAGE 2: Intelligence & Prediction (Growth) -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="feature-section">
    <h2>Stage 2 — Intelligence & Prediction (Growth Tier — $999/mo)</h2>

    <!-- Forecast -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Forecast Engine</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Growth</span>
          <span class="badge badge-live">Fully Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:85%; background: linear-gradient(90deg,#34d399,#5b9cf5);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>12-month revenue & expense forecast</li>
            <li>AI-assisted projections</li>
            <li>Confidence intervals</li>
            <li>Assumption controls</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>Full forecast view with 12-month projections</li>
            <li>Recharts visualization with shaded confidence bands</li>
            <li>Assumption sliders (growth rate, churn, COGS %)</li>
            <li class="partial">Projections are formula-based, not ML — labeled "AI-assisted"</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> Delivered. Strong UI with interactive controls. The "AI" label is a stretch — it's deterministic formula projections, not machine learning. Consider renaming to "Smart Projections" for honesty, or wiring to Claude API for actual AI analysis.
      </div>
    </div>

    <!-- Scenarios -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Scenario Modeling</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Growth</span>
          <span class="badge badge-live">Fully Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:85%; background: linear-gradient(90deg,#34d399,#5b9cf5);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Best / Base / Worst case modeling</li>
            <li>Side-by-side scenario comparison</li>
            <li>Adjustable assumptions per scenario</li>
            <li>Impact on runway and profitability</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>Three scenario columns with distinct assumptions</li>
            <li>Comparison grid with delta indicators</li>
            <li>Sliders for revenue growth, burn, headcount</li>
            <li>Runway impact calculated per scenario</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> Delivered. Well-structured three-scenario comparison. Demo data only, but the framework is correct and usable once live data flows in.
      </div>
    </div>

    <!-- AI Copilot -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">AI Copilot</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Growth</span>
          <span class="badge badge-live" style="background:rgba(91,156,245,0.15); color:#5b9cf5;">Live API</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:92%; background: linear-gradient(90deg,#5b9cf5,#a78bfa);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Natural language financial Q&A</li>
            <li>Context-aware analysis of company data</li>
            <li>Actionable recommendations</li>
            <li>Chat interface with conversation history</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>Chat UI connected to Claude API (LIVE)</li>
            <li>Financial system prompt with company context</li>
            <li>Conversation history within session</li>
            <li class="partial">Analyzes demo context, not real company data yet</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> This is the strongest feature. Live Claude API integration, real AI responses, well-designed chat UI. The only gap is that it analyzes the demo financial context rather than the user's actual data — once integrations feed real data, this becomes extremely powerful.
      </div>
    </div>

    <!-- Multi-Entity -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Multi-Entity Consolidation</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Growth</span>
          <span class="badge badge-live">Fully Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:80%; background: linear-gradient(90deg,#34d399,#5b9cf5);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Multiple legal entities in one view</li>
            <li>Intercompany elimination</li>
            <li>Consolidated reporting</li>
            <li>Entity-level drill-down</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>ConsolidationView with entity selector tabs</li>
            <li>Consolidated P&L across entities</li>
            <li class="partial">Intercompany elimination shown as line item — not a real engine</li>
            <li>Entity cards with individual KPIs</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-yellow">
        <strong>Verdict:</strong> UI is solid. The "intercompany elimination" is a static line item, not actual elimination logic. When live data arrives, you'll need real elimination rules. For demo purposes, this passes.
      </div>
    </div>

    <!-- Slack Integration -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Slack Integration</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Growth</span>
          <span class="badge badge-shell">Shell Only</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:25%; background: linear-gradient(90deg,#fb923c,#f87171);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Slack workspace connection</li>
            <li>Financial alerts to channels</li>
            <li>AI Copilot responses in Slack</li>
            <li>Weekly summary notifications</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li class="partial">A card in IntegrationsView with Slack branding</li>
            <li class="gap">No OAuth flow — button does nothing</li>
            <li class="gap">No Slack Bot or webhook implementation</li>
            <li class="gap">No notification system</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-orange">
        <strong>Verdict:</strong> Not delivered. Only a UI card exists. This needs a Slack App with OAuth, a webhook endpoint, and a notification worker. Significant development required.
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- STAGE 3: Business Tier ($2,499/mo) -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="feature-section">
    <h2>Stage 3 — Enterprise Operations (Business Tier — $2,499/mo)</h2>

    <!-- Command Center -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Command Center</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Business</span>
          <span class="badge badge-live">Fully Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:88%; background: linear-gradient(90deg,#34d399,#a78bfa);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>CEO/CFO/Controller role-based dashboards</li>
            <li>Pipeline, deal, and velocity metrics</li>
            <li>Cash flow and working capital analysis</li>
            <li>Month-end close checklist</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>3 role tabs: CEO, CFO, Controller</li>
            <li>CEO tab: pipeline coverage, win rate, deal size, velocity</li>
            <li>CFO tab: cash flow, D/E ratio, working capital, EBITDA margin</li>
            <li>Controller tab: 6-item close checklist with progress</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> Delivered. Impressive three-role layout with relevant metrics per persona. Demo data, but the UX is premium-grade and differentiating.
      </div>
    </div>

    <!-- Close Tasks -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Close Task Manager</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Business</span>
          <span class="badge badge-live">Fully Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:85%; background: linear-gradient(90deg,#34d399,#5b9cf5);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Month-end close task tracking</li>
            <li>Assignee management</li>
            <li>Status tracking and deadlines</li>
            <li>Close progress dashboard</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>CloseView with categorized task lists</li>
            <li>Assignee avatars and due dates</li>
            <li>Checkbox completion with progress bar</li>
            <li>Overall close progress percentage</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> Delivered. Clean month-end close workflow. Stateful within session — tasks reset on reload since there's no persistence layer yet.
      </div>
    </div>

    <!-- Investor Metrics -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Investor Metrics</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Business</span>
          <span class="badge badge-live">Fully Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:85%; background: linear-gradient(90deg,#34d399,#5b9cf5);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Investor-ready KPI dashboard</li>
            <li>Board deck metrics (CAC, LTV, NRR, etc.)</li>
            <li>Fundraising runway projections</li>
            <li>Export for board presentations</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>InvestorView with SaaS metrics grid</li>
            <li>CAC, LTV, NRR, Quick Ratio, Rule of 40</li>
            <li>Runway countdown with burn rate</li>
            <li class="partial">No export/PDF generation for board decks</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> Delivered. Strong SaaS metrics view. The missing board deck export is a nice-to-have, not a dealbreaker.
      </div>
    </div>

    <!-- Team Management -->
    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Team Management</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Business</span>
          <span class="badge badge-live">Fully Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:80%; background: linear-gradient(90deg,#34d399,#5b9cf5);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>User invitations and role management</li>
            <li>Seat tracking against plan limits</li>
            <li>Activity log</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li>TeamView with member cards and role badges</li>
            <li>Invite form with role selector</li>
            <li class="partial">No real invitation emails — UI only</li>
            <li class="partial">No Supabase RBAC enforcement</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-yellow">
        <strong>Verdict:</strong> UI exists but it's cosmetic. Real team management requires Supabase auth integration for invites, role-based access control, and seat enforcement. The view looks good for demos.
      </div>
    </div>

    <!-- SOX Audit ❌ -->
    <div class="feature-row" style="border-color: rgba(248,113,113,0.2);">
      <div class="fr-top">
        <span class="fr-name">SOX Audit Trails</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Business</span>
          <span class="badge badge-missing">Not Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:5%; background:#f87171;"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Full audit trail logging</li>
            <li>Change tracking on all financial data</li>
            <li>User action history</li>
            <li>SOX compliance reporting</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li class="gap">No dedicated SOX Audit view</li>
            <li class="gap">No audit logging middleware</li>
            <li class="gap">No change tracking system</li>
            <li class="partial">Controller tab in Command Center has a "Review audit trail" checklist item — text only</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-red">
        <strong>Verdict: NOT BUILT.</strong> This is a feature key (sox_audit) in the plan matrix with no corresponding view or backend. The only reference is a static checklist label. For a $2,499/mo Business tier promising SOX compliance, this is a critical gap. Needs a dedicated view + audit logging middleware + Supabase event table.
      </div>
    </div>

    <!-- SSO ❌ -->
    <div class="feature-row" style="border-color: rgba(248,113,113,0.2);">
      <div class="fr-top">
        <span class="fr-name">SSO / SAML</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Business</span>
          <span class="badge badge-missing">Not Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:0%; background:#f87171;"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>SAML 2.0 SSO integration</li>
            <li>Okta / Azure AD / Google Workspace support</li>
            <li>Auto-provisioning (SCIM)</li>
            <li>SSO enforcement toggle</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li class="gap">No SSO view in the dashboard</li>
            <li class="gap">No SAML configuration anywhere</li>
            <li class="gap">No identity provider integration</li>
            <li class="gap">Feature key exists in plan matrix but nothing else</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-red">
        <strong>Verdict: NOT BUILT.</strong> Zero implementation. The feature key "sso" is in PLAN_FEATURES but there's no view, no settings panel, no SAML handler, no IdP configuration. This is table-stakes for enterprise buyers at the $2,499/mo tier and must be built. Supabase supports SAML — the plumbing is available.
      </div>
    </div>

    <!-- Custom ML ❌ -->
    <div class="feature-row" style="border-color: rgba(248,113,113,0.2);">
      <div class="fr-top">
        <span class="fr-name">Custom ML Models</span>
        <div class="fr-badges">
          <span class="badge badge-tier">Business</span>
          <span class="badge badge-missing">Not Built</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:0%; background:#f87171;"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>What We Promised</h4>
          <ul>
            <li>Custom ML model training on company data</li>
            <li>Anomaly detection on financials</li>
            <li>Revenue prediction models</li>
            <li>Model performance dashboard</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>What Actually Exists</h4>
          <ul>
            <li class="gap">No ML model view</li>
            <li class="gap">No model training pipeline</li>
            <li class="gap">No anomaly detection system</li>
            <li class="gap">Feature key "custom_ml" exists but nothing is built</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-red">
        <strong>Verdict: NOT BUILT.</strong> Entirely absent. This is the most ambitious promise in the platform and has zero implementation. Options: (1) Build a Claude-powered analysis layer and brand it as "Custom ML", (2) Integrate a real ML pipeline, or (3) Reclassify this as a roadmap item and remove from current tier promises.
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- CROSS-CUTTING: Plan Gating System -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="feature-section">
    <h2>Cross-Cutting: Plan Gating Infrastructure</h2>

    <div class="feature-row">
      <div class="fr-top">
        <span class="fr-name">Stripe Checkpoint System</span>
        <div class="fr-badges">
          <span class="badge badge-live" style="background:rgba(91,156,245,0.15); color:#5b9cf5;">Live</span>
        </div>
      </div>
      <div class="status-bar"><div class="status-fill" style="width:95%; background: linear-gradient(90deg,#5b9cf5,#a78bfa);"></div></div>
      <div class="fr-details">
        <div class="detail-box detail-promised">
          <h4>Architecture</h4>
          <ul>
            <li>GET /api/plan — Stripe customer lookup on every load</li>
            <li>PlanProvider context wraps entire dashboard</li>
            <li>FeatureGate component blocks access to locked features</li>
            <li>UpgradePrompt with tier-specific CTA</li>
          </ul>
        </div>
        <div class="detail-box detail-reality">
          <h4>Status</h4>
          <ul>
            <li>Fully implemented and production-ready</li>
            <li>3 Stripe Product IDs mapped to tiers</li>
            <li>No caching — always fresh from Stripe</li>
            <li>Graceful fallback to Free on any error</li>
          </ul>
        </div>
      </div>
      <div class="fr-verdict verdict-green">
        <strong>Verdict:</strong> The gating infrastructure is excellent. Stripe checkpoint, PlanProvider, FeatureGate, UpgradePrompt, SidebarLockBadge — all working correctly. This is the strongest part of the monetization layer.
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- EXECUTIVE SUMMARY -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="summary-section">
    <h2>Executive Summary & Risk Assessment</h2>
    <p style="color: rgba(255,255,255,0.6); margin-bottom: 20px; font-size: 14px;">
      Of the 17 feature keys promised across 4 tiers, <strong style="color:#34d399;">10 are fully built</strong> (with demo data),
      <strong style="color:#fbbf24;">3 are partial</strong> (UI exists but missing real backend), and
      <strong style="color:#f87171;">3 are completely absent</strong> (SOX Audit, SSO, Custom ML).
      The AI Copilot is the only feature running on a live API.
    </p>

    <div class="risk-grid">
      <div class="risk-card" style="border-left: 3px solid #f87171;">
        <h4 class="red">Critical: 3 Missing Business-Tier Features</h4>
        <p>SOX Audit, SSO, and Custom ML are promised at $2,499/mo but have zero code. A paying Business customer would find empty UpgradePrompt screens for features they're paying for. This is the #1 priority to resolve — either build views or remove from the tier.</p>
      </div>
      <div class="risk-card" style="border-left: 3px solid #fbbf24;">
        <h4 class="yellow">High: Demo Data Dependency</h4>
        <p>All 10 "fully built" views run on hardcoded demo data. The platform is a working demo, not a working product. The integration connectors (beyond QuickBooks) need to be built to make any view useful with real numbers.</p>
      </div>
      <div class="risk-card" style="border-left: 3px solid #fb923c;">
        <h4 class="orange">Medium: Slack Integration Gap</h4>
        <p>Slack is listed as a Growth-tier feature but only has a UI card. No OAuth, no bot, no webhooks. Growth customers expecting Slack alerts will be disappointed.</p>
      </div>
      <div class="risk-card" style="border-left: 3px solid #5b9cf5;">
        <h4 class="blue">Low: "AI" Labeling Accuracy</h4>
        <p>The Forecast Engine is labeled "AI-assisted" but uses deterministic formulas. This isn't a legal risk but could erode trust with technical buyers. The AI Copilot is genuinely AI-powered — leverage that distinction.</p>
      </div>
    </div>

    <div style="margin-top: 28px; padding: 20px; border-radius: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);">
      <h4 style="color: #a78bfa; margin-bottom: 8px; font-size: 14px;">Recommended Priority Order</h4>
      <p style="font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.8;">
        <strong style="color:#f87171;">P0:</strong> Build SOX Audit, SSO, and Custom ML views (even as well-designed shells) — these are paid-tier promises with nothing behind them.<br>
        <strong style="color:#fb923c;">P1:</strong> Complete Slack OAuth + webhook infrastructure for Growth tier credibility.<br>
        <strong style="color:#fbbf24;">P2:</strong> Wire additional integration connectors (Xero, Plaid, Stripe data) to move beyond demo data.<br>
        <strong style="color:#5b9cf5;">P3:</strong> Add persistence layer for Close Tasks, Team invites, and Copilot history (Supabase tables).<br>
        <strong style="color:#34d399;">P4:</strong> Board deck PDF export for Investor Metrics view.
      </p>
    </div>
  </div>

</div>
` }} />
    </>
  );
}
