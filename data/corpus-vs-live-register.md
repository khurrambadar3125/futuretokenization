# Corpus ↔ live VARA register — cross-check (2026-06-25)

Cross-checked `digital-czar-knowledge-corpus.md` Part 2 (the 49-firm table) against the live, browser-verified
register pull in `vara-register.json`. **The corpus is NOT edited** (per the integration brief's rule —
preserve all hedges/watch-flags). This file just records the diff so the Czar wiring + Directory build are
aware. The corpus already self-flags most of these.

## Result: corpus Part 2 is accurate. Two items to handle, both already hedged in the corpus.

| Item | Corpus | Live register | Action |
|---|---|---|---|
| **Shared reference VL/23/09/001** | Lists BOTH BitGo MENA FZE *and* CoinMENA FZE at VL/23/09/001, and flags the uncertainty (lines ~221, ~276) | Confirmed: VARA genuinely lists **both** firms under VL/23/09/001 (both have live pages). It is VARA's own data quirk, not a corpus error. | Directory: list BOTH firms; key by slug, never dedupe these two by reference. Czar: keep the existing caveat. |
| **VL/24/06/001 name** | "MBIO FZE (MB.IO)" | Current live name is **"MEX Digital FZE"** (same licence — a rename) | Directory: use current name "MEX Digital FZE", keep MBIO as an `aka`. Czar corpus could note the rename on next editorial pass (not auto-edited here). |
| **WadzPay (WPME, VL/24/04/004, Pending)** | Not in corpus Part 2 | On the live "Licensed" tab but status **Pending** | Fine to omit from "active" lists; if surfaced, label Pending. |

## Count reconciliation (why "48", "49", and "21" all appear)
- **48** = distinct *active* licence **references** (BitGo MENA + CoinMENA share one ref → counted once). **← Khurram's chosen headline ("48 is fine").**
- **49** = active licensed **firms** (both shared-ref firms counted) = the corpus's 49-row table = VARA's "LICENSED VASPs" tab counter (which also folds in 1 Pending).
- **20–21** = In-Principle Approval holders (VARA's "21" counter vs 20 entries carrying a reference number).

## Per-activity counts — corpus Part 1 VERIFIED against live data ✅
Live active-licensed set reproduces the corpus exactly:
Broker-Dealer 34 · Mgmt & Investment 13 · Exchange 12 · Custody 6 · Lending & Borrowing 5 · Advisory 3 · Category 1 VA Issuance 2.

## So the dataset (`vara-register.json`) holds
70 firm records: 49 active licensed (incl. both BitGo MENA & CoinMENA) + 1 pending (WadzPay) + 20 IPA.
Every firm keyed by slug; `dataQuirks` field documents the shared-reference cases to verify per-entity at build.
