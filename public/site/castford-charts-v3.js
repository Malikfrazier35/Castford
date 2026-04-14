/* Castford Charts v3 — Production Chart Library
   Design system: 0px radius, DM Sans, Geist Mono numbers,
   accounting parentheses for negatives, semantic colors.

   Usage:
     <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.4/chart.umd.min.js"></script>
     <script src="/site/castford-charts-v3.js"></script>
     
     CastfordCharts.revenueTrend('canvas-id', data);
*/

(function() {
  'use strict';

  // === DESIGN TOKENS ===
  var COLORS = {
    revenue:      '#1e40af',
    revenueFill:  'rgba(30,64,175,0.08)',
    positive:     '#059669',
    positiveFill: 'rgba(5,150,105,0.08)',
    negative:     '#dc2626',
    negativeFill: 'rgba(220,38,38,0.08)',
    warning:      '#d97706',
    warningFill:  'rgba(217,119,6,0.08)',
    forecast:     '#7c3aed',
    forecastFill: 'rgba(124,58,237,0.08)',
    neutral:      '#475569',
    neutralFill:  'rgba(71,85,105,0.06)',
    cashflow:     '#0891b2',
    budget:       '#be185d',
    grid:         '#f1f5f9',
    border:       '#e2e8f0',
    ink:          '#0f172a',
    t2:           '#475569',
    t3:           '#94a3b8',
    t4:           '#cbd5e1',
    white:        '#ffffff',
    green:        '#10b981',
  };

  var DEPT_COLORS = ['#1e40af','#059669','#d97706','#dc2626','#7c3aed','#0891b2','#be185d'];

  var FONT_BODY = "'DM Sans', sans-serif";
  var FONT_MONO = "'Geist Mono', 'SF Mono', 'Fira Code', monospace";

  // === NUMBER FORMATTING — ACCOUNTING CONVENTION ===
  function fmt(v) {
    if (v === 0 || v === null || v === undefined) return '\u2014'; // em dash for zero
    var abs = Math.abs(v);
    var str;
    if (abs >= 1e6) str = '$' + (abs / 1e6).toFixed(1) + 'M';
    else if (abs >= 1e3) str = '$' + Math.round(abs / 1e3).toLocaleString() + 'K';
    else str = '$' + abs.toFixed(0);
    return v < 0 ? '(' + str + ')' : str; // accounting parentheses
  }

  function fmtExact(v) {
    if (v === 0 || v === null || v === undefined) return '\u2014';
    var abs = Math.abs(v);
    var str = '$' + abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return v < 0 ? '(' + str + ')' : str;
  }

  function fmtDelta(v) {
    if (v === 0 || v === null || v === undefined) return '\u2014';
    return (v > 0 ? '+' : '') + v.toFixed(1) + '%';
  }

  function fmtPct(v) {
    return v.toFixed(1) + '%';
  }

  function fmtPp(v) {
    return (v > 0 ? '+' : '') + v.toFixed(1) + 'pp';
  }

  function getCanvas(id) { return typeof id === 'string' ? document.getElementById(id) : id; }
  function destroyExisting(canvas) { var existing = Chart.getChart(canvas); if (existing) existing.destroy(); }

  // === GLOBAL DEFAULTS — CASTFORD DESIGN SYSTEM ===
  function applyDefaults() {
    if (!window.Chart) return;
    Chart.defaults.font.family = FONT_BODY;
    Chart.defaults.font.size = 11;
    Chart.defaults.font.weight = '500';
    Chart.defaults.color = COLORS.t3;

    // Legend
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
    Chart.defaults.plugins.legend.labels.padding = 16;
    Chart.defaults.plugins.legend.labels.font = { family: FONT_BODY, size: 11, weight: '600' };

    // Tooltip — sharp corners, dark bg, no radius
    Chart.defaults.plugins.tooltip.backgroundColor = COLORS.ink;
    Chart.defaults.plugins.tooltip.titleFont = { family: FONT_BODY, size: 12, weight: '600' };
    Chart.defaults.plugins.tooltip.bodyFont = { family: FONT_MONO, size: 11, weight: '500' };
    Chart.defaults.plugins.tooltip.padding = { top: 10, bottom: 10, left: 14, right: 14 };
    Chart.defaults.plugins.tooltip.cornerRadius = 0; // SHARP — matches design system
    Chart.defaults.plugins.tooltip.displayColors = false;
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.08)';
    Chart.defaults.plugins.tooltip.borderWidth = 0.5;

    // Bar — SHARP tops, no border radius
    Chart.defaults.elements.bar.borderRadius = 0; // SHARP — matches design system
    Chart.defaults.elements.bar.borderSkipped = false;

    // Line
    Chart.defaults.elements.line.tension = 0.3;
    Chart.defaults.elements.point.radius = 0;
    Chart.defaults.elements.point.hoverRadius = 5;
    Chart.defaults.elements.point.hoverBackgroundColor = COLORS.ink;

    // Grid — barely visible
    Chart.defaults.scale.grid.color = COLORS.grid;
    Chart.defaults.scale.grid.lineWidth = 0.5;
    Chart.defaults.scale.border = { display: false };
    Chart.defaults.scale.ticks.font = { family: FONT_MONO, size: 10, weight: '500' };
    Chart.defaults.scale.ticks.color = COLORS.t3;
  }

  // Variance color helper — account-type aware
  function varianceColor(value, accountType) {
    if (value === 0) return COLORS.t3;
    if (accountType === 'revenue' || accountType === 'other_income') {
      return value > 0 ? COLORS.positive : COLORS.negative;
    }
    // For expenses: under budget (negative variance) is good
    return value < 0 ? COLORS.positive : COLORS.negative;
  }

  // ========================================
  // 1. REVENUE TREND — Area chart
  // ========================================
  function revenueTrend(canvasId, data) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    var months = data.trend || data.months || [];
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: months.map(function(m) { return m.month || m.period; }),
        datasets: [{
          label: 'Revenue',
          data: months.map(function(m) { return m.revenue; }),
          borderColor: COLORS.revenue,
          backgroundColor: COLORS.revenueFill,
          fill: true,
          borderWidth: 2,
          pointHoverBackgroundColor: COLORS.revenue,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function(ctx) { return 'Revenue: ' + fmt(ctx.parsed.y); } } }
        },
        scales: { y: { ticks: { callback: function(v) { return fmt(v); } } } }
      }
    });
  }

  // ========================================
  // 2. FORECAST CONFIDENCE — Line + band
  // ========================================
  function forecastConfidence(canvasId, data) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    var actuals = data.actuals || [];
    var forecast = data.forecast || data.projections || [];
    var allLabels = actuals.map(function(a) { return a.period; }).concat(forecast.map(function(f) { return f.period; }));
    var actualValues = actuals.map(function(a) { return a.value; });
    var forecastValues = new Array(actuals.length).fill(null).concat(forecast.map(function(f) { return f.value || f.predicted; }));
    var highBand = new Array(actuals.length).fill(null).concat(forecast.map(function(f) { return f.high || f.upper; }));
    var lowBand = new Array(actuals.length).fill(null).concat(forecast.map(function(f) { return f.low || f.lower; }));

    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          { label: 'Actual', data: actualValues.concat(new Array(forecast.length).fill(null)), borderColor: COLORS.revenue, fill: false, borderWidth: 2 },
          { label: 'Forecast', data: forecastValues, borderColor: COLORS.forecast, borderDash: [6, 4], borderWidth: 1.5, fill: false },
          { label: 'Upper', data: highBand, borderColor: 'transparent', backgroundColor: COLORS.forecastFill, fill: '+1', pointRadius: 0 },
          { label: 'Lower', data: lowBand, borderColor: 'transparent', backgroundColor: COLORS.forecastFill, fill: '-1', pointRadius: 0 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { labels: { filter: function(item) { return item.text !== 'Upper' && item.text !== 'Lower'; } } },
          tooltip: { callbacks: { label: function(ctx) { if (ctx.datasetIndex > 1) return ''; return ctx.dataset.label + ': ' + fmt(ctx.parsed.y); } } }
        },
        scales: { y: { ticks: { callback: function(v) { return fmt(v); } } } }
      }
    });
  }

  // ========================================
  // 3. BUDGET VARIANCE — Horizontal bars
  // ========================================
  function budgetVariance(canvasId, data) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    var accounts = (data.accounts || []).slice(0, 12);
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: accounts.map(function(a) { return a.name; }),
        datasets: [{
          label: 'Variance %',
          data: accounts.map(function(a) { return a.variance_pct; }),
          backgroundColor: accounts.map(function(a) {
            return varianceColor(a.variance_pct, a.account_type || 'expense');
          }),
          barThickness: 18,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: {
            label: function(ctx) {
              var a = accounts[ctx.dataIndex];
              return a.name + ': ' + fmt(a.actual) + ' vs ' + fmt(a.budget) + ' (' + fmtDelta(a.variance_pct) + ')';
            }
          }}
        },
        scales: {
          x: { ticks: { callback: function(v) { return v + '%'; }, font: { family: FONT_MONO } } },
          y: { ticks: { font: { family: FONT_BODY, size: 11 } } }
        }
      }
    });
  }

  // ========================================
  // 4. CASH FLOW WATERFALL
  // ========================================
  function cashFlowWaterfall(canvasId, data) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    var items = [{ label: 'Net income', value: data.net_income, type: 'start' }];
    if (data.operating && data.operating.items) {
      data.operating.items.forEach(function(i) { items.push({ label: i.name.replace(' (est.)', ''), value: i.amount, type: 'delta' }); });
    }
    items.push({ label: 'Operating CF', value: data.operating ? data.operating.total : 0, type: 'total' });
    if (data.investing && data.investing.items) {
      data.investing.items.forEach(function(i) { items.push({ label: i.name.replace(' (est.)', ''), value: i.amount, type: 'delta' }); });
    }
    items.push({ label: 'FCF', value: data.free_cash_flow || 0, type: 'total' });

    var running = 0;
    var bases = [], deltas = [];
    items.forEach(function(item) {
      if (item.type === 'start' || item.type === 'total') { bases.push(0); deltas.push(item.value); running = item.value; }
      else { var base = item.value >= 0 ? running : running + item.value; bases.push(Math.max(0, base)); deltas.push(Math.abs(item.value)); running += item.value; }
    });

    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: items.map(function(i) { return i.label; }),
        datasets: [
          { label: 'Base', data: bases, backgroundColor: 'transparent', borderWidth: 0, barThickness: 24 },
          { label: 'Value', data: deltas, backgroundColor: items.map(function(i) { return i.type === 'total' ? COLORS.cashflow : i.value >= 0 ? COLORS.positive : COLORS.negative; }), barThickness: 24 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function(ctx) { if (ctx.datasetIndex === 0) return ''; return items[ctx.dataIndex].label + ': ' + fmt(items[ctx.dataIndex].value); } } }
        },
        scales: {
          x: { stacked: true, ticks: { font: { size: 10 }, maxRotation: 45 } },
          y: { stacked: true, ticks: { callback: function(v) { return fmt(v); } } }
        }
      }
    });
  }

  // ========================================
  // 5. SCENARIO COMPARISON — Grouped bars
  // ========================================
  function scenarioComparison(canvasId, data) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    var b = data.baseline || {}, a = data.adjusted || {};
    var metrics = ['revenue', 'cogs', 'gross_profit', 'opex', 'net_income'];
    var labels = ['Revenue', 'COGS', 'Gross profit', 'OpEx', 'Net income'];

    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Baseline', data: metrics.map(function(m) { return b[m] || 0; }), backgroundColor: COLORS.neutral, barPercentage: 0.7, categoryPercentage: 0.7 },
          { label: 'Adjusted', data: metrics.map(function(m) { return a[m] || 0; }), backgroundColor: COLORS.forecast, barPercentage: 0.7, categoryPercentage: 0.7 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { tooltip: { callbacks: { label: function(ctx) { return ctx.dataset.label + ': ' + fmt(ctx.parsed.y); } } } },
        scales: { y: { ticks: { callback: function(v) { return fmt(v); } } } }
      }
    });
  }

  // ========================================
  // 6. DEPARTMENT DONUT
  // ========================================
  function departmentDonut(canvasId, data, metric) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    metric = metric || 'budget';
    var depts = data.departments || [];
    var total = depts.reduce(function(s, d) { return s + (d[metric] || 0); }, 0);

    return new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: depts.map(function(d) { return d.department.replace(/_/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); }); }),
        datasets: [{ data: depts.map(function(d) { return d[metric] || 0; }), backgroundColor: DEPT_COLORS, borderWidth: 1.5, borderColor: COLORS.white }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'right', labels: { font: { size: 11 }, padding: 10 } },
          tooltip: { callbacks: { label: function(ctx) { var val = ctx.parsed; return ctx.label + ': ' + fmt(val) + ' (' + fmtPct(val / total * 100) + ')'; } } }
        }
      }
    });
  }

  // ========================================
  // 7. HEADCOUNT STACKED BAR
  // ========================================
  function headcountPlan(canvasId, data) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    var depts = data.departments || [];
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: depts.map(function(d) { return d.department.replace(/_/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); }); }),
        datasets: [
          { label: 'Current', data: depts.map(function(d) { return d.current; }), backgroundColor: COLORS.revenue, barPercentage: 0.6 },
          { label: 'New hires', data: depts.map(function(d) { return d.net_new; }), backgroundColor: 'rgba(30,64,175,0.3)', barPercentage: 0.6 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { stacked: true }, y: { stacked: true, ticks: { stepSize: 5 } } },
        plugins: { tooltip: { callbacks: { afterBody: function(ctx) { var d = depts[ctx[0].dataIndex]; return 'Burden: ' + fmt(d.incremental_cost); } } } }
      }
    });
  }

  // ========================================
  // 8. SPARKLINE
  // ========================================
  function sparkline(canvasId, values, color) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    color = color || COLORS.revenue;
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: values.map(function() { return ''; }),
        datasets: [{ data: values, borderColor: color, backgroundColor: color.replace(')', ',0.06)').replace('rgb', 'rgba'), fill: true, borderWidth: 1.5 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        elements: { point: { radius: 0 } }
      }
    });
  }

  // ========================================
  // 9. ALERT SEVERITY GAUGE
  // ========================================
  function alertGauge(canvasId, data) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    var alerts = data.alerts || data.financial_alerts || [];
    var crit = alerts.filter(function(a) { return a.severity === 'critical'; }).length;
    var high = alerts.filter(function(a) { return a.severity === 'high'; }).length;
    var med = alerts.filter(function(a) { return a.severity === 'medium'; }).length;
    var low = alerts.filter(function(a) { return a.severity === 'low'; }).length;

    return new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{ data: [crit, high, med, low], backgroundColor: [COLORS.negative, '#ea580c', COLORS.warning, COLORS.positive], borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        rotation: -90, circumference: 180, cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 } } },
          tooltip: { callbacks: { label: function(ctx) { return ctx.label + ': ' + ctx.parsed + ' alerts'; } } }
        }
      }
    });
  }

  // ========================================
  // 10. BENCHMARK BULLET
  // ========================================
  function benchmarkBullet(canvasId, data) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    var metrics = data.scorecard || data.metrics || [];
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: metrics.map(function(m) { return m.metric || m.name; }),
        datasets: [
          { label: 'Your company', data: metrics.map(function(m) { return m.value || m.company; }), backgroundColor: COLORS.revenue, barThickness: 14 },
          { label: 'Industry median', data: metrics.map(function(m) { return m.median || m.benchmark; }), backgroundColor: COLORS.border, barThickness: 26 },
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { tooltip: { callbacks: { label: function(ctx) { return ctx.dataset.label + ': ' + fmtPct(ctx.parsed.x); } } } },
        scales: { x: { ticks: { callback: function(v) { return v + '%'; } } } }
      }
    });
  }

  // ========================================
  // 11. MONTHLY P&L MULTI-LINE
  // ========================================
  function monthlyPnL(canvasId, data) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    var months = data.trend || data.months || [];
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: months.map(function(m) { return m.month || m.period; }),
        datasets: [
          { label: 'Revenue', data: months.map(function(m) { return m.revenue; }), borderColor: COLORS.revenue, borderWidth: 2, fill: false },
          { label: 'OpEx', data: months.map(function(m) { return m.opex || m.operating_cf; }), borderColor: COLORS.warning, borderWidth: 1.5, fill: false },
          { label: 'Net income', data: months.map(function(m) { return m.net_income || m.fcf; }), borderColor: COLORS.positive, borderWidth: 1.5, fill: false },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: { tooltip: { callbacks: { label: function(ctx) { return ctx.dataset.label + ': ' + fmt(ctx.parsed.y); } } } },
        scales: { y: { ticks: { callback: function(v) { return fmt(v); } } } }
      }
    });
  }

  // ========================================
  // 12. FCF TREND — Bar + line combo
  // ========================================
  function fcfTrend(canvasId, data) {
    var canvas = getCanvas(canvasId); if (!canvas) return;
    destroyExisting(canvas);
    var months = data.trend || [];
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: months.map(function(m) { return m.month; }),
        datasets: [
          { type: 'bar', label: 'Revenue', data: months.map(function(m) { return m.revenue; }), backgroundColor: COLORS.revenueFill, borderColor: COLORS.revenue, borderWidth: 0.5, order: 2 },
          { type: 'line', label: 'FCF', data: months.map(function(m) { return m.fcf; }), borderColor: COLORS.positive, borderWidth: 2, fill: false, order: 1 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: { tooltip: { callbacks: { label: function(ctx) { return ctx.dataset.label + ': ' + fmt(ctx.parsed.y); } } } },
        scales: { y: { ticks: { callback: function(v) { return fmt(v); } } } }
      }
    });
  }

  // ========================================
  // APPLY + EXPOSE
  // ========================================
  applyDefaults();

  window.CastfordCharts = {
    revenueTrend: revenueTrend,
    forecastConfidence: forecastConfidence,
    budgetVariance: budgetVariance,
    cashFlowWaterfall: cashFlowWaterfall,
    scenarioComparison: scenarioComparison,
    departmentDonut: departmentDonut,
    headcountPlan: headcountPlan,
    sparkline: sparkline,
    alertGauge: alertGauge,
    benchmarkBullet: benchmarkBullet,
    monthlyPnL: monthlyPnL,
    fcfTrend: fcfTrend,
    // Formatting utilities
    fmt: fmt,
    fmtExact: fmtExact,
    fmtDelta: fmtDelta,
    fmtPct: fmtPct,
    fmtPp: fmtPp,
    varianceColor: varianceColor,
    colors: COLORS,
    version: '3.0.0',
  };
})();
