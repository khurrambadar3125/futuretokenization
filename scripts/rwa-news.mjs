#!/usr/bin/env node
/**
 * Autonomous RWA News Brief — daily pipeline.
 *
 * INTEGRITY CONTRACT (non-negotiable):
 *  - Headlines are NEVER invented. Every item originates from a real article in a
 *    real RSS feed and carries a real source name, publish date, and outbound URL.
 *  - RELEVANCE + CATEGORY are judged by Jev (jev-1.13.0, a judge that cannot write), not by an LLM
 *    (his /goal 2026-09-27; calibration: scripts/news-jev-calibrate.mjs). If a feed item has no usable
 *    URL, it is dropped. No source = no item.
 *  - The CONDENSE step (brief + why) runs on the provider chain DeepSeek → Moonshot → Haiku and is
 *    hard-instructed to add no fact not present in the source.
 *  - Every brief then passes the ENFORCE gate before it can publish: house rules (regex) → mechanical
 *    grounding (every number in the brief must appear in the source) → Jev faithfulness vs the source.
 *    A held brief is regenerated once; held again = dropped.
 *  - UNJUDGED IS NOT PUBLISHED: Jev unavailable (no key, off, timed out) or no provider answering →
 *    the run exits non-zero WITHOUT touching data/rwa-news.json (the last judged brief stays up,
 *    carrying its own generated date). Never a silent pass.
 *  - Zero qualifying items => an honest empty state is written. Never padded.
 *  - --dry-run: judge and print, write nothing (with no provider key: relevance triage only).
 *
 * Scope: RWA tokenization, stablecoins, tokenized treasuries/bonds/funds, and
 * digital banks ONLY when there is a genuine tokenization angle.
 *
 * Output: data/rwa-news.json  (committed by GitHub Actions -> Vercel rebuild -> live)
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { makeChain, judge, answerNoul, answerChoice, gate } from '../lib/ai-chain/index.mjs';
import { jevLedger, spendTotals } from '../lib/ai-chain/ledger.mjs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'data', 'rwa-news.json');

const LOOKBACK_HOURS = 60;
const MAX_CANDIDATES = 22; // cap sent to Jev + the chain (cost control)
const MAX_ITEMS = 10;      // cap published

// Named, trusted RSS feeds. A dead/blocked feed is skipped, never fatal.
const FEEDS = [
  { source: 'Ledger Insights', url: 'https://www.ledgerinsights.com/feed/' },
  { source: 'CoinDesk',        url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { source: 'The Block',       url: 'https://www.theblock.co/rss.xml' },
  { source: 'DL News',         url: 'https://www.dlnews.com/arc/outboundfeeds/rss/' },
  { source: 'Cointelegraph',   url: 'https://cointelegraph.com/rss/tag/tokenization' },
  { source: 'Cointelegraph',   url: 'https://cointelegraph.com/rss/tag/rwa' },
];

// Pre-filter allowlist (cheap keyword gate before spending Haiku tokens).
const KEYWORDS = [
  'tokeniz', 'real-world asset', 'real world asset', 'rwa', 'stablecoin', 'stable coin',
  'tokenized treasur', 'tokenized bond', 'tokenized fund', 'tokenized money market',
  'tokenized deposit', 'tokenized credit', 'tokenized equit', 'on-chain treasur',
  'asset-backed token', 'digital bond', 'buidl', 'ondo', 'securitize', 'usdc', 'usdt',
  'money market fund', 'private credit', 'vara', 'rwa.xyz', 'tokenised',
];

// ---------- minimal, tolerant RSS/Atom parser (no new dependency) ----------
function decodeEntities(s) {
  return (s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, ' ') // strip any residual tags from descriptions
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return m ? decodeEntities(m[1]) : '';
}

function atomLink(block) {
  // <link href="..."/> (prefer rel="alternate" or the first http link)
  const links = [...block.matchAll(/<link\b[^>]*href="([^"]+)"[^>]*\/?>/gi)].map(m => ({
    href: m[1], rel: (m[0].match(/rel="([^"]+)"/i) || [])[1] || 'alternate',
  }));
  const alt = links.find(l => l.rel === 'alternate') || links[0];
  return alt ? alt.href : '';
}

function parseFeed(xml, source) {
  const out = [];
  const isAtom = /<entry[\s>]/i.test(xml) && !/<item[\s>]/i.test(xml);
  const blocks = xml.match(isAtom ? /<entry[\s\S]*?<\/entry>/gi : /<item[\s\S]*?<\/item>/gi) || [];
  for (const b of blocks) {
    const title = tag(b, 'title');
    let url = tag(b, 'link') || atomLink(b);
    url = (url || '').trim();
    const dateRaw = tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date');
    const desc = tag(b, 'description') || tag(b, 'summary') || tag(b, 'content');
    if (!title || !/^https?:\/\//i.test(url)) continue; // integrity gate: must have real URL
    const ts = dateRaw ? Date.parse(dateRaw) : NaN;
    out.push({ source, title, url, desc: desc.slice(0, 400), ts: Number.isNaN(ts) ? null : ts });
  }
  return out;
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'FutureTokenization-RWA-Brief/1.0 (+https://futuretokenization.com)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return parseFeed(xml, feed.source);
  } catch (e) {
    console.warn(`  ! feed failed: ${feed.source} (${feed.url}) — ${e.message}`);
    return null; // null = failed (distinct from [] = ok-but-empty)
  }
}

function keyworded(item) {
  const hay = `${item.title} ${item.desc}`.toLowerCase();
  return KEYWORDS.some(k => hay.includes(k));
}

function dedupe(items) {
  const seen = new Set();
  const norm = t => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 80);
  const out = [];
  for (const it of items) {
    const key = norm(it.title);
    const ukey = it.url.split('?')[0];
    if (seen.has(key) || seen.has(ukey)) continue;
    seen.add(key); seen.add(ukey);
    out.push(it);
  }
  return out;
}

// ---------- Jev: relevance + category (a judge, never a writer) ----------
// Calibrated by scripts/news-jev-calibrate.mjs (planted relevant / irrelevant headlines); the threshold lives here.
export const RELEVANCE_THRESHOLD = 0.5;
export const RELEVANCE_QUESTIONS = {
  relevant: {
    type: 'noul',
    instructions: 'Is this news item (`title` and `snippet`) genuinely about real-world-asset (RWA) tokenization, stablecoins, tokenized treasuries, bonds, funds, credit or deposits, or a digital bank doing something with tokenization? A digital-bank story with no tokenization angle is NOT. A general crypto price, trading, ETF-flow or hack story with no tokenization or stablecoin angle is NOT.',
  },
  category: {
    type: 'choice',
    instructions: 'Which one category fits this news item best?',
    criteria: {
      RWA: 'Tokenized real-world assets: treasuries, bonds, funds, credit, real estate, commodities.',
      Stablecoin: 'Stablecoins or fiat-backed tokens, their issuers, reserves or regulation.',
      Tokenization: 'Tokenization infrastructure, platforms, standards or regulation in general.',
      DigitalBank: 'A digital or neo bank doing something with tokenization.',
    },
  },
};
const CATEGORIES = ['RWA', 'Stablecoin', 'Tokenization', 'DigitalBank'];

/** Judge one candidate. Returns { relevant, p, category, source }. source "none" = UNJUDGED (never treated as relevant or irrelevant). */
export async function triage(c, o = {}) {
  const j = await judge({ title: c.title, snippet: c.desc }, RELEVANCE_QUESTIONS, { timeoutMs: 8000, retries: 1, ...o });
  if (j.source !== 'jev') return { relevant: null, p: null, category: null, source: j.source };
  const p = answerNoul(j, 'relevant');
  const cat = answerChoice(j, 'category');
  return { relevant: p != null && p >= RELEVANCE_THRESHOLD, p, category: CATEGORIES.includes(cat) ? cat : 'Tokenization', source: 'jev', usd: j.usd };
}

