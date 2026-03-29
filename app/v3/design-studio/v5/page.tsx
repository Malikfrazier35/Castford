'use client';

import { useEffect, useRef } from 'react';

export default function V3DesignStudioV5Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const ACCENT_COLORS=['#3B82F6','#06B6D4','#8B5CF6','#10B981','#F59E0B','#EF4444','#EC4899','#6366F1'];
const MODULES=[
  {name:'KPI Cards',desc:'Key performance indicators',on:true},
  {name:'Charts',desc:'Revenue & trend visualizations',on:true},
  {name:'Data Tables',desc:'Close tasks & reconciliation',on:true},
  {name:'AI Copilot',desc:'Natural language insights',on:true},
  {name:'Connector Bar',desc:'Integration sync status',on:true},
  {name:'Team Panel',desc:'Team member activity',on:true}
];

const ROLES={
  cfo:{name:'Sarah',title:'CFO Command Center',kpis:[{icon:'💰',label:'Revenue',value:'$4.2M',change:'+12.3%',dir:'up',c:'c-blue',spark:[30,45,38,55,48,62,55,70,65,75,68,82]},{icon:'🔥',label:'Burn Rate',value:'$890K',change:'-8.1%',dir:'up',c:'c-amber',spark:[70,65,72,60,68,55,62,58,52,60,55,50]},{icon:'✈️',label:'Runway',value:'18.2mo',change:'+2.4mo',dir:'up',c:'c-green',spark:[40,42,45,48,50,55,58,62,65,70,72,78]},{icon:'📊',label:'EBITDA',value:'$1.1M',change:'+34%',dir:'up',c:'c-purple',spark:[20,25,30,28,35,42,48,55,60,65,72,80]}],charts:{l:{title:'Revenue vs Forecast',bars:[42,55,62,50,72,65,80,70,85,78,60,52],color:'var(--accent)'},r:{title:'Burn Rate Trend',bars:[70,65,72,60,68,55,62,58,52,60,55,50],color:'var(--amber)'}},table:{title:'Close Tasks',cols:['Task','Owner','Status','Due'],w:'3fr 1.5fr 1fr 1fr',rows:[['Revenue recognition','Sarah C.','done','Mar 28'],['AP accruals review','Priya P.','progress','Mar 29'],['Interco eliminations','James R.','pending','Mar 30'],['Board deck draft','Sarah C.','pending','Mar 31']]},sidebar:['Overview','P&L','Forecast','Scenarios','Multi-Entity','Integrations','AI Copilot','Command Center','Close Tasks','Team','Settings']},
  ceo:{name:'Michael',title:'CEO Strategic Dashboard',kpis:[{icon:'🚀',label:'ARR',value:'$51.2M',change:'+28%',dir:'up',c:'c-purple',spark:[40,48,55,52,62,68,72,78,85,90,88,95]},{icon:'🔄',label:'NDR',value:'118%',change:'+3pp',dir:'up',c:'c-green',spark:[80,82,85,84,88,90,92,91,94,95,93,96]},{icon:'⏱️',label:'CAC Payback',value:'11mo',change:'-2mo',dir:'up',c:'c-cyan',spark:[18,17,16,15,14,13,13,12,12,11,11,11]},{icon:'📈',label:'Rule of 40',value:'52',change:'+4pts',dir:'up',c:'c-blue',spark:[35,38,40,42,44,45,46,48,49,50,51,52]}],charts:{l:{title:'ARR Growth',bars:[40,48,55,52,62,68,72,78,85,90,88,95],color:'var(--purple)'},r:{title:'Net Revenue Retention',bars:[80,82,85,84,88,90,92,91,94,95,93,96],color:'var(--green)'}},table:{title:'Board Action Items',cols:['Item','Owner','Priority','Deadline'],w:'3fr 1.5fr 1fr 1fr',rows:[['Series C timeline','Michael T.','done','Mar 28'],['Hiring plan Q2','Sarah C.','progress','Apr 1'],['Market expansion EU','David K.','pending','Apr 5'],['Product roadmap','CTO','pending','Apr 8']]},sidebar:['Overview','Growth Metrics','Forecast','Scenarios','Investor Metrics','Integrations','AI Copilot','Command Center','SOX Audit','Team','Settings']},
  controller:{name:'Priya',title:'Controller Operations',kpis:[{icon:'📋',label:'Close Progress',value:'72%',change:'Day 3 of 5',dir:'up',c:'c-green',spark:[10,20,35,50,72,0,0,0,0,0,0,0]},{icon:'📝',label:'Open Items',value:'8',change:'-3 today',dir:'up',c:'c-cyan',spark:[15,14,12,11,10,10,9,8,8,8,8,8]},{icon:'⚡',label:'Variances',value:'2',change:'All < 5%',dir:'up',c:'c-amber',spark:[8,7,6,5,4,4,3,3,3,2,2,2]},{icon:'🛡️',label:'Audit Score',value:'98.2',change:'+0.4',dir:'up',c:'c-purple',spark:[90,91,92,93,94,95,96,97,97,98,98,98]}],charts:{l:{title:'Close Timeline',bars:[20,35,50,72,0,0,0,0,0,0,0,0],color:'var(--green)'},r:{title:'Reconciliation Queue',bars:[95,90,88,82,78,70,65,55,48,40,35,28],color:'var(--cyan)'}},table:{title:'Reconciliation Queue',cols:['Account','Status','Variance','Assignee'],w:'3fr 1fr 1fr 1.5fr',rows:[['Cash & equivalents','done','$0','Priya P.'],['Accounts receivable','progress','$12K','James R.'],['Prepaid expenses','pending','$42K','Priya P.'],['Deferred revenue','pending','$8K','James R.']]},sidebar:['Overview','Close Tasks','Reconciliation','Audit Trail','SOX Audit','Integrations','AI Copilot','Team','Settings']}
};

const TIERS={
  starter:{label:'Starter',color:'#06B6D4',price:'$499/mo',banner:'Core dashboard with P&L, basic KPIs, and integrations',features:['Overview','P&L','Basic KPIs','Integrations'],lockG:['Forecast','Scenarios','AI Copilot','Multi-Entity','Growth Metrics','Investor Metrics'],lockB:['Command Center','Close Tasks','Team','SOX Audit','Audit Trail','Reconciliation']},
  growth:{label:'Growth',color:'#10B981',price:'$1,499/mo',banner:'Advanced analytics with forecasting, scenarios, and AI Copilot',features:['Everything in Starter','Forecast','Scenarios','AI Copilot','Multi-Entity'],lockG:[],lockB:['Command Center','Close Tasks','Team','SOX Audit','Audit Trail','Reconciliation']},
  business:{label:'Business',color:'#8B5CF6',price:'$3,999/mo',banner:'Full enterprise suite with Command Center, SOX audit, SSO, and team management',features:['Everything in Growth','Command Center','Close Tasks','Investor Metrics','SOX Audit'],lockG:[],lockB:[]}
};

