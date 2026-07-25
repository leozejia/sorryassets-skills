# Final film review scaffold

Review the playable assembled film against the approved brief and production
evidence. Do not infer quality from provider success or from isolated stills.
Use the defect classification in `references/craft/defects.md` when reporting flaws.

Inputs:

- brief, delivery constraints, and quality bar: {{contract}}
- story spine, script, and shot plan: {{narrative plan}}
- production bible and take decisions: {{continuity and selections}}
- playable output, probe, manifest, and graph: {{final evidence}}

Report:

1. **Narrative legibility**: intended promise, causal progression, decisive
   change, and resolution are readable without hidden planning context. Apply
   the causal chain test: every scene connection reads as "therefore" or "but,"
   not "and then."

2. **Continuity**: identity anchors (face, hair, signature color, silhouette),
   location layout, props, lighting direction, screen direction, and intentional
   state changes survive every join. Flag any unintentional drift by defect type
   (identity drift / axis jump / lighting inconsistency).

3. **Cinematic craft**: framing, action, camera movement, pacing, and
   transitions support the story. Check that scale and angle choices match their
   stated narrative purpose from the shot plan. Transitions use the correct
   semantic form (see `references/craft/cinematography.md` — Transition Semantics).

4. **Defects**: for each flaw, state the defect type from `references/craft/defects.md`,
   the exact moment (shot number and approximate timestamp), and the severity
   (blocks acceptance / degrades quality / minor). Types to check:
   - Identity drift
   - Anatomical distortion
   - Axis jump / spatial inconsistency
   - Temporal flickering
   - Text / logo corruption
   - Lip-sync mismatch
   - Physics violation
   - Motion blur artifacts

5. **Delivery and evidence**: runtime, dimensions, codec, local path, source
   order, digest, tasks, charges, lineage, and selected takes agree with the
   manifest.

6. **Verdict**: accept or reject. State the strongest moment, the weakest
   moment, and — if the execution boundary permits another attempt — the single
   smallest evidence-based correction that would most improve the result.

A film fails when any required story, continuity, craft, delivery, or evidence
gate fails. Do not average independent shot scores into a passing verdict.
