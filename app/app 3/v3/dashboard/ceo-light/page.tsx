'use client';

import { useEffect, useRef } from 'react';

export default function V3DashboardCeoLightPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `window.addEventListener('scroll',()=>{const h=document.documentElement;document.getElementById('scrollProgress').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'});

function animateCounters(){document.querySelectorAll('.counter').forEach(el=>{const to=parseFloat(el.dataset.to),dec=parseInt(el.dataset.dec)||0,dur=1200,start=performance.now();(function tick(now){let p=Math.min((now-start)/dur,1);p=1-Math.pow(1-p,3);el.textContent=(to*p).toFixed(dec);if(p<1)requestAnimationFrame(tick)})(performance.now())})}

function animateR40(){const el=document.getElementById('r40Num'),fill=document.getElementById('r40Fill'),dur=1400,start=performance.now();(function tick(now){let p=Math.min((now-start)/dur,1);p=1-Math.pow(1-p,3);el.textContent=Math.round(52*p);if(p<1)requestAnimationFrame(tick)})(performance.now());setTimeout(()=>{fill.style.width='52%'},100)}

function animateRing(){const ring=document.getElementById('fRing'),score=document.getElementById('fScore'),circ=2*Math.PI*65;ring.style.strokeDashoffset=circ*(1-0.82);const dur=1400,start=performance.now();(function tick(now){let p=Math.min((now-start)/dur,1);p=1-Math.pow(1-p,3);score.textContent=Math.round(82*p);if(p<1)requestAnimationFrame(tick)})(performance.now())}

function animateBars(){document.querySelectorAll('[data-w]').forEach(b=>{b.style.width=b.dataset.w})}

document.querySelectorAll('.kpi-card,.comp-card').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=\`perspective(800px) rotateY(\${x*5}deg) rotateX(\${-y*5}deg) translateY(-4px)\`});card.addEventListener('mouseleave',()=>{card.style.transform=''})});

const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';obs.unobserve(e.target)}})},{threshold:0.12});
document.querySelectorAll('.kpi-card,.panel,.copilot').forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(24px)';el.style.transition=\`opacity 0.6s \${i*.07}s cubic-bezier(.23,1,.32,1),transform 0.6s \${i*.07}s cubic-bezier(.23,1,.32,1)\`;obs.observe(el)});

setTimeout(()=>{animateCounters();animateR40();animateRing();animateBars()},400);`
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
  --bg:#f8f7f4;--surface:#ffffff;--surface-2:#faf9f6;--surface-3:#f0eeea;
  --border:rgba(0,0,0,0.06);--border-hover:rgba(124,58,237,0.25);
  --text:#1a1a2e;--text-2:#5a5a72;--text-3:#8a8a9e;
  --shadow-sm:0 1px 3px rgba(0,0,0,0.04),0 1px 2px rgba(0,0,0,0.03);
  --shadow-md:0 4px 20px rgba(0,0,0,0.06),0 2px 8px rgba(0,0,0,0.04);
  --shadow-lg:0 12px 40px rgba(0,0,0,0.08),0 4px 12px rgba(0,0,0,0.04);
  --blue:#2563eb;--blue-soft:#dbeafe;--blue-text:#1e40af;
  --green:#059669;--green-soft:#d1fae5;--green-text:#065f46;
  --amber:#d97706;--amber-soft:#fef3c7;--amber-text:#92400e;
  --rose:#dc2626;--rose-soft:#fee2e2;--rose-text:#991b1b;
  --purple:#7c3aed;--purple-soft:#ede9fe;--purple-text:#5b21b6;
  --cyan:#0891b2;--cyan-soft:#cffafe;--cyan-text:#155e75;
  --radius:20px;--radius-sm:14px;--radius-xs:8px;
}
body{background:var(--bg);color:var(--text);font-family:'Manrope',system-ui,sans-serif;line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
body::before{content:'';position:fixed;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse 80% 50% at 30% 0%,rgba(237,233,254,0.5),transparent),radial-gradient(ellipse 60% 40% at 70% 100%,rgba(219,234,254,0.4),transparent);pointer-events:none;z-index:0}

.scroll-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--purple),var(--blue),var(--cyan));z-index:999;width:0%;border-radius:0 2px 2px 0}

