---
name: narrative-short
description: Produce a coherent short narrative film from a premise or creative brief with SorryAssets. Use for emotional, story-driven short films, narrative promos, and social stories — for example "a Pixar-style short about psychological healing." Covers the full workflow: story spine, character and scene assets, a shot plan with camera language, image-to-video generation, first/last-frame chaining, local assembly, and whole-film review. Derive duration, format, style, and model from the brief and the live catalog; apply a requested visual style from the style library.
---

# Narrative Short Film

A complete playbook for turning a story brief into a coherent local film and an
inspectable SorryAssets project. You own all reasoning and orchestration.
SorryAssets provides atomic tools, model access, durable local state, and
delivery — it never interprets or executes this playbook.

Deliverable: a silent visual film (or clips for the creator to score and edit).
Audio and editing are not in scope; if the catalog later offers audio bindings,
discover them with `get_catalog` and assemble accordingly.

Load reference files on demand as each step directs — do not read them all up
front.

## Workflow

### 1. Establish the contract and story spine
1. Open or create a clearly named project and call `get_catalog` to learn the
   currently supported bindings and their input roles.
2. Record the brief, audience effect, delivery constraints, authorization, and
   any budget/attempt boundary in text nodes.
3. State the narrative promise, causal progression, decisive change, and final
   image. Apply the causal chain test in `references/craft/cinematography.md`:
   every scene connection is "therefore" or "but," never "and then."
4. If a visual style is requested, load `references/styles/<style>.md` and record
   its prompt anchors — they will be injected at every generation step.

### 2. Pin the frame — build character and scene assets
Before any video, lock what each frame looks like using the strong image models.
1. For each recurring character, run the character-assets stage:
   `references/stages/character-assets.md`.
2. For each recurring location, run the scene-assets stage:
   `references/stages/scene-assets.md`.
3. Record every selected reference node id and its anchors in the production
   bible. These become `reference` / `first_frame` inputs downstream.

### 3. Write the script and plan shots
1. Use `prompts/script.md` to write the smallest causal screen story that lands
   the intended effect within the delivery constraints.
2. Use `prompts/storyboard.md` to derive the ordered shot sequence. Use the
   shot-scale, angle, and movement vocabulary in
   `references/craft/cinematography.md`. Derive shot count and timing from the
   story and catalog limits, not a fixed template.
3. Establish continuity before generating: build the contract in
   `references/stages/continuity.md` (spatial anchors, identity anchors,
   lighting anchors, first/last-frame chain plan).

### 4. Make it move — generate and review takes
For each ready shot:
1. Select a `video.generate` binding compatible with the required input roles.
   Check its card in `references/models/` for input roles, reference limits, and
   parameters. Confirm against `get_catalog`.
2. Write the prompt with `references/craft/shot-prompt-format.md`, injecting the
   style anchors and repeating identity and spatial anchors verbatim.
3. Call `estimate_generation` before the first paid submission and whenever the
   request shape changes. Submit with `generate_on_node`; poll
   `list_project_graph` until terminal. Success needs terminal backend evidence
   and a local file path.
4. Review each take with the checklist in `references/craft/defects.md`. Record
   accept/reject, evidence, and the defect type for any rejection. Never
   propagate a rejected take's last frame into the next shot.

### 5. Chain and assemble
1. Where continuity across a cut is critical, chain the previous shot's last
   frame into the next shot's `first_frame` per `references/stages/continuity.md`.
2. When multiple clips exist, assemble in story order:
   ```bash
   node skills/narrative-short/scripts/assemble-video.mjs \
     --clip <abs shot path> --node <shot node id> \
     --clip <abs next path> --node <next node id> \
     --out <abs final.mp4> --manifest <abs manifest.json>
   ```
   The helper refuses overwrite, probes the output, and writes source order plus
   SHA-256. For a single finished clip, skip assembly.
3. Import the assembled result with `import_file`; confirm the final path and
   lineage with `list_project_graph`.

### 6. Review the whole film
Use `prompts/final-review.md`. Judge the film as a whole, not as an average of
acceptable shots: narrative legibility, continuity across joins, cinematic
craft, defects (by type), and delivery/evidence consistency. Record an
accept/reject verdict and the weakest moment. Do not call the job complete while
a generation edge is non-terminal or a required review gate fails.

## Stop Conditions
Stop for missing permission, insufficient balance, policy rejection, no
compatible binding, an unavailable required local tool, exhausted planned
attempts, or any unapproved paid retry. Preserve failed tasks and local
evidence. Do not weaken the brief, quality bar, or evidence claim to manufacture
success; preserve the exact state and return control to the execution authority.
