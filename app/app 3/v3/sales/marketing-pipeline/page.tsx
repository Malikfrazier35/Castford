'use client';

import { useEffect, useRef } from 'react';

export default function V3SalesMarketingPipelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const resources=[
  {id:1,title:"The State of AI in FP&A: 2026 Market Intelligence Report",desc:"Comprehensive analysis of AI adoption across 500+ enterprise finance teams. ROI benchmarks, model selection, compliance frameworks, and 3-year projections.",type:"report",category:"analyst",date:"Mar 2026",pages:"48",featured:true,img:"analyst"},
  {id:2,title:"CFO's Guide to AI-Powered Financial Planning",desc:"Step-by-step playbook for implementing AI in your FP&A workflow. Includes vendor evaluation matrix and implementation timeline.",type:"guide",category:"guides",date:"Mar 2026",pages:"32",img:"guide"},
  {id:3,title:"Enterprise FP&A Platform Comparison: FinanceOS vs Legacy Solutions",desc:"Side-by-side comparison of FinanceOS against Anaplan, Adaptive, Pigment, Mosaic, and Runway across 42 evaluation criteria.",type:"report",category:"analyst",date:"Feb 2026",pages:"28",img:"report"},
  {id:4,title:"Webinar: Building a Real-Time Close Process",desc:"Join our VP of Product and Coca-Cola's Controller for a live walkthrough of reducing close cycle from 12 days to 4 days using AI automation.",type:"webinar",category:"webinars",date:"Mar 28, 2026",pages:"60 min",img:"webinar"},
  {id:5,title:"Revenue Forecasting Template Pack",desc:"12 ready-to-use forecasting templates including SaaS MRR waterfall, retail same-store sales, and multi-entity consolidation models.",type:"template",category:"templates",date:"Mar 2026",pages:"12 files",img:"template"},
  {id:6,title:"The Enterprise CFO's Playbook for 2026",desc:"Strategic priorities, budget allocation frameworks, and AI adoption roadmap based on interviews with 50 Fortune 500 CFOs.",type:"report",category:"analyst",date:"Jan 2026",pages:"56",img:"whitepaper"},
  {id:7,title:"Financial Consolidation Best Practices Guide",desc:"Multi-entity consolidation workflows, intercompany eliminations, and currency translation strategies for growing enterprises.",type:"guide",category:"guides",date:"Feb 2026",pages:"24",img:"guide"},
  {id:8,title:"Webinar: AI Copilot Demo — From Variance to Insight in 30 Seconds",desc:"Live demonstration of FinanceOS AI Copilot analyzing variance reports, generating board memos, and forecasting scenarios in real time.",type:"webinar",category:"webinars",date:"Apr 2, 2026",pages:"45 min",img:"webinar"},
  {id:9,title:"Board Reporting Template Suite",desc:"Professional board deck templates, KPI dashboards, and executive summary frameworks used by 200+ enterprise CFOs.",type:"template",category:"templates",date:"Feb 2026",pages:"8 files",img:"template"},
  {id:10,title:"ROI Calculator: FP&A Platform Investment",desc:"Interactive model to calculate your expected ROI from implementing FinanceOS, including time savings, error reduction, and headcount impact.",type:"template",category:"templates",date:"Mar 2026",pages:"1 file",img:"template"},
  {id:11,title:"SaaS FP&A Benchmark Report: 2026 Edition",desc:"Key SaaS metrics benchmarked across 400 companies: NRR, CAC payback, burn multiple, Rule of 40, and runway analysis by stage.",type:"report",category:"analyst",date:"Mar 2026",pages:"36",img:"analyst"},
  {id:12,title:"Headcount Planning Guide for Hypergrowth Companies",desc:"Frameworks for building headcount models that scale, including hiring velocity, compensation benchmarking, and scenario planning.",type:"guide",category:"guides",date:"Jan 2026",pages:"20",img:"guide"},
];

