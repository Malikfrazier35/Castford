'use client';

import { useEffect, useRef } from 'react';

export default function V3TemplatesGalleryOriginalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `// ═══ TEMPLATE DATA ═══
const templates = {
exec: {
name: 'Executive Command Center',
desc: 'Full C-suite dashboard with KPI grid, revenue trending, P&L waterfall, and real-time consolidation. The default starting point for most teams.',
tier: 'starter', tierLabel: 'All Plans',
modules: ['KPI Grid','P&L Waterfall','Revenue Trending','Budget vs Actual','AI Copilot','Multi-Entity','Scenario Engine','Export to PDF'],
price: 'Included', period: 'in all plans',
color: '#5b9cf5'
},
glass: {
name: 'CFO Glass Dashboard',
desc: 'Glassmorphism design with frosted panels, sidebar nav, and a clean layout optimized for board presentations and investor updates.',
tier: 'growth', tierLabel: 'Growth+',
modules: ['Board View','ARR Tracking','NRR Analysis','Runway Gauge','Investor Deck','AI Copilot','Cash Forecast','Cohort Charts'],
price: 'Included', period: 'in your Growth plan',
color: '#a78bfa'
},
treasury: {
name: 'Treasury & Cash Flow',
desc: 'Real-time cash position, 13-week rolling forecast, bank account monitoring, DSO/DPO tracking, and liquidity ratio gauges.',
tier: 'growth', tierLabel: 'Growth+',
modules: ['Cash Position','13-Week Forecast','Bank Feeds','DSO/DPO','Liquidity Ratios','AR Aging','AP Aging','FX Exposure'],
price: 'Included', period: 'in your Growth plan',
color: '#22d3ee'
},
multi: {
name: 'Multi-Entity Consolidation',
desc: 'Entity-switching tabs, intercompany eliminations, currency translation, and consolidated P&L/BS with drill-down by region.',
tier: 'business', tierLabel: 'Business+',
modules: ['Entity Tabs','IC Eliminations','FX Translation','Consolidated P&L','Consolidated BS','Drill-Down','Audit Trail','Board Export'],
price: '$3,999', period: '/mo — Business plan required',
color: '#fbbf24'
},
startup: {
name: 'Startup Metrics Dashboard',
desc: 'MRR/ARR, burn rate, runway, CAC/LTV, churn analysis, and cohort retention. Built for Series A-C finance teams.',
tier: 'starter', tierLabel: 'All Plans',
modules: ['MRR/ARR','Burn Rate','Runway','CAC/LTV','Churn','Cohort Retention','Unit Economics','Investor View'],
price: 'Included', period: 'in all plans',
color: '#34d399'
},
pe: {
name: 'PE / VC Portfolio View',
desc: 'Fund-level AUM, MOIC, IRR, DPI tracking across portfolio companies. Vintage year analysis, capital calls, and LP reporting.',
tier: 'business', tierLabel: 'Business+',
modules: ['AUM Dashboard','MOIC/IRR','DPI/TVPI','Vintage Year','Capital Calls','LP Reports','Portfolio Roll-Up','Benchmark'],
price: '$3,999', period: '/mo — Business plan required',
color: '#f472b6'
},
custom: {
name: 'Architect Command Center',
desc: 'A dedicated Finance Architect builds your fully branded, bespoke command center over a 6-month engagement. Every KPI, workflow, and integration is custom-designed around your business. Pricing is scoped per client — based on entity count, data complexity, and integration depth.',
tier: 'enterprise', tierLabel: 'Enterprise · Waitlist',
modules: ['Everything in Business','Dedicated Finance Architect','6-Month Build Engagement','Custom Branding & White Label','Bespoke KPI Architecture','Custom Integrations (ERP/GL/Bank)','SOX Audit Trail','Weekly Iteration Cycles','On-Prem or Cloud Deploy','Branded Login & Domain','Priority SLA (99.99%)','Committed Spend Discounts'],
price: 'Contact Sales', period: ' · Scoped per client',
color: '#a78bfa'
}
};

// ═══ MODAL ═══
let currentTemplateId = null;
function openModal(id) {
const t = templates[id];
if(!t) return;
currentTemplateId = id;
document.getElementById('modalTitle').textContent = t.name;
document.getElementById('modalSubtitle').textContent = t.desc;
document.getElementById('deployPrice').textContent = t.price;
document.getElementById('deployPeriod').textContent = t.period;

const modContainer = document.getElementById('modalModules');
modContainer.innerHTML = t.modules.map(m =>
\`<span style="padding:6px 14px;border-radius:10px;font-size:12px;font-weight:500;background:rgba(91,156,245,.06);border:1px solid rgba(91,156,245,.1);color:var(--text)">\${m}</span>\`
).join('');

// Set preview background based on template
const preview = document.getElementById('modalPreview');
const card = document.querySelector(\`.tpl-card[onclick="openModal('\${id}')"] .dash-preview\`);
if(card) {
preview.innerHTML = '';
const clone = card.cloneNode(true);
clone.style.height = '100%';
preview.appendChild(clone);
} else {
preview.style.background = \`linear-gradient(135deg, \${t.color}11, \${t.color}22)\`;
preview.innerHTML = \`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:18px;font-weight:700;color:\${t.color}">\${t.name}</div>\`;
}

// Update deploy button based on tier
const btn = document.getElementById('deployBtn');
const priceEl = document.getElementById('deployPrice');
const periodEl = document.getElementById('deployPeriod');
if(t.tier === 'enterprise') {
btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> Schedule Discovery Call';
btn.style.background = 'linear-gradient(135deg,var(--purple),var(--pink))';
if(priceEl) priceEl.textContent = 'Architect Engagement';
if(periodEl) periodEl.textContent = 'Scoped after discovery call';
} else {
btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Request Private Access';
btn.style.background = 'linear-gradient(135deg,var(--accent),var(--purple))';
if(priceEl) priceEl.textContent = 'By invitation only';
if(periodEl) periodEl.textContent = 'Private install link sent after review';
}

document.getElementById('modalBackdrop').classList.add('active');
document.body.style.overflow = 'hidden';
}

function closeModal() {
document.getElementById('modalBackdrop').classList.remove('active');
document.body.style.overflow = '';
}

// ═══ FILTERS ═══
function filterBy(cat, el) {
document.querySelectorAll('.filter-group:first-of-type .filter-chip').forEach(c => c.classList.remove('active'));
el.classList.add('active');
document.querySelectorAll('#templateGrid .tpl-card').forEach(card => {
if(cat === 'all' || card.dataset.cat === cat) {
card.style.display = '';
} else {
card.style.display = 'none';
}
});
}

function filterTier(tier, el) {
el.classList.toggle('active');
// Simple tier filter — just highlight, real impl would filter
}

function searchTemplates(q) {
const query = q.toLowerCase();
document.querySelectorAll('#templateGrid .tpl-card').forEach(card => {
const text = card.textContent.toLowerCase();
card.style.display = text.includes(query) ? '' : 'none';
});
}

function selectColor(el) {
document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
el.classList.add('selected');
}

function toggleTierSelector() {
// Cycle through tiers for demo
const badge = document.getElementById('currentTier');
const tiers = ['starter','growth','business','enterprise'];
const labels = ['Starter Plan','Growth Plan','Business Plan','Enterprise Plan'];
const current = tiers.indexOf(badge.className.replace('tier-badge ',''));
const next = (current + 1) % tiers.length;
badge.className = 'tier-badge ' + tiers[next];
badge.textContent = labels[next];
}

// Show more grid toggle
document.querySelector('.cat-link[onclick]')?.addEventListener('click', function() {
const grid = document.getElementById('moreGrid');
if(grid.style.display === 'none') {
grid.style.display = 'grid';
this.innerHTML = 'Show less <svg viewBox="0 0 24 24" width="14" height="14" stroke="var(--accent)" fill="none" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>';
} else {
grid.style.display = 'none';
this.innerHTML = 'Show all <svg viewBox="0 0 24 24" width="14" height="14" stroke="var(--accent)" fill="none" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
}
});

// Keyboard close
document.addEventListener('keydown', e => { if(e.key === 'Escape'){ closeModal(); closeInstall(); }});

// ═══ CONSULTATION / REQUEST ACCESS FLOW ═══
let consultRunning = false;

function startInstall(templateId) {
  const t = templates[templateId];
  if(!t) return;

  const tierOrder = ['starter','growth','business','enterprise'];
  const userTier = 1; // growth
  const requiredTier = tierOrder.indexOf(t.tier);
  const pipeline = document.getElementById('installPipeline');
  const panel = document.getElementById('installPanel');

  // ── TIER-LOCKED: Show upgrade + consultation ──
  if(requiredTier > userTier && t.tier !== 'enterprise') {
    pipeline.classList.add('active');
    panel.innerHTML = \`
      <div style="padding:20px 0">
        <div style="width:64px;height:64px;border-radius:50%;background:rgba(251,191,36,.08);border:2px solid var(--amber);display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>
        <h2 style="font-size:20px;font-weight:800;margin-bottom:8px">\${t.tierLabel} Required</h2>
        <p style="font-size:13px;color:var(--dim);margin-bottom:8px">"\${t.name}" is available on the \${tierOrder[requiredTier].charAt(0).toUpperCase()+tierOrder[requiredTier].slice(1)} plan. Request a consultation to discuss upgrade options and get a private install link.</p>
        <div class="intake-note" style="margin-top:16px;text-align:center"><strong>Limited availability.</strong> We review each request individually and respond within 24 hours with a private dashboard link.</div>
        <div style="display:flex;gap:12px;justify-content:center;margin-top:20px">
          <button class="btn btn-ghost" onclick="closeInstall()">Maybe Later</button>
          <button class="btn btn-primary" style="background:linear-gradient(135deg,var(--amber),var(--pink))" onclick="showConsultForm('\${templateId}','upgrade')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Request Consultation
          </button>
        </div>
      </div>\`;
    return;
  }

  // ── ENTERPRISE: Architect waitlist ──
  if(t.tier === 'enterprise') {
    pipeline.classList.add('active');
    panel.innerHTML = \`
      <div style="padding:20px 0">
        <div style="width:64px;height:64px;border-radius:50%;background:rgba(167,139,250,.08);border:2px solid var(--purple);display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <h2 style="font-size:20px;font-weight:800;margin-bottom:8px">Architect Engagement</h2>
        <p style="font-size:13px;color:var(--dim);margin-bottom:6px">This is a white-glove, 6-month engagement. Your Finance Architect will scope, design, and deploy a fully custom Command Center after an initial consultation.</p>
        <div class="intake-note" style="margin-top:12px;text-align:center"><strong>Q2 2026 cohort:</strong> 3 of 10 spots remaining. Pricing scoped per client after discovery call.</div>
        <div style="display:flex;gap:12px;justify-content:center;margin-top:20px">
          <button class="btn btn-ghost" onclick="closeInstall()">Not Now</button>
          <button class="btn btn-primary" style="background:linear-gradient(135deg,var(--purple),var(--pink))" onclick="showConsultForm('\${templateId}','architect')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Schedule Discovery Call
          </button>
        </div>
      </div>\`;
    return;
  }

  // ── STANDARD TEMPLATES: Consultation intake form ──
  closeModal();
  showConsultForm(templateId, 'standard');
}

function showConsultForm(templateId, flowType) {
  const t = templates[templateId];
  if(!t) return;

  const pipeline = document.getElementById('installPipeline');
  const panel = document.getElementById('installPanel');

  const isArchitect = flowType === 'architect';
  const isUpgrade = flowType === 'upgrade';

  const headerText = isArchitect ? 'Architect Discovery' : isUpgrade ? 'Upgrade Consultation' : \`Request Access — \${t.name}\`;
  const subText = isArchitect
    ? 'Tell us about your organization so we can scope your custom build.'
    : 'We review each request and send a private install link within 24 hours.';
  const noteText = isArchitect
    ? '<strong>What happens next:</strong> Our team reviews your submission, then schedules a 30-minute discovery call to scope your build, timeline, and pricing.'
    : '<strong>What happens next:</strong> We review your request, verify your account, and email you a private, one-time install link for this dashboard. Typical turnaround: under 24 hours.';

  panel.innerHTML = \`
    <h2>\${headerText}</h2>
    <div class="install-sub">\${subText}</div>

    <div class="intake-form" id="intakeForm">
      <div class="intake-row">
        <div class="intake-field">
          <label>Full Name</label>
          <input type="text" placeholder="e.g. Malik Frazier" id="intakeName">
        </div>
        <div class="intake-field">
          <label>Work Email</label>
          <input type="email" placeholder="you@company.com" id="intakeEmail">
        </div>
      </div>
      <div class="intake-row">
        <div class="intake-field">
          <label>Company</label>
          <input type="text" placeholder="e.g. Acme Corp" id="intakeCompany">
        </div>
        <div class="intake-field">
          <label>Role / Title</label>
          <select id="intakeRole">
            <option value="">Select your role</option>
            <option>CFO</option>
            <option>VP of Finance</option>
            <option>FP&A Director</option>
            <option>Controller</option>
            <option>Finance Manager</option>
            <option>COO / CEO</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div class="intake-row">
        <div class="intake-field">
          <label>Company Size</label>
          <select id="intakeSize">
            <option value="">Select size</option>
            <option>1-50 employees</option>
            <option>51-200 employees</option>
            <option>201-1,000 employees</option>
            <option>1,001-5,000 employees</option>
            <option>5,000+ employees</option>
          </select>
        </div>
        <div class="intake-field">
          <label>\${isArchitect ? 'Number of Entities' : 'Primary Use Case'}</label>
          <select id="intakeUse">
            \${isArchitect ? \`
              <option value="">How many entities?</option>
              <option>1-3 entities</option>
              <option>4-10 entities</option>
              <option>11-25 entities</option>
              <option>25+ entities</option>
            \` : \`
              <option value="">What will you use this for?</option>
              <option>Monthly close & reporting</option>
              <option>FP&A / budgeting</option>
              <option>Cash flow management</option>
              <option>Board / investor reporting</option>
              <option>Multi-entity consolidation</option>
              <option>Portfolio management</option>
              <option>Other</option>
            \`}
          </select>
        </div>
      </div>
      \${isArchitect ? \`
      <div class="intake-field">
        <label>Current Systems (ERP, GL, Tools)</label>
        <input type="text" placeholder="e.g. NetSuite, Salesforce, Excel, QuickBooks" id="intakeSystems">
      </div>\` : ''}
      <div class="intake-field">
        <label>\${isArchitect ? 'What does your ideal Command Center look like?' : 'Anything we should know?'}</label>
        <textarea placeholder="\${isArchitect ? 'Describe your ideal dashboard, key KPIs, workflows, pain points...' : 'Optional — any specific needs, integrations, or timeline...'}" id="intakeNotes" rows="3"></textarea>
      </div>

      <!-- NDA Agreement -->
      <div style="padding:14px 16px;border-radius:10px;background:rgba(52,211,153,.03);border:1px solid rgba(52,211,153,.1);margin-top:8px">
        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:12px;color:var(--dim);line-height:1.6">
          <input type="checkbox" id="intakeNDA" style="margin-top:3px;accent-color:var(--green);width:16px;height:16px;flex-shrink:0" checked>
          <span>I agree to the <strong style="color:var(--green);cursor:pointer;text-decoration:underline">FinanceOS Mutual NDA</strong> and acknowledge that all dashboard configurations, financial data, and company information shared during this process are treated as confidential under our standard non-disclosure agreement. FinanceOS maintains SOC 2 Type II compliance, AES-256 encryption at rest, and TLS 1.3 in transit.</span>
        </label>
      </div>
    </div>

    <div class="intake-note">\${noteText}</div>

    <div style="display:flex;gap:12px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="closeInstall()">Cancel</button>
      <button class="btn btn-primary" onclick="submitConsultation('\${templateId}','\${flowType}')" style="padding:12px 28px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        \${isArchitect ? 'Submit & Schedule Call' : 'Submit Request'}
      </button>
    </div>

    <!-- Processing state -->
    <div class="consult-processing" id="consultProcessing">
      <div class="consult-dots"><div class="cdot"></div><div class="cdot"></div><div class="cdot"></div></div>
      <div style="font-size:14px;font-weight:600;margin-bottom:4px">Reviewing your request...</div>
      <div style="font-size:12px;color:var(--muted)">Verifying account & preparing your private link</div>
    </div>

    <!-- Success: Private link delivery -->
    <div class="consult-success" id="consultSuccess">
      <div class="success-ring">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 style="color:var(--accent)">Request Received</h3>
      <p>We're reviewing your submission now. Your private install link will be delivered to <strong id="confirmEmail" style="color:var(--text)">your email</strong> within 24 hours.</p>

      <div style="padding:16px 20px;border-radius:12px;background:var(--surface);border:1px solid var(--border);text-align:left;margin:16px 0">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);font-weight:600;margin-bottom:10px">What you'll receive:</div>
        <div style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Private, one-time install link for <strong style="color:var(--text)" id="confirmTemplate">\${t.name}</strong></span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Pre-configured with your customizer selections (see below)</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <span>15-minute onboarding walkthrough with our team</span>
        </div>
      </div>

      <!-- Captured customization config -->
      <div id="configSummary" style="padding:14px 20px;border-radius:12px;background:rgba(91,156,245,.03);border:1px solid rgba(91,156,245,.1);text-align:left;margin:12px 0">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--accent);font-weight:600;margin-bottom:8px">Your Configuration</div>
        <!-- Populated dynamically by submitConsultation -->
      </div>

      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:4px">
        <div class="link-expires">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Link expires 72 hours after delivery
        </div>
        <div class="link-expires" style="color:var(--green);background:rgba(52,211,153,.06)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          Mutual NDA active
        </div>
      </div>

      <div style="display:flex;gap:12px;justify-content:center;margin-top:20px">
        <button class="btn btn-ghost btn-sm" onclick="closeInstall()">Back to Gallery</button>
        <button class="btn btn-primary btn-sm" onclick="closeInstall()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Done
        </button>
      </div>
    </div>
  \`;

  pipeline.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ═══ SERIALIZATION: Capture customizer preferences ═══
function getCustomizerPrefs() {
  const prefs = { brandColor: null, hexCode: null, modulesOn: [], modulesOff: [] };

  // Get selected color swatch
  const selectedSwatch = document.querySelector('.color-swatch.selected');
  if(selectedSwatch) {
    prefs.brandColor = selectedSwatch.style.background || 'default blue';
  }

  // Get custom hex input
  const hexInput = document.querySelector('.custom-section input[type="text"][value]');
  if(hexInput) prefs.hexCode = hexInput.value;

  // Get module toggle states
  document.querySelectorAll('.module-toggle').forEach(row => {
    const name = row.querySelector('.mod-name')?.textContent;
    const isOn = row.querySelector('.toggle')?.classList.contains('on');
    if(name) {
      if(isOn) prefs.modulesOn.push(name);
      else prefs.modulesOff.push(name);
    }
  });

  return prefs;
}

async function submitConsultation(templateId, flowType) {
  const t = templates[templateId];
  const name = document.getElementById('intakeName')?.value;
  const email = document.getElementById('intakeEmail')?.value;
  const company = document.getElementById('intakeCompany')?.value || '';
  const role = document.getElementById('intakeRole')?.value || '';
  const size = document.getElementById('intakeSize')?.value || '';
  const useCase = document.getElementById('intakeUse')?.value || '';
  const notes = document.getElementById('intakeNotes')?.value || '';
  const systems = document.getElementById('intakeSystems')?.value || '';

  const ndaChecked = document.getElementById('intakeNDA')?.checked;

  if(!name || !email || !ndaChecked) {
    if(!name) { const el = document.getElementById('intakeName'); el.style.borderColor = 'var(--red)'; el.setAttribute('placeholder','Required'); }
    if(!email) { const el = document.getElementById('intakeEmail'); el.style.borderColor = 'var(--red)'; el.setAttribute('placeholder','Required'); }
    if(!ndaChecked) { document.getElementById('intakeNDA').parentElement.parentElement.style.borderColor = 'var(--red)'; }
    return;
  }

  // Capture customizer preferences from the modal (if they were set)
  const prefs = getCustomizerPrefs();

  // Build full payload
  const payload = {
    template: templateId,
    templateName: t?.name,
    flowType,
    contact: { name, email, company, role, size },
    useCase,
    notes,
    systems,
    customization: {
      brandHex: prefs.hexCode,
      activeModules: prefs.modulesOn,
      disabledModules: prefs.modulesOff
    },
    ndaAccepted: true,
    ndaTimestamp: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    requestId: 'REQ-' + Date.now().toString(36).toUpperCase()
  };

  // Log payload (in production this would POST to your API)
  console.log('📋 FinanceOS Consultation Request:', JSON.stringify(payload, null, 2));

  // Hide form, show processing
  document.getElementById('intakeForm').style.display = 'none';
  // Hide the note and button row
  document.querySelectorAll('.intake-note').forEach(n => n.style.display = 'none');
  document.querySelector('.install-sub').style.display = 'none';
  const btnRow = document.querySelector('.install-panel > div[style*="justify-content:flex-end"]');
  if(btnRow) btnRow.style.display = 'none';
  document.querySelector('.consult-processing').style.display = 'block';

  // Simulate review processing
  await new Promise(r => setTimeout(r, 3200));

  // Show success with captured preferences
  document.querySelector('.consult-processing').style.display = 'none';
  const success = document.getElementById('consultSuccess');
  if(success) {
    success.style.display = 'block';
    const emailEl = document.getElementById('confirmEmail');
    if(emailEl) emailEl.textContent = email;
    const tplEl = document.getElementById('confirmTemplate');
    if(tplEl) tplEl.textContent = t?.name || 'your dashboard';

    // Inject the captured config summary
    const configSummary = document.getElementById('configSummary');
    if(configSummary) {
      let configHTML = '';

      // Brand color
      if(prefs.hexCode) {
        configHTML += \`<div style="display:flex;align-items:center;gap:8px;padding:6px 0">
          <div style="width:16px;height:16px;border-radius:4px;background:\${prefs.hexCode};border:1px solid rgba(255,255,255,.1);flex-shrink:0"></div>
          <span style="font-size:12px;color:var(--text)">Brand color: <code style="background:var(--card);padding:2px 6px;border-radius:4px;font-size:11px">\${prefs.hexCode}</code></span>
        </div>\`;
      }

      // Active modules
      if(prefs.modulesOn.length > 0) {
        configHTML += \`<div style="padding:6px 0">
          <span style="font-size:12px;color:var(--dim)">Active modules:</span>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
            \${prefs.modulesOn.map(m => \`<span style="padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600;background:rgba(52,211,153,.08);color:var(--green);border:1px solid rgba(52,211,153,.15)">\${m}</span>\`).join('')}
          </div>
        </div>\`;
      }

      // Disabled modules
      if(prefs.modulesOff.length > 0) {
        configHTML += \`<div style="padding:6px 0">
          <span style="font-size:12px;color:var(--dim)">Disabled:</span>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
            \${prefs.modulesOff.map(m => \`<span style="padding:2px 8px;border-radius:6px;font-size:10px;font-weight:500;background:rgba(90,99,128,.08);color:var(--muted);border:1px solid rgba(30,37,64,.3);text-decoration:line-through">\${m}</span>\`).join('')}
          </div>
        </div>\`;
      }

      // Request ID
      configHTML += \`<div style="padding:8px 0;margin-top:4px;border-top:1px solid var(--border)">
        <span style="font-size:11px;color:var(--muted)">Request ID: </span>
        <code style="font-size:11px;color:var(--accent);background:rgba(91,156,245,.06);padding:2px 8px;border-radius:4px">\${payload.requestId}</code>
      </div>\`;

      configSummary.innerHTML = configHTML;
    }
  }
}

function closeInstall() {
  document.getElementById('installPipeline').classList.remove('active');
  document.body.style.overflow = '';
  consultRunning = false;
}
// ═══ NDA GATE ═══
function toggleNdaBtn() {
  const btn = document.getElementById('ndaEnterBtn');
  const checked = document.getElementById('ndaAccept')?.checked;
  if(checked) btn.classList.add('active');
  else btn.classList.remove('active');
}

function enterPortal() {
  const checked = document.getElementById('ndaAccept')?.checked;
  if(!checked) return;

  // Record NDA acceptance
  const ndaRecord = {
    accepted: true,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    sessionId: 'NDA-' + Date.now().toString(36).toUpperCase()
  };
  console.log('🔒 NDA Accepted:', JSON.stringify(ndaRecord, null, 2));

  // Dismiss gate, reveal content
  document.getElementById('ndaGate').classList.add('dismissed');
  document.getElementById('mainContent').classList.add('visible');
}`
    ];
    scripts.forEach(code => {
      try { new Function(code)(); } catch(e) { console.warn('Script error:', e); }
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
*{margin:0;padding:0;box-sizing:border-box}
:root{
--bg:#0a0d13;--surface:#111520;--card:#161b28;--card2:#1a2033;
--border:#1e2540;--border2:#2a3355;--text:#e2e8f0;--dim:#8892a8;--muted:#5a6380;
--accent:#5b9cf5;--green:#34d399;--red:#f87171;--amber:#fbbf24;--purple:#a78bfa;--pink:#f472b6;--cyan:#22d3ee;--indigo:#818cf8;
--radius:14px;--shadow:0 4px 24px rgba(0,0,0,.4);--ease:cubic-bezier(.4,0,.2,1);
}
body{font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;min-height:100vh}

/* ═══ TOP NAV ═══ */
.topnav{display:flex;align-items:center;justify-content:space-between;padding:16px 32px;border-bottom:1px solid var(--border);background:var(--surface);position:sticky;top:0;z-index:100;backdrop-filter:blur(12px)}
.topnav-logo{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:800}
.topnav-logo svg{width:28px;height:28px}
.topnav-logo span{background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.topnav-actions{display:flex;align-items:center;gap:12px}
.tier-badge{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase}
.tier-badge.starter{background:rgba(91,156,245,.12);color:var(--accent)}
.tier-badge.growth{background:rgba(52,211,153,.12);color:var(--green)}
.tier-badge.business{background:rgba(251,191,36,.12);color:var(--amber)}
.tier-badge.enterprise{background:rgba(167,139,250,.12);color:var(--purple)}
.btn{padding:10px 20px;border-radius:var(--radius);font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all .25s var(--ease);display:inline-flex;align-items:center;gap:8px}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--purple));color:#fff}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(91,156,245,.3)}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text)}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
.btn-sm{padding:7px 14px;font-size:12px}

/* ═══ HERO ═══ */
.hero{text-align:center;padding:56px 32px 40px;max-width:800px;margin:0 auto}
.hero h1{font-size:36px;font-weight:800;line-height:1.2;margin-bottom:12px}
.hero h1 span{background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:15px;color:var(--dim);max-width:560px;margin:0 auto 28px}
.hero-stats{display:flex;justify-content:center;gap:40px;margin-top:24px}
.hero-stat{text-align:center}
.hero-stat .num{font-size:28px;font-weight:800;color:var(--accent)}
.hero-stat .label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}

