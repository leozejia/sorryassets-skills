# Seedance 1.5 Pro — Model Card

Updated: 2026-07. Verify against live catalog before use.

## Parameters

| Parameter | Values | Default |
|---|---|---|
| Duration | 5 s, 10 s | 5 s |
| Resolution | 720p, 1080p | 720p |
| Aspect ratio | 16:9, 9:16, 1:1 | 16:9 |

## Input Roles

| Role | Type | Count | Notes |
|---|---|---|---|
| `prompt` | text | 0–1 | Main generation prompt |
| `first_frame` | image | 0–1 | Locks the opening frame |
| `last_frame` | image | 0–1 | Locks the closing frame |
| `reference` | image | 0–4 | Character / scene / prop consistency |

Always verify current role names and limits with `get_catalog` before
constructing a request. Catalog is authoritative; this card is a planning aid.

## Negative Prompts

Not officially documented. Do not use negative phrasing; describe what you
want rather than what to avoid.

## First / Last Frame Usage

- Provide `first_frame` to lock the opening state of a shot.
- Provide `last_frame` to lock the closing state.
- Both frames together constrain the full arc of the shot; the model
  interpolates the motion between them.
- Keep the two frames visually similar in composition and lighting. A large
  difference (e.g. day vs night, wide vs tight) is interpreted as a cut, not
  a continuous motion, and produces an abrupt transition.
- **Shot chaining**: use the last frame of shot N as the `first_frame` of
  shot N+1 to produce seamless continuity across separately generated clips.
  This is the primary technique for exceeding the 5 s / 10 s per-generation
  limit.

## Reference Image Best Practices

- Use a front-facing, evenly lit, unoccluded image as the primary character
  reference. Side-angle or backlit references reduce anchor fidelity.
- When supplying multiple references, state each image's role explicitly in
  the prompt: "图1用于角色外观，图2用于场景背景，图3用于道具细节".
- Do not exceed 4 reference images. More references can dilute model
  attention; 2–3 well-chosen images typically outperform 4 mediocre ones.

## Prompt Structure

Follow the multi-shot format in `references/craft/shot-prompt-format.md`.
Seedance community practice uses a production header followed by numbered
shot blocks:

```
主体: [角色] + [参考图说明]
场景: [地点, 时段, 光线, 色调]
音乐/音效: [情绪基调]

Shot 01 | [标题]
[景别] [角度] [运镜], [动作描述, 开始状态→结束状态],
[光线锚点], [空间锚点(多角色时)]
台词 ([角色], [语气]): "[台词]"
参考: [节点 ID 及各自角色]
时长: [s] | 分辨率: [720p/1080p] | 比例: [16:9/9:16]
通过标准: [可观察的判断条件]
```

## Known Limitations

- Identity drift across shots when reference images are omitted or low quality.
- Hand and finger anatomy distortion (see `references/craft/defects.md`).
- Text / logo corruption — avoid requiring legible on-screen text.
- Axis jumps when spatial anchors are not repeated per shot.
