'use client';

import { useEffect, useRef } from 'react';

export default function V3DemoCocacolaV5Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ═══════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════
const admins = [
  {id:"cfo",name:"James Mitchell",role:"Chief Financial Officer",shortRole:"CFO",photo:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80&fit=crop&crop=face",status:"online",department:"Executive",kpiFocus:"P&L, FCF, EPS"},
  {id:"vpf",name:"Sarah Chen",role:"VP Finance",shortRole:"VP Finance",photo:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&fit=crop&crop=face",status:"online",department:"Finance",kpiFocus:"Revenue, Margins, OpEx"},
  {id:"ctrl",name:"Marcus Rodriguez",role:"Controller",shortRole:"Controller",photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face",status:"away",department:"Accounting",kpiFocus:"Close, Compliance, 10-K"},
  {id:"fpa",name:"Priya Sharma",role:"FP&A Director",shortRole:"FP&A",photo:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80&fit=crop&crop=face",status:"online",department:"Planning",kpiFocus:"Forecast, Budget, Models"},
  {id:"trs",name:"David Kim",role:"Treasury Director",shortRole:"Treasury",photo:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80&fit=crop&crop=face",status:"offline",department:"Treasury",kpiFocus:"Cash, FX, Hedging"},
  {id:"ir",name:"Elena Volkov",role:"Investor Relations",shortRole:"IR",photo:"https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=80&q=80&fit=crop&crop=face",status:"online",department:"IR",kpiFocus:"Consensus, Guidance, Deck"},
];

const tasks = [
  {t:"Review Q4 earnings script",a:"Sarah Chen",p:"high",due:"Mar 26",s:"In Progress",c:"Reporting",pct:65},
  {t:"Finalize 10-K segment disclosures",a:"Marcus Rodriguez",p:"high",due:"Mar 27",s:"In Review",c:"Compliance",pct:85},
  {t:"Update bottling refranchising model",a:"Priya Sharma",p:"medium",due:"Mar 28",s:"In Progress",c:"Modeling",pct:40},
  {t:"Board deck — cash flow bridge",a:"James Mitchell",p:"high",due:"Mar 25",s:"Draft",c:"Board",pct:20},
  {t:"LatAm marketing ROI analysis",a:"Sarah Chen",p:"medium",due:"Mar 30",s:"Not Started",c:"Analysis",pct:0},
  {t:"Hedge position review — EUR/USD",a:"David Kim",p:"medium",due:"Mar 28",s:"In Progress",c:"Treasury",pct:55},
  {t:"Investor day presentation draft",a:"Elena Volkov",p:"low",due:"Apr 5",s:"Not Started",c:"IR",pct:0},
  {t:"Dividend declaration memo",a:"James Mitchell",p:"high",due:"Mar 25",s:"Draft",c:"Board",pct:30},
];

const msgs = [
  {from:admins[1],text:"LatAm margin expansion confirmed — 41.2% operating margin, 280bps improvement. Updated the variance bridge. Ready for your review.",time:"2:45 PM",channel:"#finance-leadership",reactions:["👍","📊"]},
  {from:admins[0],text:"Perfect. Also need the constant-currency EMEA growth pulled. The 4.2% reported understates the organic performance significantly.",time:"2:48 PM",channel:"#finance-leadership",reactions:[]},
  {from:admins[3],text:"I have the CC numbers. EMEA was 7.8% organic growth. Hedge covered 68% of exposure. Adding to the board deck variance page now.",time:"2:52 PM",channel:"#finance-leadership",reactions:["✅"]},
  {from:admins[2],text:"10-K segment note drafted. Need sign-off on the Bottling Investments disclosure — the margin compression needs careful framing for the audit committee.",time:"3:01 PM",channel:"#finance-leadership",reactions:["👀"]},
  {from:admins[5],text:"Buy-side consensus for Q1'26 is $11.9B revenue. Our internal model shows $12.1B. Should we guide above or maintain conservatism?",time:"3:14 PM",channel:"#finance-leadership",reactions:["🤔","💬"]},
  {from:admins[0],text:"Let's maintain conservatism on the topline guide. We can beat-and-raise in Q2 when LatAm momentum is confirmed with another quarter of data.",time:"3:18 PM",channel:"#finance-leadership",reactions:["✅","👍"]},
];

const kpis = [
  {l:"Net Revenue",v:"$45.8B",d:"+3.2%",u:1,bar:"var(--coke)",n:"FY2025 Consolidated",icon:"📊",sparkData:[38,40,42,41,43,44,45.8]},
  {l:"Gross Margin",v:"59.2%",d:"+40bps",u:1,bar:"var(--green)",n:"vs 58.8% prior year",icon:"📈",sparkData:[57.8,58.1,58.4,58.8,58.9,59.0,59.2]},
  {l:"Operating Income",v:"$13.2B",d:"+5.1%",u:1,bar:"var(--blue)",n:"28.8% operating margin",icon:"💰",sparkData:[11.2,11.8,12.0,12.4,12.6,12.9,13.2]},
  {l:"Free Cash Flow",v:"$9.8B",d:"+6.1%",u:1,bar:"var(--green)",n:"96.5% FCF conversion",icon:"💵",sparkData:[8.0,8.4,8.8,9.0,9.2,9.5,9.8]},
  {l:"EPS (Diluted)",v:"$2.47",d:"+4.2%",u:1,bar:"var(--purple)",n:"vs $2.37 prior year",icon:"📉",sparkData:[2.20,2.25,2.30,2.33,2.37,2.42,2.47]},
  {l:"ROIC",v:"14.2%",d:"+80bps",u:1,bar:"var(--cyan)",n:"610bps spread vs WACC",icon:"🎯",sparkData:[12.8,13.0,13.2,13.4,13.6,13.9,14.2]},
];

const segs = [
  {n:"North America",r:17420,p:38,g:2.8,m:32.1,c:"var(--coke)",emoji:"🇺🇸"},
  {n:"EMEA",r:8640,p:18.9,g:4.2,m:34.8,c:"var(--blue)",emoji:"🇪🇺"},
  {n:"Latin America",r:5280,p:11.5,g:8.1,m:41.2,c:"var(--green)",emoji:"🇧🇷"},
  {n:"Asia Pacific",r:5960,p:13,g:3.6,m:36.4,c:"var(--cyan)",emoji:"🌏"},
  {n:"Global Ventures",r:3120,p:6.8,g:12.4,m:28.6,c:"var(--purple)",emoji:"🚀"},
  {n:"Bottling Inv.",r:5380,p:11.8,g:-1.2,m:8.4,c:"var(--amber)",emoji:"🏭"},
];

const aiFlows = [
  {name:"Variance Detection",status:"active",model:"Claude Opus",desc:"Scanning Q4 actuals vs budget — 3 anomalies flagged",assigned:"Sarah Chen",confidence:94},
  {name:"Revenue Forecast",status:"active",model:"GPT-4o",desc:"Rolling 12-month forecast updated with LatAm data",assigned:"Priya Sharma",confidence:91},
  {name:"Compliance Monitor",status:"idle",model:"Claude Sonnet",desc:"10-K language review — checking SEC disclosure requirements",assigned:"Marcus Rodriguez",confidence:97},
  {name:"FX Hedge Optimizer",status:"active",model:"Claude Opus",desc:"EUR/USD position analysis — recommending hedge adjustments",assigned:"David Kim",confidence:88},
  {name:"Board Deck Generator",status:"queued",model:"GPT-4o",desc:"Auto-generating cash flow bridge slides from latest data",assigned:"James Mitchell",confidence:0},
  {name:"Consensus Tracker",status:"active",model:"Claude Sonnet",desc:"Monitoring buy-side estimate revisions — 14 analysts tracked",assigned:"Elena Volkov",confidence:96},
];

const securityEvents = [
  {type:"access",desc:"SSO login from authorized IP",user:"James Mitchell",time:"3:22 PM",severity:"info"},
  {type:"data",desc:"Q4 revenue export — 2.4MB encrypted",user:"Sarah Chen",time:"3:15 PM",severity:"info"},
  {type:"auth",desc:"Failed login attempt blocked (2FA)",user:"External",time:"2:58 PM",severity:"warning"},
  {type:"compliance",desc:"SOC 2 audit log checkpoint passed",user:"System",time:"2:30 PM",severity:"success"},
  {type:"encryption",desc:"AES-256 key rotation completed",user:"System",time:"1:00 PM",severity:"success"},
  {type:"access",desc:"Row-level security policy validated",user:"System",time:"12:00 PM",severity:"success"},
];

let activeAdmin = "cfo";
let activeView = "overview";
let panelOpen = null;

// ═══ SPARKLINE RENDERER ═══
function sparkline(data, color, w=60, h=24) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v,i) => \`\${(i/(data.length-1))*w},\${h - ((v-min)/range)*h}\`).join(' ');
  return \`<svg width="\${w}" height="\${h}" viewBox="0 0 \${w} \${h}" style="overflow:visible"><polyline points="\${pts}" fill="none" stroke="\${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="\${w}" cy="\${h - ((data[data.length-1]-min)/range)*h}" r="2" fill="\${color}"/></svg>\`;
}

// ═══ RENDER ENGINE ═══
function renderAdminTabs() {
  document.getElementById('adminTabs').innerHTML = admins.map(a => \`
    <button class="admin-tab \${a.id===activeAdmin?'active':''}" onclick="switchAdmin('\${a.id}')">
      <div style="position:relative">
        <img src="\${a.photo}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:2px solid \${a.id===activeAdmin?'var(--coke)':'transparent'}">
        <div class="status-dot" style="position:absolute;bottom:-1px;right:-1px;width:7px;height:7px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'};border:2px solid var(--surface-0)"></div>
      </div>
      <span>\${a.shortRole}</span>
    </button>
  \`).join('');
}

function switchAdmin(id) { activeAdmin=id; renderAdminTabs(); renderSidebar(); renderContent(); }

function renderSidebar() {
  const fin=[
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',l:"Overview",v:"overview"},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',l:"P&L Statement",v:"pnl"},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',l:"Segments",v:"segments"},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',l:"Forecast",v:"forecast"},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',l:"Cash Flow",v:"cashflow"},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',l:"Board Deck",v:"board"},
  ];
  const org=[
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',l:"Tasks",v:"tasks",b:tasks.filter(t=>t.s!=="Complete").length},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',l:"Messages",v:"messages",b:msgs.length},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',l:"Team",v:"team"},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',l:"Calendar",v:"calendar"},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',l:"Documents",v:"docs"},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',l:"Pipeline",v:"pipeline"},
  ];
  const ai=[
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',l:"AI Flows",v:"aiflows",b:aiFlows.filter(f=>f.status==='active').length},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',l:"Security",v:"security"},
    {i:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>',l:"Audit Log",v:"audit"},
  ];

  document.getElementById('sidebarFinance').innerHTML = fin.map(f => \`
    <button class="sidebar-btn \${f.v===activeView?'active':''}" onclick="switchView('\${f.v}')">
      <span class="icon">\${f.i}</span>\${f.l}
    </button>\`).join('');

  document.getElementById('sidebarOrg').innerHTML = org.map(o => \`
    <button class="sidebar-btn \${o.v===activeView?'active':''}" onclick="switchView('\${o.v}')">
      <span class="icon">\${o.i}</span>\${o.l}
      \${o.b ? \`<span class="tag tag-sm" style="background:var(--coke);color:#fff;margin-left:auto">\${o.b}</span>\` : ''}
    </button>\`).join('');

  document.getElementById('sidebarAI').innerHTML = ai.map(a => \`
    <button class="sidebar-btn \${a.v===activeView?'active':''}" onclick="switchView('\${a.v}')">
      <span class="icon">\${a.i}</span>\${a.l}
      \${a.b ? \`<span class="tag tag-sm" style="background:var(--indigo);color:#fff;margin-left:auto">\${a.b}</span>\` : ''}
    </button>\`).join('');

  // Team sidebar with richer presence
  document.getElementById('teamSidebar').innerHTML = admins.map(a => \`
    <div style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:var(--r-sm);cursor:pointer;transition:all .12s;margin-bottom:2px"
      onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'" onclick="switchAdmin('\${a.id}')">
      <div style="position:relative">
        <img src="\${a.photo}" class="avatar" style="width:24px;height:24px">
        <div class="status-dot" style="position:absolute;bottom:-1px;right:-1px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'};border:2px solid var(--surface-0)"></div>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:10px;font-weight:600;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${a.name.split(' ')[0]} \${a.name.split(' ')[1][0]}.</div>
      </div>
      <span style="font-size:8px;color:var(--text-muted)">\${a.status==='online'?'now':a.status==='away'?'15m':''}</span>
    </div>
  \`).join('');

  // Current user
  const admin = admins.find(a=>a.id===activeAdmin);
  document.getElementById('currentUser').innerHTML = \`
    <img src="\${admin.photo}" class="avatar avatar-ring" style="width:32px;height:32px">
    <div style="flex:1;min-width:0">
      <div style="font-size:11px;font-weight:700">\${admin.name}</div>
      <div style="font-size:9px;color:var(--text-muted)">\${admin.role}</div>
    </div>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
  \`;
}

function switchView(v) { activeView=v; renderSidebar(); renderContent(); }

// ═══ PANEL TOGGLE ═══
function togglePanel(type) {
  const panel = document.getElementById('rightPanel');
  if (panelOpen === type) { panel.style.display='none'; panelOpen=null; return; }
  panelOpen = type;
  panel.style.display = 'block';
  if (type==='copilot') renderCopilotPanel(panel);
  else if (type==='ai') renderAIPanel(panel);
  else if (type==='security') renderSecurityPanel(panel);
}

function renderCopilotPanel(el) {
  el.innerHTML = \`
    <div style="padding:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:32px;height:32px;border-radius:var(--r-sm);background:linear-gradient(135deg,var(--purple),var(--blue));display:flex;align-items:center;justify-content:center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42"/></svg>
          </div>
          <div>
            <div style="font-size:13px;font-weight:800;font-family:var(--font-display)">AI Copilot</div>
            <div style="font-size:9px;color:var(--text-muted)">Claude Opus · Enterprise</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-xs" onclick="togglePanel('copilot')">✕</button>
      </div>
      <div style="background:var(--surface-1);border-radius:var(--r);padding:16px;margin-bottom:16px;border:1px solid var(--border-subtle)">
        <div style="font-size:10px;font-weight:700;color:var(--purple);margin-bottom:8px;display:flex;align-items:center;gap:4px"><span class="live-dot" style="background:var(--purple)"></span> Thinking...</div>
        <div style="font-size:11px;color:var(--text-secondary);line-height:1.7">
          Based on the latest Q4 data, I've identified <strong>3 key insights</strong> for your board meeting:
          <br><br>
          1. LatAm operating margin expansion (+280bps) is the strongest in 8 quarters<br>
          2. FCF conversion at 96.5% puts KO in the top quartile of consumer staples<br>
          3. Bottling segment margin compression warrants a strategic review memo
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">
        \${['Summarize Q4 results','Generate board memo','Compare vs consensus','FX impact analysis'].map(q=>\`<button class="btn btn-outline btn-xs">\${q}</button>\`).join('')}
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="text" placeholder="Ask about your financial data..." style="flex:1;border:1px solid var(--border);border-radius:var(--r-sm);padding:10px 14px;font-family:var(--font-body);font-size:11px;outline:none;background:var(--surface-1);transition:border-color .15s" onfocus="this.style.borderColor='var(--purple)'" onblur="this.style.borderColor='var(--border)'">
        <button class="btn" style="background:linear-gradient(135deg,var(--purple),var(--blue));color:#fff;padding:10px 14px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>\`;
}

function renderAIPanel(el) {
  el.innerHTML = \`
    <div style="padding:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <div>
          <div style="font-size:13px;font-weight:800;font-family:var(--font-display)">AI Automation Flows</div>
          <div style="font-size:10px;color:var(--text-muted)">\${aiFlows.filter(f=>f.status==='active').length} active · \${aiFlows.filter(f=>f.status==='queued').length} queued</div>
        </div>
        <button class="btn btn-ghost btn-xs" onclick="togglePanel('ai')">✕</button>
      </div>
      \${aiFlows.map(f => {
        const statusColor = f.status==='active'?'var(--green)':f.status==='queued'?'var(--amber)':'var(--text-muted)';
        return \`
        <div class="ai-flow \${f.status==='active'?'ai-flow-active':''}" style="animation:fadeUp .4s both">
          <div style="flex-shrink:0">
            <div class="live-dot\${f.status!=='active'?' live-dot-red':''}" style="background:\${statusColor};\${f.status!=='active'?'animation:none':''}"></div>
          </div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
              <span style="font-size:11px;font-weight:700">\${f.name}</span>
              <span class="tag tag-sm" style="background:\${f.status==='active'?'var(--green-bg)':f.status==='queued'?'var(--amber-bg)':'var(--surface-2)'};color:\${statusColor}">\${f.status}</span>
            </div>
            <div style="font-size:9px;color:var(--text-tertiary);margin-bottom:3px">\${f.desc}</div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:8px;color:var(--text-muted);background:var(--surface-2);padding:1px 6px;border-radius:3px">\${f.model}</span>
              <span style="font-size:8px;color:var(--text-muted)">\${f.assigned}</span>
              \${f.confidence?\`<span style="font-size:8px;color:var(--green);font-weight:700;font-family:var(--font-mono)">\${f.confidence}%</span>\`:''}
            </div>
          </div>
        </div>\`;
      }).join('')}
    </div>\`;
}

function renderSecurityPanel(el) {
  el.innerHTML = \`
    <div style="padding:20px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
        <div>
          <div style="font-size:13px;font-weight:800;font-family:var(--font-display)">Security & Compliance</div>
          <div style="font-size:10px;color:var(--green);font-weight:600;display:flex;align-items:center;gap:4px"><span class="live-dot"></span> All systems secure</div>
        </div>
        <button class="btn btn-ghost btn-xs" onclick="togglePanel('security')">✕</button>
      </div>
      <!-- Trust badges -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
        \${[
          {l:"SOC 2 Type II",v:"Compliant",c:"var(--green)",bg:"var(--green-bg)"},
          {l:"AES-256",v:"Active",c:"var(--blue)",bg:"var(--blue-bg)"},
          {l:"RLS",v:"Enforced",c:"var(--purple)",bg:"var(--purple-bg)"},
          {l:"HSTS/CSP",v:"Enabled",c:"var(--cyan)",bg:"var(--cyan-bg)"},
        ].map(b=>\`
          <div style="background:\${b.bg};border:1px solid \${b.c}15;border-radius:var(--r-sm);padding:10px 12px;text-align:center">
            <div style="font-size:10px;font-weight:800;color:\${b.c}">\${b.l}</div>
            <div style="font-size:9px;color:var(--text-tertiary)">\${b.v}</div>
          </div>
        \`).join('')}
      </div>
      <div style="font-size:11px;font-weight:700;margin-bottom:10px">Live Activity</div>
      \${securityEvents.map(e => {
        const sColor = e.severity==='warning'?'var(--amber)':e.severity==='success'?'var(--green)':'var(--blue)';
        return \`
        <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-subtle);align-items:flex-start">
          <div style="width:6px;height:6px;border-radius:50%;background:\${sColor};margin-top:5px;flex-shrink:0"></div>
          <div style="flex:1">
            <div style="font-size:10px;font-weight:600">\${e.desc}</div>
            <div style="font-size:9px;color:var(--text-muted)">\${e.user} · \${e.time}</div>
          </div>
        </div>\`;
      }).join('')}
    </div>\`;
}

// ═══════════════════════════════════════════
// CONTENT VIEWS
// ═══════════════════════════════════════════
function renderContent() {
  const el = document.getElementById('content');
  const admin = admins.find(a => a.id === activeAdmin);
  if (activeView==='overview') el.innerHTML = renderOverview(admin);
  else if (activeView==='tasks') el.innerHTML = renderTasks(admin);
  else if (activeView==='messages') el.innerHTML = renderMessages(admin);
  else if (activeView==='team') el.innerHTML = renderTeam(admin);
  else if (activeView==='segments') el.innerHTML = renderSegments(admin);
  else if (activeView==='aiflows') el.innerHTML = renderAIFlows(admin);
  else if (activeView==='security') el.innerHTML = renderSecurityView(admin);
  else if (activeView==='pipeline') el.innerHTML = renderPipeline(admin);
  else el.innerHTML = renderPlaceholder(activeView, admin);
}

function renderOverview(admin) {
  const pColor = p => p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';
  return \`
  <!-- Hero Header -->
  <div class="card fade" style="padding:0;margin-bottom:20px;overflow:hidden;border:none;box-shadow:var(--shadow-md)">
    <div style="display:grid;grid-template-columns:1fr 320px;min-height:160px">
      <div style="padding:32px 36px;display:flex;flex-direction:column;justify-content:center">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <span class="tag" style="background:var(--green-bg);color:var(--green);border:1px solid var(--green-border)"><span class="live-dot" style="width:5px;height:5px"></span> All Systems Nominal</span>
          <span class="tag" style="background:var(--purple-bg);color:var(--purple);border:1px solid var(--purple-border)">◎ AI Copilot Active</span>
          <span class="tag" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">FY2025</span>
          <span class="tag" style="background:var(--amber-bg);color:var(--amber);border:1px solid var(--amber-border)">\${aiFlows.filter(f=>f.status==='active').length} AI Flows Running</span>
        </div>
        <h1 style="font-size:26px;font-weight:900;letter-spacing:-.04em;font-family:var(--font-display);margin-bottom:6px;background:linear-gradient(135deg,var(--text-primary),var(--text-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent">\${admin.shortRole} Command Center</h1>
        <p style="font-size:12px;color:var(--text-tertiary);line-height:1.6">Welcome back, \${admin.name.split(' ')[0]}. <strong style="color:var(--text-secondary)">\${tasks.filter(t=>t.p==='high').length} high-priority items</strong> require your attention. <strong style="color:var(--purple)">\${aiFlows.filter(f=>f.status==='active').length} AI flows</strong> are processing data.</p>
      </div>
      <div style="position:relative;overflow:hidden">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&fit=crop" style="width:100%;height:100%;object-fit:cover;display:block" alt="">
        <div style="position:absolute;inset:0;background:linear-gradient(90deg,var(--surface-0) 0%,rgba(255,255,255,0.3) 50%,rgba(255,255,255,0) 100%)"></div>
      </div>
    </div>
  </div>

  <!-- KPI Grid -->
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px">
    \${kpis.map((k,i) => \`
      <div class="card fade card-glow" style="padding:18px 20px;animation-delay:\${i*.06}s;cursor:pointer" onclick="switchView('pnl')">
        <div class="card-accent" style="background:\${k.bar}"></div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted)">\${k.l}</div>
          \${sparkline(k.sparkData, k.bar)}
        </div>
        <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px">
          <span class="kpi-value">\${k.v}</span>
          <span class="tag tag-sm" style="background:\${k.u?'var(--green-bg)':'var(--red-bg)'};color:\${k.u?'var(--green)':'var(--red)'}">▲ \${k.d}</span>
        </div>
        <div style="font-size:9px;color:var(--text-faint)">\${k.n}</div>
      </div>
    \`).join('')}
  </div>

  <!-- 3 Column Grid -->
  <div style="display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:14px;margin-bottom:20px">
    <!-- Quick Actions -->
    <div class="card" style="padding:22px">
      <div class="card-accent gradient-coke"></div>
      <div style="font-size:14px;font-weight:800;font-family:var(--font-display);margin-bottom:16px">Quick Actions</div>
      \${[
        {l:"High Priority Tasks",v:tasks.filter(t=>t.p==='high').length,c:"var(--red)",bg:"var(--red-bg)",click:"tasks",icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>'},
        {l:"Unread Messages",v:msgs.length,c:"var(--blue)",bg:"var(--blue-bg)",click:"messages",icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>'},
        {l:"Active AI Flows",v:aiFlows.filter(f=>f.status==='active').length,c:"var(--purple)",bg:"var(--purple-bg)",click:"aiflows",icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2"/></svg>'},
        {l:"Board Meeting",v:"Mar 26",c:"var(--green)",bg:"var(--green-bg)",click:"board",icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>'},
      ].map(a => \`
        <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:var(--r-sm);border:1px solid var(--border-subtle);margin-bottom:8px;cursor:pointer;transition:all .15s" onclick="switchView('\${a.click}')" onmouseover="this.style.borderColor='var(--coke)';this.style.background='var(--coke-light)'" onmouseout="this.style.borderColor='var(--border-subtle)';this.style.background='transparent'">
          <span style="color:\${a.c}">\${a.icon}</span>
          <span style="font-size:11px;font-weight:600;color:var(--text-secondary);flex:1">\${a.l}</span>
          <span class="tag tag-sm" style="background:\${a.bg};color:\${a.c}">\${a.v}</span>
        </div>
      \`).join('')}
    </div>

    <!-- Segments -->
    <div class="card" style="padding:22px">
      <div class="card-accent" style="background:linear-gradient(90deg,var(--coke),var(--amber))"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <span style="font-size:14px;font-weight:800;font-family:var(--font-display)">Business Segments</span>
        <span class="tag" style="background:var(--surface-2);color:var(--text-tertiary);border:1px solid var(--border)">$45.8B Total</span>
      </div>
      \${segs.map(s => \`
        <div style="display:grid;grid-template-columns:120px 1fr 55px 45px;gap:8px;align-items:center;padding:7px 4px;font-size:10px;border-radius:var(--r-xs);transition:background .1s;cursor:pointer" onmouseover="this.style.background='var(--surface-1)'" onmouseout="this.style.background='transparent'" onclick="switchView('segments')">
          <div style="display:flex;align-items:center;gap:6px">
            <div style="width:8px;height:8px;border-radius:3px;background:\${s.c}"></div>
            <span style="font-weight:600">\${s.n}</span>
          </div>
          <div class="metric-bar"><div class="metric-fill" style="width:\${s.p*2.5}%;background:\${s.c};opacity:.6"></div></div>
          <span style="font-weight:800;font-family:var(--font-mono);font-size:10px;text-align:right">$\${(s.r/1000).toFixed(1)}B</span>
          <span style="font-weight:700;color:\${s.g>=0?'var(--green)':'var(--red)'};font-size:10px;text-align:right;font-family:var(--font-mono)">\${s.g>=0?'+':''}\${s.g}%</span>
        </div>
      \`).join('')}
    </div>

    <!-- AI Insights -->
    <div class="card" style="padding:22px">
      <div class="card-accent gradient-blue"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <span style="font-size:14px;font-weight:800;font-family:var(--font-display)">AI Insights</span>
        <span class="tag tag-sm" style="background:var(--purple-bg);color:var(--purple);border:1px solid var(--purple-border)"><span class="live-dot" style="background:var(--purple);width:4px;height:4px"></span> LIVE</span>
      </div>
      \${[
        {t:"LatAm margins hit 41.2% — recommend increasing marketing allocation by 15%",c:"var(--green)",bg:"var(--green-bg)",conf:94,model:"Claude Opus"},
        {t:"Bottling segment OM compressed -120bps. Flagged for strategic review.",c:"var(--amber)",bg:"var(--amber-bg)",conf:91,model:"GPT-4o"},
        {t:"FCF conversion 96.5% — top quartile among consumer staples peers",c:"var(--blue)",bg:"var(--blue-bg)",conf:97,model:"Claude Sonnet"},
      ].map((ins,i) => \`
        <div style="padding:10px 12px;border-radius:var(--r-sm);background:\${ins.bg};border:1px solid \${ins.c}12;margin-bottom:8px">
          <div style="font-size:10px;color:var(--text-secondary);line-height:1.6;margin-bottom:6px">\${ins.t}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:8px;color:var(--text-muted);background:var(--surface-0);padding:1px 6px;border-radius:3px">\${ins.model}</span>
            <span style="font-size:8px;color:\${ins.c};font-weight:700;font-family:var(--font-mono)">\${ins.conf}% confidence</span>
          </div>
        </div>
      \`).join('')}
      <button class="btn btn-outline" style="width:100%;justify-content:center;margin-top:4px" onclick="togglePanel('copilot')">Open AI Copilot →</button>
    </div>
  </div>

  <!-- Bottom Grid: Messages + Tasks -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">
    <!-- Recent Messages (Teams-like) -->
    <div class="card" style="padding:22px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:14px;font-weight:800;font-family:var(--font-display)">Team Messages</span>
          <span class="tag tag-sm" style="background:var(--blue-bg);color:var(--blue)">#finance-leadership</span>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="switchView('messages')">View all →</button>
      </div>
      \${msgs.slice(0,3).map(m => \`
        <div class="msg-row">
          <img src="\${m.from.photo}" class="avatar" style="width:32px;height:32px;flex-shrink:0">
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span style="font-size:11px;font-weight:700">\${m.from.name}</span>
              <span style="font-size:9px;color:var(--text-faint)">\${m.time}</span>
            </div>
            <div class="msg-bubble">\${m.text}</div>
            \${m.reactions.length ? \`<div style="display:flex;gap:4px;margin-top:4px">\${m.reactions.map(r=>\`<span style="font-size:11px;background:var(--surface-2);padding:2px 6px;border-radius:10px;cursor:pointer">\${r}</span>\`).join('')}</div>\` : ''}
          </div>
        </div>
      \`).join('')}
    </div>

    <!-- Priority Tasks -->
    <div class="card" style="padding:22px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <span style="font-size:14px;font-weight:800;font-family:var(--font-display)">Priority Tasks</span>
        <button class="btn btn-ghost btn-sm" onclick="switchView('tasks')">View all →</button>
      </div>
      \${tasks.filter(t=>t.p==='high').slice(0,4).map(t => {
        const sColor = t.s==='In Progress'?'var(--blue)':t.s==='In Review'?'var(--purple)':t.s==='Draft'?'var(--amber)':'var(--text-muted)';
        return \`
        <div class="task-row" style="margin-bottom:4px">
          <div class="status-dot" style="background:\${pColor(t.p)}"></div>
          <div style="flex:1;min-width:0">
            <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:3px">\${t.t}</div>
            <div class="metric-bar" style="width:80px"><div class="metric-fill" style="width:\${t.pct}%;background:\${sColor}"></div></div>
          </div>
          <div style="display:flex;align-items:center;gap:4px">
            <img src="\${admins.find(a=>a.name===t.a)?.photo||''}" style="width:18px;height:18px;border-radius:50%;object-fit:cover">
          </div>
          <span style="font-size:9px;color:var(--text-muted)">\${t.due}</span>
          <span class="tag tag-sm" style="background:\${sColor}10;color:\${sColor}">\${t.s}</span>
        </div>\`;
      }).join('')}
    </div>
  </div>

  <!-- Powered by FinanceOS -->
  <div style="padding:18px 24px;border-radius:var(--r-lg);background:linear-gradient(135deg,rgba(37,99,235,.03),rgba(124,58,237,.02));border:1px solid rgba(37,99,235,.06);display:flex;justify-content:space-between;align-items:center">
    <div style="display:flex;align-items:center;gap:12px">
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg3" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg3)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#059669"/></svg>
      <div>
        <div style="font-size:12px;font-weight:800;font-family:var(--font-display)">Powered by FinanceOS · Enterprise</div>
        <div style="font-size:10px;color:var(--text-muted)">SOC 2 Type II · AES-256 · 99.9% Uptime · GDPR · Row-Level Security</div>
      </div>
    </div>
    <a href="https://finance-os.app" target="_blank" class="btn btn-coke btn-sm" style="text-decoration:none">Learn More →</a>
  </div>\`;
}

// ═══ TASKS VIEW ═══
function renderTasks(admin) {
  const pColor = p => p==='high'?'var(--red)':p==='medium'?'var(--amber)':'var(--blue)';
  const sColor = s => s==='In Progress'?'var(--blue)':s==='In Review'?'var(--purple)':s==='Draft'?'var(--amber)':'var(--text-muted)';
  return \`
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px" class="fade">
      <div>
        <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Organization</div>
        <h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Task Management</h2>
      </div>
      <button class="btn btn-coke">+ New Task</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">
      \${[
        {l:"All Tasks",v:tasks.length,c:"var(--coke)",bg:"var(--coke-light)"},
        {l:"High Priority",v:tasks.filter(t=>t.p==='high').length,c:"var(--red)",bg:"var(--red-bg)"},
        {l:"In Progress",v:tasks.filter(t=>t.s==='In Progress').length,c:"var(--blue)",bg:"var(--blue-bg)"},
        {l:"In Review",v:tasks.filter(t=>t.s==='In Review').length,c:"var(--purple)",bg:"var(--purple-bg)"},
      ].map((s,i) => \`
        <div class="card fade" style="padding:18px 20px;text-align:center;animation-delay:\${i*.06}s">
          <div class="card-accent" style="background:\${s.c}"></div>
          <div style="font-size:28px;font-weight:900;font-family:var(--font-mono);color:\${s.c}">\${s.v}</div>
          <div style="font-size:10px;color:var(--text-muted);font-weight:600;margin-top:4px">\${s.l}</div>
        </div>
      \`).join('')}
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <div style="display:grid;grid-template-columns:20px 1fr 140px 90px 60px 60px;gap:8px;padding:12px 20px;background:var(--surface-1);font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);border-bottom:1px solid var(--border)">
        <span></span><span>Task</span><span>Assignee</span><span>Status</span><span>Progress</span><span>Due</span>
      </div>
      \${tasks.map((t,i) => \`
        <div style="display:grid;grid-template-columns:20px 1fr 140px 90px 60px 60px;gap:8px;padding:12px 20px;align-items:center;border-bottom:1px solid var(--border-subtle);transition:background .1s;cursor:pointer" onmouseover="this.style.background='var(--surface-1)'" onmouseout="this.style.background='transparent'">
          <div class="status-dot" style="background:\${pColor(t.p)}"></div>
          <div>
            <div style="font-size:11px;font-weight:600">\${t.t}</div>
            <div style="font-size:9px;color:var(--text-muted)">\${t.c}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <img src="\${admins.find(a=>a.name===t.a)?.photo||''}" class="avatar" style="width:22px;height:22px">
            <span style="font-size:10px;color:var(--text-secondary)">\${t.a}</span>
          </div>
          <span class="tag" style="background:\${sColor(t.s)}10;color:\${sColor(t.s)};justify-content:center">\${t.s}</span>
          <div>
            <div class="metric-bar"><div class="metric-fill" style="width:\${t.pct}%;background:\${sColor(t.s)}"></div></div>
            <div style="font-size:8px;color:var(--text-muted);text-align:center;margin-top:2px">\${t.pct}%</div>
          </div>
          <span style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">\${t.due}</span>
        </div>
      \`).join('')}
    </div>\`;
}

// ═══ MESSAGES VIEW (Teams-like) ═══
function renderMessages(admin) {
  return \`
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px" class="fade">
      <div>
        <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Communication Hub</div>
        <h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Team Messages</h2>
      </div>
      <div style="display:flex;gap:6px">
        <span class="tag" style="background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)">#finance-leadership</span>
        <span class="tag" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">#board-prep</span>
        <span class="tag" style="background:var(--surface-2);color:var(--text-muted);border:1px solid var(--border)">#treasury</span>
      </div>
    </div>
    <div class="card" style="padding:24px">
      \${msgs.map((m,i) => \`
        <div class="msg-row fade" style="animation-delay:\${i*.06}s">
          <img src="\${m.from.photo}" class="avatar" style="width:36px;height:36px;flex-shrink:0">
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:12px;font-weight:700">\${m.from.name}</span>
              <span style="font-size:9px;color:var(--text-muted)">\${m.from.shortRole}</span>
              <span style="font-size:9px;color:var(--text-faint)">\${m.time}</span>
            </div>
            <div class="msg-bubble">\${m.text}</div>
            \${m.reactions.length ? \`<div style="display:flex;gap:4px;margin-top:6px">\${m.reactions.map(r=>\`<span style="font-size:12px;background:var(--surface-2);padding:3px 8px;border-radius:12px;cursor:pointer;transition:background .1s" onmouseover="this.style.background='var(--surface-3)'" onmouseout="this.style.background='var(--surface-2)'">\${r}</span>\`).join('')}</div>\` : ''}
          </div>
        </div>
      \`).join('')}
      <!-- Message Input -->
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border-subtle)">
        <div style="display:flex;gap:10px;align-items:flex-end">
          <img src="\${admin.photo}" class="avatar" style="width:32px;height:32px;flex-shrink:0">
          <div style="flex:1;border:1px solid var(--border);border-radius:var(--r);padding:12px 16px;background:var(--surface-1);transition:border-color .15s" onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='var(--border)'">
            <div contenteditable="true" style="font-family:var(--font-body);font-size:12px;outline:none;min-height:20px;color:var(--text-secondary)" data-placeholder="Message #finance-leadership..."></div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
              <div style="display:flex;gap:6px">
                <button class="btn btn-ghost btn-xs">📎 Attach</button>
                <button class="btn btn-ghost btn-xs">@ Mention</button>
                <button class="btn btn-ghost btn-xs">◎ AI Assist</button>
              </div>
              <button class="btn btn-coke btn-sm">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>\`;
}

// ═══ TEAM VIEW ═══
function renderTeam(admin) {
  return \`
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px" class="fade">
      <div>
        <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Organization</div>
        <h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Finance Team</h2>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
      \${admins.map((a,i) => \`
        <div class="card fade card-glow" style="padding:24px;animation-delay:\${i*.06}s;cursor:pointer" onclick="switchAdmin('\${a.id}')">
          <div class="card-accent" style="background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'}"></div>
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
            <div style="position:relative">
              <img src="\${a.photo}" class="avatar \${a.status==='online'?'avatar-ring':''}" style="width:52px;height:52px">
              <div class="status-dot" style="position:absolute;bottom:1px;right:1px;width:10px;height:10px;background:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-faint)'};border:2px solid var(--surface-0)"></div>
            </div>
            <div>
              <div style="font-size:14px;font-weight:800;font-family:var(--font-display)">\${a.name}</div>
              <div style="font-size:11px;color:var(--text-tertiary)">\${a.role}</div>
              <div style="font-size:10px;color:\${a.status==='online'?'var(--green)':a.status==='away'?'var(--amber)':'var(--text-muted)'};font-weight:600;margin-top:2px">\${a.status==='online'?'● Online now':a.status==='away'?'● Away (15m)':'○ Offline'}</div>
            </div>
          </div>
          <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:6px">Focus Areas</div>
          <div style="font-size:10px;color:var(--text-secondary);margin-bottom:12px">\${a.kpiFocus}</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <span class="tag tag-sm" style="background:var(--surface-2);color:var(--text-tertiary)">\${a.department}</span>
            <span class="tag tag-sm" style="background:var(--surface-2);color:var(--text-tertiary)">\${tasks.filter(t=>t.a===a.name).length} tasks</span>
            \${aiFlows.filter(f=>f.assigned===a.name).length?\`<span class="tag tag-sm" style="background:var(--purple-bg);color:var(--purple)">\${aiFlows.filter(f=>f.assigned===a.name).length} AI flows</span>\`:''}
          </div>
        </div>
      \`).join('')}
    </div>\`;
}

// ═══ SEGMENTS VIEW ═══
function renderSegments(admin) {
  return \`
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px" class="fade">
      <div>
        <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Finance</div>
        <h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Business Segments</h2>
      </div>
      <span class="tag" style="background:var(--surface-2);color:var(--text-tertiary);border:1px solid var(--border)">FY2025 · $45.8B Consolidated</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px">
      \${segs.map((s,i) => \`
        <div class="card fade card-glow" style="padding:22px;animation-delay:\${i*.06}s">
          <div class="card-accent" style="background:\${s.c}"></div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
            <div>
              <div style="font-size:15px;font-weight:800;font-family:var(--font-display)">\${s.n}</div>
              <div style="font-size:10px;color:var(--text-muted)">\${s.p}% of total revenue</div>
            </div>
            <span style="font-size:20px">\${s.emoji}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
            <div>
              <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:4px">Revenue</div>
              <div style="font-size:18px;font-weight:800;font-family:var(--font-mono)">$\${(s.r/1000).toFixed(1)}B</div>
            </div>
            <div>
              <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:4px">Growth</div>
              <div style="font-size:18px;font-weight:800;font-family:var(--font-mono);color:\${s.g>=0?'var(--green)':'var(--red)'}">\${s.g>=0?'+':''}\${s.g}%</div>
            </div>
          </div>
          <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--text-faint);margin-bottom:4px">Operating Margin</div>
          <div class="metric-bar" style="height:8px;margin-bottom:4px">
            <div class="metric-fill" style="width:\${s.m*1.6}%;background:\${s.c}"></div>
          </div>
          <div style="font-size:11px;font-weight:700;color:\${s.c};font-family:var(--font-mono)">\${s.m}%</div>
        </div>
      \`).join('')}
    </div>\`;
}

// ═══ AI FLOWS VIEW ═══
function renderAIFlows(admin) {
  return \`
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px" class="fade">
      <div>
        <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Intelligence</div>
        <h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">AI Automation Flows</h2>
      </div>
      <div style="display:flex;gap:6px">
        <span class="tag" style="background:var(--green-bg);color:var(--green);border:1px solid var(--green-border)"><span class="live-dot" style="width:4px;height:4px"></span> \${aiFlows.filter(f=>f.status==='active').length} Active</span>
        <span class="tag" style="background:var(--amber-bg);color:var(--amber);border:1px solid var(--amber-border)">\${aiFlows.filter(f=>f.status==='queued').length} Queued</span>
      </div>
    </div>
    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">
      \${[
        {l:"Active Flows",v:aiFlows.filter(f=>f.status==='active').length,c:"var(--green)"},
        {l:"Models Connected",v:"3",c:"var(--purple)"},
        {l:"Avg Confidence",v:Math.round(aiFlows.filter(f=>f.confidence).reduce((a,f)=>a+f.confidence,0)/aiFlows.filter(f=>f.confidence).length)+"%",c:"var(--blue)"},
        {l:"Data Points/hr",v:"14.2K",c:"var(--cyan)"},
      ].map((s,i) => \`
        <div class="card fade" style="padding:18px;text-align:center;animation-delay:\${i*.06}s">
          <div class="card-accent" style="background:\${s.c}"></div>
          <div style="font-size:24px;font-weight:900;font-family:var(--font-mono);color:\${s.c}">\${s.v}</div>
          <div style="font-size:10px;color:var(--text-muted);font-weight:600;margin-top:4px">\${s.l}</div>
        </div>
      \`).join('')}
    </div>
    <!-- Flow Cards -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      \${aiFlows.map((f,i) => {
        const sc = f.status==='active'?'var(--green)':f.status==='queued'?'var(--amber)':'var(--text-muted)';
        return \`
        <div class="card fade" style="padding:22px;animation-delay:\${i*.06}s">
          <div class="card-accent" style="background:\${sc}"></div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
            <div style="display:flex;align-items:center;gap:8px">
              <div class="live-dot\${f.status!=='active'?'':''}" style="background:\${sc};\${f.status!=='active'?'animation:none':''}"></div>
              <div style="font-size:14px;font-weight:800;font-family:var(--font-display)">\${f.name}</div>
            </div>
            <span class="tag tag-sm" style="background:\${sc}15;color:\${sc}">\${f.status}</span>
          </div>
          <div style="font-size:11px;color:var(--text-secondary);line-height:1.6;margin-bottom:12px">\${f.desc}</div>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:9px;background:var(--surface-2);padding:3px 8px;border-radius:4px;font-weight:700;color:var(--text-tertiary)">\${f.model}</span>
              <div style="display:flex;align-items:center;gap:4px">
                <img src="\${admins.find(a=>a.name===f.assigned)?.photo||''}" style="width:16px;height:16px;border-radius:50%;object-fit:cover">
                <span style="font-size:9px;color:var(--text-muted)">\${f.assigned.split(' ')[0]}</span>
              </div>
            </div>
            \${f.confidence?\`
            <div style="display:flex;align-items:center;gap:6px">
              <div class="metric-bar" style="width:50px"><div class="metric-fill" style="width:\${f.confidence}%;background:\${sc}"></div></div>
              <span style="font-size:10px;font-weight:700;font-family:var(--font-mono);color:\${sc}">\${f.confidence}%</span>
            </div>\`:'<span style="font-size:9px;color:var(--text-muted)">Waiting...</span>'}
          </div>
        </div>\`;
      }).join('')}
    </div>\`;
}

// ═══ SECURITY VIEW ═══
function renderSecurityView(admin) {
  return \`
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px" class="fade">
      <div>
        <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Intelligence</div>
        <h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Security & Compliance</h2>
      </div>
      <span class="tag" style="background:var(--green-bg);color:var(--green);border:1px solid var(--green-border)"><span class="live-dot" style="width:5px;height:5px"></span> All Systems Secure</span>
    </div>
    <!-- Security Score -->
    <div class="card fade" style="padding:28px;margin-bottom:20px;overflow:hidden">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:20px">
        \${[
          {l:"SOC 2 Type II",v:"Compliant",desc:"Audit-ready architecture with full access logging",c:"var(--green)",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'},
          {l:"AES-256 Encryption",v:"Active",desc:"Data encrypted at rest and in transit",c:"var(--blue)",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>'},
          {l:"Row-Level Security",v:"Enforced",desc:"Every query scoped to your organization",c:"var(--purple)",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>'},
          {l:"HSTS + CSP",v:"Enabled",desc:"Strict Transport Security with Content Security Policy",c:"var(--cyan)",icon:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'},
        ].map(s => \`
          <div style="text-align:center">
            <div style="width:48px;height:48px;border-radius:var(--r);background:\${s.c}10;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:\${s.c}">\${s.icon}</div>
            <div style="font-size:13px;font-weight:800;font-family:var(--font-display);margin-bottom:2px">\${s.l}</div>
            <div style="font-size:10px;font-weight:700;color:\${s.c};margin-bottom:4px">\${s.v}</div>
            <div style="font-size:9px;color:var(--text-muted)">\${s.desc}</div>
          </div>
        \`).join('')}
      </div>
    </div>
    <!-- Activity Log -->
    <div class="card" style="padding:22px">
      <div style="font-size:14px;font-weight:800;font-family:var(--font-display);margin-bottom:16px">Live Security Activity</div>
      \${securityEvents.map((e,i) => {
        const sColor = e.severity==='warning'?'var(--amber)':e.severity==='success'?'var(--green)':'var(--blue)';
        return \`
        <div class="fade" style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border-subtle);align-items:center;animation-delay:\${i*.06}s">
          <div style="width:32px;height:32px;border-radius:var(--r-sm);background:\${sColor}10;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <div style="width:8px;height:8px;border-radius:50%;background:\${sColor}"></div>
          </div>
          <div style="flex:1">
            <div style="font-size:11px;font-weight:600">\${e.desc}</div>
            <div style="font-size:9px;color:var(--text-muted)">\${e.user} · \${e.time}</div>
          </div>
          <span class="tag tag-sm" style="background:\${sColor}10;color:\${sColor}">\${e.severity}</span>
        </div>\`;
      }).join('')}
    </div>\`;
}

// ═══ PIPELINE VIEW ═══
function renderPipeline(admin) {
  const stages = [
    {name:"Lead",color:"var(--blue)",items:[{n:"Acme Corp",v:"$180K",d:"Mar 20"},{n:"GlobalTech",v:"$95K",d:"Mar 22"}]},
    {name:"Demo",color:"var(--purple)",items:[{n:"Nexus Industries",v:"$320K",d:"Mar 18"},{n:"Vertex Labs",v:"$150K",d:"Mar 15"}]},
    {name:"Proposal",color:"var(--amber)",items:[{n:"Atlas Financial",v:"$450K",d:"Mar 12"}]},
    {name:"Negotiation",color:"var(--green)",items:[{n:"Meridian Partners",v:"$620K",d:"Mar 5"},{n:"Summit Holdings",v:"$280K",d:"Mar 8"}]},
  ];
  return \`
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px" class="fade">
      <div>
        <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;color:var(--text-faint);margin-bottom:4px">Organization</div>
        <h2 style="font-size:22px;font-weight:900;letter-spacing:-.03em;font-family:var(--font-display)">Deal Pipeline</h2>
      </div>
      <span class="tag" style="background:var(--green-bg);color:var(--green);border:1px solid var(--green-border)">$2.1M Total Pipeline</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
      \${stages.map((s,si) => \`
        <div class="fade" style="animation-delay:\${si*.08}s">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:8px;height:8px;border-radius:50%;background:\${s.color}"></div>
              <span style="font-size:12px;font-weight:700">\${s.name}</span>
            </div>
            <span class="tag tag-sm" style="background:var(--surface-2);color:var(--text-muted)">\${s.items.length}</span>
          </div>
          \${s.items.map(item => \`
            <div class="card" style="padding:16px;margin-bottom:8px;cursor:pointer">
              <div class="card-accent" style="background:\${s.color}"></div>
              <div style="font-size:12px;font-weight:700;margin-bottom:4px">\${item.n}</div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:14px;font-weight:800;font-family:var(--font-mono);color:\${s.color}">\${item.v}</span>
                <span style="font-size:9px;color:var(--text-muted)">\${item.d}</span>
              </div>
            </div>
          \`).join('')}
        </div>
      \`).join('')}
    </div>\`;
}

// ═══ PLACEHOLDER ═══
function renderPlaceholder(view, admin) {
  return \`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;color:var(--text-muted)">
      <div style="width:64px;height:64px;border-radius:var(--r-xl);background:linear-gradient(135deg,var(--surface-2),var(--surface-3));display:flex;align-items:center;justify-content:center;margin-bottom:20px">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      </div>
      <div style="font-size:18px;font-weight:800;font-family:var(--font-display);margin-bottom:6px;color:var(--text-secondary)">\${view.charAt(0).toUpperCase()+view.slice(1)}</div>
      <div style="font-size:12px;color:var(--text-muted);max-width:300px;text-align:center">Available in the full FinanceOS Enterprise deployment. Contact your account team for activation.</div>
      <button class="btn btn-outline" style="margin-top:16px">Request Access →</button>
    </div>\`;
}

// ═══ INIT ═══
renderAdminTabs();
renderSidebar();
renderContent();`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
/* ═══════════════════════════════════════════════════════
   COCA-COLA EXECUTIVE FINANCE TERMINAL v5
   Premium Enterprise Dashboard — FinanceOS
   ═══════════════════════════════════════════════════════ */

:root {
  /* Surface System — Layered depth like Figma */
  --bg: #F4F5F7; --bg-deep: #EBEDF1;
  --surface-0: #FFFFFF; --surface-1: #F9FAFB; --surface-2: #F3F4F6; --surface-3: #E8EAEF;
  --border: #E2E5EB; --border-subtle: #ECEEF3; --border-focus: #C41E1E40;

  /* Text Hierarchy */
  --text-primary: #0A0F1A; --text-secondary: #3B4559; --text-tertiary: #6B7A94;
  --text-muted: #9CA7B8; --text-faint: #C2CAD6;

  /* Coca-Cola Brand */
  --coke: #C41E1E; --coke-dark: #9A1515; --coke-deep: #6B0E0E;
  --coke-light: #FEF2F2; --coke-border: rgba(196,30,30,0.08);

  /* Semantic Colors */
  --green: #059669; --green-bg: #ECFDF5; --green-border: rgba(5,150,105,0.12);
  --red: #DC2626; --red-bg: #FEF2F2;
  --amber: #D97706; --amber-bg: #FFFBEB; --amber-border: rgba(217,119,6,0.12);
  --blue: #2563EB; --blue-bg: #EFF6FF; --blue-border: rgba(37,99,235,0.12);
  --purple: #7C3AED; --purple-bg: #F5F3FF; --purple-border: rgba(124,58,237,0.12);
  --cyan: #0891B2; --cyan-bg: #ECFEFF;
  --indigo: #4F46E5; --indigo-bg: #EEF2FF;

  /* Typography */
  --font-display: 'Inter', system-ui, -apple-system, sans-serif;
  --font-body: 'Manrope', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;

  /* Elevation System */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.03);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -4px rgba(0,0,0,0.03);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.03);
  --shadow-card: 0 0 0 1px var(--border), 0 1px 3px rgba(0,0,0,0.04);
  --shadow-card-hover: 0 0 0 1px var(--border), 0 4px 12px rgba(0,0,0,0.08);

  /* Radii */
  --r-xs: 6px; --r-sm: 8px; --r: 12px; --r-lg: 16px; --r-xl: 20px; --r-2xl: 24px;

  /* Sidebar */
  --sidebar-w: 240px;
}

* { margin:0; padding:0; box-sizing:border-box; }
body { background:var(--bg); color:var(--text-primary); font-family:var(--font-body); -webkit-font-smoothing:antialiased; overflow:hidden; height:100vh; font-size:13px; line-height:1.5; }
::selection { background:var(--coke); color:#fff; }

/* Animations */
@keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) }}
@keyframes slideIn { from { opacity:0; transform:translateX(-8px) } to { opacity:1; transform:translateX(0) }}
@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 }}
@keyframes shimmer { 0% { background-position:-200% 0 } 100% { background-position:200% 0 }}
@keyframes glow { 0%,100% { box-shadow:0 0 4px rgba(196,30,30,0.2) } 50% { box-shadow:0 0 12px rgba(196,30,30,0.4) }}
.fade { animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both; }
.slide { animation: slideIn .4s cubic-bezier(.16,1,.3,1) both; }

