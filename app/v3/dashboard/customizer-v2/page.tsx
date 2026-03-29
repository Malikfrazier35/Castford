'use client';

import { useEffect, useRef } from 'react';

export default function V3DashboardCustomizerV2Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Clock
function updateClock(){const n=new Date();document.getElementById('clockDisplay').textContent=n.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});}
updateClock();setInterval(updateClock,60000);

// Templates data
const TPLS=[
  {id:'light',name:'Arctic Light',desc:'Clean white with blue accents',tags:[{l:'DEFAULT',c:'#3B82F6'},{l:'LIGHT',c:'#64748B'}],bg:'#F3F4F8',sidebar:'#fff',topbar:'#fff',kpi:'#fff',accent:'#3B82F6',text:'#0F172A',border:'rgba(15,23,42,0.08)',bars:[45,58,65,52,75,68,82,74,88]},
  {id:'midnight',name:'Midnight',desc:'Deep navy with cyan glow',tags:[{l:'DARK',c:'#818CF8'},{l:'POPULAR',c:'#34D399'}],bg:'#030711',sidebar:'#070D19',topbar:'#030711',kpi:'#0C1323',accent:'#22D3EE',text:'#F1F5F9',border:'rgba(30,48,80,0.4)',bars:[35,42,50,32,55,38,45,28,52]},
  {id:'warm',name:'Warm Sand',desc:'Cream tones, amber accents',tags:[{l:'LIGHT',c:'#D97706'},{l:'NEW',c:'#EC4899'}],bg:'#FFFBF5',sidebar:'#FFF8EE',topbar:'#FFFBF5',kpi:'#fff',accent:'#D97706',text:'#1C1410',border:'rgba(180,140,100,0.12)',bars:[60,55,70,48,65,72,58,80,62]},
  {id:'forest',name:'Forest',desc:'Deep emerald, green data viz',tags:[{l:'DARK',c:'#34D399'}],bg:'#040D0A',sidebar:'#040D0A',topbar:'#040D0A',kpi:'#0A1A14',accent:'#34D399',text:'#D1FAE5',border:'rgba(52,211,153,0.08)',bars:[40,52,48,65,58,72,55,68,78]},
  {id:'executive',name:'Executive',desc:'Deep violet, board-ready',tags:[{l:'DARK',c:'#818CF8'},{l:'NEW',c:'#FBBF24'}],bg:'#0C0A1A',sidebar:'#0C0A1A',topbar:'#0C0A1A',kpi:'#14102A',accent:'#818CF8',text:'#E2E0F0',border:'rgba(129,140,248,0.12)',bars:[50,62,55,70,65,78,72,82,75]},
  {id:'terminal',name:'Terminal',desc:'Black + cyan, monospace',tags:[{l:'DARK',c:'#22D3EE'},{l:'HACKER',c:'#34D399'}],bg:'#0a0a0a',sidebar:'#0a0a0a',topbar:'#0a0a0a',kpi:'#111',accent:'#22D3EE',text:'#E0E0E0',border:'rgba(34,211,238,0.06)',bars:[30,45,38,52,42,58,35,62,48]}
];

function openTemplates(){document.getElementById('tplModal').classList.add('open');renderTpls();}
function closeTemplates(){document.getElementById('tplModal').classList.remove('open');}

