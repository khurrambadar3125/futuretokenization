# futuretokenization.com

<!-- sdlc:done-means -->
## Done means green (AI-native SDLC — rolled out 2026-09-23)
Do not say "done", "fixed" or "live" until every line below has run green in this session, and quote the last line of each:
- `npm run lint`
- `npm run build`
- `node ~/projects/security-harness/run.mjs futuretokenization --quiet` → 0 FAIL (static tier, no network; after a deploy also `--tier live`)
- UI change: open the changed page (local or preview) and look at it — a screenshot beats a claim.

A line that was already red before your change: say so with its output, never report it green. A line you skipped is reported as SKIPPED, not PASS.
Anything bigger than a one-file fix starts as a change folder `intent/<yyyy-mm-dd>-<slug>/` (intent.md → spec.md → plan.md; templates in `intent/README.md`; Khurram signs off the intent before the build). Reviews follow `REVIEW.md`.
<!-- /sdlc:done-means -->
