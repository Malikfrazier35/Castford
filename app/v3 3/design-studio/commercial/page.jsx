'use client';

import { useEffect, useRef } from 'react';

export default function V3DesignStudioCommercialPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const scenes = ['s1','s2','s3','s4','s5','s6','s7','s8'];
const durations = [5000, 5500, 5500, 7000, 8000, 5500, 6000, 7000]; // ms per scene
const totalDuration = durations.reduce((a,b)=>a+b,0);
let current = 0, startTime = Date.now(), paused = false, pauseTime = 0;

function showScene(i) {
  scenes.forEach((s,idx) => {
    const el = document.getElementById(s);
    if (idx === i) { el.classList.add('active'); el.innerHTML = el.innerHTML; } // reset animations
    else el.classList.remove('active');
  });
  // Scene 5 special: typing then answer
  if (i === 4) {
    const typing = document.getElementById('s5-typing');
    const answer = document.getElementById('s5-answer');
    if(typing) typing.style.display = 'block';
    if(answer) answer.style.display = 'none';
    setTimeout(() => {
      if(typing) typing.style.display = 'none';
      if(answer) answer.style.display = 'block';
    }, 2500);
  }
}

function tick() {
  if (paused) { requestAnimationFrame(tick); return; }
  const elapsed = Date.now() - startTime;
  const progress = Math.min(elapsed / totalDuration, 1);
  document.getElementById('progress').style.width = (progress * 100) + '%';

  let acc = 0;
  for (let i = 0; i < durations.length; i++) {
    acc += durations[i];
    if (elapsed < acc) {
      if (current !== i) { current = i; showScene(i); }
      break;
    }
  }
  if (elapsed >= totalDuration) { /* stay on last scene */ }
  else requestAnimationFrame(tick);
}

function restart() {
  current = 0; startTime = Date.now(); paused = false;
  document.getElementById('pauseBtn').textContent = '⏸ Pause';
  showScene(0); tick();
}

function togglePause() {
  if (paused) { startTime += Date.now() - pauseTime; paused = false; document.getElementById('pauseBtn').textContent = '⏸ Pause'; }
  else { pauseTime = Date.now(); paused = true; document.getElementById('pauseBtn').textContent = '▶ Play'; }
}