function renderTpls(){
  document.getElementById('tplGrid').innerHTML=TPLS.map(t=>\`
    <div class="tpl-card\${t.id==='light'?' selected':''}" onclick="this.parentElement.querySelectorAll('.tpl-card').forEach(c=>c.classList.remove('selected'));this.classList.add('selected');" style="position:relative;">
      <div class="tpl-mini" style="background:\${t.bg};">
        <div class="m-sidebar" style="background:\${t.sidebar};border-color:\${t.border};"></div>
        <div class="m-topbar" style="background:\${t.topbar};border-color:\${t.border};color:\${t.text};">Dashboard</div>
        <div class="m-content" style="background:\${t.bg};">
          <div class="m-kpis">
            <div class="m-kpi" style="background:\${t.kpi};border-color:\${t.border};"><div class="m-kpi-val" style="color:\${t.text};">$55M</div></div>
            <div class="m-kpi" style="background:\${t.kpi};border-color:\${t.border};"><div class="m-kpi-val" style="color:\${t.text};">$46M</div></div>
            <div class="m-kpi" style="background:\${t.kpi};border-color:\${t.border};"><div class="m-kpi-val" style="color:\${t.text};">$41M</div></div>
          </div>
          <div class="m-chart" style="background:\${t.kpi};border-color:\${t.border};">
            \${t.bars.map(h=>\`<div class="m-bar" style="height:\${h}%;background:\${t.accent};opacity:0.5;"></div>\`).join('')}
          </div>
        </div>
      </div>
      <div class="tpl-info">
        <h4>\${t.name}</h4>
        <p>\${t.desc}</p>
        <div class="tpl-tags">\${t.tags.map(g=>\`<span class="tpl-tag" style="color:\${g.c};background:\${g.c}12;border:1px solid \${g.c}25;">\${g.l}</span>\`).join('')}</div>
      </div>
    </div>
  \`).join('');
}

// Views
function showView(view){
  document.querySelectorAll('.sidebar-item').forEach(i=>i.classList.remove('active'));
  event?.target?.closest('.sidebar-item')?.classList.add('active');
  if(view==='dashboard') renderDashboard();
  else if(view==='admin') renderAdmin();
  else if(view==='settings') renderSettings();
}

function renderDashboard(){
  document.getElementById('breadcrumb').innerHTML='<strong>Dashboard</strong>';
  document.getElementById('resourcesPanel').style.display='';
  document.getElementById('mainContent').innerHTML=\`
    <div class="dash-header">
      <div class="dash-date">☀ SATURDAY, MARCH 28, 2026</div>
      <div style="display:flex;align-items:center;">
        <div class="dash-greeting">Good afternoon, Malik <span class="fy-badge">FY2025 YTD</span></div>
        <button class="ask-copilot">✨ Ask AI Copilot</button>
      </div>
      <div class="status-strip">
        <span class="live">Revenue ahead by $2.09M</span>
        <span class="metric">Rule of 40: <strong>52.1</strong></span>
        <span class="warning">4 variances</span>
      </div>
      <div class="quick-actions">
        <button class="qa-btn"><svg viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg> New Forecast</button>
        <button class="qa-btn"><svg viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.2"/><path d="M7 5v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg> Run Variance</button>
        <button class="qa-btn"><svg viewBox="0 0 14 14" fill="none"><path d="M2 10l3-3 2 2 5-5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg> Export P&L</button>
        <button class="qa-btn"><svg viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Close Tasks</button>
      </div>
    </div>

    <!-- Connector Bar -->
    <div class="connector-bar">
      <span class="live-tag">All Systems Live</span>
      <span class="stat"><strong>7</strong> connectors active</span>
      <span class="stat"><strong>3.1M</strong> records synced</span>
      <span class="stat"><strong>18</strong> GL accounts · <strong>162</strong> transactions</span>
      <div class="connectors">
        <span class="connector-chip"><span class="cdot" style="background:#10B981;"></span> NetSuite 847K</span>
        <span class="connector-chip"><span class="cdot" style="background:#3B82F6;"></span> Salesforce 124K</span>
        <span class="connector-chip"><span class="cdot" style="background:#8B5CF6;"></span> Stripe 38K</span>
        <span class="connector-chip"><span class="cdot" style="background:#06B6D4;"></span> Snowflake 2.1M</span>
        <span class="connector-chip"><span class="cdot" style="background:#EC4899;"></span> Rippling 312</span>
      </div>
      <span class="sync-info">Last sync: 53s ago</span>
      <span class="manage">Manage Connectors</span>
    </div>

    <!-- KPI Grid -->
    <div class="section-label">KEY METRICS</div>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-header"><div class="kpi-icon" style="background:var(--accent-dim);"><span style="color:var(--accent);">$</span></div><span class="kpi-label">REVENUE (YTD)</span></div>
        <div class="kpi-value">$55.0M</div>
        <div class="kpi-change"><span class="up">↗ 9 months</span> <span class="label">Annualized: $73.3M</span></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header"><div class="kpi-icon" style="background:var(--green-dim);"><span style="color:var(--green);">✓</span></div><span class="kpi-label">GROSS PROFIT</span></div>
        <div class="kpi-value">$46.7M</div>
        <div class="kpi-change"><span class="up">↗ 84.9% margin</span> <span class="label">Benchmark: 70-80%</span></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header"><div class="kpi-icon" style="background:var(--amber-dim);"><span style="color:var(--amber);">⚡</span></div><span class="kpi-label">OPEX (YTD)</span></div>
        <div class="kpi-value">$41.7M</div>
        <div class="kpi-change"><span class="down">↘ 76% of rev</span> <span class="label">9 line items</span></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header"><div class="kpi-icon" style="background:var(--green-dim);"><span style="color:var(--green);">◎</span></div><span class="kpi-label">NET INCOME</span></div>
        <div class="kpi-value">$5.1M</div>
        <div class="kpi-change"><span class="up">↗ 9.2% margin</span> <span class="label">Bottom line</span></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header"><div class="kpi-icon" style="background:var(--red-dim);"><span style="color:var(--red);">↕</span></div><span class="kpi-label">COGS</span></div>
        <div class="kpi-value">$8.3M</div>
        <div class="kpi-change"><span class="down">↘ 15.1% of rev</span> <span class="label">Gross margin: 84.9%</span></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-header"><div class="kpi-icon" style="background:var(--purple-dim);"><span style="color:var(--purple);">◇</span></div><span class="kpi-label">ACCOUNTS</span></div>
        <div class="kpi-value" style="font-size:26px;">18</div>
        <div class="kpi-change"><span class="up">↗ 162 txns</span> <span class="label">9 months loaded</span></div>
      </div>
    </div>

    <!-- Charts -->
    <div class="section-label">PERFORMANCE ANALYTICS</div>
    <div class="chart-row">
      <div class="chart-card">
        <div class="chart-title">Revenue Performance <span class="live-badge">LIVE</span></div>
        <div class="chart-subtitle">Actual vs Budget vs Forecast ($K)</div>
        <div class="chart-area">
          \${[4.2,5.1,5.8,6.2,6.8,7.4,7.9,8.5,9.1,9.8,10.2,10.8].map((v,i)=>\`<div class="chart-bar" style="height:\${v*8}%;background:\${i<9?'var(--accent)':'var(--accent)'};opacity:\${i<9?0.7:0.3};border:\${i>=9?'1px dashed var(--accent)':'none'};"></div>\`).join('')}
        </div>
        <div class="chart-legend">
          <span><span class="dot" style="background:var(--accent);"></span> Actual</span>
          <span><span class="dot" style="background:var(--green);"></span> Budget</span>
          <span><span class="dot" style="background:var(--accent);opacity:0.3;"></span> Forecast</span>
          <span style="margin-left:auto;font-weight:600;color:var(--green);">+$2.09M beat · +29% YoY</span>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Revenue by Segment</div>
        <div class="chart-subtitle">FY2025 YTD distribution</div>
        <div class="donut-container">
          <div class="donut" style="background:conic-gradient(var(--accent) 0% 76%,#06B6D4 76% 93%,var(--amber) 93% 98%,var(--red) 98% 100%);">
            <div style="width:80px;height:80px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center;flex-direction:column;">
              <div class="donut-center"><div class="val">$51.2M</div><div class="lbl">TOTAL</div></div>
            </div>
          </div>
          <div class="donut-legend">
            <div class="donut-legend-item"><span class="dot" style="background:var(--accent);"></span><span class="name">Enterprise</span><span class="meta">76%</span></div>
            <div class="donut-legend-item"><span class="dot" style="background:#06B6D4;"></span><span class="name">Mid-Market</span><span class="meta">17%</span></div>
            <div class="donut-legend-item"><span class="dot" style="background:var(--amber);"></span><span class="name">SMB</span><span class="meta">5%</span></div>
            <div class="donut-legend-item"><span class="dot" style="background:var(--red);"></span><span class="name">Self-Serve</span><span class="meta">2%</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-spacer"></div>
  \`;
}

function renderAdmin(){
  document.getElementById('breadcrumb').innerHTML='Dashboard / Forecast Optimizer / Team / <strong>Admin Console</strong>';
  document.getElementById('resourcesPanel').style.display='';
  document.getElementById('mainContent').innerHTML=\`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <div style="width:40px;height:40px;border-radius:12px;background:var(--amber-dim);display:flex;align-items:center;justify-content:center;font-size:18px;">◎</div>
      <div>
        <div style="font-size:20px;font-weight:800;display:flex;align-items:center;gap:8px;">Admin Console <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:4px;background:var(--purple-dim);color:var(--purple);">ADMIN</span></div>
        <div style="font-size:12px;color:var(--t4);">● 5 active users · 12 events today · All systems operational</div>
      </div>
      <div style="margin-left:auto;display:flex;gap:8px;">
        <button class="qa-btn">Export Log</button>
        <button class="qa-btn" style="background:var(--accent);color:#fff;border-color:var(--accent);">+ Invite User</button>
      </div>
    </div>

    <div class="view-tabs">
      <button class="view-tab active">◫ Overview</button>
      <button class="view-tab">⚙ Users & Roles</button>
      <button class="view-tab">$ Revenue</button>
      <button class="view-tab">✧ System Health</button>
      <button class="view-tab">◎ Workspace</button>
    </div>

    <div class="section-label">PLATFORM METRICS</div>
    <div class="admin-grid">
      <div class="admin-card">
        <div class="admin-icon">⚡</div>
        <div class="admin-label">PLAN</div>
        <div class="admin-value">Enterprise</div>
        <div class="admin-meta green">Active</div>
      </div>
      <div class="admin-card">
        <div class="admin-icon">👥</div>
        <div class="admin-label">TEAM MEMBERS</div>
        <div class="admin-value">6</div>
        <div class="admin-meta green">+2 this month</div>
      </div>
      <div class="admin-card">
        <div class="admin-icon">⚙</div>
        <div class="admin-label">EDGE FUNCTIONS</div>
        <div class="admin-value">16</div>
        <div class="admin-meta green">All healthy</div>
      </div>
      <div class="admin-card">
        <div class="admin-icon">📊</div>
        <div class="admin-label">GL ACCOUNTS</div>
        <div class="admin-value">18</div>
        <div class="admin-meta blue">Active</div>
      </div>
      <div class="admin-card">
        <div class="admin-icon">↕</div>
        <div class="admin-label">TRANSACTIONS</div>
        <div class="admin-value" style="font-size:24px;">3.1K</div>
        <div class="admin-meta blue">9 months</div>
      </div>
      <div class="admin-card">
        <div class="admin-icon">🔗</div>
        <div class="admin-label">INTEGRATIONS</div>
        <div class="admin-value">7</div>
        <div class="admin-meta green">All synced</div>
      </div>
    </div>

    <div class="section-label">TEAM HEALTH & USAGE</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div class="team-list">
        <div class="team-list-header">
          <h3>Team Activity <span class="live-tag">LIVE</span></h3>
          <span style="font-size:11px;color:var(--t4);">5 active now</span>
        </div>
        <div class="team-member">
          <div class="avatar" style="background:linear-gradient(135deg,#3B82F6,#2563EB);">AM</div>
          <div class="info"><div class="name">Alex Morgan</div><div class="dept">Finance · Now</div></div>
          <span class="role-badge" style="background:var(--green-dim);color:var(--green);">Owner</span>
        </div>
        <div class="team-member">
          <div class="avatar" style="background:linear-gradient(135deg,#8B5CF6,#7C3AED);">SC</div>
          <div class="info"><div class="name">Sarah Chen</div><div class="dept">FP&A · 2 min ago</div></div>
          <span class="role-badge" style="background:var(--accent-dim);color:var(--accent);">Admin</span>
        </div>
        <div class="team-member">
          <div class="avatar" style="background:linear-gradient(135deg,#EC4899,#DB2777);">PP</div>
          <div class="info"><div class="name">Priya Patel</div><div class="dept">Accounting · 15 min ago</div></div>
          <span class="role-badge" style="background:var(--amber-dim);color:var(--amber);">Manager</span>
        </div>
        <div class="team-member">
          <div class="avatar" style="background:linear-gradient(135deg,#F59E0B,#D97706);">JR</div>
          <div class="info"><div class="name">James Rodriguez</div><div class="dept">Operations · 1 hr ago</div></div>
          <span class="role-badge" style="background:var(--cyan-dim);color:var(--cyan);">Budget Owner</span>
        </div>
        <div class="team-member">
          <div class="avatar" style="background:linear-gradient(135deg,#06B6D4,#0891B2);">DK</div>
          <div class="info"><div class="name">David Kim</div><div class="dept">RevOps · 3 hr ago</div></div>
          <span class="role-badge" style="background:var(--elevated);color:var(--t3);">Viewer</span>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Weekly Usage</div>
        <div class="chart-subtitle">Logins, queries & exports</div>
        <div class="chart-area" style="height:120px;">
          \${[60,45,70,55,80,35,20].map(h=>\`<div class="chart-bar" style="height:\${h}%;background:var(--accent);opacity:0.6;"></div>\`).join('')}
        </div>
        <div class="chart-legend" style="margin-top:8px;">
          <span><span class="dot" style="background:var(--accent);"></span> Logins</span>
          <span><span class="dot" style="background:var(--green);"></span> AI Queries</span>
          <span><span class="dot" style="background:var(--purple);"></span> Exports</span>
        </div>
      </div>
    </div>
    <div class="bottom-spacer"></div>
  \`;
}

function renderSettings(){
  document.getElementById('breadcrumb').innerHTML='Dashboard / Admin Console / <strong>Settings</strong>';
  document.getElementById('resourcesPanel').style.display='';
  document.getElementById('mainContent').innerHTML=\`
    <div style="margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <svg viewBox="0 0 20 20" fill="none" style="width:20px;height:20px;"><circle cx="10" cy="10" r="4" stroke="var(--t3)" stroke-width="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="var(--t3)" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span style="font-size:20px;font-weight:800;">Settings</span>
      </div>
      <div style="font-size:12px;color:var(--t4);">Manage your workspace, billing, security, and preferences</div>
    </div>

    <div class="settings-layout">
      <div class="settings-nav">
        <div class="settings-nav-item"><svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/></svg> Organization</div>
        <div class="settings-nav-item active"><svg viewBox="0 0 16 16" fill="none"><path d="M4 8h8M8 4v8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg> Billing</div>
        <div class="settings-nav-item"><svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.2"/></svg> Security</div>
        <div class="settings-nav-item"><svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M2 8h12" stroke="currentColor" stroke-width="1.2"/></svg> Regional</div>
        <div class="settings-nav-item"><svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg> Session</div>
      </div>
      <div class="settings-content">
        <div class="settings-card">
          <h3>$ Billing & Subscription</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px;">
            <div style="padding:16px;border-radius:var(--radius-sm);border:1px solid var(--border);">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--green);margin-bottom:6px;">CURRENT PLAN</div>
              <div style="font-size:24px;font-weight:800;">Enterprise</div>
              <div style="font-size:12px;color:var(--t4);">Custom pricing</div>
            </div>
            <div style="padding:16px;border-radius:var(--radius-sm);border:1px solid var(--border);">
              <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--green);margin-bottom:6px;">STATUS</div>
              <div style="font-size:24px;font-weight:800;color:var(--green);">Active</div>
              <div style="font-size:12px;color:var(--t4);">Financial Holding LLC</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px;">
            <button class="qa-btn" style="justify-content:center;color:var(--accent);">Manage Subscription</button>
            <button class="qa-btn" style="justify-content:center;">View Invoices</button>
            <button class="qa-btn" style="justify-content:center;">Update Payment</button>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-spacer"></div>
  \`;
}

// Init
renderDashboard();`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#f3f4f8;--surface:#ffffff;--card:#ffffff;--elevated:#eef0f5;
  --border:#e2e5ed;--border2:#cdd2de;--border-sub:#dde1ea;
  --t1:#0a0d15;--t2:#3a4259;--t3:#576175;--t4:#8792a8;
  --accent:#3b82f6;--accent-dim:rgba(59,130,246,0.07);
  --green:#10b981;--green-dim:rgba(16,185,129,0.07);
  --red:#ef4444;--red-dim:rgba(239,68,68,0.07);
  --amber:#f59e0b;--amber-dim:rgba(245,158,11,0.07);
  --purple:#8b5cf6;--purple-dim:rgba(139,92,246,0.07);
  --cyan:#06b6d4;--cyan-dim:rgba(6,182,212,0.07);
  --radius:12px;--radius-sm:8px;
  --shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:0 4px 16px rgba(0,0,0,0.06);
  --ease:cubic-bezier(0.4,0,.2,1);
  --font:'DM Sans',system-ui,-apple-system,sans-serif;
  --mono:'JetBrains Mono',monospace;
}
body{font-family:var(--font);background:var(--bg);color:var(--t1);-webkit-font-smoothing:antialiased;min-height:100vh;font-size:14px;}

/* ═══ INFO BAR (top blue strip) ═══ */
.info-bar{background:var(--accent-dim);border-bottom:1px solid rgba(59,130,246,0.1);padding:6px 24px;display:flex;align-items:center;justify-content:center;gap:8px;font-size:12px;color:var(--accent);}
.info-bar .tag{font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;background:rgba(59,130,246,0.1);text-transform:uppercase;letter-spacing:0.04em;}
.info-bar a{color:var(--accent);font-weight:600;text-decoration:none;}

/* ═══ TOP BAR ═══ */
.topbar{position:sticky;top:0;z-index:100;background:var(--surface);border-bottom:1px solid var(--border);padding:0 20px;height:48px;display:flex;align-items:center;gap:12px;}
.topbar-logo{display:flex;align-items:center;gap:8px;padding-right:12px;border-right:1px solid var(--border);margin-right:4px;}
.topbar-logo svg{width:32px;height:32px;}
.topbar-logo .name{font-size:15px;font-weight:800;letter-spacing:-0.02em;}
.topbar-logo .plan-badge{font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px;background:var(--purple-dim);color:var(--purple);text-transform:uppercase;letter-spacing:0.04em;}
.topbar-breadcrumb{font-size:13px;color:var(--t3);font-weight:500;}
.topbar-breadcrumb strong{color:var(--t1);font-weight:700;}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.topbar-time{font-size:12px;font-family:var(--mono);color:var(--t4);}
.topbar-search{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--elevated);font-size:12px;color:var(--t4);cursor:pointer;transition:all 0.2s;}
.topbar-search:hover{border-color:var(--border2);}
.topbar-search kbd{font-size:10px;font-family:var(--mono);padding:1px 4px;border-radius:3px;background:var(--surface);border:1px solid var(--border);color:var(--t4);}
.topbar-icon{width:32px;height:32px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.15s;color:var(--t3);}
.topbar-icon:hover{background:var(--elevated);}
.topbar-icon svg{width:18px;height:18px;}

