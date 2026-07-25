---
name: short-drama
description: Design and produce coherent short-form narrative video with SorryAssets from a premise or creative brief. Use for short drama, narrative promos, social stories, or other compact screen stories that require a production contract, narrative spine, continuity bible, planned assets and references, shot-ready prompts, bounded take selection, local assembly, final review, and inspectable lineage. Derive every production value from the current brief, authorization, and live catalog rather than assuming a fixed story, duration, format, style, model, provider, or retry policy.
---

# Short-Form Narrative Production

Turn a compact narrative brief into a coherent local film and an inspectable
SorryAssets project. Own the creative reasoning in the calling agent. Use
SorryAssets for atomic tools, model access, durable project state, and local
delivery; never ask it to interpret or execute this method.

Before writing any shot prompts, read:
- `references/cinematography.md` — shot scale, camera angle, movement vocabulary,
  continuity rules, and short-format story structure
- `references/shot-prompt-format.md` — the standard multi-shot prompt structure
- `references/defects.md` — AI video defect types, prevention, and remediation
- The model card in `references/models/` for the binding you select

## Inputs

- Require a premise or creative brief and the current execution authority.
- Accept delivery constraints, audience, references, continuity requirements,
  local-tool constraints, and a spend/attempt boundary when paid work is in
  scope.
- Derive all unspecified production values from the story, delivery target,
  live catalog, and approved boundary. Record the choice; do not turn it into a
  Skill default.

## Method

### 1. Establish the production contract and story spine

1. Open or create a clearly named project and call `get_catalog`.
2. Record the brief, audience effect, delivery constraints, authorization,
   budget/attempt boundary, and compatible public bindings in text nodes.
3. State the narrative promise, causal progression, decisive change, and final
   image or resolution. Make every planned beat serve that spine.
4. Apply the causal chain test from `references/cinematography.md`: every scene
   connection must be "therefore" or "but," never "and then."
5. Resolve material ambiguity before spending. Make and record routine creative
   choices when the brief permits them; pause only for a choice that changes
   scope, authority, safety, or cost.

### 2. Build the production bible and asset plan

1. Use `prompts/production-bible.md` to define the visual grammar and a
   continuity ledger for characters, locations, props, light/color, screen
   direction, transformation rules, and recurring motifs.
2. Assign each principal character a signature color and silhouette anchor.
   See `references/cinematography.md` — Lighting and the character-creation
   Skill for anchor design principles.
3. Separate immutable identity anchors from intentional changes. Describe each
   anchor with visible, testable traits rather than names alone.
4. Plan reusable assets before shot-specific media: character references,
   location/scene references, prop references, keyframes, and any predecessor
   media needed for continuity.
5. Map every planned asset to a purpose, a selected node id when available, and
   an input role declared by a live binding. Do not generate an asset with no
   downstream decision or compatible role.

### 3. Write the script and make every shot ready

1. Use `prompts/script.md` to write the smallest causal screen story that lands
   the intended audience effect within the delivery constraints.
2. Use `prompts/storyboard.md` to derive the ordered shot sequence. Derive shot
   count and timing from the story and catalog limits; do not begin from a
   fixed template.
3. For every shot, use the format in `references/shot-prompt-format.md`. Record:
   - Narrative purpose and target duration
   - Scale, angle, and camera move (vocabulary from `references/cinematography.md`)
   - Start state and end state for character, prop, location, and screen direction
   - Spatial anchor sentence (required for any scene with two or more characters)
   - Lighting anchor consistent with the production bible
   - Reference node IDs and their roles
   - Observable pass criteria
4. Mark a shot ready only when its action fits its duration, required anchors
   are represented, its start follows the preceding accepted end state, its end
   enables the next transition, and every requested input role is supported.
5. Plan first/last frame chaining for shots that exceed the model's native
   generation length. See the model card for the selected binding.

### 4. Develop and select visual material

Use the `character-creation` Skill when it is installed and character identity
matters. Apply the same bounded candidate-and-selection discipline to scenes,
props, and keyframes with atomic image tools. Use `prompts/shot-image.md` to
prepare media that resolves a named production risk; do not assume an image is
a valid video input.

Before generating, state the decision the candidates must support and the
selection criteria. Keep discarded candidates visible. Record every selected
node id, the anchors it establishes, and why it won. Stop when the planned
decision is resolved; never enter an unbounded variation loop.

### 5. Generate and review takes

For each shot that passed readiness:

1. Select an exact `video.generate` binding compatible with the required input
   roles and output constraints. Check the model card in `references/models/`
   for input role names, reference image limits, and parameter constraints.
2. Build the request only from roles and values declared by that binding.
   Reference media, boundary frames, predecessor clips, or other shapes are
   valid only when the binding declares them and the shot plan needs them.
3. Call `estimate_generation` before the first paid submission and whenever the
   request shape or binding changes.
4. Record the intended start/end state, supplied references, and pass criteria;
   then submit with `generate_on_node` and poll `list_project_graph` until
   terminal. Success requires terminal backend evidence and a local file path.
5. Review each delivered take using the checklist in `references/defects.md`.
   Check identity, anatomy, spatial consistency, flickering, text, lip sync,
   physics, and motion in that order. Record accept/reject, evidence, and the
   defect type for any rejection.
6. Propagate only accepted, useful reference evidence to later shots. Do not
   compound a defect merely to preserve sequence.
7. Record the public model, task ref, charge, local path, selection decision,
   and readable failure. Change a binding or make another paid take only when
   the current execution boundary authorizes it.

### 6. Assemble and review the film

If the result contains multiple compatible local clips, run:

```bash
node skills/short-drama/scripts/assemble-video.mjs \
  --clip <absolute shot path> --node <shot node id> \
  --clip <absolute next shot path> --node <next shot node id> \
  --out <absolute final.mp4 path> \
  --manifest <absolute manifest.json path>
```

Repeat the `--clip` and `--node` pair in story order for additional shots. The
helper accepts a bounded ordered sequence, refuses overwrite, probes the final
video, and writes source order plus output SHA-256. For a single finished clip,
skip assembly.

Create a text node containing the manifest summary, call `import_file` for a
locally assembled result, and confirm the final local path and lineage with
`list_project_graph`. Use `prompts/final-review.md` on the playable result. Judge
the film as a whole rather than averaging acceptable shots: verify narrative
legibility, continuity across joins, pacing, visual/motion craft, delivery
constraints, and evidence consistency. Record an accept/reject verdict and the
weakest moment. Do not call the job complete while a generation edge is
non-terminal or a required final-review gate fails.

## Stop Conditions

Stop for missing permission, insufficient balance, policy rejection, no
compatible binding, an unavailable required local tool, exhausted planned
attempts, or any unapproved paid retry. Preserve failed tasks and local evidence.

Do not weaken the brief, quality bar, or evidence claim to manufacture success.
Preserve the exact state and return control to the current execution authority.
