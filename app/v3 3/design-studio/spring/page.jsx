'use client';

import { useEffect, useRef } from 'react';

export default function V3DesignStudioSpringPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ═══ ROLE DATA ═══
const ROLES = {
  cfo: {
    name: 'Sarah Chen', title: 'Chief Financial Officer', short: 'CFO',
    greeting: 'Sarah', dashTitle: 'CFO Command Center', sbRole: 'VP Finance',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
    sbItems: ['P&L', 'Forecast', 'Scenarios'],
    kpis: [
      { label:'Revenue', val:'$4.2M', change:'+12.3%', up:true, color:'var(--cyan)', bg:'var(--cm)' },
      { label:'Burn Rate', val:'$890K', change:'-8.1%', up:true, color:'var(--green)', bg:'var(--gm)' },
      { label:'Runway', val:'18.2mo', change:'+2.4mo', up:true, color:'var(--purple)', bg:'var(--pm)' },
      { label:'EBITDA', val:'$1.1M', change:'+34%', up:true, color:'var(--amber)', bg:'var(--am)' },
    ],
    charts: { t1:'Revenue vs Forecast', t2:'Burn Rate' },
    table: { title:'Close Tasks', heads:['Task','Owner','Status','Due'], rows:[
      ['Revenue recognition','Sarah C.','<span class="status-pill" style="background:var(--gm);color:var(--green)">Done</span>','Mar 28'],
      ['AP accruals review','Priya P.','<span class="status-pill" style="background:var(--cm);color:var(--cyan)">In Progress</span>','Mar 29'],
      ['Interco eliminations','James R.','<span class="status-pill" style="background:var(--am);color:var(--amber)">Pending</span>','Mar 30'],
      ['Board deck draft','Sarah C.','<span class="status-pill" style="background:var(--am);color:var(--amber)">Pending</span>','Mar 31'],
    ]},
    messages: [
      { name:'Priya Patel', role:'Controller', roleColor:'var(--gm)', roleText:'var(--green)', time:'9:12 AM', text:'AP accruals are reconciled. <b>$42K variance</b> traced to the NetSuite timing issue — already adjusted.', avatar:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&crop=face' },
      { name:'James Rodriguez', role:'FP&A', roleColor:'var(--cm)', roleText:'var(--cyan)', time:'9:08 AM', text:'Updated the Q2 forecast model with the new headcount plan. Runway extended by <b>2.4 months</b>.', avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face' },
      { name:'AI Copilot', role:'System', roleColor:'var(--pm)', roleText:'var(--purple)', time:'9:05 AM', text:'Variance alert resolved.', avatar:'', isAction:true, actionTitle:'Auto-Detection', actionText:'OPEX variance of $67K in Marketing was caused by the Salesforce annual renewal. Reclassified to prepaid.' },
      { name:'David Kim', role:'RevOps', roleColor:'var(--am)', roleText:'var(--amber)', time:'8:55 AM', text:'March pipeline closed at <b>$1.8M</b>. Sending breakdown by segment to #finance now.', avatar:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face' },
      { name:'Sarah Chen', role:'CFO', roleColor:'var(--cm)', roleText:'var(--cyan)', time:'8:42 AM', text:'Great work on the close everyone. Let\\'s aim to have the board deck ready by Thursday EOD.', avatar:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face' },
    ]
  },
  ceo: {
    name: 'Alex Morgan', title: 'Chief Executive Officer', short: 'CEO',
    greeting: 'Alex', dashTitle: 'Executive Overview', sbRole: 'CEO & Founder',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    sbItems: ['Investor View', 'Board Deck', 'KPI Tracker'],
    kpis: [
      { label:'ARR', val:'$51M', change:'+28%', up:true, color:'var(--cyan)', bg:'var(--cm)' },
      { label:'NDR', val:'118%', change:'+3pp', up:true, color:'var(--green)', bg:'var(--gm)' },
      { label:'CAC Payback', val:'14mo', change:'-2mo', up:true, color:'var(--purple)', bg:'var(--pm)' },
      { label:'Rule of 40', val:'52', change:'+8pts', up:true, color:'var(--amber)', bg:'var(--am)' },
    ],
    charts: { t1:'ARR Growth Trajectory', t2:'CAC vs LTV' },
    table: { title:'Board Action Items', heads:['Item','Owner','Priority','Status'], rows:[
      ['Series C timeline','Alex M.','<span class="status-pill" style="background:var(--rm);color:var(--red)">Critical</span>','Active'],
      ['Enterprise GTM plan','VP Sales','<span class="status-pill" style="background:var(--am);color:var(--amber)">High</span>','Review'],
      ['SOC 2 Type II cert','CTO','<span class="status-pill" style="background:var(--cm);color:var(--cyan)">Medium</span>','On Track'],
      ['Headcount plan Q3','Sarah C.','<span class="status-pill" style="background:var(--gm);color:var(--green)">Done</span>','Approved'],
    ]},
    messages: [
      { name:'Sarah Chen', role:'CFO', roleColor:'var(--cm)', roleText:'var(--cyan)', time:'9:15 AM', text:'Board deck is 80% done. Revenue slides look strong — <b>28% YoY growth</b>. Sending draft by 2pm.', avatar:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face' },
      { name:'VP Sales', role:'Sales', roleColor:'var(--gm)', roleText:'var(--green)', time:'9:10 AM', text:'Closed Mercedes-Benz this morning. <b>$420K ACV</b>. That puts us at 112% of Q1 quota.', avatar:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&crop=face' },
      { name:'AI Copilot', role:'System', roleColor:'var(--pm)', roleText:'var(--purple)', time:'9:05 AM', text:'Investor metrics updated.', avatar:'', isAction:true, actionTitle:'Series C Readiness', actionText:'Score: 87/100. NDR and growth rate exceed benchmarks. Recommend starting conversations with Tier 1 firms.' },
      { name:'CTO', role:'Engineering', roleColor:'var(--am)', roleText:'var(--amber)', time:'8:50 AM', text:'SOC 2 audit is progressing. Auditor confirmed <b>zero critical findings</b> so far. Final report ETA: April 15.', avatar:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&h=60&fit=crop&crop=face' },
    ]
  },
  ctrl: {
    name: 'Priya Patel', title: 'Controller', short: 'CTRL',
    greeting: 'Priya', dashTitle: 'Controller Workspace', sbRole: 'Controller',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
    sbItems: ['Reconciliation', 'Journal Entries', 'Audit Trail'],
    kpis: [
      { label:'Close Progress', val:'72%', change:'Day 3 of 5', up:true, color:'var(--cyan)', bg:'var(--cm)' },
      { label:'Open Items', val:'14', change:'-6 today', up:true, color:'var(--green)', bg:'var(--gm)' },
      { label:'Variances', val:'3', change:'All < 5%', up:true, color:'var(--amber)', bg:'var(--am)' },
      { label:'Audit Score', val:'98.2', change:'+0.4', up:true, color:'var(--purple)', bg:'var(--pm)' },
    ],
    charts: { t1:'Close Task Completion', t2:'Open Items Trend' },
    table: { title:'Reconciliation Queue', heads:['Account','Balance','Variance','Status'], rows:[
      ['Cash & Equivalents','$12.4M','$0','<span class="status-pill" style="background:var(--gm);color:var(--green)">Reconciled</span>'],
      ['Accounts Receivable','$3.8M','$42K','<span class="status-pill" style="background:var(--cm);color:var(--cyan)">In Review</span>'],
      ['Prepaid Expenses','$890K','$67K','<span class="status-pill" style="background:var(--am);color:var(--amber)">Adjusting</span>'],
      ['Accrued Liabilities','$2.1M','$0','<span class="status-pill" style="background:var(--gm);color:var(--green)">Reconciled</span>'],
    ]},
    messages: [
      { name:'Sarah Chen', role:'CFO', roleColor:'var(--cm)', roleText:'var(--cyan)', time:'9:14 AM', text:'Priya, great catch on the AP accruals. Can you flag that NetSuite timing issue for the audit trail?', avatar:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face' },
      { name:'James Rodriguez', role:'FP&A', roleColor:'var(--cm)', roleText:'var(--cyan)', time:'9:10 AM', text:'Sent you the Q1 actuals vs budget for the variance memo. <b>Marketing is the only line over 5%</b>.', avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face' },
      { name:'AI Copilot', role:'System', roleColor:'var(--pm)', roleText:'var(--purple)', time:'9:02 AM', text:'Auto-reconciliation complete.', avatar:'', isAction:true, actionTitle:'Recon Engine', actionText:'12 of 14 accounts auto-matched. 2 require manual review: AR ($42K) and Prepaid ($67K).' },
      { name:'Audit Bot', role:'Compliance', roleColor:'var(--rm)', roleText:'var(--red)', time:'8:45 AM', text:'SOX control test passed for revenue recognition. <b>Zero exceptions</b>. Report saved to audit trail.', avatar:'', isBot:true },
    ]
  }
};

let currentRole = 'cfo';

function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  // Reset to splash
  document.getElementById('splashScreen').classList.add('active');
  document.getElementById('dashScreen').classList.remove('active');
  document.body.className = 'role-' + role;

  renderSplash(role);

  // Auto-transition to dashboard after 2.5s
  clearTimeout(window._dashTimeout);
  window._dashTimeout = setTimeout(() => {
    document.getElementById('splashScreen').classList.remove('active');
    document.getElementById('dashScreen').classList.add('active');
    renderDashboard(role);
  }, 2500);
}

function renderSplash(role) {
  const r = ROLES[role];
  document.getElementById('splashTitle').textContent = 'Welcome back, ' + r.greeting;
  document.getElementById('splashRoleName').textContent = r.title;
  document.getElementById('splashFill').style.animation = 'none';
  setTimeout(() => document.getElementById('splashFill').style.animation = 'progressBar 1.8s ease-in-out 0.3s forwards', 10);

  // Step animation
  ['ss1','ss2','ss3','ss4'].forEach(id => {
    const el = document.getElementById(id);
    el.className = 'splash-step';
  });
  const steps = [
    { id:'ss1', text:'Verifying credentials...', delay:300 },
    { id:'ss2', text:'Checking ' + r.short + ' subscription...', delay:700 },
    { id:'ss3', text:'Loading ' + r.short.toLowerCase() + ' workspace...', delay:1300 },
    { id:'ss4', text:'Welcome to FinanceOS', delay:1900 },
  ];
  steps.forEach((s,i) => {
    setTimeout(() => {
      if (i > 0) { const prev = document.getElementById(steps[i-1].id); prev.classList.remove('active'); prev.classList.add('done'); }
      document.getElementById(s.id).classList.add('active');
      document.getElementById('splashStatusText').textContent = s.text;
      if (i === steps.length-1) {
        setTimeout(() => {
          document.getElementById(s.id).classList.remove('active');
          document.getElementById(s.id).classList.add('done');
          document.getElementById('splashStatusText').style.color = 'var(--green)';
        }, 400);
      }
    }, s.delay);
  });
  document.getElementById('splashStatusText').style.color = '';
}

function renderDashboard(role) {
  const r = ROLES[role];
  document.getElementById('tbRoleTag').textContent = r.short;
  document.getElementById('greetName').textContent = r.greeting;
  document.getElementById('dashTitle').textContent = r.dashTitle;
  document.getElementById('sbUserName').textContent = r.name;
  document.getElementById('sbUserRole').textContent = r.sbRole;
  document.getElementById('sbLabel1').textContent = r.sbItems[0];
  document.getElementById('sbLabel2').textContent = r.sbItems[1];
  document.getElementById('sbLabel3').textContent = r.sbItems[2];
  document.getElementById('chartTitle1').innerHTML = r.charts.t1 + ' <div class="chart-live"><div style="width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse 2s infinite"></div> Live</div>';
  document.getElementById('chartTitle2').textContent = r.charts.t2;
  document.getElementById('tableTitle').textContent = r.table.title;

  // Update avatar
  document.querySelector('.avatar-btn img').src = r.avatar;
  document.querySelector('.sb-avatar img').src = r.avatar;

  // KPIs
  const kpiGrid = document.getElementById('kpiGrid');
  kpiGrid.innerHTML = r.kpis.map((k,i) => \`
    <div class="kpi-card glass" style="animation-delay:\${i*0.05}s">
      <div class="kpi-label"><div class="kpi-icon" style="background:\${k.bg};color:\${k.color}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div> \${k.label}</div>
      <div class="kpi-val">\${k.val}</div>
      <div class="kpi-change \${k.up?'up':'down'}"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="\${k.up?'18 15 12 9 6 15':'6 9 12 15 18 9'}"/></svg> \${k.change}</div>
    </div>
  \`).join('');

  // Chart bars
  const colors = [
    { main:'var(--cyan)', muted:'rgba(6,182,212,0.3)' },
    { main:'var(--green)', muted:'rgba(5,150,105,0.3)' },
  ];
  [1,2].forEach(n => {
    const container = document.getElementById('chartBars'+n);
    const bars = Array.from({length:12}, () => 30 + Math.random()*70);
    container.innerHTML = bars.map(h => \`<div class="chart-bar" style="height:\${h}%;background:\${colors[n-1].main};opacity:\${0.3+Math.random()*0.7}"></div>\`).join('');
  });

  // Table
  document.getElementById('tableHead').innerHTML = r.table.heads.map(h => \`<th>\${h}</th>\`).join('');
  document.getElementById('tableBody').innerHTML = r.table.rows.map(row => \`<tr>\${row.map(c => \`<td>\${c}</td>\`).join('')}</tr>\`).join('');

  // Chat
  const chatEl = document.getElementById('chatMessages');
  chatEl.innerHTML = r.messages.map((m,i) => {
    const avatarHtml = m.avatar
      ? \`<div class="msg-avatar"><img src="\${m.avatar}" alt=""/></div>\`
      : m.isBot
        ? \`<div class="msg-avatar" style="background:var(--rm);display:flex;align-items:center;justify-content:center;border-radius:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>\`
        : \`<div class="msg-avatar" style="background:var(--pm);display:flex;align-items:center;justify-content:center;border-radius:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2"><path d="M12 2a4 4 0 014 4v2H8V6a4 4 0 014-4z"/><rect x="3" y="8" width="18" height="12" rx="2"/><line x1="9" y1="14" x2="9" y2="14"/><line x1="15" y1="14" x2="15" y2="14"/></svg></div>\`;

    let content = \`<div class="msg-text">\${m.text}</div>\`;
    if (m.isAction) {
      content += \`<div class="msg-action"><div class="msg-action-title"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> \${m.actionTitle}</div><div class="msg-action-text">\${m.actionText}</div></div>\`;
    }

    return \`<div class="msg" style="animation-delay:\${i*0.06}s">
      \${avatarHtml}
      <div class="msg-body">
        <div class="msg-meta">
          <div class="msg-name">\${m.name}</div>
          <div class="msg-role" style="background:\${m.roleColor};color:\${m.roleText}">\${m.role}</div>
          <div class="msg-time">\${m.time}</div>
        </div>
        \${content}
      </div>
    </div>\`;
  }).join('');

  // Show typing indicator after a beat
  setTimeout(() => {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = 'flex';
    document.getElementById('typingName').textContent = role === 'cfo' ? 'James' : role === 'ceo' ? 'Sarah' : 'David';
  }, 1500);
}

// Initial render
document.body.className = 'role-cfo';
renderSplash('cfo');
setTimeout(() => {
  document.getElementById('splashScreen').classList.remove('active');
  document.getElementById('dashScreen').classList.add('active');
  renderDashboard('cfo');
}, 2500);`
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
    --bg: #F8FAFC; --surface: #F1F5F9; --card: #FFFFFF; --elevated: #FFFFFF;
    --border: rgba(15,23,42,0.06); --border-h: rgba(15,23,42,0.12);
    --t1: #0F172A; --t2: #475569; --t3: #94A3B8; --t4: #CBD5E1;
    --cyan: #06B6D4; --cm: rgba(6,182,212,0.08); --cg: rgba(6,182,212,0.12);
    --green: #059669; --gm: rgba(5,150,105,0.08);
    --amber: #D97706; --am: rgba(217,119,6,0.08);
    --red: #DC2626; --rm: rgba(220,38,38,0.08);
    --purple: #7C3AED; --pm: rgba(124,58,237,0.08);
    --r: 12px; --rs: 8px;
    --glass: 0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04);
    --f: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --m: 'JetBrains Mono', 'SF Mono', monospace;
    --t: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    --eo: cubic-bezier(0.16, 1, 0.3, 1);
  }
  body { font-family: var(--f); background: var(--bg); color: var(--t1); min-height: 100vh; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

  /* Dot grid */
  body::before { content:''; position:fixed; inset:0; background-image: radial-gradient(circle at 1px 1px, rgba(15,23,42,0.025) 0.5px, transparent 0.5px); background-size:28px 28px; pointer-events:none; z-index:0; }

  /* ═══ SCREEN SYSTEM ═══ */
  .screen { display:none; min-height:100vh; animation: screenIn 0.5s var(--eo) both; }
  .screen.active { display:flex; }
  @keyframes screenIn { 0%{opacity:0;transform:scale(0.98)} 100%{opacity:1;transform:scale(1)} }

  /* ═══ SHARED ═══ */
  .glass { background:var(--card); border:1px solid var(--border); border-radius:var(--r); box-shadow:var(--glass); position:relative; overflow:hidden; transition:all var(--t); }
  .glass::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(6,182,212,0.08),transparent); }
  .glass:hover { border-color:var(--border-h); box-shadow: var(--glass), 0 4px 12px rgba(0,0,0,0.04); }

  .btn { padding:10px 20px; border-radius:10px; border:none; font-family:var(--f); font-size:14px; font-weight:600; cursor:pointer; transition:all var(--t); display:inline-flex; align-items:center; gap:8px; }
  .btn-cyan { background:var(--cyan); color:white; box-shadow:0 2px 8px var(--cg); }
  .btn-cyan:hover { filter:brightness(1.05); box-shadow:0 4px 16px var(--cg); transform:translateY(-1px); }
  .btn-ghost { background:transparent; color:var(--t2); border:1px solid var(--border); }
  .btn-ghost:hover { border-color:var(--border-h); color:var(--t1); background:var(--cm); }

  @keyframes fadeUp { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
  @keyframes cardReveal { 0%{opacity:0;transform:translateY(8px) scale(0.98)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes slideRight { 0%{transform:translateX(-12px);opacity:0} 100%{transform:translateX(0);opacity:1} }
  .fade-up { animation: fadeUp 0.6s var(--eo) both; }
  .fade-up-d1 { animation-delay:0.06s; }
  .fade-up-d2 { animation-delay:0.12s; }
  .fade-up-d3 { animation-delay:0.18s; }
  .fade-up-d4 { animation-delay:0.24s; }

  /* ═══ PREVIEW BADGE ═══ */
  .preview-badge { position:fixed; top:12px; right:12px; background:var(--card); border:1px solid var(--border); color:var(--t2); font-size:10px; font-weight:700; padding:5px 12px; border-radius:8px; letter-spacing:0.05em; text-transform:uppercase; z-index:9999; box-shadow:var(--glass); }

  /* ═══ ROLE SWITCHER (top) ═══ */
  .role-switcher { position:fixed; top:12px; left:50%; transform:translateX(-50%); display:flex; gap:2px; background:var(--card); border:1px solid var(--border); border-radius:10px; padding:3px; z-index:9999; box-shadow:var(--glass); }
  .role-btn { padding:6px 16px; border-radius:7px; border:none; background:transparent; font-family:var(--f); font-size:11px; font-weight:600; color:var(--t3); cursor:pointer; transition:all var(--t); }
  .role-btn:hover { color:var(--t2); }
  .role-btn.active { background:var(--cyan); color:white; box-shadow:0 2px 8px var(--cg); }

  /* ════════════════════════════════════════
     SCREEN 1 — SPLASH / LOGIN
     ════════════════════════════════════════ */
  .splash-screen {
    flex-direction:column; align-items:center; justify-content:center;
    position:relative; padding:40px 20px;
  }
  .splash-screen::after { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--cyan),var(--purple),var(--green)); background-size:200% 100%; animation:shimmer 3s ease infinite; }
  .splash-orb { position:absolute; border-radius:50%; pointer-events:none; filter:blur(80px); }
  .splash-orb-1 { top:15%; left:20%; width:300px; height:300px; background:radial-gradient(circle,rgba(6,182,212,0.08),transparent 70%); }
  .splash-orb-2 { bottom:20%; right:15%; width:250px; height:250px; background:radial-gradient(circle,rgba(5,150,105,0.06),transparent 70%); }

  .splash-card { width:100%; max-width:420px; padding:40px; z-index:1; text-align:center; }
  .splash-logo { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:28px; animation:fadeUp 0.8s var(--eo) both; }
  .splash-logo-mark { width:48px; height:48px; border-radius:14px; background:var(--card); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; box-shadow:0 2px 12px rgba(6,182,212,0.08); }
  .splash-logo-mark svg { width:24px; height:24px; color:var(--cyan); }
  .splash-logo-text { font-size:24px; font-weight:800; letter-spacing:-0.03em; }
  .splash-logo-text span { background:linear-gradient(135deg,var(--cyan),#0891B2); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }

  .splash-title { font-size:20px; font-weight:700; margin-bottom:6px; letter-spacing:-0.3px; animation:fadeUp 0.8s var(--eo) 0.1s both; }
  .splash-sub { font-size:13px; color:var(--t3); margin-bottom:24px; animation:fadeUp 0.8s var(--eo) 0.15s both; }

  .splash-role-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--t3); margin-bottom:8px; animation:fadeUp 0.8s var(--eo) 0.2s both; }
  .splash-role-tag { display:inline-flex; align-items:center; gap:6px; padding:6px 16px; border-radius:8px; font-size:13px; font-weight:700; margin-bottom:24px; animation:fadeUp 0.8s var(--eo) 0.25s both; }

  .splash-progress { width:200px; height:4px; border-radius:4px; background:var(--surface); border:1px solid var(--border); overflow:hidden; margin:0 auto 12px; animation:fadeUp 0.8s var(--eo) 0.3s both; }
  .splash-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,var(--cyan),var(--green)); width:0; animation:progressBar 1.8s ease-in-out 0.5s forwards; }
  @keyframes progressBar { 0%{width:0} 40%{width:50%} 75%{width:82%} 100%{width:100%} }
  .splash-status { font-size:11px; color:var(--t3); font-family:var(--m); animation:fadeUp 0.8s var(--eo) 0.35s both; }
  .splash-steps { display:flex; gap:20px; justify-content:center; margin-top:10px; animation:fadeUp 0.8s var(--eo) 0.4s both; }
  .splash-step { font-size:10px; font-weight:600; color:var(--t4); display:flex; align-items:center; gap:4px; transition:color 0.4s; }
  .splash-step .dot { width:5px; height:5px; border-radius:50%; background:var(--t4); transition:all 0.4s; }
  .splash-step.done { color:var(--green); }
  .splash-step.done .dot { background:var(--green); }
  .splash-step.active { color:var(--cyan); }
  .splash-step.active .dot { background:var(--cyan); animation:pulse 1s ease-in-out infinite; }

  /* ════════════════════════════════════════
     SCREEN 2 — DASHBOARD
     ════════════════════════════════════════ */
  .dash-screen { flex-direction:column; }

  .topbar { position:sticky; top:0; z-index:100; height:56px; display:flex; align-items:center; justify-content:space-between; padding:0 24px; background:var(--surface); border-bottom:1px solid var(--border); backdrop-filter:blur(20px); }
  .topbar::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--cg),transparent); }
  .tb-left { display:flex; align-items:center; gap:14px; }
  .tb-logo { width:28px; height:28px; border-radius:8px; background:var(--card); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; }
  .tb-logo svg { width:14px; height:14px; color:var(--cyan); }
  .tb-brand { font-weight:700; font-size:15px; letter-spacing:-0.3px; }
  .tb-brand span { color:var(--cyan); }
  .tb-role-tag { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; padding:3px 8px; border-radius:5px; }
  .tb-right { display:flex; align-items:center; gap:8px; }
  .icon-btn { width:34px; height:34px; border-radius:8px; background:transparent; border:1px solid var(--border); color:var(--t3); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all var(--t); position:relative; }
  .icon-btn:hover { background:var(--cm); color:var(--cyan); border-color:rgba(6,182,212,0.2); }
  .icon-btn .notif { position:absolute; top:-2px; right:-2px; width:7px; height:7px; border-radius:50%; background:var(--red); border:1.5px solid var(--surface); }
  .avatar-btn { width:34px; height:34px; border-radius:10px; overflow:hidden; border:2px solid var(--border); cursor:pointer; transition:all var(--t); }
  .avatar-btn:hover { border-color:var(--cyan); }
  .avatar-btn img { width:100%; height:100%; object-fit:cover; }

  .shell { display:flex; flex:1; min-height:0; }

  /* Sidebar */
  .sidebar { width:220px; flex-shrink:0; background:var(--surface); border-right:1px solid var(--border); padding:16px 10px; display:flex; flex-direction:column; overflow-y:auto; }
  .sb-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--t3); padding:0 10px; margin:14px 0 4px; }
  .sb-label:first-child { margin-top:0; }
  .sb-item { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:var(--rs); color:var(--t3); font-size:12px; font-weight:500; cursor:pointer; transition:all var(--t); position:relative; }
  .sb-item:hover { background:var(--cm); color:var(--t1); }
  .sb-item.active { background:var(--cm); color:var(--cyan); }
  .sb-item.active::before { content:''; position:absolute; left:0; top:50%; transform:translateY(-50%); width:2.5px; height:14px; border-radius:0 2px 2px 0; background:var(--cyan); }
  .sb-item svg { width:14px; height:14px; flex-shrink:0; }
  .sb-badge { margin-left:auto; font-size:9px; font-weight:700; padding:1.5px 6px; border-radius:4px; }
  .sb-footer { margin-top:auto; padding:10px; border-top:1px solid var(--border); }
  .sb-user { display:flex; align-items:center; gap:8px; }
  .sb-avatar { width:28px; height:28px; border-radius:8px; overflow:hidden; flex-shrink:0; }
  .sb-avatar img { width:100%; height:100%; object-fit:cover; }
  .sb-name { font-size:12px; font-weight:600; }
  .sb-role { font-size:10px; color:var(--t3); }

  /* Main */
  .main { flex:1; display:flex; overflow:hidden; }
  .content { flex:1; padding:24px; overflow-y:auto; position:relative; }
  .content::before { content:''; position:fixed; top:-200px; right:-200px; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(6,182,212,0.02),transparent 70%); pointer-events:none; }

  .greeting { font-size:13px; color:var(--t3); font-weight:500; margin-bottom:4px; animation:fadeUp 0.5s var(--eo) both; }
  .greeting b { color:var(--cyan); }
  .page-title { font-size:22px; font-weight:700; letter-spacing:-0.4px; margin-bottom:4px; animation:fadeUp 0.5s var(--eo) 0.05s both; }
  .page-sub { font-size:12px; color:var(--t3); display:flex; align-items:center; gap:6px; margin-bottom:20px; animation:fadeUp 0.5s var(--eo) 0.1s both; }
  .live-dot { width:5px; height:5px; border-radius:50%; background:var(--green); animation:pulse 2s ease-in-out infinite; }

  /* KPI Grid */
  .kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
  .kpi-card { padding:18px; animation:cardReveal 0.5s var(--eo) both; }
  .kpi-card:nth-child(2){animation-delay:0.05s} .kpi-card:nth-child(3){animation-delay:0.1s} .kpi-card:nth-child(4){animation-delay:0.15s}
  .kpi-label { font-size:10px; color:var(--t3); font-weight:600; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .kpi-icon { width:24px; height:24px; border-radius:6px; display:flex; align-items:center; justify-content:center; }
  .kpi-icon svg { width:12px; height:12px; }
  .kpi-val { font-size:24px; font-weight:700; font-family:var(--m); letter-spacing:-0.8px; line-height:1; }
  .kpi-change { font-size:10px; font-weight:600; margin-top:4px; display:flex; align-items:center; gap:3px; }
  .kpi-change.up { color:var(--green); } .kpi-change.down { color:var(--red); }

  /* Charts placeholder */
  .charts-row { display:grid; grid-template-columns:5fr 3fr; gap:12px; margin-bottom:20px; }
  .chart-card { padding:20px; animation:cardReveal 0.5s var(--eo) 0.2s both; }
  .chart-card:nth-child(2) { animation-delay:0.25s; }
  .chart-title { font-size:13px; font-weight:700; letter-spacing:-0.2px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; }
  .chart-live { font-size:9px; font-weight:700; padding:3px 8px; border-radius:5px; background:var(--gm); color:var(--green); display:flex; align-items:center; gap:4px; }
  .chart-area { width:100%; height:140px; position:relative; border-radius:var(--rs); overflow:hidden; }
  .chart-bars { display:flex; align-items:flex-end; gap:4px; height:100%; padding:0 4px; }
  .chart-bar { flex:1; border-radius:3px 3px 0 0; transition:height 0.6s var(--eo); }

  /* Pipeline table */
  .table-card { padding:18px; animation:cardReveal 0.5s var(--eo) 0.3s both; margin-bottom:20px; }
  .table-title { font-size:13px; font-weight:700; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; }
  table { width:100%; border-collapse:collapse; }
  th { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--t3); text-align:left; padding:8px 10px; border-bottom:1px solid var(--border); }
  td { font-size:12px; padding:9px 10px; border-bottom:1px solid var(--border); }
  tr:hover td { background:rgba(6,182,212,0.02); }
  .status-pill { font-size:9px; font-weight:700; padding:2px 8px; border-radius:4px; text-transform:uppercase; letter-spacing:0.03em; }

  /* ════════════════════════════════════════
     TEAM MESSAGING PANEL (right side)
     ════════════════════════════════════════ */
  .chat-panel { width:300px; flex-shrink:0; border-left:1px solid var(--border); background:var(--surface); display:flex; flex-direction:column; animation:slideRight 0.5s var(--eo) 0.3s both; }
  .chat-header { padding:14px 16px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .chat-header-title { font-size:13px; font-weight:700; display:flex; align-items:center; gap:6px; }
  .chat-header-title svg { width:14px; height:14px; color:var(--cyan); }
  .online-count { font-size:10px; color:var(--green); font-weight:600; }

  .chat-channels { padding:8px 12px; border-bottom:1px solid var(--border); display:flex; gap:4px; }
  .channel-tab { padding:5px 12px; border-radius:6px; border:none; background:transparent; font-family:var(--f); font-size:11px; font-weight:600; color:var(--t3); cursor:pointer; transition:all var(--t); }
  .channel-tab:hover { color:var(--t2); }
  .channel-tab.active { background:var(--card); color:var(--t1); box-shadow:var(--glass); }

  .chat-messages { flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:10px; }
  .msg { display:flex; gap:8px; animation:fadeUp 0.4s var(--eo) both; }
  .msg:nth-child(2){animation-delay:0.05s} .msg:nth-child(3){animation-delay:0.1s} .msg:nth-child(4){animation-delay:0.15s} .msg:nth-child(5){animation-delay:0.2s}
  .msg-avatar { width:28px; height:28px; border-radius:8px; overflow:hidden; flex-shrink:0; }
  .msg-avatar img { width:100%; height:100%; object-fit:cover; }
  .msg-body { flex:1; }
  .msg-meta { display:flex; align-items:center; gap:6px; margin-bottom:2px; }
  .msg-name { font-size:11px; font-weight:700; }
  .msg-role { font-size:9px; font-weight:600; padding:1px 5px; border-radius:3px; }
  .msg-time { font-size:9px; color:var(--t3); font-family:var(--m); margin-left:auto; }
  .msg-text { font-size:12px; color:var(--t2); line-height:1.5; }
  .msg-text b { color:var(--t1); }

  .msg-action { margin-top:6px; padding:8px 12px; border-radius:var(--rs); border:1px solid var(--border); background:var(--card); font-size:11px; }
  .msg-action-title { font-weight:700; font-size:10px; text-transform:uppercase; letter-spacing:0.04em; color:var(--cyan); margin-bottom:3px; display:flex; align-items:center; gap:4px; }
  .msg-action-text { color:var(--t2); line-height:1.4; }

  .chat-input-wrap { padding:12px; border-top:1px solid var(--border); }
  .chat-input { display:flex; gap:8px; align-items:center; }
  .chat-input input { flex:1; padding:9px 14px; border-radius:8px; border:1px solid var(--border); background:var(--card); font-family:var(--f); font-size:12px; color:var(--t1); outline:none; transition:all var(--t); }
  .chat-input input:focus { border-color:var(--cyan); box-shadow:0 0 0 3px var(--cm); }
  .chat-input input::placeholder { color:var(--t3); }
  .chat-send { width:34px; height:34px; border-radius:8px; background:var(--cyan); border:none; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all var(--t); box-shadow:0 2px 8px var(--cg); }
  .chat-send:hover { filter:brightness(1.05); }
  .chat-send svg { width:14px; height:14px; }

  .typing-indicator { padding:4px 12px; font-size:10px; color:var(--t3); font-style:italic; display:flex; align-items:center; gap:4px; }
  .typing-dots { display:flex; gap:2px; }
  .typing-dots span { width:4px; height:4px; border-radius:50%; background:var(--t3); animation:typingBounce 1.2s ease-in-out infinite; }
  .typing-dots span:nth-child(2) { animation-delay:0.15s; }
  .typing-dots span:nth-child(3) { animation-delay:0.3s; }
  @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }

  /* ═══ ROLE-SPECIFIC COLORS ═══ */
  .role-cfo .tb-role-tag { background:var(--cm); color:var(--cyan); }
  .role-cfo .splash-role-tag { background:var(--cm); color:var(--cyan); }
  .role-ceo .tb-role-tag { background:var(--pm); color:var(--purple); }
  .role-ceo .splash-role-tag { background:var(--pm); color:var(--purple); }
  .role-ctrl .tb-role-tag { background:var(--gm); color:var(--green); }
  .role-ctrl .splash-role-tag { background:var(--gm); color:var(--green); }
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<div class="preview-badge">Corporate Spring Preview</div>

