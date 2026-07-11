# CLAUDE.md — 雅思分级背词器

给 AI 协作者与团队成员的架构与质量门禁说明。改代码前先读这里。

## 项目定位

类 Anki 的雅思分级背单词 Web 应用。核心价值：按 Band 分级推送词表 +
现代 FSRS 间隔重复 + 柯林斯式闪卡。

## 分层架构（硬性边界）

```
UI (App.tsx + components/*, 含 Calendar)  →  Service (SrsService / WordService / ImportService / SessionService / sanitize)
   →  Repository (VocabRepository, Dexie/IndexedDB，含 studyLog 表)  →  Data (words.ts)  +  工具 (utils/date.ts)
```

> M3 导入管线（`ImportService`）已落地并接入 `VocabRepository.bulkPutWords`；
> 导入/浏览的 UI 也已实现（见下方「M3 交付模块（实测现状）」）。
>
> M4 会话调度已落地：`SessionService`（纯逻辑、不可变、可单测）编排「分批循环复习」，
> `App.tsx` 改为会话模型（`session` / `sessionSize`，默认 10，可选 10/30/50/100），
> 新增 `Calendar` 组件 + `utils/date.ts`（零依赖），Repository 新增 `studyLog` 表与
> `recordStudyDay` / `getStudiedDays`（见下方「M4 交付模块（实测现状）」）。
>
> M5 词表扩容 + 调度增强已落地：词表扩展到 **210 词**（Band5:51 / Band6:51 / Band7:72 / Band8:36），
> `VocabRepository.seedIfEmpty` 改为 **MERGE**（只补「库中缺失 id」的种子词，绝不覆盖、绝不删除已有词）；
> `WordService` 新增 `getStudySet`（支持 `'due'`/`'all'` 两种取词模式）；
> `App.tsx` 新增「仅到期 / 全部本档」复习模式切换与空档重学引导（见下方「M5 交付模块（实测现状）」）。

- **UI 层**：只渲染与交互；禁止写调度/排期逻辑、禁止直接读 storage。
- **Service 层**：封装 `ts-fsrs`，纯函数式、必须单测；不 import React、不碰 DOM、不碰存储。
- **Repository 层**：隔离持久化细节，当前为 Dexie/IndexedDB（**M2 已落地，是现行方案**）。Service 不得在此出现。
- **Data 层**：词表与类型定义（`words.ts`，**210 个种子词（M5 扩容），bands `'5' | '6' | '7' | '8'`：Band5 51 / Band6 51 / Band7 72 / Band8 36**）。

## M3 交付模块（实测现状，2026-07-09）

### 导入管线（施调度，已落地）
- `src/services/ImportService.ts`（纯 Service 层，零 UI / 零存储依赖）公共 API：
  - `parseCsv(text): ImportRow[]` —— papaparse `header:true`（9 列）解析。
  - `parseAnki(text): ImportRow[]` —— TSV，支持 **9 列全量映射** 与 **2 列** `term\tmeaningZh`（band 默认 `'5'`）；列数异常时不崩溃，产出一条会被 `importWords` 拒绝的非法行。
  - `importWords(rows): ImportReport` —— 纯校验器（不抛异常、不落库）：必填 `term`/`meaningZh` → `isValidBand` 白名单 → 非空字段逐个 `containsInjection` 扫描；与 `safeParseWord` **共用同一套 sanitize 规则**，绝不弱化。重复 `term`（trim 后）由 `bulkPut` **末值覆盖（last-wins）**。
  - `importAndStore(rows, repo): Promise<ImportReport>` —— 唯一落库入口，调用 `repo.bulkPutWords`。
  - 导出类型：`ImportRow` / `RejectedRow` / `ImportReport`。
- `src/repository/VocabRepository.ts` 新增 `putWord(word)` 与 `bulkPutWords(words)`（空数组为 no-op）。
- `src/services/sanitize.ts` 已导出 `containsInjection` / `isValidBand`，供导入复用（与 `safeParseWord` 同源同规则）。
- 单测 `src/services/ImportService.test.ts`（8 tests）。

