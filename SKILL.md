---
name: illuminate
description: >-
  Turn one or more dense source documents into a complete, drill-downable, richly
  componented, premium editorial artifact — a single self-contained offline HTML site
  built on a modern React/Tailwind/shadcn stack with a curated best-in-class component
  catalogue. Use when a user wants a long or complex source (a strategy memo, a report,
  a dossier, a spec, a set of related documents) turned into a navigable, visual,
  argument-first web artifact rather than a summary. Document-agnostic: it reads
  structure and data, never a document's vocabulary.
---

# illuminate

illuminate turns a dense source into a **complete, drill-downable, richly-componented, premium
editorial artifact** that *rationalizes and preserves* the source's full complexity — it never
compresses it into a tidy skeleton. It is **document-agnostic**: nothing in this skill is keyed to a
particular document, domain, or vocabulary. It classifies **structure and data**, and delegates every
judgment that must generalize to an LLM agent, never to a keyword list.

The pipeline is three stages. **Stages I–II are reasoning** (impose an argument, preserve everything,
discipline the evidence). **Stage III is building** (render that argument as a self-contained modern
site). The two are separated by one artifact — `argument-model.json` — so the reasoning is decided
before any rendering competes for it.

---

## The method (Part 1) — the Minto Pyramid Principle

illuminate's reasoning is not ad-hoc: **Stages I–II *are* Barbara Minto's Pyramid Principle**, integrated
into this repo as its foundation at [`references/minto-pyramid/`](references/minto-pyramid/) (the full
method, source-grounded from the book — `cheatsheet.md` for the decision rules, `chapters/` for the
mechanics). The architect imposes a Minto pyramid: a single **Main Point** (the `governing_thought` field)
resting on **MECE** branches ordered by one of Minto's three orders (time / structural / degree), each
`finding` a real insight and never a blank count. The develop agents run Minto's **vertical question/answer
dialogue** — each node answers the question its parent raises. SCQA governs the introduction; the R1/R2
problem-definition framework and diagnostic frameworks apply when the source is a problem-solving document.
Stage III (build) is dumb infrastructure beneath this method.

---

## The two laws (override everything)

**1 · The Completeness Law.** illuminate **rationalizes and preserves; it does not compress.** The
Minto pyramid and MECE are *completeness* tools: the Governing Thought is the *entrance* to the
material, not a replacement; MECE's "collectively exhaustive" means **complete**; depth is progressive
disclosure that reveals **more** developed material, never a shorter restatement. **Every sibling is
developed to the same depth** — a section whose head is rich and whose tail is a stub is a failure.
Crispness belongs to the Governing Thought sentence alone, never to the body beneath it. Completeness
is enforced numerically (a per-node word floor) and by the render gate, not by hope.

**2 · The Evidence-Discipline Contract.** ASSERT only what traces to a source signal (`S-NNN`); HEDGE
the partial or contested; EXCLUDE the untraceable; ILLUSTRATE surfaces (charts, maps, mockups) *depict*
but are never themselves evidence — every concrete value inside one traces to a signal or renders as a
visible placeholder. Reconcile or surface contradictions; never silently pick one side. Verification is
earned by the claim, not owed to the source: a plainly-internal source triggers zero web fetches.

---

## Stage I — INPUT (ingest, preserve, do not compress)

`build/scripts/ingest.py <source.docx> → source-model.json`. Walk the document in order; under each
heading capture the **verbatim** substantive spans — prose, every table, every code block — each with
a trace id. Nothing is dropped. Acceptance: `Σ span_words ≈ the source's substantive word count`. For
multiple sources, cluster first (related → one synthesized artifact; unrelated → separate), then run
the pipeline per cluster.

## Stage II — PROCESS (impose a pyramid; develop; discipline)

The reasoning, done by LLM agents so it generalizes to any document.

**Architect (`build/agents/architect.md`).** Reads the whole `source-model.json` and **imposes a Minto
pyramid**: a Governing Thought that is a *synthesis* (the one sentence the reader must leave with — not
the source's title or first heading), then Domains (MECE), Drivers, Mechanisms. Every source section
maps to exactly one node by its trace. **The source's headings and nesting are a hint, not the
structure** — restructure freely to serve the argument; reconcile contradictions. This is what makes
the output thesis-first instead of an echo of the source's table of contents.

**Manifest (`build/scripts/manifest.py`).** Consumes the architect's tree (never regex-matches heading
words). For each node it computes a **`word_floor`** (a source-proportional minimum, never zero) and
attaches the node's verbatim source span. No component detection here — component choice is the develop
agent's job (Stage III bridge).

**Develop (`build/agents/develop-node.md`), in parallel, one agent per driver.** Given the shared bible
and its node records, **develop the driver and every mechanism to its floor** — not summarize, develop:
the argument, the numbers, the mechanism, the cross-links, ending where the node ends. Evidence
discipline is hard: every figure traces; nothing is invented. Each agent also **chooses each node's
component** (see the bridge below) and emits its traced data.

