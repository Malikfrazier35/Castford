'use client';

import { useEffect, useRef } from 'react';

export default function V3DashboardCfoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Scroll progress + nav
window.addEventListener('scroll',()=>{const s=document.documentElement.scrollTop,h=document.documentElement.scrollHeight-innerHeight;document.getElementById('sp').style.width=(s/h*100)+'%';document.getElementById('nav').classList.toggle('scrolled',s>60)},{passive:true});

// Fade-in observer
const obs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.style.animationPlayState='running';obs.unobserve(x.target)}})},{threshold:.08});
document.querySelectorAll('.fu,.fs').forEach(el=>{el.style.animationPlayState='paused';obs.observe(el)});

// 3D tilt on KPIs
document.querySelectorAll('.kpi').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=\`perspective(800px) rotateY(\${x*6}deg) rotateX(\${-y*6}deg) translateY(-4px)\`});c.addEventListener('mouseleave',()=>{c.style.transform=''})});

// Counter animation
const cObs=new IntersectionObserver(e=>{e.forEach(x=>{if(!x.isIntersecting)return;const el=x.target,t=parseFloat(el.dataset.target),pre=el.dataset.prefix||'',suf=el.dataset.suffix||'',dur=900,start=performance.now();(function tick(now){const p=Math.min((now-start)/dur,1),ease=1-Math.pow(1-p,3),v=t*ease;el.textContent=pre+v.toFixed(1)+suf;if(p<1)requestAnimationFrame(tick)})(start);cObs.unobserve(el)})},{threshold:.3});
document.querySelectorAll('.kpi-value[data-target],.cash-amount[data-target]').forEach(el=>cObs.observe(el));

// P&L expand/collapse
function toggle(id){const el=document.getElementById(id),btn=document.querySelector(\`[data-expand="\${id}"] .pl-expand\`);el.classList.toggle('open');btn.classList.toggle('open');btn.textContent=el.classList.contains('open')?'▾':'▸'}

// Magnetic buttons
document.querySelectorAll('.nav-btn,.deck-btn,.dash-action.primary').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect(),dx=(e.clientX-(r.left+r.width/2))*.08,dy=(e.clientY-(r.top+r.height/2))*.08;b.style.transform=\`translate(\${dx}px,\${dy}px) translateY(-2px)\`});b.addEventListener('mouseleave',()=>{b.style.transform=''})});

// P&L bar animation
const bObs=new IntersectionObserver(e=>{e.forEach(x=>{if(!x.isIntersecting)return;x.target.querySelectorAll('.pl-bar').forEach((b,i)=>{const w=b.style.width;b.style.width='0%';setTimeout(()=>{b.style.width=w},i*80)});bObs.unobserve(x.target)})},{threshold:.2});
document.querySelectorAll('.pl-table').forEach(el=>bObs.observe(el));`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
:root{--bg:#f8f9fb;--card:#ffffff;--elevated:#f1f3f7;--border:#e5e7ec;--border-s:#eef0f4;--text:#0f1729;--sec:#4b5563;--muted:#9ca3af;--faint:#c2cad6;--blue:#3b82f6;--purple:#8b5cf6;--green:#10b981;--amber:#f59e0b;--rose:#f43f5e;--cyan:#06b6d4;--grad:linear-gradient(135deg,#3b82f6,#8b5cf6);--sans:'Manrope',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;--r:12px;--r-lg:16px;--r-xl:20px;--sh:0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.03);--sh-lg:0 4px 24px rgba(0,0,0,0.06),0 12px 48px rgba(0,0,0,0.04)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased;line-height:1.6}
::selection{background:rgba(59,130,246,0.15)}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeScale{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes countIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{left:-100%}100%{left:200%}}
@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
@keyframes breathe{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(.9);opacity:.5}}
.fu{animation:fadeUp .7s cubic-bezier(.22,1,.36,1) both}
.fs{animation:fadeScale .7s cubic-bezier(.22,1,.36,1) both}
.d1{animation-delay:.08s}.d2{animation-delay:.16s}.d3{animation-delay:.24s}.d4{animation-delay:.32s}.d5{animation-delay:.4s}.d6{animation-delay:.48s}

