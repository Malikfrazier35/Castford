'use client';

import { useEffect, useRef } from 'react';

export default function V3InternalAdCampaignOriginalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `function calcROI(){
  const days=+document.getElementById('s1').value;
  const team=+document.getElementById('s2').value;
  const rev=+document.getElementById('s3').value;
  document.getElementById('sv1').textContent=days+' days';
  document.getElementById('sv2').textContent=team+(team===1?' person':' people');
  document.getElementById('sv3').textContent='$'+rev+'M';
  const savedDays=Math.round(days*0.8);
  const hoursSaved=savedDays*8*team*12;
  const costSaved=Math.round(hoursSaved*50/1000);
  document.getElementById('r1').textContent=hoursSaved.toLocaleString();
  document.getElementById('r2').textContent='$'+costSaved+'K';
  document.getElementById('r3').textContent=savedDays+' days';
}
calcROI();
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
:root{--cyan:#22D3EE;--purple:#8B5CF6;--green:#10B981;--blue:#3B82F6;--amber:#F59E0B;--red:#EF4444;--font:'DM Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;--ease:cubic-bezier(0.16,1,0.3,1);}
body{font-family:var(--font);color:#0F172A;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.35)}50%{box-shadow:0 0 0 14px rgba(16,185,129,0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.reveal{opacity:0;transform:translateY(28px);transition:all 0.7s var(--ease);}.reveal.vis{opacity:1;transform:none;}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 40px;height:60px;display:flex;align-items:center;justify-content:space-between;background:rgba(3,7,17,0.85);backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,0.04);}
.nav-logo{display:flex;align-items:center;gap:9px;text-decoration:none;}
.nav-logo svg{width:30px;height:30px;}
.nav-logo span{font-size:16px;font-weight:800;color:#fff;}
.btn-demo{padding:9px 22px;border-radius:8px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,0.12);background:transparent;color:#fff;cursor:pointer;transition:all 0.2s;text-decoration:none;}.btn-demo:hover{border-color:rgba(255,255,255,0.3);}

/* HERO */
.hero{padding:130px 40px 80px;background:linear-gradient(180deg,#030711,#1E1B4B);text-align:center;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-300px;left:50%;transform:translateX(-50%);width:1000px;height:1000px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.08),rgba(34,211,238,0.04) 50%,transparent 70%);pointer-events:none;}
.hero-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:20px;border:1px solid rgba(34,211,238,0.2);background:rgba(34,211,238,0.06);color:var(--cyan);font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:24px;}
.hero h1{font-size:clamp(32px,5.5vw,60px);font-weight:900;color:#fff;line-height:1.06;letter-spacing:-0.03em;max-width:700px;margin:0 auto 18px;}
.hero h1 em{font-style:normal;background:linear-gradient(135deg,var(--cyan),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.hero p{font-size:17px;color:rgba(255,255,255,0.5);max-width:520px;margin:0 auto 36px;line-height:1.65;}
.hero-ctas{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:28px;}
.btn-green-lg{padding:16px 36px;border-radius:14px;font-size:16px;font-weight:800;border:none;background:var(--green);color:#fff;cursor:pointer;transition:all 0.25s;animation:pulse 2.5s ease infinite;text-decoration:none;display:inline-flex;align-items:center;gap:8px;}.btn-green-lg:hover{transform:translateY(-3px);box-shadow:0 8px 30px rgba(16,185,129,0.35);}
.btn-outline{padding:16px 36px;border-radius:14px;font-size:16px;font-weight:700;border:1px solid rgba(255,255,255,0.12);background:transparent;color:#fff;cursor:pointer;transition:all 0.25s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;}.btn-outline:hover{border-color:rgba(255,255,255,0.3);transform:translateY(-2px);}
.trust-badges{display:flex;gap:24px;justify-content:center;flex-wrap:wrap;}
.trust-badge{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.35);}
.trust-badge svg{width:14px;height:14px;stroke:rgba(255,255,255,0.3);fill:none;stroke-width:1.5;}

/* LOGOS */
.logos{padding:48px 40px;background:#fff;text-align:center;border-bottom:1px solid #E2E8F0;}
.logos .lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#94A3B8;margin-bottom:24px;}
.logo-row{display:flex;align-items:center;justify-content:center;gap:36px;flex-wrap:wrap;opacity:0.4;filter:grayscale(1);}
.logo-row img{height:26px;object-fit:contain;}

/* PROBLEM/SOLUTION */
.ps{padding:80px 40px;background:#fff;}
.ps-inner{max-width:900px;margin:0 auto;display:grid;grid-template-columns:1fr auto 1fr;gap:40px;align-items:start;}
.ps-col h3{font-size:20px;font-weight:800;margin-bottom:20px;}
.ps-item{display:flex;align-items:flex-start;gap:10px;padding:12px 0;font-size:14px;line-height:1.6;}
.ps-item svg{width:20px;height:20px;flex-shrink:0;margin-top:2px;}
.ps-arrow{display:flex;align-items:center;justify-content:center;padding-top:60px;}
.ps-arrow svg{width:40px;height:40px;stroke:var(--cyan);fill:none;stroke-width:1.5;}

/* ROI CALC */
.roi{padding:80px 40px;background:#F8FAFC;}
.roi-inner{max-width:800px;margin:0 auto;}
.roi h2{font-size:32px;font-weight:900;text-align:center;margin-bottom:8px;letter-spacing:-0.02em;}
.roi .sub{font-size:15px;color:#64748B;text-align:center;margin-bottom:36px;}
.sliders{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:32px;}
.slider-group label{display:block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:#64748B;margin-bottom:8px;}
.slider-group .s-value{font-size:24px;font-weight:800;font-family:var(--mono);margin-bottom:10px;color:#0F172A;}
.slider-group input[type=range]{width:100%;-webkit-appearance:none;height:6px;border-radius:3px;background:#E2E8F0;outline:none;}
.slider-group input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--cyan);cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.15);}
.roi-result{background:linear-gradient(135deg,#030711,#1E1B4B);border-radius:20px;padding:36px;text-align:center;color:#fff;}
.roi-result h3{font-size:14px;font-weight:600;color:rgba(255,255,255,0.5);margin-bottom:20px;text-transform:uppercase;letter-spacing:0.06em;}
.roi-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.roi-stat .rv{font-size:36px;font-weight:900;font-family:var(--mono);letter-spacing:-0.02em;background:linear-gradient(135deg,var(--cyan),var(--green));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.roi-stat .rl{font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px;}

/* FEATURES */
.feat-section{padding:80px 40px;background:linear-gradient(135deg,#030711,#0C1323);}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1000px;margin:0 auto;}
.feat-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;transition:all 0.3s;}.feat-card:hover{border-color:rgba(34,211,238,0.15);transform:translateY(-3px);box-shadow:0 8px 30px rgba(0,0,0,0.2);}
.feat-card .ficon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
.feat-card .ficon svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.5;}
.feat-card h4{font-size:16px;font-weight:800;color:#fff;margin-bottom:8px;}
.feat-card p{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.65;}

/* TESTIMONIAL */
.testi{padding:80px 40px;background:#fff;text-align:center;}
.testi-card{max-width:640px;margin:0 auto;padding:36px;background:#F8FAFC;border-radius:20px;border:1px solid #E2E8F0;}
.testi-quote{font-size:17px;font-weight:500;line-height:1.7;color:#0F172A;margin-bottom:20px;font-style:italic;}
.testi-author{display:flex;align-items:center;gap:12px;justify-content:center;}
.testi-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--purple));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;}
.testi-info .tname{font-size:13px;font-weight:700;}.testi-info .trole{font-size:11px;color:#64748B;}

/* FINAL CTA */
.final-cta{padding:80px 40px;background:linear-gradient(135deg,#030711,#1E1B4B);text-align:center;position:relative;overflow:hidden;}
.final-cta h2{font-size:clamp(28px,4vw,40px);font-weight:900;color:#fff;margin-bottom:12px;letter-spacing:-0.02em;}
.final-cta p{font-size:15px;color:rgba(255,255,255,0.45);margin-bottom:32px;}
.final-form{display:flex;gap:10px;justify-content:center;max-width:420px;margin:0 auto;}
.final-form input{flex:1;padding:14px 18px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:14px;font-family:var(--font);outline:none;}.final-form input:focus{border-color:var(--cyan);}.final-form input::placeholder{color:rgba(255,255,255,0.25);}
.final-note{font-size:11px;color:rgba(255,255,255,0.25);margin-top:12px;}

.footer{padding:30px 40px;background:#030711;text-align:center;font-size:11px;color:rgba(255,255,255,0.2);border-top:1px solid rgba(255,255,255,0.04);}

@media(max-width:768px){.ps-inner{grid-template-columns:1fr;}.ps-arrow{display:none;}.sliders{grid-template-columns:1fr;}.feat-grid{grid-template-columns:1fr;}.roi-stats{grid-template-columns:1fr;}.final-form{flex-direction:column;}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<nav class="nav">
  <a class="nav-logo" href="#"><svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#22D3EE"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><span>FinanceOS</span></a>
  <a class="btn-demo" href="#">Schedule Demo</a>
</nav>

<section class="hero">
  <div class="hero-pill">FOR MODERN FINANCE TEAMS</div>
  <h1>Close Your Books <em>5x Faster</em> with AI</h1>
  <p>FinanceOS automates month-end close, real-time forecasting, and SOX compliance. Trusted by 500+ finance teams.</p>
  <div class="hero-ctas">
    <a class="btn-green-lg" href="#">Start Free Trial<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
    <a class="btn-outline" href="#"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/></svg> Watch 2-min Demo</a>
  </div>
  <div class="trust-badges">
    <div class="trust-badge"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> SOC 2 Type II</div>
    <div class="trust-badge"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> GDPR Compliant</div>
    <div class="trust-badge"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> 99.97% Uptime</div>
    <div class="trust-badge"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> 256-bit Encryption</div>
  </div>
</section>

<section class="logos reveal">
  <div class="lbl">Trusted by leading finance teams</div>
  <div class="logo-row">
    <img src="https://cdn.worldvectorlogo.com/logos/stripe-4.svg" alt="Stripe">
    <img src="https://cdn.worldvectorlogo.com/logos/salesforce-2.svg" alt="Salesforce">
    <img src="https://cdn.worldvectorlogo.com/logos/hubspot.svg" alt="HubSpot">
    <img src="https://cdn.worldvectorlogo.com/logos/snowflake.svg" alt="Snowflake">
    <img src="https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" alt="Slack">
    <img src="https://cdn.worldvectorlogo.com/logos/xero-1.svg" alt="Xero">
  </div>
</section>

<section class="ps reveal">
  <div class="ps-inner">
    <div class="ps-col">
      <h3 style="color:var(--red);">The Old Way</h3>
      <div class="ps-item"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg><span>15+ day monthly close with manual spreadsheets</span></div>
      <div class="ps-item"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg><span>Copy-paste reconciliation across 20+ tabs</span></div>
      <div class="ps-item"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg><span>Audit anxiety every quarter with scattered docs</span></div>
    </div>
    <div class="ps-arrow"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
    <div class="ps-col">
      <h3 style="color:var(--green);">The FinanceOS Way</h3>
      <div class="ps-item"><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>3-day automated close with AI workflows</span></div>
      <div class="ps-item"><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>AI-powered reconciliation matches 98% automatically</span></div>
      <div class="ps-item"><svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Always audit-ready with built-in SOX controls</span></div>
    </div>
  </div>
</section>

<section class="roi reveal">
  <div class="roi-inner">
    <h2>See Your Potential Savings</h2>
    <div class="sub">Adjust the sliders to see how FinanceOS can impact your team</div>
    <div class="sliders">
      <div class="slider-group"><label>Monthly Close Time</label><div class="s-value" id="sv1">15 days</div><input type="range" min="5" max="30" value="15" oninput="calcROI();" id="s1"/></div>
      <div class="slider-group"><label>Team Size</label><div class="s-value" id="sv2">5 people</div><input type="range" min="1" max="20" value="5" oninput="calcROI();" id="s2"/></div>
      <div class="slider-group"><label>Annual Revenue</label><div class="s-value" id="sv3">$50M</div><input type="range" min="1" max="500" value="50" oninput="calcROI();" id="s3"/></div>
    </div>
    <div class="roi-result">
      <h3>With FinanceOS you could save</h3>
      <div class="roi-stats">
        <div class="roi-stat"><div class="rv" id="r1">720</div><div class="rl">Hours saved per year</div></div>
        <div class="roi-stat"><div class="rv" id="r2">$180K</div><div class="rl">Annual cost savings</div></div>
        <div class="roi-stat"><div class="rv" id="r3">12 days</div><div class="rl">Faster monthly close</div></div>
      </div>
    </div>
  </div>
</section>

<section class="feat-section reveal">
  <div class="feat-grid">
    <div class="feat-card"><div class="ficon" style="background:rgba(139,92,246,0.1);color:var(--purple);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div><h4>AI Copilot</h4><p>Ask questions in plain English and get instant financial insights. Variance analysis, trend detection, and anomaly alerts — all automatic.</p></div>
    <div class="feat-card"><div class="ficon" style="background:rgba(59,130,246,0.1);color:var(--blue);"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div><h4>Multi-Entity</h4><p>Consolidate unlimited subsidiaries with automated intercompany eliminations, currency conversion, and real-time consolidated views.</p></div>
    <div class="feat-card"><div class="ficon" style="background:rgba(245,158,11,0.1);color:var(--amber);"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><h4>SOX Compliance</h4><p>Built-in Section 404 controls testing, comprehensive audit trails, and board-ready compliance dashboards. Always audit-ready.</p></div>
  </div>
</section>

<section class="testi reveal">
  <div class="testi-card">
    <div class="testi-quote">"FinanceOS cut our close time from 14 days to 3. The AI Copilot catches variances we'd never spot manually, and our auditors love the built-in trail. It's been transformative for our team."</div>
    <div class="testi-author"><div class="testi-avatar">MT</div><div class="testi-info"><div class="tname">Michael Torres</div><div class="trole">CFO, Meridian Corp</div></div></div>
  </div>
</section>

<section class="final-cta">
  <h2>Transform Your Finance Operations Today</h2>
  <p>Join 500+ finance teams closing faster, forecasting smarter, and staying audit-ready.</p>
  <div class="final-form"><input type="email" placeholder="Enter your work email"/><a class="btn-green-lg" href="#" style="animation:none;padding:14px 28px;font-size:14px;">Get Started Free</a></div>
  <div class="final-note">30-day money-back guarantee. Subscribe risk-free.</div>
</section>

<footer class="footer">2026 FinanceOS, Inc. All rights reserved. | SOC 2 Type II | GDPR Compliant | 256-bit Encryption</footer>


` }} />
    </>
  );
}
