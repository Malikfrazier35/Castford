'use client';

import { useEffect, useRef } from 'react';

export default function V3InternalRndStrategyPage() {
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
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
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
.nav-item>a:hover{color:#fff;background:rgba(255,255,255,0.06);}
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
.hero::before{content:'';position:absolute;top:-300px;left:50%;transform:translateX(-50%);width:1000px;height:1000px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.06),transparent 60%);pointer-events:none;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;background:rgba(34,211,238,0.1);border:1px solid rgba(34,211,238,0.2);color:var(--cyan);margin-bottom:20px;}
.hero-badge .dot{width:8px;height:8px;border-radius:50%;background:var(--cyan);animation:typeCursor 2s ease infinite;}
.hero h1{font-size:clamp(36px,5.5vw,56px);font-weight:900;letter-spacing:-0.04em;line-height:1.1;margin-bottom:16px;}
.hero h1 .accent{background:linear-gradient(135deg,var(--cyan),var(--purple),var(--green),var(--blue));background-size:300% 300%;animation:gradientShift 6s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero p{font-size:18px;color:rgba(255,255,255,0.45);max-width:640px;margin:0 auto 32px;line-height:1.65;}

/* SECTIONS */
.section{max-width:1100px;margin:0 auto;padding:80px 40px;}
.section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--green);text-align:center;margin-bottom:12px;}
.section-title{font-size:clamp(28px,3.5vw,42px);font-weight:900;text-align:center;letter-spacing:-0.03em;margin-bottom:14px;}
.section-sub{font-size:16px;color:var(--t3);text-align:center;max-width:580px;margin:0 auto 50px;line-height:1.6;}

/* R&D PILLARS */
.pillars{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;}
.pillar{background:#fff;border:1px solid var(--border);border-radius:20px;padding:36px;transition:all 0.3s var(--ease);position:relative;overflow:hidden;}
.pillar:hover{transform:translateY(-4px);box-shadow:0 16px 50px rgba(0,0,0,0.06);}
.pillar-icon{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;}
.pillar-icon svg{width:26px;height:26px;stroke:currentColor;fill:none;stroke-width:1.5;}
.pillar h3{font-size:20px;font-weight:900;letter-spacing:-0.02em;margin-bottom:8px;}
.pillar p{font-size:14px;color:var(--t3);line-height:1.7;margin-bottom:16px;}
.pillar-tags{display:flex;flex-wrap:wrap;gap:6px;}
.pillar-tag{padding:4px 10px;border-radius:6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;background:var(--bg);color:var(--t3);border:1px solid var(--border);}
.pillar-budget{position:absolute;top:20px;right:20px;padding:4px 12px;border-radius:8px;font-size:10px;font-weight:800;letter-spacing:0.04em;}

/* CONNECTOR STRATEGY */
.conn-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.conn-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:24px;text-align:center;transition:all 0.3s var(--ease);}
.conn-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.05);}
.conn-num{font-size:40px;font-weight:900;font-family:var(--mono);letter-spacing:-0.04em;margin-bottom:4px;}
.conn-label{font-size:14px;font-weight:700;margin-bottom:4px;}
.conn-detail{font-size:12px;color:var(--t3);line-height:1.5;}
.conn-status{display:inline-block;padding:3px 10px;border-radius:6px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;margin-top:8px;}

/* CUSTOMER ACCOUNTS */
.acct-features{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.acct-card{background:#fff;border:1px solid var(--border);border-radius:20px;padding:28px;transition:all 0.3s var(--ease);}
.acct-card:hover{transform:translateY(-4px);box-shadow:0 16px 50px rgba(0,0,0,0.06);}
.acct-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;animation:bgColorCycle 8s ease infinite;}
.acct-icon svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.5;}
.acct-card h3{font-size:16px;font-weight:800;margin-bottom:8px;}
.acct-card p{font-size:13px;color:var(--t3);line-height:1.6;}

