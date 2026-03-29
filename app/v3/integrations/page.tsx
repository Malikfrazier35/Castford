'use client';

import { useEffect, useRef } from 'react';

export default function V3IntegrationsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `document.querySelectorAll('.pill').forEach(pill=>{pill.addEventListener('click',()=>{document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));pill.classList.add('active');const cat=pill.dataset.cat;document.querySelectorAll('.int-card').forEach(c=>{c.classList.toggle('hidden',cat!=='all'&&c.dataset.cat!==cat)})})});
const obs=new IntersectionObserver(e=>{e.forEach(el=>{if(el.isIntersecting)el.target.classList.add('visible')})},{threshold:0.1});
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
/* ===== SHARED NAV ===== */
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid #F1F5F9}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo-link{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;color:#0F172A;text-decoration:none;letter-spacing:-0.01em}
.logo-link .ldot{width:9px;height:9px;background:#10B981;border-radius:50%}
.nav-mid{display:flex;gap:4px;font-size:14px;font-weight:500;align-items:center}
.nav-mid a{color:#64748B;padding:8px 12px;border-radius:8px;text-decoration:none;transition:color .15s}
.nav-mid a:hover{color:#0F172A;background:rgba(0,0,0,0.03)}
.nav-end{display:flex;align-items:center;gap:10px}
.nav-end a{font-size:14px;font-weight:500;color:#64748B;padding:8px 12px;text-decoration:none;transition:color .15s}
.nav-end a:hover{color:#0F172A}
.btn-sub{display:inline-flex;align-items:center;padding:8px 18px;border-radius:8px;font-weight:600;font-size:13px;background:#10B981;color:#fff!important;text-decoration:none;border:none;cursor:pointer;transition:all .15s}
.btn-sub:hover{background:#059669;box-shadow:0 2px 12px rgba(16,185,129,0.25)}
@media(max-width:900px){.nav-mid{display:none}}

/* ===== SHARED FOOTER ===== */
footer{background:#F8FAFC;border-top:1px solid #E2E8F0;padding:56px 24px 24px}
.ft-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:40px;margin-bottom:40px}
.ft-brand p{font-size:13px;color:#64748B;line-height:1.6;max-width:240px;margin-top:10px}
.ft-col{display:flex;flex-direction:column;gap:8px}
.ft-col h5{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:#0F172A;margin-bottom:4px}
.ft-col a{font-size:13px;color:#64748B;text-decoration:none;transition:color .15s}
.ft-col a:hover{color:#0F172A}
.ft-bottom{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid #E2E8F0;font-size:12px;color:#64748B}
.ft-bottom a{color:#64748B;text-decoration:none;transition:color .15s}
.ft-bottom a:hover{color:#0F172A}
@media(max-width:768px){.ft-inner{grid-template-columns:1fr 1fr;gap:24px}}

:root{--green:#10B981;--green-50:#ECFDF5;--green-100:#D1FAE5;--green-600:#059669;--green-700:#047857;--bg:#FFFFFF;--bg-alt:#F8FAFC;--text:#0F172A;--text-sec:#334155;--muted:#64748B;--light:#94A3B8;--border:#E2E8F0;--border-lt:#F1F5F9;--shadow-sm:0 1px 3px rgba(0,0,0,0.06);--shadow-md:0 4px 6px -1px rgba(0,0,0,0.07);--shadow-lg:0 10px 15px -3px rgba(0,0,0,0.07);--font:'DM Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;--r:12px;--max-w:1200px}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6;overflow-x:hidden}
a{color:inherit;text-decoration:none}

/* NAV */
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid var(--border-lt)}
.nav-inner{max-width:var(--max-w);margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;letter-spacing:-0.01em}
.logo-dot{width:9px;height:9px;background:var(--green);border-radius:50%}
.nav-links{display:flex;gap:24px;font-size:14px;font-weight:500}
.nav-links a{color:var(--muted);transition:color .15s}
.nav-links a:hover,.nav-links a.active{color:var(--text)}
.nav-right{display:flex;align-items:center;gap:10px}
.nav-right a{font-size:14px;font-weight:500;color:var(--muted);padding:8px 12px}
.btn{display:inline-flex;align-items:center;gap:6px;border-radius:8px;font-weight:600;font-size:14px;border:none;cursor:pointer;font-family:var(--font);transition:all .15s;padding:9px 18px}
.btn-primary{background:var(--green);color:#fff}
.btn-primary:hover{background:var(--green-600);box-shadow:0 2px 12px rgba(16,185,129,0.25)}
.btn-outline{background:var(--bg);color:var(--text);border:1px solid var(--border)}
.btn-outline:hover{background:var(--bg-alt);border-color:#CBD5E1}
.btn-lg{padding:12px 26px;font-size:15px;border-radius:10px}

/* HERO */
.hero{padding:72px 24px 48px;text-align:center;background:linear-gradient(180deg,var(--green-50) 0%,var(--bg) 80%)}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 6px 6px 14px;border-radius:100px;font-size:13px;font-weight:500;color:var(--text-sec);background:var(--bg);border:1px solid var(--border);margin-bottom:20px;box-shadow:var(--shadow-sm)}
.hero-badge .tag{background:var(--green-100);color:var(--green-700);padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700}
.hero h1{font-size:clamp(34px,5vw,56px);font-weight:800;letter-spacing:-0.035em;line-height:1.08;margin-bottom:14px}
.hero p{font-size:17px;color:var(--text-sec);max-width:520px;margin:0 auto 20px;line-height:1.55}

/* CONNECTION HUB VISUAL */
.hub{max-width:600px;margin:0 auto;padding:40px 0}
.hub-center{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap}
.hub-logo{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-md);transition:transform .2s;background:var(--bg);border:1px solid var(--border-lt);overflow:hidden}
.hub-logo:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg)}
.hub-logo svg{width:28px;height:28px}
.hub-logo img{width:32px;height:32px;object-fit:contain}
.hub-connector{width:32px;height:2px;background:linear-gradient(90deg,var(--green),var(--green-100));border-radius:1px;flex-shrink:0}
.hub-main{width:64px;height:64px;border-radius:16px;background:var(--green);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(16,185,129,0.3);flex-shrink:0}
.hub-main svg{width:24px;height:24px;fill:#fff}

/* SECTION */
.section{max-width:var(--max-w);margin:0 auto;padding:80px 24px}
.section-header{text-align:center;margin-bottom:48px}
.section-header .overline{font-size:12px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px}
.section-header h2{font-size:clamp(26px,3.5vw,38px);font-weight:800;letter-spacing:-0.025em;margin-bottom:10px}
.section-header p{font-size:15px;color:var(--text-sec);max-width:480px;margin:0 auto}

/* PILLS */
.pills{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:36px}
.pill{padding:8px 18px;border-radius:100px;font-size:13px;font-weight:500;border:1px solid var(--border);color:var(--muted);background:var(--bg);cursor:pointer;transition:all .15s;font-family:var(--font)}
.pill:hover{border-color:#CBD5E1;color:var(--text)}
.pill.active{background:var(--green);border-color:var(--green);color:#fff}

/* INTEGRATION CARDS WITH REAL LOGOS */
.int-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.int-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:16px 18px;display:flex;align-items:center;gap:14px;transition:all .2s;cursor:pointer}
.int-card:hover{box-shadow:var(--shadow-md);border-color:#CBD5E1;transform:translateY(-1px)}
.int-card.hidden{display:none}
.int-logo{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;background:var(--bg-alt);border:1px solid var(--border-lt)}
.int-logo svg{width:24px;height:24px}
.int-info h4{font-size:14px;font-weight:600;margin-bottom:1px;letter-spacing:-0.01em}
.int-info p{font-size:12px;color:var(--muted);line-height:1.3}
.int-badge{font-size:10px;font-weight:600;color:var(--green-700);background:var(--green-100);padding:2px 8px;border-radius:100px;margin-left:auto;flex-shrink:0;white-space:nowrap}

/* HOW IT WORKS */
.how{background:var(--bg-alt);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;position:relative}
.steps::before{content:'';position:absolute;top:32px;left:18%;right:18%;height:2px;background:linear-gradient(90deg,var(--green),#0891B2,#7C3AED);opacity:0.15;border-radius:1px}
.step{text-align:center;position:relative;z-index:1}
.step-num{width:52px;height:52px;border-radius:50%;background:var(--bg);border:2px solid var(--green);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:20px;font-weight:700;color:var(--green);margin:0 auto 14px;box-shadow:var(--shadow-sm)}
.step h4{font-size:15px;font-weight:700;margin-bottom:6px}
.step p{font-size:13px;color:var(--text-sec);max-width:260px;margin:0 auto}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:48px 0}
.stat-card{text-align:center;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:24px 16px}
.stat-val{font-family:var(--mono);font-size:clamp(24px,2.5vw,32px);font-weight:700;color:var(--green);margin-bottom:2px;letter-spacing:-0.02em}
.stat-label{font-size:12px;color:var(--muted)}

/* API */
.api-section{background:var(--bg);border:1px solid var(--border);border-radius:16px;padding:40px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;box-shadow:var(--shadow-sm)}
.api-text h3{font-size:24px;font-weight:800;letter-spacing:-0.02em;margin-bottom:10px}
.api-text p{color:var(--text-sec);font-size:14px;line-height:1.6;margin-bottom:20px}
.api-terminal{background:#0F172A;border-radius:var(--r);overflow:hidden;font-family:var(--mono);font-size:12px;box-shadow:var(--shadow-lg)}
.api-t-header{padding:10px 14px;background:rgba(0,0,0,0.3);display:flex;gap:6px}
.api-t-header span{width:10px;height:10px;border-radius:50%}
.api-t-header span:nth-child(1){background:#EF4444}
.api-t-header span:nth-child(2){background:#F59E0B}
.api-t-header span:nth-child(3){background:#10B981}
.api-t-body{padding:16px;line-height:1.8;color:#94A3B8}
.api-t-body .kw{color:#67E8F9}
.api-t-body .str{color:#6EE7B7}
.api-t-body .cm{color:#334155}

/* CTA */
.cta{text-align:center;padding:80px 24px}
.cta h2{font-size:clamp(26px,3.5vw,38px);font-weight:800;letter-spacing:-0.025em;margin-bottom:10px}
.cta p{color:var(--text-sec);font-size:15px;margin-bottom:24px}
.cta-form{display:flex;gap:10px;max-width:420px;margin:0 auto}
.cta-form input{flex:1;padding:12px 16px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;font-family:var(--font);outline:none;transition:border .2s}
.cta-form input:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(16,185,129,0.1)}

/* FOOTER */
footer{background:var(--bg-alt);border-top:1px solid var(--border);padding:56px 24px 28px}
.footer-inner{max-width:var(--max-w);margin:0 auto;display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:40px;margin-bottom:40px}
.footer-brand .logo{margin-bottom:10px}
.footer-brand p{font-size:13px;color:var(--muted);max-width:200px}
.footer-col h5{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px}
.footer-col a{display:block;font-size:13px;color:var(--muted);margin-bottom:8px;transition:color .15s}
.footer-col a:hover{color:var(--green)}
.footer-bottom{max-width:var(--max-w);margin:0 auto;text-align:center;font-size:12px;color:var(--light);padding-top:20px;border-top:1px solid var(--border)}

@media(max-width:768px){.nav-links{display:none}.steps{grid-template-columns:1fr}.steps::before{display:none}.stats{grid-template-columns:repeat(2,1fr)}.api-section{grid-template-columns:1fr;padding:24px}.footer-inner{grid-template-columns:repeat(2,1fr)}.cta-form{flex-direction:column}}
@media(max-width:480px){.stats{grid-template-columns:1fr}.footer-inner{grid-template-columns:1fr}}
.fade-in{opacity:0;transform:translateY(16px);transition:opacity .5s,transform .5s}.fade-in.visible{opacity:1;transform:translateY(0)}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<nav>
  <div class="nav-inner">
    <a href="FinanceOS-Landing-V3.html" class="logo-link"><span class="ldot"></span>FinanceOS</a>
    <div class="nav-mid">
      <a href="FinanceOS-Solutions-Digital.html">Solutions</a>
      <a href="FinanceOS-Integrations-V3.html">Integrations</a>
      <a href="FinanceOS-Security-Zero-Trust.html">Trust</a>
      <a href="FinanceOS-Pricing-V3.html">Pricing</a>
      <a href="FinanceOS-vs-Competitors-V2.html">Compare</a>
      <a href="FinanceOS-Resources-V2.html">Resources</a>
    </div>
    <div class="nav-end">
      <a href="FinanceOS-Login-V2.html">Sign In</a>
      <a href="FinanceOS-Pricing-V3.html" class="btn-sub">Subscribe</a>
    </div>
  </div>
</nav>

<section class="hero">
  <div class="hero-badge">Crossed 200 connectors this month <span class="tag">NEW</span></div>
  <h1>Connect your entire financial stack</h1>
  <p>Sync ERPs, CRMs, HRIS, bank feeds, and data warehouses in minutes. No engineering required.</p>

  <!-- HUB VISUAL WITH REAL LOGOS -->
  <div class="hub">
    <div class="hub-center">
      <!-- NetSuite -->
      <div class="hub-logo"><svg viewBox="0 0 24 24"><path fill="#0071C5" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM3 8.73l8 4v8.54l-8-4V8.73zm10 12.54v-8.54l8-4v8.54l-8 4z"/></svg></div>
      <div class="hub-connector"></div>
      <!-- SAP -->
      <div class="hub-logo"><svg viewBox="0 0 24 24"><rect fill="#0053B6" rx="4" width="24" height="24"/><text x="12" y="15.5" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="700" font-size="9">SAP</text></svg></div>
      <div class="hub-connector"></div>
      <!-- FinanceOS center -->
      <div class="hub-main"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg></div>
      <div class="hub-connector"></div>
      <!-- Salesforce -->
      <div class="hub-logo"><svg viewBox="0 0 24 24"><path fill="#00A1E0" d="M10.1 5.3c.9-.9 2.1-1.5 3.5-1.5 1.7 0 3.2.9 4 2.2.7-.3 1.4-.5 2.2-.5 3 0 5.4 2.4 5.4 5.4s-2.4 5.4-5.4 5.4c-.4 0-.8 0-1.2-.1-.7 1.3-2.1 2.2-3.7 2.2-1 0-1.9-.3-2.6-.9-.8 1.4-2.3 2.3-4 2.3-2.6 0-4.6-2.1-4.6-4.6 0-.4.1-.8.2-1.2C2.3 13.2 1 11.4 1 9.3 1 6.5 3.3 4.2 6 4.2c1.6 0 3.1.7 4.1 1.8z"/></svg></div>
      <div class="hub-connector"></div>
      <!-- Stripe -->
      <div class="hub-logo"><svg viewBox="0 0 24 24"><rect fill="#635BFF" rx="4" width="24" height="24"/><path fill="#fff" d="M11.2 8.8c0-.7.6-1 1.5-1 1.3 0 3 .4 4.3 1.1V5.6c-1.4-.6-2.9-.8-4.3-.8-3.5 0-5.9 1.8-5.9 4.9 0 4.8 6.6 4 6.6 6.1 0 .8-.7 1.1-1.7 1.1-1.5 0-3.4-.6-4.9-1.4v3.4c1.7.7 3.3 1 4.9 1 3.6 0 6-1.8 6-4.9 0-5.2-6.5-4.3-6.5-6.2z"/></svg></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="section-header"><div class="overline">Browse Integrations</div><h2>Find the connectors your team needs</h2><p>All with OAuth, real-time sync, and zero code.</p></div>
  <div class="pills" id="pills">
    <button class="pill active" data-cat="all">All</button><button class="pill" data-cat="erp">ERP & Accounting</button><button class="pill" data-cat="crm">CRM & Revenue</button><button class="pill" data-cat="hris">HRIS & Workforce</button><button class="pill" data-cat="bank">Banking & Payments</button><button class="pill" data-cat="data">Data Warehouses</button><button class="pill" data-cat="bi">BI & Analytics</button>
  </div>
  <div class="int-grid" id="intGrid">
    <!-- ERP -->
    <div class="int-card" data-cat="erp">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#0071C5" rx="8" width="40" height="40"/><text x="20" y="24" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700" font-size="10">NS</text></svg></div>
      <div class="int-info"><h4>Oracle NetSuite</h4><p>Full GL, AP/AR, revenue sync</p></div><span class="int-badge">Popular</span>
    </div>
    <div class="int-card" data-cat="erp">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#0053B6" rx="8" width="40" height="40"/><text x="20" y="24" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700" font-size="9">SAP</text></svg></div>
      <div class="int-info"><h4>SAP S/4HANA</h4><p>Real-time financial data</p></div><span class="int-badge">Popular</span>
    </div>
    <div class="int-card" data-cat="erp">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#4CAF50" rx="8" width="40" height="40"/><path fill="#fff" d="M12 14h16v2H12zM12 19h16v2H12zM12 24h10v2H12z"/></svg></div>
      <div class="int-info"><h4>Sage Intacct</h4><p>Multi-entity consolidation</p></div>
    </div>
    <div class="int-card" data-cat="erp">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#2CA01C" rx="8" width="40" height="40"/><circle cx="20" cy="17" r="5" fill="#fff"/><path fill="#fff" d="M14 26c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg></div>
      <div class="int-info"><h4>QuickBooks</h4><p>SMB accounting connector</p></div><span class="int-badge">Popular</span>
    </div>
    <div class="int-card" data-cat="erp">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#13B5EA" rx="8" width="40" height="40"/><text x="20" y="25" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700" font-size="12">X</text></svg></div>
      <div class="int-info"><h4>Xero</h4><p>Cloud accounting sync</p></div>
    </div>
    <div class="int-card" data-cat="erp">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#003087" rx="8" width="40" height="40"/><text x="20" y="24" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700" font-size="8">D365</text></svg></div>
      <div class="int-info"><h4>Microsoft Dynamics</h4><p>D365 Finance & Operations</p></div>
    </div>

    <!-- CRM -->
    <div class="int-card" data-cat="crm">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#00A1E0" rx="8" width="40" height="40"/><path fill="#fff" d="M14 13c1.2-1.1 2.8-1.8 4.5-1.8 2.2 0 4.1 1.1 5.2 2.8.8-.3 1.7-.5 2.6-.5 3.2 0 5.7 2.5 5.7 5.7s-2.5 5.7-5.7 5.7c-.5 0-1-.1-1.5-.2-.9 1.6-2.6 2.7-4.5 2.7-1.2 0-2.3-.4-3.1-1.1-1 1.6-2.8 2.7-4.8 2.7-3.2 0-5.7-2.5-5.7-5.7 0-.5.1-1 .2-1.5C5.2 21.2 4 19.5 4 17.5c0-3.2 2.5-5.7 5.7-5.7 1.7 0 3.2.7 4.3 1.8z"/></svg></div>
      <div class="int-info"><h4>Salesforce</h4><p>Pipeline, bookings & ARR</p></div><span class="int-badge">Popular</span>
    </div>
    <div class="int-card" data-cat="crm">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#FF7A59" rx="8" width="40" height="40"/><path fill="#fff" d="M22 13v3h-4v8h4v3l5-7-5-7z"/></svg></div>
      <div class="int-info"><h4>HubSpot</h4><p>Deal stage & revenue data</p></div><span class="int-badge">Popular</span>
    </div>
    <div class="int-card" data-cat="crm">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#017737" rx="8" width="40" height="40"/><circle cx="15" cy="20" r="4" fill="#fff"/><circle cx="25" cy="16" r="3" fill="#fff"/><circle cx="25" cy="25" r="2.5" fill="#fff"/></svg></div>
      <div class="int-info"><h4>Pipedrive</h4><p>Sales pipeline connector</p></div>
    </div>
    <div class="int-card" data-cat="crm">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#E42527" rx="8" width="40" height="40"/><text x="20" y="24" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700" font-size="8">ZOHO</text></svg></div>
      <div class="int-info"><h4>Zoho CRM</h4><p>Lead & opportunity sync</p></div>
    </div>

    <!-- HRIS -->
    <div class="int-card" data-cat="hris">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#F68D2E" rx="8" width="40" height="40"/><circle cx="20" cy="15" r="5" fill="#fff"/><path fill="#fff" d="M12 28c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg></div>
      <div class="int-info"><h4>Workday</h4><p>Headcount, comp & workforce</p></div><span class="int-badge">Popular</span>
    </div>
    <div class="int-card" data-cat="hris">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#73C41D" rx="8" width="40" height="40"/><path fill="#fff" d="M14 18h12v2H14zM14 22h8v2H14zM18 12l4 4H14z"/></svg></div>
      <div class="int-info"><h4>BambooHR</h4><p>Employee data & payroll</p></div>
    </div>
    <div class="int-card" data-cat="hris">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#FEC400" rx="8" width="40" height="40"/><path fill="#333" d="M13 17h14v2H13zM13 21h14v2H13zM17 13h6v2h-6z"/></svg></div>
      <div class="int-info"><h4>Rippling</h4><p>Unified HR & spend</p></div>
    </div>
    <div class="int-card" data-cat="hris">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#D0271D" rx="8" width="40" height="40"/><text x="20" y="24" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700" font-size="9">ADP</text></svg></div>
      <div class="int-info"><h4>ADP</h4><p>Payroll & benefits</p></div>
    </div>

    <!-- Banking -->
    <div class="int-card" data-cat="bank">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#0A85EA" rx="8" width="40" height="40"/><rect fill="#fff" x="11" y="14" width="5" height="12" rx="2.5"/><rect fill="#fff" x="17.5" y="14" width="5" height="12" rx="2.5"/><rect fill="#fff" x="24" y="14" width="5" height="12" rx="2.5"/></svg></div>
      <div class="int-info"><h4>Plaid</h4><p>Bank feeds & transactions</p></div><span class="int-badge">Popular</span>
    </div>
    <div class="int-card" data-cat="bank">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#635BFF" rx="8" width="40" height="40"/><path fill="#fff" d="M17.2 15.8c0-.7.6-1 1.5-1 1.3 0 3 .4 4.3 1.1v-3.3c-1.4-.6-2.9-.8-4.3-.8-3.5 0-5.9 1.8-5.9 4.9 0 4.8 6.6 4 6.6 6.1 0 .8-.7 1.1-1.7 1.1-1.5 0-3.4-.6-4.9-1.4v3.4c1.7.7 3.3 1 4.9 1 3.6 0 6-1.8 6-4.9 0-5.2-6.5-4.3-6.5-6.2z"/></svg></div>
      <div class="int-info"><h4>Stripe</h4><p>Payment & subscription revenue</p></div><span class="int-badge">Popular</span>
    </div>
    <div class="int-card" data-cat="bank">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#F46036" rx="8" width="40" height="40"/><text x="20" y="24" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700" font-size="8">BREX</text></svg></div>
      <div class="int-info"><h4>Brex</h4><p>Corporate card spend</p></div>
    </div>
    <div class="int-card" data-cat="bank">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#5CCA68" rx="8" width="40" height="40"/><path fill="#fff" d="M12 20h16M20 12v16" stroke="#fff" stroke-width="2" fill="none"/></svg></div>
      <div class="int-info"><h4>Ramp</h4><p>Expense management</p></div>
    </div>
    <div class="int-card" data-cat="bank">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#5851EA" rx="8" width="40" height="40"/><circle cx="20" cy="20" r="6" fill="none" stroke="#fff" stroke-width="2"/><circle cx="20" cy="20" r="2" fill="#fff"/></svg></div>
      <div class="int-info"><h4>Mercury</h4><p>Startup banking</p></div>
    </div>

    <!-- Data -->
    <div class="int-card" data-cat="data">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#29B5E8" rx="8" width="40" height="40"/><path fill="#fff" d="M20 10l-8 4.5v11L20 30l8-4.5v-11L20 10zm0 3l5 2.8L20 18.6l-5-2.8L20 13zm-6 5l5 2.8v5.7l-5-2.9V18zm12 5.6l-5 2.9v-5.7l5-2.8v5.6z"/></svg></div>
      <div class="int-info"><h4>Snowflake</h4><p>Native data warehouse</p></div><span class="int-badge">Popular</span>
    </div>
    <div class="int-card" data-cat="data">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#4285F4" rx="8" width="40" height="40"/><text x="20" y="24" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700" font-size="8">BQ</text></svg></div>
      <div class="int-info"><h4>BigQuery</h4><p>Google Cloud analytics</p></div>
    </div>
    <div class="int-card" data-cat="data">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#E8432E" rx="8" width="40" height="40"/><path fill="#fff" d="M14 14l6 6-6 6M20 14l6 6-6 6"/></svg></div>
      <div class="int-info"><h4>Redshift</h4><p>AWS data warehouse</p></div>
    </div>
    <div class="int-card" data-cat="data">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#FF3621" rx="8" width="40" height="40"/><path fill="#fff" d="M13 20h4l3-6 3 12 3-6h4" stroke="#fff" stroke-width="2" fill="none"/></svg></div>
      <div class="int-info"><h4>Databricks</h4><p>Lakehouse analytics</p></div>
    </div>

    <!-- BI -->
    <div class="int-card" data-cat="bi">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#E97627" rx="8" width="40" height="40"/><rect fill="#fff" x="12" y="22" width="4" height="6" rx="1"/><rect fill="#fff" x="18" y="16" width="4" height="12" rx="1"/><rect fill="#fff" x="24" y="12" width="4" height="16" rx="1"/></svg></div>
      <div class="int-info"><h4>Tableau</h4><p>Dashboard & viz export</p></div>
    </div>
    <div class="int-card" data-cat="bi">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#F2C811" rx="8" width="40" height="40"/><rect fill="#333" x="13" y="18" width="4" height="10" rx="1"/><rect fill="#333" x="18" y="14" width="4" height="14" rx="1"/><rect fill="#333" x="23" y="16" width="4" height="12" rx="1"/></svg></div>
      <div class="int-info"><h4>Power BI</h4><p>Microsoft reporting</p></div>
    </div>
    <div class="int-card" data-cat="bi">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#4285F4" rx="8" width="40" height="40"/><circle cx="20" cy="20" r="6" fill="none" stroke="#fff" stroke-width="2"/><path fill="#fff" d="M20 16v8M16 20h8"/></svg></div>
      <div class="int-info"><h4>Looker</h4><p>Semantic model integration</p></div>
    </div>
    <div class="int-card" data-cat="bi">
      <div class="int-logo"><svg viewBox="0 0 40 40"><rect fill="#7B68EE" rx="8" width="40" height="40"/><path fill="#fff" d="M12 25l4-5 4 3 4-7 4 4" stroke="#fff" stroke-width="2" fill="none"/></svg></div>
      <div class="int-info"><h4>Mode</h4><p>Analytics notebooks</p></div>
    </div>
  </div>
</section>

<div class="how">
  <div class="section">
    <div class="section-header"><h2>Set up in 3 steps</h2><p>Most connectors go live in under 5 minutes.</p></div>
    <div class="steps">
      <div class="step fade-in"><div class="step-num">1</div><h4>Select connector</h4><p>Browse the library. We handle schema mapping automatically.</p></div>
      <div class="step fade-in"><div class="step-num">2</div><h4>Authenticate</h4><p>OAuth 2.0 or API key. AES-256 encryption at rest.</p></div>
      <div class="step fade-in"><div class="step-num">3</div><h4>Data flows</h4><p>Real-time or batch sync. Monitor from one dashboard.</p></div>
    </div>
  </div>
</div>

<section class="section">
  <div class="stats">
    <div class="stat-card fade-in"><div class="stat-val">200+</div><div class="stat-label">Connectors</div></div>
    <div class="stat-card fade-in"><div class="stat-val">< 5 min</div><div class="stat-label">Avg Setup</div></div>
    <div class="stat-card fade-in"><div class="stat-val">99.9%</div><div class="stat-label">Uptime SLA</div></div>
    <div class="stat-card fade-in"><div class="stat-val">Real-time</div><div class="stat-label">Sync Available</div></div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="api-section fade-in">
    <div class="api-text">
      <h3>Custom integrations with our API</h3>
      <p>RESTful API with webhooks, rate limiting, and SDKs in Python, Node.js, and Go. Push and pull financial data for any system not in our library.</p>
      <button class="btn btn-primary">View API Docs →</button>
    </div>
    <div class="api-terminal">
      <div class="api-t-header"><span></span><span></span><span></span></div>
      <div class="api-t-body">
        <span class="cm">// Pull actuals from any GL</span><br>
        <span class="kw">const</span> actuals = <span class="kw">await</span> financeOS.gl.query({<br>
        &nbsp;&nbsp;entity: <span class="str">"US-Corp"</span>,<br>
        &nbsp;&nbsp;period: <span class="str">"2026-Q1"</span>,<br>
        &nbsp;&nbsp;accounts: [<span class="str">"4000..4999"</span>]<br>
        });<br>
        <span class="cm">// 147 items in 82ms</span>
      </div>
    </div>
  </div>
</section>

<section class="cta">
  <h2>Ready to connect your stack?</h2>
  <p>Start syncing data in minutes — no credit card required.</p>
  <div class="cta-form"><input type="email" placeholder="you@company.com"><button class="btn btn-primary btn-lg">Get Started Free</button></div>
</section>

<footer>
  <div class="ft-inner">
    <div class="ft-brand">
      <a href="FinanceOS-Landing-V3.html" class="logo-link"><span class="ldot"></span>FinanceOS</a>
      <p>AI-native financial planning & analysis for modern finance teams.</p>
    </div>
    <div class="ft-col"><h5>Product</h5><a href="FinanceOS-Landing-V3.html">Platform</a><a href="FinanceOS-Integrations-V3.html">Integrations</a><a href="FinanceOS-Pricing-V3.html">Pricing</a><a href="FinanceOS-Security-Zero-Trust.html">Security</a></div>
    <div class="ft-col"><h5>Solutions</h5><a href="FinanceOS-Solutions-Digital.html">SaaS</a><a href="FinanceOS-Solutions-Digital.html">E-Commerce</a><a href="FinanceOS-xPA-Planning-V2.html">Cross-Dept Planning</a></div>
    <div class="ft-col"><h5>Resources</h5><a href="FinanceOS-Resources-V2.html">Resource Library</a><a href="FinanceOS-Whats-New-V2.html">Changelog</a></div>
    <div class="ft-col"><h5>Company</h5><a href="#">About</a><a href="#">Careers</a><a href="#">Contact</a></div>
  </div>
  <div class="ft-bottom">
    <span>&copy; 2026 FinanceOS, Inc.</span>
    <div style="display:flex;gap:20px"><a href="FinanceOS-Security-Zero-Trust.html">Privacy</a><a href="#">Terms</a><a href="FinanceOS-Security-Zero-Trust.html">Security</a></div>
  </div>
</footer>


` }} />
    </>
  );
}