/* ═══ LAYOUT ═══ */
.layout{display:flex;min-height:calc(100vh - 48px);}

/* ═══ SIDEBAR ═══ */
.sidebar{width:200px;border-right:1px solid var(--border);background:var(--surface);padding:16px 0;flex-shrink:0;display:flex;flex-direction:column;overflow-y:auto;}
.sidebar-section{padding:0 12px;margin-bottom:16px;}
.sidebar-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--t4);margin-bottom:6px;padding:0 8px;}
.sidebar-item{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;color:var(--t2);cursor:pointer;transition:all 0.15s;margin-bottom:1px;position:relative;}
.sidebar-item:hover{background:var(--elevated);color:var(--t1);}
.sidebar-item.active{background:rgba(59,130,246,0.08);color:var(--accent);font-weight:600;}
.sidebar-item svg{width:16px;height:16px;flex-shrink:0;opacity:0.6;}
.sidebar-item.active svg{opacity:1;}
.sidebar-item .count{font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;margin-left:auto;}
.sidebar-item .tier-tag{font-size:8px;font-weight:800;padding:1px 5px;border-radius:3px;margin-left:auto;text-transform:uppercase;letter-spacing:0.03em;display:flex;align-items:center;gap:2px;}
.sidebar-item .tier-tag svg{width:8px;height:8px;opacity:1;}
.tier-tag.starter{background:rgba(59,130,246,0.08);color:var(--accent);}
.tier-tag.growth{background:rgba(16,185,129,0.08);color:var(--green);}
.tier-tag.business{background:rgba(139,92,246,0.08);color:var(--purple);}

