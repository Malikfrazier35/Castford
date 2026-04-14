# Castford Design System

> Sharp corners. Semantic colors. Numbers first. Every pixel serves the data.

## Philosophy

Castford's design feels like a Bloomberg terminal raised by a Swiss annual report. Dense with data, beautiful in restraint. Every element on screen must display a number, label, or control. Zero decoration in the dashboard.

**Four principles:**

1. **Sharp, not soft** — 0px border-radius everywhere. No rounded corners on cards, buttons, inputs, badges, chart bars, or tooltips. The only roundness: circle avatars and donut chart segments.
2. **Data-dense, not decorative** — No illustrations, hero images, or ambient gradients in the dashboard. The landing page can be expressive; the product is pure utility.
3. **Numbers are typography** — Financial data gets the largest fonts, heaviest weights, and most prominent positions. Hierarchy: number → label → context.
4. **Single accent** — Green (#10B981) is the ONLY accent color. No secondary accent competes with it.

**The Bloomberg litmus test:** Before shipping any UI change, ask: "Would Bloomberg use this element?" If no, it doesn't belong in Castford.

---

## Typography

Three typefaces, strict hierarchy. Never mix roles.

| Role | Font | Weight | Size | Usage |
|------|------|--------|------|-------|
| Display number | Instrument Sans | 900 | 32-48px | Hero KPIs, pricing page |
| KPI value | DM Sans | 700 | 22-28px | Dashboard card values |
| Section heading | Instrument Sans | 800 | 18-22px | Page titles |
| Card heading | DM Sans | 700 | 14-16px | Card titles, nav items |
| Body text | DM Sans | 400 | 13-14px | Descriptions, paragraphs |
| Micro label | DM Sans | 700 | 10-11px | Section dividers (UPPERCASE, 0.06em tracking) |
| Data / code | Geist Mono | 500 | 12-14px | Numbers, percentages, IDs |
| Chart axis | Geist Mono | 500 | 10-11px | Axis ticks, tooltips |

**Rules:**
- Use `font-variant-numeric: tabular-nums` on ALL financial figures
- Never use Instrument Sans below 18px (it's a display face)
- Never use DM Sans above 28px (it's a body/UI face)
- Geist Mono for every number that appears in a table, chart, or KPI card

---

## Color System

### Core palette

| Variable | Day | Night | Usage |
|----------|-----|-------|-------|
| `--bg` | #FFFFFF | #0F172A | Page background |
| `--s1` | #F8FAFC | #1E293B | Surface (sidebar, section bg) |
| `--s2` | #F1F5F9 | #334155 | Secondary surface |
| `--ink` / `--t1` | #0F172A | #F8FAFC | Primary text, headings |
| `--t2` | #475569 | #94A3B8 | Body text |
| `--t3` | #94A3B8 | #64748B | Secondary text |
| `--t4` | #CBD5E1 | #475569 | Tertiary text, placeholders |
| `--border` | #E2E8F0 | #334155 | Borders (0.5px) |
| `--green` | #10B981 | #10B981 | Accent (SAME in both themes) |

### Semantic chart colors

| Color | Hex (day) | Hex (night) | Meaning |
|-------|-----------|-------------|---------|
| Revenue | #1E40AF | #3B82F6 | Revenue, income (always) |
| Positive | #059669 | #059669 | Under budget, growth |
| Warning | #D97706 | #F59E0B | Near limit, caution |
| Negative | #DC2626 | #EF4444 | Over budget, decline |
| Forecast | #7C3AED | #A78BFA | Projected, estimated |
| Cash flow | #0891B2 | #0891B2 | CF-specific metrics |
| Neutral | #475569 | #475569 | Baseline, reference |
| Budget | #BE185D | #BE185D | Budget-specific |

**Rule:** Colors encode meaning, never sequence. A bar chart with 7 departments uses one blue ramp with 7 opacity levels, NOT 7 different colors.

**Rule:** Green (#10B981) never changes between themes. It's the one constant.

---

## Number Formatting

Every number in Castford follows accounting conventions.

| Format | Example | When to use |
|--------|---------|-------------|
| Large currency | `$55.4M` | KPI cards, chart tooltips |
| Exact currency | `$5,127,843.00` | Tables, detailed views |
| Positive delta | `+8.2%` | Green, explicit + sign |
| Negative delta | `(1.3%)` | Red, accounting parentheses |
| Negative currency | `($420,000)` | Red, parentheses wrap $ too |
| Zero value | `—` | Em dash, tertiary color |
| Percentage | `85.1%` | 1 decimal, no space before % |
| Basis points | `+2.0pp` | "pp" suffix, always show sign |
| Count | `1,247` | Comma separators, no decimals |
| Ratio | `182%` | No decimals above 100% |

**Critical rules:**
- Negative values use accounting parentheses `()`, never minus signs
- Zero values show em dash `—`, never `$0.00`
- Variance color is account-type-aware: expenses under budget = green (good)
- `font-variant-numeric: tabular-nums` on every number column

### JavaScript formatting functions

```javascript
function fmt(v) {
  if (v === 0 || v == null) return '\u2014'; // em dash
  var abs = Math.abs(v);
  var str;
  if (abs >= 1e6) str = '$' + (abs / 1e6).toFixed(1) + 'M';
  else if (abs >= 1e3) str = '$' + Math.round(abs / 1e3).toLocaleString() + 'K';
  else str = '$' + abs.toFixed(0);
  return v < 0 ? '(' + str + ')' : str;
}
```

---

## Spacing

4px base unit. Only these values.

| Size | Pixels | Usage |
|------|--------|-------|
| 4px | `4px` | Icon-text gap |
| 8px | `8px` | Inside badges, tight elements |
| 12px | `12px` | Card grid gap, list spacing |
| 16px | `16px` | Card padding, section gap |
| 24px | `24px` | Between card groups |
| 32px | `32px` | Section separation |
| 48px | `48px` | Major section dividers |

---

## Components

### KPI Card
- Background: `--bg` (white)
- Border: 0.5px solid `--border`
- Border-radius: 0px
- Padding: 14px
- Label: 8px, 700 weight, uppercase, 0.06em tracking, `--t4`
- Value: 22px, 700 weight, `--ink`, tabular-nums
- Delta: 9px, 600 weight, semantic color

### Data Table
- Border: 0.5px solid `--border`
- Header: 9px uppercase, 600 weight, `--ink`, bg `--s2`
- Row height: 36px (standard), 28px (compact), 44px (relaxed)
- Numbers: right-aligned, Geist Mono, tabular-nums
- Hover: 2% green opacity background
- Category rows: 700 weight, 12px, 2% green tint
- Sub-account rows: 24px left indent, 400 weight, 11px
- Subtotal rows: 800 weight, 1.5px top border

### Buttons
| Type | Background | Text | Border | Hover |
|------|-----------|------|--------|-------|
| Primary | #10B981 | white | none | shadow glow |
| Secondary | transparent | `--t1` | 1px `--border` | border/text → green |
| Dark | `--ink` | white | none | shadow |
| Ghost | transparent | `--t3` | none | text → `--t1` |

All buttons: 0px border-radius, DM Sans 700, 13px, padding 10px 24px.

### Alert Card
- Left border: 2px solid (severity color)
- No background color
- Text: 11px, secondary color
- Bold lead text: 600 weight, primary color

### Sidebar
- Width: 200px (desktop), 48px (collapsed), hidden (mobile)
- Active item: 2px green left border, 4% green bg, primary text
- Hover: 2% primary opacity background
- Plan badge: bottom, 10px tertiary
- Upgrade link: green, below plan badge

### Badge
- 0px border-radius
- 9px, 700 weight, uppercase, 0.04em tracking
- Padding: 3px 8px
- LIVE DATA: green bg, white text
- SAMPLE DATA: gray bg, tertiary text

---

## Charts (Chart.js v4)

### Global defaults
```javascript
Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.elements.bar.borderRadius = 0;        // SHARP
Chart.defaults.plugins.tooltip.cornerRadius = 0;      // SHARP
Chart.defaults.scale.ticks.font.family = "'Geist Mono', monospace";
Chart.defaults.scale.grid.color = '#f1f5f9';
Chart.defaults.scale.grid.lineWidth = 0.5;
```

### Container rules
- No border-radius on canvas container
- 0.5px border
- White background
- 16px padding
- Chart title: ABOVE container as micro-label (10px uppercase)
- Height by type: area/line 240px, bar 280px, donut 200px, waterfall 320px, sparkline 48px

### 12 chart types
1. Revenue trend (area)
2. Forecast confidence (line + band)
3. Budget variance (horizontal bars)
4. Cash flow waterfall
5. Scenario comparison (grouped bars)
6. Department donut
7. Headcount plan (stacked bars)
8. Sparkline (mini line)
9. Alert severity gauge (half donut)
10. Benchmark bullet (horizontal)
11. Monthly P&L (multi-line)
12. FCF trend (bar + line combo)

---

## Animation

Four motions only. No bounce, spring, elastic, parallax, or particles.

| Motion | CSS | Duration | Usage |
|--------|-----|----------|-------|
| Reveal | translateY(24px)→0, opacity 0→1 | 600ms ease-out | Landing page sections (NOT dashboard) |
| Count | 0→target number | 500ms easeOutQuart | Landing page KPIs (NOT dashboard) |
| Grow | height 0→value | 600ms easeOutQuart | Chart bars on first render only |
| Fade | opacity 0→1 | 150ms linear | Tooltips, dropdowns, hover states |

**Dashboard rule:** Numbers snap in with opacity fade (150ms), never count up. Counting trivializes financial data.

---

## Two Design Modes

### Landing page (expressive)
- Gradients allowed (green at 4% opacity max)
- Scroll reveal animations (castford-energy.js)
- Large display typography (Instrument Sans 900, 48px)
- Number counting animations
- Video embeds, demo sections
- Social proof, comparison strips

### Dashboard (utilitarian)
- Zero gradients, zero scroll animations
- Maximum data density
- Numbers snap in, never count
- Charts animate once on render, then static
- Every pixel is a number, label, or control
- No hint of "marketing" inside the product

**The login wall is the boundary.** Nothing from the landing page visual language crosses into the dashboard.

---

## Responsive Breakpoints

| Breakpoint | Width | Layout | KPI grid |
|-----------|-------|--------|----------|
| Desktop | >1024px | Sidebar + main | 4 columns |
| Tablet | 768-1024px | Collapsed sidebar (48px) | 2 columns |
| Mobile | <768px | No sidebar (hamburger) | 1 column |
| Small | <480px | Stacked | Swipeable |

Content max-width: 1400px with `margin: 0 auto`.

---

## Accessibility

- Focus rings: `outline: 2px solid #10B981; outline-offset: 2px` (`:focus-visible` only)
- Primary text contrast: 15.4:1 (AA+)
- Secondary text contrast: 7.4:1 (AA)
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables chart animations
- Charts: `aria-label` describing content
- KPI cards: `role="status"` with `aria-live="polite"`
- Alert cards: `role="alert"` for critical severity
- Sidebar: `role="navigation"` with `aria-current="page"`

---

## Error States

- **404:** Large faded code (48px, 30% opacity) + message + green CTA
- **500:** "Something went wrong" + "Refresh page" CTA + "Contact support" ghost link
- **Auth expired:** Full-page overlay → "Sign in" CTA with return URL
- **API failure:** Inline toast (bottom-right, dark bg, 4s auto-dismiss) with auto-retry

No illustrations, sad faces, or humor in error states.

---

## Email Design

- Max width: 560px
- Font: Arial/Helvetica (email-safe)
- Logo header → content → KPI strip (green left-border) → CTA → footer
- KPI strip shows REAL numbers from customer data
- CTA: green (#10B981), white text, 0px radius, 10px 24px padding
- Footer: 10px, tertiary, centered

---

## Logo

- Mark: nested hexagon with center core dot
- Core dot: always green (#10B981)
- Minimum size: 16px digital, 8mm print
- Clear space: 1x hexagon width on all sides
- Flat top orientation always (never rotated)
- Logotype: Instrument Sans 600, 15px

---

## Print (Board Reports)

- Font sizes: +10% from screen
- Colors: CMYK-safe (green → #047857)
- Backgrounds: pure white
- Borders: 0.75px (0.5px doesn't render)
- Charts: SVG export (not canvas bitmap)
- Header: customer logo (120px wide)
- Footer: "Report generated [date] via Castford"
- Page breaks: before each major section
- Margins: 0.75in all sides
