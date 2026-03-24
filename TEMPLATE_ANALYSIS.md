# FinanceOS Template Library Analysis
## 60+ Templates Extracted — Design System Reference

### FONT HIERARCHY (Enterprise-Grade)
- **Primary (applied):** Manrope — geometric humanist, used by Partnership finance template
- **Alternative heading:** Archivo — used by Axil agency template
- **Data/mono:** JetBrains Mono — already in use for KPIs and financial data

### UNIVERSAL SECTION FLOW (confirmed across ALL 34 templates)
1. **Hero** — 60/40 split (text left, photo right) OR full-width photo + overlay
2. **Logo/Brand bar** — horizontal strip of partner/client logos
3. **Counter/Stats** — 4-column with large animated numbers + labels
4. **About/Value Prop** — photo left with floating stat badge overlaid + text right
5. **Services/Features** — 3-column grid, icon + title + desc + CTA button → separate page
6. **Full-width CTA Break** — corporate photo bg + dark overlay (60-70%) + white text + button
7. **Case Studies/Portfolio** — grid or carousel of client work
8. **Testimonials** — headshot + quote + role, horizontal cards
9. **Team** — 4-column cards with professional photos + name + title
10. **Pricing** — 3-4 tier cards with feature comparison
11. **FAQ** — accordion
12. **Final CTA** — conversion section with email/demo booking
13. **Footer** — 4 columns (brand, product, solutions, company)

### PHOTO PANEL PATTERNS (for Unsplash integration)
- **Pattern A (Split Hero):** text left, cropped photo right with gradient left-fade
- **Pattern B (Full-width CTA):** dark overlay (60-70% opacity) on landscape photo, white centered text
- **Pattern C (About Section):** portrait photo with floating stat card overlaid ("Same-day deploy")
- **Pattern D (Testimonial):** circular headshot 72px + 5-star + quote + name/role
- **Pattern E (Team Grid):** square photos with name overlay on hover
- **Pattern F (Parallax):** fixed background photo with scrolling content over it

### CSS ARCHITECTURE PATTERNS
- CSS custom properties for all colors (--accent-color, --text-color, --bg-color)
- section-spacing class: 80-120px vertical padding
- p-relative + absolute positioned decorative elements
- Intersection Observer for scroll-triggered fade-in animations
- Counter/odometer animations on scroll into view
- cubic-bezier(0.4, 0, 0.2, 1) for all transitions

### TEMPLATE SOURCES (34 directories, 1,775 images)
Partnership (Finance), Finza (Corporate), Everb (Consulting), Saylo (Agency),
Axil (Agency), Genox (Dark), Agenki (Creative), Brabus (Portfolio),
Ashley (Template), Unicord, Upper, Elito, Anur, Keith (Studio),
+ 20 more portfolio/agency templates

### CORPORATE DASHBOARD PERSONALIZATION PATTERNS
For client-specific dashboards (Coca-Cola CFO, etc.):
- **CFO View:** Revenue, margins, cash flow, ROIC, EPS, dividend metrics
- **CEO View:** Strategic KPIs, segment performance, market position, growth
- **Admin View:** System health, user management, audit logs, compliance
- **Controller View:** Close progress, reconciliation, GL summary, AP/AR aging
- **FP&A View:** Variance analysis, budget vs actual, forecast accuracy, scenarios
