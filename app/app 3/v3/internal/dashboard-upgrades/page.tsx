'use client';

import { useEffect } from 'react';

export default function V3InternalDashboardUpgradesPage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Manrope', sans-serif;
    background: #0a0e1a;
    color: #e0e0e0;
    line-height: 1.7;
  }

  .header {
    background: linear-gradient(135deg, #0f1629, #1a0f2e, #0f1629);
    border-bottom: 1px solid rgba(248,113,113,0.15);
    padding: 48px 32px;
    text-align: center;
  }
  .header h1 {
    font-size: 34px;
    font-weight: 800;
    background: linear-gradient(135deg, #f87171, #fb923c, #fbbf24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }
  .header p { font-size: 14px; color: rgba(255,255,255,0.4); }
  .header .urgency {
    display: inline-block;
    margin-top: 14px;
    padding: 6px 16px;
    border-radius: 20px;
    background: rgba(248,113,113,0.12);
    border: 1px solid rgba(248,113,113,0.25);
    font-size: 12px;
    font-weight: 700;
    color: #f87171;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .content { max-width: 1100px; margin: 0 auto; padding: 40px 24px 60px; }

  /* Priority banner */
  .priority-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
    margin-bottom: 40px;
  }
  .pri-card {
    padding: 18px 20px;
    border-radius: 14px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    text-align: center;
  }
  .pri-card .pri-tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }
  .pri-card .pri-name {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
  }
  .pri-card .pri-reason {
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    margin-top: 4px;
  }

  /* Upgrade blocks */
  .upgrade-block {
    margin-bottom: 40px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
  }
  .ub-header {
    padding: 24px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ub-header h2 {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
  }
  .ub-badges { display: flex; gap: 8px; }
  .ub-badge {
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .ub-body { padding: 0 28px 28px; }

  .spec-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  @media (max-width: 700px) { .spec-grid { grid-template-columns: 1fr; } }

  .spec-box {
    padding: 18px 20px;
    border-radius: 12px;
    font-size: 13px;
  }
  .spec-box h4 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 10px;
    font-weight: 700;
  }
  .spec-box ul { list-style: none; padding: 0; }
  .spec-box li {
    padding: 4px 0 4px 20px;
    position: relative;
    color: rgba(255,255,255,0.7);
  }
  .spec-box li::before {
    content: '';
    position: absolute;
    left: 0; top: 11px;
    width: 8px; height: 8px;
    border-radius: 50%;
  }

  .spec-ui { background: rgba(91,156,245,0.04); border: 1px solid rgba(91,156,245,0.1); }
  .spec-ui h4 { color: #5b9cf5; }
  .spec-ui li::before { background: #5b9cf5; }

  .spec-backend { background: rgba(167,139,250,0.04); border: 1px solid rgba(167,139,250,0.1); }
  .spec-backend h4 { color: #a78bfa; }
  .spec-backend li::before { background: #a78bfa; }

  .spec-data { background: rgba(52,211,153,0.04); border: 1px solid rgba(52,211,153,0.1); }
  .spec-data h4 { color: #34d399; }
  .spec-data li::before { background: #34d399; }

  .spec-effort { background: rgba(251,191,36,0.04); border: 1px solid rgba(251,191,36,0.1); }
  .spec-effort h4 { color: #fbbf24; }
  .spec-effort li::before { background: #fbbf24; }

  /* Wireframe mockup */
  .wireframe {
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.015);
    padding: 24px;
    margin-top: 16px;
  }
  .wireframe h4 {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: rgba(255,255,255,0.35);
    margin-bottom: 16px;
  }
  .wf-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .wf-tile {
    flex: 1;
    min-width: 140px;
    padding: 16px;
    border-radius: 10px;
    border: 1px dashed rgba(255,255,255,0.1);
    text-align: center;
  }
  .wf-tile .wf-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.3);
    margin-bottom: 6px;
  }
  .wf-tile .wf-value {
    font-size: 20px;
    font-weight: 800;
    color: rgba(255,255,255,0.6);
  }
  .wf-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
    font-size: 12px;
  }
  .wf-table th {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.4);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.06em;
  }
  .wf-table td {
    padding: 10px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.55);
  }
  .wf-placeholder {
    padding: 20px;
    border-radius: 8px;
    border: 1px dashed rgba(255,255,255,0.1);
    text-align: center;
    color: rgba(255,255,255,0.2);
    font-size: 12px;
  }

  /* Impact note */
  .impact-note {
    margin-top: 16px;
    padding: 14px 18px;
    border-radius: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.6);
  }
  .impact-green { background: rgba(52,211,153,0.06); border-left: 3px solid #34d399; }
  .impact-orange { background: rgba(251,146,60,0.06); border-left: 3px solid #fb923c; }
  .impact-purple { background: rgba(167,139,250,0.06); border-left: 3px solid #a78bfa; }

  /* ── Bottom summary ── */
  .bottom-summary {
    margin-top: 48px;
    padding: 32px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(91,156,245,0.04), rgba(167,139,250,0.04));
    border: 1px solid rgba(91,156,245,0.12);
  }
  .bottom-summary h2 {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 16px;
  }
  .timeline {
    display: flex;
    gap: 0;
    margin-top: 20px;
    position: relative;
  }
  .timeline::before {
    content: '';
    position: absolute;
    top: 18px;
    left: 0; right: 0;
    height: 3px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
  }
  .tl-item {
    flex: 1;
    text-align: center;
    position: relative;
    padding-top: 36px;
  }
  .tl-dot {
    width: 14px; height: 14px;
    border-radius: 50%;
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    border: 2px solid #0a0e1a;
  }
  .tl-item h4 {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }
  .tl-item p {
    font-size: 11px;
    color: rgba(255,255,255,0.4);
  }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `

<div class="header">
  <h1>Required Dashboard Upgrades</h1>
  <p>Build specifications for the 4 features that need new or rebuilt dashboard views</p>
  <span class="urgency">Action Required — Business Tier Gaps</span>
</div>

<div class="content">

  <!-- Priority bar -->
  <div class="priority-bar">
    <div class="pri-card" style="border-left: 3px solid #f87171;">
      <div class="pri-tag" style="color:#f87171;">P0 — Critical</div>
      <div class="pri-name">SOX Audit Trails</div>
      <div class="pri-reason">$2,499 tier promise, zero code</div>
    </div>
    <div class="pri-card" style="border-left: 3px solid #f87171;">
      <div class="pri-tag" style="color:#f87171;">P0 — Critical</div>
      <div class="pri-name">SSO / SAML</div>
      <div class="pri-reason">Enterprise table-stakes, zero code</div>
    </div>
    <div class="pri-card" style="border-left: 3px solid #fb923c;">
      <div class="pri-tag" style="color:#fb923c;">P0 — Critical</div>
      <div class="pri-name">Custom ML Models</div>
      <div class="pri-reason">Premium differentiator, zero code</div>
    </div>
    <div class="pri-card" style="border-left: 3px solid #fbbf24;">
      <div class="pri-tag" style="color:#fbbf24;">P1 — High</div>
      <div class="pri-name">Slack Integration</div>
      <div class="pri-reason">Growth tier promise, shell only</div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- UPGRADE 1: SOX Audit Trails -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="upgrade-block" style="border-top: 3px solid #f87171;">
    <div class="ub-header" style="background: rgba(248,113,113,0.03);">
      <h2>1. SOX Audit Trails View</h2>
      <div class="ub-badges">
        <span class="ub-badge" style="background:rgba(248,113,113,0.12); color:#f87171;">Not Built</span>
        <span class="ub-badge" style="background:rgba(167,139,250,0.12); color:#a78bfa;">Business Tier</span>
      </div>
    </div>
    <div class="ub-body">
      <div class="spec-grid">
        <div class="spec-box spec-ui">
          <h4>UI Components to Build</h4>
          <ul>
            <li>AuditTrailView — new view in page.jsx (~300 lines)</li>
            <li>Audit event log table with filters (date, user, action type)</li>
            <li>Change diff viewer — shows before/after for data modifications</li>
            <li>Export button — CSV/PDF audit report generation</li>
            <li>Compliance status header with SOX readiness score</li>
            <li>User action timeline visualization</li>
          </ul>
        </div>
        <div class="spec-box spec-backend">
          <h4>Backend Requirements</h4>
          <ul>
            <li>Supabase table: audit_events (id, user_id, action, entity_type, entity_id, old_value, new_value, ip, timestamp)</li>
            <li>Middleware: audit logger wrapping all data mutation endpoints</li>
            <li>API route: GET /api/audit — paginated, filterable event log</li>
            <li>Row-level security: users can only see their org's audit events</li>
          </ul>
        </div>
        <div class="spec-box spec-data">
          <h4>Data Model</h4>
          <ul>
            <li>audit_events table with JSONB columns for old_value/new_value</li>
            <li>Immutable append-only — no UPDATE/DELETE allowed</li>
            <li>Indexes on timestamp, user_id, entity_type for fast queries</li>
            <li>Retention policy: 7 years for SOX compliance</li>
          </ul>
        </div>
        <div class="spec-box spec-effort">
          <h4>Effort Estimate</h4>
          <ul>
            <li>UI View: 2-3 days</li>
            <li>Supabase table + RLS: 0.5 day</li>
            <li>Audit middleware: 1-2 days</li>
            <li>API route + pagination: 1 day</li>
            <li>Total: ~5-7 days</li>
          </ul>
        </div>
      </div>

      <!-- Wireframe -->
      <div class="wireframe">
        <h4>Proposed Layout</h4>
        <div class="wf-row">
          <div class="wf-tile" style="flex:0.6;">
            <div class="wf-label">SOX Readiness</div>
            <div class="wf-value" style="color:#34d399;">94%</div>
          </div>
          <div class="wf-tile">
            <div class="wf-label">Events (30d)</div>
            <div class="wf-value">2,847</div>
          </div>
          <div class="wf-tile">
            <div class="wf-label">Users Tracked</div>
            <div class="wf-value">12</div>
          </div>
          <div class="wf-tile">
            <div class="wf-label">Data Changes</div>
            <div class="wf-value">463</div>
          </div>
        </div>
        <table class="wf-table">
          <thead>
            <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th></tr>
          </thead>
          <tbody>
            <tr><td>2026-03-27 14:32</td><td>J. Chen</td><td>UPDATE</td><td>Invoice #4821</td><td>Amount: $12,400 → $12,800</td></tr>
            <tr><td>2026-03-27 14:18</td><td>S. Patel</td><td>APPROVE</td><td>Journal Entry #89</td><td>Approved month-end accrual</td></tr>
            <tr><td>2026-03-27 13:55</td><td>M. Frazier</td><td>EXPORT</td><td>P&L Report</td><td>Downloaded Q1 2026 P&L</td></tr>
            <tr><td>2026-03-27 12:40</td><td>A. Rivera</td><td>CREATE</td><td>Close Task #34</td><td>Added "Reconcile AR aging"</td></tr>
          </tbody>
        </table>
      </div>

      <div class="impact-note impact-green">
        <strong>Dashboard Impact:</strong> Add "Audit" to NAV_ITEMS array (line ~700 in page.jsx). Add feature key mapping: "audit": "sox_audit" to VIEW_FEATURE_MAP. New AuditTrailView component (~300 lines). Sidebar shows lock badge for non-Business users.
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- UPGRADE 2: SSO / SAML -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="upgrade-block" style="border-top: 3px solid #f87171;">
    <div class="ub-header" style="background: rgba(248,113,113,0.03);">
      <h2>2. SSO / SAML Configuration View</h2>
      <div class="ub-badges">
        <span class="ub-badge" style="background:rgba(248,113,113,0.12); color:#f87171;">Not Built</span>
        <span class="ub-badge" style="background:rgba(167,139,250,0.12); color:#a78bfa;">Business Tier</span>
      </div>
    </div>
    <div class="ub-body">
      <div class="spec-grid">
        <div class="spec-box spec-ui">
          <h4>UI Components to Build</h4>
          <ul>
            <li>SSOView — either a new view or a panel within Settings/Admin</li>
            <li>Identity Provider setup wizard (Okta, Azure AD, Google Workspace)</li>
            <li>SAML metadata URL input and certificate upload</li>
            <li>SSO enforcement toggle (require SSO for all org members)</li>
            <li>Test connection button with status indicator</li>
            <li>SSO user provisioning log</li>
          </ul>
        </div>
        <div class="spec-box spec-backend">
          <h4>Backend Requirements</h4>
          <ul>
            <li>Supabase Auth SSO: Use built-in SAML support (supabase.auth.signInWithSSO)</li>
            <li>API route: POST /api/sso/configure — save IdP metadata</li>
            <li>API route: GET /api/sso/status — check SSO connection health</li>
            <li>Supabase table: sso_configs (org_id, idp_type, metadata_url, cert, enforce, created_at)</li>
            <li>Login page update: "Sign in with SSO" button for configured orgs</li>
          </ul>
        </div>
        <div class="spec-box spec-data">
          <h4>Supported Providers</h4>
          <ul>
            <li>Okta — SAML 2.0 (most common for enterprise)</li>
            <li>Azure AD — SAML 2.0 + OIDC</li>
            <li>Google Workspace — SAML 2.0</li>
            <li>OneLogin — SAML 2.0</li>
            <li>Generic SAML — any compliant IdP</li>
          </ul>
        </div>
        <div class="spec-box spec-effort">
          <h4>Effort Estimate</h4>
          <ul>
            <li>UI View + Setup Wizard: 2-3 days</li>
            <li>Supabase SSO config: 1-2 days</li>
            <li>Login page SSO button: 0.5 day</li>
            <li>Testing with Okta dev account: 1 day</li>
            <li>Total: ~5-7 days</li>
          </ul>
        </div>
      </div>

      <!-- Wireframe -->
      <div class="wireframe">
        <h4>Proposed Layout</h4>
        <div class="wf-row">
          <div class="wf-tile" style="flex:0.7;">
            <div class="wf-label">SSO Status</div>
            <div class="wf-value" style="color:#34d399; font-size:16px;">Connected</div>
          </div>
          <div class="wf-tile">
            <div class="wf-label">Provider</div>
            <div class="wf-value" style="font-size:16px;">Okta</div>
          </div>
          <div class="wf-tile">
            <div class="wf-label">Enforcement</div>
            <div class="wf-value" style="color:#fbbf24; font-size:16px;">Optional</div>
          </div>
          <div class="wf-tile">
            <div class="wf-label">SSO Logins (30d)</div>
            <div class="wf-value">284</div>
          </div>
        </div>
        <div class="wf-row">
          <div class="wf-tile" style="flex:1; text-align:left; padding:20px;">
            <div class="wf-label" style="text-align:left; margin-bottom:12px;">Identity Provider Configuration</div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="padding:10px 14px; border-radius:8px; border:1px dashed rgba(255,255,255,0.1); font-size:12px; color:rgba(255,255,255,0.4);">
                Metadata URL: https://your-org.okta.com/app/.../sso/saml/metadata
              </div>
              <div style="padding:10px 14px; border-radius:8px; border:1px dashed rgba(255,255,255,0.1); font-size:12px; color:rgba(255,255,255,0.4);">
                Entity ID: urn:financeos:saml
              </div>
              <div style="padding:10px 14px; border-radius:8px; border:1px dashed rgba(255,255,255,0.1); font-size:12px; color:rgba(255,255,255,0.4);">
                ACS URL: https://app.financeos.io/api/auth/sso/callback
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="impact-note impact-purple">
        <strong>Dashboard Impact:</strong> Best placed as a sub-section of AdminView or SettingsView rather than a standalone nav item. Add SSO panel to the existing Admin/Settings view. Update login page with SSO detection. Feature gate checks "sso" key.
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- UPGRADE 3: Custom ML Models -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="upgrade-block" style="border-top: 3px solid #fb923c;">
    <div class="ub-header" style="background: rgba(251,146,60,0.03);">
      <h2>3. Custom ML Models / Intelligence View</h2>
      <div class="ub-badges">
        <span class="ub-badge" style="background:rgba(248,113,113,0.12); color:#f87171;">Not Built</span>
        <span class="ub-badge" style="background:rgba(167,139,250,0.12); color:#a78bfa;">Business Tier</span>
      </div>
    </div>
    <div class="ub-body">
      <div class="spec-grid">
        <div class="spec-box spec-ui">
          <h4>UI Components to Build</h4>
          <ul>
            <li>MLModelsView — new view in page.jsx (~400 lines)</li>
            <li>Model cards: Anomaly Detection, Revenue Prediction, Expense Categorization</li>
            <li>Model performance dashboard (accuracy, precision, last trained)</li>
            <li>Anomaly alerts feed with severity levels</li>
            <li>Revenue prediction chart with confidence intervals</li>
            <li>"Retrain Model" button (triggers Claude analysis in MVP)</li>
          </ul>
        </div>
        <div class="spec-box spec-backend">
          <h4>Backend Strategy (Two Options)</h4>
          <ul>
            <li><strong>Option A — Claude-Powered (Recommended for MVP):</strong></li>
            <li>Use Claude API to analyze financial data and generate "model outputs"</li>
            <li>Anomaly detection = Claude analyzing transactions for outliers</li>
            <li>Revenue prediction = Claude running trend analysis on historical data</li>
            <li><strong>Option B — Real ML (Future):</strong></li>
            <li>Python ML pipeline with scikit-learn or Prophet</li>
            <li>Supabase Edge Function for model serving</li>
          </ul>
        </div>
        <div class="spec-box spec-data">
          <h4>Pre-Built Models to Show</h4>
          <ul>
            <li><strong>Anomaly Detector:</strong> Flags unusual transactions, spend spikes, revenue drops</li>
            <li><strong>Revenue Forecaster:</strong> ML-enhanced 12-month projection (vs. formula-based in Forecast view)</li>
            <li><strong>Expense Classifier:</strong> Auto-categorizes transactions into GL accounts</li>
            <li><strong>Churn Predictor:</strong> Identifies at-risk revenue streams</li>
          </ul>
        </div>
        <div class="spec-box spec-effort">
          <h4>Effort Estimate</h4>
          <ul>
            <li>UI View + Model Cards: 2-3 days</li>
            <li>Claude API integration for "models": 2-3 days</li>
            <li>Anomaly detection prompts + results UI: 1-2 days</li>
            <li>Demo data for model outputs: 1 day</li>
            <li>Total: ~7-10 days</li>
          </ul>
        </div>
      </div>

      <!-- Wireframe -->
      <div class="wireframe">
        <h4>Proposed Layout</h4>
        <div class="wf-row">
          <div class="wf-tile" style="border-color: rgba(167,139,250,0.2);">
            <div class="wf-label">Active Models</div>
            <div class="wf-value" style="color:#a78bfa;">4</div>
          </div>
          <div class="wf-tile" style="border-color: rgba(248,113,113,0.2);">
            <div class="wf-label">Anomalies (30d)</div>
            <div class="wf-value" style="color:#f87171;">7</div>
          </div>
          <div class="wf-tile" style="border-color: rgba(52,211,153,0.2);">
            <div class="wf-label">Prediction Accuracy</div>
            <div class="wf-value" style="color:#34d399;">94.2%</div>
          </div>
          <div class="wf-tile" style="border-color: rgba(91,156,245,0.2);">
            <div class="wf-label">Last Trained</div>
            <div class="wf-value" style="font-size:14px;">2h ago</div>
          </div>
        </div>
        <div class="wf-row">
          <div class="wf-tile" style="flex:1; text-align:left; padding:16px;">
            <div class="wf-label" style="text-align:left;">Recent Anomalies Detected</div>
            <table class="wf-table" style="margin-top:8px;">
              <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Severity</th></tr></thead>
              <tbody>
                <tr><td>Mar 26</td><td>Spend Spike</td><td>AWS costs 3.2x above 90-day avg</td><td style="color:#f87171;">High</td></tr>
                <tr><td>Mar 25</td><td>Revenue Drop</td><td>Enterprise segment -18% WoW</td><td style="color:#fbbf24;">Medium</td></tr>
                <tr><td>Mar 24</td><td>Categorization</td><td>12 uncategorized transactions > $5k</td><td style="color:#5b9cf5;">Low</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="wf-placeholder" style="margin-top:12px;">
          [ Revenue Prediction Chart — Actual vs Predicted with 95% confidence band ]
        </div>
      </div>

      <div class="impact-note impact-orange">
        <strong>Recommendation:</strong> Use Claude API as the "ML engine" for MVP. This lets you honestly say the models are AI-powered (because they are — Claude). Brand it as "AI Intelligence Suite" rather than "Custom ML Models" for more accurate positioning. Add to NAV_ITEMS and VIEW_FEATURE_MAP with key "custom_ml".
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- UPGRADE 4: Slack Integration -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="upgrade-block" style="border-top: 3px solid #fbbf24;">
    <div class="ub-header" style="background: rgba(251,191,36,0.03);">
      <h2>4. Slack Integration (Complete Build-Out)</h2>
      <div class="ub-badges">
        <span class="ub-badge" style="background:rgba(251,191,36,0.12); color:#fbbf24;">Shell Only</span>
        <span class="ub-badge" style="background:rgba(91,156,245,0.12); color:#5b9cf5;">Growth Tier</span>
      </div>
    </div>
    <div class="ub-body">
      <div class="spec-grid">
        <div class="spec-box spec-ui">
          <h4>UI Updates Needed</h4>
          <ul>
            <li>Replace static Slack card in IntegrationsView with real OAuth button</li>
            <li>Channel selector after OAuth — pick where alerts go</li>
            <li>Notification preferences panel (what events trigger alerts)</li>
            <li>Weekly digest toggle and schedule picker</li>
            <li>Connection status indicator with last-synced timestamp</li>
          </ul>
        </div>
        <div class="spec-box spec-backend">
          <h4>Backend Requirements</h4>
          <ul>
            <li>Slack App created in api.slack.com (bot + incoming webhooks)</li>
            <li>OAuth 2.0 flow: /api/integrations/slack/authorize → /api/integrations/slack/callback</li>
            <li>Supabase table: slack_connections (org_id, team_id, access_token, channel_id, webhook_url)</li>
            <li>Webhook sender: POST to Slack on financial events</li>
            <li>Cron job: Weekly financial digest message</li>
          </ul>
        </div>
        <div class="spec-box spec-data">
          <h4>Notification Types</h4>
          <ul>
            <li>Cash balance alerts (below threshold)</li>
            <li>Revenue milestone notifications</li>
            <li>Month-end close progress updates</li>
            <li>Anomaly detection alerts (from ML view)</li>
            <li>Weekly financial health digest</li>
          </ul>
        </div>
        <div class="spec-box spec-effort">
          <h4>Effort Estimate</h4>
          <ul>
            <li>Slack App setup + OAuth flow: 1-2 days</li>
            <li>Webhook sender service: 1 day</li>
            <li>UI updates to IntegrationsView: 1 day</li>
            <li>Weekly digest cron: 0.5 day</li>
            <li>Total: ~4-5 days</li>
          </ul>
        </div>
      </div>

      <div class="impact-note impact-green">
        <strong>Dashboard Impact:</strong> No new view needed — updates happen within existing IntegrationsView. Replace the static Slack card with a real OAuth-powered connection card. Add notification preferences to Settings view.
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- BOTTOM SUMMARY -->
  <!-- ═══════════════════════════════════════════════ -->
  <div class="bottom-summary">
    <h2>Implementation Timeline</h2>
    <p style="color:rgba(255,255,255,0.5); font-size:14px; margin-bottom:24px;">
      Total estimated effort: <strong style="color:#fff;">21-29 developer days</strong> to close all gaps. Recommended sprint plan:
    </p>

    <div class="timeline">
      <div class="tl-item">
        <div class="tl-dot" style="background:#f87171;"></div>
        <h4>Week 1-2</h4>
        <p>SOX Audit View<br>+ Audit Middleware</p>
      </div>
      <div class="tl-item">
        <div class="tl-dot" style="background:#fb923c;"></div>
        <h4>Week 2-3</h4>
        <p>SSO/SAML Config<br>+ Supabase Integration</p>
      </div>
      <div class="tl-item">
        <div class="tl-dot" style="background:#fbbf24;"></div>
        <h4>Week 3-4</h4>
        <p>ML Intelligence View<br>+ Claude API Models</p>
      </div>
      <div class="tl-item">
        <div class="tl-dot" style="background:#34d399;"></div>
        <h4>Week 4-5</h4>
        <p>Slack OAuth<br>+ Notifications</p>
      </div>
    </div>

    <div style="margin-top:32px; padding:18px 22px; border-radius:12px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);">
      <h4 style="color:#a78bfa; font-size:14px; margin-bottom:8px;">Changes to page.jsx Required</h4>
      <p style="font-size:13px; color:rgba(255,255,255,0.55); line-height:1.8;">
        <strong style="color:#fff;">NAV_ITEMS:</strong> Add "Audit" and "ML Intelligence" (2 new sidebar items)<br>
        <strong style="color:#fff;">VIEW_FEATURE_MAP:</strong> Add { audit: "sox_audit", ml_intelligence: "custom_ml" }<br>
        <strong style="color:#fff;">New Components:</strong> AuditTrailView (~300 lines), MLModelsView (~400 lines)<br>
        <strong style="color:#fff;">Updated Components:</strong> AdminView (add SSO panel), IntegrationsView (real Slack OAuth), SettingsView (Slack notification prefs)<br>
        <strong style="color:#fff;">New API Routes:</strong> /api/audit, /api/sso/configure, /api/sso/status, /api/integrations/slack/authorize, /api/integrations/slack/callback<br>
        <strong style="color:#fff;">New Supabase Tables:</strong> audit_events, sso_configs, slack_connections
      </p>
    </div>
  </div>

</div>
` }} />
    </>
  );
}
