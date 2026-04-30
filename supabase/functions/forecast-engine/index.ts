import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const AO = [
  'https://castford.com',
  'https://www.castford.com',
  'https://castford.vercel.app',
  'http://localhost:3000',
]
/* Vercel preview URLs from the castford project:
   - castford-<hash>-malikfrazier35s-projects.vercel.app (per-deploy aliases)
   - castford-git-<branch>-malikfrazier35s-projects.vercel.app (git branch aliases) */
const PREVIEW_RE = /^https:\/\/castford(?:-[a-z0-9-]+)?-malikfrazier35s-projects\.vercel\.app$/

function allowedOrigin(origin: string): string {
  if (!origin) return AO[0]
  if (AO.includes(origin)) return origin
  if (PREVIEW_RE.test(origin)) return origin
  return AO[0]
}

function cors(req: Request) {
  const o = req.headers.get('origin') || ''
  return {
    'Access-Control-Allow-Origin': allowedOrigin(o),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   forecast-engine v1
   Driver-based forecasting + formula engine over GL.

   Actions:
   - list_drivers       : return all drivers + most-recent values for scenario
   - upsert_driver_value: write a manual driver_value (period, scenario)
   - run_forecast       : evaluate all drivers for N periods, write outputs
   - get_forecast_run   : return a forecast_run + its outputs

   Formula DSL (v1):  +  -  *  /  ( )  and  {D:driver_key}
   Example:           {D:revenue_total} * {D:hosting_pct_revenue} / 100
   ────────────────────────────────────────────────────────────────────────── */

interface Driver {
  id: string
  org_id: string
  key: string
  name: string
  category: string
  unit: string
  source_type: 'manual' | 'formula' | 'gl_actual' | 'workforce'
  formula: string | null
  feeds_account_id: string | null
  default_value: number | null
  display_order: number
  is_active: boolean
}

/* ─── Period helpers ───────────────────────────────────────────────────── */
function currentPeriod(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
function nextPeriod(p: string): string {
  const [y, m] = p.split('-').map(Number)
  const nm = m === 12 ? 1 : m + 1
  const ny = m === 12 ? y + 1 : y
  return `${ny}-${String(nm).padStart(2, '0')}`
}
function generatePeriods(startPeriod: string, count: number): string[] {
  const [y, m] = startPeriod.split('-').map(Number)
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const total = m - 1 + i
    const year = y + Math.floor(total / 12)
    const month = (total % 12) + 1
    out.push(`${year}-${String(month).padStart(2, '0')}`)
  }
  return out
}

/* ─── Formula DSL ──────────────────────────────────────────────────────── */
function extractRefs(formula: string): string[] {
  const re = /\{D:([a-z_0-9]+)\}/g
  const refs: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(formula)) !== null) refs.push(m[1])
  return refs
}

function substituteFormula(formula: string, vars: Record<string, number>): string {
  return formula.replace(/\{D:([a-z_0-9]+)\}/g, (_, k) => {
    const v = vars[k]
    if (v === undefined) throw new Error(`unresolved driver reference: ${k}`)
    return String(v)
  })
}

/* Recursive-descent arithmetic evaluator: + - * /, parens, unary minus.
   No identifiers allowed at this stage — substituteFormula() must run first. */
function evalArith(expr: string): number {
  let i = 0
  const s = expr

  function skipWs() { while (i < s.length && (s[i] === ' ' || s[i] === '\t')) i++ }
  function peek(): string { skipWs(); return s[i] }
  function eat(c: string): boolean { skipWs(); if (s[i] === c) { i++; return true } return false }

  function parseNum(): number {
    skipWs()
    const start = i
    if (s[i] === '+' || s[i] === '-') i++
    while (i < s.length && (s[i] === '.' || (s[i] >= '0' && s[i] <= '9'))) i++
    if (start === i) throw new Error(`expected number at pos ${i} in: ${expr}`)
    return Number(s.slice(start, i))
  }

  function parsePrimary(): number {
    if (eat('(')) {
      const v = parseExpr()
      if (!eat(')')) throw new Error(`expected ) in: ${expr}`)
      return v
    }
    return parseNum()
  }

  function parseTerm(): number {
    let lhs = parsePrimary()
    while (true) {
      const c = peek()
      if (c === '*') { i++; const rhs = parsePrimary(); lhs = lhs * rhs }
      else if (c === '/') { i++; const rhs = parsePrimary(); lhs = rhs === 0 ? 0 : lhs / rhs }
      else break
    }
    return lhs
  }

  function parseExpr(): number {
    let lhs = parseTerm()
    while (true) {
      const c = peek()
      if (c === '+') { i++; const rhs = parseTerm(); lhs = lhs + rhs }
      else if (c === '-') { i++; const rhs = parseTerm(); lhs = lhs - rhs }
      else break
    }
    return lhs
  }

  const result = parseExpr()
  skipWs()
  if (i !== s.length) throw new Error(`unexpected trailing input at pos ${i}: ${expr}`)
  return result
}

