# Brief: Add the UAE Web3 Ecosystem Directory (Tier 2)

**For:** Claude Code, inside the FutureTokenization repo.
**Relationship to existing work:** ADD ONLY. Do not modify or remove the existing VARA VASP directory, the Czar corpus, the connector architecture, or any current routes. This adds a *second* directory alongside the first.
**Companion files:** `digital-czar-knowledge-corpus.md`, `CONNECTOR_ARCHITECTURE.md`.

---

## 0. The core distinction — read before building

We now have TWO directories, and they are NOT the same kind of thing. Treat them differently or you will damage the site's credibility.

| | **Tier 1 — VARA VASPs** | **Tier 2 — Web3 ecosystem** |
|---|---|---|
| What | The 49 VARA-licensed virtual-asset providers | Dev shops, startups, infra, service firms in UAE Web3 |
| Authoritative source? | YES — the VARA public register | NO — no single official list exists |
| Count | Exactly 49 (verifiable, changes slowly) | Unknown. Marketing sources claim "~1,500" but this is **unverified** |
| Integrity standard | Every record traces to the register | Every record traces to a *named* source; unverifiable entries excluded |
| Can we say "licensed"? | Yes, per register | NO — these firms are not VARA-licensed; never imply they are |

**The "1,500" figure is a marketing claim from a single blog, not a fact.** Do NOT display "1,500 organizations" as a headline number. Do NOT generate a list of 1,500 names to hit that figure. Build the directory from real, sourced entries only — however many that honestly is — and let the count be whatever the verified data supports.

---

## 1. Anti-fabrication rules (non-negotiable)

These extend the existing data-integrity rule to the ecosystem directory:

1. **Never invent an organization.** Every entry must come from a real, citable source (see Section 3). If you cannot find a source for a name, do not add it.
2. **Never invent fields.** If you don't have a firm's founding year, focus area, or free zone, leave the field empty and marked "unverified" — do not guess.
3. **Never imply VARA licensing.** Tier-2 firms are service/infra/dev companies, NOT licensed VASPs. Each Tier-2 profile must carry a clear line: "Not a VARA-licensed VASP. Listed as an ecosystem participant." This protects users who might otherwise assume a listing = a license.
4. **Stamp every entry** with `source` and `lastVerified`, same as Tier 1.
5. **No "licensed/regulated" badges** on Tier-2 entries. Reserve those exclusively for the VARA directory.
6. **Mark staleness.** Web3 startups fold frequently. Any entry not re-confirmed in N months gets a "may be outdated" flag, not silent deletion.

When in doubt, exclude the entry. A smaller honest directory beats a large padded one.

---

## 2. Where Tier 2 fits in the architecture

Add as a parallel section to the existing routes (from `CONNECTOR_ARCHITECTURE.md`):

| Route | Purpose |
|---|---|
| `/ecosystem` | The Tier-2 directory — filter by category, free zone, focus area |
| `/ecosystem/[slug]` | Individual ecosystem-org profile (claimable later, like providers) |

Keep it visibly distinct from `/directory` (the VASP register) in the UI — different section, different label ("UAE Web3 Ecosystem" vs "VARA-Licensed Providers"), so a user never confuses a dev shop with a licensed VASP. The mega-menu and mobile cards can add an "Ecosystem" entry alongside "Directory."

---

## 3. Real sources for Tier-2 data (use these, not memory)

Do NOT populate this from model training data — that is exactly how fabrication happens. Pull from named, checkable sources, and store the source per entry:

- **DMCC Crypto Centre member directory** — free-zone members (real, maintainable list).
- **RAK DAO** registered entities, **DIFC** and **Dubai Internet City** member lists.
- **Hub71 / Hub71+ Digital Assets** (Abu Dhabi) portfolio.
- **Clutch.co, GoodFirms, Crunchbase** — Dubai/UAE blockchain & Web3 company listings (vendor-submitted; treat as leads to verify, not gospel).
- **Official company websites** — to confirm a firm is real, active, and UAE-based before listing.

Categorize each entry (e.g. dev studio, infrastructure, DeFi protocol, NFT/gaming, advisory, market maker, VC). Capture: legal/brand name, category, focus area, free zone/jurisdiction, website, one-line description, source, lastVerified.