/* Scroll progress */
.scroll-bar{position:fixed;top:0;left:0;height:2px;background:var(--grad);z-index:200;width:0%;transition:width .1s}

/* Nav */
.nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.88);backdrop-filter:blur(20px) saturate(1.2);border-bottom:1px solid var(--border);transition:all .3s}
.nav.scrolled{background:rgba(255,255,255,.95);box-shadow:0 1px 8px rgba(0,0,0,.04)}
.nav-in{display:flex;align-items:center;justify-content:space-between;height:56px;max-width:1200px;margin:0 auto;padding:0 32px}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text)}
.nav-mark{width:28px;height:28px;background:var(--grad);border-radius:7px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(59,130,246,.2)}
.nav-mark svg{width:16px;height:16px}
.nav-name{font-size:14px;font-weight:800;letter-spacing:-.02em}
.nav-name span{color:var(--blue)}
.nav-badge{font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--blue);background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.1);padding:3px 10px;border-radius:100px}
.nav-right{display:flex;align-items:center;gap:16px}
.nav-btn{padding:8px 18px;border-radius:8px;background:var(--grad);color:#fff;font-weight:700;font-size:11px;border:none;cursor:pointer;font-family:var(--sans);box-shadow:0 2px 8px rgba(59,130,246,.2);transition:all .25s}
.nav-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(59,130,246,.25)}

/* Layout */
.container{max-width:1200px;margin:0 auto;padding:0 32px}

/* Dashboard Header */
.dash-header{padding:32px 0 24px;display:flex;align-items:flex-end;justify-content:space-between}
.dash-greeting{font-size:12px;color:var(--muted);font-weight:600;margin-bottom:4px}
.dash-title{font-size:28px;font-weight:800;letter-spacing:-.03em}
.dash-title em{font-style:normal;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.dash-date{font-size:11px;color:var(--muted);font-family:var(--mono);font-weight:500}
.dash-actions{display:flex;gap:8px}
.dash-action{padding:8px 16px;border-radius:8px;border:1px solid var(--border);background:var(--card);font-size:11px;font-weight:700;color:var(--sec);cursor:pointer;font-family:var(--sans);transition:all .25s;display:flex;align-items:center;gap:6px}
.dash-action:hover{border-color:var(--blue);color:var(--blue);transform:translateY(-1px)}
.dash-action.primary{background:var(--grad);color:#fff;border-color:transparent;box-shadow:0 2px 8px rgba(59,130,246,.2);position:relative;overflow:hidden}
.dash-action.primary::after{content:'';position:absolute;top:0;left:-100%;width:200%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);animation:shimmer 3s ease-in-out infinite}

/* KPI Grid */
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;position:relative;overflow:hidden;transition:all .4s cubic-bezier(.22,1,.36,1);transform-style:preserve-3d;will-change:transform;cursor:default}
.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--kpi-color);opacity:0;transition:opacity .4s}
.kpi:hover::before{opacity:1}
.kpi:hover{box-shadow:var(--sh-lg);transform:translateY(-4px)}
.kpi-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between}
.kpi-icon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;background:var(--kpi-bg)}
.kpi-value{font-size:32px;font-weight:900;font-family:var(--mono);letter-spacing:-.04em;color:var(--text);line-height:1;margin-bottom:6px}
.kpi-delta{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px}
.kpi-delta.up{background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.12);color:var(--green)}
.kpi-delta.down{background:rgba(244,63,94,.06);border:1px solid rgba(244,63,94,.12);color:var(--rose)}
.kpi-spark{display:flex;align-items:flex-end;gap:2px;height:24px;margin-top:12px}
.kpi-spark-bar{flex:1;border-radius:2px;background:var(--kpi-color);opacity:.15;transition:opacity .25s}
.kpi:hover .kpi-spark-bar{opacity:.3}
.kpi-spark-bar:last-child{opacity:.5}
.kpi:hover .kpi-spark-bar:last-child{opacity:.8}

/* Sections */
.section{margin-bottom:24px}
.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.section-title{font-size:14px;font-weight:800;letter-spacing:-.01em;display:flex;align-items:center;gap:8px}
.section-title .dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:breathe 2s ease-in-out infinite}
.section-badge{font-size:9px;font-weight:700;padding:3px 10px;border-radius:100px;background:var(--elevated);border:1px solid var(--border-s);color:var(--muted)}

