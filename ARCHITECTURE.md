# SorryAssets Skills Architecture

This document is the construction constitution for this repository. It defines
how Skills are cut, structured, and built. It governs Skill design only; it does
not restate the SorryAssets product or backend rules, which live in the
`sorryassets` product repository.

Read this before adding or restructuring any Skill. Read `docs/product-types.md`
for the current product-type roadmap and `docs/styles.md` for the style-library
contract.

## What a Skill Is Here

A Skill is a complete production playbook for one **type of finished video**,
written for a general agent to read and execute. The agent owns all reasoning
and orchestration. SorryAssets provides atomic tools, model access, durable
local state, and delivery. SorryAssets never interprets, compiles, or executes
a Skill.

A Skill is not a workflow engine and not a thin method note. It is a rich,
self-contained instruction set: an agent that reads it should know every stage
a finished piece of this type passes through, what judgment each stage requires,
what "good" looks like, when to stop, how to handle each failure mode, and how
to apply a requested visual style — then drive SorryAssets atomic tools until
the goal is reached.

## First-Principles Frame

When a creator says "make a Pixar-style short film about psychological healing"
or "make a commercial short for product X," the agent needs one thing: a playbook
complete enough to decompose that sentence into a sequence of concrete atomic
calls to SorryAssets. That playbook is a Skill.

Everything in this architecture follows from that scene:

- The creator names a **finished-product type** and, optionally, a **style**.
- The agent must map the request to exactly one product-type Skill, then
  compose it with style and current model capability at runtime.
- The Skill carries the domain workflow; the live catalog carries what is
  currently possible; the agent connects the two.

## The Cutting Axis: Finished-Product Type

Skills are cut by **finished-product type**, not by model, not by interface,
not by internal production stage (character, scene, continuity), and not by
individual creative asset.

Rationale: different finished products have genuinely different workflows.
A commercial short is "lock the product → sell-point shot plan → conversion
close." A narrative short is "script causal chain → characters and scenes →
emotional arc." These workflows cannot impersonate each other, so they are
separate Skills. Within one product type, the workflow is stable across briefs,
so one Skill covers infinitely many briefs of that type.

What is **not** an axis:

- **Model** (Seedance, Veo, Flux …) — a model is data, not a method. Model
  facts live in `references/models/` cards. A Skill discovers current support
  through `get_catalog` and never hardcodes a model.
- **Style** (Pixar, Wong Kar-wai, cyberpunk …) — a style is a cross-cutting
  modifier, not a product. Styles live in `references/styles/` as data entries.
  Making a Skill per style causes combinatorial explosion (type × style).
- **Production stage** (character creation, scene development, continuity) —
  these are common stages every product-type Skill passes through. They live
  as on-demand `references/stages/` files inside each Skill, not as top-level
  Skills.

## Production Skills vs Planning Skills

Most Skills are **production skills**: they take a brief and produce finished
media (narrative-short, commercial-short, remake-short). These are the ones cut
by finished-product type above.

A second, smaller class is **planning skills**: they take raw material and
produce a structured plan that *feeds* a production skill, generating no media
themselves. `adaptation-plan` is the first — it turns a novel or serial into a
series plan whose per-episode briefs each become one `narrative-short` run.

A planning skill is justified only when the planning work is itself large,
reusable across briefs, and a genuine prerequisite that does not fit inside a
production run. Adaptation qualifies: a whole novel cannot enter a single
`narrative-short` run, episode-count and structure reasoning is substantial and
stable across sources, and the output (episode briefs + character map) is
exactly what production consumes. This is distinct from a **production stage**
(character, scene, continuity), which lives inside a production Skill's
`references/stages/` and never stands alone. The test: a stage runs *within* one
finished product; a planning skill runs *before* many of them.

Planning skills follow the same package rules with two honest differences:
their `capabilities` are empty (they call no generation binding), and their
deliverable is text (a plan), not media. They must not bundle generation
references (models, styles, craft) they never use — doing so is dishonest
padding. Their handoff to production is a Skill-level pointer, not a bundled
dependency.

## Video-First Scope

The current focus is video creation for creators (not developers). The main
work of an AI video creator happens before the video clip exists: designing
character sheets, lighting scene bases, generating usable first frames, writing
camera language. `video.generate` is the shortest step; the image models are
the fuel for it.

Therefore product-type Skills describe a "pin the frame, then make it move"
pipeline: use the strong image models to lock what each frame looks like
(high completion probability, cheap, re-selectable), then let the video model
solve only motion.

## Package Structure

Each Skill is one self-contained package. Independent installation is a hard
requirement: a Skill must work when installed alone, so it never references
files in another Skill package.

```
<product-type>/                     ← e.g. narrative-short, commercial-short
  SKILL.md                          ← thin skeleton (see below)
  references/
    craft/                          ← shot grammar, defect classes, prompt format
    stages/                         ← character, scene, continuity (common stages)
    styles/                         ← pixar.md, wong-kar-wai.md … (style data)
    models/                         ← seedance, veo … capability cards
  prompts/                          ← optional writing scaffolds
  scripts/                          ← optional deterministic local helpers
```

### SKILL.md is a thin skeleton

`SKILL.md` holds the workflow skeleton only: intent clarification → pin the
frame → make it move → chain into a sequence → review. Each step is one or two
lines plus a pointer to the reference file to load when the agent reaches that
step. Detail lives in `references/`, not in the skeleton. A long `SKILL.md`
makes the agent lose the thread; depth belongs in on-demand files.

