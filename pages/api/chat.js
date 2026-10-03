import { CZAR_CORPUS } from '../../lib/czarCorpus';
import { getMeta } from '../../lib/registry';
import { getChatChain, afterResponse } from '../../lib/ai-chain/index.mjs';
import { czarGate } from '../../lib/ai-chain/czar-gate.mjs';
import { jevLedger } from '../../lib/ai-chain/ledger.mjs';
import { rateLimit, reserveSpend, settleSpendUsd } from '../../lib/security/ai-guard.mjs';

// Provider chain (his /goal 2026-09-27): DeepSeek deepseek-v4-pro via the khurrambadar gateway → Moonshot kimi-k2.6 → Anthropic
// Haiku, fallback only before an answer exists, so one provider failing no longer fails the request. Every attempt is booked in
// the spend ledger (lib/ai-chain/ledger.mjs). Jev judges every English reply against the corpus in SHADOW mode after the response
// is sent (zero added latency) — logged as [jev], never shown, never blocking. Enforce only on his ruling after measured counters.

const LANG_NAMES = {
  en: 'English', ar: 'Arabic', fr: 'French', es: 'Spanish',
  zh: 'Mandarin Chinese', hi: 'Hindi', pt: 'Portuguese', ru: 'Russian',
  de: 'German', ja: 'Japanese', ko: 'Korean', it: 'Italian',
  tr: 'Turkish', id: 'Indonesian', nl: 'Dutch', ur: 'Urdu',
};

// Behavioural rules (corpus Part 0) + owner directives. Kept in the system prompt so they
// override the desire to be helpful. The full corpus is attached as the KNOWLEDGE BASE block.
// Register counts are DERIVED from the dated copy of VARA's public register (data/vara-register.json via getMeta()) — never
// hard-coded. The site shows VARA's register; it never validates a licence (Khurram 2026-09-27; corpus rules 2 and 5).
function registerCountLine() {
  const m = getMeta(); const c = m.counts || {};
  const firms = c.activeFirms; const refs = c.distinctActiveLicenceRefs; const ipa = c.inPrincipleApproval;
  if (!Number.isInteger(firms) || !m.asOf) return 'I do not have a verified count in my current copy of the register — only VARA can confirm a licence; this site does not validate licences. Please check VARA\'s public register at vara.ae.';
  const shared = Number.isInteger(refs) && refs !== firms ? ` (${refs} distinct active licence references — some firms share one)` : '';
  const ipaPart = Number.isInteger(ipa) ? `, plus ${ipa} In-Principle Approval holders shown separately` : '';
  return `${firms} firms are listed with an active licence on VARA's public register as of ${m.asOf}${shared}${ipaPart} — only VARA can confirm a licence; this site does not validate licences. Check VARA's public register at vara.ae for the current list.`;
}

function buildInstructions() {
  return `You are the Digital Czar, the independent AI guide on FutureTokenization.com — an educational platform covering tokenization, real-world assets (RWA), the UAE/VARA regulatory landscape, the VASPs listed on VARA's public register, stablecoins, CBDCs, and the MENA corridor.

Your credibility — and the site's — comes from accuracy, not enthusiasm. The rules below OVERRIDE the desire to be helpful when they conflict.

OWNER DIRECTIVES (highest priority — these supersede anything in the knowledge base):
1. Register count: when asked how many VASPs are licensed or listed, answer with these figures and this framing only: "${registerCountLine()}" Never call a firm "licensed" as your own verdict, and never claim this site can confirm a licence — only VARA can.

SOURCING & HONESTY:
- Answer factual questions about VASPs, firms, licences, deals, and market figures ONLY from the KNOWLEDGE BASE below. Do NOT use general training data for these. If the answer is not in the knowledge base, say so and point to the VARA register (vara.ae) — never invent a firm, number, deal, or licence detail. A confident wrong answer is the worst possible failure.
- Cite, date, and define: attach the source/date where a fact can change, and for market-size figures state what is counted (e.g. "excluding stablecoins").
- Distinguish fact from claim: when a figure is company-reported or from a press release, say so ("according to the company", "per their announcement"). Preserve every such hedge in the knowledge base.
- Flag staleness: if a figure's date is older than ~3 months, note it may have changed.

NEUTRALITY & WATCH-FLAGS:
- You are independent and even-handed — NOT a marketing channel for any firm. State unflattering facts neutrally.
- When a firm has a watch-flag in the knowledge base, you MUST include it when discussing that firm (e.g. Scintilla's wrong licence-number flag; PRYPCO is a broker-dealer, not the tokenizer — Ctrl Alt is; Mantra's April 2025 OM token collapse; Ctrl Alt's pending, not-closed Nasdaq/SPAC listing). Omitting a known issue to make a firm look better is a violation.

NOT ADVICE:
- Educational information only — never financial, investment, legal, or tax advice. Do not tell anyone to buy, sell, or hold, and do not predict prices or returns. If asked "should I invest in X", decline to advise, give factual information, and suggest a licensed professional.

SCOPE & TONE:
- In scope: tokenization, RWAs, VARA/UAE regulation, the profiled VASPs, stablecoins, CBDCs, the MENA corridor, and the Learn concepts. The timeless concept definitions (knowledge base Part 8) may be explained freely.
- Calm, precise, reference-grade. No hype, no urgency framing ("the window is closing"), no promotional language.

WHEN UNSURE — use this fallback verbatim in spirit: "I don't have verified information on that in my current knowledge base. The authoritative source for VARA licensing is the VARA public register at vara.ae, which I'd recommend checking directly for the most current detail."`;
}

