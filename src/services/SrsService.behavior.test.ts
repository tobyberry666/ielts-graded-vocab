import { describe, it, expect } from 'vitest';
import { createEmptyCard, Rating, type Card } from 'ts-fsrs';
import { SrsService, type Grade } from './SrsService';

// FSRS v4 行为验证：聚焦「调度数学是否正确」，而非 SrsService 自身的工具方法。
// 用法见 src/services/SrsService.ts：v4 的 Card.due 是 Date，
// 因此所有「与 now 比较」的断言都用 card.due.getTime() 取时间戳。

const GRADES: Grade[] = ['again', 'hard', 'good', 'easy'];

describe('FSRS v4 调度行为验证（SrsService 之上）', () => {
  it('createEmptyCard / newCard 创建的新卡立即到期', () => {
    const svc = new SrsService();
    const now = Date.now();

    // 直接走 ts-fsrs 的底层工厂
    const raw = createEmptyCard(new Date(now));
    expect(raw.due.getTime()).toBeLessThanOrEqual(now);

    // 走 SrsService 封装
    const card = svc.newCard(now);
    expect(card.due.getTime()).toBeLessThanOrEqual(now);
    expect(svc.isDue(card, now)).toBe(true);
  });

  it('四种评分把同一张新卡推到不同的到期时间，且顺序合理', () => {
    const svc = new SrsService();
    const now = Date.now();

    const dueTimes = GRADES.map((g) => {
      const card = svc.grade(svc.newCard(now), g, now);
      expect(card).not.toBeNull();
      expect(card.due).toBeInstanceOf(Date);
      return card.due.getTime();
    });

    const [again, hard, good, easy] = dueTimes;

    // Again 应是最短期限时复习（最早到期）。
    // Easy 应是最长期限（最晚到期）。
    expect(again).toBeLessThan(easy);

    // 记忆强度顺序：Again(忘) < Hard < Good < Easy 对应到期时间递增。
    expect(again).toBeLessThan(hard);
    expect(hard).toBeLessThan(good);
    expect(good).toBeLessThan(easy);

    // Again 应落在短期限时窗口内（<= 10 分钟），Easy 应推到至少 1 天后。
    expect(again).toBeLessThanOrEqual(now + 10 * 60 * 1000);
    expect(easy).toBeGreaterThan(now + 24 * 60 * 60 * 1000);
  });

  it('isDue 在 due <= now 时为真、否则为假', () => {
    const svc = new SrsService();
    const now = Date.now();

    // 新卡 due <= now → 到期
    const fresh = svc.newCard(now);
    expect(svc.isDue(fresh, now)).toBe(true);
    expect(svc.isDue(fresh, now - 1)).toBe(false);

    // Easy 推到未来 → 在 now 时不交，但在其 due 时刻交
    const easyCard = svc.grade(svc.newCard(now), 'easy', now);
    const dueTs = easyCard.due.getTime();
    expect(svc.isDue(easyCard, now)).toBe(false);
    expect(svc.isDue(easyCard, dueTs)).toBe(true);
    expect(svc.isDue(easyCard, dueTs - 1)).toBe(false);
  });

  it('用 ts-fsrs 原生 Rating 枚举评分，到期顺序与业务映射一致', () => {
    const svc = new SrsService();
    const now = Date.now();

    const rate = (r: Rating): Card => {
      const grade: Grade =
        r === Rating.Again ? 'again' :
        r === Rating.Hard ? 'hard' :
        r === Rating.Good ? 'good' :
        r === Rating.Easy ? 'easy' : 'again';
      return svc.grade(svc.newCard(now), grade, now);
    };

    const again = rate(Rating.Again).due.getTime();
    const hard = rate(Rating.Hard).due.getTime();
    const good = rate(Rating.Good).due.getTime();
    const easy = rate(Rating.Easy).due.getTime();

    expect(again).toBeLessThan(hard);
    expect(hard).toBeLessThan(good);
    expect(good).toBeLessThan(easy);
  });

  it('连续 Good 复习：间隔/稳定性单调递增，且到期日不断推后', () => {
    const svc = new SrsService();
    const now = Date.now();

    const first = svc.grade(svc.newCard(now), 'good', now);
    const t1 = first.due.getTime();

    const later = now + 2 * 24 * 60 * 60 * 1000;
    const second = svc.grade(first, 'good', later);
    const t2 = second.due.getTime();

    // 稳定性（记忆留存强度）随复习次数增长
    expect(second.stability).toBeGreaterThan(first.stability);
    // 第二次复习在被推迟的时点进行，其新到期日应比第一次更晚
    expect(t2).toBeGreaterThan(t1);

    const third = svc.grade(second, 'good', t2);
    expect(third.stability).toBeGreaterThan(second.stability);
    expect(third.due.getTime()).toBeGreaterThan(t2);
  });

  it('grade 始终返回非空且 due 为 Date 的合法下一张卡', () => {
    const svc = new SrsService();
    const now = Date.now();
    for (const g of GRADES) {
      const next = svc.grade(svc.newCard(now), g, now);
      expect(next).not.toBeNull();
      expect(next).toBeDefined();
      expect(next.due).toBeInstanceOf(Date);
      expect(Number.isNaN(next.due.getTime())).toBe(false);
    }
  });
});
