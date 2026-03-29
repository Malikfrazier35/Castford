'use client';

import { useEffect, useRef } from 'react';

export default function V3InternalEnterprisePricingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `function calcDeal(){
const tier=Number(document.getElementById('tier').value);
const ps=Number(document.getElementById('powerSeats').value);
const vs=Number(document.getElementById('viewerSeats').value);
const xpa=Number(document.getElementById('xpaDepts').value);
const ai=Number(document.getElementById('ai').value);
const sox=Number(document.getElementById('sox').value);
const commitPct=Number(document.getElementById('commit').value);
const negPct=Number(document.getElementById('discount').value);

const seatCost=ps*89+vs*29;
const xpaRate=xpa>=3?339:399;
const modCost=xpa*xpaRate+ai+sox;
const listMRR=tier+seatCost+modCost;
const afterCommit=listMRR*(1-commitPct/100);
const afterNeg=afterCommit*(1-negPct/100);
const acv=Math.round(afterNeg*12);
const effDiscount=Math.round((1-afterNeg/listMRR)*100);

const fmt=n=>'$'+Math.round(n).toLocaleString();
document.getElementById('out-base').textContent=fmt(tier);
document.getElementById('out-seats').textContent=fmt(seatCost);
document.getElementById('out-modules').textContent=fmt(modCost);
document.getElementById('out-list').textContent=fmt(listMRR);
document.getElementById('out-commit').textContent=fmt(afterCommit);
document.getElementById('out-neg').textContent=fmt(afterNeg);
document.getElementById('out-acv').textContent=fmt(acv);
document.getElementById('out-mrr').textContent=fmt(afterNeg);
document.getElementById('out-eff').textContent=effDiscount+'%';
}
calcDeal();`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#F8FAFC;--green:#10B981;--cyan:#22D3EE;--purple:#8B5CF6;--blue:#3B82F6;--amber:#F59E0B;--red:#EF4444;--indigo:#6366F1;--t1:#0F172A;--t2:#334155;--t3:#64748B;--t4:#94A3B8;--border:#E2E8F0;--font:'DM Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;--ease:cubic-bezier(.16,1,.3,1)}
body{font-family:var(--font);color:var(--t1);-webkit-font-smoothing:antialiased;background:var(--bg);overflow-x:hidden}

/* HEADER */

