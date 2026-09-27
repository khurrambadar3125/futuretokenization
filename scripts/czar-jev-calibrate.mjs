#!/usr/bin/env node
// Live calibration of the Digital Czar's shadow Jev gate (lib/ai-chain/czar-gate.mjs) against the REAL corpus, with PLANTED answers:
// faithful answers built from corpus facts must PASS; planted wrong ones (wrong licence activity, wrong issuer, invented firm,
// wrong regulator/date) must HOLD. Fixtures are test strings, never shown to anyone. Cost ≈ 9 calls × ~15k tokens × $0.042/M ≈ $0.006.
// Run: node --env-file=.env.local scripts/czar-jev-calibrate.mjs   (needs TYPESAFE_API_KEY; exits 2 = SKIPPED without it)
import { CZAR_CORPUS } from '../lib/czarCorpus.js';
import { czarGate } from '../lib/ai-chain/czar-gate.mjs';

if (!process.env.TYPESAFE_API_KEY) { console.log('SKIPPED — TYPESAFE_API_KEY not set; Jev cannot be calibrated.'); process.exit(2); }

const CASES = [
  ['pass', 'faithful', 'PRYPCO FZE holds a VARA Broker-Dealer licence (reference VL/25/05/001), issued on 24 May 2025. It runs the consumer-facing tokenized real-estate marketplace. Check vara.ae for the current status.'],
  ['pass', 'faithful', 'Mantra Finance FZE holds VARA licence VL/25/02/001 covering Exchange, Broker-Dealer and Management & Investment activities, issued on 19 February 2025.'],
  ['pass', 'faithful', 'Komainu MEA FZE is licensed by VARA for custody (reference VL/23/08/001), including custodial staking and collateral wallets.'],
  ['pass', 'faithful', 'Only two firms hold the Category 1 VA Issuance permission: Ctrl Alt Solutions and Tokinvest.'],
  ['pass', 'concept', 'Tokenization means recording ownership of an asset as a digital token on a blockchain, so it can be transferred and settled electronically. For licence details, check the VARA public register at vara.ae.'],
  ['hold', 'wrong activity', 'PRYPCO FZE is the tokenizer: it holds a Category 1 VA Issuance licence and mints the property tokens itself.'],
  ['hold', 'wrong activity', 'Komainu MEA FZE is licensed by VARA as a virtual asset Exchange.'],
  ['hold', 'invented firm', 'Category 1 VA Issuance is held by five firms, including Binance FZE and Ctrl Alt Solutions.'],
  ['hold', 'wrong regulator/date', 'Mantra Finance was licensed by the DFSA in 2022 as a custodian.'],
];

let ok = 0; const t0 = Date.now(); const pass = [], hold = [];
for (const [want, label, text] of CASES) {
  const g = await czarGate(text, CZAR_CORPUS);
  const got = g.verdict; const p = g.answers?.beyondSource?.noul;
  if (got === want) ok++;
  (want === 'pass' ? pass : hold).push(p);
  console.log(`  ${got === want ? 'ok ' : 'MISS'} ${String(got).padEnd(8)} want=${want} ${label.padEnd(20)} beyondSource=${p != null ? p.toFixed(2) : '—'} ${g.jevMs ?? ''} ms ${got === 'unjudged' ? g.reasons.join('; ') : ''}`);
}
const f = (xs, fn) => { const v = xs.filter((x) => typeof x === 'number'); return v.length ? fn(...v).toFixed(2) : '—'; };
console.log(`CALIBRATION czar gate ${ok}/${CASES.length} · highest faithful p=${f(pass, Math.max)} · lowest planted-wrong p=${f(hold, Math.min)} · ${((Date.now() - t0) / 1000).toFixed(1)} s · ${new Date().toISOString()}`);
process.exit(ok === CASES.length ? 0 : 1);
