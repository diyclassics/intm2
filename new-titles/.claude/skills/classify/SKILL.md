---
name: classify
description: Run the nt-classify model over new records and update classifications.json. Post-launch skill — implementation lands after 5/15.
---

# classify

**Status: post-launch.** This skill is a placeholder until `nt-classify` is implemented.

## Planned steps

1. Identify records in `acquisitions.json` that don't yet have a classification (or whose classification was produced by an older model version).
2. Run `uv run --package nt-classify predict --input <acquisitions.json> --output <classifications.json>`.
3. Inspect the per-record confidence distribution; flag low-confidence predictions for human review.
4. Run `pnpm validate` to ensure classifications.json parses against its schema.
5. Open a PR titled `classify: <N> new records` with a summary of class balance and any flagged records.

## Guardrails

- Never discard the previous classifications.json without a PR — classifications are research artifacts with history.
- Model version must be recorded alongside each classification so results are reproducible.
