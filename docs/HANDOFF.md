# Handoff

One document for the architect taking over `sorryassets-skills`. It records what
is done, what is deliberately deferred, and what must happen before these Skills
go live. Design rationale is not repeated here — it lives in `ARCHITECTURE.md`
(the constitution) and `docs/product-types.md` (the roadmap); this file points
to them and does not restate them, so there is a single source of truth.

Status at handoff: all Skills are `preview`, committed and pushed to
`origin/main`. `npm test` and `npm run bundles:verify` pass. The `sorryassets`
product repo is untouched; the `0.1.18` desktop release batch is unaffected.

## 1. What ships in this repo

Four Skills in two classes (the class distinction is defined in
`ARCHITECTURE.md` — Production Skills vs Planning Skills):

| Skill | Class | Version | Status | Deliverable |
|---|---|---|---|---|
| `narrative-short` | production | 1.0.0 | preview | Silent short film + review |
| `commercial-short` | production | 1.0.0 | preview | Silent product/brand short |
| `remake-short` (神还原) | production | 1.0.0 | preview | Faithful remake + timed text/music plan |
| `adaptation-plan` (改编规划) | planning | 1.0.0 | preview | Series plan + per-episode narrative-short briefs |

Production Skills call `image.generate` / `video.generate` and deliver media.
The planning Skill has empty `capabilities`, generates no media, and delivers a
text plan whose per-episode briefs each feed one `narrative-short` run.

## 2. Repository mechanics (how not to break it)

- **Shared references.** Canonical craft/stages/styles/models live in `_shared/`
  and are copied into each Skill's `references/` by
  `scripts/sync-references.mjs`. Each Skill declares what it consumes in
  `references/.sync.json`. Edit `_shared/`, never the copies; then
  `npm run references:sync`. `npm test` runs the drift check (`--check`) and
  fails if a copy diverged. Rationale: Skills stay independently installable
  (ARCHITECTURE.md — Self-Contained Over DRY).
- **Deterministic bundles.** `catalog.json` embeds each Skill's package manifest
  (digest, per-file sha256) and bundle metadata. After any content change, run
  `npm run bundles:sync` then `npm test`. The digest is computed from the Skill
  directory's bytes only — catalog metadata like `version` is not part of it.
- **Per-Skill semver.** Every Skill carries `version` (`MAJOR.MINOR.PATCH`),
  enforced by `validate.mjs`. Bump rules are in ARCHITECTURE.md — Versioning.
  Version is decoupled from the digest: the digest proves bytes, the version
  names the release.
- **Local helpers.** `remake-short` ships `extract-frames.mjs` (ffmpeg frame
  sampling) and each production Skill ships `assemble-video.mjs`; both have
  self-tests wired into `npm test` and require `ffmpeg`/`ffprobe` on PATH.

## 3. Deferred: product-repo versioning adoption (design only)

The catalog now carries per-Skill `version`, but the `sorryassets` product
surfaces still identify Skill releases by the repository-level `sourceCommit`
(a git hash). This is a design for adopting per-Skill semver in the product repo.
It authorizes no product-repo change and is deferred past `0.1.18`, which
excludes Skill changes.

**Why it matters — two concrete defects of a repo-level hash:**
1. **Cross-Skill false updates.** The desktop computes "update available" as
   `catalog.sourceCommit !== record.sourceCommit`
   (`apps/desktop/src/skills/skillHubState.ts`). Because `sourceCommit` is
   repo-level, editing one Skill flips *every* installed Skill to "update
   available," even Skills whose bytes did not change.
2. **A git hash is not human-facing.** A creator cannot tell whether `db41efc…`
   is newer than `4967bb9…`. A semver (`1.2.0` vs `1.1.0`) communicates ordering
   and magnitude.

**Target state:** per-Skill `version` is the identifier shown on the website and
in the Skill Hub; "update available" is decided per Skill by comparing installed
vs catalog `version`; `sourceCommit` may remain as provenance but stops being
the user-facing version and the update trigger. Package integrity stays proven
by `digest`/bundle `sha256`.

**Affected product-repo surfaces** (all in `sorryassets`, out of scope here):
- **Desktop Rust** `apps/desktop/src-tauri/src/skill_library.rs` — `CatalogSkill`
  gains `version: String`; `InstalledSkill` records it at install; update
  detection moves off `source_commit`. Serde has no `deny_unknown_fields`, so a
  catalog carrying `version` deserializes safely on today's build (the field is
  dropped) — publishing it now breaks nothing.
- **Desktop TS** `apps/desktop/src/skills/skillHubState.ts` — replace the
  `sourceCommit` comparison with a per-Skill semver compare; surface `version`
  in the Hub UI.
- **Web** `apps/web/src/lib/skillIndex.ts` — index type gains `version: string`;
  display on Skill pages. (`version: number` there is the catalog schema
  version — a different field, do not conflate.)
- **Backend Go** `apps/backend/internal/catalog/store.go` — carry `version`
  through the DTO if the catalog is re-served. No routing/billing impact.

**Sequencing:** additive first (already done — the field is published and safely
ignored), then one coordinated product-repo change after `0.1.18` that adds the
field across Rust/TS/web/Go and switches update detection to a minimal numeric
`MAJOR.MINOR.PATCH` compare. Keep `sourceCommit` during the transition so
records written by an older desktop stay interpretable.

**Non-goals:** no change to the publication lane or byte verification; no
pre-release/channel semantics in v1; no coupling of Skill version to the desktop
app version.

## 4. Before live — required, not yet done

1. **Real-device acceptance.** Every Skill is `preview`. A Skill earns `live`
   only after producing a real result through the installed path (ARCHITECTURE.md
   — Skill Quality Bar, item 9). All current evidence is preflight (validation +
   self-tests), not a real generation run.
2. **Publish through the pipeline.** Going live runs through the `Skill Publish`
   workflow, not a local upload — it writes the immutable R2 objects and advances
   `catalog.snapshot.json`. The bundle hashes in `catalog.json` were produced by
   a local `bundles:sync`; the workflow re-verifies them.
3. **Model cards are research, not live catalog.** The per-model numbers in
   `references/models/` (durations, resolutions, reference-image limits) came
   from research and must be reconciled against the real bindings via
   `get_catalog` before anything is marked `live`. The Skills already treat the
   live catalog as authoritative at runtime; this is about the planning cards.

## 5. Suggested next product types

Candidates and the bar they must clear are in `docs/product-types.md` (Candidate
Later Types). None is justified yet; each needs a distinct workflow, high
completion probability, and recurring cross-brief demand before it earns a Skill.

