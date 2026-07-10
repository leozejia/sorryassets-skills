# SorryAssets Skills

Standard Agent Skills for building AIGC assets with SorryAssets.

Each Skill is a normal Agent Skills package: `SKILL.md` plus optional
`references/`, `prompts/`, `scripts/`, and `assets/`. The packages are designed
for Codex, Claude Code, Cursor, and other hosts that support the open Agent
Skills format.

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
  scores variants and selects the strongest reference.
- `short-drama` — produce a 30-second episode plan and local assembly path:
  script, cast, two shots, planning stills, two prompt-only 15s clips, and one
  FFmpeg-assembled MP4. Intermediate choices are autonomous.

## SorryAssets Workflow Attachments

Some Skills include `references/sorryassets.workflow.json`. This is not a new
Skill standard. It is an optional SorryAssets desktop attachment that can be
snapshotted into a local canvas graph.

Agents should still read `SKILL.md` first and call SorryAssets through MCP/API.

## Validate

```bash
npm test
```

This checks that every Skill has a valid `SKILL.md`, that any referenced
SorryAssets workflow attachment exists, and that the short-drama assembly helper
can concatenate two synthetic FFmpeg clips (requires `ffmpeg` and `ffprobe` on
PATH).
