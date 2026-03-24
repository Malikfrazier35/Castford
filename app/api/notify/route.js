import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════
// FinanceOS — Smart Notification Pipeline
// Handles: demo_request, waitlist, investor_inquiry, sales_inquiry
// Sends formatted HTML emails via Resend to sales@finance-os.app
// FROM: noreply@finance-os.app (no-reply sender)
// ═══════════════════════════════════════════════════════════════

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const NOTIFY_TO = "sales@finance-os.app";
const NOTIFY_FROM = "FinanceOS Alerts <noreply@finance-os.app>";

// ── Email Templates ──────────────────────────────────────────

const baseStyles = `
  body { margin: 0; padding: 0; background: #06080c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .container { max-width: 560px; margin: 0 auto; background: #10131a; border-radius: 16px; overflow: hidden; border: 1px solid #1a1f2e; }
  .header { padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #1a1f2e; }
  .header h1 { font-size: 20px; font-weight: 800; color: #f0f2f5; margin: 0 0 4px; letter-spacing: -0.02em; }
  .header .subtitle { font-size: 12px; color: #636d84; }
  .body { padding: 28px 32px; }
  .field { margin-bottom: 16px; }
  .field-label { font-size: 10px; font-weight: 700; color: #636d84; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
  .field-value { font-size: 14px; color: #f0f2f5; font-weight: 500; line-height: 1.5; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
  .priority-high { background: rgba(240,107,107,0.12); color: #f06b6b; border: 1px solid rgba(240,107,107,0.2); }
  .priority-medium { background: rgba(245,183,49,0.12); color: #f5b731; border: 1px solid rgba(245,183,49,0.2); }
  .priority-normal { background: rgba(91,156,245,0.12); color: #5b9cf5; border: 1px solid rgba(91,156,245,0.2); }
  .footer { padding: 20px 32px; border-top: 1px solid #1a1f2e; text-align: center; }
  .footer p { font-size: 10px; color: #3d4558; margin: 0; }
  .cta-btn { display: inline-block; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; color: #fff; text-decoration: none; margin-top: 8px; }
  .accent-bg { background: linear-gradient(135deg, #60a5fa, #a78bfa); }
  .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; margin-right: 6px; }
  .divider { height: 1px; background: #1a1f2e; margin: 16px 0; }
  .stat-row { display: flex; gap: 16px; margin-top: 12px; }
  .stat { text-align: center; flex: 1; padding: 12px; background: rgba(16,19,26,0.6); border: 1px solid #1a1f2e; border-radius: 10px; }
  .stat-value { font-size: 18px; font-weight: 800; color: #60a5fa; font-family: 'JetBrains Mono', monospace; }
  .stat-label { font-size: 9px; color: #636d84; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
`;

function buildEmailHTML({ type, subject, badge, badgeClass, fields, ctaText, ctaUrl, timestamp }) {
  const fieldRows = fields
    .filter(f => f.value)
    .map(f => `
      <div class="field">
        <div class="field-label">${f.label}</div>
        <div class="field-value">${f.value}</div>
      </div>
    `).join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>${baseStyles}</style></head>
<body style="background:#06080c;padding:24px 12px;">
<div class="container">
  <div class="header">
    <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:16px;">
      <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#60a5fa,#a78bfa);display:inline-flex;align-items:center;justify-content:center;">
        <span style="font-size:18px;font-weight:900;color:#fff;">F</span>
      </div>
      <span style="font-size:16px;font-weight:800;color:#f0f2f5;letter-spacing:-0.02em;">Finance<span style="font-weight:400;opacity:0.6;">OS</span></span>
    </div>
    <h1>${subject}</h1>
    <div class="subtitle" style="margin-top:8px;">
      <span class="badge ${badgeClass}">${badge}</span>
      <span style="margin-left:8px;font-size:11px;color:#3d4558;">${timestamp}</span>
    </div>
  </div>
  <div class="body">
    ${fieldRows}
    ${ctaText ? `<div style="text-align:center;margin-top:20px;"><a href="${ctaUrl}" class="cta-btn accent-bg">${ctaText}</a></div>` : ""}
  </div>
  <div class="footer">
    <p>FinanceOS Smart Notifications · finance-os.app</p>
    <p style="margin-top:4px;">This alert was generated automatically. Do not reply to this email.</p>
  </div>
</div>
</body>
</html>`;
}

// ── Template Builders ────────────────────────────────────────

function demoRequestEmail(data) {
  return {
    subject: `[Demo Request] ${data.full_name || "Unknown"} — FinanceOS`,
    html: buildEmailHTML({
      type: "demo_request",
      subject: "New Demo Request",
      badge: "DEMO REQUEST",
      badgeClass: "priority-high",
      timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }),
      fields: [
        { label: "Full Name", value: data.full_name },
        { label: "Work Email", value: data.email },
        { label: "Company", value: data.company },
        { label: "Title / Role", value: data.title },
        { label: "Company Size", value: data.company_size },
        { label: "Use Case", value: data.use_case },
        { label: "Current Tools", value: data.current_tools },
        { label: "Source", value: data.source || "homepage_modal" },
      ],
      ctaText: `Reply to ${data.email}`,
      ctaUrl: `mailto:${data.email}?subject=Your%20FinanceOS%20Demo%20Request&body=Hi%20${encodeURIComponent(data.full_name || "")},%0A%0AThanks%20for%20requesting%20a%20demo%20of%20FinanceOS.%20`,
    }),
  };
}

function waitlistEmail(data) {
  return {
    subject: `[${data.interest_type === "demo" ? "Demo Signup" : "Waitlist"}] ${data.email || "Unknown"} — FinanceOS`,
    html: buildEmailHTML({
      type: "waitlist",
      subject: data.interest_type === "demo" ? "Demo Signup" : "New Waitlist Signup",
      badge: data.interest_type === "demo" ? "DEMO SIGNUP" : "WAITLIST",
      badgeClass: "priority-medium",
      timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }),
      fields: [
        { label: "Email", value: data.email },
        { label: "Full Name", value: data.full_name },
        { label: "Company", value: data.company },
        { label: "Role", value: data.role },
        { label: "Interest", value: data.interest_type },
        { label: "Source", value: data.source },
        { label: "Plan Interest", value: data.plan_interest },
      ],
      ctaText: data.email ? `Reply to ${data.email}` : null,
      ctaUrl: data.email ? `mailto:${data.email}?subject=Welcome%20to%20FinanceOS` : null,
    }),
  };
}

function investorEmail(data) {
  return {
    subject: `[Investor Inquiry] ${data.name || data.email || "Unknown"} — FinanceOS`,
    html: buildEmailHTML({
      type: "investor_inquiry",
      subject: "Investor Deck Request",
      badge: "INVESTOR INQUIRY",
      badgeClass: "priority-high",
      timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }),
      fields: [
        { label: "Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Firm", value: data.firm },
        { label: "Check Size Range", value: data.check_size },
        { label: "Source", value: data.source || "investor_cta" },
      ],
      ctaText: data.email ? `Reply to Investor` : null,
      ctaUrl: data.email ? `mailto:${data.email}?subject=FinanceOS%20—%20Investor%20Deck` : null,
    }),
  };
}

function salesEmail(data) {
  return {
    subject: `[Enterprise Lead] ${data.company || data.email || "Unknown"} — FinanceOS`,
    html: buildEmailHTML({
      type: "sales_inquiry",
      subject: "Enterprise Sales Inquiry",
      badge: "ENTERPRISE LEAD",
      badgeClass: "priority-high",
      timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }),
      fields: [
        { label: "Contact Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Company", value: data.company },
        { label: "Title", value: data.title },
        { label: "Company Size", value: data.company_size },
        { label: "Inquiry Type", value: data.inquiry_type || "Enterprise Pricing" },
        { label: "Source", value: data.source || "sales_cta" },
      ],
      ctaText: data.email ? `Reply to ${data.email}` : null,
      ctaUrl: data.email ? `mailto:${data.email}?subject=FinanceOS%20Enterprise%20Inquiry` : null,
    }),
  };
}

// ── Resend API ───────────────────────────────────────────────

async function sendViaResend({ to, from, subject, html, replyTo }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: from || NOTIFY_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      reply_to: replyTo || undefined,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error: ${res.status} — ${err}`);
  }
  return res.json();
}

