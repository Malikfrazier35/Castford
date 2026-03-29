'use client';

import { useEffect, useRef } from 'react';

export default function V3TemplatesPricingMatrixPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Scatter chart positioning
(function(){
const chart = document.getElementById('scatterChart');
if(!chart) return;
const w = chart.offsetWidth, h = chart.offsetHeight;

const platforms = [
  { name:'Anaplan', x:85, y:92, size:24, color:'var(--red)', sub:'$150K-$1.2M' },
  { name:'Workday', x:80, y:85, size:22, color:'var(--red)', sub:'$100K-$700K' },
  { name:'Pigment', x:72, y:70, size:18, color:'var(--amber)', sub:'$65K-$165K' },
  { name:'Planful', x:65, y:65, size:18, color:'var(--amber)', sub:'$50K-$150K' },
  { name:'Vena', x:58, y:48, size:16, color:'var(--amber)', sub:'$25K-$80K' },
  { name:'Mosaic', x:42, y:35, size:14, color:'var(--dim)', sub:'$22K-$36K' },
  { name:'Cube', x:45, y:32, size:14, color:'var(--dim)', sub:'$15K-$45K' },
  { name:'Datarails', x:38, y:30, size:13, color:'var(--dim)', sub:'$18K-$24K' },
  { name:'Jirav', x:30, y:28, size:12, color:'var(--muted)', sub:'$20K' },
  { name:'FinanceOS', x:75, y:25, size:28, color:'var(--accent)', sub:'$6K-$48K/yr' },
];

// Draw grid lines
for(let i=1;i<=4;i++){
  const line = document.createElement('div');
  line.style.cssText=\`position:absolute;left:0;right:0;top:\${i*20}%;height:1px;background:rgba(30,37,64,.3)\`;
  chart.appendChild(line);
}
for(let i=1;i<=4;i++){
  const line = document.createElement('div');
  line.style.cssText=\`position:absolute;top:0;bottom:0;left:\${i*20}%;width:1px;background:rgba(30,37,64,.3)\`;
  chart.appendChild(line);
}

platforms.forEach(p => {
  const dot = document.createElement('div');
  dot.className = 'scatter-dot';
  const isFinanceOS = p.name === 'FinanceOS';
  dot.style.cssText = \`
    left:\${p.x}%;bottom:\${100-p.y}%;width:\${p.size}px;height:\${p.size}px;
    background:\${p.color};transform:translate(-50%,50%);
    \${isFinanceOS ? 'box-shadow:0 0 20px rgba(91,156,245,.5);animation:pulse 2s ease infinite;border:2px solid #fff' : 'opacity:.7'}
  \`;
  dot.innerHTML = \`<div class="dot-label" style="\${isFinanceOS?'color:var(--accent);font-size:12px;font-weight:700':'font-size:10px'}">\${p.name}<br><span style="font-size:9px;opacity:.7">\${p.sub}</span></div>\`;
  chart.appendChild(dot);
});

// Add annotation arrow
const arrow = document.createElement('div');
arrow.style.cssText = 'position:absolute;left:65%;bottom:65%;color:var(--green);font-size:12px;font-weight:600;text-align:center;line-height:1.4';
arrow.innerHTML = '← Enterprise features<br>at startup price →';
chart.appendChild(arrow);
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
--bg:#0a0d13;--surface:#111520;--card:#161b28;--card2:#1a2033;
--border:#1e2540;--text:#e2e8f0;--dim:#8892a8;--muted:#5a6380;
--accent:#5b9cf5;--green:#34d399;--red:#f87171;--amber:#fbbf24;--purple:#a78bfa;--pink:#f472b6;--cyan:#22d3ee;
--radius:12px;--shadow:0 4px 24px rgba(0,0,0,.4);--ease:cubic-bezier(.4,0,.2,1);
}
body{font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
.container{max-width:1400px;margin:0 auto;padding:32px 24px}
.header{text-align:center;padding:40px 0 48px}
.header h1{font-size:32px;font-weight:800;margin-bottom:8px}
.header h1 span{background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.header p{color:var(--dim);font-size:15px}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow)}
.badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
.badge-blue{background:rgba(91,156,245,.12);color:var(--accent)}
.badge-green{background:rgba(52,211,153,.12);color:var(--green)}
.badge-red{background:rgba(248,113,113,.12);color:var(--red)}
.badge-amber{background:rgba(251,191,36,.12);color:var(--amber)}
.badge-purple{background:rgba(167,139,250,.12);color:var(--purple)}
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.section{margin-bottom:48px}
.section-title{font-size:20px;font-weight:700;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid var(--border)}

/* Pricing Matrix Table */
.matrix-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:var(--radius)}
.matrix{width:100%;border-collapse:collapse;font-size:13px;min-width:1100px}
.matrix th{padding:14px 12px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--dim);font-weight:600;border-bottom:2px solid var(--border);background:var(--surface);white-space:nowrap}
.matrix td{padding:12px;text-align:center;border-bottom:1px solid rgba(30,37,64,.4);vertical-align:middle}
.matrix tbody tr{transition:all .2s var(--ease)}
.matrix tbody tr:hover td{background:rgba(91,156,245,.03)}
.matrix .company{text-align:left;font-weight:600;white-space:nowrap}
.matrix .company .sub{font-weight:400;font-size:11px;color:var(--muted);display:block;margin-top:2px}
.matrix .price{font-weight:700;font-size:15px;white-space:nowrap}
.matrix .highlight-row{background:rgba(91,156,245,.04)}
.matrix .highlight-row td{border-top:2px solid var(--accent);border-bottom:2px solid var(--accent)}
.matrix .highlight-row td:first-child{border-left:2px solid var(--accent)}
.matrix .highlight-row td:last-child{border-right:2px solid var(--accent)}
.checkmark{color:var(--green);font-weight:700}
.crossmark{color:var(--red);opacity:.5}
.partial{color:var(--amber)}

/* Tier cards */
.tier-card{border:1px solid var(--border);border-radius:var(--radius);padding:28px;background:var(--card);position:relative;overflow:hidden;transition:all .3s var(--ease)}
.tier-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.3)}
.tier-card.recommended{border-color:var(--accent)}
.tier-card.recommended::before{content:'MOST POPULAR';position:absolute;top:16px;right:-32px;background:linear-gradient(135deg,var(--accent),var(--purple));color:#fff;font-size:9px;font-weight:800;letter-spacing:1px;padding:4px 40px;transform:rotate(45deg)}
.tier-name{font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:8px}
.tier-price{font-size:36px;font-weight:800;margin-bottom:4px}
.tier-price .period{font-size:14px;font-weight:400;color:var(--dim)}
.tier-desc{font-size:13px;color:var(--dim);margin-bottom:20px;line-height:1.6}
.tier-features{list-style:none;padding:0;margin-bottom:24px}
.tier-features li{font-size:13px;padding:6px 0;display:flex;align-items:center;gap:8px;color:var(--text)}
.tier-features li svg{width:16px;height:16px;flex-shrink:0;stroke:var(--green);fill:none;stroke-width:2.5}
.tier-btn{width:100%;padding:12px;border-radius:var(--radius);font-size:14px;font-weight:600;border:none;cursor:pointer;transition:all .2s var(--ease)}
.tier-btn-primary{background:linear-gradient(135deg,var(--accent),var(--purple));color:#fff}
.tier-btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text)}

/* Positioning chart */
.chart-container{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px}
.scatter-chart{position:relative;width:100%;height:420px;border-left:2px solid var(--border);border-bottom:2px solid var(--border);margin:20px 0}
.scatter-dot{position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s var(--ease);z-index:1}
.scatter-dot:hover{transform:scale(1.3);z-index:10}
.scatter-dot .dot-label{position:absolute;top:calc(100% + 6px);left:50%;transform:translateX(-50%);font-size:10px;font-weight:600;white-space:nowrap;color:var(--dim)}
.scatter-dot:hover .dot-label{color:var(--text)}
.axis-label{position:absolute;font-size:11px;color:var(--muted);font-weight:500}
.axis-y{left:-60px;top:50%;transform:rotate(-90deg) translateX(50%);white-space:nowrap}
.axis-x{bottom:-28px;left:50%;transform:translateX(-50%);white-space:nowrap}
.quadrant-label{position:absolute;font-size:10px;color:rgba(136,146,168,.3);font-weight:700;text-transform:uppercase;letter-spacing:1px}

@media(max-width:1024px){.grid-3{grid-template-columns:1fr 1fr}.scatter-chart{height:320px}}
@media(max-width:768px){.grid-2,.grid-3{grid-template-columns:1fr}.container{padding:20px 16px}.scatter-chart{height:280px}}

@keyframes pulse{0%,100%{box-shadow:0 0 20px rgba(91,156,245,.3)}50%{box-shadow:0 0 40px rgba(91,156,245,.6)}}` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<div class="container">

<div class="header">
<h1>Competitive <span>Pricing Matrix</span></h1>
<p>Base + consumption pricing vs. flat-rate competitors — where FinanceOS wins</p>
</div>

<!-- ═══ PRICING MATRIX TABLE ═══ -->
<div class="section">
<div class="section-title">Full Market Pricing Comparison</div>
<div class="matrix-wrap">
<table class="matrix">
<thead>
<tr>
<th style="text-align:left;min-width:160px">Platform</th>
<th>Segment</th>
<th>Annual Cost</th>
<th>Per User/Mo</th>
<th>Implementation</th>
<th>Time to Value</th>
<th>AI Features</th>
<th>Multi-Entity</th>
<th>Excel Native</th>
<th>Consolidation</th>
</tr>
</thead>
<tbody>
<!-- Enterprise tier -->
<tr>
<td class="company">Anaplan<span class="sub">Oracle-owned EPM</span></td>
<td><span class="badge badge-red">Enterprise</span></td>
<td class="price" style="color:var(--red)">$150K–$1.2M</td>
<td style="color:var(--dim)">$100–$1,000+</td>
<td style="color:var(--red)">$50K–$300K</td>
<td style="color:var(--amber)">4–9 months</td>
<td class="checkmark">Yes</td>
<td class="checkmark">Yes</td>
<td class="crossmark">No</td>
<td class="checkmark">Yes</td>
</tr>
<tr>
<td class="company">Workday Adaptive<span class="sub">Workday suite</span></td>
<td><span class="badge badge-red">Enterprise</span></td>
<td class="price" style="color:var(--red)">$100K–$700K</td>
<td style="color:var(--dim)">$83–$580+</td>
<td style="color:var(--red)">$20K–$150K</td>
<td style="color:var(--amber)">3–6 months</td>
<td class="checkmark">Yes</td>
<td class="checkmark">Yes</td>
<td class="crossmark">No</td>
<td class="checkmark">Yes</td>
</tr>
<tr>
<td class="company">Pigment<span class="sub">Next-gen EPM</span></td>
<td><span class="badge badge-purple">Mid-Enterprise</span></td>
<td class="price" style="color:var(--amber)">$65K–$165K</td>
<td style="color:var(--dim)">$200–$500+</td>
<td style="color:var(--amber)">$15K–$50K</td>
<td style="color:var(--amber)">2–4 months</td>
<td class="checkmark">Yes</td>
<td class="checkmark">Yes</td>
<td class="crossmark">No</td>
<td class="checkmark">Yes</td>
</tr>
<tr>
<td class="company">Planful<span class="sub">Mid-market EPM</span></td>
<td><span class="badge badge-purple">Mid-Market</span></td>
<td class="price" style="color:var(--amber)">$50K–$150K</td>
<td style="color:var(--dim)">$150–$400+</td>
<td style="color:var(--amber)">$15K–$75K</td>
<td style="color:var(--amber)">3–6 months</td>
<td class="partial">Limited</td>
<td class="checkmark">Yes</td>
<td class="crossmark">No</td>
<td class="checkmark">Yes</td>
</tr>
<!-- Mid-market -->
<tr>
<td class="company">Vena Solutions<span class="sub">Excel-native FP&A</span></td>
<td><span class="badge badge-amber">Mid-Market</span></td>
<td class="price" style="color:var(--amber)">$25K–$80K</td>
<td style="color:var(--dim)">$100–$250+</td>
<td style="color:var(--amber)">$10K–$30K</td>
<td style="color:var(--dim)">2–4 months</td>
<td class="checkmark">Yes</td>
<td class="checkmark">Yes</td>
<td class="checkmark">Yes</td>
<td class="checkmark">Yes</td>
</tr>
<tr>
<td class="company">Mosaic<span class="sub">Strategic finance</span></td>
<td><span class="badge badge-amber">Growth</span></td>
<td class="price" style="color:var(--amber)">$22K–$36K</td>
<td style="color:var(--dim)">$180–$300</td>
<td style="color:var(--dim)">$5K–$15K</td>
<td style="color:var(--dim)">2–4 weeks</td>
<td class="partial">Limited</td>
<td class="partial">Limited</td>
<td class="crossmark">No</td>
<td class="partial">Limited</td>
</tr>
<tr>
<td class="company">Cube<span class="sub">Spreadsheet FP&A</span></td>
<td><span class="badge badge-amber">Growth</span></td>
<td class="price">$15K–$45K</td>
<td style="color:var(--dim)">$125–$375</td>
<td style="color:var(--dim)">$5K–$10K</td>
<td style="color:var(--dim)">2–4 weeks</td>
<td class="partial">Limited</td>
<td class="checkmark">Yes</td>
<td class="checkmark">Yes</td>
<td class="partial">Limited</td>
</tr>
<tr>
<td class="company">Datarails<span class="sub">Excel automation</span></td>
<td><span class="badge badge-blue">SMB</span></td>
<td class="price">$18K–$24K</td>
<td style="color:var(--dim)">$150–$200</td>
<td style="color:var(--dim)">$3K–$8K</td>
<td style="color:var(--dim)">2–3 weeks</td>
<td class="checkmark">Yes</td>
<td class="partial">Limited</td>
<td class="checkmark">Yes</td>
<td class="crossmark">No</td>
</tr>
<tr>
<td class="company">Jirav<span class="sub">SMB FP&A</span></td>
<td><span class="badge badge-blue">SMB</span></td>
<td class="price">$20K</td>
<td style="color:var(--dim)">$1,667/mo flat</td>
<td style="color:var(--dim)">$2K–$5K</td>
<td style="color:var(--dim)">1–2 weeks</td>
<td class="crossmark">No</td>
<td class="partial">Limited</td>
<td class="crossmark">No</td>
<td class="crossmark">No</td>
</tr>
<!-- FinanceOS -->
<tr class="highlight-row">
<td class="company" style="color:var(--accent)">FinanceOS<span class="sub" style="color:var(--accent);opacity:.7">AI-powered FP&A</span></td>
<td><span class="badge badge-green">All Segments</span></td>
<td class="price" style="color:var(--green);font-size:18px">$6K–$48K+</td>
<td style="color:var(--green);font-weight:700">$499–$3,999/mo</td>
<td style="color:var(--green);font-weight:600">$0 self-serve</td>
<td style="color:var(--green);font-weight:600">&lt; 48 hours</td>
<td class="checkmark" style="font-size:16px">Yes</td>
<td class="checkmark" style="font-size:16px">Yes</td>
<td class="checkmark" style="font-size:16px">Yes</td>
<td class="checkmark" style="font-size:16px">Yes</td>
</tr>
</tbody>
</table>
</div>
</div>

<!-- ═══ POSITIONING CHART ═══ -->
<div class="section">
<div class="section-title">Market Positioning — Price vs. Capability</div>
<div class="chart-container">
<p style="font-size:13px;color:var(--dim);margin-bottom:16px">The FP&A market has a massive gap between expensive enterprise platforms and limited SMB tools. FinanceOS should sit right in the gap — enterprise-grade capabilities at SMB-friendly pricing.</p>
<div class="scatter-chart" id="scatterChart">
<div class="axis-label axis-y">Annual Cost →</div>
<div class="axis-label axis-x">Feature Depth & AI Capability →</div>
<div class="quadrant-label" style="top:8px;left:8px">Overpriced</div>
<div class="quadrant-label" style="top:8px;right:8px">Enterprise Value</div>
<div class="quadrant-label" style="bottom:8px;left:8px">Basic Tools</div>
<div class="quadrant-label" style="bottom:8px;right:8px">Disruption Zone</div>
<!-- Dots placed via JS -->
</div>
</div>
</div>

<!-- ═══ FINANCEOS PRICING — BASE + CONSUMPTION ═══ -->
<div class="section">
<div class="section-title">FinanceOS Pricing — Base + Consumption Model</div>
<p style="font-size:14px;color:var(--dim);margin-bottom:24px">Base platform fee covers entities, users, and features. Consumption layer charges per-use for AI queries, syncs, exports, and scenario runs — revenue scales with customer value without forcing tier upgrades.</p>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
<!-- Starter -->
<div class="tier-card">
<div class="tier-name" style="color:var(--accent)">Starter</div>
<div class="tier-price" style="color:var(--accent)">$499<span class="period">/mo</span></div>
<div style="font-size:12px;color:var(--green);margin-bottom:4px">Save $1,200/year on annual</div>
<div class="tier-desc">Growing teams. 3 entities, 5 users, P&L + Forecast, 5 connectors.</div>
<ul class="tier-features">
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 3 entities, 5 users</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> P&L + Forecast</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 5 connectors</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Email support</li>
</ul>
<div style="font-size:11px;color:var(--dim);margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
<div style="font-weight:600;margin-bottom:6px;color:var(--text)">Consumption included:</div>
<div>100 AI queries <span style="color:var(--muted)">then $0.50/ea</span></div>
<div>500 syncs <span style="color:var(--muted)">then $0.02/ea</span></div>
<div>50 exports <span style="color:var(--muted)">then $0.25/ea</span></div>
<div>10 scenario runs <span style="color:var(--muted)">then $1.00/ea</span></div>
</div>
<div style="text-align:center;margin-top:16px;font-size:12px;color:var(--dim)">$5,988/yr base — competitive with Jirav/Datarails</div>
<button class="tier-btn tier-btn-ghost" style="margin-top:12px">Subscribe</button>
</div>

<!-- Growth -->
<div class="tier-card recommended">
<div class="tier-name" style="color:var(--green)">Growth</div>
<div class="tier-price" style="color:var(--green)">$1,499<span class="period">/mo</span></div>
<div style="font-size:12px;color:var(--green);margin-bottom:4px">Save $3,600/year on annual</div>
<div class="tier-desc">Scaling orgs. 10 entities, 25 users, AI Copilot, consolidation.</div>
<ul class="tier-features">
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> 10 entities, 25 users</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> AI Copilot</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Multi-entity consolidation</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Unlimited connectors</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Priority support</li>
</ul>
<div style="font-size:11px;color:var(--dim);margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
<div style="font-weight:600;margin-bottom:6px;color:var(--text)">Consumption included:</div>
<div>1,000 AI queries <span style="color:var(--muted)">then $0.30/ea</span></div>
<div>5,000 syncs <span style="color:var(--muted)">then $0.01/ea</span></div>
<div>500 exports <span style="color:var(--muted)">then $0.15/ea</span></div>
<div>100 scenario runs <span style="color:var(--muted)">then $0.75/ea</span></div>
<div>5,000 API calls <span style="color:var(--muted)">then $0.01/ea</span></div>
</div>
<div style="text-align:center;margin-top:16px;font-size:12px;color:var(--dim)">$17,988/yr base — undercuts Cube & Mosaic</div>
<button class="tier-btn tier-btn-primary" style="margin-top:12px">Subscribe</button>
</div>

<!-- Business -->
<div class="tier-card">
<div class="tier-name" style="color:var(--amber)">Business</div>
<div class="tier-price" style="color:var(--amber)">$3,999<span class="period">/mo</span></div>
<div style="font-size:12px;color:var(--green);margin-bottom:4px">Save $9,600/year on annual</div>
<div class="tier-desc">Enterprise orgs. Unlimited entities/users, custom ML, SSO, dedicated CSM.</div>
<ul class="tier-features">
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Unlimited entities & users</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Custom ML models</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> SSO + RBAC</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Dedicated CSM + SLA</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Full API access</li>
</ul>
<div style="font-size:11px;color:var(--dim);margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
<div style="font-weight:600;margin-bottom:6px;color:var(--text)">Consumption included:</div>
<div>10,000 AI queries <span style="color:var(--muted)">then $0.15/ea</span></div>
<div>Unlimited syncs</div>
<div>Unlimited exports</div>
<div>1,000 scenario runs <span style="color:var(--muted)">then $0.50/ea</span></div>
<div>Unlimited API calls</div>
</div>
<div style="text-align:center;margin-top:16px;font-size:12px;color:var(--dim)">$47,988/yr base — 50-70% below Planful/Vena</div>
<button class="tier-btn tier-btn-ghost" style="margin-top:12px">Subscribe</button>
</div>

<!-- Enterprise -->
<div class="tier-card" style="border-color:var(--purple)">
<div class="tier-name" style="color:var(--purple)">Enterprise</div>
<div class="tier-price" style="color:var(--purple)">Custom</div>
<div style="font-size:12px;color:var(--purple);margin-bottom:4px;opacity:.7">White Glove</div>
<div class="tier-desc">Branded command center, dedicated finance architect, SOX-compliant, on-prem or cloud.</div>
<ul class="tier-features">
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Everything in Business</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Branded Command Center</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Dedicated Finance Architect</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> SOX audit trails</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Custom SLA (99.99%)</li>
<li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Weekly dashboard upgrades</li>
</ul>
<div style="font-size:11px;color:var(--dim);margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
<div style="font-weight:600;margin-bottom:6px;color:var(--text)">Consumption:</div>
<div>All meters unlimited</div>
<div>Committed spend discounts</div>
<div>Multi-year pricing available</div>
</div>
<div style="text-align:center;margin-top:16px;font-size:12px;color:var(--dim)">Replaces $150K+ Anaplan/Pigment</div>
<button class="tier-btn tier-btn-ghost" style="margin-top:12px;border-color:var(--purple);color:var(--purple)">Talk to Finance Architect</button>
</div>
</div>
</div>

<!-- ═══ PRICING STRATEGY RATIONALE ═══ -->
<div class="section">
<div class="section-title">Why This Pricing Works</div>
<div class="grid-2">
<div class="card">
<h3 style="font-size:16px;font-weight:600;margin-bottom:16px;color:var(--accent)">The Gap You're Exploiting</h3>
<div style="font-size:13px;color:var(--dim);line-height:1.9">
<div style="padding:8px 0;border-bottom:1px solid var(--border)"><strong style="color:var(--text)">$100K+ tier</strong> — Anaplan, Workday, Pigment. Massive feature sets but 6-month implementations, consultants required, built for Fortune 500. <em>Too expensive and too slow for 95% of the market.</em></div>
<div style="padding:8px 0;border-bottom:1px solid var(--border)"><strong style="color:var(--text)">$20K–$50K tier</strong> — Vena, Planful, Cube. Mid-market incumbents. Good features but still expensive for growing companies, often require implementation partners. <em>The "safe" choice that nobody loves.</em></div>
<div style="padding:8px 0;border-bottom:1px solid var(--border)"><strong style="color:var(--text)">$15K–$25K tier</strong> — Datarails, Jirav, Mosaic. SMB-focused. Limited multi-entity, limited AI, limited consolidation. <em>You outgrow them fast.</em></div>
<div style="padding:8px 0"><strong style="color:var(--green)">$499–$3,999/mo tier</strong> — FinanceOS. Enterprise capabilities (AI copilot, multi-entity consolidation, scenario modeling) at $6K–$48K/yr — 50-90% less than incumbents. Base + consumption means customers pay for what they use. Self-serve onboarding. Same-day time to value. <em>This tier doesn't exist today. You create it.</em></div>
</div>
</div>

<div class="card">
<h3 style="font-size:16px;font-weight:600;margin-bottom:16px;color:var(--green)">Revenue Math</h3>
<table style="width:100%;font-size:13px;border-collapse:collapse">
<thead><tr><th style="text-align:left;padding:8px;border-bottom:1px solid var(--border);color:var(--dim);font-size:11px">METRIC</th><th style="text-align:right;padding:8px;border-bottom:1px solid var(--border);color:var(--dim);font-size:11px">CONSERVATIVE</th><th style="text-align:right;padding:8px;border-bottom:1px solid var(--border);color:var(--dim);font-size:11px">TARGET</th></tr></thead>
<tbody>
<tr><td style="padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">Starter ($499/mo → $5,988/yr)</td><td style="text-align:right;padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">100 customers</td><td style="text-align:right;padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">300 customers</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">Growth ($1,499/mo → $17,988/yr)</td><td style="text-align:right;padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">60 customers</td><td style="text-align:right;padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">150 customers</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">Business ($3,999/mo → $47,988/yr)</td><td style="text-align:right;padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">15 customers</td><td style="text-align:right;padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">40 customers</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">Consumption overages (avg 18% uplift)</td><td style="text-align:right;padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">+$350K</td><td style="text-align:right;padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">+$1.1M</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">Services attach (avg $2K/mo)</td><td style="text-align:right;padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">20 clients</td><td style="text-align:right;padding:8px;border-bottom:1px solid rgba(30,37,64,.3)">50 clients</td></tr>
<tr style="background:rgba(52,211,153,.06)"><td style="padding:12px 8px;font-weight:700;color:var(--green)">Total ARR</td><td style="text-align:right;padding:12px 8px;font-weight:700;color:var(--green);font-size:16px">$2.64M</td><td style="text-align:right;padding:12px 8px;font-weight:700;color:var(--green);font-size:16px">$8.27M</td></tr>
</tbody>
</table>
<div style="margin-top:16px;font-size:12px;color:var(--dim);line-height:1.7">
<strong style="color:var(--amber)">Key insight:</strong> The Growth tier at $1,499/mo ($17,988/yr) is the real revenue driver — it's the sweet spot that undercuts Cube and Mosaic on price while delivering consolidation and AI Copilot they can't match. The consumption layer adds 15-25% on top of base, creating natural revenue expansion without forcing tier upgrades. Path: Starter → Growth → Business → Enterprise + Services.
</div>
</div>
</div>
</div>

<!-- ═══ COMPETITIVE COMPARISON SUMMARY ═══ -->
<div class="section">
<div class="section-title">How to Frame It on the Landing Page</div>
<div class="card">
<div style="text-align:center;padding:20px 0">
<div style="font-size:14px;color:var(--dim);margin-bottom:8px">What enterprise FP&A costs today</div>
<div style="font-size:48px;font-weight:800;color:var(--red);text-decoration:line-through;opacity:.5">$150,000<span style="font-size:18px;font-weight:400">/yr</span></div>
<div style="font-size:14px;color:var(--dim);margin:12px 0 8px">What FinanceOS starts at</div>
<div style="font-size:56px;font-weight:800;background:linear-gradient(135deg,var(--green),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent">$499<span style="font-size:20px;font-weight:400;-webkit-text-fill-color:var(--dim)">/mo</span></div>
<div style="font-size:13px;color:var(--dim);margin-top:4px">$5,988/yr base — scales with consumption</div>
<div style="font-size:13px;color:var(--dim);margin-top:8px">Same AI. Same consolidation. Same scenario modeling. 96% less to start.</div>
</div>
<div style="display:flex;justify-content:center;gap:12px;margin-top:20px;flex-wrap:wrap">
<span class="badge badge-green" style="font-size:14px;padding:8px 20px">No implementation fees</span>
<span class="badge badge-green" style="font-size:14px;padding:8px 20px">No consultants required</span>
<span class="badge badge-green" style="font-size:14px;padding:8px 20px">Live in 24 hours</span>
</div>
</div>
</div>

</div><!-- /container -->


<style>@keyframes pulse{0%,100%{box-shadow:0 0 20px rgba(91,156,245,.3)}50%{box-shadow:0 0 40px rgba(91,156,245,.6)}}</style>
` }} />
    </>
  );
}
