#!/usr/bin/env node
// Live calibration of the two Jev jobs in the RWA news brief (scripts/rwa-news.mjs), with PLANTED items:
//   A. relevance triage — hand-labelled headlines, relevant vs irrelevant (incl. the traps the old Haiku prompt named:
//      a digital bank with no tokenization angle, crypto price/hack stories).
//   B. the enforce gate on a brief — faithful condensations must PASS, planted bad paraphrases (wrong entity, reversed
//      outcome, invented claim, invented number, hype) must HOLD.
// Fixtures are synthetic test headlines, never published. Cost ≈ $0.0002 (Jev only; no LLM call).
// Run: node --env-file=.env.local scripts/news-jev-calibrate.mjs   (needs TYPESAFE_API_KEY; exits 2 = SKIPPED without it)
import { triage, gateBrief, RELEVANCE_THRESHOLD } from './rwa-news.mjs';

if (!process.env.TYPESAFE_API_KEY) { console.log('SKIPPED — TYPESAFE_API_KEY not set; Jev cannot be calibrated.'); process.exit(2); }

const R = (title, desc, want) => ({ title, desc, want });
const RELEVANCE = [
  R('BlackRock tokenized money market fund BUIDL adds Solana share class', 'The fund, which holds US Treasury bills, now issues tokens on a sixth blockchain.', true),
  R('Franklin Templeton brings its on-chain US government money fund to Ethereum', 'Shares of the fund are recorded as tokens on the public ledger.', true),
  R('HSBC launches tokenized gold for retail investors in Hong Kong', 'Each token represents a fraction of physical gold held in the bank vault.', true),
  R('Circle reports USDC circulation rose in the third quarter', 'The stablecoin issuer published its monthly reserve attestation.', true),
  R('Dubai Land Department pilots tokenized property title deeds', 'Fractional ownership of real estate recorded on a blockchain under VARA oversight.', true),
  R('UBS issues a digital bond on a public blockchain', 'The Swiss bank settled the tokenized bond with institutional buyers.', true),
  R('Ondo Finance expands tokenized Treasury product to new markets', 'The protocol tokenizes short-term US government debt for non-US investors.', true),
  R('Hong Kong Monetary Authority opens stablecoin issuer licensing', 'Applicants must hold full reserves in high-quality liquid assets.', true),
  R('Securitize and Apollo launch tokenized private credit fund', 'The feeder fund gives on-chain investors access to private credit.', true),
  R('Siebert Williams Shank tokenizes municipal bond issuance', 'The municipal debt was issued and settled as tokens.', true),
  R('Tether launches euro stablecoin under MiCA', 'The euro-pegged token is issued by a licensed EU entity.', true),
  R('Neobank Revolut adds tokenized deposits for business clients', 'Corporate customers can move tokenized deposits between accounts on a permissioned ledger.', true),
  R('Bitcoin climbs above resistance as ETF inflows return', 'Traders cite renewed institutional demand for spot bitcoin funds.', false),
  R('Crypto exchange hacked, attackers drain hot wallets', 'The exchange paused withdrawals after the exploit.', false),
  R('Digital bank Monzo reports first annual profit', 'The UK neobank grew customer deposits and lending income.', false),
  R('Ethereum gas fees fall to multi-year low', 'Network activity has shifted to layer-2 rollups.', false),
  R('Memecoin surges after celebrity endorsement', 'The token rallied on social media hype.', false),
  R('NFT marketplace lays off staff amid volume slump', 'Trading volumes for digital collectibles continued to fall.', false),
  R('Solana validator client ships performance upgrade', 'The new client version reduces block propagation time.', false),
  R('Chase mobile app adds budgeting features', 'The bank updated its app with new spending insights.', false),
  R('Crypto venture funding dips in the quarter', 'Investors backed fewer early-stage blockchain startups.', false),
  R('Dogecoin whale moves large balance to exchange', 'On-chain trackers flagged the transfer.', false),
];