/* Sidebar bottom */
.sidebar-bottom{margin-top:auto;padding:0 12px;border-top:1px solid var(--border);padding-top:12px;}
.sidebar-team{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--t4);margin-bottom:8px;padding:0 8px;display:flex;align-items:center;gap:6px;}
.sidebar-team .online{font-size:9px;font-weight:600;color:var(--green);display:flex;align-items:center;gap:3px;}
.sidebar-team .online::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);}
.sidebar-user{display:flex;align-items:center;gap:8px;padding:8px;border-radius:var(--radius-sm);cursor:pointer;transition:background 0.15s;}
.sidebar-user:hover{background:var(--elevated);}
.sidebar-avatar{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0;}
.sidebar-user-info .name{font-size:12px;font-weight:600;color:var(--t1);}
.sidebar-user-info .role{font-size:10px;color:var(--t4);}
.sidebar-invite{font-size:11px;color:var(--accent);font-weight:600;padding:4px 8px;cursor:pointer;}

/* Theme toggle */
.theme-toggle{display:flex;align-items:center;border-radius:var(--radius-sm);border:1px solid var(--border);overflow:hidden;margin:8px 12px;}
.theme-opt{flex:1;padding:5px;font-size:11px;font-weight:600;text-align:center;cursor:pointer;transition:all 0.15s;color:var(--t3);}
.theme-opt.active{background:var(--surface);color:var(--t1);box-shadow:var(--shadow);}
.theme-opt:not(.active){background:var(--elevated);}

/* ═══ MAIN CONTENT ═══ */
.main{flex:1;min-width:0;display:flex;}
.main-content{flex:1;padding:20px 24px;min-width:0;overflow-y:auto;}

/* ═══ DASHBOARD HEADER ═══ */
.dash-header{margin-bottom:20px;}
.dash-date{font-size:11px;color:var(--t4);font-weight:500;margin-bottom:4px;display:flex;align-items:center;gap:6px;}
.dash-greeting{font-size:22px;font-weight:800;letter-spacing:-0.02em;display:flex;align-items:center;gap:12px;}
.fy-badge{font-size:10px;font-weight:700;padding:3px 10px;border-radius:var(--radius-sm);background:var(--elevated);color:var(--t3);border:1px solid var(--border);}
.ask-copilot{margin-left:auto;padding:8px 16px;border-radius:var(--radius-sm);font-size:12px;font-weight:700;border:1px solid var(--border);background:var(--surface);color:var(--accent);cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.2s;}
.ask-copilot:hover{border-color:var(--accent);background:var(--accent-dim);}