/* ===== NAVIGATION (light) ===== */
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
.btn-sub{display:inline-flex;align-items:center;padding:8px 18px;border-radius:8px;font-weight:600;font-size:13px;background:#10B981;color:#fff;text-decoration:none;border:none;cursor:pointer;transition:all .15s}
.btn-sub:hover{background:#059669;box-shadow:0 2px 12px rgba(16,185,129,0.25)}
@media(max-width:900px){.nav-mid{display:none}}


/* ===== FOOTER (light) ===== */
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

.header-badge{padding:5px 12px;border-radius:8px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;background:rgba(239,68,68,.08);color:#EF4444;border:1px solid rgba(239,68,68,.15)}
.header-right{font-size:12px;color:#64748B}

/* LAYOUT */
.page{max-width:1300px;margin:0 auto;padding:40px}
.page-title{font-size:32px;font-weight:900;letter-spacing:-.03em;margin-bottom:6px}
.page-sub{font-size:15px;color:var(--t3);margin-bottom:40px;line-height:1.6;max-width:700px}

/* SECTION */
.sec{margin-bottom:48px}
.sec-title{font-size:18px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.sec-title .icon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center}
.sec-title .icon svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2}
.sec-desc{font-size:13px;color:var(--t3);margin-bottom:20px;line-height:1.6}

/* PRICING TABLE */
.price-table{width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden;border:1px solid var(--border);box-shadow:0 2px 12px rgba(0,0,0,.03)}
.price-table thead th{padding:14px 16px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;text-align:left;background:#F1F5F9;border-bottom:2px solid var(--border);color:var(--t3)}
.price-table thead th.num{text-align:right}
.price-table tbody td{padding:14px 16px;font-size:13px;border-bottom:1px solid var(--border);color:var(--t2)}
.price-table tbody td.num{text-align:right;font-family:var(--mono);font-weight:600;font-size:13px}
.price-table tbody td.bold{font-weight:800;color:var(--t1)}
.price-table tbody tr:last-child td{border-bottom:none}
.price-table tbody tr:hover{background:rgba(16,185,129,.015)}
.price-table tbody tr.total-row{background:rgba(16,185,129,.04);border-top:2px solid var(--green)}
.price-table tbody tr.total-row td{font-weight:800;color:var(--t1);font-size:14px}
.price-table tbody tr.total-row td.num{color:var(--green);font-size:15px}
.price-table tbody tr.sub-total{background:#F8FAFC}
.price-table tbody tr.sub-total td{font-weight:700;font-style:italic;color:var(--t3)}
.tag{display:inline-block;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:.03em}
.tag-green{background:rgba(16,185,129,.08);color:var(--green)}
.tag-amber{background:rgba(245,158,11,.08);color:var(--amber)}
.tag-purple{background:rgba(139,92,246,.08);color:var(--purple)}
.tag-blue{background:rgba(59,130,246,.08);color:var(--blue)}
.tag-red{background:rgba(239,68,68,.08);color:var(--red)}

/* CALCULATOR */
.calc-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.calc-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:28px}
.calc-card h4{font-size:14px;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px}
.calc-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)}
.calc-row:last-child{border:none}
.calc-label{font-size:13px;color:var(--t2)}
.calc-val{font-size:13px;font-weight:700;font-family:var(--mono)}
.calc-input{width:80px;padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:var(--mono);font-weight:600;text-align:right;outline:none;transition:border .2s}
.calc-input:focus{border-color:var(--green)}
.calc-result{margin-top:16px;padding:16px;border-radius:12px;background:rgba(16,185,129,.04);border:1px solid rgba(16,185,129,.1)}
.calc-result .big{font-size:28px;font-weight:900;font-family:var(--mono);letter-spacing:-.03em;color:var(--green)}
.calc-result .sub{font-size:12px;color:var(--t3);margin-top:4px}

/* COMP INTEL */
.intel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.intel-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:24px}
.intel-card h4{font-size:15px;font-weight:800;margin-bottom:4px}
.intel-card .intel-score{font-size:12px;color:var(--t4);margin-bottom:12px}
.intel-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px}
.intel-row:last-child{border:none}
.intel-row .key{color:var(--t3)}.intel-row .val{font-weight:700;font-family:var(--mono)}

/* NEGOTIATION PLAYBOOK */
.play-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.play-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:24px}
.play-card.do{border-left:4px solid var(--green)}
.play-card.dont{border-left:4px solid var(--red)}
.play-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}
.play-card.do .play-label{color:var(--green)}
.play-card.dont .play-label{color:var(--red)}
.play-list{list-style:none;display:flex;flex-direction:column;gap:8px}
.play-list li{font-size:12px;color:var(--t2);line-height:1.6;display:flex;align-items:flex-start;gap:6px}
.play-list li::before{content:'→';color:var(--t4);flex-shrink:0;font-weight:700}