const DESIGNS=[
  {id:'arctic',name:'Arctic Light',desc:'Clean white surfaces with blue accents',cats:['light'],tags:[{l:'DEFAULT',c:'#3B82F6'},{l:'LIGHT',c:'#94A3B8'}],bg:'#F8FAFC',surface:'#ffffff',card:'#ffffff',elevated:'#F1F5F9',accent:'#3B82F6',text:'#0F172A',text2:'#64748B',border:'#E2E8F0',bars:[45,58,65,52,75,68,82,74,88,80,62,55],font:'dm'},
  {id:'midnight',name:'Midnight',desc:'Deep navy with cyan glow effects',cats:['dark'],tags:[{l:'DARK',c:'#818CF8'},{l:'POPULAR',c:'#34D399'}],bg:'#030711',surface:'#070D19',card:'#0C1323',elevated:'#111827',accent:'#22D3EE',text:'#F1F5F9',text2:'#94A3B8',border:'rgba(30,48,80,0.5)',bars:[35,42,50,32,55,38,45,28,52,30,48,40],font:'dm'},
  {id:'warm',name:'Warm Sand',desc:'Soft cream tones with amber accents',cats:['light','new'],tags:[{l:'LIGHT',c:'#D97706'},{l:'NEW',c:'#EC4899'}],bg:'#FFFBF5',surface:'#FFF8EE',card:'#FFFFFF',elevated:'#FFF5E6',accent:'#D97706',text:'#1C1410',text2:'#8B7355',border:'rgba(180,140,100,0.15)',bars:[60,55,70,48,65,72,58,80,62,75,68,85],font:'dm'},
  {id:'forest',name:'Forest',desc:'Deep emerald with green data accents',cats:['dark'],tags:[{l:'DARK',c:'#34D399'}],bg:'#040D0A',surface:'#061210',card:'#0A1A14',elevated:'#0F2418',accent:'#34D399',text:'#D1FAE5',text2:'#6EE7B7',border:'rgba(52,211,153,0.1)',bars:[40,52,48,65,58,72,55,68,78,62,85,70],font:'dm'},
  {id:'executive',name:'Executive',desc:'Deep violet for board-ready presentations',cats:['dark','new'],tags:[{l:'DARK',c:'#818CF8'},{l:'NEW',c:'#FBBF24'}],bg:'#0C0A1A',surface:'#0E0C1E',card:'#14102A',elevated:'#1A1540',accent:'#818CF8',text:'#E2E0F0',text2:'#A5A0D0',border:'rgba(129,140,248,0.12)',bars:[50,62,55,70,65,78,72,82,75,88,80,92],font:'dm'},
  {id:'terminal',name:'Terminal',desc:'Pure black with monospace matrix effects',cats:['dark'],tags:[{l:'DARK',c:'#22D3EE'},{l:'HACKER',c:'#34D399'}],bg:'#0a0a0a',surface:'#0d0d0d',card:'#111111',elevated:'#1a1a1a',accent:'#22D3EE',text:'#E0E0E0',text2:'#888888',border:'rgba(34,211,238,0.08)',bars:[30,45,38,52,42,58,35,62,48,55,65,40],font:'mono'}
];

// STATE
let role='cfo',tier='growth',design='arctic',view='Overview',accentColor='#3B82F6',moduleState={};
MODULES.forEach(m=>moduleState[m.name]=m.on);

