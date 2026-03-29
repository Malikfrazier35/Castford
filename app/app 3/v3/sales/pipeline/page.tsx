'use client';

import { useEffect, useRef } from 'react';

export default function V3SalesPipelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// DEAL DATA
const STAGES=[
  {name:'Prospecting',color:'var(--t4)',count:12,value:'$1.2M',deals:[
    {co:'Meridian Corp',val:'$82K',contact:'Sarah C.',days:5,priority:'green',pct:20},
    {co:'Northpeak Tech',val:'$45K',contact:'James R.',days:3,priority:'green',pct:10},
    {co:'Clearpath AI',val:'$120K',contact:'Priya P.',days:8,priority:'amber',pct:15}
  ]},
  {name:'Qualification',color:'var(--blue)',count:8,value:'$1.8M',deals:[
    {co:'Atlas Industries',val:'$180K',contact:'David K.',days:12,priority:'amber',pct:35},
    {co:'Rivian Financial',val:'$95K',contact:'Sarah C.',days:7,priority:'green',pct:40},
    {co:'Zenith Partners',val:'$210K',contact:'James R.',days:15,priority:'red',pct:30}
  ]},
  {name:'Proposal',color:'var(--cyan)',count:6,value:'$2.4M',deals:[
    {co:'Summit Holdings',val:'$420K',contact:'Sarah C.',days:9,priority:'green',pct:60},
    {co:'Apex Ventures',val:'$310K',contact:'David K.',days:14,priority:'amber',pct:55}
  ]},
  {name:'Negotiation',color:'var(--amber)',count:4,value:'$1.8M',deals:[
    {co:'Vantage Group',val:'$550K',contact:'Priya P.',days:6,priority:'green',pct:80},
    {co:'Pinnacle Corp',val:'$280K',contact:'James R.',days:11,priority:'amber',pct:72}
  ]},
  {name:'Closed Won',color:'var(--green)',count:3,value:'$1.2M',deals:[
    {co:'CoreBridge Inc',val:'$380K',contact:'Sarah C.',days:0,priority:'green',pct:100},
    {co:'Vector Systems',val:'$165K',contact:'David K.',days:0,priority:'green',pct:100}
  ]}
];

const colors={green:'var(--green)',amber:'var(--amber)',red:'var(--red)'};
const avatarColors=['#3B82F6','#10B981','#F59E0B','#8B5CF6'];

