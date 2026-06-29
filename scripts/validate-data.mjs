#!/usr/bin/env node
/* ============================================================================
   Build-time data-integrity validator — the "digital twin" enforcement.
   Runs on `prebuild`, so it gates EVERY build (local + Vercel).

   The rule (ARCHITECTURE.md §0/§6): no number reaches the screen unless it
   resolves to the register. This script derives the canonical counts straight
   from the entities and asserts the declared counts + the agreed "48" headline
   match. Any drift FAILS the build — a wrong number cannot ship, structurally.
   ============================================================================ */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTER = join(__dirname, '..', 'data', 'vara-register.json');

const errors = [];
const warnings = [];
const eq = (label, got, want) => {
  if (got !== want) errors.push(`${label}: derived ${got} ≠ declared ${want}`);
};

let d;
try {
  d = JSON.parse(readFileSync(REGISTER, 'utf8'));
} catch (e) {
  console.error('✗ data-integrity: cannot read/parse data/vara-register.json —', e.message);
  process.exit(1);
}

const entities = Array.isArray(d.entities) ? d.entities : [];
if (!entities.length) {
  console.error('✗ data-integrity: register has no entities.');
  process.exit(1);
}

// --- Derive counts straight from the source of truth (mirror lib/registry.js) ---
const active = entities.filter((x) => x.status === 'Active');
const distinctActiveVL = new Set(
  active.filter((x) => (x.reference || '').startsWith('VL/')).map((x) => x.reference)
);
const ipa = entities.filter((x) => (x.reference || '').startsWith('IPA/') || x.status === 'Issued');
const pending = entities.filter((x) => x.status === 'Pending');

// --- Assert declared counts match derivation ---
const c = d.counts || {};
eq('totalFirms', entities.length, c.totalFirms);
eq('activeFirms', active.length, c.activeFirms);
eq('distinctActiveLicenceRefs', distinctActiveVL.size, c.distinctActiveLicenceRefs);
eq('inPrincipleApproval', ipa.length, c.inPrincipleApproval);
eq('pendingLicensed', pending.length, c.pendingLicensed);

// --- Assert the agreed public headline (48) is the real distinct-active-licence count ---
const headline = d.agreedHeadlineCount?.activeLicensedVASPs;
eq('agreedHeadlineCount.activeLicensedVASPs', distinctActiveVL.size, headline);

// --- Structural integrity: required fields, unique slugs, reference format ---
const slugSeen = new Set();
for (const [i, x] of entities.entries()) {
  const where = x.name || x.slug || `#${i}`;
  for (const f of ['name', 'slug', 'reference', 'status']) {
    if (!x[f]) errors.push(`entity "${where}": missing required field "${f}"`);
  }
  if (x.slug) {
    if (slugSeen.has(x.slug)) errors.push(`duplicate slug "${x.slug}"`);
    slugSeen.add(x.slug);
  }
  if (x.reference && !/^(VL|IPA)\//.test(x.reference)) {
    warnings.push(`entity "${where}": unusual reference format "${x.reference}"`);
  }
}

// --- Non-fatal: known raw vs curated IPA difference ---
if (d.liveCounters?.IN_PRINCIPLE_APPROVAL != null && d.liveCounters.IN_PRINCIPLE_APPROVAL !== ipa.length) {
  warnings.push(
    `liveCounters.IN_PRINCIPLE_APPROVAL (${d.liveCounters.IN_PRINCIPLE_APPROVAL}) ≠ derived IPA (${ipa.length}) — raw-vs-curated, not displayed; reconcile when convenient.`
  );
}

// --- Report ---
for (const w of warnings) console.warn(`⚠ data-integrity: ${w}`);
if (errors.length) {
  console.error(`\n✗ data-integrity FAILED — ${errors.length} issue(s). Build blocked:`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error('\nFix the register (or the declared counts) so they agree. No number ships unproven.\n');
  process.exit(1);
}

console.log(
  `✓ data-integrity OK — ${entities.length} entities · ${active.length} active firms · ` +
    `${distinctActiveVL.size} distinct active licences (headline ${headline}) · ${ipa.length} IPA.`
);
