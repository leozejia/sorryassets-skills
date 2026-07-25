---
name: video-continuity
description: Plan and enforce multi-shot visual continuity for AI-generated video. Use before or during production when a project has two or more shots that share characters, locations, or a spatial relationship. Establishes a continuity contract (spatial anchors, identity anchors, first/last frame chain plan) that prevents axis jumps, identity drift, and lighting inconsistency across separately generated clips.
---

# Video Continuity

Establish a continuity contract before generation begins, enforce it during
take review, and verify it at assembly. The contract is a set of explicit
written constraints that are repeated verbatim in every shot prompt — not
assumed, not inferred from reference images alone.

Before writing any contract, read:
- `references/cinematography.md` — 180-degree axis rule, spatial anchors,
  screen direction, and transition semantics
- `references/defects.md` — identity drift, axis jump, and flickering
  prevention and remediation

## Inputs

- Require a shot plan (ordered list of shots with their scenes and characters).
- Require the character reference node IDs from the `character-creation` Skill
  or equivalent.
- Require the scene reference node IDs from the `scene-development` Skill or
  equivalent.
- Accept the selected binding name to determine first/last frame support.

Use `prompts/continuity-contract.md` to write the contract and
`prompts/continuity-review.md` to check each delivered take against it.

## Method

### 1. Build the continuity contract

For each scene (a group of shots sharing the same location and axis):

**Spatial anchor sentence** — write one sentence that fixes every character's
screen position and facing direction. This sentence is copied verbatim into
every shot prompt in the scene. It never changes within a scene.

Format:
```
[角色 A] 在画面[左/右]侧面向[左/右], [角色 B] 在画面[左/右]侧面向[左/右]
```

Example:
```
林悦在画面左侧面向右, 陈明在画面右侧面向左
```

**Identity anchor phrase** — for each principal character, write one phrase
that lists their most stable visual traits. This phrase is appended to every
shot prompt that features the character, even when a reference image is also
supplied.

Format:
```
[角色名], [发型/发色], [标志色服装], [轮廓特征]
```

Example:
```
林悦, 棕色卷发, 红色围巾, 深色长风衣
```

**Lighting anchor** — for each scene, record the light source direction and
color temperature. Every shot in the scene must state this anchor.

Format:
```
光源: [方向], [色温], [质感]
```

Example:
```
光源: 从画面左侧入射, 暖色 3200K, 柔光
```

Record the complete contract in a text node before generating any shots.

---

### 2. Plan first/last frame chaining

Review the shot plan and mark every pair of adjacent shots where continuity
across the cut is critical (character mid-action, camera continuing a move,
location establishing shot feeding a tighter shot).

For each marked pair:
- The earlier shot's last frame becomes the later shot's `first_frame` input.
- Note this in the shot plan: "Shot 03 last frame → Shot 04 first_frame".
- Design the earlier shot's ending state so it is usable as a starting frame:
  no extreme motion blur, no partial frame, character in a stable position.

Check the model card in `references/models/` to confirm `first_frame` and
`last_frame` are supported by the selected binding before planning chains.

---

### 3. Enforce during generation

Before submitting each shot:
- Confirm the spatial anchor sentence is present and verbatim.
- Confirm the identity anchor phrase is present for each character in the shot.
- Confirm the lighting anchor matches the scene contract.
- Confirm reference node IDs are listed and within the binding's limit.
- If this shot uses a `first_frame` from the previous shot, confirm that shot
  has been accepted and its local file path is recorded.

After each take delivery, run the continuity checks from `references/defects.md`
before marking the shot accepted:
- Identity: character traits match the anchor phrase and reference image
- Spatial: character positions match the spatial anchor sentence
- Lighting: light direction matches the scene lighting anchor
- Screen direction: exit/entry vectors are consistent with adjacent shots

Do not propagate a rejected take's last frame as the next shot's first frame.

---

### 4. Verify at assembly

Before running `assemble-video.mjs`, verify the full sequence:

- [ ] Every shot in the sequence is accepted (no pending or rejected takes)
- [ ] Screen direction is consistent across every cut (character exiting right
      enters the next shot from the left, unless a scene change resets the axis)
- [ ] Lighting direction is consistent within each scene
- [ ] Identity anchors are visually consistent across all shots featuring each
      character
- [ ] First/last frame chains are in place for all planned chain points
- [ ] Transition types match the semantic intent from the shot plan

Record any continuity issue found at this stage as a text node with the shot
number, defect type, and severity. Do not assemble a sequence with an
unresolved blocking continuity defect.

## Stop Conditions

Stop for missing permission, insufficient balance, no compatible binding,
or a continuity defect that cannot be resolved within the authorized attempt
budget. Preserve all evidence. Do not weaken the continuity standard to
manufacture a passing assembly.
