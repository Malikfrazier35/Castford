'use client';

import { useEffect, useRef } from 'react';

export default function V3SalesEmailAutomationPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run inline scripts after mount
    const scripts = [
      `function showTab(id){
document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
document.getElementById('tab-'+id).classList.add('active');
const map={diagnose:0,tracking:1,flow:2,sequences:3,stack:4};
if(map[id]!==undefined) document.querySelectorAll('.tab')[map[id]].classList.add('active');
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
--border:#1e2540;--text:#e2e8f0;--dim:#8892a8;--muted:#5a6380;
--accent:#5b9cf5;--green:#34d399;--red:#f87171;--amber:#fbbf24;--purple:#a78bfa;--pink:#f472b6;--cyan:#22d3ee;
--radius:12px;--shadow:0 4px 24px rgba(0,0,0,.4);--ease:cubic-bezier(.4,0,.2,1);
}
body{font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
.container{max-width:1300px;margin:0 auto;padding:32px 24px}
.header{text-align:center;padding:40px 0 48px}
.header h1{font-size:32px;font-weight:800;margin-bottom:8px}
.header h1 span{background:linear-gradient(135deg,var(--accent),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.header p{color:var(--dim);font-size:15px}
.section{margin-bottom:48px}
.section-title{font-size:20px;font-weight:700;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.section-title svg{width:22px;height:22px;stroke:var(--accent);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow)}
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
.badge-blue{background:rgba(91,156,245,.12);color:var(--accent)}
.badge-green{background:rgba(52,211,153,.12);color:var(--green)}
.badge-red{background:rgba(248,113,113,.12);color:var(--red)}
.badge-amber{background:rgba(251,191,36,.12);color:var(--amber)}
.badge-purple{background:rgba(167,139,250,.12);color:var(--purple)}

/* ── FLOW DIAGRAM ── */
.flow-container{overflow-x:auto;padding:20px 0}
.flow{display:flex;align-items:stretch;gap:0;min-width:900px}
.flow-node{flex:1;padding:20px 16px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);text-align:center;position:relative;min-width:140px;transition:all .3s var(--ease)}
.flow-node:hover{border-color:var(--accent);transform:translateY(-2px)}
.flow-node .node-icon{width:40px;height:40px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:10px}
.flow-node .node-icon svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.flow-node .node-title{font-size:13px;font-weight:600;margin-bottom:4px}
.flow-node .node-desc{font-size:11px;color:var(--dim);line-height:1.5}
.flow-arrow{display:flex;align-items:center;padding:0 4px;color:var(--muted);font-size:18px;flex-shrink:0}
.flow-arrow svg{width:20px;height:20px;stroke:var(--accent);fill:none;stroke-width:2}

/* ── EMAIL SEQUENCE ── */
.email-timeline{position:relative;padding-left:40px}
.email-timeline::before{content:'';position:absolute;left:15px;top:0;bottom:0;width:2px;background:var(--border)}
.email-item{position:relative;margin-bottom:24px;padding:20px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);transition:all .3s var(--ease)}
.email-item:hover{border-color:var(--accent);transform:translateX(4px)}
.email-item::before{content:'';position:absolute;left:-33px;top:24px;width:12px;height:12px;border-radius:50%;border:2px solid var(--accent);background:var(--bg)}
.email-item.sent::before{background:var(--green);border-color:var(--green)}
.email-item.scheduled::before{background:var(--amber);border-color:var(--amber)}
.email-item.draft::before{background:var(--muted);border-color:var(--muted)}
.email-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:8px}
.email-subject{font-size:15px;font-weight:600}
.email-meta{font-size:12px;color:var(--dim)}
.email-body{font-size:13px;color:var(--dim);line-height:1.7;margin-top:8px}
.email-cta{display:inline-flex;align-items:center;gap:6px;margin-top:12px;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600}

/* ── ISSUE CARDS ── */
.issue{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;display:flex;gap:14px;align-items:flex-start;margin-bottom:12px;transition:all .2s var(--ease)}
.issue:hover{border-color:var(--accent)}
.issue-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.issue-icon svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.issue-content{flex:1}
.issue-title{font-size:14px;font-weight:600;margin-bottom:4px}
.issue-desc{font-size:12px;color:var(--dim);line-height:1.6}
.issue-fix{font-size:12px;color:var(--green);margin-top:8px;font-weight:500}

/* ── CODE BLOCKS ── */
.code-block{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:16px;font-family:'SF Mono','Fira Code',monospace;font-size:12px;line-height:1.8;overflow-x:auto;color:var(--dim);margin:12px 0}
.code-block .comment{color:var(--muted)}
.code-block .keyword{color:var(--purple)}
.code-block .string{color:var(--green)}
.code-block .func{color:var(--accent)}
.code-block .tag{color:var(--pink)}

/* ── METRICS ── */
.metric-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center}
.metric-value{font-size:28px;font-weight:700}
.metric-label{font-size:12px;color:var(--dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.metric-change{font-size:12px;margin-top:6px;font-weight:500}

/* Tables */
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 14px;color:var(--dim);font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border)}
td{padding:10px 14px;border-bottom:1px solid rgba(30,37,64,.4)}

/* Tabs */
.tabs{display:flex;gap:4px;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto}
.tab{padding:10px 18px;cursor:pointer;font-size:13px;font-weight:500;color:var(--dim);border-bottom:2px solid transparent;transition:.2s;white-space:nowrap}
.tab:hover{color:var(--text)}
.tab.active{color:var(--accent);border-bottom-color:var(--accent)}
.tab-content{display:none}
.tab-content.active{display:block}

@media(max-width:1024px){.grid-3{grid-template-columns:repeat(2,1fr)}.flow{min-width:700px}}
@media(max-width:768px){.grid-2,.grid-3{grid-template-columns:1fr}.container{padding:20px 16px}.flow{min-width:500px;flex-wrap:wrap}.flow-arrow{display:none}.flow-node{min-width:auto}}
` }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: `
<div class="container">

<div class="header">
<h1>Email Flow & <span>Conversion Tracking</span></h1>
<p>Architecture for tracking Google Ads conversions, automating email sequences, and fixing duplicate sends</p>
</div>

<!-- Tabs -->
<div class="tabs" id="mainTabs">
<div class="tab active" onclick="showTab('diagnose')">Current Issues</div>
<div class="tab" onclick="showTab('tracking')">Conversion Tracking Setup</div>
<div class="tab" onclick="showTab('flow')">Email Automation Flow</div>
<div class="tab" onclick="showTab('sequences')">Email Sequences</div>
<div class="tab" onclick="showTab('stack')">Recommended Stack</div>
</div>

<!-- ═══ TAB 1: CURRENT ISSUES ═══ -->
<div class="tab-content active" id="tab-diagnose">
<div class="section-title">
<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
Diagnosed Issues — What's Breaking Right Now
</div>

<!-- Current performance -->
<div class="grid-3" style="margin-bottom:24px">
<div class="metric-card" style="border-left:3px solid var(--accent)">
<div class="metric-label">Impressions (7d)</div>
<div class="metric-value" style="color:var(--accent)">996</div>
<div class="metric-change" style="color:var(--green)">Ads are serving</div>
</div>
<div class="metric-card" style="border-left:3px solid var(--green)">
<div class="metric-label">Clicks (7d)</div>
<div class="metric-value" style="color:var(--green)">88</div>
<div class="metric-change">8.8% CTR — strong</div>
</div>
<div class="metric-card" style="border-left:3px solid var(--red)">
<div class="metric-label">Conversions</div>
<div class="metric-value" style="color:var(--red)">?</div>
<div class="metric-change" style="color:var(--red)">Not tracking — critical</div>
</div>
</div>

<!-- Issues -->
<div class="issue">
<div class="issue-icon" style="background:rgba(248,113,113,.15);color:var(--red)">
<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
</div>
<div class="issue-content">
<div class="issue-title">P0 — No Conversion Tracking Tag on Site</div>
<div class="issue-desc">Google Ads created a "Submit lead forms" conversion action, but the tracking tag was never added to finance-os.app. Google can't report conversions, can't optimize bidding, and your $30/day is spending blind. Performance Max relies on conversion signals to find the right audience — without them, it's guessing.</div>
<div class="issue-fix">Fix: Install the Google Ads gtag.js snippet + conversion event on your form's thank-you page or form submission handler</div>
</div>
</div>

<div class="issue">
<div class="issue-icon" style="background:rgba(248,113,113,.15);color:var(--red)">
<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
</div>
<div class="issue-content">
<div class="issue-title">P0 — Duplicate Email Sends</div>
<div class="issue-desc">Krista Lumpkin received 4-5 copies of both confirmation and welcome emails. This is likely caused by: (a) the form submit handler firing multiple times on click (no debounce), (b) the email trigger running on every page load if there's a query param, or (c) a race condition in whatever automation tool sends the emails.</div>
<div class="issue-fix">Fix: Add form submission debounce, disable the button after first click, and implement idempotency keys in your email sender</div>
</div>
</div>

<div class="issue">
<div class="issue-icon" style="background:rgba(251,191,36,.15);color:var(--amber)">
<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
</div>
<div class="issue-content">
<div class="issue-title">P1 — No Email Sequence After Signup</div>
<div class="issue-desc">After the initial confirmation + welcome, there's no nurture sequence. Leads go cold. You're paying $30/day to acquire them and then abandoning them. The 88 clicks this week generated leads that aren't being nurtured toward demo or purchase.</div>
<div class="issue-fix">Fix: Build a 7-email drip sequence over 14 days with increasing urgency and social proof</div>
</div>
</div>

<div class="issue">
<div class="issue-icon" style="background:rgba(251,191,36,.15);color:var(--amber)">
<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
</div>
<div class="issue-content">
<div class="issue-title">P1 — Final URL Expansion Turned Off</div>
<div class="issue-desc">Google is recommending you turn on Final URL expansion. This lets Performance Max dynamically route people to the most relevant landing page based on their search. With it off, everyone lands on the same page regardless of intent.</div>
<div class="issue-fix">Fix: Enable Final URL expansion in campaign settings (it's an "AI Essential")</div>
</div>
</div>

<div class="issue">
<div class="issue-icon" style="background:rgba(91,156,245,.15);color:var(--accent)">
<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
</div>
<div class="issue-content">
<div class="issue-title">P2 — No Customer Match List Uploaded</div>
<div class="issue-desc">Google recommends uploading a Customer Match list to help Performance Max find similar audiences. If you have any existing email list (beta signups, waitlist, etc.), uploading it would dramatically improve targeting quality.</div>
<div class="issue-fix">Fix: Export your signup list and upload as Customer Match in Google Ads audience manager</div>
</div>
</div>
</div>

<!-- ═══ TAB 2: CONVERSION TRACKING ═══ -->
<div class="tab-content" id="tab-tracking">
<div class="section-title">
<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
Google Ads Conversion Tracking — Implementation Guide
</div>

<div class="card" style="margin-bottom:24px">
<h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Step 1: Add the Global Site Tag (gtag.js)</h3>
<p style="font-size:13px;color:var(--dim);margin-bottom:12px">Add this to your app's &lt;head&gt; section in page.jsx or _document.jsx. Replace <code style="color:var(--accent)">AW-XXXXXXXXX</code> with your Google Ads conversion ID from your Google Ads account.</p>
<div class="code-block">
<span class="comment">&lt;!-- Google Ads Global Site Tag --&gt;</span><br>
<span class="tag">&lt;script</span> <span class="keyword">async</span> <span class="keyword">src</span>=<span class="string">"https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"</span><span class="tag">&gt;&lt;/script&gt;</span><br>
<span class="tag">&lt;script&gt;</span><br>
&nbsp;&nbsp;<span class="keyword">window</span>.dataLayer = <span class="keyword">window</span>.dataLayer || [];<br>
&nbsp;&nbsp;<span class="keyword">function</span> <span class="func">gtag</span>(){dataLayer.<span class="func">push</span>(arguments);}<br>
&nbsp;&nbsp;<span class="func">gtag</span>(<span class="string">'js'</span>, <span class="keyword">new</span> Date());<br>
&nbsp;&nbsp;<span class="func">gtag</span>(<span class="string">'config'</span>, <span class="string">'AW-XXXXXXXXX'</span>);<br>
<span class="tag">&lt;/script&gt;</span>
</div>
</div>

<div class="card" style="margin-bottom:24px">
<h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Step 2: Fire the Conversion Event on Form Submit</h3>
<p style="font-size:13px;color:var(--dim);margin-bottom:12px">In your form submit handler (the demo request form or waitlist form), fire the conversion event AFTER successful submission. Replace <code style="color:var(--accent)">AW-XXXXXXXXX/YYYYYYY</code> with your conversion label.</p>
<div class="code-block">
<span class="comment">// In your form submit handler, after successful API response:</span><br><br>
<span class="keyword">const</span> handleSubmit = <span class="keyword">async</span> (e) => {<br>
&nbsp;&nbsp;e.<span class="func">preventDefault</span>();<br><br>
&nbsp;&nbsp;<span class="comment">// Prevent duplicate submissions</span><br>
&nbsp;&nbsp;<span class="keyword">if</span> (submitting) <span class="keyword">return</span>;<br>
&nbsp;&nbsp;<span class="func">setSubmitting</span>(<span class="keyword">true</span>);<br><br>
&nbsp;&nbsp;<span class="keyword">try</span> {<br>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">const</span> res = <span class="keyword">await</span> <span class="func">fetch</span>(<span class="string">'/api/subscribe'</span>, { ... });<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span> (res.ok) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">// Fire Google Ads conversion</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="func">gtag</span>(<span class="string">'event'</span>, <span class="string">'conversion'</span>, {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">'send_to'</span>: <span class="string">'AW-XXXXXXXXX/YYYYYYY'</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">'value'</span>: 499.0,  <span class="comment">// Expected value of the lead</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">'currency'</span>: <span class="string">'USD'</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="func">setSuccess</span>(<span class="keyword">true</span>);<br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br>
&nbsp;&nbsp;} <span class="keyword">catch</span> (err) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="func">setError</span>(err.message);<br>
&nbsp;&nbsp;} <span class="keyword">finally</span> {<br>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="func">setSubmitting</span>(<span class="keyword">false</span>);<br>
&nbsp;&nbsp;}<br>
};
</div>
</div>

<div class="card" style="margin-bottom:24px">
<h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Step 3: Fix the Duplicate Email Problem</h3>
<p style="font-size:13px;color:var(--dim);margin-bottom:12px">Add idempotency to prevent duplicate form submissions from triggering multiple emails.</p>
<div class="code-block">
<span class="comment">// Client-side: disable button + debounce</span><br><br>
<span class="tag">&lt;button</span><br>
&nbsp;&nbsp;<span class="keyword">disabled</span>={submitting}<br>
&nbsp;&nbsp;<span class="keyword">onClick</span>={handleSubmit}<br>
<span class="tag">&gt;</span><br>
&nbsp;&nbsp;{submitting ? <span class="string">'Submitting...'</span> : <span class="string">'Get Started'</span>}<br>
<span class="tag">&lt;/button&gt;</span><br><br>

<span class="comment">// Server-side: check for existing email before sending</span><br><br>
<span class="keyword">export async function</span> <span class="func">POST</span>(req) {<br>
&nbsp;&nbsp;<span class="keyword">const</span> { email } = <span class="keyword">await</span> req.<span class="func">json</span>();<br><br>
&nbsp;&nbsp;<span class="comment">// Check if already submitted in last 5 minutes</span><br>
&nbsp;&nbsp;<span class="keyword">const</span> recent = <span class="keyword">await</span> db.<span class="func">query</span>(<br>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">'SELECT id FROM leads WHERE email = ? AND created_at > NOW() - INTERVAL 5 MINUTE'</span>,<br>
&nbsp;&nbsp;&nbsp;&nbsp;[email]<br>
&nbsp;&nbsp;);<br><br>
&nbsp;&nbsp;<span class="keyword">if</span> (recent.length > 0) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span> Response.<span class="func">json</span>({ ok: <span class="keyword">true</span>, <span class="string">deduplicated</span>: <span class="keyword">true</span> });<br>
&nbsp;&nbsp;}<br><br>
&nbsp;&nbsp;<span class="comment">// Insert lead + send email</span><br>
&nbsp;&nbsp;<span class="keyword">await</span> db.<span class="func">insert</span>(<span class="string">'leads'</span>, { email, source: <span class="string">'google_ads'</span> });<br>
&nbsp;&nbsp;<span class="keyword">await</span> <span class="func">sendWelcomeEmail</span>(email);<br>
}
</div>
</div>

<div class="card">
<h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Step 4: Verify the Tag is Working</h3>
<p style="font-size:13px;color:var(--dim);margin-bottom:12px">After adding the code, verify in Google Ads:</p>
<table>
<thead><tr><th>Check</th><th>Where</th><th>Expected</th></tr></thead>
<tbody>
<tr><td>Tag installed</td><td>Google Ads → Goals → Conversions → "Submit lead forms"</td><td>Status: <span class="badge badge-green">Recording</span></td></tr>
<tr><td>Tag firing</td><td>Google Tag Assistant (Chrome extension)</td><td>Conversion tag fires on form submit</td></tr>
<tr><td>Test conversion</td><td>Submit a test form on your site</td><td>Conversion appears in Google Ads within 24hr</td></tr>
<tr><td>Campaign optimizing</td><td>Performance Max → Optimization score</td><td>Score increases from 0%</td></tr>
</tbody>
</table>
</div>
</div>

<!-- ═══ TAB 3: EMAIL FLOW ═══ -->
<div class="tab-content" id="tab-flow">
<div class="section-title">
<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
Email Automation Architecture
</div>

<div class="card" style="margin-bottom:24px">
<h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Full Funnel Flow — Google Ads → Email → Conversion</h3>
<div class="flow-container">
<div class="flow">
<div class="flow-node" style="border-top:3px solid var(--accent)">
<div class="node-icon" style="background:rgba(91,156,245,.15);color:var(--accent)"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
<div class="node-title">Google Ads</div>
<div class="node-desc">Performance Max campaign. 88 clicks/wk. $30/day budget.</div>
</div>
<div class="flow-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
<div class="flow-node" style="border-top:3px solid var(--purple)">
<div class="node-icon" style="background:rgba(167,139,250,.15);color:var(--purple)"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg></div>
<div class="node-title">Landing Page</div>
<div class="node-desc">finance-os.app. Demo form or waitlist CTA.</div>
</div>
<div class="flow-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
<div class="flow-node" style="border-top:3px solid var(--green)">
<div class="node-icon" style="background:rgba(52,211,153,.15);color:var(--green)"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
<div class="node-title">Form Submit</div>
<div class="node-desc">gtag conversion fires. Lead saved to DB. Dedup check.</div>
</div>
<div class="flow-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
<div class="flow-node" style="border-top:3px solid var(--amber)">
<div class="node-icon" style="background:rgba(251,191,36,.15);color:var(--amber)"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
<div class="node-title">Email Sequence</div>
<div class="node-desc">7-email drip over 14 days. Managed by automation tool.</div>
</div>
<div class="flow-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
<div class="flow-node" style="border-top:3px solid var(--pink)">
<div class="node-icon" style="background:rgba(244,114,182,.15);color:var(--pink)"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
<div class="node-title">Demo / Trial</div>
<div class="node-desc">Book a call or start free trial. Second conversion event.</div>
</div>
<div class="flow-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
<div class="flow-node" style="border-top:3px solid var(--green)">
<div class="node-icon" style="background:rgba(52,211,153,.15);color:var(--green)"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
<div class="node-title">Paid Customer</div>
<div class="node-desc">Stripe checkout. Revenue conversion event fires.</div>
</div>
</div>
</div>
</div>

<!-- Zapier/automation architecture -->
<div class="grid-2">
<div class="card">
<h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Option A: Zapier Automation</h3>
<p style="font-size:13px;color:var(--dim);margin-bottom:16px">Use your existing Zapier integration to trigger emails. This is the fastest path since you already have Zapier connected.</p>
<table>
<tbody>
<tr><td style="font-weight:600;color:var(--accent)">Trigger</td><td>New form submission (webhook or Zapier form)</td></tr>
<tr><td style="font-weight:600;color:var(--accent)">Filter</td><td>Check if email already exists (dedup)</td></tr>
<tr><td style="font-weight:600;color:var(--accent)">Action 1</td><td>Add to Google Sheet tracker</td></tr>
<tr><td style="font-weight:600;color:var(--accent)">Action 2</td><td>Send confirmation email (Gmail/Outlook)</td></tr>
<tr><td style="font-weight:600;color:var(--accent)">Action 3</td><td>Add to email sequence (delay steps)</td></tr>
<tr><td style="font-weight:600;color:var(--accent)">Action 4</td><td>Notify Slack #leads channel</td></tr>
</tbody>
</table>
</div>
<div class="card">
<h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Option B: Resend + Supabase</h3>
<p style="font-size:13px;color:var(--dim);margin-bottom:16px">More control, better deliverability, built-in analytics. Requires more setup but scales better.</p>
<table>
<tbody>
<tr><td style="font-weight:600;color:var(--purple)">Email</td><td>Resend ($20/mo — 50K emails)</td></tr>
<tr><td style="font-weight:600;color:var(--purple)">Database</td><td>Supabase (free tier — stores leads)</td></tr>
<tr><td style="font-weight:600;color:var(--purple)">Scheduler</td><td>Supabase Edge Functions (cron for drip)</td></tr>
<tr><td style="font-weight:600;color:var(--purple)">Templates</td><td>React Email (matches FinanceOS brand)</td></tr>
<tr><td style="font-weight:600;color:var(--purple)">Analytics</td><td>Resend dashboard (opens, clicks, bounces)</td></tr>
<tr><td style="font-weight:600;color:var(--purple)">Dedup</td><td>DB constraint on email + created_at window</td></tr>
</tbody>
</table>
</div>
</div>
</div>

<!-- ═══ TAB 4: EMAIL SEQUENCES ═══ -->
<div class="tab-content" id="tab-sequences">
<div class="section-title">
<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
Email Drip Sequence — 7 Emails Over 14 Days
</div>

<div class="email-timeline">
<div class="email-item sent">
<div class="email-header">
<div class="email-subject">Email 1: Welcome + Immediate Value</div>
<div><span class="badge badge-green">Instant</span> <span class="badge badge-blue">Trigger: Form submit</span></div>
</div>
<div class="email-meta">Subject: "You're in — here's what FinanceOS does in the first 5 minutes"</div>
<div class="email-body">
Short, warm welcome. Show one specific feature (e.g., automated variance detection). Include a 30-second GIF or screenshot of the dashboard. Single CTA: "Explore the platform" or "Book a 15-min demo."
</div>
<div class="email-cta badge badge-green">CTA: Explore Platform</div>
</div>

<div class="email-item scheduled">
<div class="email-header">
<div class="email-subject">Email 2: Pain Point — Manual Close Process</div>
<div><span class="badge badge-amber">Day 2</span> <span class="badge badge-purple">Nurture</span></div>
</div>
<div class="email-meta">Subject: "Still closing books in spreadsheets? Here's the cost"</div>
<div class="email-body">
Lead with the pain: "Finance teams spend 10+ days on month-end close." Show how FinanceOS automates reconciliation. Include a stat or mini case study. CTA: Watch a 2-min walkthrough video.
</div>
<div class="email-cta badge badge-blue">CTA: Watch Walkthrough</div>
</div>

<div class="email-item scheduled">
<div class="email-header">
<div class="email-subject">Email 3: Social Proof — Who's Using It</div>
<div><span class="badge badge-amber">Day 4</span> <span class="badge badge-purple">Trust</span></div>
</div>
<div class="email-meta">Subject: "How [Company Type] cut their close time by 60%"</div>
<div class="email-body">
Customer story or use case. Focus on a specific company type (Series B SaaS, PE-backed, multi-entity). Include specific metrics: "3-day close instead of 12." CTA: See more customer stories.
</div>
<div class="email-cta badge badge-purple">CTA: Read Case Study</div>
</div>

<div class="email-item scheduled">
<div class="email-header">
<div class="email-subject">Email 4: Feature Deep-Dive — AI Copilot</div>
<div><span class="badge badge-amber">Day 7</span> <span class="badge badge-blue">Education</span></div>
</div>
<div class="email-meta">Subject: "Ask your data anything — meet the AI Copilot"</div>
<div class="email-body">
Show the AI Copilot feature. Example queries: "What's our burn rate at current run rate?" "Show me revenue by segment vs last year." Include screenshots. CTA: Try a live demo.
</div>
<div class="email-cta badge badge-green">CTA: Book Live Demo</div>
</div>

<div class="email-item scheduled">
<div class="email-header">
<div class="email-subject">Email 5: Competitor Comparison</div>
<div><span class="badge badge-amber">Day 9</span> <span class="badge badge-purple">Differentiation</span></div>
</div>
<div class="email-meta">Subject: "FinanceOS vs Anaplan — what $499/yr gets you"</div>
<div class="email-body">
Direct comparison chart: FinanceOS vs Anaplan/Planful/Adaptive. Hit on price ($499 vs $100K+), implementation time (days vs months), and ease of use. Don't trash competitors — just show the gap. CTA: Start free trial.
</div>
<div class="email-cta badge badge-blue">CTA: Start Free Trial</div>
</div>

<div class="email-item scheduled">
<div class="email-header">
<div class="email-subject">Email 6: Urgency — Limited Pricing</div>
<div><span class="badge badge-amber">Day 11</span> <span class="badge badge-red">Urgency</span></div>
</div>
<div class="email-meta">Subject: "Early adopter pricing closes [Date] — lock in $499/yr"</div>
<div class="email-body">
Create genuine urgency around early-adopter pricing. Mention the price will increase. Include a countdown or date. Remind them what they get. CTA: Lock in pricing now.
</div>
<div class="email-cta badge badge-red">CTA: Lock In Pricing</div>
</div>

<div class="email-item draft">
<div class="email-header">
<div class="email-subject">Email 7: Final — Personal Note</div>
<div><span class="badge badge-amber">Day 14</span> <span class="badge badge-purple">Personal</span></div>
</div>
<div class="email-meta">Subject: "Quick question, [First Name]"</div>
<div class="email-body">
Short, personal email from the founder/CEO. Plain text (no HTML template). Ask one question: "What's holding you back?" or "Is there a specific feature you need?" Reply-to goes to a real inbox. This converts the highest because it feels human.
</div>
<div class="email-cta badge badge-green">CTA: Just Reply</div>
</div>
</div>
</div>

<!-- ═══ TAB 5: RECOMMENDED STACK ═══ -->
<div class="tab-content" id="tab-stack">
<div class="section-title">
<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
Recommended Tech Stack
</div>

<div class="grid-3" style="margin-bottom:24px">
<div class="card" style="border-top:3px solid var(--accent)">
<div style="font-size:13px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Fastest Path (Today)</div>
<h3 style="font-size:16px;font-weight:600;margin-bottom:12px">Zapier + Gmail + Google Sheets</h3>
<div style="font-size:13px;color:var(--dim);line-height:1.8">
<div style="margin-bottom:8px">You already have Zapier connected with Google Sheets and Gmail. Wire it up:</div>
<div style="padding:4px 0">1. Form submit → Zapier webhook</div>
<div style="padding:4px 0">2. Zapier filters duplicates</div>
<div style="padding:4px 0">3. Adds to Google Sheet</div>
<div style="padding:4px 0">4. Sends welcome via Gmail</div>
<div style="padding:4px 0">5. Delay steps for drip sequence</div>
</div>
<div style="margin-top:16px"><span class="badge badge-green">Free (existing plan)</span></div>
</div>

<div class="card" style="border-top:3px solid var(--purple)">
<div style="font-size:13px;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Better (This Week)</div>
<h3 style="font-size:16px;font-weight:600;margin-bottom:12px">Resend + Supabase + React Email</h3>
<div style="font-size:13px;color:var(--dim);line-height:1.8">
<div style="margin-bottom:8px">Developer-friendly, great deliverability, branded templates:</div>
<div style="padding:4px 0">1. Form posts to API route</div>
<div style="padding:4px 0">2. Supabase stores lead + dedup</div>
<div style="padding:4px 0">3. Resend sends branded email</div>
<div style="padding:4px 0">4. Edge function cron runs drip</div>
<div style="padding:4px 0">5. Resend tracks opens/clicks</div>
</div>
<div style="margin-top:16px"><span class="badge badge-purple">~$20/mo</span></div>
</div>

<div class="card" style="border-top:3px solid var(--green)">
<div style="font-size:13px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px">Best (This Month)</div>
<h3 style="font-size:16px;font-weight:600;margin-bottom:12px">Customer.io or Loops.so</h3>
<div style="font-size:13px;color:var(--dim);line-height:1.8">
<div style="margin-bottom:8px">Purpose-built for product-led email automation:</div>
<div style="padding:4px 0">1. Visual flow builder</div>
<div style="padding:4px 0">2. Event-triggered sequences</div>
<div style="padding:4px 0">3. A/B testing on subject lines</div>
<div style="padding:4px 0">4. Behavioral segmentation</div>
<div style="padding:4px 0">5. Built-in analytics dashboard</div>
</div>
<div style="margin-top:16px"><span class="badge badge-green">$75-150/mo</span></div>
</div>
</div>

<div class="card">
<h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Priority Action Items</h3>
<table>
<thead><tr><th>Priority</th><th>Action</th><th>Time</th><th>Impact</th></tr></thead>
<tbody>
<tr><td><span class="badge badge-red">P0</span></td><td>Add Google Ads conversion tag to finance-os.app</td><td>30 min</td><td>Enables campaign optimization</td></tr>
<tr><td><span class="badge badge-red">P0</span></td><td>Fix duplicate email sends (debounce + server dedup)</td><td>1 hour</td><td>Stops spamming new leads</td></tr>
<tr><td><span class="badge badge-amber">P1</span></td><td>Build 7-email drip sequence in Zapier</td><td>3 hours</td><td>Nurtures 88+ weekly leads</td></tr>
<tr><td><span class="badge badge-amber">P1</span></td><td>Enable Final URL expansion in Google Ads</td><td>5 min</td><td>Better ad targeting (AI Essential)</td></tr>
<tr><td><span class="badge badge-blue">P2</span></td><td>Upload Customer Match list to Google Ads</td><td>30 min</td><td>Improves audience quality</td></tr>
<tr><td><span class="badge badge-blue">P2</span></td><td>Set up Resend for branded email templates</td><td>2 hours</td><td>Better deliverability + analytics</td></tr>
<tr><td><span class="badge badge-purple">P3</span></td><td>Migrate to Customer.io/Loops for full automation</td><td>1 week</td><td>A/B testing, behavioral triggers</td></tr>
</tbody>
</table>
</div>
</div>

</div><!-- /container -->


` }} />
    </>
  );
}