**Process rule:** a name appearing on an aggregator is a *candidate*, not a confirmed entry. Confirm it resolves to a real, currently-live UAE Web3 company (working site / active presence) before it goes in. Log the source.

---

## 4. Suggested phasing

- **Phase A:** Build the `/ecosystem` route + schema + the "not a VASP" disclaimer + filters. Seed with a *small, fully-verified* set (e.g. the DMCC Crypto Centre members you can confirm). Ship honestly at whatever the real count is.
- **Phase B:** Expand by working through the other sources, verifying each candidate. The directory grows as verification grows — never faster.
- **Phase C (later, optional):** Make Tier-2 profiles claimable (same mechanism as provider claims), so firms can confirm/correct their own entry — which also crowdsources verification.

---

## 5. What to tell the user (you, Khurram) honestly

- The verified ecosystem directory will almost certainly be **smaller than 1,500** at launch, because most of that figure is unverifiable. That is correct and good — it is the honest number.
- The directory's value is that it's *trustworthy*, not that it's *big*. A user who finds your VASP-vs-ecosystem distinction clear and your entries real will trust the whole platform more.
- Claiming "1,500" you can't substantiate would directly contradict the methodology page and hand a critic an easy hit.

---

## 6. The handoff message to paste into Claude Code

> Add a second directory at `/ecosystem` for UAE Web3 ecosystem organizations (dev shops, infra, startups, advisory, VC). This is ADDITIVE — do not touch the existing VARA `/directory`, the Czar corpus, or current routes. Follow the rules in this brief: Tier-2 entries are NOT VARA-licensed and every profile must say so; never fabricate organizations or fields; populate only from named sources (DMCC Crypto Centre, RAK DAO, DIFC, Hub71, Clutch/GoodFirms/Crunchbase as leads-to-verify, plus official company sites); stamp every entry with source + lastVerified; do NOT display "1,500" as a count — let the verified count be whatever the real data supports. Build the route, schema, "not a VASP" disclaimer, and filters first; seed with a small fully-verified set; expand only as verification allows.

---

---

## 7. Data schema (build-ready)

**Design decision: shared base + tier extension.** Both directories share one base record so they can use one search index, one card component, and one rendering path. A `tier` discriminator and tier-specific fields keep them safe to distinguish. This avoids (a) a full mirror that would leave dangerous empty license fields on non-licensed firms, and (b) a fully standalone schema that would force duplicate code and drift.

**Shared base (both tiers):**
```
id            string   required  stable unique id
slug          string   required  url-safe, unique within tier
tier          enum     required  "vasp" | "ecosystem"
name          string   required  legal or primary brand name
category       string   required  from the controlled taxonomy (Section 8)
jurisdiction  string   optional  free zone / emirate (e.g. "DMCC", "DIFC", "RAK DAO")
website       string   optional  official URL (https)
description   string   optional  one neutral sentence, no marketing language
status        enum     required  "active" | "unverified" | "may-be-outdated" | "dropped"
source        string   required  named source the entry came from (Section 3)
lastVerified  date     required  ISO date of last confirmation
claimed       boolean  default false   set true once a firm verifies its own entry
```

**VASP tier adds (tier = "vasp"):**
```
licenseRef    string   required  VARA reference (e.g. VL/25/05/002)
activities    string[] required  licensed activities, verbatim from register
issueDate     date     required  license issue date
regStatus     enum     required  "Licensed" | "Provisional" | "MVP"
```

**Ecosystem tier adds (tier = "ecosystem"):**
```
focusArea     string   optional  e.g. "smart contracts", "DeFi infra", "NFT/gaming"
freeZone      string   optional  if different from jurisdiction granularity
notVaspNotice boolean  required, ALWAYS true   drives the mandatory disclaimer
```

**Hard rules at the schema level:**
- An ecosystem entry must NEVER carry `licenseRef`, `activities`, `issueDate`, or `regStatus`. If those fields are present on a `tier: "ecosystem"` record, that is a bug — reject it.
- `notVaspNotice` is always true on ecosystem records and renders as a visible disclaimer on every card and profile.
- License/regulated badges render ONLY when `tier === "vasp"`. Gate the badge component on the tier, not on the presence of a field.

