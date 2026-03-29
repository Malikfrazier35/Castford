'use client';

import { useEffect, useRef } from 'react';

export default function V3DemoCocacolaProPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ══════════════════════════════════════
// DATA LAYER
// ══════════════════════════════════════
const admins=[
  {id:"cfo",name:"James Mitchell",role:"Chief Financial Officer",shortRole:"CFO",photo:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80&fit=crop&crop=face",status:"online",dept:"Executive",focus:"P&L, FCF, EPS",perms:["Full Access","Board Reports","Treasury","Audit"]},
  {id:"vpf",name:"Sarah Chen",role:"VP Finance",shortRole:"VP Finance",photo:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&fit=crop&crop=face",status:"online",dept:"Finance",focus:"Revenue, Margins, OpEx",perms:["P&L Read/Write","Budget Approval","Forecast Models"]},
  {id:"ctrl",name:"Marcus Rodriguez",role:"Controller",shortRole:"Controller",photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face",status:"away",dept:"Accounting",focus:"Close, Compliance, 10-K",perms:["GL Full Access","Close Management","Audit Trail"]},
  {id:"fpa",name:"Priya Sharma",role:"FP&A Director",shortRole:"FP&A",photo:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80&fit=crop&crop=face",status:"online",dept:"Planning",focus:"Forecast, Budget, Models",perms:["Forecast Models","Scenario Builder","Budget Read/Write"]},
  {id:"trs",name:"David Kim",role:"Treasury Director",shortRole:"Treasury",photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80&fit=crop&crop=face",status:"offline",dept:"Treasury",focus:"Cash, FX, Hedging",perms:["Treasury Full","FX Management","Cash Forecasting"]},
  {id:"ir",name:"Elena Volkov",role:"Investor Relations",shortRole:"IR",photo:"https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=80&q=80&fit=crop&crop=face",status:"online",dept:"IR",focus:"Consensus, Guidance, Deck",perms:["IR Reports","Board Deck Read","Earnings Call"]}
];

const tasks=[
  {t:"Review Q4 earnings script",a:"Sarah Chen",p:"high",due:"Mar 26",s:"In Progress",pct:65},
  {t:"Finalize 10-K segment disclosures",a:"Marcus Rodriguez",p:"high",due:"Mar 27",s:"In Review",pct:85},
  {t:"Update bottling refranchising model",a:"Priya Sharma",p:"medium",due:"Mar 28",s:"In Progress",pct:40},
  {t:"Board deck — cash flow bridge",a:"James Mitchell",p:"high",due:"Mar 25",s:"Draft",pct:20},
  {t:"LatAm marketing ROI analysis",a:"Sarah Chen",p:"medium",due:"Mar 30",s:"Not Started",pct:0},
  {t:"Hedge position review — EUR/USD",a:"David Kim",p:"medium",due:"Mar 28",s:"In Progress",pct:55},
  {t:"Investor day presentation draft",a:"Elena Volkov",p:"low",due:"Apr 5",s:"Not Started",pct:0},
  {t:"Dividend declaration memo",a:"James Mitchell",p:"high",due:"Mar 25",s:"Draft",pct:30}
];

const msgs=[
  {from:admins[1],text:"LatAm margin expansion confirmed — 41.2% operating margin, 280bps improvement. Updated the variance bridge.",time:"2:45 PM"},
  {from:admins[0],text:"Perfect. Also need the constant-currency EMEA growth pulled. The 4.2% reported understates the organic performance.",time:"2:48 PM"},
  {from:admins[3],text:"EMEA was 7.8% organic growth. Hedge covered 68% of exposure. Adding to board deck now.",time:"2:52 PM"},
  {from:admins[2],text:"10-K segment note drafted. Need sign-off on the Bottling Investments disclosure.",time:"3:01 PM"},
  {from:admins[5],text:"Buy-side consensus for Q1'26 is $11.9B revenue. Our internal model shows $12.1B.",time:"3:14 PM"}
];

const aiFlows=[
  {name:"Variance Detection",status:"active",model:"Claude Opus",desc:"Scanning Q4 actuals vs budget",conf:94},
  {name:"Revenue Forecast",status:"active",model:"GPT-4o",desc:"Rolling 12-month forecast updated",conf:91},
  {name:"Compliance Monitor",status:"idle",model:"Claude Sonnet",desc:"10-K language review",conf:97},
  {name:"FX Hedge Optimizer",status:"active",model:"Claude Opus",desc:"EUR/USD position analysis",conf:88},
  {name:"Board Deck Generator",status:"queued",model:"GPT-4o",desc:"Auto-generating cash flow bridge",conf:0}
];

const secEvents=[
  {desc:"SSO login from authorized IP",user:"James Mitchell",time:"3:22 PM",sev:"info"},
  {desc:"Q4 revenue export — 2.4MB encrypted",user:"Sarah Chen",time:"3:15 PM",sev:"info"},
  {desc:"Failed login attempt blocked (2FA)",user:"External",time:"2:58 PM",sev:"warn"},
  {desc:"SOC 2 audit log checkpoint passed",user:"System",time:"2:30 PM",sev:"ok"},
  {desc:"AES-256 key rotation completed",user:"System",time:"1:00 PM",sev:"ok"}
];

const brands=[
  {name:"Coca-Cola",rev:18.2,growth:4.1,share:39.8,margin:62.1,status:"On Track",spark:[16.8,17.0,17.2,17.4,17.6,17.8,18.0,18.2]},
  {name:"Sprite",rev:4.8,growth:6.2,share:10.5,margin:58.3,status:"On Track",spark:[4.0,4.1,4.2,4.3,4.4,4.5,4.6,4.8]},
  {name:"Fanta",rev:3.2,growth:3.8,share:7.0,margin:55.7,status:"On Track",spark:[2.8,2.9,2.9,3.0,3.0,3.1,3.1,3.2]},
  {name:"Minute Maid",rev:2.9,growth:2.1,share:6.3,margin:48.2,status:"Watch",spark:[2.7,2.7,2.8,2.8,2.8,2.8,2.9,2.9]},
  {name:"Dasani",rev:2.4,growth:-1.2,share:5.2,margin:42.6,status:"Alert",spark:[2.6,2.6,2.5,2.5,2.5,2.4,2.4,2.4]},
  {name:"Costa Coffee",rev:1.8,growth:12.8,share:3.9,margin:38.4,status:"On Track",spark:[1.2,1.3,1.4,1.4,1.5,1.6,1.7,1.8]}
];

const pnlVariance=[
  {line:"Net Revenue",actual:12.4,budget:12.1,fav:true},{line:"Cost of Goods Sold",actual:5.1,budget:5.3,fav:true},
  {line:"Gross Profit",actual:7.3,budget:6.8,fav:true},{line:"Operating Expenses",actual:3.5,budget:3.4,fav:false},
  {line:"EBIT / Operating Income",actual:3.8,budget:3.4,fav:true},{line:"Tax & Other",actual:0.9,budget:0.95,fav:true},
  {line:"Net Income",actual:2.9,budget:2.45,fav:true}
];

const closeItems=[
  {task:"Journal Entries",status:"complete",pct:100},{task:"Account Reconciliations",status:"complete",pct:100},
  {task:"Accruals & Deferrals",status:"complete",pct:100},{task:"IC Eliminations",status:"progress",pct:72},
  {task:"Management Review",status:"pending",pct:0}
];

let activeAdmin="cfo",activeView="overview",panelOpen=null;

// ══════════════════════════════════════
// SVG CHART HELPERS
// ══════════════════════════════════════
function sparkSVG(data,color,w=60,h=20){
  const max=Math.max(...data),min=Math.min(...data),range=max-min||1;
  const pts=data.map((v,i)=>\`\${(i/(data.length-1))*w},\${h-((v-min)/range)*h}\`).join(' ');
  return \`<svg width="\${w}" height="\${h}" style="overflow:visible"><polyline points="\${pts}" fill="none" stroke="\${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="\${w}" cy="\${h-((data[data.length-1]-min)/range)*h}" r="2" fill="\${color}"/></svg>\`;
}

function revenueAreaChart(){
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const rev=[3.5,3.6,3.7,3.8,3.6,3.9,4.0,3.8,4.1,4.0,4.2,4.1];
  const margin=[57.8,58.0,58.2,58.5,58.3,58.8,59.0,58.7,59.2,59.0,59.4,59.2];
  const W=580,H=200,P=40,PR=30;
  const xW=W-P-PR,yH=H-40;
  const minR=3.2,maxR=4.4,rng=maxR-minR;
  const pts=rev.map((v,i)=>[P+i*(xW/11),20+yH-(((v-minR)/rng)*yH)]);
  const pathD=pts.map((p,i)=>i===0?\`M\${p[0]},\${p[1]}\`:\`L\${p[0]},\${p[1]}\`).join(' ');
  const areaD=pathD+\` L\${pts[pts.length-1][0]},\${20+yH} L\${pts[0][0]},\${20+yH} Z\`;
  // Margin line (right axis)
  const minM=56,maxM=61,mRng=maxM-minM;
  const mPts=margin.map((v,i)=>[P+i*(xW/11),20+yH-(((v-minM)/mRng)*yH)]);
  const mPathD=mPts.map((p,i)=>i===0?\`M\${p[0]},\${p[1]}\`:\`L\${p[0]},\${p[1]}\`).join(' ');
  let svg=\`<svg width="100%" viewBox="0 0 \${W} \${H}" style="display:block">\`;
  svg+=\`<defs><linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--coke)" stop-opacity="0.15"/><stop offset="100%" stop-color="var(--coke)" stop-opacity="0.01"/></linearGradient></defs>\`;
  // Grid lines
  for(let i=0;i<5;i++){const y=20+i*(yH/4);svg+=\`<line x1="\${P}" y1="\${y}" x2="\${W-PR}" y2="\${y}" stroke="var(--bsub)" stroke-width="1"/>\`;}
  // Y axis labels (left - Revenue)
  for(let i=0;i<5;i++){const y=20+i*(yH/4);const val=(maxR-(i*(rng/4))).toFixed(1);svg+=\`<text x="\${P-4}" y="\${y+3}" font-size="9" fill="var(--tm)" text-anchor="end" font-family="var(--fm)">$\${val}B</text>\`;}
  // Y axis labels (right - Margin)
  for(let i=0;i<5;i++){const y=20+i*(yH/4);const val=(maxM-(i*(mRng/4))).toFixed(0);svg+=\`<text x="\${W-PR+4}" y="\${y+3}" font-size="9" fill="var(--blue)" text-anchor="start" font-family="var(--fm)">\${val}%</text>\`;}
  // X axis
  months.forEach((m,i)=>{const x=P+i*(xW/11);svg+=\`<text x="\${x}" y="\${H-4}" font-size="9" fill="var(--tm)" text-anchor="middle" font-family="var(--fm)">\${m}</text>\`;});
  // Area + Line
  svg+=\`<path d="\${areaD}" fill="url(#areaG)"/>\`;
  svg+=\`<path d="\${pathD}" fill="none" stroke="var(--coke)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\`;
  // Margin line
  svg+=\`<path d="\${mPathD}" fill="none" stroke="var(--blue)" stroke-width="1.5" stroke-dasharray="4 3" stroke-linecap="round"/>\`;
  // Dots
  pts.forEach(p=>{svg+=\`<circle cx="\${p[0]}" cy="\${p[1]}" r="3" fill="var(--s0)" stroke="var(--coke)" stroke-width="2"/>\`;});
  mPts.forEach(p=>{svg+=\`<circle cx="\${p[0]}" cy="\${p[1]}" r="2.5" fill="var(--s0)" stroke="var(--blue)" stroke-width="1.5"/>\`;});
  svg+=\`</svg>\`;
  return svg;
}

function waterfallChart(){
  const items=[
    {l:"Revenue",v:12.4,type:"total"},{l:"COGS",v:-5.1,type:"sub"},{l:"Gross Profit",v:7.3,type:"total"},
    {l:"OpEx",v:-3.5,type:"sub"},{l:"Oper. Income",v:3.8,type:"total"},{l:"Tax & Other",v:-0.9,type:"sub"},{l:"Net Income",v:2.9,type:"net"}
  ];
  const W=580,H=210,P=40,B=50;
  const maxV=14;const barW=52;const gap=(W-P-items.length*barW)/(items.length-1);
  let cumulative=0;
  let svg=\`<svg width="100%" viewBox="0 0 \${W} \${H}" style="display:block">\`;
  // Grid
  for(let i=0;i<=4;i++){const y=20+i*((H-60)/4);svg+=\`<line x1="\${P}" y1="\${y}" x2="\${W-10}" y2="\${y}" stroke="var(--bsub)" stroke-width="1"/>\`;const val=(maxV-i*(maxV/4)).toFixed(0);svg+=\`<text x="\${P-4}" y="\${y+3}" font-size="9" fill="var(--tm)" text-anchor="end" font-family="var(--fm)">$\${val}B</text>\`;}
  items.forEach((item,i)=>{
    const x=P+i*(barW+gap);
    const scale=(H-60)/maxV;
    let barH,barY;
    const color=item.type==='sub'?'var(--red)':item.type==='net'?'var(--green)':'var(--blue)';
    if(item.type==='total'||item.type==='net'){barH=Math.abs(item.v)*scale;barY=20+(H-60)-barH;cumulative=item.v;}
    else{const oldCum=cumulative;cumulative+=item.v;barH=Math.abs(item.v)*scale;barY=20+(H-60)-Math.max(oldCum,cumulative)*scale;}
    svg+=\`<rect x="\${x}" y="\${barY}" width="\${barW}" height="\${barH}" rx="4" fill="\${color}" opacity="0.85"/>\`;
    svg+=\`<text x="\${x+barW/2}" y="\${barY-6}" font-size="10" fill="\${color}" text-anchor="middle" font-weight="700" font-family="var(--fm)">\${item.v>0?'$':''}\${item.v}B</text>\`;
    svg+=\`<text x="\${x+barW/2}" y="\${H-4}" font-size="8" fill="var(--tm)" text-anchor="middle" font-family="var(--fm)">\${item.l}</text>\`;
    // Connector line
    if(i<items.length-1&&item.type!=='sub'){const nextX=P+(i+1)*(barW+gap);const lineY=item.type==='total'?barY:barY+barH;svg+=\`<line x1="\${x+barW}" y1="\${lineY}" x2="\${nextX}" y2="\${lineY}" stroke="var(--border)" stroke-width="1" stroke-dasharray="3 2"/>\`;}
  });
  svg+=\`</svg>\`;
  return svg;
}

function donutChart(){
  const segs=[{l:"Sparkling",pct:42,c:"var(--coke)",v:"$19.2B"},{l:"Still Beverages",pct:28,c:"var(--blue)",v:"$12.8B"},{l:"Hydration",pct:18,c:"var(--green)",v:"$8.2B"},{l:"Other",pct:12,c:"var(--purple)",v:"$5.6B"}];
  const r=70,cx=90,cy=90,sw=18;const circ=2*Math.PI*r;
  let offset=0;
  let svg=\`<svg width="180" height="180" viewBox="0 0 180 180">\`;
  svg+=\`<circle cx="\${cx}" cy="\${cy}" r="\${r}" fill="none" stroke="var(--s2)" stroke-width="\${sw}"/>\`;
  segs.forEach(s=>{
    const dash=(s.pct/100)*circ;
    svg+=\`<circle cx="\${cx}" cy="\${cy}" r="\${r}" fill="none" stroke="\${s.c}" stroke-width="\${sw}" stroke-dasharray="\${dash} \${circ-dash}" stroke-dashoffset="\${-offset}" stroke-linecap="round" transform="rotate(-90 \${cx} \${cy})" style="transition:stroke-dashoffset .8s"/>\`;
    offset+=dash;
  });
  svg+=\`<text x="\${cx}" y="\${cy-6}" text-anchor="middle" font-size="18" font-weight="800" fill="var(--t1)" font-family="var(--fm)">$45.8B</text>\`;
  svg+=\`<text x="\${cx}" y="\${cy+10}" text-anchor="middle" font-size="9" fill="var(--tm)" font-family="var(--fb)">Total Revenue</text>\`;
  svg+=\`</svg>\`;
  const legend=segs.map(s=>\`<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><div style="width:10px;height:10px;border-radius:3px;background:\${s.c};flex-shrink:0"></div><span style="font-size:11px;font-weight:600;flex:1">\${s.l}</span><span style="font-size:11px;font-weight:800;font-family:var(--fm)">\${s.pct}%</span><span style="font-size:10px;color:var(--tm);font-family:var(--fm)">\${s.v}</span></div>\`).join('');
  return \`<div style="display:flex;align-items:center;gap:24px"><div>\${svg}</div><div style="flex:1">\${legend}</div></div>\`;
}

function yoyBarChart(){
  const segs=[{l:"NA",v25:4.0,v26:4.3,c:"var(--coke)"},{l:"EMEA",v25:2.0,v26:2.2,c:"var(--blue)"},{l:"LatAm",v25:1.2,v26:1.5,c:"var(--green)"},{l:"APAC",v25:1.4,v26:1.6,c:"var(--cyan)"}];
  const W=280,H=160,P=35;const maxV=5;const grpW=45;const barW=18;const gap=(W-P-segs.length*grpW)/(segs.length+1);
  let svg=\`<svg width="100%" viewBox="0 0 \${W} \${H}" style="display:block">\`;
  for(let i=0;i<=4;i++){const y=10+i*((H-40)/4);svg+=\`<line x1="\${P}" y1="\${y}" x2="\${W-5}" y2="\${y}" stroke="var(--bsub)" stroke-width="1"/>\`;svg+=\`<text x="\${P-4}" y="\${y+3}" font-size="8" fill="var(--tm)" text-anchor="end" font-family="var(--fm)">$\${(maxV-i*(maxV/4)).toFixed(0)}B</text>\`;}
  segs.forEach((s,i)=>{
    const gx=P+gap+(i*(grpW+gap));const scale=(H-40)/maxV;
    const h25=s.v25*scale,h26=s.v26*scale;
    svg+=\`<rect x="\${gx}" y="\${10+(H-40)-h25}" width="\${barW}" height="\${h25}" rx="3" fill="\${s.c}" opacity="0.35"/>\`;
    svg+=\`<rect x="\${gx+barW+2}" y="\${10+(H-40)-h26}" width="\${barW}" height="\${h26}" rx="3" fill="\${s.c}" opacity="0.85"/>\`;
    svg+=\`<text x="\${gx+grpW/2}" y="\${H-4}" font-size="9" fill="var(--tm)" text-anchor="middle" font-family="var(--fm)">\${s.l}</text>\`;
  });
  svg+=\`</svg>\`;
  return svg;
}

// ══════════════════════════════════════
// RENDER ENGINE
// ══════════════════════════════════════
function renderAdminTabs(){
  document.getElementById('adminTabs').innerHTML=admins.map(a=>\`
    <button class="admin-tab \${a.id===activeAdmin?'active':''}" onclick="switchAdmin('\${a.id}')">
      <div style="position:relative"><img src="\${a.photo}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:2px solid \${a.id===activeAdmin?'var(--coke)':'transparent'}"><div class="status-dot" style="position:absolute;bottom:-1px;right:-1px;width:7px;height:7px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--tf)'};border:2px solid var(--s0)"></div></div>
      <span class="sidebar-label">\${a.shortRole}</span>
    </button>\`).join('');
}

function switchAdmin(id){activeAdmin=id;renderAdminTabs();renderSidebar();renderContent();}
function switchView(v){activeView=v;renderSidebar();renderContent();}

function renderSidebar(){
  const mkBtn=(items)=>items.map(f=>\`<button class="sidebar-btn \${f.v===activeView?'active':''}" onclick="switchView('\${f.v}')"><span class="icon">\${f.i}</span><span class="sidebar-label">\${f.l}</span>\${f.b?\`<span class="tag tag-sm sidebar-label" style="background:var(--coke);color:#fff;margin-left:auto">\${f.b}</span>\`:''}</button>\`).join('');
  const si=s=>\`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\${s}</svg>\`;
  document.getElementById('sidebarFinance').innerHTML=mkBtn([
    {i:si('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'),l:"Command Center",v:"overview"},
    {i:si('<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>'),l:"P&L Statement",v:"pnl"},
    {i:si('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),l:"Segments",v:"segments"},
    {i:si('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),l:"Forecast",v:"forecast"},
    {i:si('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>'),l:"Cash Flow",v:"cashflow"}
  ]);
  document.getElementById('sidebarOrg').innerHTML=mkBtn([
    {i:si('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>'),l:"Tasks",v:"tasks",b:tasks.filter(t=>t.s!=="Complete").length},
    {i:si('<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>'),l:"Messages",v:"messages",b:msgs.length},
    {i:si('<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>'),l:"Team",v:"team"}
  ]);
  document.getElementById('sidebarAI').innerHTML=mkBtn([
    {i:si('<circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/>'),l:"AI Flows",v:"aiflows",b:aiFlows.filter(f=>f.status==='active').length},
    {i:si('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),l:"Security",v:"security"}
  ]);
  document.getElementById('teamSidebar').innerHTML=admins.map(a=>\`
    <div style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:var(--rs);cursor:pointer;transition:all .12s;margin-bottom:2px" onmouseover="this.style.background='var(--s2)'" onmouseout="this.style.background='transparent'" onclick="switchAdmin('\${a.id}')">
      <div style="position:relative"><img src="\${a.photo}" class="avatar" style="width:24px;height:24px"><div class="status-dot" style="position:absolute;bottom:-1px;right:-1px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--tf)'};border:2px solid var(--s0)"></div></div>
      <div style="flex:1;min-width:0"><div style="font-size:10px;font-weight:600;color:var(--t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${a.name.split(' ')[0]}</div></div>
      <span style="font-size:8px;color:var(--tm)">\${a.status==='online'?'now':a.status==='away'?'15m':''}</span>
    </div>\`).join('');
  const admin=admins.find(a=>a.id===activeAdmin);
  document.getElementById('currentUser').innerHTML=\`<img src="\${admin.photo}" class="avatar" style="width:32px;height:32px"><div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:700">\${admin.name}</div><span style="font-size:9px;color:var(--tm)">\${admin.role}</span></div>\`;
}

function renderContent(){
  const el=document.getElementById('content');const admin=admins.find(a=>a.id===activeAdmin);
  if(activeView==='overview') el.innerHTML=renderOverview(admin);
  else if(activeView==='team') el.innerHTML=renderTeamView(admin);
  else if(activeView==='tasks') el.innerHTML=renderTasksView(admin);
  else if(activeView==='messages') el.innerHTML=renderMessagesView(admin);
  else el.innerHTML=renderPlaceholder(activeView,admin);
}

// ══════════════════════════════════════
// OVERVIEW / COMMAND CENTER
// ══════════════════════════════════════
function renderOverview(admin){
  const kpis=[
    {l:"Net Revenue",v:"$12.4B",d:"+6.8%",up:1,c:"var(--coke)",spark:[10.2,10.8,11.1,11.4,11.7,12.0,12.2,12.4]},
    {l:"Gross Margin",v:"59.2%",d:"+180bps",up:1,c:"var(--green)",spark:[57.8,58.0,58.4,58.6,58.8,59.0,59.1,59.2]},
    {l:"Operating Income",v:"$3.8B",d:"+8.2%",up:1,c:"var(--blue)",spark:[3.1,3.2,3.3,3.4,3.5,3.6,3.7,3.8]},
    {l:"Free Cash Flow",v:"$2.1B",d:"+12.4%",up:1,c:"var(--purple)",spark:[1.5,1.6,1.7,1.8,1.8,1.9,2.0,2.1]}
  ];
  const pColor=p=>p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';
  const sColor=s=>s==='In Progress'?'var(--blue)':s==='In Review'?'var(--purple)':s==='Draft'?'var(--amber)':'var(--tm)';
  return \`
  <!-- Hero -->
  <div class="card fade" style="padding:0;margin-bottom:20px;overflow:hidden;border:none;box-shadow:var(--sh-md)">
    <div style="display:grid;grid-template-columns:1fr 320px;min-height:140px">
      <div style="padding:28px 32px;display:flex;flex-direction:column;justify-content:center">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">
          <span class="tag" style="background:var(--green-bg);color:var(--green);border:1px solid var(--green-b)"><span class="live-dot" style="width:5px;height:5px"></span> All Systems Nominal</span>
          <span class="tag" style="background:var(--purple-bg);color:var(--purple);border:1px solid var(--purple-b)">AI Copilot Active</span>
          <span class="tag" style="background:var(--s2);color:var(--tm)">Q1 2026</span>
        </div>
        <h1 style="font-size:24px;font-weight:900;letter-spacing:-.04em;font-family:var(--fd);margin-bottom:4px">\${admin.shortRole} Command Center</h1>
        <p style="font-size:12px;color:var(--t3);line-height:1.6">Welcome back, \${admin.name.split(' ')[0]}. <strong style="color:var(--t2)">\${tasks.filter(t=>t.p==='high').length} high-priority items</strong> need attention. Focus: \${admin.focus}.</p>
      </div>
      <div style="position:relative;overflow:hidden">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop" style="width:100%;height:100%;object-fit:cover;display:block" alt="">
        <div style="position:absolute;inset:0;background:linear-gradient(90deg,var(--s0) 0%,rgba(255,255,255,.3) 50%,transparent 100%)"></div>
      </div>
    </div>
  </div>

  <!-- KPI Cards -->
  <div class="kpi-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">
    \${kpis.map((k,i)=>\`
      <div class="card fade" style="padding:18px 20px;animation-delay:\${i*.06}s">
        <div class="card-accent" style="background:\${k.c}"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--tm)">\${k.l}</div>
          \${sparkSVG(k.spark,k.c)}
        </div>
        <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px">
          <span class="kpi-value">\${k.v}</span>
          <span class="tag tag-sm" style="background:\${k.up?'var(--green-bg)':'var(--red-bg)'};color:\${k.up?'var(--green)':'var(--red)'}">&#9650; \${k.d}</span>
        </div>
      </div>\`).join('')}
  </div>

  <!-- Charts Row 1: Revenue Trend + P&L Waterfall -->
  <div class="chart-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
    <div class="card" style="padding:22px">
      <div class="card-accent" style="background:var(--coke)"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div>
          <div style="font-size:14px;font-weight:800;font-family:var(--fd)">Revenue Trend</div>
          <div style="font-size:10px;color:var(--tm)">Monthly revenue + gross margin overlay</div>
        </div>
        <div style="display:flex;gap:12px">
          <span style="font-size:9px;color:var(--coke);font-weight:700;display:flex;align-items:center;gap:4px"><span style="width:12px;height:2px;background:var(--coke);border-radius:1px"></span> Revenue</span>
          <span style="font-size:9px;color:var(--blue);font-weight:700;display:flex;align-items:center;gap:4px"><span style="width:12px;height:2px;background:var(--blue);border-radius:1px;border-style:dashed"></span> Margin</span>
        </div>
      </div>
      \${revenueAreaChart()}
    </div>
    <div class="card" style="padding:22px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--green),var(--blue))"></div>
      <div style="margin-bottom:16px">
        <div style="font-size:14px;font-weight:800;font-family:var(--fd)">P&L Waterfall</div>
        <div style="font-size:10px;color:var(--tm)">Q1 2026 — Revenue to Net Income bridge</div>
      </div>
      \${waterfallChart()}
    </div>
  </div>

  <!-- Charts Row 2: Donut + YoY Bars + Close Tracker -->
  <div style="display:grid;grid-template-columns:1.3fr .7fr 1fr;gap:14px;margin-bottom:20px">
    <div class="card" style="padding:22px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--coke),var(--purple))"></div>
      <div style="margin-bottom:16px;font-size:14px;font-weight:800;font-family:var(--fd)">Revenue Mix</div>
      \${donutChart()}
    </div>
    <div class="card" style="padding:22px">
      <div class="card-accent" style="background:var(--cyan)"></div>
      <div style="margin-bottom:12px">
        <div style="font-size:14px;font-weight:800;font-family:var(--fd)">YoY Growth</div>
        <div style="font-size:10px;color:var(--tm)">Q1'25 vs Q1'26 by segment</div>
      </div>
      \${yoyBarChart()}
      <div style="display:flex;gap:12px;justify-content:center;margin-top:8px">
        <span style="font-size:9px;color:var(--tm);display:flex;align-items:center;gap:4px"><span style="width:10px;height:6px;background:var(--coke);border-radius:2px;opacity:.35"></span> Q1'25</span>
        <span style="font-size:9px;color:var(--tm);display:flex;align-items:center;gap:4px"><span style="width:10px;height:6px;background:var(--coke);border-radius:2px;opacity:.85"></span> Q1'26</span>
      </div>
    </div>
    <div class="card" style="padding:22px">
      <div class="card-accent" style="background:var(--green)"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:14px;font-weight:800;font-family:var(--fd)">Month-End Close</div>
        <span class="tag tag-sm" style="background:var(--amber-bg);color:var(--amber)">Day 3 of 5</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <div style="flex:1;height:8px;background:var(--s3);border-radius:4px;overflow:hidden"><div style="width:68%;height:100%;background:var(--green);border-radius:4px;animation:barGrow .8s both"></div></div>
        <span style="font-size:13px;font-weight:800;font-family:var(--fm);color:var(--green)">68%</span>
      </div>
      \${closeItems.map(c=>{
        const ic=c.status==='complete'?'var(--green)':c.status==='progress'?'var(--blue)':'var(--tm)';
        const check=c.status==='complete'?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':c.status==='progress'?\`<div style="width:14px;height:14px;border:2px solid var(--blue);border-radius:50%;border-top-color:transparent;animation:pulse 1s infinite"></div>\`:'<div style="width:14px;height:14px;border:2px solid var(--border);border-radius:50%"></div>';
        return \`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--bsub)">
          \${check}
          <span style="font-size:11px;font-weight:600;flex:1;color:\${c.status==='pending'?'var(--tm)':'var(--t2)'}">\${c.task}</span>
          \${c.pct>0&&c.pct<100?\`<span style="font-size:10px;font-weight:700;font-family:var(--fm);color:var(--blue)">\${c.pct}%</span>\`:''}
        </div>\`;
      }).join('')}
    </div>
  </div>

  <!-- Brand Portfolio Table -->
  <div class="card" style="padding:22px;margin-bottom:20px">
    <div class="card-accent" style="background:var(--coke)"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div style="font-size:14px;font-weight:800;font-family:var(--fd)">Brand Portfolio Performance</div>
      <span class="tag" style="background:var(--s2);color:var(--t3)">6 Brands Tracked</span>
    </div>
    <table class="tbl">
      <thead><tr><th>Brand</th><th>Revenue</th><th>Growth</th><th>Market Share</th><th>Margin</th><th>Trend</th><th>Status</th></tr></thead>
      <tbody>\${brands.map(b=>{
        const sc=b.status==='On Track'?'var(--green)':b.status==='Watch'?'var(--amber)':'var(--red)';
        const sbg=b.status==='On Track'?'var(--green-bg)':b.status==='Watch'?'var(--amber-bg)':'var(--red-bg)';
        return \`<tr>
          <td style="font-weight:700">\${b.name}</td>
          <td style="font-family:var(--fm);font-weight:700">$\${b.rev}B</td>
          <td style="color:\${b.growth>=0?'var(--green)':'var(--red)'};font-weight:700;font-family:var(--fm)">\${b.growth>=0?'+':''}\${b.growth}%</td>
          <td style="font-family:var(--fm)">\${b.share}%</td>
          <td style="font-family:var(--fm)">\${b.margin}%</td>
          <td>\${sparkSVG(b.spark,b.growth>=0?'var(--green)':'var(--red)',50,16)}</td>
          <td><span class="tag tag-sm" style="background:\${sbg};color:\${sc}">\${b.status}</span></td>
        </tr>\`;}).join('')}
      </tbody>
    </table>
  </div>

  <!-- P&L Variance + Treasury + AI Insights -->
  <div class="bottom-grid" style="display:grid;grid-template-columns:1.2fr .8fr 1fr;gap:14px;margin-bottom:20px">
    <!-- P&L Variance -->
    <div class="card" style="padding:22px">
      <div class="card-accent" style="background:var(--blue)"></div>
      <div style="font-size:14px;font-weight:800;font-family:var(--fd);margin-bottom:14px">P&L Variance Analysis</div>
      <table class="tbl">
        <thead><tr><th>Line Item</th><th>Actual</th><th>Budget</th><th>Var</th><th></th></tr></thead>
        <tbody>\${pnlVariance.map(p=>{
          const v=(p.actual-p.budget).toFixed(1);const vPct=((p.actual-p.budget)/p.budget*100).toFixed(1);
          const isPos=parseFloat(v)>=0;
          return \`<tr>
            <td style="font-weight:600;font-size:10px">\${p.line}</td>
            <td style="font-family:var(--fm);font-weight:700;font-size:11px">$\${p.actual}B</td>
            <td style="font-family:var(--fm);color:var(--tm);font-size:11px">$\${p.budget}B</td>
            <td style="font-family:var(--fm);font-weight:700;color:\${p.fav?'var(--green)':'var(--red)'};font-size:11px">\${isPos?'+':''}\${v}B</td>
            <td><span class="tag tag-sm" style="background:\${p.fav?'var(--green-bg)':'var(--red-bg)'};color:\${p.fav?'var(--green)':'var(--red)'}">\${p.fav?'Fav':'Unfav'}</span></td>
          </tr>\`;}).join('')}
        </tbody>
      </table>
    </div>
    <!-- Treasury -->
    <div class="card" style="padding:22px">
      <div class="card-accent" style="background:var(--cyan)"></div>
      <div style="font-size:14px;font-weight:800;font-family:var(--fd);margin-bottom:14px">Treasury</div>
      \${[
        {l:"Cash & Equivalents",v:"$9.8B",d:"+$1.2B",c:"var(--green)"},
        {l:"Working Capital",v:"$4.2B",d:"+$0.3B",c:"var(--blue)"},
        {l:"Debt / Equity",v:"1.8x",d:"-0.1x",c:"var(--green)"},
        {l:"Interest Coverage",v:"12.4x",d:"+0.8x",c:"var(--green)"}
      ].map(t=>\`
        <div style="padding:12px;border-radius:var(--rs);background:var(--s1);border:1px solid var(--bsub);margin-bottom:8px">
          <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--tm);margin-bottom:4px">\${t.l}</div>
          <div style="display:flex;align-items:baseline;gap:8px">
            <span style="font-size:18px;font-weight:800;font-family:var(--fm)">\${t.v}</span>
            <span style="font-size:10px;font-weight:700;color:\${t.c}">\${t.d}</span>
          </div>
        </div>\`).join('')}
    </div>
    <!-- AI Insights -->
    <div class="card" style="padding:22px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--purple),var(--blue))"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <span style="font-size:14px;font-weight:800;font-family:var(--fd)">AI Insights</span>
        <span class="tag tag-sm" style="background:var(--purple-bg);color:var(--purple)"><span class="live-dot" style="background:var(--purple);width:4px;height:4px"></span> LIVE</span>
      </div>
      \${[
        {t:"LatAm margins hit 41.2% — recommend increasing marketing allocation by 15%",c:"var(--green)",bg:"var(--green-bg)",conf:94,model:"Claude Opus"},
        {t:"Bottling segment OM compressed -120bps. Flagged for strategic review.",c:"var(--amber)",bg:"var(--amber-bg)",conf:91,model:"GPT-4o"},
        {t:"FCF conversion 96.5% — top quartile among consumer staples peers.",c:"var(--blue)",bg:"var(--blue-bg)",conf:97,model:"Claude Sonnet"},
        {t:"Costa Coffee +12.8% growth outpacing category by 4x. Expansion thesis validated.",c:"var(--green)",bg:"var(--green-bg)",conf:93,model:"Claude Opus"}
      ].map(ins=>\`
        <div style="padding:10px 12px;border-radius:var(--rs);background:\${ins.bg};border:1px solid \${ins.c}12;margin-bottom:8px">
          <div style="font-size:10px;color:var(--t2);line-height:1.6;margin-bottom:6px">\${ins.t}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:8px;color:var(--tm);background:var(--s0);padding:1px 6px;border-radius:3px">\${ins.model}</span>
            <span style="font-size:8px;color:\${ins.c};font-weight:700;font-family:var(--fm)">\${ins.conf}%</span>
          </div>
        </div>\`).join('')}
      <button class="btn btn-outline" style="width:100%;justify-content:center;margin-top:4px" onclick="togglePanel('copilot')">Open AI Copilot</button>
    </div>
  </div>

  <!-- Footer -->
  <div style="padding:16px 22px;border-radius:var(--rl);background:linear-gradient(135deg,rgba(37,99,235,.03),rgba(124,58,237,.02));border:1px solid rgba(37,99,235,.06);display:flex;justify-content:space-between;align-items:center">
    <div style="display:flex;align-items:center;gap:12px">
      <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="url(#fos)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>
      <div><div style="font-size:11px;font-weight:800;font-family:var(--fd)">Powered by FinanceOS Enterprise</div><div style="font-size:9px;color:var(--tm)">SOC 2 Type II · AES-256 · 99.9% Uptime · GDPR · Row-Level Security</div></div>
    </div>
    <a href="https://finance-os.app" target="_blank" class="btn btn-coke btn-sm" style="text-decoration:none">Learn More</a>
  </div>\`;
}

// ══════════════════════════════════════
// TEAM / ADMIN VIEW
// ══════════════════════════════════════
function renderTeamView(currentAdmin){
  return \`<div class="fade">
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--tf);margin-bottom:4px">Organization</div>
    <h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--fd);margin-bottom:24px">Finance Leadership Team</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
      \${admins.map(a=>{
        const myTasks=tasks.filter(t=>t.a===a.name);
        return \`<div class="card" style="padding:24px;cursor:pointer" onclick="switchAdmin('\${a.id}');switchView('overview')">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
            <div style="position:relative"><img src="\${a.photo}" class="avatar" style="width:52px;height:52px"><div class="status-dot" style="position:absolute;bottom:1px;right:1px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--tf)'};border:3px solid var(--s0);width:14px;height:14px"></div></div>
            <div><div style="font-size:15px;font-weight:800;font-family:var(--fd)">\${a.name}</div><div style="font-size:11px;color:var(--t3)">\${a.role}</div><div style="font-size:10px;color:var(--tm)">\${a.dept}</div></div>
          </div>
          <div style="font-size:9px;font-weight:700;color:var(--tm);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">KPI Focus</div>
          <div style="font-size:11px;color:var(--t2);margin-bottom:12px">\${a.focus}</div>
          <div style="font-size:9px;font-weight:700;color:var(--tm);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Access Permissions</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:14px">\${a.perms.map(p=>\`<span class="tag tag-sm" style="background:var(--s2);color:var(--t3)">\${p}</span>\`).join('')}</div>
          <div style="border-top:1px solid var(--bsub);padding-top:12px;display:flex;justify-content:space-between">
            <span style="font-size:10px;color:var(--tm)">\${myTasks.length} tasks</span>
            <span style="font-size:10px;color:\${myTasks.filter(t=>t.p==='high').length?'var(--red)':'var(--green)'};font-weight:700">\${myTasks.filter(t=>t.p==='high').length} high priority</span>
          </div>
        </div>\`;}).join('')}
    </div>
  </div>\`;
}

// ══════════════════════════════════════
// TASKS VIEW
// ══════════════════════════════════════
function renderTasksView(admin){
  const pColor=p=>p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';
  const sColor=s=>s==='In Progress'?'var(--blue)':s==='In Review'?'var(--purple)':s==='Draft'?'var(--amber)':'var(--tm)';
  return \`<div class="fade">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px">
      <div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--tf);margin-bottom:4px">Organization</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--fd)">Task Management</h2></div>
      <button class="btn btn-coke">+ New Task</button>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <div style="display:grid;grid-template-columns:20px 1fr 100px 70px 80px;gap:8px;padding:12px 20px;background:var(--s1);font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--tm);border-bottom:1px solid var(--border)">
        <span></span><span>Task</span><span>Assignee</span><span>Due</span><span>Status</span>
      </div>
      \${tasks.map(t=>\`
        <div style="display:grid;grid-template-columns:20px 1fr 100px 70px 80px;gap:8px;padding:12px 20px;align-items:center;border-bottom:1px solid var(--bsub);transition:background .1s;cursor:pointer" onmouseover="this.style.background='var(--s1)'" onmouseout="this.style.background='transparent'">
          <div class="status-dot" style="background:\${pColor(t.p)}"></div>
          <div><div style="font-size:11px;font-weight:600;margin-bottom:2px">\${t.t}</div><div class="metric-bar" style="width:80px"><div class="metric-fill" style="width:\${t.pct}%;background:\${sColor(t.s)}"></div></div></div>
          <div style="display:flex;align-items:center;gap:6px"><img src="\${admins.find(a=>a.name===t.a)?.photo||''}" style="width:20px;height:20px;border-radius:50%;object-fit:cover"><span style="font-size:10px;color:var(--t3)">\${t.a.split(' ')[0]}</span></div>
          <span style="font-size:10px;color:var(--tm)">\${t.due}</span>
          <span class="tag tag-sm" style="background:\${sColor(t.s)}10;color:\${sColor(t.s)}">\${t.s}</span>
        </div>\`).join('')}
    </div>
  </div>\`;
}

// ══════════════════════════════════════
// MESSAGES VIEW
// ══════════════════════════════════════
function renderMessagesView(admin){
  return \`<div class="fade">
    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--tf);margin-bottom:4px">Communication</div>
    <h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--fd);margin-bottom:24px">#finance-leadership</h2>
    <div class="card" style="padding:24px">
      \${msgs.map(m=>\`
        <div class="msg-row">
          <img src="\${m.from.photo}" class="avatar" style="width:36px;height:36px;flex-shrink:0">
          <div style="flex:1"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="font-size:12px;font-weight:700">\${m.from.name}</span><span style="font-size:10px;color:var(--tm)">\${m.from.shortRole}</span><span style="font-size:9px;color:var(--tf)">\${m.time}</span></div><div class="msg-bubble">\${m.text}</div></div>
        </div>\`).join('')}
      <div style="display:flex;gap:8px;margin-top:16px;padding-top:16px;border-top:1px solid var(--bsub)">
        <input type="text" placeholder="Type a message..." style="flex:1;border:1px solid var(--border);border-radius:var(--rs);padding:10px 14px;font-family:var(--fb);font-size:12px;outline:none;background:var(--s1)">
        <button class="btn btn-coke">Send</button>
      </div>
    </div>
  </div>\`;
}

// ══════════════════════════════════════
// PLACEHOLDER VIEW
// ══════════════════════════════════════
function renderPlaceholder(view,admin){
  return \`<div class="fade" style="display:flex;align-items:center;justify-content:center;min-height:400px;text-align:center">
    <div><div style="font-size:48px;margin-bottom:16px;opacity:.15">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    </div><div style="font-size:18px;font-weight:800;font-family:var(--fd);margin-bottom:6px;text-transform:capitalize">\${view.replace(/([A-Z])/g,' $1')}</div><div style="font-size:12px;color:var(--tm)">This view is under development. Switch to Command Center for the full experience.</div><button class="btn btn-outline" style="margin-top:16px" onclick="switchView('overview')">Back to Command Center</button></div>
  </div>\`;
}

// ══════════════════════════════════════
// PANELS
// ══════════════════════════════════════
function togglePanel(type){
  const p=document.getElementById('rightPanel');
  if(panelOpen===type){p.style.display='none';panelOpen=null;return;}
  panelOpen=type;p.style.display='block';
  if(type==='copilot') p.innerHTML=renderCopilotPanel();
  else if(type==='ai') p.innerHTML=renderAIPanel();
  else if(type==='security') p.innerHTML=renderSecPanel();
}

function renderCopilotPanel(){
  return \`<div style="padding:20px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:32px;height:32px;border-radius:var(--rs);background:linear-gradient(135deg,var(--purple),var(--blue));display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2"/></svg></div>
        <div><div style="font-size:13px;font-weight:800;font-family:var(--fd)">AI Copilot</div><div style="font-size:9px;color:var(--tm)">Claude Opus · Enterprise</div></div>
      </div>
      <button class="btn btn-ghost btn-xs" onclick="togglePanel('copilot')">&#10005;</button>
    </div>
    <div style="background:var(--s1);border-radius:var(--r);padding:16px;margin-bottom:16px;border:1px solid var(--bsub)">
      <div style="font-size:10px;font-weight:700;color:var(--purple);margin-bottom:8px;display:flex;align-items:center;gap:4px"><span class="live-dot" style="background:var(--purple)"></span> Analysis</div>
      <div style="font-size:11px;color:var(--t2);line-height:1.7">Based on Q1 2026 data, 3 key insights for the board:<br><br>1. LatAm operating margin expansion (+280bps) is the strongest in 8 quarters<br>2. FCF conversion at 96.5% puts KO in the top quartile of consumer staples<br>3. Costa Coffee growth at 12.8% validates the acquisition thesis</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">
      \${['Summarize Q1 results','Generate board memo','Compare vs consensus','FX impact analysis'].map(q=>\`<button class="btn btn-outline btn-xs">\${q}</button>\`).join('')}
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <input type="text" placeholder="Ask about your financial data..." style="flex:1;border:1px solid var(--border);border-radius:var(--rs);padding:10px 14px;font-family:var(--fb);font-size:11px;outline:none;background:var(--s1)">
      <button class="btn" style="background:linear-gradient(135deg,var(--purple),var(--blue));color:#fff;padding:10px 14px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
    </div>
  </div>\`;
}

function renderAIPanel(){
  return \`<div style="padding:20px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div><div style="font-size:13px;font-weight:800;font-family:var(--fd)">AI Automation Flows</div><div style="font-size:10px;color:var(--tm)">\${aiFlows.filter(f=>f.status==='active').length} active</div></div>
      <button class="btn btn-ghost btn-xs" onclick="togglePanel('ai')">&#10005;</button>
    </div>
    \${aiFlows.map(f=>{
      const sc=f.status==='active'?'var(--green)':f.status==='queued'?'var(--amber)':'var(--tm)';
      return \`<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--rs);background:\${f.status==='active'?'var(--green-bg)':'var(--s1)'};border:1px solid \${f.status==='active'?'var(--green-b)':'var(--bsub)'};margin-bottom:6px">
        <div class="live-dot" style="background:\${sc};\${f.status!=='active'?'animation:none':''}"></div>
        <div style="flex:1"><div style="font-size:11px;font-weight:700;margin-bottom:2px">\${f.name} <span class="tag tag-sm" style="background:\${sc}15;color:\${sc}">\${f.status}</span></div><div style="font-size:9px;color:var(--t3)">\${f.desc}</div><div style="font-size:8px;color:var(--tm);margin-top:2px">\${f.model}\${f.conf?\` · \${f.conf}% confidence\`:''}</div></div>
      </div>\`;}).join('')}
  </div>\`;
}

function renderSecPanel(){
  return \`<div style="padding:20px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div><div style="font-size:13px;font-weight:800;font-family:var(--fd)">Security & Compliance</div><div style="font-size:10px;color:var(--green);font-weight:600;display:flex;align-items:center;gap:4px"><span class="live-dot"></span> All systems secure</div></div>
      <button class="btn btn-ghost btn-xs" onclick="togglePanel('security')">&#10005;</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
      \${[{l:"SOC 2",v:"Compliant",c:"var(--green)",bg:"var(--green-bg)"},{l:"AES-256",v:"Active",c:"var(--blue)",bg:"var(--blue-bg)"},{l:"RLS",v:"Enforced",c:"var(--purple)",bg:"var(--purple-bg)"},{l:"HSTS",v:"Enabled",c:"var(--cyan)",bg:"rgba(8,145,178,.06)"}].map(b=>\`
        <div style="background:\${b.bg};border:1px solid \${b.c}15;border-radius:var(--rs);padding:10px;text-align:center"><div style="font-size:10px;font-weight:800;color:\${b.c}">\${b.l}</div><div style="font-size:9px;color:var(--t3)">\${b.v}</div></div>\`).join('')}
    </div>
    <div style="font-size:11px;font-weight:700;margin-bottom:10px">Live Activity</div>
    \${secEvents.map(e=>{
      const sc=e.sev==='warn'?'var(--amber)':e.sev==='ok'?'var(--green)':'var(--blue)';
      return \`<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--bsub);align-items:flex-start"><div style="width:6px;height:6px;border-radius:50%;background:\${sc};margin-top:5px;flex-shrink:0"></div><div style="flex:1"><div style="font-size:10px;font-weight:600">\${e.desc}</div><div style="font-size:9px;color:var(--tm)">\${e.user} · \${e.time}</div></div></div>\`;}).join('')}
  </div>\`;
}

// ══════════════════════════════════════
// INIT
// ══════════════════════════════════════
function init(){
  const now=new Date();
  document.getElementById('clockDisplay').textContent=now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})+' · '+now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
  renderAdminTabs();renderSidebar();renderContent();
}
init();`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
:root{--bg:#F4F5F7;--bg-deep:#EBEDF1;--s0:#FFFFFF;--s1:#F9FAFB;--s2:#F3F4F6;--s3:#E8EAEF;--border:#E2E5EB;--bsub:#ECEEF3;--bfocus:#C41E1E40;--t1:#0A0F1A;--t2:#3B4559;--t3:#6B7A94;--tm:#9CA7B8;--tf:#C2CAD6;--coke:#C41E1E;--coke-d:#9A1515;--coke-l:#FEF2F2;--coke-b:rgba(196,30,30,.08);--green:#059669;--green-bg:#ECFDF5;--green-b:rgba(5,150,105,.12);--red:#DC2626;--red-bg:#FEF2F2;--amber:#D97706;--amber-bg:#FFFBEB;--amber-b:rgba(217,119,6,.12);--blue:#2563EB;--blue-bg:#EFF6FF;--blue-b:rgba(37,99,235,.12);--purple:#7C3AED;--purple-bg:#F5F3FF;--purple-b:rgba(124,58,237,.12);--cyan:#0891B2;--indigo:#4F46E5;--fd:'Inter',system-ui,sans-serif;--fb:'Manrope',system-ui,sans-serif;--fm:'JetBrains Mono',monospace;--r:12px;--rs:8px;--rl:16px;--sw:240px;--sh-xs:0 1px 2px rgba(0,0,0,.04);--sh-sm:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);--sh-md:0 4px 6px -1px rgba(0,0,0,.05),0 2px 4px -2px rgba(0,0,0,.03);--sh-lg:0 10px 15px -3px rgba(0,0,0,.06),0 4px 6px -4px rgba(0,0,0,.03)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--t1);font-family:var(--fb);-webkit-font-smoothing:antialiased;overflow:hidden;height:100vh;font-size:13px;line-height:1.5}
::selection{background:var(--coke);color:#fff}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes barGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.fade{animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both}
.card{background:var(--s0);border:1px solid var(--border);border-radius:var(--rl);box-shadow:var(--sh-xs);position:relative;transition:all .2s cubic-bezier(.16,1,.3,1)}
.card:hover{box-shadow:var(--sh-md);transform:translateY(-1px)}
.card-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--rl) var(--rl) 0 0}
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:.03em;line-height:1.4}
.tag-sm{font-size:9px;padding:2px 7px}
.btn{font-family:var(--fb);cursor:pointer;border:none;border-radius:var(--rs);font-weight:700;font-size:11px;padding:8px 16px;display:inline-flex;align-items:center;gap:6px;transition:all .15s;white-space:nowrap}
.btn-coke{background:var(--coke);color:#fff}.btn-coke:hover{background:var(--coke-d);box-shadow:0 4px 12px rgba(196,30,30,.3)}
.btn-outline{background:var(--s0);border:1px solid var(--border);color:var(--t2)}.btn-outline:hover{border-color:var(--coke);color:var(--coke)}
.btn-ghost{background:transparent;color:var(--t3);padding:6px 10px}.btn-ghost:hover{color:var(--t1);background:var(--s2)}
.btn-sm{font-size:10px;padding:6px 12px}.btn-xs{font-size:9px;padding:4px 8px;border-radius:6px}
.avatar{border-radius:50%;object-fit:cover;border:2px solid var(--s0);box-shadow:0 0 0 1px var(--border)}
.kpi-value{font-size:22px;font-weight:800;font-family:var(--fm);letter-spacing:-.04em;line-height:1}
.metric-bar{height:5px;background:var(--s3);border-radius:3px;overflow:hidden}
.metric-fill{height:100%;border-radius:3px;transition:width .8s cubic-bezier(.16,1,.3,1)}
.admin-tab{padding:0 18px;height:42px;display:flex;align-items:center;font-size:11px;font-weight:600;color:var(--tm);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--fb);gap:8px}
.admin-tab:hover{color:var(--t1);background:var(--s1)}.admin-tab.active{color:var(--coke);border-bottom-color:var(--coke);font-weight:700;background:var(--coke-l)}
.sidebar-section{padding:0 12px;margin-bottom:4px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--tf)}
.sidebar-btn{display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:var(--rs);font-size:12px;font-weight:500;color:var(--t2);cursor:pointer;transition:all .12s;border:none;background:none;width:100%;text-align:left;font-family:var(--fb)}
.sidebar-btn:hover{background:var(--s2);color:var(--t1)}
.sidebar-btn.active{background:linear-gradient(135deg,var(--coke-l),rgba(196,30,30,.06));color:var(--coke);font-weight:700;box-shadow:inset 0 0 0 1px var(--coke-b)}
.sidebar-btn .icon{width:18px;text-align:center;font-size:14px;opacity:.5}.sidebar-btn.active .icon{opacity:1}
.live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);display:inline-block;animation:pulse 2s infinite}
.status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.msg-row{display:flex;gap:12px;padding:14px 0;align-items:flex-start}.msg-row+.msg-row{border-top:1px solid var(--bsub)}
.msg-bubble{background:var(--s1);border-radius:0 var(--r) var(--r) var(--r);padding:10px 14px;font-size:11px;line-height:1.6;color:var(--t2)}
.gradient-premium{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)}
.tbl{width:100%;border-collapse:collapse;font-size:11px}
.tbl th{text-align:left;padding:10px 14px;background:var(--s1);font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--tm);border-bottom:1px solid var(--border)}
.tbl td{padding:10px 14px;border-bottom:1px solid var(--bsub);vertical-align:middle}
.tbl tr:hover td{background:var(--s1)}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
@media(max-width:1024px){:root{--sw:64px}.sidebar-label{display:none!important}.sidebar-section{display:none!important}#teamSidebar{display:none!important}#currentUser span{display:none!important}}
@media(max-width:768px){.brand-bar .hide-m{display:none!important}.main-grid{flex-direction:column!important}.sidebar-wrap{display:none!important}.kpi-grid{grid-template-columns:1fr 1fr!important}.chart-grid{grid-template-columns:1fr!important}.bottom-grid{grid-template-columns:1fr!important}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<!-- Brand Bar -->
<div class="gradient-premium brand-bar" style="height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 28px">
  <div style="display:flex;align-items:center;gap:16px">
    <span style="color:#fff;font-size:18px;font-weight:800;font-style:italic;letter-spacing:-.5px;font-family:Georgia,serif">Coca-Cola</span>
    <div style="width:1px;height:16px;background:rgba(255,255,255,.08)"></div>
    <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,.25);letter-spacing:.14em;font-family:var(--fd)" class="hide-m">THE COCA-COLA COMPANY</span>
    <span style="font-size:8px;padding:3px 10px;border-radius:4px;background:linear-gradient(135deg,rgba(196,30,30,.4),rgba(196,30,30,.2));color:#FCA5A5;font-weight:800;letter-spacing:.06em;border:1px solid rgba(196,30,30,.2)">ENTERPRISE</span>
  </div>
  <div style="display:flex;align-items:center;gap:20px">
    <div style="display:flex;align-items:center;gap:10px" class="hide-m">
      <span style="font-size:10px;color:rgba(255,255,255,.2);font-family:var(--fm)">NYSE: KO</span>
      <span style="font-size:11px;font-weight:800;color:rgba(255,255,255,.7);font-family:var(--fm)">$62.34</span>
      <span style="font-size:10px;color:#6EE7B7;font-weight:700;display:flex;align-items:center;gap:3px"><span class="live-dot" style="width:4px;height:4px"></span>+0.47%</span>
    </div>
    <div style="width:1px;height:14px;background:rgba(255,255,255,.06)" class="hide-m"></div>
    <div style="display:flex;align-items:center;gap:6px"><span class="live-dot" style="width:5px;height:5px"></span><span style="font-size:9px;color:rgba(255,255,255,.35);font-family:var(--fm)">LIVE</span></div>
    <span style="font-size:10px;color:rgba(255,255,255,.2);font-family:var(--fm)" class="hide-m" id="clockDisplay">Mar 25, 2026</span>
  </div>
</div>
<!-- Admin Nav -->
<div style="background:var(--s0);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;padding:0 24px;position:sticky;top:0;z-index:100;box-shadow:var(--sh-xs)">
  <div style="display:flex;align-items:center;gap:0">
    <div style="display:flex;align-items:center;gap:8px;padding:0 20px 0 0;margin-right:14px;border-right:1px solid var(--border);height:42px">
      <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="fos" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#fos)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#059669"/></svg>
      <span style="font-size:13px;font-weight:800;letter-spacing:-.02em;font-family:var(--fd)">FinanceOS</span>
    </div>
    <div id="adminTabs" style="display:flex;height:42px"></div>
  </div>
  <div style="display:flex;align-items:center;gap:6px">
    <button class="btn btn-ghost btn-sm" onclick="togglePanel('security')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Security
    </button>
    <button class="btn btn-ghost btn-sm" onclick="togglePanel('ai')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg> AI
    </button>
    <button class="btn btn-outline btn-sm" onclick="togglePanel('copilot')">Copilot</button>
    <button class="btn btn-coke btn-sm">Share with Board</button>
  </div>
</div>
<!-- Main Layout -->
<div class="main-grid" style="display:flex;height:calc(100vh - 86px)">
  <!-- Sidebar -->
  <div class="sidebar-wrap" style="width:var(--sw);border-right:1px solid var(--border);background:var(--s0);padding:16px 10px;flex-shrink:0;overflow-y:auto;display:flex;flex-direction:column">
    <div style="padding:0 6px;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:var(--rs);background:var(--s2)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search..." style="border:none;background:none;font-family:var(--fb);font-size:11px;color:var(--t1);outline:none;width:100%">
      </div>
    </div>
    <div class="sidebar-section">Finance</div>
    <div id="sidebarFinance" style="margin-bottom:8px"></div>
    <div style="height:1px;background:var(--bsub);margin:6px 10px"></div>
    <div class="sidebar-section">Organization</div>
    <div id="sidebarOrg" style="margin-bottom:8px"></div>
    <div style="height:1px;background:var(--bsub);margin:6px 10px"></div>
    <div class="sidebar-section">Intelligence</div>
    <div id="sidebarAI" style="margin-bottom:8px"></div>
    <div style="height:1px;background:var(--bsub);margin:6px 10px"></div>
    <div class="sidebar-section">Team Online</div>
    <div id="teamSidebar" style="padding:4px 6px"></div>
    <div style="flex:1"></div>
    <div style="padding:10px;border-top:1px solid var(--bsub);margin-top:8px"><div id="currentUser" style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--rs)"></div></div>
  </div>
  <!-- Content -->
  <div style="flex:1;overflow-y:auto;padding:24px 28px;background:var(--bg)" id="content"></div>
  <!-- Right Panel -->
  <div id="rightPanel" style="display:none;width:380px;border-left:1px solid var(--border);background:var(--s0);flex-shrink:0;overflow-y:auto"></div>
</div>


` }} />
    </>
  );
}
