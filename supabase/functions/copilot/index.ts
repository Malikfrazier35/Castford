import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY') || Deno.env.get('AI_GATEWAY_API_KEY') || ''
const BASE_URL = Deno.env.get('SUPABASE_URL')!
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o = req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin': AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey' }; }
function fmt(v: number): string { if (v===0) return '\u2014'; const a=Math.abs(v); const s = a>=1e6?'$'+(a/1e6).toFixed(1)+'M':a>=1e3?'$'+Math.round(a/1e3).toLocaleString()+'K':'$'+a.toFixed(0); return v<0?'('+s+')':s; }

const DEFAULT_MODEL = 'claude-sonnet-4-6-20250514'
const PREMIUM_MODEL = 'claude-opus-4-6-20250514'

const TOOLS = [
  { name: 'generate_forecast', description: 'Generate revenue/expense forecast.', input_schema: { type: 'object', properties: { periods: { type: 'number', default: 6 }, account_type: { type: 'string', enum: ['revenue','expense','cost_of_revenue','all'], default: 'revenue' } }, required: [] } },
  { name: 'create_task', description: 'Create a workspace task.', input_schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, priority: { type: 'string', enum: ['low','medium','high','critical'], default: 'medium' }, category: { type: 'string', enum: ['general','close','reconciliation','report','audit'], default: 'general' }, due_date: { type: 'string' } }, required: ['title'] } },
  { name: 'run_benchmark', description: 'Compare metrics against industry benchmarks.', input_schema: { type: 'object', properties: { industry: { type: 'string', enum: ['saas','fintech','healthcare','ecommerce','manufacturing','services','marketplace'], default: 'saas' } }, required: [] } },
  { name: 'get_insights', description: 'Get top 3 proactive financial observations.', input_schema: { type: 'object', properties: {}, required: [] } },
  { name: 'generate_report', description: 'Generate a board-ready financial report.', input_schema: { type: 'object', properties: { report_type: { type: 'string', enum: ['monthly_board','quarterly_review'], default: 'monthly_board' }, period: { type: 'string' } }, required: [] } },
  { name: 'run_scenario', description: 'Run a what-if scenario against live GL data.', input_schema: { type: 'object', properties: { revenue_change_pct: { type: 'number' }, new_hires: { type: 'number' }, avg_salary: { type: 'number', default: 120000 }, layoffs: { type: 'number' }, opex_change_pct: { type: 'number' }, target_department: { type: 'string' }, price_increase_pct: { type: 'number' }, churn_increase_pct: { type: 'number' } }, required: [] } },
  { name: 'get_cashflow', description: 'Generate cash flow statement (indirect method).', input_schema: { type: 'object', properties: { view: { type: 'string', enum: ['summary','full','trend'], default: 'summary' } }, required: [] } },
  { name: 'budget_variance', description: 'Budget vs actual variance analysis.', input_schema: { type: 'object', properties: { detail: { type: 'string', enum: ['summary','by_account'], default: 'summary' }, period: { type: 'string' } }, required: [] } },
  { name: 'board_deck', description: 'Auto-generate complete board report with P&L, trend, variance, headcount, alerts. Growth+ required.', input_schema: { type: 'object', properties: { title: { type: 'string' } }, required: [] } },
  { name: 'reconciliation', description: 'Month-end reconciliation: trial balance, duplicates, matching, close readiness.', input_schema: { type: 'object', properties: { action: { type: 'string', enum: ['status','match','close_check'], default: 'status' }, period: { type: 'string' } }, required: [] } },
]