document.getElementById('kanban').innerHTML=STAGES.map((s,si)=>\`
  <div class="col stagger" style="animation-delay:\${si*0.08}s">
    <div class="col-head">
      <div class="cname"><span class="cdot" style="background:\${s.color};"></span>\${s.name}<span class="cbadge">\${s.count}</span></div>
      <span class="cval">\${s.value}</span>
    </div>
    <div class="col-body">
      \${s.deals.map((d,di)=>\`
        <div class="deal" style="animation:fadeUp 0.4s var(--ease) \${0.1+di*0.06}s backwards;">
          <div class="deal-top"><span class="deal-company">\${d.co}</span><span class="deal-priority" style="background:\${colors[d.priority]};"></span></div>
          <div class="deal-value">\${d.val}</div>
          <div class="deal-meta">
            <span class="dmavatar" style="background:\${avatarColors[di%4]};">\${d.contact.split(' ').map(w=>w[0]).join('')}</span>
            <span>\${d.contact}</span>
            <span style="margin-left:auto;">\${d.days>0?d.days+'d in stage':'Just closed'}</span>
          </div>
          <div class="deal-bar"><div class="deal-bar-fill" style="width:\${d.pct}%;background:\${s.color};"></div></div>
        </div>
      \`).join('')}
    </div>
  </div>
\`).join('');

// ACTIVITY
const activities=[
  {time:'2m ago',text:'James closed <strong>CoreBridge Inc</strong> ($380K)',color:'#10B981',init:'JR'},
  {time:'15m ago',text:'Sarah moved <strong>Summit Holdings</strong> to Proposal',color:'#3B82F6',init:'SC'},
  {time:'32m ago',text:'David added new deal <strong>Clearpath AI</strong>',color:'#8B5CF6',init:'DK'},
  {time:'1h ago',text:'Priya sent proposal to <strong>Vantage Group</strong>',color:'#F59E0B',init:'PP'},
  {time:'2h ago',text:'James updated <strong>Atlas Industries</strong> value to $180K',color:'#3B82F6',init:'JR'},
  {time:'3h ago',text:'Sarah scheduled demo with <strong>Northpeak Tech</strong>',color:'#10B981',init:'SC'}
];
document.getElementById('activity').innerHTML=activities.map(a=>\`<div class="activity-item"><span class="a-time">\${a.time}</span><div class="a-avatar" style="background:\${a.color};">\${a.init}</div><span>\${a.text}</span></div>\`).join('');

// FORECAST
const fcData=[
  {label:'Prospecting',pct:14,val:'$1.2M',color:'var(--t4)'},
  {label:'Qualification',pct:21,val:'$1.8M',color:'var(--blue)'},
  {label:'Proposal',pct:29,val:'$2.4M',color:'var(--cyan)'},
  {label:'Negotiation',pct:21,val:'$1.8M',color:'var(--amber)'},
  {label:'Closed Won',pct:15,val:'$1.2M',color:'var(--green)'}
];
document.getElementById('forecast').innerHTML=fcData.map(f=>\`<div class="forecast-bar"><span class="fb-label">\${f.label}</span><div class="fb-track"><div class="fb-fill" style="width:\${f.pct}%;background:\${f.color};"></div></div><span class="fb-val">\${f.val}</span></div>\`).join('');`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#030711;--surface:#070D19;--card:#0C1323;--elevated:#111827;--cyan:#22D3EE;--green:#10B981;--purple:#8B5CF6;--amber:#F59E0B;--red:#EF4444;--blue:#3B82F6;--t1:#F1F5F9;--t2:#CBD5E1;--t3:#94A3B8;--t4:#64748B;--border:rgba(30,58,100,0.5);--radius:14px;--ease:cubic-bezier(0.16,1,0.3,1);--font:'DM Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;}
body{font-family:var(--font);background:var(--bg);color:var(--t1);-webkit-font-smoothing:antialiased;min-height:100vh;overflow-x:hidden;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.stagger>*{animation:fadeUp 0.4s var(--ease) backwards;}
.stagger>*:nth-child(1){animation-delay:0.03s}.stagger>*:nth-child(2){animation-delay:0.07s}.stagger>*:nth-child(3){animation-delay:0.11s}.stagger>*:nth-child(4){animation-delay:0.15s}.stagger>*:nth-child(5){animation-delay:0.19s}

/* TOPBAR */
.topbar{padding:0 24px;height:56px;display:flex;align-items:center;gap:16px;background:var(--surface);border-bottom:1px solid var(--border);}
.topbar-logo{display:flex;align-items:center;gap:8px;}
.topbar-logo svg{width:28px;height:28px;}
.topbar-logo span{font-size:15px;font-weight:800;letter-spacing:-0.02em;}
.topbar-sep{width:1px;height:24px;background:var(--border);}
.topbar-title{font-size:14px;font-weight:700;color:var(--t2);}
.topbar-search{margin-left:auto;display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;border:1px solid var(--border);background:var(--elevated);font-size:12px;color:var(--t4);cursor:pointer;transition:border-color 0.2s;}
.topbar-search:hover{border-color:var(--cyan);}
.topbar-search kbd{font-family:var(--mono);font-size:9px;padding:1px 5px;border-radius:3px;background:var(--card);border:1px solid var(--border);}
.btn-add{padding:8px 18px;border-radius:8px;font-size:12px;font-weight:700;border:none;background:linear-gradient(135deg,var(--cyan),var(--purple));color:#fff;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:5px;}.btn-add:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(34,211,238,0.25);}
.avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--blue),var(--purple));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;margin-left:8px;}

/* MAIN */
.main{padding:20px 24px;}

/* KPIs */
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px;}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;position:relative;overflow:hidden;transition:all 0.25s var(--ease);}
.kpi:hover{transform:translateY(-3px);box-shadow:0 8px 30px rgba(0,0,0,0.2);}
.kpi::before{content:'';position:absolute;left:0;top:0;width:3px;height:100%;border-radius:0 3px 3px 0;}
.kpi:nth-child(1)::before{background:var(--cyan);}.kpi:nth-child(2)::before{background:var(--green);}.kpi:nth-child(3)::before{background:var(--amber);}.kpi:nth-child(4)::before{background:var(--purple);}
.kpi .k-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--t4);margin-bottom:6px;}
.kpi .k-value{font-size:28px;font-weight:900;font-family:var(--mono);letter-spacing:-0.02em;}
.kpi .k-change{font-size:11px;font-weight:600;margin-top:4px;}.kpi .k-change.up{color:var(--green);}.kpi .k-change.down{color:var(--red);}
.kpi .spark{display:flex;align-items:flex-end;gap:2px;height:22px;margin-top:8px;}
.kpi .spark i{flex:1;border-radius:1px;min-width:4px;transform-origin:bottom;animation:barGrow 0.5s var(--ease) backwards;}

