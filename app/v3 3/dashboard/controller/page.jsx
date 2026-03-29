'use client';

import { useEffect, useRef } from 'react';

export default function V3DashboardControllerPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Scroll progress
window.addEventListener('scroll',()=>{
  const h=document.documentElement;
  document.getElementById('scrollProgress').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
});

// Close bar animation
function animateClose(){
  document.getElementById('closeBar').style.width='55%';
  const el=document.getElementById('closePct');
  const dur=1200,start=performance.now();
  (function tick(now){
    let p=Math.min((now-start)/dur,1);p=1-Math.pow(1-p,3);
    el.textContent=Math.round(55*p);
    if(p<1)requestAnimationFrame(tick);
  })(performance.now());
}

// Animate aging bucket bars and compliance bars
function animateBars(){
  document.querySelectorAll('.aging-bucket-fill,.compliance-fill').forEach(bar=>{
    if(bar.dataset.w) bar.style.width=bar.dataset.w;
  });
}

// 3D tilt on cards
document.querySelectorAll('.close-step,.aging-bucket,.compliance-card,.recon-item').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=\`perspective(600px) rotateY(\${x*4}deg) rotateX(\${-y*4}deg) translateY(-2px)\`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform=''});
});

// Staggered entrance
const obs=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.opacity='1';
      entry.target.style.transform='translateY(0)';
      obs.unobserve(entry.target);
    }
  });
},{threshold:0.1});
document.querySelectorAll('.close-progress,.panel,.copilot,.close-step,.aging-bucket,.compliance-card').forEach((el,i)=>{
  el.style.opacity='0';
  el.style.transform='translateY(20px)';
  el.style.transition=\`opacity 0.5s \${i*0.06}s cubic-bezier(.23,1,.32,1),transform 0.5s \${i*0.06}s cubic-bezier(.23,1,.32,1)\`;
  obs.observe(el);
});

setTimeout(()=>{animateClose();animateBars()},400);`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0a0a0f;--surface:#111118;--surface-2:#1a1a24;--surface-3:#22222e;
  --border:rgba(255,255,255,0.06);--border-hover:rgba(16,185,129,0.3);
  --text:#f1f1f4;--text-2:#a0a0b8;--text-3:#6b6b80;
  --green:#10b981;--green-glow:rgba(16,185,129,0.15);--green-light:#34d399;
  --blue:#3b82f6;--blue-glow:rgba(59,130,246,0.12);
  --purple:#8b5cf6;--purple-glow:rgba(139,92,246,0.12);
  --amber:#f59e0b;--amber-glow:rgba(245,158,11,0.12);
  --rose:#f43f5e;--rose-glow:rgba(244,63,94,0.12);
  --cyan:#06b6d4;--cyan-glow:rgba(6,182,212,0.12);
  --radius:16px;--radius-sm:10px;--radius-xs:6px;
}
body{background:var(--bg);color:var(--text);font-family:'Manrope',system-ui,sans-serif;line-height:1.6;overflow-x:hidden}
.mono{font-family:'JetBrains Mono',monospace}

.scroll-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--green),var(--cyan),var(--blue));z-index:999;width:0%}

