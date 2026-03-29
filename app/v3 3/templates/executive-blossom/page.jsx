'use client';

import { useEffect, useRef } from 'react';

export default function V3TemplatesExecutiveBlossomPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `function toggleTheme() {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    document.querySelector('.theme-label').textContent = next === 'dark' ? 'Dark' : 'Light';
    document.querySelectorAll('.cp-theme').forEach(t => t.classList.toggle('active', t.dataset.themeVal === next));
  }
  function setActiveNav(el) { document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active')); el.classList.add('active'); }
  function setActiveTab(el) { el.parentElement.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active')); el.classList.add('active'); }

  // Customize panel
  function openCustomize() { document.getElementById('customizePanel').classList.add('open'); document.getElementById('customizeOverlay').classList.add('open'); }
  function closeCustomize() { document.getElementById('customizePanel').classList.remove('open'); document.getElementById('customizeOverlay').classList.remove('open'); }
  function setPreset(el) { document.querySelectorAll('.cp-preset').forEach(p => p.classList.remove('active')); el.classList.add('active'); }
  function setThemeOption(el) {
    const val = el.dataset.themeVal;
    document.querySelectorAll('.cp-theme').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    if (val === 'midnight') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.setProperty('--color-void', '#08040A');
      document.documentElement.style.setProperty('--color-deep', '#0C0812');
      document.documentElement.style.setProperty('--color-surface', '#100C18');
      document.documentElement.style.setProperty('--color-card', '#141020');
    } else { document.documentElement.removeAttribute('style'); document.documentElement.setAttribute('data-theme', val); }
    document.querySelector('.theme-label').textContent = val.charAt(0).toUpperCase() + val.slice(1);
  }
  function setAccent(el) {
    document.querySelectorAll('.cp-color').forEach(c => c.classList.remove('active')); el.classList.add('active');
    const color = el.dataset.accent; document.documentElement.style.setProperty('--color-primary', color);
    const r = parseInt(color.slice(1,3),16), g = parseInt(color.slice(3,5),16), b = parseInt(color.slice(5,7),16);
    document.documentElement.style.setProperty('--color-primary-soft', \`rgba(\${r},\${g},\${b},0.12)\`);
    document.querySelector('.customize-fab').style.background = \`linear-gradient(135deg, \${color}, \${color}cc)\`;
  }
  function setLayout(el, layout) { el.parentElement.querySelectorAll('.cp-option').forEach(o => o.classList.remove('active')); el.classList.add('active'); document.documentElement.setAttribute('data-layout', layout); }
  function setDensity(el, density) { el.parentElement.querySelectorAll('.cp-option').forEach(o => o.classList.remove('active')); el.classList.add('active'); document.documentElement.setAttribute('data-density', density); }
  function toggleWidget(el, index) { el.classList.toggle('on'); const cards = document.querySelectorAll('.kpi-grid .kpi-card'); if (cards[index]) cards[index].style.display = el.classList.contains('on') ? '' : 'none'; }`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  /* ============================================
     TEMPLATE 3: EXECUTIVE BLOSSOM
     Soft blush pinks, warm rose, champagne golds,
     clean whites. Sophisticated spring warmth
     with an executive boardroom tone.
     ============================================ */

  :root {
    --color-void: #0C0810;
    --color-deep: #110D16;
    --color-surface: #16111E;
    --color-card: #1C1626;
    --color-elevated: #261E32;

    --color-t1: #F5F0F8;
    --color-t2: #B0A3BD;
    --color-t3: #7E6F8E;
    --color-t4: #5C4F6A;

    --color-primary: #E8A0BF;
    --color-primary-soft: rgba(232, 160, 191, 0.10);
    --color-rose: #F0A8C4;
    --color-rose-soft: rgba(240, 168, 196, 0.10);
    --color-champagne: #D4B896;
    --color-champagne-soft: rgba(212, 184, 150, 0.10);
    --color-green: #82D9A5;
    --color-green-soft: rgba(130, 217, 165, 0.10);
    --color-red: #E88B8B;
    --color-red-soft: rgba(232, 139, 139, 0.08);
    --color-lilac: #B8A0D6;
    --color-lilac-soft: rgba(184, 160, 214, 0.10);
    --color-sky: #8EB8E0;
    --color-sky-soft: rgba(142, 184, 224, 0.08);

    --glass-bg: rgba(28, 22, 38, 0.65);
    --glass-border: rgba(232, 160, 191, 0.07);
    --glass-highlight: rgba(255, 255, 255, 0.03);
    --glass-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04);

    --border-subtle: rgba(232, 160, 191, 0.08);
    --border-hover: rgba(232, 160, 191, 0.20);

    --radius-card: 12px;
    --radius-sm: 8px;
    --radius-xs: 6px;

    --font-display: 'Plus Jakarta Sans', sans-serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  [data-theme="light"] {
    --color-void: #FBF7F9;
    --color-deep: #F5EFF2;
    --color-surface: #FDF9FB;
    --color-card: #FFFFFF;
    --color-elevated: #F8F2F5;

    --color-t1: #1E0F18;
    --color-t2: #5C4F56;
    --color-t3: #7E6F76;
    --color-t4: #B0A3AA;

    --glass-bg: rgba(255, 255, 255, 0.82);
    --glass-border: rgba(0, 0, 0, 0.05);
    --glass-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03);
    --border-subtle: rgba(0, 0, 0, 0.05);
    --border-hover: rgba(232, 160, 191, 0.28);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--color-void);
    color: var(--color-t1);
    font-family: var(--font-body);
    min-height: 100vh;
    overflow-x: hidden;
    transition: background 0.3s ease, color 0.3s ease;
  }

  .app-frame {
    max-width: 1320px; margin: 0 auto;
    background: var(--color-void); transition: background 0.3s ease;
  }

  /* === TOP BANNER === */
  .top-banner {
    background: linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-champagne-soft) 100%);
    border-bottom: 1px solid var(--border-subtle);
    padding: 16px 28px; display: flex; align-items: center; justify-content: space-between;
  }
  .top-banner-left { display: flex; align-items: center; gap: 14px; }
  .logo-text {
    font-family: var(--font-display); font-size: 22px; font-weight: 700;
    letter-spacing: -0.02em; color: var(--color-t1);
  }
  .logo-text span { color: var(--color-primary); }
  .top-banner-tagline {
    color: var(--color-t3); font-size: 13px;
    border-left: 1px solid var(--border-subtle);
    padding-left: 14px; margin-left: 4px;
  }
  .top-banner-right { display: flex; align-items: center; gap: 16px; }
  .live-badge {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 500;
    color: var(--color-green);
    background: var(--color-green-soft);
    border: 1px solid rgba(130, 217, 165, 0.15);
    padding: 4px 12px; border-radius: 9999px;
  }
  .live-dot {
    width: 6px; height: 6px; background: var(--color-green);
    border-radius: 50%; animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .theme-toggle {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--color-t3);
    cursor: pointer; padding: 5px 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-subtle);
    background: var(--glass-bg);
    transition: border-color 0.2s ease; user-select: none;
  }
  .theme-toggle:hover { border-color: var(--border-hover); }
  .theme-toggle svg { width: 14px; height: 14px; }
  .theme-toggle .icon-sun { display: none; }
  [data-theme="light"] .theme-toggle .icon-moon { display: none; }
  [data-theme="light"] .theme-toggle .icon-sun { display: block; }

  /* === DASHBOARD === */
  .dashboard {
    display: grid; grid-template-columns: 220px 1fr;
    min-height: 760px;
    border: 1px solid var(--border-subtle); border-top: none;
  }

  /* === SIDEBAR === */
  .sidebar {
    background: var(--color-deep);
    border-right: 1px solid var(--border-subtle);
    padding: 20px 0; display: flex; flex-direction: column;
    transition: background 0.3s ease;
  }
  .sidebar-header {
    padding: 0 16px 18px;
    border-bottom: 1px solid var(--border-subtle); margin-bottom: 14px;
  }
  .sidebar-logo {
    font-family: var(--font-display); font-size: 17px; font-weight: 700; color: var(--color-t1);
  }
  .sidebar-logo span { color: var(--color-primary); }
  .sidebar-org { font-size: 11px; color: var(--color-t4); margin-top: 4px; }
  .nav-section { padding: 0 12px; margin-bottom: 14px; }
  .nav-section-label {
    font-size: 10px; font-weight: 600; color: var(--color-t4);
    text-transform: uppercase; letter-spacing: 0.06em;
    padding: 0 8px; margin-bottom: 6px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: var(--radius-sm);
    font-size: 13px; color: var(--color-t2);
    cursor: pointer; transition: color 0.15s ease, background 0.15s ease;
    border-left: 2px solid transparent;
  }
  .nav-item:hover { color: var(--color-t1); background: var(--color-primary-soft); }
  .nav-item.active {
    background: var(--color-primary-soft);
    color: var(--color-t1); border-left-color: var(--color-primary);
  }
  .nav-item svg { width: 16px; height: 16px; opacity: 0.6; flex-shrink: 0; }
  .nav-item.active svg, .nav-item:hover svg { opacity: 1; }
  .nav-badge {
    font-size: 9px; font-weight: 600;
    padding: 1px 6px; border-radius: 9999px; margin-left: auto;
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .badge-growth { background: var(--color-lilac-soft); color: var(--color-lilac); }
  .badge-enterprise { background: var(--color-green-soft); color: var(--color-green); }
  .badge-premium { background: var(--color-champagne-soft); color: var(--color-champagne); }

  .sidebar-user {
    margin-top: auto; padding: 16px;
    border-top: 1px solid var(--border-subtle);
    display: flex; align-items: center; gap: 10px;
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-lilac));
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--color-void);
  }
  .user-name { font-size: 13px; font-weight: 500; color: var(--color-t1); }
  .user-role { font-size: 11px; color: var(--color-t4); }

  /* === MAIN === */
  .main {
    background: var(--color-surface);
    padding: 24px 28px; overflow: hidden;
    transition: background 0.3s ease;
  }
  .main-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 20px;
  }
  .greeting-date {
    font-size: 11px; color: var(--color-t4);
    text-transform: uppercase; letter-spacing: 0.06em;
    margin-bottom: 4px; display: flex; align-items: center; gap: 6px;
  }
  .greeting-date svg { width: 12px; height: 12px; }
  .greeting-title {
    font-family: var(--font-display);
    font-size: 24px; font-weight: 700; color: var(--color-t1);
    display: flex; align-items: center; gap: 12px;
  }
  .period-badge {
    font-size: 11px; font-weight: 600;
    background: var(--color-primary-soft);
    color: var(--color-primary);
    padding: 3px 10px; border-radius: var(--radius-xs);
    border: 1px solid rgba(232, 160, 191, 0.15);
  }
  .status-pills { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
  .status-pill {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 500;
    padding: 4px 12px; border-radius: 9999px; border: 1px solid;
  }
  .pill-green { color: var(--color-green); background: var(--color-green-soft); border-color: rgba(130, 217, 165, 0.2); }
  .pill-rose { color: var(--color-rose); background: var(--color-rose-soft); border-color: rgba(240, 168, 196, 0.2); }
  .pill-champagne { color: var(--color-champagne); background: var(--color-champagne-soft); border-color: rgba(212, 184, 150, 0.2); }

  .header-actions { display: flex; gap: 8px; }
  .action-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 500; color: var(--color-t2);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    cursor: pointer; transition: border-color 0.2s ease, color 0.15s ease;
    backdrop-filter: blur(16px);
  }
  .action-btn:hover { border-color: var(--border-hover); color: var(--color-t1); }
  .action-btn svg { width: 14px; height: 14px; color: var(--color-primary); }
  .action-btn.primary {
    background: linear-gradient(135deg, var(--color-primary), #C882A4);
    color: var(--color-void); border: none; font-weight: 600;
  }
  .action-btn.primary:hover { opacity: 0.92; }
  .action-btn.primary svg { color: var(--color-void); }

  /* === CONNECTOR BAR === */
  .connector-bar {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-card);
    padding: 12px 16px; margin-bottom: 20px;
    display: flex; align-items: center; gap: 16px;
    backdrop-filter: blur(16px);
    box-shadow: var(--glass-shadow);
    transition: border-color 0.2s ease;
  }
  .connector-bar:hover { border-color: var(--border-hover); }
  .connector-status {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 500; color: var(--color-green); white-space: nowrap;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-green); }
  .connector-stats {
    font-size: 11px; color: var(--color-t4); white-space: nowrap;
    border-left: 1px solid var(--border-subtle); padding-left: 12px;
  }
  .connectors-list {
    display: flex; gap: 12px; margin-left: auto;
    border-left: 1px solid var(--border-subtle); padding-left: 12px; flex-wrap: wrap;
  }
  .connector-chip {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: var(--color-t2); white-space: nowrap;
  }
  .connector-chip .dot { width: 5px; height: 5px; }
  .connector-chip .sync { color: var(--color-t4); font-size: 10px; }

  /* === KPI === */
  .section-label {
    font-size: 11px; font-weight: 600; color: var(--color-t4);
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px;
  }
  .kpi-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 14px; margin-bottom: 20px;
  }
  .glass-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-card);
    box-shadow: var(--glass-shadow);
    backdrop-filter: blur(16px);
    transition: border-color 0.2s ease;
  }
  .glass-card:hover { border-color: var(--border-hover); }

  .kpi-card { padding: 16px 18px; position: relative; overflow: hidden; }
  .kpi-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .kpi-icon { width: 8px; height: 8px; border-radius: 50%; }
  .kpi-label {
    font-size: 11px; font-weight: 500; color: var(--color-t3);
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .kpi-value {
    font-family: var(--font-mono);
    font-size: 28px; font-weight: 500; color: var(--color-t1);
    margin-bottom: 6px; letter-spacing: -0.02em;
  }
  .kpi-sub { display: flex; align-items: center; gap: 8px; font-size: 12px; }
  .kpi-trend { display: flex; align-items: center; gap: 3px; font-weight: 500; }
  .trend-up { color: var(--color-green); }
  .trend-down { color: var(--color-red); }
  .kpi-benchmark { color: var(--color-t4); font-size: 11px; }
  .sparkline { position: absolute; top: 14px; right: 14px; width: 80px; height: 36px; }
  .sparkline svg { width: 100%; height: 100%; }

  /* === CHARTS === */
  .charts-row {
    display: grid; grid-template-columns: 1fr 1.4fr;
    gap: 14px;
  }
  .chart-card { padding: 18px 20px; }
  .chart-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
  }
  .chart-title {
    font-size: 14px; font-weight: 700; color: var(--color-t1);
    display: flex; align-items: center; gap: 8px;
  }
  .chart-live {
    font-size: 10px; font-weight: 600; color: var(--color-green);
    background: var(--color-green-soft); padding: 2px 8px; border-radius: 9999px;
  }
  .chart-tabs { display: flex; gap: 4px; }
  .chart-tab {
    font-size: 11px; padding: 3px 10px; border-radius: var(--radius-xs);
    color: var(--color-t3); cursor: pointer; transition: color 0.15s ease, background 0.15s ease;
  }
  .chart-tab:hover { color: var(--color-t2); }
  .chart-tab.active { background: var(--color-primary-soft); color: var(--color-primary); }
  .chart-subtitle {
    font-size: 11px; color: var(--color-t4); margin-top: -8px; margin-bottom: 12px;
  }

  /* Metric summary cards */
  .metric-stack { display: flex; flex-direction: column; gap: 10px; }
  .metric-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.03);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.15s ease;
  }
  .metric-row:hover {
    border-color: var(--border-hover);
    background: rgba(255,255,255,0.04);
  }
  .metric-row-left { display: flex; align-items: center; gap: 10px; }
  .metric-row-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .metric-row-name { font-size: 13px; color: var(--color-t2); }
  .metric-row-right { display: flex; align-items: center; gap: 12px; }
  .metric-row-value {
    font-family: var(--font-mono); font-size: 14px; font-weight: 500; color: var(--color-t1);
  }
  .metric-row-change { font-size: 11px; font-weight: 500; }

  /* Revenue stacked area chart */
  .stacked-chart { height: 190px; position: relative; }
  .stacked-chart svg { width: 100%; height: 100%; }
  .chart-y-labels {
    position: absolute; left: 0; top: 0; bottom: 24px;
    display: flex; flex-direction: column; justify-content: space-between; width: 40px;
  }
  .chart-y-label { font-family: var(--font-mono); font-size: 10px; color: var(--color-t4); }
  .chart-x-labels {
    position: absolute; bottom: 0; left: 44px; right: 0;
    display: flex; justify-content: space-between;
  }
  .chart-x-label { font-family: var(--font-mono); font-size: 9px; color: var(--color-t4); }

  /* Donut */
  .donut-container { display: flex; align-items: center; gap: 24px; padding: 12px 0; }
  .donut-svg { width: 140px; height: 140px; flex-shrink: 0; }
  .donut-legend { display: flex; flex-direction: column; gap: 10px; }
  .legend-item {
    display: flex; align-items: center; gap: 8px;
    cursor: pointer; transition: opacity 0.15s ease;
  }
  .legend-item:hover { opacity: 0.8; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .legend-label { font-size: 12px; color: var(--color-t2); }
  .legend-value {
    font-family: var(--font-mono); font-size: 12px; color: var(--color-t1);
    font-weight: 500; margin-left: auto;
  }

  /* === BOTTOM CTA === */
  .bottom-cta {
    background: linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-champagne-soft) 100%);
    border-top: 1px solid var(--border-subtle);
    padding: 22px 28px; display: flex; align-items: center; justify-content: space-between;
  }
  .cta-left h3 {
    font-family: var(--font-display); font-size: 18px; font-weight: 700;
    color: var(--color-t1); margin-bottom: 4px;
  }
  .cta-left p { font-size: 13px; color: var(--color-t2); }
  .cta-buttons { display: flex; gap: 10px; align-items: center; }
  .cta-primary {
    background: linear-gradient(135deg, var(--color-primary), #C882A4);
    color: var(--color-void); font-size: 13px; font-weight: 700;
    padding: 10px 22px; border-radius: var(--radius-sm);
    border: none; cursor: pointer; transition: opacity 0.2s ease;
  }
  .cta-primary:hover { opacity: 0.92; }
  .cta-secondary {
    color: var(--color-t2); font-size: 13px; padding: 9px 18px;
    border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);
    background: transparent; cursor: pointer; transition: border-color 0.2s ease;
  }
  .cta-secondary:hover { border-color: var(--border-hover); }
  .cta-url { font-family: var(--font-mono); font-size: 11px; color: var(--color-t4); margin-top: 8px; }
  .cta-url span { color: var(--color-primary); }

  /* === CUSTOMIZE PANEL === */
  .customize-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.35); z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }
  .customize-overlay.open { opacity: 1; pointer-events: all; }
  .customize-panel { position: fixed; top: 0; right: -420px; bottom: 0; width: 400px; max-width: 90vw; background: var(--color-card); border-left: 1px solid var(--border-subtle); z-index: 1000; overflow-y: auto; transition: right 0.3s cubic-bezier(0.4,0,0.2,1); box-shadow: -8px 0 30px rgba(0,0,0,0.15); }
  .customize-panel.open { right: 0; }
  .cp-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 24px 24px 16px; position: sticky; top: 0; background: var(--color-card); border-bottom: 1px solid var(--border-subtle); z-index: 2; }
  .cp-header-left { display: flex; align-items: center; gap: 10px; }
  .cp-header-icon { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--color-primary-soft); display: flex; align-items: center; justify-content: center; }
  .cp-header-icon svg { width: 18px; height: 18px; color: var(--color-primary); }
  .cp-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--color-t1); }
  .cp-subtitle { font-size: 12px; color: var(--color-t3); margin-top: 2px; }
  .cp-close { width: 28px; height: 28px; border-radius: var(--radius-xs); background: transparent; border: 1px solid var(--border-subtle); color: var(--color-t3); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: border-color 0.2s ease, color 0.15s ease; flex-shrink: 0; }
  .cp-close:hover { border-color: var(--border-hover); color: var(--color-t1); }
  .cp-close svg { width: 14px; height: 14px; }
  .cp-body { padding: 20px 24px 32px; }
  .cp-section { margin-bottom: 24px; }
  .cp-section-label { font-size: 10px; font-weight: 600; color: var(--color-t4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
  .cp-presets { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .cp-preset { padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); background: transparent; cursor: pointer; transition: border-color 0.2s ease, background 0.15s ease; text-align: left; }
  .cp-preset:hover { border-color: var(--border-hover); }
  .cp-preset.active { border-color: var(--color-primary); background: var(--color-primary-soft); }
  .cp-preset-icon { font-size: 18px; margin-bottom: 6px; }
  .cp-preset-name { font-size: 13px; font-weight: 600; color: var(--color-t1); }
  .cp-preset-desc { font-size: 11px; color: var(--color-t3); margin-top: 2px; }
  .cp-themes { display: flex; gap: 8px; }
  .cp-theme { flex: 1; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); background: transparent; cursor: pointer; text-align: center; transition: border-color 0.2s ease; }
  .cp-theme:hover { border-color: var(--border-hover); }
  .cp-theme.active { border-color: var(--color-primary); }
  .cp-theme-swatch { width: 32px; height: 32px; border-radius: 50%; margin: 0 auto 6px; border: 2px solid var(--border-subtle); }
  .cp-theme-label { font-size: 11px; color: var(--color-t2); }
  .cp-colors { display: flex; gap: 10px; flex-wrap: wrap; }
  .cp-color { width: 32px; height: 32px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.15s ease, border-color 0.15s ease; position: relative; }
  .cp-color:hover { transform: scale(1.12); }
  .cp-color.active { border-color: var(--color-t1); }
  .cp-color.active::after { content: ''; position: absolute; top: 50%; left: 50%; width: 10px; height: 10px; border-radius: 50%; background: white; transform: translate(-50%,-50%); }
  .cp-options { display: flex; gap: 6px; }
  .cp-option { flex: 1; padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); background: transparent; cursor: pointer; font-size: 12px; font-weight: 500; color: var(--color-t2); text-align: center; transition: border-color 0.2s ease, color 0.15s ease, background 0.15s ease; }
  .cp-option:hover { border-color: var(--border-hover); color: var(--color-t1); }
  .cp-option.active { border-color: var(--color-primary); background: var(--color-primary-soft); color: var(--color-t1); }
  .cp-widgets { display: flex; flex-direction: column; gap: 2px; }
  .cp-widget { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: var(--radius-sm); transition: background 0.15s ease; }
  .cp-widget:hover { background: rgba(255,255,255,0.02); }
  .cp-widget-left { display: flex; align-items: center; gap: 10px; }
  .cp-widget-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .cp-widget-name { font-size: 13px; color: var(--color-t2); }
  .toggle { width: 40px; height: 22px; border-radius: 11px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-subtle); position: relative; cursor: pointer; transition: background 0.2s ease, border-color 0.2s ease; flex-shrink: 0; }
  .toggle.on { background: var(--color-primary); border-color: var(--color-primary); }
  .toggle-knob { width: 16px; height: 16px; border-radius: 50%; background: white; position: absolute; top: 2px; left: 2px; transition: left 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  .toggle.on .toggle-knob { left: 20px; }
  .customize-fab { position: fixed; bottom: 24px; right: 24px; width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), #C882A4); color: var(--color-void); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 998; transition: transform 0.2s ease; }
  .customize-fab:hover { transform: scale(1.08); }
  .customize-fab svg { width: 20px; height: 20px; }
  [data-layout="compact"] .main { padding: 16px 20px; }
  [data-layout="compact"] .kpi-grid { gap: 10px; }
  [data-layout="compact"] .charts-row { gap: 10px; }
  [data-layout="wide"] .app-frame { max-width: 1600px; }
  [data-density="compact"] .kpi-card { padding: 12px 14px; }
  [data-density="compact"] .kpi-value { font-size: 24px; }
  [data-density="compact"] .chart-card { padding: 14px 16px; }

  @media (max-width: 960px) {
    .dashboard { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-row { grid-template-columns: 1fr; }
    .customize-panel { width: 100%; max-width: 100vw; right: -100%; }
  }
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<div class="app-frame">

  <div class="top-banner">
    <div class="top-banner-left">
      <div class="logo-text">Finance<span>OS</span></div>
      <div class="top-banner-tagline">AI-Powered FP&A Platform</div>
    </div>
    <div class="top-banner-right">
      <div class="live-badge"><div class="live-dot"></div> Live Demo</div>
      <div class="theme-toggle" onclick="toggleTheme()">
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <span class="theme-label">Dark</span>
      </div>
    </div>
  </div>

  <div class="dashboard">
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">Finance<span>OS</span></div>
        <div class="sidebar-org">Financial Holding LLC &middot; Enterprise</div>
      </div>
      <div class="nav-section">
        <div class="nav-section-label">Overview</div>
        <div class="nav-item active" onclick="setActiveNav(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </div>
        <div class="nav-item" onclick="setActiveNav(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z"/></svg>
          AI Copilot
          <span class="nav-badge badge-growth">GROWTH</span>
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-section-label">Planning</div>
        <div class="nav-item" onclick="setActiveNav(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
          Forecast
          <span class="nav-badge badge-growth">GROWTH</span>
        </div>
        <div class="nav-item" onclick="setActiveNav(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/></svg>
          P&L Statement
        </div>
        <div class="nav-item" onclick="setActiveNav(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          Scenarios
          <span class="nav-badge badge-enterprise">ENT</span>
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-section-label">Operations</div>
        <div class="nav-item" onclick="setActiveNav(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          Consolidation
          <span class="nav-badge badge-enterprise">ENT</span>
        </div>
        <div class="nav-item" onclick="setActiveNav(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          Settings
        </div>
      </div>
      <div class="sidebar-user">
        <div class="user-avatar">MF</div>
        <div>
          <div class="user-name">Malik Frazier</div>
          <div class="user-role">CFO</div>
        </div>
      </div>
    </div>

    <div class="main">
      <div class="main-header">
        <div>
          <div class="greeting-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Thursday, March 26, 2026
          </div>
          <div class="greeting-title">
            Financial Overview
            <span class="period-badge">FY2026 Q1</span>
          </div>
          <div class="status-pills">
            <div class="status-pill pill-green">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Revenue on track +$55.0M
            </div>
            <div class="status-pill pill-rose">Board deck due Apr 2</div>
            <div class="status-pill pill-champagne">Close tasks: 4 open</div>
          </div>
        </div>
        <div class="header-actions">
          <div class="action-btn" onclick="this.style.opacity='0.6'; setTimeout(() => this.style.opacity='1', 300)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            Close Tasks
          </div>
          <div class="action-btn primary" onclick="this.style.opacity='0.7'; setTimeout(() => this.style.opacity='1', 300)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z"/></svg>
            Ask AI Copilot
          </div>
        </div>
      </div>

      <div class="connector-bar">
        <div class="connector-status"><div class="dot"></div> All Systems Live</div>
        <div class="connector-stats">7 connectors &middot; 3.1M records &middot; 18 GL accounts</div>
        <div class="connectors-list">
          <div class="connector-chip"><div class="dot"></div> NetSuite <span class="sync">2m</span></div>
          <div class="connector-chip"><div class="dot"></div> Salesforce <span class="sync">2m</span></div>
          <div class="connector-chip"><div class="dot"></div> Stripe <span class="sync">5m</span></div>
          <div class="connector-chip"><div class="dot"></div> Snowflake <span class="sync">5m</span></div>
          <div class="connector-chip"><div class="dot"></div> Rippling <span class="sync">12m</span></div>
        </div>
      </div>

      <div class="section-label">Key Metrics</div>
      <div class="kpi-grid">
        <div class="glass-card kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,28 12,24 24,20 36,22 48,16 60,12 72,8 80,4" fill="none" stroke="#82D9A5" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#82D9A5"></div><div class="kpi-label">Revenue (YTD)</div></div>
          <div class="kpi-value">$55.0M</div>
          <div class="kpi-sub"><span class="kpi-trend trend-up">&#9650; 14.2%</span><span class="kpi-benchmark">vs $48.2M prior YTD</span></div>
        </div>
        <div class="glass-card kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,20 12,18 24,22 36,16 48,14 60,18 72,10 80,6" fill="none" stroke="#E8A0BF" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#E8A0BF"></div><div class="kpi-label">Gross Profit</div></div>
          <div class="kpi-value">$38.5M</div>
          <div class="kpi-sub"><span class="kpi-trend trend-up">&#9650; 70% margin</span><span class="kpi-benchmark">vs 68% target</span></div>
        </div>
        <div class="glass-card kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,14 12,16 24,12 36,18 48,14 60,10 72,12 80,8" fill="none" stroke="#B8A0D6" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#B8A0D6"></div><div class="kpi-label">OpEx (YTD)</div></div>
          <div class="kpi-value">$28.1M</div>
          <div class="kpi-sub"><span class="kpi-trend trend-down">&#9660; 3.1%</span><span class="kpi-benchmark">Under budget $890K</span></div>
        </div>
        <div class="glass-card kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,30 12,26 24,28 36,22 48,18 60,20 72,14 80,10" fill="none" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#D4B896"></div><div class="kpi-label">Net Income</div></div>
          <div class="kpi-value">$10.4M</div>
          <div class="kpi-sub"><span class="kpi-trend trend-up">&#9650; 18.9%</span><span class="kpi-benchmark">vs $8.7M prior</span></div>
        </div>
        <div class="glass-card kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,24 12,20 24,16 36,18 48,12 60,14 72,8 80,6" fill="none" stroke="#8EB8E0" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#8EB8E0"></div><div class="kpi-label">COGS</div></div>
          <div class="kpi-value">$16.5M</div>
          <div class="kpi-sub"><span class="kpi-trend trend-up">&#9650; 5.2%</span><span class="kpi-benchmark">30% of revenue</span></div>
        </div>
        <div class="glass-card kpi-card">
          <div class="sparkline"><svg viewBox="0 0 80 36"><polyline points="0,18 12,14 24,16 36,10 48,12 60,8 72,6 80,4" fill="none" stroke="#E88B8B" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="kpi-header"><div class="kpi-icon" style="background:#E88B8B"></div><div class="kpi-label">Accounts</div></div>
          <div class="kpi-value">1,247</div>
          <div class="kpi-sub"><span class="kpi-trend trend-up">&#9650; 8.4%</span><span class="kpi-benchmark">NRR: 112%</span></div>
        </div>
      </div>

      <div class="charts-row">
        <!-- P&L Summary -->
        <div class="glass-card chart-card">
          <div class="chart-header">
            <div class="chart-title">P&L Summary <span class="chart-live">LIVE</span></div>
          </div>
          <div class="chart-subtitle">Income statement line items (YTD)</div>
          <div class="metric-stack">
            <div class="metric-row" onclick="this.style.background='rgba(255,255,255,0.06)'; setTimeout(() => this.style.background='', 300)">
              <div class="metric-row-left"><div class="metric-row-dot" style="background:#82D9A5"></div><div class="metric-row-name">Revenue</div></div>
              <div class="metric-row-right"><div class="metric-row-value">$55.0M</div><div class="metric-row-change trend-up">+14.2%</div></div>
            </div>
            <div class="metric-row" onclick="this.style.background='rgba(255,255,255,0.06)'; setTimeout(() => this.style.background='', 300)">
              <div class="metric-row-left"><div class="metric-row-dot" style="background:#8EB8E0"></div><div class="metric-row-name">COGS</div></div>
              <div class="metric-row-right"><div class="metric-row-value">$16.5M</div><div class="metric-row-change trend-up">+5.2%</div></div>
            </div>
            <div class="metric-row" onclick="this.style.background='rgba(255,255,255,0.06)'; setTimeout(() => this.style.background='', 300)">
              <div class="metric-row-left"><div class="metric-row-dot" style="background:#E8A0BF"></div><div class="metric-row-name">Gross Profit</div></div>
              <div class="metric-row-right"><div class="metric-row-value">$38.5M</div><div class="metric-row-change trend-up">70%</div></div>
            </div>
            <div class="metric-row" onclick="this.style.background='rgba(255,255,255,0.06)'; setTimeout(() => this.style.background='', 300)">
              <div class="metric-row-left"><div class="metric-row-dot" style="background:#B8A0D6"></div><div class="metric-row-name">OpEx</div></div>
              <div class="metric-row-right"><div class="metric-row-value">$28.1M</div><div class="metric-row-change trend-down">-3.1%</div></div>
            </div>
            <div class="metric-row" onclick="this.style.background='rgba(255,255,255,0.06)'; setTimeout(() => this.style.background='', 300)">
              <div class="metric-row-left"><div class="metric-row-dot" style="background:#D4B896"></div><div class="metric-row-name">Net Income</div></div>
              <div class="metric-row-right"><div class="metric-row-value">$10.4M</div><div class="metric-row-change trend-up">+18.9%</div></div>
            </div>
          </div>
        </div>

        <!-- Revenue trend area chart -->
        <div class="glass-card chart-card">
          <div class="chart-header">
            <div class="chart-title">Revenue Trend</div>
            <div class="chart-tabs">
              <div class="chart-tab" onclick="setActiveTab(this)">QTD</div>
              <div class="chart-tab active" onclick="setActiveTab(this)">YTD</div>
              <div class="chart-tab" onclick="setActiveTab(this)">12M</div>
            </div>
          </div>
          <div class="chart-subtitle">Monthly revenue with AI forecast ($M)</div>
          <div class="stacked-chart">
            <div class="chart-y-labels">
              <div class="chart-y-label">$8M</div><div class="chart-y-label">$6M</div><div class="chart-y-label">$4M</div><div class="chart-y-label">$2M</div><div class="chart-y-label">$0</div>
            </div>
            <svg viewBox="0 0 400 160" style="margin-left:44px;width:calc(100% - 44px)">
              <!-- Area fill -->
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#E8A0BF" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#E8A0BF" stop-opacity="0.02"/>
                </linearGradient>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#B8A0D6" stop-opacity="0.2"/>
                  <stop offset="100%" stop-color="#B8A0D6" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <!-- Actual area -->
              <path d="M0,120 L36,110 L72,100 L108,88 L144,80 L180,76 L216,65 L252,70 L288,55 L288,148 L0,148 Z" fill="url(#areaGrad)"/>
              <polyline points="0,120 36,110 72,100 108,88 144,80 180,76 216,65 252,70 288,55" fill="none" stroke="#E8A0BF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Forecast area -->
              <path d="M288,55 L324,60 L360,50 L396,42 L396,148 L288,148 Z" fill="url(#forecastGrad)"/>
              <polyline points="288,55 324,60 360,50 396,42" fill="none" stroke="#B8A0D6" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round"/>
              <!-- Data points -->
              <circle cx="0" cy="120" r="3" fill="#E8A0BF"/>
              <circle cx="36" cy="110" r="3" fill="#E8A0BF"/>
              <circle cx="72" cy="100" r="3" fill="#E8A0BF"/>
              <circle cx="108" cy="88" r="3" fill="#E8A0BF"/>
              <circle cx="144" cy="80" r="3" fill="#E8A0BF"/>
              <circle cx="180" cy="76" r="3" fill="#E8A0BF"/>
              <circle cx="216" cy="65" r="3" fill="#E8A0BF"/>
              <circle cx="252" cy="70" r="3" fill="#E8A0BF"/>
              <circle cx="288" cy="55" r="3" fill="#E8A0BF"/>
              <circle cx="324" cy="60" r="3.5" fill="#B8A0D6" opacity="0.7"/>
              <circle cx="360" cy="50" r="3.5" fill="#B8A0D6" opacity="0.7"/>
              <circle cx="396" cy="42" r="3.5" fill="#B8A0D6" opacity="0.7"/>
            </svg>
            <div class="chart-x-labels">
              <div class="chart-x-label">Jan</div><div class="chart-x-label">Feb</div><div class="chart-x-label">Mar</div>
              <div class="chart-x-label">Apr</div><div class="chart-x-label">May</div><div class="chart-x-label">Jun</div>
              <div class="chart-x-label">Jul</div><div class="chart-x-label">Aug</div><div class="chart-x-label">Sep</div>
              <div class="chart-x-label">Oct</div><div class="chart-x-label">Nov</div><div class="chart-x-label">Dec</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bottom-cta">
    <div class="cta-left">
      <h3>Executive Blossom &mdash; Spring Theme</h3>
      <p>Template 3 of 3 &middot; FinanceOS Dashboard Styling Preview</p>
      <div class="cta-url">finance-os.app/<span>dashboard</span></div>
    </div>
    <div class="cta-buttons">
      <button class="cta-secondary" onclick="this.textContent='Copied!'; setTimeout(() => this.textContent='Copy CSS Vars', 1500)">Copy CSS Vars</button>
      <button class="cta-primary">Request Full Build</button>
    </div>
  </div>
</div>

<button class="customize-fab" onclick="openCustomize()" title="Customize Dashboard">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
</button>
<div class="customize-overlay" id="customizeOverlay" onclick="closeCustomize()"></div>
<div class="customize-panel" id="customizePanel">
  <div class="cp-header">
    <div class="cp-header-left">
      <div class="cp-header-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg></div>
      <div><div class="cp-title">Customize Dashboard</div><div class="cp-subtitle">Personalize your admin workspace</div></div>
    </div>
    <button class="cp-close" onclick="closeCustomize()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
  </div>
  <div class="cp-body">
    <div class="cp-section"><div class="cp-section-label">Quick Presets</div>
      <div class="cp-presets">
        <div class="cp-preset active" onclick="setPreset(this)"><div class="cp-preset-icon">&#128202;</div><div class="cp-preset-name">Overview</div><div class="cp-preset-desc">All platform metrics</div></div>
        <div class="cp-preset" onclick="setPreset(this)"><div class="cp-preset-icon">&#128176;</div><div class="cp-preset-name">Revenue</div><div class="cp-preset-desc">Financial focus</div></div>
        <div class="cp-preset" onclick="setPreset(this)"><div class="cp-preset-icon">&#9881;&#65039;</div><div class="cp-preset-name">Operations</div><div class="cp-preset-desc">Health &amp; incidents</div></div>
        <div class="cp-preset" onclick="setPreset(this)"><div class="cp-preset-icon">&#128737;&#65039;</div><div class="cp-preset-name">Security</div><div class="cp-preset-desc">Audit &amp; compliance</div></div>
      </div>
    </div>
    <div class="cp-section"><div class="cp-section-label">Theme</div>
      <div class="cp-themes">
        <div class="cp-theme active" data-theme-val="dark" onclick="setThemeOption(this)"><div class="cp-theme-swatch" style="background:#16111E"></div><div class="cp-theme-label">Dark</div></div>
        <div class="cp-theme" data-theme-val="light" onclick="setThemeOption(this)"><div class="cp-theme-swatch" style="background:#FBF7F9"></div><div class="cp-theme-label">Light</div></div>
        <div class="cp-theme" data-theme-val="midnight" onclick="setThemeOption(this)"><div class="cp-theme-swatch" style="background:#08040A"></div><div class="cp-theme-label">Midnight</div></div>
      </div>
    </div>
    <div class="cp-section"><div class="cp-section-label">Accent Color</div>
      <div class="cp-colors">
        <div class="cp-color active" style="background:#E8A0BF" data-accent="#E8A0BF" onclick="setAccent(this)"></div>
        <div class="cp-color" style="background:#B8A0D6" data-accent="#B8A0D6" onclick="setAccent(this)"></div>
        <div class="cp-color" style="background:#82D9A5" data-accent="#82D9A5" onclick="setAccent(this)"></div>
        <div class="cp-color" style="background:#8EB8E0" data-accent="#8EB8E0" onclick="setAccent(this)"></div>
        <div class="cp-color" style="background:#D4956B" data-accent="#D4956B" onclick="setAccent(this)"></div>
        <div class="cp-color" style="background:#D4B896" data-accent="#D4B896" onclick="setAccent(this)"></div>
        <div class="cp-color" style="background:#E88B8B" data-accent="#E88B8B" onclick="setAccent(this)"></div>
        <div class="cp-color" style="background:#D88EB5" data-accent="#D88EB5" onclick="setAccent(this)"></div>
      </div>
    </div>
    <div class="cp-section"><div class="cp-section-label">Layout</div>
      <div class="cp-options">
        <div class="cp-option active" onclick="setLayout(this,'default')">Default</div>
        <div class="cp-option" onclick="setLayout(this,'compact')">Compact</div>
        <div class="cp-option" onclick="setLayout(this,'wide')">Wide</div>
      </div>
    </div>
    <div class="cp-section"><div class="cp-section-label">Density</div>
      <div class="cp-options">
        <div class="cp-option active" onclick="setDensity(this,'comfortable')">Comfortable</div>
        <div class="cp-option" onclick="setDensity(this,'compact')">Compact</div>
      </div>
    </div>
    <div class="cp-section"><div class="cp-section-label">Widgets</div>
      <div class="cp-widgets">
        <div class="cp-widget"><div class="cp-widget-left"><div class="cp-widget-dot" style="background:#82D9A5"></div><div class="cp-widget-name">Revenue (YTD)</div></div><div class="toggle on" onclick="toggleWidget(this,0)"><div class="toggle-knob"></div></div></div>
        <div class="cp-widget"><div class="cp-widget-left"><div class="cp-widget-dot" style="background:#E8A0BF"></div><div class="cp-widget-name">Gross Profit</div></div><div class="toggle on" onclick="toggleWidget(this,1)"><div class="toggle-knob"></div></div></div>
        <div class="cp-widget"><div class="cp-widget-left"><div class="cp-widget-dot" style="background:#B8A0D6"></div><div class="cp-widget-name">OpEx</div></div><div class="toggle on" onclick="toggleWidget(this,2)"><div class="toggle-knob"></div></div></div>
        <div class="cp-widget"><div class="cp-widget-left"><div class="cp-widget-dot" style="background:#D4B896"></div><div class="cp-widget-name">Net Income</div></div><div class="toggle on" onclick="toggleWidget(this,3)"><div class="toggle-knob"></div></div></div>
        <div class="cp-widget"><div class="cp-widget-left"><div class="cp-widget-dot" style="background:#8EB8E0"></div><div class="cp-widget-name">COGS</div></div><div class="toggle on" onclick="toggleWidget(this,4)"><div class="toggle-knob"></div></div></div>
        <div class="cp-widget"><div class="cp-widget-left"><div class="cp-widget-dot" style="background:#E88B8B"></div><div class="cp-widget-name">Accounts</div></div><div class="toggle on" onclick="toggleWidget(this,5)"><div class="toggle-knob"></div></div></div>
      </div>
    </div>
  </div>
</div>


` }} />
    </>
  );
}