/* KANBAN */
.kanban{display:flex;gap:14px;overflow-x:auto;padding-bottom:20px;min-height:500px;}
.kanban::-webkit-scrollbar{height:6px;}.kanban::-webkit-scrollbar-track{background:var(--elevated);border-radius:3px;}.kanban::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}
.col{min-width:270px;flex:1;display:flex;flex-direction:column;}
.col-head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:var(--radius) var(--radius) 0 0;background:var(--card);border:1px solid var(--border);border-bottom:none;margin-bottom:0;}
.col-head .cname{font-size:13px;font-weight:700;display:flex;align-items:center;gap:6px;}
.col-head .cname .cdot{width:8px;height:8px;border-radius:50%;}
.col-head .cbadge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:var(--elevated);color:var(--t3);}
.col-head .cval{font-size:11px;font-weight:600;font-family:var(--mono);color:var(--t3);}
.col-body{flex:1;border-radius:0 0 var(--radius) var(--radius);background:var(--surface);border:1px solid var(--border);border-top:none;padding:8px;display:flex;flex-direction:column;gap:8px;min-height:200px;}
.deal{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;cursor:grab;transition:all 0.2s var(--ease);}
.deal:hover{border-color:var(--cyan);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.2);}
.deal-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
.deal-company{font-size:13px;font-weight:700;}
.deal-priority{width:7px;height:7px;border-radius:50%;}
.deal-value{font-size:18px;font-weight:800;font-family:var(--mono);letter-spacing:-0.01em;margin-bottom:6px;color:var(--cyan);}
.deal-meta{display:flex;align-items:center;gap:10px;font-size:10px;color:var(--t4);}
.deal-meta .dmavatar{width:18px;height:18px;border-radius:50%;background:var(--elevated);display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:var(--t2);}
.deal-bar{height:3px;border-radius:2px;background:var(--elevated);margin-top:8px;overflow:hidden;}
.deal-bar-fill{height:100%;border-radius:2px;background:var(--cyan);}

/* BOTTOM */
.bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:22px;}
.panel{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;}
.panel h3{font-size:14px;font-weight:800;margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.panel h3 svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.5;}
.activity-item{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);font-size:12px;color:var(--t2);}
.activity-item:last-child{border:none;}
.activity-item .a-time{font-size:10px;font-family:var(--mono);color:var(--t4);min-width:50px;}
.activity-item .a-avatar{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0;}
.forecast-bar{display:flex;align-items:center;gap:10px;padding:8px 0;}
.forecast-bar .fb-label{font-size:11px;font-weight:600;min-width:90px;color:var(--t3);}
.forecast-bar .fb-track{flex:1;height:12px;background:var(--elevated);border-radius:6px;overflow:hidden;}
.forecast-bar .fb-fill{height:100%;border-radius:6px;transition:width 1s var(--ease);}
.forecast-bar .fb-val{font-size:11px;font-family:var(--mono);font-weight:600;min-width:50px;text-align:right;color:var(--t2);}

