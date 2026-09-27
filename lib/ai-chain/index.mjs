// The ONE place this repo builds its AI chain (his /goal 2026-09-27: "DeepSeek, fallback Moonshot, then Haiku; Jev in all").
//   DeepSeek → Moonshot (kimi-k2.6) → Anthropic Haiku, each used only if its key is present.
//   On this platform DEEPSEEK_API_KEY is a bearer for the khurrambadar gateway and DEEPSEEK_BASE_URL points at it
//   (https://khurrambadar.com/api/gateway); the chain then calls <base>/chat/completions.
// ai-chain.mjs / jev.mjs are VENDORED (see VENDORED.txt) — edit ~/projects/mac-scripts/ai-chain, then re-run vendor.sh.
import { createChain } from './ai-chain.mjs';
import { spendLedger, failoverLedger } from './ledger.mjs';

export { gate, judge, holdAndRetry, answerNoul, answerChoice, anthropicModel, ChainError, redact } from './ai-chain.mjs';

// The Digital Czar keeps TODAY's tier: the old shim sent claude-sonnet-4-6 to the gateway as deepseek-v4-pro (thinking off).
// Fallbacks are kimi-k2.6 then claude-haiku-4-5 — a Haiku answer is a tier DOWN from the Sonnet the old shim fell back to.
export const CHAT_MODELS = { deepseek: 'deepseek-v4-pro' };

/** makeChain({ models?, env?, fetch?, breakers? }) — env/fetch/breakers are for tests and the local fallback proof only. */
export function makeChain(o = {}) {
  return createChain({
    env: o.env,
    fetch: o.fetch,
    breakers: o.breakers,
    models: o.models,
    onSpend: o.onSpend || spendLedger,
    onFailover: o.onFailover || failoverLedger,
  });
}

let chatChain = null;
/** Warm-instance singleton for /api/chat (breakers survive across requests on one instance, by design). */
export function getChatChain() {
  if (!chatChain) chatChain = makeChain({ models: CHAT_MODELS });
  return chatChain;
}

/**
 * Keep a promise alive after the response on Vercel (the shadow Jev gate runs AFTER the reply, so it adds no latency).
 * Uses the platform's request context when present (what @vercel/functions' waitUntil does); elsewhere it just floats.
 */
export function afterResponse(p) {
  const safe = Promise.resolve(p).catch((e) => console.warn('[jev] shadow task failed:', String(e?.message || e).slice(0, 160)));
  try { const ctx = globalThis[Symbol.for('@vercel/request-context')]?.get?.(); ctx?.waitUntil?.(safe); } catch { /* not on Vercel */ }
  return safe;
}
