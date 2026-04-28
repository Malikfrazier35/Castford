/* Castford Pack Checkout v1 — castford-pack-checkout.js
   Loaded on /packs page after Supabase JS SDK.

   Flow on Subscribe click:
   1. Get current Supabase session
   2. If not signed in → redirect to /login?next=/packs
   3. POST to /functions/v1/create-pack-checkout with {pack_slug, interval}
   4. On 200 → redirect to Stripe Checkout URL
   5. On 401 → redirect to /login
   6. On 403 → toast "Owner/admin only"
   7. On 409 → toast "You already have this pack"
   8. On 5xx → toast "Try again"

   Also shows a "Signed in as ..." badge in the bottom-right when authenticated.
*/

(function () {
  'use strict';

  var SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  var SB_ANON =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTI5NzYsImV4cCI6MjA4OTM4ODk3Nn0.IGEEYDStt-eH9Mf2G_DzqCPfruDjN8m_ORtAcmtSAZg';

  var sb = null;
  var currentSession = null;

  function toast(msg, kind) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (kind ? ' ' + kind : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.className = 'toast';
    }, 4500);
  }

  function getBilling() {
    var active = document.querySelector('.bt-opt.active');
    if (!active) return 'monthly';
    return active.dataset.billingSet === 'annual' ? 'annual' : 'monthly';
  }

  function setLoading(btn, isLoading) {
    if (!btn) return;
    btn.classList.toggle('loading', !!isLoading);
    btn.disabled = !!isLoading;
  }

  async function handleBuy(btn) {
    var packSlug = btn.getAttribute('data-pack-buy');
    if (!packSlug) return;

    var interval = getBilling();

    if (!currentSession) {
      // Persist where to come back to after login
      try {
        sessionStorage.setItem('cf_after_login', '/packs');
      } catch (e) {}
      window.location.href = '/login?next=/packs';
      return;
    }

    setLoading(btn, true);

    try {
      var r = await fetch(SB_URL + '/functions/v1/create-pack-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + currentSession.access_token,
          apikey: SB_ANON
        },
        body: JSON.stringify({
          pack_slug: packSlug,
          interval: interval,
          success_path: '/dashboard?pack_purchased=' + packSlug,
          cancel_path: '/packs'
        })
      });

      var body = null;
      try {
        body = await r.json();
      } catch (e) {}

      if (r.status === 200 && body && body.url) {
        // Redirect to Stripe Checkout
        window.location.href = body.url;
        return;
      }

      if (r.status === 401) {
        toast('Please sign in to subscribe.', 'error');
        setTimeout(function () {
          window.location.href = '/login?next=/packs';
        }, 1200);
        return;
      }

      if (r.status === 403) {
        toast(
          'Only the org Owner or an Admin can purchase packs. Ask your account owner to subscribe.',
          'error'
        );
        return;
      }

      if (r.status === 409) {
        toast(
          'Your organization already has the ' +
            packLabel(packSlug) +
            ' active. Manage it from Settings → Billing.',
          'error'
        );
        return;
      }

      if (r.status >= 500) {
        toast('Stripe is having a moment. Please try again in a few seconds.', 'error');
        return;
      }

      // 4xx fallthrough
      var msg = (body && (body.error || body.message)) || 'Something went wrong.';
      toast(msg, 'error');
    } catch (err) {
      console.warn('pack-checkout error', err);
      toast('Network error — please retry.', 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  function packLabel(slug) {
    var m = {
      cfo: 'CFO Pack',
      controller: 'Controller Pack',
      fp_a: 'FP&A Pack',
      ceo: 'CEO Pack'
    };
    return m[slug] || 'pack';
  }

  function showAuthBadge(email, orgName) {
    var badge = document.getElementById('authBadge');
    var emailEl = document.getElementById('authEmail');
    var orgEl = document.getElementById('authOrg');
    if (!badge || !emailEl) return;
    emailEl.textContent = email || 'Signed in';
    if (orgEl && orgName) orgEl.textContent = '· ' + orgName;
    badge.classList.add('show');
  }

  async function init() {
    if (!window.supabase || !window.supabase.createClient) {
      console.warn('Supabase JS SDK not loaded');
      // Wire buttons anyway — they'll redirect to /login
      wireButtons();
      return;
    }

    sb = window.supabase.createClient(SB_URL, SB_ANON);

    try {
      var res = await sb.auth.getSession();
      currentSession = (res && res.data && res.data.session) || null;
    } catch (e) {
      console.warn('getSession failed', e);
      currentSession = null;
    }

    if (currentSession) {
      var email = currentSession.user && currentSession.user.email;

      // Try to enrich badge with org name (non-blocking)
      try {
        var r = await fetch(SB_URL + '/functions/v1/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + currentSession.access_token,
            apikey: SB_ANON
          }
        });
        if (r.ok) {
          var data = await r.json();
          var orgName =
            (data.organization && (data.organization.name || data.organization.slug)) ||
            data.org_name ||
            null;
          showAuthBadge(email, orgName);
        } else {
          showAuthBadge(email, null);
        }
      } catch (e) {
        showAuthBadge(email, null);
      }
    }

    wireButtons();

    // Listen for auth changes (e.g. session refresh)
    sb.auth.onAuthStateChange(function (_event, session) {
      currentSession = session || null;
    });
  }

  function wireButtons() {
    document.querySelectorAll('[data-pack-buy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        handleBuy(btn);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
