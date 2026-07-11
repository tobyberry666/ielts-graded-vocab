// Service 层：学习会话编排（纯逻辑、可单测、不碰 UI / DOM / 存储）。
// 一次会话 = 把一批卡排成队列逐个背；答错('again')/困难('hard')的卡回收到 pool 重新洗牌，
// 形成艾宾浩斯式强化轮次。所有操作不可变：grade 返回新 state，绝不改动入参。
import type { VocabEntry } from '../data/words';
import type { Card } from 'ts-fsrs';
import type { Grade } from './SrsService';

export interface SessionCard {
  word: VocabEntry;
  card: Card;
}

export interface SessionState {
  size: number; // 每批次（一轮）的卡数（即 10/30/50 选择，对应「一轮」）
  queue: SessionCard[]; // 当前批次（队首=正在背的卡），背完一个 shift 一个
  pool: SessionCard[]; // 本会话仍需复习的剩余卡（'again'/'hard' 会回到这里重洗）
  batchNumber: number; // 第几轮（1-based）
  studiedTotal: number; // 累计已背张数（跨轮）
  initialCount: number; // 创建时的卡总数（用于进度分母）
  completed: boolean; // pool 与 queue 皆空时为 true（全部背完）
  roundComplete: boolean; // 一轮（size 张）处理完、pool 仍有余时暂停，等待用户选择「复习本轮回放」或「下一轮」
  roundProcessed: number; // 本轮已处理的卡数（grade + dismiss 都计，用于判定轮次边界）
  roundCards: SessionCard[]; // 本轮已处理的卡（供「复习本轮回放」过滤出未点「会啦」的词）
}

/** Fisher–Yates 洗牌，返回新数组（不改动入参）。导出便于测试确定性。 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 创建一次会话。size 会被 clamp 到 >=1 的整数；两次切片保证首批与 pool 顺序独立。 */
export function createSession(cards: SessionCard[], size: number): SessionState {
  const clampedSize = Math.max(1, Math.floor(size));
  const initialCount = cards.length;

  if (cards.length === 0) {
    return {
      size: clampedSize,
      queue: [],
      pool: [],
      batchNumber: 1,
      studiedTotal: 0,
      initialCount: 0,
      completed: false,
      roundComplete: false,
      roundProcessed: 0,
      roundCards: [],
    };
  }

  // 统一洗一次后切片：首批取前 size，剩余进 pool（单一洗牌结果切片，保证顺序独立）。
  const shuffled = shuffle(cards);
  const queue = shuffled.slice(0, clampedSize);
  const pool = shuffled.slice(clampedSize);

  return {
    size: clampedSize,
    queue,
    pool,
    batchNumber: 1,
    studiedTotal: 0,
    initialCount,
    completed: false,
    roundComplete: false,
    roundProcessed: 0,
    roundCards: [],
  };
}

/** 当前正在背的卡；completed 或空时返回 null。 */
export function currentCard(s: SessionState): SessionCard | null {
  return s.queue[0] ?? null;
}

/**
 * 对当前卡打分，返回新的 SessionState（不可变）。
 * - 'again'/'hard' → 卡回收进 pool，下一轮重洗强化。
 * - 'good'/'easy'  → 卡离开会话。
 * 每调一次 studiedTotal +1、roundProcessed +1、并把当前卡记入 roundCards。
 * 一轮（size 张）处理完、pool 仍有余时：置 roundComplete=true 暂停，等待用户选择
 * 「复习本轮回放」或「下一轮」——不再自动重洗，给背词者一个明确的决策点。
 */
