---
name: adaptation-plan
description: Turn a novel, script, web serial, or any long text into a producible series plan with SorryAssets. Use when the creator has source text and wants it broken into episodes with a sensible episode count and structure — for example "turn my novel into a short-drama series." Produces the adaptation plan, not finished video: logline and theme, a format decision with a justified episode count, a character map with identity anchors, act/season structure, per-episode cards with boundary hooks, adaptation notes, and a ready-to-run narrative-short brief for every episode. This is a planning deliverable; it hands each episode to a production skill rather than generating media itself.
---

# Adaptation Plan (改编规划)

A complete playbook for turning source text into a producible series plan and an
inspectable SorryAssets project. You own all reasoning and orchestration.
SorryAssets provides atomic tools and durable local state.

This is a **planning skill**, not a production skill. Its deliverable is a
structured adaptation plan in text — it generates no images or video. It exists
because a whole novel cannot enter a single `narrative-short` run: this skill
decomposes the text so that each episode becomes one `narrative-short` brief and
the character map becomes the input that keeps the cast consistent across
episodes.

Why planning, not a finished series: a vertical short drama is 60–100 episodes
and even a lean web series is dozens of minutes — hundreds to thousands of shots
with cross-series consistency, which current models cannot deliver reliably or
economically. Delivering the plan honestly is far more valuable than
half-generating an incoherent series.

Load reference files on demand as each step directs.

## Workflow

### 1. Establish the brief and format
1. Open or create a clearly named project. (No `get_catalog` is needed for
   planning; it is needed later when an episode is produced.)
2. Record the source text (or its location), the creator's goal, the intended
   audience, and the intended use (personal / published / commercial). If the
   use is public or commercial, surface the rights note in
   `references/craft/adaptation.md` once.
3. Confirm the **target format** — this is the dominant driver of everything
   downstream. Use the format table in `references/craft/adaptation.md`. If the
   creator has no format in mind, recommend one from the source's length and
   tone and record why.

### 2. Map the source
Follow "Handling Long Source Text" in `references/craft/adaptation.md`: a
structural pass for the whole shape, then a beat inventory, then detail passes on
demand. For long sources, delegate parallel section reads to subagents and
assemble their beat lists. Record the story map and beat inventory as text nodes
before planning episodes.

### 3. Plan the series
Use `prompts/format-decision.md` to lock the format, then `prompts/episode-plan.md`
to derive the structure. Episode count is *derived* from the drivers in
`references/craft/adaptation.md` (format envelope, story supply, even weighting,
hook placement, compression ratio) — never guessed. Build the character map with
identity anchors so production can keep the cast consistent. Name your choice for
each adaptation challenge that applies (interiority, POV, nonlinear time, subplot
pruning, exposition, spine).

### 4. Write the plan and per-episode briefs
Produce the full output structure from `references/craft/adaptation.md`: logline
and theme, format decision with episode-count justification, character map,
act/season structure, per-episode cards with boundary hooks, and adaptation
notes. Then write each episode as a self-contained brief a production skill can
consume directly — premise, beats, characters with anchors, intended effect, and
delivery constraints matching the chosen format.

### 5. Review the plan
Use `prompts/adaptation-review.md`. Judge the plan as a producible whole:
episode count justified and evenly weighted, every boundary carries a hook, the
spine runs through all episodes, the character map is complete enough for
production, and each per-episode brief is genuinely runnable. Record an
accept/reject verdict and the weakest episode.

## Handoff (out of scope, but state it)
When the creator wants to see an episode move, run `narrative-short` on an
episode brief (typically episode 1) to produce a pilot, and use
`character-assets` with the character map to lock the recurring cast. That is
*using* the production skills and is deliberately outside this skill. This skill
is complete when the plan and per-episode briefs are consistent and runnable.

## Stop Conditions
Stop if the source text is insufficient for the chosen format's minimum viable
episode count (say so rather than padding with filler), if source access or
permission is missing, or if the intended use raises an unresolved rights
question the creator must settle. Preserve the partial plan and evidence; do not
inflate a thin source into a padded series to manufacture a result.
