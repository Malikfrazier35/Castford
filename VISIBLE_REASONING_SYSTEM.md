# Castford Visible Reasoning System

**Status:** Design spec — ready for Phase 2C-1.5 implementation
**Owner:** Malik Frazier · Financial Holding LLC
**Last updated:** April 25, 2026

---

## 1. Philosophy

Castford's product banner says "AI Copilot powered by Claude — visible reasoning for every financial insight." That promise has to render in the UI, not just the marketing.

The Visible Reasoning System is the design language that makes the product's intelligence legible. Every AI-generated number, projection, alert, or recommendation comes with the option to see how it was produced. CFOs don't trust black boxes; they trust transparent reasoning chains they can validate.

**Three principles:**

1. **Show the work, hide the noise.** Reasoning is always one click away — never crammed onto the surface, never buried more than one level deep.
2. **Calm, not alarming.** Reasoning UI uses gold accent and serif italic — editorial annotation, not red-flag warnings.
3. **Method + inputs + adjustments + confidence + source.** Every reasoning panel follows this 5-row structure so users learn the pattern once and read fluently after.

**The single sentence test:** if a CFO opens any reasoning panel on the site, they should be able to defend the underlying number to their board within 30 seconds.

---

## 2. Five Core Patterns

### Pattern 1 — The "Why?" Disclosure Chip

**What:** Inline gold italic affordance that expands to reveal a structured reasoning panel.
**Where:** Adjacent to any AI-generated number, projection, scenario, or claim.
**Frequency:** ~50+ instances across all subpages once fully deployed.

**Visual spec:**

```
$73.3M  ·  ↗ Base case  ·  Why? ▾
```

- "Why?" rendered in `Instrument Sans` italic, weight 500
- Color: `var(--accent-gold)` (`#C4884A` day / `#D9A05F` night)
- Underline: `1px dotted` matching gold
- Hover: opacity 0.8, cursor pointer
- Active state: chevron rotates from ▾ to ▴
- Click action: smooth expand of reasoning panel below or beside (depends on container)

**Reasoning panel structure (5 rows, fixed):**

| Row | Label | Content |
|---|---|---|
| 1 | METHOD | The model / formula / approach used |
| 2 | INPUTS | Data sources and time range |
| 3 | ADJUSTMENTS | Specific tweaks applied (seasonality, dampening, etc.) |
| 4 | CONFIDENCE | Interval, MAPE, sample size, or qualitative score |
| 5 | SOURCE | Underlying tables / functions / files (clickable) |

**Example panel:**

```
METHOD       Linear regression + EMA-14 + Monte Carlo (1000 sims)
INPUTS       24 months gl_transactions · 8 driver values · industry CAGR
ADJUSTMENTS  +18% Q4 seasonal lift · −1.8% churn drag
CONFIDENCE   90% CI: $68.2M – $79.1M  ·  MAPE 3.2%
SOURCE       gl_transactions · scenarios · industry_benchmarks
```

---

### Pattern 2 — Confidence Bands on Charts

**What:** Every forecast chart renders a primary line (P50) plus shaded P10–P90 confidence band derived from conformal prediction or model-native quantile output.
**Where:** Forecast scenarios · Investor metric trendlines · Cash flow projections · Anomaly bounds
**Reasoning surfaced as:** legend toggle + hover tooltip showing the math

**Visual spec:**

```
                                        ╱──── P90
                                  ╱─────┃
                            ╱───┃        ▒ ← upper band
                      ━━━━━━━━━━╱        rgba(91,127,204,0.18)
              ━━━━━━━┃                   primary line (P50)
        ━━━━━━┃                          var(--accent-denim)
                                         ▒ ← lower band  
                                        ╲─── P10
```

- Primary line: 2px solid denim
- Confidence band: filled denim alpha, 0.12 base, 0.18 emphasis on hover
- Legend chips: `[● P50 ━] [▒ P10–P90 band] [○ Show CI ✓]`
- Toggle "Show CI" persists in `localStorage` per-user
- Tooltip on hover shows: actual value · P10 · P90 · width %

---

### Pattern 3 — Causal Trace on Variance / Anomaly Cards

**What:** Every variance highlight, alert card, and Intelligence insight gets a 3–5 step causal chain instead of a single descriptive sentence.
**Where:** P&L variance highlights · Command Center alerts · Intelligence insights · Cash flow anomalies

**Visual spec:**

```
COST PRESSURE
Hosting costs accelerating
−$220K unfavorable

CAUSAL TRACE
✦ Snowflake compute spend up 14% MoM
✦ Driven by 3 new enterprise account onboardings
✦ Query volume 2.3x prior quarter average
✦ Estimated steady-state by Q1 2026 (~$180K/mo run rate)

[View 12 underlying transactions ↗]
```

