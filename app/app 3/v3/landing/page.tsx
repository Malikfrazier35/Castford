'use client';

import { useEffect, useRef } from 'react';

export default function V3LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
/* ===== SHARED NAV ===== */
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid #F1F5F9}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo-link{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;color:#0F172A;text-decoration:none;letter-spacing:-0.01em}
.logo-link .ldot{width:9px;height:9px;background:#10B981;border-radius:50%}
.nav-mid{display:flex;gap:4px;font-size:14px;font-weight:500;align-items:center}
.nav-mid a{color:#64748B;padding:8px 12px;border-radius:8px;text-decoration:none;transition:color .15s}
.nav-mid a:hover{color:#0F172A;background:rgba(0,0,0,0.03)}
.nav-end{display:flex;align-items:center;gap:10px}
.nav-end a{font-size:14px;font-weight:500;color:#64748B;padding:8px 12px;text-decoration:none;transition:color .15s}
.nav-end a:hover{color:#0F172A}
.btn-sub{display:inline-flex;align-items:center;padding:8px 18px;border-radius:8px;font-weight:600;font-size:13px;background:#10B981;color:#fff!important;text-decoration:none;border:none;cursor:pointer;transition:all .15s}
.btn-sub:hover{background:#059669;box-shadow:0 2px 12px rgba(16,185,129,0.25)}
@media(max-width:900px){.nav-mid{display:none}}

/* ===== SHARED FOOTER ===== */
footer{background:#F8FAFC;border-top:1px solid #E2E8F0;padding:56px 24px 24px}
.ft-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:40px;margin-bottom:40px}
.ft-brand p{font-size:13px;color:#64748B;line-height:1.6;max-width:240px;margin-top:10px}
.ft-col{display:flex;flex-direction:column;gap:8px}
.ft-col h5{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:#0F172A;margin-bottom:4px}
.ft-col a{font-size:13px;color:#64748B;text-decoration:none;transition:color .15s}
.ft-col a:hover{color:#0F172A}
.ft-bottom{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid #E2E8F0;font-size:12px;color:#64748B}
.ft-bottom a{color:#64748B;text-decoration:none;transition:color .15s}
.ft-bottom a:hover{color:#0F172A}
@media(max-width:768px){.ft-inner{grid-template-columns:1fr 1fr;gap:24px}}

:root{
  --green:#10B981;--green-50:#ECFDF5;--green-100:#D1FAE5;--green-200:#A7F3D0;--green-600:#059669;--green-700:#047857;
  --cyan:#0891B2;--purple:#7C3AED;--blue:#2563EB;--amber:#D97706;--red:#EF4444;
  --bg:#FFFFFF;--bg-alt:#F8FAFC;--bg-warm:#FAFAF9;
  --text:#0F172A;--text-secondary:#334155;--muted:#64748B;--light:#94A3B8;
  --border:#E2E8F0;--border-light:#F1F5F9;
  --shadow-xs:0 1px 2px rgba(0,0,0,0.04);--shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:0 4px 6px -1px rgba(0,0,0,0.07),0 2px 4px -2px rgba(0,0,0,0.04);
  --shadow-lg:0 10px 15px -3px rgba(0,0,0,0.07),0 4px 6px -4px rgba(0,0,0,0.04);
  --shadow-xl:0 20px 25px -5px rgba(0,0,0,0.07),0 8px 10px -6px rgba(0,0,0,0.04);
  --font:'DM Sans',system-ui,-apple-system,sans-serif;--mono:'JetBrains Mono',monospace;
  --radius:12px;--radius-lg:16px;--radius-xl:20px;
  --max-w:1200px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;line-height:1.6;overflow-x:hidden}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}

/* ===== NAVIGATION ===== */
nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid var(--border-light)}
.nav-inner{max-width:var(--max-w);margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:8px;font-weight:800;font-size:17px;letter-spacing:-0.01em}
.logo-dot{width:9px;height:9px;background:var(--green);border-radius:50%}
.nav-links{display:flex;gap:24px;font-size:14px;font-weight:500}
.nav-links a{color:var(--muted);transition:color .15s}
.nav-links a:hover{color:var(--text)}
.nav-right{display:flex;align-items:center;gap:10px}
.nav-right a{font-size:14px;font-weight:500;color:var(--muted);padding:8px 12px;transition:color .15s}
.nav-right a:hover{color:var(--text)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:8px;font-weight:600;font-size:14px;border:none;cursor:pointer;font-family:var(--font);transition:all .15s ease;white-space:nowrap}
.btn-sm{padding:8px 16px;font-size:13px}
.btn-md{padding:10px 22px}
.btn-lg{padding:13px 28px;font-size:15px;border-radius:10px}
.btn-primary{background:var(--green);color:#fff}
.btn-primary:hover{background:var(--green-600);box-shadow:0 2px 12px rgba(16,185,129,0.25)}
.btn-secondary{background:var(--text);color:#fff}
.btn-secondary:hover{background:#1E293B}
.btn-outline{background:var(--bg);color:var(--text);border:1px solid var(--border)}
.btn-outline:hover{background:var(--bg-alt);border-color:#CBD5E1}
.btn-ghost{background:transparent;color:var(--muted)}
.btn-ghost:hover{color:var(--text);background:var(--bg-alt)}

/* ===== HERO ===== */
.hero{padding:72px 24px 56px;text-align:center;position:relative}
.hero::before{content:'';position:absolute;top:0;left:0;right:0;height:100%;background:linear-gradient(180deg,var(--green-50) 0%,var(--bg) 80%);z-index:-1}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:6px 6px 6px 14px;border-radius:100px;font-size:13px;font-weight:500;color:var(--text-secondary);background:var(--bg);border:1px solid var(--border);margin-bottom:20px;box-shadow:var(--shadow-xs)}
.hero-eyebrow .tag{background:var(--green-100);color:var(--green-700);padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.02em}
.hero h1{font-size:clamp(38px,5.5vw,64px);font-weight:800;letter-spacing:-0.035em;line-height:1.08;margin-bottom:18px;max-width:720px;margin-left:auto;margin-right:auto;color:var(--text)}
.hero-sub{font-size:clamp(16px,1.8vw,19px);color:var(--text-secondary);max-width:520px;margin:0 auto 32px;line-height:1.55;font-weight:400}
.hero-buttons{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:12px}
.hero-note{font-size:12px;color:var(--light);margin-bottom:48px}

/* HERO VISUAL */
.hero-visual{max-width:960px;margin:0 auto;border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-xl);border:1px solid var(--border);background:var(--bg)}
.hv-topbar{display:flex;align-items:center;gap:8px;padding:10px 16px;background:var(--bg-alt);border-bottom:1px solid var(--border)}
.hv-dots{display:flex;gap:5px}
.hv-dots span{width:10px;height:10px;border-radius:50%}
.hv-dots span:nth-child(1){background:#EF4444}
.hv-dots span:nth-child(2){background:#F59E0B}
.hv-dots span:nth-child(3){background:#10B981}
.hv-tabs{display:flex;gap:0;margin-left:20px}
.hv-tab{padding:4px 12px;font-size:11px;font-weight:500;color:var(--muted);border-radius:6px}
.hv-tab.active{background:var(--bg);color:var(--text);box-shadow:var(--shadow-xs)}
.hv-body{display:grid;grid-template-columns:200px 1fr;min-height:340px}
.hv-sidebar{background:var(--bg-alt);border-right:1px solid var(--border-light);padding:16px 12px}
.hv-sidebar-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;font-size:12px;font-weight:500;color:var(--muted);margin-bottom:2px;cursor:default;transition:all .15s}
.hv-sidebar-item.active{background:var(--green-50);color:var(--green-700)}
.hv-sidebar-item .dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.hv-main{padding:20px}
.hv-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.hv-header h3{font-size:15px;font-weight:700;letter-spacing:-0.01em}
.hv-header .period{font-size:12px;color:var(--muted);background:var(--bg-alt);padding:4px 10px;border-radius:6px;border:1px solid var(--border-light)}
.hv-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}
.hv-metric{background:var(--bg-alt);border:1px solid var(--border-light);border-radius:10px;padding:12px}
.hv-metric .label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:3px}
.hv-metric .value{font-family:var(--mono);font-size:18px;font-weight:700;color:var(--text);letter-spacing:-0.02em}
.hv-metric .change{font-size:10px;font-weight:600;margin-top:2px}
.hv-metric .up{color:var(--green)}
.hv-metric .down{color:var(--red)}
.hv-chart{background:var(--bg-alt);border:1px solid var(--border-light);border-radius:10px;padding:16px;display:flex;align-items:flex-end;gap:5px;height:120px}
.hv-bar{flex:1;background:linear-gradient(180deg,var(--green),var(--green-200));border-radius:3px 3px 0 0;min-height:8px;transition:height .4s ease}

/* ===== SOCIAL PROOF ===== */
.social-proof{padding:40px 24px;border-bottom:1px solid var(--border-light)}
.sp-inner{max-width:var(--max-w);margin:0 auto;text-align:center}
.sp-inner p{font-size:12px;color:var(--light);text-transform:uppercase;letter-spacing:0.08em;font-weight:500;margin-bottom:20px}
.sp-logos{display:flex;justify-content:center;gap:36px;flex-wrap:wrap;align-items:center}
.sp-logo{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:600;color:#94A3B8;letter-spacing:0.01em}
.sp-logo svg{flex-shrink:0}

/* ===== METRICS STRIP ===== */
.metrics-strip{padding:48px 24px;background:var(--text);color:#fff}
.metrics-inner{max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(5,1fr);gap:24px;text-align:center}
.m-val{font-family:var(--mono);font-size:clamp(22px,2.5vw,30px);font-weight:700;color:var(--green);margin-bottom:2px;letter-spacing:-0.02em}
.m-label{font-size:12px;color:#94A3B8;font-weight:400}

/* ===== SECTION COMMON ===== */
.section{max-width:var(--max-w);margin:0 auto;padding:80px 24px}
.section-alt{background:var(--bg-alt)}
.section-header{text-align:center;margin-bottom:56px}
.section-header .overline{font-size:12px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px}
.section-header h2{font-size:clamp(28px,3.5vw,40px);font-weight:800;letter-spacing:-0.025em;margin-bottom:12px;line-height:1.15}
.section-header p{font-size:16px;color:var(--text-secondary);max-width:520px;margin:0 auto;line-height:1.55}

/* ===== FEATURE BENTO GRID ===== */
.bento{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:auto auto;gap:16px}
.bento-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px;transition:all .2s;overflow:hidden;position:relative}
.bento-card:hover{box-shadow:var(--shadow-md);border-color:#CBD5E1}
.bento-card.span-2{grid-column:span 2}
.bento-card .overline{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px}
.bento-card h3{font-size:17px;font-weight:700;margin-bottom:6px;letter-spacing:-0.01em}
.bento-card p{font-size:13px;color:var(--text-secondary);line-height:1.55}
.bento-card .bento-stat{font-family:var(--mono);font-size:36px;font-weight:700;color:var(--green);margin-top:16px;letter-spacing:-0.02em}
.bento-card .bento-stat-label{font-size:12px;color:var(--muted);margin-top:2px}
.bento-mini-chart{display:flex;gap:3px;align-items:flex-end;height:48px;margin-top:16px}
.bento-mini-chart span{flex:1;background:var(--green-200);border-radius:2px 2px 0 0}

/* ===== AI SHOWCASE ===== */
.ai-split{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.ai-text .overline{font-size:12px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px}
.ai-text h2{font-size:clamp(26px,3vw,36px);font-weight:800;letter-spacing:-0.025em;margin-bottom:12px;line-height:1.15}
.ai-text>p{font-size:15px;color:var(--text-secondary);line-height:1.6;margin-bottom:24px}
.ai-list{display:flex;flex-direction:column;gap:12px}
.ai-item{display:flex;gap:12px;align-items:flex-start}
.ai-item-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.ai-item h4{font-size:14px;font-weight:600;margin-bottom:1px}
.ai-item p{font-size:12px;color:var(--muted)}

.ai-terminal{background:#0F172A;border-radius:var(--radius-lg);overflow:hidden;font-family:var(--mono);font-size:12px;box-shadow:var(--shadow-xl)}
.ai-t-header{padding:10px 16px;background:rgba(0,0,0,0.3);display:flex;align-items:center;gap:6px}
.ai-t-header span{width:10px;height:10px;border-radius:50%}
.ai-t-header span:nth-child(1){background:#EF4444}
.ai-t-header span:nth-child(2){background:#F59E0B}
.ai-t-header span:nth-child(3){background:#10B981}
.ai-t-header .t-title{margin-left:12px;font-size:11px;color:#475569;font-family:var(--mono)}
.ai-t-body{padding:20px;line-height:2;color:#94A3B8}
.ai-t-body .prompt{color:#10B981}
.ai-t-body .response{color:#67E8F9}
.ai-t-body .hl{color:#FCD34D}
.ai-t-body .dim{color:#334155}

/* ===== INTEGRATIONS STRIP ===== */
.int-strip{text-align:center;padding:64px 24px}
.int-strip h2{font-size:clamp(24px,3vw,32px);font-weight:800;letter-spacing:-0.02em;margin-bottom:8px}
.int-strip>p{color:var(--text-secondary);font-size:15px;margin-bottom:32px}
.int-logos{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;max-width:800px;margin:0 auto 28px}
.int-chip{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:100px;background:var(--bg);border:1px solid var(--border);font-size:12px;font-weight:500;color:var(--text-secondary);transition:all .2s cubic-bezier(.16,1,.3,1)}
.int-chip:hover{transform:translateY(-2px);box-shadow:var(--shadow-sm);border-color:#CBD5E1}
.int-chip svg{flex-shrink:0}
.int-chip .ic-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;display:none}

/* ===== TESTIMONIALS ===== */
.testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.test-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;transition:box-shadow .2s}
.test-card:hover{box-shadow:var(--shadow-md)}
.test-stars{color:#F59E0B;font-size:13px;letter-spacing:1px;margin-bottom:12px}
.test-card blockquote{font-size:14px;color:var(--text-secondary);line-height:1.6;margin-bottom:16px;font-style:italic}
.test-author{font-size:13px;font-weight:600;color:var(--text)}
.test-role{font-size:12px;color:var(--muted)}

/* ===== CTA ===== */
.cta{text-align:center;padding:80px 24px 96px}
.cta h2{font-size:clamp(28px,3.5vw,42px);font-weight:800;letter-spacing:-0.03em;margin-bottom:12px;line-height:1.1}
.cta p{font-size:16px;color:var(--text-secondary);margin-bottom:28px;max-width:440px;margin-left:auto;margin-right:auto}
.cta-buttons{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.cta-note{font-size:12px;color:var(--light);margin-top:14px}

/* ===== FOOTER ===== */
footer{background:var(--bg-alt);border-top:1px solid var(--border);padding:56px 24px 28px}
.footer-inner{max-width:var(--max-w);margin:0 auto;display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:40px;margin-bottom:40px}
.footer-brand .logo{margin-bottom:12px}
.footer-brand p{font-size:13px;color:var(--muted);line-height:1.5;max-width:220px}
.footer-col h5{font-size:11px;font-weight:600;color:var(--text);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px}
.footer-col a{display:block;font-size:13px;color:var(--muted);margin-bottom:8px;transition:color .15s}
.footer-col a:hover{color:var(--green)}
.footer-bottom{max-width:var(--max-w);margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid var(--border);font-size:12px;color:var(--light)}
.footer-bottom-links{display:flex;gap:20px}
.footer-bottom-links a{color:var(--light);transition:color .15s}
.footer-bottom-links a:hover{color:var(--text)}

/* ===== RESPONSIVE ===== */
@media(max-width:960px){
  .bento{grid-template-columns:1fr 1fr}
  .bento-card.span-2{grid-column:span 1}
  .ai-split{grid-template-columns:1fr;gap:32px}
  .hv-body{grid-template-columns:1fr}
  .hv-sidebar{display:none}
  .footer-inner{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:768px){
  .nav-links{display:none}
  .bento{grid-template-columns:1fr}
  .metrics-inner{grid-template-columns:repeat(2,1fr)}
  .testimonials-grid{grid-template-columns:1fr}
  .hv-metrics{grid-template-columns:repeat(2,1fr)}
  .footer-inner{grid-template-columns:1fr}
  .footer-bottom{flex-direction:column;gap:10px;text-align:center}
}
@media(max-width:480px){
  .metrics-inner{grid-template-columns:1fr}
}

/* ===== ANIMATIONS ===== */
@keyframes heroIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes heroScale{from{opacity:0;transform:translateY(40px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes pulse-dot{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)}70%{box-shadow:0 0 0 6px rgba(16,185,129,0)}}
@keyframes glow-line{0%{opacity:0.3;transform:scaleX(0)}50%{opacity:1;transform:scaleX(1)}100%{opacity:0.3;transform:scaleX(0)}}
@keyframes bar-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes slide-in-left{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes typing-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes counter-up{from{opacity:0;transform:translateY(12px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes card-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes logo-slide{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}

/* Hero entrance cascade */
.hero-eyebrow{animation:heroIn .6s cubic-bezier(.16,1,.3,1) .1s both}
.hero h1{animation:heroIn .7s cubic-bezier(.16,1,.3,1) .2s both}
.hero-sub{animation:heroIn .7s cubic-bezier(.16,1,.3,1) .35s both}
.hero-buttons{animation:heroIn .6s cubic-bezier(.16,1,.3,1) .5s both}
.hero-note{animation:heroIn .5s cubic-bezier(.16,1,.3,1) .6s both}
.hero-visual{animation:heroScale .8s cubic-bezier(.16,1,.3,1) .4s both}

/* Logo dot pulse */
.logo-link .ldot,.logo-dot{animation:pulse-dot 2.5s ease infinite}

/* Hero visual glow accent line */
.hero-visual::after{content:'';position:absolute;bottom:-1px;left:10%;right:10%;height:2px;background:linear-gradient(90deg,transparent,var(--green),var(--cyan),transparent);animation:glow-line 4s ease-in-out infinite;border-radius:2px}
.hero-visual{position:relative}

/* Dashboard bar chart grow animation */
.hv-bar{transform-origin:bottom;animation:bar-grow .6s cubic-bezier(.16,1,.3,1) both}
.hv-bar:nth-child(1){animation-delay:.5s}
.hv-bar:nth-child(2){animation-delay:.55s}
.hv-bar:nth-child(3){animation-delay:.6s}
.hv-bar:nth-child(4){animation-delay:.65s}
.hv-bar:nth-child(5){animation-delay:.7s}
.hv-bar:nth-child(6){animation-delay:.75s}
.hv-bar:nth-child(7){animation-delay:.8s}
.hv-bar:nth-child(8){animation-delay:.85s}
.hv-bar:nth-child(9){animation-delay:.9s}
.hv-bar:nth-child(10){animation-delay:.95s}
.hv-bar:nth-child(11){animation-delay:1s}
.hv-bar:nth-child(12){animation-delay:1.05s}

/* Social proof staggered entrance */
.sp-logo{animation:logo-slide .4s cubic-bezier(.16,1,.3,1) both}
.sp-logo:nth-child(1){animation-delay:.1s}
.sp-logo:nth-child(2){animation-delay:.15s}
.sp-logo:nth-child(3){animation-delay:.2s}
.sp-logo:nth-child(4){animation-delay:.25s}
.sp-logo:nth-child(5){animation-delay:.3s}
.sp-logo:nth-child(6){animation-delay:.35s}
.sp-logo:nth-child(7){animation-delay:.4s}
.sp-logo:nth-child(8){animation-delay:.45s}

/* Metrics strip counter entrance */
.metrics-inner>div{animation:counter-up .5s cubic-bezier(.16,1,.3,1) both}
.metrics-inner>div:nth-child(1){animation-delay:.1s}
.metrics-inner>div:nth-child(2){animation-delay:.2s}
.metrics-inner>div:nth-child(3){animation-delay:.3s}
.metrics-inner>div:nth-child(4){animation-delay:.4s}
.metrics-inner>div:nth-child(5){animation-delay:.5s}

/* Scroll-triggered fade-in with stagger */
.fade-in{opacity:0;transform:translateY(20px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
.fade-in.visible{opacity:1;transform:translateY(0)}
.fade-in:nth-child(2){transition-delay:.08s}
.fade-in:nth-child(3){transition-delay:.16s}
.fade-in:nth-child(4){transition-delay:.24s}
.fade-in:nth-child(5){transition-delay:.32s}
.fade-in:nth-child(6){transition-delay:.4s}

/* Enhanced button hovers */
.btn-primary{transition:all .25s cubic-bezier(.16,1,.3,1)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(16,185,129,0.3)}
.btn-primary:active{transform:translateY(0);box-shadow:0 2px 8px rgba(16,185,129,0.2)}
.btn-outline{transition:all .25s cubic-bezier(.16,1,.3,1)}
.btn-outline:hover{transform:translateY(-2px);box-shadow:var(--shadow-md)}

/* Bento card enhanced hovers */
.bento-card{transition:all .3s cubic-bezier(.16,1,.3,1)}
.bento-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.06);border-color:#CBD5E1}
.bento-stat{transition:transform .3s cubic-bezier(.16,1,.3,1)}
.bento-card:hover .bento-stat{transform:scale(1.05)}
.bento-mini-chart span{transition:height .6s cubic-bezier(.16,1,.3,1)}
.bento-card:hover .bento-mini-chart span{filter:saturate(1.5)}

/* Testimonial card hover lift */
.test-card{transition:all .3s cubic-bezier(.16,1,.3,1)}
.test-card:hover{transform:translateY(-6px);box-shadow:0 20px 40px rgba(0,0,0,0.06)}
.test-stars{transition:transform .3s}
.test-card:hover .test-stars{transform:scale(1.08)}

/* AI terminal typing cursor */
.ai-t-body::after{content:'_';color:var(--green);animation:typing-blink 1s step-end infinite;font-weight:700}

/* AI terminal float effect */
.ai-terminal{transition:all .3s cubic-bezier(.16,1,.3,1)}
.ai-terminal:hover{transform:translateY(-4px);box-shadow:0 24px 48px rgba(0,0,0,0.15)}

/* Integration chips hover */
.int-chip{transition:all .2s cubic-bezier(.16,1,.3,1)}
.int-chip:hover{transform:translateY(-2px);box-shadow:var(--shadow-sm);border-color:#CBD5E1}

/* CTA section entrance */
.cta h2{background:linear-gradient(135deg,var(--text) 0%,var(--green-700) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* Metric value shimmer on hover */
.hv-metric{transition:all .2s ease}
.hv-metric:hover{background:var(--bg);box-shadow:var(--shadow-sm);border-color:#CBD5E1;transform:translateY(-1px)}

/* Dashboard sidebar item hover */
.hv-sidebar-item:hover{background:var(--green-50);color:var(--green-700);transform:translateX(2px)}

/* Eyebrow tag shimmer */
.hero-eyebrow .tag{background:linear-gradient(90deg,var(--green-100),var(--green-200),var(--green-100));background-size:200% auto;animation:shimmer 3s linear infinite}

/* Nav subscribe button pop */
.btn-sub{transition:all .25s cubic-bezier(.16,1,.3,1)}
.btn-sub:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 4px 16px rgba(16,185,129,0.3)}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- NAV -->
<nav>
  <div class="nav-inner">
    <a href="FinanceOS-Landing-V3.html" class="logo-link"><span class="ldot"></span>FinanceOS</a>
    <div class="nav-mid">
      <a href="FinanceOS-Solutions-Digital.html">Solutions</a>
      <a href="FinanceOS-Integrations-V3.html">Integrations</a>
      <a href="FinanceOS-Security-Zero-Trust.html">Trust</a>
      <a href="FinanceOS-Pricing-V3.html">Pricing</a>
      <a href="FinanceOS-vs-Competitors-V2.html">Compare</a>
      <a href="FinanceOS-Resources-V2.html">Resources</a>
    </div>
    <div class="nav-end">
      <a href="FinanceOS-Login-V2.html">Sign In</a>
      <a href="FinanceOS-Pricing-V3.html" class="btn-sub">Subscribe</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-eyebrow">
    Now available: xP&A across 7 departments
    <span class="tag">NEW</span>
  </div>
  <h1>Financial planning that earns 5-star reviews</h1>
  <p class="hero-sub">AI-native FP&A for teams that outgrew spreadsheets. Close faster, forecast accurately, and plan across every department — in one platform.</p>
  <div class="hero-buttons">
    <button class="btn btn-primary btn-lg">Start Free Trial</button>
    <button class="btn btn-outline btn-lg">Book a Demo →</button>
  </div>
  <p class="hero-note">No credit card required · Setup in under 5 minutes</p>

  <div class="hero-visual">
    <div class="hv-topbar">
      <div class="hv-dots"><span></span><span></span><span></span></div>
      <div class="hv-tabs">
        <div class="hv-tab active">Dashboard</div>
        <div class="hv-tab">Forecast</div>
        <div class="hv-tab">Scenarios</div>
      </div>
    </div>
    <div class="hv-body">
      <div class="hv-sidebar">
        <div class="hv-sidebar-item active"><span class="dot" style="background:var(--green)"></span>Dashboard</div>
        <div class="hv-sidebar-item"><span class="dot" style="background:var(--border)"></span>P&L</div>
        <div class="hv-sidebar-item"><span class="dot" style="background:var(--border)"></span>Balance Sheet</div>
        <div class="hv-sidebar-item"><span class="dot" style="background:var(--border)"></span>Cash Flow</div>
        <div class="hv-sidebar-item"><span class="dot" style="background:var(--border)"></span>Revenue</div>
        <div class="hv-sidebar-item"><span class="dot" style="background:var(--border)"></span>Headcount</div>
        <div class="hv-sidebar-item"><span class="dot" style="background:var(--border)"></span>Consolidation</div>
        <div class="hv-sidebar-item"><span class="dot" style="background:var(--border)"></span>AI Copilot</div>
      </div>
      <div class="hv-main">
        <div class="hv-header">
          <h3>Executive Dashboard</h3>
          <span class="period">Q1 2026</span>
        </div>
        <div class="hv-metrics">
          <div class="hv-metric"><div class="label">ARR</div><div class="value">$48.6M</div><div class="change up">↑ 42% YoY</div></div>
          <div class="hv-metric"><div class="label">NDR</div><div class="value">118%</div><div class="change up">↑ 3pts</div></div>
          <div class="hv-metric"><div class="label">Burn Multiple</div><div class="value">0.8x</div><div class="change up">Efficient</div></div>
          <div class="hv-metric"><div class="label">Gross Margin</div><div class="value">84.7%</div><div class="change up">↑ 1.2pts</div></div>
        </div>
        <div class="hv-chart">
          <div class="hv-bar" style="height:28%"></div>
          <div class="hv-bar" style="height:32%"></div>
          <div class="hv-bar" style="height:30%"></div>
          <div class="hv-bar" style="height:38%"></div>
          <div class="hv-bar" style="height:42%"></div>
          <div class="hv-bar" style="height:40%"></div>
          <div class="hv-bar" style="height:48%"></div>
          <div class="hv-bar" style="height:52%"></div>
          <div class="hv-bar" style="height:56%"></div>
          <div class="hv-bar" style="height:62%"></div>
          <div class="hv-bar" style="height:68%"></div>
          <div class="hv-bar" style="height:78%"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SOCIAL PROOF -->
<div class="social-proof">
  <div class="sp-inner">
    <p>Trusted by finance teams at</p>
    <div class="sp-logos">
      <span class="sp-logo"><svg width="20" height="20" viewBox="0 0 38 57" fill="none"><path d="M19 28.5a9.5 9.5 0 1 1 0-19h9.5v19H19z" fill="#A259FF"/><path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83"/><path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" fill="#FF7262"/><path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/><path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/></svg>Figma</span>
      <span class="sp-logo"><svg width="20" height="20" viewBox="0 0 100 100" fill="none"><path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.497 1.553-6.413 6.017-6.8z" fill="#fff"/><path fill-rule="evenodd" clip-rule="evenodd" d="M61.35.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257-3.89c5.437-.387 6.99-2.917 6.99-7.193V20.64c0-2.21-.873-2.847-3.443-4.733L74.167 3.463C69.893.347 68.147-.357 61.35.227zM25.5 17.89c-5.2.297-6.383.363-9.35-2.17l-7.403-5.833c-.77-.78-.383-1.753 1.167-1.95l53.193-3.887c4.467-.387 6.8 1.167 8.543 2.527l8.543 6.223c.387.193 1.357 1.36 .193 1.36l-54.887 3.34v.39zM18.5 88.61V30.317c0-2.527.777-3.697 3.103-3.893l58.937-3.497c2.14-.193 3.107 1.167 3.107 3.693v57.903c0 2.53-.387 4.667-3.883 4.863l-56.443 3.3c-3.497.197-4.82-.97-4.82-3.887v-.19zM71.3 33.427c.387 1.75 0 3.497-1.75 3.697l-2.723.58v42.773c-2.333 1.167-4.467 1.943-6.22 1.943-2.917 0-3.693-.97-5.833-3.497L38.587 53.753v24.02l5.833 1.36s0 3.497-4.857 3.497l-13.39.777c-.39-.78 0-2.723 1.357-3.11l3.497-.97V45.867l-4.857-.39c-.387-1.75.58-4.277 3.3-4.473l14.363-.97 17.467 26.743V45.673L56.93 44.9c-.387-2.14 1.167-3.693 3.107-3.887l12.26-.777v.193z" fill="#000"/></svg>Notion</span>
      <span class="sp-logo"><svg width="20" height="20" viewBox="0 0 76 65" fill="none"><path d="M37.532 0L75.064 65H0L37.532 0z" fill="#000"/></svg>Vercel</span>
      <span class="sp-logo"><svg width="20" height="20" viewBox="0 0 100 100" fill="none"><path d="M21 0C9.402 0 0 9.402 0 21v58c0 11.598 9.402 21 21 21h58c11.598 0 21-9.402 21-21V21C100 9.402 90.598 0 79 0H21z" fill="#5E6AD2"/><path d="M50.768 67.075l-22.3-28.4a3 3 0 01-.47-1.58V24.5h11v10.24l18.16 23.135 18.16-23.135V24.5h11v12.595a3 3 0 01-.47 1.58l-22.3 28.4a5 5 0 01-7.78 0z" fill="#fff"/></svg>Linear</span>
      <span class="sp-logo"><svg width="20" height="20" viewBox="0 0 50 50" fill="none"><rect width="50" height="50" rx="10" fill="#07A858"/><path d="M13 20h24M13 26h18M13 32h12" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>Ramp</span>
      <span class="sp-logo"><svg width="20" height="20" viewBox="0 0 50 50" fill="none"><rect width="50" height="50" rx="10" fill="#5542F6"/><circle cx="25" cy="25" r="12" fill="#fff"/><circle cx="25" cy="25" r="5" fill="#5542F6"/></svg>Mercury</span>
      <span class="sp-logo"><svg width="20" height="20" viewBox="0 0 50 50" fill="none"><rect width="50" height="50" rx="10" fill="#3D3D3D"/><path d="M14 16h6v18h-6zM22 16h6v18h-6zM30 16h6v18h-6z" fill="#F60" rx="1"/></svg>Retool</span>
      <span class="sp-logo"><svg width="20" height="20" viewBox="0 0 50 50" fill="none"><rect width="50" height="50" rx="10" fill="#146EF5"/><path d="M16 20l9 10 9-10" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 30v-16" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>Webflow</span>
    </div>
  </div>
</div>

<!-- METRICS STRIP -->
<div class="metrics-strip">
  <div class="metrics-inner">
    <div><div class="m-val">$48.6M</div><div class="m-label">ARR</div></div>
    <div><div class="m-val">118%</div><div class="m-label">Net Dollar Retention</div></div>
    <div><div class="m-val">2,400+</div><div class="m-label">Finance Teams</div></div>
    <div><div class="m-val">0.8x</div><div class="m-label">Burn Multiple</div></div>
    <div><div class="m-val">84.7%</div><div class="m-label">Gross Margin</div></div>
  </div>
</div>

<!-- FEATURE BENTO GRID -->
<section class="section">
  <div class="section-header">
    <div class="overline">Platform</div>
    <h2>Everything your finance team needs</h2>
    <p>Close faster, forecast accurately, and plan across every department — without the spreadsheet chaos.</p>
  </div>
  <div class="bento">
    <div class="bento-card span-2 fade-in">
      <div class="overline" style="color:var(--green)">AI Copilot</div>
      <h3>Ask questions in plain English</h3>
      <p>"Why did COGS spike in March?" — get instant, sourced variance analysis with drill-down to individual transactions. No SQL, no formulas, no waiting.</p>
      <div class="bento-stat">96%</div>
      <div class="bento-stat-label">Forecast accuracy with AI</div>
    </div>
    <div class="bento-card fade-in">
      <div class="overline" style="color:var(--cyan)">Close</div>
      <h3>3-day monthly close</h3>
      <p>Automated multi-entity consolidation, intercompany elimination, and real-time GL sync.</p>
      <div class="bento-stat">80%</div>
      <div class="bento-stat-label">Faster than industry avg</div>
    </div>
    <div class="bento-card fade-in">
      <div class="overline" style="color:var(--purple)">xP&A</div>
      <h3>7-department planning</h3>
      <p>Finance, Revenue, Workforce, Operations, Marketing, IT, and Supply Chain in one unified model.</p>
      <div class="bento-mini-chart">
        <span style="height:40%"></span><span style="height:55%"></span><span style="height:45%"></span>
        <span style="height:65%"></span><span style="height:70%"></span><span style="height:60%"></span>
        <span style="height:80%"></span><span style="height:90%"></span>
      </div>
    </div>
    <div class="bento-card span-2 fade-in">
      <div class="overline" style="color:var(--blue)">Integrations</div>
      <h3>200+ pre-built connectors</h3>
      <p>NetSuite, SAP, Salesforce, Workday, Stripe, Snowflake, and 194 more. OAuth setup in under 5 minutes. Real-time or batch sync with automatic schema mapping.</p>
      <div class="bento-stat">< 5 min</div>
      <div class="bento-stat-label">Average connector setup time</div>
    </div>
    <div class="bento-card fade-in">
      <div class="overline" style="color:var(--amber)">Scenarios</div>
      <h3>Unlimited what-ifs</h3>
      <p>Monte Carlo simulations, side-by-side comparison, and AI-suggested scenarios based on market signals.</p>
      <div class="bento-stat">30s</div>
      <div class="bento-stat-label">Any scenario, created</div>
    </div>
    <div class="bento-card fade-in">
      <div class="overline" style="color:var(--red)">Compliance</div>
      <h3>SOX 404 automation</h3>
      <p>Continuous control monitoring, immutable audit trails, one-click evidence export.</p>
      <div class="bento-stat">90%</div>
      <div class="bento-stat-label">Less audit prep time</div>
    </div>
  </div>
</section>

<!-- AI SHOWCASE -->
<div class="section-alt">
  <section class="section">
    <div class="ai-split">
      <div class="ai-text fade-in">
        <div class="overline">AI Copilot</div>
        <h2>Your senior analyst, available 24/7</h2>
        <p>Not a chatbot bolted onto a spreadsheet. FinanceOS AI is trained on financial data patterns, understands GAAP/IFRS, and provides sourced, auditable answers with full data lineage.</p>
        <div class="ai-list">
          <div class="ai-item"><div class="ai-item-icon" style="background:var(--green-50)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg></div><div><h4>Variance Analysis</h4><p>Instant sourced breakdown of any line item change</p></div></div>
          <div class="ai-item"><div class="ai-item-icon" style="background:#EFF6FF"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div><div><h4>Anomaly Detection</h4><p>Flags unusual patterns before they become findings</p></div></div>
          <div class="ai-item"><div class="ai-item-icon" style="background:#F5F3FF"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg></div><div><h4>Proactive Insights</h4><p>Surfaces risks and opportunities you didn't know to look for</p></div></div>
          <div class="ai-item"><div class="ai-item-icon" style="background:#FFFBEB"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div><div><h4>Multi-Turn Conversations</h4><p>Ask follow-ups — context maintained across the session</p></div></div>
        </div>
      </div>
      <div class="ai-terminal fade-in">
        <div class="ai-t-header"><span></span><span></span><span></span><span class="t-title">AI Copilot</span></div>
        <div class="ai-t-body">
          <div class="prompt">You → Why did OPEX exceed budget by $340K?</div><br>
          <div class="response">Three factors drove the $340K overage:</div><br>
          <span class="dim">1.</span> <span class="hl">Eng headcount</span> <span class="dim">+$180K</span><br>
          <span class="dim">&nbsp;&nbsp;&nbsp;4 unbudgeted hires (HC-2026-014)</span><br>
          <span class="dim">2.</span> <span class="hl">AWS infra</span> <span class="dim">+$95K</span><br>
          <span class="dim">&nbsp;&nbsp;&nbsp;PH launch traffic surge (+47%)</span><br>
          <span class="dim">3.</span> <span class="hl">Legal</span> <span class="dim">+$65K</span><br>
          <span class="dim">&nbsp;&nbsp;&nbsp;SOC 2 audit (one-time)</span><br><br>
          <div class="response">Shall I reforecast Q2-Q4?</div>
        </div>
      </div>
    </div>
  </section>
</div>

<!-- INTEGRATIONS STRIP -->
<section class="int-strip">
  <h2>Connects to your entire stack</h2>
  <p>200+ pre-built connectors. OAuth setup. Real-time sync.</p>
  <div class="int-logos">
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#0071C5"/><path d="M8 8h8v8H8z" fill="#fff"/></svg>NetSuite</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M4.622 6.902L12 2l7.378 4.902L17.07 10H6.93L4.622 6.902z" fill="#0053B6"/><path d="M6.93 10l-2.308 3.098L12 18l7.378-4.902L17.07 10H6.93z" fill="#1FA0F1"/><path d="M12 13l-5.07-3h10.14L12 13z" fill="#3FC1FA"/></svg>SAP</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.86 3.44 8.91 8 9.8v-2.12c-3.37-.82-5.83-3.9-5.83-7.58 0-4.28 3.55-7.75 7.83-7.75s7.83 3.47 7.83 7.75c0 3.68-2.46 6.76-5.83 7.58V21.8c4.56-.89 8-4.94 8-9.8 0-5.52-4.48-10-10-10z" fill="#00A1E0"/></svg>Salesforce</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#F68D2E"/><path d="M8 9h8M8 12h6M8 15h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>Workday</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.813 1.612-2.261 1.612-2.049 0-5.09-.976-7.066-2.254l-.89 5.584c1.787 1.047 5.024 1.938 8.17 1.938 2.604 0 4.743-.614 6.258-1.798 1.647-1.27 2.502-3.152 2.502-5.58-.013-4.127-2.512-5.817-6.415-7.372z" fill="#635BFF"/></svg>Stripe</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2l10 6v8l-10 6L2 16V8l10-6z" fill="#29B5E8"/><path d="M12 8l4 2.4v4.8L12 18l-4-2.8v-4.8L12 8z" fill="#fff"/></svg>Snowflake</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2CA01C"/><path d="M8 12l3 3 5-6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>QuickBooks</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FF7A59"/><path d="M10 8v8l6-4-6-4z" fill="#fff"/></svg>HubSpot</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#111"/><path d="M6 12h12M12 6v12" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>Plaid</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" fill="#4285F4"/><path d="M12 7v5l4 2" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>BigQuery</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#73C41D"/><path d="M9 8a3 3 0 016 0v2H9V8z" fill="#fff"/><rect x="8" y="12" width="8" height="6" rx="1" fill="#fff"/></svg>BambooHR</div>
    <div class="int-chip"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h0" stroke-linecap="round"/></svg>+189 more</div>
  </div>
  <button class="btn btn-outline btn-md">View All Integrations →</button>
</section>

<!-- TESTIMONIALS -->
<div class="section-alt">
  <section class="section">
    <div class="section-header">
      <div class="overline">Customer Stories</div>
      <h2>Loved by finance leaders</h2>
    </div>
    <div class="testimonials-grid">
      <div class="test-card fade-in">
        <div class="test-stars">★★★★★</div>
        <blockquote>"FinanceOS cut our monthly close from 12 days to 3. The AI copilot is like having a senior analyst on call 24/7."</blockquote>
        <div class="test-author">Sarah Chen</div>
        <div class="test-role">VP Finance, Series C SaaS ($120M ARR)</div>
      </div>
      <div class="test-card fade-in">
        <div class="test-stars">★★★★★</div>
        <blockquote>"Board deck prep went from 5 days to 5 minutes. We ran 50 what-if scenarios during our Series C and closed oversubscribed."</blockquote>
        <div class="test-author">Marcus Rivera</div>
        <div class="test-role">CFO, E-Commerce Platform</div>
      </div>
      <div class="test-card fade-in">
        <div class="test-stars">★★★★★</div>
        <blockquote>"The xP&A module finally connected RevOps to Finance. No more version conflicts. One model, one truth."</blockquote>
        <div class="test-author">Priya Patel</div>
        <div class="test-role">Head of FP&A, B2B Marketplace</div>
      </div>
    </div>
  </section>
</div>

<!-- CTA -->
<section class="cta">
  <h2>Start planning smarter today</h2>
  <p>Join 2,400+ finance teams that outgrew spreadsheets. No credit card required.</p>
  <div class="cta-buttons">
    <button class="btn btn-primary btn-lg">Start Free Trial</button>
    <button class="btn btn-outline btn-lg">Talk to Sales</button>
  </div>
  <p class="cta-note">Free tier available · No credit card · Setup in 5 minutes</p>
</section>

<!-- FOOTER -->
<footer>
  <div class="ft-inner">
    <div class="ft-brand">
      <a href="FinanceOS-Landing-V3.html" class="logo-link"><span class="ldot"></span>FinanceOS</a>
      <p>AI-native financial planning & analysis for modern finance teams.</p>
    </div>
    <div class="ft-col"><h5>Product</h5><a href="FinanceOS-Landing-V3.html">Platform</a><a href="FinanceOS-Integrations-V3.html">Integrations</a><a href="FinanceOS-Pricing-V3.html">Pricing</a><a href="FinanceOS-Security-Zero-Trust.html">Security</a></div>
    <div class="ft-col"><h5>Solutions</h5><a href="FinanceOS-Solutions-Digital.html">SaaS</a><a href="FinanceOS-Solutions-Digital.html">E-Commerce</a><a href="FinanceOS-xPA-Planning-V2.html">Cross-Dept Planning</a></div>
    <div class="ft-col"><h5>Resources</h5><a href="FinanceOS-Resources-V2.html">Resource Library</a><a href="FinanceOS-Whats-New-V2.html">Changelog</a></div>
    <div class="ft-col"><h5>Company</h5><a href="#">About</a><a href="#">Careers</a><a href="#">Contact</a></div>
  </div>
  <div class="ft-bottom">
    <span>&copy; 2026 FinanceOS, Inc.</span>
    <div style="display:flex;gap:20px"><a href="FinanceOS-Security-Zero-Trust.html">Privacy</a><a href="#">Terms</a><a href="FinanceOS-Security-Zero-Trust.html">Security</a></div>
  </div>
</footer>


` }} />
    </>
  );
}
