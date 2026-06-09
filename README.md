# illuminate

```
                        · ✦ · ✦ · ✦ · ✦ ·
                    ✦ ·                   · ✦
                 ✦ ·   argument structure   · ✦
               · ·        made legible        · ·
             ✦ ·         ╭───────────╮         · ✦
            · ·         ╱  ╲       ╱  ╲         · ·
           ✦ ·         │    ╲─────╱    │         · ✦
           · ·         │    ╱     ╲    │         · ·
           ✦ ·         │   ╱       ╲   │         · ✦
            · ·        ╰─────────────╯         · ·
             ✦ ·          ╔═══════╗           · ✦
               · ·        ╠═══════╣         · ·
                 ✦ ·      ╚═══════╝       · ✦
                    ✦ ·               · ✦
                        · ✦ · ✦ · ✦ ·

               dense source in · interactive HTML out
```

**A Claude Code skill.** Three locked stages. Zero dependencies. One file. Opens anywhere, forever.

---

## What it does

```
  ┌───────────────────────────────────────────────────────────────────┐
  │  any dense source                                                 │
  │                                                                   │
  │  research corpus · book · codebase · multi-file dump             │
  │  conversation archive · whitepaper · spec document               │
  │                                                                   │
  │                           │                                       │
  │                           ▼                                       │
  │                    /illuminate                                    │
  │                           │                                       │
  │                           ▼                                       │
  │                                                                   │
  │  single .html — parallax hero · 3D card physics                  │
  │               · interactive ASCII · evidence drawer              │
  │               · focus mode · signal view · keyboard nav          │
  │               · GT typewriter · confidence meters                │
  │                                                                   │
  │  opens in any browser · works offline · no server needed         │
  └───────────────────────────────────────────────────────────────────┘
```

---

## The Arc

Three stages. Each is a named capability block with quality tests and gate conditions.
The stages are not phases to rush through — they are the method.

```
  ╔══════════════════════════════════════════════════════════════════╗
  ║  STAGE I · INPUT                                                 ║
  ║                                                                  ║
  ║   source ──▶ Phase 0: audit  ──▶ Phase 1: 3-angle extract       ║
  ║                                                                  ║
  ║   angle 1  ·  structural   (what IS stated)                      ║
  ║   angle 2  ·  synthetic    (what IMPLIES)                        ║
  ║   angle 3  ·  adversarial  (what ISN'T stated)                   ║
  ║                                                                  ║
  ║   output: S-001 … S-NNN  named signal block  →  disk anchor     ║
  ║           SOURCE · INSIGHT★ · METRIC · PRINCIPLE                ║
  ║           SYNTHESIS · GAP · CONTESTED · REFUTED                 ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  STAGE II · PROCESS                                              ║
  ║                                                                  ║
  ║   signal block ──▶ hub detection  (rank nodes by degree)        ║
  ║               ──▶ issue tree      "Why is [GT] true?"           ║
  ║               ──▶ MECE type       process / structure / sit.    ║
  ║               ──▶ Minto Pyramid   SCQA + Key Lines              ║
  ║               ──▶ 3-skeptic audit                               ║
  ║                   A: logical · B: evidential · C: completeness  ║
  ║                                                                  ║
  ║   output: pyramid anchor  →  disk before gate passes            ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  STAGE III · OUTPUT                                              ║
  ║                                                                  ║
  ║   pyramid anchor ──▶ visual architecture  ──▶  HTML build        ║
  ║                                                                  ║
  ║   SCQA hero  ·  GT typewriter  ·  parallax (3 depth layers)     ║
  ║   KL sections  ·  3D card physics  ·  interactive ASCII art     ║
  ║   evidence drawer  ·  confidence meters  ·  keyboard nav        ║
  ║   focus mode  ·  signal view  ·  progress arc                   ║
  ║                                                                  ║
  ║   output: single .html  ·  zero deps  ·  permanently legible    ║
  ╚══════════════════════════════════════════════════════════════════╝
```

---

## The Illumination

**Complexity → clarity.** The transformation:

