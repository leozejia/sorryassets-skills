# Cinematography Reference

Use this vocabulary when writing shot plans and video prompts. Every term here
maps directly to a prompt phrase the model can act on.

## Shot Scale (景别)

| Scale | English | Frame | Narrative function |
|---|---|---|---|
| 大远景 | Extreme Long Shot (ELS) | Subject tiny or absent | Establish geography, scale, world; pure environment |
| 远景 | Long Shot (LS) | Subject ≤ 1/3 frame height | Opening establishing shot; place and atmosphere |
| 全景 | Full Shot (FS) | Head to toe, environment secondary | Character introduction; full body and costume |
| 中景 | Medium Shot (MS) | Waist to head | Default dialogue shot; balances gesture, face, background |
| 近景 | Close-Up (CU) | Chest/shoulder to head | Emotion and inner state; key line emphasis |
| 特写 | Extreme Close-Up (ECU) | Face detail or prop | Suspense, clue, extreme emotion, subconscious desire |

**Rule**: larger scale = more environment, less emotion. Conventional scene
opening: ELS/LS (establish) → MS (relationship) → CU (emotion).

## Camera Angle

| Angle | Effect | Use when |
|---|---|---|
| Eye level (平视) | Neutral, objective, immersive | Default for dialogue; 90 % of shots |
| Low angle (仰拍) | Subject appears powerful, imposing, heroic | Authority figures, villains, moments of elevation |
| High angle (俯拍) | Subject appears small, vulnerable, watched | Weakness, isolation, being judged |
| Dutch angle (荷兰角) | Unease, imbalance, mental instability | Danger approaching, psychological break; use sparingly |
| Bird's eye (鸟瞰) | Omniscient, fate, map-like | Group choreography, destiny statements |
| POV (主观镜头) | First-person immersion | Fear, desire, surveillance |

## Camera Movement (运镜)

| Move | Definition | Semantic / when to use |
|---|---|---|
| Push in (推) | Camera moves toward subject | Focus attention; discovery or revelation |
| Pull out (拉) | Camera moves away | Release tension; isolation; scene close |
| Pan (摇) | Camera rotates horizontally, fixed position | Connect two points; follow lateral action; survey |
| Track/Truck (移) | Camera moves laterally on rails | Accompany walking; parallel action; spatial traversal |
| Follow (跟) | Camera follows subject's direction | Subjective immersion; urgency; documentary feel |
| Crane up/down (升/降) | Camera rises or descends | Up = reveal macro (opening); Down = focus close (ending) |
| Zoom (变焦) | Focal length changes, position fixed | Compresses/exaggerates spatial perspective |
| Dolly zoom (希区柯克变焦) | Simultaneous dolly + counter-zoom | Background distortion; cognitive shock |
| Handheld (手持) | Slight organic shake | Documentary realism, tension, chaos; avoid in calm dialogue |
| Gimbal/Steadicam (稳定器) | Smooth but organic | Fluid immersive follow; long-take choreography |
| Locked-off (固定) | Absolute stability | Control, formality, cold narrator POV |

**Decision rule**: stable/formal/authoritative → locked or smooth track;
tense/subjective/documentary → handheld; spatial traversal → gimbal follow;
revelation → push in; release/farewell → pull out or crane up; survey → pan.

## Composition

- **Rule of thirds**: place subject on one of four intersection points; centered
  framing is reserved for symmetry, ritual, or deliberate psychological unease.
- **Leading lines**: roads, railings, light shafts guide the eye to the subject.
- **Frame within frame**: doorways, windows, mirrors create a sense of being
  observed, confined, or isolated.
- **Negative space**: large empty area around a small subject = loneliness,
  contemplation, or freedom (context-dependent).
- **Headroom / lookroom**: leave space in the direction the subject faces;
  reversed lookroom (space behind, none ahead) creates subconscious pressure.

## Shot Duration and Information Density

Minimum duration = time needed to extract the shot's core information.

| Content | Guideline |
|---|---|
| New character + new location + on-screen text | ≥ 3 s |
| Known character emotional reaction (CU) | 0.5 – 1.5 s |
| Action montage fragment | 0.3 – 1 s (relies on spatial continuity) |

## Continuity Editing

### 180-Degree Axis Rule
Two characters share an imaginary action axis. Keep the camera on one side of
that axis throughout the scene so their left-right screen positions stay
consistent. Crossing the axis swaps their positions and disorients the viewer.

**Legal axis-crossing methods**:
1. Cut through a neutral on-axis shot (facing directly toward or away from camera).
2. Motivated camera movement that physically crosses the axis during the shot.
3. Insert a cutaway that breaks spatial continuity perception.
4. Major scene change that resets the axis.

