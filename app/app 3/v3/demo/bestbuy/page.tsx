'use client';

import { useEffect, useRef } from 'react';

export default function V3DemoBestbuyPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const admins=[
  {id:"cfo",name:"Robert Chen",role:"Chief Financial Officer",shortRole:"CFO",photo:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&fit=crop&crop=face",status:"online",dept:"Executive",focus:"P&L, Margins, Capital Allocation"},
  {id:"vpf",name:"Amanda Torres",role:"VP Finance",shortRole:"VP Finance",photo:"https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=80&q=80&fit=crop&crop=face",status:"online",dept:"Finance",focus:"Revenue, OpEx, Store Economics"},
  {id:"ctrl",name:"Kevin Park",role:"Controller",shortRole:"Controller",photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&fit=crop&crop=face",status:"away",dept:"Accounting",focus:"Close, Compliance, Inventory"},
  {id:"fpa",name:"Diana Okafor",role:"FP&A Director",shortRole:"FP&A",photo:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80&fit=crop&crop=face",status:"online",dept:"Planning",focus:"Forecast, Budget, Store Models"},
  {id:"trs",name:"Michael Santos",role:"Treasury Director",shortRole:"Treasury",photo:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80&fit=crop&crop=face",status:"offline",dept:"Treasury",focus:"Cash, Debt, Share Repurchases"},
  {id:"ir",name:"Rachel Goldman",role:"Investor Relations",shortRole:"IR",photo:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&fit=crop&crop=face",status:"online",dept:"IR",focus:"Consensus, Guidance, Earnings"},
];
const kpis=[
  {l:"Net Revenue",v:"$43.5B",d:"+1.8%",u:1,bar:"var(--bb)",n:"FY2025 Consolidated",spark:[40.2,41.0,41.8,42.3,42.8,43.1,43.5]},
  {l:"Gross Margin",v:"22.4%",d:"+30bps",u:1,bar:"var(--green)",n:"vs 22.1% prior year",spark:[21.6,21.8,22.0,22.0,22.1,22.2,22.4]},
  {l:"Operating Income",v:"$1.9B",d:"-2.1%",u:0,bar:"var(--amber)",n:"4.4% operating margin",spark:[2.1,2.0,2.0,1.95,1.92,1.90,1.9]},
  {l:"Free Cash Flow",v:"$1.6B",d:"+8.4%",u:1,bar:"var(--green)",n:"Strong cash generation",spark:[1.2,1.25,1.3,1.35,1.4,1.5,1.6]},
  {l:"EPS (Diluted)",v:"$6.12",d:"+3.8%",u:1,bar:"var(--purple)",n:"vs $5.90 prior year",spark:[5.50,5.60,5.72,5.80,5.90,6.00,6.12]},
  {l:"Same-Store Sales",v:"+0.6%",d:"Recovery",u:1,bar:"var(--cyan)",n:"Positive trend Q3-Q4",spark:[-2.1,-1.4,-0.8,-0.3,0.1,0.4,0.6]},
];
const segs=[
  {n:"Domestic",r:40100,p:92.2,g:1.6,m:5.1,c:"var(--bb)",emoji:"🇺🇸"},
  {n:"International",r:3400,p:7.8,g:-3.2,m:2.8,c:"var(--purple)",emoji:"🌎"},
  {n:"Services & Warranties",r:2800,p:6.4,g:12.4,m:58.2,c:"var(--green)",emoji:"🛠️"},
  {n:"Best Buy Health",r:800,p:1.8,g:24.6,m:14.5,c:"var(--cyan)",emoji:"🏥"},
  {n:"Best Buy Business",r:1200,p:2.8,g:8.1,m:6.8,c:"var(--amber)",emoji:"🏢"},
  {n:"Online Channel",r:15600,p:35.9,g:4.2,m:4.8,c:"var(--indigo)",emoji:"💻"},
];
const tasks=[
  {t:"Review Q4 holiday earnings results",a:"Amanda Torres",p:"high",due:"Mar 26",s:"In Progress",c:"Reporting",pct:65},
  {t:"Tech refresh cycle revenue forecast",a:"Diana Okafor",p:"high",due:"Mar 27",s:"In Review",c:"Modeling",pct:80},
  {t:"Services attach rate expansion plan",a:"Robert Chen",p:"high",due:"Mar 25",s:"Draft",c:"Strategy",pct:30},
  {t:"Geek Squad margin optimization",a:"Kevin Park",p:"medium",due:"Mar 28",s:"In Progress",c:"Analysis",pct:45},
  {t:"Store footprint optimization model",a:"Diana Okafor",p:"medium",due:"Mar 30",s:"Not Started",c:"Planning",pct:0},
  {t:"Membership program KPI dashboard",a:"Amanda Torres",p:"high",due:"Mar 26",s:"In Progress",c:"Product",pct:55},
  {t:"Share repurchase authorization review",a:"Michael Santos",p:"medium",due:"Apr 2",s:"Not Started",c:"Treasury",pct:0},
  {t:"Analyst day presentation prep",a:"Rachel Goldman",p:"low",due:"Apr 10",s:"Not Started",c:"IR",pct:0},
];
const msgs=[
  {from:admins[1],text:"Holiday quarter came in strong — CE revenue +3.2%, driven by premium laptop and tablet refresh cycle. Services attach rate hit 34% in Q4, up 280bps YoY.",time:"2:30 PM",reactions:["📊","👍"]},
  {from:admins[0],text:"Good numbers. The services margin story is what's going to move the stock. Need that front and center in the earnings script. What's the Totaltech membership renewal rate?",time:"2:35 PM",reactions:[]},
  {from:admins[3],text:"Totaltech renewals at 72% — better than our 65% target. Adding 40K net new members per month. I've modeled this out to $4.2B services TAM by FY2027.",time:"2:41 PM",reactions:["🔥","✅"]},
  {from:admins[2],text:"Inventory turns improved to 7.2x from 6.8x. Appliance clearance worked — markdowns came in $18M under budget. Clean balance sheet going into Q1.",time:"2:55 PM",reactions:["👍"]},
  {from:admins[5],text:"Street consensus has us at $43.2B revenue — we beat by $300M. Recommending we guide Q1 conservatively and let the services momentum build credibility.",time:"3:10 PM",reactions:["💬"]},
];
const aiFlows=[
  {name:"Holiday Demand Forecast",status:"active",model:"Claude Opus",desc:"Analyzing post-holiday demand patterns for spring reset planning",assigned:"Diana Okafor",confidence:92},
  {name:"Store Traffic Analyzer",status:"active",model:"GPT-4o",desc:"Foot traffic vs conversion optimization across 1,000+ locations",assigned:"Amanda Torres",confidence:88},
  {name:"Services Attach Optimizer",status:"active",model:"Claude Sonnet",desc:"ML model predicting optimal service bundle for each product category",assigned:"Robert Chen",confidence:95},
  {name:"Inventory Turnover Monitor",status:"idle",model:"Claude Opus",desc:"Real-time SKU-level inventory health scoring",assigned:"Kevin Park",confidence:91},
  {name:"Competitive Price Watch",status:"active",model:"GPT-4o",desc:"Amazon/Walmart price gap monitoring across 50K SKUs",assigned:"Diana Okafor",confidence:87},
  {name:"Membership Churn Predictor",status:"queued",model:"Claude Sonnet",desc:"Totaltech member retention risk scoring",assigned:"Rachel Goldman",confidence:0},
];
let activeAdmin="cfo",activeView="overview",panelOpen=null;
function sparkline(data,color,w=60,h=24){const max=Math.max(...data),min=Math.min(...data),range=max-min||1;const pts=data.map((v,i)=>\`\${(i/(data.length-1))*w},\${h-((v-min)/range)*h}\`).join(' ');return \`<svg width="\${w}" height="\${h}" viewBox="0 0 \${w} \${h}" style="overflow:visible"><polyline points="\${pts}" fill="none" stroke="\${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="\${w}" cy="\${h-((data[data.length-1]-min)/range)*h}" r="2" fill="\${color}"/></svg>\`;}
function renderAdminTabs(){document.getElementById('adminTabs').innerHTML=admins.map(a=>\`<button class="admin-tab \${a.id===activeAdmin?'active':''}" onclick="switchAdmin('\${a.id}')"><div style="position:relative"><img src="\${a.photo}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:2px solid \${a.id===activeAdmin?'var(--bb)':'transparent'}"><div class="status-dot" style="position:absolute;bottom:-1px;right:-1px;width:7px;height:7px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'};border:2px solid var(--surface-0)"></div></div><span>\${a.shortRole}</span></button>\`).join('');}
function switchAdmin(id){activeAdmin=id;renderAdminTabs();renderSidebar();renderContent();}
function renderSidebar(){
  const fin=[{l:"Overview",v:"overview"},{l:"P&L Statement",v:"pnl"},{l:"Segments",v:"segments"},{l:"Forecast",v:"forecast"},{l:"Cash Flow",v:"cashflow"},{l:"Board Deck",v:"board"}];
  const org=[{l:"Tasks",v:"tasks",b:tasks.filter(t=>t.s!=="Complete").length},{l:"Messages",v:"messages",b:msgs.length},{l:"Team",v:"team"},{l:"Calendar",v:"calendar"},{l:"Documents",v:"docs"},{l:"Pipeline",v:"pipeline"}];
  document.getElementById('sidebarFinance').innerHTML=fin.map(f=>\`<button class="sidebar-btn \${f.v===activeView?'active':''}" onclick="switchView('\${f.v}')">\${f.l}</button>\`).join('');
  document.getElementById('sidebarOrg').innerHTML=org.map(o=>\`<button class="sidebar-btn \${o.v===activeView?'active':''}" onclick="switchView('\${o.v}')">\${o.l}\${o.b?\`<span class="tag tag-sm" style="background:var(--bb);color:#fff;margin-left:auto">\${o.b}</span>\`:''}</button>\`).join('');
  document.getElementById('teamSidebar').innerHTML=admins.map(a=>\`<div style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:var(--r-sm);cursor:pointer;transition:all .12s;margin-bottom:2px" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'" onclick="switchAdmin('\${a.id}')"><div style="position:relative"><img src="\${a.photo}" class="avatar" style="width:24px;height:24px"><div class="status-dot" style="position:absolute;bottom:-1px;right:-1px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'};border:2px solid var(--surface-0)"></div></div><span style="font-size:10px;font-weight:600;color:var(--text-secondary)">\${a.name.split(' ')[0]}</span></div>\`).join('');
  const admin=admins.find(a=>a.id===activeAdmin);
  document.getElementById('currentUser').innerHTML=\`<img src="\${admin.photo}" class="avatar" style="width:32px;height:32px"><div><div style="font-size:11px;font-weight:700">\${admin.name}</div><div style="font-size:9px;color:var(--text-muted)">\${admin.role}</div></div>\`;
}
function switchView(v){activeView=v;renderSidebar();renderContent();}
function togglePanel(type){const p=document.getElementById('rightPanel');if(panelOpen===type){p.style.display='none';panelOpen=null;return;}panelOpen=type;p.style.display='block';p.innerHTML=\`<div style="padding:20px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px"><div style="display:flex;align-items:center;gap:8px"><div style="width:32px;height:32px;border-radius:var(--r-sm);background:linear-gradient(135deg,var(--purple),var(--blue));display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="3"/></svg></div><div><div style="font-size:13px;font-weight:800;font-family:var(--font-display)">AI Copilot</div><div style="font-size:9px;color:var(--text-muted)">Claude Opus · Enterprise</div></div></div><button class="btn btn-ghost btn-xs" onclick="togglePanel('copilot')">✕</button></div><div style="background:var(--surface-1);border-radius:var(--r);padding:16px;margin-bottom:16px;border:1px solid var(--border-subtle)"><div style="font-size:10px;font-weight:700;color:var(--purple);margin-bottom:8px"><span class="live-dot" style="background:var(--purple)"></span> Thinking...</div><div style="font-size:11px;color:var(--text-secondary);line-height:1.7">Holiday quarter analysis complete. Key finding: <strong>Services revenue growth (+12.4%)</strong> is driving margin expansion despite flat CE revenue. Totaltech membership is the strongest moat in the model.</div></div><div style="display:flex;gap:6px;flex-wrap:wrap">\${['Summarize Q4','Services forecast','Store economics','Comp analysis'].map(q=>\`<button class="btn btn-outline btn-xs">\${q}</button>\`).join('')}</div></div>\`;}

function renderContent(){
  const el=document.getElementById('content'),admin=admins.find(a=>a.id===activeAdmin);
  if(activeView==='overview') el.innerHTML=renderOverview(admin);
  else if(activeView==='tasks') el.innerHTML=renderTasks(admin);
  else if(activeView==='messages') el.innerHTML=renderMessages(admin);
  else if(activeView==='team') el.innerHTML=renderTeam(admin);
  else if(activeView==='segments') el.innerHTML=renderSegments(admin);
  else el.innerHTML=\`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;color:var(--text-muted)"><div style="width:64px;height:64px;border-radius:var(--r-xl);background:var(--surface-2);display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:24px">◆</div><div style="font-size:18px;font-weight:800;font-family:var(--font-display);margin-bottom:6px;color:var(--text-secondary)">\${activeView.charAt(0).toUpperCase()+activeView.slice(1)}</div><div style="font-size:12px;max-width:300px;text-align:center">Available in the full FinanceOS Enterprise deployment.</div></div>\`;
}

function renderOverview(admin){
  const pColor=p=>p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';
  return \`
  <div class="card fade" style="padding:0;margin-bottom:20px;overflow:hidden;border:none;box-shadow:var(--shadow-md)">
    <div style="display:grid;grid-template-columns:1fr 320px;min-height:160px">
      <div style="padding:32px 36px;display:flex;flex-direction:column;justify-content:center">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <span class="tag" style="background:var(--green-bg);color:var(--green);border:1px solid var(--green-border)"><span class="live-dot" style="width:5px;height:5px"></span> All Systems Nominal</span>
          <span class="tag" style="background:var(--purple-bg);color:var(--purple);border:1px solid var(--purple-border)">◎ AI Copilot Active</span>
          <span class="tag" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">FY2025</span>
        </div>
        <h1 style="font-size:26px;font-weight:900;letter-spacing:-.04em;font-family:var(--font-display);margin-bottom:6px">\${admin.shortRole} Command Center</h1>
        <p style="font-size:12px;color:var(--text-tertiary)">Welcome back, \${admin.name.split(' ')[0]}. <strong style="color:var(--text-secondary)">\${tasks.filter(t=>t.p==='high').length} high-priority items</strong> require your attention.</p>
      </div>
      <div style="position:relative;overflow:hidden"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&fit=crop" style="width:100%;height:100%;object-fit:cover" alt=""><div style="position:absolute;inset:0;background:linear-gradient(90deg,var(--surface-0) 0%,rgba(255,255,255,0) 50%)"></div></div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px">\${kpis.map((k,i)=>\`<div class="card fade" style="padding:18px 20px;animation-delay:\${i*.06}s;cursor:pointer"><div class="card-accent" style="background:\${k.bar}"></div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px"><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted)">\${k.l}</div>\${sparkline(k.spark,k.bar)}</div><div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px"><span class="kpi-value">\${k.v}</span><span class="tag tag-sm" style="background:\${k.u?'var(--green-bg)':'var(--red-bg)'};color:\${k.u?'var(--green)':'var(--red)'}">▲ \${k.d}</span></div><div style="font-size:9px;color:var(--text-faint)">\${k.n}</div></div>\`).join('')}</div>
  <div style="display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:14px;margin-bottom:20px">
    <div class="card" style="padding:22px"><div class="card-accent" style="background:var(--bb)"></div><div style="font-size:14px;font-weight:800;font-family:var(--font-display);margin-bottom:16px">Quick Actions</div>\${[{l:"High Priority",v:tasks.filter(t=>t.p==='high').length,c:"var(--red)",bg:"var(--red-bg)",click:"tasks"},{l:"Messages",v:msgs.length,c:"var(--blue)",bg:"var(--blue-bg)",click:"messages"},{l:"AI Flows",v:aiFlows.filter(f=>f.status==='active').length,c:"var(--purple)",bg:"var(--purple-bg)",click:"overview"},{l:"Board Meeting",v:"Mar 28",c:"var(--green)",bg:"var(--green-bg)",click:"board"}].map(a=>\`<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--r-sm);border:1px solid var(--border-subtle);margin-bottom:8px;cursor:pointer;transition:all .15s" onclick="switchView('\${a.click}')" onmouseover="this.style.borderColor='var(--bb)';this.style.background='var(--bb-light)'" onmouseout="this.style.borderColor='var(--border-subtle)';this.style.background='transparent'"><span style="font-size:11px;font-weight:600;flex:1">\${a.l}</span><span class="tag tag-sm" style="background:\${a.bg};color:\${a.c}">\${a.v}</span></div>\`).join('')}</div>
    <div class="card" style="padding:22px"><div class="card-accent" style="background:linear-gradient(90deg,var(--bb),var(--amber))"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span style="font-size:14px;font-weight:800;font-family:var(--font-display)">Business Segments</span><span class="tag" style="background:var(--surface-2);color:var(--text-tertiary);border:1px solid var(--border)">$43.5B</span></div>\${segs.map(s=>\`<div style="display:grid;grid-template-columns:130px 1fr 55px 45px;gap:8px;align-items:center;padding:7px 4px;font-size:10px"><div style="display:flex;align-items:center;gap:6px"><div style="width:8px;height:8px;border-radius:3px;background:\${s.c}"></div><span style="font-weight:600">\${s.n}</span></div><div class="metric-bar"><div class="metric-fill" style="width:\${Math.min(s.p*2.5,100)}%;background:\${s.c};opacity:.6"></div></div><span style="font-weight:800;font-family:var(--font-mono);font-size:10px;text-align:right">$\${(s.r/1000).toFixed(1)}B</span><span style="font-weight:700;color:\${s.g>=0?'var(--green)':'var(--red)'};font-size:10px;text-align:right;font-family:var(--font-mono)">\${s.g>=0?'+':''}\${s.g}%</span></div>\`).join('')}</div>
    <div class="card" style="padding:22px"><div class="card-accent" style="background:linear-gradient(90deg,var(--purple),var(--blue))"></div><div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><span style="font-size:14px;font-weight:800;font-family:var(--font-display)">AI Insights</span><span class="tag tag-sm" style="background:var(--purple-bg);color:var(--purple)"><span class="live-dot" style="background:var(--purple);width:4px;height:4px"></span> LIVE</span></div>\${[{t:"Services attach rate hit 34% in Q4 — above 30% target. Recommend expanding Geek Squad in-store staffing.",c:"var(--green)",bg:"var(--green-bg)",conf:95,model:"Claude Opus"},{t:"Appliance category margin pressure: -180bps. Samsung/LG competitive pricing intensifying.",c:"var(--amber)",bg:"var(--amber-bg)",conf:89,model:"GPT-4o"},{t:"Totaltech membership renewals at 72% — highest since launch. LTV model updated.",c:"var(--blue)",bg:"var(--blue-bg)",conf:94,model:"Claude Sonnet"}].map(ins=>\`<div style="padding:10px 12px;border-radius:var(--r-sm);background:\${ins.bg};border:1px solid \${ins.c}12;margin-bottom:8px"><div style="font-size:10px;color:var(--text-secondary);line-height:1.6;margin-bottom:6px">\${ins.t}</div><div style="display:flex;align-items:center;gap:6px"><span style="font-size:8px;background:var(--surface-0);padding:1px 6px;border-radius:3px;color:var(--text-muted)">\${ins.model}</span><span style="font-size:8px;color:\${ins.c};font-weight:700;font-family:var(--font-mono)">\${ins.conf}%</span></div></div>\`).join('')}<button class="btn btn-outline" style="width:100%;justify-content:center;margin-top:4px" onclick="togglePanel('copilot')">Open AI Copilot →</button></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
    <div class="card" style="padding:22px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span style="font-size:14px;font-weight:800;font-family:var(--font-display)">Team Messages</span><button class="btn btn-ghost btn-sm" onclick="switchView('messages')">View all →</button></div>\${msgs.slice(0,3).map(m=>\`<div class="msg-row"><img src="\${m.from.photo}" class="avatar" style="width:32px;height:32px;flex-shrink:0"><div style="flex:1"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span style="font-size:11px;font-weight:700">\${m.from.name}</span><span style="font-size:9px;color:var(--text-faint)">\${m.time}</span></div><div class="msg-bubble">\${m.text}</div></div></div>\`).join('')}</div>
    <div class="card" style="padding:22px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span style="font-size:14px;font-weight:800;font-family:var(--font-display)">Priority Tasks</span><button class="btn btn-ghost btn-sm" onclick="switchView('tasks')">View all →</button></div>\${tasks.filter(t=>t.p==='high').slice(0,4).map(t=>{const sC=t.s==='In Progress'?'var(--blue)':t.s==='In Review'?'var(--purple)':'var(--amber)';return \`<div class="task-row" style="margin-bottom:4px"><div class="status-dot" style="background:\${pColor(t.p)}"></div><div style="flex:1"><div style="font-size:11px;font-weight:600;margin-bottom:3px">\${t.t}</div><div class="metric-bar" style="width:80px"><div class="metric-fill" style="width:\${t.pct}%;background:\${sC}"></div></div></div><img src="\${admins.find(a=>a.name===t.a)?.photo||''}" style="width:18px;height:18px;border-radius:50%;object-fit:cover"><span class="tag tag-sm" style="background:\${sC}10;color:\${sC}">\${t.s}</span></div>\`}).join('')}</div>
  </div>
  <div style="padding:18px 24px;border-radius:var(--r-lg);background:linear-gradient(135deg,rgba(37,99,235,.03),rgba(124,58,237,.02));border:1px solid rgba(37,99,235,.06);display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;gap:12px"><svg width="24" height="24" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg3" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg3)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#059669"/></svg><div><div style="font-size:12px;font-weight:800;font-family:var(--font-display)">Powered by FinanceOS · Enterprise</div><div style="font-size:10px;color:var(--text-muted)">SOC 2 Type II · AES-256 · 99.9% Uptime · GDPR</div></div></div><a href="https://finance-os.app" target="_blank" class="btn btn-bb btn-sm" style="text-decoration:none">Learn More →</a></div>\`;
}

function renderTasks(admin){
  const pColor=p=>p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';const sColor=s=>s==='In Progress'?'var(--blue)':s==='In Review'?'var(--purple)':s==='Draft'?'var(--amber)':'var(--text-muted)';
  return \`<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px"><div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Organization</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Task Management</h2></div><button class="btn btn-bb">+ New Task</button></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">\${[{l:"All Tasks",v:tasks.length,c:"var(--bb)"},{l:"High Priority",v:tasks.filter(t=>t.p==='high').length,c:"var(--red)"},{l:"In Progress",v:tasks.filter(t=>t.s==='In Progress').length,c:"var(--blue)"},{l:"In Review",v:tasks.filter(t=>t.s==='In Review').length,c:"var(--purple)"}].map((s,i)=>\`<div class="card fade" style="padding:18px;text-align:center;animation-delay:\${i*.06}s"><div class="card-accent" style="background:\${s.c}"></div><div style="font-size:28px;font-weight:900;font-family:var(--font-mono);color:\${s.c}">\${s.v}</div><div style="font-size:10px;color:var(--text-muted);font-weight:600;margin-top:4px">\${s.l}</div></div>\`).join('')}</div>
  <div class="card" style="padding:0;overflow:hidden">\${tasks.map((t,i)=>\`<div style="display:flex;align-items:center;gap:10px;padding:12px 20px;border-bottom:1px solid var(--border-subtle);transition:background .1s;cursor:pointer" onmouseover="this.style.background='var(--surface-1)'" onmouseout="this.style.background='transparent'"><div class="status-dot" style="background:\${pColor(t.p)}"></div><div style="flex:1"><div style="font-size:11px;font-weight:600">\${t.t}</div><div style="font-size:9px;color:var(--text-muted)">\${t.c}</div></div><div style="display:flex;align-items:center;gap:6px"><img src="\${admins.find(a=>a.name===t.a)?.photo||''}" style="width:22px;height:22px;border-radius:50%;object-fit:cover"><span style="font-size:10px;color:var(--text-secondary)">\${t.a.split(' ')[0]}</span></div><span class="tag" style="background:\${sColor(t.s)}10;color:\${sColor(t.s)}">\${t.s}</span><span style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">\${t.due}</span></div>\`).join('')}</div>\`;
}
function renderMessages(admin){
  return \`<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px"><div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Communication Hub</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Team Messages</h2></div></div>
  <div class="card" style="padding:24px">\${msgs.map((m,i)=>\`<div class="msg-row fade" style="animation-delay:\${i*.06}s"><img src="\${m.from.photo}" class="avatar" style="width:36px;height:36px;flex-shrink:0"><div style="flex:1"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:12px;font-weight:700">\${m.from.name}</span><span style="font-size:9px;color:var(--text-muted)">\${m.from.shortRole}</span><span style="font-size:9px;color:var(--text-faint)">\${m.time}</span></div><div class="msg-bubble">\${m.text}</div>\${m.reactions.length?\`<div style="display:flex;gap:4px;margin-top:6px">\${m.reactions.map(r=>\`<span style="font-size:12px;background:var(--surface-2);padding:3px 8px;border-radius:12px">\${r}</span>\`).join('')}</div>\`:''}</div></div>\`).join('')}</div>\`;
}
function renderTeam(admin){
  return \`<div style="margin-bottom:24px"><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Organization</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Finance Team</h2></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">\${admins.map((a,i)=>\`<div class="card fade" style="padding:24px;animation-delay:\${i*.06}s;cursor:pointer" onclick="switchAdmin('\${a.id}')"><div class="card-accent" style="background:\${a.status==='online'?'var(--green)':'var(--text-faint)'}"></div><div style="display:flex;align-items:center;gap:14px;margin-bottom:16px"><div style="position:relative"><img src="\${a.photo}" class="avatar" style="width:52px;height:52px"><div class="status-dot" style="position:absolute;bottom:1px;right:1px;width:10px;height:10px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'};border:2px solid var(--surface-0)"></div></div><div><div style="font-size:14px;font-weight:800;font-family:var(--font-display)">\${a.name}</div><div style="font-size:11px;color:var(--text-tertiary)">\${a.role}</div></div></div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:4px">Focus</div><div style="font-size:10px;color:var(--text-secondary)">\${a.focus}</div></div>\`).join('')}</div>\`;
}
function renderSegments(admin){
  return \`<div style="margin-bottom:24px"><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Finance</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Business Segments</h2></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">\${segs.map((s,i)=>\`<div class="card fade" style="padding:22px;animation-delay:\${i*.06}s"><div class="card-accent" style="background:\${s.c}"></div><div style="display:flex;justify-content:space-between;margin-bottom:14px"><div><div style="font-size:15px;font-weight:800;font-family:var(--font-display)">\${s.n}</div><div style="font-size:10px;color:var(--text-muted)">\${s.p}% of revenue</div></div><span style="font-size:20px">\${s.emoji}</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px"><div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:4px">Revenue</div><div style="font-size:18px;font-weight:800;font-family:var(--font-mono)">$\${(s.r/1000).toFixed(1)}B</div></div><div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:4px">Growth</div><div style="font-size:18px;font-weight:800;font-family:var(--font-mono);color:\${s.g>=0?'var(--green)':'var(--red)'}">\${s.g>=0?'+':''}\${s.g}%</div></div></div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:4px">Operating Margin</div><div class="metric-bar" style="height:8px"><div class="metric-fill" style="width:\${Math.min(s.m*1.6,100)}%;background:\${s.c}"></div></div><div style="font-size:11px;font-weight:700;color:\${s.c};font-family:var(--font-mono);margin-top:4px">\${s.m}%</div></div>\`).join('')}</div>\`;
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
:root{
  --bg:#F4F5F7;--surface-0:#FFFFFF;--surface-1:#F9FAFB;--surface-2:#F3F4F6;--surface-3:#E8EAEF;
  --border:#E2E5EB;--border-subtle:#ECEEF3;
  --text-primary:#0A0F1A;--text-secondary:#3B4559;--text-tertiary:#6B7A94;--text-muted:#9CA7B8;--text-faint:#C2CAD6;
  --bb:#0046BE;--bb-dark:#003399;--bb-deep:#001E73;--bb-light:#EBF2FF;--bb-border:rgba(0,70,190,0.08);
  --bb-yellow:#FFE000;--bb-yellow-dark:#CCBA00;
  --green:#059669;--green-bg:#ECFDF5;--green-border:rgba(5,150,105,0.12);
  --red:#DC2626;--red-bg:#FEF2F2;
  --amber:#D97706;--amber-bg:#FFFBEB;--amber-border:rgba(217,119,6,0.12);
  --blue:#2563EB;--blue-bg:#EFF6FF;--blue-border:rgba(37,99,235,0.12);
  --purple:#7C3AED;--purple-bg:#F5F3FF;--purple-border:rgba(124,58,237,0.12);
  --cyan:#0891B2;--cyan-bg:#ECFEFF;--indigo:#4F46E5;--indigo-bg:#EEF2FF;
  --font-display:'Inter',system-ui,sans-serif;--font-body:'Manrope',system-ui,sans-serif;--font-mono:'JetBrains Mono',monospace;
  --shadow-xs:0 1px 2px rgba(0,0,0,0.04);--shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:0 4px 6px -1px rgba(0,0,0,0.05),0 2px 4px -2px rgba(0,0,0,0.03);--shadow-lg:0 10px 15px -3px rgba(0,0,0,0.06);
  --shadow-card:0 0 0 1px var(--border),0 1px 3px rgba(0,0,0,0.04);
  --r-xs:6px;--r-sm:8px;--r:12px;--r-lg:16px;--r-xl:20px;--sidebar-w:240px;
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text-primary);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow:hidden;height:100vh;font-size:13px;line-height:1.5}
::selection{background:var(--bb);color:#fff}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.fade{animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both}
.card{background:var(--surface-0);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--shadow-xs);position:relative;transition:all .2s cubic-bezier(.16,1,.3,1)}
.card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px)}
.card-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r-lg) var(--r-lg) 0 0}
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:.03em}
.tag-sm{font-size:9px;padding:2px 7px}
.btn{font-family:var(--font-body);cursor:pointer;border:none;border-radius:var(--r-sm);font-weight:700;font-size:11px;padding:8px 16px;display:inline-flex;align-items:center;gap:6px;transition:all .15s;white-space:nowrap}
.btn-bb{background:var(--bb);color:#fff}.btn-bb:hover{background:var(--bb-dark);box-shadow:0 4px 12px rgba(0,70,190,0.3);transform:translateY(-1px)}
.btn-outline{background:var(--surface-0);border:1px solid var(--border);color:var(--text-secondary)}.btn-outline:hover{border-color:var(--bb);color:var(--bb);background:var(--bb-light)}
.btn-ghost{background:transparent;color:var(--text-tertiary);padding:6px 10px}.btn-ghost:hover{color:var(--text-primary);background:var(--surface-2)}
.btn-sm{font-size:10px;padding:6px 12px}.btn-xs{font-size:9px;padding:4px 8px;border-radius:var(--r-xs)}
.avatar{border-radius:50%;object-fit:cover;border:2px solid var(--surface-0);box-shadow:0 0 0 1px var(--border)}
.sidebar-section{padding:0 12px;margin-bottom:4px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint)}
.sidebar-btn{display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:var(--r-sm);font-size:12px;font-weight:500;color:var(--text-secondary);cursor:pointer;transition:all .12s;border:none;background:none;width:100%;text-align:left;font-family:var(--font-body)}
.sidebar-btn:hover{background:var(--surface-2);color:var(--text-primary)}
.sidebar-btn.active{background:linear-gradient(135deg,var(--bb-light),rgba(0,70,190,0.06));color:var(--bb);font-weight:700;box-shadow:inset 0 0 0 1px var(--bb-border)}
.kpi-value{font-size:22px;font-weight:800;font-family:var(--font-mono);letter-spacing:-.04em;line-height:1}
.metric-bar{height:5px;background:var(--surface-3);border-radius:3px;overflow:hidden}.metric-fill{height:100%;border-radius:3px;transition:width .8s cubic-bezier(.16,1,.3,1)}
.admin-tab{padding:0 18px;height:42px;display:flex;align-items:center;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--font-body);gap:8px}
.admin-tab:hover{color:var(--text-primary);background:var(--surface-1)}
.admin-tab.active{color:var(--bb);border-bottom-color:var(--bb);font-weight:700;background:var(--bb-light)}
.task-row{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:var(--r-sm);transition:all .12s;cursor:pointer}.task-row:hover{background:var(--surface-1)}
.status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.msg-row{display:flex;gap:12px;padding:14px 0;align-items:flex-start}.msg-row+.msg-row{border-top:1px solid var(--border-subtle)}
.msg-bubble{background:var(--surface-1);border-radius:0 var(--r) var(--r) var(--r);padding:10px 14px;font-size:11px;line-height:1.6;color:var(--text-secondary)}
.live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);display:inline-block;animation:pulse 2s infinite}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<!-- BRAND BAR -->
<div style="background:linear-gradient(135deg,#001233 0%,#001E73 50%,#002B9E 100%);height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 28px">
  <div style="display:flex;align-items:center;gap:16px">
    <div style="display:flex;align-items:center;gap:6px"><div style="background:var(--bb-yellow);color:#001233;font-size:14px;font-weight:900;padding:2px 10px;border-radius:4px;font-family:var(--font-display);letter-spacing:-.02em">Best Buy</div><span style="font-size:9px;font-weight:800;color:rgba(255,255,255,.5);letter-spacing:.06em;font-family:var(--font-display)">CO., INC.</span></div>
    <div style="width:1px;height:16px;background:rgba(255,255,255,.08)"></div>
    <span style="font-size:8px;padding:3px 10px;border-radius:4px;background:rgba(0,70,190,.4);color:#93C5FD;font-weight:800;letter-spacing:.06em;border:1px solid rgba(0,70,190,.3)">ENTERPRISE</span>
  </div>
  <div style="display:flex;align-items:center;gap:20px">
    <div style="display:flex;align-items:center;gap:10px"><span style="font-size:10px;color:rgba(255,255,255,.2);font-family:var(--font-mono)">NYSE: BBY</span><span style="font-size:11px;font-weight:800;color:rgba(255,255,255,.7);font-family:var(--font-mono)">$88.42</span><span style="font-size:10px;color:#6EE7B7;font-weight:700;display:flex;align-items:center;gap:3px"><span class="live-dot" style="width:4px;height:4px"></span>+1.23%</span></div>
    <div style="width:1px;height:14px;background:rgba(255,255,255,.06)"></div>
    <span style="font-size:10px;color:rgba(255,255,255,.2);font-family:var(--font-mono)">Mar 24, 2026 · 3:24 PM ET</span>
  </div>
</div>
<!-- NAV -->
<div style="background:var(--surface-0);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;padding:0 24px;position:sticky;top:0;z-index:100;box-shadow:var(--shadow-xs)">
  <div style="display:flex;align-items:center"><div style="display:flex;align-items:center;gap:8px;padding:0 20px 0 0;margin-right:14px;border-right:1px solid var(--border);height:42px"><svg width="20" height="20" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="fos" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#fos)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#059669"/></svg><div><span style="font-size:13px;font-weight:800;letter-spacing:-.02em;font-family:var(--font-display)">FinanceOS</span><span style="font-size:8px;color:var(--text-muted);margin-left:4px;font-weight:600">Enterprise</span></div></div><div id="adminTabs" style="display:flex;height:42px"></div></div>
  <div style="display:flex;align-items:center;gap:6px"><button class="btn btn-outline btn-sm" onclick="togglePanel('copilot')">◎ Copilot</button><button class="btn btn-outline btn-sm">Notifications</button><button class="btn btn-bb btn-sm">◆ Share with Board</button></div>
</div>
<!-- LAYOUT -->
<div style="display:flex;height:calc(100vh - 86px)">
<!-- SIDEBAR -->
<div style="width:var(--sidebar-w);border-right:1px solid var(--border);background:var(--surface-0);padding:16px 10px;flex-shrink:0;overflow-y:auto;display:flex;flex-direction:column">
  <div style="padding:0 6px;margin-bottom:16px"><div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:var(--r-sm);background:var(--surface-2)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="Search..." style="border:none;background:none;font-family:var(--font-body);font-size:11px;color:var(--text-primary);outline:none;width:100%"></div></div>
  <div class="sidebar-section">Finance</div><div id="sidebarFinance" style="margin-bottom:8px"></div>
  <div style="height:1px;background:var(--border-subtle);margin:6px 10px"></div>
  <div class="sidebar-section">Organization</div><div id="sidebarOrg" style="margin-bottom:8px"></div>
  <div style="height:1px;background:var(--border-subtle);margin:6px 10px"></div>
  <div class="sidebar-section">Team Online</div><div id="teamSidebar" style="padding:4px 6px"></div>
  <div style="flex:1"></div>
  <div style="padding:10px;border-top:1px solid var(--border-subtle);margin-top:8px"><div id="currentUser" style="display:flex;align-items:center;gap:10px;padding:8px"></div></div>
</div>
<!-- CONTENT -->
<div style="flex:1;overflow-y:auto;padding:24px 28px;background:var(--bg)" id="content"></div>
<!-- RIGHT PANEL -->
<div id="rightPanel" style="display:none;width:380px;border-left:1px solid var(--border);background:var(--surface-0);flex-shrink:0;overflow-y:auto"></div>
</div>


` }} />
    </>
  );
}
