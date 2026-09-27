// jev.mjs — TypeSafe "Jev" (System One) client, the ONE contract for every platform (ESM). Vendored per repo; source of truth: ~/projects/mac-scripts/jev/
//   · a JUDGE, never a writer: typed questions (noul | choice | score) over a `state`; it cannot generate text
//   · model PINNED to jev-1.13.0 (aliases move without notice; re-measure before changing)
//   · inert without TYPESAFE_API_KEY (returns null, never throws); JEV_ENABLED=0 switches it off with the key present
//   · 2,500 ms timeout (measured 1.2 s median / 1.5 s p95 from PK/UAE for a 9-question gate), one retry on 429/529, null on ANY failure
//   · state carries only the text under judgment: sanitize() strips secret shapes and identity-looking keys as a backstop
//   · never logs the key; never a trading decision (Jev judges copy, claims, headlines, drafts — never direction or entry)
export const JEV_MODEL = "jev-1.13.0";
export const JEV_URL = "https://api.typesafe.ai/v1/systemone";
export const JEV_TIMEOUT_MS = 2500;
export const JEV_PRICE_PER_M_INPUT = 0.042; // USD, output free (vendor pricing 2026-09-22)

const SECRET_SHAPES = [/sk-[A-Za-z0-9_-]{16,}/g, /AIza[0-9A-Za-z_-]{30,}/g, /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, /Bearer\s+[A-Za-z0-9._-]{16,}/gi, /(?:password|passwd|secret|api[_-]?key|token)\s*[:=]\s*\S{8,}/gi];
const IDENTITY_KEYS = /^(user_?id|owner_?id|lid|learner_?id|email|phone|ip|visitor_?id|session|jwt|token|api_?key|authorization|system_?prompt|systemPrompt)$/i;
export const MAX_STATE_CHARS = 60000; // ~15k tokens; the API takes 32k tokens of state

export function jevEnabled(env = process.env) { return Boolean(env.TYPESAFE_API_KEY) && env.JEV_ENABLED !== "0"; }

export function sanitize(value, depth = 0) {
  if (depth > 6) return "[depth]";
  if (typeof value === "string") { let s = value; for (const re of SECRET_SHAPES) s = s.replace(re, "[redacted]"); return s.length > MAX_STATE_CHARS ? s.slice(0, MAX_STATE_CHARS) + " …[truncated]" : s; }
  if (Array.isArray(value)) return value.slice(0, 200).map((v) => sanitize(v, depth + 1));
  if (value && typeof value === "object") { const out = {}; for (const [k, v] of Object.entries(value)) { if (IDENTITY_KEYS.test(k)) continue; out[k] = sanitize(v, depth + 1); } return out; }
  return value;
}
/** Latin-script guard: Jev is measured on English only. */
export function latinScript(text) { const letters = String(text).match(/\p{L}/gu) || []; if (!letters.length) return false; return letters.filter((c) => /[A-Za-zÀ-ɏ]/.test(c)).length / letters.length >= 0.95; }

/** One call, all questions answered in parallel. Returns {answers, usage, ms, model} or null. */
export async function jev(state, questions, opts = {}) {
  const env = opts.env || process.env; if (!jevEnabled(env)) return null;
  const doFetch = opts.fetch || globalThis.fetch; if (!doFetch) return null;
  const body = JSON.stringify({ model: JEV_MODEL, state: sanitize(state), questions });
  const timeoutMs = opts.timeoutMs || Number(env.JEV_TIMEOUT_MS) || JEV_TIMEOUT_MS; const t0 = Date.now();
  for (let attempt = 0; attempt < 2; attempt++) {
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), timeoutMs);
    try {
      const r = await doFetch(JEV_URL, { method: "POST", headers: { authorization: `Bearer ${env.TYPESAFE_API_KEY}`, "content-type": "application/json" }, body, signal: ctl.signal });
      if (r.status === 429 || r.status === 529) { clearTimeout(timer); await new Promise((s) => setTimeout(s, 400)); continue; }
      if (!r.ok) return null;
      const j = await r.json(); if (!j || typeof j.answers !== "object") return null;
      const out = { answers: j.answers, usage: j.usage || { input_tokens: 0, output_tokens: 0 }, ms: Date.now() - t0, model: j.model || JEV_MODEL };
      if (opts.onUsage) { try { await opts.onUsage(out); } catch {} }
      return out;
    } catch { return null; } finally { clearTimeout(timer); }
  }
  return null;
}
export const noul = (r, k) => { const a = r?.answers?.[k]; return a && a.type === "noul" ? a.noul : null; };
export const choice = (r, k) => { const a = r?.answers?.[k]; return a && a.type === "choice" ? { choice: a.choice, confidence: a.confidence, probabilities: a.probabilities } : null; };
export const score = (r, k) => { const a = r?.answers?.[k]; return a && a.type === "score" ? { score: a.score, confidence: a.confidence, probabilities: a.probabilities } : null; };
export const costUsd = (r) => ((r?.usage?.input_tokens || 0) / 1e6) * JEV_PRICE_PER_M_INPUT;
