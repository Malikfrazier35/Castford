'use client';

// app/settings/page.jsx — redirects /settings → /settings/team

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsIndex() {
  const router = useRouter();
  useEffect(() => { router.replace('/settings/team'); }, [router]);
  return <div style={{ padding: 40, color: '#94a3b8', fontSize: 13 }}>Loading…</div>;
}
