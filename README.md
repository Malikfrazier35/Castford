# Castford Brain v3 Deployment

## What this does
1. Adds `public/site/dashboard-chart-brain.js` — new companion brain that overrides chart animation attributes with live API data.
2. Injects its `<script>` tag into every dashboard page that already loads `dashboard-brain.js`.
3. Removes two `total_revenue * 0.7` fake-math fallback lines from `dashboard-brain.js` (SOC 2 credibility fix).
4. Wires `cashflow.html` with brain + charts scripts.

## What's wired
- **CFO pages** (cfo.html, cfo-light.html): `.pl-bar-fill` widths from Actual/Budget ratio, `.cash-bar` heights from last 6 months of revenue
- **Standard page** (standard.html): `.kpi-value[data-target]` updated with live KPIs
- **All brained pages**: fake `* 0.7` math removed

## What's deferred (blocked by missing API data)
- CEO rule-of-40 fill, segment rows
- Controller AR aging, close-bar progress  
- FPA budget-vs-actual rows, scenario ranges

These need `dashboard-summary` to expose `rule_of_40`, `ar_aging`, `segments`, `scenario_ranges` before frontend work matters.

## Deploy
```bash
cd ~/Desktop/Castford
unzip -o ~/Downloads/brain-v3.zip -d .
python3 brain-v3-patcher.py
git checkout -b brain-v3
git add -A
git commit -m "Brain v3: chart animation override, kill fake * 0.7 math"
git push origin brain-v3
```

Then open the PR link GitHub returns, merge, `git checkout main && git pull`.

## Rollback
The patcher creates `dashboard-brain.js.bak-v2` on first run. If anything misbehaves:
```bash
mv public/site/dashboard-brain.js.bak-v2 public/site/dashboard-brain.js
# then remove dashboard-chart-brain.js and re-deploy
```

## Verify after deploy
Open any dashboard with real GL data, check the browser console:
```
[Castford chart brain] live: pl-bars=2 cash-bars=6 kpi-targets=4
```
If you see `demo mode, skipping` — the API said `demo_mode: true` (no GL data connected yet) and the designed demo visuals remain intact. That's correct behavior.
