/** @type {import('next').NextConfig} */

// Iron dome — security headers applied to every response.
// CSP added 2026-07-22 after a full external-origin audit: the only third-party
// origins the site loads are Google Fonts (css from fonts.googleapis.com, woff2
// from fonts.gstatic.com). The codex relies on inline <script>/onclick handlers
// and inline styles, so 'unsafe-inline' is required for script-src/style-src —
// this CSP still blocks external script injection, framing, objects and base
// hijacking, but is NOT nonce-strict. 'unsafe-eval' is dev-only (react-refresh).
const scriptSrc =
  process.env.NODE_ENV === 'development'
    ? "'self' 'unsafe-inline' 'unsafe-eval' blob: https://voice-service-ten.vercel.app"
    : "'self' 'unsafe-inline' blob: https://voice-service-ten.vercel.app"; // blob: + voice-service: the voice assistant widget (2026-09-17)
const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "connect-src 'self' https://voice-service-ten.vercel.app wss://generativelanguage.googleapis.com https://generativelanguage.googleapis.com wss://*.livekit.cloud https://*.livekit.cloud https://api.simli.ai wss://*.simli.ai",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), payment=()' }, // microphone=(self) for the voice assistant — 2026-09-17
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

module.exports = nextConfig;