// CLOCK
function tick(){document.getElementById('clock').textContent=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
setInterval(tick,1000);tick();

// TOAST
function toast(type,title,msg){const c=document.getElementById('toasts');const t=document.createElement('div');t.className='toast '+type;t.innerHTML=\`<div class="toast-icon">\${{success:'✓',info:'ℹ',warning:'⚠'}[type]||'ℹ'}</div><div><div class="tt">\${title}</div><div class="tm">\${msg}</div></div><button class="tc" onclick="this.parentElement.remove()">✕</button><div class="tp"></div>\`;c.appendChild(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},3500);}

// THEME APPLICATION — actually recolors everything
function applyThemeCSS(d){
  if(!d)d=DESIGNS.find(x=>x.id===design);
  const s=document.documentElement.style;
  s.setProperty('--bg',d.bg);s.setProperty('--surface',d.surface);s.setProperty('--card',d.card);s.setProperty('--elevated',d.elevated);
  s.setProperty('--t1',d.text);s.setProperty('--t2',d.text2);s.setProperty('--t3',d.text2);s.setProperty('--t4',d.text2+'99');
  s.setProperty('--accent',accentColor);s.setProperty('--border',d.border);
  s.setProperty('--accent-dim',accentColor+'10');s.setProperty('--accent-glow',accentColor+'25');
  s.setProperty('--font',d.font==='mono'?"'JetBrains Mono',monospace":"'DM Sans',system-ui,sans-serif");
  document.body.style.background=d.bg;
}

// ACTIONS
function setRole(r,el){role=r;view='Overview';document.querySelectorAll('.role-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');render();toast('success','Role',ROLES[r].title);}
function setTier(t,el){tier=t;view='Overview';document.querySelectorAll('.tier-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');const T=TIERS[t];const b=document.getElementById('planBadge');b.textContent=T.label.toUpperCase();b.style.color=T.color;b.style.background=T.color+'10';render();toast('info','Plan',T.label+' · '+T.price);}
function setView(v,el){if(isLocked(v)){toast('warning','Locked',v+' requires upgrade');return;}view=v;document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('active'));if(el)el.classList.add('active');renderMain();}
function pickTheme(id,el){design=id;document.querySelectorAll('.cbar-swatch').forEach(s=>s.classList.remove('active'));el.classList.add('active');accentColor=DESIGNS.find(d=>d.id===id).accent;applyThemeCSS();render();toast('success','Theme',DESIGNS.find(d=>d.id===id).name+' applied');}
function pickLayout(l,el){document.querySelectorAll('.cbar-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');}
function isLocked(item){const T=TIERS[tier];const il=item.toLowerCase();return T.lockG.some(l=>il.includes(l.toLowerCase().split(' ')[0]))||T.lockB.some(l=>il.includes(l.toLowerCase().split(' ')[0]));}
function lockTier(item){const T=TIERS[tier];const il=item.toLowerCase();if(T.lockG.some(l=>il.includes(l.toLowerCase().split(' ')[0])))return 'growth';if(T.lockB.some(l=>il.includes(l.toLowerCase().split(' ')[0])))return 'business';return null;}

// RENDER
function render(){renderSidebar();renderMain();}
function renderSidebar(){
  const R=ROLES[role];let h='<div class="sb-section"><div class="sb-label">DASHBOARD</div>';
  R.sidebar.forEach((item,i)=>{const locked=isLocked(item);const lt=lockTier(item);const active=item===view;
    h+=\`<div class="sb-item\${active?' active':''}\${locked?' locked':''}" onclick="\${locked?'':\`setView('\${item}',this)\`}">
      <span class="ico">\${['📊','💹','📈','🔀','🏢','🔗','✨','🎯','📋','👥','⚙️'][i]||'📄'}</span>
      <span>\${item}</span>
      \${locked?\`<span class="lock-badge" style="background:\${lt==='growth'?'rgba(16,185,129,0.1);color:#10B981':'rgba(139,92,246,0.1);color:#8B5CF6'}">🔒 \${lt==='growth'?'GROWTH':'BIZ'}</span>\`:''}
      \${item==='Overview'&&!locked?\`<span class="cnt">\${R.table.rows.length}</span>\`:''}
    </div>\`;
  });h+='</div>';document.getElementById('sidebar').innerHTML=h;
}

function renderMain(){
  const R=ROLES[role],T=TIERS[tier];let h='';
  // Tier banner
  h+=\`<div class="tier-banner" style="animation:fadeUp 0.4s var(--ease)"><span class="plan-badge" style="background:\${T.color}10;color:\${T.color};">\${T.label.toUpperCase()}</span><div style="flex:1"><h3 style="font-size:13px;font-weight:700;">\${T.banner}</h3><p style="font-size:11px;color:var(--t4);">\${T.price} · Billed annually</p></div><div style="display:flex;gap:12px;font-size:11px;color:var(--t3);">\${T.features.slice(0,5).map(f=>\`<span style="white-space:nowrap;">✓ \${f}</span>\`).join('')}</div></div>\`;

  if(view==='Overview')h+=renderOverview(R,T);
  else if(view==='Settings')h+=renderSettings();
  else if(view==='Integrations')h+=renderIntegrations();
  else h+=renderOverview(R,T);
  h+='<div class="bottom-space"></div>';
  document.getElementById('main').innerHTML=h;
}

function renderOverview(R,T){
  let h='';
  // Connectors
  if(moduleState['Connector Bar'])h+=\`<div class="connectors"><span class="clabel">Connectors</span>\${['NetSuite','Salesforce','Stripe','Snowflake','Rippling','HubSpot','Ramp'].map(n=>\`<div class="conn" onclick="toast('success','\${n}','Synced just now')"><span class="dot"></span>\${n}</div>\`).join('')}</div>\`;
  // Header
  h+=\`<div class="dash-header" style="animation:fadeUp 0.4s var(--ease) 0.05s backwards;"><h1>Good morning, \${R.name}</h1><div class="sub"><span class="live-dot"></span>\${R.title} · Live sync · March 28, 2026</div></div>\`;
  // KPIs
  if(moduleState['KPI Cards'])h+=\`<div class="kpis stagger">\${R.kpis.map((k,i)=>\`<div class="kpi \${k.c}"><div class="icon">\${k.icon}</div><div class="label">\${k.label.toUpperCase()}</div><div class="value" style="animation-delay:\${i*0.08}s">\${k.value}</div><div class="change \${k.dir}">↑ \${k.change}</div><div class="spark">\${k.spark.map((v,si)=>\`<i style="height:\${v}%;background:var(--accent);opacity:0.4;animation-delay:\${si*0.03}s"></i>\`).join('')}</div></div>\`).join('')}</div>\`;
  // Charts
  if(moduleState['Charts']){h+=\`<div class="charts stagger">\`;['l','r'].forEach((s,ci)=>{const c=R.charts[s];h+=\`<div class="chart-card"><h3>\${c.title}<span class="lt">Live</span></h3><div class="bar-chart">\${c.bars.map((b,bi)=>\`<div class="bar" data-v="\${b}%" style="height:\${b}%;background:\${c.color};opacity:0.6;animation-delay:\${bi*0.04}s"></div>\`).join('')}</div><div class="chart-labels">\${M.map(m=>\`<span>\${m}</span>\`).join('')}</div></div>\`;});h+='</div>';}
  // Table
  if(moduleState['Data Tables'])h+=\`<div class="data-table" style="animation:scaleReveal 0.5s var(--ease) 0.2s backwards;"><div class="dt-head" style="grid-template-columns:\${R.table.w}">\${R.table.cols.map(c=>\`<span>\${c.toUpperCase()}</span>\`).join('')}</div>\${R.table.rows.map((r,ri)=>\`<div class="dt-row" style="grid-template-columns:\${R.table.w};animation:fadeUp 0.3s var(--ease) \${0.25+ri*0.04}s backwards;" onclick="toast('info','\${r[0]}','Opening detail view…')"><span style="font-weight:600;">\${r[0]}</span><span>\${r[1]}</span><span class="status s-\${r[2]}">\${r[2].toUpperCase()}</span><span style="color:var(--t4);">\${r[3]}</span></div>\`).join('')}</div>\`;
  // AI
  if(moduleState['AI Copilot']){
    if(tier==='starter'){h+=\`<div class="lock-wrap" style="min-height:120px;"><div class="lock-blur"><div class="ai-grid"><div class="ai-card"><div class="tag" style="color:var(--amber);">⚡ VARIANCE</div><p>Alert…</p></div><div class="ai-card"><div class="tag" style="color:var(--green);">📈 FORECAST</div><p>Trending…</p></div><div class="ai-card"><div class="tag" style="color:var(--cyan);">✈️ RUNWAY</div><p>Extended…</p></div></div></div><div class="lock-gate"><div class="licon">🔒</div><div class="ltitle">AI Copilot Insights</div><div class="lsub">Available on Growth plan and above</div><button class="ubtn" style="background:#10B981;" onclick="setTier('growth',document.querySelector('.t-growth'))">Upgrade to Growth · $1,499/mo</button></div></div>\`;}
    else{h+=\`<div class="ai-section" style="animation:fadeUp 0.4s var(--ease) 0.3s backwards;"><h3>✨ AI Copilot Insights</h3><div class="ai-grid stagger"><div class="ai-card" onclick="toast('warning','Variance','Marketing OPEX $67K over budget')"><div class="tag" style="color:var(--amber);">⚡ VARIANCE ALERT</div><p>Marketing OPEX is <strong>$67K over budget</strong> — auto-reclassified to prepaid.</p></div><div class="ai-card" onclick="toast('success','Forecast','Revenue 7.7% above Q1 target')"><div class="tag" style="color:var(--green);">📈 FORECAST</div><p>Revenue trending <strong>7.7% above</strong> Q1 forecast.</p></div><div class="ai-card" onclick="toast('info','Runway','Cash runway now 18.2 months')"><div class="tag" style="color:var(--cyan);">✈️ RUNWAY</div><p>Cash runway extended to <strong>18.2 months</strong> (+2.4mo).</p></div></div></div>\`;}
  }
  // Team
  if(moduleState['Team Panel']){
    if(tier==='business'){h+=\`<h3 style="font-size:13px;font-weight:700;margin:16px 0 10px;">Team Active</h3><div class="team-grid stagger"><div class="team-card" onclick="toast('info','Sarah C.','CFO · Online')"><div class="avatar" style="background:linear-gradient(135deg,#3B82F6,#2563EB);">SC</div><div class="tname">Sarah C.</div><div class="trole">CFO</div><div class="tstatus">Online</div></div><div class="team-card" onclick="toast('info','James R.','FP&A · Online')"><div class="avatar" style="background:linear-gradient(135deg,#10B981,#059669);">JR</div><div class="tname">James R.</div><div class="trole">FP&A</div><div class="tstatus">Online</div></div><div class="team-card" onclick="toast('info','Priya P.','Controller · Online')"><div class="avatar" style="background:linear-gradient(135deg,#F59E0B,#D97706);">PP</div><div class="tname">Priya P.</div><div class="trole">Controller</div><div class="tstatus">Online</div></div><div class="team-card" onclick="toast('info','David K.','RevOps · Away')"><div class="avatar" style="background:linear-gradient(135deg,#8B5CF6,#7C3AED);">DK</div><div class="tname">David K.</div><div class="trole">RevOps</div><div class="tstatus" style="color:var(--amber);">Away</div></div></div>\`;}
    else{h+=\`<div class="lock-wrap" style="min-height:100px;"><div class="lock-blur"><div class="team-grid"><div class="team-card"><div class="avatar" style="background:#ccc;"></div><div class="tname">Team</div></div><div class="team-card"><div class="avatar" style="background:#ccc;"></div><div class="tname">Team</div></div><div class="team-card"><div class="avatar" style="background:#ccc;"></div><div class="tname">Team</div></div><div class="team-card"><div class="avatar" style="background:#ccc;"></div><div class="tname">Team</div></div></div></div><div class="lock-gate"><div class="licon">🔒</div><div class="ltitle">Team Management</div><div class="lsub">Available on Business plan</div><button class="ubtn" style="background:#8B5CF6;" onclick="setTier('business',document.querySelector('.t-business'))">Upgrade to Business · $3,999/mo</button></div></div>\`;}
  }
  return h;
}

function renderSettings(){return \`<div style="animation:fadeUp 0.4s var(--ease)"><h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Settings</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;"><div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;"><h4 style="font-size:14px;font-weight:700;margin-bottom:12px;">👤 Account</h4><div class="module-row"><div class="mname">Organization</div><div class="mdesc">Vaultline Inc.</div></div><div class="module-row"><div class="mname">Email</div><div class="mdesc">admin@vaultline.io</div></div><div class="module-row"><div class="mname">2FA</div><div class="toggle on" onclick="this.classList.toggle('on');toast('info','2FA',this.classList.contains('on')?'Enabled':'Disabled')"></div></div></div><div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;"><h4 style="font-size:14px;font-weight:700;margin-bottom:12px;">🎨 Appearance</h4><div class="module-row"><div class="mname">Theme</div><span style="font-size:12px;color:var(--accent);cursor:pointer;" onclick="openStudio()">Open Design Studio →</span></div><div class="module-row"><div class="mname">Animations</div><div class="toggle on" onclick="this.classList.toggle('on')"></div></div><div class="module-row"><div class="mname">Compact Mode</div><div class="toggle" onclick="this.classList.toggle('on')"></div></div></div><div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;"><h4 style="font-size:14px;font-weight:700;margin-bottom:12px;">🔔 Notifications</h4><div class="module-row"><div class="mname">Email Digest</div><div class="toggle on" onclick="this.classList.toggle('on')"></div></div><div class="module-row"><div class="mname">Slack Alerts</div><div class="toggle on" onclick="this.classList.toggle('on')"></div></div><div class="module-row"><div class="mname">Variance Alerts</div><div class="toggle on" onclick="this.classList.toggle('on')"></div></div></div><div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;"><h4 style="font-size:14px;font-weight:700;margin-bottom:12px;">🔒 Security</h4><div class="module-row"><div class="mname">SSO Provider</div><div class="mdesc">Okta</div></div><div class="module-row"><div class="mname">IP Allowlist</div><div class="toggle" onclick="this.classList.toggle('on')"></div></div><div class="module-row"><div class="mname">Audit Logging</div><div class="toggle on" onclick="this.classList.toggle('on')"></div></div></div></div></div>\`;}

function renderIntegrations(){const ints=[{i:'📊',n:'NetSuite',s:1},{i:'💼',n:'Salesforce',s:1},{i:'💳',n:'Stripe',s:1},{i:'❄️',n:'Snowflake',s:1},{i:'👥',n:'Rippling',s:1},{i:'📈',n:'HubSpot',s:1},{i:'💰',n:'Ramp',s:1},{i:'📧',n:'Slack',s:0},{i:'📅',n:'Google Workspace',s:0}];return \`<div style="animation:fadeUp 0.4s var(--ease)"><h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Integrations</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;" class="stagger">\${ints.map(ig=>\`<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center;cursor:pointer;transition:all 0.25s var(--ease);" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.transform='';this.style.boxShadow=''" onclick="toast('\${ig.s?'success':'info'}','\${ig.n}','\${ig.s?'Synced 2m ago':'Click to connect'}')"><div style="width:44px;height:44px;border-radius:12px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:20px;background:\${ig.s?'var(--green-dim)':'var(--elevated)'};">\${ig.i}</div><div style="font-size:13px;font-weight:700;">\${ig.n}</div><div style="font-size:10px;font-weight:600;margin-top:4px;color:\${ig.s?'var(--green)':'var(--t4)'};">\${ig.s?'● Connected':'○ Available'}</div>\${!ig.s?\`<button style="margin-top:8px;padding:5px 14px;border-radius:6px;font-size:11px;font-weight:600;border:1px solid var(--border);background:var(--surface);color:var(--t2);cursor:pointer;" onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--accent)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--t2)'" onclick="event.stopPropagation();toast('success','\${ig.n}','Connecting…')">Connect</button>\`:''}</div>\`).join('')}</div></div>\`;}

// DESIGN STUDIO
function openStudio(){document.getElementById('studioModal').classList.add('open');renderStudio('all');renderAccentGrid();renderModuleToggles();}
function closeStudio(){document.getElementById('studioModal').classList.remove('open');}
function filterStudio(cat,el){document.querySelectorAll('.studio-cat').forEach(c=>c.classList.remove('active'));el.classList.add('active');renderStudio(cat);}

function renderStudio(cat){
  const filtered=cat==='all'?DESIGNS:DESIGNS.filter(d=>d.cats.includes(cat));
  document.getElementById('studioGrid').innerHTML=filtered.map(d=>\`
    <div class="studio-card\${d.id===design?' selected':''}" onclick="selectDesign('\${d.id}',this)">
      <div class="check">✓</div>
      <div class="sp" style="background:\${d.bg};">
        <div class="sp-sb" style="background:\${d.surface};border-color:\${d.border};"><div class="sp-logo" style="background:linear-gradient(135deg,\${d.accent},#8B5CF6);"></div><div class="sp-dot on" style="background:\${d.accent};"></div><div class="sp-dot" style="background:\${d.border};"></div><div class="sp-dot" style="background:\${d.border};"></div></div>
        <div class="sp-top" style="background:\${d.surface};border-color:\${d.border};color:\${d.text};">Command Center</div>
        <div class="sp-body" style="background:\${d.bg};"><div class="sp-kpis">\${d.bars.slice(0,4).map((_,i)=>\`<div class="sp-kpi" style="background:\${d.card};border-color:\${d.border};"><div class="sp-kv" style="color:\${d.text};">$\${4+i}M</div><div class="sp-kl" style="color:\${d.accent}80;">KPI</div></div>\`).join('')}</div><div class="sp-chart" style="background:\${d.card};border-color:\${d.border};">\${d.bars.map(h=>\`<div class="sp-bar" style="height:\${h}%;background:\${d.accent};opacity:0.5;"></div>\`).join('')}</div></div>
        <div class="sp-foot" style="background:\${d.bg};border-color:\${d.border};color:\${d.accent}80;"><div class="sp-live" style="background:\${d.accent};"></div><span style="font-family:var(--mono);">LIVE</span><span style="font-family:var(--mono);">7 CONN</span></div>
      </div>
      <div class="studio-name"><div class="tags">\${d.tags.map(t=>\`<span class="studio-tag" style="color:\${t.c};background:\${t.c}12;border:1px solid \${t.c}25;">\${t.l}</span>\`).join('')}</div><h4>\${d.name}</h4><p>\${d.desc}</p></div>
    </div>\`).join('');
}

function renderAccentGrid(){
  document.getElementById('accentGrid').innerHTML=ACCENT_COLORS.map(c=>\`<div class="accent-swatch\${c===accentColor?' selected':''}" style="background:\${c};" onclick="selectAccent('\${c}',this)"></div>\`).join('');
}

function renderModuleToggles(){
  document.getElementById('moduleToggles').innerHTML=MODULES.map(m=>\`<div class="module-row"><div><div class="mname">\${m.name}</div><div class="mdesc">\${m.desc}</div></div><div class="toggle\${moduleState[m.name]?' on':''}" onclick="this.classList.toggle('on');moduleState['\${m.name}']=this.classList.contains('on');"></div></div>\`).join('');
}

function selectDesign(id,el){
  design=id;const d=DESIGNS.find(x=>x.id===id);
  document.querySelectorAll('.studio-card').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');
  document.getElementById('selDesign').textContent=d.name;
  document.getElementById('studioSub').textContent=\`Selected: \${d.name} — \${d.desc}\`;
  // Update accent to match theme default
  accentColor=d.accent;renderAccentGrid();
  // Live preview: apply theme immediately while modal is open
  applyThemeCSS(d);render();
}

function selectAccent(color,el){
  accentColor=color;
  document.querySelectorAll('.accent-swatch').forEach(s=>s.classList.remove('selected'));el.classList.add('selected');
  // Live preview: update accent color immediately
  const s=document.documentElement.style;
  s.setProperty('--accent',color);s.setProperty('--accent-dim',color+'10');s.setProperty('--accent-glow',color+'25');
  render();
}

function applyDesign(){
  closeStudio();
  const d=DESIGNS.find(x=>x.id===design);
  applyThemeCSS(d);render();
  // Update cbar swatches
  const swatches=document.querySelectorAll('.cbar-swatch');swatches.forEach(s=>s.classList.remove('active'));
  const idx=DESIGNS.findIndex(x=>x.id===design);if(swatches[idx])swatches[idx].classList.add('active');
  toast('success','Design Applied',d.name+' with '+accentColor+' accent is now live');
}

// INIT
render();
setTimeout(()=>toast('success','FinanceOS','Dashboard loaded · 7 connectors synced'),600);`
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
  --bg:#F8FAFC;--surface:#ffffff;--card:#ffffff;--elevated:#F1F5F9;
  --border:#E2E8F0;--border2:#CBD5E1;
  --t1:#0F172A;--t2:#334155;--t3:#64748B;--t4:#94A3B8;
  --accent:#3B82F6;--accent-dim:rgba(59,130,246,0.06);--accent-glow:rgba(59,130,246,0.15);
  --green:#10B981;--green-dim:rgba(16,185,129,0.06);
  --red:#EF4444;--red-dim:rgba(239,68,68,0.06);
  --amber:#F59E0B;--amber-dim:rgba(245,158,11,0.06);
  --purple:#8B5CF6;--purple-dim:rgba(139,92,246,0.06);
  --cyan:#06B6D4;--cyan-dim:rgba(6,182,212,0.06);
  --radius:12px;--radius-sm:8px;
  --shadow:0 1px 3px rgba(0,0,0,0.04);
  --shadow-md:0 4px 16px rgba(0,0,0,0.06);
  --shadow-lg:0 12px 40px rgba(0,0,0,0.08);
  --ease:cubic-bezier(0.16,1,0.3,1);
  --font:'DM Sans',system-ui,sans-serif;
  --mono:'JetBrains Mono',monospace;
}
body{font-family:var(--font);background:var(--bg);color:var(--t1);-webkit-font-smoothing:antialiased;min-height:100vh;font-size:14px;overflow-x:hidden;transition:background 0.5s var(--ease),color 0.5s var(--ease);}

/* ═══ ANIMATIONS ═══ */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleReveal{from{opacity:0;transform:scale(0.95) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes slideUp{from{transform:translateX(-50%) translateY(30px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
@keyframes modalIn{from{transform:translateY(14px) scale(0.97);opacity:0}to{transform:none;opacity:1}}
@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
@keyframes breathe{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.3)}50%{box-shadow:0 0 0 5px rgba(16,185,129,0)}}
@keyframes shimmer{to{left:200%}}
@keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes barPop{0%{transform:scaleY(0.3)}50%{transform:scaleY(1.08)}100%{transform:scaleY(1)}}
@keyframes numberReveal{from{opacity:0;filter:blur(4px);transform:translateY(8px)}to{opacity:1;filter:blur(0);transform:translateY(0)}}
@keyframes statusPulse{0%{opacity:0.6;transform:scale(1)}50%{opacity:0;transform:scale(2.5)}100%{opacity:0;transform:scale(2.5)}}
@keyframes toastIn{from{opacity:0;transform:translateX(40px) scale(0.95)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes toastOut{to{opacity:0;transform:translateX(40px) scale(0.95)}}
@keyframes progressShine{0%{transform:translateX(-200%)}100%{transform:translateX(200%)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes checkPop{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}

.stagger>*{animation:fadeUp 0.5s var(--ease) backwards}
.stagger>*:nth-child(1){animation-delay:0.03s}.stagger>*:nth-child(2){animation-delay:0.07s}.stagger>*:nth-child(3){animation-delay:0.11s}.stagger>*:nth-child(4){animation-delay:0.15s}.stagger>*:nth-child(5){animation-delay:0.19s}.stagger>*:nth-child(6){animation-delay:0.23s}

/* ═══ TOPBAR ═══ */
.topbar{position:sticky;top:0;z-index:100;background:var(--surface);border-bottom:1px solid var(--border);padding:0 20px;height:54px;display:flex;align-items:center;gap:12px;transition:all 0.5s var(--ease);}
.topbar-logo{display:flex;align-items:center;gap:8px;padding-right:16px;border-right:1px solid var(--border);}
.topbar-logo svg{width:32px;height:32px;transition:transform 0.3s var(--ease);}
.topbar-logo:hover svg{transform:rotate(-5deg) scale(1.05);}
.topbar-logo .name{font-size:16px;font-weight:800;letter-spacing:-0.03em;}
.plan-badge{font-size:9px;font-weight:800;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.05em;transition:all 0.3s;}
.topbar-info{display:flex;align-items:center;gap:16px;margin-left:12px;font-size:11px;color:var(--t4);}
.topbar-info .sep{width:1px;height:16px;background:var(--border);}
.topbar-info .clock{font-family:var(--mono);font-size:10px;}
.search-box{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--elevated);font-size:12px;color:var(--t4);cursor:pointer;transition:all 0.2s;margin-left:auto;}
.search-box:hover{border-color:var(--accent);color:var(--t2);}
.search-box kbd{font-family:var(--mono);font-size:9px;padding:1px 5px;border-radius:4px;background:var(--surface);border:1px solid var(--border);}
.topbar-controls{display:flex;align-items:center;gap:6px;}
.role-btn{padding:5px 14px;border-radius:var(--radius-sm);font-size:12px;font-weight:600;border:1px solid var(--border);background:var(--surface);color:var(--t3);cursor:pointer;transition:all 0.2s var(--ease);display:flex;align-items:center;gap:5px;}
.role-btn:hover{border-color:var(--border2);color:var(--t2);transform:translateY(-1px);}
.role-btn.active{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 2px 8px var(--accent-glow);}
.role-btn .rdot{width:6px;height:6px;border-radius:50%;}
.tier-btn{padding:5px 12px;border-radius:20px;font-size:10px;font-weight:700;border:1px solid;cursor:pointer;transition:all 0.2s var(--ease);text-transform:uppercase;letter-spacing:0.03em;}
.tier-btn:hover{transform:translateY(-1px);}
.tier-btn.active{box-shadow:0 0 0 2px currentColor,0 0 12px currentColor;}
.t-starter{color:#06B6D4;border-color:rgba(6,182,212,0.2);background:rgba(6,182,212,0.06);}
.t-growth{color:#10B981;border-color:rgba(16,185,129,0.2);background:rgba(16,185,129,0.06);}
.t-business{color:#8B5CF6;border-color:rgba(139,92,246,0.2);background:rgba(139,92,246,0.06);}

/* ═══ LAYOUT ═══ */
.layout{display:flex;min-height:calc(100vh - 54px);}
.sidebar{width:220px;border-right:1px solid var(--border);background:var(--surface);padding:14px 0;flex-shrink:0;overflow-y:auto;transition:all 0.5s var(--ease);}
.sb-section{padding:0 10px;margin-bottom:12px;}
.sb-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--t4);margin-bottom:6px;padding:0 10px;}
.sb-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;color:var(--t2);cursor:pointer;transition:all 0.15s var(--ease);margin-bottom:1px;position:relative;}
.sb-item:hover{background:var(--elevated);color:var(--t1);transform:translateX(2px);}
.sb-item.active{background:var(--accent-dim);color:var(--accent);font-weight:600;}
.sb-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:60%;border-radius:0 3px 3px 0;background:var(--accent);}
.sb-item .ico{width:15px;height:15px;display:flex;align-items:center;justify-content:center;font-size:11px;opacity:0.6;}
.sb-item.active .ico{opacity:1;}
.sb-item .lock-badge{font-size:7px;font-weight:800;padding:1px 5px;border-radius:3px;margin-left:auto;text-transform:uppercase;}
.sb-item.locked{opacity:0.4;cursor:not-allowed;}
.sb-item.locked:hover{transform:none;background:transparent;}
.sb-item .cnt{font-size:8px;font-weight:700;min-width:16px;height:16px;border-radius:8px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;margin-left:auto;}

/* ═══ MAIN ═══ */
.main{flex:1;padding:20px 24px;overflow-y:auto;transition:background 0.5s var(--ease);}

/* ═══ CONNECTOR BAR ═══ */
.connectors{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:var(--radius);border:1px solid var(--border);background:var(--surface);margin-bottom:16px;animation:fadeUp 0.4s var(--ease);overflow-x:auto;transition:all 0.5s var(--ease);}
.connectors .clabel{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--t4);white-space:nowrap;}
.conn{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;color:var(--t2);background:var(--elevated);border:1px solid var(--border);cursor:pointer;transition:all 0.2s;white-space:nowrap;}
.conn:hover{border-color:var(--green);color:var(--green);transform:translateY(-1px);}
.conn .dot{width:5px;height:5px;border-radius:50%;background:var(--green);}

/* ═══ HEADER ═══ */
.dash-header h1{font-size:24px;font-weight:800;letter-spacing:-0.02em;}
.dash-header .sub{font-size:12px;color:var(--t3);display:flex;align-items:center;gap:6px;margin-top:3px;}
.live-dot{width:7px;height:7px;border-radius:50%;background:var(--green);position:relative;display:inline-block;}
.live-dot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:var(--green);animation:statusPulse 2s ease infinite;}

/* ═══ KPI ═══ */
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0;}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;transition:all 0.3s var(--ease);position:relative;overflow:hidden;cursor:default;}
.kpi::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;border-radius:0 3px 3px 0;opacity:0.5;transition:opacity 0.3s;}
.kpi:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);}
.kpi:hover::before{opacity:1;}
.kpi.c-blue::before{background:#3B82F6;}.kpi.c-green::before{background:#10B981;}.kpi.c-amber::before{background:#F59E0B;}.kpi.c-purple::before{background:#8B5CF6;}.kpi.c-cyan::before{background:#06B6D4;}
.kpi::after{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);pointer-events:none;}
.kpi:hover::after{animation:shimmer 0.8s ease forwards;}
.kpi .icon{font-size:16px;margin-bottom:4px;}
.kpi .label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:var(--t4);margin-bottom:6px;}
.kpi .value{font-size:28px;font-weight:800;font-family:var(--mono);letter-spacing:-0.02em;animation:numberReveal 0.6s var(--ease) backwards;}
.kpi .change{font-size:11px;font-weight:600;margin-top:4px;}
.kpi .change.up{color:var(--green);}.kpi .change.down{color:var(--red);}
.kpi .spark{display:flex;align-items:flex-end;gap:1px;height:24px;margin-top:6px;}
.kpi .spark i{flex:1;border-radius:1px;min-width:3px;transform-origin:bottom;animation:barGrow 0.5s var(--ease) backwards;}