/* Header */
.dash-header{padding:28px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);backdrop-filter:blur(20px);position:sticky;top:0;z-index:90;background:rgba(10,10,15,0.85)}
.dash-logo{display:flex;align-items:center;gap:12px}
.dash-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--green),#059669);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff}
.dash-logo-text{font-size:18px;font-weight:700;background:linear-gradient(135deg,var(--green-light),var(--text));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.dash-role{font-size:13px;color:var(--text-2);background:var(--surface-2);padding:6px 14px;border-radius:20px;border:1px solid var(--border)}
.dash-role span{color:var(--green-light);font-weight:600}

.dash-container{max-width:1400px;margin:0 auto;padding:32px 40px 80px}
.dash-title{font-size:28px;font-weight:800;margin-bottom:4px}
.dash-subtitle{color:var(--text-2);font-size:14px;margin-bottom:32px}

/* Close Progress */
.close-progress{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;margin-bottom:28px}
.close-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.close-title{font-size:18px;font-weight:700}
.close-meta{display:flex;align-items:center;gap:12px}
.close-day{font-size:13px;font-weight:600;padding:5px 12px;border-radius:20px;background:var(--green-glow);color:var(--green-light)}
.close-pct{font-size:13px;color:var(--text-2)}
.close-bar-outer{height:12px;background:var(--surface-3);border-radius:6px;overflow:hidden;margin-bottom:20px}
.close-bar-inner{height:100%;border-radius:6px;background:linear-gradient(90deg,var(--green),var(--cyan));width:0%;transition:width 1.4s cubic-bezier(.23,1,.32,1)}
.close-steps{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.close-step{background:var(--surface-2);border-radius:var(--radius-sm);padding:14px;display:flex;align-items:center;gap:10px;border:1px solid var(--border);transition:border-color 0.2s}
.close-step:hover{border-color:var(--border-hover)}
.close-step-icon{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
.close-step-icon.done{background:var(--green-glow);color:var(--green)}
.close-step-icon.active{background:var(--amber-glow);color:var(--amber);animation:pulse 2s infinite}
.close-step-icon.pending{background:var(--surface-3);color:var(--text-3)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
.close-step-text{font-size:13px;font-weight:500}
.close-step-text small{display:block;color:var(--text-3);font-size:11px;font-weight:400;margin-top:1px}

/* Two column */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.panel-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.panel-title{font-size:16px;font-weight:700}
.panel-badge{font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px}
.badge-green{background:var(--green-glow);color:var(--green-light)}
.badge-amber{background:var(--amber-glow);color:var(--amber)}
.badge-blue{background:var(--blue-glow);color:var(--blue)}
.panel-body{padding:20px 24px 24px}

/* Reconciliation */
.recon-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px}
.recon-stat{background:var(--surface-2);border-radius:var(--radius-sm);padding:14px;text-align:center}
.recon-stat-val{font-size:22px;font-weight:700;margin-bottom:2px}
.recon-stat-label{font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em}
.recon-list{display:flex;flex-direction:column;gap:8px}
.recon-item{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surface-2);border-radius:var(--radius-xs);font-size:13px}
.recon-item-name{font-weight:500}
.recon-item-status{font-size:11px;font-weight:600;padding:3px 8px;border-radius:12px}
.recon-item-status.matched{color:var(--green);background:var(--green-glow)}
.recon-item-status.review{color:var(--amber);background:var(--amber-glow)}
.recon-item-status.exception{color:var(--rose);background:var(--rose-glow)}

/* GL Summary */
.gl-table{width:100%}
.gl-row{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:8px;padding:10px 0;align-items:center;border-bottom:1px solid var(--border);font-size:13px}
.gl-row:last-child{border-bottom:none}
.gl-row.header{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-3)}
.gl-account{font-weight:600}
.gl-val{font-weight:500;text-align:right}
.gl-var{text-align:right;font-weight:600;font-size:12px}
.gl-var.pos{color:var(--green)}
.gl-var.neg{color:var(--rose)}

/* AP/AR Aging */
.aging-buckets{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px}
.aging-bucket{background:var(--surface-2);border-radius:var(--radius-sm);padding:12px;text-align:center;border:1px solid var(--border);transition:border-color 0.2s,transform 0.3s}
.aging-bucket:hover{transform:translateY(-2px);border-color:var(--border-hover)}
.aging-bucket-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-3);margin-bottom:6px}
.aging-bucket-val{font-size:16px;font-weight:700}
.aging-bucket-bar{height:4px;background:var(--surface-3);border-radius:2px;margin-top:8px;overflow:hidden}
.aging-bucket-fill{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.23,1,.32,1)}
.aging-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.aging-total{background:var(--surface-2);border-radius:var(--radius-sm);padding:14px;text-align:center}
.aging-total-label{font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em}
.aging-total-val{font-size:24px;font-weight:700;margin-top:4px}

/* Compliance */
.compliance-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.compliance-card{background:var(--surface-2);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border);transition:border-color 0.2s}
.compliance-card:hover{border-color:var(--border-hover)}
.compliance-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.compliance-name{font-size:13px;font-weight:600}
.compliance-status{font-size:10px;font-weight:700;padding:3px 8px;border-radius:12px;text-transform:uppercase;letter-spacing:0.04em}
.compliance-status.pass{color:var(--green);background:var(--green-glow)}
.compliance-status.warn{color:var(--amber);background:var(--amber-glow)}
.compliance-status.due{color:var(--rose);background:var(--rose-glow)}
.compliance-detail{font-size:12px;color:var(--text-3)}
.compliance-bar{height:4px;background:var(--surface-3);border-radius:2px;margin-top:10px;overflow:hidden}
.compliance-fill{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.23,1,.32,1)}

