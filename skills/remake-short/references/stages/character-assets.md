# Stage: Character Assets

This is a production stage inside a product-type workflow, not a standalone
Skill. Run it when a piece has recurring characters whose identity must stay
consistent across shots. It produces reusable character reference images that
later shots consume as `reference` or `first_frame` inputs.

## Goal

Turn a character brief into one selected, reusable reference image per principal
character, with identity anchors that survive the drift every generation model
introduces.

## Why This Stage Matters

Video models have no persistent cross-generation memory. Each shot rebuilds the
character from the reference image and prompt text. The traits that survive that
rebuild are the anchors. Face detail is the least stable; silhouette and color
are the most stable. Design characters to be identifiable from silhouette alone.

## Identity Anchor Hierarchy (most to least stable)

1. **Silhouette** — overall shape in costume; readable at thumbnail size or in
   backlight.
2. **Signature color** — one dominant color assigned exclusively to this
   character, present in every scene.
3. **Prop motif** — a recurring carried/worn object that confirms identity in
   close-up without a clear face read.
4. **Hair shape** — silhouette of the hair, more stable than hair color.
5. **Face** — least stable; treat as a confirmation anchor, not primary.

## Character Sheet Requirements

Produce one reference image (or a 3-view composite) per principal character,
used as the primary `reference` input for all their shots:

- **Lighting**: even, soft, neutral temperature. No dramatic shadow or gels.
- **Angle**: front-facing primary; add 3/4 and back views if needed by shots.
- **Background**: plain; a busy background competes for model attention.
- **Expression**: neutral or the character's default.
- **Costume**: primary costume fully visible head-to-toe in at least one view.
- **No occlusion**: hands visible, face unobstructed, no overlapping characters.

3-view composite → crop each view for angle-appropriate shots (front for
dialogue, back for walk-aways, 3/4 for profiles).

## Signature Color Assignment

Assign one signature color per principal before production. Record it in the
production bible. Rules: no two principals share a color; the color appears in
every scene the character is in; characters who share frames get high mutual
contrast; avoid colors that clash into the scene palette.

Example (3-character drama):
```
Protagonist: warm red — red scarf, red coat lining
Antagonist:  cold grey-blue — grey suit, blue tie
Ally:        soft yellow-green — olive jacket, yellow bag
```

## Method

1. Record the brief and each character's intended use in a text node.
2. Design the anchors (silhouette, signature color, prop motif, sheet plan)
   before generating.
3. Choose an exact `image.generate` binding. Check the model card in
   `references/models/` for reference limits and prompt constraints. Prefer the
   least expensive compatible option at comparable quality.
4. Plan a bounded candidate set varying only meaningful visual decisions
   (lighting angle, expression, costume detail). Record the plan before
   submitting.
5. Generate one node per candidate using only catalog-declared roles. Poll
   `list_project_graph` until terminal; a usable result needs `taskStatus:
   succeeded` and a local file path.
6. Score candidates on: prompt fidelity, identity clarity (silhouette readable,
   signature color present), anchor stability (would this reproduce
   consistently as a reference?), intended-use composition, visible defects.
   See `references/craft/defects.md` for defect types.
7. Keep all candidates in the graph. Select the strongest usable one; record its
   node id and a concise reason in a text node.
8. If every candidate is unusable, make at most one focused refinement round
   within authorization; otherwise stop and report honestly.

## Prompt Anchor Phrases

Repeat the character's anchor traits in every shot prompt, even when the
reference image is supplied — text reinforces the visual anchor and reduces
drift:

```
[name], [hair], [signature-color item], [silhouette note]
e.g. 林悦, 棕色卷发, 红色围巾, 深色长风衣
```

## Output

Per principal character: a selected reference node id, its anchor set (recorded
in the production bible), and — for multi-character scenes — a consistent screen
position assignment. These feed the shot-plan and the continuity contract.
