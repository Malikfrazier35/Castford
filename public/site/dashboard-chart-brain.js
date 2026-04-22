/* Castford Dashboard Chart Brain v3
   Companion to dashboard-brain.js. Updates chart animation attributes with
   live API data, then re-triggers the page's existing animation pipeline.

   Covers:
   1. CFO pages: .pl-bar-fill widths (Actual/Budget), .cash-bar heights (monthly revenue)
   2. Standard page: .kpi-value data-target

   Does NOT replace dashboard-brain.js — runs after it as a supplemental brain.
   Deliberately no-ops when demo_mode is true so static visuals remain intact.
*/
(function() {
  'use strict';

  var BASE = 'https://crecesswagluelvkesul.supabase.co/functions/v1';

  // ── Auth resolver: reuse brain v2's token sources ──
  function getToken() {
    try {
      if (window.__fos_supabase && window.__fos_supabase.auth) {
        return window.__fos_supabase.auth.getSession().then(function(r) {
          return (r && r.data && r.data.session) ? r.data.session.access_token : null;
        });
      }
    } catch(e) {}
    try {
      var keys = Object.keys(localStorage).filter(function(k){ return k.indexOf('supabase.auth') > -1; });
      for (var i = 0; i < keys.length; i++) {
        var v = JSON.parse(localStorage.getItem(keys[i]) || 'null');
        if (v && v.access_token) return Promise.resolve(v.access_token);
        if (v && v.currentSession && v.currentSession.access_token) return Promise.resolve(v.currentSession.access_token);
      }
    } catch(e) {}
    return Promise.resolve(null);
  }

  function setAttr(el, attr, val) {
    el.setAttribute(attr, val);
    if (attr === 'data-w') el.style.width = val;
    if (attr === 'data-h') el.style.height = val;
  }

  // ── CFO P&L bars: Actual/Budget ratio ──
  function mapPLBars(monthly) {
    if (!monthly || !monthly.length) return 0;
    var totals = monthly.reduce(function(acc, m) {
      acc.revenue       += m.revenue        || 0;
      acc.budget_revenue += m.budget_revenue || 0;
      acc.opex          += m.opex           || 0;
      acc.budget_opex    += m.budget_opex    || 0;
      return acc;
    }, { revenue:0, budget_revenue:0, opex:0, budget_opex:0 });

    var updated = 0;
    document.querySelectorAll('.pl-row').forEach(function(row) {
      var label = row.querySelector('.pl-label');
      var bar   = row.querySelector('.pl-bar-fill');
      if (!label || !bar) return;
      var t = (label.textContent || '').trim().toLowerCase();
      var pct = null;

      if (t === 'revenue' || t === 'total revenue') {
        if (totals.budget_revenue > 0) pct = Math.round(totals.revenue / totals.budget_revenue * 100);
      } else if (t.indexOf('operating') > -1 || t === 'opex' || t === 'total opex') {
        if (totals.budget_opex > 0) pct = Math.round(totals.opex / totals.budget_opex * 100);
      }
      // Intentionally skip COGS — API does not expose budget_cogs separately.

      if (pct !== null && !isNaN(pct)) {
        var clamped = Math.max(0, Math.min(pct, 130)); // cap visual at 130% for readability
        setAttr(bar, 'data-w', clamped + '%');
        updated++;
      }
    });
    return updated;
  }

  // ── CFO cash-bar heights: last-N months revenue, normalized to max ──
  function mapCashBars(monthly) {
    if (!monthly || !monthly.length) return 0;
    var bars = document.querySelectorAll('.cash-bars .cash-bar');
    if (!bars.length) return 0;

    var recent = monthly.slice(-bars.length);
    if (!recent.length) return 0;
    var max = 0;
    recent.forEach(function(m){ if ((m.revenue||0) > max) max = m.revenue || 0; });
    if (max <= 0) return 0;

    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var updated = 0;

    bars.forEach(function(bar, i) {
      var m = recent[i];
      if (!m) return;
      var pct = Math.round((m.revenue || 0) / max * 100);
      setAttr(bar, 'data-h', pct + '%');

      var label = bar.querySelector('.cash-bar-label');
      if (label && m.month) {
        var parts = m.month.split('-');
        if (parts.length >= 2) {
          var idx = parseInt(parts[1], 10) - 1;
          if (idx >= 0 && idx < 12) label.textContent = MONTHS[idx];
        }
      }
      updated++;
    });
    return updated;
  }

  // ── Standard page: kpi-value data-target ──
  function mapKPITargets(kpis) {
    var updated = 0;
    document.querySelectorAll('.kpi-card').forEach(function(card) {
      var label = card.querySelector('.kpi-label');
      var val   = card.querySelector('.kpi-value');
      if (!label || !val) return;
      var t = (label.textContent || '').trim().toLowerCase();
      var suffix = val.getAttribute('data-suffix') || '';
      var target = null;

      function asMillions(n) { return (Number(n) / 1e6).toFixed(1); }

      if (t.indexOf('revenue') > -1 && t.indexOf('recurring') === -1) {
        target = suffix === 'M' ? asMillions(kpis.total_revenue) : kpis.total_revenue;
      } else if (t.indexOf('gross margin') > -1) {
        target = kpis.gross_margin;
      } else if (t.indexOf('net') > -1 && t.indexOf('margin') > -1) {
        target = kpis.net_margin;
      } else if (t.indexOf('gross profit') > -1) {
        target = suffix === 'M' ? asMillions(kpis.gross_profit) : kpis.gross_profit;
      } else if (t.indexOf('net income') > -1) {
        target = suffix === 'M' ? asMillions(kpis.net_income) : kpis.net_income;
      } else if (t.indexOf('opex') > -1 || t.indexOf('operating expense') > -1) {
        target = suffix === 'M' ? asMillions(kpis.opex) : kpis.opex;
      }

      if (target !== null && !isNaN(Number(target))) {
        val.setAttribute('data-target', String(target));
        updated++;
      }
    });
    return updated;
  }

  // ── Re-apply data-* attrs as inline styles so the bars animate to new values ──
  function reanimate() {
    document.querySelectorAll('[data-w]').forEach(function(b){ b.style.width  = b.getAttribute('data-w');  });
    document.querySelectorAll('[data-h]').forEach(function(b){ b.style.height = b.getAttribute('data-h'); });
  }

  async function run() {
    try {
      var token = await getToken();
      if (!token) return;

      var resp = await fetch(BASE + '/dashboard-summary?view=summary', {
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
      });
      if (!resp.ok) { console.warn('[Castford chart brain] API ' + resp.status); return; }
      var data = await resp.json();

      // Honor demo mode — keep the designed visuals intact when there's no real data
      if (data.demo_mode) { console.log('[Castford chart brain] demo mode, skipping'); return; }

      var kpis    = data.kpis || {};
      var monthly = data.monthly_trend || [];

      var n1 = mapPLBars(monthly);
      var n2 = mapCashBars(monthly);
      var n3 = mapKPITargets(kpis);

      // Page's own animateBars() fires at setTimeout(..., 400). Re-fire at 700ms with live values.
      setTimeout(reanimate, 700);

      console.log('[Castford chart brain] live: pl-bars=' + n1 + ' cash-bars=' + n2 + ' kpi-targets=' + n3);
    } catch(e) {
      console.warn('[Castford chart brain] error', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
