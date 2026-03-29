'use client';

import { useEffect, useRef } from 'react';

export default function V3DashboardWorkspacePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Tab switching with animated underline
function switchTab(tab){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  const bar=document.getElementById('tabBar');
  const rect=tab.getBoundingClientRect();
  const barRect=bar.getBoundingClientRect();
  bar.style.setProperty('--tab-x',(rect.left-barRect.left)+'px');
  bar.style.setProperty('--tab-w',rect.width+'px');
}

// Initialize tab indicator
requestAnimationFrame(()=>{
  const active=document.querySelector('.tab.active');
  if(active){
    const bar=document.getElementById('tabBar');
    const rect=active.getBoundingClientRect();
    const barRect=bar.getBoundingClientRect();
    bar.style.setProperty('--tab-x',(rect.left-barRect.left)+'px');
    bar.style.setProperty('--tab-w',rect.width+'px');
  }
});

// Scroll-triggered stagger
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.animationPlayState='running';
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.1});
document.querySelectorAll('.fade-up').forEach(el=>{
  el.style.animationPlayState='paused';
  observer.observe(el);
});

// Member row hover sound-like haptic (visual pulse on avatar)
document.querySelectorAll('.member').forEach(row=>{
  row.addEventListener('mouseenter',()=>{
    const avatar=row.querySelector('.avatar');
    if(avatar){
      avatar.style.transition='transform .15s cubic-bezier(0.22,1,0.36,1)';
      avatar.style.transform='scale(1.08)';
      setTimeout(()=>{
        avatar.style.transform='scale(1.04)';
      },150);
    }
  });
  row.addEventListener('mouseleave',()=>{
    const avatar=row.querySelector('.avatar');
    if(avatar)avatar.style.transform='';
  });
});`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
:root{
  --bg:#ffffff;--bg-elevated:#f8f9fb;--bg-card:#ffffff;--bg-card-hover:#f3f5f8;
  --border:#e5e7ec;--border-accent:#d1d5de;
  --text:#0f1729;--text-sec:#4b5563;--text-muted:#9ca3af;
  --blue:#3b82f6;--purple:#8b5cf6;--green:#10b981;--amber:#f59e0b;--cyan:#06b6d4;--rose:#f43f5e;--indigo:#6366f1;
  --gradient:linear-gradient(135deg,#3b82f6,#8b5cf6);
  --gradient-subtle:linear-gradient(135deg,rgba(59,130,246,0.04),rgba(139,92,246,0.04));
  --sans:'Manrope',system-ui,-apple-system,sans-serif;
  --mono:'JetBrains Mono',ui-monospace,monospace;
  --r:12px;--r-lg:16px;--r-xl:20px;
  --shadow:0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.03);
  --shadow-lg:0 4px 24px rgba(0,0,0,0.06),0 12px 48px rgba(0,0,0,0.04);
  --glass:rgba(255,255,255,0.7);--glass-border:rgba(0,0,0,0.05);
  color-scheme:light;
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg-elevated);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased;line-height:1.7;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;text-rendering:optimizeLegibility}
::selection{background:rgba(59,130,246,0.15)}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);filter:blur(3px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.4}}
@keyframes breathe{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.3)}50%{box-shadow:0 0 0 6px rgba(16,185,129,0)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes borderRotate{0%{--angle:0deg}100%{--angle:360deg}}
@keyframes ringPulse{0%,100%{stroke-dashoffset:0}50%{stroke-dashoffset:2}}
@keyframes tabSlide{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@property --angle{syntax:'<angle>';initial-value:0deg;inherits:false}
@keyframes spin{to{--angle:360deg}}

.fade-up{animation:fadeUp .6s cubic-bezier(0.22,1,0.36,1) both}
.fd1{animation-delay:.05s}.fd2{animation-delay:.1s}.fd3{animation-delay:.15s}
.fd4{animation-delay:.2s}.fd5{animation-delay:.25s}.fd6{animation-delay:.3s}
.fd7{animation-delay:.35s}.fd8{animation-delay:.4s}

/* =============================================
   WORKSPACE SHELL
   ============================================= */
.workspace{width:100%;max-width:860px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-xl);overflow:hidden;box-shadow:var(--shadow-lg),0 0 80px rgba(59,130,246,0.03);position:relative}
.workspace::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--gradient);z-index:10}

/* Title bar (macOS style) */
.workspace-titlebar{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid var(--border);background:var(--bg-elevated);position:relative}
.titlebar-dots{display:flex;gap:6px}
.titlebar-dot{width:10px;height:10px;border-radius:50%;transition:all .2s}
.titlebar-dot:nth-child(1){background:#ff5f57}.titlebar-dot:nth-child(2){background:#ffbd2e}.titlebar-dot:nth-child(3){background:#28ca41}
.titlebar-dot:hover{transform:scale(1.2)}
.titlebar-label{flex:1;text-align:center;font-size:11px;font-weight:600;color:var(--text-muted);letter-spacing:.02em}
.titlebar-actions{display:flex;gap:6px}
.titlebar-action{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s;border:none;background:none;font-size:12px}
.titlebar-action:hover{background:rgba(0,0,0,0.04);color:var(--text)}

/* =============================================
   TAB BAR
   ============================================= */
.tab-bar{display:flex;gap:0;border-bottom:1px solid var(--border);background:var(--bg-card);padding:0 20px;position:relative}
.tab-bar::after{content:'';position:absolute;bottom:-1px;left:var(--tab-x,20px);width:var(--tab-w,80px);height:2px;background:var(--gradient);border-radius:2px 2px 0 0;transition:all .35s cubic-bezier(0.22,1,0.36,1)}
.tab{padding:14px 20px;font-size:12px;font-weight:700;color:var(--text-muted);cursor:pointer;border:none;background:none;font-family:var(--sans);transition:all .25s;position:relative;letter-spacing:.01em;display:flex;align-items:center;gap:8px}
.tab:hover{color:var(--text-sec)}
.tab.active{color:var(--text)}
.tab-count{font-size:9px;font-weight:800;background:rgba(59,130,246,0.08);color:var(--blue);padding:2px 7px;border-radius:4px;font-family:var(--mono);min-width:18px;text-align:center;transition:all .25s}
.tab.active .tab-count{background:var(--gradient);color:#fff}
.tab-icon{width:14px;height:14px;opacity:.5;transition:opacity .25s}
.tab.active .tab-icon{opacity:1}

/* =============================================
   WORKSPACE HEADER
   ============================================= */
.ws-header{padding:24px 28px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}
.ws-header-left{display:flex;align-items:center;gap:14px}
.ws-header-icon{width:40px;height:40px;border-radius:12px;background:var(--gradient);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(59,130,246,0.2);position:relative}
.ws-header-icon::after{content:'';position:absolute;inset:0;border-radius:12px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.2)}
.ws-header-icon svg{width:18px;height:18px;color:#fff}
.ws-header-title{font-size:16px;font-weight:800;letter-spacing:-.02em}
.ws-header-sub{font-size:11px;color:var(--text-muted);font-weight:500;margin-top:1px}
.ws-header-sub span{color:var(--green);font-weight:700}

/* Search & Actions */
.ws-actions{display:flex;gap:8px;align-items:center}
.ws-search{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;border:1px solid var(--border);background:var(--bg-elevated);font-size:11px;color:var(--text-muted);cursor:pointer;transition:all .25s;min-width:180px}
.ws-search:hover{border-color:rgba(59,130,246,0.2);box-shadow:0 0 0 3px rgba(59,130,246,0.04)}
.ws-search svg{width:13px;height:13px;opacity:.4}
.ws-search kbd{margin-left:auto;font-size:9px;font-family:var(--mono);background:rgba(0,0,0,0.04);padding:2px 5px;border-radius:3px;color:var(--text-muted);font-weight:600}
.ws-btn{padding:8px 16px;border-radius:10px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--sans);transition:all .25s;display:flex;align-items:center;gap:6px;border:none}
.ws-btn-primary{background:var(--gradient);color:#fff;box-shadow:0 2px 8px rgba(59,130,246,0.2)}
.ws-btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(59,130,246,0.25)}
.ws-btn-ghost{background:none;color:var(--text-muted);border:1px solid var(--border)}
.ws-btn-ghost:hover{border-color:rgba(59,130,246,0.2);color:var(--blue)}

/* =============================================
   MEMBER LIST
   ============================================= */
.member-list{padding:0}

.member{display:flex;align-items:center;gap:16px;padding:18px 28px;border-bottom:1px solid rgba(0,0,0,0.03);transition:all .3s cubic-bezier(0.22,1,0.36,1);position:relative;cursor:default}
.member:last-child{border-bottom:none}
.member::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gradient);opacity:0;transition:opacity .3s;border-radius:0 3px 3px 0}
.member:hover{background:linear-gradient(90deg,rgba(59,130,246,0.02),transparent 60%)}
.member:hover::before{opacity:1}

/* Avatar */
.avatar{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;position:relative;flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,0.08);transition:transform .3s cubic-bezier(0.22,1,0.36,1)}
.member:hover .avatar{transform:scale(1.06)}
.avatar::after{content:'';position:absolute;inset:0;border-radius:14px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.25),inset 0 -1px 0 rgba(0,0,0,0.1)}
.avatar-mf{background:linear-gradient(135deg,#3b82f6,#6366f1)}
.avatar-sc{background:linear-gradient(135deg,#8b5cf6,#a855f7)}
.avatar-jr{background:linear-gradient(135deg,#06b6d4,#3b82f6)}
.avatar-pp{background:linear-gradient(135deg,#10b981,#059669)}
.avatar-dk{background:linear-gradient(135deg,#f59e0b,#f97316)}

/* Status indicator */
.avatar-status{position:absolute;bottom:-1px;right:-1px;width:13px;height:13px;border-radius:50%;border:2.5px solid var(--bg-card);z-index:1}
.status-online{background:var(--green);animation:breathe 3s ease-in-out infinite}
.status-away{background:var(--amber)}
.status-busy{background:var(--rose)}
.status-offline{background:var(--text-muted);opacity:.4}

/* Member Info */
.member-info{flex:1;min-width:0}
.member-top{display:flex;align-items:center;gap:10px;margin-bottom:3px}
.member-name{font-size:14px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.member-role-badge{font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:5px;white-space:nowrap}
.badge-owner{background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(99,102,241,0.1));color:var(--indigo);border:1px solid rgba(99,102,241,0.12)}
.badge-admin{background:rgba(139,92,246,0.08);color:var(--purple);border:1px solid rgba(139,92,246,0.1)}
.badge-manager{background:rgba(6,182,212,0.08);color:var(--cyan);border:1px solid rgba(6,182,212,0.1)}
.badge-budget{background:rgba(16,185,129,0.08);color:var(--green);border:1px solid rgba(16,185,129,0.1)}
.badge-viewer{background:rgba(0,0,0,0.03);color:var(--text-muted);border:1px solid rgba(0,0,0,0.05)}

.member-meta{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--text-muted)}
.member-title{font-weight:600;color:var(--text-sec)}
.member-sep{width:3px;height:3px;border-radius:50%;background:var(--text-muted);opacity:.3}
.member-dept{font-weight:500;display:flex;align-items:center;gap:4px}
.member-dept-dot{width:5px;height:5px;border-radius:2px}
.dept-exec{background:var(--blue)}
.dept-finance{background:var(--purple)}
.dept-accounting{background:var(--green)}
.dept-revops{background:var(--amber)}

/* Status message */
.member-status{margin-top:6px;display:flex;align-items:center;gap:6px}
.status-msg{font-size:11px;color:var(--text-muted);font-style:italic;font-weight:500;display:flex;align-items:center;gap:6px}
.status-msg-icon{width:12px;height:12px;opacity:.4}
.member-time{font-size:10px;color:var(--text-muted);font-weight:600;opacity:.6;white-space:nowrap}

/* Actions */
.member-actions{display:flex;gap:4px;opacity:0;transform:translateX(8px);transition:all .3s cubic-bezier(0.22,1,0.36,1)}
.member:hover .member-actions{opacity:1;transform:translateX(0)}
.action-btn{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all .2s;border:1px solid transparent;background:none;position:relative}
.action-btn::after{content:attr(data-tooltip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);font-size:9px;font-weight:700;color:#fff;background:var(--text);padding:4px 8px;border-radius:5px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s,transform .15s;transform:translateX(-50%) translateY(4px)}
.action-btn:hover::after{opacity:1;transform:translateX(-50%) translateY(0)}
.action-btn:hover{background:rgba(59,130,246,0.06);color:var(--blue);border-color:rgba(59,130,246,0.1)}
.action-btn svg{width:14px;height:14px}
.action-btn.primary-action{background:rgba(59,130,246,0.06);color:var(--blue);border-color:rgba(59,130,246,0.1)}
.action-btn.primary-action:hover{background:rgba(59,130,246,0.12);transform:scale(1.08)}

/* =============================================
   FOOTER STATS
   ============================================= */
.ws-footer{display:flex;align-items:center;justify-content:space-between;padding:16px 28px;border-top:1px solid var(--border);background:var(--bg-elevated)}
.ws-footer-stats{display:flex;gap:20px}
.ws-footer-stat{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:600;color:var(--text-muted)}
.ws-footer-stat-value{font-weight:800;color:var(--text);font-family:var(--mono)}
.ws-footer-stat-dot{width:6px;height:6px;border-radius:50%}
.ws-footer-link{font-size:10px;font-weight:700;color:var(--blue);text-decoration:none;display:flex;align-items:center;gap:4px;transition:gap .2s}
.ws-footer-link:hover{gap:8px}

/* =============================================
   RESPONSIVE
   ============================================= */
@media(max-width:640px){
  body{padding:16px 12px}
  .workspace{border-radius:var(--r-lg)}
  .member{padding:14px 18px;gap:12px}
  .ws-header{padding:18px;flex-wrap:wrap;gap:12px}
  .ws-actions{width:100%}
  .ws-search{flex:1}
  .tab{padding:12px 14px;font-size:11px}
  .member-actions{display:none}
  .avatar{width:38px;height:38px;border-radius:12px;font-size:13px}
  .ws-footer-stats{gap:12px}
  .ws-footer{flex-wrap:wrap;gap:10px}
}

/* Prefers reduced motion */
@media(prefers-reduced-motion:reduce){
  *{animation-duration:0s!important;transition-duration:0s!important}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<div class="workspace fade-up">

  <!-- Title Bar -->
  <div class="workspace-titlebar">
    <div class="titlebar-dots">
      <span class="titlebar-dot"></span>
      <span class="titlebar-dot"></span>
      <span class="titlebar-dot"></span>
    </div>
    <div class="titlebar-label">finance-os.app/workspace</div>
    <div class="titlebar-actions">
      <button class="titlebar-action" title="Minimize">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
      </button>
      <button class="titlebar-action" title="Maximize">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
      </button>
    </div>
  </div>

  <!-- Tab Bar -->
  <div class="tab-bar" id="tabBar">
    <button class="tab active fade-up fd1" onclick="switchTab(this)">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      Members <span class="tab-count">5</span>
    </button>
    <button class="tab fade-up fd2" onclick="switchTab(this)">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      Messages <span class="tab-count">12</span>
    </button>
    <button class="tab fade-up fd3" onclick="switchTab(this)">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      Tasks <span class="tab-count">8</span>
    </button>
    <button class="tab fade-up fd4" onclick="switchTab(this)">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      Activity
    </button>
  </div>

  <!-- Header -->
  <div class="ws-header fade-up fd3">
    <div class="ws-header-left">
      <div class="ws-header-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div>
        <div class="ws-header-title">Finance Team</div>
        <div class="ws-header-sub"><span>4 online</span> · 5 members total</div>
      </div>
    </div>
    <div class="ws-actions">
      <div class="ws-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        Search members…
        <kbd>⌘K</kbd>
      </div>
      <button class="ws-btn ws-btn-primary">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Invite
      </button>
    </div>
  </div>

  <!-- Member List -->
  <div class="member-list">

    <!-- Malik Frazier -->
    <div class="member fade-up fd4">
      <div class="avatar avatar-mf">
        MF
        <span class="avatar-status status-online"></span>
      </div>
      <div class="member-info">
        <div class="member-top">
          <span class="member-name">Malik Frazier</span>
          <span class="member-role-badge badge-owner">Owner</span>
        </div>
        <div class="member-meta">
          <span class="member-title">CEO & Founder</span>
          <span class="member-sep"></span>
          <span class="member-dept"><span class="member-dept-dot dept-exec"></span> Executive</span>
          <span class="member-sep"></span>
          <span class="member-time">Now</span>
        </div>
        <div class="member-status">
          <span class="status-msg">
            <svg class="status-msg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
            "Working on Q1 close"
          </span>
        </div>
      </div>
      <div class="member-actions">
        <button class="action-btn primary-action" data-tooltip="Message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Assign Task">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Schedule">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Profile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Share Report">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Permissions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </button>
      </div>
    </div>

    <!-- Sarah Chen -->
    <div class="member fade-up fd5">
      <div class="avatar avatar-sc">
        SC
        <span class="avatar-status status-online"></span>
      </div>
      <div class="member-info">
        <div class="member-top">
          <span class="member-name">Sarah Chen</span>
          <span class="member-role-badge badge-admin">Admin</span>
        </div>
        <div class="member-meta">
          <span class="member-title">VP of Finance</span>
          <span class="member-sep"></span>
          <span class="member-dept"><span class="member-dept-dot dept-finance"></span> Finance</span>
          <span class="member-sep"></span>
          <span class="member-time">2 min ago</span>
        </div>
        <div class="member-status">
          <span class="status-msg">
            <svg class="status-msg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            "Reviewing forecasts"
          </span>
        </div>
      </div>
      <div class="member-actions">
        <button class="action-btn primary-action" data-tooltip="Message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Assign Task">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Schedule">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Profile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Share Report">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Permissions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </button>
      </div>
    </div>

    <!-- James Rodriguez -->
    <div class="member fade-up fd6">
      <div class="avatar avatar-jr">
        JR
        <span class="avatar-status status-busy"></span>
      </div>
      <div class="member-info">
        <div class="member-top">
          <span class="member-name">James Rodriguez</span>
          <span class="member-role-badge badge-manager">Manager</span>
        </div>
        <div class="member-meta">
          <span class="member-title">FP&A Manager</span>
          <span class="member-sep"></span>
          <span class="member-dept"><span class="member-dept-dot dept-finance"></span> Finance</span>
          <span class="member-sep"></span>
          <span class="member-time">15 min ago</span>
        </div>
        <div class="member-status">
          <span class="status-msg">
            <svg class="status-msg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            "In a meeting until 3pm"
          </span>
        </div>
      </div>
      <div class="member-actions">
        <button class="action-btn primary-action" data-tooltip="Message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Assign Task">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Schedule">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Profile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Share Report">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Permissions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </button>
      </div>
    </div>

    <!-- Priya Patel -->
    <div class="member fade-up fd7">
      <div class="avatar avatar-pp">
        PP
        <span class="avatar-status status-online"></span>
      </div>
      <div class="member-info">
        <div class="member-top">
          <span class="member-name">Priya Patel</span>
          <span class="member-role-badge badge-budget">Budget Owner</span>
        </div>
        <div class="member-meta">
          <span class="member-title">Controller</span>
          <span class="member-sep"></span>
          <span class="member-dept"><span class="member-dept-dot dept-accounting"></span> Accounting</span>
          <span class="member-sep"></span>
          <span class="member-time">Just now</span>
        </div>
      </div>
      <div class="member-actions">
        <button class="action-btn primary-action" data-tooltip="Message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Assign Task">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Schedule">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Profile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Share Report">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Permissions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </button>
      </div>
    </div>

    <!-- David Kim -->
    <div class="member fade-up fd8">
      <div class="avatar avatar-dk">
        DK
        <span class="avatar-status status-away"></span>
      </div>
      <div class="member-info">
        <div class="member-top">
          <span class="member-name">David Kim</span>
          <span class="member-role-badge badge-viewer">Viewer</span>
        </div>
        <div class="member-meta">
          <span class="member-title">Revenue Analyst</span>
          <span class="member-sep"></span>
          <span class="member-dept"><span class="member-dept-dot dept-revops"></span> RevOps</span>
          <span class="member-sep"></span>
          <span class="member-time">1 hr ago</span>
        </div>
      </div>
      <div class="member-actions">
        <button class="action-btn primary-action" data-tooltip="Message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Assign Task">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Schedule">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Profile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button class="action-btn" data-tooltip="Share Report">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
      </div>
    </div>

  </div>

  <!-- Footer Stats -->
  <div class="ws-footer fade-up fd8">
    <div class="ws-footer-stats">
      <div class="ws-footer-stat">
        <span class="ws-footer-stat-dot" style="background:var(--green)"></span>
        <span class="ws-footer-stat-value">4</span> online
      </div>
      <div class="ws-footer-stat">
        <span class="ws-footer-stat-dot" style="background:var(--blue)"></span>
        <span class="ws-footer-stat-value">8</span> open tasks
      </div>
      <div class="ws-footer-stat">
        <span class="ws-footer-stat-dot" style="background:var(--purple)"></span>
        <span class="ws-footer-stat-value">12</span> unread
      </div>
    </div>
    <a href="#" class="ws-footer-link">
      Manage team
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>
  </div>

</div>

<!-- Scripts -->


` }} />
    </>
  );
}
