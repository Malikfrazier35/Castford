import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const ADMIN_EMAILS = (Deno.env.get("ADMIN_EMAILS") || "malikfrazier35@yahoo.com").split(",").map(e => e.trim());
const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const SLACK_WEBHOOK = Deno.env.get("SLACK_WEBHOOK_URL") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Castford <notifications@castford.com>";
const CALENDLY_URL = Deno.env.get("CALENDLY_URL") || "https://calendly.com/castford-support/30min";

async function sendSlack(lead: Record<string, any>): Promise<boolean> {
  if (!SLACK_WEBHOOK) return false;
  try {
    const priority = (lead.company_size === "500+" || lead.company_size === "201-500");
    const emoji = priority ? ":fire:" : ":incoming_envelope:";
    const text = [
      `${emoji} *New Demo Request* ${priority ? "(HIGH PRIORITY)" : ""}`,
      `>*Name:* ${lead.full_name || "-"}`,
      `>*Email:* <mailto:${lead.email}|${lead.email}>`,
      `>*Company:* ${lead.company || "-"} (${lead.company_size || "?"} employees)`,
      `>*Title:* ${lead.title || "-"}`,
      `>*Use Case:* ${lead.use_case || "-"}`,
      ``,
      `<mailto:${lead.email}?subject=Your%20Castford%20Demo|Reply to Lead> | <https://castford.com/admin|Open Dashboard>`,
    ].filter(Boolean).join("\n");
    const res = await fetch(SLACK_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    return res.ok;
  } catch { return false; }
}

async function sendAdminEmail(lead: Record<string, any>): Promise<{sent: boolean, debug: string}> {
  if (!RESEND_KEY) return { sent: false, debug: "NO_KEY" };
  const subject = `New Lead - ${lead.full_name || lead.email}`;
  const html = `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px"><h2>New Demo Request</h2><p><b>Name:</b> ${lead.full_name || '-'}</p><p><b>Email:</b> ${lead.email}</p><p><b>Company:</b> ${lead.company || '-'}</p><p><b>Use Case:</b> ${lead.use_case || '-'}</p><p><a href="mailto:${lead.email}?subject=Your%20Castford%20Demo">Reply to Lead</a></p></div>`;
  let debug = ""; let sent = false;
  for (const to of ADMIN_EMAILS) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
      });
      const body = await res.text();
      debug += `admin[${to}]:${res.status} `;
      if (res.ok) sent = true;
    } catch (err) { debug += `admin_err:${err} `; }
  }
  return { sent, debug };
}

