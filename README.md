# illuminate

```
  ██████████████████████████████████████████████████████████
  ██                                                      ██
  ██   dense source in.  self-contained HTML out.         ██
  ██                                                      ██
  ██   /illuminate <source>                               ██
  ██                                                      ██
  ██████████████████████████████████████████████████████████
```

A Claude Code skill. Three stages. One file. No dependencies. Opens in any browser, forever.

---

## The Arc

```
  ┌─────────────────────────────────────────────────────────────────┐
  │  STAGE I  ·  INPUT                                              │
  │                                                                 │
  │   source ──▶ audit ──▶ angle 1 (structural)                    │
  │                    ──▶ angle 2 (synthesis + insight)           │
  │                    ──▶ angle 3 (adversarial)                   │
  │                    ──▶ provenance trace (mandatory)            │
  │                    ──▶ faithful-sourcing gate                  │
  │                                                                 │
  │   output: S-001 … S-NNN  stratified signal block               │
  │           SOURCE · INSIGHT · METRIC · PRINCIPLE                │
  │           SYNTHESIS · GAP · CONTESTED · REFUTED                │
  ├─────────────────────────────────────────────────────────────────┤
  │  STAGE II  ·  PROCESS                                           │
  │                                                                 │
  │   signal block ──▶ hub detection (rank by degree)              │
  │               ──▶ issue tree  "Why is [GT] true?"              │
  │               ──▶ MECE type  process / structure / situation   │
  │               ──▶ Minto Pyramid  SCQA + Key Lines              │
  │               ──▶ 3-skeptic adversarial audit                  │
  │                   Structuralist · Bayesian · Pragmatist        │
  │                                                                 │
  │   output: pyramid anchor  (written to disk before gate)        │
  ├─────────────────────────────────────────────────────────────────┤
  │  STAGE III  ·  OUTPUT                                           │
  │                                                                 │
  │   pyramid anchor ──▶ build HTML                                │
  │      · boot overlay + terminal sequence                        │
  │      · SCQA hero  ·  GT typewriter  ·  sticky GT strip        │
  │      · stats strip  ·  KL sections  ·  confidence meters      │
  │      · insight callouts  ·  evidence drawer                    │
  │      · ASCII art engine  ·  3D card physics                   │
  │      · parallax (4 layers)  ·  keyboard nav                   │
  │                                                                 │
  │   output: single .html — zero deps — permanently legible       │
  └─────────────────────────────────────────────────────────────────┘
```

---

## Fork Topology

> Derived from graphify traversal of `orky/governance.py` + `orky/agent.py`.
> Nodes: CorrectionRegister (degree 13), Membrane (degree 10), run() (degree 11).

```
  /illuminate invoked
        │
        ▼
  ┌─────────────┐
  │  Phase 0    │  environment + source audit
  │  gate       │
  └──────┬──────┘
         │ PASS                          FAIL ──▶ halt · name reason · do not proceed
         ▼
  ┌─────────────┐      ┌─────────────────────────────────────────┐
  │  Phase 1    │      │  run() calls:                           │
  │  gate       │      │    Membrane.sanitize()                  │
  └──────┬──────┘      │    Membrane.check_output()              │
         │ PASS        │    SoilTracker                          │
         │             │    MemorySubstrate                      │
         │  FAIL       │    CorrectionRegister.attempt()  ──┐    │
         │    │        │    CorrectionRegister.remaining() ─┤    │
         │    │        │    CorrectionRegister.exhausted() ─┘    │
         │    │        └─────────────────────────────────────────┘
         │    │
         │    └──▶ CorrectionRegister.attempt()
         │              │
         │         attempt 1 ──▶ re-run phase
         │         attempt 2 ──▶ re-run phase
         │         attempt 3 ──▶ re-run phase
         │         .exhausted() == true
         │              │
         │              ▼
         │         [ILLUMINATE:ESCALATE]  ──▶ operator must intervene
         │         correction register frozen for this problem
         │
         ▼
  ┌─────────────┐
  │  Phase 2    │  concept map · issue tree · pyramid
  │  gate       │
  └──────┬──────┘
         │ PASS                          FAIL ──▶ CorrectionRegister (same path)
         ▼
  ┌─────────────┐
  │  Phase 3    │  3-skeptic audit · HTML build
  │  gate       │
  └──────┬──────┘
         │ PASS                          FAIL ──▶ CorrectionRegister (same path)
         ▼
  ┌─────────────────────────────────────────┐
  │  AccountabilityChain.log(gate-pass)     │
  │  RewardSignal (clean close only)        │
  │  LLMJudge (self-cert guard)             │
  │  output: <source-name>.html             │
  └─────────────────────────────────────────┘
```

**Key graphify paths:**

```
  CorrectionRegister  <──calls──  run()  ──calls──▶  LLMJudge
      (2 hops)

  Membrane  <──calls──  PhaseGate  ──calls──▶  Membrane.check_output()
  Membrane  ──implements──▶  XPIA Defense (Cross-Prompt Injection)

  CorrectionRegister  ──implements──▶  3-Attempt Circuit Breaker
  CorrectionRegister  ──implements──▶  Blast Radius Bounding
```

---

## Signal Stratification

