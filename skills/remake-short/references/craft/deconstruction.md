# Deconstruction: From "I Love This" to a Remakable Recipe

The creator can feel that a video works but usually cannot say why. Your job in
the deconstruction stage is to say it for them — precisely enough that the
remake can be executed and judged. The output is a **recipe card** with six
layers. Fill every layer before generating anything.

## Input Situations

| You have | How to deconstruct |
|---|---|
| The video file | Run `scripts/extract-frames.mjs` to sample stills you can view; `ffprobe` facts (duration, dimensions) come with the manifest. Import the file for lineage. |
| Screenshots / GIF | Import and view directly. Ask for the duration and pacing if not evident. |
| A link only | Do not assume it is fetchable. Ask for stills, a screen recording, or a description. |
| A verbal description | Reconstruct the formula from the description plus your own cultural knowledge; confirm the timeline with the creator before generating. |
| A named classic scene ("the palace-drama slap scene") | You likely know the scene. State the key beats back to the creator and confirm — your knowledge is the deconstruction source. |

The richer the input, the more exact the remake can be. With description-only
input, default to the **format adaptation** fidelity level, not shot-for-shot.

## The Recipe Card (six layers)

### 1. One-line intent (一句话意图)
One sentence: what the video makes the viewer feel and by what core move.
Not a synopsis — the *effect*. If you cannot write this line, you do not yet
understand the video; keep asking or looking.

### 2. Emotional mechanism (情绪机制)
Name the mechanism(s) that produce the effect. Common ones:

| Mechanism | What it is | Typical signature |
|---|---|---|
| 反差 Incongruity | Two registers that do not belong together | Grand text × tiny subject; solemn tone × absurd content |
| 认同 Recognition | The viewer already knows the referenced thing | Classic scene, famous line, trending template |
| 投射 Projection | The viewer sees their own life in it | "My pet also does this"; relatable situations |
| 悬念 Suspense gap | Show the result, withhold the cause | Cold open, delayed reveal |
| 治愈 Warmth | Softness, safety, gentleness | Slow pace, warm light, small gestures |
| 怀旧 Nostalgia | A period look or sound | Era palette, old song, film grain |
| 爽感 Payoff | Tension then decisive release | Buildup beats, sharp cut on the drop |

Most viral shorts stack 2–3 mechanisms. **The mechanism is the thing the remake
must preserve** — everything else is negotiable.

### 3. Structure timeline (结构时间轴)
Reconstruct the video as a timed shot list: for each segment, its time range,
what is on screen, camera behavior, the on-screen text (verbatim if possible),
and what the music is doing. Mark where the punchline or emotional peak lands.
Short formats are usually 1–5 shots; do not pad the reconstruction with detail
the original does not have.

### 4. Invariants vs replaceable slots (常量与变量)
Split every element into two lists:
- **Invariants** — remove one and the video stops working: the recognizable
  reference, the text's tone and wording, the timing of the punchline, the
  music's identity or role, the deadpan seriousness.
- **Slots** — swappable without breaking the mechanism: the subject (their cat
  instead of the original's), the specific scene chosen from the referenced
  work, props adapted to the new subject.

When unsure which list an element belongs to, imagine the remake without it:
if the one-line intent still holds, it is a slot.

### 5. Material mapping (素材映射)
For each slot, name what fills it:
- Creator material → `import_file`, then used as `reference` inputs. Record
  **subject fidelity anchors** exactly as commercial work records product
  anchors: coat pattern, eye color, distinctive markings, face, packaging.
  Restate them in every prompt; verify them in every take.
- Missing material → generate with `references/stages/character-assets.md` or
  `references/stages/scene-assets.md`.
- Note which generated keyframe feeds which video shot (`first_frame`).

### 6. Feasibility check (可行性核对)
Map the plan onto what the tool is actually good at before spending:
- Confirm required input roles against the live catalog (`get_catalog`) and
  the cards in `references/models/`.
- Check the plan against `references/craft/defects.md`: single subject, mostly
  static shots, no lip-sync requirement, all text in post — high success.
  Multi-person interaction, fast physics, legible generated text — redesign.
- Shot count and durations come from the original; the minimum faithful remake
  is often one keyframe plus 5 seconds of subtle motion.

## Fidelity Levels

Confirm with the creator when ambiguous — this decision changes scope and cost:

| Level | Keeps | Changes | Typical ask |
|---|---|---|---|
| 逐帧复刻 Shot-for-shot | Structure, timing, framing, text, music | Only the subject | "This exact video, but my cat" |
| 格式复用 Format adaptation | The formula (mechanisms + structure type) | Scene, content, subject | "This kind of video, for my dog" |
| 意图移植 Effect transfer | Only the mechanisms | Everything else | "Something that hits like this" — consider producing a brief for `narrative-short` instead |

## Worked Example — "my cat re-enacts a classic palace-drama scene" (15 s)

```
一句话意图: 让自家猫咪一本正经出演人尽皆知的名场面 —— 最小的演员演最大的戏。

情绪机制: 反差(宏大台词 × 毛茸茸主体) + 认同(观众都认识这场戏)
         + 投射("我家主子也是戏精")。复刻丢了任何一个就失败。

结构时间轴:
  S1 0–3s   定场:猫咪正襟危坐,字幕引出剧名/台词引子,原剧 BGM 起
  S2 3–10s  展开:1–2 个静态或微动镜头,猫咪"表演"关键动作,
            台词字幕逐句压节奏
  S3 10–15s punchline:名台词落点 + 猫咪一个恰到好处的表情/动作,BGM 高潮

常量: 场景可识别性、台词原文、BGM、字幕的正剧腔调、节奏卡点
变量: 演员(创作者的猫)、道具的猫化改造(龙袍 → 小披风)

素材映射: 猫咪照片 → import_file → 作 reference 生成"穿戏服的猫"关键帧
         (保真锚点:花色、斑纹、眼色)→ 关键帧作 first_frame →
         视频模型微动 5s × 2–3 段
可行性: 单主体 / 静态为主 / 无口型 / 文字全部后期 → 命中模型甜区。
        风险集中在猫咪保真 → 锚点纪律 + 每 take 核对。
```

## Deliverable Definition

The finished remake is delivered as:
1. The silent visual film (assembled clips, or a single clip).
2. A text node containing the **timed overlay script**: each on-screen text
   with its wording, in/out timestamps, position, and tone.
3. A **music direction** in the same node: the original's iconic track and its
   entry cue, or a concrete mood spec ("solemn strings, swells at 10 s").

The creator applies text and music in their editor. Never ask a generation
model to render legible text (see `references/craft/defects.md`).
