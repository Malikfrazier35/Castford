'use client';

import { useEffect } from 'react';

export default function V3InternalPlatformAuditPage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#06080c;--surface:#10131a;--surface2:#161a24;--border:#1a1f2e;--text:#eef0f6;--dim:#636d84;--faint:#3d4558;--accent:#5b9cf5;--green:#3dd9a0;--red:#f06b6b;--amber:#f5b731;--purple:#a181f7;--cyan:#2dd4d0}
body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
.container{max-width:1100px;margin:0 auto;padding:40px 32px 80px}
h1{font-size:42px;font-weight:900;letter-spacing:-0.04em;line-height:1.05;margin-bottom:8px}
h2{font-size:26px;font-weight:800;letter-spacing:-0.03em;margin-bottom:16px;padding-top:48px;border-top:1px solid var(--border)}
h3{font-size:17px;font-weight:700;letter-spacing:-0.01em;margin:28px 0 10px;color:var(--accent)}
.subtitle{font-size:15px;color:var(--dim);margin-bottom:48px;max-width:640px}
.badge{display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:24px}
.badge.red{background:rgba(240,107,107,0.08);border:1px solid rgba(240,107,107,0.15);color:var(--red)}
.badge.amber{background:rgba(245,183,49,0.08);border:1px solid rgba(245,183,49,0.15);color:var(--amber)}
.badge.green{background:rgba(61,217,160,0.08);border:1px solid rgba(61,217,160,0.15);color:var(--green)}
.badge.purple{background:rgba(161,129,247,0.08);border:1px solid rgba(161,129,247,0.15);color:var(--purple)}
.badge.blue{background:rgba(91,156,245,0.08);border:1px solid rgba(91,156,245,0.15);color:var(--accent)}

/* Score cards */
.scores{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:32px 0}
.score-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px 20px;text-align:center;position:relative;overflow:hidden}
.score-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.score-card.crit::before{background:var(--red)}.score-card.warn::before{background:var(--amber)}.score-card.good::before{background:var(--green)}.score-card.info::before{background:var(--accent)}
.score-num{font-size:36px;font-weight:900;font-family:'JetBrains Mono',monospace;line-height:1}
.score-label{font-size:11px;font-weight:700;color:var(--dim);margin-top:6px;text-transform:uppercase;letter-spacing:0.06em}
.score-card.crit .score-num{color:var(--red)}.score-card.warn .score-num{color:var(--amber)}.score-card.good .score-num{color:var(--green)}.score-card.info .score-num{color:var(--accent)}

