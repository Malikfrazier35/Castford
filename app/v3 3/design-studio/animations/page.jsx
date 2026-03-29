'use client';

import { useEffect, useRef } from 'react';

export default function V3DesignStudioAnimationsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ── Scroll Reveal ──
const observer=new IntersectionObserver((entries)=>{
entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target.querySelectorAll('.count-up').length){e.target.querySelectorAll('.count-up').forEach(animateCounter)}}})
},{threshold:.15});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el=>observer.observe(el));

// ── Animated Counter ──
function animateCounter(el){
if(el.dataset.done)return;el.dataset.done='1';
const target=parseInt(el.dataset.target);const prefix=el.dataset.prefix||'';const suffix=el.dataset.suffix||'';const fmt=el.dataset.format==='comma';
const duration=1200;const start=performance.now();
function update(now){
const t=Math.min((now-start)/duration,1);
const eased=1-Math.pow(1-t,3);
const val=Math.round(eased*target);
el.textContent=prefix+(fmt?val.toLocaleString():val)+suffix;
if(t<1)requestAnimationFrame(update);
}
requestAnimationFrame(update);
}

// ── Ripple Effect ──
function ripple(e){
const btn=e.currentTarget;const r=document.createElement('span');r.className='ripple';
const rect=btn.getBoundingClientRect();const size=Math.max(rect.width,rect.height);
r.style.width=r.style.height=size+'px';r.style.left=(e.clientX-rect.left-size/2)+'px';
r.style.top=(e.clientY-rect.top-size/2)+'px';btn.appendChild(r);
setTimeout(()=>r.remove(),600);
}

// ── Toast System ──
function showToast(type,title,msg){
const c=document.getElementById('toasts');
const icons={success:'✓',error:'✕',info:'ℹ',warning:'⚠'};
const t=document.createElement('div');
t.className='toast '+type;
t.innerHTML=\`<div class="toast-icon">\${icons[type]}</div><div class="toast-content"><div class="toast-title">\${title}</div><div class="toast-msg">\${msg}</div></div><button class="toast-close" onclick="dismissToast(this.parentElement)">&times;</button><div class="toast-progress"></div>\`;
c.appendChild(t);
setTimeout(()=>dismissToast(t),4500);
}
function dismissToast(t){if(!t.parentElement)return;t.classList.add('out');setTimeout(()=>t.remove(),300)}

// ── Nav Click ──
function navClick(el){
el.parentElement.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
el.classList.add('active');
}

// ── Accordion ──
function toggleAcc(item){
const wasOpen=item.classList.contains('open');
item.parentElement.querySelectorAll('.acc-item').forEach(i=>i.classList.remove('open'));
if(!wasOpen)item.classList.add('open');
}

// ── Bar Chart ──
(function(){
const c=document.getElementById('barChart');if(!c)return;
const months=['Oct','Nov','Dec','Jan','Feb','Mar'];
const saas=[140,155,168,175,180,190];
const services=[60,72,85,95,110,128];
months.forEach((m,i)=>{
const maxH=Math.max(...saas,...services);
const g=document.createElement('div');g.className='bar-group';
const b1=document.createElement('div');b1.className='bar';b1.style.background='var(--accent)';
b1.style.height='0';b1.innerHTML=\`<div class="bar-tooltip">$\${saas[i]}K</div>\`;
const b2=document.createElement('div');b2.className='bar';b2.style.background='var(--purple)';
b2.style.height='0';b2.innerHTML=\`<div class="bar-tooltip">$\${services[i]}K</div>\`;
const lbl=document.createElement('div');lbl.className='bar-label';lbl.textContent=m;
g.appendChild(b1);g.appendChild(b2);g.appendChild(lbl);c.appendChild(g);
setTimeout(()=>{b1.style.height=(saas[i]/200*100)+'%';b2.style.height=(services[i]/200*100)+'%'},200+i*100);
});
})();

// ── Donut Chart ──
(function(){
const c=document.getElementById('donutChart');if(!c)return;
const data=[{label:'Platform SaaS',pct:50,color:'var(--accent)'},{label:'Services',pct:33,color:'var(--purple)'},{label:'Managed FP&A',pct:17,color:'var(--green)'}];
const r=60,sw=14,cx=80,cy=80,circ=2*Math.PI*r;
let svg=\`<svg class="donut" viewBox="0 0 160 160" style="width:160px;height:160px">\`;
let offset=0;
data.forEach(d=>{
const dash=circ*(d.pct/100);
svg+=\`<circle cx="\${cx}" cy="\${cy}" r="\${r}" fill="none" stroke="\${d.color}" stroke-width="\${sw}" stroke-dasharray="\${dash} \${circ-dash}" stroke-dashoffset="\${-offset}" opacity=".85"/>\`;
offset+=dash;
});
svg+=\`<text x="\${cx}" y="\${cy-4}" text-anchor="middle" fill="var(--text)" font-size="20" font-weight="700">$4.2M</text>\`;
svg+=\`<text x="\${cx}" y="\${cy+14}" text-anchor="middle" fill="var(--dim)" font-size="11">ARR</text>\`;
svg+=\`</svg>\`;
let legend='<div class="donut-legend">';
data.forEach(d=>{legend+=\`<div class="donut-item"><div class="donut-swatch" style="background:\${d.color}"></div>\${d.label} — \${d.pct}%</div>\`});
legend+='</div>';
c.innerHTML=svg+legend;
})();

// ── Particles ──
(function(){
const c=document.getElementById('particles');
for(let i=0;i<30;i++){
const p=document.createElement('div');p.className='particle';
p.style.left=Math.random()*100+'%';
p.style.animationDuration=(8+Math.random()*12)+'s';
p.style.animationDelay=Math.random()*8+'s';
p.style.width=p.style.height=(1+Math.random()*2)+'px';
const colors=['var(--accent)','var(--purple)','var(--green)','var(--pink)'];
p.style.background=colors[Math.floor(Math.random()*colors.length)];
c.appendChild(p);
}
})();

// Chart legend colors
document.querySelectorAll('.chart-legend span').forEach(s=>{
const c=getComputedStyle(s).getPropertyValue('--c');
s.querySelector('::before');
});
const style=document.createElement('style');
style.textContent=\`.chart-legend span:nth-child(1)::before{background:var(--accent)}.chart-legend span:nth-child(2)::before{background:var(--purple)}.chart-legend span:nth-child(3)::before{background:var(--green)}\`;
document.head.appendChild(style);`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*{margin:0;padding:0;box-sizing:border-box}

/* ═══════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════ */
:root{
  --bg:#0a0d13;--bg2:#0e1119;--surface:#111520;--card:#161b28;--card2:#1a2033;--card3:#1e2540;
  --border:#1e2540;--border2:#2a3050;
  --text:#e2e8f0;--text2:#c8d0e0;--dim:#8892a8;--muted:#5a6380;
  --accent:#5b9cf5;--accent2:#3b7de0;--accent-glow:rgba(91,156,245,.25);
  --green:#34d399;--green-glow:rgba(52,211,153,.2);
  --red:#f87171;--red-glow:rgba(248,113,113,.2);
  --amber:#fbbf24;--amber-glow:rgba(251,191,36,.2);
  --purple:#a78bfa;--purple-glow:rgba(167,139,250,.2);
  --pink:#f472b6;--cyan:#22d3ee;
  --radius:12px;--radius-sm:8px;--radius-lg:16px;
  --shadow:0 4px 24px rgba(0,0,0,.4);--shadow-lg:0 8px 48px rgba(0,0,0,.6);
  --ease:cubic-bezier(.4,0,.2,1);--ease-bounce:cubic-bezier(.34,1.56,.64,1);
  --ease-elastic:cubic-bezier(.68,-.55,.265,1.55);
}

body{font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden}

/* ═══════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════ */
.container{max-width:1400px;margin:0 auto;padding:32px 24px}
.section{margin-bottom:64px}
.section-header{margin-bottom:32px;padding-bottom:16px;border-bottom:1px solid var(--border)}
.section-header h2{font-size:24px;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.section-header p{color:var(--dim);font-size:14px;margin-top:6px}
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}

/* ═══════════════════════════════════════════
   HERO / PAGE HEADER
   ═══════════════════════════════════════════ */
.hero{text-align:center;padding:80px 0 60px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:800px;height:800px;background:radial-gradient(circle,rgba(91,156,245,.08) 0%,transparent 70%);pointer-events:none}
.hero h1{font-size:48px;font-weight:800;letter-spacing:-.5px;margin-bottom:12px;animation:heroFadeUp .8s var(--ease) both}
.hero h1 span{background:linear-gradient(135deg,var(--accent),var(--purple),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:200% 200%;animation:gradientShift 4s ease infinite}
.hero .sub{color:var(--dim);font-size:18px;animation:heroFadeUp .8s var(--ease) .15s both}

@keyframes heroFadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

/* ═══════════════════════════════════════════
   1. CARD SYSTEM — Hover, Glow, Glass
   ═══════════════════════════════════════════ */
.demo-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;transition:all .35s var(--ease);position:relative;overflow:hidden}

/* Hover lift */
.card-lift:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--border2)}