async function executeTool(toolName: string, toolInput: any, orgId: string, userId: string, token: string): Promise<any> {
  const h = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  const ch = { 'Content-Type': 'application/json', 'x-cron-secret': Deno.env.get('CRON_SECRET') || '' }
  try {
    switch (toolName) {
      case 'generate_forecast': { const r = await fetch(`${BASE_URL}/functions/v1/generate-forecast`, { method: 'POST', headers: h, body: JSON.stringify({ periods: toolInput.periods || 6, account_type: toolInput.account_type || 'revenue', model: 'all' }) }); return await r.json() }
      case 'create_task': { const r = await fetch(`${BASE_URL}/functions/v1/workspace-api`, { method: 'POST', headers: h, body: JSON.stringify({ action: 'create_task', ...toolInput }) }); return await r.json() }
      case 'run_benchmark': { const r = await fetch(`${BASE_URL}/functions/v1/benchmark-compare`, { method: 'POST', headers: h, body: JSON.stringify({ industry: toolInput.industry || 'saas' }) }); return await r.json() }
      case 'get_insights': { const r = await fetch(`${BASE_URL}/functions/v1/dashboard-insights`, { method: 'POST', headers: h }); return await r.json() }
      case 'generate_report': { const r = await fetch(`${BASE_URL}/functions/v1/report-generate`, { method: 'POST', headers: { ...ch }, body: JSON.stringify({ action: 'generate', report_type: toolInput.report_type || 'monthly_board', period: toolInput.period, org_id: orgId }) }); return await r.json() }
      case 'run_scenario': { const r = await fetch(`${BASE_URL}/functions/v1/scenario-engine`, { method: 'POST', headers: h, body: JSON.stringify({ action: 'compute', assumptions: toolInput }) }); return await r.json() }
      case 'get_cashflow': { const a = toolInput.view === 'full' ? 'generate' : toolInput.view === 'trend' ? 'trend' : 'summary'; const r = await fetch(`${BASE_URL}/functions/v1/cash-flow-brain`, { method: 'POST', headers: { ...ch }, body: JSON.stringify({ action: a, org_id: orgId }) }); return await r.json() }
      case 'budget_variance': { const a = toolInput.detail === 'by_account' ? 'variance' : 'summary'; const r = await fetch(`${BASE_URL}/functions/v1/budget-brain`, { method: 'POST', headers: { ...ch }, body: JSON.stringify({ action: a, org_id: orgId, period: toolInput.period }) }); return await r.json() }
      case 'board_deck': { const r = await fetch(`${BASE_URL}/functions/v1/board-deck-brain`, { method: 'POST', headers: h, body: JSON.stringify({ title: toolInput.title }) }); return await r.json() }
      case 'reconciliation': { const r = await fetch(`${BASE_URL}/functions/v1/reconciliation-brain`, { method: 'POST', headers: h, body: JSON.stringify({ action: toolInput.action || 'status', period: toolInput.period }) }); return await r.json() }
      default: return { error: `Unknown tool: ${toolName}` }
    }
  } catch (e: any) { return { error: e.message || 'Tool execution failed' } }
}

async function resolveModel(orgId: string): Promise<string> {
  if (!orgId) return DEFAULT_MODEL
  const { data: org } = await supabase.from('organizations').select('ai_model, plan').eq('id', orgId).maybeSingle()
  if (org?.ai_model && org.ai_model !== DEFAULT_MODEL) return org.ai_model
  if (org?.plan) { const { data: limits } = await supabase.from('plan_limits').select('ai_model').eq('plan', org.plan).maybeSingle(); if (limits?.ai_model) return limits.ai_model }
  return DEFAULT_MODEL
}