/* ROADMAP */
.roadmap-dark{background:linear-gradient(135deg,#0F172A,#1E1B4B);border-radius:24px;padding:50px;color:#fff;animation:glowPulse 4s ease infinite;}
.roadmap-dark h2{font-size:32px;font-weight:900;letter-spacing:-0.03em;margin-bottom:8px;text-align:center;}
.roadmap-dark .rd-sub{font-size:15px;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:40px;line-height:1.6;}
.rd-timeline{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.rd-quarter{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:24px;transition:all 0.3s;}
.rd-quarter:hover{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);}
.rd-q-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:16px;}
.rd-q-label.q1{color:var(--cyan);}
.rd-q-label.q2{color:var(--purple);}
.rd-q-label.q3{color:var(--green);}
.rd-q-label.q4{color:var(--amber);}
.rd-item{padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;gap:8px;}
.rd-item:last-child{border-bottom:none;}
.rd-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.rd-item span{font-size:12px;font-weight:500;color:rgba(255,255,255,0.6);}

/* INVESTMENT */
.invest-bars{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;align-items:center;}
.invest-chart{display:flex;flex-direction:column;gap:16px;}
.invest-row{display:flex;align-items:center;gap:12px;}
.invest-label{width:140px;font-size:13px;font-weight:700;flex-shrink:0;}
.invest-track{flex:1;height:32px;background:var(--bg);border-radius:8px;overflow:hidden;position:relative;}
.invest-fill{height:100%;border-radius:8px;display:flex;align-items:center;padding-left:12px;font-size:12px;font-weight:700;color:#fff;font-family:var(--mono);transition:width 1s var(--ease);}
.invest-text{padding:20px;}
.invest-text h3{font-size:24px;font-weight:900;letter-spacing:-0.02em;margin-bottom:12px;}
.invest-text p{font-size:14px;color:var(--t3);line-height:1.7;margin-bottom:16px;}
.invest-text .invest-stat{display:flex;gap:24px;}
.invest-text .invest-stat div{text-align:center;}
.invest-text .invest-stat .is-num{font-size:28px;font-weight:900;font-family:var(--mono);}
.invest-text .invest-stat .is-label{font-size:11px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:0.04em;margin-top:2px;}

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
.pillars,.conn-grid,.acct-features,.rd-timeline,.invest-bars{grid-template-columns:1fr;}
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
<div class="hero-badge"><span class="dot"></span> R&D Strategy 2026</div>
<h1>Building the Future of<br/><span class="accent">Autonomous Finance</span></h1>
<p>Our R&D strategy centers on four pillars: AI-native intelligence, connector ecosystem expansion, customer account intelligence, and predictive automation. Here's where we're investing and why.</p>
</section>

<!-- R&D PILLARS -->
<section class="section reveal">
<div class="section-label">Strategic Pillars</div>
<h2 class="section-title">Four Pillars of R&D Investment</h2>
<p class="section-sub">Every engineering dollar maps to one of these four pillars. Each one compounds on the others to create a platform that gets smarter with every customer.</p>
<div class="pillars">

<div class="pillar">
<div class="pillar-budget" style="background:rgba(139,92,246,0.08);color:var(--purple);">40% of R&D</div>
<div class="pillar-icon" style="background:rgba(139,92,246,0.08);color:var(--purple)"><svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 015 5c0 3-2 5.5-5 8.5C9 12.5 7 10 7 7a5 5 0 015-5z"/><circle cx="12" cy="14" r="7"/></svg></div>
<h3>AI-Native Intelligence</h3>
<p>Our largest investment area. We're building AI that doesn't just assist — it reasons, predicts, and acts autonomously on behalf of finance teams. This includes the AI Copilot 2.0 visible reasoning chain, natural language report generation, and anomaly detection that learns your business patterns.</p>
<div class="pillar-tags">
<span class="pillar-tag">LLM Fine-Tuning</span>
<span class="pillar-tag">Reasoning Chains</span>
<span class="pillar-tag">NLP Queries</span>
<span class="pillar-tag">Anomaly Detection</span>
<span class="pillar-tag">Auto-Narrative</span>
</div>
</div>

<div class="pillar">
<div class="pillar-budget" style="background:rgba(34,211,238,0.08);color:var(--cyan);">25% of R&D</div>
<div class="pillar-icon" style="background:rgba(34,211,238,0.08);color:var(--cyan)"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
<h3>Connector Ecosystem</h3>
<p>Data is the lifeblood of FP&A. We're expanding from 50+ connectors to 100+ by end of 2026, with a focus on real-time bi-directional sync, universal data mapping, and a public Connector SDK so customers and partners can build their own.</p>
<div class="pillar-tags">
<span class="pillar-tag">Bi-Directional Sync</span>
<span class="pillar-tag">Connector SDK</span>
<span class="pillar-tag">Auto-Mapping</span>
<span class="pillar-tag">Webhook Events</span>
<span class="pillar-tag">Partner Ecosystem</span>
</div>
</div>

<div class="pillar">
<div class="pillar-budget" style="background:rgba(16,185,129,0.08);color:var(--green);">20% of R&D</div>
<div class="pillar-icon" style="background:rgba(16,185,129,0.08);color:var(--green)"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></div>
<h3>Customer Account Intelligence</h3>
<p>Multi-entity management, role-based access at scale, usage analytics, and customer health scoring. We're building the account infrastructure that lets FinanceOS serve departments of 5 and enterprises of 5,000 equally well.</p>
<div class="pillar-tags">
<span class="pillar-tag">Multi-Entity</span>
<span class="pillar-tag">RBAC</span>
<span class="pillar-tag">Usage Analytics</span>
<span class="pillar-tag">Health Scoring</span>
<span class="pillar-tag">SSO / SCIM</span>
</div>
</div>

<div class="pillar">
<div class="pillar-budget" style="background:rgba(59,130,246,0.08);color:var(--blue);">15% of R&D</div>
<div class="pillar-icon" style="background:rgba(59,130,246,0.08);color:var(--blue)"><svg viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg></div>
<h3>Predictive Automation</h3>
<p>Forecasting that doesn't wait to be asked. Predictive cash flow, automated variance explanations, rolling forecast engines, and triggered alerts when actuals deviate from plan. The goal: finance teams that are proactive, not reactive.</p>
<div class="pillar-tags">
<span class="pillar-tag">Cash Flow ML</span>
<span class="pillar-tag">Auto-Variance</span>
<span class="pillar-tag">Rolling Forecasts</span>
<span class="pillar-tag">Smart Alerts</span>
<span class="pillar-tag">Monte Carlo</span>
</div>
</div>

</div>
</section>

<!-- CONNECTOR STRATEGY -->
<section class="section reveal" style="background:var(--bg);max-width:100%;"><div style="max-width:1100px;margin:0 auto;padding:0 40px;">
<div class="section-label">Connector Ecosystem</div>
<h2 class="section-title">From 50 to 100+ Connectors</h2>
<p class="section-sub">Our connector strategy is built around three priorities: coverage, depth, and developer access.</p>
<div class="conn-grid">

<div class="conn-card">
<div class="conn-num" style="color:var(--green);">52</div>
<div class="conn-label">Live Connectors</div>
<div class="conn-detail">ERP, CRM, Payments, HRIS, Accounting, Data Warehouses, and Productivity tools all connected.</div>
<div class="conn-status" style="background:rgba(16,185,129,0.08);color:var(--green);">Production</div>
</div>

<div class="conn-card">
<div class="conn-num" style="color:var(--purple);">18</div>
<div class="conn-label">In Development</div>
<div class="conn-detail">Including Zuora, Bill.com, Coupa, ADP, Greenhouse, Monday.com, Jira, and more vertical-specific tools.</div>
<div class="conn-status" style="background:rgba(139,92,246,0.08);color:var(--purple);">Q2–Q3 2026</div>
</div>

<div class="conn-card">
<div class="conn-num" style="color:var(--cyan);">30+</div>
<div class="conn-label">Planned via SDK</div>
<div class="conn-detail">Our public Connector SDK will let partners and customers build custom connectors with OAuth, field mapping, and scheduling built in.</div>
<div class="conn-status" style="background:rgba(34,211,238,0.08);color:var(--cyan);">SDK Beta Q3 2026</div>
</div>

<div class="conn-card">
<div class="conn-num" style="color:var(--blue);">Bi-Di</div>
<div class="conn-label">Bi-Directional Sync</div>
<div class="conn-detail">Write-back to ERP and CRM systems. Push approved forecasts, journal entries, and budget updates back to source systems.</div>
<div class="conn-status" style="background:rgba(59,130,246,0.08);color:var(--blue);">In Development</div>
</div>

<div class="conn-card">
<div class="conn-num" style="color:var(--amber);">Auto</div>
<div class="conn-label">AI Field Mapping</div>
<div class="conn-detail">AI automatically maps chart of accounts, dimensions, and hierarchies from any connected source. No manual configuration.</div>
<div class="conn-status" style="background:rgba(245,158,11,0.08);color:var(--amber);">Live Now</div>
</div>

<div class="conn-card">
<div class="conn-num" style="color:var(--red);">&lt;5m</div>
<div class="conn-label">Average Connect Time</div>
<div class="conn-detail">From clicking "Connect" to seeing live data in your FinanceOS workspace. OAuth-based, no IT tickets required.</div>
<div class="conn-status" style="background:rgba(239,68,68,0.08);color:var(--red);">Benchmark</div>
</div>

</div>
</div></section>

<!-- CUSTOMER ACCOUNTS -->
<section class="section reveal">
<div class="section-label">Customer Account Intelligence</div>
<h2 class="section-title">Smarter Account Management at Scale</h2>
<p class="section-sub">Built for teams of every size — from startup FP&A analysts to enterprise finance departments with hundreds of users.</p>
<div class="acct-features">

<div class="acct-card">
<div class="acct-icon" style="color:var(--purple)"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></div>
<h3>Multi-Entity Workspaces</h3>
<p>Manage multiple subsidiaries, business units, or regions in a single FinanceOS account. Consolidated views with drill-down into individual entities. Intercompany eliminations handled automatically.</p>
</div>

<div class="acct-card">
<div class="acct-icon" style="color:var(--cyan)"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>
<h3>Granular RBAC & SCIM</h3>
<p>Role-based access control down to the cell level. SCIM provisioning for automated user lifecycle management. SSO with Google, Microsoft, Okta, and SAML 2.0. Audit logs for every action.</p>
</div>

<div class="acct-card">
<div class="acct-icon" style="color:var(--green)"><svg viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div>
<h3>Usage Analytics & Health</h3>
<p>Customer health scoring, feature adoption tracking, and usage analytics for account managers. Know which teams are getting value and which need onboarding support before they ask.</p>
</div>

<div class="acct-card">
<div class="acct-icon" style="color:var(--blue)"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
<h3>SOC 2 & Compliance</h3>
<p>SOC 2 Type II certified, ISO 27001, GDPR compliant. Data residency options for EU and APAC. Customer data is encrypted at rest and in transit with per-tenant isolation.</p>
</div>

<div class="acct-card">
<div class="acct-icon" style="color:var(--amber)"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
<h3>White-Label & Embedding</h3>
<p>Enterprise accounts can white-label FinanceOS dashboards and embed them in internal portals. Custom branding, custom domains, and iframe-safe reporting for board presentations.</p>
</div>

<div class="acct-card">
<div class="acct-icon" style="color:var(--red)"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
<h3>Consumption & Billing Engine</h3>
<p>Real-time usage metering, committed spend tracking, overage alerts, and self-serve plan management. Customers see exactly what they're using and what they're paying for — no surprises.</p>
</div>

</div>
</section>

<!-- PRODUCT ROADMAP -->
<section class="section reveal">
<div class="roadmap-dark">
<h2>2026 Product <span style="background:linear-gradient(135deg,var(--cyan),var(--purple),var(--green));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:300% 300%;animation:gradientShift 6s ease infinite;">Roadmap</span></h2>
<div class="rd-sub">Major milestones and deliverables across all four R&D pillars.</div>
<div class="rd-timeline">

<div class="rd-quarter">
<div class="rd-q-label q1">Q1 2026 — Shipped</div>
<div class="rd-item"><div class="rd-dot" style="background:var(--purple)"></div><span>AI Copilot 2.0 with reasoning</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--cyan)"></div><span>Real-time consolidation engine</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--green)"></div><span>Board-ready report builder</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--cyan)"></div><span>15 new connectors (52 total)</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--blue)"></div><span>Scenario Modeling Pro (Monte Carlo)</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--green)"></div><span>SOX 404 Compliance Autopilot</span></div>
</div>

