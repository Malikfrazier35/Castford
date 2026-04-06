import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Intuit OAuth 2.0 callback — exchanges authorization code for access/refresh tokens
const TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
const CLIENT_ID = process.env.INTUIT_CLIENT_ID;
const CLIENT_SECRET = process.env.INTUIT_CLIENT_SECRET;
const REDIRECT_URI = process.env.INTUIT_REDIRECT_URI || "https://castford.com/api/integrations/intuit/callback";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const realmId = url.searchParams.get("realmId");
    const error = url.searchParams.get("error");

    // Handle user denial
    if (error) {
      return NextResponse.redirect("https://castford.com/?integration=quickbooks&status=denied");
    }

    if (!code || !state || !realmId) {
      return NextResponse.redirect("https://castford.com/?integration=quickbooks&status=error&reason=missing_params");
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.redirect("https://castford.com/?integration=quickbooks&status=error&reason=not_configured");
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify state matches a pending integration
    const { data: integration } = await supabaseAdmin
      .from("integrations")
      .select("*")
      .eq("provider", "quickbooks")
      .eq("status", "pending")
      .single();

    if (!integration || integration.config?.state !== state) {
      return NextResponse.redirect("https://castford.com/?integration=quickbooks&status=error&reason=invalid_state");
    }

    // Exchange authorization code for tokens
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const tokenRes = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
        "Accept": "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect("https://castford.com/?integration=quickbooks&status=error&reason=token_exchange_failed");
    }

    const tokens = await tokenRes.json();

    // Store tokens securely (encrypted at rest via Supabase)
    await supabaseAdmin.from("integrations").update({
      status: "connected",
      config: {
        realm_id: realmId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        refresh_expires_at: new Date(Date.now() + (tokens.x_refresh_token_expires_in || 8726400) * 1000).toISOString(),
        connected_at: new Date().toISOString(),
      },
    }).eq("id", integration.id);

    // Log the connection event
    await supabaseAdmin.from("audit_log").insert({
      user_id: integration.user_id,
      action: "integration.connected",
      resource: "quickbooks",
      details: { realm_id: realmId },
    });

    return NextResponse.redirect("https://castford.com/?integration=quickbooks&status=connected");
  } catch (err) {
    return NextResponse.redirect("https://castford.com/?integration=quickbooks&status=error&reason=unexpected");
  }
}