/* ═══ FILTERS ═══ */
.filters{padding:0 32px;max-width:1400px;margin:0 auto 32px}
.filter-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.filter-group{display:flex;align-items:center;gap:6px}
.filter-label{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);font-weight:600;margin-right:4px}
.filter-chip{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid var(--border);background:transparent;color:var(--dim);cursor:pointer;transition:all .2s var(--ease);white-space:nowrap}
.filter-chip:hover{border-color:var(--accent);color:var(--text)}
.filter-chip.active{background:rgba(91,156,245,.12);border-color:var(--accent);color:var(--accent);font-weight:600}
.search-box{flex:1;min-width:200px;max-width:320px;margin-left:auto;position:relative}
.search-box input{width:100%;padding:9px 14px 9px 36px;border-radius:var(--radius);border:1px solid var(--border);background:var(--card);color:var(--text);font-size:13px;outline:none;transition:border-color .2s}
.search-box input:focus{border-color:var(--accent)}
.search-box svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:14px;height:14px;stroke:var(--muted);fill:none;stroke-width:2}

/* ═══ TEMPLATE GRID ═══ */
.gallery{max-width:1400px;margin:0 auto;padding:0 32px 60px}
.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}

/* ═══ TEMPLATE CARD ═══ */
.tpl-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all .35s var(--ease);cursor:pointer;position:relative}
.tpl-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.4);border-color:var(--border2)}
.tpl-card.locked{opacity:.7}
.tpl-card.locked:hover{opacity:.85}