### UI（潘渲染，已落地 —— 均为实测现状）
- `src/components/ImportPanel.tsx` **已实现**，默认导出 `ImportPanel`，props 为 `{ repo: VocabRepositoryPort; onClose: () => void }`；通过 `pickParser` 自动选择 CSV/Anki 解析器，调用 `importAndStore(rows, repo)` 落库并展示接受/拒绝明细。
- `App.tsx` 内含「导入词表」弹窗：`<AnimatePresence>` + `motion.div` 模态（`role="dialog"`、`aria-modal`，背景点击 / Esc 关闭），内部渲染 `<ImportPanel repo={repo} onClose={...} />`。
- react-window **v2** 虚拟滚动「词库」浏览器已实现：`App.tsx` 用 `List`（`rowComponent={WordRow}`、`rowProps={{ words }}`、`rowHeight={BANK_ITEM_SIZE}`(=88)、`overscanCount`，常量 `BANK_ITEM_SIZE`/`BANK_HEIGHT`(=460)），`WordRow` 形参为 v2 的 `RowComponentProps<{ words }>`。
- `src/components/Flashcard.tsx` 翻转由 **framer-motion 驱动**：`motion.div` + `animate={{ rotateY: revealed ? 180 : 0 }}`、`style={{ transformStyle: 'preserve-3d' }}`，并用 `useReducedMotion` 为减少动效用户关掉过渡（duration 0），**非纯 CSS**。
- 已落地：`App.tsx` 含 Web Speech 原生语音朗读（`window.speechSynthesis`，`en-GB`）。
- 依赖均实际使用：`papaparse`、`framer-motion`、`react-window` 三者在源码中均已 import（无已声明未使用依赖）。

## M4 交付模块（实测现状，2026-07-09）

### 会话调度（施调度，已落地）
- `src/services/SessionService.ts`（纯 Service 层，零 UI / 零存储 / 零依赖）公共 API：
  - `createSession(cards, size)` —— 洗牌切片成首批（size 张）+ 剩余 pool；size 被 clamp 到 >=1；空卡时返回 `completed:false` 空会话。
  - `currentCard(s)` —— 返回 `s.queue[0]`，完成后返回 `null`。
  - `grade(s, g)` —— **不可变**：`s` 不变，返回新 `SessionState`。`'again'/'hard'` 把当前卡回收进 `pool`（下轮重洗强化）；`'good'/'easy'` 离开会话；每调一次 `studiedTotal +1`、`roundProcessed +1`、并把当前卡记入 `roundCards`。**一轮（size 张）处理完、pool 仍有余时：置 `roundComplete=true` 暂停**（不再自动重洗），等待 UI 弹出选择屏让用户选「复习本轮回放」或「下一轮」——这是给背词者一个明确的决策点。`pool` 与 `queue` 皆空时 `completed:true`。
  - `dismissCurrent(s)`（「会啦」出队）—— 与 `grade(good)` 在队列上等价（出队 +1），但语义上不涉及 FSRS 重排（FSRS 卡删除由仓库层 `deleteCard` 处理）；同样在一轮末暂停。
  - `reviewRound(s, unMasteredIds)` —— 把本轮 `roundCards` 中未点「会啦」的词重排成队列复习；全都会啦则直接 `nextRound`。
  - `nextRound(s)` —— 从 `pool` 重洗出下一批（size 张），`batchNumber +1`、解除暂停；pool 空即 `completed`。
  - 导出 `shuffle`（Fisher–Yates，返回新数组，便于测试确定性）。
  - `SessionState { size, queue, pool, batchNumber, studiedTotal, initialCount, completed, roundComplete, roundProcessed, roundCards }`（字段语义见文件头注释；`roundComplete/roundProcessed/roundCards` 为 M7 一轮选择屏新增，与实测一致）。
