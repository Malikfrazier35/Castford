// supabase/functions/_shared/rate-limit.ts
// Shared rate-limiting helper backed by the public.check_rate_limit() token-bucket RPC.
// Baseline F-028 — added 2026-04-18.

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface RateLimitConfig {
  key: string;
  maxTokens?: number;
  refillRate?: number;
  refillInterval?: string;
  cost?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  error?: string;
}

export async function checkRateLimit(
  supabase: SupabaseClient,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_key: config.key,
    p_max_tokens: config.maxTokens ?? 30,
    p_refill_rate: config.refillRate ?? 5,
    p_refill_interval: config.refillInterval ?? '00:01:00',
    p_cost: config.cost ?? 1,
  });

  if (error) {
    console.error('[rate-limit] check_rate_limit RPC failed:', error.message);
    return { allowed: false, error: error.message };
  }

  return { allowed: Boolean(data) };
}

export function rateLimitKey(
  req: Request,
  prefix: string,
  userId?: string | null
): string {
  if (userId) {
    return `${prefix}:user:${userId}`;
  }
  const forwardedFor = req.headers.get('x-forwarded-for') ?? '';
  const ip = forwardedFor.split(',')[0].trim() || 'unknown';
  return `${prefix}:ip:${ip}`;
}

export function rateLimitResponse(retryAfterSeconds = 60): Response {
  return new Response(
    JSON.stringify({
      error: 'rate_limit_exceeded',
      retry_after: retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSeconds),
      },
    }
  );
}

export function isCronRequest(req: Request): boolean {
  return req.headers.has('x-cron-secret');
}
