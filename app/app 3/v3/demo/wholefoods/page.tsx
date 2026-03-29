'use client';

import { useEffect, useRef } from 'react';

export default function V3DemoWholefoodsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const admins = [
  {id:"cfo",name:"Daniel Park",role:"CFO",photo:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80&fit=crop&crop=face",status:"online",emoji:""},
  {id:"vpf",name:"Rachel Torres",role:"VP Finance",photo:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&fit=crop&crop=face",status:"online",emoji:""},
  {id:"ctrl",name:"Andre Williams",role:"Controller",photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face",status:"away",emoji:""},
  {id:"fpa",name:"Maya Singh",role:"FP&A Director",photo:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80&fit=crop&crop=face",status:"online",emoji:""},
  {id:"trs",name:"Kevin Cho",role:"Treasury",photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80&fit=crop&crop=face",status:"offline",emoji:""},
  {id:"ops",name:"Lisa Nakamura",role:"VP Operations",photo:"https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=80&q=80&fit=crop&crop=face",status:"online",emoji:""},
];

const tasks=[
  {t:"Review Q1 earnings draft",a:"Rachel Torres",p:"high",due:"Mar 26",s:"In Progress",c:"Reporting",pct:65},
  {t:"Finalize store-level P&L rollup",a:"Andre Williams",p:"high",due:"Mar 27",s:"In Review",c:"Close",pct:88},
  {t:"Private label margin analysis",a:"Maya Singh",p:"medium",due:"Mar 28",s:"In Progress",c:"Modeling",pct:42},
  {t:"Board deck — same-store sales bridge",a:"Daniel Park",p:"high",due:"Mar 25",s:"Draft",c:"Board",pct:30},
  {t:"Supplier cost renegotiation model",a:"Rachel Torres",p:"medium",due:"Mar 30",s:"Not Started",c:"Procurement",pct:0},
  {t:"Cash position & sweep optimization",a:"Kevin Cho",p:"medium",due:"Mar 28",s:"In Progress",c:"Treasury",pct:55},
  {t:"New store opening pro formas (Q2)",a:"Maya Singh",p:"low",due:"Apr 5",s:"Not Started",c:"Expansion",pct:0},
  {t:"Organic category trend deck",a:"Lisa Nakamura",p:"high",due:"Mar 25",s:"Draft",c:"Ops",pct:20},
];

// Whole Foods-specific approval workflows
const approvals=[
  {doc:"Q1 Earnings Release",stage:3,total:4,stages:["FP&A Review","Controller Sign-off","CFO Approval","Board Filing"],approvers:[admins[3],admins[2],admins[0],null]},
  {doc:"Store Expansion Budget",stage:2,total:4,stages:["Ops Analysis","Finance Review","CFO Approval","Board Vote"],approvers:[admins[5],admins[1],admins[0],null]},
  {doc:"365 Brand Relaunch Plan",stage:1,total:3,stages:["Category P&L","VP Finance","CFO Final"],approvers:[admins[3],admins[1],admins[0]]},
];

// Close process steps
const closeSteps=[
  {name:"Revenue Recognition",status:"done",owner:"Andre",pct:100},
  {name:"Store-Level P&L",status:"done",owner:"Andre",pct:100},
  {name:"Intercompany Eliminations",status:"done",owner:"Rachel",pct:100},
  {name:"Lease & Fixed Asset",status:"done",owner:"Kevin",pct:100},
  {name:"Accruals & Provisions",status:"active",owner:"Andre",pct:78},
  {name:"Management Adjustments",status:"pending",owner:"Daniel",pct:0},
  {name:"Consolidation",status:"pending",owner:"Rachel",pct:0},
  {name:"CFO Sign-off",status:"pending",owner:"Daniel",pct:0},
];

const msgs=[
  {from:admins[1],text:"Private label EBITDA margin hit 38.2% — 420bps above national brand. Recommending 15% more shelf allocation for 365 Everyday Value line.",time:"2:45 PM",channel:"#finance-leadership",reactions:["2","1"]},
  {from:admins[0],text:"Strong. Also pull the shrinkage data by region. The Midwest pilot with AI-powered inventory reduced waste 22% — want that in the board deck.",time:"2:48 PM",channel:"#finance-leadership",reactions:["3"]},
  {from:admins[3],text:"Same-store sales +4.8% comp. Organic produce drove 62% of the basket growth. The premium positioning is resonating post-price investments.",time:"2:52 PM",channel:"#finance-leadership",reactions:["4"]},
  {from:admins[2],text:"Store-level P&L close is at 94% — 6 locations outstanding (all Pacific NW). Expecting full close by tomorrow noon. Margins look healthy.",time:"3:01 PM",channel:"#finance-leadership",reactions:["1"]},
  {from:admins[5],text:"Supply chain efficiency up 8.3% QoQ. The new regional distribution hub cut delivery times 31% for 127 stores. Ready for the ops section of the board deck.",time:"3:14 PM",channel:"#finance-leadership",reactions:["2"]},
];

// Whole Foods personalized KPIs
const kpis=[
  {l:"Net Revenue",v:"$21.2B",d:"+6.8%",u:1,bar:"var(--wf)",n:"TTM Consolidated",sparkData:[78,82,85,88,92,96,100]},
  {l:"Gross Margin",v:"36.4%",d:"+180bps",u:1,bar:"var(--green)",n:"vs 34.6% prior year",sparkData:[84,85,87,89,90,92,94]},
  {l:"Store EBITDA",v:"$2.86B",d:"+11.2%",u:1,bar:"var(--blue)",n:"13.5% EBITDA margin",sparkData:[75,78,82,85,88,92,96]},
  {l:"Same-Store Sales",v:"+4.8%",d:"+2.1pp",u:1,bar:"var(--wf-light)",n:"14th consecutive qtr",sparkData:[60,65,70,72,78,85,92]},
  {l:"Organic Mix",v:"42.6%",d:"+3.8pp",u:1,bar:"var(--purple)",n:"vs 38.8% prior year",sparkData:[70,73,76,79,82,86,90]},
  {l:"Shrinkage Rate",v:"2.1%",d:"-40bps",u:1,bar:"var(--cyan)",n:"AI inventory pilot impact",sparkData:[95,92,88,84,80,76,72]},
];

// Whole Foods personalized segments
const segs=[
  {n:"Northeast",r:5520,p:26,g:5.4,m:37.8,stores:141,c:"var(--wf)",organic:44.2,shrink:1.9,basket:43.80,priv:35.2},
  {n:"Southeast",r:3920,p:18.5,g:7.2,m:35.1,stores:98,c:"var(--green)",organic:38.5,shrink:2.4,basket:40.10,priv:31.8},
  {n:"Midwest",r:3180,p:15,g:8.8,m:34.2,stores:79,c:"var(--blue)",organic:40.1,shrink:1.7,basket:39.50,priv:33.6},
  {n:"Southwest",r:3680,p:17.4,g:6.1,m:36.9,stores:92,c:"var(--amber)",organic:43.8,shrink:2.3,basket:42.20,priv:34.1},
  {n:"Pacific",r:4900,p:23.1,g:4.2,m:38.4,stores:121,c:"var(--purple)",organic:46.9,shrink:2.0,basket:45.70,priv:37.8},
];

// Activity feed (social experience)
const activityFeed=[
  {type:"celebration",user:admins[2],text:"completed Store-Level P&L for 525 of 531 stores",time:"12 min ago",icon:""},
  {type:"comment",user:admins[3],text:"commented on Private Label Margin Analysis",time:"28 min ago",icon:""},
  {type:"approval",user:admins[0],text:"approved Midwest expansion pro forma",time:"45 min ago",icon:""},
  {type:"upload",user:admins[5],text:"shared Supply Chain Efficiency Report Q1",time:"1h ago",icon:""},
  {type:"milestone",user:admins[1],text:"hit 365 brand margin target: 38.2%",time:"2h ago",icon:""},
  {type:"join",user:admins[4],text:"joined the Treasury workspace",time:"3h ago",icon:""},
  {type:"ai",user:null,text:"AI Copilot flagged anomaly: Pacific NW cost variance +$2.1M",time:"3h ago",icon:""},
];

// Bottlenecks detected by AI
const bottlenecks=[
  {severity:"warning",title:"6 Pacific NW stores missing P&L data",desc:"Expected by tomorrow noon. May delay consolidation.",owner:"Andre Williams",action:"View stores"},
  {severity:"info",title:"Board deck due in 48 hours",desc:"3 of 7 sections complete. Board deck bridge chart needs same-store data.",owner:"Daniel Park",action:"Open deck"},
];

let activeAdmin="cfo",activeView="overview",panelOpen=null;

/* ═══ MOBILE SIDEBAR TOGGLE ═══ */
function toggleMobileSidebar(){
  const sb=document.getElementById('sidebarWrap');
  const ov=document.getElementById('mobileOverlay');
  sb.classList.toggle('open');
  ov.classList.toggle('open');
}
/* Close sidebar on nav click (mobile) */
const origSwitchView=typeof switchView!=='undefined'?switchView:null;
function mobileAwareSwitchView(v){
  if(window.innerWidth<=768){
    document.getElementById('sidebarWrap').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('open');
  }
}
/* Platform detection for analytics */
const platform={ios:/iPad|iPhone|iPod/.test(navigator.userAgent),windows:/Win/.test(navigator.platform),touch:'ontouchstart' in window,highDPI:window.devicePixelRatio>1.5};
document.documentElement.classList.add(platform.ios?'ios':platform.windows?'windows':'other');
if(platform.touch)document.documentElement.classList.add('touch');

function sparkline(data,color,w=60,h=18){
  const max=Math.max(...data),min=Math.min(...data);
  const pts=data.map((v,i)=>\`\${i*(w/(data.length-1))},\${h-((v-min)/(max-min))*h}\`).join(' ');
  return \`<svg width="\${w}" height="\${h}" style="display:block"><polyline points="\${pts}" fill="none" stroke="\${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/><circle cx="\${w}" cy="\${h-((data[data.length-1]-min)/(max-min))*h}" r="2" fill="\${color}"/></svg>\`;
}

function progressRing(pct,size=32,stroke=3,color='var(--wf)'){
  const r=(size-stroke)/2,c=2*Math.PI*r,off=c-(pct/100)*c;
  return \`<div class="progress-ring" style="width:\${size}px;height:\${size}px"><svg width="\${size}" height="\${size}"><circle cx="\${size/2}" cy="\${size/2}" r="\${r}" stroke="var(--surfaceDeep)" stroke-width="\${stroke}"/><circle cx="\${size/2}" cy="\${size/2}" r="\${r}" stroke="\${color}" stroke-width="\${stroke}" stroke-dasharray="\${c}" stroke-dashoffset="\${off}"/></svg><span style="position:absolute;font-size:8px;font-weight:800;font-family:var(--mono);color:var(--textSec)">\${pct}%</span></div>\`;
}

function renderAdminTabs(){
  document.getElementById('adminTabs').innerHTML=admins.map(a=>\`
    <button class="admin-tab \${a.id===activeAdmin?'active':''}" onclick="switchAdmin('\${a.id}')">
      <div style="position:relative">
        <img src="\${a.photo}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:2px solid \${a.id===activeAdmin?'var(--wf)':'var(--border)'};transition:all .25s var(--spring)">
        \${a.status==='online'?'<div style="position:absolute;bottom:-1px;right:-1px;width:7px;height:7px;border-radius:50%;background:var(--green);border:1.5px solid var(--surface)"></div>':''}
      </div>
      <span>\${a.role}</span>
    </button>\`).join('');
}
function switchAdmin(id){activeAdmin=id;renderAdminTabs();renderContent();}

function renderSidebar(){
  const fin=[{i:"◆",l:"Overview",v:"overview"},{i:"▣",l:"P&L Statement",v:"pnl"},{i:"◈",l:"Regions",v:"segments"},{i:"▲",l:"Forecast",v:"forecast"},{i:"◎",l:"Cash Flow",v:"cashflow"},{i:"◉",l:"Board Deck",v:"board"},{i:"◐",l:"Month-End Close",v:"close"}];
  const org=[{i:"■",l:"Tasks",v:"tasks",b:tasks.filter(t=>t.s!=="Complete").length},{i:"✓",l:"Approvals",v:"approvals",b:approvals.length},{i:"▹",l:"Messages",v:"messages",b:msgs.length},{i:"◇",l:"Team",v:"team"},{i:"★",l:"Celebrations",v:"celebrations"},{i:"◻",l:"Documents",v:"docs"},{i:"▧",l:"Pipeline",v:"pipeline"},{i:"↩",l:"Refunds",v:"refunds"}];
  document.getElementById('sidebarFinance').innerHTML=fin.map(f=>\`<button class="sidebar-btn \${f.v===activeView?'active':''}" onclick="switchView('\${f.v}')"><span style="width:16px;text-align:center;font-size:11px;opacity:.45">\${f.i}</span>\${f.l}</button>\`).join('');
  document.getElementById('sidebarOrg').innerHTML=org.map(o=>\`<button class="sidebar-btn \${o.v===activeView?'active':''}" onclick="switchView('\${o.v}')"><span style="width:16px;text-align:center;font-size:11px;opacity:.45">\${o.i}</span>\${o.l}\${o.b?\`<span class="tag" style="background:var(--wf);color:#fff;margin-left:auto;padding:2px 6px;font-size:8px;border-radius:4px">\${o.b}</span>\`:''}</button>\`).join('');
  document.getElementById('teamSidebar').innerHTML=admins.map(a=>\`<div style="display:flex;align-items:center;gap:7px;padding:5px 8px;border-radius:6px;cursor:pointer;transition:all .2s var(--spring)" onmouseover="this.style.background='var(--surfaceAlt)';this.style.transform='translateX(2px)'" onmouseout="this.style.background='transparent';this.style.transform='translateX(0)'" onclick="switchAdmin('\${a.id}')"><div style="position:relative"><img src="\${a.photo}" class="avatar" style="width:24px;height:24px"><div class="status-dot" style="position:absolute;bottom:-1px;right:-1px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--textFaint)'};border:2px solid var(--surface)"></div></div><span style="font-size:10px;font-weight:500;color:var(--textSec)">\${a.name.split(' ')[0]}</span>\${a.status==='online'?'<span class="typing-dots" style="margin-left:auto;display:none"><span></span><span></span><span></span></span>':''}</div>\`).join('');
}
function switchView(v){activeView=v;renderSidebar();renderContent();mobileAwareSwitchView(v);}

function renderContent(){
  const el=document.getElementById('content');
  const admin=admins.find(a=>a.id===activeAdmin);
  if(activeView==='overview')el.innerHTML=renderOverview(admin);
  else if(activeView==='tasks')el.innerHTML=renderTasks(admin);
  else if(activeView==='messages')el.innerHTML=renderMessages(admin);
  else if(activeView==='team')el.innerHTML=renderTeam(admin);
  else if(activeView==='segments')el.innerHTML=renderSegments(admin);
  else if(activeView==='pipeline')el.innerHTML=renderPipeline(admin);
  else if(activeView==='close')el.innerHTML=renderClose(admin);
  else if(activeView==='approvals')el.innerHTML=renderApprovals(admin);
  else if(activeView==='celebrations')el.innerHTML=renderCelebrations(admin);
  else if(activeView==='refunds')el.innerHTML=renderRefunds(admin);
  else el.innerHTML=\`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;color:var(--textMuted)"><div style="width:56px;height:56px;border-radius:16px;background:var(--wf-pale);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px;border:1px solid var(--wf-pale);color:var(--wf);animation:float 3s ease-in-out infinite">◆</div><div style="font-size:16px;font-weight:700;margin-bottom:4px;color:var(--text)">\${activeView.charAt(0).toUpperCase()+activeView.slice(1)}</div><div style="font-size:12px">Available in the full FinanceOS Enterprise deployment.</div></div>\`;
}

function renderOverview(admin){
  const pColor=p=>p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';
  return \`
  <!-- Bottleneck Alerts — urgent, top of page -->
  \${bottlenecks.map((b,i)=>\`<div class="\${b.severity==='warning'?'bottleneck':'bottleneck'} fade" style="animation-delay:\${.04+i*.04}s;display:flex;align-items:center;gap:12px">
    <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;flex-shrink:0;\${b.severity==='warning'?'background:var(--amberBg);color:var(--amber);border:1.5px solid var(--amberBorder)':'background:var(--blueBg);color:var(--blue);border:1.5px solid var(--blueBorder)'}">!</div>
    <div style="flex:1"><div style="font-size:11px;font-weight:700;color:var(--text)">\${b.title}</div><div style="font-size:10px;color:var(--textSec)">\${b.desc}</div></div>
    <span style="font-size:9px;color:var(--textMuted)">\${b.owner}</span>
    <button class="btn btn-outline btn-sm" style="font-size:9px">\${b.action}</button>
  </div>\`).join('')}

  <!-- ═══ TIER 1: Hero KPIs — the numbers that matter most ═══ -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:20px;margin-top:4px">
    \${kpis.slice(0,3).map((k,i)=>\`<div class="card card-hero card-interactive fade fade-d\${i+1}" style="padding:24px 28px" onclick="this.querySelector('.card-expand').classList.toggle('open')">
      <div class="card-accent" style="background:\${k.bar}"></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textMuted);margin-bottom:10px">\${k.l}</div>
          <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:6px">
            <span class="data-point"><span class="kpi-hero" style="animation:countUp .6s var(--spring) \${i*.08}s both">\${k.v}</span><span class="data-detail">\${k.n}</span></span>
            <span class="tag" style="background:\${k.u?'var(--greenBg)':'var(--redBg)'};color:\${k.u?'var(--green)':'var(--red)'};border:1px solid \${k.u?'var(--greenBorder)':'var(--redBorder)'};font-size:10px;padding:4px 10px">▲ \${k.d}</span>
          </div>
          <div style="font-size:10px;color:var(--textFaint);font-weight:500">\${k.n}</div>
        </div>
        <div style="text-align:right">\${sparkline(k.sparkData,k.bar,72,28)}<div style="font-size:8px;color:var(--textFaint);margin-top:3px">7-quarter trend</div></div>
      </div>
      <div class="card-expand">
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--textSec)"><span>Q4 2025</span><span>Q3 2025</span><span>Q2 2025</span></div>
        <div style="display:flex;gap:6px;margin-top:4px">
          \${[85,78,72].map(v=>\`<div style="flex:1"><div class="metric-bar" style="height:4px"><div class="metric-fill" style="--fill:\${v}%;width:\${v}%;background:\${k.bar};opacity:.4"></div></div><div style="font-size:8px;color:var(--textFaint);margin-top:2px;text-align:center">\${v}%</div></div>\`).join('')}
        </div>
      </div>
    </div>\`).join('')}
  </div>

  <!-- ═══ TIER 2: Secondary KPIs — smaller, supporting data ═══ -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
    \${kpis.slice(3).map((k,i)=>\`<div class="card card-primary card-interactive fade fade-d\${i+4}" style="padding:16px 20px" onclick="this.querySelector('.card-expand').classList.toggle('open')">
      <div class="card-accent" style="background:\${k.bar}"></div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textMuted);margin-bottom:6px">\${k.l}</div>
          <div style="display:flex;align-items:baseline;gap:8px">
            <span class="data-point"><span class="kpi-large" style="animation:countUp .5s var(--spring) \${(i+3)*.06}s both">\${k.v}</span><span class="data-detail">\${k.n}</span></span>
            <span class="tag" style="background:\${k.u?'var(--greenBg)':'var(--redBg)'};color:\${k.u?'var(--green)':'var(--red)'};border:1px solid \${k.u?'var(--greenBorder)':'var(--redBorder)'}">▲ \${k.d}</span>
          </div>
        </div>
        \${sparkline(k.sparkData,k.bar,56,20)}
      </div>
      <div class="card-expand">
        <div style="font-size:9px;color:var(--textSec);line-height:1.5">\${k.n}. Click to open the full analysis in \${k.l} view.</div>
      </div>
    </div>\`).join('')}
  </div>

  <!-- ═══ TIER 2: Operational Intelligence — 3 column ═══ -->
  <div class="section-heading fade fade-d5">Operations</div>

  <!-- Close Tracker + Whole Foods Metrics + Workflow -->
  <div style="display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:12px;margin-bottom:16px">

    <!-- Close Tracker -->
    <div class="card card-primary fade fade-d2" style="padding:20px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--wf),var(--green))"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <span style="font-size:13px;font-weight:800;letter-spacing:-.02em">Q1 Close Tracker</span>
        \${progressRing(78,36,3.5)}
      </div>
      \${closeSteps.slice(0,6).map((s,i)=>\`<div class="close-step" style="animation:slideIn .3s var(--spring) \${i*.05}s both">
        <div class="close-dot \${s.status}">\${s.status==='done'?'✓':s.status==='active'?'●':i+1}</div>
        <div style="flex:1"><div style="font-size:10px;font-weight:600;color:\${s.status==='done'?'var(--textMuted)':'var(--text)'};\${s.status==='done'?'text-decoration:line-through;opacity:.6':''}">\${s.name}</div>
        \${s.status==='active'?\`<div style="margin-top:3px"><div class="metric-bar" style="height:3px"><div class="metric-fill" style="--fill:\${s.pct}%;background:var(--blue);width:\${s.pct}%"></div></div></div>\`:''}</div>
        <span style="font-size:8px;color:var(--textFaint)">\${s.owner}</span>
      </div>\`).join('')}
      <button class="btn btn-outline btn-sm" style="width:100%;justify-content:center;margin-top:10px;font-size:9px" onclick="switchView('close')">Full close view →</button>
    </div>

    <!-- Whole Foods Personalized: Category Intelligence -->
    <div class="card card-primary fade fade-d3" style="padding:20px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--wf),var(--wf-light))"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div><span style="font-size:13px;font-weight:800;letter-spacing:-.02em">Category Intelligence</span><div style="font-size:9px;color:var(--textMuted);margin-top:1px">Key Category Metrics</div></div>
        <span class="tag" style="background:var(--surfaceAlt);color:var(--textMuted);border:1px solid var(--border)">Q1 2026</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        \${[
          {l:"Organic Penetration",v:"42.6%",d:"+3.8pp",c:"var(--wf)",bg:"var(--wf-tint)"},
          {l:"Private Label Mix",v:"28.4%",d:"+2.1pp",c:"var(--purple)",bg:"var(--purpleBg)"},
          {l:"Shrinkage Rate",v:"2.1%",d:"-40bps",c:"var(--green)",bg:"var(--greenBg)"},
          {l:"Supplier Score",v:"94.2",d:"+1.8",c:"var(--blue)",bg:"var(--blueBg)"},
        ].map(m=>\`<div style="padding:10px 12px;border-radius:var(--r-sm);background:\${m.bg};border:1px solid transparent;transition:all .2s var(--ease)">
          <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--textFaint);margin-bottom:5px">\${m.l}</div>
          <div style="display:flex;align-items:baseline;gap:4px"><span style="font-size:17px;font-weight:800;font-family:var(--mono);color:\${m.c}">\${m.v}</span><span style="font-size:9px;font-weight:700;color:var(--green)">\${m.d}</span></div>
        </div>\`).join('')}
      </div>
      <!-- Seasonal Demand Signal -->
      <div style="padding:10px 14px;border-radius:var(--r-sm);background:var(--surfaceAlt);border:1px solid var(--borderSub);margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><span style="font-size:9px;font-weight:800;color:var(--wf)">S</span><span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--textMuted)">Seasonal Demand Signal</span></div>
        <div style="font-size:10px;color:var(--textSec);line-height:1.6">Easter prep inventory +18% vs last year. Organic produce demand forecast <strong style="color:var(--wf)">+22%</strong> for week of Apr 13. AI recommends pre-positioning 3 days early for 89 high-volume stores.</div>
      </div>
      <!-- 365 Brand Performance -->
      <div style="padding:10px 14px;border-radius:var(--r-sm);border:1px solid var(--wf-pale);background:var(--wf-tint)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><span style="font-size:10px;font-weight:700;color:var(--wf)">365 Everyday Value</span><span style="font-size:9px;font-weight:700;color:var(--wf)">38.2% EBITDA</span></div>
        <div class="metric-bar"><div class="metric-fill" style="--fill:85%;width:85%;background:var(--wf)"></div></div>
        <div style="font-size:9px;color:var(--textMuted);margin-top:4px">420bps above national brand avg. Shelf expansion recommended.</div>
      </div>
    </div>

    <!-- AI Insights -->
    <div class="card card-primary fade fade-d4" style="padding:20px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--purple),var(--blue))"></div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px"><span style="font-size:13px;font-weight:800;letter-spacing:-.02em">AI Copilot</span><span class="tag" style="background:var(--purpleBg);color:var(--purple);border:1px solid var(--purpleBorder)">CLAUDE</span></div>
      \${[
        {i:"▲",t:"Private label margins 38.2% — expand 365 line shelf share 15%.",c:"var(--green)",bg:"var(--greenBg)",bd:"var(--greenBorder)"},
        {i:"◆",t:"AI inventory pilot cut shrinkage 22%. Scale to 200 stores.",c:"var(--blue)",bg:"var(--blueBg)",bd:"var(--blueBorder)"},
        {i:"◎",t:"Organic mix at 42.6% — highest in company history.",c:"var(--purple)",bg:"var(--purpleBg)",bd:"var(--purpleBorder)"},
      ].map((ins,i)=>\`<div style="display:flex;gap:8px;padding:8px 0;\${i<2?'border-bottom:1px solid var(--borderSub)':''}"><span class="tag" style="background:\${ins.bg};color:\${ins.c};flex-shrink:0;font-size:10px;border:1px solid \${ins.bd}">\${ins.i}</span><div style="font-size:10px;color:var(--textSec);line-height:1.55">\${ins.t}</div></div>\`).join('')}

      <!-- Quick Scenario Models -->
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--borderSub)">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textFaint);margin-bottom:8px">Quick Scenarios</div>
        \${[
          {l:"If basket size +5%",v:"→ +$1.06B revenue"},
          {l:"If shrinkage hits 1.5%",v:"→ +$127M savings"},
          {l:"If 365 mix reaches 35%",v:"→ +280bps margin"},
        ].map(c=>\`<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:9px"><span style="color:var(--textMuted);font-weight:600">\${c.l}</span><span style="color:var(--wf);font-weight:700">\${c.v}</span></div>\`).join('')}
      </div>
      <button class="btn btn-outline" style="width:100%;justify-content:center;margin-top:10px;font-size:10px" onclick="togglePanel('copilot')">Open AI Copilot →</button>
    </div>
  </div>

  <!-- Regions Quick View + Activity + Approvals -->
  <div class="section-heading fade fade-d5">Insights & Governance</div>
  <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:12px;margin-bottom:20px">
    <!-- Regions -->
    <div class="card card-support fade fade-d5" style="padding:20px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--wf),var(--green))"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;font-weight:800;letter-spacing:-.02em">Regional Performance</span><span class="tag" style="background:var(--surfaceAlt);color:var(--textSec);border:1px solid var(--border)">5 Regions</span></div>
      \${segs.map(s=>\`<div style="display:grid;grid-template-columns:90px 1fr 48px 38px 42px;gap:5px;align-items:center;padding:6px 4px;font-size:10px;border-radius:5px;transition:all .2s var(--ease)" onmouseover="this.style.background='var(--surfaceAlt)';this.style.transform='translateX(2px)'" onmouseout="this.style.background='transparent';this.style.transform='translateX(0)'">
        <div style="display:flex;align-items:center;gap:5px"><div style="width:6px;height:6px;border-radius:2px;background:\${s.c}"></div><span style="font-weight:600">\${s.n}</span></div>
        <div class="metric-bar"><div class="metric-fill" style="--fill:\${s.p*2.5}%;width:\${s.p*2.5}%;background:\${s.c};opacity:.35"></div></div>
        <span style="font-weight:700;font-family:var(--mono);font-size:9px;text-align:right;color:var(--text)">$\${(s.r/1000).toFixed(1)}B</span>
        <span style="font-weight:700;color:var(--green);font-size:9px;text-align:right">+\${s.g}%</span>
        <span style="font-size:8px;color:var(--textFaint);text-align:right">\${s.organic}% org</span>
      </div>\`).join('')}
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--borderSub);display:flex;justify-content:flex-end"><button class="btn btn-ghost btn-sm" style="font-size:9px" onclick="switchView('segments')">View details →</button></div>
    </div>

    <!-- Live Activity Feed (Social) -->
    <div class="card card-support fade fade-d6" style="padding:20px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--green),var(--wf))"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;font-weight:800;letter-spacing:-.02em">Live Activity</span><span style="display:inline-flex;align-items:center;gap:4px;font-size:9px;color:var(--green);font-weight:700"><span style="width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse 2s infinite"></span> Real-time</span></div>
      \${activityFeed.slice(0,5).map((a,i)=>\`<div style="display:flex;gap:8px;padding:7px 0;\${i<4?'border-bottom:1px solid var(--borderSub)':''};animation:slideIn .3s var(--spring) \${i*.06}s both">
        \${a.user?\`<img src="\${a.user.photo}" class="avatar" style="width:22px;height:22px;flex-shrink:0">\`:\`<div style="width:22px;height:22px;border-radius:50%;background:var(--purpleBg);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0">\${a.icon}</div>\`}
        <div style="flex:1;min-width:0"><div style="font-size:10px;color:var(--textSec);line-height:1.4"><strong style="color:var(--text)">\${a.user?a.user.name.split(' ')[0]:'AI'}</strong> \${a.text}</div><div style="font-size:8px;color:var(--textFaint);margin-top:1px">\${a.time}</div></div>
      </div>\`).join('')}
      <button class="btn btn-outline btn-sm" style="width:100%;justify-content:center;margin-top:8px;font-size:9px" onclick="togglePanel('activity')">View all activity →</button>
    </div>

    <!-- Approval Workflows -->
    <div class="card card-support fade fade-d7" style="padding:20px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--amber),var(--green))"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;font-weight:800;letter-spacing:-.02em">Approvals</span><span class="tag" style="background:var(--amberBg);color:var(--amber);border:1px solid var(--amberBorder)">\${approvals.length} pending</span></div>
      \${approvals.map((ap,ai)=>\`<div style="padding:10px 0;\${ai<approvals.length-1?'border-bottom:1px solid var(--borderSub)':''}">
        <div style="font-size:11px;font-weight:700;margin-bottom:6px">\${ap.doc}</div>
        <div style="display:flex;align-items:center;gap:0;margin-bottom:4px">
          \${ap.stages.map((st,si)=>\`<div style="display:flex;align-items:center;gap:0">
            <div style="width:18px;height:18px;border-radius:50%;font-size:7px;font-weight:700;display:flex;align-items:center;justify-content:center;\${si<ap.stage?'background:var(--wf);color:#fff;box-shadow:0 1px 4px rgba(0,103,75,0.15)':si===ap.stage?'background:var(--amberBg);color:var(--amber);border:1.5px solid var(--amber)':'background:var(--surfaceDeep);color:var(--textFaint)'}">\${si<ap.stage?'✓':si+1}</div>
            \${si<ap.stages.length-1?\`<div style="width:14px;height:2px;background:\${si<ap.stage?'var(--wf)':'var(--surfaceDeep)'}"></div>\`:''}
          </div>\`).join('')}
        </div>
        <div style="font-size:8px;color:var(--textMuted)">Current: \${ap.stages[ap.stage]} \${ap.approvers[ap.stage]?'· '+ap.approvers[ap.stage].name.split(' ')[0]:''}</div>
      </div>\`).join('')}
      <button class="btn btn-outline btn-sm" style="width:100%;justify-content:center;margin-top:8px;font-size:9px" onclick="switchView('approvals')">Manage approvals →</button>
    </div>
  </div>

  <!-- ═══ TIER 3: Team & Tasks — supporting context ═══ -->
  <div class="section-heading fade fade-d6">Team & Workflow</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    <div class="card card-support fade fade-d6" style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;font-weight:800;letter-spacing:-.02em">Team Chat</span><span class="avatar-stack">\${admins.filter(a=>a.status==='online').slice(0,4).map(a=>\`<img src="\${a.photo}" class="avatar" style="width:20px;height:20px">\`).join('')}</span><button class="btn btn-ghost btn-sm" onclick="switchView('messages')">View all →</button></div>
      \${msgs.slice(0,3).map((m,i)=>\`<div class="msg-row" style="animation-delay:\${i*.06}s"><img src="\${m.from.photo}" class="avatar" style="width:28px;height:28px;flex-shrink:0"><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:4px;margin-bottom:2px"><span style="font-size:11px;font-weight:700;color:var(--text)">\${m.from.name.split(' ')[0]}</span><span style="font-size:9px;color:var(--textFaint)">\${m.time}</span></div><div style="font-size:10px;color:var(--textSec);line-height:1.5;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">\${m.text}</div>\${m.reactions?\`<div style="display:flex;gap:4px;margin-top:4px">\${m.reactions.map(r=>\`<span style="font-size:9px;padding:1px 6px;border-radius:10px;background:var(--surfaceAlt);border:1px solid var(--borderSub);cursor:pointer;transition:all .15s" onmouseover="this.style.borderColor='var(--wf)'" onmouseout="this.style.borderColor='var(--borderSub)'">+ \${r}</span>\`).join('')}</div>\`:''}</div></div>\`).join('')}
    </div>
    <div class="card card-support fade fade-d7" style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;font-weight:800;letter-spacing:-.02em">Priority Tasks</span><button class="btn btn-ghost btn-sm" onclick="switchView('tasks')">View all →</button></div>
      \${tasks.filter(t=>t.p==='high').slice(0,4).map((t,i)=>\`<div class="task-row" style="animation:slideIn .3s var(--spring) \${i*.05}s both">
        <div class="status-dot" style="background:\${pColor(t.p)}"></div>
        <div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:600">\${t.t}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:3px"><div class="metric-bar" style="width:60px;height:3px"><div class="metric-fill" style="--fill:\${t.pct}%;width:\${t.pct}%;background:var(--wf)"></div></div><span style="font-size:8px;color:var(--textFaint)">\${t.pct}%</span></div>
        </div>
        <span style="font-size:9px;color:var(--textMuted)">\${t.due}</span>
        <span class="tag" style="background:var(--blueBg);color:var(--blue);font-size:7px;border:1px solid var(--blueBorder)">\${t.s}</span>
      </div>\`).join('')}
    </div>
  </div>

  <!-- FinanceOS Competitive Footer -->
  <div style="margin-top:16px;padding:18px 24px;border-radius:var(--r-lg);background:linear-gradient(135deg,var(--wf-tint),var(--surfaceAlt));border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#1d4ed8,#6d28d9);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(29,78,216,0.12)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="3" height="20" rx="1.5" fill="white" opacity=".9"/><rect x="3" y="2" width="16" height="3" rx="1.5" fill="white" opacity=".9"/><rect x="3" y="9.5" width="11" height="2.5" rx="1" fill="white" opacity=".6"/></svg>
      </div>
      <div>
        <div style="font-size:11px;font-weight:800;color:var(--text)">Powered by FinanceOS · Enterprise</div>
        <div style="font-size:9px;color:var(--textMuted)">SOC 2 Type II · AES-256 Encryption · 99.9% SLA · Real-Time Sync</div>
      </div>
    </div>
    <div style="display:flex;gap:6px;align-items:center">
      <span class="tag" style="background:var(--surfaceAlt);color:var(--textMuted);border:1px solid var(--border)">v3.0</span>
      <span style="font-size:9px;color:var(--textFaint)">Deployed Mar 24, 2026</span>
    </div>
  </div>\`;
}

function renderTasks(){
  const pColor=p=>p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';
  const sColor=s=>s==='In Progress'?'var(--blue)':s==='In Review'?'var(--purple)':s==='Draft'?'var(--amber)':'var(--textMuted)';
  return \`<div class="fade" style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px"><div><div class="section-title">Organization</div><h2 style="font-size:22px;font-weight:800;letter-spacing:-.03em">Task Management</h2></div><div style="display:flex;gap:6px"><button class="btn btn-outline btn-sm">Filter</button><button class="btn btn-wf">+ New Task</button></div></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">\${[{l:"All Tasks",v:tasks.length,c:"var(--wf)"},{l:"High Priority",v:tasks.filter(t=>t.p==='high').length,c:"var(--red)"},{l:"In Progress",v:tasks.filter(t=>t.s==='In Progress').length,c:"var(--blue)"},{l:"In Review",v:tasks.filter(t=>t.s==='In Review').length,c:"var(--purple)"}].map((s,i)=>\`<div class="card fade fade-d\${i+1}" style="padding:16px 18px;text-align:center"><div class="card-accent" style="background:\${s.c}"></div><div class="kpi-value" style="font-size:24px;animation:countUp .5s var(--spring) \${i*.06}s both">\${s.v}</div><div style="font-size:9px;color:var(--textMuted);font-weight:600;margin-top:4px">\${s.l}</div></div>\`).join('')}</div>
  <div class="card fade fade-d3" style="padding:0">\${tasks.map((t,i)=>\`<div class="task-row" style="padding:14px 22px;\${i<tasks.length-1?'border-bottom:1px solid var(--borderSub)':''};animation:slideIn .3s var(--spring) \${i*.04}s both">
    <div class="status-dot" style="background:\${pColor(t.p)}"></div>
    <div style="flex:1">
      <div style="font-size:11px;font-weight:600">\${t.t}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:4px"><div class="metric-bar" style="width:80px;height:3px"><div class="metric-fill" style="--fill:\${t.pct}%;width:\${t.pct}%;background:\${pColor(t.p)}"></div></div><span style="font-size:8px;color:var(--textFaint)">\${t.pct}%</span></div>
    </div>
    <div style="display:flex;align-items:center;gap:5px;width:130px"><img src="\${admins.find(a=>a.name===t.a)?.photo||''}" class="avatar" style="width:20px;height:20px"><span style="font-size:9px;color:var(--textSec)">\${t.a.split(' ')[0]}</span></div>
    <span class="tag" style="background:\${sColor(t.s)}08;color:\${sColor(t.s)};width:80px;justify-content:center;border:1px solid \${sColor(t.s)}18">\${t.s}</span>
    <span style="font-size:9px;color:var(--textMuted);width:50px;text-align:right">\${t.due}</span>
  </div>\`).join('')}</div>\`;
}

function renderMessages(){
  return \`<div class="fade" style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px"><div><div class="section-title">Organization</div><h2 style="font-size:22px;font-weight:800;letter-spacing:-.03em">Team Messages</h2></div></div>
  <div class="card fade fade-d1" style="padding:0"><div style="padding:14px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;background:var(--surfaceAlt)"><span style="font-size:12px;font-weight:700"># finance-leadership</span><span class="tag" style="background:var(--greenBg);color:var(--green);border:1px solid var(--greenBorder)">\${admins.filter(a=>a.status==='online').length} online</span><div class="avatar-stack" style="margin-left:auto">\${admins.filter(a=>a.status==='online').slice(0,4).map(a=>\`<img src="\${a.photo}" class="avatar" style="width:22px;height:22px">\`).join('')}</div></div>
  <div style="padding:16px 22px">\${msgs.map((m,i)=>\`<div class="msg-row" style="animation-delay:\${i*.06}s"><img src="\${m.from.photo}" class="avatar" style="width:32px;height:32px;flex-shrink:0"><div><div style="display:flex;align-items:center;gap:5px;margin-bottom:3px"><span style="font-size:11px;font-weight:700;color:var(--text)">\${m.from.name}</span><span style="font-size:9px;color:var(--textFaint)">\${m.from.role} · \${m.time}</span></div><div style="font-size:11px;color:var(--textSec);line-height:1.6;max-width:92%;padding:10px 14px;background:var(--surfaceAlt);border-radius:12px 12px 12px 2px;border:1px solid var(--borderSub)">\${m.text}</div>\${m.reactions?\`<div style="display:flex;gap:4px;margin-top:5px">\${m.reactions.map(r=>\`<span style="font-size:10px;padding:2px 8px;border-radius:12px;background:var(--surface);border:1px solid var(--borderSub);cursor:pointer;transition:all .2s var(--spring)" onmouseover="this.style.borderColor='var(--wf)';this.style.background='var(--wf-tint)'" onmouseout="this.style.borderColor='var(--borderSub)';this.style.background='var(--surface)'">+ \${r}</span>\`).join('')}</div>\`:''}</div></div>\`).join('')}</div>
  <div style="padding:14px 22px;border-top:1px solid var(--border);display:flex;gap:6px"><input placeholder="Message #finance-leadership..." style="flex:1;padding:10px 14px;border-radius:var(--r-sm);border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:11px;font-family:var(--sans);outline:none;transition:all .25s var(--spring)" onfocus="this.style.borderColor='var(--wf)';this.style.boxShadow='0 0 0 3px rgba(0,103,75,0.08)'" onblur="this.style.borderColor='var(--border)';this.style.boxShadow='none'"><button class="btn btn-wf btn-sm">Send</button></div></div>\`;
}

function renderTeam(){
  return \`<div class="fade" style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px"><div><div class="section-title">Organization</div><h2 style="font-size:22px;font-weight:800;letter-spacing:-.03em">Finance Leadership</h2></div><button class="btn btn-wf">+ Invite Member</button></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">\${admins.map((a,i)=>\`<div class="card fade fade-d\${i+1}" style="padding:0"><div style="position:relative;height:90px;overflow:hidden;background:linear-gradient(135deg,var(--wf-tint),var(--surfaceAlt))"><div style="position:absolute;bottom:-22px;left:50%;transform:translateX(-50%)"><div style="position:relative"><img src="\${a.photo}" class="avatar" style="width:46px;height:46px;border-width:3px"><div style="position:absolute;bottom:0;right:0;width:12px;height:12px;border-radius:50%;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--textFaint)'};border:2.5px solid var(--surface)"></div></div></div></div><div style="padding:28px 16px 20px;text-align:center"><div style="font-size:13px;font-weight:700;color:var(--text)">\${a.name}</div><div style="font-size:10px;color:var(--textMuted);margin-bottom:4px">\${a.role}</div><div style="font-size:9px;color:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--textFaint)'};font-weight:600;margin-bottom:12px;text-transform:capitalize">\${a.status}</div><div style="display:flex;gap:5px;justify-content:center"><button class="btn btn-outline btn-sm" onclick="switchView('messages')">Message</button><button class="btn btn-outline btn-sm" onclick="switchView('tasks')">Assign</button><button class="btn btn-wf btn-sm" onclick="switchAdmin('\${a.id}')">Portal</button></div></div></div>\`).join('')}</div>\`;
}

function renderSegments(){
  return \`<div class="fade" style="margin-bottom:20px"><div class="section-title">Finance</div><h2 style="font-size:22px;font-weight:800;letter-spacing:-.03em">Regional Performance</h2></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">\${segs.map((s,i)=>\`<div class="card fade fade-d\${i+1}" style="padding:20px;border-left:3px solid \${s.c}"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:14px;font-weight:700">\${s.n}</span><span class="tag" style="background:var(--greenBg);color:var(--green);border:1px solid var(--greenBorder)">+\${s.g}%</span></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px">\${[{l:"Revenue",v:\`$\${(s.r/1000).toFixed(1)}B\`},{l:"Margin",v:\`\${s.m}%\`},{l:"Stores",v:s.stores}].map(m=>\`<div><div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textFaint);margin-bottom:3px">\${m.l}</div><div style="font-size:16px;font-weight:800;font-family:var(--mono);letter-spacing:-.03em">\${m.v}</div></div>\`).join('')}</div>
    <!-- Whole Foods personalized metrics -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding-top:8px;border-top:1px solid var(--borderSub)">
      <div style="padding:6px 8px;border-radius:4px;background:var(--wf-tint)"><div style="font-size:7px;font-weight:700;text-transform:uppercase;color:var(--textFaint)">Organic Mix</div><div style="font-size:12px;font-weight:800;color:var(--wf);font-family:var(--mono)">\${s.organic}%</div></div>
      <div style="padding:6px 8px;border-radius:4px;background:var(--surfaceAlt)"><div style="font-size:7px;font-weight:700;text-transform:uppercase;color:var(--textFaint)">Shrinkage</div><div style="font-size:12px;font-weight:800;color:\${s.shrink<=2?'var(--green)':'var(--amber)'};font-family:var(--mono)">\${s.shrink}%</div></div>
      <div style="padding:6px 8px;border-radius:4px;background:var(--surfaceAlt)"><div style="font-size:7px;font-weight:700;text-transform:uppercase;color:var(--textFaint)">Avg Basket</div><div style="font-size:12px;font-weight:800;font-family:var(--mono)">$\${s.basket}</div></div>
      <div style="padding:6px 8px;border-radius:4px;background:var(--purpleBg)"><div style="font-size:7px;font-weight:700;text-transform:uppercase;color:var(--textFaint)">365 Brand</div><div style="font-size:12px;font-weight:800;color:var(--purple);font-family:var(--mono)">\${s.priv}%</div></div>
    </div>
  </div>\`).join('')}
  <div class="card fade fade-d6" style="padding:20px;grid-column:span 2"><div class="card-accent" style="background:linear-gradient(90deg,var(--wf),var(--green))"></div><div style="font-size:14px;font-weight:800;margin-bottom:12px;letter-spacing:-.02em">Revenue Mix</div><div style="display:flex;height:28px;border-radius:8px;overflow:hidden;margin-bottom:10px;box-shadow:inset 0 1px 2px rgba(0,0,0,0.04)">\${segs.map(s=>\`<div style="width:\${s.p}%;background:\${s.c};opacity:.3;transition:all .3s var(--spring);cursor:pointer" onmouseover="this.style.opacity='.6';this.style.transform='scaleY(1.1)'" onmouseout="this.style.opacity='.3';this.style.transform='scaleY(1)'"></div>\`).join('')}</div><div style="display:flex;gap:18px;flex-wrap:wrap">\${segs.map(s=>\`<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--textSec)"><div style="width:8px;height:8px;border-radius:2px;background:\${s.c};opacity:.4"></div>\${s.n} \${s.p}%</div>\`).join('')}</div></div>
  </div>\`;
}

function renderPipeline(){
  const stages=[
    {name:"Lead Qualified",items:[{title:"Trader Joe's — CFO Dashboard",value:"$36K/yr",status:"New"},{title:"Sprouts — FP&A Suite",value:"$72K/yr",status:"Contacted"}],color:"var(--blue)"},
    {name:"Demo Scheduled",items:[{title:"Whole Foods — Enterprise",value:"$180K/yr",status:"Demo Mar 26"},{title:"Kroger — Regional Analytics",value:"$96K/yr",status:"Demo Mar 28"}],color:"var(--purple)"},
    {name:"Proposal Sent",items:[{title:"Costco — Full Suite",value:"$240K/yr",status:"Reviewing"}],color:"var(--amber)"},
    {name:"Negotiation",items:[{title:"Albertsons — FP&A",value:"$120K/yr",status:"Legal Review"}],color:"var(--green)"},
  ];
  return \`<div class="fade" style="margin-bottom:20px"><div class="section-title">Organization</div><h2 style="font-size:22px;font-weight:800;letter-spacing:-.03em">Deal Pipeline</h2></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">\${stages.map((s,si)=>\`<div class="fade fade-d\${si+1}"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span style="font-size:10px;font-weight:700;color:var(--textSec)">\${s.name}</span><span class="tag" style="background:var(--surfaceAlt);color:var(--textMuted);border:1px solid var(--border)">\${s.items.length}</span></div><div style="display:flex;flex-direction:column;gap:8px">\${s.items.map(i=>\`<div class="card" style="padding:16px 18px"><div class="card-accent" style="background:\${s.color}"></div><div style="font-size:11px;font-weight:700;margin-bottom:5px;color:var(--text)">\${i.title}</div><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;font-weight:800;font-family:var(--mono);color:var(--wf)">\${i.value}</span><span style="font-size:8px;color:var(--textMuted)">\${i.status}</span></div></div>\`).join('')}</div></div>\`).join('')}</div>\`;
}

function renderRefunds(){
  const refundData=[
    {id:"RF-001",vendor:"Regional Organics Co.",invoice:"INV-2024-0847",amount:14200,reason:"Quality Issue",detail:"Produce batch #4421 below spec — moisture damage in transit",requestedBy:"Maya Chen",date:"Mar 18",status:"pending_approval",priority:"high",approver:"Daniel Park"},
    {id:"RF-002",vendor:"Pacific Seafood Group",invoice:"INV-2024-0812",amount:8750,reason:"Overcharge",detail:"Duplicate line item on wild salmon order — confirmed by AP",requestedBy:"Tom Rivera",date:"Mar 15",status:"approved",priority:"medium",approver:"Daniel Park",approvedDate:"Mar 16"},
    {id:"RF-003",vendor:"Green Valley Dairy",invoice:"INV-2024-0901",amount:3200,reason:"Service Credit",detail:"Delivery SLA breach — 48hr delay on refrigerated goods",requestedBy:"Sarah Kim",date:"Mar 20",status:"processing",priority:"low",approver:"Rachel Torres",approvedDate:"Mar 21"},
    {id:"RF-004",vendor:"Artisan Bakery Network",invoice:"INV-2024-0776",amount:5100,reason:"Returns",detail:"Seasonal product pullback — gluten-free line underperformed",requestedBy:"James Liu",date:"Mar 12",status:"completed",priority:"medium",approver:"Maya Chen",approvedDate:"Mar 13",completedDate:"Mar 14"},
    {id:"RF-005",vendor:"National Beverage Dist.",invoice:"INV-2024-0923",amount:22400,reason:"Contract Dispute",detail:"Pricing discrepancy on Q1 volume commitment — under review by legal",requestedBy:"Daniel Park",date:"Mar 22",status:"escalated",priority:"critical",approver:"—"},
  ];
  const statusColor=s=>({pending_approval:'var(--amber)',approved:'var(--blue)',processing:'var(--purple)',completed:'var(--green)',escalated:'var(--red)'}[s]||'var(--textFaint)');
  const statusLabel=s=>({pending_approval:'Pending Approval',approved:'Approved',processing:'Processing',completed:'Completed',escalated:'Escalated'}[s]||s);
  const priorityColor=p=>({critical:'var(--red)',high:'var(--red)',medium:'var(--amber)',low:'var(--blue)'}[p]||'var(--textFaint)');
  const totalPending=refundData.filter(r=>r.status==='pending_approval').length;
  const totalAmount=refundData.reduce((a,r)=>a+r.amount,0);
  const completedAmount=refundData.filter(r=>r.status==='completed').reduce((a,r)=>a+r.amount,0);
  const openAmount=totalAmount-completedAmount;
  return \`<div class="fade" style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px"><div><div class="section-heading" style="display:flex;align-items:center;gap:6px">Treasury Operations</div><h2 style="font-size:22px;font-weight:800;letter-spacing:-.03em">Refund Pipeline</h2></div><div style="display:flex;gap:8px"><button class="btn btn-wf btn-sm">+ New Refund Request</button><button class="btn btn-outline btn-sm">Export to Sheets</button></div></div>

  <!-- Hero KPIs -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">
    <div class="card card-hero fade fade-d1" style="padding:20px">
      <div style="font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Total Open</div>
      <div class="kpi-hero" style="color:var(--wf)">$\${(openAmount/1000).toFixed(1)}K</div>
      <div style="font-size:9px;color:var(--textMuted);margin-top:4px">\${refundData.filter(r=>r.status!=='completed').length} active requests</div>
    </div>
    <div class="card card-primary fade fade-d2" style="padding:20px">
      <div style="font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Awaiting Approval</div>
      <div class="kpi-large" style="color:var(--amber)">\${totalPending}</div>
      <div style="font-size:9px;color:var(--amber);margin-top:4px">Needs CFO sign-off</div>
    </div>
    <div class="card card-primary fade fade-d3" style="padding:20px">
      <div style="font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Completed (MTD)</div>
      <div class="kpi-large" style="color:var(--green)">$\${(completedAmount/1000).toFixed(1)}K</div>
      <div style="font-size:9px;color:var(--green);margin-top:4px">\${refundData.filter(r=>r.status==='completed').length} resolved</div>
    </div>
    <div class="card card-support fade fade-d4" style="padding:20px">
      <div style="font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Avg Resolution</div>
      <div class="kpi-large" style="color:var(--text)">2.1d</div>
      <div style="font-size:9px;color:var(--green);margin-top:4px">Within SLA target</div>
    </div>
  </div>

  <!-- Refund Queue -->
  <div class="card fade fade-d2" style="padding:0;overflow:hidden;margin-bottom:16px">
    <div style="padding:18px 22px 14px;border-bottom:1px solid var(--borderSub);display:flex;justify-content:space-between;align-items:center">
      <div style="font-size:14px;font-weight:800">Active Refund Queue</div>
      <div style="display:flex;gap:6px">
        <span class="tag" style="background:var(--amberBg);color:var(--amber);border:1px solid var(--amberBorder);cursor:pointer">Pending</span>
        <span class="tag" style="background:var(--blueBg);color:var(--blue);border:1px solid var(--blueBorder);cursor:pointer">Approved</span>
        <span class="tag" style="background:var(--purpleBg);color:var(--purple);border:1px solid var(--purpleBorder);cursor:pointer">Processing</span>
        <span class="tag" style="background:var(--redBg);color:var(--red);border:1px solid var(--redBorder);cursor:pointer">Escalated</span>
        <span class="tag" style="background:var(--greenBg);color:var(--green);border:1px solid var(--greenBorder);cursor:pointer">Completed</span>
      </div>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="background:var(--surfaceAlt)">
            <th style="padding:10px 16px;text-align:left;font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.06em">ID</th>
            <th style="padding:10px 12px;text-align:left;font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.06em">Vendor / Invoice</th>
            <th style="padding:10px 12px;text-align:right;font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.06em">Amount</th>
            <th style="padding:10px 12px;text-align:left;font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.06em">Reason</th>
            <th style="padding:10px 12px;text-align:left;font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.06em">Requested</th>
            <th style="padding:10px 12px;text-align:left;font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.06em">Approver</th>
            <th style="padding:10px 12px;text-align:center;font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.06em">Priority</th>
            <th style="padding:10px 12px;text-align:center;font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.06em">Status</th>
            <th style="padding:10px 16px;text-align:center;font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.06em">Action</th>
          </tr>
        </thead>
        <tbody>
          \${refundData.map((r,ri)=>\`<tr style="border-bottom:1px solid var(--borderSub);transition:background .15s" onmouseover="this.style.background='var(--surfaceAlt)'" onmouseout="this.style.background='transparent'">
            <td style="padding:12px 16px;font-weight:700;font-family:var(--mono);font-size:10px;color:var(--wf)">\${r.id}</td>
            <td style="padding:12px 12px"><div style="font-weight:700;color:var(--text)">\${r.vendor}</div><div style="font-size:9px;color:var(--textMuted);margin-top:1px">\${r.invoice}</div></td>
            <td style="padding:12px 12px;text-align:right;font-weight:800;font-family:var(--mono);color:var(--text)">$\${r.amount.toLocaleString()}</td>
            <td style="padding:12px 12px"><div style="font-weight:600;color:var(--text)">\${r.reason}</div><div style="font-size:9px;color:var(--textMuted);margin-top:1px;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="\${r.detail}">\${r.detail}</div></td>
            <td style="padding:12px 12px"><div style="font-weight:600">\${r.requestedBy}</div><div style="font-size:9px;color:var(--textMuted)">\${r.date}</div></td>
            <td style="padding:12px 12px;font-weight:600;color:var(--textSec)">\${r.approver}</td>
            <td style="padding:12px 12px;text-align:center"><span class="tag" style="background:\${priorityColor(r.priority)}11;color:\${priorityColor(r.priority)};border:1px solid \${priorityColor(r.priority)}33;text-transform:uppercase;font-size:8px;font-weight:800">\${r.priority}</span></td>
            <td style="padding:12px 12px;text-align:center"><span class="tag" style="background:\${statusColor(r.status)}11;color:\${statusColor(r.status)};border:1px solid \${statusColor(r.status)}33;font-weight:700">\${statusLabel(r.status)}</span></td>
            <td style="padding:12px 16px;text-align:center">\${r.status==='pending_approval'?'<button class="btn btn-wf btn-sm" style="font-size:9px">Approve</button>':r.status==='escalated'?'<button class="btn btn-sm" style="font-size:9px;background:var(--redBg);color:var(--red);border:1px solid var(--redBorder)">Review</button>':'<button class="btn btn-outline btn-sm" style="font-size:9px">View</button>'}</td>
          </tr>\`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Bottom Row: Refund Reasons + Cash Impact + Policies -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
    <div class="card fade fade-d3" style="padding:22px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--purple),var(--blue))"></div>
      <div style="font-size:13px;font-weight:800;margin-bottom:16px">Refund Reasons (MTD)</div>
      \${[{label:'Quality Issue',pct:38,color:'var(--red)'},{label:'Overcharge / Billing',pct:24,color:'var(--amber)'},{label:'Service Credit',pct:18,color:'var(--blue)'},{label:'Returns',pct:12,color:'var(--purple)'},{label:'Contract Dispute',pct:8,color:'var(--cyan)'}].map(c=>\`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:10px;font-weight:600;color:var(--text)">\${c.label}</span><span style="font-size:10px;font-weight:800;font-family:var(--mono);color:\${c.color}">\${c.pct}%</span></div><div class="metric-bar"><div class="metric-fill" style="--fill:\${c.pct}%;width:\${c.pct}%;background:\${c.color}"></div></div></div>\`).join('')}
    </div>
    <div class="card fade fade-d4" style="padding:22px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--wf),var(--green))"></div>
      <div style="font-size:13px;font-weight:800;margin-bottom:16px">Cash Impact Timeline</div>
      \${[{period:'This Week',amount:'$14.2K',items:1,color:'var(--red)'},{period:'Next Week',amount:'$11.9K',items:2,color:'var(--amber)'},{period:'End of Month',amount:'$22.4K',items:1,color:'var(--blue)'},{period:'Completed (MTD)',amount:'$5.1K',items:1,color:'var(--green)'}].map(t=>\`<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--borderSub)"><div style="width:6px;height:6px;border-radius:50%;background:\${t.color};flex-shrink:0"></div><div style="flex:1"><div style="font-size:10px;font-weight:700;color:var(--text)">\${t.period}</div><div style="font-size:9px;color:var(--textMuted)">\${t.items} refund\${t.items>1?'s':''}</div></div><div style="font-size:13px;font-weight:800;font-family:var(--mono);color:\${t.color}">\${t.amount}</div></div>\`).join('')}
    </div>
    <div class="card fade fade-d5" style="padding:22px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--amber),var(--red))"></div>
      <div style="font-size:13px;font-weight:800;margin-bottom:16px">Refund Policies</div>
      \${[{rule:'Auto-approve under $5K',status:'Active',icon:'OK'},{rule:'CFO approval for $5K-$25K',status:'Active',icon:'!'},{rule:'Board approval above $25K',status:'Active',icon:'!!'},{rule:'Legal review for disputes',status:'Active',icon:'L'},{rule:'30-day processing SLA',status:'On Track',icon:'T'}].map(p=>\`<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--borderSub)"><div style="width:28px;height:28px;border-radius:6px;background:var(--surfaceAlt);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:var(--textMuted);flex-shrink:0">\${p.icon}</div><div style="flex:1;font-size:10px;font-weight:600;color:var(--text)">\${p.rule}</div><span class="tag" style="background:var(--greenBg);color:var(--green);border:1px solid var(--greenBorder);font-size:8px">\${p.status}</span></div>\`).join('')}
    </div>
  </div>\`;
}

function renderClose(){
  const totalPct=Math.round(closeSteps.reduce((a,s)=>a+s.pct,0)/closeSteps.length);
  return \`<div class="fade" style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px"><div><div class="section-title">Finance</div><h2 style="font-size:22px;font-weight:800;letter-spacing:-.03em">Month-End Close</h2></div><div style="display:flex;align-items:center;gap:12px">\${progressRing(totalPct,48,4)}<div><div style="font-size:10px;font-weight:700;color:var(--text)">Day 6 of 8</div><div style="font-size:9px;color:var(--textMuted)">Target: Mar 26 at 5:00 PM</div></div></div></div>
  <div style="display:grid;grid-template-columns:2fr 1fr;gap:14px">
    <div class="card fade fade-d1" style="padding:24px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--wf),var(--green))"></div>
      <div style="font-size:14px;font-weight:800;margin-bottom:18px">Close Checklist</div>
      \${closeSteps.map((s,i)=>\`<div class="close-step" style="animation:slideIn .3s var(--spring) \${i*.06}s both">
        <div class="close-dot \${s.status}">\${s.status==='done'?'✓':s.status==='active'?'●':i+1}</div>
        <div style="flex:1">
          <div style="font-size:11px;font-weight:600;color:\${s.status==='done'?'var(--textMuted)':'var(--text)'};\${s.status==='done'?'text-decoration:line-through;opacity:.6':''}">\${s.name}</div>
          \${s.status==='active'?\`<div style="display:flex;align-items:center;gap:8px;margin-top:4px"><div class="metric-bar" style="width:120px"><div class="metric-fill" style="--fill:\${s.pct}%;width:\${s.pct}%;background:var(--blue)"></div></div><span style="font-size:9px;font-weight:700;color:var(--blue)">\${s.pct}%</span></div>\`:''}
        </div>
        <span style="font-size:9px;color:var(--textMuted)">\${s.owner}</span>
        <span class="tag" style="background:\${s.status==='done'?'var(--greenBg)':s.status==='active'?'var(--blueBg)':'var(--surfaceAlt)'};color:\${s.status==='done'?'var(--green)':s.status==='active'?'var(--blue)':'var(--textFaint)'};border:1px solid \${s.status==='done'?'var(--greenBorder)':s.status==='active'?'var(--blueBorder)':'var(--border)'}">\${s.status==='done'?'Complete':s.status==='active'?'In Progress':'Pending'}</span>
      </div>\`).join('')}
    </div>
    <div>
      <div class="card fade fade-d2" style="padding:20px;margin-bottom:12px">
        <div style="font-size:13px;font-weight:800;margin-bottom:12px">Blockers</div>
        \${bottlenecks.map(b=>\`<div class="bottleneck" style="margin-bottom:8px">
          <div style="font-size:10px;font-weight:700;color:var(--text);margin-bottom:2px">\${b.title}</div>
          <div style="font-size:9px;color:var(--textSec)">\${b.desc}</div>
        </div>\`).join('')}
      </div>
      <div class="card fade fade-d3" style="padding:20px">
        <div style="font-size:13px;font-weight:800;margin-bottom:10px">Close Team</div>
        \${admins.slice(0,4).map(a=>\`<div style="display:flex;align-items:center;gap:8px;padding:5px 0"><img src="\${a.photo}" class="avatar" style="width:24px;height:24px"><div style="flex:1"><div style="font-size:10px;font-weight:600">\${a.name}</div></div><span style="font-size:8px;color:\${a.status==='online'?'var(--green)':'var(--textFaint)'};font-weight:600;text-transform:capitalize">\${a.status}</span></div>\`).join('')}
      </div>
    </div>
  </div>\`;
}

function renderApprovals(){
  return \`<div class="fade" style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px"><div><div class="section-title">Organization</div><h2 style="font-size:22px;font-weight:800;letter-spacing:-.03em">Approval Workflows</h2></div></div>
  <div style="display:grid;gap:14px">\${approvals.map((ap,ai)=>\`<div class="card fade fade-d\${ai+1}" style="padding:24px">
    <div class="card-accent" style="background:\${ai===0?'var(--wf)':ai===1?'var(--blue)':'var(--purple)'}"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
      <div><div style="font-size:15px;font-weight:800;letter-spacing:-.02em">\${ap.doc}</div><div style="font-size:10px;color:var(--textMuted);margin-top:2px">Stage \${ap.stage} of \${ap.total}</div></div>
      \${progressRing(Math.round(ap.stage/ap.total*100),42,3.5)}
    </div>
    <div style="display:flex;align-items:center;gap:0;margin-bottom:14px">
      \${ap.stages.map((st,si)=>\`<div style="display:flex;align-items:center;gap:0;flex:1">
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:0 0 auto">
          <div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;transition:all .3s var(--spring);\${si<ap.stage?'background:var(--wf);color:#fff;box-shadow:var(--shadow-wf)':si===ap.stage?'background:var(--amberBg);color:var(--amber);border:2px solid var(--amber);animation:glow 2s infinite':'background:var(--surfaceDeep);color:var(--textFaint)'}">\${si<ap.stage?'✓':si+1}</div>
          <div style="font-size:8px;font-weight:600;color:\${si<=ap.stage?'var(--text)':'var(--textFaint)'};text-align:center;max-width:80px">\${st}</div>
          \${ap.approvers[si]?\`<img src="\${ap.approvers[si].photo}" class="avatar" style="width:18px;height:18px;margin-top:2px">\`:''}
        </div>
        \${si<ap.stages.length-1?\`<div style="flex:1;height:2px;background:\${si<ap.stage?'var(--wf)':'var(--surfaceDeep)'};margin:0 6px;margin-bottom:28px;transition:background .5s var(--spring)"></div>\`:''}
      </div>\`).join('')}
    </div>
    <div style="display:flex;justify-content:flex-end;gap:6px">
      <button class="btn btn-outline btn-sm">View Document</button>
      \${ap.stage<ap.total?\`<button class="btn btn-wf btn-sm">Approve & Advance →</button>\`:''}
    </div>
  </div>\`).join('')}</div>\`;
}

function renderCelebrations(){
  const milestones=[
    {title:"Q1 Close Tracking Ahead of Schedule",desc:"The team is on track to close 1 day early — the fastest close in Whole Foods Finance history.",type:"milestone",icon:"M"},
    {title:"365 Brand Margin Record",desc:"Private label EBITDA hit 38.2%, surpassing the 36% target by 220bps. Great work Maya & Rachel!",type:"achievement",icon:"T"},
    {title:"AI Inventory Pilot Success",desc:"Midwest shrinkage reduced 22%. The pilot is approved for 200-store rollout in Q2.",type:"innovation",icon:"AI"},
    {title:"Welcome to the Team!",desc:"The entire Whole Foods Finance leadership team is now live on FinanceOS. Let's build something great together!",type:"welcome",icon:"W"},
  ];
  return \`<div class="fade" style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px"><div><div class="section-title">Team Hub</div><h2 style="font-size:22px;font-weight:800;letter-spacing:-.03em">Celebrations & Milestones</h2></div></div>

  <!-- Team Welcome Banner -->
  <div class="celebration fade" style="margin-bottom:20px;padding:24px 28px">
    <div style="display:flex;flex-direction:column;align-items:center;text-align:center;width:100%">
      <div class="avatar-stack" style="margin-bottom:14px;justify-content:center">\${admins.map(a=>\`<img src="\${a.photo}" class="avatar" style="width:42px;height:42px;border-width:3px;animation:popIn .5s var(--bounce) both">\`).join('')}</div>
      <div style="font-size:20px;font-weight:800;color:var(--text);margin-bottom:4px">Welcome to FinanceOS, Whole Foods Finance!</div>
      <div style="font-size:12px;color:var(--textSec);max-width:500px;line-height:1.6">Your digital workspace is live. \${admins.length} team members connected. Real-time collaboration, AI-powered insights, and streamlined workflows — all in one place.</div>
      <div style="display:flex;gap:8px;margin-top:14px">
        <button class="btn btn-wf" onclick="switchView('messages')">Say Hello to the Team</button>
        <button class="btn btn-outline" onclick="switchView('overview')">Explore Dashboard</button>
      </div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px">
    \${milestones.map((m,i)=>\`<div class="card fade fade-d\${i+1}" style="padding:22px">
      <div class="card-accent" style="background:\${m.type==='milestone'?'linear-gradient(90deg,var(--wf),var(--green))':m.type==='achievement'?'linear-gradient(90deg,var(--purple),var(--blue))':m.type==='innovation'?'linear-gradient(90deg,var(--blue),var(--cyan))':'linear-gradient(90deg,var(--amber),var(--wf))'}"></div>
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="width:44px;height:44px;border-radius:12px;background:var(--surfaceAlt);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;animation:float 3s ease-in-out \${i*.3}s infinite">\${m.icon}</div>
        <div>
          <div style="font-size:14px;font-weight:800;color:var(--text);margin-bottom:4px">\${m.title}</div>
          <div style="font-size:11px;color:var(--textSec);line-height:1.6">\${m.desc}</div>
        </div>
      </div>
    </div>\`).join('')}
  </div>\`;
}

function togglePanel(type){
  const p=document.getElementById('rightPanel');
  if(panelOpen===type){p.style.display='none';panelOpen=null;return;}
  panelOpen=type;p.style.display='block';
  if(type==='copilot')p.innerHTML=renderCopilotPanel();
  else if(type==='activity')p.innerHTML=renderActivityPanel();
}

function renderCopilotPanel(){
  return \`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div style="display:flex;align-items:center;gap:6px"><span style="font-size:14px;font-weight:800">AI Copilot</span><span class="tag" style="background:var(--purpleBg);color:var(--purple);border:1px solid var(--purpleBorder)">CLAUDE</span></div><button class="btn btn-ghost" onclick="togglePanel('copilot')" style="font-size:16px;color:var(--textMuted)">×</button></div>
  <p style="font-size:11px;color:var(--textMuted);margin-bottom:16px;line-height:1.5">Ask about Whole Foods financials, regional performance, category mix, supplier metrics, or scenario models.</p>
  \${['What drove same-store comp growth?','Private label vs national brand margins','Organic penetration by region','Shrinkage reduction forecast','Model 5% basket size increase','New store ROI by region'].map(q=>\`<button class="btn btn-outline btn-sm" style="width:100%;text-align:left;margin-bottom:5px;font-size:10px;transition:all .2s var(--spring)" onmouseover="this.style.transform='translateX(3px)'" onmouseout="this.style.transform='translateX(0)'">→ \${q}</button>\`).join('')}
  <div style="background:var(--surfaceAlt);border-radius:var(--r-md);padding:18px;margin:18px 0;border:1px solid var(--borderSub)">
    <div style="font-size:9px;font-weight:700;color:var(--blue);margin-bottom:6px;text-transform:uppercase;letter-spacing:.08em">You</div>
    <div style="font-size:11px;margin-bottom:14px;color:var(--text)">What drove same-store comp growth this quarter?</div>
    <div style="font-size:9px;font-weight:700;color:var(--purple);margin-bottom:6px;text-transform:uppercase;letter-spacing:.08em">Copilot</div>
    <div style="font-size:11px;color:var(--textSec);line-height:1.7">Same-store comps <strong style="color:var(--wf)">+4.8%</strong> driven by:<br><br><strong>1.</strong> Organic produce: 62% of basket growth, +8.2% category<br><strong>2.</strong> Private label (365): 38.2% margin, expanded 15% shelf share<br><strong>3.</strong> Price investments: traffic +3.1%, conversion +1.4pp<br><strong>4.</strong> AI inventory: Midwest pilot cut waste 22%<br><br>Midwest strongest at +8.8% reflecting AI inventory pilot. This is the <strong>14th consecutive quarter</strong> of positive comps.<br><br><span style="font-size:9px;color:var(--textFaint)">Confidence: High · Sources: Store-Level P&L, Category Analytics, Inventory System</span></div>
  </div>

  <!-- Data Sources -->
  <div style="padding:12px 14px;border-radius:var(--r-sm);background:var(--surfaceAlt);border:1px solid var(--borderSub);margin-bottom:14px">
    <div style="font-size:9px;font-weight:700;color:var(--textMuted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Connected Sources</div>
    <div style="font-size:10px;color:var(--textSec);line-height:1.5">Copilot cross-references <strong>store-level P&L</strong>, <strong>supply chain data</strong>, <strong>category analytics</strong>, and <strong>inventory systems</strong> in real-time across all 531 locations.</div>
  </div>

  <div style="display:flex;gap:5px;position:sticky;bottom:0;background:var(--surface);padding:10px 0"><input placeholder="Ask about financials..." style="flex:1;padding:10px 14px;border-radius:var(--r-sm);border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:11px;font-family:var(--sans);outline:none;transition:all .25s var(--spring)" onfocus="this.style.borderColor='var(--wf)';this.style.boxShadow='0 0 0 3px rgba(0,103,75,0.08)'" onblur="this.style.borderColor='var(--border)';this.style.boxShadow='none'"><button class="btn btn-wf btn-sm">→</button></div>\`;
}

function renderActivityPanel(){
  return \`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div style="display:flex;align-items:center;gap:6px"><span style="font-size:14px;font-weight:800">Live Activity</span><span style="display:inline-flex;align-items:center;gap:4px;font-size:9px;color:var(--green);font-weight:700"><span style="width:5px;height:5px;border-radius:50%;background:var(--green);animation:pulse 2s infinite"></span> Live</span></div><button class="btn btn-ghost" onclick="togglePanel('activity')" style="font-size:16px;color:var(--textMuted)">×</button></div>

  <!-- Who's Online -->
  <div style="padding:12px 14px;border-radius:var(--r-md);background:var(--surfaceAlt);border:1px solid var(--borderSub);margin-bottom:16px">
    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textFaint);margin-bottom:8px">\${admins.filter(a=>a.status==='online').length} Team Members Online</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">\${admins.filter(a=>a.status==='online').map(a=>\`<div style="display:flex;align-items:center;gap:5px;padding:4px 8px;border-radius:20px;background:var(--surface);border:1px solid var(--borderSub)"><img src="\${a.photo}" class="avatar" style="width:18px;height:18px"><span style="font-size:9px;font-weight:600">\${a.name.split(' ')[0]}</span></div>\`).join('')}</div>
  </div>

  <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textFaint);margin-bottom:10px">Activity Feed</div>
  \${activityFeed.map((a,i)=>\`<div style="display:flex;gap:10px;padding:10px 0;\${i<activityFeed.length-1?'border-bottom:1px solid var(--borderSub)':''};animation:slideRight .3s var(--spring) \${i*.05}s both">
    \${a.user?\`<img src="\${a.user.photo}" class="avatar" style="width:26px;height:26px;flex-shrink:0">\`:\`<div style="width:26px;height:26px;border-radius:50%;background:var(--purpleBg);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0">\${a.icon}</div>\`}
    <div style="flex:1;min-width:0">
      <div style="font-size:10px;color:var(--textSec);line-height:1.5"><strong style="color:var(--text)">\${a.user?a.user.name.split(' ')[0]:'AI Copilot'}</strong> \${a.text}</div>
      <div style="font-size:8px;color:var(--textFaint);margin-top:2px">\${a.time}</div>
    </div>
    <span class="tag" style="font-size:7px;flex-shrink:0;\${a.type==='celebration'?'background:var(--greenBg);color:var(--green);border:1px solid var(--greenBorder)':a.type==='approval'?'background:var(--wf-pale);color:var(--wf);border:1px solid var(--wf-pale)':a.type==='milestone'?'background:var(--purpleBg);color:var(--purple);border:1px solid var(--purpleBorder)':a.type==='join'?'background:var(--blueBg);color:var(--blue);border:1px solid var(--blueBorder)':'display:none'}">\${a.type==='celebration'?'DONE':a.type==='approval'?'OK':a.type==='milestone'?'HIT':a.type==='join'?'NEW':''}</span>
  </div>\`).join('')}\`;
}

renderAdminTabs();renderSidebar();renderContent();`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
/* ═══════════════════════════════════════════════════
   WHOLE FOODS MARKET — CFO DASHBOARD v3.0
   Corporate Light Theme · Social Team Experience
   Competitive + Personalized + Productivity Edition
   ═══════════════════════════════════════════════════ */

:root{
  /* Whole Foods Authentic Brand */
  --wf:#00674b;--wf-dark:#004d38;--wf-deep:#003a2a;--wf-light:#00845f;--wf-pale:#e8f5f0;--wf-tint:#f0faf6;
  --wf-accent:#006F46;--wf-glow:rgba(0,103,75,0.08);

  /* Light Corporate Palette */
  --bg:#f8f9fb;--surface:#ffffff;--surfaceAlt:#f3f5f8;--surfaceDeep:#eceef3;
  --border:#e2e5eb;--borderSub:#edf0f4;--borderHover:#d0d4dc;
  --text:#0f1729;--textSec:#414d63;--textMuted:#6b7a90;--textFaint:#a0aab8;

  /* Semantic Colors */
  --green:#047857;--greenBg:#ecfdf5;--greenBorder:#a7f3d0;
  --red:#b91c1c;--redBg:#fef2f2;--redBorder:#fecaca;
  --amber:#92400e;--amberBg:#fffbeb;--amberBorder:#fde68a;
  --blue:#1d4ed8;--blueBg:#eff6ff;--blueBorder:#bfdbfe;
  --purple:#6d28d9;--purpleBg:#f5f3ff;--purpleBorder:#ddd6fe;
  --cyan:#0e7490;--cyanBg:#ecfeff;

  /* Type */
  --sans:'Inter',system-ui,-apple-system,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,monospace;

  /* Radius */
  --r:10px;--r-sm:6px;--r-md:12px;--r-lg:16px;--r-xl:20px;

  /* Shadows — corporate premium */
  --shadow-xs:0 1px 2px rgba(15,23,41,0.03);
  --shadow-sm:0 1px 3px rgba(15,23,41,0.04),0 1px 2px rgba(15,23,41,0.02);
  --shadow-md:0 4px 12px rgba(15,23,41,0.05),0 1px 3px rgba(15,23,41,0.03);
  --shadow-lg:0 8px 24px rgba(15,23,41,0.06),0 2px 6px rgba(15,23,41,0.03);
  --shadow-xl:0 16px 48px rgba(15,23,41,0.08),0 4px 12px rgba(15,23,41,0.04);
  --shadow-card:0 1px 3px rgba(15,23,41,0.04),0 0 0 1px rgba(0,0,0,0.03);
  --shadow-card-hover:0 8px 24px rgba(0,103,75,0.06),0 2px 6px rgba(15,23,41,0.04),0 0 0 1px rgba(0,103,75,0.08);
  --shadow-wf:0 4px 16px rgba(0,103,75,0.12),0 0 0 1px rgba(0,103,75,0.08);

  /* Motion */
  --ease:cubic-bezier(0.25,0.46,0.45,0.94);
  --spring:cubic-bezier(0.22,1,0.36,1);
  --bounce:cubic-bezier(0.34,1.56,0.64,1);
  --plax:cubic-bezier(0,0,0.3642,1);
}

*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow:hidden;height:100vh;font-feature-settings:"cv01","ss01"}
::selection{background:var(--wf);color:#fff}

/* ═══ PERFORMANCE LAYER ═══ */
.card,.btn,.sidebar-btn,.avatar,.admin-tab,.task-row,.close-step{will-change:transform;backface-visibility:hidden;-webkit-backface-visibility:hidden}
#content{overflow-y:auto;-webkit-overflow-scrolling:touch;transform:translateZ(0);contain:strict}
.card{contain:layout style paint}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}}

/* ═══ ANIMATIONS ═══ */
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideRight{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes breathe{0%,100%{opacity:.5}50%{opacity:.75}}
@keyframes countUp{from{opacity:0;transform:translateY(8px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes popIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
@keyframes progressFill{from{width:0}to{width:var(--fill)}}
@keyframes celebrate{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes confetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-30px) rotate(720deg);opacity:0}}
@keyframes float{0%,100%{transform:translateY(0) translateZ(0)}50%{transform:translateY(-3px) translateZ(0)}}
@keyframes typeWriter{from{width:0}to{width:100%}}
@keyframes blinkCaret{0%,50%{border-right-color:var(--wf)}51%,100%{border-right-color:transparent}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px);max-height:0}to{opacity:1;transform:translateY(0);max-height:500px}}
@keyframes glow{0%,100%{opacity:.85}50%{opacity:1}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes ripple{0%{transform:scale(0);opacity:1}100%{transform:scale(4);opacity:0}}

.fade{animation:fadeUp .5s var(--spring) both}
.fade-d1{animation-delay:.04s}.fade-d2{animation-delay:.08s}.fade-d3{animation-delay:.12s}
.fade-d4{animation-delay:.16s}.fade-d5{animation-delay:.2s}.fade-d6{animation-delay:.24s}
.fade-d7{animation-delay:.28s}.fade-d8{animation-delay:.32s}

/* ═══ CARDS — Tiered Hierarchy ═══ */
.card{
  background:var(--surface);
  border-radius:var(--r-lg);
  border:1px solid var(--border);
  box-shadow:var(--shadow-card);
  position:relative;overflow:hidden;
  transition:transform .25s var(--spring),border-color .25s var(--ease);
}
.card:hover{
  border-color:rgba(0,103,75,0.12);
  transform:translateY(-2px) translateZ(0);
}
/* Tier 1: Hero cards — dominant, large, attention-grabbing */
.card-hero{box-shadow:var(--shadow-lg);border:1px solid rgba(0,103,75,0.08)}
.card-hero:hover{transform:translateY(-3px) translateZ(0)}
/* Tier 2: Primary cards — important but secondary to hero */
.card-primary{box-shadow:var(--shadow-md)}
.card-primary:hover{transform:translateY(-2px) translateZ(0)}
/* Tier 3: Supporting cards — subtle, contextual */
.card-support{box-shadow:var(--shadow-sm);border-color:var(--borderSub)}
.card-support:hover{transform:translateY(-1px) translateZ(0)}
/* Interactive card — shows it's clickable */
.card-interactive{cursor:pointer}
.card-interactive:hover .card-arrow{transform:translateX(3px);opacity:1}
.card-interactive:active{transform:translateY(0) scale(0.995)}
.card-arrow{display:inline-block;opacity:0.4;transition:all .25s var(--spring);font-size:11px}
/* Expanded state for drill-down */
.card-expand{max-height:0;overflow:hidden;opacity:0;transition:all .4s var(--spring)}
.card-expand.open{max-height:400px;opacity:1;padding-top:12px;margin-top:12px;border-top:1px solid var(--borderSub)}
.card-accent{position:absolute;top:0;left:0;right:0;height:3px;transition:height .3s var(--spring)}
.card-hero .card-accent{height:4px}
.card:hover .card-accent{height:4px}
.card-hero:hover .card-accent{height:5px}

/* ═══ TAGS ═══ */
.tag{display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border-radius:5px;font-size:9px;font-weight:700;letter-spacing:.04em;transition:all .2s var(--ease)}

/* ═══ BUTTONS — Enhanced ═══ */
.btn{
  font-family:var(--sans);cursor:pointer;border:none;border-radius:var(--r-sm);
  font-weight:700;transition:all .25s var(--spring);display:inline-flex;align-items:center;
  gap:5px;font-size:11px;padding:7px 14px;white-space:nowrap;position:relative;overflow:hidden;
}
.btn::after{content:none}
.btn-wf{
  background:linear-gradient(135deg,var(--wf),var(--wf-dark));color:#fff;
  box-shadow:0 2px 8px rgba(0,103,75,0.2),0 1px 2px rgba(0,103,75,0.1);
}
.btn-wf:hover{background:linear-gradient(135deg,var(--wf-dark),var(--wf-deep));box-shadow:0 4px 16px rgba(0,103,75,0.25);transform:translateY(-1px)}
.btn-outline{background:var(--surface);border:1px solid var(--border);color:var(--textSec)}
.btn-outline:hover{border-color:var(--wf);color:var(--wf);background:var(--wf-tint);transform:translateY(-1px)}
.btn-ghost{background:transparent;border:none;color:var(--textMuted);padding:5px 8px}
.btn-ghost:hover{color:var(--wf);background:var(--wf-tint)}
.btn-sm{font-size:10px;padding:5px 10px;border-radius:5px}

/* ═══ AVATAR — Enhanced with status ring ═══ */
.avatar{border-radius:50%;object-fit:cover;border:2px solid var(--surface);box-shadow:0 0 0 1px var(--border);transition:all .25s var(--spring)}
.avatar:hover{box-shadow:0 0 0 2px var(--wf),0 4px 12px rgba(0,103,75,0.1);transform:scale(1.08)}
.avatar-stack{display:flex}.avatar-stack .avatar{margin-left:-6px;transition:all .2s var(--bounce)}.avatar-stack .avatar:hover{transform:translateY(-3px) scale(1.1);z-index:10}

/* ═══ SIDEBAR ═══ */
.sidebar-btn{
  display:flex;align-items:center;gap:9px;padding:8px 12px;border-radius:var(--r-sm);
  font-size:11px;font-weight:500;color:var(--textSec);cursor:pointer;
  transition:all .2s var(--spring);border:none;background:none;width:100%;
  text-align:left;font-family:var(--sans);letter-spacing:-.01em;position:relative;
}
.sidebar-btn:hover{background:var(--surfaceAlt);color:var(--text);transform:translateX(2px)}
.sidebar-btn.active{background:var(--wf-pale);color:var(--wf);font-weight:700;box-shadow:inset 3px 0 0 var(--wf)}

/* ═══ PROGRESS RING ═══ */
.progress-ring{position:relative;display:inline-flex;align-items:center;justify-content:center}
.progress-ring svg{transform:rotate(-90deg)}
.progress-ring circle{fill:none;stroke-linecap:round;transition:stroke-dashoffset .8s var(--spring)}

/* ═══ CLOSE TRACKER ═══ */
.close-step{display:flex;align-items:center;gap:10px;padding:8px 0;position:relative}
.close-step::before{content:'';position:absolute;left:11px;top:30px;bottom:-8px;width:2px;background:var(--borderSub)}
.close-step:last-child::before{display:none}
.close-dot{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0;transition:all .3s var(--spring);z-index:1}
.close-dot.done{background:var(--wf);color:#fff;box-shadow:0 2px 8px rgba(0,103,75,0.2)}
.close-dot.active{background:var(--blueBg);color:var(--blue);border:2px solid var(--blue);animation:glow 2s infinite}
.close-dot.pending{background:var(--surfaceDeep);color:var(--textFaint)}

/* ═══ UTILITIES ═══ */
.metric-bar{height:5px;background:var(--surfaceDeep);border-radius:3px;overflow:hidden}
.metric-fill{height:100%;border-radius:3px;animation:progressFill .8s var(--spring) both}
.admin-tab{
  padding:0 16px;height:44px;display:flex;align-items:center;font-size:11px;font-weight:600;
  color:var(--textMuted);cursor:pointer;border-bottom:2.5px solid transparent;
  transition:all .2s var(--spring);background:none;border-top:none;border-left:none;
  border-right:none;font-family:var(--sans);gap:6px;letter-spacing:-.01em;position:relative;
}
.admin-tab:hover{color:var(--text);background:var(--surfaceAlt)}
.admin-tab.active{color:var(--wf);border-bottom-color:var(--wf);font-weight:700;background:var(--wf-tint)}
.kpi-value{font-size:22px;font-weight:800;font-family:var(--mono);letter-spacing:-.04em;line-height:1;color:var(--text)}
.kpi-hero{font-size:32px;font-weight:900;font-family:var(--mono);letter-spacing:-.05em;line-height:1;color:var(--text)}
.kpi-large{font-size:26px;font-weight:800;font-family:var(--mono);letter-spacing:-.04em;line-height:1}
/* Interactive data point — hover to reveal detail */
.data-point{position:relative;cursor:pointer;display:inline-block}
.data-point .data-detail{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%) translateY(6px);background:var(--text);color:#fff;font-size:9px;font-weight:600;padding:6px 12px;border-radius:6px;white-space:nowrap;opacity:0;pointer-events:none;transition:all .2s var(--spring);z-index:50;box-shadow:var(--shadow-lg)}
.data-point .data-detail::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:var(--text)}
.data-point:hover .data-detail{opacity:1;transform:translateX(-50%) translateY(0)}
.section-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--textFaint);margin-bottom:10px}
.section-heading{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--wf);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.section-heading::before{content:'';width:3px;height:14px;border-radius:2px;background:var(--wf);flex-shrink:0}
/* Focus ring for interactive elements */
.focus-ring:focus-visible{outline:2px solid var(--wf);outline-offset:2px;border-radius:var(--r-sm)}
.msg-row{display:flex;gap:10px;padding:12px 0;align-items:flex-start;animation:fadeUp .3s var(--spring) both}
.msg-row+.msg-row{border-top:1px solid var(--borderSub)}
.task-row{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--r-sm);transition:all .2s var(--spring)}
.task-row:hover{background:var(--wf-tint);transform:translateX(3px)}
.status-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;transition:transform .2s var(--bounce)}
.task-row:hover .status-dot{transform:scale(1.3)}

/* ═══ BOTTLENECK ALERT ═══ */
.bottleneck{border-left:3px solid var(--amber);background:var(--amberBg);border-radius:0 var(--r-sm) var(--r-sm) 0;padding:10px 14px;margin-bottom:8px;animation:slideIn .4s var(--spring) both}
.bottleneck-critical{border-left-color:var(--red);background:var(--redBg)}

/* ═══ APPROVAL CHAIN ═══ */
.approval-step{display:flex;align-items:center;gap:8px;padding:6px 0}
.approval-line{width:20px;height:2px;background:var(--borderSub)}
.approval-line.done{background:var(--wf)}

/* ═══ CELEBRATION BANNER ═══ */
.celebration{background:linear-gradient(135deg,var(--wf-tint),var(--greenBg));border:1px solid var(--greenBorder);border-radius:var(--r-md);padding:16px 20px;display:flex;align-items:center;gap:14px;animation:celebrate .6s var(--bounce) both;position:relative;overflow:hidden}
.celebration::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(0,103,75,0.02),transparent);background-size:200% 100%}
.confetti-particle{position:absolute;width:6px;height:6px;border-radius:1px;animation:confetti 1.5s var(--ease) forwards}

