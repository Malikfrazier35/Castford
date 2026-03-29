'use client';

import { useEffect, useRef } from 'react';

export default function V3DashboardFpaPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Scroll progress
window.addEventListener('scroll',()=>{
  const h=document.documentElement;
  document.getElementById('scrollProgress').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
});

// Forecast accuracy counter
function animateForecast(){
  const el=document.getElementById('forecastNum');
  const dur=1200,start=performance.now();
  (function tick(now){
    let p=Math.min((now-start)/dur,1);p=1-Math.pow(1-p,3);
    el.textContent=(96.2*p).toFixed(1)+'%';
    if(p<1)requestAnimationFrame(tick);
  })(performance.now());
}

// Animate all data-w bars
function animateBars(){
  document.querySelectorAll('[data-w]').forEach(bar=>{
    bar.style.width=bar.dataset.w;
  });
}

// Drill toggle
function toggleDrill(id){
  const el=document.getElementById(id);
  const arrow=document.getElementById(id+'-arrow');
  el.classList.toggle('open');
  arrow.classList.toggle('open');
}

// 3D tilt
document.querySelectorAll('.var-card,.scenario-row,.drill-header,.forecast-q').forEach(card=>{
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
document.querySelectorAll('.var-card,.bva-panel,.panel,.copilot').forEach((el,i)=>{
  el.style.opacity='0';
  el.style.transform='translateY(20px)';
  el.style.transition=\`opacity 0.5s \${i*0.08}s cubic-bezier(.23,1,.32,1),transform 0.5s \${i*0.08}s cubic-bezier(.23,1,.32,1)\`;
  obs.observe(el);
});

setTimeout(()=>{animateForecast();animateBars()},400);`
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
  --border:rgba(255,255,255,0.06);--border-hover:rgba(245,158,11,0.3);
  --text:#f1f1f4;--text-2:#a0a0b8;--text-3:#6b6b80;
  --amber:#f59e0b;--amber-glow:rgba(245,158,11,0.15);--amber-light:#fbbf24;
  --green:#10b981;--green-glow:rgba(16,185,129,0.12);
  --blue:#3b82f6;--blue-glow:rgba(59,130,246,0.12);
  --purple:#8b5cf6;--purple-glow:rgba(139,92,246,0.12);
  --rose:#f43f5e;--rose-glow:rgba(244,63,94,0.12);
  --cyan:#06b6d4;--cyan-glow:rgba(6,182,212,0.12);
  --radius:16px;--radius-sm:10px;--radius-xs:6px;
}
body{background:var(--bg);color:var(--text);font-family:'Manrope',system-ui,sans-serif;line-height:1.6;overflow-x:hidden}
.mono{font-family:'JetBrains Mono',monospace}

.scroll-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--amber),var(--rose),var(--purple));z-index:999;width:0%}

/* Header */
.dash-header{padding:28px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);backdrop-filter:blur(20px);position:sticky;top:0;z-index:90;background:rgba(10,10,15,0.85)}
.dash-logo{display:flex;align-items:center;gap:12px}
.dash-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--amber),#d97706);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff}
.dash-logo-text{font-size:18px;font-weight:700;background:linear-gradient(135deg,var(--amber-light),var(--text));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.dash-role{font-size:13px;color:var(--text-2);background:var(--surface-2);padding:6px 14px;border-radius:20px;border:1px solid var(--border)}
.dash-role span{color:var(--amber-light);font-weight:600}

.dash-container{max-width:1400px;margin:0 auto;padding:32px 40px 80px}
.dash-title{font-size:28px;font-weight:800;margin-bottom:4px}
.dash-subtitle{color:var(--text-2);font-size:14px;margin-bottom:32px}

/* Variance Summary Bar */
.variance-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
.var-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;position:relative;overflow:hidden;transition:transform 0.4s cubic-bezier(.23,1,.32,1),box-shadow 0.4s,border-color 0.3s;cursor:default}
.var-card:hover{border-color:var(--border-hover);box-shadow:0 8px 32px var(--amber-glow)}
.var-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;opacity:0;transition:opacity 0.3s}
.var-card:hover::before{opacity:1}
.var-card:nth-child(1)::before{background:var(--green)}
.var-card:nth-child(2)::before{background:var(--rose)}
.var-card:nth-child(3)::before{background:var(--amber)}
.var-card:nth-child(4)::before{background:var(--blue)}
.var-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-3);margin-bottom:6px}
.var-value{font-size:26px;font-weight:800;margin-bottom:4px}
.var-delta{font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:12px}
.var-delta.fav{color:var(--green);background:var(--green-glow)}
.var-delta.unfav{color:var(--rose);background:var(--rose-glow)}
.var-delta.on-track{color:var(--amber);background:var(--amber-glow)}