- `src/utils/date.ts`（零依赖）：`dateKey(d?)`（本地时区 `YYYY-MM-DD`，不用 `toISOString` 的 UTC 偏移）、`daysInMonth`、`buildMonthGrid(year, month, today?)`（6×7=42 格，非当月填 `null`，含 `isToday`）。
- 单测：`src/services/SessionService.test.ts`（15 tests）· `src/utils/date.test.ts`（11 tests）。`WordService.test.ts` / `ImportService.test.ts` 的 FakeRepo 已扩展支持 `recordStudyDay` / `getStudiedDays`。

### UI（潘渲染，已落地 —— 均为实测现状）
- `src/components/Calendar.tsx` **已实现**，默认导出 `Calendar`，props `{ studiedDays: Set<string>; year: number; month: number }`；用 `buildMonthGrid` 渲染当月 42 格，每格一个圆点：`studiedDays.has(key)` → `.is-studied`（紫色 `var(--accent)`），今天 → `.is-today` 环；底部 `本月已背 N 天`。位于右栏 `.app-aside`（`.glass` 卡片，`sticky`）。
- `App.tsx` 已重写为会话模型：`session` / `sessionSize`(默认 10) / `studiedDays`；`buildSession(band, size)` = seed→getDueCards→createSession；`useEffect([band, sessionSize])` 重建；挂载 effect 调 `repo.getStudiedDays()` 载入；`handleGrade` 依次 `srs.grade` + `saveCard` + `grade(prev)` + `recordStudyDay(dateKey())` + 更新 `studiedDays`（**同一会话内日历即变紫**）。
- `size-selector`（10/30/50/100 按钮）位于 `BandSelector` 下方；`.app-shell` 两栏（`.app-main` 640 + `.app-aside` 日历），<980px 堆叠。
- **一轮完成选择屏（M7）**：背完一轮（size 张）且 pool 仍有余时，`session.roundComplete=true`，UI 隐藏进度行/闪卡、渲染玻璃质感 `.round-choice` 屏，提供「🔁 复习本轮回放（只重背未点会啦的词）/ 下一轮 →」两个按钮；顶部「已掌握 N 词 · 撤销会啦」。`handleGrade`/`handleMastered` 均有 `busyRef` 闸门防连点。
- 新增依赖：**无**（`SessionService` / `date.ts` 均零依赖）。`react-window` 仍是 v2（自带类型），`@types/react-window` devDep 仍冗余但无害。

## M5 交付模块（实测现状，2026-07-09）

### 词表扩容 + 调度增强（施调度，已落地）
- `src/data/words.ts` **扩容到 210 词**：Band5 51 / Band6 51 / Band7 72 / Band8 36；原 53 个种子全部保留，新词按 band 块追加在末尾。
- `src/data/words.test.ts`（**新增，4 tests**）：断言总词数 ≥205、各 band 下限（5≥50、6≥50、7≥70、8≥35）、全局 id 唯一、字段完整性与 IPA 格式（`phonetic` 以 `/` 起止）。
- `src/repository/VocabRepository.ts`：`seedIfEmpty` 改为 **MERGE**——只 `bulkPut`「当前库中缺失 id」的种子词（`existingIds` 取 `primaryKeys()` 后过滤），**已存在的条目永不覆盖、永不删除**（保护用户导入/编辑过的词）。签名不变。
- `src/services/WordService.ts` 新增 `getStudySet`：
  - 签名：`getStudySet(srs: SrsService, band: Band, now: number = Date.now(), mode: 'due' | 'all' = 'due'): Promise<{ word; card }[]>`
  - `mode='due'`（默认）：等价于 `getDueCards`，仅返回当前到期项（旧行为）。
  - `mode='all'`（重学模式）：返回本档**全部**词（含已排期到未来的），未见过则 `srs.newCard(now)`。
  - `getDueCards` 保持不变。
- `src/services/WordService.test.ts` 由 3 tests 增至 **5 tests**（+2：覆盖 `getStudySet` 的 `'due'`/`'all'`、以及 seed merge 语义；测试内 FakeRepo 的 `seedIfEmpty` 同步改为 merge 语义）。