/* ═══ TYPING INDICATOR ═══ */
.typing-dots{display:inline-flex;gap:3px;align-items:center}
.typing-dots span{width:5px;height:5px;border-radius:50%;background:var(--textMuted);animation:breathe 1.4s infinite}
.typing-dots span:nth-child(2){animation-delay:.2s}
.typing-dots span:nth-child(3){animation-delay:.4s}

/* ═══ SCROLLBAR ═══ */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--surfaceDeep);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:var(--borderHover)}

/* ═══ iOS OPTIMIZATION ═══ */
@supports(padding:env(safe-area-inset-top)){
  body{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
}
/* Touch targets — 44px minimum per Apple HIG */
@media(pointer:coarse){
  .btn{min-height:44px;min-width:44px;padding:10px 16px;font-size:13px}
  .btn-sm{min-height:36px;min-width:36px;padding:8px 12px;font-size:11px}
  .sidebar-btn{min-height:44px;padding:10px 12px;font-size:12px}
  .admin-tab{min-height:48px;padding:0 18px;font-size:12px}
  .tag{padding:5px 10px;font-size:10px}
  .close-dot{width:28px;height:28px;font-size:11px}
  .avatar:hover{transform:none;box-shadow:0 0 0 1px var(--border)}
  .card:hover{transform:none}
  .card-hero:hover,.card-primary:hover,.card-support:hover{transform:none}
  .task-row:hover{transform:none}
  .sidebar-btn:hover{transform:none}
  /* Disable hover effects on touch — use active instead */
  .card:active{transform:scale(0.98);transition:transform .1s}
  .btn:active{transform:scale(0.95);transition:transform .1s}
  .sidebar-btn:active{background:var(--surfaceAlt);transform:none}
}
/* iOS rubber-band scroll fix */
@supports(-webkit-touch-callout:none){
  #content{overscroll-behavior-y:contain}
  body{overscroll-behavior:none;-webkit-tap-highlight-color:transparent}
}

/* ═══ WINDOWS OPTIMIZATION ═══ */
/* Windows high-DPI / scaling — crisp text and borders */
@media(-ms-high-contrast:none),(-ms-high-contrast:active){
  *{-webkit-font-smoothing:auto;text-rendering:optimizeLegibility}
}
@media(resolution >= 1.5dppx){
  .card{border-width:0.5px}
  .divider{height:0.5px}
}
/* Windows scrollbar — thin but visible */
@supports(scrollbar-width:thin){
  #content,#rightPanel{scrollbar-width:thin;scrollbar-color:var(--surfaceDeep) transparent}
  .sidebar-scroll{scrollbar-width:thin;scrollbar-color:var(--surfaceDeep) transparent}
}
/* Pointer precision — fine pointer (mouse) gets tighter interactions */
@media(pointer:fine){
  .btn{transition:all .15s var(--spring)}
  .sidebar-btn{transition:all .15s var(--spring)}
  .card{transition:transform .2s var(--spring),border-color .2s var(--ease)}
}

/* ═══ RESPONSIVE BREAKPOINTS ═══ */
/* Sidebar ID for JS toggle */
#sidebarWrap{transition:all .3s var(--spring)}
#mobileMenuBtn{display:none}
#mobileOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:90;opacity:0;transition:opacity .25s}
#mobileOverlay.open{display:block;opacity:1}

/* Tablet — collapse right panel, shrink sidebar */
@media(max-width:1024px){
  #rightPanel{display:none !important}
  #sidebarWrap{width:180px}
  #content{padding:18px 20px !important}
}
/* Mobile — hide sidebar, show hamburger, stack grids */
@media(max-width:768px){
  #sidebarWrap{position:fixed;left:-260px;top:0;bottom:0;width:250px;z-index:100;box-shadow:var(--shadow-xl);transition:left .3s var(--spring)}
  #sidebarWrap.open{left:0}
  #mobileMenuBtn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:var(--r-sm);background:var(--surfaceAlt);border:1px solid var(--border);cursor:pointer;font-size:16px;color:var(--text);flex-shrink:0}
  #content{padding:16px 14px !important}
  .kpi-hero{font-size:24px !important}
  .kpi-large{font-size:20px !important}
  .kpi-value{font-size:18px !important}
  /* Stack all grids to single column on mobile */
  #content [style*="grid-template-columns:repeat(3"]{grid-template-columns:1fr !important}
  #content [style*="grid-template-columns:repeat(4"]{grid-template-columns:1fr 1fr !important}
  #content [style*="grid-template-columns:1fr 1fr 1fr"]{grid-template-columns:1fr !important}
  #content [style*="grid-template-columns:1fr 1.4fr 1fr"]{grid-template-columns:1fr !important}
  #content [style*="grid-template-columns:1.2fr 1fr 1fr"]{grid-template-columns:1fr !important}
  #content [style*="grid-template-columns:2fr 1fr"]{grid-template-columns:1fr !important}
  #content [style*="grid-template-columns:1fr 1fr;"]{grid-template-columns:1fr !important}
  /* Refund table horizontal scroll */
  #content table{font-size:10px}
  /* Header adjustments */
  .header-logo-wrap{max-width:160px;overflow:hidden}
}
/* Small phone */
@media(max-width:420px){
  #content{padding:12px 10px !important}
  #content [style*="grid-template-columns:repeat(4"]{grid-template-columns:1fr !important}
  .btn-sm{font-size:9px;padding:6px 8px;min-height:32px}
}

/* Premium divider */
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);margin:0 16px}

