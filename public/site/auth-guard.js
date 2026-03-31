/**
 * FinanceOS Auth Guard
 * Include this script on any protected page (dashboard, workspace, etc.)
 * It checks for a valid Supabase session and redirects to /login if none exists.
 * Also exposes the session and user object for the page to use.
 */
(function(){
  'use strict';

  var SUPABASE_URL='https://crecesswagluelvkesul.supabase.co';
  var SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTI5NzYsImV4cCI6MjA4OTM4ODk3Nn0.IGEEYDStt-eH9Mf2G_DzqCPfruDjN8m_ORtAcmtSAZg';

  // Only run if supabase client is available
  if(!window.supabase){
    console.warn('[AuthGuard] Supabase not loaded. Add the CDN script before auth-guard.js');
    return;
  }

  var sb;
  try{
    sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON,{
      auth:{flowType:'pkce',autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}
    });
  }catch(e){
    console.error('[AuthGuard] Init failed:',e);
    return;
  }

  // Expose globally for page use
  window.__fos_supabase=sb;
  window.__fos_user=null;
  window.__fos_session=null;

  // Check session
  sb.auth.getSession().then(function(result){
    if(!result.data||!result.data.session){
      // No session — redirect to login
      console.log('[AuthGuard] No session found. Redirecting to /login');
      window.location.href='/login';
      return;
    }

    // Valid session
    window.__fos_session=result.data.session;
    window.__fos_user=result.data.session.user;

    // Log session event
    var user=result.data.session.user;
    console.log('[AuthGuard] Authenticated:',user.email);

    // Dispatch custom event so page JS can react
    window.dispatchEvent(new CustomEvent('fos:auth',{detail:{user:user,session:result.data.session}}));
  });

  // Listen for sign out
  sb.auth.onAuthStateChange(function(event,session){
    if(event==='SIGNED_OUT'){
      window.__fos_user=null;
      window.__fos_session=null;
      window.location.href='/login';
    }
    if(event==='TOKEN_REFRESHED'&&session){
      window.__fos_session=session;
      window.__fos_user=session.user;
    }
  });

  // Expose sign out helper
  window.__fos_signOut=function(){
    sb.auth.signOut().then(function(){
      window.location.href='/login';
    });
  };

})();
