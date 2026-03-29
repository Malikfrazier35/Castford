'use client';

import { useEffect, useRef } from 'react';

export default function V3ResourcesOriginalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `let activeFilter='all';
function setFilter(type,el){
  activeFilter=type;
  document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  filterContent();
}
function filterContent(){
  const q=document.getElementById('searchInput').value.toLowerCase();
  const cards=document.querySelectorAll('.res-card');
  let count=0;
  cards.forEach(c=>{
    const type=c.dataset.type;
    const tags=(c.dataset.tags||'')+' '+c.textContent.toLowerCase();
    const matchType=activeFilter==='all'||type===activeFilter;
    const matchSearch=!q||tags.includes(q);
    if(matchType&&matchSearch){c.classList.remove('hidden');count++;}
    else{c.classList.add('hidden');}
  });
  document.getElementById('resultCount').textContent='Showing '+count+' resource'+(count!==1?'s':'');
}
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target);}});},{threshold:0.1});
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
body{font-family:var(--font);color:var(--t1);-webkit-font-smoothing:antialiased;background:var(--bg);overflow-x:hidden;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.reveal{opacity:0;transform:translateY(24px);transition:all 0.6s var(--ease);}.reveal.vis{opacity:1;transform:none;}

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
.dropdown a .dd-icon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;}
.dropdown a .dd-icon svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.5;}
.dd-sep{height:1px;background:rgba(255,255,255,0.06);margin:4px 0;}
.nav-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.btn-ghost{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid rgba(255,255,255,0.12);background:transparent;color:rgba(255,255,255,0.7);cursor:pointer;transition:all 0.2s;text-decoration:none;}.btn-ghost:hover{color:#fff;}
.btn-primary{padding:8px 22px;border-radius:8px;font-size:13px;font-weight:700;border:none;background:var(--green);color:#fff;cursor:pointer;transition:all 0.25s var(--ease);text-decoration:none;}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(16,185,129,0.25);}

/* HERO */
.hero{padding:60px 40px 40px;text-align:center;background:linear-gradient(180deg,#030711 0%,#0F172A 100%);color:#fff;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,0.06),transparent 70%);pointer-events:none;}
.hero h1{font-size:clamp(28px,4vw,42px);font-weight:900;letter-spacing:-0.03em;margin-bottom:10px;}
.hero p{font-size:16px;color:rgba(255,255,255,0.5);margin-bottom:28px;max-width:500px;margin-left:auto;margin-right:auto;}
.search-wrap{max-width:560px;margin:0 auto 24px;position:relative;}
.search-wrap input{width:100%;padding:14px 18px 14px 44px;border-radius:14px;border:2px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);font-size:15px;font-family:var(--font);color:#fff;outline:none;transition:border-color 0.2s;backdrop-filter:blur(8px);}
.search-wrap input::placeholder{color:rgba(255,255,255,0.3);}
.search-wrap input:focus{border-color:var(--cyan);}
.search-wrap svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;stroke:rgba(255,255,255,0.3);fill:none;stroke-width:2;}
.filter-tabs{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;}
.filter-tab{padding:7px 16px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(255,255,255,0.5);font-family:var(--font);}
.filter-tab:hover{color:#fff;border-color:rgba(255,255,255,0.2);}
.filter-tab.active{background:var(--green);border-color:var(--green);color:#fff;}
.result-count{font-size:12px;color:rgba(255,255,255,0.3);margin-top:16px;}

/* FEATURED BANNER */
.featured-banner{max-width:1100px;margin:0 auto;padding:30px 40px;}
.fb-card{background:linear-gradient(135deg,#1E1B4B,#030711);border:1px solid rgba(139,92,246,0.15);border-radius:20px;padding:40px;display:flex;align-items:center;gap:40px;transition:all 0.3s;cursor:pointer;text-decoration:none;color:#fff;position:relative;overflow:hidden;}
.fb-card:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(139,92,246,0.1);}
.fb-card::before{content:'';position:absolute;top:-100px;right:-100px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,0.06),transparent 70%);}
.fb-left{flex:1;}
.fb-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;background:rgba(139,92,246,0.15);color:var(--purple);margin-bottom:14px;}
.fb-badge .dot{width:6px;height:6px;border-radius:50%;background:var(--purple);animation:pulse 2s ease infinite;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.fb-left h2{font-size:26px;font-weight:900;margin-bottom:8px;letter-spacing:-0.02em;}
.fb-left p{font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;margin-bottom:16px;}
.fb-cta{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:var(--cyan);}
.fb-right{width:200px;height:140px;border-radius:14px;background:linear-gradient(135deg,var(--purple),var(--cyan));display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.fb-right svg{width:48px;height:48px;stroke:#fff;fill:none;stroke-width:1.5;}

/* CONTENT GRID */
.content-section{max-width:1100px;margin:0 auto;padding:20px 40px 60px;}
.content-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.res-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all 0.3s var(--ease);cursor:pointer;text-decoration:none;color:inherit;}
.res-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.06);}
.res-card.hidden{display:none;}
.rc-cover{height:130px;position:relative;display:flex;align-items:center;justify-content:center;padding:20px;}
.rc-cover .rc-type-float{position:absolute;top:10px;left:10px;padding:3px 10px;border-radius:6px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;color:#fff;background:rgba(0,0,0,0.3);backdrop-filter:blur(6px);}
.rc-cover .rc-upcoming{position:absolute;top:10px;right:10px;padding:3px 10px;border-radius:6px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;background:var(--amber);color:#fff;}
.rc-cover .rc-title-overlay{font-size:17px;font-weight:900;color:#fff;text-align:center;text-shadow:0 2px 8px rgba(0,0,0,0.3);line-height:1.25;max-width:90%;}
.rc-body{padding:18px;}
.rc-meta{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.rc-meta .type-badge{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;padding:3px 8px;border-radius:6px;}
.rc-meta .date{font-size:11px;color:var(--t4);margin-left:auto;}
.rc-body h4{font-size:14px;font-weight:800;margin-bottom:4px;line-height:1.3;}
.rc-body p{font-size:12px;color:var(--t3);line-height:1.5;margin-bottom:8px;}
.rc-footer{display:flex;align-items:center;justify-content:space-between;}
.rc-footer .rc-time{font-size:11px;color:var(--t4);font-weight:600;}
.rc-footer .rc-author{font-size:10px;color:var(--t4);}

/* WEBINARS */
.webinars{max-width:1100px;margin:0 auto;padding:40px;background:#fff;border-radius:var(--radius);margin-bottom:40px;}
.webinars h2{font-size:24px;font-weight:900;margin-bottom:24px;letter-spacing:-0.02em;}
.web-list{display:flex;flex-direction:column;gap:12px;}
.web-item{display:flex;align-items:center;gap:20px;padding:18px;border:1px solid var(--border);border-radius:14px;transition:all 0.3s;}
.web-item:hover{border-color:var(--cyan);box-shadow:0 4px 20px rgba(34,211,238,0.06);}
.web-date{text-align:center;min-width:60px;}
.web-date .wd-month{font-size:10px;font-weight:700;text-transform:uppercase;color:var(--cyan);}
.web-date .wd-day{font-size:26px;font-weight:900;font-family:var(--mono);}
.web-info{flex:1;}
.web-info h4{font-size:14px;font-weight:800;margin-bottom:2px;}
.web-info p{font-size:12px;color:var(--t3);}
.web-time{font-size:11px;color:var(--t4);font-weight:600;min-width:100px;text-align:right;}
.web-btn{padding:8px 18px;border-radius:8px;font-size:11px;font-weight:700;border:none;background:var(--cyan);color:#fff;cursor:pointer;transition:all 0.2s;white-space:nowrap;}.web-btn:hover{transform:translateY(-2px);}
.web-btn.replay{background:rgba(34,211,238,0.08);color:var(--cyan);border:1px solid rgba(34,211,238,0.2);}

/* SUPPORT */
.support{max-width:1100px;margin:0 auto;padding:0 40px 40px;}
.support h2{font-size:24px;font-weight:900;margin-bottom:24px;}
.sup-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.sup-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:28px;text-align:center;transition:all 0.3s;cursor:pointer;}.sup-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.05);}
.sup-icon{width:52px;height:52px;border-radius:14px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;}
.sup-icon svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:1.5;}
.sup-card h4{font-size:15px;font-weight:800;margin-bottom:6px;}
.sup-card p{font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:14px;}
.sup-link{font-size:12px;font-weight:700;color:var(--blue);text-decoration:none;}

/* NEWSLETTER */
.newsletter{max-width:700px;margin:0 auto;padding:40px;text-align:center;}
.newsletter h3{font-size:22px;font-weight:900;margin-bottom:8px;}
.newsletter p{font-size:14px;color:var(--t3);margin-bottom:20px;}
.nl-form{display:flex;gap:10px;max-width:420px;margin:0 auto;}
.nl-form input{flex:1;padding:12px 16px;border-radius:10px;border:1px solid var(--border);font-size:14px;font-family:var(--font);outline:none;background:#fff;}.nl-form input:focus{border-color:var(--cyan);}
.nl-form button{padding:12px 24px;border-radius:10px;font-size:13px;font-weight:700;border:none;background:var(--green);color:#fff;cursor:pointer;transition:all 0.2s;font-family:var(--font);}.nl-form button:hover{transform:translateY(-2px);}

.footer{padding:40px;background:#030711;text-align:center;font-size:12px;color:rgba(255,255,255,0.25);}

@media(max-width:768px){.content-grid{grid-template-columns:1fr;}.sup-grid{grid-template-columns:1fr;}.nav-links{display:none;}.fb-card{flex-direction:column;}.fb-right{width:100%;height:100px;}.nl-form{flex-direction:column;}}
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
    <div class="nav-item"><a href="FinanceOS-Resources.html" class="active">Resources <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></a>
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
  <h1>Resources & Learning Center</h1>
  <p>Guides, webinars, templates, and API docs to help you get the most out of FinanceOS</p>
  <div class="search-wrap"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><input type="text" placeholder="Search guides, templates, webinars..." id="searchInput" oninput="filterContent()"/></div>
  <div class="filter-tabs" id="filterTabs">
    <button class="filter-tab active" data-filter="all" onclick="setFilter('all',this)">All</button>
    <button class="filter-tab" data-filter="guide" onclick="setFilter('guide',this)">Guides</button>
    <button class="filter-tab" data-filter="webinar" onclick="setFilter('webinar',this)">Webinars</button>
    <button class="filter-tab" data-filter="template" onclick="setFilter('template',this)">Templates</button>
    <button class="filter-tab" data-filter="api" onclick="setFilter('api',this)">API Docs</button>
    <button class="filter-tab" data-filter="case-study" onclick="setFilter('case-study',this)">Case Studies</button>
    <button class="filter-tab" data-filter="video" onclick="setFilter('video',this)">Videos</button>
  </div>
  <div class="result-count" id="resultCount">Showing 12 resources</div>
</section>

<section class="featured-banner reveal">
  <a class="fb-card" href="FinanceOS-Whats-New.html">
    <div class="fb-left">
      <div class="fb-badge"><span class="dot"></span> NEW RELEASE</div>
      <h2>What's New in FinanceOS Q1 2026</h2>
      <p>AI Copilot 2.0 with visible reasoning chains, Real-Time Consolidation Engine, Scenario Modeling Pro, and 15 new connectors.</p>
      <span class="fb-cta">Explore the release &rarr;</span>
    </div>
    <div class="fb-right"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
  </a>
</section>

<section class="content-section reveal">
  <div class="content-grid" id="contentGrid">

    <div class="res-card" data-type="guide" data-tags="close books ai month-end fast">
      <div class="rc-cover" style="background:linear-gradient(135deg,#3B82F6,#8B5CF6);"><span class="rc-type-float">Guide</span><div class="rc-title-overlay">Close Your Books in 3 Days with AI</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(59,130,246,0.08);color:var(--blue);">Guide</span><span class="date">Mar 15, 2026</span></div><h4>How to close your books in 3 days using AI-powered automation</h4><p>Step-by-step playbook covering task automation, AI variance detection, and real-time reconciliation workflows.</p><div class="rc-footer"><span class="rc-time">18 min read</span><span class="rc-author">FinanceOS Team</span></div></div>
    </div>

    <div class="res-card" data-type="webinar" data-tags="consolidation multi-entity intercompany live">
      <div class="rc-cover" style="background:linear-gradient(135deg,#22D3EE,#8B5CF6);"><span class="rc-type-float">Webinar</span><span class="rc-upcoming">UPCOMING</span><div class="rc-title-overlay">Multi-Entity Consolidation Deep Dive</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(34,211,238,0.08);color:var(--cyan);">Webinar</span><span class="date">Mar 20, 2026</span></div><h4>Live: Multi-entity consolidation with intercompany elimination</h4><p>Join our product team for a 45-minute deep dive into real-time consolidation across entities, currencies, and standards.</p><div class="rc-footer"><span class="rc-time">45 min &middot; Live</span><span class="rc-author">Product Team</span></div></div>
    </div>

    <div class="res-card" data-type="template" data-tags="sox 404 compliance controls checklist audit">
      <div class="rc-cover" style="background:linear-gradient(135deg,#F59E0B,#EF4444);"><span class="rc-type-float">Template</span><div class="rc-title-overlay">SOX 404 Controls Checklist</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(245,158,11,0.08);color:var(--amber);">Template</span><span class="date">Mar 8, 2026</span></div><h4>Complete Section 404 internal controls checklist for 2026</h4><p>Downloadable checklist covering all PCAOB-aligned control areas with FinanceOS automation mapping for each control point.</p><div class="rc-footer"><span class="rc-time">Downloadable</span><span class="rc-author">Compliance Team</span></div></div>
    </div>

    <div class="res-card" data-type="api" data-tags="integrations custom rest webhooks developer sdk">
      <div class="rc-cover" style="background:linear-gradient(135deg,#0F172A,#334155);"><span class="rc-type-float">API Doc</span><div class="rc-title-overlay">Building Custom Integrations</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(100,116,139,0.08);color:var(--t3);">API Doc</span><span class="date">Mar 12, 2026</span></div><h4>Building custom integrations with the FinanceOS REST API</h4><p>Complete guide to authentication, endpoints, webhooks, and SDK usage. Includes code samples in Python, Node.js, and cURL.</p><div class="rc-footer"><span class="rc-time">30 min read</span><span class="rc-author">Engineering Team</span></div></div>
    </div>

    <div class="res-card" data-type="case-study" data-tags="customer success close time roi saas">
      <div class="rc-cover" style="background:linear-gradient(135deg,#10B981,#22D3EE);"><span class="rc-type-float">Case Study</span><div class="rc-title-overlay">80% Faster Close at Acme Corp</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(16,185,129,0.08);color:var(--green);">Case Study</span><span class="date">Feb 28, 2026</span></div><h4>How Acme Corp cut month-end close from 15 days to 3 days</h4><p>Series C SaaS company eliminated manual reconciliation and automated variance detection, saving 200+ hours per quarter.</p><div class="rc-footer"><span class="rc-time">12 min read</span><span class="rc-author">Customer Success</span></div></div>
    </div>

    <div class="res-card" data-type="guide" data-tags="ai copilot natural language queries finance nlp">
      <div class="rc-cover" style="background:linear-gradient(135deg,#8B5CF6,#EC4899);"><span class="rc-type-float">Guide</span><div class="rc-title-overlay">AI Copilot Mastery</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(139,92,246,0.08);color:var(--purple);">Guide</span><span class="date">Mar 5, 2026</span></div><h4>AI Copilot: Natural language queries for financial analysis</h4><p>Learn to ask complex financial questions in plain English. Covers variance analysis, trend detection, forecasting, and report generation.</p><div class="rc-footer"><span class="rc-time">22 min read</span><span class="rc-author">AI Team</span></div></div>
    </div>

    <div class="res-card" data-type="guide" data-tags="revenue recognition saas asc 606 deferred">
      <div class="rc-cover" style="background:linear-gradient(135deg,#3B82F6,#10B981);"><span class="rc-type-float">Guide</span><div class="rc-title-overlay">SaaS Revenue Recognition</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(59,130,246,0.08);color:var(--blue);">Guide</span><span class="date">Feb 20, 2026</span></div><h4>Revenue recognition best practices for SaaS under ASC 606</h4><p>Comprehensive guide to handling deferred revenue, multi-element arrangements, and automated rev rec with FinanceOS.</p><div class="rc-footer"><span class="rc-time">25 min read</span><span class="rc-author">FinanceOS Team</span></div></div>
    </div>

    <div class="res-card" data-type="video" data-tags="netsuite connect integration setup erp">
      <div class="rc-cover" style="background:linear-gradient(135deg,#22D3EE,#3B82F6);"><span class="rc-type-float">Video</span><div class="rc-title-overlay">Connect NetSuite in 10 Min</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(34,211,238,0.08);color:var(--cyan);">Video</span><span class="date">Mar 1, 2026</span></div><h4>Connecting NetSuite to FinanceOS in 10 minutes</h4><p>Step-by-step video walkthrough of the OAuth setup, field mapping, and initial sync verification process.</p><div class="rc-footer"><span class="rc-time">8:12</span><span class="rc-author">Integration Team</span></div></div>
    </div>

    <div class="res-card" data-type="template" data-tags="benchmark report fpa kpi metrics saas">
      <div class="rc-cover" style="background:linear-gradient(135deg,#F59E0B,#F97316);"><span class="rc-type-float">Report</span><div class="rc-title-overlay">FP&A Benchmark Report 2026</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(245,158,11,0.08);color:var(--amber);">Template</span><span class="date">Feb 15, 2026</span></div><h4>FP&A benchmark report: KPIs and metrics for SaaS companies in 2026</h4><p>Data from 500+ finance teams on close times, forecast accuracy, headcount ratios, and tool adoption trends.</p><div class="rc-footer"><span class="rc-time">Downloadable PDF</span><span class="rc-author">Research Team</span></div></div>
    </div>

    <div class="res-card" data-type="webinar" data-tags="spreadsheets real-time fpa migration replay">
      <div class="rc-cover" style="background:linear-gradient(135deg,#8B5CF6,#3B82F6);"><span class="rc-type-float">Webinar</span><div class="rc-title-overlay">Spreadsheets to Real-Time FP&A</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(139,92,246,0.08);color:var(--purple);">Webinar</span><span class="date">Feb 10, 2026</span></div><h4>Replay: From spreadsheets to real-time FP&A in 48 hours</h4><p>Watch our most popular webinar on migrating from Excel-based planning to a live, connected FP&A platform.</p><div class="rc-footer"><span class="rc-time">52 min &middot; Replay</span><span class="rc-author">Product Team</span></div></div>
    </div>

    <div class="res-card" data-type="api" data-tags="webhooks real-time events streaming api">
      <div class="rc-cover" style="background:linear-gradient(135deg,#334155,#0F172A);"><span class="rc-type-float">API Doc</span><div class="rc-title-overlay">Webhooks & Real-Time Events</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(100,116,139,0.08);color:var(--t3);">API Doc</span><span class="date">Mar 10, 2026</span></div><h4>API reference: Webhooks, real-time events, and streaming</h4><p>Configure event subscriptions for close status changes, forecast updates, variance alerts, and integration sync events.</p><div class="rc-footer"><span class="rc-time">20 min read</span><span class="rc-author">Engineering Team</span></div></div>
    </div>

    <div class="res-card" data-type="case-study" data-tags="customer board reporting series b saas investor">
      <div class="rc-cover" style="background:linear-gradient(135deg,#10B981,#8B5CF6);"><span class="rc-type-float">Case Study</span><div class="rc-title-overlay">Board Reporting at Scale</div></div>
      <div class="rc-body"><div class="rc-meta"><span class="type-badge" style="background:rgba(16,185,129,0.08);color:var(--green);">Case Study</span><span class="date">Feb 5, 2026</span></div><h4>Series B SaaS uses FinanceOS for investor-grade board reporting</h4><p>How a 200-person SaaS company automated their board deck from 3 days of manual work to a single click.</p><div class="rc-footer"><span class="rc-time">10 min read</span><span class="rc-author">Customer Success</span></div></div>
    </div>

  </div>
</section>

<section class="webinars reveal" style="max-width:1020px;margin:0 auto 40px;padding:40px;">
  <h2>Upcoming & Recent Webinars</h2>
  <div class="web-list">
    <div class="web-item"><div class="web-date"><div class="wd-month">Apr</div><div class="wd-day">03</div></div><div class="web-info"><h4>AI-Powered Forecasting: Beyond Linear Models</h4><p>Learn how FinanceOS uses ML to improve forecast accuracy by 40%</p></div><div class="web-time">2:00 PM ET</div><button class="web-btn">Register</button></div>
    <div class="web-item"><div class="web-date"><div class="wd-month">Mar</div><div class="wd-day">20</div></div><div class="web-info"><h4>Multi-Entity Consolidation Deep Dive</h4><p>Real-time consolidation across entities, currencies, and standards</p></div><div class="web-time">1:00 PM ET</div><button class="web-btn">Register</button></div>
    <div class="web-item"><div class="web-date"><div class="wd-month">Mar</div><div class="wd-day">06</div></div><div class="web-info"><h4>From Spreadsheets to Real-Time FP&A</h4><p>Migration strategies and ROI analysis for switching from Excel</p></div><div class="web-time">Recorded</div><button class="web-btn replay">Watch Replay</button></div>
    <div class="web-item"><div class="web-date"><div class="wd-month">Feb</div><div class="wd-day">20</div></div><div class="web-info"><h4>SOX Compliance Automation Workshop</h4><p>Automating Section 404 controls testing with FinanceOS</p></div><div class="web-time">Recorded</div><button class="web-btn replay">Watch Replay</button></div>
  </div>
</section>

<section class="support reveal">
  <h2>Need Help?</h2>
  <div class="sup-grid">
    <div class="sup-card"><div class="sup-icon" style="background:rgba(59,130,246,0.08);color:var(--blue);"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg></div><h4>Documentation</h4><p>Comprehensive guides, API reference, and troubleshooting for every FinanceOS feature.</p><a class="sup-link" href="#">Browse docs &rarr;</a></div>
    <div class="sup-card"><div class="sup-icon" style="background:rgba(16,185,129,0.08);color:var(--green);"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div><h4>Community Forum</h4><p>Connect with 500+ finance professionals. Ask questions, share workflows, and learn from peers.</p><a class="sup-link" href="#">Join community &rarr;</a></div>
    <div class="sup-card"><div class="sup-icon" style="background:rgba(139,92,246,0.08);color:var(--purple);"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div><h4>Contact Support</h4><p>Our support team responds within 2 hours during business hours. Priority support for Growth+ plans.</p><a class="sup-link" href="FinanceOS-Contact.html">Submit a ticket &rarr;</a></div>
  </div>
</section>

<section class="newsletter reveal">
  <h3>Stay in the loop</h3>
  <p>Weekly finance tips, product updates, and best practices delivered to your inbox.</p>
  <div class="nl-form"><input type="email" placeholder="Enter your work email"/><button>Subscribe</button></div>
</section>

<footer class="footer">2026 FinanceOS, Inc. All rights reserved. | SOC 2 Type II Certified | GDPR Compliant</footer>


` }} />
    </>
  );
}