/* Glow border */
.card-glow{position:relative}
.card-glow::before{content:'';position:absolute;inset:-1px;border-radius:var(--radius);background:linear-gradient(135deg,var(--accent),var(--purple));opacity:0;transition:opacity .4s var(--ease);z-index:-1}
.card-glow:hover::before{opacity:1}
.card-glow:hover{border-color:transparent;background:var(--card)}

/* Glass card */
.card-glass{background:rgba(22,27,40,.6);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.06)}
.card-glass:hover{background:rgba(22,27,40,.8);border-color:rgba(255,255,255,.12)}

/* Shimmer sweep */
.card-shimmer{overflow:hidden}
.card-shimmer::after{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent);transition:none}
.card-shimmer:hover::after{animation:shimmer .8s ease forwards}
@keyframes shimmer{to{left:150%}}

/* Pulse border */
.card-pulse{animation:pulseBorder 3s ease infinite}
@keyframes pulseBorder{0%,100%{border-color:var(--border)}50%{border-color:var(--accent)}}

.card-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:12px}
.card-title{font-size:16px;font-weight:600;margin-bottom:8px}
.card-desc{font-size:13px;color:var(--dim);line-height:1.7}

/* ═══════════════════════════════════════════
   2. KPI COUNTER ANIMATIONS
   ═══════════════════════════════════════════ */
.kpi-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;position:relative;overflow:hidden;transition:all .3s var(--ease)}
.kpi-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.3)}
.kpi-card .kpi-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:16px}
.kpi-card .kpi-label{font-size:12px;color:var(--dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.kpi-card .kpi-value{font-size:32px;font-weight:700;font-variant-numeric:tabular-nums}
.kpi-card .kpi-change{display:inline-flex;align-items:center;gap:4px;font-size:13px;margin-top:8px;padding:3px 10px;border-radius:20px}
.kpi-card .kpi-spark{position:absolute;bottom:0;right:0;opacity:.3}

/* Animated counter */
.counter{display:inline-block;transition:all .6s var(--ease)}

/* Accent glow on hover */
.kpi-blue:hover{box-shadow:0 0 30px var(--accent-glow)}
.kpi-green:hover{box-shadow:0 0 30px var(--green-glow)}
.kpi-purple:hover{box-shadow:0 0 30px var(--purple-glow)}
.kpi-amber:hover{box-shadow:0 0 30px var(--amber-glow)}

/* ═══════════════════════════════════════════
   3. BUTTON SYSTEM
   ═══════════════════════════════════════════ */
.btn-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:var(--radius-sm);font-size:14px;font-weight:600;border:none;cursor:pointer;transition:all .25s var(--ease);position:relative;overflow:hidden;outline:none}

/* Primary — gradient with ripple */
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;box-shadow:0 2px 12px var(--accent-glow)}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 20px var(--accent-glow)}
.btn-primary:active{transform:translateY(0);box-shadow:0 1px 6px var(--accent-glow)}

/* Ghost */
.btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent);background:rgba(91,156,245,.06)}

/* Danger */
.btn-danger{background:rgba(248,113,113,.12);color:var(--red);border:1px solid rgba(248,113,113,.2)}
.btn-danger:hover{background:rgba(248,113,113,.2);box-shadow:0 0 20px var(--red-glow)}

/* Success */
.btn-success{background:rgba(52,211,153,.12);color:var(--green);border:1px solid rgba(52,211,153,.2)}
.btn-success:hover{background:rgba(52,211,153,.2);box-shadow:0 0 20px var(--green-glow)}

