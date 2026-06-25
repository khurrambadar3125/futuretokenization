// Tier-2 — UAE Web3 ecosystem directory (NOT VARA-licensed VASPs).
// Source of truth: data/ecosystem.json. Hard rule: every entry comes from a NAMED source and is
// verified before listing; unverifiable entries are excluded. Tier-2 records must NEVER carry a
// VARA licenceRef/activities — a tier guard below rejects any that do.

import ecosystem from '../data/ecosystem.json';

// Controlled taxonomy (brief section 8) — do not free-type categories.
export const ECOSYSTEM_CATEGORIES = [
  { key: 'dev-studio', label: 'Dev Studio' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'defi-protocol', label: 'DeFi Protocol' },
  { key: 'nft-gaming', label: 'NFT / Gaming' },
  { key: 'advisory', label: 'Advisory' },
  { key: 'market-maker', label: 'Market Maker' },
  { key: 'vc-investor', label: 'VC / Investor' },
  { key: 'media-education', label: 'Media / Education' },
  { key: 'other', label: 'Other' },
];

// Tier guard: an ecosystem record must not look like a licensed VASP.
function assertEcosystem(e) {
  if (e.licenseRef || e.activities || e.regStatus) {
    throw new Error(`Ecosystem entry "${e.name}" carries VASP-only fields — reject (tier guard).`);
  }
  return e;
}

export function getEcosystemMeta() {
  return {
    pulled: ecosystem.pulled,
    sources: ecosystem.sources || [],
    hubs: ecosystem.hubs || [],
    verificationStandard: ecosystem.verificationStandard,
    count: (ecosystem.entities || []).length,
  };
}

export function getAllEcosystem() {
  return (ecosystem.entities || []).map(assertEcosystem).map((e) => ({
    ...e,
    notVaspNotice: true, // always true on Tier-2; drives the mandatory disclaimer
  }));
}

export function getEcosystemBySlug(slug) {
  const e = (ecosystem.entities || []).find((x) => x.slug === slug);
  return e ? { ...assertEcosystem(e), notVaspNotice: true } : null;
}
