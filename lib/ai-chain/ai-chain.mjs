// ai-chain.mjs — ONE provider chain + latency manager + Jev judge/gate for every platform (ESM, no dependencies but ./jev.mjs).
// Source of truth: ~/projects/mac-scripts/ai-chain/ (vendor with ./vendor.sh; never edit a vendored copy by hand).
// Khurram's /goal 2026-09-27: "DeepSeek, fallback Moonshot, then Haiku if need be; Jev in all; Jev to manage latency."
//
//   · CHAIN: DeepSeek (deepseek-flash = V4.1-Flash, thinking OFF) → Moonshot (kimi-k2.6, thinking OFF — it returns EMPTY text otherwise)
//     → Anthropic Haiku (claude-haiku-4-5, raw fetch, no SDK). A provider is used only if its key is present.
//   · GUARD: only a claude-* name ever reaches the Anthropic endpoint; only deepseek-* reaches DeepSeek; only kimi-*/moonshot-* Moonshot.
//   · STREAMING NEVER MIXES PROVIDERS: fallback/hedge only before the first token of a reply. complete() (nothing reaches a person
//     until it returns) may discard a half-finished answer and move on; streamChat() never does.
//   · LATENCY: per-class budgets (ttftMs = time to first token, totalMs). No first token inside ttftMs → HEDGE: the next provider
//     starts in parallel, the first to stream wins, the loser is aborted (and booked at an estimate — never under-count).
//     A circuit breaker per provider (error rate, consecutive failures, rolling p95 TTFT) skips a slow/broken provider for a cooldown.
//   · SPEND: every attempt is booked through onSpend at dated list prices (PRICE_BOOK carries the source URL + date per price).
//   · FAILOVER: onFailover fires for every switch (error, hedge, breaker-open) so the platform writes system_health / its own ledger.
//   · JEV (pinned jev-1.13.0, via ./jev.mjs): judge() replaces LLM-as-judge calls where calibrated; gate() = rules → grounding → Jev,
//     shadow (parallel/post-response, zero user-visible latency) or enforce (batch/cron: longer timeout + one retry).
//     UNJUDGED IS NOT PASS: publishable is true only for verdict "pass".
//   · Never logs a key: every error string passes redact(), which also strips the literal values of the provider key envs.
//   · 1.1.0 (2026-09-27, from the rollout): (a) every onSpend/onFailover/onAttempt promise is AWAITED before complete()/streamChat()
//     settle (bounded by hookTimeoutMs, default 1.5 s, then a loud log + opts.waitUntil) — on serverless an un-awaited ledger write
//     is lost when the function returns (a live check booked 0 rows); (b) breakers are per provider PER LANE (fast vs deep): a
//     thinking-on call whose first token takes 10–30 s never trips the fast breaker; (c) system may be an array of blocks
//     ({ text, cache }) — the Anthropic leg sends one text block per entry with cache_control on each stable block (max 4).
import { jev as jevCall, costUsd as jevCostUsd, latinScript, JEV_MODEL } from "./jev.mjs";

export const AI_CHAIN_VERSION = "1.1.0";
export { JEV_MODEL };

// ─── PRICES (USD per 1M tokens), each with its source and the date it was read ───────────────────────────────────────────────
// DeepSeek bills by the clock: peak 01:00–04:00 and 06:00–10:00 UTC Mon–Fri (Chinese public holidays are off-peak; we book them
// at peak — over-counting is allowed, under-counting is not). "deepseek-v4-flash" is a LEGACY alias the API still accepts for
// deepseek-flash (DeepSeek-V4.1-Flash); GET /models lists only deepseek-flash + deepseek-v4-pro (2026-09-27).
const DS_SRC = { source: "https://api-docs.deepseek.com/quick_start/pricing", checked: "2026-09-27" };
const KIMI_SRC = { source: "https://platform.kimi.ai/docs/pricing/chat", checked: "2026-09-27" };
const CLAUDE_SRC = { source: "https://platform.claude.com/docs/en/about-claude/pricing", checked: "2026-09-27" };
const DS_FLASH = { provider: "deepseek", peak: { in: 0.30, hit: 0.006, out: 1.20 }, offpeak: { in: 0.15, hit: 0.003, out: 0.60 }, ...DS_SRC };
export const PRICE_BOOK = {
  "deepseek-v4-flash": DS_FLASH,
  "deepseek-flash": DS_FLASH,
  "deepseek-v4-pro": { provider: "deepseek", peak: { in: 1.32, hit: 0.044, out: 3.96 }, offpeak: { in: 0.66, hit: 0.022, out: 1.98 }, ...DS_SRC },
  "kimi-k2.6": { provider: "moonshot", in: 0.95, hit: 0.16, out: 4.0, ...KIMI_SRC },
  "kimi-k3": { provider: "moonshot", in: 3.0, hit: 0.30, out: 15.0, ...KIMI_SRC },
  "kimi-k2.7-code": { provider: "moonshot", in: 0.95, hit: 0.19, out: 4.0, ...KIMI_SRC },
  "kimi-k2.7-code-highspeed": { provider: "moonshot", in: 1.90, hit: 0.38, out: 8.0, ...KIMI_SRC },
  "claude-haiku-4-5": { provider: "anthropic", in: 1.0, hit: 0.10, write: 1.25, out: 5.0, ...CLAUDE_SRC },
};
const UNKNOWN_PRICE = { in: 3.0, hit: 0.30, write: 3.75, out: 15.0, source: "unknown model — booked at the dearest listed rate", checked: "2026-09-27" };

