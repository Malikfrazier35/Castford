/* Castford CFO Budget Brain v1 — /cfo/budget page */
(function() {
  'use strict';

  function fmt(v) { return window.CF.fmt(v); }

  async function run() {
    var data = await window.CF.fetchView('budget');
    if (!data) return;
    window.CF.buildSyncBadge(data.meta);

    var totals = data.totals || {};
    function setKPI(key, val, color) {
      var el = document.querySelector('[data-kpi="' + key + '"]');
      if (el) {
        el.textContent = val;
        if (color) el.style.color = color;
      }
    }

    setKPI('actual', fmt(totals.actual));
    setKPI('budget', fmt(totals.budget));
    setKPI('variance', fmt(totals.variance), totals.variance > 0 ? 'var(--rose)' : 'var(--green)');
    setKPI('variance_pct', totals.variance_pct !== null ? totals.variance_pct.toFixed(1) + '%' : '—',
      totals.variance_pct > 0 ? 'var(--rose)' : 'var(--green)');

    // ── Variance table ──
    var wrap = document.getElementById('budget-table');
    if (!wrap) return;

    var rows = data.rows || [];
    if (!rows.length) {
      wrap.innerHTML = '<div style="color:var(--text-3);padding:40px 0;text-align:center">No budget data yet. Upload budgets to see variance analysis.</div>';
      return;
    }

    // Only show rows with either actual or budget > 0
    var filtered = rows.filter(function(r) { return r.actual > 0 || r.budget > 0; });

    var maxVar = Math.max.apply(null, filtered.map(function(r) { return Math.abs(r.variance); }));

    var html = '<table class="cfo-table">' +
      '<thead><tr>' +
        '<th style="min-width:200px">Account</th>' +
        '<th>Type</th>' +
        '<th class="num">Actual</th>' +
        '<th class="num">Budget</th>' +
        '<th class="num">Variance</th>' +
        '<th class="num">Var %</th>' +
        '<th style="width:140px">Variance Scale</th>' +
      '</tr></thead><tbody>';

    filtered.forEach(function(r) {
      var varClass = r.variance > 0 ? 'cfo-var-neg' : 'cfo-var-pos';
      var barPct = maxVar > 0 ? Math.abs(r.variance) / maxVar * 100 : 0;
      var barColor = r.variance > 0 ? 'var(--rose)' : 'var(--green)';
      var typeLabel = r.type === 'revenue' || r.type === 'other_income' ? 'Revenue'
                    : r.type === 'cost_of_revenue' ? 'COGS'
                    : 'OpEx';
      html += '<tr>' +
        '<td>' + r.name + '</td>' +
        '<td style="color:var(--text-3);font-size:11px;text-transform:uppercase;letter-spacing:0.08em">' + typeLabel + '</td>' +
        '<td class="num">' + fmt(r.actual) + '</td>' +
        '<td class="num" style="color:var(--text-3)">' + (r.budget > 0 ? fmt(r.budget) : '—') + '</td>' +
        '<td class="num ' + varClass + '" style="font-weight:600">' + (r.variance >= 0 ? '+' : '') + fmt(r.variance) + '</td>' +
        '<td class="num ' + varClass + '">' + (r.variance_pct !== null ? (r.variance_pct >= 0 ? '+' : '') + r.variance_pct.toFixed(1) + '%' : '—') + '</td>' +
        '<td><div class="cfo-bar-track"><div class="cfo-bar-fill" style="width:' + barPct + '%;background:' + barColor + '"></div></div></td>' +
      '</tr>';
    });

    html += '</tbody></table>';
    wrap.innerHTML = html;

    console.log('[CFO Budget brain] painted', { accounts: filtered.length, totalVariance: totals.variance });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