/* ═══ CARD SYSTEM ═══ */
.card {
  background: var(--surface-0);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs);
  position: relative;
  transition: all .2s cubic-bezier(.16,1,.3,1);
}
.card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
.card-accent { position:absolute; top:0; left:0; right:0; height:3px; border-radius: var(--r-lg) var(--r-lg) 0 0; }
.card-glass {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.5);
}

/* ═══ TAGS & BADGES ═══ */
.tag {
  display:inline-flex; align-items:center; gap:4px;
  padding: 3px 10px; border-radius: 6px;
  font-size: 10px; font-weight: 700; letter-spacing:.03em;
  line-height: 1.4;
}
.tag-sm { font-size:9px; padding:2px 7px; }

/* ═══ BUTTONS ═══ */
.btn {
  font-family:var(--font-body); cursor:pointer; border:none;
  border-radius:var(--r-sm); font-weight:700; font-size:11px;
  padding:8px 16px; display:inline-flex; align-items:center; gap:6px;
  transition: all .15s cubic-bezier(.16,1,.3,1); white-space:nowrap;
  letter-spacing: .01em;
}
.btn-coke { background:var(--coke); color:#fff; }
.btn-coke:hover { background:var(--coke-dark); box-shadow:0 4px 12px rgba(196,30,30,0.3); transform:translateY(-1px); }
.btn-outline { background:var(--surface-0); border:1px solid var(--border); color:var(--text-secondary); }
.btn-outline:hover { border-color:var(--coke); color:var(--coke); background:var(--coke-light); }
.btn-ghost { background:transparent; color:var(--text-tertiary); padding:6px 10px; }
.btn-ghost:hover { color:var(--text-primary); background:var(--surface-2); }
.btn-sm { font-size:10px; padding:6px 12px; }
.btn-xs { font-size:9px; padding:4px 8px; border-radius:var(--r-xs); }

/* ═══ AVATAR ═══ */
.avatar { border-radius:50%; object-fit:cover; border:2px solid var(--surface-0); box-shadow:0 0 0 1px var(--border); }
.avatar-ring { box-shadow:0 0 0 2px var(--surface-0), 0 0 0 4px var(--green); }

/* ═══ SIDEBAR ═══ */
.sidebar-section { padding:0 12px; margin-bottom:4px; font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.14em; color:var(--text-faint); }
.sidebar-btn {
  display:flex; align-items:center; gap:10px;
  padding:8px 14px; border-radius:var(--r-sm);
  font-size:12px; font-weight:500; color:var(--text-secondary);
  cursor:pointer; transition:all .12s; border:none; background:none;
  width:100%; text-align:left; font-family:var(--font-body);
}
.sidebar-btn:hover { background:var(--surface-2); color:var(--text-primary); }
.sidebar-btn.active {
  background: linear-gradient(135deg, var(--coke-light), rgba(196,30,30,0.06));
  color:var(--coke); font-weight:700;
  box-shadow: inset 0 0 0 1px var(--coke-border);
}
.sidebar-btn .icon { width:18px; text-align:center; font-size:14px; opacity:.5; }
.sidebar-btn.active .icon { opacity:1; }

/* ═══ METRIC SYSTEM ═══ */
.kpi-value { font-size:22px; font-weight:800; font-family:var(--font-mono); letter-spacing:-.04em; line-height:1; }
.metric-bar { height:5px; background:var(--surface-3); border-radius:3px; overflow:hidden; }
.metric-fill { height:100%; border-radius:3px; transition: width .8s cubic-bezier(.16,1,.3,1); }

/* ═══ ADMIN TABS ═══ */
.admin-tab {
  padding:0 18px; height:42px; display:flex; align-items:center;
  font-size:11px; font-weight:600; color:var(--text-muted);
  cursor:pointer; border-bottom:2px solid transparent;
  transition:all .15s; background:none; border-top:none;
  border-left:none; border-right:none; font-family:var(--font-body); gap:8px;
}
.admin-tab:hover { color:var(--text-primary); background:var(--surface-1); }
.admin-tab.active { color:var(--coke); border-bottom-color:var(--coke); font-weight:700; background:var(--coke-light); }

/* ═══ TASK ROWS ═══ */
.task-row { display:flex; align-items:center; gap:10px; padding:10px 16px; border-radius:var(--r-sm); transition:all .12s; cursor:pointer; }
.task-row:hover { background:var(--surface-1); }
.status-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }

/* ═══ MESSAGE SYSTEM (Teams-like) ═══ */
.msg-row { display:flex; gap:12px; padding:14px 0; align-items:flex-start; }
.msg-row + .msg-row { border-top:1px solid var(--border-subtle); }
.msg-bubble { background:var(--surface-1); border-radius:0 var(--r) var(--r) var(--r); padding:10px 14px; font-size:11px; line-height:1.6; color:var(--text-secondary); position:relative; }
.msg-bubble.self { background:var(--coke-light); border-radius:var(--r) 0 var(--r) var(--r); }

/* ═══ AI FLOW TRACKER ═══ */
.ai-flow { display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:var(--r-sm); background:var(--surface-1); border:1px solid var(--border-subtle); margin-bottom:6px; transition:all .15s; }
.ai-flow:hover { background:var(--indigo-bg); border-color:var(--indigo); }
.ai-flow .dot { width:6px; height:6px; border-radius:50%; animation:pulse 2s infinite; }
.ai-flow-active { border-color:var(--green-border); background:var(--green-bg); }

/* ═══ SECURITY TRACKER ═══ */
.security-item { display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:var(--r-sm); }
.security-badge { width:32px; height:32px; border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; }

/* ═══ SCROLLBAR ═══ */
::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
::-webkit-scrollbar-thumb:hover { background:var(--text-muted); }