### UI（潘渲染，已落地 —— 均为实测现状）
- `App.tsx` 新增复习模式切换 `mode`（`'due' | 'all'`，默认 `'due'`）：`mode-switch` 含「仅到期」/「全部本档」两个按钮（`role="group"`、`aria-pressed`）。
- `buildSession(band, size, modeVal)` 改用 `wordService.getStudySet(srs, bandVal, Date.now(), modeVal)`；`useEffect` 依赖改为 `[band, sessionSize, mode]`，三者任一变化都会重排会话。
- 空档引导（不再死路）：`isEmpty && bandTotal > 0 && mode === 'due'` → 显示「本档词今天都复习完啦」+「复习全部本档」按钮（点击切到 `'all'` 重学整档）；`bandTotal === 0` 与 `mode === 'all'` 各有独立空档文案。`Calendar`、framer-motion 翻转、ImportPanel、词库虚拟列表、主题切换均保持可用。
- 新增依赖：**无**（M5 不引入新 npm 包）。`react-window` 仍是 v2（自带类型），`@types/react-window` devDep 仍冗余但无害。

## SRS 引擎（ts-fsrs v4 / FSRS v6）

- 项目锁定 `ts-fsrs` `^4`（实际安装 **4.7.1**），对应 **FSRS v6** 调度算法，替代传统 SM-2，遗忘率更低。
- v4 API 要点（`SrsService.ts` 已按其实现，详见文件头注释）：
  - 工厂函数 `fsrs()`（v3 的 `createFSRS` 已移除）
  - `createEmptyCard(new Date())` 创建一张从未复习过、立即到期的新卡
  - `Card.due` / `Card.last_review` 在 v4 中是 `Date`（v3 是 number），比较需用 `.getTime()`
  - `repeat(card, date)` 返回按 `Rating` 索引的排期记录；索引类型用 `Exclude<Rating, Rating.Manual>` 收窄（IPreview 不含 `Rating.Manual` 档）
- Repository 写入时把 `Card` 序列化为 JSON 字符串，读出时 `reviveCard` 必须把 `due`/`last_review` 从字符串 revive 回 `Date`，否则到期比较失效。

## 质量门禁（PR 合并前必须全过）

1. `npm run build` 通过（`tsc -b` 严格模式 + 构建）。
2. `npm test` 通过（Service 调度核心必须有单测覆盖边界：again/hard/good/easy、短期限时、稳定性单调）。
3. 任何一层越界（UI 直连 storage、Service 含 UI 代码等）一律打回。
4. 新增依赖需说明 license（仅接受 MIT/Apache-2.0/宽松协议）。

> 当前状态（M7，2026-07-11）：`npm run build` **绿**（`tsc -b && vite build`）；`npx vitest run` **93 passed / 10 files**。合并门禁为绿。词表 210 词 + `getStudySet` + seed merge + 复习模式切换 + **一轮完成选择屏（复习本轮回放 / 下一轮）** + 多档案隔离 + 真人发音优先均已落地并有单测覆盖。详细状态见各 `M*_TEAM_REPORT.md`。

## 安全红线（踩过的坑与兜底）

- **导入清洗**：CSV/Anki 导入必须做字段清洗与转义，渲染用户输入时用 `textContent`/受控组件，**禁止 `dangerouslySetInnerHTML`**，防 XSS。
- **压缩包导入**：若未来支持上传词库压缩包，解压必须做 zip-slip 防护
  （校验解压路径不逃逸目标目录），且损坏输入要拒绝、不影响现有数据。
- **本地数据损坏**：Repository 读取失败必须降级为空表/无卡，不得让应用崩溃。

## 复用到的开源能力（attribution）

