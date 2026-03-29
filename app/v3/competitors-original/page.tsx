'use client';

import { useEffect, useRef } from 'react';

export default function V3CompetitorsOriginalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target);}});},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#F8FAFC;--green:#10B981;--cyan:#22D3EE;--purple:#8B5CF6;--blue:#3B82F6;--amber:#F59E0B;--red:#EF4444;--t1:#0F172A;--t2:#334155;--t3:#64748B;--t4:#94A3B8;--border:#E2E8F0;--radius:16px;--font:'DM Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;--ease:cubic-bezier(0.16,1,0.3,1);}
body{font-family:var(--font);color:var(--t1);-webkit-font-smoothing:antialiased;background:#fff;overflow-x:hidden;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes colorCycle{0%{color:#22D3EE}20%{color:#8B5CF6}40%{color:#10B981}60%{color:#3B82F6}80%{color:#F59E0B}100%{color:#22D3EE}}
@keyframes bgColorCycle{0%{background-color:rgba(34,211,238,0.08)}20%{background-color:rgba(139,92,246,0.08)}40%{background-color:rgba(16,185,129,0.08)}60%{background-color:rgba(59,130,246,0.08)}80%{background-color:rgba(245,158,11,0.08)}100%{background-color:rgba(34,211,238,0.08)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(34,211,238,0.1)}50%{box-shadow:0 0 40px rgba(139,92,246,0.15)}}
@keyframes borderGlow{0%{border-color:rgba(34,211,238,0.2)}33%{border-color:rgba(139,92,246,0.2)}66%{border-color:rgba(16,185,129,0.2)}100%{border-color:rgba(34,211,238,0.2)}}
@keyframes typeCursor{0%,100%{opacity:1}50%{opacity:0}}
.reveal{opacity:0;transform:translateY(24px);transition:all 0.6s var(--ease);}.reveal.vis{opacity:1;transform:none;}
.color-shift{animation:colorCycle 8s ease infinite;}

/* NAV */
.nav{position:sticky;top:0;z-index:100;padding:0 40px;height:64px;display:flex;align-items:center;background:rgba(3,7,17,0.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.05);}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
.nav-logo svg{width:32px;height:32px;}
.nav-logo span{font-size:17px;font-weight:800;color:#fff;letter-spacing:-0.03em;}
.nav-links{display:flex;gap:6px;margin-left:50px;}
.nav-item{position:relative;}
.nav-item>a{font-size:13px;font-weight:500;color:rgba(255,255,255,0.5);text-decoration:none;padding:8px 14px;border-radius:8px;transition:all 0.2s;display:flex;align-items:center;gap:4px;}
.nav-item>a:hover,.nav-item>a.active{color:#fff;background:rgba(255,255,255,0.06);}
.nav-item>a svg{width:10px;height:10px;stroke:currentColor;fill:none;stroke-width:2.5;opacity:0.5;}
.dropdown{position:absolute;top:100%;left:0;min-width:220px;background:#0F172A;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:8px;opacity:0;visibility:hidden;transform:translateY(8px);transition:all 0.25s var(--ease);box-shadow:0 20px 60px rgba(0,0,0,0.4);}
.nav-item:hover .dropdown{opacity:1;visibility:visible;transform:translateY(4px);}
.dropdown a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;font-size:12px;font-weight:500;color:rgba(255,255,255,0.6);text-decoration:none;transition:all 0.15s;}
.dropdown a:hover{background:rgba(255,255,255,0.06);color:#fff;}
.dropdown a .dd-icon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.dropdown a .dd-icon svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.5;}
.dd-sep{height:1px;background:rgba(255,255,255,0.06);margin:4px 0;}
.nav-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.btn-ghost{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid rgba(255,255,255,0.12);background:transparent;color:rgba(255,255,255,0.7);cursor:pointer;transition:all 0.2s;text-decoration:none;}.btn-ghost:hover{color:#fff;}
.btn-primary{padding:8px 22px;border-radius:8px;font-size:13px;font-weight:700;border:none;background:var(--green);color:#fff;cursor:pointer;transition:all 0.25s var(--ease);text-decoration:none;}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(16,185,129,0.25);}

/* HERO */
.hero{padding:100px 40px 80px;background:linear-gradient(135deg,#030711,#1E1B4B,#0F172A);background-size:300% 300%;animation:gradientShift 12s ease infinite;text-align:center;color:#fff;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-300px;left:50%;transform:translateX(-50%);width:1000px;height:1000px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,0.06),transparent 60%);pointer-events:none;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);color:var(--purple);margin-bottom:20px;}
.hero-badge .dot{width:8px;height:8px;border-radius:50%;background:var(--purple);animation:typeCursor 2s ease infinite;}
.hero h1{font-size:clamp(36px,5.5vw,56px);font-weight:900;letter-spacing:-0.04em;line-height:1.1;margin-bottom:16px;}
.hero h1 .accent{background:linear-gradient(135deg,var(--cyan),var(--purple),var(--green),var(--blue));background-size:300% 300%;animation:gradientShift 6s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero p{font-size:18px;color:rgba(255,255,255,0.45);max-width:620px;margin:0 auto 32px;line-height:1.65;}
.hero-cta{display:inline-flex;gap:12px;flex-wrap:wrap;justify-content:center;}
.hero-cta a{padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;transition:all 0.25s var(--ease);}
.hero-cta .cta-primary{background:var(--green);color:#fff;}.hero-cta .cta-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(16,185,129,0.3);}
.hero-cta .cta-outline{border:1px solid rgba(255,255,255,0.15);color:#fff;}.hero-cta .cta-outline:hover{background:rgba(255,255,255,0.05);}

/* SECTIONS */
.section{max-width:1200px;margin:0 auto;padding:80px 40px;}
.section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--green);text-align:center;margin-bottom:12px;}
.section-title{font-size:clamp(28px,3.5vw,42px);font-weight:900;text-align:center;letter-spacing:-0.03em;margin-bottom:14px;}
.section-sub{font-size:16px;color:var(--t3);text-align:center;max-width:580px;margin:0 auto 50px;line-height:1.6;}

/* COMPARISON TABLE */
.comp-wrap{overflow-x:auto;border-radius:20px;border:1px solid var(--border);background:#fff;}
table.comp{width:100%;border-collapse:collapse;min-width:900px;}
table.comp thead th{padding:16px 14px;font-size:12px;font-weight:700;text-align:center;border-bottom:2px solid var(--border);background:var(--bg);white-space:nowrap;}
table.comp thead th:first-child{text-align:left;padding-left:24px;width:220px;}
table.comp thead th.hl{background:linear-gradient(135deg,rgba(16,185,129,0.06),rgba(34,211,238,0.06));border-bottom-color:var(--green);position:relative;}
table.comp thead th.hl::after{content:'RECOMMENDED';position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--green);color:#fff;font-size:8px;font-weight:800;letter-spacing:0.06em;padding:3px 10px;border-radius:0 0 6px 6px;}
table.comp tbody td{padding:14px;font-size:13px;font-weight:500;text-align:center;border-bottom:1px solid var(--border);color:var(--t2);}
table.comp tbody td:first-child{text-align:left;padding-left:24px;font-weight:700;color:var(--t1);}
table.comp tbody td.hl{background:rgba(16,185,129,0.02);}
table.comp tbody tr:last-child td{border-bottom:none;}
table.comp tbody tr:hover{background:rgba(16,185,129,0.015);}
.check{color:var(--green);font-weight:800;font-size:16px;}
.cross{color:var(--red);font-weight:800;font-size:16px;opacity:0.5;}
.partial{color:var(--amber);font-weight:700;font-size:11px;}
.imp-time{font-family:var(--mono);font-size:12px;font-weight:600;}
.price-cell{font-family:var(--mono);font-size:12px;font-weight:700;}
.price-cell.green{color:var(--green);}

/* HEAD TO HEAD */
.h2h-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
.h2h-card{background:#fff;border:1px solid var(--border);border-radius:20px;padding:32px;transition:all 0.3s var(--ease);overflow:hidden;position:relative;}
.h2h-card:hover{transform:translateY(-4px);box-shadow:0 16px 50px rgba(0,0,0,0.06);}
.h2h-card:last-child:nth-child(odd){grid-column:1/-1;max-width:calc(50% - 12px);justify-self:center;}
.h2h-vs{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:var(--purple);margin-bottom:8px;}
.h2h-card h3{font-size:20px;font-weight:900;letter-spacing:-0.02em;margin-bottom:6px;}
.h2h-card .h2h-tagline{font-size:13px;color:var(--t3);font-style:italic;margin-bottom:20px;line-height:1.5;}
.h2h-section{margin-bottom:16px;}
.h2h-section-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;display:flex;align-items:center;gap:6px;}
.h2h-section-title.their{color:var(--t4);}
.h2h-section-title.ours{color:var(--green);}
.h2h-list{list-style:none;display:flex;flex-direction:column;gap:6px;}
.h2h-list li{display:flex;align-items:flex-start;gap:8px;font-size:12px;font-weight:500;color:var(--t2);line-height:1.5;}
.h2h-list li svg{width:14px;height:14px;flex-shrink:0;margin-top:2px;}
.h2h-list.their li svg{stroke:var(--t4);fill:none;stroke-width:2;}
.h2h-list.ours li svg{stroke:var(--green);fill:none;stroke-width:2.5;}

/* STATS */
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
.stat-card{background:linear-gradient(135deg,#0F172A,#1E1B4B);border-radius:20px;padding:40px 28px;text-align:center;color:#fff;animation:glowPulse 4s ease infinite;}
.stat-card .stat-num{font-size:48px;font-weight:900;font-family:var(--mono);letter-spacing:-0.04em;margin-bottom:8px;background:linear-gradient(135deg,var(--cyan),var(--green));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.stat-card .stat-label{font-size:14px;font-weight:600;color:rgba(255,255,255,0.5);}
.stat-card .stat-detail{font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;}

/* MIGRATION */
.mig-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;position:relative;}
.mig-steps::before{content:'';position:absolute;top:44px;left:12%;right:12%;height:2px;background:linear-gradient(90deg,var(--cyan),var(--purple),var(--green),var(--blue));border-radius:2px;z-index:0;}
.mig-step{text-align:center;position:relative;z-index:1;}
.mig-num{width:88px;height:88px;border-radius:50%;background:#fff;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;font-weight:900;font-family:var(--mono);color:var(--t1);transition:all 0.3s;}
.mig-step:hover .mig-num{border-color:var(--green);box-shadow:0 8px 30px rgba(16,185,129,0.1);}
.mig-step h4{font-size:15px;font-weight:800;margin-bottom:6px;}
.mig-step p{font-size:12px;color:var(--t3);line-height:1.5;max-width:200px;margin:0 auto;}

/* BOTTOM CTA */
.bottom-cta{padding:80px 40px;text-align:center;background:var(--bg);}
.bottom-cta h2{font-size:clamp(28px,4vw,44px);font-weight:900;letter-spacing:-0.03em;margin-bottom:14px;}
.bottom-cta p{font-size:16px;color:var(--t3);max-width:520px;margin:0 auto 32px;line-height:1.6;}
.bottom-cta .cta-row{display:inline-flex;gap:12px;flex-wrap:wrap;justify-content:center;}
.bottom-cta .cta-row a{padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;transition:all 0.25s var(--ease);}
.cta-green{background:var(--green);color:#fff;}.cta-green:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(16,185,129,0.3);}
.cta-dark{background:var(--t1);color:#fff;}.cta-dark:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.15);}

/* FOOTER */
.footer{padding:60px 40px 30px;border-top:1px solid var(--border);max-width:1100px;margin:0 auto;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px;}
.footer-brand p{font-size:13px;color:var(--t3);line-height:1.6;margin-top:12px;max-width:260px;}
.footer-col h4{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--t4);margin-bottom:14px;}
.footer-col a{display:block;font-size:13px;font-weight:500;color:var(--t3);text-decoration:none;padding:4px 0;transition:color 0.2s;}.footer-col a:hover{color:var(--t1);}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid var(--border);font-size:12px;color:var(--t4);}

@media(max-width:768px){
.nav-links,.dropdown{display:none;}
.h2h-grid,.stats-row{grid-template-columns:1fr;}
.mig-steps{grid-template-columns:1fr 1fr;}
.mig-steps::before{display:none;}
.h2h-card:last-child:nth-child(odd){max-width:100%;}
.footer-grid{grid-template-columns:1fr 1fr;}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- NAV -->
<nav class="nav">
<a href="FinanceOS-Landing-Page.html" class="nav-logo">
<svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#10B981"/><path d="M8 12h10M8 16h14M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="12" r="3" fill="#22D3EE"/></svg>
<span>FinanceOS</span>
</a>
<div class="nav-links">
<div class="nav-item"><a href="#">Solutions <svg viewBox="0 0 10 10"><polyline points="2,3.5 5,6.5 8,3.5"/></svg></a>
<div class="dropdown">
<a href="FinanceOS-Whats-New.html"><div class="dd-icon" style="background:rgba(139,92,246,0.1);color:var(--purple)"><svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 015 5c0 3-2 5.5-5 8.5C9 12.5 7 10 7 7a5 5 0 015-5z"/></svg></div>AI Copilot</a>
<a href="FinanceOS-Whats-New.html"><div class="dd-icon" style="background:rgba(34,211,238,0.1);color:var(--cyan)"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></div>Consolidation</a>
<a href="FinanceOS-Whats-New.html"><div class="dd-icon" style="background:rgba(245,158,11,0.1);color:var(--amber)"><svg viewBox="0 0 24 24"><path d="M12 9v4l3 3"/><circle cx="12" cy="12" r="9"/></svg></div>Variance Detection</a>
<a href="FinanceOS-Whats-New.html"><div class="dd-icon" style="background:rgba(59,130,246,0.1);color:var(--blue)"><svg viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg></div>Scenario Modeling</a>
<div class="dd-sep"></div>
<a href="FinanceOS-Whats-New.html"><div class="dd-icon" style="background:rgba(16,185,129,0.1);color:var(--green)"><svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg></div>Compliance</a>
</div>
</div>
<div class="nav-item"><a href="#">Resources <svg viewBox="0 0 10 10"><polyline points="2,3.5 5,6.5 8,3.5"/></svg></a>
<div class="dropdown">
<a href="FinanceOS-Resources.html"><div class="dd-icon" style="background:rgba(59,130,246,0.1);color:var(--blue)"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></div>Blog &amp; Guides</a>
<a href="FinanceOS-Whats-New.html"><div class="dd-icon" style="background:rgba(139,92,246,0.1);color:var(--purple)"><svg viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg></div>What's New</a>
<a href="FinanceOS-Integrations.html"><div class="dd-icon" style="background:rgba(34,211,238,0.1);color:var(--cyan)"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>Integrations</a>
<a href="FinanceOS-vs-Competitors.html"><div class="dd-icon" style="background:rgba(16,185,129,0.1);color:var(--green)"><svg viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div>Compare</a>
</div>
</div>
<div class="nav-item"><a href="FinanceOS-Pricing-Page.html">Pricing</a></div>
<div class="nav-item"><a href="FinanceOS-About.html">About</a></div>
</div>
<div class="nav-right">
<a href="FinanceOS-Login.html" class="btn-ghost">Sign In</a>
<a href="FinanceOS-Login.html" class="btn-primary">Get Started</a>
</div>
</nav>

<!-- HERO -->
<section class="hero">
<div class="hero-badge"><span class="dot"></span> The Smarter Alternative</div>
<h1>How <span class="accent">FinanceOS</span> Compares</h1>
<p>See why modern finance teams are switching from legacy enterprise platforms. Transparent pricing, AI-native architecture, and weeks-not-months implementation.</p>
<div class="hero-cta">
<a href="#" class="cta-primary">Request Demo</a>
<a href="FinanceOS-Pricing-Page.html" class="cta-outline">View Pricing</a>
</div>
</section>

<!-- COMPARISON TABLE -->
<section class="section reveal">
<div class="section-label">Feature Comparison</div>
<h2 class="section-title">Side-by-Side Overview</h2>
<p class="section-sub">An honest look at how FinanceOS stacks up against the enterprise incumbents across the categories that matter most.</p>
<div class="comp-wrap">
<table class="comp">
<thead>
<tr>
<th>Capability</th>
<th class="hl">FinanceOS</th>
<th>Anaplan</th>
<th>Adaptive (Workday)</th>
<th>Planful</th>
<th>Vena</th>
<th>Oracle EPM</th>
</tr>
</thead>
<tbody>
<tr>
<td>AI-Native Architecture</td>
<td class="hl"><span class="check">&#10003;</span> Built-in</td>
<td><span class="partial">Bolt-on</span></td>
<td><span class="partial">Bolt-on</span></td>
<td><span class="cross">&#10007;</span></td>
<td><span class="cross">&#10007;</span></td>
<td><span class="partial">Bolt-on</span></td>
</tr>
<tr>
<td>Real-Time Consolidation</td>
<td class="hl"><span class="check">&#10003;</span> Sub-second</td>
<td><span class="partial">Batch</span></td>
<td><span class="partial">Near-real-time</span></td>
<td><span class="partial">Batch</span></td>
<td><span class="cross">&#10007;</span></td>
<td><span class="check">&#10003;</span></td>
</tr>
<tr>
<td>Natural Language AI Copilot</td>
<td class="hl"><span class="check">&#10003;</span> Full NLP</td>
<td><span class="partial">Basic</span></td>
<td><span class="cross">&#10007;</span></td>
<td><span class="cross">&#10007;</span></td>
<td><span class="cross">&#10007;</span></td>
<td><span class="partial">Limited</span></td>
</tr>
<tr>
<td>No-Code Scenario Modeling</td>
<td class="hl"><span class="check">&#10003;</span></td>
<td><span class="partial">Needs training</span></td>
<td><span class="partial">Partial</span></td>
<td><span class="partial">Limited</span></td>
<td><span class="partial">Excel-based</span></td>
<td><span class="partial">Complex</span></td>
</tr>
<tr>
<td>Pre-Built Integrations</td>
<td class="hl"><span class="check">&#10003;</span> 50+</td>
<td><span class="check">&#10003;</span> 40+</td>
<td><span class="partial">Workday-focused</span></td>
<td><span class="check">&#10003;</span> 30+</td>
<td><span class="partial">20+</span></td>
<td><span class="partial">Oracle-focused</span></td>
</tr>
<tr>
<td>SOX Compliance Automation</td>
<td class="hl"><span class="check">&#10003;</span> SOX 404</td>
<td><span class="partial">Manual</span></td>
<td><span class="partial">Partial</span></td>
<td><span class="check">&#10003;</span></td>
<td><span class="partial">Manual</span></td>
<td><span class="check">&#10003;</span></td>
</tr>
<tr>
<td>Implementation Time</td>
<td class="hl"><span class="imp-time" style="color:var(--green)">2–4 weeks</span></td>
<td><span class="imp-time">3–6 months</span></td>
<td><span class="imp-time">2–4 months</span></td>
<td><span class="imp-time">1–3 months</span></td>
<td><span class="imp-time">1–2 months</span></td>
<td><span class="imp-time">6–12 months</span></td>
</tr>
<tr>
<td>Starting Price</td>
<td class="hl"><span class="price-cell green">$799/mo</span></td>
<td><span class="price-cell">$100K+/yr</span></td>
<td><span class="price-cell">$75K+/yr</span></td>
<td><span class="price-cell">$50K+/yr</span></td>
<td><span class="price-cell">$40K+/yr</span></td>
<td><span class="price-cell">$150K+/yr</span></td>
</tr>
<tr>
<td>Money-Back Guarantee</td>
<td class="hl"><span class="check">&#10003;</span> 30 days</td>
<td><span class="cross">&#10007;</span></td>
<td><span class="cross">&#10007;</span></td>
<td><span class="cross">&#10007;</span></td>
<td><span class="cross">&#10007;</span></td>
<td><span class="cross">&#10007;</span></td>
</tr>
</tbody>
</table>
</div>
</section>

<!-- HEAD TO HEAD -->
<section class="section reveal" style="background:var(--bg);max-width:100%;"><div style="max-width:1200px;margin:0 auto;padding:0 40px;">
<div class="section-label">Head-to-Head</div>
<h2 class="section-title">Deep Dive Comparisons</h2>
<p class="section-sub">We respect our competitors. Here's an honest breakdown of what each platform does well and where FinanceOS offers a better path forward.</p>
<div class="h2h-grid">

<!-- vs Anaplan -->
<div class="h2h-card">
<div class="h2h-vs">FinanceOS vs Anaplan</div>
<h3>Anaplan</h3>
<div class="h2h-tagline">Powerful but complex — built for the Fortune 100 with model-builder armies.</div>
<div class="h2h-section">
<div class="h2h-section-title their">&#9733; What Anaplan Does Well</div>
<ul class="h2h-list their">
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Hyperblock calculation engine for massive datasets</li>
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Deep supply chain and demand planning modules</li>
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Proven at Fortune 100 enterprise scale</li>
</ul>
</div>
<div class="h2h-section">
<div class="h2h-section-title ours">&#10003; Where FinanceOS Wins</div>
<ul class="h2h-list ours">
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>10x faster implementation (weeks vs months)</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>AI-native architecture vs bolt-on AI features</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Transparent pricing — no opaque enterprise contracts</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>No specialized "model builders" required</li>
</ul>
</div>
</div>

<!-- vs Adaptive -->
<div class="h2h-card">
<div class="h2h-vs">FinanceOS vs Adaptive Planning</div>
<h3>Workday Adaptive Planning</h3>
<div class="h2h-tagline">A strong choice if your entire stack is Workday — limited otherwise.</div>
<div class="h2h-section">
<div class="h2h-section-title their">&#9733; What Adaptive Does Well</div>
<ul class="h2h-list their">
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Deep native Workday HCM integration</li>
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Strong workforce planning capabilities</li>
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Tight Workday ecosystem synergy</li>
</ul>
</div>
<div class="h2h-section">
<div class="h2h-section-title ours">&#10003; Where FinanceOS Wins</div>
<ul class="h2h-list ours">
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Vendor-agnostic — 50+ integrations, any ERP</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Superior AI copilot with natural language queries</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Faster time-to-value with self-serve onboarding</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Works with ANY ERP, not just Workday</li>
</ul>
</div>
</div>

<!-- vs Planful -->
<div class="h2h-card">
<div class="h2h-vs">FinanceOS vs Planful</div>
<h3>Planful</h3>
<div class="h2h-tagline">A solid mid-market option with strong close management features.</div>
<div class="h2h-section">
<div class="h2h-section-title their">&#9733; What Planful Does Well</div>
<ul class="h2h-list their">
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Strong financial close management workflows</li>
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Good Excel add-in integration</li>
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Established mid-market presence and support</li>
</ul>
</div>
<div class="h2h-section">
<div class="h2h-section-title ours">&#10003; Where FinanceOS Wins</div>
<ul class="h2h-list ours">
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Superior AI capabilities — full NLP copilot</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Real-time consolidation vs batch processing</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Modern, intuitive UX — minimal training needed</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Broader integration ecosystem (50+ connectors)</li>
</ul>
</div>
</div>

<!-- vs Vena -->
<div class="h2h-card">
<div class="h2h-vs">FinanceOS vs Vena Solutions</div>
<h3>Vena Solutions</h3>
<div class="h2h-tagline">Excel-native and familiar, but ultimately limited by the spreadsheet paradigm.</div>
<div class="h2h-section">
<div class="h2h-section-title their">&#9733; What Vena Does Well</div>
<ul class="h2h-list their">
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Native Excel interface — zero learning curve for finance teams</li>
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Good workflow automation for approvals</li>
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Lower entry price point in the market</li>
</ul>
</div>
<div class="h2h-section">
<div class="h2h-section-title ours">&#10003; Where FinanceOS Wins</div>
<ul class="h2h-list ours">
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>AI that goes beyond what spreadsheets can do</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Real-time data vs Excel refresh cycles</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Better scalability as your org grows</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Monte Carlo scenario modeling built in</li>
</ul>
</div>
</div>

<!-- vs Oracle -->
<div class="h2h-card">
<div class="h2h-vs">FinanceOS vs Oracle EPM</div>
<h3>Oracle EPM Cloud</h3>
<div class="h2h-tagline">An enterprise giant with enterprise-grade complexity and lock-in.</div>
<div class="h2h-section">
<div class="h2h-section-title their">&#9733; What Oracle Does Well</div>
<ul class="h2h-list their">
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Massive ERP ecosystem with deep Oracle DB integration</li>
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Comprehensive EPM suite (close, plan, report, tax)</li>
<li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>Strong presence in heavily regulated industries</li>
</ul>
</div>
<div class="h2h-section">
<div class="h2h-section-title ours">&#10003; Where FinanceOS Wins</div>
<ul class="h2h-list ours">
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>90% faster implementation (weeks vs 6–12 months)</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Modern AI-first UX — no Oracle training required</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>Transparent pricing with 30-day MBG</li>
<li><svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>No Oracle stack dependency — vendor agnostic</li>
</ul>
</div>
</div>

</div>
</div></section>

<!-- STATS -->
<section class="section reveal">
<div class="section-label">Why Teams Switch</div>
<h2 class="section-title">The Numbers Speak for Themselves</h2>
<p class="section-sub">Based on aggregate data from FinanceOS customers who migrated from legacy platforms.</p>
<div class="stats-row">
<div class="stat-card">
<div class="stat-num">73%</div>
<div class="stat-label">Faster Close Cycles</div>
<div class="stat-detail">Average reduction in month-end close time</div>
</div>
<div class="stat-card">
<div class="stat-num">10x</div>
<div class="stat-label">Faster Implementation</div>
<div class="stat-detail">Weeks instead of months to go live</div>
</div>
<div class="stat-card">
<div class="stat-num">$2.4M</div>
<div class="stat-label">Average 3-Year Savings</div>
<div class="stat-detail">vs legacy platform TCO including licensing, consulting, and maintenance</div>
</div>
</div>
</section>

<!-- MIGRATION -->
<section class="section reveal" style="background:var(--bg);max-width:100%;"><div style="max-width:1200px;margin:0 auto;padding:0 40px;">
<div class="section-label">Migration</div>
<h2 class="section-title">Switching Is Easier Than You Think</h2>
<p class="section-sub">Most teams are fully migrated and live in under 4 weeks. Our migration team handles the heavy lifting.</p>
<div class="mig-steps">
<div class="mig-step">
<div class="mig-num">1</div>
<h4>Export Data</h4>
<p>Export your historical data, models, and reports from your current platform.</p>
</div>
<div class="mig-step">
<div class="mig-num">2</div>
<h4>Connect FinanceOS</h4>
<p>Link your ERP, CRM, HRIS, and data sources via our 50+ pre-built connectors.</p>
</div>
<div class="mig-step">
<div class="mig-num">3</div>
<h4>Auto-Map Fields</h4>
<p>Our AI automatically maps your chart of accounts, dimensions, and hierarchies.</p>
</div>
<div class="mig-step">
<div class="mig-num">4</div>
<h4>Go Live</h4>
<p>Validate, train your team, and switch over with zero downtime.</p>
</div>
</div>
</div></section>

<!-- BOTTOM CTA -->
<section class="bottom-cta reveal">
<h2>Ready to See the <span class="color-shift">Difference</span>?</h2>
<p>Get a personalized comparison for your specific use case. Our team will show you exactly how FinanceOS replaces your current platform — with a clear migration timeline.</p>
<div class="cta-row">
<a href="#" class="cta-green">Request Demo</a>
<a href="FinanceOS-Pricing-Page.html" class="cta-dark">View Pricing</a>
</div>
</section>

<!-- FOOTER -->
<footer class="footer">
<div class="footer-grid">
<div class="footer-brand">
<a href="FinanceOS-Landing-Page.html" class="nav-logo" style="margin-bottom:4px;">
<svg viewBox="0 0 32 32" fill="none" width="28" height="28"><rect width="32" height="32" rx="8" fill="#10B981"/><path d="M8 12h10M8 16h14M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="12" r="3" fill="#22D3EE"/></svg>
<span style="color:var(--t1)">FinanceOS</span>
</a>
<p>AI-powered FP&A platform that transforms how modern finance teams plan, analyze, and report.</p>
</div>
<div class="footer-col">
<h4>Product</h4>
<a href="FinanceOS-Whats-New.html">Features</a>
<a href="FinanceOS-Pricing-Page.html">Pricing</a>
<a href="FinanceOS-Integrations.html">Integrations</a>
<a href="FinanceOS-vs-Competitors.html">Compare</a>
</div>
<div class="footer-col">
<h4>Resources</h4>
<a href="FinanceOS-Resources.html">Blog & Guides</a>
<a href="FinanceOS-Committed-Spend.html">Committed Spend</a>
<a href="#">API Reference</a>
<a href="#">Community</a>
</div>
<div class="footer-col">
<h4>Company</h4>
<a href="FinanceOS-About.html">About</a>
<a href="#">Careers</a>
<a href="#">Contact</a>
<a href="#">Security</a>
</div>
</div>
<div class="footer-bottom">
<span>&copy; 2026 FinanceOS, Inc. All rights reserved.</span>
<span>SOC 2 Type II &middot; ISO 27001 &middot; GDPR</span>
</div>
</footer>


` }} />
    </>
  );
}
