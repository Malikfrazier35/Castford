'use client';

import { useEffect, useRef } from 'react';

export default function V3PricingOriginalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `let billing='annual';
function setBilling(b,el){billing=b;document.querySelectorAll('.toggle-opt').forEach(o=>o.classList.remove('active'));el.classList.add('active');document.querySelectorAll('.amount').forEach(a=>{if(a.dataset.custom)return;const v=b==='annual'?a.dataset.a:a.dataset.m;a.textContent=Number(v).toLocaleString();});document.querySelectorAll('.plan-annual').forEach(el=>{if(!el.id&&el.textContent.indexOf('No seat')===-1){el.textContent=b==='annual'?'Save $'+(['1,200','3,600','9,600'][Array.from(document.querySelectorAll('.plan-annual')).indexOf(el)]||'0')+'/year':'';}});}
function toggleFaq(el){el.parentElement.classList.toggle('open');}
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
:root{--bg:#F8FAFC;--surface:#fff;--green:#10B981;--cyan:#06B6D4;--purple:#8B5CF6;--blue:#3B82F6;--amber:#F59E0B;--red:#EF4444;--t1:#0F172A;--t2:#334155;--t3:#64748B;--t4:#94A3B8;--border:#E2E8F0;--radius:16px;--ease:cubic-bezier(0.16,1,0.3,1);--font:'DM Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;}
body{font-family:var(--font);color:var(--t1);-webkit-font-smoothing:antialiased;background:#fff;overflow-x:hidden;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.reveal{opacity:0;transform:translateY(24px);transition:all 0.6s var(--ease);}.reveal.vis{opacity:1;transform:none;}

/* NAV */
.nav{position:sticky;top:0;z-index:100;padding:0 40px;height:64px;display:flex;align-items:center;background:rgba(255,255,255,0.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
.nav-logo svg{width:32px;height:32px;}
.nav-logo span{font-size:17px;font-weight:800;color:var(--t1);letter-spacing:-0.03em;}
.nav-links{display:flex;gap:28px;margin-left:50px;}
.nav-links a{font-size:13px;font-weight:500;color:var(--t3);text-decoration:none;transition:color 0.2s;}.nav-links a:hover,.nav-links a.active{color:var(--t1);font-weight:600;}
.nav-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.btn-ghost{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid var(--border);background:transparent;color:var(--t2);cursor:pointer;transition:all 0.2s;text-decoration:none;}.btn-ghost:hover{border-color:var(--t4);}
.btn-primary{padding:8px 22px;border-radius:8px;font-size:13px;font-weight:700;border:none;background:var(--green);color:#fff;cursor:pointer;transition:all 0.25s var(--ease);text-decoration:none;}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(16,185,129,0.25);}

/* HEADER */
.pricing-header{text-align:center;padding:80px 40px 40px;background:linear-gradient(180deg,#F8FAFC,#fff);}
.pricing-header .sub-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--green);margin-bottom:12px;}
.pricing-header h1{font-size:clamp(32px,5vw,48px);font-weight:900;letter-spacing:-0.03em;margin-bottom:10px;}
.pricing-header p{font-size:16px;color:var(--t3);margin-bottom:32px;}
.toggle-wrap{display:inline-flex;align-items:center;gap:0;padding:4px;border-radius:28px;background:var(--bg);border:1px solid var(--border);}
.toggle-opt{padding:8px 20px;border-radius:24px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.25s;color:var(--t3);border:none;background:transparent;}
.toggle-opt.active{background:#fff;color:var(--t1);box-shadow:0 2px 8px rgba(0,0,0,0.06);}
.save-badge{font-size:9px;font-weight:800;color:var(--green);background:rgba(16,185,129,0.08);padding:2px 8px;border-radius:10px;margin-left:4px;}

/* 4-COLUMN PRICING GRID */
.pricing-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1160px;margin:0 auto;padding:20px 40px 60px;align-items:start;}
.plan-card{background:#fff;border:2px solid var(--border);border-radius:20px;padding:28px 24px;position:relative;transition:all 0.3s var(--ease);}
.plan-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.06);}
.plan-card.popular{border-color:var(--green);box-shadow:0 8px 30px rgba(16,185,129,0.08);}
.pop-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 16px;border-radius:12px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;background:var(--green);color:#fff;white-space:nowrap;}
.plan-name{font-size:18px;font-weight:800;margin-bottom:4px;}
.plan-price{display:flex;align-items:baseline;gap:3px;margin-bottom:2px;}
.plan-price .dollar{font-size:13px;font-weight:700;color:var(--t2);align-self:flex-start;margin-top:6px;}
.plan-price .amount{font-size:42px;font-weight:900;font-family:var(--mono);letter-spacing:-0.03em;}
.plan-price .period{font-size:12px;color:var(--t4);font-weight:500;}
.plan-annual{font-size:11px;color:var(--green);font-weight:600;margin-bottom:4px;min-height:16px;}
.plan-desc{font-size:11px;color:var(--t3);margin-bottom:18px;line-height:1.4;}
.plan-section{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--t4);margin-bottom:8px;margin-top:14px;}
.plan-cta{display:flex;gap:8px;margin-bottom:16px;}
.plan-cta .cta-btn{flex:1;padding:10px;border-radius:10px;font-size:12px;font-weight:700;text-align:center;cursor:pointer;transition:all 0.25s var(--ease);border:none;text-decoration:none;}
.cta-btn.outline{background:#fff;border:2px solid var(--border);color:var(--t1);}.cta-btn.outline:hover{border-color:var(--t4);}
.cta-btn.solid{background:var(--green);color:#fff;}.cta-btn.solid:hover{box-shadow:0 4px 16px rgba(16,185,129,0.3);}
.cta-btn.dark{background:var(--t1);color:#fff;}.cta-btn.dark:hover{box-shadow:0 4px 16px rgba(0,0,0,0.2);}
.feat-list{list-style:none;display:flex;flex-direction:column;gap:7px;}
.feat-list li{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:500;color:var(--t2);}
.feat-list li svg{width:14px;height:14px;flex-shrink:0;}
.consumption{margin-top:14px;}
.cons-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0;font-size:11px;}
.cons-row .cl{color:var(--t3);}.cons-row .cv{font-weight:700;font-family:var(--mono);font-size:10px;}
.cons-row .cv.unlimited{color:var(--green);}
.cons-sub{font-size:9px;color:var(--t4);}
.guarantee{text-align:center;font-size:10px;color:var(--t4);margin-top:12px;}

/* SPEED STRIP */
.speed-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1160px;margin:0 auto 60px;padding:0 40px;text-align:center;}
.speed-item{font-family:var(--mono);}
.speed-item .sv{font-size:24px;font-weight:900;color:var(--green);}
.speed-item .sl{font-size:10px;color:var(--t4);margin-top:2px;}

/* FAQ */
.faq{max-width:700px;margin:0 auto;padding:60px 40px 80px;}
.faq h2{font-size:28px;font-weight:900;text-align:center;margin-bottom:36px;}
.faq-item{border-bottom:1px solid var(--border);}
.faq-q{padding:18px 0;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:color 0.2s;}
.faq-q:hover{color:var(--green);}
.faq-q svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;transition:transform 0.3s var(--ease);flex-shrink:0;}
.faq-item.open .faq-q svg{transform:rotate(180deg);}
.faq-a{max-height:0;overflow:hidden;transition:max-height 0.4s var(--ease);font-size:14px;color:var(--t3);line-height:1.7;}
.faq-item.open .faq-a{max-height:200px;}
.faq-a-inner{padding:0 0 18px;}

/* FOOTER */
.footer{padding:40px;background:#030711;text-align:center;font-size:12px;color:rgba(255,255,255,0.25);border-top:1px solid rgba(255,255,255,0.05);}

@media(max-width:900px){.pricing-grid{grid-template-columns:1fr;max-width:400px;}.speed-strip{grid-template-columns:repeat(2,1fr);}.nav-links{display:none;}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<nav class="nav">
  <a class="nav-logo" href="FinanceOS-Landing-Page.html"><svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#22D3EE"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><span>FinanceOS</span></a>
  <div class="nav-links"><a href="FinanceOS-Landing-Page.html">Solutions</a><a href="FinanceOS-Resources.html">Integrations</a><a href="#" class="active">Pricing</a><a href="FinanceOS-About.html">Trust</a></div>
  <div class="nav-right"><a class="btn-ghost" href="FinanceOS-Login.html">Sign In</a><a class="btn-primary" href="FinanceOS-Contact.html">Subscribe</a></div>
</nav>

<section class="pricing-header">
  <div class="sub-label">Pricing</div>
  <h1>Simple, transparent pricing</h1>
  <p>Predictable base fee. Pay-per-use overages only when you exceed included limits.</p>
  <div class="toggle-wrap">
    <button class="toggle-opt" onclick="setBilling('monthly',this)">Monthly</button>
    <button class="toggle-opt active" onclick="setBilling('annual',this)">Annual<span class="save-badge">-17%</span></button>
  </div>
</section>

<div class="pricing-grid">
  <!-- STARTER -->
  <div class="plan-card reveal">
    <div class="plan-name">Starter</div>
    <div class="plan-price"><span class="dollar">$</span><span class="amount" data-m="799" data-a="665">665</span><span class="period">/mo</span></div>
    <div class="plan-annual">Save $1,608/year</div>
    <div class="plan-desc">For small finance teams getting started with modern FP&A</div>
    <div class="plan-section">Platform</div>
    <ul class="feat-list">
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>3 entities</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>5 users</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>P&L + Forecast</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>5 connectors</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Email support</li>
    </ul>
    <div class="consumption">
      <div class="plan-section">Consumption Included</div>
      <div class="cons-row"><span class="cl">AI Copilot queries</span><span class="cv">100</span></div>
      <div class="cons-row"><span class="cl">Connector syncs</span><span class="cv">500</span></div>
      <div class="cons-row"><span class="cl">Report exports</span><span class="cv">50</span></div>
      <div class="cons-row"><span class="cl">Scenario runs</span><span class="cv">10</span></div>
    </div>
    <div class="plan-cta" style="margin-top:18px;">
      <a class="cta-btn outline" href="#">Try Demo</a>
      <a class="cta-btn solid" href="#">Subscribe</a>
    </div>
    <div class="guarantee">30-day money-back guarantee</div>
  </div>

  <!-- GROWTH -->
  <div class="plan-card popular reveal" style="transition-delay:0.1s;">
    <div class="pop-badge">Most Popular</div>
    <div class="plan-name">Growth</div>
    <div class="plan-price"><span class="dollar">$</span><span class="amount" data-m="2499" data-a="2079">2,079</span><span class="period">/mo</span></div>
    <div class="plan-annual">Save $5,040/year</div>
    <div class="plan-desc">For scaling teams with advanced forecasting and AI needs</div>
    <div class="plan-section">Platform</div>
    <ul class="feat-list">
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>10 entities</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>25 users</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>AI Copilot</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Consolidation</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Unlimited connectors</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Priority support</li>
    </ul>
    <div class="consumption">
      <div class="plan-section">Consumption Included</div>
      <div class="cons-row"><span class="cl">AI Copilot queries</span><span class="cv">1,000</span></div>
      <div class="cons-row"><span class="cl">Connector syncs</span><span class="cv">5,000</span></div>
      <div class="cons-row"><span class="cl">Report exports</span><span class="cv">500</span></div>
      <div class="cons-row"><span class="cl">Scenario runs</span><span class="cv">100</span></div>
      <div class="cons-row"><span class="cl">API calls</span><span class="cv">5,000</span></div>
    </div>
    <div class="plan-cta" style="margin-top:18px;">
      <a class="cta-btn outline" href="#">Try Demo</a>
      <a class="cta-btn solid" href="#">Subscribe</a>
    </div>
    <div class="guarantee">30-day money-back guarantee</div>
  </div>

  <!-- BUSINESS -->
  <div class="plan-card reveal" style="transition-delay:0.2s;">
    <div class="plan-name">Business</div>
    <div class="plan-price"><span class="dollar">$</span><span class="amount" data-m="5999" data-a="4999">4,999</span><span class="period">/mo</span></div>
    <div class="plan-annual">Save $12,000/year</div>
    <div class="plan-desc">Full enterprise suite for large, complex finance orgs</div>
    <div class="plan-section">Platform</div>
    <ul class="feat-list">
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Unlimited entities</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Unlimited users</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Custom ML models</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>SSO + RBAC</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Dedicated CSM</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>SLA guarantee</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>API access</li>
    </ul>
    <div class="consumption">
      <div class="plan-section">Consumption Included</div>
      <div class="cons-row"><span class="cl">AI Copilot queries</span><span class="cv">10,000</span></div>
      <div class="cons-row"><span class="cl">Connector syncs</span><span class="cv unlimited">Unlimited</span></div>
      <div class="cons-row"><span class="cl">Report exports</span><span class="cv unlimited">Unlimited</span></div>
      <div class="cons-row"><span class="cl">Scenario runs</span><span class="cv">1,000</span></div>
      <div class="cons-row"><span class="cl">API calls</span><span class="cv unlimited">Unlimited</span></div>
    </div>
    <div class="plan-cta" style="margin-top:18px;">
      <a class="cta-btn outline" href="#">Try Demo</a>
      <a class="cta-btn solid" href="#">Subscribe</a>
    </div>
    <div class="guarantee">30-day money-back guarantee</div>
  </div>

  <!-- ENTERPRISE -->
  <div class="plan-card reveal" style="transition-delay:0.3s;border-color:var(--t1);background:linear-gradient(180deg,#FAFAFA,#fff);">
    <div class="plan-name">Enterprise</div>
    <div class="plan-price"><span class="amount" style="font-size:36px;" data-custom="true">Custom</span></div>
    <div class="plan-annual" style="color:var(--t4);">No seat, entity, or usage limits.</div>
    <div class="plan-desc">Multi-year & volume pricing available. Tailored for your organization.</div>
    <div class="plan-section">Platform</div>
    <ul class="feat-list">
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>No seat or entity limits</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>SOX-compliant audit trails</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>On-premises or private cloud</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Custom integrations & API</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Dedicated success team + TAM</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Multi-year & volume pricing</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Financing options available</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Custom SLA (up to 99.99%)</li>
    </ul>
    <div class="consumption">
      <div class="plan-section">Consumption Included</div>
      <div class="cons-row"><span class="cl">All meters</span><span class="cv unlimited">Unlimited</span></div>
      <div class="cons-row"><span class="cl">Committed spend discounts</span><span class="cv unlimited">Unlimited</span></div>
      <div class="cons-sub">Committed spend discounts available</div>
    </div>
    <div class="plan-cta" style="margin-top:18px;">
      <a class="cta-btn dark" href="FinanceOS-Contact.html" style="flex:1;">Contact Sales</a>
    </div>
    <div class="guarantee" style="color:var(--t3);">Custom SLA + deployment</div>
  </div>
</div>

<!-- SPEED STRIP -->
<div class="speed-strip reveal">
  <div class="speed-item"><div class="sv">Days</div><div class="sl">Onboarding</div></div>
  <div class="speed-item"><div class="sv">Minutes</div><div class="sl">Integration setup</div></div>
  <div class="speed-item"><div class="sv">&lt; 48hr</div><div class="sl">Time to first report</div></div>
  <div class="speed-item"><div class="sv">&lt; 48hr</div><div class="sl">Implementation</div></div>
</div>

<!-- FAQ -->
<section class="faq reveal">
  <h2>Frequently asked questions</h2>
  <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">Can I try FinanceOS before purchasing?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">Yes! Every plan comes with a 30-day money-back guarantee. Subscribe, connect your data, and if you're not satisfied within 30 days, we'll refund you in full -- no questions asked.</div></div></div>
  <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">What happens when I exceed consumption limits?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">You'll pay a small per-unit overage fee only for what you use beyond your included limits. We'll notify you as you approach 80% usage so there are no surprises.</div></div></div>
  <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">Can I change plans later?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">Absolutely. Upgrade or downgrade anytime. Upgrades take effect immediately with prorated billing. Downgrades apply at the next billing cycle.</div></div></div>
  <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">How does the Enterprise plan work?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">Enterprise plans are custom-built for your organization. Contact our sales team to discuss your requirements, volume discounts, deployment options, and committed spend agreements.</div></div></div>
  <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">Is my financial data secure?<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a"><div class="faq-a-inner">FinanceOS is SOC 2 Type II certified, GDPR compliant, and uses 256-bit AES encryption for data at rest and in transit. Enterprise plans include private cloud and on-premises options.</div></div></div>
</section>

<footer class="footer">2026 FinanceOS, Inc. All rights reserved. | SOC 2 Type II Certified | GDPR Compliant</footer>


` }} />
    </>
  );
}
