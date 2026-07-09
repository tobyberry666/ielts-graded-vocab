# M4 交付报告 — 雅思分级背词器（IELTS Graded Vocab）

> 文档角色：架构评审 / 文档负责人（柯林森）。以下内容均基于 **实际读取源码 + 实跑测试/构建** 核实，非计划推测。生成日期：2026-07-09。
>
> **更正声明**：M3 期间曾因并行执行中读取到陈旧文件，误写下「UI 未实现」类表述。本次全部基于当前已落地、构建通过的真实代码，结论均为「已落地」。

## 1. 交付概览

| 模块 | 负责人 | 计划 | 实测结论 |
| --- | --- | --- | --- |
| 会话调度（Service + 持久化 + 工具） | 施调度 | SessionService + studyLog 表 + date 工具 + 单测 | ✅ 已落地，单测覆盖 |
| 渲染（日历 + 批量选择器 + App 重接线 + CSS） | 潘渲染 | Calendar 组件、size-selector、App 会话模型改写、两栏布局 | ✅ 已落地 |

## 2. 实际文件清单（READ 核实）

M4 相关新增/改动文件（其余为 M1–M3 既有）：

```
src/services/SessionService.ts        # 新增：会话编排（纯 Service 层，零依赖）
src/services/SessionService.test.ts   # 新增：15 tests（again/hard/good/easy、循环重洗、completed 边界）
src/utils/date.ts                     # 新增：零依赖日期工具（dateKey / daysInMonth / buildMonthGrid）
src/utils/date.test.ts                # 新增：11 tests
src/components/Calendar.tsx           # 新增：学习日历（42 格当月网格 + 打卡变紫）
src/repository/VocabRepository.ts     # 改动：Dexie v2 新增 studyLog 表；新增 recordStudyDay / getStudiedDays
src/services/WordService.ts           # 改动：FakeRepo 扩展支持 2 个新 repo 方法（测试用）
src/services/ImportService.ts         # 改动：FakeRepo 扩展支持 2 个新 repo 方法（测试用）
src/App.tsx                           # 改动：重写为会话模型（session / sessionSize / studiedDays / size-selector）
src/styles.css                        # 改动：新增 .cal / .cal-grid / .cal-dot.is-studied / .size-selector 等样式
package.json                          # 未改动（M4 未新增任何依赖）
```

> 说明：会话调度（`SessionService`）与日期工具（`date.ts`）均 **零依赖**，故 `package.json` 无任何新增依赖。`react-window` 仍为 v2（自带类型），`@types/react-window` 冗余但无害，沿用 M3 结论、未改 `package.json`。

## 3. 测试结果（实跑 `npx vitest run`）

```
 Test Files  7 passed (7)
      Tests  61 passed (61)
```

分布：`SrsService.behavior.test.ts`(6) · `SrsService.test.ts`(7) · `WordService.test.ts`(3) · `sanitize.test.ts`(11) · `ImportService.test.ts`(8) · **`SessionService.test.ts`(15)** · **`date.test.ts`(11)**。

`npm run build` 实测 **绿**（exit 0，`tsc -b --force && vite build`）：**452 模块** 转换，gzip JS **152.06 kB**，CSS **15.72 kB**（M3 为 449 模块 / 150.67 kB）。

## 4. 安全红线状态

- ✅ **导入复用 sanitize 规则**：与 M3 一致，`ImportService` 的注入扫描/`isValidBand` 与 `safeParseWord` 同源同规则，未弱化。
- ✅ **0 处 `dangerouslySetInnerHTML` 实际使用**：全仓仅 `ImportService.ts` 头部有一句「禁止」注释，无任何实际调用。M4 新增的 `SessionService`/`date.ts`/`Calendar` 均为纯逻辑/纯渲染，不涉及 innerHTML。
- ✅ **无 zip-slip 攻击面**：CSV/Anki 仍为纯文本解析，**不做任何压缩包解压**。
- ✅ **本地数据损坏降级**：`VocabRepository` 读取失败仍降级为空表/无卡，`studyLog` 读写不阻断主流程。

## 5. 手动测试步骤

1. 启动应用：
   ```bash
   cd app && npm run dev   # http://localhost:5173
   ```
2. 选一个 Band（默认 `5`）→ 出现首批卡片（默认每轮 10 张）。
3. 背 ≥1 张卡（点任意评级 `again`/`hard`/`good`/`easy`）→ **右栏学习日历中今天那天的圆点立即变紫**（同一会话内生效，无需刷新）；底部「本月已背 N 天」计数 +1。
4. 切换 `size-selector` 的 **10 / 30 / 50 / 100** → 会话按新批次规模重建（进度环 `第 X 轮` 重置，首批张数变化）。
5. 对一张卡答 **`again`**（或 `hard`）→ 该卡在本批背完后回收进池，**下轮重洗再次出现**（循环复习）；反复答 `good`/`easy` → 卡离场，池与队列皆空时显示「本轮复习已完成」。
6. 刷新页面 → 之前打卡的日期仍显示为紫色（来自 `studyLog` 持久化）。

## 6. 已知 caveats

- **学习日历仅显示当月**：`Calendar` 由 `App` 传入当前 `year`/`month`，**无月份前后导航**（按设计如此，不盲目加复杂度）；历史月份查看留待后续里程碑。
- **DEV 工具链 `npm audit` 漏洞（已知，未强制修复）**：沿用 M3 结论——全部位于 DEV 工具链（esbuild→vite→vitest 传递依赖），修复需破坏性升级 `vite@8`；M4 仍**未自动修复**，仅记录，避免破坏现有构建。
- **`react-window` v2 类型冗余（非阻塞）**：`react-window` 为 v2（自带类型），`@types/react-window` devDep 冗余，请勿修改 `package.json`。
- **词表仍是 53 词**（bands 5/6/7/8，含 8 档），完整 1000-2000 词在后续里程碑。

## 7. 下一步（M5 及以后）

- **填充词表**：补齐 1000–2000 词（柯林斯分级对齐），替代当前 53 词种子。
- **可选导出功能**：支持将词库导出为 CSV/Anki 格式（M3 已具备解析契约，导出为对称能力）。
- **可选月份导航**：为学习日历增加跨月查看历史打卡的能力。
- **评估 `npm audit` 升级**：视情况将 vite 升级到安全版本并验证构建不破。
