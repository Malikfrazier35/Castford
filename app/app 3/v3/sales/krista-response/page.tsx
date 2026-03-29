'use client';

import { useEffect, useRef } from 'react';

export default function V3SalesKristaResponsePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `function showVersion(v){
  const styled=document.getElementById('styledVersion');
  const plain=document.getElementById('plainVersion');
  const btns=document.querySelectorAll('.version-btn');
  if(v==='styled'){
    styled.style.display='block';plain.style.display='none';
    btns[0].classList.add('active');btns[1].classList.remove('active');
  } else {
    styled.style.display='none';plain.style.display='block';
    btns[1].classList.add('active');btns[0].classList.remove('active');
  }
}`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*{margin:0;padding:0;box-sizing:border-box}
:root{
--bg:#060810;--surface:#0c1018;--card:#111620;--card2:#161d2c;
--border:#1a2035;--border2:#242e48;--text:#e2e8f0;--dim:#7b859c;--muted:#4e5670;
--accent:#5b9cf5;--green:#34d399;--red:#f87171;--amber:#fbbf24;--purple:#a78bfa;--cyan:#22d3ee;
--radius:12px;--ease:cubic-bezier(.4,0,.2,1);
}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:40px 20px}
::selection{background:rgba(91,156,245,.25)}

/* Email container */
.email-wrap{width:100%;max-width:680px}

/* Header bar */
.email-header{display:flex;align-items:center;justify-content:space-between;padding:16px 0;margin-bottom:24px;border-bottom:1px solid var(--border)}
.email-logo{display:flex;align-items:center;gap:10px}
.email-logo svg{width:28px;height:28px}
.email-logo span{font-size:18px;font-weight:800;background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.email-meta{text-align:right;font-size:11px;color:var(--muted)}

/* To/From bar */
.email-routing{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 20px;margin-bottom:24px}
.route-row{display:flex;align-items:center;gap:8px;font-size:13px;margin-bottom:6px}
.route-row:last-child{margin-bottom:0}
.route-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);min-width:48px}
.route-value{color:var(--dim)}
.route-value strong{color:var(--text);font-weight:600}
.route-tag{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;margin-left:8px}
.tag-priority{background:rgba(91,156,245,.08);color:var(--accent);border:1px solid rgba(91,156,245,.15)}
.tag-pharma{background:rgba(52,211,153,.08);color:var(--green);border:1px solid rgba(52,211,153,.15)}

/* Subject line */
.email-subject{font-size:22px;font-weight:800;letter-spacing:-.3px;margin-bottom:28px;line-height:1.3}

/* Email body */
.email-body{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}

.body-content{padding:32px}
.body-greeting{font-size:15px;color:var(--text);margin-bottom:20px;line-height:1.8}
.body-para{font-size:14px;color:var(--dim);line-height:1.85;margin-bottom:16px}
.body-para strong{color:var(--text);font-weight:600}

/* Pharma use-case cards */
.usecase-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:24px 0}
.usecase-card{background:var(--card2);border:1px solid var(--border);border-radius:10px;padding:16px;transition:all .3s var(--ease)}
.usecase-card:hover{border-color:var(--border2);transform:translateY(-1px)}
.usecase-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px}
.usecase-icon svg{width:18px;height:18px;stroke-width:1.5;fill:none}
.usecase-icon.blue{background:rgba(91,156,245,.08);border:1px solid rgba(91,156,245,.12)}
.usecase-icon.blue svg{stroke:var(--accent)}
.usecase-icon.green{background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.12)}
.usecase-icon.green svg{stroke:var(--green)}
.usecase-icon.purple{background:rgba(167,139,250,.08);border:1px solid rgba(167,139,250,.12)}
.usecase-icon.purple svg{stroke:var(--purple)}
.usecase-icon.cyan{background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.12)}
.usecase-icon.cyan svg{stroke:var(--cyan)}
.usecase-title{font-size:13px;font-weight:700;margin-bottom:4px}
.usecase-desc{font-size:11px;color:var(--dim);line-height:1.6}