## Stage III — OUTPUT (build the artifact)

Stage II emits **`argument-model.json`** (the pyramid; each node with its developed HTML, traces,
finding, and — where the material warrants — a chosen `component:{family,data}`). Stage III renders it
the standard way a modern skill builds a site, using three fixed, document-neutral parts.

**The bridge — component choice by data shape (agnostic).** The develop agent chooses each node's
component from the **catalogue manifest** (`build/app/src/catalog/manifest.ts`, the machine-readable
menu) **by what the data is, never by the document's words**: named places → `map`; source→use volume
flows → `sankey`; a directed process → `flow`; a hub fed by parts → `network`; weighted cases/branches
→ `scenario-tree`; a build-up to a total → `waterfall`; a stage drop-off → `funnel`/`two-sided-funnel`;
a series over time/cohort → `time-series`/`area-trend`; phases on a time axis → `timeline`; a value vs a
capacity → `gauge`; headline metrics → `kpi-summary`; a dense cross-tab → `faceted-grid`; a depicted
email/app/screen → `mockup`; an algorithm/query → `code`. It fills that family's `dataSchema` with
traced values, or chooses none if prose serves best. Never force one.

**The catalogue (`build/app/src/catalog/`) — a curated, best-in-class, Beitar-themed component library.**
Charts (Recharts), sankey (d3-sankey), flow/network (react-flow + SVG), map, timeline, scenario-tree,
gauge, KPI+sparkline, TanStack data-grid, device mockups, One-Dark code. All self-contained and
single-file-bundleable. Components are **never hand-rolled per document** — the builder imports from the
catalogue. `render.tsx` maps a node's `{family,data}` to its component.

**The generic renderer (`build/app/src/App.tsx`) — a deterministic, agnostic walk of the model.** Reads
`argument-model.json`, renders the Overview (the derived Governing Thought + a GT-level component + a
domain nav rail), and each domain on the **Swiss editorial grid** with **shadcn drill-down** (accordion/
tabs), each node's developed prose + `<RenderComponent spec={node.component}/>`. **Every label comes
from the model — no literal document strings anywhere.**

**Bundle & gate.** `vite build` + `vite-plugin-singlefile` → **one offline `dist/index.html`** (all JS/
CSS/fonts inlined, zero external requests). Then `build/gate/gate.mjs` renders it headless in **both
themes**, walks the drill-down, and **blocks the build** on: any node below its word floor; a
data-bearing node that rendered no component (under-componentization); dead-margin/narrow-column layout;
more than one Beitar mark per view or any near-white foreground on a Beitar fill; a non-embedded or
system font; a rainbow chart; a clipped value, dead control, or **console error**. The artifact is only
ever emitted as the gate-passed `dist/index.html`.

The catalogue is the design asset; the renderer and bundler are dumb infrastructure; **all per-document
intelligence lives in the architect and develop agents.** Nothing in Stage III is keyed to any document.

---

## Design system — "Beitar" (content-neutral; applies to every document)

- **Palette (both light and dark, real recalibrations):** Inchiostro `--ink` `#141210`/`#EFEADF`
  (text/structure); Carta `--paper` `#F4F0E8`/`#17140F` (grounds); Cenere `--cenere` `#8C8680`/`#948E86`
  (secondary); **Beitar `#FFCC00`, constant** — exactly **one mark per view**, on that view's finding,
  **never body text, never a wash**, with a **fixed dark foreground `#141210`** on any Beitar fill (never
  `var(--ink)` — that inverts in dark).
- **Type, embedded (no system fonts):** a Helvetica-class grotesque for text/display, a geometric face
  (Jost) for kickers/numerals, JetBrains Mono for code — self-hosted base64 woff2, one offline file.
- **Code:** always-dark One-Dark panels in both modes.
- **Charts:** monochrome (ink + cenere) with the single Beitar mark on the finding; differentiate by
  lightness / fill-style / small-multiples — **never a rainbow**.
- **Layout:** fill the canvas — an editorial grid with a section rail and marginalia; **no narrow
  centred column with dead margins.**
- **Motion:** earned, where it serves the argument; every animation ships a reduced-motion fallback.

---

## Guardrails

- **Document-agnostic:** no document name, domain vocabulary, or source-specific heading convention in
  any logic or template. Structure and components are classified by data shape and LLM judgment. A grep
  of the code/templates for any past document's words must return nothing.
- **Single-file / offline:** always one self-contained HTML, zero external requests.
- **No self-grading, no silent partials:** the gate reads only the built file + the model, outside any
  generator's context; a FAIL is never shipped as pass.
- **Never emit from a single pass:** the artifact is only ever the gate-passed build.
- **Never hand-roll a component:** the builder composes from the catalogue.
- **Side effects need permission:** do not push, publish, or send on the user's behalf without an
  explicit ask.
