---
name: add-place
description: Manually add a place to the vendored gazetteer when Pleiades/Getty lookup fails and a human-curated entry is needed.
---

# add-place

Use when a record references a place that isn't in Pleiades or Getty TGN, or when automated resolution produced wrong coordinates.

## Steps

1. Ask the user for: place name, coordinates (lat/lon), source of the identification (a citation or "manual"), and which record(s) reference it.
2. Append the entry to `packages/nt-data/data/gazetteers/manual.json` under a stable local id (e.g. `manual:<slug>`).
3. Run `pnpm --filter @nt/data ingest <relevant-export>` to re-resolve any records that reference the new place.
4. Run `pnpm validate`.
5. Open a PR titled `gazetteer: add <place name>` with the citation in the body.

## Guardrails

- Prefer Pleiades > Getty TGN > manual entry. Only add to `manual.json` when both external sources fail.
- Always record a citation. Uncited manual coordinates rot silently.