/* P&L Table */
.pl-table{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--sh)}
.pl-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr .6fr;align-items:center;padding:14px 20px;border-bottom:1px solid var(--border-s);font-size:12.5px;transition:background .2s}
.pl-row:last-child{border-bottom:none}
.pl-row:hover{background:rgba(59,130,246,.015)}
.pl-row.header{background:var(--elevated);font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);padding:10px 20px}
.pl-row.subtotal{font-weight:800;background:rgba(59,130,246,.02)}
.pl-row.subtotal .pl-name{color:var(--blue)}
.pl-row.total{font-weight:900;background:linear-gradient(135deg,rgba(59,130,246,.03),rgba(139,92,246,.02))}
.pl-row.total .pl-name{background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:14px}
.pl-row.total .pl-val{font-size:14px;font-weight:900}
.pl-name{font-weight:600;color:var(--text);display:flex;align-items:center;gap:8px}
.pl-expand{width:20px;height:20px;border-radius:5px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;background:var(--card);transition:all .25s;flex-shrink:0}
.pl-expand:hover{border-color:var(--blue);color:var(--blue)}
.pl-expand.open{transform:rotate(90deg);border-color:var(--blue);color:var(--blue);background:rgba(59,130,246,.04)}
.pl-val{font-family:var(--mono);font-weight:600;font-size:12.5px;color:var(--sec)}
.pl-var{font-family:var(--mono);font-weight:700;font-size:12px;display:flex;align-items:center;gap:6px}
.pl-var.positive{color:var(--green)}
.pl-var.negative{color:var(--rose)}
.pl-bar-wrap{height:4px;border-radius:2px;background:var(--elevated);overflow:hidden}
.pl-bar{height:100%;border-radius:2px;transition:width .6s cubic-bezier(.22,1,.36,1)}
.pl-bar.positive{background:var(--green)}
.pl-bar.negative{background:var(--rose)}
.pl-children{overflow:hidden;max-height:0;transition:max-height .4s cubic-bezier(.22,1,.36,1)}
.pl-children.open{max-height:500px}
.pl-child{padding-left:48px;font-size:11.5px;color:var(--sec)}

/* Bottom Grid */
.bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px}

/* Cash Position */
.cash-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;box-shadow:var(--sh)}
.cash-amount{font-size:36px;font-weight:900;font-family:var(--mono);letter-spacing:-.04em;margin:8px 0}
.cash-runway{font-size:11px;color:var(--muted);font-weight:600;display:flex;align-items:center;gap:6px;margin-bottom:16px}
.cash-runway .metric{color:var(--green);font-weight:800;font-family:var(--mono)}
.cash-bars{display:flex;align-items:flex-end;gap:4px;height:64px;padding-top:8px}
.cash-bar{flex:1;border-radius:4px 4px 2px 2px;transition:all .3s;cursor:default;position:relative}
.cash-bar:hover{opacity:.9;transform:scaleY(1.05);transform-origin:bottom}
.cash-bar-label{position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:8px;color:var(--muted);font-weight:600;white-space:nowrap}

/* Board Deck */
.deck-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;box-shadow:var(--sh);display:flex;flex-direction:column;justify-content:space-between}
.deck-title{font-size:15px;font-weight:800;letter-spacing:-.01em;margin-bottom:4px}
.deck-sub{font-size:11px;color:var(--muted);margin-bottom:16px}
.deck-formats{display:flex;gap:6px;margin-bottom:20px}
.deck-format{font-size:9px;font-weight:700;padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--elevated);color:var(--sec);font-family:var(--mono)}
.deck-btn{padding:12px 24px;border-radius:10px;background:var(--grad);color:#fff;font-weight:700;font-size:12px;border:none;cursor:pointer;font-family:var(--sans);box-shadow:0 4px 16px rgba(59,130,246,.2);position:relative;overflow:hidden;transition:all .3s;width:100%;text-align:center}
.deck-btn::after{content:'';position:absolute;top:0;left:-100%;width:200%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);animation:shimmer 3s ease-in-out infinite}
.deck-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(59,130,246,.25)}
.deck-last{font-size:10px;color:var(--muted);margin-top:10px;text-align:center;font-weight:500}

