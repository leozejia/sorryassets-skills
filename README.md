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
npx skills remove character-creation -a codex -a claude-code -g
```

Remove all installed SorryAssets Skills by selecting them interactively:

```bash
npx skills remove -g
```

## Skills

- `character-creation` — create reusable character reference images; the agent
  designs identity anchors (silhouette, signature color, prop motif), scores
  variants, and selects the strongest reference.
- `scene-development` — turn a location description into a spatial anchor image
  that locks layout, light direction, and palette for every shot in that scene.
- `short-drama` — turn varied short-form narrative briefs into scripts, casts,
  shot plans, generated media, and locally assembled videos. Format and model
  choices come from the brief and live catalog.
- `video-continuity` — establish spatial anchors, identity anchors, and
  first/last frame chain plans before generation to prevent axis jumps and
  identity drift across separately generated clips.

Each Skill carries its own `references/` knowledge layer: film-craft vocabulary,
AI defect classification with prevention and remediation, and per-model cards
covering input roles, reference-image limits, and negative-prompt policy.
Model cards are planning aids — the live catalog is always authoritative.

## Validate

```bash
npm test
```

This checks that every Skill has standard frontmatter, rejects private runtime
files and metadata, reproduces the declared bundle bytes, and verifies that the
short-drama assembly helper can concatenate a bounded synthetic clip sequence
(requires `ffmpeg` and `ffprobe` on PATH).

After package contents change, refresh the deterministic manifest and bundle
metadata before committing:

```bash
npm run bundles:sync
npm test
```

Publication automation runs `npm run bundles:build -- --output <empty-dir>` and
uploads only the content-addressed objects listed in the generated
`publish-manifest.json`. Do not upload a mutable Skill alias.
