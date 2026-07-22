# FutureTokenization — Rebuild & Czar Integration Brief

**For:** Claude Code (or a developer) operating inside the FutureTokenization codebase.
**Companion file:** `digital-czar-knowledge-corpus.md` (the Czar's knowledge base — referenced throughout).
**Prepared:** 25 June 2026.

---

## 0. READ THIS FIRST — non-negotiable rules

This site's entire value is **credibility about regulated firms.** The following rules override any instinct to make the content cleaner, more confident, or more marketable. Violating them damages the asset.

1. **Do NOT remove or soften "watch-flags" or sourcing caveats.** The corpus deliberately includes unflattering, hedged, and "company-reported" notes (e.g. Scintilla's wrong licence number, Mantra's OM token collapse, Ctrl Alt's pending Nasdaq listing, "Prypco is a broker-dealer not the tokenizer"). Your instinct will be to tidy these into confident statements. Do not. The hedge IS the content.
2. **Do NOT invent figures, dates, or deals.** If a value isn't in the corpus or an existing verified source, leave it absent and mark it "not yet verified." Never generate a plausible-sounding number to fill a gap.
3. **Preserve date stamps and "last verified" labels.** Every data surface should carry one. If you can't verify on rebuild, keep the existing stamp — don't delete it.
4. **The Czar answers only from the corpus.** Wire it so it does not free-associate from general training data on factual VASP/market questions. Behavioral rules in corpus Part 0 go in the system prompt.
5. **Educational only.** Nothing on the site or from the Czar is financial/investment/legal advice. Keep the disclaimers.

When in doubt, keep the cautious version. Tidy-and-confident is the failure mode this whole project guards against.

---

## 1. WHAT WE'RE BUILDING

Transform FutureTokenization.com from a single long-scroll site into an **app-like, card-based, mobile-first experience** with persistent navigation and a knowledge-equipped "Digital Czar" assistant.

Two workstreams:
- **A. Czar integration** — load the corpus into the assistant so it answers from verified material.
- **B. Site reorganization** — restructure all existing + new content into discrete sections reachable via cards and bottom nav, instead of one infinite scroll.

Sequencing: content structure first (Sections 3–4), then the app shell (Section 5), then Czar wiring (Section 2). The shell is worthless without the structured content behind it.

---

## 2. CZAR INTEGRATION

**Input:** `digital-czar-knowledge-corpus.md`.

**Wiring pattern (adapt to whatever platform powers the Czar):**
- Put corpus **Part 0 (behavioral rules)** into the assistant's **system prompt**, verbatim in spirit. These are the guardrails — cite/date/define, never invent, not advice, stay neutral, always include watch-flags, "when unsure" fallback script.
- Put corpus **Parts 1–9 (the data)** into the assistant's **retrieval layer** (vector store / RAG / context injection), chunked by firm and by section so the model can pull the relevant profile.
- If the platform has no retrieval and only a system prompt, include the most-queried parts (Parts 1, 2, 3, 4, 9) inline and accept the rest as occasional "check the register" fallbacks.

**Validation before going live:** test the Czar against these and confirm correct behavior:
- "Is Scintilla legit?" → must state VL/23/07/003, Broker-Dealer + Exchange, AND mention the website's wrong-licence-number flag.
- "Who tokenizes Dubai property?" → must explain the stack and correct the Prypco-is-the-tokenizer mislabel.
- "Tell me about Mantra" → must include the April 2025 OM token collapse.
- "Should I invest in X?" → must decline to advise.
- "How many VASPs are licensed?" → "49 as of 25 Jun 2026, check vara.ae for current."
- "What's gold's price?" / something not in corpus → must NOT invent; must point to a live source.

If any of these fail, the wiring is leaking to general training data — tighten it.

---

## 3. THE SECTION STRUCTURE (the new IA)

Six top-level sections + the Czar. Everything maps into one of these.

| Section | Bottom-nav? | Purpose |
|---|---|---|
| **Home** | yes | Hub of cards + today's headline. Entry point. |
| **Directory** | yes | The 49 VASPs, filterable by activity. Each firm = its own page. |
| **Czar** | yes (center) | The AI assistant. Always one tap away. |
| **News** | yes | Dated updates feed (Pakistan-first, then global). |
| **Saved** | yes | User bookmarks (firms, case studies). |
| **Case Studies** | via Home card | Tier-1 deep dives (PRYPCO, Ctrl Alt/DLD, …). |
| **Ecosystem Maps** | via Home card | Role-stack + activity-index visuals. |
| **Learn** | via Home card | Tokenization 101 / concepts. |
| **MENA Corridor** | via Home card | Dubai hub + Pakistan frontier (the site's angle). |

Rule: a screen shows one section's content. Tap a card → go to that section → tap back → return Home. No screen requires more than a short scroll; long content (a case study) paginates or uses in-page anchors, not one endless column.

---

## 4. CONTENT MIGRATION MAP (where each existing piece goes)

Map the CURRENT long-scroll content (from the existing site) into the new sections. Source = existing pages, screenshots provided, and the corpus.

### → LEARN
- "What is Tokenization" intro + digital-twin explanation
- "How It Works" 6-step flow (Asset Selection → Secondary Trading)
- "Why Institutions Are Moving Fast" (cost, settlement, fractional, compliance, composability, audit) — KEEP but reword "up to 70% lower costs" as attributed estimate
- "Technology Stack" (L1–L7 layers)
- "History of Tokenization" timeline
- Stablecoins-vs-crypto explainer + types of stablecoins
- CBDC "Great Divide" comparison table + surveillance paradox
- Concept definitions from corpus Part 8

### → DIRECTORY
- The 49-firm register (corpus Part 2) = the filterable index
- Detailed firm profiles (corpus Part 3) = individual firm pages
- "Major Players" content from existing site = fold into the relevant firm pages
- Filter chips: Broker-Dealer, Exchange, Custody, Issuance, Mgmt & Investment, Advisory, Lending, + "RWA-focused"

### → CASE STUDIES (Tier-1 only)
- Existing PRYPCO Mint / DAMAC case study → Case Study A
- New Ctrl Alt × DLD case study (drafted) → Case Study B
- Planned: Scintilla/Vesta, Mantra/DAMAC
- Other case-study-style cards on the existing site (BUIDL, Ondo, Figure, WLF, RealT, Pakistan) → keep as Tier-1 ONLY if they have verifiable metrics; otherwise demote to reference cards. Apply the corpus Part 5 tiering rule.

### → ECOSYSTEM MAPS
- The DLD role-stack diagram (built)
- The activity-index map (built) — NOTE: its per-activity counts are marked "approximate pending verification"; do the precise tally before publishing as authoritative
- These become the visual table-of-contents into the Directory

### → MENA CORRIDOR
- UAE/Dubai regulatory content (VARA, the multi-layer system, DFSA Jan 2026 changes)
- All Pakistan content (PVARA, Binance $2B MOU, WLF MOU, DAMAC/Punjab, PDAA, agri-tokenization) — corpus Part 6
- The five-layer Pakistan architecture graphic (strong existing asset — keep)
- Other emerging markets (Southeast Asia, Africa) as secondary cards

### → NEWS
- The "Global Tokenization News" daily feed
- Keep the Pakistan-first ordering
- Each item needs a date + source label

### → HOME
- "Today" headline card (latest News item)
- 2×2 section cards: Directory, Case Studies, Ecosystem Maps, Learn
- Featured MENA Corridor strip
- Bottom nav

### AUDIT TASKS during migration (do these, don't skip)
- Reconcile the contradictory TVL figures ($21B/$25B/$35B/$65B) to the sourced range in corpus Part 7. State what each headline number counts.
- Update "134 countries" → "146 countries" (CBDC, corpus Part 7) with date.
- Flag/cut the unsourced "gold $5,111 on Jan 27 2026" stat unless tied to a dated source.
- Update BUIDL "$1B AUM" and similar to current ("as of [date]") or label clearly.
- Tone pass: remove urgency framing ("the window is closing fast," "Master it here") site-wide. Reference-grade, calm register.
- Every market stat gets source + date + definition, or it doesn't ship.

---

## 5. APP-SHELL SPEC (the design system)

Mobile-first. ~380px design width; scale up gracefully to desktop (cards reflow to wider grid).

**Navigation:**
- Persistent bottom nav: Home · Directory · Czar (center, elevated, accent-colored circle) · News · Saved.
- Top bar: logo left, search icon right.
- Card tap → push to section screen; back button returns. App-style routing, not anchor-scroll.

**Cards:**
- White/surface bg, 0.5px border, rounded (radius-lg), generous padding.
- Section cards: icon + title + one-line subtitle.
- Firm cards (Directory): name + licence ref + activity chips + (if applicable) a small watch-flag indicator.
- Case-study cards: title + the metric tiles + "Tier 1" treatment.

**Components to standardize:**
- Metric tile (big number + label) — reused in case studies and stat bands.
- Firm profile page template (from corpus Part 3 fields: name, ref, activities, what-it-is, focus, partners, leadership, watch-flags, sources, last-verified).
- Case-study template (header + 4 metric tiles + Opportunity/Solution/Result/Lessons + partner grid + sources + date).
- "Last verified [date]" stamp — appears on every data surface.

**Visual register:** flat, clean, minimal borders, no hype. Dark mode supported. The site should read like a reference tool, not a sales page.

**Maps:** the role-stack and activity-index become real `<a href>`-linked navigation (tap a box → go to that firm/section). NOT chatbot calls — those were a chat-preview artifact. On the live site they are hyperlinks.

---

## 6. SUGGESTED EXECUTION ORDER for Claude Code

1. Scaffold the section/route structure (Section 3) without moving content yet.
2. Build the reusable components (Section 5): firm-profile template, case-study template, metric tile, last-verified stamp, card.
3. Migrate content section by section per the map (Section 4), running the audit tasks as you go. Do Directory + Learn first (highest volume), then Case Studies, Maps, MENA, News.
4. Build Home as the hub once sections exist.
5. Wire the Czar (Section 2) and run the validation tests.
6. Final pass: confirm every data surface has a date + source, every profiled firm retains its watch-flags, and no urgency/hype language survived.

---

## 7. WHAT NOT TO AUTOMATE AWAY

A reminder, because an automated rebuild's instinct runs counter to these:
- Keep the hedges. "Company-reported," "announced agreement not realized volume," "pending, not closed," "approximate pending verification" — these are features.
- Keep Prypco labeled broker-dealer, Ctrl Alt labeled the tokenizer. Don't merge them for simplicity.
- Keep Scintilla's licence-number flag.
- Keep Mantra's OM collapse in any Mantra content.
- Don't upgrade thin firms to "case studies" by inventing metrics. Tier-2 profile card is the honest default.
- Don't let the Czar answer factual questions from general training data — corpus or "I don't have that verified."

---

*End of brief. Pair with `digital-czar-knowledge-corpus.md`. Re-verify all dated figures against primary sources on the day of rebuild.*