/* ═══ CHARTS ═══ */
.charts{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
.chart-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;transition:all 0.3s var(--ease);}
.chart-card:hover{box-shadow:var(--shadow-md);}
.chart-card h3{font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;}
.chart-card .lt{font-size:9px;font-weight:700;color:var(--green);display:flex;align-items:center;gap:4px;}
.chart-card .lt::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green);animation:breathe 2s ease infinite;}
.bar-chart{display:flex;align-items:flex-end;gap:3px;height:130px;padding-bottom:4px;border-bottom:1px solid var(--border);}
.bar{flex:1;border-radius:3px 3px 0 0;min-width:5px;transform-origin:bottom;animation:barGrow 0.6s var(--ease) backwards;transition:opacity 0.15s;cursor:pointer;position:relative;}
.bar:hover{opacity:1!important;filter:brightness(1.15);}
.bar::after{content:attr(data-v);position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:8px;font-family:var(--mono);font-weight:600;color:var(--t2);background:var(--surface);border:1px solid var(--border);padding:0 4px;border-radius:3px;opacity:0;transition:opacity 0.15s;white-space:nowrap;pointer-events:none;}
.bar:hover::after{opacity:1;}
.chart-labels{display:flex;justify-content:space-between;font-size:8px;color:var(--t4);margin-top:4px;font-family:var(--mono);}

