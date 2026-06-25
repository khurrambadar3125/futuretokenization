# FutureTokenization → The VARA Connector

**Goal (Khurram, 2026-06-25):** Make this platform *the link between investors and every VARA-licensed
virtual-asset provider in the UAE.*

**Chosen model:** **A + B** — full live directory now, pay-per-lead introduction layer designed on top
(B goes live only after a UAE lawyer signs off).

**Two directories, two integrity standards.** This platform carries TWO distinct directories — do not
conflate them. See `ecosystem-directory-brief.md` for the full Tier-2 rules.

| | **Tier 1 — VARA VASPs** (`/directory`) | **Tier 2 — Web3 ecosystem** (`/ecosystem`) |
|---|---|---|
| What | VARA register entries: **48 active licensed VASPs (+1 pending) + ~20 In-Principle Approvals** | Dev shops, infra, startups, advisory, VC in UAE Web3 |
| Authoritative source | YES — the VARA public register (live-verified 2026-06-25; see `data/vara-register.json`, `data/corpus-vs-live-register.md`) | NO — no single official list exists |
| Count | Headline **48** (distinct active licences). VARA's tab shows 49 firms (BitGo MENA + CoinMENA share a ref; +1 pending). ~20 IPA shown separately. | Whatever verification honestly supports — **never "1,500"** |
| Integrity | Every record traces to the register | Every record traces to a *named* source; unverifiable excluded |
| "Licensed"? | Yes, per register | **NO — never imply licensing; every profile says "Not a VARA-licensed VASP."** |

Tier 2 is **ADD-ONLY**: it never modifies Tier 1, the Czar corpus, the connector architecture, or existing routes.

> **Honest framing.** Code builds the venue. Three things code cannot do, and you own them:
> 1. Get VARA licensees to claim profiles / answer leads → business development.
> 2. Give legal cover → a UAE lawyer must clear Model B (introducing/arranging can itself be VARA-regulated).
> 3. Manufacture investor deal flow → traffic + trust are earned.

---

## 1. Positioning shift

| | Today | After |
|---|---|---|
| Tagline | "The Complete Codex of Tokenization & Digital Assets" | "Where investors meet every VARA-licensed virtual-asset provider in the UAE." |
| Core product | A codex you read | A directory + introduction engine, with the codex as SEO front-of-funnel |
| Stance | Educational only | Discovery & introduction platform — **still not an advisor or broker** |

The "educational only" disclaimer is an asset, not a liability — it keeps Model A low-burden. Carry it forward.

---

## 2. The data spine — the live VARA register (the moat)

Everything hangs off a structured, **always-current** mirror of the VARA public register. Data-integrity rule
applies in full: every record traceable to the register, stamped with `lastSynced`, **never invented, never stale**.

- **License categories** (confirm exact names against the live register before shipping): Advisory,
  Broker-Dealer, Custody, Exchange, Lending & Borrowing, Management & Investment, VA Transfer & Settlement,
  VA Issuance.
- **Per licensee:** legal name, license number, categories held, status (Licensed / Provisional / MVP),
  issue date, public website, short description, logo.
- **Sync:** scheduled re-pull (e.g. weekly) + a "last synced" badge on every profile. A licensee that drops
  off the register is flagged, never silently kept live (no-phantom-data rule).
- **Storage:** Phase 1 → versioned JSON/MDX in-repo (no DB). Phase 3 → Supabase table `providers`.

---

## 3. Page map (break the monolith into real routes)

| Route | Purpose |
|---|---|
| `/` | New connector home: dual value prop (investor + provider), featured licensees, codex teaser |
| `/directory` | **Tier 1** — the VARA VASP registry; filter by license category, asset class, status; search |
| `/provider/[slug]` | Individual licensee profile (claimable) |
| `/ecosystem` | **Tier 2** — UAE Web3 ecosystem directory (NOT licensed); filter by category, free zone, focus area |
| `/ecosystem/[slug]` | Individual ecosystem-org profile (claimable later); carries "Not a VARA-licensed VASP" line |
| `/learn/*` | The existing codex, split out of the monolith into real sub-pages (big SEO win) |
| `/investors` | Investor-side landing: how it works → "Request Introduction" (Model B) |
| `/providers` | Licensee-side landing: claim profile, get leads, pricing |
| `/intelligence` | The existing news/intelligence feed |
| `/disclaimer` `/terms` `/privacy` | Carried over + strengthened for Model B |

