"use client";

export default function TermsPage() {
  const effective = "March 20, 2026";
  const h2 = { fontSize: 22, fontWeight: 800, color: "#f0f2f5", letterSpacing: "-0.02em", marginTop: 48, marginBottom: 12 };
  const h3 = { fontSize: 16, fontWeight: 700, color: "#d1d5e0", marginTop: 28, marginBottom: 8 };
  const p = { fontSize: 14, color: "#8b92a5", lineHeight: 1.85, marginBottom: 16 };
  const li = { fontSize: 14, color: "#8b92a5", lineHeight: 1.85, marginBottom: 6 };

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#f0f2f5", fontFamily: "'Manrope', system-ui, sans-serif", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 0.5px, transparent 0.5px)", backgroundSize: "32px 32px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40, paddingBottom: 28, borderBottom: "1px solid #1e2230" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "#60a5fa", textDecoration: "none", marginBottom: 20 }}>← Back to Castford</a>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>Terms of Service</h1>
          <p style={{ fontSize: 13, color: "#3d4558" }}>Effective: {effective} · Financial Holding LLC</p>
        </div>

        <p style={p}>These Terms of Service ("Terms") govern your access to and use of Castford, a cloud-based financial planning and analysis platform operated by Financial Holding LLC ("Company," "we," "us," or "our"). By creating an account or using the Service, you agree to be bound by these Terms.</p>

        <div style={h2}>1. Definitions</div>
        <p style={p}>"Service" means the Castford web application, APIs, Edge Functions, AI Copilot, and all related services available at castford.com. "Customer Data" means all data, files, and information you or your authorized users upload, enter, or transmit through the Service. "Authorized Users" means individuals you authorize to access the Service under your account. "Subscription" means your selected pricing tier and billing arrangement.</p>

        <div style={h2}>2. Account Registration</div>
        <p style={p}>To use the Service, you must create an account with accurate information. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must notify us immediately of any unauthorized access. Accounts are available to individuals 18 years of age or older. By registering, you represent that you have authority to bind your organization to these Terms.</p>

        <div style={h2}>3. Subscriptions & Pricing</div>
        <div style={h3}>3.1 Plans</div>
        <p style={p}>We offer the following subscription tiers: Starter ($599/month or $499/month billed annually), Growth ($1,799/month or $1,499/month billed annually), Business ($4,799/month or $3,999/month billed annually), and Enterprise (custom pricing). Pricing is subject to change with 30 days' written notice.</p>

        <div style={h3}>3.2 Money-Back Guarantee</div>
        <p style={p}>All paid plans include a 30-day money-back guarantee from the date of first payment. If you are unsatisfied for any reason, contact us within 30 days for a full refund. This guarantee applies to first-time subscribers only. Annual plans receive a full refund of the first payment; monthly plans receive a full refund of the most recent charge.</p>

        <div style={h3}>3.3 Billing & Renewal</div>
        <p style={p}>Subscriptions automatically renew at the end of each billing period (monthly or annual) unless cancelled. Payments are processed through Stripe, Inc. You authorize us to charge your payment method on file for recurring subscription fees. All fees are exclusive of taxes, which you are responsible for paying.</p>

        <div style={h3}>3.4 Cancellation</div>
        <p style={p}>You may cancel your subscription at any time through the Settings page or by contacting support. Cancellation takes effect at the end of the current billing period. No partial refunds are issued for unused time outside the money-back guarantee period.</p>

        <div style={h2}>4. Customer Data</div>
        <div style={h3}>4.1 Ownership</div>
        <p style={p}>You retain all ownership rights to your Customer Data. We do not claim any intellectual property rights over data you upload or generate through the Service. We will not sell, license, or share your Customer Data with third parties except as described in our Privacy Policy or as required by law.</p>

        <div style={h3}>4.2 License to Operate</div>
        <p style={p}>You grant us a limited, non-exclusive license to access, process, and display your Customer Data solely for the purpose of providing and improving the Service. This includes processing your data through our AI Copilot feature, where your prompts and financial context are sent to Anthropic's Claude API for natural language analysis. AI-generated outputs based on your data are considered part of your Customer Data.</p>

        <div style={h3}>4.3 Data Retention</div>
        <p style={p}>Upon account cancellation, your Customer Data remains available for 90 days. After 90 days, Customer Data is permanently deleted from our systems including all backups. You may request immediate deletion by contacting support or using the Account Deletion feature in Settings.</p>

        <div style={h3}>4.4 Data Security</div>
        <p style={p}>We implement industry-standard security measures including AES-256 encryption at rest and in transit, row-level security policies ensuring tenant isolation, HSTS and Content Security Policy headers, and regular security reviews. Our architecture is built to SOC 2 Type II standards. For details, see our Security section at castford.com.</p>

        <div style={h2}>5. Acceptable Use</div>
        <p style={p}>You agree not to:</p>
        <ul>
          <li style={li}>Reverse engineer, decompile, or disassemble any part of the Service</li>
          <li style={li}>Use the Service to store or transmit malicious code, or to engage in any illegal activity</li>
          <li style={li}>Attempt to gain unauthorized access to other accounts or our infrastructure</li>
          <li style={li}>Use automated scripts to access the Service in a manner that exceeds reasonable use</li>
          <li style={li}>Resell, sublicense, or distribute access to the Service without our written consent</li>
          <li style={li}>Use the AI Copilot to generate content that violates any law or regulation</li>
          <li style={li}>Upload data that infringes on the intellectual property rights of third parties</li>
        </ul>

        <div style={h2}>6. AI Copilot</div>
        <p style={p}>The AI Copilot feature uses Anthropic's Claude API to provide natural language analysis of your financial data. You acknowledge that: (a) AI outputs are generated based on your data and general financial knowledge and should be independently verified before making business decisions; (b) the AI Copilot does not constitute financial advice, investment advice, tax advice, or legal advice; (c) your API interactions are processed by Anthropic subject to their usage policies; (d) we store your prompts and responses in your tenant for conversation history, subject to our data retention policy.</p>

        <div style={h2}>7. Integrations</div>
        <p style={p}>The Service connects to third-party platforms (e.g., NetSuite, Salesforce, Stripe, QuickBooks) through APIs. These integrations are provided "as-is" and we do not guarantee uninterrupted access to third-party services. Your use of third-party integrations is subject to those providers' terms of service. You authorize us to access your third-party accounts to the extent necessary to provide the integration functionality you enable.</p>

        <div style={h2}>8. Intellectual Property</div>
        <p style={p}>The Service, including all software, algorithms, designs, branding, documentation, and proprietary methodologies (including our variance detection algorithms, Series A Readiness scoring, and forecast ensemble methodology), is owned by Financial Holding LLC. Nothing in these Terms grants you any rights to our intellectual property beyond the limited right to use the Service during your subscription.</p>

        <div style={h2}>9. Limitation of Liability</div>
        <p style={p}>TO THE MAXIMUM EXTENT PERMITTED BY LAW, FINANCIAL HOLDING LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE TOTAL FEES YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>

        <div style={h2}>10. Disclaimer of Warranties</div>
        <p style={p}>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. FINANCIAL DATA, AI OUTPUTS, FORECASTS, AND ANALYSIS PROVIDED THROUGH THE SERVICE ARE FOR INFORMATIONAL PURPOSES ONLY AND DO NOT CONSTITUTE FINANCIAL, INVESTMENT, TAX, OR LEGAL ADVICE.</p>

        <div style={h2}>11. Indemnification</div>
        <p style={p}>You agree to indemnify and hold harmless Financial Holding LLC, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any rights of a third party; (d) any Customer Data you submit through the Service.</p>

        <div style={h2}>12. Governing Law</div>
        <p style={p}>These Terms shall be governed by and construed in accordance with the laws of the State of New Hampshire, without regard to its conflict of laws provisions. Any disputes arising from these Terms shall be resolved in the state or federal courts located in Hillsborough County, New Hampshire.</p>

        <div style={h2}>13. Changes to Terms</div>
        <p style={p}>We may update these Terms from time to time. Material changes will be communicated via email or in-app notification at least 30 days before taking effect. Your continued use of the Service after changes take effect constitutes acceptance of the updated Terms.</p>

        <div style={h2}>14. Contact</div>
        <p style={p}>For questions about these Terms, contact us at:</p>
        <p style={p}>Financial Holding LLC<br />Email: legal@castford.com<br />Website: castford.com</p>

        {/* Footer */}
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid #1e2230", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#3d4558" }}>
          <span>© {new Date().getFullYear()} Financial Holding LLC</span>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="/privacy" style={{ color: "#3d4558", textDecoration: "none" }}>Privacy Policy</a>
            <a href="/" style={{ color: "#3d4558", textDecoration: "none" }}>Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
