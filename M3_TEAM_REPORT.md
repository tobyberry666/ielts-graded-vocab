# M3 交付报告 — 雅思分级背词器（IELTS Graded Vocab）

> 文档角色：架构评审 / 文档负责人（柯林森）。以下内容均基于 **实际读取源码 + 实跑测试** 核实，非计划推测。生成日期：2026-07-09。

## 1. 交付概览

| 模块 | 负责人 | 计划 | 实测结论 |
| --- | --- | --- | --- |
| 导入管线（Service） | 施调度 | CSV/Anki 解析 + 安全清洗 + 落库 | ✅ 已落地，单测覆盖 |
| 导入/浏览 UI | 潘渲染 | ImportPanel、「导入词表」弹窗、react-window 词库、framer-motion 翻转 | ✅ 已落地 |

## 2. 实际文件清单（READ 核实）

M3 相关新增/改动文件（其余为 M1/M2 既有）：

```
src/services/ImportService.ts           # 新增：导入管线（纯 Service 层）
src/services/ImportService.test.ts      # 新增：8 tests
src/repository/VocabRepository.ts       # 改动：新增 putWord / bulkPutWords
src/services/sanitize.ts                # 已有：导出 containsInjection / isValidBand（导入复用）
src/data/words.ts                       # 已有：Band = '5'|'6'|'7'|'8'，SEED_WORDS = 53 词
src/components/Flashcard.tsx            # 已有：framer-motion 翻转动画（motion.div + useReducedMotion）
src/components/ImportPanel.tsx          # 已有：导入面板（CSV/Anki 解析 + 接受/拒绝明细）
src/components/BandSelector.tsx         # 已有：Band 切换
src/components/ProgressRing.tsx         # 已有：进度环
sample-import.csv                       # 新增：9 列 CSV 样例
sample-import.txt                       # 新增：Anki TSV 样例（2 列 / 9 列）
package.json                            # 改动：新增 papaparse / framer-motion / react-window 依赖及类型
```

> 说明：`papaparse`、`framer-motion`、`react-window` 三者均已在源码中真实 import 使用（`App.tsx` 用 `framer-motion` 的 `AnimatePresence`/`motion` 与 `react-window` 的 `List`；`Flashcard.tsx`/`ImportPanel.tsx` 用 `motion`），无已声明未使用依赖。注意 `react-window` 为 v2（自带类型），`package.json` 中的 `@types/react-window` 已冗余，待 M4 清理，无需修改。

## 3. 测试结果（实跑 `npx vitest run`）

```
 Test Files  5 passed (5)
      Tests  35 passed (35)
```

分布：`SrsService.behavior.test.ts`(6) · `SrsService.test.ts`(7) · `WordService.test.ts`(3) · `sanitize.test.ts`(11) · `ImportService.test.ts`(8)。

`npm run build` 实测 **绿**（exit 0，`tsc -b --force && vite build`）：**449 模块**转换，gzip JS **150.67 kB**（UI 工作前为 42 模块 / 95.63 kB）。

## 4. 安全红线状态

- ✅ **导入复用 sanitize 规则**：`ImportService.importWords` 的注入扫描（`containsInjection`）与 band 白名单（`isValidBand`）与 `safeParseWord` **同源同规则**，未弱化。
- ✅ **0 处 `dangerouslySetInnerHTML` 实际使用**：全仓仅 `ImportService.ts` 头部有一句「禁止」注释，无任何实际调用。用户输入经 React 受控组件自动转义。
- ✅ **无 zip-slip 攻击面**：CSV/Anki 为纯文本解析，**不做任何压缩包解压**，因此不存在解压路径逃逸风险。
- ✅ **解析不崩溃**：Anki 列数异常时产出会被 `importWords` 拒绝的非法行，而非抛异常。

## 5. 手动测试步骤

> 导入 UI 已可用，以下提供完整验证路径（含 UI 导入）。

1. 启动应用（基础功能 + UI 导入）：
   ```bash
   cd app && npm install && npm run dev   # http://localhost:5173
   ```
   观察：Band 选择、闪卡翻转（framer-motion，减少动效下自动关掉过渡）、Web Speech 朗读（点 🔊 按钮）正常；
   点「导入词表」→ 选 `sample-import.csv` / `sample-import.txt` → 面板展示接受/拒绝明细 → 点「词库」可经 react-window 虚拟列表浏览（含新导入的词）。弹窗支持背景点击 / Esc / 关闭按钮退出。

2. 验证导入管线（单测 + 直接调用）：
   ```bash
   cd app && npx vitest run src/services/ImportService.test.ts
   ```
   该用例覆盖：合法 CSV / Anki（2 列 & 9 列）被 **accepted**；缺 `term`/`meaningZh`、非法 band、含 `<script>` 等注入内容被 **rejected**；`sample-import.csv` 与 `sample-import.txt` 格式符合解析契约。

3. 程序化自检（可选）：在代码中 `import { parseCsv, parseAnki, importAndStore } from './services/ImportService'`，对 `sample-import.csv` / `sample-import.txt` 调用 `importAndStore(rows, repo)`，打印 `report.accepted` / `report.rejected` 观察接受/拒绝明细。

## 6. 已知 caveats

- **重复 term 末值覆盖（upsert）**：`ImportService` 以 `id = term.trim()` 落库，`bulkPutWords` 对相同 `term` 为 last-wins（覆盖），非累加。
- **Anki 2 列 band 默认 `'5'`**：`term\tmeaningZh` 形态不提供 band，统一默认 `'5'`。
- **DEV 工具链 `npm audit` 漏洞（已知，未自动修复）**：`npm audit` 报 5 个漏洞（1 critical / 1 high / 3 moderate），全部位于 **DEV 工具链**（esbuild → vite → vitest 传递依赖）。修复需 `npm audit fix --force` 升级至 `vite@8`（破坏性变更）。为避免破坏现有构建，**M3 选择不自动修复**，仅记录，留待 M4 评估升级。
- **`react-window` v2 类型冗余（非阻塞）**：`react-window` 为 v2（自带类型），`package.json` 中的 `@types/react-window` 已冗余，待 M4 清理，无需修改。

## 7. 下一步（M4）

- **填充词表**：补齐 1000–2000 词（柯林斯分级对齐），替代当前 53 词种子。
- **（M3 规划 UI 已在 M3 内完成）**：`ImportPanel` + 「导入词表」弹窗（调用 `importAndStore`）、react-window v2 `List` 虚拟滚动词库、`Flashcard` framer-motion 翻转均已落地，无需在 M4 重复实现。
- **可选导出功能**：支持将词库导出为 CSV/Anki 格式。
- **评估 `npm audit` 升级**，在 M4 视情况将 vite 升级到安全版本并验证构建不破。
