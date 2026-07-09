import { describe, it, expect } from 'vitest';
import { createEmptyCard, type Card } from 'ts-fsrs';
import type { VocabEntry } from '../data/words';
import {
  createSession,
  currentCard,
  grade,
  shuffle,
  type SessionCard,
  type SessionState,
} from './SessionService';

// ---- 测试构造辅助 ----
function makeWord(id: string): VocabEntry {
  return {
    id,
    term: id,
    phonetic: '/x/',
    pos: 'n.',
    meaningZh: id,
    meaningEn: id,
    band: '5',
    collocations: [],
    example: 'e',
    exampleZh: '例',
  };
}
function makeCard(): Card {
  return createEmptyCard(new Date(0));
}
function makeCards(ids: string[]): SessionCard[] {
  return ids.map((id) => ({ word: makeWord(id), card: makeCard() }));
}
const idsOf = (cards: SessionCard[]): string[] => cards.map((c) => c.word.id);

// 反复对当前卡打分，直到会话完成；返回操作总次数。便于统计 studiedTotal。
function driveUntilDone(s: SessionState, g: 'good'): SessionState {
  let cur = s;
  let guard = 0;
  while (!cur.completed && guard < 10000) {
    cur = grade(cur, g);
    guard++;
  }
  return cur;
}

describe('createSession', () => {
  it('空数组 → queue 空、completed false', () => {
    const s = createSession([], 5);
    expect(s.queue).toEqual([]);
    expect(s.pool).toEqual([]);
    expect(s.completed).toBe(false);
    expect(s.initialCount).toBe(0);
    expect(s.batchNumber).toBe(1);
  });

  it('size > cards → queue 为全部卡、pool 空、batchNumber 1', () => {
    const cards = makeCards(['a', 'b', 'c']);
    const s = createSession(cards, 10);
    expect(s.queue).toHaveLength(3);
    expect(idsOf(s.queue).sort()).toEqual(['a', 'b', 'c']);
    expect(s.pool).toEqual([]);
    expect(s.batchNumber).toBe(1);
    expect(s.initialCount).toBe(3);
    expect(s.completed).toBe(false);
  });

  it('size 被 clamp 到 >=1 的整数', () => {
    const cards = makeCards(['a', 'b', 'c']);
    expect(createSession(cards, 0).size).toBe(1);
    expect(createSession(cards, 2.9).size).toBe(2);
  });
});

