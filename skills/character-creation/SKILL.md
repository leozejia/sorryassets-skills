---
name: character-creation
description: Create reusable AIGC character reference images with SorryAssets. Use when the user wants character portraits, visual directions, style exploration, game characters, AI comic casts, or reusable character assets.
license: Proprietary. See repository license terms.
compatibility: Requires a configured SorryAssets MCP/API connection for generation.
metadata:
  sorryassets.workflow: references/sorryassets.workflow.json
  sorryassets.capabilities: image.generate
---

# Character Creation

Use this Skill to turn a character description into multiple visual directions
and a reusable character reference image.

## Inputs

- Character description.
- Optional style or medium preference.

## Workflow

1. Create or open a SorryAssets project.
2. Add a text node containing the character description.
3. Generate five image variants through SorryAssets `image.generate`.
4. Ask the user to choose the strongest direction.
5. Keep the chosen image as the reusable character reference.
6. Preserve the other variants in the lineage graph as visible alternatives.

## SorryAssets MCP Guidance

Prefer these atomic tools when available:

- `get_active_project`
- `create_project`
- `create_node`
- `generate_on_node`
- `list_project_graph`

If the host can instantiate SorryAssets workflow attachments, read
`references/sorryassets.workflow.json` and snapshot it into the local canvas.
Otherwise, follow the workflow above manually with the atomic tools.

Prompt scaffold: `prompts/character.md`.
