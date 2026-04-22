#!/usr/bin/env python3
"""
Castford Dashboard Brain v3 Deployment Patcher
==============================================

Changes:
  1. Drops in public/site/dashboard-chart-brain.js (new companion brain).
  2. Injects its <script> tag into every dashboard page that already loads
     dashboard-brain.js.
  3. Kills the two `total_revenue * 0.7` fake-math fallbacks in
     dashboard-brain.js (SOC 2 credibility fix).
  4. Wires cashflow.html with dashboard-brain.js + castford-charts.js.

Run from ~/Desktop/Castford:

    python3 brain-v3-patcher.py

Idempotent: safe to re-run. Makes a one-shot backup on first run
(dashboard-brain.js.bak-v2) so you can revert cleanly.
"""

import glob
import os
import re
import shutil
import sys

ROOT = os.path.abspath(os.path.dirname(__file__))

NEW_BRAIN_SRC = os.path.join(ROOT, "public", "site", "dashboard-chart-brain.js")
V2_BRAIN       = os.path.join(ROOT, "public", "site", "dashboard-brain.js")
CASHFLOW_HTML  = os.path.join(ROOT, "public", "site", "dashboard", "cashflow.html")

CHART_BRAIN_TAG = '<script src="/site/dashboard-chart-brain.js"></script>'
BRAIN_TAG       = '<script src="/site/dashboard-brain.js"></script>'
CHARTS_TAG      = '<script src="/site/castford-charts.js"></script>'

# ── Pre-flight ────────────────────────────────────────────────────────────
if not os.path.exists(NEW_BRAIN_SRC):
    sys.exit(f"❌ Missing {NEW_BRAIN_SRC} — unzip brain-v3.zip into the Castford repo first.")
if not os.path.exists(V2_BRAIN):
    sys.exit(f"❌ Missing {V2_BRAIN} — are you in the Castford repo root?")

print("▸ Castford Brain v3 patcher")
print(f"  root: {ROOT}\n")

# ── Step 1: Backup v2 brain on first run ──────────────────────────────────
backup = V2_BRAIN + ".bak-v2"
if not os.path.exists(backup):
    shutil.copy2(V2_BRAIN, backup)
    print(f"✓ Backup created: {os.path.relpath(backup, ROOT)}")
else:
    print(f"• Backup already exists: {os.path.relpath(backup, ROOT)}")

# ── Step 2: Kill the two fake-math lines in brain v2 ──────────────────────
with open(V2_BRAIN, "r", encoding="utf-8") as f:
    v2 = f.read()

fake_math_lines = [
    "if (t.includes('current') || t.includes('balance')) el.textContent = fmt(kpis.total_revenue * 0.7);",
    "if (el.textContent.trim().startsWith('$')) el.textContent = fmt(kpis.total_revenue * 0.7);",
]

removed = 0
for bad in fake_math_lines:
    if bad in v2:
        v2 = v2.replace(bad, "/* brain v3: removed fabricated * 0.7 fallback — show designed demo value instead */")
        removed += 1

if removed:
    with open(V2_BRAIN, "w", encoding="utf-8") as f:
        f.write(v2)
    print(f"✓ Killed {removed} fake-math fallback line(s) in dashboard-brain.js")
else:
    print("• Fake-math lines already removed (or not present)")

# ── Step 3: Inject chart-brain script tag into pages that load brain v2 ──
pages = sorted(
    glob.glob(os.path.join(ROOT, "public", "site", "dashboard", "*.html"))
    + [os.path.join(ROOT, "public", "site", "dashboard.html")]
)

injected, skipped = 0, 0
for p in pages:
    if not os.path.exists(p):
        continue
    with open(p, "r", encoding="utf-8", errors="replace") as f:
        html = f.read()
    if BRAIN_TAG not in html:
        continue  # not a brained page, skip
    if CHART_BRAIN_TAG in html:
        skipped += 1
        continue
    # Place the chart-brain tag right after dashboard-brain.js
    html = html.replace(BRAIN_TAG, BRAIN_TAG + "\n" + CHART_BRAIN_TAG)
    with open(p, "w", encoding="utf-8") as f:
        f.write(html)
    injected += 1
    print(f"✓ Injected chart-brain into {os.path.relpath(p, ROOT)}")

print(f"\n  Injections: {injected} new, {skipped} already present")

# ── Step 4: Wire cashflow.html with brain + charts (it has neither) ──────
if os.path.exists(CASHFLOW_HTML):
    with open(CASHFLOW_HTML, "r", encoding="utf-8") as f:
        cf = f.read()
    changed = False
    for tag in (BRAIN_TAG, CHARTS_TAG, CHART_BRAIN_TAG):
        if tag not in cf:
            if "</head>" in cf:
                cf = cf.replace("</head>", tag + "\n</head>", 1)
                changed = True
    if changed:
        with open(CASHFLOW_HTML, "w", encoding="utf-8") as f:
            f.write(cf)
        print("✓ Wired cashflow.html with brain + chart-brain + charts")
    else:
        print("• cashflow.html already wired")
else:
    print("• cashflow.html not found — skipping")

# ── Summary ──────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("BRAIN v3 DEPLOYED LOCALLY. Next:")
print("  git checkout -b brain-v3")
print("  git add -A")
print("  git commit -m 'Brain v3: chart animation override, kill fake * 0.7 math'")
print("  git push origin brain-v3")
print("=" * 60)
