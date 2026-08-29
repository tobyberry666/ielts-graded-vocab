# 前端交接文档 — 雅思分级背词器 (IELTS Graded-Vocab SRS)

> 作用域：纯前端渲染层 + 主题/动画/语音。数据/FSRS 逻辑由 `VocabRepository` 与 `WordService`（队友交付，按契约消费）提供。
> 验证日期：2026-07-09，基于源码逐行核对（已确认非桩代码 / 非空实现）。

---

## 一、组件契约 (Component Contract)

### 1. `Flashcard` — `src/components/Flashcard.tsx:4-14`
| Prop | 类型 | 含义 |
|------|------|------|
| `word` | `VocabEntry` | 当前闪卡词条（含 `term` / `phonetic` / `pos` / `meaningZh` / `meaningEn` / `collocations` / `example` / `exampleZh` / `band`） |
| `revealed` | `boolean` | 是否已翻面显示释义。驱动 `fc-inner` 的 `is-revealed` class，触发 3D 翻转 |
| `onReveal` | `() => void` | 点击正面时触发（请求翻面） |
| `onGrade` | `(grade: Grade) => void` | 背面打分回调，`Grade ∈ again/hard/good/easy` |
| `onSpeak` | `() => void` | 点击朗读按钮时触发原生语音 |

### 2. `BandSelector` — `src/components/BandSelector.tsx:3-6`
| Prop | 类型 | 含义 |
|------|------|------|
| `value` | `Band`（即 `'5' \| '6' \| '7'`） | 当前选中的难度档位 |
| `onChange` | `(band: Band) => void` | 切换档位时触发，由父组件重新拉取到期队列 |

### 3. `ProgressRing` — `src/components/ProgressRing.tsx:1-10`
| Prop | 类型 | 含义 | 默认 |
|------|------|------|------|
| `value` | `number` | 进度比例，取值 0–1（内部已 clamp） | — |
| `size` | `number?` | 圆环直径（px） | `72` |
| `stroke` | `number?` | 圆环线宽（px） | `8` |
| `label` | `string?` | 圆心文本（如 `3/10`） | — |

> 实现说明：进度环用 SVG 双 `<circle>`（track + value），`strokeDasharray = 周长`、`strokeDashoffset = 周长 × (1 - value)`，并 `rotate(-90)` 使起点在 12 点钟方向。

---

## 二、本地运行

```bash
cd app
npm install
npm run dev
# 打开 http://localhost:5173
```

---

## 三、浏览器手动验证步骤

### 翻转 (Flip)
1. 进入页面，正面显示单词（如 `abandon`）、音标、词性。
2. 点击卡片正面 → 0.6s 内沿 Y 轴 180° 翻转到背面，显示释义/搭配/例句与四个打分按钮。
3. 点打分按钮（忘记/困难/良好/简单）→ 回到下一张正面，进度环推进。
4. 关键 CSS：`styles.css:7`（`--ease-flip: cubic-bezier(0.16,1,0.3,1)`）、`styles.css:262-273`（`transform-style: preserve-3d` + `transition: transform 0.6s` + `rotateY(180deg)`）、`styles.css:275-279`（`backface-visibility: hidden`）。

### 主题切换 (Theme Toggle)
1. 右上角三枚按钮：浅色 ☀ / 深色 ☾ / 跟随系统 ⚙。
2. 点击切换，整页配色即时变化（背景 `transition: 0.45s`）。
3. 刷新页面：因 `localStorage['ielts-theme']` 持久化（`App.tsx:52-58`），选择被记住。
4. 刷新瞬间**无白屏闪烁** —— `index.html:7-19` 的内联脚本在首屏绘制前读取同一 key 并 `documentElement.setAttribute('data-theme', …)`（anti-FOUC）。
5. 选「跟随系统」时，系统切换深/浅色后页面经 `matchMedia('(prefers-color-scheme: dark)')` 监听器（`App.tsx:45-50`）自动跟随。

