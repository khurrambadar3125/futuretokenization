#!/usr/bin/env node
// Fallback proof for /api/chat — drives the BUILT route handler (.next/server/pages/api/chat.js, run `npm run build` first)
// with a mock req/res. No production traffic, no DB (this platform has none), nothing written.
//   node scripts/ai-fallback-proof.mjs            OFFLINE: providers stubbed at fetch — DeepSeek 503 → Moonshot answers;
//                                                 DeepSeek + Moonshot fail → Haiku answers. Proves the route's wiring.
//   node --env-file=<env> scripts/ai-fallback-proof.mjs --live
//                                                 LIVE: real providers. DeepSeek is forced to fail (unreachable base URL);
//                                                 then Moonshot too (a bogus Moonshot key → its real 401). A leg whose key is
//                                                 absent is reported SKIPPED, never PASS. Keys are never printed.
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUILT = resolve(root, '.next/server/pages/api/chat.js');
const scenario = process.env.PROOF_SCENARIO;

if (!scenario) {
  if (!existsSync(BUILT)) { console.log('SKIPPED — no build; run `npm run build` first.'); process.exit(2); }
  const live = process.argv.includes('--live');
  const runs = [
    { name: 'ds-fail', want: 'moonshot', need: ['MOONSHOT_API_KEY'] },
    { name: 'both-fail', want: 'anthropic', need: ['ANTHROPIC_API_KEY'] },
  ];
  let bad = 0;
  for (const r of runs) {
    if (live) { const miss = r.need.filter((k) => !process.env[k]); if (miss.length) { console.log(`LIVE ${r.name}: SKIPPED — ${miss.join(', ')} not in this environment (the leg that must answer)`); continue; } }
    const env = { ...process.env, PROOF_SCENARIO: r.name, PROOF_LIVE: live ? '1' : '' };
    const out = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], { env, encoding: 'utf8', timeout: 120000 });
    const lines = `${out.stdout}${out.stderr}`.split('\n').filter((l) => /^(RESULT|\[ai-failover\]|\[ai-spend\]|\[jev\])/.test(l));
    const res = lines.find((l) => l.startsWith('RESULT')) || 'RESULT none';
    const ok = res.includes(`provider=${r.want}`) && res.includes('status=200'); if (!ok) bad++;
    console.log(`${live ? 'LIVE' : 'OFFLINE'} ${r.name}: ${ok ? 'PASS' : 'FAIL'} (want ${r.want})`);
    for (const l of lines) console.log('   ' + l.slice(0, 300));
  }
  process.exit(bad ? 1 : 0);
}

// ─── child: one scenario ────────────────────────────────────────────────────────────────────────────────────────────────────
const live = process.env.PROOF_LIVE === '1';
const seen = [];
if (live) {
  // Force DeepSeek down for real: an address nothing listens on. Keys stay whatever the environment holds.
  process.env.DEEPSEEK_BASE_URL = 'http://127.0.0.1:9';
  if (!process.env.DEEPSEEK_API_KEY) process.env.DEEPSEEK_API_KEY = 'proof-bearer-unused';
  if (scenario === 'both-fail') process.env.MOONSHOT_API_KEY = 'proof-invalid-moonshot-key';
  const real = globalThis.fetch;
  globalThis.fetch = (url, init) => { seen.push(String(url).replace(/\/\/[^/]*@/, '//')); return real(url, init); };
} else {
  // Stub keys (not key-shaped) + stubbed providers. No network at all; Jev stays off so nothing leaves the machine.
  Object.assign(process.env, { DEEPSEEK_API_KEY: 'stub-deepseek', DEEPSEEK_BASE_URL: 'https://gateway.stub/api/gateway', MOONSHOT_API_KEY: 'stub-moonshot', ANTHROPIC_API_KEY: 'stub-anthropic', JEV_ENABLED: '0' });
  const enc = new TextEncoder();
  const sse = (events) => new Response(new ReadableStream({ start(c) { for (const e of events) c.enqueue(enc.encode(`data: ${JSON.stringify(e)}\n\n`)); c.enqueue(enc.encode('data: [DONE]\n\n')); c.close(); } }), { status: 200 });
  globalThis.fetch = async (url, init) => {
    const u = String(url); const body = JSON.parse(init.body); seen.push(`${u} model=${body.model}`);
    if (u.includes('gateway.stub')) return new Response('{"error":"stub outage"}', { status: 503 });
    if (u.includes('moonshot')) return scenario === 'both-fail' ? new Response('{"error":"stub outage"}', { status: 500 }) : sse([{ model: body.model, choices: [{ delta: { content: 'Stub answer from the Moonshot leg.' } }] }, { choices: [{ delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: 100, completion_tokens: 8 } }]);
    if (u.includes('anthropic')) return sse([{ type: 'message_start', message: { model: body.model, usage: { input_tokens: 100 } } }, { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Stub answer from the Haiku leg.' } }, { type: 'message_delta', usage: { output_tokens: 8 } }]);
    return new Response('unexpected host', { status: 599 });
  };
}

const require = createRequire(import.meta.url);
const mod = require(BUILT); const handler = mod.default?.default || mod.default || mod;
const req = { method: 'POST', headers: { 'x-forwarded-for': '203.0.113.7' }, body: { language: 'en', messages: [{ role: 'user', content: 'In one sentence: what is tokenization?' }] } };
let status = 0, payload = null;
const res = { setHeader() {}, status(s) { status = s; return this; }, json(j) { payload = j; return this; } };
const t0 = Date.now();
await handler(req, res);
const hosts = seen.map((s) => s.split('/').slice(0, 3).join('/')).filter((h) => !h.includes('typesafe')); // Jev (shadow) is not a provider
const provider = /moonshot/.test(hosts.at(-1)) ? 'moonshot' : /anthropic/.test(hosts.at(-1)) ? 'anthropic' : /deepseek|gateway|127\.0\.0\.1/.test(hosts.at(-1)) ? 'deepseek' : 'none';
console.log(`RESULT status=${status} provider=${provider} ms=${Date.now() - t0} calls=${hosts.join(' → ')} reply="${String(payload?.reply || '').slice(0, 120).replace(/\s+/g, ' ')}"`);
await new Promise((r) => setTimeout(r, live ? 9000 : 50)); // let the shadow Jev gate log its line
process.exit(0);
