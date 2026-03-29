'use client';

import { useEffect, useRef } from 'react';

export default function V3DemoCocacolaV6Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ═══ DATA ═══
const admins=[
  {id:"cfo",name:"James Mitchell",role:"Chief Financial Officer",shortRole:"CFO",photo:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80&fit=crop&crop=face",status:"online",dept:"Executive",focus:"P&L, FCF, EPS",lastSeen:"Now",mood:"Focused on board prep"},
  {id:"vpf",name:"Sarah Chen",role:"VP Finance",shortRole:"VP Finance",photo:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&fit=crop&crop=face",status:"online",dept:"Finance",focus:"Revenue, Margins, OpEx",lastSeen:"Now",mood:"Reviewing LatAm data"},
  {id:"ctrl",name:"Marcus Rodriguez",role:"Controller",shortRole:"Controller",photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face",status:"away",dept:"Accounting",focus:"Close, Compliance, 10-K",lastSeen:"15m ago",mood:"Working on 10-K disclosures"},
  {id:"fpa",name:"Priya Sharma",role:"FP&A Director",shortRole:"FP&A",photo:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80&fit=crop&crop=face",status:"online",dept:"Planning",focus:"Forecast, Budget, Models",lastSeen:"Now",mood:"Building scenario models"},
  {id:"trs",name:"David Kim",role:"Treasury Director",shortRole:"Treasury",photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80&fit=crop&crop=face",status:"offline",dept:"Treasury",focus:"Cash, FX, Hedging",lastSeen:"2h ago",mood:""},
  {id:"ir",name:"Elena Volkov",role:"Investor Relations",shortRole:"IR",photo:"https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=80&q=80&fit=crop&crop=face",status:"online",dept:"IR",focus:"Consensus, Guidance, Deck",lastSeen:"Now",mood:"Tracking analyst revisions"},
];
const kpis=[
  {l:"Net Revenue",v:"$45.8B",d:"+3.2%",u:1,bar:"var(--coke)",n:"FY2025 Consolidated",spark:[38,40,42,41,43,44,45.8]},
  {l:"Gross Margin",v:"59.2%",d:"+40bps",u:1,bar:"var(--green)",n:"vs 58.8% prior year",spark:[57.8,58.1,58.4,58.8,58.9,59.0,59.2]},
  {l:"Operating Income",v:"$13.2B",d:"+5.1%",u:1,bar:"var(--blue)",n:"28.8% operating margin",spark:[11.2,11.8,12.0,12.4,12.6,12.9,13.2]},
  {l:"Free Cash Flow",v:"$9.8B",d:"+6.1%",u:1,bar:"var(--green)",n:"96.5% FCF conversion",spark:[8.0,8.4,8.8,9.0,9.2,9.5,9.8]},
  {l:"EPS (Diluted)",v:"$2.47",d:"+4.2%",u:1,bar:"var(--purple)",n:"vs $2.37 prior year",spark:[2.20,2.25,2.30,2.33,2.37,2.42,2.47]},
  {l:"ROIC",v:"14.2%",d:"+80bps",u:1,bar:"var(--cyan)",n:"610bps vs WACC",spark:[12.8,13.0,13.2,13.4,13.6,13.9,14.2]},
];
const segs=[
  {n:"North America",r:17420,p:38,g:2.8,m:32.1,c:"var(--coke)"},
  {n:"EMEA",r:8640,p:18.9,g:4.2,m:34.8,c:"var(--blue)"},
  {n:"Latin America",r:5280,p:11.5,g:8.1,m:41.2,c:"var(--green)"},
  {n:"Asia Pacific",r:5960,p:13,g:3.6,m:36.4,c:"var(--cyan)"},
  {n:"Global Ventures",r:3120,p:6.8,g:12.4,m:28.6,c:"var(--purple)"},
  {n:"Bottling Inv.",r:5380,p:11.8,g:-1.2,m:8.4,c:"var(--amber)"},
];
const tasks=[
  {t:"Review Q4 earnings script",a:"Sarah Chen",p:"high",due:"Mar 26",s:"In Progress",c:"Reporting",pct:65},
  {t:"Finalize 10-K segment disclosures",a:"Marcus Rodriguez",p:"high",due:"Mar 27",s:"In Review",c:"Compliance",pct:85},
  {t:"Update bottling refranchising model",a:"Priya Sharma",p:"medium",due:"Mar 28",s:"In Progress",c:"Modeling",pct:40},
  {t:"Board deck — cash flow bridge",a:"James Mitchell",p:"high",due:"Mar 25",s:"Draft",c:"Board",pct:20},
  {t:"LatAm marketing ROI analysis",a:"Sarah Chen",p:"medium",due:"Mar 30",s:"Not Started",c:"Analysis",pct:0},
  {t:"Hedge position review — EUR/USD",a:"David Kim",p:"medium",due:"Mar 28",s:"In Progress",c:"Treasury",pct:55},
  {t:"Investor day presentation draft",a:"Elena Volkov",p:"low",due:"Apr 5",s:"Not Started",c:"IR",pct:0},
  {t:"Dividend declaration memo",a:"James Mitchell",p:"high",due:"Mar 25",s:"Draft",c:"Board",pct:30},
];
const msgs=[
  {id:1,from:admins[1],text:"LatAm margin expansion confirmed — 41.2% operating margin, 280bps improvement. Updated the variance bridge. Ready for your review.",time:"2:45 PM",reactions:[{e:"👍",c:3},{e:"📊",c:1}],thread:2,pinned:false},
  {id:2,from:admins[0],text:"Perfect. Also need the constant-currency EMEA growth pulled. The 4.2% reported understates the organic performance significantly.",time:"2:48 PM",reactions:[],thread:0,pinned:false},
  {id:3,from:admins[3],text:"I have the CC numbers. EMEA was 7.8% organic growth. Hedge covered 68% of exposure. Adding to the board deck variance page now.",time:"2:52 PM",reactions:[{e:"✅",c:2}],thread:0,pinned:true},
  {id:4,from:admins[2],text:"10-K segment note drafted. Need sign-off on the Bottling Investments disclosure — the margin compression needs careful framing for the audit committee.",time:"3:01 PM",reactions:[{e:"👀",c:1},{e:"📎",c:1}],thread:1,pinned:false},
  {id:5,from:admins[5],text:"Buy-side consensus for Q1'26 is $11.9B revenue. Our internal model shows $12.1B. Should we guide above or maintain conservatism?",time:"3:14 PM",reactions:[{e:"🤔",c:2},{e:"💬",c:3}],thread:4,pinned:false},
  {id:6,from:admins[0],text:"Let's maintain conservatism on the topline guide. We can beat-and-raise in Q2 when LatAm momentum is confirmed with another quarter of data.",time:"3:18 PM",reactions:[{e:"✅",c:4},{e:"👍",c:2}],thread:0,pinned:true},
  {id:7,from:admins[3],text:"@Sarah — I've updated the scenario model with three cases: base (conservative guidance), bull (LatAm accelerates), bear (FX headwinds intensify). Sharing the deck link now.",time:"3:22 PM",reactions:[{e:"🔥",c:2}],thread:0,pinned:false},
];
const activities=[
  {user:admins[1],action:"uploaded",target:"Q4 Variance Bridge v3.xlsx",time:"3:20 PM",icon:"📄"},
  {user:admins[3],action:"shared",target:"FY2026 Scenario Model",time:"3:18 PM",icon:"📊"},
  {user:admins[0],action:"approved",target:"Conservative Guidance Strategy",time:"3:18 PM",icon:"✅"},
  {user:admins[2],action:"commented on",target:"10-K Segment Disclosures",time:"3:05 PM",icon:"💬"},
  {user:admins[5],action:"updated",target:"Consensus Tracker Dashboard",time:"2:58 PM",icon:"📈"},
  {user:admins[1],action:"completed",target:"LatAm Margin Analysis",time:"2:45 PM",icon:"🎯"},
  {user:{name:"Claude AI",photo:"",status:"online"},action:"flagged",target:"3 anomalies in Q4 actuals vs budget",time:"2:30 PM",icon:"🤖"},
  {user:admins[4],action:"submitted",target:"EUR/USD Hedge Position Report",time:"1:15 PM",icon:"💱"},
];
const aiFlows=[
  {name:"Variance Detection",status:"active",model:"Claude Opus",desc:"Scanning Q4 actuals vs budget — 3 anomalies flagged",assigned:"Sarah Chen",confidence:94},
  {name:"Revenue Forecast",status:"active",model:"GPT-4o",desc:"Rolling 12-month forecast with LatAm data",assigned:"Priya Sharma",confidence:91},
  {name:"Compliance Monitor",status:"idle",model:"Claude Sonnet",desc:"10-K language review — checking SEC disclosures",assigned:"Marcus Rodriguez",confidence:97},
  {name:"FX Hedge Optimizer",status:"active",model:"Claude Opus",desc:"EUR/USD position analysis — hedge adjustments",assigned:"David Kim",confidence:88},
  {name:"Board Deck Generator",status:"queued",model:"GPT-4o",desc:"Auto-generating cash flow bridge slides",assigned:"James Mitchell",confidence:0},
  {name:"Consensus Tracker",status:"active",model:"Claude Sonnet",desc:"Monitoring 14 analyst estimate revisions",assigned:"Elena Volkov",confidence:96},
];
const channels=[
  {name:"#finance-leadership",members:6,unread:3,active:true},
  {name:"#board-prep",members:4,unread:1,active:false},
  {name:"#treasury-ops",members:3,unread:0,active:false},
  {name:"#10k-review",members:3,unread:2,active:false},
  {name:"#investor-relations",members:2,unread:0,active:false},
];
let activeAdmin="cfo",activeView="overview",panelOpen=null,activeChannel=0;
// Utils
function sparkline(data,color,w=60,h=24){const max=Math.max(...data),min=Math.min(...data),range=max-min||1;const pts=data.map((v,i)=>\`\${(i/(data.length-1))*w},\${h-((v-min)/range)*h}\`).join(' ');return \`<svg width="\${w}" height="\${h}" viewBox="0 0 \${w} \${h}" style="overflow:visible"><polyline points="\${pts}" fill="none" stroke="\${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="\${w}" cy="\${h-((data[data.length-1]-min)/range)*h}" r="2" fill="\${color}"/></svg>\`;}
function timeAgo(){const d=new Date();return d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true})+' ET · '+d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
function updateClock(){document.getElementById('liveTime').textContent=timeAgo();}
setInterval(updateClock,60000);updateClock();
// ═══ RENDER ═══
function renderAdminTabs(){document.getElementById('adminTabs').innerHTML=admins.map(a=>\`<button class="admin-tab \${a.id===activeAdmin?'active':''}" onclick="switchAdmin('\${a.id}')"><div style="position:relative"><img src="\${a.photo}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:2px solid \${a.id===activeAdmin?'var(--coke)':'transparent'};transition:border-color .2s"><div class="status-dot" style="position:absolute;bottom:-1px;right:-1px;width:8px;height:8px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'};border:2px solid var(--surface-0)"></div></div><span>\${a.shortRole}</span></button>\`).join('');}
function switchAdmin(id){activeAdmin=id;renderAdminTabs();renderSidebar();renderContent();}
function renderSidebar(){
  const fin=[{l:"Overview",v:"overview"},{l:"P&L Statement",v:"pnl"},{l:"Segments",v:"segments"},{l:"Forecast",v:"forecast"},{l:"Cash Flow",v:"cashflow"},{l:"Board Deck",v:"board"}];
  const org=[{l:"Tasks",v:"tasks",b:tasks.filter(t=>t.s!=="Complete").length},{l:"Messages",v:"messages",b:msgs.filter(m=>!m.read).length},{l:"Team Hub",v:"team"},{l:"Channels",v:"channels",b:channels.reduce((a,c)=>a+c.unread,0)},{l:"Documents",v:"docs"},{l:"Calendar",v:"calendar"},{l:"Pipeline",v:"pipeline"}];
  const ai=[{l:"AI Flows",v:"aiflows",b:aiFlows.filter(f=>f.status==='active').length},{l:"Security",v:"security"},{l:"Audit Log",v:"audit"}];
  document.getElementById('sidebarFinance').innerHTML=fin.map(f=>\`<button class="sidebar-btn \${f.v===activeView?'active':''}" onclick="switchView('\${f.v}')">\${f.l}</button>\`).join('');
  document.getElementById('sidebarOrg').innerHTML=org.map(o=>\`<button class="sidebar-btn \${o.v===activeView?'active':''}" onclick="switchView('\${o.v}')">\${o.l}\${o.b?\`<span class="tag tag-sm" style="background:var(--coke);color:#fff;margin-left:auto">\${o.b}</span>\`:''}</button>\`).join('');
  document.getElementById('sidebarAI').innerHTML=ai.map(a=>\`<button class="sidebar-btn \${a.v===activeView?'active':''}" onclick="switchView('\${a.v}')">\${a.l}\${a.b?\`<span class="tag tag-sm" style="background:var(--indigo);color:#fff;margin-left:auto">\${a.b}</span>\`:''}</button>\`).join('');
  const onlineCount=admins.filter(a=>a.status==='online').length;
  document.getElementById('onlineCount').textContent=onlineCount+' online';
  document.getElementById('teamSidebar').innerHTML=admins.map(a=>\`<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:var(--r-sm);cursor:pointer;transition:all .12s;margin-bottom:2px" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'" onclick="switchAdmin('\${a.id}')"><div style="position:relative"><img src="\${a.photo}" class="avatar" style="width:26px;height:26px"><div class="status-dot" style="position:absolute;bottom:-1px;right:-1px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'};border:2px solid var(--surface-0)"></div></div><div style="flex:1;min-width:0"><div style="font-size:10px;font-weight:600;color:var(--text-secondary)">\${a.name.split(' ')[0]}</div>\${a.mood?\`<div style="font-size:8px;color:var(--text-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${a.mood}</div>\`:''}</div><span style="font-size:8px;color:var(--text-faint)">\${a.lastSeen==='Now'?'':''+a.lastSeen}</span></div>\`).join('');
  const admin=admins.find(a=>a.id===activeAdmin);
  document.getElementById('currentUser').innerHTML=\`<div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--r-sm);cursor:pointer;transition:background .15s" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'"><img src="\${admin.photo}" class="avatar avatar-online" style="width:34px;height:34px"><div style="flex:1"><div style="font-size:11px;font-weight:700">\${admin.name}</div><div style="font-size:9px;color:var(--text-muted)">\${admin.role}</div></div></div>\`;
}
function switchView(v){activeView=v;renderSidebar();renderContent();}
// ═══ PANELS ═══
function togglePanel(type){const p=document.getElementById('rightPanel');if(panelOpen===type){p.style.display='none';panelOpen=null;return;}panelOpen=type;p.style.display='block';
  if(type==='copilot') renderCopilot(p);
  else if(type==='activity') renderActivityPanel(p);
  else if(type==='notifications') renderNotifPanel(p);
  else if(type==='security') renderSecPanel(p);
}
function renderCopilot(el){el.innerHTML=\`<div style="padding:20px"><div style="display:flex;justify-content:space-between;margin-bottom:20px"><div style="display:flex;align-items:center;gap:8px"><div style="width:34px;height:34px;border-radius:var(--r-sm);background:linear-gradient(135deg,var(--purple),var(--blue));display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42"/></svg></div><div><div style="font-size:14px;font-weight:800;font-family:var(--font-display)">AI Copilot</div><div style="font-size:9px;color:var(--text-muted)">Claude Opus · Enterprise</div></div></div><button class="btn btn-ghost btn-xs" onclick="togglePanel('copilot')">✕</button></div><div style="background:var(--surface-1);border-radius:var(--r);padding:16px;margin-bottom:16px;border:1px solid var(--border-subtle)"><div style="font-size:10px;font-weight:700;color:var(--purple);margin-bottom:8px;display:flex;align-items:center;gap:4px"><span class="live-dot" style="background:var(--purple)"></span> Thinking...</div><div style="font-size:11px;color:var(--text-secondary);line-height:1.7">Based on the latest Q4 data, I've identified <strong>3 key insights</strong> for your board meeting:<br><br>1. LatAm operating margin expansion (+280bps) is the strongest in 8 quarters<br>2. FCF conversion at 96.5% puts KO in the top quartile of consumer staples<br>3. Bottling segment margin compression warrants strategic review</div></div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">\${['Summarize Q4','Board memo','vs Consensus','FX impact'].map(q=>\`<button class="btn btn-outline btn-xs">\${q}</button>\`).join('')}</div><div style="display:flex;gap:8px"><input type="text" placeholder="Ask about your financial data..." style="flex:1;border:1px solid var(--border);border-radius:var(--r-sm);padding:10px 14px;font-family:var(--font-body);font-size:11px;outline:none;background:var(--surface-1)"><button class="btn" style="background:linear-gradient(135deg,var(--purple),var(--blue));color:#fff;padding:10px 14px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div></div>\`;}
function renderActivityPanel(el){el.innerHTML=\`<div style="padding:20px"><div style="display:flex;justify-content:space-between;margin-bottom:20px"><div><div style="font-size:14px;font-weight:800;font-family:var(--font-display)">Activity Feed</div><div style="font-size:10px;color:var(--text-muted)">Real-time team activity</div></div><button class="btn btn-ghost btn-xs" onclick="togglePanel('activity')">✕</button></div>\${activities.map((a,i)=>\`<div class="activity-item fade" style="animation-delay:\${i*.05}s"><div style="width:32px;height:32px;border-radius:var(--r-sm);background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">\${a.icon}</div><div style="flex:1"><div style="font-size:11px"><strong>\${a.user.name}</strong> <span style="color:var(--text-tertiary)">\${a.action}</span></div><div style="font-size:10px;color:var(--blue);font-weight:600">\${a.target}</div><div style="font-size:9px;color:var(--text-faint)">\${a.time}</div></div></div>\`).join('')}</div>\`;}
function renderNotifPanel(el){el.innerHTML=\`<div style="padding:20px"><div style="display:flex;justify-content:space-between;margin-bottom:20px"><div><div style="font-size:14px;font-weight:800;font-family:var(--font-display)">Notifications</div></div><button class="btn btn-ghost btn-xs" onclick="togglePanel('notifications')">✕</button></div>\${[{t:"Priya Sharma mentioned you in #finance-leadership",time:"3:22 PM",read:false},{t:"10-K Segment Disclosures needs your sign-off",time:"3:01 PM",read:false},{t:"AI Copilot flagged 3 anomalies in Q4 actuals",time:"2:30 PM",read:false},{t:"Board meeting reminder — Mar 26, 9:00 AM",time:"12:00 PM",read:true},{t:"EUR/USD hedge position report submitted",time:"1:15 PM",read:true}].map((n,i)=>\`<div style="display:flex;gap:10px;padding:12px;border-radius:var(--r-sm);margin-bottom:6px;background:\${n.read?'transparent':'var(--coke-light)'};border:1px solid \${n.read?'var(--border-subtle)':'var(--coke-border)'};cursor:pointer;transition:all .12s" onmouseover="this.style.transform='translateX(2px)'" onmouseout="this.style.transform='none'"><div style="width:6px;height:6px;border-radius:50%;background:\${n.read?'var(--text-faint)':'var(--coke)'};margin-top:5px;flex-shrink:0"></div><div><div style="font-size:11px;font-weight:\${n.read?'500':'600'};color:\${n.read?'var(--text-tertiary)':'var(--text-primary)'}">\${n.t}</div><div style="font-size:9px;color:var(--text-faint)">\${n.time}</div></div></div>\`).join('')}</div>\`;}
function renderSecPanel(el){el.innerHTML=\`<div style="padding:20px"><div style="display:flex;justify-content:space-between;margin-bottom:20px"><div><div style="font-size:14px;font-weight:800;font-family:var(--font-display)">Security & Compliance</div><div style="font-size:10px;color:var(--green);font-weight:600"><span class="live-dot"></span> All systems secure</div></div><button class="btn btn-ghost btn-xs" onclick="togglePanel('security')">✕</button></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">\${[{l:"SOC 2 Type II",v:"Compliant",c:"var(--green)"},{l:"AES-256",v:"Active",c:"var(--blue)"},{l:"Row-Level Security",v:"Enforced",c:"var(--purple)"},{l:"HSTS/CSP",v:"Enabled",c:"var(--cyan)"}].map(b=>\`<div style="background:\${b.c}08;border:1px solid \${b.c}15;border-radius:var(--r-sm);padding:10px 12px;text-align:center"><div style="font-size:10px;font-weight:800;color:\${b.c}">\${b.l}</div><div style="font-size:9px;color:var(--text-tertiary)">\${b.v}</div></div>\`).join('')}</div></div>\`;}
// ═══ CONTENT VIEWS ═══
function renderContent(){const el=document.getElementById('content'),admin=admins.find(a=>a.id===activeAdmin);
  if(activeView==='overview') el.innerHTML=renderOverview(admin);
  else if(activeView==='messages') el.innerHTML=renderMessages(admin);
  else if(activeView==='channels') el.innerHTML=renderChannels(admin);
  else if(activeView==='team') el.innerHTML=renderTeam(admin);
  else if(activeView==='tasks') el.innerHTML=renderTasks(admin);
  else if(activeView==='segments') el.innerHTML=renderSegments(admin);
  else if(activeView==='aiflows') el.innerHTML=renderAIFlows(admin);
  else el.innerHTML=renderPlaceholder(activeView);
}
function renderOverview(admin){
  const pColor=p=>p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';
  return \`
  <div class="card fade" style="padding:0;margin-bottom:20px;overflow:hidden;border:none;box-shadow:var(--shadow-md)">
    <div style="display:grid;grid-template-columns:1fr 340px;min-height:170px">
      <div style="padding:32px 36px;display:flex;flex-direction:column;justify-content:center">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <span class="tag" style="background:var(--green-bg);color:var(--green);border:1px solid var(--green-border)"><span class="live-dot" style="width:5px;height:5px"></span> All Systems Live</span>
          <span class="tag" style="background:var(--purple-bg);color:var(--purple);border:1px solid var(--purple-border)">◎ \${aiFlows.filter(f=>f.status==='active').length} AI Flows Active</span>
          <span class="tag" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">FY2025</span>
          <span class="tag" style="background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)">\${admins.filter(a=>a.status==='online').length} team online</span>
        </div>
        <h1 style="font-size:28px;font-weight:900;letter-spacing:-.04em;font-family:var(--font-display);margin-bottom:8px" class="gradient-text">\${admin.shortRole} Command Center</h1>
        <p style="font-size:12px;color:var(--text-tertiary);line-height:1.7">Welcome back, \${admin.name.split(' ')[0]}. <strong style="color:var(--text-secondary)">\${tasks.filter(t=>t.p==='high').length} high-priority items</strong> and <strong style="color:var(--purple)">\${activities.length} team activities</strong> since your last session.</p>
      </div>
      <div style="position:relative;overflow:hidden"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop" style="width:100%;height:100%;object-fit:cover" alt=""><div style="position:absolute;inset:0;background:linear-gradient(90deg,var(--surface-0) 0%,rgba(255,255,255,.2) 50%,rgba(255,255,255,0) 100%)"></div></div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px">\${kpis.map((k,i)=>\`<div class="card fade" style="padding:18px 20px;animation-delay:\${i*.06}s;cursor:pointer"><div class="card-accent" style="background:\${k.bar}"></div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px"><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted)">\${k.l}</div>\${sparkline(k.spark,k.bar)}</div><div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px"><span class="kpi-value">\${k.v}</span><span class="tag tag-sm" style="background:\${k.u?'var(--green-bg)':'var(--red-bg)'};color:\${k.u?'var(--green)':'var(--red)'}">▲ \${k.d}</span></div><div style="font-size:9px;color:var(--text-faint)">\${k.n}</div></div>\`).join('')}</div>
  <!-- 3-col grid -->
  <div style="display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:14px;margin-bottom:20px">
    <!-- Quick Actions + Activity -->
    <div class="card" style="padding:22px"><div class="card-accent" style="background:var(--coke)"></div><div style="font-size:14px;font-weight:800;font-family:var(--font-display);margin-bottom:16px">Quick Actions</div>\${[{l:"High Priority",v:tasks.filter(t=>t.p==='high').length,c:"var(--red)",bg:"var(--red-bg)",click:"tasks"},{l:"Messages",v:msgs.length,c:"var(--blue)",bg:"var(--blue-bg)",click:"messages"},{l:"AI Flows",v:aiFlows.filter(f=>f.status==='active').length,c:"var(--purple)",bg:"var(--purple-bg)",click:"aiflows"},{l:"Channels",v:channels.reduce((a,c)=>a+c.unread,0)+" unread",c:"var(--amber)",bg:"var(--amber-bg)",click:"channels"}].map(a=>\`<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--r-sm);border:1px solid var(--border-subtle);margin-bottom:8px;cursor:pointer;transition:all .15s" onclick="switchView('\${a.click}')" onmouseover="this.style.borderColor='var(--coke)';this.style.background='var(--coke-light)'" onmouseout="this.style.borderColor='var(--border-subtle)';this.style.background='transparent'"><span style="font-size:11px;font-weight:600;flex:1">\${a.l}</span><span class="tag tag-sm" style="background:\${a.bg};color:\${a.c}">\${a.v}</span></div>\`).join('')}</div>
    <!-- Segments -->
    <div class="card" style="padding:22px"><div class="card-accent" style="background:linear-gradient(90deg,var(--coke),var(--amber))"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span style="font-size:14px;font-weight:800;font-family:var(--font-display)">Business Segments</span><span class="tag" style="background:var(--surface-2);color:var(--text-tertiary);border:1px solid var(--border)">$45.8B</span></div>\${segs.map(s=>\`<div style="display:grid;grid-template-columns:120px 1fr 55px 45px;gap:8px;align-items:center;padding:7px 4px;font-size:10px;cursor:pointer;border-radius:var(--r-xs);transition:background .1s" onmouseover="this.style.background='var(--surface-1)'" onmouseout="this.style.background='transparent'" onclick="switchView('segments')"><div style="display:flex;align-items:center;gap:6px"><div style="width:8px;height:8px;border-radius:3px;background:\${s.c}"></div><span style="font-weight:600">\${s.n}</span></div><div class="metric-bar"><div class="metric-fill" style="width:\${s.p*2.5}%;background:\${s.c};opacity:.6"></div></div><span style="font-weight:800;font-family:var(--font-mono);font-size:10px;text-align:right">$\${(s.r/1000).toFixed(1)}B</span><span style="font-weight:700;color:\${s.g>=0?'var(--green)':'var(--red)'};font-size:10px;text-align:right;font-family:var(--font-mono)">\${s.g>=0?'+':''}\${s.g}%</span></div>\`).join('')}</div>
    <!-- Live Activity Feed (NEW) -->
    <div class="card" style="padding:22px"><div class="card-accent" style="background:linear-gradient(90deg,var(--green),var(--cyan))"></div><div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><span style="font-size:14px;font-weight:800;font-family:var(--font-display)">Live Activity</span><span class="tag tag-sm" style="background:var(--green-bg);color:var(--green)"><span class="live-dot" style="width:4px;height:4px"></span> Real-time</span></div>\${activities.slice(0,5).map((a,i)=>\`<div style="display:flex;gap:8px;padding:6px 0;\${i<4?'border-bottom:1px solid var(--border-subtle)':''};align-items:flex-start"><span style="font-size:12px">\${a.icon}</span><div style="flex:1;min-width:0"><div style="font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><strong>\${a.user.name.split(' ')[0]}</strong> <span style="color:var(--text-tertiary)">\${a.action}</span></div><div style="font-size:9px;color:var(--blue);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${a.target}</div></div><span style="font-size:8px;color:var(--text-faint);white-space:nowrap">\${a.time}</span></div>\`).join('')}<button class="btn btn-ghost btn-xs" style="width:100%;justify-content:center;margin-top:8px" onclick="togglePanel('activity')">View all activity →</button></div>
  </div>
  <!-- Messages + Tasks -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
    <div class="card" style="padding:22px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><div style="display:flex;align-items:center;gap:8px"><span style="font-size:14px;font-weight:800;font-family:var(--font-display)">Team Chat</span><span class="tag tag-sm" style="background:var(--blue-bg);color:var(--blue)">\${channels[activeChannel].name}</span></div><button class="btn btn-ghost btn-sm" onclick="switchView('messages')">View all →</button></div>\${msgs.slice(0,3).map(m=>\`<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-subtle);align-items:flex-start"><img src="\${m.from.photo}" class="avatar" style="width:30px;height:30px;flex-shrink:0"><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px;margin-bottom:3px"><span style="font-size:11px;font-weight:700">\${m.from.name.split(' ')[0]}</span><span style="font-size:9px;color:var(--text-faint)">\${m.time}</span>\${m.pinned?'<span style="font-size:8px;color:var(--amber)">📌</span>':''}</div><div style="font-size:10px;color:var(--text-secondary);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">\${m.text}</div>\${m.reactions.length?\`<div class="msg-reactions">\${m.reactions.map(r=>\`<span class="msg-reaction">\${r.e}<span class="count">\${r.c}</span></span>\`).join('')}</div>\`:''}</div></div>\`).join('')}
    <!-- Typing indicator -->
    <div style="display:flex;align-items:center;gap:8px;padding:8px 0;color:var(--text-muted)"><div style="display:flex"><img src="\${admins[3].photo}" style="width:16px;height:16px;border-radius:50%;object-fit:cover"></div><div class="typing-dots"><span></span><span></span><span></span></div><span style="font-size:9px">Priya is typing...</span></div></div>
    <div class="card" style="padding:22px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span style="font-size:14px;font-weight:800;font-family:var(--font-display)">Priority Tasks</span><button class="btn btn-ghost btn-sm" onclick="switchView('tasks')">View all →</button></div>\${tasks.filter(t=>t.p==='high').slice(0,4).map(t=>{const sC=t.s==='In Progress'?'var(--blue)':t.s==='In Review'?'var(--purple)':'var(--amber)';return \`<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--r-sm);transition:background .1s;cursor:pointer;margin-bottom:4px" onmouseover="this.style.background='var(--surface-1)'" onmouseout="this.style.background='transparent'"><div class="status-dot" style="background:\${pColor(t.p)}"></div><div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:600;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${t.t}</div><div style="display:flex;align-items:center;gap:8px"><div class="metric-bar" style="width:60px"><div class="metric-fill" style="width:\${t.pct}%;background:\${sC}"></div></div><span style="font-size:8px;color:var(--text-muted);font-family:var(--font-mono)">\${t.pct}%</span></div></div><img src="\${admins.find(a=>a.name===t.a)?.photo||''}" style="width:20px;height:20px;border-radius:50%;object-fit:cover"><span class="tag tag-sm" style="background:\${sC}10;color:\${sC}">\${t.s}</span></div>\`}).join('')}</div>
  </div>
  <div style="padding:18px 24px;border-radius:var(--r-lg);background:linear-gradient(135deg,rgba(37,99,235,.03),rgba(124,58,237,.02));border:1px solid rgba(37,99,235,.06);display:flex;justify-content:space-between;align-items:center"><div style="display:flex;align-items:center;gap:12px"><svg width="24" height="24" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg3" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg3)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#059669"/></svg><div><div style="font-size:12px;font-weight:800;font-family:var(--font-display)">Powered by FinanceOS · Enterprise</div><div style="font-size:10px;color:var(--text-muted)">SOC 2 Type II · AES-256 · 99.9% Uptime · GDPR · Row-Level Security</div></div></div><a href="https://finance-os.app" target="_blank" class="btn btn-coke btn-sm" style="text-decoration:none">Learn More →</a></div>\`;
}
// ═══ MESSAGES (Enhanced Teams-like) ═══
function renderMessages(admin){
  return \`<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px" class="fade"><div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Communication Hub</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Team Messages</h2></div><div style="display:flex;gap:6px">\${channels.map((ch,i)=>\`<button class="btn \${i===activeChannel?'btn-coke':'btn-outline'} btn-xs" onclick="activeChannel=\${i};renderContent()">\${ch.name}\${ch.unread?\` <span style="background:\${i===activeChannel?'rgba(255,255,255,.3)':'var(--coke)'};color:\${i===activeChannel?'#fff':'#fff'};font-size:8px;padding:1px 5px;border-radius:10px;margin-left:2px">\${ch.unread}</span>\`:''}</button>\`).join('')}</div></div>
  <div class="card" style="padding:0;overflow:hidden">
    <!-- Pinned messages bar -->
    <div style="padding:10px 20px;background:var(--amber-bg);border-bottom:1px solid var(--amber-border);display:flex;align-items:center;gap:8px"><span style="font-size:11px">📌</span><span style="font-size:10px;font-weight:600;color:var(--amber)">\${msgs.filter(m=>m.pinned).length} pinned messages</span><span style="font-size:9px;color:var(--text-muted);margin-left:auto">Click to expand</span></div>
    <div style="padding:24px">\${msgs.map((m,i)=>\`<div style="display:flex;gap:12px;padding:14px 0;\${i<msgs.length-1?'border-bottom:1px solid var(--border-subtle)':''};align-items:flex-start;position:relative" class="fade" style="animation-delay:\${i*.04}s"><div style="position:relative"><img src="\${m.from.photo}" class="avatar" style="width:36px;height:36px;flex-shrink:0"><div class="status-dot" style="position:absolute;bottom:0;right:0;width:8px;height:8px;background:\${m.from.status==='online'?'var(--green)':m.from.status==='away'?'var(--amber)':'var(--text-faint)'};border:2px solid var(--surface-0)"></div></div><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:12px;font-weight:700">\${m.from.name}</span><span style="font-size:9px;color:var(--text-muted);background:var(--surface-2);padding:1px 6px;border-radius:4px">\${m.from.shortRole}</span><span style="font-size:9px;color:var(--text-faint)">\${m.time}</span>\${m.pinned?'<span style="font-size:9px;color:var(--amber)">📌 Pinned</span>':''}</div><div style="background:var(--surface-1);border-radius:0 var(--r) var(--r) var(--r);padding:12px 16px;font-size:11px;line-height:1.7;color:var(--text-secondary)">\${m.text}</div>\${m.reactions.length?\`<div class="msg-reactions">\${m.reactions.map(r=>\`<span class="msg-reaction">\${r.e}<span class="count">\${r.c}</span></span>\`).join('')}<span class="msg-reaction" style="background:transparent;border:1px dashed var(--border)">+</span></div>\`:''} \${m.thread?\`<div style="margin-top:6px;display:flex;align-items:center;gap:6px;cursor:pointer;padding:4px 8px;border-radius:var(--r-xs);transition:background .1s" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><span style="font-size:9px;color:var(--blue);font-weight:600">\${m.thread} \${m.thread===1?'reply':'replies'}</span></div>\`:''}</div></div>\`).join('')}
    <!-- Typing + Compose -->
    <div style="padding:16px 0 0;border-top:1px solid var(--border-subtle)"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding:0 4px"><img src="\${admins[3].photo}" style="width:16px;height:16px;border-radius:50%;object-fit:cover"><div class="typing-dots"><span></span><span></span><span></span></div><span style="font-size:9px;color:var(--text-muted)">Priya is typing...</span></div>
    <div style="display:flex;gap:10px;align-items:flex-end"><img src="\${admin.photo}" class="avatar" style="width:32px;height:32px;flex-shrink:0"><div style="flex:1;border:1px solid var(--border);border-radius:var(--r);padding:12px 16px;background:var(--surface-1)"><div contenteditable="true" style="font-family:var(--font-body);font-size:12px;outline:none;min-height:20px;color:var(--text-secondary)"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px"><div style="display:flex;gap:6px"><button class="btn btn-ghost btn-xs">📎</button><button class="btn btn-ghost btn-xs">@</button><button class="btn btn-ghost btn-xs">◎ AI</button><button class="btn btn-ghost btn-xs">📊 File</button></div><button class="btn btn-coke btn-sm">Send</button></div></div></div></div>
    </div>
  </div>\`;
}
// ═══ CHANNELS VIEW (NEW) ═══
function renderChannels(admin){
  return \`<div style="margin-bottom:24px" class="fade"><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Organization</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Channels</h2></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">\${channels.map((ch,i)=>\`<div class="card fade" style="padding:22px;cursor:pointer;animation-delay:\${i*.06}s" onclick="activeChannel=\${i};switchView('messages')"><div class="card-accent" style="background:\${ch.active?'var(--coke)':'var(--border)'}"></div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px"><div style="font-size:15px;font-weight:800;font-family:var(--font-display)">\${ch.name}</div>\${ch.unread?\`<span class="tag tag-sm" style="background:var(--coke);color:#fff">\${ch.unread} new</span>\`:''}</div><div style="display:flex;align-items:center;gap:6px;margin-bottom:8px"><div style="display:flex;margin-right:4px">\${admins.slice(0,ch.members).map((a,j)=>\`<img src="\${a.photo}" style="width:20px;height:20px;border-radius:50%;object-fit:cover;border:2px solid var(--surface-0);margin-left:\${j>0?'-6px':'0'}" />\`).join('')}</div><span style="font-size:9px;color:var(--text-muted)">\${ch.members} members</span></div></div>\`).join('')}</div>\`;
}
// ═══ TEAM HUB (Enhanced Social) ═══
function renderTeam(admin){
  return \`<div style="margin-bottom:24px" class="fade"><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Organization</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Finance Team Hub</h2></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px">\${admins.map((a,i)=>\`<div class="card fade" style="padding:24px;animation-delay:\${i*.06}s;cursor:pointer" onclick="switchAdmin('\${a.id}')"><div class="card-accent" style="background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'}"></div><div style="display:flex;align-items:center;gap:14px;margin-bottom:14px"><div style="position:relative"><img src="\${a.photo}" class="avatar \${a.status==='online'?'avatar-online':''}" style="width:52px;height:52px"><div class="status-dot" style="position:absolute;bottom:1px;right:1px;width:12px;height:12px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'};border:2px solid var(--surface-0)"></div></div><div><div style="font-size:15px;font-weight:800;font-family:var(--font-display)">\${a.name}</div><div style="font-size:11px;color:var(--text-tertiary)">\${a.role}</div><div style="font-size:10px;color:\${a.status==='online'?'var(--green)':'var(--text-muted)'};font-weight:600;margin-top:2px">\${a.status==='online'?'● Online':a.status==='away'?'● Away':'○ Offline'} · \${a.lastSeen}</div></div></div>
  \${a.mood?\`<div style="background:var(--surface-1);border-radius:var(--r-sm);padding:8px 12px;margin-bottom:12px;display:flex;align-items:center;gap:6px"><span style="font-size:12px">💭</span><span style="font-size:10px;color:var(--text-secondary);font-style:italic">"\${a.mood}"</span></div>\`:''}
  <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:6px">Focus Areas</div><div style="font-size:10px;color:var(--text-secondary);margin-bottom:12px">\${a.focus}</div>
  <div style="display:flex;gap:4px;flex-wrap:wrap"><span class="tag tag-sm" style="background:var(--surface-2);color:var(--text-tertiary)">\${a.dept}</span><span class="tag tag-sm" style="background:var(--surface-2);color:var(--text-tertiary)">\${tasks.filter(t=>t.a===a.name).length} tasks</span>\${aiFlows.filter(f=>f.assigned===a.name).length?\`<span class="tag tag-sm" style="background:var(--purple-bg);color:var(--purple)">\${aiFlows.filter(f=>f.assigned===a.name).length} AI</span>\`:''}</div></div>\`).join('')}</div>
  <!-- Team Activity Timeline -->
  <div class="card" style="padding:22px"><div style="font-size:14px;font-weight:800;font-family:var(--font-display);margin-bottom:16px">Recent Team Activity</div>\${activities.map((a,i)=>\`<div class="activity-item fade" style="animation-delay:\${i*.04}s"><div style="width:28px;height:28px;border-radius:50%;background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0">\${a.icon}</div><div style="flex:1"><div style="font-size:11px"><strong>\${a.user.name}</strong> <span style="color:var(--text-tertiary)">\${a.action}</span> <span style="color:var(--blue);font-weight:600">\${a.target}</span></div></div><span style="font-size:9px;color:var(--text-faint)">\${a.time}</span></div>\`).join('')}</div>\`;
}
// ═══ TASKS ═══
function renderTasks(admin){const pColor=p=>p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';const sColor=s=>s==='In Progress'?'var(--blue)':s==='In Review'?'var(--purple)':s==='Draft'?'var(--amber)':'var(--text-muted)';
  return \`<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px"><div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Organization</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Task Management</h2></div><button class="btn btn-coke">+ New Task</button></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">\${[{l:"All",v:tasks.length,c:"var(--coke)"},{l:"High",v:tasks.filter(t=>t.p==='high').length,c:"var(--red)"},{l:"In Progress",v:tasks.filter(t=>t.s==='In Progress').length,c:"var(--blue)"},{l:"In Review",v:tasks.filter(t=>t.s==='In Review').length,c:"var(--purple)"}].map((s,i)=>\`<div class="card fade" style="padding:18px;text-align:center;animation-delay:\${i*.06}s"><div class="card-accent" style="background:\${s.c}"></div><div style="font-size:28px;font-weight:900;font-family:var(--font-mono);color:\${s.c}">\${s.v}</div><div style="font-size:10px;color:var(--text-muted);font-weight:600;margin-top:4px">\${s.l}</div></div>\`).join('')}</div>
  <div class="card" style="padding:0;overflow:hidden"><div style="display:grid;grid-template-columns:20px 1fr 140px 90px 70px 60px;gap:8px;padding:12px 20px;background:var(--surface-1);font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);border-bottom:1px solid var(--border)"><span></span><span>Task</span><span>Assignee</span><span>Status</span><span>Progress</span><span>Due</span></div>\${tasks.map(t=>\`<div style="display:grid;grid-template-columns:20px 1fr 140px 90px 70px 60px;gap:8px;padding:12px 20px;align-items:center;border-bottom:1px solid var(--border-subtle);cursor:pointer;transition:background .1s" onmouseover="this.style.background='var(--surface-1)'" onmouseout="this.style.background='transparent'"><div class="status-dot" style="background:\${pColor(t.p)}"></div><div><div style="font-size:11px;font-weight:600">\${t.t}</div><div style="font-size:9px;color:var(--text-muted)">\${t.c}</div></div><div style="display:flex;align-items:center;gap:6px"><img src="\${admins.find(a=>a.name===t.a)?.photo||''}" class="avatar" style="width:22px;height:22px"><span style="font-size:10px;color:var(--text-secondary)">\${t.a}</span></div><span class="tag" style="background:\${sColor(t.s)}10;color:\${sColor(t.s)};justify-content:center">\${t.s}</span><div><div class="metric-bar"><div class="metric-fill" style="width:\${t.pct}%;background:\${sColor(t.s)}"></div></div><div style="font-size:8px;color:var(--text-muted);text-align:center;margin-top:2px">\${t.pct}%</div></div><span style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">\${t.due}</span></div>\`).join('')}</div>\`;
}
// ═══ SEGMENTS ═══
function renderSegments(admin){
  return \`<div style="margin-bottom:24px" class="fade"><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Finance</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Business Segments</h2></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">\${segs.map((s,i)=>\`<div class="card fade" style="padding:22px;animation-delay:\${i*.06}s"><div class="card-accent" style="background:\${s.c}"></div><div style="font-size:15px;font-weight:800;font-family:var(--font-display);margin-bottom:2px">\${s.n}</div><div style="font-size:10px;color:var(--text-muted);margin-bottom:14px">\${s.p}% of revenue</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px"><div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:4px">Revenue</div><div style="font-size:18px;font-weight:800;font-family:var(--font-mono)">$\${(s.r/1000).toFixed(1)}B</div></div><div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:4px">Growth</div><div style="font-size:18px;font-weight:800;font-family:var(--font-mono);color:\${s.g>=0?'var(--green)':'var(--red)'}">\${s.g>=0?'+':''}\${s.g}%</div></div></div><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:4px">Operating Margin</div><div class="metric-bar" style="height:8px"><div class="metric-fill" style="width:\${s.m*1.6}%;background:\${s.c}"></div></div><div style="font-size:11px;font-weight:700;color:\${s.c};font-family:var(--font-mono);margin-top:4px">\${s.m}%</div></div>\`).join('')}</div>\`;
}
// ═══ AI FLOWS ═══
function renderAIFlows(admin){return \`<div style="margin-bottom:24px" class="fade"><div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Intelligence</div><h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">AI Automation Flows</h2></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">\${[{l:"Active",v:aiFlows.filter(f=>f.status==='active').length,c:"var(--green)"},{l:"Models",v:"3",c:"var(--purple)"},{l:"Avg Confidence",v:Math.round(aiFlows.filter(f=>f.confidence).reduce((a,f)=>a+f.confidence,0)/aiFlows.filter(f=>f.confidence).length)+"%",c:"var(--blue)"},{l:"Data/hr",v:"14.2K",c:"var(--cyan)"}].map((s,i)=>\`<div class="card fade" style="padding:18px;text-align:center;animation-delay:\${i*.06}s"><div class="card-accent" style="background:\${s.c}"></div><div style="font-size:24px;font-weight:900;font-family:var(--font-mono);color:\${s.c}">\${s.v}</div><div style="font-size:10px;color:var(--text-muted);font-weight:600;margin-top:4px">\${s.l}</div></div>\`).join('')}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">\${aiFlows.map((f,i)=>{const sc=f.status==='active'?'var(--green)':f.status==='queued'?'var(--amber)':'var(--text-muted)';return \`<div class="card fade" style="padding:22px;animation-delay:\${i*.06}s"><div class="card-accent" style="background:\${sc}"></div><div style="display:flex;justify-content:space-between;margin-bottom:12px"><div style="display:flex;align-items:center;gap:8px"><div class="live-dot" style="background:\${sc};\${f.status!=='active'?'animation:none':''}"></div><div style="font-size:14px;font-weight:800;font-family:var(--font-display)">\${f.name}</div></div><span class="tag tag-sm" style="background:\${sc}15;color:\${sc}">\${f.status}</span></div><div style="font-size:11px;color:var(--text-secondary);line-height:1.6;margin-bottom:12px">\${f.desc}</div><div style="display:flex;align-items:center;justify-content:space-between"><div style="display:flex;align-items:center;gap:8px"><span style="font-size:9px;background:var(--surface-2);padding:3px 8px;border-radius:4px;font-weight:700">\${f.model}</span><img src="\${admins.find(a=>a.name===f.assigned)?.photo||''}" style="width:16px;height:16px;border-radius:50%;object-fit:cover"><span style="font-size:9px;color:var(--text-muted)">\${f.assigned.split(' ')[0]}</span></div>\${f.confidence?\`<div style="display:flex;align-items:center;gap:6px"><div class="metric-bar" style="width:50px"><div class="metric-fill" style="width:\${f.confidence}%;background:\${sc}"></div></div><span style="font-size:10px;font-weight:700;font-family:var(--font-mono);color:\${sc}">\${f.confidence}%</span></div>\`:''}</div></div>\`}).join('')}</div>\`;}
function renderPlaceholder(view){return \`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;color:var(--text-muted)"><div style="width:64px;height:64px;border-radius:var(--r-xl);background:var(--surface-2);display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:24px">◆</div><div style="font-size:18px;font-weight:800;font-family:var(--font-display);margin-bottom:6px;color:var(--text-secondary)">\${view.charAt(0).toUpperCase()+view.slice(1)}</div><div style="font-size:12px;max-width:300px;text-align:center">Available in the full FinanceOS Enterprise deployment.</div></div>\`;}
// INIT
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
  --border:#E2E5EB;--border-subtle:#ECEEF3;--border-focus:#C41E1E40;
  --text-primary:#0A0F1A;--text-secondary:#3B4559;--text-tertiary:#6B7A94;--text-muted:#9CA7B8;--text-faint:#C2CAD6;
  --coke:#C41E1E;--coke-dark:#9A1515;--coke-deep:#6B0E0E;--coke-light:#FEF2F2;--coke-border:rgba(196,30,30,0.08);
  --green:#059669;--green-bg:#ECFDF5;--green-border:rgba(5,150,105,0.12);
  --red:#DC2626;--red-bg:#FEF2F2;--amber:#D97706;--amber-bg:#FFFBEB;--amber-border:rgba(217,119,6,0.12);
  --blue:#2563EB;--blue-bg:#EFF6FF;--blue-border:rgba(37,99,235,0.12);
  --purple:#7C3AED;--purple-bg:#F5F3FF;--purple-border:rgba(124,58,237,0.12);
  --cyan:#0891B2;--cyan-bg:#ECFEFF;--indigo:#4F46E5;--indigo-bg:#EEF2FF;
  --font-display:'Inter',system-ui,-apple-system,sans-serif;--font-body:'Manrope',system-ui,sans-serif;--font-mono:'JetBrains Mono','SF Mono',monospace;
  --shadow-xs:0 1px 2px rgba(0,0,0,0.04);--shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:0 4px 6px -1px rgba(0,0,0,0.05),0 2px 4px -2px rgba(0,0,0,0.03);--shadow-lg:0 10px 15px -3px rgba(0,0,0,0.06),0 4px 6px -4px rgba(0,0,0,0.03);
  --shadow-xl:0 20px 25px -5px rgba(0,0,0,0.06),0 8px 10px -6px rgba(0,0,0,0.03);
  --r-xs:6px;--r-sm:8px;--r:12px;--r-lg:16px;--r-xl:20px;--sidebar-w:250px;
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text-primary);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow:hidden;height:100vh;font-size:13px;line-height:1.5}
::selection{background:var(--coke);color:#fff}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideRight{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes typing{0%{width:0}100%{width:100%}}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.fade{animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both}
.slide-r{animation:slideRight .5s cubic-bezier(.16,1,.3,1) both}
.card{background:var(--surface-0);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--shadow-xs);position:relative;transition:all .25s cubic-bezier(.16,1,.3,1)}
.card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}
.card-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r-lg) var(--r-lg) 0 0}
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:.03em}
.tag-sm{font-size:9px;padding:2px 7px}
.btn{font-family:var(--font-body);cursor:pointer;border:none;border-radius:var(--r-sm);font-weight:700;font-size:11px;padding:8px 16px;display:inline-flex;align-items:center;gap:6px;transition:all .15s cubic-bezier(.16,1,.3,1);white-space:nowrap}
.btn-coke{background:var(--coke);color:#fff}.btn-coke:hover{background:var(--coke-dark);box-shadow:0 4px 14px rgba(196,30,30,0.3);transform:translateY(-1px)}
.btn-outline{background:var(--surface-0);border:1px solid var(--border);color:var(--text-secondary)}.btn-outline:hover{border-color:var(--coke);color:var(--coke);background:var(--coke-light)}
.btn-ghost{background:transparent;color:var(--text-tertiary);padding:6px 10px}.btn-ghost:hover{color:var(--text-primary);background:var(--surface-2)}
.btn-sm{font-size:10px;padding:6px 12px}.btn-xs{font-size:9px;padding:4px 8px;border-radius:var(--r-xs)}
.avatar{border-radius:50%;object-fit:cover;border:2px solid var(--surface-0);box-shadow:0 0 0 1px var(--border)}
.avatar-online{box-shadow:0 0 0 2px var(--surface-0),0 0 0 4px var(--green)}
.sidebar-section{padding:0 14px;margin-bottom:4px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint)}
.sidebar-btn{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:var(--r-sm);font-size:12px;font-weight:500;color:var(--text-secondary);cursor:pointer;transition:all .12s;border:none;background:none;width:100%;text-align:left;font-family:var(--font-body)}
.sidebar-btn:hover{background:var(--surface-2);color:var(--text-primary)}
.sidebar-btn.active{background:linear-gradient(135deg,var(--coke-light),rgba(196,30,30,0.06));color:var(--coke);font-weight:700;box-shadow:inset 0 0 0 1px var(--coke-border)}
.kpi-value{font-size:22px;font-weight:800;font-family:var(--font-mono);letter-spacing:-.04em;line-height:1}
.metric-bar{height:5px;background:var(--surface-3);border-radius:3px;overflow:hidden}.metric-fill{height:100%;border-radius:3px;transition:width 1s cubic-bezier(.16,1,.3,1)}
.admin-tab{padding:0 18px;height:44px;display:flex;align-items:center;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:var(--font-body);gap:8px}
.admin-tab:hover{color:var(--text-primary);background:var(--surface-1)}
.admin-tab.active{color:var(--coke);border-bottom-color:var(--coke);font-weight:700;background:var(--coke-light)}
.status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);display:inline-block;animation:pulse 2s infinite}
/* Teams-style message threading */
.thread-line{position:absolute;left:17px;top:42px;bottom:0;width:2px;background:var(--border-subtle)}
.msg-reactions{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap}
.msg-reaction{font-size:12px;background:var(--surface-2);padding:3px 8px;border-radius:12px;cursor:pointer;transition:all .12s;border:1px solid transparent;display:flex;align-items:center;gap:3px}
.msg-reaction:hover{background:var(--surface-3);border-color:var(--border);transform:scale(1.08)}
.msg-reaction .count{font-size:9px;font-weight:700;color:var(--text-muted)}
/* Activity Feed */
.activity-item{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-subtle);align-items:flex-start;transition:background .12s;cursor:pointer}
.activity-item:hover{background:var(--surface-1);margin:0 -12px;padding:10px 12px;border-radius:var(--r-sm)}
/* Typing indicator */
.typing-dots{display:flex;gap:3px;align-items:center;padding:4px 0}
.typing-dots span{width:4px;height:4px;border-radius:50%;background:var(--text-muted);animation:pulse 1.4s infinite}
.typing-dots span:nth-child(2){animation-delay:.2s}
.typing-dots span:nth-child(3){animation-delay:.4s}
/* Notification badge pulse */
.notif-badge{position:absolute;top:-2px;right:-2px;width:8px;height:8px;border-radius:50%;background:var(--coke);border:2px solid var(--surface-0);animation:breathe 2s infinite}
/* Gradient text */
.gradient-text{background:linear-gradient(135deg,var(--text-primary),var(--text-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
/* Animated gradient border */
.gradient-border{background:linear-gradient(135deg,var(--coke),var(--coke-dark),var(--purple),var(--blue));background-size:300% 300%;animation:gradientShift 6s ease infinite}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<!-- BRAND BAR -->
<div style="background:linear-gradient(135deg,#1A0804 0%,#2A0C08 40%,#1E0906 100%);height:46px;display:flex;align-items:center;justify-content:space-between;padding:0 28px">
  <div style="display:flex;align-items:center;gap:16px">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/200px-Coca-Cola_logo.svg.png" alt="Coca-Cola" style="height:18px;filter:brightness(2)" onerror="this.outerHTML='<span style=color:#fff;font-size:18px;font-weight:800;font-style:italic>Coca-Cola</span>'">
    <div style="width:1px;height:16px;background:rgba(255,255,255,.08)"></div>
    <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,.25);letter-spacing:.14em;font-family:var(--font-display)">THE COCA-COLA COMPANY</span>
    <div class="gradient-border" style="font-size:8px;padding:3px 10px;border-radius:4px;color:#fff;font-weight:800;letter-spacing:.06em">ENTERPRISE</div>
  </div>
  <div style="display:flex;align-items:center;gap:20px">
    <div style="display:flex;align-items:center;gap:10px"><span style="font-size:10px;color:rgba(255,255,255,.2);font-family:var(--font-mono)">NYSE: KO</span><span style="font-size:11px;font-weight:800;color:rgba(255,255,255,.7);font-family:var(--font-mono)">$62.34</span><span style="font-size:10px;color:#6EE7B7;font-weight:700;display:flex;align-items:center;gap:3px"><span class="live-dot" style="width:4px;height:4px"></span>+0.47%</span></div>
    <div style="width:1px;height:14px;background:rgba(255,255,255,.06)"></div>
    <div style="display:flex;align-items:center;gap:6px"><span class="live-dot" style="width:5px;height:5px"></span><span style="font-size:9px;color:rgba(255,255,255,.35);font-family:var(--font-mono)">LIVE</span></div>
    <span style="font-size:10px;color:rgba(255,255,255,.2);font-family:var(--font-mono)" id="liveTime"></span>
  </div>
</div>
<!-- NAV -->
<div style="background:var(--surface-0);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;padding:0 24px;position:sticky;top:0;z-index:100;box-shadow:var(--shadow-xs)">
  <div style="display:flex;align-items:center"><div style="display:flex;align-items:center;gap:8px;padding:0 20px 0 0;margin-right:14px;border-right:1px solid var(--border);height:44px"><svg width="20" height="20" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="fos" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#fos)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#059669"/></svg><div><span style="font-size:13px;font-weight:800;letter-spacing:-.02em;font-family:var(--font-display)">FinanceOS</span><span style="font-size:8px;color:var(--text-muted);margin-left:4px;font-weight:600">Enterprise</span></div></div><div id="adminTabs" style="display:flex;height:44px"></div></div>
  <div style="display:flex;align-items:center;gap:6px">
    <button class="btn btn-ghost btn-sm" onclick="togglePanel('activity')"><span style="position:relative">Activity<span class="notif-badge"></span></span></button>
    <button class="btn btn-ghost btn-sm" onclick="togglePanel('security')">Security</button>
    <button class="btn btn-outline btn-sm" onclick="togglePanel('copilot')">◎ Copilot</button>
    <button class="btn btn-outline btn-sm" style="position:relative" onclick="togglePanel('notifications')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> <span style="background:var(--coke);color:#fff;font-size:8px;padding:1px 5px;border-radius:10px;font-weight:800">3</span></button>
    <button class="btn btn-coke btn-sm">◆ Board Prep</button>
  </div>
</div>
<div style="display:flex;height:calc(100vh - 90px)">
<!-- SIDEBAR -->
<div style="width:var(--sidebar-w);border-right:1px solid var(--border);background:var(--surface-0);padding:16px 10px;flex-shrink:0;overflow-y:auto;display:flex;flex-direction:column">
  <div style="padding:0 6px;margin-bottom:16px"><div style="display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid transparent;transition:border-color .15s"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="Search anything..." style="border:none;background:none;font-family:var(--font-body);font-size:11px;color:var(--text-primary);outline:none;width:100%"><span style="font-size:8px;color:var(--text-faint);background:var(--surface-0);padding:2px 6px;border-radius:4px;border:1px solid var(--border)">⌘K</span></div></div>
  <div class="sidebar-section">Finance</div><div id="sidebarFinance" style="margin-bottom:8px"></div>
  <div style="height:1px;background:var(--border-subtle);margin:6px 10px"></div>
  <div class="sidebar-section">Organization</div><div id="sidebarOrg" style="margin-bottom:8px"></div>
  <div style="height:1px;background:var(--border-subtle);margin:6px 10px"></div>
  <div class="sidebar-section">Intelligence</div><div id="sidebarAI" style="margin-bottom:8px"></div>
  <div style="height:1px;background:var(--border-subtle);margin:6px 10px"></div>
  <div class="sidebar-section">Team · <span id="onlineCount" style="color:var(--green)"></span></div>
  <div id="teamSidebar" style="padding:4px 6px"></div>
  <div style="flex:1"></div>
  <div style="padding:10px;border-top:1px solid var(--border-subtle);margin-top:8px"><div id="currentUser"></div></div>
</div>
<!-- CONTENT -->
<div style="flex:1;overflow-y:auto;padding:24px 28px;background:var(--bg)" id="content"></div>
<!-- RIGHT PANEL -->
<div id="rightPanel" style="display:none;width:400px;border-left:1px solid var(--border);background:var(--surface-0);flex-shrink:0;overflow-y:auto"></div>
</div>


` }} />
    </>
  );
}
