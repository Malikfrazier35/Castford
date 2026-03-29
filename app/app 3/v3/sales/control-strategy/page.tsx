'use client';

import { useEffect, useRef } from 'react';

export default function V3SalesControlStrategyPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Tab switching
function showTab(id){
document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
document.getElementById('tab-'+id).classList.add('active');
const tabs=document.querySelectorAll('.tab');
const map={overview:0,org:1,pipeline:2,comp:3,ops:4,metrics:5};
if(map[id]!==undefined) tabs[map[id]].classList.add('active');
}

// SVG Chart: Monthly Revenue by Layer
(function(){
const c=document.getElementById('revenueChart');
if(!c) return;
const months=['Oct','Nov','Dec','Jan','Feb','Mar'];
const saas=[140,155,168,175,180,190];
const services=[60,72,85,95,110,128];
const managed=[20,28,35,42,50,62];
const max=400;
const w=500,h=220,px=50,py=20;
const cw=w-px-20,ch=h-py-30;
let svg=\`<svg viewBox="0 0 \${w} \${h}" style="width:100%;height:auto">\`;
// Grid
for(let i=0;i<=4;i++){
const y=py+ch*(i/4);
const v=max-max*(i/4);
svg+=\`<line x1="\${px}" y1="\${y}" x2="\${w-20}" y2="\${y}" stroke="rgba(255,255,255,.06)" stroke-width="1"/>\`;
svg+=\`<text x="\${px-8}" y="\${y+4}" text-anchor="end" fill="#8892a8" font-size="10">$\${v}K</text>\`;
}
// Stacked bars
const bw=cw/months.length*.6;
const gap=cw/months.length;
months.forEach((m,i)=>{
const x=px+i*gap+gap*.2;
const s=saas[i],sv=services[i],mv=managed[i];
const sh=s/max*ch,svh=sv/max*ch,mvh=mv/max*ch;
const base=py+ch;
svg+=\`<rect x="\${x}" y="\${base-sh-svh-mvh}" width="\${bw}" height="\${mvh}" rx="2" fill="var(--green)" opacity=".8"/>\`;
svg+=\`<rect x="\${x}" y="\${base-sh-svh}" width="\${bw}" height="\${svh}" rx="0" fill="var(--purple)" opacity=".8"/>\`;
svg+=\`<rect x="\${x}" y="\${base-sh}" width="\${bw}" height="\${sh}" rx="0" fill="var(--accent)" opacity=".8"/>\`;
svg+=\`<text x="\${x+bw/2}" y="\${base+14}" text-anchor="middle" fill="#8892a8" font-size="10">\${m}</text>\`;
});
// Legend
svg+=\`<rect x="\${px}" y="\${h-8}" width="10" height="10" rx="2" fill="var(--accent)"/>\`;
svg+=\`<text x="\${px+14}" y="\${h}" fill="#8892a8" font-size="10">SaaS</text>\`;
svg+=\`<rect x="\${px+60}" y="\${h-8}" width="10" height="10" rx="2" fill="var(--purple)"/>\`;
svg+=\`<text x="\${px+74}" y="\${h}" fill="#8892a8" font-size="10">Services</text>\`;
svg+=\`<rect x="\${px+140}" y="\${h-8}" width="10" height="10" rx="2" fill="var(--green)"/>\`;
svg+=\`<text x="\${px+154}" y="\${h}" fill="#8892a8" font-size="10">Managed</text>\`;
svg+=\`</svg>\`;
c.innerHTML=svg;
})();

// SVG Chart: Pipeline Velocity
(function(){
const c=document.getElementById('velocityChart');
if(!c) return;
const stages=['Identified','SOW Draft','Review','Signed','Deploying'];
const counts=[18,12,8,5,3];
const values=[920,680,440,280,180];
const maxC=20;
const w=500,h=220,px=10,py=10;
const rh=30,gap=8;
let svg=\`<svg viewBox="0 0 \${w} \${h}" style="width:100%;height:auto">\`;
const colors=['var(--accent)','var(--purple)','var(--amber)','var(--green)','var(--pink)'];
stages.forEach((s,i)=>{
const y=py+i*(rh+gap);
const bw=(counts[i]/maxC)*(w-140);
svg+=\`<rect x="100" y="\${y}" width="\${bw}" height="\${rh}" rx="6" fill="\${colors[i]}" opacity=".7"/>\`;
svg+=\`<text x="96" y="\${y+rh/2+4}" text-anchor="end" fill="#e2e8f0" font-size="11">\${s}</text>\`;
svg+=\`<text x="\${104+bw}" y="\${y+rh/2+4}" fill="#e2e8f0" font-size="12" font-weight="600">\${counts[i]}</text>\`;
svg+=\`<text x="\${150+bw}" y="\${y+rh/2+4}" fill="#8892a8" font-size="10">($\${values[i]}K)</text>\`;
});
svg+=\`</svg>\`;
c.innerHTML=svg;
})();

// Gauge SVGs
function drawGauge(id,pct,color){
const c=document.getElementById(id);
if(!c) return;
const r=40,stroke=8;
const circ=2*Math.PI*r;
const dash=circ*pct;
c.innerHTML=\`<svg viewBox="0 0 100 60" style="width:120px;height:auto">
<path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="\${stroke}" stroke-linecap="round"/>
<path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="\${color}" stroke-width="\${stroke}" stroke-linecap="round" stroke-dasharray="\${circ}" stroke-dashoffset="\${circ-dash*.5}" style="transition:stroke-dashoffset 1s ease"/>
</svg>\`;
}
drawGauge('npsGauge',.72,'var(--green)');
drawGauge('csatGauge',.90,'var(--green)');
drawGauge('otdGauge',.89,'var(--green)');

// Skill mix donut
(function(){
const c=document.getElementById('skillMixChart');
if(!c) return;
const data=[{pct:35,color:'var(--accent)'},{pct:22,color:'var(--purple)'},{pct:20,color:'var(--green)'},{pct:15,color:'var(--amber)'},{pct:8,color:'var(--pink)'}];
const r=60,sw=16,cx=80,cy=80;
const circ=2*Math.PI*r;
let offset=0;
let svg=\`<svg viewBox="0 0 160 160" style="width:160px;height:auto;display:block;margin:0 auto">\`;
data.forEach(d=>{
const dash=circ*(d.pct/100);
svg+=\`<circle cx="\${cx}" cy="\${cy}" r="\${r}" fill="none" stroke="\${d.color}" stroke-width="\${sw}" stroke-dasharray="\${dash} \${circ-dash}" stroke-dashoffset="\${-offset}" transform="rotate(-90 \${cx} \${cy})" opacity=".85"/>\`;
offset+=dash;
});
svg+=\`<text x="\${cx}" y="\${cy-4}" text-anchor="middle" fill="var(--text)" font-size="20" font-weight="700">127</text>\`;
svg+=\`<text x="\${cx}" y="\${cy+12}" text-anchor="middle" fill="var(--dim)" font-size="10">contractors</text>\`;
svg+=\`</svg>\`;
c.innerHTML=svg;
})();`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*{margin:0;padding:0;box-sizing:border-box}
:root{
--bg:#0b0e14;--surface:#111520;--card:#161b28;--card2:#1a2033;
--border:#1e2540;--text:#e2e8f0;--dim:#8892a8;--accent:#5b9cf5;
--green:#34d399;--red:#f87171;--amber:#fbbf24;--purple:#a78bfa;
--pink:#f472b6;--cyan:#22d3ee;
--radius:12px;--shadow:0 4px 24px rgba(0,0,0,.4);
}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden}
.container{max-width:1400px;margin:0 auto;padding:24px}

/* Header */
.header{display:flex;align-items:center;justify-content:space-between;padding:20px 0;border-bottom:1px solid var(--border);margin-bottom:32px;flex-wrap:wrap;gap:16px}
.header h1{font-size:28px;font-weight:700;background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.header .subtitle{color:var(--dim);font-size:14px;margin-top:4px}
.badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600}
.badge-blue{background:rgba(91,156,245,.15);color:var(--accent)}
.badge-green{background:rgba(52,211,153,.15);color:var(--green)}
.badge-purple{background:rgba(167,139,250,.15);color:var(--purple)}
.badge-amber{background:rgba(251,191,36,.15);color:var(--amber)}
.badge-red{background:rgba(248,113,113,.15);color:var(--red)}
.badge-pink{background:rgba(244,114,182,.15);color:var(--pink)}

/* Tabs */
.tabs{display:flex;gap:4px;margin-bottom:28px;border-bottom:1px solid var(--border);padding-bottom:0;overflow-x:auto}
.tab{padding:12px 20px;cursor:pointer;font-size:14px;font-weight:500;color:var(--dim);border-bottom:2px solid transparent;transition:.2s;white-space:nowrap}
.tab:hover{color:var(--text)}
.tab.active{color:var(--accent);border-bottom-color:var(--accent)}

/* Cards */
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow)}
.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:8px}
.card-header h2{font-size:18px;font-weight:600}
.card-header h3{font-size:16px;font-weight:600}

