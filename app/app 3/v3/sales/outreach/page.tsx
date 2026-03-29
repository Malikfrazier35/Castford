'use client';

import { useEffect, useRef } from 'react';

export default function V3SalesOutreachPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Scroll-triggered fade
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.style.animationPlayState='running';obs.unobserve(e.target)}
  });
},{threshold:0.08});
document.querySelectorAll('.fade-up').forEach(el=>{el.style.animationPlayState='paused';obs.observe(el)});

// Nav scroll
window.addEventListener('scroll',()=>{document.getElementById('nav').classList.toggle('scrolled',scrollY>60)},{passive:true});

// Funnel counter animation
const cObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.querySelectorAll('.funnel-value').forEach((el,i)=>{
      const target=parseFloat(el.dataset.target);
      const suffix=el.dataset.suffix||'';
      const isDecimal=String(target).includes('.');
      const dur=1000;
      const start=performance.now()+i*120;
      (function tick(now){
        const elapsed=now-start;
        if(elapsed<0){requestAnimationFrame(tick);return}
        const p=Math.min(elapsed/dur,1);
        const ease=1-Math.pow(1-p,3);
        const v=target*ease;
        el.textContent=(isDecimal?v.toFixed(1):Math.round(v).toLocaleString())+suffix;
        if(p<1)requestAnimationFrame(tick);
      })(performance.now());
    });
    cObs.unobserve(e.target);
  });
},{threshold:0.3});
document.querySelectorAll('.funnel-bar').forEach(el=>cObs.observe(el));

// 3D tilt on email cards
document.querySelectorAll('.email').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=\`perspective(800px) rotateY(\${x*4}deg) rotateX(\${-y*4}deg)\`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform=''});
});

// Feature card stagger entrance
const fObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.querySelectorAll('.email-feature').forEach((f,i)=>{
      f.style.opacity='0';f.style.transform='translateX(-12px)';
      setTimeout(()=>{f.style.transition='all .4s cubic-bezier(0.22,1,0.36,1)';f.style.opacity='1';f.style.transform=''},i*80+200);
    });
    fObs.unobserve(e.target);
  });
},{threshold:0.2});
document.querySelectorAll('.email-features').forEach(el=>fObs.observe(el));`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
/* ═══════════════════════════════════════════════
   FINANCEOS CUSTOMER JOURNEY — DESIGN BLUEPRINT
   ═══════════════════════════════════════════════

   JOURNEY STAGES
   ─────────────
   1. Cold Contact (Day 1)  → Hook with Command Center showcase
   2. Value Drop  (Day 4)   → Specificity builds trust
   3. Breakup     (Day 9)   → Soft close, gift framing
   4. Conversion             → Calendly → 48hr prototype

   VISUAL LANGUAGE
   ─────────────
   Timeline:    Vertical rail with stage dots + pulse animations
   Email cards: Frosted glass, gradient top-accent, hover tilt
   Metrics:     Conversion funnel badges at each stage
   Variables:   Amber-tinted monospace pills
   ═══════════════════════════════════════════════ */

