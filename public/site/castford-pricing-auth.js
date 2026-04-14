/* Castford Pricing Auth v1 — castford-pricing-auth.js
   Include on pricing.html AFTER the billing toggle script.
   
   What it does:
   1. Checks if user is logged in via Supabase
   2. If logged in: appends ?client_reference_id=ORG_ID to all Payment Link URLs
   3. If not logged in: Payment Links work normally (email fallback in webhook)
   4. Shows "Signed in as..." badge on pricing page
   
   This solves the org provisioning gap:
   - Logged in user clicks Subscribe → Payment Link has org_id → webhook provisions correctly
   - Anonymous user clicks Subscribe → pays → webhook uses email matching as fallback
*/

(function() {
  'use strict';

  var SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTI5NzYsImV4cCI6MjA4OTM4ODk3Nn0.IGEEYDStt-eH9Mf2G_DzqCPfruDjN8m_ORtAcmtSAZg';

  async function init() {
    if (!window.supabase) return;
    var sb = window.supabase.createClient(SB_URL, SB_KEY);
    var result = await sb.auth.getSession();
    var session = result.data.session;
    if (!session) return; // Not logged in — Payment Links work via email fallback

    // Get org_id
    try {
      var r = await fetch(SB_URL + '/functions/v1/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.access_token }
      });
      if (!r.ok) return;
      var data = await r.json();
      var orgId = data.org_id || (data.organization && data.organization.id);
      if (!orgId) return;

      // Append client_reference_id to all Payment Link URLs
      var links = document.querySelectorAll('a[href*="buy.stripe.com"]');
      links.forEach(function(link) {
        var href = link.getAttribute('href');
        if (href && !href.includes('client_reference_id')) {
          var separator = href.includes('?') ? '&' : '?';
          link.setAttribute('href', href + separator + 'client_reference_id=' + orgId);
        }
        // Also update data-monthly and data-annual attributes
        ['data-monthly', 'data-annual'].forEach(function(attr) {
          var val = link.getAttribute(attr);
          if (val && val.includes('buy.stripe.com') && !val.includes('client_reference_id')) {
            var sep = val.includes('?') ? '&' : '?';
            link.setAttribute(attr, val + sep + 'client_reference_id=' + orgId);
          }
        });
      });

      // Also patch the billing toggle function so switching monthly/annual preserves the param
      var originalSetBilling = window.setBilling;
      if (originalSetBilling) {
        window.setBilling = function(mode) {
          originalSetBilling(mode);
          // Re-append client_reference_id after toggle switches URLs
          document.querySelectorAll('.plan-btn.green').forEach(function(btn) {
            var href = btn.getAttribute('href');
            if (href && href.includes('buy.stripe.com') && !href.includes('client_reference_id')) {
              var sep = href.includes('?') ? '&' : '?';
              btn.setAttribute('href', href + sep + 'client_reference_id=' + orgId);
            }
          });
        };
      }

      // Show signed-in badge
      var email = session.user.email;
      var plan = data.plan || (data.organization && data.organization.plan) || 'demo';
      var badge = document.createElement('div');
      badge.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:200;padding:8px 16px;background:var(--ink,#0f172a);color:#fff;font:600 12px "DM Sans",sans-serif;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(0,0,0,0.15)';
      badge.innerHTML = '<span style="width:6px;height:6px;background:#10b981;border-radius:50%;flex-shrink:0"></span>' + email + ' <span style="opacity:0.5">(' + plan + ')</span>';
      document.body.appendChild(badge);

    } catch (err) {
      console.warn('Pricing auth: could not resolve org', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
