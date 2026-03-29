'use client';

import { useEffect, useRef } from 'react';

export default function V3WhatsNewOriginalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target);}});},{threshold:0.1});
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
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(34,211,238,0.1)}50%{box-shadow:0 0 40px rgba(139,92,246,0.15)}}
@keyframes borderGlow{0%{border-color:rgba(34,211,238,0.2)}33%{border-color:rgba(139,92,246,0.2)}66%{border-color:rgba(16,185,129,0.2)}100%{border-color:rgba(34,211,238,0.2)}}
@keyframes typeCursor{0%,100%{opacity:1}50%{opacity:0}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
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
.hero::before{content:'';position:absolute;top:-300px;left:50%;transform:translateX(-50%);width:1000px;height:1000px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,0.05),transparent 60%);pointer-events:none;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);color:var(--green);margin-bottom:20px;}
.hero-badge .dot{width:8px;height:8px;border-radius:50%;background:var(--green);animation:typeCursor 2s ease infinite;}
.hero h1{font-size:clamp(36px,5.5vw,60px);font-weight:900;letter-spacing:-0.04em;line-height:1.1;margin-bottom:16px;}
.hero h1 .accent{background:linear-gradient(135deg,var(--cyan),var(--purple),var(--green),var(--blue));background-size:300% 300%;animation:gradientShift 6s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero p{font-size:18px;color:rgba(255,255,255,0.45);max-width:600px;margin:0 auto 32px;line-height:1.65;}
.hero-cta{display:inline-flex;gap:12px;flex-wrap:wrap;justify-content:center;}
.hero-cta a{padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;transition:all 0.25s var(--ease);}
.hero-cta .cta-primary{background:var(--green);color:#fff;}.hero-cta .cta-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(16,185,129,0.3);}
.hero-cta .cta-outline{border:1px solid rgba(255,255,255,0.15);color:#fff;}.hero-cta .cta-outline:hover{background:rgba(255,255,255,0.05);}

/* HIGHLIGHT */
.highlight{max-width:1100px;margin:0 auto;padding:60px 40px;}
.hl-card{background:linear-gradient(135deg,#0F172A,#1E1B4B);border:1px solid rgba(139,92,246,0.15);border-radius:24px;padding:50px;display:grid;grid-template-columns:1fr 1fr;gap:40px;position:relative;overflow:hidden;animation:glowPulse 4s ease infinite;}
.hl-card::before{content:'';position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,0.04),transparent 60%);}
.hl-left{color:#fff;}
.hl-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:8px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;background:rgba(139,92,246,0.15);color:var(--purple);margin-bottom:14px;}
.hl-left h2{font-size:32px;font-weight:900;letter-spacing:-0.03em;margin-bottom:12px;line-height:1.15;}
.hl-left p{font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;margin-bottom:20px;}
.hl-features{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:24px;}
.hl-features li{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);}
.hl-features li .hf-dot{width:20px;height:20px;border-radius:6px;background:rgba(16,185,129,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.hl-features li .hf-dot svg{width:12px;height:12px;stroke:var(--green);fill:none;stroke-width:3;}
.hl-cta{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:10px;background:var(--green);color:#fff;font-size:14px;font-weight:700;text-decoration:none;transition:all 0.25s;}.hl-cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(16,185,129,0.25);}
/* AI MOCKUP */
.hl-right{display:flex;align-items:center;justify-content:center;}
.ai-mock{width:100%;max-width:400px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:20px;animation:float 6s ease-in-out infinite;}
.ai-top{display:flex;align-items:center;gap:8px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.06);}
.ai-top .ai-dot{width:8px;height:8px;border-radius:50%;background:var(--purple);}
.ai-top span{font-size:12px;font-weight:700;color:rgba(255,255,255,0.6);}
.ai-top .ai-live{margin-left:auto;font-size:9px;font-weight:800;color:var(--green);text-transform:uppercase;letter-spacing:0.05em;display:flex;align-items:center;gap:4px;}
.ai-top .ai-live .blink{width:6px;height:6px;border-radius:50%;background:var(--green);animation:typeCursor 1.5s ease infinite;}
.ai-msg{margin-bottom:12px;padding:10px 14px;border-radius:10px;font-size:11px;line-height:1.5;}
.ai-msg.user{background:rgba(59,130,246,0.1);color:rgba(255,255,255,0.7);margin-left:40px;}
.ai-msg.bot{background:rgba(139,92,246,0.08);color:rgba(255,255,255,0.7);margin-right:20px;}
.ai-reason{background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.1);border-radius:8px;padding:10px;margin-bottom:12px;}
.ai-reason .ar-label{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:var(--green);margin-bottom:6px;}
.ai-reason .ar-step{font-size:10px;color:rgba(255,255,255,0.5);padding:3px 0;display:flex;align-items:center;gap:6px;}
.ai-reason .ar-step .ar-check{color:var(--green);font-size:10px;}
.ai-input{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);}
.ai-input span{font-size:10px;color:rgba(255,255,255,0.25);flex:1;}
.ai-input .ai-send{width:24px;height:24px;border-radius:6px;background:var(--purple);display:flex;align-items:center;justify-content:center;}
.ai-input .ai-send svg{width:10px;height:10px;stroke:#fff;fill:none;stroke-width:2.5;}

/* FEATURES */
.features{max-width:1100px;margin:0 auto;padding:60px 40px;}
.section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--green);text-align:center;margin-bottom:12px;}
.section-title{font-size:clamp(28px,3.5vw,42px);font-weight:900;text-align:center;letter-spacing:-0.03em;margin-bottom:14px;}
.section-sub{font-size:16px;color:var(--t3);text-align:center;max-width:560px;margin:0 auto 50px;line-height:1.6;}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.feat-card{background:#fff;border:1px solid var(--border);border-radius:20px;padding:28px;transition:all 0.3s var(--ease);position:relative;overflow:hidden;}
.feat-card:hover{transform:translateY(-6px);box-shadow:0 16px 50px rgba(0,0,0,0.06);}
.feat-card:hover{animation:borderGlow 3s ease infinite;}
.fc-badge{position:absolute;top:16px;right:16px;padding:3px 10px;border-radius:6px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;}
.fc-badge.new{background:rgba(16,185,129,0.08);color:var(--green);}
.fc-badge.improved{background:rgba(59,130,246,0.08);color:var(--blue);}
.fc-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;animation:bgColorCycle 8s ease infinite;}
.fc-icon svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.5;}
.feat-card h3{font-size:17px;font-weight:800;margin-bottom:8px;}
.feat-card p{font-size:13px;color:var(--t3);line-height:1.6;}