/* Preview area */
.tpl-preview{position:relative;height:220px;overflow:hidden;border-bottom:1px solid var(--border)}
.tpl-thumb{width:100%;height:100%;object-fit:cover;transition:transform .4s var(--ease)}
.tpl-card:hover .tpl-thumb{transform:scale(1.03)}
.tpl-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(10,13,19,.85) 100%);opacity:0;transition:opacity .3s var(--ease);display:flex;align-items:flex-end;justify-content:center;padding:24px}
.tpl-card:hover .tpl-overlay{opacity:1}
.tpl-overlay .btn{transform:translateY(8px);transition:all .3s var(--ease) .1s;opacity:0}
.tpl-card:hover .tpl-overlay .btn{transform:translateY(0);opacity:1}

/* Badges on preview */
.tpl-badges{position:absolute;top:12px;left:12px;display:flex;gap:6px;z-index:2}
.tpl-badge{padding:3px 10px;border-radius:12px;font-size:10px;font-weight:700;letter-spacing:.3px;backdrop-filter:blur(8px)}
.tpl-badge.popular{background:rgba(52,211,153,.2);color:var(--green);border:1px solid rgba(52,211,153,.3)}
.tpl-badge.new{background:rgba(91,156,245,.2);color:var(--accent);border:1px solid rgba(91,156,245,.3)}
.tpl-badge.premium{background:rgba(167,139,250,.2);color:var(--purple);border:1px solid rgba(167,139,250,.3)}
.tpl-badge.free{background:rgba(52,211,153,.15);color:var(--green);border:1px solid rgba(52,211,153,.2)}
.tpl-tier-lock{position:absolute;top:12px;right:12px;padding:3px 10px;border-radius:12px;font-size:10px;font-weight:700;backdrop-filter:blur(8px);display:flex;align-items:center;gap:4px}
.tpl-tier-lock svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.5}

