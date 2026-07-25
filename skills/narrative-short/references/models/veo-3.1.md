# Veo 3.1 — Model Card

Updated: 2026-07. Verify against live catalog before use.

## Parameters

| Parameter | Values | Default |
|---|---|---|
| Duration | 4 s, 8 s | 4 s |
| Resolution | 1080p | 1080p |
| Aspect ratio | Inferred from prompt or reference image | 16:9 |

## Input Roles

| Role | Type | Count | Notes |
|---|---|---|---|
| `prompt` | text | 0–1 | Main generation prompt |
| `first_frame` | image | 0–1 | Locks the opening frame |
| `reference` | image | 0–3 | Ingredients: character / scene / prop |

Always verify current role names and limits with `get_catalog` before
constructing a request. Catalog is authoritative; this card is a planning aid.

## Negative Prompts

Official guidance: do not use negative phrasing ("no walls", "don't show X").
Instead, describe the unwanted element directly as a noun to exclude it, e.g.
write "wall" rather than "no wall." Negative instructions may produce the
opposite of the intended effect.

## Prompt Structure

Veo 3.1 responds well to a field-labeled format. Use labeled blocks rather
than a single prose paragraph:

```
[Scene description — character, costume, location, weather, visual detail]

Camera shot: [scale and angle, e.g. "medium close-up, low angle"]
Depth of field: [e.g. "shallow — sharp on subject, blurred background"]
Lighting: [color temperature, quality, direction, palette anchors]
Mood: [one-word or short phrase]

Actions:
- [Beat 1: precise action with timing, e.g. "takes three steps to the window"]
- [Beat 2: next beat]

Dialogue:
- [Character A]: "[line]"
- [Character B]: "[line]"
```

Keep each action beat to one observable motion. Dialogue lines should be short
and natural, matched to the shot duration.

## Native Audio

Veo 3.1 generates audio natively. Describe the intended sound in the prompt:
ambient environment, dialogue, and music tone. The `Dialogue:` block drives
lip-sync generation; keep speakers labeled consistently.

## Reference Image (Ingredients) Best Practices

- Up to 3 reference images can be supplied as `reference` inputs.
- State each image's role in the prompt: "use the first image for the
  character's appearance, the second for the scene background."
- A front-facing, evenly lit character reference produces the most stable
  identity across shots.
- Combine a character reference with a scene reference to anchor both
  identity and spatial layout simultaneously.

## First Frame Usage

- Supply `first_frame` to lock the opening composition and lighting.
- Useful for shot chaining: use the last frame of the previous clip as the
  `first_frame` of the next to maintain continuity across separately generated
  segments.

## Known Limitations

- Identity drift when reference images are omitted or low quality.
- Anatomical distortion on hands and complex poses.
- Text / logo corruption — avoid requiring legible on-screen text.
- Axis jumps when spatial anchors are not repeated per shot.
- Maximum 8 s per generation; longer sequences require chaining.
