'use client';

import { useEffect } from 'react';

export default function V3DemoCocacolaPage() {
  

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f8f9fb;--bg2:#f0f1f4;--surface:#ffffff;--surfaceAlt:#f5f6f8;
  --border:#e2e5ec;--borderLight:#eceef3;--borderDark:#cdd2de;
  --text:#0c0e14;--textSec:#3b4054;--textDim:#5d6580;--textFaint:#8b93a8;
  --coke:#d41f2c;--cokeSoft:rgba(212,31,44,0.06);--cokeMid:rgba(212,31,44,0.12);
  --green:#0c8c5e;--greenSoft:rgba(12,140,94,0.06);
  --red:#c42b2b;--redSoft:rgba(196,43,43,0.06);
  --amber:#b07a0a;--amberSoft:rgba(176,122,10,0.06);
  --blue:#1a6cb5;--blueSoft:rgba(26,108,181,0.06);
  --purple:#6842c2;--purpleSoft:rgba(104,66,194,0.06);
  --cyan:#0a7f8c;
  --shadow-sm:0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:0 2px 8px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --r:12px;--r-sm:8px;--r-xs:6px;
}
html{font-size:13px}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased;line-height:1.5;overflow:hidden;height:100vh}
.mono{font-family:'JetBrains Mono',monospace;font-feature-settings:'tnum'}
.shell{display:grid;grid-template-columns:220px 1fr;height:100vh}
.sidebar{background:var(--surface);border-right:1px solid var(--border);padding:16px 0;display:flex;flex-direction:column;overflow-y:auto}
.main{padding:24px 28px;overflow-y:auto}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--shadow-sm);transition:box-shadow 0.2s}
.card:hover{box-shadow:var(--shadow-md)}
.nav-item{display:flex;align-items:center;gap:9px;padding:7px 16px;margin:1px 8px;border-radius:var(--r-sm);font-size:11.5px;font-weight:500;color:var(--textDim);cursor:pointer;transition:all .12s}
.nav-item:hover{color:var(--text);background:var(--surfaceAlt)}
.nav-item.active{color:var(--coke);background:var(--cokeSoft);font-weight:600}
.nav-item svg{width:15px;height:15px;opacity:.5;flex-shrink:0}
.nav-item.active svg{opacity:1}
.sl{font-size:10px;font-weight:700;color:var(--textFaint);letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:8px}
.tag{font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;letter-spacing:.02em;text-transform:uppercase}
.tbl{width:100%;border-collapse:collapse;font-size:11.5px}
.tbl th{text-align:left;padding:7px 10px;font-size:9px;font-weight:700;color:var(--textFaint);text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid var(--border);background:var(--surfaceAlt)}
.tbl td{padding:7px 10px;border-bottom:1px solid var(--borderLight);color:var(--textSec);font-weight:500}
.tbl tr:last-child td{border-bottom:none}
.tbl .total td{border-top:2px solid var(--border);font-weight:700;color:var(--text);background:var(--surfaceAlt)}
.metric-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--borderLight);font-size:11px}
.metric-row:last-child{border-bottom:none}
.check-item{display:flex;align-items:center;gap:7px;padding:5px 0;font-size:10.5px;border-bottom:1px solid var(--borderLight)}
.check-item:last-child{border-bottom:none}
/* Tooltip on chart hover */
.chart-tooltip{position:absolute;background:var(--text);color:#fff;font-size:10px;padding:4px 8px;border-radius:4px;pointer-events:none;opacity:0;transition:opacity .15s;white-space:nowrap;font-weight:600;font-family:'JetBrains Mono',monospace;z-index:10}
/* Waterfall bars */
.wf-bar{transition:opacity .15s}.wf-bar:hover{opacity:.8}
/* Donut hover */
.donut-seg{transition:transform .15s,opacity .15s;transform-origin:center}
.donut-seg:hover{transform:scale(1.03);opacity:.9}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
` }} />
      <div dangerouslySetInnerHTML={{ __html: `
<div class="shell">
<!-- SIDEBAR -->
<aside class="sidebar">
  <div style="padding:0 16px 14px;display:flex;align-items:center;gap:8px">
    <div style="width:26px;height:26px;border-radius:7px;background:var(--coke);display:flex;align-items:center;justify-content:center">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="3.5" height="20" rx="1.5" fill="#fff" opacity=".95"/><rect x="3" y="2" width="16" height="3.2" rx="1.5" fill="#fff" opacity=".95"/><rect x="3" y="9.5" width="11" height="2.8" rx="1.2" fill="#fff" opacity=".6"/><rect x="14" y="14" width="2.8" height="8" rx="1" fill="#fff" opacity=".4"/><rect x="18" y="10" width="2.8" height="12" rx="1" fill="#fff" opacity=".55"/></svg>
    </div>
    <div><div style="font-size:12px;font-weight:800;letter-spacing:-.02em">FinanceOS</div><div style="font-size:7.5px;color:var(--textFaint);font-weight:700;letter-spacing:.08em;text-transform:uppercase">Enterprise</div></div>
  </div>
  <div style="padding:2px 0 6px">
    <div class="nav-item active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>CFO Overview</div>
    <div class="nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Revenue</div>
    <div class="nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>P&amp;L</div>
    <div class="nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20"/></svg>Treasury</div>
    <div class="nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Close Mgmt</div>
    <div class="nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="M8 6H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4"/><path d="M16 6h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4"/></svg>Consolidation</div>
    <div class="nav-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="8" height="8" rx="1"/><path d="M4 12H2"/><path d="M22 12h-2"/><path d="M12 2v2"/><path d="M12 22v-2"/></svg>AI Copilot</div>
  </div>
  <div style="margin-top:auto;padding:12px 16px;border-top:1px solid var(--border)">
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:26px;height:26px;border-radius:7px;background:var(--coke);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff">JM</div>
      <div><div style="font-size:10.5px;font-weight:600">John Murphy</div><div style="font-size:8.5px;color:var(--textFaint)">CFO · Coca-Cola</div></div>
    </div>
  </div>
</aside>

<!-- MAIN -->
<main class="main">
  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
    <div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:3px">
        <h1 style="font-size:18px;font-weight:800;letter-spacing:-.03em">CFO Command Center</h1>
        <span style="font-size:8px;font-weight:700;padding:3px 8px;border-radius:4px;background:var(--greenSoft);color:var(--green);display:inline-flex;align-items:center;gap:4px"><span style="width:5px;height:5px;border-radius:50%;background:var(--green)"></span>LIVE</span>
      </div>
      <div style="font-size:10.5px;color:var(--textDim)"><strong style="color:var(--textSec)">The Coca-Cola Company</strong> · NYSE: KO · Q1 2026 · Jan 1 – Mar 25 · Synced 2m ago</div>
    </div>
    <div style="display:flex;gap:6px">
      <button style="font-size:10px;padding:6px 12px;border-radius:var(--r-sm);border:1px solid var(--border);background:var(--surface);color:var(--textSec);font-weight:600;cursor:pointer;font-family:inherit">Export</button>
      <button style="font-size:10px;padding:6px 12px;border-radius:var(--r-sm);border:none;background:var(--coke);color:#fff;font-weight:700;cursor:pointer;font-family:inherit">Board Deck →</button>
    </div>
  </div>

  <!-- KPI Strip -->
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:18px">
    <div class="card" style="padding:14px 16px"><div style="font-size:9px;font-weight:600;color:var(--textFaint);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Net Revenue</div><div class="mono" style="font-size:20px;font-weight:800;letter-spacing:-.03em">$11.8B</div><div style="font-size:9px;font-weight:600;color:var(--green);margin-top:4px">▲ 6.2% YoY</div></div>
    <div class="card" style="padding:14px 16px"><div style="font-size:9px;font-weight:600;color:var(--textFaint);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Gross Margin</div><div class="mono" style="font-size:20px;font-weight:800;letter-spacing:-.03em;color:var(--green)">60.2%</div><div style="font-size:9px;font-weight:600;color:var(--green);margin-top:4px">▲ 180bps YoY</div></div>
    <div class="card" style="padding:14px 16px"><div style="font-size:9px;font-weight:600;color:var(--textFaint);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Operating Inc.</div><div class="mono" style="font-size:20px;font-weight:800;letter-spacing:-.03em">$3.4B</div><div style="font-size:9px;font-weight:600;color:var(--green);margin-top:4px">▲ 8.1% vs plan</div></div>
    <div class="card" style="padding:14px 16px"><div style="font-size:9px;font-weight:600;color:var(--textFaint);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Free Cash Flow</div><div class="mono" style="font-size:20px;font-weight:800;letter-spacing:-.03em">$2.6B</div><div style="font-size:9px;font-weight:600;color:var(--green);margin-top:4px">▲ 12.4% YoY</div></div>
    <div class="card" style="padding:14px 16px"><div style="font-size:9px;font-weight:600;color:var(--textFaint);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">EPS (Diluted)</div><div class="mono" style="font-size:20px;font-weight:800;letter-spacing:-.03em">$0.74</div><div style="font-size:9px;font-weight:600;color:var(--green);margin-top:4px">▲ $0.06 beat</div></div>
    <div class="card" style="padding:14px 16px"><div style="font-size:9px;font-weight:600;color:var(--textFaint);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Organic Growth</div><div class="mono" style="font-size:20px;font-weight:800;letter-spacing:-.03em;color:var(--coke)">+11%</div><div style="font-size:9px;font-weight:600;color:var(--coke);margin-top:4px">Price +8% / Vol +3%</div></div>
  </div>

  <!-- ROW 1: Revenue Trend + P&L Waterfall -->
  <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:14px;margin-bottom:16px">

    <!-- Revenue Trend Area Chart with Margin Overlay -->
    <div class="card" style="padding:16px 18px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="sl" style="margin:0">Quarterly Revenue &amp; Margin Trend</div>
        <div style="display:flex;gap:12px;font-size:8.5px;color:var(--textFaint);font-weight:600">
          <span style="display:flex;align-items:center;gap:3px"><span style="width:8px;height:3px;background:var(--coke);border-radius:1px"></span>Revenue</span>
          <span style="display:flex;align-items:center;gap:3px"><span style="width:8px;height:2px;border-top:2px dashed var(--green)"></span>Gross Margin %</span>
          <span style="display:flex;align-items:center;gap:3px"><span style="width:8px;height:3px;background:var(--borderDark);border-radius:1px;opacity:.5"></span>Budget</span>
        </div>
      </div>
      <svg viewBox="0 0 520 180" style="width:100%;height:180px" id="revenueChart">
        <!-- Grid -->
        <line x1="40" y1="10" x2="500" y2="10" stroke="var(--borderLight)" stroke-width=".5"/>
        <line x1="40" y1="45" x2="500" y2="45" stroke="var(--borderLight)" stroke-width=".5"/>
        <line x1="40" y1="80" x2="500" y2="80" stroke="var(--borderLight)" stroke-width=".5"/>
        <line x1="40" y1="115" x2="500" y2="115" stroke="var(--borderLight)" stroke-width=".5"/>
        <line x1="40" y1="150" x2="500" y2="150" stroke="var(--borderLight)" stroke-width=".5"/>
        <!-- Y-axis labels (Revenue) -->
        <text x="36" y="14" font-size="7.5" fill="var(--textFaint)" font-family="'JetBrains Mono'" text-anchor="end">$12B</text>
        <text x="36" y="49" font-size="7.5" fill="var(--textFaint)" font-family="'JetBrains Mono'" text-anchor="end">$11.5B</text>
        <text x="36" y="84" font-size="7.5" fill="var(--textFaint)" font-family="'JetBrains Mono'" text-anchor="end">$11B</text>
        <text x="36" y="119" font-size="7.5" fill="var(--textFaint)" font-family="'JetBrains Mono'" text-anchor="end">$10.5B</text>
        <text x="36" y="154" font-size="7.5" fill="var(--textFaint)" font-family="'JetBrains Mono'" text-anchor="end">$10B</text>
        <!-- Y-axis right (Margin) -->
        <text x="504" y="14" font-size="7.5" fill="var(--green)" font-family="'JetBrains Mono'" text-anchor="start">62%</text>
        <text x="504" y="84" font-size="7.5" fill="var(--green)" font-family="'JetBrains Mono'" text-anchor="start">59%</text>
        <text x="504" y="154" font-size="7.5" fill="var(--green)" font-family="'JetBrains Mono'" text-anchor="start">56%</text>
        <!-- Area fill -->
        <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--coke)" stop-opacity=".12"/><stop offset="100%" stop-color="var(--coke)" stop-opacity="0"/></linearGradient></defs>
        <polygon points="86,140 178,118 270,92 362,72 454,22 454,150 86,150" fill="url(#ag)"/>
        <!-- Budget line -->
        <polyline points="86,135 178,112 270,88 362,68 454,38" fill="none" stroke="var(--borderDark)" stroke-width="1.2" stroke-dasharray="4 3" opacity=".5"/>
        <!-- Revenue line -->
        <polyline points="86,140 178,118 270,92 362,72 454,22" fill="none" stroke="var(--coke)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
        <!-- Margin overlay (dashed green) — maps 57.8% to 60.2% onto Y range -->
        <polyline points="86,128 178,105 270,78 362,56 454,18" fill="none" stroke="var(--green)" stroke-width="1.5" stroke-dasharray="6 3" stroke-linecap="round"/>
        <!-- Data points -->
        <circle cx="86" cy="140" r="3.5" fill="var(--surface)" stroke="var(--coke)" stroke-width="2"/>
        <circle cx="178" cy="118" r="3.5" fill="var(--surface)" stroke="var(--coke)" stroke-width="2"/>
        <circle cx="270" cy="92" r="3.5" fill="var(--surface)" stroke="var(--coke)" stroke-width="2"/>
        <circle cx="362" cy="72" r="3.5" fill="var(--surface)" stroke="var(--coke)" stroke-width="2"/>
        <circle cx="454" cy="22" r="4.5" fill="var(--coke)" stroke="var(--surface)" stroke-width="2"/>
        <!-- Value labels -->
        <text x="86" y="134" font-size="8" fill="var(--textDim)" font-weight="600" font-family="'JetBrains Mono'" text-anchor="middle">$10.1B</text>
        <text x="178" y="112" font-size="8" fill="var(--textDim)" font-weight="600" font-family="'JetBrains Mono'" text-anchor="middle">$10.5B</text>
        <text x="270" y="86" font-size="8" fill="var(--textDim)" font-weight="600" font-family="'JetBrains Mono'" text-anchor="middle">$10.9B</text>
        <text x="362" y="66" font-size="8" fill="var(--textDim)" font-weight="600" font-family="'JetBrains Mono'" text-anchor="middle">$11.2B</text>
        <text x="454" y="16" font-size="9" fill="var(--coke)" font-weight="800" font-family="'JetBrains Mono'" text-anchor="middle">$11.8B</text>
        <!-- Margin % labels -->
        <text x="86" y="122" font-size="7" fill="var(--green)" font-weight="600" font-family="'JetBrains Mono'" text-anchor="middle">57.8%</text>
        <text x="270" y="72" font-size="7" fill="var(--green)" font-weight="600" font-family="'JetBrains Mono'" text-anchor="middle">59.1%</text>
        <text x="454" y="12" font-size="7.5" fill="var(--green)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">60.2%</text>
        <!-- X-axis -->
        <text x="86" y="166" font-size="8" fill="var(--textFaint)" font-weight="500" text-anchor="middle">Q1 '25</text>
        <text x="178" y="166" font-size="8" fill="var(--textFaint)" font-weight="500" text-anchor="middle">Q2 '25</text>
        <text x="270" y="166" font-size="8" fill="var(--textFaint)" font-weight="500" text-anchor="middle">Q3 '25</text>
        <text x="362" y="166" font-size="8" fill="var(--textFaint)" font-weight="500" text-anchor="middle">Q4 '25</text>
        <text x="454" y="166" font-size="8" fill="var(--coke)" font-weight="700" text-anchor="middle">Q1 '26</text>
      </svg>
    </div>

    <!-- P&L Waterfall Chart -->
    <div class="card" style="padding:16px 18px">
      <div class="sl" style="margin-bottom:10px">P&amp;L Waterfall — Q1 2026 <span class="tag" style="background:var(--amberSoft);color:var(--amber)">$M</span></div>
      <svg viewBox="0 0 420 190" style="width:100%;height:190px">
        <!-- Baseline -->
        <line x1="30" y1="170" x2="400" y2="170" stroke="var(--borderLight)" stroke-width=".5"/>
        <!-- Connector lines (dashed) -->
        <line x1="88" y1="28" x2="108" y2="28" stroke="var(--borderDark)" stroke-width=".5" stroke-dasharray="2"/>
        <line x1="168" y1="76" x2="188" y2="76" stroke="var(--borderDark)" stroke-width=".5" stroke-dasharray="2"/>
        <line x1="248" y1="28" x2="268" y2="28" stroke="var(--borderDark)" stroke-width=".5" stroke-dasharray="2"/>
        <line x1="328" y1="58" x2="348" y2="58" stroke="var(--borderDark)" stroke-width=".5" stroke-dasharray="2"/>
        <!-- Revenue bar -->
        <rect x="40" y="28" width="48" height="142" rx="3" fill="var(--coke)" class="wf-bar" opacity=".85"/>
        <text x="64" y="22" font-size="8" fill="var(--coke)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">$11,800</text>
        <!-- COGS (negative, drops from revenue) -->
        <rect x="108" y="28" width="48" height="48" rx="3" fill="var(--red)" class="wf-bar" opacity=".75"/>
        <text x="132" y="22" font-size="7.5" fill="var(--red)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">($4,700)</text>
        <!-- Gross Profit (result) -->
        <rect x="188" y="76" width="48" height="94" rx="3" fill="var(--green)" class="wf-bar" opacity=".8"/>
        <text x="212" y="70" font-size="8" fill="var(--green)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">$7,100</text>
        <!-- SG&A + Other OpEx (negative) -->
        <rect x="268" y="28" width="48" height="30" rx="3" fill="var(--amber)" class="wf-bar" opacity=".75"/>
        <text x="292" y="22" font-size="7.5" fill="var(--amber)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">($2,920)</text>
        <rect x="268" y="58" width="48" height="18" rx="3" fill="var(--purple)" class="wf-bar" opacity=".65"/>
        <text x="292" y="90" font-size="6.5" fill="var(--purple)" font-weight="600" font-family="'JetBrains Mono'" text-anchor="middle">($780)</text>
        <!-- Operating Income -->
        <rect x="348" y="58" width="48" height="112" rx="3" fill="var(--blue)" class="wf-bar" opacity=".85"/>
        <text x="372" y="52" font-size="8.5" fill="var(--blue)" font-weight="800" font-family="'JetBrains Mono'" text-anchor="middle">$3,400</text>
        <!-- X labels -->
        <text x="64" y="184" font-size="8" fill="var(--textDim)" font-weight="600" text-anchor="middle">Revenue</text>
        <text x="132" y="184" font-size="8" fill="var(--textDim)" font-weight="600" text-anchor="middle">COGS</text>
        <text x="212" y="184" font-size="8" fill="var(--textDim)" font-weight="600" text-anchor="middle">Gross</text>
        <text x="292" y="184" font-size="8" fill="var(--textDim)" font-weight="600" text-anchor="middle">OpEx</text>
        <text x="372" y="184" font-size="8" fill="var(--textDim)" font-weight="700" text-anchor="middle">Op. Inc.</text>
      </svg>
    </div>
  </div>

  <!-- ROW 2: Segment Donut + YoY Grouped Bars + Brand Table -->
  <div style="display:grid;grid-template-columns:1fr 1.1fr 1fr;gap:14px;margin-bottom:16px">

    <!-- Revenue Mix Donut -->
    <div class="card" style="padding:16px 18px">
      <div class="sl">Revenue by Segment <span class="tag" style="background:var(--cokeSoft);color:var(--coke)">Q1</span></div>
      <div style="display:flex;align-items:center;gap:14px">
        <svg viewBox="0 0 140 140" style="width:120px;height:120px;flex-shrink:0">
          <!-- Donut segments (stroke-dasharray trick: circumference = 2π×50 ≈ 314) -->
          <!-- NA: 35.6% = 111.8 -->
          <circle cx="70" cy="70" r="50" fill="none" stroke="var(--coke)" stroke-width="18" stroke-dasharray="111.8 202.2" stroke-dashoffset="0" transform="rotate(-90 70 70)" class="donut-seg" opacity=".85"/>
          <!-- EMEA: 17.8% = 55.9 -->
          <circle cx="70" cy="70" r="50" fill="none" stroke="var(--amber)" stroke-width="18" stroke-dasharray="55.9 258.1" stroke-dashoffset="-111.8" transform="rotate(-90 70 70)" class="donut-seg" opacity=".8"/>
          <!-- LatAm: 13.6% = 42.7 -->
          <circle cx="70" cy="70" r="50" fill="none" stroke="var(--green)" stroke-width="18" stroke-dasharray="42.7 271.3" stroke-dashoffset="-167.7" transform="rotate(-90 70 70)" class="donut-seg" opacity=".8"/>
          <!-- APAC: 12.7% = 39.9 -->
          <circle cx="70" cy="70" r="50" fill="none" stroke="var(--purple)" stroke-width="18" stroke-dasharray="39.9 274.1" stroke-dashoffset="-210.4" transform="rotate(-90 70 70)" class="donut-seg" opacity=".75"/>
          <!-- Africa: 6.8% = 21.4 -->
          <circle cx="70" cy="70" r="50" fill="none" stroke="var(--cyan)" stroke-width="18" stroke-dasharray="21.4 292.6" stroke-dashoffset="-250.3" transform="rotate(-90 70 70)" class="donut-seg" opacity=".7"/>
          <!-- Global Ventures: 13.6% = 42.7 -->
          <circle cx="70" cy="70" r="50" fill="none" stroke="var(--textFaint)" stroke-width="18" stroke-dasharray="42.7 271.3" stroke-dashoffset="-271.7" transform="rotate(-90 70 70)" class="donut-seg" opacity=".5"/>
          <!-- Center text -->
          <text x="70" y="66" font-size="14" font-weight="800" fill="var(--text)" font-family="'JetBrains Mono'" text-anchor="middle">$11.8B</text>
          <text x="70" y="80" font-size="8" fill="var(--textFaint)" font-weight="600" text-anchor="middle">Total Rev.</text>
        </svg>
        <div style="display:flex;flex-direction:column;gap:5px;font-size:10px;flex:1">
          <div style="display:flex;justify-content:space-between"><span style="display:flex;align-items:center;gap:4px"><span style="width:6px;height:6px;border-radius:2px;background:var(--coke)"></span>N. America</span><span class="mono" style="font-weight:600">$4.2B</span></div>
          <div style="display:flex;justify-content:space-between"><span style="display:flex;align-items:center;gap:4px"><span style="width:6px;height:6px;border-radius:2px;background:var(--amber)"></span>EMEA</span><span class="mono" style="font-weight:600">$2.1B</span></div>
          <div style="display:flex;justify-content:space-between"><span style="display:flex;align-items:center;gap:4px"><span style="width:6px;height:6px;border-radius:2px;background:var(--green)"></span>LatAm</span><span class="mono" style="font-weight:600">$1.6B</span></div>
          <div style="display:flex;justify-content:space-between"><span style="display:flex;align-items:center;gap:4px"><span style="width:6px;height:6px;border-radius:2px;background:var(--purple)"></span>Asia Pac</span><span class="mono" style="font-weight:600">$1.5B</span></div>
          <div style="display:flex;justify-content:space-between"><span style="display:flex;align-items:center;gap:4px"><span style="width:6px;height:6px;border-radius:2px;background:var(--cyan)"></span>Africa</span><span class="mono" style="font-weight:600">$0.8B</span></div>
          <div style="display:flex;justify-content:space-between"><span style="display:flex;align-items:center;gap:4px"><span style="width:6px;height:6px;border-radius:2px;background:var(--textFaint)"></span>Global Vent.</span><span class="mono" style="font-weight:600">$1.6B</span></div>
        </div>
      </div>
    </div>

    <!-- YoY Segment Growth — Grouped Bar Chart -->
    <div class="card" style="padding:16px 18px">
      <div class="sl">Segment Growth YoY (%) <span class="tag" style="background:var(--greenSoft);color:var(--green)">Q1 vs Q1</span></div>
      <svg viewBox="0 0 360 150" style="width:100%;height:150px">
        <!-- Y axis grid -->
        <line x1="30" y1="10" x2="340" y2="10" stroke="var(--borderLight)" stroke-width=".5"/>
        <line x1="30" y1="40" x2="340" y2="40" stroke="var(--borderLight)" stroke-width=".5"/>
        <line x1="30" y1="70" x2="340" y2="70" stroke="var(--borderLight)" stroke-width=".5"/>
        <line x1="30" y1="100" x2="340" y2="100" stroke="var(--borderLight)" stroke-width=".5"/>
        <line x1="30" y1="130" x2="340" y2="130" stroke="var(--border)" stroke-width=".5"/>
        <text x="26" y="14" font-size="7" fill="var(--textFaint)" font-family="'JetBrains Mono'" text-anchor="end">+12%</text>
        <text x="26" y="44" font-size="7" fill="var(--textFaint)" font-family="'JetBrains Mono'" text-anchor="end">+9%</text>
        <text x="26" y="74" font-size="7" fill="var(--textFaint)" font-family="'JetBrains Mono'" text-anchor="end">+6%</text>
        <text x="26" y="104" font-size="7" fill="var(--textFaint)" font-family="'JetBrains Mono'" text-anchor="end">+3%</text>
        <text x="26" y="134" font-size="7" fill="var(--textFaint)" font-family="'JetBrains Mono'" text-anchor="end">0%</text>
        <!-- Bars: each group has Q1'25 (light) + Q1'26 (solid) -->
        <!-- NA: 4.8% → 6.2% -->
        <rect x="42" y="82" width="14" height="48" rx="2" fill="var(--coke)" opacity=".25"/>
        <rect x="58" y="68" width="14" height="62" rx="2" fill="var(--coke)" opacity=".85"/>
        <text x="57" y="62" font-size="7" fill="var(--coke)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">6.2%</text>
        <!-- EMEA: 3.1% → 4.2% -->
        <rect x="92" y="100" width="14" height="30" rx="2" fill="var(--amber)" opacity=".25"/>
        <rect x="108" y="94" width="14" height="36" rx="2" fill="var(--amber)" opacity=".85"/>
        <text x="107" y="88" font-size="7" fill="var(--amber)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">4.2%</text>
        <!-- LatAm: 6.4% → 8.1% -->
        <rect x="142" y="66" width="14" height="64" rx="2" fill="var(--green)" opacity=".25"/>
        <rect x="158" y="50" width="14" height="80" rx="2" fill="var(--green)" opacity=".85"/>
        <text x="157" y="44" font-size="7" fill="var(--green)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">8.1%</text>
        <!-- APAC: 2.5% → 3.6% -->
        <rect x="192" y="106" width="14" height="24" rx="2" fill="var(--purple)" opacity=".25"/>
        <rect x="208" y="96" width="14" height="34" rx="2" fill="var(--purple)" opacity=".85"/>
        <text x="207" y="90" font-size="7" fill="var(--purple)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">3.6%</text>
        <!-- Global V: 8.0% → 12.4% -->
        <rect x="242" y="54" width="14" height="76" rx="2" fill="var(--blue)" opacity=".25"/>
        <rect x="258" y="10" width="14" height="120" rx="2" fill="var(--blue)" opacity=".85"/>
        <text x="257" y="6" font-size="7" fill="var(--blue)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">12.4%</text>
        <!-- Bottling: -0.5% → -1.2% (below zero line) -->
        <rect x="292" y="130" width="14" height="5" rx="2" fill="var(--textFaint)" opacity=".25"/>
        <rect x="308" y="130" width="14" height="12" rx="2" fill="var(--red)" opacity=".7"/>
        <text x="307" y="150" font-size="7" fill="var(--red)" font-weight="700" font-family="'JetBrains Mono'" text-anchor="middle">-1.2%</text>
        <!-- X labels -->
        <text x="57" y="146" font-size="7" fill="var(--textDim)" font-weight="600" text-anchor="middle">NA</text>
        <text x="107" y="146" font-size="7" fill="var(--textDim)" font-weight="600" text-anchor="middle">EMEA</text>
        <text x="157" y="146" font-size="7" fill="var(--textDim)" font-weight="600" text-anchor="middle">LatAm</text>
        <text x="207" y="146" font-size="7" fill="var(--textDim)" font-weight="600" text-anchor="middle">APAC</text>
        <text x="257" y="146" font-size="7" fill="var(--textDim)" font-weight="600" text-anchor="middle">G.Vent</text>
        <text x="307" y="146" font-size="7" fill="var(--textDim)" font-weight="600" text-anchor="middle">Bottl.</text>
      </svg>
    </div>

    <!-- Brand Portfolio -->
    <div class="card" style="padding:16px 18px">
      <div class="sl">Brand Portfolio <span class="tag" style="background:var(--greenSoft);color:var(--green)">Top 5</span></div>
      <table class="tbl" style="margin:0 -10px;width:calc(100% + 20px)">
        <thead><tr><th>Brand</th><th style="text-align:right">Rev</th><th style="text-align:right">YoY</th></tr></thead>
        <tbody>
          <tr><td style="font-weight:600;color:var(--text)">Coca-Cola TM</td><td style="text-align:right" class="mono">$4.96B</td><td style="text-align:right;color:var(--green);font-weight:600" class="mono">+7.2%</td></tr>
          <tr><td style="font-weight:600;color:var(--text)">smartwater</td><td style="text-align:right" class="mono">$1.30B</td><td style="text-align:right;color:var(--green);font-weight:600" class="mono">+5.8%</td></tr>
          <tr><td style="font-weight:600;color:var(--text)">Monster</td><td style="text-align:right" class="mono">$1.06B</td><td style="text-align:right;color:var(--red);font-weight:600" class="mono">-2.1%</td></tr>
          <tr><td style="font-weight:600;color:var(--text)">Minute Maid</td><td style="text-align:right" class="mono">$944M</td><td style="text-align:right;color:var(--green);font-weight:600" class="mono">+14.1%</td></tr>
          <tr><td style="font-weight:600;color:var(--text)">Costa Coffee</td><td style="text-align:right" class="mono">$708M</td><td style="text-align:right;color:var(--green);font-weight:600" class="mono">+18.4%</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ROW 3: P&L Table + AI + Treasury + Close -->
  <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr .9fr;gap:14px;margin-bottom:16px">

    <!-- P&L Variance -->
    <div class="card" style="padding:16px 18px">
      <div class="sl">P&amp;L Variance <span class="tag" style="background:var(--amberSoft);color:var(--amber)">Budget vs Actual</span></div>
      <table class="tbl" style="margin:0 -10px;width:calc(100% + 20px)">
        <thead><tr><th>Line</th><th style="text-align:right">Budget</th><th style="text-align:right">Actual</th><th style="text-align:right">Var</th><th></th></tr></thead>
        <tbody>
          <tr><td style="font-weight:600;color:var(--text)">Revenue</td><td style="text-align:right" class="mono">$11,200</td><td style="text-align:right;font-weight:700;color:var(--text)" class="mono">$11,800</td><td style="text-align:right;color:var(--green);font-weight:600" class="mono">+$600</td><td><span class="tag" style="background:var(--greenSoft);color:var(--green)">F</span></td></tr>
          <tr><td style="font-weight:600;color:var(--text)">COGS</td><td style="text-align:right" class="mono">($4,560)</td><td style="text-align:right;font-weight:700;color:var(--text)" class="mono">($4,700)</td><td style="text-align:right;color:var(--red);font-weight:600" class="mono">($140)</td><td><span class="tag" style="background:var(--redSoft);color:var(--red)">U</span></td></tr>
          <tr><td style="font-weight:600;color:var(--text)">Gross</td><td style="text-align:right" class="mono">$6,640</td><td style="text-align:right;font-weight:700;color:var(--green)" class="mono">$7,100</td><td style="text-align:right;color:var(--green);font-weight:600" class="mono">+$460</td><td><span class="tag" style="background:var(--greenSoft);color:var(--green)">F</span></td></tr>
          <tr><td style="font-weight:600;color:var(--text)">SG&amp;A</td><td style="text-align:right" class="mono">($2,800)</td><td style="text-align:right;font-weight:700;color:var(--text)" class="mono">($2,920)</td><td style="text-align:right;color:var(--red);font-weight:600" class="mono">($120)</td><td><span class="tag" style="background:var(--redSoft);color:var(--red)">U</span></td></tr>
          <tr class="total"><td>Op. Income</td><td style="text-align:right" class="mono">$3,200</td><td style="text-align:right;color:var(--green)" class="mono">$3,400</td><td style="text-align:right;color:var(--green)" class="mono">+$200</td><td><span class="tag" style="background:var(--greenSoft);color:var(--green)">F</span></td></tr>
        </tbody>
      </table>
    </div>

    <!-- AI Copilot -->
    <div class="card" style="padding:16px 18px">
      <div class="sl" style="color:var(--purple)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2"><rect x="8" y="8" width="8" height="8" rx="1"/><path d="M4 12H2"/><path d="M22 12h-2"/><path d="M12 2v2"/><path d="M12 22v-2"/></svg>
        AI Copilot <span class="tag" style="background:var(--purpleSoft);color:var(--purple)">3 New</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="padding:8px 10px;border-radius:var(--r-sm);border:1px solid var(--borderLight);border-left:2px solid var(--amber);font-size:10.5px;color:var(--textSec);line-height:1.5">
          <strong style="color:var(--amber)">FX Alert</strong> — EUR/USD impacting EMEA ~$180M. Hedge adjustment recommended.
        </div>
        <div style="padding:8px 10px;border-radius:var(--r-sm);border:1px solid var(--borderLight);border-left:2px solid var(--green);font-size:10.5px;color:var(--textSec);line-height:1.5">
          <strong style="color:var(--green)">Margin</strong> — Costa at 68% GM, 4pts above plan. Scale EMEA → +$120M.
        </div>
        <div style="padding:8px 10px;border-radius:var(--r-sm);border:1px solid var(--borderLight);border-left:2px solid var(--coke);font-size:10.5px;color:var(--textSec);line-height:1.5">
          <strong style="color:var(--coke)">Risk</strong> — FEMSA LatAm data 2-day delayed. Close timeline at risk.
        </div>
      </div>
    </div>

    <!-- Treasury -->
    <div class="card" style="padding:16px 18px">
      <div class="sl">Treasury <span class="tag" style="background:var(--blueSoft);color:var(--blue)">Real-time</span></div>
      <div style="display:flex;flex-direction:column">
        <div class="metric-row"><span style="color:var(--textDim)">Cash &amp; Equiv.</span><span class="mono" style="font-weight:700;color:var(--text)">$9.4B</span></div>
        <div class="metric-row"><span style="color:var(--textDim)">ST Investments</span><span class="mono" style="font-weight:700;color:var(--text)">$2.1B</span></div>
        <div class="metric-row"><span style="color:var(--textDim)">Net Debt</span><span class="mono" style="font-weight:700;color:var(--amber)">$28.6B</span></div>
        <div class="metric-row"><span style="color:var(--textDim)">Debt / EBITDA</span><span class="mono" style="font-weight:700;color:var(--green)">2.4x</span></div>
        <div class="metric-row"><span style="color:var(--textDim)">Div. Yield</span><span class="mono" style="font-weight:700;color:var(--coke)">3.1%</span></div>
      </div>
    </div>

    <!-- Close Tasks -->
    <div class="card" style="padding:16px 18px">
      <div class="sl">Close <span class="tag" style="background:var(--greenSoft);color:var(--green)">89%</span></div>
      <div style="height:3px;border-radius:2px;background:var(--bg2);margin-bottom:8px;overflow:hidden"><div style="width:89%;height:100%;background:linear-gradient(90deg,var(--coke),var(--green));border-radius:2px"></div></div>
      <div style="display:flex;flex-direction:column">
        <div class="check-item"><span style="color:var(--green);font-size:10px">✓</span><span style="color:var(--textFaint);text-decoration:line-through;font-size:10px">Revenue cutoff</span></div>
        <div class="check-item"><span style="color:var(--green);font-size:10px">✓</span><span style="color:var(--textFaint);text-decoration:line-through;font-size:10px">Bottler consolidation</span></div>
        <div class="check-item"><span style="color:var(--green);font-size:10px">✓</span><span style="color:var(--textFaint);text-decoration:line-through;font-size:10px">FX adjustments</span></div>
        <div class="check-item"><span style="color:var(--green);font-size:10px">✓</span><span style="color:var(--textFaint);text-decoration:line-through;font-size:10px">IC eliminations</span></div>
        <div class="check-item"><span style="color:var(--amber);font-size:10px">○</span><span style="font-weight:600;font-size:10px">Tax provision</span><span class="tag" style="background:var(--amberSoft);color:var(--amber);margin-left:auto;font-size:7px">WIP</span></div>
        <div class="check-item"><span style="color:var(--coke);font-size:10px">○</span><span style="font-weight:600;font-size:10px">Final sign-off</span><span class="tag" style="background:var(--cokeSoft);color:var(--coke);margin-left:auto;font-size:7px">BLOCKED</span></div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--border);font-size:9px;color:var(--textFaint)">
    <div style="display:flex;align-items:center;gap:5px">
      <div style="width:14px;height:14px;border-radius:3px;background:var(--coke);display:flex;align-items:center;justify-content:center">
        <svg width="7" height="7" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="3.5" height="20" rx="1.5" fill="#fff" opacity=".95"/><rect x="3" y="2" width="16" height="3.2" rx="1.5" fill="#fff" opacity=".95"/></svg>
      </div>
      Powered by <strong style="color:var(--textDim)">FinanceOS</strong> Enterprise
    </div>
    <span>Confidential · The Coca-Cola Company · Generated Mar 25, 2026</span>
  </div>
</main>
</div>
` }} />
    </>
  );
}
