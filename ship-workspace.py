#!/usr/bin/env python3
"""
ship-workspace.py

ONE SCRIPT that:
  1. Restores deleted FinanceOS-Standard-Dashboard.html from git history
  2. Rebrands FinanceOS → Castford (8 string variants)
  3. Recolors indigo/purple → Castford denim/gold (6 hex values)
  4. Saves as public/site/dashboard/live-dashboard.html
  5. Creates public/site/dashboard/landing.html (3-product picker)
  6. Patches vercel.json with 4 new routes
  7. Reports verification details

Safe: All operations are additive. Existing files untouched except vercel.json
(and that's a JSON-aware patch that preserves existing rewrites).

Run from Castford repo root: python3 ship-workspace.py
"""

import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
if not os.path.isdir(os.path.join(ROOT, '.git')):
    print("ERROR: Run from Castford repo root", file=sys.stderr)
    sys.exit(1)

SOURCE_COMMIT = 'a5fa4c6^'
SOURCE_PATH = 'public/FinanceOS-Complete-Deploy/02-dashboards/FinanceOS-Standard-Dashboard.html'
TARGET_PATH = 'public/site/dashboard/live-dashboard.html'
LANDING_PATH = 'public/site/dashboard/landing.html'

# Color mapping: original FinanceOS indigo/purple → Castford denim/gold
COLOR_MAP = {
    # Common indigo/purple values → denim
    '#2563eb': '#1A3F7A',  # main indigo → Castford deep denim
    '#2563EB': '#1A3F7A',
    '#3b82f6': '#5B7FCC',  # lighter blue → Castford denim
    '#3B82F6': '#5B7FCC',
    '#7c3aed': '#1A3F7A',  # purple → denim
    '#7C3AED': '#1A3F7A',
    '#8b5cf6': '#5B7FCC',  # lighter purple → denim
    '#8B5CF6': '#5B7FCC',
    '#9b8aff': '#5B7FCC',  # lavender → denim
    '#9B8AFF': '#5B7FCC',
    # Add a sprinkle of warm gold for accent
    '#a78bfa': '#C4884A',  # purple-300 → gold (accent)
    '#A78BFA': '#C4884A',
}

# Brand string replacements — order matters (longest first)
BRAND_MAP = [
    ('FinanceOS-Standard-Dashboard', 'Castford-Live-Dashboard'),
    ('FinanceOS Standard Dashboard', 'Castford Live Dashboard'),
    ('FinanceOS Dashboard', 'Castford Dashboard'),
    ('FinanceOS', 'Castford'),
    ('financeos-standard-dashboard', 'castford-live-dashboard'),
    ('financeos-dashboard', 'castford-dashboard'),
    ('financeos', 'castford'),
    ('FOS', 'Castford'),
]

# Asset path rewrites
ASSET_MAP = [
    ('/site/financeos-', '/site/castford-'),
    ('/financeos-', '/castford-'),
]

print("═══════════════════════════════════════════════════════════════")
print("  Castford Workspace Ship — Live Dashboard Restore + Routes")
print("═══════════════════════════════════════════════════════════════\n")

