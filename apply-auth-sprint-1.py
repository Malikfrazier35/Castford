#!/usr/bin/env python3
"""Baseline Auth Sprint 1 — login.html hardening.
Closes: A-002 (login enumeration), A-003 (password length 8->12),
        A-009 (reset-flow enumeration), plus defense-in-depth on
        OAuth/SSO error surfacing (AUTH-026 hardening)."""
import pathlib, sys

PATH = pathlib.Path('public/site/login.html')
if not PATH.exists():
    print(f'ERROR: {PATH} not found. Run from Castford repo root.')
    sys.exit(1)

content = PATH.read_text()
original_length = len(content)

replacements = [
    ('<div class="lc-error" id="pwError">Password must be at least 8 characters</div>',
     '<div class="lc-error" id="pwError">Password must be at least 12 characters</div>'),
    ("if(!pw||pw.length<8){document.getElementById('pwError').style.display='block';return}",
     "if(!pw||pw.length<12){document.getElementById('pwError').textContent='Password must be at least 12 characters';document.getElementById('pwError').style.display='block';return}"),
    ("document.getElementById('pwError').textContent=error.message;document.getElementById('pwError').style.display='block'}else{window.location.href=RD}",
     "document.getElementById('pwError').textContent='Sign in failed. Check your credentials and try again.';document.getElementById('pwError').style.display='block'}else{window.location.href=RD}"),
    ("sb.auth.resetPasswordForEmail(e,{redirectTo:'https://castford.com/site/reset-password.html'}).then(({error})=>{alert(error?error.message:'Check your email')})",
     "sb.auth.resetPasswordForEmail(e,{redirectTo:'https://castford.com/site/reset-password.html'}).then(()=>{alert('If an account exists for that email, a password reset link has been sent. Please check your inbox.')})"),
    ("signInWithOAuth({provider:'apple',options:{redirectTo:RD}});if(error){b.classList.remove('loading');alert(error.message)}",
     "signInWithOAuth({provider:'apple',options:{redirectTo:RD}});if(error){b.classList.remove('loading');alert('Apple sign-in is temporarily unavailable. Please try again or use another method.')}"),
    ("signInWithOAuth({provider:'google',options:{redirectTo:RD}});if(error){b.classList.remove('loading');alert(error.message)}",
     "signInWithOAuth({provider:'google',options:{redirectTo:RD}});if(error){b.classList.remove('loading');alert('Google sign-in is temporarily unavailable. Please try again or use another method.')}"),
    ("sb.auth.signInWithSSO({domain:d}).then(({data,error})=>{if(error)alert(error.message);else if(data?.url)window.location.href=data.url})",
     "sb.auth.signInWithSSO({domain:d}).then(({data,error})=>{if(error)alert('SSO is not configured for that domain. Please contact your administrator or use another sign-in method.');else if(data?.url)window.location.href=data.url})"),
]

applied, missing = 0, []
for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        applied += 1
    else:
        missing.append(old[:80] + ('...' if len(old) > 80 else ''))

PATH.write_text(content)
delta = len(content) - original_length
print(f'Applied {applied}/{len(replacements)} replacements ({delta:+} chars)')
if missing:
    print(f'WARNING: {len(missing)} pattern(s) not found (may already be patched):')
    for m in missing:
        print(f'  - {m}')
