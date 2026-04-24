---
name: ingest
description: Ingest a new librarian export (CSV or JSON) into nt-data. Parses the file, resolves Pleiades IDs against the gazetteer, validates against the Zod schema, writes the updated acquisitions.json, and opens a PR.
---

# ingest

Use this when the librarian drops a new export into `packages/nt-data/data/exports/`.

## Steps

1. Confirm the target file exists under `packages/nt-data/data/exports/`. If the user hasn't committed it yet, ask them to do so first (the raw export is the audit trail).
2. Detect new Pleiades IDs that aren't in `data/gazetteers/pleiades.json`. If there are any, run `pnpm --filter @nt/data refresh-gazetteer` to fetch them. Commit the updated gazetteer.
3. Run `pnpm --filter @nt/data ingest <path>` to parse the export, resolve places, and write `data/acquisitions.json`.
4. Run `pnpm validate` to confirm every record parses against the Zod schema. If records fail, surface the errors and pause — bad data should never merge silently.
5. Run `pnpm typecheck` and `pnpm build` locally.
6. Open a PR with title `data: ingest <export filename>` and a body summarizing record counts, new Pleiades IDs added, and any validation warnings.

## Guardrails

- Never edit `acquisitions.json` by hand. Always re-run ingest.
- Never modify a raw export after committing. If the librarian re-sends a corrected version, it goes in as a new file.
- If ingest fails midway, leave the repo in a clean state (git checkout the partial writes) before reporting.
