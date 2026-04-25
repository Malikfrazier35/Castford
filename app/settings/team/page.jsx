'use client';

// app/settings/team/page.jsx
//
// Team management UI. Shows:
//   - Invite form (email + role + permission + seat type + personal note)
//   - Active members table (with edit/remove actions)
//   - Pending invitations table (with revoke action)
//   - Seat usage summary

import { useEffect, useState } from 'react';
import { castfordApi, getSupabase } from '@/lib/castford-client';

const ROLES = [
  { value: 'cfo', label: 'CFO Hub' },
  { value: 'ceo', label: 'Founder Dashboard' },
  { value: 'controller', label: 'Controller' },
  { value: 'fpa', label: 'FP&A' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'manager', label: 'Manager' },
];
const PERMS = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'external', label: 'External Observer' },
];
const SEATS = [
  { value: 'full', label: 'Full seat' },
  { value: 'view_only', label: 'View-only seat' },
  { value: 'external_observer', label: 'External observer' },
];

export default function TeamPage() {
  const [me, setMe] = useState(null);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [seatUsage, setSeatUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const meData = await castfordApi.me();
      setMe(meData);
      const activeOrg = meData.memberships?.find(m => m.is_active_org);
      if (!activeOrg) {
        setToast({ type: 'error', text: 'No active organization' });
        setLoading(false);
        return;
      }
      // Fetch members + invites + seat usage in parallel via direct Supabase queries
      const sb = getSupabase();
      const [membersRes, invitesRes] = await Promise.all([
        sb.from('org_members')
          .select('id, user_id, primary_role, secondary_dashboards, permission_level, seat_type, manager_scope, accepted_at, status, users:user_id(email, full_name)')
          .eq('org_id', activeOrg.org_id)
          .eq('status', 'active')
          .order('accepted_at', { ascending: true }),
        sb.from('org_invitations')
          .select('id, email, primary_role, permission_level, seat_type, expires_at, created_at, invited_by')
          .eq('org_id', activeOrg.org_id)
          .is('accepted_at', null)
          .is('declined_at', null)
          .is('revoked_at', null)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false }),
      ]);
      setMembers(membersRes.data || []);
      setInvites(invitesRes.data || []);
      // Compute seat usage from data
      const memData = membersRes.data || [];
      const invData = invitesRes.data || [];
      setSeatUsage({
        full: memData.filter(m => m.seat_type === 'full').length,
        view_only: memData.filter(m => m.seat_type === 'view_only').length,
        external: memData.filter(m => m.seat_type === 'external_observer').length,
        pending_full: invData.filter(i => i.seat_type === 'full').length,
        pending_view_only: invData.filter(i => i.seat_type === 'view_only').length,
        pending_external: invData.filter(i => i.seat_type === 'external_observer').length,
      });
    } catch (e) {
      setToast({ type: 'error', text: e.message });
    }
    setLoading(false);
  }

  async function handleInvite(formData) {
    try {
      const result = await castfordApi.org.invite(formData);
      setToast({
        type: 'success',
        text: `Invitation sent to ${formData.email}${result.email_sent ? '' : ' (email failed — link copied)'}`,
      });
      if (!result.email_sent && result.accept_url) {
        try { await navigator.clipboard.writeText(result.accept_url); } catch {}
      }
      setShowInviteForm(false);
      await loadAll();
    } catch (e) {
      const detail = e.data?.action === 'upgrade_tier_or_purchase_overage'
        ? `${e.data.error}. Current: ${e.data.current_full_seats || e.data.current_view_only_seats}/${e.data.tier_limit}.`
        : e.data?.error || e.message;
      setToast({ type: 'error', text: detail });
    }
  }

  async function handleRevoke(invitationId) {
    try {
      await castfordApi.org.revokeInvite(invitationId);
      setToast({ type: 'success', text: 'Invitation revoked' });
      await loadAll();
    } catch (e) {
      setToast({ type: 'error', text: e.data?.error || e.message });
    }
  }

  async function handleUpdateMember(membershipId, updates) {
    try {
      await castfordApi.org.updateMember(membershipId, updates);
      setToast({ type: 'success', text: 'Member updated' });
      setEditingMember(null);
      await loadAll();
    } catch (e) {
      setToast({ type: 'error', text: e.data?.error || e.message });
    }
  }

  async function handleRemoveMember(membershipId) {
    try {
      await castfordApi.org.removeMember(membershipId);
      setToast({ type: 'success', text: 'Member removed' });
      setConfirmRemove(null);
      await loadAll();
    } catch (e) {
      setToast({ type: 'error', text: e.data?.error || e.message });
    }
  }

  if (loading) return <div style={S.loading}>Loading team data…</div>;

  const activeOrg = me?.memberships?.find(m => m.is_active_org);
  const tierLimits = activeOrg?.tier_limits;
  const canManage = me?.permissions?.can_manage_members;

  return (
    <div>
      {toast && (
        <div style={{ ...S.toast, ...(toast.type === 'error' ? S.toastError : S.toastSuccess) }} onClick={() => setToast(null)}>
          {toast.text}
        </div>
      )}

      <div style={S.header}>
        <div>
          <h1 style={S.h1}>Team</h1>
          <p style={S.subtitle}>{activeOrg?.org_name} · {activeOrg?.tier} plan</p>
        </div>
        {canManage && (
          <button style={S.btnPrimary} onClick={() => setShowInviteForm(true)}>+ Invite teammate</button>
        )}
      </div>

      {seatUsage && tierLimits && <SeatUsage usage={seatUsage} limits={tierLimits} />}

      {showInviteForm && (
        <InviteForm
          tierDashboards={tierLimits?.dashboards || []}
          onSubmit={handleInvite}
          onCancel={() => setShowInviteForm(false)}
        />
      )}

      <Section title={`Active members (${members.length})`}>
        <MembersTable
          members={members}
          currentUserId={me?.user?.id}
          canManage={canManage}
          onEdit={canManage ? setEditingMember : null}
          onRemove={canManage ? setConfirmRemove : null}
        />
      </Section>

      {invites.length > 0 && (
        <Section title={`Pending invitations (${invites.length})`}>
          <InvitesTable invites={invites} canManage={canManage} onRevoke={handleRevoke} />
        </Section>
      )}

      {editingMember && (
        <EditMemberModal
          member={editingMember}
          tierDashboards={tierLimits?.dashboards || []}
          onSave={(updates) => handleUpdateMember(editingMember.id, updates)}
          onCancel={() => setEditingMember(null)}
        />
      )}

      {confirmRemove && (
        <ConfirmModal
          title="Remove member?"
          message={`${confirmRemove.users?.email || 'This member'} will lose access immediately. They can be re-invited later.`}
          confirmLabel="Remove"
          danger
          onConfirm={() => handleRemoveMember(confirmRemove.id)}
          onCancel={() => setConfirmRemove(null)}
        />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────

function SeatUsage({ usage, limits }) {
  const rows = [
    { key: 'Full seats', used: usage.full + usage.pending_full, limit: limits.full_seats, breakdown: usage.pending_full > 0 ? `${usage.full} active, ${usage.pending_full} pending` : null },
    { key: 'View-only seats', used: usage.view_only + usage.pending_view_only, limit: limits.viewer_seats, breakdown: usage.pending_view_only > 0 ? `${usage.view_only} active, ${usage.pending_view_only} pending` : null },
    { key: 'External observers', used: usage.external + usage.pending_external, limit: limits.external_seats, breakdown: usage.pending_external > 0 ? `${usage.external} active, ${usage.pending_external} pending` : null },
  ];
  return (
    <div style={S.seatGrid}>
      {rows.map(r => {
        const pct = Math.min(100, (r.used / r.limit) * 100);
        const danger = pct >= 90;
        return (
          <div key={r.key} style={S.seatCard}>
            <div style={S.seatLabel}>{r.key}</div>
            <div style={S.seatNum}>{r.used}<span style={S.seatNumLight}> / {r.limit === 9999 ? '∞' : r.limit}</span></div>
            <div style={S.seatBar}><div style={{ ...S.seatBarFill, width: `${pct}%`, background: danger ? '#dc2626' : '#5B7FCC' }} /></div>
            {r.breakdown && <div style={S.seatBreak}>{r.breakdown}</div>}
          </div>
        );
      })}
    </div>
  );
}

function InviteForm({ tierDashboards, onSubmit, onCancel }) {
  const [email, setEmail] = useState('');
  const [primary_role, setPrimaryRole] = useState(tierDashboards[0] || 'controller');
  const [permission_level, setPermissionLevel] = useState('member');
  const [seat_type, setSeatType] = useState('full');
  const [personal_note, setPersonalNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const availableRoles = ROLES.filter(r => tierDashboards.includes(r.value));

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({ email: email.trim(), primary_role, permission_level, seat_type, personal_note: personal_note.trim() || undefined });
    setSubmitting(false);
  }

  return (
    <form onSubmit={submit} style={S.inviteForm}>
      <div style={S.formTitle}>Invite a teammate</div>
      <div style={S.formGrid}>
        <Field label="Email">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" style={S.input} />
        </Field>
        <Field label="Dashboard">
          <select value={primary_role} onChange={e => setPrimaryRole(e.target.value)} style={S.input}>
            {availableRoles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </Field>
        <Field label="Permission">
          <select value={permission_level} onChange={e => setPermissionLevel(e.target.value)} style={S.input}>
            {PERMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="Seat type">
          <select value={seat_type} onChange={e => setSeatType(e.target.value)} style={S.input}>
            {SEATS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Personal note (optional)">
        <textarea value={personal_note} onChange={e => setPersonalNote(e.target.value)} maxLength={500} rows={2} placeholder="Looking forward to working with you on the Q3 close…" style={{ ...S.input, resize: 'vertical', minHeight: 60 }} />
      </Field>
      <div style={S.formActions}>
        <button type="button" onClick={onCancel} style={S.btnSecondary}>Cancel</button>
        <button type="submit" disabled={submitting || !email} style={{ ...S.btnPrimary, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Sending…' : 'Send invitation'}
        </button>
      </div>
    </form>
  );
}

function MembersTable({ members, currentUserId, canManage, onEdit, onRemove }) {
  if (members.length === 0) return <div style={S.empty}>No active members yet.</div>;
  return (
    <table style={S.table}>
      <thead><tr style={S.tr}>
        <th style={S.th}>Email</th>
        <th style={S.th}>Role</th>
        <th style={S.th}>Permission</th>
        <th style={S.th}>Seat</th>
        <th style={S.th}>Joined</th>
        {canManage && <th style={S.th} />}
      </tr></thead>
      <tbody>
        {members.map(m => {
          const isMe = m.user_id === currentUserId;
          return (
            <tr key={m.id} style={S.tr}>
              <td style={S.td}>{m.users?.email || '—'} {isMe && <span style={S.badge}>You</span>}</td>
              <td style={S.td}>{ROLES.find(r => r.value === m.primary_role)?.label || m.primary_role}</td>
              <td style={S.td}><PermissionPill level={m.permission_level} /></td>
              <td style={S.td}>{SEATS.find(s => s.value === m.seat_type)?.label || m.seat_type}</td>
              <td style={S.td}>{m.accepted_at ? new Date(m.accepted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
              {canManage && (
                <td style={{ ...S.td, textAlign: 'right' }}>
                  {!isMe && (
                    <>
                      <button style={S.btnLink} onClick={() => onEdit?.(m)}>Edit</button>
                      <button style={{ ...S.btnLink, color: '#dc2626' }} onClick={() => onRemove?.(m)}>Remove</button>
                    </>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function InvitesTable({ invites, canManage, onRevoke }) {
  return (
    <table style={S.table}>
      <thead><tr style={S.tr}>
        <th style={S.th}>Email</th>
        <th style={S.th}>Role</th>
        <th style={S.th}>Permission</th>
        <th style={S.th}>Sent</th>
        <th style={S.th}>Expires</th>
        {canManage && <th style={S.th} />}
      </tr></thead>
      <tbody>
        {invites.map(i => (
          <tr key={i.id} style={S.tr}>
            <td style={S.td}>{i.email}</td>
            <td style={S.td}>{ROLES.find(r => r.value === i.primary_role)?.label || i.primary_role}</td>
            <td style={S.td}><PermissionPill level={i.permission_level} /></td>
            <td style={S.td}>{new Date(i.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
            <td style={S.td}>{new Date(i.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
            {canManage && (
              <td style={{ ...S.td, textAlign: 'right' }}>
                <button style={{ ...S.btnLink, color: '#dc2626' }} onClick={() => onRevoke(i.id)}>Revoke</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EditMemberModal({ member, tierDashboards, onSave, onCancel }) {
  const [primary_role, setPrimaryRole] = useState(member.primary_role);
  const [permission_level, setPermissionLevel] = useState(member.permission_level);
  const [seat_type, setSeatType] = useState(member.seat_type);
  const availableRoles = ROLES.filter(r => tierDashboards.includes(r.value));
  return (
    <Modal title={`Edit ${member.users?.email || 'member'}`} onCancel={onCancel}>
      <Field label="Dashboard">
        <select value={primary_role} onChange={e => setPrimaryRole(e.target.value)} style={S.input}>
          {availableRoles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </Field>
      <Field label="Permission">
        <select value={permission_level} onChange={e => setPermissionLevel(e.target.value)} style={S.input}>
          {PERMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          <option value="owner">Owner (irreversible without another owner)</option>
        </select>
      </Field>
      <Field label="Seat type">
        <select value={seat_type} onChange={e => setSeatType(e.target.value)} style={S.input}>
          {SEATS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </Field>
      <div style={S.formActions}>
        <button onClick={onCancel} style={S.btnSecondary}>Cancel</button>
        <button onClick={() => onSave({ primary_role, permission_level, seat_type })} style={S.btnPrimary}>Save changes</button>
      </div>
    </Modal>
  );
}

function ConfirmModal({ title, message, confirmLabel, danger, onConfirm, onCancel }) {
  return (
    <Modal title={title} onCancel={onCancel}>
      <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 24px' }}>{message}</p>
      <div style={S.formActions}>
        <button onClick={onCancel} style={S.btnSecondary}>Cancel</button>
        <button onClick={onConfirm} style={{ ...S.btnPrimary, background: danger ? '#dc2626' : '#5B7FCC' }}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}

function Modal({ title, children, onCancel }) {
  return (
    <div style={S.modalBackdrop} onClick={onCancel}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalHeader}>{title}</div>
        <div style={S.modalBody}>{children}</div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={S.section}>
      <div style={S.sectionTitle}>{title}</div>
      <div style={S.sectionBody}>{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={S.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

function PermissionPill({ level }) {
  const colors = {
    owner: { bg: '#fef3c7', fg: '#92400e' },
    admin: { bg: '#dbeafe', fg: '#1e40af' },
    member: { bg: '#F8F9FC', fg: '#475569' },
    viewer: { bg: '#f1f5f9', fg: '#64748b' },
    external: { bg: '#fef2f2', fg: '#991b1b' },
  };
  const c = colors[level] || colors.member;
  return <span style={{ ...S.pill, background: c.bg, color: c.fg }}>{level}</span>;
}

// ────────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────────

const S = {
  loading: { padding: 40, color: '#94a3b8', fontSize: 13 },
  header: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 },
  h1: { margin: 0, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 32, fontWeight: 400, letterSpacing: '-0.02em' },
  subtitle: { margin: '4px 0 0', fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' },
  toast: { padding: '10px 16px', borderRadius: 6, fontSize: 13, marginBottom: 20, cursor: 'pointer' },
  toastSuccess: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
  toastError: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
  seatGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 },
  seatCard: { padding: '16px 18px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6 },
  seatLabel: { fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  seatNum: { fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 28, color: '#1a2332', fontWeight: 400, lineHeight: 1 },
  seatNumLight: { color: '#cbd5e1', fontSize: 18 },
  seatBar: { height: 4, background: '#F8F9FC', borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  seatBarFill: { height: '100%', borderRadius: 2, transition: 'width 0.3s' },
  seatBreak: { fontSize: 11, color: '#94a3b8', marginTop: 6 },
  inviteForm: { padding: 24, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 28 },
  formTitle: { fontSize: 14, fontWeight: 600, color: '#1a2332', marginBottom: 16 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  fieldLabel: { display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 },
  input: { display: 'block', width: '100%', padding: '8px 10px', fontSize: 14, color: '#1a2332', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, fontFamily: 'inherit', boxSizing: 'border-box' },
  formActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
  btnPrimary: { padding: '10px 20px', background: '#5B7FCC', color: '#ffffff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnSecondary: { padding: '10px 20px', background: '#ffffff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  btnLink: { padding: '4px 8px', background: 'transparent', color: '#5B7FCC', border: 'none', fontSize: 13, cursor: 'pointer', marginLeft: 8 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 },
  sectionBody: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#F8F9FC' },
  td: { padding: '12px 16px', fontSize: 14, color: '#1a2332' },
  badge: { display: 'inline-block', padding: '1px 6px', background: '#F8F9FC', color: '#94a3b8', fontSize: 10, fontWeight: 600, borderRadius: 3, marginLeft: 8, textTransform: 'uppercase', letterSpacing: '0.06em' },
  pill: { display: 'inline-block', padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  empty: { padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13 },
  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { width: '100%', maxWidth: 480, background: '#ffffff', borderRadius: 8, overflow: 'hidden' },
  modalHeader: { padding: '18px 24px', fontSize: 15, fontWeight: 600, color: '#1a2332', borderBottom: '1px solid #e2e8f0' },
  modalBody: { padding: 24 },
};
