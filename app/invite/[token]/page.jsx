'use client';

// app/invite/[token]/page.jsx
//
// Invitation acceptance page. Multi-state UI:
//   - loading      → fetching invitation preview
//   - invalid      → invitation expired/revoked/not found
//   - need_signin  → user not authenticated, show Apple SSO / email magic link
//   - email_mismatch → user signed in with wrong email
//   - ready        → user authenticated with correct email, click Accept
//   - accepting    → POST org-accept-invite in flight
//   - success      → membership created, show Continue to Dashboard
//   - error        → unexpected failure

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { castfordApi, getSupabase, signInWithApple, signInWithEmail, signOut, setActiveOrgId } from '@/lib/castford-client';

export default function InvitePage() {
  const { token } = useParams();
  const router = useRouter();

  const [state, setState] = useState('loading');
  const [invitation, setInvitation] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [error, setError] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        // 1. Always fetch the invitation preview first (no auth needed)
        const preview = await castfordApi.org.previewInvite(token);
        setInvitation(preview.invitation);
        setStatusMessage(preview.status_message);

        if (preview.status !== 'valid') {
          setState('invalid');
          return;
        }

        // 2. Check whether user is signed in
        const sb = getSupabase();
        const { data: { session } } = await sb.auth.getSession();

        if (!session) {
          setEmailInput(preview.invitation.email);
          setState('need_signin');
          return;
        }

        setCurrentEmail(session.user.email);

        // 3. Check email match
        if (session.user.email.toLowerCase() !== preview.invitation.email.toLowerCase()) {
          setState('email_mismatch');
          return;
        }

        setState('ready');
      } catch (e) {
        setError(e.message);
        setState('error');
      }
    })();
  }, [token]);

  async function handleAccept() {
    setState('accepting');
    try {
      const result = await castfordApi.org.acceptInvite(token);
      if (result?.org_id) {
        setActiveOrgId(result.org_id);
      }
      setState('success');
    } catch (e) {
      setError(e.data?.error || e.message);
      setState('error');
    }
  }

  async function handleAppleSignIn() {
    try {
      await signInWithApple(window.location.href);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleMagicLink() {
    try {
      // Always send to invitation email (security)
      await signInWithEmail(invitation.email, window.location.href);
      setMagicLinkSent(true);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleSignOut() {
    await signOut();
    setState('need_signin');
    setCurrentEmail(null);
    setMagicLinkSent(false);
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <Header />
        <div style={S.body}>
          {state === 'loading' && <Loading />}
          {state === 'invalid' && <InvalidState message={statusMessage} />}
          {state === 'need_signin' && (
            <NeedSignIn
              invitation={invitation}
              email={emailInput}
              magicLinkSent={magicLinkSent}
              onApple={handleAppleSignIn}
              onMagicLink={handleMagicLink}
              error={error}
            />
          )}
          {state === 'email_mismatch' && (
            <EmailMismatch
              invitationEmail={invitation.email}
              currentEmail={currentEmail}
              onSignOut={handleSignOut}
            />
          )}
          {state === 'ready' && (
            <Ready invitation={invitation} currentEmail={currentEmail} onAccept={handleAccept} />
          )}
          {state === 'accepting' && <Accepting />}
          {state === 'success' && (
            <Success invitation={invitation} onContinue={() => router.push(`/${invitation.primary_role}`)} />
          )}
          {state === 'error' && <ErrorState error={error} onRetry={() => window.location.reload()} />}
        </div>
        <Footer />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────

function Header() {
  return (
    <div style={S.header}>
      <div style={S.brand}>Castford</div>
      <div style={S.tagline}>AI-native FP&amp;A</div>
    </div>
  );
}

function Footer() {
  return (
    <div style={S.footer}>
      <a href="https://castford.com" style={S.footerLink}>castford.com</a>
      <span style={S.dot}>·</span>
      <span>Need help? <a href="mailto:support@castford.com" style={S.footerLink}>support@castford.com</a></span>
    </div>
  );
}

function Loading() {
  return <div style={S.center}><div style={S.muted}>Loading invitation…</div></div>;
}

function InvalidState({ message }) {
  return (
    <div style={S.center}>
      <h2 style={S.h2}>Invitation unavailable</h2>
      <p style={S.p}>{message || 'This invitation cannot be used.'}</p>
      <a href="/" style={S.linkBtn}>Go to castford.com</a>
    </div>
  );
}

function NeedSignIn({ invitation, email, magicLinkSent, onApple, onMagicLink, error }) {
  if (magicLinkSent) {
    return (
      <div style={S.center}>
        <h2 style={S.h2}>Check your email</h2>
        <p style={S.p}>
          We sent a magic link to <strong>{invitation.email}</strong>.<br />
          Click it to sign in and complete your invitation.
        </p>
        <p style={S.muted}>You can close this tab. The link will bring you back here.</p>
      </div>
    );
  }
  return (
    <>
      <h2 style={S.h2}>You've been invited to {invitation.org_name}</h2>
      <InviteSummary invitation={invitation} />
      <p style={S.p}>Sign in to accept this invitation:</p>
      <button style={S.btnApple} onClick={onApple}>
        <span style={{ marginRight: 10 }}>􀣺</span> Continue with Apple
      </button>
      <div style={S.divider}><span style={S.dividerText}>or</span></div>
      <div style={{ marginBottom: 10, fontSize: 13, color: '#475569' }}>
        Send a magic link to <strong>{invitation.email}</strong>
      </div>
      <button style={S.btnSecondary} onClick={onMagicLink}>
        Send magic link to my email
      </button>
      {error && <div style={S.errorMsg}>{error}</div>}
      <p style={S.smallNote}>
        By accepting, you agree to Castford's <a href="/terms" style={S.footerLink}>Terms</a> and <a href="/privacy" style={S.footerLink}>Privacy Policy</a>.
      </p>
    </>
  );
}

function EmailMismatch({ invitationEmail, currentEmail, onSignOut }) {
  return (
    <>
      <h2 style={S.h2}>Wrong account</h2>
      <p style={S.p}>
        You're signed in as <strong>{currentEmail}</strong>, but this invitation was sent to <strong>{invitationEmail}</strong>.
      </p>
      <button style={S.btnSecondary} onClick={onSignOut}>Sign out and try again</button>
    </>
  );
}

function Ready({ invitation, currentEmail, onAccept }) {
  return (
    <>
      <h2 style={S.h2}>Join {invitation.org_name}</h2>
      <InviteSummary invitation={invitation} />
      <p style={S.muted}>Signed in as {currentEmail}</p>
      <button style={S.btnPrimary} onClick={onAccept}>Accept invitation →</button>
    </>
  );
}

function Accepting() {
  return <div style={S.center}><div style={S.muted}>Joining {`...`}</div></div>;
}

function Success({ invitation, onContinue }) {
  return (
    <>
      <h2 style={S.h2}>Welcome to {invitation.org_name}</h2>
      <p style={S.p}>You've joined as <strong>{roleLabel(invitation.primary_role)}</strong>. Your dashboard is ready.</p>
      <button style={S.btnPrimary} onClick={onContinue}>Continue to dashboard →</button>
    </>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div style={S.center}>
      <h2 style={S.h2}>Something went wrong</h2>
      <p style={S.p}>{error}</p>
      <button style={S.btnSecondary} onClick={onRetry}>Try again</button>
    </div>
  );
}

function InviteSummary({ invitation }) {
  return (
    <div style={S.summary}>
      {invitation.personal_note && (
        <div style={S.note}>
          <div style={S.noteLabel}>FROM {invitation.inviter_email || 'YOUR INVITER'}</div>
          <div style={S.noteBody}>"{invitation.personal_note}"</div>
        </div>
      )}
      <div style={S.summaryRow}><span style={S.summaryKey}>Dashboard</span><span style={S.summaryVal}>{roleLabel(invitation.primary_role)}</span></div>
      <div style={S.summaryRow}><span style={S.summaryKey}>Permission</span><span style={S.summaryVal}>{permLabel(invitation.permission_level)}</span></div>
      <div style={S.summaryRow}><span style={S.summaryKey}>Seat type</span><span style={S.summaryVal}>{seatLabel(invitation.seat_type)}</span></div>
      {invitation.expires_at && (
        <div style={S.summaryRow}><span style={S.summaryKey}>Expires</span><span style={S.summaryVal}>{new Date(invitation.expires_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
      )}
    </div>
  );
}

function roleLabel(r) { return ({ cfo:'CFO Hub', ceo:'Founder Dashboard', controller:'Controller', fpa:'FP&A', treasurer:'Treasurer', manager:'Manager Dashboard' })[r] || r; }
function permLabel(p) { return ({ owner:'Owner', admin:'Admin', member:'Member', viewer:'Viewer', external:'External Observer' })[p] || p; }
function seatLabel(s) { return ({ full:'Full seat', view_only:'View-only seat', external_observer:'External observer' })[s] || s; }

// ────────────────────────────────────────────────────────────────────────
// Styles (Castford brand: denim #5B7FCC + gold #C4884A)
// ────────────────────────────────────────────────────────────────────────

const S = {
  page: { minHeight: '100vh', background: '#F8F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Instrument Sans", "Segoe UI", sans-serif', color: '#1a2332' },
  card: { width: '100%', maxWidth: 520, background: '#ffffff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)' },
  header: { padding: '32px 40px', background: 'linear-gradient(135deg, #5B7FCC 0%, #4A6BB3 100%)', color: '#ffffff' },
  brand: { fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 28, letterSpacing: '-0.02em' },
  tagline: { color: 'rgba(255,255,255,0.78)', fontSize: 13, marginTop: 4 },
  body: { padding: '36px 40px 28px' },
  footer: { padding: '20px 40px', background: '#F8F9FC', borderTop: '1px solid #e2e8f0', fontSize: 12, color: '#94a3b8', textAlign: 'center' },
  footerLink: { color: '#5B7FCC', textDecoration: 'none' },
  dot: { margin: '0 8px', color: '#cbd5e1' },
  h2: { margin: '0 0 12px', fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 24, fontWeight: 400, lineHeight: 1.3, letterSpacing: '-0.01em' },
  p: { margin: '0 0 20px', fontSize: 15, lineHeight: 1.6, color: '#475569' },
  muted: { fontSize: 13, color: '#94a3b8', margin: '0 0 16px' },
  center: { textAlign: 'center', padding: '20px 0' },
  summary: { background: '#F8F9FC', borderRadius: 6, padding: '16px 18px', margin: '0 0 24px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: 14 },
  summaryKey: { color: '#94a3b8', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' },
  summaryVal: { color: '#1a2332', fontWeight: 500 },
  note: { background: '#ffffff', borderLeft: '3px solid #C4884A', padding: '12px 14px', marginBottom: 14, borderRadius: 4 },
  noteLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 4 },
  noteBody: { fontSize: 14, color: '#475569', fontStyle: 'italic', lineHeight: 1.5 },
  btnPrimary: { display: 'block', width: '100%', padding: '14px 20px', background: '#5B7FCC', color: '#ffffff', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.005em' },
  btnSecondary: { display: 'block', width: '100%', padding: '12px 20px', background: '#ffffff', color: '#1a2332', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  btnApple: { display: 'block', width: '100%', padding: '13px 20px', background: '#000000', color: '#ffffff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  linkBtn: { display: 'inline-block', padding: '10px 18px', background: '#5B7FCC', color: '#ffffff', textDecoration: 'none', borderRadius: 6, fontSize: 14, fontWeight: 500 },
  divider: { display: 'flex', alignItems: 'center', margin: '20px 0', color: '#cbd5e1' },
  dividerText: { padding: '0 12px', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' },
  errorMsg: { background: '#fef2f2', color: '#991b1b', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginTop: 14 },
  smallNote: { fontSize: 12, color: '#94a3b8', marginTop: 16, textAlign: 'center', lineHeight: 1.5 },
};

// Pseudo-element styling for divider line
if (typeof document !== 'undefined' && !document.getElementById('castford-invite-styles')) {
  const style = document.createElement('style');
  style.id = 'castford-invite-styles';
  style.textContent = `
    [data-divider]::before, [data-divider]::after {
      content: ''; flex: 1; height: 1px; background: #e2e8f0;
    }
  `;
  document.head.appendChild(style);
}
