'use client';

import { useEffect, useRef } from 'react';

export default function V3DemoVaultlinePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ─── Widget Config ───
  const WIDGETS = [
    { id: 'total-cash', name: 'Total Cash', icon: '$', color: 'cyan', on: true },
    { id: 'net-flow', name: 'Net Cash Flow', icon: '~', color: 'green', on: true },
    { id: 'payables', name: 'Payables Due', icon: '!', color: 'amber', on: true },
    { id: 'forecast-accuracy', name: 'Forecast Accuracy', icon: '%', color: 'purple', on: true },
    { id: 'cash-trend', name: 'Cash Trend Chart', icon: '^', color: 'cyan', on: true },
    { id: 'accounts', name: 'Bank Accounts', icon: '#', color: 'green', on: true },
    { id: 'activity', name: 'Activity Feed', icon: '*', color: 'cyan', on: true },
    { id: 'forecast', name: '30-Day Forecast', icon: '>', color: 'purple', on: true },
    { id: 'alerts', name: 'Alerts', icon: '!', color: 'amber', on: true },
  ];
  const cMap = {
    cyan: { bg: 'var(--cyan-muted)', fg: 'var(--cyan)' },
    green: { bg: 'var(--green-muted)', fg: 'var(--green)' },
    amber: { bg: 'var(--amber-muted)', fg: 'var(--amber)' },
    purple: { bg: 'var(--purple-muted)', fg: 'var(--purple)' },
  };

  // ─── Scroll Progress ───
  document.querySelector('.main').addEventListener('scroll', function() {
    const el = this;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    document.getElementById('scrollProgress').style.width = Math.min(pct, 100) + '%';
  });

  // ─── Panel ───
  function togglePanel() {
    document.getElementById('overlay').classList.toggle('open');
    document.getElementById('panel').classList.toggle('open');
  }

  // ─── View Switcher ───
  function switchView(view, el) {
    document.querySelectorAll('.topbar-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    showToast(\`\${view.charAt(0).toUpperCase() + view.slice(1)} view\`);
  }

  // ─── Theme ───
  // Theme definitions
  const THEMES = {
    dark: {
      '--bg':'#0B1121','--surface':'#0F172A','--card':'#1E293B','--elevated':'#263548',
      '--border':'rgba(148,163,184,0.08)','--border-hover':'rgba(148,163,184,0.16)',
      '--t1':'#F1F5F9','--t2':'#94A3B8','--t3':'#64748B',
      '--glass-shadow':'0 1px 2px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)',
      light: false
    },
    light: {
      '--bg':'#F8FAFC','--surface':'#F1F5F9','--card':'#FFFFFF','--elevated':'#FFFFFF',
      '--border':'rgba(15,23,42,0.06)','--border-hover':'rgba(15,23,42,0.12)',
      '--t1':'#0F172A','--t2':'#475569','--t3':'#94A3B8',
      '--glass-shadow':'0 1px 2px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.6)',
      light: true
    },
    midnight: {
      '--bg':'#0c1445','--surface':'#111952','--card':'#1a1f5e','--elevated':'#252a6e',
      '--border':'rgba(148,163,184,0.06)','--border-hover':'rgba(148,163,184,0.14)',
      '--t1':'#E8EAFF','--t2':'#9BA2D0','--t3':'#6B73A8',
      '--glass-shadow':'0 1px 2px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
      light: false
    }
  };

  let currentTheme = 'light';

  function setTheme(theme, el) {
    document.querySelectorAll('.option-row .option-card').forEach(e => {
      if (e.id && e.id.startsWith('theme')) e.classList.remove('active');
    });
    el.classList.add('active');

    const t = THEMES[theme];
    if (!t) return;
    currentTheme = theme;

    document.body.classList.toggle('light', !!t.light);
    const s = document.documentElement.style;
    Object.keys(t).forEach(k => { if (k.startsWith('--')) s.setProperty(k, t[k]); });

    // Re-apply current accent glow to match new background
    reapplyAccentGlow();
    showToast(\`\${theme.charAt(0).toUpperCase() + theme.slice(1)} theme\`);
  }

  // ─── Accent ───
  let currentAccent = '#06B6D4';

  function hexToRgb(hex) {
    return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  }

  function setAccent(color, el) {
    document.querySelectorAll('.accent-dot').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    currentAccent = color;
    const [r,g,b] = hexToRgb(color);
    const s = document.documentElement.style;

    // Primary accent
    s.setProperty('--cyan', color);
    s.setProperty('--cyan-muted', \`rgba(\${r},\${g},\${b},0.1)\`);
    s.setProperty('--cyan-glow', \`rgba(\${r},\${g},\${b},0.15)\`);

    // Update active sidebar indicator
    document.querySelectorAll('.sidebar-item.active::before, .sidebar-item.active').forEach(el => {});

    reapplyAccentGlow();
    showToast('Accent updated');
  }

  function reapplyAccentGlow() {
    const [r,g,b] = hexToRgb(currentAccent);
    // Update the ambient glow pseudo-element via a style override
    let glowStyle = document.getElementById('accentGlowStyle');
    if (!glowStyle) {
      glowStyle = document.createElement('style');
      glowStyle.id = 'accentGlowStyle';
      document.head.appendChild(glowStyle);
    }
    glowStyle.textContent = \`
      .main::before {
        background: radial-gradient(circle, rgba(\${r},\${g},\${b},0.12) 0%, transparent 70%) !important;
        opacity: 0.3 !important;
      }
      .topbar::after {
        background: linear-gradient(90deg, transparent, rgba(\${r},\${g},\${b},0.12), transparent) !important;
      }
      .sidebar-item.active { background: rgba(\${r},\${g},\${b},0.1) !important; color: \${currentAccent} !important; }
      .sidebar-item.active::before { background: \${currentAccent} !important; }
      .sidebar-item:hover { background: rgba(\${r},\${g},\${b},0.06) !important; }
      .sidebar-badge { background: rgba(\${r},\${g},\${b},0.1) !important; color: \${currentAccent} !important; }
      .icon-btn:hover { background: rgba(\${r},\${g},\${b},0.1) !important; color: \${currentAccent} !important; border-color: rgba(\${r},\${g},\${b},0.2) !important; }
      .btn-cyan { background: \${currentAccent} !important; box-shadow: 0 2px 8px rgba(\${r},\${g},\${b},0.2) !important; }
      .btn-ghost:hover { background: rgba(\${r},\${g},\${b},0.06) !important; }
      .glass-card-glow, .glass:hover .chart-area { border-color: rgba(\${r},\${g},\${b},0.15) !important; }
      .scroll-progress { background: linear-gradient(90deg, \${currentAccent}, \${shiftHue(currentAccent, 60)}) !important; box-shadow: 0 0 8px rgba(\${r},\${g},\${b},0.15) !important; }
    \`;
  }

  // Shift hue for gradient effects
  function shiftHue(hex, deg) {
    let [r,g,b] = hexToRgb(hex);
    r/=255; g/=255; b/=255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min;
    let h=0, s=max===0?0:d/max, v=max;
    if(d!==0){
      if(max===r) h=((g-b)/d+(g<b?6:0))/6;
      else if(max===g) h=((b-r)/d+2)/6;
      else h=((r-g)/d+4)/6;
    }
    h=((h*360+deg)%360)/360;
    const i=Math.floor(h*6), f=h*6-i, p=v*(1-s), q=v*(1-f*s), t=v*(1-(1-f)*s);
    let r2,g2,b2;
    switch(i%6){case 0:r2=v;g2=t;b2=p;break;case 1:r2=q;g2=v;b2=p;break;case 2:r2=p;g2=v;b2=t;break;case 3:r2=p;g2=q;b2=v;break;case 4:r2=t;g2=p;b2=v;break;case 5:r2=v;g2=p;b2=q;break;}
    return \`#\${Math.round(r2*255).toString(16).padStart(2,'0')}\${Math.round(g2*255).toString(16).padStart(2,'0')}\${Math.round(b2*255).toString(16).padStart(2,'0')}\`;
  }

  // ─── Layout ───
  function setLayout(layout, el) {
    const parent = el.parentElement;
    parent.querySelectorAll('.option-card').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    const m = document.getElementById('dashboardMain');
    m.classList.remove('layout-compact', 'layout-wide');
    if (layout !== 'default') m.classList.add('layout-' + layout);
    showToast(\`\${layout} layout\`);
  }

  // ─── Density ───
  function setDensity(density, el) {
    el.parentElement.querySelectorAll('.option-card').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    const m = document.getElementById('dashboardMain');
    m.classList.remove('density-comfortable', 'density-compact');
    m.classList.add('density-' + density);
    showToast(\`\${density} density\`);
  }

  // ─── Widget Toggles ───
  function renderWidgetToggles() {
    document.getElementById('widgetToggles').innerHTML = WIDGETS.map(w => {
      const c = cMap[w.color] || cMap.cyan;
      return \`<div class="widget-toggle">
        <div class="widget-toggle-info">
          <div class="widget-toggle-icon" style="background:\${c.bg};color:\${c.fg};">\${w.icon}</div>
          <div class="widget-toggle-name">\${w.name}</div>
        </div>
        <div class="switch \${w.on ? 'on' : ''}" onclick="toggleWidget('\${w.id}', this)"></div>
      </div>\`;
    }).join('');
  }
  function toggleWidget(id, el) {
    const w = WIDGETS.find(x => x.id === id);
    w.on = !w.on;
    el.classList.toggle('on');
    document.querySelectorAll(\`[data-widget="\${id}"]\`).forEach(card => {
      if (w.on) {
        card.classList.remove('widget-hidden');
        card.style.animation = 'cardReveal 0.4s var(--ease-out) both';
      } else {
        card.classList.add('widget-hidden');
      }
    });
    showToast(w.on ? \`\${w.name} shown\` : \`\${w.name} hidden\`);
  }

  // ─── Presets ───
  function applyPreset(role, el) {
    document.querySelectorAll('.preset-btn').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    WIDGETS.forEach(w => w.on = true);
    const hide = { cfo: [], analyst: ['forecast-accuracy'], controller: ['cash-trend','alerts'], vp: ['payables','accounts'] }[role] || [];
    hide.forEach(id => { const w = WIDGETS.find(x => x.id === id); if (w) w.on = false; });
    WIDGETS.forEach(w => {
      document.querySelectorAll(\`[data-widget="\${w.id}"]\`).forEach(card => {
        card.classList.toggle('widget-hidden', !w.on);
        if (w.on) card.style.animation = 'cardReveal 0.4s var(--ease-out) both';
      });
    });
    renderWidgetToggles();
    showToast(\`\${role.toUpperCase()} preset applied\`);
  }

  // ─── Reset ───
  function resetAll() {
    WIDGETS.forEach(w => w.on = true);
    document.querySelectorAll('[data-widget]').forEach(c => { c.classList.remove('widget-hidden'); c.style.animation = 'cardReveal 0.4s var(--ease-out) both'; });
    currentTheme = 'light'; currentAccent = '#06B6D4';
    document.body.classList.remove('light');
    const s = document.documentElement.style;
    Object.keys(THEMES.light).forEach(k => { if (k.startsWith('--')) s.setProperty(k, THEMES.light[k]); });
    s.setProperty('--cyan', '#06B6D4'); s.setProperty('--cyan-muted', 'rgba(6,182,212,0.08)');
    s.setProperty('--cyan-glow', 'rgba(6,182,212,0.06)');
    reapplyAccentGlow();
    const m = document.getElementById('dashboardMain');
    m.classList.remove('layout-compact','layout-wide','density-compact');
    renderWidgetToggles();
    document.querySelectorAll('.preset-btn')[0].click();
    document.getElementById('themeLight').classList.add('active');
    document.getElementById('themeDark').classList.remove('active');
    document.getElementById('themeMidnight').classList.remove('active');
    document.querySelectorAll('.accent-dot').forEach((e,i) => e.classList.toggle('active', i===0));
    showToast('Reset to defaults');
  }

  // ─── Toast ───
  let tt;
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerHTML = \`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> \${msg}\`;
    t.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove('show'), 2200);
  }

  renderWidgetToggles();
  reapplyAccentGlow();`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F8FAFC;
    --surface: #F1F5F9;
    --card: #FFFFFF;
    --elevated: #FFFFFF;
    --border: rgba(15,23,42,0.06);
    --border-hover: rgba(15,23,42,0.12);
    --t1: #0F172A;
    --t2: #475569;
    --t3: #94A3B8;
    --cyan: #06B6D4;
    --cyan-muted: rgba(6,182,212,0.08);
    --cyan-glow: rgba(6,182,212,0.06);
    --green: #059669;
    --green-muted: rgba(5,150,105,0.08);
    --amber: #D97706;
    --amber-muted: rgba(217,119,6,0.08);
    --red: #DC2626;
    --red-muted: rgba(220,38,38,0.08);
    --purple: #7C3AED;
    --purple-muted: rgba(124,58,237,0.08);
    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04);
    --glass-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04);
    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
    --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  }

  .light {
    --bg: #F8FAFC;
    --surface: #F1F5F9;
    --card: #FFFFFF;
    --elevated: #FFFFFF;
    --border: rgba(15,23,42,0.06);
    --border-hover: rgba(15,23,42,0.12);
    --t1: #0F172A;
    --t2: #475569;
    --t3: #94A3B8;
    --cyan: #0891B2;
    --cyan-muted: rgba(8,145,178,0.08);
    --cyan-glow: rgba(8,145,178,0.06);
    --green: #059669;
    --green-muted: rgba(5,150,105,0.08);
    --amber: #D97706;
    --amber-muted: rgba(217,119,6,0.08);
    --red: #DC2626;
    --red-muted: rgba(220,38,38,0.08);
    --purple: #7C3AED;
    --purple-muted: rgba(124,58,237,0.08);
    --shadow: 0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04);
    --glass-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04);
  }

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

  body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--t1);
    transition: background var(--transition), color var(--transition);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ─── Glass Card System (CFO Command Center Style) ─── */
  .glass-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--glass-shadow);
    transition: all var(--transition);
    position: relative;
    overflow: hidden;
  }
  .glass-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%);
  }
  .glass-card:hover {
    border-color: var(--border-hover);
    box-shadow: var(--glass-shadow), 0 4px 12px rgba(0,0,0,0.06);
  }

  /* Glow variant for highlighted cards */
  .glass-card-glow {
    border-color: rgba(6,182,212,0.15);
  }
  .glass-card-glow::after {
    content: '';
    position: absolute; inset: -1px; border-radius: var(--radius);
    background: linear-gradient(135deg, rgba(6,182,212,0.08) 0%, transparent 50%, rgba(139,92,246,0.05) 100%);
    pointer-events: none; z-index: 0;
  }
  .glass-card-glow:hover { border-color: rgba(6,182,212,0.25); }

  /* ─── Top Bar ─── */
  .topbar {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; height: 60px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(24px);
  }
  .topbar::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--cyan-glow), transparent);
  }
  .topbar-left { display: flex; align-items: center; gap: 16px; }

  /* Logo — Vault Shield SVG */
  .logo-mark {
    width: 36px; height: 36px; position: relative;
  }
  .logo-mark::after {
    content: ''; position: absolute; inset: -4px;
    background: radial-gradient(circle, var(--cyan-glow) 0%, transparent 70%);
    border-radius: 12px; opacity: 0;
    transition: opacity 0.3s ease;
  }
  .logo-mark:hover::after { opacity: 1; }

  .logo-text {
    font-weight: 700; font-size: 18px; letter-spacing: -0.4px;
    background: linear-gradient(135deg, var(--t1) 0%, var(--t2) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .topbar-center {
    display: flex; align-items: center; gap: 2px;
    background: var(--bg); border-radius: 10px; padding: 3px;
    border: 1px solid var(--border);
  }
  .topbar-tab {
    padding: 6px 16px; border-radius: 7px; font-size: 12px; font-weight: 600;
    color: var(--t3); cursor: pointer; transition: all var(--transition);
    border: none; background: none; font-family: var(--font);
  }
  .topbar-tab:hover { color: var(--t2); }
  .topbar-tab.active {
    background: var(--card); color: var(--t1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }

  .topbar-right { display: flex; align-items: center; gap: 10px; }

  .btn {
    padding: 8px 18px; border-radius: 9px; border: none;
    font-family: var(--font); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all var(--transition);
    display: inline-flex; align-items: center; gap: 7px;
  }
  .btn-ghost {
    background: transparent; color: var(--t2);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { border-color: var(--border-hover); color: var(--t1); background: var(--cyan-muted); }
  .btn-cyan {
    background: var(--cyan); color: white;
    box-shadow: 0 2px 8px var(--cyan-glow), 0 1px 2px rgba(0,0,0,0.1);
  }
  .btn-cyan:hover { filter: brightness(1.05); box-shadow: 0 4px 12px var(--cyan-glow), 0 1px 2px rgba(0,0,0,0.1); }

  .icon-btn {
    width: 36px; height: 36px; border-radius: 9px;
    background: transparent; border: 1px solid var(--border);
    color: var(--t3); cursor: pointer; display: flex;
    align-items: center; justify-content: center;
    transition: all var(--transition);
  }
  .icon-btn:hover { background: var(--cyan-muted); color: var(--cyan); border-color: rgba(6,182,212,0.2); }
  .icon-btn .badge {
    position: absolute; top: -3px; right: -3px;
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--cyan); border: 2px solid var(--surface);
  }

  /* ─── Layout ─── */
  .shell { display: flex; min-height: calc(100vh - 60px); }

  /* ─── Sidebar ─── */
  .sidebar {
    width: 240px; flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 20px 12px;
    display: flex; flex-direction: column;
    transition: background var(--transition);
  }
  .sidebar-section { margin-bottom: 24px; }
  .sidebar-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--t3); padding: 0 12px;
    margin-bottom: 6px;
  }
  .sidebar-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: var(--radius-sm);
    color: var(--t3); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all var(--transition);
    position: relative;
  }
  .sidebar-item:hover { background: var(--cyan-muted); color: var(--t1); }
  .sidebar-item.active {
    background: var(--cyan-muted); color: var(--cyan);
  }
  .sidebar-item.active::before {
    content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 18px; border-radius: 0 3px 3px 0;
    background: var(--cyan);
  }
  .sidebar-item svg { width: 18px; height: 18px; flex-shrink: 0; }

  .sidebar-divider { height: 1px; background: var(--border); margin: 16px 12px; }

  /* Sidebar footer — branding */
  .sidebar-footer {
    margin-top: auto; padding: 16px 12px;
    border-top: 1px solid var(--border);
  }
  .sidebar-version {
    font-size: 10px; color: var(--t3); font-family: var(--mono);
    display: flex; align-items: center; gap: 6px;
  }
  .sidebar-version .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }

  /* ─── Main Content ─── */
  .main { flex: 1; padding: 28px; overflow-y: auto; position: relative; }

  /* Background ambient glow */
  .main::before {
    content: ''; position: fixed; top: -200px; right: -200px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, var(--cyan-glow) 0%, transparent 70%);
    pointer-events: none; z-index: 0; opacity: 0.3;
  }

  .page-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 28px; position: relative; z-index: 1;
  }
  .page-title {
    font-size: 24px; font-weight: 700; letter-spacing: -0.4px;
    animation: fadeSlideIn 0.6s var(--ease-out) both;
  }
  .page-subtitle {
    font-size: 13px; color: var(--t3); margin-top: 4px;
    display: flex; align-items: center; gap: 8px;
    animation: fadeSlideIn 0.6s var(--ease-out) 0.05s both;
  }
  .sync-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--green);
    animation: pulse 2s ease-in-out infinite;
  }

  .greeting {
    font-size: 13px; color: var(--t3); margin-bottom: 4px;
    font-weight: 500;
    animation: fadeSlideIn 0.6s var(--ease-out) both;
  }
  .greeting span { color: var(--cyan); font-weight: 600; }

  /* ─── KPI Stat Cards ─── */
  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    margin-bottom: 24px; position: relative; z-index: 1;
  }
  .stat-card {
    padding: 22px;
    animation: cardReveal 0.6s var(--ease-out) both;
  }
  .stat-card:nth-child(1) { animation-delay: 0.0s; }
  .stat-card:nth-child(2) { animation-delay: 0.06s; }
  .stat-card:nth-child(3) { animation-delay: 0.12s; }
  .stat-card:nth-child(4) { animation-delay: 0.18s; }

  .stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .stat-label {
    font-size: 12px; color: var(--t3); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.04em;
    display: flex; align-items: center; gap: 8px;
  }
  .stat-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .stat-icon svg { width: 14px; height: 14px; }

  .stat-value {
    font-size: 30px; font-weight: 700; letter-spacing: -1px;
    font-family: var(--mono); line-height: 1;
  }
  .stat-change {
    font-size: 12px; font-weight: 600; margin-top: 8px;
    display: flex; align-items: center; gap: 4px;
  }
  .stat-change.up { color: var(--green); }
  .stat-change.down { color: var(--red); }

  .stat-sparkline {
    position: absolute; bottom: 0; left: 0; right: 0; height: 40px; opacity: 0.15;
    overflow: hidden; border-radius: 0 0 var(--radius) var(--radius);
  }
  .stat-sparkline svg { width: 100%; height: 100%; }

  /* ─── Chart Cards ─── */
  .charts-grid {
    display: grid; grid-template-columns: 5fr 3fr; gap: 16px;
    margin-bottom: 24px; position: relative; z-index: 1;
  }
  .chart-card {
    padding: 24px;
    animation: cardReveal 0.6s var(--ease-out) 0.24s both;
  }
  .chart-card:nth-child(2) { animation-delay: 0.3s; }

  .chart-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .chart-title { font-size: 14px; font-weight: 700; letter-spacing: -0.2px; }
  .chart-badge {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.04em; padding: 4px 10px; border-radius: 6px;
    display: flex; align-items: center; gap: 5px;
  }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; animation: pulse 2s ease-in-out infinite; }

  /* Sparkline chart */
  .chart-area { width: 100%; height: 180px; position: relative; }
  .chart-area svg { width: 100%; height: 100%; }

  /* Chart labels */
  .chart-x-labels {
    display: flex; justify-content: space-between;
    padding: 10px 4px 0; font-size: 10px; color: var(--t3);
    font-family: var(--mono); font-weight: 500;
  }

  /* Account list */
  .account-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0; border-bottom: 1px solid var(--border);
    transition: all var(--transition);
  }
  .account-row:last-child { border-bottom: none; }
  .account-row:hover { padding-left: 6px; }
  .account-info { display: flex; align-items: center; gap: 12px; }
  .account-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; font-family: var(--mono);
  }
  .account-name { font-size: 13px; font-weight: 600; }
  .account-num { font-size: 11px; color: var(--t3); font-family: var(--mono); }
  .account-bal { font-size: 15px; font-weight: 700; font-family: var(--mono); letter-spacing: -0.5px; }

  /* ─── Bottom Grid ─── */
  .bottom-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;
    position: relative; z-index: 1;
  }
  .bottom-card {
    padding: 24px;
    animation: cardReveal 0.6s var(--ease-out) 0.36s both;
  }
  .bottom-card:nth-child(2) { animation-delay: 0.42s; }
  .bottom-card:nth-child(3) { animation-delay: 0.48s; }

  /* Activity feed */
  .activity-item {
    display: flex; gap: 12px; padding: 12px 0;
    border-bottom: 1px solid var(--border);
    transition: all var(--transition);
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-item:hover { padding-left: 4px; }
  .activity-icon {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 12px;
  }
  .activity-text { font-size: 12px; color: var(--t2); line-height: 1.6; }
  .activity-text strong { color: var(--t1); font-weight: 600; }
  .activity-time { font-size: 10px; color: var(--t3); margin-top: 3px; font-family: var(--mono); }

  /* Forecast bars */
  .forecast-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .forecast-row:last-child { border-bottom: none; }
  .forecast-label { font-size: 12px; color: var(--t2); width: 70px; font-weight: 500; }
  .forecast-bar-wrap {
    flex: 1; height: 8px; border-radius: 4px;
    background: var(--elevated); overflow: hidden;
  }
  .forecast-bar {
    height: 100%; border-radius: 4px;
    transition: width 1s var(--ease-out);
    position: relative;
  }
  .forecast-bar::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2));
    border-radius: 4px;
  }
  .forecast-val {
    font-size: 13px; font-weight: 700; font-family: var(--mono);
    min-width: 65px; text-align: right; letter-spacing: -0.3px;
  }

  /* Alerts */
  .alert-item {
    padding: 12px 14px; border-radius: var(--radius-sm);
    margin-bottom: 8px; font-size: 12px; font-weight: 500;
    display: flex; align-items: flex-start; gap: 10px;
    transition: all var(--transition); line-height: 1.5;
    border: 1px solid transparent;
  }
  .alert-item:hover { transform: translateX(2px); }
  .alert-icon {
    width: 22px; height: 22px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 10px; font-weight: 800;
  }

  /* ─── Customize Panel ─── */
  .customize-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
  }
  .customize-overlay.open { opacity: 1; pointer-events: all; }

  .customize-panel {
    position: fixed; top: 0; right: -440px; z-index: 201;
    width: 420px; height: 100vh;
    background: var(--surface);
    border-left: 1px solid var(--border);
    box-shadow: -12px 0 50px rgba(0,0,0,0.3);
    transition: right 0.4s var(--ease-out);
    overflow-y: auto; padding: 32px;
  }
  .customize-panel.open { right: 0; }

  .panel-header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 6px;
  }
  .panel-header-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--cyan-muted); border: 1px solid rgba(6,182,212,0.15);
    display: flex; align-items: center; justify-content: center;
    color: var(--cyan);
  }
  .panel-title { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
  .panel-sub { font-size: 12px; color: var(--t3); margin-bottom: 28px; margin-left: 48px; }
  .panel-close {
    position: absolute; top: 24px; right: 24px;
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--card); border: 1px solid var(--border);
    color: var(--t3); cursor: pointer; font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    transition: all var(--transition);
  }
  .panel-close:hover { border-color: var(--red); color: var(--red); background: var(--red-muted); }

  .panel-section { margin-bottom: 28px; }
  .panel-section-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--t3); margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .panel-section-label::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* Role presets */
  .preset-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .preset-btn {
    padding: 14px; border-radius: var(--radius-sm);
    background: var(--card); border: 1px solid var(--border);
    cursor: pointer; text-align: left; transition: all var(--transition);
    position: relative; overflow: hidden;
  }
  .preset-btn::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--cyan); transform: scaleX(0); transition: transform 0.3s ease;
  }
  .preset-btn:hover { border-color: var(--cyan); }
  .preset-btn:hover::before { transform: scaleX(1); }
  .preset-btn.active { border-color: var(--cyan); background: var(--cyan-muted); }
  .preset-btn.active::before { transform: scaleX(1); }
  .preset-btn-icon { font-size: 18px; margin-bottom: 6px; }
  .preset-btn-title { font-size: 13px; font-weight: 700; color: var(--t1); }
  .preset-btn-sub { font-size: 11px; color: var(--t3); margin-top: 2px; }

  /* Theme / Layout / Density options */
  .option-row { display: flex; gap: 8px; }
  .option-card {
    flex: 1; padding: 14px 10px; border-radius: var(--radius-sm);
    background: var(--card); border: 1px solid var(--border);
    cursor: pointer; text-align: center; transition: all var(--transition);
  }
  .option-card:hover { border-color: var(--cyan); }
  .option-card.active { border-color: var(--cyan); background: var(--cyan-muted); }
  .option-swatch { width: 40px; height: 28px; border-radius: 7px; margin: 0 auto 8px; border: 1px solid var(--border); }
  .option-label { font-size: 11px; font-weight: 600; color: var(--t2); }

  /* Accent dots */
  .accent-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .accent-dot {
    width: 34px; height: 34px; border-radius: 50%;
    cursor: pointer; border: 3px solid transparent;
    transition: all var(--transition); position: relative;
  }
  .accent-dot:hover { transform: scale(1.15); }
  .accent-dot.active {
    border-color: var(--t1);
    box-shadow: 0 0 0 3px var(--bg), 0 0 12px var(--cyan-glow);
  }

  /* Widget toggles */
  .widget-list { display: flex; flex-direction: column; gap: 6px; }
  .widget-toggle {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-radius: var(--radius-sm);
    background: var(--card); border: 1px solid var(--border);
    transition: all var(--transition);
  }
  .widget-toggle:hover { border-color: var(--border-hover); }
  .widget-toggle-info { display: flex; align-items: center; gap: 10px; }
  .widget-toggle-icon {
    width: 28px; height: 28px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700;
  }
  .widget-toggle-name { font-size: 13px; font-weight: 500; }

  .switch {
    width: 40px; height: 22px; border-radius: 11px;
    background: var(--elevated); border: 1px solid var(--border);
    cursor: pointer; position: relative; transition: all var(--transition);
    flex-shrink: 0;
  }
  .switch.on { background: var(--cyan); border-color: var(--cyan); }
  .switch::after {
    content: ''; position: absolute; top: 2px; left: 2px;
    width: 16px; height: 16px; border-radius: 50%;
    background: white; transition: transform var(--transition);
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .switch.on::after { transform: translateX(18px); }

  /* Widget hidden */
  .widget-hidden { display: none !important; }

  /* Layout variants */
  .layout-compact .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .layout-compact .charts-grid { grid-template-columns: 1fr; }
  .layout-compact .bottom-grid { grid-template-columns: 1fr 1fr; }
  .layout-wide .charts-grid { grid-template-columns: 3fr 1fr; }

  .density-compact .stat-card { padding: 16px; }
  .density-compact .chart-card,
  .density-compact .bottom-card { padding: 18px; }
  .density-compact .stats-grid,
  .density-compact .charts-grid,
  .density-compact .bottom-grid { gap: 10px; }
  .density-compact .stat-value { font-size: 24px; }

  /* ─── Animations ─── */
  @keyframes fadeSlideIn {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes cardReveal {
    0% { opacity: 0; transform: translateY(16px) scale(0.97); filter: blur(4px); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes drawLine {
    0% { stroke-dashoffset: 600; }
    100% { stroke-dashoffset: 0; }
  }

  /* Toast */
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px);
    background: var(--card); border: 1px solid rgba(6,182,212,0.2);
    color: var(--t1); padding: 12px 24px; border-radius: 12px;
    font-size: 13px; font-weight: 600; z-index: 300;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3), 0 0 20px var(--cyan-glow);
    opacity: 0; transition: all 0.4s var(--ease-out);
    display: flex; align-items: center; gap: 8px;
    backdrop-filter: blur(12px);
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* ─── Scroll Progress ─── */
  .scroll-progress {
    position: fixed; top: 60px; left: 0; height: 2px; z-index: 99;
    background: linear-gradient(90deg, var(--cyan), var(--purple));
    transition: width 0.1s linear;
    box-shadow: 0 0 8px var(--cyan-glow);
  }

  /* ─── Responsive ─── */
  @media (max-width: 1100px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .bottom-grid { grid-template-columns: 1fr; }
    .topbar-center { display: none; }
  }
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .stats-grid { grid-template-columns: 1fr; }
    .charts-grid { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- Scroll Progress -->
<div class="scroll-progress" id="scrollProgress" style="width: 0%"></div>

<!-- Top Bar -->
<div class="topbar">
  <div class="topbar-left">
    <div class="logo-mark">
      <svg width="36" height="36" viewBox="0 0 512 512">
        <defs>
          <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1a8fa8"/>
            <stop offset="40%" stop-color="#0e7490"/>
            <stop offset="100%" stop-color="#5b5bd6"/>
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="112" fill="url(#logoBg)"/>
        <path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/>
        <circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/>
        <rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/>
        <circle cx="256" cy="260" r="8" fill="white" fill-opacity="0.95"/>
        <path d="M232 340 L252 358 L288 316" fill="none" stroke="white" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.7"/>
      </svg>
    </div>
    <span class="logo-text">Vaultline</span>
  </div>

  <div class="topbar-center">
    <button class="topbar-tab active" onclick="switchView('overview', this)">Overview</button>
    <button class="topbar-tab" onclick="switchView('analytics', this)">Analytics</button>
    <button class="topbar-tab" onclick="switchView('operations', this)">Operations</button>
  </div>

  <div class="topbar-right">
    <div class="icon-btn" style="position:relative" onclick="showToast('No new notifications')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <div class="badge"></div>
    </div>
    <button class="btn btn-ghost" onclick="togglePanel()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7.07-3.93 4.24-4.24m5.66-5.66 4.24-4.24M1 12h6m6 0h6m-3.93 7.07-4.24-4.24m-5.66-5.66L3.93 4.93"/></svg>
      Customize
    </button>
    <button class="btn btn-cyan" onclick="showToast('Layout saved successfully')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
      Save Layout
    </button>
  </div>
</div>

<div class="shell">
  <!-- Sidebar -->
  <div class="sidebar">
    <div class="sidebar-section">
      <div class="sidebar-label">Treasury</div>
      <div class="sidebar-item active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        Dashboard
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Cash Position
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Forecasting
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Payments
      </div>
    </div>
    <div class="sidebar-divider"></div>
    <div class="sidebar-section">
      <div class="sidebar-label">Intelligence</div>
      <div class="sidebar-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Reports
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Insights
      </div>
    </div>
    <div class="sidebar-divider"></div>
    <div class="sidebar-section">
      <div class="sidebar-label">System</div>
      <div class="sidebar-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Security
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68c.31-.58.5-1.25.5-1.95V3a2 2 0 1 1 4 0c0 .7.19 1.37.5 1.95a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.58.31 1.25.5 1.95.5H21a2 2 0 1 1 0 4h-.27c-.7 0-1.37.19-1.95.5z"/></svg>
        Settings
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-version">
        <span class="dot"></span>
        v2.4.1 &middot; All systems nominal
      </div>
    </div>
  </div>

  <!-- Main Dashboard -->
  <div class="main" id="dashboardMain">
    <div class="page-header">
      <div>
        <div class="greeting">Good afternoon, <span id="userName">Jane</span></div>
        <div class="page-title">Treasury Dashboard</div>
        <div class="page-subtitle"><span class="sync-dot"></span> Synced 2 min ago &middot; 4 accounts connected</div>
      </div>
    </div>

    <!-- KPI Stats -->
    <div class="stats-grid" id="statsGrid">
      <div class="glass-card stat-card" data-widget="total-cash">
        <div class="stat-header">
          <div class="stat-label">
            <div class="stat-icon" style="background:var(--cyan-muted);color:var(--cyan);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            Total Cash
          </div>
        </div>
        <div class="stat-value" style="color:var(--cyan)">$24.8M</div>
        <div class="stat-change up">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
          +3.2% vs last month
        </div>
      </div>

      <div class="glass-card stat-card" data-widget="net-flow">
        <div class="stat-header">
          <div class="stat-label">
            <div class="stat-icon" style="background:var(--green-muted);color:var(--green);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            Net Cash Flow
          </div>
        </div>
        <div class="stat-value" style="color:var(--green)">+$1.4M</div>
        <div class="stat-change up">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
          +12.8% vs prior period
        </div>
      </div>

      <div class="glass-card stat-card" data-widget="payables">
        <div class="stat-header">
          <div class="stat-label">
            <div class="stat-icon" style="background:var(--amber-muted);color:var(--amber);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            Payables Due
          </div>
        </div>
        <div class="stat-value" style="color:var(--amber)">$3.1M</div>
        <div class="stat-change down">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
          +8.4% vs last month
        </div>
      </div>

      <div class="glass-card stat-card" data-widget="forecast-accuracy">
        <div class="stat-header">
          <div class="stat-label">
            <div class="stat-icon" style="background:var(--purple-muted);color:var(--purple);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            Forecast Accuracy
          </div>
        </div>
        <div class="stat-value" style="color:var(--purple)">94.7%</div>
        <div class="stat-change up">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
          +1.3pp improvement
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="charts-grid" id="chartsGrid">
      <div class="glass-card glass-card-glow chart-card" data-widget="cash-trend">
        <div class="chart-header">
          <div class="chart-title">Cash Position Trend</div>
          <span class="chart-badge" style="background:var(--cyan-muted);color:var(--cyan);"><span class="badge-dot" style="background:var(--cyan)"></span> Live</span>
        </div>
        <div class="chart-area">
          <svg viewBox="0 0 500 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:var(--cyan);stop-opacity:0.25"/>
                <stop offset="100%" style="stop-color:var(--cyan);stop-opacity:0.01"/>
              </linearGradient>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0891B2"/>
                <stop offset="50%" stop-color="#06B6D4"/>
                <stop offset="100%" stop-color="#8B5CF6"/>
              </linearGradient>
            </defs>
            <!-- Grid lines -->
            <line x1="0" y1="45" x2="500" y2="45" stroke="var(--border)" stroke-width="1"/>
            <line x1="0" y1="90" x2="500" y2="90" stroke="var(--border)" stroke-width="1"/>
            <line x1="0" y1="135" x2="500" y2="135" stroke="var(--border)" stroke-width="1"/>
            <!-- Area fill -->
            <path d="M0,130 C40,125 70,110 120,95 C170,80 190,100 250,65 C310,30 350,50 400,25 C450,10 475,18 500,8 L500,180 L0,180 Z" fill="url(#chartGrad)"/>
            <!-- Line -->
            <path d="M0,130 C40,125 70,110 120,95 C170,80 190,100 250,65 C310,30 350,50 400,25 C450,10 475,18 500,8"
              fill="none" stroke="url(#lineGrad)" stroke-width="2.5" stroke-linecap="round"
              stroke-dasharray="600" style="animation: drawLine 2s ease-out forwards"/>
            <!-- Live dot -->
            <circle cx="500" cy="8" r="4" fill="var(--cyan)">
              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>
        <div class="chart-x-labels">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        </div>
      </div>

      <div class="glass-card chart-card" data-widget="accounts">
        <div class="chart-header">
          <div class="chart-title">Bank Accounts</div>
          <span class="chart-badge" style="background:var(--green-muted);color:var(--green);"><span class="badge-dot" style="background:var(--green)"></span> 4 Active</span>
        </div>
        <div class="account-row">
          <div class="account-info">
            <div class="account-icon" style="background:var(--cyan-muted);color:var(--cyan);">C</div>
            <div><div class="account-name">Chase Operating</div><div class="account-num">****4821</div></div>
          </div>
          <div class="account-bal" style="color:var(--cyan)">$12.4M</div>
        </div>
        <div class="account-row">
          <div class="account-info">
            <div class="account-icon" style="background:var(--purple-muted);color:var(--purple);">B</div>
            <div><div class="account-name">BofA Reserve</div><div class="account-num">****7193</div></div>
          </div>
          <div class="account-bal">$8.2M</div>
        </div>
        <div class="account-row">
          <div class="account-info">
            <div class="account-icon" style="background:var(--green-muted);color:var(--green);">S</div>
            <div><div class="account-name">SVB Growth</div><div class="account-num">****0356</div></div>
          </div>
          <div class="account-bal">$3.1M</div>
        </div>
        <div class="account-row">
          <div class="account-info">
            <div class="account-icon" style="background:var(--amber-muted);color:var(--amber);">W</div>
            <div><div class="account-name">Wells Fargo Payroll</div><div class="account-num">****8842</div></div>
          </div>
          <div class="account-bal">$1.1M</div>
        </div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="bottom-grid" id="bottomGrid">
      <div class="glass-card bottom-card" data-widget="activity">
        <div class="chart-header">
          <div class="chart-title">Activity Feed</div>
          <span class="chart-badge" style="background:var(--cyan-muted);color:var(--cyan);">Today</span>
        </div>
        <div class="activity-item">
          <div class="activity-icon" style="background:var(--green-muted);color:var(--green);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div class="activity-text"><strong>Wire transfer</strong> sent to Apex Logistics — $284,500</div>
            <div class="activity-time">12 min ago</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon" style="background:var(--cyan-muted);color:var(--cyan);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
          </div>
          <div>
            <div class="activity-text"><strong>Auto-reconciliation</strong> — 847 transactions matched</div>
            <div class="activity-time">28 min ago</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon" style="background:var(--amber-muted);color:var(--amber);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div>
            <div class="activity-text"><strong>Q2 forecast</strong> updated — variance reduced to 2.1%</div>
            <div class="activity-time">1 hr ago</div>
          </div>
        </div>
        <div class="activity-item">
          <div class="activity-icon" style="background:var(--purple-muted);color:var(--purple);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/></svg>
          </div>
          <div>
            <div class="activity-text"><strong>New connection</strong> — Wells Fargo Payroll verified</div>
            <div class="activity-time">3 hrs ago</div>
          </div>
        </div>
      </div>

      <div class="glass-card bottom-card" data-widget="forecast">
        <div class="chart-header">
          <div class="chart-title">30-Day Forecast</div>
        </div>
        <div class="forecast-row">
          <div class="forecast-label">Inflows</div>
          <div class="forecast-bar-wrap"><div class="forecast-bar" style="width:82%;background:var(--green)"></div></div>
          <div class="forecast-val" style="color:var(--green)">$6.8M</div>
        </div>
        <div class="forecast-row">
          <div class="forecast-label">Outflows</div>
          <div class="forecast-bar-wrap"><div class="forecast-bar" style="width:58%;background:var(--red)"></div></div>
          <div class="forecast-val" style="color:var(--red)">$4.7M</div>
        </div>
        <div class="forecast-row">
          <div class="forecast-label">Net</div>
          <div class="forecast-bar-wrap"><div class="forecast-bar" style="width:40%;background:var(--cyan)"></div></div>
          <div class="forecast-val" style="color:var(--cyan)">+$2.1M</div>
        </div>
        <div class="forecast-row">
          <div class="forecast-label">Confidence</div>
          <div class="forecast-bar-wrap"><div class="forecast-bar" style="width:94%;background:var(--purple)"></div></div>
          <div class="forecast-val" style="color:var(--purple)">94.7%</div>
        </div>
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border);">
          <div style="font-size:11px;color:var(--t3);font-weight:500;">Projected Balance</div>
          <div style="font-size:22px;font-weight:700;font-family:var(--mono);color:var(--cyan);letter-spacing:-1px;margin-top:4px;">$26.9M</div>
        </div>
      </div>

      <div class="glass-card bottom-card" data-widget="alerts">
        <div class="chart-header">
          <div class="chart-title">Alerts</div>
          <span class="chart-badge" style="background:var(--amber-muted);color:var(--amber);">3 Active</span>
        </div>
        <div class="alert-item" style="background:var(--amber-muted);border-color:rgba(245,158,11,0.1);">
          <div class="alert-icon" style="background:var(--amber);color:white;">!</div>
          <div>
            <div style="color:var(--t1);font-weight:600;">Payroll account below threshold</div>
            <div style="color:var(--t3);font-size:11px;margin-top:2px;">Balance dropped below $1.5M</div>
          </div>
        </div>
        <div class="alert-item" style="background:var(--red-muted);border-color:rgba(239,68,68,0.1);">
          <div class="alert-icon" style="background:var(--red);color:white;">!</div>
          <div>
            <div style="color:var(--t1);font-weight:600;">Unusual transaction flagged</div>
            <div style="color:var(--t3);font-size:11px;margin-top:2px;">$47K to unrecognized vendor</div>
          </div>
        </div>
        <div class="alert-item" style="background:var(--cyan-muted);border-color:rgba(6,182,212,0.1);">
          <div class="alert-icon" style="background:var(--cyan);color:white;">$</div>
          <div>
            <div style="color:var(--t1);font-weight:600;">Idle cash optimization</div>
            <div style="color:var(--t3);font-size:11px;margin-top:2px;">$2.8M available for reallocation</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Customize Panel -->
<div class="customize-overlay" id="overlay" onclick="togglePanel()"></div>
<div class="customize-panel" id="panel">
  <button class="panel-close" onclick="togglePanel()">&times;</button>
  <div class="panel-header">
    <div class="panel-header-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7.07-3.93 4.24-4.24m5.66-5.66 4.24-4.24M1 12h6m6 0h6m-3.93 7.07-4.24-4.24m-5.66-5.66L3.93 4.93"/></svg>
    </div>
    <div class="panel-title">Customize Dashboard</div>
  </div>
  <div class="panel-sub">Personalize your workspace to match how you work</div>

  <!-- Role Presets -->
  <div class="panel-section">
    <div class="panel-section-label">Quick Presets</div>
    <div class="preset-grid">
      <div class="preset-btn active" onclick="applyPreset('cfo', this)">
        <div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <div class="preset-btn-title">CFO</div>
        <div class="preset-btn-sub">High-level cash overview</div>
      </div>
      <div class="preset-btn" onclick="applyPreset('analyst', this)">
        <div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
        <div class="preset-btn-title">Treasury Analyst</div>
        <div class="preset-btn-sub">Detailed ops & flows</div>
      </div>
      <div class="preset-btn" onclick="applyPreset('controller', this)">
        <div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <div class="preset-btn-title">Controller</div>
        <div class="preset-btn-sub">Reconciliation focus</div>
      </div>
      <div class="preset-btn" onclick="applyPreset('vp', this)">
        <div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
        <div class="preset-btn-title">VP Finance</div>
        <div class="preset-btn-sub">Forecasting & strategy</div>
      </div>
    </div>
  </div>

  <!-- Theme -->
  <div class="panel-section">
    <div class="panel-section-label">Theme</div>
    <div class="option-row">
      <div class="option-card" id="themeDark" onclick="setTheme('dark', this)">
        <div class="option-swatch" style="background:#0B1121;"></div>
        <div class="option-label">Dark</div>
      </div>
      <div class="option-card active" id="themeLight" onclick="setTheme('light', this)">
        <div class="option-swatch" style="background:#F8FAFC;border-color:#e2e8f0;"></div>
        <div class="option-label">Light</div>
      </div>
      <div class="option-card" id="themeMidnight" onclick="setTheme('midnight', this)">
        <div class="option-swatch" style="background:linear-gradient(135deg,#0c1445,#1a1040);"></div>
        <div class="option-label">Midnight</div>
      </div>
    </div>
  </div>

  <!-- Accent Color -->
  <div class="panel-section">
    <div class="panel-section-label">Accent Color</div>
    <div class="accent-row">
      <div class="accent-dot active" style="background:#06B6D4" onclick="setAccent('#06B6D4',this)"></div>
      <div class="accent-dot" style="background:#8B5CF6" onclick="setAccent('#8B5CF6',this)"></div>
      <div class="accent-dot" style="background:#10B981" onclick="setAccent('#10B981',this)"></div>
      <div class="accent-dot" style="background:#3B82F6" onclick="setAccent('#3B82F6',this)"></div>
      <div class="accent-dot" style="background:#F59E0B" onclick="setAccent('#F59E0B',this)"></div>
      <div class="accent-dot" style="background:#EC4899" onclick="setAccent('#EC4899',this)"></div>
      <div class="accent-dot" style="background:#EF4444" onclick="setAccent('#EF4444',this)"></div>
    </div>
  </div>

  <!-- Layout -->
  <div class="panel-section">
    <div class="panel-section-label">Layout</div>
    <div class="option-row">
      <div class="option-card active" onclick="setLayout('default', this)">
        <div class="option-label">Default</div>
      </div>
      <div class="option-card" onclick="setLayout('compact', this)">
        <div class="option-label">Compact</div>
      </div>
      <div class="option-card" onclick="setLayout('wide', this)">
        <div class="option-label">Wide</div>
      </div>
    </div>
  </div>

  <!-- Density -->
  <div class="panel-section">
    <div class="panel-section-label">Density</div>
    <div class="option-row" id="densityRow">
      <div class="option-card active" onclick="setDensity('comfortable', this)">
        <div class="option-label">Comfortable</div>
      </div>
      <div class="option-card" onclick="setDensity('compact', this)">
        <div class="option-label">Compact</div>
      </div>
    </div>
  </div>

  <!-- Widgets -->
  <div class="panel-section">
    <div class="panel-section-label">Widgets</div>
    <div class="widget-list" id="widgetToggles"></div>
  </div>

  <div style="padding-top:12px;border-top:1px solid var(--border);">
    <button class="btn btn-ghost" style="width:100%;justify-content:center;" onclick="resetAll()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
      Reset to Defaults
    </button>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast"></div>


` }} />
    </>
  );
}
