# Castford X (Twitter) Post Bank
## 25 tweets across 5 categories — ready to schedule

**Voice notes:** Founder building in public. Direct, specific numbers, no buzzwords.
Castford = AI-native FP&A platform competing with Anaplan, Pigment, Mosaic.
Differentiator: unlimited collaboration seats + AI Copilot included + no per-viewer gating.

**Use guide:**
- Mix categories — don't post 5 product updates in a row
- Add screenshots/loom videos to product update tweets
- Reply to comments — engagement beats follower count
- Best times for B2B finance audience: Tue/Wed/Thu 8-10am ET, 1-3pm ET

---

## CATEGORY A: Product Updates (4 tweets)
What's new, what shipped, milestones

### A1
Just shipped the Castford account model.

15 database tables, 9 edge functions, complete invitation lifecycle, Resend email delivery, audit log on every mutation, last-owner protection, tier-aware seat enforcement.

One day. Production. Zero downtime.

### A2
Castford's CFO Hub now renders live data from your GL in <800ms.

$55.4M revenue. 85.1% gross margin. $13.3M operating cash flow.

That's not sample data. That's a real org's real numbers.

This is what AI-native FP&A actually looks like →

### A3
Updated Castford pricing today.

Starter: 5 full + 5 view-only seats ($599/mo)
Growth: 15 full + 25 view-only seats ($1,799/mo)
Business: 30 full + UNLIMITED view-only ($4,799/mo)

Other FP&A vendors charge $200/seat for viewers. Why?

### A4
The Castford "engine v2" hub renders any role-specific dashboard from a JSON config.

Add /controller? Drop in controller.json.
Add /fpa? Drop in fpa.json.
Add /treasurer? Drop in treasurer.json.

No new code. No new deployments. The data layer flexes.

---

## CATEGORY B: Differentiation / Positioning (5 tweets)
Why Castford > Anaplan/Pigment/Mosaic

### B1
Anaplan charges $1,200+/yr per seat.
Pigment charges $800+/yr per seat.
Mosaic charges $50+/seat overage.

Castford Business: 30 full seats, UNLIMITED view-only, UNLIMITED external observers.

Pricing is a values statement. Ours says "invite your whole team."

### B2
Most FP&A platforms make finance teams ration access.

"Don't invite the marketing director — that's another seat."
"Don't share with the board — observers cost extra."
"Don't loop in engineering — that's $300/yr we can't justify."

Castford doesn't.

### B3
Finance doesn't run on numbers.

It runs on context.

The marketing director knows why CAC moved.
The eng manager knows why infra spiked.
The HR head knows the headcount reality.

If they need a $300 seat license to share that, your model is missing it.

### B4
Hot take: per-seat pricing for FP&A software is dead.

It punishes the buyer behavior you actually want — collaboration.

The next decade of finance tools meters AI usage, data volume, or entity complexity.

Castford metered: AI queries + entity scope. Seats are bundled.

### B5
Why charge for view-only seats?

