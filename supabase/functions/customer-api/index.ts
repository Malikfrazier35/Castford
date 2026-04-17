import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

/*
  customer-api v1
  Public REST API for customers to pull their Castford data programmatically.
  Authenticated via API key (stored in organizations.api_key_hash).
  Available on Growth and Business plans only.
  
  Endpoints (via action param):
  GET /kpis — Revenue, COGS, GP, OpEx, Net Income, margins
  GET /accounts — Chart of accounts with balances
  GET /transactions — GL transactions with filters
  GET /forecast — Latest forecast projections
  GET /alerts — Active financial alerts
  GET /health — Organization health score
*/

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key', 'Content-Type': 'application/json' }

function fmt(v: number): string { const a=Math.abs(v); if(a>=1e6)return(v/1e6).toFixed(2); if(a>=1e3)return(v/1e3).toFixed(1); return v.toFixed(0); }

async function authenticateApiKey(apiKey: string): Promise<{ orgId: string, plan: string } | null> {
  if (!apiKey) return null
  // API keys stored as-is in organizations table for now (hash in production)
  const { data: org } = await sb.from('organizations').select('id, plan, api_key').not('api_key', 'is', null).limit(50)
  const match = (org || []).find((o: any) => o.api_key === apiKey)
  if (!match) return null
  // Check plan allows API access (Growth + Business only)
  if (!['growth', 'business', 'enterprise', 'scale'].includes(match.plan)) return null
  return { orgId: match.id, plan: match.plan }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  // Auth: X-Api-Key header or Bearer token
  const apiKey = req.headers.get('X-Api-Key') || ''
  const bearerToken = req.headers.get('Authorization')?.replace('Bearer ', '') || ''
  let orgId: string | null = null
  let authMethod = ''

  if (apiKey) {
    const auth = await authenticateApiKey(apiKey)
    if (!auth) return new Response(JSON.stringify({ error: 'Invalid API key or plan does not include API access', docs: 'https://castford.com/resources' }), { status: 401, headers: CORS })
    orgId = auth.orgId; authMethod = 'api_key'
  } else if (bearerToken) {
    const { data: { user } } = await sb.auth.getUser(bearerToken)
    if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: CORS })
    const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
    orgId = profile?.org_id || null; authMethod = 'jwt'
  }

  if (!orgId) return new Response(JSON.stringify({ error: 'Authentication required. Pass X-Api-Key header or Bearer token.', docs: 'https://castford.com/resources' }), { status: 401, headers: CORS })

  // Parse action from URL path or body
  const url = new URL(req.url)
  const pathAction = url.pathname.split('/').filter(Boolean).pop() || ''
  let body: any = {}
  if (req.method === 'POST') { try { body = await req.json() } catch {} }
  const action = body.action || url.searchParams.get('action') || pathAction || 'kpis'

  try {
    // === KPIs ===
    if (action === 'kpis') {
      const { data: txns } = await sb.from('gl_transactions').select('amount, period, gl_accounts(account_type)').eq('org_id', orgId)
      let revenue=0, cogs=0, opex=0
      ;(txns||[]).forEach((t: any) => { const at=t.gl_accounts?.account_type; const amt=Math.abs(Number(t.amount)||0); if(at==='revenue'||at==='other_income')revenue+=amt; else if(at==='cost_of_revenue')cogs+=amt; else if(at==='expense'||at==='other_expense')opex+=amt })
      const gp=revenue-cogs; const ni=revenue-cogs-opex
      return new Response(JSON.stringify({
        data: { revenue, cogs, gross_profit: gp, gross_margin: revenue>0?Math.round(gp/revenue*1000)/10:0, opex, net_income: ni, net_margin: revenue>0?Math.round(ni/revenue*1000)/10:0, transactions: (txns||[]).length },
        currency: 'USD', period: 'YTD', generated_at: new Date().toISOString(),
      }), { headers: CORS })
    }

    // === ACCOUNTS ===
    if (action === 'accounts') {
      const { data: accounts } = await sb.from('gl_accounts').select('id, name, account_type, account_subtype, code, active, provider, currency, synced_at').eq('org_id', orgId).eq('active', true).order('account_type').order('name')
      return new Response(JSON.stringify({ data: accounts || [], count: (accounts||[]).length }), { headers: CORS })
    }

    // === TRANSACTIONS ===
    if (action === 'transactions') {
      const limit = Math.min(Number(body.limit || url.searchParams.get('limit') || 100), 500)
      const period = body.period || url.searchParams.get('period') || null
      const accountType = body.account_type || url.searchParams.get('account_type') || null
      let query = sb.from('gl_transactions').select('id, amount, period, txn_date, description, category, entity, currency, provider, gl_accounts(name, account_type, code)').eq('org_id', orgId).order('txn_date', { ascending: false }).limit(limit)
      if (period) query = query.eq('period', period)
      if (accountType) query = query.eq('gl_accounts.account_type', accountType)
      const { data: txns, count } = await query
      return new Response(JSON.stringify({ data: txns || [], count: (txns||[]).length, limit }), { headers: CORS })
    }

    // === FORECAST ===
    if (action === 'forecast') {
      // Pull latest forecast from audit_log
      const { data: lastForecast } = await sb.from('audit_log').select('metadata').eq('org_id', orgId).eq('action', 'forecast.generated').order('created_at', { ascending: false }).limit(1)
      if (lastForecast?.length) {
        return new Response(JSON.stringify({ data: lastForecast[0].metadata, source: 'last_generated' }), { headers: CORS })
      }
      return new Response(JSON.stringify({ data: null, message: 'No forecast generated yet. Run generate-forecast first.' }), { headers: CORS })
    }

    // === ALERTS ===
    if (action === 'alerts') {
      const status = body.status || url.searchParams.get('status') || 'active'
      const { data: alerts } = await sb.from('financial_alerts').select('id, alert_type, severity, title, description, metric_name, current_value, expected_value, deviation_pct, period, status, created_at').eq('org_id', orgId).eq('status', status).order('created_at', { ascending: false }).limit(50)
      return new Response(JSON.stringify({ data: alerts || [], count: (alerts||[]).length }), { headers: CORS })
    }

    // === HEALTH ===
    if (action === 'health') {
      const { data: health } = await sb.from('customer_health').select('health_score, login_frequency_score, feature_adoption_score, data_freshness_score, engagement_score, churn_risk, expansion_ready, features_used, logins_last_30d, integrations_connected, computed_at').eq('org_id', orgId).maybeSingle()
      return new Response(JSON.stringify({ data: health || { message: 'Health score not computed yet. Runs weekly on Monday.' } }), { headers: CORS })
    }

    // === REPORTS ===
    if (action === 'reports') {
      const { data: reports } = await sb.from('generated_reports').select('id, report_type, title, period, summary_text, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(10)
      return new Response(JSON.stringify({ data: reports || [], count: (reports||[]).length }), { headers: CORS })
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${action}`, available: ['kpis', 'accounts', 'transactions', 'forecast', 'alerts', 'health', 'reports'], docs: 'https://castford.com/resources' }), { status: 400, headers: CORS })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500, headers: CORS })
  }
})