/** DeepSeek peak window (UTC): 01–04 and 06–10, Monday–Friday. */
export function isDeepSeekPeak(d = new Date()) {
  const day = d.getUTCDay(); if (day === 0 || day === 6) return false;
  const h = d.getUTCHours(); return (h >= 1 && h < 4) || (h >= 6 && h < 10);
}
/** Rates in force for a model at a moment. Dated suffixes (claude-haiku-4-5-20251001) resolve to the base entry. */
export function priceFor(model, at = new Date()) {
  const key = PRICE_BOOK[model] ? model : Object.keys(PRICE_BOOK).find((k) => String(model).startsWith(k + "-"));
  const p = key ? PRICE_BOOK[key] : null;
  if (!p) return { ...UNKNOWN_PRICE, model, known: false };
  const r = p.peak ? (isDeepSeekPeak(at) ? p.peak : p.offpeak) : p;
  return { in: r.in, hit: r.hit, write: p.write ?? r.in, out: r.out, source: p.source, checked: p.checked, model: key, known: true, peak: p.peak ? isDeepSeekPeak(at) : undefined };
}
/** USD for one call. input = uncached input tokens; cacheRead/cacheWrite booked at their own rates. */
export function costUsd(model, u, at = new Date()) {
  const r = priceFor(model, at);
  return ((u.input || 0) * r.in + (u.cacheRead || 0) * r.hit + (u.cacheWrite || 0) * r.write + (u.output || 0) * r.out) / 1e6;
}

// ─── PROVIDERS + GUARD ───────────────────────────────────────────────────────────────────────────────────────────────────────
export const DEFAULT_PROVIDERS = {
  // model: "deepseek-flash" is the id GET /models lists (2026-09-27) and the only flash id the khurrambadar gateway accepts;
  // "deepseek-v4-flash" is the legacy alias of the SAME model (same price) — pass models:{deepseek:"deepseek-v4-flash"} to keep it.
  // baseEnv: platforms that reach DeepSeek through the khurrambadar gateway set DEEPSEEK_BASE_URL (their DEEPSEEK_API_KEY is then a
  // gateway bearer, not a DeepSeek key).
  deepseek: { kind: "openai", url: "https://api.deepseek.com/chat/completions", baseEnv: "DEEPSEEK_BASE_URL", keyEnv: "DEEPSEEK_API_KEY", model: "deepseek-flash", modelRe: /^deepseek-[a-z0-9.-]+$/ },
  // noTemperature: measured 2026-09-27 — kimi-k2.6 answers 400 "invalid temperature: only 0.6 is allowed" to temperature 0, and
  // kimi-k3 allows only 1 (iman CLAUDE.md). A caller's temperature is therefore never forwarded to Moonshot (its fixed default applies).
  moonshot: { kind: "openai", url: "https://api.moonshot.ai/v1/chat/completions", keyEnv: "MOONSHOT_API_KEY", model: "kimi-k2.6", modelRe: /^(kimi|moonshot)-[a-z0-9.-]+$/, noTemperature: true },
  anthropic: { kind: "anthropic", url: "https://api.anthropic.com/v1/messages", keyEnv: "ANTHROPIC_API_KEY", model: "claude-haiku-4-5", modelRe: /^claude-[a-z0-9.-]+$/ },
};
export const DEFAULT_ORDER = ["deepseek", "moonshot", "anthropic"];
const KEY_ENVS = ["DEEPSEEK_API_KEY", "MOONSHOT_API_KEY", "ANTHROPIC_API_KEY", "TYPESAFE_API_KEY"];

/** THE GUARD: a name that is not a Claude model never reaches the Anthropic endpoint (kimi-*, deepseek-* → throw). */
export function anthropicModel(model) {
  if (!/^claude-[a-z0-9.-]+$/.test(String(model))) throw new Error(`anthropicModel guard: "${model}" is not a Claude model — refusing to send it to Anthropic`);
  return model;
}
/** Same idea for every provider: the model must belong to the provider it is sent to. */
export function assertModelFor(providerName, cfg, model) {
  if (cfg.kind === "anthropic") return anthropicModel(model);
  if (cfg.modelRe && !cfg.modelRe.test(String(model))) throw new Error(`model guard: "${model}" does not belong to provider ${providerName}`);
  return model;
}