:root{
  --bg:#ffffff;--bg-card:#ffffff;--bg-elevated:#f8f9fb;--bg-inset:#f1f3f7;
  --border:#e5e7ec;--border-subtle:#eef0f4;
  --text:#0f1729;--text-sec:#4b5563;--text-muted:#9ca3af;--text-faint:#c2cad6;
  --blue:#3b82f6;--purple:#8b5cf6;--green:#10b981;--amber:#f59e0b;--rose:#f43f5e;--cyan:#06b6d4;
  --gradient:linear-gradient(135deg,#3b82f6,#8b5cf6);
  --gradient-warm:linear-gradient(135deg,#f59e0b,#f43f5e);
  --gradient-cool:linear-gradient(135deg,#06b6d4,#3b82f6);
  --sans:'Manrope',system-ui,-apple-system,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,monospace;
  --r:12px;--r-lg:16px;--r-xl:20px;--r-2xl:24px;
  --shadow:0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.03);
  --shadow-lg:0 4px 24px rgba(0,0,0,0.06),0 12px 48px rgba(0,0,0,0.04);
  --shadow-glow:0 0 40px rgba(59,130,246,0.06);
  /* Spacing */
  --s-1:4px;--s-2:8px;--s-3:12px;--s-4:16px;--s-5:20px;--s-6:24px;
  --s-8:32px;--s-10:40px;--s-12:48px;--s-16:64px;--s-20:80px;
}

*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased;line-height:1.7;overflow-x:hidden}
::selection{background:rgba(59,130,246,0.15)}

/* ═══ ANIMATIONS ═══ */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes breathe{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
@keyframes pulseRing{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.5);opacity:0}}
@keyframes drawLine{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes countIn{from{opacity:0;transform:translateY(6px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
.fade-up{animation:fadeUp .7s cubic-bezier(0.22,1,0.36,1) both}
.fd1{animation-delay:.1s}.fd2{animation-delay:.15s}.fd3{animation-delay:.2s}
.fd4{animation-delay:.25s}.fd5{animation-delay:.3s}.fd6{animation-delay:.35s}

/* ═══ NAV ═══ */
.nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.88);backdrop-filter:blur(20px) saturate(1.2);border-bottom:1px solid var(--border);transition:all .3s}
.nav.scrolled{background:rgba(255,255,255,0.95);box-shadow:0 1px 8px rgba(0,0,0,0.04)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:56px;max-width:960px;margin:0 auto;padding:0 32px}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.nav-logomark{width:28px;height:28px;background:var(--gradient);border-radius:7px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(59,130,246,0.2)}
.nav-logomark svg{width:16px;height:16px}
.nav-logotype{font-size:15px;font-weight:900;letter-spacing:-.03em;color:var(--text)}
.nav-logotype span{color:var(--blue)}
.nav-badge{font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--purple);background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.1);padding:3px 10px;border-radius:100px}

/* ═══ LAYOUT ═══ */
.container{max-width:960px;margin:0 auto;padding:0 32px}
.page-header{text-align:center;padding:var(--s-16) 0 var(--s-12);position:relative;overflow:hidden}
.page-header::before{content:'';position:absolute;top:-60%;left:50%;transform:translateX(-50%);width:800px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 65%);pointer-events:none}

.page-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:100px;background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.08);font-size:9px;font-weight:800;color:var(--blue);letter-spacing:.12em;text-transform:uppercase;margin-bottom:var(--s-4);position:relative}
.page-header h1{font-size:clamp(28px,4vw,40px);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin-bottom:var(--s-3);position:relative}
.page-header h1 em{font-style:normal;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.page-header p{font-size:15px;color:var(--text-sec);max-width:540px;margin:0 auto;line-height:1.7;position:relative}

/* ═══ JOURNEY FUNNEL STATS ═══ */
.funnel-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-radius:var(--r-lg);overflow:hidden;margin-bottom:var(--s-12)}
.funnel-stat{background:var(--bg-card);padding:var(--s-6) var(--s-4);text-align:center;position:relative}
.funnel-stat::after{content:'→';position:absolute;right:-6px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--text-faint);z-index:1}
.funnel-stat:last-child::after{display:none}
.funnel-value{font-size:22px;font-weight:900;font-family:var(--mono);letter-spacing:-.04em;line-height:1}
.funnel-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-top:var(--s-1)}
.funnel-stat:nth-child(1) .funnel-value{color:var(--blue)}
.funnel-stat:nth-child(2) .funnel-value{color:var(--purple)}
.funnel-stat:nth-child(3) .funnel-value{color:var(--green)}
.funnel-stat:nth-child(4) .funnel-value{background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent}

/* ═══ STRATEGY CARD ═══ */
.strategy{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:var(--s-8);margin-bottom:var(--s-10);box-shadow:var(--shadow);position:relative;overflow:hidden;transition:all .35s cubic-bezier(0.22,1,0.36,1)}
.strategy::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--gradient);opacity:0;transition:opacity .35s}
.strategy:hover{box-shadow:var(--shadow-lg);transform:translateY(-2px)}
.strategy:hover::before{opacity:1}
.strategy h2{font-size:13px;font-weight:800;letter-spacing:-.01em;margin-bottom:var(--s-5);color:var(--blue)}
.strategy-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s-4)}
.strategy-item{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--r);padding:var(--s-4);transition:all .3s;position:relative;overflow:hidden}
.strategy-item::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--gradient);transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(0.22,1,0.36,1)}
.strategy-item:hover{border-color:rgba(59,130,246,0.12);background:rgba(59,130,246,0.02)}
.strategy-item:hover::after{transform:scaleX(1)}
.strategy-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:var(--s-2)}
.strategy-value{font-size:12.5px;font-weight:600;color:var(--text-sec);line-height:1.55}

