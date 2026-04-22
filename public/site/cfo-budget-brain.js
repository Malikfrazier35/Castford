/* Castford CFO Budget Brain v2 — attribution + commentary */
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
      if (el) { el.textContent = val; if (color) el.style.color = color; }
    }
    setKPI('actual', fmt(totals.actual));
    setKPI('budget', fmt(totals.budget));
    setKPI('variance', fmt(totals.variance), totals.variance > 0 ? 'var(--rose)' : 'var(--green)');
    setKPI('variance_pct', totals.variance_pct !== null ? (totals.variance_pct >= 0 ? '+' : '') + totals.variance_pct.toFixed(1) + '%' : '—',
      totals.variance_pct > 0 ? 'var(--rose)' : 'var(--green)');

    // ── Commentary ──
    var commentary = data.commentary || [];
    var cWrap = document.getElementById('commentary-text');
    if (cWrap) {
      if (!commentary.length) {
        cWrap.innerHTML = '<div style="color:var(--text-3)">No commentary available — load budget data to enable analysis.</div>';
      } else {
        cWrap.innerHTML = commentary.map(function(c) { return '<p style="margin:0 0 8px">' + c + '</p>'; }).join('');
      }
    }

    // ── Top 5 drivers ──
    var topDrivers = data.top_drivers || [];
    var topWrap = document.getElementById('top-drivers');
    if (topWrap) {
      if (!topDrivers.length) {
        topWrap.innerHTML = '<div style="color:var(--text-3);padding:20px 0;text-align:center">No variance data yet. Upload budgets to see drivers.</div>';
      } else {
        var maxAbs = Math.max.apply(null, topDrivers.map(function(d){return Math.abs(d.variance);}));
        var html = '<div style="display:flex;flex-direction:column;gap:10px">';
        topDrivers.forEach(function(d, i) {
          var color = d.direction === 'over' ? 'var(--rose)' : 'var(--green)';
          var bg = d.direction === 'over' ? 'rgba(239,68,68,0.05)' : 'rgba(34,197,94,0.05)';
          var pct = maxAbs > 0 ? Math.abs(d.variance) / maxAbs * 100 : 0;
          html += '<div style="background:' + bg + ';padding:14px 16px;border-left:3px solid ' + color + ';border-radius:1px">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px">' +
              '<div>' +
                '<div style="font-size:10px;color:var(--text-3);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px">#' + (i+1) + ' · ' + d.share_of_total_variance + '% of total variance</div>' +
                '<div style="font-size:15px;font-weight:600;color:var(--text-1)">' + d.name + '</div>' +
              '</div>' +
              '<div style="text-align:right">' +
                '<div style="font-family:Geist Mono,monospace;font-size:18px;color:' + color + ';font-weight:600">' + (d.variance >= 0 ? '+' : '') + fmt(d.variance) + '</div>' +
                '<div style="font-size:11px;color:var(--text-3);margin-top:2px">' + (d.variance_pct !== null ? (d.variance_pct >= 0 ? '+' : '') + d.variance_pct.toFixed(1) + '% vs budget' : '') + '</div>' +
              '</div>' +
            '</div>' +
            '<div style="height:4px;background:rgba(255,255,255,0.05);border-radius:1px;position:relative">' +
              '<div style="width:' + pct + '%;height:100%;background:' + color + ';transition:width 0.8s ease"></div>' +
            '</div>' +
            '</div>';
        });
        html += '</div>';
        topWrap.innerHTML = html;
      }
    }

    // ── Full table ──
    var rows = data.rows || [];
    var wrap = document.getElementById('budget-table');
    if (!wrap) return;
    var filtered = rows.filter(function(r) { return r.actual > 0 || r.budget > 0; });
    if (!filtered.length) {
      wrap.innerHTML = '<div style="color:var(--text-3);padding:40px 0;text-align:center">No budget data yet.</div>';
      return;
    }
    var maxVar = Math.max.apply(null, filtered.map(function(r){return Math.abs(r.variance);}));
    var html = '<table class="cfo-table"><thead><tr>' +
      '<th style="min-width:200px">Account</th><th>Type</th>' +
      '<th class="num">Actual</th><th class="num">Budget</th>' +
      '<th class="num">Variance</th><th class="num">Var %</th><th style="width:140px">Scale</th>' +
      '</tr></thead><tbody>';
    filtered.forEach(function(r) {
      var vc = r.variance > 0 ? 'cfo-var-neg' : 'cfo-var-pos';
      var pct = maxVar > 0 ? Math.abs(r.variance) / maxVar * 100 : 0;
      var bc = r.variance > 0 ? 'var(--rose)' : 'var(--green)';
      var tl = r.type === 'revenue' || r.type === 'other_income' ? 'Revenue' : r.type === 'cost_of_revenue' ? 'COGS' : 'OpEx';
      html += '<tr>' +
        '<td>' + r.name + '</td>' +
        '<td style="color:var(--text-3);font-size:11px;text-transform:uppercase;letter-spacing:0.08em">' + tl + '</td>' +
        '<td class="num">' + fmt(r.actual) + '</td>' +
        '<td class="num" style="color:var(--text-3)">' + (r.budget > 0 ? fmt(r.budget) : '—') + '</td>' +
        '<td class="num ' + vc + '" style="font-weight:600">' + (r.variance >= 0 ? '+' : '') + fmt(r.variance) + '</td>' +
        '<td class="num ' + vc + '">' + (r.variance_pct !== null ? (r.variance_pct >= 0 ? '+' : '') + r.variance_pct.toFixed(1) + '%' : '—') + '</td>' +
        '<td><div class="cfo-bar-track"><div class="cfo-bar-fill" style="width:' + pct + '%;background:' + bc + '"></div></div></td>' +
      '</tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html;

    console.log('[CFO Budget brain v2] painted', { drivers: topDrivers.length, accounts: filtered.length });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