/* TIMELINE */
.timeline{max-width:800px;margin:0 auto;padding:60px 40px;}
.tl-title{font-size:28px;font-weight:900;text-align:center;margin-bottom:40px;letter-spacing:-0.02em;}
.tl-list{position:relative;padding-left:40px;}
.tl-list::before{content:'';position:absolute;left:15px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,var(--cyan),var(--purple),var(--green));border-radius:2px;}
.tl-item{position:relative;margin-bottom:32px;animation:slideIn 0.5s var(--ease) backwards;}
.tl-item:nth-child(1){animation-delay:0.1s}.tl-item:nth-child(2){animation-delay:0.2s}.tl-item:nth-child(3){animation-delay:0.3s}.tl-item:nth-child(4){animation-delay:0.4s}.tl-item:nth-child(5){animation-delay:0.5s}
.tl-dot{position:absolute;left:-33px;top:4px;width:12px;height:12px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px var(--cyan);}
.tl-item:nth-child(2) .tl-dot{box-shadow:0 0 0 2px var(--purple);}
.tl-item:nth-child(3) .tl-dot{box-shadow:0 0 0 2px var(--green);}
.tl-item:nth-child(4) .tl-dot{box-shadow:0 0 0 2px var(--blue);}
.tl-item:nth-child(5) .tl-dot{box-shadow:0 0 0 2px var(--amber);}
.tl-date{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:6px;animation:colorCycle 8s ease infinite;}
.tl-content h4{font-size:15px;font-weight:800;margin-bottom:4px;}
.tl-content p{font-size:12px;color:var(--t3);line-height:1.5;}
.tl-tags{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;}
.tl-tag{padding:3px 10px;border-radius:6px;font-size:9px;font-weight:700;background:var(--bg);color:var(--t3);border:1px solid var(--border);}

