import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════
// FinanceOS — Lead Onboarding Drip Pipeline
// 5-email automated sequence over 14 days
// Routes: Enterprise → sales call | Starter/Growth → self-serve Stripe
// Tracks lead lifecycle: new → nurturing → qualified → converted
// ═══════════════════════════════════════════════════════════════

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FROM_ADDRESS = "FinanceOS <onboarding@finance-os.app>";
const SITE_URL = "https://finance-os.app";

// ── Drip Schedule ────────────────────────────────────────────
// Day 0: Welcome + value prop
// Day 2: Feature deep-dive
// Day 5: ROI / case study / social proof
// Day 9: Head-to-head vs legacy tools
// Day 14: Final offer + urgency CTA

const DRIP_SCHEDULE = [
  { step: 1, delay_days: 0, key: "welcome" },
  { step: 2, delay_days: 2, key: "features" },
  { step: 3, delay_days: 5, key: "social_proof" },
  { step: 4, delay_days: 9, key: "comparison" },
  { step: 5, delay_days: 14, key: "final_offer" },
];

// ── Email Base Styles ────────────────────────────────────────

const emailStyles = `
  body { margin: 0; padding: 0; background: #06080c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 560px; margin: 0 auto; }
  .card { background: #10131a; border-radius: 16px; overflow: hidden; border: 1px solid #1a1f2e; }
  .hdr { padding: 32px 32px 20px; border-bottom: 1px solid #1a1f2e; }
  .logo-row { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px; }
  .logo-mark { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg,#60a5fa,#a78bfa); display: inline-flex; align-items: center; justify-content: center; }
  .logo-mark span { font-size: 18px; font-weight: 900; color: #fff; }
  .logo-text { font-size: 16px; font-weight: 800; color: #f0f2f5; letter-spacing: -0.02em; }
  .step-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; background: rgba(96,165,250,0.1); color: #60a5fa; border: 1px solid rgba(96,165,250,0.2); }
  .bd { padding: 28px 32px; }
  h2 { font-size: 22px; font-weight: 800; color: #f0f2f5; letter-spacing: -0.02em; margin: 0 0 8px; line-height: 1.3; }
  .sub { font-size: 14px; color: #8b95a9; line-height: 1.7; margin: 0 0 20px; }
  .feature-card { background: #0c0f16; border: 1px solid #1a1f2e; border-radius: 12px; padding: 16px 18px; margin-bottom: 10px; }
  .feature-title { font-size: 13px; font-weight: 700; color: #f0f2f5; margin-bottom: 3px; }
  .feature-desc { font-size: 11px; color: #636d84; line-height: 1.55; }
  .stat-grid { display: flex; gap: 12px; margin: 16px 0; }
  .stat-box { flex: 1; text-align: center; padding: 14px 8px; background: #0c0f16; border: 1px solid #1a1f2e; border-radius: 10px; }
  .stat-num { font-size: 22px; font-weight: 800; color: #60a5fa; font-family: 'JetBrains Mono', monospace; }
  .stat-lbl { font-size: 9px; color: #636d84; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }
  .quote-box { background: #0c0f16; border-left: 3px solid #60a5fa; border-radius: 0 10px 10px 0; padding: 16px 18px; margin: 16px 0; }
  .quote-text { font-size: 13px; color: #c9ced9; line-height: 1.6; font-style: italic; }
  .quote-attr { font-size: 11px; color: #636d84; margin-top: 6px; }
  .vs-row { display: flex; gap: 8px; margin: 8px 0; }
  .vs-cell { flex: 1; padding: 10px 12px; border-radius: 8px; font-size: 11px; }
  .vs-them { background: rgba(240,107,107,0.06); border: 1px solid rgba(240,107,107,0.12); color: #f06b6b; }
  .vs-us { background: rgba(52,211,153,0.06); border: 1px solid rgba(52,211,153,0.12); color: #34d399; }
  .cta { display: inline-block; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; color: #fff; text-decoration: none; background: linear-gradient(135deg, #60a5fa, #a78bfa); box-shadow: 0 4px 16px rgba(96,165,250,0.25); }
  .cta-secondary { display: inline-block; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 600; color: #8b95a9; text-decoration: none; border: 1px solid #1a1f2e; margin-left: 8px; }
  .cta-wrap { text-align: center; margin: 24px 0 8px; }
  .urgency { display: inline-block; padding: 6px 14px; border-radius: 8px; background: rgba(245,183,49,0.08); border: 1px solid rgba(245,183,49,0.15); font-size: 11px; font-weight: 700; color: #f5b731; margin-bottom: 16px; }
  .ftr { padding: 20px 32px; border-top: 1px solid #1a1f2e; text-align: center; }
  .ftr p { font-size: 10px; color: #3d4558; margin: 0; line-height: 1.6; }
  .ftr a { color: #60a5fa; text-decoration: none; }
  .unsub { font-size: 9px; color: #2a3040; margin-top: 8px; }
  .divider { height: 1px; background: #1a1f2e; margin: 20px 0; }
  .pipeline { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 16px 0; }
  .pipe-node { width: 28px; height: 28px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; }
  .pipe-line { flex: 1; height: 2px; max-width: 40px; border-radius: 1px; }
  .pipe-active { background: rgba(96,165,250,0.15); border: 1px solid rgba(96,165,250,0.3); color: #60a5fa; }
  .pipe-done { background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.3); color: #34d399; }
  .pipe-pending { background: #0c0f16; border: 1px solid #1a1f2e; color: #3d4558; }
`;

