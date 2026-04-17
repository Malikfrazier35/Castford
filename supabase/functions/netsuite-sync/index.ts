import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { encode as base64Encode } from 'https://deno.land/std@0.208.0/encoding/base64.ts'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const ALLOWED_ORIGINS = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o = req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(o)?o:ALLOWED_ORIGINS[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function json(d: any, s=200, h: any={}) { return new Response(JSON.stringify(d), { status: s, headers: { ...cors({headers:{get:()=>''}} as any), ...h } }); }

// OAuth 1.0 signature for NetSuite TBA
function generateNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) result += chars.charAt(Math.floor(Math.random() * chars.length))
  return result
}

async function hmacSha256(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data))
  return base64Encode(new Uint8Array(sig))
}

async function buildOAuthHeader(method: string, url: string, consumerKey: string, consumerSecret: string, tokenId: string, tokenSecret: string, realm: string): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const nonce = generateNonce()
  
  const params: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_token: tokenId,
    oauth_nonce: nonce,
    oauth_timestamp: timestamp,
    oauth_signature_method: 'HMAC-SHA256',
    oauth_version: '1.0',
  }

  // Build base string
  const sortedParams = Object.keys(params).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')
  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url.split('?')[0])}&${encodeURIComponent(sortedParams)}`
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`
  
  const signature = await hmacSha256(signingKey, baseString)
  params.oauth_signature = signature

  const headerParams = Object.keys(params).sort().map(k => `${k}="${encodeURIComponent(params[k])}"`).join(', ')
  return `OAuth realm="${realm}", ${headerParams}`
}

async function nsRequest(method: string, url: string, config: any, body?: any): Promise<any> {
  const authHeader = await buildOAuthHeader(
    method, url,
    config.consumer_key, config.consumer_secret,
    config.token_id, config.token_secret,
    config.realm || config.account_id
  )
  
  const headers: Record<string, string> = {
    'Authorization': authHeader,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`NetSuite ${res.status}: ${errText.substring(0, 300)}`)
  }

  return res.json()
}