/* ═══ TABLE ═══ */
.data-table{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:16px;transition:all 0.3s;}
.dt-head{display:grid;padding:10px 18px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--t4);border-bottom:1px solid var(--border);background:var(--elevated);}
.dt-row{display:grid;padding:11px 18px;font-size:13px;border-bottom:1px solid var(--border);transition:all 0.15s;cursor:pointer;}
.dt-row:last-child{border:none;}.dt-row:hover{background:var(--accent-dim);}
.status{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;display:flex;align-items:center;gap:4px;}
.status::before{content:'';width:5px;height:5px;border-radius:50%;}
.s-done{color:var(--green);}.s-done::before{background:var(--green);}
.s-progress{color:var(--cyan);}.s-progress::before{background:var(--cyan);}
.s-pending{color:var(--amber);}.s-pending::before{background:var(--amber);}

/* ═══ AI ═══ */
.ai-section h3{font-size:13px;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:6px;}
.ai-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;}
.ai-card{padding:14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--card);transition:all 0.3s var(--ease);cursor:pointer;position:relative;overflow:hidden;}
.ai-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);}
.ai-card .tag{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:5px;display:flex;align-items:center;gap:4px;}
.ai-card p{font-size:11px;color:var(--t2);line-height:1.5;}.ai-card strong{color:var(--t1);}

