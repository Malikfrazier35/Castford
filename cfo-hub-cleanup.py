#!/usr/bin/env python3
"""
Castford CFO Hub Cleanup Patcher
=================================

Fixes:
  - Removes the dead inline `if (window.CastfordData)` script block
  - Removes <script src="/site/dashboard-brain.js" defer></script> from body
  - Ensures <script src="/site/cfo-command-brain.js" defer></script> is in <head>
  - Drops new cfo-command-brain.js v3 with comprehensive paint coverage

Run from ~/Desktop/Castford:
    python3 cfo-hub-cleanup.py
"""
import os, sys, re

ROOT = os.path.abspath(os.path.dirname(__file__))

if not os.path.exists(os.path.join(ROOT, 'middleware.js')):
    sys.exit("❌ Not in Castford repo root")

CFO_HTML = os.path.join(ROOT, 'public/site/dashboard/cfo.html')
BRAIN_PATH = os.path.join(ROOT, 'public/site/cfo-command-brain.js')

if not os.path.exists(CFO_HTML):
    sys.exit(f"❌ Missing: {CFO_HTML}")
if not os.path.exists(BRAIN_PATH):
    sys.exit(f"❌ Missing: {BRAIN_PATH} (did the unzip work?)")

print("▸ Castford CFO hub cleanup patcher")
print(f"  repo: {ROOT}\n")

with open(CFO_HTML, 'r') as f:
    html = f.read()
original = html

# ─── Step 1: Remove the dead inline script block ───
# Matches the entire <script>...if (window.CastfordData)...</script> block
inline_pattern = re.compile(
    r'<script>\s*document\.addEventListener\(\'DOMContentLoaded\',\s*async\s*function\(\)\s*\{\s*'
    r'if\s*\(window\.CastfordData\).*?'
    r'\}\s*\}\s*\)\s*;\s*</script>',
    re.DOTALL
)
match = inline_pattern.search(html)
if match:
    html = inline_pattern.sub('', html)
    print(f"  ✓ Removed dead inline CastfordData script block ({len(match.group(0))} bytes)")
else:
    # Try a simpler variant in case the formatting is different
    simple_pattern = re.compile(
        r'<script>\s*document\.addEventListener\(\'DOMContentLoaded\'.*?CastfordData.*?</script>',
        re.DOTALL
    )
    match = simple_pattern.search(html)
    if match:
        html = simple_pattern.sub('', html)
        print(f"  ✓ Removed dead inline CastfordData script block (variant match, {len(match.group(0))} bytes)")
    else:
        print("  ! Inline CastfordData block not found (may already be removed)")

# ─── Step 2: Remove dashboard-brain.js script tag ───
db_pattern = re.compile(
    r'<script\s+src="/site/dashboard-brain\.js"\s+defer\s*></script>\s*\n?'
)
n = len(db_pattern.findall(html))
if n > 0:
    html = db_pattern.sub('', html)
    print(f"  ✓ Removed dashboard-brain.js script tag ({n} occurrence{'s' if n>1 else ''})")
else:
    print("  ! dashboard-brain.js script tag not found (may already be removed)")

# ─── Step 3: Verify cfo-command-brain.js is in <head> ───
brain_check = re.compile(r'<script\s+src="/site/cfo-command-brain\.js"')
if brain_check.search(html):
    print("  ✓ cfo-command-brain.js already loaded")
else:
    # Insert before </head>
    head_close = html.find('</head>')
    if head_close == -1:
        print("  ❌ Could not find </head> — manual insertion required")
    else:
        injection = '  <script src="/site/cfo-command-brain.js" defer></script>\n  '
        html = html[:head_close] + injection + html[head_close:]
        print("  ✓ Injected cfo-command-brain.js script tag before </head>")

# ─── Write back if changed ───
if html != original:
    with open(CFO_HTML, 'w') as f:
        f.write(html)
    print(f"\n✓ Wrote {CFO_HTML}")
    print(f"  Bytes: {len(original)} → {len(html)} ({len(html)-len(original):+d})")
else:
    print("\n  No changes needed")

print("")
print("=" * 62)
print("CFO HUB CLEANUP READY.")
print("")
print("1. (No edge fn redeploy needed — only frontend changes.)")
print("")
print("2. Commit + push on a branch (PR required):")
print("   git checkout -b cfo-hub-cleanup")
print("   git add -A")
print("   git commit -m 'CFO hub cleanup: strip legacy brain + comprehensive paint v3'")
print("   git push origin cfo-hub-cleanup")
print("")
print("3. Open PR, merge on GitHub.")
print("")
print("4. Hard-refresh /cfo (Cmd+Shift+R) and check console for:")
print("   [CFO brain v3] KPIs painted: 6 / 6")
print("   [CFO brain v3] P&L rows painted: 5")
print("   [CFO brain v3] P&L bars painted: 3")
print("   [CFO brain v3] Cash bars painted: 6")
print("   [CFO brain v3] Cash Position pill painted: $X.XM")
print("   [CFO brain v3] Cash stats painted: 2")
print("   [CFO brain v3] re-firing paint @ 1500ms to win race")
print("")
print("5. Visually confirm:")
print("   - Revenue row no longer says $48.6M (should match top KPI)")
print("   - OpEx row no longer says ($33.1M)")
print("   - Net Income row matches top card ($5.1M, not $8.1M)")
print("   - Cash Position pill matches top OCF zone")
print("   - Current cash + Runway both reflect live data")
print("=" * 62)
