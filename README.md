# CFO Phase 2A — Depth + Subpages

## What ships

**Hub depth:** Operating Cash Flow, ROIC proxy, Burn Rate, YoY deltas, QoQ deltas, sparklines under Net Income / Burn Rate cards. Section panels (P&L, Cash, Budget, Forecast) become clickable with hover effects and chevron indicators.

**4 new subpages:**
- `/cfo/pnl` — Detailed P&L by account, month-by-month matrix, 12-month trailing view
- `/cfo/cash` — Cash position, working capital, monthly burn, runway, weekly inflow/outflow, monthly net cash chart
- `/cfo/budget` — Budget vs Actual variance grid, sorted by largest deviation, color-coded variance bars
- `/cfo/forecast` — 6-month linear + EMA forecast, bull/bear scenarios, backtest MAPE, forecast detail table

Each subpage uses a consistent dark-theme shell with tab navigation (Overview | P&L | Cash | Budget | Forecast), the "Live"/"Demo Data" badge, and back-to-hub link.

**Edge function v2** (`cfo-command-center`) now supports `?view=hub|pnl|cash|budget|forecast` — one function, 5 response shapes.

## Deploy

```bash
cd ~/Desktop/Castford
unzip -o ~/Downloads/cfo-phase-2a.zip -d .
python3 cfo-phase2a-patcher.py

# Redeploy the edge function
supabase functions deploy cfo-command-center \
  --no-verify-jwt --project-ref crecesswagluelvkesul

# Ship via PR
git checkout -b cfo-phase-2a
git add -A
git commit -m "CFO Phase 2A: extended KPIs + 4 subpages (P&L, Cash, Budget, Forecast)"
git push origin cfo-phase-2a
# then merge on GitHub
```

## Verify after merge

1. Visit `/cfo` — section panels should have → chevrons and hover lift
2. Click "P&L Statement" → lands on `/cfo/pnl` with month-by-month account drill-down
3. Click tabs to navigate between subpages; Live/Demo badge follows you
4. Check console on each page for `[CFO * brain] painted` logs

## What's still deferred

- ROIC is computed as net-margin proxy until balance-sheet data exists
- AR/AP show "Not tracked" until those tables are ingested
- Cash position uses net income as proxy until dedicated cash accounts are classified
- These are data-model gaps, not frontend gaps — refine when ingestion improves