/* SCENARIOS */
.scenario-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.scenario-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:28px;transition:all .3s}
.scenario-card:hover{box-shadow:0 8px 24px rgba(0,0,0,.05)}
.scenario-card.recommended{border-color:var(--green);background:linear-gradient(180deg,rgba(16,185,129,.02),#fff)}
.scenario-name{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--t4);margin-bottom:8px}
.scenario-card.recommended .scenario-name{color:var(--green)}
.scenario-price{font-size:32px;font-weight:900;font-family:var(--mono);letter-spacing:-.04em;margin-bottom:4px}
.scenario-card.recommended .scenario-price{color:var(--green)}
.scenario-detail{font-size:12px;color:var(--t3);margin-bottom:16px;line-height:1.5}
.scenario-list{list-style:none;display:flex;flex-direction:column;gap:6px}
.scenario-list li{font-size:12px;color:var(--t2);display:flex;align-items:center;gap:6px}
.scenario-list li svg{width:14px;height:14px;flex-shrink:0}

@media(max-width:768px){.calc-grid,.play-grid,.intel-grid,.scenario-grid{grid-template-columns:1fr}.page{padding:24px}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- HEADER -->
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
<div style="max-width:1200px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;background:#FEF2F2;border-bottom:1px solid #FECACA;font-size:12px"><div style="display:flex;align-items:center;gap:8px"><span style="padding:4px 10px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;background:rgba(239,68,68,.08);color:#EF4444">Internal Only</span><span style="color:#64748B">Sales Enablement Tool — Not for External Distribution</span></div></div>

<div class="page">
<div class="page-title">Enterprise & Custom FP&A Pricing Model</div>
<div class="page-sub">Internal reference for sales negotiations. Contains base rates, discount authority, competitive intel, and scenario modeling for custom enterprise deals. Use this to structure and justify pricing during prospect calls.</div>

<!-- SECTION 1: BASE RATE CARD -->
<div class="sec">
<div class="sec-title"><div class="icon" style="background:rgba(16,185,129,.1);color:var(--green)"><svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>Base Rate Card — Enterprise & Business Tiers</div>
<div class="sec-desc">Standard list prices before any negotiated discounts or committed spend reductions. All prices monthly; annual billing required for enterprise.</div>
<table class="price-table">
<thead><tr><th>Component</th><th>Unit</th><th class="num">List Price</th><th class="num">Floor Price (Min)</th><th>Notes</th></tr></thead>
<tbody>
<tr><td class="bold">Platform Base — Business</td><td>Per org/mo</td><td class="num">$2,499</td><td class="num">$1,999</td><td><span class="tag tag-green">Anchor tier</span></td></tr>
<tr><td class="bold">Platform Base — Enterprise</td><td>Per org/mo</td><td class="num">$4,999</td><td class="num">$3,749</td><td><span class="tag tag-purple">Custom SLA</span></td></tr>
<tr><td>Named User Seat — Power</td><td>Per seat/mo</td><td class="num">$89</td><td class="num">$59</td><td>Full access, model building</td></tr>
<tr><td>Named User Seat — Viewer</td><td>Per seat/mo</td><td class="num">$29</td><td class="num">$19</td><td>Read-only dashboards + comments</td></tr>
<tr><td>Named User Seat — API-Only</td><td>Per seat/mo</td><td class="num">$49</td><td class="num">$29</td><td>Programmatic access, no UI</td></tr>
<tr class="sub-total"><td colspan="5">Add-On Modules</td></tr>
<tr><td>xP&A Department Planning</td><td>Per dept/mo</td><td class="num">$399</td><td class="num">$249</td><td><span class="tag tag-blue">High value</span> — bundle 3+ for discount</td></tr>
<tr><td>AI Copilot — Advanced</td><td>Per org/mo</td><td class="num">$599</td><td class="num">$399</td><td>Unlimited NLP queries + Monte Carlo</td></tr>
<tr><td>SOX 404 Compliance Automation</td><td>Per org/mo</td><td class="num">$499</td><td class="num">$349</td><td><span class="tag tag-amber">Sticky</span> — hard to rip out once adopted</td></tr>
<tr><td>Multi-Entity Consolidation</td><td>Per entity/mo</td><td class="num">$199</td><td class="num">$129</td><td>Volume tiers: 10+ entities = 25% off</td></tr>
<tr><td>Custom Integrations (beyond 200)</td><td>Per connector/mo</td><td class="num">$99</td><td class="num">$49</td><td>Custom build: $5K one-time + $99/mo</td></tr>
<tr><td>SAML SSO + SCIM</td><td>Per org/mo</td><td class="num">$299</td><td class="num">$0</td><td><span class="tag tag-green">Give free</span> to close enterprise deals</td></tr>
<tr><td>Dedicated CSM</td><td>Per org/mo</td><td class="num">$999</td><td class="num">$499</td><td>Included free first 90 days</td></tr>
<tr><td>Premium SLA (99.99% + 1hr response)</td><td>Per org/mo</td><td class="num">$799</td><td class="num">$499</td><td>Enterprise tier only</td></tr>
<tr class="sub-total"><td colspan="5">One-Time Services</td></tr>
<tr><td>Implementation + Migration</td><td>Flat fee</td><td class="num">$15,000</td><td class="num">$7,500</td><td>Waive for 2yr+ commits</td></tr>
<tr><td>Custom Training (on-site)</td><td>Per day</td><td class="num">$3,000</td><td class="num">$1,500</td><td>Virtual training included free</td></tr>
<tr><td>Data Migration (from Anaplan/Planful)</td><td>Flat fee</td><td class="num">$10,000</td><td class="num">$5,000</td><td><span class="tag tag-red">Competitive displacement</span></td></tr>
</tbody>
</table>
</div>

<!-- SECTION 2: DEAL SCENARIOS -->
<div class="sec">
<div class="sec-title"><div class="icon" style="background:rgba(99,102,241,.1);color:var(--indigo)"><svg viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div>Pre-Built Deal Scenarios</div>
<div class="sec-desc">Three templated deals for common enterprise prospects. Use the "Recommended" scenario as your opening anchor, then negotiate from there.</div>
<div class="scenario-grid">

<div class="scenario-card">
<div class="scenario-name">Mid-Market (50-200 employees)</div>
<div class="scenario-price">$4,986<span style="font-size:14px;color:var(--t3)">/mo</span></div>
<div class="scenario-detail">Business base + 15 power seats + 20 viewers + AI Copilot. ACV: $59,832</div>
<ul class="scenario-list">
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>Business platform ($2,499)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>15 power seats ($1,335)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>20 viewer seats ($580)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>AI Copilot Advanced ($599)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--t4)" stroke-width="2"><path d="M3 7h8"/></svg>SSO included free</li>
</ul>
</div>

<div class="scenario-card recommended">
<div class="scenario-name">Growth Enterprise (200-1000 employees)</div>
<div class="scenario-price">$9,875<span style="font-size:14px;color:var(--t3)">/mo</span></div>
<div class="scenario-detail">Enterprise base + 30 power + 50 viewers + xP&A (3 depts) + AI + SOX. ACV: $118,500</div>
<ul class="scenario-list">
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>Enterprise platform ($4,999)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>30 power + 50 viewer ($4,120)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>xP&A 3 depts ($1,197 → $997 bundled)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>AI + SOX ($1,098 → $899 bundled)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>SSO + implementation waived</li>
</ul>
</div>

<div class="scenario-card">
<div class="scenario-name">Large Enterprise (1000+ employees)</div>
<div class="scenario-price">$18,496<span style="font-size:14px;color:var(--t3)">/mo</span></div>
<div class="scenario-detail">Enterprise base + 75 power + 150 viewers + full xP&A (7 depts) + all add-ons. ACV: $221,952</div>
<ul class="scenario-list">
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>Enterprise platform ($4,999)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>75 power + 150 viewer ($11,025)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>All 7 xP&A depts ($2,793 → $1,995 bundled)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>All add-ons bundled ($2,896 → $1,999)</li>
<li><svg viewBox="0 0 14 14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>Premium SLA + dedicated CSM included</li>
</ul>
</div>
</div>
</div>

<!-- SECTION 3: DISCOUNT AUTHORITY -->
<div class="sec">
<div class="sec-title"><div class="icon" style="background:rgba(245,158,11,.1);color:var(--amber)"><svg viewBox="0 0 24 24"><path d="M12 9v4l3 3"/><circle cx="12" cy="12" r="9"/></svg></div>Discount Authority Matrix</div>
<div class="sec-desc">Who can approve what level of discount. Never go below floor without VP Sales sign-off.</div>
<table class="price-table">
<thead><tr><th>Discount Level</th><th>Max Off List</th><th>Approval Required</th><th>Conditions</th><th>Use When</th></tr></thead>
<tbody>
<tr><td class="bold">Standard</td><td class="num">0-10%</td><td>AE (self-serve)</td><td>Annual commit required</td><td>Prospect has budget, just wants a win</td></tr>
<tr><td class="bold">Competitive Displacement</td><td class="num">10-20%</td><td>Sales Manager</td><td>Must name competitor + show eval proof</td><td>Active Anaplan/Planful/Adaptive eval</td></tr>
<tr><td class="bold">Strategic</td><td class="num">20-30%</td><td>VP Sales</td><td>2-year minimum + case study agreement</td><td>Logo we want (Fortune 500, vertical leader)</td></tr>
<tr><td class="bold">Executive Override</td><td class="num">30-40%</td><td>CRO + CFO</td><td>3-year commit + reference + press release</td><td>Lighthouse deal, market-making logo</td></tr>
<tr style="background:rgba(239,68,68,.03)"><td class="bold" style="color:var(--red)">Below Floor</td><td class="num" style="color:var(--red)">40%+</td><td style="color:var(--red)">CEO only</td><td>Requires board awareness</td><td><span class="tag tag-red">Almost never — defend value</span></td></tr>
</tbody>
</table>
</div>

<!-- SECTION 4: COMMITTED SPEND TIERS -->
<div class="sec">
<div class="sec-title"><div class="icon" style="background:rgba(139,92,246,.1);color:var(--purple)"><svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg></div>Committed Spend Discount Schedule</div>
<div class="sec-desc">Stacks on top of negotiated discounts. These are contractual volume commitments, not discretionary discounts.</div>
<table class="price-table">
<thead><tr><th>Commitment Term</th><th class="num">Discount</th><th class="num">Effective Rate (on $10K/mo deal)</th><th class="num">Annual Savings</th><th>Lock-In</th></tr></thead>
<tbody>
<tr><td class="bold">Monthly (no commit)</td><td class="num">0%</td><td class="num">$10,000/mo</td><td class="num">—</td><td>Cancel anytime</td></tr>
<tr><td class="bold">Annual Commit</td><td class="num">15%</td><td class="num">$8,500/mo</td><td class="num">$18,000</td><td>12-month contract</td></tr>
<tr><td class="bold">2-Year Commit</td><td class="num">25%</td><td class="num">$7,500/mo</td><td class="num">$30,000/yr</td><td>24-month contract</td></tr>
<tr><td class="bold">3-Year Commit</td><td class="num">35%</td><td class="num">$6,500/mo</td><td class="num">$42,000/yr</td><td>36-month contract</td></tr>
<tr class="total-row"><td>Max Stack (3yr + 20% competitive)</td><td class="num">48%</td><td class="num">$5,200/mo</td><td class="num">$57,600/yr</td><td>CEO approval required</td></tr>
</tbody>
</table>
</div>

<!-- SECTION 5: INTERACTIVE DEAL CALCULATOR -->
<div class="sec">
<div class="sec-title"><div class="icon" style="background:rgba(34,211,238,.1);color:var(--cyan)"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h5"/></svg></div>Quick Deal Calculator</div>
<div class="sec-desc">Plug in prospect requirements to model ACV. Adjust seat counts and modules to find the right price point.</div>
<div class="calc-grid">
<div class="calc-card">
<h4><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="var(--indigo)" stroke-width="2"><rect x="2" y="2" width="12" height="12" rx="2"/></svg> Deal Inputs</h4>
<div class="calc-row"><span class="calc-label">Platform Tier</span><select id="tier" onchange="calcDeal()" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-weight:600"><option value="2499">Business ($2,499)</option><option value="4999">Enterprise ($4,999)</option></select></div>
<div class="calc-row"><span class="calc-label">Power Seats</span><input type="number" class="calc-input" id="powerSeats" value="20" min="0" onchange="calcDeal()"/></div>
<div class="calc-row"><span class="calc-label">Viewer Seats</span><input type="number" class="calc-input" id="viewerSeats" value="30" min="0" onchange="calcDeal()"/></div>
<div class="calc-row"><span class="calc-label">xP&A Departments</span><input type="number" class="calc-input" id="xpaDepts" value="3" min="0" max="7" onchange="calcDeal()"/></div>
<div class="calc-row"><span class="calc-label">AI Copilot Advanced</span><select id="ai" onchange="calcDeal()" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-weight:600"><option value="0">No</option><option value="599" selected>Yes ($599)</option></select></div>
<div class="calc-row"><span class="calc-label">SOX Automation</span><select id="sox" onchange="calcDeal()" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-weight:600"><option value="0">No</option><option value="499">Yes ($499)</option></select></div>
<div class="calc-row"><span class="calc-label">Commitment</span><select id="commit" onchange="calcDeal()" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-weight:600"><option value="0">Monthly</option><option value="15" selected>Annual (15% off)</option><option value="25">2-Year (25% off)</option><option value="35">3-Year (35% off)</option></select></div>
<div class="calc-row"><span class="calc-label">Negotiated Discount</span><input type="number" class="calc-input" id="discount" value="0" min="0" max="40" onchange="calcDeal()"/> <span style="font-size:12px;color:var(--t4)">%</span></div>
</div>
<div class="calc-card">
<h4><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="2,8 6,12 14,4"/></svg> Deal Output</h4>
<div class="calc-row"><span class="calc-label">Platform Base</span><span class="calc-val" id="out-base">$2,499</span></div>
<div class="calc-row"><span class="calc-label">Seats Total</span><span class="calc-val" id="out-seats">$2,650</span></div>
<div class="calc-row"><span class="calc-label">Modules Total</span><span class="calc-val" id="out-modules">$1,796</span></div>
<div class="calc-row"><span class="calc-label">List MRR</span><span class="calc-val" id="out-list">$6,945</span></div>
<div class="calc-row"><span class="calc-label">After Committed Spend</span><span class="calc-val" id="out-commit">$5,903</span></div>
<div class="calc-row"><span class="calc-label">After Negotiated Discount</span><span class="calc-val" id="out-neg">$5,903</span></div>
<div class="calc-result">
<div class="big" id="out-acv">$70,838</div>
<div class="sub">Annual Contract Value (ACV)</div>
<div style="margin-top:8px;font-size:12px;color:var(--t3)">Monthly: <span id="out-mrr" style="font-weight:700;font-family:var(--mono)">$5,903</span> · Effective discount: <span id="out-eff" style="font-weight:700;font-family:var(--mono);color:var(--green)">15%</span></div>
</div>
</div>
</div>
</div>

<!-- SECTION 6: COMPETITIVE INTEL -->
<div class="sec">
<div class="sec-title"><div class="icon" style="background:rgba(239,68,68,.1);color:var(--red)"><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>Competitive Pricing Intelligence</div>
<div class="sec-desc">Real data from TrustRadius, G2, verified customer reports, and public filings. Use in negotiations when prospects compare.</div>
<div class="intel-grid">
<div class="intel-card">
<h4>Planful</h4>
<div class="intel-score">TrustRadius 8.3/10 · 267 reviews · 44K LinkedIn</div>
<div class="intel-row"><span class="key">Pricing Model</span><span class="val" style="color:var(--red)">Hidden — Contact Sales</span></div>
<div class="intel-row"><span class="key">Est. ACV Range</span><span class="val">$60K–$200K/yr</span></div>
<div class="intel-row"><span class="key">TrustRadius Alt. Price</span><span class="val">Centage: $1,750/mo</span></div>
<div class="intel-row"><span class="key">AI Module</span><span class="val">Analyst Assistant (bolt-on)</span></div>
<div class="intel-row"><span class="key">Dept Modules</span><span class="val">7 (Fin, Acct, Mktg, HR, Sales, IT, Ops)</span></div>
<div class="intel-row"><span class="key">Key Logos</span><span class="val">Etsy, FIGS, Five Guys, Bose</span></div>
<div class="intel-row"><span class="key">Weakness</span><span class="val" style="color:var(--green)">No public pricing, batch consolidation</span></div>
</div>
<div class="intel-card">
<h4>Anaplan</h4>
<div class="intel-score">TrustRadius 7.8/10 · 420+ reviews</div>
<div class="intel-row"><span class="key">Pricing Model</span><span class="val">Workspace-based</span></div>
<div class="intel-row"><span class="key">Est. ACV Range</span><span class="val">$100K–$500K+/yr</span></div>
<div class="intel-row"><span class="key">Implementation</span><span class="val" style="color:var(--red)">$50K–$300K+ (SI required)</span></div>
<div class="intel-row"><span class="key">AI Module</span><span class="val">PlanIQ (bolt-on, extra cost)</span></div>
<div class="intel-row"><span class="key">Time to Value</span><span class="val" style="color:var(--red)">3-6 months</span></div>
<div class="intel-row"><span class="key">Key Logos</span><span class="val">Coca-Cola, P&G, HP</span></div>
<div class="intel-row"><span class="key">Weakness</span><span class="val" style="color:var(--green)">Cost, complexity, consultant dependency</span></div>
</div>
<div class="intel-card">
<h4>Workday Adaptive</h4>
<div class="intel-score">TrustRadius 8.0/10 · Strong Workday ecosystem</div>
<div class="intel-row"><span class="key">Pricing Model</span><span class="val">Enterprise-only quoting</span></div>
<div class="intel-row"><span class="key">Est. ACV Range</span><span class="val">$75K–$250K/yr</span></div>
<div class="intel-row"><span class="key">Lock-in Risk</span><span class="val" style="color:var(--red)">Workday ecosystem required</span></div>
<div class="intel-row"><span class="key">AI Module</span><span class="val" style="color:var(--red)">None (no AI layer)</span></div>
<div class="intel-row"><span class="key">Strengths</span><span class="val">HR planning, spreadsheet UX</span></div>
<div class="intel-row"><span class="key">Key Logos</span><span class="val">Workday customers only</span></div>
<div class="intel-row"><span class="key">Weakness</span><span class="val" style="color:var(--green)">Vendor lock-in, no AI, slow innovation</span></div>
</div>
</div>
</div>

<!-- SECTION 7: NEGOTIATION PLAYBOOK -->
<div class="sec">
<div class="sec-title"><div class="icon" style="background:rgba(59,130,246,.1);color:var(--blue)"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg></div>Negotiation Playbook</div>
<div class="sec-desc">Tested talk tracks and tactics for common objections during enterprise pricing discussions.</div>
<div class="play-grid">
<div class="play-card do">
<div class="play-label">Do — Winning Moves</div>
<ul class="play-list">
<li>Lead with transparent pricing — "We publish our rates because we believe in earning your trust"</li>
<li>Anchor on total cost of ownership — include their current SI/consultant costs in the comparison</li>
<li>Offer committed spend discounts instead of one-off discounts — locks in revenue, customer feels they earned it</li>
<li>Bundle xP&A departments at 3+ for automatic 15% module discount — drives expansion</li>
<li>Waive implementation fee on 2yr+ commits — removes objection, costs us $7.5K, earns $50K+ LTV</li>
<li>Give SSO/SCIM free on any enterprise deal — it's table stakes, don't let it become a negotiation point</li>
<li>Use "migration from Anaplan" as a competitive displacement discount trigger — 15% automatic</li>
<li>Offer 60-day POC with 3 power seats free — prove value before asking for commitment</li>
</ul>
</div>
<div class="play-card dont">
<div class="play-label">Don't — Common Mistakes</div>
<ul class="play-list">
<li>Never discount more than 10% without getting something back (longer term, case study, reference)</li>
<li>Don't compete on price alone against Vena — they're cheaper. Compete on AI and real-time capabilities</li>
<li>Don't trash Planful's Analyst Assistant — acknowledge it, then differentiate on native AI vs bolt-on</li>
<li>Don't let procurement stretch you below floor price — walk away and come back in 30 days</li>
<li>Never give multi-year pricing on a month-to-month contract — committed spend requires committed term</li>
<li>Don't offer custom connectors free — they cost us $5K to build. Charge at least $49/mo</li>
<li>Avoid discussing ARR targets ($48.6M) in sales calls — it's investor info, not prospect info</li>
<li>Don't discount viewer seats — they're already cheap and high-margin. Discount platform base instead</li>
</ul>
</div>
</div>
</div>

<!-- SECTION 8: OBJECTION HANDLERS -->
<div class="sec">
<div class="sec-title"><div class="icon" style="background:rgba(16,185,129,.1);color:var(--green)"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>Top Objection Responses</div>
<table class="price-table">
<thead><tr><th style="width:30%">Objection</th><th style="width:35%">Response</th><th>Leverage Point</th></tr></thead>
<tbody>
<tr><td class="bold">"Planful is cheaper"</td><td>Planful hides their pricing. Ask them for a written quote with all modules included — their Analyst Assistant AI and department modules are add-ons. Our Growth plan includes everything at $999/mo.</td><td><span class="tag tag-green">Price transparency</span></td></tr>
<tr><td class="bold">"Anaplan has more features"</td><td>Anaplan is powerful — for companies willing to spend $100K+ and wait 6 months. We deliver 80% of the capability at 20% of the cost, live in 2 weeks. What specific Anaplan feature is critical for you?</td><td><span class="tag tag-blue">Time to value</span></td></tr>
<tr><td class="bold">"We need to think about it"</td><td>Absolutely — here's what I'd suggest. Let me set up a 60-day POC with 3 seats free so your team can test with real data. No commitment, no credit card. The product will sell itself.</td><td><span class="tag tag-purple">Free POC</span></td></tr>
<tr><td class="bold">"Can you match their price?"</td><td>We don't price-match, but we do offer committed spend discounts up to 35% for teams willing to commit. A 2-year annual commit on our Growth plan brings you to $599/mo — less than a single Anaplan admin seat.</td><td><span class="tag tag-amber">Committed spend</span></td></tr>
<tr><td class="bold">"We're locked into Workday"</td><td>We integrate with Workday via API — you don't need to rip it out. Our customers use us alongside Workday HCM for the AI copilot and xP&A capabilities that Adaptive doesn't offer.</td><td><span class="tag tag-green">Complementary play</span></td></tr>
<tr><td class="bold">"Your company is too young"</td><td>We're at $48.6M ARR with 118% NDR and 84.7% gross margin. We're growing faster than Planful was at this stage. SOC 2 Type II, ISO 27001, and GDPR certified. Here's our security whitepaper.</td><td><span class="tag tag-blue">Traction proof</span></td></tr>
</tbody>
</table>
</div>
</div>


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
