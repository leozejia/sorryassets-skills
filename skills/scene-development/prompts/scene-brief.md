# Scene brief scaffold

Turn a location description into a spatial anchor image plan.

Location: {{place, time of day, weather}}

Emotional tone: {{one phrase, e.g. "oppressive and cold", "warm and intimate"}}

Intended use: {{video first_frame / reference for spatial consistency / mood board}}

Optional style references: {{node IDs or description}}

---

Define the scene's immutable anchors before generating candidates.
These anchors become the pass criteria for evaluation and the spatial anchor
phrases for all shot prompts set in this location.

**Immutable anchors** (must survive every shot in this location):
- Light source: direction, color temperature, quality
- Key architectural / environmental features: the 2–3 elements that define
  the space (doorway position, window side, horizon line, dominant surface)
- Dominant color palette: main / secondary / accent

**Allowed variation** (may change between shots):
- Character position and action
- Foreground elements
- Time-of-day micro-variation within the same session

---

**Candidate plan** (2–3 candidates, each varying one visual decision):

Candidate A: {{primary intended light and time of day}}
Candidate B: {{alternative light angle or color temperature}}
Candidate C (optional): {{alternative atmospheric condition}}

Selection criteria: which candidate best serves the intended downstream use
(first_frame usability, spatial legibility, character placement room)?

---

**Spatial anchor summary** (fill after selection):

```
场景锚点: [location name]
光源方向: [e.g. 从画面左侧入射, 暖色 3200K]
主色板: [dominant / secondary / accent]
关键特征: [2–3 features that must appear in every shot]
参考节点: [selected node id]
```

Copy this summary into the production bible and into every shot prompt that
uses this location.