function evaluateExpression(formula: string, vars: Record<string, number>): { value: number; substituted: string } {
  const substituted = substituteFormula(formula, vars)
  const value = evalArith(substituted)
  return { value, substituted }
}

/* Topological sort by formula dependencies. Cycle detection. */
function topoSort(drivers: Driver[]): Driver[] {
  const byKey: Record<string, Driver> = {}
  drivers.forEach((d) => (byKey[d.key] = d))
  const visited = new Set<string>()
  const stack = new Set<string>()
  const out: Driver[] = []
  function visit(d: Driver) {
    if (visited.has(d.key)) return
    if (stack.has(d.key)) throw new Error(`circular driver dependency: ${d.key}`)
    stack.add(d.key)
    if (d.formula) {
      for (const ref of extractRefs(d.formula)) {
        const dep = byKey[ref]
        if (dep) visit(dep)
      }
    }
    stack.delete(d.key)
    visited.add(d.key)
    out.push(d)
  }
  for (const d of drivers) visit(d)
  return out
}

/* ─── Auth helper ──────────────────────────────────────────────────────── */
async function authenticate(req: Request): Promise<{ userId: string; orgId: string } | { error: string; status: number }> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return { error: 'unauthorized', status: 401 }
  const { data: { user }, error: ae } = await sb.auth.getUser(authHeader.replace('Bearer ', ''))
  if (ae || !user) return { error: 'invalid_token', status: 401 }
  const { data: profile } = await sb.from('users').select('org_id').eq('id', user.id).maybeSingle()
  if (!profile?.org_id) return { error: 'no_org', status: 404 }
  return { userId: user.id, orgId: profile.org_id }
}

async function requirePermission(userId: string, orgId: string, level: 'viewer' | 'editor' | 'admin' | 'owner'): Promise<boolean> {
  const { data, error } = await sb.rpc('user_has_org_permission', { p_user_id: userId, p_org_id: orgId, p_required_level: level })
  if (error) return false
  return Boolean(data)
}

/* ─── Action: list_drivers ─────────────────────────────────────────────── */
async function listDrivers(orgId: string, body: any) {
  const scenarioId: string | null = body.scenario_id || null
  const period: string = body.period || currentPeriod()

  const { data: drivers } = await sb.from('drivers').select('*').eq('org_id', orgId).eq('is_active', true).order('display_order')

  // Pull values for the current period across base + optional scenario
  let valuesQuery = sb.from('driver_values').select('driver_id, scenario_id, period, value, source').eq('org_id', orgId).eq('period', period)
  const { data: values } = await valuesQuery

  const baseValues: Record<string, { value: number; source: string }> = {}
  const scenarioValues: Record<string, { value: number; source: string }> = {}
  for (const v of values || []) {
    if (v.scenario_id === null) baseValues[v.driver_id] = { value: Number(v.value), source: v.source }
    else if (v.scenario_id === scenarioId) scenarioValues[v.driver_id] = { value: Number(v.value), source: v.source }
  }

  return {
    period,
    scenario_id: scenarioId,
    drivers: (drivers || []).map((d) => ({
      ...d,
      base_value: baseValues[d.id]?.value ?? null,
      scenario_value: scenarioValues[d.id]?.value ?? null,
      effective_value: scenarioValues[d.id]?.value ?? baseValues[d.id]?.value ?? Number(d.default_value ?? 0),
      formula_refs: d.formula ? extractRefs(d.formula) : [],
    })),
  }
}

/* ─── Action: upsert_driver_value ──────────────────────────────────────── */
async function upsertDriverValue(orgId: string, body: any) {
  const { driver_id, period, value, scenario_id = null, notes = null } = body
  if (!driver_id || !period || value === undefined) throw new Error('driver_id, period, value required')

  // Confirm driver belongs to org
  const { data: drv } = await sb.from('drivers').select('id, key, source_type').eq('org_id', orgId).eq('id', driver_id).maybeSingle()
  if (!drv) throw new Error('driver not found in this org')
  if (drv.source_type !== 'manual') throw new Error(`cannot set value on ${drv.source_type} driver — only manual drivers accept values`)

  // Look up existing row honoring NULL scenario_id semantics
  const lookup = sb.from('driver_values').select('id').eq('org_id', orgId).eq('driver_id', driver_id).eq('period', period)
  const { data: existing } = scenario_id === null
    ? await lookup.is('scenario_id', null).maybeSingle()
    : await lookup.eq('scenario_id', scenario_id).maybeSingle()

  if (existing) {
    const { data: updated } = await sb.from('driver_values').update({ value: Number(value), notes, updated_at: new Date().toISOString() }).eq('id', existing.id).select('*').single()
    return { status: 'updated', driver_value: updated }
  } else {
    const { data: inserted } = await sb.from('driver_values').insert({
      org_id: orgId, driver_id, scenario_id, period, value: Number(value), source: 'manual', notes,
    }).select('*').single()
    return { status: 'inserted', driver_value: inserted }
  }
}

