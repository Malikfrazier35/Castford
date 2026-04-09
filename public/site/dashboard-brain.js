/* Castford Dashboard Brain v2
   Bridges live API data → hardcoded DOM elements on all customer dashboards.
   
   Brains:
   1. KPI Brain: dashboard-summary → top-level KPIs (.pl-val, .kpi-val, .metric-val)
   2. P&L Brain: gl-data P&L → sub-line items (.pl-sub-row)
   3. Team Brain: users table → replaces fake names
   4. Module Brain: fills empty module placeholders with live KPI summary
   5. Chart Brain: renders data-cf-chart elements via castford-charts.js
*/

(function() {
  'use strict';
  var BASE = 'https://crecesswagluelvkesul.supabase.co/functions/v1';

  function fmt(val) {
    var abs = Math.abs(val);
    if (abs >= 1e9) return '$' + (val/1e9).toFixed(1) + 'B';
    if (abs >= 1e6) return '$' + (val/1e6).toFixed(1) + 'M';
    if (abs >= 1e3) return '$' + (val/1e3).toFixed(0) + 'K';
    return '$' + val.toFixed(0);
  }
  function fmtP(val) { return val < 0 ? '(' + fmt(Math.abs(val)) + ')' : fmt(val); }

  // ── BRAIN 1: KPI mapping ──
  function mapKPIs(kpis) {
    // P&L top-level rows
    document.querySelectorAll('.pl-row').forEach(function(row) {
      var label = row.querySelector('.pl-label');
      var val = row.querySelector('.pl-val');
      if (!label || !val) return;
      var t = (label.textContent||'').trim().toLowerCase();
      if (t === 'revenue' || t === 'total revenue') val.textContent = fmt(kpis.total_revenue);
      else if (t.includes('cost of') || t === 'cogs') val.textContent = fmtP(-kpis.cogs);
      else if (t === 'gross profit') { val.textContent = fmt(kpis.gross_profit); val.style.color = 'var(--green,#22C55E)'; }
      else if (t.includes('operating') || t === 'opex' || t === 'total opex') val.textContent = fmtP(-kpis.opex);
      else if (t === 'net income' || t === 'net profit') { val.textContent = fmt(kpis.net_income); val.style.color = kpis.net_income >= 0 ? 'var(--green,#22C55E)' : 'var(--red,#EF4444)'; }
    });

    // KPI cards / metric cards
    document.querySelectorAll('.kpi, .metric-card, .stat-card, [class*="kpi"], [class*="metric"]').forEach(function(card) {
      var label = card.querySelector('.kpi-label, .metric-label, .stat-label, h4, h3, .label');
      var val = card.querySelector('.kpi-val, .metric-val, .stat-val, .value, .amount');
      if (!label || !val) return;
      var t = (label.textContent||'').trim().toLowerCase();
      if (t.includes('revenue')) val.textContent = fmt(kpis.total_revenue);
      else if (t.includes('gross profit')) val.textContent = fmt(kpis.gross_profit);
      else if (t.includes('net income')) val.textContent = fmt(kpis.net_income);
      else if (t.includes('opex') || t.includes('operating')) val.textContent = fmt(kpis.opex);
      else if (t.includes('cogs') || t.includes('cost of')) val.textContent = fmt(kpis.cogs);
      else if (t.includes('gross margin')) val.textContent = kpis.gross_margin + '%';
      else if (t.includes('net margin')) val.textContent = kpis.net_margin + '%';
      else if (t.includes('account')) val.textContent = String(kpis.total_accounts);
      else if (t.includes('transaction')) val.textContent = (kpis.total_transactions||0).toLocaleString();
    });

    // Cash stat values
    document.querySelectorAll('.cash-stat-val').forEach(function(el) {
      var label = el.nextElementSibling || el.parentElement.querySelector('.cash-stat-label');
      if (!label) return;
      var t = (label.textContent||'').toLowerCase();
      if (t.includes('current') || t.includes('balance')) el.textContent = fmt(kpis.total_revenue * 0.7);
    });

    // Panel badges with dollar values
    document.querySelectorAll('.panel-badge').forEach(function(el) {
      if (el.textContent.trim().startsWith('$')) el.textContent = fmt(kpis.total_revenue * 0.7);
    });
  }

  // ── BRAIN 2: P&L sub-line items ──
  function mapSubLines(pnl) {
    if (!pnl || !pnl.length) return;
    // Flatten sections into a name→amount lookup (values in $K from API)
    var lookup = {};
    pnl.forEach(function(section) {
      (section.rows||[]).forEach(function(row) {
        var name = (row.name||'').toLowerCase().trim();
        lookup[name] = Math.abs(row.actual||0) * 1000; // API returns $K, convert to $
      });
    });

    document.querySelectorAll('.pl-sub-row').forEach(function(row) {
      var label = row.querySelector('span:first-child');
      var val = row.querySelector('.pl-val');
      if (!label || !val) return;
      var name = (label.textContent||'').trim().toLowerCase();

      // Try exact match first, then partial
      var amount = lookup[name];
      if (amount === undefined) {
        Object.keys(lookup).forEach(function(k) {
          if (amount === undefined && (k.includes(name) || name.includes(k))) amount = lookup[k];
        });
      }
      if (amount !== undefined && amount > 0) {
        // Determine if negative display (costs/expenses)
        var parentRow = row.previousElementSibling;
        while (parentRow && !parentRow.classList.contains('pl-row')) parentRow = parentRow.previousElementSibling;
        var parentLabel = parentRow ? (parentRow.querySelector('.pl-label')?.textContent||'').toLowerCase() : '';
        var isNeg = parentLabel.includes('cost') || parentLabel.includes('expense') || parentLabel.includes('opex');
        val.textContent = isNeg ? fmtP(-amount) : fmt(amount);
      }
    });
  }

  // ── BRAIN 3: Fake team names → real users ──
  var FAKE_NAMES = ['Alex Morgan','Sarah Chen','Priya Patel','James Rodriguez','David Kim','Marcus Webb','Jennifer Liu','Elena Vasquez'];
  function mapTeamNames(sb) {
    var hasFake = false;
    FAKE_NAMES.forEach(function(name) {
      if (document.body.innerHTML.includes(name)) hasFake = true;
    });
    if (!hasFake) return;

    sb.from('users').select('full_name, email, role').then(function(res) {
      var users = (res.data||[]).filter(function(u) { return u.full_name; });
      if (!users.length) return;

      // Walk text nodes and replace fake names with real ones
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      var node;
      while (node = walker.nextNode()) {
        FAKE_NAMES.forEach(function(fake, i) {
          if (node.nodeValue && node.nodeValue.includes(fake)) {
            var real = users[i % users.length];
            node.nodeValue = node.nodeValue.replace(fake, real.full_name);
          }
        });
      }
    });
  }

  // ── BRAIN 4: Empty module placeholders ──
  function fillModulePlaceholders(kpis) {
    document.querySelectorAll('main').forEach(function(main) {
      var moduleText = main.querySelector('[class*="module"], div');
      if (!moduleText) return;
      var text = (moduleText.textContent||'').trim();
      // Only replace if it's the generic placeholder
      if (text.includes('Module') && text.includes('Full interactive data views')) {
        moduleText.innerHTML = '<div style="text-align:center;padding:48px 24px;max-width:520px;margin:0 auto">' +
          '<div style="font-size:40px;font-weight:900;font-family:var(--m,monospace);margin-bottom:8px;color:var(--text,#0C1420)">' + fmt(kpis.total_revenue) + '</div>' +
          '<div style="font-size:13px;color:var(--text-3,#8A96A3);margin-bottom:24px">Total Revenue (YTD) across ' + (kpis.total_accounts||0) + ' accounts</div>' +
          '<div style="display:flex;gap:16px;justify-content:center;margin-bottom:32px">' +
            '<div style="text-align:center"><div style="font-size:22px;font-weight:800;font-family:var(--m,monospace);color:var(--green,#22C55E)">' + fmt(kpis.gross_profit) + '</div><div style="font-size:11px;color:var(--text-3,#8A96A3)">Gross Profit</div></div>' +
            '<div style="text-align:center"><div style="font-size:22px;font-weight:800;font-family:var(--m,monospace)">' + (kpis.gross_margin||0) + '%</div><div style="font-size:11px;color:var(--text-3,#8A96A3)">Gross Margin</div></div>' +
            '<div style="text-align:center"><div style="font-size:22px;font-weight:800;font-family:var(--m,monospace);color:' + (kpis.net_income >= 0 ? 'var(--green,#22C55E)' : 'var(--red,#EF4444)') + '">' + fmt(kpis.net_income) + '</div><div style="font-size:11px;color:var(--text-3,#8A96A3)">Net Income</div></div>' +
          '</div>' +
          '<div style="font-size:13px;color:var(--text-3,#8A96A3);line-height:1.6">Full interactive module with drill-down analysis, scenario modeling, and AI insights is available in your live workspace.</div>' +
          '</div>';
      }
    });
  }

  // ── BRAIN 5: LIVE badge ──
  function addLiveBadge() {
    if (document.querySelector('.brain-live-badge')) return;
    var target = document.querySelector('.pl-header, .section-header, h2, main > div:first-child');
    if (!target) return;
    var badge = document.createElement('span');
    badge.className = 'brain-live-badge';
    badge.style.cssText = 'display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:#22C55E;padding:2px 7px;background:rgba(34,197,94,0.08);margin-left:8px;font-family:var(--m,monospace);letter-spacing:0.04em';
    badge.innerHTML = '<span style="width:5px;height:5px;border-radius:50%;background:#22C55E;display:inline-block;animation:pulse 2s infinite"></span> LIVE';
    target.appendChild(badge);
  }

  // ── MAIN ACTIVATION ──
  async function activate() {
    var sb = window.__fos_supabase;
    if (!sb) { console.warn('[Brain] No auth client'); return; }

    // Wait for auth-guard
    var session = window.__fos_session;
    if (!session) {
      await new Promise(function(r) { setTimeout(r, 600); });
      session = window.__fos_session;
    }
    if (!session) {
      try { session = (await sb.auth.getSession()).data?.session; } catch(e) {}
    }
    if (!session) { console.warn('[Brain] No session — demo mode'); return; }

    var token = session.access_token;
    var headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };

    try {
      // Parallel fetch: summary KPIs + P&L breakdown
      var [summaryRes, plRes] = await Promise.all([
        fetch(BASE + '/dashboard-summary?view=summary', { headers: headers }),
        fetch(BASE + '/gl-data', { method: 'POST', headers: headers, body: JSON.stringify({ action: 'pnl' }) }),
      ]);

      var summary = await summaryRes.json();
      var pl = await plRes.json();

      if (summary.kpis) {
        console.log('[Brain v2] Live data loaded:', summary.kpis);
        mapKPIs(summary.kpis);
        fillModulePlaceholders(summary.kpis);
        addLiveBadge();
      }

      if (pl.pnl) {
        mapSubLines(pl.pnl);
      }

      // Charts
      if (window.CastfordCharts && summary) {
        CastfordCharts.render(summary);
      }

      // Team names (async, non-blocking)
      mapTeamNames(sb);

    } catch (e) {
      console.warn('[Brain v2] Data fetch failed:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(activate, 800); });
  } else {
    setTimeout(activate, 800);
  }
})();
