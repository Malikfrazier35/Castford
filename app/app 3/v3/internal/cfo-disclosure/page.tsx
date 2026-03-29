'use client';

import { useEffect, useRef } from 'react';

export default function V3InternalCfoDisclosurePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ── STATE ──
const state = { firstName:'', lastName:'', email:'', company:'', title:'', sessionId:'', signed:false };
const agreeState = [false,false,false];

function genSession(){
  const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';
  for(let i=0;i<12;i++){s+=c[Math.floor(Math.random()*c.length)];if(i===3||i===7)s+='-';}
  return s;
}
function now(){return new Date().toISOString().replace('T',' ').split('.')[0]+' UTC'}
function ts(){const d=new Date();return d.toLocaleTimeString('en-US',{hour12:false})+'.'+String(d.getMilliseconds()).padStart(3,'0')}

// ── AUDIT TRAIL ──
function logAudit(action, color='blue'){
  const list=document.getElementById('auditList');
  const item=document.createElement('div');item.className='audit-item';
  item.innerHTML=\`<div class="audit-dot \${color}"></div><div class="audit-text"><strong>\${action}</strong><span class="audit-time">\${ts()}</span></div>\`;
  list.prepend(item);
}
function toggleAudit(){
  const p=document.getElementById('auditPanel');
  p.classList.toggle('open');
}

// ── SCREEN TRANSITIONS ──
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('gate').classList.add('dismissed');
  const el=document.getElementById(id);
  el.classList.add('active');
  el.style.animation='none';el.offsetHeight;el.style.animation='panelIn .5s var(--ease)';
}

// ── EMAIL GATE ──
function submitEmail(e){
  e.preventDefault();
  state.firstName=document.getElementById('firstName').value.trim();
  state.lastName=document.getElementById('lastName').value.trim();
  state.email=document.getElementById('emailInput').value.trim();
  state.company=document.getElementById('companyInput').value.trim();
  state.title=document.getElementById('titleInput').value.trim();
  state.sessionId=genSession();

  // Reject free email providers
  const free=['gmail.com','yahoo.com','hotmail.com','outlook.com','aol.com','icloud.com','mail.com','protonmail.com'];
  const domain=state.email.split('@')[1]?.toLowerCase();
  if(free.includes(domain)){
    const btn=document.getElementById('gateBtn');
    btn.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Corporate email required';
    btn.style.background='linear-gradient(135deg,#7f1d1d,#991b1b)';
    setTimeout(()=>{btn.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Request Secure Access';btn.style.background='';},2500);
    return;
  }

  logAudit('Identity submitted: '+state.email,'blue');
  document.getElementById('verifyEmailDisplay').textContent=state.email;
  document.getElementById('gate').classList.add('dismissed');
  showScreen('verifyScreen');
  setupCodeInputs();
  startTimer();
}

// ── VERIFICATION ──
function setupCodeInputs(){
  const inputs=document.querySelectorAll('.code-input');
  inputs.forEach((inp,i)=>{
    inp.value='';
    inp.addEventListener('input',function(){
      this.value=this.value.toUpperCase();
      if(this.value){
        this.classList.add('filled');
        // Skip the dash span
        const next=inputs[i+1];
        if(next)next.focus();
      }
      checkCode();
    });
    inp.addEventListener('keydown',function(e){
      if(e.key==='Backspace'&&!this.value&&i>0){
        inputs[i-1].focus();inputs[i-1].value='';inputs[i-1].classList.remove('filled');
      }
    });
  });
  inputs[0].focus();
}

function checkCode(){
  const inputs=document.querySelectorAll('.code-input');
  const code=Array.from(inputs).map(i=>i.value).join('');
  if(code.length===6){
    logAudit('Verification code accepted','green');
    setTimeout(()=>enterDocument(),600);
  }
}

let timerInterval;
function startTimer(){
  let seconds=600;
  timerInterval=setInterval(()=>{
    seconds--;
    if(seconds<=0){clearInterval(timerInterval);return;}
    const m=Math.floor(seconds/60).toString().padStart(2,'0');
    const s=(seconds%60).toString().padStart(2,'0');
    document.getElementById('verifyTimer').innerHTML=\`Code expires in <strong>\${m}:\${s}</strong>\`;
  },1000);
}
function resendCode(){
  clearInterval(timerInterval);startTimer();
  const btn=document.querySelector('.verify-resend');
  btn.textContent='Code resent!';btn.style.color='var(--green)';
  setTimeout(()=>{btn.textContent="Didn't receive it? Resend code";btn.style.color='';},2000);
  logAudit('Verification code resent','amber');
}

// ── ENTER DOCUMENT ──
function enterDocument(){
  clearInterval(timerInterval);
  // Populate watermark + session tags
  document.getElementById('watermark').textContent=state.email;
  document.getElementById('navName').textContent=state.firstName+' '+state.lastName+' — '+state.company;
  document.getElementById('navSession').textContent='SESSION-'+state.sessionId;
  document.getElementById('docTimestamp').textContent=now();
  document.getElementById('metaRecipient').textContent=state.firstName+' '+state.lastName+' — '+state.company;
  document.getElementById('footerSession').textContent=state.sessionId;
  // Show audit toggle
  document.getElementById('auditToggle').style.display='flex';
  logAudit('Document accessed by '+state.email,'green');
  logAudit('Session initiated: '+state.sessionId,'blue');
  showScreen('docScreen');
}

// ── AGREEMENT ──
function toggleAgree(idx,row){
  agreeState[idx]=!agreeState[idx];
  const check=document.getElementById('ag'+idx);
  check.classList.toggle('on',agreeState[idx]);
  row.classList.toggle('checked',agreeState[idx]);
  logAudit((agreeState[idx]?'Accepted':'Revoked')+' acknowledgment clause '+(idx+1), agreeState[idx]?'green':'amber');
  updateAckBtn();
}

function updateAckBtn(){
  const allChecked=agreeState.every(Boolean)&&state.signed;
  document.getElementById('ackBtn').classList.toggle('ready',allChecked);
}

function signDocument(){
  const canvas=document.getElementById('sigCanvas');
  if(canvas.classList.contains('signed'))return;
  canvas.classList.add('signed');
  document.getElementById('sigText').textContent=state.firstName+' '+state.lastName;
  document.getElementById('sigDate').textContent='Date: '+now();
  document.getElementById('sigSession').textContent='Session: '+state.sessionId;
  state.signed=true;
  logAudit('Document signed electronically','green');
  updateAckBtn();
}

function acknowledgeDoc(){
  if(!agreeState.every(Boolean)||!state.signed)return;
  const btn=document.getElementById('ackBtn');
  btn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Document Acknowledged — Session Recorded';
  btn.style.background='linear-gradient(135deg,#166534,#15803d)';
  btn.style.pointerEvents='none';
  logAudit('Document fully acknowledged and session sealed','green');
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
   SCREEN TRANSITIONS
   ═══════════════════════════════════════════════════ */
.screen{display:none;min-height:100vh}
.screen.active{display:flex}
@keyframes panelIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* ═══════════════════════════════════════════════════
   SCREEN 0: EMAIL GATE
   ═══════════════════════════════════════════════════ */
.gate{position:fixed;inset:0;z-index:600;background:var(--bg);display:flex;align-items:center;justify-content:center;transition:opacity .8s var(--ease),visibility .8s}
.gate.dismissed{opacity:0;visibility:hidden;pointer-events:none}
.gate-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.gate-bg .orb{position:absolute;border-radius:50%;filter:blur(100px);opacity:.07;animation:orbFloat 20s ease-in-out infinite}
.gate-bg .orb:nth-child(1){width:500px;height:500px;background:var(--accent);top:-10%;left:-5%;animation-delay:0s}
.gate-bg .orb:nth-child(2){width:400px;height:400px;background:var(--purple);bottom:-10%;right:-5%;animation-delay:-7s}
.gate-bg .orb:nth-child(3){width:300px;height:300px;background:var(--red);top:40%;right:30%;animation-delay:-14s}
@keyframes orbFloat{0%,100%{transform:translate(0,0)}25%{transform:translate(30px,-20px)}50%{transform:translate(-20px,30px)}75%{transform:translate(20px,20px)}}

.gate-panel{position:relative;z-index:1;width:100%;max-width:520px;padding:48px;text-align:center}
.gate-logo{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:48px}
.gate-logo svg{width:36px;height:36px}
.gate-logo span{font-size:22px;font-weight:800;background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gate-shield{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,rgba(91,156,245,.06),rgba(167,139,250,.06));border:1px solid rgba(91,156,245,.12);display:flex;align-items:center;justify-content:center;margin:0 auto 28px}
.gate-shield svg{width:32px;height:32px;stroke:var(--accent);fill:none;stroke-width:1.5}
.gate h2{font-size:24px;font-weight:800;margin-bottom:8px;letter-spacing:-.3px}
.gate .gate-sub{font-size:14px;color:var(--dim);margin-bottom:36px;line-height:1.7}
.gate .gate-docid{display:inline-block;font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--muted);font-family:'SF Mono','Fira Code',monospace;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:6px 14px;margin-bottom:28px}

/* Email form */
.email-form{display:flex;flex-direction:column;gap:12px;text-align:left}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-group{position:relative}
.form-input{width:100%;padding:12px 14px 12px 42px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}
.form-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(91,156,245,.08)}
.form-input::placeholder{color:var(--muted)}
.input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:16px;height:16px;stroke:var(--muted);fill:none;stroke-width:1.5}

.gate-submit{width:100%;padding:14px;border-radius:var(--radius);font-size:15px;font-weight:700;border:none;cursor:pointer;background:linear-gradient(135deg,var(--accent),var(--purple));color:#fff;transition:all .25s var(--ease);display:flex;align-items:center;justify-content:center;gap:10px;margin-top:4px}
.gate-submit:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(91,156,245,.25)}
.gate-submit:disabled{opacity:.4;pointer-events:none;transform:none;box-shadow:none}
.gate-submit svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}

.gate-legal{font-size:11px;color:var(--muted);line-height:1.6;margin-top:16px;text-align:center}
.gate-footer{margin-top:28px;display:flex;flex-direction:column;align-items:center;gap:12px}
.gate-sec{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted)}
.gate-sec svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2}

/* ═══════════════════════════════════════════════════
   SCREEN 1: VERIFICATION
   ═══════════════════════════════════════════════════ */
#verifyScreen{flex-direction:column;align-items:center;justify-content:center;background:var(--bg)}
.verify-panel{position:relative;z-index:1;width:100%;max-width:440px;padding:48px;text-align:center}
.verify-icon{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,rgba(91,156,245,.06),rgba(167,139,250,.06));border:1px solid rgba(91,156,245,.12);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;animation:verifyPulse 2s ease-in-out infinite}
@keyframes verifyPulse{0%,100%{box-shadow:0 0 0 0 rgba(91,156,245,.15)}50%{box-shadow:0 0 0 16px rgba(91,156,245,0)}}
.verify-icon svg{width:32px;height:32px;stroke:var(--accent);fill:none;stroke-width:1.5}
.verify-title{font-size:22px;font-weight:800;margin-bottom:8px}
.verify-text{font-size:14px;color:var(--dim);line-height:1.6;margin-bottom:6px}
.verify-email{font-size:15px;font-weight:700;color:var(--accent);margin-bottom:28px}

.code-input-wrap{display:flex;gap:8px;justify-content:center;margin-bottom:24px}
.code-input{width:48px;height:56px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:22px;font-weight:800;text-align:center;outline:none;transition:all .2s var(--ease);letter-spacing:2px;caret-color:var(--accent);font-family:'SF Mono','Fira Code',monospace}
.code-input:focus{border-color:var(--accent);background:var(--card2);box-shadow:0 0 0 3px rgba(91,156,245,.1)}
.code-input.filled{border-color:var(--green);background:rgba(52,211,153,.06);color:var(--green)}

.verify-timer{font-size:12px;color:var(--muted);margin-bottom:16px}
.verify-resend{background:none;border:none;color:var(--dim);font-size:12px;cursor:pointer;text-decoration:underline}
.verify-resend:hover{color:var(--accent)}

/* ═══════════════════════════════════════════════════
   SCREEN 2: DISCLOSURE DOCUMENT
   ═══════════════════════════════════════════════════ */
#docScreen{flex-direction:column;align-items:center;background:var(--bg);padding-top:0}

/* Top nav — matches deal room onboard-nav */
.doc-nav{display:flex;align-items:center;justify-content:space-between;padding:14px 32px;border-bottom:1px solid var(--border);background:var(--surface);position:sticky;top:0;z-index:100;backdrop-filter:blur(16px);width:100%}
.doc-nav-logo{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:800}
.doc-nav-logo svg{width:24px;height:24px}
.doc-nav-logo span{background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.doc-nav-right{display:flex;align-items:center;gap:12px}
.doc-nav-name{font-size:13px;font-weight:600}
.doc-nav-badge{padding:4px 12px;border-radius:16px;font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;background:rgba(248,113,113,.08);color:var(--red);border:1px solid rgba(248,113,113,.12)}
.doc-nav-session{font-size:10px;color:var(--muted);font-family:monospace}

/* Watermark */
.doc-watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:90px;font-weight:900;color:rgba(91,156,245,.025);letter-spacing:8px;pointer-events:none;z-index:0;white-space:nowrap;user-select:none}

/* Document container */
.doc-wrap{width:100%;max-width:820px;padding:32px 32px 60px;position:relative;z-index:1}

/* Classification bar */
.cls-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;background:linear-gradient(135deg,rgba(248,113,113,.04),rgba(248,113,113,.02));border:1px solid rgba(248,113,113,.1);border-radius:var(--radius) var(--radius) 0 0;margin-bottom:0}
.cls-bar-label{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;color:var(--red);letter-spacing:2px;text-transform:uppercase}
.cls-bar-dot{width:8px;height:8px;border-radius:50%;background:var(--red);animation:tagPulse 2s infinite}
@keyframes tagPulse{0%,100%{opacity:1}50%{opacity:.4}}
.cls-bar-meta{font-size:10px;color:var(--muted);font-family:monospace}

/* Main document card */
.doc-card{background:var(--card);border:1px solid var(--border);border-top:none;border-radius:0 0 var(--radius) var(--radius);overflow:hidden}

/* Title section */
.doc-title-section{padding:36px 32px 28px;border-bottom:1px solid var(--border)}
.doc-eyebrow{font-size:11px;font-weight:700;color:var(--accent);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
.doc-main-title{font-size:28px;font-weight:800;line-height:1.2;letter-spacing:-.5px;margin-bottom:6px}
.doc-main-sub{font-size:14px;color:var(--dim);line-height:1.7;margin-top:12px}
.doc-version{font-size:10px;color:var(--muted);font-family:monospace;margin-top:12px;letter-spacing:.5px}

/* Meta grid */
.doc-meta-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border)}
.doc-meta-cell{background:var(--card);padding:16px 20px}
.doc-meta-label{font-size:10px;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:6px}
.doc-meta-value{font-size:13px;font-weight:600;color:var(--text)}
.doc-meta-value.red{color:var(--red)}
.doc-meta-value.amber{color:var(--amber)}

/* Classification tags — same as deal room */
.cls-tag{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:6px;font-size:9px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;vertical-align:middle;margin-left:8px}
.cls-confidential{background:rgba(248,113,113,.08);color:var(--red);border:1px solid rgba(248,113,113,.15)}
.cls-restricted{background:rgba(251,191,36,.08);color:var(--amber);border:1px solid rgba(251,191,36,.15)}
.cls-internal{background:rgba(91,156,245,.08);color:var(--accent);border:1px solid rgba(91,156,245,.15)}

/* Document body */
.doc-body{padding:32px}

/* Sections */
.doc-section{margin-bottom:32px}
.doc-section-num{font-size:10px;font-weight:700;color:var(--accent);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px}
.doc-section-title{font-size:18px;font-weight:800;margin-bottom:14px;letter-spacing:-.2px}
.doc-para{font-size:14px;color:var(--dim);line-height:1.8;margin-bottom:12px}

/* Highlight card */
.doc-highlight{background:linear-gradient(135deg,rgba(91,156,245,.04),rgba(167,139,250,.02));border:1px solid rgba(91,156,245,.1);border-radius:var(--radius);padding:20px 24px;margin:16px 0}
.doc-highlight-label{font-size:10px;font-weight:700;color:var(--accent);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px}
.doc-highlight-value{font-size:26px;font-weight:800;color:var(--text)}
.doc-highlight-sub{font-size:12px;color:var(--muted);margin-top:4px}

/* Tier cards — styled like deal room tpl-cards */
.tier-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:20px 0}
.tier-card{background:var(--card2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;position:relative;overflow:hidden;transition:all .3s var(--ease)}
.tier-card:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.3)}
.tier-card.featured{border-color:var(--accent);box-shadow:0 0 0 1px rgba(91,156,245,.15)}
.tier-card .tier-badge{position:absolute;top:10px;right:10px}
.tier-name{font-size:14px;font-weight:700;margin-bottom:8px}
.tier-price{font-size:22px;font-weight:800;color:var(--accent);margin-bottom:2px}
.tier-period{font-size:11px;color:var(--muted)}
.tier-desc{font-size:12px;color:var(--dim);line-height:1.6;margin-top:10px}
.tier-items{list-style:none;margin-top:12px}
.tier-items li{font-size:12px;color:var(--dim);padding:4px 0 4px 20px;position:relative;line-height:1.5}
.tier-items li::before{content:'';position:absolute;left:0;top:10px;width:8px;height:8px;border-radius:50%;border:2px solid var(--accent)}

/* Table — matches deal room doc-viewer style */
.doc-table{width:100%;border-collapse:collapse;margin:16px 0;border-radius:var(--radius);overflow:hidden}
.doc-table th{background:var(--card2);font-size:10px;font-weight:700;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;padding:12px 16px;text-align:left;border-bottom:1px solid var(--border)}
.doc-table td{padding:12px 16px;font-size:13px;color:var(--dim);border-bottom:1px solid var(--border)}
.doc-table tr:last-child td{border-bottom:none}
.doc-table .val{font-weight:700;color:var(--text);font-family:'SF Mono','Fira Code',monospace}

/* Redacted bars */
.redacted{background:repeating-linear-gradient(90deg,var(--muted) 0,var(--muted) 8px,transparent 8px,transparent 12px);height:14px;display:inline-block;border-radius:2px;opacity:.2}

/* ═══════════════════════════════════════════════════
   AGREEMENT SECTION
   ═══════════════════════════════════════════════════ */
.doc-agreement{border-top:1px solid var(--border);padding:28px 32px;background:linear-gradient(180deg,var(--card),var(--card2))}
.agree-row{display:flex;align-items:flex-start;gap:12px;padding:12px 16px;border-radius:10px;background:var(--card);border:1px solid var(--border);cursor:pointer;transition:all .2s var(--ease);margin-bottom:8px}
.agree-row:hover{border-color:var(--border2)}
.agree-row.checked{border-color:rgba(52,211,153,.2);background:rgba(52,211,153,.02)}
.agree-check{width:20px;height:20px;min-width:20px;border:2px solid var(--border2);border-radius:6px;display:flex;align-items:center;justify-content:center;transition:all .3s;margin-top:2px}
.agree-check.on{background:var(--green);border-color:var(--green)}
.agree-check svg{width:14px;height:14px;stroke:white;stroke-width:2.5;fill:none;opacity:0;transition:opacity .2s}
.agree-check.on svg{opacity:1}
.agree-text{font-size:13px;color:var(--dim);line-height:1.5}

/* Signature block — matches deal room */
.sig-block{padding:24px;border-radius:var(--radius);background:var(--card);border:1px solid var(--border);margin-top:20px}
.sig-label{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);font-weight:600;margin-bottom:12px}
.sig-canvas{width:100%;height:80px;border-radius:8px;border:1px dashed var(--border2);background:var(--surface);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}
.sig-canvas:hover{border-color:var(--accent);background:rgba(91,156,245,.02)}
.sig-canvas.signed{border-style:solid;border-color:var(--green);background:rgba(52,211,153,.02)}
.sig-canvas .sig-text{font-size:24px;font-family:'Georgia',serif;font-style:italic;color:var(--text);opacity:0}
.sig-canvas.signed .sig-text{opacity:1}
.sig-canvas .sig-placeholder{font-size:12px;color:var(--muted);display:flex;align-items:center;gap:6px}
.sig-canvas.signed .sig-placeholder{display:none}
.sig-canvas .sig-placeholder svg{width:16px;height:16px;stroke:var(--muted);fill:none;stroke-width:2}
.sig-meta{display:flex;justify-content:space-between;margin-top:10px;font-size:11px;color:var(--muted)}

.acknowledge-btn{width:100%;padding:14px;border-radius:var(--radius);font-size:15px;font-weight:700;border:none;cursor:pointer;background:var(--card2);border:1px solid var(--border);color:var(--muted);transition:all .25s var(--ease);display:flex;align-items:center;justify-content:center;gap:10px;margin-top:20px;pointer-events:none}
.acknowledge-btn.ready{background:linear-gradient(135deg,var(--accent),var(--purple));border-color:transparent;color:#fff;pointer-events:auto}
.acknowledge-btn.ready:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(91,156,245,.25)}

/* Footer */
.doc-footer{padding:20px 32px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;font-size:10px;color:var(--muted)}
.doc-footer a{color:var(--accent);text-decoration:none}

/* ═══════════════════════════════════════════════════
   AUDIT TRAIL SIDEBAR — same as deal room
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
.audit-dot.blue{background:var(--accent)}.audit-dot.green{background:var(--green)}.audit-dot.amber{background:var(--amber)}.audit-dot.purple{background:var(--purple)}.audit-dot.red{background:var(--red)}
.audit-text{font-size:11px;line-height:1.5;color:var(--dim)}
.audit-text strong{color:var(--text);font-weight:600}
.audit-time{font-size:9px;color:var(--muted);display:block;margin-top:2px;font-family:monospace}

/* Responsive */
@media(max-width:768px){
  .gate-panel{padding:32px 24px}
  .form-row{grid-template-columns:1fr}
  .doc-meta-grid{grid-template-columns:repeat(2,1fr)}
  .tier-grid{grid-template-columns:1fr}
  .doc-wrap{padding:16px}
  .code-input{width:40px;height:48px;font-size:18px}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- ═══ SCREEN 0: EMAIL GATE ═══ -->
<div class="gate" id="gate">
<div class="gate-bg"><div class="orb"></div><div class="orb"></div><div class="orb"></div></div>
<div class="gate-panel">
<div class="gate-logo">
<svg viewBox="0 0 36 36" fill="none"><rect x="3" y="3" width="30" height="30" rx="8" stroke="url(#gl)" stroke-width="2.5"/><path d="M11 24V16M16 24V13M21 24V18M26 24V10" stroke="url(#gl)" stroke-width="2.5" stroke-linecap="round"/><defs><linearGradient id="gl" x1="0" y1="0" x2="36" y2="36"><stop stop-color="#5b9cf5"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs></svg>
<span>FinanceOS</span>
</div>
<div class="gate-shield"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
<h2>Confidential Disclosure</h2>
<p class="gate-sub">This document contains proprietary product architecture, pricing models, and strategic roadmap information classified under NDA. Identity verification is required before access is granted.</p>
<div class="gate-docid">DOC-CFO-CC-2026-0091 &nbsp;·&nbsp; REV 3.2</div>

<form class="email-form" onsubmit="submitEmail(event)">
  <div class="form-row">
    <div class="form-group">
      <svg class="input-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <input class="form-input" type="text" id="firstName" placeholder="First name" required>
    </div>
    <div class="form-group">
      <svg class="input-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <input class="form-input" type="text" id="lastName" placeholder="Last name" required>
    </div>
  </div>
  <div class="form-group">
    <svg class="input-icon" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
    <input class="form-input" type="email" id="emailInput" placeholder="Corporate email address" required>
  </div>
  <div class="form-row">
    <div class="form-group">
      <svg class="input-icon" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3"/></svg>
      <input class="form-input" type="text" id="companyInput" placeholder="Company" required>
    </div>
    <div class="form-group">
      <svg class="input-icon" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      <input class="form-input" type="text" id="titleInput" placeholder="Title" required>
    </div>
  </div>
  <button type="submit" class="gate-submit" id="gateBtn">
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    Request Secure Access
  </button>
</form>

<p class="gate-legal">By requesting access you agree to the FinanceOS Confidential Information Policy (CIP-2026). All access is logged, timestamped, and attributed to your verified identity.</p>

<div class="gate-footer">
  <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
    <span class="gate-sec"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>AES-256</span>
    <span class="gate-sec"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>SOC 2 Type II</span>
    <span class="gate-sec"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Session logged</span>
  </div>
</div>
</div>
</div>

<!-- ═══ SCREEN 1: VERIFICATION ═══ -->
<div class="screen" id="verifyScreen">
<div class="gate-bg"><div class="orb"></div><div class="orb"></div><div class="orb"></div></div>
<div class="verify-panel">
  <div class="verify-icon">
    <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
  </div>
  <div class="verify-title">Check Your Inbox</div>
  <p class="verify-text">We've sent a 6-digit verification code to</p>
  <div class="verify-email" id="verifyEmailDisplay"></div>

  <div class="code-input-wrap" id="codeRow">
    <input class="code-input" maxlength="1" data-idx="0" autocomplete="off">
    <input class="code-input" maxlength="1" data-idx="1" autocomplete="off">
    <input class="code-input" maxlength="1" data-idx="2" autocomplete="off">
    <span style="color:var(--border);font-size:20px;display:flex;align-items:center">—</span>
    <input class="code-input" maxlength="1" data-idx="3" autocomplete="off">
    <input class="code-input" maxlength="1" data-idx="4" autocomplete="off">
    <input class="code-input" maxlength="1" data-idx="5" autocomplete="off">
  </div>

  <div class="verify-timer" id="verifyTimer">Code expires in <strong>09:58</strong></div>
  <button class="verify-resend" onclick="resendCode()">Didn't receive it? Resend code</button>
</div>
</div>

<!-- ═══ WATERMARK (populated dynamically) ═══ -->
<div class="doc-watermark" id="watermark"></div>

<!-- ═══ SCREEN 2: DISCLOSURE DOCUMENT ═══ -->
<div class="screen" id="docScreen">

<!-- Top nav bar -->
<nav class="doc-nav">
  <div class="doc-nav-logo">
    <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#gn)" stroke-width="2"/><path d="M7 16V11M10.5 16V9M14 16V13M17.5 16V7" stroke="url(#gn)" stroke-width="2" stroke-linecap="round"/><defs><linearGradient id="gn" x1="0" y1="0" x2="24" y2="24"><stop stop-color="#5b9cf5"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs></svg>
    <span>FinanceOS</span>
  </div>
  <div class="doc-nav-right">
    <div>
      <div class="doc-nav-name" id="navName">—</div>
      <div class="doc-nav-session" id="navSession">SESSION-000000</div>
    </div>
    <span class="doc-nav-badge">Confidential</span>
  </div>
</nav>

<div class="doc-wrap">
  <!-- Classification bar -->
  <div class="cls-bar">
    <div class="cls-bar-label"><span class="cls-bar-dot"></span> Confidential — Do Not Distribute</div>
    <div class="cls-bar-meta" id="docTimestamp"></div>
  </div>

  <!-- Document card -->
  <div class="doc-card">
    <!-- Title -->
    <div class="doc-title-section">
      <div class="doc-eyebrow">Product Architecture Disclosure</div>
      <h1 class="doc-main-title">CFO Command Center — Architect Plan</h1>
      <p class="doc-main-sub">Full-stack financial intelligence platform purpose-built for the Office of the CFO. Multi-entity consolidation, real-time treasury operations, AI-powered scenario modeling, and institutional-grade audit infrastructure — delivered as a managed, white-glove engagement.</p>
      <div class="doc-version">DOC-CFO-CC-2026-0091 &nbsp;·&nbsp; REV 3.2 &nbsp;·&nbsp; Classification: CONFIDENTIAL</div>
    </div>

    <!-- Meta grid -->
    <div class="doc-meta-grid">
      <div class="doc-meta-cell">
        <div class="doc-meta-label">Classification</div>
        <div class="doc-meta-value red">Confidential</div>
      </div>
      <div class="doc-meta-cell">
        <div class="doc-meta-label">Prepared For</div>
        <div class="doc-meta-value" id="metaRecipient">—</div>
      </div>
      <div class="doc-meta-cell">
        <div class="doc-meta-label">Effective Date</div>
        <div class="doc-meta-value">March 25, 2026</div>
      </div>
      <div class="doc-meta-cell">
        <div class="doc-meta-label">Expiration</div>
        <div class="doc-meta-value amber">72 Hours Post-Access</div>
      </div>
    </div>

    <!-- Body -->
    <div class="doc-body">

      <!-- SECTION 1: OVERVIEW -->
      <div class="doc-section">
        <div class="doc-section-num">Section 01</div>
        <div class="doc-section-title">Platform Overview</div>
        <p class="doc-para">The CFO Command Center is FinanceOS's enterprise-tier financial intelligence platform, architected for organizations with $100M+ in revenue managing multi-entity, multi-currency financial operations. Unlike self-serve dashboard products, the Command Center is delivered through a dedicated architect engagement — a named solutions architect designs, deploys, and optimizes the platform to the client's specific chart of accounts, ERP topology, and reporting cadence.</p>
        <p class="doc-para">The platform integrates directly with the client's general ledger, treasury management system, ERP (NetSuite, SAP, Oracle, Sage Intacct, Microsoft Dynamics), banking APIs, and HRIS to deliver a unified financial operating system. All data is processed through FinanceOS's reconciliation engine, which performs continuous three-way matching across source systems with sub-second latency.</p>
      </div>

      <!-- SECTION 2: PRICING -->
      <div class="doc-section">
        <div class="doc-section-num">Section 02</div>
        <div class="doc-section-title">Pricing Architecture</div>
        <p class="doc-para">The Command Center operates on a platform + implementation + managed services model, structured to align with enterprise procurement categories. Total contract value scales with organizational complexity, entity count, and module selection.</p>

        <div class="tier-grid">
          <div class="tier-card">
            <div class="tier-badge"><span class="cls-tag cls-internal">Internal</span></div>
            <div class="tier-name">Platform License</div>
            <div class="tier-price">$15,000</div>
            <div class="tier-period">per month · $180,000/yr</div>
            <div class="tier-desc">Core platform access with unlimited users, multi-entity consolidation, and real-time treasury dashboards.</div>
            <ul class="tier-items">
              <li>Up to 25 entities</li>
              <li>Unlimited named users</li>
              <li>99.95% SLA guarantee</li>
              <li>SOC 2 + ISO 27001</li>
            </ul>
          </div>
          <div class="tier-card featured">
            <div class="tier-badge"><span class="cls-tag cls-restricted">Restricted</span></div>
            <div class="tier-name">Implementation</div>
            <div class="tier-price">$75K – $250K</div>
            <div class="tier-period">one-time · scope-dependent</div>
            <div class="tier-desc">Dedicated architect engagement covering ERP integration, data migration, custom reporting, and stakeholder training.</div>
            <ul class="tier-items">
              <li>Named Solutions Architect</li>
              <li>8–16 week deployment</li>
              <li>Custom chart of accounts mapping</li>
              <li>Executive training program</li>
            </ul>
          </div>
          <div class="tier-card">
            <div class="tier-badge"><span class="cls-tag cls-confidential">Confidential</span></div>
            <div class="tier-name">Managed Services</div>
            <div class="tier-price">$8,000</div>
            <div class="tier-period">per month · $96,000/yr</div>
            <div class="tier-desc">Ongoing architect retainer for optimization, quarterly business reviews, priority support, and continuous platform evolution.</div>
            <ul class="tier-items">
              <li>Quarterly Business Reviews</li>
              <li>Priority SLA (15-min response)</li>
              <li>Monthly optimization reports</li>
              <li>Dedicated Slack channel</li>
            </ul>
          </div>
        </div>

        <div class="doc-highlight">
          <div class="doc-highlight-label">Estimated Total Annual Value</div>
          <div class="doc-highlight-value">$351,000 – $526,000</div>
          <div class="doc-highlight-sub">Year 1 (includes implementation) · Renewals at $276,000/yr base before consumption overages</div>
        </div>

        <p class="doc-para">Consumption-based overages apply beyond included thresholds: AI query volume ($0.12/query beyond 50K/mo), API call volume ($0.004/call beyond 500K/mo), and scenario model runs ($2.50/run beyond 200/mo). Historical data indicates average overage uplift of 18% on the base platform fee.</p>
      </div>

      <!-- SECTION 3: MODULES -->
      <div class="doc-section">
        <div class="doc-section-num">Section 03</div>
        <div class="doc-section-title">Module Architecture</div>
        <p class="doc-para">The Command Center comprises six core modules that can be activated independently or as a unified suite. Each module integrates bidirectionally with the reconciliation engine.</p>

        <table class="doc-table">
          <thead><tr><th>Module</th><th>Classification</th><th>Included</th><th>Add-On Price</th></tr></thead>
          <tbody>
            <tr><td>Multi-Entity Consolidation</td><td style="color:var(--green)">Core</td><td class="val">Yes</td><td>—</td></tr>
            <tr><td>Real-Time Treasury</td><td style="color:var(--green)">Core</td><td class="val">Yes</td><td>—</td></tr>
            <tr><td>AI Copilot (Natural Language)</td><td style="color:var(--amber)">Premium</td><td class="val">Yes</td><td>—</td></tr>
            <tr><td>Scenario Modeling Engine</td><td style="color:var(--amber)">Premium</td><td class="val">Yes</td><td>—</td></tr>
            <tr><td>Budget vs. Actual Variance</td><td style="color:var(--green)">Core</td><td class="val">Yes</td><td>—</td></tr>
            <tr><td>Audit Trail & Compliance</td><td style="color:var(--red)">Restricted</td><td class="val">Yes</td><td>—</td></tr>
            <tr><td>Board Reporting Suite</td><td style="color:var(--red)">Restricted</td><td>No</td><td class="val">$3,500/mo</td></tr>
            <tr><td>M&A Due Diligence Workbench</td><td style="color:var(--red)">Restricted</td><td>No</td><td class="val">$5,000/mo</td></tr>
          </tbody>
        </table>
      </div>

      <!-- SECTION 4: SCALE PATH -->
      <div class="doc-section">
        <div class="doc-section-num">Section 04</div>
        <div class="doc-section-title">Enterprise Scale Path</div>
        <p class="doc-para">For organizations requiring the full module suite including Board Reporting and M&A Due Diligence, plus expanded entity counts (50+), dedicated infrastructure, and custom SLA terms, the Command Center scales to the Architect Enterprise tier.</p>

        <table class="doc-table">
          <thead><tr><th>Component</th><th>Architect Standard</th><th>Architect Enterprise</th></tr></thead>
          <tbody>
            <tr><td>Platform License</td><td class="val">$180,000/yr</td><td class="val">$300,000/yr</td></tr>
            <tr><td>Implementation</td><td class="val">$75K–$250K</td><td class="val">$150K–$400K</td></tr>
            <tr><td>Managed Services</td><td class="val">$96,000/yr</td><td class="val">$150,000/yr</td></tr>
            <tr><td>Add-On Modules</td><td>Optional</td><td class="val">All Included</td></tr>
            <tr><td>Entities</td><td>Up to 25</td><td class="val">Unlimited</td></tr>
            <tr><td>Infrastructure</td><td>Shared (isolated tenant)</td><td class="val">Dedicated VPC</td></tr>
            <tr><td>SLA</td><td>99.95%</td><td class="val">99.99% + credits</td></tr>
            <tr><td>Estimated Year 1 TCV</td><td class="val">$351K–$526K</td><td class="val">$600K–$750K</td></tr>
          </tbody>
        </table>
      </div>

      <!-- SECTION 5: REDACTED ROADMAP -->
      <div class="doc-section">
        <div class="doc-section-num">Section 05</div>
        <div class="doc-section-title">Strategic Roadmap — Q3/Q4 2026 <span class="cls-tag cls-confidential">Confidential</span></div>
        <p class="doc-para">The following roadmap items are disclosed under NDA and reflect current product direction. Roadmap is subject to change and does not constitute a commitment to deliver.</p>
        <p class="doc-para"><strong>Q3 2026:</strong> Autonomous close orchestration — AI-driven month-end close that executes reconciliations, generates journal entries, and produces close checklists with <span class="redacted" style="width:80px"></span> human oversight required. Target: reduce close cycle from <span class="redacted" style="width:40px"></span> days to <span class="redacted" style="width:30px"></span> days.</p>
        <p class="doc-para"><strong>Q4 2026:</strong> Predictive cash intelligence — machine learning models trained on <span class="redacted" style="width:60px"></span> transactions across the FinanceOS customer base to predict cash positions with <span class="redacted" style="width:50px"></span>% accuracy at 90-day horizons. Integration with <span class="redacted" style="width:100px"></span> for automated sweep optimization.</p>
        <p class="doc-para"><strong>Q4 2026:</strong> CFO Copilot v2 — natural language interface capable of <span class="redacted" style="width:90px"></span> including direct ERP write-back, automated board deck generation, and <span class="redacted" style="width:70px"></span>. Expected to reduce CFO reporting workload by an estimated <span class="redacted" style="width:40px"></span>%.</p>
      </div>

    </div><!-- /doc-body -->

    <!-- AGREEMENT -->
    <div class="doc-agreement" id="agreementSection">
      <div class="doc-section-num">Acknowledgment</div>
      <div class="doc-section-title" style="margin-bottom:16px">Confidentiality Agreement</div>

      <div class="agree-row" onclick="toggleAgree(0,this)">
        <div class="agree-check" id="ag0"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
        <div class="agree-text">I acknowledge that all information contained in this document is proprietary to FinanceOS, Inc. and is classified as Confidential under the FinanceOS Confidential Information Policy (CIP-2026).</div>
      </div>
      <div class="agree-row" onclick="toggleAgree(1,this)">
        <div class="agree-check" id="ag1"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
        <div class="agree-text">I agree not to reproduce, distribute, forward, screenshot, or disclose any portion of this document to any party not explicitly authorized by FinanceOS, Inc.</div>
      </div>
      <div class="agree-row" onclick="toggleAgree(2,this)">
        <div class="agree-check" id="ag2"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
        <div class="agree-text">I understand that my access to this document is logged, watermarked with my identity, and subject to audit. Unauthorized distribution may result in legal action including injunctive relief and damages.</div>
      </div>

      <div class="sig-block" id="sigBlock">
        <div class="sig-label">Electronic Signature</div>
        <div class="sig-canvas" id="sigCanvas" onclick="signDocument()">
          <span class="sig-placeholder"><svg viewBox="0 0 24 24"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>Click to sign</span>
          <span class="sig-text" id="sigText"></span>
        </div>
        <div class="sig-meta">
          <span id="sigDate">Date: —</span>
          <span id="sigSession">Session: —</span>
        </div>
      </div>

      <button class="acknowledge-btn" id="ackBtn" onclick="acknowledgeDoc()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Acknowledge & Close Document
      </button>
    </div>

    <!-- Footer -->
    <div class="doc-footer">
      <div style="max-width:60%;line-height:1.5">This document and all information herein is the confidential property of FinanceOS, Inc. Reproduction or distribution without written consent is strictly prohibited. © 2026 FinanceOS, Inc.</div>
      <div id="footerSession">—</div>
    </div>
  </div><!-- /doc-card -->
</div><!-- /doc-wrap -->
</div><!-- /docScreen -->

<!-- ═══ AUDIT TRAIL ═══ -->
<div class="audit-toggle" id="auditToggle" onclick="toggleAudit()" style="display:none">
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
</div>
<div class="audit-panel" id="auditPanel">
  <div class="audit-head">
    <span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Audit Trail</span>
    <div class="audit-close" onclick="toggleAudit()"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
  </div>
  <div class="audit-list" id="auditList"></div>
</div>


` }} />
    </>
  );
}
