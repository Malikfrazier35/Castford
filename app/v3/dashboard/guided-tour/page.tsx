'use client';

import { useEffect, useRef } from 'react';

export default function V3DashboardGuidedTourPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const acts = document.querySelectorAll('.act');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });
    acts.forEach(act => observer.observe(act));`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #08080a;
    --surface: #111114;
    --surface2: #161619;
    --surface3: #1e1e22;
    --border: #1e1e22;
    --borderHover: #2a2a30;
    --borderGold: rgba(201,168,76,0.15);
    --text: #ede8df;
    --text2: #9e968a;
    --text3: #5e574e;
    --gold: #c9a84c;
    --goldLight: #dcc070;
    --goldDim: rgba(201,168,76,0.06);
    --goldMid: rgba(201,168,76,0.12);
    --emerald: #2d9b6e;
    --emeraldText: #4fd9a0;
    --serif: 'Playfair Display', 'Georgia', serif;
    --sans: 'Manrope', -apple-system, sans-serif;
    --mono: 'JetBrains Mono', 'SF Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* Grain overlay */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* ─── HERO ─── */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 24px;
    overflow: hidden;
  }

  /* Ambient glow */
  .hero::before {
    content: '';
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 40%, transparent 70%);
    pointer-events: none;
  }

  .hero::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(to top, var(--bg), transparent);
    pointer-events: none;
  }

  /* Top badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border: 1px solid var(--borderGold);
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    background: var(--goldDim);
    margin-bottom: 40px;
    animation: fadeUp 1s ease 0.2s both;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: pulse 2s ease-in-out infinite;
  }

  /* Logo mark */
  .logo-mark {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--gold), var(--goldLight));
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    box-shadow: 0 8px 32px rgba(201,168,76,0.15), 0 0 0 1px rgba(201,168,76,0.1);
    animation: fadeUp 1s ease 0.3s both;
  }

  .logo-mark svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: var(--bg);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .hero-title {
    font-family: var(--serif);
    font-size: clamp(40px, 7vw, 80px);
    font-weight: 400;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 12px;
    animation: fadeUp 1s ease 0.5s both;
  }

  .hero-title em {
    font-style: italic;
    color: var(--gold);
  }

  .hero-subtitle {
    font-family: var(--serif);
    font-size: clamp(18px, 2.5vw, 24px);
    font-weight: 400;
    font-style: italic;
    color: var(--text2);
    margin-bottom: 48px;
    animation: fadeUp 1s ease 0.7s both;
  }

  .hero-line {
    width: 1px;
    height: 80px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    margin-bottom: 20px;
    animation: fadeUp 1s ease 0.9s both;
  }

  .scroll-hint {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text3);
    animation: fadeUp 1s ease 1s both;
  }

  /* ─── ACTS SECTION ─── */
  .acts {
    max-width: 900px;
    margin: 0 auto;
    padding: 80px 24px 60px;
    position: relative;
  }

  /* Vertical timeline line */
  .timeline {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border) 10%, var(--border) 90%, transparent);
  }

  @media (max-width: 768px) {
    .timeline { left: 32px; }
  }

  .section-label {
    text-align: center;
    margin-bottom: 80px;
  }

  .section-label span {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text3);
    padding: 0 20px;
    background: var(--bg);
    position: relative;
  }

  /* ACT CARD */
  .act {
    position: relative;
    margin-bottom: 100px;
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .act.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Timeline node */
  .act-node {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid var(--gold);
    background: var(--bg);
    z-index: 2;
  }

  .act-node::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 50%;
    background: var(--gold);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .act.visible .act-node::after { opacity: 1; }

  @media (max-width: 768px) {
    .act-node { left: 32px; }
  }

  .act-content {
    width: 42%;
    padding: 32px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    position: relative;
    transition: border-color 0.4s ease, box-shadow 0.4s ease;
  }

  .act-content:hover {
    border-color: var(--borderHover);
    box-shadow: 0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,168,76,0.05);
  }

  /* Marble overlay on cards */
  .act-content::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.03) 0%, transparent 60%);
    pointer-events: none;
  }

  .act:nth-child(odd) .act-content { margin-left: 58%; }
  .act:nth-child(even) .act-content { margin-right: 58%; margin-left: 0; }

  @media (max-width: 768px) {
    .act-content { width: calc(100% - 60px); margin-left: 60px !important; margin-right: 0 !important; }
  }

  .act-number {
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .act-number::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--borderGold), transparent);
  }

  .act-title {
    font-family: var(--serif);
    font-size: 28px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 16px;
    line-height: 1.2;
  }

  .act-desc {
    font-size: 15px;
    line-height: 1.7;
    color: var(--text2);
  }

  .act-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 20px;
  }

  .act-tag {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.05em;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid var(--border);
    color: var(--text3);
    background: var(--surface2);
  }

  .act-tag.gold {
    border-color: var(--borderGold);
    color: var(--gold);
    background: var(--goldDim);
  }

  /* ─── DURATION STRIP ─── */
  .duration-strip {
    max-width: 600px;
    margin: 0 auto 80px;
    padding: 0 24px;
    text-align: center;
  }

  .duration-bar {
    display: flex;
    height: 4px;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 16px;
    background: var(--surface2);
  }

  .dur-seg {
    height: 100%;
    transition: width 1s ease;
  }

  .dur-labels {
    display: flex;
    justify-content: space-between;
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--text3);
  }

  /* ─── QUOTE BLOCK ─── */
  .quote-section {
    max-width: 700px;
    margin: 0 auto 80px;
    padding: 0 24px;
    text-align: center;
  }

  .quote-mark {
    font-family: var(--serif);
    font-size: 60px;
    line-height: 1;
    color: var(--gold);
    opacity: 0.3;
    margin-bottom: -10px;
  }

  .quote-text {
    font-family: var(--serif);
    font-size: clamp(20px, 3vw, 28px);
    font-style: italic;
    font-weight: 400;
    line-height: 1.5;
    color: var(--text);
    margin-bottom: 20px;
  }

  .quote-attr {
    font-size: 13px;
    color: var(--text3);
    letter-spacing: 0.03em;
  }

  /* ─── CTA SECTION ─── */
  .cta-section {
    text-align: center;
    padding: 60px 24px 120px;
    position: relative;
  }

  .cta-section::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .cta-overline {
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 20px;
  }

  .cta-heading {
    font-family: var(--serif);
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 400;
    color: var(--text);
    margin-bottom: 12px;
    line-height: 1.15;
  }

  .cta-heading em {
    font-style: italic;
    color: var(--gold);
  }

  .cta-sub {
    font-size: 16px;
    color: var(--text2);
    margin-bottom: 40px;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 40px;
    background: linear-gradient(135deg, var(--gold), var(--goldLight));
    color: var(--bg);
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-decoration: none;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 20px rgba(201,168,76,0.2), 0 0 0 1px rgba(201,168,76,0.15);
  }

  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(201,168,76,0.3), 0 0 0 1px rgba(201,168,76,0.25);
  }

  .cta-btn svg {
    width: 16px;
    height: 16px;
    stroke: var(--bg);
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .cta-meta {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    gap: 28px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text3);
    letter-spacing: 0.04em;
  }

  .cta-meta span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cta-meta svg {
    width: 14px;
    height: 14px;
    stroke: var(--text3);
    fill: none;
    stroke-width: 1.5;
  }

  /* ─── FOOTER ─── */
  .footer {
    text-align: center;
    padding: 40px 24px;
    border-top: 1px solid var(--border);
    font-size: 12px;
    color: var(--text3);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .footer-logo {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background: linear-gradient(135deg, var(--gold), var(--goldLight));
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .footer-logo svg {
    width: 9px;
    height: 9px;
    stroke: var(--bg);
    fill: none;
    stroke-width: 2.5;
  }

  /* ─── ANIMATIONS ─── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 768px) {
    .hero { min-height: 90vh; padding: 40px 20px; }
    .acts { padding: 60px 20px 40px; }
    .act { margin-bottom: 60px; }
    .act-content { padding: 24px; }
    .act-title { font-size: 22px; }
    .cta-meta { flex-direction: column; gap: 12px; }
  }
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

  <!-- ═══════ HERO ═══════ -->
  <section class="hero">
    <div class="badge">
      <span class="badge-dot"></span>
      Now Accepting Reservations
    </div>

    <div class="logo-mark">
      <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    </div>

    <h1 class="hero-title">The Guided <em>Tour</em></h1>
    <p class="hero-subtitle">A 20-minute cinematic walkthrough of the platform<br>your finance team didn't know existed.</p>

    <div class="hero-line"></div>
    <div class="scroll-hint">Scroll to begin</div>
  </section>

  <!-- ═══════ ACTS ═══════ -->
  <section class="acts">
    <div class="timeline"></div>

    <div class="section-label">
      <span>The Experience</span>
    </div>

    <!-- ACT I -->
    <div class="act">
      <div class="act-node"></div>
      <div class="act-content">
        <div class="act-number">Act I</div>
        <h3 class="act-title">The Intelligence Layer</h3>
        <p class="act-desc">
          Watch the AI Copilot answer natural language questions in real time. Ask it anything — variance explanations, cash flow forecasts, board-ready narratives — and see it respond instantly across your CFO, CEO, Controller, and FP&A command centers.
        </p>
        <div class="act-tags">
          <span class="act-tag gold">AI Copilot</span>
          <span class="act-tag">Natural Language</span>
          <span class="act-tag">Real-Time Insights</span>
          <span class="act-tag">4 Command Centers</span>
        </div>
      </div>
    </div>

    <!-- ACT II -->
    <div class="act">
      <div class="act-node"></div>
      <div class="act-content">
        <div class="act-number">Act II</div>
        <h3 class="act-title">The Automation Engine</h3>
        <p class="act-desc">
          Step inside the pipeline. See how month-end close, reconciliation, AP/AR aging, and multi-entity consolidation run on autopilot — from raw data ingestion to finished reporting. The workflows that compress close cycles from weeks into days.
        </p>
        <div class="act-tags">
          <span class="act-tag gold">Pipeline Automation</span>
          <span class="act-tag">Month-End Close</span>
          <span class="act-tag">Reconciliation</span>
          <span class="act-tag">Multi-Entity</span>
        </div>
      </div>
    </div>

    <!-- ACT III -->
    <div class="act">
      <div class="act-node"></div>
      <div class="act-content">
        <div class="act-number">Act III</div>
        <h3 class="act-title">Your Questions, Live</h3>
        <p class="act-desc">
          Bring your pain points. We'll map FinanceOS directly to your stack and show you exactly where the time savings live. No scripts. No slides. Just the product, shaped to your world.
        </p>
        <div class="act-tags">
          <span class="act-tag gold">Live Q&A</span>
          <span class="act-tag">Stack Mapping</span>
          <span class="act-tag">Custom Walkthrough</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════ DURATION STRIP ═══════ -->
  <div class="duration-strip">
    <div class="duration-bar">
      <div class="dur-seg" style="width:40%;background:linear-gradient(90deg,var(--gold),var(--goldLight));border-radius:2px 0 0 2px;"></div>
      <div class="dur-seg" style="width:35%;background:var(--emerald);"></div>
      <div class="dur-seg" style="width:25%;background:var(--borderHover);border-radius:0 2px 2px 0;"></div>
    </div>
    <div class="dur-labels">
      <span>Intelligence — 8 min</span>
      <span>Automation — 7 min</span>
      <span>Q&A — 5 min</span>
    </div>
  </div>

  <!-- ═══════ QUOTE ═══════ -->
  <section class="quote-section">
    <div class="quote-mark">"</div>
    <p class="quote-text">No pitch deck. No slides.<br>Just the live product, narrated start to finish.</p>
    <p class="quote-attr">— The FinanceOS Experience</p>
  </section>

  <!-- ═══════ CTA ═══════ -->
  <section class="cta-section">
    <div class="cta-overline">Reserve your tour</div>
    <h2 class="cta-heading">Book your <em>seat</em></h2>
    <p class="cta-sub">Built for CFOs, Controllers, and FP&A leaders at companies doing $5M–$500M+ in revenue. The tour starts on time.</p>

    <a href="https://calendly.com/finance-os-support/30min" target="_blank" class="cta-btn">
      Reserve a Tour
      <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>

    <div class="cta-meta">
      <span>
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        20 minutes
      </span>
      <span>
        <svg viewBox="0 0 24 24"><path d="M15 10l-4 4-2-2"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        Pick your time
      </span>
      <span>
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Google Meet
      </span>
    </div>
  </section>

  <!-- ═══════ FOOTER ═══════ -->
  <footer class="footer">
    <span class="footer-logo">
      <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
    </span>
    FinanceOS — finance-os.app
  </footer>

  <!-- ═══════ SCROLL REVEAL ═══════ -->
  

` }} />
    </>
  );
}
