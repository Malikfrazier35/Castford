/* Castford CFO P&L Brain v1 — /cfo/pnl page */
(function() {
  'use strict';

  function fmt(v) { return window.CF.fmt(v); }
  function fmtNeg(v) { return Number(v) < 0 ? '(' + fmt(Math.abs(v)) + ')' : fmt(v); }

  async function run() {
    var data = await window.CF.fetchView('pnl');
    if (!data) return;
    window.CF.buildSyncBadge(data.meta);

    var sections = data.sections || [];
    var periods = data.periods || [];

    // ── KPIs ──
    var totals = {};
    sections.forEach(function(s) { totals[s.key] = s.total; });
    var revenue = totals.revenue || 0;
    var cogs = totals.cogs || 0;
    var opex = totals.opex || 0;
    var gross_profit = revenue - cogs;
    var net_income = revenue - cogs - opex;

    function setKPI(key, val) {
      var el = document.querySelector('[data-kpi="' + key + '"]');
      if (el) el.textContent = val;
    }
    setKPI('revenue', fmt(revenue));
    setKPI('gross_profit', fmt(gross_profit));
    setKPI('opex', fmt(opex));
    setKPI('net_income', fmt(net_income));

    // ── Detailed table ──
    var wrap = document.getElementById('pnl-table-wrap');
    if (!wrap) return;

    var table = document.createElement('table');
    table.className = 'cfo-table';

    // Header: Account + each period + Total
    var thead = document.createElement('thead');
    var hr = document.createElement('tr');
    var th0 = document.createElement('th');
    th0.textContent = 'Account';
    th0.style.minWidth = '220px';
    hr.appendChild(th0);
    periods.forEach(function(p) {
      var th = document.createElement('th');
      th.className = 'num';
      th.textContent = p.label;
      hr.appendChild(th);
    });
    var thT = document.createElement('th');
    thT.className = 'num';
    thT.textContent = 'Total';
    hr.appendChild(thT);
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');

    sections.forEach(function(section) {
      // Section header
      var sr = document.createElement('tr');
      sr.className = 'section-row';
      var sc = document.createElement('td');
      sc.colSpan = periods.length + 2;
      sc.textContent = section.label;
      sr.appendChild(sc);
      tbody.appendChild(sr);

      section.accounts.forEach(function(a) {
        var row = document.createElement('tr');
        var tdName = document.createElement('td');
        tdName.textContent = a.name;
        row.appendChild(tdName);

        periods.forEach(function(p) {
          var td = document.createElement('td');
          td.className = 'num';
          var v = a.monthly[p.period] || 0;
          td.textContent = v > 0 ? fmt(v) : '—';
          if (!v) td.style.color = 'var(--text-3)';
          row.appendChild(td);
        });

        var tdTotal = document.createElement('td');
        tdTotal.className = 'num';
        tdTotal.style.fontWeight = '600';
        tdTotal.textContent = fmt(a.amount);
        row.appendChild(tdTotal);

        tbody.appendChild(row);
      });

      // Section total row
      var tr = document.createElement('tr');
      tr.className = 'total-row';
      var td0 = document.createElement('td');
      td0.textContent = 'Total ' + section.label;
      tr.appendChild(td0);
      periods.forEach(function(p) {
        var sum = section.accounts.reduce(function(acc, a) { return acc + (a.monthly[p.period] || 0); }, 0);
        var td = document.createElement('td');
        td.className = 'num';
        td.textContent = sum > 0 ? fmt(sum) : '—';
        tr.appendChild(td);
      });
      var tdT = document.createElement('td');
      tdT.className = 'num';
      tdT.textContent = fmt(section.total);
      tr.appendChild(tdT);
      tbody.appendChild(tr);
    });

    // Bottom: Net Income
    var netRow = document.createElement('tr');
    netRow.className = 'total-row';
    netRow.style.borderTop = '3px solid var(--denim)';
    var netTd = document.createElement('td');
    netTd.innerHTML = '<strong style="color:var(--denim)">Net Income</strong>';
    netRow.appendChild(netTd);
    periods.forEach(function(p) {
      var r = sections.find(function(x) { return x.key === 'revenue'; });
      var c = sections.find(function(x) { return x.key === 'cogs'; });
      var o = sections.find(function(x) { return x.key === 'opex'; });
      var rv = (r?.accounts || []).reduce(function(a, x) { return a + (x.monthly[p.period] || 0); }, 0);
      var cg = (c?.accounts || []).reduce(function(a, x) { return a + (x.monthly[p.period] || 0); }, 0);
      var op = (o?.accounts || []).reduce(function(a, x) { return a + (x.monthly[p.period] || 0); }, 0);
      var net = rv - cg - op;
      var td = document.createElement('td');
      td.className = 'num';
      td.textContent = fmt(net);
      td.style.color = net >= 0 ? 'var(--green)' : 'var(--rose)';
      td.style.fontWeight = '600';
      netRow.appendChild(td);
    });
    var netTotal = document.createElement('td');
    netTotal.className = 'num';
    netTotal.textContent = fmt(net_income);
    netTotal.style.color = net_income >= 0 ? 'var(--green)' : 'var(--rose)';
    netTotal.style.fontWeight = '700';
    netRow.appendChild(netTotal);
    tbody.appendChild(netRow);

    table.appendChild(tbody);
    wrap.innerHTML = '';
    wrap.appendChild(table);

    console.log('[CFO P&L brain] painted', { accounts: sections.reduce(function(a, s) { return a + s.accounts.length; }, 0), periods: periods.length });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