- "CAUSAL TRACE" label: gold mono 10px, gold left-border 2px (matches existing `.sp-sect-label`)
- Each step: `✦` gold spark (8px) + DM Sans 14px text
- Steps ordered from most proximal to most distal cause
- Bottom action link: gold italic + chevron, opens drill-down or transaction list
- Maximum 5 steps; if more exist, last step reads "+ N additional contributing factors"

---

### Pattern 4 — Data Lineage Chip

**What:** Mono micro-line under any KPI showing exactly where the number came from.
**Where:** Every KPI tile on every subpage · Income statement line items · Investor metric values

**Visual spec:**

```
$48,210,300                              ← Geist Mono 22px, ink
Subscription Revenue                     ← DM Sans 13px, muted
3 GL accounts · 47 transactions · synced 12s ago  [↗]
└─────────────── Geist Mono 10px, gold link arrow on hover ─────┘
```

- Format: `[count] [entity] · [count] [entity] · synced [duration] ago`
- Always mono, always 10px, always letter-spacing 0.5px
- Color: `var(--text-muted)` for text, `var(--accent-gold)` for the trailing arrow
- Click on arrow: opens transaction list / source query / file viewer in side panel
- Sync time updates every 30s if page is active

---

### Pattern 5 — Method Footer

**What:** Always-visible bottom-of-card breadcrumb showing the data path that produced the entire surface.
**Where:** Bottom of every chart, forecast card, projection panel, dashboard section

**Visual spec:**

```
─────────────────────────────────────────────────
Method: pl_summary view · grouped by account_type · last sync 12s · org d8afc85d…
```

- Hairline divider above (denim alpha 0.10)
- Single line, mono 11px, muted color
- Components: `Method:` label gold, separator dots, no chevrons or links
- Truncates with ellipsis on narrow viewports

**You already have this pattern in production** — the P&L wiring footer ("Source: pl_summary view · 5 rows · org d8afc85d…") is the prototype. Phase 2C-1.5 generalizes it to every surface.

---

## 3. Visual Token System

All five patterns inherit the locked design system. Defining specific reasoning-related tokens here so they're easy to find and reuse.

```css
/* === REASONING TOKENS === */
:root {
  /* Day mode */
  --r-affordance:      var(--accent-gold);          /* "Why?" link color */
  --r-affordance-hover: #B07840;
  --r-panel-bg:        rgba(196,136,74,0.04);       /* reasoning panel tint */
  --r-panel-border:    var(--accent-gold);
  --r-band-fill:       rgba(91,127,204,0.12);       /* confidence band */
  --r-band-fill-emph:  rgba(91,127,204,0.18);
  --r-spark:           var(--accent-gold);          /* ✦ in causal traces */
  --r-method-label:    var(--accent-gold);
  --r-meta-text:       var(--text-muted);
}

[data-theme="night"] {
  --r-affordance:      #D9A05F;
  --r-affordance-hover: #E5B47A;
  --r-panel-bg:        rgba(217,160,95,0.06);
  --r-panel-border:    #D9A05F;
  --r-band-fill:       rgba(155,180,230,0.10);
  --r-band-fill-emph:  rgba(155,180,230,0.16);
  --r-spark:           #D9A05F;
  --r-method-label:    #D9A05F;
}
```

---

## 4. Component Stubs

CSS scaffolds for the 5 patterns. Phase 2C-1.5 will turn these into actual components.

