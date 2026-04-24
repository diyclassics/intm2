---
name: build-monthly
description: Generate the monthly HTML fragment for CMS ingestion. Post-launch skill — implementation lands after 5/15 and after the prior nt-website work is ported.
---

# build-monthly

**Status: post-launch.** Placeholder until `nt-website` is implemented.

## Planned steps

1. Determine the target month (default: previous calendar month).
2. Run `pnpm --filter nt-website build -- --month <YYYY-MM>`.
3. Output lands in `apps/nt-website/out/<YYYY-MM>.html` — a standalone HTML fragment for CMS paste-in.
4. Preview the fragment in a browser (`npx serve apps/nt-website/out`) before handing off.
5. Open a PR titled `digest: <YYYY-MM>` so the fragment is reviewable; on merge, the file is the deliverable.

## Guardrails

- The HTML is a fragment, not a full document. No `<html>`, `<head>`, `<body>` — just the content block the CMS will wrap.
- Inline styles only (or scoped classes the CMS tolerates). No external CSS links unless the CMS permits.
