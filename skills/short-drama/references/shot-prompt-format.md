# Shot Prompt Format

Standard multi-shot prompt structure for AI video generation.
Derived from community practice (Seedance multi-shot format) and cross-validated
against official Veo and Sora prompt guides.

## Production Header (write once per project)

```
主体: [character name] + [reference node ID or image description]
场景: [core scene — location, time of day, color temperature, light quality]
音乐/音效: [emotional tone and sound design intent]
```

Example:
```
主体: 林悦 + node_char_001 (正面参考图, 棕色卷发, 白色风衣)
场景: 上海外滩夜景, 霓虹反光路面, 冷蓝色调, 路灯逆光
音乐/音效: 低沉钢琴, 城市环境音, 偶尔车声
```

---

## Per-Shot Block

```
Shot [NN] | [shot title]
[scale] [angle] [camera move], [subject action — start state → end state],
[lighting anchor], [spatial anchor if scene has multiple characters]
参考: [node IDs and their roles]
时长: [s] | 分辨率: [720p/1080p] | 比例: [16:9/9:16/1:1]
通过标准: [observable pass/fail condition]
```

### Field definitions

**Shot NN**: zero-padded sequence number (01, 02 …). Use the same number when
regenerating a take; increment only for a new shot in the story.

**Shot title**: 2–5 Chinese characters naming the dramatic beat, e.g. "初遇",
"转折", "离别". Used for human navigation, not sent to the model.

**Scale**: one term from the scale table in `references/cinematography.md`
(远景 / 全景 / 中景 / 近景 / 特写).

**Angle**: one term from the angle table (平视 / 仰拍 / 俯拍 / 荷兰角 / 鸟瞰).
Omit if eye-level (default).

**Camera move**: one term from the movement table (推 / 拉 / 摇 / 移 / 跟 /
升 / 降 / 手持 / 稳定器 / 固定). Omit if locked-off.

**Subject action**: write as "start state → end state" with one legible
continuous action in between. Keep the action achievable within the shot
duration. Do not describe two separate actions in one shot.

**Lighting anchor**: color temperature + light quality + direction, e.g.
"暖色 3200K 柔光从左侧入". Must be consistent with the production header and
adjacent shots.

**Spatial anchor**: required whenever two or more characters share the frame.
Repeat verbatim in every shot of the same scene:
"[A] 在画面左侧面向右, [B] 在画面右侧面向左"

**参考 (references)**: list each node ID and its role. Roles must match a
`reference` input declared by the live catalog binding. Example:
"node_char_001 (角色外观), node_scene_002 (场景基准)"

**通过标准 (pass criteria)**: one observable sentence. Bad: "画面好看".
Good: "林悦棕色卷发清晰可辨, 光线从左侧入画, 无闪烁, 动作在5秒内完成".

---

## Complete Example — 30-second product video (3 shots)

```
主体: 产品 ZenCup + node_prod_001 (正面白底参考图)
场景: 清晨厨房, 窗边逆光, 暖色 2800K 晨光, 柔光漫射
音乐/音效: 轻柔钢琴, 鸟鸣, 咖啡机低鸣

Shot 01 | 晨光开场
远景 低角度仰拍 缓慢升镜, 产品置于窗台逆光剪影,
静止 → 晨光从左侧扫入照亮产品轮廓,
暖色 2800K 柔光逆光
参考: node_prod_001 (产品轮廓参考), node_scene_001 (厨房场景基准)
时长: 4s | 分辨率: 1080p | 比例: 16:9
通过标准: 产品轮廓清晰, 光线从左侧入画, 无闪烁

Shot 02 | 细节特写
特写 平视 缓慢推镜, 产品表面纹理和品牌标志,
静止 → 轻微蒸汽从杯口升起,
暖色 3000K 侧光, 浅景深背景虚化
参考: node_prod_001 (产品细节参考)
时长: 4s | 分辨率: 1080p | 比例: 16:9
通过标准: 品牌标志区域虚焦或不可读 (避免文字乱码), 蒸汽运动自然, 无物理失真

Shot 03 | 收尾拉远
全景 平视 缓慢拉镜, 产品在窗边晨光中,
特写状态 → 拉远至全景露出厨房环境,
暖色 2800K 晨光, 整体明亮高调
参考: node_prod_001 (产品参考), node_scene_001 (场景基准)
时长: 4s | 分辨率: 1080p | 比例: 16:9
通过标准: 产品在画面中心, 厨房环境自然, 与 Shot 01 光线方向一致
```

---

## Model-specific syntax notes

Each model has its own input role names, reference image limits, and parameter
constraints. Before writing shot blocks, check the relevant model card in
`references/models/`. Key differences that affect prompt writing:

- **Seedance 1.5 Pro**: supports `first_frame` and `last_frame` in addition to
  `reference`. Use first/last frame for state-transition shots. Max 4 reference
  images. See `references/models/seedance-1.5-pro.md`.

- **Veo 3.1**: uses a field-labeled format (`Camera shot: / Depth of field: /
  Lighting: / Dialogue:`). Max 3 reference images (Ingredients). Supports
  native audio generation. See `references/models/veo-3.1.md`.

When a shot requires dialogue, add a `Dialogue:` block after the main
description (Veo/Sora style) or an `台词:` line (Seedance community style):

```
台词 (林悦, 低声): "我知道了。"
```

Keep dialogue short, natural, and matched to the shot duration.
