// Tripwires for lib/security/ai-guard.mjs (2026-10-03): with the Upstash/Vercel KV env set, counters go to the shared store under
// the `ftk:` prefix; without it, the in-memory path is used and fetch is never called. Offline: fetch is faked, no keys, no spend.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import * as guard from '../lib/security/ai-guard.mjs';

const ENV_KEYS = ['KV_REST_API_URL', 'KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'AI_DAILY_BUDGET_USD'];
const saved = {}; const realFetch = globalThis.fetch;
const req = (ip = '203.0.113.7') => ({ headers: { 'x-vercel-forwarded-for': ip } });

// A fake Upstash REST server: a Map behind /pipeline and the single-command endpoint; records every command.
function fakeUpstash() {
  const store = new Map(); const ttl = new Map(); const calls = [];
  const exec = ([cmd, key, arg]) => {
    if (cmd === 'INCRBY') { const v = (store.get(key) || 0) + Number(arg); store.set(key, v); return v; }
    if (cmd === 'TTL') return ttl.has(key) ? ttl.get(key) : store.has(key) ? -1 : -2;
    if (cmd === 'EXPIRE') { ttl.set(key, Number(arg)); return 1; }
    throw new Error('unexpected ' + cmd);
  };
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), auth: init.headers.Authorization, body: JSON.parse(init.body) });
    const body = JSON.parse(init.body);
    const result = String(url).endsWith('/pipeline') ? body.map((c) => ({ result: exec(c) })) : { result: exec(body) };
    return new Response(JSON.stringify(result), { status: 200 });
  };
  return { store, ttl, calls };
}

beforeEach(() => { for (const k of ENV_KEYS) { saved[k] = process.env[k]; delete process.env[k]; } guard.__resetMemory(); });
afterEach(() => { for (const k of ENV_KEYS) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; } globalThis.fetch = realFetch; });

test('ai-guard: with KV env set, the Upstash path is used and every key carries the ftk: prefix', async () => {
  process.env.KV_REST_API_URL = 'https://fake-kv.example'; process.env.KV_REST_API_TOKEN = 'test-token';
  const up = fakeUpstash();
  assert.equal(guard.backend(), 'upstash');
  for (let i = 0; i < 3; i++) assert.equal((await guard.rateLimit(req(), 'czar', [[3, 60]])).ok, true);
  assert.equal((await guard.rateLimit(req(), 'czar', [[3, 60]])).ok, false, 'the 4th call in the window is refused');
  const r = await guard.reserveSpend(1000, 100);
  assert.equal(r.ok, true);
  const keys = [...up.store.keys()];
  assert.ok(keys.length >= 2 && keys.every((k) => k.startsWith('ftk:')), JSON.stringify(keys));
  assert.ok(keys.includes(`ftk:spend:${new Date().toISOString().slice(0, 10)}`));
  assert.ok(up.calls.every((c) => c.url.startsWith('https://fake-kv.example') && c.auth === 'Bearer test-token'));
  assert.ok([...up.ttl.keys()].length === keys.length, 'every key got an expiry');
});

test('ai-guard: the UPSTASH_REDIS_REST_* names work too', async () => {
  process.env.UPSTASH_REDIS_REST_URL = 'https://fake-up.example'; process.env.UPSTASH_REDIS_REST_TOKEN = 't';
  const up = fakeUpstash();
  await guard.rateLimit(req(), 'czar', [[10, 60]]);
  assert.equal(up.calls.length > 0, true);
});

test('ai-guard: without env, memory path — fetch is never called', async () => {
  let fetched = 0; globalThis.fetch = async () => { fetched++; throw new Error('must not fetch'); };
  assert.equal(guard.backend(), 'memory');
  for (let i = 0; i < 2; i++) assert.equal((await guard.rateLimit(req(), 'czar', [[2, 60]])).ok, true);
  assert.equal((await guard.rateLimit(req(), 'czar', [[2, 60]])).ok, false);
  assert.equal((await guard.rateLimit(req('198.51.100.1'), 'czar', [[2, 60]])).ok, true, 'another IP has its own window');
  assert.equal(fetched, 0);
});

test('ai-guard: the daily spend ceiling refuses, gives back the refused reservation, and settles to the real cost', async () => {
  process.env.AI_DAILY_BUDGET_USD = '0.01';
  const a = await guard.reserveSpend(2000, 1000); // 1000 tok in + 1000 out ≈ $0.006
  assert.equal(a.ok, true);
  assert.equal((await guard.reserveSpend(2000, 1000)).ok, false, 'second reservation would cross $0.01');
  await guard.settleSpendUsd(a.reserved, 0.001); // the real call was cheap
  assert.equal((await guard.reserveSpend(2000, 1000)).ok, true, 'settling freed the headroom');
});

test('ai-guard: a store outage falls back to memory (still limited, never unlimited)', async () => {
  process.env.KV_REST_API_URL = 'https://fake-kv.example'; process.env.KV_REST_API_TOKEN = 't';
  globalThis.fetch = async () => new Response('down', { status: 503 });
  assert.equal((await guard.rateLimit(req(), 'czar', [[1, 60]])).ok, true);
  assert.equal((await guard.rateLimit(req(), 'czar', [[1, 60]])).ok, false);
});
