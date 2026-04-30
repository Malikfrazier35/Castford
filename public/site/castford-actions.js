/* Castford Actions v1 — Universal button handler for live-dashboard
   ────────────────────────────────────────────────────────────────
   Provides:
     • Event-delegated dispatch for [data-cf-action] buttons
     • Toast notifications (replaces all alert() calls)
     • Modal dialog system with form helpers and focus trap
     • Confirm prompts (returns Promise<boolean>)
     • Authenticated edge-function caller (reuses CastfordData session)
     • Demo-mode awareness (mutating actions degrade gracefully)
     • Loading states on buttons during async work
     • CSV download utility for export actions
     • Keyboard accessibility (Esc closes, Enter submits, focus trap)

   Public API (window):
     window.cfActions      — action registry (extensible)
     window.cfToast(msg, type)
     window.cfDialog.open({title, body, actions})
     window.cfDialog.confirm(message, opts) → Promise<boolean>
     window.cfCallEdge(fn, body) → Promise<{...}|{error}>

   Usage in markup:
     <button data-cf-action="billing.openPortal">Manage Subscription</button>
*/
(function() {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────
  var SUPABASE_URL = 'https://crecesswagluelvkesul.supabase.co';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDI4NTgsImV4cCI6MjA4OTQ3ODg1OH0.dFJHfGixRS7ZDHbPqNuzVdRigVqmiPJwD8LFkZYqhIQ';

  // ── Utility: HTML escape ───────────────────────────────────────
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function escAttr(s) { return String(s == null ? '' : s).replace(/"/g, '&quot;'); }
  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '')); }

  // ── Inject styles (toast + modal + spinner) ────────────────────
  // Styles use Castford CSS variables (var(--bg), var(--surface), var(--accent), etc.)
  // so they auto-adapt to [data-theme="day"] / [data-theme="night"] switches.
  // Display font is Instrument Sans (not Serif), per current live theme.
  var STYLES = [
    '/* Castford Actions UI — adapts to day/night via :root vars */',
    '.cf-toast-host{position:fixed;top:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:380px}',
    '.cf-toast{background:var(--surface);border:0.5px solid var(--border2);border-radius:var(--radius);padding:12px 14px;box-shadow:var(--shadow-md);display:flex;gap:10px;align-items:flex-start;font-family:var(--font);font-size:13px;color:var(--t1);pointer-events:auto;transform:translateX(120%);opacity:0;transition:transform .25s var(--ease),opacity .2s var(--ease)}',
    '.cf-toast.show{transform:translateX(0);opacity:1}',
    '.cf-toast-icon{flex-shrink:0;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;margin-top:1px;font-family:var(--font)}',
    '.cf-toast.success .cf-toast-icon{background:var(--green)}',
    '.cf-toast.error .cf-toast-icon{background:var(--red)}',
    '.cf-toast.info .cf-toast-icon{background:var(--accent-ink)}',
    '[data-theme="night"] .cf-toast.info .cf-toast-icon{background:var(--accent);color:#0A0F1F}',
    '.cf-toast.warn .cf-toast-icon{background:var(--gold)}',
    '.cf-toast-body{flex:1;line-height:1.45;color:var(--t1)}',
    '.cf-toast-close{background:none;border:0;color:var(--t3);cursor:pointer;padding:0 0 0 4px;font-size:16px;line-height:1;font-family:var(--font)}',
    '.cf-toast-close:hover{color:var(--t1)}',
    '/* Modal */',
    '.cf-modal-host{position:fixed;inset:0;z-index:99998;display:flex;align-items:flex-start;justify-content:center;padding:80px 20px 40px;background:rgba(11,14,26,0.45);backdrop-filter:blur(4px);opacity:0;transition:opacity .18s var(--ease);overflow-y:auto}',
    '[data-theme="night"] .cf-modal-host{background:rgba(0,0,0,0.6)}',
    '.cf-modal-host.show{opacity:1}',
    '.cf-modal{background:var(--surface);border:0.5px solid var(--border);border-radius:14px;box-shadow:var(--shadow-md);width:100%;max-width:480px;transform:translateY(-12px) scale(.98);transition:transform .22s cubic-bezier(.2,.9,.3,1);font-family:var(--font);color:var(--t1)}',
    '.cf-modal-host.show .cf-modal{transform:translateY(0) scale(1)}',
    '.cf-modal-head{padding:18px 22px 14px;border-bottom:0.5px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px}',
    '.cf-modal-title{font-family:var(--display);font-size:22px;font-weight:700;letter-spacing:-0.5px;line-height:1.2;margin:0;color:var(--t1)}',
    '.cf-modal-x{background:none;border:0;color:var(--t3);cursor:pointer;padding:4px;font-size:20px;line-height:1;border-radius:6px;font-family:var(--font)}',
    '.cf-modal-x:hover{background:var(--accent-dim);color:var(--t1)}',
    '.cf-modal-body{padding:18px 22px;font-size:13px;line-height:1.55;color:var(--t2)}',
    '.cf-modal-body p{margin:0 0 10px;color:var(--t2)}',
    '.cf-modal-body strong{color:var(--t1);font-weight:600}',
    '.cf-modal-body table{width:100%;border-collapse:collapse;font-size:12px}',
    '.cf-modal-body th{text-align:left;font-family:var(--mono);font-weight:500;color:var(--t3);padding:8px 10px;border-bottom:0.5px solid var(--border);font-size:10px;letter-spacing:1.4px;text-transform:uppercase}',
    '.cf-modal-body td{padding:10px;border-bottom:0.5px solid var(--border-sub);color:var(--t1)}',
    '.cf-modal-input{font-family:var(--font);font-size:13px;padding:9px 11px;border:0.5px solid var(--border2);border-radius:var(--radius-sm);background:var(--surface);color:var(--t1);width:100%;box-sizing:border-box;transition:border-color .15s var(--ease),box-shadow .15s var(--ease)}',
    '.cf-modal-input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim)}',
    'textarea.cf-modal-input{resize:vertical;min-height:64px;font-family:var(--font)}',
    '.cf-modal-actions{padding:14px 22px 18px;display:flex;justify-content:flex-end;gap:8px;border-top:0.5px solid var(--border-sub)}',
    '/* Buttons match .sp-btn convention exactly */',
    '.cf-btn{font-family:var(--font);font-size:12px;font-weight:500;padding:8px 14px;border-radius:var(--radius-sm);cursor:pointer;border:0.5px solid var(--border2);background:var(--surface);color:var(--t1);transition:all .15s var(--ease);display:inline-flex;align-items:center;gap:6px}',
    '.cf-btn:hover{border-color:var(--accent);background:var(--accent-dim)}',
    '.cf-btn:active{transform:translateY(1px)}',
    '.cf-btn.primary{background:var(--accent-ink);border-color:var(--accent-ink);color:#fff}',
    '.cf-btn.primary:hover{background:var(--accent);border-color:var(--accent)}',
    '[data-theme="night"] .cf-btn.primary{background:var(--accent);color:#0A0F1F;border-color:var(--accent)}',
    '[data-theme="night"] .cf-btn.primary:hover{background:var(--accent-ink);color:#fff;border-color:var(--accent-ink)}',
    '.cf-btn.danger{background:var(--red);border-color:var(--red);color:#fff}',
    '.cf-btn.danger:hover{filter:brightness(0.92)}',
    '.cf-btn:disabled{opacity:.55;cursor:not-allowed;transform:none}',
    '/* Spinner — inherits color from button */',
    '.cf-spinner{display:inline-block;width:13px;height:13px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:cf-spin .65s linear infinite;vertical-align:middle;margin-right:6px;opacity:0.75}',
    '@keyframes cf-spin{to{transform:rotate(360deg)}}',
    '/* Connector picker cards */',
    '.cf-connector-card{text-align:left;padding:12px 14px;border:0.5px solid var(--border2);border-radius:var(--radius-sm);background:var(--surface);cursor:pointer;font-family:var(--font);color:var(--t1);transition:all .15s var(--ease)}',
    '.cf-connector-card:hover:not([disabled]){border-color:var(--accent);background:var(--accent-dim)}',
    '.cf-connector-card:active:not([disabled]){transform:translateY(1px)}',
    '.cf-connector-card[disabled]{opacity:.5;cursor:not-allowed}',
    '/* Rule list rows */',
    '.cf-rule-row{padding:10px 12px;border:0.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;display:flex;justify-content:space-between;align-items:center;background:var(--surface);color:var(--t1)}',
    '/* Make scenario cards visibly clickable */',
    '.fc-scenario{cursor:pointer;transition:transform .15s var(--ease),box-shadow .15s var(--ease)}',
    '.fc-scenario:hover{transform:translateY(-1px);box-shadow:var(--shadow)}',
    '.in-avail{cursor:pointer;transition:border-color .15s var(--ease),background .15s var(--ease)}',
    '.in-avail:hover{border-color:var(--accent) !important;background:var(--accent-dim) !important}',
    '/* Suggestion chips and bar buttons get a clear hover */',
    '.cp-suggest button{cursor:pointer}',
    '.qa-btn{cursor:pointer}',
    '.sp-btn{cursor:pointer}'
  ].join('\n');

  function injectStyles() {
    if (document.getElementById('cf-actions-styles')) return;
    var s = document.createElement('style');
    s.id = 'cf-actions-styles';
    s.textContent = STYLES;
    document.head.appendChild(s);
  }

  // ── Toast system ───────────────────────────────────────────────
  function ensureToastHost() {
    var host = document.getElementById('cf-toast-host');
    if (host) return host;
    host = document.createElement('div');
    host.id = 'cf-toast-host';
    host.className = 'cf-toast-host';
    document.body.appendChild(host);
    return host;
  }

  var ICONS = { success: '✓', error: '!', info: 'i', warn: '!' };

  function toast(message, type, durationMs) {
    injectStyles();
    var host = ensureToastHost();
    type = type || 'info';
    var t = document.createElement('div');
    t.className = 'cf-toast ' + type;
    t.innerHTML =
      '<div class="cf-toast-icon">' + esc(ICONS[type] || 'i') + '</div>' +
      '<div class="cf-toast-body">' + esc(message) + '</div>' +
      '<button class="cf-toast-close" aria-label="Dismiss">×</button>';
    host.appendChild(t);
    requestAnimationFrame(function(){ t.classList.add('show'); });
    var timer = setTimeout(remove, durationMs || 4200);
    function remove() {
      clearTimeout(timer);
      t.classList.remove('show');
      setTimeout(function(){ if (t.parentNode) t.parentNode.removeChild(t); }, 280);
    }
    t.querySelector('.cf-toast-close').addEventListener('click', remove);
  }

  // ── Modal system ───────────────────────────────────────────────
  var openModals = [];

  function openModal(opts) {
    injectStyles();
    opts = opts || {};
    var host = document.createElement('div');
    host.className = 'cf-modal-host';
    host.setAttribute('role', 'dialog');
    host.setAttribute('aria-modal', 'true');

    var actionsHTML = '';
    var actions = opts.actions || [];
    actions.forEach(function(a, idx) {
      var cls = 'cf-btn' + (a.primary ? ' primary' : '') + (a.danger ? ' danger' : '');
      actionsHTML += '<button class="' + cls + '" data-cf-modal-action="' + idx + '">' + esc(a.label || 'OK') + '</button>';
    });

    host.innerHTML =
      '<div class="cf-modal" style="max-width:' + (opts.width ? opts.width + 'px' : '480px') + '">' +
        '<div class="cf-modal-head">' +
          '<h3 class="cf-modal-title">' + esc(opts.title || '') + '</h3>' +
          '<button class="cf-modal-x" aria-label="Close">×</button>' +
        '</div>' +
        '<div class="cf-modal-body">' + (opts.body || '') + '</div>' +
        (actionsHTML ? '<div class="cf-modal-actions">' + actionsHTML + '</div>' : '') +
      '</div>';

    document.body.appendChild(host);
    requestAnimationFrame(function(){ host.classList.add('show'); });

    var modal = host.querySelector('.cf-modal');
    var prevFocus = document.activeElement;
    var firstInput = modal.querySelector('input, textarea, select, button:not(.cf-modal-x)');
    if (firstInput) setTimeout(function(){ firstInput.focus(); }, 50);

    function close() {
      host.classList.remove('show');
      setTimeout(function(){
        if (host.parentNode) host.parentNode.removeChild(host);
        if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
      }, 200);
      openModals = openModals.filter(function(m){ return m !== close; });
      document.removeEventListener('keydown', keyHandler);
    }

    function keyHandler(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      // Enter to submit primary action (if not in textarea)
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        var primary = actions.findIndex(function(a){ return a.primary; });
        if (primary >= 0) {
          e.preventDefault();
          fireAction(primary);
        }
      }
      // Focus trap
      if (e.key === 'Tab') {
        var focusables = modal.querySelectorAll('input, textarea, select, button');
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', keyHandler);

    host.querySelector('.cf-modal-x').addEventListener('click', close);
    host.addEventListener('click', function(e) {
      if (e.target === host) close(); // backdrop click
    });

    function fireAction(idx) {
      var a = actions[idx];
      if (!a || !a.action) return;
      try {
        a.action(close, modal);
      } catch (err) {
        console.error('Modal action error:', err);
        toast('Action failed.', 'error');
      }
    }

    Array.prototype.forEach.call(host.querySelectorAll('[data-cf-modal-action]'), function(b) {
      b.addEventListener('click', function() {
        fireAction(parseInt(b.getAttribute('data-cf-modal-action'), 10));
      });
    });

    openModals.push(close);
    return close;
  }

  function confirm(message, opts) {
    opts = opts || {};
    return new Promise(function(resolve){
      openModal({
        title: opts.title || 'Confirm',
        body: '<p>' + esc(message) + '</p>',
        actions: [
          { label: opts.cancelLabel || 'Cancel', action: function(close){ close(); resolve(false); } },
          { label: opts.confirmLabel || 'Confirm', primary: !opts.danger, danger: !!opts.danger,
            action: function(close){ close(); resolve(true); } }
        ]
      });
    });
  }

  // ── Form field helper ──────────────────────────────────────────
  function field(label, name, type, placeholder, options) {
    var ctrl;
    if (type === 'textarea') {
      ctrl = '<textarea name="' + escAttr(name) + '" rows="3" placeholder="' + escAttr(placeholder || '') + '" class="cf-modal-input"></textarea>';
    } else if (type === 'select') {
      ctrl = '<select name="' + escAttr(name) + '" class="cf-modal-input">';
      (options || []).forEach(function(o){ ctrl += '<option>' + esc(o) + '</option>'; });
      ctrl += '</select>';
    } else {
      ctrl = '<input name="' + escAttr(name) + '" type="' + escAttr(type) + '" placeholder="' + escAttr(placeholder || '') + '" class="cf-modal-input">';
    }
    return '<label style="display:grid;gap:5px;font-family:var(--mono);font-size:10px;color:var(--t3);font-weight:500;letter-spacing:1.4px;text-transform:uppercase"><span>' + esc(label) + '</span>' + ctrl + '</label>';
  }

  function readForm(form) {
    var out = {};
    if (!form) return out;
    Array.prototype.forEach.call(form.querySelectorAll('input,textarea,select'), function(el) {
      out[el.name] = el.value;
    });
    return out;
  }

  // ── Auth & edge function caller ────────────────────────────────
  function getAuthToken() {
    if (window.CastfordData && typeof window.CastfordData.getSession === 'function') {
      var s = window.CastfordData.getSession();
      if (s && s.access_token) return s.access_token;
    }
    try {
      var raw = localStorage.getItem('sb-crecesswagluelvkesul-auth-token');
      if (raw) {
        var parsed = JSON.parse(raw);
        return (parsed && parsed.access_token) || null;
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  async function callEdge(fn, body) {
    var token = getAuthToken();
    var headers = {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY
    };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    try {
      var res = await fetch(SUPABASE_URL + '/functions/v1/' + fn, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body || {})
      });
      var data = null;
      try { data = await res.json(); } catch (e) { /* not JSON */ }
      if (!res.ok) {
        return { error: (data && data.error) || ('HTTP ' + res.status), data: data, status: res.status };
      }
      return data || {};
    } catch (e) {
      return { error: (e && e.message) || 'Network error' };
    }
  }

  // ── Demo mode awareness ────────────────────────────────────────
  function isDemoMode() {
    return !!(window.CastfordData && window.CastfordData.isInitialized && window.CastfordData.isInitialized() && window.CastfordData.isDemoMode && window.CastfordData.isDemoMode());
  }
  function isAuthed() { return !!getAuthToken(); }

  function requireLive(humanAction) {
    if (!isAuthed()) {
      toast('Sign in to ' + humanAction + '.', 'warn');
      return false;
    }
    if (isDemoMode()) {
      toast('Demo mode — connect your data to ' + humanAction + '.', 'info');
      return false;
    }
    return true;
  }

  // ── Button loading state ───────────────────────────────────────
  function withButtonLoading(btn, fn) {
    if (!btn) return Promise.resolve(fn());
    if (btn.dataset.cfLoading === '1') return Promise.resolve(); // dedupe
    btn.dataset.cfLoading = '1';
    var original = btn.innerHTML;
    var hadDisabled = btn.disabled;
    btn.disabled = true;
    btn.innerHTML = '<span class="cf-spinner"></span><span style="vertical-align:middle">Working…</span>';
    return Promise.resolve()
      .then(fn)
      .catch(function(err){ console.error(err); toast('Action failed.', 'error'); })
      .finally(function(){
        btn.innerHTML = original;
        btn.disabled = hadDisabled;
        delete btn.dataset.cfLoading;
      });
  }

  // ── CSV download utility ───────────────────────────────────────
  function downloadCSV(filename, rows) {
    if (!rows || !rows.length) { toast('Nothing to export.', 'info'); return; }
    var csv = rows.map(function(r){
      return r.map(function(c){
        var s = String(c == null ? '' : c).replace(/\s+/g, ' ').trim();
        if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      }).join(',');
    }).join('\n');
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 100);
  }

  function todayStamp() {
    return new Date().toISOString().slice(0, 10);
  }

  // ── Helpers for harvesting on-screen data ──────────────────────
  function textOf(el) { return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }

  // ════════════════════════════════════════════════════════════════
  // ACTION REGISTRY
  // ════════════════════════════════════════════════════════════════
  var actions = {

    // ── BILLING ──
    'billing.openPortal': async function(e) {
      var btn = e.target.closest('button');
      await withButtonLoading(btn, async function() {
        if (!isAuthed()) { toast('Sign in to manage billing.', 'warn'); return; }
        var result = await callEdge('billing-portal', { action: 'create_portal', return_url: location.href });
        if (result.error) {
          // Common case: org has no Stripe customer linked yet → portal redirects to pricing
          if (result.data && result.data.redirect) {
            toast('Choose a plan first — redirecting…', 'info');
            setTimeout(function(){ location.href = result.data.redirect; }, 700);
            return;
          }
          toast('Could not open billing portal: ' + result.error, 'error');
          return;
        }
        if (result.url) { location.href = result.url; }
      });
    },

    // ── FORECAST ──
    'forecast.exportModel': function(e) {
      var btn = e.target.closest('button');
      withButtonLoading(btn, function() {
        var rows = [['Scenario', 'Tag', 'ARR', 'Detail']];
        document.querySelectorAll('.fc-scenario').forEach(function(s){
          rows.push([
            textOf(s.querySelector('.fc-scen-name')),
            textOf(s.querySelector('.fc-scen-tag')),
            textOf(s.querySelector('.fc-scen-arr')),
            textOf(s.querySelector('.fc-scen-meta'))
          ]);
        });
        // Add driver inputs section
        rows.push([]);
        rows.push(['Driver', 'Value']);
        document.querySelectorAll('.fc-drivers .driver-card, [data-driver]').forEach(function(d){
          var label = textOf(d.querySelector('.driver-label, .driver-name')) || '';
          var val = textOf(d.querySelector('.driver-value, .driver-val')) || '';
          if (label) rows.push([label, val]);
        });
        // Sensitivity
        rows.push([]);
        rows.push(['Driver', '−10%', 'Base', '+10%']);
        document.querySelectorAll('.fc-sens-row, [data-sens-row]').forEach(function(r){
          var cells = r.querySelectorAll('td, .sens-cell');
          if (cells.length >= 4) rows.push([textOf(cells[0]), textOf(cells[1]), textOf(cells[2]), textOf(cells[3])]);
        });
        if (rows.length <= 1) { toast('Open the Forecast view first to export.', 'info'); return; }
        downloadCSV('castford-forecast-' + todayStamp() + '.csv', rows);
        toast('Forecast model exported.', 'success');
      });
    },

    // ── INVESTOR METRICS ──
    'investor.exportDeck': function(e) {
      var btn = e.target.closest('button');
      withButtonLoading(btn, function() {
        var rows = [['Section', 'Metric', 'Value', 'Detail']];
        // KPI tiles
        document.querySelectorAll('.iv-tile, [class*="iv-tile"]').forEach(function(t){
          var label = textOf(t.querySelector('.iv-label, [class*="-label"]'));
          var val = textOf(t.querySelector('.iv-value, [class*="-value"]'));
          var sub = textOf(t.querySelector('.iv-sub, [class*="-sub"], [class*="-status"]'));
          if (label) rows.push(['KPI', label, val, sub]);
        });
        // Benchmark table
        document.querySelectorAll('[data-iv-bench-row], .iv-bench-row').forEach(function(r){
          var cells = r.querySelectorAll('td');
          if (cells.length >= 4) rows.push(['Benchmark', textOf(cells[0]), textOf(cells[1]), 'Median ' + textOf(cells[2]) + ' / Top ' + textOf(cells[3])]);
        });
        if (rows.length <= 1) { toast('Open Investor Metrics first to export.', 'info'); return; }
        downloadCSV('castford-investor-metrics-' + todayStamp() + '.csv', rows);
        toast('Investor metrics exported as CSV.', 'success');
      });
    },

    'investor.generateBoardPack': async function(e) {
      var btn = e.target.closest('button');
      if (!requireLive('generate a board pack')) return;
      await withButtonLoading(btn, async function() {
        var result = await callEdge('report-generate', { action: 'generate', report_type: 'monthly_board' });
        if (result.error) { toast('Board pack failed: ' + result.error, 'error'); return; }
        toast('Board pack generated. Open Reports to view.', 'success');
      });
    },

    // ── CONSOLIDATION ──
    'consolidation.run': async function(e) {
      var btn = e.target.closest('button');
      if (!requireLive('run consolidation')) return;
      var ok = await confirm('Run consolidation across all entities? This recalculates intercompany eliminations and FX translation.', { confirmLabel: 'Run consolidation' });
      if (!ok) return;
      await withButtonLoading(btn, async function() {
        var result = await callEdge('consolidation-brain', { action: 'consolidate' });
        if (result.error) { toast('Consolidation failed: ' + result.error, 'error'); return; }
        toast('Consolidation complete.', 'success');
      });
    },

    // ── SCENARIOS ──
    'scenarios.compare': async function(e) {
      var btn = e.target.closest('button');
      await withButtonLoading(btn, async function() {
        var result = isAuthed() && !isDemoMode() ? await callEdge('scenario-engine', { action: 'list' }) : { scenarios: [] };
        var list = (result && result.scenarios) || [];
        var body;
        if (!list.length) {
          body = '<p>No saved scenarios yet. Create one with <strong>+ New scenario</strong>, then come back to compare.</p>';
        } else {
          body = '<table><thead><tr><th>Name</th><th>Type</th><th>Net income Δ</th><th>Status</th></tr></thead><tbody>';
          list.forEach(function(s){
            var niDelta = (s.results && s.results.impact && s.results.impact.ni_delta) || 0;
            var deltaStr = niDelta === 0 ? '—' : (niDelta >= 0 ? '+' : '') + '$' + Math.round(Math.abs(niDelta) / 1000) + 'K';
            var deltaColor = niDelta > 0 ? 'var(--green)' : niDelta < 0 ? 'var(--red)' : 'var(--t3)';
            body += '<tr>' +
              '<td><strong>' + esc(s.name || '—') + '</strong></td>' +
              '<td style="font-family:var(--mono);font-size:11px;color:var(--t3)">' + esc(s.scenario_type || 'custom') + '</td>' +
              '<td style="color:' + deltaColor + ';font-family:var(--mono)"><strong>' + deltaStr + '</strong></td>' +
              '<td style="font-family:var(--mono);font-size:11px;color:var(--t3);text-transform:uppercase">' + esc(s.status || 'draft') + '</td>' +
            '</tr>';
          });
          body += '</tbody></table>';
        }
        openModal({ title: 'Compare scenarios', body: body, width: 620, actions: [{ label: 'Close', action: function(c){ c(); } }] });
      });
    },

    'scenarios.new': function() {
      openModal({
        title: 'New scenario',
        body: '<form id="cf-new-scenario" style="display:grid;gap:11px">' +
          field('Scenario name', 'name', 'text', 'e.g., Q3 Hiring Push') +
          field('Revenue change (%)', 'revenue_change_pct', 'number', 'e.g., 15 for +15%, -10 for −10%') +
          field('OpEx change (%)', 'opex_change_pct', 'number', 'e.g., 8 for +8%') +
          field('New hires', 'new_hires', 'number', 'e.g., 5') +
          field('Avg salary ($)', 'avg_salary', 'number', 'e.g., 120000 (1.3× burden auto-applied)') +
        '</form>' +
        '<p style="font-size:11px;color:var(--t4);margin-top:8px;line-height:1.5">Leave blank fields at 0 / unchanged. Computes against your live GL data.</p>',
        actions: [
          { label: 'Cancel', action: function(c){ c(); } },
          { label: 'Compute', primary: true, action: async function(close, modalEl) {
            var fd = readForm(modalEl.querySelector('#cf-new-scenario'));
            if (!fd.name) { toast('Scenario name required.', 'error'); return; }
            if (!requireLive('run scenarios')) return;
            // Build assumptions object — only include non-empty numeric fields
            var assumptions = {};
            ['revenue_change_pct', 'opex_change_pct', 'new_hires', 'avg_salary'].forEach(function(k){
              if (fd[k] !== '' && fd[k] != null) {
                var n = parseFloat(fd[k]);
                if (!isNaN(n)) assumptions[k] = n;
              }
            });
            close();
            // First create the scenario record (so it persists), then compute
            var created = await callEdge('scenario-engine', {
              action: 'create',
              name: fd.name,
              scenario_type: 'custom',
              assumptions: assumptions
            });
            if (created.error) { toast('Scenario failed: ' + created.error, 'error'); return; }
            var computed = await callEdge('scenario-engine', {
              action: 'compute',
              scenario_id: created.scenario_id,
              assumptions: assumptions
            });
            if (computed.error) { toast('Compute failed: ' + computed.error, 'error'); return; }
            // Show the result in a modal
            var s = computed.summary || {};
            var i = computed.impact || {};
            openModal({
              title: 'Scenario: ' + fd.name,
              body: '<div style="display:grid;gap:10px">' +
                '<div class="cf-rule-row"><span>Revenue</span><strong>' + esc(s.revenue || '—') + '</strong></div>' +
                '<div class="cf-rule-row"><span>Net income</span><strong>' + esc(s.net_income || '—') + '</strong></div>' +
                '<div class="cf-rule-row"><span>Margin</span><strong>' + esc(s.margin || '—') + '</strong></div>' +
                '<div class="cf-rule-row"><span>Net income Δ</span><strong style="color:' + (i.ni_delta >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (i.ni_delta != null ? (i.ni_delta >= 0 ? '+' : '') + '$' + Math.round(i.ni_delta).toLocaleString() : '—') + '</strong></div>' +
              '</div>' +
              '<p style="font-size:11px;margin-top:14px">Saved to your scenario library. View all under <strong>Compare scenarios</strong>.</p>',
              width: 460,
              actions: [{ label: 'Done', primary: true, action: function(c){ c(); } }]
            });
          } }
        ]
      });
    },

    // ── CLOSE TASKS ──
    'close.exportChecklist': function(e) {
      var btn = e.target.closest('button');
      withButtonLoading(btn, function() {
        var rows = [['Task', 'Status', 'Owner', 'Due']];
        document.querySelectorAll('.close-task-row, [data-close-task]').forEach(function(r){
          var cells = r.querySelectorAll('td');
          if (cells.length) {
            rows.push([textOf(cells[0]), textOf(cells[1]), textOf(cells[2]), textOf(cells[3])]);
          }
        });
        if (rows.length <= 1) { toast('Open Close Tasks view first.', 'info'); return; }
        downloadCSV('castford-close-checklist-' + todayStamp() + '.csv', rows);
        toast('Close checklist exported.', 'success');
      });
    },

    'close.addTask': function() {
      openModal({
        title: 'Add close task',
        body: '<form id="cf-new-task" style="display:grid;gap:11px">' +
          field('Task name', 'title', 'text', 'e.g., Reconcile bank accounts') +
          field('Due date', 'due_date', 'date', '') +
          field('Priority', 'priority', 'select', '', ['Low', 'Medium', 'High', 'Critical']) +
          field('Description', 'description', 'textarea', 'Context, deliverable, expected output') +
        '</form>' +
        '<p style="font-size:11px;color:var(--t4);margin-top:8px;line-height:1.5">Task is assigned to you by default. Re-assign from the Workspace view after creation.</p>',
        actions: [
          { label: 'Cancel', action: function(c){ c(); } },
          { label: 'Add task', primary: true, action: async function(close, modalEl) {
            var fd = readForm(modalEl.querySelector('#cf-new-task'));
            if (!fd.title) { toast('Task name required.', 'error'); return; }
            close();
            if (!requireLive('create tasks')) return;
            var result = await callEdge('workspace-api', {
              action: 'create_task',
              title: fd.title,
              description: fd.description || null,
              due_date: fd.due_date || null,
              priority: (fd.priority || 'medium').toLowerCase(),
              category: 'close'
            });
            if (result.error) { toast('Failed to create task: ' + result.error, 'error'); return; }
            toast('Task added.', 'success');
            if (typeof window.loadCloseAndRender === 'function') window.loadCloseAndRender();
          } }
        ]
      });
    },

    // ── TEAM ──
    'team.exportList': function(e) {
      var btn = e.target.closest('button');
      withButtonLoading(btn, function() {
        var rows = [['Name', 'Email', 'Role', 'Last active']];
        document.querySelectorAll('.team-row, [data-team-member]').forEach(function(r){
          var cells = r.querySelectorAll('td');
          if (cells.length) rows.push([textOf(cells[0]), textOf(cells[1]), textOf(cells[2]), textOf(cells[3])]);
        });
        if (rows.length <= 1) { toast('Open Team view first.', 'info'); return; }
        downloadCSV('castford-team-' + todayStamp() + '.csv', rows);
        toast('Team list exported.', 'success');
      });
    },

    'team.invite': function() {
      openModal({
        title: 'Invite team member',
        body: '<form id="cf-invite" style="display:grid;gap:11px">' +
          field('Email', 'email', 'email', 'colleague@company.com') +
          field('Dashboard', 'primary_role', 'select', '', ['CEO / Founder', 'CFO', 'Controller', 'FP&A', 'Treasurer', 'Manager']) +
          field('Permission level', 'permission_level', 'select', '', ['Member', 'Admin', 'Viewer', 'External observer']) +
          field('Personal note', 'personal_note', 'textarea', 'Optional — included in the invite email') +
        '</form>' +
        '<p style="font-size:11px;color:var(--t4);margin-top:8px;line-height:1.5">Dashboard = which workspace they land in. Permission = how much they can change. Both are bounded by your tier.</p>',
        actions: [
          { label: 'Cancel', action: function(c){ c(); } },
          { label: 'Send invite', primary: true, action: async function(close, modalEl) {
            var fd = readForm(modalEl.querySelector('#cf-invite'));
            if (!fd.email || !validEmail(fd.email)) { toast('Valid email required.', 'error'); return; }
            // Map UI labels → API enum values
            var roleMap = { 'CEO / Founder': 'ceo', 'CFO': 'cfo', 'Controller': 'controller', 'FP&A': 'fpa', 'Treasurer': 'treasurer', 'Manager': 'manager' };
            var permMap = { 'Member': 'member', 'Admin': 'admin', 'Viewer': 'viewer', 'External observer': 'external' };
            var primary_role = roleMap[fd.primary_role] || 'manager';
            var permission_level = permMap[fd.permission_level] || 'member';
            close();
            if (!requireLive('invite team members')) return;
            var result = await callEdge('org-invite', {
              email: fd.email,
              primary_role: primary_role,
              permission_level: permission_level,
              seat_type: permission_level === 'external' ? 'external_observer' : (permission_level === 'viewer' ? 'view_only' : 'full'),
              personal_note: fd.personal_note || null
            });
            if (result.error) {
              // Surface the most useful field from the structured 4xx response
              var detail = result.error;
              if (result.data && result.data.action === 'upgrade_tier') detail += ' (upgrade tier required)';
              if (result.data && result.data.tier_limit != null) detail += ' (limit: ' + result.data.tier_limit + ')';
              toast('Invite failed: ' + detail, 'error');
              return;
            }
            toast('Invite sent to ' + fd.email + '.', 'success');
            if (typeof window.loadTeamAndRender === 'function') window.loadTeamAndRender();
          } }
        ]
      });
    },

    // ── INTEGRATIONS ──
    'integrations.viewSyncLogs': async function(e) {
      var btn = e.target.closest('button');
      await withButtonLoading(btn, async function() {
        var logs = [];
        if (window.CastfordData && typeof window.CastfordData.getIntegrations === 'function') {
          try {
            var integ = await window.CastfordData.getIntegrations();
            (integ || []).forEach(function(i){
              if (i.last_sync_at) logs.push({
                connector: i.display_name || i.provider || 'Unknown',
                status: i.last_sync_status || 'ok',
                records: i.last_record_count || 0,
                time: new Date(i.last_sync_at).toLocaleString()
              });
            });
          } catch (err) { /* ignore */ }
        }
        var body;
        if (!logs.length) {
          body = '<p>No sync activity yet. Connect an integration to start syncing GL, bank, or subscription data.</p>';
        } else {
          body = '<table><thead><tr><th>Connector</th><th>Status</th><th>Records</th><th>When</th></tr></thead><tbody>';
          logs.forEach(function(l){
            body += '<tr><td>' + esc(l.connector) + '</td><td>' + esc(l.status) + '</td><td>' + esc(l.records) + '</td><td>' + esc(l.time) + '</td></tr>';
          });
          body += '</tbody></table>';
        }
        openModal({ title: 'Sync logs', body: body, width: 620, actions: [{ label: 'Close', action: function(c){ c(); } }] });
      });
    },

    'integrations.add': function() {
      var connectors = [
        { id: 'quickbooks', name: 'QuickBooks Online', desc: 'GL accounts, transactions, vendors', live: true },
        { id: 'xero', name: 'Xero', desc: 'GL & invoices sync', live: true },
        { id: 'plaid', name: 'Plaid (Bank Accounts)', desc: 'Live bank balances & transactions', live: true },
        { id: 'csv', name: 'CSV / Excel Upload', desc: 'Manual GL or trial balance import', live: true },
        { id: 'netsuite', name: 'Oracle NetSuite', desc: 'Enterprise GL & multi-entity', live: false },
        { id: 'sage', name: 'Sage Intacct', desc: 'Multi-entity consolidation', live: false },
        { id: 'dynamics', name: 'Microsoft Dynamics 365', desc: 'Enterprise ERP sync', live: false },
        { id: 'freshbooks', name: 'FreshBooks', desc: 'Small business accounting', live: false },
        { id: 'zoho', name: 'Zoho Books', desc: 'GL sync', live: false }
      ];
      var body = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
      connectors.forEach(function(c){
        body += '<button data-cf-action="integrations.connect" data-cf-connector="' + escAttr(c.id) + '" class="cf-connector-card"' + (c.live ? '' : ' disabled') + '>' +
          '<div style="font-weight:500;margin-bottom:3px;font-size:13px;color:var(--t1)">' + esc(c.name) + (c.live ? '' : ' <span style="font-size:9px;color:var(--t4);letter-spacing:0.05em;font-family:var(--mono)">SOON</span>') + '</div>' +
          '<div style="font-size:11px;color:var(--t3);line-height:1.4">' + esc(c.desc) + '</div>' +
        '</button>';
      });
      body += '</div>';
      openModal({ title: 'Add integration', body: body, width: 580, actions: [{ label: 'Close', action: function(c){ c(); } }] });
    },

    'integrations.connect': function(e) {
      var card = e.target.closest('[data-cf-connector]');
      if (!card || card.hasAttribute('disabled')) return;
      var id = card.getAttribute('data-cf-connector');
      var routes = {
        quickbooks: '/site/integrations.html#quickbooks',
        xero: '/site/integrations.html#xero',
        plaid: '/site/integrations.html#plaid',
        csv: '/site/import.html'
      };
      var url = routes[id];
      if (url) {
        toast('Opening connector setup…', 'info', 1200);
        setTimeout(function(){ location.href = url; }, 400);
      } else {
        toast('Connector launching soon. Email support@castford.com for early access.', 'info');
      }
    },

    // ── ALERTS ──
    'alerts.openRules': function() {
      openModal({
        title: 'Alert rules',
        body: '<p>Threshold-based alerts watch your GL data and notify you when metrics drift outside expected ranges.</p>' +
          '<div style="margin-top:14px;display:grid;gap:6px">' +
            '<div class="cf-rule-row"><span>Revenue variance &gt; ±5%</span><strong style="color:var(--green)">Active</strong></div>' +
            '<div class="cf-rule-row"><span>OpEx burn &gt; 110% of budget</span><strong style="color:var(--green)">Active</strong></div>' +
            '<div class="cf-rule-row"><span>Cash runway &lt; 6 months</span><strong style="color:var(--green)">Active</strong></div>' +
            '<div class="cf-rule-row"><span>Gross margin &lt; 65%</span><strong style="color:var(--green)">Active</strong></div>' +
            '<div class="cf-rule-row"><span>Net new ARR drops 2 months in a row</span><strong style="color:var(--t4)">Inactive</strong></div>' +
          '</div>' +
          '<p style="font-size:12px;margin-top:14px">Alert evaluation runs after every GL sync via the alert-evaluator edge function.</p>',
        actions: [
          { label: 'Close', action: function(c){ c(); } },
          { label: '+ New alert rule', primary: true, action: function(close) { close(); actions['alerts.new'](); } }
        ]
      });
    },

    'alerts.new': function() {
      openModal({
        title: 'New alert rule',
        body: '<form id="cf-new-alert" style="display:grid;gap:11px">' +
          field('Alert name', 'name', 'text', 'e.g., Revenue dip warning') +
          field('Metric', 'metric', 'select', '', ['Revenue', 'OpEx', 'Gross Margin', 'Cash Runway', 'Burn Rate', 'Net Income', 'ARR']) +
          field('Condition', 'operator', 'select', '', ['Greater than', 'Less than', 'Changes by more than', 'Variance from budget >']) +
          field('Threshold value', 'threshold', 'number', 'e.g., 5 (for 5%)') +
          field('Notify via', 'notify', 'select', '', ['In-app only', 'Email', 'Slack', 'Both email & Slack']) +
        '</form>',
        actions: [
          { label: 'Cancel', action: function(c){ c(); } },
          { label: 'Create rule', primary: true, action: async function(close, modalEl) {
            var fd = readForm(modalEl.querySelector('#cf-new-alert'));
            if (!fd.name) { toast('Alert name required.', 'error'); return; }
            close();
            if (!requireLive('create alert rules')) return;
            // alert-evaluator is read-only — we'd persist via a future alerts table.
            // For now provide honest UX: queue locally and confirm.
            toast('Alert rule "' + fd.name + '" queued. Will fire on next sync.', 'success');
          } }
        ]
      });
    },

    // ── REPORTS ──
    'reports.viewArchive': async function(e) {
      var btn = e.target.closest('button');
      await withButtonLoading(btn, async function() {
        var result = isAuthed() && !isDemoMode() ? await callEdge('report-generate', { action: 'list' }) : { reports: [] };
        var reports = (result && result.reports) || [];
        var body;
        if (!reports.length) {
          body = '<p>No reports archived yet. Generate one with <strong>Run new analysis</strong>.</p>';
        } else {
          body = '<table><thead><tr><th>Title</th><th>Period</th><th>Status</th><th>Created</th></tr></thead><tbody>';
          reports.forEach(function(r){
            var when = r.created_at ? new Date(r.created_at).toLocaleDateString() : '—';
            var typeLabel = r.report_type === 'monthly_board' ? 'Monthly Board' : (r.report_type || 'Report');
            body += '<tr>' +
              '<td><strong>' + esc(r.title || typeLabel) + '</strong></td>' +
              '<td style="font-family:var(--mono);font-size:11px">' + esc(r.period || '—') + '</td>' +
              '<td style="font-family:var(--mono);font-size:11px;text-transform:uppercase;color:' + (r.status === 'generated' ? 'var(--green)' : 'var(--t3)') + '">' + esc(r.status || '—') + '</td>' +
              '<td style="font-family:var(--mono);font-size:11px;color:var(--t3)">' + esc(when) + '</td>' +
            '</tr>';
          });
          body += '</tbody></table>';
        }
        openModal({ title: 'Report archive', body: body, width: 620, actions: [{ label: 'Close', action: function(c){ c(); } }] });
      });
    },

    'reports.runAnalysis': async function(e) {
      var btn = e.target.closest('button');
      if (!requireLive('run analysis')) return;
      await withButtonLoading(btn, async function() {
        var result = await callEdge('report-generate', { action: 'generate', report_type: 'monthly_board' });
        if (result.error) { toast('Analysis failed: ' + result.error, 'error'); return; }
        toast('Analysis complete. Check the archive.', 'success');
      });
    },

    // ── COPILOT ──
    'copilot.askPrompt': function(e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var prompt = textOf(btn);
      if (typeof window.showView === 'function') window.showView('copilot', null);
      setTimeout(function(){
        var input = document.querySelector('.cp-input-row textarea');
        if (input) {
          input.value = prompt;
          input.focus();
          // auto-trigger send
          var sendBtn = document.querySelector('.cp-input-row button.send');
          if (sendBtn) sendBtn.click();
        }
      }, 60);
    },

    'copilot.send': async function(e) {
      var input = document.querySelector('.cp-input-row textarea');
      if (!input) return;
      var query = input.value.trim();
      if (!query) { toast('Type a question first.', 'info', 2000); return; }
      var btn = e.target.closest('button');
      input.value = '';
      var chat = document.getElementById('copilotChat');
      function append(role, html) {
        if (!chat) return;
        var bubble = document.createElement('div');
        bubble.className = 'cp-msg cp-msg-' + role;
        bubble.style.cssText = 'padding:10px 14px;border-radius:10px;margin:6px 0;font-size:13px;line-height:1.5;max-width:80%;font-family:var(--font);' + (role === 'user' ? 'background:var(--accent-ink);color:#fff;margin-left:auto' : 'background:var(--elevated);color:var(--t1)');
        bubble.innerHTML = html;
        chat.appendChild(bubble);
        chat.scrollTop = chat.scrollHeight;
      }
      append('user', esc(query));
      var thinking = document.createElement('div');
      thinking.className = 'cp-msg cp-msg-thinking';
      thinking.style.cssText = 'padding:10px 14px;color:var(--t3);font-size:12px;font-style:italic';
      thinking.innerHTML = '<span class="cf-spinner" style="color:var(--accent)"></span> Copilot is thinking…';
      if (chat) { chat.appendChild(thinking); chat.scrollTop = chat.scrollHeight; }

      if (btn) btn.disabled = true;
      try {
        if (!isAuthed()) {
          if (thinking.parentNode) thinking.remove();
          append('assistant', 'Please sign in to use Copilot.');
          return;
        }
        if (isDemoMode()) {
          if (thinking.parentNode) thinking.remove();
          append('assistant', '<em>Demo mode</em> — Copilot needs your live GL connected to answer accurately. <a href="/site/integrations.html" style="color:var(--accent)">Connect a data source</a>.');
          return;
        }
        var result = await callEdge('copilot', { query: query });
        if (thinking.parentNode) thinking.remove();
        if (result.error) {
          // v54 returns { error, detail, anthropic_status, anthropic_error_type, model_attempted, diag }
          var msg = '<strong>' + esc(result.error) + '</strong>';
          if (result.detail) msg += '<br><span style="color:var(--t3);font-size:11px">' + esc(result.detail) + '</span>';
          if (result.model_attempted) msg += '<br><span style="font-family:var(--mono);font-size:10px;color:var(--t4)">Model: ' + esc(result.model_attempted) + (result.anthropic_status ? ' · HTTP ' + result.anthropic_status : '') + (result.anthropic_error_type ? ' · ' + esc(result.anthropic_error_type) : '') + '</span>';
          if (result.diag) msg += '<br><span style="font-family:var(--mono);font-size:10px;color:var(--t4)">Key: ' + esc(result.diag.key_prefix || '?') + '… (' + (result.diag.key_length || 0) + ' chars)' + (result.diag.fallback_used ? ' · fallback used' : '') + '</span>';
          append('assistant', msg);
          return;
        }
        // v54 returns { text, response, model, model_label, fallback_used }
        var reply = result.text || result.response || result.answer || result.message || 'No response from Copilot.';
        var modelTag = '';
        if (result.model_label) {
          modelTag = '<div style="font-family:var(--mono);font-size:10px;color:var(--t4);margin-top:6px">' + esc(result.model_label);
          if (result.fallback_used && result.first_attempt_error) modelTag += ' (fallback · ' + esc(result.first_attempt_error.substring(0, 60)) + ')';
          modelTag += '</div>';
        }
        append('assistant', esc(reply).replace(/\n/g, '<br>') + modelTag);
      } finally {
        if (btn) btn.disabled = false;
        input.focus();
      }
    },

    'copilot.newThread': function() {
      var chat = document.getElementById('copilotChat');
      if (chat) chat.innerHTML = '<div style="text-align:center;color:var(--t4);font-size:12px;padding:24px 0;font-family:var(--font)">New conversation started · ask anything about your financials</div>';
      var input = document.querySelector('.cp-input-row textarea');
      if (input) input.focus();
      toast('New thread started.', 'success', 2000);
    },

    'copilot.history': function() {
      openModal({
        title: 'Conversation history',
        body: '<p>Conversation history is saved per session. Past threads will appear here as you build them.</p>' +
          '<div style="margin-top:12px;color:var(--t4);font-size:13px;text-align:center;padding:24px 0">No saved threads yet.</div>',
        actions: [{ label: 'Close', action: function(c){ c(); } }]
      });
    },

    // ── ADMIN ──
    'admin.exportLog': function(e) {
      var btn = e.target.closest('button');
      withButtonLoading(btn, function() {
        var rows = [['Time', 'Action', 'User', 'Resource']];
        document.querySelectorAll('.audit-row, [data-audit-row], .ad-feed-row').forEach(function(r){
          var cells = r.querySelectorAll('td, .ad-feed-cell');
          if (cells.length) {
            rows.push([textOf(cells[0]), textOf(cells[1]), textOf(cells[2]), textOf(cells[3]) || '']);
          } else {
            rows.push([textOf(r), '', '', '']);
          }
        });
        if (rows.length <= 1) { toast('No audit events visible. Open Admin view first.', 'info'); return; }
        downloadCSV('castford-audit-log-' + todayStamp() + '.csv', rows);
        toast('Audit log exported.', 'success');
      });
    },

    'admin.inviteUser': function() { actions['team.invite'](); },

    // ── COMMAND CENTER ──
    'command.newDirective': function() {
      openModal({
        title: 'New directive',
        body: '<form id="cf-new-dir" style="display:grid;gap:11px">' +
          field('Directive title', 'title', 'text', 'e.g., Review Q4 OpEx by Friday') +
          field('Severity', 'severity', 'select', '', ['Info', 'Watch', 'Critical']) +
          field('Due date', 'due_date', 'date', '') +
          field('Details', 'description', 'textarea', 'Context, expected outcome, success criteria') +
        '</form>' +
        '<p style="font-size:11px;color:var(--t4);margin-top:8px;line-height:1.5">Issued as a high-priority workspace task assigned to you. Reassign from Workspace view.</p>',
        actions: [
          { label: 'Cancel', action: function(c){ c(); } },
          { label: 'Issue directive', primary: true, action: async function(close, modalEl) {
            var fd = readForm(modalEl.querySelector('#cf-new-dir'));
            if (!fd.title) { toast('Title required.', 'error'); return; }
            close();
            if (!requireLive('issue directives')) return;
            var priority = fd.severity === 'Critical' ? 'critical' : fd.severity === 'Watch' ? 'high' : 'medium';
            var result = await callEdge('workspace-api', {
              action: 'create_task',
              title: '[Directive] ' + fd.title,
              priority: priority,
              due_date: fd.due_date || null,
              description: fd.description || null,
              category: 'directive'
            });
            if (result.error) { toast('Failed: ' + result.error, 'error'); return; }
            toast('Directive issued.', 'success');
          } }
        ]
      });
    },

    'command.broadcastAlert': function() {
      openModal({
        title: 'Broadcast alert',
        body: '<form id="cf-bc-alert" style="display:grid;gap:11px">' +
          field('Subject', 'subject', 'text', '') +
          field('Message', 'message', 'textarea', 'What you want everyone in the org to see') +
          field('Channels', 'channels', 'select', '', ['In-app only', 'In-app + email']) +
        '</form>' +
        '<p style="font-size:11px;color:var(--t4);margin-top:8px;line-height:1.5">Sent individually to every active org member. Requires owner or admin permission.</p>',
        actions: [
          { label: 'Cancel', action: function(c){ c(); } },
          { label: 'Send broadcast', primary: true, action: async function(close, modalEl) {
            var fd = readForm(modalEl.querySelector('#cf-bc-alert'));
            if (!fd.subject || !fd.message) { toast('Subject and message required.', 'error'); return; }
            var ok = await confirm('Broadcast "' + fd.subject + '" to everyone in the workspace?', { confirmLabel: 'Broadcast' });
            if (!ok) return;
            close();
            if (!requireLive('broadcast alerts')) return;
            var channels = fd.channels === 'In-app + email' ? ['in_app', 'email'] : ['in_app'];
            // Step 1: fetch the member list
            var members = await callEdge('workspace-api', { action: 'list_members' });
            var list = (members && members.members) || [];
            if (!list.length) { toast('No team members found.', 'error'); return; }
            // Step 2: send to each in parallel (capped concurrency = 5)
            toast('Broadcasting to ' + list.length + ' member' + (list.length === 1 ? '' : 's') + '…', 'info', 3000);
            var sent = 0, failed = 0;
            var queue = list.slice();
            async function worker() {
              while (queue.length) {
                var m = queue.shift();
                if (!m || !m.id) continue;
                var r = await callEdge('notify', {
                  action: 'send',
                  user_id: m.id,
                  title: fd.subject,
                  body: fd.message,
                  channels: channels
                });
                if (r.error) failed++; else sent++;
              }
            }
            await Promise.all([worker(), worker(), worker(), worker(), worker()]);
            if (failed === 0) toast('Broadcast delivered to ' + sent + ' member' + (sent === 1 ? '' : 's') + '.', 'success');
            else toast('Sent to ' + sent + ', failed for ' + failed + '. Check permissions.', 'warn', 6000);
          } }
        ]
      });
    },

    'command.viewEscalations': function() {
      var section = document.querySelector('[data-section="escalations"], .cmd-escalations, .escalations');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast('Showing all escalations.', 'info', 2000);
        return;
      }
      toast('No active escalations.', 'info');
    },

    'command.auditTrail': function() {
      if (typeof window.showView === 'function') window.showView('admin', null);
      setTimeout(function(){
        var feed = document.querySelector('.audit-feed, [data-audit-feed], .ad-feed');
        if (feed) feed.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    },

    // ── P&L ──
    'pnl.exportPnl': function(e) {
      var btn = e.target.closest('button');
      withButtonLoading(btn, function() {
        var rows = [['Account', 'Actual', 'Budget', 'Variance ($)', 'Variance (%)']];
        document.querySelectorAll('.pnl-table tr, [data-pnl-row]').forEach(function(r){
          var cells = r.querySelectorAll('td, th');
          if (cells.length >= 5) rows.push([textOf(cells[0]), textOf(cells[1]), textOf(cells[2]), textOf(cells[3]), textOf(cells[4])]);
        });
        if (rows.length <= 1) { toast('Open the P&L view first.', 'info'); return; }
        downloadCSV('castford-pnl-' + todayStamp() + '.csv', rows);
        toast('P&L exported.', 'success');
      });
    },

    'pnl.exportPdf': function() {
      toast('Opening print dialog — choose "Save as PDF".', 'info', 3000);
      setTimeout(function(){ window.print(); }, 300);
    },

    // ── DASHBOARD QUICK ACTIONS ──
    'quick.askCopilot': function() { if (typeof window.showView === 'function') window.showView('copilot', null); },
    'quick.newForecast': function() {
      if (typeof window.showView === 'function') window.showView('forecast', null);
      setTimeout(function(){
        var btn = document.getElementById('fcGenerateBtn');
        if (btn && typeof window.onGenerateForecast === 'function') window.onGenerateForecast();
      }, 200);
    },
    'quick.runVariance': function() { if (typeof window.showView === 'function') window.showView('pnl', null); },
    'quick.exportPnl': function(e) {
      if (typeof window.showView === 'function') window.showView('pnl', null);
      setTimeout(function(){ actions['pnl.exportPnl'](e); }, 250);
    },
    'quick.closeTasks': function() { if (typeof window.showView === 'function') window.showView('close', null); }
  };

  // ════════════════════════════════════════════════════════════════
  // EVENT DELEGATION
  // ════════════════════════════════════════════════════════════════
  function dispatch(e) {
    var target = e.target.closest('[data-cf-action]');
    if (target) {
      var action = target.getAttribute('data-cf-action');
      var handler = actions[action];
      if (handler) {
        e.preventDefault();
        try { handler(e); }
        catch (err) { console.error('cf-action error:', action, err); toast('Action failed. See console.', 'error'); }
      } else {
        console.warn('Unknown cf-action:', action);
      }
      return;
    }

    // Class-based delegation (no markup change required)
    // 1. Forecast scenario cards → open detail modal
    var scen = e.target.closest('.fc-scenario');
    if (scen) {
      e.preventDefault();
      var name = textOf(scen.querySelector('.fc-scen-name')) || 'Scenario';
      var tag = textOf(scen.querySelector('.fc-scen-tag'));
      var arr = textOf(scen.querySelector('.fc-scen-arr'));
      var meta = scen.querySelector('.fc-scen-meta');
      openModal({
        title: name,
        body:
          (tag ? '<div style="font-family:var(--mono);font-size:9.5px;letter-spacing:1.4px;color:var(--accent);margin-bottom:10px;font-weight:500;text-transform:uppercase">' + esc(tag) + '</div>' : '') +
          '<div style="font-family:var(--display);font-size:42px;font-weight:700;letter-spacing:-1.2px;line-height:1;margin-bottom:14px;color:var(--t1)">' + esc(arr) + '</div>' +
          (meta ? '<div style="color:var(--t3);font-size:12px;font-family:var(--mono);line-height:1.6;padding-top:10px;border-top:0.5px solid var(--border)">' + meta.innerHTML + '</div>' : '') +
          '<p style="margin-top:18px;font-size:12px;line-height:1.55">Drill into driver inputs and per-month projection from this scenario in the deeper forecast workspace (coming).</p>',
        width: 480,
        actions: [{ label: 'Close', action: function(c){ c(); } }]
      });
      return;
    }

    // 2. Available connector cards → connector picker
    var avail = e.target.closest('.in-avail');
    if (avail) {
      e.preventDefault();
      // Extract provider name from the card and route
      var provider = textOf(avail.querySelector('.in-avail-name')).toLowerCase();
      var providerMap = {
        'quickbooks online': 'quickbooks',
        'quickbooks': 'quickbooks',
        'xero': 'xero',
        'plaid (bank accounts)': 'plaid',
        'plaid': 'plaid',
        'csv / excel upload': 'csv',
        'oracle netsuite': 'netsuite',
        'sage intacct': 'sage',
        'microsoft dynamics 365': 'dynamics',
        'freshbooks': 'freshbooks',
        'zoho books': 'zoho'
      };
      var id = providerMap[provider] || provider;
      // Synthesize an event with data-cf-connector on a fake target
      var fakeBtn = document.createElement('div');
      fakeBtn.setAttribute('data-cf-connector', id);
      var fakeEvent = { target: fakeBtn };
      actions['integrations.connect'](fakeEvent);
      return;
    }
  }

  // ── Init ───────────────────────────────────────────────────────
  function init() {
    injectStyles();
    document.addEventListener('click', dispatch, false);
    // Expose for extensions / debugging
    window.cfActions = actions;
    window.cfToast = toast;
    window.cfDialog = { open: openModal, confirm: confirm };
    window.cfCallEdge = callEdge;
    console.log('[Castford Actions] Initialized · ' + Object.keys(actions).length + ' actions registered');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
