export const metadata = {
  title: "FinanceOS — AI-Powered FP&A Platform",
  description: "The financial planning platform that thinks before it answers. AI-native variance detection, scenario modeling, and natural language querying for modern finance teams.",
  keywords: ["FP&A", "financial planning", "AI copilot", "variance detection", "scenario modeling", "SaaS finance", "budget vs actual", "revenue forecasting", "multi-entity consolidation", "month-end close", "finance automation", "cloud FPA", "FP&A software", "financial planning and analysis", "CFO dashboard", "SaaS metrics", "AI financial planning"],
  authors: [{ name: "FinanceOS" }],
  creator: "FinanceOS",
  publisher: "Financial Holding LLC",
  metadataBase: new URL("https://finance-os.app"),
  alternates: { canonical: "https://finance-os.app" },
  openGraph: {
    title: "FinanceOS — AI-Powered FP&A Platform",
    description: "Financial planning that thinks before it answers. Connect your ERP, CRM, and billing data into a unified model with AI-powered insights.",
    url: "https://finance-os.app",
    siteName: "FinanceOS",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FinanceOS — AI-Powered FP&A Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FinanceOS — AI-Powered FP&A Platform",
    description: "Financial planning that thinks before it answers.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
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
        <link rel="canonical" href="https://finance-os.app" />
        <link rel="alternate" type="text/plain" href="https://finance-os.app/llms.txt" title="LLM-readable product summary" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://crecesswagluelvkesul.supabase.co" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script defer data-domain="finance-os.app" src="https://plausible.io/js/script.js"></script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "FinanceOS",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "AI-powered financial planning and analysis (FP&A) platform with variance detection, scenario modeling, multi-entity consolidation, and natural language querying.",
          "url": "https://finance-os.app",
          "image": "https://finance-os.app/og-image.png",
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
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "2400", "bestRating": "5" },
          "featureList": "AI Copilot, Variance Detection, Scenario Modeling, Multi-Entity Consolidation, Month-End Close, Revenue Forecasting, P&L Analysis, 30+ Integrations"
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What is FinanceOS?", "acceptedAnswer": { "@type": "Answer", "text": "FinanceOS is an AI-powered financial planning and analysis (FP&A) platform. It connects to your ERP, CRM, and billing systems to provide real-time variance detection, scenario modeling, multi-entity consolidation, and natural language financial querying powered by Claude AI." }},
            { "@type": "Question", "name": "How much does FinanceOS cost?", "acceptedAnswer": { "@type": "Answer", "text": "FinanceOS starts at $499/month (billed annually). Growth plan is $1,499/month, Business is $3,999/month, and Enterprise is custom pricing. All plans include a 14-day free trial with no credit card required." }},
            { "@type": "Question", "name": "How does FinanceOS compare to Anaplan?", "acceptedAnswer": { "@type": "Answer", "text": "FinanceOS offers enterprise-grade features at a fraction of Anaplan's cost ($499/mo vs $200K+/yr). Key advantages: AI copilot with visible reasoning, self-serve onboarding in under 48 hours (vs 3-6 months for Anaplan), transparent pricing, and real-time variance detection." }},
            { "@type": "Question", "name": "How does FinanceOS compare to Pigment?", "acceptedAnswer": { "@type": "Answer", "text": "FinanceOS starts at $499/mo vs Pigment's $65K+/yr entry point. Both offer multi-entity consolidation and scenario modeling. FinanceOS adds AI-powered natural language querying, banking data via Plaid, and implementation in days rather than months." }},
            { "@type": "Question", "name": "Is FinanceOS secure?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. FinanceOS has SOC 2 Type II compliant architecture, AES-256 encryption at rest and in transit, row-level security via Supabase RLS, HSTS and Content Security Policy headers, and zero cross-tenant data leakage by design." }},
            { "@type": "Question", "name": "How long does FinanceOS take to implement?", "acceptedAnswer": { "@type": "Answer", "text": "Most teams are live within 48 hours. Connect your ERP, map your chart of accounts, and start running reports the same day. This compares to 3-6 month implementations for Anaplan and Pigment." }},
            { "@type": "Question", "name": "What integrations does FinanceOS support?", "acceptedAnswer": { "@type": "Answer", "text": "FinanceOS supports 30+ native integrations including NetSuite, Salesforce, Stripe, Snowflake, Rippling, QuickBooks, Xero, Plaid, and more. All integrations feature bi-directional sync with under 5 minute latency." }},
            { "@type": "Question", "name": "Who is FinanceOS best for?", "acceptedAnswer": { "@type": "Answer", "text": "FinanceOS is designed for SaaS companies with $5M-$200M ARR and finance teams of 3-25 people. It's ideal for companies currently using spreadsheets or outgrowing Adaptive Insights, as well as teams that want enterprise-grade FP&A without 6-month implementations." }}
          ]
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Financial Holding LLC",
          "url": "https://finance-os.app",
          "logo": "https://finance-os.app/favicon.svg",
          "sameAs": ["https://linkedin.com/company/finance-os", "https://x.com/financeos_app", "https://github.com/Malikfrazier35/financeos"],
          "contactPoint": { "@type": "ContactPoint", "email": "sales@finance-os.app", "contactType": "sales" }
        }) }} />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif", WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", textRendering: "optimizeLegibility", fontFeatureSettings: '"cv01", "ss01"' }}>
        {children}
      </body>
    </html>
  );
}
