# Stage: Continuity

This is a production stage inside a product-type workflow, not a standalone
Skill. Run it whenever a piece has two or more shots sharing characters,
locations, or a spatial relationship. It establishes an explicit written
contract that prevents axis jumps, identity drift, and lighting inconsistency
across separately generated clips.

## Principle

Continuity is not assumed and not inferred from reference images alone. It is a
set of explicit written constraints, repeated verbatim in every shot prompt.

## 1. Build the Continuity Contract

For each scene (a group of shots sharing one location and one action axis):

**Spatial anchor sentence** — fixes every character's screen position and
facing direction. Copied verbatim into every shot prompt in the scene; never
changes within a scene:
```
[A] 在画面[左/右]侧面向[左/右], [B] 在画面[左/右]侧面向[左/右]
```
Verify against the 180-degree axis rule in `references/craft/cinematography.md`.
If the story must cross the axis, mark the crossing shot and use a legal method
(neutral on-axis shot, motivated camera move, cutaway, or scene change).

**Identity anchor phrase** — per principal character, listing the most stable
traits; appended to every shot prompt featuring the character even when a
reference image is supplied:
```
[name], [hair], [signature-color item], [silhouette note]
```

**Lighting anchor** — per scene, the light direction and color temperature;
every shot in the scene states it:
```
光源: [direction], [color temperature], [quality]
```

Record the complete contract in a text node before generating any shots.

## 2. Plan First/Last Frame Chaining

Mark each adjacent shot pair where continuity across the cut is critical
(character mid-action, camera continuing a move, establishing shot feeding a
tighter shot). For each:
- The earlier shot's last frame becomes the later shot's `first_frame`.
- Design the earlier shot's ending state to be usable as a start frame: no
  extreme motion blur, no partial frame, stable character position.
- Confirm the selected binding declares `first_frame` / `last_frame` (see the
  model card in `references/models/`).

## 3. Enforce During Generation

Before submitting each shot, confirm: the spatial anchor sentence is present and
verbatim; the identity anchor phrase is present for each character; the lighting
anchor matches the scene contract; reference node ids are within the binding's
limit; any `first_frame` chained from a prior shot comes from an accepted take
with a recorded local path.

After each take, run the checks from `references/craft/defects.md` before
accepting: identity matches the anchor and reference; positions match the
spatial anchor; light direction matches the scene anchor; exit/entry vectors are
consistent with adjacent shots. Never propagate a rejected take's last frame as
the next shot's first frame.

## 4. Verify at Assembly

Before assembling the sequence:
- [ ] Every shot is accepted (no pending or rejected takes)
- [ ] Screen direction is consistent across every cut (exit right → enter left,
      unless a scene change resets the axis)
- [ ] Lighting direction is consistent within each scene
- [ ] Identity anchors are visually consistent across all shots per character
- [ ] Planned first/last frame chains are in place
- [ ] Transition types match the semantic intent from the shot plan

Record any continuity issue with shot number, defect type, and severity. Do not
assemble a sequence with an unresolved blocking continuity defect.
