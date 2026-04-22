/* Castford CFO Cash Brain v2 — 13-week rolling forecast + CCC */
(function() {
  'use strict';
  function fmt(v) { return window.CF.fmt(v); }

  async function run() {
    var data = await window.CF.fetchView('cash');
    if (!data) return;
    window.CF.buildSyncBadge(data.meta);

    var s = data.summary || {};
    function setKPI(key, val, color) {
      var el = document.querySelector('[data-kpi="' + key + '"]');
      if (el) { el.textContent = val; if (color) el.style.color = color; }
    }
    setKPI('cash_position', fmt(s.cash_position));
    setKPI('working_capital', fmt(s.working_capital));
    setKPI('monthly_burn', s.monthly_burn === 0 ? 'Profitable' : fmt(s.monthly_burn) + '/mo');
    setKPI('runway', s.runway_months === null ? 'Indefinite' : s.runway_months + ' months',
      s.runway_months === null ? 'var(--green)' : s.runway_months < 6 ? 'var(--rose)' : s.runway_months < 12 ? 'var(--amber)' : 'var(--green)');

    // ── Cash Conversion Cycle ──
    var cccBlock = document.getElementById('ccc-block');
    if (cccBlock) {
      var ccc = data.ccc;
      if (!ccc) {
        cccBlock.innerHTML = '<div style="color:var(--text-3);padding:20px 0">CCC requires AR and AP tables. Connect QuickBooks/Xero with AR/AP enabled.</div>';
      } else {
        cccBlock.innerHTML =
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px">' +
            '<div><div class="k-label" style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px">DSO</div>' +
              '<div style="font-family:Geist Mono,monospace;font-size:28px;color:var(--text-1)">' + ccc.dso + ' <span style="font-size:14px;color:var(--text-3)">days</span></div>' +
              '<div style="font-size:11px;color:var(--text-3);margin-top:4px">Days Sales Outstanding</div></div>' +
            '<div><div class="k-label" style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px">DIO</div>' +
              '<div style="font-family:Geist Mono,monospace;font-size:28px;color:var(--text-1)">' + ccc.dio + ' <span style="font-size:14px;color:var(--text-3)">days</span></div>' +
              '<div style="font-size:11px;color:var(--text-3);margin-top:4px">Days Inventory Outstanding</div></div>' +
            '<div><div class="k-label" style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px">DPO</div>' +
              '<div style="font-family:Geist Mono,monospace;font-size:28px;color:var(--text-1)">' + ccc.dpo + ' <span style="font-size:14px;color:var(--text-3)">days</span></div>' +
              '<div style="font-size:11px;color:var(--text-3);margin-top:4px">Days Payable Outstanding</div></div>' +
            '<div><div class="k-label" style="font-size:10px;color:var(--denim);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px">CCC</div>' +
              '<div style="font-family:Geist Mono,monospace;font-size:28px;color:var(--denim);font-weight:700">' + ccc.ccc + ' <span style="font-size:14px;color:var(--text-2)">days</span></div>' +
              '<div style="font-size:11px;color:var(--text-3);margin-top:4px">DSO + DIO − DPO</div></div>' +
          '</div>' +
          (ccc.note ? '<div style="margin-top:12px;padding:10px 12px;background:rgba(196,136,74,0.08);border-left:2px solid var(--gold);font-size:11px;color:var(--text-2);line-height:1.5">' +
            '<strong style="color:var(--text-1)">Note:</strong> ' + ccc.note +
            '</div>' : '');
      }
    }

    // ── 13-week forecast ──
    var fcWrap = document.getElementById('cash-forecast');
    if (fcWrap) {
      var hist = data.weekly_history || [];
      var fc = data.weekly_forecast || [];
      var combined = hist.concat(fc);
      if (!combined.length) {
        fcWrap.innerHTML = '<div style="color:var(--text-3);padding:20px 0">No weekly data yet.</div>';
      } else {
        var maxNet = Math.max.apply(null, combined.map(function(w) { return Math.abs(w.net); }));
        var html = '<div style="display:flex;align-items:flex-end;justify-content:space-between;height:180px;gap:2px;padding:20px 0;border-bottom:1px solid var(--panel-border);position:relative">' +
          '<div style="position:absolute;left:0;right:0;top:50%;border-top:1px dashed var(--panel-border)"></div>';
        combined.forEach(function(w) {
          var pct = maxNet > 0 ? Math.abs(w.net) / maxNet * 50 : 0;
          var pos = w.net >= 0;
          var color = w.forecast ? (pos ? 'rgba(91,127,204,0.7)' : 'rgba(239,68,68,0.6)') : (pos ? 'var(--green)' : 'var(--rose)');
          var border = w.forecast ? 'border:1px dashed rgba(91,127,204,0.5)' : '';
          html += '<div style="flex:1;min-width:8px;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:center">' +
            '<div style="width:100%;height:50%;display:flex;align-items:flex-end">' +
              (pos ? '<div style="width:100%;height:' + pct*2 + '%;background:' + color + ';' + border + ';border-radius:1px 1px 0 0;transition:height 0.6s"></div>' : '') +
            '</div>' +
            '<div style="width:100%;height:50%;display:flex;align-items:flex-start">' +
              (!pos ? '<div style="width:100%;height:' + pct*2 + '%;background:' + color + ';' + border + ';border-radius:0 0 1px 1px;transition:height 0.6s"></div>' : '') +
            '</div>' +
            '</div>';
        });
        html += '</div>';
        var fcStartIdx = hist.length;
        html += '<div style="display:flex;justify-content:space-between;padding-top:12px;font-size:10px;color:var(--text-3)">' +
          '<span>13 weeks history</span>' +
          '<span style="border-left:2px dashed var(--denim);padding-left:6px">→ 13 weeks forecast (avg-based)</span>' +
          '</div>';
        fcWrap.innerHTML = html;
      }
    }

    // ── Weekly history table ──
    var weeklyWrap = document.getElementById('cash-weekly');
    if (weeklyWrap) {
      var weeks = data.weekly_history || [];
      if (!weeks.length) {
        weeklyWrap.innerHTML = '<div style="color:var(--text-3);padding:20px 0">No weekly data yet.</div>';
      } else {
        var max = Math.max.apply(null, weeks.map(function(w) { return Math.max(w.inflow, w.outflow); }));
        var rows = '<div style="display:flex;flex-direction:column;gap:6px">';
        weeks.forEach(function(w) {
          var inPct = max > 0 ? w.inflow / max * 100 : 0;
          var outPct = max > 0 ? w.outflow / max * 100 : 0;
          rows += '<div style="display:grid;grid-template-columns:60px 1fr 70px 1fr 70px;gap:8px;align-items:center;font-size:11px">' +
            '<div style="color:var(--text-3);font-family:Geist Mono,monospace">' + w.week.slice(5) + '</div>' +
            '<div style="height:5px;background:rgba(34,197,94,0.1);position:relative"><div style="width:' + inPct + '%;height:100%;background:var(--green);transition:width 0.8s"></div></div>' +
            '<div style="color:var(--green);font-family:Geist Mono,monospace;text-align:right">' + fmt(w.inflow) + '</div>' +
            '<div style="height:5px;background:rgba(239,68,68,0.1);position:relative"><div style="width:' + outPct + '%;height:100%;background:var(--rose);transition:width 0.8s"></div></div>' +
            '<div style="color:var(--rose);font-family:Geist Mono,monospace;text-align:right">' + fmt(w.outflow) + '</div>' +
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
          var isPos = m.net >= 0;
          html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">' +
            '<div style="height:100%;width:100%;display:flex;align-items:' + (isPos ? 'flex-end' : 'flex-start') + ';position:relative">' +
            '<div style="width:100%;height:' + pctH + '%;background:' + (isPos ? 'linear-gradient(to top,#22C55E,#4ADE80)' : 'linear-gradient(to bottom,#EF4444,#FCA5A5)') + ';transition:height 0.8s ease"></div>' +
            '</div>' +
            '<div style="font-size:10px;color:var(--text-3);font-family:Geist Mono,monospace">' + m.label + '</div>' +
            '</div>';
        });
        html += '</div>';
        monthlyWrap.innerHTML = html;
      }
    }

    console.log('[CFO Cash brain v2] painted', { weeks: (data.weekly_history||[]).length, forecast: (data.weekly_forecast||[]).length });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
