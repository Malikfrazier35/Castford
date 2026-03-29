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
    return [
      // Map clean /v3/ paths to the actual folder (GitHub renamed it to "v3 4")
      { source: "/v3/:path*", destination: "/v3%204/:path*" },
    ];
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
