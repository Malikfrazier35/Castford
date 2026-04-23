'use client';

// app/settings/layout.jsx
//
// Settings shell with left sidebar navigation. Wraps all /settings/* pages.

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { castfordApi } from '@/lib/castford-client';

const NAV_ITEMS = [
  { href: '/settings/team', label: 'Team' },
  { href: '/settings/billing', label: 'Billing & Seats' },
  // Coming soon — placeholders so the structure is visible:
  // { href: '/settings/profile', label: 'Profile' },
  // { href: '/settings/integrations', label: 'Integrations' },
  // { href: '/settings/api-keys', label: 'API Keys' },
];

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  const [orgName, setOrgName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const me = await castfordApi.me();
        const active = me.memberships?.find(m => m.is_active_org);
        if (active) setOrgName(active.org_name || '');
      } catch {}
    })();
  }, []);

  return (
    <div style={S.page}>
      <header style={S.topbar}>
        <Link href="/" style={S.brand}>Castford</Link>
        <div style={S.orgPill}>{orgName || 'Loading…'}</div>
      </header>
      <div style={S.shell}>
        <nav style={S.sidebar}>
          <div style={S.sectionLabel}>SETTINGS</div>
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ ...S.navLink, ...(active ? S.navLinkActive : {}) }}
              >
                {item.label}
              </Link>
            );
          })}
          <div style={S.sectionLabel}>NAVIGATE</div>
          <Link href="/cfo" style={S.navLink}>Back to dashboard</Link>
        </nav>
        <main style={S.content}>{children}</main>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#F8F9FC', fontFamily: '-apple-system, BlinkMacSystemFont, "Instrument Sans", sans-serif', color: '#1a2332' },
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' },
  brand: { fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 22, color: '#1a2332', textDecoration: 'none', letterSpacing: '-0.01em' },
  orgPill: { fontSize: 13, padding: '6px 12px', background: '#F8F9FC', borderRadius: 4, color: '#475569', fontWeight: 500 },
  shell: { display: 'grid', gridTemplateColumns: '240px 1fr', maxWidth: 1280, margin: '0 auto', minHeight: 'calc(100vh - 60px)' },
  sidebar: { padding: '32px 16px 32px 28px', borderRight: '1px solid #e2e8f0', background: '#ffffff' },
  sectionLabel: { fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '20px 12px 8px' },
  navLink: { display: 'block', padding: '8px 12px', fontSize: 14, color: '#475569', textDecoration: 'none', borderRadius: 4, marginBottom: 2 },
  navLinkActive: { background: '#F8F9FC', color: '#5B7FCC', fontWeight: 600 },
  content: { padding: '32px 40px' },
};