/* Ripple effect */
.btn .ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,.3);transform:scale(0);animation:rippleAnim .6s ease-out forwards;pointer-events:none}
@keyframes rippleAnim{to{transform:scale(4);opacity:0}}

/* Loading state */
.btn-loading{pointer-events:none;opacity:.7}
.btn-loading .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* ═══════════════════════════════════════════
   4. PROGRESS & STATUS ANIMATIONS
   ═══════════════════════════════════════════ */
.progress-demo{margin:16px 0}
.progress-track{height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden;position:relative}
.progress-fill{height:100%;border-radius:4px;position:relative;transition:width 1.2s var(--ease)}
.progress-fill::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);animation:progressShine 2s ease infinite}
@keyframes progressShine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}

.progress-label{display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px}
.progress-label span:first-child{color:var(--text2)}
.progress-label span:last-child{font-weight:600}

/* Status dots */
.status-row{display:flex;gap:20px;flex-wrap:wrap}
.status{display:flex;align-items:center;gap:8px;font-size:13px}
.status-dot{width:8px;height:8px;border-radius:50%;position:relative}
.status-dot::after{content:'';position:absolute;inset:-3px;border-radius:50%;opacity:0}
.status-dot.live{background:var(--green)}
.status-dot.live::after{background:var(--green);animation:statusPulse 2s ease infinite}
.status-dot.warning{background:var(--amber)}
.status-dot.warning::after{background:var(--amber);animation:statusPulse 2s ease infinite .5s}
.status-dot.error{background:var(--red)}
.status-dot.error::after{background:var(--red);animation:statusPulse 1.5s ease infinite}
.status-dot.idle{background:var(--muted)}
@keyframes statusPulse{0%{opacity:.6;transform:scale(1)}50%{opacity:0;transform:scale(2.5)}100%{opacity:0;transform:scale(2.5)}}

/* ═══════════════════════════════════════════
   5. SKELETON / LOADING STATES
   ═══════════════════════════════════════════ */
.skeleton-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px}
.skeleton{border-radius:6px;background:linear-gradient(90deg,var(--card3) 25%,rgba(255,255,255,.06) 50%,var(--card3) 75%);background-size:200% 100%;animation:skeletonPulse 1.8s ease infinite}
.skeleton-line{height:12px;margin-bottom:10px}
.skeleton-line.w-60{width:60%}
.skeleton-line.w-40{width:40%}
.skeleton-line.w-80{width:80%}
.skeleton-line.w-100{width:100%}
.skeleton-circle{width:48px;height:48px;border-radius:50%;margin-bottom:16px}
.skeleton-block{height:120px;margin-bottom:16px}
@keyframes skeletonPulse{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* ═══════════════════════════════════════════
   6. TOAST / NOTIFICATION SYSTEM
   ═══════════════════════════════════════════ */
.toast-container{position:fixed;top:24px;right:24px;z-index:1000;display:flex;flex-direction:column;gap:12px;pointer-events:none}
.toast{display:flex;align-items:center;gap:12px;padding:14px 20px;border-radius:var(--radius);background:var(--card);border:1px solid var(--border);box-shadow:var(--shadow-lg);backdrop-filter:blur(20px);pointer-events:auto;animation:toastIn .4s var(--ease-bounce) both;min-width:320px;max-width:420px}
.toast.out{animation:toastOut .3s var(--ease) forwards}
.toast-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.toast-content{flex:1}
.toast-title{font-size:14px;font-weight:600}
.toast-msg{font-size:12px;color:var(--dim);margin-top:2px}
.toast-close{background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:4px}
.toast-progress{position:absolute;bottom:0;left:0;height:3px;border-radius:0 0 var(--radius) var(--radius);animation:toastTimer 4s linear forwards}
.toast.success .toast-icon{background:var(--green-glow);color:var(--green)}
.toast.success .toast-progress{background:var(--green)}
.toast.error .toast-icon{background:var(--red-glow);color:var(--red)}
.toast.error .toast-progress{background:var(--red)}
.toast.info .toast-icon{background:var(--accent-glow);color:var(--accent)}
.toast.info .toast-progress{background:var(--accent)}
.toast.warning .toast-icon{background:var(--amber-glow);color:var(--amber)}
.toast.warning .toast-progress{background:var(--amber)}

@keyframes toastIn{from{opacity:0;transform:translateX(40px) scale(.95)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes toastOut{to{opacity:0;transform:translateX(40px) scale(.95)}}
@keyframes toastTimer{from{width:100%}to{width:0}}

/* ═══════════════════════════════════════════
   7. MODAL / DIALOG
   ═══════════════════════════════════════════ */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);z-index:2000;display:none;align-items:center;justify-content:center}
.modal-overlay.show{display:flex}
.modal-overlay.show .modal{animation:modalIn .35s var(--ease-bounce) both}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);width:460px;max-width:90vw;box-shadow:var(--shadow-lg);overflow:hidden}
.modal-header{padding:24px 24px 0;display:flex;align-items:center;justify-content:space-between}
.modal-header h3{font-size:18px;font-weight:600}
.modal-body{padding:20px 24px}
.modal-body p{color:var(--dim);font-size:14px;line-height:1.7}
.modal-footer{padding:16px 24px;display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--border)}
@keyframes modalIn{from{opacity:0;transform:scale(.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}

/* ═══════════════════════════════════════════
   8. TABLE HOVER EFFECTS
   ═══════════════════════════════════════════ */
.data-table{width:100%;border-collapse:collapse;font-size:14px}
.data-table th{text-align:left;padding:12px 16px;color:var(--dim);font-weight:500;font-size:12px;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border);background:var(--bg2)}
.data-table td{padding:12px 16px;border-bottom:1px solid rgba(30,37,64,.4);transition:all .2s var(--ease)}
.data-table tr{transition:all .2s var(--ease)}
.data-table tbody tr:hover td{background:rgba(91,156,245,.04)}
.data-table tbody tr:hover{transform:scale(1.005)}
.data-table .cell-highlight{position:relative}
.data-table .cell-highlight::after{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:60%;border-radius:2px;background:var(--accent);opacity:0;transition:opacity .2s}
.data-table tbody tr:hover .cell-highlight::after{opacity:1}

/* ═══════════════════════════════════════════
   9. ANIMATED CHART COMPONENTS
   ═══════════════════════════════════════════ */
.chart-container{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;overflow:hidden}
.chart-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.chart-header h3{font-size:16px;font-weight:600}
.chart-legend{display:flex;gap:16px;font-size:12px;color:var(--dim)}
.chart-legend span{display:flex;align-items:center;gap:6px}
.chart-legend span::before{content:'';width:8px;height:8px;border-radius:2px}

/* Animated bar chart */
.bar-chart{display:flex;align-items:flex-end;gap:6px;height:160px;padding-top:20px}
.bar-group{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%}
.bar{width:100%;border-radius:4px 4px 0 0;transition:height 1s var(--ease-bounce);position:relative;cursor:pointer;min-height:2px}
.bar:hover{filter:brightness(1.2)}
.bar .bar-tooltip{position:absolute;top:-28px;left:50%;transform:translateX(-50%);background:var(--card3);padding:4px 8px;border-radius:4px;font-size:11px;white-space:nowrap;opacity:0;transition:opacity .2s;pointer-events:none}
.bar:hover .bar-tooltip{opacity:1}
.bar-label{font-size:10px;color:var(--muted);margin-top:8px}

/* Animated donut */
.donut-container{display:flex;align-items:center;gap:32px}
.donut svg circle{transition:stroke-dashoffset 1.2s var(--ease);transform-origin:center;transform:rotate(-90deg)}
.donut-legend{display:flex;flex-direction:column;gap:10px}
.donut-item{display:flex;align-items:center;gap:10px;font-size:13px}
.donut-swatch{width:12px;height:12px;border-radius:3px}

/* Sparkline animation */
.sparkline-animated path{stroke-dasharray:200;stroke-dashoffset:200;animation:drawLine 1.5s var(--ease) forwards}
@keyframes drawLine{to{stroke-dashoffset:0}}

/* ═══════════════════════════════════════════
   10. SCROLL-REVEAL ANIMATIONS
   ═══════════════════════════════════════════ */
.reveal{opacity:0;transform:translateY(30px);transition:all .6s var(--ease)}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-left{opacity:0;transform:translateX(-40px);transition:all .6s var(--ease)}
.reveal-left.visible{opacity:1;transform:translateX(0)}
.reveal-right{opacity:0;transform:translateX(40px);transition:all .6s var(--ease)}
.reveal-right.visible{opacity:1;transform:translateX(0)}
.reveal-scale{opacity:0;transform:scale(.9);transition:all .5s var(--ease-bounce)}
.reveal-scale.visible{opacity:1;transform:scale(1)}

/* Stagger children */
.stagger-children .reveal:nth-child(1){transition-delay:.05s}
.stagger-children .reveal:nth-child(2){transition-delay:.1s}
.stagger-children .reveal:nth-child(3){transition-delay:.15s}
.stagger-children .reveal:nth-child(4){transition-delay:.2s}
.stagger-children .reveal:nth-child(5){transition-delay:.25s}
.stagger-children .reveal:nth-child(6){transition-delay:.3s}

/* ═══════════════════════════════════════════
   11. INPUT / FORM ANIMATIONS
   ═══════════════════════════════════════════ */
.input-group{position:relative;margin-bottom:20px}
.input-field{width:100%;padding:14px 16px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:14px;transition:all .25s var(--ease);outline:none}
.input-field:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}
.input-field::placeholder{color:var(--muted);transition:all .25s var(--ease)}
.input-field:focus::placeholder{opacity:.5;transform:translateX(4px)}
.input-label{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--muted);pointer-events:none;transition:all .25s var(--ease-bounce)}
.input-field:focus~.input-label,.input-field:not(:placeholder-shown)~.input-label{top:0;transform:translateY(-50%);font-size:11px;color:var(--accent);background:var(--card);padding:0 6px;left:12px}

