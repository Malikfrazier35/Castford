import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Intuit OAuth 2.0 disconnect — revokes tokens and removes integration
const REVOKE_URL = "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";
const CLIENT_ID = process.env.INTUIT_CLIENT_ID;
const CLIENT_SECRET = process.env.INTUIT_CLIENT_SECRET;

export async function POST(request) {
  try {
    // Verify user auth
    const authHeader = request.headers.get("authorization");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get current integration
    const { data: integration } = await supabaseAdmin
      .from("integrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "quickbooks")
      .eq("status", "connected")
      .single();

    if (!integration) {
      return NextResponse.json({ error: "No active QuickBooks connection" }, { status: 404 });
    }

    // Revoke refresh token at Intuit
    if (integration.config?.refresh_token && CLIENT_ID && CLIENT_SECRET) {
      const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
      try {
        await fetch(REVOKE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${basicAuth}`,
            "Accept": "application/json",
          },
          body: JSON.stringify({ token: integration.config.refresh_token }),
        });
      } catch {
        // Revocation is best-effort — continue with local cleanup
      }
    }

    // Update integration status
    await supabaseAdmin.from("integrations").update({
      status: "disconnected",
      config: {
        realm_id: integration.config?.realm_id,
        disconnected_at: new Date().toISOString(),
        // Tokens cleared — never stored after disconnect
      },
    }).eq("id", integration.id);

    // Log disconnection
    await supabaseAdmin.from("audit_log").insert({
      user_id: user.id,
      action: "integration.disconnected",
      resource: "quickbooks",
      details: { realm_id: integration.config?.realm_id },
    });

    return NextResponse.json({ success: true, message: "QuickBooks disconnected" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
