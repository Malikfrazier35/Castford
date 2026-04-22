/* Castford CFO Command Brain v3
 * Hub orchestrator. Paints EVERY live zone on /cfo:
 *   - 6 top KPI cards (.kpi-card → .kpi-value/.kpi-label/.kpi-delta/.kpi-spark)
 *   - P&L statement rows (.pl-row → .pl-label/.pl-val/.pl-bar-fill)
 *   - Cash Position panel header pill (.panel-badge.badge-green)
 *   - Cash bars (6-month .cash-bar elements with data-h)
 *   - Cash stats (Current + Runway via .cash-stat-val)
 *   - Sync indicator (.refresh-indicator or builds one)
 *
 * Re-fires paint at 1500ms to win the race with cfo.html inline animateBars().
 * All errors swallowed locally so one zone failing doesn't break others.
 */
(function() {
  'use strict';

  var BASE = 'https://crecesswagluelvkesul.supabase.co/functions/v1';
  var SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTU0NTAsImV4cCI6MjA3NjA5MTQ1MH0.h7nBkfmZHLbuzqJxhX6lgfRFWxgjYuxl5d2SbkRSaCk';

  function fmt(v) {
    var n = Number(v) || 0; var a = Math.abs(n);
    if (a >= 1e9) return '$' + (n/1e9).toFixed(1) + 'B';
    if (a >= 1e6) return '$' + (n/1e6).toFixed(1) + 'M';
    if (a >= 1e3) return '$' + (n/1e3).toFixed(0) + 'K';
    return '$' + n.toFixed(0);
  }
  function fmtNeg(v) { return '(' + fmt(Math.abs(v)) + ')'; }
  function pct(v) { var n = Number(v) || 0; return (n >= 0 ? '+' : '') + n.toFixed(1) + '%'; }

  async function getToken() {
    // Strategy 1: own UMD client (window.supabase from CDN UMD bundle on page)
    try {
      if (window.supabase && window.supabase.createClient) {
        var c = window.supabase.createClient(SB_URL, SB_KEY);
        var s = await c.auth.getSession();
        if (s.data && s.data.session && s.data.session.access_token) return s.data.session.access_token;
      }
    } catch (e) {}
    // Strategy 2: legacy global from auth-guard
    try {
      if (window.__fos_session && window.__fos_session.access_token) return window.__fos_session.access_token;
      if (window.__fos_supabase) {
        var s2 = await window.__fos_supabase.auth.getSession();
        if (s2.data && s2.data.session) return s2.data.session.access_token;
      }
    } catch (e) {}
    // Strategy 3: raw localStorage scan for sb-*-auth-token
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (/^sb-.*-auth-token$/.test(k)) {
          var v = JSON.parse(localStorage.getItem(k));
          if (v && v.access_token) return v.access_token;
          if (v && v.currentSession && v.currentSession.access_token) return v.currentSession.access_token;
        }
      }
    } catch (e) {}
    return null;
  }

  // ─────────────────────────────── PAINT FUNCTIONS ───────────────────────────────

  function paintKPIs(kpis, deltas) {
    var painted = 0;
    document.querySelectorAll('.kpi-card').forEach(function(card) {
      var labelEl = card.querySelector('.kpi-label');
      var valEl = card.querySelector('.kpi-value');
      var deltaEl = card.querySelector('.kpi-delta');
      if (!labelEl || !valEl) return;
      var label = (labelEl.textContent || '').trim().toLowerCase();

      try {
        if (label === 'total revenue' || label === 'revenue') {
          valEl.textContent = fmt(kpis.revenue);
          if (deltaEl && deltas.revenue_yoy !== null && deltas.revenue_yoy !== undefined) {
            deltaEl.textContent = (deltas.revenue_yoy >= 0 ? '▲ ' : '▼ ') + Math.abs(deltas.revenue_yoy).toFixed(0) + '% YoY';
            deltaEl.className = 'kpi-delta ' + (deltas.revenue_yoy >= 0 ? 'up' : 'down');
          }
          painted++;
        } else if (label === 'gross margin') {
          valEl.textContent = (kpis.gross_margin || 0).toFixed(1) + '%';
          if (deltaEl && deltas.gross_margin_qoq !== null && deltas.gross_margin_qoq !== undefined) {
            deltaEl.textContent = (deltas.gross_margin_qoq >= 0 ? '▲ ' : '▼ ') + Math.abs(deltas.gross_margin_qoq).toFixed(1) + 'pts QoQ';
            deltaEl.className = 'kpi-delta ' + (deltas.gross_margin_qoq >= 0 ? 'up' : 'down');
          }
          painted++;
        } else if (label === 'operating cash flow' || label === 'ocf') {
          valEl.textContent = fmt(kpis.operating_cash_flow);
          if (deltaEl && deltas.ocf_qoq !== null && deltas.ocf_qoq !== undefined) {
            deltaEl.textContent = (deltas.ocf_qoq >= 0 ? '▲ ' : '▼ ') + Math.abs(deltas.ocf_qoq).toFixed(1) + '% QoQ';
            deltaEl.className = 'kpi-delta ' + (deltas.ocf_qoq >= 0 ? 'up' : 'down');
          }
          painted++;
        } else if (label === 'roic') {
          valEl.textContent = (kpis.roic || 0).toFixed(1) + '%';
          if (deltaEl && deltas.roic_yoy !== null && deltas.roic_yoy !== undefined) {
            deltaEl.textContent = (deltas.roic_yoy >= 0 ? '▲ ' : '▼ ') + Math.abs(deltas.roic_yoy).toFixed(1) + 'pts YoY';
            deltaEl.className = 'kpi-delta ' + (deltas.roic_yoy >= 0 ? 'up' : 'down');
          }
          painted++;
        } else if (label === 'net income') {
          valEl.textContent = fmt(kpis.net_income);
          if (deltaEl && deltas.net_income_yoy !== null && deltas.net_income_yoy !== undefined) {
            deltaEl.textContent = (deltas.net_income_yoy >= 0 ? '▲ ' : '▼ ') + Math.abs(deltas.net_income_yoy).toFixed(0) + '% YoY';
            deltaEl.className = 'kpi-delta ' + (deltas.net_income_yoy >= 0 ? 'up' : 'down');
          }
          painted++;
        } else if (label === 'burn rate') {
          if (kpis.burn_rate === 0) {
            valEl.textContent = '$0';
            if (deltaEl) { deltaEl.textContent = 'Profitable'; deltaEl.className = 'kpi-delta up'; }
          } else {
            valEl.textContent = fmt(kpis.burn_rate) + '/mo';
            if (deltaEl) { deltaEl.textContent = kpis.burn_status || 'elevated'; deltaEl.className = 'kpi-delta down'; }
          }
          painted++;
        }
      } catch (e) { console.warn('[CFO brain] KPI paint error on', label, e); }
    });
    console.log('[CFO brain v3] KPIs painted:', painted, '/ 6');
  }

  function paintPL(kpis) {
    var painted = 0;
    document.querySelectorAll('.pl-row').forEach(function(row) {
      var labelEl = row.querySelector('.pl-label');
      var valEl = row.querySelector('.pl-val');
      if (!labelEl || !valEl) return;
      var label = (labelEl.textContent || '').trim().toLowerCase();

      try {
        if (label === 'revenue' || label === 'total revenue') {
          valEl.textContent = fmt(kpis.revenue);
          painted++;
        } else if (label === 'cogs' || label.indexOf('cost of') > -1) {
          valEl.textContent = fmtNeg(kpis.cogs);
          painted++;
        } else if (label === 'gross profit') {
          valEl.textContent = fmt(kpis.gross_profit);
          valEl.style.color = 'var(--green,#22C55E)';
          painted++;
        } else if (label === 'opex' || label === 'operating expenses' || label.indexOf('operating') > -1) {
          valEl.textContent = fmtNeg(kpis.opex);
          painted++;
        } else if (label === 'net income' || label === 'net profit') {
          valEl.textContent = fmt(kpis.net_income);
          valEl.style.color = kpis.net_income >= 0 ? 'var(--green,#22C55E)' : 'var(--rose,#EF4444)';
          painted++;
        }
      } catch (e) { console.warn('[CFO brain] P&L paint error on', label, e); }
    });
    console.log('[CFO brain v3] P&L rows painted:', painted);
  }

  function paintPLBars(bars) {
    if (!bars) return;
    var painted = 0;
    document.querySelectorAll('.pl-row').forEach(function(row) {
      var labelEl = row.querySelector('.pl-label');
      var fillEl = row.querySelector('.pl-bar-fill');
      if (!labelEl || !fillEl) return;
      var label = (labelEl.textContent || '').trim().toLowerCase();
      try {
        if ((label === 'revenue' || label === 'total revenue') && bars.revenue && bars.revenue.pct !== null) {
          fillEl.style.width = Math.min(100, bars.revenue.pct) + '%';
          fillEl.dataset.w = Math.min(100, bars.revenue.pct) + '%'; // also update data-w so animateBars doesn't overwrite
          painted++;
        } else if ((label === 'cogs' || label.indexOf('cost of') > -1) && bars.cogs && bars.cogs.pct !== null) {
          fillEl.style.width = Math.min(100, bars.cogs.pct) + '%';
          fillEl.dataset.w = Math.min(100, bars.cogs.pct) + '%';
          painted++;
        } else if ((label === 'opex' || label.indexOf('operating') > -1) && bars.opex && bars.opex.pct !== null) {
          fillEl.style.width = Math.min(100, bars.opex.pct) + '%';
          fillEl.dataset.w = Math.min(100, bars.opex.pct) + '%';
          painted++;
        }
      } catch (e) { console.warn('[CFO brain] P&L bar paint error on', label, e); }
    });
    console.log('[CFO brain v3] P&L bars painted:', painted);
  }

  function paintCashBars(bars) {
    if (!bars || !bars.length) return;
    var els = document.querySelectorAll('.cash-bar');
    if (!els.length) return;
    var painted = 0;
    var n = Math.min(els.length, bars.length);
    for (var i = 0; i < n; i++) {
      try {
        var el = els[i];
        var d = bars[i];
        // Update height percentage
        el.style.height = d.pct + '%';
        el.dataset.h = d.pct + '%';
        // Update label
        var labelEl = el.querySelector('.cash-bar-label');
        if (labelEl) labelEl.textContent = d.label;
        painted++;
      } catch (e) { console.warn('[CFO brain] Cash bar paint error', i, e); }
    }
    console.log('[CFO brain v3] Cash bars painted:', painted);
  }

  function paintCashPosition(kpis) {
    // 1) The .panel-badge.badge-green pill in Cash Position panel header
    document.querySelectorAll('.panel').forEach(function(panel) {
      var titleEl = panel.querySelector('.panel-title');
      if (!titleEl) return;
      var title = (titleEl.textContent || '').trim().toLowerCase();
      if (title === 'cash position') {
        var badge = panel.querySelector('.panel-badge');
        if (badge) {
          badge.textContent = fmt(kpis.cash_position);
          console.log('[CFO brain v3] Cash Position pill painted:', fmt(kpis.cash_position));
        }
        // 2) Both .cash-stat-val elements inside this panel: [0]=Current cash, [1]=Runway
        var stats = panel.querySelectorAll('.cash-stat-val');
        if (stats.length >= 1) {
          stats[0].textContent = fmt(kpis.cash_position);
        }
        if (stats.length >= 2) {
          // Runway: cash_position / monthly_burn (when burn > 0)
          if (kpis.burn_rate && kpis.burn_rate > 0) {
            var runway = Math.floor(kpis.cash_position / kpis.burn_rate);
            stats[1].textContent = runway + ' mo';
            stats[1].style.color = runway < 6 ? 'var(--rose,#EF4444)' : runway < 12 ? 'var(--amber,#F59E0B)' : 'var(--green,#22C55E)';
          } else {
            stats[1].textContent = '∞';
            stats[1].style.color = 'var(--green,#22C55E)';
          }
        }
        console.log('[CFO brain v3] Cash stats painted:', stats.length);
      }
    });
  }

  function paintSparklines(sparklines) {
    if (!sparklines) return;
    // .kpi-spark elements — the brain does not yet replace these because the
    // existing SVG aesthetic is acceptable. Future enhancement: redraw SVG bars
    // from sparklines.net_income / sparklines.burn_rate arrays.
    // For now: log how many we found.
    var sparks = document.querySelectorAll('.kpi-spark');
    console.log('[CFO brain v3] Sparkline containers found:', sparks.length, '(left untouched — visual aesthetic preserved)');
  }

  function paintSyncBadge(meta) {
    if (!meta) return;
    var existing = document.querySelector('.refresh-indicator');
    if (existing) {
      existing.textContent = meta.demo_mode ? 'Demo data' : (meta.last_sync_at ? 'Synced ' + new Date(meta.last_sync_at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}) : 'Live');
    }
  }

  // ─────────────────────────────── ORCHESTRATOR ───────────────────────────────

  var lastData = null;

  function paintAll(data) {
    if (!data || !data.kpis) return;
    paintKPIs(data.kpis, data.deltas || {});
    paintPL(data.kpis);
    paintPLBars(data.bars || {});
    paintCashBars(data.cash_bars || []);
    paintCashPosition(data.kpis);
    paintSparklines(data.sparklines || {});
    paintSyncBadge(data.meta || {});
    console.log('[CFO brain v3] paintAll complete', { revenue: data.kpis.revenue, net: data.kpis.net_income, cash: data.kpis.cash_position });
  }

  async function run() {
    var token = await getToken();
    if (!token) { console.warn('[CFO brain v3] No auth token — redirecting to /login'); window.location.href = '/login'; return; }

    try {
      var resp = await fetch(BASE + '/cfo-command-center?view=hub', {
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      });
      if (resp.status === 401 || resp.status === 403) { window.location.href = '/login'; return; }
      if (!resp.ok) {
        console.error('[CFO brain v3] Hub fetch failed', resp.status);
        return;
      }
      var data = await resp.json();
      lastData = data;

      if (data.meta && data.meta.demo_mode) {
        console.log('[CFO brain v3] demo mode — designed values preserved');
        return;
      }

      paintAll(data);

      // Re-fire at 1500ms to win the race with cfo.html inline setTimeout(animateBars,400)
      // and the entrance animation that resets transforms at 1500ms.
      setTimeout(function() {
        if (lastData) {
          console.log('[CFO brain v3] re-firing paint @ 1500ms to win race');
          paintAll(lastData);
        }
      }, 1500);

    } catch (err) {
      console.error('[CFO brain v3] Error:', err);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
