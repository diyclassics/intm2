# new-titles — handoff (2026-04-24)

Snapshot of where the restart stands. Read this once to pick up the thread; `CLAUDE.md` has the ongoing conventions.

## TL;DR

A pnpm monorepo sandbox for the `nt-*` ecosystem — a library-acquisitions discovery tool with a 5/15 launch target for `nt-map`. The full scaffold is in place, including CI, Claude skills, and a working dev server. Three pieces of content need to land before the ingest pipeline becomes real: a sample librarian export, the six region names, and the prior nt-website source.

## What this project is

Library new-acquisitions discovery for a scholarly community at work. Surfaces recent acquisitions on a map, geocoded by **subject/setting of the work** (not publication place or author origin), using Pleiades IDs already embedded in MARC $0.

Three deliverables from one pipeline:

- `nt-map` — public interactive map (**5/15 launch**)
- `nt-website` — monthly standalone HTML fragment for work's CMS (post-launch, port prior art)
- `nt-recommend` — scholar-aware geo recommendations (post-launch, new build)

Fed by:

- `nt-data` — schemas, Pleiades gazetteer, ingest from librarian CSV/JSON
- `nt-classify` — scikit-learn classifier tagging each record with 1 of 6 regions

## Decisions locked (don't relitigate without cause)

| Decision | Choice | Why |
|---|---|---|
| Repo shape | **Monorepo** (`new-titles`), pnpm workspaces | Solo + Claude; one PR can touch schema + map + website; single CI, single Biome, single CLAUDE.md |
| Frontend stack | Vite + React 19 + TS + react-leaflet | 2026 default for this size; CRA is deprecated; react-leaflet still the right tool |
| Data schema | Zod, single source of truth in `@nt/data/schema` | Runtime validation + type inference from one definition |
| Ingest input | Librarian CSV/JSON export, no MARC parsing in-app | Librarian pre-converts; keeps toolchain JS-only |
| Geocoding | Pleiades IDs from MARC $0, resolved against vendored gazetteer | Authoritative for ancient places; already in your records |
| Classifier | scikit-learn (Python, `uv`-managed) | Your preference — defensible, reproducible, cheap. Reintroduces Python but scoped to one package |
| Hosting | GH Pages (prod), CI artifacts for previews | Unchanged from current setup; no new infra |
| CI gates | typecheck, Biome, Zod validate, build — all required | Catches the fragile-stack class of past pain |
| Workflow | Trunk-based, PR-per-change | Main always shippable; monthly dep-bump rhythm |

## 5/15 scope guardrail

**Ship:** `nt-data` + `nt-map`. Public map with geocoded acquisitions. No auth, no backend, no personalization, no mailer.

**Don't ship:** anything else. `nt-classify`, `nt-website`, `nt-recommend` are scaffolded but implementation-empty.

If a feature feels like scope creep toward 5/15, it almost certainly is.

## Current state

Branch: `claude/project-restart-planning-h2kdJ` in `diyclassics/intm2` (sandbox repo). Scaffold lives at `new-titles/` — contents are structured as if they were the repo root, so porting is `cp -r new-titles/. /target/repo/`.

**Working:**
- `pnpm dev:map` renders the map with sample Pompeii + Athens markers
- `pnpm validate` Zod-parses `acquisitions.json`
- `pnpm typecheck`, `pnpm lint`, `pnpm build` all in place

**Scaffolded but not implemented:**
- `packages/nt-data/src/ingest.ts` — stub; awaits sample export
- `packages/nt-data/src/refresh-gazetteer.ts` — stub; wired post-first-ingest
- `packages/nt-classify/` — Python skeleton; awaits labeled training set
- `apps/nt-website/` — placeholder; awaits prior art port
- `packages/nt-recommend/` — type contract only

## Three open items (what I need from you)

1. **Librarian sample export** → drop into `packages/nt-data/data/exports/` locally. That directory is **gitignored** — shelflists stay off git. I'll wire real column mapping in `ingest.ts`; only the built `acquisitions.json` gets committed.
2. **Six region names** → replace the `region-1..6` placeholders in `packages/nt-classify/src/nt_classify/regions.py`.
3. **Prior nt-website source** → share the repo/path. I'll inventory and port what's worth keeping when `nt-website` work starts post-launch.

Also welcome: existing `nt-map` source, so I can port any visual design decisions or domain logic worth preserving.

## How to continue the work

### Daily commands

```bash
cd new-titles
pnpm dev:map              # dev server at http://localhost:5173
pnpm typecheck            # strict TS across all packages
pnpm lint                 # Biome
pnpm validate             # parse acquisitions.json against Zod
pnpm build                # full build
```

### Claude skills (codified recurring work)

- `/ingest` — process a new librarian export
- `/add-place` — manual gazetteer entry when Pleiades/Getty miss
- `/bump-deps` — monthly grouped dep refresh
- `/classify`, `/build-monthly` — post-launch stubs

Details in `new-titles/.claude/skills/<name>/SKILL.md`.

### VS Code session setup

See the short conversation notes:

```bash
# If not done yet:
brew install pnpm        # or: corepack enable && corepack prepare pnpm@10 --activate
cd new-titles
pnpm install
code .
```

Install the Claude Code extension, open the Claude panel, and it auto-reads `CLAUDE.md`. No re-briefing needed.

## Porting to the real `new-titles` repo

When the sandbox has served its purpose:

```bash
# Create the empty repo (gh repo create diyclassics/new-titles --private)
git clone https://github.com/diyclassics/new-titles.git
cd new-titles
cp -r /path/to/intm2/new-titles/. .
git add . && git commit -m "scaffold: monorepo initial commit"
git push -u origin main
```

Enable GitHub Pages in repo Settings (Source: GitHub Actions) before the first merge to `main`, or comment out `.github/workflows/deploy-map.yml` until you're ready.

## Post-launch order

1. **nt-classify** (late May → mid June): port labeled training set, train sklearn model, produce `classifications.json`
2. **nt-website** (mid June → early July): port prior art, wire monthly HTML generation
3. **nt-recommend** (later): scholar profiles first, then matching engine, then per-scholar views

Beyond the top three: Getty TGN fallback for geocoding, subject-heading inference for unresolved places, email digest (needs mailer), geofenced notifications (needs auth + backend).

## Philosophy (why this will be maintainable)

- **Data is code-reviewed.** Every librarian drop and gazetteer update is a PR with CI gates. Bad data can't merge silently.
- **Enrichment is additive.** Classifications, place resolutions, recommendations — all in sibling files keyed by record id. `acquisitions.json` stays pristine.
- **No speculative infrastructure.** No backend, auth, DB, or mailer until a specific feature demands them. Post-launch scope is explicit.
- **Recurring work is codified.** If you do it twice, it becomes a Claude skill. Saves future-you.
- **One schema change, one PR.** The monorepo is the whole point — frontend, ingest, classifier move together.
