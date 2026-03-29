'use client';

import { useEffect, useRef } from 'react';

export default function V3SalesDealroomPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ═══ STATE ═══
const state = {
  sessionId: 'DR-' + Date.now().toString(36).toUpperCase(),
  clientEmail: '',
  clientName: '',
  selectedTpl: null,
  brandHex: '#5b9cf5',
  step: 0,
  audit: []
};

// ═══ AUDIT TRAIL ═══
function logAudit(action, color='blue') {
  const now = new Date();
  const ts = now.toLocaleTimeString('en-US',{hour12:false}) + '.' + String(now.getMilliseconds()).padStart(3,'0');
  state.audit.push({action, color, ts});
  const list = document.getElementById('auditList');
  if(list) {
    list.innerHTML = state.audit.map(a => \`
      <div class="audit-item">
        <div class="audit-dot \${a.color}"></div>
        <div class="audit-text"><strong>\${a.action}</strong><span class="audit-time">\${a.ts} · \${state.sessionId}</span></div>
      </div>
    \`).reverse().join('');
  }
}

// ═══ INVITE CODE ═══
const inputs = document.querySelectorAll('.code-input');
inputs.forEach((inp, i) => {
  inp.addEventListener('input', e => {
    inp.value = inp.value.toUpperCase();
    if(inp.value && i < inputs.length - 1) inputs[i+1].focus();
    checkCode();
  });
  inp.addEventListener('keydown', e => {
    if(e.key === 'Backspace' && !inp.value && i > 0) inputs[i-1].focus();
  });
});
inputs[0]?.focus();

function checkCode() {
  let code = '';
  inputs.forEach(i => code += i.value);
  const btn = document.getElementById('gateEnter');
  if(code.length === 6) btn.classList.add('ready');
  else btn.classList.remove('ready');
}

function verifyCode() {
  let code = '';
  inputs.forEach(i => code += i.value);
  if(code.length !== 6) return;

  const status = document.getElementById('codeStatus');
  status.className = 'code-status verifying';
  status.textContent = 'Verifying access code...';
  inputs.forEach(i => i.disabled = true);

  setTimeout(() => {
    // Accept any 6-char code for demo
    inputs.forEach(i => i.classList.add('success'));
    status.className = 'code-status success';
    status.textContent = 'Access verified — entering deal room...';

    logAudit('Access code verified: ' + code, 'green');

    // Derive client name from code (in production this comes from DB)
    state.clientName = 'Invited Client';
    state.clientEmail = 'client@company.com';

    setTimeout(() => {
      document.getElementById('gate').classList.add('dismissed');
      document.getElementById('app').classList.add('active');
      document.getElementById('auditToggle').style.display = 'flex';
      document.getElementById('clientName').textContent = state.clientName;
      document.getElementById('sessionId').textContent = state.sessionId;

      // Set watermarks
      const wmText = state.clientEmail + ' · ' + state.sessionId;
      for(let i=1;i<=6;i++){
        const el=document.getElementById('wm'+i);
        if(el) el.textContent = wmText;
      }

      logAudit('Deal room session opened', 'blue');
      logAudit('MSA document loaded (v3.2.1)', 'blue');
    }, 800);
  }, 1500);
}

// ═══ SECURITY CHECKLIST ═══
function toggleCheck(el) {
  setTimeout(() => {
    el.classList.toggle('checked', el.querySelector('input').checked);
    checkMSAComplete();
  }, 10);
}

function checkMSAComplete() {
  const checks = document.querySelectorAll('.sec-check input');
  const allChecked = Array.from(checks).every(c => c.checked);
  const signed = document.getElementById('sigCanvas').classList.contains('signed');
  document.getElementById('btn1').disabled = !(allChecked && signed);
}

function signDocument() {
  const canvas = document.getElementById('sigCanvas');
  if(canvas.classList.contains('signed')) return;
  const name = state.clientName || 'Authorized Signatory';
  document.getElementById('sigText').textContent = name;
  canvas.classList.add('signed');
  const now = new Date();
  document.getElementById('sigDate').textContent = 'Date: ' + now.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  document.getElementById('sigIP').textContent = 'Session: ' + state.sessionId;
  logAudit('MSA electronically signed by ' + name, 'green');
  logAudit('Security questionnaire completed (5/5)', 'green');
  checkMSAComplete();
}

// ═══ TEMPLATE SELECTION ═══
function selectTpl(card, id) {
  document.querySelectorAll('.tpl-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  state.selectedTpl = id;
  document.getElementById('btn2').disabled = false;
  logAudit('Template selected: ' + card.querySelector('.tpl-name').textContent, 'purple');
}

// ═══ CUSTOMIZER ═══
function pickColor(el, hex) {
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('sel'));
  el.classList.add('sel');
  state.brandHex = hex;
  document.getElementById('hexInput').value = hex;
}

// ═══ STEP NAVIGATION ═══
function goStep(n) {
  // Update stepper
  for(let i=1;i<=4;i++){
    const s = document.getElementById('s'+i);
    s.classList.remove('active','done');
    if(i < n) s.classList.add('done');
    else if(i === n) s.classList.add('active');
  }
  // Show panel
  for(let i=1;i<=4;i++){
    document.getElementById('p'+i).classList.remove('active');
  }
  document.getElementById('p'+n).classList.add('active');
  state.step = n;
  window.scrollTo({top:0,behavior:'smooth'});

  const labels = ['','Agreement','Template Selection','Configuration','Proposal'];
  logAudit('Navigated to Step ' + n + ': ' + labels[n], 'blue');

  // Populate proposal on step 4
  if(n === 4) buildProposal();
}

function buildProposal() {
  const tplNames = {exec:'Executive Command Center',glass:'CFO Glass Dashboard',treasury:'Treasury & Cash Flow',multi:'Multi-Entity Consolidation',startup:'Startup Metrics',pe:'PE / VC Portfolio'};
  document.getElementById('propTpl').textContent = tplNames[state.selectedTpl] || '—';
  document.getElementById('propColor').innerHTML = \`<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:3px;background:\${state.brandHex};display:inline-block"></span>\${state.brandHex}</span>\`;

  const mods = [];
  document.querySelectorAll('.mod-row').forEach(r => {
    if(r.querySelector('.tog.on')) mods.push(r.querySelector('.mod-name').textContent);
  });
  document.getElementById('propMods').textContent = mods.join(', ') || 'None selected';
  document.getElementById('proposalId').textContent = 'PROP-' + Date.now().toString(36).toUpperCase();
}

// ═══ APPROVE & DELIVER ═══
async function approveProposal() {
  logAudit('Proposal approved — generating private link', 'green');

  const proposalView = document.getElementById('proposalView');
  const deliveryView = document.getElementById('deliveryView');

  // Brief processing
  proposalView.style.opacity = '.3';
  proposalView.style.pointerEvents = 'none';
  await new Promise(r => setTimeout(r, 2000));

  proposalView.style.display = 'none';
  deliveryView.style.display = 'block';

  const slug = state.selectedTpl + '-' + Math.random().toString(36).substr(2,8);
  document.getElementById('delUrl').textContent = 'portal.finance-os.app/install/' + slug;

  logAudit('Private install link generated: /install/' + slug, 'green');
  logAudit('Link delivered to ' + state.clientEmail, 'green');
  logAudit('Deal room session complete', 'green');

  // Mark step 4 done
  document.getElementById('s4').classList.remove('active');
  document.getElementById('s4').classList.add('done');
}

function copyLink() {
  const url = document.getElementById('delUrl').textContent;
  navigator.clipboard?.writeText('https://' + url);
  const el = document.getElementById('delUrl');
  const orig = el.textContent;
  el.textContent = 'Copied to clipboard';
  setTimeout(() => el.textContent = orig, 1500);
}`
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
--bg:#060810;--surface:#0c1018;--card:#111620;--card2:#161d2c;
--border:#1a2035;--border2:#242e48;--text:#e2e8f0;--dim:#7b859c;--muted:#4e5670;
--accent:#5b9cf5;--green:#34d399;--red:#f87171;--amber:#fbbf24;--purple:#a78bfa;--pink:#f472b6;--cyan:#22d3ee;
--radius:12px;--ease:cubic-bezier(.4,0,.2,1);
}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh;overflow-x:hidden}
::selection{background:rgba(91,156,245,.25)}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

/* ═══════════════════════════════════════════════════
   STEP 0: INVITE CODE GATE
   ═══════════════════════════════════════════════════ */
.gate{position:fixed;inset:0;z-index:600;background:var(--bg);display:flex;align-items:center;justify-content:center;transition:opacity .8s var(--ease),visibility .8s}
.gate.dismissed{opacity:0;visibility:hidden;pointer-events:none}
.gate-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.gate-bg .orb{position:absolute;border-radius:50%;filter:blur(100px);opacity:.07;animation:orbFloat 20s ease-in-out infinite}
.gate-bg .orb:nth-child(1){width:500px;height:500px;background:var(--accent);top:-10%;left:-5%;animation-delay:0s}
.gate-bg .orb:nth-child(2){width:400px;height:400px;background:var(--purple);bottom:-10%;right:-5%;animation-delay:-7s}
.gate-bg .orb:nth-child(3){width:300px;height:300px;background:var(--green);top:40%;right:30%;animation-delay:-14s}
@keyframes orbFloat{0%,100%{transform:translate(0,0)}25%{transform:translate(30px,-20px)}50%{transform:translate(-20px,30px)}75%{transform:translate(20px,20px)}}

.gate-panel{position:relative;z-index:1;width:100%;max-width:480px;padding:48px;text-align:center}
.gate-logo{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:48px}
.gate-logo svg{width:36px;height:36px}
.gate-logo span{font-size:22px;font-weight:800;background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gate-shield{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,rgba(91,156,245,.06),rgba(167,139,250,.06));border:1px solid rgba(91,156,245,.12);display:flex;align-items:center;justify-content:center;margin:0 auto 28px}
.gate-shield svg{width:32px;height:32px;stroke:var(--accent);fill:none;stroke-width:1.5}
.gate h2{font-size:24px;font-weight:800;margin-bottom:8px;letter-spacing:-.3px}
.gate .gate-sub{font-size:14px;color:var(--dim);margin-bottom:36px;line-height:1.7}

/* Code input */
.code-input-wrap{display:flex;gap:8px;justify-content:center;margin-bottom:24px}
.code-input{width:48px;height:56px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:22px;font-weight:800;text-align:center;outline:none;transition:all .2s var(--ease);letter-spacing:2px;caret-color:var(--accent)}
.code-input:focus{border-color:var(--accent);background:var(--card2);box-shadow:0 0 0 3px rgba(91,156,245,.1)}
.code-input.error{border-color:var(--red);animation:shake .4s ease}
.code-input.success{border-color:var(--green);background:rgba(52,211,153,.06)}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}

