'use client';

import { useEffect, useRef } from 'react';

export default function V3SolutionsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));`
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

:root{--green:#10B981;--green-light:#D1FAE5;--green-dark:#059669;--cyan:#0891B2;--purple:#7C3AED;--blue:#2563EB;--amber:#D97706;--bg:#FFFFFF;--bg-alt:#F8FAFC;--bg-card:#FFFFFF;--text:#1E293B;--text-secondary:#475569;--muted:#64748B;--border:#E2E8F0;--border-light:#F1F5F9;--shadow:0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04);--shadow-md:0 4px 6px -1px rgba(0,0,0,0.08),0 2px 4px -2px rgba(0,0,0,0.04);--shadow-lg:0 10px 15px -3px rgba(0,0,0,0.08),0 4px 6px -4px rgba(0,0,0,0.04);--font:'DM Sans',system-ui,-apple-system,sans-serif;--mono:'JetBrains Mono',monospace;--radius:12px}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}

/* NAV */
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:18px;color:var(--text)}
.logo-dot{width:10px;height:10px;background:var(--green);border-radius:50%}
.nav-links{display:flex;gap:28px;font-size:14px;font-weight:500}
.nav-links a{color:var(--muted);transition:color .2s}
.nav-links a:hover,.nav-links a.active{color:var(--text)}
.nav-right{display:flex;align-items:center;gap:12px;font-size:14px}
.nav-right a{color:var(--muted);font-weight:500}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;border-radius:8px;font-weight:600;font-size:14px;border:none;cursor:pointer;font-family:var(--font);transition:all .15s}
.btn-primary{background:var(--green);color:#fff}
.btn-primary:hover{background:var(--green-dark);box-shadow:0 2px 8px rgba(16,185,129,0.25)}
.btn-outline{border:1px solid var(--border);background:var(--bg);color:var(--text)}
.btn-outline:hover{border-color:#CBD5E1;background:var(--bg-alt)}
.btn-lg{padding:12px 28px;font-size:15px;border-radius:10px}

/* HERO */
.hero{padding:80px 24px 64px;background:linear-gradient(180deg,#F0FDF4 0%,var(--bg) 100%)}
.hero-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.hero-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:100px;font-size:12px;font-weight:600;color:var(--green-dark);background:var(--green-light);margin-bottom:16px}
.hero h1{font-size:clamp(32px,4vw,48px);font-weight:700;line-height:1.15;color:var(--text);margin-bottom:16px;letter-spacing:-0.02em}
.hero p{font-size:17px;color:var(--text-secondary);line-height:1.65;margin-bottom:28px;max-width:520px}
.hero-buttons{display:flex;gap:12px;flex-wrap:wrap}
.hero-visual{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow-lg);overflow:hidden}
.hero-visual-header{padding:12px 16px;background:var(--bg-alt);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.hero-visual-header .dots{display:flex;gap:6px}
.hero-visual-header .dots span{width:10px;height:10px;border-radius:50%;background:var(--border)}
.hero-visual-header .dots span:first-child{background:#EF4444}
.hero-visual-header .dots span:nth-child(2){background:#F59E0B}
.hero-visual-header .dots span:last-child{background:#10B981}
.hero-visual-body{padding:24px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.mini-card{background:var(--bg-alt);border:1px solid var(--border-light);border-radius:10px;padding:16px}
.mini-card .mc-label{font-size:11px;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.04em}
.mini-card .mc-val{font-family:var(--mono);font-size:22px;font-weight:700;color:var(--text)}
.mini-card .mc-change{font-size:12px;font-weight:600;margin-top:4px}
.mc-up{color:var(--green)}
.mc-chart{grid-column:1/-1;height:100px;background:var(--bg-alt);border:1px solid var(--border-light);border-radius:10px;padding:16px;display:flex;align-items:flex-end;gap:6px}
.mc-bar{flex:1;background:linear-gradient(180deg,var(--green),#6EE7B7);border-radius:4px 4px 0 0;min-height:12px;transition:height .3s}

/* TRUST STRIP */
.trust{padding:40px 24px;border-bottom:1px solid var(--border)}
.trust-inner{max-width:1200px;margin:0 auto;text-align:center}
.trust p{font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;font-weight:500;margin-bottom:20px}
.trust-logos{display:flex;justify-content:center;gap:40px;flex-wrap:wrap;align-items:center}
.trust-logo{font-size:15px;font-weight:600;color:#94A3B8;letter-spacing:0.01em}

/* SECTION COMMON */
.section{max-width:1200px;margin:0 auto;padding:80px 24px}
.section-alt{background:var(--bg-alt)}
.section-header{text-align:center;margin-bottom:56px}
.section-header .overline{font-size:13px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px}
.section-header h2{font-size:clamp(26px,3.5vw,38px);font-weight:700;letter-spacing:-0.01em;margin-bottom:12px}
.section-header p{font-size:16px;color:var(--text-secondary);max-width:560px;margin:0 auto;line-height:1.6}

/* INDUSTRY SEGMENTS */
.segments{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.segment-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:28px;transition:all .2s;position:relative;overflow:hidden}
.segment-card:hover{box-shadow:var(--shadow-md);border-color:#CBD5E1;transform:translateY(-2px)}
.segment-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px}
.segment-card h3{font-size:17px;font-weight:600;margin-bottom:8px}
.segment-card p{font-size:14px;color:var(--text-secondary);line-height:1.55;margin-bottom:16px}
.segment-link{font-size:13px;font-weight:600;color:var(--green);display:inline-flex;align-items:center;gap:4px}

/* PAIN → SOLUTION FLOW */
.flow-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start}
.flow-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:32px}
.flow-card.pain{border-left:4px solid #EF4444}
.flow-card.solution{border-left:4px solid var(--green)}
.flow-card .flow-tag{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px}
.flow-card.pain .flow-tag{color:#EF4444}
.flow-card.solution .flow-tag{color:var(--green)}
.flow-card h3{font-size:18px;font-weight:600;margin-bottom:8px}
.flow-card p{font-size:14px;color:var(--text-secondary);line-height:1.6;margin-bottom:16px}
.flow-stat{font-family:var(--mono);font-size:32px;font-weight:700;margin-bottom:2px}
.flow-card.pain .flow-stat{color:#EF4444}
.flow-card.solution .flow-stat{color:var(--green)}
.flow-stat-label{font-size:12px;color:var(--muted)}

/* FEATURES */
.features-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.feature-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:28px;display:flex;gap:16px;transition:box-shadow .2s}
.feature-card:hover{box-shadow:var(--shadow-md)}
.feature-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.feature-card h4{font-size:15px;font-weight:600;margin-bottom:4px}
.feature-card p{font-size:13px;color:var(--text-secondary);line-height:1.55}

/* METRICS STRIP */
.metrics{background:var(--text);padding:56px 24px;color:#fff}
.metrics-inner{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center}
.metric-val{font-family:var(--mono);font-size:clamp(28px,3vw,40px);font-weight:700;color:var(--green);margin-bottom:4px}
.metric-label{font-size:13px;color:#94A3B8}

/* TESTIMONIALS */
.testimonials{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.testimonial{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:28px}
.testimonial-stars{color:#F59E0B;font-size:14px;margin-bottom:12px;letter-spacing:2px}
.testimonial p{font-size:14px;color:var(--text-secondary);line-height:1.6;margin-bottom:16px;font-style:italic}
.testimonial-author{font-size:13px;font-weight:600;color:var(--text)}
.testimonial-role{font-size:12px;color:var(--muted)}

/* COMPARISON TABLE */
.comp-table-wrap{overflow-x:auto}
.comp-table{width:100%;border-collapse:collapse;font-size:14px}
.comp-table th{text-align:left;padding:12px 16px;font-weight:600;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid var(--border);background:var(--bg-alt)}
.comp-table td{padding:14px 16px;border-bottom:1px solid var(--border-light)}
.comp-table tr:hover td{background:var(--bg-alt)}
.comp-table .check{color:var(--green);font-weight:700}
.comp-table .dash{color:#CBD5E1}
.comp-table .highlight-col{background:rgba(16,185,129,0.04)}

/* PRICING PROMO */
.promo{background:linear-gradient(135deg,#F0FDF4,#ECFDF5);border:1px solid rgba(16,185,129,0.15);border-radius:16px;padding:48px;display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center}
.promo h3{font-size:24px;font-weight:700;margin-bottom:8px}
.promo p{font-size:15px;color:var(--text-secondary);line-height:1.6;max-width:520px}
.promo-price{text-align:center}
.promo-price .from{font-size:13px;color:var(--muted);margin-bottom:4px}
.promo-price .amount{font-family:var(--mono);font-size:40px;font-weight:700;color:var(--green)}
.promo-price .period{font-size:13px;color:var(--muted)}

/* CTA */
.cta-section{text-align:center;padding:80px 24px}
.cta-section h2{font-size:clamp(28px,3.5vw,40px);font-weight:700;margin-bottom:12px;letter-spacing:-0.01em}
.cta-section p{color:var(--text-secondary);font-size:16px;margin-bottom:32px;max-width:480px;margin-left:auto;margin-right:auto}
.cta-buttons{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}

/* FOOTER */
footer{background:var(--bg-alt);border-top:1px solid var(--border);padding:64px 24px 32px}
.footer-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:40px;margin-bottom:48px}
.footer-col h5{font-size:12px;font-weight:600;color:var(--text);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.06em}
.footer-col a{display:block;font-size:13px;color:var(--muted);margin-bottom:10px;transition:color .15s}
.footer-col a:hover{color:var(--green)}
.footer-bottom{max-width:1200px;margin:0 auto;text-align:center;font-size:12px;color:#94A3B8;padding-top:24px;border-top:1px solid var(--border)}

/* RESPONSIVE */
@media(max-width:900px){
  .hero-inner{grid-template-columns:1fr}
  .hero-visual{max-width:500px}
  .segments{grid-template-columns:1fr}
  .flow-grid{grid-template-columns:1fr}
  .features-grid{grid-template-columns:1fr}
  .testimonials{grid-template-columns:1fr}
  .promo{grid-template-columns:1fr;text-align:center}
}
@media(max-width:768px){
  .nav-links{display:none}
  .metrics-inner{grid-template-columns:repeat(2,1fr)}
  .footer-inner{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:480px){
  .metrics-inner{grid-template-columns:1fr}
  .footer-inner{grid-template-columns:1fr}
  .hero-visual-body{grid-template-columns:1fr}
}

.fade-in{opacity:0;transform:translateY(16px);transition:opacity .5s,transform .5s}
.fade-in.visible{opacity:1;transform:translateY(0)}
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

<!-- HERO -->
<section class="hero">
  <div class="hero-inner">
    <div>
      <div class="hero-badge">Solutions for Digital Businesses</div>
      <h1>Financial planning built for the speed of digital</h1>
      <p>SaaS, e-commerce, marketplaces, and digital-first companies operate on subscription metrics, usage data, and real-time revenue. Legacy FP&A tools weren't built for you. FinanceOS was.</p>
      <div class="hero-buttons">
        <button class="btn btn-primary btn-lg">Start Free Trial</button>
        <button class="btn btn-outline btn-lg">Book a Demo →</button>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-visual-header">
        <div class="dots"><span></span><span></span><span></span></div>
      </div>
      <div class="hero-visual-body">
        <div class="mini-card">
          <div class="mc-label">MRR</div>
          <div class="mc-val">$4.05M</div>
          <div class="mc-change mc-up">↑ 8.2% MoM</div>
        </div>
        <div class="mini-card">
          <div class="mc-label">NDR</div>
          <div class="mc-val">118%</div>
          <div class="mc-change mc-up">↑ 3pts QoQ</div>
        </div>
        <div class="mini-card">
          <div class="mc-label">Burn Multiple</div>
          <div class="mc-val">0.8x</div>
          <div class="mc-change mc-up">Efficient</div>
        </div>
        <div class="mc-chart">
          <div class="mc-bar" style="height:35%"></div>
          <div class="mc-bar" style="height:42%"></div>
          <div class="mc-bar" style="height:38%"></div>
          <div class="mc-bar" style="height:50%"></div>
          <div class="mc-bar" style="height:55%"></div>
          <div class="mc-bar" style="height:48%"></div>
          <div class="mc-bar" style="height:62%"></div>
          <div class="mc-bar" style="height:58%"></div>
          <div class="mc-bar" style="height:70%"></div>
          <div class="mc-bar" style="height:75%"></div>
          <div class="mc-bar" style="height:82%"></div>
          <div class="mc-bar" style="height:90%"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TRUST STRIP -->
<div class="trust">
  <div class="trust-inner">
    <p>Trusted by digital-first finance teams at</p>
    <div class="trust-logos">
      <span class="trust-logo">Figma</span>
      <span class="trust-logo">Notion</span>
      <span class="trust-logo">Vercel</span>
      <span class="trust-logo">Linear</span>
      <span class="trust-logo">Ramp</span>
      <span class="trust-logo">Mercury</span>
      <span class="trust-logo">Retool</span>
    </div>
  </div>
</div>

<!-- INDUSTRY SEGMENTS -->
<section class="section">
  <div class="section-header">
    <div class="overline">Industry Solutions</div>
    <h2>Purpose-built for digital business models</h2>
    <p>FinanceOS understands the financial nuances of subscription, usage-based, and marketplace businesses.</p>
  </div>
  <div class="segments">
    <div class="segment-card fade-in">
      <div class="segment-icon" style="background:#EFF6FF">💻</div>
      <h3>SaaS & Subscription</h3>
      <p>Native SaaS metrics — ARR, MRR, NDR, LTV/CAC, cohort retention, and churn analysis. ASC 606 revenue recognition built in. Model expansion, contraction, and new logo scenarios natively.</p>
      <a href="#" class="segment-link">Explore SaaS solution →</a>
    </div>
    <div class="segment-card fade-in">
      <div class="segment-icon" style="background:#FFF7ED">🛒</div>
      <h3>E-Commerce & DTC</h3>
      <p>Multi-channel revenue consolidation from Shopify, Amazon, and retail. Inventory valuation, COGS tracking, promotional ROI, and seasonal demand forecasting across all channels.</p>
      <a href="#" class="segment-link">Explore e-commerce solution →</a>
    </div>
    <div class="segment-card fade-in">
      <div class="segment-icon" style="background:#F5F3FF">🔄</div>
      <h3>Marketplaces & Platforms</h3>
      <p>Two-sided unit economics, take rate optimization, GMV forecasting, and supply/demand modeling. Handle complex revenue share calculations and multi-party payments natively.</p>
      <a href="#" class="segment-link">Explore marketplace solution →</a>
    </div>
    <div class="segment-card fade-in">
      <div class="segment-icon" style="background:#ECFDF5">⚡</div>
      <h3>Usage-Based & API</h3>
      <p>Consumption-based revenue recognition, metered billing forecasting, infrastructure cost modeling, and per-unit economics. Built for companies charging per API call, seat, or compute hour.</p>
      <a href="#" class="segment-link">Explore usage-based solution →</a>
    </div>
    <div class="segment-card fade-in">
      <div class="segment-icon" style="background:#FEF2F2">📱</div>
      <h3>Mobile & App-Based</h3>
      <p>App store revenue tracking, in-app purchase modeling, ad revenue forecasting, and user acquisition cost analysis. Handle Apple/Google commission splits automatically.</p>
      <a href="#" class="segment-link">Explore mobile solution →</a>
    </div>
    <div class="segment-card fade-in">
      <div class="segment-icon" style="background:#FFFBEB">🏗️</div>
      <h3>Digital Infrastructure</h3>
      <p>Cloud cost optimization, bandwidth forecasting, compute capacity planning, and infrastructure-to-revenue ratio tracking. Model margin impact of scaling decisions.</p>
      <a href="#" class="segment-link">Explore infra solution →</a>
    </div>
  </div>
</section>

<!-- PAIN → SOLUTION -->
<div class="section-alt">
  <section class="section">
    <div class="section-header">
      <div class="overline">Why Legacy Tools Fail</div>
      <h2>Built for manufacturing, not for you</h2>
      <p>Traditional FP&A tools were designed for brick-and-mortar businesses. Digital companies need a financial platform that speaks their language.</p>
    </div>

    <div class="flow-grid fade-in" style="margin-bottom:32px">
      <div class="flow-card pain">
        <div class="flow-tag">Legacy Problem</div>
        <h3>No native subscription metrics</h3>
        <p>Traditional ERPs track GAAP revenue but can't calculate ARR, NDR, or cohort retention. Your team manually exports Stripe data into spreadsheets every month to compute basic SaaS metrics.</p>
        <div class="flow-stat">40+ hrs/mo</div>
        <div class="flow-stat-label">Spent manually computing SaaS metrics</div>
      </div>
      <div class="flow-card solution">
        <div class="flow-tag">FinanceOS Solution</div>
        <h3>SaaS metrics calculated automatically</h3>
        <p>Connect Stripe, Chargebee, or any billing system. FinanceOS computes ARR, MRR, NDR, churn, expansion, LTV/CAC, and 30+ SaaS metrics in real-time with full drill-down to individual transactions.</p>
        <div class="flow-stat">Real-time</div>
        <div class="flow-stat-label">Always current, zero manual work</div>
      </div>
    </div>

    <div class="flow-grid fade-in" style="margin-bottom:32px">
      <div class="flow-card pain">
        <div class="flow-tag">Legacy Problem</div>
        <h3>Forecasting can't handle recurring revenue</h3>
        <p>Spreadsheet models treat revenue as a single line item. They can't model cohort-based expansion, seasonal churn curves, or the compound effect of NDR improvements on 3-year ARR projections.</p>
        <div class="flow-stat">±25%</div>
        <div class="flow-stat-label">Typical SaaS forecast variance</div>
      </div>
      <div class="flow-card solution">
        <div class="flow-tag">FinanceOS Solution</div>
        <h3>Cohort-native forecasting engine</h3>
        <p>Build bottom-up forecasts from cohort behavior: new logo velocity, expansion rates by segment, churn curves by tenure, and pricing tier migration. AI suggests scenarios based on historical patterns.</p>
        <div class="flow-stat">96%</div>
        <div class="flow-stat-label">Forecast accuracy with AI</div>
      </div>
    </div>

    <div class="flow-grid fade-in">
      <div class="flow-card pain">
        <div class="flow-tag">Legacy Problem</div>
        <h3>Board reporting takes a week</h3>
        <p>Every board meeting means a fire drill: pull data from 8 systems, reconcile numbers, format slides, get sign-off. Half the metrics are stale by presentation day.</p>
        <div class="flow-stat">5-7 days</div>
        <div class="flow-stat-label">To prepare a board deck</div>
      </div>
      <div class="flow-card solution">
        <div class="flow-tag">FinanceOS Solution</div>
        <h3>One-click board decks, always current</h3>
        <p>Pre-built board deck templates pull live data automatically. ARR waterfall, burn analysis, runway forecast, and department-level P&L — all generated in one click with data as fresh as today.</p>
        <div class="flow-stat">< 5 min</div>
        <div class="flow-stat-label">Board deck generation</div>
      </div>
    </div>
  </section>
</div>

<!-- KEY FEATURES -->
<section class="section">
  <div class="section-header">
    <div class="overline">Platform Capabilities</div>
    <h2>Everything digital finance teams need</h2>
  </div>
  <div class="features-grid">
    <div class="feature-card fade-in">
      <div class="feature-icon" style="background:#ECFDF5">📊</div>
      <div><h4>AI Copilot</h4><p>Ask questions in plain English. "Why did churn spike in March?" gets an instant, sourced variance analysis with drill-down.</p></div>
    </div>
    <div class="feature-card fade-in">
      <div class="feature-icon" style="background:#EFF6FF">🔗</div>
      <div><h4>200+ Integrations</h4><p>Stripe, NetSuite, Salesforce, Snowflake, Workday — connect your stack in minutes with OAuth. No engineering required.</p></div>
    </div>
    <div class="feature-card fade-in">
      <div class="feature-icon" style="background:#F5F3FF">🧮</div>
      <div><h4>Scenario Modeling</h4><p>Unlimited what-if scenarios: pricing changes, headcount plans, market shifts. Compare side-by-side with Monte Carlo simulations.</p></div>
    </div>
    <div class="feature-card fade-in">
      <div class="feature-icon" style="background:#FFF7ED">🏢</div>
      <div><h4>Multi-Entity Consolidation</h4><p>Consolidate across entities, currencies, and ERPs in seconds. Automated intercompany elimination and currency translation.</p></div>
    </div>
    <div class="feature-card fade-in">
      <div class="feature-icon" style="background:#FEF2F2">🔒</div>
      <div><h4>SOX 404 Compliance</h4><p>Continuous control monitoring with immutable audit trails. One-click evidence export in auditor-ready formats.</p></div>
    </div>
    <div class="feature-card fade-in">
      <div class="feature-icon" style="background:#FFFBEB">🌐</div>
      <div><h4>xP&A Planning</h4><p>Connect Finance, Revenue, Workforce, Operations, Marketing, IT, and Supply Chain into one unified planning model.</p></div>
    </div>
  </div>
</section>

<!-- METRICS -->
<section class="metrics">
  <div class="metrics-inner">
    <div><div class="metric-val">$48.6M</div><div class="metric-label">Annual Recurring Revenue</div></div>
    <div><div class="metric-val">118%</div><div class="metric-label">Net Dollar Retention</div></div>
    <div><div class="metric-val">2,400+</div><div class="metric-label">Finance Teams</div></div>
    <div><div class="metric-val">84.7%</div><div class="metric-label">Gross Margin</div></div>
  </div>
</section>

<!-- COMPARISON TABLE -->
<section class="section">
  <div class="section-header">
    <div class="overline">How We Compare</div>
    <h2>FinanceOS vs. legacy alternatives</h2>
  </div>
  <div class="comp-table-wrap">
    <table class="comp-table">
      <thead>
        <tr>
          <th>Capability</th>
          <th class="highlight-col">FinanceOS</th>
          <th>Anaplan</th>
          <th>Planful</th>
          <th>Adaptive</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Native SaaS Metrics</td><td class="highlight-col check">✓ Built-in</td><td class="dash">— Manual</td><td class="dash">— Manual</td><td class="dash">— Manual</td></tr>
        <tr><td>AI Copilot (NLP)</td><td class="highlight-col check">✓ Native</td><td class="dash">— Add-on</td><td>Analyst Assistant</td><td class="dash">— Roadmap</td></tr>
        <tr><td>Real-time Data Sync</td><td class="highlight-col check">✓ Real-time</td><td>Batch</td><td>Batch</td><td>Batch</td></tr>
        <tr><td>Setup Time</td><td class="highlight-col check">Days</td><td>3-6 months</td><td>2-4 months</td><td>1-3 months</td></tr>
        <tr><td>Consumption Pricing</td><td class="highlight-col check">✓ Pay for usage</td><td class="dash">Per-seat</td><td class="dash">Per-seat</td><td class="dash">Per-seat</td></tr>
        <tr><td>xP&A (7 departments)</td><td class="highlight-col check">✓ Native</td><td>Custom build</td><td>Limited</td><td class="dash">— Finance only</td></tr>
        <tr><td>SOX 404 Automation</td><td class="highlight-col check">✓ Continuous</td><td>Manual</td><td>Basic</td><td>Manual</td></tr>
        <tr><td>Multi-Entity Consolidation</td><td class="highlight-col check">< 8 seconds</td><td>Minutes</td><td>Minutes</td><td>Minutes</td></tr>
      </tbody>
    </table>
  </div>
</section>

<!-- TESTIMONIALS -->
<div class="section-alt">
  <section class="section">
    <div class="section-header">
      <div class="overline">Customer Stories</div>
      <h2>Trusted by digital-first CFOs</h2>
    </div>
    <div class="testimonials">
      <div class="testimonial fade-in">
        <div class="testimonial-stars">★★★★★</div>
        <p>"We were running SaaS metrics in 6 different spreadsheets. FinanceOS replaced all of them and gave us real-time ARR waterfall analysis we never had before."</p>
        <div class="testimonial-author">Sarah Chen</div>
        <div class="testimonial-role">VP Finance, Series C SaaS</div>
      </div>
      <div class="testimonial fade-in">
        <div class="testimonial-stars">★★★★★</div>
        <p>"Board deck prep went from 5 days to 5 minutes. The AI Copilot explains variances better than most analysts I've worked with."</p>
        <div class="testimonial-author">Marcus Rivera</div>
        <div class="testimonial-role">CFO, E-Commerce Platform</div>
      </div>
      <div class="testimonial fade-in">
        <div class="testimonial-stars">★★★★★</div>
        <p>"The xP&A module finally connected our RevOps forecast to our financial plan. No more version conflicts between Sales and Finance."</p>
        <div class="testimonial-author">Priya Patel</div>
        <div class="testimonial-role">Head of FP&A, Marketplace</div>
      </div>
    </div>
  </section>
</div>

<!-- PRICING PROMO -->
<section class="section">
  <div class="promo fade-in">
    <div>
      <h3>Start with what you use, scale as you grow</h3>
      <p>No per-seat pricing that penalizes growing teams. FinanceOS uses consumption-based pricing — you pay for AI queries, connector syncs, report exports, and scenario runs. Start small, scale unlimited.</p>
      <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn btn-primary">See Pricing →</button>
        <button class="btn btn-outline">Calculate Your Cost</button>
      </div>
    </div>
    <div class="promo-price">
      <div class="from">Starting at</div>
      <div class="amount">$665</div>
      <div class="period">/month (annual)</div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <h2>Ready to modernize your financial stack?</h2>
  <p>Join 2,400+ digital businesses that outgrew spreadsheets and legacy tools. Start free — no credit card required.</p>
  <div class="cta-buttons">
    <button class="btn btn-primary btn-lg">Start Free Trial</button>
    <button class="btn btn-outline btn-lg">Talk to Sales</button>
  </div>
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