const B = (brief, why, title, desc, want, label) => ({ brief, why, source: `${title}\n${desc}`, want, label });
const SRC1 = ['BlackRock tokenized fund BUIDL crosses $2.5 billion in assets', 'The tokenized Treasury fund grew after adding new blockchains in 2026.'];
const SRC2 = ['SEC approves tokenized share class for Franklin money fund', 'The regulator cleared an on-chain share class for the government money market fund.'];
const SRC3 = ['HSBC launches tokenized gold for retail investors in Hong Kong', 'Each token represents a fraction of physical gold held in the bank vault.'];
const SRC4 = ['Hong Kong opens stablecoin issuer licensing', 'Applicants must hold full reserves in high-quality liquid assets.'];
const GATE = [
  B('BlackRock BUIDL tokenized fund passes $2.5bn', 'Shows institutional demand for tokenized Treasuries', ...SRC1, 'pass', 'faithful'),
  B('SEC clears on-chain share class for Franklin money fund', 'A regulatory step for tokenized funds', ...SRC2, 'pass', 'faithful'),
  B('HSBC offers tokenized gold to Hong Kong retail investors', 'Brings fractional gold ownership on-chain for retail', ...SRC3, 'pass', 'faithful'),
  B('Hong Kong opens licensing for stablecoin issuers', 'Full-reserve rules set the bar for issuers', ...SRC4, 'pass', 'faithful'),
  B('BlackRock BUIDL tokenized fund passes $3bn', 'Shows institutional demand for tokenized Treasuries', ...SRC1, 'hold', 'invented number'),
  B('SEC rejects on-chain share class for Franklin money fund', 'A setback for tokenized funds', ...SRC2, 'hold', 'reversed outcome'),
  B('Fidelity launches tokenized gold for retail investors in Hong Kong', 'Brings fractional gold ownership on-chain for retail', ...SRC3, 'hold', 'wrong entity'),
  B('Hong Kong bans stablecoins issued without a local bank partner', 'Issuers must partner with local banks', ...SRC4, 'hold', 'invented claim'),
  B('HSBC tokenized gold set to skyrocket for retail', 'A game-changing retail product', ...SRC3, 'hold', 'hype (house rule)'),
  B('Hong Kong opens stablecoin licensing, backed by government guarantee', 'Reserves are guaranteed risk-free', ...SRC4, 'hold', 'invented guarantee'),
  B('HSBC brings tokenized gold to Hong Kong retail buyers', 'Follows Standard Chartered exiting the same market', ...SRC3, 'hold', 'why invents a fact'),
  B('BlackRock tokenized Treasury fund BUIDL tops $2.5bn', 'Fund now approved by the European Central Bank', ...SRC1, 'hold', 'why invents approval'),
  B('Hong Kong sets full-reserve rule for stablecoin issuers', 'Licensing raises the bar for who can issue', ...SRC4, 'pass', 'faithful'),
  B('Franklin money fund gets SEC nod for on-chain shares', 'Regulators are making room for tokenized funds', ...SRC2, 'pass', 'faithful'),
];

let ok = 0, n = 0; const t0 = Date.now(); const ps = [];
console.log(`A. Relevance triage (threshold ${RELEVANCE_THRESHOLD})`);
for (const x of RELEVANCE) {
  const v = await triage(x); n++;
  if (v.source !== 'jev') { console.log(`  UNJUDGED ${x.title}`); continue; }
  const good = v.relevant === x.want; if (good) ok++;
  ps.push({ p: v.p, want: x.want });
  console.log(`  ${good ? 'ok ' : 'MISS'} p=${v.p.toFixed(2)} want=${x.want ? 'relevant  ' : 'irrelevant'} ${v.category.padEnd(12)} ${x.title.slice(0, 70)}`);
}
const relScore = `${ok}/${n}`;
const minRel = Math.min(...ps.filter((x) => x.want).map((x) => x.p)); const maxIrr = Math.max(...ps.filter((x) => !x.want).map((x) => x.p));
console.log(`  → relevance ${relScore} correct; lowest relevant p=${minRel.toFixed(2)}, highest irrelevant p=${maxIrr.toFixed(2)} (margin ${(minRel - maxIrr).toFixed(2)})`);

let gok = 0, gn = 0;
console.log('B. Brief gate (rules → number grounding → Jev faithfulness), ENFORCE mode');
for (const x of GATE) {
  const g = await gateBrief({ brief: x.brief, why: x.why }, x.source); gn++;
  const got = g.verdict === 'pass' ? 'pass' : g.verdict === 'hold' ? 'hold' : 'unjudged';
  const good = got === x.want; if (good) gok++;
  const p = g.answers?.beyondSource?.noul;
  console.log(`  ${good ? 'ok ' : 'MISS'} ${got.padEnd(8)} want=${x.want} ${x.label.padEnd(18)} ${p != null ? `beyondSource=${p.toFixed(2)}` : '                 '} ${g.reasons.filter((r) => !r.startsWith('jev:')).join('; ').slice(0, 60)}`);
}
console.log(`  → gate ${gok}/${gn} correct (planted bad paraphrases held, faithful passed)`);
console.log(`CALIBRATION relevance ${relScore} · gate ${gok}/${gn} · ${((Date.now() - t0) / 1000).toFixed(1)} s · ${new Date().toISOString()}`);
process.exit(ok === n && gok === gn ? 0 : 1);