function pipelineHTML(currentStep) {
  const steps = [
    { icon: "✉", label: "Welcome" },
    { icon: "⚙", label: "Features" },
    { icon: "★", label: "Proof" },
    { icon: "⇆", label: "Compare" },
    { icon: "→", label: "Offer" },
  ];
  return `<div class="pipeline">${steps.map((s, i) => {
    const cls = i + 1 < currentStep ? "pipe-done" : i + 1 === currentStep ? "pipe-active" : "pipe-pending";
    const line = i < steps.length - 1 ? `<div class="pipe-line" style="background:${i + 1 < currentStep ? "rgba(52,211,153,0.2)" : "#1a1f2e"};"></div>` : "";
    return `<div class="pipe-node ${cls}">${s.icon}</div>${line}`;
  }).join("")}</div>`;
}

function emailShell(step, totalSteps, content) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${emailStyles}</style></head>
<body style="background:#06080c;padding:24px 12px;">
<div class="wrap"><div class="card">
  <div class="hdr">
    <div class="logo-row">
      <div class="logo-mark"><span>F</span></div>
      <span class="logo-text">Finance<span style="font-weight:400;opacity:0.6;">OS</span></span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;">
      <span class="step-badge">Email ${step} of ${totalSteps}</span>
    </div>
    ${pipelineHTML(step)}
  </div>
  <div class="bd">${content}</div>
  <div class="ftr">
    <p>FinanceOS · <a href="${SITE_URL}">finance-os.app</a></p>
    <p class="unsub">You're receiving this because you signed up at finance-os.app.<br/><a href="${SITE_URL}?unsubscribe=true" style="color:#3d4558;">Unsubscribe</a></p>
  </div>
</div></div>
</body></html>`;
}

// ── 5 Drip Email Templates ──────────────────────────────────