.code-status{font-size:12px;min-height:18px;margin-bottom:20px;transition:all .2s}
.code-status.error{color:var(--red)}
.code-status.success{color:var(--green)}
.code-status.verifying{color:var(--accent)}

.gate-enter{width:100%;padding:14px;border-radius:var(--radius);font-size:15px;font-weight:700;border:none;cursor:pointer;background:var(--card2);border:1px solid var(--border);color:var(--muted);transition:all .25s var(--ease);display:flex;align-items:center;justify-content:center;gap:10px;pointer-events:none}
.gate-enter.ready{background:linear-gradient(135deg,var(--accent),var(--purple));border-color:transparent;color:#fff;pointer-events:auto}
.gate-enter.ready:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(91,156,245,.25)}

.gate-footer{margin-top:36px;display:flex;flex-direction:column;align-items:center;gap:12px}
.gate-sec{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted)}
.gate-sec svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2}
.gate-contact{font-size:12px;color:var(--dim)}
.gate-contact a{color:var(--accent);text-decoration:none}
.gate-contact a:hover{text-decoration:underline}

/* ═══════════════════════════════════════════════════
   STEP 1: MSA + SECURITY QUESTIONNAIRE
   ═══════════════════════════════════════════════════ */
.onboard{display:none;min-height:100vh}
.onboard.active{display:block}

.onboard-nav{display:flex;align-items:center;justify-content:space-between;padding:14px 32px;border-bottom:1px solid var(--border);background:var(--surface);position:sticky;top:0;z-index:100;backdrop-filter:blur(16px)}
.onboard-logo{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:800}
.onboard-logo svg{width:24px;height:24px}
.onboard-logo span{background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.onboard-client{display:flex;align-items:center;gap:10px}
.client-name{font-size:13px;font-weight:600}
.client-badge{padding:4px 12px;border-radius:16px;font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;background:rgba(52,211,153,.08);color:var(--green);border:1px solid rgba(52,211,153,.12)}
.session-id{font-size:10px;color:var(--muted);font-family:monospace}

/* Stepper */
.stepper{display:flex;align-items:center;justify-content:center;gap:0;padding:32px 32px 28px;max-width:800px;margin:0 auto}
.step-item{display:flex;align-items:center;gap:0}
.step-node{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;border:2px solid var(--border);color:var(--muted);background:var(--card);transition:all .3s var(--ease);position:relative;flex-shrink:0}
.step-node svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.5}
.step-line{width:80px;height:2px;background:var(--border);transition:background .3s var(--ease)}
.step-item.active .step-node{border-color:var(--accent);color:var(--accent);background:rgba(91,156,245,.08);box-shadow:0 0 0 4px rgba(91,156,245,.08)}
.step-item.done .step-node{border-color:var(--green);color:var(--green);background:rgba(52,211,153,.08)}
.step-item.done .step-line{background:var(--green)}
.step-label{position:absolute;top:calc(100% + 6px);left:50%;transform:translateX(-50%);font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;color:var(--muted);transition:color .3s}
.step-item.active .step-label{color:var(--accent)}
.step-item.done .step-label{color:var(--green)}

