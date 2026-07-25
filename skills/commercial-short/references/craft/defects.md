# AI Video Defect Reference

Use this table during take review (Step 5) and final review (Step 6).
For each defect: identify the type, apply the prompt-level prevention on the
next take, and use the remediation if the take is otherwise acceptable.

## Defect Classification

### Identity Drift (身份漂移)
Character face, hair, or costume gradually shifts across shots.

**Cause**: Models have no persistent cross-generation memory; each shot
rebuilds the scene independently.

**Prevention**:
- Attach the same character reference image to every shot in the scene.
- Repeat explicit anchor traits in every shot prompt: hair color, clothing
  color, distinctive features. Do not rely on the reference image alone.
- Use a high-quality reference: front-facing, even lighting, no occlusion.

**Remediation**: Regenerate the drifted shot with the reference re-attached
and anchor traits restated. If drift is minor, use shorter shot duration and
faster cutting to reduce viewer exposure to the inconsistency.

---

### Anatomical Distortion (肢体畸变)
Wrong finger count, limbs bending unnaturally, merged or missing body parts.

**Cause**: Hand and limb training data is sparse relative to faces; the model
averages rather than precisely reconstructing anatomy.

**Prevention**:
- Limit hand visibility: "hands in pockets," "arms at sides," "hands off
  screen."
- Avoid prompting complex hand gestures or close-up hand action.
- Use a pose reference image to constrain body position.

**Remediation**: Change the shot scale to exclude the problematic area (e.g.
reframe to a tighter CU that excludes hands). Regenerate; this defect has
high shot-to-shot variance so a fresh take often avoids it.

---

### Axis Jump / Spatial Inconsistency (轴线跳跃)
Characters swap left-right positions between shots; spatial layout contradicts
the previous shot.

**Cause**: Each generation independently constructs the scene with no memory
of the spatial layout established in prior shots.

**Prevention**: See `references/craft/cinematography.md` — AI-Specific section.
Short version: repeat the same spatial anchor sentence in every shot of a
scene ("Character A on screen left facing right, Character B on screen right
facing left").

**Remediation**: Insert a neutral on-axis shot (character facing directly
toward or away from camera) between the two conflicting shots. Alternatively,
use a dissolve or cutaway to break spatial continuity perception without
regenerating either shot.

---

### Temporal Flickering (闪烁)
Texture, lighting, or background details jump frame-to-frame.

**Cause**: The model treats video as highly correlated still images rather
than a true 3-D render; inter-frame sampling noise is not fully suppressed.

**Prevention**:
- Avoid large areas of high-frequency texture (dense foliage, water surfaces,
  patterned fabric filling the frame).
- Prefer simple backgrounds or shots with strong foreground occlusion.
- Use models with longer native generation lengths to reduce the number of
  splice points.

**Remediation**: Apply video denoising / temporal stabilization in post.
Severe flickering requires regeneration; do not attempt local patch repairs
(they introduce new discontinuities).

---

### Text / Logo Corruption (文字乱码)
On-screen text renders as distorted or meaningless symbols.

**Cause**: Text requires pixel-level symbol precision that is fundamentally
at odds with probabilistic pixel generation.

**Prevention**:
- Do not require legible on-screen text in generated shots.
- Place brand or title text in defocus, distant, or secondary positions.
- Composite real text over the generated video in post.

**Remediation**: Text corruption cannot be repaired in the generated frame.
Regenerate or composite a real text layer over the affected region.

---

### Lip-Sync Mismatch (口型错位)
Character mouth movement does not match the spoken audio.

**Cause**: Complex angles, fast speech, strong expressions, and multi-person
dialogue exceed current model synchronization capability.

**Prevention**:
- Limit lip-sync shots to: front-facing, medium close-up, single speaker,
  moderate speech pace, neutral expression baseline.
- Use voiceover / narration for information-dense dialogue.
- Use back-of-head, profile, or reaction shots for secondary speakers.

**Remediation**: Replace the shot with a reaction shot or over-the-shoulder
angle that does not require precise lip sync. Alternatively, use subtitles
and a reaction shot to convey the dialogue without lip sync.

---

### Physics Violation (物理失真)
Objects float, liquids defy gravity, shadows point the wrong direction,
reflections do not match the scene.

**Cause**: The model learns pixel motion statistics, not physical simulation.
Causal physical relationships are not explicitly modeled.

**Prevention**:
- Avoid shots whose dramatic value depends on precise physical interaction
  (liquid pouring close-up, complex collisions, mirror reflections).
- Use editing to skip the physical interaction: cut from the state before to
  the state after, rather than showing the process.

**Remediation**: Regenerate. If the same violation recurs, the shot design
exceeds current model capability — redesign the shot rather than retrying
indefinitely.

---

### Motion Blur Artifacts (运动模糊伪影)
Fast movement produces unnatural smearing, ghosting, or trajectory breaks.

**Cause**: The model's inter-frame interpolation for high-speed motion has
limited fidelity; intermediate states are low-confidence guesses.

**Prevention**:
- Avoid shots requiring fast, large-amplitude motion as the primary visual
  content.
- For action sequences, use short shots and fast cutting — motion blur is
  conventional in action editing and masks generation artifacts.

**Remediation**: In action sequences, fast cutting is the standard fix.
For shots requiring clear motion (product demos, slow reveals), redesign as
slow or static and use editing rhythm to supply energy.

---

## Review Checklist

Run this after every take delivery, before marking a shot accepted:

- [ ] Identity: character face, hair, and costume match the reference and
      prior accepted shots
- [ ] Anatomy: no extra fingers, no unnatural limb bends, no merged body parts
- [ ] Spatial: character positions and facing directions are consistent with
      the scene's axis declaration
- [ ] Flickering: no frame-to-frame texture or lighting jumps
- [ ] Text: any on-screen text is either absent, defocused, or legible
- [ ] Lip sync: if dialogue is present, mouth movement is plausible for the
      shot type
- [ ] Physics: no floating objects, gravity violations, or impossible shadows
- [ ] Motion: fast movement does not produce distracting smearing or ghosting
- [ ] Technical: `taskStatus: succeeded`, local file path present, duration
      within tolerance