/* Card body */
.tpl-body{padding:18px 20px 20px}
.tpl-name{font-size:16px;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:8px}
.tpl-desc{font-size:12px;color:var(--dim);line-height:1.6;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.tpl-meta{display:flex;align-items:center;justify-content:space-between}
.tpl-modules{display:flex;gap:4px;flex-wrap:wrap}
.tpl-module{padding:3px 8px;border-radius:8px;font-size:10px;font-weight:500;background:rgba(91,156,245,.06);color:var(--dim);border:1px solid rgba(30,37,64,.5)}
.tpl-rating{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--amber)}
.tpl-rating span{color:var(--muted);font-weight:500}

/* ═══ MINI DASHBOARD PREVIEWS (CSS art) ═══ */
.dash-preview{width:100%;height:100%;padding:12px;display:grid;gap:6px;background:var(--surface)}

/* Style: Executive Dark */
.dash-exec{grid-template-columns:1fr 1fr 1fr 1fr;grid-template-rows:40px 1fr 1fr;background:linear-gradient(135deg,#0c1017,#131a28)}
.dash-exec .kpi{border-radius:6px;background:rgba(91,156,245,.06);border:1px solid rgba(91,156,245,.1);display:flex;flex-direction:column;align-items:center;justify-content:center}
.dash-exec .kpi .val{font-size:14px;font-weight:800;color:var(--accent)}
.dash-exec .kpi .lbl{font-size:7px;color:var(--muted);margin-top:2px}
.dash-exec .chart-area{grid-column:1/3;border-radius:6px;background:rgba(91,156,245,.04);border:1px solid rgba(30,37,64,.5);position:relative;overflow:hidden}
.dash-exec .chart-area::after{content:'';position:absolute;bottom:0;left:0;right:0;height:60%;background:linear-gradient(0deg,rgba(91,156,245,.12),transparent);clip-path:polygon(0 80%,10% 60%,20% 70%,30% 40%,40% 55%,50% 30%,60% 45%,70% 20%,80% 35%,90% 15%,100% 25%,100% 100%,0 100%)}
.dash-exec .table-area{grid-column:3/5;border-radius:6px;background:rgba(30,37,64,.2);border:1px solid rgba(30,37,64,.5);padding:8px}
.dash-exec .trow{height:8px;background:rgba(91,156,245,.06);border-radius:3px;margin-bottom:4px}
.dash-exec .trow:nth-child(even){width:85%}
.dash-exec .topbar{grid-column:1/5;border-radius:6px;background:rgba(91,156,245,.03);border:1px solid rgba(30,37,64,.4);display:flex;align-items:center;padding:0 10px;gap:8px}
.dash-exec .topbar .dot{width:6px;height:6px;border-radius:50%;background:var(--accent);opacity:.5}
.dash-exec .topbar .bar{flex:1;height:4px;border-radius:2px;background:rgba(91,156,245,.1)}

/* Style: CFO Glassmorphism */
.dash-glass{grid-template-columns:200px 1fr;grid-template-rows:1fr;background:linear-gradient(135deg,#0d1220,#1a1040)}
.dash-glass .sidebar{border-radius:8px;background:rgba(167,139,250,.06);border:1px solid rgba(167,139,250,.12);padding:10px 8px;display:flex;flex-direction:column;gap:5px}
.dash-glass .sidebar .nav-item{height:8px;border-radius:4px;background:rgba(167,139,250,.1)}
.dash-glass .sidebar .nav-item.active{background:rgba(167,139,250,.25);box-shadow:0 0 8px rgba(167,139,250,.15)}
.dash-glass .main{display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:50px 1fr;gap:6px}
.dash-glass .gcard{border-radius:6px;background:rgba(255,255,255,.03);border:1px solid rgba(167,139,250,.1);backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center}
.dash-glass .gcard .gval{font-size:13px;font-weight:800;color:var(--purple)}
.dash-glass .gcard .glbl{font-size:7px;color:var(--muted)}
.dash-glass .wide{grid-column:1/4;border-radius:6px;background:rgba(167,139,250,.04);border:1px solid rgba(167,139,250,.08);position:relative;overflow:hidden}
.dash-glass .wide::after{content:'';position:absolute;bottom:0;left:0;right:0;height:70%;background:linear-gradient(0deg,rgba(167,139,250,.15),transparent);clip-path:polygon(0 60%,8% 50%,16% 65%,24% 35%,32% 45%,40% 25%,48% 40%,56% 20%,64% 30%,72% 15%,80% 28%,88% 10%,96% 22%,100% 18%,100% 100%,0 100%)}

/* Style: Treasury Neon */
.dash-neon{grid-template-columns:1fr 1fr;grid-template-rows:40px 1fr 1fr;background:linear-gradient(135deg,#0a0f18,#0d1a1a)}
.dash-neon .ntop{grid-column:1/3;border-radius:6px;background:rgba(34,211,238,.03);border:1px solid rgba(34,211,238,.1);display:flex;align-items:center;padding:0 10px;gap:6px}
.dash-neon .ntop .circ{width:20px;height:20px;border-radius:50%;border:2px solid rgba(34,211,238,.3);display:flex;align-items:center;justify-content:center}
.dash-neon .ntop .circ::after{content:'';width:8px;height:8px;border-radius:50%;background:var(--cyan);opacity:.6}
.dash-neon .ntop .nbar{flex:1;height:4px;border-radius:2px;background:rgba(34,211,238,.08)}
.dash-neon .nchart{border-radius:6px;background:rgba(34,211,238,.03);border:1px solid rgba(34,211,238,.08);position:relative;overflow:hidden}
.dash-neon .nchart::after{content:'';position:absolute;bottom:0;left:0;right:0;height:70%;background:linear-gradient(0deg,rgba(34,211,238,.1),transparent);clip-path:polygon(0 50%,15% 65%,30% 30%,45% 55%,60% 20%,75% 45%,90% 15%,100% 35%,100% 100%,0 100%)}
.dash-neon .nlist{border-radius:6px;background:rgba(34,211,238,.02);border:1px solid rgba(34,211,238,.06);padding:8px;display:flex;flex-direction:column;gap:4px}
.dash-neon .nrow{height:7px;border-radius:3px;background:rgba(34,211,238,.06)}
.dash-neon .nrow:nth-child(odd){width:90%}
.dash-neon .ngauge{border-radius:6px;background:rgba(34,211,238,.03);border:1px solid rgba(34,211,238,.08);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px}
.dash-neon .ngauge .ring{width:48px;height:48px;border-radius:50%;border:4px solid rgba(34,211,238,.12);border-top-color:var(--cyan);transform:rotate(45deg)}
.dash-neon .ngauge .glbl{font-size:7px;color:var(--muted)}
.dash-neon .nkpis{border-radius:6px;background:rgba(34,211,238,.03);border:1px solid rgba(34,211,238,.06);display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:6px}
.dash-neon .nkpi{border-radius:4px;background:rgba(34,211,238,.04);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px}
.dash-neon .nkpi .nv{font-size:11px;font-weight:800;color:var(--cyan)}
.dash-neon .nkpi .nl{font-size:6px;color:var(--muted)}

/* Style: Multi-Entity */
.dash-multi{grid-template-columns:1fr;grid-template-rows:36px auto 1fr;gap:6px;background:linear-gradient(135deg,#0c0f18,#141020)}
.dash-multi .mtabs{display:flex;gap:4px;padding:4px;border-radius:8px;background:rgba(251,191,36,.03);border:1px solid rgba(251,191,36,.08)}
.dash-multi .mtab{flex:1;height:100%;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:600;color:var(--muted)}
.dash-multi .mtab.active{background:rgba(251,191,36,.12);color:var(--amber)}
.dash-multi .mkpis{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
.dash-multi .mkpi{border-radius:6px;background:rgba(251,191,36,.04);border:1px solid rgba(251,191,36,.06);padding:8px 4px;text-align:center}
.dash-multi .mkpi .mv{font-size:12px;font-weight:800;color:var(--amber)}
.dash-multi .mkpi .ml{font-size:6px;color:var(--muted)}
.dash-multi .mchart{border-radius:6px;background:rgba(251,191,36,.03);border:1px solid rgba(251,191,36,.06);position:relative;overflow:hidden}
.dash-multi .mchart::after{content:'';position:absolute;bottom:0;left:0;right:0;height:75%;background:linear-gradient(0deg,rgba(251,191,36,.1),transparent);clip-path:polygon(0 70%,12% 50%,25% 60%,37% 35%,50% 50%,62% 25%,75% 40%,87% 20%,100% 30%,100% 100%,0 100%)}

/* Style: Startup Minimal */
.dash-minimal{grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:8px;background:linear-gradient(135deg,#0e1118,#121620);padding:16px}
.dash-minimal .mcard{border-radius:8px;background:rgba(52,211,153,.03);border:1px solid rgba(52,211,153,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
.dash-minimal .mcard .mcv{font-size:16px;font-weight:800;color:var(--green)}
.dash-minimal .mcard .mcl{font-size:7px;color:var(--muted)}
.dash-minimal .mcard.wide{grid-column:1/4;position:relative;overflow:hidden}
.dash-minimal .mcard.wide::after{content:'';position:absolute;bottom:0;left:0;right:0;height:50%;background:linear-gradient(0deg,rgba(52,211,153,.08),transparent);clip-path:polygon(0 80%,20% 40%,40% 60%,60% 20%,80% 50%,100% 10%,100% 100%,0 100%)}

/* Style: PE/VC Portfolio */
.dash-pe{grid-template-columns:1fr 1fr 1fr;grid-template-rows:36px 1fr 1fr;gap:6px;background:linear-gradient(135deg,#10080c,#1a0c18)}
.dash-pe .petop{grid-column:1/4;border-radius:6px;background:rgba(244,114,182,.03);border:1px solid rgba(244,114,182,.1);display:flex;align-items:center;padding:0 10px;gap:8px}
.dash-pe .petop .pdot{width:8px;height:8px;border-radius:50%;background:var(--pink);opacity:.4}
.dash-pe .petop .pbar{height:4px;border-radius:2px;background:rgba(244,114,182,.1);flex:1}
.dash-pe .pecard{border-radius:6px;background:rgba(244,114,182,.03);border:1px solid rgba(244,114,182,.06);display:flex;flex-direction:column;align-items:center;justify-content:center}
.dash-pe .pecard .pv{font-size:13px;font-weight:800;color:var(--pink)}
.dash-pe .pecard .pl{font-size:7px;color:var(--muted)}
.dash-pe .pwide{grid-column:1/4;border-radius:6px;background:rgba(244,114,182,.03);border:1px solid rgba(244,114,182,.06);display:grid;grid-template-columns:repeat(6,1fr);gap:4px;padding:8px;align-items:end}
.dash-pe .pwide .pbar-v{border-radius:3px 3px 0 0;background:rgba(244,114,182,.15);width:100%}
.dash-pe .pwide .pbar-v:nth-child(1){height:40%}
.dash-pe .pwide .pbar-v:nth-child(2){height:60%}
.dash-pe .pwide .pbar-v:nth-child(3){height:75%}
.dash-pe .pwide .pbar-v:nth-child(4){height:55%}
.dash-pe .pwide .pbar-v:nth-child(5){height:85%}
.dash-pe .pwide .pbar-v:nth-child(6){height:65%}

/* ═══ DETAIL MODAL ═══ */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:200;display:none;align-items:center;justify-content:center;padding:32px}
.modal-backdrop.active{display:flex}
.modal{background:var(--card);border:1px solid var(--border);border-radius:20px;width:100%;max-width:960px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.6)}
.modal-close{position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.05);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;color:var(--dim);z-index:5}
.modal-close:hover{background:rgba(248,113,113,.1);color:var(--red);border-color:var(--red)}
.modal-header{position:relative;padding:32px 32px 0}
.modal-preview{height:300px;border-radius:var(--radius);overflow:hidden;border:1px solid var(--border);margin-bottom:24px}
.modal-title{font-size:24px;font-weight:800;margin-bottom:6px}
.modal-subtitle{font-size:14px;color:var(--dim);margin-bottom:20px}
.modal-body{padding:0 32px 32px}

/* Customizer panel */
.customizer{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:24px}
.custom-section{padding:20px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--border)}
.custom-section h4{font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.custom-section h4 svg{width:16px;height:16px;stroke:var(--accent);fill:none;stroke-width:2}
.color-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
.color-swatch{width:100%;aspect-ratio:1;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:all .2s var(--ease)}
.color-swatch:hover{transform:scale(1.1)}
.color-swatch.selected{border-color:#fff;box-shadow:0 0 12px rgba(255,255,255,.2)}
.module-toggle{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(30,37,64,.3)}
.module-toggle:last-child{border:none}
.module-toggle .mod-name{font-size:13px;color:var(--text)}
.module-toggle .mod-desc{font-size:10px;color:var(--muted)}
.toggle{width:38px;height:20px;border-radius:10px;background:var(--border);position:relative;cursor:pointer;transition:background .2s}
.toggle.on{background:var(--green)}
.toggle::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s}
.toggle.on::after{transform:translateX(18px)}

/* Deploy bar */
.deploy-bar{display:flex;align-items:center;justify-content:space-between;padding:20px 32px;border-top:1px solid var(--border);background:var(--surface);border-radius:0 0 20px 20px}
.deploy-price{display:flex;align-items:baseline;gap:8px}
.deploy-price .amount{font-size:24px;font-weight:800;color:var(--green)}
.deploy-price .period{font-size:13px;color:var(--dim)}
.deploy-price .inc{font-size:11px;color:var(--muted)}
.deploy-actions{display:flex;gap:10px}

/* ═══ CATEGORY SECTIONS ═══ */
.cat-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;margin-top:40px}
.cat-header:first-of-type{margin-top:0}
.cat-title{font-size:18px;font-weight:700;display:flex;align-items:center;gap:10px}
.cat-count{font-size:12px;color:var(--muted);font-weight:400}
.cat-link{font-size:12px;color:var(--accent);cursor:pointer;display:flex;align-items:center;gap:4px}
.cat-link svg{width:14px;height:14px;stroke:var(--accent);fill:none;stroke-width:2}

/* ═══ CTA SECTION ═══ */
.cta-section{margin-top:60px;padding:48px 32px;background:linear-gradient(135deg,rgba(91,156,245,.06),rgba(167,139,250,.06));border:1px solid var(--border);border-radius:20px;text-align:center}
.cta-section h2{font-size:24px;font-weight:800;margin-bottom:8px}
.cta-section p{font-size:14px;color:var(--dim);max-width:500px;margin:0 auto 24px}
.cta-pills{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}

/* ═══ REQUEST ACCESS BUTTON ON CARDS ═══ */
.install-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:10px 16px;margin-top:14px;border-radius:10px;font-size:13px;font-weight:700;border:1px solid var(--border);cursor:pointer;transition:all .25s var(--ease);background:transparent;color:var(--dim);position:relative;overflow:hidden}
.install-btn:hover{border-color:var(--accent);color:var(--accent);background:rgba(91,156,245,.04);transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.2)}
.install-btn svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;flex-shrink:0}
.install-btn.locked-btn{opacity:.5}
.install-btn.locked-btn:hover{border-color:var(--amber);color:var(--amber);background:rgba(251,191,36,.04)}
.install-btn .shimmer{position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);transition:none}
.install-btn:hover .shimmer{animation:btnShimmer .8s ease}
@keyframes btnShimmer{0%{left:-100%}100%{left:100%}}
/* Limited badge */
.limited-tag{font-size:9px;padding:2px 8px;border-radius:8px;background:rgba(248,113,113,.1);color:var(--red);font-weight:600;letter-spacing:.3px;margin-left:auto}

/* ═══ CONSULTATION MODAL ═══ */
.install-pipeline{display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(12px);z-index:300;align-items:center;justify-content:center;padding:32px}
.install-pipeline.active{display:flex}
.install-panel{background:var(--card);border:1px solid var(--border);border-radius:20px;width:100%;max-width:580px;padding:40px;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,.6)}
.install-panel h2{font-size:22px;font-weight:800;margin-bottom:6px}
.install-panel .install-sub{font-size:13px;color:var(--dim);margin-bottom:28px}

/* Intake form */
.intake-form{text-align:left;margin-bottom:24px}
.intake-field{margin-bottom:16px}
.intake-field label{display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:6px}
.intake-field input,.intake-field select,.intake-field textarea{width:100%;padding:10px 14px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}
.intake-field input:focus,.intake-field select:focus,.intake-field textarea:focus{border-color:var(--accent)}
.intake-field select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238892a8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px}
.intake-field textarea{resize:vertical;min-height:60px}
.intake-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.intake-note{font-size:11px;color:var(--muted);line-height:1.5;padding:12px 16px;border-radius:10px;background:rgba(91,156,245,.04);border:1px solid rgba(91,156,245,.08);margin-bottom:20px;text-align:left}
.intake-note strong{color:var(--accent)}

/* Processing animation */
.consult-processing{display:none;text-align:center;padding:32px 0}
.consult-dots{display:flex;justify-content:center;gap:8px;margin-bottom:24px}
.consult-dots .cdot{width:10px;height:10px;border-radius:50%;background:var(--accent);animation:cdotPulse 1.4s ease infinite}
.consult-dots .cdot:nth-child(2){animation-delay:.2s}
.consult-dots .cdot:nth-child(3){animation-delay:.4s}
@keyframes cdotPulse{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1.2)}}

/* Success / Link Delivery state */
.consult-success{display:none;text-align:center;padding:20px 0}
.consult-success .success-ring{width:72px;height:72px;border-radius:50%;background:rgba(91,156,245,.08);border:3px solid var(--accent);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;animation:successPop .5s var(--ease)}
.consult-success .success-ring svg{width:32px;height:32px;stroke:var(--accent);fill:none;stroke-width:2.5}
.consult-success h3{font-size:20px;font-weight:800;margin-bottom:6px}
.consult-success p{font-size:13px;color:var(--dim);margin-bottom:16px;line-height:1.6}
.consult-success .private-link{display:inline-flex;align-items:center;gap:10px;padding:14px 24px;border-radius:12px;background:linear-gradient(135deg,rgba(91,156,245,.08),rgba(167,139,250,.08));border:1px solid rgba(91,156,245,.2);font-size:14px;font-weight:700;color:var(--accent);cursor:pointer;transition:all .2s;margin-bottom:8px}
.consult-success .private-link:hover{background:linear-gradient(135deg,rgba(91,156,245,.14),rgba(167,139,250,.14));transform:translateY(-1px)}
.consult-success .private-link svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}
.consult-success .link-note{font-size:11px;color:var(--muted);margin-top:8px}
.consult-success .link-expires{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--red);background:rgba(248,113,113,.06);padding:4px 12px;border-radius:8px;margin-top:8px}
@keyframes successPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}