<div class="rd-quarter">
<div class="rd-q-label q2">Q2 2026 — In Progress</div>
<div class="rd-item"><div class="rd-dot" style="background:var(--blue)"></div><span>Predictive cash flow forecasting</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--cyan)"></div><span>Slack & Teams native integration</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--purple)"></div><span>Custom ML model training</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--green)"></div><span>Multi-entity workspace V2</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--cyan)"></div><span>Connector SDK private beta</span></div>
</div>

<div class="rd-quarter">
<div class="rd-q-label q3">Q3 2026 — Planned</div>
<div class="rd-item"><div class="rd-dot" style="background:var(--cyan)"></div><span>Connector SDK public launch</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--purple)"></div><span>Autonomous close workflows</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--blue)"></div><span>Bi-directional ERP write-back</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--green)"></div><span>White-label embedding</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--amber)"></div><span>EU data residency option</span></div>
</div>

<div class="rd-quarter">
<div class="rd-q-label q4">Q4 2026 — Vision</div>
<div class="rd-item"><div class="rd-dot" style="background:var(--purple)"></div><span>Autonomous FP&A Agent</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--cyan)"></div><span>100+ total connectors</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--blue)"></div><span>Real-time revenue recognition</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--green)"></div><span>Partner marketplace launch</span></div>
<div class="rd-item"><div class="rd-dot" style="background:var(--amber)"></div><span>Advanced tax automation</span></div>
</div>