- `ts-fsrs` (MIT，v4.7.1)：FSRS v6 调度算法。
- `dexie` (MIT，^4)：IndexedDB 封装，支撑离线持久化。
- `papaparse` (MIT，^5.5.4)：导入管线 CSV 解析（已实际使用）。
- `framer-motion` (MIT，^12.42.2)：`Flashcard` 翻转与 `App`/`ImportPanel` 模态动画（已实际使用）。
- `react-window` (MIT，^2.2.7)：`App` 词库虚拟列表 `List`（v2 API，已实际使用）。
- 测验/分级思路参考 `ielts-word-trainer`(Apache-2.0) 与 `memogen`(MIT)。

## 已知 caveats

- 词表为精选种子（**210 词（M5 扩容）**，Band5:51 / Band6:51 / Band7:72 / Band8:36，其中 8 为「8 分以上」档），非完整 1000-2000 词；完整词表在后续里程碑；新词经 `seedIfEmpty` 的 MERGE 自动补入旧库。
- 持久化为 Dexie/IndexedDB（M2 现行方案），不再受 localStorage 容量限制；但**多设备同步尚不支持**，清本地数据仍会丢进度。
- `npm run build` 已转绿（M3 修复类型错误、M4 新增会话/日历、M5 扩容词表与新增 `getStudySet` 后类型仍稳），合并门禁为绿（M5 实测 452 模块 / gzip JS 167.74 kB / CSS 16.80 kB）。
- 学习历史已持久化：`studyLog` 表（Dexie v2 新增，`date` 主键 upsert 幂等）记录每天背词；`getStudiedDays()` 读取全部学习日期键供日历渲染。
- 会话为「分批循环复习」模型：`SESSION_SIZES = [10,30,50,100]`，默认 10；`'again'/'hard'` 回收卡进 pool 重洗成下一轮（遵循 FSRS/艾宾浩斯间隔重复强化），`'good'/'easy'` 离开；pool 与 queue 皆空才 `completed`。该语义已在 `SessionService.test.ts` 覆盖。

## M3 caveats（2026-07-09）

- **导入安全红线（达成）**：导入复用 `sanitize` 的 `containsInjection`/`isValidBand`，与 `safeParseWord` 同源同规则，**绝不弱化**；全仓 **0 处** `dangerouslySetInnerHTML` 实际使用（仅 `ImportService.ts` 头部有「禁止」注释）。CSV/Anki 为纯文本，**不做任何压缩包解压**，因此 **不存在 zip-slip 攻击面**。
- **测试**：`npx vitest run` → **35 passed / 5 files**（含 `ImportService.test.ts` 8 tests）。
- **导入格式**：CSV 需 9 列表头；Anki 支持 2 列（`term\tmeaningZh`，band 默认 `'5'`）或 9 列 TSV；band `'8'` 在导入中完全受支持（白名单含 `'8'`）；重复 `term` 由 `bulkPut` 末值覆盖（last-wins）。
- **UI 已落地（计划=实际）**：`ImportPanel.tsx`、App 内「导入词表」弹窗（AnimatePresence 模态，`role="dialog"`/`aria-modal`，背景点击 / Esc 关闭）、react-window v2 虚拟「词库」列表、`Flashcard` 的 framer-motion 翻转 **均已实现并接入**；`framer-motion`/`react-window` 已在源码中真实 import 使用。导入功能可通过 `npm run dev` 在 UI 中直接验证。
- **DEV 工具链 `npm audit` 漏洞（已知，未自动修复）**：`npm audit` 报告 5 个漏洞（1 critical / 1 high / 3 moderate），全部位于 **DEV 工具链**（esbuild→vite→vitest 传递依赖），修复需 `npm audit fix --force` 升级到 `vite@8`（破坏性变更）。为避免破坏现有构建，**M3 未自动修复**，仅记录待 M4 评估升级。
- 复用的 `papaparse` 已被 `ImportService.parseCsv` 实际使用；`framer-motion`/`react-window` 均已实际使用。
- **已知小冗余（非阻塞）**：`react-window` 为 **v2**，自带类型声明，因此 `package.json` 中的 `@types/react-window` devDependency 已冗余（甚至可能版本不匹配）。当前不影响构建/类型，保留记录、待 M4 清理即可，请勿修改 `package.json`。