/* ═══ NDA GATE ═══ */
.nda-gate{position:fixed;inset:0;z-index:500;background:var(--bg);display:flex;align-items:center;justify-content:center;transition:opacity .6s var(--ease),visibility .6s}
.nda-gate.dismissed{opacity:0;visibility:hidden;pointer-events:none}
.nda-panel{width:100%;max-width:560px;padding:48px 40px;text-align:center}
.nda-shield{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,rgba(52,211,153,.08),rgba(91,156,245,.08));border:2px solid rgba(52,211,153,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 28px;animation:shieldFloat 3s ease-in-out infinite}
.nda-shield svg{width:36px;height:36px;stroke:var(--green);fill:none;stroke-width:1.5}
@keyframes shieldFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.nda-panel h1{font-size:28px;font-weight:800;margin-bottom:8px;line-height:1.3}
.nda-panel h1 span{background:linear-gradient(135deg,var(--green),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nda-panel .nda-sub{font-size:14px;color:var(--dim);margin-bottom:32px;line-height:1.6}
.nda-terms{text-align:left;padding:20px 24px;border-radius:var(--radius);background:var(--card);border:1px solid var(--border);margin-bottom:24px;max-height:200px;overflow-y:auto;font-size:12px;color:var(--dim);line-height:1.8}
.nda-terms h4{color:var(--text);font-size:13px;margin-bottom:8px}
.nda-terms::-webkit-scrollbar{width:4px}
.nda-terms::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.nda-check{display:flex;align-items:flex-start;gap:12px;text-align:left;padding:16px 20px;border-radius:var(--radius);background:rgba(52,211,153,.03);border:1px solid rgba(52,211,153,.1);margin-bottom:24px;cursor:pointer;transition:all .2s}
.nda-check:hover{background:rgba(52,211,153,.06)}
.nda-check input{margin-top:2px;accent-color:var(--green);width:18px;height:18px;flex-shrink:0}
.nda-check span{font-size:13px;color:var(--text);line-height:1.6}
.nda-check .nda-small{font-size:11px;color:var(--muted);display:block;margin-top:4px}
.nda-enter-btn{width:100%;padding:14px 28px;border-radius:var(--radius);font-size:15px;font-weight:700;border:none;cursor:pointer;background:linear-gradient(135deg,var(--green),var(--accent));color:#fff;transition:all .25s var(--ease);display:flex;align-items:center;justify-content:center;gap:10px;opacity:.4;pointer-events:none}
.nda-enter-btn.active{opacity:1;pointer-events:auto}
.nda-enter-btn.active:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(52,211,153,.3)}
.nda-security{display:flex;justify-content:center;gap:20px;margin-top:24px;flex-wrap:wrap}
.nda-security .sec-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted)}
.nda-security .sec-item svg{width:14px;height:14px;stroke:var(--green);fill:none;stroke-width:2}
/* Hide main content until NDA accepted */
.main-content{display:none}
.main-content.visible{display:block}

