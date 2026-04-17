import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID') || ''
const PLAID_SECRET = Deno.env.get('PLAID_SECRET') || ''
const PLAID_ENV = Deno.env.get('PLAID_ENV') || 'sandbox'
const PLAID_BASE = `https://${PLAID_ENV}.plaid.com`
const WEBHOOK_URL = `${Deno.env.get('SUPABASE_URL')}/functions/v1/plaid-webhook`

const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function json(d: any, s=200) { return new Response(JSON.stringify(d), { status: s, headers: cors({headers:{get:()=>''}} as any) }); }

async function plaidRequest(endpoint: string, body: any): Promise<any> {
  const res = await fetch(`${PLAID_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, ...body }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Plaid ${res.status}: ${err.substring(0, 300)}`)
  }
  return res.json()
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  if (!PLAID_CLIENT_ID || !PLAID_SECRET) return json({ error: 'Plaid not configured. Set PLAID_CLIENT_ID and PLAID_SECRET in Supabase secrets.' }, 503)

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) return json({ error: 'Invalid token' }, 401)

  const { data: profile } = await sb.from('users').select('org_id, role').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return json({ error: 'No organization' }, 404)
  const orgId = profile.org_id

  try {
    const body = await req.json()
    const action = body.action || 'create_link_token'

    // === CREATE LINK TOKEN ===
    // v2 FIX: Now passes webhook URL so Plaid sends real-time transaction events
    if (action === 'create_link_token') {
      const data = await plaidRequest('/link/token/create', {
        user: { client_user_id: user.id },
        client_name: 'Castford',
        products: ['auth', 'transactions'],
        country_codes: ['US'],
        language: 'en',
        webhook: WEBHOOK_URL,
        redirect_uri: body.redirect_uri || null,
      })
      return json({ link_token: data.link_token, expiration: data.expiration })
    }

    // === EXCHANGE PUBLIC TOKEN ===
    if (action === 'exchange_token') {
      const publicToken = body.public_token
      if (!publicToken) return json({ error: 'public_token required' }, 400)

      const data = await plaidRequest('/item/public_token/exchange', { public_token: publicToken })
      const accessToken = data.access_token
      const itemId = data.item_id

      const { data: existing } = await sb.from('integrations').select('id').eq('org_id', orgId).eq('provider', 'plaid').maybeSingle()
      const config = { access_token: accessToken, item_id: itemId, environment: PLAID_ENV }

      if (existing) {
        await sb.from('integrations').update({ config, status: 'connected', updated_at: new Date().toISOString() }).eq('id', existing.id)
      } else {
        await sb.from('integrations').insert({ org_id: orgId, user_id: user.id, provider: 'plaid', config, status: 'connected' })
      }

      await sb.from('audit_log').insert({ user_id: user.id, org_id: orgId, action: 'integration.plaid_connected', resource_type: 'plaid', metadata: { item_id: itemId } })
      return json({ status: 'connected', item_id: itemId })
    }

    // === GET ACCOUNTS ===
    if (action === 'get_accounts') {
      const { data: integration } = await sb.from('integrations').select('config').eq('org_id', orgId).eq('provider', 'plaid').maybeSingle()
      if (!integration?.config) return json({ error: 'No Plaid connection' }, 404)

      const data = await plaidRequest('/accounts/get', { access_token: (integration.config as any).access_token })
      let synced = 0
      for (const acct of (data.accounts || [])) {
        await sb.from('gl_accounts').upsert({
          org_id: orgId, provider: 'plaid', external_id: acct.account_id,
          name: `${acct.name} (${acct.official_name || acct.subtype})`,
          account_type: 'bank', account_subtype: acct.subtype || acct.type,
          currency: acct.balances?.iso_currency_code || 'USD', active: true,
          metadata: { mask: acct.mask, institution: data.item?.institution_id, balance: acct.balances?.current },
          synced_at: new Date().toISOString(),
        }, { onConflict: 'org_id,provider,external_id', ignoreDuplicates: false })
        synced++
      }
      return json({ status: 'synced', accounts: synced, balances: (data.accounts||[]).map((a:any) => ({ name: a.name, balance: a.balances?.current, available: a.balances?.available, currency: a.balances?.iso_currency_code })) })
    }

    // === GET BALANCES ===
    if (action === 'get_balances') {
      const { data: integration } = await sb.from('integrations').select('config').eq('org_id', orgId).eq('provider', 'plaid').maybeSingle()
      if (!integration?.config) return json({ error: 'No Plaid connection' }, 404)
      const data = await plaidRequest('/accounts/balance/get', { access_token: (integration.config as any).access_token })
      return json({ balances: (data.accounts||[]).map((a:any) => ({ account_id: a.account_id, name: a.name, current: a.balances?.current, available: a.balances?.available, currency: a.balances?.iso_currency_code })) })
    }

    // === SYNC TRANSACTIONS ===
    if (action === 'sync_transactions') {
      const { data: integration } = await sb.from('integrations').select('id, config').eq('org_id', orgId).eq('provider', 'plaid').maybeSingle()
      if (!integration?.config) return json({ error: 'No Plaid connection' }, 404)
      const config = integration.config as any

      const data = await plaidRequest('/transactions/sync', { access_token: config.access_token, cursor: config.transaction_cursor || undefined, count: 500 })

      const { data: accounts } = await sb.from('gl_accounts').select('id, external_id').eq('org_id', orgId).eq('provider', 'plaid')
      const acctMap: Record<string, string> = {}; (accounts || []).forEach((a: any) => { if (a.external_id) acctMap[a.external_id] = a.id })

      let synced = 0
      for (const txn of (data.added || [])) {
        const accountId = acctMap[txn.account_id]; if (!accountId) continue
        await sb.from('gl_transactions').upsert({
          org_id: orgId, account_id: accountId, provider: 'plaid', external_id: txn.transaction_id,
          txn_date: txn.date, amount: -txn.amount, description: txn.name || txn.merchant_name || '',
          category: (txn.personal_finance_category?.primary || txn.category?.[0] || ''),
          entity: txn.merchant_name || '', period: (txn.date || '').slice(0, 7),
          currency: txn.iso_currency_code || 'USD',
          metadata: { plaid_category: txn.personal_finance_category, pending: txn.pending },
          synced_at: new Date().toISOString(),
        }, { onConflict: 'org_id,provider,external_id', ignoreDuplicates: false })
        synced++
      }

      if (data.next_cursor) {
        await sb.from('integrations').update({ config: { ...config, transaction_cursor: data.next_cursor }, last_sync_at: new Date().toISOString(), records_synced: synced, tables_synced: ['gl_accounts', 'gl_transactions'] }).eq('id', integration.id)
      }

      await sb.from('sync_log').insert({ org_id: orgId, integration_id: integration.id, provider: 'plaid', status: 'success', records_synced: synced, completed_at: new Date().toISOString(), metadata: { added: (data.added||[]).length, modified: (data.modified||[]).length, removed: (data.removed||[]).length, has_more: data.has_more } })
      return json({ status: 'synced', transactions_added: synced, has_more: data.has_more })
    }

    // === UPDATE WEBHOOK ===
    // Use this to retroactively add webhook URL to existing items
    if (action === 'update_webhook') {
      const { data: integration } = await sb.from('integrations').select('config').eq('org_id', orgId).eq('provider', 'plaid').maybeSingle()
      if (!integration?.config) return json({ error: 'No Plaid connection' }, 404)
      const data = await plaidRequest('/item/webhook/update', { access_token: (integration.config as any).access_token, webhook: WEBHOOK_URL })
      return json({ status: 'webhook_updated', webhook: WEBHOOK_URL })
    }

    // === STATUS ===
    if (action === 'status') {
      const { data: integration } = await sb.from('integrations').select('status, last_sync_at, records_synced, tables_synced').eq('org_id', orgId).eq('provider', 'plaid').maybeSingle()
      return json({ connected: integration?.status === 'connected', ...integration })
    }

    // === DISCONNECT ===
    if (action === 'disconnect') {
      const { data: integration } = await sb.from('integrations').select('config').eq('org_id', orgId).eq('provider', 'plaid').maybeSingle()
      if (integration?.config) { try { await plaidRequest('/item/remove', { access_token: (integration.config as any).access_token }) } catch {} }
      await sb.from('integrations').update({ status: 'disconnected', config: {} }).eq('org_id', orgId).eq('provider', 'plaid')
      await sb.from('audit_log').insert({ user_id: user.id, org_id: orgId, action: 'integration.plaid_disconnected', resource_type: 'plaid' })
      return json({ status: 'disconnected' })
    }

    return json({ error: `Unknown action: ${action}. Valid: create_link_token, exchange_token, get_accounts, get_balances, sync_transactions, update_webhook, status, disconnect` }, 400)
  } catch (err: any) {
    console.error('plaid-sync error:', err)
    return json({ error: err?.message || 'Internal error' }, 500)
  }
})