function buildDripEmail(step, lead) {
  const firstName = (lead.full_name || lead.name || "").split(" ")[0] || "there";
  const isEnterprise = (lead.plan_interest || "").toLowerCase().includes("enterprise") ||
    (lead.interest_type || "").toLowerCase().includes("enterprise") ||
    (lead.source || "").includes("enterprise");

  // CTA routing: Enterprise → sales call, others → self-serve
  const enterpriseCTA = `mailto:sales@finance-os.app?subject=FinanceOS%20Enterprise%20—%20${encodeURIComponent(lead.company || "Demo")}&body=Hi%20FinanceOS%20team,%0A%0AI'd%20like%20to%20schedule%20a%20call%20to%20discuss%20enterprise%20pricing.%0A%0ABest,%0A${encodeURIComponent(firstName)}`;
  const selfServeCTA = `${SITE_URL}/#pricing`;
  const primaryCTA = isEnterprise ? enterpriseCTA : selfServeCTA;
  const primaryCTAText = isEnterprise ? "Schedule a Call" : "View Plans & Subscribe";

  switch (step) {
    case 1: // Day 0 — Welcome + Value Prop
      return {
        subject: `Welcome to FinanceOS, ${firstName} — here's what's next`,
        html: emailShell(1, 5, `
          <h2>Welcome aboard, ${firstName}.</h2>
          <p class="sub">Thanks for your interest in FinanceOS. You're joining 500+ finance teams who are replacing spreadsheets and legacy FP&A tools with a unified, AI-powered platform.</p>
          <p class="sub">Here's what FinanceOS does in 30 seconds:</p>
          <div class="feature-card">
            <div class="feature-title">Connects to your stack</div>
            <div class="feature-desc">ERP, CRM, HRIS, billing — one unified financial model, live.</div>
          </div>
          <div class="feature-card">
            <div class="feature-title">AI that explains its reasoning</div>
            <div class="feature-desc">Ask natural language questions. Get answers with visible logic — no black boxes.</div>
          </div>
          <div class="feature-card">
            <div class="feature-title">Enterprise features, startup pricing</div>
            <div class="feature-desc">Multi-entity consolidation, scenario modeling, variance analysis — starting at $499/mo.</div>
          </div>
          <div class="divider"></div>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-num">48h</div><div class="stat-lbl">To go live</div></div>
            <div class="stat-box"><div class="stat-num">85%</div><div class="stat-lbl">Time saved</div></div>
            <div class="stat-box"><div class="stat-num">10x</div><div class="stat-lbl">Faster close</div></div>
          </div>
          <div class="cta-wrap">
            <a href="${SITE_URL}/#product" class="cta">Explore the Platform</a>
          </div>
        `),
      };

    case 2: // Day 2 — Feature Deep-Dive
      return {
        subject: `${firstName}, here's how FinanceOS replaces 5 tools with 1`,
        html: emailShell(2, 5, `
          <h2>One platform. Five capabilities.</h2>
          <p class="sub">Most mid-market finance teams juggle spreadsheets, a planning tool, a reporting tool, maybe a BI layer, and Slack for alerts. FinanceOS consolidates all of it.</p>
          <div class="feature-card">
            <div class="feature-title">📊 Financial Planning & Analysis</div>
            <div class="feature-desc">Budget vs actuals, driver-based forecasting, rolling forecasts, and what-if scenarios — all in one workspace.</div>
          </div>
          <div class="feature-card">
            <div class="feature-title">🤖 AI Copilot</div>
            <div class="feature-desc">"Why did COGS spike 12% in Q3?" — ask questions in plain English, get answers with citations and drill-down links.</div>
          </div>
          <div class="feature-card">
            <div class="feature-title">📈 Real-Time Dashboards</div>
            <div class="feature-desc">Live P&L, cash flow, runway, and KPI tracking. Auto-refreshes from your connected systems.</div>
          </div>
          <div class="feature-card">
            <div class="feature-title">🔗 50+ Integrations</div>
            <div class="feature-desc">QuickBooks, NetSuite, Xero, Stripe, HubSpot, Workday, Gusto — connect in minutes, not months.</div>
          </div>
          <div class="feature-card">
            <div class="feature-title">🔔 Smart Alerts</div>
            <div class="feature-desc">Variance alerts, close reminders, sync failures — to Slack, email, or your phone. Never miss a signal.</div>
          </div>
          <div class="cta-wrap">
            <a href="${SITE_URL}/#product" class="cta">See It in Action</a>
            <a href="${primaryCTA}" class="cta-secondary">${primaryCTAText}</a>
          </div>
        `),
      };

    case 3: // Day 5 — ROI + Social Proof
      return {
        subject: `How Meridian SaaS cut their close from 15 days to 3`,
        html: emailShell(3, 5, `
          <h2>Real results from real teams.</h2>
          <p class="sub">${firstName}, the ROI isn't theoretical — here's what finance teams are seeing after switching to FinanceOS.</p>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-num">85%</div><div class="stat-lbl">Less manual work</div></div>
            <div class="stat-box"><div class="stat-num">3 days</div><div class="stat-lbl">Avg close time</div></div>
            <div class="stat-box"><div class="stat-num">$240K</div><div class="stat-lbl">Annual savings</div></div>
          </div>
          <div class="quote-box">
            <div class="quote-text">"We went from a 15-day close to a 3-day close. The AI catches variances before we even look at the numbers. It paid for itself in the first month."</div>
            <div class="quote-attr">— VP Finance, Meridian SaaS ($45M ARR)</div>
          </div>
          <div class="quote-box">
            <div class="quote-text">"We cancelled Adaptive Insights and saved $180K/year. FinanceOS does everything it did — plus AI, plus better integrations."</div>
            <div class="quote-attr">— CFO, NovaBridge ($28M ARR)</div>
          </div>
          <div class="divider"></div>
          <p class="sub" style="text-align:center;">Join 500+ finance teams who made the switch.</p>
          <div class="cta-wrap">
            <a href="${primaryCTA}" class="cta">${isEnterprise ? "Talk to Our Team" : "Start Your Free Trial"}</a>
          </div>
        `),
      };

    case 4: // Day 9 — Head-to-Head Comparison vs Legacy
      return {
        subject: `FinanceOS vs the $200K FP&A tools — honest comparison`,
        html: emailShell(4, 5, `
          <h2>Same power. Fraction of the cost.</h2>
          <p class="sub">${firstName}, we get it — switching platforms is a big decision. Here's how FinanceOS honestly compares to the tools you might be evaluating.</p>

          <div style="font-size:10px;font-weight:700;color:#636d84;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Implementation Time</div>
          <div class="vs-row">
            <div class="vs-cell vs-them">Legacy: 3–6 months</div>
            <div class="vs-cell vs-us">FinanceOS: 48 hours</div>
          </div>

          <div style="font-size:10px;font-weight:700;color:#636d84;text-transform:uppercase;letter-spacing:0.08em;margin:12px 0 8px;">Annual Cost (Mid-Market)</div>
          <div class="vs-row">
            <div class="vs-cell vs-them">Legacy: $65K–$200K+</div>
            <div class="vs-cell vs-us">FinanceOS: $6K–$18K</div>
          </div>

          <div style="font-size:10px;font-weight:700;color:#636d84;text-transform:uppercase;letter-spacing:0.08em;margin:12px 0 8px;">AI Capabilities</div>
          <div class="vs-row">
            <div class="vs-cell vs-them">Legacy: Add-on / Limited</div>
            <div class="vs-cell vs-us">FinanceOS: Built-in with reasoning</div>
          </div>

          <div style="font-size:10px;font-weight:700;color:#636d84;text-transform:uppercase;letter-spacing:0.08em;margin:12px 0 8px;">Pricing Transparency</div>
          <div class="vs-row">
            <div class="vs-cell vs-them">Legacy: "Contact sales"</div>
            <div class="vs-cell vs-us">FinanceOS: Published pricing</div>
          </div>

          <div class="divider"></div>
          <p class="sub" style="text-align:center;">We built FinanceOS because mid-market finance teams deserve enterprise-grade tools without enterprise-grade budgets.</p>
          <div class="cta-wrap">
            <a href="${SITE_URL}/compare/adaptive" class="cta">See Full Comparison</a>
            <a href="${primaryCTA}" class="cta-secondary">${primaryCTAText}</a>
          </div>
        `),
      };

    case 5: // Day 14 — Final Offer + Urgency
      return {
        subject: `${firstName}, your FinanceOS trial access expires soon`,
        html: emailShell(5, 5, `
          ${isEnterprise ? `<div class="urgency">Enterprise Priority Access — Expires in 48 Hours</div>` : `<div class="urgency">Limited Time — 30-Day Money-Back Guarantee</div>`}
          <h2>${isEnterprise ? `${firstName}, let's get you set up.` : `Ready to transform your FP&A, ${firstName}?`}</h2>
          <p class="sub">This is the last email in our series — but we'd love for it to be the beginning of something great for your finance team.</p>

          ${isEnterprise ? `
          <div class="feature-card">
            <div class="feature-title">Your Enterprise Package Includes:</div>
            <div class="feature-desc">
              • Dedicated implementation engineer<br/>
              • Custom SSO + SOC 2 compliance<br/>
              • Multi-entity consolidation<br/>
              • SLA-backed uptime guarantee<br/>
              • Priority Slack support channel<br/>
              • Committed-spend volume discounts
            </div>
          </div>
          <p class="sub">We're holding a priority onboarding slot for your team. Let's schedule a 30-minute call to scope your deployment.</p>
          ` : `
          <div class="feature-card">
            <div class="feature-title">Here's What You Get Today:</div>
            <div class="feature-desc">
              • Full platform access — all features unlocked<br/>
              • Connect your ERP, CRM, billing in minutes<br/>
              • AI copilot active from day one<br/>
              • 30-day money-back guarantee — no risk<br/>
              • Cancel anytime, no contracts
            </div>
          </div>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-num">$499</div><div class="stat-lbl">Starter/mo</div></div>
            <div class="stat-box"><div class="stat-num">$999</div><div class="stat-lbl">Growth/mo</div></div>
            <div class="stat-box"><div class="stat-num">$1,499</div><div class="stat-lbl">Scale/mo</div></div>
          </div>
          `}

          <div class="cta-wrap">
            <a href="${primaryCTA}" class="cta" style="${isEnterprise ? "background:linear-gradient(135deg,#34d399,#60a5fa);" : ""}">${isEnterprise ? "Schedule Enterprise Call" : "Subscribe Now — 30-Day MBG"}</a>
          </div>
          <div class="divider"></div>
          <p class="sub" style="text-align:center;font-size:12px;">Questions? Reply to this email or reach us at <a href="mailto:sales@finance-os.app" style="color:#60a5fa;text-decoration:none;">sales@finance-os.app</a></p>
        `),
      };

    default:
      return null;
  }
}

// ── Resend API ───────────────────────────────────────────────

async function sendEmail({ to, subject, html, replyTo }) {
  if (!RESEND_API_KEY) {
    console.log(`[Drip] No RESEND_API_KEY — would send "${subject}" to ${to}`);
    return { id: "dry_run", status: "logged_only" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      reply_to: replyTo || "sales@finance-os.app",
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${res.status} — ${err}`);
  }
  return res.json();
}

// ── Supabase Helpers ─────────────────────────────────────────

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

// ── POST /api/drip — Trigger or advance drip sequence ────────
// Body: { action: "start" | "send_step", email, lead_data, step }

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, lead_data, step } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action (start | send_step)" }, { status: 400 });
    }

    const supabase = getSupabase();

    // ── ACTION: start — Enroll a new lead in the drip sequence ──
    if (action === "start") {
      if (!email) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 });
      }

      const lead = {
        email: email.trim().toLowerCase(),
        full_name: lead_data?.full_name || lead_data?.name || null,
        company: lead_data?.company || null,
        role: lead_data?.role || lead_data?.title || null,
        plan_interest: lead_data?.plan_interest || lead_data?.interest_type || null,
        source: lead_data?.source || "unknown",
        ...lead_data,
      };

      // 1. Upsert into lead_pipeline table
      if (supabase) {
        try {
          // Check if already in pipeline
          const { data: existing } = await supabase
            .from("lead_pipeline")
            .select("id, status, drip_step")
            .eq("email", lead.email)
            .single();

          if (existing && existing.status !== "unsubscribed") {
            // Already in pipeline — don't restart, just update metadata
            await supabase.from("lead_pipeline").update({
              updated_at: new Date().toISOString(),
              metadata: lead,
            }).eq("email", lead.email);

            return NextResponse.json({
              ok: true,
              status: "already_enrolled",
              current_step: existing.drip_step,
              pipeline_status: existing.status,
            });
          }

          // Insert new lead
          await supabase.from("lead_pipeline").upsert({
            email: lead.email,
            full_name: lead.full_name,
            company: lead.company,
            role: lead.role,
            plan_interest: lead.plan_interest,
            source: lead.source,
            status: "new",
            drip_step: 0,
            drip_started_at: new Date().toISOString(),
            next_drip_at: new Date().toISOString(), // Send first email immediately
            metadata: lead,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: "email" });
        } catch (e) {
          console.warn("[Drip] lead_pipeline upsert failed:", e?.message);
        }
      }

      // 2. Send welcome email (step 1) immediately
      const emailContent = buildDripEmail(1, lead);
      if (emailContent) {
        try {
          const result = await sendEmail({
            to: lead.email,
            subject: emailContent.subject,
            html: emailContent.html,
          });

          // Update pipeline status
          if (supabase) {
            await supabase.from("lead_pipeline").update({
              status: "nurturing",
              drip_step: 1,
              last_drip_at: new Date().toISOString(),
              next_drip_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Next in 2 days
              updated_at: new Date().toISOString(),
            }).eq("email", lead.email);

            // Log the drip send
            await supabase.from("drip_log").insert({
              email: lead.email,
              step: 1,
              step_key: "welcome",
              subject: emailContent.subject,
              status: result.id ? "sent" : "logged",
              resend_id: result.id || null,
              sent_at: new Date().toISOString(),
            }).catch(() => {});
          }

          // 3. Also notify the sales team about the new lead
          try {
            await fetch(new URL("/api/notify", request.url).toString(), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: lead.source?.includes("demo") ? "demo_request" : "waitlist",
                ...lead,
              }),
            });
          } catch {}

          return NextResponse.json({
            ok: true,
            status: "enrolled",
            step_sent: 1,
            next_step_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            email_id: result.id,
          });
        } catch (e) {
          console.error("[Drip] Send welcome failed:", e?.message);
          return NextResponse.json({ ok: true, status: "enrolled_send_failed", error: e?.message });
        }
      }

      return NextResponse.json({ ok: true, status: "enrolled" });
    }

    // ── ACTION: send_step — Send a specific drip step ──
    if (action === "send_step") {
      if (!email || !step) {
        return NextResponse.json({ error: "Missing email or step" }, { status: 400 });
      }

      // Fetch lead data from pipeline
      let lead = lead_data || {};
      if (supabase) {
        const { data: pipelineLead } = await supabase
          .from("lead_pipeline")
          .select("*")
          .eq("email", email.trim().toLowerCase())
          .single();
        if (pipelineLead) {
          lead = { ...pipelineLead.metadata, ...pipelineLead, ...lead };
        }
      }

      const emailContent = buildDripEmail(step, lead);
      if (!emailContent) {
        return NextResponse.json({ error: `Invalid step: ${step}` }, { status: 400 });
      }

      try {
        const result = await sendEmail({
          to: email.trim().toLowerCase(),
          subject: emailContent.subject,
          html: emailContent.html,
        });

        // Update pipeline
        if (supabase) {
          const nextStep = DRIP_SCHEDULE.find(s => s.step === step + 1);
          const updates = {
            drip_step: step,
            last_drip_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          if (nextStep) {
            updates.next_drip_at = new Date(Date.now() + (nextStep.delay_days - DRIP_SCHEDULE[step - 1].delay_days) * 24 * 60 * 60 * 1000).toISOString();
          } else {
            // Last step — mark as qualified
            updates.status = "qualified";
            updates.next_drip_at = null;
          }

          await supabase.from("lead_pipeline").update(updates).eq("email", email.trim().toLowerCase());

          await supabase.from("drip_log").insert({
            email: email.trim().toLowerCase(),
            step,
            step_key: DRIP_SCHEDULE[step - 1]?.key || `step_${step}`,
            subject: emailContent.subject,
            status: result.id ? "sent" : "logged",
            resend_id: result.id || null,
            sent_at: new Date().toISOString(),
          }).catch(() => {});
        }

        return NextResponse.json({ ok: true, step_sent: step, email_id: result.id });
      } catch (e) {
        console.error(`[Drip] Step ${step} send failed:`, e?.message);
        return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
      }
    }

    // ── ACTION: process — Process all pending drip sends (cron) ──
    if (action === "process") {
      if (!supabase) {
        return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
      }

      const now = new Date().toISOString();
      const { data: dueLeads, error } = await supabase
        .from("lead_pipeline")
        .select("*")
        .eq("status", "nurturing")
        .lte("next_drip_at", now)
        .lt("drip_step", 5)
        .order("next_drip_at", { ascending: true })
        .limit(50);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const results = [];
      for (const lead of dueLeads || []) {
        const nextStep = lead.drip_step + 1;
        const emailContent = buildDripEmail(nextStep, { ...lead.metadata, ...lead });

        if (!emailContent) continue;

        try {
          const result = await sendEmail({
            to: lead.email,
            subject: emailContent.subject,
            html: emailContent.html,
          });

          const scheduleEntry = DRIP_SCHEDULE.find(s => s.step === nextStep + 1);
          const updates = {
            drip_step: nextStep,
            last_drip_at: now,
            updated_at: now,
          };

          if (scheduleEntry) {
            const daysDiff = scheduleEntry.delay_days - DRIP_SCHEDULE[nextStep - 1].delay_days;
            updates.next_drip_at = new Date(Date.now() + daysDiff * 24 * 60 * 60 * 1000).toISOString();
          } else {
            updates.status = "qualified";
            updates.next_drip_at = null;
          }

          await supabase.from("lead_pipeline").update(updates).eq("email", lead.email);
          await supabase.from("drip_log").insert({
            email: lead.email,
            step: nextStep,
            step_key: DRIP_SCHEDULE[nextStep - 1]?.key,
            subject: emailContent.subject,
            status: "sent",
            resend_id: result.id || null,
            sent_at: now,
          }).catch(() => {});

          results.push({ email: lead.email, step: nextStep, status: "sent" });
        } catch (e) {
          results.push({ email: lead.email, step: nextStep, status: "failed", error: e?.message });
        }
      }

      return NextResponse.json({
        ok: true,
        processed: results.length,
        results,
      });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (e) {
    console.error("[Drip] Error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── GET /api/drip — Pipeline health + stats ──────────────────

export async function GET(request) {
  const supabase = getSupabase();

  let stats = null;
  if (supabase) {
    try {
      const [
        { count: total },
        { count: nurturing },
        { count: qualified },
        { count: converted },
      ] = await Promise.all([
        supabase.from("lead_pipeline").select("*", { count: "exact", head: true }),
        supabase.from("lead_pipeline").select("*", { count: "exact", head: true }).eq("status", "nurturing"),
        supabase.from("lead_pipeline").select("*", { count: "exact", head: true }).eq("status", "qualified"),
        supabase.from("lead_pipeline").select("*", { count: "exact", head: true }).eq("status", "converted"),
      ]);
      stats = { total, nurturing, qualified, converted };
    } catch {}
  }

  return NextResponse.json({
    service: "FinanceOS Lead Drip Pipeline",
    status: "active",
    schedule: DRIP_SCHEDULE,
    routing: "Enterprise → sales call | Others → self-serve Stripe",
    resend_configured: !!RESEND_API_KEY,
    supabase_configured: !!supabase,
    stats,
  });
}