/* ═══ TOOLTIP ═══ */
.tooltip{position:relative}
.tooltip::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%) translateY(4px);background:var(--text);color:#fff;font-size:9px;font-weight:600;padding:4px 10px;border-radius:5px;white-space:nowrap;opacity:0;pointer-events:none;transition:all .2s var(--spring)}
.tooltip:hover::after{opacity:1;transform:translateX(-50%) translateY(0)}

/* ═══ LIVE ACTIVITY INDICATOR ═══ */
.live-badge{position:relative}
.live-badge::after{content:'';position:absolute;top:-1px;right:-1px;width:8px;height:8px;border-radius:50%;background:var(--green);border:2px solid var(--surface);animation:pulse 2s infinite}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- ═══ EXECUTIVE BRAND BAR ═══ -->
<div style="background:linear-gradient(135deg,var(--wf),var(--wf-dark));height:48px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><circle cx=%2230%22 cy=%2230%22 r=%221%22 fill=%22white%22 fill-opacity=%220.03%22/></svg>') repeat"></div>
  <div style="display:flex;align-items:center;gap:16px;position:relative">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Whole_Foods_Market_201x_logo.svg/320px-Whole_Foods_Market_201x_logo.svg.png" alt="Whole Foods Market" style="height:22px;filter:brightness(10)" crossorigin="anonymous" onerror="this.outerHTML='<span style=&quot;color:#fff;font-size:15px;font-weight:800;letter-spacing:-.02em&quot;>whole foods market</span>'">
    <div style="width:1px;height:18px;background:rgba(255,255,255,.15)"></div>
    <span style="font-size:8px;font-weight:700;color:rgba(255,255,255,.45);letter-spacing:.14em;text-transform:uppercase">An Amazon Company</span>
    <span style="font-size:7px;padding:3px 10px;border-radius:4px;background:rgba(255,255,255,.12);color:rgba(255,255,255,.85);font-weight:800;letter-spacing:.06em;text-transform:uppercase;backdrop-filter:blur(8px)">Enterprise</span>
  </div>
  <div style="display:flex;align-items:center;gap:18px;position:relative">
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:9px;color:rgba(255,255,255,.35);font-family:var(--mono)">NASDAQ: AMZN</span>
      <span style="font-size:10px;font-weight:800;color:rgba(255,255,255,.85);font-family:var(--mono)">$198.42</span>
      <span style="font-size:9px;color:#6ee7b7;font-weight:700">+1.24%</span>
    </div>
    <div style="width:1px;height:14px;background:rgba(255,255,255,.1)"></div>
    <div style="display:flex;align-items:center;gap:6px">
      <div style="width:5px;height:5px;border-radius:50%;background:#6ee7b7;animation:pulse 2.5s ease infinite"></div>
      <span style="font-size:9px;color:rgba(255,255,255,.4)">Live &middot; Mar 24, 2026</span>
    </div>
    <div style="width:1px;height:14px;background:rgba(255,255,255,.1)"></div>
    <div style="display:flex;align-items:center;gap:6px">
      <div class="avatar-stack" style="margin-right:-4px">
        <div style="width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,.2);border:1.5px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;font-size:7px;color:#fff;font-weight:700">D</div>
        <div style="width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,.2);border:1.5px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;font-size:7px;color:#fff;font-weight:700;margin-left:-5px">R</div>
        <div style="width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,.2);border:1.5px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;font-size:7px;color:#fff;font-weight:700;margin-left:-5px">M</div>
      </div>
      <span style="font-size:9px;color:rgba(255,255,255,.5)">4 online</span>
    </div>
  </div>
