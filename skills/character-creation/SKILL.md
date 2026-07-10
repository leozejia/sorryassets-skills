---
name: character-creation
description: Create reusable AIGC character reference images with SorryAssets. Use when the user wants character portraits, visual directions, style exploration, game characters, AI comic casts, or reusable character assets. The agent scores variants and selects the strongest direction without asking the human to pick.
license: Proprietary. See repository license terms.
compatibility: Requires a configured SorryAssets MCP/API connection for generation.
metadata:
  sorryassets.workflow: references/sorryassets.workflow.json
  sorryassets.capabilities: image.generate
---

# Character Creation

Turn a character description into a small set of visual directions and one
reusable character reference image. The agent chooses the strongest usable
result. The human reviews the finished project, not every intermediate pick.

## Inputs

- Character description (required).
- Optional style or medium preference.

## Workflow

1. Create or open a SorryAssets project (`get_active_project` / `create_project`).
2. Call `get_catalog`. Pick one exact `image.generate` provider and model that
   is declared and suitable for still character reference. Prefer a low-cost
   route when several exist.
3. Create a text node with the character description (and optional style).
4. Generate **three to five** image variants with `generate_on_node`:
   - capability `image.generate`, the chosen provider/model;
   - `inputs: [{ node_id: <description node>, role: "prompt" }]` when the
     binding accepts a prompt role; otherwise put the description in
     `values.prompt`;
   - catalog-declared scalar values only (no invented params).
5. Treat each `generate_on_node` reply as **queued work**, not success. Poll
   `list_project_graph` until each node is terminal. Accept success only when
   `taskStatus` is `succeeded` **and** a local `filePath` exists.
6. **Autonomous selection** (do not ask the human which variant to keep):
   - Score each succeeded image for prompt fidelity, identity clarity, face and
     costume readability, composition, and defects (extra limbs, text garbage,
     blur, crop).
   - Keep all variants in the project graph as visible alternatives.
   - Select the single strongest usable image as the character reference.
   - Record the choice in a short text node (selected node id + one-line reason).
7. Pause only for missing permission, insufficient balance, content-policy
   rejection, or unavailable model support.

## Selection Rubric

Prefer, in order:

1. Matches the written description (identity, age, costume, mood).
2. Clear face and silhouette usable as a later still or planning reference.
3. Clean image (no major artifacts).
4. Style consistent with any stated medium preference.

If every variant fails, regenerate once with a tighter prompt. If still unusable,
stop and report the failure honestly. Do not invent a reference.

## SorryAssets MCP Guidance

Use atomic tools only:

- `get_active_project`
- `create_project`
- `get_catalog`
- `create_node`
- `generate_on_node`
- `list_project_graph`

Optional: if the host can instantiate workflow attachments, snapshot
`references/sorryassets.workflow.json` as an editable scaffold. That is not a
Skill runtime. You still call atomic MCP tools.

Prompt scaffold: `prompts/character.md`.
