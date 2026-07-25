---
name: scene-development
description: Develop reusable scene and environment reference assets with SorryAssets. Use when a production needs a spatial anchor image for a recurring location — a base image that locks the layout, light direction, color palette, and atmosphere of a scene so that all subsequent shots in that location stay visually consistent. Works for interior and exterior locations, time-of-day variants, and mood-board exploration.
---

# Scene Development

Turn a location description into a spatial anchor image and an inspectable
SorryAssets project record. The anchor image becomes the `reference` or
`first_frame` input for every shot set in that location.

Before generating candidates, read:
- `references/cinematography.md` — lighting, color temperature, and composition
  principles that determine what makes a scene anchor usable
- The model card in `references/models/` for the binding you select

## Inputs

- Require a location description: place, time of day, light quality, and
  emotional tone.
- Accept optional style references, intended downstream use (video first frame /
  background reference / mood board), and spend limit.
- Treat model, aspect ratio, and candidate count as runtime choices.

## Method

1. Open or create a clearly named SorryAssets project and call `get_catalog`.
2. Record the location brief in a text node. Include:
   - Place and setting (interior / exterior, architectural style, scale)
   - Time of day and weather (determines light angle and color temperature)
   - Dominant color palette (main color, secondary color, accent)
   - Emotional tone (one phrase: "oppressive and cold", "warm and intimate", etc.)
   - Intended use: will this image be used as a video `first_frame`, a
     `reference` for spatial consistency, or a mood board?
3. Identify the scene's immutable anchors — the elements that must remain
   consistent across all shots in this location:
   - Light source position and direction (e.g. "window on the left, warm
     afternoon light entering from screen left")
   - Key architectural or environmental features (doorway, tree line, horizon)
   - Dominant color temperature and palette
   Record these anchors in a text node. They become the pass criteria for
   candidate evaluation and the spatial anchor phrases for later shot prompts.
4. Choose an exact `image.generate` binding. Check the model card for reference
   image limits and prompt constraints.
5. Plan 2–3 candidates that each vary one meaningful visual decision:
   - Candidate A: the primary intended time of day and light
   - Candidate B: a slightly different light angle or color temperature
   - Candidate C (optional): a different atmospheric condition (overcast vs
     clear, fog vs sharp)
   Record the plan and the selection criteria before submitting.
6. Call `generate_on_node` once per planned candidate. Do not invent parameters
   or private model ids.
7. Poll `list_project_graph` until terminal. A usable result requires
   `taskStatus: succeeded` and a local file path.
8. Evaluate candidates against the anchor checklist:
   - [ ] Light source direction is clear and consistent with the brief
   - [ ] Color temperature matches the intended time of day and tone
   - [ ] Key architectural / environmental features are present and legible
   - [ ] The image could serve as a `first_frame` without jarring the viewer
         (no extreme motion blur, no partial frames, no text artifacts)
   - [ ] The composition leaves room for a character to be placed in the scene
   Select the strongest candidate. Record its node id, the anchors it
   establishes, and why it won. Keep all candidates in the graph.
9. Write a spatial anchor summary in a text node:
   ```
   场景锚点: [location name]
   光源方向: [e.g. 从画面左侧入射, 暖色 3200K]
   主色板: [dominant / secondary / accent]
   关键特征: [list the 2–3 features that must appear in every shot]
   参考节点: [selected node id]
   ```
   This summary is the input for the `spatial anchor` field in shot prompts
   that use this location.

Use `prompts/scene-brief.md` to plan the anchors and candidate set, and
`prompts/scene-review.md` to evaluate each delivered candidate.

## Stop Conditions

Stop for missing permission, insufficient balance, policy rejection, no
compatible live binding, an exhausted candidate bound, or a paid retry that
the human has not authorized.

## Atomic Tools

- `get_active_project`
- `create_project`
- `get_catalog`
- `create_node`
- `estimate_generation`
- `generate_on_node`
- `list_project_graph`
