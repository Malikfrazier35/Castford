import PlausibleAnalytics from "./PlausibleAnalytics";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Castford — AI-Powered FP&A Platform",
  description: "The financial planning platform that thinks before it answers. AI-native variance detection, scenario modeling, and natural language querying for modern finance teams.",
  keywords: ["FP&A", "financial planning", "AI copilot", "variance detection", "scenario modeling", "SaaS finance", "budget vs actual", "revenue forecasting", "multi-entity consolidation", "month-end close", "finance automation", "cloud FPA", "FP&A software", "financial planning and analysis", "CFO dashboard", "SaaS metrics", "AI financial planning"],
  authors: [{ name: "Castford" }],
  creator: "Castford",
  publisher: "Financial Holding LLC",
  metadataBase: new URL("https://castford.com"),
  alternates: { canonical: "https://castford.com" },
  openGraph: {
    title: "Castford — AI-Powered FP&A Platform",
    description: "Financial planning that thinks before it answers. Connect your ERP, CRM, and billing data into a unified model with AI-powered insights.",
    url: "https://castford.com",
    siteName: "Castford",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Castford — AI-Powered FP&A Platform",
    description: "Financial planning that thinks before it answers.",
  },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  verification: {
  google: '9EaZd9CUot3cR0-NUvyVz-Z-iDRiHlbpoxKvs_QZHro',
},
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  category: "technology",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f8f9fb" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://castford.com" />
        <link rel="alternate" type="text/plain" href="https://castford.com/llms.txt" title="LLM-readable product summary" />
        <link rel="alternate" type="text/plain" href="https://castford.com/llms-full.txt" title="LLM-readable full product reference" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://crecesswagluelvkesul.supabase.co" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script defer data-domain="castford.com" src="https://plausible.io/js/script.js"></script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Castford",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "AI-powered financial planning and analysis (FP&A) platform with variance detection, scenario modeling, multi-entity consolidation, and natural language querying.",
          "url": "https://castford.com",
          "image": "https://castford.com/og-image.png",
          "author": { "@type": "Organization", "name": "Financial Holding LLC" },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": "499",
            "highPrice": "4799",
            "offerCount": "4",
            "offers": [
              { "@type": "Offer", "name": "Starter", "price": "499", "priceCurrency": "USD", "billingIncrement": 1, "unitCode": "MON" },
              { "@type": "Offer", "name": "Growth", "price": "1499", "priceCurrency": "USD", "billingIncrement": 1, "unitCode": "MON" },
              { "@type": "Offer", "name": "Business", "price": "3999", "priceCurrency": "USD", "billingIncrement": 1, "unitCode": "MON" },
              { "@type": "Offer", "name": "Enterprise", "description": "Custom pricing for large organizations" }
            ]
          },
          "featureList": "AI Copilot, Variance Detection, Scenario Modeling, Multi-Entity Consolidation, Month-End Close, Revenue Forecasting, P&L Analysis, 30+ Integrations"
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What is Castford?", "acceptedAnswer": { "@type": "Answer", "text": "Castford is an AI-powered financial planning and analysis (FP&A) platform. It connects to your ERP, CRM, and billing systems to provide real-time variance detection, scenario modeling, multi-entity consolidation, and natural language financial querying powered by Claude AI." }},
            { "@type": "Question", "name": "How much does Castford cost?", "acceptedAnswer": { "@type": "Answer", "text": "Castford starts at $499/month (billed annually). Growth plan is $1,499/month, Business is $3,999/month, and Enterprise is custom pricing. All plans include a 30-day money-back guarantee." }},
            { "@type": "Question", "name": "How does Castford compare to Anaplan?", "acceptedAnswer": { "@type": "Answer", "text": "Castford offers enterprise-grade features at a fraction of Anaplan's cost ($499/mo vs $200K+/yr). Key advantages: AI copilot with visible reasoning, self-serve onboarding in under 48 hours (vs 3-6 months for Anaplan), transparent pricing, and real-time variance detection." }},
            { "@type": "Question", "name": "How does Castford compare to Pigment?", "acceptedAnswer": { "@type": "Answer", "text": "Castford starts at $499/mo vs Pigment's $65K+/yr entry point. Both offer multi-entity consolidation and scenario modeling. Castford adds AI-powered natural language querying, banking data via Plaid, and implementation in days rather than months." }},
            { "@type": "Question", "name": "Is Castford secure?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Castford has SOC 2 Type II compliant architecture, AES-256 encryption at rest and in transit, row-level security via Supabase RLS, HSTS and Content Security Policy headers, and zero cross-tenant data leakage by design." }},
            { "@type": "Question", "name": "How long does Castford take to implement?", "acceptedAnswer": { "@type": "Answer", "text": "Most teams are live within 48 hours. Connect your ERP, map your chart of accounts, and start running reports the same day. This compares to 3-6 month implementations for Anaplan and Pigment." }},
            { "@type": "Question", "name": "What integrations does Castford support?", "acceptedAnswer": { "@type": "Answer", "text": "Castford supports 30+ native integrations including NetSuite, Salesforce, Stripe, Snowflake, Rippling, QuickBooks, Xero, Plaid, and more. All integrations feature bi-directional sync with under 5 minute latency." }},
            { "@type": "Question", "name": "Who is Castford best for?", "acceptedAnswer": { "@type": "Answer", "text": "Castford is designed for SaaS companies with $5M-$200M ARR and finance teams of 3-25 people. It's ideal for companies currently using spreadsheets or outgrowing Adaptive Insights, as well as teams that want enterprise-grade FP&A without 6-month implementations." }}
          ]
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Financial Holding LLC",
          "url": "https://castford.com",
          "logo": "https://castford.com/favicon.svg",
          "sameAs": ["https://linkedin.com/company/castford", "https://x.com/castford_app"],
          "contactPoint": { "@type": "ContactPoint", "email": "sales@castford.com", "contactType": "sales" }
        }) }} />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Manrope', system-ui, -apple-system, sans-serif", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", textRendering: "optimizeLegibility", fontFeatureSettings: '"cv01", "ss01"' }}>
        {/* Loading splash — visible until React hydrates */}
        <div id="fos-splash" style={{ position: "fixed", inset: 0, zIndex: 99999, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, transition: "opacity 0.4s" }}>
          <div style={{ width: 48, height: 48, border: "3px solid rgba(59,130,246,0.12)", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "fos-spin 0.8s linear infinite" }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: "#3B82F6", letterSpacing: "-0.02em", fontFamily: "'Manrope', system-ui, sans-serif" }}>Castford</div>
          <div style={{ fontSize: 10, color: "#9ea5b8" }}>Loading...</div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes fos-spin { to { transform: rotate(360deg); } }` }} />
        <script dangerouslySetInnerHTML={{ __html: `
          // Remove splash after React mounts
          window.__fosRemoveSplash = function() {
            var s = document.getElementById('fos-splash');
            if (s) { s.style.opacity = '0'; setTimeout(function() { s.remove(); }, 400); }
          };
          // Auto-remove after 6s failsafe
          setTimeout(function() { window.__fosRemoveSplash && window.__fosRemoveSplash(); }, 6000);
          // Chunk error recovery
          window.addEventListener('error', function(e) {
            if (e.message && (e.message.includes('Loading chunk') || e.message.includes('Failed to fetch dynamically'))) {
              if (!sessionStorage.getItem('fos_chunk_retry')) {
                sessionStorage.setItem('fos_chunk_retry', '1');
                caches && caches.keys().then(function(k) { k.forEach(function(n) { caches.delete(n); }); });
                window.location.reload();
              }
            }
          });
          // ResizeObserver loop suppression
          window.addEventListener('error', function(e) {
            if (e.message && e.message.includes('ResizeObserver')) { e.stopImmediatePropagation(); }
          });
        `}} />
        {children}
        <Analytics />
        <PlausibleAnalytics />
        {/* UTM Parameter Capture — stores campaign attribution for lead forms */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var p = new URLSearchParams(window.location.search);
              var utms = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','ref','via','gclid','fbclid','msclkid'];
              var d = {};
              utms.forEach(function(k){ var v = p.get(k); if(v) d[k] = v; });
              if(Object.keys(d).length > 0) {
                d._ts = Date.now();
                d._landing = window.location.pathname;
                d._referrer = document.referrer || '';
                sessionStorage.setItem('fos_utm', JSON.stringify(d));
              }
              // Also capture first-touch attribution (survives session)
              if(Object.keys(d).length > 0 && !localStorage.getItem('fos_first_touch')) {
                localStorage.setItem('fos_first_touch', JSON.stringify(d));
              }
            } catch(e){}
          })();
        `}} />
        {/* Google Ads Conversion Tracking */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18032992189"></script>
        <script dangerouslySetInnerHTML={{ __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18032992189');" }} />
        {/* Meta (Facebook) Pixel — PLACEHOLDER */}
        {/* Uncomment and add your Pixel ID when ready:
        <script dangerouslySetInnerHTML={{ __html: "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','YOUR_PIXEL_ID');fbq('track','PageView');" }} />
        */}
        {/* LinkedIn Insight Tag — PLACEHOLDER */}
        {/* Uncomment and add your partner ID when ready:
        <script dangerouslySetInnerHTML={{ __html: "_linkedin_partner_id='YOUR_PARTNER_ID';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);" }} />
        <script async src="https://snap.licdn.com/li.lms-analytics/insight.min.js" />
        */}
      </body>
    </html>
  );
}
