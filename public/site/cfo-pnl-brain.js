/* Castford CFO P&L Brain v2 — period toggles + common-size */
(function() {
  'use strict';
  function fmt(v) { return window.CF.fmt(v); }
  var currentPeriod = 'ttm';
  var commonSize = false;
  var lastData = null;

  function setKPI(key, val, color) {
    var el = document.querySelector('[data-kpi="' + key + '"]');
    if (el) { el.textContent = val; if (color) el.style.color = color; }
  }
  function setDelta(key, text, color) {
    var el = document.querySelector('[data-kpi-delta="' + key + '"]');
    if (el) { el.textContent = text; el.style.display = 'inline-block'; if (color) el.style.background = 'rgba(' + (color.indexOf('green')>-1 ? '34,197,94' : color.indexOf('rose')>-1 ? '239,68,68' : '91,127,204') + ',0.1)'; el.style.color = color; }
  }

  async function loadPeriod(p) {
    currentPeriod = p;
    document.querySelectorAll('.period-btn').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-period') === p);
    });
    var labelEl = document.getElementById('period-label');
    if (labelEl) labelEl.textContent = p.toUpperCase();

    var token = await window.CF.getToken();
    if (!token) { window.location.href = '/login'; return; }
    var resp = await fetch(window.CF.BASE + '/cfo-command-center?view=pnl&period=' + p, {
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    });
    if (resp.status === 401 || resp.status === 403) { window.location.href = '/login'; return; }
    if (!resp.ok) return;
    var data = await resp.json();
    window.CF.buildSyncBadge(data.meta);
    lastData = data;
    paint();
  }

  function paint() {
    var data = lastData;
    if (!data) return;
    var s = data.summary || {};
    var sections = data.sections || [];
    var periods = data.periods || [];

    setKPI('revenue', fmt(s.revenue));
    setKPI('gross_profit', fmt(s.gross_profit));
    setKPI('opex', fmt(s.opex));
    setKPI('net_income', fmt(s.net_income));
    setDelta('gross_margin', s.gross_margin.toFixed(1) + '% margin', 'var(--denim)');
    setDelta('net_margin', s.net_margin.toFixed(1) + '% margin', s.net_margin >= 0 ? 'var(--green)' : 'var(--rose)');

    // Show period deltas where available
    sections.forEach(function(sec) {
      if (sec.delta !== null && sec.delta !== undefined) {
        var key = sec.key === 'revenue' ? 'revenue' : sec.key === 'opex' ? 'opex' : null;
        if (key) setDelta(key, (sec.delta >= 0 ? '▲' : '▼') + ' ' + Math.abs(sec.delta).toFixed(1) + '% vs prior', sec.delta >= 0 && sec.key === 'revenue' ? 'var(--green)' : sec.delta >= 0 ? 'var(--rose)' : 'var(--green)');
      }
    });

    var wrap = document.getElementById('pnl-table-wrap');
    if (!wrap) return;

    var html = '<table class="cfo-table"><thead><tr><th style="min-width:220px">Account</th>';
    periods.forEach(function(p) { html += '<th class="num">' + p.label + '</th>'; });
    html += '<th class="num">Total</th>';
    if (commonSize) html += '<th class="num">% of Rev</th>';
    html += '</tr></thead><tbody>';

    sections.forEach(function(section) {
      html += '<tr class="section-row"><td colspan="' + (periods.length + 2 + (commonSize?1:0)) + '">' + section.label + '</td></tr>';
      section.accounts.forEach(function(a) {
        html += '<tr><td>' + a.name + '</td>';
        periods.forEach(function(p) {
          var v = a.monthly[p.period] || 0;
          html += '<td class="num"' + (v ? '' : ' style="color:var(--text-3)"') + '>' + (v > 0 ? fmt(v) : '—') + '</td>';
        });
        html += '<td class="num" style="font-weight:600">' + fmt(a.amount) + '</td>';
        if (commonSize) {
          html += '<td class="num" style="color:var(--denim);font-weight:600">' + a.common_size.toFixed(1) + '%</td>';
        }
        html += '</tr>';
      });
      // Section total
      html += '<tr class="total-row"><td>Total ' + section.label + '</td>';
      periods.forEach(function(p) {
        var sum = section.accounts.reduce(function(acc, a) { return acc + (a.monthly[p.period] || 0); }, 0);
        html += '<td class="num">' + (sum > 0 ? fmt(sum) : '—') + '</td>';
      });
      html += '<td class="num">' + fmt(section.total) + '</td>';
      if (commonSize) {
        var pct = s.revenue > 0 ? (section.total / s.revenue * 100).toFixed(1) : '0';
        html += '<td class="num" style="color:var(--denim);font-weight:700">' + pct + '%</td>';
      }
      html += '</tr>';
    });

    // Net Income row
    html += '<tr class="total-row" style="border-top:3px solid var(--denim)">' +
      '<td><strong style="color:var(--denim)">Net Income</strong></td>';
    periods.forEach(function(p) {
      var rv = (sections.find(function(x){return x.key==='revenue';})?.accounts || []).reduce(function(a,x){return a + (x.monthly[p.period]||0);}, 0);
      var cg = (sections.find(function(x){return x.key==='cogs';})?.accounts || []).reduce(function(a,x){return a + (x.monthly[p.period]||0);}, 0);
      var op = (sections.find(function(x){return x.key==='opex';})?.accounts || []).reduce(function(a,x){return a + (x.monthly[p.period]||0);}, 0);
      var net = rv - cg - op;
      html += '<td class="num" style="color:' + (net >= 0 ? 'var(--green)' : 'var(--rose)') + ';font-weight:600">' + fmt(net) + '</td>';
    });
    html += '<td class="num" style="color:' + (s.net_income >= 0 ? 'var(--green)' : 'var(--rose)') + ';font-weight:700">' + fmt(s.net_income) + '</td>';
    if (commonSize) {
      html += '<td class="num" style="color:var(--denim);font-weight:700">' + s.net_margin.toFixed(1) + '%</td>';
    }
    html += '</tr></tbody></table>';
    wrap.innerHTML = html;

    console.log('[CFO P&L brain v2] painted', { period: currentPeriod, accounts: sections.reduce(function(a,s){return a+s.accounts.length;}, 0) });
  }

  function init() {
    document.querySelectorAll('.period-btn').forEach(function(b) {
      b.addEventListener('click', function() { loadPeriod(b.getAttribute('data-period')); });
    });
    var cs = document.getElementById('toggle-common-size');
    if (cs) cs.addEventListener('change', function() { commonSize = cs.checked; paint(); });
    loadPeriod('ttm');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
