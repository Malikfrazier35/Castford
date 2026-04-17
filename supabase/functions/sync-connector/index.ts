import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o = req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin': AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function json(d: any, s=200) { return new Response(JSON.stringify(d), { status: s, headers: cors({headers:{get:()=>''}} as any) }); }

// === PROVIDER API CALLERS ===

async function callQuickBooks(method: string, endpoint: string, config: any): Promise<any> {
  const url = `https://quickbooks.api.intuit.com/v3/company/${config.realm_id}${endpoint}`
  const res = await fetch(url, {
    method, headers: { 'Authorization': `Bearer ${config.access_token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`QuickBooks ${res.status}: ${(await res.text()).substring(0, 200)}`)
  return res.json()
}

async function callXero(method: string, endpoint: string, config: any): Promise<any> {
  const url = `https://api.xero.com/api.xro/2.0${endpoint}`
  const res = await fetch(url, {
    method, headers: { 'Authorization': `Bearer ${config.access_token}`, 'xero-tenant-id': config.tenant_id, 'Accept': 'application/json' },
  })
  if (!res.ok) throw new Error(`Xero ${res.status}: ${(await res.text()).substring(0, 200)}`)
  return res.json()
}

async function callZohoBooks(method: string, endpoint: string, config: any): Promise<any> {
  const url = `https://www.zohoapis.com/books/v3${endpoint}`
  const res = await fetch(url, {
    method, headers: { 'Authorization': `Zoho-oauthtoken ${config.access_token}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Zoho ${res.status}: ${(await res.text()).substring(0, 200)}`)
  return res.json()
}

async function callDynamics365(method: string, endpoint: string, config: any): Promise<any> {
  const base = `https://api.businesscentral.dynamics.com/v2.0/${config.tenant_id}/${config.environment || 'Production'}/api/v2.0/companies(${config.company_id})`
  const res = await fetch(`${base}${endpoint}`, {
    method, headers: { 'Authorization': `Bearer ${config.access_token}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Dynamics ${res.status}: ${(await res.text()).substring(0, 200)}`)
  return res.json()
}

async function callProvider(provider: string, method: string, endpoint: string, config: any): Promise<any> {
  switch (provider) {
    case 'quickbooks': return callQuickBooks(method, endpoint, config)
    case 'xero': return callXero(method, endpoint, config)
    case 'zoho_books': return callZohoBooks(method, endpoint, config)
    case 'dynamics365': return callDynamics365(method, endpoint, config)
    case 'netsuite': throw new Error('Use netsuite-sync edge function for NetSuite (requires OAuth 1.0 signatures)')
    default: throw new Error(`Provider ${provider} API caller not implemented`)
  }
}

// === ACCOUNT MAPPERS ===

function mapAccounts(provider: string, rawAccounts: any[], typeMap: Record<string, string>): any[] {
  switch (provider) {
    case 'quickbooks':
      return (rawAccounts || []).map((a: any) => ({
        external_id: String(a.Id), name: a.Name || a.FullyQualifiedName,
        account_type: typeMap[a.AccountType] || typeMap[a.Classification] || 'expense',
        account_subtype: a.AccountSubType || a.AccountType, currency: a.CurrencyRef?.value || 'USD',
        active: a.Active !== false,
      }))
    case 'xero':
      return (rawAccounts || []).map((a: any) => ({
        external_id: a.AccountID, name: a.Name,
        account_type: typeMap[a.Type] || typeMap[a.Class] || 'expense',
        account_subtype: a.Type, currency: a.ReportingCode || 'USD',
        active: a.Status === 'ACTIVE',
      }))
    case 'zoho_books':
      return (rawAccounts || []).map((a: any) => ({
        external_id: String(a.account_id), name: a.account_name,
        account_type: typeMap[a.account_type] || 'expense',
        account_subtype: a.account_type, currency: a.currency_code || 'USD',
        active: a.is_active !== false,
      }))
    case 'dynamics365':
      return (rawAccounts || []).map((a: any) => ({
        external_id: a.id, name: a.displayName || a.number,
        account_type: typeMap[a.accountType] || typeMap[a.category] || 'expense',
        account_subtype: a.accountType || a.category, currency: 'USD',
        active: !a.blocked,
      }))
    default: return []
  }
}

function extractAccounts(provider: string, data: any): any[] {
  switch (provider) {
    case 'quickbooks': return data?.QueryResponse?.Account || []
    case 'xero': return data?.Accounts || []
    case 'zoho_books': return data?.chartofaccounts || []
    case 'dynamics365': return data?.value || []
    default: return []
  }
}

function extractTransactions(provider: string, data: any): any[] {
  switch (provider) {
    case 'quickbooks': return data?.QueryResponse?.JournalEntry || []
    case 'xero': return data?.Journals || []
    case 'zoho_books': return data?.journals || []
    case 'dynamics365': return data?.value || []
    default: return []
  }
}

function mapTransactionLines(provider: string, txn: any, acctMap: Record<string, string>): any[] {
  const lines: any[] = []
  switch (provider) {
    case 'quickbooks':
      for (const line of (txn.Line || [])) {
        if (!line.JournalEntryLineDetail) continue
        const extId = String(line.JournalEntryLineDetail.AccountRef?.value || '')
        const accountId = acctMap[extId]; if (!accountId) continue
        const amt = line.JournalEntryLineDetail.PostingType === 'Debit' ? Number(line.Amount) : -Number(line.Amount)
        lines.push({ account_id: accountId, external_id: `${txn.Id}-${line.Id}`, txn_date: txn.TxnDate, amount: amt, description: line.Description || txn.DocNumber || '', period: (txn.TxnDate||'').slice(0,7) })
      }
      break
    case 'xero':
      for (const jl of (txn.JournalLines || [])) {
        const extId = jl.AccountID; const accountId = acctMap[extId]; if (!accountId) continue
        lines.push({ account_id: accountId, external_id: `${txn.JournalID}-${jl.JournalLineID}`, txn_date: txn.JournalDate, amount: Number(jl.NetAmount || 0), description: jl.Description || '', period: (txn.JournalDate||'').slice(0,7) })
      }
      break
    case 'zoho_books':
      for (const dl of (txn.debit_accounts || []).concat(txn.credit_accounts || [])) {
        const extId = String(dl.account_id); const accountId = acctMap[extId]; if (!accountId) continue
        const isDebit = (txn.debit_accounts || []).includes(dl)
        lines.push({ account_id: accountId, external_id: `${txn.journal_id}-${dl.account_id}`, txn_date: txn.journal_date, amount: isDebit ? Number(dl.amount) : -Number(dl.amount), description: txn.notes || '', period: (txn.journal_date||'').slice(0,7) })
      }
      break
    case 'dynamics365':
      const extId = txn.accountId; const accountId = acctMap[extId]; if (accountId) {
        lines.push({ account_id: accountId, external_id: String(txn.id), txn_date: txn.postingDate, amount: Number(txn.amount || txn.debitAmount || 0) - Number(txn.creditAmount || 0), description: txn.description || '', period: (txn.postingDate||'').slice(0,7) })
      }
      break
  }
  return lines
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) })
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405)

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
  const { data: { user }, error: authErr } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authErr || !user) return json({ error: 'Invalid token' }, 401)

  const { data: profile } = await sb.from('users').select('org_id, role').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return json({ error: 'No organization' }, 404)
  if (!['owner', 'admin'].includes(profile.role)) return json({ error: 'Admin required' }, 403)
  const orgId = profile.org_id

  try {
    const body = await req.json()
    const action = body.action || 'list_connectors'
    const provider = body.provider

    // === LIST AVAILABLE CONNECTORS ===
    if (action === 'list_connectors') {
      const { data: connectors } = await sb.from('connector_registry').select('provider, display_name, category, auth_type, credential_fields, status, logo_url').order('display_name')
      const { data: connected } = await sb.from('integrations').select('provider, status, last_sync_at, records_synced').eq('org_id', orgId)
      const connMap: Record<string, any> = {}; (connected || []).forEach((c: any) => { connMap[c.provider] = c })
      return json({
        connectors: (connectors || []).map((c: any) => ({ ...c, connected: !!connMap[c.provider], connection_status: connMap[c.provider]?.status, last_sync: connMap[c.provider]?.last_sync_at, records: connMap[c.provider]?.records_synced }))
      })
    }

    if (!provider) return json({ error: 'provider required' }, 400)

    // Get connector definition
    const { data: connector } = await sb.from('connector_registry').select('*').eq('provider', provider).maybeSingle()
    if (!connector) return json({ error: `Unknown provider: ${provider}` }, 404)

    // === SAVE CREDENTIALS ===
    if (action === 'save') {
      const config: Record<string, any> = {}
      const fields = connector.credential_fields as any[]
      for (const f of fields) {
        if (f.required && !body[f.key]) return json({ error: `Missing required field: ${f.key} (${f.label})` }, 400)
        if (body[f.key]) config[f.key] = body[f.key]
      }

      const { data: existing } = await sb.from('integrations').select('id').eq('org_id', orgId).eq('provider', provider).maybeSingle()
      if (existing) {
        await sb.from('integrations').update({ config, status: 'connected', updated_at: new Date().toISOString(), provider_version: connector.status }).eq('id', existing.id)
      } else {
        await sb.from('integrations').insert({ org_id: orgId, user_id: user.id, provider, config, status: 'connected', provider_version: connector.status })
      }

      await sb.from('audit_log').insert({ user_id: user.id, org_id: orgId, action: 'integration.saved', resource_type: provider, metadata: { auth_type: connector.auth_type } })
      return json({ status: 'saved', provider, auth_type: connector.auth_type })
    }

    // === TEST CONNECTION ===
    if (action === 'test') {
      const { data: integration } = await sb.from('integrations').select('config').eq('org_id', orgId).eq('provider', provider).maybeSingle()
      if (!integration?.config) return json({ error: `No ${connector.display_name} credentials saved` }, 404)

      try {
        const endpoints = connector.endpoints as any
        const acctEndpoint = endpoints.accounts || '/accounts'
        const data = await callProvider(provider, 'GET', acctEndpoint, integration.config)
        const items = extractAccounts(provider, data)
        return json({ status: 'connected', provider, display_name: connector.display_name, sample_accounts: items.length, message: `Successfully connected to ${connector.display_name}` })
      } catch (err: any) {
        await sb.from('integrations').update({ status: 'error', last_error: err.message }).eq('org_id', orgId).eq('provider', provider)
        return json({ status: 'error', message: err.message })
      }
    }

    // === SYNC ACCOUNTS ===
    if (action === 'sync_accounts') {
      const { data: integration } = await sb.from('integrations').select('id, config').eq('org_id', orgId).eq('provider', provider).maybeSingle()
      if (!integration?.config) return json({ error: `No ${provider} credentials` }, 404)

      const endpoints = connector.endpoints as any
      const typeMap = connector.account_type_map as Record<string, string>
      const data = await callProvider(provider, 'GET', endpoints.accounts, integration.config)
      const rawAccounts = extractAccounts(provider, data)
      const mapped = mapAccounts(provider, rawAccounts, typeMap)

      let synced = 0
      for (const acct of mapped) {
        await sb.from('gl_accounts').upsert({
          org_id: orgId, provider, external_id: acct.external_id, name: acct.name,
          account_type: acct.account_type, account_subtype: acct.account_subtype,
          currency: acct.currency, active: acct.active,
          metadata: { source: provider }, synced_at: new Date().toISOString(),
        }, { onConflict: 'org_id,provider,external_id', ignoreDuplicates: false })
        synced++
      }

      await sb.from('sync_log').insert({ org_id: orgId, integration_id: integration.id, provider, status: 'success', records_synced: synced, completed_at: new Date().toISOString(), metadata: { action: 'sync_accounts', raw_count: rawAccounts.length } })
      await sb.from('integrations').update({ status: 'connected', last_sync_at: new Date().toISOString(), records_synced: synced, tables_synced: ['gl_accounts'] }).eq('id', integration.id)

      return json({ status: 'synced', provider, accounts_synced: synced, raw_from_provider: rawAccounts.length })
    }

    // === SYNC TRANSACTIONS ===
    if (action === 'sync_transactions') {
      const { data: integration } = await sb.from('integrations').select('id, config').eq('org_id', orgId).eq('provider', provider).maybeSingle()
      if (!integration?.config) return json({ error: `No ${provider} credentials` }, 404)

      const endpoints = connector.endpoints as any
      const data = await callProvider(provider, 'GET', endpoints.transactions, integration.config)
      const rawTxns = extractTransactions(provider, data)

      // Build account lookup
      const { data: accounts } = await sb.from('gl_accounts').select('id, external_id').eq('org_id', orgId).eq('provider', provider)
      const acctMap: Record<string, string> = {}; (accounts || []).forEach((a: any) => { if (a.external_id) acctMap[a.external_id] = a.id })

      let synced = 0
      for (const txn of rawTxns) {
        const lines = mapTransactionLines(provider, txn, acctMap)
        for (const line of lines) {
          await sb.from('gl_transactions').upsert({
            org_id: orgId, provider, ...line, currency: 'USD',
            metadata: { source: provider }, synced_at: new Date().toISOString(),
          }, { onConflict: 'org_id,provider,external_id', ignoreDuplicates: false })
          synced++
        }
      }

      await sb.from('sync_log').insert({ org_id: orgId, integration_id: integration.id, provider, status: 'success', records_synced: synced, completed_at: new Date().toISOString(), metadata: { action: 'sync_transactions', journal_entries: rawTxns.length } })

      const prev = (await sb.from('integrations').select('tables_synced').eq('id', integration.id).single()).data?.tables_synced || []
      await sb.from('integrations').update({ status: 'connected', last_sync_at: new Date().toISOString(), records_synced: synced, tables_synced: [...new Set([...prev, 'gl_transactions'])] }).eq('id', integration.id)

      return json({ status: 'synced', provider, transactions_synced: synced, raw_entries: rawTxns.length })
    }

    // === STATUS ===
    if (action === 'status') {
      const { data: integration } = await sb.from('integrations').select('id, provider, status, last_sync_at, records_synced, tables_synced, last_error, sync_schedule').eq('org_id', orgId).eq('provider', provider).maybeSingle()
      if (!integration) return json({ connected: false, provider, display_name: connector.display_name })
      const { data: logs } = await sb.from('sync_log').select('status, records_synced, completed_at, metadata').eq('integration_id', integration.id).order('completed_at', { ascending: false }).limit(5)
      return json({ connected: integration.status === 'connected', ...integration, display_name: connector.display_name, recent_syncs: logs || [] })
    }

    // === DISCONNECT ===
    if (action === 'disconnect') {
      await sb.from('integrations').update({ status: 'disconnected', config: {} }).eq('org_id', orgId).eq('provider', provider)
      await sb.from('audit_log').insert({ user_id: user.id, org_id: orgId, action: 'integration.disconnected', resource_type: provider })
      return json({ status: 'disconnected', provider })
    }

    return json({ error: `Unknown action: ${action}. Valid: list_connectors, save, test, sync_accounts, sync_transactions, status, disconnect` }, 400)

  } catch (err: any) {
    console.error('sync-connector error:', err)
    return json({ error: err?.message || 'Internal error' }, 500)
  }
})
