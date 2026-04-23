#!/usr/bin/env python3
"""
add-role-routes.py

Surgically adds /controller and /fpa rewrites to vercel.json so the
existing role dashboards become reachable as clean URLs.

Reads vercel.json, parses as JSON, adds 2 entries to the "rewrites" array
(skipping any that already exist), writes back with proper formatting.

Run from Castford repo root: python3 add-role-routes.py
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
if not os.path.isdir(os.path.join(ROOT, '.git')):
    print("ERROR: Run from Castford repo root", file=sys.stderr)
    sys.exit(1)

VERCEL_JSON = os.path.join(ROOT, 'vercel.json')
if not os.path.isfile(VERCEL_JSON):
    print(f"ERROR: vercel.json not found at {VERCEL_JSON}", file=sys.stderr)
    sys.exit(1)

# Routes to add
NEW_ROUTES = [
    {"source": "/controller", "destination": "/site/dashboard/controller.html"},
    {"source": "/fpa", "destination": "/site/dashboard/fpa.html"},
]

# Load existing config
with open(VERCEL_JSON) as f:
    config = json.load(f)

if 'rewrites' not in config:
    config['rewrites'] = []

# Build set of existing source paths to avoid duplicates
existing_sources = {r.get('source') for r in config['rewrites']}

added = []
for route in NEW_ROUTES:
    if route['source'] in existing_sources:
        print(f"  ⊙ {route['source']:20s} → already wired, skipped")
    else:
        config['rewrites'].append(route)
        added.append(route['source'])
        print(f"  ✓ {route['source']:20s} → {route['destination']}")

if not added:
    print()
    print("Nothing to do — both routes already exist.")
    sys.exit(0)

# Write back with consistent indentation matching existing style (2 spaces)
with open(VERCEL_JSON, 'w') as f:
    json.dump(config, f, indent=2)
    f.write('\n')  # trailing newline

print()
print(f"Added {len(added)} route(s) to vercel.json:")
for s in added:
    print(f"  {s}")
print()
print("Next steps:")
print()
print("  1. Verify the change:")
print("     git diff vercel.json")
print()
print("  2. Commit + push:")
print("     git checkout -b add-role-routes")
print("     git add vercel.json")
print("     git commit -m 'Wire /controller and /fpa role dashboard routes'")
print("     git push origin add-role-routes")
print()
print("  3. After Vercel deploys (~60s), verify:")
print("     open https://castford.com/controller")
print("     open https://castford.com/fpa")
