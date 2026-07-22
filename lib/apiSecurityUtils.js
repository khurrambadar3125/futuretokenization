// ── SHARED API SECURITY UTILITIES ──
// Drop into any project: const { esc, isPrivateHostname, createRateLimiter } = require('./api-security-utils');

// HTML escaping — prevents XSS in email templates
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// SSRF protection — blocks private/internal IP addresses
function isPrivateHostname(hostname) {
  if (['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'].includes(hostname)) return true;
  if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') return true;
  const parts = hostname.split('.').map(Number);
  if (parts.length === 4 && parts.every(n => !isNaN(n))) {
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 0) return true;
  }
  return false;
}

// In-memory rate limiter factory
function createRateLimiter(maxRequests, windowMs) {
  const map = new Map();
  return function checkRate(ip) {
    const now = Date.now();
    const entry = map.get(ip);
    if (!entry || now - entry.start > windowMs) {
      map.set(ip, { start: now, count: 1 });
      return true;
    }
    entry.count++;
    return entry.count <= maxRequests;
  };
}

// Extract client IP from request
function clientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

// CORS helper — returns true if origin is allowed
function checkOrigin(origin, allowedDomains) {
  if (!origin) return false;
  return allowedDomains.some(d => origin === `https://${d}` || origin === `http://localhost:3000` || origin === `http://127.0.0.1:5500`);
}

module.exports = { esc, isPrivateHostname, createRateLimiter, clientIp, checkOrigin };
