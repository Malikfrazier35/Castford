'use client';

import { useEffect, useRef } from 'react';

export default function V3IntegrationsOriginalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `let activeCat='all';
function setCat(cat,el){
  activeCat=cat;
  document.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  filterAll();
}
function filterAll(){
  const q=document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('.int-card').forEach(c=>{
    const cat=c.dataset.cat;
    const name=c.dataset.name||'';
    const text=(name+' '+c.textContent).toLowerCase();
    const matchCat=activeCat==='all'||cat===activeCat;
    const matchSearch=!q||text.includes(q);
    if(matchCat&&matchSearch){c.classList.remove('hidden');}
    else{c.classList.add('hidden');}
  });
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
body{font-family:var(--font);color:var(--t1);-webkit-font-smoothing:antialiased;background:#fff;overflow-x:hidden;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes colorCycle{0%{color:#22D3EE}25%{color:#8B5CF6}50%{color:#10B981}75%{color:#3B82F6}100%{color:#22D3EE}}
@keyframes borderGlow{0%{border-color:rgba(34,211,238,0.2)}33%{border-color:rgba(139,92,246,0.2)}66%{border-color:rgba(16,185,129,0.2)}100%{border-color:rgba(34,211,238,0.2)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.reveal{opacity:0;transform:translateY(24px);transition:all 0.6s var(--ease);}.reveal.vis{opacity:1;transform:none;}
.color-shift{animation:colorCycle 6s ease infinite;}

/* NAV */
.nav{position:sticky;top:0;z-index:100;padding:0 40px;height:64px;display:flex;align-items:center;background:rgba(3,7,17,0.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.05);}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}.nav-logo svg{width:32px;height:32px;}.nav-logo span{font-size:17px;font-weight:800;color:#fff;letter-spacing:-0.03em;}
.nav-links{display:flex;gap:6px;margin-left:50px;}
.nav-item{position:relative;}
.nav-item>a{font-size:13px;font-weight:500;color:rgba(255,255,255,0.5);text-decoration:none;padding:8px 14px;border-radius:8px;transition:all 0.2s;display:flex;align-items:center;gap:4px;}
.nav-item>a:hover,.nav-item>a.active{color:#fff;background:rgba(255,255,255,0.06);}
.nav-item>a svg{width:10px;height:10px;stroke:currentColor;fill:none;stroke-width:2.5;opacity:0.5;}
.dropdown{position:absolute;top:100%;left:0;min-width:220px;background:#0F172A;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:8px;opacity:0;visibility:hidden;transform:translateY(8px);transition:all 0.25s var(--ease);box-shadow:0 20px 60px rgba(0,0,0,0.4);}
.nav-item:hover .dropdown{opacity:1;visibility:visible;transform:translateY(4px);}
.dropdown a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;font-size:12px;font-weight:500;color:rgba(255,255,255,0.6);text-decoration:none;transition:all 0.15s;}
.dropdown a:hover{background:rgba(255,255,255,0.06);color:#fff;}
.dropdown .dd-icon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.dropdown .dd-icon svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.5;}
.dd-sep{height:1px;background:rgba(255,255,255,0.06);margin:4px 0;}
.nav-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.btn-ghost{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid rgba(255,255,255,0.12);background:transparent;color:rgba(255,255,255,0.7);cursor:pointer;transition:all 0.2s;text-decoration:none;}.btn-ghost:hover{color:#fff;}
.btn-primary{padding:8px 22px;border-radius:8px;font-size:13px;font-weight:700;border:none;background:var(--green);color:#fff;cursor:pointer;transition:all 0.25s var(--ease);text-decoration:none;}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(16,185,129,0.25);}

/* HERO */
.hero{padding:80px 40px 60px;text-align:center;background:linear-gradient(180deg,#030711,#0F172A);color:#fff;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,0.05),transparent 60%);pointer-events:none;}
.hero h1{font-size:clamp(32px,4.5vw,50px);font-weight:900;letter-spacing:-0.03em;margin-bottom:14px;line-height:1.1;}
.hero h1 .accent{background:linear-gradient(135deg,var(--cyan),var(--purple),var(--green));background-size:200% 200%;animation:gradientShift 5s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero>p{font-size:16px;color:rgba(255,255,255,0.45);margin-bottom:28px;max-width:550px;margin-left:auto;margin-right:auto;}
.search-hero{max-width:560px;margin:0 auto 24px;position:relative;}
.search-hero input{width:100%;padding:14px 18px 14px 44px;border-radius:14px;border:2px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);font-size:15px;font-family:var(--font);color:#fff;outline:none;transition:border-color 0.2s;backdrop-filter:blur(8px);}
.search-hero input::placeholder{color:rgba(255,255,255,0.3);}
.search-hero input:focus{border-color:var(--cyan);}
.search-hero svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;stroke:rgba(255,255,255,0.3);fill:none;stroke-width:2;}
.cat-pills{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;}
.cat-pill{padding:7px 16px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(255,255,255,0.5);font-family:var(--font);}
.cat-pill:hover{color:#fff;border-color:rgba(255,255,255,0.2);}
.cat-pill.active{background:var(--green);border-color:var(--green);color:#fff;}

/* FEATURED */
.featured{max-width:1100px;margin:0 auto;padding:50px 40px 30px;}
.featured h2{font-size:24px;font-weight:900;margin-bottom:20px;letter-spacing:-0.02em;}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.feat-card{background:#fff;border:2px solid var(--border);border-radius:20px;padding:28px;transition:all 0.3s var(--ease);position:relative;}
.feat-card:hover{transform:translateY(-6px);box-shadow:0 16px 50px rgba(0,0,0,0.06);animation:borderGlow 3s ease infinite;}
.feat-card .pop{position:absolute;top:-10px;right:20px;padding:3px 12px;border-radius:8px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;background:var(--green);color:#fff;}
.fc-top{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
.fc-logo{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;flex-shrink:0;}
.fc-top h3{font-size:17px;font-weight:800;}
.fc-top .fc-cat{font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:0.03em;}
.feat-card p{font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:14px;}
.fc-features{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
.fc-feat{padding:3px 10px;border-radius:6px;font-size:10px;font-weight:600;background:var(--bg);color:var(--t3);border:1px solid var(--border);}
.fc-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:10px;font-size:12px;font-weight:700;border:none;background:var(--green);color:#fff;cursor:pointer;transition:all 0.2s;font-family:var(--font);}.fc-btn:hover{transform:translateY(-2px);}

/* ALL INTEGRATIONS */
.all-int{max-width:1100px;margin:0 auto;padding:30px 40px 60px;}
.all-int h2{font-size:24px;font-weight:900;margin-bottom:20px;}
.int-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.int-card{background:#fff;border:1px solid var(--border);border-radius:14px;padding:18px;display:flex;align-items:center;gap:14px;transition:all 0.25s var(--ease);cursor:pointer;}
.int-card:hover{border-color:var(--cyan);transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.04);}
.int-card.hidden{display:none;}
.ic-logo{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;flex-shrink:0;}
.ic-info{flex:1;min-width:0;}
.ic-info h4{font-size:13px;font-weight:700;margin-bottom:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ic-info .ic-cat{font-size:10px;color:var(--t4);font-weight:600;}
.ic-connect{padding:5px 12px;border-radius:6px;font-size:10px;font-weight:700;border:1px solid var(--border);background:#fff;color:var(--t2);cursor:pointer;transition:all 0.2s;flex-shrink:0;font-family:var(--font);}
.ic-connect:hover{border-color:var(--green);color:var(--green);}

/* HOW IT WORKS */
.how{max-width:900px;margin:0 auto;padding:60px 40px;}
.how h2{font-size:28px;font-weight:900;text-align:center;margin-bottom:50px;letter-spacing:-0.02em;}
.how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;position:relative;}
.how-grid::before{content:'';position:absolute;top:28px;left:16%;right:16%;height:2px;background:var(--border);}
.how-step{text-align:center;position:relative;z-index:1;}
.how-num{width:56px;height:56px;border-radius:50%;background:#fff;border:2px solid var(--green);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:var(--green);margin:0 auto 16px;font-family:var(--mono);}
.how-step h3{font-size:16px;font-weight:800;margin-bottom:6px;}
.how-step p{font-size:13px;color:var(--t3);line-height:1.5;}

/* API SECTION */
.api-section{max-width:1100px;margin:0 auto;padding:40px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;}
.api-left h2{font-size:28px;font-weight:900;margin-bottom:12px;letter-spacing:-0.02em;}
.api-left p{font-size:14px;color:var(--t3);line-height:1.7;margin-bottom:20px;}
.api-features{display:flex;flex-direction:column;gap:10px;margin-bottom:24px;}
.api-feat{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;color:var(--t2);}
.api-feat .af-dot{width:20px;height:20px;border-radius:6px;background:rgba(16,185,129,0.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.api-feat .af-dot svg{width:12px;height:12px;stroke:var(--green);fill:none;stroke-width:3;}
.api-link{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:var(--green);text-decoration:none;}.api-link:hover{gap:10px;}
.code-block{background:#0F172A;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px;overflow-x:auto;}
.code-block .cb-header{display:flex;align-items:center;gap:6px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.06);}
.code-block .cb-dot{width:8px;height:8px;border-radius:50%;}
.code-block .cb-label{margin-left:auto;font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);font-family:var(--mono);}
.code-block pre{font-family:var(--mono);font-size:12px;line-height:1.7;color:rgba(255,255,255,0.7);white-space:pre-wrap;}
.code-block .kw{color:var(--purple);}
.code-block .str{color:var(--green);}
.code-block .cm{color:rgba(255,255,255,0.25);}
.code-block .fn{color:var(--cyan);}
.code-block .num{color:var(--amber);}

/* CTA */
.cta{padding:80px 40px;background:linear-gradient(135deg,#030711,#1E1B4B);text-align:center;color:#fff;}
.cta h2{font-size:32px;font-weight:900;margin-bottom:12px;}
.cta p{font-size:15px;color:rgba(255,255,255,0.45);margin-bottom:28px;max-width:480px;margin-left:auto;margin-right:auto;}
.cta-btn{display:inline-flex;padding:16px 40px;border-radius:14px;font-size:16px;font-weight:700;background:var(--green);color:#fff;text-decoration:none;transition:all 0.25s var(--ease);}.cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(16,185,129,0.3);}

.footer{padding:40px;background:#030711;text-align:center;font-size:12px;color:rgba(255,255,255,0.25);}

@media(max-width:768px){.feat-grid{grid-template-columns:1fr;}.int-grid{grid-template-columns:repeat(2,1fr);}.api-section{grid-template-columns:1fr;}.how-grid{grid-template-columns:1fr;}.how-grid::before{display:none;}.nav-links{display:none;}}
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
  <h1>50+ Integrations.<br/><span class="accent">One Unified Model.</span></h1>
  <p>Connect your ERP, CRM, billing, and data warehouse in minutes. FinanceOS syncs everything in real-time.</p>
  <div class="search-hero"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><input type="text" placeholder="Search integrations..." id="searchInput" oninput="filterAll()"/></div>
  <div class="cat-pills" id="catPills">
    <button class="cat-pill active" onclick="setCat('all',this)">All</button>
    <button class="cat-pill" onclick="setCat('erp',this)">ERP</button>
    <button class="cat-pill" onclick="setCat('crm',this)">CRM</button>
    <button class="cat-pill" onclick="setCat('payments',this)">Payments</button>
    <button class="cat-pill" onclick="setCat('warehouse',this)">Data Warehouse</button>
    <button class="cat-pill" onclick="setCat('accounting',this)">Accounting</button>
    <button class="cat-pill" onclick="setCat('hr',this)">HR</button>
    <button class="cat-pill" onclick="setCat('productivity',this)">Productivity</button>
  </div>
</section>

<section class="featured reveal">
  <h2>Featured Integrations</h2>
  <div class="feat-grid">
    <div class="feat-card"><span class="pop">Most Popular</span>
      <div class="fc-top"><div class="fc-logo" style="background:linear-gradient(135deg,#1B72E8,#0F4A97);">N</div><div><h3>NetSuite</h3><div class="fc-cat">ERP &middot; General Ledger</div></div></div>
      <p>Bi-directional sync with Oracle NetSuite. Pull GL data, journal entries, AP/AR, and chart of accounts in real-time.</p>
      <div class="fc-features"><span class="fc-feat">GL Sync</span><span class="fc-feat">AP/AR</span><span class="fc-feat">Journal Entries</span><span class="fc-feat">Real-time</span></div>
      <button class="fc-btn">Connect NetSuite</button>
    </div>
    <div class="feat-card">
      <div class="fc-top"><div class="fc-logo" style="background:linear-gradient(135deg,#00A1E0,#0070D2);">S</div><div><h3>Salesforce</h3><div class="fc-cat">CRM &middot; Pipeline</div></div></div>
      <p>Sync pipeline data for revenue forecasting and deal-level analysis. Map opportunities to financial projections automatically.</p>
      <div class="fc-features"><span class="fc-feat">Pipeline Data</span><span class="fc-feat">Rev Forecast</span><span class="fc-feat">Deal Analysis</span><span class="fc-feat">Bi-directional</span></div>
      <button class="fc-btn">Connect Salesforce</button>
    </div>
    <div class="feat-card">
      <div class="fc-top"><div class="fc-logo" style="background:linear-gradient(135deg,#635BFF,#7A73FF);">S</div><div><h3>Stripe</h3><div class="fc-cat">Payments &middot; Billing</div></div></div>
      <p>Pull MRR, churn, subscription analytics, and revenue recognition data. Automatic ASC 606 compliance mapping.</p>
      <div class="fc-features"><span class="fc-feat">MRR/ARR</span><span class="fc-feat">Churn</span><span class="fc-feat">Rev Rec</span><span class="fc-feat">ASC 606</span></div>
      <button class="fc-btn">Connect Stripe</button>
    </div>
  </div>
</section>

<section class="all-int reveal">
  <h2>All Integrations</h2>
  <div class="int-grid" id="intGrid">
    <div class="int-card" data-cat="erp" data-name="netsuite"><div class="ic-logo" style="background:linear-gradient(135deg,#1B72E8,#0F4A97);">N</div><div class="ic-info"><h4>NetSuite</h4><span class="ic-cat">ERP</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="erp" data-name="sap"><div class="ic-logo" style="background:linear-gradient(135deg,#008FD3,#003B57);">S</div><div class="ic-info"><h4>SAP</h4><span class="ic-cat">ERP</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="erp" data-name="oracle"><div class="ic-logo" style="background:linear-gradient(135deg,#C74634,#8B2E24);">O</div><div class="ic-info"><h4>Oracle</h4><span class="ic-cat">ERP</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="erp" data-name="dynamics microsoft"><div class="ic-logo" style="background:linear-gradient(135deg,#00A4EF,#0078D4);">D</div><div class="ic-info"><h4>MS Dynamics</h4><span class="ic-cat">ERP</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="erp" data-name="sage intacct"><div class="ic-logo" style="background:linear-gradient(135deg,#00DC82,#00A85D);">S</div><div class="ic-info"><h4>Sage Intacct</h4><span class="ic-cat">ERP</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="crm" data-name="salesforce"><div class="ic-logo" style="background:linear-gradient(135deg,#00A1E0,#0070D2);">S</div><div class="ic-info"><h4>Salesforce</h4><span class="ic-cat">CRM</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="crm" data-name="hubspot"><div class="ic-logo" style="background:linear-gradient(135deg,#FF7A59,#FF5C35);">H</div><div class="ic-info"><h4>HubSpot</h4><span class="ic-cat">CRM</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="crm" data-name="pipedrive"><div class="ic-logo" style="background:linear-gradient(135deg,#1A1A1A,#444);">P</div><div class="ic-info"><h4>Pipedrive</h4><span class="ic-cat">CRM</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="payments" data-name="stripe"><div class="ic-logo" style="background:linear-gradient(135deg,#635BFF,#7A73FF);">S</div><div class="ic-info"><h4>Stripe</h4><span class="ic-cat">Payments</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="payments" data-name="braintree paypal"><div class="ic-logo" style="background:linear-gradient(135deg,#003087,#009CDE);">B</div><div class="ic-info"><h4>Braintree</h4><span class="ic-cat">Payments</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="payments" data-name="chargebee"><div class="ic-logo" style="background:linear-gradient(135deg,#FF6C37,#FF4F17);">C</div><div class="ic-info"><h4>Chargebee</h4><span class="ic-cat">Payments</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="payments" data-name="recurly"><div class="ic-logo" style="background:linear-gradient(135deg,#7B5EA7,#5C3D8F);">R</div><div class="ic-info"><h4>Recurly</h4><span class="ic-cat">Payments</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="warehouse" data-name="snowflake"><div class="ic-logo" style="background:linear-gradient(135deg,#29B5E8,#1A8FC4);">S</div><div class="ic-info"><h4>Snowflake</h4><span class="ic-cat">Data Warehouse</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="warehouse" data-name="bigquery google"><div class="ic-logo" style="background:linear-gradient(135deg,#4285F4,#EA4335);">B</div><div class="ic-info"><h4>BigQuery</h4><span class="ic-cat">Data Warehouse</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="warehouse" data-name="redshift aws amazon"><div class="ic-logo" style="background:linear-gradient(135deg,#E7157B,#232F3E);">R</div><div class="ic-info"><h4>Redshift</h4><span class="ic-cat">Data Warehouse</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="warehouse" data-name="databricks"><div class="ic-logo" style="background:linear-gradient(135deg,#FF3621,#C62700);">D</div><div class="ic-info"><h4>Databricks</h4><span class="ic-cat">Data Warehouse</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="accounting" data-name="quickbooks intuit"><div class="ic-logo" style="background:linear-gradient(135deg,#2CA01C,#108A00);">Q</div><div class="ic-info"><h4>QuickBooks</h4><span class="ic-cat">Accounting</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="accounting" data-name="xero"><div class="ic-logo" style="background:linear-gradient(135deg,#13B5EA,#0E8BBD);">X</div><div class="ic-info"><h4>Xero</h4><span class="ic-cat">Accounting</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="accounting" data-name="freshbooks"><div class="ic-logo" style="background:linear-gradient(135deg,#00BF6F,#009955);">F</div><div class="ic-info"><h4>FreshBooks</h4><span class="ic-cat">Accounting</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="hr" data-name="workday"><div class="ic-logo" style="background:linear-gradient(135deg,#F68D2E,#DC7A1E);">W</div><div class="ic-info"><h4>Workday</h4><span class="ic-cat">HR</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="hr" data-name="bamboohr bamboo"><div class="ic-logo" style="background:linear-gradient(135deg,#73C41D,#5DA016);">B</div><div class="ic-info"><h4>BambooHR</h4><span class="ic-cat">HR</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="hr" data-name="rippling"><div class="ic-logo" style="background:linear-gradient(135deg,#FED530,#E8C000);">R</div><div class="ic-info"><h4>Rippling</h4><span class="ic-cat">HR</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="productivity" data-name="slack"><div class="ic-logo" style="background:linear-gradient(135deg,#4A154B,#611F64);">S</div><div class="ic-info"><h4>Slack</h4><span class="ic-cat">Productivity</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="productivity" data-name="google workspace gmail drive"><div class="ic-logo" style="background:linear-gradient(135deg,#4285F4,#34A853);">G</div><div class="ic-info"><h4>Google Workspace</h4><span class="ic-cat">Productivity</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="productivity" data-name="microsoft 365 teams office"><div class="ic-logo" style="background:linear-gradient(135deg,#00A4EF,#7FBA00);">M</div><div class="ic-info"><h4>Microsoft 365</h4><span class="ic-cat">Productivity</span></div><button class="ic-connect">Connect</button></div>
    <div class="int-card" data-cat="productivity" data-name="notion"><div class="ic-logo" style="background:linear-gradient(135deg,#000,#333);">N</div><div class="ic-info"><h4>Notion</h4><span class="ic-cat">Productivity</span></div><button class="ic-connect">Connect</button></div>
  </div>
</section>

<section class="how reveal">
  <h2>Connect in <span class="color-shift">3 simple steps</span></h2>
  <div class="how-grid">
    <div class="how-step"><div class="how-num">1</div><h3>Select Integration</h3><p>Browse our library of 50+ pre-built connectors and select the tools your team uses.</p></div>
    <div class="how-step"><div class="how-num">2</div><h3>Authenticate</h3><p>One-click OAuth setup. No API keys, no credentials, no IT support needed.</p></div>
    <div class="how-step"><div class="how-num">3</div><h3>Data Syncs</h3><p>Your financial data flows in real-time. Historical data backfills automatically.</p></div>
  </div>
</section>

<section class="api-section reveal">
  <div class="api-left">
    <h2>Build Your Own with Our API</h2>
    <p>FinanceOS is API-first. Build custom integrations, automate workflows, and extend the platform to fit your exact needs.</p>
    <div class="api-features">
      <div class="api-feat"><span class="af-dot"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> RESTful API with full CRUD operations</div>
      <div class="api-feat"><span class="af-dot"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Real-time webhooks for 30+ event types</div>
      <div class="api-feat"><span class="af-dot"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> Python, Node.js, and Go SDKs</div>
      <div class="api-feat"><span class="af-dot"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span> 99.97% API uptime SLA</div>
    </div>
    <a class="api-link" href="FinanceOS-Resources.html">Read API Documentation &rarr;</a>
  </div>
  <div class="code-block">
    <div class="cb-header"><div class="cb-dot" style="background:#EF4444;"></div><div class="cb-dot" style="background:#F59E0B;"></div><div class="cb-dot" style="background:#10B981;"></div><span class="cb-label">api-example.js</span></div>
    <pre><span class="cm">// Fetch real-time revenue metrics</span>
<span class="kw">const</span> response = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'https://api.finance-os.app/v2/metrics'</span>, {
  headers: {
    <span class="str">'Authorization'</span>: <span class="str">\`Bearer \${API_KEY}\`</span>,
    <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>
  }
});

<span class="kw">const</span> { revenue, margins, forecast } = <span class="kw">await</span> response.<span class="fn">json</span>();

<span class="cm">// Revenue: $4.2M (+12.3% MoM)</span>
<span class="cm">// Gross Margin: 78.2%</span>
<span class="cm">// Q2 Forecast Confidence: 94.2%</span></pre>
  </div>
</section>

<section class="cta">
  <h2>Ready to connect your <span class="color-shift">stack</span>?</h2>
  <p>Set up your first integration in under 10 minutes. 30-day money-back guarantee.</p>
  <a class="cta-btn" href="FinanceOS-Contact.html">Subscribe Now &rarr;</a>
</section>

<footer class="footer">2026 FinanceOS, Inc. All rights reserved. | SOC 2 Type II Certified | GDPR Compliant</footer>


` }} />
    </>
  );
}
