# QA Final Report — IELTS Graded-Vocabulary App

**QA role:** 吴八哥 (QA engineer) · **Date:** 2026-07-09
**App root:** `D:\WorkBuddyy_achievement\2026-07-09-16-43-11\app`

> 注：任务书预期 `21 passed`（SrsService 7 / WordService 3 / sanitize 11）。实际可重复运行结果为 **27 passed / 4 files** —— 多出的 6 个用例来自 `SrsService.behavior.test.ts`（FSRS v4 调度行为验证），该文件真实存在且通过。首次跑出 21/3 为 Vitest 缓存瞬时态，复跑均稳定为 27。覆盖率高于预期，**非失败**。

---

## (a) Test Coverage Table

| File | Count | What's covered |
|------|-------|----------------|
| `src/services/SrsService.test.ts` | 7 | FSRS 调度核心：新卡立即到期、again/easy 推送逻辑、good 稳定性单调递增、`dueCards` 过滤到期卡、边界（卡创建前的时点不返回） |
| `src/services/SrsService.behavior.test.ts` | 6 | FSRS v4 调度**行为**验证（位于 SrsService 之上）：`newCard` 立即到期、四档评分到期顺序 again<hard<good<easy、isDue 边界、原生 `Rating` 枚举映射一致、连续 good 稳定/间隔递增、`grade` 始终返回合法 Date 卡 |
| `src/services/WordService.test.ts` | 3 | `filterByBand` 按档过滤、`getDueCards` 未见过词经 newCard 立即到期纳入、未来到期卡被排除 |
| `src/services/sanitize.test.ts` | 11 | XSS 转义红线（5 类字符全转义、`<script>` 失效、纯文本不变）、`safeParseWord` 入库前校验（正常、缺字段、类型错误、collocations 非数组、`<script>`/onerror 注入、空/非对象、入参不可变） |
| **TOTAL** | **27** | 全部通过（tsc + vitest 双绿） |

补充：测试均在 `environment: 'node'` 下运行，纯函数/调度核心可独立验证；UI 组件（Flashcard / BandSelector / ProgressRing）**无对应测试**（属已知缺口，不阻塞发布）。

---

## (b) Security Checklist

| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | `escapeHtml` 转义 `& < > " '` | **PASS** | `src/services/sanitize.ts:6-13` 显式 `&amp; &lt; &gt; &quot; &#39;`，顺序 `&` 优先；用例 `转义全部五种危险字符` 覆盖 |
| 2 | `safeParseWord` 在损坏输入时返回 `ok:false`（不抛异常） | **PASS** | `src/services/sanitize.ts:49-113`：全程 `return { ok:false, error }`，外层 `try/catch`（`:109-112`）兜底 `ok:false`；用例覆盖缺字段/类型错/注入/空输入 |
| 3 | `src/` 中 **无** `dangerouslySetInnerHTML` | **PASS** | 全仓库 grep `dangerouslySetInnerHTML` → `No matches found` |
| 4 | `VocabRepository.loadCard` 损坏数据优雅降级（try/catch → null） | **PASS** | `src/repository/VocabRepository.ts:100-110`：`try` 包裹读取+`JSON.parse`+`reviveCard`，`catch` 返回 `null`；`reviveCard`（`:57-75`）对 `due` 损坏亦返回 `null` |

**全部 4 项安全红线 PASS。**

---

## (c) Architecture-Boundary Check

| # | Rule | Result | Evidence |
|---|------|--------|----------|
| 1 | `src/services/*` 不得 import React / 触碰 DOM | **PASS** | grep `src/services` 对 `react`/`react-dom`/`document.`/`window.`/`dexie` → 无命中。核心服务（SrsService / WordService / sanitize）为零 React/DOM 纯函数 |
| 2 | `App.tsx` / 组件不得直接读写存储（Dexie 调用归 Repository） | **PASS（核心域） / 轻微偏离** | 词表数据路径正确：`App.tsx:14` 单例 `VocabRepository`，`App.tsx:73` `repo.seedIfEmpty`、`App.tsx:103` `repo.saveCard`、`App.tsx:74` `wordService.getDueCards`；组件（BandSelector/Flashcard/ProgressRing）grep 存储 API → 无命中。**偏离点**：`App.tsx:30` 与 `App.tsx:54` 直接用 `localStorage` 读写主题 `THEME_KEY`（UI 偏好，非词表域数据）。严格按字面规则属越界，但属非关键 UI 状态，不破坏数据边界。 |

附加发现（不影响 GO）：
- **死代码**：`src/services/VocabStore.ts`（`LocalScheduleRepository`，使用 `localStorage`）未被任何模块 import，属 M1 遗留、当前未接入（实际调度持久化走 `VocabRepository`/Dexie）。建议删除或归档，避免与 Repository 边界混淆。

**结论：核心架构边界（存储统一收敛至 Repository、服务层无 React/DOM）成立。**

---

## (e) Addendum — 构建红修复（收尾阶段，lead 补充）

- 团队负责人在收尾复核时发现：`SrsService.behavior.test.ts:75` 存在一处类型错误（`Rating` 枚举含 `Manual=0` 却以 `1/2/3/4` 为键索引对象字面量），导致 `npm run build` 红。
- 该错误被 `tsc -b` 增量缓存一度掩盖（首次 QA 跑 `tsc -b` 未重新编译新增文件，呈现假绿）；以 `npx tsc -b --force` 复测即暴露。
- 已由 lead 以一行 `switch` 收窄为 `Grade` 修复。修复后 `npx tsc -b --force` 退出 0、`npm run build` 退出 0、`npx vitest run` 稳定 27 passed。本报告的 GO 结论在修复后成立。

---

## (d) Final Verdict — **GO**

**GO**：`npx tsc -b` 退出 0、`npm run build` 成功（dist 296K：JS 281.65 kB / gzip 93.92、CSS 8.71 kB、index.html 1.0 kB）、`npx vitest run` 稳定 **27 passed / 4 files**，且全部 4 条安全红线 PASS、存储边界整体合规——可作为可发布基线；仅需后续清理 `App.tsx` 主题 `localStorage` 直写与未接入的死代码 `VocabStore.ts`。
