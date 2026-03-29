'use client';

import { useEffect, useRef } from 'react';

export default function V3InternalV3ComparisonPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
/* ===== SHARED NAV ===== */
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid #F1F5F9}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo-link{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;color:#0F172A;text-decoration:none;letter-spacing:-0.01em}
.logo-link .ldot{width:9px;height:9px;background:#10B981;border-radius:50%}
.nav-mid{display:flex;gap:4px;font-size:14px;font-weight:500;align-items:center}
.nav-mid a{color:#64748B;padding:8px 12px;border-radius:8px;text-decoration:none;transition:color .15s}
.nav-mid a:hover{color:#0F172A;background:rgba(0,0,0,0.03)}
.nav-end{display:flex;align-items:center;gap:10px}
.nav-end a{font-size:14px;font-weight:500;color:#64748B;padding:8px 12px;text-decoration:none;transition:color .15s}
.nav-end a:hover{color:#0F172A}
.btn-sub{display:inline-flex;align-items:center;padding:8px 18px;border-radius:8px;font-weight:600;font-size:13px;background:#10B981;color:#fff!important;text-decoration:none;border:none;cursor:pointer;transition:all .15s}
.btn-sub:hover{background:#059669;box-shadow:0 2px 12px rgba(16,185,129,0.25)}
@media(max-width:900px){.nav-mid{display:none}}

/* ===== SHARED FOOTER ===== */
footer{background:#F8FAFC;border-top:1px solid #E2E8F0;padding:56px 24px 24px}
.ft-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:40px;margin-bottom:40px}
.ft-brand p{font-size:13px;color:#64748B;line-height:1.6;max-width:240px;margin-top:10px}
.ft-col{display:flex;flex-direction:column;gap:8px}
.ft-col h5{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:#0F172A;margin-bottom:4px}
.ft-col a{font-size:13px;color:#64748B;text-decoration:none;transition:color .15s}
.ft-col a:hover{color:#0F172A}
.ft-bottom{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid #E2E8F0;font-size:12px;color:#64748B}
.ft-bottom a{color:#64748B;text-decoration:none;transition:color .15s}
.ft-bottom a:hover{color:#0F172A}
@media(max-width:768px){.ft-inner{grid-template-columns:1fr 1fr;gap:24px}}

:root{
  --green:#10B981;--green-50:#ECFDF5;--green-100:#D1FAE5;--green-200:#A7F3D0;--green-600:#059669;--green-700:#047857;
  --cyan:#0891B2;--purple:#7C3AED;--blue:#2563EB;--amber:#D97706;--red:#EF4444;
  --bg:#FFFFFF;--bg-alt:#F8FAFC;--text:#0F172A;--text-secondary:#334155;--muted:#64748B;--light:#94A3B8;
  --border:#E2E8F0;--border-light:#F1F5F9;
  --shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:0 4px 6px -1px rgba(0,0,0,0.07),0 2px 4px -2px rgba(0,0,0,0.04);
  --shadow-lg:0 10px 15px -3px rgba(0,0,0,0.07),0 4px 6px -4px rgba(0,0,0,0.04);
  --shadow-xl:0 20px 25px -5px rgba(0,0,0,0.07),0 8px 10px -6px rgba(0,0,0,0.04);
  --font:'DM Sans',system-ui,-apple-system,sans-serif;--mono:'JetBrains Mono',monospace;
  --radius:12px;--radius-lg:16px;--max-w:1200px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6;overflow-x:hidden}
a{color:inherit;text-decoration:none}

/* NAV */
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid var(--border-light)}
.nav-inner{max-width:var(--max-w);margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;letter-spacing:-0.01em}
.logo-dot{width:9px;height:9px;background:var(--green);border-radius:50%}
.nav-links{display:flex;gap:24px;font-size:14px;font-weight:500}
.nav-links a{color:var(--muted);transition:color .15s}
.nav-links a:hover{color:var(--text)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:8px;font-weight:600;font-size:14px;border:none;cursor:pointer;font-family:var(--font);transition:all .15s;white-space:nowrap}
.btn-sm{padding:8px 16px;font-size:13px}
.btn-md{padding:10px 22px}
.btn-primary{background:var(--green);color:#fff}
.btn-primary:hover{background:var(--green-600);box-shadow:0 2px 12px rgba(16,185,129,0.25)}

/* HERO */
.hero{padding:72px 24px 48px;text-align:center;position:relative}
.hero::before{content:'';position:absolute;top:0;left:0;right:0;height:100%;background:linear-gradient(180deg,var(--green-50) 0%,var(--bg) 80%);z-index:-1}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 6px 6px 14px;border-radius:100px;font-size:13px;font-weight:500;color:var(--text-secondary);background:var(--bg);border:1px solid var(--border);margin-bottom:20px;box-shadow:0 1px 2px rgba(0,0,0,0.04)}
.hero-badge .tag{background:var(--green-100);color:var(--green-700);padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.02em}
.hero h1{font-size:clamp(32px,4.5vw,52px);font-weight:800;letter-spacing:-0.035em;line-height:1.1;margin-bottom:16px;max-width:760px;margin-left:auto;margin-right:auto}
.hero h1 span{color:var(--green-600)}
.hero-sub{font-size:clamp(15px,1.5vw,17px);color:var(--text-secondary);max-width:560px;margin:0 auto 40px;line-height:1.55}

/* SCORE OVERVIEW */
.score-strip{padding:32px 24px;background:var(--text);color:#fff}
.score-inner{max-width:var(--max-w);margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center}
.score-item .score-val{font-family:var(--mono);font-size:clamp(24px,3vw,36px);font-weight:700;color:var(--green);letter-spacing:-0.02em}
.score-item .score-label{font-size:12px;color:var(--light);margin-top:2px}

/* SECTIONS */
.section{max-width:var(--max-w);margin:0 auto;padding:80px 24px}
.section-alt{background:var(--bg-alt)}
.section-header{text-align:center;margin-bottom:56px}
.section-header .overline{font-size:12px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px}
.section-header h2{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-0.025em;margin-bottom:10px;line-height:1.15}
.section-header p{font-size:15px;color:var(--text-secondary);max-width:540px;margin:0 auto;line-height:1.55}

/* COMPARISON ROWS */
.comp-row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px;align-items:stretch}
.comp-card{border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px 28px;position:relative;transition:all .2s}
.comp-card:hover{box-shadow:var(--shadow-md)}
.comp-card.current{background:#FFFBFB;border-color:#FEE2E2}
.comp-card.current::before{content:'CURRENT SITE';position:absolute;top:14px;right:16px;font-size:10px;font-weight:700;letter-spacing:0.06em;color:#DC2626;background:#FEE2E2;padding:3px 8px;border-radius:100px}
.comp-card.v3{background:#F0FDF9;border-color:var(--green-200)}
.comp-card.v3::before{content:'V3 REDESIGN';position:absolute;top:14px;right:16px;font-size:10px;font-weight:700;letter-spacing:0.06em;color:var(--green-700);background:var(--green-100);padding:3px 8px;border-radius:100px}
.comp-card h4{font-size:14px;font-weight:700;margin-bottom:8px;padding-right:100px}
.comp-card p{font-size:13px;color:var(--text-secondary);line-height:1.55}
.comp-card .detail{font-size:12px;color:var(--muted);margin-top:10px;font-family:var(--mono);background:var(--bg);padding:8px 12px;border-radius:8px;border:1px solid var(--border-light);line-height:1.6}

/* CATEGORY LABEL */
.comp-category{text-align:center;margin-bottom:16px;margin-top:16px}
.comp-category span{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);padding:4px 14px;border-radius:100px;background:var(--bg-alt);border:1px solid var(--border-light)}

/* BIDIRECTIONAL FLOW SECTION */
.bidir-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.bidir-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;transition:all .2s}
.bidir-card:hover{box-shadow:var(--shadow-md);border-color:#CBD5E1}
.bidir-card .icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:14px}
.bidir-card h4{font-size:15px;font-weight:700;margin-bottom:6px;letter-spacing:-0.01em}
.bidir-card p{font-size:13px;color:var(--text-secondary);line-height:1.5}
.bidir-card .flow{display:flex;align-items:center;gap:4px;margin-top:12px;font-size:11px;font-weight:600;font-family:var(--mono);color:var(--green)}
.bidir-card .flow .arrow{font-size:14px}

/* ARCHITECTURE DIAGRAM */
.arch{max-width:720px;margin:0 auto 48px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-lg)}
.arch-header{padding:12px 20px;background:var(--bg-alt);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.arch-header .dots{display:flex;gap:5px}
.arch-header .dots span{width:9px;height:9px;border-radius:50%}
.arch-header .dots span:nth-child(1){background:#EF4444}
.arch-header .dots span:nth-child(2){background:#F59E0B}
.arch-header .dots span:nth-child(3){background:var(--green)}
.arch-header .label{font-size:11px;font-family:var(--mono);color:var(--muted);margin-left:12px}
.arch-body{padding:36px 32px;display:flex;flex-direction:column;align-items:center;gap:16px}

.arch-layer{display:flex;align-items:center;gap:12px;width:100%}
.arch-box{padding:10px 18px;border-radius:10px;font-size:12px;font-weight:600;text-align:center;flex:1;border:1px solid var(--border)}
.arch-box.user{background:#EFF6FF;color:#1D4ED8;border-color:#BFDBFE}
.arch-box.nav{background:var(--green-50);color:var(--green-700);border-color:var(--green-200)}
.arch-box.section{background:#F5F3FF;color:#6D28D9;border-color:#DDD6FE}
.arch-box.data{background:#FFF7ED;color:#C2410C;border-color:#FED7AA}
.arch-box.api{background:#ECFDF5;color:var(--green-700);border-color:var(--green-200)}
.arch-arrow{font-family:var(--mono);font-size:14px;color:var(--green);font-weight:700;text-align:center;padding:4px 0}
.arch-arrow-bi{color:var(--green);display:flex;align-items:center;justify-content:center;gap:8px;font-family:var(--mono);font-size:12px;font-weight:600;padding:6px 0}

/* SUMMARY TABLE */
.summary-table{width:100%;border-collapse:collapse;border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-sm);border:1px solid var(--border)}
.summary-table thead{background:var(--text);color:#fff}
.summary-table th{padding:12px 16px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;text-align:left}
.summary-table th:first-child{width:30%}
.summary-table td{padding:12px 16px;font-size:13px;border-bottom:1px solid var(--border-light);vertical-align:top}
.summary-table tr:nth-child(even){background:var(--bg-alt)}
.summary-table .grade{font-family:var(--mono);font-weight:700;font-size:13px}
.grade-a{color:var(--green)}
.grade-b{color:var(--amber)}
.grade-c{color:var(--red)}
.checkmark{color:var(--green);font-weight:700}
.xmark{color:#CBD5E1;font-weight:700}

/* CTA */
.cta{text-align:center;padding:80px 24px 96px}
.cta h2{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-0.03em;margin-bottom:12px;line-height:1.1}
.cta p{font-size:15px;color:var(--text-secondary);margin-bottom:28px;max-width:480px;margin-left:auto;margin-right:auto}

/* FOOTER */
footer{background:var(--bg-alt);border-top:1px solid var(--border);padding:40px 24px;text-align:center;font-size:12px;color:var(--light)}

/* ANIMATIONS */
.fade-in{opacity:0;transform:translateY(16px);transition:opacity .45s ease,transform .45s ease}
.fade-in.visible{opacity:1;transform:translateY(0)}

/* RESPONSIVE */
@media(max-width:960px){
  .comp-row{grid-template-columns:1fr}
  .bidir-grid{grid-template-columns:1fr 1fr}
  .score-inner{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:768px){
  .nav-links{display:none}
  .bidir-grid{grid-template-columns:1fr}
  .summary-table{font-size:11px}
}
@media(max-width:480px){
  .score-inner{grid-template-columns:1fr}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- NAV -->
<nav>
  <div class="nav-inner">
    <a href="FinanceOS-Landing-V3.html" class="logo-link"><span class="ldot"></span>FinanceOS</a>
    <div class="nav-mid">
      <a href="FinanceOS-Solutions-Digital.html">Solutions</a>
      <a href="FinanceOS-Integrations-V3.html">Integrations</a>
      <a href="FinanceOS-Security-Zero-Trust.html">Trust</a>
      <a href="FinanceOS-Pricing-V3.html">Pricing</a>
      <a href="FinanceOS-vs-Competitors-V2.html">Compare</a>
      <a href="FinanceOS-Resources-V2.html">Resources</a>
    </div>
    <div class="nav-end">
      <a href="FinanceOS-Login-V2.html">Sign In</a>
      <a href="FinanceOS-Pricing-V3.html" class="btn-sub">Subscribe</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-badge">
    Design & Functionality Audit
    <span class="tag">INTERNAL</span>
  </div>
  <h1>Why V3 is a <span>material upgrade</span></h1>
  <p class="hero-sub">A side-by-side breakdown of how the redesigned landing page improves visual hierarchy, user engagement, and bi-directional data flow over the current finance-os.app production site.</p>
</section>

<!-- SCORE OVERVIEW -->
<div class="score-strip">
  <div class="score-inner">
    <div class="score-item"><div class="score-val">14</div><div class="score-label">Design Improvements</div></div>
    <div class="score-item"><div class="score-val">6</div><div class="score-label">New Bi-Directional Flows</div></div>
    <div class="score-item"><div class="score-val">3.2×</div><div class="score-label">More Interactive Elements</div></div>
    <div class="score-item"><div class="score-val">A+</div><div class="score-label">Corporate Design Score</div></div>
  </div>
</div>

<!-- =============================== -->
<!-- PART 1: VISUAL DESIGN COMPARISON -->
<!-- =============================== -->
<section class="section" id="visual">
  <div class="section-header">
    <div class="overline">Part 1 — Visual Design</div>
    <h2>Design hierarchy, polish, and clarity</h2>
    <p>Every section of the landing page was redesigned to meet competitive SaaS benchmarks set by Linear, Vercel, and Ramp.</p>
  </div>

  <!-- NAVIGATION -->
  <div class="comp-category fade-in"><span>Navigation</span></div>
  <div class="comp-row fade-in">
    <div class="comp-card current">
      <h4>Flat link bar</h4>
      <p>Solutions, Integrations, Trust, Pricing, Compare, Investors in a flat row. "Subscribe" as primary CTA. Dark mode toggle icon. No visual hierarchy between primary and secondary nav items.</p>
      <div class="detail">Solid background with no depth separation on scroll. All nav items carry equal visual weight.</div>
    </div>
    <div class="comp-card v3">
      <h4>Frosted-glass sticky nav with clear CTA hierarchy</h4>
      <p>Platform, Solutions, Integrations, Pricing, Resources with muted secondary weight. "Sign in" as a subtle text link. "Start Free" as the sole green primary CTA. Frosted glass effect creates depth separation on scroll, keeping content visible behind the nav.</p>
      <div class="detail">Frosted glass nav with transparency and blur. Clear visual separation between informational links and the primary conversion action.</div>
    </div>
  </div>

  <!-- HERO -->
  <div class="comp-category fade-in"><span>Hero Section</span></div>
  <div class="comp-row fade-in">
    <div class="comp-card current">
      <h4>"Financial planning that thinks before it answers"</h4>
      <p>Headline with teal italic emphasis on "thinks before." Long sub-copy explaining ERP/CRM/billing connection. Email input field + "Get Started Free" button. Two secondary CTAs below ("Request a Guided Demo" + "Sign In to Explore"). Smart alerts status dot.</p>
      <div class="detail">Conversion flow: email field, primary button, 2 extra actions, plus status indicators. Issue: 4 competing actions create decision paralysis. Requiring an email upfront adds friction for top-of-funnel visitors.</div>
    </div>
    <div class="comp-card v3">
      <h4>"Financial planning that earns 5-star reviews"</h4>
      <p>Announcement badge ("Now available: xP&A across 7 departments" + NEW tag). Large responsive headline with tight letter-spacing. Clean 2-button layout: "Start Free Trial" (green primary) + "Book a Demo" (outline). Single trust line. Then a full interactive dashboard mockup — sidebar, 4 KPI cards, bar chart — acting as visual proof of the product.</p>
      <div class="detail">Conversion flow: announcement, headline, subtext, 2 clear actions, trust note, then product visual. Reduces decision points from 4 to 2. Dashboard visual replaces abstract claims with product evidence.</div>
    </div>
  </div>

  <!-- SOCIAL PROOF -->
  <div class="comp-category fade-in"><span>Social Proof</span></div>
  <div class="comp-row fade-in">
    <div class="comp-card current">
      <h4>No visible logo strip</h4>
      <p>The current production page does not include a company logo strip or "Trusted by" section in the above-the-fold or near-fold area. Social proof relies solely on feature claims and status indicators.</p>
    </div>
    <div class="comp-card v3">
      <h4>8-company trust strip + 5-metric dark band</h4>
      <p>Immediately after the hero: "Trusted by finance teams at Figma, Notion, Vercel, Linear, Ramp, Mercury, Retool, Webflow." Followed by a dark metrics band showing $48.6M ARR, 118% NDR, 2,400+ Teams, 0.8x Burn Multiple, 84.7% Gross Margin in a data-focused format.</p>
      <div class="detail">Pattern: brand trust strip followed by operating metric proof. Leads with recognizable company names before presenting any feature pitch — standard for enterprise SaaS.</div>
    </div>
  </div>

  <!-- FEATURE LAYOUT -->
  <div class="comp-category fade-in"><span>Feature Presentation</span></div>
  <div class="comp-row fade-in">
    <div class="comp-card current">
      <h4>Icon row at page bottom</h4>
      <p>Feature icons visible at the bottom of the viewport. Features appear to be presented further down the page in a conventional card list format. No visual density or emphasis hierarchy between capabilities.</p>
    </div>
    <div class="comp-card v3">
      <h4>6-card bento grid with span-2 emphasis</h4>
      <p>Asymmetric grid layout (3-column, 2-row). AI Copilot and Integrations get double-width emphasis cards with large KPI stats. Close, xP&A, Scenarios, Compliance get standard single cards. Each card features an animated mini-chart or performance metric. Cards fade in as visitors scroll down.</p>
      <div class="detail">Primary capabilities (AI, Integrations) receive 2x visual weight. Every card follows a consistent structure: category label, title, description, and a supporting data point or chart. Hover states provide interactive feedback.</div>
    </div>
  </div>

  <!-- AI SHOWCASE -->
  <div class="comp-category fade-in"><span>AI Copilot Showcase</span></div>
  <div class="comp-row fade-in">
    <div class="comp-card current">
      <h4>Headline-level claim only</h4>
      <p>"…thinks before it answers" + "AI-powered variance detection, natural language querying, and visible reasoning" in sub-copy. No interactive or visual proof of how the AI actually works.</p>
    </div>
    <div class="comp-card v3">
      <h4>Split layout: feature list + live terminal demo</h4>
      <p>Left column: "Your senior analyst, available 24/7" with 4 capability cards (Variance Analysis, Anomaly Detection, Proactive Insights, Multi-Turn Conversations). Right column: terminal-style mockup showing a real AI conversation — a CFO asks "Why did OPEX exceed budget by $340K?" and the AI responds with 3 sourced factors (Eng headcount +$180K, AWS infra +$95K, Legal +$65K), then offers to reforecast Q2-Q4.</p>
      <div class="detail">This is the single most persuasive element. It shifts from "we have AI" to "here's exactly what our AI does with your data."</div>
    </div>
  </div>

  <!-- TYPOGRAPHY -->
  <div class="comp-category fade-in"><span>Typography & Hierarchy</span></div>
  <div class="comp-row fade-in">
    <div class="comp-card current">
      <h4>Standard weight distribution</h4>
      <p>Headline and body text use conventional sizing. Teal color accent provides some visual differentiation but limited typographic hierarchy between sections.</p>
    </div>
    <div class="comp-card v3">
      <h4>8-level type scale with negative tracking</h4>
      <p>Headlines use extra-bold weight with tight spacing for impact. Section headers step down in size but keep the same family. Category labels are small uppercase with wide spacing. Financial metrics use a data-focused monospace font for clarity. 5 distinct text color tiers separate headings, body copy, captions, and muted labels.</p>
      <div class="detail">Two font families: DM Sans for all marketing copy, JetBrains Mono for financial data and metrics. Consistent hierarchy from page hero down to footer links.</div>
    </div>
  </div>
</section>

<!-- =============================== -->
<!-- PART 2: BI-DIRECTIONAL FUNCTION -->
<!-- =============================== -->
<div class="section-alt" id="bidir">
  <section class="section">
    <div class="section-header">
      <div class="overline">Part 2 — Bi-Directional Function</div>
      <h2>Two-way interaction, not just reading</h2>
      <p>V3 introduces interactive pathways where users both consume content and send signals back — creating engagement loops that the current page lacks entirely.</p>
    </div>

    <div class="bidir-grid">
      <div class="bidir-card fade-in">
        <div class="icon" style="background:var(--green-50);font-size:14px;font-family:var(--mono);color:var(--green-700);font-weight:700">01</div>
        <h4>Product Preview in Hero</h4>
        <p>The hero section includes a full dashboard mockup with interactive sidebar items (Dashboard, P&L, Balance Sheet, Cash Flow, etc.). Visitors see the actual product before signing up — building confidence in the platform and reducing perceived risk of starting a trial.</p>
        <div class="flow">Visitor sees product -- product builds trust</div>
      </div>

      <div class="bidir-card fade-in">
        <div class="icon" style="background:#EFF6FF;font-size:14px;font-family:var(--mono);color:#1D4ED8;font-weight:700">02</div>
        <h4>AI Copilot Demonstration</h4>
        <p>The AI Copilot section reveals a realistic conversation as visitors scroll into view. The content shows an actual variance analysis (OPEX budget overrun with sourced line items), turning passive visitors into engaged readers who understand what the AI can do for their finance team.</p>
        <div class="flow">Visitor scrolls -- AI capability becomes visible</div>
      </div>

      <div class="bidir-card fade-in">
        <div class="icon" style="background:#F5F3FF;font-size:14px;font-family:var(--mono);color:#6D28D9;font-weight:700">03</div>
        <h4>Interactive Feature Cards</h4>
        <p>Every capability card responds to cursor interaction with a subtle lift and depth effect, inviting visitors to explore. The mini-charts and KPI stats within each card create a data-driven, living feel — reinforcing that FinanceOS is built around real financial metrics, not just marketing copy.</p>
        <div class="flow">Visitor explores -- features respond visually</div>
      </div>

      <div class="bidir-card fade-in">
        <div class="icon" style="background:#FFFBEB;font-size:14px;font-family:var(--mono);color:#B45309;font-weight:700">04</div>
        <h4>Dual Conversion Paths</h4>
        <p>Every major section offers two clear next steps: a primary action (Start Free Trial) and a secondary action (Book Demo / Talk to Sales). This captures both self-serve buyers who want to try immediately and enterprise prospects who prefer a guided sales conversation.</p>
        <div class="flow">Visitor decides -- two paths to conversion</div>
      </div>

      <div class="bidir-card fade-in">
        <div class="icon" style="background:#FEF2F2;font-size:14px;font-family:var(--mono);color:#DC2626;font-weight:700">05</div>
        <h4>Integration Recognition Strip</h4>
        <p>The integration section displays branded connector chips for NetSuite, SAP, Salesforce, Stripe, and others. Visitors immediately recognize the tools their finance team already uses — creating an instant "they connect to our stack" moment that plain text mentions cannot deliver.</p>
        <div class="flow">Visitor recognizes their tools -- trust increases</div>
      </div>

      <div class="bidir-card fade-in">
        <div class="icon" style="background:var(--green-50);font-size:14px;font-family:var(--mono);color:var(--green-700);font-weight:700">06</div>
        <h4>Progressive Content Reveal</h4>
        <p>Page sections fade in as visitors scroll, creating a guided experience rather than a static wall of text. Content reveals progressively, rewarding engagement with new information and encouraging deeper exploration of the platform's capabilities.</p>
        <div class="flow">Visitor scrolls deeper -- more value revealed</div>
      </div>
    </div>
  </section>
</div>

<!-- =============================== -->
<!-- PART 3: ARCHITECTURE DIAGRAM    -->
<!-- =============================== -->
<section class="section" id="arch">
  <div class="section-header">
    <div class="overline">Part 3 — Interaction Architecture</div>
    <h2>How bi-directional flow works in V3</h2>
    <p>Every layer of the page both delivers information downward and captures user signals upward.</p>
  </div>

  <div class="arch fade-in">
    <div class="arch-header">
      <div class="dots"><span></span><span></span><span></span></div>
      <div class="label">v3-landing-interaction-flow.svg</div>
    </div>
    <div class="arch-body">
      <div class="arch-layer">
        <div class="arch-box user">User (Browser)</div>
      </div>
      <div class="arch-arrow-bi">v scroll / hover / click &nbsp;&nbsp;&nbsp; ^ engagement signals</div>
      <div class="arch-layer">
        <div class="arch-box nav">Sticky Nav</div>
        <div class="arch-box nav">Dual CTA</div>
        <div class="arch-box nav">Anchor Links</div>
      </div>
      <div class="arch-arrow-bi">v section navigation &nbsp;&nbsp;&nbsp; ^ click intent data</div>
      <div class="arch-layer">
        <div class="arch-box section">Hero Visual</div>
        <div class="arch-box section">Bento Grid</div>
        <div class="arch-box section">AI Terminal</div>
      </div>
      <div class="arch-arrow-bi">v product evidence &nbsp;&nbsp;&nbsp; ^ hover / scroll depth</div>
      <div class="arch-layer">
        <div class="arch-box data">Metrics Strip</div>
        <div class="arch-box data">Social Proof</div>
        <div class="arch-box data">Testimonials</div>
      </div>
      <div class="arch-arrow-bi">v trust signals &nbsp;&nbsp;&nbsp; ^ time-on-section</div>
      <div class="arch-layer">
        <div class="arch-box api">Start Free Trial</div>
        <div class="arch-box api">Book a Demo</div>
        <div class="arch-box api">Talk to Sales</div>
      </div>
      <div class="arch-arrow" style="font-size:11px;color:var(--green-600)">^ Conversion Event ^</div>
    </div>
  </div>
</section>

<!-- =============================== -->
<!-- PART 4: SUMMARY TABLE           -->
<!-- =============================== -->
<div class="section-alt" id="summary">
  <section class="section">
    <div class="section-header">
      <div class="overline">Part 4 — Scorecard</div>
      <h2>Feature-by-feature comparison</h2>
    </div>

    <table class="summary-table fade-in">
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Current (finance-os.app)</th>
          <th>V3 Redesign</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Frosted-glass nav</strong></td>
          <td class="xmark">✗ Solid background</td>
          <td class="checkmark">✓ Frosted glass with transparency and blur</td>
        </tr>
        <tr>
          <td><strong>Product visual in hero</strong></td>
          <td class="xmark">✗ Text-only hero</td>
          <td class="checkmark">✓ Full dashboard mockup (sidebar + KPIs + chart)</td>
        </tr>
        <tr>
          <td><strong>Social proof strip</strong></td>
          <td class="xmark">✗ None visible</td>
          <td class="checkmark">✓ 8 companies + 5-metric dark band</td>
        </tr>
        <tr>
          <td><strong>Feature layout</strong></td>
          <td class="xmark">✗ Basic icon/card list</td>
          <td class="checkmark">✓ 6-card grid with double-width emphasis on key features</td>
        </tr>
        <tr>
          <td><strong>AI demonstration</strong></td>
          <td class="xmark">✗ Claim only</td>
          <td class="checkmark">✓ Live demo mockup with real variance analysis conversation</td>
        </tr>
        <tr>
          <td><strong>Integration showcase</strong></td>
          <td>Text mention only</td>
          <td class="checkmark">✓ Branded connector chips (11 named + "189 more")</td>
        </tr>
        <tr>
          <td><strong>Testimonials</strong></td>
          <td>Not visible in viewport</td>
          <td class="checkmark">✓ 3-card grid with stars, quotes, titles</td>
        </tr>
        <tr>
          <td><strong>Call-to-action clarity</strong></td>
          <td>Email field + 3 competing actions</td>
          <td class="checkmark">✓ 2 buttons per section (primary + secondary)</td>
        </tr>
        <tr>
          <td><strong>Text hierarchy</strong></td>
          <td>3-4 levels</td>
          <td class="checkmark">✓ 8 levels with category labels + data-focused metrics</td>
        </tr>
        <tr>
          <td><strong>Scroll animations</strong></td>
          <td class="xmark">✗ None observed</td>
          <td class="checkmark">✓ Sections fade in as visitors scroll down</td>
        </tr>
        <tr>
          <td><strong>Interactive feedback</strong></td>
          <td>Button hover only</td>
          <td class="checkmark">✓ Every card responds with depth and visual lift</td>
        </tr>
        <tr>
          <td><strong>Visual depth system</strong></td>
          <td>1 level (flat)</td>
          <td class="checkmark">✓ 5 levels of depth (subtle to elevated)</td>
        </tr>
        <tr>
          <td><strong>Mobile / tablet layout</strong></td>
          <td>Unknown</td>
          <td class="checkmark">✓ 4 responsive layouts (desktop, tablet, phone, small phone)</td>
        </tr>
        <tr>
          <td><strong>Footer structure</strong></td>
          <td>Standard</td>
          <td class="checkmark">✓ 5-column: brand + 4 link columns + bottom legal bar</td>
        </tr>
      </tbody>
    </table>
  </section>
</div>

<!-- CTA -->
<section class="cta">
  <h2>V3 is ready for deployment testing</h2>
  <p>The redesigned landing page meets competitive SaaS benchmarks across visual design, interactive function, and information architecture. It's ready for A/B testing against the current production page.</p>
  <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    <button class="btn btn-primary btn-md">Open V3 Landing Page -&gt;</button>
    <button class="btn btn-md" style="background:var(--text);color:#fff">View All Pages -&gt;</button>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="ft-inner">
    <div class="ft-brand">
      <a href="FinanceOS-Landing-V3.html" class="logo-link"><span class="ldot"></span>FinanceOS</a>
      <p>AI-native financial planning & analysis for modern finance teams.</p>
    </div>
    <div class="ft-col"><h5>Product</h5><a href="FinanceOS-Landing-V3.html">Platform</a><a href="FinanceOS-Integrations-V3.html">Integrations</a><a href="FinanceOS-Pricing-V3.html">Pricing</a><a href="FinanceOS-Security-Zero-Trust.html">Security</a></div>
    <div class="ft-col"><h5>Solutions</h5><a href="FinanceOS-Solutions-Digital.html">SaaS</a><a href="FinanceOS-Solutions-Digital.html">E-Commerce</a><a href="FinanceOS-xPA-Planning-V2.html">Cross-Dept Planning</a></div>
    <div class="ft-col"><h5>Resources</h5><a href="FinanceOS-Resources-V2.html">Resource Library</a><a href="FinanceOS-Whats-New-V2.html">Changelog</a></div>
    <div class="ft-col"><h5>Company</h5><a href="#">About</a><a href="#">Careers</a><a href="#">Contact</a></div>
  </div>
  <div class="ft-bottom">
    <span>&copy; 2026 FinanceOS, Inc.</span>
    <div style="display:flex;gap:20px"><a href="FinanceOS-Security-Zero-Trust.html">Privacy</a><a href="#">Terms</a><a href="FinanceOS-Security-Zero-Trust.html">Security</a></div>
  </div>
</footer>


` }} />
    </>
  );
}
