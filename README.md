# SorryAssets Skills

Standard Agent Skills for building AIGC assets with SorryAssets.

Each Skill is a normal Agent Skills package: `SKILL.md` plus optional
`references/`, `prompts/`, `scripts/`, and `assets/`. The packages are designed
for Codex, Claude Code, Cursor, and other hosts that support the open Agent
Skills format.

This repository is publication source. The SorryAssets Skill Hub installs only
verified immutable bundles from `dl.sorryassets.com`; it never downloads package
files from GitHub. The `npx skills` commands below are the separate optional path
for installing directly into an Agent host.

## Building Skills

Before adding or restructuring a Skill, read the construction constitution:

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — how Skills are cut (by finished-product
  type), structured (thin `SKILL.md` + on-demand `references/`), and built.
- [`docs/product-types.md`](docs/product-types.md) — the product-type roadmap
  and why each type qualifies as distinct.
- [`docs/styles.md`](docs/styles.md) — the style-library contract (styles are
  data, not Skills).
- [`docs/versioning-adoption.md`](docs/versioning-adoption.md) — design for the
  product repo to present per-Skill semver instead of a git hash (deferred).

Each Skill carries a semantic `version` in `catalog.json`; `npm test` enforces
it. See the Versioning section of `ARCHITECTURE.md` for bump rules.

The Skills listed below are being restructured toward the product-type
architecture. Until that lands, they remain in their current stage form.

## Install

### Recommended: `npx skills`

List available Skills without installing:

```bash
npx skills add leozejia/sorryassets-skills --list
```

Install one Skill into Codex and Claude Code:

```bash
npx skills add leozejia/sorryassets-skills --skill character-creation -a codex -a claude-code -g -y
```

Install all Skills:

```bash
npx skills add leozejia/sorryassets-skills --skill '*' -a codex -a claude-code -g -y
```

Install one Skill for every supported local agent:

```bash
npx skills add leozejia/sorryassets-skills --skill character-creation --agent '*' -g -y
```

Project-local install instead of global install:

```bash
npx skills add leozejia/sorryassets-skills --skill character-creation -a codex -a claude-code -y
```

`npx skills` installs a canonical copy and links/copies it into supported agent
skill folders. It is the simplest cross-host path for Codex, Claude Code,
Cursor, OpenCode, and other Agent Skills-compatible tools.

### Codex

Use the recommended installer:

```bash
npx skills add leozejia/sorryassets-skills --skill character-creation -a codex -g -y
```

Codex reads Skills from Agent Skills locations such as `.agents/skills` and
`~/.agents/skills`.

### Claude Code

Use the recommended installer:

```bash
npx skills add leozejia/sorryassets-skills --skill character-creation -a claude-code -g -y
```

Claude Code reads Skills from locations such as `.claude/skills` and
`~/.claude/skills`.

### Claude Desktop

Claude Desktop supports Skill zip uploads through its UI:

1. Download this repository as a zip or package a single `skills/<name>/`
   directory as a zip.
2. Open Claude Desktop.
3. Go to Customize -> Skills.
4. Add or create a Skill and upload the zip.

Use this path only when you need Claude Desktop specifically. For coding
agents, `npx skills add` is easier to update.

## Update

Update installed global Skills:

```bash
npx skills update -g -y
```

Update a project-local install:

```bash
npx skills update -p -y
```

## Uninstall

Remove one Skill from Codex and Claude Code:

```bash
npx skills remove narrative-short -a codex -a claude-code -g
```

Remove all installed SorryAssets Skills by selecting them interactively:

```bash
npx skills remove -g
```

## Skills

Skills are cut by finished-product type (see [`ARCHITECTURE.md`](ARCHITECTURE.md)):

- `narrative-short` — turn a story brief into a coherent short film: story spine,
  character and scene assets, a shot plan with camera language, image-to-video
  generation, first/last-frame chaining, local assembly, and whole-film review.
  Covers requests like "a Pixar-style short about psychological healing."
- `commercial-short` — turn a product or brand brief into a persuasive short
  video: lock product fidelity, land one message, plan sell-point shots, generate
  image-to-video, and close with a call to action. Covers requests like "a
  commercial short for product X."
- `remake-short` (神还原) — deconstruct a video the creator loves into a recipe
  (intent, emotional mechanism, structure, invariants) and recreate it
  faithfully with their own material, delivering the silent film plus a timed
  text-overlay and music plan. Covers requests like "my cat re-enacting a
  classic drama scene."
- `adaptation-plan` (改编规划) — a planning skill (not media): turn a novel,
  script, or serial into a producible series plan with a justified episode
  count, a character map, and a ready-to-run `narrative-short` brief per
  episode. Covers requests like "turn my web novel into a short-drama series."

Each Skill is a self-contained thick package: a thin `SKILL.md` skeleton plus an
on-demand `references/` knowledge layer covering film craft (`craft/`), common
production stages (`stages/`), a visual style library (`styles/`), and per-model
capability cards (`models/`). A requested visual style is applied by loading a
style entry; model cards are planning aids — the live catalog is always
authoritative. Duration, format, style, and model come from the brief and the
catalog, not from the Skill.

## Shared references

Canonical shared references live in [`_shared/`](_shared) (not a Skill package)
and are copied into each Skill's `references/` so every Skill stays
self-contained and independently installable. Each Skill's
`references/.sync.json` declares which shared files it consumes.

Edit shared material in `_shared/`, then re-sync:

```bash
npm run references:sync     # copy _shared/ into each Skill package
npm run references:check    # fail if any copy has drifted (part of npm test)
```

## Validate

```bash
npm test
```

This verifies shared references are in sync, checks that every Skill has
standard frontmatter, rejects private runtime files and metadata, reproduces the
declared bundle bytes, and runs each Skill's assembly-helper self-test (requires
`ffmpeg` and `ffprobe` on PATH).

After package contents change, refresh the deterministic manifest and bundle
metadata before committing:

```bash
npm run references:sync
npm run bundles:sync
npm test
```

Publication automation runs `npm run bundles:build -- --output <empty-dir>` and
uploads only the content-addressed objects listed in the generated
`publish-manifest.json`. Do not upload a mutable Skill alias.