// ---------- the enforce gate on every brief: rules → mechanical grounding → Jev ----------
export const HOUSE_RULES = [
  { id: 'no-advice', re: /\b(buy|sell|hold)\s+(now|today)\b|\b(should|must)\s+invest\b|\bprice\s+target\b/i },
  { id: 'no-hype', re: /\b(moon|skyrocket\w*|explod\w*|game[- ]chang\w*|revolutionar\w*|massive\s+gains?)\b|!{1,}/i },
  { id: 'no-guarantee', re: /\b(guaranteed?|risk[- ]free|sure\s+thing)\b/i },
  { id: 'no-emoji', re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u },
];
// Numbers as whole tokens: "1,000" → "1000", "$1.2bn" → "1.2"; a trailing full stop is not a decimal.
const numbersIn = (t) => [...String(t).replace(/(\d),(?=\d{3}\b)/g, '$1').matchAll(/\d+(?:\.\d+)?/g)].map((m) => m[0].replace(/\.0+$/, ''));
/** Every number in the brief must appear as a number in the source (title + snippet). Numbers are never generated. */
export function groundNumbers(text, source) {
  const have = new Set(numbersIn(source));
  const missing = [...new Set(numbersIn(text))].filter((n) => !have.has(n));
  return { ok: missing.length === 0, missing };
}
// One Jev question over both fields, framed as "does it go beyond the source" (calibrated 2026-09-27 against the positive
// "is every claim supported" framing, which scored faithful condensations as low as 0.27 because `why` is interpretation by
// design). PASS when the probability of an unsupported or contradicting claim is below 0.5.
export const BRIEF_QUESTIONS = {
  beyondSource: { type: 'noul', instructions: 'Does `brief` or `why` contradict `source`, or name a person, company, number, date or outcome that `source` does not contain? Saying why the news matters is not a new fact.' },
};
export const briefPasses = (a) => { const p = a?.beyondSource?.noul; return typeof p === 'number' && p < 0.5; };
export async function gateBrief(item, source, o = {}) {
  const text = `${item.brief}. ${item.why || ''}`.trim();
  return gate(text, {
    rules: HOUSE_RULES, ground: (t) => groundNumbers(t, source), mode: 'enforce',
    state: { brief: item.brief, why: item.why || '', source }, questions: BRIEF_QUESTIONS, pass: briefPasses, ...o,
  });
}