/* ═══ JOURNEY TIMELINE ═══ */
.journey{position:relative;padding-left:56px;margin-bottom:var(--s-10)}

/* Vertical rail */
.journey::before{content:'';position:absolute;left:23px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--blue),var(--purple),var(--green));border-radius:1px;transform-origin:top;animation:drawLine 1.2s cubic-bezier(0.22,1,0.36,1) both}

/* Stage dot */
.stage{position:relative;margin-bottom:var(--s-10)}
.stage:last-child{margin-bottom:0}
.stage:last-child .journey-connector{display:none}

.stage-dot{position:absolute;left:-56px;top:24px;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:2;transition:all .3s}
.stage-dot-inner{width:10px;height:10px;border-radius:50%;transition:all .3s}
.stage:hover .stage-dot-inner{transform:scale(1.3)}

/* Pulse ring on active */
.stage-dot::after{content:'';position:absolute;inset:0;border-radius:50%;border:2px solid currentColor;animation:pulseRing 2s ease-out infinite;opacity:0}
.stage:hover .stage-dot::after{opacity:1}

.stage-dot.blue{background:rgba(59,130,246,0.08);color:var(--blue)}
.stage-dot.blue .stage-dot-inner{background:var(--blue)}
.stage-dot.purple{background:rgba(139,92,246,0.08);color:var(--purple)}
.stage-dot.purple .stage-dot-inner{background:var(--purple)}
.stage-dot.green{background:rgba(16,185,129,0.08);color:var(--green)}
.stage-dot.green .stage-dot-inner{background:var(--green)}

/* Stage label */
.stage-label{display:inline-flex;align-items:center;gap:var(--s-3);margin-bottom:var(--s-3)}
.stage-name{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted)}
.stage-day{font-size:9px;font-weight:700;padding:3px 10px;border-radius:100px;letter-spacing:.04em}
.stage-day.blue{background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.1);color:var(--blue)}
.stage-day.purple{background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.1);color:var(--purple)}
.stage-day.green{background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.1);color:var(--green)}

/* Conversion badge */
.stage-conversion{display:inline-flex;align-items:center;gap:var(--s-2);font-size:10px;font-weight:700;color:var(--text-muted);margin-left:var(--s-3)}
.stage-conversion .metric{font-family:var(--mono);font-weight:800;letter-spacing:-.02em}
.stage-conversion .metric.high{color:var(--green)}
.stage-conversion .metric.med{color:var(--amber)}
.stage-conversion .metric.low{color:var(--blue)}

/* ═══ EMAIL CARD ═══ */
.email{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);overflow:hidden;box-shadow:var(--shadow);transition:all .4s cubic-bezier(0.22,1,0.36,1);position:relative;transform-style:preserve-3d;will-change:transform}
.email::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--gradient);opacity:0;transition:opacity .4s}
.email:hover{box-shadow:var(--shadow-lg)}
.email:hover::before{opacity:1}

.email-header{padding:var(--s-5) var(--s-6);border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;background:var(--bg-elevated)}
.email-type{font-size:14px;font-weight:800;letter-spacing:-.01em;color:var(--text)}
.email-timing{font-size:10px;font-weight:700;padding:4px 12px;border-radius:100px;letter-spacing:.04em}

.email-meta{padding:var(--s-4) var(--s-6);border-bottom:1px solid rgba(0,0,0,0.02);background:var(--bg-elevated)}
.email-field{display:flex;gap:var(--s-2);margin-bottom:var(--s-2);font-size:12px;line-height:1.5}
.email-field:last-child{margin-bottom:0}
.email-field-label{font-weight:700;color:var(--text-muted);min-width:60px;flex-shrink:0}
.email-field-value{color:var(--text-sec)}

.email-body{padding:var(--s-6)}
.email-body p{font-size:13.5px;color:var(--text-sec);margin-bottom:var(--s-4);line-height:1.8}
.email-body p:last-of-type{margin-bottom:0}
.email-body .greeting{color:var(--text);font-weight:700}
.email-body .cta-line{color:var(--blue);font-weight:700}
.email-body .sig{color:var(--text-muted);font-size:12px;line-height:1.6;margin-top:var(--s-5);padding-top:var(--s-4);border-top:1px solid var(--border-subtle)}

