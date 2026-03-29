'use client';

import { useEffect } from 'react';

export default function V3DemoVaultlineTemplatesPage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --void: #030711; --deep: #070D19; --surface: #0B1120; --card: #0C1323;
    --elevated: #141E30; --border: rgba(30,48,80,0.4); --t1: #F1F5F9;
    --t2: #94A3B8; --t3: #64748B; --t4: #475569; --cyan: #22D3EE;
    --cyan-bright: #67E8F9; --green: #34D399; --red: #FB7185;
    --amber: #FBBF24; --purple: #818CF8; --gold: #F59E0B;
  }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--void); color: var(--t1); -webkit-font-smoothing: antialiased; }
  .mono { font-family: 'JetBrains Mono', monospace; }

  /* Header */
  .header { position: sticky; top: 0; z-index: 50; background: rgba(3,7,17,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 16px 40px; display: flex; align-items: center; justify-content: space-between; }
  .logo { font-size: 20px; font-weight: 900; letter-spacing: -0.02em; }
  .logo span { background: linear-gradient(90deg, var(--cyan), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .header-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--cyan); background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.15); padding: 4px 12px; border-radius: 999px; }
  .header-sub { font-size: 13px; color: var(--t3); }

  /* Hero */
  .hero { text-align: center; padding: 80px 40px 60px; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 60%); pointer-events: none; }
  .hero h1 { font-size: 48px; font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px; position: relative; }
  .hero p { font-size: 17px; color: var(--t3); max-width: 600px; margin: 0 auto; line-height: 1.6; position: relative; }

  /* Grid */
  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; max-width: 1200px; margin: 0 auto; padding: 0 40px 80px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

  /* Template Card */
  .tpl-card { border-radius: 20px; border: 1px solid var(--border); background: var(--card); overflow: hidden; transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94); position: relative; }
  .tpl-card:hover { border-color: rgba(34,211,238,0.3); transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(34,211,238,0.15); }
  .tpl-card::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 55%, transparent 70%); pointer-events: none; z-index: 2; }
  .tpl-card:hover::after { animation: shine 0.7s ease-out forwards; }
  @keyframes shine { 0% { left: -100%; } 100% { left: 120%; } }

  /* Dashboard Preview */
  .dash-preview { height: 320px; position: relative; overflow: hidden; border-bottom: 1px solid var(--border); }

  /* Card Info */
  .tpl-info { padding: 24px; }
  .tpl-info .tpl-tags { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
  .tpl-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 10px; border-radius: 999px; border: 1px solid; }
  .tpl-info h3 { font-size: 20px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.01em; }
  .tpl-info p { font-size: 14px; color: var(--t3); line-height: 1.5; }
  .tpl-features { display: flex; gap: 16px; margin-top: 14px; flex-wrap: wrap; }
  .tpl-feat { font-size: 11px; color: var(--t2); display: flex; align-items: center; gap: 4px; }
  .tpl-feat::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--cyan); flex-shrink: 0; }

  /* Dashboard Mini Elements */
  .d-sidebar { position: absolute; left: 0; top: 0; bottom: 0; width: 52px; border-right: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; padding-top: 14px; gap: 10px; }
  .d-sidebar .d-logo { width: 28px; height: 28px; border-radius: 8px; margin-bottom: 8px; }
  .d-sidebar .d-nav-dot { width: 8px; height: 8px; border-radius: 4px; opacity: 0.3; }
  .d-sidebar .d-nav-dot.active { opacity: 1; width: 20px; border-radius: 4px; }
  .d-topbar { position: absolute; top: 0; left: 52px; right: 0; height: 42px; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 16px; gap: 8px; }
  .d-topbar .d-title { font-size: 12px; font-weight: 700; }
  .d-topbar .d-breadcrumb { font-size: 9px; color: var(--t3); margin-left: auto; }
  .d-content { position: absolute; top: 42px; left: 52px; right: 0; bottom: 0; padding: 12px; overflow: hidden; }

  /* KPI Cards */
  .d-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; }
  .d-kpi { border-radius: 10px; border: 1px solid var(--border); padding: 10px; }
  .d-kpi-label { font-size: 7px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--t3); margin-bottom: 4px; }
  .d-kpi-val { font-size: 16px; font-weight: 800; }
  .d-kpi-change { font-size: 8px; margin-top: 2px; }

  /* Chart placeholder */
  .d-chart { border-radius: 10px; border: 1px solid var(--border); height: 100px; position: relative; overflow: hidden; margin-bottom: 10px; }
  .d-chart-bars { display: flex; align-items: flex-end; gap: 3px; height: 60px; padding: 0 12px; position: absolute; bottom: 20px; left: 0; right: 0; }
  .d-chart-bar { flex: 1; border-radius: 3px 3px 0 0; min-width: 4px; transition: height 0.4s ease; }
  .d-chart-line { position: absolute; bottom: 48px; left: 12px; right: 12px; height: 2px; border-radius: 1px; }
  .d-chart-label { position: absolute; top: 8px; left: 12px; font-size: 9px; font-weight: 700; }

  /* Mini table */
  .d-table { border-radius: 8px; border: 1px solid var(--border); overflow: hidden; }
  .d-table-head { display: grid; padding: 6px 10px; font-size: 7px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--t3); border-bottom: 1px solid var(--border); }
  .d-table-row { display: grid; padding: 5px 10px; font-size: 8px; border-bottom: 1px solid rgba(30,48,80,0.2); }
  .d-table-row:last-child { border-bottom: none; }

  /* Status bar */
  .d-statusbar { position: absolute; bottom: 0; left: 52px; right: 0; height: 20px; border-top: 1px solid var(--border); display: flex; align-items: center; padding: 0 12px; font-size: 8px; color: var(--t3); gap: 12px; }
  .d-live-dot { width: 5px; height: 5px; border-radius: 50%; animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 0.5; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }

  /* Specific theme overrides */
  .theme-midnight .dash-preview { background: #030711; }
  .theme-arctic .dash-preview { background: #F8FAFC; }
  .theme-arctic .d-topbar .d-title { color: #0F172A; }
  .theme-arctic .d-kpi-val { color: #0F172A; }
  .theme-arctic .d-kpi { background: #fff; border-color: rgba(15,23,42,0.08); }
  .theme-arctic .d-chart { background: #fff; border-color: rgba(15,23,42,0.08); }
  .theme-arctic .d-sidebar { background: #fff; border-color: rgba(15,23,42,0.08); }
  .theme-arctic .d-topbar { background: #fff; border-color: rgba(15,23,42,0.08); }
  .theme-arctic .d-statusbar { background: #F1F5F9; border-color: rgba(15,23,42,0.06); }
  .theme-arctic .d-content { background: #F8FAFC; }
  .theme-terminal .dash-preview { background: #0a0a0a; }
  .theme-terminal .d-sidebar { background: #0a0a0a; border-color: rgba(34,211,238,0.08); }
  .theme-terminal .d-topbar { border-color: rgba(34,211,238,0.08); }
  .theme-terminal .d-kpi { border-color: rgba(34,211,238,0.06); background: rgba(34,211,238,0.02); }
  .theme-executive .dash-preview { background: #0C0A1A; }
  .theme-executive .d-sidebar { background: #0C0A1A; border-color: rgba(129,140,248,0.12); }
  .theme-forest .dash-preview { background: #040D0A; }
  .theme-forest .d-sidebar { background: #040D0A; border-color: rgba(52,211,153,0.1); }
  .theme-warm .dash-preview { background: #FFFBF5; }
  .theme-warm .d-sidebar { background: #FFF8EE; border-color: rgba(180,140,100,0.12); }
  .theme-warm .d-topbar { background: #FFFBF5; border-color: rgba(180,140,100,0.1); color: #1C1410; }
  .theme-warm .d-topbar .d-title { color: #1C1410; }
  .theme-warm .d-kpi { background: #fff; border-color: rgba(180,140,100,0.1); }
  .theme-warm .d-kpi-val { color: #1C1410; }
  .theme-warm .d-kpi-label { color: #8B7355; }
  .theme-warm .d-chart { background: #fff; border-color: rgba(180,140,100,0.1); }
  .theme-warm .d-content { background: #FFFBF5; }
  .theme-warm .d-statusbar { background: #FFF8EE; border-color: rgba(180,140,100,0.08); }

  /* CTA */
  .cta-section { text-align: center; padding: 60px 40px 100px; }
  .cta-section h2 { font-size: 28px; font-weight: 800; margin-bottom: 12px; }
  .cta-section p { font-size: 15px; color: var(--t3); margin-bottom: 24px; }
  .cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; border-radius: 14px; background: linear-gradient(135deg, var(--cyan), #38bdf8); color: var(--void); font-size: 15px; font-weight: 700; border: none; cursor: pointer; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 4px 24px rgba(34,211,238,0.3); }
  .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(34,211,238,0.4); }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `

<!-- Header -->
<div class="header">
  <div style="display:flex;align-items:center;gap:16px;">
    <div class="logo">Vault<span>line</span></div>
    <span class="header-badge">Template Showcase</span>
  </div>
  <div class="header-sub">6 dashboard themes — choose your style</div>
</div>

<!-- Hero -->
<div class="hero">
  <h1>Pick your<br/>dashboard aesthetic.</h1>
  <p>Every Vaultline plan includes full theme customization. Choose a starting point that matches your brand, then fine-tune every color, font, and layout detail.</p>
</div>

<!-- Template Grid -->
<div class="grid">

  <!-- 1. MIDNIGHT (Default Dark) -->
  <div class="tpl-card theme-midnight">
    <div class="dash-preview">
      <div class="d-sidebar" style="background:var(--deep);">
        <div class="d-logo" style="background:linear-gradient(135deg,var(--cyan),var(--purple));border-radius:8px;"></div>
        <div class="d-nav-dot active" style="background:var(--cyan);"></div>
        <div class="d-nav-dot" style="background:var(--t3);"></div>
        <div class="d-nav-dot" style="background:var(--t3);"></div>
        <div class="d-nav-dot" style="background:var(--t3);"></div>
        <div class="d-nav-dot" style="background:var(--t3);"></div>
      </div>
      <div class="d-topbar" style="background:var(--void);">
        <div class="d-title" style="color:var(--t1);">Cash Position</div>
        <div class="d-breadcrumb mono">Dashboard / Cash Position</div>
      </div>
      <div class="d-content" style="background:var(--void);">
        <div class="d-kpis">
          <div class="d-kpi" style="background:var(--card);">
            <div class="d-kpi-label mono">TOTAL CASH</div>
            <div class="d-kpi-val" style="color:var(--cyan);">$14.2M</div>
            <div class="d-kpi-change" style="color:var(--green);">+3.2%</div>
          </div>
          <div class="d-kpi" style="background:var(--card);">
            <div class="d-kpi-label mono">NET FLOW</div>
            <div class="d-kpi-val" style="color:var(--green);">+$892K</div>
            <div class="d-kpi-change" style="color:var(--green);">+12.4%</div>
          </div>
          <div class="d-kpi" style="background:var(--card);">
            <div class="d-kpi-label mono">RUNWAY</div>
            <div class="d-kpi-val" style="color:var(--purple);">18.4 mo</div>
            <div class="d-kpi-change" style="color:var(--t3);">Stable</div>
          </div>
          <div class="d-kpi" style="background:var(--card);">
            <div class="d-kpi-label mono">ACCURACY</div>
            <div class="d-kpi-val" style="color:var(--amber);">94.7%</div>
            <div class="d-kpi-change" style="color:var(--green);">+1.8pp</div>
          </div>
        </div>
        <div class="d-chart" style="background:var(--card);">
          <div class="d-chart-label" style="color:var(--t1);">30-Day Cash Flow</div>
          <div class="d-chart-bars">
            <div class="d-chart-bar" style="height:35px;background:rgba(52,211,153,0.4);"></div>
            <div class="d-chart-bar" style="height:28px;background:rgba(251,113,133,0.3);"></div>
            <div class="d-chart-bar" style="height:42px;background:rgba(52,211,153,0.4);"></div>
            <div class="d-chart-bar" style="height:20px;background:rgba(251,113,133,0.3);"></div>
            <div class="d-chart-bar" style="height:50px;background:rgba(52,211,153,0.4);"></div>
            <div class="d-chart-bar" style="height:32px;background:rgba(251,113,133,0.3);"></div>
            <div class="d-chart-bar" style="height:38px;background:rgba(52,211,153,0.4);"></div>
            <div class="d-chart-bar" style="height:25px;background:rgba(251,113,133,0.3);"></div>
            <div class="d-chart-bar" style="height:45px;background:rgba(52,211,153,0.4);"></div>
            <div class="d-chart-bar" style="height:30px;background:rgba(251,113,133,0.3);"></div>
            <div class="d-chart-bar" style="height:55px;background:rgba(52,211,153,0.4);"></div>
            <div class="d-chart-bar" style="height:22px;background:rgba(251,113,133,0.3);"></div>
          </div>
          <div class="d-chart-line" style="background:var(--cyan);"></div>
        </div>
      </div>
      <div class="d-statusbar" style="background:rgba(3,7,17,0.8);">
        <div class="d-live-dot" style="background:var(--green);box-shadow:0 0 6px var(--green);"></div>
        <span class="mono">LIVE</span>
        <span class="mono">4 ACCOUNTS</span>
        <span class="mono">SYNC: OK</span>
      </div>
    </div>
    <div class="tpl-info">
      <div class="tpl-tags">
        <span class="tpl-tag" style="color:var(--cyan);border-color:rgba(34,211,238,0.2);background:rgba(34,211,238,0.06);">DEFAULT</span>
        <span class="tpl-tag" style="color:var(--purple);border-color:rgba(129,140,248,0.2);background:rgba(129,140,248,0.06);">DARK</span>
      </div>
      <h3>Midnight</h3>
      <p>The signature Vaultline aesthetic. Deep navy with cyan accents, glass blur surfaces, and terminal-grade typography. Professional and modern.</p>
      <div class="tpl-features">
        <span class="tpl-feat">Glass blur cards</span>
        <span class="tpl-feat">Cyan accent system</span>
        <span class="tpl-feat">Terminal status bar</span>
        <span class="tpl-feat">Noise texture overlay</span>
      </div>
    </div>
  </div>

  <!-- 2. ARCTIC (Light) -->
  <div class="tpl-card theme-arctic">
    <div class="dash-preview">
      <div class="d-sidebar">
        <div class="d-logo" style="background:linear-gradient(135deg,#0891B2,#7C3AED);border-radius:8px;"></div>
        <div class="d-nav-dot active" style="background:#0891B2;"></div>
        <div class="d-nav-dot" style="background:#CBD5E1;"></div>
        <div class="d-nav-dot" style="background:#CBD5E1;"></div>
        <div class="d-nav-dot" style="background:#CBD5E1;"></div>
      </div>
      <div class="d-topbar">
        <div class="d-title">Cash Position</div>
        <div class="d-breadcrumb mono" style="color:#94A3B8;">Dashboard / Cash Position</div>
      </div>
      <div class="d-content">
        <div class="d-kpis">
          <div class="d-kpi">
            <div class="d-kpi-label mono" style="color:#94A3B8;">TOTAL CASH</div>
            <div class="d-kpi-val" style="color:#0891B2;">$14.2M</div>
            <div class="d-kpi-change" style="color:#059669;">+3.2%</div>
          </div>
          <div class="d-kpi">
            <div class="d-kpi-label mono" style="color:#94A3B8;">NET FLOW</div>
            <div class="d-kpi-val" style="color:#059669;">+$892K</div>
            <div class="d-kpi-change" style="color:#059669;">+12.4%</div>
          </div>
          <div class="d-kpi">
            <div class="d-kpi-label mono" style="color:#94A3B8;">RUNWAY</div>
            <div class="d-kpi-val" style="color:#7C3AED;">18.4 mo</div>
            <div class="d-kpi-change" style="color:#94A3B8;">Stable</div>
          </div>
          <div class="d-kpi">
            <div class="d-kpi-label mono" style="color:#94A3B8;">ACCURACY</div>
            <div class="d-kpi-val" style="color:#D97706;">94.7%</div>
            <div class="d-kpi-change" style="color:#059669;">+1.8pp</div>
          </div>
        </div>
        <div class="d-chart">
          <div class="d-chart-label" style="color:#0F172A;">30-Day Cash Flow</div>
          <div class="d-chart-bars">
            <div class="d-chart-bar" style="height:35px;background:rgba(5,150,105,0.5);"></div>
            <div class="d-chart-bar" style="height:28px;background:rgba(225,29,72,0.35);"></div>
            <div class="d-chart-bar" style="height:42px;background:rgba(5,150,105,0.5);"></div>
            <div class="d-chart-bar" style="height:20px;background:rgba(225,29,72,0.35);"></div>
            <div class="d-chart-bar" style="height:50px;background:rgba(5,150,105,0.5);"></div>
            <div class="d-chart-bar" style="height:32px;background:rgba(225,29,72,0.35);"></div>
            <div class="d-chart-bar" style="height:38px;background:rgba(5,150,105,0.5);"></div>
            <div class="d-chart-bar" style="height:25px;background:rgba(225,29,72,0.35);"></div>
            <div class="d-chart-bar" style="height:45px;background:rgba(5,150,105,0.5);"></div>
            <div class="d-chart-bar" style="height:30px;background:rgba(225,29,72,0.35);"></div>
            <div class="d-chart-bar" style="height:55px;background:rgba(5,150,105,0.5);"></div>
            <div class="d-chart-bar" style="height:22px;background:rgba(225,29,72,0.35);"></div>
          </div>
          <div class="d-chart-line" style="background:#0891B2;"></div>
        </div>
      </div>
      <div class="d-statusbar">
        <div class="d-live-dot" style="background:#059669;box-shadow:0 0 6px #059669;"></div>
        <span class="mono" style="color:#94A3B8;">LIVE</span>
        <span class="mono" style="color:#94A3B8;">4 ACCOUNTS</span>
        <span class="mono" style="color:#059669;">SYNC: OK</span>
      </div>
    </div>
    <div class="tpl-info">
      <div class="tpl-tags">
        <span class="tpl-tag" style="color:#0891B2;border-color:rgba(8,145,178,0.2);background:rgba(8,145,178,0.06);">LIGHT</span>
        <span class="tpl-tag" style="color:#059669;border-color:rgba(5,150,105,0.2);background:rgba(5,150,105,0.06);">CLEAN</span>
      </div>
      <h3>Arctic</h3>
      <p>Crisp white surfaces with cool blue accents. Designed for teams who prefer a bright, airy workspace with maximum readability and minimal eye strain.</p>
      <div class="tpl-features">
        <span class="tpl-feat">White card surfaces</span>
        <span class="tpl-feat">Cool teal accents</span>
        <span class="tpl-feat">Subtle shadows</span>
        <span class="tpl-feat">High contrast data</span>
      </div>
    </div>
  </div>

  <!-- 3. TERMINAL -->
  <div class="tpl-card theme-terminal">
    <div class="dash-preview">
      <div class="d-sidebar">
        <div class="d-logo" style="background:var(--cyan);border-radius:4px;"></div>
        <div class="d-nav-dot active" style="background:var(--cyan);border-radius:2px;"></div>
        <div class="d-nav-dot" style="background:rgba(34,211,238,0.15);border-radius:2px;"></div>
        <div class="d-nav-dot" style="background:rgba(34,211,238,0.15);border-radius:2px;"></div>
        <div class="d-nav-dot" style="background:rgba(34,211,238,0.15);border-radius:2px;"></div>
      </div>
      <div class="d-topbar" style="background:#0a0a0a;">
        <div class="d-title mono" style="color:var(--cyan);font-size:11px;">CASH_POSITION.exe</div>
        <div class="d-breadcrumb mono" style="color:rgba(34,211,238,0.4);">pid:4821 | uptime:14d</div>
      </div>
      <div class="d-content" style="background:#0a0a0a;">
        <div class="d-kpis">
          <div class="d-kpi">
            <div class="d-kpi-label mono" style="color:rgba(34,211,238,0.5);">&gt; TOTAL_CASH</div>
            <div class="d-kpi-val mono" style="color:var(--cyan);font-size:14px;">$14,200,000</div>
            <div class="d-kpi-change mono" style="color:var(--green);">▲ 3.2%</div>
          </div>
          <div class="d-kpi">
            <div class="d-kpi-label mono" style="color:rgba(34,211,238,0.5);">&gt; NET_FLOW</div>
            <div class="d-kpi-val mono" style="color:var(--green);font-size:14px;">+$892,000</div>
            <div class="d-kpi-change mono" style="color:var(--green);">▲ 12.4%</div>
          </div>
          <div class="d-kpi">
            <div class="d-kpi-label mono" style="color:rgba(34,211,238,0.5);">&gt; RUNWAY</div>
            <div class="d-kpi-val mono" style="color:var(--amber);font-size:14px;">18.4 MONTHS</div>
            <div class="d-kpi-change mono" style="color:var(--t3);">— STABLE</div>
          </div>
          <div class="d-kpi">
            <div class="d-kpi-label mono" style="color:rgba(34,211,238,0.5);">&gt; ACCURACY</div>
            <div class="d-kpi-val mono" style="color:var(--purple);font-size:14px;">94.7%</div>
            <div class="d-kpi-change mono" style="color:var(--green);">▲ 1.8pp</div>
          </div>
        </div>
        <div class="d-chart" style="background:rgba(34,211,238,0.02);border-color:rgba(34,211,238,0.06);">
          <div class="d-chart-label mono" style="color:var(--cyan);font-size:8px;">&gt; CASHFLOW_30D [LIVE]</div>
          <div class="d-chart-bars">
            <div class="d-chart-bar" style="height:35px;background:rgba(34,211,238,0.25);"></div>
            <div class="d-chart-bar" style="height:28px;background:rgba(34,211,238,0.15);"></div>
            <div class="d-chart-bar" style="height:42px;background:rgba(34,211,238,0.25);"></div>
            <div class="d-chart-bar" style="height:20px;background:rgba(34,211,238,0.15);"></div>
            <div class="d-chart-bar" style="height:50px;background:rgba(34,211,238,0.25);"></div>
            <div class="d-chart-bar" style="height:32px;background:rgba(34,211,238,0.15);"></div>
            <div class="d-chart-bar" style="height:38px;background:rgba(34,211,238,0.25);"></div>
            <div class="d-chart-bar" style="height:25px;background:rgba(34,211,238,0.15);"></div>
            <div class="d-chart-bar" style="height:45px;background:rgba(34,211,238,0.30);"></div>
            <div class="d-chart-bar" style="height:30px;background:rgba(34,211,238,0.15);"></div>
            <div class="d-chart-bar" style="height:55px;background:rgba(34,211,238,0.30);"></div>
            <div class="d-chart-bar" style="height:22px;background:rgba(34,211,238,0.15);"></div>
          </div>
          <div class="d-chart-line" style="background:var(--cyan);height:1px;"></div>
        </div>
      </div>
      <div class="d-statusbar" style="background:#050505;border-color:rgba(34,211,238,0.06);">
        <div class="d-live-dot" style="background:var(--cyan);box-shadow:0 0 6px var(--cyan);"></div>
        <span class="mono" style="color:var(--cyan);">CONNECTED</span>
        <span class="mono" style="color:rgba(34,211,238,0.4);">4 STREAMS</span>
        <span class="mono" style="color:var(--green);">STATUS: NOMINAL</span>
      </div>
    </div>
    <div class="tpl-info">
      <div class="tpl-tags">
        <span class="tpl-tag" style="color:var(--cyan);border-color:rgba(34,211,238,0.2);background:rgba(34,211,238,0.06);">TERMINAL</span>
        <span class="tpl-tag" style="color:var(--green);border-color:rgba(52,211,153,0.2);background:rgba(52,211,153,0.06);">MONOSPACE</span>
      </div>
      <h3>Terminal</h3>
      <p>Pure monospace typography, scanline effects, and command-line aesthetics. For teams that want their treasury dashboard to feel like mission control.</p>
      <div class="tpl-features">
        <span class="tpl-feat">Full monospace type</span>
        <span class="tpl-feat">Scanline overlay</span>
        <span class="tpl-feat">Grid background</span>
        <span class="tpl-feat">Command-line status</span>
      </div>
    </div>
  </div>

  <!-- 4. EXECUTIVE (Purple) -->
  <div class="tpl-card theme-executive">
    <div class="dash-preview">
      <div class="d-sidebar">
        <div class="d-logo" style="background:linear-gradient(135deg,#818CF8,#A78BFA);border-radius:8px;"></div>
        <div class="d-nav-dot active" style="background:#818CF8;"></div>
        <div class="d-nav-dot" style="background:rgba(129,140,248,0.2);"></div>
        <div class="d-nav-dot" style="background:rgba(129,140,248,0.2);"></div>
        <div class="d-nav-dot" style="background:rgba(129,140,248,0.2);"></div>
      </div>
      <div class="d-topbar" style="background:#0C0A1A;border-color:rgba(129,140,248,0.08);">
        <div class="d-title" style="color:#E2E8F0;">Portfolio Overview</div>
        <div class="d-breadcrumb mono" style="color:rgba(129,140,248,0.5);">Executive / Overview</div>
      </div>
      <div class="d-content" style="background:#0C0A1A;">
        <div class="d-kpis">
          <div class="d-kpi" style="background:rgba(129,140,248,0.04);border-color:rgba(129,140,248,0.1);">
            <div class="d-kpi-label mono" style="color:rgba(129,140,248,0.6);">AUM</div>
            <div class="d-kpi-val" style="color:#818CF8;">$247M</div>
            <div class="d-kpi-change" style="color:#34D399;">+8.2%</div>
          </div>
          <div class="d-kpi" style="background:rgba(129,140,248,0.04);border-color:rgba(129,140,248,0.1);">
            <div class="d-kpi-label mono" style="color:rgba(129,140,248,0.6);">YIELD</div>
            <div class="d-kpi-val" style="color:#A78BFA;">4.8%</div>
            <div class="d-kpi-change" style="color:#34D399;">+0.3pp</div>
          </div>
          <div class="d-kpi" style="background:rgba(129,140,248,0.04);border-color:rgba(129,140,248,0.1);">
            <div class="d-kpi-label mono" style="color:rgba(129,140,248,0.6);">ENTITIES</div>
            <div class="d-kpi-val" style="color:#F1F5F9;">12</div>
            <div class="d-kpi-change" style="color:rgba(129,140,248,0.5);">Active</div>
          </div>
          <div class="d-kpi" style="background:rgba(129,140,248,0.04);border-color:rgba(129,140,248,0.1);">
            <div class="d-kpi-label mono" style="color:rgba(129,140,248,0.6);">RISK</div>
            <div class="d-kpi-val" style="color:#FBBF24;">Low</div>
            <div class="d-kpi-change" style="color:#34D399;">Improving</div>
          </div>
        </div>
        <div class="d-chart" style="background:rgba(129,140,248,0.03);border-color:rgba(129,140,248,0.08);">
          <div class="d-chart-label" style="color:#E2E8F0;">Quarterly Performance</div>
          <div class="d-chart-bars">
            <div class="d-chart-bar" style="height:30px;background:rgba(129,140,248,0.35);"></div>
            <div class="d-chart-bar" style="height:38px;background:rgba(129,140,248,0.4);"></div>
            <div class="d-chart-bar" style="height:35px;background:rgba(129,140,248,0.35);"></div>
            <div class="d-chart-bar" style="height:45px;background:rgba(129,140,248,0.45);"></div>
            <div class="d-chart-bar" style="height:40px;background:rgba(129,140,248,0.4);"></div>
            <div class="d-chart-bar" style="height:52px;background:rgba(129,140,248,0.5);"></div>
            <div class="d-chart-bar" style="height:48px;background:rgba(129,140,248,0.45);"></div>
            <div class="d-chart-bar" style="height:55px;background:rgba(129,140,248,0.5);"></div>
            <div class="d-chart-bar" style="height:42px;background:rgba(129,140,248,0.4);"></div>
            <div class="d-chart-bar" style="height:58px;background:rgba(129,140,248,0.55);"></div>
            <div class="d-chart-bar" style="height:50px;background:rgba(129,140,248,0.5);"></div>
            <div class="d-chart-bar" style="height:60px;background:rgba(129,140,248,0.55);"></div>
          </div>
          <div class="d-chart-line" style="background:#A78BFA;"></div>
        </div>
      </div>
      <div class="d-statusbar" style="background:#080618;border-color:rgba(129,140,248,0.06);">
        <div class="d-live-dot" style="background:#818CF8;box-shadow:0 0 6px #818CF8;"></div>
        <span class="mono" style="color:rgba(129,140,248,0.6);">LIVE</span>
        <span class="mono" style="color:rgba(129,140,248,0.4);">12 ENTITIES</span>
        <span class="mono" style="color:#34D399;">ALL SYNCED</span>
      </div>
    </div>
    <div class="tpl-info">
      <div class="tpl-tags">
        <span class="tpl-tag" style="color:var(--purple);border-color:rgba(129,140,248,0.2);background:rgba(129,140,248,0.06);">EXECUTIVE</span>
        <span class="tpl-tag" style="color:var(--gold);border-color:rgba(245,158,11,0.2);background:rgba(245,158,11,0.06);">PREMIUM</span>
      </div>
      <h3>Executive</h3>
      <p>Deep indigo with violet accents. Designed for board presentations, investor meetings, and C-suite dashboards. Elevated, confident, and unmistakably premium.</p>
      <div class="tpl-features">
        <span class="tpl-feat">Indigo palette</span>
        <span class="tpl-feat">Board-ready layouts</span>
        <span class="tpl-feat">Multi-entity view</span>
        <span class="tpl-feat">Risk indicators</span>
      </div>
    </div>
  </div>

  <!-- 5. FOREST (Green) -->
  <div class="tpl-card theme-forest">
    <div class="dash-preview">
      <div class="d-sidebar">
        <div class="d-logo" style="background:linear-gradient(135deg,#34D399,#059669);border-radius:8px;"></div>
        <div class="d-nav-dot active" style="background:#34D399;"></div>
        <div class="d-nav-dot" style="background:rgba(52,211,153,0.15);"></div>
        <div class="d-nav-dot" style="background:rgba(52,211,153,0.15);"></div>
        <div class="d-nav-dot" style="background:rgba(52,211,153,0.15);"></div>
      </div>
      <div class="d-topbar" style="background:#040D0A;border-color:rgba(52,211,153,0.08);">
        <div class="d-title" style="color:#D1FAE5;">Sustainability Treasury</div>
        <div class="d-breadcrumb mono" style="color:rgba(52,211,153,0.4);">ESG / Treasury</div>
      </div>
      <div class="d-content" style="background:#040D0A;">
        <div class="d-kpis">
          <div class="d-kpi" style="background:rgba(52,211,153,0.04);border-color:rgba(52,211,153,0.1);">
            <div class="d-kpi-label mono" style="color:rgba(52,211,153,0.6);">GREEN BONDS</div>
            <div class="d-kpi-val" style="color:#34D399;">$38.2M</div>
            <div class="d-kpi-change" style="color:#34D399;">+15.4%</div>
          </div>
          <div class="d-kpi" style="background:rgba(52,211,153,0.04);border-color:rgba(52,211,153,0.1);">
            <div class="d-kpi-label mono" style="color:rgba(52,211,153,0.6);">CO2 OFFSET</div>
            <div class="d-kpi-val" style="color:#6EE7B7;">2.4K t</div>
            <div class="d-kpi-change" style="color:#34D399;">On track</div>
          </div>
          <div class="d-kpi" style="background:rgba(52,211,153,0.04);border-color:rgba(52,211,153,0.1);">
            <div class="d-kpi-label mono" style="color:rgba(52,211,153,0.6);">ESG SCORE</div>
            <div class="d-kpi-val" style="color:#F1F5F9;">A+</div>
            <div class="d-kpi-change" style="color:#34D399;">Top 5%</div>
          </div>
          <div class="d-kpi" style="background:rgba(52,211,153,0.04);border-color:rgba(52,211,153,0.1);">
            <div class="d-kpi-label mono" style="color:rgba(52,211,153,0.6);">IMPACT</div>
            <div class="d-kpi-val" style="color:#FBBF24;">$4.1M</div>
            <div class="d-kpi-change" style="color:#34D399;">Allocated</div>
          </div>
        </div>
        <div class="d-chart" style="background:rgba(52,211,153,0.02);border-color:rgba(52,211,153,0.06);">
          <div class="d-chart-label" style="color:#D1FAE5;">Impact Investment Returns</div>
          <div class="d-chart-bars">
            <div class="d-chart-bar" style="height:25px;background:rgba(52,211,153,0.3);"></div>
            <div class="d-chart-bar" style="height:30px;background:rgba(52,211,153,0.35);"></div>
            <div class="d-chart-bar" style="height:35px;background:rgba(52,211,153,0.4);"></div>
            <div class="d-chart-bar" style="height:32px;background:rgba(52,211,153,0.38);"></div>
            <div class="d-chart-bar" style="height:40px;background:rgba(52,211,153,0.45);"></div>
            <div class="d-chart-bar" style="height:38px;background:rgba(52,211,153,0.42);"></div>
            <div class="d-chart-bar" style="height:45px;background:rgba(52,211,153,0.48);"></div>
            <div class="d-chart-bar" style="height:42px;background:rgba(52,211,153,0.45);"></div>
            <div class="d-chart-bar" style="height:50px;background:rgba(52,211,153,0.5);"></div>
            <div class="d-chart-bar" style="height:48px;background:rgba(52,211,153,0.48);"></div>
            <div class="d-chart-bar" style="height:55px;background:rgba(52,211,153,0.55);"></div>
            <div class="d-chart-bar" style="height:52px;background:rgba(52,211,153,0.52);"></div>
          </div>
          <div class="d-chart-line" style="background:#34D399;"></div>
        </div>
      </div>
      <div class="d-statusbar" style="background:#020806;border-color:rgba(52,211,153,0.06);">
        <div class="d-live-dot" style="background:#34D399;box-shadow:0 0 6px #34D399;"></div>
        <span class="mono" style="color:rgba(52,211,153,0.6);">LIVE</span>
        <span class="mono" style="color:rgba(52,211,153,0.3);">STRIPE CLIMATE: ACTIVE</span>
      </div>
    </div>
    <div class="tpl-info">
      <div class="tpl-tags">
        <span class="tpl-tag" style="color:var(--green);border-color:rgba(52,211,153,0.2);background:rgba(52,211,153,0.06);">SUSTAINABLE</span>
        <span class="tpl-tag" style="color:var(--amber);border-color:rgba(251,191,36,0.2);background:rgba(251,191,36,0.06);">ESG</span>
      </div>
      <h3>Forest</h3>
      <p>Deep emerald on black. Built for ESG-focused organizations and impact investors who want their dashboard to reflect their sustainability commitment.</p>
      <div class="tpl-features">
        <span class="tpl-feat">Green accent system</span>
        <span class="tpl-feat">ESG metrics built-in</span>
        <span class="tpl-feat">Carbon tracking</span>
        <span class="tpl-feat">Impact reporting</span>
      </div>
    </div>
  </div>

  <!-- 6. WARM CREAM -->
  <div class="tpl-card theme-warm">
    <div class="dash-preview">
      <div class="d-sidebar">
        <div class="d-logo" style="background:linear-gradient(135deg,#0E9AAA,#7C3AED);border-radius:8px;"></div>
        <div class="d-nav-dot active" style="background:#0E9AAA;"></div>
        <div class="d-nav-dot" style="background:rgba(180,140,100,0.2);"></div>
        <div class="d-nav-dot" style="background:rgba(180,140,100,0.2);"></div>
        <div class="d-nav-dot" style="background:rgba(180,140,100,0.2);"></div>
      </div>
      <div class="d-topbar">
        <div class="d-title">Cash Position</div>
        <div class="d-breadcrumb mono" style="color:#8B7355;">Dashboard / Cash Position</div>
      </div>
      <div class="d-content">
        <div class="d-kpis">
          <div class="d-kpi">
            <div class="d-kpi-label mono">TOTAL CASH</div>
            <div class="d-kpi-val" style="color:#0E9AAA;">$14.2M</div>
            <div class="d-kpi-change" style="color:#0E9AAA;">+3.2%</div>
          </div>
          <div class="d-kpi">
            <div class="d-kpi-label mono">NET FLOW</div>
            <div class="d-kpi-val" style="color:#059669;">+$892K</div>
            <div class="d-kpi-change" style="color:#059669;">+12.4%</div>
          </div>
          <div class="d-kpi">
            <div class="d-kpi-label mono">RUNWAY</div>
            <div class="d-kpi-val" style="color:#7C3AED;">18.4 mo</div>
            <div class="d-kpi-change" style="color:#8B7355;">Stable</div>
          </div>
          <div class="d-kpi">
            <div class="d-kpi-label mono">ACCURACY</div>
            <div class="d-kpi-val" style="color:#B45309;">94.7%</div>
            <div class="d-kpi-change" style="color:#059669;">+1.8pp</div>
          </div>
        </div>
        <div class="d-chart">
          <div class="d-chart-label" style="color:#1C1410;">30-Day Cash Flow</div>
          <div class="d-chart-bars">
            <div class="d-chart-bar" style="height:35px;background:rgba(14,154,170,0.35);"></div>
            <div class="d-chart-bar" style="height:28px;background:rgba(180,83,9,0.25);"></div>
            <div class="d-chart-bar" style="height:42px;background:rgba(14,154,170,0.35);"></div>
            <div class="d-chart-bar" style="height:20px;background:rgba(180,83,9,0.25);"></div>
            <div class="d-chart-bar" style="height:50px;background:rgba(14,154,170,0.35);"></div>
            <div class="d-chart-bar" style="height:32px;background:rgba(180,83,9,0.25);"></div>
            <div class="d-chart-bar" style="height:38px;background:rgba(14,154,170,0.35);"></div>
            <div class="d-chart-bar" style="height:25px;background:rgba(180,83,9,0.25);"></div>
            <div class="d-chart-bar" style="height:45px;background:rgba(14,154,170,0.35);"></div>
            <div class="d-chart-bar" style="height:30px;background:rgba(180,83,9,0.25);"></div>
            <div class="d-chart-bar" style="height:55px;background:rgba(14,154,170,0.4);"></div>
            <div class="d-chart-bar" style="height:22px;background:rgba(180,83,9,0.25);"></div>
          </div>
          <div class="d-chart-line" style="background:#0E9AAA;"></div>
        </div>
      </div>
      <div class="d-statusbar">
        <div class="d-live-dot" style="background:#0E9AAA;box-shadow:0 0 6px #0E9AAA;"></div>
        <span class="mono" style="color:#8B7355;">LIVE</span>
        <span class="mono" style="color:#8B7355;">4 ACCOUNTS</span>
        <span class="mono" style="color:#0E9AAA;">SYNC: OK</span>
      </div>
    </div>
    <div class="tpl-info">
      <div class="tpl-tags">
        <span class="tpl-tag" style="color:#B45309;border-color:rgba(180,83,9,0.2);background:rgba(180,83,9,0.06);">WARM</span>
        <span class="tpl-tag" style="color:#0E9AAA;border-color:rgba(14,154,170,0.2);background:rgba(14,154,170,0.06);">LIGHT</span>
      </div>
      <h3>Warm Cream</h3>
      <p>Soft cream backgrounds with warm teal accents. Feels approachable and inviting — perfect for teams transitioning from spreadsheet-based workflows who want something friendly.</p>
      <div class="tpl-features">
        <span class="tpl-feat">Cream palette</span>
        <span class="tpl-feat">Warm teal accents</span>
        <span class="tpl-feat">Soft shadows</span>
        <span class="tpl-feat">Welcoming UX</span>
      </div>
    </div>
  </div>

</div>

<!-- CTA -->
<div class="cta-section">
  <h2>Like what you see?</h2>
  <p>Every plan includes full theme customization. Start with any template and make it yours.</p>
  <a href="https://vaultline.app/signup" class="cta-btn">Get Started with Vaultline &rarr;</a>
</div>

` }} />
    </>
  );
}
