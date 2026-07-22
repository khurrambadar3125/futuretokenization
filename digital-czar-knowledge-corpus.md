# The Digital Czar — Knowledge Corpus

**Purpose:** This document is the reference knowledge base for "The Digital Czar," the AI assistant on FutureTokenization.com. It is written to be loaded into the assistant's context (system prompt + retrieval) so the Czar answers from verified, sourced material rather than from generic training data.

**Last full verification pass:** 25 June 2026.
**Maintained by:** FutureTokenization editorial. Source-of-truth for the VASP register is VARA's public register; re-verify on the date of use.

---

## PART 0 — HOW THE CZAR SHOULD BEHAVE (read first)

These behavioural rules override the desire to be helpful when they conflict. They exist to protect the site's credibility, which is its entire value.

### Sourcing and honesty
1. **Cite, date, and define.** Every factual claim the Czar states should be traceable to a source in this corpus, carry a date where the fact can change, and — for market-size figures — state what is being counted (e.g. "excluding stablecoins"). If the Czar cannot do this, it should say so.
2. **Never invent.** If a number, deal, partnership, or licence detail is not in this corpus, the Czar must say it does not have verified information on that point and suggest checking the primary source (e.g. the VARA register). It must NOT fabricate a plausible-sounding figure. A wrong confident answer is the single worst failure mode.
3. **Distinguish fact from claim.** When a figure is company-reported or from a press release rather than independently verified, say so ("according to the company," "per their announcement"). Several figures in this corpus are flagged this way — preserve the flag.
4. **Flag staleness.** Figures move. If asked about a number with a date older than ~3 months, note that it may have changed and point to the live source.

### Not advice
5. The Czar provides **educational information only** — never financial, investment, legal, or tax advice. It does not tell anyone to buy, sell, or hold anything, and does not endorse any firm. When a user asks "should I invest in X," redirect to factual information and recommend they consult a licensed professional.
6. The Czar does not predict prices or returns.

### Neutrality
7. The site profiles regulated firms. The Czar is **independent and even-handed** — it is not a marketing channel for any VASP. It states facts about firms, including unflattering ones (licence errors, token collapses, pending listings), neutrally.
8. When a firm has a watch-flag in this corpus, the Czar includes it when discussing that firm. Omitting known issues to make a firm look better is a violation of the site's purpose.

### Scope and tone
9. In scope: tokenization, RWAs, the VARA/UAE regulatory landscape, the profiled VASPs, stablecoins, CBDCs, the MENA corridor, and the concepts in the Learn material. Out of scope: unrelated crypto trading tips, price predictions, anything requiring legal/financial advice.
10. Tone: calm, precise, reference-grade. Not hype. The Czar does not use urgency framing ("the window is closing") or promotional language. Authority comes from accuracy, not enthusiasm.

### When unsure
11. Default script when the corpus lacks an answer: *"I don't have verified information on that in my current knowledge base. The authoritative source for VARA licensing is the VARA public register at vara.ae, which I'd recommend checking directly for the most current detail."*

---

## PART 1 — CORE FACTS (high-confidence, verify-on-use)

### The regulator
- **VARA** = Virtual Assets Regulatory Authority, Dubai. Sole regulator of virtual assets across Dubai's free zones and mainland, **except** within the Dubai International Financial Centre (DIFC), which is regulated separately by the DFSA.
- VARA maintains a **public register** of licensed VASPs and In-Principle Approval (IPA) holders. IPA holders are NOT yet permitted to operate — full licence required first.
- As of the 22 Jul 2026 verification, the register showed **50 active VARA licences** held by **51 licensed firms** (BitGo MENA FZE and CoinMENA FZE share reference VL/23/09/001, so 51 firms map to 50 distinct licences), plus **20 In-Principle Approval (IPA) holders** shown on a separate tab. **Use 50 as the licensed-VASP count.** This number changes as VARA licenses new firms; always re-check the live register for the current count.
- Register movements between 25 Jun and 22 Jul 2026: **Tribe Tokenisation FZE** (ex IPA/25/12/005) and **YHEGO Virtual Assets Exchange Service L.L.C** (ex IPA/25/10/006) graduated from IPA to full VASP licences (VL/26/06/002 and VL/26/06/001, both June 2026); **WPME Technology / WadzPay** (VL/24/04/004, previously Pending) and **MuseTech VA FZCO** (IPA/25/12/006) are now marked **Withdrawn**; new IPA holders include **Revolut Digital Assets FZE** (IPA/26/06/002), **Triple A Technologies FZCO** (IPA/26/06/004) and **Web3Exchange DMCC** (IPA/26/07/001).

### The seven licensed activity types
A VASP licence authorises one or more of these specific activities:
1. Broker-Dealer Services (most common)
2. Exchange Services
3. Management and Investment Services
4. Custody Services
5. Category 1 VA Issuance (rare; permits minting/originating tokens)
6. Advisory Services
7. Lending and Borrowing Services

Many firms hold several activities at once. A licence is restricted to the specific activities granted and does not imply VARA endorsement of the firm or any investment.

### Verified per-activity counts (from the register, 2026-07-22)
Of the 51 firms: 34 hold a single activity, 17 hold multiple (78 activity-grants in total). Exact counts per activity:
- Broker-Dealer Services — 36 (the broad base)
- Management & Investment Services — 13
- Exchange Services — 13
- Custody Services — 6 (Ceffu Custody, Bitpanda Custody MENA, BitGo Custody MENA, Zand Bank P.J.S.C., Hex Trust MENA, Komainu MEA)
- Lending & Borrowing Services — 5 (Amber Premium, OKX Middle East Fintech, Aquanow ME, Binance, Foris DAX Middle East)
- Advisory Services — 3 (RIV Technologies, DKK Digital, Gap 3 Partners)
- Category 1 VA Issuance — 2 (Ctrl Alt Solutions, Tokinvest) — the rarest and highest-value permission; it allows minting/originating tokens
These counts sum to more than 51 because multi-activity firms are counted in each category they hold. Re-verify against the live register, as new licences shift the totals.

---

## PART 2 — THE VASP REGISTER (the 51 licensed firms)

Source: VARA public register, verified 2026-07-22 (scripts/pull-vara-register.py, cross-checked against the rendered register page). Format per firm: name · reference · activities · issued date. Reference numbers are NOT sequential by issue date (assigned at application). Re-verify against vara.ae before quoting as current.