<!-- Role Switcher -->
<div class="role-switcher">
  <button class="role-btn active" onclick="switchRole('cfo')">CFO</button>
  <button class="role-btn" onclick="switchRole('ceo')">CEO</button>
  <button class="role-btn" onclick="switchRole('ctrl')">Controller</button>
</div>

<!-- ════════════════════════════════════════
     SCREEN 1 — SPLASH LOGIN
     ════════════════════════════════════════ -->
<div class="screen splash-screen active" id="splashScreen">
  <div class="splash-orb splash-orb-1"></div>
  <div class="splash-orb splash-orb-2"></div>

  <div class="splash-card glass">
    <div class="splash-logo">
      <div class="splash-logo-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2.5"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><polyline points="7 10 12 7 17 10"/></svg>
      </div>
      <div class="splash-logo-text">Finance<span>OS</span></div>
    </div>

    <div class="splash-title" id="splashTitle">Welcome back, Sarah</div>
    <div class="splash-sub" id="splashSub">Preparing your financial command center</div>

    <div class="splash-role-label">Logging in as</div>
    <div class="splash-role-tag" id="splashRoleTag">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span id="splashRoleName">Chief Financial Officer</span>
    </div>

    <div class="splash-progress"><div class="splash-fill" id="splashFill"></div></div>
    <div class="splash-status" id="splashStatusText">Verifying credentials...</div>

    <div class="splash-steps">
      <div class="splash-step" id="ss1"><div class="dot"></div> Auth</div>
      <div class="splash-step" id="ss2"><div class="dot"></div> Stripe</div>
      <div class="splash-step" id="ss3"><div class="dot"></div> Workspace</div>
      <div class="splash-step" id="ss4"><div class="dot"></div> Ready</div>
    </div>
  </div>