async function buildGLContext(orgId: string): Promise<string> {
  try {
    const [accts, txns, budgets] = await Promise.all([
      supabase.from('gl_accounts').select('name, account_type').eq('org_id', orgId).eq('active', true),
      supabase.from('gl_transactions').select('amount, period, gl_accounts(name, account_type)').eq('org_id', orgId).order('txn_date', {ascending:false}).limit(500),
      supabase.from('gl_budgets').select('amount, period, gl_accounts(name, account_type)').eq('org_id', orgId),
    ])
    const t = txns.data || []; const b = budgets.data || []
    if (!t.length) return '\n\nNOTE: No GL data loaded yet.'
    let revenue=0, cogs=0, opex=0
    const byAccount: Record<string, {actual:number, budget:number, type:string}> = {}
    const byMonth: Record<string, {revenue:number, cogs:number, opex:number}> = {}
    t.forEach((tx: any) => { const at = tx.gl_accounts?.account_type; const amt = Math.abs(Number(tx.amount)||0); const name = tx.gl_accounts?.name||'Unknown'; if (at==='revenue'||at==='other_income') revenue+=amt; else if (at==='cost_of_revenue') cogs+=amt; else if (at==='expense'||at==='other_expense') opex+=amt; if (!byAccount[name]) byAccount[name]={actual:0,budget:0,type:at||''}; byAccount[name].actual += amt; const mo = tx.period || ''; if (mo) { if (!byMonth[mo]) byMonth[mo]={revenue:0,cogs:0,opex:0}; if (at==='revenue'||at==='other_income') byMonth[mo].revenue+=amt; else if (at==='cost_of_revenue') byMonth[mo].cogs+=amt; else byMonth[mo].opex+=amt } })
    b.forEach((bg: any) => { const name = bg.gl_accounts?.name||'Unknown'; if (!byAccount[name]) byAccount[name]={actual:0,budget:0,type:bg.gl_accounts?.account_type||''}; byAccount[name].budget += Math.abs(Number(bg.amount)||0) })
    const gp = revenue - cogs; const ni = revenue - cogs - opex
    let ctx = `\n\n--- LIVE GL DATA ---\nKPIs: Revenue ${fmt(revenue)} | COGS ${fmt(cogs)} | GP ${fmt(gp)} (${revenue>0?((gp/revenue)*100).toFixed(1):'0'}%) | OpEx ${fmt(opex)} | NI ${fmt(ni)} (${revenue>0?((ni/revenue)*100).toFixed(1):'0'}%)`
    ctx += `\nAccounts: ${(accts.data||[]).length} | Txns: ${t.length} | Budgets: ${b.length}`
    const sorted = Object.entries(byAccount).sort((a,b)=>b[1].actual-a[1].actual).slice(0,12)
    ctx += '\nTop accounts:'; sorted.forEach(([name, d]) => { const v = d.budget ? ((d.actual-d.budget)/d.budget*100).toFixed(1) : 'N/A'; ctx += `\n  ${name} (${d.type}): ${fmt(d.actual)}${d.budget?` | Bgt ${fmt(d.budget)} | Var ${v}%`:''}` })
    const months = Object.entries(byMonth).sort(); if (months.length > 1) { ctx += '\nMonthly:'; months.forEach(([mo, d]) => { ctx += `\n  ${mo}: Rev ${fmt(d.revenue)} | OpEx ${fmt(d.opex)} | Net ${fmt(d.revenue-d.cogs-d.opex)}` }) }
    ctx += '\n--- END ---'
    return ctx
  } catch { return '' }
}

const SYSTEM_BASE = `You are the AI Copilot for Castford, a cloud FP&A platform. You help CFOs and finance teams analyze variance, forecast, model scenarios, and surface patterns.

Rules:
- Be concise and direct. Finance people want numbers, not fluff.
- Include dollar amounts AND percentages.
- Format negatives with accounting parentheses: ($420K), not -$420K.
- Use em dash for zero values, never $0.
- Never fabricate. Use the LIVE GL DATA below.
- You have 10 TOOLS: generate_forecast, create_task, run_benchmark, get_insights, generate_report, run_scenario, get_cashflow, budget_variance, board_deck, reconciliation.
- board_deck generates a complete board report (Growth+ plan required).
- reconciliation checks trial balance, finds duplicates, matches transactions, and assesses close readiness.
- After tools, summarize with specific numbers.`

