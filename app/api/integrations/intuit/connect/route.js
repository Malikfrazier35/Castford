import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Intuit OAuth 2.0 — initiates authorization flow
// Docs: https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0

const INTUIT_AUTH_URL = "https://appcenter.intuit.com/connect/oauth2";
const CLIENT_ID = process.env.INTUIT_CLIENT_ID;
const REDIRECT_URI = process.env.INTUIT_REDIRECT_URI || "https://finance-os.app/api/integrations/intuit/callback";
const SCOPES = "com.intuit.quickbooks.accounting";

export async function GET(request) {
  try {
    if (!CLIENT_ID) {
      return NextResponse.json({ error: "Intuit integration not configured" }, { status: 503 });
    }

    // Extract user from Supabase auth
    const authHeader = request.headers.get("authorization");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Generate CSRF state token
    const state = crypto.randomUUID();

    // Store state in DB for verification on callback
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    await supabaseAdmin.from("integrations").upsert({
      user_id: user.id,
      provider: "quickbooks",
      status: "pending",
      config: { state, initiated_at: new Date().toISOString() },
    }, { onConflict: "user_id,provider" });

    // Build Intuit OAuth URL
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: SCOPES,
      state,
    });

    return NextResponse.redirect(`${INTUIT_AUTH_URL}?${params.toString()}`);
  } catch (err) {
    return NextResponse.json({ error: "Failed to initiate connection" }, { status: 500 });
  }
}