// ---------- the chain: condense only (never invents; the gate proves it) ----------
const CONDENSE_SYSTEM = [
  'You condense REAL news headlines for an educational tokenization platform.',
  'STRICT RULES:',
  '1. You may ONLY condense/rephrase what is in the provided title and snippet. NEVER add a',
  '   fact, number, name, or date that is not present in the source. If unsure, stay vague.',
  '2. brief: a tightened headline, <= 90 characters, factual, no hype, no emoji.',
  '3. why: one clause on why it matters for tokenization, <= 120 characters. Only inferable from source.',
  'Return ONLY a JSON object: {"items":[{"i":<index>,"brief":"","why":""}]}, one object per input index.',
].join('\n');

async function condense(chain, rows, feedback) {
  const payload = rows.map(({ i, c }) => ({ i, source: c.source, title: c.title, snippet: c.desc }));
  const note = feedback ? `\n\nA previous draft was HELD by the fact gate (${feedback}). Stay strictly within the title and snippet.` : '';
  const r = await chain.complete({ task: 'rwa-news-condense', system: CONDENSE_SYSTEM, user: `Candidates:\n${JSON.stringify(payload)}${note}`, maxTokens: 2000, json: true, latency: 'batch' });
  const list = Array.isArray(r.json) ? r.json : Array.isArray(r.json?.items) ? r.json.items : [];
  return new Map(list.filter((v) => v && Number.isInteger(v.i)).map((v) => [v.i, { brief: String(v.brief || '').slice(0, 110), why: String(v.why || '').slice(0, 140) }]));
}

async function mapLimit(xs, n, fn) {
  const out = new Array(xs.length); let k = 0;
  await Promise.all(Array.from({ length: Math.min(n, xs.length) }, async () => { while (k < xs.length) { const i = k++; out[i] = await fn(xs[i], i); } }));
  return out;
}

class Unjudged extends Error {}

