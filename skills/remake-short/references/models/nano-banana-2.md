# Nano Banana 2 — Model Card

Updated: 2026-07. Verify against live catalog before use.

## Parameters

No documented parameter fields beyond reference image inputs.
Verify with `get_catalog` before constructing a request.

## Input Roles

| Role | Type | Count | Notes |
|---|---|---|---|
| `reference` | image | 0–6 | Visual direction inputs |

**Important**: Nano Banana 2 has no `prompt` text field. All generation
direction is conveyed through reference images. Always verify current role
names and limits with `get_catalog` before constructing a request.

## How to Use Without a Text Prompt

Since there is no text prompt, the reference images must carry all visual
intent. Strategies:

1. **Style transfer**: supply 1–2 images that establish the target visual
   style (color palette, texture, mood). The output will blend toward that
   style.

2. **Character variant generation**: supply a character reference image and
   1–2 images showing the desired pose, angle, or setting. The model
   synthesizes a new image combining the character's identity with the
   reference context.

3. **Composition reference**: supply an image with the desired composition
   or framing as one reference and a subject reference as another.

4. **Diminishing returns with more images**: 3–4 well-chosen references
   typically outperform 6 mediocre ones. More references can dilute model
   attention and produce averaged, indistinct results.

## Best Uses

- Generating character variants (different angles, expressions, costumes)
  from an established character reference without writing prompts.
- Style-consistent asset generation when the style is better shown than
  described.
- Rapid visual exploration when you have strong reference material but
  uncertain text descriptions.

## Comparison with Flux 2 Pro

| | Nano Banana 2 | Flux 2 Pro |
|---|---|---|
| Text prompt | None | Supported |
| Reference images | Up to 6 | Up to 4 |
| Control method | Images only | Text + images |
| Best for | Style/variant from references | Described scenes with reference anchors |

Use Nano Banana 2 when you have strong visual references and want to
generate variants. Use Flux 2 Pro when you need to describe a specific
scene or composition in text.

## Known Limitations

- No text prompt means no direct control over narrative content, dialogue,
  or scene description.
- Identity consistency depends entirely on reference image quality.
- Text / logo rendering is unreliable — avoid reference images with
  prominent text if the output should be text-free.
