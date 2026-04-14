/* Castford Auth Middleware v1 — castford-auth.js
   Include on every dashboard page BEFORE other scripts.
   
   What it does:
   1. Checks Supabase session — no session → /login
   2. Calls verify-session — no org → /signup?step=2
   3. Detects org state (closed, cancelled, returning user)
   4. Enforces plan-level page gating
   5. Exposes window.CF with user/org/plan data for other scripts

   Usage:
     <script src="/site/castford-auth.js"></script>
     <script>
       document.addEventListener('cf:ready', (e) => {
         const { user, org, plan, limits } = e.detail;
         // Dashboard code goes here
       });
     </script>
*/

(function() {
  'use strict';

  var SB_URL = 'https://crecesswagluelvkesul.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZWNlc3N3YWdsdWVsdmtlc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTI5NzYsImV4cCI6MjA4OTM4ODk3Nn0.IGEEYDStt-eH9Mf2G_DzqCPfruDjN8m_ORtAcmtSAZg';

  // Plan → allowed pages mapping
  var PLAN_PAGES = {
    demo:       ['dashboard', 'pnl', 'forecast', 'copilot', 'billing', 'notifications', 'import'],
    starter:    ['dashboard', 'pnl', 'forecast', 'budget', 'copilot', 'billing', 'notifications', 'alerts', 'reports', 'import'],
    growth:     ['dashboard', 'pnl', 'forecast', 'budget', 'cashflow', 'scenarios', 'copilot', 'billing', 'notifications', 'alerts', 'reports', 'import'],
    business:   ['dashboard', 'pnl', 'forecast', 'budget', 'cashflow', 'scenarios', 'xpa', 'consolidation', 'compliance', 'copilot', 'billing', 'notifications', 'alerts', 'reports', 'import'],
    enterprise: ['dashboard', 'pnl', 'forecast', 'budget', 'cashflow', 'scenarios', 'xpa', 'consolidation', 'compliance', 'copilot', 'billing', 'notifications', 'alerts', 'reports', 'import'],
  };

  // Detect current page from URL
  function detectPage() {
    var path = window.location.pathname;
    if (path.includes('cashflow')) return 'cashflow';
    if (path.includes('scenario')) return 'scenarios';
    if (path.includes('xpa') || path.includes('xp-a')) return 'xpa';
    if (path.includes('consolidat')) return 'consolidation';
    if (path.includes('compliance')) return 'compliance';
    if (path.includes('pnl') || path.includes('p-l')) return 'pnl';
    if (path.includes('forecast')) return 'forecast';
    if (path.includes('budget')) return 'budget';
    if (path.includes('copilot')) return 'copilot';
    if (path.includes('billing')) return 'billing';
    if (path.includes('notif')) return 'notifications';
    if (path.includes('alert')) return 'alerts';
    if (path.includes('report')) return 'reports';
    if (path.includes('import')) return 'import';
    return 'dashboard';
  }

  // Show upgrade gate overlay
  function showUpgradeGate(plan, requiredPlan) {
    var content = document.querySelector('.dash-content') || document.querySelector('main') || document.body;
    var overlay = document.createElement('div');
    overlay.id = 'cf-gate';
    overlay.innerHTML = '<div style="position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;flex-direction:column;background:rgba(255,255,255,0.85);backdrop-filter:blur(4px)">'
      + '<div style="text-align:center;max-width:400px;padding:24px">'
      + '<div style="font-size:18px;font-weight:800;color:var(--ink,#0f172a);margin-bottom:8px">Upgrade to unlock</div>'
      + '<div style="font-size:13px;color:var(--t2,#475569);margin-bottom:20px;line-height:1.6">This feature requires the ' + (requiredPlan || 'Growth') + ' plan. Your current plan is ' + plan + '.</div>'
      + '<a href="/pricing" style="display:inline-block;padding:10px 24px;background:var(--green,#10b981);color:#fff;font-size:14px;font-weight:700;text-decoration:none">View Plans</a>'
      + '</div></div>';
    document.body.appendChild(overlay);
  }

  // Show banner for returning cancelled users
  function showReactivationBanner(org) {
    var banner = document.createElement('div');
    banner.id = 'cf-reactivation';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:300;padding:10px 24px;background:var(--green,#10b981);color:#fff;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:12px';
    banner.innerHTML = 'Welcome back! Your data is still here. <a href="/pricing" style="color:#fff;text-decoration:underline;font-weight:700">Reactivate your plan</a>';
    document.body.appendChild(banner);
    document.body.style.paddingTop = '40px';
  }

  // Show banner for account scheduled for deletion
  function showDeletionBanner(closedAt) {
    var daysLeft = Math.max(0, Math.ceil((new Date(closedAt).getTime() + 30 * 86400000 - Date.now()) / 86400000));
    var banner = document.createElement('div');
    banner.id = 'cf-deletion';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:300;padding:10px 24px;background:#dc2626;color:#fff;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:12px';
    banner.innerHTML = 'Account deletion scheduled. ' + daysLeft + ' days remaining. <button onclick="undoDeletion()" style="background:#fff;color:#dc2626;border:none;padding:4px 12px;font-weight:700;font-size:12px;cursor:pointer">Undo deletion</button>';
    document.body.appendChild(banner);
    document.body.style.paddingTop = '40px';
  }

  // Show onboarding prompt for orgs without data
  function showOnboardingPrompt() {
    var banner = document.createElement('div');
    banner.id = 'cf-onboard-prompt';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:300;padding:10px 24px;background:var(--ink,#0f172a);color:#fff;font-size:13px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:12px';
    banner.innerHTML = 'You\'re viewing sample data. <a href="/site/import.html" style="color:var(--green,#10b981);font-weight:700;text-decoration:none">Upload your CSV</a> to see your real numbers.';
    document.body.appendChild(banner);
    document.body.style.paddingTop = '40px';
  }

  // Set the LIVE DATA / SAMPLE DATA badge
  function setDataBadge(isLive) {
    var badges = document.querySelectorAll('[data-badge="data-source"],.data-badge,.badge-data');
    badges.forEach(function(b) {
      b.textContent = isLive ? 'LIVE DATA' : 'SAMPLE DATA';
      b.style.background = isLive ? 'var(--green,#10b981)' : 'var(--t3,#94a3b8)';
      b.style.color = '#fff';
    });
  }

  // Main init
  async function init() {
    // Wait for Supabase to be available
    if (!window.supabase) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = function() { init(); };
      document.head.appendChild(script);
      return;
    }

    var sb = window.supabase.createClient(SB_URL, SB_KEY);

    // 1. Check session
    var sessionResult = await sb.auth.getSession();
    var session = sessionResult.data.session;
    if (!session) {
      window.location.href = '/login';
      return;
    }

    // 2. Verify session + get org data
    var verifyRes;
    try {
      verifyRes = await fetch(SB_URL + '/functions/v1/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.access_token }
      });
    } catch (err) {
      console.error('Auth middleware: verify-session failed', err);
      return;
    }

    if (!verifyRes.ok) {
      window.location.href = '/login';
      return;
    }

    var data = await verifyRes.json();

    // 3. No org → redirect to signup step 2
    if (!data.org_id && !data.organization) {
      window.location.href = '/site/signup.html?step=2';
      return;
    }

    var org = data.organization || { id: data.org_id, plan: data.plan || 'demo', name: data.org_name || '' };
    var plan = org.plan || 'demo';
    var user = data.user || { id: session.user.id, email: session.user.email };

    // 4. Check org closed state
    if (org.closed_at) {
      var closedMs = new Date(org.closed_at).getTime();
      var thirtyDays = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - closedMs > thirtyDays) {
        // Account permanently closed
        await sb.auth.signOut();
        window.location.href = '/login?error=account_closed';
        return;
      }
      showDeletionBanner(org.closed_at);
    }

    // 5. Check returning cancelled user
    if (plan === 'demo' && org.stripe_customer_id) {
      showReactivationBanner(org);
    }

    // 6. Plan gating
    var currentPage = detectPage();
    var allowedPages = PLAN_PAGES[plan] || PLAN_PAGES.demo;
    if (!allowedPages.includes(currentPage)) {
      var requiredPlan = 'Growth';
      if (['xpa', 'consolidation', 'compliance'].includes(currentPage)) requiredPlan = 'Business';
      showUpgradeGate(plan, requiredPlan);
    }

    // 7. Check onboarding status
    if (!org.onboarding_completed_at && !org.closed_at) {
      // Check if org has real GL data
      try {
        var glRes = await fetch(SB_URL + '/rest/v1/gl_transactions?org_id=eq.' + org.id + '&limit=1&select=id', {
          headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + session.access_token }
        });
        var glData = await glRes.json();
        if (!glData || glData.length === 0) {
          showOnboardingPrompt();
          setDataBadge(false);
        } else {
          setDataBadge(true);
        }
      } catch (err) {
        setDataBadge(false);
      }
    } else {
      setDataBadge(true);
    }

    // 8. Expose global context
    window.CF = {
      user: user,
      org: org,
      plan: plan,
      token: session.access_token,
      supabase: sb,
      SB_URL: SB_URL,
      isDemo: plan === 'demo',
      isPaid: ['starter', 'growth', 'business', 'enterprise'].includes(plan),
      isGrowth: ['growth', 'business', 'enterprise'].includes(plan),
      isBusiness: ['business', 'enterprise'].includes(plan),
      currentPage: currentPage,
      signOut: async function() {
        await sb.auth.signOut();
        window.location.href = '/login';
      }
    };

    // 9. Fire ready event
    document.dispatchEvent(new CustomEvent('cf:ready', { detail: window.CF }));
  }

  // Global undo deletion function
  window.undoDeletion = async function() {
    if (!window.CF) return;
    try {
      var r = await fetch(SB_URL + '/functions/v1/data-rights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + window.CF.token },
        body: JSON.stringify({ action: 'undo_closure' })
      });
      if (r.ok) {
        var banner = document.getElementById('cf-deletion');
        if (banner) banner.remove();
        document.body.style.paddingTop = '';
        alert('Account deletion cancelled. Your account is active again.');
      }
    } catch (err) { alert('Failed to undo. Please contact support.'); }
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
