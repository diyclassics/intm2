# @nt/data

Schemas, gazetteer, and ingest pipeline. The authoritative shape of an acquisition lives here; every other package imports from `@nt/data/schema`.

## Contents

```
src/
  schema.ts              Zod schemas — Place, Acquisition, AcquisitionsFile, GazetteerEntry
  ingest.ts              CSV/JSON export → acquisitions.json (stub until sample export lands)
  validate.ts            Zod-parse acquisitions.json; non-zero exit on failure (CI gate)
  refresh-gazetteer.ts   Fetch Pleiades entries for referenced IDs (stub)
data/
  exports/               Raw librarian drops, committed verbatim as audit trail
  gazetteers/
    pleiades.json        Vendored Pleiades subset — only entries we reference
  acquisitions.json      Built artifact — the canonical record set the apps read
```

## Commands

```bash
pnpm --filter @nt/data validate           # CI gate: parse acquisitions.json
pnpm --filter @nt/data ingest <file>      # ingest an export (once implemented)
pnpm --filter @nt/data refresh-gazetteer  # update Pleiades subset
```

## Conventions

- `acquisitions.json` is a *built artifact*. Never hand-edit. Re-run ingest.
- Raw exports under `data/exports/` are never modified after commit. A corrected export arrives as a new file.
- New Pleiades IDs trigger a gazetteer refresh before ingest completes.
- Enrichment (classifications, inferred regions) lives in sibling files keyed by record id — not added to `acquisitions.json`.
