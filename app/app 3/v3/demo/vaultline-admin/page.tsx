'use client';

import { useEffect, useRef } from 'react';

export default function V3DemoVaultlineAdminPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const WIDGETS=[
  {id:'customers',name:'Total Customers',icon:'#',color:'cyan',on:true},
  {id:'mrr',name:'MRR',icon:'$',color:'green',on:true},
  {id:'arr',name:'ARR',icon:'$',color:'purple',on:true},
  {id:'churn',name:'Churn Rate',icon:'%',color:'amber',on:true},
  {id:'uptime',name:'Uptime',icon:'^',color:'green',on:true},
  {id:'api-calls',name:'API Calls',icon:'~',color:'cyan',on:true},
  {id:'customer-table',name:'Customer Table',icon:'T',color:'cyan',on:true},
  {id:'system-health',name:'System Health',icon:'+',color:'green',on:true},
  {id:'revenue',name:'Revenue Trend',icon:'$',color:'green',on:true},
  {id:'activity',name:'Admin Activity',icon:'*',color:'purple',on:true},
  {id:'incidents',name:'Incidents & Flags',icon:'!',color:'red',on:true},
];
const cMap={cyan:{bg:'var(--cm)',fg:'var(--cyan)'},green:{bg:'var(--gm)',fg:'var(--green)'},amber:{bg:'var(--am)',fg:'var(--amber)'},purple:{bg:'var(--pm)',fg:'var(--purple)'},red:{bg:'var(--rm)',fg:'var(--red)'}};

const THEMES={
  dark:{'--bg':'#070d1a','--surface':'#0a1128','--card':'#111c38','--elevated':'#1a2744','--border':'rgba(148,163,184,0.06)','--border-h':'rgba(148,163,184,0.12)','--t1':'#F1F5F9','--t2':'#94A3B8','--t3':'#64748B','--glass':'0 1px 2px rgba(0,0,0,0.3),0 8px 32px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.02)',light:false},
  light:{'--bg':'#F8FAFC','--surface':'#F1F5F9','--card':'#FFFFFF','--elevated':'#FFFFFF','--border':'rgba(15,23,42,0.06)','--border-h':'rgba(15,23,42,0.12)','--t1':'#0F172A','--t2':'#475569','--t3':'#94A3B8','--glass':'0 1px 2px rgba(0,0,0,0.04),0 8px 32px rgba(0,0,0,0.03),inset 0 1px 0 rgba(255,255,255,0.6)',light:true},
  midnight:{'--bg':'#0c1445','--surface':'#111952','--card':'#1a1f5e','--elevated':'#252a6e','--border':'rgba(148,163,184,0.06)','--border-h':'rgba(148,163,184,0.14)','--t1':'#E8EAFF','--t2':'#9BA2D0','--t3':'#6B73A8','--glass':'0 1px 2px rgba(0,0,0,0.3),0 8px 32px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.04)',light:false}
};
let currentTheme='light', currentAccent='#06B6D4';

function togglePanel(){document.getElementById('overlay').classList.toggle('open');document.getElementById('panel').classList.toggle('open');}

function navTo(el, name){
  document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
  showToast(name+' view');
}

function exportData(){showToast('Exporting dashboard data...');}
function viewIncidents(){showToast('Viewing active incidents');}

function setTheme(theme,el){
  document.querySelectorAll('#themeDark,#themeLight,#themeMidnight').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
  const t=THEMES[theme]; if(!t) return; currentTheme=theme;
  const s=document.documentElement.style;
  Object.keys(t).forEach(k=>{if(k.startsWith('--'))s.setProperty(k,t[k]);});
  reapplyAccentGlow(); showToast(theme.charAt(0).toUpperCase()+theme.slice(1)+' theme');
}

function hexToRgb(hex){return[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];}