// ─── REDACTION ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
const SECRET_SHAPES = [/sk-[A-Za-z0-9_-]{16,}/g, /AIza[0-9A-Za-z_-]{30,}/g, /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, /Bearer\s+[A-Za-z0-9._-]{16,}/gi, /(?:x-api-key|api[_-]?key|password|secret|token)["']?\s*[:=]\s*["']?[A-Za-z0-9._-]{8,}/gi];
/** Strips secret shapes AND the literal values of the provider key envs from any string. */
export function redact(s, env = process.env) {
  let out = String(s ?? "");
  for (const k of KEY_ENVS) { const v = env?.[k]; if (v && v.length >= 8) out = out.split(v).join("[redacted]"); }
  for (const re of SECRET_SHAPES) out = out.replace(re, "[redacted]");
  return out.length > 400 ? out.slice(0, 400) + "…" : out;
}

// ─── LATENCY BUDGETS ─────────────────────────────────────────────────────────────────────────────────────────────────────────
// ttftMs: no first content token by then → hedge to the next provider. totalMs: hard ceiling for the whole call.
// Defaults set from the live bench (ROLLOUT.md § Bench, 2026-09-27, this Mac): TTFT medians DeepSeek 742 / Moonshot 631 / Haiku 640 ms, all p95 < 0.9 s, well under
// 2 s for short prompts, so chat hedges at 2.5 s; long-context calls should pass their own budget.
export const DEFAULT_BUDGETS = {
  chat: { ttftMs: 2500, totalMs: 45000 },     // a person is watching a stream
  complete: { ttftMs: 5000, totalMs: 60000 }, // a person waits for a finished answer (marking, a lesson)
  batch: { ttftMs: 20000, totalMs: 150000 },  // cron / build-time content; hedging is mostly about dead providers here
  deep: { ttftMs: 30000, totalMs: 180000 },   // thinking enabled: the first CONTENT token comes after the reasoning
};

// ─── CIRCUIT BREAKER ─────────────────────────────────────────────────────────────────────────────────────────────────────────
export class Breaker {
  constructor(o = {}) {
    this.window = o.window ?? 20; this.minSamples = o.minSamples ?? 6; this.maxErrorRate = o.errorRate ?? 0.5;
    this.maxConsecutive = o.consecutive ?? 3; this.slowTtftMs = o.slowTtftMs ?? 8000; this.cooldownMs = o.cooldownMs ?? 30000;
    this.now = o.now ?? Date.now; this.samples = []; this.consecutive = 0; this.st = "closed"; this.openedAt = 0; this.reason = ""; this.trial = false;
  }
  /** s = { ok:boolean, ttftMs?:number (lower bound when the call was slow/cancelled), cancelled?:boolean } */
  record(s) {
    if (this.st === "half-open") {
      this.trial = false;
      if (s.ok && !s.slow) { this.st = "closed"; this.samples = []; this.consecutive = 0; this.reason = ""; return; }
      this._open(s.ok ? "half-open trial was slow" : "half-open trial failed"); return;
    }
    this.samples.push({ ok: !!s.ok, ttftMs: s.ttftMs ?? null }); if (this.samples.length > this.window) this.samples.shift();
    this.consecutive = s.ok ? 0 : this.consecutive + 1;
    if (this.st !== "closed") return;
    if (this.consecutive >= this.maxConsecutive) return this._open(`${this.consecutive} consecutive failures`);
    if (this.samples.length >= this.minSamples) {
      const er = this.samples.filter((x) => !x.ok).length / this.samples.length;
      if (er >= this.maxErrorRate) return this._open(`error rate ${(er * 100).toFixed(0)}%`);
      const p = this.p95();
      if (p !== null && p > this.slowTtftMs) return this._open(`p95 TTFT ${p} ms > ${this.slowTtftMs} ms`);
    }
  }
  _open(reason) { this.st = "open"; this.openedAt = this.now(); this.reason = reason; this.trial = false; }
  p95() { const t = this.samples.map((x) => x.ttftMs).filter((x) => typeof x === "number").sort((a, b) => a - b); if (t.length < this.minSamples) return null; return t[Math.min(t.length - 1, Math.ceil(0.95 * t.length) - 1)]; }
  state() { if (this.st === "open" && this.now() - this.openedAt >= this.cooldownMs) return "half-open-ready"; return this.st; }
  /** May a request go to this provider now? Past the cooldown exactly one trial request is let through (half-open). */
  allow() {
    if (this.st === "closed") return true;
    if (this.st === "open" && this.now() - this.openedAt >= this.cooldownMs) { this.st = "half-open"; this.trial = true; return true; }
    return false; // open inside the cooldown, or half-open with its one trial already in flight
  }
  stats() { const n = this.samples.length; return { state: this.state(), reason: this.reason, n, errorRate: n ? this.samples.filter((x) => !x.ok).length / n : 0, p95TtftMs: this.p95() }; }
}
/** Breakers live per process (a warm serverless instance keeps them; a cold start begins closed — by design).
 *  Keys: "<provider>" = the FAST lane (thinking off), "<provider>:deep" = the DEEP lane (thinking on / latency "deep"). */
const SHARED_BREAKERS = new Map();
/** Which breaker lane a request belongs to. Deep (reasoning) calls are expected to be slow to first token. */
export const laneOf = (req) => (req?.deep || req?.latency === "deep" ? "deep" : "fast");

// ─── SYSTEM BLOCKS ───────────────────────────────────────────────────────────────────────────────────────────────────────────
/** Anthropic allows at most 4 cache_control breakpoints per request; the chain uses them all on system blocks. */
export const MAX_CACHE_BREAKPOINTS = 4;
/**
 * system: string | Array<string | { text, cache? }> → [{ text, cache }]. A plain string is STABLE (cache: true); mark a
 * per-request snippet { text, cache: false } and put it AFTER the stable blocks so the cached prefix never contains it.
 */
export function systemBlocks(system) {
  return (Array.isArray(system) ? system.flat() : [system])
    .map((b) => (b && typeof b === "object" ? { text: String(b.text ?? ""), cache: b.cache !== false } : { text: String(b ?? ""), cache: true }))
    .filter((b) => b.text.trim());
}
/** The Anthropic `system` array: one text block per entry, cache_control on each stable block (the LAST 4 if there are more). */
export function anthropicSystem(blocks) {
  const stable = blocks.map((b, i) => (b.cache ? i : -1)).filter((i) => i >= 0);
  const marked = new Set(stable.slice(-MAX_CACHE_BREAKPOINTS));
  return blocks.map((b, i) => (marked.has(i) ? { type: "text", text: b.text, cache_control: { type: "ephemeral" } } : { type: "text", text: b.text }));
}

// ─── MESSAGES + SSE ──────────────────────────────────────────────────────────────────────────────────────────────────────────
/** Drops empty turns, merges consecutive same-role turns, starts with the user (all three providers want that). */
export function cleanMessages(msgs = []) {
  const out = [];
  for (const m of msgs) { const c = String(m?.content ?? "").trim(); if (!c || (m.role !== "user" && m.role !== "assistant")) continue; const last = out[out.length - 1]; if (last && last.role === m.role) last.content += "\n\n" + c; else out.push({ role: m.role, content: c }); }
  while (out.length && out[0].role !== "user") out.shift();
  return out;
}
async function* sseEvents(body, signal) {
  const reader = body.getReader(); const dec = new TextDecoder(); let buf = "";
  try {
    for (;;) {
      if (signal?.aborted) throw signal.reason ?? new Error("aborted");
      const { done, value } = await reader.read(); if (done) break;
      buf += dec.decode(value, { stream: true }); let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
        if (!line.startsWith("data:")) continue; const d = line.slice(5).trim(); if (!d || d === "[DONE]") continue;
        try { yield JSON.parse(d); } catch { /* keep-alive / partial */ }
      }
    }
  } finally { try { reader.releaseLock(); } catch {} }
}

// ─── ONE ATTEMPT AGAINST ONE PROVIDER (always streamed, so TTFT is observable) ───────────────────────────────────────────────
async function attempt(ctx, a, req, onFirst, onDelta) {
  const { cfg, model } = a; const key = ctx.env[cfg.keyEnv];
  const blocks = systemBlocks(req.system);
  // JSON instruction goes LAST and uncached so it never changes a cached prefix.
  if (req.json && !/json/i.test(blocks.map((b) => b.text).join("\n") + JSON.stringify(req.messages))) blocks.push({ text: "Reply with a single JSON object and nothing else.", cache: false });
  const sys = blocks.map((b) => b.text).join("\n\n"); // OpenAI-shaped providers: one system message, stable first → auto prefix cache
  const messages = cleanMessages(req.messages);
  if (!messages.length) throw new Error("no user message");
  let url = cfg.url, headers, body;
  if (cfg.kind === "anthropic") {
    const sysBlocks = anthropicSystem(blocks);
    headers = { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" };
    body = { model: anthropicModel(model), max_tokens: req.maxTokens, stream: true, messages, ...(sysBlocks.length ? { system: sysBlocks } : {}), ...(req.temperature !== undefined ? { temperature: req.temperature } : {}) };
  } else {
    headers = { "content-type": "application/json", authorization: `Bearer ${key}` };
    body = {
      model: assertModelFor(a.p, cfg, model), max_tokens: req.maxTokens, stream: true, stream_options: { include_usage: true },
      messages: sys ? [{ role: "system", content: sys }, ...messages] : messages,
      // Both are reasoning models by default and can spend the whole budget on hidden reasoning → EMPTY content
      // (DeepSeek measured 2026-09-13 in yusuf; Kimi k2.6 in khurrambadar). Thinking is OFF unless the caller asks for deep.
      thinking: { type: req.deep ? "enabled" : "disabled" },
      ...(req.temperature !== undefined && !cfg.noTemperature ? { temperature: req.temperature } : {}),
      ...(req.json ? { response_format: { type: "json_object" } } : {}),
    };
  }
  const res = await ctx.fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: a.ctl.signal });
  if (!res.ok || !res.body) { const t = await res.text().catch(() => ""); const e = new Error(`${a.p} HTTP ${res.status}: ${t.slice(0, 200)}`); e.status = res.status; throw e; }
  const u = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reported: false };
  for await (const ev of sseEvents(res.body, a.ctl.signal)) {
    let t = "";
    if (cfg.kind === "anthropic") {
      if (ev.type === "message_start" && ev.message?.usage) { const mu = ev.message.usage; u.input = mu.input_tokens || 0; u.cacheRead = mu.cache_read_input_tokens || 0; u.cacheWrite = mu.cache_creation_input_tokens || 0; u.reported = true; if (ev.message.model) a.servedModel = ev.message.model; }
      else if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") t = ev.delta.text || "";
      else if (ev.type === "message_delta" && ev.usage) u.output = ev.usage.output_tokens || u.output;
      else if (ev.type === "error") throw new Error(`${a.p} stream error: ${JSON.stringify(ev.error).slice(0, 200)}`);
    } else {
      const ch = ev.choices?.[0]; t = ch?.delta?.content || "";
      const uu = ev.usage || ch?.usage;
      if (uu) {
        const hit = Number(uu.prompt_cache_hit_tokens ?? uu.cached_tokens ?? uu.prompt_tokens_details?.cached_tokens ?? 0);
        u.cacheRead = hit; u.input = Number(uu.prompt_cache_miss_tokens ?? Math.max(0, Number(uu.prompt_tokens || 0) - hit)); u.output = Number(uu.completion_tokens || 0); u.reported = true;
      }
      if (ev.model) a.servedModel = ev.model;
    }
    if (t) { if (a.firstAt == null) { a.firstAt = ctx.now(); onFirst(a); } a.text += t; onDelta(a, t); }
  }
  return u;
}

