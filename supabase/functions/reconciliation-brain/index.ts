import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000'];
function cors(req: Request) {
  const o = req.headers.get('origin') || '';
  return { 'Access-Control-Allow-Origin': AO.includes(o) ? o : AO[0], 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey', 'Content-Type': 'application/json' };
}

function fmt(v: number): string {
  if (v === 0) return '\u2014';
  const abs = Math.abs(v);
  const str = abs >= 1e6 ? '$' + (abs / 1e6).toFixed(1) + 'M' : abs >= 1e3 ? '$' + Math.round(abs / 1e3).toLocaleString() + 'K' : '$' + abs.toFixed(2);
  return v < 0 ? '(' + str + ')' : str;
}

Deno.serve(async (req: Request) => {
  const headers = cors(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers });

  const ah = req.headers.get('authorization') || '';
  const token = ah.replace('Bearer ', '');
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers });

  const { data: profile } = await supabase.from('users').select('org_id, role').eq('id', user.id).maybeSingle();
  if (!profile?.org_id) return new Response(JSON.stringify({ error: 'No organization' }), { status: 400, headers });
  const orgId = profile.org_id;

  try {
    const body = await req.json();
    const { action, period, account_id, tolerance } = body;
    const matchTolerance = tolerance || 0.01; // Default: 1 cent

    // === ACTION: STATUS — overall reconciliation status for a period ===
    if (action === 'status') {
      const targetPeriod = period || new Date().toISOString().slice(0, 7);

      // Get all transactions for the period
      const { data: txns } = await supabase.from('gl_transactions')
        .select('id, amount, period, description, provider, gl_accounts!inner(name, account_type)')
        .eq('org_id', orgId)
        .eq('period', targetPeriod);

      if (!txns || txns.length === 0) {
        return new Response(JSON.stringify({ success: true, status: 'no_data', period: targetPeriod, message: 'No transactions found for this period.' }), { status: 200, headers });
      }

      // Group by provider
      const byProvider: Record<string, { count: number; total: number }> = {};
      for (const t of txns) {
        const p = t.provider || 'manual';
        if (!byProvider[p]) byProvider[p] = { count: 0, total: 0 };
        byProvider[p].count++;
        byProvider[p].total += t.amount;
      }

      // Group by account type
      const byType: Record<string, number> = {};
      for (const t of txns) {
        const type = (t as any).gl_accounts.account_type;
        byType[type] = (byType[type] || 0) + t.amount;
      }

      // Trial balance check
      const totalDebits = txns.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
      const totalCredits = txns.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
      const imbalance = Math.abs(totalDebits - totalCredits);
      const isBalanced = imbalance < matchTolerance;

      // Find potential duplicates (same amount + same account in same period)
      const seen = new Map<string, any[]>();
      const duplicates: any[] = [];
      for (const t of txns) {
        const key = `${(t as any).gl_accounts.name}:${t.amount.toFixed(2)}`;
        if (!seen.has(key)) seen.set(key, []);
        seen.get(key)!.push(t);
      }
      for (const [key, group] of seen) {
        if (group.length > 1) {
          duplicates.push({ key, count: group.length, amount: group[0].amount, transactions: group.map(t => t.id) });
        }
      }

      // Find unmatched items (single-source transactions with no corresponding entry)
      const unmatchedItems: any[] = [];
      const amounts = new Map<number, any[]>();
      for (const t of txns) {
        const absAmt = Math.round(Math.abs(t.amount) * 100);
        if (!amounts.has(absAmt)) amounts.set(absAmt, []);
        amounts.get(absAmt)!.push(t);
      }
      for (const [absAmt, group] of amounts) {
        // Check if there's a matching debit+credit pair
        const debits = group.filter(t => t.amount > 0);
        const credits = group.filter(t => t.amount < 0);
        if (debits.length > 0 && credits.length === 0) {
          for (const d of debits) unmatchedItems.push({ id: d.id, amount: d.amount, account: (d as any).gl_accounts.name, type: 'unmatched_debit' });
        }
        if (credits.length > 0 && debits.length === 0) {
          for (const c of credits) unmatchedItems.push({ id: c.id, amount: c.amount, account: (c as any).gl_accounts.name, type: 'unmatched_credit' });
        }
      }

      const totalTxns = txns.length;
      const matchedCount = totalTxns - unmatchedItems.length;
      const matchRate = totalTxns > 0 ? (matchedCount / totalTxns) * 100 : 0;

      // Overall status
      let reconciliationStatus = 'complete';
      if (!isBalanced) reconciliationStatus = 'imbalanced';
      else if (duplicates.length > 0) reconciliationStatus = 'duplicates_found';
      else if (unmatchedItems.length > 5) reconciliationStatus = 'needs_review';
      else if (unmatchedItems.length > 0) reconciliationStatus = 'minor_issues';

      return new Response(JSON.stringify({
        success: true,
        period: targetPeriod,
        status: reconciliationStatus,
        summary: {
          total_transactions: totalTxns,
          matched: matchedCount,
          unmatched: unmatchedItems.length,
          match_rate: Math.round(matchRate * 10) / 10,
          match_rate_formatted: matchRate.toFixed(1) + '%',
          total_debits: totalDebits,
          total_debits_formatted: fmt(totalDebits),
          total_credits: totalCredits,
          total_credits_formatted: fmt(totalCredits),
          imbalance: imbalance,
          imbalance_formatted: fmt(imbalance),
          is_balanced: isBalanced,
          duplicate_groups: duplicates.length,
          providers: Object.entries(byProvider).map(([name, data]) => ({ provider: name, count: data.count, total: fmt(data.total) })),
          by_account_type: Object.entries(byType).map(([type, total]) => ({ type, total: fmt(total) })),
        },
        duplicates: duplicates.slice(0, 10),
        unmatched: unmatchedItems.slice(0, 20),
      }), { status: 200, headers });
    }

    // === ACTION: MATCH — auto-match transactions between two providers ===
    if (action === 'match') {
      const targetPeriod = period || new Date().toISOString().slice(0, 7);

      const { data: txns } = await supabase.from('gl_transactions')
        .select('id, amount, period, description, provider, txn_date, gl_accounts!inner(name)')
        .eq('org_id', orgId)
        .eq('period', targetPeriod);

      if (!txns || txns.length === 0) {
        return new Response(JSON.stringify({ success: true, matches: [], message: 'No transactions to match.' }), { status: 200, headers });
      }

      // Match by amount (within tolerance) + similar date
      const matched: any[] = [];
      const used = new Set<string>();

      for (let i = 0; i < txns.length; i++) {
        if (used.has(txns[i].id)) continue;
        for (let j = i + 1; j < txns.length; j++) {
          if (used.has(txns[j].id)) continue;
          // Matching criteria: amounts are equal and opposite (debit matches credit)
          const diff = Math.abs(txns[i].amount + txns[j].amount);
          if (diff <= matchTolerance && txns[i].provider !== txns[j].provider) {
            matched.push({
              txn_a: { id: txns[i].id, amount: txns[i].amount, provider: txns[i].provider, account: (txns[i] as any).gl_accounts.name, description: txns[i].description },
              txn_b: { id: txns[j].id, amount: txns[j].amount, provider: txns[j].provider, account: (txns[j] as any).gl_accounts.name, description: txns[j].description },
              difference: diff,
              confidence: diff === 0 ? 'exact' : 'approximate',
            });
            used.add(txns[i].id);
            used.add(txns[j].id);
            break;
          }
        }
      }

      return new Response(JSON.stringify({
        success: true,
        period: targetPeriod,
        total_transactions: txns.length,
        matched_pairs: matched.length,
        unmatched_remaining: txns.length - (matched.length * 2),
        matches: matched.slice(0, 50),
      }), { status: 200, headers });
    }

    // === ACTION: CLOSE_CHECK — month-end close readiness assessment ===
    if (action === 'close_check') {
      const targetPeriod = period || new Date().toISOString().slice(0, 7);

      const { data: txns } = await supabase.from('gl_transactions')
        .select('id, amount, period, provider')
        .eq('org_id', orgId)
        .eq('period', targetPeriod);

      const { data: budgets } = await supabase.from('gl_budgets')
        .select('id')
        .eq('org_id', orgId)
        .eq('period', targetPeriod);

      const { data: alerts } = await supabase.from('financial_alerts')
        .select('id, severity')
        .eq('org_id', orgId)
        .eq('resolved', false);

      const totalTxns = txns?.length || 0;
      const totalBudgets = budgets?.length || 0;
      const unresolvedAlerts = alerts?.length || 0;
      const criticalAlerts = alerts?.filter(a => a.severity === 'critical').length || 0;

      // Trial balance
      const debits = txns?.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0) || 0;
      const credits = txns?.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0) || 0;
      const balanced = Math.abs(debits - credits) < 0.01;

      const checks = [
        { name: 'Transactions recorded', passed: totalTxns > 0, detail: `${totalTxns} transactions in ${targetPeriod}` },
        { name: 'Trial balance', passed: balanced, detail: balanced ? 'Debits equal credits' : `Imbalance of ${fmt(Math.abs(debits - credits))}` },
        { name: 'Budgets entered', passed: totalBudgets > 0, detail: `${totalBudgets} budget entries` },
        { name: 'No critical alerts', passed: criticalAlerts === 0, detail: criticalAlerts > 0 ? `${criticalAlerts} critical alerts unresolved` : 'All clear' },
        { name: 'Alerts reviewed', passed: unresolvedAlerts <= 2, detail: `${unresolvedAlerts} unresolved alerts` },
        { name: 'Multi-source data', passed: new Set(txns?.map(t => t.provider) || []).size > 1, detail: 'Data from multiple providers reduces error risk' },
      ];

      const passed = checks.filter(c => c.passed).length;
      const total = checks.length;
      const readiness = Math.round((passed / total) * 100);

      return new Response(JSON.stringify({
        success: true,
        period: targetPeriod,
        readiness_score: readiness,
        readiness_formatted: readiness + '%',
        grade: readiness >= 90 ? 'A' : readiness >= 75 ? 'B' : readiness >= 60 ? 'C' : readiness >= 40 ? 'D' : 'F',
        checks_passed: passed,
        checks_total: total,
        checks,
        recommendation: readiness >= 90 ? 'Ready to close. All checks passed.' : readiness >= 75 ? 'Minor issues to resolve before closing.' : 'Several items need attention before month-end close.',
      }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use: status, match, or close_check' }), { status: 400, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Reconciliation failed' }), { status: 500, headers });
  }
});