```
  INPUT                                          OUTPUT

  ▓▓▒▒░░▓▓▒▒░░▓▒░▓▒░▓▒░▓▓▒▒░░     →       ╔══════════════════════╗
  ▒▒░░▓▓▒▒░░▓▓▒░▓▒░▓▒░░▒▒░░▓▓     →       ║  GT  ████████████   ║
  ░░▓▓▒▒░░▓▓▒▒░▓▒░▓▒░▓▒░░▓▓▒▒     →       ║  KL1 ████████░░░░   ║
  ▓▒░▓▒░▓▒░▓▓▒▒░░▒▒░░▓▓▒▒░░▓▒     →       ║  KL2 ██████░░░░░░   ║
  ░▓▒░░▒▒░░▓▒░░▓▓▒▒░░▓▓▒▒░░▓▒     →       ║  KL3 ████░░░░░░░░   ║
                                            ╚══════════════════════╝

  dense unstructured material         navigable logical hierarchy
  · claims mixed with noise           · GT immediately legible
  · hierarchy implicit                · KLs equal peers (MECE)
  · evidence untraced                 · every claim traces to S-NNN
  · insights buried                   · insights surfaced + enacted visually
```

---

## Signal Stratification

Every extracted entry gets one primary tag:

```diff
+ SOURCE      directly stated in the material
+ INSIGHT ★   counter-intuitive · reverses an assumption  ← prime KL candidates
  METRIC      quantified claim with a stated source
  PRINCIPLE   generalizable rule stated or implied
  SYNTHESIS   implied by the combination of ≥2 SOURCE entries
- GAP         what the source doesn't address that would complete it
```

Secondary flags:
```
  [CONTESTED:unverified]     figure cited without a checkable reference
  [CONTESTED:absolute]       "always / never / all" universal claim
  [CONTESTED:contradiction]  conflicts with another entry — tag both
  [ASSUMPTION:basis-unknown] treated as truth, never defended
  [REFUTED]                  primary source checked · claim is false
```

> **★  INSIGHT entries are the best candidates for Key Lines.**
> They carry the most argumentative weight.
> A pyramid without at least one INSIGHT is a summary, not an argument.

---

## Evidence Discipline Contract

Governs the entire arc. Not a phase — the law.

```
  ┌────────────┬──────────────────────────────────────────────────────┐
  │  ASSERT    │  only claims that trace to a specific S-NNN entry    │
  │  HEDGE     │  claims where evidence is partial or contested       │
  │  EXCLUDE   │  claims where the trace cannot be established        │
  └────────────┴──────────────────────────────────────────────────────┘

  Violations in any phase are removed and the gap is named.
  Confidence is not evidence.
  Paraphrasing a weak claim into apparent support is a violation.
  Leaving a claim unchallenged because it seems plausible is a violation.
```

---

## The Pyramid

```
                          ▲
                         ╱▲╲
                        ╱ GT╲          ← Governing Thought
                       ╱─────╲            directly answers Q · could be wrong
                      ╱  KL1  ╲
                     ╱─────────╲       ← Key Lines  (MECE)
                    ╱ KL2   KL3 ╲         non-overlapping · exhaustive
                   ╱─────────────╲        each one takes down the GT if removed
                  ╱  d·a      d·b ╲
                 ╱─────────────────╲  ← Supporting detail  (S-NNN traces)

  SCQA arc:  Situation → Complication → Question → Answer (GT)

  KL tests:  necessity    does this KL's evidence prove IT, not just GT?
             sufficiency  do all KLs together make GT inarguable?
             independence would GT fail if this KL were removed?

  3-skeptic: A: logical      scenario where S-NNN true but KL false
             B: evidential   KL paraphrasing beyond what S-NNN states?
             C: completeness what hub has no KL?
```

---

## Visual Encoding

The output *renders* the pyramid — it does not illustrate it.

```
  LOGICAL CLAIM               VISUAL ENACTMENT
  ─────────────               ────────────────

  GT is the answer            ·  oversized gradient text
                              ·  typewriter arrival on load
                              ·  highest contrast on page

  S+C+Q build tension         ·  Q appears after S+C (static)
  GT resolves it              ·  GT builds character-by-character
                              ·  pause at the em-dash

  KLs are MECE peers          ·  identical section anatomy
                              ·  same visual weight
                              ·  visual equality = logical equality

  evidence has depth          ·  parallax: GT at front, evidence receding
                              ·  3D card tilt: mouse-driven perspective

  signal is traceable         ·  S-NNN chips → evidence drawer
                              ·  signal-view (s): strips prose, shows traces
                              ·  confidence meter: █▓░ per KL
```

---

## Output Anatomy

