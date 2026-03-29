'use client';

import { useEffect } from 'react';

export default function V3InternalPremiumPipelinePage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  :root {
    --bg: #06080c;
    --bg2: #0a0c12;
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
    --font: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg); color: var(--text); font-family: var(--font); min-height: 100vh; overflow-x: hidden; }

  /* Ambient Background */
  .bg-glow { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; pointer-events: none; }
  .bg-glow::before { content: ''; position: absolute; top: -200px; right: -100px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(91,156,245,0.06) 0%, transparent 70%); animation: float1 20s ease-in-out infinite; }
  .bg-glow::after { content: ''; position: absolute; bottom: -100px; left: -100px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(161,129,247,0.05) 0%, transparent 70%); animation: float2 25s ease-in-out infinite; }
  @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-80px, 60px); } }
  @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(60px, -40px); } }

  .container { max-width: 1100px; margin: 0 auto; padding: 60px 24px; position: relative; z-index: 1; }

  /* Hero */
  .hero { text-align: center; margin-bottom: 72px; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 9999px; background: rgba(91,156,245,0.08); border: 1px solid rgba(91,156,245,0.15); font-size: 11px; font-weight: 700; color: var(--accent); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 20px; }
  .hero-badge .pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
  .hero h1 { font-size: 48px; font-weight: 800; letter-spacing: -0.04em; line-height: 1.15; margin-bottom: 16px; animation: heroFadeUp 1s ease-out; }
  .hero h1 .gradient {
    background: linear-gradient(135deg, var(--accent), var(--purple), var(--cyan), var(--accent));
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 6s ease-in-out infinite;
  }
  @keyframes heroFadeUp {
    0% { opacity: 0; transform: translateY(24px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .hero-badge { animation: heroFadeUp 0.6s ease-out; }
  .hero .subtitle { animation: heroFadeUp 1.2s ease-out; }
  .hero .subtitle { font-size: 18px; color: var(--text-sec); line-height: 1.7; max-width: 640px; margin: 0 auto; }

  /* Timeline */
  .timeline { position: relative; padding-left: 40px; margin-bottom: 72px; }
  .timeline::before { content: ''; position: absolute; left: 15px; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, var(--accent), var(--purple), var(--text-faint)); border-radius: 1px; }
  .timeline-phase { margin-bottom: 48px; position: relative; }
  .timeline-phase:last-child { margin-bottom: 0; }
  .timeline-dot { position: absolute; left: -33px; top: 4px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; }
  .timeline-dot.live { background: var(--green); box-shadow: 0 0 20px rgba(61,217,160,0.3); }
  .timeline-dot.next { background: var(--accent); box-shadow: 0 0 20px rgba(91,156,245,0.3); }
  .timeline-dot.future { background: var(--purple); box-shadow: 0 0 20px rgba(161,129,247,0.2); }
  .timeline-dot.soon { background: var(--amber); box-shadow: 0 0 20px rgba(245,183,49,0.2); }
  .phase-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .phase-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; padding: 3px 10px; border-radius: 6px; }
  .phase-label.live { background: rgba(61,217,160,0.1); color: var(--green); }
  .phase-label.next { background: rgba(91,156,245,0.1); color: var(--accent); }
  .phase-label.future { background: rgba(161,129,247,0.1); color: var(--purple); }
  .phase-label.soon { background: rgba(245,183,49,0.1); color: var(--amber); }
  .phase-date { font-size: 12px; color: var(--text-faint); font-family: var(--mono); }
  .phase-title { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 8px; }
  .phase-desc { font-size: 14px; color: var(--text-dim); line-height: 1.7; margin-bottom: 16px; max-width: 700px; }

  /* Feature Cards */
  .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
  .feature-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 14px; padding: 20px; transition: all 0.3s ease; position: relative; overflow: hidden; }
  .feature-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
  .feature-card .card-accent { position: absolute; top: 0; left: 0; width: 3px; height: 100%; border-radius: 0 2px 2px 0; }
  .feature-card .icon-box { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 12px; }
  .feature-card h4 { font-size: 14px; font-weight: 800; color: var(--text); margin-bottom: 4px; letter-spacing: -0.01em; }
  .feature-card p { font-size: 12px; color: var(--text-dim); line-height: 1.6; }
  .feature-card .tier-tag { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 8px; border-radius: 4px; margin-top: 10px; display: inline-block; }
  .tier-starter { background: rgba(52,211,153,0.1); color: #34d399; }
  .tier-growth { background: rgba(91,156,245,0.1); color: var(--accent); }
  .tier-business { background: rgba(161,129,247,0.1); color: var(--purple); }

  /* How It Works */
  .how-section { margin-bottom: 72px; }
  .how-section h2 { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; text-align: center; margin-bottom: 8px; }
  .how-section .how-sub { font-size: 14px; color: var(--text-dim); text-align: center; margin-bottom: 36px; }
  .steps-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .step-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 16px; padding: 28px 22px; text-align: center; position: relative; }
  .step-card::after { content: '→'; position: absolute; right: -14px; top: 50%; transform: translateY(-50%); font-size: 18px; color: var(--text-faint); z-index: 2; }
  .step-card:last-child::after { display: none; }
  .step-num { width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, var(--accent), var(--purple)); color: #fff; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
  .step-card h4 { font-size: 14px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
  .step-card p { font-size: 11px; color: var(--text-dim); line-height: 1.6; }

  /* CTA */
  .cta-section { text-align: center; padding: 48px 24px; background: linear-gradient(135deg, rgba(91,156,245,0.05), rgba(161,129,247,0.04)); border: 1px solid rgba(91,156,245,0.1); border-radius: 20px; margin-bottom: 48px; }
  .cta-section h2 { font-size: 28px; font-weight: 800; color: var(--text); margin-bottom: 10px; letter-spacing: -0.02em; }
  .cta-section p { font-size: 15px; color: var(--text-sec); margin-bottom: 28px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.7; }
  .cta-btn { display: inline-block; padding: 16px 36px; border-radius: 14px; border: none; background: linear-gradient(135deg, var(--accent), var(--purple)); color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 6px 30px rgba(91,156,245,0.25); font-family: var(--font); }
  .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(91,156,245,0.35); }
  .cta-note { font-size: 11px; color: var(--text-faint); margin-top: 14px; }

  /* Footer */
  .footer { text-align: center; padding-top: 32px; border-top: 1px solid var(--border); }
  .footer-brand { font-size: 16px; font-weight: 800; background: linear-gradient(135deg, var(--accent), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px; }
  .footer-sub { font-size: 11px; color: var(--text-faint); }

  /* Responsive */
  @media (max-width: 768px) {
    .hero h1 { font-size: 32px; }
    .steps-row { grid-template-columns: 1fr 1fr; }
    .step-card::after { display: none; }
    .feature-grid { grid-template-columns: 1fr; }
    .container { padding: 40px 16px; }
  }
  @media (max-width: 480px) {
    .steps-row { grid-template-columns: 1fr; }
  }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `
<div class="bg-glow"></div>
<div class="container">

  <!-- HERO -->
  <div class="hero">
    <div class="hero-badge"><span class="pulse"></span> Now Rolling Out</div>
    <h1>Premium features<br>for teams that <span class="gradient">move fast</span></h1>
    <div class="subtitle">We're building the most powerful FP&A platform for modern finance teams. Here's what's shipping — and when you can expect it.</div>
  </div>

  <!-- HOW IT WORKS -->
  <div class="how-section">
    <h2>How Premium Access Works</h2>
    <div class="how-sub">Every feature unlocks instantly when you upgrade. No migration, no setup, no waiting.</div>
    <div class="steps-row">
      <div class="step-card">
        <div class="step-num">1</div>
        <h4>Choose Your Plan</h4>
        <p>Pick Starter, Growth, or Business based on the features your team needs right now.</p>
      </div>
      <div class="step-card">
        <div class="step-num">2</div>
        <h4>Instant Verification</h4>
        <p>Your plan is verified in real-time through Stripe on every dashboard load. No delays.</p>
      </div>
      <div class="step-card">
        <div class="step-num">3</div>
        <h4>Features Unlock</h4>
        <p>Locked views instantly become accessible. Your data and settings are already waiting.</p>
      </div>
      <div class="step-card">
        <div class="step-num">4</div>
        <h4>Scale Anytime</h4>
        <p>Upgrade or downgrade at any time. Changes take effect immediately — no contracts.</p>
      </div>
    </div>
  </div>

  <!-- TIMELINE -->
  <div class="timeline">

    <!-- PHASE 1: LIVE NOW -->
    <div class="timeline-phase">
      <div class="timeline-dot live">&#10003;</div>
      <div class="phase-header">
        <span class="phase-label live">Live Now</span>
        <span class="phase-date">Available Today</span>
      </div>
      <div class="phase-title">Core Platform — Starter Plan</div>
      <div class="phase-desc">Everything you need to get a real-time view of your company's financial health. Connect your data, see your KPIs, and explore your P&L — all from one dashboard.</div>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="card-accent" style="background:var(--green);"></div>
          <div class="icon-box" style="background:rgba(61,217,160,0.1);">&#128200;</div>
          <h4>Interactive Dashboard</h4>
          <p>6 real-time KPI cards with drill-down drawers, revenue charts, department spend analysis, and AI-powered insights bar.</p>
          <span class="tier-tag tier-starter">Starter</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--green);"></div>
          <div class="icon-box" style="background:rgba(61,217,160,0.1);">&#128203;</div>
          <h4>P&L Statement</h4>
          <p>Full income statement with clickable line items. Revenue breakdown, COGS, Gross Profit, OpEx by department, and EBITDA.</p>
          <span class="tier-tag tier-starter">Starter</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--green);"></div>
          <div class="icon-box" style="background:rgba(61,217,160,0.1);">&#9889;</div>
          <h4>Integrations Hub</h4>
          <p>Connect QuickBooks, Stripe, Salesforce, and more. Live sync status, health monitoring, and one-click OAuth setup.</p>
          <span class="tier-tag tier-starter">Starter</span>
        </div>
      </div>
    </div>

    <!-- PHASE 2: SHIPPING NOW -->
    <div class="timeline-phase">
      <div class="timeline-dot next">&#9733;</div>
      <div class="phase-header">
        <span class="phase-label next">Shipping Now</span>
        <span class="phase-date">Q1 2026</span>
      </div>
      <div class="phase-title">Intelligence Suite — Growth Plan</div>
      <div class="phase-desc">AI-powered forecasting, scenario planning, and multi-entity consolidation for finance teams that need to move beyond spreadsheets and into predictive analytics.</div>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="card-accent" style="background:var(--accent);"></div>
          <div class="icon-box" style="background:rgba(91,156,245,0.1);">&#129302;</div>
          <h4>AI Copilot</h4>
          <p>Claude-powered financial assistant with visible chain-of-thought reasoning. Ask questions about your real-time data across all connected systems.</p>
          <span class="tier-tag tier-growth">Growth</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--accent);"></div>
          <div class="icon-box" style="background:rgba(91,156,245,0.1);">&#128201;</div>
          <h4>Forecast Engine</h4>
          <p>ML-powered 12-month revenue forecast with confidence intervals, sensitivity sliders, and MAPE accuracy scoring. Retrains automatically.</p>
          <span class="tier-tag tier-growth">Growth</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--accent);"></div>
          <div class="icon-box" style="background:rgba(91,156,245,0.1);">&#9878;</div>
          <h4>Scenario Modeling</h4>
          <p>Compare Base, Optimistic, and Conservative cases with adjustable drivers: growth rate, churn, headcount, burn rate.</p>
          <span class="tier-tag tier-growth">Growth</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--accent);"></div>
          <div class="icon-box" style="background:rgba(91,156,245,0.1);">&#127758;</div>
          <h4>Multi-Entity Consolidation</h4>
          <p>Consolidate across US, EU, and APAC entities. Automatic FX translation, intercompany eliminations, and entity-level close tracking.</p>
          <span class="tier-tag tier-growth">Growth</span>
        </div>
      </div>
    </div>

    <!-- PHASE 3: COMING Q2 -->
    <div class="timeline-phase">
      <div class="timeline-dot soon">&#9670;</div>
      <div class="phase-header">
        <span class="phase-label soon">Coming Q2</span>
        <span class="phase-date">April – June 2026</span>
      </div>
      <div class="phase-title">Enterprise Command — Business Plan</div>
      <div class="phase-desc">The full executive suite — role-based dashboards, investor-ready board packs, month-end close automation, and compliance tools built for CFOs who answer to a board.</div>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="card-accent" style="background:var(--purple);"></div>
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#127919;</div>
          <h4>Command Center</h4>
          <p>Executive hub with role-based views for CEO (pipeline, velocity), CFO (cash flow, margins), and Controller (close checklist, SOX).</p>
          <span class="tier-tag tier-business">Business</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--purple);"></div>
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#10003;</div>
          <h4>Close Task Manager</h4>
          <p>Automate your month-end close with checklists, assignees, due dates, and status tracking. Revenue recognition, reconciliations, accruals.</p>
          <span class="tier-tag tier-business">Business</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--purple);"></div>
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#128202;</div>
          <h4>Investor Metrics & Board Packs</h4>
          <p>Series A readiness scorecard with 8 SaaS benchmarks. One-click CSV/PDF export for board meetings. Cohort retention analysis.</p>
          <span class="tier-tag tier-business">Business</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--purple);"></div>
          <div class="icon-box" style="background:rgba(161,129,247,0.1);">&#128101;</div>
          <h4>Team Management</h4>
          <p>Role-based access, team chat, task assignments, and real-time presence. Control who sees what across your finance org.</p>
          <span class="tier-tag tier-business">Business</span>
        </div>
      </div>
    </div>

    <!-- PHASE 4: ON THE ROADMAP -->
    <div class="timeline-phase">
      <div class="timeline-dot future">&#10148;</div>
      <div class="phase-header">
        <span class="phase-label future">Roadmap</span>
        <span class="phase-date">H2 2026</span>
      </div>
      <div class="phase-title">Enterprise Security & Custom AI</div>
      <div class="phase-desc">Enterprise-grade security, compliance automation, and the ability to train custom ML models on your own financial data.</div>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="card-accent" style="background:var(--cyan);"></div>
          <div class="icon-box" style="background:rgba(45,212,208,0.1);">&#128274;</div>
          <h4>SOX Audit Trails</h4>
          <p>Full audit log with timestamps, user actions, control sign-offs, and automated evidence collection. SOX Section 404 ready.</p>
          <span class="tier-tag tier-business">Business</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--cyan);"></div>
          <div class="icon-box" style="background:rgba(45,212,208,0.1);">&#128272;</div>
          <h4>SSO / SAML</h4>
          <p>Enterprise single sign-on via SAML 2.0 or OIDC. Domain verification, auto-provisioning, and centralized access control.</p>
          <span class="tier-tag tier-business">Business</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--cyan);"></div>
          <div class="icon-box" style="background:rgba(45,212,208,0.1);">&#129504;</div>
          <h4>Custom ML Models</h4>
          <p>Train models on your own data — revenue forecasting, anomaly detection, churn prediction. Deploy directly to your live dashboard.</p>
          <span class="tier-tag tier-business">Business</span>
        </div>
        <div class="feature-card">
          <div class="card-accent" style="background:var(--cyan);"></div>
          <div class="icon-box" style="background:rgba(45,212,208,0.1);">&#128172;</div>
          <h4>Slack Integration</h4>
          <p>Real-time notifications for budget alerts, close reminders, and AI insights — delivered directly to your team's Slack channels.</p>
          <span class="tier-tag tier-growth">Growth</span>
        </div>
      </div>
    </div>

  </div>

  <!-- CTA -->
  <div class="cta-section">
    <h2>Ready to unlock more?</h2>
    <p>Every plan includes a 14-day free trial of all features. No credit card required to start exploring.</p>
    <a href="https://finance-os.app/#pricing" class="cta-btn">View Plans & Pricing</a>
    <div class="cta-note">Questions? Reach us at team@finance-os.app</div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-brand">FinanceOS</div>
    <div class="footer-sub">The AI-native FP&A platform · finance-os.app</div>
  </div>

</div>
` }} />
    </>
  );
}
