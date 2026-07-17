# illuminate render gate

The blocking, mechanical form of `[ILLUMINATE:RENDERGATE]` (SKILL.md Rule 15h / H6.5 / G5). A prose
rule loses to the model's defaults; this script renders the pixels and **exits non-zero on FAIL**, so a
non-compliant artifact cannot silently ship.

## Setup (one-time)

```bash
cd render-gate
npm i
npx playwright install chromium
```

## Run (per build)

```bash
node render-gate/render-gate.mjs path/to/artifact.html
```

Emits `[ILLUMINATE:RENDERGATE] pages:<n> PASS` (exit 0) or `... FAIL <reasons>` (exit 1). It discovers
the page set from `[data-page]` (hash-routed multi-page) or treats the file as a single scroll.

## What it fails on — every view, light **and** dark

| # | Check | Rule |
|---|---|---|
| 1 | a value clips (`scrollWidth > clientWidth`) in a mockup / tile / cell | G4 / H5c |
| 2 | banned warm-cream `--paper` + warm (hue 15–45) `--red` palette | H6.1 |
| 3 | a forbidden system-font token (`-apple-system`/`system-ui`/`SF Pro`/`Segoe UI`/**`Futura`**) | H6.2 / C |
| 3b | **Beitar (`#FFCC00`) used as text or as a wash behind text** — the accent is a mark only | Part K·G |
| 4 | no embedded `@font-face`, or one that doesn't lead `--hn` | H6.2 |
| 5 | an accent-colored heading descendant | H6.3 |
| 6 | an empty / half-filled diagram (SVG surface with no drawn children) | G5 |
| 7 | a title-over-whitespace page (tall view, almost no text) | Completeness Law / G1 |
| 8 | a dead/lying control (clicks theme toggle + evidence trigger; each must act) | H4 |
| 9 | any console error or unhandled `pageerror` | G5 |

A FAIL re-enters the Phase-7 correction register. Fix the artifact (or, when the finding is in the
skill's own reference code, the skill), then re-run until PASS.

`node_modules/` and the Chromium binary are git-ignored; only the script + `package.json` are tracked.
