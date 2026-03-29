'use client';

import { useEffect } from 'react';

export default function V3TemplatesCompetitivePricingPage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Manrope', sans-serif; background: #0a0e1a; color: #e0e0e0; line-height: 1.7; }

  .hero {
    background: linear-gradient(135deg, #0f1629, #1a1040, #0f1629);
    border-bottom: 1px solid rgba(91,156,245,0.15);
    padding: 52px 32px 44px;
    text-align: center;
  }
  .hero h1 {
    font-size: 36px; font-weight: 800;
    background: linear-gradient(135deg, #5b9cf5, #a78bfa, #f472b6);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }
  .hero p { font-size: 14px; color: rgba(255,255,255,0.4); max-width: 640px; margin: 0 auto; }
  .hero .date { display: inline-block; margin-top: 14px; padding: 5px 14px; border-radius: 20px; background: rgba(91,156,245,0.1); border: 1px solid rgba(91,156,245,0.2); font-size: 12px; color: #5b9cf5; font-weight: 600; }

  .content { max-width: 1200px; margin: 0 auto; padding: 40px 24px 60px; }

  /* ── Summary bar ── */
  .summary-bar {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px; margin-bottom: 36px;
  }
  .sb-card {
    padding: 20px; border-radius: 14px; background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06); text-align: center;
  }
  .sb-card .sb-val { font-size: 24px; font-weight: 800; font-family: "'JetBrains Mono', monospace"; }
  .sb-card .sb-lbl { font-size: 10px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }

  /* ── Section headers ── */
  .section-header {
    font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px;
  }
  .section-sub {
    font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 20px;
  }

  /* ── Competitor table ── */
  .comp-table-wrap {
    overflow-x: auto; margin-bottom: 40px; border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .comp-table {
    width: 100%; border-collapse: collapse; min-width: 900px;
  }
  .comp-table thead th {
    padding: 14px 16px; text-align: left; font-size: 10px; font-weight: 700;
    color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em;
    border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);
  }
  .comp-table tbody td {
    padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 13px; color: rgba(255,255,255,0.7); vertical-align: top;
  }
  .comp-table tbody tr:hover { background: rgba(91,156,245,0.03); }
  .comp-name { font-weight: 700; color: #fff; font-size: 14px; }
  .comp-segment {
    display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 10px;
    font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 4px;
  }
  .seg-smb { background: rgba(52,211,153,0.12); color: #34d399; }
  .seg-mid { background: rgba(91,156,245,0.12); color: #5b9cf5; }
  .seg-ent { background: rgba(167,139,250,0.12); color: #a78bfa; }

  .price-cell { font-family: "'JetBrains Mono', monospace"; font-weight: 700; color: #fff; font-size: 14px; }
  .price-note { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 2px; }

  .feat-dots { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
  .feat-dot {
    padding: 2px 8px; border-radius: 6px; font-size: 9px; font-weight: 600;
    background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.5);
  }
  .feat-dot.yes { background: rgba(52,211,153,0.1); color: #34d399; }
  .feat-dot.no { background: rgba(248,113,113,0.08); color: rgba(248,113,113,0.5); }

  /* ── Highlight row for FinanceOS ── */
  .fos-row { background: rgba(91,156,245,0.04) !important; }
  .fos-row td { border-bottom: 1px solid rgba(91,156,245,0.12) !important; }

  /* ── Pricing position chart ── */
  .chart-section { margin-bottom: 40px; }
  .price-spectrum {
    position: relative; height: 80px; border-radius: 12px;
    background: linear-gradient(90deg, rgba(52,211,153,0.08), rgba(91,156,245,0.08), rgba(167,139,250,0.08), rgba(248,113,113,0.08));
    border: 1px solid rgba(255,255,255,0.06); margin-top: 12px; margin-bottom: 30px;
  }
  .spectrum-labels {
    display: flex; justify-content: space-between; padding: 0 8px;
    font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 4px;
  }
  .spectrum-dot {
    position: absolute; top: 50%; transform: translate(-50%, -50%);
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .spectrum-dot .dot {
    width: 14px; height: 14px; border-radius: 50%; border: 2px solid #0a0e1a;
  }
  .spectrum-dot .dot-label {
    font-size: 9px; font-weight: 700; white-space: nowrap;
    padding: 2px 6px; border-radius: 4px; background: rgba(0,0,0,0.5);
  }

  /* ── Insight cards ── */
  .insight-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px; margin-bottom: 40px;
  }
  .insight-card {
    padding: 22px; border-radius: 14px; background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
  }
  .insight-card h4 { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
  .insight-card p { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.7; }

  /* ── Recommendation section ── */
  .rec-section {
    padding: 32px; border-radius: 16px;
    background: linear-gradient(135deg, rgba(52,211,153,0.04), rgba(91,156,245,0.04));
    border: 1px solid rgba(52,211,153,0.12); margin-bottom: 40px;
  }
  .rec-section h2 { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 18px; }

  .rec-tiers {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }
  .rec-tier {
    padding: 24px; border-radius: 14px; background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06); text-align: center;
  }
  .rec-tier .tier-name {
    font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
    margin-bottom: 6px;
  }
  .rec-tier .current { font-size: 28px; font-weight: 800; color: rgba(255,255,255,0.3); text-decoration: line-through; }
  .rec-tier .future { font-size: 32px; font-weight: 800; margin-top: 4px; }
  .rec-tier .future span { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.4); }
  .rec-tier .trigger { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); }

  /* ── Footer note ── */
  .footer-note {
    padding: 20px 24px; border-radius: 12px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
    font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.7;
  }
  .footer-note strong { color: rgba(255,255,255,0.6); }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `

<div class="hero">
  <h1>Competitive Market Pricing Analysis</h1>
  <p>Where FinanceOS sits in the FP&A software market — competitor pricing, positioning gaps, and when to reprice</p>
  <span class="date">Analysis Date: March 27, 2026</span>
</div>

<div class="content">

  <!-- Summary bar -->
  <div class="summary-bar">
    <div class="sb-card">
      <div class="sb-val" style="color:#34d399;">$250-$500</div>
      <div class="sb-lbl">SMB Entry (Monthly)</div>
    </div>
    <div class="sb-card">
      <div class="sb-val" style="color:#5b9cf5;">$1,400-$2,000</div>
      <div class="sb-lbl">Mid-Market (Monthly)</div>
    </div>
    <div class="sb-card">
      <div class="sb-val" style="color:#a78bfa;">$5,000-$8,300+</div>
      <div class="sb-lbl">Enterprise (Monthly)</div>
    </div>
    <div class="sb-card">
      <div class="sb-val" style="color:#f472b6;">$499-$2,499</div>
      <div class="sb-lbl">FinanceOS Current Range</div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- Competitor Comparison Table -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="section-header">Head-to-Head Competitor Pricing</div>
  <div class="section-sub">Verified pricing from vendor websites, G2, Capterra, and Vendr as of March 2026. "Custom" = contact sales only.</div>

  <div class="comp-table-wrap">
    <table class="comp-table">
      <thead>
        <tr>
          <th style="width:160px;">Platform</th>
          <th style="width:130px;">Entry Price</th>
          <th style="width:130px;">Mid Tier</th>
          <th style="width:130px;">Top Tier</th>
          <th>Key Features</th>
          <th style="width:100px;">AI?</th>
        </tr>
      </thead>
      <tbody>
        <!-- FinanceOS (highlighted) -->
        <tr class="fos-row">
          <td>
            <div class="comp-name" style="color:#5b9cf5;">FinanceOS</div>
            <span class="comp-segment seg-smb">SMB-Mid</span>
          </td>
          <td>
            <div class="price-cell" style="color:#5b9cf5;">$499/mo</div>
            <div class="price-note">Starter (5 seats)</div>
          </td>
          <td>
            <div class="price-cell" style="color:#5b9cf5;">$999/mo</div>
            <div class="price-note">Growth (15 seats)</div>
          </td>
          <td>
            <div class="price-cell" style="color:#5b9cf5;">$2,499/mo</div>
            <div class="price-note">Business (Unlimited)</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">P&L</span>
              <span class="feat-dot yes">Forecast</span>
              <span class="feat-dot yes">Scenarios</span>
              <span class="feat-dot yes">AI Copilot</span>
              <span class="feat-dot yes">Consolidation</span>
              <span class="feat-dot yes">SOX Audit</span>
              <span class="feat-dot yes">SSO</span>
              <span class="feat-dot yes">ML Models</span>
            </div>
          </td>
          <td><span class="feat-dot yes">Claude API</span></td>
        </tr>

        <!-- Budgyt -->
        <tr>
          <td>
            <div class="comp-name">Budgyt</div>
            <span class="comp-segment seg-smb">SMB</span>
          </td>
          <td>
            <div class="price-cell">$250/mo</div>
            <div class="price-note">Starter</div>
          </td>
          <td>
            <div class="price-cell">~$500/mo</div>
            <div class="price-note">Estimated mid-tier</div>
          </td>
          <td>
            <div class="price-cell">Custom</div>
            <div class="price-note">Enterprise</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">Budgeting</span>
              <span class="feat-dot yes">Forecasting</span>
              <span class="feat-dot no">No P&L</span>
              <span class="feat-dot no">No Scenarios</span>
            </div>
          </td>
          <td><span class="feat-dot no">None</span></td>
        </tr>

        <!-- Causal -->
        <tr>
          <td>
            <div class="comp-name">Causal</div>
            <span class="comp-segment seg-smb">SMB</span>
          </td>
          <td>
            <div class="price-cell">$250/mo</div>
            <div class="price-note">Starter</div>
          </td>
          <td>
            <div class="price-cell">~$800/mo</div>
            <div class="price-note">Team</div>
          </td>
          <td>
            <div class="price-cell">Custom</div>
            <div class="price-note">Enterprise</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">Modeling</span>
              <span class="feat-dot yes">Scenarios</span>
              <span class="feat-dot yes">Dashboards</span>
              <span class="feat-dot no">No Consolidation</span>
            </div>
          </td>
          <td><span class="feat-dot no">None</span></td>
        </tr>

        <!-- Jirav -->
        <tr>
          <td>
            <div class="comp-name">Jirav</div>
            <span class="comp-segment seg-mid">Mid-Market</span>
          </td>
          <td>
            <div class="price-cell">$1,667/mo</div>
            <div class="price-note">Annual billing</div>
          </td>
          <td>
            <div class="price-cell">~$2,500/mo</div>
            <div class="price-note">Estimated</div>
          </td>
          <td>
            <div class="price-cell">Custom</div>
            <div class="price-note">Enterprise</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">Budgeting</span>
              <span class="feat-dot yes">Forecasting</span>
              <span class="feat-dot yes">P&L</span>
              <span class="feat-dot yes">Scenarios</span>
              <span class="feat-dot yes">Consolidation</span>
            </div>
          </td>
          <td><span class="feat-dot no">Basic</span></td>
        </tr>

        <!-- Cube -->
        <tr>
          <td>
            <div class="comp-name">Cube</div>
            <span class="comp-segment seg-mid">Mid-Market</span>
          </td>
          <td>
            <div class="price-cell">$1,250/mo</div>
            <div class="price-note">Essentials</div>
          </td>
          <td>
            <div class="price-cell">$2,800/mo</div>
            <div class="price-note">Pro</div>
          </td>
          <td>
            <div class="price-cell">Custom</div>
            <div class="price-note">Enterprise</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">P&L</span>
              <span class="feat-dot yes">Forecasting</span>
              <span class="feat-dot yes">Scenarios</span>
              <span class="feat-dot yes">Consolidation</span>
              <span class="feat-dot yes">Board Reports</span>
            </div>
          </td>
          <td><span class="feat-dot yes">AI Analyst</span></td>
        </tr>

        <!-- Limelight -->
        <tr>
          <td>
            <div class="comp-name">Limelight</div>
            <span class="comp-segment seg-mid">Mid-Market</span>
          </td>
          <td>
            <div class="price-cell">$1,400/mo</div>
            <div class="price-note">Base</div>
          </td>
          <td>
            <div class="price-cell">~$2,500/mo</div>
            <div class="price-note">Estimated</div>
          </td>
          <td>
            <div class="price-cell">Custom</div>
            <div class="price-note">Enterprise</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">Budgeting</span>
              <span class="feat-dot yes">Forecasting</span>
              <span class="feat-dot yes">P&L</span>
              <span class="feat-dot yes">Consolidation</span>
            </div>
          </td>
          <td><span class="feat-dot no">None</span></td>
        </tr>

        <!-- Datarails -->
        <tr>
          <td>
            <div class="comp-name">Datarails</div>
            <span class="comp-segment seg-mid">Mid-Market</span>
          </td>
          <td>
            <div class="price-cell">$2,000/mo</div>
            <div class="price-note">Flex (single user)</div>
          </td>
          <td>
            <div class="price-cell">$3,500/mo</div>
            <div class="price-note">Team (10 users)</div>
          </td>
          <td>
            <div class="price-cell">Custom</div>
            <div class="price-note">Enterprise</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">Excel Add-In</span>
              <span class="feat-dot yes">Consolidation</span>
              <span class="feat-dot yes">Reporting</span>
              <span class="feat-dot yes">Data Viz</span>
            </div>
          </td>
          <td><span class="feat-dot yes">Datarails AI</span></td>
        </tr>

        <!-- Mosaic -->
        <tr>
          <td>
            <div class="comp-name">Mosaic (HiBob)</div>
            <span class="comp-segment seg-mid">Mid-Market</span>
          </td>
          <td colspan="3" style="text-align:center;">
            <div class="price-cell">Custom Pricing Only</div>
            <div class="price-note">Acquired by HiBob Feb 2025 — pricing restructured</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">Real-time</span>
              <span class="feat-dot yes">SaaS Metrics</span>
              <span class="feat-dot yes">Board Decks</span>
              <span class="feat-dot yes">Integrations</span>
            </div>
          </td>
          <td><span class="feat-dot no">Basic</span></td>
        </tr>

        <!-- Runway -->
        <tr>
          <td>
            <div class="comp-name">Runway</div>
            <span class="comp-segment seg-mid">Mid-Market</span>
          </td>
          <td colspan="3" style="text-align:center;">
            <div class="price-cell">Custom Pricing Only</div>
            <div class="price-note">Raised $42.5M — focused on high-growth startups</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">Modeling</span>
              <span class="feat-dot yes">Forecasting</span>
              <span class="feat-dot yes">Collaboration</span>
              <span class="feat-dot yes">Scenarios</span>
            </div>
          </td>
          <td><span class="feat-dot yes">AI Features</span></td>
        </tr>

        <!-- Anaplan -->
        <tr>
          <td>
            <div class="comp-name">Anaplan</div>
            <span class="comp-segment seg-ent">Enterprise</span>
          </td>
          <td colspan="3" style="text-align:center;">
            <div class="price-cell">$60,000 - $100,000+/yr</div>
            <div class="price-note">$5,000-$8,300+/mo — per application module pricing</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">Full FP&A</span>
              <span class="feat-dot yes">Workforce</span>
              <span class="feat-dot yes">Supply Chain</span>
              <span class="feat-dot yes">Sales Planning</span>
            </div>
          </td>
          <td><span class="feat-dot yes">PlanIQ</span></td>
        </tr>

        <!-- Workday Adaptive -->
        <tr>
          <td>
            <div class="comp-name">Workday Adaptive</div>
            <span class="comp-segment seg-ent">Enterprise</span>
          </td>
          <td colspan="3" style="text-align:center;">
            <div class="price-cell">$60,000 - $150,000+/yr</div>
            <div class="price-note">$5,000-$12,500+/mo — implementation $10K-$50K additional</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">Full FP&A</span>
              <span class="feat-dot yes">HR Planning</span>
              <span class="feat-dot yes">Consolidation</span>
              <span class="feat-dot yes">Close Mgmt</span>
            </div>
          </td>
          <td><span class="feat-dot yes">ML Forecasting</span></td>
        </tr>

        <!-- Drivetrain -->
        <tr>
          <td>
            <div class="comp-name">Drivetrain</div>
            <span class="comp-segment seg-mid">Mid-Market</span>
          </td>
          <td colspan="3" style="text-align:center;">
            <div class="price-cell">$60,000 - $100,000+/yr</div>
            <div class="price-note">AI-native platform — custom pricing</div>
          </td>
          <td>
            <div class="feat-dots">
              <span class="feat-dot yes">3-Statement</span>
              <span class="feat-dot yes">Headcount</span>
              <span class="feat-dot yes">Cash Flow</span>
              <span class="feat-dot yes">Revenue</span>
            </div>
          </td>
          <td><span class="feat-dot yes">AI-Native</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- Price Position Spectrum -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="chart-section">
    <div class="section-header">Where FinanceOS Sits on the Spectrum</div>
    <div class="section-sub">Monthly starting price positions across the FP&A market. FinanceOS currently prices below all mid-market competitors.</div>

    <div class="price-spectrum">
      <!-- Budgyt/Causal -->
      <div class="spectrum-dot" style="left: 5%;">
        <div class="dot" style="background: #34d399;"></div>
        <div class="dot-label" style="color: #34d399; position:absolute; top:-24px;">Budgyt $250</div>
      </div>
      <!-- FinanceOS Starter -->
      <div class="spectrum-dot" style="left: 12%;">
        <div class="dot" style="background: #5b9cf5; width:18px; height:18px; box-shadow: 0 0 12px rgba(91,156,245,0.5);"></div>
        <div class="dot-label" style="color: #5b9cf5; position:absolute; top:-24px; font-size:10px;">FOS $499</div>
      </div>
      <!-- FinanceOS Growth -->
      <div class="spectrum-dot" style="left: 22%;">
        <div class="dot" style="background: #5b9cf5; width:18px; height:18px; box-shadow: 0 0 12px rgba(91,156,245,0.5);"></div>
        <div class="dot-label" style="color: #5b9cf5; position:absolute; bottom:-24px; font-size:10px;">FOS $999</div>
      </div>
      <!-- Cube -->
      <div class="spectrum-dot" style="left: 29%;">
        <div class="dot" style="background: rgba(255,255,255,0.4);"></div>
        <div class="dot-label" style="color: rgba(255,255,255,0.5); position:absolute; top:-24px;">Cube $1,250</div>
      </div>
      <!-- Limelight -->
      <div class="spectrum-dot" style="left: 33%;">
        <div class="dot" style="background: rgba(255,255,255,0.4);"></div>
        <div class="dot-label" style="color: rgba(255,255,255,0.5); position:absolute; bottom:-24px;">Limelight $1,400</div>
      </div>
      <!-- Jirav -->
      <div class="spectrum-dot" style="left: 38%;">
        <div class="dot" style="background: rgba(255,255,255,0.4);"></div>
        <div class="dot-label" style="color: rgba(255,255,255,0.5); position:absolute; top:-24px;">Jirav $1,667</div>
      </div>
      <!-- Datarails -->
      <div class="spectrum-dot" style="left: 45%;">
        <div class="dot" style="background: rgba(255,255,255,0.4);"></div>
        <div class="dot-label" style="color: rgba(255,255,255,0.5); position:absolute; bottom:-24px;">Datarails $2,000</div>
      </div>
      <!-- FinanceOS Business -->
      <div class="spectrum-dot" style="left: 53%;">
        <div class="dot" style="background: #5b9cf5; width:18px; height:18px; box-shadow: 0 0 12px rgba(91,156,245,0.5);"></div>
        <div class="dot-label" style="color: #5b9cf5; position:absolute; top:-24px; font-size:10px;">FOS $2,499</div>
      </div>
      <!-- Cube Pro -->
      <div class="spectrum-dot" style="left: 58%;">
        <div class="dot" style="background: rgba(255,255,255,0.4);"></div>
        <div class="dot-label" style="color: rgba(255,255,255,0.5); position:absolute; bottom:-24px;">Cube Pro $2,800</div>
      </div>
      <!-- Datarails Team -->
      <div class="spectrum-dot" style="left: 65%;">
        <div class="dot" style="background: rgba(255,255,255,0.4);"></div>
        <div class="dot-label" style="color: rgba(255,255,255,0.5); position:absolute; top:-24px;">Datarails $3,500</div>
      </div>
      <!-- Enterprise -->
      <div class="spectrum-dot" style="left: 85%;">
        <div class="dot" style="background: #a78bfa;"></div>
        <div class="dot-label" style="color: #a78bfa; position:absolute; bottom:-24px;">Anaplan $5K+</div>
      </div>
    </div>
    <div class="spectrum-labels">
      <span>$0</span>
      <span>$1,000</span>
      <span>$2,000</span>
      <span>$3,000</span>
      <span>$5,000+</span>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- Key Insights -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="section-header">Key Market Insights</div>
  <div class="section-sub">What the competitive landscape tells us about FinanceOS pricing.</div>

  <div class="insight-grid">
    <div class="insight-card" style="border-left: 3px solid #34d399;">
      <h4 style="color:#34d399;">FinanceOS is Significantly Underpriced</h4>
      <p>At $499/mo, FinanceOS Starter offers P&L, KPIs, Dashboard, and Integrations — the same feature set Jirav charges $1,667/mo for and Cube charges $1,250/mo for. You're giving away 2.5-3.3x more value per dollar than direct competitors. The Growth tier at $999/mo includes AI Copilot (live Claude API), multi-entity consolidation, and scenario modeling — Datarails charges $2,000/mo for less.</p>
    </div>
    <div class="insight-card" style="border-left: 3px solid #5b9cf5;">
      <h4 style="color:#5b9cf5;">AI is the Differentiator — and Nobody Prices It</h4>
      <p>FinanceOS is the only platform in this segment with a live AI Copilot powered by Claude. Datarails has "Datarails AI" and Cube has "AI Analyst" but they're bolt-ons, not integrated conversational interfaces. The AI Copilot alone could justify a $200-$400/mo premium once it's analyzing real company data. No competitor at your price point offers anything close.</p>
    </div>
    <div class="insight-card" style="border-left: 3px solid #a78bfa;">
      <h4 style="color:#a78bfa;">Enterprise Features at Mid-Market Prices</h4>
      <p>SOX Audit Trails, SSO/SAML, Custom ML Models, and Command Center are enterprise features that competitors like Anaplan and Workday charge $60,000-$100,000+/yr for. Your Business tier at $2,499/mo ($29,988/yr) is less than half the enterprise floor. Once these features are fully built out, there's significant headroom.</p>
    </div>
    <div class="insight-card" style="border-left: 3px solid #fbbf24;">
      <h4 style="color:#fbbf24;">The Mid-Market Gap is Your Opportunity</h4>
      <p>There's a clear pricing gap between SMB tools ($250-$500) and proper mid-market platforms ($1,250-$2,000). FinanceOS currently prices at the SMB level but delivers mid-market features. The strategic play: stay at current prices to acquire customers, then reprice to the mid-market band once live data integrations prove the value. Customer acquisition is easier at $499 — retention is easier at $999 when they're dependent on your data.</p>
    </div>
    <div class="insight-card" style="border-left: 3px solid #f472b6;">
      <h4 style="color:#f472b6;">Implementation Costs = Hidden Competitor Advantage</h4>
      <p>Most mid-market FP&A tools charge $10,000-$50,000 for implementation on top of subscription fees. FinanceOS has zero implementation cost — users sign up and go. This is a massive competitive advantage in sales conversations. Even if you raise prices 2x, you're still cheaper than competitors after their implementation fees.</p>
    </div>
    <div class="insight-card" style="border-left: 3px solid #fb923c;">
      <h4 style="color:#fb923c;">Elastic in Demo, Inelastic Once Embedded</h4>
      <p>Right now, while running on demo data, demand is price-elastic — prospects can easily switch to a competitor. Once customers connect QuickBooks/Xero and their real financial data flows through FinanceOS, demand becomes highly inelastic. Switching costs skyrocket. The sequence is: acquire cheap → embed deep → reprice confidently. This is exactly how Datarails, Mosaic, and Cube all scaled.</p>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- Pricing Recommendations -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="rec-section">
    <h2>Pricing Roadmap — When & How to Reprice</h2>
    <p style="font-size:14px; color:rgba(255,255,255,0.5); margin-bottom:24px;">
      Do NOT change prices now. Here's the trigger-based repricing strategy — each tier moves independently when its value is proven live.
    </p>

    <div class="rec-tiers">
      <div class="rec-tier" style="border-top: 3px solid #34d399;">
        <div class="tier-name" style="color:#34d399;">Starter</div>
        <div class="current">$499</div>
        <div class="future" style="color:#34d399;">$799<span>/mo</span></div>
        <div class="trigger"><strong>Trigger:</strong> When Xero + Plaid integrations go live and real GL data flows into P&L and Dashboard views. Projected: 4-6 weeks.</div>
      </div>
      <div class="rec-tier" style="border-top: 3px solid #5b9cf5;">
        <div class="tier-name" style="color:#5b9cf5;">Growth</div>
        <div class="current">$999</div>
        <div class="future" style="color:#5b9cf5;">$1,499<span>/mo</span></div>
        <div class="trigger"><strong>Trigger:</strong> When AI Copilot analyzes real company data (not demo context) and Slack integration sends live alerts. Projected: 6-8 weeks.</div>
      </div>
      <div class="rec-tier" style="border-top: 3px solid #a78bfa;">
        <div class="tier-name" style="color:#a78bfa;">Business</div>
        <div class="current">$2,499</div>
        <div class="future" style="color:#a78bfa;">$3,999<span>/mo</span></div>
        <div class="trigger"><strong>Trigger:</strong> When SOX Audit has real logging, SSO connects to Okta/Azure, and ML models run on live financial data. Projected: 8-12 weeks.</div>
      </div>
      <div class="rec-tier" style="border-top: 3px solid #f472b6;">
        <div class="tier-name" style="color:#f472b6;">Enterprise (Future)</div>
        <div class="current" style="text-decoration:none; color:rgba(255,255,255,0.2);">New Tier</div>
        <div class="future" style="color:#f472b6;">$6,999<span>/mo</span></div>
        <div class="trigger"><strong>Trigger:</strong> When you have 10+ Business tier customers and they're requesting dedicated support, custom integrations, and SLA guarantees.</div>
      </div>
    </div>

    <div style="margin-top:24px; padding:18px 22px; border-radius:12px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);">
      <h4 style="color:#fbbf24; font-size:14px; margin-bottom:8px;">Grandfather Strategy</h4>
      <p style="font-size:13px; color:rgba(255,255,255,0.55); line-height:1.8;">
        When you reprice, <strong style="color:#fff;">grandfather existing customers at their current rate for 12 months</strong>. This builds loyalty, generates word-of-mouth, and creates urgency for new sign-ups ("lock in before the price increase"). Announce the price increase 30 days before it takes effect for new customers. Early adopters feel rewarded, not punished.
      </p>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- Revenue Projections -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="section-header">Revenue Impact Modeling</div>
  <div class="section-sub">Hypothetical MRR at different customer counts with current vs. future pricing.</div>

  <div style="overflow-x:auto; margin-bottom:40px;">
    <table class="comp-table" style="min-width:700px;">
      <thead>
        <tr>
          <th>Scenario</th>
          <th>Starter Customers</th>
          <th>Growth Customers</th>
          <th>Business Customers</th>
          <th style="color:#5b9cf5;">MRR (Current)</th>
          <th style="color:#34d399;">MRR (Repriced)</th>
          <th>ARR (Repriced)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight:600; color:#fff;">Early Traction</td>
          <td>20</td><td>8</td><td>2</td>
          <td class="price-cell">$22,978</td>
          <td class="price-cell" style="color:#34d399;">$31,978</td>
          <td class="price-cell" style="color:#34d399;">$383,736</td>
        </tr>
        <tr>
          <td style="font-weight:600; color:#fff;">Product-Market Fit</td>
          <td>50</td><td>25</td><td>8</td>
          <td class="price-cell">$69,942</td>
          <td class="price-cell" style="color:#34d399;">$109,442</td>
          <td class="price-cell" style="color:#34d399;">$1,313,304</td>
        </tr>
        <tr>
          <td style="font-weight:600; color:#fff;">Scale</td>
          <td>120</td><td>60</td><td>25</td>
          <td class="price-cell">$181,330</td>
          <td class="price-cell" style="color:#34d399;">$285,555</td>
          <td class="price-cell" style="color:#34d399;">$3,426,660</td>
        </tr>
        <tr>
          <td style="font-weight:600; color:#fff;">Growth Stage</td>
          <td>250</td><td>120</td><td>50</td>
          <td class="price-cell">$369,730</td>
          <td class="price-cell" style="color:#34d399;">$579,230</td>
          <td class="price-cell" style="color:#34d399;">$6,950,760</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer-note">
    <strong>Sources:</strong> Pricing data compiled from vendor websites, G2 Pricing pages, Capterra, Vendr marketplace data, GoLimelight FP&A Pricing Guide 2026, and Cube Software competitive analysis blog posts. All prices verified as of March 2026. Enterprise pricing (Anaplan, Workday Adaptive, Drivetrain) based on industry reports and customer reviews — actual pricing varies by deal. FinanceOS pricing reflects current Stripe-configured tiers. Repricing recommendations are strategic guidance — not committed changes.
  </div>

</div>
` }} />
    </>
  );
}
