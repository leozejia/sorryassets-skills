# Adaptation: From Source Text to a Series Plan

The creator has a novel, script, web serial, or story and wants it turned into a
watchable series. You cannot generate the finished series — a vertical short
drama is 60–100 episodes and even a lean web series is dozens of minutes, i.e.
hundreds to thousands of shots with cross-series consistency, which current
models cannot deliver reliably or economically. What you *can* deliver, and what
this skill produces, is the **adaptation plan**: the structural reasoning that
turns a large text into a producible series and hands each episode to
`narrative-short` as a ready brief.

This is a planning deliverable, not media. No generation happens here.

## Handling Long Source Text

You will often get more text than fits comfortably in one pass. Read in layers,
not linearly:

1. **Structural pass first.** Get the whole shape before any detail: the central
   dramatic question, the protagonist's arc from first state to last, the major
   turning points, the ending. For a very long source, delegate parallel reads
   of sections to subagents and have each return a compact beat list; you
   assemble the map. Do not try to hold every sentence in context.
2. **Beat inventory.** List the significant story beats in order — reveals,
   reversals, decisions, confrontations, set-pieces, the emotional peaks. This
   inventory, not page count, is what episodes are built from.
3. **Detail pass on demand.** Only zoom into a passage when a beat needs its
   specifics (a signature line, a spatial layout, a character detail).

Record the map and beat inventory as text nodes before planning episodes.

## Episode-Count Planning

Episode count is derived, never guessed. Drivers, in order of authority:

### 1. Target format decides the envelope (dominant driver)
Confirm the format first; it fixes per-episode length, the count range, and the
pacing law.

| Format | Per-episode | Typical count | Pacing law |
|---|---|---|---|
| 竖屏短剧 Vertical short drama | 60–90 s | 60–100 | Hook in first 3 s; one reversal + a cliffhanger every episode |
| 横屏网剧 Web series | 8–20 min | 12–24 | An A-plot turn per episode; act-out before each break |
| 精品剧 Premium series | 40–50 min | 8–12 | Multi-thread; episode arcs inside a season arc |
| 迷你剧 Mini-series | 30–45 min | 4–6 | Each episode a distinct movement of one story |

### 2. Story supply sets the real number inside the envelope
Within the format's range, the beat inventory decides where you land. A useful
first estimate: each episode carries **1–2 significant turning points plus one
hook**. Divide the beat count by that load to get a starting episode count, then
adjust for weighting and hooks below. If the source cannot supply enough beats
for the format's minimum, say so — pad with filler and the series dies. Prefer
fewer, denser episodes over many thin ones.

### 3. Even weighting
Each episode should carry roughly equal story weight. Guard against the common
failure of a bloated episode 1 and a padded middle. If one stretch of source is
beat-rich and another is thin, redistribute (compress the thin stretch, split
the dense one) rather than honoring the source's own chapter breaks.

### 4. Hook placement at every boundary
Set each episode boundary on an unresolved question or a reversal, not on a
natural resting point in the prose. The cut should make the viewer need the next
episode. Mark the specific hook for every boundary; a boundary without a hook is
a planning defect.

### 5. Compression ratio
Novels oversupply interiority and subplot and undersupply what a screen needs
(visible action, spoken conflict). State the compression posture explicitly per
stretch: **cut** (drop entirely), **compress** (same beat, less time),
**merge** (combine subplots or minor characters), **invent** (add a dramatized
scene the prose only summarizes). Record what you cut and why in the adaptation
notes — the creator must be able to see the deletions.

## Adaptation-Specific Challenges

These are the hard translations from page to screen. Name your choice for each
that applies:

- **Interiority → exterior.** Inner monologue and description do not exist on
  screen. Convert to action, dialogue, reaction, or a visual the camera can
  show. If a thought cannot be externalized, it is either cut or dramatized as a
  scene.
- **POV.** The prose may sit inside one head; the camera is omniscient by
  default. Decide whose POV each scene privileges and how (framing, presence,
  what is withheld).
- **Nonlinear time.** Flashbacks and parallel timelines that read cleanly on the
  page can confuse on screen. Decide whether to linearize, and if not, how each
  jump is signaled.
- **Subplot pruning and character merging.** A screen series sustains far fewer
  threads than a novel. Cut subplots that do not serve the spine; merge minor
  characters who serve one function.
- **Exposition → drama.** Background delivered as narration becomes a scene with
  conflict, or it is cut. No lore dumps.
- **The spine.** Find the single dramatic question that runs the whole series
  (what the protagonist wants and what stands in the way). Every episode advances
  or complicates it. A series without a spine is a sequence of events, not a
  story.

## Character Map (feeds production)

Extract the recurring cast the series actually needs (after merging). For each,
record what `character-assets` will need to lock identity: silhouette, signature
color, a prop or costume motif, and the arc across the series. This map is a
deliverable and a direct input to the production skills — it is how the whole
series keeps a character looking like themselves.

## Output Structure (the adaptation plan)

Deliver, as text nodes:

1. **Logline and theme** — one sentence of premise, one of theme.
2. **Format decision and episode-count justification** — the chosen format, the
   count, and the reasoning that produced the count (from the drivers above).
3. **Character map** — recurring cast with identity anchors and arcs.
4. **Act / season structure** — the spine and how it breaks into acts or a
   season shape.
5. **Per-episode cards** — for each episode: title, the story beats it covers,
   the boundary hook, characters and locations involved, target duration.
6. **Adaptation notes** — what was cut, compressed, merged, or invented, and
   why.
7. **Per-episode briefs** — each episode written as a self-contained brief that
   `narrative-short` can consume directly (premise, beats, characters with
   anchors, intended effect, delivery constraints).

## Handoff to Production

The plan is the bridge the hub was missing: a whole novel cannot enter a single
`narrative-short` run, but one planned episode is exactly one `narrative-short`
brief, and the character map is exactly what `character-assets` locks for
cross-episode consistency. To show the creator something moving, run
`narrative-short` on the episode-1 brief to produce a pilot — that is *using* the
production skill, and stays out of this skill's scope. This skill's job is done
when the plan and the per-episode briefs are complete and internally consistent.

## Rights Note

Adapting an existing novel or serial usually involves someone's IP. A personal
experiment is one thing; a published or commercial adaptation is the creator's
legal call. Surface the question once when the intent is public or commercial;
do not police.