/* Grid layouts */
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}

/* KPI cards */
.kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px}
.kpi .label{font-size:12px;color:var(--dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.kpi .value{font-size:28px;font-weight:700}
.kpi .change{font-size:13px;margin-top:6px}
.kpi .change.up{color:var(--green)}
.kpi .change.down{color:var(--red)}

/* Tables */
.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:left;padding:12px 16px;color:var(--dim);font-weight:500;font-size:12px;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border)}
td{padding:12px 16px;border-bottom:1px solid rgba(30,37,64,.5)}
tr:hover td{background:rgba(91,156,245,.03)}

/* Progress bars */
.progress-bar{height:6px;background:rgba(255,255,255,.08);border-radius:3px;overflow:hidden;width:100%}
.progress-fill{height:100%;border-radius:3px;transition:width .6s ease}

/* Pipeline stage */
.pipeline{display:flex;gap:2px;margin:24px 0}
.pipeline-stage{flex:1;text-align:center;padding:16px 8px;position:relative;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,0 100%,12px 50%)}
.pipeline-stage:first-child{clip-path:polygon(0 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,0 100%)}
.pipeline-stage .stage-name{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.pipeline-stage .stage-count{font-size:22px;font-weight:700;margin-top:4px}
.pipeline-stage .stage-value{font-size:12px;margin-top:2px;opacity:.8}

/* Section title */
.section-title{font-size:22px;font-weight:700;margin:40px 0 20px;padding-bottom:12px;border-bottom:1px solid var(--border)}
.section-title:first-of-type{margin-top:0}

/* Org chart nodes */
.org-node{background:var(--card2);border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center;position:relative}
.org-node.head{border-color:var(--accent);background:linear-gradient(135deg,rgba(91,156,245,.1),rgba(167,139,250,.1))}
.org-node .name{font-weight:600;font-size:15px}
.org-node .role{font-size:12px;color:var(--dim);margin-top:4px}
.org-node .metric{font-size:13px;color:var(--accent);margin-top:8px;font-weight:500}
.org-line{width:2px;height:24px;background:var(--border);margin:0 auto}
.org-row{display:flex;gap:16px;justify-content:center}

/* Flow steps */
.flow{display:flex;align-items:stretch;gap:0;margin:20px 0}
.flow-step{flex:1;padding:20px 16px;background:var(--card2);border:1px solid var(--border);position:relative;text-align:center}
.flow-step:first-child{border-radius:var(--radius) 0 0 var(--radius)}
.flow-step:last-child{border-radius:0 var(--radius) var(--radius) 0}
.flow-step .step-num{width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;margin-bottom:8px}
.flow-step .step-title{font-size:13px;font-weight:600}
.flow-step .step-desc{font-size:11px;color:var(--dim);margin-top:6px;line-height:1.5}
.flow-arrow{position:absolute;right:-10px;top:50%;transform:translateY(-50%);z-index:2;color:var(--accent);font-size:18px}

/* Commission table highlight */
.highlight-row td{background:rgba(91,156,245,.06)}

/* Tabs content */
.tab-content{display:none}
.tab-content.active{display:block}

/* Scrollbar */
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

/* Responsive */
@media(max-width:1024px){
.grid-4{grid-template-columns:repeat(2,1fr)}
.grid-3{grid-template-columns:repeat(2,1fr)}
.pipeline{flex-wrap:wrap}
.pipeline-stage{flex:none;width:calc(33% - 2px);clip-path:none;border-radius:8px}
.flow{flex-direction:column}
.flow-step{border-radius:var(--radius) !important}
.flow-arrow{display:none}
.org-row{flex-wrap:wrap}
}
@media(max-width:768px){
.container{padding:16px}
.header h1{font-size:22px}
.grid-2,.grid-3,.grid-4{grid-template-columns:1fr}
.pipeline-stage{width:100%}
.tabs{gap:0}
.tab{padding:10px 14px;font-size:13px}
.kpi .value{font-size:22px}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<div class="container">

<div class="header">
<div>
<h1>FinanceOS — Sales Control Strategy</h1>
<div class="subtitle">How Sales Owns the Independent Workforce & Project Pipeline</div>
</div>
<div style="display:flex;gap:8px;flex-wrap:wrap">
<span class="badge badge-blue">Q2 2026 Plan</span>
<span class="badge badge-green">Rev Target: $4.2M ARR</span>
</div>
</div>

<!-- Tabs -->
<div class="tabs" id="mainTabs">
<div class="tab active" onclick="showTab('overview')">Command Overview</div>
<div class="tab" onclick="showTab('org')">Sales Org Structure</div>
<div class="tab" onclick="showTab('pipeline')">Workforce Pipeline</div>
<div class="tab" onclick="showTab('comp')">Compensation & Incentives</div>
<div class="tab" onclick="showTab('ops')">Operational Playbook</div>
<div class="tab" onclick="showTab('metrics')">Control Metrics</div>
</div>

<!-- TAB: Command Overview -->
<div class="tab-content active" id="tab-overview">

<!-- KPIs -->
<div class="grid-4" style="margin-bottom:28px">
<div class="kpi">
<div class="label">Active Contractors</div>
<div class="value" style="color:var(--accent)">127</div>
<div class="change up">+34 this quarter</div>
</div>
<div class="kpi">
<div class="label">Projects In-Flight</div>
<div class="value" style="color:var(--purple)">43</div>
<div class="change up">89% on-time delivery</div>
</div>
<div class="kpi">
<div class="label">Contractor Revenue</div>
<div class="value" style="color:var(--green)">$1.8M</div>
<div class="change up">+62% vs last Q</div>
</div>
<div class="kpi">
<div class="label">Avg Deal Margin</div>
<div class="value" style="color:var(--amber)">68%</div>
<div class="change up">+4pp vs target</div>
</div>
</div>

<!-- Sales Control Model -->
<div class="card" style="margin-bottom:24px">
<div class="card-header">
<h2>Sales Control Model — Three Revenue Layers</h2>
</div>
<p style="color:var(--dim);font-size:14px;margin-bottom:20px">Sales owns every revenue-generating relationship. The workforce is a fulfillment engine that Sales controls through project scoping, contractor matching, and margin management.</p>

<div class="grid-3">
<div style="background:linear-gradient(135deg,rgba(91,156,245,.1),rgba(91,156,245,.02));border:1px solid rgba(91,156,245,.3);border-radius:var(--radius);padding:20px">
<div style="font-size:13px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Layer 1 — Platform SaaS</div>
<div style="font-size:24px;font-weight:700;margin-bottom:4px">$2.1M ARR</div>
<div style="font-size:13px;color:var(--dim);margin-bottom:12px">Core FinanceOS subscriptions</div>
<div style="font-size:13px;line-height:1.8">
<div>AE-owned pipeline</div>
<div>Self-serve + PLG motion</div>
<div>Expansion via usage triggers</div>
</div>
<div style="margin-top:12px"><span class="badge badge-blue">Sales Controlled</span></div>
</div>

<div style="background:linear-gradient(135deg,rgba(167,139,250,.1),rgba(167,139,250,.02));border:1px solid rgba(167,139,250,.3);border-radius:var(--radius);padding:20px">
<div style="font-size:13px;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Layer 2 — Services Attach</div>
<div style="font-size:24px;font-weight:700;margin-bottom:4px">$1.4M ARR</div>
<div style="font-size:13px;color:var(--dim);margin-bottom:12px">Implementation + consulting</div>
<div style="font-size:13px;line-height:1.8">
<div>Independent contractor delivery</div>
<div>Sales scopes SOW + pricing</div>
<div>CSM manages ongoing relationship</div>
</div>
<div style="margin-top:12px"><span class="badge badge-purple">Sales + CSM Controlled</span></div>
</div>

<div style="background:linear-gradient(135deg,rgba(52,211,153,.1),rgba(52,211,153,.02));border:1px solid rgba(52,211,153,.3);border-radius:var(--radius);padding:20px">
<div style="font-size:13px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Layer 3 — Managed FP&A</div>
<div style="font-size:24px;font-weight:700;margin-bottom:4px">$700K ARR</div>
<div style="font-size:13px;color:var(--dim);margin-bottom:12px">Outsourced FP&A on FinanceOS</div>
<div style="font-size:13px;line-height:1.8">
<div>Dedicated contractor teams</div>
<div>Recurring monthly retainers</div>
<div>Sales owns pricing & renewals</div>
</div>
<div style="margin-top:12px"><span class="badge badge-green">Sales + Ops Controlled</span></div>
</div>
</div>
</div>

<!-- How Sales Controls Each Phase -->
<div class="card">
<div class="card-header"><h2>Sales Control Flow — Opportunity to Delivery</h2></div>
<div class="flow">
<div class="flow-step">
<div class="step-num" style="background:rgba(91,156,245,.2);color:var(--accent)">1</div>
<div class="step-title">AE Qualifies Opp</div>
<div class="step-desc">AE identifies service need during SaaS deal. Flags "Services Attach" in CRM. Scopes preliminary SOW.</div>
<span class="flow-arrow">→</span>
</div>
<div class="flow-step">
<div class="step-num" style="background:rgba(167,139,250,.2);color:var(--purple)">2</div>
<div class="step-title">Sales Eng Sizes It</div>
<div class="step-desc">SE evaluates complexity, estimates hours, selects required skill profile from contractor bench.</div>
<span class="flow-arrow">→</span>
</div>
<div class="flow-step">
<div class="step-num" style="background:rgba(251,191,36,.2);color:var(--amber)">3</div>
<div class="step-title">Sales Sets Price</div>
<div class="step-desc">AE sets client rate (2.5–3.5x contractor cost). Margin floor: 55%. Deal desk approves &gt;$50K.</div>
<span class="flow-arrow">→</span>
</div>
<div class="flow-step">
<div class="step-num" style="background:rgba(52,211,153,.2);color:var(--green)">4</div>
<div class="step-title">Ops Deploys Team</div>
<div class="step-desc">Workforce Ops matches contractor(s) from bench. SLA: deploy within 5 business days of signed SOW.</div>
<span class="flow-arrow">→</span>
</div>
<div class="flow-step">
<div class="step-num" style="background:rgba(244,114,182,.2);color:var(--pink)">5</div>
<div class="step-title">CSM Owns Success</div>
<div class="step-desc">CSM runs QBRs, tracks CSAT, identifies expansion. Feeds upsell signals back to AE for renewal.</div>
</div>
</div>
</div>
</div>

<!-- TAB: Org Structure -->
<div class="tab-content" id="tab-org">
<div class="section-title">Sales Organization — Who Controls What</div>

<!-- VP Sales at top -->
<div style="max-width:800px;margin:0 auto 32px">
<div class="org-node head">
<div class="name">VP of Sales</div>
<div class="role">Owns all revenue — SaaS + Services + Managed FP&A</div>
<div class="metric">Total Target: $4.2M ARR</div>
</div>
<div class="org-line"></div>
</div>

<div class="grid-3" style="margin-bottom:32px">
<div>
<div class="org-node" style="border-left:3px solid var(--accent)">
<div class="name">Director, New Business</div>
<div class="role">SaaS + Services land deals</div>
<div class="metric">Target: $2.4M new ARR</div>
</div>
<div class="org-line"></div>
<div class="grid-2" style="gap:8px">
<div class="org-node">
<div class="name" style="font-size:13px">AE — Enterprise</div>
<div class="role">×3 reps</div>
<div class="metric">$600K/rep</div>
</div>
<div class="org-node">
<div class="name" style="font-size:13px">AE — Mid-Market</div>
<div class="role">×4 reps</div>
<div class="metric">$350K/rep</div>
</div>
</div>
</div>

<div>
<div class="org-node" style="border-left:3px solid var(--green)">
<div class="name">Director, Customer Success</div>
<div class="role">Expansion + retention + managed FP&A</div>
<div class="metric">Target: $1.4M expansion</div>
</div>
<div class="org-line"></div>
<div class="grid-2" style="gap:8px">
<div class="org-node">
<div class="name" style="font-size:13px">CSM — Enterprise</div>
<div class="role">×2 managers</div>
<div class="metric">$500K portfolio</div>
</div>
<div class="org-node">
<div class="name" style="font-size:13px">CSM — Mid-Market</div>
<div class="role">×3 managers</div>
<div class="metric">$300K portfolio</div>
</div>
</div>
</div>

<div>
<div class="org-node" style="border-left:3px solid var(--purple)">
<div class="name">Director, Workforce Ops</div>
<div class="role">Contractor sourcing, bench, deployment, QA</div>
<div class="metric">127 active contractors</div>
</div>
<div class="org-line"></div>
<div class="grid-2" style="gap:8px">
<div class="org-node">
<div class="name" style="font-size:13px">Sourcing Lead</div>
<div class="role">Recruits + vets contractors</div>
<div class="metric">Pipeline: 340</div>
</div>
<div class="org-node">
<div class="name" style="font-size:13px">Delivery Manager</div>
<div class="role">Project QA + client delivery</div>
<div class="metric">43 projects</div>
</div>
</div>
</div>
</div>

<!-- Key: Sales controls pricing, Ops controls fulfillment -->
<div class="card">
<div class="card-header"><h2>Control Matrix — Who Owns What Decision</h2></div>
<div class="table-wrap">
<table>
<thead>
<tr><th>Decision</th><th>Owner</th><th>Approver</th><th>Informed</th></tr>
</thead>
<tbody>
<tr><td>Client pricing / SOW terms</td><td><span class="badge badge-blue">AE</span></td><td><span class="badge badge-amber">Deal Desk</span></td><td>Workforce Ops</td></tr>
<tr><td>Contractor hourly rate</td><td><span class="badge badge-purple">Workforce Ops</span></td><td><span class="badge badge-blue">VP Sales</span></td><td>AE, Finance</td></tr>
<tr><td>Contractor selection for project</td><td><span class="badge badge-purple">Workforce Ops</span></td><td><span class="badge badge-green">Delivery Mgr</span></td><td>AE, CSM</td></tr>
<tr><td>Project scope changes</td><td><span class="badge badge-blue">AE</span></td><td><span class="badge badge-green">CSM</span></td><td>Workforce Ops</td></tr>
<tr><td>Contractor performance issues</td><td><span class="badge badge-purple">Delivery Mgr</span></td><td><span class="badge badge-purple">Workforce Ops Dir</span></td><td>CSM, AE</td></tr>
<tr><td>Renewal / expansion pricing</td><td><span class="badge badge-green">CSM</span></td><td><span class="badge badge-blue">Dir New Biz</span></td><td>AE, Finance</td></tr>
<tr><td>New contractor onboarding</td><td><span class="badge badge-purple">Sourcing Lead</span></td><td><span class="badge badge-purple">Workforce Ops Dir</span></td><td>Delivery Mgr</td></tr>
<tr><td>Partner channel deals</td><td><span class="badge badge-blue">AE</span></td><td><span class="badge badge-blue">VP Sales</span></td><td>All</td></tr>
</tbody>
</table>
</div>
</div>
</div>

<!-- TAB: Workforce Pipeline -->
<div class="tab-content" id="tab-pipeline">
<div class="section-title">Contractor Pipeline — Sales-Controlled Funnel</div>

<!-- Pipeline visualization -->
<div class="pipeline">
<div class="pipeline-stage" style="background:linear-gradient(135deg,rgba(91,156,245,.25),rgba(91,156,245,.1))">
<div class="stage-name" style="color:var(--accent)">Sourced</div>
<div class="stage-count">340</div>
<div class="stage-value">From 6 channels</div>
</div>
<div class="pipeline-stage" style="background:linear-gradient(135deg,rgba(167,139,250,.25),rgba(167,139,250,.1))">
<div class="stage-name" style="color:var(--purple)">Screened</div>
<div class="stage-count">198</div>
<div class="stage-value">58% pass rate</div>
</div>
<div class="pipeline-stage" style="background:linear-gradient(135deg,rgba(251,191,36,.25),rgba(251,191,36,.1))">
<div class="stage-name" style="color:var(--amber)">Bench Ready</div>
<div class="stage-count">127</div>
<div class="stage-value">Vetted & available</div>
</div>
<div class="pipeline-stage" style="background:linear-gradient(135deg,rgba(52,211,153,.25),rgba(52,211,153,.1))">
<div class="stage-name" style="color:var(--green)">Deployed</div>
<div class="stage-count">84</div>
<div class="stage-value">On active projects</div>
</div>
<div class="pipeline-stage" style="background:linear-gradient(135deg,rgba(244,114,182,.25),rgba(244,114,182,.1))">
<div class="stage-name" style="color:var(--pink)">Top Performers</div>
<div class="stage-count">31</div>
<div class="stage-value">Preferred tier</div>
</div>
</div>

<!-- Sourcing channels -->
<div class="grid-2" style="margin-top:24px">
<div class="card">
<div class="card-header"><h3>Sourcing Channels — Sales Priorities</h3></div>
<div class="table-wrap">
<table>
<thead><tr><th>Channel</th><th>Contractors</th><th>Avg Rate</th><th>Quality</th><th>Sales Priority</th></tr></thead>
<tbody>
<tr>
<td><strong>Toptal</strong></td><td>52</td><td>$85/hr</td>
<td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:92%;background:var(--green)"></div></div></td>
<td><span class="badge badge-green">Primary</span></td>
</tr>
<tr>
<td><strong>Arc.dev</strong></td><td>38</td><td>$65/hr</td>
<td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:84%;background:var(--green)"></div></div></td>
<td><span class="badge badge-green">Primary</span></td>
</tr>
<tr>
<td><strong>Catalant</strong></td><td>24</td><td>$120/hr</td>
<td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:95%;background:var(--accent)"></div></div></td>
<td><span class="badge badge-blue">Strategic</span></td>
</tr>
<tr>
<td><strong>Referral Network</strong></td><td>18</td><td>$90/hr</td>
<td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:88%;background:var(--green)"></div></div></td>
<td><span class="badge badge-purple">Growing</span></td>
</tr>
<tr>
<td><strong>LinkedIn Recruiter</strong></td><td>12</td><td>$75/hr</td>
<td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:72%;background:var(--amber)"></div></div></td>
<td><span class="badge badge-amber">Developing</span></td>
</tr>
<tr>
<td><strong>PartnerStack</strong></td><td>8</td><td>$55/hr</td>
<td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:68%;background:var(--amber)"></div></div></td>
<td><span class="badge badge-amber">Developing</span></td>
</tr>
</tbody>
</table>
</div>
</div>

<div class="card">
<div class="card-header"><h3>Contractor Skill Mix — Demand Driven by Sales</h3></div>
<div id="skillMixChart"></div>
<div style="margin-top:16px;font-size:13px;color:var(--dim)">
<p style="margin-bottom:12px">Sales controls the skill mix by signaling demand patterns to Workforce Ops. When AEs identify recurring client needs, Ops adjusts sourcing priorities.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">
<div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:2px;background:var(--accent)"></div> FP&A Analysts — 35%</div>
<div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:2px;background:var(--purple)"></div> Data Engineers — 22%</div>
<div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:2px;background:var(--green)"></div> Implementation — 20%</div>
<div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:2px;background:var(--amber)"></div> EPM Specialists — 15%</div>
<div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:2px;background:var(--pink)"></div> Advisory / Fractional — 8%</div>
</div>
</div>
</div>
</div>

<!-- Active Project Roster -->
<div class="card" style="margin-top:24px">
<div class="card-header"><h2>Active Projects — Sales-Owned Engagements</h2></div>
<div class="table-wrap">
<table>
<thead><tr><th>Client</th><th>Project</th><th>AE Owner</th><th>Contractors</th><th>Monthly Rev</th><th>Margin</th><th>Status</th><th>Renewal</th></tr></thead>
<tbody>
<tr>
<td><strong>Acme Corp</strong></td><td>FP&A Transformation</td><td>J. Torres</td><td>4</td>
<td style="color:var(--green)">$48K</td><td>72%</td>
<td><span class="badge badge-green">On Track</span></td><td>Jun '26</td>
</tr>
<tr>
<td><strong>Vertex Inc</strong></td><td>Data Pipeline Build</td><td>M. Singh</td><td>3</td>
<td style="color:var(--green)">$36K</td><td>68%</td>
<td><span class="badge badge-green">On Track</span></td><td>Aug '26</td>
</tr>
<tr>
<td><strong>NovaTech</strong></td><td>Managed Close Process</td><td>R. Okonkwo</td><td>2</td>
<td style="color:var(--green)">$22K</td><td>74%</td>
<td><span class="badge badge-green">On Track</span></td><td>Apr '26</td>
</tr>
<tr>
<td><strong>BlueStar Health</strong></td><td>EPM Implementation</td><td>J. Torres</td><td>5</td>
<td style="color:var(--green)">$62K</td><td>65%</td>
<td><span class="badge badge-amber">At Risk</span></td><td>Jul '26</td>
</tr>
<tr>
<td><strong>Meridian Partners</strong></td><td>Board Reporting</td><td>L. Chen</td><td>1</td>
<td style="color:var(--green)">$15K</td><td>78%</td>
<td><span class="badge badge-green">On Track</span></td><td>May '26</td>
</tr>
<tr>
<td><strong>Summit Financial</strong></td><td>Fractional CFO</td><td>M. Singh</td><td>1</td>
<td style="color:var(--green)">$28K</td><td>58%</td>
<td><span class="badge badge-blue">New</span></td><td>Sep '26</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<!-- TAB: Compensation -->
<div class="tab-content" id="tab-comp">
<div class="section-title">Compensation & Incentives — Aligning Sales to Workforce Revenue</div>

<div class="grid-2" style="margin-bottom:24px">
<div class="card">
<div class="card-header"><h3>AE Compensation — Blended Model</h3></div>
<p style="font-size:13px;color:var(--dim);margin-bottom:16px">AEs earn on both SaaS and Services attach. The services kicker incentivizes bundling contractor engagements with platform deals.</p>
<div class="table-wrap">
<table>
<thead><tr><th>Component</th><th>Enterprise AE</th><th>Mid-Market AE</th></tr></thead>
<tbody>
<tr><td>Base Salary</td><td>$130K</td><td>$95K</td></tr>
<tr><td>SaaS Commission (% ACV)</td><td>12%</td><td>10%</td></tr>
<tr class="highlight-row"><td><strong>Services Attach Bonus</strong></td><td><strong>8% of SOW</strong></td><td><strong>6% of SOW</strong></td></tr>
<tr><td>Managed FP&A Recurring</td><td>5% monthly</td><td>4% monthly</td></tr>
<tr><td>Multi-Year Accelerator</td><td>1.3x on 2yr+</td><td>1.2x on 2yr+</td></tr>
<tr style="border-top:2px solid var(--border)"><td><strong>Target OTE</strong></td><td style="color:var(--green);font-weight:700">$285K</td><td style="color:var(--green);font-weight:700">$195K</td></tr>
</tbody>
</table>
</div>
</div>

<div class="card">
<div class="card-header"><h3>CSM Compensation — Retention + Expansion</h3></div>
<p style="font-size:13px;color:var(--dim);margin-bottom:16px">CSMs are compensated on net retention and services expansion. They're the ones who identify when a client needs more contractor support.</p>
<div class="table-wrap">
<table>
<thead><tr><th>Component</th><th>Enterprise CSM</th><th>Mid-Market CSM</th></tr></thead>
<tbody>
<tr><td>Base Salary</td><td>$110K</td><td>$85K</td></tr>
<tr><td>Net Retention Bonus</td><td>$20K at 120%+ NRR</td><td>$12K at 115%+ NRR</td></tr>
<tr class="highlight-row"><td><strong>Services Expansion</strong></td><td><strong>6% on upsell</strong></td><td><strong>5% on upsell</strong></td></tr>
<tr><td>CSAT Kicker</td><td>$5K at 4.5+</td><td>$3K at 4.5+</td></tr>
<tr style="border-top:2px solid var(--border)"><td><strong>Target OTE</strong></td><td style="color:var(--green);font-weight:700">$175K</td><td style="color:var(--green);font-weight:700">$125K</td></tr>
</tbody>
</table>
</div>
</div>
</div>

<!-- SPIFs -->
<div class="card">
<div class="card-header"><h2>Quarterly SPIFs — Driving Workforce Strategy</h2></div>
<div class="grid-4">
<div style="background:var(--card2);border-radius:var(--radius);padding:20px;text-align:center;border:1px solid var(--border)">
<div style="font-size:32px;margin-bottom:8px">🎯</div>
<div style="font-size:14px;font-weight:600;margin-bottom:4px">First Services Deal</div>
<div style="font-size:13px;color:var(--dim);margin-bottom:12px">AE's first services attach of the quarter</div>
<div style="font-size:20px;font-weight:700;color:var(--green)">$2,500</div>
</div>
<div style="background:var(--card2);border-radius:var(--radius);padding:20px;text-align:center;border:1px solid var(--border)">
<div style="font-size:32px;margin-bottom:8px">📈</div>
<div style="font-size:14px;font-weight:600;margin-bottom:4px">Bundle Champion</div>
<div style="font-size:13px;color:var(--dim);margin-bottom:12px">3+ services deals closed in quarter</div>
<div style="font-size:20px;font-weight:700;color:var(--green)">$5,000</div>
</div>
<div style="background:var(--card2);border-radius:var(--radius);padding:20px;text-align:center;border:1px solid var(--border)">
<div style="font-size:32px;margin-bottom:8px">🔄</div>
<div style="font-size:14px;font-weight:600;margin-bottom:4px">Managed FP&A Convert</div>
<div style="font-size:13px;color:var(--dim);margin-bottom:12px">Convert project into ongoing retainer</div>
<div style="font-size:20px;font-weight:700;color:var(--green)">$3,000</div>
</div>
<div style="background:var(--card2);border-radius:var(--radius);padding:20px;text-align:center;border:1px solid var(--border)">
<div style="font-size:32px;margin-bottom:8px">⭐</div>
<div style="font-size:14px;font-weight:600;margin-bottom:4px">Client NPS Hero</div>
<div style="font-size:13px;color:var(--dim);margin-bottom:12px">Client NPS 9+ on services engagement</div>
<div style="font-size:20px;font-weight:700;color:var(--green)">$1,500</div>
</div>
</div>
</div>
</div>

<!-- TAB: Operational Playbook -->
<div class="tab-content" id="tab-ops">
<div class="section-title">Operational Playbook — How Sales Runs It Day-to-Day</div>

<!-- CRM Pipeline Integration -->
<div class="card" style="margin-bottom:24px">
<div class="card-header"><h2>CRM Pipeline — Services Stages (Parallel Track in HubSpot)</h2></div>
<p style="font-size:13px;color:var(--dim);margin-bottom:16px">Every SaaS deal with $50K+ ACV gets a parallel "Services Opportunity" in the CRM. AEs are required to qualify services potential on every enterprise deal.</p>
<div class="flow">
<div class="flow-step" style="border-top:3px solid var(--accent)">
<div class="step-num" style="background:rgba(91,156,245,.2);color:var(--accent)">S1</div>
<div class="step-title">Services Identified</div>
<div class="step-desc">AE flags services need during discovery. Tags skill requirements.</div>
<span class="flow-arrow">→</span>
</div>
<div class="flow-step" style="border-top:3px solid var(--purple)">
<div class="step-num" style="background:rgba(167,139,250,.2);color:var(--purple)">S2</div>
<div class="step-title">SOW Drafted</div>
<div class="step-desc">AE + SE scope the engagement. Workforce Ops provides contractor availability.</div>
<span class="flow-arrow">→</span>
</div>
<div class="flow-step" style="border-top:3px solid var(--amber)">
<div class="step-num" style="background:rgba(251,191,36,.2);color:var(--amber)">S3</div>
<div class="step-title">Client Review</div>
<div class="step-desc">SOW sent. AE manages pricing negotiation. Margin floor enforced by Deal Desk.</div>
<span class="flow-arrow">→</span>
</div>
<div class="flow-step" style="border-top:3px solid var(--green)">
<div class="step-num" style="background:rgba(52,211,153,.2);color:var(--green)">S4</div>
<div class="step-title">Signed / Deploying</div>
<div class="step-desc">SOW signed via DocuSign. Workforce Ops deploys contractors within 5 days.</div>
<span class="flow-arrow">→</span>
</div>
<div class="flow-step" style="border-top:3px solid var(--pink)">
<div class="step-num" style="background:rgba(244,114,182,.2);color:var(--pink)">S5</div>
<div class="step-title">Delivering</div>
<div class="step-desc">CSM takes over. Weekly check-ins. Quarterly reviews. Expansion identification.</div>
</div>
</div>
</div>

<!-- Weekly cadences -->
<div class="grid-2" style="margin-bottom:24px">
<div class="card">
<div class="card-header"><h3>Weekly Sales Cadence</h3></div>
<div style="font-size:14px;line-height:2.2">
<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
<span><strong>Monday 9am</strong> — Pipeline Review</span>
<span class="badge badge-blue" style="font-size:11px">VP + AEs</span>
</div>
<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
<span><strong>Tuesday 10am</strong> — Services Forecast</span>
<span class="badge badge-purple" style="font-size:11px">AEs + Ops</span>
</div>
<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
<span><strong>Wednesday 2pm</strong> — Deal Desk</span>
<span class="badge badge-amber" style="font-size:11px">VP + Finance</span>
</div>
<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
<span><strong>Thursday 11am</strong> — Delivery Standup</span>
<span class="badge badge-green" style="font-size:11px">CSM + Ops</span>
</div>
<div style="display:flex;justify-content:space-between;padding:8px 0">
<span><strong>Friday 3pm</strong> — Win/Loss Review</span>
<span class="badge badge-pink" style="font-size:11px">All Sales</span>
</div>
</div>
</div>

<div class="card">
<div class="card-header"><h3>Quarterly Business Reviews (QBR)</h3></div>
<p style="font-size:13px;color:var(--dim);margin-bottom:16px">CSM leads client QBRs with contractor team. Sales uses QBR insights to drive expansion.</p>
<div style="font-size:14px;line-height:2.2">
<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
<span>Delivery scorecard presentation</span>
<span class="badge badge-green" style="font-size:11px">CSM</span>
</div>
<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
<span>ROI analysis (hours saved, cost reduction)</span>
<span class="badge badge-blue" style="font-size:11px">AE + CSM</span>
</div>
<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
<span>Roadmap alignment + upcoming needs</span>
<span class="badge badge-purple" style="font-size:11px">AE</span>
</div>
<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
<span>Contractor performance review</span>
<span class="badge badge-amber" style="font-size:11px">Ops</span>
</div>
<div style="display:flex;justify-content:space-between;padding:8px 0">
<span>Expansion proposal (if applicable)</span>
<span class="badge badge-green" style="font-size:11px">AE</span>
</div>
</div>
</div>
</div>

<!-- Escalation framework -->
<div class="card">
<div class="card-header"><h2>Escalation Framework — Sales Stays in Control</h2></div>
<div class="table-wrap">
<table>
<thead><tr><th>Trigger</th><th>Severity</th><th>Response</th><th>Escalation Path</th><th>SLA</th></tr></thead>
<tbody>
<tr>
<td>Contractor misses milestone</td><td><span class="badge badge-amber">Medium</span></td>
<td>Ops swaps contractor from bench</td><td>Delivery Mgr → Ops Dir</td><td>24 hrs</td>
</tr>
<tr>
<td>Client requests scope change</td><td><span class="badge badge-blue">Low</span></td>
<td>AE drafts change order, Deal Desk reviews</td><td>AE → Dir New Biz</td><td>48 hrs</td>
</tr>
<tr>
<td>Margin drops below 55%</td><td><span class="badge badge-red">High</span></td>
<td>Deal Desk review + AE repricing conversation</td><td>AE → VP Sales</td><td>Same day</td>
</tr>
<tr>
<td>Client CSAT below 3.5</td><td><span class="badge badge-red">High</span></td>
<td>CSM intervention + executive sponsor call</td><td>CSM → VP Sales</td><td>Same day</td>
</tr>
<tr>
<td>Contractor no-show / ghost</td><td><span class="badge badge-red">Critical</span></td>
<td>Immediate replacement from bench + client comms</td><td>Ops Dir → VP Sales</td><td>4 hrs</td>
</tr>
<tr>
<td>Renewal at risk (90 days out)</td><td><span class="badge badge-amber">Medium</span></td>
<td>AE + CSM save plan. Executive sponsor assigned.</td><td>CSM → Dir CS → VP Sales</td><td>1 week</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<!-- TAB: Control Metrics -->
<div class="tab-content" id="tab-metrics">
<div class="section-title">Control Metrics — Sales Leadership Dashboard</div>

<!-- Revenue metrics -->
<div class="grid-4" style="margin-bottom:24px">
<div class="kpi" style="border-left:3px solid var(--accent)">
<div class="label">Services Attach Rate</div>
<div class="value" style="color:var(--accent)">38%</div>
<div class="change up">Target: 45% by Q4</div>
</div>
<div class="kpi" style="border-left:3px solid var(--green)">
<div class="label">Avg Project Margin</div>
<div class="value" style="color:var(--green)">68%</div>
<div class="change up">Floor: 55%</div>
</div>
<div class="kpi" style="border-left:3px solid var(--purple)">
<div class="label">Contractor Utilization</div>
<div class="value" style="color:var(--purple)">76%</div>
<div class="change up">Target: 80%+</div>
</div>
<div class="kpi" style="border-left:3px solid var(--amber)">
<div class="label">Bench-to-Deploy Time</div>
<div class="value" style="color:var(--amber)">3.2d</div>
<div class="change up">SLA: 5 days</div>
</div>
</div>

<div class="grid-2" style="margin-bottom:24px">
<div class="card">
<div class="card-header"><h3>Monthly Revenue by Layer</h3></div>
<div id="revenueChart"></div>
</div>
<div class="card">
<div class="card-header"><h3>Services Pipeline Velocity</h3></div>
<div id="velocityChart"></div>
</div>
</div>

<!-- Leaderboard -->
<div class="card" style="margin-bottom:24px">
<div class="card-header"><h2>AE Leaderboard — Services Revenue</h2></div>
<div class="table-wrap">
<table>
<thead><tr><th>Rank</th><th>AE</th><th>Services Deals</th><th>Services Revenue</th><th>Attach Rate</th><th>Avg Margin</th><th>Client CSAT</th><th>Trend</th></tr></thead>
<tbody>
<tr style="background:rgba(52,211,153,.05)">
<td style="color:var(--green);font-weight:700">1</td>
<td><strong>J. Torres</strong></td><td>8</td>
<td style="color:var(--green);font-weight:600">$412K</td><td>52%</td><td>71%</td><td>4.7</td>
<td style="color:var(--green)">↑↑</td>
</tr>
<tr>
<td style="font-weight:700">2</td>
<td><strong>M. Singh</strong></td><td>6</td>
<td style="font-weight:600">$328K</td><td>44%</td><td>66%</td><td>4.5</td>
<td style="color:var(--green)">↑</td>
</tr>
<tr>
<td style="font-weight:700">3</td>
<td><strong>L. Chen</strong></td><td>5</td>
<td style="font-weight:600">$285K</td><td>38%</td><td>72%</td><td>4.8</td>
<td style="color:var(--green)">↑</td>
</tr>
<tr>
<td style="font-weight:700">4</td>
<td><strong>R. Okonkwo</strong></td><td>5</td>
<td style="font-weight:600">$264K</td><td>36%</td><td>68%</td><td>4.4</td>
<td>→</td>
</tr>
<tr>
<td style="font-weight:700">5</td>
<td><strong>A. Patel</strong></td><td>3</td>
<td style="font-weight:600">$192K</td><td>28%</td><td>64%</td><td>4.2</td>
<td style="color:var(--red)">↓</td>
</tr>
<tr>
<td style="font-weight:700">6</td>
<td><strong>K. Williams</strong></td><td>4</td>
<td style="font-weight:600">$178K</td><td>31%</td><td>62%</td><td>4.3</td>
<td>→</td>
</tr>
<tr>
<td style="font-weight:700">7</td>
<td><strong>S. Nakamura</strong></td><td>2</td>
<td style="font-weight:600">$141K</td><td>22%</td><td>69%</td><td>4.6</td>
<td style="color:var(--green)">↑</td>
</tr>
</tbody>
</table>
</div>
</div>

<!-- Health scorecard -->
<div class="card">
<div class="card-header"><h2>Workforce Health Scorecard</h2></div>
<div class="grid-3">
<div style="text-align:center;padding:20px">
<div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--dim);margin-bottom:8px">Contractor NPS</div>
<div id="npsGauge"></div>
<div style="font-size:28px;font-weight:700;color:var(--green);margin-top:8px">72</div>
<div style="font-size:12px;color:var(--dim)">Target: 65+</div>
</div>
<div style="text-align:center;padding:20px">
<div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--dim);margin-bottom:8px">Client CSAT</div>
<div id="csatGauge"></div>
<div style="font-size:28px;font-weight:700;color:var(--green);margin-top:8px">4.5</div>
<div style="font-size:12px;color:var(--dim)">Target: 4.3+</div>
</div>
<div style="text-align:center;padding:20px">
<div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--dim);margin-bottom:8px">On-Time Delivery</div>
<div id="otdGauge"></div>
<div style="font-size:28px;font-weight:700;color:var(--green);margin-top:8px">89%</div>
<div style="font-size:12px;color:var(--dim)">Target: 85%+</div>
</div>
</div>
</div>
</div>

</div><!-- /container -->


` }} />
    </>
  );
}
