/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Transport Security
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          
          // Content Protection
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          
          // Permissions
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self), usb=(), bluetooth=(), serial=(), hid=()" },
          
          // Cross-Origin Policies
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.supabase.co https://api.anthropic.com https://fonts.googleapis.com https://accounts.google.com https://appleid.apple.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://checkout.stripe.com https://*.supabase.co https://accounts.google.com https://appleid.apple.com",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/(.*)\\.(svg|png|ico|woff2|woff|webp)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async rewrites() {
    return {
      // beforeFiles rewrites run BEFORE Next.js checks app/ routes,
      // so these v3 HTML pages replace the existing marketing pages
      beforeFiles: [
        // Main marketing pages → v3 HTML replacements
        { source: "/", destination: "/v3%204/landing.html" },
        { source: "/pricing", destination: "/v3%204/pricing.html" },
        { source: "/about", destination: "/v3%204/about.html" },
        { source: "/contact", destination: "/v3%204/contact.html" },
        { source: "/solutions", destination: "/v3%204/solutions.html" },
        { source: "/integrations", destination: "/v3%204/integrations.html" },
        { source: "/security", destination: "/v3%204/security.html" },
        { source: "/resources", destination: "/v3%204/resources.html" },
        { source: "/whats-new", destination: "/v3%204/whats-new.html" },
        { source: "/competitors", destination: "/v3%204/competitors.html" },
        { source: "/xpa-planning", destination: "/v3%204/xpa-planning.html" },
        { source: "/pain-points", destination: "/v3%204/pain-points.html" },
        { source: "/ad-campaign", destination: "/v3%204/ad-campaign.html" },

        // Dashboard showcase pages
        { source: "/dashboard/standard", destination: "/v3%204/dashboard/standard.html" },
        { source: "/dashboard/ceo", destination: "/v3%204/dashboard/ceo.html" },
        { source: "/dashboard/ceo-light", destination: "/v3%204/dashboard/ceo-light.html" },
        { source: "/dashboard/cfo", destination: "/v3%204/dashboard/cfo.html" },
        { source: "/dashboard/cfo-light", destination: "/v3%204/dashboard/cfo-light.html" },
        { source: "/dashboard/controller", destination: "/v3%204/dashboard/controller.html" },
        { source: "/dashboard/controller-light", destination: "/v3%204/dashboard/controller-light.html" },
        { source: "/dashboard/fpa", destination: "/v3%204/dashboard/fpa.html" },
        { source: "/dashboard/fpa-light", destination: "/v3%204/dashboard/fpa-light.html" },
        { source: "/dashboard/command-center", destination: "/v3%204/dashboard/command-center.html" },
        { source: "/dashboard/roles", destination: "/v3%204/dashboard/roles.html" },
        { source: "/dashboard/roles-upgraded", destination: "/v3%204/dashboard/roles-upgraded.html" },
        { source: "/dashboard/tiers", destination: "/v3%204/dashboard/tiers.html" },
        { source: "/dashboard/tiers-clean", destination: "/v3%204/dashboard/tiers-clean.html" },
        { source: "/dashboard/tiers-spring", destination: "/v3%204/dashboard/tiers-spring.html" },
        { source: "/dashboard/customizer", destination: "/v3%204/dashboard/customizer.html" },
        { source: "/dashboard/customizer-v2", destination: "/v3%204/dashboard/customizer-v2.html" },
        { source: "/dashboard/onboarding", destination: "/v3%204/dashboard/onboarding.html" },
        { source: "/dashboard/guided-tour", destination: "/v3%204/dashboard/guided-tour.html" },
        { source: "/dashboard/workspace", destination: "/v3%204/dashboard/workspace.html" },
        { source: "/dashboard/committed-spend", destination: "/v3%204/dashboard/committed-spend.html" },

        // Design studio pages
        { source: "/design-studio/:path*", destination: "/v3%204/design-studio/:path*" },

        // Templates pages
        { source: "/templates/:path*", destination: "/v3%204/templates/:path*" },

        // Keep /v3/ paths working too
        { source: "/v3/:path*", destination: "/v3%204/:path*" },
      ],
    };
  },

  async redirects() {
    return [
      // Redirect www to non-www (when custom domain is set)
      { source: "/:path*", has: [{ type: "host", value: "www.finance-os.app" }], destination: "https://finance-os.app/:path*", permanent: true },
    ];
  },
};

module.exports = nextConfig;
// Vercel env vars configured
