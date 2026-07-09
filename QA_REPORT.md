# QA 质量门禁报告（M2）

> 说明：本文件由主理人（资深开发工程师吴八哥）在集成收口阶段，依据**实测结果**补写。
> 严把关（yanbaguan）因 Agent 轮次上限（Max turns 30）被截断，未及产出书面报告，
> 但其测试与 CI 代码均已落地并通过验证（详见下文）。

## 1. 测试覆盖（vitest，node 环境，21 用例全绿）

| 文件 | 用例数 | 覆盖点 |
|------|-------|--------|
| `src/services/SrsService.test.ts` | 7 | 新卡立即到期；again→短期限时（几分钟）；easy→推远（≥1天）；good 稳定性单调递增；dueCards 过滤（已到期/未来到期/边界） |
| `src/services/WordService.test.ts` | 3 | filterByBand 仅返回对应 band；未见过词经 newCard 立即到期并出现；未来到期词被排除 |
| `src/services/sanitize.test.ts` | 11 | escapeHtml 覆盖 `& < > " '`；safeParseWord 正常/字段缺失/类型错误/band 非法/注入检测；**损坏输入返回 `{ok:false}` 且绝不抛异常** |

运行：`npx vitest run` → `Test Files 3 passed / Tests 21 passed`。

## 2. 安全红线条目核查

- **XSS**：`sanitize.escapeHtml` 对任何外部/用户输入在渲染前转义；`safeParseWord` 对疑似注入（`<script>`/`<iframe>`/`<img>`/`onerror=`/`javascript:`/`<svg>`）直接拒绝。
- **损坏输入**：`safeParseWord` 为纯函数，`try/catch` 兜底，**绝不抛异常、绝不修改入参、绝不污染现有数据**。
- **zip-slip / 不可信压缩包**：当前无压缩包导入需求，风险不适用，已在审查中注明。
- **CI 门禁**：`.github/workflows/ci.yml` 在 push/PR 执行 `npm ci && npm run build && npm test`，失败阻断合并。

## 3. 架构边界核查（三条红线）

1. **分层边界**：`src/App.tsx` 与 `src/components/*` 仅通过 `WordService` / `VocabRepository` / `SrsService` 取数，**未直接 import Dexie 或 ts-fsrs 的 `Card` 做业务逻辑**。数据流 `UI → Service(须测试) → Repository(Dexie) → Data(seed)` 未越界。
2. **测试覆盖**：Service 层（SrsService / WordService / sanitize）均有 vitest 用例。
3. **安全用例**：见第 2 节，XSS 转义与损坏输入拒绝均有真实断言，非摆设。

## 4. 已知坑（集成阶段已修，供后续参考）

- 装的是 `ts-fsrs@4.7.1`（v4 API），`SrsService` 原按 v3 写会卡死 `npm run build`：`createFSRS`→`fsrs()`、`createBlankCard`→`createEmptyCard`、`card.due` 在 v4 是 `Date`（比较改 `card.due.getTime()`）；`repeat` 返回的 `IPreview` 不含 `Rating.Manual`，索引用 `Exclude<Rating, Rating.Manual>` 收窄。
- `vitest` 用 esbuild 运行**不做类型检查**，类型错误只在 `tsc -b` / `npm run build` 暴露——CI 里 `npm run build` 这一步正是为此存在。

## 5. 结论

**通过（可合并）。** 三条质量红线均达标，21 单测全绿，CI 门禁就位。后续 M3 再补 playwright E2E 主流程与更高覆盖。
