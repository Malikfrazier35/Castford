'use client';

import { useEffect, useRef } from 'react';

export default function V3InternalLoginOriginalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `function showTab(tab,el){document.querySelectorAll('.auth-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');document.querySelectorAll('.form-panel').forEach(p=>p.classList.remove('active'));document.getElementById(tab).classList.add('active');}`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--green:#10B981;--cyan:#22D3EE;--purple:#8B5CF6;--blue:#3B82F6;--t1:#0F172A;--t2:#334155;--t3:#64748B;--t4:#94A3B8;--border:#E2E8F0;--font:'DM Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;--ease:cubic-bezier(0.16,1,0.3,1);}
body{font-family:var(--font);-webkit-font-smoothing:antialiased;min-height:100vh;display:flex;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

/* LEFT PANEL */
.left{flex:1;background:linear-gradient(135deg,#030711,#1E1B4B,#0F172A);background-size:300% 300%;animation:gradientShift 10s ease infinite;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px;color:#fff;position:relative;overflow:hidden;}
.left::before{content:'';position:absolute;top:-200px;left:-200px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,0.08),transparent 70%);pointer-events:none;}
.left::after{content:'';position:absolute;bottom:-150px;right:-150px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%);pointer-events:none;}
.left-logo{display:flex;align-items:center;gap:10px;margin-bottom:40px;}
.left-logo svg{width:40px;height:40px;}
.left-logo span{font-size:22px;font-weight:900;letter-spacing:-0.03em;}
.left h2{font-size:28px;font-weight:900;letter-spacing:-0.02em;margin-bottom:14px;text-align:center;line-height:1.2;}
.left p{font-size:14px;color:rgba(255,255,255,0.5);text-align:center;max-width:360px;line-height:1.6;margin-bottom:36px;}
.trust-items{display:flex;gap:24px;flex-wrap:wrap;justify-content:center;}
.trust-item{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);}
.trust-item .ti-icon{width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:10px;}