</div>
</div>
</section>

<!-- INVESTMENT BREAKDOWN -->
<section class="section reveal" style="background:var(--bg);max-width:100%;"><div style="max-width:1100px;margin:0 auto;padding:0 40px;">
<div class="section-label">Investment</div>
<h2 class="section-title">Where the R&D Budget Goes</h2>
<p class="section-sub">We invest aggressively in product. Here's how our R&D budget breaks down across the four pillars.</p>
<div class="invest-bars">
<div class="invest-chart">
<div class="invest-row">
<div class="invest-label">AI Intelligence</div>
<div class="invest-track"><div class="invest-fill" style="width:80%;background:linear-gradient(90deg,var(--purple),var(--cyan));">40%</div></div>
</div>
<div class="invest-row">
<div class="invest-label">Connectors</div>
<div class="invest-track"><div class="invest-fill" style="width:50%;background:linear-gradient(90deg,var(--cyan),var(--blue));">25%</div></div>
</div>
<div class="invest-row">
<div class="invest-label">Customer Accounts</div>
<div class="invest-track"><div class="invest-fill" style="width:40%;background:linear-gradient(90deg,var(--green),var(--cyan));">20%</div></div>
</div>
<div class="invest-row">
<div class="invest-label">Predictive Automation</div>
<div class="invest-track"><div class="invest-fill" style="width:30%;background:linear-gradient(90deg,var(--blue),var(--purple));">15%</div></div>
</div>
</div>
<div class="invest-text">
<h3>Engineering-Led, Customer-Driven</h3>
<p>Our R&D priorities are shaped by customer feedback, competitive analysis, and where we see the FP&A market heading over the next 3 years. We ship weekly, iterate based on real usage data, and invest more in areas where we see the highest customer impact.</p>
<div class="invest-stat">
<div><div class="is-num" style="color:var(--green);">62%</div><div class="is-label">Engineers</div></div>
<div><div class="is-num" style="color:var(--purple);">Weekly</div><div class="is-label">Ship Cadence</div></div>
<div><div class="is-num" style="color:var(--cyan);">4.8x</div><div class="is-label">R&D Ratio</div></div>
</div>
</div>
</div>
</div></section>

<!-- BOTTOM CTA -->
<section class="bottom-cta reveal">
<h2>Want to Shape the <span class="color-shift">Roadmap</span>?</h2>
<p>Committed spend customers get early access to beta features and a direct channel to influence what we build next.</p>
<div class="cta-row">
<a href="FinanceOS-Committed-Spend.html" class="cta-green">Committed Spend Perks</a>
<a href="FinanceOS-Whats-New.html" class="cta-dark">See What's New</a>
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
<a href="FinanceOS-RnD-Strategy.html">R&D Strategy</a>
<a href="#">API Reference</a>
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