// ─── THE CHAIN ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
export class ChainError extends Error { constructor(msg, attempts) { super(msg); this.name = "ChainError"; this.attempts = attempts; } }

/**
 * createChain(opts) → { complete, streamChat, breakers, available }
 *  opts.env (default process.env) · opts.fetch · opts.order (default DeepSeek → Moonshot → Haiku) · opts.models {deepseek:"…"} ·
 *  opts.budgets (merged over DEFAULT_BUDGETS) · opts.hedge (default true) · opts.breaker (Breaker options) · opts.breakers (Map;
 *  default = one per process; keys "<p>" fast lane, "<p>:deep" deep lane) · opts.deepBreaker (options for the deep lane; default
 *  slowTtftMs = 1.5 × the deep TTFT budget) · opts.onSpend(rec) · opts.onFailover(ev) · opts.onAttempt(ev) — each may return a
 *  promise and is AWAITED before the call settles, bounded by opts.hookTimeoutMs (default 1500) · opts.waitUntil(promise) (e.g.
 *  Vercel's waitUntil) receives hooks still pending at that bound · opts.log (default console.error, always redacted) · opts.now
 */
export function createChain(opts = {}) {
  const env = opts.env || process.env;
  const ctx = { env, fetch: opts.fetch || globalThis.fetch, now: opts.now || Date.now };
  const providers = { ...DEFAULT_PROVIDERS, ...(opts.providers || {}) };
  for (const [p, c] of Object.entries(providers)) if (c.baseEnv && env[c.baseEnv] && !opts.providers?.[p]?.url) providers[p] = { ...c, url: String(env[c.baseEnv]).trim().replace(/\/+$/, "") + "/chat/completions" };
  for (const [p, m] of Object.entries(opts.models || {})) if (providers[p]) providers[p] = { ...providers[p], model: m };
  const order = (opts.order || DEFAULT_ORDER).filter((p) => providers[p]);
  // Guard at construction too: a misconfigured model fails loudly at boot, not on the first failover.
  for (const p of order) assertModelFor(p, providers[p], providers[p].model);
  const budgets = { ...DEFAULT_BUDGETS, ...(opts.budgets || {}) };
  const breakers = opts.breakers || SHARED_BREAKERS;
  const deepBreakerOpts = { ...(opts.breaker || {}), slowTtftMs: Math.max(opts.breaker?.slowTtftMs ?? 8000, Math.round(1.5 * budgets.deep.ttftMs)), ...(opts.deepBreaker || {}) };
  // One breaker per provider PER LANE. A reasoning call's 10–30 s TTFT is normal for the deep lane and must never open the fast one.
  const breaker = (p, lane = "fast") => {
    const k = lane === "deep" ? `${p}:deep` : p;
    if (!breakers.has(k)) breakers.set(k, new Breaker({ ...(lane === "deep" ? deepBreakerOpts : opts.breaker || {}), now: ctx.now }));
    return breakers.get(k);
  };
  const hookTimeoutMs = opts.hookTimeoutMs ?? 1500;
  const log = (msg) => { try { (opts.log || console.error)(redact(msg, env)); } catch {} };
  const safe = async (fn, arg) => { if (!fn) return; try { await fn(arg); } catch (e) { log(`ai-chain hook failed: ${e?.message || e}`); } };
  const available = () => order.filter((p) => Boolean(env[providers[p].keyEnv]));

  function book(task, a, u, estimated) {
    const model = a.servedModel || a.model; const at = new Date(ctx.now());
    const usd = costUsd(model, u, at); const pr = priceFor(model, at);
    return safe(opts.onSpend, { task, provider: a.p, model, input: u.input, output: u.output, cacheRead: u.cacheRead, cacheWrite: u.cacheWrite, usd, estimated: !!estimated, outcome: a.outcome, lane: a.lane, priceSource: pr.source, priceChecked: pr.checked, at: at.toISOString() });
  }
  const estimateInput = (req) => Math.ceil((systemBlocks(req.system).reduce((n, b) => n + b.text.length + 2, 0) + (req.messages || []).reduce((n, m) => n + String(m.content || "").length, 0)) / 3);

  /** The race: primary first; hedge on TTFT; fallback on error; first token decides the winner; losers aborted. */
  function run(req, mode, onText) {
    const task = req.task || "unnamed"; const budget = { ...(budgets[req.latency || (mode === "stream" ? "chat" : "complete")] || budgets.complete), ...(req.budget || {}) };
    const cands = available();
    if (!cands.length) return Promise.reject(new ChainError(`${task}: no AI provider key present (${order.map((p) => providers[p].keyEnv).join(", ")})`, []));
    const t0 = ctx.now(); const attempts = []; const running = new Set(); const skipped = [];
    let idx = 0, winner = null, settled = false, hedgeTimer = null, totalTimer = null, lastErr = null, lastStarted = null;
    const lane = laneOf(req); const brk = (p) => breaker(p, lane);
    // Every hook promise (spend, failover, attempt) is tracked and awaited before the call settles — see flush().
    const pending = new Set();
    const track = (pr) => { if (!pr || typeof pr.then !== "function") return; pending.add(pr); pr.then(() => pending.delete(pr), () => pending.delete(pr)); };
    const hook = (fn, arg) => track(safe(fn, arg));

    /** Awaits every pending hook, at most hookTimeoutMs (real clock). Never throws. Returns what happened for result.hooks. */
    async function flush() {
      const f0 = Date.now(); const n = pending.size; if (!n) return { awaited: 0, pending: 0, ms: 0, timedOut: false };
      let timer; const deadline = new Promise((res) => { timer = setTimeout(res, hookTimeoutMs, "timeout"); });
      const all = Promise.allSettled([...pending]);
      const r = await Promise.race([all.then(() => "done"), deadline]); clearTimeout(timer);
      if (r === "timeout") {
        const left = pending.size;
        log(`ai-chain ${task}: LEDGER HOOKS NOT FLUSHED — ${left} of ${n} spend/failover/attempt hook(s) still pending after ${hookTimeoutMs} ms; returning to the user without them${opts.waitUntil ? " (handed to waitUntil)" : " — on serverless these rows may be LOST"}`);
        if (opts.waitUntil) { try { opts.waitUntil(all); } catch (e) { log(`ai-chain waitUntil threw: ${e?.message || e}`); } }
        return { awaited: n, pending: left, ms: Date.now() - f0, timedOut: true };
      }
      return { awaited: n, pending: 0, ms: Date.now() - f0, timedOut: false };
    }

    return new Promise((resolve, reject) => {
      const finish = (fn, v) => {
        if (settled) return; settled = true; clearTimeout(hedgeTimer); clearTimeout(totalTimer);
        for (const o of running) cancel(o, "settled");
        flush().then((h) => { if (v && typeof v === "object") v.hooks = h; fn(v); });
      };
      const fail = (msg) => finish(reject, new ChainError(`${task}: ${msg}${lastErr ? ` — last error: ${redact(lastErr.message || lastErr, env)}` : ""}`, attempts.map(view)));
      const view = (a) => ({ provider: a.p, model: a.servedModel || a.model, outcome: a.outcome, ttftMs: a.firstAt != null ? a.firstAt - a.t0 : null, totalMs: a.endAt != null ? a.endAt - a.t0 : null, reason: a.why });

      function nextProvider() {
        while (idx < cands.length) { const p = cands[idx++]; if (brk(p).allow()) return p; skipped.push(p); hook(opts.onFailover, { task, from: p, to: null, reason: "breaker-open", lane, detail: brk(p).stats().reason, at: new Date(ctx.now()).toISOString() }); }
        // Fail OPEN: every remaining provider is tripped and nothing is running → try the first tripped one anyway rather than refuse.
        if (!running.size && !winner && skipped.length) return skipped.shift();
        return null;
      }
      function start(why) {
        if (settled) return false;
        const p = nextProvider(); if (!p) return false;
        const cfg = providers[p];
        const a = { p, cfg, model: cfg.model, lane, ctl: new AbortController(), t0: ctx.now(), firstAt: null, endAt: null, text: "", outcome: "running", why };
        attempts.push(a); running.add(a);
        if (lastStarted) hook(opts.onFailover, { task, from: lastStarted.p, to: p, reason: why, lane, detail: lastErr ? redact(lastErr.message || lastErr, env) : undefined, at: new Date(ctx.now()).toISOString() });
        if (why !== "primary") log(`ai-chain ${task}: ${why} → ${p}`);
        lastStarted = a;
        armHedge();
        attempt(ctx, a, req, onFirst, onDelta).then((u) => done(a, u), (e) => failed(a, e));
        return true;
      }
      function armHedge() {
        clearTimeout(hedgeTimer);
        if (opts.hedge === false || winner) return;
        hedgeTimer = setTimeout(() => { if (!winner && !settled) start("hedge-ttft"); }, budget.ttftMs);
      }
      function onFirst(a) {
        if (winner) return;
        winner = a; clearTimeout(hedgeTimer);
        for (const o of running) if (o !== a) cancel(o, "lost-hedge");
      }
      function onDelta(a, t) { if (winner === a && mode === "stream" && onText) { try { onText(t); } catch (e) { log(`onText threw: ${e?.message || e}`); } } }
      function cancel(a, why) {
        if (a.outcome !== "running") return;
        a.outcome = why === "settled" ? "aborted" : "cancelled"; a.endAt = ctx.now(); running.delete(a);
        try { a.ctl.abort(new Error(`ai-chain: ${why}`)); } catch {}
        // A slow loser tells the breaker how slow it was (a lower bound). Never counted as an error.
        brk(a.p).record({ ok: true, slow: true, ttftMs: a.endAt - a.t0 });
        hook(opts.onAttempt, { task, ...view(a) });
        // Conservative booking: the provider may bill the prompt it had started processing.
        track(book(task, a, { input: estimateInput(req), output: Math.ceil(a.text.length / 3), cacheRead: 0, cacheWrite: 0 }, true));
      }
      function done(a, u) {
        if (a.outcome !== "running") return; // cancelled while its stream wound down
        running.delete(a); a.endAt = ctx.now();
        if (!a.text.trim()) return failed(a, new Error(`${a.p}: empty completion`), true);
        let json;
        if (req.json) { try { json = JSON.parse(a.text.trim().replace(/^```(?:json)?\s*|\s*```$/g, "")); } catch { return failed(a, new Error(`${a.p}: JSON mode returned unparsable text`), true); } }
        a.outcome = "ok";
        brk(a.p).record({ ok: true, ttftMs: a.firstAt - a.t0 });
        if (!u.reported) { u.input = estimateInput(req); u.output = Math.ceil(a.text.length / 3); }
        hook(opts.onAttempt, { task, ...view(a) });
        track(book(task, a, u, !u.reported));
        const first = cands[0];
        finish(resolve, { text: a.text, json, provider: a.p, model: a.servedModel || a.model, degraded: a.p !== first, ttftMs: a.firstAt - t0, totalMs: a.endAt - t0, usage: { input: u.input, output: u.output, cacheRead: u.cacheRead, cacheWrite: u.cacheWrite }, usd: costUsd(a.servedModel || a.model, u, new Date(ctx.now())), attempts: attempts.map(view) });
      }
      function failed(a, e, alreadyRemoved) {
        if (settled || (a.outcome !== "running" && !alreadyRemoved)) return;
        running.delete(a); a.endAt = a.endAt ?? ctx.now(); a.outcome = "error"; lastErr = e;
        brk(a.p).record({ ok: false });
        hook(opts.onAttempt, { task, ...view(a), error: redact(e?.message || e, env) });
        if (a.text) track(book(task, a, { input: estimateInput(req), output: Math.ceil(a.text.length / 3), cacheRead: 0, cacheWrite: 0 }, true));
        if (winner === a) {
          // STREAMING NEVER MIXES PROVIDERS: part of this reply already reached the person → stop, never stitch.
          if (mode === "stream") return fail(`${a.p} failed mid-reply after ${a.text.length} chars (not stitched onto another provider)`);
          winner = null; // complete(): nothing reached anyone yet → discard and move on
        }
        if (winner) return;
        if (!running.size) { if (!start(`error:${a.p}`)) fail(`every provider failed (${attempts.map((x) => `${x.p}:${x.outcome}`).join(", ")})`); }
      }
      totalTimer = setTimeout(() => fail(`total budget ${budget.totalMs} ms exceeded`), budget.totalMs);
      if (!start("primary")) fail("no provider could start");
    });
  }

  /**
   * complete({ task, system, context?, user? | messages?, maxTokens, json?, temperature?, deep?, latency?, budget? })
   * → { text, json?, provider, model, degraded, ttftMs, totalMs, usage, usd, attempts }
   * Stable prefix first (system → context → user) so DeepSeek/Moonshot auto-cache and Anthropic's cache_control both hit.
   */
  async function complete(g) {
    const system = [g.system, g.context].flat().filter(Boolean);
    const messages = g.messages || [{ role: "user", content: g.user }];
    if (!cleanMessages(messages).length) throw new ChainError(`${g.task || "unnamed"}: complete() needs a non-empty user message`, []);
    return run({ ...g, system, messages, maxTokens: g.maxTokens || 1024, latency: g.latency || (g.deep ? "deep" : "complete") }, "complete");
  }

  /**
   * streamChat({ task, system (string|string[], STABLE FIRST), messages, maxTokens, onText, latency?, budget?,
   *              preJudge?: { state, questions, fallback? }  → runs IN PARALLEL with generation (result.preJudge: Promise)
   *              shadowGate?: gate options                    → runs AFTER the reply (result.gate: Promise; never delays the stream) })
   */
  async function streamChat(g) {
    const pre = g.preJudge ? judge(g.preJudge.state, g.preJudge.questions, { ...g.preJudge, env }) : null;
    const r = await run({ ...g, maxTokens: g.maxTokens || 1024, latency: g.latency || "chat" }, "stream", g.onText);
    if (pre) r.preJudge = pre;
    if (g.shadowGate) { r.gate = gate(r.text, { ...g.shadowGate, mode: "shadow", env }); if (g.onGate) r.gate.then(g.onGate, () => {}); }
    return r;
  }

  // breakers.<p> = fast lane (unchanged shape for /api/health); deepBreakers.<p> = the reasoning lane.
  return { complete, streamChat, available, breakers: Object.fromEntries(order.map((p) => [p, breaker(p)])), deepBreakers: Object.fromEntries(order.map((p) => [p, breaker(p, "deep")])), providers, order };
}

