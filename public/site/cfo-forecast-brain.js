/* Castford CFO Forecast Brain v1 — /cfo/forecast page */
(function() {
  'use strict';

  function fmt(v) { return window.CF.fmt(v); }

  async function run() {
    var data = await window.CF.fetchView('forecast');
    if (!data) return;
    window.CF.buildSyncBadge(data.meta);

    var forecast = data.forecast || [];
    var historical = data.historical || [];

    function setKPI(key, val, color) {
      var el = document.querySelector('[data-kpi="' + key + '"]');
      if (el) {
        el.textContent = val;
        if (color) el.style.color = color;
      }
    }

    if (forecast.length) {
      setKPI('next_base', fmt(forecast[0].base));
      setKPI('next_bull', fmt(forecast[0].bull), 'var(--green)');
      setKPI('next_bear', fmt(forecast[0].bear), 'var(--rose)');
    }

    if (data.backtest_mape !== null && data.backtest_mape !== undefined) {
      var mapeColor = data.backtest_mape < 10 ? 'var(--green)' : data.backtest_mape < 20 ? 'var(--amber)' : 'var(--rose)';
      setKPI('mape', data.backtest_mape.toFixed(1) + '%', mapeColor);
    } else {
      setKPI('mape', 'Need 6+ months');
    }

    // ── Combined chart: historical bars + forecast bars with bull/bear bands ──
    var chartWrap = document.getElementById('forecast-chart');
    if (chartWrap) {
      if (!historical.length && !forecast.length) {
        chartWrap.innerHTML = '<div style="color:var(--text-3);padding:40px 0;text-align:center">No historical data yet.</div>';
      } else {
        var all = historical.concat(forecast.map(function(f) { return { month: f.month, label: f.label, revenue: f.base, isForecast: true, bull: f.bull, bear: f.bear }; }));
        var max = Math.max.apply(null, all.map(function(m) { return m.bull || m.revenue || 0; }));

        var html = '<div style="display:flex;align-items:flex-end;justify-content:space-between;height:220px;gap:3px;padding:24px 0;border-bottom:1px solid var(--panel-border);position:relative">';
        all.forEach(function(m) {
          var revPct = max > 0 ? (m.revenue || 0) / max * 100 : 0;
          var bullPct = m.isForecast && max > 0 ? m.bull / max * 100 : 0;
          var bearPct = m.isForecast && max > 0 ? m.bear / max * 100 : 0;
          var bandHeight = bullPct - bearPct;
          var color = m.isForecast ? 'var(--denim)' : 'var(--gold)';
          var opacity = m.isForecast ? '0.8' : '1';
          html += '<div style="flex:1;min-width:28px;display:flex;flex-direction:column;align-items:center;gap:4px;position:relative;height:100%">' +
            '<div style="width:100%;height:100%;display:flex;align-items:flex-end;position:relative">';
          if (m.isForecast) {
            html += '<div style="position:absolute;width:100%;bottom:' + bearPct + '%;height:' + bandHeight + '%;background:rgba(91,127,204,0.15);border:1px dashed rgba(91,127,204,0.4)"></div>';
          }
          html += '<div style="width:100%;height:' + revPct + '%;background:' + color + ';opacity:' + opacity + ';transition:height 0.8s ease;border-radius:1px 1px 0 0"></div>' +
            '</div>' +
            '<div style="font-size:9px;color:var(--text-3);font-family:Geist Mono,monospace">' + m.label + '</div>' +
            '</div>';
        });
        html += '</div>';
        html += '<div style="display:flex;justify-content:space-between;padding-top:12px;font-size:10px;color:var(--text-3)">' +
          '<span><span style="display:inline-block;width:8px;height:8px;background:var(--gold);margin-right:4px;vertical-align:middle"></span>Actual historical</span>' +
          '<span><span style="display:inline-block;width:8px;height:8px;background:var(--denim);margin-right:4px;vertical-align:middle"></span>Base forecast</span>' +
          '<span><span style="display:inline-block;width:12px;height:8px;background:rgba(91,127,204,0.15);border:1px dashed rgba(91,127,204,0.4);margin-right:4px;vertical-align:middle"></span>Bull/bear band</span>' +
          '</div>';
        html += '<div style="margin-top:16px;padding:12px;background:rgba(91,127,204,0.05);border-left:2px solid var(--denim);font-size:11px;color:var(--text-2);line-height:1.5">' +
          '<strong style="color:var(--text-1)">Methodology:</strong> ' + (data.methodology || '') +
          '</div>';
        chartWrap.innerHTML = html;
      }
    }

    // ── Forecast detail table ──
    var tableWrap = document.getElementById('forecast-table');
    if (tableWrap) {
      if (!forecast.length) {
        tableWrap.innerHTML = '<div style="color:var(--text-3);padding:40px 0;text-align:center">Need at least 3 months of history to generate a forecast.</div>';
      } else {
        var html = '<table class="cfo-table">' +
          '<thead><tr>' +
            '<th style="min-width:120px">Month</th>' +
            '<th class="num">Bear (-15%)</th>' +
            '<th class="num">Base (Linear)</th>' +
            '<th class="num">Bull (+15%)</th>' +
            '<th class="num">EMA</th>' +
            '<th class="num">Net Income Proj.</th>' +
          '</tr></thead><tbody>';
        forecast.forEach(function(f) {
          html += '<tr>' +
            '<td>' + f.label + '</td>' +
            '<td class="num cfo-var-neg">' + fmt(f.bear) + '</td>' +
            '<td class="num" style="font-weight:600">' + fmt(f.base) + '</td>' +
            '<td class="num cfo-var-pos">' + fmt(f.bull) + '</td>' +
            '<td class="num" style="color:var(--text-2)">' + fmt(f.ema) + '</td>' +
            '<td class="num" style="color:' + (f.net >= 0 ? 'var(--green)' : 'var(--rose)') + '">' + fmt(f.net) + '</td>' +
          '</tr>';
        });
        html += '</tbody></table>';
        tableWrap.innerHTML = html;
      }
    }

    console.log('[CFO Forecast brain] painted', { months: forecast.length, mape: data.backtest_mape });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