/* Copilot */
.copilot{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:28px}
.copilot-header{padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.copilot-dot{width:8px;height:8px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
.copilot-title{font-size:14px;font-weight:700}
.copilot-body{padding:20px 24px}
.copilot-msg{margin-bottom:16px}
.copilot-msg.user{text-align:right}
.copilot-msg.user .copilot-bubble{background:var(--green);color:#fff;display:inline-block;text-align:left}
.copilot-msg.ai .copilot-bubble{background:var(--surface-2);display:inline-block}
.copilot-bubble{padding:12px 16px;border-radius:12px;font-size:13px;max-width:85%;line-height:1.5}
.copilot-input{display:flex;gap:8px;padding:16px 24px;border-top:1px solid var(--border)}
.copilot-input input{flex:1;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color 0.2s}
.copilot-input input:focus{border-color:var(--green)}
.copilot-input button{background:linear-gradient(135deg,var(--green),#059669);border:none;color:#fff;padding:10px 18px;border-radius:var(--radius-sm);font-weight:600;font-size:13px;cursor:pointer;position:relative;overflow:hidden}
.copilot-input button::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);animation:shimmer 3s infinite}
@keyframes shimmer{0%{left:-100%}100%{left:100%}}

@media(max-width:960px){
  .two-col{grid-template-columns:1fr}
  .close-steps{grid-template-columns:repeat(2,1fr)}
  .dash-header{padding:20px 24px}
  .dash-container{padding:24px}
  .aging-buckets{grid-template-columns:repeat(3,1fr)}
}
@media(max-width:560px){
  .close-steps{grid-template-columns:1fr}
  .recon-grid{grid-template-columns:1fr}
  .compliance-grid{grid-template-columns:1fr}
  .aging-buckets{grid-template-columns:repeat(2,1fr)}
  .gl-row{grid-template-columns:1.2fr 1fr 1fr}
  .gl-row .gl-val:last-child{display:none}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<div class="scroll-progress" id="scrollProgress"></div>

<header class="dash-header">
  <div class="dash-logo">
    <div class="dash-logo-icon">F</div>
    <div class="dash-logo-text">FinanceOS</div>
  </div>
  <div class="dash-role"><span>Controller</span> &nbsp;Operations Dashboard</div>
</header>

<main class="dash-container">
  <h1 class="dash-title">Month-End Close Command Center</h1>
  <p class="dash-subtitle">Close checklist with live status &middot; March 2026</p>

  <!-- Close Progress -->
  <div class="close-progress">
    <div class="close-header">
      <div class="close-title">Close Progress</div>
      <div class="close-meta">
        <span class="close-day">Day 3 of 5</span>
        <span class="close-pct"><strong id="closePct">0</strong>% Complete</span>
      </div>
    </div>
    <div class="close-bar-outer">
      <div class="close-bar-inner" id="closeBar"></div>
    </div>
    <div class="close-steps">
      <div class="close-step"><div class="close-step-icon done">&#10003;</div><div class="close-step-text">Revenue Recognition<small>Completed Day 1</small></div></div>
      <div class="close-step"><div class="close-step-icon done">&#10003;</div><div class="close-step-text">Payroll Accruals<small>Completed Day 1</small></div></div>
      <div class="close-step"><div class="close-step-icon done">&#10003;</div><div class="close-step-text">Bank Reconciliation<small>Completed Day 2</small></div></div>
      <div class="close-step"><div class="close-step-icon done">&#10003;</div><div class="close-step-text">Intercompany Entries<small>Completed Day 2</small></div></div>
      <div class="close-step"><div class="close-step-icon done">&#10003;</div><div class="close-step-text">Prepaid Amortization<small>Completed Day 2</small></div></div>
      <div class="close-step"><div class="close-step-icon active">&#9679;</div><div class="close-step-text">AP Cut-off Review<small>In progress</small></div></div>
      <div class="close-step"><div class="close-step-icon pending">&#9675;</div><div class="close-step-text">Depreciation Run<small>Day 4</small></div></div>
      <div class="close-step"><div class="close-step-icon pending">&#9675;</div><div class="close-step-text">Tax Provisions<small>Day 4</small></div></div>
      <div class="close-step"><div class="close-step-icon pending">&#9675;</div><div class="close-step-text">Flux Analysis<small>Day 5</small></div></div>
      <div class="close-step"><div class="close-step-icon pending">&#9675;</div><div class="close-step-text">Final Review &amp; Sign-off<small>Day 5</small></div></div>
    </div>
  </div>

  <!-- Reconciliation + GL Summary -->
  <div class="two-col">
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Reconciliation Status</span>
        <span class="panel-badge badge-green">14/18 Matched</span>
      </div>
      <div class="panel-body">
        <div class="recon-grid">
          <div class="recon-stat"><div class="recon-stat-val" style="color:var(--green)">14</div><div class="recon-stat-label">Matched</div></div>
          <div class="recon-stat"><div class="recon-stat-val" style="color:var(--amber)">3</div><div class="recon-stat-label">In Review</div></div>
          <div class="recon-stat"><div class="recon-stat-val" style="color:var(--rose)">1</div><div class="recon-stat-label">Exception</div></div>
        </div>
        <div class="recon-list">
          <div class="recon-item"><span class="recon-item-name">Operating Cash — Chase</span><span class="recon-item-status matched">Matched</span></div>
          <div class="recon-item"><span class="recon-item-name">Payroll — ADP</span><span class="recon-item-status matched">Matched</span></div>
          <div class="recon-item"><span class="recon-item-name">Revenue — Stripe</span><span class="recon-item-status matched">Matched</span></div>
          <div class="recon-item"><span class="recon-item-name">AP Subledger</span><span class="recon-item-status review">Review</span></div>
          <div class="recon-item"><span class="recon-item-name">Intercompany — EU Sub</span><span class="recon-item-status review">Review</span></div>
          <div class="recon-item"><span class="recon-item-name">Deferred Revenue</span><span class="recon-item-status exception">Exception</span></div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">GL Summary</span>
        <span class="panel-badge badge-blue">Trial Balance</span>
      </div>
      <div class="panel-body">
        <div class="gl-table">
          <div class="gl-row header"><span>Account</span><span style="text-align:right">Balance</span><span style="text-align:right">Prior Month</span><span style="text-align:right">Variance</span></div>
          <div class="gl-row"><span class="gl-account">Cash & Equivalents</span><span class="gl-val">$34.2M</span><span class="gl-val" style="color:var(--text-3)">$32.8M</span><span class="gl-var pos">+4.3%</span></div>
          <div class="gl-row"><span class="gl-account">Accounts Receivable</span><span class="gl-val">$8.6M</span><span class="gl-val" style="color:var(--text-3)">$7.9M</span><span class="gl-var neg">+8.9%</span></div>
          <div class="gl-row"><span class="gl-account">Deferred Revenue</span><span class="gl-val">$12.4M</span><span class="gl-val" style="color:var(--text-3)">$11.1M</span><span class="gl-var pos">+11.7%</span></div>
          <div class="gl-row"><span class="gl-account">Accounts Payable</span><span class="gl-val">$3.1M</span><span class="gl-val" style="color:var(--text-3)">$2.9M</span><span class="gl-var neg">+6.9%</span></div>
          <div class="gl-row"><span class="gl-account">Accrued Expenses</span><span class="gl-val">$2.8M</span><span class="gl-val" style="color:var(--text-3)">$2.6M</span><span class="gl-var neg">+7.7%</span></div>
          <div class="gl-row"><span class="gl-account">Equity</span><span class="gl-val">$46.3M</span><span class="gl-val" style="color:var(--text-3)">$44.1M</span><span class="gl-var pos">+5.0%</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- AP/AR Aging + Compliance -->
  <div class="two-col">
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">AP/AR Aging</span>
        <span class="panel-badge badge-amber">AR Focus</span>
      </div>
      <div class="panel-body">
        <div style="font-size:13px;font-weight:600;margin-bottom:12px;color:var(--text-2)">Accounts Receivable Aging</div>
        <div class="aging-buckets">
          <div class="aging-bucket"><div class="aging-bucket-label">Current</div><div class="aging-bucket-val" style="color:var(--green)">$4.8M</div><div class="aging-bucket-bar"><div class="aging-bucket-fill" style="width:0%;background:var(--green)" data-w="100%"></div></div></div>
          <div class="aging-bucket"><div class="aging-bucket-label">1-30 days</div><div class="aging-bucket-val" style="color:var(--blue)">$2.1M</div><div class="aging-bucket-bar"><div class="aging-bucket-fill" style="width:0%;background:var(--blue)" data-w="44%"></div></div></div>
          <div class="aging-bucket"><div class="aging-bucket-label">31-60 days</div><div class="aging-bucket-val" style="color:var(--amber)">$1.0M</div><div class="aging-bucket-bar"><div class="aging-bucket-fill" style="width:0%;background:var(--amber)" data-w="21%"></div></div></div>
          <div class="aging-bucket"><div class="aging-bucket-label">61-90 days</div><div class="aging-bucket-val" style="color:var(--rose)">$0.5M</div><div class="aging-bucket-bar"><div class="aging-bucket-fill" style="width:0%;background:var(--rose)" data-w="10%"></div></div></div>
          <div class="aging-bucket"><div class="aging-bucket-label">90+ days</div><div class="aging-bucket-val" style="color:var(--rose)">$0.2M</div><div class="aging-bucket-bar"><div class="aging-bucket-fill" style="width:0%;background:var(--rose)" data-w="4%"></div></div></div>
        </div>
        <div class="aging-summary">
          <div class="aging-total"><div class="aging-total-label">Total AR</div><div class="aging-total-val" style="color:var(--blue)">$8.6M</div></div>
          <div class="aging-total"><div class="aging-total-label">DSO</div><div class="aging-total-val" style="color:var(--amber)">42 days</div></div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Compliance &amp; Controls</span>
        <span class="panel-badge badge-green">SOX Ready</span>
      </div>
      <div class="panel-body">
        <div class="compliance-grid">
          <div class="compliance-card">
            <div class="compliance-card-header"><span class="compliance-name">SOX 404 Controls</span><span class="compliance-status pass">Pass</span></div>
            <div class="compliance-detail">All 42 key controls tested</div>
            <div class="compliance-bar"><div class="compliance-fill" style="width:0%;background:var(--green)" data-w="100%"></div></div>
          </div>
          <div class="compliance-card">
            <div class="compliance-card-header"><span class="compliance-name">Revenue ASC 606</span><span class="compliance-status pass">Compliant</span></div>
            <div class="compliance-detail">All contracts reviewed</div>
            <div class="compliance-bar"><div class="compliance-fill" style="width:0%;background:var(--green)" data-w="100%"></div></div>
          </div>
          <div class="compliance-card">
            <div class="compliance-card-header"><span class="compliance-name">Lease ASC 842</span><span class="compliance-status warn">Review</span></div>
            <div class="compliance-detail">2 new leases need classification</div>
            <div class="compliance-bar"><div class="compliance-fill" style="width:0%;background:var(--amber)" data-w="75%"></div></div>
          </div>
          <div class="compliance-card">
            <div class="compliance-card-header"><span class="compliance-name">Transfer Pricing</span><span class="compliance-status due">Due Apr 15</span></div>
            <div class="compliance-detail">Intercompany documentation</div>
            <div class="compliance-bar"><div class="compliance-fill" style="width:0%;background:var(--rose)" data-w="40%"></div></div>
          </div>
          <div class="compliance-card">
            <div class="compliance-card-header"><span class="compliance-name">Audit Prep</span><span class="compliance-status pass">On Track</span></div>
            <div class="compliance-detail">Q1 audit scheduled Apr 21</div>
            <div class="compliance-bar"><div class="compliance-fill" style="width:0%;background:var(--green)" data-w="90%"></div></div>
          </div>
          <div class="compliance-card">
            <div class="compliance-card-header"><span class="compliance-name">Sales Tax Nexus</span><span class="compliance-status pass">Filed</span></div>
            <div class="compliance-detail">12 states current</div>
            <div class="compliance-bar"><div class="compliance-fill" style="width:0%;background:var(--green)" data-w="100%"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- AI Copilot -->
  <div class="copilot">
    <div class="copilot-header">
      <div class="copilot-dot"></div>
      <div class="copilot-title">AI Close Assistant</div>
    </div>
    <div class="copilot-body">
      <div class="copilot-msg user">
        <div class="copilot-bubble">Why is the deferred revenue recon showing an exception?</div>
      </div>
      <div class="copilot-msg ai">
        <div class="copilot-bubble">
          The deferred revenue exception stems from a <strong>$142K timing difference</strong> between Stripe subscription billing and the revenue schedule. Specifically, 8 annual contracts billed on March 28 haven't been matched to their amortization schedules yet. The revenue recognition entries will auto-post once the billing system syncs at end-of-day. This is a known timing issue during close and should clear by Day 4.
        </div>
      </div>
    </div>
    <div class="copilot-input">
      <input type="text" placeholder="Ask about reconciliations, close tasks, or compliance...">
      <button>Send</button>
    </div>
  </div>
</main>


` }} />
    </>
  );
}