/* Toggle switch */
.toggle{width:44px;height:24px;background:var(--card3);border-radius:12px;position:relative;cursor:pointer;transition:background .3s var(--ease)}
.toggle::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:transform .3s var(--ease-bounce);box-shadow:0 1px 4px rgba(0,0,0,.3)}
.toggle.active{background:var(--accent)}
.toggle.active::after{transform:translateX(20px)}

/* ═══════════════════════════════════════════
   12. BADGE & TAG SYSTEM
   ═══════════════════════════════════════════ */
.badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;transition:all .2s var(--ease)}
.badge:hover{transform:scale(1.05)}
.badge-blue{background:rgba(91,156,245,.12);color:var(--accent)}
.badge-green{background:rgba(52,211,153,.12);color:var(--green)}
.badge-red{background:rgba(248,113,113,.12);color:var(--red)}
.badge-amber{background:rgba(251,191,36,.12);color:var(--amber)}
.badge-purple{background:rgba(167,139,250,.12);color:var(--purple)}

/* Animated badge */
.badge-new{position:relative}
.badge-new::after{content:'';position:absolute;top:-2px;right:-2px;width:6px;height:6px;border-radius:50%;background:var(--red);animation:badgePing 1.5s ease infinite}
@keyframes badgePing{0%{box-shadow:0 0 0 0 rgba(248,113,113,.6)}100%{box-shadow:0 0 0 8px rgba(248,113,113,0)}}

/* ═══════════════════════════════════════════
   13. SIDEBAR NAV HOVER
   ═══════════════════════════════════════════ */
.sidebar-demo{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);width:240px;padding:8px}
.nav-item{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--radius-sm);cursor:pointer;transition:all .2s var(--ease);color:var(--dim);font-size:14px;position:relative;overflow:hidden}
.nav-item:hover{color:var(--text);background:rgba(91,156,245,.06)}
.nav-item.active{color:var(--accent);background:rgba(91,156,245,.1)}
.nav-item.active::before{content:'';position:absolute;left:0;top:20%;height:60%;width:3px;border-radius:0 2px 2px 0;background:var(--accent)}
.nav-item .nav-icon{width:20px;height:20px;display:flex;align-items:center;justify-content:center;transition:transform .2s var(--ease)}
.nav-item .nav-icon svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.nav-item:hover .nav-icon{transform:scale(1.15)}
.nav-item .nav-badge{margin-left:auto;background:var(--accent);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;min-width:20px;text-align:center}

