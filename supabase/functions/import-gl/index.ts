import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ========== CORS ==========
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000'];
function cors(req: Request) {
  const o = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': AO.includes(o) ? o : AO[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    'Content-Type': 'application/json'
  };
}

// ========== STAGE 2: PARSE CSV ==========
function detectDelimiter(text: string): string {
  const firstLines = text.split(/\r?\n/).slice(0, 5).join('\n');
  const commas = (firstLines.match(/,/g) || []).length;
  const semicolons = (firstLines.match(/;/g) || []).length;
  const tabs = (firstLines.match(/\t/g) || []).length;
  const pipes = (firstLines.match(/\|/g) || []).length;
  const max = Math.max(commas, semicolons, tabs, pipes);
  if (max === 0) return ',';
  if (max === tabs) return '\t';
  if (max === semicolons) return ';';
  if (max === pipes) return '|';
  return ',';
}

function parseCSV(text: string, delimiter = ','): string[][] {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.trim());
  return lines.map(line => {
    const row: string[] = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === delimiter && !inQ) { row.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    row.push(cur.trim());
    return row;
  });
}

// ========== STAGE 4: FUZZY COLUMN MAPPING ==========
const COLUMN_ALIASES: Record<string, string[]> = {
  date: ['date','trans date','transaction date','txn date','posting date','gl date','datum','fecha','data'],
  amount: ['amount','net amount','total','balance','value','net','betrag','importe','valor'],
  debit: ['debit','dr','debit amount','debit balance'],
  credit: ['credit','cr','credit amount','credit balance'],
  account_name: ['account','account name','gl account','acct','category','account title','konto','cuenta','line item','name'],
  account_number: ['account number','account code','code','number','acct no','acct num','a/c'],
  account_type: ['type','account type','acct type','class','category type','classification'],
  description: ['memo','description','desc','narration','particulars','notes','detail','comment','reference description'],
  reference: ['ref','reference','ref #','doc #','invoice #','check #','trans #','num','voucher','document'],
  period: ['period','month','year month','fiscal period','reporting period'],
  department: ['department','dept','cost center','cost centre','segment','division','business unit'],
  entity: ['entity','company','subsidiary','legal entity','org','organization']
};

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({length: m+1}, (_, i) => {
    const row = new Array(n+1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return dp[m][n];
}

function fuzzyMatchColumns(headers: string[]): Record<string, {index: number, confidence: number, method: string}> {
  const result: Record<string, {index: number, confidence: number, method: string}> = {};
  const normalized = headers.map(h => h.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim());
  const used = new Set<number>();

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    let bestIdx = -1, bestScore = 0, bestMethod = '';
    for (let i = 0; i < normalized.length; i++) {
      if (used.has(i)) continue;
      const h = normalized[i];
      // Exact match
      if (aliases.includes(h)) {
        if (98 > bestScore) { bestIdx = i; bestScore = 98; bestMethod = 'exact'; }
        continue;
      }
      // Keyword contains
      for (const alias of aliases) {
        if (h.includes(alias) || alias.includes(h)) {
          const score = 85 + Math.min(10, 10 - Math.abs(h.length - alias.length));
          if (score > bestScore) { bestIdx = i; bestScore = score; bestMethod = 'keyword'; }
        }
      }
      // Levenshtein distance
      for (const alias of aliases) {
        const dist = levenshtein(h, alias);
        const maxLen = Math.max(h.length, alias.length);
        const score = Math.round((1 - dist / maxLen) * 100);
        if (score > 65 && score > bestScore) { bestIdx = i; bestScore = score; bestMethod = 'levenshtein'; }
      }
    }
    if (bestIdx >= 0 && bestScore >= 60) {
      result[field] = { index: bestIdx, confidence: bestScore, method: bestMethod };
      used.add(bestIdx);
    }
  }
  return result;
}

// ========== STAGE 5: NORMALIZE VALUES ==========
function parseDate(raw: string): string | null {
  if (!raw || !raw.trim()) return null;
  const s = raw.trim();
  // ISO: 2026-04-15 or 2026-04-15T00:00:00Z
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  // US: 04/15/2026 or 04-15-2026
  const us = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (us) {
    const [, m, d, y] = us;
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  // Named: Apr 15, 2026 or April 15 2026
  const named = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (named) {
    const months: Record<string,string> = {jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12',january:'01',february:'02',march:'03',april:'04',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12'};
    const mo = months[named[1].toLowerCase()];
    if (mo) return `${named[3]}-${mo}-${named[2].padStart(2,'0')}`;
  }
  // Excel serial date (5-digit number)
  const num = parseFloat(s);
  if (!isNaN(num) && num > 25000 && num < 60000) {
    const epoch = new Date((num - 25569) * 86400 * 1000);
    return epoch.toISOString().slice(0, 10);
  }
  // Month name only: "January 2026" or "Jan 2026"
  const monthYear = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const months: Record<string,string> = {jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12',january:'01',february:'02',march:'03',april:'04',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12'};
    const mo = months[monthYear[1].toLowerCase()];
    if (mo) return `${monthYear[2]}-${mo}-15`;
  }
  // Fallback: try Date constructor
  try {
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch {}
  return null;
}

function parseAmount(raw: string): number {
  if (!raw || !raw.trim()) return 0;
  let s = raw.trim();
  const isNeg = s.startsWith('(') && s.endsWith(')');
  s = s.replace(/[()]/g, '');
  // European format: 1.234,56 → 1234.56
  if (/^\d{1,3}(\.\d{3})*(,\d{2})$/.test(s)) {
    s = s.replace(/\./g, '').replace(',', '.');
  }
  s = s.replace(/[$€£¥,"\s]/g, '');
  const v = parseFloat(s);
  if (isNaN(v)) return 0;
  return isNeg ? -Math.abs(v) : v;
}

// ========== STAGE 6: ACCOUNT TYPE CLASSIFICATION ==========
function classifyAccountType(name: string): string {
  const n = name.toLowerCase();
  if (/\b(revenue|sales|income|subscription|recurring|mrr|arr|license|usage|fee|commission|service.*revenue|consulting|saas.*revenue|contract.*revenue)\b/.test(n)) return 'revenue';
  if (/\b(cogs|cost.*(?:goods|revenue|sales)|hosting|infrastructure|aws|azure|gcp|cloud|server|data.*center|direct.*(?:cost|labor|material))\b/.test(n)) return 'cost_of_revenue';
  if (/\b(interest.*income|fx.*gain|currency.*gain|investment.*income|dividend.*received|gain.*on.*sale|miscellaneous.*income|other.*income)\b/.test(n)) return 'other_income';
  if (/\b(interest.*expense|fx.*loss|currency.*loss|loss.*on.*disposal|write.*off|bad.*debt|restructuring|one.*time.*charge|other.*expense)\b/.test(n)) return 'other_expense';
  if (/\b(salary|wages|payroll|rent|lease|marketing|travel|insurance|legal|office|software|sbc|stock.*comp|r&d|g&a|s&m|benefits|utilities|depreciation|amortization|professional.*service|employee|headcount|bonus|commission.*expense|advertising|equipment|maintenance|training|recruiting|supplies)\b/.test(n)) return 'expense';
  return 'expense'; // Safe fallback
}

// ========== STAGE 7: DEDUP KEY ==========
function dedupKey(orgId: string, accountId: string, period: string, amount: number, ref: string): string {
  return `${orgId}:${accountId}:${period}:${amount.toFixed(2)}:${ref}`.toLowerCase();
}

// ========== MAIN ==========
Deno.serve(async (req: Request) => {
  const headers = cors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers });

  // Auth
  const ah = req.headers.get('authorization') || '';
  const token = ah.replace('Bearer ', '');
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers });

  const { data: profile } = await supabase.from('users').select('org_id, role').eq('id', user.id).maybeSingle();
  if (!profile?.org_id) return new Response(JSON.stringify({ error: 'No organization' }), { status: 400, headers });
  if (!['owner', 'admin'].includes(profile.role)) return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers });
  const orgId = profile.org_id;

  // Plan-gated file limits
  const { data: org } = await supabase.from('organizations').select('plan').eq('id', orgId).maybeSingle();
  const plan = org?.plan || 'demo';
  const maxRows: Record<string,number> = { demo: 2000, starter: 10000, growth: 50000, business: 250000 };
  const limit = maxRows[plan] || 2000;

  try {
    const body = await req.json();
    const { action, csv_text, column_overrides, default_period } = body;

    if (!csv_text) return new Response(JSON.stringify({ error: 'No CSV data provided' }), { status: 400, headers });

    // STAGE 2: Parse
    const delimiter = detectDelimiter(csv_text);
    const rows = parseCSV(csv_text, delimiter);
    if (rows.length < 2) return new Response(JSON.stringify({ error: 'CSV needs at least a header row and one data row' }), { status: 400, headers });

    const rawHeaders = rows[0];

    // STAGE 4: Fuzzy match columns
    const detected = fuzzyMatchColumns(rawHeaders);
    const mapping = column_overrides ? { ...detected, ...column_overrides } : detected;

    // ========== ACTION: PREVIEW ==========
    if (action === 'preview') {
      // Strip summary rows (rows where amount equals sum of previous rows or contains "total")
      const dataRows = rows.slice(1).filter(r => {
        const firstCell = (r[0] || '').toLowerCase();
        return !firstCell.includes('total') && !firstCell.includes('subtotal') && !firstCell.includes('grand') && r.length > 1;
      });

      return new Response(JSON.stringify({
        success: true,
        delimiter,
        headers: rawHeaders,
        preview: rows.slice(1, 8),
        detected_columns: Object.fromEntries(
          Object.entries(mapping).map(([k, v]) => [k, { column: rawHeaders[typeof v === 'object' ? v.index : v], ...( typeof v === 'object' ? v : { index: v, confidence: 100, method: 'legacy' })}])
        ),
        total_data_rows: dataRows.length,
        max_allowed: limit,
        over_limit: dataRows.length > limit,
        // Required field check
        validation: {
          has_date: !!mapping.date,
          has_amount: !!(mapping.amount || (mapping.debit && mapping.credit)),
          has_account: !!mapping.account_name,
          has_account_type: !!mapping.account_type,
          has_period: !!mapping.period,
          has_department: !!mapping.department,
          has_entity: !!mapping.entity,
          can_import: !!(mapping.account_name && (mapping.amount || (mapping.debit && mapping.credit)))
        }
      }), { status: 200, headers });
    }

    // ========== ACTION: IMPORT ==========
    if (action === 'import') {
      const colIdx = (field: string): number | undefined => {
        const m = mapping[field];
        if (m === undefined) return undefined;
        return typeof m === 'object' ? m.index : m;
      };

      // STAGE 3: Validate required fields
      const accIdx = colIdx('account_name');
      if (accIdx === undefined) return new Response(JSON.stringify({ error: 'No account column detected. Provide column_overrides.' }), { status: 400, headers });
      const hasAmount = colIdx('amount') !== undefined || (colIdx('debit') !== undefined && colIdx('credit') !== undefined);
      if (!hasAmount) return new Response(JSON.stringify({ error: 'No amount column detected (need amount or debit+credit columns).' }), { status: 400, headers });

      const period = default_period || new Date().toISOString().slice(0, 7);

      // Filter out summary/total rows and blank rows
      const dataRows = rows.slice(1).filter(r => {
        if (r.length <= 1) return false;
        const first = (r[0] || '').toLowerCase();
        return !first.includes('total') && !first.includes('subtotal') && !first.includes('grand') && first !== '';
      });

      // Plan-gate row count
      if (dataRows.length > limit) {
        return new Response(JSON.stringify({
          error: `Row limit exceeded. Your ${plan} plan allows ${limit.toLocaleString()} rows. This file has ${dataRows.length.toLocaleString()}. Upgrade to import more.`,
          row_count: dataRows.length,
          limit
        }), { status: 400, headers });
      }

      // Load existing accounts for dedup
      const cache: Record<string, string> = {};
      const { data: existing } = await supabase.from('gl_accounts').select('id, name, external_id').eq('org_id', orgId);
      if (existing) for (const a of existing) {
        cache[a.name.toLowerCase()] = a.id;
        if (a.external_id) cache[a.external_id.toLowerCase()] = a.id;
      }

      // Load existing transactions for dedup
      const existingKeys = new Set<string>();
      const { data: existingTxns } = await supabase.from('gl_transactions').select('account_id, period, amount, description').eq('org_id', orgId).eq('provider', 'csv_upload');
      if (existingTxns) for (const t of existingTxns) {
        existingKeys.add(dedupKey(orgId, t.account_id, t.period, t.amount, t.description || ''));
      }

      let accountsCreated = 0, txnsInserted = 0, txnsDuped = 0, budgetsInserted = 0, rowsSkipped = 0;
      const errors: string[] = [];
      const periodSet = new Set<string>();
      let totalRevenue = 0, totalExpense = 0;

      // Process in batches of 500
      const txnBatch: any[] = [];
      const budgetBatch: any[] = [];

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        try {
          // Extract account name
          const accountName = (row[accIdx] || '').trim();
          if (!accountName) { rowsSkipped++; errors.push(`Row ${i+2}: empty account name`); continue; }

          // Extract account number
          const accNumIdx = colIdx('account_number');
          const accountNumber = accNumIdx !== undefined ? (row[accNumIdx] || '').trim() : '';

          // STAGE 6: Classify account type
          let accountType = 'expense';
          const typeIdx = colIdx('account_type');
          if (typeIdx !== undefined) {
            const rawType = (row[typeIdx] || '').toLowerCase();
            if (rawType.includes('revenue') || rawType.includes('income')) accountType = 'revenue';
            else if (rawType.includes('cost') || rawType.includes('cogs')) accountType = 'cost_of_revenue';
            else if (rawType.includes('other') && rawType.includes('income')) accountType = 'other_income';
            else if (rawType.includes('other') && rawType.includes('expense')) accountType = 'other_expense';
            else if (rawType.includes('asset')) accountType = 'asset';
            else if (rawType.includes('liab')) accountType = 'liability';
            else if (rawType.includes('equity')) accountType = 'equity';
            else accountType = classifyAccountType(accountName);
          } else {
            accountType = classifyAccountType(accountName);
          }

          // STAGE 5: Parse date/period
          let txnPeriod = period;
          let txnDate = period + '-15';
          const dateIdx = colIdx('date');
          const periodIdx = colIdx('period');
          if (dateIdx !== undefined) {
            const parsed = parseDate(row[dateIdx] || '');
            if (parsed) { txnDate = parsed; txnPeriod = parsed.slice(0, 7); }
          } else if (periodIdx !== undefined) {
            const rawP = (row[periodIdx] || '').trim();
            const parsed = parseDate(rawP);
            if (parsed) { txnPeriod = parsed.slice(0, 7); txnDate = txnPeriod + '-15'; }
            else if (/^\d{4}-\d{2}$/.test(rawP)) { txnPeriod = rawP; txnDate = rawP + '-15'; }
          }
          periodSet.add(txnPeriod);

          // STAGE 5: Parse amount
          let amount = 0;
          const debitIdx = colIdx('debit');
          const creditIdx = colIdx('credit');
          const amountIdx = colIdx('amount');
          if (debitIdx !== undefined && creditIdx !== undefined) {
            const db = parseAmount(row[debitIdx] || '0');
            const cr = parseAmount(row[creditIdx] || '0');
            amount = (accountType === 'revenue' || accountType === 'other_income') ? cr - db : db - cr;
          } else if (amountIdx !== undefined) {
            amount = parseAmount(row[amountIdx] || '0');
          }
          if (amount === 0) { rowsSkipped++; continue; }

          // Extract optional fields
          const descIdx = colIdx('description');
          const refIdx = colIdx('reference');
          const deptIdx = colIdx('department');
          const entIdx = colIdx('entity');
          const description = descIdx !== undefined ? (row[descIdx] || '').trim().slice(0, 500) : 'CSV import';
          const reference = refIdx !== undefined ? (row[refIdx] || '').trim() : '';
          const department = deptIdx !== undefined ? (row[deptIdx] || '').trim() : null;
          const entityName = entIdx !== undefined ? (row[entIdx] || '').trim() : null;

          // STAGE 7: Account upsert
          const ck = accountName.toLowerCase();
          let accountId = cache[ck] || (accountNumber ? cache[accountNumber.toLowerCase()] : undefined);
          if (!accountId) {
            const { data: newAcc, error: accErr } = await supabase.from('gl_accounts').insert({
              org_id: orgId, provider: 'csv_upload', name: accountName,
              account_type: accountType, external_id: accountNumber || null, active: true
            }).select('id').single();
            if (accErr) { errors.push(`Row ${i+2}: account create failed — ${accErr.message}`); rowsSkipped++; continue; }
            accountId = newAcc.id;
            cache[ck] = accountId;
            if (accountNumber) cache[accountNumber.toLowerCase()] = accountId;
            accountsCreated++;
          }

          // STAGE 7: Dedup check
          const dk = dedupKey(orgId, accountId, txnPeriod, amount, reference);
          if (existingKeys.has(dk)) { txnsDuped++; continue; }
          existingKeys.add(dk);

          // Track revenue/expense
          if (accountType === 'revenue' || accountType === 'other_income') totalRevenue += Math.abs(amount);
          else totalExpense += Math.abs(amount);

          // Queue transaction
          txnBatch.push({
            org_id: orgId, account_id: accountId, provider: 'csv_upload',
            amount, period: txnPeriod, txn_date: txnDate,
            description: reference ? `${description} [${reference}]` : description
          });

          // Queue budget if present
          const budgetIdx = colIdx('budget');
          if (budgetIdx !== undefined) {
            const ba = parseAmount(row[budgetIdx] || '0');
            if (ba !== 0) budgetBatch.push({ org_id: orgId, account_id: accountId, amount: ba, period: txnPeriod, version: 'v1' });
          }
        } catch (e: any) {
          errors.push(`Row ${i+2}: ${e?.message || 'Unknown error'}`);
          rowsSkipped++;
        }
      }

      // Batch insert transactions
      for (let b = 0; b < txnBatch.length; b += 500) {
        const batch = txnBatch.slice(b, b + 500);
        const { error: batchErr } = await supabase.from('gl_transactions').insert(batch);
        if (batchErr) { errors.push(`Batch ${Math.floor(b/500)+1}: ${batchErr.message}`); }
        else { txnsInserted += batch.length; }
      }

      // Batch insert budgets
      for (let b = 0; b < budgetBatch.length; b += 500) {
        const batch = budgetBatch.slice(b, b + 500);
        const { error: batchErr } = await supabase.from('gl_budgets').insert(batch);
        if (!batchErr) budgetsInserted += batch.length;
      }

      // STAGE 8: Verify
      const periods = Array.from(periodSet).sort();
      const periodCoverage = periods.length > 0 ? `${periods[0]} to ${periods[periods.length - 1]}` : 'N/A';

      // Audit log
      try { await supabase.from('audit_log').insert({
        user_id: user.id, org_id: orgId, action: 'gl.csv_imported_v2', resource_type: 'gl_data',
        metadata: { accounts_created: accountsCreated, transactions: txnsInserted, duplicates_skipped: txnsDuped, budgets: budgetsInserted, rows_skipped: rowsSkipped, total_rows: dataRows.length, errors: errors.length, periods: periods.length, delimiter }
      }); } catch {}

      // Sync log
      try { await supabase.from('sync_log').insert({
        org_id: orgId, provider: 'csv_upload', status: 'success',
        records_synced: txnsInserted + budgetsInserted,
        completed_at: new Date().toISOString(),
        metadata: { version: 'v2', accounts_created: accountsCreated, transactions: txnsInserted, budgets: budgetsInserted, duplicates: txnsDuped }
      }); } catch {}

      return new Response(JSON.stringify({
        success: true,
        version: 'v2',
        summary: {
          total_rows: dataRows.length,
          accounts_created: accountsCreated,
          transactions_inserted: txnsInserted,
          duplicates_skipped: txnsDuped,
          budgets_inserted: budgetsInserted,
          rows_skipped: rowsSkipped,
          errors_count: errors.length,
          error_details: errors.slice(0, 20),
          period_coverage: periodCoverage,
          periods_count: periods.length,
          total_revenue: Math.round(totalRevenue * 100) / 100,
          total_expense: Math.round(totalExpense * 100) / 100,
          delimiter_detected: delimiter === '\t' ? 'tab' : delimiter,
          trial_balance: Math.abs(totalRevenue - totalExpense) < 0.01 ? 'balanced' : `revenue ${totalRevenue > totalExpense ? '>' : '<'} expense by $${Math.abs(totalRevenue - totalExpense).toLocaleString()}`
        }
      }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use: preview or import' }), { status: 400, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Import failed' }), { status: 500, headers });
  }
});