/* Revenue status strip */
.status-strip{display:flex;align-items:center;gap:12px;margin-top:8px;font-size:12px;}
.status-strip .live{color:var(--green);font-weight:600;display:flex;align-items:center;gap:4px;}
.status-strip .live::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green);animation:livePulse 2s ease infinite;}
@keyframes livePulse{0%,100%{opacity:0.5;}50%{opacity:1;}}
.status-strip .metric{color:var(--t3);font-weight:500;}
.status-strip .highlight{color:var(--green);font-weight:600;}
.status-strip .warning{color:var(--amber);font-weight:600;}

/* Quick actions */
.quick-actions{display:flex;gap:8px;margin-top:12px;}
.qa-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface);font-size:12px;font-weight:600;color:var(--t2);cursor:pointer;transition:all 0.15s;}
.qa-btn:hover{border-color:var(--border2);background:var(--elevated);}
.qa-btn svg{width:14px;height:14px;opacity:0.5;}

/* ═══ CONNECTOR BAR ═══ */
.connector-bar{display:flex;align-items:center;gap:12px;padding:10px 16px;border-radius:var(--radius);border:1px solid var(--border);background:var(--surface);margin-bottom:20px;font-size:12px;flex-wrap:wrap;}
.connector-bar .live-tag{color:var(--green);font-weight:700;display:flex;align-items:center;gap:4px;}
.connector-bar .live-tag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green);}
.connector-bar .stat{color:var(--t3);font-weight:500;}
.connector-bar .stat strong{color:var(--t2);}
.connector-bar .connectors{display:flex;gap:6px;flex-wrap:wrap;margin-left:8px;}
.connector-chip{display:flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:600;background:var(--elevated);color:var(--t3);border:1px solid var(--border);}
.connector-chip .cdot{width:5px;height:5px;border-radius:50%;}
.connector-bar .sync-info{margin-left:auto;font-size:11px;color:var(--t4);font-family:var(--mono);}
.connector-bar .manage{color:var(--accent);font-weight:600;cursor:pointer;margin-left:8px;}

/* ═══ KPI GRID (KEY METRICS) ═══ */
.section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--t4);margin-bottom:12px;}
.kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;}
.kpi-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;transition:all 0.2s var(--ease);}
.kpi-card:hover{box-shadow:var(--shadow-md);border-color:var(--border2);}
.kpi-header{display:flex;align-items:center;gap:8px;margin-bottom:10px;}
.kpi-icon{width:28px;height:28px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:14px;}
.kpi-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;color:var(--t3);}
.kpi-sparkline{margin-left:auto;width:60px;height:24px;opacity:0.4;}
.kpi-value{font-size:28px;font-weight:800;letter-spacing:-0.02em;font-family:var(--mono);margin-bottom:4px;}
.kpi-change{font-size:11px;font-weight:600;display:flex;align-items:center;gap:6px;}
.kpi-change .up{color:var(--green);}
.kpi-change .down{color:var(--red);}
.kpi-change .label{color:var(--t4);font-weight:500;}

/* ═══ CHART CARDS ═══ */
.chart-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;}
.chart-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;}
.chart-title{font-size:14px;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:8px;}
.chart-title .live-badge{font-size:9px;font-weight:700;color:var(--green);display:flex;align-items:center;gap:3px;padding:2px 6px;border-radius:4px;background:var(--green-dim);}
.chart-title .live-badge::before{content:'';width:4px;height:4px;border-radius:50%;background:var(--green);}
.chart-subtitle{font-size:11px;color:var(--t4);margin-bottom:14px;}
.chart-area{height:140px;position:relative;display:flex;align-items:flex-end;gap:3px;}
.chart-bar{flex:1;border-radius:3px 3px 0 0;transition:all 0.4s var(--ease);min-width:6px;}
.chart-bar:hover{opacity:0.8;}
.chart-legend{display:flex;gap:16px;margin-top:10px;font-size:11px;color:var(--t3);}
.chart-legend .dot{width:8px;height:8px;border-radius:2px;display:inline-block;margin-right:4px;vertical-align:middle;}

/* Donut chart placeholder */
.donut-container{display:flex;align-items:center;gap:24px;}
.donut{width:140px;height:140px;border-radius:50%;position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.donut-center{text-align:center;}
.donut-center .val{font-size:20px;font-weight:800;font-family:var(--mono);}
.donut-center .lbl{font-size:10px;color:var(--t4);}
.donut-legend{display:flex;flex-direction:column;gap:8px;font-size:12px;}
.donut-legend-item{display:flex;align-items:center;gap:8px;}
.donut-legend-item .dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.donut-legend-item .name{font-weight:600;color:var(--t1);}
.donut-legend-item .meta{font-size:10px;color:var(--t4);margin-left:auto;font-family:var(--mono);}

/* ═══ RESOURCES PANEL (RIGHT SIDE) ═══ */
.resources-panel{width:240px;border-left:1px solid var(--border);background:var(--surface);padding:16px;flex-shrink:0;overflow-y:auto;font-size:12px;}
.rp-section{margin-bottom:20px;}
.rp-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--t4);margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;}
.rp-label .close-btn{cursor:pointer;font-size:14px;color:var(--t4);}
.rp-card{padding:12px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface);margin-bottom:8px;cursor:pointer;transition:all 0.15s;}
.rp-card:hover{background:var(--elevated);border-color:var(--border2);}
.rp-card .title{font-weight:700;color:var(--t1);margin-bottom:2px;}
.rp-card .desc{font-size:11px;color:var(--t4);line-height:1.4;}
.rp-card .code{font-family:var(--mono);font-size:10px;color:var(--t4);margin-top:4px;padding:3px 6px;border-radius:4px;background:var(--elevated);display:inline-block;}

/* Suite products */
.suite-item{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);}
.suite-item:last-child{border:none;}
.suite-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.suite-info .name{font-weight:600;color:var(--t1);}
.suite-info .sub{font-size:10px;color:var(--t4);}
.suite-badge{margin-left:auto;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase;}

/* Connect links */
.rp-link{display:flex;align-items:center;justify-content:space-between;padding:6px 0;font-weight:500;color:var(--t2);cursor:pointer;border-bottom:1px solid var(--border);}
.rp-link:last-child{border:none;}
.rp-link:hover{color:var(--accent);}
.rp-link .arrow{font-size:10px;color:var(--t4);}