/* AI Copilot */
.ai-section{background:var(--card);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--sh);margin-top:24px;margin-bottom:40px}
.ai-header{padding:16px 20px;border-bottom:1px solid var(--border-s);display:flex;align-items:center;gap:8px;background:var(--elevated)}
.ai-header-dot{width:8px;height:8px;border-radius:50%;background:var(--green);animation:breathe 2s ease-in-out infinite}
.ai-header-title{font-size:12px;font-weight:800}
.ai-body{padding:20px;display:flex;flex-direction:column;gap:16px;max-height:320px;overflow-y:auto}
.ai-msg{max-width:85%;padding:12px 16px;border-radius:var(--r);font-size:12.5px;line-height:1.7}
.ai-msg.user{align-self:flex-end;background:var(--grad);color:#fff;border-bottom-right-radius:4px;font-weight:600}
.ai-msg.ai{align-self:flex-start;background:var(--elevated);border:1px solid var(--border-s);border-bottom-left-radius:4px;color:var(--sec)}
.ai-msg.ai strong{color:var(--text);font-weight:700}
.ai-msg.ai .ai-reason{font-size:10px;color:var(--muted);margin-top:8px;padding-top:8px;border-top:1px solid var(--border-s);font-style:italic}
.ai-input{padding:12px 20px;border-top:1px solid var(--border-s);display:flex;gap:8px;background:var(--elevated)}
.ai-input input{flex:1;padding:10px 16px;border-radius:8px;border:1px solid var(--border);background:var(--card);font-size:12px;font-family:var(--sans);outline:none;transition:border-color .25s}
.ai-input input:focus{border-color:var(--blue)}
.ai-input button{padding:10px 16px;border-radius:8px;background:var(--grad);color:#fff;font-weight:700;font-size:11px;border:none;cursor:pointer;font-family:var(--sans)}

/* Footer */
.footer{padding:24px 0;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:20px}

/* Responsive */
@media(max-width:768px){.kpi-grid{grid-template-columns:repeat(2,1fr)}.bottom-grid{grid-template-columns:1fr}.pl-row{grid-template-columns:1.5fr 1fr 1fr .8fr;font-size:11px}.pl-row .pl-bar-wrap{display:none}}
@media(max-width:480px){.kpi-grid{grid-template-columns:1fr}.dash-header{flex-direction:column;align-items:flex-start;gap:16px}.dash-actions{width:100%}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<div class="scroll-bar" id="sp"></div>

<nav class="nav" id="nav">
  <div class="nav-in">
    <a href="https://finance-os.app" class="nav-logo">
      <div class="nav-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
      <span class="nav-name">Finance<span>OS</span></span>
    </a>
    <div class="nav-right">
      <span class="nav-badge">CFO Dashboard</span>
      <button class="nav-btn">Book Demo</button>
    </div>
  </div>
</nav>

<div class="container">

<!-- Header -->
<div class="dash-header fu">
  <div>
    <div class="dash-greeting">Good morning, Sarah</div>
    <div class="dash-title"><em>CFO Command Center</em></div>
  </div>
  <div style="text-align:right">
    <div class="dash-date">March 25, 2026 · Q1 FY2026</div>
    <div class="dash-actions" style="margin-top:8px">
      <button class="dash-action">⬇ Export</button>
      <button class="dash-action primary">📊 Generate Board Deck</button>
    </div>
  </div>
</div>

<!-- KPI Grid -->
<div class="kpi-grid">
  <div class="kpi fu d1" style="--kpi-color:var(--blue);--kpi-bg:rgba(59,130,246,.06)">
    <div class="kpi-label">Revenue <div class="kpi-icon" style="color:var(--blue)">$</div></div>
    <div class="kpi-value" data-target="48.6" data-prefix="$" data-suffix="M">$0M</div>
    <span class="kpi-delta up">↑ +24% YoY</span>
    <div class="kpi-spark"><div class="kpi-spark-bar" style="height:40%;background:var(--blue)"></div><div class="kpi-spark-bar" style="height:55%"></div><div class="kpi-spark-bar" style="height:50%"></div><div class="kpi-spark-bar" style="height:65%"></div><div class="kpi-spark-bar" style="height:60%"></div><div class="kpi-spark-bar" style="height:75%"></div><div class="kpi-spark-bar" style="height:90%"></div><div class="kpi-spark-bar" style="height:100%;background:var(--blue)"></div></div>
  </div>
  <div class="kpi fu d2" style="--kpi-color:var(--green);--kpi-bg:rgba(16,185,129,.06)">
    <div class="kpi-label">Gross Margin <div class="kpi-icon" style="color:var(--green)">%</div></div>
    <div class="kpi-value" data-target="84.7" data-suffix="%">0%</div>
    <span class="kpi-delta up">↑ +2.1pp QoQ</span>
    <div class="kpi-spark"><div class="kpi-spark-bar" style="height:70%;background:var(--green)"></div><div class="kpi-spark-bar" style="height:75%"></div><div class="kpi-spark-bar" style="height:72%"></div><div class="kpi-spark-bar" style="height:80%"></div><div class="kpi-spark-bar" style="height:78%"></div><div class="kpi-spark-bar" style="height:85%"></div><div class="kpi-spark-bar" style="height:88%"></div><div class="kpi-spark-bar" style="height:100%;background:var(--green)"></div></div>
  </div>
  <div class="kpi fu d3" style="--kpi-color:var(--purple);--kpi-bg:rgba(139,92,246,.06)">
    <div class="kpi-label">Operating Cash Flow <div class="kpi-icon" style="color:var(--purple)">◆</div></div>
    <div class="kpi-value" data-target="12.3" data-prefix="$" data-suffix="M">$0M</div>
    <span class="kpi-delta up">↑ +18% YoY</span>
    <div class="kpi-spark"><div class="kpi-spark-bar" style="height:50%;background:var(--purple)"></div><div class="kpi-spark-bar" style="height:45%"></div><div class="kpi-spark-bar" style="height:60%"></div><div class="kpi-spark-bar" style="height:55%"></div><div class="kpi-spark-bar" style="height:70%"></div><div class="kpi-spark-bar" style="height:80%"></div><div class="kpi-spark-bar" style="height:85%"></div><div class="kpi-spark-bar" style="height:100%;background:var(--purple)"></div></div>
  </div>
  <div class="kpi fu d4" style="--kpi-color:var(--cyan);--kpi-bg:rgba(6,182,212,.06)">
    <div class="kpi-label">ROIC <div class="kpi-icon" style="color:var(--cyan)">↗</div></div>
    <div class="kpi-value" data-target="22.4" data-suffix="%">0%</div>
    <span class="kpi-delta up">↑ +3.2pp YoY</span>
    <div class="kpi-spark"><div class="kpi-spark-bar" style="height:60%;background:var(--cyan)"></div><div class="kpi-spark-bar" style="height:55%"></div><div class="kpi-spark-bar" style="height:65%"></div><div class="kpi-spark-bar" style="height:70%"></div><div class="kpi-spark-bar" style="height:75%"></div><div class="kpi-spark-bar" style="height:82%"></div><div class="kpi-spark-bar" style="height:90%"></div><div class="kpi-spark-bar" style="height:100%;background:var(--cyan)"></div></div>
  </div>
  <div class="kpi fu d5" style="--kpi-color:var(--amber);--kpi-bg:rgba(245,158,11,.06)">
    <div class="kpi-label">Net Income <div class="kpi-icon" style="color:var(--amber)">★</div></div>
    <div class="kpi-value" data-target="8.1" data-prefix="$" data-suffix="M">$0M</div>
    <span class="kpi-delta up">↑ +31% YoY</span>
    <div class="kpi-spark"><div class="kpi-spark-bar" style="height:35%;background:var(--amber)"></div><div class="kpi-spark-bar" style="height:40%"></div><div class="kpi-spark-bar" style="height:50%"></div><div class="kpi-spark-bar" style="height:55%"></div><div class="kpi-spark-bar" style="height:65%"></div><div class="kpi-spark-bar" style="height:75%"></div><div class="kpi-spark-bar" style="height:88%"></div><div class="kpi-spark-bar" style="height:100%;background:var(--amber)"></div></div>
  </div>
  <div class="kpi fu d6" style="--kpi-color:var(--green);--kpi-bg:rgba(16,185,129,.06)">
    <div class="kpi-label">Burn Rate <div class="kpi-icon" style="color:var(--green)">⚡</div></div>
    <div class="kpi-value" data-target="1.2" data-prefix="$" data-suffix="M/mo">$0M/mo</div>
    <span class="kpi-delta up">↓ -15% QoQ</span>
    <div class="kpi-spark"><div class="kpi-spark-bar" style="height:100%;background:var(--green)"></div><div class="kpi-spark-bar" style="height:90%"></div><div class="kpi-spark-bar" style="height:85%"></div><div class="kpi-spark-bar" style="height:80%"></div><div class="kpi-spark-bar" style="height:70%"></div><div class="kpi-spark-bar" style="height:65%"></div><div class="kpi-spark-bar" style="height:55%"></div><div class="kpi-spark-bar" style="height:45%;background:var(--green)"></div></div>
  </div>
</div>

<!-- P&L Statement -->
<div class="section fu d3">
  <div class="section-head">
    <div class="section-title"><span class="dot"></span> P&L Statement — Q1 FY2026</div>
    <span class="section-badge">Live Data</span>
  </div>
  <div class="pl-table">
    <div class="pl-row header"><span>Line Item</span><span>Actual</span><span>Budget</span><span>Variance</span><span></span></div>
    <div class="pl-row" data-expand="rev"><span class="pl-name"><span class="pl-expand" onclick="toggle('rev')">▸</span> Revenue</span><span class="pl-val">$48.6M</span><span class="pl-val">$42.0M</span><span class="pl-var positive">+15.7%</span><span><div class="pl-bar-wrap"><div class="pl-bar positive" style="width:78%"></div></div></span></div>
    <div class="pl-children" id="rev"><div class="pl-row pl-child"><span class="pl-name">Subscription Revenue</span><span class="pl-val">$38.2M</span><span class="pl-val">$33.0M</span><span class="pl-var positive">+15.8%</span><span></span></div><div class="pl-row pl-child"><span class="pl-name">Services Revenue</span><span class="pl-val">$6.8M</span><span class="pl-val">$5.5M</span><span class="pl-var positive">+23.6%</span><span></span></div><div class="pl-row pl-child"><span class="pl-name">Other Revenue</span><span class="pl-val">$3.6M</span><span class="pl-val">$3.5M</span><span class="pl-var positive">+2.9%</span><span></span></div></div>
    <div class="pl-row"><span class="pl-name">Cost of Goods Sold</span><span class="pl-val">($7.4M)</span><span class="pl-val">($7.1M)</span><span class="pl-var negative">+4.2%</span><span><div class="pl-bar-wrap"><div class="pl-bar negative" style="width:21%"></div></div></span></div>
    <div class="pl-row subtotal"><span class="pl-name">Gross Profit</span><span class="pl-val">$41.2M</span><span class="pl-val">$34.9M</span><span class="pl-var positive">+18.1%</span><span><div class="pl-bar-wrap"><div class="pl-bar positive" style="width:90%"></div></div></span></div>
    <div class="pl-row" data-expand="opex"><span class="pl-name"><span class="pl-expand" onclick="toggle('opex')">▸</span> Operating Expenses</span><span class="pl-val">($28.4M)</span><span class="pl-val">($27.0M)</span><span class="pl-var negative">+5.2%</span><span><div class="pl-bar-wrap"><div class="pl-bar negative" style="width:26%"></div></div></span></div>
    <div class="pl-children" id="opex"><div class="pl-row pl-child"><span class="pl-name">Sales & Marketing</span><span class="pl-val">($12.1M)</span><span class="pl-val">($11.5M)</span><span class="pl-var negative">+5.2%</span><span></span></div><div class="pl-row pl-child"><span class="pl-name">R&D</span><span class="pl-val">($9.8M)</span><span class="pl-val">($9.2M)</span><span class="pl-var negative">+6.5%</span><span></span></div><div class="pl-row pl-child"><span class="pl-name">G&A</span><span class="pl-val">($6.5M)</span><span class="pl-val">($6.3M)</span><span class="pl-var negative">+3.2%</span><span></span></div></div>
    <div class="pl-row subtotal"><span class="pl-name">EBITDA</span><span class="pl-val">$14.2M</span><span class="pl-val">$9.8M</span><span class="pl-var positive">+44.9%</span><span><div class="pl-bar-wrap"><div class="pl-bar positive" style="width:100%"></div></div></span></div>
    <div class="pl-row total"><span class="pl-name">Net Income</span><span class="pl-val">$8.1M</span><span class="pl-val">$5.6M</span><span class="pl-var positive">+44.6%</span><span><div class="pl-bar-wrap"><div class="pl-bar positive" style="width:100%"></div></div></span></div>
  </div>
</div>

<!-- Bottom Grid: Cash + Board Deck -->
<div class="bottom-grid">
  <div class="cash-card fu d4">
    <div class="section-title" style="font-size:13px;margin-bottom:0"><span class="dot"></span> Cash Position</div>
    <div class="cash-amount" data-target="34.2" data-prefix="$" data-suffix="M">$0M</div>
    <div class="cash-runway">Runway: <span class="metric">28 months</span> at current burn</div>
    <div class="cash-bars">
      <div class="cash-bar" style="height:55%;background:rgba(59,130,246,.2);border-radius:4px"><div class="cash-bar-label">Oct</div></div>
      <div class="cash-bar" style="height:60%;background:rgba(59,130,246,.25);border-radius:4px"><div class="cash-bar-label">Nov</div></div>
      <div class="cash-bar" style="height:58%;background:rgba(59,130,246,.3);border-radius:4px"><div class="cash-bar-label">Dec</div></div>
      <div class="cash-bar" style="height:65%;background:rgba(59,130,246,.35);border-radius:4px"><div class="cash-bar-label">Jan</div></div>
      <div class="cash-bar" style="height:72%;background:rgba(59,130,246,.4);border-radius:4px"><div class="cash-bar-label">Feb</div></div>
      <div class="cash-bar" style="height:85%;background:var(--blue);border-radius:4px"><div class="cash-bar-label">Mar</div></div>
    </div>
  </div>
  <div class="deck-card fu d5">
    <div>
      <div class="deck-title">One-Click Board Deck</div>
      <div class="deck-sub">Auto-generated from live data. Branded to your company.</div>
      <div class="deck-formats">
        <span class="deck-format">PDF</span>
        <span class="deck-format">PPTX</span>
        <span class="deck-format">XLSX</span>
      </div>
    </div>
    <div>
      <button class="deck-btn">⬇ Generate Board Deck</button>
      <div class="deck-last">Last generated: March 22, 2026</div>
    </div>
  </div>
</div>

<!-- AI Copilot -->
<div class="ai-section fu d5">
  <div class="ai-header"><div class="ai-header-dot"></div><div class="ai-header-title">AI Copilot — Financial Intelligence</div></div>
  <div class="ai-body">
    <div class="ai-msg user">Why is COGS up 12% this quarter?</div>
    <div class="ai-msg ai"><strong>COGS increased 12.3% ($840K) driven by three factors:</strong><br><br>1. <strong>Cloud infrastructure costs</strong> rose 18% due to new enterprise customer onboarding (3 accounts over $200K ARR)<br>2. <strong>Third-party API costs</strong> increased 9% from higher AI model usage across the copilot feature<br>3. <strong>Support headcount</strong> added 2 FTEs in January for SOC 2 compliance work<br><br>Net impact on gross margin: -1.2pp (offset by 3.3pp revenue growth, so GM still improved +2.1pp)<div class="ai-reason">Reasoning: Analyzed GL entries 5000-5999, compared Q4→Q1 variance, cross-referenced with hiring data and vendor invoices.</div></div>
  </div>
  <div class="ai-input">
    <input type="text" placeholder="Ask about your financials...">
    <button>Send</button>
  </div>
</div>

<!-- Footer -->
<div class="footer">
  <span>FinanceOS — CFO Dashboard</span>
  <span style="font-family:var(--mono);font-size:10px;padding:3px 10px;border-radius:100px;background:var(--elevated);border:1px solid var(--border-s)">v3.0 · March 2026</span>
</div>

</div>


` }} />
    </>
  );
}
