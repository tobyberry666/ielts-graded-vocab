import { describe, it, expect } from 'vitest';
import { createEmptyCard, type Card } from 'ts-fsrs';
import type { VocabEntry } from '../data/words';
import {
  createSession,
  currentCard,
  grade,
  dismissCurrent,
  reviewRound,
  nextRound,
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

// 确定性构造会话状态（绕过 createSession 的随机洗牌），便于对 grade/reviewRound/nextRound
// 做精确断言；涉及内部重洗的结果仍只断言长度/集合成员，不假设精确顺序。
function makeSession(
  queueIds: string[],
  poolIds: string[],
  size: number,
  extra: Partial<SessionState> = {},
): SessionState {
  return {
    size,
    queue: makeCards(queueIds),
    pool: makeCards(poolIds),
    batchNumber: 1,
    studiedTotal: 0,
    initialCount: queueIds.length + poolIds.length,
    completed: false,
    roundComplete: false,
    roundProcessed: 0,
    roundCards: [],
    ...extra,
  };
}

// 反复对当前卡打分，直到会话完成；遇到「本轮完成」暂停点时自动 nextRound 推进。
function driveUntilDone(s: SessionState, g: 'good'): SessionState {
  let cur = s;
  let guard = 0;
  while (!cur.completed && guard < 10000) {
    if (cur.roundComplete) cur = nextRound(cur);
    else cur = grade(cur, g);
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
    // 逐张 good，遇到「一轮完成」暂停点就 nextRound 推进，直到完成
    let guard = 0;
    while (!s.completed && guard < 100) {
      if (s.roundComplete) s = nextRound(s);
      else s = grade(s, 'good');
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
    s = grade(s, 'good'); // 背完另一张，本轮结束 → 暂停等选择
    expect(s.roundComplete).toBe(true);
    expect(s.queue).toEqual([]);
    expect(idsOf(s.pool)).toEqual([firstId]);
    s = nextRound(s); // 用户选「下一轮」
    expect(s.batchNumber).toBe(2); // 进入下一批
    expect(idsOf(s.queue)).toContain(firstId); // 第一张在下一批重现
  });

  it('一轮（size 张）背完后暂停，nextRound 重组下一批为剩余 pool 的重洗子集', () => {
    const cards = makeCards(['a', 'b', 'c', 'd']);
    const s0 = createSession(cards, 2);
    expect(s0.queue).toHaveLength(2);
    expect(s0.pool).toHaveLength(2);
    const batch1 = idsOf(s0.queue);
    // 把整批 good 掉 → 本轮结束、暂停
    let s = grade(grade(s0, 'good'), 'good');
    expect(s.roundComplete).toBe(true);
    expect(s.queue).toEqual([]);
    // 用户选「下一轮」
    s = nextRound(s);
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
      if (s.roundComplete) s = nextRound(s);
      else {
        s = grade(s, 'good');
        grades++;
      }
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

describe('dismissCurrent（会啦 / 已掌握）', () => {
  // 反复 dismiss 直到会话完成；遇到「本轮完成」暂停点时自动 nextRound 推进。
  function driveUntilDoneDismiss(s: SessionState): SessionState {
    let cur = s;
    let guard = 0;
    while (!cur.completed && guard < 10000) {
      if (cur.roundComplete) cur = nextRound(cur);
      else cur = dismissCurrent(cur);
      guard++;
    }
    return cur;
  }

  it('移除队首、studiedTotal+1，且该卡彻底离开会话（不进 pool）', () => {
    const s0 = createSession(makeCards(['a', 'b', 'c']), 1); // 每批 1 张
    const dismissedId = currentCard(s0)!.word.id; // 当前队首（随机洗牌，不假设具体是谁）
    const s = dismissCurrent(s0);
    // 被移除的卡彻底离开会话（既不在队列也不在剩余池）
    const remaining = [...idsOf(s.queue), ...idsOf(s.pool)];
    expect(remaining).not.toContain(dismissedId);
    expect(s.studiedTotal).toBe(1);
  });

  it('池空时全部 dismiss 后 completed=true，studiedTotal=卡数', () => {
    const s = driveUntilDoneDismiss(createSession(makeCards(['a', 'b', 'c']), 2));
    expect(s.completed).toBe(true);
    expect(s.studiedTotal).toBe(3);
    expect(s.queue).toEqual([]);
    expect(s.pool).toEqual([]);
  });

  it('不可变：入参不被修改', () => {
    const s = createSession(makeCards(['a', 'b']), 2);
    const snapshot = JSON.stringify(s);
    dismissCurrent(s);
    expect(JSON.stringify(s)).toBe(snapshot);
  });

  it('空/completed 时 no-op（直接返回同一引用）', () => {
    const s = { ...createSession([], 1), completed: true };
    expect(dismissCurrent(s)).toBe(s);
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
    // 确定性状态：队列 [a,b]、pool 空，一批 2 张（恰等于卡数）。
    let s = makeSession(['a', 'b'], [], 2);
    // 第一批：a good、b again（b 回 pool）
    s = grade(s, 'good'); // 背 a，队列剩 [b]
    s = grade(s, 'again'); // 背 b，b 回 pool → 本轮结束、暂停
    expect(s.roundComplete).toBe(true);
    s = nextRound(s); // 用户选「下一轮」
    expect(s.batchNumber).toBe(2);
    expect(idsOf(s.queue)).toEqual(['b']); // 下一批只有 b（pool 仅 b 一张）
    s = grade(s, 'good'); // 背 b 第二次
    expect(s.completed).toBe(true);
    expect(s.studiedTotal).toBe(3); // a 1 + b 2
  });
});

describe('一轮完成暂停 + 复习/下一轮选择', () => {
  it('一轮（size 张）处理完、pool 有余 → roundComplete=true 且 queue 空、pool 保留', () => {
    // 确定性状态：本轮队列 [a,b,c]、pool [d,e]，一批 3 张。
    const s0 = makeSession(['a', 'b', 'c'], ['d', 'e'], 3);
    // 背完本轮 3 张（good）
    let s = grade(grade(grade(s0, 'good'), 'good'), 'good');
    expect(s.roundComplete).toBe(true);
    expect(s.queue).toEqual([]);
    expect(idsOf(s.pool).sort()).toEqual(['d', 'e']); // 剩余 2 张仍在 pool
    expect(s.roundProcessed).toBe(3);
    expect(s.roundCards).toHaveLength(3); // 本轮处理的卡被记录
    expect(s.completed).toBe(false);
  });

  it('暂停状态下再 grade / dismiss 为 no-op（必须用户显式选择）', () => {
    const cards = makeCards(['a', 'b', 'c', 'd']);
    const s0 = createSession(cards, 2);
    let s = grade(grade(s0, 'good'), 'good'); // 本轮 2 张背完 → 暂停
    expect(s.roundComplete).toBe(true);
    const afterGrade = grade(s, 'good');
    const afterDismiss = dismissCurrent(s);
    expect(afterGrade).toBe(s); // 不变
    expect(afterDismiss).toBe(s); // 不变
  });

  it('nextRound 解暂停、重置本轮计数、batchNumber+1，并从 pool 重组队列', () => {
    const cards = makeCards(['a', 'b', 'c', 'd']);
    const s0 = createSession(cards, 2);
    let s = grade(grade(s0, 'good'), 'good'); // 暂停
    const before = s;
    s = nextRound(s);
    expect(s.roundComplete).toBe(false);
    expect(s.roundProcessed).toBe(0);
    expect(s.roundCards).toEqual([]);
    expect(s.batchNumber).toBe(before.batchNumber + 1);
    expect(s.queue).toHaveLength(2); // pool 4-2=2 张重组
    expect(s.pool).toEqual([]);
  });

  it('reviewRound 只重排未会啦的词；全部会啦则直接 nextRound', () => {
    // 确定性状态：本轮队列 [a,b]、pool [c,d]，一批 2 张。
    const s0 = makeSession(['a', 'b'], ['c', 'd'], 2);
    // 本轮处理了 a、b（roundCards 含 a、b），c、d 在 pool
    let s = grade(grade(s0, 'good'), 'good'); // 暂停，roundCards=[a,b]
    // 假设 a 已会啦，b 未会啦
    const reviewed = reviewRound(s, ['b']);
    expect(reviewed.queue).toHaveLength(1);
    expect(reviewed.queue[0].word.id).toBe('b');
    expect(reviewed.roundComplete).toBe(false);
    expect(idsOf(reviewed.pool).sort()).toEqual(['c', 'd']); // pool 不动

    // 全部会啦 → 直接跳下一轮
    const skipped = reviewRound(s, []);
    expect(skipped.batchNumber).toBe(s.batchNumber + 1);
    expect(skipped.queue).toHaveLength(2); // 来自 pool 重组
  });

  it('最后一轮背完（pool 空）→ completed=true，不再暂停', () => {
    const cards = makeCards(['a', 'b']);
    const s0 = createSession(cards, 2); // 一轮即背完，pool 空
    const s = grade(grade(s0, 'good'), 'good');
    expect(s.roundComplete).toBe(false);
    expect(s.completed).toBe(true);
  });
});