// ── Supabase Logging ─────────────────────────────────────────

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

async function logNotification(supabase, { type, email, data, status, error }) {
  if (!supabase) return;
  try {
    await supabase.from("notification_log").insert({
      event_type: type,
      recipient_email: email,
      payload: data,
      status,
      error_message: error || null,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("[FinanceOS Notify] Failed to log notification:", e?.message);
  }
}

// ── Main Handler ─────────────────────────────────────────────

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (!type) {
      return NextResponse.json({ error: "Missing notification type" }, { status: 400 });
    }

    // Build email based on type
    let email;
    switch (type) {
      case "demo_request":
        email = demoRequestEmail(data);
        break;
      case "waitlist":
        email = waitlistEmail(data);
        break;
      case "investor_inquiry":
        email = investorEmail(data);
        break;
      case "sales_inquiry":
        email = salesEmail(data);
        break;
      default:
        return NextResponse.json({ error: `Unknown notification type: ${type}` }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Also save to waitlist table for CRM tracking (if applicable)
    if (supabase && (type === "demo_request" || type === "waitlist")) {
      try {
        await supabase.from("waitlist").upsert({
          email: data.email?.trim(),
          full_name: data.full_name || data.name,
          company: data.company,
          role: data.role || data.title,
          interest_type: type === "demo_request" ? "demo" : (data.interest_type || "trial"),
          source: data.source || type,
          metadata: JSON.stringify({ ...data, notification_sent: true }),
        }, { onConflict: "email" });
      } catch (e) {
        console.warn("[FinanceOS Notify] Waitlist upsert failed:", e?.message);
      }
    }

    // Send via Resend if API key is configured
    if (RESEND_API_KEY) {
      try {
        await sendViaResend({
          to: NOTIFY_TO,
          from: NOTIFY_FROM,
          subject: email.subject,
          html: email.html,
          replyTo: data.email || undefined,
        });
        await logNotification(supabase, { type, email: NOTIFY_TO, data, status: "sent" });
        return NextResponse.json({ ok: true, status: "sent" });
      } catch (e) {
        console.error("[FinanceOS Notify] Resend error:", e?.message);
        await logNotification(supabase, { type, email: NOTIFY_TO, data, status: "failed", error: e?.message });
        // Fall through — still return 200 so the form doesn't error for the user
        return NextResponse.json({ ok: true, status: "queued", note: "Email delivery pending" });
      }
    } else {
      // No Resend key — log only, no email
      await logNotification(supabase, { type, email: NOTIFY_TO, data, status: "logged_only" });
      return NextResponse.json({ ok: true, status: "logged", note: "RESEND_API_KEY not configured — notification logged only" });
    }
  } catch (e) {
    console.error("[FinanceOS Notify] Error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: "FinanceOS Smart Notifications",
    status: "active",
    types: ["demo_request", "waitlist", "investor_inquiry", "sales_inquiry"],
    destination: NOTIFY_TO,
    sender: NOTIFY_FROM,
    resend_configured: !!RESEND_API_KEY,
  });
}
