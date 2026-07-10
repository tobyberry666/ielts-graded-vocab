// Repository 层：离线优先的 IndexedDB 封装（基于 Dexie）。
// 对 Service 屏蔽存储细节 —— 这一层只负责「词表数据」与「FSRS 卡调度状态」的持久化，
// 不碰任何 UI / DOM。M1 直接落地 IndexedDB（替代 M0 的 localStorage 方案），
// 以支撑后续 1000-2000 词规模下的离线学习与多设备导出。
//
// 注意：ts-fsrs 的 `Card` 里 `due` / `last_review` 是 Date 对象，JSON 序列化后会变成字符串，
// 因此写入时按 JSON 字符串存、读出时必须把这两个字段 revive 回 Date，否则 `card.due <= now`
// 这类比较会失效（字符串与数字比较结果不可预期）。这是本层的关键正确性保障。
//
// 多档案（本地账号）设计：
//   - `words` / `meta` 为全局共享（所有人学同一套词、同一份种子版本）。
//   - `cards`（FSRS 进度）与 `studyLog`（学习日历）按 `profileId` 隔离：
//       * 复合主键 [profileId+wordId] / [profileId+date]，天然保证跨档案互不串台。
//       * 仓库内部持有 `activeProfileId`，所有卡/日志读写自动作用域到当前激活档案，
//         上层（WordService / App）调用签名不变，零侵入。
//   - v3→v4 升级：把历史遗留的「无 profileId」旧卡/旧日志归入默认档案，杜绝进度丢失。
import Dexie, { type Table } from 'dexie';
import type { Card } from 'ts-fsrs';
import type { VocabEntry } from '../data/words';

// ---- 档案（多用户本地隔离）----
export interface Profile {
  id: string;
  name: string;
  createdAt: number;
}

/** 所有历史数据 + 首启自动创建的兜底档案 id。 */
export const DEFAULT_PROFILE_ID = 'default';
export const DEFAULT_PROFILE_NAME = '我的档案';

/** IndexedDB 库名（单一来源，避免硬编码散落）。 */
const DB_NAME = 'ielts-graded-vocab';

/** 复合主键分隔符：profileId◄┐wordId / profileId◄┐day。用控制字符，绝不会出现在词或日期里。 */
const PROFILE_KEY_SEP = '\u0001';
function profileKey(profileId: string, localKey: string): string {
  return profileId + PROFILE_KEY_SEP + localKey;
}

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
  /** 取当前激活档案下某词的 FSRS 卡；读不到或损坏则返回 null（绝不影响主流程）。 */
  loadCard(wordId: string): Promise<Card | null>;
  /** 保存（覆盖）当前激活档案下某词的 FSRS 卡。 */
  saveCard(wordId: string, card: Card): Promise<void>;
  /** 写入（覆盖）单条词；id 冲突时后者覆盖前者。 */
  putWord(word: VocabEntry): Promise<void>;
  /** 批量写入（覆盖）多条词；数组为空时为 no-op。 */
  bulkPutWords(words: VocabEntry[]): Promise<void>;
  /** 记录当前激活档案在某天学习过（按日期主键 upsert，幂等）。 */
  recordStudyDay(dateStr: string): Promise<void>;
  /** 取当前激活档案所有已学习过的日期键（'YYYY-MM-DD'）列表。 */
  getStudiedDays(): Promise<string[]>;
  // ---- 多档案（本地账号）----
  /** 列出全部档案。 */
  listProfiles(): Promise<Profile[]>;
  /** 新建档案（名称任意），返回新建档案。 */
  createProfile(name: string): Promise<Profile>;
  /** 重命名档案。 */
  renameProfile(id: string, name: string): Promise<void>;
  /** 删除档案，并级联清除其 cards / studyLog 进度。 */
  deleteProfile(id: string): Promise<void>;
  /** 首启引导：若无任何档案则创建默认档案，并恢复上次激活的档案；返回当前激活 id。 */
  ensureDefaultProfile(): Promise<string>;
  /** 切换当前激活档案（同步，写入内存并异步落 meta）。 */
  setActiveProfile(id: string): void;
  /** 读取当前激活档案 id。 */
  getActiveProfileId(): string;
}

// ---- 数据库表结构 ----
interface CardRow {
  wordId: string; // 主键 = profileId + SEP + wordId（复合信息编码进主键值，避免换主键导致升级失败）
  profileId: string; // 二级索引，便于按档案查询
  cardJson: string; // FSRS Card 序列化后的 JSON
}

