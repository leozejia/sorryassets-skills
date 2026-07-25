# Style Library Contract

A style is a reusable, cross-cutting visual modifier expressed as data, not a
Skill (see `ARCHITECTURE.md`). Styles let a creator request "make it look like
X" and let the agent compose that look onto any product-type Skill without a
dedicated Skill per style.

## Where Styles Live

Each product-type Skill carries its own copy of the relevant styles under
`references/styles/<style-id>.md`. Styles are loaded on demand: `SKILL.md` tells
the agent to read the requested style file only when a style is applied.

Styles are duplicated across Skill packages, like other shared references. This
preserves independent installation. If drift becomes a burden, sync canonical
style sources into each package with a script and validate against drift; never
convert them to cross-package references.

## Why Style Is Data, Not a Skill

Making a Skill per style multiplies with product types (type × style) and
explodes. Keeping style as data means:

- adding a style is adding one file, touching no Skill logic;
- the agent freely composes any style with any product type;
- "Pixar-style healing short" = `narrative-short` Skill + `pixar` style entry.

The reusable *method* — how to extract, describe, and stably apply a visual
style at the prompt layer — is what a Skill teaches. The specific look is data.

## Style Entry Format

A style entry describes a look in concrete, prompt-ready visual traits, never as
a bare name or a studio/franchise label used as a shortcut. The agent injects
these traits into image and video prompts at each generation step.

```markdown
# <Style Name>

## Identity
One or two sentences on the overall visual impression and when to use it.

## Palette
Dominant colors, contrast tendency, warm/cool bias, saturation level.

## Light
Light quality (hard/soft), key ratio, color temperature, signature lighting
situations.

## Composition and Lens
Framing habits, aspect tendencies, lens/depth-of-field character, symmetry vs
naturalism.

## Camera Movement
Characteristic moves (locked, slow push, handheld, step-printed) and pacing.

## Texture and Material
Surface qualities: grain, cleanliness, stylization level, rendering feel.

## Prompt Anchors
A short list of concrete phrases to inject into prompts to invoke the style
reliably. Written as usable prompt fragments, not adjectives.

## Avoid
Traits that break the style — what to keep out of the prompt.
```

## Quality Bar for a Style Entry

1. Every section is concrete enough to translate directly into prompt phrases;
   no reliance on a name ("make it Pixar") as a substitute for description.
2. The look is reusable across materially different briefs and product types.
3. Prompt anchors are tested to invoke the look on at least one live model
   before the containing Skill is marked `live`.
4. The entry does not encode a single story, subject, model, or campaign.

## Starter Library

The first batch seeds these high-recognition looks (see `docs/product-types.md`):

- `pixar` — stylized 3D, warm rounded forms, soft key light, high-key palette
- `wong-kar-wai` — step-printed motion, neon, handheld intimacy, saturated warm/cool contrast
- `cyberpunk` — neon-noir, high contrast, rain-slick reflective surfaces, cool bias
- `documentary` — naturalistic available light, observational handheld, neutral palette
- `clean-commercial` — bright high-key, minimal negative space, product-forward, low grain
