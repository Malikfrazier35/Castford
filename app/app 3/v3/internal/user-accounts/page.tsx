'use client';

import { useEffect } from 'react';

export default function V3InternalUserAccountsPage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Manrope', sans-serif; background: #0a0b14; color: #e2e4f0; line-height: 1.65; }
  .container { max-width: 1200px; margin: 0 auto; padding: 48px 32px; }

  /* Header */
  .header { text-align: center; margin-bottom: 56px; position: relative; }
  .header::after { content: ''; position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); width: 120px; height: 2px; background: linear-gradient(90deg, transparent, #5b9cf5, transparent); }
  .header h1 { font-size: 36px; font-weight: 800; background: linear-gradient(135deg, #5b9cf5, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.03em; margin-bottom: 8px; }
  .header .sub { font-size: 16px; color: rgba(255,255,255,0.5); max-width: 650px; margin: 0 auto; }
  .header .date { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 12px; font-family: 'JetBrains Mono', monospace; }

  /* Section headers */
  .section-header { display: flex; align-items: center; gap: 12px; margin: 48px 0 24px; }
  .section-num { font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 6px; background: linear-gradient(135deg, #5b9cf5, #a78bfa); color: #fff; letter-spacing: 0.06em; font-family: 'JetBrains Mono', monospace; }
  .section-title { font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
  .section-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(91,156,245,0.3), transparent); }

  /* Cards */
  .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 28px; margin-bottom: 20px; transition: border-color 0.3s; }
  .card:hover { border-color: rgba(91,156,245,0.15); }

  /* Flow diagram */
  .flow { display: flex; align-items: stretch; gap: 0; margin: 32px 0; flex-wrap: wrap; justify-content: center; }
  .flow-step { flex: 1; min-width: 180px; max-width: 220px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px 16px; text-align: center; position: relative; }
  .flow-step .step-num { font-size: 10px; font-weight: 800; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #5b9cf5, #a78bfa); color: #fff; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace; }
  .flow-step .step-icon { font-size: 28px; margin-bottom: 8px; }
  .flow-step h4 { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .flow-step p { font-size: 11px; color: rgba(255,255,255,0.45); line-height: 1.5; }
  .flow-arrow { display: flex; align-items: center; justify-content: center; width: 40px; color: rgba(91,156,245,0.4); font-size: 20px; flex-shrink: 0; }

  /* Role cards grid */
  .roles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin: 24px 0; }
  .role-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; position: relative; overflow: hidden; }
  .role-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0; }
  .role-card.owner::before { background: linear-gradient(90deg, #a78bfa, #ec4899); }
  .role-card.admin::before { background: linear-gradient(90deg, #5b9cf5, #38bdf8); }
  .role-card.manager::before { background: linear-gradient(90deg, #34d399, #10b981); }
  .role-card.budget-owner::before { background: linear-gradient(90deg, #f59e0b, #f97316); }
  .role-card.viewer::before { background: linear-gradient(90deg, #94a3b8, #64748b); }
  .role-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px; }
  .role-badge.owner { background: rgba(167,139,250,0.12); color: #a78bfa; }
  .role-badge.admin { background: rgba(91,156,245,0.12); color: #5b9cf5; }
  .role-badge.manager { background: rgba(52,211,153,0.12); color: #34d399; }
  .role-badge.budget-owner { background: rgba(245,158,11,0.12); color: #f59e0b; }
  .role-badge.viewer { background: rgba(148,163,184,0.12); color: #94a3b8; }
  .role-card h3 { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .role-card .role-desc { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 16px; line-height: 1.6; }
  .perm-list { list-style: none; padding: 0; }
  .perm-list li { font-size: 12px; color: rgba(255,255,255,0.6); padding: 5px 0; display: flex; align-items: center; gap: 8px; }
  .perm-list li .check { color: #34d399; font-weight: 800; font-size: 14px; }
  .perm-list li .cross { color: #f87171; font-weight: 800; font-size: 14px; }
  .perm-list li .partial { color: #f59e0b; font-weight: 800; font-size: 14px; }

  /* Plan tier cards */
  .tier-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
  @media (max-width: 900px) { .tier-grid { grid-template-columns: repeat(2, 1fr); } }
  .tier-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px; text-align: center; }
  .tier-card.active { border-color: rgba(91,156,245,0.3); background: rgba(91,156,245,0.04); }
  .tier-name { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 4px; }
  .tier-price { font-size: 24px; font-weight: 800; color: #5b9cf5; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
  .tier-price span { font-size: 12px; color: rgba(255,255,255,0.35); font-weight: 500; }
  .tier-seats { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 12px; }
  .tier-features { text-align: left; }
  .tier-features .feat { font-size: 11px; color: rgba(255,255,255,0.5); padding: 3px 0; display: flex; align-items: center; gap: 6px; }
  .tier-features .feat .dot { width: 5px; height: 5px; border-radius: 50%; background: #5b9cf5; flex-shrink: 0; }
  .tier-features .feat.locked { opacity: 0.3; }
  .tier-features .feat.locked .dot { background: #64748b; }

  /* Dashboard mockups */
  .dash-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin: 24px 0; }
  .dash-mock { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }
  .dash-mock .titlebar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.06); }
  .dash-mock .titlebar .dots { display: flex; gap: 4px; }
  .dash-mock .titlebar .dots span { width: 8px; height: 8px; border-radius: 50%; }
  .dash-mock .titlebar .dots .r { background: #f87171; }
  .dash-mock .titlebar .dots .y { background: #fbbf24; }
  .dash-mock .titlebar .dots .g { background: #34d399; }
  .dash-mock .titlebar .url { font-size: 10px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; }
  .dash-mock .mock-body { padding: 16px; }
  .dash-mock .sidebar-mock { display: flex; gap: 12px; }
  .dash-mock .sidebar-items { width: 120px; flex-shrink: 0; }
  .dash-mock .sidebar-items .nav-item { font-size: 10px; padding: 6px 10px; border-radius: 6px; color: rgba(255,255,255,0.4); margin-bottom: 3px; display: flex; align-items: center; gap: 6px; }
  .dash-mock .sidebar-items .nav-item.active { background: rgba(91,156,245,0.12); color: #5b9cf5; font-weight: 700; }
  .dash-mock .sidebar-items .nav-item.locked { opacity: 0.25; }
  .dash-mock .sidebar-items .nav-item .lock-icon { font-size: 8px; margin-left: auto; }
  .dash-mock .content-area { flex: 1; background: rgba(255,255,255,0.02); border-radius: 8px; padding: 12px; min-height: 140px; }
  .dash-mock .content-area .mock-kpi { display: flex; gap: 8px; margin-bottom: 10px; }
  .dash-mock .content-area .kpi-box { flex: 1; background: rgba(255,255,255,0.04); border-radius: 6px; padding: 8px; text-align: center; }
  .dash-mock .content-area .kpi-box .kpi-val { font-size: 14px; font-weight: 800; color: #5b9cf5; font-family: 'JetBrains Mono', monospace; }
  .dash-mock .content-area .kpi-box .kpi-lbl { font-size: 8px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.05em; }
  .dash-mock .content-area .chart-placeholder { height: 50px; background: linear-gradient(135deg, rgba(91,156,245,0.06), rgba(167,139,250,0.04)); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 9px; color: rgba(255,255,255,0.2); }
  .dash-mock .upgrade-overlay { background: rgba(10,11,20,0.85); border-radius: 8px; padding: 16px; text-align: center; min-height: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed rgba(91,156,245,0.2); }
  .dash-mock .upgrade-overlay .lock-big { font-size: 24px; margin-bottom: 8px; opacity: 0.5; }
  .dash-mock .upgrade-overlay h5 { font-size: 13px; color: #fff; font-weight: 700; margin-bottom: 4px; }
  .dash-mock .upgrade-overlay p { font-size: 10px; color: rgba(255,255,255,0.35); }
  .dash-mock .upgrade-overlay .upgrade-btn { margin-top: 10px; font-size: 10px; padding: 6px 16px; border-radius: 6px; background: linear-gradient(135deg, #5b9cf5, #a78bfa); color: #fff; border: none; font-weight: 700; }

  /* Table */
  table.matrix { width: 100%; border-collapse: collapse; margin: 20px 0; }
  table.matrix th { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255,255,255,0.4); padding: 10px 14px; text-align: left; border-bottom: 2px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); }
  table.matrix td { font-size: 12px; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.6); }
  table.matrix tr:hover td { background: rgba(91,156,245,0.02); }

  /* Code block */
  .code-block { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px 20px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #a5b4fc; overflow-x: auto; margin: 16px 0; line-height: 1.7; }
  .code-block .comment { color: rgba(255,255,255,0.25); }
  .code-block .keyword { color: #c084fc; }
  .code-block .string { color: #34d399; }
  .code-block .func { color: #5b9cf5; }

  /* Info callout */
  .callout { background: rgba(91,156,245,0.06); border: 1px solid rgba(91,156,245,0.15); border-radius: 12px; padding: 16px 20px; margin: 20px 0; display: flex; gap: 12px; align-items: flex-start; }
  .callout .icon { font-size: 18px; flex-shrink: 0; margin-top: 2px; }
  .callout .text { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; }
  .callout .text strong { color: #5b9cf5; }

  /* Permission matrix */
  .perm-matrix { margin: 24px 0; overflow-x: auto; }
  .perm-matrix table { min-width: 700px; }
  .perm-y { color: #34d399; font-weight: 700; text-align: center; }
  .perm-n { color: rgba(255,255,255,0.15); text-align: center; }
  .perm-p { color: #f59e0b; font-weight: 700; text-align: center; }

  /* Sequence diagram */
  .sequence { margin: 24px 0; }
  .seq-row { display: flex; align-items: stretch; min-height: 52px; }
  .seq-actor { width: 100px; text-align: right; padding: 8px 14px 8px 0; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); flex-shrink: 0; display: flex; align-items: center; justify-content: flex-end; }
  .seq-line { width: 2px; background: rgba(91,156,245,0.15); flex-shrink: 0; position: relative; }
  .seq-line .dot { width: 10px; height: 10px; border-radius: 50%; background: #5b9cf5; position: absolute; left: -4px; top: 50%; transform: translateY(-50%); }
  .seq-content { flex: 1; padding: 8px 0 8px 14px; display: flex; align-items: center; }
  .seq-content .action { font-size: 12px; color: rgba(255,255,255,0.6); padding: 8px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; }
  .seq-content .action strong { color: #5b9cf5; }
  .seq-content .action code { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: rgba(91,156,245,0.1); padding: 1px 5px; border-radius: 3px; color: #a5b4fc; }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `
<div class="container">

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- HEADER -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<div class="header">
  <h1>User Accounts, Roles & Dashboard Assignment</h1>
  <div class="sub">How new team members get invited, what account type they receive, and what dashboard experience loads for each role and plan tier.</div>
  <div class="date">FinanceOS Platform Architecture &middot; March 2026</div>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- 1. INVITATION FLOW -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<div class="section-header">
  <span class="section-num">01</span>
  <span class="section-title">The Invitation Flow</span>
  <span class="section-line"></span>
</div>

<p style="font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 28px; max-width: 800px; line-height: 1.7;">
  New users join FinanceOS through the team invitation system. Only <strong style="color:#a78bfa">Owners</strong> and <strong style="color:#5b9cf5">Admins</strong> can invite new members. Each invite includes a specific role assignment that determines what that user can see and do.
</p>

<div class="flow">
  <div class="flow-step">
    <div class="step-num">1</div>
    <div class="step-icon">&#128100;</div>
    <h4>Admin Sends Invite</h4>
    <p>Owner or Admin opens Admin Console &rarr; Users & Roles &rarr; clicks "+ Invite User" and enters email + role</p>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-step">
    <div class="step-num">2</div>
    <div class="step-icon">&#128232;</div>
    <h4>API Creates Token</h4>
    <p><code style="font-size:9px; font-family:'JetBrains Mono',monospace; background:rgba(91,156,245,0.1); padding:1px 4px; border-radius:3px; color:#a5b4fc">POST /api/team/invite</code> validates role, checks seat limits, generates a 7-day UUID token, records in <code style="font-size:9px; font-family:'JetBrains Mono',monospace; background:rgba(91,156,245,0.1); padding:1px 4px; border-radius:3px; color:#a5b4fc">invitations</code> table</p>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-step">
    <div class="step-num">3</div>
    <div class="step-icon">&#128231;</div>
    <h4>Email Delivered</h4>
    <p>Invitation email sent via Resend/SendGrid with a unique accept link containing the token (email integration pending)</p>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-step">
    <div class="step-num">4</div>
    <div class="step-icon">&#128275;</div>
    <h4>User Accepts</h4>
    <p>Invitee clicks link, creates account (or logs in), gets added to the org with their pre-assigned role</p>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-step">
    <div class="step-num">5</div>
    <div class="step-icon">&#127919;</div>
    <h4>Dashboard Loads</h4>
    <p>PlanProvider runs Stripe checkpoint. Dashboard renders with sidebar nav gated by org's plan tier + user's role permissions</p>
  </div>
</div>

<!-- Sequence diagram -->
<div class="card" style="margin-top: 24px;">
  <div style="font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 16px;">Detailed Sequence: Invite &rarr; Accept &rarr; Dashboard Load</div>

  <div class="sequence">
    <div class="seq-row">
      <div class="seq-actor">Admin</div>
      <div class="seq-line"><div class="dot"></div></div>
      <div class="seq-content"><div class="action">Clicks <strong>"+ Invite User"</strong> in Admin Console, enters email and selects role from dropdown: <code>Owner</code> | <code>Admin</code> | <code>Manager</code> | <code>Budget Owner</code> | <code>Viewer</code></div></div>
    </div>
    <div class="seq-row">
      <div class="seq-actor">Frontend</div>
      <div class="seq-line"><div class="dot"></div></div>
      <div class="seq-content"><div class="action">Sends <code>POST /api/team/invite</code> with <code>{ email, invite_email, role }</code></div></div>
    </div>
    <div class="seq-row">
      <div class="seq-actor">API Route</div>
      <div class="seq-line"><div class="dot"></div></div>
      <div class="seq-content"><div class="action"><strong>Validates:</strong> caller must be Owner or Admin &rarr; checks seat limit (org.seats_used vs org.seats_limit) &rarr; checks if already invited &rarr; generates <code>crypto.randomUUID()</code> token valid 7 days</div></div>
    </div>
    <div class="seq-row">
      <div class="seq-actor">Supabase</div>
      <div class="seq-line"><div class="dot"></div></div>
      <div class="seq-content"><div class="action">Inserts into <code>invitations</code> table: <strong>org_id, invited_by, email, role, token, status: "pending", expires_at</strong> &rarr; Writes to <code>audit_log</code> with action: "INVITE"</div></div>
    </div>
    <div class="seq-row">
      <div class="seq-actor">Invitee</div>
      <div class="seq-line"><div class="dot"></div></div>
      <div class="seq-content"><div class="action">Receives email &rarr; clicks accept link &rarr; Supabase Auth creates account &rarr; user row created in <code>users</code> table with <strong>assigned role and org_id</strong></div></div>
    </div>
    <div class="seq-row">
      <div class="seq-actor">Dashboard</div>
      <div class="seq-line"><div class="dot"></div></div>
      <div class="seq-content"><div class="action"><strong>PlanProvider</strong> calls <code>GET /api/plan?email=</code> &rarr; Stripe checkpoint resolves org's plan tier &rarr; <strong>canAccessView()</strong> determines which nav items are active vs locked &rarr; role determines write/edit permissions within views</div></div>
    </div>
  </div>
</div>

<!-- API Details -->
<div class="card">
  <div style="font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 12px;">API: POST /api/team/invite</div>
  <div class="code-block">
<span class="comment">// Request body</span>
{
  <span class="string">"email"</span>: <span class="string">"admin@company.com"</span>,       <span class="comment">// who is inviting (must be Owner or Admin)</span>
  <span class="string">"invite_email"</span>: <span class="string">"new@hire.com"</span>,    <span class="comment">// who is being invited</span>
  <span class="string">"role"</span>: <span class="string">"viewer"</span>                     <span class="comment">// role to assign (default: "viewer")</span>
}

<span class="comment">// Validations performed:</span>
<span class="comment">// 1. Caller lookup: user must exist in users table</span>
<span class="comment">// 2. Permission check: user.role must be "owner" or "admin"</span>
<span class="comment">// 3. Seat limit: org.seats_used must be &lt; org.seats_limit</span>
<span class="comment">// 4. Duplicate check: no pending invite for same email+org</span>
<span class="comment">// 5. Token generation: crypto.randomUUID(), expires in 7 days</span>

<span class="comment">// Response</span>
{
  <span class="string">"success"</span>: <span class="keyword">true</span>,
  <span class="string">"invitation"</span>: { <span class="string">"id"</span>, <span class="string">"token"</span>, <span class="string">"email"</span>, <span class="string">"role"</span>, <span class="string">"status"</span>: <span class="string">"pending"</span>, <span class="string">"expires_at"</span> },
  <span class="string">"message"</span>: <span class="string">"Invitation created for new@hire.com"</span>
}
  </div>
</div>

<!-- Seat limits -->
<div class="callout">
  <div class="icon">&#128274;</div>
  <div class="text">
    <strong>Seat Limits by Plan Tier:</strong> Free = 1 seat &middot; Starter = 5 seats &middot; Growth = 25 seats &middot; Business = Unlimited. When the limit is reached, the API returns a <strong>403</strong> with a message to upgrade. The admin sees this in the UI as a disabled invite button.
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- 2. USER ROLES -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<div class="section-header">
  <span class="section-num">02</span>
  <span class="section-title">The 5 Account Types (Roles)</span>
  <span class="section-line"></span>
</div>

<p style="font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 8px; max-width: 800px; line-height: 1.7;">
  Every user has a <strong style="color:#fff">role</strong> stored in the <code style="font-family:'JetBrains Mono',monospace; font-size:11px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">users.role</code> column. The role determines what actions they can take <em>within</em> the features their plan unlocks.
</p>

<div class="roles-grid">
  <!-- Owner -->
  <div class="role-card owner">
    <span class="role-badge owner">&#128081; Owner</span>
    <h3>Owner</h3>
    <div class="role-desc">The account creator / org founder. Full platform control. Typically the CFO, CEO, or VP of Finance. Only one per org (though can be transferred).</div>
    <ul class="perm-list">
      <li><span class="check">&#10003;</span> Full read/write access to all views</li>
      <li><span class="check">&#10003;</span> Manage billing, upgrade/downgrade plans</li>
      <li><span class="check">&#10003;</span> Invite users, assign any role</li>
      <li><span class="check">&#10003;</span> Change other users' roles</li>
      <li><span class="check">&#10003;</span> Delete org, rotate API keys</li>
      <li><span class="check">&#10003;</span> Configure SSO/SAML, integrations</li>
      <li><span class="check">&#10003;</span> Access SOX audit trails</li>
      <li><span class="check">&#10003;</span> Export all data, generate compliance reports</li>
    </ul>
    <div style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.3);">Example: Alex Morgan — CEO & Founder</div>
  </div>

  <!-- Admin -->
  <div class="role-card admin">
    <span class="role-badge admin">&#128736; Admin</span>
    <h3>Admin</h3>
    <div class="role-desc">Trusted second-in-command. Can manage team and most settings. Cannot change billing or delete the org. Typically VP Finance or FP&A lead.</div>
    <ul class="perm-list">
      <li><span class="check">&#10003;</span> Full read/write access to all views</li>
      <li><span class="check">&#10003;</span> Invite users, assign roles (except Owner)</li>
      <li><span class="check">&#10003;</span> Configure integrations, Slack</li>
      <li><span class="check">&#10003;</span> Manage close tasks, approve workflows</li>
      <li><span class="check">&#10003;</span> Access audit trails</li>
      <li><span class="cross">&#10007;</span> Cannot change billing or plan</li>
      <li><span class="cross">&#10007;</span> Cannot delete organization</li>
      <li><span class="cross">&#10007;</span> Cannot change Owner's role</li>
    </ul>
    <div style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.3);">Example: Sarah Chen — VP of Finance</div>
  </div>

  <!-- Manager -->
  <div class="role-card manager">
    <span class="role-badge manager">&#128202; Manager</span>
    <h3>Manager</h3>
    <div class="role-desc">Department-level access. Can create and edit financial data, run scenarios, manage their team's close tasks. Cannot invite users or change settings.</div>
    <ul class="perm-list">
      <li><span class="check">&#10003;</span> Read/write P&L, forecasts, scenarios</li>
      <li><span class="check">&#10003;</span> Create and complete close tasks</li>
      <li><span class="check">&#10003;</span> Use AI Copilot</li>
      <li><span class="check">&#10003;</span> Export reports</li>
      <li><span class="partial">&#9679;</span> View-only on team management</li>
      <li><span class="cross">&#10007;</span> Cannot invite users</li>
      <li><span class="cross">&#10007;</span> Cannot configure integrations</li>
      <li><span class="cross">&#10007;</span> Cannot access SSO or audit settings</li>
    </ul>
    <div style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.3);">Example: Priya Patel — Controller</div>
  </div>

  <!-- Budget Owner -->
  <div class="role-card budget-owner">
    <span class="role-badge budget-owner">&#128176; Budget Owner</span>
    <h3>Budget Owner</h3>
    <div class="role-desc">Scoped to their department's budget and data. Can edit budgets they own, view P&L related to their dept, and manage their assigned close tasks.</div>
    <ul class="perm-list">
      <li><span class="check">&#10003;</span> Read/write their department's budgets</li>
      <li><span class="check">&#10003;</span> View P&L (filtered to their scope)</li>
      <li><span class="check">&#10003;</span> Complete their assigned close tasks</li>
      <li><span class="check">&#10003;</span> Use AI Copilot (scoped)</li>
      <li><span class="partial">&#9679;</span> Read-only on forecasts and scenarios</li>
      <li><span class="cross">&#10007;</span> Cannot modify org-wide data</li>
      <li><span class="cross">&#10007;</span> Cannot access admin console</li>
      <li><span class="cross">&#10007;</span> Cannot export full datasets</li>
    </ul>
    <div style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.3);">Example: James Rodriguez — Operations</div>
  </div>

  <!-- Viewer -->
  <div class="role-card viewer">
    <span class="role-badge viewer">&#128065; Viewer</span>
    <h3>Viewer</h3>
    <div class="role-desc">Read-only access. Sees dashboards and reports but cannot modify anything. Perfect for board members, investors, or cross-functional stakeholders.</div>
    <ul class="perm-list">
      <li><span class="check">&#10003;</span> View all dashboards (per plan tier)</li>
      <li><span class="check">&#10003;</span> View KPIs and reports</li>
      <li><span class="check">&#10003;</span> Use AI Copilot (read-only queries)</li>
      <li><span class="cross">&#10007;</span> Cannot edit any data</li>
      <li><span class="cross">&#10007;</span> Cannot create tasks or scenarios</li>
      <li><span class="cross">&#10007;</span> Cannot configure anything</li>
      <li><span class="cross">&#10007;</span> Cannot invite users</li>
      <li><span class="cross">&#10007;</span> Cannot export data</li>
    </ul>
    <div style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.3);">Example: David Kim — Revenue Analyst</div>
  </div>
</div>

<!-- Permission matrix table -->
<div class="section-header" style="margin-top: 36px;">
  <span class="section-num">02b</span>
  <span class="section-title">Full Permission Matrix</span>
  <span class="section-line"></span>
</div>

<div class="perm-matrix">
<table class="matrix">
  <thead>
    <tr>
      <th>Action</th>
      <th style="text-align:center">Owner</th>
      <th style="text-align:center">Admin</th>
      <th style="text-align:center">Manager</th>
      <th style="text-align:center">Budget Owner</th>
      <th style="text-align:center">Viewer</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>View Dashboard & KPIs</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td></tr>
    <tr><td>View P&L Statement</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-p">Dept Only</td><td class="perm-y">&#10003;</td></tr>
    <tr><td>Edit P&L / GL Transactions</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>Run Forecasts</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>Create Scenarios</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>Use AI Copilot</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-p">Scoped</td><td class="perm-p">Read-Only</td></tr>
    <tr><td>Manage Close Tasks</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-p">Own Tasks</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>Invite Team Members</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>Change User Roles</td><td class="perm-y">&#10003;</td><td class="perm-p">Non-Owner</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>Configure Integrations</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>Configure SSO/SAML</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>View Audit Trail</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>Manage Billing/Plan</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>Delete Organization</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>Export Data/Reports</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
    <tr><td>ML Model Configuration</td><td class="perm-y">&#10003;</td><td class="perm-y">&#10003;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td><td class="perm-n">&mdash;</td></tr>
  </tbody>
</table>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- 3. PLAN TIERS & FEATURE GATING -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<div class="section-header">
  <span class="section-num">03</span>
  <span class="section-title">Plan Tiers & What Each Dashboard Unlocks</span>
  <span class="section-line"></span>
</div>

<p style="font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 8px; max-width: 800px; line-height: 1.7;">
  The <strong style="color:#fff">plan tier</strong> (set at the org level via Stripe) determines which <em>views/features</em> appear in the sidebar. The <strong style="color:#fff">role</strong> determines what a user can <em>do</em> within those views. These are two separate layers of access control.
</p>

<div class="callout">
  <div class="icon">&#9889;</div>
  <div class="text">
    <strong>Two-Layer Access Model:</strong> Plan Tier (org-wide, from Stripe) controls <em>which sidebar items are accessible</em>. Role (per-user) controls <em>read/write/admin permissions</em> within those items. A Viewer on the Business plan sees all 17 views but can only read. An Owner on Free sees only the Dashboard overview but has full write access.
  </div>
</div>

<div class="tier-grid">
  <!-- Free -->
  <div class="tier-card">
    <div class="tier-name">Free Trial</div>
    <div class="tier-price">$0<span>/mo</span></div>
    <div class="tier-seats">1 seat &middot; 0 connectors</div>
    <div class="tier-features">
      <div class="feat"><span class="dot"></span>Dashboard Overview</div>
      <div class="feat locked"><span class="dot"></span>P&L Statement</div>
      <div class="feat locked"><span class="dot"></span>KPIs</div>
      <div class="feat locked"><span class="dot"></span>+ 14 more locked</div>
    </div>
  </div>
  <!-- Starter -->
  <div class="tier-card">
    <div class="tier-name">Starter</div>
    <div class="tier-price">$499<span>/mo</span></div>
    <div class="tier-seats">5 seats &middot; 5 connectors</div>
    <div class="tier-features">
      <div class="feat"><span class="dot"></span>Dashboard Overview</div>
      <div class="feat"><span class="dot"></span>P&L Statement</div>
      <div class="feat"><span class="dot"></span>Basic KPIs</div>
      <div class="feat"><span class="dot"></span>Integrations</div>
      <div class="feat"><span class="dot"></span>Email Support</div>
      <div class="feat locked"><span class="dot"></span>+ 12 more locked</div>
    </div>
  </div>
  <!-- Growth -->
  <div class="tier-card active">
    <div class="tier-name">Growth</div>
    <div class="tier-price">$999<span>/mo</span></div>
    <div class="tier-seats">25 seats &middot; 25 connectors</div>
    <div class="tier-features">
      <div class="feat"><span class="dot"></span>Everything in Starter</div>
      <div class="feat"><span class="dot"></span>AI Copilot</div>
      <div class="feat"><span class="dot"></span>Forecast Engine</div>
      <div class="feat"><span class="dot"></span>Scenario Modeling</div>
      <div class="feat"><span class="dot"></span>Multi-Entity Consolidation</div>
      <div class="feat"><span class="dot"></span>Slack Integration</div>
      <div class="feat locked"><span class="dot"></span>+ 7 more locked</div>
    </div>
  </div>
  <!-- Business -->
  <div class="tier-card">
    <div class="tier-name">Business</div>
    <div class="tier-price">$2,499<span>/mo</span></div>
    <div class="tier-seats">Unlimited seats</div>
    <div class="tier-features">
      <div class="feat"><span class="dot"></span>Everything in Growth</div>
      <div class="feat"><span class="dot"></span>Command Center</div>
      <div class="feat"><span class="dot"></span>Close Tasks</div>
      <div class="feat"><span class="dot"></span>Investor Metrics</div>
      <div class="feat"><span class="dot"></span>SOX Audit Trails</div>
      <div class="feat"><span class="dot"></span>SSO / SAML</div>
      <div class="feat"><span class="dot"></span>Custom ML Models</div>
      <div class="feat"><span class="dot"></span>Team Management</div>
    </div>
  </div>
</div>

<!-- Feature to View mapping -->
<div class="card">
  <div style="font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 12px;">VIEW_FEATURE_MAP — How sidebar views map to feature keys</div>
  <div class="code-block">
<span class="keyword">const</span> VIEW_FEATURE_MAP = {
  dashboard:       <span class="string">"dashboard_overview"</span>,  <span class="comment">// Free+</span>
  copilot:         <span class="string">"ai_copilot"</span>,         <span class="comment">// Growth+</span>
  pnl:             <span class="string">"pnl"</span>,                <span class="comment">// Starter+</span>
  forecast:        <span class="string">"forecast"</span>,           <span class="comment">// Growth+</span>
  consolidation:   <span class="string">"multi_entity"</span>,       <span class="comment">// Growth+</span>
  models:          <span class="string">"scenarios"</span>,          <span class="comment">// Growth+</span>
  close:           <span class="string">"close_tasks"</span>,        <span class="comment">// Business</span>
  team:            <span class="string">"team_management"</span>,    <span class="comment">// Business</span>
  integrations:    <span class="string">"integrations"</span>,       <span class="comment">// Starter+</span>
  admin:           <span class="string">"dashboard_overview"</span>,  <span class="comment">// Free+ (always visible)</span>
  investor:        <span class="string">"investor_metrics"</span>,   <span class="comment">// Business</span>
  command_center:  <span class="string">"command_center"</span>,     <span class="comment">// Business</span>
  audit:           <span class="string">"sox_audit"</span>,          <span class="comment">// Business</span>
  sso:             <span class="string">"sso"</span>,                <span class="comment">// Business</span>
  ml_models:       <span class="string">"custom_ml"</span>,          <span class="comment">// Business</span>
  settings:        <span class="string">"dashboard_overview"</span>,  <span class="comment">// Free+ (always visible)</span>
};
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- 4. DASHBOARD EXPERIENCES BY PLAN -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<div class="section-header">
  <span class="section-num">04</span>
  <span class="section-title">What Each Dashboard Looks Like Per Plan</span>
  <span class="section-line"></span>
</div>

<p style="font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 24px; max-width: 800px; line-height: 1.7;">
  When a user logs in, their sidebar shows all 17 nav items — but items outside their plan tier display a <strong style="color:#5b9cf5">lock badge</strong> with the required plan name. Clicking a locked item shows the <strong style="color:#a78bfa">UpgradePrompt</strong> instead of the view content.
</p>

<div class="dash-grid">
  <!-- Free Dashboard -->
  <div class="dash-mock">
    <div class="titlebar">
      <div class="dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      <div class="url">finance-os.app — Free Trial</div>
    </div>
    <div class="mock-body">
      <div style="font-size: 12px; font-weight: 800; color: #fff; margin-bottom: 10px;">Free Trial Dashboard</div>
      <div class="sidebar-mock">
        <div class="sidebar-items">
          <div class="nav-item active">&#9632; Dashboard</div>
          <div class="nav-item locked">&#128274; P&L <span class="lock-icon" style="color:#5b9cf5;font-size:7px">STARTER</span></div>
          <div class="nav-item locked">&#128274; Forecast <span class="lock-icon" style="color:#5b9cf5;font-size:7px">GROWTH</span></div>
          <div class="nav-item locked">&#128274; AI Copilot <span class="lock-icon" style="color:#5b9cf5;font-size:7px">GROWTH</span></div>
          <div class="nav-item locked">&#128274; Close Tasks <span class="lock-icon" style="color:#5b9cf5;font-size:7px">BIZ</span></div>
          <div class="nav-item">&#9881; Settings</div>
        </div>
        <div class="content-area">
          <div class="mock-kpi">
            <div class="kpi-box"><div class="kpi-val">—</div><div class="kpi-lbl">Revenue</div></div>
            <div class="kpi-box"><div class="kpi-val">—</div><div class="kpi-lbl">Expenses</div></div>
          </div>
          <div class="chart-placeholder">Connect a data source to get started</div>
        </div>
      </div>
      <div style="font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 10px; text-align: center;">1 seat &middot; 1 view unlocked &middot; Upgrade to access more</div>
    </div>
  </div>

  <!-- Starter Dashboard -->
  <div class="dash-mock">
    <div class="titlebar">
      <div class="dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      <div class="url">finance-os.app — Starter ($499/mo)</div>
    </div>
    <div class="mock-body">
      <div style="font-size: 12px; font-weight: 800; color: #fff; margin-bottom: 10px;">Starter Dashboard</div>
      <div class="sidebar-mock">
        <div class="sidebar-items">
          <div class="nav-item active">&#9632; Dashboard</div>
          <div class="nav-item">&#128196; P&L</div>
          <div class="nav-item">&#128200; KPIs</div>
          <div class="nav-item">&#128268; Integrations</div>
          <div class="nav-item locked">&#128274; Forecast <span class="lock-icon" style="color:#5b9cf5;font-size:7px">GROWTH</span></div>
          <div class="nav-item locked">&#128274; AI Copilot <span class="lock-icon" style="color:#5b9cf5;font-size:7px">GROWTH</span></div>
          <div class="nav-item">&#9881; Settings</div>
        </div>
        <div class="content-area">
          <div class="mock-kpi">
            <div class="kpi-box"><div class="kpi-val">$2.4M</div><div class="kpi-lbl">Revenue</div></div>
            <div class="kpi-box"><div class="kpi-val">$1.8M</div><div class="kpi-lbl">Expenses</div></div>
          </div>
          <div class="chart-placeholder">P&L chart &middot; GL data synced</div>
        </div>
      </div>
      <div style="font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 10px; text-align: center;">5 seats &middot; 5 views unlocked &middot; 5 connectors</div>
    </div>
  </div>

  <!-- Growth Dashboard -->
  <div class="dash-mock">
    <div class="titlebar">
      <div class="dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      <div class="url">finance-os.app — Growth ($999/mo)</div>
    </div>
    <div class="mock-body">
      <div style="font-size: 12px; font-weight: 800; color: #fff; margin-bottom: 10px;">Growth Dashboard</div>
      <div class="sidebar-mock">
        <div class="sidebar-items">
          <div class="nav-item active">&#9632; Dashboard</div>
          <div class="nav-item">&#129504; AI Copilot</div>
          <div class="nav-item">&#128196; P&L</div>
          <div class="nav-item">&#128200; Forecast</div>
          <div class="nav-item">&#128279; Consolidation</div>
          <div class="nav-item">&#127922; Scenarios</div>
          <div class="nav-item">&#128268; Integrations</div>
          <div class="nav-item locked">&#128274; Close Tasks <span class="lock-icon" style="color:#5b9cf5;font-size:7px">BIZ</span></div>
          <div class="nav-item locked">&#128274; SOX Audit <span class="lock-icon" style="color:#5b9cf5;font-size:7px">BIZ</span></div>
          <div class="nav-item">&#9881; Settings</div>
        </div>
        <div class="content-area">
          <div class="mock-kpi">
            <div class="kpi-box"><div class="kpi-val">$2.4M</div><div class="kpi-lbl">Revenue</div></div>
            <div class="kpi-box"><div class="kpi-val">62%</div><div class="kpi-lbl">Margin</div></div>
          </div>
          <div class="chart-placeholder">AI Forecast + Scenario Engine active</div>
        </div>
      </div>
      <div style="font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 10px; text-align: center;">25 seats &middot; 10 views unlocked &middot; Slack integration</div>
    </div>
  </div>

  <!-- Business Dashboard -->
  <div class="dash-mock">
    <div class="titlebar">
      <div class="dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      <div class="url">finance-os.app — Business ($2,499/mo)</div>
    </div>
    <div class="mock-body">
      <div style="font-size: 12px; font-weight: 800; color: #fff; margin-bottom: 10px;">Business Dashboard (Full Access)</div>
      <div class="sidebar-mock">
        <div class="sidebar-items">
          <div class="nav-item active">&#9632; Dashboard</div>
          <div class="nav-item">&#129504; AI Copilot</div>
          <div class="nav-item">&#128196; P&L</div>
          <div class="nav-item">&#128200; Forecast</div>
          <div class="nav-item">&#127922; Scenarios</div>
          <div class="nav-item">&#9745; Close Tasks</div>
          <div class="nav-item">&#128101; Team</div>
          <div class="nav-item">&#128737; Command Center</div>
          <div class="nav-item">&#127919; Investor</div>
          <div class="nav-item">&#128737; Audit Trail</div>
          <div class="nav-item">&#128274; SSO/SAML</div>
          <div class="nav-item">&#129302; ML Models</div>
          <div class="nav-item">&#9881; Settings</div>
        </div>
        <div class="content-area">
          <div class="mock-kpi">
            <div class="kpi-box"><div class="kpi-val">$2.4M</div><div class="kpi-lbl">Revenue</div></div>
            <div class="kpi-box"><div class="kpi-val">97%</div><div class="kpi-lbl">SOX Ready</div></div>
          </div>
          <div class="chart-placeholder">All 17 views unlocked &middot; Full platform</div>
        </div>
      </div>
      <div style="font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 10px; text-align: center;">Unlimited seats &middot; 17 views &middot; Dedicated CSM</div>
    </div>
  </div>
</div>

<!-- Locked view experience -->
<div class="card" style="margin-top: 16px;">
  <div style="font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 12px;">What Users See When They Click a Locked View</div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    <div>
      <div style="font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 10px;">Sidebar shows lock badge:</div>
      <div style="background: rgba(255,255,255,0.03); border-radius: 10px; padding: 12px;">
        <div style="font-size: 11px; padding: 7px 10px; border-radius: 6px; color: rgba(255,255,255,0.4); margin-bottom: 3px; display: flex; align-items: center; gap: 6px; background: rgba(91,156,245,0.06);">
          &#128200; Forecast
          <span style="margin-left: auto; font-size: 7px; font-weight: 800; padding: 1px 5px; border-radius: 4px; background: rgba(91,156,245,0.12); color: #5b9cf5; letter-spacing: 0.05em;">&#128274; GROWTH</span>
        </div>
        <div style="font-size: 10px; color: rgba(255,255,255,0.2); padding: 4px 10px;">The lock badge shows the minimum plan needed</div>
      </div>
    </div>
    <div>
      <div style="font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 10px;">Main area shows UpgradePrompt:</div>
      <div class="upgrade-overlay">
        <div class="lock-big">&#128274;</div>
        <h5>Unlock Forecast Engine</h5>
        <p>Available on the <strong style="color:#5b9cf5">Growth</strong> plan ($999/mo)</p>
        <button class="upgrade-btn">Upgrade to Growth</button>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- 5. HOW DASHBOARD LOADING WORKS -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<div class="section-header">
  <span class="section-num">05</span>
  <span class="section-title">How Dashboard Loading Works (Technical Flow)</span>
  <span class="section-line"></span>
</div>

<div class="card">
  <div style="font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 16px;">On Every Dashboard Load:</div>

  <div style="display: grid; grid-template-columns: 40px 1fr; gap: 0; row-gap: 0;">
    <!-- Step 1 -->
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #5b9cf5, #a78bfa); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono', monospace;">1</div>
      <div style="width: 2px; flex: 1; background: rgba(91,156,245,0.15);"></div>
    </div>
    <div style="padding: 4px 0 20px 16px;">
      <div style="font-size: 13px; font-weight: 700; color: #fff;">PlanProvider mounts</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 4px;">Wraps entire dashboard. Calls <code style="font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">GET /api/plan?email={user.email}</code> with <code style="font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">cache: "no-store"</code>. No caching — Stripe is checked every time.</div>
    </div>

    <!-- Step 2 -->
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #5b9cf5, #a78bfa); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono', monospace;">2</div>
      <div style="width: 2px; flex: 1; background: rgba(91,156,245,0.15);"></div>
    </div>
    <div style="padding: 4px 0 20px 16px;">
      <div style="font-size: 13px; font-weight: 700; color: #fff;">Stripe Checkpoint resolves plan</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 4px;">API route looks up user's email in Stripe customer list &rarr; checks active subscriptions &rarr; maps Stripe product ID to plan key via <code style="font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">PRODUCT_PLAN_MAP</code> &rarr; returns plan tier + feature list.</div>
    </div>

    <!-- Step 3 -->
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #5b9cf5, #a78bfa); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono', monospace;">3</div>
      <div style="width: 2px; flex: 1; background: rgba(91,156,245,0.15);"></div>
    </div>
    <div style="padding: 4px 0 20px 16px;">
      <div style="font-size: 13px; font-weight: 700; color: #fff;">PlanContext populated</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 4px;">React context stores: <code style="font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">{ plan, features[], loading, subscription }</code>. All child components can call <code style="font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">usePlan()</code> to read the current tier.</div>
    </div>

    <!-- Step 4 -->
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #5b9cf5, #a78bfa); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono', monospace;">4</div>
      <div style="width: 2px; flex: 1; background: rgba(91,156,245,0.15);"></div>
    </div>
    <div style="padding: 4px 0 20px 16px;">
      <div style="font-size: 13px; font-weight: 700; color: #fff;">Sidebar renders with lock badges</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 4px;">Each NAV_ITEM is checked via <code style="font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">canAccessView(verifiedPlan, item.id)</code>. If false, a lock badge appears with the required plan label from <code style="font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">requiredPlanForView(item.id)</code>.</div>
    </div>

    <!-- Step 5 -->
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #5b9cf5, #a78bfa); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono', monospace;">5</div>
      <div style="width: 2px; flex: 1; background: rgba(91,156,245,0.15);"></div>
    </div>
    <div style="padding: 4px 0 20px 16px;">
      <div style="font-size: 13px; font-weight: 700; color: #fff;">View content or UpgradePrompt renders</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 4px;">When a user clicks a nav item: if <code style="font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">canAccessView()</code> returns true &rarr; full view component renders. If false &rarr; <code style="font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">UpgradePromptInline</code> shows with the plan name + price + CTA to upgrade.</div>
    </div>

    <!-- Step 6 -->
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #34d399, #10b981); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono', monospace;">6</div>
    </div>
    <div style="padding: 4px 0 0 16px;">
      <div style="font-size: 13px; font-weight: 700; color: #fff;">Role-based write permissions applied</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 4px;">Within each unlocked view, the user's <code style="font-family:'JetBrains Mono',monospace; font-size:10px; background:rgba(91,156,245,0.1); padding:1px 5px; border-radius:3px; color:#a5b4fc">role</code> from the users table determines whether edit/create/delete buttons appear. Viewers see read-only. Budget Owners see scoped edit. Owners/Admins see everything.</div>
    </div>
  </div>
</div>

<!-- Stripe Product Mapping -->
<div class="card">
  <div style="font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 12px;">Stripe Product &rarr; Plan Mapping (Live)</div>
  <div class="code-block">
<span class="keyword">const</span> PRODUCT_PLAN_MAP = {
  <span class="string">"prod_U8tgVF7YBpllg3"</span>: <span class="string">"starter"</span>,   <span class="comment">// $499/mo</span>
  <span class="string">"prod_U8thZLVQ5TrvmI"</span>: <span class="string">"growth"</span>,    <span class="comment">// $999/mo</span>
  <span class="string">"prod_U8thcOFxz4Niy1"</span>: <span class="string">"business"</span>,  <span class="comment">// $2,499/mo</span>
};

<span class="comment">// No Stripe subscription → defaults to "free"</span>
<span class="comment">// Checked on EVERY page load (no caching)</span>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- 6. ROLE + PLAN COMBINATION EXAMPLES -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<div class="section-header">
  <span class="section-num">06</span>
  <span class="section-title">Role + Plan: Real-World Combinations</span>
  <span class="section-line"></span>
</div>

<table class="matrix">
  <thead>
    <tr>
      <th>User</th>
      <th>Role</th>
      <th>Org Plan</th>
      <th>Sidebar Views Available</th>
      <th>What They Can Do</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong style="color:#fff">Alex Morgan</strong><br><span style="font-size:10px;color:rgba(255,255,255,0.3)">CEO & Founder</span></td>
      <td><span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(167,139,250,0.12);color:#a78bfa">Owner</span></td>
      <td>Business</td>
      <td>All 17 views unlocked</td>
      <td>Full read/write, billing, SSO config, delete org, invite anyone</td>
    </tr>
    <tr>
      <td><strong style="color:#fff">Sarah Chen</strong><br><span style="font-size:10px;color:rgba(255,255,255,0.3)">VP of Finance</span></td>
      <td><span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(91,156,245,0.12);color:#5b9cf5">Admin</span></td>
      <td>Business</td>
      <td>All 17 views unlocked</td>
      <td>Full read/write, invite users, configure integrations. No billing.</td>
    </tr>
    <tr>
      <td><strong style="color:#fff">New Hire A</strong><br><span style="font-size:10px;color:rgba(255,255,255,0.3)">Financial Analyst</span></td>
      <td><span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(52,211,153,0.12);color:#34d399">Manager</span></td>
      <td>Growth</td>
      <td>10 views (Dashboard, Copilot, P&L, Forecast, Consolidation, Scenarios, Integrations, Admin, Intelligence, Settings)</td>
      <td>Read/write financials, run forecasts, create scenarios. No inviting, no team mgmt.</td>
    </tr>
    <tr>
      <td><strong style="color:#fff">New Hire B</strong><br><span style="font-size:10px;color:rgba(255,255,255,0.3)">Dept Controller</span></td>
      <td><span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(245,158,11,0.12);color:#f59e0b">Budget Owner</span></td>
      <td>Starter</td>
      <td>5 views (Dashboard, P&L, KPIs, Integrations, Settings)</td>
      <td>View dept P&L, edit dept budgets only. Read-only on everything else.</td>
    </tr>
    <tr>
      <td><strong style="color:#fff">Board Member</strong><br><span style="font-size:10px;color:rgba(255,255,255,0.3)">Investor / Advisor</span></td>
      <td><span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:rgba(148,163,184,0.12);color:#94a3b8">Viewer</span></td>
      <td>Business</td>
      <td>All 17 views unlocked (read-only)</td>
      <td>See everything. Edit nothing. No buttons for create, delete, or configure.</td>
    </tr>
  </tbody>
</table>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- 7. SUPABASE SCHEMA -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<div class="section-header">
  <span class="section-num">07</span>
  <span class="section-title">Database Schema (Supabase Tables)</span>
  <span class="section-line"></span>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
  <div class="card">
    <div style="font-size: 13px; font-weight: 800; color: #5b9cf5; margin-bottom: 8px;">users</div>
    <div class="code-block" style="font-size: 10px; line-height: 1.6;">
id          <span class="comment">uuid PK</span>
email       <span class="comment">text UNIQUE</span>
full_name   <span class="comment">text</span>
<span class="keyword">role</span>        <span class="comment">text (owner|admin|manager|budget_owner|viewer)</span>
org_id      <span class="comment">uuid FK → organizations</span>
avatar_url  <span class="comment">text</span>
last_sign_in_at <span class="comment">timestamptz</span>
created_at  <span class="comment">timestamptz</span>
    </div>
  </div>
  <div class="card">
    <div style="font-size: 13px; font-weight: 800; color: #5b9cf5; margin-bottom: 8px;">invitations</div>
    <div class="code-block" style="font-size: 10px; line-height: 1.6;">
id          <span class="comment">uuid PK</span>
org_id      <span class="comment">uuid FK → organizations</span>
invited_by  <span class="comment">uuid FK → users</span>
email       <span class="comment">text</span>
<span class="keyword">role</span>        <span class="comment">text (role to assign on accept)</span>
token       <span class="comment">uuid (unique accept link)</span>
status      <span class="comment">text (pending|accepted|expired)</span>
expires_at  <span class="comment">timestamptz (7 days from create)</span>
created_at  <span class="comment">timestamptz</span>
    </div>
  </div>
  <div class="card">
    <div style="font-size: 13px; font-weight: 800; color: #5b9cf5; margin-bottom: 8px;">organizations</div>
    <div class="code-block" style="font-size: 10px; line-height: 1.6;">
id          <span class="comment">uuid PK</span>
name        <span class="comment">text</span>
plan        <span class="comment">text (free|starter|growth|business)</span>
stripe_customer_id <span class="comment">text</span>
seats_used  <span class="comment">integer</span>
seats_limit <span class="comment">integer</span>
created_at  <span class="comment">timestamptz</span>
    </div>
  </div>
  <div class="card">
    <div style="font-size: 13px; font-weight: 800; color: #5b9cf5; margin-bottom: 8px;">audit_log</div>
    <div class="code-block" style="font-size: 10px; line-height: 1.6;">
id          <span class="comment">uuid PK</span>
org_id      <span class="comment">uuid FK → organizations</span>
user_id     <span class="comment">uuid FK → users</span>
action      <span class="comment">text (INVITE, CREATE, UPDATE, etc.)</span>
resource_type <span class="comment">text</span>
resource_id <span class="comment">text</span>
metadata    <span class="comment">jsonb</span>
ip_address  <span class="comment">text</span>
created_at  <span class="comment">timestamptz</span>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- FOOTER -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<div style="text-align: center; margin-top: 56px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.06);">
  <div style="font-size: 18px; font-weight: 800; background: linear-gradient(135deg, #5b9cf5, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">FinanceOS</div>
  <div style="font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 6px;">User Accounts & Role Architecture &middot; March 2026</div>
  <div style="font-size: 10px; color: rgba(255,255,255,0.15); margin-top: 4px;">Two-layer access: Plan tier (Stripe) &times; User role (Supabase) = Dashboard experience</div>
</div>

</div>
` }} />
    </>
  );
}
