# Continuity review scaffold

Check a delivered take against the continuity contract before marking the shot
accepted. Run this per shot, not once at the end — a drifted shot propagated as
a reference contaminates every shot after it.

Continuity contract: {{spatial anchors, identity anchors, lighting anchors}}

Shot under review: {{shot number, scene, characters present}}

Delivered take: {{node ID and local file path}}

Previous accepted shot: {{shot number and its ending state}}

---

## Per-shot checks

1. **Identity** — do the character's visible traits match the identity anchor
   phrase and the reference image? Check hair shape and color, signature color
   item, costume silhouette. Report any trait that drifted.

2. **Spatial** — do character screen positions and facing directions match the
   scene's spatial anchor sentence verbatim? If two characters are present,
   state which side each occupies and compare to the contract.

3. **Lighting** — does the light direction and color temperature match the
   scene lighting anchor? State the observed direction and compare.

4. **Screen direction** — is the entry/exit vector consistent with the previous
   accepted shot? A character exiting frame right must enter the next shot from
   frame left unless a scene change resets the axis.

5. **Chain usability** — if this shot's last frame feeds the next shot's
   `first_frame`, is the ending frame usable? Check for motion blur, partial
   frame, unstable character position.

6. **Defects** — classify any flaw using `references/defects.md`. State type,
   approximate timestamp, and severity (blocks acceptance / degrades quality /
   minor).

---

## Verdict

Accept / reject.

On reject, state the single defect type that caused it and the specific
prompt-level correction from `references/defects.md` for that type. Do not
propagate a rejected take's last frame as the next shot's first frame.

On accept, record the ending state so the next shot's readiness gate can
verify continuity from it.