/* ═══ CUSTOMIZATION FLOATING BAR ═══ */
.customize-bar{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:200;background:rgba(15,23,42,0.94);backdrop-filter:blur(24px) saturate(1.5);border-radius:14px;padding:8px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 40px rgba(0,0,0,0.2),0 0 0 1px rgba(255,255,255,0.05);color:#fff;animation:slideUp 0.6s var(--ease);}
@keyframes slideUp{from{transform:translateX(-50%) translateY(30px);opacity:0;}to{transform:translateX(-50%) translateY(0);opacity:1;}}
.cbar-icon{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#06B6D4,#8B5CF6);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.cbar-icon svg{width:14px;height:14px;}
.cbar-title{font-size:12px;font-weight:700;white-space:nowrap;}
.cbar-divider{width:1px;height:24px;background:rgba(255,255,255,0.08);}
.cbar-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:rgba(255,255,255,0.3);white-space:nowrap;}
.cbar-swatch{width:20px;height:20px;border-radius:5px;border:2px solid transparent;cursor:pointer;transition:all 0.15s;}
.cbar-swatch:hover,.cbar-swatch.active{border-color:rgba(255,255,255,0.8);transform:scale(1.15);}
.cbar-btn{padding:5px 10px;border-radius:7px;font-size:11px;font-weight:600;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.65);cursor:pointer;transition:all 0.15s;white-space:nowrap;display:flex;align-items:center;gap:4px;}
.cbar-btn:hover{background:rgba(255,255,255,0.1);color:#fff;}
.cbar-btn.active{background:rgba(6,182,212,0.2);border-color:rgba(6,182,212,0.4);color:#67E8F9;}
.cbar-template{padding:6px 14px;border-radius:8px;font-size:11px;font-weight:700;border:none;background:linear-gradient(135deg,#06B6D4,#8B5CF6);color:#fff;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:5px;}
.cbar-template:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(6,182,212,0.3);}

/* ═══ TEMPLATE PICKER MODAL ═══ */
.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.5);backdrop-filter:blur(6px);z-index:300;display:none;align-items:center;justify-content:center;}
.modal-overlay.open{display:flex;}
.modal{background:#fff;border-radius:16px;width:92%;max-width:880px;max-height:88vh;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.12);animation:modalIn 0.3s var(--ease);}
@keyframes modalIn{from{transform:translateY(16px) scale(0.97);opacity:0;}to{transform:none;opacity:1;}}
.modal-head{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;justify-content:space-between;}
.modal-head h2{font-size:18px;font-weight:800;letter-spacing:-0.02em;}
.modal-head p{font-size:12px;color:var(--t3);margin-top:2px;}
.modal-close{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:16px;transition:all 0.15s;}
.modal-close:hover{background:var(--elevated);color:var(--t1);}
.modal-body{padding:20px 24px 24px;overflow-y:auto;max-height:calc(88vh - 70px);}
.tpl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.tpl-card{border-radius:12px;border:2px solid var(--border);overflow:hidden;cursor:pointer;transition:all 0.3s var(--ease);}
.tpl-card:hover{border-color:var(--cyan);transform:translateY(-3px);box-shadow:var(--shadow-md);}
.tpl-card.selected{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(6,182,212,0.12);}
.tpl-card.selected::after{content:'✓';position:absolute;top:8px;right:8px;width:20px;height:20px;border-radius:50%;background:var(--cyan);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;z-index:5;}
.tpl-mini{height:130px;position:relative;overflow:hidden;}
.tpl-info{padding:12px 14px;}
.tpl-info h4{font-size:13px;font-weight:700;margin-bottom:2px;}
.tpl-info p{font-size:10px;color:var(--t3);line-height:1.4;}
.tpl-tags{display:flex;gap:4px;margin-top:6px;}
.tpl-tag{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;padding:2px 6px;border-radius:3px;}

/* Mini dashboard inside template cards */
.m-sidebar{position:absolute;left:0;top:0;bottom:0;width:30px;border-right:1px solid;}
.m-topbar{position:absolute;top:0;left:30px;right:0;height:22px;border-bottom:1px solid;display:flex;align-items:center;padding:0 8px;font-size:7px;font-weight:700;}
.m-content{position:absolute;top:22px;left:30px;right:0;bottom:0;padding:6px;display:grid;gap:3px;grid-template-rows:auto 1fr;}
.m-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;}
.m-kpi{border-radius:3px;border:1px solid;padding:4px 3px;text-align:center;}
.m-kpi-val{font-size:8px;font-weight:800;}
.m-kpi-lbl{font-size:4px;text-transform:uppercase;letter-spacing:0.06em;}
.m-chart{border-radius:3px;border:1px solid;display:flex;align-items:flex-end;gap:1px;padding:3px 4px;}
.m-bar{flex:1;border-radius:1px 1px 0 0;}

/* ═══ ADMIN VIEW TAB ═══ */
.view-tabs{display:flex;gap:4px;margin-bottom:20px;}
.view-tab{padding:6px 14px;border-radius:var(--radius-sm);font-size:12px;font-weight:600;border:1px solid var(--border);background:transparent;color:var(--t3);cursor:pointer;transition:all 0.15s;}
.view-tab:hover{border-color:var(--border2);color:var(--t2);}
.view-tab.active{background:var(--accent);border-color:var(--accent);color:#fff;}

/* Admin metrics */
.admin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px;}
.admin-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;position:relative;}
.admin-card .admin-icon{position:absolute;top:16px;right:16px;color:var(--t4);opacity:0.3;}
.admin-card .admin-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--t4);margin-bottom:8px;}
.admin-card .admin-value{font-size:26px;font-weight:800;font-family:var(--mono);}
.admin-card .admin-meta{font-size:11px;font-weight:600;margin-top:4px;}
.admin-card .admin-meta.green{color:var(--green);}
.admin-card .admin-meta.blue{color:var(--accent);}

/* Team activity */
.team-list{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.team-list-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border);}
.team-list-header h3{font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px;}
.team-list-header .live-tag{font-size:9px;font-weight:700;color:var(--green);padding:2px 6px;border-radius:4px;background:var(--green-dim);}
.team-member{display:flex;align-items:center;gap:12px;padding:10px 18px;border-bottom:1px solid var(--border);transition:background 0.1s;}
.team-member:last-child{border:none;}
.team-member:hover{background:var(--elevated);}
.team-member .avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;}
.team-member .info .name{font-size:13px;font-weight:600;}
.team-member .info .dept{font-size:11px;color:var(--t4);}
.team-member .role-badge{margin-left:auto;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;}

