import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function fmt(v: number): string { const a=Math.abs(v); if(a>=1e6)return'$'+(v/1e6).toFixed(1)+'M'; if(a>=1e3)return'$'+(v/1e3).toFixed(0)+'K'; return'$'+v.toFixed(0); }

/*
  cash-flow-brain v1
  Generates cash flow statements from GL data using the indirect method.
  
  Actions:
  - generate: Build cash flow statement for a period
  - summary: Quick cash position overview
  - trend: Month-over-month cash flow trend
  
  Indirect method:
  1. Start with Net Income
  2. Add back non-cash items (depreciation, amortization, stock-based comp)
  3. Adjust for working capital changes (AR, AP, inventory)
  4. = Operating Cash Flow
  5. Subtract CapEx, acquisitions
  6. = Investing Cash Flow
  7. Add debt proceeds, subtract repayments, equity
  8. = Financing Cash Flow
  9. = Net Change in Cash
*/

// Map GL account names to cash flow categories
const CF_MAPPING: Record<string, { category: string, subcategory: string, sign: number }> = {
  // Operating - non-cash addbacks
  'Depreciation': { category: 'operating', subcategory: 'depreciation', sign: 1 },
  'Amortization': { category: 'operating', subcategory: 'amortization', sign: 1 },
  'Stock-Based Compensation': { category: 'operating', subcategory: 'stock_comp', sign: 1 },
  'Bad Debt Expense': { category: 'operating', subcategory: 'bad_debt', sign: 1 },
  // Operating - working capital
  'Accounts Receivable': { category: 'operating', subcategory: 'accounts_receivable', sign: -1 },
  'Accounts Payable': { category: 'operating', subcategory: 'accounts_payable', sign: 1 },
  'Inventory': { category: 'operating', subcategory: 'inventory', sign: -1 },
  'Deferred Revenue': { category: 'operating', subcategory: 'deferred_revenue', sign: 1 },
  'Prepaid Expenses': { category: 'operating', subcategory: 'prepaid', sign: -1 },
  'Accrued Liabilities': { category: 'operating', subcategory: 'accrued_liabilities', sign: 1 },
  // Investing
  'Capital Expenditures': { category: 'investing', subcategory: 'capex', sign: -1 },
  'Equipment Purchases': { category: 'investing', subcategory: 'equipment', sign: -1 },
  'Acquisitions': { category: 'investing', subcategory: 'acquisitions', sign: -1 },
  'Investment Purchases': { category: 'investing', subcategory: 'investments', sign: -1 },
  // Financing
  'Debt Proceeds': { category: 'financing', subcategory: 'debt_proceeds', sign: 1 },
  'Debt Repayment': { category: 'financing', subcategory: 'debt_repayment', sign: -1 },
  'Dividends': { category: 'financing', subcategory: 'dividends', sign: -1 },
  'Share Repurchase': { category: 'financing', subcategory: 'buyback', sign: -1 },
  'Equity Issuance': { category: 'financing', subcategory: 'equity', sign: 1 },
}

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  // Auth
  let orgId: string | null = null, userId: string | null = null
  const authHeader = req.headers.get('Authorization')
  const cronSecret = req.headers.get('x-cron-secret')
  const expectedSecret = Deno.env.get('CRON_SECRET') || ''

  if (cronSecret && expectedSecret && cronSecret === expectedSecret) {
    // cron mode
  } else if (authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
    if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })
    userId = user.id
    const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
    orgId = profile?.org_id || null
  } else return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })

  try {
    const body = await req.json()
    const action = body.action || 'generate'
    const targetOrgId = body.org_id || orgId
    if (!targetOrgId) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })

    // Pull GL data
    const { data: txns } = await sb.from('gl_transactions').select('amount, period, gl_accounts(name, account_type)').eq('org_id', targetOrgId)
    if (!txns?.length) return new Response(JSON.stringify({ error: 'No GL data' }), { status: 200, headers })

    // Compute P&L totals
    let revenue = 0, cogs = 0, opex = 0
    const byAcct: Record<string, { total: number, type: string }> = {}
    const byMonth: Record<string, { revenue: number, cogs: number, opex: number }> = {}
    ;(txns || []).forEach((t: any) => {
      const at = t.gl_accounts?.account_type; const name = t.gl_accounts?.name || 'Unknown'; const amt = Math.abs(Number(t.amount) || 0); const p = t.period || ''
      if (at === 'revenue' || at === 'other_income') revenue += amt
      else if (at === 'cost_of_revenue') cogs += amt
      else if (at === 'expense' || at === 'other_expense') opex += amt
      byAcct[name] = { total: (byAcct[name]?.total || 0) + amt, type: at || '' }
      if (p) { if (!byMonth[p]) byMonth[p] = { revenue: 0, cogs: 0, opex: 0 }; if (at === 'revenue' || at === 'other_income') byMonth[p].revenue += amt; else if (at === 'cost_of_revenue') byMonth[p].cogs += amt; else byMonth[p].opex += amt }
    })
    const ni = revenue - cogs - opex

    // === GENERATE cash flow statement ===
    if (action === 'generate') {
      // Classify GL accounts into cash flow categories
      const operating: { name: string, amount: number, subcategory: string }[] = []
      const investing: { name: string, amount: number, subcategory: string }[] = []
      const financing: { name: string, amount: number, subcategory: string }[] = []

      for (const [acctName, data] of Object.entries(byAcct)) {
        const mapping = CF_MAPPING[acctName]
        if (mapping) {
          const entry = { name: acctName, amount: data.total * mapping.sign, subcategory: mapping.subcategory }
          if (mapping.category === 'operating') operating.push(entry)
          else if (mapping.category === 'investing') investing.push(entry)
          else financing.push(entry)
        }
      }

      // Estimate non-cash items if not in GL (common SaaS assumptions)
      const estimatedDepreciation = opex * 0.03 // ~3% of OpEx
      const estimatedSBC = opex * 0.08 // ~8% of OpEx for SaaS
      if (!operating.find(o => o.subcategory === 'depreciation')) operating.push({ name: 'Depreciation (est.)', amount: estimatedDepreciation, subcategory: 'depreciation' })
      if (!operating.find(o => o.subcategory === 'stock_comp')) operating.push({ name: 'Stock-Based Comp (est.)', amount: estimatedSBC, subcategory: 'stock_comp' })

      // Estimate working capital changes
      const estimatedARChange = revenue * 0.02 // ~2% of revenue
      const estimatedAPChange = opex * 0.015 // ~1.5% of opex
      if (!operating.find(o => o.subcategory === 'accounts_receivable')) operating.push({ name: 'Change in AR (est.)', amount: -estimatedARChange, subcategory: 'accounts_receivable' })
      if (!operating.find(o => o.subcategory === 'accounts_payable')) operating.push({ name: 'Change in AP (est.)', amount: estimatedAPChange, subcategory: 'accounts_payable' })

      // Estimate CapEx
      const estimatedCapex = revenue * 0.04 // ~4% of revenue
      if (!investing.length) investing.push({ name: 'Capital Expenditures (est.)', amount: -estimatedCapex, subcategory: 'capex' })

      const operatingTotal = ni + operating.reduce((s, o) => s + o.amount, 0)
      const investingTotal = investing.reduce((s, i) => s + i.amount, 0)
      const financingTotal = financing.reduce((s, f) => s + f.amount, 0)
      const netChange = operatingTotal + investingTotal + financingTotal

      const statement = {
        net_income: ni,
        operating: { items: operating, total: operatingTotal, cash_from_operations: operatingTotal },
        investing: { items: investing, total: investingTotal },
        financing: { items: financing, total: financingTotal },
        net_change_in_cash: netChange,
        free_cash_flow: operatingTotal + investingTotal,
        summary: {
          operating: fmt(operatingTotal), investing: fmt(investingTotal), financing: fmt(financingTotal),
          net_change: fmt(netChange), fcf: fmt(operatingTotal + investingTotal),
          fcf_margin: revenue > 0 ? ((operatingTotal + investingTotal) / revenue * 100).toFixed(1) + '%' : '0%',
        },
      }

      // Save entries
      const entries = [
        ...operating.map(o => ({ org_id: targetOrgId, period: body.period || 'YTD', category: 'operating', subcategory: o.subcategory, description: o.name, amount: o.amount, source: 'computed' })),
        ...investing.map(i => ({ org_id: targetOrgId, period: body.period || 'YTD', category: 'investing', subcategory: i.subcategory, description: i.name, amount: i.amount, source: 'computed' })),
        ...financing.map(f => ({ org_id: targetOrgId, period: body.period || 'YTD', category: 'financing', subcategory: f.subcategory, description: f.name, amount: f.amount, source: 'computed' })),
      ]
      try { await sb.from('cash_flow_entries').insert(entries) } catch {}
      try { await sb.from('audit_log').insert({ user_id: userId, org_id: targetOrgId, action: 'cashflow.generated', resource_type: 'cashflow', metadata: { operating: operatingTotal, investing: investingTotal, financing: financingTotal, fcf: operatingTotal + investingTotal } }) } catch {}

      return new Response(JSON.stringify(statement), { headers })
    }

    // === SUMMARY ===
    if (action === 'summary') {
      const estDepreciation = opex * 0.03; const estSBC = opex * 0.08
      const estARChange = revenue * 0.02; const estAPChange = opex * 0.015
      const estCapex = revenue * 0.04
      const operatingCF = ni + estDepreciation + estSBC - estARChange + estAPChange
      const investingCF = -estCapex
      const fcf = operatingCF + investingCF
      return new Response(JSON.stringify({
        net_income: fmt(ni), operating_cf: fmt(operatingCF), investing_cf: fmt(investingCF),
        free_cash_flow: fmt(fcf), fcf_margin: (fcf / revenue * 100).toFixed(1) + '%',
        cash_conversion: ni > 0 ? (operatingCF / ni * 100).toFixed(0) + '%' : 'N/A',
      }), { headers })
    }

    // === TREND (month-over-month) ===
    if (action === 'trend') {
      const months = Object.entries(byMonth).sort()
      const trend = months.map(([month, d]) => {
        const monthNI = d.revenue - d.cogs - d.opex
        const estOp = monthNI + d.opex * 0.11 - d.revenue * 0.02 + d.opex * 0.015
        const estInv = -d.revenue * 0.04
        return { month, revenue: Math.round(d.revenue), net_income: Math.round(monthNI), operating_cf: Math.round(estOp), fcf: Math.round(estOp + estInv) }
      })
      return new Response(JSON.stringify({ trend }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown action. Use: generate, summary, trend' }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers })
  }
})