showScene(0);
requestAnimationFrame(tick);`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:#06070b;font-family:'DM Sans',sans-serif;color:#f0f2f5}
.scene{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.8s cubic-bezier(.4,0,.2,1)}
.scene.active{opacity:1;pointer-events:auto}

/* Global background effects */
.bg-grid{position:fixed;inset:0;z-index:0;
  background-image:linear-gradient(rgba(96,165,250,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.03) 1px,transparent 1px);
  background-size:48px 48px}
.bg-orb{position:fixed;border-radius:50%;z-index:0;filter:blur(80px)}
.bg-orb.o1{width:600px;height:600px;background:rgba(96,165,250,0.08);top:-200px;right:200px}
.bg-orb.o2{width:500px;height:500px;background:rgba(167,139,250,0.06);bottom:-100px;left:300px}

/* ===== SCENE 1: Pain statement ===== */
.s1-content{text-align:center;z-index:2;max-width:1100px}
.s1-tag{display:inline-flex;align-items:center;gap:8px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:24px;padding:8px 20px;font-size:14px;font-weight:700;color:#f87171;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:40px;opacity:0;animation:fadeUp .6s .3s forwards}
.s1-tag .dot{width:8px;height:8px;border-radius:50%;background:#f87171;box-shadow:0 0 12px #f87171;animation:pulse 2s infinite}
.s1-headline{font-size:72px;font-weight:800;letter-spacing:-0.04em;line-height:1.05;opacity:0;animation:fadeUp .8s .6s forwards}
.s1-headline em{font-style:normal;color:#f87171;text-decoration:line-through;text-decoration-color:rgba(248,113,113,0.4)}
.s1-sub{font-size:24px;color:#8b92a5;margin-top:28px;font-weight:400;opacity:0;animation:fadeUp .6s 1s forwards}

/* ===== SCENE 2: Spreadsheet chaos ===== */
.s2-content{z-index:2;display:flex;flex-direction:column;align-items:center;gap:48px}
.s2-stat-row{display:flex;gap:40px;opacity:0;animation:fadeUp .6s .4s forwards}
.s2-stat{text-align:center;padding:40px 56px;background:rgba(248,113,113,0.04);border:1px solid rgba(248,113,113,0.1);border-radius:20px}
.s2-stat-num{font-size:80px;font-weight:800;letter-spacing:-0.04em;
  background:linear-gradient(135deg,#f87171,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.s2-stat-label{font-size:18px;color:#8b92a5;margin-top:8px;font-weight:500}
.s2-bottom{font-size:32px;font-weight:600;color:#94a3b8;opacity:0;animation:fadeUp .6s .8s forwards}
.s2-bottom span{color:#f0f2f5;font-weight:800}

/* ===== SCENE 3: Solution reveal ===== */
.s3-content{z-index:2;text-align:center}
.s3-logo{font-size:28px;font-weight:800;letter-spacing:-0.03em;margin-bottom:20px;opacity:0;animation:fadeUp .5s .2s forwards}
.s3-logo span{color:#60a5fa}
.s3-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.15);border-radius:24px;padding:8px 20px;font-size:13px;font-weight:700;color:#60a5fa;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:40px;opacity:0;animation:fadeUp .5s .4s forwards}
.s3-badge .dot{width:8px;height:8px;border-radius:50%;background:#60a5fa;box-shadow:0 0 12px #60a5fa}
.s3-headline{font-size:68px;font-weight:800;letter-spacing:-0.04em;line-height:1.08;opacity:0;animation:fadeUp .8s .6s forwards}
.s3-headline em{font-style:normal;background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.s3-sub{font-size:22px;color:#8b92a5;margin-top:28px;max-width:700px;margin-left:auto;margin-right:auto;opacity:0;animation:fadeUp .6s 1s forwards}

/* ===== SCENE 4: Dashboard mockup ===== */
.s4-content{z-index:2;display:flex;flex-direction:column;align-items:center;gap:32px}
.s4-title{font-size:20px;font-weight:700;color:#8b92a5;letter-spacing:0.06em;text-transform:uppercase;opacity:0;animation:fadeUp .5s .2s forwards}
.s4-dash{width:1200px;background:#0d0e14;border:1px solid rgba(96,165,250,0.08);border-radius:20px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,0.6),0 0 0 1px rgba(96,165,250,0.05);opacity:0;animation:scaleUp .8s .4s forwards}
.s4-topbar{display:flex;align-items:center;gap:10px;padding:16px 28px;border-bottom:1px solid #1a1b25}
.s4-dot{width:12px;height:12px;border-radius:50%}
.s4-topbar-title{font-size:14px;color:#636d84;margin-left:16px;font-weight:600}
.s4-inner{padding:28px;display:flex;flex-direction:column;gap:20px}
.s4-metrics{display:flex;gap:16px}
.s4-metric{flex:1;background:#0a0b10;border:1px solid #1a1b25;border-radius:14px;padding:24px}
.s4-metric-label{font-size:11px;color:#636d84;text-transform:uppercase;letter-spacing:0.08em;font-weight:700}
.s4-metric-val{font-size:36px;font-weight:800;margin-top:8px;letter-spacing:-0.03em}
.s4-metric-change{font-size:13px;font-weight:700;margin-top:4px}
.green{color:#34d399}.red{color:#f87171}.blue{color:#60a5fa}
.s4-chart{display:flex;align-items:flex-end;gap:6px;height:200px;background:#0a0b10;border:1px solid #1a1b25;border-radius:14px;padding:24px 28px 20px}
.s4-chart-title{position:absolute;top:24px;left:28px;font-size:13px;font-weight:700;color:#f0f2f5}
.s4-chart-wrap{position:relative;background:#0a0b10;border:1px solid #1a1b25;border-radius:14px;padding:60px 28px 20px;height:220px;display:flex;align-items:flex-end;gap:8px}
.s4-bar-group{flex:1;display:flex;gap:4px;align-items:flex-end}
.s4-bar{flex:1;border-radius:5px 5px 0 0;min-width:16px;transform:scaleY(0);transform-origin:bottom;animation:barGrow .6s forwards}
.s4-bar.actual{background:linear-gradient(to top,#60a5fa,#818cf8)}
.s4-bar.budget{background:rgba(96,165,250,0.12)}

/* ===== SCENE 5: AI Copilot ===== */
.s5-content{z-index:2;display:flex;align-items:center;gap:80px;padding:0 120px}
.s5-left{flex:1}
.s5-tag{font-size:13px;font-weight:700;color:#a78bfa;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;opacity:0;animation:fadeUp .5s .2s forwards}
.s5-headline{font-size:52px;font-weight:800;letter-spacing:-0.035em;line-height:1.1;opacity:0;animation:fadeUp .7s .4s forwards}
.s5-headline em{font-style:normal;background:linear-gradient(135deg,#a78bfa,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.s5-right{flex:1;opacity:0;animation:fadeUp .8s .6s forwards}
.s5-chat{background:#0d0e14;border:1px solid rgba(167,139,250,0.1);border-radius:20px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.5)}
.s5-chat-header{padding:20px 28px;border-bottom:1px solid #1a1b25;display:flex;align-items:center;gap:12px}
.s5-chat-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#60a5fa,#a78bfa);display:flex;align-items:center;justify-content:center;font-size:18px}
.s5-chat-title{font-size:15px;font-weight:700}
.s5-chat-body{padding:28px}
.s5-msg{margin-bottom:20px;max-width:85%}
.s5-msg.user{margin-left:auto;text-align:right}
.s5-msg-bubble{display:inline-block;padding:14px 20px;border-radius:14px;font-size:15px;line-height:1.5}
.s5-msg.user .s5-msg-bubble{background:rgba(96,165,250,0.1);color:#60a5fa;font-weight:600}
.s5-msg.ai .s5-msg-bubble{background:#0a0b10;border:1px solid #1a1b25;color:#c8cdd8;font-weight:400}
.s5-msg.ai .highlight{color:#34d399;font-weight:700}
.s5-msg-typing{display:inline-flex;gap:4px;padding:14px 20px;background:#0a0b10;border:1px solid #1a1b25;border-radius:14px}
.s5-msg-typing span{width:8px;height:8px;border-radius:50%;background:#636d84;animation:typing 1.4s infinite}
.s5-msg-typing span:nth-child(2){animation-delay:.2s}
.s5-msg-typing span:nth-child(3){animation-delay:.4s}

/* ===== SCENE 6: Features ===== */
.s6-content{z-index:2;display:flex;flex-direction:column;align-items:center;gap:48px}
.s6-title{font-size:20px;font-weight:700;color:#60a5fa;letter-spacing:0.08em;text-transform:uppercase;opacity:0;animation:fadeUp .5s .2s forwards}
.s6-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;opacity:0;animation:fadeUp .7s .4s forwards}
.s6-card{background:#0d0e14;border:1px solid #1a1b25;border-radius:16px;padding:36px 32px;width:340px;transition:border-color .3s}
.s6-card-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px}
.s6-card h3{font-size:20px;font-weight:800;margin-bottom:8px;letter-spacing:-0.02em}
.s6-card p{font-size:14px;color:#8b92a5;line-height:1.5}

/* ===== SCENE 7: Pricing ===== */
.s7-content{z-index:2;text-align:center;display:flex;flex-direction:column;align-items:center;gap:40px}
.s7-headline{font-size:56px;font-weight:800;letter-spacing:-0.04em;opacity:0;animation:fadeUp .7s .3s forwards}
.s7-headline em{font-style:normal;background:linear-gradient(135deg,#34d399,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.s7-comparison{display:flex;align-items:center;gap:60px;opacity:0;animation:fadeUp .7s .6s forwards}
.s7-vs{font-size:24px;font-weight:800;color:#636d84}
.s7-box{padding:40px 56px;border-radius:20px;text-align:center}
.s7-box.old{background:rgba(248,113,113,0.04);border:1px solid rgba(248,113,113,0.1)}
.s7-box.new{background:rgba(96,165,250,0.04);border:1px solid rgba(96,165,250,0.15);box-shadow:0 0 40px rgba(96,165,250,0.08)}
.s7-box-label{font-size:14px;color:#8b92a5;font-weight:600;margin-bottom:12px}
.s7-box-price{font-size:48px;font-weight:800;letter-spacing:-0.03em}
.s7-box.old .s7-box-price{color:#f87171;text-decoration:line-through;text-decoration-color:rgba(248,113,113,0.3)}
.s7-box.new .s7-box-price{color:#60a5fa}
.s7-box-sub{font-size:14px;color:#636d84;margin-top:4px}

/* ===== SCENE 8: CTA ===== */
.s8-content{z-index:2;text-align:center;display:flex;flex-direction:column;align-items:center;gap:36px}
.s8-logo{font-size:36px;font-weight:800;letter-spacing:-0.03em;opacity:0;animation:fadeUp .5s .2s forwards}
.s8-logo span{color:#60a5fa}
.s8-headline{font-size:60px;font-weight:800;letter-spacing:-0.04em;line-height:1.1;opacity:0;animation:fadeUp .7s .4s forwards}
.s8-headline em{font-style:normal;background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.s8-cta{display:inline-flex;align-items:center;gap:12px;background:linear-gradient(135deg,#60a5fa,#a78bfa);color:#fff;padding:20px 48px;border-radius:14px;font-size:20px;font-weight:800;box-shadow:0 12px 40px rgba(96,165,250,0.35);opacity:0;animation:fadeUp .6s .7s forwards}
.s8-url{font-size:18px;color:#636d84;font-weight:600;opacity:0;animation:fadeUp .5s .9s forwards}
.s8-guarantee{font-size:15px;color:#8b92a5;opacity:0;animation:fadeUp .5s 1s forwards}

/* Progress bar */
.progress{position:fixed;bottom:0;left:0;height:3px;background:linear-gradient(90deg,#60a5fa,#a78bfa);z-index:100;transition:width .1s linear}

/* Controls */
.controls{position:fixed;bottom:20px;right:24px;z-index:100;display:flex;gap:10px;opacity:.5;transition:opacity .3s}
.controls:hover{opacity:1}
.controls button{padding:6px 16px;border-radius:8px;border:1px solid #1e2230;background:#0d0e14;color:#8b92a5;font:13px 'DM Sans',sans-serif;font-weight:600;cursor:pointer}
.controls button:hover{border-color:#60a5fa;color:#60a5fa}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleUp{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes typing{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}
@keyframes barGrow{to{transform:scaleY(1)}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<div class="bg-grid"></div>
<div class="bg-orb o1"></div>
<div class="bg-orb o2"></div>

<!-- SCENE 1: Pain Statement -->
<div class="scene active" id="s1">
  <div class="s1-content">
    <div class="s1-tag"><span class="dot"></span> The Problem</div>
    <h1 class="s1-headline">Your FP&A team is<br><em>trapped in spreadsheets</em></h1>
    <p class="s1-sub">And enterprise tools cost $100K+ with 6-month implementations.</p>
  </div>
</div>

<!-- SCENE 2: Stats -->
<div class="scene" id="s2">
  <div class="s2-content">
    <div class="s2-stat-row">
      <div class="s2-stat">
        <div class="s2-stat-num">75%</div>
        <div class="s2-stat-label">of FP&A time spent<br>gathering data</div>
      </div>
      <div class="s2-stat">
        <div class="s2-stat-num">60%</div>
        <div class="s2-stat-label">of spreadsheets contain<br>formula errors</div>
      </div>
      <div class="s2-stat">
        <div class="s2-stat-num">6 mo</div>
        <div class="s2-stat-label">average enterprise<br>implementation time</div>
      </div>
    </div>
    <div class="s2-bottom"><span>There has to be a better way.</span></div>
  </div>
</div>

<!-- SCENE 3: Solution Reveal -->
<div class="scene" id="s3">
  <div class="s3-content">
    <div class="s3-logo">Finance<span>OS</span></div>
    <div class="s3-badge"><span class="dot"></span> Introducing</div>
    <h1 class="s3-headline">AI-powered FP&A<br>for <em>modern finance teams</em></h1>
    <p class="s3-sub">Connect your GL. Automate budget vs. actual. Get AI-powered answers from your real financial data.</p>
  </div>
</div>

<!-- SCENE 4: Dashboard -->
<div class="scene" id="s4">
  <div class="s4-content">
    <div class="s4-title">Real-Time CFO Dashboard</div>
    <div class="s4-dash">
      <div class="s4-topbar">
        <div class="s4-dot" style="background:#ef4444"></div>
        <div class="s4-dot" style="background:#eab308"></div>
        <div class="s4-dot" style="background:#22c55e"></div>
        <span class="s4-topbar-title">FinanceOS — CFO Dashboard — Q1 2026</span>
      </div>
      <div class="s4-inner">
        <div class="s4-metrics">
          <div class="s4-metric"><div class="s4-metric-label">Revenue</div><div class="s4-metric-val">$2.4M</div><div class="s4-metric-change green">↑ 12.4% vs plan</div></div>
          <div class="s4-metric"><div class="s4-metric-label">EBITDA</div><div class="s4-metric-val">$680K</div><div class="s4-metric-change red">↓ 3.1% vs plan</div></div>
          <div class="s4-metric"><div class="s4-metric-label">Burn Rate</div><div class="s4-metric-val">$142K/mo</div><div class="s4-metric-change green">↑ On track</div></div>
          <div class="s4-metric"><div class="s4-metric-label">Cash Runway</div><div class="s4-metric-val">18 mo</div><div class="s4-metric-change blue">→ Stable</div></div>
        </div>
        <div class="s4-chart-wrap">
          <div class="s4-chart-title">Monthly Revenue vs Budget</div>
          <div class="s4-bar-group"><div class="s4-bar actual" style="height:70px;animation-delay:.5s"></div><div class="s4-bar budget" style="height:65px;animation-delay:.55s"></div></div>
          <div class="s4-bar-group"><div class="s4-bar actual" style="height:82px;animation-delay:.6s"></div><div class="s4-bar budget" style="height:76px;animation-delay:.65s"></div></div>
          <div class="s4-bar-group"><div class="s4-bar actual" style="height:76px;animation-delay:.7s"></div><div class="s4-bar budget" style="height:84px;animation-delay:.75s"></div></div>
          <div class="s4-bar-group"><div class="s4-bar actual" style="height:96px;animation-delay:.8s"></div><div class="s4-bar budget" style="height:88px;animation-delay:.85s"></div></div>
          <div class="s4-bar-group"><div class="s4-bar actual" style="height:90px;animation-delay:.9s"></div><div class="s4-bar budget" style="height:86px;animation-delay:.95s"></div></div>
          <div class="s4-bar-group"><div class="s4-bar actual" style="height:108px;animation-delay:1s"></div><div class="s4-bar budget" style="height:96px;animation-delay:1.05s"></div></div>
          <div class="s4-bar-group"><div class="s4-bar actual" style="height:116px;animation-delay:1.1s"></div><div class="s4-bar budget" style="height:100px;animation-delay:1.15s"></div></div>
          <div class="s4-bar-group"><div class="s4-bar actual" style="height:124px;animation-delay:1.2s"></div><div class="s4-bar budget" style="height:106px;animation-delay:1.25s"></div></div>
          <div class="s4-bar-group"><div class="s4-bar actual" style="height:130px;animation-delay:1.3s"></div><div class="s4-bar budget" style="height:110px;animation-delay:1.35s"></div></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SCENE 5: AI Copilot -->
<div class="scene" id="s5">
  <div class="s5-content">
    <div class="s5-left">
      <div class="s5-tag">AI Financial Assistant</div>
      <h2 class="s5-headline">Ask a question.<br>Get an <em>answer<br>in seconds.</em></h2>
    </div>
    <div class="s5-right">
      <div class="s5-chat">
        <div class="s5-chat-header">
          <div class="s5-chat-icon" style="font-size:14px;font-weight:800">AI</div>
          <div class="s5-chat-title">AI Copilot</div>
        </div>
        <div class="s5-chat-body">
          <div class="s5-msg user"><div class="s5-msg-bubble">Why is EBITDA below plan?</div></div>
          <div class="s5-msg ai" id="s5-answer" style="display:none"><div class="s5-msg-bubble">Marketing spend exceeded budget by <span class="highlight">23%</span> ($184K over plan) driven by an unplanned agency engagement in March. This reduced operating margin by <span class="highlight">2.1 percentage points</span>. Recommend reviewing agency contract renewal in Q2 planning.</div></div>
          <div class="s5-msg ai" id="s5-typing"><div class="s5-msg-typing"><span></span><span></span><span></span></div></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SCENE 6: Features -->
<div class="scene" id="s6">
  <div class="s6-content">
    <div class="s6-title">Everything your finance team needs</div>
    <div class="s6-grid">
      <div class="s6-card"><div class="s6-card-icon" style="background:rgba(96,165,250,0.1);color:#60a5fa;font-size:18px;font-weight:800">BvA</div><h3>Budget vs Actual</h3><p>Automated variance analysis with real-time GL data. No more manual reconciliation.</p></div>
      <div class="s6-card"><div class="s6-card-icon" style="background:rgba(167,139,250,0.1);color:#a78bfa;font-size:18px;font-weight:800">AI</div><h3>AI Copilot</h3><p>Ask questions in plain English. Get traced, explainable answers from your financials.</p></div>
      <div class="s6-card"><div class="s6-card-icon" style="background:rgba(52,211,153,0.1);color:#34d399;font-size:18px;font-weight:800">S</div><h3>Scenario Modeling</h3><p>Run what-if scenarios in seconds. Model revenue, headcount, and spend changes.</p></div>
      <div class="s6-card"><div class="s6-card-icon" style="background:rgba(251,191,36,0.1);color:#fbbf24;font-size:18px;font-weight:800">BR</div><h3>Board Reporting</h3><p>One-click board packages. Polished, accurate, ready for your next meeting.</p></div>
      <div class="s6-card"><div class="s6-card-icon" style="background:rgba(96,165,250,0.1);color:#60a5fa;font-size:18px;font-weight:800">ME</div><h3>Multi-Entity</h3><p>Consolidate financials across subsidiaries, departments, and business units.</p></div>
      <div class="s6-card"><div class="s6-card-icon" style="background:rgba(167,139,250,0.1);color:#a78bfa;font-size:18px;font-weight:800">48h</div><h3>48-Hour Setup</h3><p>Connect your GL and go live in days, not months. No consultants required.</p></div>
    </div>
  </div>
</div>

<!-- SCENE 7: Pricing -->
<div class="scene" id="s7">
  <div class="s7-content">
    <h2 class="s7-headline">Enterprise capability.<br><em>Accessible pricing.</em></h2>
    <div class="s7-comparison">
      <div class="s7-box old">
        <div class="s7-box-label">Enterprise FP&A Tools</div>
        <div class="s7-box-price">$100K+</div>
        <div class="s7-box-sub">per year + implementation</div>
      </div>
      <div class="s7-vs">vs</div>
      <div class="s7-box new">
        <div class="s7-box-label">FinanceOS</div>
        <div class="s7-box-price">$499</div>
        <div class="s7-box-sub">per year · live in 48 hours</div>
      </div>
    </div>
  </div>
</div>

<!-- SCENE 8: CTA -->
<div class="scene" id="s8">
  <div class="s8-content">
    <div class="s8-logo">Finance<span>OS</span></div>
    <h2 class="s8-headline">Your finance team<br>deserves <em>better.</em></h2>
    <div class="s8-cta">Request a Demo →</div>
    <div class="s8-url">finance-os.app</div>
    <div class="s8-guarantee">30-day money-back guarantee · No credit card required</div>
  </div>
</div>

<div class="progress" id="progress"></div>
<div class="controls">
  <button onclick="restart()">↻ Restart</button>
  <button onclick="togglePause()" id="pauseBtn">⏸ Pause</button>
</div>


` }} />
    </>
  );
}
