// Repo-local tripwires for the AI chain + Jev gates (offline: no network, no keys, no spend). Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeChain, CHAT_MODELS, anthropicModel } from '../lib/ai-chain/index.mjs';
import { czarGate } from '../lib/ai-chain/czar-gate.mjs';
import { triage, gateBrief, groundNumbers } from '../scripts/rwa-news.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NO_JEV = { JEV_ENABLED: '0' };
const enc = new TextEncoder();
const sse = (events) => new Response(new ReadableStream({ start(c) { for (const e of events) c.enqueue(enc.encode(`data: ${JSON.stringify(e)}\n\n`)); c.enqueue(enc.encode('data: [DONE]\n\n')); c.close(); } }), { status: 200 });
function fakeProviders(script, seen) {
  return async (url, init) => {
    const u = String(url); const body = JSON.parse(init.body); seen.push({ u, model: body.model, temperature: body.temperature });
    const p = u.includes('moonshot') ? 'moonshot' : u.includes('anthropic') ? 'anthropic' : 'deepseek';
    if (script[p] !== 'ok') return new Response('{"error":"down"}', { status: 503 });
    if (p === 'anthropic') return sse([{ type: 'message_start', message: { model: body.model, usage: { input_tokens: 10 } } }, { type: 'content_block_delta', delta: { type: 'text_delta', text: `from ${p}` } }, { type: 'message_delta', usage: { output_tokens: 2 } }]);
    return sse([{ model: body.model, choices: [{ delta: { content: `from ${p}` } }] }, { choices: [{ delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 2 } }]);
  };
}
const ENV = { DEEPSEEK_API_KEY: 'stub-a', DEEPSEEK_BASE_URL: 'https://gw.stub/api/gateway', MOONSHOT_API_KEY: 'stub-b', ANTHROPIC_API_KEY: 'stub-c' };
const call = (chain) => chain.complete({ task: 't', system: 's', user: 'hi', maxTokens: 20, temperature: 0 });

test('chain: DeepSeek (gateway, v4-pro tier) → Moonshot → Haiku, each only on failure', async () => {
  for (const [script, want, n] of [[{ deepseek: 'ok' }, 'deepseek', 1], [{ moonshot: 'ok' }, 'moonshot', 2], [{ anthropic: 'ok' }, 'anthropic', 3]]) {
    const seen = [], spend = [], fo = [];
    const chain = makeChain({ env: ENV, fetch: fakeProviders(script, seen), breakers: new Map(), models: CHAT_MODELS, onSpend: (r) => spend.push(r), onFailover: (e) => fo.push(e) });
    const r = await call(chain);
    assert.equal(r.provider, want); assert.equal(r.text, `from ${want}`); assert.equal(seen.length, n);
    assert.equal(seen[0].u, 'https://gw.stub/api/gateway/chat/completions', 'DeepSeek goes through DEEPSEEK_BASE_URL (the gateway)');
    assert.equal(seen[0].model, 'deepseek-v4-pro', "the Czar keeps today's pro tier");
    assert.equal(fo.length, n - 1, 'one failover event per switch');
    assert.ok(spend.length >= 1 && spend.every((s) => typeof s.usd === 'number'), 'every attempt is booked in the spend ledger');
  }
});

test('chain: temperature is never forwarded to Moonshot (kimi 400s on T=0)', async () => {
  const seen = [];
  await call(makeChain({ env: ENV, fetch: fakeProviders({ moonshot: 'ok' }, seen), breakers: new Map(), onSpend() {}, onFailover() {} }));
  assert.equal(seen.find((s) => s.u.includes('moonshot')).temperature, undefined);
});

test('guard: a non-Claude model name never reaches Anthropic', () => {
  assert.throws(() => anthropicModel('kimi-k2.6')); assert.throws(() => anthropicModel('deepseek-v4-pro'));
  assert.equal(anthropicModel('claude-haiku-4-5'), 'claude-haiku-4-5');
});

test('unjudged is not pass: Czar gate, news triage and brief gate without Jev', async () => {
  const g = await czarGate('Tokenization records ownership as a token.', 'corpus', { env: NO_JEV });
  assert.equal(g.verdict, 'unjudged'); assert.equal(g.publishable, false);
  const t = await triage({ title: 'Tokenized fund launches', desc: 'x' }, { env: NO_JEV });
  assert.equal(t.source, 'none'); assert.equal(t.relevant, null, 'unjudged triage is neither relevant nor irrelevant');
  const b = await gateBrief({ brief: 'Fund launches on chain', why: 'Adds a tokenized fund' }, 'Fund launches on chain', { env: NO_JEV });
  assert.equal(b.verdict, 'unjudged'); assert.equal(b.publishable, false);
});

test('brief gate: invented number and hype HOLD before Jev is asked', async () => {
  let asked = 0; const jevFn = async () => { asked++; return { answers: { beyondSource: { type: 'noul', noul: 0.01 } }, usage: {}, model: 'jev-1.13.0' }; };
  const src = 'BlackRock BUIDL crosses $2.5 billion';
  assert.equal((await gateBrief({ brief: 'BUIDL passes $3bn', why: '' }, src, { jevFn })).verdict, 'hold');
  assert.equal((await gateBrief({ brief: 'BUIDL set to skyrocket', why: '' }, src, { jevFn })).verdict, 'hold');
  assert.equal(asked, 0, 'rules and number grounding run first');
  assert.equal((await gateBrief({ brief: 'BUIDL passes $2.5bn', why: 'Demand for tokenized Treasuries' }, src, { jevFn })).verdict, 'pass');
  assert.deepEqual(groundNumbers('1,000 banks join', 'over 1000 banks'), { ok: true, missing: [] });
});

test('Czar gate: a planted "beyond the corpus" verdict holds (shadow)', async () => {
  const jevFn = async () => ({ answers: { beyondSource: { type: 'noul', noul: 0.93 } }, usage: {}, model: 'jev-1.13.0' });
  const g = await czarGate('PRYPCO holds a Category 1 issuance licence.', 'corpus', { jevFn });
  assert.equal(g.verdict, 'hold'); assert.equal(g.mode, 'shadow');
});

test('news brief: no Jev → exit 2 and data/rwa-news.json untouched (never a silent pass)', () => {
  const f = resolve(root, 'data/rwa-news.json'); const before = existsSync(f) ? statSync(f).mtimeMs : null;
  const env = { PATH: process.env.PATH, ANTHROPIC_API_KEY: 'stub-c' };
  const r = spawnSync(process.execPath, [resolve(root, 'scripts/rwa-news.mjs')], { env, encoding: 'utf8', timeout: 20000 });
  assert.equal(r.status, 2, r.stderr); assert.match(r.stderr, /SKIPPED — Jev is not available/);
  assert.equal(existsSync(f) ? statSync(f).mtimeMs : null, before);
});

test('chat route: role guard, bounds, limiter, register counts derived (never hard-coded), no "validate" claim', () => {
  const s = readFileSync(resolve(root, 'pages/api/chat.js'), 'utf8');
  assert.match(s, /ALLOWED_ROLES = \['user', 'assistant'\]/, 'client-supplied system turns are dropped'); assert.match(s, /ALLOWED_ROLES\.includes\(m\.role\)/);
  assert.match(s, /rateLimit\(/); assert.match(s, /MAX_TOTAL_CHARS/);
  assert.match(s, /getMeta\(\)/, 'counts come from the dated register copy');
  assert.doesNotMatch(s, /answer \*\*\d+\*\*/, 'no hard-coded licence count');
  assert.doesNotMatch(s, /this site validates|we validate|validated by (us|this site)/i);
  assert.doesNotMatch(s, /@anthropic-ai\/sdk|deepseekShim/, 'the chain replaced the SDK + shim');
});
