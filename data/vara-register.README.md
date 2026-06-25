# VARA Public Register — data pull (Tier 1 spine)

**Pulled & live-verified:** 2026-06-25
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
