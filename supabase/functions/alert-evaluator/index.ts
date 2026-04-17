import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const RESEND_KEY = Deno.env.get('RESEND_API_KEY') || ''
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'Castford <alerts@castford.com>'

function fmt(v: number): string { const a=Math.abs(v); if(a>=1e6)return'$'+(v/1e6).toFixed(1)+'M'; if(a>=1e3)return'$'+(v/1e3).toFixed(0)+'K'; return'$'+v.toFixed(0); }

async function sendAlertEmail(email: string, alerts: any[]): Promise<void> {
  if (!RESEND_KEY || !alerts.length) return
  const rows = alerts.map(a => `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-size:13px">${a.severity === 'critical' ? '\u{1F534}' : a.severity === 'high' ? '\u{1F7E0}' : '\u{1F7E1}'} ${a.title}</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:13px">${a.description?.substring(0, 120) || ''}</td></tr>`).join('')
  try {
    await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({ from: FROM_EMAIL, to: email, subject: `Castford Alert: ${alerts.length} new finding${alerts.length > 1 ? 's' : ''}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><h2 style="color:#0C1420">Financial Alerts</h2><p style="color:#6b7280;font-size:14px">${alerts.length} new alert${alerts.length > 1 ? 's' : ''} detected.</p><table style="width:100%;border-collapse:collapse"><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0C1420;font-size:12px">Alert</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0C1420;font-size:12px">Details</th></tr>${rows}</table><p style="margin-top:24px"><a href="https://castford.com/login" style="background:#5B7FCC;color:#fff;padding:10px 24px;text-decoration:none;font-weight:700;font-size:13px">View in Dashboard</a></p></div>` }),
    })
  } catch {}
}

