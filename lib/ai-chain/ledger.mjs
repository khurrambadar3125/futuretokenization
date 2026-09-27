// Minimal AI spend + failover ledger for futuretokenization (Phase 2 of his /goal 2026-09-27).
// This repo has NO storage at all (no DB, no KV), so the ledger is one structured line per event in the platform's own logs
// (Vercel function logs for /api/chat; the GitHub Actions log for the news brief) plus an in-process running total.
// A durable ledger (Vercel KV / Upstash) is his call — nothing here writes anywhere but stdout/stderr.
//   grep "[ai-spend]"    → one JSON line per provider attempt (usd at dated list prices; estimated=true when the provider gave no usage)
//   grep "[ai-failover]" → one JSON line per provider switch (error, hedge, breaker-open)
//   grep "[jev]"         → one JSON line per Jev judgement (shadow verdicts on chat, enforce verdicts on the news brief)

const totals = { day: '', usd: 0, calls: 0, byProvider: {} };
const today = () => new Date().toISOString().slice(0, 10);

/** onSpend hook for createChain(): books every attempt, winners and cancelled hedges alike (never under-count). */
export function spendLedger(rec) {
  const d = today();
  if (totals.day !== d) { totals.day = d; totals.usd = 0; totals.calls = 0; totals.byProvider = {}; }
  totals.usd += rec.usd || 0; totals.calls += 1;
  totals.byProvider[rec.provider] = (totals.byProvider[rec.provider] || 0) + (rec.usd || 0);
  console.log('[ai-spend] ' + JSON.stringify({ at: rec.at, task: rec.task, provider: rec.provider, model: rec.model, outcome: rec.outcome, input: rec.input, output: rec.output, cacheRead: rec.cacheRead, cacheWrite: rec.cacheWrite, usd: Number((rec.usd || 0).toFixed(6)), estimated: rec.estimated, priceChecked: rec.priceChecked, dayUsd: Number(totals.usd.toFixed(6)) }));
}

/** onFailover hook for createChain(). The detail string is already redacted by the chain. */
export function failoverLedger(ev) {
  console.warn('[ai-failover] ' + JSON.stringify({ at: ev.at, task: ev.task, from: ev.from, to: ev.to, reason: ev.reason, detail: ev.detail }));
}

/** One line per Jev judgement. Only verdict metadata — never the user's words, never the corpus. */
export function jevLedger(task, g) {
  console.log('[jev] ' + JSON.stringify({ task, provider: g.provider, degraded: g.degraded, mode: g.mode, verdict: g.verdict, publishable: g.publishable, reasons: (g.reasons || []).map((r) => String(r).slice(0, 160)), ms: g.ms, jevMs: g.jevMs, usd: g.usd ?? 0 }));
}

export function spendTotals() { return { ...totals, byProvider: { ...totals.byProvider } }; }
