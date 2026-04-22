/* Castford CFO Subpage Shell v1
   Provides consistent nav, header, and theme across /cfo/pnl, /cfo/cash,
   /cfo/budget, /cfo/forecast.

   Injects: global styles, top header bar, tab nav, back button.
   Expects: <body> with <main class="cfo-page"> container.
*/
(function() {
  'use strict';

  // ── Theme CSS (matches hub) ──
  var css = `
    :root {
      --denim: #5B7FCC;
      --denim-dk: #4B6FB8;
      --gold: #C4884A;
      --ink: #0a0e1a;
      --ink-2: #151a2b;
      --panel: #1a1f33;
      --panel-border: rgba(255,255,255,0.06);
      --text-1: #F1F3F9;
      --text-2: #94A3B8;
      --text-3: #64748B;
      --green: #22C55E;
      --amber: #F59E0B;
      --rose: #EF4444;
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0;
      background: var(--ink);
      color: var(--text-1);
      font-family: 'Instrument Sans', 'DM Sans', system-ui, sans-serif;
      font-feature-settings: 'ss01', 'ss02';
      min-height: 100vh;
    }
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image:
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(91,127,204,0.1), transparent 60%),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'><path d='M30 1 L58 16 L58 36 L30 51 L2 36 L2 16 Z' fill='none' stroke='rgba(91,127,204,0.05)' stroke-width='1'/></svg>");
      background-size: auto, 60px 52px;
      pointer-events: none; z-index: 0;
    }
    .cfo-header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(10,14,26,0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--panel-border);
      padding: 14px 32px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 24px;
    }
    .cfo-brand {
      display: flex; align-items: center; gap: 12px;
      font-size: 14px; font-weight: 700; letter-spacing: 0.01em;
    }
    .cfo-brand-mark {
      width: 28px; height: 28px; border-radius: 2px;
      background: linear-gradient(135deg, var(--denim), var(--gold));
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 800; font-size: 14px;
    }
    .cfo-back {
      color: var(--text-2); text-decoration: none;
      font-size: 12px; font-weight: 600;
      letter-spacing: 0.06em; text-transform: uppercase;
      display: flex; align-items: center; gap: 6px;
      padding: 6px 10px;
      border: 1px solid var(--panel-border);
      border-radius: 2px;
      transition: all 0.15s;
    }
    .cfo-back:hover { color: var(--text-1); border-color: var(--denim); }
    .cfo-tabs {
      display: flex; gap: 2px;
      border-bottom: 1px solid var(--panel-border);
      padding: 0 32px;
      background: rgba(26,31,51,0.5);
      position: sticky; top: 57px; z-index: 99;
      backdrop-filter: blur(12px);
    }
    .cfo-tab {
      padding: 14px 20px;
      color: var(--text-3);
      text-decoration: none;
      font-size: 13px; font-weight: 600;
      letter-spacing: 0.02em;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: all 0.15s;
    }
    .cfo-tab:hover { color: var(--text-1); }
    .cfo-tab.active {
      color: var(--text-1);
      border-bottom-color: var(--denim);
    }
    .cfo-page {
      position: relative; z-index: 1;
      max-width: 1440px;
      margin: 0 auto;
      padding: 32px;
    }
    .cfo-title {
      font-family: 'Instrument Serif', Georgia, serif;
      font-size: 42px;
      line-height: 1.1;
      font-weight: 400;
      letter-spacing: -0.02em;
      margin: 0 0 8px;
    }
    .cfo-subtitle {
      color: var(--text-2);
      font-size: 14px;
      margin: 0 0 32px;
    }
    .cfo-panel {
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 2px;
      padding: 24px;
      margin-bottom: 20px;
    }
    .cfo-panel-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-3);
      margin: 0 0 16px;
    }
    .cfo-kpi-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }
    .cfo-kpi-card {
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 2px;
      padding: 18px 20px;
    }
    .cfo-kpi-card .k-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-3);
      margin-bottom: 8px;
    }
    .cfo-kpi-card .k-value {
      font-family: 'Geist Mono', 'SF Mono', Menlo, monospace;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--text-1);
    }
    .cfo-kpi-card .k-delta {
      display: inline-block;
      margin-top: 8px;
      padding: 2px 8px;
      background: rgba(34,197,94,0.1);
      color: var(--green);
      font-size: 11px;
      font-weight: 600;
      border-radius: 2px;
    }
    .cfo-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .cfo-table th {
      text-align: left;
      padding: 10px 12px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-3);
      border-bottom: 1px solid var(--panel-border);
    }
    .cfo-table th.num, .cfo-table td.num {
      text-align: right;
      font-family: 'Geist Mono', 'SF Mono', Menlo, monospace;
    }
    .cfo-table td {
      padding: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      color: var(--text-1);
    }
    .cfo-table tr:hover { background: rgba(91,127,204,0.03); }
    .cfo-table .section-row td {
      font-weight: 700;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: var(--denim);
      background: rgba(91,127,204,0.05);
    }
    .cfo-table .total-row td {
      font-weight: 700;
      border-top: 2px solid var(--panel-border);
      border-bottom: none;
    }
    .cfo-bar-track {
      display: inline-block;
      width: 100px;
      height: 6px;
      background: rgba(255,255,255,0.05);
      border-radius: 1px;
      position: relative;
      vertical-align: middle;
    }
    .cfo-bar-fill {
      height: 100%;
      border-radius: 1px;
      transition: width 0.8s ease;
    }
    .cfo-var-pos { color: var(--green); }
    .cfo-var-neg { color: var(--rose); }
    .cfo-loading {
      padding: 80px 0;
      text-align: center;
      color: var(--text-3);
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .cfo-sync-badge {
      position: fixed;
      top: 12px;
      right: 16px;
      z-index: 150;
      padding: 4px 10px;
      border-radius: 2px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media (max-width: 860px) {
      .grid-2 { grid-template-columns: 1fr; }
      .cfo-page { padding: 20px; }
      .cfo-title { font-size: 32px; }
    }
  `;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── Header + tabs injection ──
  var page = (window.__CFO_PAGE || '').toLowerCase(); // set by each subpage before loading shell
  var TABS = [
    { href: '/cfo',          label: 'Overview' },
    { href: '/cfo/pnl',      label: 'P&L' },
    { href: '/cfo/cash',     label: 'Cash' },
    { href: '/cfo/budget',   label: 'Budget' },
    { href: '/cfo/forecast', label: 'Forecast' },
  ];

  function buildHeader() {
    var header = document.createElement('div');
    header.className = 'cfo-header';
    header.innerHTML =
      '<div class="cfo-brand">' +
        '<div class="cfo-brand-mark">C</div>' +
        '<div>Castford · <span style="color:var(--text-2);font-weight:500">Financial Command</span></div>' +
      '</div>' +
      '<a href="/cfo" class="cfo-back">← Back to Hub</a>';

    var tabs = document.createElement('nav');
    tabs.className = 'cfo-tabs';
    TABS.forEach(function(t) {
      var a = document.createElement('a');
      a.href = t.href;
      a.className = 'cfo-tab' + (t.href.endsWith('/' + page) || (page === 'overview' && t.href === '/cfo') ? ' active' : '');
      a.textContent = t.label;
      tabs.appendChild(a);
    });

    document.body.insertBefore(tabs, document.body.firstChild);
    document.body.insertBefore(header, document.body.firstChild);
  }

  function buildSyncBadge(meta) {
    var existing = document.querySelector('.cfo-sync-badge');
    if (existing) existing.remove();
    var badge = document.createElement('div');
    badge.className = 'cfo-sync-badge';
    if (!meta || meta.demo_mode) {
      badge.style.background = 'var(--gold)';
      badge.textContent = 'Demo Data';
    } else {
      badge.style.background = 'var(--green)';
      var t = meta.last_sync_at ? new Date(meta.last_sync_at) : null;
      badge.textContent = 'Live' + (t ? ' · ' + timeAgo(t) : '');
    }
    document.body.appendChild(badge);
  }
  function timeAgo(date) {
    var sec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (sec < 60) return 'just now';
    if (sec < 3600) return Math.floor(sec / 60) + 'm';
    if (sec < 86400) return Math.floor(sec / 3600) + 'h';
    return Math.floor(sec / 86400) + 'd';
  }

  // ── Shared formatters exposed globally ──
  window.CF = window.CF || {};
  window.CF.fmt = function(val) {
    var n = Number(val) || 0;
    var abs = Math.abs(n);
    if (abs >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
    if (abs >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (abs >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
    return '$' + Math.round(n).toLocaleString();
  };
  window.CF.pct = function(val) { return (Number(val) || 0).toFixed(1) + '%'; };
  window.CF.SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  window.CF.BASE = window.CF.SB_URL + '/functions/v1';

  window.CF.getToken = function() {
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
  };

  window.CF.fetchView = async function(view) {
    var token = await window.CF.getToken();
    if (!token) { window.location.href = '/login'; return null; }
    var resp = await fetch(window.CF.BASE + '/cfo-command-center?view=' + encodeURIComponent(view), {
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    });
    if (resp.status === 401 || resp.status === 403) {
      window.location.href = '/login';
      return null;
    }
    if (!resp.ok) return null;
    return resp.json();
  };

  window.CF.buildSyncBadge = buildSyncBadge;

  // Build the header/tabs when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHeader);
  } else {
    buildHeader();
  }
})();