/* ═══ SETTINGS VIEW ═══ */
.settings-layout{display:flex;gap:20px;}
.settings-nav{width:180px;flex-shrink:0;}
.settings-nav-item{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;color:var(--t3);cursor:pointer;margin-bottom:2px;transition:all 0.15s;}
.settings-nav-item:hover{background:var(--elevated);color:var(--t2);}
.settings-nav-item.active{background:rgba(59,130,246,0.08);color:var(--accent);font-weight:600;}
.settings-nav-item svg{width:16px;height:16px;opacity:0.5;}
.settings-content{flex:1;min-width:0;}
.settings-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;}
.settings-card h3{font-size:15px;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:8px;}
.settings-card .subtitle{font-size:12px;color:var(--t4);margin-bottom:16px;}
.settings-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;}
.settings-row:last-child{border:none;}
.settings-row .label{color:var(--t2);}
.settings-row .value{font-weight:600;font-family:var(--mono);display:flex;align-items:center;gap:6px;}
.settings-row .value .status-dot{width:6px;height:6px;border-radius:50%;}

/* Bottom spacer for customize bar */
.bottom-spacer{height:70px;}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- Info Bar -->
<div class="info-bar">
  <span class="tag">Info</span>
  New: AI Copilot powered by Claude — visible reasoning for every financial insight
  <a href="#">Learn more</a>
</div>

<!-- Top Bar -->
<div class="topbar">
  <div class="topbar-logo">
    <svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#3B82F6"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
    <span class="name">FinanceOS</span>
    <span class="plan-badge">ENTERPRISE</span>
  </div>
  <div class="topbar-breadcrumb" id="breadcrumb"><strong>Dashboard</strong></div>
  <div style="margin-left:8px;">
    <select style="font-size:12px;font-weight:600;border:1px solid var(--border);border-radius:6px;padding:4px 8px;background:var(--surface);color:var(--t2);font-family:var(--font);" id="fySelect">
      <option>FY2025 YTD</option>
      <option>FY2024</option>
      <option>Q1 2025</option>
    </select>
  </div>
  <div class="topbar-right">
    <span class="topbar-time" id="clockDisplay">04:38 PM</span>
    <div class="topbar-search">
      <svg viewBox="0 0 16 16" fill="none" style="width:12px;height:12px;"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      Search... <kbd>⌘K</kbd>
    </div>
    <div class="topbar-icon">
      <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </div>
  </div>
</div>

