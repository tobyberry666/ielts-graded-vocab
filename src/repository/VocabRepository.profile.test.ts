// 多档案（本地账号）存储层测试。
// 用 fake-indexeddb 模拟浏览器 IndexedDB，覆盖：v3→v4 升级迁移、跨档案隔离、
// 档案 CRUD、删除级联、学习日历隔离。
import 'fake-indexeddb/auto';
import { describe, it, expect, afterEach } from 'vitest';
import { VocabRepository, DEFAULT_PROFILE_ID } from './VocabRepository';
import { SrsService } from '../services/SrsService';
import type { Card } from 'ts-fsrs';

const DB_NAME = 'ielts-graded-vocab';

// 用原始 IDB API 造一个「升级前的老客户端」v3 结构库，并写入无 profileId 的旧数据，
// 用于验证 v4 升级能把它们归入默认档案、进度不丢。
async function seedV3Db(): Promise<void> {
  const req = indexedDB.open(DB_NAME, 3);
  await new Promise<void>((resolve, reject) => {
    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore('words', { keyPath: 'id' });
      db.createObjectStore('cards', { keyPath: 'wordId' });
      db.createObjectStore('studyLog', { keyPath: 'date' });
      db.createObjectStore('meta', { keyPath: 'key' });
    };
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  const db = req.result;
  const oldCard: Card = {
    due: new Date(),
    stability: 2.5,
    difficulty: 5,
    elapsed_days: 1,
    scheduled_days: 2,
    reps: 3,
    lapses: 0,
    state: 1,
    last_review: new Date(),
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(['cards', 'studyLog'], 'readwrite');
    tx.objectStore('cards').put({ wordId: 'w1', cardJson: JSON.stringify(oldCard) });
    tx.objectStore('studyLog').put({ date: '2026-07-01' });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

let repo: VocabRepository | null = null;

afterEach(async () => {
  if (repo) {
    repo.close();
    repo = null;
  }
  // 清库，保证用例间隔离。
  await new Promise<void>((resolve) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
});

describe('VocabRepository 多档案', () => {
  it('v3→v4 升级：旧卡/旧日志被归入默认档案，进度不丢', async () => {
    await seedV3Db();
    repo = new VocabRepository();
    const id = await repo.ensureDefaultProfile(); // 触发 DB 打开 + 升级
    expect(id).toBe(DEFAULT_PROFILE_ID);

    const card = await repo.loadCard('w1');
    expect(card).not.toBeNull();
    expect(card?.reps).toBe(3);

    const days = await repo.getStudiedDays();
    expect(days).toContain('2026-07-01');
  });

  it('不同档案的同一单词卡互相隔离', async () => {
    repo = new VocabRepository();
    await repo.ensureDefaultProfile();
    const srs = new SrsService();
    const now = Date.now();

    repo.setActiveProfile(DEFAULT_PROFILE_ID);
    await repo.saveCard('w1', srs.newCard(now)); // A：立即到期

    const b = await repo.createProfile('Tom');
    repo.setActiveProfile(b.id);
    const futureCard = srs.grade(srs.newCard(now), 'easy', now); // B：未来到期
    await repo.saveCard('w1', futureCard);

    repo.setActiveProfile(DEFAULT_PROFILE_ID);
    const aCard = await repo.loadCard('w1');
    expect(aCard).not.toBeNull();
    expect(aCard!.due.getTime()).toBeLessThanOrEqual(now + 1000);

    repo.setActiveProfile(b.id);
    const bCard = await repo.loadCard('w1');
    expect(bCard).not.toBeNull();
    expect(bCard!.due.getTime()).toBeGreaterThan(now + 1000);
  });

  it('学习日历按档案隔离', async () => {
    repo = new VocabRepository();
    await repo.ensureDefaultProfile();

    repo.setActiveProfile(DEFAULT_PROFILE_ID);
    await repo.recordStudyDay('2026-07-01');

    const b = await repo.createProfile('Tom');
    repo.setActiveProfile(b.id);
    await repo.recordStudyDay('2026-07-02');

    repo.setActiveProfile(DEFAULT_PROFILE_ID);
    expect(await repo.getStudiedDays()).toEqual(['2026-07-01']);

    repo.setActiveProfile(b.id);
    expect(await repo.getStudiedDays()).toEqual(['2026-07-02']);
  });

  it('档案 CRUD：创建 / 列出 / 重命名 / 删除', async () => {
    repo = new VocabRepository();
    const first = await repo.ensureDefaultProfile();
    expect(first).toBe(DEFAULT_PROFILE_ID);
    expect(await repo.listProfiles()).toHaveLength(1);

    const p = await repo.createProfile('Tom');
    expect(p.name).toBe('Tom');
    expect(await repo.listProfiles()).toHaveLength(2);

    await repo.renameProfile(p.id, 'Tommy');
    expect((await repo.listProfiles()).find((x) => x.id === p.id)?.name).toBe('Tommy');

    await repo.deleteProfile(p.id);
    expect(await repo.listProfiles()).toHaveLength(1);
  });

  it('删除档案级联清除其 FSRS 进度与学习记录', async () => {
    repo = new VocabRepository();
    await repo.ensureDefaultProfile();
    const srs = new SrsService();

    const b = await repo.createProfile('Tom');
    repo.setActiveProfile(b.id);
    await repo.saveCard('w1', srs.newCard(Date.now()));
    await repo.recordStudyDay('2026-07-05');

    repo.setActiveProfile(DEFAULT_PROFILE_ID);
    await repo.deleteProfile(b.id);

    repo.setActiveProfile(b.id); // 档案已删，其卡应读不到
    expect(await repo.loadCard('w1')).toBeNull();
  });

  it('ensureDefaultProfile 恢复上次激活的档案', async () => {
    repo = new VocabRepository();
    await repo.ensureDefaultProfile();
    const b = await repo.createProfile('Tom');
    repo.setActiveProfile(b.id); // 持久化到 meta

    repo.close();
    repo = new VocabRepository(); // 重新打开（模拟刷新）
    const restored = await repo.ensureDefaultProfile();
    expect(restored).toBe(b.id);
  });
});

describe('VocabRepository 已掌握（会啦）', () => {
  it('markMastered 后 getMasteredIds 可见，deleteCard 清除 FSRS 卡', async () => {
    repo = new VocabRepository();
    await repo.ensureDefaultProfile();
    const srs = new SrsService();

    await repo.saveCard('w1', srs.newCard(Date.now()));
    expect(await repo.getMasteredIds()).toEqual(new Set());

    await repo.markMastered('w1');
    expect([...await repo.getMasteredIds()]).toEqual(['w1']);

    // 标记掌握后删卡，从此不应再被调度。
    await repo.deleteCard('w1');
    expect(await repo.loadCard('w1')).toBeNull();
  });

  it('已掌握集合按档案隔离', async () => {
    repo = new VocabRepository();
    await repo.ensureDefaultProfile();

    repo.setActiveProfile(DEFAULT_PROFILE_ID);
    await repo.markMastered('w1');

    const b = await repo.createProfile('Tom');
    repo.setActiveProfile(b.id);
    expect(await repo.getMasteredIds()).toEqual(new Set());

    repo.setActiveProfile(DEFAULT_PROFILE_ID);
    expect([...await repo.getMasteredIds()]).toEqual(['w1']);
  });

  it('resetMastered 清空当前档案已掌握集合', async () => {
    repo = new VocabRepository();
    await repo.ensureDefaultProfile();
    await repo.markMastered('w1');
    await repo.markMastered('w2');
    expect((await repo.getMasteredIds()).size).toBe(2);

    await repo.resetMastered();
    expect(await repo.getMasteredIds()).toEqual(new Set());
  });

  it('删除档案级联清除其已掌握集合', async () => {
    repo = new VocabRepository();
    await repo.ensureDefaultProfile();
    const b = await repo.createProfile('Tom');
    repo.setActiveProfile(b.id);
    await repo.markMastered('w1');

    repo.setActiveProfile(DEFAULT_PROFILE_ID);
    await repo.deleteProfile(b.id);

    repo.setActiveProfile(b.id);
    expect(await repo.getMasteredIds()).toEqual(new Set());
  });
});