@media(max-width:1024px){.gallery-grid{grid-template-columns:repeat(2,1fr)}.customizer{grid-template-columns:1fr}}
@media(max-width:768px){.gallery-grid{grid-template-columns:1fr}.hero h1{font-size:28px}.hero-stats{gap:24px}.filter-row{flex-direction:column;align-items:stretch}.search-box{max-width:100%;margin-left:0}.modal{max-width:100%;border-radius:16px}.install-panel{padding:24px}.nda-panel{padding:32px 24px}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `

<!-- ═══ NDA GATE ═══ -->
<div class="nda-gate" id="ndaGate">
<div class="nda-panel">
<div class="nda-shield">
<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10" stroke-width="2"/></svg>
</div>
<h1><span>Confidential</span> Client Portal</h1>
<p class="nda-sub">You're entering a secure, NDA-protected environment. All dashboard configurations, financial data, and company information shared here are treated as strictly confidential.</p>

<div class="nda-terms">
<h4>FinanceOS Mutual Non-Disclosure Agreement</h4>
<p><strong>1. Confidential Information.</strong> "Confidential Information" includes all financial data, dashboard configurations, pricing terms, business metrics, proprietary algorithms, and any information marked or reasonably understood to be confidential that is disclosed by either party during this engagement.</p>
<p style="margin-top:8px"><strong>2. Obligations.</strong> Each party agrees to: (a) hold Confidential Information in strict confidence; (b) not disclose it to any third party without prior written consent; (c) use it solely for the purpose of evaluating and implementing FinanceOS Command Center solutions; (d) protect it with the same degree of care used for its own confidential information.</p>
<p style="margin-top:8px"><strong>3. Data Security.</strong> FinanceOS maintains SOC 2 Type II compliance, encrypts all data at rest (AES-256) and in transit (TLS 1.3), and provides isolated tenant environments with no cross-customer data access. All dashboard instances are deployed on dedicated infrastructure.</p>
<p style="margin-top:8px"><strong>4. Duration.</strong> This NDA remains in effect for 3 years from the date of acceptance or until the Confidential Information no longer qualifies as confidential, whichever is longer.</p>
<p style="margin-top:8px"><strong>5. Exclusions.</strong> Information that is (a) publicly available, (b) independently developed, (c) received from a third party without restriction, or (d) required to be disclosed by law is excluded from this agreement.</p>
</div>

<label class="nda-check" onclick="document.getElementById('ndaAccept').checked=!document.getElementById('ndaAccept').checked;toggleNdaBtn()">
<input type="checkbox" id="ndaAccept" onclick="event.stopPropagation();toggleNdaBtn()">
<span>
I have read and agree to the FinanceOS Mutual NDA. I understand that all information shared in this portal is confidential.
<span class="nda-small">By proceeding, a timestamped NDA record is created for your account.</span>
</span>
</label>

<button class="nda-enter-btn" id="ndaEnterBtn" onclick="enterPortal()">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
Enter Secure Portal
</button>

<div class="nda-security">
<div class="sec-item"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>End-to-end encrypted</div>
<div class="sec-item"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>SOC 2 Type II</div>
<div class="sec-item"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>3-year NDA term</div>
<div class="sec-item"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Isolated tenants</div>
</div>
</div>
</div>

<!-- ═══ MAIN CONTENT (hidden until NDA accepted) ═══ -->
<div class="main-content" id="mainContent">

<!-- ═══ TOP NAV ═══ -->
<nav class="topnav">
<div class="topnav-logo">
<svg viewBox="0 0 28 28" fill="none"><rect x="2" y="2" width="24" height="24" rx="6" stroke="url(#g1)" stroke-width="2"/><path d="M8 18V12M12 18V10M16 18V14M20 18V8" stroke="url(#g1)" stroke-width="2" stroke-linecap="round"/><defs><linearGradient id="g1" x1="0" y1="0" x2="28" y2="28"><stop stop-color="#5b9cf5"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs></svg>
<span>FinanceOS</span>
</div>
<div class="topnav-actions">
<span class="tier-badge growth" id="currentTier">Growth Plan</span>
<button class="btn btn-ghost btn-sm" onclick="toggleTierSelector()">Change Plan</button>
<button class="btn btn-primary btn-sm">My Dashboards</button>
</div>
</nav>

<!-- ═══ HERO ═══ -->
<div class="hero">
<h1>Choose Your <span>Command Center</span></h1>
<p>Production-ready CFO dashboards built for every finance function. Preview, customize, and request a private install link — delivered to your inbox after review.</p>
<div style="display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:20px;background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);margin-bottom:20px">
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
<span style="font-size:12px;font-weight:600;color:var(--green)">NDA-Protected Environment</span>
<span style="font-size:11px;color:var(--muted)">· SOC 2 Type II · AES-256 Encrypted</span>
</div>
<div class="hero-stats">
<div class="hero-stat"><div class="num">18</div><div class="label">Templates</div></div>
<div class="hero-stat"><div class="num">&lt;24h</div><div class="label">Link Delivery</div></div>
<div class="hero-stat"><div class="num">1:1</div><div class="label">Onboarding Call</div></div>
</div>
</div>

<!-- ═══ FILTERS ═══ -->
<div class="filters">
<div class="filter-row">
<div class="filter-group">
<span class="filter-label">Category</span>
<button class="filter-chip active" onclick="filterBy('all',this)">All</button>
<button class="filter-chip" onclick="filterBy('executive',this)">Executive</button>
<button class="filter-chip" onclick="filterBy('treasury',this)">Treasury</button>
<button class="filter-chip" onclick="filterBy('fpna',this)">FP&A</button>
<button class="filter-chip" onclick="filterBy('portfolio',this)">Portfolio</button>
<button class="filter-chip" onclick="filterBy('startup',this)">Startup</button>
</div>
<div class="filter-group">
<span class="filter-label">Tier</span>
<button class="filter-chip" onclick="filterTier('free',this)">Free</button>
<button class="filter-chip" onclick="filterTier('growth',this)">Growth+</button>
<button class="filter-chip" onclick="filterTier('business',this)">Business+</button>
</div>
<div class="search-box">
<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
<input type="text" placeholder="Search templates..." oninput="searchTemplates(this.value)">
</div>
</div>
</div>

<!-- ═══ TEMPLATE GALLERY ═══ -->
<div class="gallery">

<!-- ── FEATURED ── -->
<div class="cat-header">
<div class="cat-title">Featured Templates <span class="cat-count">· 6 templates</span></div>
<div class="cat-link">View all <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>
</div>

<div class="gallery-grid" id="templateGrid">

<!-- CARD 1: Executive Command Center -->
<div class="tpl-card" data-cat="executive" data-tier="starter" onclick="openModal('exec')">
<div class="tpl-preview">
<div class="dash-preview dash-exec">
<div class="topbar"><div class="dot"></div><div class="dot" style="opacity:.3"></div><div class="dot" style="opacity:.2"></div><div class="bar"></div></div>
<div class="kpi"><div class="val">$4.2M</div><div class="lbl">REVENUE</div></div>
<div class="kpi"><div class="val" style="color:var(--green)">68%</div><div class="lbl">MARGIN</div></div>
<div class="kpi"><div class="val" style="color:var(--amber)">$1.8M</div><div class="lbl">PIPELINE</div></div>
<div class="kpi"><div class="val" style="color:var(--purple)">142</div><div class="lbl">CLIENTS</div></div>
<div class="chart-area"></div>
<div class="table-area"><div class="trow"></div><div class="trow"></div><div class="trow"></div><div class="trow"></div><div class="trow"></div></div>
</div>
<div class="tpl-badges">
<span class="tpl-badge popular">Popular</span>
<span class="tpl-badge free">Free</span>
</div>
<div class="tpl-overlay"><div style="display:flex;flex-direction:column;align-items:center;gap:8px"><button class="btn btn-primary btn-sm">Preview & Customize</button><span style="font-size:9px;color:var(--muted);display:flex;align-items:center;gap:4px"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>NDA protected</span></div></div>
</div>
<div class="tpl-body">
<div class="tpl-name">Executive Command Center</div>
<div class="tpl-desc">Full C-suite dashboard with KPI grid, revenue trending, P&L waterfall, and real-time consolidation. The default starting point for most teams.</div>
<div class="tpl-meta">
<div class="tpl-modules"><span class="tpl-module">KPIs</span><span class="tpl-module">P&L</span><span class="tpl-module">Revenue</span><span class="tpl-module">AI</span></div>
<div class="tpl-rating">★★★★★ <span>4.9</span></div>
</div>
<button class="install-btn" onclick="event.stopPropagation();startInstall('exec')">
<svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
Request Access
<span class="shimmer"></span>
</button>
</div>
</div>

<!-- CARD 2: CFO Glass Dashboard -->
<div class="tpl-card" data-cat="executive" data-tier="growth" onclick="openModal('glass')">
<div class="tpl-preview">
<div class="dash-preview dash-glass">
<div class="sidebar">
<div class="nav-item active"></div>
<div class="nav-item"></div>
<div class="nav-item"></div>
<div class="nav-item"></div>
<div class="nav-item" style="margin-top:auto"></div>
</div>
<div class="main">
<div class="gcard"><div class="gval">$12.4M</div><div class="glbl">ARR</div></div>
<div class="gcard"><div class="gval" style="color:var(--green)">124%</div><div class="glbl">NRR</div></div>
<div class="gcard"><div class="gval" style="color:var(--pink)">18mo</div><div class="glbl">RUNWAY</div></div>
<div class="wide"></div>
</div>
</div>
<div class="tpl-badges"><span class="tpl-badge new">New</span></div>
<div class="tpl-tier-lock" style="background:rgba(52,211,153,.15);color:var(--green);border:1px solid rgba(52,211,153,.2)">
<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4" fill="none"/></svg>
Growth+
</div>
<div class="tpl-overlay"><div style="display:flex;flex-direction:column;align-items:center;gap:8px"><button class="btn btn-primary btn-sm">Preview & Customize</button><span style="font-size:9px;color:var(--muted);display:flex;align-items:center;gap:4px"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>NDA protected</span></div></div>
</div>
<div class="tpl-body">
<div class="tpl-name">CFO Glass Dashboard</div>
<div class="tpl-desc">Glassmorphism design with frosted panels, sidebar nav, and a clean layout optimized for board presentations and investor updates.</div>
<div class="tpl-meta">
<div class="tpl-modules"><span class="tpl-module">KPIs</span><span class="tpl-module">Runway</span><span class="tpl-module">Board</span></div>
<div class="tpl-rating">★★★★★ <span>4.8</span></div>
</div>
<button class="install-btn" onclick="event.stopPropagation();startInstall('glass')">
<svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
Request Access
<span class="shimmer"></span>
</button>
</div>
</div>

<!-- CARD 3: Treasury & Cash -->
<div class="tpl-card" data-cat="treasury" data-tier="growth" onclick="openModal('treasury')">
<div class="tpl-preview">
<div class="dash-preview dash-neon">
<div class="ntop"><div class="circ"></div><div class="nbar"></div><div class="nbar" style="width:60%"></div></div>
<div class="nchart"></div>
<div class="nlist"><div class="nrow"></div><div class="nrow"></div><div class="nrow"></div><div class="nrow"></div><div class="nrow"></div></div>
<div class="ngauge"><div class="ring"></div><div class="glbl">LIQUIDITY</div></div>
<div class="nkpis">
<div class="nkpi"><div class="nv">$8.2M</div><div class="nl">CASH</div></div>
<div class="nkpi"><div class="nv">94d</div><div class="nl">DSO</div></div>
<div class="nkpi"><div class="nv">$2.1M</div><div class="nl">AR</div></div>
<div class="nkpi"><div class="nv">1.8x</div><div class="nl">RATIO</div></div>
</div>
</div>
<div class="tpl-badges"><span class="tpl-badge popular">Popular</span></div>
<div class="tpl-tier-lock" style="background:rgba(52,211,153,.15);color:var(--green);border:1px solid rgba(52,211,153,.2)">
<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4" fill="none"/></svg>
Growth+
</div>
<div class="tpl-overlay"><div style="display:flex;flex-direction:column;align-items:center;gap:8px"><button class="btn btn-primary btn-sm">Preview & Customize</button><span style="font-size:9px;color:var(--muted);display:flex;align-items:center;gap:4px"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>NDA protected</span></div></div>
</div>
<div class="tpl-body">
<div class="tpl-name">Treasury & Cash Flow</div>
<div class="tpl-desc">Real-time cash position, 13-week rolling forecast, bank account monitoring, DSO/DPO tracking, and liquidity ratio gauges.</div>
<div class="tpl-meta">
<div class="tpl-modules"><span class="tpl-module">Cash</span><span class="tpl-module">AR/AP</span><span class="tpl-module">Forecast</span><span class="tpl-module">Banks</span></div>
<div class="tpl-rating">★★★★★ <span>4.9</span></div>
</div>
<button class="install-btn" onclick="event.stopPropagation();startInstall('treasury')">
<svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
Request Access
<span class="shimmer"></span>
</button>
</div>
</div>

<!-- CARD 4: Multi-Entity Consolidation -->
<div class="tpl-card" data-cat="fpna" data-tier="business" onclick="openModal('multi')">
<div class="tpl-preview">
<div class="dash-preview dash-multi">
<div class="mtabs">
<div class="mtab active">CONSOL</div>
<div class="mtab">US</div>
<div class="mtab">EMEA</div>
<div class="mtab">APAC</div>
<div class="mtab">LATAM</div>
</div>
<div class="mkpis">
<div class="mkpi"><div class="mv">$42M</div><div class="ml">REVENUE</div></div>
<div class="mkpi"><div class="mv">$28M</div><div class="ml">GROSS</div></div>
<div class="mkpi"><div class="mv">67%</div><div class="ml">GM</div></div>
<div class="mkpi"><div class="mv">$8.4M</div><div class="ml">EBITDA</div></div>
<div class="mkpi"><div class="mv">20%</div><div class="ml">MARGIN</div></div>
</div>
<div class="mchart"></div>
</div>
<div class="tpl-badges"><span class="tpl-badge premium">Premium</span></div>
<div class="tpl-tier-lock" style="background:rgba(251,191,36,.15);color:var(--amber);border:1px solid rgba(251,191,36,.2)">
<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4" fill="none"/></svg>
Business+
</div>
<div class="tpl-overlay"><div style="display:flex;flex-direction:column;align-items:center;gap:8px"><button class="btn btn-primary btn-sm">Preview & Customize</button><span style="font-size:9px;color:var(--muted);display:flex;align-items:center;gap:4px"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>NDA protected</span></div></div>
</div>
<div class="tpl-body">
<div class="tpl-name">Multi-Entity Consolidation</div>
<div class="tpl-desc">Entity-switching tabs, intercompany eliminations, currency translation, and consolidated P&L/BS with drill-down by region or subsidiary.</div>
<div class="tpl-meta">
<div class="tpl-modules"><span class="tpl-module">Consol</span><span class="tpl-module">FX</span><span class="tpl-module">Elim</span><span class="tpl-module">Drill</span></div>
<div class="tpl-rating">★★★★★ <span>5.0</span></div>
</div>
<button class="install-btn locked-btn" onclick="event.stopPropagation();startInstall('multi')">
<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
Business Plan Required
<span class="limited-tag">LIMITED</span>
<span class="shimmer"></span>
</button>
</div>
</div>

<!-- CARD 5: Startup Metrics -->
<div class="tpl-card" data-cat="startup" data-tier="starter" onclick="openModal('startup')">
<div class="tpl-preview">
<div class="dash-preview dash-minimal">
<div class="mcard"><div class="mcv">$1.2M</div><div class="mcl">MRR</div></div>
<div class="mcard"><div class="mcv" style="color:var(--accent)">124%</div><div class="mcl">NRR</div></div>
<div class="mcard"><div class="mcv" style="color:var(--amber)">14mo</div><div class="mcl">RUNWAY</div></div>
<div class="mcard wide"></div>
</div>
<div class="tpl-badges">
<span class="tpl-badge popular">Popular</span>
<span class="tpl-badge free">Free</span>
</div>
<div class="tpl-overlay"><div style="display:flex;flex-direction:column;align-items:center;gap:8px"><button class="btn btn-primary btn-sm">Preview & Customize</button><span style="font-size:9px;color:var(--muted);display:flex;align-items:center;gap:4px"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>NDA protected</span></div></div>
</div>
<div class="tpl-body">
<div class="tpl-name">Startup Metrics Dashboard</div>
<div class="tpl-desc">MRR/ARR, burn rate, runway, CAC/LTV, churn analysis, and cohort retention. Built for Series A-C finance teams and investor reporting.</div>
<div class="tpl-meta">
<div class="tpl-modules"><span class="tpl-module">SaaS</span><span class="tpl-module">Burn</span><span class="tpl-module">Cohort</span></div>
<div class="tpl-rating">★★★★★ <span>4.7</span></div>
</div>
<button class="install-btn" onclick="event.stopPropagation();startInstall('startup')">
<svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
Request Access
<span class="shimmer"></span>
</button>
</div>
</div>

<!-- CARD 6: PE/VC Portfolio -->
<div class="tpl-card" data-cat="portfolio" data-tier="business" onclick="openModal('pe')">
<div class="tpl-preview">
<div class="dash-preview dash-pe">
<div class="petop"><div class="pdot"></div><div class="pbar"></div><div class="pbar" style="width:40%"></div></div>
<div class="pecard"><div class="pv">$840M</div><div class="pl">AUM</div></div>
<div class="pecard"><div class="pv" style="color:var(--green)">2.4x</div><div class="pl">MOIC</div></div>
<div class="pecard"><div class="pv" style="color:var(--amber)">28%</div><div class="pl">IRR</div></div>
<div class="pwide"><div class="pbar-v"></div><div class="pbar-v"></div><div class="pbar-v"></div><div class="pbar-v"></div><div class="pbar-v"></div><div class="pbar-v"></div></div>
</div>
<div class="tpl-badges"><span class="tpl-badge premium">Premium</span></div>
<div class="tpl-tier-lock" style="background:rgba(251,191,36,.15);color:var(--amber);border:1px solid rgba(251,191,36,.2)">
<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4" fill="none"/></svg>
Business+
</div>
<div class="tpl-overlay"><div style="display:flex;flex-direction:column;align-items:center;gap:8px"><button class="btn btn-primary btn-sm">Preview & Customize</button><span style="font-size:9px;color:var(--muted);display:flex;align-items:center;gap:4px"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>NDA protected</span></div></div>
</div>
<div class="tpl-body">
<div class="tpl-name">PE / VC Portfolio View</div>
<div class="tpl-desc">Fund-level AUM, MOIC, IRR, DPI tracking across portfolio companies. Vintage year analysis, capital calls, and LP reporting modules.</div>
<div class="tpl-meta">
<div class="tpl-modules"><span class="tpl-module">Fund</span><span class="tpl-module">IRR</span><span class="tpl-module">LP</span><span class="tpl-module">Vintage</span></div>
<div class="tpl-rating">★★★★★ <span>4.8</span></div>
</div>
<button class="install-btn locked-btn" onclick="event.stopPropagation();startInstall('pe')">
<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
Business Plan Required
<span class="limited-tag">LIMITED</span>
<span class="shimmer"></span>
</button>
</div>
</div>

</div><!-- /gallery-grid -->

<!-- ── MORE TEMPLATES (collapsed) ── -->
<div class="cat-header">
<div class="cat-title">Industry-Specific <span class="cat-count">· 6 more</span></div>
<div class="cat-link" onclick="this.closest('.gallery').querySelector('.more-grid').classList.toggle('hidden')">Show all <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></div>
</div>

<div class="gallery-grid more-grid hidden" style="display:none" id="moreGrid">
<!-- Placeholder cards for additional templates -->
<div class="tpl-card" data-cat="fpna" data-tier="growth" style="pointer-events:none;opacity:.6">
<div class="tpl-preview" style="height:180px;background:linear-gradient(135deg,#101828,#1a1040);display:flex;align-items:center;justify-content:center">
<div style="text-align:center"><div style="font-size:32px;margin-bottom:8px">🏥</div><div style="font-size:13px;font-weight:600">Healthcare FP&A</div><div style="font-size:11px;color:var(--muted)">Coming Q2 2026</div></div>
</div>
<div class="tpl-body"><div class="tpl-name">Healthcare Revenue Cycle</div><div class="tpl-desc">Revenue cycle management, payer mix analysis, denial tracking, and reimbursement forecasting for health systems.</div></div>
</div>
<div class="tpl-card" data-cat="fpna" data-tier="growth" style="pointer-events:none;opacity:.6">
<div class="tpl-preview" style="height:180px;background:linear-gradient(135deg,#0c1820,#0a1a18);display:flex;align-items:center;justify-content:center">
<div style="text-align:center"><div style="font-size:32px;margin-bottom:8px">🏗️</div><div style="font-size:13px;font-weight:600">Real Estate</div><div style="font-size:11px;color:var(--muted)">Coming Q2 2026</div></div>
</div>
<div class="tpl-body"><div class="tpl-name">Real Estate Portfolio</div><div class="tpl-desc">NOI by property, occupancy rates, lease expirations, cap rate analysis, and development pipeline tracking.</div></div>
</div>
<div class="tpl-card" data-cat="fpna" data-tier="growth" style="pointer-events:none;opacity:.6">
<div class="tpl-preview" style="height:180px;background:linear-gradient(135deg,#18100c,#1a140a);display:flex;align-items:center;justify-content:center">
<div style="text-align:center"><div style="font-size:32px;margin-bottom:8px">🏭</div><div style="font-size:13px;font-weight:600">Manufacturing</div><div style="font-size:11px;color:var(--muted)">Coming Q3 2026</div></div>
</div>
<div class="tpl-body"><div class="tpl-name">Manufacturing Cost Center</div><div class="tpl-desc">COGS breakdown, production variance, BOM analysis, inventory turns, and capacity planning with shift-level granularity.</div></div>
</div>
</div>

<!-- ═══ CTA: REQUEST / BUILD YOUR OWN ═══ -->
<div class="cta-section">
<h2>Need something built from scratch?</h2>
<p>Our Architect plan pairs you with a dedicated Finance Architect for a 6-month engagement. Every dashboard, KPI, and integration is custom-designed around your business. Pricing is scoped per client.</p>
<div style="display:flex;justify-content:center;gap:24px;margin-bottom:24px;flex-wrap:wrap">
<div style="text-align:center">
<div style="font-size:24px;font-weight:800;color:var(--purple)">6 months</div>
<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Build Engagement</div>
</div>
<div style="text-align:center">
<div style="font-size:24px;font-weight:800;color:var(--purple)">1:1</div>
<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Dedicated Architect</div>
</div>
<div style="text-align:center">
<div style="font-size:24px;font-weight:800;color:var(--purple)">Custom</div>
<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Client-Scoped Pricing</div>
</div>
</div>
<div class="cta-pills">
<button class="btn btn-primary" onclick="openModal('custom')">Join the Waitlist</button>
<button class="btn btn-ghost">Schedule a Scoping Call</button>
</div>
<div style="margin-top:16px;font-size:12px;color:var(--muted)">Currently onboarding Q2 2026 cohort · Limited to 10 clients per quarter</div>
</div>

</div><!-- /gallery -->

<!-- ═══ DETAIL MODAL ═══ -->
<div class="modal-backdrop" id="modalBackdrop" onclick="if(event.target===this)closeModal()">
<div class="modal" id="modalContent">
<div class="modal-header">
<div class="modal-close" onclick="closeModal()">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
</div>
<div class="modal-preview" id="modalPreview"></div>
<div class="modal-title" id="modalTitle">Executive Command Center</div>
<div class="modal-subtitle" id="modalSubtitle">Full C-suite dashboard with KPI grid, revenue trending, and real-time consolidation.</div>
</div>

<div class="modal-body">
<!-- Module inventory -->
<div style="margin-bottom:24px">
<div style="font-size:14px;font-weight:700;margin-bottom:12px">Included Modules</div>
<div id="modalModules" style="display:flex;flex-wrap:wrap;gap:8px"></div>
</div>

<!-- Customizer -->
<div style="font-size:14px;font-weight:700;margin-bottom:16px">Customize Your Template</div>
<div class="customizer">
<!-- Brand Colors -->
<div class="custom-section">
<h4><svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><circle cx="8.5" cy="15.5" r="2.5"/><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c.55 0 1-.45 1-1v-1.5c0-.28.22-.5.5-.5.17 0 .32.08.42.2.13.12.18.3.13.48A8 8 0 0 1 12 20a8 8 0 0 1 0-16c4.42 0 8 3.58 8 8 0 .55-.45 1-1 1h-1.5c-.28 0-.5-.22-.5-.5 0-.17.08-.32.2-.42A3.5 3.5 0 0 0 18 9.5a6 6 0 0 0-12 0" fill="none"/></svg> Brand Colors</h4>
<div class="color-grid">
<div class="color-swatch selected" style="background:linear-gradient(135deg,#5b9cf5,#4a8be4)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#a78bfa,#8b6fe8)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#34d399,#28b886)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#f472b6,#e05da0)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#22d3ee,#1ab8d0)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#fbbf24,#e5a912)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#818cf8,#6b78e8)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#f87171,#e55b5b)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#fb923c,#e57d28)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#c084fc,#a86dea)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#2dd4bf,#20bfa8)" onclick="selectColor(this)"></div>
<div class="color-swatch" style="background:linear-gradient(135deg,#e2e8f0,#cbd5e1)" onclick="selectColor(this)"></div>
</div>
<div style="margin-top:14px;display:flex;align-items:center;gap:8px">
<div style="font-size:12px;color:var(--dim)">Custom hex:</div>
<input type="text" value="#5b9cf5" style="width:90px;padding:6px 10px;border-radius:8px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:12px;font-family:monospace">
</div>
</div>

<!-- Modules -->
<div class="custom-section">
<h4><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Modules</h4>
<div class="module-toggle">
<div><div class="mod-name">AI Copilot</div><div class="mod-desc">Natural language queries on your data</div></div>
<div class="toggle on" onclick="this.classList.toggle('on')"></div>
</div>
<div class="module-toggle">
<div><div class="mod-name">Scenario Modeling</div><div class="mod-desc">What-if analysis with Monte Carlo</div></div>
<div class="toggle on" onclick="this.classList.toggle('on')"></div>
</div>
<div class="module-toggle">
<div><div class="mod-name">Budget vs Actual</div><div class="mod-desc">Variance analysis by department</div></div>
<div class="toggle on" onclick="this.classList.toggle('on')"></div>
</div>
<div class="module-toggle">
<div><div class="mod-name">Cash Flow Forecast</div><div class="mod-desc">13-week rolling projection</div></div>
<div class="toggle" onclick="this.classList.toggle('on')"></div>
</div>
<div class="module-toggle">
<div><div class="mod-name">Board Reporting</div><div class="mod-desc">Auto-generate board deck data</div></div>
<div class="toggle" onclick="this.classList.toggle('on')"></div>
</div>
<div class="module-toggle">
<div><div class="mod-name">Audit Trail</div><div class="mod-desc">SOX-compliant change logging</div></div>
<div class="toggle" onclick="this.classList.toggle('on')"></div>
</div>
</div>
</div>

<!-- Logo upload zone -->
<div style="margin-top:20px;padding:20px;border:2px dashed var(--border);border-radius:var(--radius);text-align:center;cursor:pointer;transition:border-color .2s" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2" style="margin-bottom:8px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
<div style="font-size:13px;font-weight:600;color:var(--text)">Upload Your Logo</div>
<div style="font-size:11px;color:var(--muted);margin-top:4px">SVG, PNG or JPG — max 2MB</div>
</div>
</div>

<!-- Deploy bar -->
<div class="deploy-bar">
<div class="deploy-price">
<div>
<span class="amount" id="deployPrice" style="font-size:16px">By invitation only</span>
<span class="period" id="deployPeriod" style="display:block;margin-top:2px">Private install link sent after review</span>
<span style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--green);margin-top:4px"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>NDA-protected · SOC 2 · AES-256</span>
</div>
</div>
<div class="deploy-actions">
<button class="btn btn-ghost btn-sm">Save Preferences</button>
<button class="btn btn-primary" id="deployBtn" style="padding:12px 32px;font-size:15px" onclick="startInstall(currentTemplateId)">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
Request Private Access
</button>
</div>
</div>
</div>
</div>



</div><!-- /main-content -->

<!-- ═══ CONSULTATION MODAL (outside main-content so it overlays the NDA gate too) ═══ -->
<div class="install-pipeline" id="installPipeline" onclick="if(event.target===this && !installRunning)closeInstall()">
<div class="install-panel" id="installPanel"></div>
</div>
` }} />
    </>
  );
}
