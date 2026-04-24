---
name: bump-deps
description: Monthly grouped dependency refresh across the monorepo. Runs on the first Monday of the month.
---

# bump-deps

Monthly cadence keeps the stack current without per-PR dep-bump noise.

## Steps

1. `pnpm update -r --latest` for all workspace packages. Review the diff — flag any major version bumps for manual review.
2. `uv sync --upgrade` in `packages/nt-classify/` (once that package has Python deps).
3. Run the full CI suite locally: `pnpm typecheck && pnpm lint && pnpm validate && pnpm build`.
4. If anything broke, fix or revert the offending package. Don't merge a bump PR with known regressions.
5. Open a PR titled `deps: monthly bump <YYYY-MM>` with a summary of major-version changes.

## Guardrails

- Never bump React, Vite, or react-leaflet in the same PR as other changes — isolate so a regression is easy to bisect.
- If a major version bump requires code changes (breaking API), that's a separate PR, not this one.
