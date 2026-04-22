/* Castford Dashboard Engine v1
 *
 * One renderer for all role-based dashboards.
 * Reads a JSON config + canonical data shape, renders DOM.
 *
 * Used by: /ceo, /fpa, /controller (Session 2B+)
 * Future: /cfo migration, CFO Hub standalone customers (Session 6)
 *
 * NOT used by: existing /cfo (still uses cfo.html + cfo-command-brain.js v7)
 *
 * Panel types supported in v1:
 *   - kpi_grid       — row/grid of KPI cards
 *   - cash_trend     — monthly net cash bar chart
 *   - cash_position  — cash + runway summary card
 *   - simple_table   — generic data table (rows from data path)
 *   - placeholder    — "coming soon" / locked / setup-required state
 *
 * Adding a new panel type = adding one renderer function. No engine changes.
 */
(function(global) {
  'use strict';

  var BASE = 'https://crecesswagluelvkesul.supabase.co/functions/v1';
  var SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTU0NTAsImV4cCI6MjA3NjA5MTQ1MH0.h7nBkfmZHLbuzqJxhX6lgfRFWxgjYuxl5d2SbkRSaCk';

  var COLORS = {
    denim: '#5B7FCC', gold: '#C4884A', cyan: '#0EA5E9',
    rose: '#EF4444', green: '#22C55E', amber: '#F59E0B',
  };

  // ───────────── UTILITIES ─────────────

  function normalizeLabel(raw) {
    return (raw || '').replace(/^[\s\W]+/, '').trim().toLowerCase();
  }

  // Walk "kpis.cash_position" → data.kpis.cash_position
  function getValue(obj, path) {
    if (!path || !obj) return null;
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return null;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function formatValue(val, format) {
    if (val == null || val === undefined) return '—';
    var n = Number(val);
    switch (format) {
      case 'currency_short': {
        if (isNaN(n)) return '—';
        var a = Math.abs(n);
        if (a >= 1e9) return '$' + (n/1e9).toFixed(1) + 'B';
        if (a >= 1e6) return '$' + (n/1e6).toFixed(1) + 'M';
        if (a >= 1e3) return '$' + (n/1e3).toFixed(0) + 'K';
        return '$' + n.toFixed(0);
      }
      case 'currency_short_or_profitable':
        return n === 0 ? '$0' : formatValue(n, 'currency_short') + '/mo';
      case 'percent':
        return isNaN(n) ? '—' : n.toFixed(1) + '%';
      case 'percent_signed':
        return isNaN(n) ? '—' : (n >= 0 ? '+' : '') + n.toFixed(1) + '%';
      case 'months':
        return val === null ? '∞' : Math.floor(n) + ' mo';
      case 'months_or_indefinite':
        return val === null ? 'Indefinite' : Math.floor(n) + ' months';
      case 'integer':
        return isNaN(n) ? '—' : Math.round(n).toLocaleString();
      case 'date_relative':
        if (!val) return 'Never';
        var d = new Date(val);
        var min = Math.floor((Date.now() - d.getTime()) / 60000);
        if (min < 1) return 'Just now';
        if (min < 60) return min + 'm ago';
        if (min < 1440) return Math.floor(min/60) + 'h ago';
        return Math.floor(min/1440) + 'd ago';
      default:
        return String(val);
    }
  }

  function colorForValue(val, logic) {
    var n = Number(val);
    if (logic === 'runway_urgency') {
      if (val == null) return COLORS.green;
      if (n < 6) return COLORS.rose;
      if (n < 12) return COLORS.amber;
      return COLORS.green;
    }
    if (logic === 'green_if_positive') {
      return n >= 0 ? COLORS.green : COLORS.rose;
    }
    if (logic === 'green_if_negative') {
      return n <= 0 ? COLORS.green : COLORS.rose;
    }
    return null; // use default
  }

  // ───────────── AUTH ─────────────

  async function getToken() {
    try {
      if (global.supabase && global.supabase.createClient) {
        var c = global.supabase.createClient(SB_URL, SB_KEY);
        var s = await c.auth.getSession();
        if (s.data && s.data.session) return s.data.session.access_token;
      }
    } catch (e) {}
    try {
      if (global.__fos_session && global.__fos_session.access_token) return global.__fos_session.access_token;
      if (global.__fos_supabase) {
        var s2 = await global.__fos_supabase.auth.getSession();
        if (s2.data && s2.data.session) return s2.data.session.access_token;
      }
    } catch (e) {}
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (/^sb-.*-auth-token$/.test(k)) {
          var v = JSON.parse(localStorage.getItem(k));
          if (v && v.access_token) return v.access_token;
          if (v && v.currentSession && v.currentSession.access_token) return v.currentSession.access_token;
        }
      }
    } catch (e) {}
    return null;
  }

  // ───────────── TOOLTIP ─────────────

  var Tooltip = (function() {
    var el = null;
    function ensure() {
      if (el) return el;
      el = document.createElement('div');
      el.className = 'cfo-tooltip';
      el.style.cssText = 'position:fixed;background:rgba(15,23,42,0.96);color:#fff;padding:10px 14px;border-radius:6px;font-size:12px;font-family:Instrument Sans,-apple-system,sans-serif;pointer-events:none;z-index:99999;opacity:0;transition:opacity 0.15s;border:1px solid rgba(91,127,204,0.3);box-shadow:0 6px 16px rgba(0,0,0,0.4);max-width:280px;line-height:1.5;display:none';
      document.body.appendChild(el);
      return el;
    }
    function show(target, html) {
      var t = ensure();
      t.innerHTML = html; t.style.display = 'block'; t.style.opacity = '0';
      var rect = target.getBoundingClientRect();
      var tipRect = t.getBoundingClientRect();
      var top = rect.top - tipRect.height - 10;
      var left = rect.left + rect.width/2 - tipRect.width/2;
      if (top < 8) top = rect.bottom + 10;
      if (left < 8) left = 8;
      if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - tipRect.width - 8;
      t.style.top = top + 'px'; t.style.left = left + 'px';
      requestAnimationFrame(function() { t.style.opacity = '1'; });
    }
    function hide() {
      if (el) { el.style.opacity = '0'; setTimeout(function() { if (el && el.style.opacity === '0') el.style.display = 'none'; }, 200); }
    }
    function attach(target, html) {
      target.addEventListener('mouseenter', function() { show(target, typeof html === 'function' ? html(target) : html); });
      target.addEventListener('mouseleave', hide);
    }
    return { attach: attach, show: show, hide: hide };
  })();

  // ───────────── SHELL INJECTION ─────────────

  function injectStyles() {
    if (document.getElementById('engine-css')) return;
    var css = document.createElement('style');
    css.id = 'engine-css';
    css.textContent = `
      :root { --denim:#5B7FCC; --gold:#C4884A; --rose:#EF4444; --green:#22C55E; --amber:#F59E0B; --cyan:#0EA5E9;
        --bg:#0a0e1a; --panel:rgba(15,23,42,0.6); --panel-border:rgba(91,127,204,0.15);
        --text-1:#e2e8f0; --text-2:#94a3b8; --text-3:#64748b; }
      body { background:var(--bg) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='35' viewBox='0 0 40 35'%3E%3Cpath fill='none' stroke='%235B7FCC' stroke-width='0.3' opacity='0.08' d='M20 0 L40 11.5 L40 23.5 L20 35 L0 23.5 L0 11.5 Z'/%3E%3C/svg%3E");
        color:var(--text-1); font-family:'Instrument Sans',-apple-system,sans-serif; margin:0; min-height:100vh; }
      .eng-page { max-width:1400px; margin:0 auto; padding:32px 40px 80px; }
      .eng-title { font-family:'Instrument Serif',serif; font-size:42px; font-weight:400; margin:0 0 8px; letter-spacing:-0.02em; }
      .eng-subtitle { color:var(--text-3); font-size:14px; margin:0 0 32px; }
      .eng-kpi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; margin-bottom:32px; }
      .eng-kpi-card { background:var(--panel); border:1px solid var(--panel-border); border-radius:2px; padding:24px; transition:border-color 0.15s,transform 0.15s; cursor:default; }
      .eng-kpi-card.clickable { cursor:pointer; }
      .eng-kpi-card.clickable:hover { border-color:rgba(91,127,204,0.4); transform:translateY(-2px); }
      .eng-kpi-label { font-size:10px; color:var(--text-3); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:10px; font-weight:600; }
      .eng-kpi-value { font-family:'Geist Mono',monospace; font-size:32px; color:var(--text-1); font-weight:600; letter-spacing:-0.02em; line-height:1; }
      .eng-kpi-delta { display:inline-block; font-size:10px; padding:3px 8px; border-radius:1px; font-weight:600; margin-top:10px; letter-spacing:0.04em; background:rgba(91,127,204,0.1); color:var(--denim); }
      .eng-kpi-delta.up { background:rgba(34,197,94,0.1); color:var(--green); }
      .eng-kpi-delta.down { background:rgba(239,68,68,0.1); color:var(--rose); }
      .eng-panel { background:var(--panel); border:1px solid var(--panel-border); border-radius:2px; padding:28px; margin-bottom:24px; }
      .eng-panel-title { font-size:13px; color:var(--text-1); font-weight:700; text-transform:uppercase; letter-spacing:0.12em; margin:0 0 20px; display:flex; align-items:center; justify-content:space-between; }
      .eng-panel-title .arrow { color:var(--denim); font-size:14px; opacity:0.7; transition:transform 0.15s,opacity 0.15s; }
      .eng-panel-title.clickable { cursor:pointer; }
      .eng-panel-title.clickable:hover { color:var(--denim); }
      .eng-panel-title.clickable:hover .arrow { transform:translateX(4px); opacity:1; }
      .eng-loading { color:var(--text-3); padding:40px 0; text-align:center; font-size:13px; }
      .eng-empty { color:var(--text-3); padding:32px 0; text-align:center; font-size:13px; }
      .eng-error { color:var(--rose); padding:16px; background:rgba(239,68,68,0.05); border-left:3px solid var(--rose); border-radius:1px; }
      .eng-meta-bar { background:rgba(196,136,74,0.08); border-left:2px solid var(--gold); padding:10px 14px; font-size:11px; color:var(--text-2); margin-bottom:24px; border-radius:1px; }
      .cfo-quicknav { animation:engFadeDown 0.5s ease-out; }
      @keyframes engFadeDown { 0% { opacity:0; transform:translateY(-8px); } 100% { opacity:1; transform:translateY(0); } }
      @keyframes engPulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      .eng-pulse { animation:engPulse 2s ease-in-out infinite; }
      @media (max-width:768px) { .eng-page { padding:24px 20px 60px; } .eng-title { font-size:32px; } }
    `;
    document.head.appendChild(css);
  }

  function injectQuicknav(currentRole, allowedRoles) {
    if (document.querySelector('.cfo-quicknav')) return;
    var nav = document.createElement('div');
    nav.className = 'cfo-quicknav';
    nav.style.cssText = 'position:fixed;top:80px;right:24px;display:flex;gap:4px;background:rgba(15,23,42,0.85);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid rgba(91,127,204,0.25);border-radius:24px;padding:5px;z-index:9999;font-family:Instrument Sans,-apple-system,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.3)';
    var allPages = [
      { url:'/cfo', label:'CFO', role:'cfo' },
      { url:'/ceo', label:'Founder', role:'ceo' },
      { url:'/controller', label:'Controller', role:'controller' },
      { url:'/fpa', label:'FP&A', role:'fpa' },
    ];
    var path = window.location.pathname.replace(/\/$/, '');
    allPages.forEach(function(p) {
      var locked = allowedRoles && !allowedRoles.includes(p.role);
      var current = path === p.url || currentRole === p.role;
      var btn = document.createElement('a');
      btn.href = locked ? '#' : p.url;
      btn.textContent = p.label + (locked ? ' 🔒' : '');
      btn.style.cssText = 'padding:6px 14px;border-radius:18px;font-size:11px;font-weight:600;letter-spacing:0.04em;text-decoration:none;transition:all 0.15s;color:' + (current ? '#fff' : locked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.55)') + ';background:' + (current ? COLORS.denim : 'transparent') + (locked ? ';cursor:not-allowed' : '');
      if (locked) {
        btn.title = 'Upgrade to access ' + p.label + ' dashboard';
        btn.addEventListener('click', function(e) { e.preventDefault(); alert('Upgrade your plan to access the ' + p.label + ' dashboard.'); });
      } else if (!current) {
        btn.addEventListener('mouseenter', function() { btn.style.color = '#fff'; btn.style.background = 'rgba(91,127,204,0.2)'; });
        btn.addEventListener('mouseleave', function() { btn.style.color = 'rgba(255,255,255,0.55)'; btn.style.background = 'transparent'; });
      }
      nav.appendChild(btn);
    });
    document.body.appendChild(nav);
  }

  // ───────────── PANEL RENDERERS ─────────────

  function renderKPICard(card, data) {
    var val = getValue(data, card.data_path);
    var formatted = formatValue(val, card.format || 'currency_short');
    var color = card.color_logic ? colorForValue(val, card.color_logic) : null;
    var delta = card.delta_path ? getValue(data, card.delta_path) : null;
    var deltaClass = 'eng-kpi-delta';
    var deltaTxt = '';
    if (delta != null && !isNaN(Number(delta))) {
      var n = Number(delta);
      deltaClass += ' ' + (n >= 0 ? 'up' : 'down');
      deltaTxt = (n >= 0 ? '▲ ' : '▼ ') + Math.abs(n).toFixed(1) + '% ' + (card.delta_label || '');
    } else if (card.no_delta_text) {
      deltaTxt = card.no_delta_text;
    }
    var styleColor = color ? ';color:' + color : '';
    var clickable = card.drill_to ? ' clickable' : '';
    var html = '<div class="eng-kpi-card' + clickable + '"' + (card.drill_to ? ' data-drill="' + card.drill_to + '"' : '') + '>' +
      '<div class="eng-kpi-label">' + card.label + '</div>' +
      '<div class="eng-kpi-value" style="' + styleColor + '">' + formatted + '</div>' +
      (deltaTxt ? '<div class="' + deltaClass + '">' + deltaTxt + '</div>' : '') +
    '</div>';
    return html;
  }

  function renderKPIGrid(panel, data) {
    var cards = panel.cards || [];
    var html = '<div class="eng-kpi-grid">';
    cards.forEach(function(c) { html += renderKPICard(c, data); });
    html += '</div>';
    return wrapPanel(panel, html, false);
  }

  function renderTopKPIRow(cards, data) {
    var html = '<div class="eng-kpi-grid">';
    cards.forEach(function(c) { html += renderKPICard(c, data); });
    html += '</div>';
    return html;
  }

  function renderCashTrend(panel, data) {
    var trendData = getValue(data, panel.data_path) || [];
    if (!trendData.length) {
      return wrapPanel(panel, '<div class="eng-empty">No cash data yet. Connect QuickBooks to populate.</div>');
    }
    var field = panel.value_field || 'net';
    var max = Math.max.apply(null, trendData.map(function(m) { return Math.abs(m[field] || 0); }));
    if (max === 0) max = 1;
    var html = '<div style="display:flex;align-items:flex-end;justify-content:space-between;height:200px;gap:6px;padding:24px 0;border-bottom:1px solid var(--panel-border);position:relative">' +
      '<div style="position:absolute;left:0;right:0;top:50%;border-top:1px dashed var(--panel-border)"></div>';
    trendData.forEach(function(m, i) {
      var v = m[field] || 0;
      var pct = Math.abs(v) / max * 50;
      var pos = v >= 0;
      var color = pos ? COLORS.green : COLORS.rose;
      html += '<div data-trend-idx="' + i + '" class="eng-trend-bar" style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:center;cursor:pointer;transition:filter 0.15s">' +
        '<div style="width:100%;height:50%;display:flex;align-items:flex-end">' + (pos ? '<div style="width:100%;height:' + pct*2 + '%;background:linear-gradient(to top,' + color + ',rgba(255,255,255,0.05));border-radius:2px 2px 0 0;transition:height 0.8s ease"></div>' : '') + '</div>' +
        '<div style="width:100%;height:50%;display:flex;align-items:flex-start">' + (!pos ? '<div style="width:100%;height:' + pct*2 + '%;background:linear-gradient(to bottom,' + color + ',rgba(255,255,255,0.05));border-radius:0 0 2px 2px;transition:height 0.8s ease"></div>' : '') + '</div>' +
        '<div style="font-size:10px;color:var(--text-3);font-family:Geist Mono,monospace;margin-top:6px">' + (m.label || m.month) + '</div>' +
        '</div>';
    });
    html += '</div>';
    var content = wrapPanel(panel, html);

    setTimeout(function() {
      document.querySelectorAll('.eng-trend-bar').forEach(function(bar) {
        var idx = parseInt(bar.dataset.trendIdx, 10);
        var m = trendData[idx];
        if (!m) return;
        bar.addEventListener('mouseenter', function() { this.style.filter = 'brightness(1.2)'; });
        bar.addEventListener('mouseleave', function() { this.style.filter = ''; });
        var color = m[field] >= 0 ? COLORS.green : COLORS.rose;
        Tooltip.attach(bar,
          '<div style="font-weight:700;color:' + COLORS.denim + ';margin-bottom:6px;font-size:10px;text-transform:uppercase;letter-spacing:0.1em">' + (m.label || m.month) + '</div>' +
          (m.revenue != null ? '<div style="font-family:Geist Mono,monospace;font-size:11px;color:rgba(255,255,255,0.7)">Revenue: <span style="color:#fff">' + formatValue(m.revenue, 'currency_short') + '</span></div>' : '') +
          (m.opex != null ? '<div style="font-family:Geist Mono,monospace;font-size:11px;color:rgba(255,255,255,0.7);margin-bottom:6px">OpEx: <span style="color:#fff">' + formatValue(m.opex, 'currency_short') + '</span></div>' : '') +
          '<div style="padding-top:6px;border-top:1px solid rgba(255,255,255,0.1);font-family:Geist Mono,monospace;font-size:14px">Net: <span style="color:' + color + ';font-weight:700">' + formatValue(m[field], 'currency_short') + '</span></div>'
        );
      });
    }, 0);
    return content;
  }

  function renderCashPosition(panel, data) {
    var cash = getValue(data, panel.cash_path || 'kpis.cash_position');
    var burn = getValue(data, panel.burn_path || 'kpis.burn_rate_monthly');
    var runway = getValue(data, panel.runway_path || 'kpis.runway_months');
    var runwayColor = runway === null ? COLORS.green : runway < 6 ? COLORS.rose : runway < 12 ? COLORS.amber : COLORS.green;
    var runwayText = runway === null ? '∞' : runway + ' mo';
    var burnText = burn === 0 ? 'Profitable' : formatValue(burn, 'currency_short') + '/mo';

    var html = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;padding:8px 0">' +
      '<div><div style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;font-weight:600">Current Cash</div>' +
        '<div style="font-family:Geist Mono,monospace;font-size:32px;color:' + COLORS.denim + ';font-weight:700">' + formatValue(cash, 'currency_short') + '</div></div>' +
      '<div><div style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;font-weight:600">Monthly Burn</div>' +
        '<div style="font-family:Geist Mono,monospace;font-size:32px;color:var(--text-1);font-weight:700">' + burnText + '</div></div>' +
      '<div><div style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;font-weight:600">Runway</div>' +
        '<div style="font-family:Geist Mono,monospace;font-size:32px;color:' + runwayColor + ';font-weight:700">' + runwayText + '</div></div>' +
    '</div>';
    return wrapPanel(panel, html);
  }

  function renderPlaceholder(panel, data) {
    var html = '<div style="text-align:center;padding:40px 20px;background:rgba(91,127,204,0.05);border:1px dashed var(--panel-border);border-radius:2px">' +
      '<div style="font-size:32px;margin-bottom:12px;opacity:0.6">' + (panel.icon || '⏳') + '</div>' +
      '<div style="color:var(--text-1);font-weight:600;margin-bottom:6px">' + (panel.heading || 'Coming soon') + '</div>' +
      '<div style="color:var(--text-3);font-size:12px;max-width:400px;margin:0 auto">' + (panel.message || 'This feature is being built.') + '</div>' +
    '</div>';
    return wrapPanel(panel, html);
  }

  function renderSimpleTable(panel, data) {
    var rows = getValue(data, panel.data_path) || [];
    if (!rows.length) {
      return wrapPanel(panel, '<div class="eng-empty">No data yet.</div>');
    }
    var cols = panel.columns || [];
    var html = '<table style="width:100%;border-collapse:collapse;font-size:13px">';
    html += '<thead><tr>';
    cols.forEach(function(c) { html += '<th style="text-align:' + (c.align || 'left') + ';padding:10px 8px;color:var(--text-3);font-size:10px;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid var(--panel-border);font-weight:600">' + c.label + '</th>'; });
    html += '</tr></thead><tbody>';
    rows.forEach(function(row) {
      html += '<tr>';
      cols.forEach(function(c) {
        var v = getValue(row, c.field);
        var formatted = formatValue(v, c.format || 'integer');
        var align = c.align || 'left';
        var family = c.format && c.format.indexOf('currency') > -1 ? "'Geist Mono',monospace" : '';
        html += '<td style="padding:10px 8px;text-align:' + align + ';font-family:' + family + ';border-bottom:1px solid rgba(91,127,204,0.05);color:var(--text-1)">' + formatted + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    return wrapPanel(panel, html);
  }

  function wrapPanel(panel, contentHtml, addArrow) {
    if (addArrow === undefined) addArrow = true;
    var titleClass = panel.drill_to ? 'eng-panel-title clickable' : 'eng-panel-title';
    var arrow = (panel.drill_to && addArrow) ? '<span class="arrow">→</span>' : '';
    return '<div class="eng-panel"' + (panel.drill_to ? ' data-drill="' + panel.drill_to + '"' : '') + '>' +
      (panel.title ? '<div class="' + titleClass + '">' + panel.title + arrow + '</div>' : '') +
      contentHtml +
    '</div>';
  }

  var PANEL_RENDERERS = {
    kpi_grid: renderKPIGrid,
    cash_trend: renderCashTrend,
    cash_position: renderCashPosition,
    placeholder: renderPlaceholder,
    simple_table: renderSimpleTable,
  };

  // ───────────── ENGINE ORCHESTRATOR ─────────────

  function DashboardEngine(role) {
    this.role = role;
    this.config = null;
    this.data = null;
  }

  DashboardEngine.prototype.fetchConfig = async function() {
    var resp = await fetch('/site/dashboard/configs/' + this.role + '.json');
    if (!resp.ok) throw new Error('Config not found for role: ' + this.role);
    return await resp.json();
  };

  DashboardEngine.prototype.fetchData = async function() {
    var token = await getToken();
    if (!token) { window.location.href = '/login'; return null; }
    var resp = await fetch(BASE + '/dashboard-data?role=' + this.role, {
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    });
    if (resp.status === 401) { window.location.href = '/login'; return null; }
    if (resp.status === 403) {
      var err = await resp.json();
      throw new Error(err.error + ' (current tier: ' + err.tier + ', upgrade to: ' + err.upgrade_to + ')');
    }
    if (!resp.ok) throw new Error('Data fetch failed: HTTP ' + resp.status);
    return await resp.json();
  };

  DashboardEngine.prototype.render = function() {
    var page = document.getElementById('eng-page');
    if (!page) {
      console.error('[Engine] No #eng-page mount point');
      return;
    }
    var c = this.config;
    var d = this.data;

    // Header
    var header = '<h1 class="eng-title">' + (c.title || 'Dashboard') + '</h1>';
    if (c.subtitle) header += '<div class="eng-subtitle">' + c.subtitle + '</div>';
    if (d.meta && d.meta.demo_mode) {
      header += '<div class="eng-meta-bar">📊 You are viewing demo data — connect QuickBooks to see your real financials. <a href="/integrations" style="color:var(--gold);text-decoration:underline">Connect →</a></div>';
    } else if (d.meta && d.meta.last_sync_at) {
      header += '<div class="eng-meta-bar" style="background:rgba(34,197,94,0.05);border-left-color:var(--green)">✓ Live data · synced ' + formatValue(d.meta.last_sync_at, 'date_relative') + '</div>';
    }

    // Top KPI row
    var kpiRow = '';
    if (c.kpi_cards && c.kpi_cards.length) {
      kpiRow = renderTopKPIRow(c.kpi_cards, d);
    }

    // Panels
    var panels = '';
    if (c.panels && c.panels.length) {
      c.panels.forEach(function(panel) {
        var renderer = PANEL_RENDERERS[panel.type];
        if (renderer) {
          try { panels += renderer(panel, d); }
          catch (e) {
            console.error('[Engine] Panel render error:', panel.id, e);
            panels += '<div class="eng-panel"><div class="eng-error">Failed to render panel: ' + panel.id + '</div></div>';
          }
        } else {
          panels += '<div class="eng-panel"><div class="eng-error">Unknown panel type: ' + panel.type + '</div></div>';
        }
      });
    }

    page.innerHTML = header + kpiRow + panels;

    // Wire drill-down clicks
    page.querySelectorAll('[data-drill]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') return; // let regular links work
        window.location.href = el.dataset.drill;
      });
    });

    console.log('[Engine v1] rendered', this.role, 'config in', performance.now().toFixed(0) + 'ms');
  };

  DashboardEngine.prototype.boot = async function() {
    injectStyles();
    try {
      var configP = this.fetchConfig();
      var dataP = this.fetchData();
      this.config = await configP;
      this.data = await dataP;
      if (!this.data) return; // redirected to login
      // Quicknav uses data.meta.tier to determine locked dashboards
      var allowedRoles = (function() {
        var tier = this.data.meta.tier;
        var TIER_DASHBOARDS = {
          starter: ['ceo'],
          growth: ['ceo', 'controller', 'fpa'],
          business: ['ceo', 'controller', 'fpa', 'cfo'],
          enterprise: ['ceo', 'controller', 'fpa', 'cfo'],
        };
        return TIER_DASHBOARDS[tier] || [];
      }).call(this);
      injectQuicknav(this.role, allowedRoles);
      this.render();
    } catch (err) {
      console.error('[Engine] Boot error:', err);
      var page = document.getElementById('eng-page');
      if (page) page.innerHTML = '<div class="eng-error">' + err.message + '</div>';
    }
  };

  // Public API
  global.DashboardEngine = DashboardEngine;

  // Auto-boot if data-role on body or query string says so
  function autoBoot() {
    var role = (new URLSearchParams(window.location.search)).get('role')
      || document.body.dataset.role
      || 'ceo';
    var engine = new DashboardEngine(role);
    engine.boot();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoBoot);
  else autoBoot();

})(window);