describe('grade 行为', () => {
  it('grade good 不会把卡放回 pool', () => {
    const cards = makeCards(['a', 'b', 'c']);
    let s = createSession(cards, 1); // 每批 1 张
    // 逐张 good，直到完成
    let guard = 0;
    while (!s.completed && guard < 100) {
      s = grade(s, 'good');
      guard++;
    }
    expect(s.completed).toBe(true);
    expect(s.studiedTotal).toBe(3);
  });

  it('grade again 保留卡，使其在下一批重现', () => {
    const cards = makeCards(['a', 'b']);
    let s = createSession(cards, 2); // 一批 2 张（恰等于卡数）→ 初始 pool 空
    // 取队首卡（顺序由洗牌决定，不假设具体是 a 还是 b）
    const first = currentCard(s)!;
    const firstId = first.word.id;
    const otherId = firstId === 'a' ? 'b' : 'a';
    s = grade(s, 'again'); // 对队首打 again → 它进入 pool，队首切到另一张
    expect(idsOf(s.queue)).toEqual([otherId]);
    expect(idsOf(s.pool)).toEqual([firstId]); // 第一张已回收进 pool
    s = grade(s, 'good'); // 背完另一张，批次结束，pool 重洗成下一批
    expect(s.batchNumber).toBe(2); // 进入下一批
    expect(idsOf(s.queue)).toContain(firstId); // 第一张在下一批重现
  });

  it('一批背完后，下一批是剩余 pool 的重洗子集，batchNumber 递增', () => {
    const cards = makeCards(['a', 'b', 'c', 'd']);
    const s0 = createSession(cards, 2);
    expect(s0.queue).toHaveLength(2);
    expect(s0.pool).toHaveLength(2);
    const batch1 = idsOf(s0.queue);
    // 把整批 good 掉
    let s = grade(grade(s0, 'good'), 'good');
    expect(s.batchNumber).toBe(2);
    // 下一批应是上一批 pool 的某种排列（集合一致）
    const batch2 = idsOf(s.queue);
    const union = [...batch1, ...batch2].sort();
    const poolIds = idsOf(s0.pool).slice().sort();
    // batch2 是 pool 的重洗：集合相等
    expect(batch2.sort()).toEqual(poolIds);
    expect(union).toEqual(['a', 'b', 'c', 'd']);
  });

  it('循环到 pool 空 → completed true；studiedTotal 等于累计打分次数', () => {
    const cards = makeCards(['a', 'b', 'c', 'd', 'e']);
    let s = createSession(cards, 2);
    let grades = 0;
    let guard = 0;
    while (!s.completed && guard < 1000) {
      s = grade(s, 'good');
      grades++;
      guard++;
    }
    expect(s.completed).toBe(true);
    expect(s.studiedTotal).toBe(grades);
    expect(s.studiedTotal).toBe(5);
    expect(s.queue).toEqual([]);
    expect(s.pool).toEqual([]);
  });

  it('grade 是不可变的（入参不被修改）', () => {
    const cards = makeCards(['a', 'b', 'c']);
    const s = createSession(cards, 2);
    const snapshot = JSON.stringify(s);
    const beforeQueue = s.queue;
    const beforePool = s.pool;
    const after = grade(s, 'good');
    expect(JSON.stringify(s)).toBe(snapshot); // 原 state 未变
    expect(s.queue).toBe(beforeQueue); // 数组未原地修改
    expect(s.pool).toBe(beforePool);
    expect(after).not.toBe(s); // 返回的是新对象
  });

  it('completed 时空 grade 为 no-op（直接返回同一引用或等价 state）', () => {
    const s = { ...createSession([], 1), completed: true };
    const r = grade(s, 'good');
    expect(r).toBe(s);
  });
});

describe('currentCard', () => {
  it('空队列返回 null', () => {
    const s = createSession([], 3);
    expect(currentCard(s)).toBeNull();
  });
  it('completed 时返回 null', () => {
    const s = { ...createSession(makeCards(['a']), 1), completed: true, queue: [] };
    expect(currentCard(s)).toBeNull();
  });
  it('正常返回队首', () => {
    const cards = makeCards(['a', 'b']);
    const s = createSession(cards, 2);
    expect(['a', 'b']).toContain(currentCard(s)?.word.id);
  });
});

describe('shuffle', () => {
  it('返回新数组且不丢失元素', () => {
    const arr = [1, 2, 3, 4, 5];
    const out = shuffle(arr);
    expect(out).not.toBe(arr);
    expect(out.slice().sort()).toEqual(arr);
  });
});

describe('driveUntilDone 集成', () => {
  it('全部 good 最终 completed 且 studiedTotal = 卡数', () => {
    const cards = makeCards(['a', 'b', 'c', 'd', 'e', 'f']);
    const s = driveUntilDone(createSession(cards, 2), 'good');
    expect(s.completed).toBe(true);
    expect(s.studiedTotal).toBe(6);
  });

  it('有 again 时该卡被多次复习，studiedTotal > 卡数', () => {
    const cards = makeCards(['a', 'b']);
    let s = createSession(cards, 2); // 一批背两张
    // 第一批：a good、b again（b 回 pool）
    s = grade(s, 'good'); // 背 a，队列剩 [b]
    s = grade(s, 'again'); // 背 b，b 回 pool → 重洗成下一批 [b]
    expect(s.batchNumber).toBe(2);
    s = grade(s, 'good'); // 背 b 第二次
    expect(s.completed).toBe(true);
    expect(s.studiedTotal).toBe(3); // a 1 + b 2
  });
});