@media(max-width:900px){.kpis{grid-template-columns:repeat(2,1fr);}.bottom-grid{grid-template-columns:1fr;}.kanban{flex-direction:column;}.col{min-width:100%;}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<div class="topbar">
  <div class="topbar-logo"><svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#22D3EE"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><span>FinanceOS</span></div>
  <div class="topbar-sep"></div>
  <span class="topbar-title">Sales Pipeline</span>
  <div class="topbar-search"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> Search deals... <kbd>Cmd+K</kbd></div>
  <button class="btn-add"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Deal</button>
  <div class="avatar">MF</div>
</div>

<div class="main">
  <!-- KPIs -->
  <div class="kpis stagger">
    <div class="kpi"><div class="k-label">Pipeline Value</div><div class="k-value">$8.4M</div><div class="k-change up">+12% this month</div><div class="spark"><i style="height:35%;background:var(--cyan);opacity:0.7;animation-delay:0s"></i><i style="height:42%;background:var(--cyan);opacity:0.7;animation-delay:0.03s"></i><i style="height:50%;background:var(--cyan);opacity:0.7;animation-delay:0.06s"></i><i style="height:32%;background:var(--cyan);opacity:0.7;animation-delay:0.09s"></i><i style="height:55%;background:var(--cyan);opacity:0.7;animation-delay:0.12s"></i><i style="height:38%;background:var(--cyan);opacity:0.7;animation-delay:0.15s"></i><i style="height:45%;background:var(--cyan);opacity:0.7;animation-delay:0.18s"></i><i style="height:60%;background:var(--cyan);opacity:0.7;animation-delay:0.21s"></i><i style="height:52%;background:var(--cyan);opacity:0.7;animation-delay:0.24s"></i><i style="height:48%;background:var(--cyan);opacity:0.7;animation-delay:0.27s"></i><i style="height:58%;background:var(--cyan);opacity:0.7;animation-delay:0.3s"></i><i style="height:65%;background:var(--cyan);opacity:0.7;animation-delay:0.33s"></i></div></div>
    <div class="kpi"><div class="k-label">Active Deals</div><div class="k-value">47</div><div class="k-change up">+5 this week</div><div class="spark"><i style="height:20%;background:var(--green);opacity:0.7;animation-delay:0s"></i><i style="height:35%;background:var(--green);opacity:0.7;animation-delay:0.03s"></i><i style="height:28%;background:var(--green);opacity:0.7;animation-delay:0.06s"></i><i style="height:42%;background:var(--green);opacity:0.7;animation-delay:0.09s"></i><i style="height:38%;background:var(--green);opacity:0.7;animation-delay:0.12s"></i><i style="height:45%;background:var(--green);opacity:0.7;animation-delay:0.15s"></i><i style="height:52%;background:var(--green);opacity:0.7;animation-delay:0.18s"></i><i style="height:40%;background:var(--green);opacity:0.7;animation-delay:0.21s"></i><i style="height:48%;background:var(--green);opacity:0.7;animation-delay:0.24s"></i><i style="height:55%;background:var(--green);opacity:0.7;animation-delay:0.27s"></i><i style="height:50%;background:var(--green);opacity:0.7;animation-delay:0.3s"></i><i style="height:60%;background:var(--green);opacity:0.7;animation-delay:0.33s"></i></div></div>
    <div class="kpi"><div class="k-label">Avg Deal Size</div><div class="k-value">$24.6K</div><div class="k-change up">+8% QoQ</div><div class="spark"><i style="height:40%;background:var(--amber);opacity:0.7;animation-delay:0s"></i><i style="height:38%;background:var(--amber);opacity:0.7;animation-delay:0.03s"></i><i style="height:45%;background:var(--amber);opacity:0.7;animation-delay:0.06s"></i><i style="height:42%;background:var(--amber);opacity:0.7;animation-delay:0.09s"></i><i style="height:50%;background:var(--amber);opacity:0.7;animation-delay:0.12s"></i><i style="height:48%;background:var(--amber);opacity:0.7;animation-delay:0.15s"></i><i style="height:52%;background:var(--amber);opacity:0.7;animation-delay:0.18s"></i><i style="height:55%;background:var(--amber);opacity:0.7;animation-delay:0.21s"></i><i style="height:58%;background:var(--amber);opacity:0.7;animation-delay:0.24s"></i><i style="height:60%;background:var(--amber);opacity:0.7;animation-delay:0.27s"></i><i style="height:62%;background:var(--amber);opacity:0.7;animation-delay:0.3s"></i><i style="height:65%;background:var(--amber);opacity:0.7;animation-delay:0.33s"></i></div></div>
    <div class="kpi"><div class="k-label">Win Rate</div><div class="k-value">34%</div><div class="k-change up">+2pp MoM</div><div class="spark"><i style="height:25%;background:var(--purple);opacity:0.7;animation-delay:0s"></i><i style="height:30%;background:var(--purple);opacity:0.7;animation-delay:0.03s"></i><i style="height:28%;background:var(--purple);opacity:0.7;animation-delay:0.06s"></i><i style="height:32%;background:var(--purple);opacity:0.7;animation-delay:0.09s"></i><i style="height:35%;background:var(--purple);opacity:0.7;animation-delay:0.12s"></i><i style="height:30%;background:var(--purple);opacity:0.7;animation-delay:0.15s"></i><i style="height:33%;background:var(--purple);opacity:0.7;animation-delay:0.18s"></i><i style="height:38%;background:var(--purple);opacity:0.7;animation-delay:0.21s"></i><i style="height:36%;background:var(--purple);opacity:0.7;animation-delay:0.24s"></i><i style="height:40%;background:var(--purple);opacity:0.7;animation-delay:0.27s"></i><i style="height:42%;background:var(--purple);opacity:0.7;animation-delay:0.3s"></i><i style="height:45%;background:var(--purple);opacity:0.7;animation-delay:0.33s"></i></div></div>
  </div>

  <!-- KANBAN -->
  <div class="kanban" id="kanban"></div>

  <!-- BOTTOM -->
  <div class="bottom-grid">
    <div class="panel"><h3><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Recent Activity</h3><div id="activity"></div></div>
    <div class="panel"><h3><svg viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> Pipeline Forecast</h3><div id="forecast"></div></div>
  </div>
</div>


` }} />
    </>
  );
}