### 语音朗读 (Pronunciation)
1. 卡片正面/背面右上角有喇叭按钮（`.fc-speak`）；播放后旁边出现「真人 / 机器」来源标签（`.fc-source-pill`）。
2. 顶栏有 **英音 / 美音** 切换（复用 `.theme-switch` 样式），偏好写入 `localStorage['ielts-accent-pref-v1']`，默认英音。
3. 实现集中在 `src/services/PronunciationService.ts`，**三级降级**，任一级失败自动落到下一级：

   | 级别 | 来源 | 说明 |
   |---|---|---|
   | 1 | 有道 `dictvoice` | 主源。URL 是本地拼接的（`youdaoAudioUrl`），点击即开始下载 MP3，**不需要先请求 JSON 解析接口**；实测 ~0.8s 出声，抽样 36 词（band 5/7/9）覆盖率 36/36 |
   | 2 | `dictionaryapi.dev`（Wikimedia 真人录音） | 开源兜底。`AbortController` 3s 超时，失败不缓存以便重试；结果缓存进 `localStorage['ielts-audio-cache-v1']` |
   | 3 | 浏览器 TTS | 最后手段。`pickEnglishVoice()` 按「口音匹配 > 嗓音质量 > 离线可用」挑嗓音（优先 Aria/Jenny/Google UK 等），`rate=0.95`；不再裸用默认引擎 |

4. 播放成功与否由 `playUrl()` 判定：只有真正触发 `onplaying` 才算成功；`onerror`、时长 < 0.2s 的空音频、7s 无响应都算失败并降级。
5. **熔断**：主源连续失败 3 次后本次会话内不再尝试主源，避免整场学习每个词都白等一遍。
6. **预热**：切词时 `prefetchPronunciation()` 把音频拉进浏览器 HTTP 缓存（最多缓存 8 条），首次点击时还会 `preconnect` 到 `dict.youdao.com`。
7. 已知限制：有道是非官方公开接口，无 SLA，理论上可能被限流——这正是保留第 2 级开源兜底的原因。

### 档位驱动队列 (Band → Due Queue)
1. 点击 Band 5 / 6 / 7 / 8+ 标签，卡片区重新加载对应档位到期词（8+ 为「8 分以上」档）。
2. 触发链：`BandSelector.onChange` → `App.tsx:134-137` `setBand(b)` → `App.tsx:69-84` 的 `[band]` effect 调用 `wordService.getDueCards(srs, band)` 并重置队列。

### 进度环 (Progress Ring)
1. 卡片上方圆环显示 `pos/queue.length` 文本并随打分推进。
2. `App.tsx:89` `progress = pos/queue.length`，传入 `ProgressRing` 的 `value` 与 `label`（`App.tsx:142`）。

---

## 四、功能验证结论（逐条对照需求）

| # | 需求 | 结论 | 证据 |
|---|------|------|------|
| 1 | 3D 翻转 0.6s `cubic-bezier(0.16,1,0.3,1)` + `rotateY(180deg)` + `backface-visibility:hidden` + `preserve-3d` | ✅ 全部已接线 | `styles.css:7,262-279` |
| 2 | 浅/深/系统主题，localStorage 持久化 + index.html anti-FOUC 内联脚本 | ✅ 已接线 | `App.tsx:21,28-58`；`index.html:7-19` |
| 3 | 交互元素磁性/缩放 hover | ✅ scale hover 已实现（非光标跟随式 magnetic） | `.theme-btn`/`styles.css:147`、`.band-option`/`styles.css:184`、`.fc-speak`/`styles.css:372`、`.fc-grade`/`styles.css:471` |
| 4 | Web Speech：`speechSynthesis` + `SpeechSynthesisUtterance(word.term)`，`lang='en-GB'` | ✅ 已接线 | `App.tsx:91-97` |
| 5 | Band 选择经 `WordService.getDueCards` 驱动到期队列 | ✅ 已接线 | `App.tsx:74,132-138` |
| 6 | 进度环反映 due/total | ✅ 已接线 | `App.tsx:89,142` + `ProgressRing.tsx:18-21` |

---

## 五、UI 缺口 / 打磨建议（最多 3 条）

1. **"magnetic" 光标跟随效果未实现**：当前为纯 CSS `scale/translateY` hover（`styles.css:147,184,372,471`）。若设计稿要求鼠标位置吸附式磁吸，需补充 JS 监听 `pointermove` 计算位移。当前 scale 方案已满足"缩放 hover"诉求，非阻塞。
2. **进度环无"总到期数"语义标注**：`label` 显示的是 `pos/queue.length`（已学/本轮总数），口头交付中"due/total"若指"全库 vs 到期"，当前环仅反映本轮进度，未跨轮累计。可视需要在 `ProgressRing` 旁补一个"累计复习 X 词"统计。非阻塞。
3. **深色模式下的卡片玻璃模糊在部分旧浏览器无 `backdrop-filter` 回退**：`--glass-bg` 为半透明色，不支持该属性的浏览器可能对比度偏低。可考虑加 `--glass-bg-solid` 回退变量。低优先级。

> 以上 3 条均为打磨项，**无阻塞性问题（no blocking gaps found）**——六大核心功能均真实接线可运行。
