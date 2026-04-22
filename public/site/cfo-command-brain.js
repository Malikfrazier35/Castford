/* Castford CFO Command Brain v2
   Hub orchestrator. Paints every KPI, delta, bar, sparkline, alert, and makes
   section cards navigable to /cfo/pnl, /cfo/cash, /cfo/budget, /cfo/forecast.

   Reads from: /functions/v1/cfo-command-center?view=hub
*/
(function() {
  'use strict';

  var SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  var BASE = SB_URL + '/functions/v1';

  // ── Formatters ──
  function fmt(val) {
    var n = Number(val) || 0;
    var abs = Math.abs(n);
    if (abs >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B';
    if (abs >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (abs >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
    return '$' + Math.round(n).toLocaleString();
  }
  function fmtNeg(val) {
    var n = Number(val) || 0;
    return n < 0 ? '(' + fmt(Math.abs(n)) + ')' : fmt(n);
  }
  function pct(val) { return (Number(val) || 0).toFixed(1) + '%'; }
  function delta(val, suffix) {
    if (val === null || val === undefined || isNaN(val)) return null;
    var sign = val >= 0 ? '▲' : '▼';
    return sign + ' ' + Math.abs(val).toFixed(1) + (suffix || '%');
  }
  function deltaColor(val) {
    if (val === null || val === undefined) return 'var(--text-3,#94a3b8)';
    return val >= 0 ? 'var(--green,#22C55E)' : 'var(--rose,#EF4444)';
  }

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

  // ── Find KPI card by label text ──
  function findCardByLabel(predicate) {
    var cards = document.querySelectorAll('.kpi, .kpi-card, .metric-card, [class*="kpi-"], [class*="metric-"]');
    for (var i = 0; i < cards.length; i++) {
      var label = cards[i].querySelector('.kpi-label, .metric-label, .stat-label, h4, h3, .label');
      if (label && predicate((label.textContent || '').trim().toLowerCase())) return cards[i];
    }
    return null;
  }
  function setValue(card, text) {
    if (!card) return;
    var val = card.querySelector('.kpi-val, .kpi-value, .metric-val, .stat-val, .value, .amount');
    if (val) val.textContent = text;
  }
  function setDelta(card, text, color) {
    if (!card || !text) return;
    // Find existing delta pill (typical class patterns)
    var pill = card.querySelector('.kpi-delta, .kpi-trend, .metric-delta, .trend-pill, [class*="delta"], [class*="trend"]');
    if (pill) {
      pill.textContent = text;
      if (color) pill.style.color = color;
    }
  }

  // ── Paint KPIs with their YoY/QoQ deltas ──
  function paintKPIs(kpis, deltas) {
    var specs = [
      { match: function(t) { return t.indexOf('revenue') > -1 && t.indexOf('recurring') === -1; }, val: fmt(kpis.revenue), delta: delta(deltas.revenue_yoy), dcolor: deltaColor(deltas.revenue_yoy), dsuf: 'YoY' },
      { match: function(t) { return t.indexOf('gross margin') > -1; }, val: pct(kpis.gross_margin), delta: delta(deltas.gross_margin_qoq, 'pts'), dcolor: deltaColor(deltas.gross_margin_qoq), dsuf: 'QoQ' },
      { match: function(t) { return t.indexOf('gross profit') > -1; }, val: fmt(kpis.gross_profit), delta: null, dcolor: null, dsuf: null },
      { match: function(t) { return t.indexOf('net income') > -1 || t.indexOf('net profit') > -1; }, val: fmt(kpis.net_income), delta: delta(deltas.net_income_yoy), dcolor: deltaColor(deltas.net_income_yoy), dsuf: 'YoY' },
      { match: function(t) { return t.indexOf('net margin') > -1; }, val: pct(kpis.net_margin), delta: null, dcolor: null, dsuf: null },
      { match: function(t) { return t.indexOf('opex') > -1 || t.indexOf('operating expense') > -1; }, val: fmt(kpis.opex), delta: null, dcolor: null, dsuf: null },
      { match: function(t) { return t.indexOf('cogs') > -1 || t.indexOf('cost of revenue') > -1; }, val: fmt(kpis.cogs), delta: null, dcolor: null, dsuf: null },
      { match: function(t) { return t.indexOf('operating cash') > -1; }, val: fmt(kpis.operating_cash_flow), delta: delta(deltas.ocf_qoq), dcolor: deltaColor(deltas.ocf_qoq), dsuf: 'QoQ' },
      { match: function(t) { return t === 'roic' || t.indexOf('roic') > -1 || t.indexOf('return on') > -1; }, val: pct(kpis.roic), delta: delta(deltas.roic_yoy, 'pts'), dcolor: deltaColor(deltas.roic_yoy), dsuf: 'YoY' },
      { match: function(t) { return t.indexOf('burn rate') > -1 || t === 'burn'; }, val: fmt(kpis.burn_rate), delta: kpis.burn_status ? kpis.burn_status.charAt(0).toUpperCase() + kpis.burn_status.slice(1) : null, dcolor: kpis.burn_status === 'profitable' ? 'var(--green,#22C55E)' : kpis.burn_status === 'stable' ? 'var(--text-2,#475569)' : 'var(--rose,#EF4444)', dsuf: null },
      { match: function(t) { return t.indexOf('cash position') > -1; }, val: fmt(kpis.cash_position), delta: null, dcolor: null, dsuf: null },
      { match: function(t) { return t.indexOf('ebitda') > -1; }, val: fmt(kpis.ebitda || kpis.net_income), delta: null, dcolor: null, dsuf: null },
    ];

    specs.forEach(function(spec) {
      var card = findCardByLabel(spec.match);
      if (!card) return;
      setValue(card, spec.val);
      if (spec.delta) setDelta(card, spec.delta + (spec.dsuf ? ' ' + spec.dsuf : ''), spec.dcolor);
    });
  }

  // ── Paint P&L top-level rows + sub-lines ──
  function paintPL(kpis) {
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
  }

  // ── P&L bars (Actual / Budget) ──
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

  // ── Cash bars (6 months, normalized) ──
  function paintCashBars(cashBars) {
    if (!cashBars || !cashBars.length) return;
    var bars = document.querySelectorAll('.cash-bars .cash-bar');
    if (!bars.length) return;
    bars.forEach(function(bar, i) {
      var data = cashBars[i];
      if (!data) return;
      bar.setAttribute('data-h', (data.pct || 0) + '%');
      bar.style.height = (data.pct || 0) + '%';
      var labelEl = bar.querySelector('.cash-bar-label');
      if (labelEl && data.label) labelEl.textContent = data.label;
    });
  }

  // ── Sparklines (12 bars inside a card, e.g. net income, burn rate) ──
  function paintSparklines(sparks) {
    function paintBars(container, series, color) {
      if (!container || !series || !series.length) return;
      var bars = container.querySelectorAll('.kpi-spark-bar, .spark-bar, [class*="spark"]');
      if (!bars.length) return;
      var abs = series.map(function(v) { return Math.abs(v); });
      var max = Math.max.apply(null, abs);
      if (max <= 0) return;
      bars.forEach(function(b, i) {
        var idx = series.length - bars.length + i;
        if (idx < 0) return;
        var val = series[idx];
        var pctH = Math.round(Math.abs(val) / max * 100);
        b.style.height = pctH + '%';
        if (color) b.style.background = color;
      });
    }

    var netCard = findCardByLabel(function(t) { return t.indexOf('net income') > -1; });
    if (netCard) paintBars(netCard, sparks.net_income, 'linear-gradient(to top,#C4884A,#E8AE66)');

    var burnCard = findCardByLabel(function(t) { return t.indexOf('burn') > -1; });
    if (burnCard) paintBars(burnCard, sparks.burn_rate, 'linear-gradient(to top,#DC2626,#EF4444)');
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
      var color = a.severity === 'critical' ? '#EF4444' : a.severity === 'warning' ? '#F59E0B' : '#3B82F6';
      var row = document.createElement('div');
      row.style.cssText = 'padding:10px 16px;border-left:3px solid ' + color + ';background:' + color + '1a;border-radius:2px;font-size:13px;color:var(--text-1,#0f172a);display:flex;align-items:center;gap:10px';
      row.innerHTML = '<strong style="font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:0.08em;color:' + color + '">' + a.severity + '</strong><span>' + a.message + '</span>';
      wrap.appendChild(row);
    });
    host.insertBefore(wrap, host.firstChild);
  }

  // ── Sync indicator ──
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
      badge.textContent = 'Live' + (t ? ' · ' + timeAgo(t) : '');
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

  // ── Make section panels clickable (P&L Statement → /cfo/pnl, etc.) ──
  function wireSectionLinks() {
    // Find panels by their heading text, wrap in anchor
    var mappings = [
      { match: /p&l statement|p & l|pnl/i, href: '/cfo/pnl' },
      { match: /cash position|cash flow/i, href: '/cfo/cash' },
      { match: /budget/i, href: '/cfo/budget' },
      { match: /forecast/i, href: '/cfo/forecast' },
    ];

    document.querySelectorAll('.panel, .section, .dash-section, [class*="panel"], [class*="section"]').forEach(function(panel) {
      if (panel.getAttribute('data-cf-linked') === '1') return;
      var heading = panel.querySelector('h2, h3, .panel-title, .section-title');
      if (!heading) return;
      var text = (heading.textContent || '').trim();
      var match = mappings.find(function(m) { return m.match.test(text); });
      if (!match) return;

      panel.setAttribute('data-cf-linked', '1');
      panel.style.cursor = 'pointer';
      panel.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
      panel.addEventListener('click', function(e) {
        if (e.target.closest('button, a, input, select')) return;
        window.location.href = match.href;
      });
      panel.addEventListener('mouseenter', function() {
        panel.style.transform = 'translateY(-2px)';
        panel.style.boxShadow = '0 8px 20px rgba(91,127,204,0.15)';
      });
      panel.addEventListener('mouseleave', function() {
        panel.style.transform = '';
        panel.style.boxShadow = '';
      });

      // Add chevron indicator
      if (!heading.querySelector('.cf-chevron')) {
        var chevron = document.createElement('span');
        chevron.className = 'cf-chevron';
        chevron.style.cssText = 'margin-left:8px;color:var(--denim,#5B7FCC);font-weight:600';
        chevron.textContent = '→';
        heading.appendChild(chevron);
      }
    });
  }

  function reanimate() {
    document.querySelectorAll('[data-w]').forEach(function(b) { b.style.width = b.getAttribute('data-w'); });
    document.querySelectorAll('[data-h]').forEach(function(b) { b.style.height = b.getAttribute('data-h'); });
  }

  async function run() {
    var token = await getToken();
    if (!token) { console.warn('[CFO brain v2] no session'); return; }

    try {
      var resp = await fetch(BASE + '/cfo-command-center?view=hub', {
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      });

      if (resp.status === 403) {
        var vs = await fetch(BASE + '/verify-session', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        });
        var vsData = await vs.json().catch(function() { return {}; });
        var role = (vsData.user && vsData.user.dashboard_role) || 'standard';
        window.location.href = '/' + role;
        return;
      }
      if (!resp.ok) { console.warn('[CFO brain v2] API error', resp.status); return; }

      var data = await resp.json();
      paintSyncIndicator(data.meta || {});
      wireSectionLinks();

      if (data.meta && data.meta.demo_mode) {
        console.log('[CFO brain v2] demo mode — designed values preserved');
        return;
      }

      paintKPIs(data.kpis || {}, data.deltas || {});
      paintPL(data.kpis || {});
      paintPLBars(data.bars || {});
      paintCashBars(data.cash_bars || []);
      paintSparklines(data.sparklines || {});
      paintAlerts(data.alerts || []);

      setTimeout(reanimate, 700);

      window.CF_COMMAND_DATA = data;
      document.dispatchEvent(new CustomEvent('cf:command-loaded', { detail: data }));
      console.log('[CFO brain v2] painted live dashboard', { revenue: data.kpis.revenue, deltas: data.deltas, alerts: (data.alerts || []).length });
    } catch (e) {
      console.warn('[CFO brain v2] error', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
