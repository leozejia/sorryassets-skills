---
name: short-drama
description: Produce a complete 30-second AI short-drama episode with SorryAssets. Use when one premise should become a script, cast, exactly two prompt-only 15-second video shots, and one assembled local MP4. The agent selects intermediate results; the human reviews the finished workflow and episode.
license: Proprietary. See repository license terms.
compatibility: Requires SorryAssets desktop MCP, prepaid generation balance, and local FFmpeg/ffprobe.
metadata:
  sorryassets.workflow: references/sorryassets.workflow.json
  sorryassets.capabilities: image.generate, video.generate
---

# AI Short Drama

Turn one premise into a local 30-second, 720p, 9:16 episode with one or two
characters, exactly two 15-second shots, visible lineage, and one imported MP4.

Ask the human only when permission or balance is missing, policy rejects the
request, the catalog has no usable model, or a paid video retry needs approval.
Intermediate creative choices are the agent's responsibility.

## Rules

- Read `get_catalog`; use only an exact declared provider, model, input role,
  and parameter value.
- Use low-cost images for character and planning work.
- Submit only the two final video shots. Any retry or third paid video
  submission needs owner approval.
- Treat `generate_on_node` as queued work. Success requires a terminal
  `succeeded` edge and a local file path from `list_project_graph`.
- Video is prompt-only: never send `first_frame`, `last_frame`, reference media,
  or source video.
- Keep discarded candidates in the graph and record the selected node id and
  reason in a text node.

## Workflow

### 1. Project and plan

1. Open or create a clearly named project.
2. Call `get_catalog`.
3. Create text nodes for the brief, 30-second script, cast, two-shot plan, and
   one self-contained video prompt per shot. Use the files in `prompts/` as
   writing scaffolds.
4. Keep the story to one setup and one payoff. Each shot must describe camera,
   setting, named characters, and continuous action that fits 15 seconds.

`instantiate_skill` may snapshot `references/sorryassets.workflow.json`, but it
only creates editable nodes and edges. It does not execute this Skill.

### 2. Character and storyboard methods

Follow the sibling `character-creation` Skill for each key character. Score
variants for prompt fidelity, identity clarity, composition, visible defects,
and usefulness in the next step; select the strongest usable result yourself.

Create at most one planning still per shot. These stills help inspect the plan
but are not inputs to video generation. If a still is unusable, refine it once;
then stop instead of opening an unbounded variation loop.

### 3. Video-shot method

For each final shot, choose one `video.generate` binding from the live catalog
that declares all three values below, then call:

```json
{
  "project_id": "<open project>",
  "capability": "video.generate",
  "provider": "<catalog provider>",
  "model": "<catalog model>",
  "inputs": [{ "node_id": "<shot prompt node>", "role": "prompt" }],
  "values": { "duration": 15, "resolution": "720p", "aspect": "9:16" }
}
```

Before submission, correct local schema or call-plan mistakes without spending.
After a paid submission, poll `list_project_graph` until terminal and record the
task ref, public model, charge, local path, and readable error. A failed paid
video is still a submission: stop for owner approval before retrying. Never
switch models silently.

### 4. Episode-assembly method

After both local clips succeed, run:

```bash
node skills/short-drama/scripts/assemble-episode.mjs \
  --clip-a <absolute shot-1 path> --clip-b <absolute shot-2 path> \
  --out <absolute episode.mp4 path> \
  --node-a <shot-1 node id> --node-b <shot-2 node id> \
  --manifest <absolute manifest.json path>
```

The helper concatenates exactly two clips, refuses overwrite, probes the output,
and writes the source order plus output SHA-256. Create a text node containing
the manifest summary, call `import_file` for the MP4, and confirm its local path
with `list_project_graph`.

### 5. Hand-off

Present the complete graph and playable MP4. Every generation edge must be
terminal, and every successful media node must have a local path.

## No-Spend Check

Before paid generation, follow `references/no-spend-mcp-plan.md`. It creates a
fresh text scaffold, discovers the live catalog, and records the exact call
plan without calling `generate_on_node`.
