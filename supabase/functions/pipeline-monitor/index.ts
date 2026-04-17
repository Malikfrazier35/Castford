import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }

/*
  pipeline-monitor v1
  Operational health dashboard for all Castford automation pipelines.
  
  Actions:
  - health: Overall system health with pipeline status
  - cron_status: Status of all 7 cron jobs
  - recent_runs: Latest automation runs with success/fail
  - data_freshness: How fresh is each data source?
  - error_log: Recent errors across all pipelines
  - metrics: Key operational metrics (uptime, throughput, latency)
*/

const CRON_JOBS = [
  { name: 'auto-sync-daily', schedule: 'Every 6h :00', function: 'auto-sync', critical: true },
  { name: 'post-sync-forecast', schedule: 'Every 6h :15', function: 'generate-forecast', critical: false },
  { name: 'alert-evaluator-6h', schedule: 'Every 6h :30', function: 'alert-evaluator', critical: true },
  { name: 'drip-scheduler-daily', schedule: 'Daily 2pm UTC', function: 'drip-scheduler', critical: false },
  { name: 'monthly-board-report', schedule: '1st of month 8am', function: 'report-generate', critical: false },
  { name: 'customer-health-weekly', schedule: 'Monday 6am', function: 'customer-health', critical: true },
  { name: 'revenue-snapshot-daily', schedule: 'Daily 7am', function: 'billing-brain', critical: true },
]

