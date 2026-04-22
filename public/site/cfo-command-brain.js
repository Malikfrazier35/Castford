/* Castford CFO Command Brain v7
 * v7 over v6: TRIANGLE PREFIX FIX
 *
 * Bug discovered: P&L row labels have a leading "▶ " expand/collapse character
 * baked into the textContent. e.g. "▶ Revenue", "▶ COGS", "▶ Operating Expenses".
 * The previous strict-equality matcher (label === 'revenue') never matched these,
 * which is why $48.6M Revenue and $7.4M COGS demo values persisted across v3-v6.
 *
 * Fix: strip leading non-word characters before matching. One-line change in
 * paintPL/paintPLBars. Same defensive normalization applied to all label matchers.
 */
(function() {
  'use strict';

  var BASE = 'https://crecesswagluelvkesul.supabase.co/functions/v1';
  var SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTU0NTAsImV4cCI6MjA3NjA5MTQ1MH0.h7nBkfmZHLbuzqJxhX6lgfRFWxgjYuxl5d2SbkRSaCk';
  var DENIM = '#5B7FCC', GOLD = '#C4884A', CYAN = '#0EA5E9', ROSE = '#EF4444', GREEN = '#22C55E';

  // ★ THE FIX: normalize labels by stripping leading non-word chars (▶ ▼ • bullets etc.)
  function normalizeLabel(raw) {
    return (raw || '').replace(/^[\s\W]+/, '').trim().toLowerCase();
  }

  function fmt(v) {
    var n = Number(v) || 0; var a = Math.abs(n);
    if (a >= 1e9) return '$' + (n/1e9).toFixed(1) + 'B';
    if (a >= 1e6) return '$' + (n/1e6).toFixed(1) + 'M';
    if (a >= 1e3) return '$' + (n/1e3).toFixed(0) + 'K';
    return '$' + n.toFixed(0);
  }
  function fmtNeg(v) { return '(' + fmt(Math.abs(v)) + ')'; }

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
      t.innerHTML = html;
      t.style.display = 'block'; t.style.opacity = '0';
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
    function hide() { if (el) { el.style.opacity = '0'; setTimeout(function() { if (el && el.style.opacity === '0') el.style.display = 'none'; }, 200); } }
    function attach(target, htmlOrFn) {
      if (target.dataset.cfoTipWired === 'true') return;
      target.dataset.cfoTipWired = 'true';
      target.addEventListener('mouseenter', function() { show(target, typeof htmlOrFn === 'function' ? htmlOrFn(target) : htmlOrFn); });
      target.addEventListener('mouseleave', hide);
    }
    return { show: show, hide: hide, attach: attach };
  })();

  async function getToken() {
    try {
      if (window.supabase && window.supabase.createClient) {
        var c = window.supabase.createClient(SB_URL, SB_KEY);
        var s = await c.auth.getSession();
        if (s.data && s.data.session) return s.data.session.access_token;
      }
    } catch (e) {}
    try {
      if (window.__fos_session && window.__fos_session.access_token) return window.__fos_session.access_token;
      if (window.__fos_supabase) {
        var s2 = await window.__fos_supabase.auth.getSession();
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

  function paintKPIs(kpis, deltas) {
    var painted = 0;
    document.querySelectorAll('.kpi-card').forEach(function(card) {
      var labelEl = card.querySelector('.kpi-label');
      var valEl = card.querySelector('.kpi-value');
      var deltaEl = card.querySelector('.kpi-delta');
      if (!labelEl || !valEl) return;
      var label = normalizeLabel(labelEl.textContent);
      try {
        if (label === 'total revenue' || label === 'revenue') {
          valEl.textContent = fmt(kpis.revenue);
          if (deltaEl && deltas.revenue_yoy != null) {
            deltaEl.textContent = (deltas.revenue_yoy >= 0 ? '▲ ' : '▼ ') + Math.abs(deltas.revenue_yoy).toFixed(0) + '% YoY';
            deltaEl.className = 'kpi-delta ' + (deltas.revenue_yoy >= 0 ? 'up' : 'down');
          }
          painted++;
        } else if (label === 'gross margin') {
          valEl.textContent = (kpis.gross_margin || 0).toFixed(1) + '%';
          if (deltaEl && deltas.gross_margin_qoq != null) {
            deltaEl.textContent = (deltas.gross_margin_qoq >= 0 ? '▲ ' : '▼ ') + Math.abs(deltas.gross_margin_qoq).toFixed(1) + 'pts QoQ';
            deltaEl.className = 'kpi-delta ' + (deltas.gross_margin_qoq >= 0 ? 'up' : 'down');
          }
          painted++;
        } else if (label === 'operating cash flow' || label === 'ocf') {
          valEl.textContent = fmt(kpis.operating_cash_flow);
          if (deltaEl && deltas.ocf_qoq != null) {
            deltaEl.textContent = (deltas.ocf_qoq >= 0 ? '▲ ' : '▼ ') + Math.abs(deltas.ocf_qoq).toFixed(1) + '% QoQ';
            deltaEl.className = 'kpi-delta ' + (deltas.ocf_qoq >= 0 ? 'up' : 'down');
          }
          painted++;
        } else if (label === 'roic') {
          valEl.textContent = (kpis.roic || 0).toFixed(1) + '%';
          if (deltaEl && deltas.roic_yoy != null) {
            deltaEl.textContent = (deltas.roic_yoy >= 0 ? '▲ ' : '▼ ') + Math.abs(deltas.roic_yoy).toFixed(1) + 'pts YoY';
            deltaEl.className = 'kpi-delta ' + (deltas.roic_yoy >= 0 ? 'up' : 'down');
          }
          painted++;
        } else if (label === 'net income') {
          valEl.textContent = fmt(kpis.net_income);
          if (deltaEl && deltas.net_income_yoy != null) {
            deltaEl.textContent = (deltas.net_income_yoy >= 0 ? '▲ ' : '▼ ') + Math.abs(deltas.net_income_yoy).toFixed(0) + '% YoY';
            deltaEl.className = 'kpi-delta ' + (deltas.net_income_yoy >= 0 ? 'up' : 'down');
          }
          painted++;
        } else if (label === 'burn rate') {
          if (kpis.burn_rate === 0) {
            valEl.textContent = '$0';
            if (deltaEl) { deltaEl.textContent = 'Profitable'; deltaEl.className = 'kpi-delta up'; }
          } else {
            valEl.textContent = fmt(kpis.burn_rate) + '/mo';
            if (deltaEl) { deltaEl.textContent = kpis.burn_status || 'elevated'; deltaEl.className = 'kpi-delta down'; }
          }
          painted++;
        }
      } catch (e) {}
    });
    console.log('[CFO brain v7] KPIs painted:', painted, '/ 6');
  }

  function paintPL(kpis) {
    var painted = 0;
    var trace = [];
    document.querySelectorAll('.pl-row').forEach(function(row, idx) {
      var labelEl = row.querySelector('.pl-label');
      var valEl = row.querySelector('.pl-val');
      if (!labelEl || !valEl) return;
      var rawLabel = labelEl.textContent;
      var label = normalizeLabel(rawLabel);  // ★ stripped of leading ▶ etc.
      var action = 'no-match';
      try {
        if (label === 'revenue' || label === 'total revenue') {
          valEl.textContent = fmt(kpis.revenue); action = 'REV → ' + fmt(kpis.revenue); painted++;
        } else if (label === 'cogs' || label.indexOf('cost of') > -1) {
          valEl.textContent = fmtNeg(kpis.cogs); action = 'COGS → ' + fmtNeg(kpis.cogs); painted++;
        } else if (label === 'gross profit') {
          valEl.textContent = fmt(kpis.gross_profit);
          valEl.style.color = 'var(--green,#22C55E)';
          action = 'GP → ' + fmt(kpis.gross_profit); painted++;
        } else if (label === 'opex' || label === 'operating expenses' || label.indexOf('operating') > -1) {
          valEl.textContent = fmtNeg(kpis.opex); action = 'OPEX → ' + fmtNeg(kpis.opex); painted++;
        } else if (label === 'net income' || label === 'net profit') {
          valEl.textContent = fmt(kpis.net_income);
          valEl.style.color = kpis.net_income >= 0 ? 'var(--green,#22C55E)' : 'var(--rose,#EF4444)';
          action = 'NET → ' + fmt(kpis.net_income); painted++;
        }
      } catch (e) { action = 'ERR'; }
      trace.push('[' + idx + '] ' + JSON.stringify(rawLabel) + ' → ' + action);
    });
    console.log('[CFO brain v7] P&L painted:', painted, '/ 5\n  ' + trace.join('\n  '));
  }

  function paintPLBars(bars) {
    if (!bars) return;
    document.querySelectorAll('.pl-row').forEach(function(row) {
      var labelEl = row.querySelector('.pl-label');
      var fillEl = row.querySelector('.pl-bar-fill');
      if (!labelEl || !fillEl) return;
      var label = normalizeLabel(labelEl.textContent);  // ★ normalized
      try {
        if ((label === 'revenue' || label === 'total revenue') && bars.revenue && bars.revenue.pct != null) {
          var w = Math.min(100, bars.revenue.pct);
          fillEl.style.width = w + '%'; fillEl.dataset.w = w + '%';
        } else if ((label === 'cogs' || label.indexOf('cost of') > -1) && bars.cogs && bars.cogs.pct != null) {
          var w2 = Math.min(100, bars.cogs.pct);
          fillEl.style.width = w2 + '%'; fillEl.dataset.w = w2 + '%';
        } else if ((label === 'opex' || label.indexOf('operating') > -1) && bars.opex && bars.opex.pct != null) {
          var w3 = Math.min(100, bars.opex.pct);
          fillEl.style.width = w3 + '%'; fillEl.dataset.w = w3 + '%';
        }
      } catch (e) {}
    });
  }

  function paintCashBars(bars) {
    if (!bars || !bars.length) return;
    var els = document.querySelectorAll('.cash-bar');
    if (!els.length) return;
    var n = Math.min(els.length, bars.length);
    var maxVal = Math.max.apply(null, bars.map(function(b) { return b.value || 0; }));
    for (var i = 0; i < n; i++) {
      try {
        var el = els[i]; var d = bars[i];
        el.style.height = d.pct + '%'; el.dataset.h = d.pct + '%';
        var labelEl = el.querySelector('.cash-bar-label');
        if (labelEl) labelEl.textContent = d.label;
        el.style.cursor = 'pointer';
        if (!el.dataset.cfoHoverWired) {
          el.dataset.cfoHoverWired = 'true';
          el.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.15)'; this.style.transform = 'scaleY(1.04)';
            this.style.transformOrigin = 'bottom'; this.style.transition = 'transform 0.2s, filter 0.2s';
          });
          el.addEventListener('mouseleave', function() { this.style.filter = ''; this.style.transform = ''; });
        }
        var pctOfMax = maxVal > 0 ? (d.value / maxVal * 100).toFixed(0) : 0;
        Tooltip.attach(el,
          '<div style="font-weight:700;color:' + DENIM + ';margin-bottom:6px;font-size:10px;text-transform:uppercase;letter-spacing:0.1em">' + d.label + '</div>' +
          '<div style="font-family:Geist Mono,monospace;font-size:18px;color:#fff;font-weight:600">' + fmt(d.value) + '</div>' +
          '<div style="font-size:10px;color:rgba(255,255,255,0.55);margin-top:6px">' + pctOfMax + '% of peak month</div>'
        );
      } catch (e) {}
    }
  }

  function paintCashPosition(kpis) {
    document.querySelectorAll('.panel').forEach(function(panel) {
      var titleEl = panel.querySelector('.panel-title');
      if (!titleEl) return;
      var title = normalizeLabel(titleEl.textContent);
      if (title === 'cash position') {
        var badge = panel.querySelector('.panel-badge');
        if (badge) badge.textContent = fmt(kpis.cash_position);
        var stats = panel.querySelectorAll('.cash-stat-val');
        if (stats.length >= 1) stats[0].textContent = fmt(kpis.cash_position);
        if (stats.length >= 2) {
          if (kpis.burn_rate && kpis.burn_rate > 0) {
            var runway = Math.floor(kpis.cash_position / kpis.burn_rate);
            stats[1].textContent = runway + ' mo';
            stats[1].style.color = runway < 6 ? 'var(--rose,#EF4444)' : runway < 12 ? 'var(--amber,#F59E0B)' : 'var(--green,#22C55E)';
          } else {
            stats[1].textContent = '∞';
            stats[1].style.color = 'var(--green,#22C55E)';
          }
        }
      }
    });
  }

  function renderSparklineSVG(data, color, pulseLatest) {
    if (!data || !data.length) return '';
    var values = data.map(function(v) { return Math.abs(Number(v) || 0); });
    var max = Math.max.apply(null, values);
    if (max === 0) return '<svg viewBox="0 0 100 24" preserveAspectRatio="none" style="width:100%;height:100%;display:block"></svg>';
    var n = data.length, w = 100, h = 24, barW = w / n, bars = '';
    for (var i = 0; i < n; i++) {
      var v = values[i], bh = (v / max) * h, by = h - bh;
      var op = i === n - 1 ? '1' : (0.4 + 0.5 * (i / n)).toFixed(2);
      var pulseClass = (pulseLatest && i === n - 1) ? ' class="cfo-pulse"' : '';
      bars += '<rect' + pulseClass + ' x="' + (i * barW + 0.5).toFixed(2) + '" y="' + by.toFixed(2) +
              '" width="' + (barW - 1).toFixed(2) + '" height="' + Math.max(0.5, bh).toFixed(2) +
              '" fill="' + color + '" opacity="' + op + '" rx="0.5"/>';
    }
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="width:100%;height:100%;display:block">' + bars + '</svg>';
  }

  function injectPulseCSS() {
    if (document.getElementById('cfo-pulse-css')) return;
    var style = document.createElement('style');
    style.id = 'cfo-pulse-css';
    style.textContent = '@keyframes cfoPulse { 0%,100% { opacity: 1; filter: brightness(1); } 50% { opacity: 0.65; filter: brightness(1.4); } } .cfo-pulse { animation: cfoPulse 2.4s ease-in-out infinite; transform-origin: center; } .cfo-quicknav { animation: cfoFadeDown 0.5s ease-out; } @keyframes cfoFadeDown { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(style);
  }

  function paintSparklines(monthlyTrend) {
    if (!monthlyTrend || !monthlyTrend.length) return;
    injectPulseCSS();
    document.querySelectorAll('.kpi-card').forEach(function(card) {
      var labelEl = card.querySelector('.kpi-label');
      var sparkEl = card.querySelector('.kpi-spark');
      if (!labelEl || !sparkEl) return;
      var label = normalizeLabel(labelEl.textContent);
      var data = null, color = DENIM;
      if (label === 'total revenue' || label === 'revenue') data = monthlyTrend.map(function(m) { return m.revenue; });
      else if (label === 'gross margin') data = monthlyTrend.map(function(m) { return m.revenue > 0 ? (m.revenue - m.cogs) / m.revenue * 100 : 0; });
      else if (label === 'operating cash flow' || label === 'ocf') data = monthlyTrend.map(function(m) { return m.revenue - m.opex; });
      else if (label === 'roic') { data = monthlyTrend.map(function(m) { return m.revenue > 0 ? m.net / m.revenue * 100 : 0; }); color = CYAN; }
      else if (label === 'net income') { data = monthlyTrend.map(function(m) { return m.net; }); color = GOLD; }
      else if (label === 'burn rate') { data = monthlyTrend.map(function(m) { return Math.max(0, -m.net); }); color = ROSE; }
      if (!data) return;
      try { sparkEl.innerHTML = renderSparklineSVG(data, color, true); } catch (e) {}
    });
  }

  function wireSectionLinks() {
    document.querySelectorAll('.panel').forEach(function(panel) {
      var titleEl = panel.querySelector('.panel-title');
      if (!titleEl) return;
      if (titleEl.dataset.cfoLinked === 'true') return;
      var title = normalizeLabel(titleEl.textContent);
      var url = null;
      if (title === 'p&l statement') url = '/cfo/pnl';
      else if (title === 'cash position') url = '/cfo/cash';
      if (!url) return;
      titleEl.dataset.cfoLinked = 'true';
      titleEl.style.cursor = 'pointer';
      titleEl.style.transition = 'color 0.15s';
      if (!titleEl.querySelector('.section-arrow')) {
        var arrow = document.createElement('span');
        arrow.className = 'section-arrow';
        arrow.style.cssText = 'margin-left:8px;font-size:14px;color:' + DENIM + ';opacity:0.7;transition:transform 0.15s,opacity 0.15s';
        arrow.textContent = '→';
        titleEl.appendChild(arrow);
      }
      titleEl.addEventListener('click', function(e) { e.preventDefault(); window.location.href = url; });
      titleEl.addEventListener('mouseenter', function() {
        titleEl.style.color = DENIM;
        var a = titleEl.querySelector('.section-arrow');
        if (a) { a.style.transform = 'translateX(4px)'; a.style.opacity = '1'; }
      });
      titleEl.addEventListener('mouseleave', function() {
        titleEl.style.color = '';
        var a = titleEl.querySelector('.section-arrow');
        if (a) { a.style.transform = ''; a.style.opacity = '0.7'; }
      });
    });
  }

  function injectSubpageNav() {
    if (document.querySelector('.cfo-quicknav')) return;
    var nav = document.createElement('div');
    nav.className = 'cfo-quicknav';
    nav.style.cssText = ['position:fixed','top:80px','right:24px','display:flex','gap:4px',
      'background:rgba(15,23,42,0.85)','-webkit-backdrop-filter:blur(12px)','backdrop-filter:blur(12px)',
      'border:1px solid rgba(91,127,204,0.25)','border-radius:24px','padding:5px','z-index:9999',
      'font-family:Instrument Sans,-apple-system,sans-serif','box-shadow:0 8px 24px rgba(0,0,0,0.3)'].join(';');
    var path = window.location.pathname.replace(/\/$/, '') || '/cfo';
    var pages = [{url:'/cfo',label:'Hub'},{url:'/cfo/pnl',label:'P&L'},{url:'/cfo/cash',label:'Cash'},{url:'/cfo/budget',label:'Budget'},{url:'/cfo/forecast',label:'Forecast'}];
    pages.forEach(function(p) {
      var current = path === p.url;
      var btn = document.createElement('a');
      btn.href = p.url; btn.textContent = p.label;
      btn.style.cssText = ['padding:6px 14px','border-radius:18px','font-size:11px','font-weight:600',
        'letter-spacing:0.04em','text-decoration:none','transition:all 0.15s',
        'color:' + (current ? '#fff' : 'rgba(255,255,255,0.55)'),
        'background:' + (current ? DENIM : 'transparent')].join(';');
      if (!current) {
        btn.addEventListener('mouseenter', function() { btn.style.color = '#fff'; btn.style.background = 'rgba(91,127,204,0.2)'; });
        btn.addEventListener('mouseleave', function() { btn.style.color = 'rgba(255,255,255,0.55)'; btn.style.background = 'transparent'; });
      }
      nav.appendChild(btn);
    });
    document.body.appendChild(nav);
  }

  function paintSyncBadge(meta) {
    if (!meta) return;
    var existing = document.querySelector('.refresh-indicator');
    if (existing) existing.textContent = meta.demo_mode ? 'Demo data' : (meta.last_sync_at ? 'Synced ' + new Date(meta.last_sync_at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}) : 'Live');
  }

  var lastData = null;
  function paintAll(data, stage) {
    if (!data || !data.kpis) return;
    console.log('[CFO brain v7] paintAll', stage);
    paintKPIs(data.kpis, data.deltas || {});
    paintPL(data.kpis);
    paintPLBars(data.bars || {});
    paintCashBars(data.cash_bars || []);
    paintCashPosition(data.kpis);
    paintSparklines(data.monthly_trend || []);
    paintSyncBadge(data.meta || {});
    wireSectionLinks();
  }

  async function run() {
    injectPulseCSS();
    injectSubpageNav();
    var token = await getToken();
    if (!token) { window.location.href = '/login'; return; }
    try {
      var resp = await fetch(BASE + '/cfo-command-center?view=hub', {
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      });
      if (resp.status === 401 || resp.status === 403) { window.location.href = '/login'; return; }
      if (!resp.ok) { console.error('[CFO brain v7] Hub fetch failed', resp.status); return; }
      var data = await resp.json();
      lastData = data;
      if (data.meta && data.meta.demo_mode) return;
      paintAll(data, 'boot');
      setTimeout(function() { if (lastData) paintAll(lastData, '1500ms'); }, 1500);
      setTimeout(function() { if (lastData) paintAll(lastData, '3500ms'); }, 3500);
    } catch (err) { console.error('[CFO brain v7] Error:', err); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