/* ─── Action: run_forecast ─────────────────────────────────────────────── */
async function runForecast(orgId: string, userId: string, body: any) {
  const t0 = Date.now()
  const scenarioId: string | null = body.scenario_id || null
  const periodsCount: number = Math.min(Number(body.periods || 12), 36)
  const startPeriod: string = body.period_start || nextPeriod(currentPeriod())
  const periods = generatePeriods(startPeriod, periodsCount)
  const runName: string = body.name || `Forecast ${new Date().toISOString().slice(0, 19)}`

  // Create forecast_runs row in 'running' state
  const { data: run, error: runErr } = await sb.from('forecast_runs').insert({
    org_id: orgId, scenario_id: scenarioId, user_id: userId, name: runName,
    period_start: periods[0], period_end: periods[periods.length - 1],
    periods_count: periodsCount, status: 'running',
  }).select('id').single()
  if (runErr || !run) throw new Error(`failed to create forecast_run: ${runErr?.message}`)
  const runId = run.id

  try {
    // Load drivers
    const { data: drvRows } = await sb.from('drivers').select('*').eq('org_id', orgId).eq('is_active', true).order('display_order')
    if (!drvRows?.length) throw new Error('no active drivers — seed default drivers first')
    const drivers: Driver[] = drvRows as Driver[]
    const sorted = topoSort(drivers)

    // Load all driver_values relevant for this run (base + this scenario)
    let dvQuery = sb.from('driver_values').select('driver_id, scenario_id, period, value').eq('org_id', orgId).in('period', periods)
    const { data: dvRows } = await dvQuery
    // [driverId][period] = value (scenario-specific overrides base)
    const overrides: Record<string, Record<string, number>> = {}
    const baseVals: Record<string, Record<string, number>> = {}
    for (const v of dvRows || []) {
      const target = v.scenario_id ? overrides : baseVals
      if (v.scenario_id && v.scenario_id !== scenarioId) continue // ignore other scenarios
      target[v.driver_id] = target[v.driver_id] || {}
      target[v.driver_id][v.period] = Number(v.value)
    }

    function resolveManualValue(d: Driver, period: string): number {
      if (overrides[d.id]?.[period] !== undefined) return overrides[d.id][period]
      if (baseVals[d.id]?.[period] !== undefined) return baseVals[d.id][period]
      return Number(d.default_value ?? 0)
    }

    // Walk periods, evaluate, accumulate outputs
    const outputs: any[] = []
    for (const period of periods) {
      const vars: Record<string, number> = {}

      for (const d of sorted) {
        let value = 0
        let formulaEvaluated: string | null = null
        const sourceDrivers: Record<string, number> = {}

        if (d.source_type === 'manual') {
          value = resolveManualValue(d, period)
        } else if (d.source_type === 'formula') {
          if (!d.formula) throw new Error(`formula driver "${d.key}" has no formula`)
          const refs = extractRefs(d.formula)
          for (const r of refs) sourceDrivers[r] = vars[r] ?? 0
          const ev = evaluateExpression(d.formula, vars)
          value = ev.value
          formulaEvaluated = ev.substituted
        } else {
          // gl_actual / workforce: deferred to v2
          value = 0
        }

        vars[d.key] = value

        outputs.push({
          org_id: orgId, forecast_run_id: runId,
          driver_id: d.id, account_id: null, period,
          amount: value, output_type: 'driver',
          formula_evaluated: formulaEvaluated,
          source_drivers: sourceDrivers,
        })

        if (d.feeds_account_id) {
          outputs.push({
            org_id: orgId, forecast_run_id: runId,
            driver_id: d.id, account_id: d.feeds_account_id, period,
            amount: value, output_type: 'account',
            formula_evaluated: null, source_drivers: {},
          })
        }
      }
    }

    // Bulk insert in chunks (Supabase has a payload-size cap)
    const chunkSize = 500
    for (let i = 0; i < outputs.length; i += chunkSize) {
      const chunk = outputs.slice(i, i + chunkSize)
      const { error: insErr } = await sb.from('forecast_outputs').insert(chunk)
      if (insErr) throw new Error(`forecast_outputs insert failed: ${insErr.message}`)
    }

    const duration = Date.now() - t0
    await sb.from('forecast_runs').update({
      status: 'completed', completed_at: new Date().toISOString(),
      drivers_evaluated: sorted.length, outputs_count: outputs.length, duration_ms: duration,
    }).eq('id', runId)

    try { await sb.from('audit_log').insert({
      user_id: userId, org_id: orgId, action: 'forecast.run_completed', resource_type: 'forecast_run',
      resource_id: runId, metadata: { scenario_id: scenarioId, periods: periodsCount, drivers: sorted.length, outputs: outputs.length, duration_ms: duration },
    }) } catch {}

    return {
      run_id: runId,
      status: 'completed',
      periods_count: periodsCount,
      period_start: periods[0],
      period_end: periods[periods.length - 1],
      drivers_evaluated: sorted.length,
      outputs_written: outputs.length,
      duration_ms: duration,
    }
  } catch (err: any) {
    await sb.from('forecast_runs').update({ status: 'failed', error_message: err?.message || 'unknown' }).eq('id', runId)
    throw err
  }
}

