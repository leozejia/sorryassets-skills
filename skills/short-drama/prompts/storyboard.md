# Storyboard scaffold

Break the script into the smallest coherent ordered shot sequence that meets the
runtime delivery constraints. Use vocabulary from `references/cinematography.md`
for scale, angle, and camera move terms.

Script: {{script}}

Cast and continuity: {{cast with anchor traits — hair, signature color, silhouette}}

Production bible and available references: {{bible and selected asset nodes}}

Delivery constraints: {{duration, aspect, resolution, and other limits}}

Selected binding: {{model name — check references/models/ for input role limits}}

---

For each shot provide the following fields:

**Shot [NN] | [title]**

- Narrative purpose: why this shot exists in the story
- Target duration: seconds (must fit within the selected binding's limits)
- Scale: [远景 / 全景 / 中景 / 近景 / 特写]
- Angle: [平视 / 仰拍 / 俯拍 / 荷兰角 / 鸟瞰] (omit if eye-level)
- Camera move: [推 / 拉 / 摇 / 移 / 跟 / 升 / 降 / 手持 / 稳定器 / 固定]
- Start state: character position, prop state, location, screen direction
- End state: character position, prop state, location, screen direction
- Visible action: one continuous legible action (start → end)
- Spatial anchor: required when two or more characters share the frame —
  "[A] 在画面左侧面向右, [B] 在画面右侧面向左" — repeat verbatim in every
  shot of this scene
- Lighting: color temperature, quality, direction (must match production bible)
- Transition in / out: cut / dissolve / fade / match cut (see cinematography.md)
- Sound needs: dialogue, SFX, music cue
- References: node IDs and their roles (must not exceed binding's reference limit)
- First/last frame chaining: note if this shot's first frame comes from the
  previous clip's last frame, or if its last frame feeds the next shot
- Pass criteria: one observable sentence — what must be true for this take to
  be accepted

---

Readiness gate — mark a shot ready only when:
1. Its action fits the target duration
2. Required identity anchors are represented in the reference list
3. Its start state follows the preceding accepted end state
4. Its end state enables the next planned transition
5. Every requested input role is supported by the selected binding
6. The spatial anchor is written and consistent with the scene axis

Flag any shot that fails a readiness gate instead of writing a plausible prompt
around the gap. Do not add shots that do not advance the story.

Total planned duration must match the delivery target.