</div>

<!-- ═══ NAV TABS ═══ -->
<div style="background:var(--surface);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;padding:0 24px;position:sticky;top:0;z-index:100;box-shadow:var(--shadow-xs)">
  <div style="display:flex;align-items:center;gap:0">
    <button id="mobileMenuBtn" onclick="toggleMobileSidebar()" aria-label="Menu">&#9776;</button>
    <div class="header-logo-wrap" style="display:flex;align-items:center;gap:8px;padding:0 20px 0 0;margin-right:12px;border-right:1px solid var(--border);height:44px">
      <div style="width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#1d4ed8,#6d28d9);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(29,78,216,0.15)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="3" height="20" rx="1.5" fill="white" opacity=".9"/><rect x="3" y="2" width="16" height="3" rx="1.5" fill="white" opacity=".9"/><rect x="3" y="9.5" width="11" height="2.5" rx="1" fill="white" opacity=".6"/><rect x="14" y="14" width="2.5" height="8" rx="1" fill="white" opacity=".35"/><rect x="18" y="10" width="2.5" height="12" rx="1" fill="white" opacity=".5"/></svg>
      </div>
      <span style="font-size:12px;font-weight:800;letter-spacing:-.02em;color:var(--text)">FinanceOS</span>
    </div>
    <div id="adminTabs" style="display:flex;height:44px"></div>
  </div>
  <div style="display:flex;align-items:center;gap:5px">
    <button class="btn btn-outline btn-sm" onclick="togglePanel('copilot')"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--purple);margin-right:2px;animation:breathe 2s infinite"></span> AI Copilot</button>
    <button class="btn btn-outline btn-sm" onclick="togglePanel('activity')"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--green);margin-right:2px;animation:pulse 2s infinite"></span> Activity</button>
    <button class="btn btn-outline btn-sm">Export</button>
    <button class="btn btn-outline btn-sm" style="position:relative">Notifications<span style="position:absolute;top:1px;right:1px;width:6px;height:6px;border-radius:50%;background:var(--red);border:1.5px solid var(--surface)"></span></button>
    <button class="btn btn-wf btn-sm">Share with Board</button>
  </div>
