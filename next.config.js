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
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";
const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
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
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
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
