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
  size: number; // 每批次的卡数
  queue: SessionCard[]; // 当前批次（队首=正在背的卡），背完一个 shift 一个
  pool: SessionCard[]; // 本会话仍需复习的剩余卡（'again'/'hard' 会回到这里重洗）
  batchNumber: number; // 第几轮（1-based）
  studiedTotal: number; // 累计已背张数（跨轮）
  initialCount: number; // 创建时的卡总数（用于进度分母）
  completed: boolean; // pool 与 queue 皆空时为 true
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
 * 每调一次 studiedTotal +1。批次背完后若 pool 还有卡则重洗进下一批。
 */
export function grade(s: SessionState, g: Grade): SessionState {
  // no-op：已完成或无卡可背
  if (s.completed || s.queue.length === 0) return s;

  const [cur, ...rest] = s.queue;
  const stays = g === 'again' || g === 'hard'; // 答错/困难 → 留到 pool 下次重洗
  const newPool = stays ? [...s.pool, cur] : s.pool;
  const studiedTotal = s.studiedTotal + 1;

  // 同批次继续
  if (rest.length > 0) {
    return { ...s, queue: rest, pool: newPool, studiedTotal };
  }

  // 本轮批次背完：若 pool 仍有卡 → 重洗成下一批
  if (newPool.length > 0) {
    const next = shuffle(newPool);
    const queue = next.slice(0, s.size);
    const pool = next.slice(s.size);
    const batchNumber = s.batchNumber + 1;
    const completed = pool.length === 0 && queue.length === 0;
    return { ...s, queue, pool, batchNumber, completed, studiedTotal };
  }

  // pool 空 → 全部背完
  return { ...s, queue: [], pool: [], completed: true, studiedTotal };
}