### Progressive disclosure governs everything

The Agent Skills standard loads context in three tiers, and this architecture
is built around that mechanism:

1. **Metadata (`name` + `description`)** — always resident in agent context.
   This is the only thing the agent uses to decide whether to trigger the
   Skill. The `description` is the router: it must state, in plain language,
   which creator requests this Skill serves. Writing every Skill's description
   well is how the hub does request triage — there is no separate routing layer.

2. **`SKILL.md` body** — loaded after the Skill triggers. Keep it short.

3. **`references/` files** — loaded on demand. `SKILL.md` says "when applying a
   style, read `references/styles/<name>.md`"; the agent pulls it into context
   only at that step.

## Self-Contained Over DRY

Common material (craft knowledge, stages, styles, model cards) is duplicated
into each Skill's `references/`, not shared through cross-package references.

This is deliberate and follows the standard's bias. `references/` files do not
occupy resident context — they load on demand — so duplicating a few kilobytes
of markdown has no runtime cost. Cross-package coupling, by contrast, breaks the
"one Skill, one self-contained, independently installable unit" invariant.

Consequence: shared files (e.g. `craft/cinematography.md`) exist in multiple
packages and must be updated in every copy. If drift becomes a maintenance
burden, add a `scripts/sync-references.mjs` that copies canonical sources into
each package and a validation check that fails on drift — but never replace the
copies with a runtime cross-package reference.

## Capability Is Always Queried, Never Hardcoded

A Skill never hardcodes which capabilities exist. It teaches the agent to query
the live catalog with `get_catalog` for current support and to decide how to
assemble from what is available. `references/models/` cards are planning aids
only; the catalog is authoritative.

This is a general principle, established via the audio case: audio, music, and
sound effects are an assembly/editing concern that v1 does not own. A Skill does
not name audio as a specific capability; it teaches the agent to ask the catalog
what is available at each step. When audio capability later appears in the
catalog, existing Skills need no rewrite — the agent discovers and assembles it.

### Honest Deliverable Definition

Because audio and editing are out of v1 scope, every video Skill states its
deliverable honestly: a **silent visual film** (or clips for the creator to
score and edit externally). No Skill claims a finished piece with sound while
the catalog has no audio binding.

## Style as Data

A style is a reusable, cross-cutting visual modifier expressed as a data entry
under `references/styles/`, not a Skill. A specific director or look (Pixar,
Wong Kar-wai, cyberpunk, documentary, clean-commercial) is data; the reusable
**method** for extracting, describing, and stably applying a style at the prompt
layer is what a Skill teaches.

This keeps the request "Pixar-style healing short" solvable by composing the
`narrative-short` Skill with the `pixar` style entry, with no dedicated Skill,
and lets a new style be added by adding one file. See `docs/styles.md`.

## Governance Boundary

This repository governs Skill construction. The `sorryassets` product repo's
`AGENTS.md` governs the product/backend/desktop boundary — specifically that the
SorryAssets software does not embed an agent, server-side LLM, Skill
interpreter, or workflow engine.

That product constraint means SorryAssets never *executes* a Skill. It does not
mean a Skill cannot *describe* a complete, deeply orchestrated workflow. The
orchestration happens in the calling agent's reasoning, not inside SorryAssets.
A Skill may therefore be as rich and end-to-end as the product type requires.

## Versioning

Each Skill carries a semantic `version` (`MAJOR.MINOR.PATCH`) in its catalog
entry. This is the human-facing version identifier for a Skill — what a creator,
the website, and the desktop Skill Hub should read to know which release of a
Skill they have.

Version is per-Skill, not per-repository: the two Skills evolve independently, so
a change to `commercial-short` does not bump `narrative-short`. `validate.mjs`
enforces a valid semver on every catalog entry.

Bump rules:
- **PATCH** — wording fixes, model-card data refresh, style tuning; no change to
  the workflow contract or inputs/outputs.
- **MINOR** — additive capability: a new stage reference, a new style, an
  expanded workflow step that stays backward compatible.
- **MAJOR** — a breaking change to the workflow contract, inputs, outputs, or
  deliverable definition.

Version is catalog metadata only. It is intentionally decoupled from the
content-addressed package `digest` and bundle `sha256`, which are computed from
the Skill directory's files and remain the integrity mechanism. `version` names
the release; the digest proves the bytes.

Relationship to `sourceCommit`: the catalog's repo-level `sourceCommit` records
which source revision produced a published snapshot and is currently the key the
desktop uses to identify an installed revision. Per-Skill `version` is the
human-facing identifier layered on top. Migrating the product surfaces to present
`version` instead of a git hash is a coordinated change owned by the `sorryassets`
product repo; see `docs/HANDOFF.md`.

## Skill Quality Bar

A product-type Skill must:

1. State, in its `description`, which creator requests it serves (the router).
2. Cover a complete finished-product workflow for its type, across materially
   different briefs — not one story, campaign, model, or style.
3. Keep `SKILL.md` a thin skeleton and push detail into on-demand `references/`.
4. Be fully self-contained and independently installable.
5. Discover current model support through the live catalog; hardcode nothing.
6. Apply styles by loading `references/styles/` entries, not by embedding one
   style in the workflow.
7. Define its deliverable honestly, including silent-video / no-audio limits.
8. Keep creative intermediate decisions with the agent; involve the human only
   for authorization, policy, balance, or a material brief decision.
9. Produce a real local result through the installed path before it is marked
   `live`. Validation and self-tests are preflight evidence only.
