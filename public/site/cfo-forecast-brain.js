/* Castford CFO Forecast Brain v2 — driver-based + scenarios + confidence intervals */
(function() {
  'use strict';

  function fmt(v) { return window.CF.fmt(v); }
  var currentScenario = 'base';

  function setKPI(key, val, color) {
    var el = document.querySelector('[data-kpi="' + key + '"]');
    if (el) { el.textContent = val; if (color) el.style.color = color; }
  }

  async function loadScenario(scenario) {
    currentScenario = scenario;
    document.querySelectorAll('.scenario-btn').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-scenario') === scenario);
    });

    var token = await window.CF.getToken();
    if (!token) { window.location.href = '/login'; return; }

    var resp = await fetch(window.CF.BASE + '/cfo-command-center?view=forecast&scenario=' + scenario, {
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    });
    if (resp.status === 401 || resp.status === 403) { window.location.href = '/login'; return; }
    if (!resp.ok) return;
    var data = await resp.json();

    window.CF.buildSyncBadge(data.meta);
    paint(data);
  }

  function paint(data) {
    var forecast = data.forecast || [];
    var historical = data.historical || [];
    var drivers = data.drivers || {};

    if (forecast.length) {
      setKPI('next_base', fmt(forecast[0].base));
      setKPI('ci80', fmt(forecast[0].ci80_low) + ' – ' + fmt(forecast[0].ci80_high));
      setKPI('customers', forecast[0].implied_customers.toLocaleString());
    }

    if (data.backtest_mape !== null && data.backtest_mape !== undefined) {
      var c = data.backtest_mape < 10 ? 'var(--green)' : data.backtest_mape < 20 ? 'var(--amber)' : 'var(--rose)';
      setKPI('mape', data.backtest_mape.toFixed(1) + '%', c);
    } else {
      setKPI('mape', 'Need 6+ mo');
    }

    // ── Driver controls (read-only display for v1; future: editable sliders) ──
    var dc = document.getElementById('driver-controls');
    if (dc) {
      dc.innerHTML =
        '<div><div class="k-label" style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px">Customer Base</div>' +
          '<div style="font-family:Geist Mono,monospace;font-size:22px;color:var(--text-1)">' + drivers.estimated_customers.toLocaleString() + '</div>' +
          '<div style="font-size:11px;color:var(--text-3);margin-top:4px">Baseline (proxy)</div></div>' +
        '<div><div class="k-label" style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px">ARPU</div>' +
          '<div style="font-family:Geist Mono,monospace;font-size:22px;color:var(--text-1)">$' + drivers.estimated_arpu.toLocaleString() + '</div>' +
          '<div style="font-size:11px;color:var(--text-3);margin-top:4px">/customer/month</div></div>' +
        '<div><div class="k-label" style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px">Monthly Growth</div>' +
          '<div style="font-family:Geist Mono,monospace;font-size:22px;color:' + (drivers.estimated_monthly_growth > 0 ? 'var(--green)' : 'var(--rose)') + '">' + (drivers.estimated_monthly_growth > 0 ? '+' : '') + drivers.estimated_monthly_growth + '%</div>' +
          '<div style="font-size:11px;color:var(--text-3);margin-top:4px">CAGR-implied</div></div>' +
        '<div><div class="k-label" style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px">Churn Rate</div>' +
          '<div style="font-family:Geist Mono,monospace;font-size:22px;color:var(--rose)">' + (drivers.estimated_churn_rate * 100).toFixed(1) + '%</div>' +
          '<div style="font-size:11px;color:var(--text-3);margin-top:4px">Industry default</div></div>';
    }

    // ── Forecast chart with confidence bands ──
    var chartWrap = document.getElementById('forecast-chart');
    if (chartWrap) {
      var all = historical.map(function(h) { return { label: h.label, value: h.revenue, isForecast: false }; })
        .concat(forecast.map(function(f) { return { label: f.label, value: f.base, ci80_low: f.ci80_low, ci80_high: f.ci80_high, isForecast: true }; }));
      var max = Math.max.apply(null, all.map(function(m) { return m.ci80_high || m.value || 0; }));

      var html = '<div style="display:flex;align-items:flex-end;justify-content:space-between;height:240px;gap:3px;padding:24px 0;border-bottom:1px solid var(--panel-border);position:relative">';
      all.forEach(function(m) {
        var barPct = max > 0 ? (m.value || 0) / max * 100 : 0;
        var ci80LowPct = m.isForecast && max > 0 ? m.ci80_low / max * 100 : 0;
        var ci80HighPct = m.isForecast && max > 0 ? m.ci80_high / max * 100 : 0;
        var bandHeight = ci80HighPct - ci80LowPct;
        var color = m.isForecast ? 'var(--denim)' : 'var(--gold)';
        var opacity = m.isForecast ? '0.85' : '1';
        html += '<div style="flex:1;min-width:24px;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%">' +
          '<div style="width:100%;height:100%;display:flex;align-items:flex-end;position:relative">';
        if (m.isForecast && bandHeight > 0) {
          html += '<div style="position:absolute;width:100%;bottom:' + Math.max(0, ci80LowPct) + '%;height:' + bandHeight + '%;background:rgba(91,127,204,0.18);border:1px dashed rgba(91,127,204,0.5);border-radius:1px"></div>';
        }
        html += '<div style="width:100%;height:' + Math.max(0, barPct) + '%;background:' + color + ';opacity:' + opacity + ';transition:height 0.8s ease;border-radius:1px 1px 0 0"></div>' +
          '</div>' +
          '<div style="font-size:9px;color:var(--text-3);font-family:Geist Mono,monospace">' + m.label + '</div>' +
          '</div>';
      });
      html += '</div>';
      html += '<div style="display:flex;justify-content:space-between;padding-top:12px;font-size:10px;color:var(--text-3);flex-wrap:wrap;gap:12px">' +
        '<span><span style="display:inline-block;width:8px;height:8px;background:var(--gold);margin-right:4px;vertical-align:middle"></span>Historical</span>' +
        '<span><span style="display:inline-block;width:8px;height:8px;background:var(--denim);margin-right:4px;vertical-align:middle"></span>' + currentScenario.charAt(0).toUpperCase() + currentScenario.slice(1) + ' forecast</span>' +
        '<span><span style="display:inline-block;width:12px;height:8px;background:rgba(91,127,204,0.18);border:1px dashed rgba(91,127,204,0.5);margin-right:4px;vertical-align:middle"></span>80% confidence band</span>' +
        '</div>';
      chartWrap.innerHTML = html;
    }

    // ── Forecast table with all scenarios + CIs ──
    var tableWrap = document.getElementById('forecast-table');
    if (tableWrap) {
      if (!forecast.length) {
        tableWrap.innerHTML = '<div style="color:var(--text-3);padding:40px 0;text-align:center">Need at least 3 months of history.</div>';
      } else {
        var html = '<table class="cfo-table">' +
          '<thead><tr>' +
            '<th>Month</th><th class="num">Recession</th><th class="num">Base</th><th class="num">Growth</th><th class="num">Aggressive</th>' +
            '<th class="num">CI 80%</th><th class="num">CI 95%</th><th class="num">Customers</th>' +
          '</tr></thead><tbody>';
        forecast.forEach(function(f) {
          html += '<tr>' +
            '<td>' + f.label + '</td>' +
            '<td class="num cfo-var-neg">' + fmt(f.recession) + '</td>' +
            '<td class="num" style="font-weight:600">' + fmt(f.base) + '</td>' +
            '<td class="num cfo-var-pos">' + fmt(f.growth) + '</td>' +
            '<td class="num" style="color:var(--gold)">' + fmt(f.aggressive) + '</td>' +
            '<td class="num" style="color:var(--text-2);font-size:11px">' + fmt(f.ci80_low) + ' – ' + fmt(f.ci80_high) + '</td>' +
            '<td class="num" style="color:var(--text-3);font-size:11px">' + fmt(f.ci95_low) + ' – ' + fmt(f.ci95_high) + '</td>' +
            '<td class="num" style="color:var(--text-2)">' + f.implied_customers.toLocaleString() + '</td>' +
          '</tr>';
        });
        html += '</tbody></table>';
        html += '<div style="margin-top:16px;padding:12px;background:rgba(91,127,204,0.05);border-left:2px solid var(--denim);font-size:11px;color:var(--text-2);line-height:1.5">' +
          '<strong style="color:var(--text-1)">Methodology:</strong> ' + (data.methodology || '') +
          (data.confidence ? ' Residual std: $' + (data.confidence.residual_std/1000).toFixed(0) + 'K.' : '') +
          '</div>';
        tableWrap.innerHTML = html;
      }
    }

    console.log('[CFO Forecast brain v2] painted', { scenario: data.scenario_active, mape: data.backtest_mape });
  }

  function init() {
    document.querySelectorAll('.scenario-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        loadScenario(btn.getAttribute('data-scenario'));
      });
    });
    loadScenario('base');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
