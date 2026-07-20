[English](README_EN.md)

# IELTS Graded Vocab

一个面向雅思学习者的本地优先背词应用：按 Band 5-9 选择分级词汇，用 FSRS 间隔重复安排复习，并把学习进度保存在当前浏览器中。无需注册即可使用，也可通过 CSV 或 Anki 文本带入、带出词表。

- [在线 Demo](https://tobyberry666.github.io/ielts-graded-vocab/)
- [CI](https://github.com/tobyberry666/ielts-graded-vocab/actions/workflows/ci.yml)
- [更新记录](CHANGELOG.md)

## 核心能力

- Band 5-9 分级词汇；支持“仅到期”和“全部本档”两种学习范围。
- 正反面闪卡与 `again`、`hard`、`good`、`easy` 四档评分，由 FSRS 计算下一次复习时间。
- 分批学习、轮次回放或继续下一轮，以及“会啦”标记。
- 多个本地档案；各档案的卡片进度、已掌握词和学习日历相互隔离。
- CSV / Anki 文本导入与导出；导入内容经过字段校验、Band 白名单和注入检查。
- 中英释义、例句、搭配和发音能力按词条可用数据展示。

## 设计与架构

```text
React UI
  |-- Word / Session / Import / Pronunciation services
  |-- SrsService -> ts-fsrs
  `-- VocabRepository -> Dexie / IndexedDB
                         `-- checked-in Band vocabulary data
```

`SrsService` 单独封装 `ts-fsrs`，不负责界面或持久化；会话编排和导入处理也各自位于独立 Service。`VocabRepository` 为上层屏蔽 IndexedDB 细节，并按档案隔离卡片、学习日历和已掌握状态。这些边界让核心规则可以脱离 UI 测试。

应用采用 local-first 模式：词表和学习状态写入浏览器 IndexedDB，不需要远端账户或后端服务。CSV / Anki 导入导出适合迁移自定义词表，但当前导出不包含档案、学习日历或 FSRS 进度。

## 本地运行

CI 使用 Node.js 20。在仓库根目录运行：

```bash
git clone https://github.com/tobyberry666/ielts-graded-vocab.git
cd ielts-graded-vocab
npm ci
npm run dev
```

生产构建：

```bash
npm run build
```

## 测试与 CI

```bash
npm test
npm run build
```

测试覆盖 FSRS 评分与到期判断、会话轮次、Band 与到期词筛选、导入校验、档案隔离与 IndexedDB 迁移、日历日期边界、词表数据约束和发音选择等关键行为。README 不固定记录用例数或覆盖率，以 CI 结果为准。

CI 工作流在提交到 `master` 以及面向 `master` 的 Pull Request 上，从仓库根目录执行 `npm ci`、`npm run build` 和 `npm test`。Pages 工作流在 `master` 更新或手动触发时同样从根目录构建，将生成的 `dist/` 作为 Pages artifact 部署；使用者无需手动推送 `app/dist` 或维护 `gh-pages` 分支。

## 数据与许可边界

词汇数据的来源、衍生范围和已核实许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。仓库没有为代码与数据的组合分发提供统一许可授权；再分发前需自行评估适用的第三方条款并取得所需许可。

## 已知限制

- 学习状态仅保存在当前浏览器和站点存储中；换设备、换浏览器、清除站点数据或使用临时会话时不会自动恢复。
- 本地档案不是云端账户，项目目前不提供跨设备同步。
- CSV / Anki 导入导出可迁移词表，但不能备份或恢复档案、学习日历和 FSRS 进度。
- 发音可用性取决于词条数据、浏览器能力和网络环境。