/* Budget vs Actual Table */
.bva-panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:28px}
.bva-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.bva-title{font-size:16px;font-weight:700}
.bva-tabs{display:flex;gap:4px}
.bva-tab{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--text-3);transition:all 0.2s}
.bva-tab.active{background:var(--amber-glow);color:var(--amber-light)}
.bva-tab:hover:not(.active){color:var(--text)}
.bva-body{padding:0 24px 24px}
.bva-table{width:100%;margin-top:16px}
.bva-row{display:grid;grid-template-columns:1.8fr 1fr 1fr 1fr 120px;gap:8px;padding:12px 0;align-items:center;border-bottom:1px solid var(--border);font-size:13px}
.bva-row:last-child{border-bottom:none}
.bva-row.header{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-3)}
.bva-row.total{font-weight:700;border-top:2px solid var(--border);padding-top:14px}
.bva-cat{font-weight:600}
.bva-val{text-align:right;font-weight:500}
.bva-var{text-align:right;font-weight:600;font-size:12px}
.bva-var.fav{color:var(--green)}
.bva-var.unfav{color:var(--rose)}
.bva-bar-wrap{height:6px;background:var(--surface-3);border-radius:3px;overflow:hidden}
.bva-bar-fill{height:100%;border-radius:3px;transition:width 1s cubic-bezier(.23,1,.32,1)}

/* Two column */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.panel-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.panel-title{font-size:16px;font-weight:700}
.panel-badge{font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px}
.badge-amber{background:var(--amber-glow);color:var(--amber-light)}
.badge-blue{background:var(--blue-glow);color:var(--blue)}
.badge-green{background:var(--green-glow);color:var(--green)}
.badge-purple{background:var(--purple-glow);color:var(--purple)}
.panel-body{padding:20px 24px 24px}

/* Forecast Accuracy */
.forecast-score{text-align:center;padding:12px 0 20px}
.forecast-num{font-size:56px;font-weight:800;background:linear-gradient(135deg,var(--amber),var(--green));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.forecast-sublabel{color:var(--text-2);font-size:13px}
.forecast-history{display:flex;gap:8px;justify-content:center;margin-top:16px}
.forecast-q{background:var(--surface-2);border-radius:var(--radius-xs);padding:10px 14px;text-align:center;flex:1}
.forecast-q-label{font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px}
.forecast-q-val{font-size:16px;font-weight:700}

/* Scenario Comparison */
.scenario-grid{display:flex;flex-direction:column;gap:10px}
.scenario-row{display:grid;grid-template-columns:100px 1fr 80px;gap:12px;align-items:center;padding:12px;background:var(--surface-2);border-radius:var(--radius-xs);border:1px solid var(--border);transition:border-color 0.2s}
.scenario-row:hover{border-color:var(--border-hover)}
.scenario-name{font-size:13px;font-weight:600}
.scenario-bar-outer{height:8px;background:var(--surface-3);border-radius:4px;overflow:hidden;position:relative}
.scenario-bar-fill{height:100%;border-radius:4px;transition:width 1.2s cubic-bezier(.23,1,.32,1);position:absolute;top:0;left:0}
.scenario-val{font-size:14px;font-weight:700;text-align:right}

/* Drill-Down Variance */
.drill-section{margin-bottom:16px}
.drill-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--surface-2);border-radius:var(--radius-xs);cursor:pointer;transition:background 0.2s;border:1px solid var(--border)}
.drill-header:hover{background:var(--surface-3)}
.drill-header-left{display:flex;align-items:center;gap:10px}
.drill-expand{font-size:12px;color:var(--text-3);transition:transform 0.3s}
.drill-expand.open{transform:rotate(90deg)}
.drill-dept{font-size:14px;font-weight:600}
.drill-dept-var{font-size:12px;font-weight:600;padding:3px 8px;border-radius:12px}
.drill-content{max-height:0;overflow:hidden;transition:max-height 0.4s cubic-bezier(.23,1,.32,1)}
.drill-content.open{max-height:500px}
.drill-items{padding:8px 0 0 28px}
.drill-item{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;font-size:13px;border-bottom:1px solid var(--border)}
.drill-item:last-child{border-bottom:none}
.drill-item-name{color:var(--text-2)}
.drill-item-val{font-weight:600}