# ─────────────────────────────────────────────────────────────────────
# STEP 1: Restore from git
# ─────────────────────────────────────────────────────────────────────
print("[1/7] Restoring FinanceOS-Standard-Dashboard.html from git...")
try:
    raw = subprocess.run(
        ['git', 'show', f'{SOURCE_COMMIT}:{SOURCE_PATH}'],
        cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout
    print(f"  ✓ Recovered {len(raw):,} bytes from {SOURCE_COMMIT}")
except subprocess.CalledProcessError as e:
    print(f"  ✗ Git restore failed: {e.stderr}", file=sys.stderr)
    print(f"     Searched: {SOURCE_PATH}", file=sys.stderr)
    sys.exit(1)

# ─────────────────────────────────────────────────────────────────────
# STEP 2: Brand replacements (count occurrences for verification)
# ─────────────────────────────────────────────────────────────────────
print("\n[2/7] Rebranding FinanceOS → Castford...")
brand_changes = {}
content = raw
for old, new in BRAND_MAP:
    count = content.count(old)
    if count:
        content = content.replace(old, new)
        brand_changes[f'{old} → {new}'] = count
        print(f"  ✓ {old:40s} → {new:35s} ({count} replacements)")
if not brand_changes:
    print("  ⊙ No FinanceOS strings found (was already rebranded?)")

# ─────────────────────────────────────────────────────────────────────
# STEP 3: Color recoloring
# ─────────────────────────────────────────────────────────────────────
print("\n[3/7] Recoloring indigo/purple → Castford denim/gold...")
color_changes = {}
for old, new in COLOR_MAP.items():
    count = content.count(old)
    if count:
        content = content.replace(old, new)
        color_changes[f'{old} → {new}'] = count
        print(f"  ✓ {old} → {new}  ({count} replacements)")
if not color_changes:
    print("  ⊙ No matching color values found")

# ─────────────────────────────────────────────────────────────────────
# STEP 4: Asset paths
# ─────────────────────────────────────────────────────────────────────
print("\n[4/7] Rewriting asset paths...")
asset_changes = {}
for old, new in ASSET_MAP:
    count = content.count(old)
    if count:
        content = content.replace(old, new)
        asset_changes[f'{old} → {new}'] = count
        print(f"  ✓ {old} → {new}  ({count} replacements)")
if not asset_changes:
    print("  ⊙ No asset path changes needed")

# ─────────────────────────────────────────────────────────────────────
# STEP 5: Save live dashboard
# ─────────────────────────────────────────────────────────────────────
print(f"\n[5/7] Writing {TARGET_PATH}...")
target_full = os.path.join(ROOT, TARGET_PATH)
os.makedirs(os.path.dirname(target_full), exist_ok=True)
with open(target_full, 'w') as f:
    f.write(content)
size_kb = os.path.getsize(target_full) / 1024
print(f"  ✓ Saved ({size_kb:.1f} KB)")

# Verification: any FinanceOS strings remaining?
remaining_fos = sum(content.lower().count(s) for s in ['financeos', 'fos'])
if remaining_fos:
    print(f"  ⚠ Warning: {remaining_fos} 'financeos'/'fos' fragments may remain (manual check recommended)")
    # Find and show context for first few
    for match in re.finditer(r'.{30}(?:financeos|fos).{30}', content, re.IGNORECASE):
        print(f"     ... {match.group(0)} ...")
        break

# ─────────────────────────────────────────────────────────────────────
# STEP 6: Build landing page (3-product picker)
# ─────────────────────────────────────────────────────────────────────
print(f"\n[6/7] Writing {LANDING_PATH} (3-product picker)...")

LANDING_HTML = '''<!DOCTYPE html>
<html lang="en" data-theme="day">
<head>
<script>((d)=>{const t=localStorage.getItem("cf-theme");if(t)d.dataset.theme=t})(document.documentElement)</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Workspace — Castford</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--d:'Instrument Sans',-apple-system,sans-serif;--b:'DM Sans',-apple-system,sans-serif;--s:'Instrument Serif',Georgia,serif;--m:'Geist Mono',monospace;--ease:cubic-bezier(0.4,0,0.2,1)}
[data-theme="day"]{--bg:#F8F9FC;--s1:#FFFFFF;--s2:#E4E6ED;--ink:#0C0E1A;--t1:#1E2038;--t2:#475569;--t3:#94a3b8;--bdr:rgba(26,63,122,0.12);--prime:#1A3F7A;--denim:#5B7FCC;--gold:#C4884A;--prime-bg:rgba(91,127,204,0.06);--card-shadow:0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.03)}
[data-theme="night"]{--bg:#08081A;--s1:#101024;--s2:#16162E;--ink:#E8E6F0;--t1:#C4C0D8;--t2:#8A86A8;--t3:#5E5A78;--bdr:rgba(155,138,255,0.12);--prime:#5B7FCC;--denim:#5B7FCC;--gold:#C4884A;--prime-bg:rgba(91,127,204,0.08);--card-shadow:0 1px 3px rgba(0,0,0,0.2)}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{font-family:var(--b);background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;line-height:1.55;min-height:100vh;display:flex;flex-direction:column}

.topbar{padding:18px 32px;border-bottom:1px solid var(--bdr);background:var(--s1);display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--s);font-size:22px;letter-spacing:-0.01em;color:var(--ink);text-decoration:none}
.brand-mark{width:32px;height:32px;background:var(--prime);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--d);font-weight:800;font-size:14px}
.user-menu{display:flex;align-items:center;gap:14px;font-family:var(--m);font-size:12px;color:var(--t3)}
.user-name{color:var(--t1);font-weight:600}
.signout{padding:6px 14px;border:1px solid var(--bdr);border-radius:6px;font-family:var(--b);font-size:12px;font-weight:600;color:var(--t2);background:transparent;cursor:pointer;transition:all 0.15s}
.signout:hover{border-color:var(--prime);color:var(--prime)}

.main{flex:1;padding:60px 32px;max-width:1200px;margin:0 auto;width:100%}
.greeting{margin-bottom:48px;text-align:center}
.greeting-eyebrow{font-family:var(--m);font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.greeting h1{font-family:var(--s);font-size:42px;font-weight:400;letter-spacing:-0.02em;line-height:1.15;color:var(--ink);margin-bottom:14px}
.greeting p{font-size:15px;color:var(--t2);max-width:520px;margin:0 auto;line-height:1.6}

.products{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:48px}
.product-card{background:var(--s1);border:1px solid var(--bdr);border-radius:14px;padding:32px 28px;text-align:left;cursor:pointer;transition:all 0.25s var(--ease);text-decoration:none;color:inherit;position:relative;display:flex;flex-direction:column;min-height:280px;box-shadow:var(--card-shadow)}
.product-card:hover{border-color:var(--prime);transform:translateY(-3px);box-shadow:0 12px 32px rgba(26,63,122,0.1)}
.product-card .icon-box{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:18px;font-size:20px;color:#fff}
.product-card.live .icon-box{background:linear-gradient(135deg,#1A3F7A,#5B7FCC)}
.product-card.customize .icon-box{background:linear-gradient(135deg,#C4884A,#E8B470)}
.product-card.workforce .icon-box{background:linear-gradient(135deg,#5B7FCC,#1A3F7A)}
.product-card .tag{position:absolute;top:24px;right:24px;font-family:var(--m);font-size:9px;font-weight:700;letter-spacing:0.08em;padding:4px 8px;border-radius:4px;text-transform:uppercase}
.product-card.live .tag{background:rgba(26,122,69,0.1);color:#1A7A45}
.product-card.customize .tag{background:rgba(196,136,74,0.12);color:var(--gold)}
.product-card.workforce .tag{background:rgba(91,127,204,0.1);color:var(--denim)}
.product-card h3{font-family:var(--s);font-size:24px;font-weight:400;letter-spacing:-0.01em;color:var(--ink);margin-bottom:8px}
.product-card .desc{font-size:14px;color:var(--t2);line-height:1.55;margin-bottom:auto}
.product-card .cta{font-family:var(--m);font-size:11px;font-weight:600;letter-spacing:0.06em;color:var(--prime);text-transform:uppercase;margin-top:24px;display:flex;align-items:center;gap:6px}
.product-card .cta::after{content:'→';font-family:var(--b);font-size:14px;transition:transform 0.2s}
.product-card:hover .cta::after{transform:translateX(4px)}

.footer-actions{display:flex;justify-content:center;gap:24px;font-family:var(--m);font-size:12px;color:var(--t3)}
.footer-actions a{color:var(--t3);text-decoration:none;transition:color 0.15s}
.footer-actions a:hover{color:var(--prime)}

@media(max-width:900px){.products{grid-template-columns:1fr;gap:16px}.greeting h1{font-size:30px}}
</style>
</head>
<body>

<div class="topbar">
  <a href="/" class="brand">
    <span class="brand-mark">C</span>
    <span>Castford</span>
  </a>
  <div class="user-menu">
    <span class="user-name" id="user-name">Loading...</span>
    <button class="signout" onclick="window.location.href='/logout'">Sign out</button>
  </div>
</div>

<main class="main">
  <div class="greeting">
    <div class="greeting-eyebrow">Welcome back</div>
    <h1 id="greeting-name">Hello.</h1>
    <p>Pick a workspace to get started. All three are part of your Castford account — switch any time.</p>
  </div>

  <div class="products">
    <a href="/live" class="product-card live">
      <span class="tag">Live Data</span>
      <div class="icon-box">📊</div>
      <h3>Live Workspace</h3>
      <p class="desc">Your operational financial command center. Real GL data, KPI cards, charts, and AI Copilot — built for daily use.</p>
      <div class="cta">Open Workspace</div>
    </a>

    <a href="/customizer" class="product-card customize">
      <span class="tag">Theme Studio</span>
      <div class="icon-box">🎨</div>
      <h3>Customize Dashboard</h3>
      <p class="desc">Switch themes, pick templates, and shape how your workspace looks. Six visual styles, instant preview, persistent across all dashboards.</p>
      <div class="cta">Open Customizer</div>
    </a>

    <a href="/workforce" class="product-card workforce">
      <span class="tag">HR Module</span>
      <div class="icon-box">👥</div>
      <h3>Workforce Planning</h3>
      <p class="desc">Position-level headcount, hiring plan, comp bands, and 12-month forecast. Rolls up into department plans and forward modeling.</p>
      <div class="cta">Open Workforce</div>
    </a>
  </div>

  <div class="footer-actions">
    <a href="/cfo">CFO Hub →</a>
    <a href="/controller">Controller →</a>
    <a href="/fpa">FP&A →</a>
    <a href="/ceo">CEO Hub →</a>
  </div>
</main>

<script type="module">
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const sb = createClient(
  'https://crecesswagluelvkesul.supabase.co',
  'sb_publishable_Z5leOqWVPuuij8t0hzrxOw_GPaUJTej',
  { auth: { persistSession: true, storageKey: 'cf-auth', autoRefreshToken: true } }
);

(async () => {
  const { data } = await sb.auth.getSession();
  if (!data?.session) {
    window.location.href = '/login?next=' + encodeURIComponent('/workspace');
    return;
  }
  const user = data.session.user;
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'there';
  const firstName = name.split(' ')[0];
  document.getElementById('user-name').textContent = name;
  document.getElementById('greeting-name').textContent = 'Hello, ' + firstName + '.';
})();
</script>

</body>
</html>
'''

landing_full = os.path.join(ROOT, LANDING_PATH)
with open(landing_full, 'w') as f:
    f.write(LANDING_HTML)
print(f"  ✓ Saved ({os.path.getsize(landing_full) / 1024:.1f} KB)")

# ─────────────────────────────────────────────────────────────────────
# STEP 7: Patch vercel.json with 4 new routes
# ─────────────────────────────────────────────────────────────────────
print(f"\n[7/7] Patching vercel.json with 4 new routes...")

VERCEL_JSON = os.path.join(ROOT, 'vercel.json')
with open(VERCEL_JSON) as f:
    config = json.load(f)

if 'rewrites' not in config:
    config['rewrites'] = []

NEW_ROUTES = [
    {"source": "/workspace", "destination": "/site/dashboard/landing.html"},
    {"source": "/dashboard", "destination": "/site/dashboard/landing.html"},
    {"source": "/live", "destination": "/site/dashboard/live-dashboard.html"},
    {"source": "/customizer", "destination": "/site/dashboard/customizer-v2.html"},
    {"source": "/workforce", "destination": "/site/dashboard/workspace.html"},
]

existing_sources = {r.get('source') for r in config['rewrites']}
added_routes = []
for route in NEW_ROUTES:
    if route['source'] in existing_sources:
        print(f"  ⊙ {route['source']:14s} → already wired, skipped")
    else:
        config['rewrites'].append(route)
        added_routes.append(route['source'])
        print(f"  ✓ {route['source']:14s} → {route['destination']}")

if added_routes:
    with open(VERCEL_JSON, 'w') as f:
        json.dump(config, f, indent=2)
        f.write('\n')

# ─────────────────────────────────────────────────────────────────────
# REPORT
# ─────────────────────────────────────────────────────────────────────
print()
print("═══════════════════════════════════════════════════════════════")
print("  Done. Verification report:")
print("═══════════════════════════════════════════════════════════════")
print(f"  Files created:    2")
print(f"    {TARGET_PATH}    ({os.path.getsize(target_full) / 1024:.1f} KB)")
print(f"    {LANDING_PATH}    ({os.path.getsize(landing_full) / 1024:.1f} KB)")
print(f"  Brand replacements: {sum(brand_changes.values())}")
print(f"  Color replacements: {sum(color_changes.values())}")
print(f"  Asset path changes: {sum(asset_changes.values())}")
print(f"  Routes added:       {len(added_routes)}")
print()
print("Next steps:")
print()
print("  1. Quick eyeball:")
print(f"     open {TARGET_PATH}    (in browser, file:// — see if it renders)")
print(f"     open {LANDING_PATH}")
print()
print("  2. Commit + push:")
print("     git checkout -b ship-workspace-landing")
print(f"     git add vercel.json {TARGET_PATH} {LANDING_PATH}")
print('     git commit -m "Restore live dashboard, add 3-product workspace landing"')
print("     git push origin ship-workspace-landing")
print()
print("  3. Open the GitHub URL it prints, merge.")
print()
print("  4. After Vercel deploys (~60s), verify in browser:")
print("     https://castford.com/workspace    (landing with 3 cards)")
print("     https://castford.com/live         (restored live dashboard)")
print("     https://castford.com/customizer   (theme picker)")
print("     https://castford.com/workforce    (HR planning)")
print()
print("  5. NOT touched (intentional):")
print("     - auth-guard.js redirect target  (to avoid lockout risk; do tomorrow)")
print("     - /cfo, /controller, /fpa routes (legacy deep-links preserved)")