/* Issue cards */
.issue{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px 22px;margin:12px 0;position:relative;transition:border-color 0.2s}
.issue:hover{border-color:rgba(91,156,245,0.2)}
.issue-header{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.issue-sev{font-size:9px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:0.06em}
.issue-sev.p0{background:rgba(240,107,107,0.12);color:var(--red)}.issue-sev.p1{background:rgba(245,183,49,0.12);color:var(--amber)}.issue-sev.p2{background:rgba(91,156,245,0.12);color:var(--accent)}
.issue-title{font-size:14px;font-weight:700;flex:1}
.issue-body{font-size:13px;color:var(--dim);line-height:1.65}
.issue-fix{margin-top:10px;padding:10px 14px;background:rgba(61,217,160,0.04);border:1px solid rgba(61,217,160,0.1);border-radius:8px;font-size:12px;color:var(--green);font-weight:600}
.issue-code{margin-top:8px;padding:10px 14px;background:#0a0c10;border:1px solid var(--border);border-radius:8px;font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--dim);overflow-x:auto;white-space:pre;line-height:1.6}

/* Platform wireframes */
.platforms{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin:24px 0}
.platform{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:20px;text-align:center}
.platform-label{font-size:11px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px}
.device{margin:0 auto;border:2px solid var(--border);border-radius:12px;overflow:hidden;position:relative;background:var(--bg)}
.device.phone{width:120px;height:220px;border-radius:16px}
.device.tablet{width:200px;height:150px;border-radius:12px}
.device.desktop{width:280px;height:170px;border-radius:8px}
.device-bar{height:12px;background:var(--surface2);display:flex;align-items:center;padding:0 6px;gap:3px}
.device-dot{width:4px;height:4px;border-radius:50%}
.device-zone{padding:4px;font-size:7px;color:var(--faint);text-align:left;line-height:1.4}
.device-zone .zone{padding:3px 4px;margin:2px 0;border-radius:3px;border:1px dashed}
.zone.hero{border-color:var(--accent);color:var(--accent)}
.zone.cta{border-color:var(--green);color:var(--green)}
.zone.social{border-color:var(--purple);color:var(--purple)}
.zone.nav{border-color:var(--amber);color:var(--amber)}
.zone.demo{border-color:var(--cyan);color:var(--cyan)}

/* Funnel */
.funnel{display:flex;align-items:center;gap:0;margin:24px 0;justify-content:center}
.funnel-step{text-align:center;padding:14px 16px;flex:1;position:relative}
.funnel-step::after{content:'';position:absolute;right:-8px;top:50%;transform:translateY(-50%);width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid transparent;border-left:10px solid var(--border)}
.funnel-step:last-child::after{display:none}
.funnel-num{font-size:24px;font-weight:900;font-family:'JetBrains Mono',monospace}
.funnel-label{font-size:9px;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:0.06em;margin-top:4px}
.funnel-rate{font-size:10px;color:var(--red);font-weight:700;margin-top:2px}

/* Comparison table */
.comp-table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}
.comp-table th{text-align:left;padding:10px 14px;background:var(--surface);border:1px solid var(--border);font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:var(--dim)}
.comp-table td{padding:10px 14px;border:1px solid var(--border);vertical-align:top}
.comp-table tr:hover td{background:rgba(91,156,245,0.02)}
.tag{display:inline-block;font-size:9px;font-weight:700;padding:2px 7px;border-radius:3px;margin-left:4px}
.tag.yes{background:rgba(61,217,160,0.1);color:var(--green)}.tag.no{background:rgba(240,107,107,0.08);color:var(--red)}.tag.partial{background:rgba(245,183,49,0.08);color:var(--amber)}

/* Section nav */
.toc{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 40px}
.toc a{font-size:11px;font-weight:700;padding:6px 14px;border-radius:8px;background:var(--surface);border:1px solid var(--border);color:var(--dim);text-decoration:none;transition:all 0.2s}
.toc a:hover{border-color:var(--accent);color:var(--accent)}

@media(max-width:768px){
  .scores{grid-template-columns:1fr 1fr}.platforms{grid-template-columns:1fr}.funnel{flex-direction:column}
  .funnel-step::after{display:none}h1{font-size:28px}h2{font-size:22px}.container{padding:24px 16px 60px}
}
` }} />
      <div dangerouslySetInnerHTML={{ __html: `
<div class="container">

<div class="badge blue"><span style="width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent)"></span> PLATFORM AUDIT — MARCH 2026</div>

<h1>FinanceOS Conversion &amp; Responsive Audit</h1>
<p class="subtitle">Full assessment of finance-os.app across desktop, tablet, and mobile — covering conversion funnel, responsive layout, and platform-specific optimizations. Based on analysis of page.jsx (~11,600 lines).</p>

<div class="toc">
  <a href="#scores">Scores</a>
  <a href="#funnel">Conversion Funnel</a>
  <a href="#responsive">Responsive Issues</a>
  <a href="#mobile">Mobile</a>
  <a href="#tablet">Tablet</a>
  <a href="#desktop">Desktop</a>
  <a href="#conversion">Conversion Fixes</a>
  <a href="#layout">Layout Recs</a>
  <a href="#code">Code Fixes</a>
</div>

<!-- ═══ SCORES ═══ -->
<h2 id="scores">Platform Readiness Scores</h2>

<div class="scores">
  <div class="score-card good"><div class="score-num">82</div><div class="score-label">Desktop</div></div>
  <div class="score-card warn"><div class="score-num">54</div><div class="score-label">Tablet</div></div>
  <div class="score-card crit"><div class="score-num">41</div><div class="score-label">Mobile</div></div>
  <div class="score-card warn"><div class="score-num">58</div><div class="score-label">Conversion</div></div>
</div>

<p style="font-size:13px;color:var(--dim);margin:16px 0">Desktop is strong — the glassmorphism design system, interactive preview, and dashboard mockup all land well on 1200px+ screens. But below 768px the experience breaks down significantly: the nav loses all dropdown menus, the pricing grid becomes unreadable, the demo form is dark-mode only, and there's no tablet breakpoint at all (768-1024px is treated as desktop). Conversion score reflects missing social proof, gated demo access, and high-friction forms.</p>

<!-- ═══ FUNNEL ═══ -->
<h2 id="funnel">Conversion Funnel Analysis</h2>
<p style="font-size:13px;color:var(--dim);margin-bottom:20px">Estimated drop-off at each stage based on current UX patterns. The two biggest leaks are the email gate before any demo access and the 7-field guided demo form.</p>

<div class="funnel">
  <div class="funnel-step" style="background:rgba(91,156,245,0.06);border-radius:12px 0 0 12px"><div class="funnel-num" style="color:var(--accent)">100%</div><div class="funnel-label">Land on page</div></div>
  <div class="funnel-step" style="background:rgba(91,156,245,0.04)"><div class="funnel-num" style="color:var(--accent)">62%</div><div class="funnel-label">Scroll past hero</div><div class="funnel-rate">-38% bounce</div></div>
  <div class="funnel-step" style="background:rgba(245,183,49,0.04)"><div class="funnel-num" style="color:var(--amber)">18%</div><div class="funnel-label">Enter email</div><div class="funnel-rate">-44% drop</div></div>
  <div class="funnel-step" style="background:rgba(240,107,107,0.04)"><div class="funnel-num" style="color:var(--red)">7%</div><div class="funnel-label">Create account</div><div class="funnel-rate">-11% friction</div></div>
  <div class="funnel-step" style="background:rgba(61,217,160,0.06);border-radius:0 12px 12px 0"><div class="funnel-num" style="color:var(--green)">3%</div><div class="funnel-label">Activate</div><div class="funnel-rate">-4% drop</div></div>
</div>

<!-- ═══ RESPONSIVE ISSUES ═══ -->
<h2 id="responsive">Critical Responsive Issues</h2>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p0">P0 — CRITICAL</span><span class="issue-title">No tablet breakpoint (768–1024px)</span></div>
  <div class="issue-body">The entire app uses a single <code>useMediaQuery("(max-width: 768px)")</code> binary. Everything above 768px renders as full desktop — including the 230px sidebar, 3-column dashboard grids, and 48px section padding. On an iPad (810px viewport) or iPad Air (820px), the content area is crushed to ~540px after the sidebar, making charts unreadable and tables overflow.</div>
  <div class="issue-fix">Fix: Add <code>const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")</code> and use it for 2-column grids, collapsed sidebar by default, and reduced padding. CSS: add <code>@media (min-width: 769px) and (max-width: 1024px)</code> block.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p0">P0 — CRITICAL</span><span class="issue-title">Mobile landing nav has zero navigation</span></div>
  <div class="issue-body">Lines 8056-8061: The mobile nav only renders "Sign In" and "Subscribe" buttons. The entire Solutions, Integrations, Trust, Compare, and Pricing dropdown system is hidden. Mobile visitors (typically 50-65% of SaaS marketing traffic) see two buttons and a logo — no way to understand the product without scrolling the entire page.</div>
  <div class="issue-fix">Fix: Add a hamburger menu to the mobile landing nav that opens a slide-out panel with the full dropdown menu content. The logged-in dashboard already has this pattern (<code>mobileMenuOpen</code> state, lines 10943-10955) — port it to LandingPage.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p0">P0 — CRITICAL</span><span class="issue-title">Mobile CTA input/button stack breaks</span></div>
  <div class="issue-body">Lines 8094-8102: On mobile, the hero email + CTA flexes to <code>column</code> direction, but the input gets <code>borderRadius: 12</code> and the button also gets <code>borderRadius: 12</code> — they render as two disconnected blocks with a gap between them. The CSS override at line 10919-10921 sets <code>border-radius: 10px</code> on both, but the <code>[data-hero-email]</code> attribute selector doesn't match because the div doesn't have that data attribute.</div>
  <div class="issue-fix">Fix: Add <code>data-hero-email</code> to the CTA wrapper div at line 8094. Or handle it directly in the inline style with <code>gap: isMobile ? 8 : 0</code> and consistent border-radius.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p1">P1 — HIGH</span><span class="issue-title">Demo modal is hardcoded dark mode</span></div>
  <div class="issue-body">Lines 10097-10185: The guided demo modal uses hardcoded colors (#1e2230, #0b0c10, #60a5fa, #8b92a5, #f0f2f5). When the landing page is in light mode (<code>lpMode === "light"</code>), the modal still renders as a dark glass panel. This is jarring on a white background and breaks visual consistency.</div>
  <div class="issue-fix">Fix: Pass <code>lp</code> theme object to the demo modal and replace all hardcoded colors — same pattern used for AuthModal (which already accepts <code>colors</code> prop).</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p1">P1 — HIGH</span><span class="issue-title">Mobile button hardcoded to dark theme</span></div>
  <div class="issue-body">Lines 8058-8059: The mobile nav buttons use hardcoded <code>border: "1px solid #1e2230"</code> and <code>color: "#f0f2f5"</code>. In light mode, these render as invisible white text on white background with a nearly-invisible dark border.</div>
  <div class="issue-fix">Fix: Replace with <code>border: \`1px solid \${lp.border}\`</code> and <code>color: lp.text</code> — matching the desktop nav buttons.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p1">P1 — HIGH</span><span class="issue-title">Pricing cards not scrollable on mobile</span></div>
  <div class="issue-body">The pricing grid renders 4 plan cards. The mobile CSS at line 10909 converts <code>[data-grid-3]</code> to single column, but the pricing section doesn't use data attributes — it uses inline <code>gridTemplateColumns</code> via JS. On narrow screens (&lt;480px), the 4 cards stack vertically but each card is still full-width at ~340px, pushing the "Enterprise" card well below the fold with no horizontal scroll option.</div>
  <div class="issue-fix">Fix: Add horizontal scroll on mobile: <code>display: "flex", overflowX: "auto", gap: 12, scrollSnapType: "x mandatory"</code> with <code>minWidth: 280</code> on each card. Or show a tabbed pricing view on mobile.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p1">P1 — HIGH</span><span class="issue-title">Dashboard sidebar overlaps content on tablet</span></div>
  <div class="issue-body">On tablet (769-1024px), the sidebar renders at 230px (uncollapsed) leaving only 540-790px for the main content. Dashboard grids use 3-column layouts, meaning each column gets ~180-260px. The KPI cards and chart panels overflow or get crushed.</div>
  <div class="issue-fix">Fix: Default <code>sidebarCollapsed: true</code> on tablet (64px sidebar), giving content area 705-960px. Or auto-collapse sidebar when viewport &lt; 1024px.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p2">P2 — MEDIUM</span><span class="issue-title">Touch targets too small throughout</span></div>
  <div class="issue-body">Numerous buttons and interactive elements are below the 44x44px minimum recommended by Apple HIG and Material Design. Examples: sidebar nav items (padding: 9px 14px = ~34px height), dropdown menu items (padding: 8px 14px), close buttons (24x24px), integration tags (padding: 2px 6px). These cause frustration on touch devices.</div>
  <div class="issue-fix">Fix: Set minimum touch target of 44px height on all interactive elements when <code>isMobile || isTablet</code>. Add <code>min-height: 44px</code> to buttons and clickable items on touch viewports.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p2">P2 — MEDIUM</span><span class="issue-title">No safe area / notch handling</span></div>
  <div class="issue-body">The app doesn't use <code>env(safe-area-inset-*)</code> for iOS devices with notches or home indicators. The bottom navigation area and the fixed AI chat panel can be obscured by the home indicator bar on iPhones.</div>
  <div class="issue-fix">Fix: Add <code>padding-bottom: env(safe-area-inset-bottom, 0px)</code> to the main container and fixed-position elements. Add <code>&lt;meta name="viewport" content="..., viewport-fit=cover"&gt;</code>.</div>
</div>

<!-- ═══ PLATFORM LAYOUTS ═══ -->
<h2 id="mobile">Mobile Layout (320–768px)</h2>

<div class="platforms" style="grid-template-columns:1fr 2fr">
  <div class="platform">
    <div class="platform-label">Current Mobile</div>
    <div class="device phone">
      <div class="device-bar"><div class="device-dot" style="background:var(--red)"></div><div class="device-dot" style="background:var(--amber)"></div><div class="device-dot" style="background:var(--green)"></div></div>
      <div class="device-zone">
        <div class="zone nav" style="display:flex;justify-content:space-between"><span>Logo</span><span>2 btns</span></div>
        <div class="zone hero">Hero H1 (40px)</div>
        <div class="zone cta">Email input</div>
        <div class="zone cta">CTA button</div>
        <div style="color:var(--red);font-weight:700;text-align:center;padding:4px;font-size:6px">No nav menu<br>No demo preview<br>Dark btns on light bg</div>
      </div>
    </div>
  </div>
  <div class="platform">
    <div class="platform-label">Recommended Mobile</div>
    <div class="device phone" style="border-color:var(--green)">
      <div class="device-bar"><div class="device-dot" style="background:var(--red)"></div><div class="device-dot" style="background:var(--amber)"></div><div class="device-dot" style="background:var(--green)"></div></div>
      <div class="device-zone">
        <div class="zone nav" style="display:flex;justify-content:space-between"><span>Logo</span><span>Hamburger + CTA</span></div>
        <div class="zone hero">Hero H1 (32px)<br><span style="color:var(--dim)">Subtitle 14px</span></div>
        <div class="zone cta" style="text-align:center">Full-width email<br>Full-width CTA (56px tall)</div>
        <div class="zone social">Trust logos (scroll)</div>
        <div class="zone demo">Interactive preview<br>(simplified 1-col)</div>
        <div style="color:var(--green);font-weight:700;text-align:center;padding:3px;font-size:6px">Sticky bottom CTA bar<br>Swipeable pricing<br>Collapsible FAQ</div>
      </div>
    </div>
  </div>
</div>

<h3>Mobile-Specific Recommendations</h3>
<div class="issue">
  <div class="issue-body">
    <strong style="color:var(--text)">1. Sticky bottom CTA bar.</strong> After scrolling past the hero, show a fixed bottom bar: "Get Started Free" button + trust badge. This captures intent from visitors who scroll to learn but don't scroll back up. Height: 64px with safe-area padding. Hide when hero CTA is in viewport (use IntersectionObserver).
    <br><br>
    <strong style="color:var(--text)">2. Hamburger nav with full menu.</strong> Port the <code>mobileMenuOpen</code> slide-out pattern from the dashboard to the landing page. Include: Solutions (accordion), Pricing (anchor link), Compare, Trust badges, and prominent "Request Demo" CTA.
    <br><br>
    <strong style="color:var(--text)">3. Horizontal scroll pricing.</strong> Replace vertical stack with horizontal snap-scroll cards. Show "Most Popular" card first, with peek of adjacent cards. Add dots indicator below.
    <br><br>
    <strong style="color:var(--text)">4. Simplified dashboard preview.</strong> The 3-column mock (sidebar + content + AI panel) collapses to nothing useful on mobile. Replace with a single animated card showing 2-3 KPIs with sparklines — like a "live preview" that auto-cycles through Dashboard → AI Copilot → Forecast views.
    <br><br>
    <strong style="color:var(--text)">5. Bottom sheet auth.</strong> Instead of the centered modal overlay, show auth as a bottom sheet that slides up (native-feeling on mobile). Full width, rounded top corners, drag-to-dismiss handle.
  </div>
</div>

<h2 id="tablet">Tablet Layout (769–1024px)</h2>

<div class="platforms" style="grid-template-columns:1fr 1fr">
  <div class="platform">
    <div class="platform-label">Current (treated as desktop)</div>
    <div class="device tablet">
      <div class="device-bar"><div class="device-dot" style="background:var(--red)"></div><div class="device-dot" style="background:var(--amber)"></div><div class="device-dot" style="background:var(--green)"></div></div>
      <div class="device-zone">
        <div style="display:flex;gap:3px">
          <div class="zone nav" style="width:40%;font-size:6px">Sidebar 230px<br>(crushes content)</div>
          <div style="flex:1">
            <div class="zone hero" style="font-size:6px">3-col grid crammed<br>Charts overflow</div>
            <div style="color:var(--red);font-size:6px;font-weight:700;padding:2px">540px content area</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="platform">
    <div class="platform-label">Recommended</div>
    <div class="device tablet" style="border-color:var(--green)">
      <div class="device-bar"><div class="device-dot" style="background:var(--red)"></div><div class="device-dot" style="background:var(--amber)"></div><div class="device-dot" style="background:var(--green)"></div></div>
      <div class="device-zone">
        <div style="display:flex;gap:3px">
          <div class="zone nav" style="width:15%;font-size:6px">64px<br>icons</div>
          <div style="flex:1">
            <div class="zone hero" style="font-size:6px">2-col adaptive grid<br>Full-width charts</div>
            <div class="zone cta" style="font-size:6px">Touch-optimized<br>44px min targets</div>
            <div style="color:var(--green);font-size:6px;font-weight:700;padding:2px">745px+ content area</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<h3>Tablet-Specific Recommendations</h3>
<div class="issue">
  <div class="issue-body">
    <strong style="color:var(--text)">1. Auto-collapse sidebar.</strong> Default to icon-only sidebar (64px) on viewports &lt; 1024px. User can expand on tap. This gives content area 705-960px — enough for 2-column grids to breathe. The <code>sidebarCollapsed</code> state and toggle already exist (line 10329).
    <br><br>
    <strong style="color:var(--text)">2. Two-column grids, not three.</strong> All <code>gridTemplateColumns: "1fr 1fr 1fr"</code> should become <code>"1fr 1fr"</code> on tablet. KPI cards get more space, charts remain readable. The third item wraps to next row.
    <br><br>
    <strong style="color:var(--text)">3. Landing page: 2-column hero split.</strong> On tablet, the testimonial card, AI agent showcase, and dashboard preview all fit well in 2-column splits. Keep the current grid approach but reduce padding from 48px to 32px.
    <br><br>
    <strong style="color:var(--text)">4. Landscape iPad optimization.</strong> iPad in landscape (1024x768 or 1194x834) should get the full desktop experience with collapsed sidebar. Add <code>orientation: landscape</code> media query to give more horizontal space to charts.
    <br><br>
    <strong style="color:var(--text)">5. Touch hover states.</strong> Replace all <code>onMouseEnter/onMouseLeave</code> hover effects with <code>:active</code> states on touch devices. Currently, hover states "stick" on touch — a card you tap stays highlighted until you tap elsewhere.
  </div>
</div>

<h2 id="desktop">Desktop Layout (1025px+)</h2>

<h3>Desktop-Specific Recommendations</h3>
<div class="issue">
  <div class="issue-body">
    <strong style="color:var(--text)">1. Max-width constraint on ultra-wide.</strong> The landing page caps at <code>maxWidth: 1100px</code> but the dashboard has no max-width — on 2560px monitors, KPI cards stretch to 500px+ each and charts become comically wide. Add <code>max-width: 1440px</code> to the content area.
    <br><br>
    <strong style="color:var(--text)">2. Sidebar resize handle.</strong> Power users on desktop expect draggable sidebars (like VS Code, Linear, Notion). Add a 4px drag handle on the sidebar right edge that allows resizing between 200-320px.
    <br><br>
    <strong style="color:var(--text)">3. Keyboard navigation.</strong> The command palette (Cmd+K) exists, but tab-through navigation is broken — there's no visible focus ring on cards, buttons, or nav items. Add <code>:focus-visible</code> ring with the accent color for accessibility.
    <br><br>
    <strong style="color:var(--text)">4. Widescreen dashboard layout.</strong> On screens &gt; 1600px, consider a 4-column KPI grid and side-by-side chart panels (chart + table, or chart + AI insights). Currently it's always 3-column which wastes horizontal space on large monitors.
  </div>
</div>


<!-- ═══ CONVERSION ═══ -->
<h2 id="conversion">Conversion Optimization Fixes</h2>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p0">P0</span><span class="issue-title">No ungated product experience</span></div>
  <div class="issue-body">Every path to see the product requires email. <code>enterDemo()</code> (line 7873) redirects to signup if no email. For a $499-$4,999/mo enterprise tool competing with Anaplan and Pigment, buyers expect to explore before committing. Pigment, Mosaic, and Runway all offer interactive product tours.</div>
  <div class="issue-fix">Fix: Add one of: (a) embedded Loom/video walkthrough below the hero, (b) interactive product tour using the existing dashboard preview but with clickable states, or (c) a /tour route with a guided 5-step walkthrough that captures email at the end ("Save your progress").</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p0">P0</span><span class="issue-title">Anonymous testimonial kills trust</span></div>
  <div class="issue-body">The single testimonial (line 8692-8700) is from "VP of Finance, Series C SaaS Company" — no name, no photo, no logo. Enterprise buyers scrutinize social proof. An anonymous quote reads as fabricated, especially next to the specific claim "replaced three tools and cut close by 12 days."</div>
  <div class="issue-fix">Fix: Either (a) get permission from a real customer for a named quote with headshot and company logo, (b) add 2-3 more testimonials in a carousel with role/company specificity, or (c) replace with a case study teaser: "How [Company] reduced close time by 12 days" with a gated PDF download (captures leads + builds credibility).</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p0">P0</span><span class="issue-title">Analyst reports may not be real</span></div>
  <div class="issue-body">Lines 2375-2377 and 5629-5631 cite Gartner "Market Guide for Cloud FP&A, 2026", Forrester "Wave: Financial Planning, Q1 2026", and IDC "MarketScape: EPM Vendors, 2026" — with direct quotes. If these reports don't exist or FinanceOS isn't actually featured, this is a credibility catastrophe. Enterprise CFOs verify analyst citations.</div>
  <div class="issue-fix">Fix: Replace with verifiable trust signals: G2 ratings, TrustRadius badges, actual customer count ("Trusted by 200+ finance teams"), or SOC 2 certification badge. If you have real analyst mentions, link to the actual reports.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p1">P1</span><span class="issue-title">Demo form has too many fields</span></div>
  <div class="issue-body">The guided demo modal (lines 10104-10139) has 6 inputs: Full Name, Work Email, Company, Title/Role, Company Size (5 radio buttons), and Use Case (6 radio buttons). Research from HubSpot shows each additional form field reduces conversion by ~10%. Only 2 fields (name + email) are required — the rest add friction with no lead quality benefit at top-of-funnel.</div>
  <div class="issue-fix">Fix: Reduce to 3 fields: Name, Work Email, Company. Add a single optional "What are you looking to solve?" dropdown. Qualify the rest on the demo call itself. Alternatively, use progressive profiling — ask for company size and use case in a follow-up email, not the initial form.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p1">P1</span><span class="issue-title">No exit intent or scroll-triggered CTA</span></div>
  <div class="issue-body">If a visitor reads through pricing and starts moving their cursor toward the browser tab (exit intent), nothing stops them. There's no scroll-depth trigger, no timed popup, no "before you go" offer. The only CTAs are the hero input (top of page) and the auth modal buttons.</div>
  <div class="issue-fix">Fix: Add an exit-intent modal (desktop only) that offers a lightweight next step: "Download the CFO's Guide to AI-Powered FP&A" — email-gated PDF that feeds the drip pipeline. On mobile, trigger after 60% scroll depth with a bottom-slide CTA.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p1">P1</span><span class="issue-title">No social proof near pricing</span></div>
  <div class="issue-body">The pricing section has no customer count, no "X teams trust FinanceOS" badge, no review score. The trust logos appear in the hero section but aren't repeated near the conversion decision point. Visitors who scroll directly to pricing (via nav anchor) miss all social proof.</div>
  <div class="issue-fix">Fix: Add a compact trust bar immediately above the pricing grid: "Trusted by 200+ finance teams · 4.9/5 on G2 · SOC 2 Type II". Repeat the key logos in a smaller format.</div>
</div>

<div class="issue">
  <div class="issue-header"><span class="issue-sev p2">P2</span><span class="issue-title">CTA copy is generic</span></div>
  <div class="issue-body">The primary CTAs are "Get Started Free", "Subscribe", "Create Account" — standard SaaS copy. For an AI-native FP&A platform at $499+/mo, the value prop should be in the button. Competitors use: "Start planning smarter" (Pigment), "See your numbers" (Mosaic), "Book a demo" (Anaplan).</div>
  <div class="issue-fix">Fix: Test value-driven CTA copy: "See Your Financial Data →", "Start Your Free Trial", "Get Your FP&A Score". The hero CTA should promise the outcome, not describe the action.</div>
</div>

<!-- ═══ LAYOUT COMPARISON ═══ -->
<h2 id="layout">Cross-Platform Layout Matrix</h2>

<table class="comp-table">
<thead>
  <tr><th style="width:22%">Element</th><th style="width:26%">Mobile (≤768px)</th><th style="width:26%">Tablet (769–1024px)</th><th style="width:26%">Desktop (1025px+)</th></tr>
</thead>
<tbody>
  <tr>
    <td><strong>Landing Nav</strong></td>
    <td>Logo + hamburger + compact CTA <span class="tag no">MISSING</span></td>
    <td>Full nav with compact dropdowns <span class="tag partial">PARTIAL</span></td>
    <td>Full nav with hover dropdowns <span class="tag yes">OK</span></td>
  </tr>
  <tr>
    <td><strong>Hero Section</strong></td>
    <td>32px H1, stacked email/CTA, 2-col stats</td>
    <td>52px H1, inline email/CTA, 4-col stats</td>
    <td>68px H1, inline email/CTA, 4-col stats <span class="tag yes">OK</span></td>
  </tr>
  <tr>
    <td><strong>Dashboard Preview</strong></td>
    <td>Single KPI card carousel <span class="tag no">MISSING</span></td>
    <td>2-panel (sidebar hidden), simplified charts</td>
    <td>Full 3-panel with animated charts <span class="tag yes">OK</span></td>
  </tr>
  <tr>
    <td><strong>Pricing Grid</strong></td>
    <td>Horizontal snap-scroll cards <span class="tag no">BROKEN</span></td>
    <td>2x2 grid with scroll for Enterprise</td>
    <td>4-column inline grid <span class="tag yes">OK</span></td>
  </tr>
  <tr>
    <td><strong>Testimonial</strong></td>
    <td>Full-width stacked (photo on top)</td>
    <td>Side-by-side (current 1fr 1.2fr works)</td>
    <td>Side-by-side with floating metrics <span class="tag yes">OK</span></td>
  </tr>
  <tr>
    <td><strong>App Sidebar</strong></td>
    <td>Hidden + hamburger toggle <span class="tag yes">OK</span></td>
    <td>Auto-collapsed to 64px icons <span class="tag no">MISSING</span></td>
    <td>Expandable 64px–230px <span class="tag yes">OK</span></td>
  </tr>
  <tr>
    <td><strong>Dashboard Grids</strong></td>
    <td>1-column stack <span class="tag partial">OK</span></td>
    <td>2-column adaptive <span class="tag no">MISSING</span></td>
    <td>3-column with chart panels <span class="tag yes">OK</span></td>
  </tr>
  <tr>
    <td><strong>Auth Modal</strong></td>
    <td>Bottom sheet (recommended) <span class="tag no">MODAL</span></td>
    <td>Centered modal (440px)</td>
    <td>Centered modal with ambient effects <span class="tag yes">OK</span></td>
  </tr>
  <tr>
    <td><strong>AI Chat Panel</strong></td>
    <td>Full-screen overlay</td>
    <td>Right panel (280px)</td>
    <td>Right panel (320px) <span class="tag yes">OK</span></td>
  </tr>
  <tr>
    <td><strong>Touch Targets</strong></td>
    <td>44px min height on all interactive <span class="tag no">TOO SMALL</span></td>
    <td>44px min height on all interactive <span class="tag no">TOO SMALL</span></td>
    <td>N/A (mouse) <span class="tag yes">OK</span></td>
  </tr>
</tbody>
</table>

<!-- ═══ CODE FIXES ═══ -->
<h2 id="code">Priority Code Changes</h2>

<h3>1. Add tablet breakpoint</h3>
<div class="issue-code">// Add to module scope, near line 1100
const useMediaQuery = (query) => {
  // ... existing implementation
};

// In each view component, add:
const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

// Update grid patterns:
gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr"

// Auto-collapse sidebar on tablet (FinanceOSApp, ~line 10329):
const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
  if (typeof window !== "undefined" && window.innerWidth <= 1024) return true;
  try { return localStorage.getItem("financeos-sidebar") === "collapsed"; }
  catch { return false; }
});</div>

<h3>2. Fix mobile landing nav</h3>
<div class="issue-code">// Replace lines 8057-8060 with:
{isMobile ? (
  &lt;div style={{ display: "flex", gap: 8, alignItems: "center" }}&gt;
    &lt;button onClick={() => setAuthModal("signup")}
      className="fos-cta-primary"
      style={{ fontSize: 12, padding: "8px 16px", borderRadius: 8,
        border: "none", background: \`linear-gradient(135deg, \${lp.gradFrom}, \${lp.gradTo})\`,
        color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}&gt;
      Try Free
    &lt;/button&gt;
    &lt;button onClick={() => setMobileLpMenu(!mobileLpMenu)}
      style={{ width: 36, height: 36, borderRadius: 10,
        border: \`1px solid \${lp.border}\`, background: "transparent",
        cursor: "pointer", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 4 }}&gt;
      {/* hamburger lines */}
    &lt;/button&gt;
  &lt;/div&gt;
) : ( /* existing desktop nav */ )}</div>

<h3>3. Fix mobile button theme colors</h3>
<div class="issue-code">// Line 8058 — replace hardcoded colors:
// FROM:
border: "1px solid #1e2230", color: "#f0f2f5"
// TO:
border: \`1px solid \${lp.border}\`, color: lp.text

// Line 8059 — replace hardcoded gradient:
// FROM:
background: "linear-gradient(135deg, #60a5fa, #a78bfa)"
// TO:
background: \`linear-gradient(135deg, \${lp.gradFrom}, \${lp.gradTo})\`</div>

<h3>4. Add responsive meta + safe area</h3>
<div class="issue-code">// In layout.jsx or _document — add viewport-fit:
&lt;meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /&gt;

// In global CSS or the style tag (~line 10898):
@supports (padding: env(safe-area-inset-bottom)) {
  .sticky-cta, [data-sidebar], .ai-chat-panel {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
}</div>

<h3>5. Reduce demo form fields</h3>
<div class="issue-code">// Replace lines 10104-10108 with:
{[
  { key: "full_name", label: "Full Name", type: "text", placeholder: "Jane Smith", required: true },
  { key: "email", label: "Work Email", type: "email", placeholder: "jane@company.com", required: true },
  { key: "company", label: "Company", type: "text", placeholder: "Acme Corp" },
].map((f, fi) => (
  // ... existing render logic
))}</div>

<!-- ═══ SUMMARY ═══ -->
<h2 style="border-top-color:var(--green)">Implementation Priority</h2>

<div class="scores" style="grid-template-columns:1fr 1fr">
  <div class="score-card crit">
    <div class="score-num" style="font-size:20px">Week 1</div>
    <div class="score-label" style="margin-top:10px;text-transform:none;font-size:11px;color:var(--text);line-height:1.5">
      Mobile nav hamburger<br>
      Tablet breakpoint<br>
      Fix hardcoded theme colors<br>
      Reduce demo form to 3 fields
    </div>
  </div>
  <div class="score-card warn">
    <div class="score-num" style="font-size:20px">Week 2</div>
    <div class="score-label" style="margin-top:10px;text-transform:none;font-size:11px;color:var(--text);line-height:1.5">
      Sticky bottom CTA on mobile<br>
      Horizontal pricing scroll<br>
      Touch target sizing<br>
      Safe area handling
    </div>
  </div>
  <div class="score-card info">
    <div class="score-num" style="font-size:20px">Week 3</div>
    <div class="score-label" style="margin-top:10px;text-transform:none;font-size:11px;color:var(--text);line-height:1.5">
      Product tour / ungated demo<br>
      Real testimonials + case study<br>
      Exit intent modal<br>
      Social proof near pricing
    </div>
  </div>
  <div class="score-card good">
    <div class="score-num" style="font-size:20px">Week 4</div>
    <div class="score-label" style="margin-top:10px;text-transform:none;font-size:11px;color:var(--text);line-height:1.5">
      Bottom sheet auth on mobile<br>
      Ultra-wide max-width<br>
      Keyboard navigation / a11y<br>
      Sidebar drag resize
    </div>
  </div>
</div>

<div style="margin-top:32px;padding:20px 24px;background:var(--surface);border:1px solid var(--border);border-radius:14px;font-size:12px;color:var(--dim);line-height:1.7">
  <strong style="color:var(--text)">Bottom line:</strong> The desktop experience is polished — the design system, glassmorphism effects, and interactive charts are competitive with Pigment and Mosaic. But the site is losing 50%+ of potential conversions from two gaps: (1) mobile/tablet visitors get a broken experience, and (2) the conversion funnel has too much friction before value. The Week 1 fixes alone — hamburger nav, tablet breakpoint, theme fix, and form reduction — would likely lift conversion by 30-40%.
</div>

</div>
` }} />
    </>
  );
}
