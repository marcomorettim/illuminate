# illuminate build harness

The skill's Stage III **runs this build** instead of generating the artifact in one pass. The
thesis (see the Build Order doc): single-pass generation minimises cost into a scaffold, and a
prose gate grades itself. This harness gives **every node its own generation step with its own
budget**, and makes the gate **an executed program that counts rendered pixels and DOM** outside
any generator's context.

## The nine stages

| # | Stage | Runner | Output |
|---|---|---|---|
| 0 | Ingest (preserve, don't compress) | `scripts/ingest.py` | `.work/source-model.json` |
| 1-2 | Decompose & manifest (floors + required components) | `scripts/manifest.py` | `.work/manifest.json` |
| — | Prepare bible + per-driver records | `scripts/prepare.py` | `.work/bible.md`, `.work/drivers/*.json` |
| 3 | **Develop** — one subagent per driver, bodies ≥ floor | Task tool + `agents/develop-node.md` | `.work/nodes/*.json` |
| 4 | **Componentize** — code/table verbatim from source; bespoke data from the develop agents | in `build.mjs` + agent `component_data` | — |
| 5-7 | Assemble → single-file bundle → mask | `scripts/build.mjs` | `dist/illuminate.html` |
| 8 | **Render gate** (executed, 9 checks, both themes) | `gate/gate.mjs` | `dist/gate-report.json` |
| 9 | **Repair** — re-dispatch only the failing nodes' agents, re-assemble | skill orchestrates | — |

## Invoking it

```
node scripts/pipeline.mjs prepare <source.docx>   # stages 0-2 + bible/records
#  → dispatch one develop-node agent per driver (Task tool): each reads
#    agents/develop-node.md + .work/bible.md + .work/drivers/<id>.json → writes .work/nodes/<id>.json
node scripts/pipeline.mjs assemble                # stages 5-8 → gate verdict
#  → on FAIL, gate-report.failing_nodes names the exact nodes; re-dispatch only those, re-assemble.
```

The load-bearing rule: **`build-manifest.json` is the contract, written from the SOURCE before any
prose exists.** Completeness is a number in that file, not a decision the generator makes mid-pass.

## The gate (Stage 8) — what it measures, per manifest node, from the DOM

1. **Completeness** — rendered words per node vs its `word_floor`; total vs 0.6× source words.
2. **Component coverage** — every `required_component` node renders a component element.
3. **Drill-down** — depth reachable by *clicking* (≥4), not scroll height.
4. **Canvas fill** — content span vs viewport; dead-margin ratio ≤ threshold.
5. **Beitar** — fixed dark foreground on marks (the dark-mode bug), no accent heading.
6. **Fonts** — no `system-ui`/`-apple-system`/SF Pro/Segoe/Futura resolved.
7. **Charts** — monochrome (distinct non-grey/non-accent hues ≤ 3).
8. **Motion** — animation on drill + a `prefers-reduced-motion` branch.
9. **Behaviour** — zero console errors; the theme control actually flips `data-theme`.

The gate reads only the built file and the manifest — never a generator's context. It is proven to
correctly FAIL an empty build (0 rendered vs the floor-sum) with zero false positives.

## Environment

- **App template** (`app/`): React + Tailwind + Radix + TanStack + visx + Framer Motion, bundled to
  one offline HTML by `vite-plugin-singlefile` (IIFE + DOMContentLoaded mount → also artifact-CSP safe).
  Beitar tokens (both themes), embedded Nimbus/Jost/JetBrains woff2. `app/node_modules` is symlinked
  from a peer install; `npm install` in `app/` reproduces it.
- **Playwright/Chromium**: resolved from `render-gate/node_modules` (via `build/node_modules` symlink)
  + the default browser cache. No `PLAYWRIGHT_BROWSERS_PATH` needed here.
- `.work/`, `dist/`, `node_modules/` are gitignored; a passing run is archived under `../build-cache/`.