Deno.serve(async (req: Request) => {
  const cronSecret = req.headers.get('x-cron-secret')
  const expectedSecret = Deno.env.get('CRON_SECRET') || ''
  const authHeader = req.headers.get('Authorization')
  let isAuthorized = false
  if (cronSecret && expectedSecret && cronSecret === expectedSecret) isAuthorized = true
  if (!isAuthorized && authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
    if (user) { const { data: p } = await sb.from('users').select('role').eq('id', user.id).maybeSingle(); if (p?.role === 'owner') isAuthorized = true }
  }
  if (!isAuthorized) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

  const startTime = Date.now()
  const allAlerts: any[] = []

  try {
    const { data: orgs } = await sb.from('organizations').select('id, name')
    if (!orgs?.length) return new Response(JSON.stringify({ message: 'No organizations', alerts: 0 }), { headers: { 'Content-Type': 'application/json' } })

    for (const org of orgs) {
      const orgId = org.id
      const orgAlerts: any[] = []

      const [txnRes, budgetRes] = await Promise.all([
        sb.from('gl_transactions').select('account_id, amount, period, txn_date, description, gl_accounts(name, account_type)').eq('org_id', orgId).order('txn_date', { ascending: false }).limit(1000),
        sb.from('gl_budgets').select('account_id, amount, period, gl_accounts(name, account_type)').eq('org_id', orgId),
      ])

      const txns = txnRes.data || []; const budgets = budgetRes.data || []
      if (!txns.length) continue

      // CHECK 1: Variance Spike (>15%)
      const actualByAcct: Record<string, { total: number, name: string, type: string }> = {}
      const budgetByAcct: Record<string, number> = {}
      txns.forEach((t: any) => { const aid = t.account_id; if (!actualByAcct[aid]) actualByAcct[aid] = { total: 0, name: t.gl_accounts?.name || 'Unknown', type: t.gl_accounts?.account_type || '' }; actualByAcct[aid].total += Math.abs(Number(t.amount) || 0) })
      budgets.forEach((b: any) => { budgetByAcct[b.account_id] = (budgetByAcct[b.account_id] || 0) + Math.abs(Number(b.amount) || 0) })
      for (const [aid, data] of Object.entries(actualByAcct)) {
        const budget = budgetByAcct[aid]; if (!budget || budget === 0) continue
        const deviation = ((data.total - budget) / budget) * 100
        if (Math.abs(deviation) > 15) {
          orgAlerts.push({ org_id: orgId, alert_type: 'variance_spike', severity: Math.abs(deviation) > 50 ? 'critical' : Math.abs(deviation) > 30 ? 'high' : 'medium',
            title: `${data.name}: ${deviation > 0 ? 'Over' : 'Under'} budget by ${Math.abs(deviation).toFixed(1)}%`,
            description: `Actual ${fmt(data.total)} vs Budget ${fmt(budget)}`, metric_name: data.name, current_value: data.total, expected_value: budget, deviation_pct: Math.round(deviation * 10) / 10, account_id: aid })
        }
      }

      // CHECK 2: Large Transaction (>3x avg)
      const avgByAcct: Record<string, { sum: number, count: number, name: string }> = {}
      txns.forEach((t: any) => { const aid = t.account_id; const amt = Math.abs(Number(t.amount) || 0); if (!avgByAcct[aid]) avgByAcct[aid] = { sum: 0, count: 0, name: t.gl_accounts?.name || 'Unknown' }; avgByAcct[aid].sum += amt; avgByAcct[aid].count++ })
      txns.slice(0, 10).forEach((t: any) => { const aid = t.account_id; const amt = Math.abs(Number(t.amount) || 0); const avg = avgByAcct[aid] ? avgByAcct[aid].sum / avgByAcct[aid].count : 0
        if (avg > 0 && amt > avg * 3 && amt > 1000) orgAlerts.push({ org_id: orgId, alert_type: 'large_transaction', severity: amt > avg * 5 ? 'high' : 'medium', title: `Unusual: ${fmt(amt)} in ${avgByAcct[aid]?.name}`, description: `${t.description || 'Txn'} on ${t.txn_date} is ${(amt/avg).toFixed(1)}x avg`, metric_name: avgByAcct[aid]?.name, current_value: amt, expected_value: avg, deviation_pct: Math.round(((amt - avg) / avg) * 100), account_id: aid })
      })

      // CHECK 3: Revenue Drop >10% MoM
      const revByMonth: Record<string, number> = {}
      txns.forEach((t: any) => { if (t.gl_accounts?.account_type === 'revenue' || t.gl_accounts?.account_type === 'other_income') { const p = t.period || ''; if (p) revByMonth[p] = (revByMonth[p] || 0) + Math.abs(Number(t.amount) || 0) } })
      const months = Object.entries(revByMonth).sort()
      if (months.length >= 2) {
        const prevRev = months[months.length - 2][1] as number; const currRev = months[months.length - 1][1] as number
        if (prevRev > 0) { const change = ((currRev - prevRev) / prevRev) * 100
          if (change < -10) orgAlerts.push({ org_id: orgId, alert_type: 'trend_break', severity: change < -25 ? 'critical' : 'high', title: `Revenue dropped ${Math.abs(change).toFixed(1)}% MoM`, description: `${months[months.length-1][0]}: ${fmt(currRev)} vs ${months[months.length-2][0]}: ${fmt(prevRev)}`, metric_name: 'Total Revenue', current_value: currRev, expected_value: prevRev, deviation_pct: Math.round(change * 10) / 10, period: months[months.length-1][0] })
        }
      }

      // Deduplicate
      if (orgAlerts.length) {
        const { data: existing } = await sb.from('financial_alerts').select('title, alert_type').eq('org_id', orgId).eq('status', 'active')
        const existingKeys = new Set((existing || []).map((e: any) => `${e.alert_type}:${e.title}`))
        const newAlerts = orgAlerts.filter(a => !existingKeys.has(`${a.alert_type}:${a.title}`))
        if (newAlerts.length) {
          await sb.from('financial_alerts').insert(newAlerts)
          const { data: owner } = await sb.from('users').select('id, email').eq('org_id', orgId).eq('role', 'owner').maybeSingle()
          if (owner) {
            const notifs = newAlerts.map(a => ({ org_id: orgId, user_id: owner.id, channel: 'in_app', title: a.title, body: a.description, link: '/login' }))
            await sb.from('notifications').insert(notifs)
            if (owner.email && newAlerts.some((a: any) => a.severity === 'high' || a.severity === 'critical')) await sendAlertEmail(owner.email, newAlerts.filter((a: any) => a.severity === 'high' || a.severity === 'critical'))
          }
          allAlerts.push(...newAlerts)
        }
      }
    }

    // Log run — use try/catch instead of .catch() which doesn't exist on Supabase client
    try { await sb.from('automation_runs').insert({ status: 'success', trigger_source: 'alert_evaluator', input_data: { orgs_scanned: orgs.length }, output_data: { total_alerts: allAlerts.length }, duration_ms: Date.now() - startTime, completed_at: new Date().toISOString() }) } catch {}

    return new Response(JSON.stringify({ message: `Evaluated ${orgs.length} orgs, found ${allAlerts.length} new alerts`, alerts: allAlerts.length, by_severity: allAlerts.reduce((acc: any, a) => { acc[a.severity] = (acc[a.severity] || 0) + 1; return acc }, {}), duration_ms: Date.now() - startTime }), { headers: { 'Content-Type': 'application/json' } })

  } catch (err: any) {
    console.error('alert-evaluator error:', err)
    return new Response(JSON.stringify({ error: err?.message || 'Evaluator failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
