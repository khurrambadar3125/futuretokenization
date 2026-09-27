# futuretokenization.com

<!-- sdlc:done-means -->
## Done means green (AI-native SDLC — rolled out 2026-09-23)
Do not say "done", "fixed" or "live" until every line below has run green in this session, and quote the last line of each:
- `npm run lint`
- `npm run build`
- `npm test` → AI chain + Jev gate tripwires (offline, no keys, no spend)
- AI/Jev change: `node scripts/ai-fallback-proof.mjs` (offline, after build) · `node --env-file=.env.local scripts/news-jev-calibrate.mjs` · `node --env-file=.env.local scripts/czar-jev-calibrate.mjs` (live Jev, ≈ $0.01) — quote the CALIBRATION line
- `node ~/projects/security-harness/run.mjs futuretokenization --quiet` → 0 FAIL (static tier, no network; after a deploy also `--tier live`)
- UI change: open the changed page (local or preview) and look at it — a screenshot beats a claim.

A line that was already red before your change: say so with its output, never report it green. A line you skipped is reported as SKIPPED, not PASS.
Anything bigger than a one-file fix starts as a change folder `intent/<yyyy-mm-dd>-<slug>/` (intent.md → spec.md → plan.md; templates in `intent/README.md`; Khurram signs off the intent before the build). Reviews follow `REVIEW.md`.
<!-- /sdlc:done-means -->

## AI chain + Jev (2026-09-27, his /goal "DeepSeek, fallback Moonshot, then Haiku; Jev in all")
- `/api/chat` (Digital Czar) → `lib/ai-chain/` (vendored from ~/projects/mac-scripts/ai-chain; re-run its `vendor.sh`, never hand-edit `ai-chain.mjs`/`jev.mjs`): DeepSeek `deepseek-v4-pro` via the khurrambadar gateway (`DEEPSEEK_BASE_URL`; `DEEPSEEK_API_KEY` is a gateway bearer) → Moonshot `kimi-k2.6` → Haiku. Register counts in the prompt come from `getMeta()` — never hard-coded; the site never validates licences.
- Jev: Czar replies are gated in SHADOW after the response (`[jev]` log lines, calibrated 9/9); the RWA news brief uses Jev for relevance (22/22) and an ENFORCE gate on every brief (14/14). Unjudged = not published: the news job exits 2 and leaves `data/rwa-news.json` untouched.
- Spend ledger = `[ai-spend]` / `[ai-failover]` log lines (no storage on this platform; a durable KV ledger is his call).
