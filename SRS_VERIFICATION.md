# SRS 验证报告（FSRS v4 / ts-fsrs v4）

**被测对象**：`src/services/SrsService.ts`（封装 `ts-fsrs` v4，FSRS v6 调度算法）
**验证文件**：`src/services/SrsService.behavior.test.ts`（vitest，6 个用例全部通过）
**运行命令**：`npx vitest run src/services/SrsService.behavior.test.ts` → `6 passed (6)`

> 说明：以下结论均严格对应测试文件中的断言，不超出测试实际覆盖的范围。FSRS 的具体间隔/稳定性数值由算法内部参数（默认 `request_retention`、w 权重等）计算，本验证只断言**相对顺序与单调性**，不锁定绝对天数。

## 1. 首轮复习调度（first-review scheduling）
- 一张从未复习的卡经 `createEmptyCard(new Date(now))` / `srs.newCard(now)` 创建后，`due <= now`，即**立即进入今日学习队列**（测试断言 `isDue(card, now) === true`）。
- 四种评分把同一张新卡推到不同的到期时间，验证 FSRS v4 的评分分支确实生效：
  - `Again` 落在短期限时窗口内（`<= now + 10min`，因 `enable_short_term: true`）。
  - `Easy` 推到长远未来（`> now + 1 天`）。

## 2. 按评分排序的到期顺序（due-date ordering by rating）
对同一张新卡分别评分，到期时间戳满足严格递增：
```
due(Again) < due(Hard) < due(Good) < due(Easy)
```
即记忆强度/掌握度越高，下次复习被推得越晚。该顺序分别用**业务映射**（`Grade` 字符串）和**原生 `ts-fsrs` `Rating` 枚举**两种入口各验证一遍，结论一致。

## 3. `isDue` 语义
`isDue(card, now)` 在 `card.due <= now` 时返回 `true`，否则 `false`：
- 新卡在 `now` 到期，但在 `now - 1` 不交。
- `Easy` 推到未来的卡在 `now` 不交，但在其 `due` 时刻交、在 `due - 1` 不交。
朴素边界行为正确。

## 4. 稳定性 / 间隔增长（stability / interval growth）
连续以 `Good` 复习同一张卡（复习时点随前一次到期日推进）：
- `stability`（记忆留存稳定性）严格单调递增：`stability_1 < stability_2 < stability_3`。
- 到期日也严格推后：`due_1 < due_2 < due_3`，符合"复习越熟练、间隔越长"的 SRS 直觉。

## 5. `grade` 返回合法性
对每个评分档，`grade()` 均返回**非空、且 `due` 为合法 `Date`**（非 `NaN`）的下一张卡。

## 结论
FSRS v4 在 `SrsService` 上的调度数学表现正确且自洽：新卡即时到期、评分→到期顺序单调合理、短期/长期分支生效、稳定性与间隔随复习单调递增、`isDue` 边界正确。未发现需要修改 `SrsService.ts` 的缺陷。
