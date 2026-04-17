import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id ?? null;
    }

    const { action, consents, consent_type } = await req.json();

    // Record consent grants/revocations
    if (action === "record") {
      if (!consents || !Array.isArray(consents)) {
        return new Response(JSON.stringify({ error: "consents array required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const records = consents.map((c: { type: string; granted: boolean }) => ({
        user_id: userId,
        consent_type: c.type,
        granted: c.granted,
        ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
        user_agent: req.headers.get("user-agent") || null,
        policy_version: "2026-04-06",
      }));

      const { error } = await supabase.from("consent_log").insert(records);
      if (error) throw error;

      return new Response(JSON.stringify({ ok: true, recorded: records.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get current consent status for a user
    if (action === "status") {
      if (!userId) {
        return new Response(JSON.stringify({ error: "Authentication required" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Get the latest consent record per type
      const { data, error } = await supabase
        .from("consent_log")
        .select("consent_type, granted, created_at, policy_version")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Deduplicate to latest per type
      const latest: Record<string, any> = {};
      for (const row of data || []) {
        if (!latest[row.consent_type]) {
          latest[row.consent_type] = row;
        }
      }

      return new Response(JSON.stringify({ consents: latest }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Revoke a specific consent type
    if (action === "revoke") {
      if (!userId || !consent_type) {
        return new Response(JSON.stringify({ error: "userId and consent_type required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const { error } = await supabase.from("consent_log").insert({
        user_id: userId,
        consent_type,
        granted: false,
        ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
        user_agent: req.headers.get("user-agent") || null,
        policy_version: "2026-04-06",
      });

      if (error) throw error;

      return new Response(JSON.stringify({ ok: true, revoked: consent_type }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action. Use: record, status, revoke" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
