// Repository 层：离线优先的 IndexedDB 封装（基于 Dexie）。
// 对 Service 屏蔽存储细节 —— 这一层只负责「词表数据」与「FSRS 卡调度状态」的持久化，
// 不碰任何 UI / DOM。M1 直接落地 IndexedDB（替代 M0 的 localStorage 方案），
// 以支撑后续 1000-2000 词规模下的离线学习与多设备导出。
//
// 注意：ts-fsrs 的 `Card` 里 `due` / `last_review` 是 Date 对象，JSON 序列化后会变成字符串，
// 因此写入时按 JSON 字符串存、读出时必须把这两个字段 revive 回 Date，否则 `card.due <= now`
// 这类比较会失效（字符串与数字比较结果不可预期）。这是本层的关键正确性保障。
import Dexie, { type Table } from 'dexie';
import type { Card } from 'ts-fsrs';
import type { VocabEntry } from '../data/words';

// ---- 对外契约（接口先定义，便于 Service 依赖抽象而非具体实现）----
export interface VocabRepositoryPort {
  /** merge: insert missing seed words without overwriting existing ones. */
  seedIfEmpty(words: VocabEntry[]): Promise<void>;
  /** 版本化刷新：插入缺失词，并把已存在的「内置种子词」用最新富文本覆盖更新；
   *  用户导入的词（id 不在种子集合内）与 FSRS 进度（cards 表）一律不动。 */
  seedOrRefresh(words: VocabEntry[], version: string): Promise<void>;
  /** 取全部词（按存储顺序）。 */
  getAllWords(): Promise<VocabEntry[]>;
  /** 按 id 取单个词，不存在返回 undefined。 */
  getWord(id: string): Promise<VocabEntry | undefined>;
  /** 取某词的 FSRS 卡；读不到或损坏则返回 null（绝不影响主流程）。 */
  loadCard(wordId: string): Promise<Card | null>;
  /** 保存（覆盖）某词的 FSRS 卡。 */
  saveCard(wordId: string, card: Card): Promise<void>;
  /** 写入（覆盖）单条词；id 冲突时后者覆盖前者。 */
  putWord(word: VocabEntry): Promise<void>;
  /** 批量写入（覆盖）多条词；数组为空时为 no-op。 */
  bulkPutWords(words: VocabEntry[]): Promise<void>;
  /** 记录某天学习过（按日期主键 upsert，幂等）。 */
  recordStudyDay(dateStr: string): Promise<void>;
  /** 取所有已学习过的日期键（'YYYY-MM-DD'）列表。 */
  getStudiedDays(): Promise<string[]>;
}

// ---- 数据库表结构 ----
interface CardRow {
  wordId: string; // 主键
  cardJson: string; // FSRS Card 序列化后的 JSON
}

// 学习日历：每个学习过的日期一行，主键即日期键 'YYYY-MM-DD'，upsert 天然幂等。
interface StudyLogRow {
  date: string; // 主键：本地时区 'YYYY-MM-DD'
}

class VocabDB extends Dexie {
  words!: Table<VocabEntry, string>;
  cards!: Table<CardRow, string>;
  studyLog!: Table<StudyLogRow, string>;
  meta!: Table<{ key: string; value: string }, string>;

  constructor() {
    super('ielts-graded-vocab');
    this.version(1).stores({
      words: 'id', // 主键 id
      cards: 'wordId', // 主键 wordId（与 words.id 一一对应）
    });
    // v2：新增 studyLog 表记录学习日历；旧数据自动迁移，不丢。
    this.version(2).stores({
      words: 'id',
      cards: 'wordId',
      studyLog: 'date', // 主键 date
    });
    // v3：新增 meta 表，存种子版本号，支持「内置词随版本刷新」。
    this.version(3).stores({
      words: 'id',
      cards: 'wordId',
      studyLog: 'date',
      meta: 'key', // 主键 key
    });
  }
}

// ---- 序列化辅助：把任意来源（含损坏数据）安全转回 Date ----
function toDate(value: unknown): Date | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }
  const d = new Date(value as string | number);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

