/* Castford Dashboard Data Layer v1.1
   Bi-directional enterprise data module for all dashboard pages.
   READ: Pull real GL data from Supabase (accounts, transactions, budgets, P&L)
   WRITE: Create/update budgets, log transactions, update forecasts
   DEMO: Auto-detects when no real data exists and shows demo badge

   v1.1 changes (Phase 2B-1):
     - Added getPnlSummary(opts) to query pre-computed pl_summary view
     - Added formatCurrency helper for consistent rendering across pages
     - Added getCurrentPeriodRange helper (FY YTD calculation)

   Usage: <script src="/site/dashboard-data.js"></script>
   Then: const cd = await CastfordData.init();
         const pnl = await cd.getPnlSummary({ startPeriod: '2025-01', endPeriod: '2025-12' });
*/

window.CastfordData = (function() {
  'use strict';

  const SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTI5NzYsImV4cCI6MjA4OTM4ODk3Nn0.IGEEYDStt-eH9Mf2G_DzqCPfruDjN8m_ORtAcmtSAZg';

  var sb = null;
  var session = null;
  var orgId = null;
  var demoMode = false;
  var initialized = false;
  var initPromise = null;

  async function init() {
    // Idempotent: return same promise if already initializing
    if (initPromise) return initPromise;
    initPromise = (async function(){
      if (!window.supabase) {
        console.warn('CastfordData: Supabase client not loaded');
        demoMode = true;
        initialized = true;
        return api;
      }
      sb = window.supabase.createClient(SB_URL, SB_KEY);

      var { data } = await sb.auth.getSession();
      session = data?.session;

      if (!session) {
        demoMode = true;
        initialized = true;
        injectDemoBadge();
        return api;
      }

      // Get org from users table
      var { data: user } = await sb.from('users').select('org_id').eq('id', session.user.id).maybeSingle();
      orgId = user?.org_id;

      // Check if real data exists
      var { count } = await sb.from('gl_transactions').select('id', { count: 'exact', head: true }).eq('org_id', orgId);
      if (!count || count === 0) {
        demoMode = true;
        injectDemoBadge();
      }

      initialized = true;
      return api;
    })();
    return initPromise;
  }

  function injectDemoBadge() {
    if (document.getElementById('cf-demo-badge')) return;
    var badge = document.createElement('div');
    badge.id = 'cf-demo-badge';
    badge.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg> DEMO DATA</span>';
    badge.style.cssText = 'position:fixed;top:72px;right:16px;z-index:9999;background:#C4884A;color:#fff;padding:6px 14px;font-family:"Geist Mono",monospace;font-size:11px;font-weight:600;letter-spacing:1px;pointer-events:none;box-shadow:0 2px 8px rgba(196,136,74,0.3)';
    document.body.appendChild(badge);
  }

  // ==========================================
  // HELPERS
  // ==========================================

  function formatCurrency(amount, opts) {
    opts = opts || {};
    var n = Number(amount) || 0;
    var abs = Math.abs(n);
    var sign = n < 0 ? '-' : '';
    if (opts.compact) {
      if (abs >= 1e9) return sign + '$' + (abs/1e9).toFixed(1) + 'B';
      if (abs >= 1e6) return sign + '$' + (abs/1e6).toFixed(1) + 'M';
      if (abs >= 1e3) return sign + '$' + (abs/1e3).toFixed(0) + 'K';
      return sign + '$' + abs.toFixed(0);
    }
    return sign + '$' + abs.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  // Returns { startPeriod: 'YYYY-MM', endPeriod: 'YYYY-MM' } for the requested range
  function getCurrentPeriodRange(rangeKey) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1; // 1-12
    var pad = function(n){ return n < 10 ? '0'+n : ''+n; };

    switch ((rangeKey || 'fy-ytd').toLowerCase()) {
      case 'fy-ytd':
        return { startPeriod: year + '-01', endPeriod: year + '-' + pad(month) };
      case 'q4':
        return { startPeriod: year + '-10', endPeriod: year + '-12' };
      case 'last-12':
        var d = new Date(year, month - 12, 1);
        return { startPeriod: d.getFullYear() + '-' + pad(d.getMonth()+1), endPeriod: year + '-' + pad(month) };
      case 'all':
      default:
        return { startPeriod: '2000-01', endPeriod: year + '-' + pad(month) };
    }
  }

  // ==========================================
  // READ FUNCTIONS (bi-directional: pull)
  // ==========================================

  async function getAccounts(type) {
    if (!sb || !orgId) return [];
    var q = sb.from('gl_accounts').select('*').eq('org_id', orgId).order('code');
    if (type) q = q.eq('account_type', type);
    var { data, error } = await q;
    return error ? [] : data;
  }

  async function getTransactions(opts) {
    if (!sb || !orgId) return [];
    opts = opts || {};
    var q = sb.from('gl_transactions').select('*, gl_accounts(name, account_type)').eq('org_id', orgId).order('txn_date', { ascending: false });
    if (opts.accountId) q = q.eq('account_id', opts.accountId);
    if (opts.startDate) q = q.gte('txn_date', opts.startDate);
    if (opts.endDate) q = q.lte('txn_date', opts.endDate);
    if (opts.limit) q = q.limit(opts.limit);
    var { data, error } = await q;
    return error ? [] : data;
  }

  async function getBudgets(period) {
    if (!sb || !orgId) return [];
    var q = sb.from('gl_budgets').select('*, gl_accounts(name, account_type)').eq('org_id', orgId).order('period');
    if (period) q = q.eq('period', period);
    var { data, error } = await q;
    return error ? [] : data;
  }

  // NEW v1.1: Query pre-computed P&L summary view
  // Returns rows: { period, account_type, account_name, account_subtype, actual, budget, variance, segment, currency }
  async function getPnlSummary(opts) {
    if (!sb || !orgId) return [];
    opts = opts || {};
    var q = sb.from('pl_summary').select('*').eq('org_id', orgId).order('period');
    if (opts.startPeriod) q = q.gte('period', opts.startPeriod);
    if (opts.endPeriod) q = q.lte('period', opts.endPeriod);
    if (opts.accountType) q = q.eq('account_type', opts.accountType);
    if (opts.segment) q = q.eq('segment', opts.segment);
    if (opts.currency) q = q.eq('currency', opts.currency);
    var { data, error } = await q;
    if (error) {
      console.warn('CastfordData: pl_summary query failed:', error.message);
      return [];
    }
    return data || [];
  }

  // NEW v1.2: Query existing scenarios for this org
  // Returns rows from scenarios table: { id, name, scenario_type, fy_arr, growth_pct, drivers, mape, percentile, updated_at, ... }
  async function getScenarios(opts) {
    if (!sb || !orgId) return [];
    opts = opts || {};
    var q = sb.from('scenarios').select('*').eq('org_id', orgId).order('updated_at', { ascending: false });
    if (opts.scenarioType) q = q.eq('scenario_type', opts.scenarioType);
    if (opts.activeOnly) q = q.eq('is_active', true);
    if (opts.limit) q = q.limit(opts.limit);
    var { data, error } = await q;
    if (error) {
      console.warn('CastfordData: scenarios query failed:', error.message);
      return [];
    }
    return data || [];
  }

  // budget_versions — used as the "base" reference for scenario comparisons
  async function getBudgetVersions(opts) {
    opts = opts || {};
    if (!sb || demoMode || !orgId) return [];
    var q = sb
      .from('budget_versions')
      .select('id, name, fiscal_year, status, total_revenue, total_opex, total_net_income, notes, metadata, approved_at, updated_at, created_at')
      .eq('org_id', orgId)
      .order('updated_at', { ascending: false });
    if (opts.fiscalYear) q = q.eq('fiscal_year', opts.fiscalYear);
    if (opts.status) q = q.eq('status', opts.status);
    if (opts.limit) q = q.limit(opts.limit);
    var { data } = await q;
    return data || [];
  }


  // NEW v1.2: Trigger forecast generation via generate-forecast edge function
  // Body shape can include: { scenarioName, scenarioType, drivers, horizonMonths, forecastModel }
  async function generateForecast(body) {
    if (!sb || !orgId) return { error: 'Not initialized' };
    if (demoMode) return { error: 'Demo mode — connect your GL to generate forecasts' };
    body = body || {};
    body.org_id = orgId;
    try {
      var { data, error } = await sb.functions.invoke('generate-forecast', { body: body });
      if (error) {
        console.warn('generate-forecast invocation failed:', error);
        return { error: error.message || 'Function invocation failed' };
      }
      logAudit('forecast_generated', { scenario_name: body.scenarioName, model: body.forecastModel });
      return data;
    } catch (e) {
      console.warn('generate-forecast threw:', e);
      return { error: String(e) };
    }
  }


  async function getRevenue(startDate, endDate) {
    var txns = await getTransactions({ startDate: startDate, endDate: endDate });
    var revenue = 0, expenses = 0;
    txns.forEach(function(t) {
      if (t.gl_accounts?.account_type === 'revenue' || t.gl_accounts?.account_type === 'other_income') revenue += Math.abs(t.amount || 0);
      if (t.gl_accounts?.account_type === 'expense') expenses += Math.abs(t.amount || 0);
    });
    return { revenue: revenue, expenses: expenses, net: revenue - expenses, count: txns.length };
  }

  async function getCashFlow() {
    var txns = await getTransactions({ limit: 100 });
    var byMonth = {};
    txns.forEach(function(t) {
      var month = (t.txn_date || '').slice(0, 7);
      if (!byMonth[month]) byMonth[month] = { inflow: 0, outflow: 0 };
      if (t.amount > 0) byMonth[month].inflow += t.amount;
      else byMonth[month].outflow += Math.abs(t.amount);
    });
    return byMonth;
  }

  async function getBudgetVsActuals(period) {
    var budgets = await getBudgets(period);
    var txns = await getTransactions({ startDate: period + '-01', endDate: period + '-31' });

    var actuals = {};
    txns.forEach(function(t) {
      var aid = t.account_id;
      if (!actuals[aid]) actuals[aid] = 0;
      actuals[aid] += Math.abs(t.amount || 0);
    });

    return budgets.map(function(b) {
      var actual = actuals[b.account_id] || 0;
      var variance = b.amount - actual;
      return {
        account: b.gl_accounts?.name,
        type: b.gl_accounts?.account_type,
        budget: b.amount,
        actual: actual,
        variance: variance,
        variancePct: b.amount ? ((variance / b.amount) * 100).toFixed(1) : 0
      };
    });
  }

  // ==========================================
  // WRITE FUNCTIONS (bi-directional: push)
  // ==========================================

  async function createBudget(accountId, period, amount, notes) {
    if (demoMode) return { error: 'Demo mode — connect your data to create budgets' };
    var { data, error } = await sb.from('gl_budgets').insert({
      org_id: orgId, account_id: accountId, period: period, amount: amount, notes: notes || null
    }).select().single();
    if (!error) logAudit('budget_created', { account_id: accountId, period: period, amount: amount });
    return error ? { error: error.message } : data;
  }

  async function updateBudget(budgetId, amount, notes) {
    if (demoMode) return { error: 'Demo mode' };
    var { data, error } = await sb.from('gl_budgets').update({ amount: amount, notes: notes }).eq('id', budgetId).eq('org_id', orgId).select().single();
    if (!error) logAudit('budget_updated', { budget_id: budgetId, amount: amount });
    return error ? { error: error.message } : data;
  }

  async function logTransaction(accountId, date, amount, description, reference) {
    if (demoMode) return { error: 'Demo mode — connect your data to log transactions' };
    var { data, error } = await sb.from('gl_transactions').insert({
      org_id: orgId, account_id: accountId, date: date, amount: amount,
      description: description || null, reference: reference || null
    }).select().single();
    if (!error) logAudit('transaction_logged', { account_id: accountId, amount: amount });
    return error ? { error: error.message } : data;
  }

  async function createAccount(code, name, type, parentId) {
    if (demoMode) return { error: 'Demo mode' };
    var { data, error } = await sb.from('gl_accounts').insert({
      org_id: orgId, code: code, name: name, type: type, parent_id: parentId || null
    }).select().single();
    if (!error) logAudit('account_created', { code: code, name: name, type: type });
    return error ? { error: error.message } : data;
  }

  // ==========================================
  // COMPLIANCE: Audit trail
  // ==========================================

  async function logAudit(action, details) {
    if (!sb) return;
    try {
      await sb.from('audit_log').insert({
        user_id: session?.user?.id, org_id: orgId,
        action: action, details: details,
        ip_address: null, user_agent: navigator.userAgent
      });
    } catch (e) { console.warn('Audit log failed:', e); }
  }

  async function getAuditLog(limit) {
    if (!sb || !orgId) return [];
    var { data } = await sb.from('audit_log').select('*').eq('org_id', orgId).order('created_at', { ascending: false }).limit(limit || 50);
    return data || [];
  }

  // ==========================================
  // COMPLIANCE: Vendor registry
  // ==========================================

  async function getVendors() {
    if (!sb) return [];
    var { data } = await sb.from('vendor_registry').select('*').order('vendor_name');
    return data || [];
  }

  // ==========================================
  // COMPLIANCE: Incident log
  // ==========================================

  async function logIncident(severity, title, description, affectedSystems) {
    if (!sb) return { error: 'Not initialized' };
    var { data, error } = await sb.from('incident_log').insert({
      severity: severity, title: title, description: description,
      affected_systems: affectedSystems, status: 'open', reported_by: session?.user?.id
    }).select().single();
    if (!error) logAudit('incident_reported', { severity: severity, title: title });
    return error ? { error: error.message } : data;
  }

  async function getIncidents() {
    if (!sb) return [];
    var { data } = await sb.from('incident_log').select('*').order('created_at', { ascending: false });
    return data || [];
  }

  // ==========================================
  // PHASE 2B-2: TEAM + INTEGRATIONS
  // ==========================================

  // org_members joined with users — the real source of truth for who's on the team
  // SCHEMA: org_members has primary_role/status/accepted_at; we expose them as
  // role/last_active_at/joined_at for backward-compatible callers (Team page).
  async function getTeamMembers() {
    if (!sb || demoMode || !orgId) return [];
    var { data, error } = await sb
      .from('org_members')
      .select('user_id, primary_role, permission_level, seat_type, status, accepted_at, created_at, users:user_id ( id, email, full_name, avatar_url, last_active_at, job_title, department )')
      .eq('org_id', orgId)
      .order('created_at', { ascending: true });
    if (error || !data) return [];
    // Normalize shape so existing render code keeps working
    return data.map(function(row){
      return {
        user_id: row.user_id,
        role: row.primary_role,
        permission_level: row.permission_level,
        seat_type: row.seat_type,
        status: row.status,
        last_active_at: row.users && row.users.last_active_at ? row.users.last_active_at : row.accepted_at,
        joined_at: row.accepted_at || row.created_at,
        users: row.users || null
      };
    });
  }

  // org_invitations — pending invites awaiting acceptance
  async function getOrgInvitations() {
    if (!sb || demoMode || !orgId) return [];
    var { data } = await sb
      .from('org_invitations')
      .select('id, email, role, invited_by, created_at, status')
      .eq('org_id', orgId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    return data || [];
  }

  // integrations — what's currently connected (joined to connector_registry by provider text)
  async function getIntegrations() {
    if (!sb || demoMode || !orgId) return [];
    var { data } = await sb
      .from('integrations')
      .select('id, provider, status, config, last_sync_at, records_synced, last_error, sync_schedule, tables_synced, next_sync_at, provider_version, created_at, updated_at')
      .eq('org_id', orgId)
      .order('last_sync_at', { ascending: false, nullsFirst: false });
    if (!data || data.length === 0) return [];
    // join to connector_registry on provider
    var providers = Array.from(new Set(data.map(function(r) { return r.provider; })));
    var { data: catalog } = await sb
      .from('connector_registry')
      .select('provider, display_name, category, auth_type, logo_url, docs_url, status')
      .in('provider', providers);
    var catMap = {};
    (catalog || []).forEach(function(c) { catMap[c.provider] = c; });
    return data.map(function(r) {
      r.connector = catMap[r.provider] || null;
      return r;
    });
  }

  // connector_registry — all available connectors (the catalog)
  async function getConnectorRegistry() {
    if (!sb) return [];
    var { data } = await sb
      .from('connector_registry')
      .select('id, provider, display_name, category, auth_type, status, logo_url, docs_url')
      .order('category', { ascending: true })
      .order('display_name', { ascending: true });
    return data || [];
  }

  // close_periods — list all periods for the org, newest first
  async function getClosePeriods() {
    if (!sb || demoMode || !orgId) return [];
    var { data } = await sb
      .from('close_periods')
      .select('id, period, fiscal_year, status, due_date, started_at, closed_by, closed_at, locked_at, notes, metadata, created_at, updated_at')
      .eq('org_id', orgId)
      .order('period', { ascending: false });
    return data || [];
  }

  // close_periods — most recent open/in_progress period (the one to render)
  async function getCurrentClosePeriod() {
    if (!sb || demoMode || !orgId) return null;
    var { data } = await sb
      .from('close_periods')
      .select('id, period, fiscal_year, status, due_date, started_at, closed_by, closed_at, locked_at, notes, metadata')
      .eq('org_id', orgId)
      .in('status', ['open','in_progress','review','reopened'])
      .order('period', { ascending: false })
      .limit(1);
    return (data && data[0]) || null;
  }

  // workspace_tasks for a specific period — close tasks live here
  async function getCloseTasks(period) {
    if (!sb || demoMode || !orgId || !period) return [];
    var { data } = await sb
      .from('workspace_tasks')
      .select('id, title, description, status, priority, category, period, assigned_to, due_date, completed_at, metadata, created_at')
      .eq('org_id', orgId)
      .eq('period', period)
      .order('category', { ascending: true })
      .order('due_date', { ascending: true, nullsFirst: false });
    return data || [];
  }

  // copilot_conversations — most recent non-archived for org
  async function getLatestCopilotConversation() {
    if (!sb || demoMode || !orgId) return null;
    var { data } = await sb
      .from('copilot_conversations')
      .select('id, title, messages, model, token_count, is_archived, created_at, updated_at')
      .eq('org_id', orgId)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
      .limit(1);
    return (data && data[0]) || null;
  }

  // ai_query_log — aggregate session usage for the org
  async function getCopilotUsageSummary() {
    if (!sb || demoMode || !orgId) {
      return { totalTokens: 0, totalCostCents: 0, queryCount: 0, latestModel: null, latestAt: null };
    }
    var { data } = await sb
      .from('ai_query_log')
      .select('tokens_used, cost_cents, model, created_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(200);
    var rows = data || [];
    var totalTokens = 0;
    var totalCostCents = 0;
    rows.forEach(function(r){
      totalTokens += (r.tokens_used || 0);
      totalCostCents += parseFloat(r.cost_cents || 0);
    });
    return {
      totalTokens: totalTokens,
      totalCostCents: totalCostCents,
      queryCount: rows.length,
      latestModel: rows.length ? rows[0].model : null,
      latestAt: rows.length ? rows[0].created_at : null
    };
  }

  // gl_accounts + gl_transactions counts for "data scope" panel
  async function getCopilotDataScope() {
    if (!sb || demoMode || !orgId) {
      return { glAccountsCount: 0, txCount: 0, latestTxAt: null, period: 'FY2026' };
    }
    var accountsResp = await sb
      .from('gl_accounts')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId);
    var txCountResp = await sb
      .from('gl_transactions')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', orgId);
    var latestTxResp = await sb
      .from('gl_transactions')
      .select('transaction_date')
      .eq('org_id', orgId)
      .order('transaction_date', { ascending: false })
      .limit(1);
    var latestAt = null;
    if (latestTxResp.data && latestTxResp.data[0]) {
      latestAt = latestTxResp.data[0].transaction_date;
    }
    return {
      glAccountsCount: accountsResp.count || 0,
      txCount: txCountResp.count || 0,
      latestTxAt: latestAt,
      period: 'FY' + new Date().getFullYear()
    };
  }

  // ai_reports — most recent insights/recommendations for the org
  async function getAiReports(opts) {
    opts = opts || {};
    var limit = opts.limit || 6;
    if (!sb || demoMode || !orgId) return [];
    var { data } = await sb
      .from('ai_reports')
      .select('id, report_type, title, summary, content, metrics, recommendations, status, auto_generated, generated_at, viewed_at, created_at')
      .eq('org_id', orgId)
      .order('generated_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  // financial_alerts — anomalies/variance alerts ordered by severity
  async function getFinancialAlerts(opts) {
    opts = opts || {};
    var limit = opts.limit || 10;
    var statusFilter = opts.status || 'active';
    if (!sb || demoMode || !orgId) return [];
    var q = sb
      .from('financial_alerts')
      .select('id, alert_type, severity, title, description, metric_name, current_value, expected_value, deviation_pct, period, status, created_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(limit * 3);  // fetch wider then sort by severity in JS
    if (statusFilter && statusFilter !== 'all') {
      q = q.eq('status', statusFilter);
    }
    var { data } = await q;
    var rows = data || [];
    // sort by severity rank then created_at desc
    var rank = { critical: 0, high: 1, medium: 2, low: 3 };
    rows.sort(function(a, b){
      var ra = rank[a.severity] === undefined ? 99 : rank[a.severity];
      var rb = rank[b.severity] === undefined ? 99 : rank[b.severity];
      if (ra !== rb) return ra - rb;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return rows.slice(0, limit);
  }

  // generated_reports — most recent narrative/summary report for the org
  async function getLatestGeneratedReport() {
    if (!sb || demoMode || !orgId) return null;
    var { data } = await sb
      .from('generated_reports')
      .select('id, report_type, title, period, content, summary_text, generated_by, status, created_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(1);
    return (data && data[0]) || null;
  }

  // command_center_configs — get the active config for the org
  async function getCommandCenterConfig() {
    if (!sb || demoMode || !orgId) return null;
    var { data } = await sb
      .from('command_center_configs')
      .select('id, client_name, command_center, current_version, brand_config, enabled_modules, kpi_config, layout_config, industry_vertical, tier, health_score, last_upgrade_at, next_upgrade_planned, updated_at')
      .eq('org_id', orgId)
      .order('updated_at', { ascending: false })
      .limit(1);
    return (data && data[0]) || null;
  }

  // notifications — list unread or recent notifications for the org
  async function getNotifications(opts) {
    opts = opts || {};
    var limit = opts.limit || 20;
    if (!sb || demoMode || !orgId) return [];
    var q = sb
      .from('notifications')
      .select('id, channel, title, body, link, alert_id, read, sent_at, read_at')
      .eq('org_id', orgId)
      .order('sent_at', { ascending: false, nullsFirst: false })
      .limit(limit);
    if (opts.unread === true) q = q.eq('read', false);
    var { data } = await q;
    return data || [];
  }

  // audit_log — recent activity for the org
  async function getRecentActivity(opts) {
    opts = opts || {};
    var limit = opts.limit || 12;
    if (!sb || demoMode || !orgId) return [];
    var q = sb
      .from('audit_log')
      .select('id, user_id, action, resource_type, resource_id, metadata, created_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (opts.hoursWindow) {
      var cutoff = new Date(Date.now() - opts.hoursWindow * 3600 * 1000).toISOString();
      q = q.gte('created_at', cutoff);
    }
    var { data } = await q;
    return data || [];
  }

  // Composite: counts for the four stat tiles on Command Center
  async function getCommandCenterStats() {
    if (!sb || demoMode || !orgId) {
      return { critical: 0, warnings: 0, unreadNotifications: 0, eventsLast7d: 0, lastEventAt: null };
    }
    var sevenDaysAgo = new Date(Date.now() - 7 * 86400 * 1000).toISOString();
    var critResp = await sb.from('financial_alerts').select('id', { count: 'exact', head: true })
      .eq('org_id', orgId).eq('status', 'active').eq('severity', 'critical');
    var warnResp = await sb.from('financial_alerts').select('id', { count: 'exact', head: true })
      .eq('org_id', orgId).eq('status', 'active').in('severity', ['high','medium']);
    var notifResp = await sb.from('notifications').select('id', { count: 'exact', head: true })
      .eq('org_id', orgId).eq('read', false);
    var eventsResp = await sb.from('audit_log').select('id', { count: 'exact', head: true })
      .eq('org_id', orgId).gte('created_at', sevenDaysAgo);
    var latestResp = await sb.from('audit_log').select('created_at')
      .eq('org_id', orgId).order('created_at', { ascending: false }).limit(1);
    return {
      critical: critResp.count || 0,
      warnings: warnResp.count || 0,
      unreadNotifications: notifResp.count || 0,
      eventsLast7d: eventsResp.count || 0,
      lastEventAt: (latestResp.data && latestResp.data[0]) ? latestResp.data[0].created_at : null
    };
  }

  // Investor metrics monthly time series — aggregates gl_transactions by period
  // and computes revenue/COGS/opex/net income with subtype splits useful for
  // SaaS metrics (subscription, S&M spend).
  async function getInvestorMonthlySeries() {
    if (!sb || demoMode || !orgId) return [];
    var { data, error } = await sb
      .from('gl_transactions')
      .select('period, amount, account:gl_accounts(account_type, account_subtype, name)')
      .eq('org_id', orgId);
    if (error || !data) return [];

    var bucket = {};
    data.forEach(function(tx){
      var p = tx.period;
      if (!p || !tx.account) return;
      if (!bucket[p]) bucket[p] = { revenue: 0, cogs: 0, opex: 0, otherIncome: 0, otherExpense: 0, salesMarketing: 0, subscription: 0 };
      var amt = Math.abs(parseFloat(tx.amount || 0));
      var type = tx.account.account_type;
      var subtype = tx.account.account_subtype;
      if (type === 'revenue') {
        bucket[p].revenue += amt;
        if (subtype === 'subscription') bucket[p].subscription += amt;
      } else if (type === 'cost_of_revenue') {
        bucket[p].cogs += amt;
      } else if (type === 'expense') {
        bucket[p].opex += amt;
        if (subtype === 'sales' || subtype === 'marketing') bucket[p].salesMarketing += amt;
      } else if (type === 'other_income') {
        bucket[p].otherIncome += amt;
      } else if (type === 'other_expense') {
        bucket[p].otherExpense += amt;
      }
    });

    var periods = Object.keys(bucket).sort();
    return periods.map(function(p){
      var m = bucket[p];
      var grossProfit = m.revenue - m.cogs;
      var operatingIncome = grossProfit - m.opex;
      var netIncome = operatingIncome + m.otherIncome - m.otherExpense;
      return {
        period: p,
        revenue: m.revenue,
        cogs: m.cogs,
        opex: m.opex,
        grossProfit: grossProfit,
        grossMargin: m.revenue ? grossProfit / m.revenue : 0,
        operatingIncome: operatingIncome,
        netIncome: netIncome,
        netMargin: m.revenue ? netIncome / m.revenue : 0,
        salesMarketing: m.salesMarketing,
        subscriptionRevenue: m.subscription
      };
    });
  }

  // industry_benchmarks for given industry (default: saas)
  async function getIndustryBenchmarks(industry) {
    if (!sb) return [];
    var { data } = await sb
      .from('industry_benchmarks')
      .select('metric, percentile_25, percentile_50, percentile_75, unit, industry, year')
      .eq('industry', industry || 'saas');
    return data || [];
  }

  // customer_metrics — subscription/cohort metrics if populated
  async function getCustomerMetricsRows() {
    if (!sb || demoMode || !orgId) return [];
    var { data } = await sb
      .from('customer_metrics')
      .select('id, metric_key, metric_value, metric_unit, period, period_start, period_end, source, metadata')
      .eq('org_id', orgId)
      .order('period_end', { ascending: false, nullsFirst: false })
      .limit(50);
    return data || [];
  }

  // organizations — fetch the active org row (plan, seats, mrr, etc.)
  async function getOrganization() {
    if (!sb || demoMode || !orgId) return null;
    var { data } = await sb
      .from('organizations')
      .select('id, name, slug, plan, tier, seats_used, seats_limit, entities_used, entities_limit, mrr, billing_interval, billing_email, sso_enabled, api_access, integrations_limit, copilot_limit, trial_ends_at, plan_updated_at, onboarding_completed_at')
      .eq('id', orgId)
      .maybeSingle();
    return data || null;
  }

  // Composite counts used by the Admin Console tile row.
  // Runs queries in parallel; tolerates failures (returns 0 on per-query error).
  async function getAdminCounts() {
    if (!sb || demoMode || !orgId) {
      return { teamMembers: 0, glAccounts: 0, glTransactions: 0, integrations: 0, eventsLast24h: 0, eventsLast7d: 0 };
    }
    var since24 = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    var since7d = new Date(Date.now() - 7 * 86400 * 1000).toISOString();
    var members = sb.from('org_members').select('id', { count: 'exact', head: true }).eq('org_id', orgId);
    var accounts = sb.from('gl_accounts').select('id', { count: 'exact', head: true }).eq('org_id', orgId);
    var txns = sb.from('gl_transactions').select('id', { count: 'exact', head: true }).eq('org_id', orgId);
    var ints = sb.from('integrations').select('id', { count: 'exact', head: true }).eq('org_id', orgId);
    var ev24 = sb.from('audit_log').select('id', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', since24);
    var ev7d = sb.from('audit_log').select('id', { count: 'exact', head: true }).eq('org_id', orgId).gte('created_at', since7d);
    var results = await Promise.all([
      members.then(function(r){ return r.count || 0; }, function(){ return 0; }),
      accounts.then(function(r){ return r.count || 0; }, function(){ return 0; }),
      txns.then(function(r){ return r.count || 0; }, function(){ return 0; }),
      ints.then(function(r){ return r.count || 0; }, function(){ return 0; }),
      ev24.then(function(r){ return r.count || 0; }, function(){ return 0; }),
      ev7d.then(function(r){ return r.count || 0; }, function(){ return 0; })
    ]);
    return {
      teamMembers: results[0],
      glAccounts: results[1],
      glTransactions: results[2],
      integrations: results[3],
      eventsLast24h: results[4],
      eventsLast7d: results[5]
    };
  }

  // ==========================================
  // API surface
  // ==========================================

  var api = {
    init: init,
    isInitialized: function() { return initialized; },
    isDemoMode: function() { return demoMode; },
    getSession: function() { return session; },
    getOrgId: function() { return orgId; },
    // helpers
    formatCurrency: formatCurrency,
    getCurrentPeriodRange: getCurrentPeriodRange,
    // READ
    getAccounts: getAccounts,
    getTransactions: getTransactions,
    getBudgets: getBudgets,
    getPnlSummary: getPnlSummary,
    getScenarios: getScenarios,
    generateForecast: generateForecast,
    getRevenue: getRevenue,
    getCashFlow: getCashFlow,
    getBudgetVsActuals: getBudgetVsActuals,
    getAuditLog: getAuditLog,
    getVendors: getVendors,
    getIncidents: getIncidents,
    // Phase 2B-2
    getTeamMembers: getTeamMembers,
    getOrgInvitations: getOrgInvitations,
    getIntegrations: getIntegrations,
    getConnectorRegistry: getConnectorRegistry,
    getClosePeriods: getClosePeriods,
    getCurrentClosePeriod: getCurrentClosePeriod,
    getCloseTasks: getCloseTasks,
    // Phase 2B-3
    getLatestCopilotConversation: getLatestCopilotConversation,
    getCopilotUsageSummary: getCopilotUsageSummary,
    getCopilotDataScope: getCopilotDataScope,
    getAiReports: getAiReports,
    getFinancialAlerts: getFinancialAlerts,
    getLatestGeneratedReport: getLatestGeneratedReport,
    getCommandCenterConfig: getCommandCenterConfig,
    getNotifications: getNotifications,
    getRecentActivity: getRecentActivity,
    getCommandCenterStats: getCommandCenterStats,
    getInvestorMonthlySeries: getInvestorMonthlySeries,
    getIndustryBenchmarks: getIndustryBenchmarks,
    getCustomerMetricsRows: getCustomerMetricsRows,
    getBudgetVersions: getBudgetVersions,
    getOrganization: getOrganization,
    getAdminCounts: getAdminCounts,
    // WRITE
    createBudget: createBudget,
    updateBudget: updateBudget,
    logTransaction: logTransaction,
    createAccount: createAccount,
    logIncident: logIncident,
    logAudit: logAudit,
  };

  return api;
})();
