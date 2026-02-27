import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking — stops the page being embedded in an iframe
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from guessing the content type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send the origin as the referrer when navigating to HTTPS
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict which browser features the page can use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Force HTTPS for 1 year (includeSubDomains covers www.)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Content Security Policy — tightened for this app's actual needs
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js inline scripts and the terminal animation need unsafe-inline/unsafe-eval
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      // No external images used
      "img-src 'self' data:",
      // API routes are same-origin
      "connect-src 'self'",
      "font-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    WAITLIST_TABLE: process.env.WAITLIST_TABLE,
    APP_URL: process.env.APP_URL,
    WAITLIST_FROM_EMAIL: process.env.WAITLIST_FROM_EMAIL,
    UNSUBSCRIBE_SECRET: process.env.UNSUBSCRIBE_SECRET,
    API_URL: process.env.API_URL,
  },
  async headers() {
    return [
      {
        // Apply to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