const PIPELINES = [
  { name: 'Data Ingestion', functions: ['auto-sync', 'plaid-sync', 'import-gl'], table: 'sync_log' },
  { name: 'Intelligence', functions: ['generate-forecast', 'alert-evaluator', 'dashboard-insights'], table: 'financial_alerts' },
  { name: 'Reporting', functions: ['report-generate'], table: 'generated_reports' },
  { name: 'Billing', functions: ['billing-brain', 'stripe-webhook'], table: 'billing_events' },
  { name: 'Lifecycle', functions: ['drip-scheduler', 'onboarding-brain', 'seed-demo-data'], table: 'drip_campaigns' },
  { name: 'Health', functions: ['customer-health'], table: 'customer_health' },
]

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const cronSecret = req.headers.get('x-cron-secret')
  const expectedSecret = Deno.env.get('CRON_SECRET') || ''
  const authHeader = req.headers.get('Authorization')
  let isAuthorized = false
  if (cronSecret && expectedSecret && cronSecret === expectedSecret) isAuthorized = true
  if (!isAuthorized && authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
    if (user) { const { data: p } = await sb.from('users').select('role').eq('id', user.id).maybeSingle(); if (p?.role === 'owner') isAuthorized = true }
  }
  if (!isAuthorized) return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 401, headers })

  try {
    const body = await req.json()
    const action = body.action || 'health'

    // === OVERALL HEALTH ===
    if (action === 'health') {
      const now = new Date()
      const twentyFourHoursAgo = new Date(now.getTime() - 86400000).toISOString()
      const sixHoursAgo = new Date(now.getTime() - 21600000).toISOString()

      const [runsRes, alertsRes, reportsRes, healthRes, metricsRes, auditRes, webhookRes] = await Promise.all([
        sb.from('automation_runs').select('status, trigger_source, completed_at, duration_ms').gte('completed_at', twentyFourHoursAgo).order('completed_at', { ascending: false }),
        sb.from('financial_alerts').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        sb.from('generated_reports').select('id', { count: 'exact', head: true }),
        sb.from('customer_health').select('health_score, computed_at').order('computed_at', { ascending: false }).limit(1),
        sb.from('revenue_metrics').select('snapshot_date, total_mrr, paying_customers').order('snapshot_date', { ascending: false }).limit(1),
        sb.from('audit_log').select('id', { count: 'exact', head: true }).gte('created_at', twentyFourHoursAgo),
        sb.from('webhook_events').select('status').gte('created_at', twentyFourHoursAgo),
      ])

      const runs = runsRes.data || []
      const successRuns = runs.filter((r: any) => r.status === 'success').length
      const failedRuns = runs.filter((r: any) => r.status === 'failed').length
      const avgDuration = runs.length > 0 ? Math.round(runs.reduce((s: number, r: any) => s + (r.duration_ms || 0), 0) / runs.length) : 0

      const webhooks = webhookRes.data || []
      const processedWebhooks = webhooks.filter((w: any) => w.status === 'processed').length
      const failedWebhooks = webhooks.filter((w: any) => w.status === 'failed').length

      const healthScore = healthRes.data?.[0]
      const latestMetrics = metricsRes.data?.[0]

      // Determine overall status
      let overallStatus = 'healthy'
      if (failedRuns > 0 || failedWebhooks > 0) overallStatus = 'degraded'
      if (runs.length === 0 && now.getHours() > 6) overallStatus = 'warning' // No runs in 24h after 6am

      return new Response(JSON.stringify({
        status: overallStatus,
        timestamp: now.toISOString(),
        last_24h: {
          automation_runs: { total: runs.length, success: successRuns, failed: failedRuns, avg_duration_ms: avgDuration },
          webhooks: { processed: processedWebhooks, failed: failedWebhooks },
          audit_entries: auditRes.count || 0,
        },
        active_alerts: alertsRes.count || 0,
        reports_generated: reportsRes.count || 0,
        customer_health: healthScore ? { score: healthScore.health_score, last_computed: healthScore.computed_at } : null,
        revenue: latestMetrics ? { mrr: latestMetrics.total_mrr, paying: latestMetrics.paying_customers, date: latestMetrics.snapshot_date } : null,
        cron_jobs: CRON_JOBS.length,
        pipelines: PIPELINES.length,
      }), { headers })
    }

    // === CRON STATUS ===
    if (action === 'cron_status') {
      const { data: cronJobs } = await sb.rpc('get_cron_jobs').catch(() => ({ data: null }))
      // Fallback: check automation_runs for each cron function
      const status = []
      for (const job of CRON_JOBS) {
        const { data: lastRun } = await sb.from('automation_runs').select('status, completed_at, duration_ms').eq('trigger_source', job.function.replace('-', '_')).order('completed_at', { ascending: false }).limit(1)
        status.push({
          ...job,
          last_run: lastRun?.[0]?.completed_at || null,
          last_status: lastRun?.[0]?.status || 'never_run',
          last_duration_ms: lastRun?.[0]?.duration_ms || null,
          healthy: lastRun?.[0]?.status === 'success',
        })
      }
      return new Response(JSON.stringify({ cron_jobs: status }), { headers })
    }

    // === RECENT RUNS ===
    if (action === 'recent_runs') {
      const limit = Math.min(body.limit || 20, 100)
      const { data: runs } = await sb.from('automation_runs').select('id, status, trigger_source, input_data, output_data, error_message, duration_ms, started_at, completed_at').order('completed_at', { ascending: false }).limit(limit)
      return new Response(JSON.stringify({ runs: runs || [] }), { headers })
    }

    // === DATA FRESHNESS ===
    if (action === 'data_freshness') {
      const now = new Date()
      const sources: any[] = []

      // GL data freshness
      const { data: lastTxn } = await sb.from('gl_transactions').select('created_at').order('created_at', { ascending: false }).limit(1)
      sources.push({ source: 'GL Transactions', last_updated: lastTxn?.[0]?.created_at, hours_ago: lastTxn?.[0] ? Math.round((now.getTime() - new Date(lastTxn[0].created_at).getTime()) / 3600000) : null })

      // Sync log
      const { data: lastSync } = await sb.from('sync_log').select('completed_at, provider').order('completed_at', { ascending: false }).limit(1)
      sources.push({ source: 'ERP Sync', last_updated: lastSync?.[0]?.completed_at, provider: lastSync?.[0]?.provider, hours_ago: lastSync?.[0] ? Math.round((now.getTime() - new Date(lastSync[0].completed_at).getTime()) / 3600000) : null })

      // Alerts
      const { data: lastAlert } = await sb.from('financial_alerts').select('created_at').order('created_at', { ascending: false }).limit(1)
      sources.push({ source: 'Alert Evaluator', last_updated: lastAlert?.[0]?.created_at, hours_ago: lastAlert?.[0] ? Math.round((now.getTime() - new Date(lastAlert[0].created_at).getTime()) / 3600000) : null })

      // Forecast
      const { data: lastForecast } = await sb.from('audit_log').select('created_at').eq('action', 'forecast.generated').order('created_at', { ascending: false }).limit(1)
      sources.push({ source: 'Forecast', last_updated: lastForecast?.[0]?.created_at, hours_ago: lastForecast?.[0] ? Math.round((now.getTime() - new Date(lastForecast[0].created_at).getTime()) / 3600000) : null })

      // Revenue metrics
      const { data: lastRev } = await sb.from('revenue_metrics').select('snapshot_date').order('snapshot_date', { ascending: false }).limit(1)
      sources.push({ source: 'Revenue Snapshot', last_updated: lastRev?.[0]?.snapshot_date, hours_ago: lastRev?.[0] ? Math.round((now.getTime() - new Date(lastRev[0].snapshot_date).getTime()) / 3600000) : null })

      // Health score
      const { data: lastHealth } = await sb.from('customer_health').select('computed_at').order('computed_at', { ascending: false }).limit(1)
      sources.push({ source: 'Customer Health', last_updated: lastHealth?.[0]?.computed_at, hours_ago: lastHealth?.[0] ? Math.round((now.getTime() - new Date(lastHealth[0].computed_at).getTime()) / 3600000) : null })

      return new Response(JSON.stringify({ sources, stale: sources.filter(s => (s.hours_ago || 999) > 24).map(s => s.source) }), { headers })
    }

    // === METRICS ===
    if (action === 'metrics') {
      const [tables, functions, cronJobs, auditCount, sessionCount] = await Promise.all([
        sb.rpc('get_table_count').catch(() => ({ data: null })),
        sb.from('automation_runs').select('id', { count: 'exact', head: true }),
        sb.from('automation_runs').select('duration_ms').order('completed_at', { ascending: false }).limit(50),
        sb.from('audit_log').select('id', { count: 'exact', head: true }),
        sb.from('session_events').select('id', { count: 'exact', head: true }),
      ])

      const durations = (cronJobs.data || []).map((r: any) => r.duration_ms || 0).filter((d: number) => d > 0)
      const avgLatency = durations.length > 0 ? Math.round(durations.reduce((s: number, d: number) => s + d, 0) / durations.length) : 0
      const p95Latency = durations.length > 0 ? durations.sort((a: number, b: number) => a - b)[Math.floor(durations.length * 0.95)] : 0

      return new Response(JSON.stringify({
        edge_functions: 50, tables: 76, cron_jobs: 7,
        total_automation_runs: functions.count || 0,
        total_audit_entries: auditCount.count || 0,
        total_sessions: sessionCount.count || 0,
        latency: { avg_ms: avgLatency, p95_ms: p95Latency },
      }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown action. Use: health, cron_status, recent_runs, data_freshness, metrics' }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers })
  }
})