/* MINI MOCKUP */
.left-mock{margin-top:40px;width:320px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:16px;backdrop-filter:blur(10px);animation:float 6s ease-in-out infinite;}
.lm-top{display:flex;align-items:center;gap:4px;margin-bottom:12px;}.lm-dot{width:6px;height:6px;border-radius:50%;}
.lm-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.lm-kpi{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:10px;text-align:left;}
.lm-kpi .lk-label{font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:rgba(255,255,255,0.35);margin-bottom:2px;}
.lm-kpi .lk-value{font-size:16px;font-weight:800;font-family:var(--mono);color:#fff;}
.lm-kpi .lk-change{font-size:8px;font-weight:600;color:var(--green);margin-top:1px;}

/* RIGHT PANEL */
.right{flex:1;display:flex;align-items:center;justify-content:center;padding:40px;background:#fff;}
.auth-box{width:100%;max-width:400px;animation:fadeUp 0.6s var(--ease);}
.auth-box h1{font-size:26px;font-weight:900;letter-spacing:-0.02em;margin-bottom:6px;}
.auth-box .sub{font-size:14px;color:var(--t3);margin-bottom:28px;}
.auth-tabs{display:flex;gap:0;margin-bottom:24px;border-bottom:2px solid var(--border);}
.auth-tab{flex:1;padding:10px;text-align:center;font-size:14px;font-weight:600;color:var(--t4);cursor:pointer;transition:all 0.2s;border-bottom:2px solid transparent;margin-bottom:-2px;}
.auth-tab.active{color:var(--t1);border-color:var(--green);}
.form-group{margin-bottom:16px;position:relative;}
.form-group label{display:block;font-size:12px;font-weight:600;color:var(--t3);margin-bottom:6px;}
.form-group input,.form-group select{width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--border);font-size:14px;font-family:var(--font);color:var(--t1);outline:none;transition:all 0.3s;background:#fff;}
.form-group input:focus,.form-group select:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(16,185,129,0.1);}
.form-row{display:flex;gap:12px;}
.form-row .form-group{flex:1;}
.form-extras{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;font-size:12px;}
.form-extras label{display:flex;align-items:center;gap:6px;color:var(--t3);cursor:pointer;}
.form-extras a{color:var(--green);text-decoration:none;font-weight:600;}
.btn-submit{width:100%;padding:14px;border-radius:12px;font-size:15px;font-weight:700;border:none;background:var(--green);color:#fff;cursor:pointer;transition:all 0.25s var(--ease);margin-bottom:16px;}.btn-submit:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(16,185,129,0.3);}
.divider{display:flex;align-items:center;gap:12px;margin-bottom:16px;font-size:11px;color:var(--t4);font-weight:600;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border);}
.sso-btns{display:flex;gap:10px;}
.sso-btn{flex:1;padding:10px;border-radius:10px;border:1px solid var(--border);background:#fff;font-size:12px;font-weight:600;color:var(--t2);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;}.sso-btn:hover{border-color:var(--t4);background:var(--bg);}
.sso-btn svg{width:16px;height:16px;}
.auth-footer{text-align:center;margin-top:24px;font-size:12px;color:var(--t4);}
.auth-footer a{color:var(--green);font-weight:600;text-decoration:none;}
.form-panel{display:none;}.form-panel.active{display:block;}

@media(max-width:768px){body{flex-direction:column;}.left{padding:30px;min-height:300px;}.left-mock{display:none;}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<div class="left">
  <div class="left-logo"><svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#22D3EE"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#lg)"/><path d="M8 12h16M8 16h12M8 20h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg><span>FinanceOS</span></div>
  <h2>The Command Center for<br/>Modern Finance Teams</h2>
  <p>Close your books 5x faster. Get real-time forecasting. Stay audit-ready with AI-powered FP&A.</p>
  <div class="trust-items">
    <div class="trust-item"><div class="ti-icon">SOC2</div> SOC 2 Type II</div>
    <div class="trust-item"><div class="ti-icon">GDPR</div> GDPR Compliant</div>
    <div class="trust-item"><div class="ti-icon">500+</div> Teams onboarded</div>
    <div class="trust-item"><div class="ti-icon">99.9%</div> Uptime SLA</div>
  </div>
  <div class="left-mock">
    <div class="lm-top"><div class="lm-dot" style="background:#EF4444;"></div><div class="lm-dot" style="background:#F59E0B;"></div><div class="lm-dot" style="background:#10B981;"></div></div>
    <div class="lm-kpis">
      <div class="lm-kpi"><div class="lk-label">Revenue</div><div class="lk-value">$4.2M</div><div class="lk-change">+12.3%</div></div>
      <div class="lm-kpi"><div class="lk-label">NDR</div><div class="lk-value">118%</div><div class="lk-change">+3pp</div></div>
      <div class="lm-kpi"><div class="lk-label">Runway</div><div class="lk-value">18.2mo</div><div class="lk-change">+2.4mo</div></div>
    </div>
  </div>
</div>

<div class="right">
  <div class="auth-box">
    <h1>Welcome back</h1>
    <div class="sub">Sign in to your account or create a new one.</div>
    <div class="auth-tabs">
      <div class="auth-tab active" onclick="showTab('signin',this)">Sign In</div>
      <div class="auth-tab" onclick="showTab('signup',this)">Sign Up</div>
    </div>

    <!-- SIGN IN -->
    <div class="form-panel active" id="signin">
      <div class="form-group"><label>Email</label><input type="email" placeholder="you@company.com"/></div>
      <div class="form-group"><label>Password</label><input type="password" placeholder="Enter your password"/></div>
      <div class="form-extras"><label><input type="checkbox"/> Remember me</label><a href="#">Forgot password?</a></div>
      <button class="btn-submit">Sign In</button>
      <div class="divider">or continue with</div>
      <div class="sso-btns">
        <button class="sso-btn"><svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Google</button>
        <button class="sso-btn"><svg viewBox="0 0 24 24"><path d="M3 3h8.5v8.5H3V3zm9.5 0H21v8.5h-8.5V3zM3 12.5h8.5V21H3v-8.5zm9.5 0H21V21h-8.5v-8.5z" fill="#00A4EF"/></svg> Microsoft</button>
        <button class="sso-btn"><svg viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000"/></svg> Apple</button>
      </div>
    </div>

    <!-- SIGN UP -->
    <div class="form-panel" id="signup">
      <div class="form-row">
        <div class="form-group"><label>First Name</label><input type="text" placeholder="Alex"/></div>
        <div class="form-group"><label>Last Name</label><input type="text" placeholder="Chen"/></div>
      </div>
      <div class="form-group"><label>Work Email</label><input type="email" placeholder="you@company.com"/></div>
      <div class="form-group"><label>Company</label><input type="text" placeholder="Acme Inc."/></div>
      <div class="form-group"><label>Password</label><input type="password" placeholder="Create a strong password"/></div>
      <button class="btn-submit">Create Account</button>
      <div class="divider">or continue with</div>
      <div class="sso-btns">
        <button class="sso-btn"><svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Google</button>
        <button class="sso-btn"><svg viewBox="0 0 24 24"><path d="M3 3h8.5v8.5H3V3zm9.5 0H21v8.5h-8.5V3zM3 12.5h8.5V21H3v-8.5zm9.5 0H21V21h-8.5v-8.5z" fill="#00A4EF"/></svg> Microsoft</button>
        <button class="sso-btn"><svg viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000"/></svg> Apple</button>
      </div>
    </div>

    <div class="auth-footer">By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.<br/><a href="FinanceOS-Landing-Page.html" style="color:var(--t4);font-weight:500;">&larr; Back to home</a></div>
  </div>
</div>


` }} />
    </>
  );
}
