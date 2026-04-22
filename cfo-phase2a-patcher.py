#!/usr/bin/env python3
"""
Castford CFO Phase 2A Deployment Patcher
=========================================

Changes:
  1. Drops in new files (4 subpages, 4 brains, shell, v2 brain, v2 edge fn).
  2. Replaces middleware.js with extended route table.
  3. Gitignore entries for new backups.

Run from ~/Desktop/Castford:
    python3 cfo-phase2a-patcher.py

Idempotent — safe to re-run.
"""

import os
import sys

ROOT = os.path.abspath(os.path.dirname(__file__))

if not os.path.exists(os.path.join(ROOT, 'middleware.js')):
    sys.exit("❌ Not in Castford repo root (middleware.js missing)")

# All new files should already be in place from the unzip.
REQUIRED = [
    'middleware.js',
    'supabase/functions/cfo-command-center/index.ts',
    'public/site/cfo-command-brain.js',
    'public/site/cfo-subpage-shell.js',
    'public/site/cfo-pnl-brain.js',
    'public/site/cfo-cash-brain.js',
    'public/site/cfo-budget-brain.js',
    'public/site/cfo-forecast-brain.js',
    'public/site/dashboard/cfo/pnl.html',
    'public/site/dashboard/cfo/cash.html',
    'public/site/dashboard/cfo/budget.html',
    'public/site/dashboard/cfo/forecast.html',
]

print("▸ Castford CFO Phase 2A patcher")
print(f"  repo: {ROOT}\n")

missing = [p for p in REQUIRED if not os.path.exists(os.path.join(ROOT, p))]
if missing:
    sys.exit(f"❌ Missing expected files after unzip:\n  " + "\n  ".join(missing))

print("✓ All Phase 2A files in place")

# Make sure .gitignore has the backup pattern
gi = os.path.join(ROOT, '.gitignore')
patterns = ['*.bak-phase1', '*.bak-phase2a', '*.bak-v2', '*.bak-login-fix']
if os.path.exists(gi):
    with open(gi, 'r', encoding='utf-8') as f:
        existing = f.read()
    added = []
    for p in patterns:
        if p not in existing:
            existing += '\n' + p
            added.append(p)
    if added:
        with open(gi, 'w', encoding='utf-8') as f:
            f.write(existing)
        print(f"✓ Added {len(added)} pattern(s) to .gitignore")

print("\n" + "=" * 62)
print("PHASE 2A READY TO SHIP.")
print("")
print("1. Redeploy the cfo-command-center edge function (v2):")
print("   supabase functions deploy cfo-command-center \\")
print("     --no-verify-jwt --project-ref crecesswagluelvkesul")
print("")
print("2. Commit + push on a branch (PR required):")
print("   git checkout -b cfo-phase-2a")
print("   git add -A")
print("   git commit -m 'CFO Phase 2A: extended KPIs + 4 subpages (P&L, Cash, Budget, Forecast)'")
print("   git push origin cfo-phase-2a")
print("")
print("3. Open the PR, merge on GitHub.")
print("")
print("4. Verify at https://castford.com/cfo — section cards should now be clickable")
print("   → /cfo/pnl, /cfo/cash, /cfo/budget, /cfo/forecast")
print("=" * 62)
