/* Castford Dashboard Data Layer v1
   Bi-directional enterprise data module for all dashboard pages.
   READ: Pull real GL data from Supabase (accounts, transactions, budgets)
   WRITE: Create/update budgets, log transactions, update forecasts
   DEMO: Auto-detects when no real data exists and shows demo badge
   
   Usage: <script src="/site/dashboard-data.js"></script>
   Then: const cd = await CastfordData.init();
         const revenue = await cd.getRevenue();
         await cd.createBudget({...});
*/

window.CastfordData = (function() {
  'use strict';

  const SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTI5NzYsImV4cCI6MjA4OTM4ODk3Nn0.IGEEYDStt-eH9Mf2G_DzqCPfruDjN8m_ORtAcmtSAZg';
  
  var sb = null;
  var session = null;
  var orgId = null;
  var demoMode = false;

  async function init() {
    if (!window.supabase) {
      console.warn('CastfordData: Supabase client not loaded');
      return { demoMode: true };
    }
    sb = window.supabase.createClient(SB_URL, SB_KEY);
    
    var { data } = await sb.auth.getSession();
    session = data?.session;
    
    if (!session) {
      demoMode = true;
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

    return api;
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
  // READ FUNCTIONS (bi-directional: pull)
  // ==========================================

  async function getAccounts(type) {
    var q = sb.from('gl_accounts').select('*').eq('org_id', orgId).order('code');
    if (type) q = q.eq('type', type);
    var { data, error } = await q;
    return error ? [] : data;
  }

  async function getTransactions(opts) {
    opts = opts || {};
    var q = sb.from('gl_transactions').select('*, gl_accounts(name, type, code)').eq('org_id', orgId).order('date', { ascending: false });
    if (opts.accountId) q = q.eq('account_id', opts.accountId);
    if (opts.startDate) q = q.gte('date', opts.startDate);
    if (opts.endDate) q = q.lte('date', opts.endDate);
    if (opts.limit) q = q.limit(opts.limit);
    var { data, error } = await q;
    return error ? [] : data;
  }

  async function getBudgets(period) {
    var q = sb.from('gl_budgets').select('*, gl_accounts(name, type, code)').eq('org_id', orgId).order('period');
    if (period) q = q.eq('period', period);
    var { data, error } = await q;
    return error ? [] : data;
  }

  async function getRevenue(startDate, endDate) {
    var txns = await getTransactions({ startDate: startDate, endDate: endDate });
    var revenue = 0, expenses = 0;
    txns.forEach(function(t) {
      if (t.gl_accounts?.type === 'revenue') revenue += Math.abs(t.amount || 0);
      if (t.gl_accounts?.type === 'expense') expenses += Math.abs(t.amount || 0);
    });
    return { revenue: revenue, expenses: expenses, net: revenue - expenses, count: txns.length };
  }

  async function getCashFlow() {
    var txns = await getTransactions({ limit: 100 });
    var byMonth = {};
    txns.forEach(function(t) {
      var month = (t.date || '').slice(0, 7);
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
        code: b.gl_accounts?.code,
        type: b.gl_accounts?.type,
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
    try {
      await sb.from('audit_log').insert({
        user_id: session?.user?.id, org_id: orgId,
        action: action, details: details,
        ip_address: null, user_agent: navigator.userAgent
      });
    } catch (e) { console.warn('Audit log failed:', e); }
  }

  async function getAuditLog(limit) {
    var { data } = await sb.from('audit_log').select('*').eq('org_id', orgId).order('created_at', { ascending: false }).limit(limit || 50);
    return data || [];
  }

  // ==========================================
  // COMPLIANCE: Vendor registry
  // ==========================================

  async function getVendors() {
    var { data } = await sb.from('vendor_registry').select('*').order('vendor_name');
    return data || [];
  }

  // ==========================================
  // COMPLIANCE: Incident log
  // ==========================================

  async function logIncident(severity, title, description, affectedSystems) {
    var { data, error } = await sb.from('incident_log').insert({
      severity: severity, title: title, description: description,
      affected_systems: affectedSystems, status: 'open', reported_by: session?.user?.id
    }).select().single();
    if (!error) logAudit('incident_reported', { severity: severity, title: title });
    return error ? { error: error.message } : data;
  }

  async function getIncidents() {
    var { data } = await sb.from('incident_log').select('*').order('created_at', { ascending: false });
    return data || [];
  }

  // ==========================================
  // API surface
  // ==========================================

  var api = {
    init: init,
    isDemoMode: function() { return demoMode; },
    getSession: function() { return session; },
    getOrgId: function() { return orgId; },
    // READ
    getAccounts: getAccounts,
    getTransactions: getTransactions,
    getBudgets: getBudgets,
    getRevenue: getRevenue,
    getCashFlow: getCashFlow,
    getBudgetVsActuals: getBudgetVsActuals,
    getAuditLog: getAuditLog,
    getVendors: getVendors,
    getIncidents: getIncidents,
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
