#!/usr/bin/env python3
"""Sync register-derived blocks of digital-czar-knowledge-corpus.md from
data/vara-register.json (PART 2 table + per-activity counts). Idempotent:
replaces the blocks between fixed anchors. Fails loudly if anchors move.

Run after every scripts/pull-vara-register.py re-pull, then regenerate
lib/czarCorpus.js with scripts/gen-czar-corpus.py.
"""
import json
import re
import sys
from collections import Counter

CORPUS = "digital-czar-knowledge-corpus.md"

ABBREV = {
    "Broker-Dealer Services": "Broker-Dealer",
    "Exchange Services": "Exchange",
    "Exchange Services (including VA Derivatives Trading)": "Exchange (incl. VA Derivatives)",
    "Management and Investment Services": "Mgmt & Investment",
    "Custody Services": "Custody",
    "Custody Services [including custodial staking]": "Custody (incl. custodial staking)",
    "VA Custody Services [including custodial staking and collateral wallet services]":
        "Custody (incl. custodial staking & collateral wallet)",
    "Advisory Services": "Advisory",
    "Lending and Borrowing Services": "Lending & Borrowing",
    "Category 1 VA Issuance": "Category 1 VA Issuance",
}

MERGE = {  # merged display categories for the per-activity count block
    "Broker-Dealer Services": "Broker-Dealer Services",
    "Exchange Services": "Exchange Services",
    "Exchange Services (including VA Derivatives Trading)": "Exchange Services",
    "Management and Investment Services": "Management & Investment Services",
    "Custody Services": "Custody Services",
    "Custody Services [including custodial staking]": "Custody Services",
    "VA Custody Services [including custodial staking and collateral wallet services]": "Custody Services",
    "Advisory Services": "Advisory Services",
    "Lending and Borrowing Services": "Lending & Borrowing Services",
    "Category 1 VA Issuance": "Category 1 VA Issuance",
}


def short_name(name):
    return re.sub(r"\s+(FZE|FZCO|DMCC|L\.?L\.?C\.?|Ltd|Limited)\b.*$", "", name).strip()


def main():
    d = json.load(open("data/vara-register.json"))
    pulled = d["pulled"][:10]
    active = [e for e in d["entities"] if e["status"] == "Active"]
    active.sort(key=lambda e: (e["issuanceDate"] or "", e["name"]), reverse=True)
    n_firms = len(active)
    n_refs = len(set(e["reference"] for e in active))
    n_ipa = sum(1 for e in d["entities"] if e["status"] == "Issued")

    rows = ["| VASP | Reference | Licensed activities | Issued |", "|---|---|---|---|"]
    for e in active:
        acts = "; ".join(ABBREV.get(a, a) for a in e["activities"])
        issued = (e["issuanceDate"] or "").replace("-", "/")
        rows.append(f"| {e['name']} | {e['reference']} | {acts} | {issued} |")
    table = "\n".join(rows)

    merged = Counter(MERGE.get(a, a) for e in active for a in e["activities"])
    holders = {}
    for e in active:
        for a in e["activities"]:
            holders.setdefault(MERGE.get(a, a), []).append(short_name(e["name"]))
    single = sum(1 for e in active if len(e["activities"]) == 1)
    multi = sum(1 for e in active if len(e["activities"]) > 1)
    grants = sum(len(e["activities"]) for e in active)

    def names_note(cat, cap=8):
        ns = holders.get(cat, [])
        return f" ({', '.join(ns)})" if len(ns) <= cap else ""

    counts_lines = [
        f"### Verified per-activity counts (from the register, {pulled})",
        f"Of the {n_firms} firms: {single} hold a single activity, {multi} hold multiple "
        f"({grants} activity-grants in total). Exact counts per activity:",
    ]
    order = [
        "Broker-Dealer Services", "Management & Investment Services", "Exchange Services",
        "Custody Services", "Lending & Borrowing Services", "Advisory Services",
        "Category 1 VA Issuance",
    ]
    tags = {
        "Broker-Dealer Services": " (the broad base)",
        "Category 1 VA Issuance": " — the rarest and highest-value permission; it allows minting/originating tokens",
    }
    for cat in order:
        if merged.get(cat):
            extra = tags.get(cat, "")
            note = names_note(cat) if cat not in ("Broker-Dealer Services",
                                                  "Management & Investment Services",
                                                  "Exchange Services") else ""
            counts_lines.append(f"- {cat} — {merged[cat]}{note}{extra}")
    counts_lines.append(
        f"These counts sum to more than {n_firms} because multi-activity firms are counted in each "
        "category they hold. Re-verify against the live register, as new licences shift the totals."
    )
    counts_block = "\n".join(counts_lines)

    text = open(CORPUS).read()

    # Replace the per-activity counts block (from its ### heading to the next ---)
    pat_counts = re.compile(r"### Verified per-activity counts.*?(?=\n---)", re.S)
    if not pat_counts.search(text):
        sys.exit("anchor missing: per-activity counts block")
    text = pat_counts.sub(counts_block + "\n", text)

    # Replace PART 2 heading + intro + table (up to the closing ---)
    pat_part2 = re.compile(r"## PART 2 — THE VASP REGISTER.*?(?=\n---)", re.S)
    if not pat_part2.search(text):
        sys.exit("anchor missing: PART 2 block")
    part2 = (
        f"## PART 2 — THE VASP REGISTER (the {n_firms} licensed firms)\n\n"
        f"Source: VARA public register, verified {pulled} (scripts/pull-vara-register.py, "
        "cross-checked against the rendered register page). Format per firm: name · reference · "
        "activities · issued date. Reference numbers are NOT sequential by issue date (assigned at "
        "application). Re-verify against vara.ae before quoting as current.\n\n"
        + table + "\n"
    )
    text = pat_part2.sub(part2, text)

    open(CORPUS, "w").write(text)
    print(f"synced: {n_firms} firms / {n_refs} distinct refs / {n_ipa} IPA / pulled {pulled}")
    print(f"activity stats: single={single} multi={multi} grants={grants}")
    for cat in order:
        if merged.get(cat):
            print(f"  {cat}: {merged[cat]}")


if __name__ == "__main__":
    main()