</div>

<!-- ════════════════════════════════════════
     SCREEN 2 — DASHBOARD + MESSAGING
     ════════════════════════════════════════ -->
<div class="screen dash-screen" id="dashScreen">
  <!-- Top Bar -->
  <div class="topbar">
    <div class="tb-left">
      <div class="tb-logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2.5"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><polyline points="7 10 12 7 17 10"/></svg></div>
      <div class="tb-brand">Finance<span>OS</span></div>
      <div class="tb-role-tag" id="tbRoleTag">CFO</div>
    </div>
    <div class="tb-right">
      <button class="icon-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
      <button class="icon-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg><div class="notif"></div></button>
      <div class="avatar-btn"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face" alt="avatar" /></div>
    </div>
  </div>

  <div class="shell">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sb-label">Dashboard</div>
      <div class="sb-item active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> Overview</div>
      <div class="sb-item" id="sbItem1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg> <span id="sbLabel1">P&L</span></div>
      <div class="sb-item" id="sbItem2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> <span id="sbLabel2">Forecast</span></div>
      <div class="sb-item" id="sbItem3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> <span id="sbLabel3">Scenarios</span></div>

      <div class="sb-label">Platform</div>
      <div class="sb-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> Team <div class="sb-badge" style="background:var(--gm);color:var(--green);">5</div></div>
      <div class="sb-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> Messages <div class="sb-badge" style="background:var(--cm);color:var(--cyan);">3</div></div>
      <div class="sb-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> Settings</div>

      <div class="sb-footer">
        <div class="sb-user">
          <div class="sb-avatar"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face" alt="" /></div>
          <div>
            <div class="sb-name" id="sbUserName">Sarah Chen</div>
            <div class="sb-role" id="sbUserRole">VP Finance</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main">
      <div class="content">
        <div class="greeting">Good morning, <b id="greetName">Sarah</b></div>
        <div class="page-title" id="dashTitle">CFO Command Center</div>
        <div class="page-sub"><div class="live-dot"></div> Live sync · <span id="dashDate">March 28, 2026</span></div>

        <!-- KPIs -->
        <div class="kpi-grid" id="kpiGrid">
          <!-- Injected by JS per role -->
        </div>

        <!-- Charts -->
        <div class="charts-row">
          <div class="chart-card glass">
            <div class="chart-title" id="chartTitle1">Revenue vs Forecast <div class="chart-live"><div style="width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse 2s infinite"></div> Live</div></div>
            <div class="chart-area">
              <div class="chart-bars" id="chartBars1"></div>
            </div>
          </div>
          <div class="chart-card glass">
            <div class="chart-title" id="chartTitle2">Burn Rate</div>
            <div class="chart-area">
              <div class="chart-bars" id="chartBars2"></div>
            </div>
          </div>
        </div>

        <!-- Pipeline -->
        <div class="table-card glass">
          <div class="table-title" id="tableTitle">Active Pipeline</div>
          <table>
            <thead><tr id="tableHead"></tr></thead>
            <tbody id="tableBody"></tbody>
          </table>
        </div>
      </div>

      <!-- Chat Panel -->
      <div class="chat-panel">
        <div class="chat-header">
          <div class="chat-header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Team Chat
          </div>
          <div class="online-count" id="onlineCount">5 online</div>
        </div>

        <div class="chat-channels">
          <button class="channel-tab active"># general</button>
          <button class="channel-tab"># finance</button>
          <button class="channel-tab"># close</button>
        </div>

        <div class="chat-messages" id="chatMessages">
          <!-- Injected by JS per role -->
        </div>

        <div class="typing-indicator" id="typingIndicator" style="display:none;">
          <div class="typing-dots"><span></span><span></span><span></span></div>
          <span id="typingName">Priya</span> is typing...
        </div>

        <div class="chat-input-wrap">
          <div class="chat-input">
            <input type="text" placeholder="Message #general..." />
            <button class="chat-send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



` }} />
    </>
  );
}