/* COMING SOON */
.coming{max-width:1100px;margin:0 auto;padding:40px 40px 80px;}
.coming h2{font-size:28px;font-weight:900;text-align:center;margin-bottom:12px;}
.coming .cs-sub{font-size:15px;color:var(--t3);text-align:center;margin-bottom:40px;}
.cs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.cs-card{background:#fff;border:2px dashed var(--border);border-radius:20px;padding:28px;text-align:center;transition:all 0.3s;position:relative;}
.cs-card:hover{border-color:var(--cyan);transform:translateY(-4px);}
.cs-badge{display:inline-block;padding:3px 10px;border-radius:6px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;background:rgba(34,211,238,0.08);color:var(--cyan);margin-bottom:14px;}
.cs-icon{width:48px;height:48px;border-radius:14px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;background:var(--bg);}
.cs-icon svg{width:22px;height:22px;stroke:var(--t3);fill:none;stroke-width:1.5;}
.cs-card h3{font-size:16px;font-weight:800;margin-bottom:6px;}
.cs-card p{font-size:12px;color:var(--t3);line-height:1.6;}

/* CTA */
.cta-section{padding:80px 40px;background:linear-gradient(135deg,#030711,#1E1B4B);text-align:center;color:#fff;}
.cta-section h2{font-size:32px;font-weight:900;margin-bottom:12px;letter-spacing:-0.02em;}
.cta-section p{font-size:15px;color:rgba(255,255,255,0.45);margin-bottom:28px;max-width:480px;margin-left:auto;margin-right:auto;}
.cta-btn{display:inline-flex;align-items:center;gap:8px;padding:16px 40px;border-radius:14px;font-size:16px;font-weight:700;background:var(--green);color:#fff;text-decoration:none;transition:all 0.25s var(--ease);}.cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(16,185,129,0.3);}

.footer{padding:40px;background:#030711;text-align:center;font-size:12px;color:rgba(255,255,255,0.25);}

@media(max-width:768px){.hl-card{grid-template-columns:1fr;}.feat-grid,.cs-grid{grid-template-columns:1fr;}.nav-links{display:none;}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<nav class="nav">
  <a class="nav-logo" href="FinanceOS-Landing-Page.html"><svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#22D3EE"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><span>FinanceOS</span></a>
  <div class="nav-links">
    <div class="nav-item"><a href="FinanceOS-Landing-Page.html">Solutions <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></a>
      <div class="dropdown">
        <a href="FinanceOS-Landing-Page.html"><div class="dd-icon" style="background:rgba(16,185,129,0.1);color:var(--green);"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg></div> Platform Overview</a>
        <a href="FinanceOS-Integrations.html"><div class="dd-icon" style="background:rgba(34,211,238,0.1);color:var(--cyan);"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg></div> Integrations</a>
        <a href="FinanceOS-Whats-New.html"><div class="dd-icon" style="background:rgba(139,92,246,0.1);color:var(--purple);"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div> What's New</a>
        <div class="dd-sep"></div>
        <a href="FinanceOS-Pipeline.html"><div class="dd-icon" style="background:rgba(59,130,246,0.1);color:var(--blue);"><svg viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4"/></svg></div> Sales Pipeline</a>
        <a href="FinanceOS-Onboarding.html"><div class="dd-icon" style="background:rgba(245,158,11,0.1);color:var(--amber);"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div> Onboarding</a>
      </div>
    </div>
    <div class="nav-item"><a href="FinanceOS-Pricing-Page.html">Pricing</a></div>
    <div class="nav-item"><a href="FinanceOS-Resources.html">Resources <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></a>
      <div class="dropdown">
        <a href="FinanceOS-Resources.html"><div class="dd-icon" style="background:rgba(59,130,246,0.1);color:var(--blue);"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg></div> All Resources</a>
        <a href="FinanceOS-Whats-New.html"><div class="dd-icon" style="background:rgba(16,185,129,0.1);color:var(--green);"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div> Product Updates</a>
        <a href="FinanceOS-Ad-Campaign.html"><div class="dd-icon" style="background:rgba(245,158,11,0.1);color:var(--amber);"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg></div> ROI Calculator</a>
      </div>
    </div>
    <div class="nav-item"><a href="FinanceOS-About.html">About</a></div>
  </div>
  <div class="nav-right"><a class="btn-ghost" href="FinanceOS-Login.html">Sign In</a><a class="btn-primary" href="FinanceOS-Contact.html">Subscribe</a></div>
</nav>

<section class="hero">
  <div class="hero-badge"><span class="dot"></span> Q1 2026 RELEASE</div>
  <h1>What's New in<br/><span class="accent">FinanceOS</span></h1>
  <p>We shipped 47 features this quarter. Here are the highlights that will change how your finance team works.</p>
  <div class="hero-cta">
    <a class="cta-primary" href="FinanceOS-Contact.html">Request a Demo</a>
    <a class="cta-outline" href="FinanceOS-Resources.html">Browse All Resources</a>
  </div>
</section>

<section class="highlight reveal">
  <div class="hl-card">
    <div class="hl-left">
      <div class="hl-badge">FLAGSHIP FEATURE</div>
      <h2>AI Copilot 2.0 with<br/>Visible Reasoning</h2>
      <p>Ask any financial question in plain English. The AI now shows its complete reasoning chain -- every data source, assumption, and calculation step -- so your team can trust the answer.</p>
      <ul class="hl-features">
        <li><span class="hf-dot"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Transparent reasoning chains for every insight</li>
        <li><span class="hf-dot"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> One-click report generation from natural language</li>
        <li><span class="hf-dot"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Scenario modeling with Monte Carlo simulation</li>
        <li><span class="hf-dot"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Multi-turn conversations with context memory</li>
      </ul>
      <a class="hl-cta" href="FinanceOS-Contact.html">Try AI Copilot 2.0 &rarr;</a>
    </div>
    <div class="hl-right">
      <div class="ai-mock">
        <div class="ai-top"><div class="ai-dot"></div><span>AI Copilot</span><div class="ai-live"><span class="blink"></span> LIVE</div></div>
        <div class="ai-msg user">Why did gross margin drop 2pp last month?</div>
        <div class="ai-reason">
          <div class="ar-label">Reasoning Chain</div>
          <div class="ar-step"><span class="ar-check">&#10003;</span> Pulled GL data from NetSuite (Mar 2026)</div>
          <div class="ar-step"><span class="ar-check">&#10003;</span> Compared COGS line items vs Feb baseline</div>
          <div class="ar-step"><span class="ar-check">&#10003;</span> Identified AWS cost spike (+$142K)</div>
          <div class="ar-step"><span class="ar-check">&#10003;</span> Cross-referenced with infra team Slack</div>
        </div>
        <div class="ai-msg bot">Gross margin declined from 81.2% to 79.1% due to a $142K increase in AWS hosting costs from reserved instance expiration. Recommend renewing 3-year RIs for projected $89K/yr savings.</div>
        <div class="ai-input"><span>Ask a follow-up question...</span><div class="ai-send"><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></div></div>
      </div>
    </div>
  </div>
</section>

<section class="features reveal">
  <div class="section-label">New & Improved</div>
  <div class="section-title">Feature Highlights</div>
  <div class="section-sub">Every feature is designed to save your finance team time, improve accuracy, and keep you audit-ready.</div>
  <div class="feat-grid">
    <div class="feat-card"><span class="fc-badge new">New</span><div class="fc-icon" style="color:var(--cyan);"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1010 10H12V2z"/><path d="M20 12a8 8 0 00-8-8v8h8z"/></svg></div><h3>Real-Time Consolidation Engine</h3><p>Sub-second multi-entity consolidation with automatic intercompany eliminations, multi-currency translation, and GAAP/IFRS dual reporting.</p></div>
    <div class="feat-card"><span class="fc-badge new">New</span><div class="fc-icon" style="color:var(--purple);"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg></div><h3>Smart Variance Detection</h3><p>AI automatically flags anomalies in your financial data before you even ask. Get alerts on unusual trends, budget overruns, and forecast deviations.</p></div>
    <div class="feat-card"><span class="fc-badge improved">Improved</span><div class="fc-icon" style="color:var(--green);"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8M12 17v4"/></svg></div><h3>Board-Ready Report Builder</h3><p>Generate investor-grade PDF and PPTX reports in one click. Customizable templates with your branding, auto-populated from live data.</p></div>
    <div class="feat-card"><span class="fc-badge improved">Improved</span><div class="fc-icon" style="color:var(--blue);"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg></div><h3>50+ Native Connectors</h3><p>Connect NetSuite, Salesforce, Stripe, Snowflake, QuickBooks, Xero, and 44 more tools with one-click OAuth setup and real-time sync.</p></div>
    <div class="feat-card"><span class="fc-badge new">New</span><div class="fc-icon" style="color:var(--amber);"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><h3>Scenario Modeling Pro</h3><p>Side-by-side what-if analysis with Monte Carlo simulation. Model hiring plans, revenue scenarios, and runway projections with confidence intervals.</p></div>
    <div class="feat-card"><span class="fc-badge new">New</span><div class="fc-icon" style="color:var(--red);"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><h3>SOX Compliance Autopilot</h3><p>Automated Section 404 control testing, continuous audit trail generation, and one-click evidence packages for your external auditors.</p></div>
  </div>
</section>

<section class="timeline reveal">
  <div class="tl-title">Release Timeline</div>
  <div class="tl-list">
    <div class="tl-item"><div class="tl-dot"></div><div class="tl-date">March 2026</div><div class="tl-content"><h4>AI Copilot 2.0 & Real-Time Consolidation</h4><p>Visible reasoning chains, natural language report builder, and sub-second multi-entity consolidation engine.</p><div class="tl-tags"><span class="tl-tag">AI</span><span class="tl-tag">Consolidation</span><span class="tl-tag">Core Platform</span></div></div></div>
    <div class="tl-item"><div class="tl-dot"></div><div class="tl-date">February 2026</div><div class="tl-content"><h4>15 New Connectors & Board Report Templates</h4><p>Added Workday, BambooHR, Chargebee, Recurly, Databricks, and 10 more. Plus new investor-grade report templates.</p><div class="tl-tags"><span class="tl-tag">Integrations</span><span class="tl-tag">Reports</span></div></div></div>
    <div class="tl-item"><div class="tl-dot"></div><div class="tl-date">January 2026</div><div class="tl-content"><h4>Scenario Modeling Pro & SOX Autopilot</h4><p>Monte Carlo scenario analysis with confidence intervals. Automated SOX 404 control testing and evidence generation.</p><div class="tl-tags"><span class="tl-tag">Modeling</span><span class="tl-tag">Compliance</span></div></div></div>
    <div class="tl-item"><div class="tl-dot"></div><div class="tl-date">December 2025</div><div class="tl-content"><h4>Performance 3x Faster & Mobile Dashboard</h4><p>Complete infrastructure overhaul delivering 3x faster page loads, plus a responsive mobile dashboard for on-the-go finance.</p><div class="tl-tags"><span class="tl-tag">Performance</span><span class="tl-tag">Mobile</span></div></div></div>
    <div class="tl-item"><div class="tl-dot"></div><div class="tl-date">November 2025</div><div class="tl-content"><h4>Multi-Currency Support & Webhook API v2</h4><p>Automatic FX translation with 150+ currencies. Real-time webhook events for close status, forecast updates, and alerts.</p><div class="tl-tags"><span class="tl-tag">Currency</span><span class="tl-tag">API</span></div></div></div>
  </div>
</section>

<section class="coming reveal">
  <h2>Coming Soon</h2>
  <div class="cs-sub">What we're building next for your finance team</div>
  <div class="cs-grid">
    <div class="cs-card"><div class="cs-badge">In Development</div><div class="cs-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><h3>Predictive Cash Flow Forecasting</h3><p>ML-powered cash flow predictions using historical patterns, seasonality, and real-time AR/AP data. 90-day rolling forecasts with daily granularity.</p></div>
    <div class="cs-card"><div class="cs-badge">In Development</div><div class="cs-icon"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div><h3>Slack & Teams Native Integration</h3><p>Query FinanceOS directly from Slack or Microsoft Teams. Get variance alerts, run quick reports, and share dashboards without leaving chat.</p></div>
    <div class="cs-card"><div class="cs-badge">In Development</div><div class="cs-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div><h3>Custom ML Model Training</h3><p>Train custom forecasting models on your company's historical data. Improve prediction accuracy by 40%+ with domain-specific model tuning.</p></div>
  </div>
</section>

<section class="cta-section">
  <h2>Ready to see these <span class="color-shift">features</span> in action?</h2>
  <p>Get a personalized demo of the Q1 2026 release tailored to your team's FP&A challenges.</p>
  <a class="cta-btn" href="FinanceOS-Contact.html">Request a Demo &rarr;</a>
</section>

<footer class="footer">2026 FinanceOS, Inc. All rights reserved. | SOC 2 Type II Certified | GDPR Compliant</footer>


` }} />
    </>
  );
}