/* Panels */
.panel{display:none;max-width:720px;margin:0 auto;padding:0 32px 60px}
.panel.active{display:block;animation:panelIn .4s var(--ease)}
@keyframes panelIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.panel-title{font-size:22px;font-weight:800;margin-bottom:6px}
.panel-sub{font-size:14px;color:var(--dim);margin-bottom:28px;line-height:1.7}

/* Form elements */
.form-group{margin-bottom:18px}
.form-label{display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:6px}
.form-input,.form-select,.form-textarea{width:100%;padding:11px 14px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--accent)}
.form-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b859c' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px}
.form-textarea{resize:vertical;min-height:80px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}

/* MSA document viewer */
.doc-viewer{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);max-height:280px;overflow-y:auto;padding:24px 28px;margin-bottom:20px;font-size:12px;color:var(--dim);line-height:1.9}
.doc-viewer h4{color:var(--text);font-size:14px;margin:16px 0 8px;font-weight:700}
.doc-viewer h4:first-child{margin-top:0}
.doc-viewer .cls-tag{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;vertical-align:middle;margin-left:8px}
.cls-confidential{background:rgba(248,113,113,.08);color:var(--red);border:1px solid rgba(248,113,113,.15)}
.cls-restricted{background:rgba(251,191,36,.08);color:var(--amber);border:1px solid rgba(251,191,36,.15)}
.cls-internal{background:rgba(91,156,245,.08);color:var(--accent);border:1px solid rgba(91,156,245,.15)}

/* Security questionnaire checkboxes */
.sec-checklist{display:flex;flex-direction:column;gap:8px;margin-bottom:24px}
.sec-check{display:flex;align-items:flex-start;gap:12px;padding:12px 16px;border-radius:10px;background:var(--card);border:1px solid var(--border);cursor:pointer;transition:all .2s var(--ease)}
.sec-check:hover{border-color:var(--border2)}
.sec-check.checked{border-color:rgba(52,211,153,.2);background:rgba(52,211,153,.02)}
.sec-check input{margin-top:2px;accent-color:var(--green);width:16px;height:16px;flex-shrink:0}
.sec-check .check-text{font-size:13px;line-height:1.5}
.sec-check .check-text strong{color:var(--text)}
.sec-check .check-sub{font-size:11px;color:var(--muted);display:block;margin-top:2px}

/* Signature block */
.sig-block{padding:24px;border-radius:var(--radius);background:var(--card);border:1px solid var(--border);margin-bottom:20px}
.sig-block .sig-label{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);font-weight:600;margin-bottom:12px}
.sig-canvas{width:100%;height:80px;border-radius:8px;border:1px dashed var(--border2);background:var(--surface);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}
.sig-canvas:hover{border-color:var(--accent);background:rgba(91,156,245,.02)}
.sig-canvas.signed{border-style:solid;border-color:var(--green);background:rgba(52,211,153,.02)}
.sig-canvas .sig-text{font-size:24px;font-family:'Georgia',serif;font-style:italic;color:var(--text);opacity:0}
.sig-canvas.signed .sig-text{opacity:1}
.sig-canvas .sig-placeholder{font-size:12px;color:var(--muted);display:flex;align-items:center;gap:6px}
.sig-canvas.signed .sig-placeholder{display:none}
.sig-canvas .sig-placeholder svg{width:16px;height:16px;stroke:var(--muted);fill:none;stroke-width:2}
.sig-meta{display:flex;justify-content:space-between;margin-top:10px;font-size:11px;color:var(--muted)}

/* Navigation buttons */
.panel-nav{display:flex;justify-content:space-between;align-items:center;margin-top:32px;padding-top:24px;border-top:1px solid var(--border)}
.btn{padding:11px 22px;border-radius:10px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all .25s var(--ease);display:inline-flex;align-items:center;gap:8px}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--purple));color:#fff}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(91,156,245,.25)}
.btn-primary:disabled{opacity:.4;pointer-events:none;transform:none;box-shadow:none}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--dim)}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
.btn svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2}

/* ═══════════════════════════════════════════════════
   STEP 2: DEAL ROOM — TEMPLATE SELECTION
   ═══════════════════════════════════════════════════ */
.tpl-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:24px}
.tpl-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;cursor:pointer;transition:all .3s var(--ease);position:relative}
.tpl-card:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3)}
.tpl-card.selected{border-color:var(--accent);box-shadow:0 0 0 2px rgba(91,156,245,.15)}
.tpl-card .tpl-preview{height:140px;position:relative;border-bottom:1px solid var(--border);overflow:hidden}
.tpl-card .tpl-body{padding:14px 16px}
.tpl-card .tpl-name{font-size:14px;font-weight:700;margin-bottom:2px}
.tpl-card .tpl-desc{font-size:11px;color:var(--dim);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.tpl-card .tpl-cls{position:absolute;top:8px;right:8px}
.tpl-check{position:absolute;top:8px;left:8px;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);border:2px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;transition:all .2s}
.tpl-card.selected .tpl-check{background:var(--accent);border-color:var(--accent)}
.tpl-card.selected .tpl-check svg{opacity:1}
.tpl-check svg{width:14px;height:14px;stroke:#fff;fill:none;stroke-width:3;opacity:0;transition:opacity .2s}

/* Watermark overlay */
.watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2}
.watermark span{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.06);transform:rotate(-25deg);white-space:nowrap}