async function sendProspectAutoReply(lead: Record<string, any>): Promise<{sent: boolean, debug: string}> {
  if (!RESEND_KEY) return { sent: false, debug: "NO_KEY" };
  const firstName = (lead.full_name || "").split(" ")[0] || "there";
  const subject = `Your Castford demo \u2014 let's get you scheduled`;
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:580px;margin:0 auto;background:#ffffff;color:#1a1a2e;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
  <div style="background:#0C1420;padding:28px 32px;text-align:center">
    <div style="display:inline-flex;align-items:center;gap:10px">
      <div style="width:32px;height:32px;border:1.5px solid #B8924A;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#B8924A;font-family:Georgia,serif;letter-spacing:1px">CF</div>
      <span style="font-size:18px;font-weight:400;color:#f0f2f7;letter-spacing:2px;font-family:Georgia,serif;text-transform:uppercase">Castford</span>
    </div>
  </div>
  <div style="padding:32px">
    <h1 style="font-size:22px;font-weight:700;color:#1a1a2e;margin:0 0 8px">Thanks for your interest, ${firstName}!</h1>
    <p style="font-size:15px;line-height:1.7;color:#4b5563;margin:0 0 24px">
      We received your demo request and we're excited to show you how Castford can streamline your financial planning and analysis.
    </p>
    <div style="text-align:center;margin-bottom:28px">
      <a href="${CALENDLY_URL}" style="display:inline-block;background:#B8924A;color:#0C1420;padding:14px 32px;text-decoration:none;font-weight:700;font-size:15px">Book Your Demo Now</a>
      <p style="font-size:12px;color:#9ca3af;margin:10px 0 0">Pick a time that works \u2014 takes 30 seconds</p>
    </div>
    <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:0;padding:20px;margin-bottom:24px">
      <p style="font-size:13px;color:#6b7280;margin:0 0 12px;font-weight:700;letter-spacing:0.03em">WHAT TO EXPECT IN YOUR DEMO</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;vertical-align:top;width:28px"><div style="width:22px;height:22px;text-align:center;line-height:22px;font-size:11px;font-weight:800;color:#B8924A;border:1px solid #B8924A">1</div></td><td style="padding:8px 0 8px 10px"><span style="font-size:13px;color:#1a1a2e;font-weight:600">Connect your data</span><br/><span style="font-size:12px;color:#6b7280">See how your GL feeds into automated reports</span></td></tr>
        <tr><td style="padding:8px 0;vertical-align:top"><div style="width:22px;height:22px;text-align:center;line-height:22px;font-size:11px;font-weight:800;color:#B8924A;border:1px solid #B8924A">2</div></td><td style="padding:8px 0 8px 10px"><span style="font-size:13px;color:#1a1a2e;font-weight:600">Budget vs. Actual in real-time</span><br/><span style="font-size:12px;color:#6b7280">AI flags variances automatically \u2014 no more manual checks</span></td></tr>
        <tr><td style="padding:8px 0;vertical-align:top"><div style="width:22px;height:22px;text-align:center;line-height:22px;font-size:11px;font-weight:800;color:#B8924A;border:1px solid #B8924A">3</div></td><td style="padding:8px 0 8px 10px"><span style="font-size:13px;color:#1a1a2e;font-weight:600">Ask your data questions</span><br/><span style="font-size:12px;color:#6b7280">\"Why is COGS up 12%?\" \u2014 answered in seconds</span></td></tr>
      </table>
    </div>
    <div style="display:flex;gap:12px;margin-bottom:24px">
      <div style="flex:1;background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;text-align:center"><div style="font-size:22px;font-weight:800;color:#16a34a;font-family:'Courier New',monospace">48hrs</div><div style="font-size:11px;color:#4ade80;font-weight:600;margin-top:4px">Go-live time</div></div>
      <div style="flex:1;background:#eff6ff;border:1px solid #bfdbfe;padding:16px;text-align:center"><div style="font-size:22px;font-weight:800;color:#2563eb;font-family:'Courier New',monospace">3.2%</div><div style="font-size:11px;color:#60a5fa;font-weight:600;margin-top:4px">Forecast MAPE</div></div>
      <div style="flex:1;background:#faf5ff;border:1px solid #e9d5ff;padding:16px;text-align:center"><div style="font-size:22px;font-weight:800;color:#7c3aed;font-family:'Courier New',monospace">70%</div><div style="font-size:11px;color:#a78bfa;font-weight:600;margin-top:4px">Less manual work</div></div>
    </div>
    <div style="border-top:1px solid #e5e7eb;padding-top:20px;margin-bottom:20px">
      <p style="font-size:13px;color:#6b7280;margin:0 0 12px;font-weight:700;letter-spacing:0.03em">EXPLORE WHILE YOU WAIT</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        <a href="https://castford.com" style="font-size:13px;color:#B8924A;text-decoration:none;font-weight:600">Try the interactive dashboard demo \u2192</a>
        <a href="https://castford.com/use-cases/saas-fpa" style="font-size:13px;color:#B8924A;text-decoration:none;font-weight:600">Guide: Modern FP&A for growing teams \u2192</a>
        <a href="https://castford.com/#features" style="font-size:13px;color:#B8924A;text-decoration:none;font-weight:600">See all platform features \u2192</a>
      </div>
    </div>
    <p style="font-size:14px;line-height:1.7;color:#4b5563;margin:0">If you'd rather just reply to this email, I'll personally get back to you within a few hours.</p>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb">
      <p style="font-size:13px;color:#1a1a2e;margin:0;font-weight:700">Malik Frazier</p>
      <p style="font-size:12px;color:#6b7280;margin:2px 0 0">Founder, Castford</p>
    </div>
  </div>
</div>`;
  let debug = ""; let sent = false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({ from: FROM_EMAIL, to: lead.email, reply_to: "support@castford.com", subject, html }),
    });
    const body = await res.text();
    debug = `prospect[${lead.email}]:${res.status}:${body}`;
    if (res.ok) sent = true;
  } catch (err) { debug = `prospect_err:${err}`; }
  return { sent, debug };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  try {
    const { email, full_name, company, title, company_size, use_case, current_tools, message, preferred_time, timezone } = await req.json();
    if (!email || !email.includes("@")) return new Response(JSON.stringify({ error: "Valid email required" }), { status: 400, headers: corsHeaders });
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: demoReq, error: demoErr } = await supabase.from("demo_requests").insert({
      email: email.trim().toLowerCase(), full_name, company, title, company_size, use_case, current_tools, message, preferred_time, timezone: timezone || "America/New_York",
    }).select().single();
    if (demoErr) throw demoErr;
    const { data: existingLead } = await supabase.from("leads").select("id, stage").eq("email", email.trim().toLowerCase()).single();
    let leadId = existingLead?.id;
    if (!existingLead) {
      const acvMap: Record<string, number> = { "1-10": 6000, "11-50": 18000, "51-200": 48000, "201-500": 80000, "500+": 150000 };
      const { data: newLead } = await supabase.from("leads").insert({
        email: email.trim().toLowerCase(), full_name, company, title, company_size, source: "demo_request", stage: "demo_scheduled",
        priority: company_size === "500+" || company_size === "201-500" ? "high" : "medium",
        estimated_acv: acvMap[company_size || "11-50"] || 18000, close_probability: 25,
        notes: `Demo requested. Use case: ${use_case || "N/A"}.`, tags: ["demo_request", use_case || "general"].filter(Boolean),
      }).select().single();
      leadId = newLead?.id;
    } else {
      await supabase.from("leads").update({ stage: existingLead.stage === "new" || existingLead.stage === "contacted" ? "demo_scheduled" : existingLead.stage, last_contacted_at: new Date().toISOString() }).eq("id", existingLead.id);
    }
    if (leadId) {
      await supabase.from("demo_requests").update({ lead_id: leadId }).eq("id", demoReq.id);
      await supabase.from("sales_activities").insert({ lead_id: leadId, activity_type: "demo", subject: `Demo requested by ${full_name || email}`, body: `Company: ${company || "N/A"}, Use case: ${use_case || "N/A"}`, outcome: "completed" });
    }
    try { await supabase.from("waitlist").upsert({ email: email.trim().toLowerCase(), full_name, company, role: title, interest_type: "demo", source: "demo_form" }, { onConflict: "email" }); } catch {}
    const channels: string[] = [];
    const leadData = { email: email.trim().toLowerCase(), full_name, company, title, company_size, use_case };
    const adminResult = await sendAdminEmail(leadData);
    if (adminResult.sent) channels.push("email");
    const prospectResult = await sendProspectAutoReply(leadData);
    if (prospectResult.sent) channels.push("prospect_email");
    const slackSent = await sendSlack(leadData);
    if (slackSent) channels.push("slack");
    await supabase.from("lead_notifications").insert({
      email: leadData.email, full_name: leadData.full_name, company: leadData.company,
      company_size: leadData.company_size, use_case: leadData.use_case,
      channels_sent: channels, raw_payload: leadData, notified_at: new Date().toISOString(),
      debug_info: { version: "v25-castford", admin: adminResult.debug, prospect: prospectResult.debug, slack: slackSent },
    });
    return new Response(JSON.stringify({ success: true, demo_id: demoReq.id }), { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("[request-demo] Error:", err);
    return new Response(JSON.stringify({ error: "Failed" }), { status: 500, headers: corsHeaders });
  }
});