export function grade(s: SessionState, g: Grade): SessionState {
  // no-op：已完成 / 已暂停在轮次选择点 / 无卡可背
  if (s.completed || s.roundComplete || s.queue.length === 0) return s;

  const [cur, ...rest] = s.queue;
  const stays = g === 'again' || g === 'hard'; // 答错/困难 → 留到 pool 下次重洗
  const newPool = stays ? [...s.pool, cur] : s.pool;
  const studiedTotal = s.studiedTotal + 1;
  const roundProcessed = s.roundProcessed + 1;
  const roundCards = [...s.roundCards, cur];

  // 同批次继续（队列还有）
  if (rest.length > 0) {
    return { ...s, queue: rest, pool: newPool, studiedTotal, roundProcessed, roundCards };
  }

  // 本轮（size 张）背完
  if (newPool.length > 0) {
    // 暂停：等待用户选「复习本轮回放」或「下一轮」，pool 保持不动。
    return {
      ...s,
      queue: [],
      pool: newPool,
      studiedTotal,
      roundProcessed,
      roundCards,
      roundComplete: true,
      completed: false,
    };
  }

  // pool 空 → 全部背完
  return { ...s, queue: [], pool: [], completed: true, studiedTotal, roundProcessed, roundCards };
}

/**
 * 「会啦 / 已掌握」出队：直接移除当前队首（不重排、不回收进 pool），studiedTotal +1、
 * roundProcessed +1、并把当前卡记入 roundCards。
 * 会话队列上的效果与 grade(...,'good') 一致（出队且计 1），区别仅在于语义上不涉及
 * FSRS 重排——FSRS 卡的实际删除由调用方在仓库层（deleteCard）处理。不可变。
 * 同样会在每轮 size 张处理完、pool 有余时暂停，给出轮次选择点。
 */
export function dismissCurrent(s: SessionState): SessionState {
  if (s.completed || s.roundComplete || s.queue.length === 0) return s;

  const [cur, ...rest] = s.queue;
  const studiedTotal = s.studiedTotal + 1;
  const roundProcessed = s.roundProcessed + 1;
  const roundCards = [...s.roundCards, cur];

  // 同批次继续
  if (rest.length > 0) {
    return { ...s, queue: rest, studiedTotal, roundProcessed, roundCards };
  }

  // 本轮（size 张）背完：pool 有余 → 暂停等用户选择；无余 → 全部背完
  if (s.pool.length > 0) {
    return {
      ...s,
      queue: [],
      pool: s.pool,
      studiedTotal,
      roundProcessed,
      roundCards,
      roundComplete: true,
      completed: false,
    };
  }

  return { ...s, queue: [], pool: [], completed: true, studiedTotal, roundProcessed, roundCards };
}

/**
 * 「复习本轮回放」：把本轮（roundCards）中未点「会啦」的词重新排成队列复习。
 * unMasteredIds 由调用方（已知 mastered 集合）过滤得到。若全部已会啦，则直接跳到下一轮。
 * 不可变；重置本轮计数。
 */
export function reviewRound(s: SessionState, unMasteredIds: string[]): SessionState {
  const ids = new Set(unMasteredIds);
  const cards = s.roundCards.filter((c) => ids.has(c.word.id));
  if (cards.length === 0) {
    return nextRound(s); // 全都会啦了，直接进入下一轮
  }
  return {
    ...s,
    queue: shuffle(cards),
    pool: s.pool,
    roundComplete: false,
    roundProcessed: 0,
    roundCards: [],
    completed: false,
  };
}

/**
 * 「下一轮」：从 pool 重洗出下一批（size 张）。重置本轮计数、解除暂停。
 * 若 pool 已空且队列也空 → 标记 completed（真正全部背完）。不可变。
 */
export function nextRound(s: SessionState): SessionState {
  // 仅在一轮完成（queue 已空、roundComplete=true）的选择点被调用，故 pool 为空即真结束。
  if (s.pool.length === 0) {
    return { ...s, completed: true, roundComplete: false };
  }
  const next = shuffle(s.pool);
  const queue = next.slice(0, s.size);
  const pool = next.slice(s.size);
  const completed = queue.length === 0 && pool.length === 0;
  return {
    ...s,
    queue,
    pool,
    batchNumber: s.batchNumber + 1,
    roundComplete: false,
    roundProcessed: 0,
    roundCards: [],
    completed,
  };
}