function fmtDate(ts) {
  const d = new Date(ts);
  return {
    iso: d.toISOString().slice(0, 10),
    // pin label to UTC so it always agrees with the ISO date (CI runs UTC anyway)
    label: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }),
  };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const chain = makeChain();
  const triageOnly = dryRun && !chain.available().length; // dry run with no provider key: judge relevance only, condense nothing
  if (!chain.available().length && !triageOnly) {
    console.error('No AI provider key set (DEEPSEEK_API_KEY / MOONSHOT_API_KEY / ANTHROPIC_API_KEY) — aborting (will not write a fabricated file).');
    process.exit(1);
  }
  if (!process.env.TYPESAFE_API_KEY || process.env.JEV_ENABLED === '0') {
    console.error('SKIPPED — Jev is not available (TYPESAFE_API_KEY missing or JEV_ENABLED=0). Unjudged = not published: data/rwa-news.json left untouched.');
    process.exit(2);
  }

  console.log('Fetching feeds...');
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const feedsOk = [], feedsFailed = [];
  let all = [];
  results.forEach((r, i) => {
    if (r === null) feedsFailed.push(FEEDS[i].source);
    else { feedsOk.push(FEEDS[i].source); all = all.concat(r); }
  });
  console.log(`  feeds ok: ${[...new Set(feedsOk)].join(', ') || 'none'}`);
  if (feedsFailed.length) console.log(`  feeds failed: ${[...new Set(feedsFailed)].join(', ')}`);

  const cutoff = Date.now() - LOOKBACK_HOURS * 3600 * 1000;
  let candidates = all
    .filter(it => it.ts === null || it.ts >= cutoff) // keep undated but prefer dated
    .filter(keyworded);
  candidates = dedupe(candidates)
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .slice(0, MAX_CANDIDATES);
  console.log(`  ${candidates.length} candidate(s) after filter+dedupe`);

  let items = [];
  if (candidates.length) {
    // 1. Jev relevance + category, per candidate.
    const verdicts = await mapLimit(candidates, 6, (c) => triage(c));
    const unjudged = verdicts.filter((v) => v.source !== 'jev').length;
    if (unjudged) throw new Unjudged(`${unjudged}/${candidates.length} candidates came back unjudged from Jev`);
    const relevant = candidates.map((c, i) => ({ i, c, v: verdicts[i] })).filter((x) => x.v.relevant);
    console.log(`  Jev triage: ${relevant.length}/${candidates.length} relevant (threshold ${RELEVANCE_THRESHOLD})`);
    candidates.forEach((c, i) => console.log(`    ${verdicts[i].relevant ? 'KEEP' : 'drop'} p=${verdicts[i].p?.toFixed(2)} ${verdicts[i].category} · ${c.title.slice(0, 90)}`));

    // 2. Condense the relevant ones on the chain; 3. enforce gate each; one regeneration for a held brief.
    if (triageOnly) console.log('  DRY RUN, no provider key: condense + brief gate SKIPPED.');
    else if (relevant.length) {
      let drafts;
      try { drafts = await condense(chain, relevant); }
      catch (e) { throw new Unjudged(`no provider could condense: ${e.message}`); }
      for (const row of relevant) {
        const { i, c, v } = row;
        const source = `${c.title}\n${c.desc}`;
        let d = drafts.get(i);
        let g = d?.brief ? await gateBrief(d, source) : null;
        if (g) jevLedger('rwa-news-brief', g);
        if (g && g.verdict === 'unjudged') throw new Unjudged(`brief ${i} unjudged: ${g.reasons.join('; ')}`);
        if (!g || g.verdict === 'hold') {
          const retry = await condense(chain, [row], g ? g.reasons.join('; ').slice(0, 300) : 'empty draft').catch(() => new Map());
          d = retry.get(i);
          g = d?.brief ? await gateBrief(d, source) : null;
          if (g) jevLedger('rwa-news-brief-retry', g);
          if (g && g.verdict === 'unjudged') throw new Unjudged(`brief ${i} unjudged on retry: ${g.reasons.join('; ')}`);
        }
        if (!g || !g.publishable) { console.log(`    HELD (dropped) · ${c.title.slice(0, 80)} — ${g ? g.reasons.join('; ').slice(0, 200) : 'no draft'}`); continue; }
        const ts = c.ts || Date.now();
        const { iso, label } = fmtDate(ts);
        items.push({ brief: d.brief, why: d.why, category: v.category, source: c.source, url: c.url, date: iso, dateLabel: label });
        if (items.length >= MAX_ITEMS) break;
      }
    }
  }

  const now = new Date();
  const payload = {
    generated: now.toISOString(),
    generatedLabel: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }),
    count: items.length,
    items, // empty array is honest — the UI shows an explicit empty state
    feedsOk: [...new Set(feedsOk)],
    feedsFailed: [...new Set(feedsFailed)],
  };

  const t = spendTotals();
  console.log(`  AI spend this run: $${t.usd.toFixed(6)} over ${t.calls} provider attempt(s) ${JSON.stringify(t.byProvider)}`);
  if (dryRun) { console.log(`DRY RUN — ${items.length} item(s) would publish; nothing written.`); return; }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`Wrote ${items.length} item(s) -> ${OUT}`);
}

// Run only when executed directly (the calibration script and tests import the judge/gate pieces).
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    if (e instanceof Unjudged) { console.error(`SKIPPED — UNJUDGED, not published: ${e.message}. data/rwa-news.json left untouched.`); process.exit(2); }
    console.error(e); process.exit(1);
  });
}