## M4 caveats（2026-07-09）

- **学习日历仅显示当月**：`Calendar` 渲染 `year`/`month`（由 `App` 传入当前年月），**无月份前后导航**（按设计如此，不盲目加复杂度）；切换月份查看历史需在后续里程碑评估。
- **安全红线（达成，沿用 M3）**：导入复用 `sanitize`；全仓 **0 处** `dangerouslySetInnerHTML` 实际使用（仅 `ImportService.ts` 头部「禁止」注释）；CSV/Anki 纯文本、**无压缩包解压**、无 zip-slip 攻击面。SessionService/date 新增代码均为纯逻辑/纯函数，不涉及 DOM 或 innerHTML。
- **测试**：`npx vitest run` → **61 passed / 7 files**（M4 新增 `SessionService.test.ts` 15 + `date.test.ts` 11；`WordService.test.ts` / `ImportService.test.ts` 的 FakeRepo 扩展支持 2 个新 repo 方法）。
- **构建**：`tsc -b --force && vite build` 绿，**452 模块**，gzip JS **152.06 kB**（M3 为 449 / 150.67 kB）；新增 `SessionService`/`date.ts` 均零依赖、未引入新 npm 包。
- **DEV 工具链 `npm audit` 漏洞（已知，仍未强制修复）**：沿用 M3 结论——全部位于 DEV 工具链（esbuild→vite→vitest），修复需破坏性升级 `vite@8`；M4 仍**未自动修复**，仅记录，避免破坏现有构建。
- **词表已扩至 210 词**（M5；Band5:51 / Band6:51 / Band7:72 / Band8:36），完整 1000-2000 词在后续里程碑；`react-window` `@types` 冗余同 M3，请勿修改 `package.json`。

## M5 caveats（2026-07-09）

- **词表已扩至 210 词**（M5；Band5:51 / Band6:51 / Band7:72 / Band8:36），在 M2 的 53 词基础上新增 157 词，原种子全部保留；完整 1000-2000 词仍在后续里程碑。
- **seed merge 保护用户数据（达成）**：`seedIfEmpty` 仅补「库中缺失 id」的种子词，**绝不覆盖**用户导入/编辑过的词、**绝不删除**任何已有条目；旧 IndexedDB 在下次加载时自动补齐新增词，导入词不受影响。
- **两种复习模式（达成）**：默认「仅到期」= 旧行为（只练到期词）；切「全部本档」可把整档词（含已排期到未来的）重新拉出来学——学完本档不再空档卡死，空档时引导「复习全部本档」（按钮切到 `'all'`）。`全部本档` 下已学过的词会经 FSRS 重新排期。
- **测试**：`npx vitest run` → **67 passed / 8 files**（M5 新增 `src/data/words.test.ts` 4 tests + `WordService.test.ts` +2 tests 覆盖 `getStudySet` 与 seed merge；FakeRepo 的 `seedIfEmpty` 同步改为 merge 语义）。
- **构建**：`tsc -b && vite build` 绿，**452 模块**，gzip JS **167.74 kB**（CSS 16.80 kB / gzip 3.69 kB）；M5 仅新增数据与 `getStudySet`（均落在既有文件中），未新增 npm 包、未新增模块数（仍是 452）。
- **安全红线（达成，沿用 M3/M4）**：导入复用 `sanitize`；全仓 **0 处** `dangerouslySetInnerHTML` 实际使用；CSV/Anki 纯文本、**无压缩包解压**、无 zip-slip 攻击面。`getStudySet` / seed merge 均为纯逻辑，不涉及 DOM 或 innerHTML。
- **DEV 工具链 `npm audit` 漏洞（已知，仍未强制修复）**：沿用 M3/M4 结论——全部位于 DEV 工具链（esbuild→vite→vitest），修复需破坏性升级 `vite@8`；M5 仍**未自动修复**，仅记录，避免破坏现有构建。
- **`react-window` v2 类型冗余（非阻塞）**：`@types/react-window` devDep 仍冗余，请勿修改 `package.json`。

