/** @type {import('next').NextConfig} */

// The v3 HTML files live in public/v3 4/ (GitHub auto-renamed the folder)
// Define the path ONCE here so it cannot get corrupted during editing
const V3 = "/site";

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
      beforeFiles: [
        // Main marketing pages
        { source: "/", destination: `${V3}/landing.html` },
        { source: "/pricing", destination: `${V3}/pricing.html` },
        { source: "/about", destination: `${V3}/about.html` },
        { source: "/contact", destination: `${V3}/contact.html` },
        { source: "/solutions", destination: `${V3}/solutions.html` },
        { source: "/integrations", destination: `${V3}/integrations.html` },
        { source: "/security", destination: `${V3}/security.html` },
        { source: "/resources", destination: `${V3}/resources.html` },
        { source: "/whats-new", destination: `${V3}/whats-new.html` },
        { source: "/competitors", destination: `${V3}/competitors.html` },
        { source: "/xpa-planning", destination: `${V3}/xpa-planning.html` },
        { source: "/pain-points", destination: `${V3}/pain-points.html` },
        { source: "/ad-campaign", destination: `${V3}/ad-campaign.html` },

        // Dashboard showcase pages
        { source: "/dashboard/standard", destination: `${V3}/dashboard/standard.html` },
        { source: "/dashboard/ceo", destination: `${V3}/dashboard/ceo.html` },
        { source: "/dashboard/ceo-light", destination: `${V3}/dashboard/ceo-light.html` },
        { source: "/dashboard/cfo", destination: `${V3}/dashboard/cfo.html` },
        { source: "/dashboard/cfo-light", destination: `${V3}/dashboard/cfo-light.html` },
        { source: "/dashboard/controller", destination: `${V3}/dashboard/controller.html` },
        { source: "/dashboard/controller-light", destination: `${V3}/dashboard/controller-light.html` },
        { source: "/dashboard/fpa", destination: `${V3}/dashboard/fpa.html` },
        { source: "/dashboard/fpa-light", destination: `${V3}/dashboard/fpa-light.html` },
        { source: "/dashboard/command-center", destination: `${V3}/dashboard/command-center.html` },
        { source: "/dashboard/roles", destination: `${V3}/dashboard/roles.html` },
        { source: "/dashboard/roles-upgraded", destination: `${V3}/dashboard/roles-upgraded.html` },
        { source: "/dashboard/tiers", destination: `${V3}/dashboard/tiers.html` },
        { source: "/dashboard/tiers-clean", destination: `${V3}/dashboard/tiers-clean.html` },
        { source: "/dashboard/tiers-spring", destination: `${V3}/dashboard/tiers-spring.html` },
        { source: "/dashboard/customizer", destination: `${V3}/dashboard/customizer.html` },
        { source: "/dashboard/customizer-v2", destination: `${V3}/dashboard/customizer-v2.html` },
        { source: "/dashboard/onboarding", destination: `${V3}/dashboard/onboarding.html` },
        { source: "/dashboard/guided-tour", destination: `${V3}/dashboard/guided-tour.html` },
        { source: "/dashboard/workspace", destination: `${V3}/dashboard/workspace.html` },
        { source: "/dashboard/committed-spend", destination: `${V3}/dashboard/committed-spend.html` },

        // Design studio and templates
        { source: "/design-studio/:path*", destination: `${V3}/design-studio/:path*` },
        { source: "/templates/:path*", destination: `${V3}/templates/:path*` },
        { source: "/v3/:path*", destination: `${V3}/:path*` },
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
