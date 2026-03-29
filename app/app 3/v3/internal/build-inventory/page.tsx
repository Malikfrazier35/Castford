'use client';

import { useEffect, useRef } from 'react';

export default function V3InternalBuildInventoryPage() {
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
  --bg:#FFFFFF;--bg-alt:#F8FAFC;--text:#0F172A;--text-secondary:#334155;--muted:#64748B;--light:#94A3B8;
  --border:#E2E8F0;--border-light:#F1F5F9;
  --shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:0 4px 6px -1px rgba(0,0,0,0.07),0 2px 4px -2px rgba(0,0,0,0.04);
  --font:'DM Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
  --radius:12px;--radius-lg:16px;--max-w:1100px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.6;overflow-x:hidden}
a{color:inherit;text-decoration:none}

nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid var(--border-light)}
.nav-inner{max-width:var(--max-w);margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;letter-spacing:-0.01em}
.logo-dot{width:9px;height:9px;background:var(--green);border-radius:50%}
.nav-links{display:flex;gap:20px;font-size:13px;font-weight:500}
.nav-links a{color:var(--muted);transition:color .15s}
.nav-links a:hover{color:var(--text)}

.section{max-width:var(--max-w);margin:0 auto;padding:64px 24px}
.section-alt{background:var(--bg-alt)}
.overline{font-size:12px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px}
h1{font-size:clamp(28px,4vw,44px);font-weight:800;letter-spacing:-0.03em;line-height:1.1;margin-bottom:12px}
h2{font-size:clamp(22px,3vw,32px);font-weight:800;letter-spacing:-0.025em;line-height:1.15;margin-bottom:10px}
.sub{font-size:15px;color:var(--text-secondary);max-width:600px;line-height:1.55;margin-bottom:36px}

/* STATS ROW */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:48px}
.stat-card{background:var(--bg-alt);border:1px solid var(--border-light);border-radius:var(--radius);padding:16px;text-align:center}
.stat-card .val{font-family:var(--mono);font-size:28px;font-weight:700;color:var(--green);letter-spacing:-0.02em}
.stat-card .label{font-size:12px;color:var(--muted);margin-top:2px}