</div>

<div style="display:flex;height:calc(100vh - 92px)">

<!-- ═══ MOBILE OVERLAY ═══ -->
<div id="mobileOverlay" onclick="toggleMobileSidebar()"></div>

<!-- ═══ SIDEBAR ═══ -->
<div id="sidebarWrap" style="width:210px;border-right:1px solid var(--border);background:var(--surface);padding:14px 8px;flex-shrink:0;overflow-y:auto;display:flex;flex-direction:column">
  <div style="padding:0 12px;margin-bottom:4px" class="section-title">Finance</div>
  <div id="sidebarFinance"></div>
  <div class="divider" style="margin:10px 6px"></div>
  <div style="padding:0 12px;margin-bottom:4px" class="section-title">Organization</div>
  <div id="sidebarOrg"></div>
  <div class="divider" style="margin:10px 6px"></div>
  <div style="padding:0 12px;margin-bottom:4px" class="section-title">Team Online</div>
  <div id="teamSidebar" style="padding:0 4px"></div>
  <div style="flex:1"></div>

  <!-- Sidebar Close Tracker Mini -->
  <div style="padding:10px 12px;border-top:1px solid var(--borderSub);margin-top:8px">
    <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--textFaint);margin-bottom:8px">Q1 Close Progress</div>
    <div style="position:relative;height:6px;background:var(--surfaceDeep);border-radius:3px;overflow:hidden;margin-bottom:4px">
      <div style="height:100%;width:78%;background:linear-gradient(90deg,var(--wf),var(--wf-light));border-radius:3px;animation:progressFill 1.2s var(--spring) .5s both;--fill:78%"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:8px;color:var(--textMuted)"><span>Day 6 of 8</span><span style="font-weight:700;color:var(--wf)">78%</span></div>
  </div>

  <div style="padding:10px;border-top:1px solid var(--borderSub)">
    <div style="display:flex;align-items:center;gap:8px;padding:6px;border-radius:var(--r-sm);transition:background .2s" onmouseover="this.style.background='var(--surfaceAlt)'" onmouseout="this.style.background='transparent'">
      <div style="position:relative">
        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&q=80&fit=crop&crop=face" class="avatar" style="width:30px;height:30px">
        <div style="position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;border-radius:50%;background:var(--green);border:2px solid var(--surface)"></div>
      </div>
      <div><div style="font-size:11px;font-weight:700;color:var(--text)">Daniel Park</div><div style="font-size:9px;color:var(--textMuted)">Chief Financial Officer</div></div>
    </div>
  </div>
</div>

<!-- ═══ CONTENT ═══ -->
<div style="flex:1;overflow-y:auto;padding:24px 28px;background:var(--bg)" id="content"></div>

<!-- ═══ RIGHT PANEL ═══ -->
<div id="rightPanel" style="display:none;width:380px;border-left:1px solid var(--border);background:var(--surface);flex-shrink:0;overflow-y:auto;padding:20px"></div>
</div>


` }} />
    </>
  );
}