function setAccent(color,el){
  document.querySelectorAll('.accent-dot').forEach(e=>e.classList.remove('active'));
  el.classList.add('active'); currentAccent=color;
  const[r,g,b]=hexToRgb(color); const s=document.documentElement.style;
  s.setProperty('--cyan',color); s.setProperty('--cm',\`rgba(\${r},\${g},\${b},0.1)\`); s.setProperty('--cg',\`rgba(\${r},\${g},\${b},0.15)\`);
  reapplyAccentGlow(); showToast('Accent updated');
}

function reapplyAccentGlow(){
  const[r,g,b]=hexToRgb(currentAccent);
  let gs=document.getElementById('accentGlowStyle');
  if(!gs){gs=document.createElement('style');gs.id='accentGlowStyle';document.head.appendChild(gs);}
  gs.textContent=\`
    .main::before{background:radial-gradient(circle,rgba(\${r},\${g},\${b},0.08),transparent 70%)!important;}
    .topbar::after{background:linear-gradient(90deg,transparent,rgba(\${r},\${g},\${b},0.12),transparent)!important;}
    .sb-item.active{background:rgba(\${r},\${g},\${b},0.08)!important;color:\${currentAccent}!important;}
    .sb-item.active::before{background:\${currentAccent}!important;}
    .sb-item:hover{background:rgba(\${r},\${g},\${b},0.05)!important;}
    .sb-badge{background:rgba(\${r},\${g},\${b},0.1)!important;color:\${currentAccent}!important;}
    .icon-btn:hover{background:rgba(\${r},\${g},\${b},0.1)!important;color:\${currentAccent}!important;border-color:rgba(\${r},\${g},\${b},0.2)!important;}
    .btn-cyan{background:\${currentAccent}!important;box-shadow:0 2px 8px rgba(\${r},\${g},\${b},0.2)!important;}
    .btn-ghost:hover{background:rgba(\${r},\${g},\${b},0.05)!important;}
    .tb-tag{background:rgba(\${r},\${g},\${b},0.1)!important;color:\${currentAccent}!important;}
    .btn-red{background:\${currentAccent}!important;box-shadow:0 2px 8px rgba(\${r},\${g},\${b},0.2)!important;}
    .panel-header-icon{background:rgba(\${r},\${g},\${b},0.1)!important;color:\${currentAccent}!important;}
    .preset-btn.active{border-color:rgba(\${r},\${g},\${b},0.3)!important;background:rgba(\${r},\${g},\${b},0.06)!important;}
    .option-card.active{border-color:rgba(\${r},\${g},\${b},0.3)!important;background:rgba(\${r},\${g},\${b},0.06)!important;}
    .accent-dot.active{box-shadow:0 0 0 3px rgba(\${r},\${g},\${b},0.2)!important;}
    .search-input:focus{border-color:\${currentAccent}!important;box-shadow:0 0 0 2px rgba(\${r},\${g},\${b},0.1)!important;}
  \`;
}

function shiftHue(hex,deg){let[r,g,b]=hexToRgb(hex);r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0,s=max===0?0:d/max,v=max;if(d!==0){if(max===r)h=((g-b)/d+(g<b?6:0))/6;else if(max===g)h=((b-r)/d+2)/6;else h=((r-g)/d+4)/6;}h=((h*360+deg)%360)/360;const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t2=v*(1-(1-f)*s);let r2,g2,b2;switch(i%6){case 0:r2=v;g2=t2;b2=p;break;case 1:r2=q;g2=v;b2=p;break;case 2:r2=p;g2=v;b2=t2;break;case 3:r2=p;g2=q;b2=v;break;case 4:r2=t2;g2=p;b2=v;break;case 5:r2=v;g2=p;b2=q;break;}return\`#\${Math.round(r2*255).toString(16).padStart(2,'0')}\${Math.round(g2*255).toString(16).padStart(2,'0')}\${Math.round(b2*255).toString(16).padStart(2,'0')}\`;}

function setLayout(layout,el){el.parentElement.querySelectorAll('.option-card').forEach(e=>e.classList.remove('active'));el.classList.add('active');const m=document.getElementById('dashboardMain');m.classList.remove('layout-compact','layout-wide');if(layout!=='default')m.classList.add('layout-'+layout);showToast(layout+' layout');}

function setDensity(density,el){el.parentElement.querySelectorAll('.option-card').forEach(e=>e.classList.remove('active'));el.classList.add('active');const m=document.getElementById('dashboardMain');m.classList.remove('density-comfortable','density-compact');m.classList.add('density-'+density);showToast(density+' density');}

function renderWidgetToggles(){document.getElementById('widgetToggles').innerHTML=WIDGETS.map(w=>{const c=cMap[w.color]||cMap.cyan;return\`<div class="widget-toggle"><div class="widget-toggle-info"><div class="widget-toggle-icon" style="background:\${c.bg};color:\${c.fg};">\${w.icon}</div><div class="widget-toggle-name">\${w.name}</div></div><div class="switch \${w.on?'on':''}" onclick="toggleWidget('\${w.id}',this)"></div></div>\`;}).join('');}

function toggleWidget(id,el){const w=WIDGETS.find(x=>x.id===id);w.on=!w.on;el.classList.toggle('on');document.querySelectorAll(\`[data-widget="\${id}"]\`).forEach(card=>{if(w.on){card.classList.remove('widget-hidden');card.style.animation='cardReveal 0.4s var(--eo) both';}else{card.classList.add('widget-hidden');}});showToast(w.on?w.name+' shown':w.name+' hidden');}

function applyPreset(role,el){
  document.querySelectorAll('.preset-btn').forEach(e=>e.classList.remove('active'));el.classList.add('active');
  WIDGETS.forEach(w=>w.on=true);
  const hide={overview:[],revenue:['system-health','incidents','uptime','api-calls'],operations:['revenue','mrr','arr','churn'],security:['revenue','activity','customers','mrr']}[role]||[];
  hide.forEach(id=>{const w=WIDGETS.find(x=>x.id===id);if(w)w.on=false;});
  WIDGETS.forEach(w=>{document.querySelectorAll(\`[data-widget="\${w.id}"]\`).forEach(card=>{card.classList.toggle('widget-hidden',!w.on);if(w.on)card.style.animation='cardReveal 0.4s var(--eo) both';});});
  renderWidgetToggles();showToast(role.toUpperCase()+' preset applied');
}

function resetAll(){
  WIDGETS.forEach(w=>w.on=true);document.querySelectorAll('[data-widget]').forEach(c=>{c.classList.remove('widget-hidden');c.style.animation='cardReveal 0.4s var(--eo) both';});
  currentTheme='light';currentAccent='#06B6D4';
  const s=document.documentElement.style;Object.keys(THEMES.light).forEach(k=>{if(k.startsWith('--'))s.setProperty(k,THEMES.light[k]);});
  s.setProperty('--cyan','#06B6D4');s.setProperty('--cm','rgba(6,182,212,0.08)');s.setProperty('--cg','rgba(6,182,212,0.06)');
  reapplyAccentGlow();const m=document.getElementById('dashboardMain');m.classList.remove('layout-compact','layout-wide','density-compact');
  renderWidgetToggles();
  document.querySelectorAll('.preset-btn')[0].click();
  document.getElementById('themeLight').classList.add('active');document.getElementById('themeDark').classList.remove('active');document.getElementById('themeMidnight').classList.remove('active');
  document.querySelectorAll('.accent-dot').forEach((e,i)=>e.classList.toggle('active',i===0));
  showToast('Reset to defaults');
}

let tt;function showToast(msg){const t=document.getElementById('toast');t.innerHTML=\`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> \${msg}\`;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200);}

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
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#F8FAFC;--surface:#F1F5F9;--card:#FFFFFF;--elevated:#FFFFFF;--border:rgba(15,23,42,0.06);--border-h:rgba(15,23,42,0.12);--t1:#0F172A;--t2:#475569;--t3:#94A3B8;--cyan:#06B6D4;--cm:rgba(6,182,212,0.08);--cg:rgba(6,182,212,0.06);--green:#059669;--gm:rgba(5,150,105,0.08);--amber:#D97706;--am:rgba(217,119,6,0.08);--red:#DC2626;--rm:rgba(220,38,38,0.08);--purple:#7C3AED;--pm:rgba(124,58,237,0.08);--r:12px;--rs:8px;--glass:0 1px 2px rgba(0,0,0,0.04),0 2px 8px rgba(0,0,0,0.04);--f:'Inter',-apple-system,sans-serif;--m:'JetBrains Mono','SF Mono',monospace;--t:0.25s cubic-bezier(0.4,0,0.2,1);--eo:cubic-bezier(0.16,1,0.3,1)}
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
  body{font-family:var(--f);background:var(--bg);color:var(--t1);min-height:100vh;overflow-x:hidden;transition:background var(--t),color var(--t)}

  .glass{background:var(--card);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--glass);position:relative;overflow:hidden;transition:all var(--t)}
  .glass::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)}
  .glass:hover{border-color:var(--border-h)}

  .topbar{position:sticky;top:0;z-index:100;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;background:var(--surface);border-bottom:1px solid var(--border);backdrop-filter:blur(24px);transition:all var(--t)}
  .topbar::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(239,68,68,0.15),transparent)}
  .tb-left{display:flex;align-items:center;gap:12px}
  .tb-logo{width:26px;height:26px}
  .tb-brand{font-weight:700;font-size:14px;letter-spacing:-0.2px}
  .tb-tag{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:3px 8px;border-radius:5px;background:var(--rm);color:var(--red)}
  .tb-right{display:flex;align-items:center;gap:8px}

  .btn{padding:7px 14px;border-radius:7px;border:none;font-family:var(--f);font-size:12px;font-weight:600;cursor:pointer;transition:all var(--t);display:inline-flex;align-items:center;gap:5px}
  .btn-ghost{background:transparent;color:var(--t3);border:1px solid var(--border)}
  .btn-ghost:hover{border-color:var(--border-h);color:var(--t1)}
  .btn-red{background:var(--red);color:white;box-shadow:0 2px 8px rgba(239,68,68,0.2)}
  .btn-red:hover{filter:brightness(1.05)}
  .btn-cyan{background:var(--cyan);color:white;box-shadow:0 2px 8px var(--cg)}
  .btn-cyan:hover{filter:brightness(1.05)}

  .icon-btn{width:32px;height:32px;border-radius:7px;background:transparent;border:1px solid var(--border);color:var(--t3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--t);position:relative}
  .icon-btn:hover{background:var(--cm);color:var(--cyan);border-color:rgba(6,182,212,0.2)}
  .notif{position:absolute;top:-2px;right:-2px;width:6px;height:6px;border-radius:50%;background:var(--red);border:1.5px solid var(--surface)}

  .shell{display:flex;min-height:calc(100vh - 52px)}
  .sidebar{width:200px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);padding:14px 8px;display:flex;flex-direction:column;transition:all var(--t)}
  .sb-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--t3);padding:0 10px;margin:14px 0 4px}
  .sb-label:first-child{margin-top:0}
  .sb-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:var(--rs);color:var(--t3);font-size:12px;font-weight:500;cursor:pointer;transition:all var(--t);position:relative}
  .sb-item:hover{background:rgba(239,68,68,0.06);color:var(--t1)}
  .sb-item.active{background:rgba(239,68,68,0.08);color:var(--red)}
  .sb-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:2.5px;height:14px;border-radius:0 2px 2px 0;background:var(--red)}
  .sb-item svg{width:14px;height:14px;flex-shrink:0}
  .sb-badge{margin-left:auto;font-size:9px;font-weight:700;background:var(--rm);color:var(--red);padding:1.5px 6px;border-radius:4px}
  .sb-footer{margin-top:auto;padding:10px;border-top:1px solid var(--border);font-size:9px;color:var(--t3);font-family:var(--m);display:flex;align-items:center;gap:5px}
  .sb-footer .dot{width:4px;height:4px;border-radius:50%;background:var(--green)}

  .main{flex:1;padding:20px;overflow-y:auto;position:relative;transition:all var(--t)}
  .main::before{content:'';position:fixed;top:-200px;right:-200px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(239,68,68,0.015),transparent 70%);pointer-events:none}

  .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;z-index:1;position:relative}
  .page-title{font-size:20px;font-weight:700;letter-spacing:-0.4px}
  .page-sub{font-size:11px;color:var(--t3);margin-top:3px;display:flex;align-items:center;gap:5px}
  .live-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse 2s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes fadeUp{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes cardReveal{0%{opacity:0;transform:translateY(8px) scale(0.98)}100%{opacity:1;transform:translateY(0) scale(1)}}

  .platform-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:18px;z-index:1;position:relative}
  .pstat{padding:16px;animation:fadeUp 0.5s var(--eo) both}
  .pstat:nth-child(2){animation-delay:0.04s}.pstat:nth-child(3){animation-delay:0.08s}.pstat:nth-child(4){animation-delay:0.12s}.pstat:nth-child(5){animation-delay:0.16s}.pstat:nth-child(6){animation-delay:0.2s}
  .pstat-label{font-size:10px;color:var(--t3);font-weight:600;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px;display:flex;align-items:center;gap:5px}
  .pstat-dot{width:6px;height:6px;border-radius:50%}
  .pstat-val{font-size:22px;font-weight:700;font-family:var(--m);letter-spacing:-0.8px;line-height:1}
  .pstat-change{font-size:10px;font-weight:600;margin-top:4px;display:flex;align-items:center;gap:3px}
  .pstat-change.up{color:var(--green)}.pstat-change.down{color:var(--red)}
  .pstat-change svg{width:10px;height:10px}

  .mid-grid{display:grid;grid-template-columns:3fr 2fr;gap:14px;margin-bottom:18px;z-index:1;position:relative}
  .table-card{padding:18px;animation:fadeUp 0.5s var(--eo) 0.24s both}
  .table-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .table-title{font-size:13px;font-weight:700;letter-spacing:-0.2px}
  .search-input{padding:6px 12px;background:var(--bg);border:1px solid var(--border);border-radius:6px;color:var(--t1);font-family:var(--f);font-size:11px;outline:none;width:180px;transition:all var(--t)}
  .search-input:focus{border-color:var(--cyan);box-shadow:0 0 0 2px var(--cm)}
  .search-input::placeholder{color:var(--t3)}
  table{width:100%;border-collapse:collapse}
  th{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--t3);text-align:left;padding:8px 10px;border-bottom:1px solid var(--border)}
  td{font-size:12px;padding:10px;border-bottom:1px solid var(--border);transition:all var(--t)}
  tr:hover td{background:rgba(6,182,212,0.02)}
  .customer-name{font-weight:600}.customer-email{color:var(--t3);font-size:11px}
  .plan-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;text-transform:uppercase;letter-spacing:0.04em}
  .status-dot{width:7px;height:7px;border-radius:50%;display:inline-block;margin-right:5px}

  .health-card{padding:18px;animation:fadeUp 0.5s var(--eo) 0.3s both}
  .health-title{font-size:13px;font-weight:700;margin-bottom:14px;letter-spacing:-0.2px}
  .health-item{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)}
  .health-item:last-child{border:none}
  .health-info{display:flex;align-items:center;gap:8px}
  .health-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center}
  .health-icon svg{width:13px;height:13px}
  .health-name{font-size:12px;font-weight:600}.health-sub{font-size:10px;color:var(--t3)}
  .health-status{font-size:10px;font-weight:700;padding:3px 8px;border-radius:5px;display:flex;align-items:center;gap:4px}

  .bottom-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;z-index:1;position:relative}
  .bot-card{padding:18px;animation:fadeUp 0.5s var(--eo) 0.36s both}
  .bot-card:nth-child(2){animation-delay:0.4s}.bot-card:nth-child(3){animation-delay:0.44s}
  .bot-title{font-size:13px;font-weight:700;margin-bottom:12px;letter-spacing:-0.2px;display:flex;align-items:center;justify-content:space-between}
  .rev-chart{width:100%;height:120px;position:relative}
  .rev-chart svg{width:100%;height:100%}
  .rev-summary{display:flex;gap:16px;margin-top:10px}
  .rev-item{font-size:10px;color:var(--t3)}
  .rev-item strong{display:block;font-size:16px;color:var(--t1);font-family:var(--m);letter-spacing:-0.5px;margin-top:2px}
  .log-item{display:flex;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);font-size:11px}
  .log-item:last-child{border:none}
  .log-time{font-family:var(--m);color:var(--t3);font-size:10px;min-width:48px;flex-shrink:0}
  .log-text{color:var(--t2);line-height:1.4}.log-text strong{color:var(--t1)}
  .log-action{margin-left:auto;flex-shrink:0}
  .admin-alert{padding:10px 12px;border-radius:var(--rs);margin-bottom:6px;font-size:11px;display:flex;align-items:flex-start;gap:8px;line-height:1.4}
  .alert-severity{width:18px;height:18px;border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;font-weight:800;color:white}
  .alert-content{flex:1}.alert-title{font-weight:600;font-size:11px}
  .alert-desc{font-size:10px;color:var(--t3);margin-top:1px}
  .alert-time{font-size:9px;color:var(--t3);font-family:var(--m);margin-top:2px}
  .flag-item{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)}
  .flag-item:last-child{border:none}
  .flag-name{font-size:12px;font-weight:600}.flag-desc{font-size:10px;color:var(--t3)}
  .switch{width:36px;height:20px;border-radius:10px;background:var(--elevated);border:1px solid var(--border);cursor:pointer;position:relative;transition:all var(--t);flex-shrink:0}
  .switch.on{background:var(--green);border-color:var(--green)}
  .switch::after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:white;transition:transform var(--t);box-shadow:0 1px 3px rgba(0,0,0,0.2)}
  .switch.on::after{transform:translateX(16px)}
  .widget-hidden{display:none!important}

  /* ─── CUSTOMIZE PANEL ─── */
  .customize-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;opacity:0;pointer-events:none;transition:opacity 0.3s ease;backdrop-filter:blur(4px)}
  .customize-overlay.open{opacity:1;pointer-events:all}
  .customize-panel{position:fixed;top:0;right:-380px;width:380px;height:100vh;background:var(--card);border-left:1px solid var(--border);z-index:201;overflow-y:auto;padding:24px;transition:right 0.35s var(--eo);box-shadow:-8px 0 30px rgba(0,0,0,0.1)}
  .customize-panel.open{right:0}
  .panel-close{position:absolute;top:16px;right:16px;width:28px;height:28px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--t3);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all var(--t)}
  .panel-close:hover{background:var(--rm);color:var(--red);border-color:rgba(239,68,68,0.2)}
  .panel-header{display:flex;align-items:center;gap:12px;margin-bottom:4px}
  .panel-header-icon{width:36px;height:36px;border-radius:10px;background:var(--cm);color:var(--cyan);display:flex;align-items:center;justify-content:center}
  .panel-title{font-size:16px;font-weight:700;letter-spacing:-0.2px}
  .panel-sub{font-size:12px;color:var(--t3);margin-bottom:20px}
  .panel-section{margin-bottom:20px}
  .panel-section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--t3);margin-bottom:10px}
  .preset-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .preset-btn{padding:12px;border-radius:10px;border:1px solid var(--border);background:transparent;cursor:pointer;text-align:left;transition:all var(--t)}
  .preset-btn:hover{border-color:var(--border-h)}
  .preset-btn.active{border-color:rgba(6,182,212,0.3);background:var(--cm)}
  .preset-btn-icon{margin-bottom:6px;color:var(--t2);display:flex;align-items:center}
  .preset-btn-title{font-size:12px;font-weight:700;color:var(--t1)}
  .preset-btn-sub{font-size:10px;color:var(--t3)}
  .option-row{display:flex;gap:8px}
  .option-card{flex:1;padding:10px;border-radius:8px;border:1px solid var(--border);background:transparent;cursor:pointer;text-align:center;transition:all var(--t)}
  .option-card:hover{border-color:var(--border-h)}
  .option-card.active{border-color:rgba(6,182,212,0.3);background:var(--cm)}
  .option-swatch{width:24px;height:24px;border-radius:6px;margin:0 auto 6px;border:1px solid var(--border)}
  .option-label{font-size:11px;font-weight:600;color:var(--t2)}
  .accent-row{display:flex;gap:8px;flex-wrap:wrap}
  .accent-dot{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all var(--t);box-shadow:0 2px 6px rgba(0,0,0,0.1)}
  .accent-dot:hover{transform:scale(1.15)}
  .accent-dot.active{border-color:var(--t1);box-shadow:0 0 0 3px var(--cm)}
  .widget-toggle{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)}
  .widget-toggle:last-child{border:none}
  .widget-toggle-info{display:flex;align-items:center;gap:8px}
  .widget-toggle-icon{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700}
  .widget-toggle-name{font-size:12px;font-weight:600}

  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--card);border:1px solid rgba(6,182,212,0.2);color:var(--t1);padding:10px 20px;border-radius:10px;font-size:12px;font-weight:600;z-index:999;box-shadow:0 8px 30px rgba(0,0,0,0.15);opacity:0;transition:all 0.4s var(--eo);display:flex;align-items:center;gap:8px}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

  .layout-compact .platform-stats{gap:6px}.layout-compact .mid-grid,.layout-compact .bottom-grid{gap:8px}
  .layout-wide .platform-stats{grid-template-columns:repeat(3,1fr)}.layout-wide .mid-grid{grid-template-columns:1fr}
  .density-compact .pstat{padding:10px}.density-compact .bot-card,.density-compact .table-card,.density-compact .health-card{padding:12px}

  @media(max-width:1200px){.platform-stats{grid-template-columns:repeat(3,1fr)}.mid-grid,.bottom-grid{grid-template-columns:1fr}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- Topbar -->
<div class="topbar">
  <div class="tb-left">
    <svg class="tb-logo" viewBox="0 0 512 512"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a8fa8"/><stop offset="40%" stop-color="#0e7490"/><stop offset="100%" stop-color="#5b5bd6"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#lg)"/><path d="M256 96 L376 172 L376 320 C376 356 336 392 256 424 C176 392 136 356 136 320 L136 172 Z" fill="none" stroke="white" stroke-width="22" stroke-linejoin="round" stroke-opacity="0.9"/><circle cx="256" cy="260" r="44" fill="none" stroke="white" stroke-width="14" stroke-opacity="0.85"/><rect x="216" y="252" width="80" height="16" rx="8" fill="white" fill-opacity="0.85"/></svg>
    <span class="tb-brand">Vaultline</span>
    <span class="tb-tag">Super Admin</span>
  </div>
  <div class="tb-right">
    <button class="btn btn-ghost" onclick="togglePanel()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7.07-3.93 4.24-4.24m5.66-5.66 4.24-4.24M1 12h6m6 0h6m-3.93 7.07-4.24-4.24m-5.66-5.66L3.93 4.93"/></svg> Customize</button>
    <div class="icon-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg><div class="notif"></div></div>
    <div class="icon-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
    <button class="btn btn-ghost">Admin User</button>
  </div>
</div>

<div class="shell">
  <div class="sidebar">
    <div class="sb-label">Platform</div>
    <div class="sb-item active" onclick="navTo(this,'Dashboard')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> Dashboard</div>
    <div class="sb-item" onclick="navTo(this,'Customers')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Customers <span class="sb-badge">247</span></div>
    <div class="sb-item" onclick="navTo(this,'Revenue')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Revenue</div>
    <div class="sb-item" onclick="navTo(this,'Analytics')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Analytics</div>
    <div class="sb-label">Operations</div>
    <div class="sb-item" onclick="navTo(this,'System Health')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> System Health</div>
    <div class="sb-item" onclick="navTo(this,'Incidents')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> Incidents <span class="sb-badge">2</span></div>
    <div class="sb-item" onclick="navTo(this,'Audit Log')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg> Audit Log</div>
    <div class="sb-label">Config</div>
    <div class="sb-item" onclick="navTo(this,'Feature Flags')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Feature Flags</div>
    <div class="sb-item" onclick="navTo(this,'Security')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Security</div>
    <div class="sb-item" onclick="navTo(this,'Settings')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4"/></svg> Settings</div>
    <div class="sb-footer"><span class="dot"></span> admin v3.1.0</div>
  </div>

  <div class="main" id="dashboardMain">
    <div class="page-header">
      <div>
        <div class="page-title">Platform Overview</div>
        <div class="page-sub"><span class="live-dot"></span> Live &middot; Updated 30s ago &middot; All regions</div>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="btn btn-ghost" onclick="exportData()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export</button>
        <button class="btn btn-red" onclick="viewIncidents()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> 2 Active Incidents</button>
      </div>
    </div>

    <div class="platform-stats">
      <div class="glass pstat" data-widget="customers"><div class="pstat-label"><div class="pstat-dot" style="background:var(--cyan)"></div> Total Customers</div><div class="pstat-val" style="color:var(--cyan)">247</div><div class="pstat-change up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg> +12 this month</div></div>
      <div class="glass pstat" data-widget="mrr"><div class="pstat-label"><div class="pstat-dot" style="background:var(--green)"></div> MRR</div><div class="pstat-val" style="color:var(--green)">$312K</div><div class="pstat-change up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg> +8.4%</div></div>
      <div class="glass pstat" data-widget="arr"><div class="pstat-label"><div class="pstat-dot" style="background:var(--purple)"></div> ARR</div><div class="pstat-val" style="color:var(--purple)">$3.74M</div><div class="pstat-change up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg> +24% YoY</div></div>
      <div class="glass pstat" data-widget="churn"><div class="pstat-label"><div class="pstat-dot" style="background:var(--amber)"></div> Churn Rate</div><div class="pstat-val" style="color:var(--amber)">1.8%</div><div class="pstat-change up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg> -0.3pp</div></div>
      <div class="glass pstat" data-widget="uptime"><div class="pstat-label"><div class="pstat-dot" style="background:var(--green)"></div> Uptime</div><div class="pstat-val" style="color:var(--green)">99.99%</div><div class="pstat-change up">SLA maintained</div></div>
      <div class="glass pstat" data-widget="api-calls"><div class="pstat-label"><div class="pstat-dot" style="background:var(--cyan)"></div> API Calls (24h)</div><div class="pstat-val" style="color:var(--cyan)">2.4M</div><div class="pstat-change up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg> +15%</div></div>
    </div>

    <div class="mid-grid">
      <div class="glass table-card" data-widget="customer-table">
        <div class="table-header"><span class="table-title">Recent Customers</span><input class="search-input" placeholder="Search customers..."></div>
        <table>
          <thead><tr><th>Company</th><th>Plan</th><th>MRR</th><th>Status</th><th>Joined</th></tr></thead>
          <tbody>
            <tr><td><div class="customer-name">Meridian Capital</div><div class="customer-email">treasury@meridian.com</div></td><td><span class="plan-badge" style="background:var(--cm);color:var(--cyan)">Enterprise</span></td><td style="font-family:var(--m);font-weight:600">$2,499</td><td><span class="status-dot" style="background:var(--green)"></span>Active</td><td style="color:var(--t3);font-size:11px">Mar 24</td></tr>
            <tr><td><div class="customer-name">Apex Logistics</div><div class="customer-email">cfo@apexlog.io</div></td><td><span class="plan-badge" style="background:var(--pm);color:var(--purple)">Growth</span></td><td style="font-family:var(--m);font-weight:600">$1,299</td><td><span class="status-dot" style="background:var(--green)"></span>Active</td><td style="color:var(--t3);font-size:11px">Mar 22</td></tr>
            <tr><td><div class="customer-name">NovaTech Solutions</div><div class="customer-email">finance@novatech.co</div></td><td><span class="plan-badge" style="background:var(--pm);color:var(--purple)">Growth</span></td><td style="font-family:var(--m);font-weight:600">$1,299</td><td><span class="status-dot" style="background:var(--green)"></span>Active</td><td style="color:var(--t3);font-size:11px">Mar 20</td></tr>
            <tr><td><div class="customer-name">Clearview Health</div><div class="customer-email">ops@clearviewhq.com</div></td><td><span class="plan-badge" style="background:var(--gm);color:var(--green)">Starter</span></td><td style="font-family:var(--m);font-weight:600">$499</td><td><span class="status-dot" style="background:var(--amber)"></span>Onboarding</td><td style="color:var(--t3);font-size:11px">Mar 19</td></tr>
            <tr><td><div class="customer-name">Redpoint Ventures</div><div class="customer-email">treasury@redpoint.vc</div></td><td><span class="plan-badge" style="background:var(--cm);color:var(--cyan)">Enterprise</span></td><td style="font-family:var(--m);font-weight:600">$2,499</td><td><span class="status-dot" style="background:var(--green)"></span>Active</td><td style="color:var(--t3);font-size:11px">Mar 18</td></tr>
            <tr><td><div class="customer-name">Summit Manufacturing</div><div class="customer-email">cfo@summitmfg.com</div></td><td><span class="plan-badge" style="background:var(--pm);color:var(--purple)">Growth</span></td><td style="font-family:var(--m);font-weight:600">$1,299</td><td><span class="status-dot" style="background:var(--red)"></span>Churned</td><td style="color:var(--t3);font-size:11px">Mar 15</td></tr>
          </tbody>
        </table>
      </div>

      <div class="glass health-card" data-widget="system-health">
        <div class="health-title">System Health</div>
        <div class="health-item"><div class="health-info"><div class="health-icon" style="background:var(--gm);color:var(--green)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/></svg></div><div><div class="health-name">API Gateway</div><div class="health-sub">us-east-1, eu-west-1</div></div></div><span class="health-status" style="background:var(--gm);color:var(--green)"><span class="status-dot" style="background:var(--green)"></span>Healthy</span></div>
        <div class="health-item"><div class="health-info"><div class="health-icon" style="background:var(--gm);color:var(--green)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg></div><div><div class="health-name">PostgreSQL</div><div class="health-sub">Primary + 2 replicas</div></div></div><span class="health-status" style="background:var(--gm);color:var(--green)"><span class="status-dot" style="background:var(--green)"></span>Healthy</span></div>
        <div class="health-item"><div class="health-info"><div class="health-icon" style="background:var(--gm);color:var(--green)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div><div class="health-name">Plaid Integration</div><div class="health-sub">12,000+ institutions</div></div></div><span class="health-status" style="background:var(--gm);color:var(--green)"><span class="status-dot" style="background:var(--green)"></span>Healthy</span></div>
        <div class="health-item"><div class="health-info"><div class="health-icon" style="background:var(--am);color:var(--amber)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg></div><div><div class="health-name">Email Service</div><div class="health-sub">SendGrid</div></div></div><span class="health-status" style="background:var(--am);color:var(--amber)"><span class="status-dot" style="background:var(--amber)"></span>Degraded</span></div>
        <div class="health-item"><div class="health-info"><div class="health-icon" style="background:var(--gm);color:var(--green)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div><div class="health-name">Auth / SSO</div><div class="health-sub">Supabase Auth</div></div></div><span class="health-status" style="background:var(--gm);color:var(--green)"><span class="status-dot" style="background:var(--green)"></span>Healthy</span></div>
        <div class="health-item"><div class="health-info"><div class="health-icon" style="background:var(--rm);color:var(--red)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div><div><div class="health-name">File Storage</div><div class="health-sub">R2 / S3</div></div></div><span class="health-status" style="background:var(--rm);color:var(--red)"><span class="status-dot" style="background:var(--red)"></span>Incident</span></div>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="glass bot-card" data-widget="revenue">
        <div class="bot-title">Revenue Trend <span class="plan-badge" style="background:var(--gm);color:var(--green)">+8.4% MoM</span></div>
        <div class="rev-chart">
          <svg viewBox="0 0 400 120" preserveAspectRatio="none">
            <defs><linearGradient id="rg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:var(--green);stop-opacity:0.2"/><stop offset="100%" style="stop-color:var(--green);stop-opacity:0.01"/></linearGradient></defs>
            <line x1="0" y1="30" x2="400" y2="30" stroke="var(--border)" stroke-width="1"/>
            <line x1="0" y1="60" x2="400" y2="60" stroke="var(--border)" stroke-width="1"/>
            <line x1="0" y1="90" x2="400" y2="90" stroke="var(--border)" stroke-width="1"/>
            <path d="M0,100 C30,95 60,90 100,82 C140,74 170,78 200,65 C240,50 270,55 300,40 C340,28 370,22 400,15 L400,120 L0,120 Z" fill="url(#rg)"/>
            <path d="M0,100 C30,95 60,90 100,82 C140,74 170,78 200,65 C240,50 270,55 300,40 C340,28 370,22 400,15" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round"/>
            <circle cx="400" cy="15" r="3" fill="var(--green)"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/></circle>
          </svg>
        </div>
        <div class="rev-summary">
          <div class="rev-item">MRR<strong style="color:var(--green)">$312K</strong></div>
          <div class="rev-item">ARR<strong style="color:var(--purple)">$3.74M</strong></div>
          <div class="rev-item">ARPU<strong style="color:var(--cyan)">$1,263</strong></div>
        </div>
      </div>

      <div class="glass bot-card" data-widget="activity">
        <div class="bot-title">Admin Activity</div>
        <div class="log-item"><span class="log-time">14:32</span><div class="log-text"><strong>Admin</strong> approved Clearview Health onboarding extension</div></div>
        <div class="log-item"><span class="log-time">13:18</span><div class="log-text"><strong>System</strong> flagged Summit Mfg for churn risk</div></div>
        <div class="log-item"><span class="log-time">12:45</span><div class="log-text"><strong>Admin</strong> toggled AI Forecast v3 feature flag</div></div>
        <div class="log-item"><span class="log-time">11:20</span><div class="log-text"><strong>System</strong> auto-scaled API to handle traffic spike</div></div>
        <div class="log-item"><span class="log-time">10:05</span><div class="log-text"><strong>Admin</strong> responded to Meridian Capital support ticket</div></div>
        <div class="log-item"><span class="log-time">09:30</span><div class="log-text"><strong>System</strong> completed nightly database backup</div></div>
      </div>

      <div class="glass bot-card" data-widget="incidents">
        <div class="bot-title">Active Incidents</div>
        <div class="admin-alert" style="background:var(--rm);">
          <div class="alert-severity" style="background:var(--red)">P1</div>
          <div class="alert-content"><div class="alert-title">File Storage Latency Spike</div><div class="alert-desc">R2 uploads exceeding 5s timeout in eu-west-1</div><div class="alert-time">Started 18m ago</div></div>
        </div>
        <div class="admin-alert" style="background:var(--am);">
          <div class="alert-severity" style="background:var(--amber)">P2</div>
          <div class="alert-content"><div class="alert-title">Email Delivery Delays</div><div class="alert-desc">SendGrid reporting 2-5min delays on transactional emails</div><div class="alert-time">Started 45m ago</div></div>
        </div>
        <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);">
          <div style="font-size:11px;font-weight:700;margin-bottom:8px;">Feature Flags</div>
          <div class="flag-item"><div><div class="flag-name">AI Forecast v3</div><div class="flag-desc">New ML model for 90-day</div></div><div class="switch on" onclick="this.classList.toggle('on')"></div></div>
          <div class="flag-item"><div><div class="flag-name">Multi-Currency</div><div class="flag-desc">FX conversion + hedging</div></div><div class="switch on" onclick="this.classList.toggle('on')"></div></div>
          <div class="flag-item"><div><div class="flag-name">Dark Mode v2</div><div class="flag-desc">Midnight theme option</div></div><div class="switch" onclick="this.classList.toggle('on')"></div></div>
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
    <div class="panel-header-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7.07-3.93 4.24-4.24m5.66-5.66 4.24-4.24M1 12h6m6 0h6m-3.93 7.07-4.24-4.24m-5.66-5.66L3.93 4.93"/></svg></div>
    <div class="panel-title">Customize Dashboard</div>
  </div>
  <div class="panel-sub">Personalize your admin workspace</div>

  <div class="panel-section">
    <div class="panel-section-label">Quick Presets</div>
    <div class="preset-grid">
      <div class="preset-btn active" onclick="applyPreset('overview',this)"><div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></div><div class="preset-btn-title">Overview</div><div class="preset-btn-sub">All platform metrics</div></div>
      <div class="preset-btn" onclick="applyPreset('revenue',this)"><div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="preset-btn-title">Revenue</div><div class="preset-btn-sub">Financial focus</div></div>
      <div class="preset-btn" onclick="applyPreset('operations',this)"><div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4"/></svg></div><div class="preset-btn-title">Operations</div><div class="preset-btn-sub">Health & incidents</div></div>
      <div class="preset-btn" onclick="applyPreset('security',this)"><div class="preset-btn-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="preset-btn-title">Security</div><div class="preset-btn-sub">Audit & compliance</div></div>
    </div>
  </div>

  <div class="panel-section">
    <div class="panel-section-label">Theme</div>
    <div class="option-row">
      <div class="option-card" id="themeDark" onclick="setTheme('dark',this)"><div class="option-swatch" style="background:#0B1121;"></div><div class="option-label">Dark</div></div>
      <div class="option-card active" id="themeLight" onclick="setTheme('light',this)"><div class="option-swatch" style="background:#F8FAFC;border-color:#e2e8f0;"></div><div class="option-label">Light</div></div>
      <div class="option-card" id="themeMidnight" onclick="setTheme('midnight',this)"><div class="option-swatch" style="background:linear-gradient(135deg,#0c1445,#1a1040);"></div><div class="option-label">Midnight</div></div>
    </div>
  </div>

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

  <div class="panel-section">
    <div class="panel-section-label">Layout</div>
    <div class="option-row">
      <div class="option-card active" onclick="setLayout('default',this)"><div class="option-label">Default</div></div>
      <div class="option-card" onclick="setLayout('compact',this)"><div class="option-label">Compact</div></div>
      <div class="option-card" onclick="setLayout('wide',this)"><div class="option-label">Wide</div></div>
    </div>
  </div>

  <div class="panel-section">
    <div class="panel-section-label">Density</div>
    <div class="option-row" id="densityRow">
      <div class="option-card active" onclick="setDensity('comfortable',this)"><div class="option-label">Comfortable</div></div>
      <div class="option-card" onclick="setDensity('compact',this)"><div class="option-label">Compact</div></div>
    </div>
  </div>

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

<div class="toast" id="toast"></div>


` }} />
    </>
  );
}
