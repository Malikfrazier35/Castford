/* Castford Charts v1 — Lightweight CSS chart engine
   Replaces hardcoded SVG/CSS placeholder charts with real data-driven visuals.
   Works with dashboard-data.js for live GL data.
   
   Usage:
   <div data-cf-chart="bar" data-cf-source="monthly_trend" data-cf-field="revenue"></div>
   <div data-cf-chart="donut" data-cf-source="account_split"></div>
   <div data-cf-chart="kpi" data-cf-value="55000000" data-cf-label="Revenue (YTD)" data-cf-format="currency"></div>
   <div data-cf-chart="sparkline" data-cf-source="monthly_trend" data-cf-field="net"></div>
   
   Then: CastfordCharts.render(data) where data comes from dashboard-summary API
*/

window.CastfordCharts = (function() {
  'use strict';

  var COLORS = {
    prime: '#1A3F7A',
    warm: '#C4884A',
    green: '#22C55E',
    red: '#EF4444',
    blue: '#5B7FCC',
    violet: '#9B8AFF',
    cyan: '#06B6D4',
    slate: '#64748B',
    series: ['#1A3F7A', '#5B7FCC', '#C4884A', '#9B8AFF', '#06B6D4', '#22C55E', '#64748B', '#EF4444']
  };

  function fmt(val, type) {
    if (type === 'currency') {
      var abs = Math.abs(val);
      if (abs >= 1e9) return '$' + (val / 1e9).toFixed(1) + 'B';
      if (abs >= 1e6) return '$' + (val / 1e6).toFixed(1) + 'M';
      if (abs >= 1e3) return '$' + (val / 1e3).toFixed(0) + 'K';
      return '$' + val.toFixed(0);
    }
    if (type === 'pct') return val.toFixed(1) + '%';
    if (type === 'number') return val.toLocaleString();
    return String(val);
  }

  // BAR CHART — pure CSS
  function renderBar(el, data, field) {
    if (!data || !data.length) { el.innerHTML = '<div style="color:var(--t3);font-size:13px;padding:20px">No data</div>'; return; }
    var max = Math.max.apply(null, data.map(function(d) { return Math.abs(d[field] || 0); }));
    if (max === 0) max = 1;
    var html = '<div style="display:flex;align-items:flex-end;gap:4px;height:120px;padding:8px 0">';
    data.forEach(function(d, i) {
      var val = Math.abs(d[field] || 0);
      var pct = (val / max * 100).toFixed(0);
      var label = d.month ? d.month.slice(5) : (d.label || '');
      var color = COLORS.series[i % COLORS.series.length];
      html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%">';
      html += '<div style="width:100%;max-width:32px;height:' + pct + '%;background:' + color + ';min-height:2px;transition:height .4s;border-radius:1px 1px 0 0" title="' + fmt(val, 'currency') + '"></div>';
      html += '<div style="font-size:10px;color:var(--t3);margin-top:4px;font-family:var(--m)">' + label + '</div>';
      html += '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  // DONUT CHART — SVG
  function renderDonut(el, segments) {
    if (!segments || !segments.length) { el.innerHTML = '<div style="color:var(--t3);font-size:13px">No data</div>'; return; }
    var total = segments.reduce(function(s, d) { return s + (d.value || 0); }, 0);
    if (total === 0) total = 1;
    var size = 140, cx = size / 2, cy = size / 2, r = 50, sw = 14;
    var circumference = 2 * Math.PI * r;
    var offset = 0;
    var paths = '';
    var legend = '';
    segments.forEach(function(seg, i) {
      var pct = seg.value / total;
      var dash = circumference * pct;
      var gap = circumference - dash;
      var color = COLORS.series[i % COLORS.series.length];
      paths += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-dasharray="' + dash.toFixed(1) + ' ' + gap.toFixed(1) + '" stroke-dashoffset="' + (-offset).toFixed(1) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
      offset += dash;
      legend += '<div style="display:flex;align-items:center;gap:6px;font-size:12px"><span style="width:8px;height:8px;background:' + color + ';display:inline-block"></span><span style="color:var(--t2)">' + seg.label + '</span><span style="color:var(--ink);font-weight:600;margin-left:auto;font-family:var(--m)">' + (pct * 100).toFixed(0) + '%</span></div>';
    });
    var centerText = fmt(total, 'currency');
    el.innerHTML = '<div style="display:flex;align-items:center;gap:24px"><svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + paths + '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="700" fill="var(--ink)" font-family="var(--m)">' + centerText + '</text></svg><div style="display:flex;flex-direction:column;gap:6px;flex:1">' + legend + '</div></div>';
  }

  // KPI CARD
  function renderKPI(el, value, label, format, delta, deltaLabel) {
    var fmtVal = fmt(value, format);
    var deltaHtml = '';
    if (delta !== undefined && delta !== null) {
      var isPos = delta >= 0;
      var arrow = isPos ? '↗' : '↘';
      var dColor = isPos ? COLORS.green : COLORS.red;
      deltaHtml = '<div style="font-size:13px;margin-top:6px"><span style="color:' + dColor + ';font-weight:600">' + arrow + ' ' + Math.abs(delta).toFixed(1) + '%</span>';
      if (deltaLabel) deltaHtml += ' <span style="color:var(--t3)">' + deltaLabel + '</span>';
      deltaHtml += '</div>';
    }
    el.innerHTML = '<div style="font-size:12px;font-weight:600;color:var(--t2);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">' + label + '</div><div style="font-size:28px;font-weight:700;font-family:var(--m);color:var(--ink)">' + fmtVal + '</div>' + deltaHtml;
  }

  // SPARKLINE — SVG polyline
  function renderSparkline(el, data, field) {
    if (!data || !data.length) return;
    var vals = data.map(function(d) { return d[field] || 0; });
    var max = Math.max.apply(null, vals);
    var min = Math.min.apply(null, vals);
    var range = max - min || 1;
    var w = 200, h = 40;
    var points = vals.map(function(v, i) {
      var x = (i / (vals.length - 1)) * w;
      var y = h - ((v - min) / range) * (h - 4) - 2;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    var lastVal = vals[vals.length - 1];
    var isUp = vals.length > 1 && lastVal > vals[0];
    var color = isUp ? COLORS.green : COLORS.red;
    el.innerHTML = '<div style="display:flex;align-items:center;gap:12px"><svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><polyline points="' + points + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span style="font-family:var(--m);font-size:14px;font-weight:600;color:' + color + '">' + fmt(lastVal, 'currency') + '</span></div>';
  }

  // VARIANCE TABLE
  function renderVariance(el, data) {
    if (!data || !data.length) { el.innerHTML = '<div style="color:var(--t3);font-size:13px;padding:20px">No variance data for this period</div>'; return; }
    var html = '<table style="width:100%;border-collapse:collapse;font-size:13px">';
    html += '<thead><tr style="border-bottom:2px solid var(--bdr)"><th style="text-align:left;padding:8px;color:var(--t2);font-weight:600">Account</th><th style="text-align:right;padding:8px;color:var(--t2);font-weight:600">Budget</th><th style="text-align:right;padding:8px;color:var(--t2);font-weight:600">Actual</th><th style="text-align:right;padding:8px;color:var(--t2);font-weight:600">Variance</th><th style="text-align:right;padding:8px;color:var(--t2);font-weight:600">%</th></tr></thead><tbody>';
    data.forEach(function(row) {
      var vColor = row.variance >= 0 ? COLORS.green : COLORS.red;
      html += '<tr style="border-bottom:1px solid var(--bdr)">';
      html += '<td style="padding:8px;color:var(--ink)">' + (row.account || '') + '</td>';
      html += '<td style="padding:8px;text-align:right;font-family:var(--m);color:var(--t2)">' + fmt(row.budget, 'currency') + '</td>';
      html += '<td style="padding:8px;text-align:right;font-family:var(--m);color:var(--ink)">' + fmt(row.actual, 'currency') + '</td>';
      html += '<td style="padding:8px;text-align:right;font-family:var(--m);color:' + vColor + '">' + fmt(row.variance, 'currency') + '</td>';
      html += '<td style="padding:8px;text-align:right;font-family:var(--m);color:' + vColor + '">' + row.variance_pct + '%</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    el.innerHTML = html;
  }

  // TRANSACTION LIST
  function renderTransactions(el, data) {
    if (!data || !data.length) { el.innerHTML = '<div style="color:var(--t3);font-size:13px;padding:20px">No recent transactions</div>'; return; }
    var html = '<div style="display:flex;flex-direction:column;gap:1px">';
    data.forEach(function(t) {
      var isNeg = t.amount < 0;
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--bdr)">';
      html += '<div><div style="font-size:14px;color:var(--ink);font-weight:500">' + (t.account || t.description || '') + '</div><div style="font-size:12px;color:var(--t3)">' + (t.date || '') + ' · ' + (t.type || '') + '</div></div>';
      html += '<div style="font-family:var(--m);font-size:14px;font-weight:600;color:' + (isNeg ? COLORS.red : COLORS.green) + '">' + fmt(t.amount, 'currency') + '</div>';
      html += '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  // AUTO-RENDER: scan page for data-cf-chart elements
  function render(apiData) {
    if (!apiData) return;
    document.querySelectorAll('[data-cf-chart]').forEach(function(el) {
      var type = el.dataset.cfChart;
      var source = el.dataset.cfSource;
      var field = el.dataset.cfField;
      var format = el.dataset.cfFormat || 'currency';

      if (type === 'bar' && source === 'monthly_trend') {
        renderBar(el, apiData.monthly_trend, field || 'revenue');
      } else if (type === 'donut' && source === 'account_split') {
        // Build account split from KPIs
        var segments = [
          { label: 'Revenue', value: apiData.kpis?.total_revenue || 0 },
          { label: 'COGS', value: apiData.kpis?.cogs || 0 },
          { label: 'OPEX', value: apiData.kpis?.opex || 0 },
        ];
        renderDonut(el, segments);
      } else if (type === 'kpi') {
        var val = Number(el.dataset.cfValue) || 0;
        // Override with live data if available
        if (source && apiData.kpis && apiData.kpis[source]) val = apiData.kpis[source];
        var label = el.dataset.cfLabel || '';
        var delta = el.dataset.cfDelta ? Number(el.dataset.cfDelta) : null;
        renderKPI(el, val, label, format, delta, el.dataset.cfDeltaLabel);
      } else if (type === 'sparkline') {
        renderSparkline(el, apiData.monthly_trend, field || 'revenue');
      } else if (type === 'variance') {
        renderVariance(el, apiData.variance);
      } else if (type === 'transactions') {
        renderTransactions(el, apiData.recent_transactions);
      }
    });
  }

  return {
    render: render,
    renderBar: renderBar,
    renderDonut: renderDonut,
    renderKPI: renderKPI,
    renderSparkline: renderSparkline,
    renderVariance: renderVariance,
    renderTransactions: renderTransactions,
    fmt: fmt,
    COLORS: COLORS,
  };
})();
