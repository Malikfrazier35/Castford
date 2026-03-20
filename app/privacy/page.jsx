"use client";

export default function PrivacyPage() {
  const effective = "March 20, 2026";
  const h2 = { fontSize: 22, fontWeight: 800, color: "#f0f2f5", letterSpacing: "-0.02em", marginTop: 48, marginBottom: 12 };
  const h3 = { fontSize: 16, fontWeight: 700, color: "#d1d5e0", marginTop: 28, marginBottom: 8 };
  const p = { fontSize: 14, color: "#8b92a5", lineHeight: 1.85, marginBottom: 16 };
  const li = { fontSize: 14, color: "#8b92a5", lineHeight: 1.85, marginBottom: 6 };
  const td = { padding: "10px 16px", fontSize: 13, color: "#8b92a5", borderBottom: "1px solid #1e2230" };
  const th = { padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#3d4558", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #1e2230", textAlign: "left" };

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#f0f2f5", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40, paddingBottom: 28, borderBottom: "1px solid #1e2230" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "#60a5fa", textDecoration: "none", marginBottom: 20 }}>← Back to FinanceOS</a>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: "#3d4558" }}>Effective: {effective} · Financial Holding LLC</p>
        </div>

        <p style={p}>Financial Holding LLC ("Company," "we," "us," or "our") operates FinanceOS, a cloud-based financial planning and analysis platform. This Privacy Policy explains how we collect, use, store, and protect your information when you use our Service at finance-os.app.</p>

        <div style={h2}>1. Information We Collect</div>

        <div style={h3}>1.1 Account Information</div>
        <p style={p}>When you create an account, we collect your full name and email address. If you sign in through Apple or Google OAuth, we receive the profile information you authorize those providers to share (typically name and email). We store only the minimum metadata needed for authentication — your full name is stored in your JWT profile, and company name and role are collected during onboarding and stored server-side.</p>

        <div style={h3}>1.2 Financial Data (Customer Data)</div>
        <p style={p}>When you use the Service, you may upload or connect financial data including revenue figures, expense reports, budget forecasts, headcount data, and other financial metrics from your ERP, CRM, or billing systems. This data is stored in your isolated tenant within our Supabase database and is never shared with other customers or third parties.</p>

        <div style={h3}>1.3 AI Copilot Interactions</div>
        <p style={p}>When you use the AI Copilot, your prompts and relevant financial context are sent to Anthropic's Claude API for natural language processing. Anthropic processes this data subject to their API Terms of Service. We store your prompts and AI responses in your tenant for conversation history. Anthropic does not use API inputs or outputs to train their models.</p>

        <div style={h3}>1.4 Usage & Analytics Data</div>
        <p style={p}>We use Plausible Analytics, a privacy-first analytics tool that does not use cookies and does not collect personal data. Plausible collects aggregate page views, referral sources, browser types, and device types. No individual user tracking occurs. We also log authentication events, integration connection/disconnection events, and error events in our audit log for security and debugging purposes.</p>

        <div style={h3}>1.5 Payment Information</div>
        <p style={p}>Payment processing is handled entirely by Stripe, Inc. We do not store, process, or have access to your full credit card number, CVV, or bank account details. Stripe provides us with the last four digits of your card and billing email for invoice display purposes only.</p>

        <div style={h2}>2. How We Use Your Information</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, border: "1px solid #1e2230", borderRadius: 12, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#111318" }}>
              <th style={th}>Data Type</th>
              <th style={th}>Purpose</th>
              <th style={th}>Legal Basis</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={td}>Account info</td><td style={td}>Authentication, account management</td><td style={td}>Contract performance</td></tr>
            <tr><td style={td}>Financial data</td><td style={td}>Providing the FP&A Service</td><td style={td}>Contract performance</td></tr>
            <tr><td style={td}>AI interactions</td><td style={td}>Natural language analysis, conversation history</td><td style={td}>Contract performance</td></tr>
            <tr><td style={td}>Usage analytics</td><td style={td}>Improving the Service (aggregate only)</td><td style={td}>Legitimate interest</td></tr>
            <tr><td style={td}>Payment data</td><td style={td}>Billing and subscription management</td><td style={td}>Contract performance</td></tr>
            <tr><td style={td}>Audit logs</td><td style={td}>Security monitoring, debugging</td><td style={td}>Legitimate interest</td></tr>
          </tbody>
        </table>

        <div style={h2}>3. Third-Party Services</div>
        <p style={p}>We share data with the following third-party services, only to the extent necessary to operate the Service:</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, border: "1px solid #1e2230", borderRadius: 12, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#111318" }}>
              <th style={th}>Provider</th>
              <th style={th}>Purpose</th>
              <th style={th}>Data Shared</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={td}>Supabase</td><td style={td}>Database, authentication, Edge Functions</td><td style={td}>All Customer Data (encrypted, tenant-isolated)</td></tr>
            <tr><td style={td}>Vercel</td><td style={td}>Application hosting and edge delivery</td><td style={td}>No Customer Data (static frontend only)</td></tr>
            <tr><td style={td}>Stripe</td><td style={td}>Payment processing</td><td style={td}>Billing email, plan selection</td></tr>
            <tr><td style={td}>Anthropic</td><td style={td}>AI Copilot natural language processing</td><td style={td}>Prompts + financial context per query</td></tr>
            <tr><td style={td}>Plausible</td><td style={td}>Privacy-first analytics</td><td style={td}>Aggregate page views (no PII)</td></tr>
            <tr><td style={td}>Apple / Google</td><td style={td}>OAuth authentication</td><td style={td}>Name, email (user-authorized)</td></tr>
          </tbody>
        </table>
        <p style={p}>We do not sell, rent, or trade your personal information or Customer Data to any third parties for marketing or advertising purposes.</p>

        <div style={h2}>4. Data Storage & Security</div>

        <div style={h3}>4.1 Data Location</div>
        <p style={p}>Your data is stored in Supabase's US-East (Virginia) region. All data is encrypted at rest using AES-256 and in transit using TLS 1.3.</p>

        <div style={h3}>4.2 Tenant Isolation</div>
        <p style={p}>Every database query is scoped to your organization using Supabase Row-Level Security (RLS) policies. There are 17 RLS policies across 5 tables ensuring zero cross-tenant data access. Your data is logically isolated from all other customers at the database level.</p>

        <div style={h3}>4.3 Security Headers</div>
        <p style={p}>The application implements Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), X-Frame-Options, X-Content-Type-Options, and Referrer-Policy headers. All cookies are set with Secure, HttpOnly, and SameSite attributes.</p>

        <div style={h3}>4.4 Access Controls</div>
        <p style={p}>Authentication is handled through Supabase Auth with support for email/password, Apple Sign In, Google Sign In, and GitHub OAuth. All API calls to Edge Functions require a valid JWT token. Server-side functions use the Supabase service role key, which is never exposed to the client.</p>

        <div style={h2}>5. Data Retention</div>
        <ul>
          <li style={li}><strong style={{ color: "#f0f2f5" }}>Active accounts:</strong> Customer Data is retained for the duration of your subscription.</li>
          <li style={li}><strong style={{ color: "#f0f2f5" }}>Cancelled accounts:</strong> Customer Data is retained for 90 days after cancellation, then permanently deleted including all backups.</li>
          <li style={li}><strong style={{ color: "#f0f2f5" }}>Deleted accounts:</strong> Upon account deletion request, all data is permanently removed within 24 hours. A 90-day automated cleanup function runs to ensure complete removal.</li>
          <li style={li}><strong style={{ color: "#f0f2f5" }}>Waitlist submissions:</strong> Email addresses submitted via the waitlist are retained for 90 days, then automatically purged.</li>
          <li style={li}><strong style={{ color: "#f0f2f5" }}>Audit logs:</strong> Authentication and security events are retained for 12 months for security monitoring purposes.</li>
        </ul>

        <div style={h2}>6. Your Rights</div>
        <p style={p}>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
        <ul>
          <li style={li}><strong style={{ color: "#f0f2f5" }}>Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li style={li}><strong style={{ color: "#f0f2f5" }}>Correction:</strong> Request correction of inaccurate personal data.</li>
          <li style={li}><strong style={{ color: "#f0f2f5" }}>Deletion:</strong> Request deletion of your personal data and Customer Data. You can initiate this through Settings → Session → Delete Account, or by contacting us.</li>
          <li style={li}><strong style={{ color: "#f0f2f5" }}>Data Portability:</strong> Export your data in CSV format from any financial view using the Export function.</li>
          <li style={li}><strong style={{ color: "#f0f2f5" }}>Objection:</strong> Object to processing of your personal data for direct marketing (we do not engage in direct marketing using Customer Data).</li>
        </ul>
        <p style={p}>To exercise any of these rights, contact us at privacy@finance-os.app. We will respond within 30 days.</p>

        <div style={h2}>7. California Residents (CCPA)</div>
        <p style={p}>If you are a California resident, you have the right to: (a) know what personal information we collect about you; (b) request deletion of your personal information; (c) opt out of the sale of personal information — we do not sell personal information; (d) non-discrimination for exercising your CCPA rights. To exercise these rights, email privacy@finance-os.app with the subject line "CCPA Request."</p>

        <div style={h2}>8. Cookies</div>
        <p style={p}>FinanceOS uses strictly necessary cookies for authentication (Supabase auth session tokens) and user preferences (theme mode, sidebar state). We do not use advertising cookies, tracking cookies, or third-party marketing cookies. Our analytics provider (Plausible) is cookieless. You can manage cookie preferences through our cookie consent banner on first visit.</p>

        <div style={h2}>9. Children's Privacy</div>
        <p style={p}>The Service is not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will delete it promptly.</p>

        <div style={h2}>10. International Data Transfers</div>
        <p style={p}>Your data is processed and stored in the United States (Virginia). If you are accessing the Service from outside the United States, your data will be transferred to and processed in the United States. By using the Service, you consent to this transfer.</p>

        <div style={h2}>11. Changes to This Policy</div>
        <p style={p}>We may update this Privacy Policy from time to time. Material changes will be communicated via email or in-app notification at least 30 days before taking effect. The "Effective" date at the top of this page will be updated accordingly.</p>

        <div style={h2}>12. Contact Us</div>
        <p style={p}>For questions about this Privacy Policy or to exercise your data rights:</p>
        <p style={p}>Financial Holding LLC<br />Email: privacy@finance-os.app<br />Website: finance-os.app</p>
        <p style={p}>For security-related concerns, contact security@finance-os.app.</p>

        {/* Footer */}
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid #1e2230", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#3d4558" }}>
          <span>© {new Date().getFullYear()} Financial Holding LLC</span>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="/terms" style={{ color: "#3d4558", textDecoration: "none" }}>Terms of Service</a>
            <a href="/" style={{ color: "#3d4558", textDecoration: "none" }}>Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
