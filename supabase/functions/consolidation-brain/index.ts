import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }
function fmt(v: number): string { const a=Math.abs(v); if(a>=1e6)return'$'+(v/1e6).toFixed(1)+'M'; if(a>=1e3)return'$'+(v/1e3).toFixed(0)+'K'; return'$'+v.toFixed(0); }

/*
  consolidation-brain v1
  Multi-entity GL consolidation with intercompany elimination.
  Growth+ plan feature.
  
  Actions:
  - list_entities: List all entities for the org
  - create_entity: Add a subsidiary/branch
  - consolidate: Run consolidation across all entities with IC eliminations
  - entity_pnl: P&L for a single entity
  - add_elimination: Create an intercompany elimination entry
  - elimination_report: Show all IC eliminations for a period
*/

Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const authHeader = req.headers.get('Authorization')
  const cronSecret = req.headers.get('x-cron-secret')
  const expectedSecret = Deno.env.get('CRON_SECRET') || ''
  let userId: string | null = null, orgId: string | null = null

  if (cronSecret && expectedSecret && cronSecret === expectedSecret) { /* cron */ }
  else if (authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
    if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers })
    userId = user.id
    const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
    orgId = profile?.org_id || null
  } else return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers })

  try {
    const body = await req.json()
    const action = body.action || 'list_entities'
    const targetOrgId = body.org_id || orgId
    if (!targetOrgId) return new Response(JSON.stringify({ error: 'No org' }), { status: 404, headers })

    // === LIST ENTITIES ===
    if (action === 'list_entities') {
      const { data: entities } = await sb.from('entities').select('id, name, code, currency, country, entity_type, parent_entity_id, ownership_pct, active').eq('org_id', targetOrgId).order('entity_type').order('name')
      return new Response(JSON.stringify({ entities: entities || [] }), { headers })
    }

    // === CREATE ENTITY ===
    if (action === 'create_entity') {
      const { name, code, currency, country, entity_type, parent_entity_id, ownership_pct } = body
      if (!name) return new Response(JSON.stringify({ error: 'name required' }), { status: 400, headers })
      const { data: entity } = await sb.from('entities').insert({ org_id: targetOrgId, name, code: code || name.substring(0, 5).toUpperCase(), currency: currency || 'USD', country, entity_type: entity_type || 'subsidiary', parent_entity_id, ownership_pct: ownership_pct || 100 }).select('id, name, code').single()
      return new Response(JSON.stringify({ status: 'created', entity }), { headers })
    }

    // === ENTITY P&L ===
    if (action === 'entity_pnl') {
      const entityId = body.entity_id
      if (!entityId) return new Response(JSON.stringify({ error: 'entity_id required' }), { status: 400, headers })
      let query = sb.from('gl_transactions').select('amount, period, gl_accounts(name, account_type)').eq('org_id', targetOrgId).eq('entity_id', entityId)
      if (body.period) query = query.eq('period', body.period)
      const { data: txns } = await query
      let revenue = 0, cogs = 0, opex = 0
      ;(txns || []).forEach((t: any) => { const at = t.gl_accounts?.account_type; const amt = Math.abs(Number(t.amount) || 0); if (at === 'revenue' || at === 'other_income') revenue += amt; else if (at === 'cost_of_revenue') cogs += amt; else opex += amt })
      const gp = revenue - cogs; const ni = revenue - cogs - opex
      return new Response(JSON.stringify({ entity_id: entityId, revenue, cogs, gross_profit: gp, gross_margin: revenue > 0 ? Math.round(gp / revenue * 1000) / 10 : 0, opex, net_income: ni, net_margin: revenue > 0 ? Math.round(ni / revenue * 1000) / 10 : 0, transactions: (txns || []).length }), { headers })
    }

    // === CONSOLIDATE ===
    if (action === 'consolidate') {
      const { data: entities } = await sb.from('entities').select('id, name, code, currency, ownership_pct, entity_type').eq('org_id', targetOrgId).eq('active', true)
      const { data: txns } = await sb.from('gl_transactions').select('amount, period, entity_id, gl_accounts(name, account_type)').eq('org_id', targetOrgId)
      const { data: eliminations } = await sb.from('ic_eliminations').select('from_entity_id, to_entity_id, account_type, amount, period, status').eq('org_id', targetOrgId).eq('status', 'approved')

      // Sum by entity
      const entityTotals: Record<string, { revenue: number, cogs: number, opex: number, name: string, ownership: number }> = {}
      ;(entities || []).forEach((e: any) => { entityTotals[e.id] = { revenue: 0, cogs: 0, opex: 0, name: e.name, ownership: e.ownership_pct / 100 } })
      // Also handle transactions without entity_id (legacy)
      let unassignedRev = 0, unassignedCogs = 0, unassignedOpex = 0
      ;(txns || []).forEach((t: any) => {
        const at = t.gl_accounts?.account_type; const amt = Math.abs(Number(t.amount) || 0)
        if (t.entity_id && entityTotals[t.entity_id]) {
          if (at === 'revenue' || at === 'other_income') entityTotals[t.entity_id].revenue += amt
          else if (at === 'cost_of_revenue') entityTotals[t.entity_id].cogs += amt
          else entityTotals[t.entity_id].opex += amt
        } else {
          if (at === 'revenue' || at === 'other_income') unassignedRev += amt
          else if (at === 'cost_of_revenue') unassignedCogs += amt
          else unassignedOpex += amt
        }
      })

      // Consolidated totals (ownership-adjusted)
      let consRevenue = unassignedRev, consCogs = unassignedCogs, consOpex = unassignedOpex
      const entityBreakdown: any[] = []
      for (const [eid, data] of Object.entries(entityTotals)) {
        const adjRev = data.revenue * data.ownership; const adjCogs = data.cogs * data.ownership; const adjOpex = data.opex * data.ownership
        consRevenue += adjRev; consCogs += adjCogs; consOpex += adjOpex
        const gp = adjRev - adjCogs; const ni = adjRev - adjCogs - adjOpex
        entityBreakdown.push({ entity_id: eid, name: data.name, ownership: data.ownership * 100 + '%', revenue: Math.round(adjRev), cogs: Math.round(adjCogs), opex: Math.round(adjOpex), gross_profit: Math.round(gp), net_income: Math.round(ni) })
      }
      if (unassignedRev > 0 || unassignedCogs > 0 || unassignedOpex > 0) {
        entityBreakdown.push({ entity_id: 'unassigned', name: 'Unassigned', ownership: '100%', revenue: Math.round(unassignedRev), cogs: Math.round(unassignedCogs), opex: Math.round(unassignedOpex), gross_profit: Math.round(unassignedRev - unassignedCogs), net_income: Math.round(unassignedRev - unassignedCogs - unassignedOpex) })
      }

      // Apply IC eliminations
      let totalEliminations = 0
      ;(eliminations || []).forEach((e: any) => {
        const amt = Math.abs(Number(e.amount) || 0)
        if (e.account_type === 'revenue') { consRevenue -= amt; consOpex -= amt } // Revenue and matching expense cancel
        totalEliminations += amt
      })

      const consGP = consRevenue - consCogs; const consNI = consRevenue - consCogs - consOpex

      return new Response(JSON.stringify({
        consolidated: { revenue: Math.round(consRevenue), cogs: Math.round(consCogs), gross_profit: Math.round(consGP), gross_margin: consRevenue > 0 ? Math.round(consGP / consRevenue * 1000) / 10 : 0, opex: Math.round(consOpex), net_income: Math.round(consNI), net_margin: consRevenue > 0 ? Math.round(consNI / consRevenue * 1000) / 10 : 0 },
        entities: entityBreakdown, entity_count: (entities || []).length,
        eliminations: { total: totalEliminations, count: (eliminations || []).length },
        summary: { revenue: fmt(consRevenue), net_income: fmt(consNI), margin: (consRevenue > 0 ? (consNI / consRevenue * 100).toFixed(1) : '0') + '%', entities: (entities || []).length + ' entities', ic_eliminations: fmt(totalEliminations) },
      }), { headers })
    }

    // === ADD ELIMINATION ===
    if (action === 'add_elimination') {
      const { from_entity_id, to_entity_id, account_type, amount, period, description } = body
      if (!from_entity_id || !to_entity_id || !amount) return new Response(JSON.stringify({ error: 'from_entity_id, to_entity_id, and amount required' }), { status: 400, headers })
      const { data: elim } = await sb.from('ic_eliminations').insert({ org_id: targetOrgId, from_entity_id, to_entity_id, account_type: account_type || 'revenue', amount: Number(amount), period: period || new Date().toISOString().substring(0, 7), description, status: 'pending' }).select('id').single()
      return new Response(JSON.stringify({ status: 'created', elimination_id: elim?.id }), { headers })
    }

    // === ELIMINATION REPORT ===
    if (action === 'elimination_report') {
      let query = sb.from('ic_eliminations').select('id, from_entity_id, to_entity_id, account_type, amount, period, description, status, entities!ic_eliminations_from_entity_id_fkey(name)').eq('org_id', targetOrgId)
      if (body.period) query = query.eq('period', body.period)
      const { data: elims } = await query.order('created_at', { ascending: false })
      return new Response(JSON.stringify({ eliminations: elims || [], total: (elims || []).reduce((s: number, e: any) => s + Math.abs(Number(e.amount) || 0), 0) }), { headers })
    }

    return new Response(JSON.stringify({ error: 'Unknown action. Use: list_entities, create_entity, entity_pnl, consolidate, add_elimination, elimination_report' }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed' }), { status: 500, headers })
  }
})
