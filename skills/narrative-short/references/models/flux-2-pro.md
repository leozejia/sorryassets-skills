# Flux 2 Pro — Model Card

Updated: 2026-07. Verify against live catalog before use.

## Parameters

| Parameter | Values | Default |
|---|---|---|
| Aspect ratio | 1:1, 16:9, 9:16, 3:4 | 1:1 |

## Input Roles

| Role | Type | Count | Notes |
|---|---|---|---|
| `prompt` | text | 0–1 | Main generation prompt |
| `reference` | image | 0–4 | Style / character / scene reference |

Always verify current role names and limits with `get_catalog` before
constructing a request. Catalog is authoritative; this card is a planning aid.

## Negative Prompts

Not officially documented. Describe what you want rather than what to avoid.

## Prompt Style

Use descriptive natural language rather than keyword lists. Specific, concrete
descriptions outperform abstract style labels.

Good: "A young woman with short black hair and a red wool coat standing on a
rain-wet street at night, warm streetlight from the left, shallow depth of
field, cinematic color grading"

Avoid: "beautiful, stunning, masterpiece, best quality" — these generic
quality tokens add noise without directing the output.

## Reference Image Usage

- Up to 4 reference images can be supplied as `reference` inputs.
- State each image's role in the prompt when supplying multiple references:
  "use the first image for the character's appearance, the second for the
  lighting style."
- Reference weight is controlled through prompt emphasis (repeat key traits
  from the reference in the text prompt) rather than a dedicated weight
  parameter.
- A front-facing, evenly lit, unoccluded character reference produces the
  most stable identity output.

## Best Uses

- Character reference portraits for use as `reference` inputs in video
  generation (Seedance, Veo).
- Scene keyframes and mood boards.
- Style exploration: generate 2–3 candidates varying one visual decision
  (lighting angle, color temperature, framing) before committing to a
  production direction.

## Known Limitations

- No native video output; use generated images as reference inputs for video
  models.
- Identity consistency across multiple generations requires repeating anchor
  traits in each prompt; there is no persistent character memory.
- Text / logo rendering is unreliable — avoid requiring legible on-screen text.
