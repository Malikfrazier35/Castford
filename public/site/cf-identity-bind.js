/* Castford Identity Bind v1
 *
 * Auto-binds elements with data-cf-bind="X" to live user/org data.
 *
 * Bindings:
 *   data-cf-bind="user.full_name"   → e.g. "Jane Doe"
 *   data-cf-bind="user.first_name"  → "Jane"
 *   data-cf-bind="user.email"       → "jane@acme.com"
 *   data-cf-bind="user.initials"    → "JD"
 *   data-cf-bind="org.name"         → e.g. "Acme Co"
 *   data-cf-bind="org.name_upper"   → "ACME CO"
 *   data-cf-bind="org.plan"         → "Growth"
 *   data-cf-bind="org.plan_upper"   → "GROWTH"
 *
 * Optional fallback: data-cf-fallback="..." (text shown if value missing)
 *
 * Usage on any page:
 *   <span data-cf-bind="user.full_name" data-cf-fallback="Loading…">…</span>
 *   <script src="/site/cf-identity-bind.js" defer></script>
 *
 * Requires window.__fos_supabase + window.__fos_session (set by auth-guard.js).
 */
(function(){
  'use strict';
  if (window.__cfIdentityBindLoaded) return;
  window.__cfIdentityBindLoaded = true;

  function initials(name){
    if (!name) return '··';
    var parts = String(name).trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  }

  function setBindings(values){
    var els = document.querySelectorAll('[data-cf-bind]');
    for (var i = 0; i < els.length; i++){
      var el = els[i];
      var key = el.getAttribute('data-cf-bind');
      var val = values[key];
      var fallback = el.getAttribute('data-cf-fallback') || '';
      if (val == null || val === '') val = fallback;
      // Only update if changed (avoid flicker)
      if (el.textContent !== val) el.textContent = val;
    }
  }

  function buildValues(user, profile, org){
    var fullName = (profile && profile.full_name)
      || (user && user.user_metadata && user.user_metadata.full_name)
      || (user && user.email && user.email.split('@')[0])
      || '';
    var firstName = fullName ? fullName.split(/\s+/)[0] : '';
    var email = (user && user.email) || '';
    var orgName = (org && org.name) || '';
    var plan = (org && org.plan) || '';
    var planLabel = ({
      demo: 'Demo', pending: 'Pending',
      starter: 'Starter', growth: 'Growth',
      business: 'Business', enterprise: 'Enterprise'
    })[plan] || (plan ? plan[0].toUpperCase() + plan.slice(1) : '');

    return {
      'user.full_name': fullName,
      'user.first_name': firstName,
      'user.email': email,
      'user.initials': initials(fullName),
      'org.name': orgName,
      'org.name_upper': orgName.toUpperCase(),
      'org.plan': planLabel,
      'org.plan_upper': planLabel.toUpperCase()
    };
  }

  function hydrate(){
    var sb = window.__fos_supabase;
    var session = window.__fos_session;
    if (!sb || !session || !session.user) return;

    var user = session.user;
    // Cache values so rehydrate calls don't refetch
    if (window.__cfIdentityCache) {
      setBindings(window.__cfIdentityCache);
      return;
    }

    // First pass: hydrate from session metadata immediately (no network round-trip)
    setBindings(buildValues(user, null, null));

    // Second pass: enrich with public.users + organizations data
    sb.from('users').select('full_name, org_id').eq('id', user.id).maybeSingle().then(function(uRes){
      var profile = (uRes && uRes.data) || null;
      if (!profile || !profile.org_id) {
        var v1 = buildValues(user, profile, null);
        window.__cfIdentityCache = v1;
        setBindings(v1);
        return;
      }
      sb.from('organizations').select('name, plan').eq('id', profile.org_id).maybeSingle().then(function(oRes){
        var org = (oRes && oRes.data) || null;
        var v2 = buildValues(user, profile, org);
        window.__cfIdentityCache = v2;
        setBindings(v2);
      });
    });
  }

  // Public rehydrate — call this after dynamically rendering content with data-cf-bind
  window.cfRehydrate = function(){
    if (window.__cfIdentityCache) {
      setBindings(window.__cfIdentityCache);
    } else {
      hydrate();
    }
  };

  // Wait for auth-guard to populate session (max 5s)
  var attempts = 0;
  var iv = setInterval(function(){
    attempts++;
    if ((window.__fos_supabase && window.__fos_session) || attempts > 100) {
      clearInterval(iv);
      hydrate();
    }
  }, 50);
})();
