# SorryAssets Skills

Standard Agent Skills for building AIGC assets with SorryAssets.

Each Skill is a normal Agent Skills package: `SKILL.md` plus optional
`references/`, `prompts/`, `scripts/`, and `assets/`. The packages are designed
for Codex, Claude Code, Cursor, and other hosts that support the open Agent
Skills format.

## Install

Install one Skill into Codex and Claude Code:

```bash
npx skills add leozejia/sorryassets-skills --skill character-creation -a codex -a claude-code -g -y
```

Install all Skills:

```bash
npx skills add leozejia/sorryassets-skills --skill '*' -a codex -a claude-code -g -y
```

## Skills

- `character-creation` — create reusable character reference images.
- `short-drama` — expand an idea into script, cast, storyboard, shot images,
  and 15-second video clips.

## SorryAssets Workflow Attachments

Some Skills include `references/sorryassets.workflow.json`. This is not a new
Skill standard. It is an optional SorryAssets desktop attachment that can be
snapshotted into a local canvas graph.

Agents should still read `SKILL.md` first and call SorryAssets through MCP/API.

## Validate

```bash
npm test
```

This checks that every Skill has a valid `SKILL.md` and that any referenced
SorryAssets workflow attachment exists.