/* ═══ LOCK ═══ */
.lock-wrap{position:relative;border-radius:var(--radius);overflow:hidden;margin-bottom:16px;}
.lock-blur{filter:blur(4px);opacity:0.3;pointer-events:none;}
.lock-gate{position:absolute;inset:0;background:rgba(248,250,252,0.85);backdrop-filter:blur(6px);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:5;}
.lock-gate .licon{width:48px;height:48px;border-radius:14px;background:var(--elevated);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin-bottom:10px;font-size:20px;}
.lock-gate .ltitle{font-size:15px;font-weight:700;margin-bottom:3px;}
.lock-gate .lsub{font-size:11px;color:var(--t3);margin-bottom:12px;}
.lock-gate .ubtn{padding:9px 24px;border-radius:var(--radius-sm);font-size:12px;font-weight:700;border:none;color:#fff;cursor:pointer;transition:all 0.25s var(--ease);}
.lock-gate .ubtn:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg);}

/* ═══ TEAM ═══ */
.team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
.team-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center;transition:all 0.25s var(--ease);cursor:pointer;}
.team-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);}
.team-card .avatar{width:40px;height:40px;border-radius:50%;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;}
.team-card .tname{font-size:12px;font-weight:700;}.team-card .trole{font-size:10px;color:var(--t4);}
.team-card .tstatus{font-size:9px;color:var(--green);margin-top:4px;display:flex;align-items:center;justify-content:center;gap:3px;}
.team-card .tstatus::before{content:'';width:4px;height:4px;border-radius:50%;background:var(--green);}

