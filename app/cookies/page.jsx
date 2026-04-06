"use client";

export default function CookiePolicyPage() {
  const effective = "March 27, 2026";
  const h2 = { fontSize: 22, fontWeight: 800, color: "#f0f2f5", letterSpacing: "-0.02em", marginTop: 48, marginBottom: 12 };
  const h3 = { fontSize: 16, fontWeight: 700, color: "#d1d5e0", marginTop: 28, marginBottom: 8 };
  const p = { fontSize: 14, color: "#8b92a5", lineHeight: 1.85, marginBottom: 16 };
  const li = { fontSize: 14, color: "#8b92a5", lineHeight: 1.85, marginBottom: 6 };
  const td = { padding: "10px 16px", fontSize: 13, color: "#8b92a5", borderBottom: "1px solid #1e2230" };
  const th = { padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#3d4558", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #1e2230", textAlign: "left" };

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#f0f2f5", fontFamily: "'Manrope', system-ui, sans-serif", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 0.5px, transparent 0.5px)", backgroundSize: "32px 32px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 100px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40, paddingBottom: 28, borderBottom: "1px solid #1e2230" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "#60a5fa", textDecoration: "none", marginBottom: 20 }}>← Back to Castford</a>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>Cookie Policy</h1>
          <p style={{ fontSize: 13, color: "#3d4558" }}>Effective: {effective} · Financial Holding LLC</p>
        </div>

        <p style={p}>This Cookie Policy explains how Financial Holding LLC ("Company," "we," "us," or "our") uses cookies and similar tracking technologies when you visit or use Castford at castford.com. This policy should be read alongside our <a href="/privacy" style={{ color: "#60a5fa", textDecoration: "none" }}>Privacy Policy</a> and <a href="/terms" style={{ color: "#60a5fa", textDecoration: "none" }}>Terms of Service</a>.</p>

        {/* Section 1 */}
        <div style={h2}>1. What Are Cookies</div>
        <p style={p}>Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website operators reporting information. Cookies can be "first-party" (set by the site you are visiting) or "third-party" (set by a domain other than the one you are visiting).</p>
        <p style={p}>Similar technologies include local storage, session storage, and pixels/web beacons — small pieces of data stored or transmitted by your browser that serve functions similar to cookies. This policy covers all such technologies collectively.</p>

        {/* Section 2 */}
        <div style={h2}>2. Our Approach to Cookies</div>
        <p style={p}>Castford is built with a privacy-first philosophy. We minimize the use of cookies and tracking technologies wherever possible. Notably:</p>
        <ul>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>No advertising cookies</strong> — We do not use any advertising, retargeting, or behavioral tracking cookies.</li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>No third-party marketing trackers</strong> — We do not embed Facebook Pixel, Google Ads tags, or similar marketing scripts.</li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Privacy-first analytics</strong> — We use Plausible Analytics, which is fully cookie-free and collects no personal data.</li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Minimal essential cookies</strong> — We only use cookies that are strictly necessary to operate the Service.</li>
        </ul>

        {/* Section 3 */}
        <div style={h2}>3. Cookies We Use</div>
        <p style={p}>The following table describes the cookies and similar technologies used on Castford:</p>

        <div style={h3}>3.1 Strictly Necessary Cookies</div>
        <p style={p}>These cookies are essential for the Service to function and cannot be disabled. They are set in response to actions you take, such as logging in or setting your preferences.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, border: "1px solid #1e2230", borderRadius: 12, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#111318" }}>
              <th style={th}>Name</th>
              <th style={th}>Provider</th>
              <th style={th}>Purpose</th>
              <th style={th}>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={td}>sb-access-token</td><td style={td}>Supabase</td><td style={td}>Authenticates your session after login via JWT access token</td><td style={td}>1 hour</td></tr>
            <tr><td style={td}>sb-refresh-token</td><td style={td}>Supabase</td><td style={td}>Refreshes your access token to maintain your session without re-login</td><td style={td}>7 days</td></tr>
            <tr><td style={td}>sb-auth-token</td><td style={td}>Supabase</td><td style={td}>Stores authentication state for session persistence across page loads</td><td style={td}>Session</td></tr>
            <tr><td style={td}>__vercel_live_token</td><td style={td}>Vercel</td><td style={td}>Used during development/preview deployments only (not present in production)</td><td style={td}>Session</td></tr>
          </tbody>
        </table>

        <div style={h3}>3.2 Functional Cookies</div>
        <p style={p}>These cookies enable enhanced functionality and personalization within the dashboard.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, border: "1px solid #1e2230", borderRadius: 12, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#111318" }}>
              <th style={th}>Name</th>
              <th style={th}>Provider</th>
              <th style={th}>Purpose</th>
              <th style={th}>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={td}>fos-theme</td><td style={td}>Castford</td><td style={td}>Remembers your dark/light mode preference</td><td style={td}>1 year</td></tr>
            <tr><td style={td}>fos-sidebar</td><td style={td}>Castford</td><td style={td}>Remembers sidebar collapsed/expanded state</td><td style={td}>1 year</td></tr>
            <tr><td style={td}>fos-active-view</td><td style={td}>Castford</td><td style={td}>Remembers your last active dashboard view</td><td style={td}>Session</td></tr>
          </tbody>
        </table>

        <div style={h3}>3.3 Payment Cookies</div>
        <p style={p}>These cookies are set by Stripe when you interact with payment forms (checkout, billing settings, or plan upgrades).</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, border: "1px solid #1e2230", borderRadius: 12, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#111318" }}>
              <th style={th}>Name</th>
              <th style={th}>Provider</th>
              <th style={th}>Purpose</th>
              <th style={th}>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={td}>__stripe_mid</td><td style={td}>Stripe</td><td style={td}>Fraud prevention — identifies your device to detect suspicious payment activity</td><td style={td}>1 year</td></tr>
            <tr><td style={td}>__stripe_sid</td><td style={td}>Stripe</td><td style={td}>Fraud prevention — maintains your payment session integrity</td><td style={td}>30 min</td></tr>
          </tbody>
        </table>

        <div style={h3}>3.4 Analytics</div>
        <p style={p}>We use Plausible Analytics for website analytics. Plausible does not use cookies, does not collect personal data, and does not track individual visitors. All analytics data is aggregated and anonymous. No consent is required for Plausible under GDPR, ePrivacy, or CCPA because no personal data is processed. For more information, visit <span style={{ color: "#60a5fa" }}>plausible.io/data-policy</span>.</p>

        {/* Section 4 */}
        <div style={h2}>4. Local Storage & Session Storage</div>
        <p style={p}>In addition to cookies, we use browser local storage and session storage for the following purposes:</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, border: "1px solid #1e2230", borderRadius: 12, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#111318" }}>
              <th style={th}>Key</th>
              <th style={th}>Type</th>
              <th style={th}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={td}>supabase.auth.token</td><td style={td}>Local Storage</td><td style={td}>Persists authentication tokens for seamless login across tabs</td></tr>
            <tr><td style={td}>fos-onboarding-step</td><td style={td}>Local Storage</td><td style={td}>Tracks your progress through the onboarding wizard</td></tr>
            <tr><td style={td}>fos-copilot-history</td><td style={td}>Session Storage</td><td style={td}>Maintains AI Copilot conversation within the current session</td></tr>
          </tbody>
        </table>

        {/* Section 5 */}
        <div style={h2}>5. How to Manage Cookies</div>
        <p style={p}>You can control and manage cookies in several ways:</p>

        <div style={h3}>5.1 Browser Settings</div>
        <p style={p}>Most browsers allow you to view, manage, and delete cookies through their settings. You can configure your browser to block all cookies, block third-party cookies only, or delete cookies when you close the browser. Note that blocking strictly necessary cookies will prevent you from logging in to Castford.</p>

        <div style={h3}>5.2 Device Settings</div>
        <p style={p}>On mobile devices, you can manage cookie settings through your device's browser settings or through the operating system's privacy settings.</p>

        <div style={h3}>5.3 Clearing Local Storage</div>
        <p style={p}>You can clear local storage and session storage through your browser's developer tools (typically accessible via F12 → Application → Storage) or by clearing all site data in your browser's privacy settings.</p>

        <p style={p}>For detailed instructions on managing cookies in specific browsers:</p>
        <ul>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
        </ul>

        {/* Section 6 */}
        <div style={h2}>6. Cookies We Do NOT Use</div>
        <p style={p}>For full transparency, the following types of cookies are explicitly not used on Castford:</p>
        <ul>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Advertising / Retargeting Cookies</strong> — No Google Ads, Facebook Pixel, LinkedIn Insight Tag, or similar.</li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Cross-Site Tracking Cookies</strong> — We do not track your activity across other websites.</li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Social Media Cookies</strong> — No embedded social widgets that set tracking cookies.</li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Fingerprinting</strong> — We do not use browser or device fingerprinting techniques.</li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Invasive Analytics</strong> — No heatmaps, session recordings, or individual-level behavioral analytics.</li>
        </ul>

        {/* Section 7 */}
        <div style={h2}>7. GDPR, CCPA & International Compliance</div>

        <div style={h3}>7.1 European Economic Area (GDPR / ePrivacy)</div>
        <p style={p}>Under the EU ePrivacy Directive and GDPR, strictly necessary cookies do not require consent. Since Castford only uses strictly necessary and functional cookies (no advertising or analytics cookies), and our analytics provider (Plausible) is cookie-free and GDPR-compliant by design, our cookie usage is compatible with EU regulations without a cookie consent banner. Functional cookies that store your preferences (theme, sidebar state) are set in response to your explicit actions and fall under the "strictly necessary" exemption.</p>

        <div style={h3}>7.2 California (CCPA / CPRA)</div>
        <p style={p}>We do not sell personal information as defined under the California Consumer Privacy Act. We do not share personal information for cross-context behavioral advertising. Our cookie usage does not trigger "sale" or "sharing" obligations under CCPA/CPRA. California residents retain all rights described in our <a href="/privacy" style={{ color: "#60a5fa", textDecoration: "none" }}>Privacy Policy</a>.</p>

        <div style={h3}>7.3 Other Jurisdictions</div>
        <p style={p}>Our minimal cookie approach is designed to comply with cookie and privacy regulations across jurisdictions including the UK (UK-GDPR and PECR), Canada (PIPEDA), Brazil (LGPD), and Australia (Privacy Act 1988). If you have jurisdiction-specific questions, please contact us.</p>

        {/* Section 8 */}
        <div style={h2}>8. Third-Party Cookie Policies</div>
        <p style={p}>For information about how our third-party service providers use cookies:</p>
        <ul>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Supabase</strong> — <span style={{ color: "#60a5fa" }}>supabase.com/privacy</span></li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Stripe</strong> — <span style={{ color: "#60a5fa" }}>stripe.com/privacy</span> and <span style={{ color: "#60a5fa" }}>stripe.com/cookie-settings</span></li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Vercel</strong> — <span style={{ color: "#60a5fa" }}>vercel.com/legal/privacy-policy</span></li>
          <li style={li}><strong style={{ color: "#d1d5e0" }}>Plausible</strong> — <span style={{ color: "#60a5fa" }}>plausible.io/data-policy</span></li>
        </ul>

        {/* Section 9 */}
        <div style={h2}>9. Changes to This Policy</div>
        <p style={p}>We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements. If we make material changes, we will notify you by posting a prominent notice on the Service or sending you an email. The "Effective" date at the top of this page indicates when this policy was last revised. Continued use of the Service after changes constitutes acceptance of the revised policy.</p>

        {/* Section 10 */}
        <div style={h2}>10. Contact Us</div>
        <p style={p}>If you have questions about this Cookie Policy or our use of cookies, you can reach us at:</p>
        <div style={{ background: "#111318", border: "1px solid #1e2230", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <p style={{ ...p, marginBottom: 6 }}><strong style={{ color: "#d1d5e0" }}>Financial Holding LLC</strong></p>
          <p style={{ ...p, marginBottom: 6 }}>Email: privacy@castford.com</p>
          <p style={{ ...p, marginBottom: 0 }}>Website: castford.com</p>
        </div>

        {/* Footer nav */}
        <div style={{ marginTop: 60, paddingTop: 28, borderTop: "1px solid #1e2230", display: "flex", gap: 24, flexWrap: "wrap" }}>
          <a href="/privacy" style={{ fontSize: 13, color: "#60a5fa", textDecoration: "none" }}>Privacy Policy</a>
          <a href="/terms" style={{ fontSize: 13, color: "#60a5fa", textDecoration: "none" }}>Terms of Service</a>
          <a href="/" style={{ fontSize: 13, color: "#60a5fa", textDecoration: "none" }}>Back to Castford</a>
        </div>
      </div>
    </div>
  );
}
