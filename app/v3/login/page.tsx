'use client';

import { useEffect, useRef } from 'react';

export default function V3LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `const testimonials=document.querySelectorAll('.testimonial');let current=0;
setInterval(()=>{testimonials[current].classList.remove('active');current=(current+1)%testimonials.length;testimonials[current].classList.add('active')},5000);

const pw=document.getElementById('password'),toggle=document.getElementById('togglePw');
toggle.addEventListener('click',()=>{const isPw=pw.type==='password';pw.type=isPw?'text':'password';toggle.textContent=isPw?'Hide':'Show'});

document.getElementById('loginForm').addEventListener('submit',e=>{
  e.preventDefault();let valid=true;
  const email=document.getElementById('email'),emailErr=document.getElementById('emailError'),pwErr=document.getElementById('pwError');
  if(!email.value.match(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/)){email.classList.add('error');emailErr.classList.add('show');valid=false}else{email.classList.remove('error');emailErr.classList.remove('show')}
  if(pw.value.length<8){pw.classList.add('error');pwErr.classList.add('show');valid=false}else{pw.classList.remove('error');pwErr.classList.remove('show')}
  if(valid)alert('Sign in successful! (demo)');
});`
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

:root{--green:#10B981;--green-light:#D1FAE5;--green-dark:#059669;--bg:#FFFFFF;--bg-alt:#F8FAFC;--text:#1E293B;--text-secondary:#475569;--muted:#64748B;--border:#E2E8F0;--font:'DM Sans',system-ui,sans-serif;--mono:'JetBrains Mono',monospace}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--font);background:var(--bg-alt);color:var(--text);min-height:100vh;display:grid;grid-template-columns:1.1fr 0.9fr;-webkit-font-smoothing:antialiased}

/* LEFT */
.left{position:relative;padding:48px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(135deg,#F0FDF4 0%,#ECFDF5 40%,#D1FAE5 100%);overflow:hidden}
.left-bg{position:absolute;inset:0;z-index:0;overflow:hidden}
.orb{position:absolute;border-radius:50%;filter:blur(60px);opacity:0.25;animation:float 12s ease-in-out infinite}
.orb.o1{width:350px;height:350px;background:var(--green);top:10%;left:-8%;animation-delay:0s}
.orb.o2{width:250px;height:250px;background:#22D3EE;bottom:15%;right:-5%;animation-delay:-4s}
.orb.o3{width:200px;height:200px;background:#8B5CF6;top:45%;left:35%;animation-delay:-8s;opacity:0.12}
@keyframes float{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.03)}}

.left-content{position:relative;z-index:1}
.logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:18px;margin-bottom:80px;color:var(--text)}
.logo-dot{width:10px;height:10px;background:var(--green);border-radius:50%}
.left h1{font-size:clamp(30px,3.5vw,44px);font-weight:700;line-height:1.15;margin-bottom:32px;color:var(--text);letter-spacing:-0.02em}
.left h1 span{color:var(--green-dark)}

.testimonial-container{position:relative;height:90px;margin-bottom:40px}
.testimonial{position:absolute;top:0;left:0;right:0;opacity:0;transition:opacity .8s;max-width:440px}
.testimonial.active{opacity:1}
.testimonial p{font-size:14px;color:var(--text-secondary);line-height:1.6;font-style:italic;margin-bottom:6px}
.testimonial .author{font-size:13px;font-weight:600;color:var(--text)}

.left-stats{position:relative;z-index:1;display:flex;gap:28px;padding-top:20px;border-top:1px solid rgba(16,185,129,0.2)}
.left-stat .val{font-family:var(--mono);font-size:18px;font-weight:700;color:var(--text)}
.left-stat .label{font-size:11px;color:var(--muted);margin-top:1px}

/* RIGHT */
.right{display:flex;align-items:center;justify-content:center;padding:48px;background:var(--bg);border-left:1px solid var(--border)}
.form-container{width:100%;max-width:360px}
.form-container h2{font-size:26px;font-weight:700;margin-bottom:4px}
.form-container .subtitle{color:var(--muted);font-size:14px;margin-bottom:28px}

.sso-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:11px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;font-weight:500;font-family:var(--font);cursor:pointer;transition:all .15s;margin-bottom:8px}
.sso-btn:hover{border-color:#CBD5E1;background:var(--bg-alt)}
.sso-btn svg{flex-shrink:0}

.divider{display:flex;align-items:center;gap:14px;margin:20px 0}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
.divider span{font-size:12px;color:#94A3B8;text-transform:uppercase}

.field{margin-bottom:14px}
.field label{display:block;font-size:13px;font-weight:500;margin-bottom:5px;color:var(--text-secondary)}
.field-input-wrap{position:relative}
.field input{width:100%;padding:11px 14px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;font-family:var(--font);outline:none;transition:all .15s}
.field input:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(16,185,129,0.1)}
.field input.error{border-color:#EF4444;box-shadow:0 0 0 3px rgba(239,68,68,0.1)}
.field .error-msg{font-size:12px;color:#EF4444;margin-top:3px;display:none}
.field .error-msg.show{display:block}
.toggle-pw{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--muted);font-size:12px;cursor:pointer;font-family:var(--font)}
.toggle-pw:hover{color:var(--text)}

.forgot-row{text-align:right;margin-bottom:20px}
.forgot-row a{font-size:13px;color:var(--green-dark);font-weight:500}

.submit-btn{width:100%;padding:12px;border-radius:10px;background:var(--green);color:#fff;font-size:15px;font-weight:600;font-family:var(--font);border:none;cursor:pointer;transition:all .15s}
.submit-btn:hover{background:var(--green-dark);box-shadow:0 2px 8px rgba(16,185,129,0.25)}

.signup-link{text-align:center;margin-top:20px;font-size:13px;color:var(--muted)}
.signup-link a{color:var(--green-dark);font-weight:600}

.trust-badges{display:flex;justify-content:center;gap:16px;margin-top:32px;padding-top:20px;border-top:1px solid var(--border)}
.trust-badge{font-size:11px;color:#94A3B8;font-weight:500}

@media(max-width:900px){
  body{grid-template-columns:1fr}
  .left{display:none}
  .right{border-left:none;min-height:100vh}
}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<div class="left">
  <div class="left-bg"><div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div></div>
  <div class="left-content">
    <div class="logo"><span class="logo-dot"></span> FinanceOS</div>
    <h1>Plan smarter.<br><span>Close faster.</span></h1>
    <div class="testimonial-container" id="testimonials">
      <div class="testimonial active"><p>"FinanceOS cut our monthly close from 12 days to 3. The AI copilot is like having a senior analyst on call 24/7."</p><div class="author">Sarah Chen, VP Finance</div></div>
      <div class="testimonial"><p>"We replaced three separate tools with FinanceOS. The xP&A planning finally connects our revenue team to finance."</p><div class="author">Marcus Rivera, CFO</div></div>
      <div class="testimonial"><p>"The scenario modeling saved us during our Series C. We ran 50 what-if models in an afternoon."</p><div class="author">Priya Patel, Head of FP&A</div></div>
    </div>
  </div>
  <div class="left-stats">
    <div class="left-stat"><div class="val">$48.6M</div><div class="label">ARR</div></div>
    <div class="left-stat"><div class="val">2,400+</div><div class="label">Teams</div></div>
    <div class="left-stat"><div class="val">118%</div><div class="label">NDR</div></div>
  </div>
</div>

<div class="right">
  <div class="form-container">
    <h2>Welcome back</h2>
    <p class="subtitle">Sign in to your FinanceOS account</p>

    <button class="sso-btn">
      <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09a7.12 7.12 0 010-4.17V7.08H2.18a11.97 11.97 0 000 9.84l3.66-2.83z" fill="#FBBC05"/><path d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.16 6.16-4.16z" fill="#EA4335"/></svg>
      Continue with Google
    </button>
    <button class="sso-btn">
      <svg width="18" height="18" viewBox="0 0 23 23"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#00a4ef" d="M1 12h10v10H1z"/><path fill="#7fba00" d="M12 1h10v10H12z"/><path fill="#ffb900" d="M12 12h10v10H12z"/></svg>
      Continue with Microsoft
    </button>
    <button class="sso-btn">
      <svg width="18" height="18" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000"/></svg>
      Continue with Apple
    </button>
    <button class="sso-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
      Continue with SSO / SAML
    </button>

    <div class="divider"><span>or</span></div>

    <form id="loginForm" novalidate>
      <div class="field"><label for="email">Email</label><input type="email" id="email" placeholder="you@company.com" autocomplete="email"><div class="error-msg" id="emailError">Please enter a valid email address</div></div>
      <div class="field"><label for="password">Password</label><div class="field-input-wrap"><input type="password" id="password" placeholder="••••••••" autocomplete="current-password"><button type="button" class="toggle-pw" id="togglePw">Show</button></div><div class="error-msg" id="pwError">Password must be at least 8 characters</div></div>
      <div class="forgot-row"><a href="#">Forgot password?</a></div>
      <button type="submit" class="submit-btn">Sign In</button>
    </form>

    <div class="signup-link">Don't have an account? <a href="#">Start free trial</a></div>
    <div class="trust-badges"><span class="trust-badge">SOC 2 Type II</span><span class="trust-badge">·</span><span class="trust-badge">SOX 404</span><span class="trust-badge">·</span><span class="trust-badge">256-bit Encryption</span></div>
  </div>
</div>



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