Cost to vendor: zero (they're not consuming AI queries)
Value to buyer: massive (board access, auditor access, fractional CFO access)
Friction created: enormous (rationing, gatekeeping)

It's the worst kind of revenue.

---

## CATEGORY C: Industry Insights (5 tweets)
FP&A market thoughts, no product mention

### C1
The FP&A software market is $7B and growing 15% YoY.

But the leaders all built before AI was a primitive.

Anaplan: 2006.
Adaptive: 2003 (acquired by Workday).
Pigment: 2019 (modern, but no native AI from day 1).

Window is open for an AI-native rebuild.

### C2
Most CFO dashboards are structured around what was easy to compute in Excel 15 years ago.

Variance. Trend. Forecast vs actual.

What an AI-native FP&A tool can do:
"Why did Q3 marketing spend break the forecast?" → traces it through your GL in 4 seconds.

### C3
Three things that make FP&A a great market for an AI-native player:

1. The data is structured (GL, AR, AP, headcount)
2. The questions are repeatable ("explain variance," "scenario X")
3. The buyers will pay (CFO budget, urgent need)

It's almost too obvious.

### C4
The FP&A software trap: building a tool for finance teams that finance teams can use, but the rest of the org can't.

The killer product is one ANY exec can open and ask "what's our cash position" — and get a real answer.

That's the Castford bet.

### C5
A finance team that gates dashboard access from the rest of the org isn't being protective.

They're being underbudgeted on per-seat licenses.

Solve the pricing model and the culture changes.

---

## CATEGORY D: Building in Public (5 tweets)
Founder voice, dev journey, decisions

### D1
Spent today reviewing every layer of Castford's auth stack:

- JWT verify
- Org membership check
- Permission level (owner/admin/member/viewer)
- Tier feature gate
- Seat limit enforcement
- Audit log

5 layers of defense. Every API call. ~30ms total.

This is the boring stuff that matters.

### D2
Just finished rebuilding Castford's pricing tier seat limits from 1/5/15 to 5/15/30.

The old limits forced solo founders into Growth ($1,799) the moment they invited their bookkeeper.

The new limits let them invite their team on Starter ($599).

Less revenue per customer. More customers.

### D3
Real talk on building solo:

You overestimate what you can do in a day.
You underestimate what you can do in a quarter.

Castford has 28 Supabase tables, 17 edge functions, 35+ dashboard pages.

Each day felt unimpressive. The compound is wild.

### D4
Today's bug: Apple SSO + Supabase + a logout button that didn't actually log out.

Apple's persistent OS-level auth would silently re-auth users 200ms after sign-out.

Fix: a 60-second cooldown flag that tells the auth guard "ignore Apple, even if it asks nicely."

### D5
The hardest part of building Castford isn't the code.

It's deciding what NOT to build.

Today's "no": a customizable dashboard widget grid.
Today's "yes": a reliable sign-out flow.

Customers don't care about your widget grid if they can't log out.

---

## CATEGORY E: Engagement / Cultural (6 tweets)
Conversational, opinion-driven, designed to spark replies

### E1
Show me your favorite enterprise SaaS post-login dashboard.

(Not landing page. The first thing you see after sign-in.)

I'm cataloging what works for an upcoming Castford redesign.

### E2
Underrated CFO superpower: a single source of truth.

Most finance teams maintain 4-6 versions of the truth across spreadsheets, dashboards, board decks, and CRM.

Reconciliation tax is brutal.

### E3
Pricing your B2B SaaS:

You think you're raising prices for revenue.
You're actually raising prices to attract better customers.

The wrong customers churn at every price.
The right customers don't notice a 20% increase.

### E4
The most undervalued role in finance is the Controller.

CFOs get the strategic credit.
FP&A gets the modeling credit.
Controllers do the actual work that makes the numbers true.

If your controller is good, never lose them.

### E5
Three things in the next 18 months will reshape how finance teams work:

1. AI Copilot becomes table stakes (not a feature)
2. Per-seat pricing dies
3. Real-time GL replaces month-end reporting

I'm building toward all three.

### E6
Spreadsheets are not the enemy.

The enemy is spreadsheets that pretend to be a system of record.

A great FP&A tool replaces the spreadsheet-as-database without replacing the spreadsheet-as-thinking-tool.

---

## BONUS: Cold open / hook templates

For when you want to write a fresh tweet with a strong opening:

- "Real talk on [X]:"
- "Hot take:"
- "Three things [audience] gets wrong about [topic]:"
- "I just shipped [specific thing]. Here's why [counterintuitive insight]:"
- "[Big number] is meaningless without [context]."
- "The hardest part of [thing] isn't [obvious thing]. It's [non-obvious thing]."
- "Most [audience] do [thing X]. The best ones do [thing Y]."

---

## POSTING SCHEDULE TEMPLATE (suggested 1 week)

| Day | Time | Category | Why |
|---|---|---|---|
| Mon | 9am ET | C (insight) | Sets thought leadership tone for week |
| Tue | 10am ET | A (product) | Highest engagement day |
| Tue | 2pm ET | E (engagement) | Reply-bait for organic reach |
| Wed | 9am ET | B (differentiation) | Mid-week competitive pitch |
| Wed | 3pm ET | D (build-in-public) | Casual/personal balances morning B2B |
| Thu | 10am ET | A (product) | Second product hit of week |
| Thu | 2pm ET | C (insight) | Closes week with thought |
| Fri | 11am ET | E (engagement) | Friday vibe, lower stakes |

8 tweets/week = 32/month from this bank's 25 = ~3 weeks of content.

---

## NOTES ON USING THESE

**Don't post verbatim.** Edit each one before scheduling — your voice matters more than mine. Common edits:
- Add an emoji ONLY if it's earned (📈 for revenue context, 🧵 for threads)
- Tag a relevant person if applicable (@levelsio, @petekeen, finance Twitter)
- Cut a word if it reads as preachy
- Add a question mark to invite replies

**Add visuals where possible:**
- A1, A2: screenshot of the actual dashboard rendering
- A3: side-by-side pricing comparison graphic
- B1: Anaplan vs Pigment vs Castford pricing table
- D2: before/after seat limit numbers

**Threads work for:**
- C-category tweets (industry insight) → thread of 5-7 tweets
- D2, D3 (build journey) → can extend with specific lessons

**Do NOT post:**
- Anything with specific customer names or revenue (real or fake)
- Vague "AI is the future" hot takes (specific > general)
- Replies to competitors that punch down (only punch up)

---

## WHEN YOU SAID "SCRIPTS TO POST"

If you literally meant a script that POSTS to X via API (vs. tweet copy), say the word and I'll ship a separate Python/Node script using the Twitter API v2 that:
- Reads tweets from a CSV/JSON file
- Posts at scheduled times via cron or GitHub Actions
- Tracks which have been posted
- Handles rate limiting + retry on failure

That requires you to create a Twitter Developer App + get API keys. Doable in 10 minutes if you want it.

For now this is the content bank. Schedule them via Buffer, Hypefury, or Typefully.