### 30-Degree Rule
Between two consecutive shots of the same subject, change the camera angle by
≥ 30 degrees (usually combined with a scale change). Less than 30 degrees with
similar framing produces a jump cut.

### Match on Action
Cut mid-action (not before or after) so the motion trajectory is continuous
across the edit point. The viewer's attention follows the action through the cut.

### Eyeline Match
After a character looks off-screen, cut to what they see. The angle of the
reaction shot must match the implied height and direction of the look.

### Screen Direction
A character exiting frame right should enter the next shot from frame left to
maintain movement continuity. Reversing direction implies the character turned
around.

## AI-Specific: Preventing Axis Jumps in Per-Shot Generation

Models have no persistent 3-D world memory. Each generation rebuilds the scene
independently. Prevent spatial drift with these prompt-level techniques:

1. **Explicit position anchor**: repeat the same spatial declaration in every
   shot of a scene, e.g. "Character A on screen left facing right, Character B
   on screen right facing left." Never omit this even when changing scale.

2. **Master-shot anchor ("digital location")**: generate one wide establishing
   shot first. Reference its layout (wall position, window, light direction) in
   all subsequent shots of that scene.

3. **Reference image over text description**: use the establishing shot's
   keyframe as a `reference` or `first_frame` input for tighter shots. Pixel
   lock beats text description for spatial consistency.

4. **Eyeline prompt**: write the reaction shot's look direction explicitly,
   e.g. "looking down and to the left at X," consistent with X's position in
   the previous shot.

5. **Exit/entry vector**: if a character exits frame right, the next shot must
   state "continuing rightward" or "entering from screen left."

6. **Post-hoc axis fix**: if an axis jump is discovered, insert a neutral
   on-axis shot, a tight cutaway, or a dissolve between the two shots rather
   than regenerating the whole sequence.

## Transition Semantics

| Transition | Meaning |
|---|---|
| Hard cut (硬切) | Neutral default; continuous or very short time skip |
| Dissolve (叠化) | Time passing; location change with emotional continuity; memory/dream |
| Fade to black (黑场) | Strong act/chapter end; major time jump; death or dramatic finality |
| Fade to white (白场) | Epiphany, surreal, consciousness break |
| Match cut (匹配剪) | Similar composition/shape across time/space; poetic association |
| J-cut / L-cut | Next scene audio enters before picture (J) or current audio continues into next picture (L); softens hard cuts in dialogue |

## Short-Format Story Structure

### Time allocation by target duration

| Duration | Hook | Act 1 | Act 2 | Act 3 | Close |
|---|---|---|---|---|---|
| 15 s | 0–1 s | — | 1–13 s (single beat) | 13–15 s | — |
| 30 s | 0–3 s | 3–8 s | 8–22 s | 22–27 s | 27–30 s |
| 60 s | 0–3 s | 3–15 s | 15–45 s | 45–55 s | 55–60 s |
| 3 min | 0–3 s | 3–20 s | 20–100 s | 100–160 s | 160–180 s |

### Hook design (first 3 seconds)
Combine ≥ 2 of: **visual contrast** (jarring opening image), **suspense gap**
(show result, not cause), **self-relevance** (name the viewer's situation),
**emotional trigger** (strong expression, dramatic sound, conflict moment).
The first frame must contain motion. The hook must work silently (half of
viewers watch muted).

### Causal chain test
Replace every scene connector with "therefore" or "but." If the only connector
is "and then," the scene is structurally weak and should be cut or rewritten.
Short formats have zero tolerance for "and then" scenes.

## Lighting

### Three-point setup
- **Key light**: 30–45° off camera axis, 15–45° above eye line. Defines main
  shadow and volume.
- **Fill light**: opposite side, 1/4 to 1/2 key intensity. Controls shadow depth.
- **Rim/back light**: behind subject, separates subject from background.

### Lighting ratio → mood
- 2:1 – 4:1 (high-key): bright, safe, commercial, comedy
- 8:1+ (low-key): dramatic, suspense, moral ambiguity, noir

### Hard vs soft light
- Hard (small/direct source): sharp shadow edges → tension, interrogation, grit
- Soft (large/diffused source): gradual shadow edges → romance, beauty, dream

### Color temperature → emotion
- 2700–3200 K (warm orange): intimacy, nostalgia, warmth
- 5000–5600 K (neutral daylight): objective, documentary
- 6500 K+ (cool blue): isolation, technology, sadness

### Time-of-day light
- Golden hour (±1 h of sunrise/sunset): warm, low-angle, long shadows → romance, hope
- Blue hour (20–40 min after sunset): melancholy, urban, transitional
- Noon hard light: harsh reality, violence, nowhere to hide
- Overcast: flat, oppressive, moral ambiguity