## M7 一轮选择屏 + 真实踩坑（2026-07-11）

### 一轮完成选择屏（施调度 + UI，已落地）
- `SessionService` 新增 `roundComplete` / `roundProcessed` / `roundCards` 三字段；`grade`/`dismissCurrent` 在「一轮（size 张）处理完、pool 仍有余」时**置 `roundComplete=true` 暂停**，不再自动重洗。
- `App.tsx` 在 `roundComplete && !completed` 时隐藏进度行/闪卡，渲染 `.round-choice` 玻璃选择屏：`🔁 复习本轮回放`（只重背本轮未点「会啦」的词 = `reviewRound(unMasteredIds)`）/ `下一轮 →`（`nextRound`）。`react` 状态驱动，无副作用时序依赖。
- `SessionService.test.ts` 配套新增 5 项：暂停点 no-op、nextRound 重组、reviewRound 过滤未会啦、全都会啦直接跳轮、末轮 `completed`；并统一用确定性 `makeSession` 构造器（规避 `createSession` 内部洗牌导致的随机 id 断言失败）。

### 真实踩坑（均已在 M7 修复，记录防复发）
1. **连点漏卡 / 重复打分**：`handleGrade`/`handleMastered` 从闭包 `session` 抓当前卡；快速连点两下都抓到同一张卡 → FSRS 打两次分、会话却推进两张、下一卡被静默跳过。修复：`busyRef` 闸门，点击即置 `true`、`finally` 清，`setSession(prev => …)` 内驱动推进。
2. **切换档案串档**：原 effect 依赖 `masteredRef.current`（外部 `masteredIds` 时序），`handleSwitchProfile` 先切 `activeProfileId` 触发 effect、再 fire-and-forget `refreshMastered` → 新档案 studySet 用了**旧档案**的「已掌握」集合过滤，把新档案本该出现的词误剔除。修复：`buildSession` 内部直接 `await repo.getMasteredIds()` 取当前激活档案最新集合，并加 `buildSeqRef` 序号丢弃过期异步结果，彻底消除时序与竞态。会话构建入口统一为单一 `buildSession`（原 effect 内联逻辑 + `buildSession` 双路径合并）。
3. **导入词被种子覆盖**：`ImportService` 原 `id = term.trim()`，若导入词恰与种子同 id（如 `analyse`），下次启动 `seedOrRefresh` 按「内置种子词」富文本覆盖。修复：导入词 `id` 加 `import:` 前缀，永不落在种子 id 集合内，独立存活。
4. **导入无上限**：原 `papaparse` 同步解析无行数/字段长度限制，超大/恶意 CSV 可阻塞主线程或爆内存。修复：`MAX_IMPORT_ROWS=2000` 行上限 + `FIELD_MAX=2000` 字段长度裁剪。
5. **背面键盘可聚焦（a11y）**：`Flashcard` 背面打分/「会啦」按钮始终在 DOM（旋转隐藏未 `inert`），键盘用户没翻面就能 Tab 到。修复：未翻面时给 `.fc-back` 设 `inert`（DOM 属性，绕开 React 18 attribute 差异）。
6. **首包过大**：单 chunk 1.3MB（framer-motion 等全进首屏）。缓解：`vite.config.ts` `manualChunks` 拆 `react`/`motion`/`srs`/`data`/`dexie` 独立 vendor chunk，并将 `ImportPanel` 改为 `React.lazy` 懒加载（仅「导入词表」时拉取）。

### M7 测试 / 构建
- **测试**：`npx vitest run` → **93 passed / 10 files**（在 M5 的 67 基础上 +26：SessionService 5 项 + 其余服务边界增强）。
- **构建**：`tsc -b && vite build` 绿；`manualChunks` 拆分后首屏主包显著减小、vendor 可独立缓存。