/* Mini dashboards */
.mini-dash{width:100%;height:100%;padding:8px;display:grid;gap:4px}
.md-exec{grid-template-columns:1fr 1fr 1fr 1fr;grid-template-rows:1fr 1fr;background:linear-gradient(135deg,#0c1017,#131a28)}
.md-exec .mk{border-radius:4px;background:rgba(91,156,245,.05);border:1px solid rgba(91,156,245,.08);display:flex;flex-direction:column;align-items:center;justify-content:center}
.md-exec .mk .v{font-size:11px;font-weight:800;color:var(--accent)}.md-exec .mk .l{font-size:6px;color:var(--muted)}
.md-exec .mc{grid-column:1/3;border-radius:4px;background:rgba(91,156,245,.03);border:1px solid rgba(30,37,64,.4);position:relative;overflow:hidden}
.md-exec .mc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(0deg,rgba(91,156,245,.1),transparent);clip-path:polygon(0 80%,15% 50%,30% 65%,45% 30%,60% 50%,75% 20%,90% 40%,100% 25%,100% 100%,0 100%)}
.md-exec .mt{grid-column:3/5;border-radius:4px;background:rgba(30,37,64,.15);border:1px solid rgba(30,37,64,.3);padding:6px}
.md-exec .mr{height:6px;background:rgba(91,156,245,.05);border-radius:2px;margin-bottom:3px}.md-exec .mr:nth-child(even){width:80%}

.md-glass{grid-template-columns:60px 1fr;background:linear-gradient(135deg,#0d1220,#1a1040)}
.md-glass .ms{border-radius:6px;background:rgba(167,139,250,.05);border:1px solid rgba(167,139,250,.1);padding:6px 4px;display:flex;flex-direction:column;gap:3px}
.md-glass .ms .ni{height:5px;border-radius:3px;background:rgba(167,139,250,.08)}.md-glass .ms .ni.a{background:rgba(167,139,250,.2)}
.md-glass .mm{display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:36px 1fr;gap:4px}
.md-glass .gk{border-radius:4px;background:rgba(255,255,255,.02);border:1px solid rgba(167,139,250,.08);display:flex;flex-direction:column;align-items:center;justify-content:center}
.md-glass .gk .v{font-size:10px;font-weight:800;color:var(--purple)}.md-glass .gk .l{font-size:5px;color:var(--muted)}
.md-glass .gw{grid-column:1/4;border-radius:4px;background:rgba(167,139,250,.03);border:1px solid rgba(167,139,250,.06);position:relative;overflow:hidden}
.md-glass .gw::after{content:'';position:absolute;bottom:0;left:0;right:0;height:65%;background:linear-gradient(0deg,rgba(167,139,250,.12),transparent);clip-path:polygon(0 60%,10% 45%,20% 55%,30% 30%,40% 45%,50% 20%,60% 35%,70% 15%,80% 30%,90% 10%,100% 22%,100% 100%,0 100%)}

.md-treasury{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;background:linear-gradient(135deg,#0a0f18,#0d1a1a)}
.md-treasury .tc{border-radius:4px;background:rgba(34,211,238,.03);border:1px solid rgba(34,211,238,.06);position:relative;overflow:hidden}
.md-treasury .tc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:65%;background:linear-gradient(0deg,rgba(34,211,238,.08),transparent);clip-path:polygon(0 50%,20% 65%,40% 30%,60% 55%,80% 20%,100% 40%,100% 100%,0 100%)}
.md-treasury .tg{border-radius:4px;background:rgba(34,211,238,.02);border:1px solid rgba(34,211,238,.05);display:flex;align-items:center;justify-content:center}
.md-treasury .tg .ring{width:36px;height:36px;border-radius:50%;border:3px solid rgba(34,211,238,.1);border-top-color:var(--cyan);transform:rotate(45deg)}
.md-treasury .tk{border-radius:4px;background:rgba(34,211,238,.02);border:1px solid rgba(34,211,238,.05);display:grid;grid-template-columns:1fr 1fr;gap:3px;padding:4px}
.md-treasury .tkk{border-radius:3px;background:rgba(34,211,238,.04);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2px}
.md-treasury .tkk .v{font-size:9px;font-weight:800;color:var(--cyan)}.md-treasury .tkk .l{font-size:5px;color:var(--muted)}
.md-treasury .tl{border-radius:4px;background:rgba(34,211,238,.02);border:1px solid rgba(34,211,238,.05);padding:6px;display:flex;flex-direction:column;gap:3px}
.md-treasury .tl .tr{height:5px;border-radius:2px;background:rgba(34,211,238,.05)}.md-treasury .tl .tr:nth-child(odd){width:85%}

.md-multi{grid-template-columns:1fr;grid-template-rows:24px auto 1fr;background:linear-gradient(135deg,#0c0f18,#141020)}
.md-multi .tabs{display:flex;gap:3px;padding:3px;border-radius:6px;background:rgba(251,191,36,.02);border:1px solid rgba(251,191,36,.06)}
.md-multi .tabs .tab{flex:1;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:6px;font-weight:600;color:var(--muted)}
.md-multi .tabs .tab.a{background:rgba(251,191,36,.1);color:var(--amber)}
.md-multi .kps{display:grid;grid-template-columns:repeat(5,1fr);gap:3px}
.md-multi .kp{border-radius:4px;background:rgba(251,191,36,.03);border:1px solid rgba(251,191,36,.05);padding:4px;text-align:center}
.md-multi .kp .v{font-size:9px;font-weight:800;color:var(--amber)}.md-multi .kp .l{font-size:5px;color:var(--muted)}
.md-multi .chart{border-radius:4px;background:rgba(251,191,36,.02);border:1px solid rgba(251,191,36,.05);position:relative;overflow:hidden}
.md-multi .chart::after{content:'';position:absolute;bottom:0;left:0;right:0;height:70%;background:linear-gradient(0deg,rgba(251,191,36,.08),transparent);clip-path:polygon(0 70%,15% 45%,30% 60%,45% 30%,60% 50%,75% 20%,90% 35%,100% 25%,100% 100%,0 100%)}

.md-startup{grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:6px;padding:12px;background:linear-gradient(135deg,#0e1118,#121620)}
.md-startup .sc{border-radius:6px;background:rgba(52,211,153,.03);border:1px solid rgba(52,211,153,.06);display:flex;flex-direction:column;align-items:center;justify-content:center}
.md-startup .sc .v{font-size:13px;font-weight:800;color:var(--green)}.md-startup .sc .l{font-size:6px;color:var(--muted)}
.md-startup .sw{grid-column:1/4;border-radius:6px;background:rgba(52,211,153,.02);border:1px solid rgba(52,211,153,.05);position:relative;overflow:hidden}
.md-startup .sw::after{content:'';position:absolute;bottom:0;left:0;right:0;height:50%;background:linear-gradient(0deg,rgba(52,211,153,.06),transparent);clip-path:polygon(0 80%,20% 40%,40% 60%,60% 20%,80% 50%,100% 10%,100% 100%,0 100%)}

.md-pe{grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:4px;background:linear-gradient(135deg,#10080c,#1a0c18)}
.md-pe .pc{border-radius:4px;background:rgba(244,114,182,.03);border:1px solid rgba(244,114,182,.06);display:flex;flex-direction:column;align-items:center;justify-content:center}
.md-pe .pc .v{font-size:11px;font-weight:800;color:var(--pink)}.md-pe .pc .l{font-size:5px;color:var(--muted)}
.md-pe .pb{grid-column:1/4;border-radius:4px;background:rgba(244,114,182,.02);border:1px solid rgba(244,114,182,.05);display:grid;grid-template-columns:repeat(6,1fr);gap:3px;padding:6px;align-items:end}
.md-pe .pb .bar{border-radius:2px 2px 0 0;background:rgba(244,114,182,.12);width:100%}
.md-pe .pb .bar:nth-child(1){height:35%}.md-pe .pb .bar:nth-child(2){height:55%}.md-pe .pb .bar:nth-child(3){height:75%}.md-pe .pb .bar:nth-child(4){height:50%}.md-pe .pb .bar:nth-child(5){height:85%}.md-pe .pb .bar:nth-child(6){height:60%}

/* ═══════════════════════════════════════════════════
   STEP 3: CUSTOMIZER
   ═══════════════════════════════════════════════════ */
.custom-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
.custom-card{padding:20px;border-radius:var(--radius);background:var(--card);border:1px solid var(--border)}
.custom-card h4{font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.custom-card h4 svg{width:16px;height:16px;stroke:var(--accent);fill:none;stroke-width:2}
.color-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
.swatch{width:100%;aspect-ratio:1;border-radius:6px;cursor:pointer;border:2px solid transparent;transition:all .15s var(--ease)}
.swatch:hover{transform:scale(1.1)}.swatch.sel{border-color:#fff;box-shadow:0 0 10px rgba(255,255,255,.15)}
.mod-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(30,37,64,.25)}
.mod-row:last-child{border:none}
.mod-name{font-size:13px}.mod-sub{font-size:10px;color:var(--muted)}
.tog{width:36px;height:18px;border-radius:9px;background:var(--border);position:relative;cursor:pointer;transition:background .2s;flex-shrink:0}
.tog.on{background:var(--green)}
.tog::after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .2s}
.tog.on::after{transform:translateX(18px)}

/* ═══════════════════════════════════════════════════
   STEP 4: PROPOSAL + PRIVATE LINK
   ═══════════════════════════════════════════════════ */
.proposal{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:24px}
.proposal-header{padding:24px 28px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.proposal-header h3{font-size:16px;font-weight:700;display:flex;align-items:center;gap:8px}
.proposal-body{padding:24px 28px}
.prop-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(30,37,64,.25);font-size:13px}
.prop-row:last-child{border:none}
.prop-row .prop-label{color:var(--dim)}.prop-row .prop-value{font-weight:600}
.prop-total{display:flex;justify-content:space-between;padding:16px 28px;background:rgba(52,211,153,.04);border-top:1px solid rgba(52,211,153,.1);font-size:15px;font-weight:700}
.prop-total .total-val{color:var(--green)}

/* Success / link delivery */
.delivery{text-align:center;padding:40px 0}
.delivery .del-ring{width:80px;height:80px;border-radius:50%;background:rgba(52,211,153,.06);border:3px solid var(--green);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;animation:ringPop .5s var(--ease)}
.delivery .del-ring svg{width:36px;height:36px;stroke:var(--green);fill:none;stroke-width:2}
@keyframes ringPop{from{transform:scale(0);opacity:0}60%{transform:scale(1.1)}to{transform:scale(1);opacity:1}}
.delivery h2{font-size:22px;font-weight:800;margin-bottom:8px}
.delivery .del-sub{font-size:14px;color:var(--dim);margin-bottom:24px;line-height:1.7}
.del-link{display:inline-flex;align-items:center;gap:10px;padding:14px 24px;border-radius:var(--radius);background:linear-gradient(135deg,rgba(52,211,153,.06),rgba(91,156,245,.06));border:1px solid rgba(52,211,153,.15);font-size:14px;font-weight:700;color:var(--green);font-family:'SF Mono','Fira Code',monospace;cursor:pointer;transition:all .2s;margin-bottom:8px}
.del-link:hover{background:linear-gradient(135deg,rgba(52,211,153,.12),rgba(91,156,245,.12));transform:translateY(-1px)}
.del-link svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;flex-shrink:0}
.del-meta{display:flex;justify-content:center;gap:16px;margin-top:16px;flex-wrap:wrap}
.del-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:8px;font-size:10px;font-weight:600}
.del-tag.red{background:rgba(248,113,113,.06);color:var(--red);border:1px solid rgba(248,113,113,.1)}
.del-tag.green{background:rgba(52,211,153,.06);color:var(--green);border:1px solid rgba(52,211,153,.1)}
.del-tag svg{width:11px;height:11px;stroke:currentColor;fill:none;stroke-width:2}

/* ═══════════════════════════════════════════════════
   AUDIT TRAIL SIDEBAR
   ═══════════════════════════════════════════════════ */
.audit-toggle{position:fixed;bottom:20px;right:20px;z-index:90;width:40px;height:40px;border-radius:50%;background:var(--card);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}
.audit-toggle:hover{border-color:var(--accent);background:var(--card2)}
.audit-toggle svg{width:18px;height:18px;stroke:var(--dim);fill:none;stroke-width:2}
.audit-panel{position:fixed;bottom:20px;right:20px;z-index:91;width:320px;max-height:400px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 12px 40px rgba(0,0,0,.5);overflow:hidden;display:none}
.audit-panel.open{display:block;animation:panelIn .3s var(--ease)}
.audit-head{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.audit-head span{font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px}
.audit-head span svg{width:14px;height:14px;stroke:var(--accent);fill:none;stroke-width:2}
.audit-close{width:24px;height:24px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer}
.audit-close svg{width:12px;height:12px;stroke:var(--dim);fill:none;stroke-width:2}
.audit-list{padding:12px 16px;max-height:320px;overflow-y:auto}
.audit-item{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid rgba(30,37,64,.2)}
.audit-item:last-child{border:none}
.audit-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
.audit-dot.blue{background:var(--accent)}.audit-dot.green{background:var(--green)}.audit-dot.amber{background:var(--amber)}.audit-dot.purple{background:var(--purple)}
.audit-text{font-size:11px;line-height:1.5;color:var(--dim)}
.audit-text strong{color:var(--text);font-weight:600}
.audit-time{font-size:9px;color:var(--muted);display:block;margin-top:2px;font-family:monospace}

@media(max-width:768px){
.gate-panel{padding:32px 24px}.code-input{width:40px;height:48px;font-size:18px}
.form-row{grid-template-columns:1fr}.tpl-grid{grid-template-columns:1fr}
.custom-grid{grid-template-columns:1fr}.stepper{gap:0;padding:24px 16px}
.step-line{width:40px}.panel{padding:0 16px 40px}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- ═══ STEP 0: INVITE CODE GATE ═══ -->
<div class="gate" id="gate">
<div class="gate-bg"><div class="orb"></div><div class="orb"></div><div class="orb"></div></div>
<div class="gate-panel">
<div class="gate-logo">
<svg viewBox="0 0 36 36" fill="none"><rect x="3" y="3" width="30" height="30" rx="8" stroke="url(#gl)" stroke-width="2.5"/><path d="M11 24V16M16 24V13M21 24V18M26 24V10" stroke="url(#gl)" stroke-width="2.5" stroke-linecap="round"/><defs><linearGradient id="gl" x1="0" y1="0" x2="36" y2="36"><stop stop-color="#5b9cf5"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs></svg>
<span>FinanceOS</span>
</div>
<div class="gate-shield"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
<h2>Secure Client Deal Room</h2>
<p class="gate-sub">This is a private, invitation-only portal. Enter the access code provided by your FinanceOS account executive to continue.</p>

<div class="code-input-wrap" id="codeWrap">
<input class="code-input" maxlength="1" data-idx="0" autocomplete="off">
<input class="code-input" maxlength="1" data-idx="1" autocomplete="off">
<input class="code-input" maxlength="1" data-idx="2" autocomplete="off">
<span style="color:var(--border);font-size:20px;display:flex;align-items:center">—</span>
<input class="code-input" maxlength="1" data-idx="3" autocomplete="off">
<input class="code-input" maxlength="1" data-idx="4" autocomplete="off">
<input class="code-input" maxlength="1" data-idx="5" autocomplete="off">
</div>
<div class="code-status" id="codeStatus"></div>

<button class="gate-enter" id="gateEnter" onclick="verifyCode()">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
Enter Deal Room
</button>

<div class="gate-footer">
<div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
<span class="gate-sec"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>AES-256</span>
<span class="gate-sec"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>SOC 2 Type II</span>
<span class="gate-sec"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Session logged</span>
</div>
<p class="gate-contact">Don't have a code? <a href="#">Contact your account executive</a></p>
</div>
</div>
</div>

<!-- ═══ MAIN APP ═══ -->
<div class="onboard" id="app">
<nav class="onboard-nav">
<div class="onboard-logo">
<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#gn)" stroke-width="2"/><path d="M7 16V11M10.5 16V9M14 16V13M17.5 16V7" stroke="url(#gn)" stroke-width="2" stroke-linecap="round"/><defs><linearGradient id="gn" x1="0" y1="0" x2="24" y2="24"><stop stop-color="#5b9cf5"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs></svg>
<span>FinanceOS</span>
</div>
<div class="onboard-client">
<div>
<div class="client-name" id="clientName">Client Portal</div>
<div class="session-id" id="sessionId">SESSION-000000</div>
</div>
<span class="client-badge" id="clientBadge">Active</span>
</div>
</nav>

<!-- Stepper -->
<div class="stepper">
<div class="step-item active" id="s1"><div class="step-node">1<span class="step-label">Agreement</span></div></div>
<div class="step-item" id="s2"><div class="step-line"></div><div class="step-node">2<span class="step-label">Select</span></div></div>
<div class="step-item" id="s3"><div class="step-line"></div><div class="step-node">3<span class="step-label">Configure</span></div></div>
<div class="step-item" id="s4"><div class="step-line"></div><div class="step-node">4<span class="step-label">Proposal</span></div></div>
</div>

<!-- ═══ PANEL 1: MSA + SECURITY ═══ -->
<div class="panel active" id="p1">
<div class="panel-title">Master Services Agreement</div>
<div class="panel-sub">Review the agreement terms and complete the security questionnaire to proceed. All documents are classified per your organization's data handling policy.</div>

<div class="doc-viewer">
<h4>1. Engagement Scope <span class="cls-tag cls-confidential">Confidential</span></h4>
<p>FinanceOS Inc. ("Provider") agrees to provide Client with access to the FinanceOS Command Center platform, including dashboard templates, AI-powered analytics, data connectors, and related professional services as described in the attached Statement of Work.</p>
<h4>2. Data Handling & Security <span class="cls-tag cls-restricted">Restricted</span></h4>
<p>All Client financial data processed through the Platform shall be: (a) encrypted at rest using AES-256 and in transit using TLS 1.3; (b) stored in isolated, single-tenant environments; (c) subject to SOC 2 Type II audited controls; (d) accessible only by authorized personnel with role-based access control (RBAC). Provider maintains ISO 27001 certification and undergoes annual third-party penetration testing.</p>
<h4>3. Intellectual Property <span class="cls-tag cls-confidential">Confidential</span></h4>
<p>Client retains all rights to its financial data. Dashboard configurations, custom KPIs, and branded assets created during the engagement are licensed exclusively to Client. Provider retains ownership of the underlying platform technology, algorithms, and template frameworks.</p>
<h4>4. Term & Termination <span class="cls-tag cls-internal">Internal</span></h4>
<p>This agreement commences on the date of electronic signature and continues for an initial term of 12 months, with automatic renewal for successive 12-month periods unless either party provides 60 days written notice of non-renewal. Early termination requires 30 days notice with prorated refund of prepaid fees.</p>
<h4>5. Limitation of Liability <span class="cls-tag cls-internal">Internal</span></h4>
<p>Provider's aggregate liability under this Agreement shall not exceed the total fees paid by Client in the 12 months preceding the claim. Neither party shall be liable for indirect, incidental, special, consequential, or punitive damages.</p>
</div>

<div style="font-size:13px;font-weight:700;margin-bottom:12px">Security & Compliance Verification</div>
<div class="sec-checklist" id="secChecklist">
<label class="sec-check" onclick="toggleCheck(this)"><input type="checkbox"><div><div class="check-text"><strong>SOC 2 Type II</strong> — Annual audit by independent third party</div><div class="check-sub">Last audit: January 2026 · Zero critical findings</div></div></label>
<label class="sec-check" onclick="toggleCheck(this)"><input type="checkbox"><div><div class="check-text"><strong>ISO 27001:2022</strong> — Information security management certified</div><div class="check-sub">Certification #ISC-2024-FOS-0847</div></div></label>
<label class="sec-check" onclick="toggleCheck(this)"><input type="checkbox"><div><div class="check-text"><strong>GDPR & CCPA</strong> — Data processing agreement included</div><div class="check-sub">DPA executed as Appendix B to this MSA</div></div></label>
<label class="sec-check" onclick="toggleCheck(this)"><input type="checkbox"><div><div class="check-text"><strong>Penetration Testing</strong> — Annual third-party assessment</div><div class="check-sub">Provider: HackerOne · Last test: March 2026</div></div></label>
<label class="sec-check" onclick="toggleCheck(this)"><input type="checkbox"><div><div class="check-text"><strong>Business Continuity</strong> — 99.99% uptime SLA with disaster recovery</div><div class="check-sub">Multi-region failover · RPO < 1 hour · RTO < 4 hours</div></div></label>
</div>

<div class="sig-block">
<div class="sig-label">Electronic Signature</div>
<div class="sig-canvas" id="sigCanvas" onclick="signDocument()">
<span class="sig-placeholder"><svg viewBox="0 0 24 24"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>Click to sign</span>
<span class="sig-text" id="sigText"></span>
</div>
<div class="sig-meta">
<span id="sigDate">Date: —</span>
<span id="sigIP">IP: —</span>
</div>
</div>

<div class="panel-nav">
<div></div>
<button class="btn btn-primary" id="btn1" disabled onclick="goStep(2)">Continue to Template Selection <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
</div>
</div>

<!-- ═══ PANEL 2: TEMPLATE SELECTION ═══ -->
<div class="panel" id="p2">
<div class="panel-title">Select Your Command Center</div>
<div class="panel-sub">Choose a template as your starting point. Every element is fully customizable in the next step. All previews are watermarked to your session.</div>

<div class="tpl-grid" id="tplGrid">
<div class="tpl-card" onclick="selectTpl(this,'exec')">
<div class="tpl-preview"><div class="mini-dash md-exec"><div class="mk"><div class="v">$4.2M</div><div class="l">REV</div></div><div class="mk"><div class="v" style="color:var(--green)">68%</div><div class="l">GM</div></div><div class="mk"><div class="v" style="color:var(--amber)">$1.8M</div><div class="l">PIPE</div></div><div class="mk"><div class="v" style="color:var(--purple)">142</div><div class="l">CLIENTS</div></div><div class="mc"></div><div class="mt"><div class="mr"></div><div class="mr"></div><div class="mr"></div><div class="mr"></div></div></div><div class="watermark"><span id="wm1"></span></div><div class="tpl-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span class="cls-tag cls-confidential" style="position:absolute;top:8px;right:8px">Confidential</span></div>
<div class="tpl-body"><div class="tpl-name">Executive Command Center</div><div class="tpl-desc">Full C-suite dashboard with KPI grid, revenue trending, P&L waterfall, and real-time consolidation.</div></div>
</div>
<div class="tpl-card" onclick="selectTpl(this,'glass')">
<div class="tpl-preview"><div class="mini-dash md-glass"><div class="ms"><div class="ni a"></div><div class="ni"></div><div class="ni"></div><div class="ni"></div></div><div class="mm"><div class="gk"><div class="v">$12M</div><div class="l">ARR</div></div><div class="gk"><div class="v" style="color:var(--green)">124%</div><div class="l">NRR</div></div><div class="gk"><div class="v" style="color:var(--pink)">18mo</div><div class="l">RWY</div></div><div class="gw"></div></div></div><div class="watermark"><span id="wm2"></span></div><div class="tpl-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span class="cls-tag cls-confidential" style="position:absolute;top:8px;right:8px">Confidential</span></div>
<div class="tpl-body"><div class="tpl-name">CFO Glass Dashboard</div><div class="tpl-desc">Glassmorphism design optimized for board presentations and investor reporting.</div></div>
</div>
<div class="tpl-card" onclick="selectTpl(this,'treasury')">
<div class="tpl-preview"><div class="mini-dash md-treasury"><div class="tc"></div><div class="tg"><div class="ring"></div></div><div class="tk"><div class="tkk"><div class="v">$8M</div><div class="l">CASH</div></div><div class="tkk"><div class="v">94d</div><div class="l">DSO</div></div><div class="tkk"><div class="v">$2M</div><div class="l">AR</div></div><div class="tkk"><div class="v">1.8x</div><div class="l">CR</div></div></div><div class="tl"><div class="tr"></div><div class="tr"></div><div class="tr"></div><div class="tr"></div></div></div><div class="watermark"><span id="wm3"></span></div><div class="tpl-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span class="cls-tag cls-restricted" style="position:absolute;top:8px;right:8px">Restricted</span></div>
<div class="tpl-body"><div class="tpl-name">Treasury & Cash Flow</div><div class="tpl-desc">Real-time cash position, 13-week rolling forecast, bank monitoring, and liquidity gauges.</div></div>
</div>
<div class="tpl-card" onclick="selectTpl(this,'multi')">
<div class="tpl-preview"><div class="mini-dash md-multi"><div class="tabs"><div class="tab a">CONSOL</div><div class="tab">US</div><div class="tab">EMEA</div><div class="tab">APAC</div></div><div class="kps"><div class="kp"><div class="v">$42M</div><div class="l">REV</div></div><div class="kp"><div class="v">$28M</div><div class="l">GP</div></div><div class="kp"><div class="v">67%</div><div class="l">GM</div></div><div class="kp"><div class="v">$8.4M</div><div class="l">EBITDA</div></div><div class="kp"><div class="v">20%</div><div class="l">NM</div></div></div><div class="chart"></div></div><div class="watermark"><span id="wm4"></span></div><div class="tpl-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span class="cls-tag cls-restricted" style="position:absolute;top:8px;right:8px">Restricted</span></div>
<div class="tpl-body"><div class="tpl-name">Multi-Entity Consolidation</div><div class="tpl-desc">Entity tabs, IC eliminations, FX translation, and consolidated financials with drill-down.</div></div>
</div>
<div class="tpl-card" onclick="selectTpl(this,'startup')">
<div class="tpl-preview"><div class="mini-dash md-startup"><div class="sc"><div class="v">$1.2M</div><div class="l">MRR</div></div><div class="sc"><div class="v" style="color:var(--accent)">124%</div><div class="l">NRR</div></div><div class="sc"><div class="v" style="color:var(--amber)">14mo</div><div class="l">RWY</div></div><div class="sw"></div></div><div class="watermark"><span id="wm5"></span></div><div class="tpl-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span class="cls-tag cls-internal" style="position:absolute;top:8px;right:8px">Internal</span></div>
<div class="tpl-body"><div class="tpl-name">Startup Metrics</div><div class="tpl-desc">MRR/ARR, burn rate, runway, CAC/LTV, churn, and cohort retention for Series A-C.</div></div>
</div>
<div class="tpl-card" onclick="selectTpl(this,'pe')">
<div class="tpl-preview"><div class="mini-dash md-pe"><div class="pc"><div class="v">$840M</div><div class="l">AUM</div></div><div class="pc"><div class="v" style="color:var(--green)">2.4x</div><div class="l">MOIC</div></div><div class="pc"><div class="v" style="color:var(--amber)">28%</div><div class="l">IRR</div></div><div class="pb"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div></div><div class="watermark"><span id="wm6"></span></div><div class="tpl-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><span class="cls-tag cls-confidential" style="position:absolute;top:8px;right:8px">Confidential</span></div>
<div class="tpl-body"><div class="tpl-name">PE / VC Portfolio</div><div class="tpl-desc">Fund AUM, MOIC, IRR, DPI, vintage analysis, capital calls, and LP reporting.</div></div>
</div>
</div>
<div class="panel-nav">
<button class="btn btn-ghost" onclick="goStep(1)"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Back</button>
<button class="btn btn-primary" id="btn2" disabled onclick="goStep(3)">Configure Template <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
</div>
</div>

<!-- ═══ PANEL 3: CUSTOMIZER ═══ -->
<div class="panel" id="p3">
<div class="panel-title">Configure Your Dashboard</div>
<div class="panel-sub">Select brand colors and toggle modules. These preferences will be applied to your private install link.</div>
<div class="custom-grid">
<div class="custom-card">
<h4><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20" fill="none"/></svg> Brand Colors</h4>
<div class="color-grid">
<div class="swatch sel" style="background:linear-gradient(135deg,#5b9cf5,#4a8be4)" onclick="pickColor(this,'#5b9cf5')"></div>
<div class="swatch" style="background:linear-gradient(135deg,#a78bfa,#8b6fe8)" onclick="pickColor(this,'#a78bfa')"></div>
<div class="swatch" style="background:linear-gradient(135deg,#34d399,#28b886)" onclick="pickColor(this,'#34d399')"></div>
<div class="swatch" style="background:linear-gradient(135deg,#f472b6,#e05da0)" onclick="pickColor(this,'#f472b6')"></div>
<div class="swatch" style="background:linear-gradient(135deg,#22d3ee,#1ab8d0)" onclick="pickColor(this,'#22d3ee')"></div>
<div class="swatch" style="background:linear-gradient(135deg,#fbbf24,#e5a912)" onclick="pickColor(this,'#fbbf24')"></div>
</div>
<div style="margin-top:12px;display:flex;align-items:center;gap:8px">
<span style="font-size:11px;color:var(--muted)">Custom:</span>
<input type="text" class="form-input" id="hexInput" value="#5b9cf5" style="width:100px;padding:8px 10px;font-family:monospace;font-size:12px">
</div>
</div>
<div class="custom-card">
<h4><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Modules</h4>
<div class="mod-row"><div><div class="mod-name">AI Copilot</div><div class="mod-sub">Natural language queries</div></div><div class="tog on" onclick="this.classList.toggle('on')"></div></div>
<div class="mod-row"><div><div class="mod-name">Scenario Modeling</div><div class="mod-sub">Monte Carlo what-if</div></div><div class="tog on" onclick="this.classList.toggle('on')"></div></div>
<div class="mod-row"><div><div class="mod-name">Budget vs Actual</div><div class="mod-sub">Variance by dept</div></div><div class="tog on" onclick="this.classList.toggle('on')"></div></div>
<div class="mod-row"><div><div class="mod-name">Cash Forecast</div><div class="mod-sub">13-week rolling</div></div><div class="tog" onclick="this.classList.toggle('on')"></div></div>
<div class="mod-row"><div><div class="mod-name">Audit Trail</div><div class="mod-sub">SOX-compliant logging</div></div><div class="tog" onclick="this.classList.toggle('on')"></div></div>
</div>
</div>
<div style="padding:16px 20px;border-radius:var(--radius);border:2px dashed var(--border);text-align:center;cursor:pointer;margin-bottom:20px;transition:border-color .2s" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" style="margin-bottom:6px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
<div style="font-size:13px;font-weight:600">Upload Company Logo</div>
<div style="font-size:10px;color:var(--muted);margin-top:2px">SVG, PNG, or JPG — max 2MB</div>
</div>
<div class="panel-nav">
<button class="btn btn-ghost" onclick="goStep(2)"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Back</button>
<button class="btn btn-primary" onclick="goStep(4)">Review Proposal <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>
</div>
</div>

<!-- ═══ PANEL 4: PROPOSAL + DELIVERY ═══ -->
<div class="panel" id="p4">
<div id="proposalView">
<div class="panel-title">Engagement Proposal</div>
<div class="panel-sub">Review your configuration and pricing. Upon approval, your private install link will be generated and delivered to your inbox.</div>

<div class="proposal">
<div class="proposal-header">
<h3><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Proposal Summary <span class="cls-tag cls-confidential">Confidential</span></h3>
<span style="font-size:11px;color:var(--muted);font-family:monospace" id="proposalId">PROP-000000</span>
</div>
<div class="proposal-body">
<div class="prop-row"><span class="prop-label">Template</span><span class="prop-value" id="propTpl">—</span></div>
<div class="prop-row"><span class="prop-label">Brand Color</span><span class="prop-value" id="propColor">—</span></div>
<div class="prop-row"><span class="prop-label">Active Modules</span><span class="prop-value" id="propMods">—</span></div>
<div class="prop-row"><span class="prop-label">Platform Tier</span><span class="prop-value">Growth — $1,499/mo</span></div>
<div class="prop-row"><span class="prop-label">Onboarding</span><span class="prop-value">Included — 1:1 walkthrough</span></div>
<div class="prop-row"><span class="prop-label">Implementation</span><span class="prop-value" style="color:var(--green)">$0 — self-serve</span></div>
<div class="prop-row"><span class="prop-label">MSA Status</span><span class="prop-value" style="color:var(--green)">Signed</span></div>
<div class="prop-row"><span class="prop-label">Security Verification</span><span class="prop-value" style="color:var(--green)">5/5 Complete</span></div>
</div>
<div class="prop-total"><span>Estimated Annual Value</span><span class="total-val" id="propTotal">$17,988/yr</span></div>
</div>

<div class="panel-nav">
<button class="btn btn-ghost" onclick="goStep(3)"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Back</button>
<button class="btn btn-primary" onclick="approveProposal()" style="background:linear-gradient(135deg,var(--green),var(--accent))">
<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
Approve & Generate Private Link
</button>
</div>
</div>

<!-- Delivery success -->
<div class="delivery" id="deliveryView" style="display:none">
<div class="del-ring"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
<h2>Private Link Generated</h2>
<p class="del-sub">Your secure, one-time install link is ready. It has also been delivered to your email. This link is watermarked to your session and expires in 72 hours.</p>
<div class="del-link" id="delLink" onclick="copyLink()">
<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
<span id="delUrl">—</span>
<svg viewBox="0 0 24 24" style="opacity:.4;width:14px;height:14px"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
</div>
<div class="del-meta">
<span class="del-tag red"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Expires in 72 hours</span>
<span class="del-tag green"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>MSA signed</span>
<span class="del-tag green"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>Session watermarked</span>
</div>
</div>
</div>
</div>

<!-- ═══ AUDIT TRAIL ═══ -->
<div class="audit-toggle" id="auditToggle" onclick="document.getElementById('auditPanel').classList.toggle('open');this.style.display='none'" style="display:none">
<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
</div>
<div class="audit-panel" id="auditPanel">
<div class="audit-head">
<span><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Session Audit Trail</span>
<div class="audit-close" onclick="document.getElementById('auditPanel').classList.remove('open');document.getElementById('auditToggle').style.display='flex'"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
</div>
<div class="audit-list" id="auditList"></div>
</div>


` }} />
    </>
  );
}
