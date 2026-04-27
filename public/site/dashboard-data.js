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
  async function getTeamMembers() {
    if (!sb || demoMode || !orgId) return [];
    var { data } = await sb
      .from('org_members')
      .select('user_id, role, status, last_active_at, joined_at, users:user_id ( id, email, full_name, avatar_url )')
      .eq('org_id', orgId)
      .order('joined_at', { ascending: true });
    return data || [];
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