.dash-header{padding:24px 48px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);backdrop-filter:blur(24px) saturate(1.4);position:sticky;top:0;z-index:90;background:rgba(248,247,244,0.8)}
.dash-logo{display:flex;align-items:center;gap:14px}
.dash-logo-icon{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--purple),#6d28d9);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;color:#fff;box-shadow:0 4px 16px rgba(124,58,237,0.25)}
.dash-logo-text{font-size:19px;font-weight:800;color:var(--text)}
.dash-role{font-size:13px;color:var(--text-2);background:var(--surface);padding:8px 18px;border-radius:24px;border:1px solid var(--border);box-shadow:var(--shadow-sm)}
.dash-role span{color:var(--purple);font-weight:700}

.dash-container{max-width:1400px;margin:0 auto;padding:36px 48px 80px;position:relative;z-index:1}
.dash-title{font-size:30px;font-weight:800;letter-spacing:-0.02em;margin-bottom:4px}
.dash-subtitle{color:var(--text-2);font-size:14px;margin-bottom:36px}

/* KPIs */
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px}
.kpi-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:26px;position:relative;overflow:hidden;transition:transform 0.5s cubic-bezier(.23,1,.32,1),box-shadow 0.5s;cursor:default;box-shadow:var(--shadow-sm)}
.kpi-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-4px)}
.kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;border-radius:20px 20px 0 0;opacity:0;transition:opacity 0.3s}
.kpi-card:hover::before{opacity:1}
.kpi-card[data-c="purple"]::before{background:linear-gradient(90deg,var(--purple),#a78bfa)}
.kpi-card[data-c="green"]::before{background:linear-gradient(90deg,var(--green),#10b981)}
.kpi-card[data-c="blue"]::before{background:linear-gradient(90deg,var(--blue),#60a5fa)}
.kpi-card[data-c="amber"]::before{background:linear-gradient(90deg,var(--amber),#f59e0b)}
.kpi-card[data-c="cyan"]::before{background:linear-gradient(90deg,var(--cyan),#06b6d4)}
.kpi-card[data-c="rose"]::before{background:linear-gradient(90deg,var(--rose),#f43f5e)}
.kpi-label{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-3);margin-bottom:10px}
.kpi-value{font-size:34px;font-weight:800;letter-spacing:-0.02em;margin-bottom:8px;display:flex;align-items:baseline;gap:4px}
.kpi-value .u{font-size:18px;font-weight:600;color:var(--text-2)}
.kpi-delta{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px}
.kpi-delta.up{color:var(--green-text);background:var(--green-soft)}
.kpi-delta.neutral{color:var(--amber-text);background:var(--amber-soft)}
.kpi-spark{display:flex;align-items:flex-end;gap:3px;height:40px;margin-top:16px}
.kpi-spark .bar{flex:1;border-radius:4px;transition:height 0.8s cubic-bezier(.23,1,.32,1);opacity:0.35}
.kpi-spark .bar:last-child{opacity:1}

/* Panels */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm);transition:box-shadow 0.3s}
.panel:hover{box-shadow:var(--shadow-md)}
.panel-header{padding:22px 28px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.panel-title{font-size:17px;font-weight:700}
.panel-badge{font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px}
.badge-green{color:var(--green-text);background:var(--green-soft)}
.badge-purple{color:var(--purple-text);background:var(--purple-soft)}
.badge-blue{color:var(--blue-text);background:var(--blue-soft)}
.badge-amber{color:var(--amber-text);background:var(--amber-soft)}
.panel-body{padding:22px 28px 28px}

/* Rule of 40 */
.rule40-score{text-align:center;padding:16px 0}
.rule40-number{font-size:68px;font-weight:800;background:linear-gradient(135deg,var(--green),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.rule40-label{color:var(--text-2);font-size:13px}
.rule40-breakdown{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
.rule40-item{background:var(--surface-2);border-radius:var(--radius-sm);padding:16px;text-align:center;border:1px solid var(--border)}
.rule40-item-value{font-size:24px;font-weight:800}
.rule40-item-label{font-size:12px;color:var(--text-3);margin-top:2px}
.rule40-bar{height:10px;background:var(--surface-3);border-radius:5px;margin-top:20px;overflow:hidden}
.rule40-fill{height:100%;border-radius:5px;background:linear-gradient(90deg,var(--green),var(--cyan));width:0%;transition:width 1.4s cubic-bezier(.23,1,.32,1)}
.rule40-labels{display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);margin-top:6px}

/* Segments */
.seg-row{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 80px;gap:12px;padding:12px 0;align-items:center;border-bottom:1px solid var(--border);font-size:14px}
.seg-row:last-child{border-bottom:none}
.seg-row.hdr{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-3)}
.seg-name{font-weight:700}
.seg-bar{height:6px;background:var(--surface-3);border-radius:3px;overflow:hidden}
.seg-fill{height:100%;border-radius:3px;transition:width 1s cubic-bezier(.23,1,.32,1)}

/* Competitive */
.comp-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.comp-card{background:var(--surface-2);border-radius:var(--radius-sm);padding:18px;border:1px solid var(--border);transition:border-color 0.3s,box-shadow 0.3s}
.comp-card:hover{border-color:var(--border-hover);box-shadow:var(--shadow-sm)}
.comp-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.comp-metric{font-size:12px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em}
.comp-rank{font-size:11px;font-weight:700;padding:3px 8px;border-radius:12px}
.comp-rank.top{color:var(--green-text);background:var(--green-soft)}
.comp-rank.mid{color:var(--amber-text);background:var(--amber-soft)}
.comp-value{font-size:24px;font-weight:800;margin-bottom:2px}
.comp-context{font-size:12px;color:var(--text-3)}

/* Fundraising */
.fund-wrap{text-align:center;padding:12px 0}
.fund-ring{width:150px;height:150px;margin:0 auto 12px;position:relative}
.fund-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.fund-ring circle{fill:none;stroke-width:8;stroke-linecap:round}
.fund-ring .bg{stroke:var(--surface-3)}
.fund-ring .fg{stroke:url(#fGrad);stroke-dasharray:408;stroke-dashoffset:408;transition:stroke-dashoffset 1.5s cubic-bezier(.23,1,.32,1)}
.fund-num{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:38px;font-weight:800}
.fund-label{font-size:13px;color:var(--text-2)}
.fund-list{margin-top:16px;text-align:left}
.fund-item{display:flex;align-items:center;gap:10px;padding:8px 0;font-size:13px}
.fund-check{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0}
.fund-check.done{background:var(--green-soft);color:var(--green)}
.fund-check.pending{background:var(--amber-soft);color:var(--amber)}

/* Copilot */
.copilot{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm)}
.copilot-header{padding:18px 28px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;background:var(--surface-2)}
.copilot-dot{width:8px;height:8px;border-radius:50%;background:var(--purple);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.copilot-title{font-size:14px;font-weight:700}
.copilot-body{padding:22px 28px}
.copilot-msg{margin-bottom:18px}
.copilot-msg.user{text-align:right}
.copilot-msg.user .copilot-bubble{background:linear-gradient(135deg,var(--purple),#6d28d9);color:#fff;display:inline-block;text-align:left;box-shadow:0 4px 16px rgba(124,58,237,0.2)}
.copilot-msg.ai .copilot-bubble{background:var(--surface-2);display:inline-block;border:1px solid var(--border)}
.copilot-bubble{padding:14px 18px;border-radius:16px;font-size:13px;max-width:85%;line-height:1.6}
.copilot-input{display:flex;gap:10px;padding:18px 28px;border-top:1px solid var(--border);background:var(--surface-2)}
.copilot-input input{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color 0.2s,box-shadow 0.2s}
.copilot-input input:focus{border-color:var(--purple);box-shadow:0 0 0 3px rgba(124,58,237,0.1)}
.copilot-input button{background:linear-gradient(135deg,var(--purple),#6d28d9);border:none;color:#fff;padding:12px 22px;border-radius:var(--radius-sm);font-weight:700;font-size:13px;cursor:pointer;box-shadow:0 4px 12px rgba(124,58,237,0.2)}

@media(max-width:960px){.kpi-grid{grid-template-columns:repeat(2,1fr)}.two-col{grid-template-columns:1fr}.dash-header{padding:20px 24px}.dash-container{padding:24px}}
@media(max-width:560px){.kpi-grid{grid-template-columns:1fr}.comp-grid{grid-template-columns:1fr}.rule40-breakdown{grid-template-columns:1fr}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<div class="scroll-progress" id="scrollProgress"></div>

<header class="dash-header">
  <div class="dash-logo"><div class="dash-logo-icon">F</div><div class="dash-logo-text">FinanceOS</div></div>
  <div class="dash-role"><span>CEO</span>&ensp;Strategic Dashboard</div>
</header>

<main class="dash-container">
  <h1 class="dash-title">Strategic Command Center</h1>
  <p class="dash-subtitle">Bird's-eye view of company health &middot; Updated live</p>

  <div class="kpi-grid">
    <div class="kpi-card" data-c="purple"><div class="kpi-label">Annual Recurring Revenue</div><div class="kpi-value"><span class="u">$</span><span class="counter" data-to="62.4" data-dec="1">0</span><span class="u">M</span></div><div class="kpi-delta up">&#9650; 34% YoY</div><div class="kpi-spark"><div class="bar" style="height:40%;background:var(--purple)"></div><div class="bar" style="height:52%;background:var(--purple)"></div><div class="bar" style="height:48%;background:var(--purple)"></div><div class="bar" style="height:61%;background:var(--purple)"></div><div class="bar" style="height:72%;background:var(--purple)"></div><div class="bar" style="height:78%;background:var(--purple)"></div><div class="bar" style="height:85%;background:var(--purple)"></div><div class="bar" style="height:92%;background:var(--purple)"></div><div class="bar" style="height:88%;background:var(--purple)"></div><div class="bar" style="height:95%;background:var(--purple)"></div><div class="bar" style="height:98%;background:var(--purple)"></div><div class="bar" style="height:100%;background:var(--purple)"></div></div></div>
    <div class="kpi-card" data-c="green"><div class="kpi-label">Net Dollar Retention</div><div class="kpi-value"><span class="counter" data-to="124" data-dec="0">0</span><span class="u">%</span></div><div class="kpi-delta up">&#9650; 8pts vs Q3</div><div class="kpi-spark"><div class="bar" style="height:70%;background:var(--green)"></div><div class="bar" style="height:75%;background:var(--green)"></div><div class="bar" style="height:78%;background:var(--green)"></div><div class="bar" style="height:82%;background:var(--green)"></div><div class="bar" style="height:85%;background:var(--green)"></div><div class="bar" style="height:88%;background:var(--green)"></div><div class="bar" style="height:91%;background:var(--green)"></div><div class="bar" style="height:93%;background:var(--green)"></div><div class="bar" style="height:95%;background:var(--green)"></div><div class="bar" style="height:97%;background:var(--green)"></div><div class="bar" style="height:99%;background:var(--green)"></div><div class="bar" style="height:100%;background:var(--green)"></div></div></div>
    <div class="kpi-card" data-c="blue"><div class="kpi-label">Rule of 40 Score</div><div class="kpi-value"><span class="counter" data-to="52" data-dec="0">0</span></div><div class="kpi-delta up">&#9650; Above threshold</div><div class="kpi-spark"><div class="bar" style="height:55%;background:var(--blue)"></div><div class="bar" style="height:60%;background:var(--blue)"></div><div class="bar" style="height:65%;background:var(--blue)"></div><div class="bar" style="height:70%;background:var(--blue)"></div><div class="bar" style="height:75%;background:var(--blue)"></div><div class="bar" style="height:78%;background:var(--blue)"></div><div class="bar" style="height:82%;background:var(--blue)"></div><div class="bar" style="height:86%;background:var(--blue)"></div><div class="bar" style="height:90%;background:var(--blue)"></div><div class="bar" style="height:94%;background:var(--blue)"></div><div class="bar" style="height:97%;background:var(--blue)"></div><div class="bar" style="height:100%;background:var(--blue)"></div></div></div>
    <div class="kpi-card" data-c="amber"><div class="kpi-label">Gross Margin</div><div class="kpi-value"><span class="counter" data-to="84.2" data-dec="1">0</span><span class="u">%</span></div><div class="kpi-delta up">&#9650; 2.1pts QoQ</div><div class="kpi-spark"><div class="bar" style="height:78%;background:var(--amber)"></div><div class="bar" style="height:80%;background:var(--amber)"></div><div class="bar" style="height:82%;background:var(--amber)"></div><div class="bar" style="height:83%;background:var(--amber)"></div><div class="bar" style="height:84%;background:var(--amber)"></div><div class="bar" style="height:85%;background:var(--amber)"></div><div class="bar" style="height:86%;background:var(--amber)"></div><div class="bar" style="height:88%;background:var(--amber)"></div><div class="bar" style="height:90%;background:var(--amber)"></div><div class="bar" style="height:92%;background:var(--amber)"></div><div class="bar" style="height:96%;background:var(--amber)"></div><div class="bar" style="height:100%;background:var(--amber)"></div></div></div>
    <div class="kpi-card" data-c="cyan"><div class="kpi-label">CAC Payback Period</div><div class="kpi-value"><span class="counter" data-to="14" data-dec="0">0</span><span class="u">mo</span></div><div class="kpi-delta up">&#9660; 3mo improvement</div><div class="kpi-spark"><div class="bar" style="height:100%;background:var(--cyan)"></div><div class="bar" style="height:92%;background:var(--cyan)"></div><div class="bar" style="height:85%;background:var(--cyan)"></div><div class="bar" style="height:78%;background:var(--cyan)"></div><div class="bar" style="height:72%;background:var(--cyan)"></div><div class="bar" style="height:66%;background:var(--cyan)"></div><div class="bar" style="height:62%;background:var(--cyan)"></div><div class="bar" style="height:58%;background:var(--cyan)"></div><div class="bar" style="height:54%;background:var(--cyan)"></div><div class="bar" style="height:50%;background:var(--cyan)"></div><div class="bar" style="height:47%;background:var(--cyan)"></div><div class="bar" style="height:45%;background:var(--cyan)"></div></div></div>
    <div class="kpi-card" data-c="rose"><div class="kpi-label">Monthly Burn Rate</div><div class="kpi-value"><span class="u">$</span><span class="counter" data-to="1.8" data-dec="1">0</span><span class="u">M/mo</span></div><div class="kpi-delta neutral">&#9644; Stable</div><div class="kpi-spark"><div class="bar" style="height:85%;background:var(--rose)"></div><div class="bar" style="height:88%;background:var(--rose)"></div><div class="bar" style="height:84%;background:var(--rose)"></div><div class="bar" style="height:86%;background:var(--rose)"></div><div class="bar" style="height:85%;background:var(--rose)"></div><div class="bar" style="height:87%;background:var(--rose)"></div><div class="bar" style="height:84%;background:var(--rose)"></div><div class="bar" style="height:86%;background:var(--rose)"></div><div class="bar" style="height:85%;background:var(--rose)"></div><div class="bar" style="height:84%;background:var(--rose)"></div><div class="bar" style="height:86%;background:var(--rose)"></div><div class="bar" style="height:85%;background:var(--rose)"></div></div></div>
  </div>

  <div class="two-col">
    <div class="panel">
      <div class="panel-header"><span class="panel-title">Rule of 40 Breakdown</span><span class="panel-badge badge-green">Above Threshold</span></div>
      <div class="panel-body">
        <div class="rule40-score"><div class="rule40-number" id="r40Num">0</div><div class="rule40-label">Revenue Growth + Profit Margin</div></div>
        <div class="rule40-breakdown">
          <div class="rule40-item"><div class="rule40-item-value" style="color:var(--green)">34%</div><div class="rule40-item-label">Revenue Growth Rate</div></div>
          <div class="rule40-item"><div class="rule40-item-value" style="color:var(--blue)">18%</div><div class="rule40-item-label">FCF Margin</div></div>
        </div>
        <div class="rule40-bar"><div class="rule40-fill" id="r40Fill"></div></div>
        <div class="rule40-labels"><span>0</span><span style="color:var(--amber)">40 (threshold)</span><span>100</span></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header"><span class="panel-title">Segment Performance</span><span class="panel-badge badge-purple">4 Segments</span></div>
      <div class="panel-body">
        <div class="seg-row hdr"><span>Segment</span><span>ARR</span><span>Growth</span><span>Margin</span><span>Trend</span></div>
        <div class="seg-row"><span class="seg-name">Enterprise</span><span>$28.4M</span><span style="color:var(--green)">+42%</span><span>87%</span><span class="seg-bar"><div class="seg-fill" style="width:0%;background:var(--purple)" data-w="88%"></div></span></div>
        <div class="seg-row"><span class="seg-name">Mid-Market</span><span>$19.6M</span><span style="color:var(--green)">+31%</span><span>82%</span><span class="seg-bar"><div class="seg-fill" style="width:0%;background:var(--blue)" data-w="72%"></div></span></div>
        <div class="seg-row"><span class="seg-name">SMB</span><span>$10.2M</span><span style="color:var(--green)">+26%</span><span>79%</span><span class="seg-bar"><div class="seg-fill" style="width:0%;background:var(--cyan)" data-w="55%"></div></span></div>
        <div class="seg-row"><span class="seg-name">Self-Serve</span><span>$4.2M</span><span style="color:var(--amber)">+18%</span><span>91%</span><span class="seg-bar"><div class="seg-fill" style="width:0%;background:var(--amber)" data-w="35%"></div></span></div>
      </div>
    </div>
  </div>

  <div class="two-col">
    <div class="panel">
      <div class="panel-header"><span class="panel-title">Competitive Positioning</span><span class="panel-badge badge-blue">Market Intel</span></div>
      <div class="panel-body">
        <div class="comp-grid">
          <div class="comp-card"><div class="comp-header"><span class="comp-metric">Market Share</span><span class="comp-rank top">#2</span></div><div class="comp-value">8.4%</div><div class="comp-context">Up from 5.1% last year</div></div>
          <div class="comp-card"><div class="comp-header"><span class="comp-metric">Win Rate</span><span class="comp-rank top">Top quartile</span></div><div class="comp-value">68%</div><div class="comp-context">vs. 52% industry avg</div></div>
          <div class="comp-card"><div class="comp-header"><span class="comp-metric">NPS Score</span><span class="comp-rank top">Excellent</span></div><div class="comp-value">72</div><div class="comp-context">vs. 38 industry median</div></div>
          <div class="comp-card"><div class="comp-header"><span class="comp-metric">Avg Deal Size</span><span class="comp-rank mid">Growing</span></div><div class="comp-value">$86K</div><div class="comp-context">+24% vs prior year</div></div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header"><span class="panel-title">Fundraising Readiness</span><span class="panel-badge badge-purple">Series C</span></div>
      <div class="panel-body">
        <div class="fund-wrap">
          <div class="fund-ring">
            <svg viewBox="0 0 140 140"><defs><linearGradient id="fGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="var(--purple)"/><stop offset="100%" stop-color="var(--cyan)"/></linearGradient></defs><circle class="bg" cx="70" cy="70" r="65"/><circle class="fg" id="fRing" cx="70" cy="70" r="65"/></svg>
            <div class="fund-num" id="fScore">0</div>
          </div>
          <div class="fund-label">Investor Readiness Score</div>
        </div>
        <div class="fund-list">
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

  <div class="copilot">
    <div class="copilot-header"><div class="copilot-dot"></div><div class="copilot-title">AI Strategic Copilot</div></div>
    <div class="copilot-body">
      <div class="copilot-msg user"><div class="copilot-bubble">What's driving our NDR improvement this quarter?</div></div>
      <div class="copilot-msg ai"><div class="copilot-bubble">NDR increased 8pts to 124% driven by three factors: <strong>Enterprise expansion deals</strong> contributed +5pts (12 accounts upgraded tiers), <strong>mid-market upsells</strong> added +2pts (analytics add-on adoption at 34%), and <strong>reduced churn</strong> contributed +1pt (logo churn dropped from 3.2% to 2.1%). The enterprise segment alone expanded $4.2M in net-new ACV from existing accounts.</div></div>
    </div>
    <div class="copilot-input"><input type="text" placeholder="Ask about strategy, metrics, or market position..."><button>Send</button></div>
  </div>
</main>


` }} />
    </>
  );
}