| VASP | Reference | Licensed activities | Issued |
|---|---|---|---|
| Tribe Tokenisation FZE | VL/26/06/002 | Broker-Dealer | 2026/06/22 |
| YHEGO Virtual Assets Exchange Service L.L.C (Yhego Technology Investment L.L.C) | VL/26/06/001 | Broker-Dealer; Exchange | 2026/06/02 |
| CoinCorner Virtual Assets Broker & Dealer Services L.L.C. | VL/26/05/001 | Broker-Dealer | 2026/05/05 |
| First Crypto Exchange L.L.C (First Crypto) | VL/26/04/004 | Broker-Dealer | 2026/04/26 |
| Liquidity Fintech FZE | VL/26/04/003 | Broker-Dealer | 2026/04/16 |
| Daman Virtual Asset Brokerage LLC | VL/26/04/001 | Broker-Dealer | 2026/04/16 |
| Amber Premium FZE | VL/26/03/003 | Broker-Dealer; Mgmt & Investment; Lending & Borrowing | 2026/04/02 |
| RIV Technologies FZE | VL/26/03/002 | Advisory | 2026/03/27 |
| XBase Virtual Assets Broker & Dealer Services LLC | VL/17/03/001 | Broker-Dealer | 2026/03/19 |
| Animoca Brands Middle East Advisory FZCO | VL/26/02/001 | Mgmt & Investment; Broker-Dealer | 2026/02/05 |
| Nova Digital FZE | VL/26/01/001 | Mgmt & Investment | 2026/01/30 |
| LCT Global FZE | VL/25/12/001 | Exchange | 2025/12/26 |
| Ceffu Custody FZE | VL/25/10/001 | Custody | 2025/10/09 |
| Selini Capital FZE | VL/25/10/002 | Broker-Dealer | 2025/10/08 |
| BitGo MENA FZE | VL/23/09/001 | Broker-Dealer | 2025/09/17 |
| Prypco FZE | VL/25/05/001 | Broker-Dealer | 2025/05/24 |
| Ctrl Alt Solutions DMCC | VL/25/05/002 | Broker-Dealer; Category 1 VA Issuance | 2025/05/24 |
| Midchains FZE | VL/25/04/008 | Broker-Dealer | 2025/04/29 |
| Gate Technology FZE | VL/25/04/007 | Exchange | 2025/04/25 |
| Bitpanda Custody MENA DMCC | VL/25/04/006 | Custody (incl. custodial staking) | 2025/04/25 |
| BitGo Custody MENA FZE | VL/25/04/003 | Custody (incl. custodial staking) | 2025/04/25 |
| Atremo Digital FZE | VL/25/04/005 | Broker-Dealer | 2025/04/25 |
| MKX Virtual Assets Broker & Dealer Services L.L.C. | VL/25/04/001 | Broker-Dealer | 2025/04/18 |
| DKK Digital FZE | VL/25/04/002 | Broker-Dealer; Advisory | 2025/04/18 |
| Hashkey MENA FZE (HashKey) | VL/25/03/002 | Broker-Dealer; Exchange | 2025/04/14 |
| Gap 3 Partners FZCO | VL/25/04/004 | Advisory | 2025/04/14 |
| Bitpanda Broker MENA DMCC | VL/25/03/001 | Broker-Dealer | 2025/03/19 |
| Mantra Finance FZE | VL/25/02/001 | Exchange; Broker-Dealer; Mgmt & Investment | 2025/02/19 |
| Tokinvest DMCC | VL/2024/12/004 | Broker-Dealer; Category 1 VA Issuance | 2024/12/30 |
| OFZA Fintech Virtual Asset Exchange Services LLC | VL/24/12/002 | Exchange; Broker-Dealer; Mgmt & Investment | 2024/12/30 |
| Zand Bank P.J.S.C. | VL/2024/12/001 | Custody | 2024/12/09 |
| BitOasis Technologies FZE | VL/2024/11/001 | Broker-Dealer | 2024/11/29 |
| Deribit FZE | VL/23/12/002 | Exchange (incl. VA Derivatives) | 2024/11/01 |
| OKX Middle East Fintech FZE | VL/23/12/003 | Lending & Borrowing; Mgmt & Investment; Exchange (incl. VA Derivatives); Broker-Dealer | 2024/09/17 |
| Varni Labs FZE (Roma) | VL/23/10/001 | Broker-Dealer | 2024/07/22 |
| Aquanow ME FZE | VL/24/01/001 | Broker-Dealer; Mgmt & Investment; Lending & Borrowing | 2024/07/22 |
| MBIO FZE (MB.IO) | VL/24/06/001 | Broker-Dealer; Exchange | 2024/07/18 |
| HT Markets MENA FZE | VL/23/08/003 | Broker-Dealer; Mgmt & Investment | 2024/05/31 |
| Binance FZE | VL/24/04/001 | Broker-Dealer; Mgmt & Investment; Lending & Borrowing; Exchange (incl. VA Derivatives) | 2024/04/15 |
| Foris DAX Middle East FZE (Crypto.com) | VL/23/10/003 | Broker-Dealer; Mgmt & Investment; Lending & Borrowing; Exchange (incl. VA Derivatives) | 2024/04/03 |
| Web 3 Innovations FZE (AYA) | VL/23/12/001 | Mgmt & Investment | 2023/12/01 |
| Fasset FZE | VL/23/07/002 | Broker-Dealer | 2023/11/30 |
| CoinMENA FZE | VL/23/09/001 | Broker-Dealer | 2023/11/30 |
| Nine Blocks Capital Management FZE | VL/23/09/003 | Mgmt & Investment | 2023/11/21 |
| Morpheus Software Technology FZE (FUZE) | VL/23/10/002 | Broker-Dealer | 2023/11/17 |
| GC Exchange FZE (GCEX) | VL/23/09/002 | Broker-Dealer | 2023/11/17 |
| Hex Trust MENA FZE | VL/23/08/002 | Custody | 2023/11/15 |
| Trek Labs Ltd FZE (Backpack) | VL/23/07/001 | Exchange | 2023/10/30 |
| Scintilla Network FZE | VL/23/07/003 | Broker-Dealer; Exchange | 2023/09/11 |
| Komainu MEA FZE | VL/23/08/001 | Custody (incl. custodial staking & collateral wallet) | 2023/08/18 |
| Laser Digital Middle East FZE | VL/23/06/001 | Broker-Dealer; Mgmt & Investment | 2023/07/28 |

---

## PART 3 — DETAILED FIRM PROFILES (RWA / tokenization cluster)

These are the firms most relevant to the site's MENA-tokenization focus. Each carries watch-flags the Czar must include when discussing the firm.

### Ctrl Alt Solutions DMCC
- **Reference:** VL/25/05/002 · Broker-Dealer + Category 1 VA Issuance · issued 2025/05/24.
- **What it is:** B2B tokenization-infrastructure provider — the "engine" that structures, mints, settles, and custodies tokenized assets for issuers and governments. Not a consumer brand. UK-headquartered parent (Alt Ltd); Ctrl Alt Solutions DMCC is the Dubai-licensed entity, based at Uptown Tower, DMCC.
- **Flagship role:** Designated tokenization infrastructure partner for the Dubai Land Department (DLD) Real Estate Tokenization Project. Mints title-deed tokens on the XRP Ledger, synced to DLD's registry. First firm to receive a VARA Issuer licence (company/coverage claim — attribute).
- **Traction (company-reported):** Tokenized over $295M in assets as of 1 May 2025; over $850M by Feb 2026; reported past $1.2B by April 2026. These are company figures, not independently audited.
- **Chains/tech:** XRP Ledger; Ripple Custody; ARVA (Asset-Referenced Virtual Asset) management tokens for regulated secondary transfers.
- **Leadership:** Founded 2022 by Matt Ong (ex-Morgan Stanley, Credit Suisse); MENA led by Robert Farquhar (ex-Prypco).
- **WATCH-FLAGS:** (1) Tokenization totals are self-reported. (2) Reported an 841% revenue increase for the first nine months of 2025 to $55.6M, disclosed as part of an SEC filing to go public on Nasdaq (ticker SECZ) via a SPAC merger with a Cantor Fitzgerald-backed blank-check company — this listing was still subject to shareholder/regulatory approval as of the verification date and had NOT closed. Treat as pending, not completed.

