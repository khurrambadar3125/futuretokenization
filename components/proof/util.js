// Shared helpers for the proof system.

// Format an ISO-ish date ("2026-06-25") to "25 Jun 2026". Returns null on bad input
// so callers can fall back to a Void state rather than print a wrong/empty date.
export function fmtDate(value) {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!m) return null;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [, y, mo, d] = m;
  const mi = parseInt(mo, 10) - 1;
  if (mi < 0 || mi > 11) return null;
  return `${parseInt(d, 10)} ${months[mi]} ${y}`;
}