Deno.serve(async (req) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })
  if (!ANTHROPIC_KEY) return new Response(JSON.stringify({ error: 'AI not configured' }), { status: 503, headers: { 'Content-Type': 'application/json', ...headers } })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })

  try {
    const body = await req.json()
    let messages: any[]
    if (body.query) { messages = []; if (body.history?.length) for (const m of body.history.slice(-6)) messages.push({ role: m.role, content: m.content }); messages.push({ role: 'user', content: body.query }) }
    else if (body.messages?.length) { messages = body.messages.slice(-10) }
    else return new Response(JSON.stringify({ error: 'query or messages required' }), { status: 400, headers })

    const { data: userData } = await supabase.from('users').select('org_id').eq('id', user.id).single()
    const orgId = userData?.org_id || ''
    const aiModel = await resolveModel(orgId)
    const isPremium = aiModel.includes('opus')
    const systemPrompt = SYSTEM_BASE + (isPremium ? '\nYou are running on Claude Opus 4.6. Provide deeper analysis and more sophisticated reasoning.' : '') + (orgId ? await buildGLContext(orgId) : '')

    let anthropicRes = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: aiModel, max_tokens: isPremium ? 4000 : 2000, system: systemPrompt, messages, tools: TOOLS }) })
    if (!anthropicRes.ok) { const e = await anthropicRes.text(); return new Response(JSON.stringify({ error: 'AI error', detail: e.substring(0,200) }), { status: 502, headers: { 'Content-Type':'application/json', ...headers } }) }
    let data = await anthropicRes.json()
    let totalTokens = (data.usage?.input_tokens||0) + (data.usage?.output_tokens||0)
    const toolsUsed: string[] = []; const toolResults: any[] = []

    let iterations = 0
    while (data.stop_reason === 'tool_use' && iterations < 3) {
      iterations++
      const toolBlocks = data.content.filter((c: any) => c.type === 'tool_use')
      messages.push({ role: 'assistant', content: data.content })
      const toolResultContent: any[] = []
      for (const tb of toolBlocks) {
        toolsUsed.push(tb.name)
        const result = await executeTool(tb.name, tb.input, orgId, user.id, token)
        toolResults.push({ tool: tb.name, input: tb.input, result })
        toolResultContent.push({ type: 'tool_result', tool_use_id: tb.id, content: JSON.stringify(result).substring(0, 4000) })
      }
      messages.push({ role: 'user', content: toolResultContent })
      anthropicRes = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: aiModel, max_tokens: isPremium ? 4000 : 2000, system: systemPrompt, messages, tools: TOOLS }) })
      if (!anthropicRes.ok) break
      data = await anthropicRes.json()
      totalTokens += (data.usage?.input_tokens||0) + (data.usage?.output_tokens||0)
    }

    const text = data.content?.filter((c: any) => c.type === 'text').map((c: any) => c.text).join('') || ''

    if (orgId) {
      const userMsg = body.query || messages.find((m: any) => typeof m.content === 'string' && m.role === 'user')?.content || ''
      const convId = body.conversation_id
      if (convId) {
        const { data: conv } = await supabase.from('copilot_conversations').select('messages, token_count').eq('id', convId).eq('org_id', orgId).single()
        if (conv) { const msgs = conv.messages || []; msgs.push({ role: 'user', content: userMsg, ts: new Date().toISOString() }); msgs.push({ role: 'assistant', content: text, tools: toolsUsed, ts: new Date().toISOString() }); await supabase.from('copilot_conversations').update({ messages: msgs, token_count: (conv.token_count||0)+totalTokens, updated_at: new Date().toISOString(), model: aiModel }).eq('id', convId) }
      } else {
        const title = userMsg.substring(0, 80) + (userMsg.length > 80 ? '...' : '')
        const { data: newConv } = await supabase.from('copilot_conversations').insert({ org_id: orgId, user_id: user.id, title, messages: [{ role: 'user', content: userMsg, ts: new Date().toISOString() }, { role: 'assistant', content: text, tools: toolsUsed, ts: new Date().toISOString() }], token_count: totalTokens, model: aiModel }).select('id').single()
        if (newConv) body._conversation_id = newConv.id
      }
      try { await supabase.from('usage_events').insert({ org_id: orgId, user_id: user.id, event_type: 'ai_query', tokens_used: totalTokens, metadata: { model: aiModel, tools_used: toolsUsed, tool_count: toolsUsed.length, is_premium: isPremium }, reported_to_stripe: false }) } catch {}
      try { await supabase.from('copilot_actions').insert({ org_id: orgId, user_id: user.id, action_type: toolsUsed.length ? 'tool_call' : 'query', description: (body.query || '').substring(0, 200), input_data: { query: (body.query || '').substring(0, 500), tools_called: toolsUsed, model: aiModel }, output_data: { response_preview: text.substring(0, 500), tokens: totalTokens } }) } catch {}
    }

    return new Response(JSON.stringify({ text, response: text, model: aiModel, is_premium: isPremium, usage: data.usage, tools_used: toolsUsed, tool_results: toolResults.length ? toolResults : undefined, conversation_id: body.conversation_id || body._conversation_id || null }), { status: 200, headers: { 'Content-Type': 'application/json', ...headers } })
  } catch (err: any) {
    console.error('Copilot error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers })
  }
})
