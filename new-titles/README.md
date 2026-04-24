# new-titles

Library new-acquisitions discovery for a scholarly community. A monorepo containing the data pipeline, classifier, map, and monthly digest generator.

## Layout

```
packages/
  nt-data        Schemas, Pleiades gazetteer, ingest from librarian exports
  nt-classify    Python / scikit-learn classifier for 6 regions of interest
  nt-recommend   Scholar-aware geo recommendations (post-launch)
apps/
  nt-map         Public map of recent acquisitions (5/15 launch target)
  nt-website     Monthly standalone HTML fragment for CMS ingestion
```

Data flows: `nt-data` → `nt-classify` → (`nt-map`, `nt-website`, `nt-recommend`).

## Prereqs

- Node 22+ (`.nvmrc`)
- pnpm 10+
- Python 3.12+ with `uv` (for `nt-classify` only; not needed for map/website work)

## Common commands

```bash
pnpm install            # install all workspace deps
pnpm dev:map            # run nt-map dev server
pnpm validate           # Zod-validate acquisitions.json
pnpm typecheck          # across all TS packages
pnpm lint               # biome
pnpm build              # build everything
```

See each package's README for package-specific commands.

## 5/15 launch scope

Only `nt-data` and `nt-map` ship. Others are scaffolded but implementation is post-launch.

## Workflow

- Trunk-based: PRs into `main`, main always shippable.
- CI gates: typecheck, lint, Zod validate, build.
- Claude Code skills in `.claude/skills/` for recurring tasks (`/ingest`, `/add-place`, `/bump-deps`).
- Monthly rhythm: dep bumps first Monday of the month; data drops as they come in.

## Porting this scaffold to the real repo

This tree currently lives in a sandbox under `intm2/new-titles/` for planning. When `new-titles` is created as its own GitHub repo:

```bash
# From the new empty repo clone:
cp -r /path/to/intm2/new-titles/. .
git add .
git commit -m "scaffold: monorepo initial commit"
git push -u origin main
```

All paths in this scaffold are written as if the contents of `new-titles/` are the repo root — the copy is a straight drop-in with no path edits. Workflows under `.github/workflows/` will then be in the right place for GitHub Actions to pick them up.
