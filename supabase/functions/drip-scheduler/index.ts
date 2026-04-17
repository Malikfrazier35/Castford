import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const RESEND_KEY = Deno.env.get('RESEND_API_KEY') || ''
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'Castford <onboarding@castford.com>'

/*
  drip-scheduler v1
  Processes active drip campaigns and sends the next email in sequence.
  Called by pg_cron daily at 2pm UTC.
  
  Onboarding sequence (5 emails):
  Day 0: Welcome + getting started
  Day 1: Connect your first integration
  Day 3: Meet the AI copilot
  Day 7: Build your first forecast
  Day 12: Invite your team
*/

const ONBOARDING_EMAILS = [
  {
    day: 0, subject: 'Welcome to Castford — your FP&A just got smarter',
    body: (name: string) => `<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><h2>Welcome, ${name}!</h2><p>You've just joined the platform that mid-market CFOs are switching to for automated financial planning.</p><p>Your dashboard is ready with sample data so you can explore immediately. Here's what to do first:</p><ol><li><strong>Explore the dashboard</strong> — see live P&L, KPIs, and variance analysis</li><li><strong>Try the AI copilot</strong> — ask "What's driving our OPEX this quarter?"</li><li><strong>Connect your ERP</strong> — QuickBooks, Xero, or NetSuite in under 5 minutes</li></ol><p><a href="https://castford.com/login" style="background:#5B7FCC;color:#fff;padding:12px 24px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;margin-top:12px">Open Your Dashboard</a></p><p style="margin-top:24px;color:#6b7280;font-size:13px">— Malik Frazier, Founder</p></div>`,
  },
  {
    day: 1, subject: 'Connect your ERP — see real data in 5 minutes',
    body: (name: string) => `<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><h2>Ready for real numbers, ${name}?</h2><p>Right now your dashboard shows sample data. The magic happens when you connect your actual ERP.</p><p><strong>Supported integrations:</strong></p><ul><li>QuickBooks Online — OAuth, 2 clicks</li><li>Xero — OAuth, 2 clicks</li><li>NetSuite — TBA auth for enterprise</li><li>CSV upload — any accounting system</li></ul><p>Once connected, your P&L, variance analysis, and AI copilot all switch to live data automatically. The sample data disappears on its own.</p><p><a href="https://castford.com/login" style="background:#5B7FCC;color:#fff;padding:12px 24px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;margin-top:12px">Connect Your ERP</a></p></div>`,
  },
  {
    day: 3, subject: 'Ask your data anything — meet the AI copilot',
    body: (name: string) => `<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><h2>${name}, have you tried the copilot yet?</h2><p>Most CFOs spend hours digging through Excel to answer one question. Castford's AI copilot answers from your actual GL data in seconds.</p><p><strong>Try asking:</strong></p><ul><li>"Why did COGS increase this quarter?"</li><li>"What's our gross margin trend over the last 6 months?"</li><li>"Which expense account has the highest variance from budget?"</li></ul><p>The copilot pulls real numbers from your general ledger — account names, dollar amounts, percentages. No hallucinations.</p><p><a href="https://castford.com/login" style="background:#5B7FCC;color:#fff;padding:12px 24px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;margin-top:12px">Try the AI Copilot</a></p></div>`,
  },
  {
    day: 7, subject: 'Your first forecast is ready',
    body: (name: string) => `<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><h2>${name}, Castford just ran your forecast</h2><p>Based on your GL data, we've automatically generated a 6-month revenue projection using three models:</p><ul><li><strong>Linear regression</strong> — trend-based</li><li><strong>Exponential moving average</strong> — momentum-based</li><li><strong>Monte Carlo simulation</strong> — 1,000 scenarios with confidence intervals</li></ul><p>We backtested each model against your last 3 months and auto-selected the one with the lowest error rate.</p><p><a href="https://castford.com/login" style="background:#5B7FCC;color:#fff;padding:12px 24px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;margin-top:12px">See Your Forecast</a></p></div>`,
  },
  {
    day: 12, subject: 'Invite your team — collaboration is free',
    body: (name: string) => `<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><h2>Time to bring the team in, ${name}</h2><p>Castford is most powerful when your whole finance team is using it. Your plan includes multiple seats — invite your controller, FP&A analyst, or VP Finance.</p><p><strong>Each team member gets:</strong></p><ul><li>Role-based dashboard (CFO, Controller, FP&A views)</li><li>AI copilot access with conversation history</li><li>Real-time notifications on variances and alerts</li></ul><p>Go to Settings → Team → Invite to add your colleagues.</p><p><a href="https://castford.com/login" style="background:#5B7FCC;color:#fff;padding:12px 24px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;margin-top:12px">Invite Your Team</a></p><p style="margin-top:24px;color:#6b7280;font-size:13px">This is the last email in our onboarding series. If you need anything, reply to this email or use the copilot — it knows your data better than anyone.</p></div>`,
  },
]

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_KEY) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, reply_to: 'support@castford.com' }),
    })
    return res.ok
  } catch { return false }
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

  try {
    const now = new Date()
    // Find active drip campaigns due for next send
    const { data: dueCampaigns } = await sb.from('drip_campaigns')
      .select('id, org_id, user_id, campaign_type, step, total_steps, metadata')
      .eq('status', 'active')
      .lte('next_send_at', now.toISOString())
      .limit(50)

    if (!dueCampaigns?.length) {
      return new Response(JSON.stringify({ message: 'No campaigns due', processed: 0 }), { headers: { 'Content-Type': 'application/json' } })
    }

    let sent = 0, failed = 0
    for (const campaign of dueCampaigns) {
      const step = campaign.step
      const emails = campaign.campaign_type === 'onboarding' ? ONBOARDING_EMAILS : []
      const emailTemplate = emails[step]
      if (!emailTemplate) {
        await sb.from('drip_campaigns').update({ status: 'completed' }).eq('id', campaign.id)
        continue
      }

      // Get user email and name
      const { data: user } = await sb.from('users').select('email, full_name').eq('id', campaign.user_id).maybeSingle()
      if (!user?.email) { failed++; continue }

      const name = (user.full_name || '').split(' ')[0] || 'there'
      const success = await sendEmail(user.email, emailTemplate.subject, emailTemplate.body(name))

      if (success) {
        sent++
        const nextStep = step + 1
        if (nextStep >= campaign.total_steps) {
          await sb.from('drip_campaigns').update({ step: nextStep, status: 'completed', last_sent_at: now.toISOString() }).eq('id', campaign.id)
        } else {
          // Calculate next send time based on next email's day offset
          const nextEmail = emails[nextStep]
          const daysDelta = nextEmail ? nextEmail.day - emailTemplate.day : 1
          const nextSend = new Date(now.getTime() + daysDelta * 86400000)
          await sb.from('drip_campaigns').update({ step: nextStep, next_send_at: nextSend.toISOString(), last_sent_at: now.toISOString() }).eq('id', campaign.id)
        }
      } else { failed++ }
    }

    await sb.from('automation_runs').insert({
      status: 'success', trigger_source: 'drip_scheduler',
      input_data: { campaigns_due: dueCampaigns.length },
      output_data: { sent, failed },
      duration_ms: Date.now() - now.getTime(), completed_at: now.toISOString(),
    }).catch(() => {})

    return new Response(JSON.stringify({ processed: dueCampaigns.length, sent, failed }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    console.error('drip-scheduler error:', err)
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