// 学习日历：每个学习过的日期一行。主键 = profileId + SEP + day；day 单独存纯日期供展示。
interface StudyLogRow {
  date: string; // 主键 = profileId + SEP + day
  profileId: string; // 二级索引
  day: string; // 纯 'YYYY-MM-DD'，供日历渲染
}

interface ProfileRow {
  id: string;
  name: string;
  createdAt: number;
}

class VocabDB extends Dexie {
  words!: Table<VocabEntry, string>;
  cards!: Table<CardRow, string>;
  studyLog!: Table<StudyLogRow, string>;
  meta!: Table<{ key: string; value: string }, string>;
  profiles!: Table<ProfileRow, string>;

  constructor() {
    super(DB_NAME);
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
    // v4：多档案。仅新增 profiles 表；cards/studyLog 主键属性名与 v3 完全一致，
    //     Dexie 不重建它们。历史数据迁移不在升级回调里做（见 readLegacyV3Data）。
    this.version(4).stores({
      words: 'id',
      cards: 'wordId',
      studyLog: 'date',
      meta: 'key',
      profiles: 'id', // 主键 id
    });
  }
}

// ---- 升级前抢救旧数据 ----
// 背景：fake-indexeddb 在 v3→v4 升级时会重建 studyLog 表导致旧数据丢失（cards 不会），
// 真实浏览器虽不会，但为让迁移在测试与生产都万无一失，改为：升级前用原生 IDB 以 v3 打开读出
// 旧 cards/studyLog，删掉旧库，让 Dexie 以全新 v4 重建后再把数据写回（归入默认档案）。
function idbGetAll(store: IDBObjectStore): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as unknown[]);
    req.onerror = () => reject(req.error);
  });
}

function idbDelete(dbName: string): Promise<void> {
  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(dbName);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
}

/**
 * 若本地库仍停留在 v3（老客户端），用原生 IDB 以 v3 打开读出 cards/studyLog 旧数据；
 * 随后删除旧库，让 Dexie 以全新 v4 重建（旧数据已在内存，不丢）。返回 null 表示无需迁移
 * （已是 v4+，或库不存在）。
 */
