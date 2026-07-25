# Product-Repo Versioning Adoption (Design)

Status: design only. This document describes how the `sorryassets` product repo
should adopt per-Skill semantic versioning as the human-facing version
identifier. It authorizes no product-repo change and is deferred past the
current desktop `0.1.18` release batch, which explicitly excludes Skill changes.

## Problem

The `sorryassets-skills` catalog now carries a per-Skill semantic `version`
(`MAJOR.MINOR.PATCH`). The product surfaces still identify Skill releases by the
catalog's repository-level `sourceCommit` (a git hash). Two concrete defects
follow from using a repo-level hash:

1. **Cross-Skill false updates.** The desktop computes "update available" as
   `catalog.sourceCommit !== record.sourceCommit`
   (`apps/desktop/src/skills/skillHubState.ts`). Because `sourceCommit` is
   repo-level, editing one Skill flips *every* installed Skill to
   "update available," even Skills whose bytes did not change.

2. **Git hash is not a human-facing version.** A creator cannot tell whether
   `db41efc…` is newer than `4967bb9…`, nor what changed. A semver
   (`1.2.0` vs `1.1.0`) communicates ordering and change magnitude.

## Target State

- Per-Skill `version` (semver) is the identifier shown to users on the website
  and in the desktop Skill Hub.
- "Update available" is decided **per Skill** by comparing the installed Skill's
  `version` to the catalog Skill's `version`, not by a repo-level hash.
- Package integrity remains proven by the content-addressed `digest` and bundle
  `sha256`. Version names the release; the digest proves the bytes. The two stay
  decoupled (adding `version` does not alter the digest).
- `sourceCommit` may remain as provenance (which source revision produced a
  snapshot) but stops being the user-facing version and stops being the update
  trigger.

## Affected Product-Repo Surfaces

Each of these is in the `sorryassets` repo and out of scope for this repo's
changes. Listed so the future coordinated change is scoped, not executed here.

### 1. Desktop Rust — `apps/desktop/src-tauri/src/skill_library.rs`
- `CatalogSkill` gains a `version: String` field. Serde currently ignores
  unknown fields (no `deny_unknown_fields`), so a catalog with `version`
  deserializes safely today — a pre-adoption desktop simply drops it.
- `InstalledSkill` records the installed Skill's `version` at install time (it
  already embeds the full `CatalogSkill`, so this is available once the field
  exists).
- Update detection moves from repo-level `source_commit` comparison to a
  per-Skill `version` comparison.

### 2. Desktop TS — `apps/desktop/src/skills/skillHubState.ts`
- Replace `updateAvailable: catalog.sourceCommit !== record.sourceCommit` with a
  per-Skill semver comparison: an update exists when the catalog Skill's
  `version` is greater than the installed record's `version`.
- Surface `version` in the Skill Hub UI as the version label.

### 3. Web — `apps/web/src/lib/skillIndex.ts`
- The Skill index type gains `version: string`. Display it on Skill pages.
  (`version: number` at line 58 there is the catalog schema version, a different
  field — do not conflate.)

### 4. Backend Go — `apps/backend/internal/catalog/store.go`
- If the backend projects or re-serves the Skill catalog, carry `version`
  through the DTO. No routing or billing impact; this is display metadata.

## Compatibility and Sequencing

- **Additive first.** `version` is already present in the catalog and is safely
  ignored by the current product build. Publishing it now breaks nothing.
- **Then adopt.** After `0.1.18`, a single coordinated product-repo change adds
  the field to the Rust/TS/web/Go types and switches update detection to
  per-Skill semver. This ships as a higher desktop version through the normal
  release path.
- **Semver comparison.** Use a minimal `MAJOR.MINOR.PATCH` numeric compare
  (split on `.`, compare integers). No pre-release or build-metadata semantics
  are needed for Skills; `validate.mjs` already restricts versions to three
  numeric components.
- **`sourceCommit` retention.** Keep it as provenance during the transition so
  installed records written by an older desktop remain interpretable. Removing
  it entirely is a later, separate cleanup.

## Non-Goals

- No change to the content-addressed publication lane or bundle integrity.
- No change to how installation verifies bytes.
- No pre-release/channel semantics (alpha/beta) for Skills in v1.
- No coupling of Skill version to the desktop application version.