// 从反序列化后的普通对象重建一个合法的 FSRS Card；任何关键字段缺失/损坏都返回 null。
function reviveCard(raw: unknown): Card | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Record<string, unknown>;
  const due = toDate(c.due);
  if (!due) return null; // due 是必填且必须可解析，否则直接判损坏
  const lastReview = c.last_review == null ? undefined : toDate(c.last_review);
  return {
    due,
    stability: Number(c.stability),
    difficulty: Number(c.difficulty),
    elapsed_days: Number(c.elapsed_days),
    scheduled_days: Number(c.scheduled_days),
    reps: Number(c.reps),
    lapses: Number(c.lapses),
    // state 是 ts-fsrs 的数字枚举，原样回写即可。
    state: c.state as Card['state'],
    last_review: lastReview,
  };
}

export class VocabRepository implements VocabRepositoryPort {
  private db: VocabDB;

  constructor(db?: VocabDB) {
    // 允许注入（测试可传入 fake-indexeddb 的实例），默认自建。
    this.db = db ?? new VocabDB();
  }

  async seedIfEmpty(words: VocabEntry[]): Promise<void> {
    // merge 语义：只写入「当前库中缺失 id」的种子词；
    // 已存在（用户导入/已编辑过）的条目永不覆盖、永不删除。
    const existing = await this.db.words.toCollection().primaryKeys();
    const existingIds = new Set<string>(existing as string[]);
    const missing = words.filter((w) => !existingIds.has(w.id));
    if (missing.length > 0) {
      await this.db.words.bulkPut(missing);
    }
  }

  async seedOrRefresh(words: VocabEntry[], version: string): Promise<void> {
    // 版本一致则跳过，避免每次启动都重写 4500+ 词。
    const meta = await this.db.meta.get('seedVersion');
    if (meta && meta.value === version) return;

    const seedIds = new Set(words.map((w) => w.id));
    const seedMap = new Map(words.map((w) => [w.id, w]));
    const existing = await this.db.words.toArray();
    const existingIds = new Set(existing.map((w) => w.id));

    // 1) 缺失的内置词：插入
    const missing = words.filter((w) => !existingIds.has(w.id));
    // 2) 已存在且属于内置种子（id 在种子集合内）的词：用最新富文本覆盖更新
    const toRefresh = existing
      .filter((w) => seedIds.has(w.id))
      .map((w) => seedMap.get(w.id)!);
    // 注意：用户导入的词（id 不在 seedIds 内）与 cards 表里的 FSRS 进度均不触碰。

    const toPut = [...missing, ...toRefresh];
    if (toPut.length > 0) {
      await this.db.words.bulkPut(toPut);
    }
    await this.db.meta.put({ key: 'seedVersion', value: version });
  }

  async getAllWords(): Promise<VocabEntry[]> {
    return this.db.words.toArray();
  }

  async getWord(id: string): Promise<VocabEntry | undefined> {
    return this.db.words.get(id);
  }

  async loadCard(wordId: string): Promise<Card | null> {
    try {
      const row = await this.db.cards.get(wordId);
      if (!row) return null;
      const card = reviveCard(JSON.parse(row.cardJson));
      return card ?? null;
    } catch {
      // 损坏的卡数据不应让主流程崩溃，降级为「无卡」。
      return null;
    }
  }

  async saveCard(wordId: string, card: Card): Promise<void> {
    await this.db.cards.put({ wordId, cardJson: JSON.stringify(card) });
  }

  async putWord(word: VocabEntry): Promise<void> {
    await this.db.words.put(word);
  }

  async bulkPutWords(words: VocabEntry[]): Promise<void> {
    if (words.length === 0) return; // no-op，避免对空数组触发无谓的写事务
    await this.db.words.bulkPut(words);
  }

  async recordStudyDay(dateStr: string): Promise<void> {
    // 按主键 upsert：同一天多次调用只保留一行，幂等。
    await this.db.studyLog.put({ date: dateStr });
  }

  async getStudiedDays(): Promise<string[]> {
    return (await this.db.studyLog.toArray()).map((r) => r.date);
  }
}
