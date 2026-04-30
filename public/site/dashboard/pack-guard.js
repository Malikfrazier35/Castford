/**
 * Castford — L3 Pro Pack entitlement guard (v2)
 *
 * Loaded with `<script src="/site/dashboard/pack-guard.js" data-pack="cfo">`
 * at the top of <head>. Runs before page content renders.
 *
 * v2 changes (fixes infinite login loop):
 *   - Reads token from Supabase JS v2 storage key `sb-{ref}-auth-token`
 *     (was reading legacy `sb_access_token` which doesn't exist anymore)
 *   - Adds Enterprise plan auto-grant: if org.plan === 'enterprise', all
 *     packs are unlocked without requiring rows in org_pack_purchases
 *   - Better diagnostic messages in console
 */

(function () {
  'use strict';

  var SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4ODkwNjIsImV4cCI6MjA4OTQ2NTA2Mn0.bR9I7_-eFbJzMBncm5Azgj7CfJWlTMXBpjz_vYfX7_Q';
  var SB_AUTH_KEY = 'sb-crecesswagluelvkesul-auth-token';
  var VALID_SLUGS = ['cfo', 'controller', 'fp_a', 'fpa', 'ceo'];
  var ACTIVE_STATUSES = ['active', 'trialing'];
  var AUTO_GRANT_PLANS = ['enterprise']; // these plans auto-grant all packs

  // Identify the calling script tag to read its data-pack
  var thisScript = document.currentScript;
  if (!thisScript) {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.indexOf('pack-guard.js') !== -1) {
        thisScript = scripts[i];
        break;
      }
    }
  }
  var packSlug = thisScript ? thisScript.getAttribute('data-pack') : null;

  if (!packSlug || VALID_SLUGS.indexOf(packSlug) === -1) {
    console.error('[pack-guard] Missing or invalid data-pack attribute:', packSlug);
    reveal();
    return;
  }

  // Normalize slug: 'fpa' in URL → 'fp_a' in DB
  var dbSlug = packSlug === 'fpa' ? 'fp_a' : packSlug;

  // ?preview=1 bypass for demos / marketing screenshots
  try {
    var qs = new URLSearchParams(window.location.search);
    if (qs.get('preview') === '1') {
      console.info('[pack-guard] preview bypass active for', dbSlug);
      reveal();
      return;
    }
  } catch (e) {}

  // Auth token (Supabase v2 storage format)
  var token = null;
  try {
    var raw = localStorage.getItem(SB_AUTH_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      token = parsed.access_token || (parsed.currentSession && parsed.currentSession.access_token);
    }
  } catch (e) {
    console.warn('[pack-guard] failed to parse auth token:', e);
  }

  if (!token) {
    console.info('[pack-guard] no token in', SB_AUTH_KEY, '— redirecting to login');
    redirectLogin('no_token');
    return;
  }

  // Step 1: Check if org plan auto-grants all packs (Enterprise)
  fetchOrgPlan().then(function (plan) {
    if (plan && AUTO_GRANT_PLANS.indexOf(plan) !== -1) {
      console.info('[pack-guard]', plan.toUpperCase(), 'plan auto-grants', dbSlug);
      reveal();
      return;
    }
    // Step 2: Check entitlement table
    checkEntitlement(0);
  }).catch(function (err) {
    console.warn('[pack-guard] org plan lookup failed:', err);
    checkEntitlement(0);
  });

  function fetchOrgPlan() {
    var url = SB_URL + '/rest/v1/users?select=org_id,organizations(plan)&limit=1';
    return fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SB_ANON,
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      }
    })
      .then(function (r) {
        if (r.status === 401 || r.status === 403) {
          try { localStorage.removeItem(SB_AUTH_KEY); } catch (e) {}
          redirectLogin('token_expired');
          return null;
        }
        if (!r.ok) throw new Error('Status ' + r.status);
        return r.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows) || rows.length === 0) return null;
        var row = rows[0];
        return row.organizations && row.organizations.plan ? row.organizations.plan : null;
      });
  }

  function checkEntitlement(attempt) {
    var url = SB_URL + '/rest/v1/org_pack_purchases'
      + '?select=pack_slug,status,current_period_end,cancel_at_period_end'
      + '&pack_slug=eq.' + encodeURIComponent(dbSlug)
      + '&status=in.(' + ACTIVE_STATUSES.join(',') + ')'
      + '&limit=1';
    fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SB_ANON,
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json'
      }
    })
      .then(function (r) {
        if (r.status === 401 || r.status === 403) {
          try { localStorage.removeItem(SB_AUTH_KEY); } catch (e) {}
          redirectLogin('token_expired');
          return null;
        }
        if (!r.ok) throw new Error('Status ' + r.status);
        return r.json();
      })
      .then(function (rows) {
        if (rows === null) return;
        if (Array.isArray(rows) && rows.length > 0) {
          console.info('[pack-guard]', dbSlug, 'entitled via', rows[0].status);
          reveal();
        } else {
          console.info('[pack-guard]', dbSlug, 'has no active entitlement → /packs');
          redirectPacks('no_active');
        }
      })
      .catch(function (err) {
        console.warn('[pack-guard] entitlement check failed (attempt ' + attempt + '):', err);
        if (attempt < 1) {
          setTimeout(function () { checkEntitlement(attempt + 1); }, 600);
        } else {
          redirectPacks('verify_failed');
        }
      });
  }

  function reveal() {
    if (document.documentElement.hasAttribute('data-pp-checking')) {
      document.documentElement.removeAttribute('data-pp-checking');
    }
  }

  function redirectLogin(reason) {
    var path = window.location.pathname + window.location.search;
    window.location.replace('/login?return=' + encodeURIComponent(path)
      + '&reason=' + encodeURIComponent(reason));
  }

  function redirectPacks(reason) {
    window.location.replace('/packs?required=' + encodeURIComponent(packSlug)
      + '&reason=' + encodeURIComponent(reason));
  }

})();
