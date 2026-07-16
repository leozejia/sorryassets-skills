---
name: short-drama
description: Plan and produce short-form narrative video with SorryAssets from a premise or creative brief. Use for short drama, narrative promos, social stories, or other compact screen stories that need a script, cast, shot plan, generated media, agent-owned intermediate selection, local assembly, and inspectable lineage. Derive duration, shot count, format, style, model, and input roles from the brief and live catalog instead of assuming a fixed production template.
---

# Short-Form Narrative Production

Turn a compact narrative brief into a coherent local video and an inspectable
SorryAssets project. The agent owns planning and routine creative decisions;
the human supplies the brief and any required authorization.

## Inputs

- Require a premise or creative brief.
- Accept optional audience, target duration, delivery format, aspect ratio,
  resolution, dialogue, style, reference assets, deadline, and spend limit.
- Treat every omitted production value as a decision to make from the brief,
  live catalog, local tooling, and authorized budget.

## Method

### 1. Establish the production contract

1. Open or create a clearly named project and call `get_catalog`.
2. Record the brief, delivery constraints, budget, and exact compatible public
   bindings in text nodes.
3. Resolve material ambiguity before spending. When the brief leaves routine
   choices open, choose them and record the rationale instead of asking the
   human to direct every step.

### 2. Write and break down the story

1. Create text nodes for the script, cast, ordered shot plan, and one
   self-contained generation prompt per shot.
2. Derive duration and shot count from the story, requested delivery, and
   catalog limits. If unspecified, choose the smallest coherent structure that
   lands the intended beat.
3. Describe each shot's purpose, duration, framing, setting, characters,
   continuous action, transition, and sound/dialogue needs.
4. Use the files in `prompts/` as writing scaffolds. Adapt their placeholders;
   they are not executable workflow steps.

### 3. Develop and select visual material

Use the `character-creation` Skill when it is installed and character identity
matters. Otherwise apply the same bounded candidate-and-selection method with
atomic image tools. Create planning stills only when they reduce production
risk or are requested; do not assume they are valid video inputs.

Keep discarded candidates visible and record every selected node id with a
short reason. Limit exploratory generation and allow no unbounded variation
loop.

### 4. Generate final shots

For each approved shot:

1. Select an exact `video.generate` binding compatible with the required input
   roles and output constraints.
2. Build the request only from roles and values declared by that binding.
   Prompt-only, reference-image, first-frame, and other shapes are valid only
   when the live binding declares them and the shot plan needs them.
3. Call `estimate_generation` before the first paid submission and whenever the
   request shape or binding changes.
4. Submit with `generate_on_node`, then poll `list_project_graph` until terminal.
   Success requires terminal backend evidence and a local file path.
5. Record the public model, task ref, charge, local path, and readable failure.
   Never switch models or make a paid retry silently.

### 5. Assemble and deliver

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
`list_project_graph`. Present the playable result and the project; do not call
the job complete while a generation edge is non-terminal.

## Stop Conditions

Stop for missing permission, insufficient balance, policy rejection, no
compatible binding, an unavailable required local tool, exhausted planned
attempts, or any unapproved paid retry. Preserve failed tasks and local evidence.

Do not ask SorryAssets to execute or instantiate this Skill. The calling agent
composes the method and invokes atomic tools directly.