```css
/* Pattern 1 — Why? chip + reasoning panel */
.cf-why {
  font-family: 'Instrument Sans', serif;
  font-style: italic;
  font-weight: 500;
  font-size: inherit;
  color: var(--r-affordance);
  border-bottom: 1px dotted var(--r-affordance);
  cursor: pointer;
  transition: opacity 0.15s ease;
  user-select: none;
}
.cf-why:hover { opacity: 0.8; }
.cf-why .chev { display:inline-block; transition: transform 0.2s ease; }
.cf-why[aria-expanded="true"] .chev { transform: rotate(180deg); }

.cf-reasoning-panel {
  background: var(--r-panel-bg);
  border-left: 2px solid var(--r-panel-border);
  padding: 18px 22px;
  margin: 12px 0;
  border-radius: 0 8px 8px 0;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 8px 16px;
}
.cf-reasoning-panel .r-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--r-method-label);
  text-transform: uppercase;
  padding-top: 2px;
}

/* Pattern 2 — Confidence band (SVG fill class) */
.cf-confidence-band { fill: var(--r-band-fill); }
.cf-confidence-band:hover { fill: var(--r-band-fill-emph); }
.cf-chart-legend .legend-band-swatch {
  display: inline-block;
  width: 16px; height: 8px;
  background: var(--r-band-fill-emph);
  border-radius: 2px;
  vertical-align: middle;
  margin-right: 6px;
}

/* Pattern 3 — Causal trace */
.cf-causal-trace { padding-top: 14px; }
.cf-causal-trace .ct-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--r-method-label);
  border-left: 2px solid var(--r-method-label);
  padding-left: 8px;
  margin-bottom: 8px;
}
.cf-causal-trace .ct-step {
  display: flex;
  gap: 10px;
  padding: 4px 0;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: var(--text-primary);
}
.cf-causal-trace .ct-step::before {
  content: '✦';
  color: var(--r-spark);
  flex-shrink: 0;
  font-size: 11px;
  padding-top: 4px;
}
.cf-causal-trace .ct-link {
  margin-top: 12px;
  display: inline-block;
  font-style: italic;
  color: var(--r-affordance);
  font-size: 12px;
}

/* Pattern 4 — Data lineage chip */
.cf-lineage {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.5px;
  color: var(--r-meta-text);
  margin-top: 6px;
}
.cf-lineage .lineage-link {
  color: var(--r-affordance);
  text-decoration: none;
  margin-left: 4px;
}

/* Pattern 5 — Method footer */
.cf-method-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(91,127,204,0.10);
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--r-meta-text);
  letter-spacing: 0.3px;
}
.cf-method-footer .mf-label {
  color: var(--r-method-label);
  font-weight: 500;
}
```

---

## 5. Reasoning Data Schema

For reasoning UI to be data-driven (not hardcoded), every value that surfaces a "Why?" affordance needs a structured `reasoning` object alongside it.

**Standard schema (JSON):**

```json
{
  "value": 73300000,
  "display": "$73.3M",
  "reasoning": {
    "method": "Linear regression + EMA-14 + Monte Carlo (1000 sims)",
    "inputs": [
      "24 months gl_transactions",
      "8 driver values",
      "industry CAGR (industry_benchmarks)"
    ],
    "adjustments": [
      "+18% Q4 seasonal lift",
      "-1.8% churn drag"
    ],
    "confidence": {
      "type": "interval",
      "level": 0.90,
      "lower": 68200000,
      "upper": 79100000,
      "mape": 0.032
    },
    "sources": [
      { "kind": "table", "ref": "gl_transactions", "count": 4318 },
      { "kind": "table", "ref": "scenarios", "count": 8 },
      { "kind": "function", "ref": "generate-forecast", "version": "v1" }
    ],
    "causal_trace": null
  }
}
```

For variance / anomaly cards, replace `confidence` with `causal_trace`:

```json
{
  "causal_trace": [
    "Snowflake compute spend up 14% MoM",
    "Driven by 3 new enterprise account onboardings",
    "Query volume 2.3x prior quarter average",
    "Estimated steady-state by Q1 2026 (~$180K/mo run rate)"
  ]
}
```

**Edge function responsibility:** every edge function that returns financial values to the UI (`generate-forecast`, `dashboard-insights`, `xpa-brain`, `cash-flow-brain`, `budget-brain`, `cfo-command-center`, `benchmark-compare`) gets updated to include the `reasoning` object in its response payload. ~30 minutes of work per function during Phase 2C-1.5.

---

## 6. Subpage Application Map

Where each pattern goes when fully deployed.

| Subpage | P1 Why? | P2 CI band | P3 Causal | P4 Lineage | P5 Method footer |
|---|---|---|---|---|---|
| **P&L Statement** | Variance highlights · Net Income · Gross Margin | — | Variance highlights | Every line item | ✓ (already shipped) |
| **Forecast** | Each scenario · MAPE · driver inputs | Every chart | — | Driver inputs | ✓ |
| **AI Copilot** | (already designed via citation pills, formalize structure) | — | Every answer | Citation pills | ✓ |
| **Consolidation** | Entity rollup · FX rate · elimination | — | Eliminations | Each entity row | ✓ |
| **Scenarios** | Each scenario delta | Per scenario | Driver impact | — | ✓ |
| **Close Tasks** | Risk score | — | Stuck tasks | Each task source | ✓ |
| **Team** | — | — | — | Member sources | ✓ |
| **Integrations** | Health score | — | Sync failures | Each connector | ✓ |
| **Investor Metrics** | Every metric | Every chart | Cohort heatmap cells | Every metric | ✓ |
| **Command Center** | Every alert | — | Every alert (mandatory) | Alert source | ✓ |
| **Intelligence** | Every insight (mandatory) | Anomaly bounds | Every insight | Every insight | ✓ |
| **Admin** | — | — | — | Audit log entries | ✓ |
| **Settings** | — | — | — | — | — |

Total instances when fully deployed: roughly 80–100 reasoning surfaces site-wide.

---

