# Scene review scaffold

Evaluate a scene candidate against the location brief and anchor requirements.

Location brief: {{place, time of day, weather, emotional tone}}

Intended use: {{video first_frame / reference / mood board}}

Immutable anchors defined in brief: {{light source, key features, color palette}}

Candidate node ID: {{node id}}

---

Score each criterion:

1. **Light source direction**: is the light source position and direction clear
   and consistent with the brief? State the direction as a compass phrase
   ("from screen left", "overhead", "from behind subject").

2. **Color temperature**: does the color temperature match the intended time of
   day and emotional tone? State the approximate Kelvin value and whether it
   reads as warm / neutral / cool.

3. **Key features**: are the 2–3 immutable architectural or environmental
   features present and legible? List each feature and whether it is present,
   partially present, or absent.

4. **First-frame usability**: could this image serve as a `first_frame` input
   without jarring the viewer? Check: no extreme motion blur, no partial frame,
   no text artifacts, stable composition.

5. **Character placement room**: does the composition leave a natural space
   where a character could be placed without occluding the key features?

6. **Defects**: list any generation artifacts (anatomy, text corruption,
   physics violation, flickering texture).

---

**Verdict**: accept / reject / accept with note

If accepted, write the spatial anchor summary:

```
场景锚点: [location name]
光源方向: [direction and color temperature]
主色板: [dominant / secondary / accent]
关键特征: [2–3 features]
参考节点: [node id]
```