Storage: Phase 1 → versioned JSON/MDX in-repo (mirrors the existing approach). Phase 3 → Supabase, one `organizations` table with the tier discriminator (or two tables sharing the base — implementer's call, but keep one query layer).

---

## 8. Controlled category taxonomy (fix these — don't free-type)

Ecosystem `category` must be one of these canonical values so filters stay consistent:
- `dev-studio` — Web3/blockchain development agencies
- `infrastructure` — nodes, wallets, chains, tooling
- `defi-protocol` — DeFi applications/protocols
- `nft-gaming` — NFT platforms, GameFi, metaverse
- `advisory` — consulting, setup, compliance advisory (note: NOT VARA Advisory licensees — those are tier "vasp")
- `market-maker` — liquidity/market-making firms
- `vc-investor` — venture capital, accelerators, funds
- `media-education` — Web3 media, events, education
- `other` — real but doesn't fit above (use sparingly; prefer adding a category over overusing "other")

(VASP `category` continues to use the seven VARA activity types — do not mix the two taxonomies.)

---

## 9. Per-entry verification checklist (the operational standard)

A candidate name becomes a listed entry ONLY if it passes all of these. Log the result.

1. **Real & resolvable** — resolves to a specific company, not a generic term, and isn't a duplicate of an existing entry (see Section 10).
2. **Live presence** — working official website OR a verifiable active profile (recent activity, not a dead link).
3. **UAE nexus** — credible evidence of UAE presence (free-zone membership, UAE address, "Dubai/Abu Dhabi/UAE" on official site).
4. **Correct tier** — it is NOT a VARA-licensed VASP. (Cross-check against the 49 in the VASP directory; if it IS licensed, it belongs in tier "vasp," not here.)
5. **Sourced** — at least one named source recorded in the `source` field.
6. **Currency** — evidence of activity within the last ~12 months; if uncertain, set `status: "unverified"` and still allow listing with that flag, or exclude.

Fail any of 1–5 → exclude. Pass 1–5 but fail 6 → list with a staleness flag, never silently.

---

## 10. De-duplication & identity

Firms appear under varied names across DMCC, Clutch, Crunchbase, etc. Before adding:
- Normalize the name (strip "FZE/FZCO/LLC/Ltd", lowercase, trim) and check against existing slugs.
- Match on website domain where available — same domain = same firm, merge rather than duplicate.
- If two sources disagree on details, keep the entry but record both sources; prefer the official company site for the canonical fields.
- Maintain an `aka` list on the record for alternate names (improves search, prevents re-adding a dup).

---

## 11. Integration with the rest of the platform

- **Mega-menu / mobile cards:** add an "Ecosystem" item ALONGSIDE (not replacing) "Directory." Label them unambiguously — "VARA-Licensed Providers" vs "UAE Web3 Ecosystem" — so the two are never conflated. (These nav surfaces were designed additively; extend them, don't rewrite.)
- **The Digital Czar:** the Czar MAY answer questions about ecosystem firms, but MUST (a) state they are not VARA-licensed, (b) apply the same "never invent / cite source / say if unverified" rules from the corpus, and (c) never present an ecosystem firm as a licensed provider. Add a short note to the corpus (additive) describing the ecosystem directory and this caveat, so the Czar's behavior is grounded.
- **Validate-a-license tool:** if a user checks an ecosystem firm's name in the license validator, the correct answer is "not found in the VARA register" plus, if it's in the ecosystem directory, "listed as an ecosystem participant, not a licensed VASP." Wire the validator to check tier and respond accordingly — this turns a potential confusion into a trust-building moment.

---

## 12. Definition of done (Phase A)

Phase A is complete when: the `/ecosystem` route renders; the schema above is implemented with the tier guard; the "not a VASP" disclaimer shows on every ecosystem card and profile; category filters work off the controlled taxonomy; a small seed set of FULLY VERIFIED entries (each passing Section 9) is live with sources and dates; and nothing in the existing VASP directory, corpus, or routes was modified. The displayed count reflects only verified entries — no "1,500" headline anywhere.

---

*Pair with the existing connector architecture and Czar corpus. ADD ONLY. Verified-or-excluded. Never imply licensing. Tier guards everything.*
