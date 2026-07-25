---
name: commercial-short
description: Produce a product or marketing short video from a brand brief with SorryAssets. Use for product demos, advertising spots, and conversion-oriented commercial short video — for example "a commercial short for product X." Covers the full workflow: lock the product's exact appearance, identify the single message, plan sell-point shots, generate image-to-video, and close with a call to action. Derive format, style, and model from the brief and the live catalog; apply a requested visual style from the style library.
---

# Commercial Short Video

A complete playbook for turning a product or brand brief into a persuasive local
short video and an inspectable SorryAssets project. You own all reasoning and
orchestration. SorryAssets provides atomic tools, model access, durable local
state, and delivery — it never interprets or executes this playbook.

The decisive difference from a narrative piece: this workflow is driven by
**product fidelity and a single conversion message**, not story causality. The
product must be represented accurately and the one message must be unmistakable.

Deliverable: a silent visual commercial (or clips for the creator to score and
edit). Audio and editing are not in scope; if the catalog later offers audio
bindings, discover them with `get_catalog` and assemble accordingly.

Load reference files on demand as each step directs.

## Workflow

### 1. Establish the brief and the single message
1. Open or create a clearly named project and call `get_catalog`.
2. Record in text nodes: the product, the target audience, the ONE message or
   sell-point this video must land (if the brief lists several, choose one and
   record why), the desired viewer action (CTA), delivery constraints, and any
   budget/attempt boundary.
3. A commercial with two messages lands neither. If the brief resists a single
   message, surface that as a material decision for the human.
4. If a visual style is requested, load `references/styles/<style>.md` (often
   `clean-commercial.md`) and record its prompt anchors for every step.

### 2. Lock the product appearance
Product fidelity is non-negotiable — the generated product must match the real
one. Before any video:
1. Gather or create authoritative product reference images (front, key angles,
   detail). If provided by the brief, import them with `import_file`.
2. If product references must be generated or cleaned up, run the scene/asset
   discipline in `references/stages/scene-assets.md` adapted to the product:
   even lighting, plain background, accurate color and proportion, no invented
   details. Record the selected node id as the canonical product reference.
3. Record fidelity anchors: exact colors, logo placement, proportions, material.
   These are restated in every prompt and checked in every take.

### 3. Plan sell-point shots
1. Use `prompts/message-plan.md` to translate the single message into a small
   ordered set of shots that demonstrate it (problem → product → benefit →
   proof → CTA is a common spine; derive the real one from the message).
2. Use the shot-scale, angle, and movement vocabulary in
   `references/craft/cinematography.md`. Commercial pacing favors clean hero
   framing, macro detail inserts, and controlled moves (see
   `references/styles/clean-commercial.md`).
3. If the product appears across multiple shots, establish continuity for its
   appearance with `references/stages/continuity.md` (treat the product like a
   character whose identity anchors are its fidelity anchors).

### 4. Make it move — generate and review takes
For each ready shot:
1. Select a `video.generate` binding compatible with the required input roles;
   check its card in `references/models/` and confirm against `get_catalog`.
   Prefer image-to-video (product reference as `first_frame`) so the model only
   solves motion, not appearance.
2. Write the prompt with `references/craft/shot-prompt-format.md`, injecting the
   style anchors and restating the product fidelity anchors verbatim.
3. Call `estimate_generation` before the first paid submission and whenever the
   request shape changes. Submit with `generate_on_node`; poll
   `list_project_graph` until terminal (needs terminal evidence and a local
   path).
4. Review each take with `references/craft/defects.md`, plus a product-fidelity
   check: are colors, logo, proportions, and material correct? Reject on any
   fidelity break even if the shot is otherwise attractive. Never require
   legible on-screen text from the model — composite brand text/logo in editing.

### 5. Assemble and close
1. Where continuity matters, chain last frame → next `first_frame` per
   `references/stages/continuity.md`.
2. Assemble in message order:
   ```bash
   node skills/commercial-short/scripts/assemble-video.mjs \
     --clip <abs shot path> --node <shot node id> \
     --clip <abs next path> --node <next node id> \
     --out <abs final.mp4> --manifest <abs manifest.json>
   ```
   For a single finished clip, skip assembly. Import with `import_file`; confirm
   path and lineage with `list_project_graph`.

### 6. Review against the message
Use `prompts/final-review.md`. The pass bar is commercial, not narrative: is the
single message unmistakable, is the product represented accurately throughout,
does the close drive the intended action, and are there no defects or fidelity
breaks? Record an accept/reject verdict and the weakest moment. Do not call the
job complete while a generation edge is non-terminal or a review gate fails.

## Stop Conditions
Stop for missing permission, insufficient balance, policy rejection, no
compatible binding, an unavailable required local tool, exhausted planned
attempts, or any unapproved paid retry. Preserve failed tasks and local
evidence. Do not weaken product fidelity or the message to manufacture success;
preserve the exact state and return control to the execution authority.
