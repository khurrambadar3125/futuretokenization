/**
 * AI route guard for the public Digital Czar chat (/api/chat, no login): per-IP rate limit + daily USD spend ceiling.
 * Pattern: uae-intelligence-suite lib/security/ai-guard.js (2026-10-03, "fix this please": limits must live in a shared store).
 *
 * Store: Upstash Redis REST (plain fetch: pipeline INCRBY + TTL, then EXPIRE on a window's first hit) when KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV names)
 * or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN exist; otherwise an in-memory Map — per serverless instance, reset on a
 * cold start. So deploying before a store is attached behaves exactly as the old in-memory limiter did. Every key is prefixed
 * `ftk:` so a shared store can never mix this app's counters with another app's.
 *
 * Spend: before each call RESERVE a worst case (estimated input + full max output at the dearest chain price) against today's
 * UTC ceiling (AI_DAILY_BUDGET_USD, default 3) and refuse when it would cross; after the call SETTLE to the chain's real usd.
 * A reservation that cannot be settled (provider error) stays charged — errs towards refusing, never towards overspending.
 */
import crypto from 'node:crypto';

export const PREFIX = 'ftk:';
// Reservation prices: claude-haiku-4-5 list ($1 / MTok in, $5 / MTok out) — the dearest model in the chain, so a reservation is never low.
const PRICE_IN = 1 / 1_000_000;
const PRICE_OUT = 5 / 1_000_000;
const DEFAULT_DAILY_BUDGET_USD = 3;

export function dailyBudgetUsd(env = process.env) {
  const v = Number(env.AI_DAILY_BUDGET_USD);
  return Number.isFinite(v) && v > 0 ? v : DEFAULT_DAILY_BUDGET_USD;
}

/* ---------------- store ---------------- */

const mem = new Map();

export function upstashConfig(env = process.env) {
  const url = env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL;
  const token = env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ''), token } : null;
}

export function backend() {
  return upstashConfig() ? 'upstash' : 'memory';
}

/** Upstash REST pipeline: INCRBY + TTL in one round trip; EXPIRE only when the key has no expiry yet (first hit of a window). */
async function upstash(cfg, path, body) {
  const res = await fetch(`${cfg.url}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(2000),
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  return res.json();
}

async function upstashIncr(cfg, key, by, windowSec) {
  const out = await upstash(cfg, '/pipeline', [['INCRBY', key, String(by)], ['TTL', key]]);
  const total = Number(out?.[0]?.result);
  if (!Number.isFinite(total)) throw new Error('upstash bad reply');
  if (Number(out?.[1]?.result) < 0) await upstash(cfg, '', ['EXPIRE', key, String(windowSec)]);
  return total;
}

/** Add `by` to `key` (prefixed here) inside a fixed window of `windowSec`. Returns { total, resetAt }. */
export async function incrBy(key, by, windowSec) {
  const k = PREFIX + key;
  const now = Date.now();
  const cfg = upstashConfig();
  if (cfg) {
    try {
      return { total: await upstashIncr(cfg, k, by, windowSec), resetAt: now + windowSec * 1000 };
    } catch {
      // The store's own outage must not take the chat down, nor turn into "no limit": fall back to memory.
    }
  }
  if (mem.size > 5000) for (const [mk, v] of mem) if (v.resetAt <= now) mem.delete(mk);
  const cur = mem.get(k);
  if (!cur || cur.resetAt <= now) {
    const entry = { total: by, resetAt: now + windowSec * 1000 };
    mem.set(k, entry);
    return entry;
  }
  cur.total += by;
  return cur;
}

/* ---------------- identity ---------------- */

export function clientIp(req) {
  const h = req.headers || {};
  const first = (v) => String(v || '').split(',')[0].trim();
  return first(h['x-vercel-forwarded-for']) || first(h['x-real-ip']) || first(h['x-forwarded-for']) || req.socket?.remoteAddress || 'anon';
}

const hashIp = (ip) => crypto.createHash('sha256').update(`ftk:${ip}`).digest('hex').slice(0, 24);

/* ---------------- rate limit ---------------- */

/** Per-IP fixed windows; `limits` = [[max, windowSec], …], all enforced. → { ok, retryAfter } */
export async function rateLimit(req, bucket, limits) {
  const id = hashIp(clientIp(req));
  let retryAfter = 0;
  for (const [max, windowSec] of limits) {
    const { total, resetAt } = await incrBy(`rl:${bucket}:${windowSec}:${id}`, 1, windowSec);
    if (total > max) retryAfter = Math.max(retryAfter, Math.ceil((resetAt - Date.now()) / 1000), 1);
  }
  return { ok: retryAfter === 0, retryAfter };
}

/* ---------------- spend ledger ---------------- */

const MICRO = 1_000_000; // micro-dollars as integers
const DAY_SEC = 36 * 3600; // a day key outlives its UTC day
export const dayKey = (d = new Date()) => `spend:${d.toISOString().slice(0, 10)}`;
export const estimateTokens = (chars) => Math.ceil(chars / 2); // conservative: Arabic/CJK tokenize heavier than English

/** Reserve the worst-case cost of one call. → { ok, reserved } (micro-dollars; pass to settleSpendUsd). */
export async function reserveSpend(inputChars, maxOutputTokens) {
  const reserved = Math.ceil((estimateTokens(inputChars) * PRICE_IN + maxOutputTokens * PRICE_OUT) * MICRO);
  const ceiling = Math.floor(dailyBudgetUsd() * MICRO);
  const { total } = await incrBy(dayKey(), reserved, DAY_SEC);
  if (total > ceiling) {
    await incrBy(dayKey(), -reserved, DAY_SEC); // give it back: this call does not run
    return { ok: false, reserved: 0 };
  }
  return { ok: true, reserved };
}

/** Replace a reservation with the real dollar cost the chain reported. */
export async function settleSpendUsd(reserved, usd) {
  if (!reserved || !Number.isFinite(usd)) return;
  const delta = Math.ceil(usd * MICRO) - reserved;
  if (delta !== 0) await incrBy(dayKey(), delta, DAY_SEC);
}

/** Test seam. */
export function __resetMemory() {
  mem.clear();
}