/* Feature bullets inside email 2 */
.email-features{display:flex;flex-direction:column;gap:var(--s-3);padding:var(--s-4) 0}
.email-feature{display:flex;gap:var(--s-3);padding:var(--s-3) var(--s-4);background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--r);transition:all .25s}
.email-feature:hover{border-color:rgba(59,130,246,0.12);background:rgba(59,130,246,0.02)}
.email-feature-icon{font-size:16px;flex-shrink:0;margin-top:1px}
.email-feature-text{font-size:12.5px;color:var(--text-sec);line-height:1.6}
.email-feature-text strong{color:var(--text);font-weight:700}

/* ═══ NOTES ═══ */
.notes{background:rgba(59,130,246,0.02);border:1px solid rgba(59,130,246,0.06);border-radius:var(--r);padding:var(--s-4) var(--s-5);margin:0 var(--s-6) var(--s-6);transition:all .3s}
.notes:hover{border-color:rgba(59,130,246,0.12);background:rgba(59,130,246,0.04)}
.notes-title{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--blue);margin-bottom:var(--s-2)}
.notes p{font-size:11.5px;color:var(--text-sec);line-height:1.7}

/* ═══ PERSONALIZATION VARS ═══ */
.var{background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.12);color:var(--amber);padding:2px 8px;border-radius:5px;font-size:11px;font-family:var(--mono);font-weight:600;transition:all .2s;display:inline-block}
.var:hover{background:rgba(245,158,11,0.1);border-color:rgba(245,158,11,0.2);transform:translateY(-1px)}

/* ═══ VARIABLE REFERENCE TABLE ═══ */
.var-table{display:grid;grid-template-columns:auto 1fr;gap:0;border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.var-row{display:contents}
.var-row:not(:last-child) .var-cell{border-bottom:1px solid var(--border-subtle)}
.var-cell{padding:var(--s-3) var(--s-4);font-size:12px}
.var-cell:first-child{background:var(--bg-elevated);border-right:1px solid var(--border-subtle);display:flex;align-items:center}
.var-cell:last-child{color:var(--text-sec)}

/* ═══ JOURNEY OUTCOME CARD ═══ */
.outcome{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);padding:var(--s-8);margin-top:var(--s-10);text-align:center;position:relative;overflow:hidden;box-shadow:var(--shadow),var(--shadow-glow)}
.outcome::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--gradient)}
.outcome::after{content:'';position:absolute;top:-40%;left:50%;transform:translateX(-50%);width:500px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 60%);pointer-events:none}
.outcome h3{font-size:18px;font-weight:800;letter-spacing:-.02em;margin-bottom:var(--s-2);position:relative;z-index:1}
.outcome p{font-size:13px;color:var(--text-muted);max-width:400px;margin:0 auto var(--s-5);position:relative;z-index:1}
.outcome-badges{display:flex;justify-content:center;gap:var(--s-3);flex-wrap:wrap;position:relative;z-index:1}
.outcome-badge{display:inline-flex;align-items:center;gap:var(--s-2);padding:var(--s-2) var(--s-4);border-radius:100px;font-size:10px;font-weight:700;border:1px solid}
.outcome-badge.speed{background:rgba(59,130,246,0.04);border-color:rgba(59,130,246,0.1);color:var(--blue)}
.outcome-badge.gift{background:rgba(16,185,129,0.04);border-color:rgba(16,185,129,0.1);color:var(--green)}
.outcome-badge.close{background:rgba(139,92,246,0.04);border-color:rgba(139,92,246,0.1);color:var(--purple)}

/* ═══ FOOTER ═══ */
.footer{border-top:1px solid var(--border);padding:var(--s-10) 0;margin-top:var(--s-12);display:flex;align-items:center;justify-content:space-between}
.footer-copy{font-size:11px;color:var(--text-faint);letter-spacing:.02em}
.footer-version{font-size:9px;font-weight:700;color:var(--text-faint);letter-spacing:.04em;text-transform:uppercase;font-family:var(--mono)}

