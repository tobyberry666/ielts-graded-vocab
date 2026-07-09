# M5 交付报告 — 雅思分级背词器（IELTS Graded Vocab）

> 文档角色：架构评审 / 文档负责人（柯林森）。以下内容均基于 **实际读取源码（已重读、确认非陈旧版本）+ 实跑测试/构建** 核实，非计划推测。生成日期：2026-07-09。
>
> **复盘说明（与 M3 不同）**：本次所有结论在落笔前均用 `Grep`/`Read` 二次核验了当前落地文件——首轮 `Read App.tsx` 一度返回了陈旧（M4）版本，已被 `Grep` 抓出并重新读取纠正，因此本文 **不会** 出现「UI 未实现 / 词表仍是 53 词」类错误表述。

## 1. 交付概览

| 模块 | 负责人 | 计划 | 实测结论 |
| --- | --- | --- | --- |
| 词表扩容 + 调度增强（Service/Repo/Data + 单测） | 施调度 | 词表扩到 200+；`seedIfEmpty` 改 MERGE；`getStudySet` 双模式 | ✅ 已落地，单测覆盖 |
| 渲染（复习模式切换 + 空档重学引导 + CSS） | 潘渲染 | 「仅到期 / 全部本档」切换、空档引导按钮、样式 | ✅ 已落地 |

## 2. 实际文件清单（READ 核实）

M5 相关新增/改动文件（其余为 M1–M4 既有）：

```
src/data/words.ts                 # 改动：种子词 53 → 210（Band5:51/Band6:51/Band7:72/Band8:36），原种子保留、新词按块追加
src/data/words.test.ts            # 新增：4 tests（总词数≥205、各 band 下限、id 唯一、字段完整/IPA 格式）
src/repository/VocabRepository.ts # 改动：seedIfEmpty 改为 MERGE（只补缺失 id，绝不覆盖/删除）
src/services/WordService.ts       # 改动：新增 getStudySet(srs, band, now?, mode:'due'|'all'='due')；getDueCards 不变
src/services/WordService.test.ts  # 改动：3 → 5 tests（覆盖 getStudySet 双模式 + FakeRepo seed merge 语义）
src/App.tsx                       # 改动：新增 mode('due'|'all') 切换；buildSession 改调 getStudySet；useEffect 依赖 [band,sessionSize,mode]；空档重学引导
src/styles.css                    # 改动：新增 .mode-switch / .mode-btn / .btn-primary 等样式
package.json                      # 未改动（M5 未新增任何依赖）
```

> 说明：M5 不引入新 npm 包，词表数据与 `getStudySet` 均落在既有文件中，因此构建模块数与 M4 持平（见 §3）。`@types/react-window` 冗余同 M3，未改 `package.json`。

## 3. 测试结果（实跑 `npx vitest run`）

```
 Test Files  8 passed (8)
      Tests  67 passed (67)
```

分布：`date.test.ts`(11) · `SrsService.behavior.test.ts`(6) · `SrsService.test.ts`(7) · **`WordService.test.ts`(5，+2)** · `sanitize.test.ts`(11) · `SessionService.test.ts`(15) · **`words.test.ts`(4，新增)** · `ImportService.test.ts`(8)。

`npm run build` 实测 **绿**（exit 0，`tsc -b && vite build`）：**452 模块** 转换，gzip JS **167.74 kB**，CSS **16.80 kB**（gzip 3.69 kB）。

> ⚠️ 数字校准：上游预共享的「453 模块 / gzip 152.63 kB」与实际构建不符，本文以**重跑得到的真实数字**（452 / 167.74）为准。gzip 较 M4（152.06）上升，主要来自词表新增 157 词的序列化数据入包，属预期。

## 4. 安全红线状态

- ✅ **导入复用 sanitize 规则**：与 M3/M4 一致，`ImportService` 注入扫描/`isValidBand` 与 `safeParseWord` 同源同规则，未弱化。
- ✅ **0 处 `dangerouslySetInnerHTML` 实际使用**：全仓仅 `ImportService.ts` 头部有一句「禁止」注释，无任何实际调用。M5 新增的 `getStudySet` / seed merge / `App` 模式切换均为纯逻辑或受控渲染，不涉及 innerHTML。
- ✅ **无 zip-slip 攻击面**：CSV/Anki 仍为纯文本解析，**不做任何压缩包解压**。
- ✅ **本地数据损坏降级**：`VocabRepository` 读取失败仍降级为空表/无卡，`seedIfEmpty` 的 merge 也不会破坏已有条目。
- ✅ **seed merge 不破坏用户数据**：MERGE 仅补「缺失 id」，导入/编辑过的词**绝不覆盖、绝不删除**。

## 5. 手动测试步骤

1. 启动应用：
   ```bash
   cd app && npm run dev   # http://localhost:5173
   ```
2. 选 **Band 7** → 首批出现卡片；点开「词库」可见该档约 **72 词**。
3. 默认模式为「**仅到期**」（旧行为：只练到期词）。把本档到期词全背完 → 空档区显示「本档词今天都复习完啦」+「**复习全部本档**」按钮。
4. 点「复习全部本档」→ 模式切到「**全部本档**」，整档词（含已排期到未来的）被重新拉出学习；学完不再空档卡死。
5. 切回「仅到期」再切到「全部本档」均无异常；切换 `size-selector`(10/30/50/100)、刷新页面，日历打卡与进度环均正常。
6. **旧库兼容**：用 M4 或更早的 IndexedDB 打开应用 → 下次加载时 `seedIfEmpty` 的 MERGE 自动补齐 M5 新增词，自己导入/编辑过的词完好保留（可在「词库」中核对）。

## 6. 已知 caveats

- **seed merge 只补缺失 id，不覆盖导入词**：若某词的 `id` 与新增种子冲突，用户库中的版本优先（不会被种子覆盖）；要更新词义需手动编辑或重新导入。
- **「全部本档」会重排已学词**：该模式下已学过的词经 FSRS 重新排期（再次出现），属预期的重学行为。
- **完整 1000–2000 词未达**：当前 210 词（Band 7 达 72）仍属精选种子；完整词表可经 CSV/Anki 导入补充，或留待后续批量里程碑。
- **学习日历仅显示当月**（沿用 M4）：无月份前后导航，按设计如此。
- **DEV 工具链 `npm audit` 漏洞（已知，未强制修复）**：全部位于 DEV 工具链（esbuild→vite→vitest），修复需破坏性升级 `vite@8`；M5 未自动修复，避免破坏构建。
- **`react-window` v2 类型冗余（非阻塞）**：`@types/react-window` devDep 冗余，请勿修改 `package.json`。

## 7. 下一步（M6 及以后）

- **可选月份导航**：为学习日历增加跨月查看历史打卡。
- **可选导出功能**：支持把词库导出为 CSV/Anki（M3 已具备解析契约，导出为对称能力）。
- **推进 1000–2000 词**：通过批量种子或官方词表导入补齐完整规模。
- **CI / 打包 / 一键启动**（原 M5 规划）：纳入 M6，串联 lint+test+build。
- **评估 `npm audit` 升级**：视情况将 vite 升级到安全版本并验证构建不破。
