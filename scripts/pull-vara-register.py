#!/usr/bin/env python3
"""Re-pull the VARA public register into data/vara-register.json.

Implements the procedure documented in data/vara-register.README.md:
  1. page-data.json -> staticQueryHashes
  2. each /page-data/sq/d/<hash>.json -> collect contentTypeAlias=='varaRegistry'
  3. dedupe by (varaReferenceNumber || vASPReference), prefer Active + English URL,
     drop CMS "(N)" duplicate nodes
  4. cross-check VL refs against the server-rendered register page before writing

Never writes the output file if the cross-check fails.
Usage: python3 scripts/pull-vara-register.py [--dry-run]
"""
import json
import re
import subprocess
import sys
from collections import Counter
from datetime import datetime, timezone

BASE = "https://vara.ae"
REGISTER_PATH = "/en/licenses-and-register/public-register/"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
REF_RE = re.compile(r"(?:VL|IPA)/\d{2,4}/\d{2}/\d{3}")


def fetch(url):
    # curl instead of urllib: local Homebrew Python lacks SSL root certs
    r = subprocess.run(
        ["curl", "-sL", "--max-time", "30", "-A", UA, url],
        capture_output=True, text=True, check=True,
    )
    return r.stdout


def slugify(name):
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return re.sub(r"-+", "-", s)


