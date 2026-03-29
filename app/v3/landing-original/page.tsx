'use client';

import { useEffect, useRef } from 'react';

export default function V3LandingOriginalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// Mock bars
const barsEl=document.getElementById('mockBars');
if(barsEl){[35,50,62,45,70,58,78,65,82,72,55,48].forEach((h,i)=>{const b=document.createElement('div');b.className='mock-bar';b.style.height=h+'%';b.style.animationDelay=(0.8+i*0.05)+'s';barsEl.appendChild(b);});}

// Nav scroll effect
window.addEventListener('scroll',()=>{document.getElementById('nav').classList.toggle('scrolled',window.scrollY>20);});

// Scroll reveal
const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.stagger').forEach(el=>obs.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth',block:'start'});});});`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#F8FAFC;--dark:#030711;--surface:#fff;--card:#fff;
  --blue:#3B82F6;--cyan:#22D3EE;--green:#10B981;--purple:#8B5CF6;--amber:#F59E0B;--red:#EF4444;
  --t1:#0F172A;--t2:#334155;--t3:#64748B;--t4:#94A3B8;
  --border:#E2E8F0;--radius:16px;--radius-sm:10px;
  --ease:cubic-bezier(0.16,1,0.3,1);
  --font:'DM Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
}
body{font-family:var(--font);color:var(--t1);-webkit-font-smoothing:antialiased;overflow-x:hidden;background:#fff;}

/* ANIMATIONS */
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)}50%{box-shadow:0 0 0 14px rgba(16,185,129,0)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes heroReveal{from{opacity:0;transform:translateY(20px);filter:blur(4px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
@keyframes navSlide{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(34,211,238,0.05)}50%{box-shadow:0 0 40px rgba(139,92,246,0.1)}}
@keyframes borderGlow{0%,100%{border-color:rgba(34,211,238,0.15)}50%{border-color:rgba(139,92,246,0.25)}}
@keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes typeCursor{0%,100%{opacity:1}50%{opacity:0}}

.reveal{opacity:0;transform:translateY(28px);transition:opacity 0.7s var(--ease),transform 0.7s var(--ease);}
.reveal.visible{opacity:1;transform:none;}
.reveal-left{opacity:0;transform:translateX(-40px);transition:opacity 0.7s var(--ease),transform 0.7s var(--ease);}
.reveal-left.visible{opacity:1;transform:none;}
.reveal-right{opacity:0;transform:translateX(40px);transition:opacity 0.7s var(--ease),transform 0.7s var(--ease);}
.reveal-right.visible{opacity:1;transform:none;}
.stagger.visible>*{opacity:1;transform:none;}
.stagger>*{opacity:0;transform:translateY(20px);transition:opacity 0.5s var(--ease),transform 0.5s var(--ease);}
.stagger.visible>*:nth-child(1){transition-delay:.05s}.stagger.visible>*:nth-child(2){transition-delay:.1s}.stagger.visible>*:nth-child(3){transition-delay:.15s}.stagger.visible>*:nth-child(4){transition-delay:.2s}.stagger.visible>*:nth-child(5){transition-delay:.25s}.stagger.visible>*:nth-child(6){transition-delay:.3s}.stagger.visible>*:nth-child(7){transition-delay:.35s}.stagger.visible>*:nth-child(8){transition-delay:.4s}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 40px;height:64px;display:flex;align-items:center;background:rgba(255,255,255,0.92);backdrop-filter:blur(20px) saturate(1.5);border-bottom:1px solid var(--border);animation:navSlide 0.6s var(--ease) both;transition:box-shadow 0.3s;}
.nav.scrolled{box-shadow:0 2px 20px rgba(0,0,0,0.06);}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
.nav-logo svg{width:32px;height:32px;}
.nav-logo span{font-size:17px;font-weight:800;color:var(--t1);letter-spacing:-0.03em;}
.nav-links{display:flex;gap:28px;margin-left:50px;}
.nav-links a{font-size:13px;font-weight:500;color:var(--t3);text-decoration:none;transition:color 0.2s;position:relative;}.nav-links a:hover,.nav-links a.active{color:var(--t1);font-weight:600;}
.nav-right{margin-left:auto;display:flex;align-items:center;gap:12px;}
.btn-ghost{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid var(--border);background:transparent;color:var(--t2);cursor:pointer;transition:all 0.2s;text-decoration:none;}.btn-ghost:hover{border-color:var(--t4);color:var(--t1);}
.btn-primary{padding:8px 22px;border-radius:8px;font-size:13px;font-weight:700;border:none;background:var(--green);color:#fff;cursor:pointer;transition:all 0.25s var(--ease);text-decoration:none;display:inline-flex;align-items:center;gap:6px;}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(16,185,129,0.3);}
.btn-large{padding:14px 32px;font-size:15px;border-radius:12px;}
.btn-outline{padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;border:1px solid var(--border);background:#fff;color:var(--t1);cursor:pointer;transition:all 0.25s;display:inline-flex;align-items:center;gap:8px;text-decoration:none;}.btn-outline:hover{border-color:var(--t4);transform:translateY(-2px);}

/* TOP BANNER */
.top-banner{background:linear-gradient(90deg,#030711,#1E1B4B);padding:8px 40px;text-align:center;font-size:12px;color:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;gap:8px;}
.top-banner a{color:var(--cyan);font-weight:600;text-decoration:none;}

/* HERO */
.hero{padding:130px 40px 80px;text-align:center;background:#fff;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-300px;left:50%;transform:translateX(-50%);width:1200px;height:1200px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,0.04) 0%,rgba(139,92,246,0.02) 40%,transparent 70%);pointer-events:none;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:20px;border:1px solid rgba(16,185,129,0.2);background:rgba(16,185,129,0.04);font-size:12px;font-weight:600;margin-bottom:28px;animation:heroReveal 0.6s var(--ease) 0.1s both;}
.hero-badge .dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s ease infinite;}
.hero-badge .new-tag{background:var(--green);color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px;text-transform:uppercase;}
.hero h1{font-size:clamp(36px,5.5vw,62px);font-weight:900;line-height:1.1;letter-spacing:-0.035em;max-width:820px;margin:0 auto 24px;}
.hero h1 .grad{background:linear-gradient(135deg,var(--cyan),var(--purple),var(--green),var(--blue));background-size:300% 300%;animation:gradientShift 6s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
@keyframes colorCycle{0%{color:#22D3EE}20%{color:#8B5CF6}40%{color:#10B981}60%{color:#3B82F6}80%{color:#F59E0B}100%{color:#22D3EE}}
.hero h1 span.w{display:inline-block;animation:heroReveal 0.5s var(--ease) both;}
.hero p{font-size:17px;color:var(--t3);max-width:580px;margin:0 auto 36px;line-height:1.7;animation:heroReveal 0.6s var(--ease) 0.4s both;}
.hero-form{display:flex;gap:10px;justify-content:center;max-width:460px;margin:0 auto 16px;animation:heroReveal 0.6s var(--ease) 0.5s both;}
.hero-form input{flex:1;padding:14px 18px;border-radius:12px;border:1px solid var(--border);background:#fff;color:var(--t1);font-size:14px;font-family:var(--font);outline:none;transition:all 0.3s;}
.hero-form input:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(16,185,129,0.1);}
.hero-form input::placeholder{color:var(--t4);}
.hero-trust{font-size:11px;color:var(--t4);margin-bottom:20px;animation:heroReveal 0.6s var(--ease) 0.6s both;}
.hero-badges{display:flex;gap:10px;justify-content:center;margin-bottom:20px;flex-wrap:wrap;animation:heroReveal 0.6s var(--ease) 0.65s both;}
.hero-pill{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:16px;border:1px solid var(--border);font-size:11px;font-weight:600;color:var(--t2);background:#fff;}
.hero-pill .pill-dot{width:5px;height:5px;border-radius:50%;background:var(--green);}
.hero-ctas2{display:flex;gap:12px;justify-content:center;animation:heroReveal 0.6s var(--ease) 0.7s both;}
.btn-demo{padding:10px 22px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--border);background:#fff;color:var(--t1);cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;gap:6px;}.btn-demo:hover{border-color:var(--t4);}
.btn-signin{padding:10px 22px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid var(--border);background:#fff;color:var(--t3);cursor:pointer;transition:all 0.2s;text-decoration:none;}.btn-signin:hover{color:var(--t1);}

/* DASHBOARD MOCKUP */
.hero-mock{max-width:960px;margin:40px auto 0;background:#fff;border:1px solid var(--border);border-radius:16px;box-shadow:0 20px 80px rgba(0,0,0,0.08),0 0 0 1px rgba(0,0,0,0.02);overflow:hidden;animation:scaleIn 0.8s var(--ease) 0.8s both;}
.mock-browser{display:flex;align-items:center;gap:8px;padding:12px 16px;background:var(--bg);border-bottom:1px solid var(--border);}
.mock-dots{display:flex;gap:5px;}
.mock-dot{width:10px;height:10px;border-radius:50%;}
.mock-url{flex:1;text-align:center;font-size:11px;color:var(--t4);font-family:var(--mono);}
.mock-body{padding:20px;display:grid;grid-template-columns:180px 1fr 240px;gap:16px;min-height:300px;}
.mock-sidebar{padding:12px;border-right:1px solid var(--border);}
.mock-sidebar .ms-logo{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:800;margin-bottom:16px;color:var(--t1);}
.mock-sidebar .ms-logo svg{width:20px;height:20px;}
.mock-sidebar .ms-item{padding:6px 8px;border-radius:6px;font-size:11px;color:var(--t3);margin-bottom:2px;cursor:default;transition:all 0.15s;}
.mock-sidebar .ms-item.active{background:rgba(16,185,129,0.08);color:var(--green);font-weight:600;}
.mock-sidebar .ms-item .ms-dot{display:inline-block;width:5px;height:5px;border-radius:50%;margin-right:4px;}
.mock-main{padding:8px;}
.mock-greeting{font-size:15px;font-weight:800;margin-bottom:2px;}
.mock-sub{font-size:10px;color:var(--t4);margin-bottom:14px;}
.mock-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;}
.mock-kpi{padding:12px;border:1px solid var(--border);border-radius:10px;position:relative;}
.mock-kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:10px 10px 0 0;}
.mock-kpi:nth-child(1)::before{background:var(--green)}.mock-kpi:nth-child(2)::before{background:var(--cyan)}.mock-kpi:nth-child(3)::before{background:var(--purple)}
.mock-kpi .mk-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--t4);margin-bottom:3px;}
.mock-kpi .mk-value{font-size:18px;font-weight:900;font-family:var(--mono);letter-spacing:-0.02em;}
.mock-kpi .mk-change{font-size:9px;font-weight:600;color:var(--green);margin-top:2px;}
.mock-chart{background:var(--bg);border-radius:10px;padding:12px;border:1px solid var(--border);}
.mock-chart-label{font-size:9px;font-weight:700;color:var(--t4);text-transform:uppercase;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;}
.mock-chart-label .lock{font-size:8px;padding:2px 6px;border-radius:4px;background:rgba(245,158,11,0.1);color:var(--amber);font-weight:700;}
.mock-bars{display:flex;align-items:flex-end;gap:3px;height:60px;}
.mock-bar{flex:1;border-radius:2px 2px 0 0;background:var(--cyan);opacity:0.6;transform-origin:bottom;animation:barGrow 0.6s var(--ease) both;}
.mock-gate{text-align:center;padding:20px 10px;margin-top:8px;}
.mock-gate h5{font-size:12px;font-weight:800;margin-bottom:4px;}
.mock-gate p{font-size:9px;color:var(--t4);margin-bottom:8px;line-height:1.4;}
.mock-gate-btns{display:flex;gap:6px;justify-content:center;}
.mock-gate-btn{padding:5px 12px;border-radius:6px;font-size:9px;font-weight:700;border:none;cursor:default;}
.mock-copilot{padding:12px;border-left:1px solid var(--border);}
.mock-copilot-head{display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:800;margin-bottom:10px;}
.mock-copilot-head .live{font-size:8px;padding:2px 6px;border-radius:4px;background:rgba(16,185,129,0.1);color:var(--green);font-weight:700;}
.mock-ai-msg{padding:8px;border-radius:8px;background:var(--bg);font-size:9px;color:var(--t2);line-height:1.5;margin-bottom:6px;border:1px solid var(--border);}
.mock-ai-msg strong{color:var(--green);}
.mock-ai-input{display:flex;align-items:center;gap:4px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;font-size:9px;color:var(--t4);margin-top:8px;}
.mock-ai-input .cursor{display:inline-block;width:1px;height:10px;background:var(--t4);animation:typeCursor 1s ease infinite;}

/* TRUSTED BY */
.trusted{padding:48px 40px;background:#fff;border-bottom:1px solid var(--border);overflow:hidden;}
.trusted .t-label{text-align:center;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--t4);margin-bottom:24px;}
.trusted-logos{display:flex;align-items:center;justify-content:center;gap:48px;flex-wrap:wrap;opacity:0.45;filter:grayscale(1);}
.trusted-logos span{font-size:20px;font-weight:900;letter-spacing:-0.02em;color:var(--t1);}

/* SECTION SHARED */
.section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--green);text-align:center;margin-bottom:12px;}
.section-title{font-size:clamp(28px,3.5vw,42px);font-weight:900;text-align:center;letter-spacing:-0.03em;margin-bottom:14px;}
.section-sub{font-size:16px;color:var(--t3);text-align:center;max-width:560px;margin:0 auto 50px;line-height:1.6;}
.ico svg{stroke:currentColor;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}

/* FEATURES */
.features{padding:100px 40px;background:#fff;}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1100px;margin:0 auto;}
.feat-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:28px;transition:all 0.4s var(--ease);cursor:default;}
.feat-card:hover{transform:translateY(-5px);box-shadow:0 12px 40px rgba(0,0,0,0.06);border-color:rgba(16,185,129,0.2);}
.feat-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;transition:transform 0.3s var(--ease);}
.feat-card:hover .feat-icon{transform:scale(1.1);}
.feat-icon svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}
.feat-card h3{font-size:16px;font-weight:800;margin-bottom:8px;}
.feat-card p{font-size:13px;color:var(--t3);line-height:1.65;}

/* CUSTOMER STORIES */
.stories{padding:100px 40px;background:var(--bg);}
.stories-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:1100px;margin:0 auto;}
.story-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all 0.3s var(--ease);}
.story-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.06);}
.story-card.featured{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;}
.story-img{height:220px;background-size:cover;background-position:center;position:relative;}
.story-card.featured .story-img{height:100%;min-height:280px;}
.story-img .story-overlay{position:absolute;bottom:0;left:0;right:0;padding:12px 16px;display:flex;gap:12px;background:linear-gradient(transparent,rgba(0,0,0,0.7));}
.story-overlay .so-stat{text-align:center;color:#fff;}
.story-overlay .so-val{font-size:18px;font-weight:900;font-family:var(--mono);}
.story-overlay .so-label{font-size:8px;text-transform:uppercase;letter-spacing:0.04em;opacity:0.7;}
.story-body{padding:24px;}
.story-stars{display:flex;gap:2px;margin-bottom:10px;}
.story-stars svg{width:14px;height:14px;fill:var(--amber);stroke:none;}
.story-quote{font-size:14px;font-weight:500;line-height:1.65;color:var(--t1);margin-bottom:16px;font-style:italic;}
.story-author{display:flex;align-items:center;gap:10px;}
.story-avatar{width:36px;height:36px;border-radius:50%;background-size:cover;background-position:center;border:2px solid var(--border);}
.story-info .sa-name{font-size:13px;font-weight:700;}
.story-info .sa-role{font-size:11px;color:var(--green);font-weight:600;}
.story-info .sa-company{font-size:10px;color:var(--t4);}
.story-tags{display:flex;gap:6px;margin-top:12px;flex-wrap:wrap;}
.story-tag{font-size:9px;font-weight:600;padding:3px 8px;border-radius:6px;border:1px solid var(--border);color:var(--t3);}

/* AI AGENTS */
.ai-section{padding:100px 40px;background:#fff;}
.ai-inner{max-width:1100px;margin:0 auto;}
.ai-split{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center;margin-bottom:60px;}
.ai-text .section-label{text-align:left;}
.ai-text h2{font-size:34px;font-weight:900;letter-spacing:-0.02em;margin-bottom:14px;}
.ai-text p{font-size:15px;color:var(--t3);line-height:1.7;margin-bottom:20px;}
.ai-tags{display:flex;gap:8px;flex-wrap:wrap;}
.ai-tag{padding:5px 12px;border-radius:8px;border:1px solid rgba(16,185,129,0.2);background:rgba(16,185,129,0.04);font-size:11px;font-weight:600;color:var(--green);}
.ai-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:0 8px 30px rgba(0,0,0,0.04);}
.ai-card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:13px;font-weight:700;}
.ai-card-head .ai-badge{font-size:9px;padding:3px 8px;border-radius:6px;background:rgba(139,92,246,0.08);color:var(--purple);font-weight:700;}
.ai-chat-msg{padding:10px 14px;border-radius:10px;font-size:12px;line-height:1.6;margin-bottom:8px;}
.ai-chat-user{background:var(--bg);color:var(--t2);}
.ai-chat-ai{background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.1);color:var(--t1);}
.ai-chat-ai .thought{font-size:10px;font-weight:600;color:var(--green);margin-bottom:4px;display:flex;align-items:center;gap:4px;}
.ai-actions{display:flex;gap:6px;margin-top:8px;}
.ai-action{padding:4px 10px;border-radius:6px;border:1px solid var(--border);font-size:10px;font-weight:600;color:var(--t2);background:#fff;}

/* ROLES */
.roles{padding:100px 40px;background:var(--bg);}
.roles-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;max-width:1100px;margin:0 auto;}
.role-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all 0.3s var(--ease);}
.role-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.06);}
.role-img{height:160px;background-size:cover;background-position:center top;position:relative;}
.role-img .role-icon{position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.9);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;}
.role-img .role-icon svg{width:14px;height:14px;}
.role-body{padding:18px;}
.role-body h3{font-size:16px;font-weight:800;margin-bottom:6px;}
.role-body p{font-size:11px;color:var(--t3);line-height:1.5;margin-bottom:10px;}
.role-link{font-size:11px;font-weight:700;color:var(--green);text-decoration:none;display:inline-flex;align-items:center;gap:4px;}.role-link:hover{gap:8px;}

/* COMPARISON */
.compare{padding:100px 40px;background:#fff;}
.cmp-table{width:100%;max-width:1060px;margin:0 auto;border-collapse:collapse;}
.cmp-table th{padding:12px 16px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--t4);border-bottom:2px solid var(--border);text-align:center;}
.cmp-table th:first-child{text-align:left;font-size:10px;color:var(--t3);}
.cmp-table th.highlight{color:var(--green);}
.cmp-table td{padding:14px 16px;font-size:13px;border-bottom:1px solid var(--border);color:var(--t2);text-align:center;}
.cmp-table td:first-child{text-align:left;font-weight:500;}
.cmp-table tr:hover td{background:rgba(16,185,129,0.02);}
.cmp-table .ck{color:var(--green);}
.cmp-table .cx{color:var(--t4);opacity:0.3;}
.cmp-table .highlight-val{color:var(--green);font-weight:700;font-family:var(--mono);}

/* OUTCOMES */
.outcomes{padding:100px 40px;background:var(--bg);}
.outcomes-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1100px;margin:0 auto;}
.outcome-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:28px;transition:all 0.3s var(--ease);}
.outcome-card:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(0,0,0,0.05);}
.outcome-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
.outcome-icon svg{width:18px;height:18px;}
.outcome-card h3{font-size:16px;font-weight:800;margin-bottom:8px;}
.outcome-card p{font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:12px;}
.outcome-link{font-size:11px;font-weight:700;color:var(--green);text-decoration:none;}

/* CTA */
.cta-section{padding:100px 40px;background:linear-gradient(135deg,#030711 0%,#1E1B4B 100%);text-align:center;position:relative;overflow:hidden;}
.cta-section::before{content:'';position:absolute;top:-150px;right:-150px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%);pointer-events:none;}
.cta-section h2{font-size:clamp(28px,4vw,44px);font-weight:900;color:#fff;letter-spacing:-0.02em;margin-bottom:14px;}
.cta-section p{font-size:16px;color:rgba(255,255,255,0.5);max-width:480px;margin:0 auto 36px;}
.cta-form{display:flex;gap:10px;justify-content:center;max-width:440px;margin:0 auto;}
.cta-form input{flex:1;padding:14px 18px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;font-size:14px;font-family:var(--font);outline:none;transition:all 0.3s;}
.cta-form input:focus{border-color:var(--cyan);box-shadow:0 0 20px rgba(34,211,238,0.15);}
.cta-form input::placeholder{color:rgba(255,255,255,0.3);}

/* FOOTER */
.footer{padding:60px 40px 30px;background:var(--dark);border-top:1px solid rgba(255,255,255,0.05);}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr;gap:40px;max-width:1100px;margin:0 auto 40px;}
.footer-brand .fb-logo{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
.footer-brand .fb-logo svg{width:28px;height:28px;}
.footer-brand .fb-logo span{font-size:16px;font-weight:800;color:#fff;}
.footer-brand p{font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;max-width:260px;}
.footer-col h5{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:rgba(255,255,255,0.4);margin-bottom:14px;}
.footer-col a{display:block;font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;margin-bottom:8px;transition:color 0.2s;}.footer-col a:hover{color:#fff;}
.footer-bottom{max-width:1100px;margin:0 auto;padding-top:20px;border-top:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.25);}

@media(max-width:900px){
  .nav-links{display:none;}.feat-grid,.outcomes-grid{grid-template-columns:1fr;}.roles-grid{grid-template-columns:repeat(2,1fr);}.stories-grid{grid-template-columns:1fr;}.story-card.featured{grid-template-columns:1fr;}.ai-split{grid-template-columns:1fr;}.mock-body{grid-template-columns:1fr;}.mock-sidebar,.mock-copilot{display:none;}.footer-grid{grid-template-columns:1fr 1fr;}.cta-form,.hero-form{flex-direction:column;}.cmp-table{font-size:11px;}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- TOP BANNER -->
<div class="top-banner">
  <span>AI Copilot powered by Claude</span> &middot; <span>Visible reasoning for every financial insight.</span>
  <a href="#">Learn more</a>
</div>

<!-- NAV -->
<nav class="nav" id="nav">
  <a class="nav-logo" href="FinanceOS-Landing-Page.html"><svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#22D3EE"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><span>FinanceOS</span></a>
  <div class="nav-links">
    <a href="FinanceOS-Landing-Page.html" class="active">Solutions</a>
    <a href="FinanceOS-Integrations.html">Integrations</a>
    <a href="FinanceOS-About.html">Trust</a>
    <a href="FinanceOS-Pricing-Page.html">Pricing</a>
    <a href="FinanceOS-vs-Competitors.html">Compare</a>
  </div>
  <div class="nav-right">
    <a class="btn-ghost" href="FinanceOS-Login.html">Sign In</a>
    <a class="btn-primary" href="FinanceOS-Contact.html">Subscribe</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-badge"><span class="dot"></span> AI-NATIVE FP&A <span style="margin:0 6px;color:var(--t4);">|</span> Now in General Availability <span class="new-tag">NEW</span></div>
  <h1><span class="w" style="animation-delay:.2s">Financial </span><span class="w" style="animation-delay:.25s">planning </span><br/><span class="w" style="animation-delay:.3s">that </span><span class="grad w" style="animation-delay:.35s">thinks before</span><br/><span class="w" style="animation-delay:.4s">it answers</span></h1>
  <p>Connect your ERP, CRM, and billing data into a unified model with AI-powered variance detection, natural language querying, and visible reasoning.</p>
  <div class="hero-form">
    <input type="email" placeholder="Work email"/>
    <a class="btn-primary btn-large" href="FinanceOS-Contact.html">Get Started</a>
  </div>
  <div class="hero-trust">30-day money-back guarantee &middot; Cancel anytime &middot; Interactive demo after signup</div>
  <div class="hero-badges">
    <span class="hero-pill"><span class="pill-dot"></span> Smart alerts active</span>
    <span class="hero-pill"><span class="pill-dot" style="background:var(--cyan);"></span> Real-time email notifications</span>
  </div>
  <div class="hero-ctas2">
    <a class="btn-demo" href="FinanceOS-Contact.html"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg> Request a Guided Demo</a>
    <a class="btn-signin" href="FinanceOS-Login.html">Sign In to Explore</a>
  </div>

  <!-- DASHBOARD MOCKUP -->
  <div class="hero-mock">
    <div class="mock-browser">
      <div class="mock-dots"><div class="mock-dot" style="background:#EF4444;"></div><div class="mock-dot" style="background:#F59E0B;"></div><div class="mock-dot" style="background:#10B981;"></div></div>
      <div class="mock-url">app.finance-os.app/dashboard</div>
    </div>
    <div class="mock-body">
      <div class="mock-sidebar">
        <div class="ms-logo"><svg viewBox="0 0 32 32" fill="none" width="20" height="20"><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg> FinanceOS</div>
        <div class="ms-item active"><span class="ms-dot" style="background:var(--green);"></span> Dashboard</div>
        <div class="ms-item"><span class="ms-dot" style="background:var(--purple);"></span> AI Copilot</div>
        <div class="ms-item">P&L</div>
        <div class="ms-item">Forecast</div>
        <div class="ms-item">Scenarios</div>
        <div class="ms-item">Close Tasks</div>
        <div class="ms-item">Team</div>
        <div class="ms-item">Integrations</div>
      </div>
      <div class="mock-main">
        <div class="mock-greeting">Good afternoon, Alex</div>
        <div class="mock-sub">FY2025 YTD &middot; Revenue ahead by $2.09M</div>
        <div class="mock-kpis">
          <div class="mock-kpi"><div class="mk-label">Revenue</div><div class="mk-value">$12.4M</div><div class="mk-change">+12.3%</div></div>
          <div class="mock-kpi"><div class="mk-label">Gross Margin</div><div class="mk-value">78.2%</div><div class="mk-change">+2.1%</div></div>
          <div class="mock-kpi"><div class="mk-label">Net Income</div><div class="mk-value">$1.8M</div><div class="mk-change">+8.7%</div></div>
        </div>
        <div class="mock-chart">
          <div class="mock-chart-label">Revenue Performance <span class="lock">SECURE ACCESS REQUIRED</span></div>
          <div class="mock-bars" id="mockBars"></div>
          <div class="mock-gate">
            <h5>See the full platform in action</h5>
            <p>Create an account with your work email to access the interactive demo. Your data is protected by SOC 2 compliant infrastructure.</p>
            <div class="mock-gate-btns">
              <div class="mock-gate-btn" style="background:var(--green);color:#fff;">Create Free Account</div>
              <div class="mock-gate-btn" style="background:#fff;border:1px solid var(--border);color:var(--t2);">Schedule a Call</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mock-copilot">
        <div class="mock-copilot-head">AI Copilot <span class="live">LIVE</span></div>
        <div class="mock-ai-msg"><strong>Revenue is tracking 12.3% above budget</strong> driven by Enterprise expansion</div>
        <div class="mock-ai-msg">COGS increased 5.2% -- AWS hosting costs up, recommend reserved instances</div>
        <div class="mock-ai-msg">Q2 forecast confidence: 94.2% -- MAPE below 3% threshold</div>
        <div class="mock-ai-input"><span class="cursor"></span> Ask or build anything...</div>
      </div>
    </div>
  </div>
</section>

<!-- TRUSTED BY -->
<section class="trusted reveal">
  <div class="t-label">Trusted By</div>
  <div class="trusted-logos">
    <span>JPMorgan</span>
    <span>Deloitte</span>
    <span>EY</span>
    <span>Coca-Cola</span>
    <span>Salesforce</span>
    <span>Stripe</span>
  </div>
</section>

<!-- FEATURES -->
<section class="features" id="features">
  <div class="reveal">
    <div class="section-label">Why FinanceOS</div>
    <div class="section-title">Everything your finance team needs</div>
    <div class="section-sub">One platform to close, forecast, comply, and grow. Built by finance people, for finance people.</div>
  </div>
  <div class="feat-grid stagger reveal">
    <div class="feat-card"><div class="feat-icon" style="background:rgba(16,185,129,0.08);color:var(--green);"><svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div><h3>Close 5x Faster</h3><p>Automate month-end close with AI-powered workflows. Go from 15 days to 3 with real-time reconciliation and automated journal entries.</p></div>
    <div class="feat-card"><div class="feat-icon" style="background:rgba(139,92,246,0.08);color:var(--purple);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div><h3>AI Copilot</h3><p>Ask questions in plain English. Get instant variance analysis, trend detection, and anomaly alerts with visible reasoning you can verify.</p></div>
    <div class="feat-card"><div class="feat-icon" style="background:rgba(59,130,246,0.08);color:var(--blue);"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div><h3>Multi-Entity Consolidation</h3><p>Manage unlimited subsidiaries with automated intercompany eliminations, currency conversion, and consolidated reporting.</p></div>
    <div class="feat-card"><div class="feat-icon" style="background:rgba(34,211,238,0.08);color:var(--cyan);"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><h3>Real-Time Forecasting</h3><p>AI-driven revenue projections that update in real-time. Run scenario models, track variance, and present with confidence.</p></div>
    <div class="feat-card"><div class="feat-icon" style="background:rgba(245,158,11,0.08);color:var(--amber);"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><h3>SOX Compliance</h3><p>Built-in Section 404 controls, automated testing, comprehensive audit trails, and board-ready compliance dashboards.</p></div>
    <div class="feat-card"><div class="feat-icon" style="background:rgba(239,68,68,0.08);color:var(--red);"><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></div><h3>50+ Integrations</h3><p>Connect NetSuite, Salesforce, Stripe, Snowflake, Rippling, HubSpot, Ramp, and dozens more. Two-click setup, real-time sync.</p></div>
  </div>
</section>

<!-- CUSTOMER STORIES -->
<section class="stories">
  <div class="reveal">
    <div class="section-label">Customer Stories</div>
    <div class="section-title" style="color:var(--amber);">Finance leaders who made the switch</div>
  </div>
  <div class="stories-grid reveal">
    <div class="story-card">
      <div class="story-img" style="background-image:url('https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop');"></div>
      <div class="story-body">
        <div class="story-stars"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <div class="story-quote">"We replaced our entire Excel-based FP&A stack in one afternoon. The AI Copilot caught a $400K variance our team missed for two months straight."</div>
        <div class="story-author"><div class="story-avatar" style="background-image:url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face');"></div><div class="story-info"><span class="sa-name">Jordan K.</span> <span class="sa-role">VP of Finance</span><div class="sa-company">Series B SaaS &middot; $18M ARR</div></div></div>
        <div class="story-tags"><span class="story-tag">Replaced 3 tools</span><span class="story-tag">12-day close reduction</span></div>
      </div>
    </div>
    <div class="story-card">
      <div class="story-img" style="background-image:url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop');"></div>
      <div class="story-body">
        <div class="story-stars"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <div class="story-quote">"The scenario modeling alone is worth the subscription. We ran 14 what-if scenarios for our board meeting -- something that used to take our team a full week."</div>
        <div class="story-author"><div class="story-avatar" style="background-image:url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face');"></div><div class="story-info"><span class="sa-name">Sarah R.</span> <span class="sa-role">Director of FP&A</span><div class="sa-company">Growth Stage &middot; $45M ARR</div></div></div>
        <div class="story-tags"><span class="story-tag">95% faster reporting</span><span class="story-tag">14 scenarios in 1hr</span></div>
      </div>
    </div>
    <div class="story-card featured">
      <div class="story-body">
        <div class="story-stars"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <div class="story-quote" style="font-size:17px;">"We went from 3-day board deck cycles to 15-minute exports. The AI copilot caught a $2.1M revenue variance our team missed in manual review."</div>
        <div class="story-author"><div class="story-avatar" style="background-image:url('https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face');"></div><div class="story-info"><span class="sa-name">VP of Finance</span> <span class="sa-role">Series C SaaS</span><div class="sa-company">$42M ARR &middot; 12-person finance team &middot; Name withheld per NDA</div></div></div>
        <div class="story-tags"><span class="story-tag">Replaced 3 tools</span><span class="story-tag">12-day close reduction</span><span class="story-tag">95% faster reporting</span></div>
      </div>
      <div class="story-img" style="background-image:url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&h=500&fit=crop');"></div>
    </div>
  </div>
</section>

<!-- AI AGENTS -->
<section class="ai-section">
  <div class="reveal">
    <div class="section-label">AI Agents</div>
    <div class="section-title">AI that <span style="color:var(--green);">plans with you</span></div>
    <div class="section-sub">FinanceOS AI agents operate inside your planning environment, using your live data and business logic to support decisions in real time.</div>
  </div>
  <div class="ai-inner">
    <div class="ai-split">
      <div class="ai-text reveal-left">
        <div class="section-label" style="display:flex;align-items:center;gap:6px;"><span style="width:6px;height:6px;border-radius:50%;background:var(--green);"></span> AI Copilot</div>
        <h2>Real-time insights to accelerate decisions</h2>
        <p>Proactively scans your metrics, uncovers key trends, flags anomalies, and explains the "why" behind every variance -- with visible reasoning.</p>
        <div class="ai-tags">
          <span class="ai-tag">Variance Detection</span>
          <span class="ai-tag">Forecasting</span>
          <span class="ai-tag">Scenario Planning</span>
        </div>
      </div>
      <div class="ai-card reveal-right">
        <div class="ai-card-head">AI Copilot <span style="display:flex;align-items:center;gap:4px;"><span style="width:5px;height:5px;border-radius:50%;background:var(--green);"></span></span> <span class="ai-badge">Claude</span></div>
        <div class="ai-chat-msg ai-chat-user">"Can you analyze our current revenue growth and highlight the top contributors?"</div>
        <div class="ai-chat-msg ai-chat-ai">
          <div class="thought"><span style="width:5px;height:5px;border-radius:50%;background:var(--green);display:inline-block;"></span> THOUGHT & WORK PROCESS</div>
          Revenue grew <strong>+44.7% YoY</strong> to $51.2M. Enterprise expansion drove <strong>68%</strong> of the beat. AI module attach rate hit <strong>42%</strong>, up from 28%.
        </div>
        <div class="ai-actions">
          <span class="ai-action">Drill into segments</span>
          <span class="ai-action">Build forecast</span>
        </div>
      </div>
    </div>

    <div class="ai-split" style="direction:rtl;">
      <div class="ai-text reveal-right" style="direction:ltr;">
        <div class="section-label" style="display:flex;align-items:center;gap:6px;"><span style="width:6px;height:6px;border-radius:50%;background:var(--green);"></span> Scenario Modeler</div>
        <h2>Explore every possibility</h2>
        <p>Simulate scenarios in real time and receive clear, actionable recommendations based on your data, models, and business context.</p>
        <div class="ai-tags">
          <span class="ai-tag">What-If Analysis</span>
          <span class="ai-tag">Sensitivity</span>
          <span class="ai-tag">Monte Carlo</span>
        </div>
      </div>
      <div class="ai-card reveal-left" style="direction:ltr;">
        <div class="ai-card-head">Scenario Comparison</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:11px;min-width:100px;color:var(--t3);">Base Case</span><div style="flex:1;height:20px;background:var(--green);border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding:0 8px;"><span style="font-size:9px;font-weight:700;color:#fff;font-family:var(--mono);">$62.8M</span></div><span style="font-size:10px;font-family:var(--mono);color:var(--t3);min-width:40px;">7.4%</span></div>
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:11px;min-width:100px;color:var(--t3);">AI Breakout</span><div style="flex:1;height:20px;background:linear-gradient(90deg,var(--green),var(--cyan));border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding:0 8px;"><span style="font-size:9px;font-weight:700;color:#fff;font-family:var(--mono);">$68.4M</span></div><span style="font-size:10px;font-family:var(--mono);color:var(--t3);min-width:40px;">11.6%</span></div>
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:11px;min-width:100px;color:var(--t3);">Aggressive Hire</span><div style="flex:1;height:20px;background:var(--amber);border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding:0 8px;width:85%;"><span style="font-size:9px;font-weight:700;color:#fff;font-family:var(--mono);">$62.8M</span></div><span style="font-size:10px;font-family:var(--mono);color:var(--t3);min-width:40px;">2.8%</span></div>
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:11px;min-width:100px;color:var(--t3);">Mid-Market</span><div style="flex:1;height:20px;background:var(--purple);border-radius:4px;display:flex;align-items:center;justify-content:flex-end;padding:0 8px;width:90%;"><span style="font-size:9px;font-weight:700;color:#fff;font-family:var(--mono);">$66.1M</span></div><span style="font-size:10px;font-family:var(--mono);color:var(--t3);min-width:40px;">9.5%</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ROLES -->
<section class="roles">
  <div class="reveal">
    <div class="section-label">Tailored to Your Role</div>
    <div class="section-title">One platform. Every finance role.</div>
    <div class="section-sub">Every executive sees the KPIs that matter to them. Personalized dashboards are not an add-on -- they are how FinanceOS works.</div>
  </div>
  <div class="roles-grid stagger reveal">
    <div class="role-card">
      <div class="role-img" style="background-image:url('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop');">
        <div class="role-icon"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
      </div>
      <div class="role-body"><h3>CFO</h3><p>Revenue, margins, cash flow, ROIC, EPS, dividend yield, board deck export</p><a class="role-link" href="#">See CFO dashboard &rarr;</a></div>
    </div>
    <div class="role-card">
      <div class="role-img" style="background-image:url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop');">
        <div class="role-icon"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--purple)" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
      </div>
      <div class="role-body"><h3>CEO</h3><p>Strategic KPIs, segment growth, market position, Rule of 40, fundraising readiness</p><a class="role-link" href="#">See CEO dashboard &rarr;</a></div>
    </div>
    <div class="role-card">
      <div class="role-img" style="background-image:url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop');">
        <div class="role-icon"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--cyan)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9l3 3 3-3"/></svg></div>
      </div>
      <div class="role-body"><h3>Controller</h3><p>Close progress, reconciliation status, GL summary, AP/AR aging, compliance</p><a class="role-link" href="#">See Controller dashboard &rarr;</a></div>
    </div>
    <div class="role-card">
      <div class="role-img" style="background-image:url('https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&h=300&fit=crop');">
        <div class="role-icon"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--amber)" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg></div>
      </div>
      <div class="role-body"><h3>FP&A Manager</h3><p>Variance analysis, budget vs actual, forecast accuracy, scenario comparison</p><a class="role-link" href="#">See FP&A dashboard &rarr;</a></div>
    </div>
  </div>
</section>

<!-- OUTCOMES -->
<section class="outcomes">
  <div class="reveal">
    <div class="section-label">Built for Impact</div>
    <div class="section-title">What teams can accomplish</div>
    <div class="section-sub">Projected outcomes based on product capabilities and industry benchmarks.</div>
  </div>
  <div class="outcomes-grid stagger reveal">
    <div class="outcome-card">
      <div class="outcome-icon" style="background:rgba(16,185,129,0.08);color:var(--green);"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg></div>
      <h3>Accelerate your month-end close</h3>
      <p>AI copilot auto-generates variance commentary and flags accrual errors before your auditors see them.</p>
      <a class="outcome-link" href="#">Faster close cycles</a>
    </div>
    <div class="outcome-card">
      <div class="outcome-icon" style="background:rgba(139,92,246,0.08);color:var(--purple);"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5"><path d="M12 20V10M18 20V4M6 20v-4"/></svg></div>
      <h3>Model 3 M&A scenarios in 20 minutes</h3>
      <p>Side-by-side scenario comparison with live sensitivity sliders. No more two-week spreadsheet cycles.</p>
      <a class="outcome-link" href="#">Scenario modeling in minutes</a>
    </div>
    <div class="outcome-card">
      <div class="outcome-icon" style="background:rgba(34,211,238,0.08);color:var(--cyan);"><svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
      <h3>See AI reasoning you can actually verify</h3>
      <p>Unlike black-box copilots, FinanceOS shows every data source, assumption, and calculation chain.</p>
      <a class="outcome-link" href="#">Full transparency</a>
    </div>
  </div>
</section>

<!-- COMPARISON -->
<section class="compare reveal">
  <div class="section-title">How FinanceOS compares</div>
  <div class="section-sub">Enterprise capability at mid-market pricing. No 6-month implementation.</div>
  <table class="cmp-table">
    <thead><tr><th>Capability</th><th class="highlight">FinanceOS</th><th>Legacy EPM</th><th>Mid-Market FP&A</th><th>Startup Tools</th></tr></thead>
    <tbody>
      <tr><td>AI Copilot with visible reasoning</td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cx">&times;</td><td class="cx">&times;</td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
      <tr><td>Self-serve onboarding (days, not months)</td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cx">&times;</td><td class="cx">&times;</td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
      <tr><td>Published transparent pricing</td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cx">&times;</td><td class="cx">&times;</td><td class="cx">&times;</td></tr>
      <tr><td>Multi-entity consolidation</td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cx">&times;</td></tr>
      <tr><td>Scenario modeling (4+ side-by-side)</td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
      <tr><td>Real-time variance detection</td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cx">&times;</td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="cx">&times;</td></tr>
      <tr><td>SOC 2 Type II architecture</td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td><td class="ck"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--green)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></td></tr>
      <tr><td>Implementation time</td><td class="highlight-val">&lt; 48hr</td><td style="font-family:var(--mono);font-size:12px;">3-6 mo</td><td style="font-family:var(--mono);font-size:12px;">3-6 mo</td><td style="font-family:var(--mono);font-size:12px;">Weeks</td></tr>
      <tr><td>Starting price</td><td class="highlight-val">From $799/mo</td><td style="font-family:var(--mono);font-size:12px;">$200K+/yr</td><td style="font-family:var(--mono);font-size:12px;">$65K+/yr</td><td style="font-family:var(--mono);font-size:12px;">$30K+/yr</td></tr>
    </tbody>
  </table>
  <div style="text-align:center;margin-top:24px;"><a href="FinanceOS-Pricing-Page.html" style="font-size:13px;font-weight:700;color:var(--green);text-decoration:none;">View full competitive analysis &rarr;</a></div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="reveal">
    <h2>Ready to transform your<br/>finance operations?</h2>
    <p>Join 500+ finance teams closing faster, forecasting smarter, and staying audit-ready.</p>
    <div class="cta-form">
      <input type="email" placeholder="Enter your work email"/>
      <a class="btn-primary btn-large" href="FinanceOS-Contact.html" style="animation:pulse 3s ease infinite;">Get Started</a>
    </div>
    <div style="font-size:12px;color:rgba(255,255,255,0.3);margin-top:14px;">30-day money-back guarantee. Cancel anytime.</div>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="footer-grid">
    <div class="footer-brand"><div class="fb-logo"><svg viewBox="0 0 32 32" fill="none" width="28" height="28"><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><span>FinanceOS</span></div><p>The AI-powered command center for modern finance teams. Close faster. Forecast smarter. Stay compliant.</p></div>
    <div class="footer-col"><h5>Product</h5><a href="FinanceOS-Whats-New.html">Features</a><a href="FinanceOS-Pricing-Page.html">Pricing</a><a href="FinanceOS-Integrations.html">Integrations</a><a href="FinanceOS-vs-Competitors.html">Compare</a><a href="FinanceOS-Whats-New.html">Changelog</a></div>
    <div class="footer-col"><h5>Company</h5><a href="FinanceOS-About.html">About</a><a href="FinanceOS-Resources.html">Blog</a><a href="#">Careers</a><a href="#">Press</a></div>
    <div class="footer-col"><h5>Resources</h5><a href="FinanceOS-Resources.html">Help Center</a><a href="FinanceOS-RnD-Strategy.html">R&D Strategy</a><a href="FinanceOS-Committed-Spend.html">Committed Spend</a><a href="#">Community</a></div>
    <div class="footer-col"><h5>Legal</h5><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">SOC 2 Report</a><a href="#">GDPR</a></div>
  </div>
  <div class="footer-bottom"><span>2026 FinanceOS, Inc. All rights reserved.</span><span>SOC 2 Type II Certified | GDPR Compliant</span></div>
</footer>


` }} />
    </>
  );
}
