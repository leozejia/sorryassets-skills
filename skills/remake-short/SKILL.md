---
name: remake-short
description: Recreate a video the creator loves using their own material with SorryAssets. Use when the request starts from an existing video — a file, screenshots, a link, a described trending format, or a named classic scene — and the creator wants it remade with their own subject, e.g. "my cat re-enacting a classic palace-drama scene." Covers the full workflow: deconstruct why the original works into a recipe (one-line intent, emotional mechanism, structure timeline, invariants vs replaceable slots), map the creator's material into the slots, regenerate shot by shot, and deliver the visuals plus a timed text-overlay and music plan. Supports shot-for-shot remakes, format adaptations, and effect transfers.
---

# Remake Short (神还原)

A complete playbook for turning "I love this video" into a faithful remake built
from the creator's own material. You own all reasoning and orchestration.
SorryAssets provides atomic tools, model access, durable local state, and
delivery — it never interprets or executes this playbook.

The decisive judgment of this product type: **does the remake preserve what made
the original work?** Not story causality (narrative-short), not product
conversion (commercial-short) — formula fidelity and effect equivalence.

Deliverable: silent visual film plus a timed text-overlay script and music
direction recorded as a text node. Text and music are applied by the creator in
editing; never ask a generation model to render legible text. If the catalog
later offers audio bindings, discover them with `get_catalog`.

Load reference files on demand as each step directs.

## Workflow

### 1. Capture the reference
1. Open or create a clearly named project and call `get_catalog`.
2. Acquire the reference in whatever form exists — each situation has a path;
   see "Input situations" in `references/craft/deconstruction.md`:
   - Video file: probe and sample it into stills you can actually view:
     ```bash
     node skills/remake-short/scripts/extract-frames.mjs \
       --video <abs reference path> --out-dir <abs empty dir> --frames 8
     ```
     Import the reference video with `import_file` so lineage records the source.
   - Screenshots or GIF frames: import and view them directly.
   - Link only: do not assume you can fetch it; ask for stills, a screen
     recording, or a description.
   - A named classic scene or trending format: your own knowledge of the scene
     is the deconstruction source; confirm the key beats with the creator.
3. Record what the creator loves about it, in their words, in a text node.

### 2. Deconstruct into the recipe card
Read `references/craft/deconstruction.md` and fill `prompts/recipe-card.md`:
one-line intent, emotional mechanism, structure timeline, invariants vs
replaceable slots, material mapping, feasibility check.

Confirm the fidelity level with the creator when ambiguous — it changes scope
and cost: **shot-for-shot** (same structure and timing, swap the subject),
**format adaptation** (keep the formula, new scene/content), or **effect
transfer** (keep only the mechanism; consider handing the resulting brief to
`narrative-short` if installed).

### 3. Map the creator's material
1. Import the creator's material (pet photos, product shots, faces, places)
   with `import_file`. These are the substitute subjects.
2. Treat the subject like a product: record fidelity anchors (a cat's coat
   pattern, eye color, distinctive markings) and restate them in every prompt.
   The remake fails if the subject stops looking like *their* cat.
3. For slots with no material, generate substitutes using
   `references/stages/character-assets.md` or
   `references/stages/scene-assets.md`.

### 4. Pin the frames
For each shot in the recipe, generate a keyframe first: an `image.generate`
binding with the creator's material as `reference` inputs (check limits in
`references/models/`). Match the original's look — describe it concretely from
the extracted frames (light, palette, framing) rather than naming the source.
Apply a style entry from `references/styles/` only if the creator asked to
restyle. Bounded candidates, strict selection, keep discards in the graph.

### 5. Make it move
Derive shot count and durations from the original — a shot-for-shot remake never
adds shots the original does not have; many great remakes are 1–3 shots of
subtle motion. For each shot: select a `video.generate` binding, use the
selected keyframe as `first_frame`, write the prompt with
`references/craft/shot-prompt-format.md`, keep motion minimal and legible.
`estimate_generation` before the first paid submission; poll to terminal;
review takes with `references/craft/defects.md` plus the subject-fidelity check.

### 6. Assemble and write the overlay plan
1. Multiple clips: assemble in recipe order with
   `skills/remake-short/scripts/assemble-video.mjs` (same contract as the other
   product skills: refuses overwrite, probes output, writes SHA-256 manifest).
   Import the result with `import_file`.
2. Write the timed text-overlay script and music direction as a text node:
   every overlay with its text, in/out timestamps, position, and tone; the
   music cue (the original's iconic track, or a concrete mood spec) with its
   entry point. This plus the silent film is the complete deliverable.

### 7. Review against the original
Use `prompts/remake-review.md`. Side-by-side judgment: are the invariants
preserved, does the emotional mechanism land, does the subject stay
recognizably the creator's, and is the remake free of blocking defects? Record
an accept/reject verdict and the weakest moment.

## Rights note

A remake for personal or social fun is normal internet culture; a commercial
use of someone else's format, footage, or music is the creator's legal call.
Surface the question once when the intended use is commercial; do not police.

## Stop Conditions

Stop for missing permission, insufficient balance, policy rejection, no
compatible binding, an unavailable required local tool, exhausted planned
attempts, or any unapproved paid retry. Preserve failed tasks and local
evidence. Do not weaken subject fidelity or the original's invariants to
manufacture success; preserve the exact state and return control to the
execution authority.
