# Product-Type Roadmap

Skills are cut by finished-product type (see `ARCHITECTURE.md`). This document
lists the current and planned product types and records why each qualifies as a
distinct type — that is, why its workflow cannot be served by another type's
Skill.

A product type earns a Skill only when its workflow is genuinely distinct across
materially different briefs. A single story, campaign, style, or model does not
justify a new type.

## Selection Criteria

A candidate product type qualifies when:

1. Its end-to-end workflow differs structurally from existing types (different
   stages, different judgment at each stage, different definition of "done").
2. The tool is genuinely good at producing it (high completion probability at
   reasonable cost), so a creator gets a real sense of achievement.
3. Demand is recurring and generalizes across briefs, not a one-off request.
4. It fits video-first scope and the current catalog's real capabilities.

## First Batch

### narrative-short
Emotional / story-driven short films. Covers requests like "a Pixar-style short
about psychological healing."

- **Workflow**: intent and audience effect → script with a causal chain →
  characters and scenes (pin the frame) → shot plan with camera language →
  image-to-video generation (make it move) → first/last-frame chaining into a
  sequence → whole-film review against narrative legibility and continuity.
- **Why distinct**: driven by story causality and emotional arc. The decisive
  judgment is "does the cause-and-effect and the change read without hidden
  context." No other type optimizes for this.
- **Absorbs**: the current `short-drama` skeleton and its craft/stage/model
  references.

### commercial-short
Product and marketing short videos. Covers requests like "a commercial short for
product X."

- **Workflow**: lock the product's exact appearance (reference fidelity is
  non-negotiable) → identify the single sell-point / message → shot plan built
  around demonstrating that point → image-to-video generation → conversion-
  oriented close (CTA framing) → review against message clarity and brand
  fidelity.
- **Why distinct**: driven by product fidelity and a conversion goal, not story
  causality. The decisive judgment is "is the product accurately represented and
  is the single message unmistakable." A narrative Skill would optimize the wrong
  thing.

### remake-short (神还原)
Faithful recreation of a video the creator loves, using their own material.
Covers requests like "my cat re-enacting a classic palace-drama scene" or
"this trending format, but with my dog."

- **Workflow**: capture the reference (file / stills / description / named
  classic scene) → deconstruct into a recipe card (one-line intent, emotional
  mechanism, structure timeline, invariants vs replaceable slots, material
  mapping, feasibility) → import creator material and lock subject fidelity →
  pin keyframes → minimal-motion generation → assemble → deliver silent film
  plus a timed text-overlay and music plan → review against the original.
- **Why distinct**: driven by formula fidelity and effect equivalence — "does
  the remake preserve what made the original work?" The creative decisions were
  already made by the original; the judgment is deconstruction accuracy and
  subject fidelity, which neither narrative-short (story causality) nor
  commercial-short (product conversion) optimizes.
- **Why high completion probability**: viral short formats are typically 1–5
  mostly-static single-subject shots with text and music applied in post —
  squarely inside current model strengths, avoiding lip-sync, multi-person
  interaction, and generated text.

### adaptation-plan (改编规划) — planning skill

Not a production type: a **planning skill** (see ARCHITECTURE.md — Production
Skills vs Planning Skills). Turns a novel, script, or serial into a producible
series plan. Covers requests like "turn my web novel into a short-drama series."

- **Deliverable**: a plan, not media — logline and theme, a format decision with
  a justified episode count, a character map with identity anchors, act/season
  structure, per-episode cards with boundary hooks, adaptation notes, and one
  ready-to-run `narrative-short` brief per episode. `capabilities` is empty; it
  calls no generation binding.
- **Why a skill, not a stage**: a whole novel cannot enter a single
  `narrative-short` run. Episode-count and structure reasoning is substantial,
  stable across sources, and a genuine prerequisite to production. A production
  stage runs *within* one finished product; this runs *before* many of them.
- **Why planning, not a finished series**: a vertical short drama is 60–100
  episodes; even a lean web series is hundreds to thousands of shots with
  cross-series consistency — not reliably or economically generable today.
  Delivering the plan honestly beats half-generating an incoherent series. To
  see one episode move, run `narrative-short` on its brief for a pilot.
- **Demand**: web-novel-to-short-drama adaptation is one of the largest real
  AIGC demand pools; the planning bottleneck (how many episodes, where to cut,
  how to hook) is exactly what creators cannot do unaided.

## Style Coverage for the First Batch

Both first-batch Skills share a starter style library (`references/styles/`).
Seed with a small set of high-recognition looks so the "compose type × style"
model is real from day one:

- pixar (stylized 3D, warm palette, rounded forms)
- wong-kar-wai (step-printing, neon, handheld intimacy)
- cyberpunk (neon-noir, high contrast, rain-slick surfaces)
- documentary (naturalistic light, observational framing)
- clean-commercial (bright high-key, minimal, product-forward)

See `docs/styles.md` for the style entry contract.

## Candidate Later Types (Not Yet Justified)

These are recorded as candidates only. Each needs the selection criteria met —
in particular a real catalog capability — before it becomes a Skill:

- **social-vertical** — 9:16 hook-driven short-form for social feeds. Likely
  distinct (hook density, vertical framing, mute-first design) but overlaps
  narrative/commercial; needs a demand and workflow-distinctness check.
- **trailer / teaser** — montage-driven, rhythm-first. Distinct workflow, but
  leans on editing and pacing that partly live in assembly (out of v1 audio
  scope).
- **talking-head / explainer** — depends on reliable lip-sync and audio, which
  the catalog does not currently support. Blocked until audio capability exists.

Do not build a candidate type on mocks or an assumed capability. Confirm the
live catalog supports the required bindings first.