/* ═══ CUSTOMIZE BAR ═══ */
.cbar{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:200;background:rgba(15,23,42,0.94);backdrop-filter:blur(24px) saturate(1.5);border-radius:14px;padding:8px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 40px rgba(0,0,0,0.2),0 0 0 1px rgba(255,255,255,0.05);color:#fff;animation:slideUp 0.5s var(--ease);}
.cbar-icon{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#06B6D4,#8B5CF6);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;}
.cbar-title{font-size:12px;font-weight:700;white-space:nowrap;}
.cbar-sep{width:1px;height:22px;background:rgba(255,255,255,0.08);}
.cbar-lbl{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:rgba(255,255,255,0.3);white-space:nowrap;}
.cbar-swatch{width:20px;height:20px;border-radius:6px;border:2px solid transparent;cursor:pointer;transition:all 0.15s var(--ease);}
.cbar-swatch:hover,.cbar-swatch.active{border-color:rgba(255,255,255,0.9);transform:scale(1.2);}
.cbar-btn{padding:5px 11px;border-radius:6px;font-size:10px;font-weight:600;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);cursor:pointer;transition:all 0.15s;white-space:nowrap;}
.cbar-btn:hover{background:rgba(255,255,255,0.1);color:#fff;}
.cbar-btn.active{background:rgba(6,182,212,0.2);border-color:rgba(6,182,212,0.4);color:#67E8F9;}
.cbar-studio{padding:7px 16px;border-radius:8px;font-size:11px;font-weight:700;border:none;background:linear-gradient(135deg,#06B6D4,#8B5CF6);color:#fff;cursor:pointer;transition:all 0.25s var(--ease);display:flex;align-items:center;gap:5px;}
.cbar-studio:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(6,182,212,0.35);}

/* ═══ DESIGN STUDIO MODAL ═══ */
.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.5);backdrop-filter:blur(8px);z-index:300;display:none;align-items:center;justify-content:center;}
.modal-overlay.open{display:flex;}
.modal{background:var(--surface);border-radius:20px;width:96%;max-width:1100px;max-height:92vh;overflow:hidden;box-shadow:var(--shadow-lg);animation:modalIn 0.35s var(--ease);display:flex;flex-direction:column;}
.modal-head{padding:22px 28px 14px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0;}
.modal-head h2{font-size:22px;font-weight:800;letter-spacing:-0.02em;}
.modal-head p{font-size:12px;color:var(--t3);margin-top:2px;}
.modal-close{width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:18px;transition:all 0.15s;}
.modal-close:hover{background:var(--elevated);color:var(--t1);transform:rotate(90deg);}
.modal-body{flex:1;overflow-y:auto;display:flex;}

/* Left: design cards */
.studio-left{flex:1;padding:20px 24px;overflow-y:auto;border-right:1px solid var(--border);}
.studio-cats{display:flex;gap:6px;margin-bottom:16px;}
.studio-cat{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid var(--border);background:transparent;color:var(--t3);cursor:pointer;transition:all 0.2s;}
.studio-cat:hover{border-color:var(--border2);color:var(--t2);}
.studio-cat.active{background:var(--accent);border-color:var(--accent);color:#fff;}
.studio-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
.studio-card{border-radius:12px;border:2px solid var(--border);overflow:hidden;cursor:pointer;transition:all 0.3s var(--ease);position:relative;}
.studio-card:hover{border-color:var(--cyan);transform:translateY(-3px);box-shadow:0 8px 30px rgba(6,182,212,0.1);}
.studio-card.selected{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(6,182,212,0.15);}
.studio-card.selected .check{display:flex;}
.check{display:none;position:absolute;top:6px;right:6px;width:22px;height:22px;border-radius:50%;background:var(--cyan);color:#fff;font-size:11px;font-weight:700;align-items:center;justify-content:center;z-index:5;animation:checkPop 0.3s var(--ease);}

/* Mini preview */
.sp{height:120px;position:relative;overflow:hidden;}
.sp-sb{position:absolute;left:0;top:0;bottom:0;width:28px;border-right:1px solid;display:flex;flex-direction:column;align-items:center;padding-top:6px;gap:4px;}
.sp-logo{width:14px;height:14px;border-radius:4px;margin-bottom:3px;}
.sp-dot{width:4px;height:4px;border-radius:2px;opacity:0.25;}
.sp-dot.on{opacity:1;width:12px;}
.sp-top{position:absolute;top:0;left:28px;right:0;height:20px;border-bottom:1px solid;display:flex;align-items:center;padding:0 6px;font-size:6px;font-weight:700;}
.sp-body{position:absolute;top:20px;left:28px;right:0;bottom:12px;padding:4px 5px;}
.sp-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;margin-bottom:3px;}
.sp-kpi{border-radius:3px;border:1px solid;padding:3px 2px;text-align:center;}
.sp-kv{font-size:7px;font-weight:800;}.sp-kl{font-size:3px;text-transform:uppercase;}
.sp-chart{border-radius:3px;border:1px solid;display:flex;align-items:flex-end;gap:1px;padding:3px;height:42px;}
.sp-bar{flex:1;border-radius:1px 1px 0 0;transition:height 0.4s;}
.studio-card:hover .sp-bar{animation:barPop 0.5s var(--ease) backwards;}
.sp-foot{position:absolute;bottom:0;left:28px;right:0;height:12px;border-top:1px solid;display:flex;align-items:center;padding:0 5px;font-size:4px;gap:4px;}
.sp-live{width:2px;height:2px;border-radius:50%;animation:pulse 2s ease infinite;}

.studio-name{padding:10px 12px;}
.studio-name h4{font-size:13px;font-weight:700;}.studio-name p{font-size:10px;color:var(--t3);}
.studio-name .tags{display:flex;gap:3px;margin-bottom:3px;}
.studio-tag{font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;padding:1px 6px;border-radius:3px;}

/* Right: customization panel */
.studio-right{width:320px;padding:20px 24px;overflow-y:auto;flex-shrink:0;}
.custom-section{margin-bottom:20px;}
.custom-section h4{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--t3);margin-bottom:10px;display:flex;align-items:center;gap:6px;}
.custom-section h4 .cico{font-size:14px;}

/* Accent color swatches */
.accent-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;}
.accent-swatch{width:100%;aspect-ratio:1;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:all 0.2s var(--ease);}
.accent-swatch:hover{transform:scale(1.15);border-color:var(--border2);}
.accent-swatch.selected{border-color:var(--t1);box-shadow:0 0 12px rgba(0,0,0,0.15);}

/* Module toggles */
.module-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);}
.module-row:last-child{border:none;}
.module-row .mname{font-size:12px;font-weight:600;}
.module-row .mdesc{font-size:9px;color:var(--t4);}
.toggle{width:36px;height:20px;border-radius:10px;background:var(--border);position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0;}
.toggle.on{background:var(--green);}
.toggle::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.15);}
.toggle.on::after{transform:translateX(16px);}

/* Live preview */
.live-preview-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--cyan);margin-bottom:8px;display:flex;align-items:center;gap:4px;}
.live-preview-label::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--cyan);animation:pulse 2s ease infinite;}

