'use client';

// app/settings/billing/page.jsx
//
// Read-only billing view: tier, plan price, seat usage, dashboards included.
// Stripe upgrade flow ships in Session 5.

import { useEffect, useState } from 'react';
import { castfordApi } from '@/lib/castford-client';

const TIER_PRICING = {
  starter: { name: 'Starter', monthly: 599, annual: 499 },
  growth: { name: 'Growth', monthly: 1799, annual: 1499 },
  business: { name: 'Business', monthly: 4799, annual: 3999 },
  enterprise: { name: 'Enterprise', monthly: null, annual: null },
};

const ROLE_LABELS = {
  cfo: 'CFO Hub', ceo: 'Founder Dashboard', controller: 'Controller',
  fpa: 'FP&A', treasurer: 'Treasurer', manager: 'Manager Dashboard',
  multi_entity: 'Multi-entity Consolidation',
};

export default function BillingPage() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await castfordApi.me();
        setMe(data);
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.loading}>Loading billing…</div>;

  const active = me?.memberships?.find(m => m.is_active_org);
  if (!active) return <div style={S.loading}>No active organization</div>;

  const tier = active.tier;
  const limits = active.tier_limits;
  const pricing = TIER_PRICING[tier];

  return (
    <div>
      <div style={S.header}>
        <h1 style={S.h1}>Billing &amp; Seats</h1>
        <p style={S.subtitle}>{active.org_name}</p>
      </div>

      <div style={S.planCard}>
        <div style={S.planLeft}>
          <div style={S.planLabel}>CURRENT PLAN</div>
          <div style={S.planName}>{pricing?.name || tier}</div>
          {pricing?.monthly && (
            <div style={S.planPrice}>
              <span style={S.planPriceBig}>${pricing.monthly.toLocaleString()}</span>
              <span style={S.planPriceUnit}>/month</span>
            </div>
          )}
          {pricing?.annual && (
            <div style={S.planAnnual}>or ${pricing.annual.toLocaleString()}/mo billed annually</div>
          )}
        </div>
        <div style={S.planRight}>
          <button style={S.btnUpgrade} disabled>
            {tier === 'enterprise' ? 'Custom plan' : 'Upgrade plan (coming soon)'}
          </button>
        </div>
      </div>

      <div style={S.sectionTitle}>SEAT LIMITS</div>
      <div style={S.seatGrid}>
        <SeatRow label="Full seats" limit={limits.full_seats} note="Members who can edit data, run reports, and use AI" />
        <SeatRow label="View-only seats" limit={limits.viewer_seats} note="$25/seat/mo overage" />
        <SeatRow label="External observers" limit={limits.external_seats} note="Time-bounded access for board/auditors/fractional CFOs" />
        <SeatRow label="AI queries" limit={limits.ai_queries} note="Per month" />
      </div>

      <div style={S.sectionTitle}>DASHBOARDS INCLUDED</div>
      <div style={S.dashList}>
        {limits.dashboards.map(d => (
          <div key={d} style={S.dashItem}>
            <span style={S.dashCheck}>✓</span>
            {ROLE_LABELS[d] || d}
          </div>
        ))}
      </div>

      <div style={S.notice}>
        <div style={S.noticeTitle}>Self-serve plan changes coming soon</div>
        <div style={S.noticeBody}>
          To change your plan or purchase seat overages, email <a href="mailto:billing@castford.com" style={S.link}>billing@castford.com</a>.
          Stripe-powered self-serve upgrades ship in our next release.
        </div>
      </div>
    </div>
  );
}

function SeatRow({ label, limit, note }) {
  const display = limit === 9999 ? 'Unlimited' : limit.toLocaleString();
  return (
    <div style={S.seatCard}>
      <div style={S.seatLabel}>{label}</div>
      <div style={S.seatNum}>{display}</div>
      <div style={S.seatNote}>{note}</div>
    </div>
  );
}

const S = {
  loading: { padding: 40, color: '#94a3b8', fontSize: 13 },
  header: { marginBottom: 28 },
  h1: { margin: 0, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 32, fontWeight: 400, letterSpacing: '-0.02em' },
  subtitle: { margin: '4px 0 0', fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' },
  planCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', background: 'linear-gradient(135deg, #ffffff 0%, #F8F9FC 100%)', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 32 },
  planLeft: {},
  planLabel: { fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 },
  planName: { fontSize: 22, fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a2332', marginBottom: 8 },
  planPrice: { display: 'flex', alignItems: 'baseline', gap: 4 },
  planPriceBig: { fontSize: 28, fontWeight: 600, color: '#1a2332' },
  planPriceUnit: { fontSize: 14, color: '#94a3b8' },
  planAnnual: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  planRight: {},
  btnUpgrade: { padding: '10px 20px', background: '#5B7FCC', color: '#ffffff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 },
  sectionTitle: { fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  seatGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 },
  seatCard: { padding: '16px 18px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6 },
  seatLabel: { fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 },
  seatNum: { fontSize: 22, fontFamily: '"Instrument Serif", Georgia, serif', color: '#1a2332' },
  seatNote: { fontSize: 11, color: '#94a3b8', marginTop: 6 },
  dashList: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 32 },
  dashItem: { padding: '8px 14px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 13, color: '#1a2332' },
  dashCheck: { color: '#5B7FCC', fontWeight: 700, marginRight: 8 },
  notice: { padding: '16px 20px', background: '#fef3c7', borderLeft: '3px solid #C4884A', borderRadius: 4 },
  noticeTitle: { fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 4 },
  noticeBody: { fontSize: 13, color: '#78350f', lineHeight: 1.5 },
  link: { color: '#5B7FCC', textDecoration: 'none' },
};
