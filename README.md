# 雅思分级背词器 (IELTS Graded Vocab)

类 Anki 的雅思分级背单词 Web 应用：输入你的水平 Band → 推送对应难度词表
（初级≈Band5-6 / 中级≈Band6-7 / 高级≈Band7-8+，每级 1000-2000 词）→ 用现代
FSRS 间隔重复算法排期 → 柯林斯式闪卡（音标/词性/中英释义/搭配/原版例句）。

> 当前为 **M5 完成**：在 M4（会话制循环复习 + 学习日历）基础上，M5 进一步**大幅扩容词表至 210+ 词**（Band 7 达 72），并新增**复习模式「仅到期 / 全部本档」**——学完本档也能重学，不再空档卡死。导入管线、虚拟词库、framer-motion 翻转均保持可用。完整 1000-2000 词表在后续里程碑。详见 `M4_TEAM_REPORT.md` 与 `M5_TEAM_REPORT.md`。

## 技术栈

- **前端**：React 18 + TypeScript + Vite
- **SRS 引擎**：[`ts-fsrs`](https://github.com/ishiko732/ts-fsrs)（FSRS v6，现代 Anki 同款调度，MIT）
- **测试**：Vitest（覆盖 Service 调度核心）
- **持久化**：M1 用 `localStorage`；M2 换成 `Dexie`(IndexedDB)

## 快速开始

```bash
cd app
npm install
npm run dev        # 启动开发服务器（默认 http://localhost:5173）
npm test           # 运行 SRS 调度核心单元测试
npm run build      # 类型检查 + 生产构建
```

## 架构（团队定的分层红线）

```
UI (src/App.tsx)
  │  只负责渲染与交互，不含调度/存储逻辑
  ▼
Service (src/services/SrsService.ts)
  │  封装 ts-fsrs，纯逻辑、可单测；不碰 UI、不碰存储
  ▼
Repository (src/repository/VocabRepository.ts)
  │  负责卡调度状态的持久化（Dexie/IndexedDB），对 Service 屏蔽存储细节
  ▼
Data (src/data/words.ts)
     种子词表（Band 标签 + 柯林斯式字段）
```

> 红线：Service 不出现 UI 代码，Repository 不直连组件，UI 不直连存储。
> 任何一层越界都会在 Code Review 阶段被「严把关」驳回。

## 目录

```
app/
├── index.html
├── package.json
├── tsconfig.json / tsconfig.node.json
├── vite.config.ts          # 同时承载 Vite 与 Vitest 配置
├── src/
│   ├── main.tsx
│   ├── App.tsx             # UI 层
│   ├── data/words.ts       # 数据层：Band 分级种子词
│   ├── repository/
│   │   └── VocabRepository.ts  # Repository 层：Dexie/IndexedDB 持久化
│   ├── services/
│   │   ├── SrsService.ts        # Service 层：FSRS 调度
│   │   ├── SrsService.test.ts   # Service 单测
│   │   ├── ImportService.ts     # Service 层：CSV/Anki 导入管线
│   │   └── sanitize.ts          # 注入过滤 / band 白名单
│   └── components/
│       ├── Flashcard.tsx        # framer-motion 翻转闪卡
│       └── ImportPanel.tsx      # 导入面板（CSV/Anki）
├── CLAUDE.md               # 架构与质量门禁（给 AI/协作者看）
└── README.md
```

## 路线图（M1–M6）

- **M1**（已完成）：词表管线 + 项目骨架 + ts-fsrs 集成 + Service 单测
- **M2**（已完成）：Dexie 离线存储 + 210 词种子词表（M5 扩容；Band 5/6/7/8 = 51/51/72/36）
- **M3**（已完成）：
  - 已落地：CSV/Anki **导入管线**（`ImportService`，含 `containsInjection`/`isValidBand` 安全清洗，与 `safeParseWord` 同源规则）、Web Speech 原生语音朗读。
  - 已落地 UI：导入面板（`ImportPanel`，CSV/Anki 解析 + 接受/拒绝明细）、`App` 内「导入词表」弹窗（`AnimatePresence` 模态，`role="dialog"`/`aria-modal`，背景点击 / Esc 关闭）、react-window v2 虚拟滚动词库（`List`，`rowComponent={WordRow}`）、`Flashcard` 的 framer-motion 翻转动画（`motion.div` + `useReducedMotion`）。`framer-motion`/`react-window` 均已在源码中真实使用，`npm run build` 绿（449 模块 / gzip 150.67 kB）、`npx vitest run` 35 passed / 5 files。
- **M4**（已完成）：会话制循环复习 + 学习日历
  - **每轮批量自选 10/30/50/100**：切换档位触发重新组会话（`App` 内 `size-selector`，默认 10）。
  - **循环复习**：答 `again`/`hard` 的卡回收进池下轮重洗（遵循 FSRS/艾宾浩斯间隔重复强化），答 `good`/`easy` 离开；池空即本轮完成。由 `SessionService` 纯逻辑编排、单测覆盖。
  - **学习日历**：右栏 `Calendar` 当月网格，背过词当天圆点变紫（`.is-studied`，`var(--accent)`），底部「本月已背 N 天」；打卡当天即写入 `studyLog`（IndexedDB 持久化），同一会话内即时变紫。`npm run build` 绿（**452 模块** / gzip **152.06 kB**）、`npx vitest run` **61 passed / 7 files**。
- **M5**（已完成）：词表大幅扩容 + 复习模式
  - **词表扩容至 210+ 词**：在 M2 的 53 词基础上新增 157 词，Band 5/6/7/8 现分别为 **51 / 51 / 72 / 36**（Band 7 达 72），原种子全部保留；并新增 `src/data/words.test.ts` 守住总词数与各 band 下限。
  - **复习模式「仅到期 / 全部本档」**：默认「仅到期」（旧行为，只练到期词）；切到「全部本档」可把整档词（含已排期到未来的）重新拉出来学，**学完本档不再空档卡死**——空档时引导「复习全部本档」按钮一键重学。`npm run build` 绿（**452 模块** / gzip **167.74 kB**）、`npx vitest run` **67 passed / 8 files**。
- **M6**：CI（lint+test+build）、打包脚本、一键启动
- **M7**：文档补全（README/CHANGELOG/Design Rationale）
