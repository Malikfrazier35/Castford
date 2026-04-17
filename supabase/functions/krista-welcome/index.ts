import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve((_req: Request) => {
  const html = "<!DOCTYPE html><html><head><meta charset=utf-8><title>Test</title></head><body><h1>Edge Function Working</h1><p>If you see this, deployment is successful.</p></body></html>";
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});