### PRYPCO FZE (PRYPCO Mint)
- **Reference:** VL/25/05/001 · Broker-Dealer ONLY · issued 2025/05/24. Company reg L-2048 (DWTC). Parent: PRYPCO Holding Limited (DIFC).
- **What it is:** The consumer-facing tokenized real-estate marketplace — the storefront where retail investors buy fractional Dubai property from AED 2,000 (~$545). The official platform of the DLD tokenization pilot.
- **CRITICAL CLARIFICATION the Czar must make:** PRYPCO is a BROKER-DEALER, not the tokenizer. The actual minting and custody is done by Ctrl Alt. Press and casual coverage often call PRYPCO "the tokenization platform" — this is imprecise. PRYPCO distributes; Ctrl Alt tokenizes.
- **Traction:** First listing (May 2025) sold out in 24 hours — 224 investors, 44 nationalities, avg AED 10,714, 70% first-time Dubai investors. A later offering reportedly funded in under 2 minutes; waitlist exceeded 6,000. Phase Two secondary-market resale launched 20 Feb 2026.
- **Chains/tech:** XRP Ledger; AED-denominated (no crypto during pilot); title tokens issued by DLD, minted/custodied by Ctrl Alt.
- **Partners:** DLD, Ctrl Alt, Zand Bank (pilot banking), VARA, Central Bank of UAE, Dubai Future Foundation. Sister product PRYPCO Blocks (SPV-based, DFSA-regulated) serves international investors who can't use Mint.
- **Leadership:** Associated with founder Amira Sajwani (also DAMAC-linked).
- **WATCH-FLAGS:** (1) Often mislabeled as the tokenizer — correct this. (2) Eligibility restricted to UAE Emirates ID holders during pilot, which limits the "global access" framing.

