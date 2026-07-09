---
name: short-drama
description: Build an AI short-drama production plan with SorryAssets. Use when the user wants to turn one story idea into script, cast, storyboard, shot images, and 15-second video clips.
license: Proprietary. See repository license terms.
compatibility: Requires a configured SorryAssets MCP/API connection. Video generation is expensive; use image generation for most validation and reserve video for final checks.
metadata:
  sorryassets.workflow: references/sorryassets.workflow.json
  sorryassets.capabilities: image.generate, video.generate
---

# AI Short Drama

Use this Skill to decompose one short-drama idea into script, cast,
storyboard, still frames, and selected 15-second video clips.

## Inputs

- One-line drama idea.
- Optional genre, tone, platform, aspect ratio, or budget constraints.

## Workflow

1. Draft a concise script from the idea.
2. Extract the cast and stable character descriptions.
3. For each key character, use the `character-creation` Skill or generate
   reference images through SorryAssets `image.generate`.
4. Break the script into storyboard shots.
5. Generate still shot images first.
6. Ask the user which shots deserve video spend.
7. Generate video only for selected final shots.

## Cost Discipline

Video is expensive. Do not test every branch with video. Use image generation
to validate the workflow and reserve 1-2 video generations for final E2E.

## SorryAssets MCP Guidance

Prefer these atomic tools when available:

- `get_active_project`
- `create_project`
- `create_node`
- `generate_on_node`
- `import_file`
- `list_project_graph`

If the host can instantiate SorryAssets workflow attachments, read
`references/sorryassets.workflow.json` and snapshot it into the local canvas.
Otherwise, follow the workflow above manually with the atomic tools.

Prompt scaffolds live in `prompts/`.