## 7. Phase 2C-1.5 Implementation Plan

Single session, ordered for ship-and-iterate:

**Step 1 — Tokens + components (30 min)**
- Add reasoning tokens to existing CSS variable system
- Create `castford-reasoning.js` and `castford-reasoning.css` partials
- Single source of truth for the 5 components

**Step 2 — Helper layer in dashboard-data.js (30 min)**
- Add `renderReasoningPanel(reasoning)` helper
- Add `renderCausalTrace(steps, link)` helper
- Add `renderLineageChip(sources, lastSync)` helper
- Add `renderMethodFooter(method, source, lastSync, orgId)` helper
- Add `renderConfidenceBand(svgEl, p10, p50, p90)` helper

**Step 3 — Wire P&L (highest-value first) (45 min)**
- Variance highlights get causal traces (mock data first, real data Phase 2B-3)
- Income statement line items get lineage chips
- Method footer already shipped — extend with full schema

**Step 4 — Wire Forecast (60 min)**
- Each scenario card gets "Why?" chip
- Generate-forecast edge function returns `reasoning` object
- 12-month chart gets confidence band

**Step 5 — Wire Command Center alerts (45 min)**
- Every alert mandatory causal trace
- Alert source lineage

**Step 6 — Wire Intelligence (60 min)**
- Every insight mandatory "Why?" + causal trace
- Most reasoning-heavy page; sets the bar for everything else

**Step 7 — Audit pass on remaining subpages (30 min)**
- Verify Method Footer present on all 13 surfaces
- Verify lineage chips on all KPI tiles
- Tag remaining surfaces for Phase 2C-3 (deeper drill-downs)

**Total estimate:** one focused 5–6 hour session. PRs:
- PR A: tokens + components + CSS (review-ready in isolation)
- PR B: P&L + Forecast wiring
- PR C: Command Center + Intelligence
- PR D: audit + remaining subpages

---

## 8. Reasoning Quality Guidelines

What "good" looks like vs. what to avoid.

**✅ Good causal trace:**
> ✦ Net expansion rate: 118% (vs 110% plan)
> ✦ Driven by 7 enterprise upgrades in Q4 (vs 4 budgeted)
> ✦ No notable churn this quarter

**❌ Bad causal trace:**
> ✦ Revenue went up
> ✦ Customers spent more
> ✦ Things are good

**✅ Good reasoning panel:**
> METHOD: Conformal prediction wrapping Chronos-2 foundation model
> INPUTS: 36 months SaaS metrics from peer cohort + 24 months internal ARR
> ADJUSTMENTS: Cohort-weighted by ARR band ($1M–$10M ARR companies)
> CONFIDENCE: 90% CI: $68.2M–$79.1M
> SOURCE: revenue_metrics · industry_benchmarks · forecast-foundation function

**❌ Bad reasoning panel:**
> METHOD: AI
> INPUTS: Lots of data
> CONFIDENCE: High

**Three rules for reasoning copy:**
1. **Numbers, not adjectives.** "$220K above plan" not "significantly above plan"
2. **Mechanisms, not adjectives.** "Driven by enterprise upgrades" not "due to growth"
3. **Specific sources.** Name the table/function/document, not "internal data"

---

## 9. Open Questions

Items to decide during Phase 2C-1.5:

1. **Mobile reasoning UI** — does the reasoning panel collapse to a bottom sheet on mobile, or stay as inline expand?
2. **Reasoning persistence** — when user expands "Why?" on tile A, does opening tile B auto-collapse A, or stack both?
3. **Print/export behavior** — when CFO exports a P&L PDF, does reasoning render in an appendix? (Likely yes — defaults visible in exports.)
4. **Reasoning quality tier per pricing tier** — does Starter get basic causal traces while Business gets full conformal intervals + foundation model reasoning? (Probably yes, ties to L3 pro pack value prop.)
5. **Caching** — reasoning objects per metric per period are computed deterministically; cache in `dashboard_cache` for performance?

---

## 10. Strategic Why

This is the single feature that justifies Castford's price points against Pigment, Board, and Anaplan.

Pigment shows you the chart. Board shows you the chart with a trendline. Anaplan shows you the chart with a configurable trendline. **Castford shows you the chart, the trendline, the confidence interval, the causal chain, the source data, and lets you click any of those to verify.**

The visual difference is subtle. The trust difference is enormous. CFOs who've been burned by black-box AI tools (most of them, by 2026) recognize the value within seconds.

This is also what makes Castford defensible against new entrants. Building reasoning UI is easy. Building reasoning UI backed by actual conformal prediction + causal inference + foundation models is hard. The visual system tells the customer the depth is there before they even understand why.

---

**End of spec.**

Phase 2C-1.5 starts the moment Phase 2C-1 ships.