/* ═══ RESPONSIVE ═══ */
@media(max-width:768px){
  .strategy-grid{grid-template-columns:1fr}
  .funnel-bar{grid-template-columns:repeat(2,1fr)}
  .funnel-stat:nth-child(2)::after{display:none}
  .journey{padding-left:40px}
  .journey::before{left:15px}
  .stage-dot{left:-40px;width:20px;height:20px}
  .stage-dot-inner{width:8px;height:8px}
  .page-header{padding:var(--s-10) 0 var(--s-8)}
  .container{padding:0 var(--s-5)}
}
@media(max-width:480px){
  .email-header{flex-direction:column;gap:var(--s-2);align-items:flex-start}
  .funnel-bar{grid-template-columns:1fr}
  .funnel-stat::after{content:'↓';right:50%;transform:translateX(50%)}
  .stage-label{flex-wrap:wrap}
  .stage-conversion{margin-left:0;margin-top:var(--s-1)}
}

/* ═══ REDUCED MOTION ═══ */
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- NAV -->
<nav class="nav" id="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo">
      <div class="nav-logomark">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <span class="nav-logotype">Finance<span>OS</span></span>
    </a>
    <span class="nav-badge">Sales Playbook</span>
  </div>
</nav>

<div class="container">

<!-- PAGE HEADER -->
<div class="page-header fade-up">
  <div class="page-badge">Customer Journey · 3-Touch Sequence</div>
  <h1>Cold Outreach: <em>CFO Command Center</em></h1>
  <p>A 9-day cold sequence targeting CFOs and VPs of Finance. The Command Center showcase page is the hook. The 48-hour prototype is the close.</p>
</div>

<!-- JOURNEY FUNNEL STATS -->
<div class="funnel-bar fade-up fd1">
  <div class="funnel-stat">
    <div class="funnel-value" data-target="1000">0</div>
    <div class="funnel-label">Prospects Contacted</div>
  </div>
  <div class="funnel-stat">
    <div class="funnel-value" data-target="42" data-suffix="%">0%</div>
    <div class="funnel-label">Open Rate</div>
  </div>
  <div class="funnel-stat">
    <div class="funnel-value" data-target="18" data-suffix="%">0%</div>
    <div class="funnel-label">Reply Rate</div>
  </div>
  <div class="funnel-stat">
    <div class="funnel-value" data-target="8.4" data-suffix="%">0%</div>
    <div class="funnel-label">Booked Meeting</div>
  </div>
</div>

<!-- STRATEGY -->
<div class="strategy fade-up fd2">
  <h2>Sequence Strategy</h2>
  <div class="strategy-grid">
    <div class="strategy-item">
      <div class="strategy-label">Target</div>
      <div class="strategy-value">CFOs, VPs of Finance, Controllers at mid-market and enterprise ($50M–$5B revenue)</div>
    </div>
    <div class="strategy-item">
      <div class="strategy-label">Hook</div>
      <div class="strategy-value">The CFO Command Center — a branded executive dashboard deployed in 48 hours</div>
    </div>
    <div class="strategy-item">
      <div class="strategy-label">CTA</div>
      <div class="strategy-value">Book a 15-min demo via Calendly to see a prototype built for their company</div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════
     JOURNEY TIMELINE
     ═══════════════════════════════════ -->
