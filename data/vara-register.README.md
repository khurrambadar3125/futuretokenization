# VARA Public Register — data pull (Tier 1 spine)

**Pulled & live-verified:** 2026-07-22 (previous pull: 2026-06-25)

## UPDATE 2026-07-22 — re-pull via scripts/pull-vara-register.py

The pull is now a repeatable script (`scripts/pull-vara-register.py`) that refuses to write the
dataset unless the Active VL refs exactly match the server-rendered register page (independent
build artifact). After a re-pull, run `scripts/sync-corpus-register.py` (regenerates the corpus
PART 2 table + activity counts) then `scripts/gen-czar-corpus.py` (rebuilds lib/czarCorpus.js).

**Verified counts (2026-07-22):** 51 Active firms / 50 distinct VL refs (BitGo MENA + CoinMENA
still share VL/23/09/001) / 20 IPA (Issued) / 2 Withdrawn / 0 Pending. Cross-check vs rendered
page: PASS (51 rows, 50 distinct refs). All 20 IPA + 2 graduated + 2 withdrawn entity detail
pages fetched individually (HTTP 200, ref + status spot-checked on page content).

**Movements since 2026-06-25:**
- GRADUATED IPA → full licence: Tribe Tokenisation FZE (IPA/25/12/005 → VL/26/06/002),
  YHEGO (IPA/25/10/006 → VL/26/06/001), both June 2026.
- WITHDRAWN: WPME Technology/WadzPay (VL/24/04/004 — was the "Pending inside the Licensed tab"
  quirk; now delisted from the rendered page, CMS carries a Withdrawn node) and
  MuseTech VA FZCO (IPA/25/12/006).
- NEW IPA: Revolut Digital Assets FZE (IPA/26/06/002), Triple A Technologies FZCO
  (IPA/26/06/004), Web3Exchange DMCC (IPA/26/07/001).
- Headline count moved 48 → **50** distinct active licences (51 firms). All corpus/Czar/site
  count consumers updated the same day.

**New parser quirks handled:** CMS urls use `/vara-en/` (normalized to `/en/`); duplicate-ref
nodes resolved by status rank (Active/Issued > Withdrawn > Pending) with the equal-rank
different-name exception preserved for the real shared-ref pair (BitGo MENA + CoinMENA);
`licenseActivities` arrives as a list.

---

## Historical pull 2026-06-25 (superseded — kept for the integrity log)
**Authoritative source:** VARA Public Register — https://www.vara.ae/en/licenses-and-register/public-register/
**Method:** The register is JS-rendered (Gatsby + Umbraco). Data extracted from the Gatsby static-query JSON
(`/page-data/sq/d/*.json`, 3 files merged), then **cross-checked against the live rendered page in a real
browser**. Reference key = `varaReferenceNumber || vASPReference` (some entries leave the former blank — see
bug note). Output → `vara-register.json`.

## VERIFIED COUNTS (matched to the live page, tab by tab)

| Live tab | Live counter | Refs we captured | Match |
|---|---|---|---|
| **LICENSED VASPs** | "49 results found" | 49 VL/ references | ✅ exact |
| **IN-PRINCIPLE APPROVAL** | "21 results found" | 20 IPA/ references | ✅ all 20 match; live's "21" counts one entry that has no reference number (VARA page quirk) |
| **Total in dataset** | — | **69 entities** | 49 VL + 20 IPA |

### Status breakdown (dataset)
- **Active** (full VASP Licence): 48
- **Pending** (VL ref, not yet active): 1 — WPME/WadzPay (VARA still counts it inside the 49 "Licensed" tab)
- **Issued** (In-Principle Approval only): 20

### Why the tiering matters for the platform
VARA itself separates **LICENSED VASPs** from **IN-PRINCIPLE APPROVAL**. The 20 IPA holders (incl. Standard
Chartered Bank, Kraken/Payward, Rain MENA, Flipster) are **not yet fully licensed**. The directory MUST render
`status` per VARA's own tabs — never show an IPA holder as a full licensee. Headline counts come from
`vara-register.json`, never hardcoded.

## Activity counts (dataset, deduped — an entity may hold several)
```
50  Broker-Dealer Services
16  Management and Investment Services
13  Exchange Services
 6  Lending and Borrowing Services
 5  Advisory Services
 4  Custody Services
 4  Exchange Services (including VA Derivatives Trading)
 3  Category 1 VA Issuance
 2  Custody Services [including custodial staking]
 1  VA Custody Services [including custodial staking and collateral wallet services]
```

## Integrity log — two failures caught and fixed before any data shipped

1. **Model-read fabrication (WebFetch).** The fuzzy page-read invented entries ("CoinMENA", "GCEX"), claimed
   "all 49 fully licensed, no IPAs" (false — there are 20 IPAs), and miscounted. None reached the dataset
   because the spine is built from the authoritative CMS JSON, not the page-read.
2. **My own parser's silent under-count.** First passes reported **47** — WRONG. 14 licensed VASPs (Binance,
   Deribit, Crypto.com, Komainu, Hex Trust, Laser Digital, XBase, Ceffu, Selini, LCT, RIV, Daman, MBIO, GCEX)
   store their ref in `vASPReference` with an **empty** `varaReferenceNumber`; my filter required the latter and
   silently dropped them. Fixed with a fallback, then verified the 49 VL set matches the live tab exactly.

**Lesson:** "47" looked clean and was wrong. The live-page cross-check is what proved the real number is 49+20.

## Re-pull procedure
1. Fetch `/page-data/en/licenses-and-register/public-register/page-data.json`, read `staticQueryHashes`.
2. Fetch each `/page-data/sq/d/<hash>.json`, collect every `contentTypeAlias=='varaRegistry'` object.
3. Dedupe by `varaReferenceNumber || vASPReference`, preferring Active status + English URL.
4. Cross-check VL count vs the live "LICENSED VASPs" counter and IPA count vs "IN-PRINCIPLE APPROVAL" before publishing.