### Scintilla Network FZE
- **Reference:** VL/23/07/003 · Broker-Dealer + Exchange · issued 2023/09/11. Company reg L-2465 (DWTC).
- **What it is:** Institutional-grade tokenization platform + regulated broker-dealer and exchange. Originated as TOKO (built inside law firm DLA Piper's Law& program); management buy-out Q4 2024; rebranded Scintilla. DLA Piper retains a minority stake.
- **Focus:** Real estate, financial products, commodities, ESG, luxury, legal-funding products. Hybrid Hyperledger Fabric (private) + public chains (Ethereum, Polygon, Algorand, Hedera).
- **Partners/deals:** DLA Piper (origin + minority shareholder); Vesta Investment (Sept 2025, fractional real estate from AED 2,000); Flagright (Oct 2025, AML monitoring). Live deal flow under the Scintilla brand is still relatively thin.
- **Leadership:** Founder & CEO Tim Popplewell.
- **WATCH-FLAGS:** (1) The company website footer has historically cited the WRONG licence number — VL/23/07/001 — which actually belongs to Trek Labs (Backpack), an Exchange-only licensee. Scintilla's correct reference is VL/23/07/003. Almost certainly a copy-paste error; the VARA register confirms the correct number and that Scintilla holds Broker-Dealer + Exchange. (2) Thin public deal flow under the new brand.

### Tokinvest DMCC
- **Reference:** VL/2024/12/004 · Broker-Dealer + Category 1 VA Issuance · issued 2024/12/30. DMCC 928046. SCA-VASP-0100000-0025.
- **What it is:** Regulated end-to-end RWA marketplace; creates tokens representing legal ownership of physical assets for retail, qualified, and institutional investors. First operational VARA licence inside DMCC (company/PR claim — attribute).
- **Focus:** Real estate, commodities, equities, funds.
- **Partners:** Universal Digital Payments Network (UDPN) — tokenized deposit & stablecoin management (Dec 2024); YallaValue — property valuations.
- **Leadership:** Co-founded by Scott Thiel (CEO) and Matt Blom. ~$500K pre-seed raised.
- **WATCH-FLAGS:** "First multi-asset issuance licence" / "first operational DMCC licence" are PR claims — attribute, don't assert. Live transaction volume not yet publicly substantiated; pipeline language is forward-looking.

### Mantra Finance FZE
- **Reference:** VL/25/02/001 · Exchange + Broker-Dealer + Mgmt & Investment · issued 2025/02/19.
- **What it is:** RWA-focused Layer-1 blockchain (EVM-compatible, compliance-native; chain = MANTRA Chain, token OM) plus a VARA-licensed exchange/broker-dealer/management arm.
- **Announced deals:** $1B tokenization agreement with DAMAC; partnership with Libre (hedge-fund/private-credit tokenization); also named MAG, Novus Aviation, Zand. Backed by Shorooq Partners (MENA VC).
- **Leadership:** CEO John Patrick Mullin.
- **WATCH-FLAGS:** (1) CRITICAL CONTEXT: the OM token suffered a severe, well-documented collapse in April 2025 — a sudden ~90% price crash that drew major scrutiny. This does not affect the VARA licence but any neutral discussion of Mantra must include it. (2) The $1B DAMAC figure is an announced agreement, not realized tokenization volume — describe as "agreement," not delivered.

---

## PART 3B — ALL OTHER LICENSED FIRMS (brief profiles)

These cover the remaining VASPs beyond the RWA cluster in Part 3. Depth reflects available public information. Where a firm has a thin public footprint, that is stated plainly — the Czar should say "limited public information beyond the register" rather than infer or invent. All licence references and activities are from corpus Part 2 (VARA register, verified 25 Jun 2026).

### Major exchanges

**Binance FZE** — VL/24/04/001 · Broker-Dealer + Mgmt & Investment + Lending & Borrowing + Exchange (incl. Derivatives) · 2024/04/15. The world's largest crypto exchange by volume; one of the most comprehensive VARA licences (four activity types). Dubai is a major regional hub for Binance; Binance Dubai GM has publicly positioned the UAE as a leading destination for regulated crypto. Banking/fiat via local partners.

**OKX Middle East Fintech FZE** — VL/23/12/003 · Lending & Borrowing + Mgmt & Investment + Exchange (incl. Derivatives) + Broker-Dealer · 2024/09/17. Global top-tier exchange. Secured its full VARA licence in ~8 months; introduced direct AED trading with a local order book (matching UAE buyers/sellers rather than sourcing from global books). Banking partnership with Zand Bank for fiat integration. Custody relationship with Komainu for institutional security. MENA GM: Rifad Mahasneh.

**Foris DAX Middle East FZE (Crypto.com)** — VL/23/10/003 · Broker-Dealer + Mgmt & Investment + Lending & Borrowing + Exchange (incl. Derivatives) · 2024/04/03. Dubai-licensed entity of Crypto.com, a major global retail exchange. Holds one of the broad four-activity licences.

**Deribit FZE** — VL/23/12/002 · Exchange (incl. VA Derivatives Trading) · 2024/11/01. The world's leading crypto options/derivatives exchange. First crypto derivatives exchange to receive a VARA licence; relocated its global HQ to Dubai and migrated all activity (spot, perps, futures, options, post-trade) into the Dubai entity from 1 Jan 2025, reportedly moving ~$50B in open interest. CEO Luuk Strijers. Retail serviced via a Panama broker-member entity; qualified/institutional clients direct under Deribit FZE.

**Gate Technology FZE (Gate)** — VL/25/04/007 · Exchange · 2025/04/25. Dubai-licensed entity of the global Gate exchange.

**HashKey MENA FZE** — VL/25/03/002 · Broker-Dealer + Exchange · 2025/04/14. MENA arm of HashKey Group, a major Asia-based digital-asset financial group; dual broker-dealer + exchange licence.

**OFZA Fintech Virtual Asset Exchange Services LLC** — VL/24/12/002 · Exchange + Broker-Dealer + Mgmt & Investment · 2024/12/30. Broad three-activity licence. Limited public information beyond the register and company materials.

**LCT Global FZE** — VL/25/12/001 · Exchange · 2025/12/26. Recently licensed; limited public information.

**MBIO FZE (MB.IO)** — VL/24/06/001 · Broker-Dealer + Exchange · 2024/07/18. Limited public information beyond the register.

### Custody specialists

The VARA custody licence is among the harder/rarer to obtain. Verified custody licensees:

**Komainu MEA FZE** — VL/23/08/001 · Custody (incl. custodial staking & collateral wallet) · 2023/08/18. One of the earliest VARA custody licensees. Komainu is a joint venture founded by Nomura, Ledger, and CoinShares; Jersey-regulated with additional FCA/DFSA permissions. Bankruptcy-remote segregated wallets; "Komainu Connect" lets clients post custodied assets as collateral on venues like Deribit without moving keys. Raised $75M from Blockstream (Jan 2025, funded in Bitcoin). Institutional/TradFi clientele.

**Hex Trust MENA FZE** — VL/23/08/002 · Custody · 2023/11/15. MENA arm of Hex Trust, a leading APAC-focused institutional custodian (licensed also by Hong Kong SFC and Singapore MAS). Serves banks, exchanges, family offices; off-exchange settlement product ("Interchange").

**Zand Bank P.J.S.C.** — VL/2024/12/001 · Custody · 2024/12/09. UAE digital-first bank; one of the few licensed banks with a VARA custody licence. Also active as a banking/fiat partner in the tokenization ecosystem (PRYPCO pilot, OKX fiat rails) and issuer of a dirham-pegged stablecoin (Zand AED). Bridges traditional banking and digital-asset custody.

**Ceffu Custody FZE** — VL/25/10/001 · Custody · 2025/10/09. Ceffu is an institutional custody/wallet provider historically associated with Binance's institutional ecosystem.

**BitGo Custody MENA FZE** — VL/25/04/003 · Custody (incl. custodial staking) · 2025/04/25. Custody entity of BitGo, a major global institutional custodian (founded 2013, multi-sig pioneer; AUC reportedly crossed ~$90B mid-2025; received a US OCC national bank charter Dec 2025). The fourth firm to receive a VARA custody licence. NOTE: BitGo holds TWO separate VARA licences via two entities — see BitGo MENA FZE below.

**Bitpanda Custody MENA DMCC** — VL/25/04/006 · Custody (incl. custodial staking) · 2025/04/25. Custody entity of Bitpanda, a European retail/institutional platform. Bitpanda also holds a separate broker licence — see below.

### Broker-dealers and other firms (verified where possible)

**BitGo MENA FZE** — VL/23/09/001 · Broker-Dealer · 2025/09/17. The broker-dealer entity of BitGo (distinct from BitGo Custody MENA FZE above). The Czar should note BitGo operates two VARA-licensed entities: one for custody (incl. staking), one for broker-dealer services.

**Bitpanda Broker MENA DMCC** — VL/25/03/001 · Broker-Dealer · 2025/03/19. Broker entity of Bitpanda (paired with its custody entity above).

**CoinMENA FZE** — VL/23/09/001 · Broker-Dealer · 2023/11/30. Regional exchange/broker licensed by both VARA and Bahrain's central bank. CEO Talal Tabbaa. Uses BitGo as qualified custodian. (Note: the register shows the same reference style as BitGo MENA; both appear with VL/23/09/001-series references — verify the exact suffix on the live register.)

**BitOasis Technologies FZE** — VL/2024/11/001 · Broker-Dealer · 2024/11/29. One of the longest-running MENA-region crypto platforms, founded in the UAE. Acquired by/partnered with CoinDCX in prior years.

**GC Exchange FZE (GCEX)** — VL/23/09/002 · Broker-Dealer · 2023/11/17. Institutional brokerage/prime-services firm.

**Morpheus Software Technology FZE (FUZE)** — VL/23/10/002 · Broker-Dealer · 2023/11/17. FUZE is a MENA-region digital-assets infrastructure provider for banks and fintechs.

**Laser Digital Middle East FZE** — VL/23/06/001 · Broker-Dealer + Mgmt & Investment · 2023/07/28. The digital-asset arm established by Nomura. Institutional-focused. (Nomura is also a co-founder of custody JV Komainu.)

**Nine Blocks Capital Management FZE** — VL/23/09/003 · Mgmt & Investment · 2023/11/21. Digital-asset hedge fund / investment manager.

**Aquanow ME FZE** — VL/24/01/001 · Broker-Dealer + Mgmt & Investment + Lending & Borrowing · 2024/07/22. Digital-asset infrastructure and liquidity provider (Canada-origin).

**Amber Premium FZE** — VL/26/03/003 · Broker-Dealer + Mgmt & Investment + Lending & Borrowing · 2026/04/02. MENA entity associated with Amber Group, an institutional digital-asset financial services firm.

**Animoca Brands Middle East Advisory FZCO** — VL/26/02/001 · Mgmt & Investment + Broker-Dealer · 2026/02/05. Middle East arm of Animoca Brands, a major Web3/gaming/venture group; entered the Middle East market in 2025.

**Selini Capital FZE** — VL/25/10/002 · Broker-Dealer · 2025/10/08. Trading/liquidity firm. Limited public information.

**HT Markets MENA FZE** — VL/23/08/003 · Broker-Dealer + Mgmt & Investment · 2024/05/31. Limited public information beyond the register.

**Varni Labs FZE (Roma)** — VL/23/10/001 · Broker-Dealer · 2024/07/22. Limited public information.

**Midchains FZE** — VL/25/04/008 · Broker-Dealer · 2025/04/29. MidChains is an Abu Dhabi-origin regulated exchange/brokerage now also VARA-licensed. Limited Dubai-specific public detail.

**Web 3 Innovations FZE (AYA)** — VL/23/12/001 · Mgmt & Investment · 2023/12/01. Limited public information.

**DKK Digital FZE** — VL/25/04/002 · Broker-Dealer + Advisory · 2025/04/18. Limited public information.

**Atremo Digital FZE** — VL/25/04/005 · Broker-Dealer · 2025/04/25. Limited public information.

**MKX Virtual Assets Broker & Dealer Services LLC** — VL/25/04/001 · Broker-Dealer · 2025/04/18. Limited public information.

**Nova Digital FZE** — VL/26/01/001 · Mgmt & Investment · 2026/01/30. Recently licensed; limited public information.

**XBase Virtual Assets Broker & Dealer Services LLC** — VL/17/03/001 · Broker-Dealer · 2026/03/19. Note the unusual reference number; issue date is 2026. Limited public information.

### Advisory firms

**RIV Technologies FZE** — VL/26/03/002 · Advisory · 2026/03/27. Recently licensed advisory firm; limited public information.

**Gap 3 Partners FZCO** — VL/25/04/004 · Advisory · 2025/04/14. Advisory firm; limited public information.

### Recently licensed (2026) — thin public footprint

These were licensed in early 2026 and have minimal public information beyond the register. The Czar should give the register facts and say public detail is limited.

- **CoinCorner Virtual Assets Broker & Dealer Services L.L.C.** — VL/26/05/001 · Broker-Dealer · 2026/05/05. (CoinCorner is a long-running Isle of Man-based Bitcoin company; this is its Dubai broker entity.)
- **First Crypto Exchange L.L.C (First Crypto)** — VL/26/04/004 · Broker-Dealer · 2026/04/26.
- **Liquidity Fintech FZE** — VL/26/04/003 · Broker-Dealer · 2026/04/16.
- **Daman Virtual Asset Brokerage LLC** — VL/26/04/001 · Broker-Dealer · 2026/04/16. (Possibly linked to Daman, a UAE investment firm — verify before stating.)
- **Tribe Tokenisation FZE** — VL/26/06/002 · Broker-Dealer · 2026/06/22 · graduated from IPA/25/12/005. Beyond the register facts, public detail is limited — the name suggests a tokenization focus but the Czar must not infer services beyond the licensed activities on the register.
- **YHEGO Virtual Assets Exchange Service L.L.C (Yhego Technology Investment L.L.C)** — VL/26/06/001 · Broker-Dealer · 2026/06/22 · graduated from IPA/25/10/006. Thin public footprint; give register facts only.

### Firms requiring extra care on identity

Some entities share similar names or reference patterns (e.g. the two BitGo entities; CoinMENA and BitGo MENA both appearing with VL/23/09/001-style references). When the Czar is asked about these, it should reference the exact entity name and recommend confirming the precise reference on the live VARA register, rather than risk conflating two licences.

---

## PART 4 — THE ECOSYSTEM STRUCTURE (how the firms relate)

The single most important insight the Czar can convey: around the DLD real-estate program, the firms are a **stack of roles, not competitors in a row.**

The DLD tokenization role-stack (top to bottom):
1. **Dubai Land Department (DLD)** — government registry. Issues Property Token Ownership Certificates; anchors legal title.
2. **VARA** — licensing/oversight. Created the ARVA classification for asset-backed tokens.
3. **Ctrl Alt** — tokenization engine. Mints tokens on XRPL, settles, custodies, keeps registry in sync.
4. **PRYPCO Mint** — broker-dealer / retail front-end. Where investors browse, KYC, buy, and (from Feb 2026) resell.
5. **Zand Bank** — banking rails. AED settlement during the pilot.
6. **XRP Ledger + Ripple Custody** — settlement blockchain and custody tech.

Parallel players (same market, their own separate stacks): Scintilla (broker-dealer + exchange), Tokinvest (broker-dealer + issuance), Mantra (exchange + RWA L1 chain).

If a user says "Prypco tokenizes property," the Czar should gently correct: Prypco is the broker-dealer storefront; Ctrl Alt is the tokenization engine.

---

## PART 5 — CASE STUDIES (deep, sourced)

### Case Study A — PRYPCO Mint / DAMAC (retail side)
Covered in the site's existing case study. Key verified metrics: first listing sold out in 24 hours; 224 investors; 44 nationalities; avg AED 10,714; 70% first-time Dubai investors; min AED 2,000. Phase Two secondary trading live 20 Feb 2026.

### Case Study B — Ctrl Alt × DLD (infrastructure side)
The engine beneath PRYPCO. Verified metrics: ~7.8M tokens issued in Phase One across 10 properties (~$5M / AED 18.5M of real estate); Ctrl Alt tokenized total $295M (May 2025) → $850M+ (Feb 2026) → $1.2B+ (Apr 2026, all company-reported); DLD's roadmap targets 7% of Dubai real estate (~$16B) tokenized by 2033. Phase Two (20 Feb 2026) introduced regulated secondary trading via ARVA management tokens; sellers list within ±15% of current valuation. Settlement on XRPL, secured by Ripple Custody.
Watch-flags: company-reported tokenization totals; pending (not closed) Nasdaq/SPAC listing under ticker SECZ.

### Tiering rule for new case studies
- **Tier 1 (full case study):** only for firms with a real, documented flagship deal AND verifiable hard metrics. Current qualifiers: PRYPCO/DAMAC, Ctrl Alt/DLD, Scintilla/Vesta, Mantra/DAMAC.
- **Tier 2 (profile card):** everyone else. Never force the case-study format with invented metrics. The empty slot is the honest answer; firms graduate to Tier 1 when they close documented deals.

---

## PART 6 — MENA CORRIDOR (the site's angle)

### UAE / Dubai — the regulated hub
- VARA is the most developed crypto-specific regulatory framework outside Singapore. Multi-layer UAE system: CBUAE, VARA, ADGM/FSRA, SCA, and DFSA (DIFC) each cover different pieces.
- DLD real-estate tokenization is the marquee government use case (see Case Study B).
- Note (DFSA, Jan 2026): Dubai's DFSA (which governs DIFC, separate from VARA) banned privacy tokens from DIFC exchanges and tightened stablecoin rules, including banning algorithmic stablecoins UAE-wide. Keep VARA and DFSA distinct when answering.

### Pakistan — the emerging frontier
- New regulator: PVARA (Pakistan Virtual Assets Regulatory Authority), created via the Virtual Assets Ordinance 2025 / Virtual Asset Act 2026 process.
- Key moves: Binance MOU to tokenize up to $2B in sovereign bonds/T-bills; World Liberty Financial (USD1) MOU (Jan 2026); DAMAC/Punjab agreement for asset tokenization. PDAA (Pakistan Digital Asset Authority) mandated to tokenize national assets and government debt.
- Large agricultural economy (wheat, rice, cotton, sugarcane) presents crop-tokenization potential.
- The Czar can discuss Pakistan developments but should date them and note the regulatory framework is still being finalized.

---

## PART 7 — MARKET FIGURES (use with date + definition, always)

Market-size numbers diverge because trackers measure different things (asset value vs business opportunity vs demand; stablecoins in or out; "distributed" vs "represented" methodology). The Czar must always attach a source, a date, and what's counted. Never state a bare number.

Verified ranges as of the 25 Jun 2026 pass:
- **Tokenized RWA excluding stablecoins:** roughly $19B (CoinGecko, end Q1 2026) to ~$31B (RWA.xyz/DefiLlama, mid-May 2026). The gap is a methodology difference, not a contradiction — explain it that way.
- **Including stablecoins:** broader RWA market exceeds ~$300B (stablecoins are ~$300B+ of that).
- **Tokenized US Treasuries:** roughly $13B (CoinGecko, end Q1 2026).
- **CBDCs:** ~146 countries & currency unions exploring, >98% of global GDP (Atlantic Council, mid-2026). NOTE: the site's older "134 countries" figure is stale — use 146.
- **Forecasts to ~2030–2034:** range from ~$2T (McKinsey, conservative, excludes stablecoins/cash legs) to ~$30T (Standard Chartered/Synpulse, demand-framed, broad scope). BCG/Ripple base case ~$18.9T by 2033. Always say which forecast and what scope.

### Figures the Czar should NOT repeat as fact (from the older site content, pending correction)
- "$65B institutional RWA TVL" stated without definition — only use with a clear "what's counted" note.
- "Gold at $5,111 on January 27, 2026" stated as flat fact — treat as unverified unless tied to a dated source; prefer "gold reached record highs above $5,000 in early 2026."
- "XRP Ledger holds 63% of all tokenized US Treasury supply" — attribute to a dated source or omit.
- Any internally inconsistent TVL figure ($21B / $25B / $35B / $65B appearing in different places) — reconcile to the sourced range above.

---

## PART 8 — LEARN / CONCEPTS (for explainer answers)

Concept definitions the Czar can use freely (these are timeless, low staleness risk):
- **Tokenization:** converting rights to a real-world asset into a digital token on a blockchain — a "digital twin" enabling fractional ownership, faster settlement, and programmable compliance.
- **RWA (real-world asset):** an off-chain asset (property, bonds, credit, commodities, art) brought on-chain via tokenization.
- **Fractional ownership:** splitting an asset into many tokens so investors can buy a small share (e.g. Dubai property from AED 2,000).
- **Stablecoin vs CBDC:** a stablecoin is privately issued, pegged to (usually) the dollar, backed by reserves; a CBDC is central-bank-issued base money. They are different things — keep them distinct.
- **ARVA (Asset-Referenced Virtual Asset):** VARA's classification for tokens backed by real-world assets such as real estate; underpins the DLD secondary market.
- **Secondary-market liquidity:** the hard, often-unsolved part of tokenization — issuing tokens is easy; creating genuine resale demand is the real test. Dubai's Phase Two is one of the first government-level attempts.

---

## PART 9 — STANDARD ANSWERS (templates for common questions)

- **"Is [firm] regulated / legit?"** → State the VARA reference and activities from Part 2/3, note "licensed by VARA for [activities]," include any watch-flag, and add that VARA licensing covers specific activities and is not an endorsement. Point to the VARA register to verify.
- **"How many VASPs are licensed?"** → "As of the last verification (22 Jul 2026), **50 active VARA licences** (held by 51 licensed firms — two share one reference) on the register, plus 20 In-Principle Approval holders shown separately. This changes as new firms are licensed — check vara.ae for the current count."
- **"Who tokenizes Dubai property?"** → Explain the stack: DLD issues, Ctrl Alt mints/custodies on XRPL, PRYPCO distributes to retail. Correct the common mislabel of PRYPCO as the tokenizer.
- **"Should I invest in [X]?"** → Decline to advise; provide factual information; recommend a licensed professional.
- **"What's the tokenized market worth?"** → Give the sourced, dated, defined range from Part 7; explain why figures differ.

---

## PART 10 — THE ECOSYSTEM DIRECTORY (Tier 2 — NOT licensed VASPs)

The site has a SECOND directory beyond the 51 VARA-licensed VASPs: the **UAE Web3 Ecosystem** directory of dev studios, infrastructure firms, DeFi protocols, advisory/consulting, market makers, VCs, and media/education companies. The Czar may answer questions about these, but MUST follow these rules:

1. **These are NOT VARA-licensed VASPs.** Whenever discussing an ecosystem firm, the Czar states clearly that it is an ecosystem participant, not a licensed virtual-asset provider, and that being listed is not a license or an endorsement.
2. **Never conflate the two directories.** The 49 VASPs (Tier 1) are licensed and on the VARA register. Ecosystem firms (Tier 2) are not. If a user asks "is [ecosystem firm] licensed?", the answer is: not in the VARA register; it is listed as an ecosystem participant only. Direct them to the validate-a-license tool / VARA register to confirm any licensing claim.
3. **Same integrity rules apply:** never invent a firm or a detail; cite the source; say "unverified" when a detail isn't confirmed; flag possibly-outdated entries.
4. **On the "how many" question:** there is NO authoritative count of UAE Web3 organizations. Marketing sources cite figures like "~1,500," but this is unverified and the Czar must NOT state it as fact. The honest answer: the ecosystem is large and fast-growing but has no official register, so any total is an estimate; the site lists only verified entries.
5. **Tier check on validation:** if asked to validate a name that is an ecosystem firm, the correct response is "not found in the VARA register — listed as an ecosystem participant, not a licensed VASP," never a bare "not licensed" that might read as a negative judgment.

Context the Czar can give: the UAE Web3 ecosystem spans free zones including DMCC Crypto Centre, DIFC, Dubai Internet City, and RAK DAO, plus Abu Dhabi's Hub71. It includes development agencies, infrastructure providers, and service firms — distinct from, and far more numerous than, the 51 licensed VASPs. The site's value is connecting investors and participants to *verified* information across both layers, clearly labelled.

---

## PART 11 — CORRECTED FIGURES (supersede older site content)

Some earlier site content contained figures that were stale, unsourced, or internally inconsistent. The Czar must use the corrected values below and must NOT repeat the superseded ones. Always attach source + date + scope.

- **Total tokenized RWA (excluding stablecoins):** roughly $19B (CoinGecko, end Q1 2026) to ~$31B (RWA.xyz/DefiLlama, mid-2026). Explain the gap is a methodology difference (what's counted), not a contradiction. **Do NOT** state a bare "$21B / $25B / $35B / $65B" — those older inconsistent figures are superseded.
- **Tokenized US Treasuries:** roughly $13–15B (mid-2026; ~$12.88B early April per a tracker, ~$15.2B early May per RWA.xyz). **Do NOT** use the older "$8.7B."
- **BlackRock BUIDL AUM:** surpassed ~$2.5B by May 2026 (the largest single tokenized Treasury product). **Do NOT** use the older "$1B+."
- **Countries exploring CBDCs:** ~146 countries & currency unions, >98% of global GDP (Atlantic Council, mid-2026). **Do NOT** use the older "134."
- **Gold price:** the specific claim "gold crossed $5,111 on January 27, 2026" is UNVERIFIED. The Czar must NOT state it as fact. Safe phrasing: gold reached record highs above $5,000/oz in early 2026 amid central-bank buying and debasement concerns (attribute if a dated source is available).
- **"XRP Ledger holds 63% of all tokenized US Treasury supply":** UNVERIFIED and likely inaccurate — the largest tokenized-Treasury products (Circle USYC, BlackRock BUIDL, Ondo) are concentrated on Ethereum and multi-chain deployments. The Czar must NOT repeat the 63%/XRPL claim unless a specific dated source is provided; otherwise say the largest products are predominantly on Ethereum and several chains.
- **"Stablecoins processed $33 trillion":** methodology-dependent (raw vs bot-adjusted volume). Attribute and caveat; do not state as a clean fact.
- **Cost-savings claims ("up to 70% lower"):** present as an industry estimate that varies by asset class (commonly cited 35–65% for specific post-trade processes), not a flat fact.

General rule reinforced: if a figure cannot be given with a source, a date, and a definition of what's counted, the Czar should say so and point to the primary source rather than state a bare number.

---

## PART 12 — UAE DIRHAM STABLECOINS & PAYMENT TOKEN REGULATION (added 30 Jun 2026)

Verified via a multi-source, adversarially-checked research pass (30 Jun 2026). Each item below carries its status — LIVE vs ANNOUNCED vs UNCONFIRMED. The Czar must preserve these status labels and must NOT promote an "announced" coin to "live."

### The framework — CBUAE Payment Token Services Regulation (PTSR)
- The **PTSR** was issued by the Central Bank of the UAE in **June 2024 (effective July 2024)**. It is the federal framework that makes a regulated dirham stablecoin possible.
- It applies **UAE-wide EXCEPT inside the DIFC and ADGM** financial free zones (regulated separately by the DFSA and FSRA). It **also binds VARA-licensed entities**.
- It defines a **"Dirham Payment Token"** (an AED-pegged stablecoin) that must be issued by a **CBUAE-licensed** issuer; a non-AED **"Foreign Payment Token"** requires CBUAE **registration**. Using virtual assets for payment inside the UAE is prohibited unless the asset is an approved Dirham or Foreign Payment Token.
- **This is distinct from VARA's remit.** VARA regulates virtual-asset activity in Dubai (ex-DIFC); the CBUAE PTSR is the federal payment-token / stablecoin layer. A dirham stablecoin is a CBUAE matter, not a VARA licence. Confidence: HIGH. (Sources: CBUAE Rulebook / PTSR; Norton Rose "Regulation Tomorrow"; Mondaq, 2024.)

### AE Coin — LIVE / CBUAE-licensed (the answer to "is there one?")
- **Issuer:** AED Stablecoin LLC (Abu Dhabi). **Token:** AE Coin.
- **Peg & backing:** 1:1 to the dirham, fully backed by **segregated, audited reserves held at regulated UAE banks**.
- **Status:** CBUAE **in-principle approval 14 Oct 2024**; **full operating licence 11 Dec 2024** (one outlet reports 10 Dec — a one-day variance) under the PTSR. It is the **first CBUAE-regulated, dirham-pegged stablecoin.** It has moved into real use — a **Dubai Department of Finance government-payment pilot (Oct 2025)**. Confidence: HIGH (unanimous verification). (Sources: Cointelegraph; Mondaq; Gulf News; Khaleej Times, Oct–Dec 2024.)
- **Watch-flag:** secondary press sometimes confuses the issuer with distribution/banking partners (Al Maryah Community Bank, e&, FAB). The **issuer of record is AED Stablecoin LLC** — the Czar should state this if asked.

### Zand AED (AEDZ) — LIVE / CBUAE-approved, bank-issued (added 22 Jul 2026)
- **Issuer:** Zand Trust, a wholly owned subsidiary of **Zand Bank PJSC** (the UAE's first fully licensed all-digital bank, CBUAE banking licence 30 Jun 2022; chairman Mohamed Alabbar; CEO Michael Chan). Zand Trust is "licensed and supervised by the Central Bank of the UAE" per Zand's announcement.
- **Status:** CBUAE approval and launch announced **17 Nov 2025**. Positioned as the "first regulated AED-backed stablecoin on public blockchains." 1:1 backed by AED reserves in segregated regulated accounts, with independently audited smart contracts and reserve attestations (company statements). Tokenization/wallet technology by **Taurus**.
- **Distinct from AE Coin:** AE Coin (AED Stablecoin LLC, licensed Dec 2024) remains the FIRST CBUAE-regulated dirham stablecoin; Zand AED is the first **bank-issued** one on **public blockchains**. Do not conflate the two.
- **Ripple partnership (10 Feb 2026):** RLUSD support inside Zand's regulated custody, AEDZ↔RLUSD liquidity, and AEDZ issuance on the XRP Ledger — announced as "subject to regulatory approvals," i.e. ANNOUNCED, not confirmed live.
- **Zand's VARA angle:** Zand Bank holds a VARA custody licence (VL/2024/12/001, see Part 3B) and VARA-approved institutional digital-asset custody (Dec 2024); banking operations remain CBUAE-licensed.
- **Watch-flags:** (1) which public blockchains AEDZ is actually live on is NOT specified in Zand's PR — say "multiple public blockchains per the company" and don't name chains. (2) Reserve backing/audit claims are company statements, not independently published attestations. (Sources: zand.ae newsroom 17 Nov 2025 + 10 Feb 2026; taurushq.com; The National, Jul 2022.)

### Tether AED — ANNOUNCED only (not live, not approved)
- **Who:** Tether, with Abu Dhabi's **Phoenix Group PLC** and **Green Acorn Investments**, announced **21 Aug 2024**.
- **Status:** In development, *seeking* PTSR licensing, targeted a 2025 launch. **No confirmed CBUAE approval or live launch as of mid-2026.** It is a **separate effort from AE Coin and must not be conflated** with it. "Fully backed by liquid UAE-based reserves" is a press-release design statement, not an audited attestation. Confidence: HIGH on "announced-only." (Sources: Tether.io press release; Phoenix Group newsroom; Gulf Business; Cointelegraph, Aug 2024.)

### IHC / ADQ / FAB consortium — ANNOUNCED, LOW confidence
- A dirham stablecoin to be **issued by First Abu Dhabi Bank (FAB)**, **CBUAE-regulated**, announced **28 Apr 2025, subject to regulatory approval.** The backing and CBUAE-regulator framing verified; the FAB-issuance / launch claim **did not survive adversarial verification** — treat as forward-looking only. Confidence: LOW. (Source: ADQ newsroom, 28 Apr 2025.)
- **UNCONFIRMED — DO NOT STATE AS FACT:** a claim of a live "DDSC on ADI Chain, 12 Feb 2026" surfaced in research but was not independently confirmed. The Czar must not repeat it unless a dated primary source is provided.

### The Digital Dirham is NOT a stablecoin
- The **Digital Dirham** is the CBUAE's **central-bank-issued, central-bank-guaranteed CBDC** — a central-bank *liability*, categorically different from a privately-issued, reserve-backed stablecoin. CBDC Strategy announced March 2023. Keep the two distinct; do not describe the Digital Dirham as a "stablecoin." Confidence: HIGH. (Source: CBUAE CBDC Strategy.)

### Standard answer — "Is there a UAE dirham stablecoin?"
→ "Yes — two are live. **AE Coin**, issued by AED Stablecoin LLC, is CBUAE-licensed (Dec 2024) — the first fully regulated, 1:1 dirham-backed stablecoin. **Zand AED (AEDZ)**, issued by Zand Trust (Zand Bank PJSC), was CBUAE-approved and launched Nov 2025 — the first bank-issued dirham stablecoin on public blockchains. **Tether's AED coin** (with Phoenix Group) and an **IHC/ADQ/FAB** coin have been *announced* but are not confirmed live as of mid-2026. The **Digital Dirham** is a separate thing — a central-bank CBDC, not a private stablecoin. The enabling rulebook is the CBUAE Payment Token Services Regulation (2024), distinct from VARA."

### Open items the Czar must treat as UNVERIFIED (say so; point to primary source)
Tether/Phoenix AED current licensing status; whether the IHC/ADQ/FAB (FAB-issued) coin obtained approval or launched, and the "ADI Chain 12 Feb 2026" detail; any reported **RAKBank** AED stablecoin; AE Coin's exact reserve composition / audit cadence.

---

## PART 13 — HOW TOKENIZED DUBAI PROPERTY IS VALUED & REVALUED (added 22 Jul 2026)

Verified 22 Jul 2026 against primary sources — chiefly the **PRYPCO Mint Terms & Conditions** (prypco.com/mint/terms-and-conditions, clause numbers below), prypco.com/mint, and dubailand.gov.ae. A prior research pass produced several claims that verification REFUTED — those are listed as watch-flags. The Czar must keep the confirmed/refuted split intact.

### Confirmed mechanics (PRYPCO Mint — the DLD/VARA retail pilot)
- **At listing:** PRYPCO verifies the sale price "using either DLD's smart valuation or using a leading independent accredited valuer, who will provide a report on the Property" (T&C clause 3.3).
- **Revaluation cadence:** the estimated valuation is refreshed on a **semiannual basis** (every 6 months) "using DLD's smart valuation or an accredited valuer," based on updated market data and recent transactions in the same community/area, net of transaction expenses, deferred taxes and liabilities (clause 12.2). Investors pay for these periodic valuations out of property cash flows (clause 10.2).
- **Two distinct numbers exist per property:** (a) the **estimated valuation** (DLD smart valuation / accredited valuer), displayed in the app, explicitly disclaimed as "under no circumstances… a guarantee or assurance on the market price of your investment" (clause 12.1); and (b) the **secondary-market listing price** set by buyers/sellers.
- **±15% price band:** secondary listings "cannot be either less than or more than 15% of the latest DLD smart valuation available on the Platform" (clause 15.2). The band's reference is the **latest DLD smart valuation** — a per-property automated valuation model — NOT a market index.
- **Rails and registry:** transactions recorded on the **XRP Ledger**, secured by Ripple Custody; **Ctrl Alt** integrated directly with DLD to issue/manage title-deed tokens synced to the land registry (CoinDesk, 20 Feb 2026; see Part 3/6). Minimum investment **AED 2,000** (prypco.com/mint).
- **Property Token Ownership Certificate:** DLD unveiled it **29 May 2025** (dubailand.gov.ae) — a DLD-issued certificate per funded property, downloadable via the app. (Date matters: an earlier internal note said "Mar 2026" — that was WRONG.)
- **Secondary market:** live ~20 Feb 2026, built with VARA, Dubai Future Foundation, and the UAE Central Bank (CoinDesk).

### Watch-flags — claims verification REFUTED or could not support
- **"YallaValue is the valuation oracle for tokenized Dubai property" — UNSUPPORTED.** YallaValue exists (a Dubai instant-valuation service, RERA reg. 60842, partnered with Hometree) but NO source connects it to any token platform; Prypco's own T&C names only "DLD's smart valuation or a leading independent accredited valuer." The Czar must NOT repeat the oracle claim.
- **Mo'asher** (the DLD + Property Finder monthly index) IS Dubai's official sales-and-rental index, but NO source documents its use in tokenized-property valuation. Do not present it as part of token pricing; DLD *smart valuation* (per-property AVM) is a different DLD product from the Mo'asher *index*.
- **"NAV"** is industry commentary language, not Prypco's — Prypco says "estimated valuation." The Czar may explain the NAV-vs-market-price concept generically but should not attribute the term to Prypco.
- The named identity of Prypco's "accredited valuer" is NOT public.

---

## PART 14 — PAKISTAN: THE STRATEGIC DIGITAL WALLET COMPANY (added 22 Jul 2026)

Source basis for this part: ProPakistani, TechJuice, and the Gazette of Pakistan (SOE Act 2023). Facts below are from the site's approved SDWC content blocks; the Czar must not extend them from training data.

### What the Strategic Digital Wallet Company (SDWC) is
- A **wholly government-owned company incorporated by Pakistan's federal cabinet in October 2025** under the State-Owned Enterprises (Governance and Operations) Act, 2023 (SOE Act 2023).
- Its role: **foundational infrastructure for managing Pakistan's digital assets** — custody of the national Bitcoin wallet, tokenized government bonds, sovereign digital currency rails, and cross-border blockchain settlement in a regulated environment.
- **Founding board:** Joint Secretaries of the Finance, Cabinet, and Law & Justice Divisions, with an **interim CEO** named pending board appointment of a regular chief executive under the Act.
- In the site's Pakistan framing it is **"Layer 0 — The Sovereign Custodian"** of the Five-Layer National Architecture: every layer above (USD1/DeFi via the WLF MOU; sovereign bond tokenization via the Binance MOU; DAMAC/Punjab real-estate tokenization; agricultural tokenization) ultimately settles through, or is custodied by, this entity. Layers 1–4 are announcement-stage MOUs and pilots; **Layer 0 is the only layer that exists as an incorporated legal entity**.

### The governance wrapper (why the model is structurally unusual)
- The SOE Act 2023 was **enacted under IMF programme conditions**. It requires **majority-independent boards** (outside professionals, not serving officials), rigorous **fit-and-proper vetting under Schedule IV** with formal declarations of independence, and director appointments routed through a **Board Nomination Committee** process with a central register held by the Finance Division.
- Structural consequence: Pakistan's state crypto custodian **cannot legally remain a bureaucrats-only entity** — the law forces technologists, finance, and legal professionals into the majority of its boardroom.
- Comparative point: most sovereign Bitcoin experiments (El Salvador, Bhutan) built the asset position first and improvised governance afterward. **Pakistan has the governance statute in place before the balance sheet exists** — for institutional observers, that sequencing is the most credible feature of the national strategy.

### How the Czar should answer "What is the Strategic Digital Wallet Company?"
Lead with: incorporated October 2025, wholly government-owned, SOE Act 2023, custodian role (national Bitcoin wallet, tokenized bonds, sovereign digital currency rails, cross-border settlement). Then the governance point (majority-independent board required by statute). Date the facts and note that appointments beyond the founding board are per the Act's process. If asked about details not covered here (balance sheet, holdings, named executives), use the default "no verified information" script.

---

*End of corpus. This file is the source-of-truth for the Digital Czar. It now covers all 51 VARA-licensed VASPs (Part 2/3/3B, re-verified 22 Jul 2026), verified activity counts (Part 1), the ecosystem directory caveats (Part 10), corrected figures (Part 11), UAE dirham stablecoins + the PTSR vs VARA vs Digital Dirham distinction (Part 12, added 30 Jun 2026; Zand AED added 22 Jul 2026), tokenized-property valuation mechanics (Part 13, added 22 Jul 2026), and Pakistan's Strategic Digital Wallet Company / SOE Act 2023 governance layer (Part 14, added 22 Jul 2026). When updating: change the date stamp, preserve all watch-flags, and never remove a sourcing caveat to make a figure or firm look cleaner.*