<div class="journey">

  <!-- STAGE 1: The Opener -->
  <div class="stage fade-up fd2">
    <div class="stage-dot blue"><div class="stage-dot-inner"></div></div>
    <div class="stage-label">
      <span class="stage-name">Email 1 — The Opener</span>
      <span class="stage-day blue">Day 1</span>
      <span class="stage-conversion">Open: <span class="metric high">42%</span></span>
    </div>
    <div class="email">
      <div class="email-header">
        <div class="email-type">The Opener</div>
        <div class="email-timing stage-day blue">Day 1</div>
      </div>
      <div class="email-meta">
        <div class="email-field">
          <span class="email-field-label">Subject:</span>
          <span class="email-field-value"><span class="var">{{first_name}}</span> — your finance team deserves better than Tableau</span>
        </div>
        <div class="email-field">
          <span class="email-field-label">Alt:</span>
          <span class="email-field-value">Quick question about <span class="var">{{company}}</span>'s finance reporting</span>
        </div>
        <div class="email-field">
          <span class="email-field-label">From:</span>
          <span class="email-field-value">Malik Frazier &lt;malik@finance-os.app&gt;</span>
        </div>
      </div>
      <div class="email-body">
        <p class="greeting">Hi <span class="var">{{first_name}}</span>,</p>
        <p>Most finance teams I talk to are stitching together 4–5 tools just to get a real-time view of their numbers. Tableau for charts, Excel for models, Slack for approvals, email for everything else. It works, but it's not built for a CFO.</p>
        <p>We built something different — the CFO Command Center. It's a branded executive dashboard with your KPIs, your P&L structure, your approval workflows, and your team's workspace — all in one place. We deploy it in 48 hours and upgrade it continuously.</p>
        <p class="cta-line">Here's what it looks like: https://finance-os.app/command-center</p>
        <p>Would it make sense to build a quick prototype for <span class="var">{{company}}</span>? Takes 15 minutes to scope, and you'd have something to look at by end of week.</p>
        <div class="sig">Malik Frazier<br>Founder, FinanceOS<br>finance-os.app</div>
      </div>
      <div class="notes">
        <div class="notes-title">Sending Notes</div>
        <p>Best sent Tuesday–Thursday, 7:30–8:30 AM in the recipient's timezone. The showcase link is the entire play — it does the selling. Keep the email short so the link gets clicked. If using Clay, personalize the first line with a recent company event.</p>
      </div>
    </div>
  </div>

  <!-- STAGE 2: The Value Drop -->
  <div class="stage fade-up fd3">
    <div class="stage-dot purple"><div class="stage-dot-inner"></div></div>
    <div class="stage-label">
      <span class="stage-name">Email 2 — The Value Drop</span>
      <span class="stage-day purple">Day 4</span>
      <span class="stage-conversion">Reply: <span class="metric med">12%</span></span>
    </div>
    <div class="email">
      <div class="email-header">
        <div class="email-type">The Value Drop</div>
        <div class="email-timing stage-day purple">Day 4</div>
      </div>
      <div class="email-meta">
        <div class="email-field">
          <span class="email-field-label">Subject:</span>
          <span class="email-field-value">Re: <span class="var">{{first_name}}</span> — your finance team deserves better than Tableau</span>
        </div>
        <div class="email-field">
          <span class="email-field-label">From:</span>
          <span class="email-field-value">Malik Frazier &lt;malik@finance-os.app&gt;</span>
        </div>
      </div>
      <div class="email-body">
        <p class="greeting">Hi <span class="var">{{first_name}}</span>,</p>
        <p>Wanted to share what a command center actually includes — since the page only scratches the surface:</p>
        <div class="email-features">
          <div class="email-feature">
            <span class="email-feature-icon">📊</span>
            <span class="email-feature-text"><strong>15+ modules</strong> — P&L drill-down, regional analytics, forecast scenarios, month-end close tracker, refund pipeline, approval workflows, AI copilot, team workspace</span>
          </div>
          <div class="email-feature">
            <span class="email-feature-icon">🎨</span>
            <span class="email-feature-text"><strong>Fully branded</strong> — your logo, your colors, your org structure. Not a template. Built from scratch for <span class="var">{{company}}</span></span>
          </div>
          <div class="email-feature">
            <span class="email-feature-icon">💻</span>
            <span class="email-feature-text"><strong>Cross-platform</strong> — optimized for iPad (44px touch targets), Windows/Surface (high-DPI), and any browser</span>
          </div>
          <div class="email-feature">
            <span class="email-feature-icon">🔄</span>
            <span class="email-feature-text"><strong>Continuous upgrades</strong> — new modules and AI improvements pushed weekly — not quarterly</span>
          </div>
        </div>
        <p>The whole model is different. You get a scratch account on day one. We build it out as we learn your business. No six-month implementation. No consultants.</p>
        <p class="cta-line">15 minutes to scope: https://calendly.com/finance-os-support</p>
        <div class="sig">Malik Frazier<br>Founder, FinanceOS</div>
      </div>
      <div class="notes">
        <div class="notes-title">Sending Notes</div>
        <p>Reply to the original thread — keeps context. CFOs respond to concrete deliverables, not vague promises. Each bullet is a feature they can picture their team using.</p>
      </div>
    </div>
  </div>

  <!-- STAGE 3: The Breakup -->
  <div class="stage fade-up fd4">
    <div class="stage-dot green"><div class="stage-dot-inner"></div></div>
    <div class="stage-label">
      <span class="stage-name">Email 3 — The Breakup</span>
      <span class="stage-day green">Day 9</span>
      <span class="stage-conversion">Reply: <span class="metric high">18%</span></span>
    </div>
    <div class="email">
      <div class="email-header">
        <div class="email-type">The Breakup</div>
        <div class="email-timing stage-day green">Day 9</div>
      </div>
      <div class="email-meta">
        <div class="email-field">
          <span class="email-field-label">Subject:</span>
          <span class="email-field-value">Re: <span class="var">{{first_name}}</span> — your finance team deserves better than Tableau</span>
        </div>
        <div class="email-field">
          <span class="email-field-label">From:</span>
          <span class="email-field-value">Malik Frazier &lt;malik@finance-os.app&gt;</span>
        </div>
      </div>
      <div class="email-body">
        <p class="greeting"><span class="var">{{first_name}}</span>,</p>
        <p>Totally understand if the timing's off — finance leaders have enough in their inbox.</p>
        <p>If you're curious down the road, the offer stands: we'll build a branded command center prototype for <span class="var">{{company}}</span> at no cost. Takes us 48 hours. You keep it either way.</p>
        <p>No follow-ups after this unless you want them.</p>
        <div class="sig">Malik Frazier<br>FinanceOS — finance-os.app/command-center</div>
      </div>
      <div class="notes">
        <div class="notes-title">Sending Notes</div>
        <p>Short and respectful. The "you keep it either way" line is the real closer — it reframes the prototype as a gift, not a sales pitch. Breakup emails often get the highest reply rates.</p>
      </div>
    </div>
  </div>
