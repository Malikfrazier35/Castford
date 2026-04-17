import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@17.7.0";
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-12-18.acacia" });
const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ALLOWED_ORIGINS = ["https://castford.com","https://www.castford.com","https://castford.vercel.app","http://localhost:3000"];
function cors(req: Request) { const o = req.headers.get("origin")||""; return { "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(o)?o:ALLOWED_ORIGINS[0], "Access-Control-Allow-Methods":"POST, OPTIONS", "Access-Control-Allow-Headers":"Content-Type, Authorization, apikey" }; }
async function ensurePortalConfig(): Promise<void> { try { const configs = await stripe.billingPortal.configurations.list({ limit: 1 }); if (configs.data.length > 0) return; await stripe.billingPortal.configurations.create({ business_profile: { headline: "Manage your Castford subscription" }, features: { invoice_history: { enabled: true }, payment_method_update: { enabled: true }, subscription_cancel: { enabled: true, mode: "at_period_end", cancellation_reason: { enabled: true, options: ["too_expensive","missing_features","switched_service","unused","other"] } }, customer_update: { enabled: true, allowed_updates: ["email","name"] } } }); } catch {} }
Deno.serve(async (req: Request) => {
  const headers = cors(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Missing authorization" }), { status: 401, headers });
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers });
  try {
    const { data: userProfile } = await supabaseAdmin.from("users").select("org_id, role").eq("id", user.id).maybeSingle();
    if (!userProfile?.org_id) return new Response(JSON.stringify({ error: "No organization found" }), { status: 200, headers: { "Content-Type": "application/json", ...headers } });
    if (!['owner','admin'].includes(userProfile.role)) return new Response(JSON.stringify({ error: "Only owners and admins can manage billing" }), { status: 403, headers });
    const { data: org } = await supabaseAdmin.from("organizations").select("stripe_customer_id, plan, stripe_subscription_id, name").eq("id", userProfile.org_id).maybeSingle();
    let customerId = org?.stripe_customer_id;
    if (!customerId) { const customer = await stripe.customers.create({ email: user.email||undefined, name: org?.name||undefined, metadata: { org_id: userProfile.org_id, user_id: user.id } }); customerId = customer.id; await supabaseAdmin.from("organizations").update({ stripe_customer_id: customerId }).eq("id", userProfile.org_id); }
    await ensurePortalConfig();
    const origin = req.headers.get("origin") || "https://castford.com";
    const portalSession = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${origin}?portal=returned` });
    try { await supabaseAdmin.from("audit_log").insert({ user_id: user.id, org_id: userProfile.org_id, action: "billing.portal_opened", resource_type: "stripe", resource_id: portalSession.id, metadata: { plan: org?.plan } }); } catch {}
    return new Response(JSON.stringify({ url: portalSession.url, plan: org?.plan }), { status: 200, headers: { "Content-Type": "application/json", ...headers } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Failed" }), { status: 500, headers: { "Content-Type": "application/json", ...headers } });
  }
});