/* FILE CARDS */
.file-grid{display:flex;flex-direction:column;gap:12px}
.file-card{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:16px;align-items:center;padding:16px 20px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);transition:all .15s}
.file-card:hover{box-shadow:var(--shadow-md);border-color:#CBD5E1}
.file-card .name{font-weight:700;font-size:14px;letter-spacing:-0.01em}
.file-card .desc{font-size:12px;color:var(--muted);margin-top:2px}
.file-card .meta{font-size:12px;color:var(--muted);font-family:var(--mono)}

.pill{display:inline-block;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600;letter-spacing:0.02em}
.pill-ready{background:var(--green-100);color:var(--green-700)}
.pill-upgrade{background:#FEF3C7;color:#B45309}
.pill-dark{background:#FEE2E2;color:#DC2626}
.pill-light{background:#DBEAFE;color:#1D4ED8}
.pill-new{background:var(--green-50);color:var(--green-600)}
.pill-superseded{background:var(--border-light);color:var(--light)}

.file-header{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:16px;padding:8px 20px;font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border)}

/* IMPROVEMENT LIST */
.imp-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.imp-card{padding:16px 20px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);transition:all .15s}
.imp-card:hover{box-shadow:var(--shadow-sm)}
.imp-card h4{font-size:13px;font-weight:700;margin-bottom:4px}
.imp-card p{font-size:12px;color:var(--muted);line-height:1.5}
.imp-num{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--green);margin-bottom:6px}

/* DEPLOYMENT TABLE */
.dep-table{width:100%;border-collapse:collapse;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm)}
.dep-table thead{background:var(--text);color:#fff}
.dep-table th{padding:10px 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;text-align:left}
.dep-table td{padding:10px 16px;font-size:13px;border-bottom:1px solid var(--border-light);vertical-align:top}
.dep-table tr:nth-child(even){background:var(--bg-alt)}

/* PENDING SECTION */
.pending-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.pending-card{padding:16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg)}
.pending-card h4{font-size:13px;font-weight:700;margin-bottom:4px}
.pending-card p{font-size:12px;color:var(--muted);line-height:1.5}
.pending-card .priority{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px}
.priority-high{color:#DC2626}
.priority-med{color:#D97706}
.priority-low{color:var(--muted)}

footer{background:var(--bg-alt);border-top:1px solid var(--border);padding:32px 24px;text-align:center;font-size:12px;color:var(--light)}

.fade-in{opacity:0;transform:translateY(16px);transition:opacity .45s ease,transform .45s ease}
.fade-in.visible{opacity:1;transform:translateY(0)}

@media(max-width:768px){
  .nav-links{display:none}
  .stats{grid-template-columns:repeat(2,1fr)}
  .file-card{grid-template-columns:1fr;gap:6px}
  .file-header{display:none}
  .imp-grid{grid-template-columns:1fr}
  .pending-grid{grid-template-columns:1fr}
  .dep-table{font-size:11px}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

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
<section class="section">
  <div class="overline">Build Inventory</div>
  <h1>FinanceOS site build -- all pages organized</h1>
  <p class="sub">Complete inventory of every HTML page built for finance-os.app, organized by deployment status. This is the reference for deciding what goes into the next production build.</p>

  <div class="stats fade-in">
    <div class="stat-card"><div class="val">18</div><div class="label">Total HTML Files</div></div>
    <div class="stat-card"><div class="val">15</div><div class="label">Light Theme (Ready)</div></div>
    <div class="stat-card"><div class="val">0</div><div class="label">Pending Conversion</div></div>
    <div class="stat-card"><div class="val">3</div><div class="label">Superseded Versions</div></div>
  </div>
</section>

<!-- ===================== -->
<!-- ALL FILES             -->
<!-- ===================== -->
<div class="section-alt" id="files">
  <section class="section">
    <div class="overline">Section 1</div>
    <h2>Complete file inventory</h2>
    <p class="sub">Every HTML page, sorted by deployment readiness. "Ready" means light theme, current design system, no known issues.</p>

    <div class="file-header">
      <span>File</span>
      <span>Theme</span>
      <span>Status</span>
      <span>Size</span>
    </div>

    <div class="file-grid">
      <!-- READY FOR DEPLOY -->
      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Landing-V3.html</div><div class="desc">Flagship landing page. Feature grid, product dashboard mockup, AI Copilot demo, social proof, operating metrics, testimonials.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">29.6 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Integrations-V3.html</div><div class="desc">Integrations hub. 27 connector cards with brand logos, category filtering, connection diagram, developer API section.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">27.8 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Solutions-Digital.html</div><div class="desc">Solutions page for digital businesses. 6 industry segments, pain/solution flow, comparison table, testimonials.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">29.3 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Pain-Points-Solutions.html</div><div class="desc">7 pain point sections with problem/solution side-by-side cards. Before/after comparison grid. AI Copilot demonstration.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">24.7 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Whats-New-V2.html</div><div class="desc">Vertical timeline changelog. Oct 2025 (v3.3) through March 2026 (v3.8). Color-coded tags per entry type.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">12.2 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Login-V2.html</div><div class="desc">Login page. Split panel layout with customer testimonial rotation on the left, sign-in form on the right (Google SSO, Microsoft SSO, SAML, email/password).</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">9.5 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Resources-V2.html</div><div class="desc">Resource library. 12 content cards across 5 categories (guides, case studies, webinars, blog, templates). Category filtering, keyword search, newsletter subscribe.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">15.5 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-V3-vs-Current-Comparison.html</div><div class="desc">Internal audit: V3 vs current production site. Visual design, bi-directional function, architecture, scorecard.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-new">Internal</span></div>
        <div class="meta">29.6 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Build-Inventory.html</div><div class="desc">This file. Build inventory and deployment plan.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-new">Internal</span></div>
        <div class="meta">--</div>
      </div>

      <!-- CONVERTED TO LIGHT — READY -->
      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-vs-Competitors-V2.html</div><div class="desc">Competitive comparison page. FinanceOS vs Anaplan, Planful, Adaptive, Vena, Pigment. Feature matrix, review scores, head-to-head cards.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">42.0 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-xPA-Planning-V2.html</div><div class="desc">xP&A extended planning page. 7-department planning breakdown, workflow diagrams, department mockups, before/after comparison.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">39.9 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Pricing-V3.html</div><div class="desc">Pricing page. 4-tier consumption model: Starter $665, Growth $2,079, Business $4,999, Enterprise Custom. Billing toggle, feature comparison.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">28.3 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Enterprise-Pricing-Model.html</div><div class="desc">Internal sales tool. Enterprise pricing deep-dive, consumption model breakdown, ROI calculator, competitive intelligence, negotiation playbook.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-new">Internal</span></div>
        <div class="meta">32.7 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Ad-Campaign-V2.html</div><div class="desc">Ad campaign landing page. Compact CTA-focused layout for paid traffic with email capture, pain/gain cards, traction proof.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">9.5 KB</div>
      </div>

      <div class="file-card fade-in">
        <div><div class="name">FinanceOS-Security-Zero-Trust.html</div><div class="desc">Zero trust security page. 6 security principles, data ingestion paths, encryption matrix, compliance grid, customer controls.</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-ready">Ready</span></div>
        <div class="meta">37.6 KB</div>
      </div>

      <!-- SUPERSEDED -->
      <div class="file-card fade-in" style="opacity:0.6">
        <div><div class="name">FinanceOS-Landing-V2.html</div><div class="desc">Old landing page. Replaced by V3.</div></div>
        <div><span class="pill pill-dark">Dark</span></div>
        <div><span class="pill pill-superseded">Superseded</span></div>
        <div class="meta">30.8 KB</div>
      </div>

      <div class="file-card fade-in" style="opacity:0.6">
        <div><div class="name">FinanceOS-Pricing-V2.html</div><div class="desc">Old pricing page. Replaced by V3.</div></div>
        <div><span class="pill pill-dark">Dark</span></div>
        <div><span class="pill pill-superseded">Superseded</span></div>
        <div class="meta">24.4 KB</div>
      </div>

      <div class="file-card fade-in" style="opacity:0.6">
        <div><div class="name">FinanceOS-Integrations-V2.html</div><div class="desc">Old integrations page. Replaced by V3 (brand logos).</div></div>
        <div><span class="pill pill-light">Light</span></div>
        <div><span class="pill pill-superseded">Superseded</span></div>
        <div class="meta">20.7 KB</div>
      </div>
    </div>
  </section>
</div>

<!-- ===================== -->
<!-- IMPROVEMENTS          -->
<!-- ===================== -->
<section class="section" id="improvements">
  <div class="overline">Section 2</div>
  <h2>Key improvements in this build cycle</h2>
  <p class="sub">Everything that changed from the original dark-theme pages to the current light-theme deployment candidates.</p>

  <div class="imp-grid">
    <div class="imp-card fade-in">
      <div class="imp-num">01</div>
      <h4>Dark to light theme conversion</h4>
      <p>All new pages use a clean white and light gray design system. Matches the industry standard for enterprise B2B financial software marketing sites.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">02</div>
      <h4>Frosted-glass navigation</h4>
      <p>Frosted glass navigation bar that stays visible at the top of the page as visitors scroll. Transparent with a soft blur effect. Consistent across every page.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">03</div>
      <h4>5-tier shadow hierarchy</h4>
      <p>Five levels of visual depth (from subtle to elevated) replacing a single flat shadow. Creates proper layering for cards, overlays, and featured sections throughout the site.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">04</div>
      <h4>Typography system overhaul</h4>
      <p>Two professional font families: DM Sans for all marketing copy, JetBrains Mono for financial data and metrics. Headlines use tight letter-spacing for impact. Category labels use wide spacing for clarity. 5 distinct text color tiers from headings to muted captions.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">05</div>
      <h4>Capability grid layout</h4>
      <p>Asymmetric 3-column grid with double-width emphasis on key capabilities (AI Copilot, Integrations). Replaces flat card lists. Each card features KPI stats and mini-charts.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">06</div>
      <h4>Dashboard product visual</h4>
      <p>Full application mockup in hero: sidebar with 8 nav items, 4 KPI metric cards, 12-bar chart. Shows the product instead of describing it.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">07</div>
      <h4>AI Copilot demonstration</h4>
      <p>Interactive mockup showing a real AI-driven variance analysis conversation (OPEX budget overrun with sourced line items). Shifts from "we have AI" to "here's what our AI does for your finance team."</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">08</div>
      <h4>Real connector brand logos</h4>
      <p>Integrations V3 replaced generic letter abbreviations with actual brand-colored logo marks for all 27 connectors (NetSuite, SAP, Salesforce, Stripe, etc.).</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">09</div>
      <h4>Social proof and metrics strips</h4>
      <p>8-company trust bar (Figma, Notion, Vercel, Linear, Ramp, Mercury, Retool, Webflow) plus 5 operating metrics ($48.6M ARR, 118% NDR, 2,400+ Teams, 0.8x Burn Multiple, 84.7% Gross Margin). Standard enterprise SaaS credibility pattern.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">10</div>
      <h4>Scroll-triggered animations</h4>
      <p>Page sections fade in as visitors scroll, creating a guided experience instead of a static wall of content. Consistent across all light-theme pages.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">11</div>
      <h4>Dual conversion paths</h4>
      <p>Every major section offers 2 clear next steps: primary (Start Free Trial) + secondary (Book Demo / Talk to Sales). Captures both self-serve buyers and enterprise prospects who prefer guided sales.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">12</div>
      <h4>Mobile and tablet responsive layouts</h4>
      <p>4 responsive layouts across all pages: desktop (full grid), tablet (two-column), mobile (single-column), small phone (stacked metrics). Consistent behavior everywhere.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">13</div>
      <h4>Pain/solution visual pattern</h4>
      <p>Side-by-side comparison: red-accented "pain" cards (showing the problem) next to green-accented "solution" cards (showing how FinanceOS fixes it). Used across Pain-Points and Solutions pages.</p>
    </div>

    <div class="imp-card fade-in">
      <div class="imp-num">14</div>
      <h4>Category filtering</h4>
      <p>Interactive filter buttons for Integrations (7 categories: ERP, CRM, HRIS, Banking, Data, BI), Resources (5 types), and Solutions (6 segments). Resources page also includes live keyword search.</p>
    </div>
  </div>
</section>

<!-- ===================== -->
<!-- DEPLOYMENT PLAN       -->
<!-- ===================== -->
<div class="section-alt" id="deploy">
  <section class="section">
    <div class="overline">Section 3</div>
    <h2>Recommended deployment order</h2>
    <p class="sub">Prioritized by impact on the main site. Phase 1 can ship immediately. Phase 2 requires light-theme conversion first.</p>

    <table class="dep-table fade-in">
      <thead>
        <tr>
          <th>Phase</th>
          <th>Page</th>
          <th>Route</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowspan="3"><strong>Phase 1</strong><br><span style="font-size:11px;color:var(--green)">Ready now</span></td>
          <td>Landing V3</td>
          <td style="font-family:var(--mono);font-size:12px">/</td>
          <td>Replace current homepage. Highest impact change.</td>
        </tr>
        <tr>
          <td>Integrations V3</td>
          <td style="font-family:var(--mono);font-size:12px">/integrations</td>
          <td>SVG logos, category filtering. Full page replacement.</td>
        </tr>
        <tr>
          <td>Solutions Digital</td>
          <td style="font-family:var(--mono);font-size:12px">/solutions/digital</td>
          <td>New page, no existing route conflict.</td>
        </tr>
        <tr>
          <td rowspan="4"><strong>Phase 2</strong><br><span style="font-size:11px;color:var(--green)">Ready now</span></td>
          <td>Pain Points & Solutions</td>
          <td style="font-family:var(--mono);font-size:12px">/why-financeos</td>
          <td>Strong conversion page. Place in nav under "Solutions."</td>
        </tr>
        <tr>
          <td>What's New V2</td>
          <td style="font-family:var(--mono);font-size:12px">/changelog</td>
          <td>Timeline changelog. Link from footer "Changelog."</td>
        </tr>
        <tr>
          <td>Login V2</td>
          <td style="font-family:var(--mono);font-size:12px">/login</td>
          <td>Replace current login. SSO buttons, validation.</td>
        </tr>
        <tr>
          <td>Resources V2</td>
          <td style="font-family:var(--mono);font-size:12px">/resources</td>
          <td>Resource library with search and filtering.</td>
        </tr>
        <tr>
          <td rowspan="6"><strong>Phase 3</strong><br><span style="font-size:11px;color:var(--green)">Ready now</span></td>
          <td>Pricing V3</td>
          <td style="font-family:var(--mono);font-size:12px">/pricing</td>
          <td>Converted to light theme. Consumption model and tiers intact.</td>
        </tr>
        <tr>
          <td>Competitors V2</td>
          <td style="font-family:var(--mono);font-size:12px">/compare</td>
          <td>Converted to light theme. All comparison tables, review scores, battle cards preserved.</td>
        </tr>
        <tr>
          <td>xP&A Planning V2</td>
          <td style="font-family:var(--mono);font-size:12px">/xpa</td>
          <td>Converted to light theme. Department mockups intentionally kept dark (UI screenshots).</td>
        </tr>
        <tr>
          <td>Enterprise Pricing</td>
          <td style="font-family:var(--mono);font-size:12px">/enterprise</td>
          <td>Converted to light theme. Internal sales tool with "Internal Only" banner.</td>
        </tr>
        <tr>
          <td>Ad Campaign V2</td>
          <td style="font-family:var(--mono);font-size:12px">/get-started</td>
          <td>Converted to light theme. Compact page for paid traffic.</td>
        </tr>
        <tr>
          <td>Security &amp; Zero Trust</td>
          <td style="font-family:var(--mono);font-size:12px">/security</td>
          <td>New page. Zero trust principles, data handling, compliance grid.</td>
        </tr>
      </tbody>
    </table>
  </section>
</div>

<!-- ===================== -->
<!-- PENDING WORK          -->
<!-- ===================== -->
<section class="section" id="pending">
  <div class="overline">Section 4</div>
  <h2>Pending work before full deploy</h2>
  <p class="sub">Remaining tasks to get from prototype HTML files to production-ready pages on finance-os.app.</p>

  <div class="pending-grid">
    <div class="pending-card fade-in" style="border-left:3px solid var(--green);opacity:0.7">
      <div class="priority" style="color:var(--green)">Completed</div>
      <h4>Convert 5 dark-theme pages</h4>
      <p>All 5 pages (Pricing V3, Competitors, xP&A, Enterprise Pricing, Ad Campaign) converted to light theme with frosted-glass nav, light hero, and consistent footer.</p>
    </div>

    <div class="pending-card fade-in" style="border-left:3px solid var(--green);opacity:0.7">
      <div class="priority" style="color:var(--green)">Completed</div>
      <h4>Cross-link navigation</h4>
      <p>All 15 pages now have consistent nav with real cross-links: Solutions, Integrations, Trust, Pricing, Compare, Resources | Sign In, Subscribe.</p>
    </div>

    <div class="pending-card fade-in" style="border-left:3px solid var(--green);opacity:0.7">
      <div class="priority" style="color:var(--green)">Completed</div>
      <h4>Match live site nav structure</h4>
      <p>Nav updated to: Solutions, Integrations, Trust, Pricing, Compare, Resources. Shared template build script (build.js) manages nav/footer from a single source.</p>
    </div>

    <div class="pending-card fade-in">
      <div class="priority priority-med">Medium Priority</div>
      <h4>Brand logos on remaining pages</h4>
      <p>Only Integrations V3 has full brand logo marks. Landing V3 social proof strip and other pages still use text-only company names.</p>
    </div>

    <div class="pending-card fade-in">
      <div class="priority priority-med">Medium Priority</div>
      <h4>Mobile navigation menu</h4>
      <p>Navigation links currently hide on mobile devices with no toggle menu. Need a collapsible mobile menu for phone and tablet visitors.</p>
    </div>

    <div class="pending-card fade-in">
      <div class="priority priority-med">Medium Priority</div>
      <h4>Lead capture and form submission</h4>
      <p>Call-to-action buttons and email fields are visual-only. Need to connect to a lead capture service or CRM so trial signups and demo requests are actually received by the sales team.</p>
    </div>

    <div class="pending-card fade-in">
      <div class="priority priority-low">Lower Priority</div>
      <h4>Dark mode toggle</h4>
      <p>Current live site has a dark mode toggle. V3 pages are light-only. Could add a theme switcher to match existing site functionality.</p>
    </div>

    <div class="pending-card fade-in">
      <div class="priority priority-low">Lower Priority</div>
      <h4>SEO meta tags</h4>
      <p>Pages need social sharing previews, search engine descriptions, and proper page URLs for production deployment.</p>
    </div>

    <div class="pending-card fade-in">
      <div class="priority priority-low">Lower Priority</div>
      <h4>Analytics integration</h4>
      <p>Add analytics to measure visitor behavior: page scroll depth, call-to-action clicks, trial signups, and demo request conversions.</p>
    </div>
  </div>
</section>

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
