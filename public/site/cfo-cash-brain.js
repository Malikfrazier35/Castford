/* Castford CFO Cash Brain v1 — /cfo/cash page */
(function() {
  'use strict';

  function fmt(v) { return window.CF.fmt(v); }

  async function run() {
    var data = await window.CF.fetchView('cash');
    if (!data) return;
    window.CF.buildSyncBadge(data.meta);

    var s = data.summary || {};
    function setKPI(key, val) {
      var el = document.querySelector('[data-kpi="' + key + '"]');
      if (el) el.textContent = val;
    }
    setKPI('cash_position', fmt(s.cash_position));
    setKPI('ar', s.ar === 0 ? 'Not tracked' : fmt(s.ar));
    setKPI('ap', s.ap === 0 ? 'Not tracked' : fmt(s.ap));
    setKPI('working_capital', fmt(s.working_capital));
    setKPI('monthly_burn', s.monthly_burn === 0 ? 'Profitable' : fmt(s.monthly_burn) + '/mo');
    setKPI('runway', s.runway_months === null ? 'Indefinite' : s.runway_months + ' months');

    // Color the runway by status
    var runwayEl = document.querySelector('[data-kpi="runway"]');
    if (runwayEl) {
      if (s.runway_months === null) runwayEl.style.color = 'var(--green)';
      else if (s.runway_months < 6) runwayEl.style.color = 'var(--rose)';
      else if (s.runway_months < 12) runwayEl.style.color = 'var(--amber)';
      else runwayEl.style.color = 'var(--green)';
    }

    // ── Weekly cash flow bars ──
    var weeklyWrap = document.getElementById('cash-weekly');
    if (weeklyWrap) {
      var weeks = data.weekly_cashflow || [];
      if (!weeks.length) {
        weeklyWrap.innerHTML = '<div style="color:var(--text-3);padding:20px 0">No weekly data yet.</div>';
      } else {
        var max = Math.max.apply(null, weeks.map(function(w) { return Math.max(w.inflow, w.outflow); }));
        var rows = '<div style="display:flex;flex-direction:column;gap:6px">';
        weeks.forEach(function(w) {
          var inPct = max > 0 ? w.inflow / max * 100 : 0;
          var outPct = max > 0 ? w.outflow / max * 100 : 0;
          rows += '<div style="display:grid;grid-template-columns:60px 1fr 60px 1fr 80px;gap:8px;align-items:center;font-size:11px">' +
            '<div style="color:var(--text-3);font-family:Geist Mono,monospace">' + w.week.slice(5) + '</div>' +
            '<div style="height:6px;background:rgba(34,197,94,0.1);position:relative"><div style="width:' + inPct + '%;height:100%;background:var(--green);transition:width 0.8s"></div></div>' +
            '<div class="num" style="color:var(--green);font-family:Geist Mono,monospace;text-align:right">' + fmt(w.inflow) + '</div>' +
            '<div style="height:6px;background:rgba(239,68,68,0.1);position:relative"><div style="width:' + outPct + '%;height:100%;background:var(--rose);transition:width 0.8s"></div></div>' +
            '<div class="num" style="color:var(--rose);font-family:Geist Mono,monospace;text-align:right">' + fmt(w.outflow) + '</div>' +
            '</div>';
        });
        rows += '</div>';
        weeklyWrap.innerHTML = rows;
      }
    }

    // ── Monthly net cash ──
    var monthlyWrap = document.getElementById('cash-monthly');
    if (monthlyWrap) {
      var monthly = data.monthly_net || [];
      if (!monthly.length) {
        monthlyWrap.innerHTML = '<div style="color:var(--text-3);padding:20px 0">No monthly data yet.</div>';
      } else {
        var absMax = Math.max.apply(null, monthly.map(function(m) { return Math.abs(m.net); }));
        var html = '<div style="display:flex;align-items:flex-end;justify-content:space-between;height:160px;gap:4px;padding:20px 0;border-bottom:1px solid var(--panel-border)">';
        monthly.forEach(function(m) {
          var pctH = absMax > 0 ? Math.abs(m.net) / absMax * 100 : 0;
          var isPositive = m.net >= 0;
          html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">' +
            '<div style="height:100%;width:100%;display:flex;align-items:' + (isPositive ? 'flex-end' : 'flex-start') + ';position:relative">' +
            '<div style="width:100%;height:' + pctH + '%;background:' + (isPositive ? 'linear-gradient(to top,#22C55E,#4ADE80)' : 'linear-gradient(to bottom,#EF4444,#FCA5A5)') + ';transition:height 0.8s ease"></div>' +
            '</div>' +
            '<div style="font-size:10px;color:var(--text-3);font-family:Geist Mono,monospace">' + m.label + '</div>' +
            '</div>';
        });
        html += '</div>';
        html += '<div style="display:flex;justify-content:space-between;padding-top:8px;font-size:10px;color:var(--text-3)"><span>Green = surplus month</span><span>Red = deficit month</span></div>';
        monthlyWrap.innerHTML = html;
      }
    }

    console.log('[CFO Cash brain] painted', { weeks: (data.weekly_cashflow || []).length, months: (data.monthly_net || []).length });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