Tri-lingual (EN/AR/FR) preserved across all new routes via the existing `translations.js` pattern.
UAE-MSA-Gulf Arabic register.

---

## 4. Two-sided functionality

**Investor side (no login):** browse directory → shortlist → "Request Introduction" form (investor type,
ticket size, asset class, jurisdiction, accreditation self-cert) → routed as a lead.

**Licensee side (login):** claim & verify profile (email-domain verification) → dashboard to receive/respond
to leads → subscription tier (featured placement, priority leads).

**Lead-routing engine (Model B):** match investor intent → licensees licensed for that activity/asset.
**No advice. No money handled. No custody.** Every surface: "We are a discovery & introduction platform,
not a financial advisor or broker. Introductions are not recommendations."

---

## 5. Data models (Phase 3 / Supabase, all with RLS)

`providers` · `provider_claims` · `provider_users` · `leads` · `lead_routes` · `subscriptions`
RLS on every table — a licensee can only ever see its own leads. Investor PII isolated (UAE PDPL).

---

## 6. Security & compliance (non-negotiable)

- **Iron dome headers** in `next.config.js` (currently missing) — add in Phase 0.
- **Rate limit** the lead form + the existing chat API.
- "Not advice / not broker" disclaimers on every Model B surface.
- Investor PII → UAE PDPL: RLS, no cross-licensee leakage, minimal retention.
- **Model B is legal-gated** — UAE lawyer sign-off before it goes live.

---

## 7. Monetization

- Licensee: free basic listing (from register) → paid **claimed** profile → **featured / priority-leads** tier.
- Investor: free.
- Intelligence reports / sponsorship as a secondary line.

---

## 8. Phasing (scoped & honest)

- **Phase 0 — this session:** this architecture doc + add iron dome headers. No feature build.
- **Phase 1 — MVP that already delivers "the link":** VARA register data pipeline + `/directory` +
  `/provider/[slug]` + home reframe. Real data, direct-contact, **no auth, no DB.** Ships value immediately.
- **Phase 2 — SEO:** restructure the codex into `/learn/*` sub-pages.
- **Phase 3 — full A+B (legal-gated):** Supabase + auth, licensee claim/portal, investor lead form,
  routing engine, Stripe subscriptions.
- **Tier-2 ecosystem directory (parallel track, see `ecosystem-directory-brief.md`):**
  - *A:* `/ecosystem` route + schema + "not a VASP" disclaimer + filters; seed with a small fully-verified
    set (e.g. confirmable DMCC Crypto Centre members). Ship at the honest count.
  - *B:* expand only as each candidate is verified against a named source — never faster.
  - *C (optional):* make Tier-2 profiles claimable (reuses the provider-claim mechanism).

---

## Open items before build

1. ✅ **DONE — live VARA register pulled & browser-verified** (2026-06-25) → `data/vara-register.json`,
   `data/vara-register.README.md`, `data/corpus-vs-live-register.md`. Drive all category counts from this file
   at build time — never hardcode them from a design mockup (images aren't a numeric data source).
2. ✅ **DONE — data source confirmed:** Gatsby static-query JSON behind the register, re-pull procedure in the README.
3. **Legal:** line up UAE counsel for Model B sign-off (can run in parallel with Phase 1–2).
4. **Tier-2 sources:** confirm which ecosystem sources are reliably scrapable/maintainable (DMCC Crypto Centre,
   RAK DAO, DIFC, Hub71, plus Clutch/GoodFirms/Crunchbase as leads-to-verify).