async function readLegacyV3Data(
  dbName: string,
): Promise<{ cards: any[]; logs: any[] } | null> {
  const openReq = indexedDB.open(dbName, 3);
  const db = await new Promise<IDBDatabase | null>((resolve) => {
    openReq.onsuccess = () => resolve(openReq.result);
    openReq.onerror = () => resolve(null); // 多为 VersionError：库已是 v4+
    openReq.onupgradeneeded = () => {
      // 库不存在 → 以 v3 新建（空），无老数据可抢救
      openReq.result.close();
      resolve(null);
    };
    openReq.onblocked = () => resolve(null);
  });
  if (!db) return null;

  const tx = db.transaction(['cards', 'studyLog'], 'readonly');
  const cards = await idbGetAll(tx.objectStore('cards'));
  const logs = await idbGetAll(tx.objectStore('studyLog'));
  db.close();

  // 删除旧库，让 Dexie 以全新 v4 重建（老数据已在内存中）
  await idbDelete(dbName);
  return { cards, logs };
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
  private activeProfileId: string = DEFAULT_PROFILE_ID;

  constructor(db?: VocabDB) {
    // 允许注入（测试可传入 fake-indexeddb 的实例），默认自建。
    this.db = db ?? new VocabDB();
  }

  // ---------- 多档案（本地账号）----------

  async listProfiles(): Promise<Profile[]> {
    return (await this.db.profiles.toArray()).map((p) => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
    }));
  }

  async createProfile(name: string): Promise<Profile> {
    const profile: ProfileRow = {
      id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || DEFAULT_PROFILE_NAME,
      createdAt: Date.now(),
    };
    await this.db.profiles.add(profile);
    return { id: profile.id, name: profile.name, createdAt: profile.createdAt };
  }

  async renameProfile(id: string, name: string): Promise<void> {
    await this.db.profiles.update(id, { name: name.trim() || DEFAULT_PROFILE_NAME });
  }

  async deleteProfile(id: string): Promise<void> {
    await this.db.profiles.delete(id);
    // 级联清除该档案的 FSRS 进度与学习日历，避免孤儿数据（无 profileId 索引，按主键批量删）。
    const cardKeys = (await this.db.cards.toArray())
      .filter((r) => r.profileId === id)
      .map((r) => r.wordId);
    if (cardKeys.length) await this.db.cards.bulkDelete(cardKeys);
    const logKeys = (await this.db.studyLog.toArray())
      .filter((r) => r.profileId === id)
      .map((r) => r.date);
    if (logKeys.length) await this.db.studyLog.bulkDelete(logKeys);
    // 若删掉的是当前激活档案，回退到默认档案。
    if (this.activeProfileId === id) {
      this.setActiveProfile(DEFAULT_PROFILE_ID);
    }
  }

  async ensureDefaultProfile(): Promise<string> {
    // 升级前抢救 v3 旧数据（若有）。readLegacyV3Data 会先以 v3 打开读出、再删库，
    // 使下面的 Dexie 操作以「全新 v4」重建，旧进度不丢。
    const legacy = await readLegacyV3Data(DB_NAME);

    const existing = await this.db.profiles.toArray();
    if (existing.length === 0) {
      await this.db.profiles.add({
        id: DEFAULT_PROFILE_ID,
        name: DEFAULT_PROFILE_NAME,
        createdAt: Date.now(),
      });
    }

    // 把抢救出的旧数据写回，全部归入默认档案（重新编码主键里的 profileId）。
    if (legacy) {
      if (legacy.cards.length) {
        await this.db.cards.bulkPut(
          legacy.cards.map((c: any) => ({
            wordId: profileKey(DEFAULT_PROFILE_ID, c.wordId),
            profileId: DEFAULT_PROFILE_ID,
            cardJson: c.cardJson,
          })),
        );
      }
      if (legacy.logs.length) {
        await this.db.studyLog.bulkPut(
          legacy.logs.map((l: any) => ({
            date: profileKey(DEFAULT_PROFILE_ID, l.date),
            profileId: DEFAULT_PROFILE_ID,
            day: l.date,
          })),
        );
      }
    }

    // 恢复上次激活的档案（若存在），否则用默认档案。
    const meta = await this.db.meta.get('activeProfile');
    const ids = new Set((await this.db.profiles.toArray()).map((p) => p.id));
    const active = meta?.value && ids.has(meta.value) ? meta.value : DEFAULT_PROFILE_ID;
    this.activeProfileId = active;
    return active;
  }

  setActiveProfile(id: string): void {
    this.activeProfileId = id;
    // 落 meta（不阻塞主流程；失败静默忽略）。
    this.db.meta.put({ key: 'activeProfile', value: id }).catch(() => {});
  }

  getActiveProfileId(): string {
    return this.activeProfileId;
  }

  /** 关闭底层数据库连接（测试清理用，不影响业务）。 */
  close(): void {
    this.db.close();
  }

  // ---------- 词表（全局）----------

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

  // ---------- 卡（当前激活档案作用域）----------

  async loadCard(wordId: string): Promise<Card | null> {
    try {
      const row = await this.db.cards.get(profileKey(this.activeProfileId, wordId));
      if (!row) return null;
      const card = reviveCard(JSON.parse(row.cardJson));
      return card ?? null;
    } catch {
      // 损坏的卡数据不应让主流程崩溃，降级为「无卡」。
      return null;
    }
  }

  async saveCard(wordId: string, card: Card): Promise<void> {
    await this.db.cards.put({
      wordId: profileKey(this.activeProfileId, wordId),
      profileId: this.activeProfileId,
      cardJson: JSON.stringify(card),
    });
  }

  async putWord(word: VocabEntry): Promise<void> {
    await this.db.words.put(word);
  }

  async bulkPutWords(words: VocabEntry[]): Promise<void> {
    if (words.length === 0) return; // no-op，避免对空数组触发无谓的写事务
    await this.db.words.bulkPut(words);
  }

  // ---------- 学习日历（当前激活档案作用域）----------

  async recordStudyDay(dateStr: string): Promise<void> {
    // 按主键 upsert：同一天多次调用只保留一行，幂等。主键里编码 profileId 以隔离档案。
    await this.db.studyLog.put({
      date: profileKey(this.activeProfileId, dateStr),
      profileId: this.activeProfileId,
      day: dateStr,
    });
  }

  async getStudiedDays(): Promise<string[]> {
    // 无 profileId 二级索引（规避升级重建表丢数据），改为全表过滤；学习日历规模很小，无性能问题。
    const rows = (await this.db.studyLog.toArray()).filter(
      (r) => r.profileId === this.activeProfileId,
    );
    return rows.map((r) => r.day);
  }
}
