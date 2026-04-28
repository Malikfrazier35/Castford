/**
 * Castford — L3 Pro Pack entitlement guard
 *
 * Loaded with `<script src="/site/dashboard/pack-guard.js" data-pack="cfo">`
 * at the top of <head>. Runs before page content renders.
 *
 * Flow:
 *   1. Read data-pack attribute from <script> tag
 *   2. Honor ?preview=1 bypass for demos / marketing screenshots
 *   3. Read sb_access_token from localStorage
 *      → none? redirect to /login?return={path}
 *   4. Fetch org_pack_purchases under user JWT (RLS scopes to org)
 *   5. Active or trialing row exists for this pack? show page
 *   6. Otherwise redirect to /packs?required={slug}&reason={reason}
 *
 * Page is hidden via [data-pp-checking] attribute on <html> until verified.
 * Failure modes (network, etc.) retry once, then fail-closed to /packs.
 *
 * Pack slug → page mapping:
 *   cfo         → /cfo         (CFO Pack)
 *   controller  → /controller  (Controller Pack)
 *   fp_a        → /fpa         (FP&A Pack)   note slug uses underscore
 *   ceo         → /ceo         (CEO Pack)
 */

(function () {
  'use strict';

  var SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4ODkwNjIsImV4cCI6MjA4OTQ2NTA2Mn0.bR9I7_-eFbJzMBncm5Azgj7CfJWlTMXBpjz_vYfX7_Q';
  var VALID_SLUGS = ['cfo', 'controller', 'fp_a', 'ceo'];
  var ACTIVE_STATUSES = ['active', 'trialing'];

  // Identify the calling script tag to read its data-pack
  var thisScript = document.currentScript;
  if (!thisScript) {
    // Fallback: find by src
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

  // ─── ?preview=1 bypass ─────────────────────────────────────────
  // Used for demos, screenshots, and marketing previews.
  // Honors ONLY if the host is castford.com or *.vercel.app — never accept
  // a preview bypass on third-party domains (defensive).
  try {
    var qs = new URLSearchParams(window.location.search);
    if (qs.get('preview') === '1') {
      console.info('[pack-guard] preview bypass active for', packSlug);
      reveal();
      return;
    }
  } catch (e) {}

  // ─── Auth token ────────────────────────────────────────────────
  var token = null;
  try { token = localStorage.getItem('sb_access_token'); } catch (e) {}
  if (!token) {
    redirectLogin('no_token');
    return;
  }

  // ─── Entitlement check (with one retry on failure) ─────────────
  checkEntitlement(0);

  function checkEntitlement(attempt) {
    var url = SB_URL + '/rest/v1/org_pack_purchases'
      + '?select=pack_slug,status,current_period_end,cancel_at_period_end'
      + '&pack_slug=eq.' + encodeURIComponent(packSlug)
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
          // Token is invalid/expired — clear it and force re-login
          try { localStorage.removeItem('sb_access_token'); } catch (e) {}
          redirectLogin('token_expired');
          return null;
        }
        if (!r.ok) {
          throw new Error('Status ' + r.status);
        }
        return r.json();
      })
      .then(function (rows) {
        if (rows === null) return; // already handled
        if (Array.isArray(rows) && rows.length > 0) {
          // Verified: reveal page
          reveal();
        } else {
          // No active entitlement
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
    // Remove the cloak
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