/* Copilot */
.copilot{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:28px}
.copilot-header{padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.copilot-dot{width:8px;height:8px;border-radius:50%;background:var(--amber);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.copilot-title{font-size:14px;font-weight:700}
.copilot-body{padding:20px 24px}
.copilot-msg{margin-bottom:16px}
.copilot-msg.user{text-align:right}
.copilot-msg.user .copilot-bubble{background:var(--amber);color:#000;display:inline-block;text-align:left}
.copilot-msg.ai .copilot-bubble{background:var(--surface-2);display:inline-block}
.copilot-bubble{padding:12px 16px;border-radius:12px;font-size:13px;max-width:85%;line-height:1.5}
.copilot-input{display:flex;gap:8px;padding:16px 24px;border-top:1px solid var(--border)}
.copilot-input input{flex:1;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color 0.2s}
.copilot-input input:focus{border-color:var(--amber)}
.copilot-input button{background:linear-gradient(135deg,var(--amber),#d97706);border:none;color:#000;font-weight:700;padding:10px 18px;border-radius:var(--radius-sm);font-size:13px;cursor:pointer;position:relative;overflow:hidden}
.copilot-input button::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);animation:shimmer 3s infinite}
@keyframes shimmer{0%{left:-100%}100%{left:100%}}

@media(max-width:960px){
  .variance-summary{grid-template-columns:repeat(2,1fr)}
  .two-col{grid-template-columns:1fr}
  .bva-row{grid-template-columns:1.4fr 1fr 1fr 1fr;font-size:12px}
  .bva-row .bva-bar-wrap{display:none}
  .dash-header{padding:20px 24px}
  .dash-container{padding:24px}
}
@media(max-width:560px){
  .variance-summary{grid-template-columns:1fr}
  .bva-row{grid-template-columns:1.2fr 1fr 1fr}
  .bva-row .bva-var,.bva-row .bva-bar-wrap{display:none}
  .forecast-history{flex-wrap:wrap}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<div class="scroll-progress" id="scrollProgress"></div>

<header class="dash-header">
  <div class="dash-logo">
    <div class="dash-logo-icon">F</div>
    <div class="dash-logo-text">FinanceOS</div>
  </div>
  <div class="dash-role"><span>FP&amp;A Manager</span> &nbsp;Analytics Dashboard</div>
</header>

<main class="dash-container">
  <h1 class="dash-title">Variance &amp; Forecast Command Center</h1>
  <p class="dash-subtitle">Drill into every variance &middot; Real-time budget tracking</p>

  <!-- Variance Summary -->
  <div class="variance-summary">
    <div class="var-card">
      <div class="var-label">Revenue Variance</div>
      <div class="var-value" style="color:var(--green)">+$1.2M</div>
      <div class="var-delta fav">&#9650; 3.8% favorable</div>
    </div>
    <div class="var-card">
      <div class="var-label">OPEX Variance</div>
      <div class="var-value" style="color:var(--rose)">-$420K</div>
      <div class="var-delta unfav">&#9660; 2.1% unfavorable</div>
    </div>
    <div class="var-card">
      <div class="var-label">EBITDA Variance</div>
      <div class="var-value" style="color:var(--green)">+$780K</div>
      <div class="var-delta fav">&#9650; 4.2% favorable</div>
    </div>
    <div class="var-card">
      <div class="var-label">Headcount Variance</div>
      <div class="var-value" style="color:var(--amber)">-4 FTE</div>
      <div class="var-delta on-track">Hiring behind plan</div>
    </div>
  </div>

  <!-- Budget vs Actual -->
  <div class="bva-panel">
    <div class="bva-header">
      <span class="bva-title">Budget vs Actual — March 2026</span>
      <div class="bva-tabs">
        <button class="bva-tab active">Monthly</button>
        <button class="bva-tab">QTD</button>
        <button class="bva-tab">YTD</button>
      </div>
    </div>
    <div class="bva-body">
      <div class="bva-table">
        <div class="bva-row header"><span>Category</span><span style="text-align:right">Budget</span><span style="text-align:right">Actual</span><span style="text-align:right">Variance</span><span>Attainment</span></div>
        <div class="bva-row"><span class="bva-cat">Subscription Revenue</span><span class="bva-val">$4.80M</span><span class="bva-val">$5.12M</span><span class="bva-var fav">+6.7%</span><span class="bva-bar-wrap"><div class="bva-bar-fill" style="width:0%;background:var(--green)" data-w="100%"></div></span></div>
        <div class="bva-row"><span class="bva-cat">Services Revenue</span><span class="bva-val">$520K</span><span class="bva-val">$480K</span><span class="bva-var unfav">-7.7%</span><span class="bva-bar-wrap"><div class="bva-bar-fill" style="width:0%;background:var(--amber)" data-w="92%"></div></span></div>
        <div class="bva-row"><span class="bva-cat">COGS</span><span class="bva-val">$820K</span><span class="bva-val">$790K</span><span class="bva-var fav">+3.7%</span><span class="bva-bar-wrap"><div class="bva-bar-fill" style="width:0%;background:var(--green)" data-w="96%"></div></span></div>
        <div class="bva-row"><span class="bva-cat">Engineering</span><span class="bva-val">$1.60M</span><span class="bva-val">$1.52M</span><span class="bva-var fav">+5.0%</span><span class="bva-bar-wrap"><div class="bva-bar-fill" style="width:0%;background:var(--green)" data-w="95%"></div></span></div>
        <div class="bva-row"><span class="bva-cat">Sales &amp; Marketing</span><span class="bva-val">$1.40M</span><span class="bva-val">$1.62M</span><span class="bva-var unfav">-15.7%</span><span class="bva-bar-wrap"><div class="bva-bar-fill" style="width:0%;background:var(--rose)" data-w="100%"></div></span></div>
        <div class="bva-row"><span class="bva-cat">G&amp;A</span><span class="bva-val">$680K</span><span class="bva-val">$710K</span><span class="bva-var unfav">-4.4%</span><span class="bva-bar-wrap"><div class="bva-bar-fill" style="width:0%;background:var(--amber)" data-w="100%"></div></span></div>
        <div class="bva-row total"><span class="bva-cat">EBITDA</span><span class="bva-val">$1.82M</span><span class="bva-val">$2.00M</span><span class="bva-var fav">+9.9%</span><span class="bva-bar-wrap"><div class="bva-bar-fill" style="width:0%;background:linear-gradient(90deg,var(--green),var(--cyan))" data-w="100%"></div></span></div>
      </div>
    </div>
  </div>

  <!-- Forecast Accuracy + Scenario Comparison -->
  <div class="two-col">
    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Forecast Accuracy</span>
        <span class="panel-badge badge-green">96.2%</span>
      </div>
      <div class="panel-body">
        <div class="forecast-score">
          <div class="forecast-num" id="forecastNum">0</div>
          <div class="forecast-sublabel">Weighted Absolute Percentage Error (WAPE)</div>
        </div>
        <div class="forecast-history">
          <div class="forecast-q"><div class="forecast-q-label">Q1 '25</div><div class="forecast-q-val" style="color:var(--amber)">91.4%</div></div>
          <div class="forecast-q"><div class="forecast-q-label">Q2 '25</div><div class="forecast-q-val" style="color:var(--amber)">93.1%</div></div>
          <div class="forecast-q"><div class="forecast-q-label">Q3 '25</div><div class="forecast-q-val" style="color:var(--green)">94.8%</div></div>
          <div class="forecast-q"><div class="forecast-q-label">Q4 '25</div><div class="forecast-q-val" style="color:var(--green)">95.6%</div></div>
          <div class="forecast-q" style="border:1px solid var(--amber);border-radius:var(--radius-xs)"><div class="forecast-q-label">Q1 '26</div><div class="forecast-q-val" style="color:var(--green)">96.2%</div></div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Scenario Comparison</span>
        <span class="panel-badge badge-purple">3 Scenarios</span>
      </div>
      <div class="panel-body">
        <div class="scenario-grid">
          <div class="scenario-row">
            <span class="scenario-name" style="color:var(--green)">Bull Case</span>
            <div class="scenario-bar-outer"><div class="scenario-bar-fill" style="width:0%;background:var(--green)" data-w="100%"></div></div>
            <span class="scenario-val">$72.8M</span>
          </div>
          <div class="scenario-row" style="border-color:var(--amber)">
            <span class="scenario-name" style="color:var(--amber)">Base Case</span>
            <div class="scenario-bar-outer"><div class="scenario-bar-fill" style="width:0%;background:var(--amber)" data-w="82%"></div></div>
            <span class="scenario-val">$62.4M</span>
          </div>
          <div class="scenario-row">
            <span class="scenario-name" style="color:var(--rose)">Bear Case</span>
            <div class="scenario-bar-outer"><div class="scenario-bar-fill" style="width:0%;background:var(--rose)" data-w="68%"></div></div>
            <span class="scenario-val">$54.1M</span>
          </div>
        </div>
        <div style="margin-top:16px;padding:12px;background:var(--surface-2);border-radius:var(--radius-xs);font-size:12px;color:var(--text-2)">
          <strong style="color:var(--text)">Key sensitivity:</strong> Enterprise pipeline conversion rate drives $8.4M swing between bull/bear. Each 10% change in win rate = ~$4.2M ARR impact.
        </div>
      </div>
    </div>
  </div>

  <!-- Variance Drill-Down -->
  <div class="panel" style="margin-bottom:28px">
    <div class="panel-header">
      <span class="panel-title">Variance Drill-Down by Department</span>
      <span class="panel-badge badge-amber">Click to expand</span>
    </div>
    <div class="panel-body">
      <div class="drill-section">
        <div class="drill-header" onclick="toggleDrill('drill-eng')">
          <div class="drill-header-left"><span class="drill-expand" id="drill-eng-arrow">&#9654;</span><span class="drill-dept">Engineering</span></div>
          <span class="drill-dept-var" style="color:var(--green);background:var(--green-glow)">+$80K favorable</span>
        </div>
        <div class="drill-content" id="drill-eng">
          <div class="drill-items">
            <div class="drill-item"><span class="drill-item-name">Salaries &amp; Benefits</span><span class="drill-item-val" style="color:var(--green)">+$120K (2 open roles)</span></div>
            <div class="drill-item"><span class="drill-item-name">Cloud Infrastructure</span><span class="drill-item-val" style="color:var(--rose)">-$28K (usage spike)</span></div>
            <div class="drill-item"><span class="drill-item-name">Software Licenses</span><span class="drill-item-val" style="color:var(--rose)">-$12K (new tools)</span></div>
          </div>
        </div>
      </div>
      <div class="drill-section">
        <div class="drill-header" onclick="toggleDrill('drill-sales')">
          <div class="drill-header-left"><span class="drill-expand" id="drill-sales-arrow">&#9654;</span><span class="drill-dept">Sales &amp; Marketing</span></div>
          <span class="drill-dept-var" style="color:var(--rose);background:var(--rose-glow)">-$220K unfavorable</span>
        </div>
        <div class="drill-content" id="drill-sales">
          <div class="drill-items">
            <div class="drill-item"><span class="drill-item-name">Digital Advertising</span><span class="drill-item-val" style="color:var(--rose)">-$140K (campaign scale-up)</span></div>
            <div class="drill-item"><span class="drill-item-name">Events &amp; Conferences</span><span class="drill-item-val" style="color:var(--rose)">-$65K (unplanned sponsorship)</span></div>
            <div class="drill-item"><span class="drill-item-name">Sales Commissions</span><span class="drill-item-val" style="color:var(--rose)">-$15K (accelerators hit)</span></div>
          </div>
        </div>
      </div>
      <div class="drill-section">
        <div class="drill-header" onclick="toggleDrill('drill-ga')">
          <div class="drill-header-left"><span class="drill-expand" id="drill-ga-arrow">&#9654;</span><span class="drill-dept">G&amp;A</span></div>
          <span class="drill-dept-var" style="color:var(--rose);background:var(--rose-glow)">-$30K unfavorable</span>
        </div>
        <div class="drill-content" id="drill-ga">
          <div class="drill-items">
            <div class="drill-item"><span class="drill-item-name">Legal Fees</span><span class="drill-item-val" style="color:var(--rose)">-$22K (contract review)</span></div>
            <div class="drill-item"><span class="drill-item-name">Office &amp; Facilities</span><span class="drill-item-val" style="color:var(--rose)">-$8K (maintenance)</span></div>
          </div>
        </div>
      </div>
      <div class="drill-section">
        <div class="drill-header" onclick="toggleDrill('drill-cogs')">
          <div class="drill-header-left"><span class="drill-expand" id="drill-cogs-arrow">&#9654;</span><span class="drill-dept">COGS</span></div>
          <span class="drill-dept-var" style="color:var(--green);background:var(--green-glow)">+$30K favorable</span>
        </div>
        <div class="drill-content" id="drill-cogs">
          <div class="drill-items">
            <div class="drill-item"><span class="drill-item-name">Hosting Costs</span><span class="drill-item-val" style="color:var(--green)">+$18K (optimization)</span></div>
            <div class="drill-item"><span class="drill-item-name">Customer Support</span><span class="drill-item-val" style="color:var(--green)">+$12K (under headcount)</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- AI Copilot -->
  <div class="copilot">
    <div class="copilot-header">
      <div class="copilot-dot"></div>
      <div class="copilot-title">AI Variance Analyst</div>
    </div>
    <div class="copilot-body">
      <div class="copilot-msg user">
        <div class="copilot-bubble">Why is S&M $220K over budget this month?</div>
      </div>
      <div class="copilot-msg ai">
        <div class="copilot-bubble">
          The S&M overspend breaks into three components: <strong>Digital advertising</strong> is $140K over due to the Q1 pipeline acceleration campaign approved by the CRO on March 3 — this has generated 42 MQLs at $3.3K/MQL vs. the $4.1K target. <strong>Events</strong> added $65K from the SaaStr sponsorship that wasn't in the original budget but was approved mid-month. <strong>Commissions</strong> are $15K over due to 3 reps hitting accelerator thresholds. Net ROI on the incremental spend projects at 3.2x within 2 quarters based on current pipeline conversion rates.
        </div>
      </div>
    </div>
    <div class="copilot-input">
      <input type="text" placeholder="Ask about variances, forecasts, or budget scenarios...">
      <button>Send</button>
    </div>
  </div>
</main>


` }} />
    </>
  );
}