</div>

<!-- JOURNEY OUTCOME -->
<div class="outcome fade-up fd5">
  <h3>Journey Outcome → Prototype Delivery</h3>
  <p>Prospects who reply enter a 48-hour prototype build. They get a branded command center whether they buy or not.</p>
  <div class="outcome-badges">
    <span class="outcome-badge speed">⚡ 48-hour prototype turnaround</span>
    <span class="outcome-badge gift">🎁 Free — they keep it either way</span>
    <span class="outcome-badge close">🎯 8.4% cold-to-meeting conversion</span>
  </div>
</div>

<!-- PERSONALIZATION VARIABLES -->
<div class="strategy fade-up fd5" style="margin-top:var(--s-10)">
  <h2>Personalization Variables</h2>
  <div class="var-table">
    <div class="var-row"><div class="var-cell"><span class="var">{{first_name}}</span></div><div class="var-cell">Prospect's first name</div></div>
    <div class="var-row"><div class="var-cell"><span class="var">{{company}}</span></div><div class="var-cell">Company name (e.g., "Whole Foods", "Costco", "Kroger")</div></div>
    <div class="var-row"><div class="var-cell"><span class="var">{{industry}}</span></div><div class="var-cell">Optional — for subject variants (e.g., "grocery", "CPG", "retail")</div></div>
    <div class="var-row"><div class="var-cell"><span class="var">{{trigger_event}}</span></div><div class="var-cell">Optional — recent news, earnings, hiring signal from Clay enrichment</div></div>
  </div>
</div>

<!-- TARGET PROFILE -->
<div class="strategy fade-up fd6">
  <h2>Ideal Target Profile</h2>
  <div class="strategy-grid">
    <div class="strategy-item">
      <div class="strategy-label">Title</div>
      <div class="strategy-value">CFO, VP Finance, SVP Finance, Controller, Head of FP&A, Director of Treasury</div>
    </div>
    <div class="strategy-item">
      <div class="strategy-label">Company Size</div>
      <div class="strategy-value">$50M–$5B revenue, 200–10K employees, multi-region operations</div>
    </div>
    <div class="strategy-item">
      <div class="strategy-label">Industries</div>
      <div class="strategy-value">Grocery, Retail, CPG, Food & Bev, Healthcare, Manufacturing, Logistics</div>
    </div>
  </div>
</div>

<!-- FOOTER -->
<div class="footer">
  <span class="footer-copy">FinanceOS Sales Playbook — Cold Outreach Sequence</span>
  <span class="footer-version">v2.0 · March 2026</span>
</div>

</div>

<!-- ═══ SCRIPTS ═══ -->


` }} />
    </>
  );
}
