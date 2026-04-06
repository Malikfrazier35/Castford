#!/usr/bin/env node
/**
 * Castford — Shared Template Build System (Option A)
 *
 * Injects consistent navigation, footer, and shared CSS variables
 * across all HTML marketing pages from a single source of truth.
 *
 * Usage: node build.js
 *
 * What it does:
 * 1. Replaces <nav>...</nav> (or .nav element) with canonical navigation
 * 2. Replaces <footer>...</footer> with canonical footer
 * 3. Ensures consistent CSS custom properties across files
 * 4. Preserves all page-specific content and styles
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;

// ═══════════════════════════════════════════════════
// CANONICAL NAVIGATION — Single source of truth
// ═══════════════════════════════════════════════════
const NAV_CSS = `
/* ===== SHARED NAVIGATION ===== */
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid var(--border-light,#F1F5F9)}
.nav-inner{max-width:var(--max-w,1200px);margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;letter-spacing:-0.01em;text-decoration:none;color:var(--text,#0F172A)}
.logo-dot{width:9px;height:9px;background:var(--green,#10B981);border-radius:50%}
.nav-links{display:flex;gap:4px;font-size:14px;font-weight:500;align-items:center;position:relative}
.nav-links a,.nav-dropdown>span{color:var(--muted,#64748B);transition:color .15s;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;display:inline-flex;align-items:center;gap:4px;text-decoration:none}
.nav-links a:hover,.nav-dropdown:hover>span{color:var(--text,#0F172A);background:rgba(0,0,0,0.03)}
.nav-dropdown{position:relative}
.nav-dropdown .dd-menu{position:absolute;top:100%;left:0;min-width:220px;background:#fff;border:1px solid var(--border,#E2E8F0);border-radius:12px;padding:8px;opacity:0;visibility:hidden;transform:translateY(4px);transition:all .2s ease;box-shadow:0 10px 30px rgba(0,0,0,0.08);z-index:200}
.nav-dropdown:hover .dd-menu{opacity:1;visibility:visible;transform:translateY(0)}
.dd-menu a{display:flex;padding:10px 12px;border-radius:8px;font-size:13px;color:var(--text-secondary,#334155)!important;text-decoration:none}
.dd-menu a:hover{background:var(--bg-alt,#F8FAFC)}
.nav-right{display:flex;align-items:center;gap:10px}
.nav-right a{font-size:14px;font-weight:500;color:var(--muted,#64748B);padding:8px 12px;transition:color .15s;text-decoration:none}
.nav-right a:hover{color:var(--text,#0F172A)}
.btn-nav{display:inline-flex;align-items:center;justify-content:center;padding:8px 18px;border-radius:8px;font-weight:600;font-size:13px;border:none;cursor:pointer;transition:all .15s ease;white-space:nowrap;text-decoration:none}
.btn-nav-primary{background:var(--green,#10B981);color:#fff}
.btn-nav-primary:hover{background:#059669;box-shadow:0 2px 12px rgba(16,185,129,0.25)}
.nav-arrow{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2}
@media(max-width:900px){.nav-links{display:none}.nav-right{display:none}}
`;

const NAV_HTML = `
<nav>
  <div class="nav-inner">
    <a href="Castford-Landing-V3.html" class="logo"><span class="logo-dot"></span>Castford</a>
    <div class="nav-links">
      <div class="nav-dropdown">
        <span>Solutions <svg class="nav-arrow" viewBox="0 0 12 12"><polyline points="3,4.5 6,7.5 9,4.5"/></svg></span>
        <div class="dd-menu">
          <a href="Castford-Solutions-Digital.html">Digital Business</a>
          <a href="Castford-xPA-Planning-V2.html">Cross-Department Planning</a>
          <a href="Castford-Pain-Points-Solutions.html">Pain Points &amp; Solutions</a>
        </div>
      </div>
      <a href="Castford-Integrations-V3.html">Integrations</a>
      <div class="nav-dropdown">
        <span>Trust <svg class="nav-arrow" viewBox="0 0 12 12"><polyline points="3,4.5 6,7.5 9,4.5"/></svg></span>
        <div class="dd-menu">
          <a href="Castford-Security-Zero-Trust.html">Security &amp; Privacy</a>
        </div>
      </div>
      <a href="Castford-Pricing-V3.html">Pricing</a>
      <div class="nav-dropdown">
        <span>Compare <svg class="nav-arrow" viewBox="0 0 12 12"><polyline points="3,4.5 6,7.5 9,4.5"/></svg></span>
        <div class="dd-menu">
          <a href="Castford-vs-Competitors-V2.html">vs Competitors</a>
          <a href="Castford-V3-vs-Current-Comparison.html">V3 Improvements</a>
        </div>
      </div>
      <div class="nav-dropdown">
        <span>Resources <svg class="nav-arrow" viewBox="0 0 12 12"><polyline points="3,4.5 6,7.5 9,4.5"/></svg></span>
        <div class="dd-menu">
          <a href="Castford-Resources-V2.html">Resource Library</a>
          <a href="Castford-Whats-New-V2.html">What's New</a>
        </div>
      </div>
    </div>
    <div class="nav-right">
      <a href="Castford-Login-V2.html">Sign In</a>
      <a href="Castford-Pricing-V3.html" class="btn-nav btn-nav-primary">Subscribe</a>
    </div>
  </div>
</nav>
`;

// ═══════════════════════════════════════════════════
// CANONICAL FOOTER — Single source of truth
// ═══════════════════════════════════════════════════
const FOOTER_CSS = `
/* ===== SHARED FOOTER ===== */
footer{background:var(--bg-alt,#F8FAFC);border-top:1px solid var(--border,#E2E8F0);padding:56px 24px 24px}
.footer-inner{max-width:var(--max-w,1200px);margin:0 auto;display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:40px;margin-bottom:40px}
.footer-brand{display:flex;flex-direction:column;gap:10px}
.footer-brand p{font-size:13px;color:var(--muted,#64748B);line-height:1.6;max-width:240px}
.footer-col{display:flex;flex-direction:column;gap:8px}
.footer-col h5{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--text,#0F172A);margin-bottom:4px}
.footer-col a{font-size:13px;color:var(--muted,#64748B);text-decoration:none;transition:color .15s}
.footer-col a:hover{color:var(--text,#0F172A)}
.footer-bottom{max-width:var(--max-w,1200px);margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid var(--border,#E2E8F0);font-size:12px;color:var(--muted,#64748B)}
.footer-bottom-links{display:flex;gap:20px}
.footer-bottom-links a{color:var(--muted,#64748B);text-decoration:none;transition:color .15s}
.footer-bottom-links a:hover{color:var(--text,#0F172A)}
@media(max-width:768px){.footer-inner{grid-template-columns:1fr 1fr;gap:24px}}
`;

const FOOTER_HTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="Castford-Landing-V3.html" class="logo"><span class="logo-dot"></span>Castford</a>
      <p>AI-native financial planning & analysis for modern finance teams.</p>
    </div>
    <div class="footer-col">
      <h5>Product</h5>
      <a href="Castford-Landing-V3.html">Platform</a>
      <a href="Castford-xPA-Planning-V2.html">AI Copilot</a>
      <a href="Castford-Integrations-V3.html">Integrations</a>
      <a href="Castford-Pricing-V3.html">Pricing</a>
      <a href="Castford-Security-Zero-Trust.html">Security</a>
    </div>
    <div class="footer-col">
      <h5>Solutions</h5>
      <a href="Castford-Solutions-Digital.html">SaaS</a>
      <a href="Castford-Solutions-Digital.html">E-Commerce</a>
      <a href="Castford-Solutions-Digital.html">Enterprise</a>
      <a href="Castford-Solutions-Digital.html">Startups</a>
    </div>
    <div class="footer-col">
      <h5>Resources</h5>
      <a href="Castford-Resources-V2.html">Resource Library</a>
      <a href="Castford-Whats-New-V2.html">Changelog</a>
      <a href="Castford-Resources-V2.html">Blog</a>
    </div>
    <div class="footer-col">
      <h5>Company</h5>
      <a href="#">About</a>
      <a href="#">Careers</a>
      <a href="#">Contact</a>
      <a href="Castford-Security-Zero-Trust.html">Privacy</a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>&copy; 2026 Castford, Inc.</span>
    <div class="footer-bottom-links">
      <a href="Castford-Security-Zero-Trust.html">Privacy</a>
      <a href="#">Terms</a>
      <a href="Castford-Security-Zero-Trust.html">Security</a>
    </div>
  </div>
</footer>
`;

// ═══════════════════════════════════════════════════
// SHARED CSS VARIABLES
// ═══════════════════════════════════════════════════
const SHARED_VARS = `
:root{
  --green:#10B981;--green-50:#ECFDF5;--green-100:#D1FAE5;--green-200:#A7F3D0;--green-600:#059669;--green-700:#047857;
  --cyan:#0891B2;--purple:#7C3AED;--blue:#2563EB;--amber:#D97706;--red:#EF4444;
  --bg:#FFFFFF;--bg-alt:#F8FAFC;--bg-warm:#FAFAF9;
  --text:#0F172A;--text-secondary:#334155;--muted:#64748B;--light:#94A3B8;
  --border:#E2E8F0;--border-light:#F1F5F9;
  --shadow-xs:0 1px 2px rgba(0,0,0,0.04);--shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:0 4px 6px -1px rgba(0,0,0,0.07),0 2px 4px -2px rgba(0,0,0,0.04);
  --shadow-lg:0 10px 15px -3px rgba(0,0,0,0.07),0 4px 6px -4px rgba(0,0,0,0.04);
  --shadow-xl:0 20px 25px -5px rgba(0,0,0,0.07),0 8px 10px -6px rgba(0,0,0,0.04);
  --font:'DM Sans',system-ui,-apple-system,sans-serif;--mono:'JetBrains Mono',monospace;
  --radius:12px;--radius-lg:16px;--radius-xl:20px;
  --max-w:1200px;
}`;

// ═══════════════════════════════════════════════════
// FILES TO PROCESS
// ═══════════════════════════════════════════════════
const TARGET_FILES = [
  'Castford-Landing-V3.html',
  'Castford-Integrations-V3.html',
  'Castford-Solutions-Digital.html',
  'Castford-Pain-Points-Solutions.html',
  'Castford-Whats-New-V2.html',
  'Castford-Login-V2.html',
  'Castford-Resources-V2.html',
  'Castford-Security-Zero-Trust.html',
  'Castford-V3-vs-Current-Comparison.html',
  'Castford-Build-Inventory.html',
  'Castford-Pricing-V3.html',
  'Castford-vs-Competitors-V2.html',
  'Castford-xPA-Planning-V2.html',
  'Castford-Enterprise-Pricing-Model.html',
  'Castford-Ad-Campaign-V2.html',
];

// ═══════════════════════════════════════════════════
// BUILD LOGIC
// ═══════════════════════════════════════════════════
function processFile(filename) {
  const filepath = path.join(DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`  SKIP: ${filename} (not found)`);
    return false;
  }

  let html = fs.readFileSync(filepath, 'utf-8');
  let changes = [];

  // 1. Replace navigation
  // Handle <nav>...</nav> pattern (V3 light pages)
  const navTagMatch = html.match(/<nav[\s>][\s\S]*?<\/nav>/);
  if (navTagMatch) {
    html = html.replace(navTagMatch[0], NAV_HTML.trim());
    changes.push('nav');
  }
  // Handle .nav class pattern (dark pages converted) - look for <div class="nav"> or <header class="nav">
  const navDivMatch = html.match(/<(?:div|header)[^>]*class="nav"[^>]*>[\s\S]*?<\/(?:div|header)>/);
  if (navDivMatch && !navTagMatch) {
    html = html.replace(navDivMatch[0], NAV_HTML.trim());
    changes.push('nav');
  }

  // 2. Replace footer
  const footerMatch = html.match(/<footer[\s>][\s\S]*?<\/footer>/);
  if (footerMatch) {
    html = html.replace(footerMatch[0], FOOTER_HTML.trim());
    changes.push('footer');
  }

  // 3. Inject nav CSS if not already present (add before first CSS comment or at start of <style>)
  if (!html.includes('.nav-dropdown .dd-menu')) {
    // Find the first <style> tag and inject after it
    html = html.replace(/<style>/, '<style>\n' + NAV_CSS);
    changes.push('nav-css');
  }

  // 4. Inject footer CSS if not already present
  if (!html.includes('.footer-inner') || !html.includes('.footer-brand p')) {
    // Only inject if footer CSS seems missing or incomplete
    if (html.includes('</style>') && !html.includes('.footer-bottom-links a:hover')) {
      html = html.replace('</style>', FOOTER_CSS + '\n</style>');
      changes.push('footer-css');
    }
  }

  // 5. Update year in footer
  html = html.replace(/© 2024/g, '© 2026');

  if (changes.length > 0) {
    fs.writeFileSync(filepath, html, 'utf-8');
    console.log(`  OK: ${filename} — updated [${changes.join(', ')}]`);
    return true;
  } else {
    console.log(`  OK: ${filename} — no changes needed`);
    return false;
  }
}

// ═══════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════
console.log('Castford Build System — Applying shared templates\n');
console.log(`Processing ${TARGET_FILES.length} files...\n`);

let updated = 0;
for (const file of TARGET_FILES) {
  if (processFile(file)) updated++;
}

console.log(`\nDone. ${updated} files updated.`);