/* Modal footer */
.modal-footer{padding:14px 28px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--elevated);flex-shrink:0;}
.modal-footer .mf-info{font-size:12px;color:var(--t3);}.modal-footer .mf-info strong{color:var(--t1);}
.apply-btn{padding:10px 30px;border-radius:var(--radius-sm);font-size:13px;font-weight:700;border:none;background:linear-gradient(135deg,#06B6D4,#8B5CF6);color:#fff;cursor:pointer;transition:all 0.25s var(--ease);box-shadow:0 2px 12px rgba(6,182,212,0.25);}
.apply-btn:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(6,182,212,0.35);}

/* ═══ TOAST ═══ */
.toast-container{position:fixed;top:70px;right:24px;z-index:400;display:flex;flex-direction:column;gap:10px;pointer-events:none;}
.toast{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--border);box-shadow:var(--shadow-lg);pointer-events:auto;animation:toastIn 0.4s var(--ease);min-width:260px;max-width:360px;position:relative;overflow:hidden;}
.toast.out{animation:toastOut 0.3s var(--ease) forwards;}
.toast-icon{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;}
.toast .tt{font-size:12px;font-weight:700;}.toast .tm{font-size:11px;color:var(--t3);}
.toast .tc{background:none;border:none;color:var(--t4);cursor:pointer;font-size:14px;margin-left:auto;}
.toast .tp{position:absolute;bottom:0;left:0;height:2px;}
@keyframes shrink{from{width:100%}to{width:0%}}
.toast.success .toast-icon{background:var(--green-dim);color:var(--green);}.toast.success .tp{background:var(--green);animation:shrink 3s linear forwards;}
.toast.info .toast-icon{background:var(--accent-dim);color:var(--accent);}.toast.info .tp{background:var(--accent);animation:shrink 3s linear forwards;}
.toast.warning .toast-icon{background:var(--amber-dim);color:var(--amber);}.toast.warning .tp{background:var(--amber);animation:shrink 3s linear forwards;}

.bottom-space{height:80px;}
@media(max-width:900px){.sidebar{width:60px;}.sb-item span{display:none;}.kpis{grid-template-columns:repeat(2,1fr);}.charts{grid-template-columns:1fr;}.ai-grid{grid-template-columns:1fr;}.studio-right{display:none;}.studio-grid{grid-template-columns:1fr;}.topbar-info,.search-box{display:none;}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<div class="toast-container" id="toasts"></div>

<!-- TOPBAR -->
<div class="topbar" id="topbar">
  <div class="topbar-logo"><svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#3B82F6"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><span class="name">FinanceOS</span><span class="plan-badge" id="planBadge" style="background:var(--green-dim);color:var(--green);">GROWTH</span></div>
  <div class="topbar-info"><span>Enterprise · FY2025 YTD</span><span class="sep"></span><span class="clock" id="clock"></span></div>
  <div class="search-box" onclick="toast('info','Search','⌘K to search across views')">🔍 Search… <kbd>⌘K</kbd></div>
  <div class="topbar-controls">
    <button class="role-btn active" onclick="setRole('cfo',this)"><span class="rdot" style="background:#3B82F6;"></span> CFO</button>
    <button class="role-btn" onclick="setRole('ceo',this)"><span class="rdot" style="background:#8B5CF6;"></span> CEO</button>
    <button class="role-btn" onclick="setRole('controller',this)"><span class="rdot" style="background:#10B981;"></span> Controller</button>
    <span style="width:1px;height:24px;background:var(--border);margin:0 4px;"></span>
    <button class="tier-btn t-starter" onclick="setTier('starter',this)">Starter</button>
    <button class="tier-btn t-growth active" onclick="setTier('growth',this)">Growth</button>
    <button class="tier-btn t-business" onclick="setTier('business',this)">Business</button>
  </div>
</div>

<div class="layout">
  <div class="sidebar" id="sidebar"></div>
  <div class="main" id="main"></div>
</div>

<!-- CUSTOMIZE BAR -->
<div class="cbar">
  <div class="cbar-icon">✦</div><span class="cbar-title">Customize</span><div class="cbar-sep"></div>
  <span class="cbar-lbl">Theme</span>
  <div class="cbar-swatch active" style="background:linear-gradient(135deg,#F3F4F8,#E2E8F0);" onclick="pickTheme('arctic',this)" title="Arctic Light"></div>
  <div class="cbar-swatch" style="background:linear-gradient(135deg,#030711,#0C1323);" onclick="pickTheme('midnight',this)" title="Midnight"></div>
  <div class="cbar-swatch" style="background:linear-gradient(135deg,#FFFBF5,#F5E6D3);" onclick="pickTheme('warm',this)" title="Warm Sand"></div>
  <div class="cbar-swatch" style="background:linear-gradient(135deg,#040D0A,#0D3320);" onclick="pickTheme('forest',this)" title="Forest"></div>
  <div class="cbar-swatch" style="background:linear-gradient(135deg,#0C0A1A,#1A1040);" onclick="pickTheme('executive',this)" title="Executive"></div>
  <div class="cbar-swatch" style="background:linear-gradient(135deg,#0a0a0a,#111);" onclick="pickTheme('terminal',this)" title="Terminal"></div>
  <div class="cbar-sep"></div>
  <span class="cbar-lbl">Layout</span>
  <button class="cbar-btn active" onclick="pickLayout('grid',this)">Grid</button>
  <button class="cbar-btn" onclick="pickLayout('compact',this)">Compact</button>
  <div class="cbar-sep"></div>
  <button class="cbar-studio" onclick="openStudio()">✦ Design Studio</button>
</div>

<!-- DESIGN STUDIO MODAL -->
<div class="modal-overlay" id="studioModal" onclick="if(event.target===this)closeStudio()">
  <div class="modal">
    <div class="modal-head">
      <div><h2>Design Studio</h2><p id="studioSub">Pre-styled command centers and boards. Switch anytime.</p></div>
      <button class="modal-close" onclick="closeStudio()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="studio-left">
        <div class="studio-cats">
          <button class="studio-cat active" onclick="filterStudio('all',this)">All</button>
          <button class="studio-cat" onclick="filterStudio('light',this)">Light</button>
          <button class="studio-cat" onclick="filterStudio('dark',this)">Dark</button>
          <button class="studio-cat" onclick="filterStudio('new',this)">New</button>
        </div>
        <div class="studio-grid" id="studioGrid"></div>
      </div>
      <div class="studio-right">
        <div class="live-preview-label">Live Customization</div>

        <div class="custom-section">
          <h4><span class="cico">🎨</span> Accent Color</h4>
          <div class="accent-grid" id="accentGrid"></div>
        </div>

        <div class="custom-section">
          <h4><span class="cico">📦</span> Dashboard Modules</h4>
          <div id="moduleToggles"></div>
        </div>

        <div class="custom-section">
          <h4><span class="cico">⚙️</span> Options</h4>
          <div class="module-row"><div><div class="mname">Animations</div><div class="mdesc">Card hover & entrance effects</div></div><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
          <div class="module-row"><div><div class="mname">Monospace Numbers</div><div class="mdesc">Tabular-lining for KPIs</div></div><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
          <div class="module-row"><div><div class="mname">Compact Mode</div><div class="mdesc">Reduce padding & spacing</div></div><div class="toggle" onclick="this.classList.toggle('on')"></div></div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="mf-info">Selected: <strong id="selDesign">Arctic Light</strong> · Included with all plans</div>
      <button class="apply-btn" onclick="applyDesign()">Apply Design →</button>
    </div>
  </div>
</div>


` }} />
    </>
  );
}