// Kept LAST (after the corpus) so the long stable prefix is identical for every language and the providers' prompt caches hit.
const languageRule = (langName) => `LANGUAGE: Respond ONLY in ${langName}. Every word of your reply must be in ${langName}.`;

// Bounds: a public route with a ~15k-token corpus attached to every call (cost), so cap what a caller can send.
const ALLOWED_ROLES = ['user', 'assistant']; // never 'system' — the server owns the system prompt
const MAX_MESSAGES = 20;
const MAX_CHARS_PER_MESSAGE = 4000;
const MAX_TOTAL_CHARS = 24000;
// Per-IP fixed windows + a daily USD ceiling (AI_DAILY_BUDGET_USD, default 3) via lib/security/ai-guard.mjs — shared across
// instances when the Upstash/Vercel KV store is attached (KV_REST_API_URL), per-instance memory otherwise.
const PER_IP_LIMITS = [[10, 60], [60, 86400]];
const MAX_OUTPUT_TOKENS = 1400;

const KNOWLEDGE_BASE = `=== KNOWLEDGE BASE (the Digital Czar corpus — your only source for factual claims) ===\n\n${CZAR_CORPUS}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const rl = await rateLimit(req, 'czar', PER_IP_LIMITS);
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ error: 'Too many requests', reply: 'Too many questions in a minute — please wait a moment and try again.' });
  }

  const { messages, language = 'en' } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }
  // Role guard: the server decides roles. Only user/assistant turns from the client are kept — a client-supplied
  // role:"system" turn is dropped, never forwarded to a provider.
  const turns = messages
    .filter((m) => m && ALLOWED_ROLES.includes(m.role))
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: String(m.content || '').slice(0, MAX_CHARS_PER_MESSAGE) }));
  if (!turns.some((m) => m.role === 'user' && m.content.trim())) return res.status(400).json({ error: 'messages required' });
  if (turns.reduce((n, m) => n + m.content.length, 0) > MAX_TOTAL_CHARS) return res.status(413).json({ error: 'Conversation too large' });
  const langName = LANG_NAMES[language] || 'English';

  // Daily spend ceiling: reserve the worst case (system + corpus + turns in, full output) before the call; settle after.
  const system = [buildInstructions(), KNOWLEDGE_BASE, languageRule(langName)];
  const inputChars = system.reduce((n, s) => n + s.length, 0) + turns.reduce((n, m) => n + m.content.length, 0);
  const spend = await reserveSpend(inputChars, MAX_OUTPUT_TOKENS);
  if (!spend.ok) {
    res.setHeader('Retry-After', '3600');
    return res.status(429).json({ error: 'Daily limit reached', reply: 'The Digital Czar has reached its daily limit — please try again later.' });
  }

  try {
    const r = await getChatChain().complete({
      task: 'czar-chat',
      // Stable first: rules → corpus → the one per-language line.
      system,
      messages: turns,
      maxTokens: MAX_OUTPUT_TOKENS,
      // Long context (~15k tokens): hedge to the next provider only if no first token in 12 s.
      budget: { ttftMs: 12000, totalMs: 55000 },
    });

    await settleSpendUsd(spend.reserved, r.usd);
    const reply = r.text.trim() || 'Sorry, could not process that request.';
    res.status(200).json({ reply });

    // Jev SHADOW gate — after the reply is sent. Source = the corpus the Czar is told to answer from (calibrated 9/9 on
    // planted answers, scripts/czar-jev-calibrate.mjs). Non-English replies come back "unjudged" (Jev is measured on English
    // only) and are logged as such — never counted as a pass.
    afterResponse(czarGate(reply, CZAR_CORPUS).then((g) => jevLedger('czar-chat', { ...g, provider: r.provider, degraded: r.degraded })));
  } catch (error) {
    // ChainError messages are redacted by the chain (no key ever reaches a log).
    console.error('Czar API error:', String(error?.message || error).slice(0, 400));
    res.status(500).json({ error: 'API error', reply: 'Sorry, there was an error. Please try again.' });
  }
}
