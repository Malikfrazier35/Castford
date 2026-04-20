/* Castford App Shell v1 — Global top bar for /dashboard/* pages */
(function () {
  'use strict';
  if (window.__cfShellLoaded) return;
  window.__cfShellLoaded = true;

  function ensureCss(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href;
    document.head.appendChild(l);
  }
  ensureCss('/site/theme.css');
  ensureCss('/site/castford-ui.css');
  if (!document.querySelector('link[href*="Instrument+Sans"]')) {
    var f = document.createElement('link');
    f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }
  try { var t = localStorage.getItem('cf-theme'); document.documentElement.dataset.theme = t || 'day'; }
  catch (e) { document.documentElement.dataset.theme = 'day'; }

  var BRAND = '/site/brand/castford-icons.svg';
  function icon(n, c) { return '<svg class="' + (c || '') + '"><use href="' + BRAND + '#cf-icon-' + n + '"/></svg>'; }
  function shield(c) { return '<svg class="' + (c || '') + '"><use href="' + BRAND + '#cf-logo-shield"/></svg>'; }

  var NAV = [
    { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { label: 'Command Center', href: '/dashboard/command-center', icon: 'command-center' },
    { label: 'Workspace', href: '/dashboard/workspace', icon: 'workspace' },
    { label: 'Forecasts', href: '/dashboard/forecasts', icon: 'forecasts' },
    { label: 'Scenarios', href: '/dashboard/scenarios', icon: 'scenarios' },
    { label: 'Variance', href: '/dashboard/variance', icon: 'variance' },
    { label: 'Integrations', href: '/integrations', icon: 'integrations' },
    { label: 'Team', href: '/users', icon: 'team' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
    { label: 'Billing', href: '/billing', icon: 'billing' },
    { label: 'Audit Log', href: '/audit-log', icon: 'audit' }
  ];
  var SUGGESTIONS = [
    'Show revenue variance for this month',
    'Which customers have the highest churn risk?',
    'What drove Q1 margin improvement?',
    'Forecast cash runway at current burn'
  ];

  var STYLES = [
    'body.cf-shell-active{padding-top:52px !important}',
    '.cf-app-shell{position:fixed;top:0;left:0;right:0;height:52px;background:var(--nav-bg);backdrop-filter:blur(20px) saturate(1.3);-webkit-backdrop-filter:blur(20px) saturate(1.3);border-bottom:1px solid var(--nav-bdr);z-index:100;font-family:var(--b);color:var(--ink);transition:background var(--dur-slow),border var(--dur-slow)}',
    '.cf-shell-inner{height:100%;padding:0 var(--sp-4);display:grid;grid-template-columns:1fr minmax(240px,480px) 1fr;align-items:center;gap:var(--sp-4)}',
    '.cf-shell-left,.cf-shell-right{display:flex;align-items:center;gap:4px}',
    '.cf-shell-right{justify-content:flex-end}',
    '.cf-shell-center{display:flex;justify-content:center}',
    '.cf-shell-logo{display:flex;align-items:center;gap:8px;padding:6px 10px;text-decoration:none;color:var(--ink);font-family:var(--d);font-weight:600;font-size:var(--fs-15);letter-spacing:-0.3px}',
    '.cf-shell-logo-svg{width:22px;height:22px;color:var(--prime)}',
    '.cf-shell-workspace{display:flex;align-items:center;gap:6px;padding:6px 10px;background:transparent;border:1px solid transparent;cursor:pointer;font-family:var(--b);font-size:var(--fs-13);color:var(--t1);max-width:220px;transition:all var(--dur-fast)}',
    '.cf-shell-workspace:hover{background:var(--s2);border-color:var(--bdr)}',
    '.cf-shell-workspace-name{max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.cf-shell-chevron{width:10px;height:10px;opacity:0.5;transform:rotate(90deg)}',
    '.cf-shell-search{display:flex;align-items:center;gap:8px;width:100%;max-width:480px;padding:7px 12px;background:var(--s2);border:1px solid var(--bdr);cursor:text;font-family:var(--b);font-size:var(--fs-13);color:var(--t3);transition:all var(--dur-fast)}',
    '.cf-shell-search:hover{border-color:var(--bdr-strong);background:var(--s1)}',
    '.cf-shell-search-icon{width:14px;height:14px;opacity:0.6;flex-shrink:0}',
    '.cf-shell-search span:first-of-type{flex:1;text-align:left;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}',
    '.cf-shell-kbd{font-family:var(--m);font-size:var(--fs-10);padding:1px 6px;background:var(--bg);border:1px solid var(--bdr);border-radius:3px;color:var(--t2);letter-spacing:0.04em}',
    '.cf-shell-sync,.cf-shell-copilot,.cf-shell-notify,.cf-shell-help,.cf-shell-theme,.cf-shell-avatar-btn{display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:transparent;border:1px solid transparent;cursor:pointer;color:var(--t1);position:relative;transition:all var(--dur-fast);padding:0}',
    '.cf-shell-sync:hover,.cf-shell-copilot:hover,.cf-shell-notify:hover,.cf-shell-help:hover,.cf-shell-theme:hover,.cf-shell-avatar-btn:hover{background:var(--s2);border-color:var(--bdr)}',
    '.cf-shell-sync svg,.cf-shell-copilot svg,.cf-shell-notify svg,.cf-shell-help svg,.cf-shell-theme svg{width:16px;height:16px}',
    '.cf-shell-copilot svg{color:var(--ai)}',
    '.cf-shell-copilot::after{content:"";position:absolute;top:4px;right:4px;width:4px;height:4px;border-radius:50%;background:var(--ai);animation:cfAiPulse 2.4s ease-in-out infinite}',
    '.cf-shell-notify-dot{position:absolute;top:5px;right:5px;width:8px;height:8px;border-radius:50%;background:var(--accent);border:2px solid var(--nav-bg)}',
    '.cf-shell-help span{font-family:var(--d);font-size:var(--fs-14);font-weight:600}',
    '.cf-shell-theme-icon{width:14px;height:14px;border-radius:50%;background:var(--ink);transition:all var(--dur-slow)}',
    '[data-theme="night"] .cf-shell-theme-icon{background:transparent;box-shadow:inset -3px -3px 0 var(--prime-light)}',
    '.cf-shell-avatar-btn .cf-avatar{width:28px;height:28px;font-size:11px}',
    '.cf-shell-backdrop{position:fixed;inset:0;background:rgba(10,21,40,0.4);opacity:0;pointer-events:none;transition:opacity var(--dur-base);z-index:200}',
    '.cf-shell-backdrop.open{opacity:1;pointer-events:auto}',
    '.cf-shell-menu{position:fixed;background:var(--s1);border:1px solid var(--bdr);min-width:260px;z-index:250;opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity var(--dur-fast),transform var(--dur-fast)}',
    '.cf-shell-menu.open{opacity:1;transform:translateY(0);pointer-events:auto}',
    '.cf-shell-menu-group{padding:6px}',
    '.cf-shell-menu-label{font-family:var(--m);font-size:var(--fs-10);color:var(--t3);text-transform:uppercase;letter-spacing:0.08em;padding:10px 10px 6px}',
    '.cf-shell-menu-item{display:flex;align-items:center;gap:10px;padding:8px 10px;font-size:var(--fs-13);color:var(--t1);cursor:pointer;text-decoration:none;transition:all var(--dur-fast)}',
    '.cf-shell-menu-item:hover{background:var(--s2);color:var(--ink)}',
    '.cf-shell-menu-item svg{width:14px;height:14px;opacity:0.7;flex-shrink:0}',
    '.cf-shell-menu-item.active svg{opacity:1;color:var(--prime)}',
    '.cf-shell-menu-divider{height:1px;background:var(--bdr);margin:4px 0}',
    '.cf-shell-menu-meta{font-family:var(--m);font-size:var(--fs-10);color:var(--t3);margin-left:auto}',
    '.cf-shell-cmdk{position:fixed;top:10vh;left:50%;transform:translateX(-50%) translateY(-8px);width:min(600px,92vw);max-height:70vh;background:var(--s1);border:1px solid var(--bdr);z-index:300;opacity:0;pointer-events:none;transition:opacity var(--dur-base),transform var(--dur-base);display:flex;flex-direction:column}',
    '.cf-shell-cmdk.open{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto}',
    '.cf-shell-cmdk-search{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--bdr)}',
    '.cf-shell-cmdk-search svg{width:16px;height:16px;color:var(--t2);flex-shrink:0}',
    '.cf-shell-cmdk-input{flex:1;border:none;background:transparent;font-family:var(--b);font-size:var(--fs-14);color:var(--ink);outline:none}',
    '.cf-shell-cmdk-input::placeholder{color:var(--t3)}',
    '.cf-shell-cmdk-results{overflow-y:auto;padding:6px;flex:1}',
    '.cf-shell-cmdk-section{padding:8px 10px 4px;font-family:var(--m);font-size:var(--fs-10);color:var(--t3);text-transform:uppercase;letter-spacing:0.08em}',
    '.cf-shell-cmdk-item{display:flex;align-items:center;gap:10px;padding:8px 10px;font-size:var(--fs-13);color:var(--t1);cursor:pointer;text-decoration:none;transition:background var(--dur-fast)}',
    '.cf-shell-cmdk-item:hover,.cf-shell-cmdk-item.active{background:var(--prime-bg);color:var(--prime)}',
    '.cf-shell-cmdk-item[data-copilot]:hover,.cf-shell-cmdk-item[data-copilot].active{background:var(--ai-bg);color:var(--ai-dark)}',
    '[data-theme="night"] .cf-shell-cmdk-item[data-copilot]:hover,[data-theme="night"] .cf-shell-cmdk-item[data-copilot].active{color:var(--ai-light)}',
    '.cf-shell-cmdk-item svg{width:14px;height:14px;opacity:0.7;flex-shrink:0}',
    '.cf-shell-cmdk-item.active svg,.cf-shell-cmdk-item:hover svg{opacity:1}',
    '.cf-shell-cmdk-item[data-copilot] svg{color:var(--ai)}',
    '.cf-shell-drawer{position:fixed;top:0;right:0;bottom:0;width:min(400px,92vw);background:var(--s1);border-left:1px solid var(--bdr);z-index:280;transform:translateX(100%);transition:transform var(--dur-slow) var(--ease);display:flex;flex-direction:column}',
    '.cf-shell-drawer.open{transform:translateX(0)}',
    '.cf-shell-drawer-header{padding:16px 20px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between}',
    '.cf-shell-drawer-title{display:flex;align-items:center;gap:8px;font-family:var(--d);font-weight:600;font-size:var(--fs-15)}',
    '.cf-shell-drawer-title svg{width:16px;height:16px;color:var(--ai)}',
    '.cf-shell-drawer-body{padding:20px;flex:1;overflow-y:auto}',
    '.cf-shell-drawer-close{width:28px;height:28px;background:transparent;border:1px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--t2);font-size:20px;line-height:1}',
    '.cf-shell-drawer-close:hover{background:var(--s2);border-color:var(--bdr);color:var(--ink)}',
    '.cf-shell-copilot-chip{display:block;width:100%;padding:10px 12px;background:var(--ai-bg);border:1px solid var(--ai-bdr);font-family:var(--b);font-size:var(--fs-13);color:var(--ai-dark);cursor:pointer;transition:all var(--dur-fast);text-align:left;margin-bottom:8px}',
    '.cf-shell-copilot-chip:hover{background:var(--ai);color:var(--on-ai)}',
    '[data-theme="night"] .cf-shell-copilot-chip{color:var(--ai-light)}',
    '.cf-shell-drawer-footer{padding:12px 16px;border-top:1px solid var(--bdr);display:flex;gap:8px}',
    '.cf-shell-copilot-input{flex:1;padding:8px 12px;background:var(--bg);border:1px solid var(--bdr);font-family:var(--b);font-size:var(--fs-13);color:var(--ink);outline:none}',
    '.cf-shell-copilot-input:focus{border-color:var(--ai)}',
    '.cf-shell-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.96);width:min(480px,92vw);background:var(--s1);border:1px solid var(--bdr);z-index:310;opacity:0;pointer-events:none;transition:opacity var(--dur-base),transform var(--dur-base)}',
    '.cf-shell-modal.open{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}',
    '.cf-shell-modal-header{padding:16px 20px;border-bottom:1px solid var(--bdr);font-family:var(--d);font-weight:600;font-size:var(--fs-15)}',
    '.cf-shell-modal-body{padding:12px 20px 20px}',
    '.cf-shell-help-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;font-size:var(--fs-13);color:var(--t1);border-bottom:1px solid var(--bdr)}',
    '.cf-shell-help-row:last-child{border-bottom:none}',
    '.cf-shell-help-keys{display:flex;gap:4px}',
    '.cf-shell-help-key{font-family:var(--m);font-size:var(--fs-10);padding:2px 7px;background:var(--s2);border:1px solid var(--bdr);color:var(--t2);border-radius:3px}',
    '@media(max-width:900px){.cf-shell-workspace-name{display:none}.cf-shell-search span:first-of-type{display:none}.cf-shell-kbd{display:none}.cf-shell-inner{grid-template-columns:auto 1fr auto}}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.id = 'cf-shell-styles';
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);

  function buildShell() {
    return '<div class="cf-app-shell" id="cf-app-shell" role="banner"><div class="cf-shell-inner">' +
      '<div class="cf-shell-left">' +
      '<a class="cf-shell-logo" href="/dashboard" aria-label="Castford home">' + shield('cf-shell-logo-svg') + '<span>Castford</span></a>' +
      '<button class="cf-shell-workspace" id="cf-workspace-btn" aria-haspopup="menu" aria-expanded="false">' +
      '<span class="cf-shell-workspace-name">Acme SaaS Corp</span>' + icon('arrow-right', 'cf-shell-chevron') + '</button>' +
      '</div>' +
      '<div class="cf-shell-center">' +
      '<button class="cf-shell-search" id="cf-cmdk-btn" aria-label="Open command palette">' +
      icon('search', 'cf-shell-search-icon') +
      '<span>Search pages, KPIs, or ask Copilot…</span><span class="cf-shell-kbd">⌘K</span></button>' +
      '</div>' +
      '<div class="cf-shell-right">' +
      '<button class="cf-shell-sync" id="cf-sync-btn" title="Last synced just now" aria-label="Refresh sync">' + icon('sync') + '</button>' +
      '<button class="cf-shell-copilot" id="cf-copilot-btn" title="Ask Copilot (⌘J)" aria-label="Open Copilot">' + icon('copilot') + '</button>' +
      '<button class="cf-shell-notify" id="cf-notify-btn" title="Notifications" aria-label="Open notifications" aria-haspopup="menu" aria-expanded="false">' + icon('notifications') + '<span class="cf-shell-notify-dot"></span></button>' +
      '<button class="cf-shell-help" id="cf-help-btn" title="Keyboard shortcuts (?)" aria-label="Help"><span>?</span></button>' +
      '<button class="cf-shell-theme" id="cf-theme-btn" title="Toggle theme (⌘⇧L)" aria-label="Toggle theme"><span class="cf-shell-theme-icon"></span></button>' +
      '<button class="cf-shell-avatar-btn" id="cf-user-btn" aria-label="Open user menu" aria-haspopup="menu" aria-expanded="false"><div class="cf-avatar cf-avatar-sm">MF</div></button>' +
      '</div></div></div>';
  }

  function buildOverlays() {
    var navItems = NAV.map(function (p) { return '<a class="cf-shell-cmdk-item" href="' + p.href + '">' + icon(p.icon) + p.label + '</a>'; }).join('');
    var suggestionItems = SUGGESTIONS.map(function (s) { return '<a class="cf-shell-cmdk-item" data-copilot="1" href="#" data-prompt="' + s + '">' + icon('copilot') + s + '</a>'; }).join('');
    var chips = SUGGESTIONS.map(function (s) { return '<button class="cf-shell-copilot-chip" data-prompt="' + s + '">' + s + '</button>'; }).join('');

    return '<div class="cf-shell-backdrop" id="cf-shell-backdrop"></div>' +
      '<div class="cf-shell-menu" id="cf-menu-workspace" role="menu" style="top:52px;left:var(--sp-4)"><div class="cf-shell-menu-group">' +
      '<div class="cf-shell-menu-label">Workspace</div>' +
      '<a class="cf-shell-menu-item active" href="#" role="menuitem">' + icon('check') + 'Acme SaaS Corp<span class="cf-shell-menu-meta">Current</span></a>' +
      '<div class="cf-shell-menu-divider"></div>' +
      '<a class="cf-shell-menu-item" href="/settings/workspace" role="menuitem">' + icon('settings') + 'Workspace settings</a>' +
      '<a class="cf-shell-menu-item" href="/users" role="menuitem">' + icon('team') + 'Manage team</a>' +
      '</div></div>' +
      '<div class="cf-shell-menu" id="cf-menu-notify" role="menu" style="top:52px;right:var(--sp-4);width:320px"><div class="cf-shell-menu-group">' +
      '<div class="cf-shell-menu-label">Notifications</div>' +
      '<div style="padding:24px 16px;text-align:center;color:var(--t3);font-size:var(--fs-13);line-height:1.55">You are all caught up.<br>No new notifications.</div>' +
      '<div class="cf-shell-menu-divider"></div>' +
      '<a class="cf-shell-menu-item" href="/settings/notifications" role="menuitem">' + icon('settings') + 'Notification settings</a>' +
      '</div></div>' +
      '<div class="cf-shell-menu" id="cf-menu-user" role="menu" style="top:52px;right:var(--sp-4)"><div class="cf-shell-menu-group">' +
      '<div style="padding:10px 12px 6px"><div style="font-size:var(--fs-13);font-weight:500;color:var(--ink)">Malik Frazier</div>' +
      '<div style="font-size:var(--fs-11);color:var(--t3);font-family:var(--m);margin-top:2px">malik@vaultline.app</div></div>' +
      '<div class="cf-shell-menu-divider"></div>' +
      '<a class="cf-shell-menu-item" href="/settings/profile" role="menuitem">' + icon('settings') + 'Account settings</a>' +
      '<a class="cf-shell-menu-item" href="/billing" role="menuitem">' + icon('billing') + 'Billing</a>' +
      '<a class="cf-shell-menu-item" href="/audit-log" role="menuitem">' + icon('audit') + 'Audit log</a>' +
      '<div class="cf-shell-menu-divider"></div>' +
      '<a class="cf-shell-menu-item" href="/logout" role="menuitem" style="color:var(--down)">' + icon('close') + 'Sign out</a>' +
      '</div></div>' +
      '<div class="cf-shell-cmdk" id="cf-shell-cmdk" role="dialog" aria-label="Command palette">' +
      '<div class="cf-shell-cmdk-search">' + icon('search') +
      '<input class="cf-shell-cmdk-input" id="cf-cmdk-input" type="text" placeholder="Search pages, KPIs, or ask Copilot…" autocomplete="off"/>' +
      '<span class="cf-shell-kbd">ESC</span></div>' +
      '<div class="cf-shell-cmdk-results" id="cf-cmdk-results">' +
      '<div class="cf-shell-cmdk-section">Navigate</div>' + navItems +
      '<div class="cf-shell-cmdk-section">Ask Copilot</div>' + suggestionItems +
      '</div></div>' +
      '<div class="cf-shell-drawer" id="cf-shell-drawer" role="dialog" aria-label="Copilot">' +
      '<div class="cf-shell-drawer-header"><div class="cf-shell-drawer-title">' + icon('copilot') + 'Copilot</div>' +
      '<button class="cf-shell-drawer-close" id="cf-drawer-close" aria-label="Close">×</button></div>' +
      '<div class="cf-shell-drawer-body">' +
      '<div style="font-size:var(--fs-13);color:var(--t2);line-height:1.55;margin-bottom:16px">Ask Copilot anything about your financial data. It can analyze variances, forecast scenarios, and drill into transactions.</div>' +
      chips + '</div>' +
      '<div class="cf-shell-drawer-footer">' +
      '<input class="cf-shell-copilot-input" id="cf-copilot-input" type="text" placeholder="Ask Copilot…"/>' +
      '<button class="cf-btn cf-btn-ai cf-btn-sm" id="cf-copilot-send">Send</button>' +
      '</div></div>' +
      '<div class="cf-shell-modal" id="cf-shell-help" role="dialog" aria-label="Keyboard shortcuts">' +
      '<div class="cf-shell-modal-header">Keyboard shortcuts</div>' +
      '<div class="cf-shell-modal-body">' +
      '<div class="cf-shell-help-row"><span>Command palette</span><span class="cf-shell-help-keys"><span class="cf-shell-help-key">⌘</span><span class="cf-shell-help-key">K</span></span></div>' +
      '<div class="cf-shell-help-row"><span>Ask Copilot</span><span class="cf-shell-help-keys"><span class="cf-shell-help-key">⌘</span><span class="cf-shell-help-key">J</span></span></div>' +
      '<div class="cf-shell-help-row"><span>Toggle theme</span><span class="cf-shell-help-keys"><span class="cf-shell-help-key">⌘</span><span class="cf-shell-help-key">⇧</span><span class="cf-shell-help-key">L</span></span></div>' +
      '<div class="cf-shell-help-row"><span>Show this help</span><span class="cf-shell-help-keys"><span class="cf-shell-help-key">?</span></span></div>' +
      '<div class="cf-shell-help-row"><span>Close any dialog</span><span class="cf-shell-help-keys"><span class="cf-shell-help-key">ESC</span></span></div>' +
      '</div></div>';
  }

  function wire() {
    function $(id) { return document.getElementById(id); }
    var backdrop = $('cf-shell-backdrop');
    var cmdk = $('cf-shell-cmdk'), cmdkInput = $('cf-cmdk-input'), cmdkResults = $('cf-cmdk-results');
    var drawer = $('cf-shell-drawer');
    var helpModal = $('cf-shell-help');
    var menus = [$('cf-menu-workspace'), $('cf-menu-notify'), $('cf-menu-user')];
    var modals = [cmdk, drawer, helpModal];

    function closeAll() {
      menus.forEach(function (m) { if (m) m.classList.remove('open'); });
      modals.forEach(function (m) { if (m) m.classList.remove('open'); });
      backdrop.classList.remove('open');
      document.querySelectorAll('[aria-expanded="true"]').forEach(function (el) { el.setAttribute('aria-expanded', 'false'); });
    }
    function openMenu(menu, btnId) {
      var isOpen = menu.classList.contains('open');
      closeAll();
      if (!isOpen) { menu.classList.add('open'); if (btnId) $(btnId).setAttribute('aria-expanded', 'true'); }
    }
    function openModal(m) { closeAll(); backdrop.classList.add('open'); m.classList.add('open'); }
    function openCmdk() { openModal(cmdk); setTimeout(function () { cmdkInput.focus(); }, 50); }
    function openDrawer() { openModal(drawer); setTimeout(function () { $('cf-copilot-input').focus(); }, 300); }
    function openHelp() { openModal(helpModal); }

    $('cf-workspace-btn').addEventListener('click', function (e) { e.stopPropagation(); openMenu($('cf-menu-workspace'), 'cf-workspace-btn'); });
    $('cf-notify-btn').addEventListener('click', function (e) { e.stopPropagation(); openMenu($('cf-menu-notify'), 'cf-notify-btn'); });
    $('cf-user-btn').addEventListener('click', function (e) { e.stopPropagation(); openMenu($('cf-menu-user'), 'cf-user-btn'); });
    $('cf-cmdk-btn').addEventListener('click', openCmdk);
    $('cf-copilot-btn').addEventListener('click', openDrawer);
    $('cf-help-btn').addEventListener('click', openHelp);
    $('cf-drawer-close').addEventListener('click', closeAll);
    backdrop.addEventListener('click', closeAll);

    $('cf-theme-btn').addEventListener('click', function () {
      var h = document.documentElement;
      var next = h.dataset.theme === 'night' ? 'day' : 'night';
      h.dataset.theme = next;
      try { localStorage.setItem('cf-theme', next); } catch (e) { }
    });

    $('cf-sync-btn').addEventListener('click', function () {
      var s = this.querySelector('svg');
      s.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
      s.style.transform = 'rotate(360deg)';
      setTimeout(function () { s.style.transition = 'none'; s.style.transform = 'rotate(0)'; }, 620);
    });

    document.querySelectorAll('.cf-shell-copilot-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        $('cf-copilot-input').value = chip.dataset.prompt;
        $('cf-copilot-input').focus();
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.cf-shell-menu') && !e.target.closest('.cf-app-shell')) {
        menus.forEach(function (m) { if (m) m.classList.remove('open'); });
      }
    });

    document.addEventListener('keydown', function (e) {
      var cmd = e.metaKey || e.ctrlKey;
      if (cmd && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmdk(); return; }
      if (cmd && e.key.toLowerCase() === 'j') { e.preventDefault(); openDrawer(); return; }
      if (cmd && e.shiftKey && e.key.toLowerCase() === 'l') { e.preventDefault(); $('cf-theme-btn').click(); return; }
      if (e.key === '?' && !e.target.matches('input, textarea, [contenteditable]')) { e.preventDefault(); openHelp(); return; }
      if (e.key === 'Escape') { closeAll(); }
    });

    cmdkInput.addEventListener('input', function () {
      var q = cmdkInput.value.toLowerCase();
      cmdkResults.querySelectorAll('.cf-shell-cmdk-item').forEach(function (item) {
        item.style.display = !q || item.textContent.toLowerCase().indexOf(q) >= 0 ? 'flex' : 'none';
      });
      var firstVisible = cmdkResults.querySelector('.cf-shell-cmdk-item:not([style*="none"])');
      cmdkResults.querySelectorAll('.cf-shell-cmdk-item.active').forEach(function (el) { el.classList.remove('active'); });
      if (firstVisible) firstVisible.classList.add('active');
    });

    cmdkInput.addEventListener('keydown', function (e) {
      var all = cmdkResults.querySelectorAll('.cf-shell-cmdk-item');
      var items = [];
      all.forEach(function (el) { if (el.style.display !== 'none') items.push(el); });
      var active = cmdkResults.querySelector('.cf-shell-cmdk-item.active');
      var idx = items.indexOf(active);
      if (e.key === 'ArrowDown') { e.preventDefault(); if (active) active.classList.remove('active'); idx = (idx + 1) % items.length; if (items[idx]) { items[idx].classList.add('active'); items[idx].scrollIntoView({ block: 'nearest' }); } }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (active) active.classList.remove('active'); idx = idx <= 0 ? items.length - 1 : idx - 1; if (items[idx]) { items[idx].classList.add('active'); items[idx].scrollIntoView({ block: 'nearest' }); } }
      else if (e.key === 'Enter' && active) { e.preventDefault(); active.click(); }
    });
  }

  function init() {
    document.body.classList.add('cf-shell-active');
    document.body.insertAdjacentHTML('afterbegin', buildShell());
    document.body.insertAdjacentHTML('beforeend', buildOverlays());
    wire();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