/* ═══════════════════════════════════════════
   14. MICRO-INTERACTIONS
   ═══════════════════════════════════════════ */
.micro-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}
.micro-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center;cursor:pointer;transition:all .3s var(--ease)}
.micro-card:hover{border-color:var(--accent)}
.micro-icon{margin-bottom:12px;display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:12px;transition:all .3s var(--ease-bounce)}
.micro-icon svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.micro-card:hover .micro-icon{transform:scale(1.2)}
.micro-card:nth-child(1):hover .micro-icon{animation:wiggle .4s ease}
.micro-card:nth-child(2):hover .micro-icon{animation:bounce .5s var(--ease-bounce)}
.micro-card:nth-child(3):hover .micro-icon{animation:spinOnce .5s var(--ease)}
.micro-card:nth-child(4):hover .micro-icon{animation:rubberBand .6s ease}
.micro-card:nth-child(5):hover .micro-icon{animation:heartbeat .6s ease}
.micro-card:nth-child(6):hover .micro-icon{animation:jello .6s ease}
.micro-name{font-size:12px;color:var(--dim)}

@keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-15deg) scale(1.2)}75%{transform:rotate(15deg) scale(1.2)}}
@keyframes bounce{0%,100%{transform:translateY(0) scale(1.2)}50%{transform:translateY(-12px) scale(1.2)}}
@keyframes spinOnce{from{transform:rotate(0) scale(1.2)}to{transform:rotate(360deg) scale(1.2)}}
@keyframes rubberBand{0%{transform:scale(1.2)}30%{transform:scaleX(1.5) scaleY(.7)}40%{transform:scaleX(.8) scaleY(1.4)}50%{transform:scaleX(1.3) scaleY(.85)}65%{transform:scaleX(.95) scaleY(1.1)}75%{transform:scaleX(1.05) scaleY(.95)}100%{transform:scale(1.2)}}
@keyframes heartbeat{0%,100%{transform:scale(1.2)}14%{transform:scale(1.5)}28%{transform:scale(1.2)}42%{transform:scale(1.5)}70%{transform:scale(1.2)}}
@keyframes jello{0%,100%{transform:skewX(0) scale(1.2)}30%{transform:skewX(-12deg) scale(1.2)}40%{transform:skewX(8deg) scale(1.2)}50%{transform:skewX(-4deg) scale(1.2)}65%{transform:skewX(2deg) scale(1.2)}75%{transform:skewX(-1deg) scale(1.2)}}

/* ═══════════════════════════════════════════
   15. ANIMATED NUMBER COUNTER
   ═══════════════════════════════════════════ */
.count-up{font-variant-numeric:tabular-nums;font-weight:700}

/* ═══════════════════════════════════════════
   16. TOOLTIP
   ═══════════════════════════════════════════ */
[data-tip]{position:relative;cursor:pointer}
[data-tip]::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%) translateY(4px);background:var(--card3);color:var(--text);padding:6px 12px;border-radius:6px;font-size:12px;white-space:nowrap;opacity:0;pointer-events:none;transition:all .2s var(--ease-bounce);z-index:10;box-shadow:var(--shadow)}
[data-tip]:hover::after{opacity:1;transform:translateX(-50%) translateY(0)}

/* ═══════════════════════════════════════════
   17. ACCORDION
   ═══════════════════════════════════════════ */
