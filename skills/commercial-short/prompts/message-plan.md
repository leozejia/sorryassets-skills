# Message plan scaffold

Translate one product message into a small ordered set of sell-point shots.

Product: {{product name and what it is}}

Single message / sell-point: {{the ONE thing this video must land}}

Target audience: {{who}}

Desired action (CTA): {{what the viewer should do}}

Delivery constraints: {{duration, aspect, platform}}

Product fidelity anchors: {{exact colors, logo placement, proportions, material}}

---

Choose the spine that best serves the single message. A common commercial spine
is: problem → product → benefit → proof → CTA. Derive the real one from the
message; do not force a template.

For each shot provide (use vocabulary from `references/craft/cinematography.md`):

**Shot [NN] | [title]**
- Sell-point purpose: which part of the message this shot advances
- Target duration
- Scale / angle / camera move (clean hero framing, macro insert, controlled move)
- Product presence: how the product appears and which fidelity anchors are visible
- Start state → end state
- Lighting: match the chosen style (often `references/styles/clean-commercial.md`)
- References: product reference node id and role (prefer product as `first_frame`)
- Pass criteria: one observable sentence, including the fidelity check

---

Rules:
- One message across the whole piece. Cut any shot that advances a second message.
- The product's fidelity anchors are restated in every shot prompt.
- No legible on-screen text from the model — plan brand text/logo as an editing
  composite, not a generated element.
- The final shot must carry or set up the CTA (the desired viewer action),
  even though the CTA text itself is composited in editing.
- Total planned duration matches the delivery target.