// ─── JEV: judge() instead of LLM-as-judge ────────────────────────────────────────────────────────────────────────────────────
/**
 * judge(state, questions, { timeoutMs=2500, retries=0, fallback?, jevFn?, env? })
 * → { source: "jev" | "fallback" | "none", answers, ms, usd, model }
 * Use where Jev is CALIBRATED for the task (answer matching, relevance, classification). `fallback(state)` must be deterministic
 * (regex, exact match, a rule) and return answers in Jev's shape; with no fallback and no Jev the source is "none" — callers must
 * treat that as UNJUDGED, never as a pass.
 */
export async function judge(state, questions, o = {}) {
  const t0 = Date.now(); const call = o.jevFn || jevCall; let r = null;
  for (let i = 0; i <= (o.retries ?? 0) && !r; i++) r = await call(state, questions, { timeoutMs: o.timeoutMs ?? 2500, env: o.env || process.env, fetch: o.fetch });
  if (r) return { source: "jev", answers: r.answers, ms: Date.now() - t0, usd: jevCostUsd(r), model: r.model };
  if (o.fallback) { try { const a = await o.fallback(state); if (a) return { source: "fallback", answers: a, ms: Date.now() - t0, usd: 0, model: null }; } catch {} }
  return { source: "none", answers: null, ms: Date.now() - t0, usd: 0, model: null };
}
export const answerNoul = (j, k) => { const a = j?.answers?.[k]; return a && a.type === "noul" ? a.noul : null; };
export const answerChoice = (j, k) => { const a = j?.answers?.[k]; return a && a.type === "choice" ? a.choice : null; };