/* Trial access card */
.trial-card{background:linear-gradient(135deg,rgba(91,156,245,.04),rgba(167,139,250,.02));border:1px solid rgba(91,156,245,.1);border-radius:var(--radius);padding:24px;margin:24px 0;text-align:center}
.trial-eyebrow{font-size:10px;font-weight:700;color:var(--accent);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}
.trial-title{font-size:18px;font-weight:800;margin-bottom:6px}
.trial-sub{font-size:13px;color:var(--dim);margin-bottom:20px;line-height:1.6}
.trial-features{display:flex;justify-content:center;gap:20px;margin-bottom:20px;flex-wrap:wrap}
.trial-feat{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dim)}
.trial-feat .dot{width:6px;height:6px;border-radius:50%;background:var(--green)}
.trial-cta{display:inline-flex;align-items:center;gap:10px;padding:14px 32px;border-radius:var(--radius);background:linear-gradient(135deg,var(--accent),var(--purple));color:#fff;font-size:15px;font-weight:700;text-decoration:none;transition:all .25s var(--ease);cursor:pointer;border:none}
.trial-cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(91,156,245,.25)}
.trial-cta svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}

/* Availability slots */
.slots-section{margin:24px 0}
.slots-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.slots-grid{display:flex;gap:8px;flex-wrap:wrap}
.slot{padding:8px 16px;border-radius:8px;background:var(--card2);border:1px solid var(--border);font-size:12px;font-weight:600;color:var(--dim);cursor:pointer;transition:all .2s var(--ease)}
.slot:hover{border-color:var(--accent);color:var(--accent);background:rgba(91,156,245,.04)}
.slot .slot-day{display:block;font-size:10px;color:var(--muted);font-weight:400;margin-bottom:2px}

/* Sign-off */
.signoff{margin-top:24px;padding-top:20px;border-top:1px solid var(--border)}
.signoff-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px}
.signoff-title{font-size:12px;color:var(--dim)}
.signoff-company{font-size:12px;color:var(--accent);margin-top:2px}

/* Footer */
.email-footer{padding:20px 32px;border-top:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:space-between}
.footer-sec{display:flex;align-items:center;gap:6px;font-size:10px;color:var(--muted)}
.footer-sec svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2}
.footer-links{display:flex;gap:12px}
.footer-links a{font-size:10px;color:var(--muted);text-decoration:none}
.footer-links a:hover{color:var(--accent)}

