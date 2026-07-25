# Stage: Scene Assets

This is a production stage inside a product-type workflow, not a standalone
Skill. Run it when a piece has recurring locations whose layout, light, and
palette must stay consistent across shots. It produces a spatial anchor image
per location that later shots consume as `reference` or `first_frame` input.

## Goal

Turn a location description into one selected base image per location that locks
the layout, light direction, and color palette, so every shot set there stays
visually consistent.

## Why This Stage Matters

Like characters, locations drift across independent generations. A scene base
image gives the model a pixel anchor for spatial layout and lighting, replacing
fragile text-only spatial description. It is also the natural `first_frame`
source for the first shot in a location.

## Immutable vs Variable

Before generating, separate what must stay fixed from what may change:

**Immutable anchors** (must survive every shot in the location):
- Light source position and direction (e.g. "window on screen left, warm
  afternoon light entering from the left")
- Key architectural / environmental features (doorway, window side, horizon,
  dominant surface)
- Dominant color temperature and palette

**Allowed variation**: character position and action, foreground elements,
minor time-of-day shift within a session.

## Method

1. Record the location brief in a text node: place and setting; time of day and
   weather (these set light angle and color temperature); dominant palette
   (main / secondary / accent); emotional tone (one phrase); intended use
   (video `first_frame` / spatial `reference` / mood board).
2. Identify the immutable anchors and record them — they become the candidate
   pass criteria and the spatial-anchor phrases for later shot prompts.
3. Choose an exact `image.generate` binding. Check the model card in
   `references/models/` for reference limits and prompt constraints.
4. Plan 2–3 candidates, each varying one meaningful decision:
   - A: the primary intended time of day and light
   - B: an alternative light angle or color temperature
   - C (optional): an alternative atmospheric condition (overcast vs clear)
   Record the plan and selection criteria before submitting.
5. Generate one node per candidate. Poll `list_project_graph` until terminal;
   a usable result needs `taskStatus: succeeded` and a local file path.
6. Evaluate against the anchor checklist:
   - [ ] Light source direction is clear and matches the brief
   - [ ] Color temperature matches the intended time and tone
   - [ ] Key features are present and legible
   - [ ] Usable as a `first_frame` (no extreme blur, partial frame, text artifacts)
   - [ ] Composition leaves room to place a character without occluding features
   See `references/craft/defects.md` for defect types.
7. Select the strongest candidate; keep all in the graph. Record its node id,
   the anchors it establishes, and why it won.

## Output

Write a spatial anchor summary in a text node for each location:

```
场景锚点: [location name]
光源方向: [e.g. 从画面左侧入射, 暖色 3200K]
主色板: [dominant / secondary / accent]
关键特征: [2–3 features that must appear in every shot]
参考节点: [selected node id]
```

This summary feeds the `spatial anchor` field of every shot prompt set in this
location and the scene section of the continuity contract.