<div class="layout">
  <!-- Sidebar -->
  <div class="sidebar" id="sidebar">
    <div class="sidebar-section">
      <div class="sidebar-label">OVERVIEW</div>
      <div class="sidebar-item active" onclick="showView('dashboard')">
        <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>
        Dashboard <span class="count">4</span>
      </div>
      <div class="sidebar-item" onclick="showView('dashboard')">
        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
        AI Cop... <span class="tier-tag growth"><svg viewBox="0 0 8 8" fill="none"><rect x="1" y="4" width="6" height="3" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M3 4V3a1 1 0 012 0v1" stroke="currentColor" stroke-width="0.8"/></svg> GROWTH</span>
      </div>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-label">FINANCIAL</div>
      <div class="sidebar-item">
        <svg viewBox="0 0 16 16" fill="none"><path d="M2 14V4l4-2 4 2 4-2v10l-4 2-4-2-4 2z" stroke="currentColor" stroke-width="1.2"/></svg>
        P&L Statement <span class="tier-tag starter"><svg viewBox="0 0 8 8" fill="none"><rect x="1" y="4" width="6" height="3" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M3 4V3a1 1 0 012 0v1" stroke="currentColor" stroke-width="0.8"/></svg> STARTER</span>
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 16 16" fill="none"><path d="M2 12l4-4 3 3 5-6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Forecast <span class="tier-tag growth"><svg viewBox="0 0 8 8" fill="none"><rect x="1" y="4" width="6" height="3" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M3 4V3a1 1 0 012 0v1" stroke="currentColor" stroke-width="0.8"/></svg> GROWTH</span>
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M2 8h12" stroke="currentColor" stroke-width="1.2"/></svg>
        Consolidation <span class="tier-tag growth"><svg viewBox="0 0 8 8" fill="none"><rect x="1" y="4" width="6" height="3" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M3 4V3a1 1 0 012 0v1" stroke="currentColor" stroke-width="0.8"/></svg> GROWTH</span>
      </div>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-label">PLANNING</div>
      <div class="sidebar-item">
        <svg viewBox="0 0 16 16" fill="none"><path d="M4 2v12M12 2v12M2 6h12M2 10h12" stroke="currentColor" stroke-width="1.2"/></svg>
        Scenarios <span class="tier-tag growth"><svg viewBox="0 0 8 8" fill="none"><rect x="1" y="4" width="6" height="3" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M3 4V3a1 1 0 012 0v1" stroke="currentColor" stroke-width="0.8"/></svg> GROWTH</span>
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Close T... <span class="tier-tag business"><svg viewBox="0 0 8 8" fill="none"><rect x="1" y="4" width="6" height="3" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M3 4V3a1 1 0 012 0v1" stroke="currentColor" stroke-width="0.8"/></svg> BUSINESS</span> <span class="count" style="background:var(--amber);font-size:9px;">6</span>
      </div>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-label">COLLABORATE</div>
      <div class="sidebar-item">
        <svg viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.2"/><circle cx="11" cy="10" r="3" stroke="currentColor" stroke-width="1.2"/></svg>
        Team <span class="tier-tag business"><svg viewBox="0 0 8 8" fill="none"><rect x="1" y="4" width="6" height="3" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M3 4V3a1 1 0 012 0v1" stroke="currentColor" stroke-width="0.8"/></svg> BUSINESS</span>
      </div>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-label">PLATFORM</div>
      <div class="sidebar-item">
        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
        Integrations <span class="tier-tag starter"><svg viewBox="0 0 8 8" fill="none"><rect x="1" y="4" width="6" height="3" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M3 4V3a1 1 0 012 0v1" stroke="currentColor" stroke-width="0.8"/></svg> STARTER</span>
      </div>
      <div class="sidebar-item" onclick="showView('admin')">
        <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M6 8h4M8 6v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
        Admin
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 16 16" fill="none"><path d="M3 4l5-2 5 2v4c0 3-5 6-5 6s-5-3-5-6V4z" stroke="currentColor" stroke-width="1.2"/></svg>
        Investor Met... <span class="tier-tag business"><svg viewBox="0 0 8 8" fill="none"><rect x="1" y="4" width="6" height="3" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M3 4V3a1 1 0 012 0v1" stroke="currentColor" stroke-width="0.8"/></svg> BUSINESS</span>
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 16 16" fill="none"><path d="M4 14V8l4-6 4 6v6" stroke="currentColor" stroke-width="1.2"/><path d="M4 14h8" stroke="currentColor" stroke-width="1.2"/></svg>
        Command C... <span class="tier-tag business"><svg viewBox="0 0 8 8" fill="none"><rect x="1" y="4" width="6" height="3" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M3 4V3a1 1 0 012 0v1" stroke="currentColor" stroke-width="0.8"/></svg> BUSINESS</span>
      </div>
      <div class="sidebar-item">
        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M8 5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="11" r="0.5" fill="currentColor"/></svg>
        Intelligence
      </div>
      <div class="sidebar-item" onclick="showView('settings')">
        <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
        Settings
      </div>
    </div>

    <!-- Sidebar Bottom -->
    <div class="sidebar-bottom">
      <div style="padding:8px 8px 4px;">
        <div style="display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:var(--radius-sm);border:1px solid var(--border);cursor:pointer;transition:all 0.15s;" onmouseover="this.style.background='var(--elevated)'" onmouseout="this.style.background='transparent'">
          <svg viewBox="0 0 16 16" fill="none" style="width:16px;height:16px;"><rect x="2" y="2" width="12" height="12" rx="3" stroke="var(--accent)" stroke-width="1.2"/><path d="M5 8h6M8 5v6" stroke="var(--accent)" stroke-width="1.2" stroke-linecap="round"/></svg>
          <div><div style="font-size:11px;font-weight:700;color:var(--t1);">Product Guides</div><div style="font-size:9px;color:var(--t4);">8 tutorials available</div></div>
          <svg viewBox="0 0 8 8" fill="none" style="width:8px;height:8px;margin-left:auto;"><path d="M2 3l3 3 3-3" stroke="var(--t4)" stroke-width="1" stroke-linecap="round"/></svg>
        </div>
      </div>
      <div class="sidebar-team" style="margin-top:8px;">TEAM <span class="online">1 online</span></div>
      <div class="sidebar-user">
        <div class="sidebar-avatar" style="background:linear-gradient(135deg,#3B82F6,#8B5CF6);">MF</div>
        <div class="sidebar-user-info">
          <div class="name">Malik Frazier</div>
          <div class="role">Owner</div>
        </div>
      </div>
      <div class="sidebar-invite">+ Invite teammates</div>
      <div style="padding:6px 8px;margin-top:4px;border-top:1px solid var(--border);padding-top:8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="sidebar-avatar" style="background:linear-gradient(135deg,#10B981,#059669);width:24px;height:24px;font-size:9px;">MF</div>
          <div><div style="font-size:11px;font-weight:600;">Malik Frazier</div><div style="font-size:9px;color:var(--t4);">ENTERPRISE · Financial Holding LLC</div></div>
        </div>
      </div>
      <div class="theme-toggle">
        <div class="theme-opt active">Light</div>
        <div class="theme-opt">Dark</div>
      </div>
      <div style="padding:4px 12px;font-size:11px;color:var(--t4);cursor:pointer;display:flex;align-items:center;gap:6px;">
        <svg viewBox="0 0 16 16" fill="none" style="width:12px;height:12px;"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 12l3-4-3-4M7 8h7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Log Out
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="main">
    <div class="main-content" id="mainContent"></div>

    <!-- Resources Panel -->
    <div class="resources-panel" id="resourcesPanel">
      <div class="rp-section">
        <div class="rp-label">RESOURCES <span class="close-btn">×</span></div>
        <div class="rp-card">
          <div class="title">Partner Program</div>
          <div class="desc">Earn 20% recurring commission. Share your referral link.</div>
          <div class="code">FOS-DEMO</div>
        </div>
      </div>
      <div class="rp-section">
        <div class="rp-label">SUITE PRODUCTS</div>
        <div class="suite-item">
          <div class="suite-dot" style="background:var(--cyan);"></div>
          <div class="suite-info"><div class="name">Vaultline</div><div class="sub">Treasury</div></div>
        </div>
        <div class="suite-item">
          <div class="suite-dot" style="background:var(--green);"></div>
          <div class="suite-info"><div class="name">Parallax</div><div class="sub">Compliance</div></div>
          <span class="suite-badge" style="background:var(--amber-dim);color:var(--amber);">SOON</span>
        </div>
        <div class="suite-item">
          <div class="suite-dot" style="background:var(--purple);"></div>
          <div class="suite-info"><div class="name">Emberglow</div><div class="sub">ESG Advisory</div></div>
          <span class="suite-badge" style="background:var(--amber-dim);color:var(--amber);">SOON</span>
        </div>
      </div>
      <div class="rp-section">
        <div class="rp-label">CONNECT</div>
        <div class="rp-link">LinkedIn <span class="arrow">↗</span></div>
        <div class="rp-link">X / Twitter <span class="arrow">↗</span></div>
      </div>
      <div class="rp-section">
        <div class="rp-label">RESOURCES</div>
        <div class="rp-link">Documentation</div>
        <div class="rp-link">Request a Demo</div>
        <div class="rp-link">Support</div>
        <div class="rp-link">Privacy Policy</div>
      </div>
      <div style="font-size:10px;color:var(--t4);cursor:pointer;text-align:right;">Hide this panel</div>
    </div>
  </div>
</div>

<!-- Customization Bar -->
<div class="customize-bar">
  <div class="cbar-icon"><svg viewBox="0 0 16 16" fill="none"><path d="M8 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" stroke="#fff" stroke-width="1.2" fill="none"/></svg></div>
  <span class="cbar-title">Customize</span>
  <div class="cbar-divider"></div>
  <span class="cbar-label">Theme</span>
  <div class="cbar-swatch active" style="background:linear-gradient(135deg,#F3F4F8,#E2E8F0);" title="Light (Current)"></div>
  <div class="cbar-swatch" style="background:linear-gradient(135deg,#030711,#0C1323);" title="Midnight"></div>
  <div class="cbar-swatch" style="background:linear-gradient(135deg,#FFFBF5,#F5E6D3);" title="Warm Sand"></div>
  <div class="cbar-swatch" style="background:linear-gradient(135deg,#040D0A,#0D3320);" title="Forest"></div>
  <div class="cbar-swatch" style="background:linear-gradient(135deg,#0C0A1A,#1A1040);" title="Executive"></div>
  <div class="cbar-swatch" style="background:linear-gradient(135deg,#0a0a0a,#111);" title="Terminal"></div>
  <div class="cbar-divider"></div>
  <button class="cbar-btn active">Grid</button>
  <button class="cbar-btn">Compact</button>
  <div class="cbar-divider"></div>
  <button class="cbar-template" onclick="openTemplates()">
    <svg viewBox="0 0 14 14" fill="none" style="width:12px;height:12px;"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>
    Templates
  </button>
</div>

<!-- Template Modal -->
<div class="modal-overlay" id="tplModal" onclick="if(event.target===this)closeTemplates()">
  <div class="modal">
    <div class="modal-head">
      <div><h2>Pick your dashboard template</h2><p>Every plan includes full theme customization. Switch anytime from Settings.</p></div>
      <button class="modal-close" onclick="closeTemplates()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="tpl-grid" id="tplGrid"></div>
    </div>
  </div>
</div>


` }} />
    </>
  );
}