// ─── JEV: gate() — rules → grounding → Jev. UNJUDGED ≠ PASS ─────────────────────────────────────────────────────────────────
/**
 * gate(text, { rules?: [{id, re}], ground?: (text) => {ok, missing?}, source?, questions?, pass?: (answers) => boolean,
 *              mode: "shadow" | "enforce", timeoutMs?, retries?, jevFn?, env?, englishOnly=true })
 * → { verdict: "pass" | "hold" | "unjudged", publishable, reasons[], mode, ms, jevMs, source }
 * enforce defaults: 8 s timeout + one retry (batch/cron only). shadow defaults: 2.5 s, no retry (log only).
 * Default Jev question when `source` is given: "is every claim in `text` supported by `source`?" (noul ≥ 0.5) — calibrate per platform.
 */
export async function gate(text, o = {}) {
  const t0 = Date.now(); const mode = o.mode || "shadow"; const reasons = [];
  const out = (verdict, extra = {}) => ({ verdict, publishable: verdict === "pass", reasons, mode, ms: Date.now() - t0, jevMs: null, source: null, ...extra });
  for (const r of o.rules || []) { r.re.lastIndex = 0; if (r.re.test(String(text))) reasons.push(`rule:${r.id}`); }
  if (reasons.length) return out("hold");
  if (o.ground) { let g; try { g = await o.ground(text); } catch (e) { g = { ok: false, missing: [`ground threw: ${e?.message || e}`] }; } if (!g?.ok) { reasons.push(...(g?.missing?.length ? g.missing.map((m) => `ungrounded:${m}`) : ["ungrounded"])); return out("hold"); } }
  if ((o.englishOnly ?? true) && !latinScript(text)) { reasons.push("non-english: Jev is measured on English only — gate the English twin + a human reviewer"); return out("unjudged"); }
  const questions = o.questions || (o.source != null ? { faithful: { type: "noul", instructions: "Is every factual claim in `text` directly supported by `source`? Answer about support only, not style." } } : null);
  if (!questions) { reasons.push("no Jev question configured"); return out("unjudged"); }
  const state = o.state || (o.source != null ? { text, source: o.source } : { text });
  const j = await judge(state, questions, { timeoutMs: o.timeoutMs ?? (mode === "enforce" ? 8000 : 2500), retries: o.retries ?? (mode === "enforce" ? 1 : 0), jevFn: o.jevFn, env: o.env, fetch: o.fetch });
  if (j.source !== "jev") { reasons.push("jev unavailable (no key, off, or timed out) — UNJUDGED, not published"); return out("unjudged", { jevMs: j.ms }); }
  const pass = o.pass || ((a) => (a?.faithful?.noul ?? 0) >= 0.5);
  let ok = false; try { ok = !!pass(j.answers); } catch { ok = false; }
  if (!ok) reasons.push(`jev:hold ${JSON.stringify(j.answers).slice(0, 200)}`);
  return out(ok ? "pass" : "hold", { jevMs: j.ms, source: "jev", answers: j.answers, usd: j.usd });
}