let activeFilter='all';
function renderFilters(){
  const cats=[{l:"All Resources",v:"all"},{l:"Analyst Reports",v:"analyst"},{l:"Guides",v:"guides"},{l:"Webinars",v:"webinars"},{l:"Templates",v:"templates"}];
  document.getElementById('filterTabs').innerHTML=cats.map(c=>\`<button class="filter-btn \${activeFilter===c.v?'active':''}" onclick="setFilter('\${c.v}')">\${c.l}</button>\`).join('');
}
function setFilter(f){activeFilter=f;renderFilters();renderResources();}
function setSection(s){activeFilter=s==='reports'?'analyst':s;renderFilters();renderResources();document.getElementById('resources').scrollIntoView({behavior:'smooth'});}
function renderResources(){
  const filtered=activeFilter==='all'?resources:resources.filter(r=>r.category===activeFilter);
  document.getElementById('resultCount').textContent=filtered.length+' resources';
  document.getElementById('resourceGrid').innerHTML=filtered.map((r,i)=>\`<div class="resource-card fade" style="animation-delay:\${i*.06}s" onclick="showModal('\${r.id}')">
    <div class="resource-img \${r.img}"><div class="resource-img-tag">\${r.type}</div><div class="resource-img-text">\${r.title.split(':')[0]}</div></div>
    <div class="resource-body">
      <div class="resource-meta"><span class="tag" style="background:\${r.type==='report'?'var(--primary-light)':r.type==='guide'?'var(--green-bg)':r.type==='webinar'?'var(--purple-bg)':'var(--amber-bg)'};color:\${r.type==='report'?'var(--primary)':r.type==='guide'?'var(--green)':r.type==='webinar'?'var(--purple)':'var(--amber)'}">\${r.type.charAt(0).toUpperCase()+r.type.slice(1)}</span><span style="font-size:10px;color:var(--text-faint)">\${r.pages} \${r.type==='webinar'?'':'pages'}</span></div>
      <div class="resource-title">\${r.title}</div>
      <div class="resource-desc">\${r.desc}</div>
      <div class="resource-footer"><span class="resource-date">\${r.date}</span><span class="btn btn-outline btn-sm">\${r.type==='webinar'?'Register':'Download'} →</span></div>
    </div>
  </div>\`).join('');
}
let currentResource=null;
function showModal(id){
  currentResource=id;
  const r=resources.find(res=>res.id==id);
  if(r){document.getElementById('modalTitle').textContent='Download: '+r.title;document.getElementById('modalSub').textContent=r.desc;}
  else if(id==='newsletter'){document.getElementById('modalTitle').textContent='Subscribe to Finance Intelligence';document.getElementById('modalSub').textContent='Get weekly insights, analyst reports, and exclusive content.';}
  else if(id==='featured'){document.getElementById('modalTitle').textContent='Download: State of AI in FP&A 2026';document.getElementById('modalSub').textContent='48-page report covering AI adoption, ROI benchmarks, and market projections.';}
  document.getElementById('modalOverlay').classList.add('show');
}
function closeModal(){document.getElementById('modalOverlay').classList.remove('show');}
function submitForm(){
  const email=document.getElementById('formEmail').value;
  const first=document.getElementById('formFirst').value;
  const company=document.getElementById('formCompany').value;
  if(!email||!first){alert('Please fill in at least your email and first name.');return;}
  // In production: POST to /api/leads with UTM params
  document.querySelector('.modal-body').innerHTML=\`<div style="text-align:center;padding:24px 0"><div style="width:56px;height:56px;border-radius:50%;background:var(--green-bg);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px">✓</div><div style="font-size:18px;font-weight:800;font-family:var(--font-display);margin-bottom:8px">Check Your Email</div><div style="font-size:13px;color:var(--text-tertiary);line-height:1.6">We've sent the download link to <strong>\${email}</strong>. Also check your spam folder.</div><button class="btn btn-primary" style="margin-top:20px" onclick="closeModal()">Close</button></div>\`;
}
function subscribeNewsletter(){
  const email=document.getElementById('newsletterEmail').value;
  if(!email){showModal('newsletter');return;}
  document.querySelector('.newsletter-form').innerHTML=\`<div style="display:flex;align-items:center;gap:8px;color:var(--green);font-weight:700"><span style="font-size:18px">✓</span> Subscribed! Check \${email} for confirmation.</div>\`;
}
// Init
renderFilters();renderResources();
// Nav active state
document.querySelectorAll('.nav-link').forEach(el=>el.addEventListener('click',function(){document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));this.classList.add('active');}));`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
:root{
  --bg:#F8F9FB;--surface-0:#FFFFFF;--surface-1:#F4F5F7;--surface-2:#ECEEF3;
  --border:#E2E5EB;--border-subtle:#ECEEF3;
  --text-primary:#0A0F1A;--text-secondary:#3B4559;--text-tertiary:#6B7A94;--text-muted:#9CA7B8;--text-faint:#C2CAD6;
  --primary:#2563EB;--primary-dark:#1D4ED8;--primary-light:#EFF6FF;--primary-border:rgba(37,99,235,0.1);
  --purple:#7C3AED;--purple-bg:#F5F3FF;--purple-border:rgba(124,58,237,0.1);
  --green:#059669;--green-bg:#ECFDF5;--green-border:rgba(5,150,105,0.1);
  --amber:#D97706;--amber-bg:#FFFBEB;--amber-border:rgba(217,119,6,0.1);
  --red:#DC2626;--red-bg:#FEF2F2;--cyan:#0891B2;--cyan-bg:#ECFEFF;
  --font-display:'Inter',system-ui,sans-serif;--font-body:'Manrope',system-ui,sans-serif;--font-mono:'JetBrains Mono',monospace;
  --shadow-sm:0 1px 3px rgba(0,0,0,0.06);--shadow-md:0 4px 12px rgba(0,0,0,0.06);--shadow-lg:0 12px 24px rgba(0,0,0,0.08);
  --r:12px;--r-lg:16px;--r-xl:24px;
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text-primary);font-family:var(--font-body);-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.6}
::selection{background:var(--primary);color:#fff}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.fade{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) both}
a{text-decoration:none;color:inherit}
.container{max-width:1200px;margin:0 auto;padding:0 32px}
/* NAV */
.nav{background:var(--surface-0);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;backdrop-filter:blur(12px)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{display:flex;align-items:center;gap:10px}
.logo svg{width:28px;height:28px}
.logo-text{font-size:18px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)}
.nav-links{display:flex;align-items:center;gap:6px}
.nav-link{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;color:var(--text-secondary);transition:all .15s;cursor:pointer}
.nav-link:hover{background:var(--surface-1);color:var(--text-primary)}
.nav-link.active{background:var(--primary-light);color:var(--primary)}
.btn{font-family:var(--font-body);cursor:pointer;border:none;border-radius:8px;font-weight:700;font-size:13px;padding:10px 20px;display:inline-flex;align-items:center;gap:8px;transition:all .2s;white-space:nowrap}
.btn-primary{background:var(--primary);color:#fff}.btn-primary:hover{background:var(--primary-dark);box-shadow:0 4px 14px rgba(37,99,235,0.3);transform:translateY(-1px)}
.btn-outline{background:var(--surface-0);border:1px solid var(--border);color:var(--text-secondary)}.btn-outline:hover{border-color:var(--primary);color:var(--primary)}
.btn-sm{font-size:11px;padding:7px 14px}
.tag{display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.02em}
/* HERO */
.hero{padding:80px 0 60px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(37,99,235,0.05) 0%,transparent 70%)}
.hero-label{display:inline-flex;align-items:center;gap:6px;background:var(--primary-light);border:1px solid var(--primary-border);border-radius:20px;padding:6px 16px;font-size:12px;font-weight:700;color:var(--primary);margin-bottom:20px}
.hero h1{font-size:52px;font-weight:900;letter-spacing:-.04em;font-family:var(--font-display);line-height:1.1;margin-bottom:16px;max-width:700px;margin-left:auto;margin-right:auto}
.hero p{font-size:17px;color:var(--text-tertiary);max-width:540px;margin:0 auto 32px;line-height:1.7}
/* STATS BAR */
.stats-bar{display:flex;justify-content:center;gap:48px;margin-bottom:60px;padding:24px 0;border-top:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle)}
.stat{text-align:center}
.stat-value{font-size:28px;font-weight:900;font-family:var(--font-display);letter-spacing:-.03em}
.stat-label{font-size:11px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-top:2px}
/* FILTER TABS */
.filter-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px}
.filters{display:flex;gap:4px;background:var(--surface-1);border-radius:10px;padding:4px}
.filter-btn{padding:8px 18px;border-radius:8px;font-size:12px;font-weight:600;color:var(--text-muted);cursor:pointer;transition:all .15s;border:none;background:none;font-family:var(--font-body)}
.filter-btn:hover{color:var(--text-primary)}
.filter-btn.active{background:var(--surface-0);color:var(--text-primary);box-shadow:var(--shadow-sm);font-weight:700}
/* RESOURCE GRID */
.resource-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:48px}
.resource-card{background:var(--surface-0);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;transition:all .25s cubic-bezier(.16,1,.3,1);cursor:pointer}
.resource-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-4px);border-color:var(--primary-border)}
.resource-img{height:180px;background:linear-gradient(135deg,var(--primary) 0%,var(--purple) 100%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.resource-img.analyst{background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%)}
.resource-img.guide{background:linear-gradient(135deg,#059669 0%,#0891B2 100%)}
.resource-img.webinar{background:linear-gradient(135deg,#7C3AED 0%,#EC4899 100%)}
.resource-img.report{background:linear-gradient(135deg,#2563EB 0%,#3B82F6 100%)}
.resource-img.template{background:linear-gradient(135deg,#D97706 0%,#F59E0B 100%)}
.resource-img.whitepaper{background:linear-gradient(135deg,#0F172A 0%,#334155 100%)}
.resource-img-text{color:rgba(255,255,255,.9);font-size:36px;font-weight:900;font-family:var(--font-display);letter-spacing:-.03em;text-align:center;padding:0 20px;line-height:1.2}
.resource-img-tag{position:absolute;top:14px;left:14px;background:rgba(0,0,0,.4);backdrop-filter:blur(8px);color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:6px;letter-spacing:.04em;text-transform:uppercase}
.resource-body{padding:22px}
.resource-meta{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.resource-title{font-size:16px;font-weight:800;font-family:var(--font-display);letter-spacing:-.02em;margin-bottom:8px;line-height:1.3}
.resource-desc{font-size:13px;color:var(--text-tertiary);line-height:1.6;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.resource-footer{display:flex;align-items:center;justify-content:space-between}
.resource-date{font-size:11px;color:var(--text-faint);font-family:var(--font-mono)}
/* GATED DOWNLOAD MODAL */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.modal-overlay.show{display:flex}
.modal{background:var(--surface-0);border-radius:var(--r-xl);width:480px;max-width:90vw;box-shadow:var(--shadow-lg);overflow:hidden}
.modal-header{padding:28px 28px 0;display:flex;justify-content:space-between;align-items:flex-start}
.modal-body{padding:20px 28px 28px}
.form-group{margin-bottom:16px}
.form-label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin-bottom:6px}
.form-input{width:100%;border:1px solid var(--border);border-radius:8px;padding:11px 14px;font-family:var(--font-body);font-size:13px;color:var(--text-primary);outline:none;transition:border-color .15s}
.form-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(37,99,235,.08)}
.form-select{width:100%;border:1px solid var(--border);border-radius:8px;padding:11px 14px;font-family:var(--font-body);font-size:13px;color:var(--text-primary);outline:none;background:var(--surface-0);appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%239CA7B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center}
/* FEATURED BANNER */
.featured{background:linear-gradient(135deg,#0F172A 0%,#1E293B 60%,#0F172A 100%);border-radius:var(--r-xl);padding:48px;margin-bottom:48px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;color:#fff;position:relative;overflow:hidden}
.featured::before{content:'';position:absolute;top:-50%;right:-20%;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,.15),transparent 70%)}
.featured h2{font-size:28px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display);margin-bottom:12px}
.featured p{font-size:14px;color:rgba(255,255,255,.6);line-height:1.7;margin-bottom:20px}
.featured-visual{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.featured-stat{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:var(--r);padding:16px;text-align:center}
.featured-stat-val{font-size:24px;font-weight:900;font-family:var(--font-mono);letter-spacing:-.03em}
.featured-stat-label{font-size:10px;color:rgba(255,255,255,.4);font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-top:2px}
/* NEWSLETTER SECTION */
.newsletter{text-align:center;padding:64px 0;border-top:1px solid var(--border-subtle)}
.newsletter h2{font-size:28px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display);margin-bottom:8px}
.newsletter p{font-size:14px;color:var(--text-tertiary);margin-bottom:24px;max-width:400px;margin-left:auto;margin-right:auto}
.newsletter-form{display:flex;gap:8px;max-width:420px;margin:0 auto}
.newsletter-form input{flex:1;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-size:13px;font-family:var(--font-body);outline:none}
.newsletter-form input:focus{border-color:var(--primary)}
/* ANALYST QUOTES */
.analyst-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:48px}
.analyst-card{background:var(--surface-0);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;transition:all .2s}
.analyst-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}
.analyst-quote{font-size:14px;color:var(--text-secondary);line-height:1.7;margin-bottom:16px;font-style:italic}
.analyst-source{display:flex;align-items:center;gap:10px}
.analyst-logo{width:36px;height:36px;border-radius:8px;background:var(--surface-1);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;font-family:var(--font-display);color:var(--text-muted)}
/* FOOTER */
.footer{background:var(--surface-0);border-top:1px solid var(--border);padding:32px 0;margin-top:48px}
.footer-inner{display:flex;justify-content:space-between;align-items:center}
.footer-links{display:flex;gap:24px;font-size:12px;color:var(--text-muted)}
.footer-links a:hover{color:var(--primary)}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<!-- NAV -->
<nav class="nav"><div class="container"><div class="nav-inner">
  <div class="logo"><svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#059669"/></svg><span class="logo-text">FinanceOS</span></div>
  <div class="nav-links">
    <span class="nav-link" onclick="setSection('all')">All Resources</span>
    <span class="nav-link" onclick="setSection('reports')">Analyst Reports</span>
    <span class="nav-link" onclick="setSection('guides')">Guides</span>
    <span class="nav-link" onclick="setSection('webinars')">Webinars</span>
    <span class="nav-link" onclick="setSection('templates')">Templates</span>
  </div>
  <div style="display:flex;gap:8px"><a href="https://finance-os.app" class="btn btn-outline btn-sm">Login</a><a href="https://finance-os.app" class="btn btn-primary btn-sm">Get Started Free</a></div>
</div></div></nav>

<!-- HERO -->
<section class="hero"><div class="container">
  <div class="hero-label fade">◎ New: 2026 FP&A Market Landscape Report</div>
  <h1 class="fade" style="animation-delay:.1s">The Finance Intelligence Library</h1>
  <p class="fade" style="animation-delay:.2s">Analyst reports, benchmark data, strategy guides, and templates trusted by 2,000+ finance teams at companies like Coca-Cola, Best Buy, and Target.</p>
  <div style="display:flex;gap:10px;justify-content:center" class="fade" style="animation-delay:.3s">
    <button class="btn btn-primary" onclick="showModal('newsletter')">Subscribe to Updates</button>
    <button class="btn btn-outline" onclick="document.getElementById('resources').scrollIntoView({behavior:'smooth'})">Browse Resources ↓</button>
  </div>
</div></section>

<!-- STATS BAR -->
<div class="container"><div class="stats-bar fade">
  <div class="stat"><div class="stat-value" style="color:var(--primary)">47</div><div class="stat-label">Published Reports</div></div>
  <div class="stat"><div class="stat-value" style="color:var(--purple)">12K+</div><div class="stat-label">Downloads This Quarter</div></div>
  <div class="stat"><div class="stat-value" style="color:var(--green)">2,000+</div><div class="stat-label">Finance Teams Subscribed</div></div>
  <div class="stat"><div class="stat-value" style="color:var(--amber)">Weekly</div><div class="stat-label">New Content Cadence</div></div>
</div></div>

<!-- FEATURED REPORT -->
<div class="container"><div class="featured fade">
  <div>
    <span class="tag" style="background:rgba(37,99,235,.2);color:#93C5FD;margin-bottom:16px">FLAGSHIP REPORT · MARCH 2026</span>
    <h2>The State of AI in FP&A: 2026 Market Intelligence Report</h2>
    <p>Our most comprehensive analysis of AI adoption across 500+ enterprise finance teams. Covers ROI benchmarks, model selection, compliance frameworks, and 3-year market projections.</p>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" onclick="showModal('featured')">Download Free Report</button>
      <button class="btn" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#fff" onclick="showModal('featured')">Read Executive Summary</button>
    </div>
  </div>
  <div class="featured-visual">
    <div class="featured-stat"><div class="featured-stat-val" style="color:#60A5FA">73%</div><div class="featured-stat-label">AI Adoption Rate</div></div>
    <div class="featured-stat"><div class="featured-stat-val" style="color:#6EE7B7">4.2x</div><div class="featured-stat-label">Average ROI</div></div>
    <div class="featured-stat"><div class="featured-stat-val" style="color:#C084FC">68%</div><div class="featured-stat-label">Budget Increase YoY</div></div>
    <div class="featured-stat"><div class="featured-stat-val" style="color:#FBBF24">$12.8B</div><div class="featured-stat-label">Market Size 2026</div></div>
  </div>
</div></div>

<!-- ANALYST QUOTES -->
<div class="container" style="margin-bottom:48px">
  <div style="text-align:center;margin-bottom:28px"><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:6px">Industry Recognition</div><h2 style="font-size:24px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">What Analysts Say</h2></div>
  <div class="analyst-grid">
    <div class="analyst-card fade"><div class="analyst-quote">"FinanceOS represents the next generation of FP&A platforms, combining real-time intelligence with enterprise-grade security. Their AI-first approach is reshaping how CFOs operate."</div><div class="analyst-source"><div class="analyst-logo">G</div><div><div style="font-size:12px;font-weight:700">Gartner</div><div style="font-size:10px;color:var(--text-muted)">Market Guide for Cloud FP&A, 2026</div></div></div></div>
    <div class="analyst-card fade" style="animation-delay:.1s"><div class="analyst-quote">"Among emerging FP&A vendors, FinanceOS stands out for its speed-to-value, with customers reporting 60% faster close cycles and 4x improvement in forecast accuracy within the first quarter."</div><div class="analyst-source"><div class="analyst-logo">F</div><div><div style="font-size:12px;font-weight:700">Forrester</div><div style="font-size:10px;color:var(--text-muted)">Wave: Financial Planning, Q1 2026</div></div></div></div>
    <div class="analyst-card fade" style="animation-delay:.2s"><div class="analyst-quote">"The personalized dashboard approach is a competitive differentiator. Enterprise clients get branded portals that integrate seamlessly with existing workflows, driving 95% user adoption."</div><div class="analyst-source"><div class="analyst-logo">IDC</div><div><div style="font-size:12px;font-weight:700">IDC</div><div style="font-size:10px;color:var(--text-muted)">MarketScape: EPM Vendors, 2026</div></div></div></div>
  </div>
</div>

<!-- RESOURCE GRID -->
<div class="container" id="resources">
  <div class="filter-bar fade">
    <div class="filters" id="filterTabs"></div>
    <span style="font-size:12px;color:var(--text-muted)" id="resultCount"></span>
  </div>
  <div class="resource-grid" id="resourceGrid"></div>
</div>

<!-- NEWSLETTER -->
<div class="container"><div class="newsletter fade">
  <h2>Stay Ahead of the Curve</h2>
  <p>Join 2,000+ finance leaders getting weekly insights on AI, FP&A strategy, and market intelligence.</p>
  <div class="newsletter-form">
    <input type="email" placeholder="Enter your work email" id="newsletterEmail">
    <button class="btn btn-primary" onclick="subscribeNewsletter()">Subscribe</button>
  </div>
  <div style="font-size:11px;color:var(--text-faint);margin-top:10px">No spam. Unsubscribe anytime. SOC 2 compliant data handling.</div>
</div></div>

<!-- FOOTER -->
<div class="footer"><div class="container"><div class="footer-inner">
  <div style="display:flex;align-items:center;gap:8px"><svg width="20" height="20" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg2" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg2)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#059669"/></svg><span style="font-size:13px;font-weight:800;font-family:var(--font-display)">FinanceOS</span><span style="font-size:10px;color:var(--text-muted);margin-left:4px">© 2026</span></div>
  <div class="footer-links"><a href="https://finance-os.app">Home</a><a href="https://finance-os.app/privacy">Privacy</a><a href="https://finance-os.app/terms">Terms</a><a href="https://calendly.com/finance-os-support/30min">Book a Demo</a></div>
</div></div></div>

<!-- GATED DOWNLOAD MODAL -->
<div class="modal-overlay" id="modalOverlay" onclick="if(event.target===this)closeModal()">
  <div class="modal">
    <div class="modal-header">
      <div><div style="font-size:18px;font-weight:900;font-family:var(--font-display);letter-spacing:-.02em" id="modalTitle">Download Resource</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px" id="modalSub">Complete the form below to access this resource.</div></div>
      <button style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--text-muted);padding:4px" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label class="form-label">Work Email</label><input class="form-input" type="email" placeholder="you@company.com" id="formEmail"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group"><label class="form-label">First Name</label><input class="form-input" type="text" placeholder="Jane" id="formFirst"></div>
        <div class="form-group"><label class="form-label">Last Name</label><input class="form-input" type="text" placeholder="Smith" id="formLast"></div>
      </div>
      <div class="form-group"><label class="form-label">Company</label><input class="form-input" type="text" placeholder="Acme Corp" id="formCompany"></div>
      <div class="form-group"><label class="form-label">Role</label><select class="form-select" id="formRole"><option value="">Select your role...</option><option>CFO / VP Finance</option><option>Controller</option><option>FP&A Director / Manager</option><option>Treasurer</option><option>Financial Analyst</option><option>Accounting Manager</option><option>CEO / COO</option><option>Other</option></select></div>
      <div class="form-group"><label class="form-label">Company Size</label><select class="form-select" id="formSize"><option value="">Select company size...</option><option>1-50</option><option>51-200</option><option>201-1,000</option><option>1,001-5,000</option><option>5,001-10,000</option><option>10,000+</option></select></div>
      <button class="btn btn-primary" style="width:100%;justify-content:center;padding:14px 0;font-size:14px;margin-top:8px" onclick="submitForm()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download Now
      </button>
      <div style="font-size:10px;color:var(--text-faint);text-align:center;margin-top:10px">By downloading, you agree to receive relevant content from FinanceOS. Unsubscribe anytime.</div>
    </div>
  </div>
</div>


` }} />
    </>
  );
}