.accordion{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.acc-item{border-bottom:1px solid var(--border)}
.acc-item:last-child{border-bottom:none}
.acc-header{padding:16px 20px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;background:var(--card);transition:background .2s var(--ease);font-weight:500;font-size:14px}
.acc-header:hover{background:var(--card2)}
.acc-arrow{transition:transform .3s var(--ease);color:var(--dim);display:flex;align-items:center}
.acc-item.open .acc-arrow{transform:rotate(180deg);color:var(--accent)}
.acc-body{max-height:0;overflow:hidden;transition:max-height .4s var(--ease);background:var(--bg2)}
.acc-item.open .acc-body{max-height:200px}
.acc-content{padding:16px 20px;font-size:13px;color:var(--dim);line-height:1.8}

/* ═══════════════════════════════════════════
   18. PARTICLE / AMBIENT BG
   ═══════════════════════════════════════════ */
.particle-bg{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.particle{position:absolute;width:2px;height:2px;background:var(--accent);border-radius:50%;opacity:.3;animation:float linear infinite}
@keyframes float{0%{transform:translateY(100vh) translateX(0);opacity:0}10%{opacity:.3}90%{opacity:.3}100%{transform:translateY(-10vh) translateX(40px);opacity:0}}

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
@media(max-width:1024px){
.grid-3,.grid-4{grid-template-columns:repeat(2,1fr)}
.hero h1{font-size:36px}
}
@media(max-width:768px){
.container{padding:20px 16px}
.grid-2,.grid-3,.grid-4{grid-template-columns:1fr}
.hero h1{font-size:28px}
.hero{padding:40px 0 30px}
.donut-container{flex-direction:column;align-items:flex-start}
.btn-row{flex-direction:column}
.btn{width:100%;justify-content:center}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- Ambient particles -->
<div class="particle-bg" id="particles"></div>

<div class="container" style="position:relative;z-index:1">

<!-- HERO -->
<div class="hero">
<h1>FinanceOS <span>UI/UX Kit</span></h1>
<div class="sub">CSS Animations, Micro-Interactions & Component Library</div>
</div>

<!-- ═══ 1. CARD EFFECTS ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>1. Card Effects</h2>
<p>Hover each card to see the interaction pattern</p>
</div>
<div class="grid-4 stagger-children">
<div class="demo-card card-lift reveal">
<div class="card-label">Lift + Shadow</div>
<div class="card-title">Hover Lift</div>
<div class="card-desc">Smooth Y-translate with deepening shadow on hover. Default interaction for all dashboard cards.</div>
</div>
<div class="demo-card card-glow reveal">
<div class="card-label">Gradient Border</div>
<div class="card-title">Glow Border</div>
<div class="card-desc">Gradient border reveal using ::before pseudo-element. Use for featured or premium content.</div>
</div>
<div class="demo-card card-glass reveal">
<div class="card-label">Glassmorphism</div>
<div class="card-title">Glass Card</div>
<div class="card-desc">Frosted glass with backdrop-filter blur. Works best over gradient or image backgrounds.</div>
</div>
<div class="demo-card card-shimmer card-lift reveal">
<div class="card-label">Shimmer Sweep</div>
<div class="card-title">Shimmer Card</div>
<div class="card-desc">Light sweep animation on hover. Great for CTAs and promotional content blocks.</div>
</div>
</div>
</div>

<!-- ═══ 2. KPI COUNTERS ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>2. KPI Counter Cards</h2>
<p>Animated counters with glow effects and sparklines</p>
</div>
<div class="grid-4 stagger-children">
<div class="kpi-card kpi-blue reveal">
<div class="kpi-icon" style="background:var(--accent-glow);color:var(--accent)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
<div class="kpi-label">Monthly Revenue</div>
<div class="kpi-value" style="color:var(--accent)"><span class="count-up" data-target="428000" data-prefix="$" data-format="comma">$0</span></div>
<div class="kpi-change" style="background:var(--green-glow);color:var(--green)">+12.4%</div>
<svg class="kpi-spark sparkline-animated" width="100" height="40" viewBox="0 0 100 40"><path d="M0,30 L15,25 L30,28 L45,18 L60,22 L75,12 L100,8" fill="none" stroke="var(--accent)" stroke-width="2"/></svg>
</div>
<div class="kpi-card kpi-green reveal">
<div class="kpi-icon" style="background:var(--green-glow);color:var(--green)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="2"/><circle cx="15" cy="15" r="2"/><line x1="5" y1="19" x2="19" y2="5"/></svg></div>
<div class="kpi-label">Gross Margin</div>
<div class="kpi-value" style="color:var(--green)"><span class="count-up" data-target="68" data-suffix="%">0%</span></div>
<div class="kpi-change" style="background:var(--green-glow);color:var(--green)">+4.2pp</div>
<svg class="kpi-spark sparkline-animated" width="100" height="40" viewBox="0 0 100 40"><path d="M0,25 L20,20 L40,22 L60,15 L80,10 L100,12" fill="none" stroke="var(--green)" stroke-width="2"/></svg>
</div>
<div class="kpi-card kpi-purple reveal">
<div class="kpi-icon" style="background:var(--purple-glow);color:var(--purple)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
<div class="kpi-label">Active Projects</div>
<div class="kpi-value" style="color:var(--purple)"><span class="count-up" data-target="43">0</span></div>
<div class="kpi-change" style="background:var(--green-glow);color:var(--green)">+8 this Q</div>
<svg class="kpi-spark sparkline-animated" width="100" height="40" viewBox="0 0 100 40"><path d="M0,35 L25,28 L50,30 L75,18 L100,10" fill="none" stroke="var(--purple)" stroke-width="2"/></svg>
</div>
<div class="kpi-card kpi-amber reveal">
<div class="kpi-icon" style="background:var(--amber-glow);color:var(--amber)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
<div class="kpi-label">At-Risk Deals</div>
<div class="kpi-value" style="color:var(--amber)"><span class="count-up" data-target="3">0</span></div>
<div class="kpi-change" style="background:var(--red-glow);color:var(--red)">+1 this week</div>
<svg class="kpi-spark sparkline-animated" width="100" height="40" viewBox="0 0 100 40"><path d="M0,20 L25,25 L50,18 L75,28 L100,32" fill="none" stroke="var(--amber)" stroke-width="2"/></svg>
</div>
</div>
</div>

<!-- ═══ 3. BUTTONS ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>3. Button System</h2>
<p>Ripple effects, loading states, and semantic variants</p>
</div>
<div class="demo-card card-lift" style="display:flex;flex-direction:column;gap:20px">
<div class="btn-row">
<button class="btn btn-primary" onclick="ripple(event)">Primary Action</button>
<button class="btn btn-ghost" onclick="ripple(event)">Ghost Button</button>
<button class="btn btn-success" onclick="ripple(event)">Approve</button>
<button class="btn btn-danger" onclick="ripple(event)">Reject</button>
</div>
<div class="btn-row">
<button class="btn btn-primary btn-loading"><span class="spinner"></span> Processing...</button>
<button class="btn btn-ghost" data-tip="Keyboard: Ctrl+S" onclick="ripple(event)">Save Draft</button>
<button class="btn btn-primary" style="border-radius:24px" onclick="ripple(event)">Pill Button</button>
</div>
</div>
</div>

<!-- ═══ 4. PROGRESS & STATUS ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>4. Progress Bars & Status Indicators</h2>
<p>Animated fills with shine effect and pulsing status dots</p>
</div>
<div class="grid-2">
<div class="demo-card card-lift">
<div class="progress-demo">
<div class="progress-label"><span>Month-End Close</span><span style="color:var(--green)">78%</span></div>
<div class="progress-track"><div class="progress-fill" style="width:78%;background:linear-gradient(90deg,var(--accent),var(--green))"></div></div>
</div>
<div class="progress-demo">
<div class="progress-label"><span>Budget Variance</span><span style="color:var(--amber)">45%</span></div>
<div class="progress-track"><div class="progress-fill" style="width:45%;background:linear-gradient(90deg,var(--amber),var(--red))"></div></div>
</div>
<div class="progress-demo">
<div class="progress-label"><span>Data Pipeline</span><span style="color:var(--purple)">92%</span></div>
<div class="progress-track"><div class="progress-fill" style="width:92%;background:linear-gradient(90deg,var(--purple),var(--pink))"></div></div>
</div>
</div>
<div class="demo-card card-lift">
<div style="font-size:14px;font-weight:600;margin-bottom:16px">System Status</div>
<div class="status-row" style="flex-direction:column;gap:14px">
<div class="status"><div class="status-dot live"></div> API Gateway — Operational</div>
<div class="status"><div class="status-dot live"></div> Database Cluster — Healthy</div>
<div class="status"><div class="status-dot warning"></div> ML Pipeline — High Latency (2.4s)</div>
<div class="status"><div class="status-dot error"></div> Webhook Queue — 12 Failed</div>
<div class="status"><div class="status-dot idle"></div> Batch Processor — Idle</div>
</div>
</div>
</div>
</div>

<!-- ═══ 5. SKELETON LOADING ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>5. Skeleton Loading States</h2>
<p>Shimmer placeholders while data loads</p>
</div>
<div class="grid-3">
<div class="skeleton-card">
<div class="skeleton skeleton-circle"></div>
<div class="skeleton skeleton-line w-60"></div>
<div class="skeleton skeleton-line w-100"></div>
<div class="skeleton skeleton-line w-80"></div>
<div class="skeleton skeleton-block" style="margin-top:16px"></div>
</div>
<div class="skeleton-card">
<div style="display:flex;gap:12px;margin-bottom:16px">
<div class="skeleton" style="width:48px;height:48px;border-radius:50%"></div>
<div style="flex:1">
<div class="skeleton skeleton-line w-60"></div>
<div class="skeleton skeleton-line w-40"></div>
</div>
</div>
<div class="skeleton skeleton-line w-100"></div>
<div class="skeleton skeleton-line w-80"></div>
<div class="skeleton skeleton-line w-60"></div>
</div>
<div class="skeleton-card">
<div class="skeleton skeleton-line w-40"></div>
<div class="skeleton skeleton-block" style="height:80px"></div>
<div style="display:flex;gap:8px">
<div class="skeleton" style="width:60px;height:24px;border-radius:12px"></div>
<div class="skeleton" style="width:80px;height:24px;border-radius:12px"></div>
</div>
</div>
</div>
</div>

<!-- ═══ 6. TOASTS ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>6. Toast Notifications</h2>
<p>Click the buttons to trigger animated toasts</p>
</div>
<div class="btn-row">
<button class="btn btn-success" onclick="showToast('success','Pipeline Synced','All 43 projects updated successfully')">Success Toast</button>
<button class="btn btn-danger" onclick="showToast('error','Sync Failed','Unable to connect to data source')">Error Toast</button>
<button class="btn btn-primary" onclick="showToast('info','New Insight','AI detected revenue anomaly in Q2 forecast')">Info Toast</button>
<button class="btn btn-ghost" style="border-color:var(--amber);color:var(--amber)" onclick="showToast('warning','Margin Alert','BlueStar Health project dropped below 55% floor')">Warning Toast</button>
</div>
</div>

<!-- ═══ 7. MODAL ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>7. Modal Dialog</h2>
<p>Bounce-in animation with backdrop blur</p>
</div>
<button class="btn btn-primary" onclick="document.getElementById('modal1').classList.add('show')">Open Modal</button>
</div>

<!-- ═══ 8. ANIMATED TABLE ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>8. Data Table with Hover Effects</h2>
<p>Row highlighting, accent bar indicator, and smooth transitions</p>
</div>
<div class="demo-card" style="padding:0;overflow:hidden">
<table class="data-table">
<thead><tr><th>Client</th><th>Project</th><th>AE Owner</th><th>Monthly Rev</th><th>Margin</th><th>Status</th></tr></thead>
<tbody>
<tr><td class="cell-highlight"><strong>Acme Corp</strong></td><td>FP&A Transformation</td><td>J. Torres</td><td style="color:var(--green)">$48K</td><td>72%</td><td><span class="badge badge-green">On Track</span></td></tr>
<tr><td class="cell-highlight"><strong>Vertex Inc</strong></td><td>Data Pipeline Build</td><td>M. Singh</td><td style="color:var(--green)">$36K</td><td>68%</td><td><span class="badge badge-green">On Track</span></td></tr>
<tr><td class="cell-highlight"><strong>BlueStar Health</strong></td><td>EPM Implementation</td><td>J. Torres</td><td style="color:var(--green)">$62K</td><td>65%</td><td><span class="badge badge-amber">At Risk</span></td></tr>
<tr><td class="cell-highlight"><strong>Summit Financial</strong></td><td>Fractional CFO</td><td>M. Singh</td><td style="color:var(--green)">$28K</td><td>58%</td><td><span class="badge badge-blue">New</span></td></tr>
<tr><td class="cell-highlight"><strong>NovaTech</strong></td><td>Managed Close</td><td>R. Okonkwo</td><td style="color:var(--green)">$22K</td><td>74%</td><td><span class="badge badge-green">On Track</span></td></tr>
</tbody>
</table>
</div>
</div>

<!-- ═══ 9. CHARTS ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>9. Animated Charts</h2>
<p>CSS + SVG chart animations with hover tooltips</p>
</div>
<div class="grid-2">
<div class="chart-container">
<div class="chart-header">
<h3>Revenue by Month</h3>
<div class="chart-legend"><span style="--c:var(--accent)">SaaS</span><span style="--c:var(--purple)">Services</span></div>
</div>
<div class="bar-chart" id="barChart"></div>
</div>
<div class="chart-container">
<div class="chart-header"><h3>Revenue Mix</h3></div>
<div class="donut-container" id="donutChart"></div>
</div>
</div>
</div>

<!-- ═══ 10. MICRO-INTERACTIONS ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>10. Micro-Interactions</h2>
<p>Hover each icon to see the animation</p>
</div>
<div class="micro-grid">
<div class="micro-card"><div class="micro-icon" style="background:var(--accent-glow);color:var(--accent)"><svg viewBox="0 0 24 24"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg></div><div class="micro-name">Wiggle</div></div>
<div class="micro-card"><div class="micro-icon" style="background:var(--green-glow);color:var(--green)"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="micro-name">Bounce</div></div>
<div class="micro-card"><div class="micro-icon" style="background:var(--purple-glow);color:var(--purple)"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div><div class="micro-name">Spin</div></div>
<div class="micro-card"><div class="micro-icon" style="background:var(--amber-glow);color:var(--amber)"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div><div class="micro-name">Rubber Band</div></div>
<div class="micro-card"><div class="micro-icon" style="background:var(--red-glow);color:var(--red)"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div><div class="micro-name">Heartbeat</div></div>
<div class="micro-card"><div class="micro-icon" style="background:rgba(34,211,238,.15);color:var(--cyan)"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div><div class="micro-name">Jello</div></div>
</div>
</div>

<!-- ═══ 11. FORMS ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>11. Form Inputs & Controls</h2>
<p>Floating labels, focus glow, and toggle switches</p>
</div>
<div class="grid-2">
<div class="demo-card card-lift">
<div class="input-group">
<input class="input-field" type="text" placeholder=" ">
<label class="input-label">Company Name</label>
</div>
<div class="input-group">
<input class="input-field" type="email" placeholder=" ">
<label class="input-label">Email Address</label>
</div>
<div class="input-group">
<input class="input-field" type="text" placeholder="Search projects..." style="padding-left:40px">
<span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted)">🔍</span>
</div>
</div>
<div class="demo-card card-lift">
<div style="font-size:14px;font-weight:600;margin-bottom:20px">Notification Settings</div>
<div style="display:flex;flex-direction:column;gap:16px">
<div style="display:flex;align-items:center;justify-content:space-between">
<span style="font-size:14px">Email alerts</span>
<div class="toggle active" onclick="this.classList.toggle('active')"></div>
</div>
<div style="display:flex;align-items:center;justify-content:space-between">
<span style="font-size:14px">Slack notifications</span>
<div class="toggle active" onclick="this.classList.toggle('active')"></div>
</div>
<div style="display:flex;align-items:center;justify-content:space-between">
<span style="font-size:14px">SMS alerts</span>
<div class="toggle" onclick="this.classList.toggle('active')"></div>
</div>
<div style="display:flex;align-items:center;justify-content:space-between">
<span style="font-size:14px">Weekly digest</span>
<div class="toggle active" onclick="this.classList.toggle('active')"></div>
</div>
</div>
</div>
</div>
</div>

<!-- ═══ 12. SIDEBAR NAV ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>12. Sidebar Navigation</h2>
<p>Active state indicator, hover effects, and notification badges</p>
</div>
<div class="grid-2">
<div class="sidebar-demo">
<div class="nav-item active" onclick="navClick(this)"><span class="nav-icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></span> Dashboard</div>
<div class="nav-item" onclick="navClick(this)"><span class="nav-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></span> Revenue<span class="nav-badge">3</span></div>
<div class="nav-item" onclick="navClick(this)"><span class="nav-icon"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span> P&L Analysis</div>
<div class="nav-item" onclick="navClick(this)"><span class="nav-icon"><svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 14h.01"/><path d="M10 14h4"/></svg></span> Treasury</div>
<div class="nav-item" onclick="navClick(this)"><span class="nav-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span> Team<span class="nav-badge" style="background:var(--red)">!</span></div>
<div class="nav-item" onclick="navClick(this)"><span class="nav-icon"><svg viewBox="0 0 24 24"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 4-4 6-2-2-4-4.05-4-6a4 4 0 0 1 4-4z"/><path d="M4.93 14.93a8 8 0 0 0 14.14 0"/><circle cx="12" cy="18" r="2"/><line x1="12" y1="20" x2="12" y2="22"/></svg></span> AI Copilot</div>
<div class="nav-item" onclick="navClick(this)"><span class="nav-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span> Settings</div>
</div>

<!-- Accordion -->
<div>
<div style="font-size:14px;font-weight:600;margin-bottom:12px">Accordion Component</div>
<div class="accordion">
<div class="acc-item open" onclick="toggleAcc(this)">
<div class="acc-header">What is FinanceOS?<span class="acc-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span></div>
<div class="acc-body"><div class="acc-content">FinanceOS is an AI-powered FP&A platform that gives finance teams real-time visibility into revenue, margins, and cash flow with automated consolidation and scenario modeling.</div></div>
</div>
<div class="acc-item" onclick="toggleAcc(this)">
<div class="acc-header">How does pricing work?<span class="acc-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span></div>
<div class="acc-body"><div class="acc-content">Plans start at $499/year for startups with up to 3 entities. Enterprise pricing includes unlimited entities, dedicated CSM, and custom integrations.</div></div>
</div>
<div class="acc-item" onclick="toggleAcc(this)">
<div class="acc-header">What integrations are supported?<span class="acc-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span></div>
<div class="acc-body"><div class="acc-content">FinanceOS connects to QuickBooks, Xero, NetSuite, Salesforce, Stripe, and 40+ data sources via native connectors and REST API.</div></div>
</div>
</div>
</div>
</div>
</div>

<!-- ═══ 13. BADGES & TAGS ═══ -->
<div class="section reveal">
<div class="section-header">
<h2>13. Badges, Tags & Tooltips</h2>
<p>Hover for tooltips, animated notification dots</p>
</div>
<div class="demo-card card-lift" style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
<span class="badge badge-blue" data-tip="Platform subscriptions">SaaS</span>
<span class="badge badge-purple" data-tip="Implementation projects">Services</span>
<span class="badge badge-green" data-tip="Recurring retainers">Managed FP&A</span>
<span class="badge badge-amber" data-tip="Needs attention">At Risk</span>
<span class="badge badge-red" data-tip="Immediate action required">Critical</span>
<span class="badge badge-blue badge-new" data-tip="Just added">New Feature</span>
<span class="badge badge-purple badge-new" data-tip="3 unread">Messages</span>
</div>
</div>

</div><!-- /container -->

<!-- MODAL -->
<div class="modal-overlay" id="modal1" onclick="if(event.target===this)this.classList.remove('show')">
<div class="modal">
<div class="modal-header">
<h3>Confirm Deployment</h3>
<button onclick="document.getElementById('modal1').classList.remove('show')" style="background:none;border:none;color:var(--dim);font-size:20px;cursor:pointer">&times;</button>
</div>
<div class="modal-body">
<p>You're about to deploy the Q2 forecast model to all 6 business units. This will replace existing projections and notify all stakeholders.</p>
<div style="margin-top:16px;padding:12px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">
<div style="font-size:12px;color:var(--dim);margin-bottom:4px">Affected entities</div>
<div style="display:flex;gap:6px;flex-wrap:wrap">
<span class="badge badge-blue">NA</span>
<span class="badge badge-purple">EMEA</span>
<span class="badge badge-green">APAC</span>
<span class="badge badge-amber">LatAm</span>
<span class="badge badge-blue">Corporate</span>
<span class="badge badge-purple">M&A</span>
</div>
</div>
</div>
<div class="modal-footer">
<button class="btn btn-ghost" onclick="document.getElementById('modal1').classList.remove('show')">Cancel</button>
<button class="btn btn-primary" onclick="document.getElementById('modal1').classList.remove('show');showToast('success','Deployed','Q2 forecast published to all entities')">Deploy Now</button>
</div>
</div>
</div>

<!-- TOAST CONTAINER -->
<div class="toast-container" id="toasts"></div>


` }} />
    </>
  );
}
