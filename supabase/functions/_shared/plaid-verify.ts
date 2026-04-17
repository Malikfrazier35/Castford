// Plaid webhook JWT verifier. Validates ES256-signed Plaid-Verification header
// against JWKS from Plaid's webhook_verification_key/get endpoint.
// Used by plaid-webhook to enforce signature on incoming webhooks.

const PLAID_ENV = Deno.env.get('PLAID_ENV') || 'sandbox';
const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID') || '';
const PLAID_SECRET = Deno.env.get('PLAID_SECRET') || '';

const BASE = `https://${PLAID_ENV}.plaid.com`;
const keyCache = new Map<string, { key: CryptoKey; fetched: number }>();
const TTL_MS = 60 * 60 * 1000;

async function getKey(kid: string): Promise<CryptoKey | null> {
  const cached = keyCache.get(kid);
  if (cached && Date.now() - cached.fetched < TTL_MS) return cached.key;
  const res = await fetch(`${BASE}/webhook_verification_key/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, key_id: kid }),
  });
  if (!res.ok) return null;
  const { key } = await res.json();
  if (!key || key.expired_at) return null;
  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    { kty: key.kty, crv: key.crv, x: key.x, y: key.y, alg: 'ES256', use: 'sig' },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify']
  );
  keyCache.set(kid, { key: cryptoKey, fetched: Date.now() });
  return cryptoKey;
}

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 2 ? '==' : s.length % 4 === 3 ? '=' : '';
  return Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad), (c) => c.charCodeAt(0));
}

async function sha256Hex(s: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPlaidWebhook(req: Request, bodyText: string): Promise<boolean> {
  const token = req.headers.get('Plaid-Verification');
  if (!token) return false;
  const [hB64, pB64, sB64] = token.split('.');
  if (!hB64 || !pB64 || !sB64) return false;

  const header = JSON.parse(new TextDecoder().decode(b64urlDecode(hB64)));
  if (header.alg !== 'ES256' || !header.kid) return false;

  const key = await getKey(header.kid);
  if (!key) return false;

  const sig = b64urlDecode(sB64);
  const data = new TextEncoder().encode(`${hB64}.${pB64}`);
  const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, sig, data);
  if (!ok) return false;

  const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(pB64)));
  if (payload.request_body_sha256 !== (await sha256Hex(bodyText))) return false;
  if (payload.iat && Date.now() / 1000 - payload.iat > 300) return false;
  return true;
}
