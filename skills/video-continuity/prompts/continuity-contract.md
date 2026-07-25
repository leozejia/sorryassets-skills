# Continuity contract scaffold

Write the continuity contract before generating any shots. Every anchor below is
copied verbatim into shot prompts — not paraphrased, not inferred from reference
images alone.

Shot plan: {{ordered shots with their scenes and characters}}

Character reference nodes: {{node IDs from character-creation}}

Scene reference nodes: {{node IDs from scene-development}}

Selected binding: {{model name — confirm first_frame / last_frame support}}

---

## Per-scene spatial anchor

A scene is a group of shots sharing one location and one action axis.
Write one sentence per scene. It never changes within that scene.

```
场景 [N] 空间锚点:
[角色 A] 在画面[左/右]侧面向[左/右], [角色 B] 在画面[左/右]侧面向[左/右]
```

Verify against the 180-degree axis rule in `references/cinematography.md`.
If the story requires crossing the axis, mark the crossing shot and choose one
legal method: neutral on-axis shot, motivated camera move, cutaway, or scene
change.

## Per-character identity anchor

One phrase per principal character. Appended to every shot prompt featuring
that character, even when a reference image is supplied.

```
[角色名], [发型/发色], [标志色服装], [轮廓特征]
```

Confirm each character has a unique signature color and that characters who
share frames have high mutual contrast.

## Per-scene lighting anchor

```
场景 [N] 光源: [方向], [色温], [质感]
```

Must match the scene reference image selected in scene-development.

---

## First/last frame chain plan

Mark every adjacent shot pair where continuity across the cut is critical
(character mid-action, camera continuing a move, establishing shot feeding a
tighter shot).

| Chain | Source | Target | Reason |
|---|---|---|---|
| 1 | Shot [N] last frame | Shot [N+1] first_frame | {{reason}} |

For each chain, confirm:
- The binding declares `first_frame` (and `last_frame` if used)
- The source shot's ending state is usable as a starting frame: no extreme
  motion blur, no partial frame, character in a stable position

## Contract record

Write the complete contract into a text node before generating. Later shot
prompts quote from it rather than restating anchors from memory.
