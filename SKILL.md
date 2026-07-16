---
name: illuminate
description: Dense source in. Self-contained interactive HTML out. Three-stage arc — INPUT (multi-source ingestion, per-source salience gate against the source's own thesis, faithful provenance), PROCESS (Barbara Minto Pyramid + MECE issue-tree, 3-skeptic adversarial audit), OUTPUT (polished editorial site — shadcn/ui, Swiss typography, interactive ASCII, evidence drawer; parallax opt-in). Editorial restraint — every effect must earn its place by aiding understanding.
trigger: /illuminate
---

# illuminate

**Dense source in. Self-contained interactive HTML out.**

`/illuminate` transforms any complex source — research corpus, book, codebase, multi-file
dump, conversation archive — into a single interactive HTML artifact that makes the argument's
logical structure navigable, alive, and permanently legible.

Three stages. Each is a named capability block with specific techniques, quality tests, and
gate conditions. The stages are not phases to rush through — they are the method.

```
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE I — INPUT                                                     │
│  Multi-source ingestion · signal stratification · provenance audit  │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE II — PROCESS                                                  │
│  Concept mapping · Barbara Minto Pyramid · MECE issue tree          │
│  3-skeptic adversarial audit                                        │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE III — OUTPUT                                                  │
│  Visual architecture · editorial frontend (shadcn/ui)               │
│  Swiss typography · interactive ASCII · progressive disclosure      │
└─────────────────────────────────────────────────────────────────────┘
```

**Technical stance: polished editorial restraint.** The goal is the best interactive support
for *understanding* a complex argument — a well-designed editorial website, not a demo reel.
Restraint is the taste: every effect must earn its place by making the argument more legible.
If an animation doesn't help the reader understand, it's noise, and the same discipline that
cuts noise from the signal block cuts it from the page.

- **Component vocabulary: shadcn/ui** (Radix primitives + Tailwind, the shadcn patterns —
  Accordion, Tabs, Tooltip, ScrollArea, Table, Dialog, Separator, Card). Use the shadcn
  composition patterns, not hand-rolled berserk. Self-contained builds inline the same
  primitives; the *patterns* are the standard either way.
- **Motion:** purposeful only — reveal-on-scroll, state transitions, the GT fade-in. The Emil
  Kowalski motion standard below governs it. No decorative motion.
- **Parallax:** allowed, but a deliberate choice, off by default — enable only when depth
  genuinely aids the reading (see Parallax Depth System). Never automatic.
- **Cut for editorial support:** no 3D card physics, no scramble/glitch text reveals. Both
  are too edgy for a tool whose job is calm comprehension. The GT *fades* in; it never scrambles.

Any JS/CSS library is permitted when it serves legibility (D3/Observable Plot for real data
viz, for instance). A build step (Vite, esbuild) is fine for served sites; avoid it when the
artifact must be self-contained offline. Vanilla is fine when it's the fastest legible path.

---

## The Evidence-Discipline Contract

This contract governs the entire arc. It is not a phase — it is the law.

```
ASSERT     only claims that trace to a specific S-NNN signal block entry.
HEDGE      claims where the evidence is partial, contested, or version-fragile.
EXCLUDE    claims where the trace cannot be established.
ILLUSTRATE visual representations (mockups, flow diagrams, metric enactments) that DEPICT
           what a claim describes. An illustration is never itself evidence. Every concrete
           label, figure, quote, or string inside it either traces to an S-NNN entry, or it
           renders as visibly-generic placeholder — greeked text, %%token%%, 00.0%.
```

Violations in any phase are removed and the gap is named. Confidence is not evidence.
Paraphrasing a weak claim into apparent support is a violation. Leaving a claim unchallenged
because it seems plausible is a violation.

A component that invents a specific number, quote, or result the source does not contain is the
most dangerous violation of all — because it is the most believable. A reader will trust a
rendered open-rate on a rendered dashboard. Illustrations are held to the same trace discipline
as prose; they simply fail more invisibly. This governs the entire Component Library: every
fidelity mockup, funnel, KPI tile, and flow node is an ILLUSTRATE surface, and its concrete
content is bounded by the signal block.

**The visible-marker rule.** Every component carries a small, persistent ILLUSTRATION tag
(`.mock-tag`) unless all of its concrete content traces to S-NNN entries — in which case it may
instead carry its S-NNN traces as citation chips. The reader must always be able to tell "this is
a faithful depiction" from "this is live/verified data." Never blur the two.

**Fidelity is symmetric.** The contract above polices *addition* — unsupported content, fabricated
figures, illustrations that invent. It polices *subtraction and manufacture* equally:

- **Representation is the default; verification is the exception — earned by the claim, never owed
  to the source.** A stated claim is faithfully represented and `ASSERT`-ed to its source (the
  trace is "the source states X"); no external verification is required. A claim enters the
  world-verification path only if it passes ALL of a necessity gate — **load-bearing** (its truth
  would change a hub / KL / GT) AND **empirical/checkable** AND **contested or version-fragile** AND
  the **primary source is reachable** AND **material** (getting it wrong would mislead). Otherwise:
  represent it, flag `[CONTESTED:*]` / `HEDGE` if warranted, and move on. Flagging is cheap and
  stays; fetching, chasing, and refuting are reserved for what passes the gate. **Do not manufacture
  verification to signal rigor — that is the verification-theater the Self-Certification section warns
  against.** (Provenance-chasing is conditional too: chase a referenced file iff reading it could
  change a hub, a KL, or the GT; record the rest.)
- **Over-condensation is a fidelity violation, on par with fabrication.** Losing a load-bearing
  nuance to fit the pyramid is as much a failure as inventing one. The structural caps (3–5 KLs,
  ≤2 taps to evidence) limit the **visible spine** for cognitive load — they never limit the **total
  content**. The reasoning, caveats, and supporting detail behind each KL are elaborated to the
  complexity of the source and carried in the progressive-disclosure layers. **Depth is deferred,
  not deleted.** Where a source is irreducibly complex, present it as such; never force false
  simplicity into a skeleton of headlines.

---

## Governance Vocabulary

Every gate emits a structured signal:

```
[ILLUMINATE] Opening. Source: <type> | Context: <clean/warn/contaminated> | Stage: input
[ILLUMINATE:SIGNAL] ... [/ILLUMINATE:SIGNAL]      ← Phase 1 anchor (written to disk)
[ILLUMINATE:HUBS] ... [/ILLUMINATE:HUBS]          ← Phase 2 anchor (written to disk)
[ILLUMINATE:PYRAMID] ... [/ILLUMINATE:PYRAMID]    ← Phase 3 anchor (written to disk)
[ILLUMINATE:GATE] Phase <N> PASS | Anchor: <path> | Next: <phase>
[ILLUMINATE:GATE] Phase <N> FAIL | Reason: <specific> | Action: <fix and re-run>
[ILLUMINATE:CORRECT] Attempt <N>/3 on Phase <N> | Problem: <specific>
[ILLUMINATE:ESCALATE] Phase <N> unresolved after 3 attempts. Operator must intervene.
[ILLUMINATE:CLOSE] ...summary...
```

**Correction register:** max 3 re-attempts per gate, then escalate. Do not silently spiral.

**Anchor discipline:** Phases 1, 2, and 3 each write their anchor to disk before the gate
passes. No phase opens without the prior phase's disk anchor present and readable.

---

# STAGE I — INPUT

*Goal: a dense, stratified, fully-traced signal block that contains every load-bearing idea
in the source, nothing fabricated, nothing missed.*

The Input stage runs three sub-phases: environment and source audit (0), multi-angle signal
extraction (1), and provenance verification (1b). When specific tools are available, they
are named; when they are not, the internal fallback procedure applies. The quality of the
Input stage determines the quality of everything downstream.

---

## Phase 0 — Configuration + Environment Audit

**Step 0a — Configuration prompt (run before any analysis):**

Present the following to the operator and wait for confirmation before continuing.
Do not begin signal extraction, source analysis, or any pipeline phase until palette and
tier are chosen.

```
[ILLUMINATE] Configuring.

Choose palette — visual identity of the artifact:
  1. illuminate  (default) — Swiss editorial cold; pure editorial contrast; any source
  2. claude                — warm terracotta; approachable intelligence; general-purpose
  3. greenhouse            — eucalyptus membrane; living systems; technical/architectural sources
  4. typeset               — printer's ink + aged paper; authoritative; dense text / books
  5. signal                — phosphor instrument; precise; scientific / quantitative sources
  6. archive               — historical parchment; dignified; documentary / primary sources

Choose render tier:
  e · editorial (default) — polished shadcn/ui + Swiss typography; purposeful motion + ASCII;
                            no parallax, no 3D, no scramble. The calm-comprehension default.
  r · rich                — editorial + opt-in parallax depth where it aids the reading.
  s · simple              — content-first; no animation; maximum legibility / print.

Choose output mode:
  w · web    (default) — interactive HTML; Swiss editorial; ASCII + evidence drawer
  d · doc              — single-column learning doc; print-ready; shadcn primitives; 72ch; minimal motion
  p · deck             — KL-per-slide; 16:9; keyboard nav + PDF; illuminate identity in slide frames

Parallax is opt-in via the rich tier only; it is never automatic. 3D card physics and
scramble/glitch text reveals are not offered — too edgy for editorial support.

Confirm palette + tier + mode to proceed.
```

Boot script will apply all three selections before first paint. Persist in `localStorage`.

```
[ILLUMINATE:GATE] Phase 0a PASS | Palette: <name> | Tier: <e/r/s> | Mode: <web/doc/deck>
```

---

**Environment probe (run first, once):**

```
Tool-enriched environment (if available):
  vault search <topic>             → prior signal; tag as [VAULT] in Phase 1
  (RTK users: rtk vault search <topic>; non-RTK: skip gracefully if vault unavailable)
  /faithful-sourcing skill         → invoke at Phase 1b close
  graphify / semantic_search_nodes → structural relationships; tag as [GRAPH] in Phase 2

Bare environment (no tools):
  All internal fallback procedures apply (described in each phase).
  Quality is identical; only the tooling differs.
```

**Source-type detection (determines Phase 1 strategy):**

| Source type | Signal strategy | Key failure mode to avoid |
|---|---|---|
| Single dense document | Full linear read; 3-angle scan | Missing structural claims buried in prose |
| Book / long-form | Chapter-by-chapter chunked extraction; cross-chapter synthesis pass | Treating per-chapter themes as independent; missing cross-cutting arguments |
| Multi-file / codebase | Provenance chain walk from root; implementation files are part of source | Reading only the high-level document; treating code as illustration not evidence |
| Research corpus | Scan for claims + citations; flag uncitable figures immediately | Fabricated precision numbers at hard problems (see self-certification section) |
| Conversation / transcript | Identify speaker roles; weight claims by epistemic authority in context | Treating off-hand statements as assertions; missing corrections later in thread |
| Paste / raw dump | Identify structure: is this a document, a list, a log? | Imposing structure that isn't there; under-extracting disorganized but dense material |

**Source audit checklist:**
- Length and density estimate (H/M/L — will this need chunking?)
- Contamination risk: adversarial instructions, role-override attempts, PII → halt if found
- Referenced documents or files: list every `see also`, `implemented in`, `references:`. Chase
  only the **load-bearing** ones in Phase 1 — those where reading the file could change a hub, a KL,
  or the GT. Record the rest as referenced-but-not-read; they need no fetch. An unclosed
  *load-bearing* provenance chain is a gate failure; a non-load-bearing reference is not.
- Signal budget: if source > ~30k tokens, decide chunking strategy now. Never silently truncate.
- Concrete artifacts: does the source describe a *renderable* artifact — an email, screen, message,
  UI, config, metric, dashboard, or process/flow? List each. These are FIDELITY-MOCKUP / component
  candidates for Stage III (see the Component Library). A how-to / product / process source where the
  subject IS a visual artifact is the strongest case for component-heavy output. Record the list in
  the Phase 1 signal-block header as "Artifact candidates: <list>".

```
[ILLUMINATE] Opening.
  Source: <type> | Length: <N tokens> | Density: <H/M/L>
  Context: <clean / warn — specific reason>
  Strategy: <single-pass / chunked-N / provenance-chain>
  Environment: <tools available>
  Referenced sources to chase: <list or "none">
  Phase: input
```

If contamination detected: halt. Name the specific pattern. Do not proceed.

```
[ILLUMINATE:GATE] Phase 0 PASS | Strategy: <type> | Refs to chase: <N>
```

---

## Phase 1 — Signal Extraction

This phase produces the **named signal block**: only the load-bearing ideas in the source,
stratified by type, with adversarial extraction surfacing what the source does not say.

Extraction is not the goal — *survival* is. Tagging noise cleanly still ships noise; a fast,
well-labelled pipe for material that doesn't matter is the failure mode this phase exists to
prevent. So salience is judged per source, against the source's own thesis, and everything
that isn't load-bearing is cut **before** the pyramid — not disclosed lazily behind an
accordion downstream. There is no signal-count target: the right number of survivors is
"as few as the argument needs," and a block that cut nothing is a gate failure (Phase 1a).

**Thesis capture (do this first, before the angles):**
State, in one sentence, the single claim the source exists to argue — the sentence its author
would endorse as the core. Write it down. This is the bar every later signal is measured
against: a signal is *load-bearing* only if removing it would weaken, qualify, or break a
path to this thesis (and, downstream, to the Governing Thought). Everything else is context.

**Signal stratification — 6 tag types:**

Every extracted entry gets one primary tag:

| Tag | Meaning | Examples |
|---|---|---|
| `[SOURCE]` | Directly stated in the material | "The system uses 3-tier memory" |
| `[INSIGHT]` | Counter-intuitive, surprising, or reverses a common assumption | "Smaller models are MORE deterministic than larger ones at temp 0.0" |
| `[METRIC]` | Quantified claim with a stated source | "48.4% accuracy loss from summarization" |
| `[PRINCIPLE]` | Generalizable rule stated or implied | "Dedup before compress, not after" |
| `[SYNTHESIS]` | Implied by the combination of two or more SOURCE entries | `[SYNTHESIS: S-004 + S-009]` |
| `[GAP]` | What the source doesn't address that would complete it | `[GAP: no cross-protocol identity standard exists]` |

Secondary flags (applied on top of primary tag):
- `[CONTESTED:unverified]` — figure cited without a checkable reference
- `[CONTESTED:absolute]` — "always/never/all" universal claim
- `[CONTESTED:contradiction]` — conflicts with another entry (tag both)
- `[ASSUMPTION:basis-unknown]` — treated as background truth, never defended
- `[VAULT]` — retrieved from prior vault signal (if available)
- `[GRAPH]` — structural relationship from graphify (if available)

**Three mandatory extraction angles — each a separate pass:**

**Angle 1 — Structural extraction** (what is explicitly stated?)
Forward read. Extract every named claim, fact, figure, argument, and principle.
Do not summarise. Do not group. Extract granularly. Assign correct primary tag.
**This "do not summarise; extract granularly" discipline binds downstream too, not only here:**
the reasoning and caveats captured now must survive into the artifact's disclosure layers, not be
compressed away to fit the pyramid. Depth is deferred, not deleted (see the symmetric-fidelity principle).
Flag every METRIC without a cited source as `[CONTESTED:unverified]`.
Flag all universal claims.

**Angle 2 — Synthesis + insight extraction** (what does the combination imply? what surprises?)
Read the Angle 1 entries. Do not re-read the source.
- Pairs and triples that together imply something neither states individually → `[SYNTHESIS]`
- Counter-intuitive results, reversals of common assumptions → `[INSIGHT]` (these become the
  best candidates for Key Lines; they carry the most argumentative weight)
- Patterns across three or more claims pointing to a structural reality not stated → name it
- Contradictions → tag both `[CONTESTED:contradiction]`

**Angle 3 — Adversarial extraction** (what is incomplete, falsifiable, or assumed?)
Assert the opposite of each Angle 1 entry. If the assertion reveals a gap: `[GAP]`.
Identify claims treated as background assumptions but never defended: `[ASSUMPTION]`.
Identify concepts referred to but never defined: `[UNDEFINED]`.

**Insight inventory (run after Angle 2):**
Pull all `[INSIGHT]` entries. For each:
- What assumption does it reverse?
- Why is the insight durable (would it survive in a different context)?
- Is there a simple visual form that makes the inversion legible (a before/after, a spectrum,
  a reversal table)?
Insights that pass these tests are the prime candidates for Key Lines in Phase 3.

**Book-to-skill strategy (apply when source type = book / long-form):**
1. Chapter extraction pass: for each chapter, extract 3–5 highest-weight claims only.
   Do not try to be complete per-chapter — find the load-bearing beams.
2. Cross-chapter synthesis pass: read all chapter extractions together. What argument
   spans multiple chapters that no individual chapter states? These become SYNTHESIS entries.
3. Author's thesis test: what single sentence would the author endorse as the book's core
   claim? If it doesn't map to any extracted entry, the extraction missed something.

**Deep-research flag (world-verification — the exception, not the default):**
Do NOT fetch on sight of a `[METRIC]` or `[CONTESTED]`. First apply the **necessity gate**: a claim
enters the verification path only if it is ALL of — **load-bearing** (its truth would change a hub /
KL / GT) AND **empirical/checkable** AND **contested or version-fragile** AND the **primary source is
reachable** AND **material** (getting it wrong would mislead). Represent-and-flag is the default;
fetching is earned by the claim, never owed to the source.
- **Passes the gate** → fetch and compare verbatim. Discrepancy → mark `[REFUTED]` and exclude.
- **Fails the gate** → represent the claim faithfully, flag `[CONTESTED:*]` / `HEDGE` if warranted,
  and move on. Never fetch it; never silently upgrade it to verified. Flagging is cheap and stays.

**Provenance-trace requirement (conditional — load-bearing references only):**
Chase a referenced file *iff* reading it could change a hub, a KL, or the GT. Read those before
closing Phase 1; **record the rest as referenced-but-not-read** (they need no fetch). A signal block
that hasn't traced its **load-bearing** references is incomplete → gate failure; unread
non-load-bearing references are not a failure. Missing hubs come from skipping a load-bearing chase —
do not let that happen, and do not manufacture reads to look thorough.

**Phase 1a — Salience gate (mandatory; the survival filter):**
Run after the three angles, before faithful-sourcing. This is where noise dies.

The three angles extract *inclusively* — that is correct, extract greedily. This gate then
decides what survives. Judge every candidate against the captured thesis and partition it:

| Verdict | Test | Fate |
|---|---|---|
| `KEEP` | Removing it would weaken, qualify, or break a path to the thesis / a Key Line. | Enters the signal block. Gets an S-NNN. |
| `CONTEXT` | True and traceable, but the argument stands without it. Background, not beam. | Held in an appendix list, not the pyramid. Available if a KL later needs it. |
| `CUT` | Restates a KEEP, is generic-true (would be true of any source in the domain), or is detail no argument path reaches. | Dropped. Not disclosed later. |

One-line reason per verdict — no bare labels. The reason *is* the anti-rationalization check:
"load-bearing because…" must name the thesis-path it serves, or it isn't KEEP.

**The cut is not optional.** A greedy three-angle pass over a real source always surfaces
restatement and generic-true filler. A signal block where `CUT` is empty means the gate
didn't run — the model kept everything and rationalized. **Empty CUT list = Phase 1 gate
failure.** (Same law as the greenhouse membrane: never self-certify. The cut-list is the
visible evidence that a judgment happened, not just a relabelling.)

Salience is a per-source judgment, not a fixed heuristic — a metric that's decorative in one
source is the load-bearing beam in another. The thesis is what makes the call local and honest.

Emit before proceeding:
```
[ILLUMINATE:SALIENCE] Thesis: <one sentence>
Candidates: <N> → KEEP: <N> | CONTEXT: <N> | CUT: <N>
Cut sample: <2–3 cut entries + reason>   (empty = gate failure)
```

**Phase 1b — Faithful-sourcing verification:**
Run after the salience gate, before writing the disk anchor.

*If /faithful-sourcing skill is available:* invoke it on the completed signal block.
Contested entries flagged → mark `[CONTESTED:sourcing]`.

*Internal fallback (no skill available):*
For each METRIC: state the exact text of the source that justifies it. If you cannot quote
it verbatim, downgrade to HEDGE. For each SOURCE: confirm it cannot be an INSIGHT (i.e.,
it is stated, not implied). For each SYNTHESIS: confirm the component S-NNNs both exist
and actually support the synthesis as stated.

**Signal block format:**
```
[ILLUMINATE:SIGNAL]
Domain: <domain label>
Source: <type> | Length: <N> | Density: <H/M/L> | Strategy: <type>
References traced: <list of additional files read, or "none">
Insights found: <N> (these drive Phase 3 KL candidates)
Artifact candidates: <list of renderable artifacts the source describes, or "none">
Redacted: <list, or "none">
Conflicts: <list, or "none">
─────────────────────────────────────────────────────────────────────
S-001  <claim>                                               [SOURCE]
S-002  <counter-intuitive finding>                          [INSIGHT]
S-003  <quantified claim>                      [METRIC] [CONTESTED:unverified]
S-004  <implication of S-001+S-002>            [SYNTHESIS: S-001 + S-002]
S-005  <gap the source doesn't address>        [GAP: what would close it]
...
─────────────────────────────────────────────────────────────────────
Angle 1: <N> SOURCE/METRIC/PRINCIPLE | Angle 2: <N> INSIGHT/SYNTHESIS
Angle 3: <N> GAP/ASSUMPTION/UNDEFINED | Contested: <N> | Refuted: <N>
INSIGHT inventory: <N> entries, <N> passed durability test
[/ILLUMINATE:SIGNAL]
```

Write to disk (required before gate passes):
Use the Write tool to save the full signal block above to `/tmp/illuminate-signal.md`.

```
[ILLUMINATE:GATE] Phase 1 PASS | Anchor: /tmp/illuminate-signal.md | Next: concept-map
Block: <N> KEEP | SOURCE: <N> | INSIGHT: <N> | METRIC: <N> | SYNTHESIS: <N> | GAP: <N>
Salience: KEEP <N> | CONTEXT <N> | CUT <N>   (CUT 0 = FAIL, do not pass)
Contested: <N> | Refuted: <N> | References traced: <N>
```

---

# STAGE II — PROCESS

*Goal: a Minto Pyramid whose Governing Thought is inarguable, whose Key Lines are MECE,
and whose supporting detail is fully traced, adversarially verified, and logically sufficient.*

The Process stage applies the Barbara Minto Pyramid Principle with rigorous quality tests —
not as a template to fill in, but as a discipline that reveals whether the source actually
contains a coherent argument. Many sources do not. That finding is itself a legitimate output.

---

## Phase 2 — Concept Mapping + Issue Tree

**Part A — Hub detection:**

From the signal block, extract all named concepts as nodes. For each node, identify:
- `supports_or_enables` relationships (arrows out)
- `depends_on` relationships (arrows in)
- `contradicts_or_complicates` relationships

Rank all nodes by total connection count. Top 2–4 are hub candidates.

Orphans (connection count = 0):
- `signal-orphan`: has signal value but doesn't connect to any hub → **retain** as KL supporting
  detail. This is the default: a signal that carries load-bearing nuance is kept even when it hangs
  off the spine rather than anchoring it.
- `noise-orphan`: genuinely tangential → discard, record reason. **Reclassifying a `signal-orphan`
  down to `noise-orphan` requires a stated reason and is the exception, not the default — bias toward
  retention.** Dropping a load-bearing nuance is a fidelity violation, on par with fabricating one.

**Downstream completeness check (conditional — load-bearing downstream only):**
For each hub: ask — is there implementation code, a downstream document, or a technical artifact
whose reading could **change the hub, a KL, or the GT** (validate, contradict, or materially enrich
what the hub says)? If yes and it wasn't read in Phase 1: read it now and update the signal block.
If reading it could not change the structure, record it as referenced-but-not-read and move on.
Only a hub built on an unread **load-bearing** downstream is a defect. Do not chase downstream
artifacts to look thorough — verification is earned by the claim, not owed to the source.

*If graphify / semantic_search_nodes is available:*
Run on each hub candidate. Add structural relationships as `[GRAPH]` connections.
`get_impact_radius` on each hub: how does it propagate through the system?

**Part B — Issue tree:**

Before building the pyramid, build a question decomposition tree. This is the Minto method's
pre-pyramid step that prevents top-down rationalization.

```
Root question: "Why is [candidate GT] true?"
  → Sub-question 1: "What evidence supports this specific aspect?"
    → Evidence: S-NNN entries that answer it
  → Sub-question 2: "What evidence supports this other aspect?"
    → Evidence: S-NNN entries that answer it
  ...
```

Rules for the issue tree:
- Every leaf of the tree must map to at least one S-NNN entry.
- Every S-NNN INSIGHT entry must appear as a leaf somewhere.
- Sub-questions that cannot be answered by any S-NNN entry reveal that the GT is unfounded
  in that dimension → revise the GT, not the evidence.

The top-level sub-questions of the issue tree become the Key Line candidates.

**MECE grouping type (identify before proceeding):**
Key Lines can be grouped in three ways. Identify which type this pyramid requires:

| Grouping type | When to use | Test |
|---|---|---|
| **Process** | Arguments are sequential steps toward the GT | "If we removed a step, does the GT fail?" — if yes, it's process |
| **Structure** | Arguments are parts of a whole (components, dimensions, domains) | "Are these collectively exhaustive parts of one thing?" |
| **Situation** | Arguments are mutually exclusive categories of cases | "Could any two cases overlap?" — they must not |

Do not mix grouping types within one pyramid. Mixed-type KLs fail the MECE test.

**Hub map format:**
```
[ILLUMINATE:HUBS]
Nodes: <N total> | Orphans: <N signal> <N noise>
─────────────────────────────────────────────────────────
Hub candidates (ranked by connections):
  [<concept>]  total:<N>  (supports:<N>, depends:<N>, contradicts:<N>)

Clusters:
  C1 [<concepts>] — theme: <label>

Issue tree root: "Why is [candidate GT] true?"
  Sub-Q1: <question> → maps to KL candidate: <title> → S-NNN: <list>
  Sub-Q2: <question> → maps to KL candidate: <title> → S-NNN: <list>
  Sub-Q3: <question> → maps to KL candidate: <title> → S-NNN: <list>

MECE grouping type: <process / structure / situation>

Downstream check:
  <hub>: read <file(s)> → signal updated / no change
[/ILLUMINATE:HUBS]
```

Write to disk:
Use the Write tool to save the hub/issue-tree block above to `/tmp/illuminate-hubs.md`.

```
[ILLUMINATE:GATE] Phase 2 PASS | Anchor: /tmp/illuminate-hubs.md
Hubs: <N> | Issue tree: <N> sub-questions | MECE type: <type> | Downstream files: <N>
```

---

## Phase 3 — Barbara Minto Pyramid

Build the Minto Pyramid using SCQA. The pyramid is not a template — it is a claim about the
logical structure of the source. Every element must earn its place.

**SCQA quality tests (run before writing the anchor):**

**Situation (S):**
What does the reader already know or accept as stable context?
Test: "Would the reader nod at this without needing to think?" If not — it's not a Situation,
it's part of the Complication. Revise.
The Situation must NOT hint at the answer. It is neutral ground.

**Complication (C):**
What changes, disrupts, or challenges the Situation?
Test: "Does the Complication follow FROM the Situation, not alongside it?"
Test: "Is the Complication resolvable within the Situation alone?" If yes — it's not a
Complication, it's an elaboration. Revise. The Complication must create genuine tension.

**Question (Q):**
What does the reader now need to know or decide?
Test: "Does this Q emerge inevitably from S+C, or would a different reader ask a different Q?"
If the Q feels arbitrary, the S→C→Q chain is broken. Fix the chain, not the Q.
The Q must be a single sentence. It must be answerable by the Governing Thought.

**Governing Thought (A) — the peak:**
The direct, specific answer to Q. Not a hedge. Not a restatement of Q. Not a category.
Test: "Does this GT directly resolve the tension created by S+C?"
Test: "Could this GT be wrong? If not — it's a tautology, not a GT."
Test: "Is this GT the shortest path from Q to closure?" If a simpler GT is available and
equally well-supported, use the simpler one.
The GT must emerge from the top hub in the concept map. If it does not, the hub map is wrong.

**Key Lines — the MECE layer:**

Each KL must satisfy three tests:
1. **Necessity test** ("Why so?"): does the KL's supporting evidence actually prove it?
   Read the S-NNN entries. If they support a different, weaker claim: rewrite the KL.
2. **Sufficiency test**: do all KLs together make the GT inarguable? If a skeptic could say
   "I accept all your KLs and still doubt your GT" — a KL is missing.
3. **Independence test**: if one KL were removed, would the GT become unprovable?
   If removing a KL leaves the GT unchanged — the KL is not needed. Remove it.

MECE completeness:
- No two KLs overlap: "Could this evidence support KL2 as well as KL1?" If yes — restructure.
- Together they cover all GT sub-questions: run the issue tree's sub-questions against the KLs.
  Every sub-question must map to exactly one KL.

Signal-orphan placement:
Every `signal-orphan` from Phase 2 must appear as supporting detail in exactly one KL.
If a signal-orphan fits no KL: is a KL missing? If so, add it. If the orphan is genuinely
tangential, reclassify as `noise-orphan` and record why.

Pyramid rules:
- **The caps limit the visible spine, never the total content.** 3–5 key lines and ≤2 levels to
  reach evidence bound what is *simultaneously visible* — for cognitive load — not how much reasoning
  the artifact holds. The reasoning, caveats, and supporting detail behind each KL are elaborated to
  the complexity of the source and carried in the progressive-disclosure layers. Depth is deferred,
  not deleted.
- 3–5 key lines maximum on the spine. 5 is usually too many — prefer 3–4, each with **rich, fully
  elaborated** supporting detail (real prose and caveats, not a headline and a chip).
- Supporting detail: specific, evidence-bearing S-NNN entries — never assertions. Elaborate them;
  do not compress a load-bearing nuance down to a label to make it fit.
- Every supporting detail carries its S-NNN trace explicitly.
- Depth maximum: 2 levels of *interaction* to reach evidence (B9 / NN/g). This caps taps, not
  richness — the layers behind those two taps hold as much elaborated content as the source demands.
- **Over-condensation that drops a load-bearing nuance is a fidelity violation**, on par with
  fabrication. Where the source is irreducibly complex, present it as such; never force false
  simplicity into a skeleton of headlines.
- INSIGHT entries (from Phase 1) must appear as supporting detail. Insights drive retention.

**Pyramid anchor format:**
Write to `/tmp/illuminate-anchor.md` using the Write tool:
```
# GT: <exact governing thought>
# S:  <situation>
# C:  <complication>
# Q:  <question>
# MECE-type: <process / structure / situation>
# KL1: <title> — MECE role: <what dimension of GT does this cover?>
# KL2: <title> — MECE role: ...
# ...
# Signal-orphans placed: <list with KL assignment>
# Signal-orphans reclassified noise: <list with reason>
```

Emit:
```
[ILLUMINATE:PYRAMID]
GT: <governing thought>
S:  <situation>
C:  <complication>
Q:  <question>
MECE type: <type>
─────────────────────────────────────────────────────────────
KL1  <title>                                    [S-002, S-007]
  KL1-a  <supporting detail — INSIGHT>          [S-002]
  KL1-b  <supporting detail>                    [S-007]
KL2  <title>                                    [S-003, S-012]
  ...
MECE check: KL1∩KL2=∅ · KL1∩KL3=∅ · KL2∩KL3=∅ · ∪KLs = all GT sub-questions
[/ILLUMINATE:PYRAMID]
```

```
[ILLUMINATE:GATE] Phase 3 PASS | Anchor: /tmp/illuminate-anchor.md | GT confirmed | KL: <N>
MECE: <N> orphans placed, <N> reclassified noise | SCQA: all 4 tests pass
```

---

## Phase 4 — Adversarial Audit

Two passes. Pass A is coherence. Pass B is the 3-skeptic procedure.

**Pass A — 10-check coherence:**

| Check | Question | Pass condition |
|---|---|---|
| GT grounded | GT traceable to top hub from Phase 2? | Yes |
| GT specificity | GT directly resolves Q, not just relates to it? | Yes |
| KL necessity | Each KL's evidence proves IT, not just the GT generally? | All pass |
| KL sufficiency | All KLs together make GT inarguable? | Yes |
| KL independence | Each KL's removal would weaken the GT? | All pass |
| MECE | KLs don't overlap AND cover all GT sub-questions? | Both conditions |
| S→C chain | Situation leads inevitably to Complication? | Yes |
| C→Q chain | Complication raises this specific Question? | Yes |
| Q→A chain | Governing Thought directly resolves the Question? | Yes |
| Source fidelity | Any pyramid claim lacks an S-NNN trace? | None |

**Pass B — 3-skeptic procedure:**

Each skeptic has one attack mode. Generic approval ("looks good") is not valid output.
A skeptic that finds no failure must say: "No failure found for [KL-title] on [attack mode]."

**Skeptic A — logical attack** (for each KL individually):
> "Construct a scenario where every S-NNN entry cited by this KL is true, but the KL claim
>  is false. Name the scenario. Does it exist?"
- Rebuttal must cite specific S-NNN entries that block the scenario.
- No rebuttal → KL revised or demoted to supporting detail.

**Skeptic B — evidential attack** (for each KL):
> "Read each cited S-NNN entry verbatim. Does the KL paraphrase, generalize, or expand what
>  the entry actually states? Or does it say what the entry says?"
- Paraphrase drift = evidence-discipline violation → rewrite KL to match actual entry text.
- Find a stronger S-NNN entry, or hedge.

**Skeptic C — completeness attack** (on the full pyramid):
> "What major hub or cluster from Phase 2 is not represented in any KL? What GAP entries
>  from Angle 3 are not addressed or named as deliberate exclusions? What ASSUMPTION entries
>  were carried forward unchallenged?"
- Each identified gap: add KL or name as deliberate exclusion with reason.
- GAP entries never addressed are either missing KLs or silent omissions. Name both.

After Pass B: any skeptic argument without rebuttal → fix the pyramid and re-run both passes.

```
[ILLUMINATE:GATE] Phase 4 PASS | Pass A: 10/10
Pass B Skeptic A: <N> KLs challenged, <N> rebutted, <N> revised
Pass B Skeptic B: <N> entries checked, <N> drift cases fixed
Pass B Skeptic C: <N> gaps assessed, <N> new KLs or named exclusions
```

---

# STAGE III — OUTPUT

*Goal: a self-contained HTML artifact that makes the pyramid's argument structure viscerally
legible — not just readable — through every technique modern browsers support.*

The Output stage has two phases: visual architecture (design the experience before building
it) and frontend engineering (build it to the highest standard). The frameworks are the
invisible skeleton. The experience is what the reader feels, not what they are told.

---

## Phase 5 — Visual Architecture

Design before building. Write a text wireframe first. Every visual decision must serve
a specific function in making the pyramid's argument structure legible.

**The three frameworks made visual — translation table:**

| Framework | What it encodes | Visual enactment | What NOT to do |
|---|---|---|---|
| SCQA | Narrative tension arc: setup → disruption → question → resolution | S+C: smaller type, moderate contrast, "preamble" register. Q: visual break — different weight, layout shift, creates "so what" moment. A (GT): maximum dominance — oversized, highest contrast, gradient text, the reader cannot miss it. Reader *feels* the resolution before they read it. | Label blocks "Situation", "Complication", etc. |
| Minto Pyramid | Logical hierarchy: GT > KLs > detail | GT: most visually prominent element on the page. KLs: identical visual weight (MECE enacted visually). Detail: smaller, behind progressive disclosure. Scale = logical authority. | Show all hierarchy levels at once |
| MECE | Exhaustive, non-overlapping coverage | KL sections structurally identical (same anatomy, same typographic weight, same card structure). Visual equality = logical equality. | Give KLs different visual weights or colors |

**Components enact the pyramid — the governing rule for what to build where.**

The pyramid is a top-down drill: GT → Key Lines → supporting detail → evidence. Progressive-
disclosure components are that drill rendered as navigation. Static prose forces one linear path
through a non-linear structure; disclosure components let the structure stay a structure and let
the reader descend exactly the branch they choose, in the order the pyramid ordains. **This is
why the components aid comprehension rather than decorate — so choose each one by the pyramid
layer it serves, never for flair.**

| Pyramid layer | Reader's move | Component | Disclosure state |
|---|---|---|---|
| **Governing Thought** | receives the answer | hero pull-quote, oversized, dominant | always visible — top of pyramid, unmissable |
| **Key Lines (MECE)** | scans the whole structure | section headers at equal weight **+ one overview component** showing all KLs at once (e.g. a diagram/ladder/matrix) | always visible — the second tier as a single map |
| **Supporting detail** | drills into one KL | `Accordion` / `Tabs` | collapsed by default; expands the chosen branch |
| **Evidence (S-NNN)** | verifies a claim | `Tooltip` (hover preview) → `Sheet`/`Dialog` (full block, filterable) | deepest layer; summoned on demand |

Corollaries:
- **Ordain, don't compress.** The pyramid organizes richness into a navigable order; it is not a
  compression pass. The salience gate (Phase 1a) removes *noise* — restatement, generic-true filler —
  but everything that survives gets its **full** treatment: real explanatory prose at each level, drilled
  into, not shrunk to fragments or bullet stubs. A lede is two honest paragraphs that reason from the
  claim into the mechanism, not a one-line label. Terse output is a failure mode, not the goal — the
  reader came to *understand* a complex thing, and understanding needs the substance, well-ordered.
- **Depth = disclosure.** The deeper the pyramid layer, the more hidden-until-asked it is. Never
  show evidence detail at the same altitude as a Key Line — it flattens the hierarchy the pyramid
  worked to build.
- **One overview component per artifact** materialises the whole second tier at a glance (the KLs
  and their relationship). It is the single most load-bearing illustration; spend the animation budget here.
- **Match the component to the content, not a template.** A KL whose mechanism is code gets a code
  block; a KL that turns on a single admission gets a callout; a KL that is a flow gets a diagram.
  Do not stamp the identical widget kit onto every section — that is decoration, and the reader feels it.
  *This does not violate MECE.* MECE equality lives in the **shell**: every KL keeps the same altitude,
  header weight, section frame, and disclosure pattern (so no KL reads as more important than a peer).
  The **supporting artifact inside** the shell varies by what that KL's content actually is. Equal frames,
  content-fitted contents.

**Component inventory (mandatory; build all of these):**

**Hero components:**
1. `SCQA-ARC` — four-block narrative structure. S+C in setup register. Q in tension register
   (visually distinct: border-left, different weight, or isolated column). A (GT) as pull quote.
2. `GT-PULLQUOTE` — oversized gradient text, typewriter assembly on load. This is the first
   thing the eye lands on after the page settles.
3. `PIPELINE-DIAGRAM` — multi-line ASCII art that visualizes the key quantitative claim from
   the source (if present). Builds character by character after GT completes. Not decorative:
   this is the "evidence anchor" for the GT.
4. `PROGRESS-ARC` — reading progress indicator, right-fixed, thin vertical track + dot. Shows
   position in argument, not just scroll position. Updates with active section.

**Section components (one per KL, all identical in structure — MECE enacted):**
5. `SECTION-MOTIF` — multi-line ASCII art (6–14 lines) specific to this KL's argument.
   Thematically loaded, not decorative. Builds before section title appears.
6. `SECTION-HEADER` — KL number (tiny, monospace) + title (argument statement, not label) +
   optional signal-strength indicator (count of S-NNN entries supporting this KL).
7. `SECTION-LEDE` — standalone argument paragraph. Comprehensible without reading other sections.
8. `INLINE-VISUAL` — at least one visualization per KL. Four illustration tiers:

   **ASCII (default):** illuminate signature; zero-weight; theme-aware. Technical/architectural sources; CLI content; code-adjacent arguments.
   **Inline SVG:** concept diagrams, flow charts, argument maps, architecture. Use `currentColor` + CSS token vars — no hardcoded colors.
   **CSS illustration:** abstract/geometric argument structure; before/after; spectrums. Zero-weight; token-aware.
   **Data viz:** quantitative KLs with METRIC entries (≥3 data points). Hand-authored inline SVG (bars/lines/scatter with token vars) is the self-contained default — no chart-lib CDN. Only in a React/claude.ai artifact target may you use a bundled lib (Recharts/Observable Plot).

   ASCII is the default. Elect SVG/CSS/DataViz when ASCII cannot carry the argument with sufficient precision:
   | KL argument type | Preferred visualization |
   |---|---|
   | Sequential process / pipeline | ASCII flow OR SVG flowchart |
   | Before/after / reversal (INSIGHT) | CSS split-panel OR SVG before/after |
   | Quantitative comparison | `█▓░` bars (≤4 items) OR D3/Chart.js (≥5 items) |
   | System architecture | SVG box-drawing with hover highlights |
   | Chain / linked structure | SVG/CSS node-link diagram |
   | Binary classification | ASCII grid OR CSS dot matrix |
9. `ACCORDION-CARDS` — progressive disclosure. Each card: scan-line open animation,
   nested sub-sections, evidence tags (`S-NNN`), code snippets where relevant.

**Navigation:**
10. `STICKY-NAV` — KL argument titles (not numbers). Active section highlighted.
    Scroll-spy via IntersectionObserver. Keyboard navigable (j/k).
11. `DEPTH-INDICATOR` — shows current position in pyramid (GT → KLn → sub-detail).
    Updates as user navigates expand states.

**Controls (always visible, never intrusive):**
12. `THEME-TOGGLE` — dark/light switch in sticky nav. Symbol: `◑` (dark) / `◐` (light).
    Defaults to system preference (`prefers-color-scheme`). Manual choice persists in
    `localStorage`. Applies via `[data-theme="dark|light"]` on `<html>`. Smooth surface
    transition (background/border only — no text transition flash).
13. `TIER-SELECTOR` — render complexity selector in sticky nav: three inline buttons
    `s · e · r` (simple / editorial / rich). Defaults to `editorial`. Persists in `localStorage`.
    Applies via `[data-tier="simple|editorial|rich"]` on `<html>`. Active button highlighted
    in editorial red. Controls which features activate — see Render Tier Architecture.
14. `PALETTE-PICKER` — compact palette selector in sticky nav. A small colored swatch circle
    (◉) shows the active palette; click opens a 6-swatch popover. Selected palette name
    written to `[data-palette]` on `<html>`. Persists in `localStorage`. Works orthogonally
    with `data-tier` and `data-theme` — any combination is valid. See Palette System.

**Wireframe format (required; confirm against pyramid before building):**
```
HERO
  [GT-PULLQUOTE] <governing thought text>
  [SCQA-ARC]
    S: <situation, setup register>
    C: <complication, setup register>
    Q: <question, tension register>
  [PIPELINE-DIAGRAM] <key quantitative evidence for GT>
  [PROGRESS-ARC] (fixed right)

SECTIONS (one per KL, identical anatomy)
  [SECTION-MOTIF] <multi-line ASCII, thematically loaded>
  [SECTION-HEADER] §N · <KL title as argument statement>
  [SECTION-LEDE] <standalone paragraph>
  [INLINE-VISUAL] <specific visualization type: bar / grid / chain / tree>
  [ACCORDION-CARDS]
    Card 1: <title> [S-NNN, S-NNN]
    Card 2: <title> [S-NNN]
    ...

NAVIGATION
  [STICKY-NAV] GT → KL1 / KL2 / KL3 / ...
  [DEPTH-INDICATOR]
  [THEME-TOGGLE] ◑/◐ — right-aligned in nav
  [TIER-SELECTOR] s · e · r — right-aligned in nav, beside theme toggle
  [PALETTE-PICKER] ◉ — swatch button right of tier selector; opens palette popover
```

Confirm wireframe maps to pyramid exactly. Each KL = one section. No section without a KL.
No KL without a section.

**doc mode wireframe** (when Mode = doc):
```
[DATELINE]    monospace · /illuminate · source · date
[GT-BLOCK]    Helvetica Neue 300, 2.5rem, uppercase — fades in (NOT scrambled); 72ch, text-wrap:balance
[SCQA-STACK]  Linear four-block: S → C → Q → GT as pull-quote (72ch col)
[TOC-RAIL]    Sticky left rail ≥900px; KL titles; scroll-spy (Radix ScrollArea)
[KL-SECTION ×N]
  rule           2px --ink border-bottom
  header         KL number (Futura micro caps, --red) · KL title (Futura 700)
  lede           72ch max; Helvetica Neue; text-wrap:pretty — standalone argument
  illustration   ASCII / SVG / CSS / DataViz elected per KL type; no parallax
  evidence       Radix Table: S-NNN | Claim | Tag | Confidence
  accordion      Radix Accordion: detail cards; evidence chips (Radix Tooltip)
[FOOTER]      Pool size · generation date · anchor paths
```
Evidence inline (not slide-in drawer). Motion: `@starting-style` entry only. Keyboard: j/k section nav, s signal, f focus.

**deck mode wireframe** (when Mode = deck):
```html
<main class="deck" data-mode="deck">
  <section class="slide" id="slide-gt">   <!-- GT hero -->
    [GT-PULLQUOTE]  typewriter (editorial/rich) OR fade (simple)
    [SCQA-ROW]      S / C / Q / A as 4 horizontal columns
    [PIPELINE-VIZ]  ASCII OR SVG — key quantitative anchor
  </section>
  <section class="slide" id="slide-klN">  <!-- one per KL -->
    [SLIDE-NUM]     top-right · Futura micro caps · --ink-3
    [KL-MOTIF]      ASCII 4-6 lines OR compact SVG · builds on slide enter
    [KL-TITLE]      Futura 700 · left-aligned (NOT centered) · max 2 lines
    [KEY-CLAIM]     Helvetica Neue 300 · 2-3 lines max
    [EVIDENCE-ROW]  3 S-NNN chips (Radix Tooltip; speaker notes on n)
    [CONFIDENCE]    █▓░ bar · bottom-right
  </section>
</main>
```
CSS: `.slide { aspect-ratio: 16/9; overflow: hidden; }` — overflow = gate failure (argument too long → shorten → re-run Phase 3).
Keyboard: → / ← slide; f fullscreen; n speaker notes; Esc close notes.
Motion: `clip-path: inset(0 0 0 100%)` → `inset(0)` with `--ease-drawer` 200ms on slide enter; motif builds after.
Print: `@media print { .slide { page-break-after: always; aspect-ratio: unset; } }` — strips controls, removes animation.

---

### Swiss Editorial Design Standard (mandatory)

Every illuminate artifact is built to the Swiss International Typographic Style — the design
tradition of Müller-Brockmann and Helmut Schmid. Structure is visible. Type carries the
argument. Every visual element earns its presence by serving the logical hierarchy.

**Typography stack:**
```
--hn:   'Helvetica Neue', Helvetica, Arial, sans-serif
--ft:   Futura, 'Century Gothic', 'Trebuchet MS', var(--hn)
--mono: 'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace
```

- **GT / hero body** — Helvetica Neue 300 (ultra-light), uppercase, tracking −0.04em,
  `clamp(2rem, 4vw, 3.5rem)`. The lightest weight creates maximum contrast with section titles.
- **Section titles / labels** — Futura 700, all caps, tracking −0.02em to 0.2em depending on
  size. Futura is the geometric Swiss counterpoint to Helvetica's neutral grotesque.
- **Evidence / CLI / motifs** — monospace only, terminal green (`#00ff88`), 0.7–0.8rem,
  `text-shadow: 0 0 12px rgba(0,255,136,.18)` glow. Evidence is a different material.

**12-column Swiss grid:**
```css
.g12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(12px, 1.5vw, 20px);
}
/* Hero: GT takes cols 1–8, SCQA panel takes cols 9–12 */
/* Sections: motif + data vizes take 5fr, lede + cards take 7fr */
```

Visible column overlay in the hero section:
```css
.grid-bg {
  position: absolute; inset: 0; pointer-events: none;
  background-image: repeating-linear-gradient(90deg,
    rgba(255,255,255,.05) 0, rgba(255,255,255,.05) 1px,
    transparent 1px, transparent calc(100% / 12));
}
```

**Color system — dual-mode, function-named:**

Colour names a semantic function, never a visual preference. The same token
`--cli` is `#00ff88` in dark and `#006e38` in light — same function, different
value. Never hand-mix alphas; use the pre-computed `-dim` companion tokens.

| Token | Dark | Light | Function |
|---|---|---|---|
| `--paper` | `#070708` | `#f5f4f0` | page canvas |
| `--paper-1` | `#0f0f11` | `#eeede8` | card ground |
| `--paper-2` | `#171719` | `#e4e3de` | raised surface |
| `--ink` | `#f0f0ee` | `#1c1c1a` | primary text |
| `--ink-2` | `#888886` | `#56564f` | body / secondary text |
| `--ink-3` | `#404040` | `#9a9a92` | labels / rules |
| `--rule` | `rgba(240,240,238,.06)` | `rgba(28,28,26,.07)` | structural hairlines |
| `--rule-hi` | `rgba(240,240,238,.14)` | `rgba(28,28,26,.16)` | section borders |
| `--red` | `#ff1e1e` | `#c8190e` | editorial accent / KL numbers |
| `--cli` | `#00ff88` | `#006e38` | evidence / ASCII only — never decorative |
| `--blue` | `#3d9eff` | `#1457a0` | data / metrics only |
| `--amber` | `#ffaa00` | `#8a5e00` | contested / hedge signal |

Light-mode values are not simply inverted — they are re-chosen for WCAG AA
contrast on the warm-cream ground (`#f5f4f0`). In particular: `--cli` shifts
from neon green to deep forest green; `--red` deepens to maintain contrast.
Never use `#00ff88` (neon terminal green) on a light background — it fails
contrast tests and breaks the editorial register.

The `[data-theme]` attribute on `<html>` controls the active palette (see CSS
Architecture). The `@media(prefers-color-scheme)` media query is the fallback
when no manual preference is stored.

**Ghost section numbers:**
```css
.ghost {
  position: absolute; right: var(--pad); top: 1.5rem;
  font-family: var(--ft); font-size: clamp(7rem, 20vw, 16rem);
  font-weight: 700; letter-spacing: -.05em;
  color: rgba(240,240,238,.022);
  line-height: 1; pointer-events: none; user-select: none;
  transition: color .8s;
}
.kl:hover .ghost { color: rgba(240,240,238,.04) }
```
Large ghost numbers (01/02/03) in Futura at ~20vw. Barely visible at rest, intensify on
section hover. This is the Swiss editorial convention of using numbers as structural elements.

**Section header rule:**
```css
.kl-hd {
  display: flex; align-items: baseline; gap: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 2px solid var(--ink);  /* thick rule = logical authority */
}
.kl-tag {
  font-family: var(--ft); font-size: .68rem;
  font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
  color: var(--red);  /* editorial red for KL number only */
}
.kl-title {
  font-family: var(--ft); font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 700; letter-spacing: -.02em; text-transform: uppercase;
}
```

**Custom cursor (editorial dot):**
```css
#cur {
  position: fixed; width: 6px; height: 6px; border-radius: 50%;
  background: var(--red); pointer-events: none; z-index: 9000;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
  transition: width .18s, height .18s, background .18s;
}
#cur.big { width: 28px; height: 28px; background: var(--ink) }
#cur.cli-mode { background: var(--cli) }  /* green over motif/CLI content */
```
`mix-blend-mode: difference` inverts the cursor color against whatever is beneath it —
making it always visible regardless of background. Cursor enlarges on interactive elements,
turns terminal green over ASCII/evidence content.

**Progress stripe — anchored to nav bottom edge:**
```css
#nav { position: sticky; top: 0 }  /* nav is the positioning parent */
#prog {
  position: absolute; bottom: 0; left: 0; height: 2px; z-index: 1;
  background: var(--red); width: 0%;
  box-shadow: 0 0 8px var(--red), 0 0 2px var(--red);
  transition: width .1s linear;
}
```
The stripe sits at the bottom of the sticky nav bar — always visible, never competing with
content. The red glow makes it legible at 2px. Never use `position:fixed` for the stripe —
it will collide with the nav background at the same `top:0` position.

**Newspaper dateline:**
```html
<div class="hero-dateline">
  /illuminate<span> · </span>source-name<span> · </span>date
</div>
```
```css
.hero-dateline {
  font-family: var(--mono); font-size: .68rem;
  color: var(--ink-3); letter-spacing: .12em; text-transform: uppercase;
  display: flex; align-items: center; gap: 1.5rem;
}
.hero-dateline span { color: var(--red) }
.hero-dateline::after { content: ''; flex: 1; height: 1px; background: var(--rule-hi); max-width: 200px }
```

**GT reveal — answer-first, calm assembly:**
The GT is the first element built, not the SCQA. Editorial convention: answer leads.
Assembly is a quiet typewriter (editorial/rich) or a plain fade (simple) — never a scramble.
```javascript
// Sequence: GT types (or fades) → on complete → SCQA slides in → pipeline builds
revealGT(gtEl, GT_TEXT, () => {   // see GT Reveal section — typewriter / fade only
  scqaEl.classList.add('in');
  buildPipeline();
});
```
GT CSS: `font-weight: 300` (ultra-light Helvetica), uppercase, gradient applies as `.done`
class on completion. Ultra-light at large size carries the editorial tension — the reveal
stays calm; the *type*, not motion, does the work.

```
[ILLUMINATE:GATE] Phase 5 PASS | Wireframe confirmed | KLs: <N> | Components: 14
                                | Editorial: Swiss grid · Helvetica Neue + Futura · editorial red
                                | Theme: dark+light | Tiers: simple/editorial/rich declared
```

---

## The Component Library — Argument-Enacting Components

*(Informs Phase 5 selection and Phase 6 implementation.)*

A KL's INLINE-VISUAL slot (or any supporting card) may be filled by a component from this library.
A component is chosen because it **enacts a specific KL argument type** — never for decoration, never
repeated across sections (the existing "one visualization type per KL" rule extends to components).

Three jobs these components do that prose and ASCII can't (and a fourth):
- **Make the abstract concrete** — you see the actual email / screen / message (fidelity mockups).
- **Make a process navigable** — you follow the journey / lifecycle / decision (process & flow).
- **Make a number felt** — you sense the drop-off / magnitude / rate (metrics & funnels).
- **Make a choice legible** — decision & compare.

Every component obeys **four laws**:
1. **Self-contained** — HTML/CSS/SVG/JS only, no external images. Device chrome, charts, phone
   frames, and flow edges are drawn in CSS/SVG. This is what keeps the artifact one offline file.
2. **Palette-tokened** — colors are `var(--…)` only (`--paper*`, `--ink*`, `--rule*`, `--red`,
   `--cli`, `--blue`, `--amber`, or whatever the active palette defines). No component hard-codes a hex.
3. **Tier-degradable** — rich = animated + interactive; balanced/editorial = interactive but lean;
   simple = static and fully legible. Use the existing `isRich()` / `isEditorialUp()` helpers.
4. **Evidence-governed** — an ILLUSTRATE surface (see the contract). Concrete content traces to
   S-NNN or is visibly generic; the component wears its ILLUSTRATION tag or its citation chips.

### Family A — Fidelity Mockups (make the abstract concrete)

Self-contained replicas of the actual artifact, inside recognizable chrome. Evidence class:
ILLUSTRATE (all). Content bounded by the signal block; carries the ILLUSTRATION tag.

| Component | Enacts | Notes |
|---|---|---|
| `EMAIL-CLIENT` | "here is the email/message the campaign sends" | mail shell: from / subject / preheader / timestamp + rendered body |
| `PHONE-PUSH` | "here is the push notification, on a lock screen" | phone frame + status bar + notification card |
| `SMS-THREAD` | "here is the SMS, in a real thread" | chat bubbles with sender + timestamp |
| `BROWSER-PAGE` | "here is the landing page / CloudPage" | address bar + tab chrome wrapping a page mock |
| `APP-UI` | "here is the screen the user configures this in" | generic app window: sidebar + toolbar + canvas |
| `DATA-DASHBOARD` | "here is what the report screen looks like" | tiles + a chart; numbers must trace or be `00.0%` |
| `CODE-CONFIG` | "here is the config / snippet / query" | editor/terminal chrome, monospace, line numbers |

**Reference — EMAIL-CLIENT:**
```html
<figure class="mock mock-email">
  <div class="mock-bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i>
    <span class="mock-bar-t">Inbox — Marketing</span></div>
  <header class="em-hd">
    <div class="em-av">AC</div>
    <div class="em-meta">
      <div class="em-from">Acme Campaigns <span>&lt;news@acme.com&gt;</span></div>
      <div class="em-subj">Your July offer is inside
        <button class="cite" data-cite="S-014">S-014</button></div>
      <div class="em-pre">Preheader copy exactly as the source specifies…</div>
    </div>
    <time class="em-time">09:24</time>
  </header>
  <div class="em-body"><!-- rendered email HTML; every string ∈ signal block --></div>
  <span class="mock-tag">ILLUSTRATION · not a live send</span>
</figure>
```
```css
.mock { position: relative; border: 1px solid var(--rule-hi); border-radius: 8px;
  background: var(--paper-1); overflow: hidden; }
.mock-bar { display:flex; align-items:center; gap:6px; padding:8px 12px;
  background: var(--paper-2); border-bottom: 1px solid var(--rule); }
.mock-bar .dot { width:9px; height:9px; border-radius:50%; background: var(--ink-3); opacity:.5; }
.mock-bar-t { font-family: var(--mono); font-size:.66rem; color: var(--ink-3);
  letter-spacing:.08em; margin-left:8px; }
.em-hd { display:flex; gap:12px; padding:14px 16px; border-bottom:1px solid var(--rule); }
.em-av { width:38px; height:38px; border-radius:50%; background: var(--red-dim);
  color: var(--red); font-family:var(--ft); font-weight:700; display:grid; place-items:center; }
.em-from { font-size:.82rem; color: var(--ink); } .em-from span { color: var(--ink-3); }
.em-subj { font-size:.9rem; font-weight:600; color: var(--ink); margin-top:2px; }
.em-pre { font-size:.78rem; color: var(--ink-2); margin-top:2px; }
.em-time { font-family:var(--mono); font-size:.66rem; color: var(--ink-3); margin-left:auto; }
.em-body { padding:18px 16px; font-size:.86rem; line-height:1.5; color: var(--ink-2); }
.mock-tag { position:absolute; bottom:8px; right:10px; font-family:var(--mono); font-size:.6rem;
  letter-spacing:.1em; text-transform:uppercase; color: var(--amber);
  background: var(--amber-dim); padding:2px 7px; border-radius:4px; }
/* rich: subtle tilt on hover — depth, not decoration */
[data-tier="rich"] .mock { transition: transform var(--dur) var(--ease); transform-style:preserve-3d; }
[data-tier="rich"] .mock:hover { transform: perspective(1200px) rotateX(2deg) rotateY(-2deg); }
```

**Reference — PHONE-PUSH + SMS-THREAD (one phone frame):**
```html
<figure class="mock mock-phone">
  <div class="ph-frame">
    <div class="ph-status"><span>9:41</span><span class="ph-sig">▮▮▮ ◗</span></div>
    <div class="push">
      <div class="push-app"><i class="dot"></i> ACME · now</div>
      <div class="push-t">Flash sale ends tonight</div>
      <div class="push-b">Tap to see your offer <button class="cite" data-cite="S-019">S-019</button></div>
    </div>
    <div class="sms"><div class="sms-b in">Your code: <b>SAVE20</b>
      <button class="cite" data-cite="S-021">S-021</button></div></div>
  </div>
  <span class="mock-tag">ILLUSTRATION</span>
</figure>
```
```css
.ph-frame { width:230px; margin:0 auto; border:9px solid var(--paper-2); border-radius:34px;
  background: var(--paper); padding:10px; min-height:340px; }
.ph-status { display:flex; justify-content:space-between; font-family:var(--mono);
  font-size:.6rem; color: var(--ink-3); padding:2px 8px 10px; }
.push, .sms-b { background: var(--paper-1); border:1px solid var(--rule); border-radius:14px;
  padding:10px 12px; }
.push-app { font-family:var(--mono); font-size:.6rem; color: var(--ink-3); text-transform:uppercase;
  letter-spacing:.08em; display:flex; align-items:center; gap:5px; }
.push-app .dot { width:8px; height:8px; border-radius:2px; background: var(--red); }
.push-t { font-size:.82rem; font-weight:600; color: var(--ink); margin-top:5px; }
.push-b { font-size:.76rem; color: var(--ink-2); margin-top:2px; }
.sms { margin-top:14px; display:flex; }
.sms-b.in { background: var(--blue-dim); border-color: transparent; border-radius:14px 14px 14px 4px;
  font-size:.8rem; color: var(--ink); max-width:80%; }
/* rich: push slides in on reveal */
[data-tier="rich"] .push { animation: pushIn .5s var(--spring) both; }
@keyframes pushIn { from { opacity:0; transform: translateY(-10px) scale(.96); } }
```

`BROWSER-PAGE`, `APP-UI`, `CODE-CONFIG` follow the same pattern: a `.mock-bar` chrome (address bar
with a favicon + URL for browser; sidebar/toolbar for app; traffic-lights + filename for code), a
tokened body, and the ILLUSTRATION tag. `DATA-DASHBOARD` composes `KPI-TILE-ROW` (Family C) inside
a `.mock` shell — and inherits Family C's hard rule that numbers trace or render as `00.0%`.

### Family B — Process & Flow (make a process navigable)

For arguments that are sequences, lifecycles, or branching decisions ("how to manage X").
Evidence class: the structure depicts the source's described process; each node label traces to an
S-NNN. Edges are SVG paths between node anchors.

| Component | Enacts |
|---|---|
| `FLOW-CANVAS` | a journey / pipeline as nodes + directed edges (e.g. SFMC Journey Builder) |
| `SWIMLANE` | a process split across actors/systems (rows = lanes, left→right = time) |
| `SEQUENCE` | ordered message-passing between participants (vertical lifelines) |
| `STATE-MACHINE` | states + labelled transitions (lifecycle / status models) |
| `STEP-WIZARD` | a numbered, linear setup path with the current step highlighted |
| `DECISION-TREE` | branching yes/no logic to an outcome |
| `TIMELINE / GANTT` | events or workstreams along a time axis |

**Reference — FLOW-CANVAS (anatomy):**
```html
<figure class="flow">
  <svg class="flow-edges" preserveAspectRatio="none"><!-- <path> per edge, drawn between
       node centers; class .edge, stroke var(--rule-hi) --></svg>
  <div class="flow-node" data-node="entry">Entry · List join <button class="cite" data-cite="S-030">S-030</button></div>
  <div class="flow-node" data-node="wait">Wait 1 day</div>
  <div class="flow-node flow-dec" data-node="dec">Opened? <span class="yn">✓ / ✗</span></div>
  <div class="flow-node" data-node="send">Send follow-up</div>
  <span class="mock-tag">ILLUSTRATION</span>
</figure>
```
Nodes are absolutely-positioned (or CSS-grid placed) `.flow-node` boxes: `border:1px solid var(--rule-hi)`,
`background: var(--paper-1)`, `font-family: var(--ft)` label. Edges: one `<path>` per connection,
`stroke: var(--rule-hi)`, arrowhead marker in `var(--ink-3)`.
- **rich:** on IntersectionObserver enter, each edge `stroke-dashoffset` animates full→0 (draws
  itself); hovering a node brightens its outgoing edges to `var(--cli)` and highlights the KL card
  citing that step.
- **balanced:** static edges, hover highlight only. **simple:** static, no hover.
- Decision nodes (`.flow-dec`) get a diamond accent via `border-left: 2px solid var(--amber)`.

`SWIMLANE` / `SEQUENCE` / `STATE-MACHINE` reuse the same node+SVG-edge engine with different layout
rules. `TIMELINE` is a horizontal axis (`--cli` hairline) with dot markers; `STEP-WIZARD` is a
numbered pill row with `.active` in `var(--red)`.

### Family C — Metrics & Funnels (make a number felt)

For arguments about magnitude, rate, or conversion ("how to measure X"). **This family is where
fabricated precision is most dangerous.** Evidence class: evidence-bearing when every number traces
to a `[METRIC]` S-NNN (then show citation chips, not the ILLUSTRATION tag); otherwise every value
renders as `00.0%` / `—` placeholder and the component wears the tag. **Never render a plausible-
looking number the source doesn't contain.**

| Component | Enacts |
|---|---|
| `FUNNEL` | drop-off across stages (sent → opened → clicked → converted) |
| `KPI-TILE-ROW` | a dashboard row of headline metrics |
| `COUNTER` | a single animated figure counting up to its value |
| `COHORT-GRID` | retention/behaviour across cohorts × periods (heat cells) |
| `GAUGE` | a single value against a target/range (arc or bar) |
| `SPARKLINE` | inline micro-trend |
| `WATERFALL` | additive/subtractive contributions to a total |

**Reference — FUNNEL:**
```html
<div class="funnel" role="img" aria-label="Conversion funnel">
  <div class="fn-row"><span class="fn-bar" style="--w:100%"></span>
    <span class="fn-lab">Sent</span><span class="fn-val" data-cite="S-030">100%</span></div>
  <div class="fn-row"><span class="fn-bar" style="--w:42%"></span>
    <span class="fn-lab">Opened</span><span class="fn-val" data-cite="S-031">42.0%</span></div>
  <div class="fn-row"><span class="fn-bar" style="--w:9%"></span>
    <span class="fn-lab">Clicked</span><span class="fn-val" data-cite="S-032">9.1%</span></div>
  <div class="fn-row"><span class="fn-bar" style="--w:2%"></span>
    <span class="fn-lab">Converted</span><span class="fn-val" data-cite="S-033">1.8%</span></div>
</div>
```
```css
.fn-row { display:flex; align-items:center; gap:12px; margin:6px 0; }
.fn-bar { height:26px; width:var(--w); background: var(--blue-dim);
  border-left:3px solid var(--blue); border-radius:2px; }
.fn-lab { font-family:var(--ft); font-size:.72rem; text-transform:uppercase;
  letter-spacing:.08em; color: var(--ink-2); width:90px; }
.fn-val { font-family:var(--mono); font-size:.8rem; color: var(--ink); }
/* rich/balanced: bars grow on scroll-in from width:0 → --w */
[data-tier="rich"] .fn-bar, [data-tier="balanced"] .fn-bar { width:0; transition: width .8s var(--ease); }
.funnel.in .fn-bar { width: var(--w); }   /* .in added by IntersectionObserver */
```

**Reference — KPI-TILE + animated COUNTER:**
```html
<div class="kpi-row">
  <div class="kpi"><span class="kpi-val" data-count="42.1">0</span><span class="kpi-u">%</span>
    <span class="kpi-lab">Open rate</span><button class="cite" data-cite="S-031">S-031</button></div>
  <div class="kpi"><span class="kpi-val" data-count="1.8">0</span><span class="kpi-u">%</span>
    <span class="kpi-lab">Conversion</span><button class="cite" data-cite="S-033">S-033</button></div>
</div>
```
```javascript
// COUNTER — tier + reduced-motion aware. simple/reduced: set final value instantly.
function runCounters(scope){
  scope.querySelectorAll('.kpi-val[data-count]').forEach(function(el){
    var target = parseFloat(el.dataset.count);
    if (R || !isEditorialUp()) { el.textContent = target; return; }   // R = reduced-motion
    var t0 = null, dur = 900;
    function step(ts){ t0 = t0 || ts; var p = Math.min((ts - t0)/dur, 1);
      el.textContent = (target * (0.5 - Math.cos(p*Math.PI)/2)).toFixed(1);
      if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  });
}
```
**Rule of this family:** if a value has no `[METRIC]` trace, the tile shows `—` or `00.0%`, the
`data-count` is omitted, and the row wears the ILLUSTRATION tag. A KPI without a source is a layout
placeholder, never a figure.

### Family D — Decision & Compare (make a choice legible)

For arguments that are a choice among options, a positioning, or a reversal. Evidence class: cell
contents / positions trace to S-NNN.

| Component | Enacts |
|---|---|
| `QUADRANT-2x2` | positioning on two axes (magic-quadrant style) |
| `COMPARE-MATRIX` | options × criteria, with pass/fail/degree cells |
| `BEFORE-AFTER` | an INSIGHT reversal (slider divider) — already in the skill; keep it |
| `SCORECARD` | one option scored across weighted criteria |
| `TRADEOFF-TABLE` | pros/cons or gains/costs, two-column |

**Reference — QUADRANT-2x2:**
```html
<div class="quad">
  <span class="quad-x">Reach →</span><span class="quad-y">Intent →</span>
  <i class="quad-h"></i><i class="quad-v"></i>
  <button class="quad-dot" style="--x:72%;--y:28%" data-cite="S-041">Email</button>
  <button class="quad-dot" style="--x:30%;--y:74%" data-cite="S-042">SMS</button>
</div>
```
```css
.quad { position:relative; aspect-ratio:1; border:1px solid var(--rule-hi); background: var(--paper-1); }
.quad-h, .quad-v { position:absolute; background: var(--rule); }
.quad-h { left:0; right:0; top:50%; height:1px; } .quad-v { top:0; bottom:0; left:50%; width:1px; }
.quad-x, .quad-y { position:absolute; font-family:var(--mono); font-size:.62rem; color: var(--ink-3);
  text-transform:uppercase; letter-spacing:.08em; }
.quad-x { bottom:6px; right:8px; } .quad-y { top:8px; left:6px; transform:rotate(-90deg); transform-origin:left; }
.quad-dot { position:absolute; left:var(--x); bottom:var(--y); transform:translate(-50%,50%);
  background: var(--red); color: var(--paper); font-family:var(--ft); font-size:.66rem;
  font-weight:700; border:none; border-radius:20px; padding:4px 10px; cursor:pointer; }
[data-tier="rich"] .quad-dot { animation: settle .6s var(--spring) both; }
@keyframes settle { from { opacity:0; transform:translate(-50%,50%) scale(.5); } }
```
`COMPARE-MATRIX` is a tokened table: sticky first column (options), header row (criteria), cells use
`✓ / ~ / ✗` glyphs colored `var(--cli)` / `var(--amber)` / `var(--ink-3)`, row hover raises to
`var(--paper-2)`. Reuse the existing "data grids, not flat text" guidance from INLINE-VISUAL.

### Also in this league (specs, no reference code — same four laws apply)

- **PARAMETER-PLAYGROUND** — a control (slider/select) that reconfigures a diagram or recomputes a
  number live. The strongest comprehension device there is; use when the source explains a mechanism
  (e.g. "send-time affects open rate"). All outputs must stay within source-stated ranges.
- **TABBED-SCENARIO** — one region, N labelled scenarios (e.g. "B2B journey" vs "B2C journey"); tabs
  swap the content. Enacts situation-type MECE groupings visually.
- **GLOSSARY-HOVER** — domain terms (`%%AMPscript%%`, "data extension") get a dotted underline; hover
  reveals a definition popover. Removes jargon friction without breaking the reading line.
- **SPOTLIGHT / GUIDED-TOUR** — step markers that dim everything but one region and advance on click;
  reuses the existing focus-mode dimming.
- **ARCHITECTURE-DIAGRAM (SVG)** — the box-drawing system diagram you already do in ASCII, as SVG with
  hover-highlighted components, for when the argument is structural.
- **ENTITY-RELATIONSHIP / LAYERED-STACK** — data-model or layer diagrams (L0→L4 style).
- **ANNOTATION-LAYER** — cross-cutting; see the annotation / hotspot system in Phase 6.

---

## Phase 6 — Frontend Engineering

Build the Phase 5 wireframe as a single self-contained HTML file, executing every technique
below at the highest standard. This is not a checklist to satisfy minimally — it is the
standard to exceed. Each technique serves the argument structure. Decoration is not the goal.

**Stance: polished editorial restraint.** Use whatever JS or CSS makes the argument more
legible — shadcn/ui components, Tailwind for layout, D3/Observable Plot for real data viz.
CDN delivery or a simple build step (Vite, esbuild) are both fine. Two constraints: don't
add abstraction that slows you down, and don't add motion or effect that doesn't aid
understanding. If vanilla is faster and equally expressive, use vanilla; if a library
saves time and sharpens the result, use it.

---

### shadcn/ui Component Vocabulary (mandatory — self-contained, no CDN)

**Design intent (why a website, not a slide):** these artifacts are read the way a consulting
client reads a complex topic — they *navigate and dig*, opening the facet they care about
rather than sitting through a linear deck. That only works if the components are genuinely
interactive: real tabs, real accordions, hover-preview evidence, a diagram↔code toggle. Static
boxes fail the brief. Build for exploration.

**Hard constraint:** the default output is a **portable single file** (email-able, offline,
opens forever). The artifact CSP and offline use both forbid external CDNs — so **do not load
React/Radix from esm.sh or any importmap.** Instead rebuild the shadcn/ui component *vocabulary*
self-contained in vanilla HTML/CSS/JS: the same anatomy, tokens, radii, and behavior, no runtime
dependency. (Only when the target is explicitly a React/claude.ai artifact — not the default —
use literal `shadcn/ui` + Tailwind + Framer Motion instead. Ask before choosing that lane; it
is not emailable as a file.)

Build these, to shadcn anatomy and with correct ARIA + keyboard:

| Component | Role in illuminate | Self-contained build note |
|---|---|---|
| `Card` | Section shells, diagram/code panels | 1px `--line` border, `--r` radius, `--ground-1` surface |
| `Tabs` | **Diagram ↔ Code** toggle per KL; facet switching | segmented `--ground-2` track; `role="tab"`; WAAPI fade on panel show |
| `Accordion` | Progressive-disclosure detail cards | single-open per section; height via `grid-template-rows:0fr→1fr`; `aria-expanded` |
| `Badge` | `S-NNN` evidence chips, tags | mono, `--brass` on `--ground-2`, 1px border |
| `Tooltip` | Hover-preview a signal's claim (dig without leaving) | `position:fixed`, fade+lift 180ms; also on `focus` for keyboard |
| `Table` | Evidence block (S-NNN · claim · tag · confidence) | header row `--ink-3` mono; `tabular-nums` on confidence |
| `Dialog`/`Sheet` | Evidence explorer (filterable) | focus-return, Escape to close, scrim + `aria-hidden` toggling |
| `Separator` | Section rules | 1px `--line` |

The evidence explorer must be **filterable** (by tag) and each row carries a confidence meter —
a client digs by facet, so give them the controls to.

### Elevation & contrast baseline (mandatory — palette-agnostic)

Whatever palette is chosen, surfaces must **separate**. The most common failure is placing near-
equal-luminance layers on each other (a `#131c20` card on a `#0e1417` ground) — it reads as flat,
muddy, and dated.

- **Three distinct luminance steps**, each a *visible* change: `ground → surface → raised`. If two
  layers are within ~5% luminance, they are the same layer — merge or push them apart.
- **Depth = light, not lines.** Prefer a hairline top-highlight (`inset 0 1px 0 rgba(255,255,255,.06)`)
  plus a soft, diffused shadow (`0 24px 48px -28px rgba(0,0,0,.6)`) over hard 1px grey borders or a
  visible background grid. On a dark ground, a subtle radial glow gives depth without a grid.
- **One accent, used sparingly.** Semantic tints (good/warn/critical, or code-token hues) are separate
  from the accent and stay desaturated. Never a rainbow.
- **Modern chrome, not 2016 dev-brutalist:** a detached floating nav (not edge-to-edge sticky), pill-
  shaped eyebrow badges (not bare all-caps mono), generous section whitespace, spring easing
  (`cubic-bezier(.32,.72,0,1)`), scroll fade-up reveals. Mono is for code and data only, never body.

### Code Snippets (mandatory where the source is technical)

If the source describes mechanisms in code terms (functions, classes, config, protocols),
render at least one **faithful code snippet** per relevant KL — this is the facet technical
clients open first. Requirements:
- shadcn code-block shell: language label + copy button, `--ground-1` surface, mono, `overflow-x:auto`.
- **Restrained highlighting on-palette:** keywords in the single accent, strings in one muted
  harmonized hue, comments dim italic — never a rainbow. Inline a small tokenizer (strings and
  comments consumed before keywords); no highlighter CDN.
- **Faithful, not fabricated:** the snippet renders the mechanism the source *describes*. If it
  is illustrative rather than verbatim repo code, a one-line note says so. It must trace to the
  same S-NNN as its claim.
- House it behind the `Tabs` (Diagram ↔ Code) so the concept and its implementation share one panel.

**Reference build:** `examples/illuminate-failure-modes.html` is the canonical self-contained
demonstrator of this whole section — Tabs, Accordion, Tooltip, filterable evidence Sheet,
per-KL diagram↔code, WAAPI motion. Match its quality bar.

Visual treatments (typewriter GT, ASCII/SVG build, ladder pulse) layer ON TOP of these
state machines. All motion is Web Animations API + CSS — see Motion Standards below.

---

### 2026 modernization (progressive enhancement — prefer native platform)

Between late 2025 and 2026 the platform absorbed most of what illuminate used to hand-roll in JS.
**Stance:** keep the vanilla JS versions as the offline/simple fallback; gate the native-CSS versions
behind `@supports(...)` so modern engines take the better path and older ones degrade cleanly. This
is a new axis of progressive enhancement, not a rewrite. Market validation for the whole thesis:
McKinsey is retiring the deck for exactly these searchable, structured, live web hubs — so lead with
**structure, searchability, evidence-on-demand, one canonical URL**; the motion is only the aid.

*Ranked by leverage (impact × fit):*

1. **OKLCH + relative color** — the biggest reliability win. Author **one** base hue+chroma per
   palette and derive `-dim`, light-mode, and hover with `oklch(from var(--x) ...)`. Perceptual
   lightness is uniform, so **WCAG-AA becomes predictable instead of hand-verified** (kills the
   "never `#00ff88` on light" class of bug). Replace hand-authored hex palettes with this.
2. **Native scroll-driven animation** — replace `IntersectionObserver` reveals with
   `animation-timeline: view()` and RAF parallax with `animation-timeline: scroll()`; both run on
   the compositor and get `prefers-reduced-motion` for free. Behind `@supports (animation-timeline: view())`.
3. **`text-wrap: balance`** on GT/KL titles, **`text-wrap: pretty`** on ledes/notes (kills widows/
   orphans), and **`interpolate-size: allow-keywords` + `calc-size()`** to transition `height: 0 → auto`
   on the compositor — this is the correct fix for the one layout-thrashing animation (never animate
   `height`/`width` directly). Cheap, high polish.
4. **Anchor positioning (`anchor()`) + Popover API** for the evidence Sheet and any picker/tooltip:
   tethering with no offset math, top-layer + Esc for free. Progressive-enhance; keep manual fallback.
5. **Pinned step-through** (the one net-new component): a graphic pins (`position: sticky`) while
   captions scroll past and highlight the active node — ideal for the overview diagram/ladder, where
   each tier highlights as its section enters. Scrollytelling for the argument's spine.
6. **Variable-font axis bound to hierarchy** — map `font-variation-settings` `--wght`/`--wdth` to
   pyramid depth: GT heaviest, KLs equal, detail lightest, so logical authority is encoded in the
   type axis and the Minto hierarchy is legible pre-reading. Rich tier; needs a variable font present.
7. **Machine Experience (MX)** — the artifact is increasingly read by agents (including illuminate's
   own second pass), so make the pyramid machine-legible: real `<section>`/`<h2>`/`<h3>` matching
   pyramid depth, and emit the pyramid + signal block as **JSON-LD** (GT→KL→evidence relationships,
   `S-NNN` traces, confidence tiers) so structure is readable without parsing prose. Low cost, unique payoff.
8. **`typeset`-palette serif GT** — a transitional serif display in the `typeset` palette delivers the
   "authoritative print" register that palette promises. Serif is `typeset`-only; never the default.
9. **Two-disclosure-levels invariant** (NN/g: three degrades usability) — codify as a mechanical
   Phase 7 check: *no evidence reachable in more than 2 taps from the GT*. INSIGHT entries are the
   "primary" tier by definition and never live behind a closed accordion.
10. **Served-mode GSAP** — GSAP (incl. ScrollTrigger, SplitText, MorphSVG, ScrambleText) went 100%
    free in 2025. For **served** (non-offline) rich outputs where a build step is already allowed, it
    is the sanctioned library for cinematic scroll storytelling. **Offline/self-contained stays vanilla**
    — lighter, no external request. Note this split in Environment Adaptation.

Items 1, 2, 9 remove existing bug/hand-maintenance; 5, 6, 7 are the only net-new capability. None
change the method or thesis — they modernize the output layer.

---

### CSS Architecture — Swiss Editorial Token System

The Phase 5 Swiss Editorial Design Standard defines the token vocabulary. Use these exact
token names in Phase 6 CSS — consistent naming makes the design system auditable.

```css
/* ── Typefaces ── */
:root {
  --hn:   'Helvetica Neue', Helvetica, Arial, sans-serif;
  --ft:   Futura, 'Century Gothic', 'Trebuchet MS', var(--hn);
  --mono: 'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;

  /* ── Dark palette (default) ── */
  --paper:    #070708;  --paper-1:  #0f0f11;  --paper-2:  #171719;
  --ink:      #f0f0ee;  --ink-2:    #888886;  --ink-3:    #404040;
  --rule:     rgba(240,240,238,.06);
  --rule-hi:  rgba(240,240,238,.14);
  --red:      #ff1e1e;  --red-dim:    rgba(255,30,30,.10);
  --cli:      #00ff88;  --cli-dim:    rgba(0,255,136,.07);
  --blue:     #3d9eff;  --blue-dim:   rgba(61,158,255,.09);
  --amber:    #ffaa00;  --amber-dim:  rgba(255,170,0,.10);

  /* ── Swiss Grid ── */
  --col12: repeat(12, 1fr);
  --gap12: clamp(12px, 1.5vw, 20px);
  --max:   1400px;
  --pad:   clamp(1.25rem, 4vw, 3.5rem);

  /* ── Type scale ── */
  --t-gt:    clamp(2rem, 4vw, 3.5rem);    /* GT hero — Helvetica Neue 300 */
  --t-h1:    clamp(1.4rem, 2.5vw, 2rem);  /* section titles — Futura 700 */
  --t-body:  clamp(.9rem, 1.1vw, 1rem);
  --t-small: .82rem;
  --t-micro: .68rem;                       /* labels / dateline — Futura caps */
  --t-ghost: clamp(7rem, 20vw, 16rem);    /* ghost section numbers */

  /* ── Motion (Emil Kowalski — custom curves; built-in easings too weak) ── */
  --ease:        cubic-bezier(.16,1,.3,1);
  --spring:      cubic-bezier(.34,1.56,.64,1);
  --ease-out:    cubic-bezier(0.23,1,0.32,1);    /* UI enter/exit — starts fast */
  --ease-in-out: cubic-bezier(0.77,0,0.175,1);   /* on-screen movement */
  --ease-drawer: cubic-bezier(0.32,0.72,0,1);    /* drawer / sheet / deck slide panels */
  --dur:      .5s;
  --dur-fast: .18s;
  --dur-slow: .9s;
  --stagger:  60ms;  /* 30-80ms range; never block interaction during stagger */
}

/* ── Light palette — system preference (no manual override) ── */
/* Values chosen for WCAG AA on warm-cream ground #f5f4f0.         */
/* --cli shifts neon→deep forest; --red deepens for contrast.       */
@media(prefers-color-scheme:light) {
  :root:not([data-theme="dark"]) {
    --paper:    #f5f4f0;  --paper-1:  #eeede8;  --paper-2:  #e4e3de;
    --ink:      #1c1c1a;  --ink-2:    #56564f;  --ink-3:    #9a9a92;
    --rule:     rgba(28,28,26,.07);
    --rule-hi:  rgba(28,28,26,.16);
    --red:      #c8190e;  --red-dim:    rgba(200,25,14,.09);
    --cli:      #006e38;  --cli-dim:    rgba(0,110,56,.08);
    --blue:     #1457a0;  --blue-dim:   rgba(20,87,160,.09);
    --amber:    #8a5e00;  --amber-dim:  rgba(138,94,0,.09);
  }
}

/* ── Manual light override (takes precedence over system pref) ── */
[data-theme="light"] {
  --paper:    #f5f4f0;  --paper-1:  #eeede8;  --paper-2:  #e4e3de;
  --ink:      #1c1c1a;  --ink-2:    #56564f;  --ink-3:    #9a9a92;
  --rule:     rgba(28,28,26,.07);
  --rule-hi:  rgba(28,28,26,.16);
  --red:      #c8190e;  --red-dim:    rgba(200,25,14,.09);
  --cli:      #006e38;  --cli-dim:    rgba(0,110,56,.08);
  --blue:     #1457a0;  --blue-dim:   rgba(20,87,160,.09);
  --amber:    #8a5e00;  --amber-dim:  rgba(138,94,0,.09);
}

/* ── Manual dark override (overrides system light pref) ── */
[data-theme="dark"] {
  --paper:    #070708;  --paper-1:  #0f0f11;  --paper-2:  #171719;
  --ink:      #f0f0ee;  --ink-2:    #888886;  --ink-3:    #404040;
  --rule:     rgba(240,240,238,.06);
  --rule-hi:  rgba(240,240,238,.14);
  --red:      #ff1e1e;  --red-dim:    rgba(255,30,30,.10);
  --cli:      #00ff88;  --cli-dim:    rgba(0,255,136,.07);
  --blue:     #3d9eff;  --blue-dim:   rgba(61,158,255,.09);
  --amber:    #ffaa00;  --amber-dim:  rgba(255,170,0,.10);
}

/* ════════════════════════════════════════════════════════════════════
   NAMED PALETTES — applied via [data-palette="X"] on <html>
   Each palette overrides the color tokens; theme (dark/light) still
   applies within the palette via the combined selectors below.
   Palette rules come AFTER theme rules so they win in the cascade.
   ════════════════════════════════════════════════════════════════════ */

/* ── CLAUDE — warm terracotta intelligence ── */
/* Character: approachable, considered, general-purpose             */
[data-palette="claude"] {
  --paper:    #1a1714;  --paper-1:  #231f1b;  --paper-2:  #2d2823;
  --ink:      #f0ece4;  --ink-2:    #998f82;  --ink-3:    #5a5048;
  --rule:     rgba(240,236,228,.06);
  --rule-hi:  rgba(240,236,228,.14);
  --red:      #e8633a;  --red-dim:    rgba(232,99,58,.10);
  --cli:      #6ac5a0;  --cli-dim:    rgba(106,197,160,.07);
  --blue:     #5ba3d0;  --blue-dim:   rgba(91,163,208,.09);
  --amber:    #d4a055;  --amber-dim:  rgba(212,160,85,.10);
}
@media(prefers-color-scheme:light) {
  [data-palette="claude"]:not([data-theme="dark"]) {
    --paper:    #faf7f2;  --paper-1:  #f2ede6;  --paper-2:  #e8e1d8;
    --ink:      #1a1410;  --ink-2:    #5a4e44;  --ink-3:    #9a8e84;
    --rule:     rgba(26,20,16,.07);  --rule-hi:  rgba(26,20,16,.16);
    --red:      #c44f28;  --red-dim:    rgba(196,79,40,.09);
    --cli:      #2a8a6a;  --cli-dim:    rgba(42,138,106,.08);
    --blue:     #2a6a9a;  --blue-dim:   rgba(42,106,154,.09);
    --amber:    #9a6a1a;  --amber-dim:  rgba(154,106,26,.09);
  }
}
[data-palette="claude"][data-theme="light"] {
  --paper:    #faf7f2;  --paper-1:  #f2ede6;  --paper-2:  #e8e1d8;
  --ink:      #1a1410;  --ink-2:    #5a4e44;  --ink-3:    #9a8e84;
  --rule:     rgba(26,20,16,.07);  --rule-hi:  rgba(26,20,16,.16);
  --red:      #c44f28;  --red-dim:    rgba(196,79,40,.09);
  --cli:      #2a8a6a;  --cli-dim:    rgba(42,138,106,.08);
  --blue:     #2a6a9a;  --blue-dim:   rgba(42,106,154,.09);
  --amber:    #9a6a1a;  --amber-dim:  rgba(154,106,26,.09);
}

/* ── GREENHOUSE — eucalyptus membrane ── */
/* Character: living systems, organic architecture, technical       */
[data-palette="greenhouse"] {
  --paper:    #060807;  --paper-1:  #0d110e;  --paper-2:  #141a15;
  --ink:      #eef2ee;  --ink-2:    #7a8f7c;  --ink-3:    #3a4a3c;
  --rule:     rgba(238,242,238,.06);
  --rule-hi:  rgba(238,242,238,.14);
  --red:      #d44f40;  --red-dim:    rgba(212,79,64,.10);
  --cli:      #8fbcb3;  --cli-dim:    rgba(143,188,179,.07);
  --blue:     #5a8ca8;  --blue-dim:   rgba(90,140,168,.09);
  --amber:    #c8a050;  --amber-dim:  rgba(200,160,80,.10);
}
@media(prefers-color-scheme:light) {
  [data-palette="greenhouse"]:not([data-theme="dark"]) {
    --paper:    #f4f7f5;  --paper-1:  #eaede9;  --paper-2:  #dde0db;
    --ink:      #101812;  --ink-2:    #3e5440;  --ink-3:    #7a8f7c;
    --rule:     rgba(16,24,18,.07);  --rule-hi:  rgba(16,24,18,.16);
    --red:      #a83428;  --red-dim:    rgba(168,52,40,.09);
    --cli:      #306858;  --cli-dim:    rgba(48,104,88,.08);
    --blue:     #284e68;  --blue-dim:   rgba(40,78,104,.09);
    --amber:    #7a5e18;  --amber-dim:  rgba(122,94,24,.09);
  }
}
[data-palette="greenhouse"][data-theme="light"] {
  --paper:    #f4f7f5;  --paper-1:  #eaede9;  --paper-2:  #dde0db;
  --ink:      #101812;  --ink-2:    #3e5440;  --ink-3:    #7a8f7c;
  --rule:     rgba(16,24,18,.07);  --rule-hi:  rgba(16,24,18,.16);
  --red:      #a83428;  --red-dim:    rgba(168,52,40,.09);
  --cli:      #306858;  --cli-dim:    rgba(48,104,88,.08);
  --blue:     #284e68;  --blue-dim:   rgba(40,78,104,.09);
  --amber:    #7a5e18;  --amber-dim:  rgba(122,94,24,.09);
}

/* ── TYPESET — printer's ink + aged paper ── */
/* Character: authoritative, print-press, dense text / books       */
[data-palette="typeset"] {
  --paper:    #080608;  --paper-1:  #111014;  --paper-2:  #1a1820;
  --ink:      #f8f6f0;  --ink-2:    #b0aa98;  --ink-3:    #585048;
  --rule:     rgba(248,246,240,.06);
  --rule-hi:  rgba(248,246,240,.14);
  --red:      #c8182c;  --red-dim:    rgba(200,24,44,.10);
  --cli:      #4a8080;  --cli-dim:    rgba(74,128,128,.07);
  --blue:     #304870;  --blue-dim:   rgba(48,72,112,.09);
  --amber:    #c08840;  --amber-dim:  rgba(192,136,64,.10);
}
@media(prefers-color-scheme:light) {
  [data-palette="typeset"]:not([data-theme="dark"]) {
    --paper:    #f8f4ec;  --paper-1:  #ede8dc;  --paper-2:  #e0dace;
    --ink:      #14100c;  --ink-2:    #48403a;  --ink-3:    #907068;
    --rule:     rgba(20,16,12,.07);  --rule-hi:  rgba(20,16,12,.16);
    --red:      #a01020;  --red-dim:    rgba(160,16,32,.09);
    --cli:      #285858;  --cli-dim:    rgba(40,88,88,.08);
    --blue:     #1c304c;  --blue-dim:   rgba(28,48,76,.09);
    --amber:    #7a5020;  --amber-dim:  rgba(122,80,32,.09);
  }
}
[data-palette="typeset"][data-theme="light"] {
  --paper:    #f8f4ec;  --paper-1:  #ede8dc;  --paper-2:  #e0dace;
  --ink:      #14100c;  --ink-2:    #48403a;  --ink-3:    #907068;
  --rule:     rgba(20,16,12,.07);  --rule-hi:  rgba(20,16,12,.16);
  --red:      #a01020;  --red-dim:    rgba(160,16,32,.09);
  --cli:      #285858;  --cli-dim:    rgba(40,88,88,.08);
  --blue:     #1c304c;  --blue-dim:   rgba(28,48,76,.09);
  --amber:    #7a5020;  --amber-dim:  rgba(122,80,32,.09);
}

/* ── SIGNAL — scientific instrument / phosphor ── */
/* Character: precise, data-forward, scientific / quantitative      */
[data-palette="signal"] {
  --paper:    #030508;  --paper-1:  #080c14;  --paper-2:  #0e1520;
  --ink:      #e0eaf8;  --ink-2:    #6a8090;  --ink-3:    #344050;
  --rule:     rgba(224,234,248,.06);
  --rule-hi:  rgba(224,234,248,.14);
  --red:      #f03060;  --red-dim:    rgba(240,48,96,.10);
  --cli:      #10e880;  --cli-dim:    rgba(16,232,128,.07);
  --blue:     #4090f8;  --blue-dim:   rgba(64,144,248,.09);
  --amber:    #f8a820;  --amber-dim:  rgba(248,168,32,.10);
}
@media(prefers-color-scheme:light) {
  [data-palette="signal"]:not([data-theme="dark"]) {
    --paper:    #f4f6fc;  --paper-1:  #eaecf4;  --paper-2:  #dce0ec;
    --ink:      #0c1020;  --ink-2:    #3a4560;  --ink-3:    #7a8898;
    --rule:     rgba(12,16,32,.07);  --rule-hi:  rgba(12,16,32,.16);
    --red:      #c01848;  --red-dim:    rgba(192,24,72,.09);
    --cli:      #086840;  --cli-dim:    rgba(8,104,64,.08);
    --blue:     #0848c8;  --blue-dim:   rgba(8,72,200,.09);
    --amber:    #b86808;  --amber-dim:  rgba(184,104,8,.09);
  }
}
[data-palette="signal"][data-theme="light"] {
  --paper:    #f4f6fc;  --paper-1:  #eaecf4;  --paper-2:  #dce0ec;
  --ink:      #0c1020;  --ink-2:    #3a4560;  --ink-3:    #7a8898;
  --rule:     rgba(12,16,32,.07);  --rule-hi:  rgba(12,16,32,.16);
  --red:      #c01848;  --red-dim:    rgba(192,24,72,.09);
  --cli:      #086840;  --cli-dim:    rgba(8,104,64,.08);
  --blue:     #0848c8;  --blue-dim:   rgba(8,72,200,.09);
  --amber:    #b86808;  --amber-dim:  rgba(184,104,8,.09);
}

/* ── ARCHIVE — historical parchment ── */
/* Character: dignified, documentary, primary sources / history     */
[data-palette="archive"] {
  --paper:    #0c0a08;  --paper-1:  #151210;  --paper-2:  #1e1a16;
  --ink:      #e8e0d0;  --ink-2:    #908070;  --ink-3:    #504840;
  --rule:     rgba(232,224,208,.06);
  --rule-hi:  rgba(232,224,208,.14);
  --red:      #a83820;  --red-dim:    rgba(168,56,32,.10);
  --cli:      #6a8050;  --cli-dim:    rgba(106,128,80,.07);
  --blue:     #485870;  --blue-dim:   rgba(72,88,112,.09);
  --amber:    #b89040;  --amber-dim:  rgba(184,144,64,.10);
}
@media(prefers-color-scheme:light) {
  [data-palette="archive"]:not([data-theme="dark"]) {
    --paper:    #f4ede0;  --paper-1:  #e8dece;  --paper-2:  #dcd0be;
    --ink:      #1c1408;  --ink-2:    #504038;  --ink-3:    #988068;
    --rule:     rgba(28,20,8,.07);  --rule-hi:  rgba(28,20,8,.16);
    --red:      #882a14;  --red-dim:    rgba(136,42,20,.09);
    --cli:      #3a5030;  --cli-dim:    rgba(58,80,48,.08);
    --blue:     #2c3848;  --blue-dim:   rgba(44,56,72,.09);
    --amber:    #7a5a10;  --amber-dim:  rgba(122,90,16,.09);
  }
}
[data-palette="archive"][data-theme="light"] {
  --paper:    #f4ede0;  --paper-1:  #e8dece;  --paper-2:  #dcd0be;
  --ink:      #1c1408;  --ink-2:    #504038;  --ink-3:    #988068;
  --rule:     rgba(28,20,8,.07);  --rule-hi:  rgba(28,20,8,.16);
  --red:      #882a14;  --red-dim:    rgba(136,42,20,.09);
  --cli:      #3a5030;  --cli-dim:    rgba(58,80,48,.08);
  --blue:     #2c3848;  --blue-dim:   rgba(44,56,72,.09);
  --amber:    #7a5a10;  --amber-dim:  rgba(122,90,16,.09);
}

/* ── Theme-aware ghost numbers ── */
[data-theme="light"] .ghost,
@media(prefers-color-scheme:light) { :root:not([data-theme="dark"]) .ghost { color: rgba(28,28,26,.030) } }
[data-theme="light"] .kl:hover .ghost,
@media(prefers-color-scheme:light) { :root:not([data-theme="dark"]) .kl:hover .ghost { color: rgba(28,28,26,.06) } }

/* ── Theme-aware grid overlay ── */
[data-theme="light"] .grid-bg { background-image: repeating-linear-gradient(90deg,rgba(0,0,0,.025) 0,rgba(0,0,0,.025) 1px,transparent 1px,transparent calc(100%/12)); }
@media(prefers-color-scheme:light) { :root:not([data-theme="dark"]) .grid-bg { background-image: repeating-linear-gradient(90deg,rgba(0,0,0,.025) 0,rgba(0,0,0,.025) 1px,transparent 1px,transparent calc(100%/12)); } }

/* ── Smooth theme transition (surfaces + borders only; text excluded to avoid flash) ── */
html { transition: background-color .25s var(--ease-out); }
*, *::before, *::after { transition: background-color .20s var(--ease-out), border-color .20s var(--ease-out); }

/* ── Progress stripe — no box-shadow in light mode (neon glow unreadable on cream) ── */
[data-theme="light"] #prog,
@media(prefers-color-scheme:light) { :root:not([data-theme="dark"]) #prog { box-shadow: none; } }

@media(prefers-reduced-motion:reduce) {
  :root { --dur: 0s; --dur-fast: 0s; --dur-slow: 0s; }
  html, *, *::before, *::after { transition: none !important; }
}
```

---

### Motion Standards (Emil Kowalski — mandatory)

Run this decision framework before writing any animation code:
1. **How often?** 100+/day = no animation. Tens/day = reduce. Occasional = standard. Rare = delight.
2. **What purpose?** Spatial consistency / state indication / feedback / preventing jarring change.
3. **What easing?** Entering/exiting → `--ease-out`. Moving on screen → `--ease-in-out`. Never ease-in on UI.
4. **GPU only:** `transform` + `opacity`. No `width` / `height` / `margin` / `padding` animation.

Duration table:
| Element | Duration |
|---|---|
| Button press feedback | 100–160ms |
| Tooltips, S-NNN chips | 125–200ms |
| Accordion open/close | 200–300ms |
| Evidence drawer | 300–400ms |
| GT reveal (typewriter) | ~1–2s total |
| ASCII art build | 12ms/char, 40ms/line |
| Deck slide enter | 200ms (`--ease-drawer`) |

Mandatory techniques:
- **`@starting-style`** for entry animations (replaces JS mounted-state pattern)
- **`clip-path: inset()`** for reveal animations (replaces `translateY` where applicable; WAAPI for programmatic)
- **CSS transitions** over keyframes for interruptible UI (accordion, evidence drawer)
- **Asymmetric timing:** deliberate user action (open, expand) = slower; system response (close, collapse) = snappy (200ms `--ease-out`)
- **Stagger:** 30–80ms between items; never block interaction during stagger
- **Hover guards:** all hover states wrapped in `@media (hover: hover) and (pointer: fine)`

Absolute motion bans:
- `transition: all` — specify exact properties
- `ease-in` on any UI element
- `scale(0)` entry — minimum `scale(0.95)` + `opacity: 0`
- Framer Motion `x`/`y`/`scale` shorthands — use full `transform` string (shorthands not GPU-accelerated)

Spring config (evidence drawer, Radix Accordion): `{ type: "spring", duration: 0.5, bounce: 0.15 }` (Apple register — professional, subtle)

---

### Theme Toggle Construction

Boot order: apply theme attribute **before first paint** to prevent flash.
Place the script inline in `<head>`, before any CSS.

```html
<script>
// Run before paint — no flash of wrong theme, tier, or palette
(function() {
  var stored = localStorage.getItem('il-theme');
  var sys = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', stored || sys);
  document.documentElement.setAttribute('data-tier', localStorage.getItem('il-tier') || 'editorial');
  var pal = localStorage.getItem('il-palette');
  if (pal) document.documentElement.setAttribute('data-palette', pal);
})();
</script>
```

Toggle function (in body `<script>`):
```javascript
function toggleTheme() {
  var cur = document.documentElement.getAttribute('data-theme');
  var next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('il-theme', next);
  var btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = next === 'dark' ? '◑' : '◐';
}
// Init button label to match current state
(function() {
  var btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '◑' : '◐';
})();
```

HTML in sticky nav (right-aligned group):
```html
<div class="nav-controls">
  <div class="tier-select">
    <button class="tier-btn" data-t="simple"   onclick="setTier('simple')">s</button>
    <button class="tier-btn" data-t="editorial" onclick="setTier('editorial')">b</button>
    <button class="tier-btn" data-t="rich"     onclick="setTier('rich')">r</button>
  </div>
  <button id="theme-btn"   class="nav-icon-btn" onclick="toggleTheme()"        title="Toggle theme">◑</button>
  <button id="palette-btn" class="nav-icon-btn" onclick="togglePalettePicker()" title="Choose palette">◉</button>
</div>
<!-- Palette picker popover (hidden by default) -->
<div id="palette-pop" class="palette-pop" style="display:none">
  <button class="pal-swatch" data-p="illuminate" onclick="setPalette('illuminate')" title="Illuminate"></button>
  <button class="pal-swatch" data-p="claude"     onclick="setPalette('claude')"     title="Claude"></button>
  <button class="pal-swatch" data-p="greenhouse" onclick="setPalette('greenhouse')" title="Greenhouse"></button>
  <button class="pal-swatch" data-p="typeset"    onclick="setPalette('typeset')"    title="Typeset"></button>
  <button class="pal-swatch" data-p="signal"     onclick="setPalette('signal')"     title="Signal"></button>
  <button class="pal-swatch" data-p="archive"    onclick="setPalette('archive')"    title="Archive"></button>
</div>
```

CSS:
```css
.nav-controls { display: flex; align-items: center; gap: 6px; margin-left: auto; }

.nav-icon-btn {
  background: none; border: 1px solid var(--rule-hi); border-radius: 4px;
  color: var(--ink-3); font-family: var(--mono); font-size: .88rem;
  width: 26px; height: 26px; cursor: pointer; line-height: 1;
  transition: border-color var(--dur-fast), color var(--dur-fast);
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
}
.nav-icon-btn:hover { border-color: var(--ink-2); color: var(--ink-2); }

.tier-select {
  display: flex; border: 1px solid var(--rule-hi); border-radius: 4px; overflow: hidden;
}
.tier-btn {
  background: none; border: none; border-right: 1px solid var(--rule-hi);
  padding: 3px 7px; font-family: var(--ft); font-size: .6rem; font-weight: 700;
  letter-spacing: .08em; color: var(--ink-3); cursor: pointer;
  transition: background var(--dur-fast), color var(--dur-fast);
}
.tier-btn:last-child { border-right: none; }
.tier-btn:hover { background: var(--rule); color: var(--ink-2); }
.tier-btn.active { background: var(--red-dim); color: var(--red); }
```

---

### Palette System

Six curated palettes, each tuned for a different reading character and source type.
The illuminate palette is the default (no `[data-palette]` needed). The others are applied
via `[data-palette="X"]` on `<html>` — orthogonal to `[data-theme]` and `[data-tier]`.

**Palette personality + best source types:**

| Palette | Dark ground | Editorial accent | `--cli` | Best source types |
|---|---|---|---|---|
| `illuminate` | `#070708` cold near-black | `#ff1e1e` editorial red | `#00ff88` neon | any; pure Swiss editorial |
| `claude` | `#1a1714` warm near-black | `#e8633a` terracotta | `#6ac5a0` seafoam | general-purpose; conversations; AI |
| `greenhouse` | `#060807` near-black + green | `#d44f40` warm red | `#8fbcb3` eucalyptus | systems architecture; technical |
| `typeset` | `#080608` cold press black | `#c8182c` printer's red | `#4a8080` teal | books; long-form; dense text |
| `signal` | `#030508` space black | `#f03060` hot magenta | `#10e880` phosphor | scientific; quantitative; data |
| `archive` | `#0c0a08` aged dark | `#a83820` rust/terra cotta | `#6a8050` sage | historical; documentary; primary sources |

**Key design principle:** the illuminate grammar is fixed (`--cli` = evidence always; `--red` = editorial accent always). The palette shifts the *character* of the reading experience, not the structure. A `signal` artifact reads like a scientific instrument. An `archive` artifact feels like handling primary sources. The argument hierarchy is unchanged.

**JS: `setPalette()` + picker:**
```javascript
var PALETTES = ['illuminate','claude','greenhouse','typeset','signal','archive'];

function setPalette(p) {
  if (p === 'illuminate') {
    document.documentElement.removeAttribute('data-palette');
    localStorage.removeItem('il-palette');
  } else {
    document.documentElement.setAttribute('data-palette', p);
    localStorage.setItem('il-palette', p);
  }
  document.querySelectorAll('.pal-swatch').forEach(function(b) {
    b.classList.toggle('active', b.dataset.p === (p || 'illuminate'));
  });
  document.getElementById('palette-pop').style.display = 'none';
}

function togglePalettePicker() {
  var pop = document.getElementById('palette-pop');
  pop.style.display = pop.style.display === 'none' ? 'flex' : 'none';
}

// Close picker when clicking outside
document.addEventListener('click', function(e) {
  var pop = document.getElementById('palette-pop');
  var btn = document.getElementById('palette-btn');
  if (pop && btn && !pop.contains(e.target) && e.target !== btn) {
    pop.style.display = 'none';
  }
});

// Init swatch active state
(function() {
  var cur = document.documentElement.getAttribute('data-palette') || 'illuminate';
  document.querySelectorAll('.pal-swatch').forEach(function(b) {
    b.classList.toggle('active', b.dataset.p === cur);
  });
})();
```

**CSS: palette picker popover:**
```css
.palette-pop {
  position: absolute; top: calc(100% + 6px); right: 0;
  background: var(--paper-1); border: 1px solid var(--rule-hi); border-radius: 6px;
  padding: 8px; display: flex; gap: 6px; flex-wrap: wrap; width: 148px;
  z-index: 100; box-shadow: 0 4px 16px rgba(0,0,0,.4);
}
.pal-swatch {
  width: 28px; height: 28px; border-radius: 50%; border: 2px solid transparent; cursor: pointer;
  transition: border-color var(--dur-fast), transform var(--dur-fast);
}
.pal-swatch:hover  { transform: scale(1.15); }
.pal-swatch.active { border-color: var(--red); }
/* Swatch background colors (dark-mode representative tones): */
.pal-swatch[data-p="illuminate"] { background: #070708; box-shadow: 0 0 0 1px #404040 inset; }
.pal-swatch[data-p="claude"]     { background: #1a1714; box-shadow: 0 0 0 1px #e8633a inset; }
.pal-swatch[data-p="greenhouse"] { background: #060807; box-shadow: 0 0 0 1px #8fbcb3 inset; }
.pal-swatch[data-p="typeset"]    { background: #080608; box-shadow: 0 0 0 1px #c8182c inset; }
.pal-swatch[data-p="signal"]     { background: #030508; box-shadow: 0 0 0 1px #4090f8 inset; }
.pal-swatch[data-p="archive"]    { background: #0c0a08; box-shadow: 0 0 0 1px #b89040 inset; }
```

**Cascade guarantee:**
The palette token rules appear AFTER the `[data-theme]` rules in the CSS. Since `[data-palette="X"]` has equal attribute-selector specificity, source order makes them win. Light-mode palette rules (`[data-palette="X"][data-theme="light"]` and the `@media` fallback) use higher specificity (two attribute selectors) and always win over both the base palette and the illuminate light rules.

No other CSS needs to change — every downstream rule already uses semantic tokens (`var(--red)`, `var(--cli)`, etc.).

---

### Render Tier Architecture

Three tiers control the intensity of interactive and animated features.
Applied via `[data-tier="simple|editorial|rich"]` on `<html>`.

```javascript
function setTier(t) {
  document.documentElement.setAttribute('data-tier', t);
  localStorage.setItem('il-tier', t);
  document.querySelectorAll('.tier-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.t === t);
  });
}
// Sync button state on init
(function() {
  var t = document.documentElement.getAttribute('data-tier') || 'editorial';
  document.querySelectorAll('.tier-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.t === t);
  });
})();
```

**Tier capability matrix:**

| Feature | simple | editorial | rich |
|---|---|---|---|
| Parallax | ✗ | ✗ | opt-in, 2–3 layers |
| ASCII animation | instant | 2× speed | full speed + hover nodes |
| GT reveal | fade-in | typewriter | typewriter |
| Accordion open | instant | height transition | scan-line + nested |
| Evidence drawer | inline expand | slide-in | full slide-in + transition |
| Confidence meter | static bars | CSS transition | JS animated fill |
| Custom cursor | ✗ | without blend-mode | `mix-blend-mode:difference` |
| Focus mode `f` | ✓ | ✓ | ✓ |
| Signal view `s` | ✓ | ✓ | ✓ |
| Related highlights | ✓ | ✓ | ✓ |
| Progress arc | ✓ | ✓ | ✓ |
| Component — fidelity mockups | static frame; pins → footnotes | static frame + pins + drawer | + hover tilt, push slide-in, pulsing pins |
| Component — process & flow | static nodes + edges | static edges + hover highlight | self-drawing edges + hover-propagated highlight |
| Component — metrics & funnels | final values, static bars | CSS bar/gauge transitions | JS animated fill + count-up |
| Component — decision & compare | static positions/cells | hover states | dot-settle / cell-reveal animation |

Focus mode, signal view, related highlights, and progress arc are **always active**
across all tiers — these are navigation features, not decoration.

**All four component families keep content identical across tiers — only motion changes.**
`prefers-reduced-motion` forces the simple behaviour regardless of selected tier (existing rule).

**CSS tier guards** — disable features without JS:
```css
/* Parallax — rich tier only; simple + editorial render flat */
[data-tier="simple"] .bg-grid, [data-tier="editorial"] .bg-grid,
[data-tier="simple"] .hero-ascii, [data-tier="editorial"] .hero-ascii,
[data-tier="simple"] .hero-gt, [data-tier="editorial"] .hero-gt { transform: none !important; will-change: auto !important; }

/* Custom cursor */
[data-tier="simple"] #cur,
[data-tier="editorial"] #cur { display: none; }

/* Scan-line open (simple + editorial use height transition fallback) */
[data-tier="simple"] .scan-line,
[data-tier="editorial"] .scan-line { display: none; }
```

**JS tier helpers** — use these in every animated component:
```javascript
var TIER = function() { return document.documentElement.dataset.tier || 'editorial'; };
var isRich       = function() { return TIER() === 'rich'; };
var isEditorialUp = function() { return TIER() !== 'simple'; };
// Usage: if (!isEditorialUp()) { el.textContent = text; return; }
//        var speed = isRich() ? 1 : 2;  // editorial = 2× faster
```

---

### Parallax Depth System (opt-in — rich tier only)

Off by default. When the operator picks the rich tier, the hero gains 2–3 depth layers moving
at different speeds on scroll — GT at the front, evidence receding. Editorial and simple tiers
render flat; parallax is never automatic. Enable it only when depth genuinely aids the reading.

```javascript
// Parallax engine — tier-aware, RAF-throttled
// simple + editorial: disabled by CSS guard (no parallax)
// rich: 2–3 layers
var PARALLAX_LAYERS = [
  { sel: '.bg-grid',    speed: 0.15 },
  { sel: '.hero-ascii', speed: 0.35 },
  { sel: '.hero-gt',    speed: 0.02 },
];
function initParallax() {
  if (!isRich()) return;  // parallax is rich-only; simple + editorial render flat
  var maxLayers = 3;
  var layers = PARALLAX_LAYERS.slice(0, maxLayers).map(function(l) {
    return { el: document.querySelector(l.sel), speed: l.speed };
  }).filter(function(l) { return l.el; });
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var y = window.scrollY;
        layers.forEach(function(l) {
          l.el.style.transform = 'translateY(' + (y * l.speed) + 'px)';
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
initParallax();
```

Background grid: CSS `background-image: repeating-linear-gradient(...)` at `--paper-2`
contrast, shifted by scroll. In light mode: use the `--paper-2` var (auto-switches).
Creates the sensation of depth under the text layers.

---

### Interactive ASCII Diagram System (mandatory)

ASCII art is not static decoration. It is an interactive visualization. Every multi-line
diagram must:

1. **Build character by character** before surrounding content appears — the drawing IS the
   entrance animation.
2. **Have hover nodes** — named concepts in the diagram respond to hover: highlight the
   corresponding section or card, show a tooltip with the S-NNN trace.
3. **Animate data paths** — arrows (`→`, `─`, `│`, `╔═`) cycle through `dim → normal → bright`
   on a stagger when the user hovers a node at either end.

**`buildArt(el, lines, opts)` — the core engine:**
```javascript
// buildArt — tier-aware, motion-safe
// simple:   instant (textContent; no tick)
// editorial: animated at 2× speed
// rich:     full speed + hover-node wiring after done
// opts: { cd, ld, onDone }   cd default 12ms, ld default 40ms
var R = matchMedia('(prefers-reduced-motion:reduce)').matches;
function buildArt(el, lines, opts) {
  var o = Object.assign({ cd: 12, ld: 40, onDone: null }, opts);
  var arr = Array.isArray(lines) ? lines : lines.split('\n');
  if (R || !isEditorialUp()) {
    // simple tier or reduced-motion: instant
    el.textContent = arr.join('\n');
    el.classList.add('art-done');
    if (o.onDone) o.onDone();
    return;
  }
  var speed = isRich() ? 1 : 2;  // editorial: 2× faster
  var li = 0, ci = 0;
  function tick() {
    if (li >= arr.length) {
      el.classList.add('art-done');
      if (o.onDone) setTimeout(o.onDone, 80);
      return;
    }
    var above = arr.slice(0, li).join('\n');
    el.textContent = (above ? above + '\n' : '') + arr[li].slice(0, ci);
    ci < arr[li].length ? ci++ : (li++, ci = 0);
    setTimeout(tick, ci === 0 ? o.ld * speed : o.cd * speed);
  }
  tick();
}
```

**Interactive node wiring** — after `buildArt` completes, scan the text for named concepts
and replace them with `<span class="art-node" data-target="<section-id>">` elements.
On hover: highlight the target section header, animate any connecting `─│╔` characters
between source and target.

**ASCII diagram vocabulary — required character set:**
```
Box drawing:  ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ ╌ ┄
Heavy:        ━ ┃ ╔ ╗ ╚ ╝ ╠ ╣ ╦ ╩ ╬ ═
Fill grades:  ░ ▒ ▓ █  (for heat maps, progress, density)
Arrows:       → ← ↑ ↓ ↗ ↘ ⟶ ⟵ ▸ ▹ ▾ ▿
Geometric:    ■ □ ◆ ◇ ● ○ ◉ ⊕
Status:       ✓ ✗ ~ · × ⊞ ⊟
```

No emoji. No art-for-art's-sake. Every character earns its place by representing a
logical relationship in the argument structure.

---

### Section Reveal Sequence (mandatory order)

The pyramid's descent must be enacted in the DOM reveal order. Each section:

1. `SECTION-MOTIF` begins building character by character (IntersectionObserver fires)
2. On motif complete → `SECTION-HEADER` fades in with `translateY(-8px)` slide
3. 150ms after header → `SECTION-LEDE` fades in
4. 300ms after lede → `INLINE-VISUAL` builds (either ASCII art or CSS bar chart)
5. 100ms per card → `ACCORDION-CARDS` stagger in with `translateX(-12px)` slide

```javascript
// Section reveal — tier-aware stagger
// simple:   all sections visible immediately (IntersectionObserver disabled)
// editorial: motif + header fade-in; visuals appear (no stagger)
// rich:     full sequence: motif builds → header slides → lede → visuals → cards stagger
function initSectionReveals() {
  if (!isEditorialUp()) {
    // simple: make everything visible immediately
    document.querySelectorAll('.kl').forEach(function(s) {
      s.classList.add('visible');
      s.querySelectorAll('.art').forEach(function(a) { a.classList.add('art-done'); });
    });
    return;
  }
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      var sec = SECTIONS.find(function(s) { return s.id === entry.target.id; });
      if (!sec) return;
      buildArt(sec.motifEl, MOTIFS[sec.motifKey], { onDone: function() {
        sec.innerEl.classList.add('visible');
        sec.vbs.forEach(function(vb, i) {
          var delay = isRich() ? i * 300 + 200 : 100;
          setTimeout(function() { buildArt(vb.el, vb.art, { cd: 8, ld: 20 }); }, delay);
        });
        if (isRich()) {
          document.querySelectorAll('.card', sec.innerEl).forEach(function(c, i) {
            setTimeout(function() { c.classList.add('entry-done'); }, i * 100 + 400);
          });
        } else {
          document.querySelectorAll('.card', sec.innerEl).forEach(function(c) {
            c.classList.add('entry-done');
          });
        }
      }});
    });
  }, { threshold: 0.05, rootMargin: '-48px 0px 0px 0px' });
  document.querySelectorAll('.kl').forEach(function(s) { io.observe(s); });
}
initSectionReveals();
```

---

### GT Reveal (mandatory — this is the most important moment in the page)

The GT is assembled by typewriter AFTER the SCQA setup completes. The reader has read the
Situation and Complication; they are primed. The Question appears; then the GT builds
character by character at a pace that creates suspense.

```javascript
// GT reveal — 2 modes based on tier (no scramble — too edgy for editorial support)
// simple:            fade-in (CSS opacity transition, no JS animation)
// editorial / rich:  typewriter character by character
function revealGT(gtEl, text, onDone) {
  if (!isEditorialUp()) {
    // simple: instant fade-in via CSS class
    gtEl.textContent = text;
    gtEl.classList.add('gt-visible');
    if (onDone) onDone();
    return;
  }
  // editorial + rich: typewriter
  var i = 0;
  function tw() {
    if (i > text.length) { gtEl.classList.add('done'); if (onDone) onDone(); return; }
    gtEl.textContent = text.slice(0, i++);
    setTimeout(tw, 7);
  }
  tw();
}

// Sequence: S+C visible → divider builds → Q types → pause → GT reveals
type(dividerEl, '─'.repeat(48), { cd: 10, onDone: function() {
  type(questionEl, QUESTION_TEXT, { cd: 18, onDone: function() {
    setTimeout(function() {
      revealGT(gtEl, GT_TEXT, function() { buildPipelineDiagram(); });
    }, 300);
  }});
}});
```

**GT CSS — theme-aware:**
```css
.gt-text {
  font-family: var(--hn); font-size: var(--t-gt); font-weight: 300;
  letter-spacing: -.04em; text-transform: uppercase; line-height: 1.08;
  color: var(--ink);  /* base: visible before .done */
}
/* simple tier: fade-in */
[data-tier="simple"] .gt-text { opacity: 0; transition: opacity .6s var(--ease); }
[data-tier="simple"] .gt-text.gt-visible { opacity: 1; }
/* editorial + rich: gradient on completion */
.gt-text.done {
  background: linear-gradient(140deg, var(--ink) 0%, var(--ink-2) 60%, var(--red) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
/* light mode: gradient uses ink tones, not neon */
```
The gradient uses `var(--ink)` → `var(--ink-2)` → `var(--red)` — all tokens, so it
automatically reads correctly in both light and dark mode.

---

### Accordion with Nested Components (mandatory)

Cards are not simple height-toggle accordions. Each has:

1. **Scan-line open** — on trigger click: a `height: 2px` gradient strip scales from 0 to 1
   across the card top over 250ms. On complete: body height animates open.
2. **Nested sub-sections** — cards can contain further collapsible blocks (2-level depth max).
   Level 2 uses a simpler `▸/▾ toggle` with a 120ms height transition.
4. **Evidence tags** — `S-NNN` traces render as clickable chips. On click: a slide-in panel
   from the right shows the full signal block entry for that S-NNN (stored in a `DATA` object
   in the `<script>` block).
5. **State persistence** — `localStorage` stores which cards are open by section and S-NNN.

```javascript
// Evidence drawer
const DATA = { 'S-001': '<full signal block entry>', 'S-002': '...', ... };
qsa('.cite').forEach(function(chip) {
  chip.addEventListener('click', function(e) {
    e.stopPropagation();
    const id = chip.dataset.cite;
    showDrawer(id, DATA[id] || 'Entry not found.');
  });
});
```

---

### The annotation / hotspot system (cross-cutting — wires to the evidence drawer)

Any component can carry numbered pins that turn it into a navigational surface into the pyramid.
This is what upgrades a mockup from "a picture" to "an explanation."

```html
<div class="annot">                          <!-- wraps a positioned component -->
  <button class="pin" style="--x:64%;--y:22%" data-cite="S-014"
          aria-label="Personalization token">1</button>
  <button class="pin" style="--x:30%;--y:70%" data-cite="S-018"
          aria-label="Send-time setting">2</button>
</div>
```
```css
.annot { position:relative; }
.pin { position:absolute; left:var(--x); top:var(--y); transform:translate(-50%,-50%);
  width:22px; height:22px; border-radius:50%; border:1px solid var(--red);
  background: var(--red-dim); color: var(--red); font-family:var(--mono); font-size:.7rem;
  cursor:pointer; z-index:5; }
[data-tier="rich"] .pin { animation: pulse 2s var(--ease) infinite; }
@keyframes pulse { 0%,100%{ box-shadow:0 0 0 0 var(--red-dim);} 50%{ box-shadow:0 0 0 6px transparent;} }
```
- Click a pin → `showDrawer(cite, DATA[cite])` — reuse the existing evidence-drawer machinery. A pin
  is just another `data-cite` trigger, so no new drawer code is needed. Hover shows a one-line
  tooltip (the S-NNN's claim text).
- **Tier:** rich = pulsing pins + hover tooltip; balanced = static pins + drawer; **simple = pins
  become inline numbered footnotes beneath the component** (so nothing depends on positioning/JS).
- **Evidence:** a pin whose `data-cite` doesn't resolve to a real S-NNN is a **build error** — pins
  are the tightest binding between illustration and evidence, and must never be decorative.

---

### Dynamic Contextual Blocks (mandatory — at least 2 per KL)

Beyond static cards: blocks that respond to context and user position.

**Related concept highlights:** when user opens a card citing `S-NNN`, other cards citing
the same `S-NNN` subtly highlight (border color shift + `▸` indicator). Removes the need
to explain connections; makes them visible.

**Focus mode toggle** (keyboard shortcut `f`): dims all sections except the currently active
one to 15% opacity. Lets the reader inhabit one KL argument completely. Re-press to exit.

**Signal-view toggle** (keyboard shortcut `s`): strips all prose, shows only claim chips +
S-NNN traces. "Show me only the evidence." One toggle reveals the skeleton of the argument.

**Confidence meter per KL**: a small visual indicator showing the ratio of [ASSERT] to
[HEDGE] to [GAP] entries in that KL's support. Uses `█` blocks in green/amber/red.
Not a score — a transparency signal: "here is how certain we are about this KL."

```javascript
function renderConfidence(kl) {
  const a = kl.assert, h = kl.hedge, g = kl.gap, total = a + h + g;
  const bar = '█'.repeat(Math.round(a/total*10))
            + '▓'.repeat(Math.round(h/total*10))
            + '░'.repeat(Math.round(g/total*10));
  return bar + '  ' + a + 'A ' + h + 'H ' + g + 'G';
}
```

---

### Advanced Inline Visualizations (one per KL, specific to its argument)

Do not repeat visualization types across sections. Each KL gets the visualization that best
enacts its specific argument:

Components from the Component Library are first-class options here. One component per KL; never
repeat a component type across KLs.

| KL argument type / topic signal | Recommended visualization / component |
|---|---|
| Sequential process / pipeline | ASCII flow diagram with animated arrows |
| Before/after / reversal (INSIGHT) | Split ASCII panel / Family D `BEFORE-AFTER` slider |
| Quantitative comparison | `═▓░` progress bars built on scroll-in, colored by value |
| System architecture | Box-drawing architecture diagram with hover-highlighted components |
| Chain / linked structure | Linked boxes building left to right, hash/id labels |
| Counter-intuitive ordering | Ranked list that animates reordering from "expected" to "actual" |
| Binary classification (true/false, ✓/✗) | ASCII grid with staggered fill |
| The subject IS a rendered artifact (email, screen, message, UI, config) | Family A fidelity mockup |
| A sequence, journey, lifecycle, or branching process | Family B flow / swimlane / sequence / decision-tree / timeline |
| Magnitude, rate, drop-off, or conversion | Family C funnel / KPI tiles / gauge / cohort / waterfall |
| A choice among options, positioning, or scoring | Family D quadrant / compare-matrix / scorecard |
| System structure / parts of a whole | ARCHITECTURE-DIAGRAM (ASCII or SVG) |
| A mechanism with a tunable input | PARAMETER-PLAYGROUND |
| Mutually-exclusive case categories | TABBED-SCENARIO |

**If no component enacts the KL better than prose + one ASCII motif, use the ASCII** — components
are earned by the argument, not mandatory per section.

Visualizations are built in place, inside the section, not inside cards. They are visible
without interaction. Cards are for the evidence behind the visualization.

---

### Navigation and Reading Experience

**Sticky nav:** 48px height, `backdrop-filter: blur(20px) saturate(180%)`, scroll-spy via
IntersectionObserver. Active section: color + background shift. Horizontal scroll on
overflow (mobile), no visible scrollbar.

**Progress arc:** right-fixed, `position: fixed; right: 1rem; top: 50%; transform: translateY(-50%)`.
Vertical track (2px wide, `--border` color) with a 8px dot that moves to reflect current
section (based on active-section index, not raw scroll %). Section labels on hover.

**Keyboard navigation:**
- `j` / `↓` — next section
- `k` / `↑` — previous section
- `f` — focus mode toggle
- `s` — signal-view toggle
- `/` — jump to search (if signal-view active, filter cards by S-NNN)
- `Esc` — close evidence drawer / exit focus mode

**Section depth indicator** (in each section header): tiny monospace breadcrumb
`GT → KL2 → §detail` that updates as user opens nested cards.

---

### Content Fidelity Requirement (before declaring Phase 6 done)

Every sentence in the HTML traces to the pyramid, which traces to the signal block.
The HTML renders the pyramid — it does not expand or improve it.
Any sentence not in the pyramid: remove it or add it to the pyramid with an S-NNN trace first.

Write the file:
```javascript
// The complete output is ONE .html file
// open it:
// open <filename>.html
```

Operator confirms the file works live in a browser. Not self-certified.

```
[ILLUMINATE:GATE] Phase 6 PASS (operator-confirmed) | File: <filename>.html | Size: <KB>
Palette: <name> | Theme: dark+light verified | Tiers: simple/editorial/rich verified
Techniques: parallax / ascii-interactive / accordion / evidence-drawer
Dynamic blocks: focus-mode / signal-view / confidence-meter / related-highlights
```

---

## Phase 7 — Verify

**GT drift check:**
Read `/tmp/illuminate-anchor.md` (line 1 = anchored GT). Compare verbatim to the pull quote in the HTML.
Paraphrase drift = failure. Fix before proceeding.

**21-item checklist (run in rich+dark by default; then spot-check tiers, light mode, and palette):**

*Content and hierarchy*
- [ ] GT immediately legible on load, above fold, without interaction
- [ ] S, C, Q, A all visible in hero without scrolling or expanding
- [ ] **Two-disclosure-levels invariant:** no evidence reachable in more than 2 taps from the GT (NN/g — 3 degrades usability). INSIGHT entries are never behind a closed accordion.
- [ ] Each section's supporting prose is *full* (drilled, not compressed): ledes are real paragraphs, not label fragments
- [ ] **No load-bearing nuance from the signal block was dropped to fit the pyramid.** A knowledgeable reader finds the full reasoning present in the disclosure layers; a complex source reads as complex, not as a skeleton (D2)
- [ ] **Verification was earned, not manufactured** (D1): a plainly-stated, non-empirical source triggered zero fetches and still passed its gates; fetching/chasing happened only for claims that passed the necessity gate; every unverified claim is honestly represented and flagged, never silently upgraded or silently chased
- [ ] GT gradient text renders correctly in dark mode
- [ ] GT text fully legible in light mode (no invisible gradient on cream)

*Theme*
- [ ] Theme toggle button (`◑`/`◐`) visible in nav; click switches correctly
- [ ] No flash of wrong theme on hard reload (inline `<head>` script fires before paint)
- [ ] All semantic colors (`--red`, `--cli`, `--amber`, `--blue`) legible in light mode
- [ ] `--cli` (evidence/ASCII) is deep/muted in light mode, not neon (all palettes)

*Palette*
- [ ] Palette picker (◉) visible in nav; opens popover with 6 swatches on click
- [ ] Active palette swatch highlighted; switching palette changes tokens without page reload
- [ ] Chosen palette persists across hard reload (localStorage `il-palette` applied in boot script)
- [ ] In the operator's chosen palette, all semantic tokens maintain WCAG AA contrast in both themes

*Render tiers*
- [ ] Tier selector (`s·e·r`) visible in nav; active tier highlighted in editorial red
- [ ] **simple**: page fully readable; no broken layout from missing animations
- [ ] **editorial** (default): typewriter GT, purposeful motion, no parallax
- [ ] **rich**: editorial + opt-in parallax (2–3 layers); scan-line accordion; evidence drawer

*Interactivity*
- [ ] Parallax layers move at different speeds on scroll (rich tier)
- [ ] Evidence drawer opens on S-NNN click, shows correct entry (editorial+)
- [ ] Focus mode `f` and signal view `s` toggles work on all tiers

*Accessibility and hygiene*
- [ ] `prefers-reduced-motion`: all animations disabled, layout unchanged, content identical
- [ ] No console errors on any tier or theme combination
- [ ] Self-contained: no external requests beyond declared CDN libraries

**[ILLUMINATE:IMPECCABLE-CHECK]** (run alongside 21-item checklist):

*Typography:*
- [ ] Body text ≤72ch (doc: 72ch strict; web/deck: 65–72ch)
- [ ] `text-wrap: balance` on h1–h3; `text-wrap: pretty` on long prose
- [ ] Heading clamp max ≤6rem
- [ ] 4.5:1 contrast body text; 3:1 large text (≥18px or bold ≥14px)
- [ ] No muted gray body text on tinted near-white

*Motion (Emil Kowalski):*
- [ ] No `transition: all` — exact properties specified
- [ ] No `ease-in` on UI — `--ease-out` custom curve only
- [ ] No `scale(0)` entry — minimum `scale(0.95)` + `opacity: 0`
- [ ] GPU-only: `transform` + `opacity` animated; no layout props
- [ ] CSS transitions over keyframes for accordion, evidence drawer
- [ ] Stagger 30–80ms; interaction never blocked during stagger
- [ ] `@media (hover: hover) and (pointer: fine)` on all hover states

*Absolute bans (impeccable):*
- [ ] No side-stripe borders (>1px colored left/right as accent)
- [EXEMPT — GT only] Gradient text: GT only, intentional, explicitly exempted
- [ ] No glassmorphism as default decoration
- [ ] No identical card grids
- [ ] No eyebrow uppercase kicker above every section (KL numbers are structural hierarchy)

*SVG / illustration:*
- [ ] All SVG uses `currentColor` + token vars — no hardcoded colors
- [ ] SVG responds correctly to theme + palette switch
- [ ] DataViz passes palette token vars to chart config

*Components:*
- [ ] Each component traces: every concrete label/figure/string is either S-NNN-cited or visibly placeholder
- [ ] Every component carries an ILLUSTRATION tag OR citation chips — the two registers are never blurred
- [ ] Metric components show no untraced numbers (untraced → `00.0%` / `—` placeholder)
- [ ] Components degrade cleanly at simple/balanced; content identical across tiers
- [ ] Annotation pins open the correct evidence-drawer entry; every pin resolves to a real S-NNN
- [ ] Components use `var(--…)` tokens only — correct in all 6 palettes, both themes (spot-check 2)

*Deck-only (when Mode = deck):*
- [ ] No slide content overflow (overflow = argument too long = gate failure → shorten + re-run Phase 3)
- [ ] `min-h-[100dvh]` on fullscreen, never `h-screen` (iOS Safari bug)
- [ ] `@media print` verified: page-break-after, no animation, no controls

**Phase 7 failure path — correction register (same 3-attempt, escalate-on-exhaust as Phases 1–4):**

When any checklist item fails, do not silently fix and re-mark PASS. Use the structured path:

1. **Name the problem precisely.** Not "parallax broken" — "hero-bg translateY not firing; scrollY reads 0 inside RAF in this context."
2. **Emit the correction signal:**
   ```
   [ILLUMINATE:CORRECT] Attempt <N>/3 on Phase 6 | Problem: <specific item — root cause>
   ```
3. **Make a targeted fix** — change only the broken component. Do not rebuild the file from scratch.
4. **Re-run only the failing items** (not the full checklist). Item removed from problem list on pass.
5. **Repeat for attempts 2 and 3 if needed.**
6. **On attempt 3 with no improvement:**
   ```
   [ILLUMINATE:ESCALATE] Phase 6 unresolved after 3 attempts.
   Problem: <specific item>
   Last attempt: <what was tried and why it failed>
   Operator must intervene. Correction register frozen for this problem.
   ```

**Correction register rules:**
- Each named problem has its own 3-attempt counter. A second broken component starts its own counter independently.
- A fix that breaks a previously passing item is not a fix — revert it and count the attempt.
- Never self-certify a partial pass as a full pass. Report exactly which items pass and which remain open.
- If GT drift is detected: this is not a Phase 6 problem — re-anchor the GT in `/tmp/illuminate-anchor.md` and re-run Phase 6 from scratch.

```
[ILLUMINATE:CLOSE] File: <filename>.html
──────────────────────────────────────────────────────────────────────
Stage I    Phase 0  config+audit     PASS  palette: <name> | tier: <e/r/s> | mode: <web/doc/deck>
                                           source: <type>, density: <H/M/L>
           Phase 1  signal-extract   PASS  <N> entries, <N> insights, refs: <N>
           Phase 1b faithful-source  PASS  <N> contested, <N> refuted, <N> hedged
Stage II   Phase 2  concept-map      PASS  hubs: <N>, issue-tree: <N> sub-Qs
           Phase 3  pyramid          PASS  GT confirmed, KL: <N>, MECE: <type>
           Phase 4  audit            PASS  10/10 · 3-skeptic: all resolved
Stage III  Phase 5  architecture     PASS  wireframe: <N> sections, 14 components
           Phase 6  engineering      PASS  operator-confirmed, <KB> [corrections: <N>]
                                           palette: <name> | theme: dark+light
                                           tiers: simple/editorial/rich
                                           Components: <families used — mockup/flow/metric/decision>
           Phase 7  verify           PASS  GT drift: none · 21/21 · impeccable: PASS
──────────────────────────────────────────────────────────────────────
Output: <filename>.html (<KB>)
Anchors: /tmp/illuminate-signal.md · /tmp/illuminate-hubs.md · /tmp/illuminate-anchor.md
```

---

## Output Contract

1. **Tier-scaled dynamism** — `rich` is fully alive; `editorial` is readable and interactive;
   `simple` is clean, content-first. No tier produces a broken or unstyled page.
2. **Libraries freely** — any JS/CSS library that enhances the experience; CDN or build step both fine
3. **Swiss editorial design** — Helvetica Neue 300 (GT/hero) + Futura 700 (section titles/labels) +
   monospace (evidence/ASCII). 12-column CSS grid with visible column overlay. Editorial red accent,
   `--cli` token for evidence only (deep green in light mode). Ghost section numbers in Futura at ~20vw.
   Custom cursor with `mix-blend-mode:difference` (rich tier). Progress stripe anchored to nav bottom.
4. **Named palette** — operator chooses from 6 curated palettes in Phase 0. Default is `illuminate`
   (Swiss editorial cold). Others: `claude` (terracotta), `greenhouse` (eucalyptus), `typeset`
   (printer's ink), `signal` (phosphor), `archive` (parchment). Each has dark+light variants; all
   semantic tokens maintain WCAG AA in both modes. Picker (◉) lives in sticky nav.
5. **Dual-mode theme** — dark (default) + light, togglable via `◑`/`◐` in sticky nav. No flash on
   load. `--cli` is always de-saturated in light mode (never neon). Light mode ground matches the
   chosen palette's character — warm cream (claude), cool paper (signal), parchment (archive), etc.
6. **Render tier selector** — `s·e·r` buttons in nav. Defaults to `editorial`. Persists in localStorage.
   CSS guards + JS helpers ensure every feature degrades cleanly at lower tiers.
7. **3-level hierarchy** — GT → KLs → supporting detail, all navigable
8. **Parallax hero** — 3 layers (rich) / 2 layers (editorial) / none (simple)
9. **Interactive ASCII** — full animation + hover nodes (rich) / 2× speed animation (editorial) / instant (simple)
10. **Accordion** — scan-line open + nested components (rich) / height transition (editorial) / instant (simple)
11. **Dynamic contextual blocks** — focus mode, signal view, confidence meter, related highlights
    (active on all tiers — navigation features, not decoration)
12. **Pyramid-faithful** — site structure mirrors the SCQA pyramid exactly, no expansion
13. **Accessible** — semantic HTML, keyboard navigable (j/k/f/s/Esc), reduced-motion respected
14. **Source-faithful** — every claim traces to signal block; every INSIGHT appears
15. **Component library** — where the KL argument is best enacted by an artifact (fidelity mockup),
    a process (flow/sequence/timeline), a magnitude (funnel/KPI/gauge), or a choice
    (quadrant/matrix), a self-contained, tokened, tier-degradable component fills the INLINE-VISUAL
    slot, governed by the ILLUSTRATE discipline. Mockup/metric content is bounded by the signal block.

---

## Environment Adaptation

| Tool | Phase | How it enriches the arc |
|---|---|---|
| vault search `<topic>` | Phase 1 | Prior signal; tag `[VAULT]`; skip re-extraction. RTK: `rtk vault search`; skip gracefully if unavailable |
| `/faithful-sourcing` skill | Phase 1b | Adversarial provenance check on signal block |
| graphify / `semantic_search_nodes` | Phase 2 | Structural node relationships; tag `[GRAPH]` |
| `get_impact_radius` | Phase 2 | Hub propagation through codebase communities |

When these tools are absent, internal fallback procedures apply.
Quality is identical. Only tooling differs.

---

## The Self-Certification Problem

**`/illuminate` is haunted by the model that runs it.**

Every enforcement mechanism — the 3-angle scan, the MECE tests, the 3-skeptic procedure,
the 12-item verify checklist — is executed by the same model it is designed to constrain.
The model grades its own signal block. The model passes its own gates. The lock is made
of the same material it holds.

The mitigation is structural, not exhortatory:


| Mitigation | Mechanism |
|---|---|
| Mechanical invariants first | File exists or not. S-NNN present or not. Word count is a number. Use these before model judgment. |
| Disk anchors over inline claims | A file at `/tmp/illuminate-anchor.md` is harder to retroactively rationalize than an in-context claim. |
| Named attack angles with single modes | Skeptics A/B/C each have one and only one attack. Generic approval is invalid output. |
| Operator-mandatory Phase 6 gate | Model cannot self-certify the HTML. Operator must confirm in browser. |
| Named gaps and exclusions | Any claim removed, any orphan discarded, any angle failure must be stated explicitly. Silence is not a pass. |

What cannot be mitigated: if the model decides to rationalize, no instruction stops it.
Design for containment, not exorcism. Signal, do not certify.

---

## Rules

**Phase discipline**
1. Never skip a phase gate.
2. Never advance without the prior phase's disk anchor present and readable.
3. Correction register: max 3 re-attempts per gate, then escalate to operator.

**Input quality**
4. Follow **load-bearing** referenced files in Phase 1 (those whose reading could change a hub, a KL, or the GT); record the rest as referenced-but-not-read. An unclosed **load-bearing** provenance chain = gate failure; unread non-load-bearing references are not. Verification is earned by the claim, not owed to the source — do not manufacture reads to signal rigor.
5. Run downstream completeness check in Phase 2 for every hub candidate.
6. Never silently truncate a source. Declare what was excluded and why.
7. INSIGHT entries must appear in the pyramid. They are the highest-value signal.

**Pyramid integrity**
8. GT must directly resolve Q. Hedging is not a GT.
9. KL necessity, sufficiency, and independence: all three tests pass or KL is revised.
10. Never paraphrase the GT between phases. It must match the disk anchor exactly.
11. Pass B skeptic arguments: rebuttal = specific S-NNN citation, not general agreement.
12. If source is insufficient for a coherent pyramid, say so. Do not fabricate structure.

**Output quality**
13. Never label the frameworks in the UI. Sections state arguments, not framework labels.
14. Never produce a flat undifferentiated page. The output is a nested, navigable editorial site.
15. Visual hierarchy enacts the pyramid: GT most prominent, KLs equal peers, detail is depth.
16. Interactive ASCII, evidence drawer, progressive disclosure, focus mode: mandatory. Parallax:
    opt-in via the rich tier only. 3D physics and scramble reveals: not used (editorial restraint).
17. Never self-certify Phase 6. Operator confirms in browser. Failures re-enter Phase 6 via the correction register — same 3-attempt, escalate-on-exhaust pattern as Phases 1–4.
18. The HTML renders the pyramid — it does not expand the argument (no new claims). But it MUST fully elaborate the existing content: the reasoning and caveats behind each KL live in the disclosure layers. Rendering is not condensing; dropping a load-bearing nuance to fit the pyramid is a fidelity violation.

**Technical constraints**
19. Component vocabulary is shadcn/ui (Radix + Tailwind patterns). Any JS/CSS library is allowed when it serves legibility — D3/Observable Plot for real data viz, Tailwind for layout. CDN and build steps (Vite, esbuild) both fine. Not for decoration: an effect that doesn't aid understanding doesn't ship.
20. Prefer vanilla only when it is faster to write and equally expressive. Never avoid a library out of principle — avoid it only when it adds complexity without payoff.

**Component library**
21. Components are earned by the argument, never decorative. One component per KL; never repeat a component type across KLs.
22. Every component is an ILLUSTRATE surface. Concrete content traces to an S-NNN or renders as visibly-generic placeholder. A fabricated number, quote, or result inside a component is the gravest evidence violation — the most believable one.
23. Every component is self-contained (no external images), palette-tokened (`var(--…)` only), and tier-degradable (rich/balanced/simple) with content identical across tiers.
24. Annotation pins are `data-cite` triggers into the existing evidence drawer. A pin without a resolving S-NNN is a build error.
