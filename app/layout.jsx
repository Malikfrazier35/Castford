export const metadata = {
  title: "FinanceOS — AI-Powered FP&A Platform",
  description: "The financial planning platform that thinks before it answers. AI-native variance detection, scenario modeling, and natural language querying for modern finance teams.",
  keywords: ["FP&A", "financial planning", "AI copilot", "variance detection", "scenario modeling", "SaaS finance"],
  authors: [{ name: "FinanceOS" }],
  creator: "FinanceOS",
  metadataBase: new URL("https://financeos-rho.vercel.app"),
  openGraph: {
    title: "FinanceOS — AI-Powered FP&A Platform",
    description: "Financial planning that thinks before it answers. Connect your ERP, CRM, and billing data into a unified model with AI-powered insights.",
    url: "https://financeos-rho.vercel.app",
    siteName: "FinanceOS",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinanceOS — AI-Powered FP&A Platform",
    description: "Financial planning that thinks before it answers.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
