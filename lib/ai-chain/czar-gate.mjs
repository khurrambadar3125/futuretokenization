// The Digital Czar's Jev gate: does a reply state a firm / licence / number / date / deal the corpus does not contain or contradicts?
// SHADOW on /api/chat (after the reply is sent; logged as [jev], never blocking). Enforce only on his ruling after measured counters.
// Calibrated by scripts/czar-jev-calibrate.mjs (planted faithful and planted wrong answers against the real corpus).
import { gate } from './ai-chain.mjs';

export const CZAR_QUESTIONS = {
  beyondSource: {
    type: 'noul',
    instructions: 'Does `text` state a fact about a firm, licence, licence activity, number, date or deal that `source` does not contain, or that contradicts `source`? General explanations of concepts, advice to check the official register, and statements that information is unavailable are NOT such facts.',
  },
};
export const czarPasses = (a) => { const p = a?.beyondSource?.noul; return typeof p === 'number' && p < 0.5; };

/** gate(reply) against the corpus. mode "shadow" on the live route; the calibration runs the same config. */
export function czarGate(reply, corpus, o = {}) {
  return gate(reply, { state: { text: reply, source: corpus }, questions: CZAR_QUESTIONS, pass: czarPasses, mode: 'shadow', timeoutMs: 8000, ...o });
}
