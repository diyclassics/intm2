---
name: ingest
description: Ingest a new librarian export (CSV or JSON) into nt-data. Parses the file, resolves Pleiades IDs against the gazetteer, validates against the Zod schema, writes the updated acquisitions.json, and opens a PR.
---

# ingest

Use this when the librarian sends a new shelflist export. Exports live locally in `packages/nt-data/data/exports/` (gitignored). Only the built `acquisitions.json` and any gazetteer additions get committed.

## Steps

1. Confirm the export is present at `packages/nt-data/data/exports/<filename>`. It will not appear in git status — that's expected.
2. Detect new Pleiades IDs that aren't in `data/gazetteers/pleiades.json`. If there are any, run `pnpm --filter @nt/data refresh-gazetteer` to fetch them.
3. Run `pnpm --filter @nt/data ingest <path>` to parse the export, resolve places, and write `data/acquisitions.json`.
4. Run `pnpm validate` to confirm every record parses against the Zod schema. If records fail, surface the errors and pause — bad data should never merge silently.
5. Run `pnpm typecheck` and `pnpm build` locally.
6. Open a PR with title `data: ingest <YYYY-MM> shelflist` and a body summarizing record counts, new Pleiades IDs added, and any validation warnings. The raw export is NOT part of the diff — only `acquisitions.json` and gazetteer changes.

## Guardrails

- Never edit `acquisitions.json` by hand. Always re-run ingest.
- Never commit a shelflist export. The `.gitignore` already blocks them; if one sneaks in, remove before opening the PR.
- Record the export's filename and sha256 in the PR body (or in an `acquisitions.json` metadata field) so the build's provenance is reconstructable even without the raw file in git.
- If ingest fails midway, leave the repo in a clean state (git checkout the partial writes) before reporting.
