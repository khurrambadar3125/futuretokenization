#!/usr/bin/env node
/**
 * Autonomous RWA News Brief — daily pipeline.
 *
 * INTEGRITY CONTRACT (non-negotiable):
 *  - Headlines are NEVER invented. Every item originates from a real article in a
 *    real RSS feed and carries a real source name, publish date, and outbound URL.
 *  - Haiku is used ONLY to condense a real headline + decide on-topic relevance.
 *    It is hard-instructed to add no fact not present in the source. If a feed item
 *    has no usable URL, it is dropped. No source = no item.
 *  - Zero qualifying items => an honest empty state is written. Never padded.
 *
 * Scope: RWA tokenization, stablecoins, tokenized treasuries/bonds/funds, and
 * digital banks ONLY when there is a genuine tokenization angle.
 *
 * Output: data/rwa-news.json  (committed by GitHub Actions -> Vercel rebuild -> live)
 */

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'data', 'rwa-news.json');

const MODEL = 'claude-haiku-4-5-20251001'; // Haiku per cost rule — condense/triage only
const LOOKBACK_HOURS = 60;
const MAX_CANDIDATES = 22; // cap sent to Haiku (cost control)
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

// ---------- Haiku: relevance gate + condense (condense only, never invent) ----------
async function brief(client, candidates) {
  const system = [
    'You triage and condense REAL news headlines for an educational tokenization platform.',
    'STRICT RULES:',
    '1. You may ONLY condense/rephrase what is in the provided title and snippet. NEVER add a',
    '   fact, number, name, or date that is not present in the source. If unsure, stay vague.',
    '2. Mark relevant=true ONLY if the article is genuinely about: RWA tokenization, stablecoins,',
    '   tokenized treasuries/bonds/funds/credit/deposits, or a DIGITAL BANK doing something with',
    '   tokenization. A digital-bank story with no tokenization angle is relevant=false. General',
    '   crypto price/trading/hack stories with no tokenization or stablecoin angle are relevant=false.',
    '3. brief: a tightened headline, <= 90 characters, factual, no hype, no emoji.',
    '4. why: one clause on why it matters for tokenization, <= 120 characters. Only inferable from source.',
    '5. category: exactly one of "RWA", "Stablecoin", "Tokenization", "DigitalBank".',
    'Return ONLY a JSON array, one object per input index: {"i":<index>,"relevant":<bool>,"brief":"","why":"","category":""}.',
  ].join('\n');

  const payload = candidates.map((c, i) => ({ i, source: c.source, title: c.title, snippet: c.desc }));
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system,
    messages: [{ role: 'user', content: `Candidates:\n${JSON.stringify(payload, null, 0)}` }],
  });
  let text = (msg.content?.[0]?.text || '').trim();
  text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const start = text.indexOf('['); const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('Haiku returned no JSON array');
  return JSON.parse(text.slice(start, end + 1));
}

function fmtDate(ts) {
  const d = new Date(ts);
  return {
    iso: d.toISOString().slice(0, 10),
    // pin label to UTC so it always agrees with the ISO date (CI runs UTC anyway)
    label: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }),
  };
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set — aborting (will not write a fabricated file).');
    process.exit(1);
  }
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    let verdicts;
    try {
      verdicts = await brief(client, candidates);
    } catch (e) {
      console.error(`Haiku triage failed: ${e.message} — writing empty state rather than guessing.`);
      verdicts = [];
    }
    const byIdx = new Map(verdicts.map(v => [v.i, v]));
    for (let i = 0; i < candidates.length; i++) {
      const v = byIdx.get(i);
      const c = candidates[i];
      if (!v || !v.relevant || !v.brief) continue;
      const ts = c.ts || Date.now();
      const { iso, label } = fmtDate(ts);
      items.push({
        brief: String(v.brief).slice(0, 110),
        why: String(v.why || '').slice(0, 140),
        category: ['RWA', 'Stablecoin', 'Tokenization', 'DigitalBank'].includes(v.category) ? v.category : 'Tokenization',
        source: c.source,
        url: c.url,
        date: iso,
        dateLabel: label,
      });
      if (items.length >= MAX_ITEMS) break;
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

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');
  console.log(`Wrote ${items.length} item(s) -> ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