function nsBaseUrl(accountId: string): string {
  // NetSuite REST API base: account ID with underscores replaced by hyphens
  const sanitized = accountId.replace(/_/g, '-').toLowerCase()
  return `https://${sanitized}.suitetalk.api.netsuite.com/services/rest/record/v1`
}

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  // Auth
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) return json({ error: 'Invalid token' }, 401)

  const { data: profile } = await sb.from('users').select('org_id, role').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return json({ error: 'No organization' }, 404)
  if (!['owner', 'admin'].includes(profile.role)) return json({ error: 'Only owners/admins can manage integrations' }, 403)

  const orgId = profile.org_id

  try {
    const body = await req.json()
    const action = body.action || 'test'

    // === SAVE CREDENTIALS ===
    if (action === 'save') {
      const { account_id, consumer_key, consumer_secret, token_id, token_secret } = body
      if (!account_id || !consumer_key || !consumer_secret || !token_id || !token_secret) {
        return json({ error: 'All 5 credential fields required: account_id, consumer_key, consumer_secret, token_id, token_secret' }, 400)
      }

      // Upsert integration record
      const config = {
        account_id: account_id.toUpperCase(),
        consumer_key,
        consumer_secret,
        token_id,
        token_secret,
        realm: account_id.toUpperCase(),
        base_url: nsBaseUrl(account_id),
      }

      const { data: existing } = await sb.from('integrations').select('id').eq('org_id', orgId).eq('provider', 'netsuite').maybeSingle()

      if (existing) {
        await sb.from('integrations').update({ config, status: 'connected', updated_at: new Date().toISOString() }).eq('id', existing.id)
      } else {
        await sb.from('integrations').insert({ org_id: orgId, user_id: user.id, provider: 'netsuite', config, status: 'connected' })
      }

      await sb.from('audit_log').insert({ user_id: user.id, org_id: orgId, action: 'integration.saved', resource_type: 'netsuite', metadata: { account_id: config.account_id } })

      return json({ status: 'saved', account_id: config.account_id })
    }

    // === TEST CONNECTION ===
    if (action === 'test') {
      const { data: integration } = await sb.from('integrations').select('config').eq('org_id', orgId).eq('provider', 'netsuite').maybeSingle()
      if (!integration?.config) return json({ error: 'No NetSuite credentials saved. Use action=save first.' }, 404)

      const config = integration.config as any
      const url = `${nsBaseUrl(config.account_id)}/account?limit=1`

      try {
        const data = await nsRequest('GET', url, config)
        return json({ status: 'connected', message: 'NetSuite connection successful', account_id: config.account_id, sample: data })
      } catch (err: any) {
        await sb.from('integrations').update({ status: 'error', last_error: err.message, updated_at: new Date().toISOString() }).eq('org_id', orgId).eq('provider', 'netsuite')
        return json({ status: 'error', message: err.message })
      }
    }

    // === SYNC ACCOUNTS (Chart of Accounts → gl_accounts) ===
    if (action === 'sync_accounts') {
      const { data: integration } = await sb.from('integrations').select('id, config').eq('org_id', orgId).eq('provider', 'netsuite').maybeSingle()
      if (!integration?.config) return json({ error: 'No NetSuite credentials' }, 404)

      const config = integration.config as any
      const baseUrl = nsBaseUrl(config.account_id)
      
      // Fetch accounts from NetSuite
      let allAccounts: any[] = []
      let offset = 0
      const limit = 100
      let hasMore = true

      while (hasMore) {
        const url = `${baseUrl}/account?limit=${limit}&offset=${offset}`
        const data = await nsRequest('GET', url, config)
        const items = data.items || []
        allAccounts = allAccounts.concat(items)
        hasMore = items.length === limit
        offset += limit
        if (offset > 1000) break // Safety cap
      }

      // Map NetSuite account types to Castford types
      const typeMap: Record<string, string> = {
        'Income': 'revenue', 'OthIncome': 'other_income',
        'COGS': 'cost_of_revenue', 'Expense': 'expense', 'OthExpense': 'other_expense',
        'Bank': 'bank', 'AcctRec': 'asset', 'OthCurrAsset': 'asset', 'FixedAsset': 'asset',
        'AcctPay': 'liability', 'OthCurrLiab': 'liability', 'LongTermLiab': 'liability',
        'Equity': 'equity',
      }

      let synced = 0
      for (const acct of allAccounts) {
        const nsType = acct.acctType?.id || acct.accttype || ''
        const castfordType = typeMap[nsType] || 'expense'

        await sb.from('gl_accounts').upsert({
          org_id: orgId,
          provider: 'netsuite',
          external_id: String(acct.id),
          name: acct.acctName || acct.acctname || acct.id,
          account_type: castfordType,
          account_subtype: nsType,
          currency: acct.currency?.refName || 'USD',
          active: !acct.isInactive,
          metadata: { netsuite_number: acct.number, netsuite_type: nsType },
          synced_at: new Date().toISOString(),
        }, { onConflict: 'org_id,provider,external_id', ignoreDuplicates: false })
        synced++
      }

      // Log sync
      await sb.from('sync_log').insert({
        org_id: orgId, integration_id: integration.id, provider: 'netsuite',
        status: 'success', records_synced: synced,
        completed_at: new Date().toISOString(),
        metadata: { action: 'sync_accounts', total_from_netsuite: allAccounts.length },
      })

      await sb.from('integrations').update({
        status: 'connected', last_sync_at: new Date().toISOString(),
        records_synced: synced, tables_synced: ['gl_accounts'],
        updated_at: new Date().toISOString(),
      }).eq('id', integration.id)

      return json({ status: 'synced', accounts_synced: synced, total_from_netsuite: allAccounts.length })
    }

    // === SYNC TRANSACTIONS ===
    if (action === 'sync_transactions') {
      const { data: integration } = await sb.from('integrations').select('id, config').eq('org_id', orgId).eq('provider', 'netsuite').maybeSingle()
      if (!integration?.config) return json({ error: 'No NetSuite credentials' }, 404)

      const config = integration.config as any
      const baseUrl = nsBaseUrl(config.account_id)
      const period = body.period || new Date().toISOString().slice(0, 7) // Default current month

      // Fetch journal entries from NetSuite
      const url = `${baseUrl}/journalEntry?limit=100&q=tranDate AFTER ${period}-01`
      let transactions: any[] = []

      try {
        const data = await nsRequest('GET', url, config)
        transactions = data.items || []
      } catch (err: any) {
        return json({ status: 'error', message: `Failed to fetch transactions: ${err.message}` })
      }

      // Map account external_ids for lookup
      const { data: accounts } = await sb.from('gl_accounts').select('id, external_id').eq('org_id', orgId).eq('provider', 'netsuite')
      const acctMap: Record<string, string> = {}
      ;(accounts || []).forEach((a: any) => { if (a.external_id) acctMap[a.external_id] = a.id })

      let synced = 0
      for (const txn of transactions) {
        const lines = txn.line?.items || txn.lines?.items || []
        for (const line of lines) {
          const acctRef = String(line.account?.id || '')
          const accountId = acctMap[acctRef]
          if (!accountId) continue

          await sb.from('gl_transactions').upsert({
            org_id: orgId,
            account_id: accountId,
            provider: 'netsuite',
            external_id: `${txn.id}-${line.line || synced}`,
            txn_date: txn.tranDate || txn.trandate,
            amount: Number(line.debit || 0) - Number(line.credit || 0),
            description: txn.memo || line.memo || '',
            category: line.department?.refName || '',
            entity: line.entity?.refName || '',
            period: (txn.tranDate || txn.trandate || '').slice(0, 7),
            currency: txn.currency?.refName || 'USD',
            metadata: { netsuite_txn_id: txn.id, netsuite_type: txn.type },
            synced_at: new Date().toISOString(),
          }, { onConflict: 'org_id,provider,external_id', ignoreDuplicates: false })
          synced++
        }
      }

      await sb.from('sync_log').insert({
        org_id: orgId, integration_id: integration.id, provider: 'netsuite',
        status: 'success', records_synced: synced,
        completed_at: new Date().toISOString(),
        metadata: { action: 'sync_transactions', period, journal_entries: transactions.length },
      })

      const prevTables = (await sb.from('integrations').select('tables_synced').eq('id', integration.id).single()).data?.tables_synced || []
      await sb.from('integrations').update({
        status: 'connected', last_sync_at: new Date().toISOString(),
        records_synced: synced,
        tables_synced: [...new Set([...prevTables, 'gl_transactions'])],
        updated_at: new Date().toISOString(),
      }).eq('id', integration.id)

      return json({ status: 'synced', transactions_synced: synced, journal_entries_fetched: transactions.length, period })
    }

    // === STATUS ===
    if (action === 'status') {
      const { data: integration } = await sb.from('integrations')
        .select('id, provider, status, config, last_sync_at, records_synced, tables_synced, last_error, created_at')
        .eq('org_id', orgId).eq('provider', 'netsuite').maybeSingle()

      if (!integration) return json({ connected: false, provider: 'netsuite' })

      const { data: syncLogs } = await sb.from('sync_log')
        .select('status, records_synced, completed_at, metadata')
        .eq('integration_id', integration.id)
        .order('completed_at', { ascending: false })
        .limit(5)

      return json({
        connected: integration.status === 'connected',
        provider: 'netsuite',
        account_id: (integration.config as any)?.account_id,
        status: integration.status,
        last_sync_at: integration.last_sync_at,
        records_synced: integration.records_synced,
        tables_synced: integration.tables_synced,
        last_error: integration.last_error,
        recent_syncs: syncLogs || [],
      })
    }

    // === DISCONNECT ===
    if (action === 'disconnect') {
      await sb.from('integrations').update({
        status: 'disconnected', config: {},
        updated_at: new Date().toISOString(),
      }).eq('org_id', orgId).eq('provider', 'netsuite')

      await sb.from('audit_log').insert({ user_id: user.id, org_id: orgId, action: 'integration.disconnected', resource_type: 'netsuite' })

      return json({ status: 'disconnected' })
    }

    return json({ error: `Unknown action: ${action}. Valid: save, test, sync_accounts, sync_transactions, status, disconnect` }, 400)

  } catch (err: any) {
    console.error('netsuite-sync error:', err)
    return json({ error: err?.message || 'Internal error' }, 500)
  }
})