/* ─── Action: get_forecast_run ─────────────────────────────────────────── */
async function getForecastRun(orgId: string, body: any) {
  let runId: string | null = body.run_id || null

  // If no run_id: return latest completed run for the scenario
  if (!runId) {
    let q = sb.from('forecast_runs').select('id').eq('org_id', orgId).eq('status', 'completed').order('created_at', { ascending: false }).limit(1)
    if (body.scenario_id !== undefined) {
      if (body.scenario_id === null) q = q.is('scenario_id', null)
      else q = q.eq('scenario_id', body.scenario_id)
    }
    const { data: latest } = await q.maybeSingle()
    if (!latest) return { error: 'no_completed_runs' }
    runId = latest.id
  }

  const { data: run } = await sb.from('forecast_runs').select('*').eq('org_id', orgId).eq('id', runId).maybeSingle()
  if (!run) return { error: 'run_not_found' }

  const { data: outputs } = await sb.from('forecast_outputs')
    .select('id, driver_id, account_id, period, amount, output_type, formula_evaluated, source_drivers, drivers(key, name, unit, category, display_order), gl_accounts(name, account_type)')
    .eq('forecast_run_id', runId).eq('org_id', orgId)
    .order('period').order('output_type')

  // Pivot: by_driver { key: { period: amount } }, by_account { name: { period: amount } }
  const byDriver: Record<string, Record<string, number>> = {}
  const byAccount: Record<string, Record<string, number>> = {}
  for (const o of outputs || []) {
    if (o.output_type === 'driver' && o.drivers) {
      const key = (o.drivers as any).key
      byDriver[key] = byDriver[key] || {}
      byDriver[key][o.period] = Number(o.amount)
    } else if (o.output_type === 'account' && o.gl_accounts) {
      const name = (o.gl_accounts as any).name
      byAccount[name] = byAccount[name] || {}
      byAccount[name][o.period] = Number(o.amount)
    }
  }

  return { run, by_driver: byDriver, by_account: byAccount, outputs_count: outputs?.length || 0 }
}

/* ─── HTTP entrypoint ──────────────────────────────────────────────────── */
Deno.serve(async (req: Request) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers })

  const auth = await authenticate(req)
  if ('error' in auth) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status, headers })
  const { userId, orgId } = auth

  try {
    const body = await req.json().catch(() => ({}))
    const action = body.action || 'list_drivers'

    if (action === 'list_drivers') {
      const out = await listDrivers(orgId, body)
      return new Response(JSON.stringify(out), { headers })
    }

    if (action === 'upsert_driver_value') {
      if (!(await requirePermission(userId, orgId, 'editor'))) return new Response(JSON.stringify({ error: 'forbidden_editor_required' }), { status: 403, headers })
      const out = await upsertDriverValue(orgId, body)
      return new Response(JSON.stringify(out), { headers })
    }

    if (action === 'run_forecast') {
      if (!(await requirePermission(userId, orgId, 'editor'))) return new Response(JSON.stringify({ error: 'forbidden_editor_required' }), { status: 403, headers })
      const out = await runForecast(orgId, userId, body)
      return new Response(JSON.stringify(out), { headers })
    }

    if (action === 'get_forecast_run') {
      const out = await getForecastRun(orgId, body)
      return new Response(JSON.stringify(out), { headers })
    }

    return new Response(JSON.stringify({ error: 'unknown_action', valid: ['list_drivers', 'upsert_driver_value', 'run_forecast', 'get_forecast_run'] }), { status: 400, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'forecast_engine_failed' }), { status: 500, headers })
  }
})
