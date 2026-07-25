# Shot video prompt

Write a self-contained video prompt for this shot using the structure from
`references/shot-prompt-format.md`. Check the model card in `references/models/`
for the selected binding's input role names and reference image limits.

Shot plan: {{shot — scale, angle, move, start state, end state, spatial anchor}}

Production bible: {{visual grammar and continuity anchors}}

Accepted references and roles: {{node ids, purpose, and supported input roles}}

Selected binding: {{model name and confirmed input roles from get_catalog}}

Runtime constraints: {{duration, resolution, aspect}}

---

Write the prompt using this structure:

```
[Scale] [angle] [camera move], [subject — start state → end state],
[lighting anchor — color temperature, quality, direction],
[spatial anchor if two or more characters — repeat verbatim from shot plan]
台词 ([character], [tone]): "[line]"   ← omit if no dialogue
参考: [node IDs and their roles]
时长: [s] | 分辨率: [resolution] | 比例: [aspect]
通过标准: [one observable pass/fail sentence]
```

Rules:
- State one continuous legible action. Do not describe two separate actions.
- Repeat the character's anchor traits (hair, signature color, silhouette) even
  when a reference image is also supplied.
- Repeat the spatial anchor sentence verbatim from the shot plan for every shot
  in the same scene.
- The ending state must be usable as the next shot's starting state or as a
  `first_frame` input if chaining is planned.
- Mention reference media only when the live binding accepts the corresponding
  role and the request provides it.
- Do not use prose to override contradictory reference evidence; resolve the
  reference plan before writing the prompt.
