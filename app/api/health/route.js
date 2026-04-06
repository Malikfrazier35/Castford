import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════
// Castford — Health Check & System Status
// Use: Uptime monitoring, load balancer health checks, spike detection
// GET /api/health → { status, latency, db, timestamp }
// ═══════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  const start = Date.now();
  const checks = { api: "ok", db: "unknown", resend: "unknown" };
  let dbLatency = null;

  // ── Database health check ──
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const dbStart = Date.now();
      const { error } = await supabase.from("waitlist").select("id").limit(1);
      dbLatency = Date.now() - dbStart;
      checks.db = error ? "degraded" : "ok";
    } catch {
      checks.db = "down";
    }
  }

  // ── Resend API check (lightweight — just verify key exists) ──
  checks.resend = process.env.RESEND_API_KEY ? "configured" : "missing";

  const totalLatency = Date.now() - start;
  const allOk = checks.api === "ok" && checks.db === "ok";

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      latency: {
        total: `${totalLatency}ms`,
        db: dbLatency ? `${dbLatency}ms` : null,
      },
      checks,
      environment: process.env.VERCEL_ENV || "development",
      region: process.env.VERCEL_REGION || "unknown",
    },
    {
      status: allOk ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
        "X-Response-Time": `${totalLatency}ms`,
      },
    }
  );
}
