'use client';

import { useEffect, useRef } from 'react';

export default function V3DashboardCeoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Scroll progress
window.addEventListener('scroll',()=>{
  const h=document.documentElement;
  const pct=h.scrollTop/(h.scrollHeight-h.clientHeight)*100;
  document.getElementById('scrollProgress').style.width=pct+'%';
});

// Counter animation
function animateCounters(){
  document.querySelectorAll('.counter').forEach(el=>{
    const to=parseFloat(el.dataset.to);
    const dec=parseInt(el.dataset.decimals)||0;
    const dur=1200;
    const start=performance.now();
    function tick(now){
      let p=Math.min((now-start)/dur,1);
      p=1-Math.pow(1-p,3);
      el.textContent=(to*p).toFixed(dec);
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// Rule of 40 animation
function animateRule40(){
  const el=document.getElementById('rule40Num');
  const fill=document.getElementById('rule40Fill');
  const dur=1400,start=performance.now();
  function tick(now){
    let p=Math.min((now-start)/dur,1);
    p=1-Math.pow(1-p,3);
    el.textContent=Math.round(52*p);
    if(p<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  setTimeout(()=>{fill.style.width='52%'},100);
}

// Fundraising ring
function animateFundRing(){
  const ring=document.getElementById('fundRing');
  const score=document.getElementById('fundScore');
  const circ=2*Math.PI*65; // ~408
  const pct=0.82;
  ring.style.strokeDashoffset=circ*(1-pct);
  const dur=1400,start=performance.now();
  function tick(now){
    let p=Math.min((now-start)/dur,1);
    p=1-Math.pow(1-p,3);
    score.textContent=Math.round(82*p);
    if(p<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Segment bars
function animateSegments(){
  document.querySelectorAll('.segment-bar-fill').forEach(bar=>{
    bar.style.width=bar.dataset.w;
  });
}

// 3D tilt on KPI cards
document.querySelectorAll('.kpi-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=\`perspective(800px) rotateY(\${x*6}deg) rotateX(\${-y*6}deg) translateY(-4px)\`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform=''});
});

// Staggered entrance with IntersectionObserver
const obs=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.opacity='1';
      entry.target.style.transform='translateY(0)';
      obs.unobserve(entry.target);
    }
  });
},{threshold:0.15});

document.querySelectorAll('.kpi-card,.panel,.copilot,.comp-card').forEach((el,i)=>{
  el.style.opacity='0';
  el.style.transform='translateY(24px)';
  el.style.transition=\`opacity 0.6s \${i*0.08}s cubic-bezier(.23,1,.32,1),transform 0.6s \${i*0.08}s cubic-bezier(.23,1,.32,1)\`;
  obs.observe(el);
});

// Trigger animations on load
setTimeout(()=>{animateCounters();animateRule40();animateFundRing();animateSegments()},400);`
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
  --border:rgba(255,255,255,0.06);--border-hover:rgba(139,92,246,0.3);
  --text:#f1f1f4;--text-2:#a0a0b8;--text-3:#6b6b80;
  --purple:#8b5cf6;--purple-glow:rgba(139,92,246,0.15);--purple-light:#a78bfa;
  --green:#10b981;--green-glow:rgba(16,185,129,0.12);
  --blue:#3b82f6;--blue-glow:rgba(59,130,246,0.12);
  --amber:#f59e0b;--amber-glow:rgba(245,158,11,0.12);
  --rose:#f43f5e;--rose-glow:rgba(244,63,94,0.12);
  --cyan:#06b6d4;--cyan-glow:rgba(6,182,212,0.12);
  --radius:16px;--radius-sm:10px;--radius-xs:6px;
}
body{background:var(--bg);color:var(--text);font-family:'Manrope',system-ui,sans-serif;line-height:1.6;overflow-x:hidden}
.mono{font-family:'JetBrains Mono',monospace}

/* ─── Scroll Progress ─── */
.scroll-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--purple),var(--blue),var(--cyan));z-index:999;width:0%;transition:width 50ms linear}

/* ─── Header ─── */
.dash-header{padding:28px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);backdrop-filter:blur(20px);position:sticky;top:0;z-index:90;background:rgba(10,10,15,0.85)}
.dash-logo{display:flex;align-items:center;gap:12px}
.dash-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--purple),#7c3aed);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff}
.dash-logo-text{font-size:18px;font-weight:700;background:linear-gradient(135deg,var(--purple-light),var(--text));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.dash-role{font-size:13px;color:var(--text-2);background:var(--surface-2);padding:6px 14px;border-radius:20px;border:1px solid var(--border)}
.dash-role span{color:var(--purple-light);font-weight:600}

/* ─── Layout ─── */
.dash-container{max-width:1400px;margin:0 auto;padding:32px 40px 80px}
.dash-title-row{margin-bottom:32px}
.dash-title{font-size:28px;font-weight:800;margin-bottom:4px}
.dash-subtitle{color:var(--text-2);font-size:14px}

/* ─── KPI Grid ─── */
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px}
.kpi-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;position:relative;overflow:hidden;transition:transform 0.4s cubic-bezier(.23,1,.32,1),box-shadow 0.4s ease,border-color 0.3s ease;cursor:default}
.kpi-card:hover{border-color:var(--border-hover);box-shadow:0 8px 40px var(--purple-glow)}
.kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:3px 3px 0 0;opacity:0;transition:opacity 0.3s ease}
.kpi-card:hover::before{opacity:1}
.kpi-card[data-accent="purple"]::before{background:linear-gradient(90deg,var(--purple),var(--purple-light))}
.kpi-card[data-accent="green"]::before{background:linear-gradient(90deg,var(--green),#34d399)}
.kpi-card[data-accent="blue"]::before{background:linear-gradient(90deg,var(--blue),#60a5fa)}
.kpi-card[data-accent="amber"]::before{background:linear-gradient(90deg,var(--amber),#fbbf24)}
.kpi-card[data-accent="rose"]::before{background:linear-gradient(90deg,var(--rose),#fb7185)}
.kpi-card[data-accent="cyan"]::before{background:linear-gradient(90deg,var(--cyan),#22d3ee)}
.kpi-label{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-3);margin-bottom:8px}
.kpi-value{font-size:32px;font-weight:800;margin-bottom:6px;display:flex;align-items:baseline;gap:4px}
.kpi-value .unit{font-size:18px;font-weight:600;color:var(--text-2)}
.kpi-delta{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;padding:3px 8px;border-radius:20px}
.kpi-delta.up{color:var(--green);background:var(--green-glow)}
.kpi-delta.down{color:var(--rose);background:var(--rose-glow)}
.kpi-delta.neutral{color:var(--amber);background:var(--amber-glow)}
.kpi-spark{display:flex;align-items:flex-end;gap:3px;height:36px;margin-top:14px}
.kpi-spark .bar{flex:1;border-radius:3px;transition:height 0.6s cubic-bezier(.23,1,.32,1);background:var(--purple);opacity:0.5}
.kpi-spark .bar:last-child{opacity:1}

/* ─── Two-Column Layout ─── */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.panel-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.panel-title{font-size:16px;font-weight:700}
.panel-badge{font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;background:var(--purple-glow);color:var(--purple-light)}
.panel-body{padding:20px 24px 24px}

/* ─── Rule of 40 ─── */
.rule40-score{text-align:center;padding:20px 0}
.rule40-number{font-size:64px;font-weight:800;background:linear-gradient(135deg,var(--green),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.rule40-label{color:var(--text-2);font-size:13px;margin-top:2px}
.rule40-breakdown{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
.rule40-item{background:var(--surface-2);border-radius:var(--radius-sm);padding:16px;text-align:center}
.rule40-item-value{font-size:24px;font-weight:700;margin-bottom:2px}
.rule40-item-label{font-size:12px;color:var(--text-3)}
.rule40-bar{height:8px;background:var(--surface-3);border-radius:4px;margin-top:20px;overflow:hidden;position:relative}
.rule40-bar::before{content:'';position:absolute;left:0;top:0;bottom:0;border-radius:4px;transition:width 1.2s cubic-bezier(.23,1,.32,1)}
.rule40-bar[data-val="52"]::before{width:52%;background:linear-gradient(90deg,var(--green),var(--cyan))}
.rule40-threshold{display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);margin-top:6px}

/* ─── Segment Performance ─── */
.segment-table{width:100%}
.segment-row{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 80px;gap:12px;padding:12px 0;align-items:center;border-bottom:1px solid var(--border)}
.segment-row:last-child{border-bottom:none}
.segment-row.header{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-3);padding-bottom:8px}
.segment-name{font-weight:600;font-size:14px}
.segment-val{font-size:14px;font-weight:500}
.segment-bar-wrap{height:6px;background:var(--surface-3);border-radius:3px;overflow:hidden}
.segment-bar-fill{height:100%;border-radius:3px;transition:width 1s cubic-bezier(.23,1,.32,1)}

/* ─── Competitive Positioning ─── */
.comp-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.comp-card{background:var(--surface-2);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border);transition:border-color 0.3s ease}
.comp-card:hover{border-color:var(--border-hover)}
.comp-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.comp-metric{font-size:12px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em}
.comp-rank{font-size:11px;font-weight:600;padding:3px 8px;border-radius:12px}
.comp-rank.top{color:var(--green);background:var(--green-glow)}
.comp-rank.mid{color:var(--amber);background:var(--amber-glow)}
.comp-value{font-size:22px;font-weight:700;margin-bottom:2px}
.comp-context{font-size:12px;color:var(--text-3)}

/* ─── Fundraising Readiness ─── */
.fund-score-wrap{text-align:center;padding:16px 0}
.fund-score-ring{width:140px;height:140px;margin:0 auto 12px;position:relative}
.fund-score-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.fund-score-ring circle{fill:none;stroke-width:8;stroke-linecap:round}
.fund-score-ring .bg{stroke:var(--surface-3)}
.fund-score-ring .fg{stroke:url(#fundGrad);stroke-dasharray:408;stroke-dashoffset:408;transition:stroke-dashoffset 1.5s cubic-bezier(.23,1,.32,1)}
.fund-score-num{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:36px;font-weight:800}
.fund-label{font-size:13px;color:var(--text-2)}
.fund-checklist{margin-top:16px}
.fund-item{display:flex;align-items:center;gap:10px;padding:8px 0;font-size:13px}
.fund-check{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0}
.fund-check.done{background:var(--green-glow);color:var(--green)}
.fund-check.pending{background:var(--amber-glow);color:var(--amber)}

/* ─── AI Copilot ─── */
.copilot{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.copilot-header{padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.copilot-dot{width:8px;height:8px;border-radius:50%;background:var(--purple);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.copilot-title{font-size:14px;font-weight:700}
.copilot-body{padding:20px 24px}
.copilot-msg{margin-bottom:16px}
.copilot-msg.user{text-align:right}
.copilot-msg.user .copilot-bubble{background:var(--purple);color:#fff;display:inline-block;text-align:left}
.copilot-msg.ai .copilot-bubble{background:var(--surface-2);display:inline-block}
.copilot-bubble{padding:12px 16px;border-radius:12px;font-size:13px;max-width:85%;line-height:1.5}
.copilot-input{display:flex;gap:8px;padding:16px 24px;border-top:1px solid var(--border)}
.copilot-input input{flex:1;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color 0.2s}
.copilot-input input:focus{border-color:var(--purple)}
.copilot-input button{background:linear-gradient(135deg,var(--purple),#7c3aed);border:none;color:#fff;padding:10px 18px;border-radius:var(--radius-sm);font-weight:600;font-size:13px;cursor:pointer;position:relative;overflow:hidden}
.copilot-input button::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);animation:shimmer 3s infinite}
@keyframes shimmer{0%{left:-100%}100%{left:100%}}

/* ─── Full-width panel ─── */
.full-panel{margin-bottom:32px}

/* ─── Responsive ─── */
@media(max-width:960px){
  .kpi-grid{grid-template-columns:repeat(2,1fr)}
  .two-col{grid-template-columns:1fr}
  .dash-header{padding:20px 24px}
  .dash-container{padding:24px}
}
@media(max-width:560px){
  .kpi-grid{grid-template-columns:1fr}
  .comp-grid{grid-template-columns:1fr}
  .rule40-breakdown{grid-template-columns:1fr}
  .segment-row{grid-template-columns:1.2fr 1fr 1fr;font-size:13px}
  .segment-row .segment-bar-wrap{display:none}
  .segment-row .segment-val:last-child{display:none}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<div class="scroll-progress" id="scrollProgress"></div>

<!-- Header -->
<header class="dash-header">
  <div class="dash-logo">
    <div class="dash-logo-icon">F</div>
    <div class="dash-logo-text">FinanceOS</div>
  </div>
  <div class="dash-role"><span>CEO</span> &nbsp;Strategic Dashboard</div>
</header>

<main class="dash-container">
  <div class="dash-title-row">
    <h1 class="dash-title">Strategic Command Center</h1>
    <p class="dash-subtitle">Bird's-eye view of company health &middot; Updated live</p>
  </div>

  <!-- KPIs -->
  <div class="kpi-grid">
    <div class="kpi-card" data-accent="purple">
      <div class="kpi-label">Annual Recurring Revenue</div>
      <div class="kpi-value"><span class="unit">$</span><span class="counter" data-to="62.4" data-decimals="1">0</span><span class="unit">M</span></div>
      <div class="kpi-delta up">&#9650; 34% YoY</div>
      <div class="kpi-spark"><div class="bar" style="height:40%"></div><div class="bar" style="height:52%"></div><div class="bar" style="height:48%"></div><div class="bar" style="height:61%"></div><div class="bar" style="height:58%"></div><div class="bar" style="height:72%"></div><div class="bar" style="height:68%"></div><div class="bar" style="height:78%"></div><div class="bar" style="height:85%"></div><div class="bar" style="height:92%"></div><div class="bar" style="height:88%"></div><div class="bar" style="height:100%"></div></div>
    </div>
    <div class="kpi-card" data-accent="green">
      <div class="kpi-label">Net Dollar Retention</div>
      <div class="kpi-value"><span class="counter" data-to="124" data-decimals="0">0</span><span class="unit">%</span></div>
      <div class="kpi-delta up">&#9650; 8pts vs Q3</div>
      <div class="kpi-spark"><div class="bar" style="height:70%;background:var(--green)"></div><div class="bar" style="height:72%;background:var(--green)"></div><div class="bar" style="height:68%;background:var(--green)"></div><div class="bar" style="height:78%;background:var(--green)"></div><div class="bar" style="height:82%;background:var(--green)"></div><div class="bar" style="height:80%;background:var(--green)"></div><div class="bar" style="height:85%;background:var(--green)"></div><div class="bar" style="height:88%;background:var(--green)"></div><div class="bar" style="height:91%;background:var(--green)"></div><div class="bar" style="height:95%;background:var(--green)"></div><div class="bar" style="height:98%;background:var(--green)"></div><div class="bar" style="height:100%;background:var(--green)"></div></div>
    </div>
    <div class="kpi-card" data-accent="blue">
      <div class="kpi-label">Rule of 40 Score</div>
      <div class="kpi-value"><span class="counter" data-to="52" data-decimals="0">0</span></div>
      <div class="kpi-delta up">&#9650; Above threshold</div>
      <div class="kpi-spark"><div class="bar" style="height:55%;background:var(--blue)"></div><div class="bar" style="height:60%;background:var(--blue)"></div><div class="bar" style="height:58%;background:var(--blue)"></div><div class="bar" style="height:65%;background:var(--blue)"></div><div class="bar" style="height:70%;background:var(--blue)"></div><div class="bar" style="height:68%;background:var(--blue)"></div><div class="bar" style="height:75%;background:var(--blue)"></div><div class="bar" style="height:78%;background:var(--blue)"></div><div class="bar" style="height:82%;background:var(--blue)"></div><div class="bar" style="height:86%;background:var(--blue)"></div><div class="bar" style="height:90%;background:var(--blue)"></div><div class="bar" style="height:100%;background:var(--blue)"></div></div>
    </div>
    <div class="kpi-card" data-accent="amber">
      <div class="kpi-label">Gross Margin</div>
      <div class="kpi-value"><span class="counter" data-to="84.2" data-decimals="1">0</span><span class="unit">%</span></div>
      <div class="kpi-delta up">&#9650; 2.1pts QoQ</div>
      <div class="kpi-spark"><div class="bar" style="height:78%;background:var(--amber)"></div><div class="bar" style="height:80%;background:var(--amber)"></div><div class="bar" style="height:79%;background:var(--amber)"></div><div class="bar" style="height:82%;background:var(--amber)"></div><div class="bar" style="height:81%;background:var(--amber)"></div><div class="bar" style="height:83%;background:var(--amber)"></div><div class="bar" style="height:84%;background:var(--amber)"></div><div class="bar" style="height:83%;background:var(--amber)"></div><div class="bar" style="height:85%;background:var(--amber)"></div><div class="bar" style="height:84%;background:var(--amber)"></div><div class="bar" style="height:86%;background:var(--amber)"></div><div class="bar" style="height:100%;background:var(--amber)"></div></div>
    </div>
    <div class="kpi-card" data-accent="cyan">
      <div class="kpi-label">CAC Payback Period</div>
      <div class="kpi-value"><span class="counter" data-to="14" data-decimals="0">0</span><span class="unit">mo</span></div>
      <div class="kpi-delta up">&#9660; 3mo improvement</div>
      <div class="kpi-spark"><div class="bar" style="height:100%;background:var(--cyan)"></div><div class="bar" style="height:95%;background:var(--cyan)"></div><div class="bar" style="height:88%;background:var(--cyan)"></div><div class="bar" style="height:82%;background:var(--cyan)"></div><div class="bar" style="height:78%;background:var(--cyan)"></div><div class="bar" style="height:72%;background:var(--cyan)"></div><div class="bar" style="height:68%;background:var(--cyan)"></div><div class="bar" style="height:62%;background:var(--cyan)"></div><div class="bar" style="height:58%;background:var(--cyan)"></div><div class="bar" style="height:55%;background:var(--cyan)"></div><div class="bar" style="height:50%;background:var(--cyan)"></div><div class="bar" style="height:45%;background:var(--cyan)"></div></div>
    </div>
    <div class="kpi-card" data-accent="rose">
      <div class="kpi-label">Monthly Burn Rate</div>
      <div class="kpi-value"><span class="unit">$</span><span class="counter" data-to="1.8" data-decimals="1">0</span><span class="unit">M/mo</span></div>
      <div class="kpi-delta neutral">&#9644; Stable</div>
      <div class="kpi-spark"><div class="bar" style="height:85%;background:var(--rose)"></div><div class="bar" style="height:88%;background:var(--rose)"></div><div class="bar" style="height:82%;background:var(--rose)"></div><div class="bar" style="height:90%;background:var(--rose)"></div><div class="bar" style="height:86%;background:var(--rose)"></div><div class="bar" style="height:84%;background:var(--rose)"></div><div class="bar" style="height:88%;background:var(--rose)"></div><div class="bar" style="height:85%;background:var(--rose)"></div><div class="bar" style="height:87%;background:var(--rose)"></div><div class="bar" style="height:86%;background:var(--rose)"></div><div class="bar" style="height:84%;background:var(--rose)"></div><div class="bar" style="height:85%;background:var(--rose)"></div></div>
    </div>
  </div>

  <!-- Rule of 40 + Segment Performance -->
  <div class="two-col">
    <!-- Rule of 40 -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Rule of 40 Breakdown</span>
        <span class="panel-badge">Above Threshold</span>
      </div>
      <div class="panel-body">
        <div class="rule40-score">
          <div class="rule40-number" id="rule40Num">0</div>
          <div class="rule40-label">Revenue Growth + Profit Margin</div>
        </div>
        <div class="rule40-breakdown">
          <div class="rule40-item">
            <div class="rule40-item-value" style="color:var(--green)">34%</div>
            <div class="rule40-item-label">Revenue Growth Rate</div>
          </div>
          <div class="rule40-item">
            <div class="rule40-item-value" style="color:var(--blue)">18%</div>
            <div class="rule40-item-label">FCF Margin</div>
          </div>
        </div>
        <div class="rule40-bar" data-val="52" style="margin-top:20px">
          <div style="position:absolute;left:0;top:0;bottom:0;width:0;border-radius:4px;background:linear-gradient(90deg,var(--green),var(--cyan));transition:width 1.2s cubic-bezier(.23,1,.32,1)" id="rule40Fill"></div>
        </div>
        <div class="rule40-threshold">
          <span>0</span>
          <span style="color:var(--amber)">40 (threshold)</span>
          <span>100</span>
        </div>
      </div>
    </div>

    <!-- Segment Performance -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Segment Performance</span>
        <span class="panel-badge">4 Segments</span>
      </div>
      <div class="panel-body">
        <div class="segment-table">
          <div class="segment-row header">
            <span>Segment</span><span>ARR</span><span>Growth</span><span>Margin</span><span>Trend</span>
          </div>
          <div class="segment-row">
            <span class="segment-name">Enterprise</span>
            <span class="segment-val">$28.4M</span>
            <span class="segment-val" style="color:var(--green)">+42%</span>
            <span class="segment-val">87%</span>
            <span class="segment-bar-wrap"><div class="segment-bar-fill" style="width:0%;background:var(--purple)" data-w="88%"></div></span>
          </div>
          <div class="segment-row">
            <span class="segment-name">Mid-Market</span>
            <span class="segment-val">$19.6M</span>
            <span class="segment-val" style="color:var(--green)">+31%</span>
            <span class="segment-val">82%</span>
            <span class="segment-bar-wrap"><div class="segment-bar-fill" style="width:0%;background:var(--blue)" data-w="72%"></div></span>
          </div>
          <div class="segment-row">
            <span class="segment-name">SMB</span>
            <span class="segment-val">$10.2M</span>
            <span class="segment-val" style="color:var(--green)">+26%</span>
            <span class="segment-val">79%</span>
            <span class="segment-bar-wrap"><div class="segment-bar-fill" style="width:0%;background:var(--cyan)" data-w="55%"></div></span>
          </div>
          <div class="segment-row">
            <span class="segment-name">Self-Serve</span>
            <span class="segment-val">$4.2M</span>
            <span class="segment-val" style="color:var(--amber)">+18%</span>
            <span class="segment-val">91%</span>
            <span class="segment-bar-wrap"><div class="segment-bar-fill" style="width:0%;background:var(--amber)" data-w="35%"></div></span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Competitive Positioning + Fundraising Readiness -->
  <div class="two-col">
    <!-- Competitive Positioning -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Competitive Positioning</span>
        <span class="panel-badge">Market Intel</span>
      </div>
      <div class="panel-body">
        <div class="comp-grid">
          <div class="comp-card">
            <div class="comp-card-header">
              <span class="comp-metric">Market Share</span>
              <span class="comp-rank top">#2 in category</span>
            </div>
            <div class="comp-value">8.4%</div>
            <div class="comp-context">Up from 5.1% last year</div>
          </div>
          <div class="comp-card">
            <div class="comp-card-header">
              <span class="comp-metric">Win Rate</span>
              <span class="comp-rank top">Top quartile</span>
            </div>
            <div class="comp-value">68%</div>
            <div class="comp-context">vs. 52% industry avg</div>
          </div>
          <div class="comp-card">
            <div class="comp-card-header">
              <span class="comp-metric">NPS Score</span>
              <span class="comp-rank top">Excellent</span>
            </div>
            <div class="comp-value">72</div>
            <div class="comp-context">vs. 38 industry median</div>
          </div>
          <div class="comp-card">
            <div class="comp-card-header">
              <span class="comp-metric">Avg Deal Size</span>
              <span class="comp-rank mid">Growing</span>
            </div>
            <div class="comp-value">$86K</div>
            <div class="comp-context">+24% vs prior year</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fundraising Readiness -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Fundraising Readiness</span>
        <span class="panel-badge">Series C</span>
      </div>
      <div class="panel-body">
        <div class="fund-score-wrap">
          <div class="fund-score-ring">
            <svg viewBox="0 0 140 140">
              <defs>
                <linearGradient id="fundGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="var(--purple)"/>
                  <stop offset="100%" stop-color="var(--cyan)"/>
                </linearGradient>
              </defs>
              <circle class="bg" cx="70" cy="70" r="65"/>
              <circle class="fg" id="fundRing" cx="70" cy="70" r="65"/>
            </svg>
            <div class="fund-score-num" id="fundScore">0</div>
          </div>
          <div class="fund-label">Investor Readiness Score</div>
        </div>
        <div class="fund-checklist">
          <div class="fund-item"><div class="fund-check done">&#10003;</div>Rule of 40 exceeded</div>
          <div class="fund-item"><div class="fund-check done">&#10003;</div>NDR above 120%</div>
          <div class="fund-item"><div class="fund-check done">&#10003;</div>3+ quarters consistent growth</div>
          <div class="fund-item"><div class="fund-check done">&#10003;</div>Data room prepared</div>
          <div class="fund-item"><div class="fund-check pending">&#9679;</div>Cap table cleanup in progress</div>
          <div class="fund-item"><div class="fund-check pending">&#9679;</div>409A valuation pending</div>
        </div>
      </div>
    </div>
  </div>

  <!-- AI Copilot -->
  <div class="copilot full-panel">
    <div class="copilot-header">
      <div class="copilot-dot"></div>
      <div class="copilot-title">AI Strategic Copilot</div>
    </div>
    <div class="copilot-body">
      <div class="copilot-msg user">
        <div class="copilot-bubble">What's driving our NDR improvement this quarter?</div>
      </div>
      <div class="copilot-msg ai">
        <div class="copilot-bubble">
          NDR increased 8pts to 124% driven by three factors: <strong>Enterprise expansion deals</strong> contributed +5pts (12 accounts upgraded tiers), <strong>mid-market upsells</strong> added +2pts (analytics add-on adoption at 34%), and <strong>reduced churn</strong> contributed +1pt (logo churn dropped from 3.2% to 2.1%). The enterprise segment alone expanded $4.2M in net-new ACV from existing accounts.
        </div>
      </div>
    </div>
    <div class="copilot-input">
      <input type="text" placeholder="Ask about strategy, metrics, or market position...">
      <button>Send</button>
    </div>
  </div>
</main>


` }} />
    </>
  );
}