/**
 * holdAndRetry(generate, gateOpts, { retries = 1 }) — ENFORCE mode for batch/cron content. generate(attempt, lastReasons) → text.
 * → { published: boolean, text: string|null, lastText, gate, attempts }. Hold or unjudged after the retry → NOT published.
 */
export async function holdAndRetry(generate, gateOpts = {}, o = {}) {
  let g = null, text = null;
  for (let i = 0; i <= (o.retries ?? 1); i++) {
    text = await generate(i, g?.reasons || []);
    g = await gate(text, { ...gateOpts, mode: "enforce" });
    if (g.publishable) return { published: true, text, lastText: text, gate: g, attempts: i + 1 };
  }
  return { published: false, text: null, lastText: text, gate: g, attempts: (o.retries ?? 1) + 1 };
}

// ─── JEV: optional "does this need the deeper model?" pre-route (OFF by default — ROLLOUT.md § Bench: it added ~340 ms and bought no accuracy) ──────────────────────
export async function needsDeeper(prompt, o = {}) {
  const j = await judge({ prompt: String(prompt).slice(0, 4000) }, { deeper: { type: "noul", instructions: "Does answering `prompt` correctly need careful multi-step reasoning (multi-step arithmetic, logic puzzles, proofs, multi-hop inference), rather than a direct recall or short conversational reply?" } }, { timeoutMs: o.timeoutMs ?? 1500, jevFn: o.jevFn, env: o.env });
  const p = answerNoul(j, "deeper");
  return { deeper: p == null ? null : p >= (o.threshold ?? 0.5), p, ms: j.ms, source: j.source };
}
