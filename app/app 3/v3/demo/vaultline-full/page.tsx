'use client';

import { useEffect, useRef } from 'react';

export default function V3DemoVaultlineFullPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ─── Navigation ───
  function goTo(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-dot').forEach(d => {
      d.classList.toggle('active', d.dataset.screen === id);
    });
  }

  // ─── Onboarding Steps ───
  let currentStep = 1;
  function nextStep(n) {
    document.querySelectorAll('[id^="step-"]').forEach(s => s.style.display = 'none');
    document.getElementById('step-' + n).style.display = '';
    document.getElementById('step-' + n).style.animation = 'fadeUp 0.5s var(--ease-out) both';
    for (let i = 1; i <= 5; i++) {
      const dot = document.getElementById('dot-' + i);
      if (!dot) continue;
      dot.classList.remove('active', 'done');
      if (i < n) { dot.classList.add('done'); dot.innerHTML = '&#10003;'; }
      else if (i === n) { dot.classList.add('active'); }
      else { dot.innerHTML = i; }
    }
    currentStep = n;
  }

  function toggleBank(el) { el.classList.toggle('selected'); }
  function selectRole(el) {
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
  }

  function addInvite() {
    const input = document.getElementById('inviteInput');
    if (!input.value) return;
    const initials = input.value.split('@')[0].slice(0,2).toUpperCase();
    const list = document.getElementById('invitedList');
    const div = document.createElement('div');
    div.className = 'invited-person';
    div.style.animation = 'slideRight 0.3s var(--ease-out) both';
    div.innerHTML = \`<div class="invited-avatar">\${initials}</div><span class="invited-email">\${input.value}</span><span class="invited-role">Viewer</span>\`;
    list.appendChild(div);
    input.value = '';
    showToast('Invite sent');
  }

  // ─── Security ───
  function selectMfa(el, type) {
    document.querySelectorAll('.security-badge').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    showToast(type.charAt(0).toUpperCase() + type.slice(1) + ' selected');
  }

  // ─── Password Strength ───
  function checkPw(val) {
    const reqs = {
      len: val.length >= 8,
      upper: /[A-Z]/.test(val),
      num: /[0-9]/.test(val),
      special: /[^A-Za-z0-9]/.test(val)
    };
    const met = Object.values(reqs).filter(Boolean).length;
    const fill = document.getElementById('pwFill');
    const label = document.getElementById('pwLabel');
    const colors = ['var(--red)','var(--amber)','var(--amber)','var(--green)','var(--green)'];
    const labels = ['','Weak','Fair','Good','Strong'];
    fill.style.width = (met * 25) + '%';
    fill.style.background = colors[met] || 'var(--red)';
    label.textContent = val.length > 0 ? labels[met] : '';
    label.style.color = colors[met] || 'var(--t3)';
    Object.keys(reqs).forEach(k => {
      const el = document.getElementById('req-' + k);
      if (el) {
        el.classList.toggle('met', reqs[k]);
        el.querySelector('svg').innerHTML = reqs[k]
          ? '<polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" fill="none"/>'
          : '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" fill="none"/>';
      }
    });
  }

  function validateSignup() {
    const pw = document.getElementById('pwInput');
    const terms = document.getElementById('termsBox');
    if (!pw || pw.value.length < 8) {
      showToast('Password must be at least 8 characters');
      return;
    }
    if (!terms || !terms.checked) {
      showToast('Please accept the terms to continue');
      return;
    }
    goTo('screen-onboard');
  }

  // ─── Paywall ───
  let billingCycle = 'monthly';
  const prices = {
    monthly: { starter:'$499', growth:'$1,299', enterprise:'$2,499' },
    annual: { starter:'$399', growth:'$1,039', enterprise:'$1,999' }
  };
  function setBilling(cycle, el) {
    billingCycle = cycle;
    document.querySelectorAll('.paywall-toggle-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    const p = prices[cycle];
    document.getElementById('price-starter').innerHTML = p.starter + '<span>/mo</span>';
    document.getElementById('price-growth').innerHTML = p.growth + '<span>/mo</span>';
    document.getElementById('price-enterprise').innerHTML = p.enterprise + '<span>/mo</span>';
  }

  function selectPlan(plan) {
    if (plan === 'enterprise') {
      showToast('Sales team will be in touch');
      setTimeout(() => launchSetup(), 1000);
    } else {
      showToast(plan.charAt(0).toUpperCase() + plan.slice(1) + ' plan selected');
      setTimeout(() => launchSetup(), 600);
    }
  }

  function launchSetup() {
    // Switch to onboard screen to show loading
    goTo('screen-onboard');
    document.querySelectorAll('[id^="step-"]').forEach(s => s.style.display = 'none');
    const loading = document.getElementById('step-loading');
    loading.style.display = '';
    loading.style.animation = 'fadeUp 0.5s var(--ease-out) both';

    const checks = ['chk-1','chk-2','chk-3','chk-4','chk-5'];
    const labels = ['Creating workspace...','Connecting banks...','Syncing transactions...','Building dashboard...','Applying preferences...'];
    let i = 0;
    const interval = setInterval(() => {
      if (i < checks.length) {
        document.getElementById(checks[i]).classList.add('done');
        document.getElementById('setupStatus').textContent = labels[Math.min(i+1, labels.length-1)];
        i++;
      } else {
        clearInterval(interval);
        document.getElementById('setupStatus').textContent = 'Your dashboard is ready!';
        document.querySelector('.setup-spinner').style.display = 'none';
        setTimeout(() => goTo('screen-dashboard'), 800);
      }
    }, 700);
  }

  // ─── Dashboard ───
  function switchDashView(view, el) {
    document.querySelectorAll('.topbar-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    showToast(view.charAt(0).toUpperCase() + view.slice(1) + ' view');
  }

  // ─── Toast ───
  let tt;
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerHTML = \`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> \${msg}\`;
    t.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove('show'), 2200);
  }

  // ─── Customize Panel ───
  function togglePanel(){document.getElementById('overlay').classList.toggle('open');document.getElementById('panel').classList.toggle('open');}

  const WIDGETS=[
    {id:'total-cash',name:'Total Cash',icon:'$',color:'cyan',on:true},
    {id:'net-flow',name:'Net Cash Flow',icon:'~',color:'green',on:true},
    {id:'payables',name:'Payables Due',icon:'!',color:'amber',on:true},
    {id:'forecast-accuracy',name:'Forecast Accuracy',icon:'%',color:'purple',on:true},
    {id:'cash-trend',name:'Cash Trend Chart',icon:'^',color:'cyan',on:true},
    {id:'accounts',name:'Bank Accounts',icon:'#',color:'green',on:true},
    {id:'activity',name:'Activity Feed',icon:'*',color:'cyan',on:true},
    {id:'forecast',name:'30-Day Forecast',icon:'>',color:'purple',on:true},
    {id:'alerts',name:'Alerts',icon:'!',color:'amber',on:true},
  ];
  const cMap={cyan:{bg:'var(--cyan-muted)',fg:'var(--cyan)'},green:{bg:'var(--green-muted)',fg:'var(--green)'},amber:{bg:'var(--amber-muted)',fg:'var(--amber)'},purple:{bg:'var(--purple-muted)',fg:'var(--purple)'}};

  const THEMES={
    dark:{'--bg':'#0B1121','--surface':'#0F172A','--card':'#1E293B','--elevated':'#263548','--border':'rgba(148,163,184,0.08)','--border-hover':'rgba(148,163,184,0.16)','--t1':'#F1F5F9','--t2':'#94A3B8','--t3':'#64748B','--glass-shadow':'0 1px 2px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)',light:false},
    light:{'--bg':'#F8FAFC','--surface':'#F1F5F9','--card':'#FFFFFF','--elevated':'#FFFFFF','--border':'rgba(15,23,42,0.06)','--border-hover':'rgba(15,23,42,0.12)','--t1':'#0F172A','--t2':'#475569','--t3':'#94A3B8','--glass-shadow':'0 1px 2px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.6)',light:true},
    midnight:{'--bg':'#0c1445','--surface':'#111952','--card':'#1a1f5e','--elevated':'#252a6e','--border':'rgba(148,163,184,0.06)','--border-hover':'rgba(148,163,184,0.14)','--t1':'#E8EAFF','--t2':'#9BA2D0','--t3':'#6B73A8','--glass-shadow':'0 1px 2px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',light:false}
  };
  let currentTheme='light', currentAccent='#06B6D4';

  function setTheme(theme,el){
    document.querySelectorAll('#themeDark,#themeLight,#themeMidnight').forEach(e=>e.classList.remove('active'));
    el.classList.add('active');const t=THEMES[theme];if(!t)return;currentTheme=theme;
    const s=document.documentElement.style;Object.keys(t).forEach(k=>{if(k.startsWith('--'))s.setProperty(k,t[k]);});
    reapplyAccentGlow();showToast(theme.charAt(0).toUpperCase()+theme.slice(1)+' theme');
  }

  function hexToRgb(hex){return[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];}

  function setAccent(color,el){
    document.querySelectorAll('.accent-dot').forEach(e=>e.classList.remove('active'));
    el.classList.add('active');currentAccent=color;
    const[r,g,b]=hexToRgb(color);const s=document.documentElement.style;
    s.setProperty('--cyan',color);s.setProperty('--cyan-muted',\`rgba(\${r},\${g},\${b},0.1)\`);s.setProperty('--cyan-glow',\`rgba(\${r},\${g},\${b},0.15)\`);
    reapplyAccentGlow();showToast('Accent updated');
  }

  function reapplyAccentGlow(){
    const[r,g,b]=hexToRgb(currentAccent);
    let gs=document.getElementById('accentGlowStyle');
    if(!gs){gs=document.createElement('style');gs.id='accentGlowStyle';document.head.appendChild(gs);}
    gs.textContent=\`
      .main::before{background:radial-gradient(circle,rgba(\${r},\${g},\${b},0.08),transparent 70%)!important;opacity:0.3!important;}
      .topbar::after{background:linear-gradient(90deg,transparent,rgba(\${r},\${g},\${b},0.12),transparent)!important;}
      .sidebar-item.active{background:rgba(\${r},\${g},\${b},0.1)!important;color:\${currentAccent}!important;}
      .sidebar-item.active::before{background:\${currentAccent}!important;}
      .sidebar-item:hover{background:rgba(\${r},\${g},\${b},0.06)!important;}
      .sidebar-badge{background:rgba(\${r},\${g},\${b},0.1)!important;color:\${currentAccent}!important;}
      .icon-btn:hover{background:rgba(\${r},\${g},\${b},0.1)!important;color:\${currentAccent}!important;border-color:rgba(\${r},\${g},\${b},0.2)!important;}
      .btn-cyan{background:\${currentAccent}!important;box-shadow:0 2px 8px rgba(\${r},\${g},\${b},0.2)!important;}
      .btn-ghost:hover{background:rgba(\${r},\${g},\${b},0.05)!important;}
      .panel-header-icon{background:rgba(\${r},\${g},\${b},0.1)!important;color:\${currentAccent}!important;}
      .preset-btn.active{border-color:rgba(\${r},\${g},\${b},0.3)!important;background:rgba(\${r},\${g},\${b},0.06)!important;}
      .option-card.active{border-color:rgba(\${r},\${g},\${b},0.3)!important;background:rgba(\${r},\${g},\${b},0.06)!important;}
    \`;
  }

  function shiftHue(hex,deg){let[r,g,b]=hexToRgb(hex);r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0,s=max===0?0:d/max,v=max;if(d!==0){if(max===r)h=((g-b)/d+(g<b?6:0))/6;else if(max===g)h=((b-r)/d+2)/6;else h=((r-g)/d+4)/6;}h=((h*360+deg)%360)/360;const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t2=v*(1-(1-f)*s);let r2,g2,b2;switch(i%6){case 0:r2=v;g2=t2;b2=p;break;case 1:r2=q;g2=v;b2=p;break;case 2:r2=p;g2=v;b2=t2;break;case 3:r2=p;g2=q;b2=v;break;case 4:r2=t2;g2=p;b2=v;break;case 5:r2=v;g2=p;b2=q;break;}return\`#\${Math.round(r2*255).toString(16).padStart(2,'0')}\${Math.round(g2*255).toString(16).padStart(2,'0')}\${Math.round(b2*255).toString(16).padStart(2,'0')}\`;}

  function setLayout(layout,el){el.parentElement.querySelectorAll('.option-card').forEach(e=>e.classList.remove('active'));el.classList.add('active');const m=document.getElementById('dashboardMain');m.classList.remove('layout-compact','layout-wide');if(layout!=='default')m.classList.add('layout-'+layout);showToast(layout+' layout');}

  function setDensity(density,el){el.parentElement.querySelectorAll('.option-card').forEach(e=>e.classList.remove('active'));el.classList.add('active');const m=document.getElementById('dashboardMain');m.classList.remove('density-comfortable','density-compact');m.classList.add('density-'+density);showToast(density+' density');}

  function renderWidgetToggles(){document.getElementById('widgetToggles').innerHTML=WIDGETS.map(w=>{const c=cMap[w.color]||cMap.cyan;return\`<div class="widget-toggle"><div class="widget-toggle-info"><div class="widget-toggle-icon" style="background:\${c.bg};color:\${c.fg};">\${w.icon}</div><div class="widget-toggle-name">\${w.name}</div></div><div class="switch \${w.on?'on':''}" onclick="toggleWidget('\${w.id}',this)"></div></div>\`;}).join('');}

  function toggleWidget(id,el){const w=WIDGETS.find(x=>x.id===id);w.on=!w.on;el.classList.toggle('on');document.querySelectorAll(\`[data-widget="\${id}"]\`).forEach(card=>{if(w.on){card.classList.remove('widget-hidden');card.style.animation='cardReveal 0.4s var(--ease-out) both';}else{card.classList.add('widget-hidden');}});showToast(w.on?w.name+' shown':w.name+' hidden');}

  function applyPreset(role,el){
    document.querySelectorAll('.preset-btn').forEach(e=>e.classList.remove('active'));el.classList.add('active');
    WIDGETS.forEach(w=>w.on=true);
    const hide={cfo:[],analyst:['forecast-accuracy'],controller:['cash-trend','alerts'],vp:['payables','accounts']}[role]||[];
    hide.forEach(id=>{const w=WIDGETS.find(x=>x.id===id);if(w)w.on=false;});
    WIDGETS.forEach(w=>{document.querySelectorAll(\`[data-widget="\${w.id}"]\`).forEach(card=>{card.classList.toggle('widget-hidden',!w.on);if(w.on)card.style.animation='cardReveal 0.4s var(--ease-out) both';});});
    renderWidgetToggles();showToast(role.toUpperCase()+' preset applied');
  }

  function resetAll(){
    WIDGETS.forEach(w=>w.on=true);document.querySelectorAll('[data-widget]').forEach(c=>{c.classList.remove('widget-hidden');c.style.animation='cardReveal 0.4s var(--ease-out) both';});
    currentTheme='light';currentAccent='#06B6D4';
    const s=document.documentElement.style;Object.keys(THEMES.light).forEach(k=>{if(k.startsWith('--'))s.setProperty(k,THEMES.light[k]);});
    s.setProperty('--cyan','#06B6D4');s.setProperty('--cyan-muted','rgba(6,182,212,0.08)');s.setProperty('--cyan-glow','rgba(6,182,212,0.06)');
    reapplyAccentGlow();const m=document.getElementById('dashboardMain');m.classList.remove('layout-compact','layout-wide','density-compact');
    renderWidgetToggles();
    document.querySelectorAll('.preset-btn')[0].click();
    document.getElementById('themeLight').classList.add('active');document.getElementById('themeDark').classList.remove('active');document.getElementById('themeMidnight').classList.remove('active');
    document.querySelectorAll('.accent-dot').forEach((e,i)=>e.classList.toggle('active',i===0));
    showToast('Reset to defaults');
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
    --bg: #F8FAFC; --surface: #F1F5F9; --card: #FFFFFF; --elevated: #FFFFFF;
    --border: rgba(15,23,42,0.06); --border-hover: rgba(15,23,42,0.12);
    --t1: #0F172A; --t2: #475569; --t3: #94A3B8;
    --cyan: #06B6D4; --cyan-muted: rgba(6,182,212,0.08); --cyan-glow: rgba(6,182,212,0.06);
    --green: #059669; --green-muted: rgba(5,150,105,0.08);
    --amber: #D97706; --amber-muted: rgba(217,119,6,0.08);
    --red: #DC2626; --red-muted: rgba(220,38,38,0.08);
    --purple: #7C3AED; --purple-muted: rgba(124,58,237,0.08);
    --radius: 12px; --radius-sm: 8px;
    --glass-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04);
    --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --mono: 'JetBrains Mono', 'SF Mono', monospace;
    --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  }

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

  body { font-family: var(--font); background: var(--bg); color: var(--t1); min-height: 100vh; overflow-x: hidden; }

  /* ─── SCREEN SYSTEM ─── */
  .screen { display: none; min-height: 100vh; animation: screenIn 0.5s var(--ease-out) both; }
  .screen.active { display: flex; }
  @keyframes screenIn { 0% { opacity: 0; transform: scale(0.98); } 100% { opacity: 1; transform: scale(1); } }

  /* ─── SHARED ─── */
  .glass { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--glass-shadow); position: relative; overflow: hidden; }
  .glass::before { content:''; position:absolute;top:0;left:0;right:0;height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent); }
  .glass:hover { border-color: var(--border-hover); }

  .btn { padding:10px 22px; border-radius:10px; border:none; font-family:var(--font); font-size:14px; font-weight:600; cursor:pointer; transition:all var(--transition); display:inline-flex; align-items:center; gap:8px; }
  .btn-cyan { background:var(--cyan); color:white; box-shadow:0 2px 8px var(--cyan-glow); }
  .btn-cyan:hover { filter:brightness(1.05); box-shadow:0 4px 12px var(--cyan-glow); }
  .btn-cyan:disabled { opacity:0.5; cursor:not-allowed; transform:none; filter:none; }
  .btn-ghost { background:transparent; color:var(--t2); border:1px solid var(--border); }
  .btn-ghost:hover { border-color:var(--border-hover); color:var(--t1); }
  .btn-lg { padding:14px 32px; font-size:15px; border-radius:12px; }
  .btn-sm { padding:7px 14px; font-size:12px; border-radius:8px; }

  .input-wrap { position:relative; margin-bottom:16px; }
  .input-label { font-size:12px; font-weight:600; color:var(--t2); margin-bottom:6px; display:block; }
  .input-field { width:100%; padding:12px 16px; background:var(--bg); border:1px solid var(--border); border-radius:10px; color:var(--t1); font-family:var(--font); font-size:14px; outline:none; transition:all var(--transition); }
  .input-field:focus { border-color:var(--cyan); box-shadow:0 0 0 3px var(--cyan-muted); }
  .input-field::placeholder { color:var(--t3); }

  select.input-field { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:36px; }

  .logo-svg { width:40px; height:40px; }

  .tag { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; padding:4px 10px; border-radius:6px; }

  /* ─── ANIMATIONS ─── */
  @keyframes fadeUp { 0% { opacity:0; transform:translateY(20px); } 100% { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { 0% { opacity:0; } 100% { opacity:1; } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes drawLine { 0% { stroke-dashoffset:600; } 100% { stroke-dashoffset:0; } }
  @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes checkPop { 0% { transform:scale(0); } 50% { transform:scale(1.2); } 100% { transform:scale(1); } }
  @keyframes slideRight { 0% { transform:translateX(-20px); opacity:0; } 100% { transform:translateX(0); opacity:1; } }
  @keyframes progressFill { 0% { width:0; } 100% { width:var(--target); } }
  .fade-up { animation: fadeUp 0.6s var(--ease-out) both; }
  .fade-up-d1 { animation-delay:0.08s; }
  .fade-up-d2 { animation-delay:0.16s; }
  .fade-up-d3 { animation-delay:0.24s; }
  .fade-up-d4 { animation-delay:0.32s; }
  .fade-up-d5 { animation-delay:0.4s; }

  /* ─── TOAST ─── */
  .toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(80px); background:var(--card); border:1px solid rgba(6,182,212,0.2); color:var(--t1); padding:12px 24px; border-radius:12px; font-size:13px; font-weight:600; z-index:999; box-shadow:0 8px 30px rgba(0,0,0,0.3); opacity:0; transition:all 0.4s var(--ease-out); display:flex; align-items:center; gap:8px; }
  .toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

  /* ─── CUSTOMIZE PANEL ─── */
  .customize-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;opacity:0;pointer-events:none;transition:opacity 0.3s ease;backdrop-filter:blur(4px)}
  .customize-overlay.open{opacity:1;pointer-events:all}
  .customize-panel{position:fixed;top:0;right:-380px;width:380px;height:100vh;background:var(--card);border-left:1px solid var(--border);z-index:201;overflow-y:auto;padding:24px;transition:right 0.35s var(--ease-out);box-shadow:-8px 0 30px rgba(0,0,0,0.1)}
  .customize-panel.open{right:0}
  .panel-close{position:absolute;top:16px;right:16px;width:28px;height:28px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--t3);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all var(--transition)}
  .panel-close:hover{background:var(--red-muted);color:var(--red);border-color:rgba(239,68,68,0.2)}
  .panel-header{display:flex;align-items:center;gap:12px;margin-bottom:4px}
  .panel-header-icon{width:36px;height:36px;border-radius:10px;background:var(--cyan-muted);color:var(--cyan);display:flex;align-items:center;justify-content:center}
  .panel-title{font-size:16px;font-weight:700;letter-spacing:-0.2px}
  .panel-sub{font-size:12px;color:var(--t3);margin-bottom:20px}
  .panel-section{margin-bottom:20px}
  .panel-section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--t3);margin-bottom:10px}
  .preset-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .preset-btn{padding:12px;border-radius:10px;border:1px solid var(--border);background:transparent;cursor:pointer;text-align:left;transition:all var(--transition)}
  .preset-btn:hover{border-color:var(--border-hover)}
  .preset-btn.active{border-color:rgba(6,182,212,0.3);background:var(--cyan-muted)}
  .preset-btn-icon{font-size:18px;margin-bottom:4px}
  .preset-btn-title{font-size:12px;font-weight:700;color:var(--t1)}
  .preset-btn-sub{font-size:10px;color:var(--t3)}
  .option-row{display:flex;gap:8px}
  .option-card{flex:1;padding:10px;border-radius:8px;border:1px solid var(--border);background:transparent;cursor:pointer;text-align:center;transition:all var(--transition)}
  .option-card:hover{border-color:var(--border-hover)}
  .option-card.active{border-color:rgba(6,182,212,0.3);background:var(--cyan-muted)}
  .option-swatch{width:24px;height:24px;border-radius:6px;margin:0 auto 6px;border:1px solid var(--border)}
  .option-label{font-size:11px;font-weight:600;color:var(--t2)}
  .accent-row{display:flex;gap:8px;flex-wrap:wrap}
  .accent-dot{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all var(--transition);box-shadow:0 2px 6px rgba(0,0,0,0.1)}
  .accent-dot:hover{transform:scale(1.15)}
  .accent-dot.active{border-color:var(--t1);box-shadow:0 0 0 3px var(--cyan-muted)}
  .widget-toggle{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)}
  .widget-toggle:last-child{border:none}
  .widget-toggle-info{display:flex;align-items:center;gap:8px}
  .widget-toggle-icon{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700}
  .widget-toggle-name{font-size:12px;font-weight:600}
  .widget-hidden{display:none!important}
  @keyframes cardReveal{0%{opacity:0;transform:translateY(8px) scale(0.98)}100%{opacity:1;transform:translateY(0) scale(1)}}
  .layout-compact .stats-grid,.layout-compact .charts-grid,.layout-compact .bottom-grid{gap:8px}
  .layout-wide .stats-grid{grid-template-columns:repeat(2,1fr)}.layout-wide .charts-grid{grid-template-columns:1fr}
  .density-compact .stat-card,.density-compact .chart-card,.density-compact .bottom-card{padding:12px}

  /* ════════════════════════════════════════════
     SCREEN 1 — SIGNUP
     ════════════════════════════════════════════ */
  .signup-screen { flex-direction:column; align-items:center; justify-content:center; padding:40px 20px; position:relative; }
  .signup-screen::before { content:''; position:absolute; top:-200px; right:-200px; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle, var(--cyan-glow), transparent 70%); opacity:0.15; }
  .signup-screen::after { content:''; position:absolute; bottom:-150px; left:-150px; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle, var(--purple-muted), transparent 70%); opacity:0.1; }

  .signup-card { width:100%; max-width:440px; padding:40px; position:relative; z-index:1; }
  .signup-logo { display:flex; align-items:center; gap:12px; margin-bottom:32px; justify-content:center; }
  .signup-logo-text { font-size:22px; font-weight:700; letter-spacing:-0.4px; }
  .signup-title { font-size:24px; font-weight:700; text-align:center; margin-bottom:6px; letter-spacing:-0.4px; }
  .signup-sub { font-size:13px; color:var(--t3); text-align:center; margin-bottom:28px; }

  .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
  .divider-line { flex:1; height:1px; background:var(--border); }
  .divider-text { font-size:11px; color:var(--t3); font-weight:600; text-transform:uppercase; letter-spacing:0.06em; }

  .social-btns { display:flex; gap:8px; }
  .social-btn { flex:1; padding:10px; border-radius:10px; background:var(--bg); border:1px solid var(--border); color:var(--t2); font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all var(--transition); font-family:var(--font); }
  .social-btn:hover { border-color:var(--border-hover); color:var(--t1); }

  .signup-footer { text-align:center; margin-top:20px; font-size:12px; color:var(--t3); }
  .signup-footer a { color:var(--cyan); text-decoration:none; font-weight:600; }
  .signup-footer a:hover { text-decoration:underline; }

  /* Password strength */
  .pw-strength { display:flex; align-items:center; gap:10px; margin-top:8px; }
  .pw-bar { flex:1; height:4px; border-radius:2px; background:var(--border); overflow:hidden; }
  .pw-fill { height:100%; border-radius:2px; width:0; transition:width 0.3s ease, background 0.3s ease; }
  .pw-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; min-width:50px; }
  .pw-reqs { display:grid; grid-template-columns:1fr 1fr; gap:4px 12px; margin-top:8px; }
  .pw-req { font-size:11px; color:var(--t3); display:flex; align-items:center; gap:5px; transition:color 0.2s ease; }
  .pw-req.met { color:var(--green); }
  .pw-req.met svg { stroke:var(--green); }

  /* Terms */
  .terms-check { display:flex; align-items:flex-start; gap:10px; margin:16px 0 4px; }
  .terms-checkbox { width:18px; height:18px; border-radius:4px; border:2px solid var(--border); appearance:none; -webkit-appearance:none; cursor:pointer; flex-shrink:0; margin-top:1px; transition:all 0.2s ease; background:var(--bg); }
  .terms-checkbox:checked { background:var(--cyan); border-color:var(--cyan); }
  .terms-checkbox:checked::after { content:'\\2713'; display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:700; height:100%; }
  .terms-label { font-size:12px; color:var(--t3); line-height:1.5; }
  .terms-label a { color:var(--cyan); text-decoration:none; font-weight:600; }
  .terms-label a:hover { text-decoration:underline; }

  /* 2FA / Security step */
  .security-badge { display:flex; align-items:center; gap:10px; padding:14px 18px; border-radius:10px; border:1px solid var(--border); background:var(--bg); margin-bottom:10px; cursor:pointer; transition:all var(--transition); }
  .security-badge:hover { border-color:var(--cyan); }
  .security-badge.selected { border-color:var(--cyan); background:var(--cyan-muted); }
  .security-badge-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .security-badge-icon svg { width:20px; height:20px; }
  .security-badge-title { font-size:13px; font-weight:700; }
  .security-badge-sub { font-size:11px; color:var(--t3); margin-top:1px; }
  .security-badge-tag { margin-left:auto; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; padding:3px 8px; border-radius:5px; flex-shrink:0; }

  /* Paywall / Plan selection */
  .paywall-screen { flex-direction:column; align-items:center; justify-content:center; padding:40px 20px; }
  .paywall-container { width:100%; max-width:900px; text-align:center; }
  .paywall-title { font-size:28px; font-weight:700; letter-spacing:-0.5px; margin-bottom:6px; }
  .paywall-sub { font-size:14px; color:var(--t3); margin-bottom:32px; }
  .paywall-toggle { display:inline-flex; background:var(--bg); border:1px solid var(--border); border-radius:8px; padding:3px; margin-bottom:28px; }
  .paywall-toggle-btn { padding:7px 20px; border-radius:6px; border:none; background:none; font-family:var(--font); font-size:12px; font-weight:600; color:var(--t3); cursor:pointer; transition:all 0.2s ease; }
  .paywall-toggle-btn.active { background:var(--card); color:var(--t1); box-shadow:0 1px 4px rgba(0,0,0,0.12); }
  .paywall-save { font-size:10px; font-weight:700; color:var(--green); text-transform:uppercase; letter-spacing:0.04em; margin-left:6px; }
  .plan-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; text-align:left; }
  .plan-card { padding:28px; border-radius:12px; background:var(--card); border:1px solid var(--border); position:relative; transition:all 0.2s ease; }
  .plan-card:hover { border-color:var(--border-hover); }
  .plan-card.featured { border-color:var(--cyan); box-shadow:0 0 0 1px var(--cyan), 0 4px 16px rgba(6,182,212,0.1); }
  .plan-popular { position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:var(--cyan); color:white; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; padding:3px 12px; border-radius:4px; }
  .plan-name { font-size:14px; font-weight:700; margin-bottom:4px; }
  .plan-price { font-size:32px; font-weight:700; font-family:var(--mono); letter-spacing:-1px; margin-bottom:2px; }
  .plan-price span { font-size:14px; font-weight:500; color:var(--t3); letter-spacing:0; }
  .plan-desc { font-size:12px; color:var(--t3); margin-bottom:20px; line-height:1.5; }
  .plan-features { list-style:none; margin-bottom:24px; }
  .plan-features li { font-size:12px; color:var(--t2); padding:5px 0; display:flex; align-items:center; gap:8px; }
  .plan-features li svg { width:14px; height:14px; color:var(--green); flex-shrink:0; }
  .plan-btn { width:100%; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg); font-family:var(--font); font-size:13px; font-weight:600; color:var(--t2); cursor:pointer; transition:all 0.2s ease; }
  .plan-btn:hover { border-color:var(--cyan); color:var(--t1); }
  .plan-btn.primary { background:var(--cyan); color:white; border-color:var(--cyan); }
  .plan-btn.primary:hover { filter:brightness(1.05); }
  .paywall-guarantee { display:flex; align-items:center; justify-content:center; gap:8px; margin-top:24px; font-size:12px; color:var(--t3); }
  .paywall-guarantee svg { width:16px; height:16px; color:var(--green); }

  .signup-trust { display:flex; align-items:center; justify-content:center; gap:8px; margin-top:32px; position:relative; z-index:1; }
  .signup-trust-item { display:flex; align-items:center; gap:6px; font-size:10px; color:var(--t2); font-weight:600; letter-spacing:0.02em; text-transform:uppercase; padding:6px 14px; border-radius:6px; border:1px solid var(--border); background:var(--card); }
  .signup-trust-icon { width:14px; height:14px; color:var(--cyan); }

  /* ════════════════════════════════════════════
     SCREEN 2 — ONBOARDING
     ════════════════════════════════════════════ */
  .onboard-screen { flex-direction:column; align-items:center; padding:40px 20px; }
  .onboard-container { width:100%; max-width:700px; }

  .onboard-progress { display:flex; align-items:center; gap:0; margin-bottom:40px; padding:0 20px; }
  .onboard-step { display:flex; align-items:center; gap:8px; flex:1; position:relative; }
  .onboard-step::after { content:''; flex:1; height:2px; background:var(--border); margin:0 8px; }
  .onboard-step:last-child::after { display:none; }
  .step-dot { width:32px; height:32px; border-radius:50%; background:var(--card); border:2px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:var(--t3); transition:all var(--transition); flex-shrink:0; }
  .step-dot.active { background:var(--cyan); border-color:var(--cyan); color:white; }
  .step-dot.done { background:var(--green); border-color:var(--green); color:white; }
  .step-label { font-size:11px; font-weight:600; color:var(--t3); white-space:nowrap; }
  .step-dot.active + .step-label, .step-dot.done + .step-label { color:var(--t1); }

  .onboard-card { padding:36px; }
  .onboard-title { font-size:20px; font-weight:700; margin-bottom:6px; letter-spacing:-0.3px; }
  .onboard-sub { font-size:13px; color:var(--t3); margin-bottom:28px; }

  .onboard-actions { display:flex; justify-content:space-between; margin-top:28px; }

  /* Company fields */
  .field-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

  /* Bank connection cards */
  .bank-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
  .bank-card { padding:16px; border-radius:var(--radius-sm); background:var(--bg); border:1px solid var(--border); cursor:pointer; transition:all var(--transition); display:flex; align-items:center; gap:12px; }
  .bank-card:hover { border-color:var(--cyan); }
  .bank-card.selected { border-color:var(--cyan); background:var(--cyan-muted); }
  .bank-logo { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; }
  .bank-name { font-size:13px; font-weight:600; }
  .bank-sub { font-size:11px; color:var(--t3); }
  .bank-check { width:20px; height:20px; border-radius:50%; border:2px solid var(--border); margin-left:auto; transition:all var(--transition); display:flex; align-items:center; justify-content:center; }
  .bank-card.selected .bank-check { background:var(--cyan); border-color:var(--cyan); }

  /* Role cards */
  .role-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .role-card { padding:20px; border-radius:var(--radius-sm); background:var(--bg); border:1px solid var(--border); cursor:pointer; transition:all var(--transition); text-align:center; }
  .role-card:hover { border-color:var(--cyan); }
  .role-card.selected { border-color:var(--cyan); background:var(--cyan-muted); }
  .role-icon { font-size:28px; margin-bottom:8px; }
  .role-name { font-size:14px; font-weight:700; margin-bottom:2px; }
  .role-desc { font-size:11px; color:var(--t3); }

  /* Team invite */
  .invite-row { display:flex; gap:8px; margin-bottom:10px; }
  .invite-row .input-field { flex:1; margin:0; }
  .invited-list { margin-top:16px; }
  .invited-person { display:flex; align-items:center; gap:10px; padding:10px 14px; background:var(--bg); border-radius:var(--radius-sm); margin-bottom:6px; }
  .invited-avatar { width:28px; height:28px; border-radius:50%; background:var(--cyan-muted); color:var(--cyan); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; }
  .invited-email { font-size:13px; color:var(--t2); flex:1; }
  .invited-role { font-size:11px; color:var(--t3); background:var(--elevated); padding:3px 8px; border-radius:5px; }

  /* Loading screen */
  .setup-loading { text-align:center; padding:60px 0; }
  .setup-spinner { width:48px; height:48px; border:3px solid var(--border); border-top-color:var(--cyan); border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 24px; }
  .setup-status { font-size:14px; color:var(--t2); margin-bottom:20px; }
  .setup-checklist { text-align:left; max-width:300px; margin:0 auto; }
  .setup-check-item { display:flex; align-items:center; gap:10px; padding:8px 0; font-size:13px; color:var(--t3); }
  .setup-check-item.done { color:var(--green); }
  .setup-check-item .check-icon { width:20px; height:20px; border-radius:50%; border:2px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .setup-check-item.done .check-icon { background:var(--green); border-color:var(--green); animation:checkPop 0.3s var(--ease-out); }

  /* ════════════════════════════════════════════
     SCREEN 3 — DASHBOARD
     ════════════════════════════════════════════ */
  .dash-screen { flex-direction:column; }

  .topbar { position:sticky; top:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0 24px; height:56px; background:var(--surface); border-bottom:1px solid var(--border); backdrop-filter:blur(24px); }
  .topbar::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--cyan-glow),transparent); }
  .topbar-left { display:flex; align-items:center; gap:14px; }
  .topbar-logo { width:30px; height:30px; }
  .topbar-brand { font-weight:700; font-size:16px; letter-spacing:-0.2px; }
  .topbar-center { display:flex; align-items:center; gap:2px; background:var(--bg); border-radius:9px; padding:3px; border:1px solid var(--border); }
  .topbar-tab { padding:5px 14px; border-radius:6px; font-size:12px; font-weight:600; color:var(--t3); cursor:pointer; border:none; background:none; font-family:var(--font); transition:all var(--transition); }
  .topbar-tab:hover { color:var(--t2); }
  .topbar-tab.active { background:var(--card); color:var(--t1); box-shadow:0 1px 4px rgba(0,0,0,0.15); }
  .topbar-right { display:flex; align-items:center; gap:8px; }

  .icon-btn { width:34px; height:34px; border-radius:8px; background:transparent; border:1px solid var(--border); color:var(--t3); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all var(--transition); position:relative; }
  .icon-btn:hover { background:var(--cyan-muted); color:var(--cyan); border-color:rgba(6,182,212,0.2); }
  .notif-badge { position:absolute; top:-2px; right:-2px; width:7px; height:7px; border-radius:50%; background:var(--cyan); border:2px solid var(--surface); }

  .shell { display:flex; flex:1; }

  /* Sidebar */
  .sidebar { width:220px; flex-shrink:0; background:var(--surface); border-right:1px solid var(--border); padding:16px 10px; display:flex; flex-direction:column; }
  .sidebar-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--t3); padding:0 10px; margin:16px 0 6px; }
  .sidebar-label:first-child { margin-top:0; }
  .sidebar-item { display:flex; align-items:center; gap:9px; padding:8px 10px; border-radius:8px; color:var(--t3); font-size:13px; font-weight:500; cursor:pointer; transition:all var(--transition); position:relative; }
  .sidebar-item:hover { background:var(--cyan-muted); color:var(--t1); }
  .sidebar-item.active { background:var(--cyan-muted); color:var(--cyan); }
  .sidebar-item.active::before { content:''; position:absolute; left:0; top:50%; transform:translateY(-50%); width:3px; height:16px; border-radius:0 3px 3px 0; background:var(--cyan); }
  .sidebar-item svg { width:16px; height:16px; flex-shrink:0; }
  .sidebar-badge { margin-left:auto; font-size:10px; font-weight:700; background:var(--cyan-muted); color:var(--cyan); padding:2px 7px; border-radius:5px; }
  .sidebar-footer { margin-top:auto; padding:12px 10px; border-top:1px solid var(--border); font-size:10px; color:var(--t3); font-family:var(--mono); display:flex; align-items:center; gap:6px; }
  .sidebar-footer .dot { width:5px; height:5px; border-radius:50%; background:var(--green); }

  /* Main area */
  .main { flex:1; padding:24px; overflow-y:auto; position:relative; }
  .main::before { content:''; position:fixed; top:-200px; right:-200px; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle, var(--cyan-glow), transparent 70%); pointer-events:none; opacity:0.3; }

  .page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; z-index:1; position:relative; }
  .greeting { font-size:13px; color:var(--t3); font-weight:500; margin-bottom:4px; }
  .greeting span { color:var(--cyan); font-weight:600; }
  .page-title { font-size:22px; font-weight:700; letter-spacing:-0.4px; }
  .page-sub { font-size:12px; color:var(--t3); margin-top:3px; display:flex; align-items:center; gap:6px; }
  .sync-dot { width:6px; height:6px; border-radius:50%; background:var(--green); animation:pulse 2s ease-in-out infinite; }

  /* Stat Cards */
  .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; z-index:1; position:relative; }
  .stat-card { padding:20px; animation:fadeUp 0.5s var(--ease-out) both; }
  .stat-card:nth-child(2) { animation-delay:0.06s; }
  .stat-card:nth-child(3) { animation-delay:0.12s; }
  .stat-card:nth-child(4) { animation-delay:0.18s; }
  .stat-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .stat-label { font-size:11px; color:var(--t3); font-weight:600; text-transform:uppercase; letter-spacing:0.04em; display:flex; align-items:center; gap:7px; }
  .stat-icon { width:26px; height:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; }
  .stat-icon svg { width:13px; height:13px; }
  .stat-value { font-size:28px; font-weight:700; letter-spacing:-1px; font-family:var(--mono); line-height:1; }
  .stat-change { font-size:11px; font-weight:600; margin-top:6px; display:flex; align-items:center; gap:4px; }
  .stat-change.up { color:var(--green); }
  .stat-change.down { color:var(--red); }
  .stat-change svg { width:11px; height:11px; }

  /* Charts */
  .charts-grid { display:grid; grid-template-columns:5fr 3fr; gap:14px; margin-bottom:20px; z-index:1; position:relative; }
  .chart-card { padding:22px; animation:fadeUp 0.5s var(--ease-out) 0.24s both; }
  .chart-card:nth-child(2) { animation-delay:0.3s; }
  .chart-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
  .chart-title { font-size:14px; font-weight:700; letter-spacing:-0.2px; }
  .chart-badge { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; padding:4px 10px; border-radius:6px; display:flex; align-items:center; gap:5px; }
  .badge-dot { width:5px; height:5px; border-radius:50%; animation:pulse 2s ease-in-out infinite; }
  .chart-area { width:100%; height:160px; position:relative; }
  .chart-area svg { width:100%; height:100%; }
  .chart-x-labels { display:flex; justify-content:space-between; padding:8px 4px 0; font-size:10px; color:var(--t3); font-family:var(--mono); }

  .account-row { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border); transition:all var(--transition); }
  .account-row:last-child { border-bottom:none; }
  .account-row:hover { padding-left:4px; }
  .account-info { display:flex; align-items:center; gap:10px; }
  .account-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; font-family:var(--mono); }
  .account-name { font-size:13px; font-weight:600; }
  .account-num { font-size:10px; color:var(--t3); font-family:var(--mono); }
  .account-bal { font-size:14px; font-weight:700; font-family:var(--mono); letter-spacing:-0.5px; }

  /* Bottom Grid */
  .bottom-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; z-index:1; position:relative; }
  .bottom-card { padding:22px; animation:fadeUp 0.5s var(--ease-out) 0.36s both; }
  .bottom-card:nth-child(2) { animation-delay:0.42s; }
  .bottom-card:nth-child(3) { animation-delay:0.48s; }

  .activity-item { display:flex; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); }
  .activity-item:last-child { border-bottom:none; }
  .activity-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .activity-icon svg { width:12px; height:12px; }
  .activity-text { font-size:12px; color:var(--t2); line-height:1.5; }
  .activity-text strong { color:var(--t1); font-weight:600; }
  .activity-time { font-size:10px; color:var(--t3); font-family:var(--mono); }

  .forecast-row { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); }
  .forecast-row:last-child { border-bottom:none; }
  .forecast-label { font-size:12px; color:var(--t2); width:60px; font-weight:500; }
  .forecast-bar-wrap { flex:1; height:7px; border-radius:4px; background:var(--elevated); overflow:hidden; }
  .forecast-bar { height:100%; border-radius:4px; transition:width 1s var(--ease-out); }
  .forecast-val { font-size:12px; font-weight:700; font-family:var(--mono); min-width:55px; text-align:right; }

  .alert-item { padding:10px 12px; border-radius:var(--radius-sm); margin-bottom:6px; font-size:12px; display:flex; align-items:flex-start; gap:8px; line-height:1.5; }
  .alert-icon { width:20px; height:20px; border-radius:5px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:10px; font-weight:800; color:white; }

  /* ════════════════════════════════════════════
     SCREEN 4 — REPORTS
     ════════════════════════════════════════════ */
  .reports-content { padding:24px; flex:1; overflow-y:auto; position:relative; }
  .reports-content::before { content:''; position:fixed; top:-200px; right:-200px; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle, var(--cyan-glow), transparent 70%); pointer-events:none; opacity:0.4; }

  .report-tabs { display:flex; gap:4px; margin-bottom:24px; background:var(--bg); border-radius:10px; padding:3px; border:1px solid var(--border); width:fit-content; z-index:1; position:relative; }
  .report-tab { padding:8px 18px; border-radius:7px; font-size:12px; font-weight:600; color:var(--t3); cursor:pointer; border:none; background:none; font-family:var(--font); transition:all var(--transition); }
  .report-tab.active { background:var(--card); color:var(--t1); box-shadow:0 1px 4px rgba(0,0,0,0.15); }

  .reports-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; z-index:1; position:relative; }
  .report-card { padding:24px; cursor:pointer; transition:all var(--transition); animation:fadeUp 0.5s var(--ease-out) both; }
  .report-card:nth-child(2) { animation-delay:0.06s; }
  .report-card:nth-child(3) { animation-delay:0.12s; }
  .report-card:nth-child(4) { animation-delay:0.18s; }
  .report-card:nth-child(5) { animation-delay:0.24s; }
  .report-card:nth-child(6) { animation-delay:0.3s; }
  .report-card:hover { transform:translateY(-3px); border-color:var(--cyan); box-shadow:var(--glass-shadow), 0 12px 40px rgba(0,0,0,0.1); }
  .report-icon-wrap { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
  .report-icon-wrap svg { width:20px; height:20px; }
  .report-name { font-size:15px; font-weight:700; margin-bottom:4px; }
  .report-desc { font-size:12px; color:var(--t3); line-height:1.5; margin-bottom:14px; }
  .report-meta { display:flex; align-items:center; gap:12px; font-size:11px; color:var(--t3); }
  .report-meta-item { display:flex; align-items:center; gap:4px; }
  .report-meta-item svg { width:12px; height:12px; }

  /* ════════════════════════════════════════════
     SCREEN 5 — SETTINGS
     ════════════════════════════════════════════ */
  .settings-content { padding:24px; flex:1; overflow-y:auto; }
  .settings-nav { display:flex; gap:4px; margin-bottom:24px; background:var(--bg); border-radius:10px; padding:3px; border:1px solid var(--border); width:fit-content; }
  .settings-tab { padding:8px 18px; border-radius:7px; font-size:12px; font-weight:600; color:var(--t3); cursor:pointer; border:none; background:none; font-family:var(--font); transition:all var(--transition); }
  .settings-tab.active { background:var(--card); color:var(--t1); box-shadow:0 1px 4px rgba(0,0,0,0.15); }

  .settings-section { margin-bottom:28px; }
  .settings-section-title { font-size:16px; font-weight:700; margin-bottom:4px; letter-spacing:-0.3px; }
  .settings-section-sub { font-size:12px; color:var(--t3); margin-bottom:16px; }

  .settings-card { padding:24px; margin-bottom:12px; }
  .settings-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid var(--border); }
  .settings-row:last-child { border-bottom:none; }
  .settings-row-info { flex:1; }
  .settings-row-title { font-size:13px; font-weight:600; }
  .settings-row-desc { font-size:11px; color:var(--t3); margin-top:2px; }

  .switch { width:40px; height:22px; border-radius:11px; background:var(--elevated); border:1px solid var(--border); cursor:pointer; position:relative; transition:all var(--transition); flex-shrink:0; }
  .switch.on { background:var(--cyan); border-color:var(--cyan); }
  .switch::after { content:''; position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%; background:white; transition:transform var(--transition); box-shadow:0 1px 4px rgba(0,0,0,0.2); }
  .switch.on::after { transform:translateX(18px); }

  /* Profile card */
  .profile-header { display:flex; align-items:center; gap:16px; margin-bottom:20px; }
  .profile-avatar { width:56px; height:56px; border-radius:14px; background:linear-gradient(135deg, var(--cyan), var(--purple)); display:flex; align-items:center; justify-content:center; color:white; font-size:20px; font-weight:800; }
  .profile-info { flex:1; }
  .profile-name { font-size:16px; font-weight:700; }
  .profile-email { font-size:12px; color:var(--t3); }
  .profile-role { margin-top:4px; }

  /* ─── NAV INDICATOR ─── */
  .nav-indicator { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); z-index:200; display:flex; gap:6px; background:var(--surface); border:1px solid var(--border); border-radius:28px; padding:8px 16px; box-shadow:0 8px 30px rgba(0,0,0,0.3); }
  .nav-dot { width:10px; height:10px; border-radius:50%; background:var(--elevated); border:1px solid var(--border); cursor:pointer; transition:all var(--transition); }
  .nav-dot:hover { background:var(--cyan-muted); border-color:var(--cyan); }
  .nav-dot.active { background:var(--cyan); border-color:var(--cyan); width:28px; border-radius:5px; }
  .nav-label { font-size:10px; color:var(--t3); font-weight:600; position:absolute; bottom:100%; left:50%; transform:translateX(-50%); margin-bottom:8px; white-space:nowrap; opacity:0; transition:opacity var(--transition); pointer-events:none; background:var(--card); padding:4px 10px; border-radius:6px; border:1px solid var(--border); }
  .nav-dot:hover .nav-label { opacity:1; }
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- ═══════════ SCREEN 1: SIGNUP ═══════════ -->
<div class="screen signup-screen active" id="screen-signup">
  <div class="signup-card glass fade-up">
    <div class="signup-logo">
      <svg class="logo-svg" viewBox="0 0 512 512">
        <defs><linearGradient id="lBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs>
        <rect width="512" height="512" rx="112" fill="url(#lBg)"/>
        <path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/>
        <circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/>
        <rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/>
        <circle cx="256" cy="260" r="8" fill="white" fill-opacity="0.95"/>
        <path d="M232 340 L252 358 L288 316" fill="none" stroke="white" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.7"/>
      </svg>
      <span class="signup-logo-text">Vaultline</span>
    </div>
    <div class="signup-title">Get Started with Vaultline</div>
    <div class="signup-sub">30-day money-back guarantee. Get up and running in under 48 hours.</div>

    <div class="social-btns">
      <button class="social-btn" onclick="showToast('Google SSO')">
        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Google
      </button>
      <button class="social-btn" onclick="showToast('Microsoft SSO')">
        <svg width="14" height="14" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
        Microsoft
      </button>
      <button class="social-btn" onclick="showToast('Apple SSO')" style="background:#000;color:#fff;border-color:#000;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
        Apple
      </button>
    </div>

    <div class="divider"><div class="divider-line"></div><span class="divider-text">or</span><div class="divider-line"></div></div>

    <div class="input-wrap">
      <label class="input-label">Full name</label>
      <input class="input-field" placeholder="Jane Cooper" value="Jane Cooper">
    </div>
    <div class="input-wrap">
      <label class="input-label">Work email</label>
      <input class="input-field" placeholder="jane@acmecorp.com" type="email">
    </div>
    <div class="input-wrap">
      <label class="input-label">Password</label>
      <input class="input-field" placeholder="Min. 8 characters" type="password" id="pwInput" oninput="checkPw(this.value)">
      <div class="pw-strength" id="pwStrength">
        <div class="pw-bar"><div class="pw-fill" id="pwFill"></div></div>
        <span class="pw-label" id="pwLabel"></span>
      </div>
      <div class="pw-reqs">
        <div class="pw-req" id="req-len"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg> 8+ characters</div>
        <div class="pw-req" id="req-upper"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg> Uppercase letter</div>
        <div class="pw-req" id="req-num"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg> Number</div>
        <div class="pw-req" id="req-special"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/></svg> Special character</div>
      </div>
    </div>

    <div class="terms-check">
      <input type="checkbox" id="termsBox" class="terms-checkbox">
      <label for="termsBox" class="terms-label">I agree to the <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a>, and <a href="#">Data Processing Agreement</a></label>
    </div>

    <button class="btn btn-cyan btn-lg" style="width:100%;justify-content:center;" id="createBtn" onclick="validateSignup()">
      Create Account
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </button>

    <div class="signup-footer">Already have an account? <a href="#" onclick="showToast('Login flow')">Sign in</a></div>
  </div>

  <div class="signup-trust fade-up fade-up-d2">
    <div class="signup-trust-item">
      <svg class="signup-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      SOC 2 Type II
    </div>
    <div class="signup-trust-item">
      <svg class="signup-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      256-bit encryption
    </div>
    <div class="signup-trust-item">
      <svg class="signup-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      99.99% uptime
    </div>
  </div>
</div>

<!-- ═══════════ SCREEN 2: ONBOARDING ═══════════ -->
<div class="screen onboard-screen" id="screen-onboard">
  <div class="onboard-container">
    <div class="signup-logo fade-up" style="justify-content:center;margin-bottom:32px;">
      <svg class="logo-svg" viewBox="0 0 512 512"><defs><linearGradient id="lBg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#lBg2)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg>
      <span class="signup-logo-text">Vaultline</span>
    </div>

    <!-- Progress steps -->
    <div class="onboard-progress fade-up fade-up-d1" id="onboardProgress">
      <div class="onboard-step"><div class="step-dot active" id="dot-1">1</div><span class="step-label">Company</span></div>
      <div class="onboard-step"><div class="step-dot" id="dot-2">2</div><span class="step-label">Banks</span></div>
      <div class="onboard-step"><div class="step-dot" id="dot-3">3</div><span class="step-label">Role</span></div>
      <div class="onboard-step"><div class="step-dot" id="dot-4">4</div><span class="step-label">Team</span></div>
      <div class="onboard-step"><div class="step-dot" id="dot-5">5</div><span class="step-label">Security</span></div>
    </div>

    <!-- Step 1: Company -->
    <div class="onboard-card glass fade-up fade-up-d2" id="step-1">
      <div class="onboard-title">Tell us about your company</div>
      <div class="onboard-sub">This helps us configure your dashboard and cash flow categories</div>
      <div class="input-wrap">
        <label class="input-label">Company name</label>
        <input class="input-field" placeholder="Acme Corporation">
      </div>
      <div class="field-row">
        <div class="input-wrap">
          <label class="input-label">Annual revenue</label>
          <select class="input-field"><option>$10M — $50M</option><option>$50M — $100M</option><option>$100M — $250M</option><option>$250M — $500M</option><option>$500M+</option></select>
        </div>
        <div class="input-wrap">
          <label class="input-label">Industry</label>
          <select class="input-field"><option>Technology</option><option>Healthcare</option><option>Manufacturing</option><option>Financial Services</option><option>Retail</option><option>Other</option></select>
        </div>
      </div>
      <div class="field-row">
        <div class="input-wrap">
          <label class="input-label">ERP System</label>
          <select class="input-field"><option>NetSuite</option><option>QuickBooks</option><option>Xero</option><option>Sage</option><option>SAP</option><option>Other</option></select>
        </div>
        <div class="input-wrap">
          <label class="input-label">Number of entities</label>
          <select class="input-field"><option>1 — 3</option><option>4 — 10</option><option>11 — 25</option><option>25+</option></select>
        </div>
      </div>
      <div class="onboard-actions">
        <button class="btn btn-ghost" onclick="goTo('screen-signup')">Back</button>
        <button class="btn btn-cyan" onclick="nextStep(2)">Continue <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
    </div>

    <!-- Step 2: Banks -->
    <div class="onboard-card glass" id="step-2" style="display:none;">
      <div class="onboard-title">Connect your bank accounts</div>
      <div class="onboard-sub">Powered by Plaid. We support 12,000+ financial institutions.</div>
      <div class="bank-grid">
        <div class="bank-card" onclick="toggleBank(this)">
          <div class="bank-logo" style="background:var(--cyan-muted);color:var(--cyan);">C</div>
          <div><div class="bank-name">Chase</div><div class="bank-sub">JPMorgan Chase & Co.</div></div>
          <div class="bank-check"></div>
        </div>
        <div class="bank-card" onclick="toggleBank(this)">
          <div class="bank-logo" style="background:var(--red-muted);color:var(--red);">B</div>
          <div><div class="bank-name">Bank of America</div><div class="bank-sub">Consumer & Commercial</div></div>
          <div class="bank-check"></div>
        </div>
        <div class="bank-card" onclick="toggleBank(this)">
          <div class="bank-logo" style="background:var(--amber-muted);color:var(--amber);">W</div>
          <div><div class="bank-name">Wells Fargo</div><div class="bank-sub">Banking & Payroll</div></div>
          <div class="bank-check"></div>
        </div>
        <div class="bank-card" onclick="toggleBank(this)">
          <div class="bank-logo" style="background:var(--green-muted);color:var(--green);">S</div>
          <div><div class="bank-name">SVB</div><div class="bank-sub">Silicon Valley Bank</div></div>
          <div class="bank-check"></div>
        </div>
        <div class="bank-card" onclick="toggleBank(this)">
          <div class="bank-logo" style="background:var(--purple-muted);color:var(--purple);">C</div>
          <div><div class="bank-name">Citibank</div><div class="bank-sub">Citi Commercial</div></div>
          <div class="bank-check"></div>
        </div>
        <div class="bank-card" onclick="toggleBank(this)">
          <div class="bank-logo" style="background:var(--cyan-muted);color:var(--cyan);">+</div>
          <div><div class="bank-name">Other Bank</div><div class="bank-sub">Search 12,000+ banks</div></div>
          <div class="bank-check"></div>
        </div>
      </div>
      <div class="onboard-actions">
        <button class="btn btn-ghost" onclick="nextStep(1)">Back</button>
        <button class="btn btn-cyan" onclick="nextStep(3)">Continue <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
    </div>

    <!-- Step 3: Role -->
    <div class="onboard-card glass" id="step-3" style="display:none;">
      <div class="onboard-title">What's your role?</div>
      <div class="onboard-sub">We'll personalize your dashboard layout and default widgets</div>
      <div class="role-grid">
        <div class="role-card" onclick="selectRole(this)"><div class="role-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div class="role-name">CFO</div><div class="role-desc">High-level cash visibility & board reporting</div></div>
        <div class="role-card" onclick="selectRole(this)"><div class="role-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div><div class="role-name">Treasury Analyst</div><div class="role-desc">Day-to-day operations & transaction flows</div></div>
        <div class="role-card" onclick="selectRole(this)"><div class="role-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="role-name">Controller</div><div class="role-desc">Reconciliation, compliance & audit trails</div></div>
        <div class="role-card" onclick="selectRole(this)"><div class="role-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div><div class="role-name">VP Finance</div><div class="role-desc">Forecasting, strategy & growth planning</div></div>
      </div>
      <div class="onboard-actions">
        <button class="btn btn-ghost" onclick="nextStep(2)">Back</button>
        <button class="btn btn-cyan" onclick="nextStep(4)">Continue <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
    </div>

    <!-- Step 4: Team -->
    <div class="onboard-card glass" id="step-4" style="display:none;">
      <div class="onboard-title">Invite your team</div>
      <div class="onboard-sub">You can always add more people later from Settings</div>
      <div class="invite-row">
        <input class="input-field" placeholder="colleague@company.com" id="inviteInput" style="margin:0;">
        <button class="btn btn-cyan btn-sm" onclick="addInvite()">Invite</button>
      </div>
      <div class="invited-list" id="invitedList">
        <div class="invited-person">
          <div class="invited-avatar">JC</div>
          <span class="invited-email">jane@acmecorp.com</span>
          <span class="invited-role" style="background:var(--cyan-muted);color:var(--cyan);">Owner</span>
        </div>
      </div>
      <div class="onboard-actions">
        <button class="btn btn-ghost" onclick="nextStep(3)">Back</button>
        <button class="btn btn-cyan" onclick="nextStep(5)">Continue <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
    </div>

    <!-- Step 5: Security -->
    <div class="onboard-card glass" id="step-5" style="display:none;">
      <div class="onboard-title">Secure your account</div>
      <div class="onboard-sub">Vaultline requires multi-factor authentication for all treasury accounts</div>

      <div class="security-badge selected" onclick="selectMfa(this,'authenticator')">
        <div class="security-badge-icon" style="background:var(--cyan-muted);color:var(--cyan);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
        </div>
        <div>
          <div class="security-badge-title">Authenticator App</div>
          <div class="security-badge-sub">Google Authenticator, Authy, 1Password</div>
        </div>
        <span class="security-badge-tag" style="background:var(--green-muted);color:var(--green);">Recommended</span>
      </div>

      <div class="security-badge" onclick="selectMfa(this,'sms')">
        <div class="security-badge-icon" style="background:var(--amber-muted);color:var(--amber);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <div class="security-badge-title">SMS Verification</div>
          <div class="security-badge-sub">Receive a code via text message</div>
        </div>
        <span class="security-badge-tag" style="background:var(--bg);color:var(--t3);">Standard</span>
      </div>

      <div class="security-badge" onclick="selectMfa(this,'hardware')">
        <div class="security-badge-icon" style="background:var(--purple-muted);color:var(--purple);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>
        </div>
        <div>
          <div class="security-badge-title">Hardware Security Key</div>
          <div class="security-badge-sub">YubiKey, Titan, or FIDO2 device</div>
        </div>
        <span class="security-badge-tag" style="background:var(--purple-muted);color:var(--purple);">Enterprise</span>
      </div>

      <div style="margin-top:16px;padding:14px 18px;border-radius:10px;background:var(--bg);border:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style="font-size:12px;font-weight:700;">Security Policy</span>
        </div>
        <div style="font-size:11px;color:var(--t3);line-height:1.6;">All sessions are encrypted end-to-end. Bank credentials are never stored on our servers. SOC 2 Type II audited. Automatic session timeout after 15 minutes of inactivity.</div>
      </div>

      <div class="onboard-actions">
        <button class="btn btn-ghost" onclick="nextStep(4)">Back</button>
        <button class="btn btn-cyan" onclick="goTo('screen-paywall')">Continue to Plan Selection <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
    </div>

    <!-- Setup loading -->
    <div class="onboard-card glass" id="step-loading" style="display:none;">
      <div class="setup-loading">
        <div class="setup-spinner"></div>
        <div class="setup-status" id="setupStatus">Setting up your workspace...</div>
        <div class="setup-checklist" id="setupChecklist">
          <div class="setup-check-item" id="chk-1"><div class="check-icon"></div> Creating workspace</div>
          <div class="setup-check-item" id="chk-2"><div class="check-icon"></div> Connecting bank accounts</div>
          <div class="setup-check-item" id="chk-3"><div class="check-icon"></div> Syncing transactions</div>
          <div class="setup-check-item" id="chk-4"><div class="check-icon"></div> Building your dashboard</div>
          <div class="setup-check-item" id="chk-5"><div class="check-icon"></div> Applying role preferences</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════ SCREEN: PAYWALL ═══════════ -->
<div class="screen paywall-screen" id="screen-paywall">
  <div class="paywall-container">
    <div style="margin-bottom:8px;">
      <svg width="32" height="32" viewBox="0 0 512 512"><defs><linearGradient id="lPw" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#lPw)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg>
    </div>
    <div class="paywall-title">Choose your plan</div>
    <div class="paywall-sub">All plans include a 30-day money-back guarantee. No long-term contracts.</div>

    <div class="paywall-toggle">
      <button class="paywall-toggle-btn active" onclick="setBilling('monthly',this)">Monthly</button>
      <button class="paywall-toggle-btn" onclick="setBilling('annual',this)">Annual <span class="paywall-save">Save 20%</span></button>
    </div>

    <div class="plan-grid">
      <!-- Starter -->
      <div class="plan-card glass">
        <div class="plan-name">Starter</div>
        <div class="plan-price" id="price-starter">$499<span>/mo</span></div>
        <div class="plan-desc">For growing companies with 1-3 bank accounts</div>
        <ul class="plan-features">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Up to 3 bank connections</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Cash position dashboard</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> 30-day forecasting</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Basic reconciliation</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> 5 team members</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Email support</li>
        </ul>
        <button class="plan-btn" onclick="selectPlan('starter')">Select Starter</button>
      </div>

      <!-- Growth (Featured) -->
      <div class="plan-card glass featured">
        <div class="plan-popular">Most Popular</div>
        <div class="plan-name" style="color:var(--cyan);">Growth</div>
        <div class="plan-price" style="color:var(--cyan);" id="price-growth">$1,299<span>/mo</span></div>
        <div class="plan-desc">For mid-market companies scaling treasury operations</div>
        <ul class="plan-features">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited bank connections</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> AI-powered forecasting</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Auto reconciliation</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Multi-entity support</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> API access + webhooks</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> 25 team members</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Priority support</li>
        </ul>
        <button class="plan-btn primary" onclick="selectPlan('growth')">Select Growth</button>
      </div>

      <!-- Enterprise -->
      <div class="plan-card glass">
        <div class="plan-name">Enterprise</div>
        <div class="plan-price" id="price-enterprise">$2,499<span>/mo</span></div>
        <div class="plan-desc">For large organizations with complex treasury needs</div>
        <ul class="plan-features">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Everything in Growth</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> SSO / SAML authentication</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Custom integrations</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Dedicated CSM</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> 99.99% SLA</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Unlimited members</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> White-glove onboarding</li>
        </ul>
        <button class="plan-btn" onclick="selectPlan('enterprise')">Contact Sales</button>
      </div>
    </div>

    <div class="paywall-guarantee">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      30-day money-back guarantee &middot; Cancel anytime &middot; SOC 2 Type II compliant
    </div>
  </div>
</div>

<!-- ═══════════ SCREEN 3: DASHBOARD ═══════════ -->
<div class="screen dash-screen" id="screen-dashboard">
  <div class="topbar">
    <div class="topbar-left">
      <svg class="topbar-logo" viewBox="0 0 512 512"><defs><linearGradient id="lBg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#lBg3)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg>
      <span class="topbar-brand">Vaultline</span>
    </div>
    <div class="topbar-center">
      <button class="topbar-tab active" onclick="switchDashView('overview',this)">Overview</button>
      <button class="topbar-tab" onclick="switchDashView('analytics',this)">Analytics</button>
      <button class="topbar-tab" onclick="switchDashView('operations',this)">Operations</button>
    </div>
    <div class="topbar-right">
      <div class="icon-btn" onclick="showToast('3 new notifications')"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><div class="notif-badge"></div></div>
      <button class="btn btn-ghost btn-sm" onclick="togglePanel()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7.07-3.93 4.24-4.24m5.66-5.66 4.24-4.24M1 12h6m6 0h6m-3.93 7.07-4.24-4.24m-5.66-5.66L3.93 4.93"/></svg>
        Customize
      </button>
      <button class="btn btn-ghost btn-sm" onclick="goTo('screen-reports')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Reports
      </button>
      <button class="btn btn-ghost btn-sm" onclick="goTo('screen-settings')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09c.31.58.92 1 1.51 1a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.58.31 1.25.5 1.95.5H21a2 2 0 0 1 0 4h-.27c-.7 0-1.37.19-1.95.5z"/></svg>
        Settings
      </button>
    </div>
  </div>

  <div class="shell">
    <div class="sidebar">
      <div class="sidebar-label">Treasury</div>
      <div class="sidebar-item active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> Dashboard</div>
      <div class="sidebar-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Cash Position</div>
      <div class="sidebar-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Forecasting</div>
      <div class="sidebar-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Payments <span class="sidebar-badge">3</span></div>
      <div class="sidebar-label">Intelligence</div>
      <div class="sidebar-item" onclick="goTo('screen-reports')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Reports</div>
      <div class="sidebar-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Insights</div>
      <div class="sidebar-label">System</div>
      <div class="sidebar-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Security</div>
      <div class="sidebar-item" onclick="goTo('screen-settings')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.37-.19 1.95-.5z"/></svg> Settings</div>
      <div class="sidebar-footer"><span class="dot"></span> v2.4.1 &middot; All nominal</div>
    </div>

    <div class="main" id="dashboardMain">
      <div class="page-header fade-up">
        <div>
          <div class="greeting">Good afternoon, <span>Jane</span></div>
          <div class="page-title">Treasury Dashboard</div>
          <div class="page-sub"><span class="sync-dot"></span> Synced 2 min ago &middot; 4 accounts</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="glass stat-card" data-widget="total-cash"><div class="stat-header"><div class="stat-label"><div class="stat-icon" style="background:var(--cyan-muted);color:var(--cyan);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div> Total Cash</div></div><div class="stat-value" style="color:var(--cyan)">$24.8M</div><div class="stat-change up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg> +3.2%</div></div>
        <div class="glass stat-card" data-widget="net-flow"><div class="stat-header"><div class="stat-label"><div class="stat-icon" style="background:var(--green-muted);color:var(--green);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg></div> Net Flow</div></div><div class="stat-value" style="color:var(--green)">+$1.4M</div><div class="stat-change up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg> +12.8%</div></div>
        <div class="glass stat-card" data-widget="payables"><div class="stat-header"><div class="stat-label"><div class="stat-icon" style="background:var(--amber-muted);color:var(--amber);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div> Payables</div></div><div class="stat-value" style="color:var(--amber)">$3.1M</div><div class="stat-change down"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg> +8.4%</div></div>
        <div class="glass stat-card" data-widget="forecast-accuracy"><div class="stat-header"><div class="stat-label"><div class="stat-icon" style="background:var(--purple-muted);color:var(--purple);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div> Accuracy</div></div><div class="stat-value" style="color:var(--purple)">94.7%</div><div class="stat-change up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg> +1.3pp</div></div>
      </div>

      <div class="charts-grid">
        <div class="glass chart-card" data-widget="cash-trend" style="border-color:rgba(6,182,212,0.12);">
          <div class="chart-header"><div class="chart-title">Cash Position Trend</div><span class="chart-badge" style="background:var(--cyan-muted);color:var(--cyan);"><span class="badge-dot" style="background:var(--cyan)"></span> Live</span></div>
          <div class="chart-area"><svg viewBox="0 0 500 160" preserveAspectRatio="none"><defs><linearGradient id="cg1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:var(--cyan);stop-opacity:0.25"/><stop offset="100%" style="stop-color:var(--cyan);stop-opacity:0.01"/></linearGradient><linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#0891B2"/><stop offset="50%" stop-color="#06B6D4"/><stop offset="100%" stop-color="#8B5CF6"/></linearGradient></defs><line x1="0" y1="40" x2="500" y2="40" stroke="var(--border)" stroke-width="1"/><line x1="0" y1="80" x2="500" y2="80" stroke="var(--border)" stroke-width="1"/><line x1="0" y1="120" x2="500" y2="120" stroke="var(--border)" stroke-width="1"/><path d="M0,120 C40,115 70,100 120,85 C170,70 190,90 250,55 C310,20 350,40 400,18 C450,6 475,12 500,5 L500,160 L0,160 Z" fill="url(#cg1)"/><path d="M0,120 C40,115 70,100 120,85 C170,70 190,90 250,55 C310,20 350,40 400,18 C450,6 475,12 500,5" fill="none" stroke="url(#lg1)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="600" style="animation:drawLine 2s ease-out forwards"/><circle cx="500" cy="5" r="4" fill="var(--cyan)"><animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/></circle></svg></div>
          <div class="chart-x-labels"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
        </div>
        <div class="glass chart-card" data-widget="accounts">
          <div class="chart-header"><div class="chart-title">Bank Accounts</div><span class="chart-badge" style="background:var(--green-muted);color:var(--green);"><span class="badge-dot" style="background:var(--green)"></span> 4</span></div>
          <div class="account-row"><div class="account-info"><div class="account-icon" style="background:var(--cyan-muted);color:var(--cyan);">C</div><div><div class="account-name">Chase Operating</div><div class="account-num">****4821</div></div></div><div class="account-bal" style="color:var(--cyan)">$12.4M</div></div>
          <div class="account-row"><div class="account-info"><div class="account-icon" style="background:var(--purple-muted);color:var(--purple);">B</div><div><div class="account-name">BofA Reserve</div><div class="account-num">****7193</div></div></div><div class="account-bal">$8.2M</div></div>
          <div class="account-row"><div class="account-info"><div class="account-icon" style="background:var(--green-muted);color:var(--green);">S</div><div><div class="account-name">SVB Growth</div><div class="account-num">****0356</div></div></div><div class="account-bal">$3.1M</div></div>
          <div class="account-row"><div class="account-info"><div class="account-icon" style="background:var(--amber-muted);color:var(--amber);">W</div><div><div class="account-name">Wells Fargo</div><div class="account-num">****8842</div></div></div><div class="account-bal">$1.1M</div></div>
        </div>
      </div>

      <div class="bottom-grid">
        <div class="glass bottom-card" data-widget="activity">
          <div class="chart-header"><div class="chart-title">Activity</div><span class="chart-badge" style="background:var(--cyan-muted);color:var(--cyan);">Today</span></div>
          <div class="activity-item"><div class="activity-icon" style="background:var(--green-muted);color:var(--green);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div><div><div class="activity-text"><strong>Wire sent</strong> — Apex Logistics $284K</div><div class="activity-time">12m ago</div></div></div>
          <div class="activity-item"><div class="activity-icon" style="background:var(--cyan-muted);color:var(--cyan);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg></div><div><div class="activity-text"><strong>Reconciliation</strong> — 847 matched</div><div class="activity-time">28m ago</div></div></div>
          <div class="activity-item"><div class="activity-icon" style="background:var(--amber-muted);color:var(--amber);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div><div class="activity-text"><strong>Q2 forecast</strong> — variance 2.1%</div><div class="activity-time">1h ago</div></div></div>
        </div>
        <div class="glass bottom-card" data-widget="forecast">
          <div class="chart-header"><div class="chart-title">30-Day Forecast</div></div>
          <div class="forecast-row"><div class="forecast-label">Inflows</div><div class="forecast-bar-wrap"><div class="forecast-bar" style="width:82%;background:var(--green)"></div></div><div class="forecast-val" style="color:var(--green)">$6.8M</div></div>
          <div class="forecast-row"><div class="forecast-label">Outflows</div><div class="forecast-bar-wrap"><div class="forecast-bar" style="width:58%;background:var(--red)"></div></div><div class="forecast-val" style="color:var(--red)">$4.7M</div></div>
          <div class="forecast-row"><div class="forecast-label">Net</div><div class="forecast-bar-wrap"><div class="forecast-bar" style="width:40%;background:var(--cyan)"></div></div><div class="forecast-val" style="color:var(--cyan)">+$2.1M</div></div>
          <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border);"><div style="font-size:10px;color:var(--t3);">Projected Balance</div><div style="font-size:20px;font-weight:700;font-family:var(--mono);color:var(--cyan);letter-spacing:-1px;margin-top:2px;">$26.9M</div></div>
        </div>
        <div class="glass bottom-card" data-widget="alerts">
          <div class="chart-header"><div class="chart-title">Alerts</div><span class="chart-badge" style="background:var(--amber-muted);color:var(--amber);">3</span></div>
          <div class="alert-item" style="background:var(--amber-muted);"><div class="alert-icon" style="background:var(--amber);">!</div><div><div style="font-weight:600;font-size:12px;">Payroll below threshold</div><div style="font-size:11px;color:var(--t3);margin-top:2px;">Balance &lt; $1.5M</div></div></div>
          <div class="alert-item" style="background:var(--red-muted);"><div class="alert-icon" style="background:var(--red);">!</div><div><div style="font-weight:600;font-size:12px;">Unusual transaction</div><div style="font-size:11px;color:var(--t3);margin-top:2px;">$47K unknown vendor</div></div></div>
          <div class="alert-item" style="background:var(--cyan-muted);"><div class="alert-icon" style="background:var(--cyan);">$</div><div><div style="font-weight:600;font-size:12px;">Idle cash detected</div><div style="font-size:11px;color:var(--t3);margin-top:2px;">$2.8M for reallocation</div></div></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════ SCREEN 4: REPORTS ═══════════ -->
<div class="screen dash-screen" id="screen-reports">
  <div class="topbar">
    <div class="topbar-left"><svg class="topbar-logo" viewBox="0 0 512 512"><defs><linearGradient id="lBg4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#lBg4)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg><span class="topbar-brand">Vaultline</span></div>
    <div class="topbar-right"><button class="btn btn-ghost btn-sm" onclick="goTo('screen-dashboard')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg> Dashboard</button></div>
  </div>
  <div class="reports-content">
    <div class="page-header fade-up"><div><div class="page-title">Reports</div><div class="page-sub">Board-ready reports, auto-generated from live data</div></div><button class="btn btn-cyan btn-sm" onclick="showToast('Report generated')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> New Report</button></div>
    <div class="report-tabs fade-up fade-up-d1"><button class="report-tab active">All</button><button class="report-tab">Treasury</button><button class="report-tab">Compliance</button><button class="report-tab">Board</button></div>
    <div class="reports-grid">
      <div class="glass report-card"><div class="report-icon-wrap" style="background:var(--cyan-muted);color:var(--cyan);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="report-name">Daily Cash Position</div><div class="report-desc">Consolidated view across all accounts with variance analysis</div><div class="report-meta"><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Auto-daily</span><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> PDF</span></div></div>
      <div class="glass report-card"><div class="report-icon-wrap" style="background:var(--purple-muted);color:var(--purple);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div class="report-name">Cash Flow Forecast</div><div class="report-desc">30/60/90-day forward-looking projections with confidence intervals</div><div class="report-meta"><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Weekly</span><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> PDF / XLSX</span></div></div>
      <div class="glass report-card"><div class="report-icon-wrap" style="background:var(--green-muted);color:var(--green);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="report-name">Reconciliation Summary</div><div class="report-desc">Auto-matched transactions, exceptions, and unresolved items</div><div class="report-meta"><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Real-time</span><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> PDF</span></div></div>
      <div class="glass report-card"><div class="report-icon-wrap" style="background:var(--amber-muted);color:var(--amber);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="report-name">Compliance Audit Trail</div><div class="report-desc">Complete log of user actions, approvals, and policy changes</div><div class="report-meta"><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> On demand</span><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> PDF / CSV</span></div></div>
      <div class="glass report-card"><div class="report-icon-wrap" style="background:var(--red-muted);color:var(--red);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div class="report-name">Risk Exposure</div><div class="report-desc">FX exposure, counterparty risk, and concentration analysis</div><div class="report-meta"><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Monthly</span><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> PDF</span></div></div>
      <div class="glass report-card"><div class="report-icon-wrap" style="background:var(--cyan-muted);color:var(--cyan);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div><div class="report-name">Board Presentation</div><div class="report-desc">Executive summary with KPIs, trends, and strategic recommendations</div><div class="report-meta"><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Quarterly</span><span class="report-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> PPTX / PDF</span></div></div>
    </div>
  </div>
</div>

<!-- ═══════════ SCREEN 5: SETTINGS ═══════════ -->
<div class="screen dash-screen" id="screen-settings">
  <div class="topbar">
    <div class="topbar-left"><svg class="topbar-logo" viewBox="0 0 512 512"><defs><linearGradient id="lBg5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#lBg5)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg><span class="topbar-brand">Vaultline</span></div>
    <div class="topbar-right"><button class="btn btn-ghost btn-sm" onclick="goTo('screen-dashboard')"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg> Dashboard</button></div>
  </div>
  <div class="settings-content">
    <div class="page-header fade-up"><div><div class="page-title">Settings</div><div class="page-sub">Manage your account, team, and preferences</div></div></div>
    <div class="settings-nav fade-up fade-up-d1"><button class="settings-tab active">Profile</button><button class="settings-tab">Team</button><button class="settings-tab">Billing</button><button class="settings-tab">Security</button><button class="settings-tab">Integrations</button></div>

    <div class="settings-section fade-up fade-up-d2">
      <div class="settings-section-title">Profile</div>
      <div class="settings-section-sub">Your personal information and preferences</div>
      <div class="glass settings-card">
        <div class="profile-header">
          <div class="profile-avatar">JC</div>
          <div class="profile-info">
            <div class="profile-name">Jane Cooper</div>
            <div class="profile-email">jane@acmecorp.com</div>
            <span class="tag" style="background:var(--cyan-muted);color:var(--cyan);margin-top:4px;display:inline-block;">CFO</span>
          </div>
          <button class="btn btn-ghost btn-sm">Edit</button>
        </div>
        <div class="field-row">
          <div class="input-wrap"><label class="input-label">First name</label><input class="input-field" value="Jane"></div>
          <div class="input-wrap"><label class="input-label">Last name</label><input class="input-field" value="Cooper"></div>
        </div>
        <div class="input-wrap"><label class="input-label">Email</label><input class="input-field" value="jane@acmecorp.com"></div>
        <div class="input-wrap"><label class="input-label">Timezone</label><select class="input-field"><option>Eastern Time (UTC-5)</option><option>Central Time (UTC-6)</option><option>Pacific Time (UTC-8)</option></select></div>
      </div>
    </div>

    <div class="settings-section fade-up fade-up-d3">
      <div class="settings-section-title">Notifications</div>
      <div class="settings-section-sub">Control how and when you receive alerts</div>
      <div class="glass settings-card">
        <div class="settings-row"><div class="settings-row-info"><div class="settings-row-title">Cash threshold alerts</div><div class="settings-row-desc">Notify when account balances cross defined thresholds</div></div><div class="switch on" onclick="this.classList.toggle('on')"></div></div>
        <div class="settings-row"><div class="settings-row-info"><div class="settings-row-title">Daily cash position email</div><div class="settings-row-desc">Morning summary of all account balances and changes</div></div><div class="switch on" onclick="this.classList.toggle('on')"></div></div>
        <div class="settings-row"><div class="settings-row-info"><div class="settings-row-title">Unusual activity detection</div><div class="settings-row-desc">AI-flagged transactions that deviate from normal patterns</div></div><div class="switch on" onclick="this.classList.toggle('on')"></div></div>
        <div class="settings-row"><div class="settings-row-info"><div class="settings-row-title">Weekly forecast report</div><div class="settings-row-desc">Auto-generated forecast sent every Monday</div></div><div class="switch" onclick="this.classList.toggle('on')"></div></div>
        <div class="settings-row"><div class="settings-row-info"><div class="settings-row-title">Reconciliation exceptions</div><div class="settings-row-desc">Alert when transactions cannot be auto-matched</div></div><div class="switch on" onclick="this.classList.toggle('on')"></div></div>
      </div>
    </div>

    <div class="settings-section fade-up fade-up-d4">
      <div class="settings-section-title">Data & Exports</div>
      <div class="settings-section-sub">Control data formats and export preferences</div>
      <div class="glass settings-card">
        <div class="settings-row"><div class="settings-row-info"><div class="settings-row-title">Default export format</div><div class="settings-row-desc">Format used when exporting reports and data</div></div><select class="input-field" style="width:120px;margin:0;"><option>PDF</option><option>Excel</option><option>CSV</option></select></div>
        <div class="settings-row"><div class="settings-row-info"><div class="settings-row-title">Currency display</div><div class="settings-row-desc">Primary currency for dashboard metrics</div></div><select class="input-field" style="width:120px;margin:0;"><option>USD ($)</option><option>EUR (&euro;)</option><option>GBP (&pound;)</option></select></div>
        <div class="settings-row"><div class="settings-row-info"><div class="settings-row-title">Include Excel/CSV exports</div><div class="settings-row-desc">Add downloadable data files to every report</div></div><div class="switch on" onclick="this.classList.toggle('on')"></div></div>
      </div>
    </div>
  </div>
</div>

<!-- Customize Panel -->
<div class="customize-overlay" id="overlay" onclick="togglePanel()"></div>
<div class="customize-panel" id="panel">
  <button class="panel-close" onclick="togglePanel()">&times;</button>
  <div class="panel-header">
    <div class="panel-header-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7.07-3.93 4.24-4.24m5.66-5.66 4.24-4.24M1 12h6m6 0h6m-3.93 7.07-4.24-4.24m-5.66-5.66L3.93 4.93"/></svg></div>
    <div class="panel-title">Customize Dashboard</div>
  </div>
  <div class="panel-sub">Personalize your workspace to match how you work</div>
  <div class="panel-section"><div class="panel-section-label">Quick Presets</div>
    <div class="preset-grid">
      <div class="preset-btn active" onclick="applyPreset('cfo',this)"><div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div class="preset-btn-title">CFO</div><div class="preset-btn-sub">High-level cash overview</div></div>
      <div class="preset-btn" onclick="applyPreset('analyst',this)"><div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div><div class="preset-btn-title">Treasury Analyst</div><div class="preset-btn-sub">Detailed ops & flows</div></div>
      <div class="preset-btn" onclick="applyPreset('controller',this)"><div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div class="preset-btn-title">Controller</div><div class="preset-btn-sub">Reconciliation focus</div></div>
      <div class="preset-btn" onclick="applyPreset('vp',this)"><div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div><div class="preset-btn-title">VP Finance</div><div class="preset-btn-sub">Forecasting & strategy</div></div>
    </div>
  </div>
  <div class="panel-section"><div class="panel-section-label">Theme</div>
    <div class="option-row">
      <div class="option-card" id="themeDark" onclick="setTheme('dark',this)"><div class="option-swatch" style="background:#0B1121;"></div><div class="option-label">Dark</div></div>
      <div class="option-card active" id="themeLight" onclick="setTheme('light',this)"><div class="option-swatch" style="background:#F8FAFC;border-color:#e2e8f0;"></div><div class="option-label">Light</div></div>
      <div class="option-card" id="themeMidnight" onclick="setTheme('midnight',this)"><div class="option-swatch" style="background:linear-gradient(135deg,#0c1445,#1a1040);"></div><div class="option-label">Midnight</div></div>
    </div>
  </div>
  <div class="panel-section"><div class="panel-section-label">Accent Color</div>
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
  <div class="panel-section"><div class="panel-section-label">Layout</div>
    <div class="option-row">
      <div class="option-card active" onclick="setLayout('default',this)"><div class="option-label">Default</div></div>
      <div class="option-card" onclick="setLayout('compact',this)"><div class="option-label">Compact</div></div>
      <div class="option-card" onclick="setLayout('wide',this)"><div class="option-label">Wide</div></div>
    </div>
  </div>
  <div class="panel-section"><div class="panel-section-label">Density</div>
    <div class="option-row">
      <div class="option-card active" onclick="setDensity('comfortable',this)"><div class="option-label">Comfortable</div></div>
      <div class="option-card" onclick="setDensity('compact',this)"><div class="option-label">Compact</div></div>
    </div>
  </div>
  <div class="panel-section"><div class="panel-section-label">Widgets</div><div class="widget-list" id="widgetToggles"></div></div>
  <div style="padding-top:12px;border-top:1px solid var(--border);"><button class="btn btn-ghost" style="width:100%;justify-content:center;" onclick="resetAll()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Reset to Defaults</button></div>
</div>

<!-- ═══════════ NAV DOTS ═══════════ -->
<div class="nav-indicator" id="navIndicator">
  <div class="nav-dot active" onclick="goTo('screen-signup')" data-screen="screen-signup"><span class="nav-label">Signup</span></div>
  <div class="nav-dot" onclick="goTo('screen-onboard')" data-screen="screen-onboard"><span class="nav-label">Onboarding</span></div>
  <div class="nav-dot" onclick="goTo('screen-paywall')" data-screen="screen-paywall"><span class="nav-label">Plans</span></div>
  <div class="nav-dot" onclick="goTo('screen-dashboard')" data-screen="screen-dashboard"><span class="nav-label">Dashboard</span></div>
  <div class="nav-dot" onclick="goTo('screen-reports')" data-screen="screen-reports"><span class="nav-label">Reports</span></div>
  <div class="nav-dot" onclick="goTo('screen-settings')" data-screen="screen-settings"><span class="nav-label">Settings</span></div>
</div>

<!-- Toast -->
<div class="toast" id="toast"></div>


` }} />
    </>
  );
}
