// VARA register access layer (Tier 1 — licensed VASPs).
// Source of truth: data/vara-register.json (live-verified 2026-06-25, see data/*.md).
// Never hardcode counts elsewhere — derive them from here.

import registry from '../data/vara-register.json';

// Canonical filter categories. Each raw VARA activity string maps to exactly one of these,
// so filter chips stay stable even though the register uses sub-variants
// (e.g. "Custody Services [including custodial staking]" -> Custody).
export const CATEGORIES = [
  { key: 'broker-dealer', label: 'Broker-Dealer' },
  { key: 'exchange', label: 'Exchange' },
  { key: 'management-investment', label: 'Management & Investment' },
  { key: 'custody', label: 'Custody' },
  { key: 'lending-borrowing', label: 'Lending & Borrowing' },
  { key: 'advisory', label: 'Advisory' },
  { key: 'va-issuance', label: 'VA Issuance' },
];

export function activityToCategory(activity) {
  const a = (activity || '').toLowerCase();
  if (a.includes('broker')) return 'broker-dealer';
  if (a.includes('exchange')) return 'exchange';
  if (a.includes('management')) return 'management-investment';
  if (a.includes('custody')) return 'custody';
  if (a.includes('lending')) return 'lending-borrowing';
  if (a.includes('advisory')) return 'advisory';
  if (a.includes('issuance')) return 'va-issuance';
  return 'other';
}

// Status → display tier. The register mixes full licences with In-Principle Approvals;
// we never present an IPA holder as fully licensed.
export function statusMeta(status, reference) {
  const isIpa = (reference || '').startsWith('IPA/');
  if (isIpa || status === 'Issued') {
    return { label: 'In-Principle Approval', tone: 'amber', licensed: false };
  }
  if (status === 'Active') return { label: 'Licensed', tone: 'green', licensed: true };
  if (status === 'Pending') return { label: 'Pending', tone: 'grey', licensed: false };
  if (status === 'Withdrawn') return { label: 'Withdrawn', tone: 'red', licensed: false };
  return { label: status || 'Unknown', tone: 'grey', licensed: false };
}

function enrich(e) {
  const categories = [...new Set((e.activities || []).map(activityToCategory))].filter(
    (c) => c !== 'other'
  );
  return { ...e, categories, ...statusMeta(e.status, e.reference) };
}

export function getMeta() {
  return {
    pulled: registry.pulled,
    sourceUrl: registry.sourceUrl,
    counts: registry.counts,
    liveCounters: registry.liveCounters,
    headline: registry.agreedHeadlineCount,
  };
}

export function getAllProviders() {
  return registry.entities.map(enrich);
}

export function getProviderBySlug(slug) {
  const e = registry.entities.find((x) => x.slug === slug);
  return e ? enrich(e) : null;
}

// Firms sharing a VARA reference with another firm (VARA data quirk, e.g. BitGo MENA + CoinMENA).
export function getSharedRefPartners(provider) {
  return registry.entities
    .filter((x) => x.reference === provider.reference && x.slug !== provider.slug)
    .map((x) => ({ name: x.name, slug: x.slug }));
}

// Category counts over the ACTIVE licensed set only (for honest filter badges).
export function getCategoryCounts() {
  const counts = {};
  for (const e of registry.entities) {
    if (e.status !== 'Active' || !e.reference.startsWith('VL/')) continue;
    for (const c of new Set((e.activities || []).map(activityToCategory))) {
      if (c !== 'other') counts[c] = (counts[c] || 0) + 1;
    }
  }
  return counts;
}