```
  ┌─ single .html ─────────────────────────────────────────────────┐
  │                                                                │
  │  HERO                                                          │
  │    GT ── oversized gradient typewriter · first thing seen      │
  │    SCQA-ARC ── S · C · Q · answer blocks                       │
  │    PIPELINE-DIAGRAM ── ASCII · builds after GT completes       │
  │    PROGRESS-ARC ── fixed right · dot moves per section         │
  │    PARALLAX ── 3 depth layers at different scroll speeds       │
  │                                                                │
  │  SECTIONS  (one per KL · identical anatomy — MECE enacted)     │
  │    SECTION-MOTIF ── thematic ASCII · builds on scroll-in       │
  │    SECTION-HEADER ── KL number + argument statement            │
  │    SECTION-LEDE ── standalone paragraph (reads cold)           │
  │    INLINE-VISUAL ── data grid / comparison / chain / tree      │
  │    ACCORDION-CARDS ── scan-line open · 3D tilt · nested        │
  │      evidence tags S-NNN ── click → drawer slides in           │
  │                                                                │
  │  NAVIGATION                                                    │
  │    STICKY-NAV ── scroll-spy · keyboard j/k                     │
  │    EVIDENCE-DRAWER ── slides from right · full S-NNN body      │
  │    FOCUS-MODE (f) ── dims all but active section               │
  │    SIGNAL-VIEW (s) ── strips prose · shows only evidence       │
  │                                                                │
  └────────────────────────────────────────────────────────────────┘
```

---

## Install

```bash
git clone https://github.com/marcomorettim/illuminate ~/.claude/skills/illuminate
```

Then in Claude Code:

```
/illuminate <source>
```

---

## Usage

```bash
/illuminate whitepaper.md            # research corpus
/illuminate book-chapters/           # long-form, chapter-chunked
/illuminate src/                     # codebase provenance chain
/illuminate conversation.md          # transcript or dialogue
/illuminate spec.md notes.md         # multi-source, synthesized
```

---

## The ASCII Engine

```
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║  buildArt(el, lines, opts)                                    ║
  ║                                                               ║
  ║  ·  charDelay: 12ms  ·  lineDelay: 40ms                       ║
  ║  ·  onDone: cascade next component                            ║
  ║  ·  prefers-reduced-motion: instant render                    ║
  ║                                                               ║
  ║  art-nodes: named concepts wrap as <span>                     ║
  ║  on hover → highlight section + animate connecting paths      ║
  ║                                                               ║
  ║  character vocabulary:                                        ║
  ║    ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼   box drawing                       ║
  ║    ━ ┃ ╔ ╗ ╚ ╝ ╠ ╣ ╦ ╩ ╬ ═  heavy                            ║
  ║    ░ ▒ ▓ █                   fill grades (heat / density)     ║
  ║    → ← ↑ ↓ ↗ ↘ ⟶ ⟵ ▸ ▹      arrows                          ║
  ║    ■ □ ◆ ◇ ● ○ ◉ ⊕           geometric nodes                 ║
  ║    ✓ ✗ ~ · × ★ ✦             status marks                    ║
  ║                                                               ║
  ║  no emoji · every character represents a logical relation     ║
  ╚═══════════════════════════════════════════════════════════════╝
```

Section reveal sequence — enacts pyramid descent in DOM order:

```
  MOTIF builds ──▶ HEADER fades in ──▶ LEDE fades in
       │
       └──▶ INLINE-VISUAL builds  ──▶  ACCORDION-CARDS stagger
            (parallel to header)        100ms per card · 400ms base
```

---

## The Self-Certification Problem

```
  every enforcement mechanism —
  the 3-angle scan, the MECE tests, the 3-skeptic procedure,
  the 12-item verify checklist —

  is executed by the same model it is designed to constrain.

  the model grades its own signal block.
  the model passes its own gates.

  ┌──────────────────────────────────────────────────────────┐
  │  the lock is made of the same material it holds.         │
  └──────────────────────────────────────────────────────────┘

  the honest response: make the ghost visible · never self-certify

  mitigations:

    ·  mechanical invariants first  (file exists or not · not model opinion)
    ·  disk anchors  (harder to retroactively rationalize than in-context claims)
    ·  named attack angles  (generic approval is explicitly invalid output)
    ·  operator-mandatory Phase 6  (model cannot self-certify the HTML)
    ·  named gaps  (silence is not a pass)

  what cannot be mitigated:
    if the model decides to rationalize, no instruction stops it.
    design for containment, not exorcism.
```

---

## Keyboard

| Key | Action |
|-----|--------|
| `j` / `↓` | next section |
| `k` / `↑` | previous section |
| `f` | focus mode — dim all but active section |
| `s` | signal view — strip prose, show only evidence |
| `Esc` | close drawer / exit mode |

---

## License

MIT
