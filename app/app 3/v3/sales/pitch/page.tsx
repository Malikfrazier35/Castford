'use client';

import { useEffect, useRef } from 'react';

export default function V3SalesPitchPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Build nav dots
  const nav = document.getElementById('slideNav');
  for (let i = 1; i <= 8; i++) {
    const dot = document.createElement('div');
    dot.className = 'slide-nav-dot' + (i===1?' active':'');
    dot.dataset.slide = 's'+i;
    dot.onclick = () => document.getElementById('s'+i).scrollIntoView({behavior:'smooth'});
    nav.appendChild(dot);
  }

  // Track scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.slide-nav-dot').forEach(d => d.classList.toggle('active', d.dataset.slide === e.target.id));
      }
    });
  }, {threshold: 0.5});
  document.querySelectorAll('.slide').forEach(s => observer.observe(s));`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#0B1121;--surface:#0F172A;--card:#1E293B;--elevated:#263548;--border:rgba(148,163,184,0.08);--t1:#F1F5F9;--t2:#94A3B8;--t3:#64748B;--cyan:#06B6D4;--cyan-muted:rgba(6,182,212,0.1);--cyan-glow:rgba(6,182,212,0.15);--green:#10B981;--green-muted:rgba(16,185,129,0.1);--amber:#F59E0B;--amber-muted:rgba(245,158,11,0.1);--red:#EF4444;--purple:#8B5CF6;--purple-muted:rgba(139,92,246,0.1);--radius:12px;--glass:0 1px 2px rgba(0,0,0,0.2),0 4px 16px rgba(0,0,0,0.1),inset 0 1px 0 rgba(255,255,255,0.03);--font:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;--mono:'JetBrains Mono','SF Mono',monospace;--ease:cubic-bezier(0.16,1,0.3,1)}
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
  html{scroll-behavior:smooth}
  body{font-family:var(--font);background:var(--bg);color:var(--t1);overflow-x:hidden;overflow-y:auto;scroll-snap-type:y proximity;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}

  /* Slide System */
  .slide{min-height:100vh;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 40px;position:relative;scroll-snap-align:start;scroll-snap-stop:normal;overflow:hidden;will-change:transform}
  .slide::before{content:'';position:absolute;top:-200px;right:-200px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,var(--cyan-glow),transparent 70%);opacity:0.15;pointer-events:none}

  .slide-num{position:absolute;top:40px;right:40px;font-family:var(--mono);font-size:12px;color:var(--t3);font-weight:500}
  .slide-logo{position:absolute;top:36px;left:40px;display:flex;align-items:center;gap:10px}
  .slide-logo svg{width:28px;height:28px}
  .slide-logo-text{font-weight:700;font-size:15px;letter-spacing:-0.2px}

  .container{max-width:1000px;width:100%;position:relative;z-index:1}

  /* Typography */
  .hero-mega{font-size:clamp(48px,6vw,72px);font-weight:800;letter-spacing:-1.5px;line-height:1.05;margin-bottom:20px}
  .hero-mega .accent{background:linear-gradient(135deg,var(--cyan),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .slide-h1{font-size:clamp(32px,4vw,48px);font-weight:700;letter-spacing:-1px;line-height:1.15;margin-bottom:16px}
  .slide-h2{font-size:20px;font-weight:700;letter-spacing:-0.5px;margin-bottom:8px}
  .slide-p{font-size:18px;color:var(--t2);line-height:1.7;max-width:640px}
  .slide-p-sm{font-size:14px;color:var(--t3);line-height:1.6;max-width:560px}
  .label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--cyan);margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .label::before{content:'';width:20px;height:2px;background:var(--cyan);border-radius:1px}

  /* Glass Card */
  .glass{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--glass);position:relative;overflow:hidden}
  .glass::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)}

  /* Buttons */
  .btn{padding:14px 32px;border-radius:12px;border:none;font-family:var(--font);font-size:15px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all 0.25s ease}
  .btn-cyan{background:var(--cyan);color:white;box-shadow:0 2px 12px var(--cyan-glow)}
  .btn-cyan:hover{filter:brightness(1.05);box-shadow:0 4px 16px var(--cyan-glow)}
  .btn-ghost{background:transparent;color:var(--t2);border:1px solid var(--border)}
  .btn-ghost:hover{border-color:var(--cyan);color:var(--t1)}

  /* ═══ SLIDE 1: HERO ═══ */
  .hero-badges{display:flex;gap:10px;margin:28px 0}
  .hero-badge{padding:8px 16px;border-radius:8px;background:var(--card);border:1px solid var(--border);font-size:12px;font-weight:600;color:var(--t2);display:flex;align-items:center;gap:6px}
  .hero-badge svg{width:14px;height:14px;color:var(--cyan)}
  .hero-ctas{display:flex;gap:12px;margin-top:32px}

  /* ═══ SLIDE 2: PROBLEM ═══ */
  .problem-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:32px}
  .problem-card{padding:28px;text-align:center}
  .problem-icon{width:56px;height:56px;border-radius:14px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:24px}
  .problem-stat{font-size:36px;font-weight:700;font-family:var(--mono);letter-spacing:-1px;margin-bottom:4px}
  .problem-label{font-size:13px;color:var(--t2);font-weight:500}

  /* ═══ SLIDE 3: SOLUTION ═══ */
  .solution-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:32px}
  .solution-card{padding:28px;transition:all 0.25s ease}
  .solution-card:hover{border-color:rgba(6,182,212,0.2)}
  .solution-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
  .solution-icon svg{width:20px;height:20px}
  .solution-title{font-size:16px;font-weight:700;margin-bottom:6px;letter-spacing:-0.3px}
  .solution-desc{font-size:13px;color:var(--t3);line-height:1.6}

  /* ═══ SLIDE 4: OUTCOMES ═══ */
  .outcome-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:32px}
  .outcome-card{padding:28px;text-align:center;transition:all 0.25s ease}
  .outcome-card:hover{border-color:rgba(6,182,212,0.2)}
  .outcome-metric{font-size:32px;font-weight:700;font-family:var(--mono);letter-spacing:-1px;margin-bottom:4px}
  .outcome-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--t3);margin-bottom:10px}
  .outcome-desc{font-size:13px;color:var(--t2);line-height:1.5}

  /* ═══ SLIDE 5: HOW IT WORKS ═══ */
  .steps-timeline{display:flex;gap:0;margin-top:40px;position:relative}
  .steps-timeline::before{content:'';position:absolute;top:28px;left:28px;right:28px;height:2px;background:var(--border)}
  .timeline-step{flex:1;text-align:center;position:relative}
  .step-num{width:56px;height:56px;border-radius:50%;background:var(--card);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:20px;font-weight:800;font-family:var(--mono);color:var(--cyan);position:relative;z-index:1}
  .step-title{font-size:15px;font-weight:700;margin-bottom:4px}
  .step-desc{font-size:12px;color:var(--t3);line-height:1.5;max-width:180px;margin:0 auto}

  /* ═══ SLIDE 6: SECURITY ═══ */
  .security-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:32px}
  .security-card{padding:24px;text-align:center}
  .security-icon{width:48px;height:48px;border-radius:12px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center}
  .security-icon svg{width:22px;height:22px}
  .security-title{font-size:14px;font-weight:700;margin-bottom:4px}
  .security-desc{font-size:12px;color:var(--t3);line-height:1.5}

  /* ═══ SLIDE 7: PRICING ═══ */
  .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:32px;align-items:start}
  .pricing-card{padding:32px;transition:all 0.25s ease}
  .pricing-card:hover{transform:translateY(-3px)}
  .pricing-card.featured{border-color:rgba(6,182,212,0.25);box-shadow:var(--glass),0 0 40px var(--cyan-glow)}
  .pricing-tier{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--t3);margin-bottom:8px}
  .pricing-price{font-size:40px;font-weight:900;font-family:var(--mono);letter-spacing:-2px;margin-bottom:2px}
  .pricing-price span{font-size:16px;font-weight:500;color:var(--t3);letter-spacing:0}
  .pricing-desc{font-size:13px;color:var(--t3);margin-bottom:20px}
  .pricing-features{list-style:none;margin-bottom:24px}
  .pricing-features li{padding:8px 0;font-size:13px;color:var(--t2);display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border)}
  .pricing-features li:last-child{border:none}
  .pricing-features li svg{width:14px;height:14px;color:var(--cyan);flex-shrink:0}
  .popular-tag{position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--cyan);color:white;font-size:10px;font-weight:700;padding:4px 14px;border-radius:0 0 8px 8px;text-transform:uppercase;letter-spacing:0.06em}

  /* ═══ SLIDE 8: CTA ═══ */
  .cta-card{padding:60px;text-align:center;background:linear-gradient(135deg,rgba(6,182,212,0.06),rgba(139,92,246,0.04));border-color:rgba(6,182,212,0.15)}
  .cta-logos{display:flex;justify-content:center;gap:24px;margin-top:32px;opacity:0.5}
  .cta-logo{font-size:14px;font-weight:700;color:var(--t3);letter-spacing:0.5px}

  /* Scroll indicator */
  .scroll-hint{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--t3);font-size:11px;font-weight:500;animation:bounce 2s ease-in-out infinite}
  @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
  .scroll-hint svg{width:16px;height:16px}

  /* Nav dots */
  .slide-nav{position:fixed;right:20px;top:50%;transform:translateY(-50%);z-index:100;display:flex;flex-direction:column;gap:8px}
  .slide-nav-dot{width:8px;height:8px;border-radius:50%;background:var(--elevated);border:1px solid var(--border);cursor:pointer;transition:all 0.25s ease}
  .slide-nav-dot:hover{background:var(--cyan-muted);border-color:var(--cyan)}
  .slide-nav-dot.active{background:var(--cyan);border-color:var(--cyan);height:24px;border-radius:4px}

  @media(max-width:900px){.problem-grid,.solution-grid,.outcome-grid,.pricing-grid,.security-grid{grid-template-columns:1fr}.steps-timeline{flex-direction:column;gap:20px}.steps-timeline::before{display:none}}
  @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- Side nav -->
<div class="slide-nav" id="slideNav"></div>

<!-- ═══ SLIDE 1: HERO ═══ -->
<div class="slide" id="s1">
  <div class="slide-logo"><svg viewBox="0 0 512 512"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g1)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg><span class="slide-logo-text">Vaultline</span></div>
  <div class="slide-num">01 / 08</div>
  <div class="container">
    <div class="label">Treasury Management Platform</div>
    <div class="hero-mega">Your cash,<br><span class="accent">crystal clear.</span></div>
    <p class="slide-p">Vaultline gives finance teams real-time cash visibility, AI-powered forecasting, and automated reconciliation — all in one platform built for the modern CFO.</p>
    <div class="hero-badges">
      <div class="hero-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> SOC 2 Type II</div>
      <div class="hero-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> 256-bit AES</div>
      <div class="hero-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 99.99% Uptime</div>
    </div>
    <div class="hero-ctas">
      <button class="btn btn-cyan">Get Started <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
      <button class="btn btn-ghost">See Demo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>
    </div>
  </div>
  <div class="scroll-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg> Scroll</div>
</div>

<!-- ═══ SLIDE 2: THE PROBLEM ═══ -->
<div class="slide" id="s2">
  <div class="slide-logo"><svg viewBox="0 0 512 512"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g2)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg><span class="slide-logo-text">Vaultline</span></div>
  <div class="slide-num">02 / 08</div>
  <div class="container">
    <div class="label">The Problem</div>
    <div class="slide-h1">Finance teams are flying blind.</div>
    <p class="slide-p">Mid-market companies manage $10M–$500M across multiple banks, entities, and currencies — using spreadsheets. The result?</p>
    <div class="problem-grid">
      <div class="glass problem-card"><div class="problem-icon" style="background:var(--amber-muted);color:var(--amber);">&#9201;</div><div class="problem-stat" style="color:var(--amber)">6+ hrs</div><div class="problem-label">Spent on manual reconciliation daily</div></div>
      <div class="glass problem-card"><div class="problem-icon" style="background:var(--purple-muted);color:var(--purple);">&#128200;</div><div class="problem-stat" style="color:var(--purple)">72%</div><div class="problem-label">Of CFOs don't trust their cash forecasts</div></div>
      <div class="glass problem-card"><div class="problem-icon" style="background:var(--cyan-muted);color:var(--cyan);">&#128176;</div><div class="problem-stat" style="color:var(--cyan)">$2.8M</div><div class="problem-label">Average idle cash sitting unoptimized</div></div>
    </div>
  </div>
</div>

<!-- ═══ SLIDE 3: SOLUTION ═══ -->
<div class="slide" id="s3">
  <div class="slide-logo"><svg viewBox="0 0 512 512"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g3)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg><span class="slide-logo-text">Vaultline</span></div>
  <div class="slide-num">03 / 08</div>
  <div class="container">
    <div class="label">The Solution</div>
    <div class="slide-h1">One platform for<br>complete treasury control.</div>
    <p class="slide-p-sm">Vaultline connects to your banks, automates reconciliation, and delivers forecasts your board can trust.</p>
    <div class="solution-grid">
      <div class="glass solution-card"><div class="solution-icon" style="background:var(--cyan-muted);color:var(--cyan);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="solution-title">Real-Time Cash Visibility</div><div class="solution-desc">See every dollar across every account, entity, and currency — updated in real-time via 12,000+ bank connections.</div></div>
      <div class="glass solution-card"><div class="solution-icon" style="background:var(--purple-muted);color:var(--purple);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div class="solution-title">AI-Powered Forecasting</div><div class="solution-desc">Machine learning models trained on your data deliver 94.7% accuracy on 30/60/90-day cash flow projections.</div></div>
      <div class="glass solution-card"><div class="solution-icon" style="background:var(--green-muted);color:var(--green);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="solution-title">Automated Reconciliation</div><div class="solution-desc">Reduce 6 hours of manual matching to 30 seconds. AI matches transactions across banks and ERPs automatically.</div></div>
      <div class="glass solution-card"><div class="solution-icon" style="background:var(--amber-muted);color:var(--amber);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="solution-title">Enterprise Security</div><div class="solution-desc">SOC 2 Type II certified, 256-bit AES encryption, role-based access, complete audit trail for every action.</div></div>
    </div>
  </div>
</div>

<!-- ═══ SLIDE 4: OUTCOMES ═══ -->
<div class="slide" id="s4">
  <div class="slide-logo"><svg viewBox="0 0 512 512"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g4)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg><span class="slide-logo-text">Vaultline</span></div>
  <div class="slide-num">04 / 08</div>
  <div class="container">
    <div class="label">Measurable Outcomes</div>
    <div class="slide-h1">Results that move the needle.</div>
    <div class="outcome-grid">
      <div class="glass outcome-card"><div class="outcome-metric" style="color:var(--cyan)">6h→30s</div><div class="outcome-label">Reconciliation</div><div class="outcome-desc">Eliminate manual matching entirely</div></div>
      <div class="glass outcome-card"><div class="outcome-metric" style="color:var(--purple)">94.7%</div><div class="outcome-label">Forecast Accuracy</div><div class="outcome-desc">Projections your board can trust</div></div>
      <div class="glass outcome-card"><div class="outcome-metric" style="color:var(--green)">$2.8M</div><div class="outcome-label">Idle Cash Found</div><div class="outcome-desc">Automatically identified for reallocation</div></div>
      <div class="glass outcome-card"><div class="outcome-metric" style="color:var(--amber)">&lt;48hr</div><div class="outcome-label">Time to Live</div><div class="outcome-desc">From signup to full deployment</div></div>
    </div>
  </div>
</div>

<!-- ═══ SLIDE 5: HOW IT WORKS ═══ -->
<div class="slide" id="s5">
  <div class="slide-logo"><svg viewBox="0 0 512 512"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g5)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg><span class="slide-logo-text">Vaultline</span></div>
  <div class="slide-num">05 / 08</div>
  <div class="container">
    <div class="label">How It Works</div>
    <div class="slide-h1">Live in under 48 hours.</div>
    <p class="slide-p-sm">No implementation consultants. No 6-month rollouts. Connect, configure, go.</p>
    <div class="steps-timeline">
      <div class="timeline-step"><div class="step-num">1</div><div class="step-title">Connect Banks</div><div class="step-desc">Link accounts via Plaid. 12,000+ institutions supported.</div></div>
      <div class="timeline-step"><div class="step-num">2</div><div class="step-title">Sync Your ERP</div><div class="step-desc">NetSuite, QuickBooks, Xero, Sage — one-click integrations.</div></div>
      <div class="timeline-step"><div class="step-num">3</div><div class="step-title">Auto-Configure</div><div class="step-desc">AI maps your accounts, categories, and cash flow patterns.</div></div>
      <div class="timeline-step"><div class="step-num">4</div><div class="step-title">Go Live</div><div class="step-desc">Real-time dashboard, forecasts, and alerts — all working.</div></div>
    </div>
  </div>
</div>

<!-- ═══ SLIDE 6: SECURITY ═══ -->
<div class="slide" id="s6">
  <div class="slide-logo"><svg viewBox="0 0 512 512"><defs><linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g6)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg><span class="slide-logo-text">Vaultline</span></div>
  <div class="slide-num">06 / 08</div>
  <div class="container">
    <div class="label">Enterprise Security</div>
    <div class="slide-h1">Built for finance-grade trust.</div>
    <p class="slide-p-sm">Security isn't a feature — it's the foundation everything else is built on.</p>
    <div class="security-grid">
      <div class="glass security-card"><div class="security-icon" style="background:var(--cyan-muted);color:var(--cyan);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="security-title">SOC 2 Type II</div><div class="security-desc">Independently audited security controls, verified annually</div></div>
      <div class="glass security-card"><div class="security-icon" style="background:var(--purple-muted);color:var(--purple);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div class="security-title">End-to-End Encryption</div><div class="security-desc">256-bit AES at rest, TLS 1.3 in transit. Zero plain-text storage.</div></div>
      <div class="glass security-card"><div class="security-icon" style="background:var(--green-muted);color:var(--green);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div class="security-title">Role-Based Access</div><div class="security-desc">Granular permissions with SSO, MFA, and complete audit trails</div></div>
      <div class="glass security-card"><div class="security-icon" style="background:var(--amber-muted);color:var(--amber);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="security-title">99.99% Uptime SLA</div><div class="security-desc">Multi-region infrastructure with automatic failover</div></div>
      <div class="glass security-card"><div class="security-icon" style="background:var(--cyan-muted);color:var(--cyan);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div class="security-title">Complete Audit Trail</div><div class="security-desc">Every action logged, timestamped, and exportable for compliance</div></div>
      <div class="glass security-card"><div class="security-icon" style="background:var(--purple-muted);color:var(--purple);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><div class="security-title">API Security</div><div class="security-desc">OAuth 2.0, rate limiting, IP whitelisting, and key rotation</div></div>
    </div>
  </div>
</div>

<!-- ═══ SLIDE 7: PRICING ═══ -->
<div class="slide" id="s7">
  <div class="slide-logo"><svg viewBox="0 0 512 512"><defs><linearGradient id="g7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g7)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg><span class="slide-logo-text">Vaultline</span></div>
  <div class="slide-num">07 / 08</div>
  <div class="container">
    <div class="label">Pricing</div>
    <div class="slide-h1">Plans that scale with you.</div>
    <p class="slide-p-sm">Start free for 14 days. No credit card required.</p>
    <div class="pricing-grid">
      <div class="glass pricing-card">
        <div class="pricing-tier">Starter</div>
        <div class="pricing-price">$499<span>/mo</span></div>
        <div class="pricing-desc">For growing companies with 1–3 bank accounts</div>
        <ul class="pricing-features">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Up to 3 bank connections</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Cash position dashboard</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> 30-day forecasting</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Basic reconciliation</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> 5 team members</li>
        </ul>
        <button class="btn btn-ghost" style="width:100%;justify-content:center;">Get Started</button>
      </div>
      <div class="glass pricing-card featured" style="position:relative">
        <div class="popular-tag">Most Popular</div>
        <div class="pricing-tier" style="color:var(--cyan)">Growth</div>
        <div class="pricing-price" style="color:var(--cyan)">$1,299<span>/mo</span></div>
        <div class="pricing-desc">For mid-market companies scaling treasury operations</div>
        <ul class="pricing-features">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited bank connections</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> AI-powered forecasting</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Auto reconciliation</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Multi-entity support</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> API access + webhooks</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> 25 team members</li>
        </ul>
        <button class="btn btn-cyan" style="width:100%;justify-content:center;">Get Started</button>
      </div>
      <div class="glass pricing-card">
        <div class="pricing-tier">Enterprise</div>
        <div class="pricing-price">$2,499<span>/mo</span></div>
        <div class="pricing-desc">For large organizations with complex treasury needs</div>
        <ul class="pricing-features">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Everything in Growth</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> SSO / SAML</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Custom integrations</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Dedicated CSM</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> 99.99% SLA</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited members</li>
        </ul>
        <button class="btn btn-ghost" style="width:100%;justify-content:center;">Contact Sales</button>
      </div>
    </div>
  </div>
</div>

<!-- ═══ SLIDE 8: CTA ═══ -->
<div class="slide" id="s8">
  <div class="slide-logo"><svg viewBox="0 0 512 512"><defs><linearGradient id="g8" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g8)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg><span class="slide-logo-text">Vaultline</span></div>
  <div class="slide-num">08 / 08</div>
  <div class="container">
    <div class="glass cta-card">
      <div class="label" style="justify-content:center">Ready to get started?</div>
      <div class="slide-h1" style="text-align:center">Take control of your<br>treasury today.</div>
      <p class="slide-p" style="text-align:center;margin:0 auto 32px;">30-day money-back guarantee. Live in under 48 hours.</p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button class="btn btn-cyan">Get Started <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
        <button class="btn btn-ghost">Schedule Demo</button>
      </div>
      <div class="cta-logos">
        <span class="cta-logo">vaultline.app</span>
        <span class="cta-logo">&middot;</span>
        <span class="cta-logo">hello@vaultline.app</span>
      </div>
    </div>
  </div>
</div>


` }} />
    </>
  );
}