def main():
    dry = "--dry-run" in sys.argv

    page_data = json.loads(fetch(f"{BASE}/page-data{REGISTER_PATH}page-data.json"))
    hashes = page_data["staticQueryHashes"]

    raw = []
    for h in hashes:
        blob = json.loads(fetch(f"{BASE}/page-data/sq/d/{h}.json"))
        s = json.dumps(blob)
        if "varaRegistry" not in s:
            continue
        def walk(o):
            if isinstance(o, dict):
                if o.get("contentTypeAlias") == "varaRegistry":
                    raw.append(o)
                for v in o.values():
                    walk(v)
            elif isinstance(o, list):
                for v in o:
                    walk(v)
        walk(blob)

    # Keep English nodes only (AR mirror shares refs; EN CMS urls start /vara-en/)
    en = [o for o in raw if (o.get("url") or "").startswith("/vara-en/")]
    for o in en:
        # CMS internal prefix /vara-en/ maps to the public site's /en/
        o["url"] = o["url"].replace("/vara-en/", "/en/", 1)
    # Drop CMS "(N)" duplicate nodes
    en = [o for o in en if not re.search(r"\(\d+\)\s*$", (o.get("name") or ""))]

    entities, seen = [], {}
    for o in en:
        ref = (o.get("varaReferenceNumber") or "").strip() or (o.get("vASPReference") or "").strip()
        name = (o.get("name") or "").strip()
        if not name:
            continue
        key = ref or f"noref::{name.lower()}"
        status = (o.get("vARAStatus") or "").strip()
        # Duplicate-ref preference: live statuses beat stale CMS leftovers
        # (e.g. WadzPay has an old "Pending" node AND a newer "Withdrawn" node).
        RANK = {"Active": 3, "Issued": 3, "Withdrawn": 2, "Suspended": 2, "Pending": 1}
        prev = seen.get(key)
        if prev is not None:
            same_name = re.sub(r"[^a-z0-9]", "", name.lower()) == re.sub(
                r"[^a-z0-9]", "", entities[prev]["name"].lower()
            )
            if RANK.get(status, 0) <= RANK.get(entities[prev]["status"], 0):
                # Equal-rank nodes with genuinely different names are the real
                # shared-ref quirk (VL/23/09/001: BitGo MENA + CoinMENA) — keep both.
                if same_name or RANK.get(status, 0) < RANK.get(entities[prev]["status"], 0):
                    continue
                key = key + "::" + name.lower()
                prev = seen.get(key)
        ent = {
            "name": name,
            "slug": slugify(name),
            "reference": ref or None,
            "scaNumber": (o.get("sCANumber") or "").strip() or None,
            "status": status,
            "licenseType": (o.get("licenseType") or "").strip() or None,
            "activities": (
                [str(a).strip() for a in o["licenseActivities"] if str(a).strip()]
                if isinstance(o.get("licenseActivities"), list)
                else [a.strip() for a in re.split(r"[|;\n]", o.get("licenseActivities") or "") if a.strip()]
            ),
            "issuanceDate": (o.get("licenseIssuanceDate") or "")[:10] or None,
            "website": (o.get("registryWebsite") or "").strip() or None,
            "address": (o.get("registryAddress") or "").strip() or None,
            "url": o.get("url"),
        }
        if prev is not None:
            entities[prev] = ent
        else:
            seen[key] = len(entities)
            entities.append(ent)

    statuses = Counter(e["status"] for e in entities)
    vl_refs = [e["reference"] for e in entities if e["reference"] and e["reference"].startswith("VL")]
    ipa_refs = [e["reference"] for e in entities if e["reference"] and e["reference"].startswith("IPA")]

    # Cross-check against the server-rendered page (independent build artifact).
    # Only Active licences render on the LICENSED VASPs table, so compare those.
    html = fetch(f"{BASE}{REGISTER_PATH}")
    live_vl = set(m for m in REF_RE.findall(html) if m.startswith("VL"))
    ours_vl = set(e["reference"] for e in entities
                  if e["reference"] and e["reference"].startswith("VL") and e["status"] == "Active")
    if live_vl != ours_vl:
        print("CROSS-CHECK FAILED: VL refs differ from live rendered page", file=sys.stderr)
        print("  live-only:", sorted(live_vl - ours_vl), file=sys.stderr)
        print("  ours-only:", sorted(ours_vl - live_vl), file=sys.stderr)
        sys.exit(1)

    active_firms = [e for e in entities if e["status"] == "Active"]
    out = {
        "source": "VARA Public Register (Gatsby static-query JSON, cross-checked vs rendered page)",
        "sourceUrl": f"{BASE}{REGISTER_PATH}",
        "method": "scripts/pull-vara-register.py — see data/vara-register.README.md",
        "pulled": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "liveCounters": {
            "renderedPageDistinctVlRefs": len(live_vl),
            "renderedPageVlRows": len([m for m in REF_RE.findall(html) if m.startswith("VL")]),
        },
        "agreedHeadlineCount": len(set(r for r in vl_refs if r)),
        "counts": {
            "totalFirms": len(entities),
            "activeFirms": len(active_firms),
            "distinctActiveLicenceRefs": len(set(e["reference"] for e in active_firms if e["reference"])),
            "pendingLicensed": statuses.get("Pending", 0),
            "inPrincipleApproval": statuses.get("Issued", 0),
        },
        "dataQuirks": [
            "VL/23/09/001 shared by TWO real firms (CoinMENA FZE & BitGo MENA FZE); both listed.",
            'CMS "(N)" duplicate nodes dropped.',
            "IPA tier from same CMS source; per-entity detail pages verified 2026-07-22.",
            "WadzPay (WPME, VL/24/04/004) REMOVED from the live register between 2026-06-25 and 2026-07-22.",
            "Tribe Tokenisation (ex IPA/25/12/005) and YHEGO (ex IPA/25/10/006) graduated to full licences VL/26/06/002 / VL/26/06/001 in June 2026.",
        ],
        "entities": entities,
    }

    print(f"entities={len(entities)} statuses={dict(statuses)}")
    print(f"VL distinct={len(set(vl_refs))} IPA distinct={len(set(ipa_refs))}")
    print("cross-check vs rendered page: PASS")
    if dry:
        print("dry-run: not writing")
        return
    with open("data/vara-register.json", "w") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
    print("wrote data/vara-register.json")


if __name__ == "__main__":
    main()
