# S1 No-Spend MCP Plan

This checks agent planning against a live catalog. It does not prove generation
or validate the optional workflow attachment. Do not call `generate_on_node`.

## 1. Discover

```text
create_project { "name": "S1 No-Spend Short Drama 30s" }
get_catalog
```

Record one exact `image.generate` binding and one exact `video.generate`
binding that declares `duration=15`, `resolution=720p`, and `aspect=9:16`. If a
required binding is absent, stop and report unavailable model support.

## 2. Create the text scaffold

```text
create_node { project_id, node_type: "text", title: "brief", content: "<premise + 30s/720p/9:16 constraints>" }
create_node { project_id, node_type: "text", title: "script", content: "<setup and payoff>" }
create_node { project_id, node_type: "text", title: "cast", content: "<one or two characters>" }
create_node { project_id, node_type: "text", title: "two-shot plan", content: "<two ordered 15s shots>" }
create_node { project_id, node_type: "text", title: "shot-1-prompt", content: "<self-contained prompt>" }
create_node { project_id, node_type: "text", title: "shot-2-prompt", content: "<self-contained prompt>" }
list_project_graph { project_id }
```

## 3. Record exact calls without submitting

Replace every placeholder with values from `get_catalog` and node ids from the
graph.

```json
{
  "project_id": "<open project>",
  "capability": "image.generate",
  "provider": "<catalog provider>",
  "model": "<catalog model>",
  "inputs": [{ "node_id": "<character or still prompt>", "role": "prompt" }],
  "values": {}
}
```

```json
{
  "project_id": "<open project>",
  "capability": "video.generate",
  "provider": "<catalog provider>",
  "model": "<catalog model>",
  "inputs": [{ "node_id": "<shot prompt>", "role": "prompt" }],
  "values": { "duration": 15, "resolution": "720p", "aspect": "9:16" }
}
```

Use the video shape once per shot in E1. Never attach media roles.

## 4. Record the local finish

Write the future `assemble-episode.mjs` command with two clip paths and node
ids, followed by an assembly-manifest text node, `import_file` for the final
MP4, and `list_project_graph` confirmation.

S1 passes when the graph, catalog-derived calls, autonomous selection rules,
and local assembly/import plan agree with `SKILL.md` without generation spend.
