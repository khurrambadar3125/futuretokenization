#!/bin/bash
# Vercel ignoreCommand — returns exit 0 (skip build) if changes don't affect the deployed app.
# Called by vercel.json ignoreCommand on every build attempt.
#
#   Exit 1 = run build (changes matter)
#   Exit 0 = skip build (docs/skills/memory only)
#
# FOOTGUN FIXED (2026-06-29): the old script diffed only HEAD~1..HEAD. When a push
# contained [code commit][docs commit] together, Vercel evaluates only the latest SHA
# (the docs commit), saw "docs only", and SKIPPED the whole build — so the code change
# SILENTLY never deployed. That is the "live site doesn't reflect changes" class of bug.
#
# FIX: look back over a WINDOW of recent commits, not just the last one. If ANY commit
# in the window touched real code, build. A code change can no longer be masked by a
# trailing docs commit in the same push.
#
# TRADEOFF (honest): the only over-build case is if the most recent code change is within
# the window but was already deployed — costing one unnecessary build (~$0.40). Far cheaper
# than a silently-undeployed redesign. Safety wins over a marginal build cost.

WINDOW=20

# Files changed across the last $WINDOW commits (capped to available history).
CHANGED=$(git diff --name-only "HEAD~${WINDOW}" HEAD 2>/dev/null)
# Shallow clone / fewer than WINDOW commits → diff against the root commit; else build to be safe.
if [ -z "$CHANGED" ]; then
  ROOT=$(git rev-list --max-parents=0 HEAD 2>/dev/null | tail -1)
  CHANGED=$(git diff --name-only "$ROOT" HEAD 2>/dev/null)
  [ -z "$CHANGED" ] && { echo "Cannot determine changes — building to be safe."; exit 1; }
fi

NEEDS_BUILD=0
while IFS= read -r file; do
  [ -z "$file" ] && continue

  # Files that ALWAYS trigger a build (real app code / data / config).
  case "$file" in
    pages/*|components/*|utils/*|lib/*|styles/*|public/*|scripts/*|data/*)
      NEEDS_BUILD=1; break ;;
    package.json|package-lock.json|next.config.js|next.config.mjs|vercel.json|middleware.js|middleware.ts|tsconfig.json|.env|.env.*|.vercel-ignore-build.sh)
      NEEDS_BUILD=1; break ;;
  esac

  # Files that NEVER trigger a build (docs / Claude Code config / memory).
  case "$file" in
    *.md|.claude/*|.github/*|README*|CLAUDE.md|docs/*|.gitignore|.vercelignore)
      continue ;;
  esac

  # Anything else — be safe and build.
  NEEDS_BUILD=1; break
done <<< "$CHANGED"

if [ "$NEEDS_BUILD" = "1" ]; then
  echo "✓ Code changes detected in last ${WINDOW} commits — proceeding with build"
  exit 1
else
  echo "⊘ Only docs/skills/memory in last ${WINDOW} commits — skipping build (saves money)"
  exit 0
fi
