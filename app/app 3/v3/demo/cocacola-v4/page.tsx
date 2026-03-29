'use client';

import { useEffect, useRef } from 'react';

export default function V3DemoCocacolaV4Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ═══ DATA ═══
const admins = [
  {id:"cfo",name:"James Mitchell",role:"CFO",photo:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80&fit=crop&crop=face",status:"online"},
  {id:"vpf",name:"Sarah Chen",role:"VP Finance",photo:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&fit=crop&crop=face",status:"online"},
  {id:"ctrl",name:"Marcus Rodriguez",role:"Controller",photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face",status:"away"},
  {id:"fpa",name:"Priya Sharma",role:"FP&A Director",photo:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80&fit=crop&crop=face",status:"online"},
  {id:"trs",name:"David Kim",role:"Treasury",photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80&fit=crop&crop=face",status:"offline"},
  {id:"ir",name:"Elena Volkov",role:"Investor Relations",photo:"https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=80&q=80&fit=crop&crop=face",status:"online"},
];

const tasks=[
  {t:"Review Q4 earnings script",a:"Sarah Chen",p:"high",due:"Mar 26",s:"In Progress",c:"Reporting"},
  {t:"Finalize 10-K segment disclosures",a:"Marcus Rodriguez",p:"high",due:"Mar 27",s:"In Review",c:"Compliance"},
  {t:"Update bottling refranchising model",a:"Priya Sharma",p:"medium",due:"Mar 28",s:"In Progress",c:"Modeling"},
  {t:"Board deck — cash flow bridge",a:"James Mitchell",p:"high",due:"Mar 25",s:"Draft",c:"Board"},
  {t:"LatAm marketing ROI analysis",a:"Sarah Chen",p:"medium",due:"Mar 30",s:"Not Started",c:"Analysis"},
  {t:"Hedge position review — EUR/USD",a:"David Kim",p:"medium",due:"Mar 28",s:"In Progress",c:"Treasury"},
  {t:"Investor day presentation draft",a:"Elena Volkov",p:"low",due:"Apr 5",s:"Not Started",c:"IR"},
  {t:"Dividend declaration memo",a:"James Mitchell",p:"high",due:"Mar 25",s:"Draft",c:"Board"},
];

const msgs=[
  {from:admins[1],text:"LatAm margin expansion confirmed — 41.2% operating margin, 280bps improvement. Updated the variance bridge. Ready for your review.",time:"2:45 PM",channel:"#finance-leadership"},
  {from:admins[0],text:"Perfect. Also need the constant-currency EMEA growth pulled. The 4.2% reported understates the organic performance significantly.",time:"2:48 PM",channel:"#finance-leadership"},
  {from:admins[3],text:"I have the CC numbers. EMEA was 7.8% organic growth. Hedge covered 68% of exposure. Adding to the board deck variance page now.",time:"2:52 PM",channel:"#finance-leadership"},
  {from:admins[2],text:"10-K segment note drafted. Need sign-off on the Bottling Investments disclosure — the margin compression needs careful framing for the audit committee.",time:"3:01 PM",channel:"#finance-leadership"},
  {from:admins[5],text:"Buy-side consensus for Q1'26 is $11.9B revenue. Our internal model shows $12.1B. Should we guide above or maintain conservatism?",time:"3:14 PM",channel:"#finance-leadership"},
];

const kpis=[
  {l:"Net Revenue",v:"$45.8B",d:"+3.2%",u:1,bar:"var(--coke)",n:"FY2025 Consolidated"},
  {l:"Gross Margin",v:"59.2%",d:"+40bps",u:1,bar:"var(--green)",n:"vs 58.8% prior year"},
  {l:"Operating Income",v:"$13.2B",d:"+5.1%",u:1,bar:"var(--blue)",n:"28.8% operating margin"},
  {l:"Free Cash Flow",v:"$9.8B",d:"+6.1%",u:1,bar:"var(--green)",n:"96.5% conversion ratio"},
  {l:"EPS (Diluted)",v:"$2.47",d:"+4.2%",u:1,bar:"var(--purple)",n:"vs $2.37 prior year"},
  {l:"ROIC",v:"14.2%",d:"+80bps",u:1,bar:"var(--cyan)",n:"vs 8.1% WACC — 610bps spread"},
];

const segs=[
  {n:"North America",r:17420,p:38,g:2.8,m:32.1,c:"var(--coke)"},
  {n:"EMEA",r:8640,p:18.9,g:4.2,m:34.8,c:"var(--blue)"},
  {n:"Latin America",r:5280,p:11.5,g:8.1,m:41.2,c:"var(--green)"},
  {n:"Asia Pacific",r:5960,p:13,g:3.6,m:36.4,c:"var(--cyan)"},
  {n:"Global Ventures",r:3120,p:6.8,g:12.4,m:28.6,c:"var(--purple)"},
  {n:"Bottling Inv.",r:5380,p:11.8,g:-1.2,m:8.4,c:"var(--amber)"},
];

let activeAdmin = "cfo";
let activeView = "overview";
let panelOpen = null;

// ═══ RENDER ADMIN TABS ═══
function renderAdminTabs(){
  document.getElementById('adminTabs').innerHTML = admins.map(a=>\`
    <button class="admin-tab \${a.id===activeAdmin?'active':''}" onclick="switchAdmin('\${a.id}')">
      <img src="\${a.photo}" style="width:18px;height:18px;border-radius:50%;object-fit:cover">
      <span>\${a.role}</span>
    </button>
  \`).join('');
}

function switchAdmin(id){activeAdmin=id;renderAdminTabs();renderContent();}

// ═══ RENDER SIDEBAR ═══
function renderSidebar(){
  const fin=[{i:"◆",l:"Overview",v:"overview"},{i:"▣",l:"P&L Statement",v:"pnl"},{i:"◈",l:"Segments",v:"segments"},{i:"▲",l:"Forecast",v:"forecast"},{i:"◎",l:"Cash Flow",v:"cashflow"},{i:"◉",l:"Board Deck",v:"board"}];
  const org=[{i:"■",l:"Tasks",v:"tasks",b:tasks.filter(t=>t.s!=="Complete").length},{i:"▹",l:"Messages",v:"messages",b:msgs.length},{i:"◇",l:"Team",v:"team"},{i:"▫",l:"Calendar",v:"calendar"},{i:"◻",l:"Documents",v:"docs"},{i:"▧",l:"Pipeline",v:"pipeline"}];
  document.getElementById('sidebarFinance').innerHTML=fin.map(f=>\`<button class="sidebar-btn \${f.v===activeView?'active':''}" onclick="switchView('\${f.v}')"><span style="width:16px;text-align:center;font-size:12px;opacity:.6">\${f.i}</span>\${f.l}</button>\`).join('');
  document.getElementById('sidebarOrg').innerHTML=org.map(o=>\`<button class="sidebar-btn \${o.v===activeView?'active':''}" onclick="switchView('\${o.v}')"><span style="width:16px;text-align:center;font-size:12px;opacity:.6">\${o.i}</span>\${o.l}\${o.b?\`<span class="tag" style="background:var(--coke);color:#fff;margin-left:auto;padding:2px 6px;font-size:8px">\${o.b}</span>\`:''}</button>\`).join('');
  document.getElementById('teamSidebar').innerHTML=admins.map(a=>\`<div style="display:flex;align-items:center;gap:7px;padding:4px 8px;border-radius:6px;cursor:pointer;transition:background .1s" onmouseover="this.style.background='var(--surfaceAlt)'" onmouseout="this.style.background='transparent'" onclick="switchAdmin('\${a.id}')"><div style="position:relative"><img src="\${a.photo}" class="avatar" style="width:22px;height:22px"><div class="status-dot" style="position:absolute;bottom:-1px;right:-1px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--textFaint)'};border:2px solid var(--surface)"></div></div><span style="font-size:9px;font-weight:600;color:var(--textSec)">\${a.name.split(' ')[0]}</span></div>\`).join('');
}

function switchView(v){activeView=v;renderSidebar();renderContent();}

// ═══ CONTENT VIEWS ═══
function renderContent(){
  const el=document.getElementById('content');
  const admin=admins.find(a=>a.id===activeAdmin);
  if(activeView==='overview')el.innerHTML=renderOverview(admin);
  else if(activeView==='tasks')el.innerHTML=renderTasks(admin);
  else if(activeView==='messages')el.innerHTML=renderMessages(admin);
  else if(activeView==='team')el.innerHTML=renderTeam(admin);
  else if(activeView==='segments')el.innerHTML=renderSegments(admin);
  else if(activeView==='pipeline')el.innerHTML=renderPipeline(admin);
  else el.innerHTML=\`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;color:var(--textMuted)"><div style="width:56px;height:56px;border-radius:16px;background:var(--surfaceAlt);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px">◆</div><div style="font-size:16px;font-weight:700;margin-bottom:4px">\${activeView.charAt(0).toUpperCase()+activeView.slice(1)}</div><div style="font-size:11px">Available in the full FinanceOS Enterprise deployment.</div></div>\`;
}

function renderOverview(admin){
  const pColor=p=>p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';
  return \`
  <!-- Hero header with photo -->
  <div class="card fade" style="padding:0;margin-bottom:20px;overflow:hidden">
    <div style="display:grid;grid-template-columns:1fr 280px;min-height:140px">
      <div style="padding:28px 32px;display:flex;flex-direction:column;justify-content:center">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span class="tag" style="background:var(--greenBg);color:var(--green)">&#9679; All Systems Nominal</span>
          <span class="tag" style="background:var(--purpleBg);color:var(--purple)">◎ Claude Active</span>
          <span class="tag" style="background:var(--surfaceAlt);color:var(--textMuted);border:1px solid var(--borderSub)">FY2025</span>
        </div>
        <h1 style="font-size:24px;font-weight:800;letter-spacing:-.03em;margin-bottom:4px">\${admin.role} Command Center</h1>
        <p style="font-size:12px;color:var(--textMuted)">Welcome back, \${admin.name.split(' ')[0]}. \${tasks.filter(t=>t.p==='high').length} high-priority items require your attention.</p>
      </div>
      <div style="position:relative;overflow:hidden"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop" style="width:100%;height:100%;object-fit:cover;display:block" alt=""><div style="position:absolute;inset:0;background:linear-gradient(90deg,var(--surface) 0%,rgba(255,255,255,0) 40%)"></div></div>
    </div>
  </div>

  <!-- KPIs -->
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:20px">
    \${kpis.map((k,i)=>\`<div class="card fade" style="padding:16px 18px;animation-delay:\${i*.04}s"><div class="card-accent" style="background:\${k.bar}"></div><div class="section-title" style="margin-bottom:8px">\${k.l}</div><div style="display:flex;align-items:baseline;gap:6px;margin-bottom:3px"><span class="kpi-value" style="font-size:20px">\${k.v}</span><span class="tag" style="background:\${k.u?'var(--greenBg)':'var(--redBg)'};color:\${k.u?'var(--green)':'var(--red)'};font-size:8px">▲ \${k.d}</span></div><div style="font-size:8px;color:var(--textFaint)">\${k.n}</div></div>\`).join('')}
  </div>

  <!-- 3 Column: Actions + Segments + AI -->
  <div style="display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:14px;margin-bottom:20px">
    <!-- Quick Actions -->
    <div class="card" style="padding:20px">
      <div class="card-accent" style="background:var(--coke)"></div>
      <div style="font-size:13px;font-weight:800;margin-bottom:14px">Quick Actions</div>
      \${[
        {l:"High Priority Tasks",v:tasks.filter(t=>t.p==='high').length,c:"var(--red)",bg:"var(--redBg)",click:"tasks"},
        {l:"Unread Messages",v:msgs.length,c:"var(--blue)",bg:"var(--blueBg)",click:"messages"},
        {l:"Board Meeting",v:"Mar 26",c:"var(--green)",bg:"var(--greenBg)",click:"board"},
        {l:"Pipeline Items",v:"12",c:"var(--purple)",bg:"var(--purpleBg)",click:"pipeline"},
      ].map(a=>\`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:var(--r-sm);border:1px solid var(--borderSub);margin-bottom:6px;cursor:pointer;transition:all .1s" onclick="switchView('\${a.click}')" onmouseover="this.style.borderColor='var(--coke)';this.style.background='var(--cokeBg)'" onmouseout="this.style.borderColor='var(--borderSub)';this.style.background='transparent'"><span style="font-size:11px;font-weight:600;color:var(--textSec)">\${a.l}</span><span class="tag" style="background:\${a.bg};color:\${a.c}">\${a.v}</span></div>\`).join('')}
    </div>

    <!-- Segments mini -->
    <div class="card" style="padding:20px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--coke),var(--amber))"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;font-weight:800">Segments</span><span class="tag" style="background:var(--surfaceAlt);color:var(--textMuted);border:1px solid var(--borderSub)">$45.8B</span></div>
      \${segs.map(s=>\`<div style="display:grid;grid-template-columns:110px 1fr 50px 40px;gap:6px;align-items:center;padding:6px 4px;font-size:10px"><div style="display:flex;align-items:center;gap:5px"><div style="width:6px;height:6px;border-radius:2px;background:\${s.c}"></div><span style="font-weight:600">\${s.n}</span></div><div class="metric-bar"><div class="metric-fill" style="width:\${s.p*2.5}%;background:\${s.c};opacity:.5"></div></div><span style="font-weight:800;font-family:var(--mono);font-size:9px;text-align:right">$\${(s.r/1000).toFixed(1)}B</span><span style="font-weight:700;color:\${s.g>=0?'var(--green)':'var(--red)'};font-size:9px;text-align:right">\${s.g>=0?'+':''}\${s.g}%</span></div>\`).join('')}
    </div>

    <!-- AI Insights -->
    <div class="card" style="padding:20px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--purple),var(--blue))"></div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px"><span style="font-size:13px;font-weight:800">AI Insights</span><span class="tag" style="background:var(--purpleBg);color:var(--purple)">CLAUDE</span></div>
      \${[
        {i:"▲",t:"LatAm margins hit 41.2% — recommend +15% marketing spend",c:"var(--green)",bg:"var(--greenBg)"},
        {i:"◆",t:"Bottling OM compressed -120bps. Monitor Q4 recovery",c:"var(--amber)",bg:"var(--amberBg)"},
        {i:"◎",t:"FCF conversion 96.5% — top quartile consumer staples",c:"var(--blue)",bg:"var(--blueBg)"},
      ].map((ins,i)=>\`<div style="display:flex;gap:8px;padding:8px 0;\${i<2?'border-bottom:1px solid var(--borderSub)':''}"><span class="tag" style="background:\${ins.bg};color:\${ins.c};flex-shrink:0;font-size:10px">\${ins.i}</span><div style="font-size:10px;color:var(--textSec);line-height:1.5">\${ins.t}</div></div>\`).join('')}
      <button class="btn btn-outline" style="width:100%;justify-content:center;margin-top:10px;font-size:10px" onclick="togglePanel('copilot')">Open AI Copilot ▸</button>
    </div>
  </div>

  <!-- Recent Activity + Recent Tasks -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="card" style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;font-weight:800">Recent Messages</span><button class="btn btn-ghost btn-sm" onclick="switchView('messages')">View all ▸</button></div>
      \${msgs.slice(0,3).map(m=>\`<div class="msg-row"><img src="\${m.from.photo}" class="avatar" style="width:28px;height:28px;flex-shrink:0"><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:4px;margin-bottom:2px"><span style="font-size:10px;font-weight:700">\${m.from.name.split(' ')[0]}</span><span style="font-size:8px;color:var(--textFaint)">\${m.time}</span></div><div style="font-size:10px;color:var(--textSec);line-height:1.5;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">\${m.text}</div></div></div>\`).join('')}
    </div>
    <div class="card" style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;font-weight:800">Priority Tasks</span><button class="btn btn-ghost btn-sm" onclick="switchView('tasks')">View all ▸</button></div>
      \${tasks.filter(t=>t.p==='high').slice(0,4).map(t=>\`<div class="task-row"><div class="status-dot" style="background:\${pColor(t.p)}"></div><div style="flex:1;min-width:0"><div style="font-size:10px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${t.t}</div></div><span style="font-size:8px;color:var(--textMuted)">\${t.due}</span><span class="tag" style="background:var(--blueBg);color:var(--blue);font-size:7px">\${t.s}</span></div>\`).join('')}
    </div>
  </div>

  <!-- Powered by -->
  <div style="margin-top:20px;padding:16px 20px;border-radius:var(--r);background:linear-gradient(135deg,rgba(29,78,216,.03),rgba(109,40,217,.02));border:1px solid rgba(29,78,216,.06);display:flex;justify-content:space-between;align-items:center">
    <div style="display:flex;align-items:center;gap:10px">
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg3" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#1D4ED8"/><stop offset="100%" stop-color="#6D28D9"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg3)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#047857"/></svg>
      <div><div style="font-size:11px;font-weight:800">Powered by FinanceOS &middot; Enterprise</div><div style="font-size:9px;color:var(--textMuted)">SOC 2 Type II &middot; AES-256 &middot; 99.9% Uptime &middot; GDPR</div></div>
    </div>
    <a href="https://finance-os.app" target="_blank" class="btn btn-coke btn-sm" style="text-decoration:none">Learn More ▸</a>
  </div>\`;
}

function renderTasks(admin){
  const pColor=p=>p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';
  const sColor=s=>s==='In Progress'?'var(--blue)':s==='In Review'?'var(--purple)':s==='Draft'?'var(--amber)':'var(--textMuted)';
  return \`<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px"><div><div class="section-title">Organization</div><h2 style="font-size:20px;font-weight:800;letter-spacing:-.02em">Task Management</h2></div><button class="btn btn-coke">+ New Task</button></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">\${[{l:"All Tasks",v:tasks.length,c:"var(--coke)"},{l:"High Priority",v:tasks.filter(t=>t.p==='high').length,c:"var(--red)"},{l:"In Progress",v:tasks.filter(t=>t.s==='In Progress').length,c:"var(--blue)"},{l:"In Review",v:tasks.filter(t=>t.s==='In Review').length,c:"var(--purple)"}].map(s=>\`<div class="card" style="padding:14px 16px;text-align:center;border-top:2px solid \${s.c}"><div style="font-size:22px;font-weight:800;font-family:var(--mono)">\${s.v}</div><div style="font-size:9px;color:var(--textMuted);font-weight:600;margin-top:2px">\${s.l}</div></div>\`).join('')}</div>
  <div class="card" style="padding:0">\${tasks.map((t,i)=>\`<div class="task-row" style="padding:11px 20px;\${i<tasks.length-1?'border-bottom:1px solid var(--borderSub)':''}"><div class="status-dot" style="background:\${pColor(t.p)}"></div><div style="flex:1"><div style="font-size:11px;font-weight:600">\${t.t}</div></div><div style="display:flex;align-items:center;gap:5px;width:120px"><img src="\${admins.find(a=>a.name===t.a)?.photo||''}" class="avatar" style="width:20px;height:20px"><span style="font-size:9px;color:var(--textSec)">\${t.a.split(' ')[0]}</span></div><span class="tag" style="background:\${sColor(t.s)}10;color:\${sColor(t.s)};width:80px;justify-content:center">\${t.s}</span><span style="font-size:9px;color:var(--textMuted);width:50px;text-align:right">\${t.due}</span></div>\`).join('')}</div>\`;
}

function renderMessages(admin){
  return \`<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px"><div><div class="section-title">Organization</div><h2 style="font-size:20px;font-weight:800;letter-spacing:-.02em">Team Messages</h2></div></div>
  <div class="card" style="padding:0;overflow:hidden"><div style="padding:12px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px"><span style="font-size:12px;font-weight:700"># finance-leadership</span><span class="tag" style="background:var(--greenBg);color:var(--green)">\${admins.filter(a=>a.status==='online').length} online</span><div style="display:flex;margin-left:auto">\${admins.filter(a=>a.status==='online').slice(0,4).map(a=>\`<img src="\${a.photo}" class="avatar" style="width:22px;height:22px;margin-left:-5px">\`).join('')}</div></div>
  <div style="padding:16px 20px">\${msgs.map(m=>\`<div class="msg-row"><img src="\${m.from.photo}" class="avatar" style="width:30px;height:30px;flex-shrink:0"><div><div style="display:flex;align-items:center;gap:5px;margin-bottom:3px"><span style="font-size:11px;font-weight:700">\${m.from.name}</span><span style="font-size:8px;color:var(--textFaint)">\${m.from.role} &middot; \${m.time}</span></div><div style="font-size:11px;color:var(--textSec);line-height:1.6;max-width:90%;padding:8px 12px;background:var(--surfaceAlt);border-radius:10px 10px 10px 2px">\${m.text}</div></div></div>\`).join('')}</div>
  <div style="padding:12px 20px;border-top:1px solid var(--border);display:flex;gap:6px"><input placeholder="Message #finance-leadership..." style="flex:1;padding:9px 14px;border-radius:var(--r-sm);border:1px solid var(--border);background:var(--surfaceAlt);color:var(--text);font-size:11px;font-family:var(--sans);outline:none"><button class="btn btn-coke btn-sm">Send</button></div></div>\`;
}

function renderTeam(admin){
  return \`<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px"><div><div class="section-title">Organization</div><h2 style="font-size:20px;font-weight:800;letter-spacing:-.02em">Finance Leadership</h2></div><button class="btn btn-coke">+ Invite</button></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">\${admins.map(a=>\`<div class="card" style="padding:0;overflow:hidden"><div style="position:relative;height:100px;overflow:hidden"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=60&fit=crop" style="width:100%;height:100%;object-fit:cover"><div style="position:absolute;inset:0;background:linear-gradient(transparent 30%,var(--surface))"></div><div style="position:absolute;bottom:-20px;left:50%;transform:translateX(-50%)"><img src="\${a.photo}" class="avatar" style="width:44px;height:44px;border-width:3px"></div></div><div style="padding:28px 16px 18px;text-align:center"><div style="font-size:13px;font-weight:700;margin-bottom:1px">\${a.name}</div><div style="font-size:10px;color:var(--textMuted);margin-bottom:10px">\${a.role}</div><div style="display:flex;gap:4px;justify-content:center"><button class="btn btn-outline btn-sm" onclick="switchView('messages')">Message</button><button class="btn btn-outline btn-sm" onclick="switchView('tasks')">Assign</button><button class="btn btn-outline btn-sm" onclick="switchAdmin('\${a.id}')">Portal</button></div></div></div>\`).join('')}</div>\`;
}

function renderSegments(admin){
  return \`<div style="margin-bottom:20px"><div class="section-title">Finance</div><h2 style="font-size:20px;font-weight:800;letter-spacing:-.02em">Operating Segments</h2></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">\${segs.map(s=>\`<div class="card" style="padding:20px;border-left:3px solid \${s.c}"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;font-weight:700">\${s.n}</span><span class="tag" style="background:\${s.g>=0?'var(--greenBg)':'var(--redBg)'};color:\${s.g>=0?'var(--green)':'var(--red)'}">\${s.g>=0?'+':''}\${s.g}%</span></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">\${[{l:"Revenue",v:\`$\${(s.r/1000).toFixed(1)}B\`},{l:"Share",v:\`\${s.p}%\`},{l:"Margin",v:\`\${s.m}%\`}].map(m=>\`<div><div style="font-size:7px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--textFaint);margin-bottom:2px">\${m.l}</div><div style="font-size:16px;font-weight:800;font-family:var(--mono)">\${m.v}</div></div>\`).join('')}</div><div class="metric-bar"><div class="metric-fill" style="width:\${s.p*2.5}%;background:\${s.c};opacity:.45"></div></div></div>\`).join('')}</div>\`;
}

function renderPipeline(admin){
  const stages=[
    {name:"Lead Qualified",items:[{title:"Nestlé — CFO Dashboard",value:"$48K/yr",status:"New"},{title:"Unilever — FP&A Suite",value:"$96K/yr",status:"Contacted"}],color:"var(--blue)"},
    {name:"Demo Scheduled",items:[{title:"Coca-Cola — Enterprise",value:"$180K/yr",status:"Demo Mar 26"},{title:"PepsiCo — Segment Analysis",value:"$72K/yr",status:"Demo Mar 28"}],color:"var(--purple)"},
    {name:"Proposal Sent",items:[{title:"Procter & Gamble — Full Suite",value:"$240K/yr",status:"Reviewing"}],color:"var(--amber)"},
    {name:"Negotiation",items:[{title:"Johnson & Johnson — FP&A",value:"$120K/yr",status:"Legal Review"}],color:"var(--green)"},
  ];
  return \`<div style="margin-bottom:20px"><div class="section-title">Organization</div><h2 style="font-size:20px;font-weight:800;letter-spacing:-.02em">Deal Pipeline</h2><p style="font-size:10px;color:var(--textMuted);margin-top:4px">Enterprise client acquisition funnel</p></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">\${stages.map(s=>\`<div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="font-size:10px;font-weight:700;color:var(--textSec)">\${s.name}</span><span class="tag" style="background:var(--surfaceAlt);color:var(--textMuted);border:1px solid var(--borderSub)">\${s.items.length}</span></div><div style="display:flex;flex-direction:column;gap:6px">\${s.items.map(i=>\`<div class="card" style="padding:14px 16px;border-top:2px solid \${s.color}"><div style="font-size:11px;font-weight:700;margin-bottom:4px">\${i.title}</div><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:12px;font-weight:800;font-family:var(--mono);color:var(--green)">\${i.value}</span><span style="font-size:8px;color:var(--textMuted)">\${i.status}</span></div></div>\`).join('')}</div></div>\`).join('')}</div>\`;
}

// ═══ PANELS ═══
function togglePanel(type){
  const p=document.getElementById('rightPanel');
  if(panelOpen===type){p.style.display='none';panelOpen=null;return;}
  panelOpen=type;p.style.display='block';
  if(type==='copilot')p.innerHTML=\`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><div style="display:flex;align-items:center;gap:6px"><span style="font-size:13px;font-weight:800">AI Copilot</span><span class="tag" style="background:var(--purpleBg);color:var(--purple)">CLAUDE</span></div><button class="btn btn-ghost" onclick="togglePanel('copilot')" style="font-size:14px">&times;</button></div>
  <p style="font-size:10px;color:var(--textMuted);margin-bottom:12px">Ask about Coca-Cola financials, peers, or scenarios.</p>
  \${['What drove LatAm margin expansion?','Compare FCF to PepsiCo','Model 200bps margin improvement','Bottling recovery timeline'].map(q=>\`<button class="btn btn-outline btn-sm" style="width:100%;text-align:left;margin-bottom:4px;font-size:10px">▸ \${q}</button>\`).join('')}
  <div style="background:var(--surfaceAlt);border-radius:var(--r);padding:14px;margin:14px 0;border:1px solid var(--borderSub)">
    <div style="font-size:9px;font-weight:700;color:var(--blue);margin-bottom:5px">You</div>
    <div style="font-size:11px;margin-bottom:10px">What drove the Latin America margin expansion?</div>
    <div style="font-size:9px;font-weight:700;color:var(--purple);margin-bottom:5px">Copilot</div>
    <div style="font-size:10px;color:var(--textSec);line-height:1.65">LatAm OM expanded <strong>280bps to 41.2%</strong>:<br><br><strong>1.</strong> Pricing: +6.2% price/mix<br><strong>2.</strong> Concentrate mix shift to higher margins<br><strong>3.</strong> BRL +3.4% vs USD<br><br><em style="font-size:8px;color:var(--textFaint)">Confidence: High &middot; 10-K Segment Note</em></div>
  </div>
  <div style="display:flex;gap:5px;position:sticky;bottom:0;background:var(--surface);padding:8px 0"><input placeholder="Ask about financials..." style="flex:1;padding:8px 12px;border-radius:var(--r-sm);border:1px solid var(--border);background:var(--surfaceAlt);color:var(--text);font-size:10px;font-family:var(--sans);outline:none"><button class="btn btn-coke btn-sm">▸</button></div>\`;
}

// ═══ INIT ═══
renderAdminTabs();renderSidebar();renderContent();`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
:root{
  --bg:#F7F8FA;--surface:#FFFFFF;--surfaceAlt:#F2F3F6;--surfaceDeep:#EAECF0;
  --border:#DFE2E8;--borderSub:#ECEEF3;--borderAccent:#C41E1E12;
  --text:#09101D;--textSec:#3E4C63;--textMuted:#7E8BA3;--textFaint:#B0B9CA;
  --coke:#C41E1E;--cokeDark:#9A1515;--cokeDeep:#6B0E0E;--cokeBg:#FEF2F2;--cokeBorder:#C41E1E15;
  --green:#047857;--greenBg:#ECFDF5;--red:#B91C1C;--redBg:#FEF2F2;
  --amber:#92400E;--amberBg:#FFFBEB;--blue:#1D4ED8;--blueBg:#EFF6FF;
  --purple:#6D28D9;--purpleBg:#F5F3FF;--cyan:#0E7490;--cyanBg:#ECFEFF;
  --mono:'JetBrains Mono',monospace;--sans:'Manrope',system-ui,sans-serif;
  --r:14px;--r-sm:8px;--r-lg:18px;--r-xl:24px;
  --shadow:0 1px 2px rgba(0,0,0,0.03),0 1px 3px rgba(0,0,0,0.02);
  --shadow-md:0 2px 8px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.03);
  --shadow-lg:0 8px 32px rgba(0,0,0,0.06);
  --shadow-card:0 1px 3px rgba(0,0,0,0.02),0 0 0 1px var(--border);
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased;overflow:hidden;height:100vh}
::selection{background:var(--coke);color:#fff}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.fade{animation:fadeUp .4s ease both}
.card{background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--shadow-card);position:relative;overflow:hidden;transition:box-shadow .2s}
.card:hover{box-shadow:var(--shadow-md)}
.card-accent{position:absolute;top:0;left:0;right:0;height:2px}
.tag{display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border-radius:5px;font-size:9px;font-weight:700;letter-spacing:.05em}
.btn{font-family:var(--sans);cursor:pointer;border:none;border-radius:var(--r-sm);font-weight:700;transition:all .12s;display:inline-flex;align-items:center;gap:5px;font-size:11px;padding:7px 14px;white-space:nowrap}
.btn-coke{background:var(--coke);color:#fff}.btn-coke:hover{background:var(--cokeDark);box-shadow:0 2px 8px rgba(196,30,30,0.25)}
.btn-outline{background:var(--surface);border:1px solid var(--border);color:var(--textSec)}.btn-outline:hover{border-color:var(--coke);color:var(--coke)}
.btn-ghost{background:transparent;border:none;color:var(--textMuted);padding:5px 8px}.btn-ghost:hover{color:var(--text);background:var(--surfaceAlt)}
.btn-sm{font-size:10px;padding:5px 10px}
.avatar{border-radius:50%;object-fit:cover;border:2px solid var(--surface);box-shadow:0 0 0 1px var(--border)}
.sidebar-btn{display:flex;align-items:center;gap:9px;padding:8px 12px;border-radius:var(--r-sm);font-size:11px;font-weight:600;color:var(--textSec);cursor:pointer;transition:all .1s;border:none;background:none;width:100%;text-align:left;font-family:var(--sans)}
.sidebar-btn:hover{background:var(--surfaceAlt);color:var(--text)}
.sidebar-btn.active{background:var(--cokeBg);color:var(--coke);font-weight:700}
.metric-bar{height:6px;background:var(--surfaceDeep);border-radius:3px;overflow:hidden}
.metric-fill{height:100%;border-radius:3px}
.admin-tab{padding:0 16px;height:36px;display:flex;align-items:center;font-size:11px;font-weight:600;color:var(--textMuted);cursor:pointer;border-bottom:2px solid transparent;transition:all .12s;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--sans);gap:6px}
.admin-tab:hover{color:var(--text)}
.admin-tab.active{color:var(--coke);border-bottom-color:var(--coke);font-weight:700}
.kpi-value{font-size:24px;font-weight:800;font-family:var(--mono);letter-spacing:-.03em;line-height:1}
.section-title{font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--textFaint);margin-bottom:10px}
.msg-row{display:flex;gap:10px;padding:12px 0;align-items:flex-start}
.msg-row+.msg-row{border-top:1px solid var(--borderSub)}
.task-row{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--r-sm);transition:background .1s}
.task-row:hover{background:var(--surfaceAlt)}
.status-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- ═══ EXECUTIVE BRAND BAR ═══ -->
<div style="background:linear-gradient(135deg,#1A0804 0%,#2A0C08 40%,#1E0906 100%);height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 24px">
  <div style="display:flex;align-items:center;gap:14px">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/200px-Coca-Cola_logo.svg.png" alt="Coca-Cola" style="height:16px;filter:brightness(2)" onerror="this.outerHTML='<span style=color:#fff;font-size:16px;font-weight:800;font-style:italic;letter-spacing:-.5px>Coca-Cola</span>'">
    <div style="width:1px;height:12px;background:rgba(255,255,255,.1)"></div>
    <span style="font-size:8px;font-weight:700;color:rgba(255,255,255,.3);letter-spacing:.12em">THE COCA-COLA COMPANY</span>
    <span style="font-size:7px;padding:2px 7px;border-radius:3px;background:rgba(196,30,30,.3);color:#FCA5A5;font-weight:800;letter-spacing:.06em">ENTERPRISE</span>
  </div>
  <div style="display:flex;align-items:center;gap:16px">
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:9px;color:rgba(255,255,255,.25);font-family:var(--mono)">NYSE: KO</span>
      <span style="font-size:10px;font-weight:800;color:rgba(255,255,255,.7);font-family:var(--mono)">$62.34</span>
      <span style="font-size:9px;color:#6EE7B7;font-weight:700">+0.47%</span>
    </div>
    <div style="width:1px;height:12px;background:rgba(255,255,255,.08)"></div>
    <span style="font-size:9px;color:rgba(255,255,255,.25)">Mar 24, 2026 &middot; 3:24 PM ET</span>
  </div>
</div>

<!-- ═══ ADMIN TABS — Switch between executive portals ═══ -->
<div style="background:var(--surface);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;padding:0 24px;position:sticky;top:0;z-index:100;box-shadow:var(--shadow)">
  <div style="display:flex;align-items:center;gap:0">
    <div style="display:flex;align-items:center;gap:7px;padding:0 20px 0 0;margin-right:12px;border-right:1px solid var(--border);height:36px">
      <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#1D4ED8"/><stop offset="100%" stop-color="#6D28D9"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#047857"/></svg>
      <span style="font-size:12px;font-weight:800;letter-spacing:-.02em">FinanceOS</span>
    </div>
    <!-- Admin portal tabs -->
    <div id="adminTabs" style="display:flex;height:40px"></div>
  </div>
  <div style="display:flex;align-items:center;gap:5px">
    <button class="btn btn-outline btn-sm" onclick="togglePanel('copilot')">◎ Copilot</button>
    <button class="btn btn-outline btn-sm">▽ Export</button>
    <button class="btn btn-outline btn-sm">◇ Notifications</button>
    <button class="btn btn-coke btn-sm">◆ Share with Board</button>
  </div>
</div>

<div style="display:flex;height:calc(100vh - 80px)">

<!-- ═══ SIDEBAR ═══ -->
<div style="width:200px;border-right:1px solid var(--border);background:var(--surface);padding:12px 8px;flex-shrink:0;overflow-y:auto;display:flex;flex-direction:column">
  <div style="padding:0 12px;margin-bottom:2px" class="section-title">Finance</div>
  <div id="sidebarFinance"></div>
  <div style="height:1px;background:var(--borderSub);margin:8px 6px"></div>
  <div style="padding:0 12px;margin-bottom:2px" class="section-title">Organization</div>
  <div id="sidebarOrg"></div>
  <div style="height:1px;background:var(--borderSub);margin:8px 6px"></div>
  <div style="padding:0 12px;margin-bottom:2px" class="section-title">Team Online</div>
  <div id="teamSidebar" style="padding:0 4px"></div>
  <div style="flex:1"></div>
  <div style="padding:8px;border-top:1px solid var(--borderSub);margin-top:8px">
    <div style="display:flex;align-items:center;gap:8px;padding:6px">
      <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&q=80&fit=crop&crop=face" class="avatar" style="width:28px;height:28px">
      <div><div style="font-size:10px;font-weight:700">James Mitchell</div><div style="font-size:8px;color:var(--textMuted)">Chief Financial Officer</div></div>
    </div>
  </div>
</div>

<!-- ═══ CONTENT AREA ═══ -->
<div style="flex:1;overflow-y:auto;padding:20px 24px" id="content"></div>

<!-- ═══ RIGHT PANEL (Copilot / Notifications) ═══ -->
<div id="rightPanel" style="display:none;width:340px;border-left:1px solid var(--border);background:var(--surface);flex-shrink:0;overflow-y:auto;padding:16px"></div>
</div>


` }} />
    </>
  );
}