/* Plain text version toggle */
.version-toggle{display:flex;justify-content:flex-end;margin-bottom:16px}
.version-btn{padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;border:1px solid var(--border);background:var(--card);color:var(--dim);cursor:pointer;transition:all .2s}
.version-btn.active{background:var(--accent);border-color:var(--accent);color:#fff}

/* Plain text */
.plain-text{display:none;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:32px;font-family:'SF Mono','Fira Code','Courier New',monospace;font-size:13px;color:var(--dim);line-height:1.9;white-space:pre-wrap}

@media(max-width:640px){
  .usecase-grid{grid-template-columns:1fr}
  .trial-features{flex-direction:column;align-items:center;gap:10px}
  .slots-grid{flex-direction:column}
  .email-footer{flex-direction:column;gap:10px;text-align:center}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<div class="email-wrap">

<!-- Header -->
<div class="email-header">
  <div class="email-logo">
    <svg viewBox="0 0 28 28" fill="none"><rect x="2" y="2" width="24" height="24" rx="6" stroke="url(#el)" stroke-width="2"/><path d="M8 19V14M12 19V11M16 19V15M20 19V9" stroke="url(#el)" stroke-width="2" stroke-linecap="round"/><defs><linearGradient id="el" x1="0" y1="0" x2="28" y2="28"><stop stop-color="#5b9cf5"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs></svg>
    <span>FinanceOS</span>
  </div>
  <div class="email-meta">Draft — March 25, 2026<br>Outbound · Personal Follow-Up</div>
</div>

<!-- Routing -->
<div class="email-routing">
  <div class="route-row">
    <span class="route-label">To</span>
    <span class="route-value"><strong>Krista Lumpkin</strong> &lt;kristalumpkin@yahoo.com&gt; <span class="route-tag tag-pharma">Pharma</span></span>
  </div>
  <div class="route-row">
    <span class="route-label">From</span>
    <span class="route-value"><strong>Malik Frazier</strong> &lt;malik@finance-os.app&gt;</span>
  </div>
  <div class="route-row">
    <span class="route-label">Re</span>
    <span class="route-value">Your FinanceOS trial request <span class="route-tag tag-priority">High Intent</span></span>
  </div>
</div>

<!-- Subject -->
<div class="email-subject">Krista — your FinanceOS trial is ready, and I built something specific for pharma</div>

<!-- Toggle -->
<div class="version-toggle">
  <button class="version-btn active" onclick="showVersion('styled')">Styled</button>
  <button class="version-btn" onclick="showVersion('plain')" style="margin-left:4px">Plain Text</button>
</div>

<!-- Styled email body -->
<div class="email-body" id="styledVersion">
  <div class="body-content">

    <div class="body-greeting">Hi Krista,</div>

    <p class="body-para">Thank you for signing up — I saw your trial request come through and wanted to reach out personally rather than drop you into an automated sequence. When someone in pharma asks for trial access, that tells me you're dealing with something specific, and I'd rather understand what that is than hand you a generic demo.</p>

    <p class="body-para">FinanceOS is a financial intelligence platform that gives finance teams a real-time operating layer on top of their ERP — consolidation, treasury, scenario modeling, and AI-powered reporting, all in one view. We're seeing a lot of traction in <strong>life sciences and pharma</strong> specifically because the financial complexity in your industry is unique:</p>

    <div class="usecase-grid">
      <div class="usecase-card">
        <div class="usecase-icon blue"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
        <div class="usecase-title">Multi-Entity Clinical Budgets</div>
        <div class="usecase-desc">Track R&D spend across entities, trials, and therapeutic areas with real-time consolidation and IC elimination.</div>
      </div>
      <div class="usecase-card">
        <div class="usecase-icon green"><svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
        <div class="usecase-title">Cash Burn & Runway Modeling</div>
        <div class="usecase-desc">13-week rolling cash forecast with scenario modeling for trial enrollment rates, milestone payments, and FDA timelines.</div>
      </div>
      <div class="usecase-card">
        <div class="usecase-icon purple"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
        <div class="usecase-title">Board & Investor Reporting</div>
        <div class="usecase-desc">One-click board decks with audit-ready financials, pipeline valuations, and compliance-grade formatting.</div>
      </div>
      <div class="usecase-card">
        <div class="usecase-icon cyan"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
        <div class="usecase-title">GxP & SOX Compliance</div>
        <div class="usecase-desc">Full audit trail, role-based access, SOC 2 Type II certified infrastructure with 21 CFR Part 11 considerations.</div>
      </div>
    </div>

    <p class="body-para">I don't know yet whether you're at a biotech managing burn rate through Phase II, or at a large pharma house consolidating across 50 entities — and the right starting point for you depends on that. So rather than giving you a self-serve login where you'd be guessing at configuration, I'd like to set up a <strong>15-minute call</strong> where I can understand your stack and show you the exact view that would matter to your team.</p>

    <div class="trial-card">
      <div class="trial-eyebrow">What Your Trial Includes</div>
      <div class="trial-title">14-Day Guided Evaluation</div>
      <div class="trial-sub">Full platform access with a dedicated onboarding specialist who configures your environment to match your chart of accounts and reporting structure.</div>
      <div class="trial-features">
        <div class="trial-feat"><span class="dot"></span> Live data connection to your ERP</div>
        <div class="trial-feat"><span class="dot"></span> Pre-built pharma dashboards</div>
        <div class="trial-feat"><span class="dot"></span> AI Copilot enabled</div>
        <div class="trial-feat"><span class="dot"></span> Dedicated Slack channel</div>
      </div>
      <button class="trial-cta" onclick="window.open('#','_blank')">
        Schedule Your Intro Call
        <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

    <div class="slots-section">
      <div class="slots-label">I have openings this week:</div>
      <div class="slots-grid">
        <div class="slot"><span class="slot-day">Wednesday</span>2:00 PM ET</div>
        <div class="slot"><span class="slot-day">Thursday</span>10:30 AM ET</div>
        <div class="slot"><span class="slot-day">Thursday</span>3:00 PM ET</div>
        <div class="slot"><span class="slot-day">Friday</span>11:00 AM ET</div>
        <div class="slot"><span class="slot-day">Friday</span>1:30 PM ET</div>
      </div>
    </div>

    <p class="body-para">If none of those work, feel free to reply with a time that does — or if you'd prefer to skip the call and go straight to exploring, I can send you a pre-configured environment with pharma templates loaded. Either way, I want to make sure you're seeing the right thing from day one.</p>

    <p class="body-para">Looking forward to connecting.</p>

    <div class="signoff">
      <div class="signoff-name">Malik Frazier</div>
      <div class="signoff-title">Founder & CEO</div>
      <div class="signoff-company">FinanceOS · finance-os.app</div>
    </div>

  </div>

  <div class="email-footer">
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <span class="footer-sec"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>SOC 2 Type II</span>
      <span class="footer-sec"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>AES-256</span>
      <span class="footer-sec"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>HIPAA Aware</span>
    </div>
    <div class="footer-links">
      <a href="#">Privacy</a>
      <a href="#">Security</a>
      <a href="#">Unsubscribe</a>
    </div>
  </div>
</div>

<!-- Plain text version (for copy/paste into Gmail) -->
<div class="plain-text" id="plainVersion">Hi Krista,

Thank you for signing up — I saw your trial request come through and wanted to reach out personally rather than drop you into an automated sequence. When someone in pharma asks for trial access, that tells me you're dealing with something specific, and I'd rather understand what that is than hand you a generic demo.

FinanceOS is a financial intelligence platform that gives finance teams a real-time operating layer on top of their ERP — consolidation, treasury, scenario modeling, and AI-powered reporting, all in one view. We're seeing a lot of traction in life sciences and pharma specifically because the financial complexity in your industry is unique:

→ Multi-Entity Clinical Budgets — Track R&D spend across entities, trials, and therapeutic areas with real-time consolidation.

→ Cash Burn & Runway Modeling — 13-week rolling cash forecast with scenario modeling for trial enrollment rates, milestone payments, and FDA timelines.

→ Board & Investor Reporting — One-click board decks with audit-ready financials and compliance-grade formatting.

→ GxP & SOX Compliance — Full audit trail, role-based access, SOC 2 Type II certified with 21 CFR Part 11 considerations.

I don't know yet whether you're at a biotech managing burn rate through Phase II, or at a large pharma house consolidating across 50 entities — and the right starting point depends on that. So rather than giving you a self-serve login where you'd be guessing at configuration, I'd like to set up a 15-minute call where I can understand your stack and show you the exact view that would matter to your team.

Your trial includes:
• 14-day guided evaluation with full platform access
• Live data connection to your ERP
• Pre-built pharma dashboards
• AI Copilot enabled
• Dedicated Slack channel

I have openings this week:
- Wednesday, 2:00 PM ET
- Thursday, 10:30 AM ET
- Thursday, 3:00 PM ET
- Friday, 11:00 AM ET
- Friday, 1:30 PM ET

If none of those work, reply with a time that does — or if you'd prefer to skip the call and go straight to exploring, I can send you a pre-configured environment with pharma templates loaded. Either way, I want to make sure you're seeing the right thing from day one.

Looking forward to connecting.

Malik Frazier
Founder & CEO
FinanceOS · finance-os.app</div>

</div>


` }} />
    </>
  );
}
