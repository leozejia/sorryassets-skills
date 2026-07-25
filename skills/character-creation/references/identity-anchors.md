# Character Identity Anchors

Use this reference when designing characters for multi-shot AI video production.
The goal is to make each character recognizable under adverse conditions: distant
shots, fast cuts, partial occlusion, and the identity drift that affects all
current generation models.

## Why Anchors Matter for AI Generation

Current video models have no persistent cross-generation memory. Each shot
rebuilds the character from the reference image and prompt text. Anchors are
the traits that survive this rebuild reliably. Face details (exact nose shape,
subtle expression) are the least stable. Silhouette and color are the most
stable.

Design characters so they are identifiable from their silhouette alone.

---

## Anchor Hierarchy (most to least stable across generations)

1. **Silhouette** — the overall shape of the character in costume. A tall figure
   in a long dark coat reads differently from a compact figure in a bright jacket
   even at thumbnail size or in backlight.

2. **Signature color** — one dominant color assigned exclusively to this
   character across all scenes. Appears on clothing, accessories, or hair.
   Warm/cool contrast between characters in the same scene aids instant
   identification.

3. **Prop motif** — a recurring object carried or worn by the character
   (a specific bag, hat, scarf, instrument, tool). In close-up, the prop
   confirms identity without requiring a clear face read.

4. **Hair shape** — overall silhouette of the hair (long straight / short curly /
   shaved / bun) is more stable than hair color across generations.

5. **Face** — the least stable anchor in AI generation. Treat face as a
   confirmation anchor, not a primary identification anchor.

---

## Character Sheet Design

Before generating any video shots, produce a character sheet for each
principal character. The sheet is a single image (or a 3-view composite)
used as the primary `reference` input for all shots featuring that character.

### Requirements for a usable character sheet

- **Lighting**: even, soft, neutral color temperature. Avoid dramatic shadows,
  colored gels, or strong backlighting — these reduce the model's ability to
  extract stable identity features.
- **Angle**: front-facing primary view. Add a 3/4 view and back view if the
  character will appear in those angles frequently.
- **Background**: plain or very simple. A busy background competes with the
  character for model attention.
- **Expression**: neutral or the character's default expression. Extreme
  expressions in the reference image can bias generation toward that expression.
- **Costume**: the character's primary costume, fully visible from head to toe
  in at least one view.
- **No occlusion**: hands visible, face unobstructed, no other characters
  overlapping.

### 3-view composite layout

```
[Front view] [3/4 view] [Back view]
```

Crop each view to a separate image when the shot angle requires it:
- Front-facing dialogue shots → use front view reference
- Walking-away shots → use back view reference
- Profile shots → use 3/4 view reference

---

## Signature Color Assignment

Assign one signature color per principal character before production begins.
Record it in the production bible.

Rules:
- No two principal characters share the same signature color.
- The signature color appears in every scene the character appears in,
  even if only as an accessory.
- Choose colors with high mutual contrast for characters who frequently
  share the frame (e.g. warm red vs cool blue, not orange vs yellow).
- Avoid colors that clash with the dominant scene palette — the character
  should stand out from the environment, not disappear into it.

Example assignment for a 3-character drama:
```
林悦 (protagonist): warm red — red scarf, red lining on coat
陈明 (antagonist): cold grey-blue — grey suit, blue tie
小雨 (ally): soft yellow-green — olive jacket, yellow bag
```

---

## Prop Motif Design

A prop motif is most useful when:
- The character is frequently shown in close-up or medium close-up
- The character's face is partially obscured (mask, shadow, distance)
- The character appears in a crowd or group shot

Design the prop to be:
- **Distinctive in shape**: not a generic phone or cup — a specific unusual
  object, or a common object with a distinctive color/marking
- **Consistently placed**: always in the same hand, always worn the same way
- **Visible at medium shot scale**: small jewelry is not useful; a large
  distinctive bag or hat is

---

## Prompt Anchor Phrases

When writing shot prompts, repeat the character's anchor traits explicitly.
Do not assume the reference image alone is sufficient.

Template:
```
[Character name], [hair description], [signature color item], [silhouette note]
```

Example:
```
林悦, 棕色卷发, 红色围巾, 深色长风衣
```

Repeat this phrase in every shot prompt that features this character, even
when the reference image is also supplied. The text anchor reinforces the
visual anchor and reduces identity drift.

---

## Multi-Character Scenes

When two or more characters share the frame:

1. Assign each character to a consistent screen position (left / center / right)
   and repeat that assignment in every shot of the scene.
2. Use contrasting signature colors so the characters are distinguishable at
   a glance without reading faces.
3. Supply a separate reference image for each character as distinct `reference`
   inputs. State each image's role in the prompt.
4. Write a spatial anchor sentence and repeat it verbatim in every shot:
   "林悦在画面左侧, 陈明在画面右侧"

---

## Intentional vs Unintentional Change

Distinguish between changes that are part of the story and drift that is
a generation error.

**Intentional change** (record in production bible):
- Character ages, is injured, changes costume, or transforms as part of the plot.
- Document the before and after states as separate anchor sets.
- Generate a new reference image for the post-change state.

**Unintentional drift** (treat as a defect):
- Hair color shifts between shots with no story reason.
- Costume details change without a scene change.
- Face shape varies noticeably across shots.

See `references/defects.md` — Identity Drift section for prevention and
remediation.
