/* Castford CFO Command Brain v1
   Dedicated orchestrator for /cfo (cfo.html).
   Replaces dashboard-brain.js + dashboard-chart-brain.js on this route.

   Single fetch to /functions/v1/cfo-command-center returns everything
   the page needs. Then we paint:
     - Top KPIs (.kpi-val by label)
     - P&L rows and sub-lines (.pl-val, .pl-sub-row)
     - P&L bars (.pl-bar-fill data-w)
     - Cash bars (.cash-bars .cash-bar data-h)
     - Alerts banner
     - Last-sync indicator
     - Demo-mode badge

   Role gate: if the edge fn returns 403, redirect to the user's
   actual dashboard_role route.
*/
(function() {
  'use strict';

  var SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  var BASE = SB_URL + '/functions/v1';

  // ── Helpers ──
  function fmt(val) {
    var n = Number(val) || 0;
    var abs = Math.abs(n);
    if (abs >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
    if (abs >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (abs >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
    return '$' + n.toFixed(0);
  }
  function fmtNeg(val) {
    var n = Number(val) || 0;
    return n < 0 || n === 0 ? '(' + fmt(Math.abs(n)) + ')' : fmt(n);
  }
  function pct(val) { return (Number(val) || 0).toFixed(1) + '%'; }

  function getToken() {
    try {
      if (window.__fos_supabase && window.__fos_supabase.auth) {
        return window.__fos_supabase.auth.getSession().then(function(r) {
          return (r && r.data && r.data.session) ? r.data.session.access_token : null;
        });
      }
    } catch (e) {}
    try {
      var keys = Object.keys(localStorage).filter(function(k) { return k.indexOf('supabase.auth') > -1; });
      for (var i = 0; i < keys.length; i++) {
        var v = JSON.parse(localStorage.getItem(keys[i]) || 'null');
        if (v && v.access_token) return Promise.resolve(v.access_token);
        if (v && v.currentSession && v.currentSession.access_token) return Promise.resolve(v.currentSession.access_token);
      }
    } catch (e) {}
    return Promise.resolve(null);
  }

  // ── Paint: top-level KPIs ──
  function paintKPIs(kpis) {
    document.querySelectorAll('.kpi, .kpi-card, .metric-card, [class*="kpi-"], [class*="metric-"]').forEach(function(card) {
      var label = card.querySelector('.kpi-label, .metric-label, .stat-label, h4, h3, .label');
      var val = card.querySelector('.kpi-val, .metric-val, .stat-val, .value, .amount, .kpi-value');
      if (!label || !val) return;
      var t = (label.textContent || '').trim().toLowerCase();
      if (t.indexOf('revenue') > -1 && t.indexOf('recurring') === -1) val.textContent = fmt(kpis.revenue);
      else if (t.indexOf('gross profit') > -1) val.textContent = fmt(kpis.gross_profit);
      else if (t.indexOf('gross margin') > -1) val.textContent = pct(kpis.gross_margin);
      else if (t.indexOf('net income') > -1 || t.indexOf('net profit') > -1) val.textContent = fmt(kpis.net_income);
      else if (t.indexOf('net margin') > -1) val.textContent = pct(kpis.net_margin);
      else if (t.indexOf('opex') > -1 || t.indexOf('operating expense') > -1) val.textContent = fmt(kpis.opex);
      else if (t.indexOf('cogs') > -1 || t.indexOf('cost of revenue') > -1) val.textContent = fmt(kpis.cogs);
      else if (t.indexOf('ebitda') > -1) val.textContent = fmt(kpis.ebitda);
    });
  }

  // ── Paint: P&L rows + sub-lines ──
  function paintPL(kpis, plBreakdown) {
    // Top-level row values
    document.querySelectorAll('.pl-row').forEach(function(row) {
      var label = row.querySelector('.pl-label');
      var val = row.querySelector('.pl-val');
      if (!label || !val) return;
      var t = (label.textContent || '').trim().toLowerCase();
      if (t === 'revenue' || t === 'total revenue') val.textContent = fmt(kpis.revenue);
      else if (t.indexOf('cost of') > -1 || t === 'cogs') val.textContent = fmtNeg(-kpis.cogs);
      else if (t === 'gross profit') { val.textContent = fmt(kpis.gross_profit); val.style.color = 'var(--green,#22C55E)'; }
      else if (t.indexOf('operating') > -1 || t === 'opex' || t === 'total opex') val.textContent = fmtNeg(-kpis.opex);
      else if (t === 'net income' || t === 'net profit') {
        val.textContent = fmt(kpis.net_income);
        val.style.color = kpis.net_income >= 0 ? 'var(--green,#22C55E)' : 'var(--rose,#EF4444)';
      }
    });

    // Sub-line items: match .pl-sub-row > span[0] (name) against breakdown
    function mapSub(containerSelector, items) {
      var container = document.querySelector(containerSelector);
      if (!container || !items || !items.length) return;
      container.querySelectorAll('.pl-sub-row').forEach(function(sub) {
        var name = sub.querySelector('span:first-child');
        var value = sub.querySelector('.pl-val');
        if (!name || !value) return;
        var n = (name.textContent || '').trim().toLowerCase();
        // Fuzzy match: contains, starts-with, or first-word match
        var match = items.find(function(i) {
          var ilower = (i.name || '').toLowerCase();
          return ilower === n || ilower.indexOf(n) > -1 || n.indexOf(ilower) > -1;
        });
        if (match) value.textContent = fmt(match.amount);
      });
    }
    mapSub('#rev-sub', plBreakdown.revenue_breakdown);
    mapSub('#cogs-sub', plBreakdown.cogs_breakdown);
    mapSub('#opex-sub', plBreakdown.opex_breakdown);
  }

  // ── Paint: P&L bars (Actual/Budget ratio) ──
  function paintPLBars(bars) {
    document.querySelectorAll('.pl-row').forEach(function(row) {
      var label = row.querySelector('.pl-label');
      var bar = row.querySelector('.pl-bar-fill');
      if (!label || !bar) return;
      var t = (label.textContent || '').trim().toLowerCase();
      var p = null;
      if (t === 'revenue' || t === 'total revenue') p = bars.revenue.pct;
      else if (t.indexOf('cost of') > -1 || t === 'cogs') p = bars.cogs.pct;
      else if (t.indexOf('operating') > -1 || t === 'opex' || t === 'total opex') p = bars.opex.pct;
      if (p !== null && p !== undefined && !isNaN(p)) {
        var clamped = Math.max(0, Math.min(p, 130));
        bar.setAttribute('data-w', clamped + '%');
        bar.style.width = clamped + '%';
      }
    });
  }

  // ── Paint: cash bars ──
  function paintCashBars(cashBars) {
    if (!cashBars || !cashBars.length) return;
    var bars = document.querySelectorAll('.cash-bars .cash-bar');
    if (!bars.length) return;
    var offset = Math.max(0, cashBars.length - bars.length);

    bars.forEach(function(bar, i) {
      var data = cashBars[i + offset] || cashBars[i];
      if (!data) return;
      bar.setAttribute('data-h', (data.pct || 0) + '%');
      bar.style.height = (data.pct || 0) + '%';
      var labelEl = bar.querySelector('.cash-bar-label');
      if (labelEl && data.label) labelEl.textContent = data.label;
    });
  }

  // ── Alerts banner ──
  function paintAlerts(alerts) {
    if (!alerts || !alerts.length) return;
    var host = document.querySelector('.dash-content') || document.querySelector('main') || document.body;
    var existing = document.getElementById('cf-alerts-banner');
    if (existing) existing.remove();

    var wrap = document.createElement('div');
    wrap.id = 'cf-alerts-banner';
    wrap.style.cssText = 'margin:0 0 16px;display:flex;flex-direction:column;gap:6px';

    alerts.slice(0, 3).forEach(function(a) {
      var row = document.createElement('div');
      var color = a.severity === 'critical' ? '#EF4444' : a.severity === 'warning' ? '#F59E0B' : '#3B82F6';
      row.style.cssText = 'padding:8px 14px;border-left:3px solid ' + color + ';background:' + color + '11;border-radius:2px;font-size:13px;color:var(--text-1,#0f172a);display:flex;align-items:center;gap:8px';
      row.innerHTML = '<strong style="font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:0.05em;color:' + color + '">' + a.severity + '</strong><span>' + a.message + '</span>';
      wrap.appendChild(row);
    });
    host.insertBefore(wrap, host.firstChild);
  }

  // ── Demo-mode / last-sync indicator ──
  function paintSyncIndicator(meta) {
    var existing = document.getElementById('cf-sync-badge');
    if (existing) existing.remove();

    var badge = document.createElement('div');
    badge.id = 'cf-sync-badge';
    badge.style.cssText = 'position:fixed;top:12px;right:16px;z-index:150;padding:4px 10px;border-radius:2px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;';

    if (meta.demo_mode) {
      badge.style.cssText += 'background:#C4884A;color:#fff';
      badge.textContent = 'Demo Data';
    } else {
      badge.style.cssText += 'background:#22C55E;color:#fff';
      var t = meta.last_sync_at ? new Date(meta.last_sync_at) : null;
      badge.textContent = 'Live' + (t ? ' · synced ' + timeAgo(t) : '');
    }
    document.body.appendChild(badge);
  }

  function timeAgo(date) {
    var sec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (sec < 60) return 'just now';
    if (sec < 3600) return Math.floor(sec / 60) + 'm ago';
    if (sec < 86400) return Math.floor(sec / 3600) + 'h ago';
    return Math.floor(sec / 86400) + 'd ago';
  }

  // ── Re-fire any page-level animation that reads data-* attrs ──
  function reanimate() {
    document.querySelectorAll('[data-w]').forEach(function(b) { b.style.width = b.getAttribute('data-w'); });
    document.querySelectorAll('[data-h]').forEach(function(b) { b.style.height = b.getAttribute('data-h'); });
  }

  // ── Main run ──
  async function run() {
    var token = await getToken();
    if (!token) {
      console.warn('[CFO brain] no session');
      return;
    }

    try {
      var resp = await fetch(BASE + '/cfo-command-center', {
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      });

      if (resp.status === 403) {
        var err = await resp.json().catch(function() { return {}; });
        console.warn('[CFO brain] access denied, redirecting to user home');
        // Ask verify-session for user's actual dashboard_role, then redirect
        var vs = await fetch(BASE + '/verify-session', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        });
        var vsData = await vs.json().catch(function() { return {}; });
        var role = (vsData.user && vsData.user.dashboard_role) || 'standard';
        window.location.href = '/' + role;
        return;
      }

      if (!resp.ok) {
        console.warn('[CFO brain] API error', resp.status);
        return;
      }

      var data = await resp.json();

      paintSyncIndicator(data.meta || {});

      if (data.meta && data.meta.demo_mode) {
        console.log('[CFO brain] demo mode — designed values preserved');
        return;
      }

      paintKPIs(data.kpis || {});
      paintPL(data.kpis || {}, data.pl || {});
      paintPLBars(data.bars || {});
      paintCashBars(data.cash_bars || []);
      paintAlerts(data.alerts || []);

      // Page's own animateBars/animateCounters fires at setTimeout 400ms.
      // Re-fire our values at 700ms so they animate to the live numbers.
      setTimeout(reanimate, 700);

      window.CF_COMMAND_DATA = data; // expose for copilot + debug
      document.dispatchEvent(new CustomEvent('cf:command-loaded', { detail: data }));

      console.log('[CFO brain] painted live dashboard', {
        revenue: data.kpis.revenue,
        alerts: (data.alerts || []).length,
        bars: data.bars,
      });
    } catch (e) {
      console.warn('[CFO brain] error', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