```
  every extracted entry gets one primary tag:

  ┌──────────────┬───────────────────────────────────────────────────┐
  │  SOURCE      │  directly stated in the material                  │
  │  INSIGHT  ★  │  counter-intuitive · reverses an assumption       │
  │  METRIC      │  quantified claim with a stated source            │
  │  PRINCIPLE   │  generalizable rule stated or implied             │
  │  SYNTHESIS   │  implied by the combination of ≥2 SOURCE entries  │
  │  GAP         │  what the source doesn't address                  │
  └──────────────┴───────────────────────────────────────────────────┘

  secondary flags (applied on top):

  [CONTESTED:unverified]    figure cited without a checkable reference
  [CONTESTED:absolute]      "always / never / all" universal claim
  [CONTESTED:contradiction] conflicts with another entry (tag both)
  [ASSUMPTION:basis-unknown] treated as background truth, never defended
  [REFUTED]                 primary source checked; claim is false

  ★  INSIGHT entries are the best candidates for Key Lines.
     They carry the most argumentative weight.
     A pyramid without at least one INSIGHT is a summary, not an argument.
```

---

## Evidence Discipline Contract

```
  ┌────────────┬──────────────────────────────────────────────────────┐
  │  ASSERT    │  only claims that trace to a specific S-NNN entry    │
  │  HEDGE     │  claims where evidence is partial or contested       │
  │  EXCLUDE   │  claims where the trace cannot be established        │
  └────────────┴──────────────────────────────────────────────────────┘

  violations in any phase are removed and the gap is named.
  confidence is not evidence.
  leaving a claim unchallenged because it seems plausible is a violation.
```

---

## Install

```bash
# clone into Claude Code skills directory
git clone https://github.com/marcomorettim/illuminate ~/.claude/skills/illuminate
```

Then in Claude Code:

```
/illuminate <path-to-source>
```

---

## Usage

Works on any source type:

```
/illuminate whitepaper.md          → research corpus
/illuminate book.pdf               → long-form (chapter chunked)
/illuminate src/                   → codebase provenance chain
/illuminate corpus/ --arc          → multi-doc evolution arc
```

---

## Output Anatomy

```
  ┌─ single .html file ───────────────────────────────────────────┐
  │                                                               │
  │  [boot overlay]  terminal sequence → fades after 2s          │
  │                                                               │
  │  [hero]          SCQA cards                                   │
  │                  S ── Situation (dim border)                  │
  │                  C ── Complication (amber border)             │
  │                  Q ── Question (accent border)                │
  │                  GT ── Governing Thought (full-width,         │
  │                        typewriter animation, cursor blink)    │
  │                                                               │
  │  [stats strip]   6 computed numbers from signal block         │
  │                                                               │
  │  [sticky GT]     appears on scroll past hero                  │
  │                                                               │
  │  [KL sections]   per Key Line:                                │
  │                    80px ghost section number                  │
  │                    scan sweep animation on entry              │
  │                    CSS confidence bar (animates on scroll)    │
  │                    HEDGE block if < 4/4                       │
  │                    insight callout (before / after)           │
  │                    ASCII art (character-by-character build)   │
  │                    evidence chips → click → drawer            │
  │                    accordions for detail + evidence           │
  │                                                               │
  │  [evidence drawer]  slides in from right                      │
  │                     S-NNN title · tag · full signal body      │
  │                     Escape or backdrop click to close         │
  │                                                               │
  │  [OP cards]      CSS progress bars per open problem           │
  │                  amber pulse glow on OPEN status              │
  │                  click to expand detail                       │
  │                                                               │
  └───────────────────────────────────────────────────────────────┘

  keyboard nav:  j/k → section  ·  f → focus mode  ·  s → signal mode
                 Escape → close drawer
```

---

## Screenshots

**Hero — SCQA + boot sequence**
![Hero](screenshots/hero.png)

**Key Line — confidence bar + insight callout + ASCII art**
![KL section](screenshots/kl-section.png)

**Open Problems — CSS progress bars + OP3 amber pulse**
![OP cards](screenshots/op-cards.png)

---

## Examples

Three real artifacts, open locally — no server required:

| Artifact | Source | Size |
|---|---|---|
| [agentic-os-evolution.html](examples/agentic-os-evolution.html) | 34,600-word whitepaper + 6-doc evolution arc | 83KB |
| [agentic-os-whitepaper.html](examples/agentic-os-whitepaper.html) | Same whitepaper, single-document run | 60KB |
| [greenhouse-memory.html](examples/greenhouse-memory.html) | Greenhouse memory architecture corpus | 70KB |

---

## The Haunting Problem

```
  the greenhouse is haunted by the model that built it.

  every enforcement mechanism — confidence grades, phase gates,
  correction register, adversarial audits — is executed by the
  same language model they are designed to constrain.

  the model grades itself.
  the model passes its own gates.
  the model reports its own drift.

  the correction register (max 3 attempts, then escalate) prevents
  infinite loops. it cannot prevent rationalization.

  the honest response: make the ghost visible. never self-certify.

    · HEDGE and EXCLUDE are surfaced, not hidden
    · confidence scores show their evidence traces
    · KL3 at 3/4 names what it cannot claim at 4/4
    · [ILLUMINATE:ESCALATE] fires rather than silently looping

  the incompleteness is the honesty.
```

---

## License

MIT
