/**
 * Castford Auth Guard (v2 — sign-out cooldown + correct logout path)
 *
 * Include on any protected page (dashboards, workspace, etc.).
 * Checks for valid Supabase session and redirects to /login if absent.
 * Exposes session and user object globally for page use.
 *
 * v2 changes:
 *   - Respects `castford_signout_cooldown_until` flag set by /logout
 *   - When cooldown is active, redirects to /login WITHOUT processing
 *     URL auth params (prevents Apple SSO auto re-auth loop)
 *   - window.__fos_signOut now navigates to /logout instead of calling
 *     sb.auth.signOut() directly (uses the proper cleanup page)
 */
(function(){
  'use strict';

  var SUPABASE_URL='https://crecesswagluelvkesul.supabase.co';
  var SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTI5NzYsImV4cCI6MjA4OTM4ODk3Nn0.IGEEYDStt-eH9Mf2G_DzqCPfruDjN8m_ORtAcmtSAZg';
  var COOLDOWN_KEY = 'castford_signout_cooldown_until';

  if(!window.supabase){
    console.warn('[AuthGuard] Supabase not loaded. Add the CDN script before auth-guard.js');
    return;
  }

  // ── COOLDOWN CHECK (defense against Apple SSO auto re-auth) ──
  // If the user just signed out, refuse to detect URL auth params for 60s.
  // This prevents the redirect loop where:
  //   /logout → /login → Apple still authorized → instant re-auth
  var cooldownUntil = 0;
  try {
    cooldownUntil = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
  } catch (e) {}
  var inCooldown = cooldownUntil > Date.now();

  var sb;
  try{
    sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON,{
      auth:{
        flowType:'pkce',
        autoRefreshToken:!inCooldown, // freeze refresh during cooldown
        persistSession:true,
        // CRITICAL: don't auto-detect URL auth params during cooldown.
        // This is what was causing Apple to silently re-auth on /login.
        detectSessionInUrl:!inCooldown
      }
    });
  }catch(e){
    console.error('[AuthGuard] Init failed:',e);
    return;
  }

  // Expose globally for page use
  window.__fos_supabase=sb;
  window.__fos_user=null;
  window.__fos_session=null;
  window.__castford_in_cooldown = inCooldown;

  if (inCooldown) {
    var secondsLeft = Math.ceil((cooldownUntil - Date.now()) / 1000);
    console.log('[AuthGuard] Sign-out cooldown active for', secondsLeft, 'seconds — auth detection paused');
  }

  // Check session
  sb.auth.getSession().then(function(result){
    if(!result.data||!result.data.session){
      // No session — redirect to login (skip during cooldown to avoid loop with Apple)
      if (inCooldown) {
        console.log('[AuthGuard] No session + cooldown active — staying put');
        return;
      }
      console.log('[AuthGuard] No session found. Redirecting to /login');
      window.location.href='/login';
      return;
    }

    // Valid session client-side
    window.__fos_session=result.data.session;
    window.__fos_user=result.data.session.user;

    var user=result.data.session.user;
    console.log('[AuthGuard] Authenticated:',user.email);

    // ── STALE-SESSION CHECK ───────────────────────────────────────────
    // localStorage may have a session whose user has been deleted server-side.
    // getSession() returns the cached token without validation. Hit /user
    // (which validates the JWT against the DB) and force a clean signout if
    // the user no longer exists.
    sb.auth.getUser().then(function(uRes){
      if (uRes.error || !uRes.data || !uRes.data.user) {
        console.warn('[AuthGuard] Stale session — user not found server-side. Forcing signout.');
        // Manually nuke any sb-*-auth-token keys (signOut() can hang on stale sessions)
        try {
          for (var i = localStorage.length - 1; i >= 0; i--) {
            var k = localStorage.key(i);
            if (k && k.indexOf('sb-') === 0 && k.indexOf('auth-token') !== -1) {
              localStorage.removeItem(k);
            }
          }
          localStorage.removeItem('castford_signout_cooldown_until');
        } catch(_){}
        // Don't go through /logout (which would set a 60s cooldown blocking re-login)
        window.location.replace('/login?reason=stale_session');
        return;
      }

      // User is valid server-side. Continue with paid-plan gate check.

      // ── PAID-PLAN GATE ────────────────────────────────────────────────
      // Pages that bypass the gate (signup wizard, billing, logout, etc.)
      var path = window.location.pathname;
      var BYPASS = [
        '/site/signup.html', '/signup',
        '/site/login.html',  '/login',
        '/site/logout.html', '/logout',
        '/site/dashboard/billing.html', '/billing',
        '/site/checkout-success.html'
      ];
      var isBypass = BYPASS.some(function(p){ return path.indexOf(p) === 0; });

      if (!isBypass) {
        // Check plan + subscription. If unpaid → redirect to /signup?step=3
        sb.from('users').select('org_id').eq('id', user.id).maybeSingle().then(function(uRes){
          var orgId = uRes && uRes.data && uRes.data.org_id;
          if (!orgId) {
            console.log('[AuthGuard] No org → /signup?step=2');
            window.location.href = '/site/signup.html?step=2';
            return;
          }
          sb.from('organizations').select('plan, stripe_subscription_id, closed_at').eq('id', orgId).maybeSingle().then(function(oRes){
            var org = oRes && oRes.data;
            if (!org || org.closed_at) {
              console.log('[AuthGuard] Org missing or closed → /signup?step=2');
              window.location.href = '/site/signup.html?step=2';
              return;
            }
            var unpaid = (!org.stripe_subscription_id) && (org.plan === 'demo' || org.plan === 'pending' || !org.plan);
            if (unpaid) {
              console.log('[AuthGuard] Unpaid org (plan=' + org.plan + ') → /signup?step=3');
              window.location.href = '/site/signup.html?step=3';
              return;
            }
            // Passed the gate — reveal the page
            try { document.documentElement.classList.remove('cf-gate-checking'); } catch(_){}
            window.dispatchEvent(new CustomEvent('fos:auth',{detail:{user:user,session:result.data.session,org:org}}));
          });
        });
      } else {
        // Bypass page — reveal immediately, fire auth event without gate check
        try { document.documentElement.classList.remove('cf-gate-checking'); } catch(_){}
        window.dispatchEvent(new CustomEvent('fos:auth',{detail:{user:user,session:result.data.session}}));
      }
    });
  });

  // Listen for sign out — but route through /logout for proper cleanup
  sb.auth.onAuthStateChange(function(event,session){
    if(event==='SIGNED_OUT'){
      window.__fos_user=null;
      window.__fos_session=null;
      // Use /logout page for proper cleanup + cooldown setup
      // (only if we're not already on /logout to avoid loop)
      if (window.location.pathname !== '/logout' &&
          window.location.pathname !== '/site/logout.html') {
        window.location.href='/logout';
      }
    }
    if(event==='TOKEN_REFRESHED'&&session){
      window.__fos_session=session;
      window.__fos_user=session.user;
    }
  });

  // ── PUBLIC SIGN-OUT HELPER ──
  // ALWAYS navigate to /logout (which does proper cleanup + cooldown setup).
  // Do NOT call sb.auth.signOut() directly — that bypasses cleanup and
  // triggers the Apple SSO re-auth loop.
  window.__fos_signOut=function(){
    window.location.href='/logout';
  };

})();