/* ═══ LIVE INDICATOR ═══ */
.live-dot { width:6px; height:6px; border-radius:50%; background:var(--green); display:inline-block; animation:pulse 2s infinite; }
.live-dot-red { background:var(--red); }

/* ═══ CHART PLACEHOLDER ═══ */
.chart-area {
  background: linear-gradient(180deg, var(--surface-1) 0%, var(--surface-0) 100%);
  border-radius: var(--r-sm);
  border: 1px dashed var(--border);
  display:flex; align-items:center; justify-content:center;
  color:var(--text-muted); font-size:11px; font-weight:600;
}

/* Premium gradient overlays */
.gradient-coke { background: linear-gradient(135deg, #C41E1E 0%, #9A1515 50%, #6B0E0E 100%); }
.gradient-dark { background: linear-gradient(135deg, #0A0F1A 0%, #1A1F2E 50%, #0F1420 100%); }
.gradient-blue { background: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%); }
.gradient-premium { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }

/* Hover card glow */
.card-glow:hover { box-shadow: var(--shadow-lg), 0 0 0 1px var(--coke-border); }
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- ═══════════════════════════════════════════
     EXECUTIVE BRAND BAR — Coca-Cola Identity
     ═══════════════════════════════════════════ -->
<div class="gradient-premium" style="height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 28px">
  <div style="display:flex;align-items:center;gap:16px">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/200px-Coca-Cola_logo.svg.png" alt="Coca-Cola" style="height:18px;filter:brightness(2)" onerror="this.outerHTML='<span style=color:#fff;font-size:18px;font-weight:800;font-style:italic;letter-spacing:-.5px>Coca-Cola</span>'">
    <div style="width:1px;height:16px;background:rgba(255,255,255,.08)"></div>
    <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,.25);letter-spacing:.14em;font-family:var(--font-display)">THE COCA-COLA COMPANY</span>
    <span style="font-size:8px;padding:3px 10px;border-radius:4px;background:linear-gradient(135deg,rgba(196,30,30,.4),rgba(196,30,30,.2));color:#FCA5A5;font-weight:800;letter-spacing:.06em;border:1px solid rgba(196,30,30,.2)">ENTERPRISE</span>
  </div>
  <div style="display:flex;align-items:center;gap:20px">
    <div style="display:flex;align-items:center;gap:10px">
      <span style="font-size:10px;color:rgba(255,255,255,.2);font-family:var(--font-mono)">NYSE: KO</span>
      <span style="font-size:11px;font-weight:800;color:rgba(255,255,255,.7);font-family:var(--font-mono)">$62.34</span>
      <span style="font-size:10px;color:#6EE7B7;font-weight:700;display:flex;align-items:center;gap:3px"><span class="live-dot" style="width:4px;height:4px"></span>+0.47%</span>
    </div>
    <div style="width:1px;height:14px;background:rgba(255,255,255,.06)"></div>
    <div style="display:flex;align-items:center;gap:6px">
      <span class="live-dot" style="width:5px;height:5px"></span>
      <span style="font-size:9px;color:rgba(255,255,255,.35);font-family:var(--font-mono)">LIVE</span>
    </div>
    <span style="font-size:10px;color:rgba(255,255,255,.2);font-family:var(--font-mono)">Mar 24, 2026 · 3:24 PM ET</span>
  </div>
</div>

<!-- ═══ ADMIN NAVIGATION ═══ -->
<div style="background:var(--surface-0);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;padding:0 24px;position:sticky;top:0;z-index:100;box-shadow:var(--shadow-xs)">
  <div style="display:flex;align-items:center;gap:0">
    <!-- FinanceOS Logo -->
    <div style="display:flex;align-items:center;gap:8px;padding:0 20px 0 0;margin-right:14px;border-right:1px solid var(--border);height:42px">
      <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="fos" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#fos)"/><path d="M8 10h16M8 16h12M8 22h8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="22" r="3" fill="#059669"/></svg>
      <div>
        <span style="font-size:13px;font-weight:800;letter-spacing:-.02em;font-family:var(--font-display)">FinanceOS</span>
        <span style="font-size:8px;color:var(--text-muted);margin-left:4px;font-weight:600">Enterprise</span>
      </div>
    </div>
    <div id="adminTabs" style="display:flex;height:42px"></div>
  </div>
  <div style="display:flex;align-items:center;gap:6px">
    <button class="btn btn-ghost btn-sm" onclick="togglePanel('security')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Security
    </button>
    <button class="btn btn-ghost btn-sm" onclick="togglePanel('ai')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      AI Flows
    </button>
    <button class="btn btn-outline btn-sm" onclick="togglePanel('copilot')">◎ Copilot</button>
    <button class="btn btn-outline btn-sm">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
      3
    </button>
    <button class="btn btn-coke btn-sm">◆ Share with Board</button>
  </div>
</div>

<!-- ═══ MAIN LAYOUT ═══ -->
<div style="display:flex;height:calc(100vh - 86px)">

<!-- ═══ SIDEBAR ═══ -->
<div style="width:var(--sidebar-w);border-right:1px solid var(--border);background:var(--surface-0);padding:16px 10px;flex-shrink:0;overflow-y:auto;display:flex;flex-direction:column">

  <!-- Search -->
  <div style="padding:0 6px;margin-bottom:16px">
    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid transparent;transition:all .15s" onfocus="this.style.borderColor='var(--coke)'" onblur="this.style.borderColor='transparent'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" placeholder="Search..." style="border:none;background:none;font-family:var(--font-body);font-size:11px;color:var(--text-primary);outline:none;width:100%">
    </div>
  </div>

  <div class="sidebar-section">Finance</div>
  <div id="sidebarFinance" style="margin-bottom:8px"></div>

  <div style="height:1px;background:var(--border-subtle);margin:6px 10px"></div>

  <div class="sidebar-section">Organization</div>
  <div id="sidebarOrg" style="margin-bottom:8px"></div>

  <div style="height:1px;background:var(--border-subtle);margin:6px 10px"></div>

  <div class="sidebar-section">Intelligence</div>
  <div id="sidebarAI" style="margin-bottom:8px"></div>

  <div style="height:1px;background:var(--border-subtle);margin:6px 10px"></div>

  <div class="sidebar-section">Team Online</div>
  <div id="teamSidebar" style="padding:4px 6px"></div>

  <!-- User Profile (bottom) -->
  <div style="flex:1"></div>
  <div style="padding:10px;border-top:1px solid var(--border-subtle);margin-top:8px">
    <div id="currentUser" style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:var(--r-sm);cursor:pointer;transition:background .15s" onmouseover="this.style.background='var(--surface-2)'" onmouseout="this.style.background='transparent'"></div>
  </div>
</div>

<!-- ═══ CONTENT AREA ═══ -->
<div style="flex:1;overflow-y:auto;padding:24px 28px;background:var(--bg)" id="content"></div>

<!-- ═══ RIGHT PANEL (Copilot / AI Flows / Security) ═══ -->
<div id="rightPanel" style="display:none;width:380px;border-left:1px solid var(--border);background:var(--surface-0);flex-shrink:0;overflow-y:auto"></div>
</div>


` }} />
    </>
  );
}
