import { describe, it, expect } from 'vitest';
import { SrsService } from './SrsService';

// 注：ts-fsrs v4 的 Card.due 是 Date 对象，因此所有「与 now 比较」的断言都用
// card.due.getTime() 取时间戳，语义与 v3（due 为数字时间戳）一致。
describe('SrsService（FSRS 调度核心）', () => {
  it('新卡立即到期，进入今日学习队列', () => {
    const svc = new SrsService();
    const now = Date.now();
    const card = svc.newCard(now);
    expect(svc.isDue(card, now)).toBe(true);
  });

  it('答「忘记(again)」保持短期限时复习（几分钟内到期）', () => {
    const svc = new SrsService();
    const now = Date.now();
    const card = svc.grade(svc.newCard(now), 'again', now);
    expect(card.due.getTime()).toBeGreaterThanOrEqual(now);
    expect(card.due.getTime()).toBeLessThanOrEqual(now + 10 * 60 * 1000);
  });

  it('答「简单(easy)」把到期日推到很远（≥1 天）', () => {
    const svc = new SrsService();
    const now = Date.now();
    const card = svc.grade(svc.newCard(now), 'easy', now);
    expect(card.due.getTime()).toBeGreaterThan(now + 24 * 60 * 60 * 1000);
  });

  it('连续「良好(good)」记忆稳定性单调递增', () => {
    const svc = new SrsService();
    const now = Date.now();
    const first = svc.grade(svc.newCard(now), 'good', now);
    const later = now + 2 * 24 * 60 * 60 * 1000;
    const second = svc.grade(first, 'good', later);
    expect(second.stability).toBeGreaterThan(first.stability);
  });

  it('dueCards 只返回当前到期的卡', () => {
    const svc = new SrsService();
    const now = Date.now();
    const due = svc.newCard(now);
    const far = svc.grade(svc.newCard(now), 'easy', now); // 推到未来
    const result = svc.dueCards([due, far], now);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(due);
  });

  it('dueCards 过滤：一张 now 到期、一张未来到期，只返回到期那张', () => {
    const svc = new SrsService();
    const now = Date.now();
    // 一张「现在到期」的卡：due <= now
    const dueNow = svc.newCard(now);
    expect(dueNow.due.getTime()).toBeLessThanOrEqual(now);
    // 一张「未来到期」的卡：用 easy 推到 > now
    const futureCard = svc.grade(svc.newCard(now), 'easy', now);
    expect(futureCard.due.getTime()).toBeGreaterThan(now);
    // 混合传入：future 卡也放在前面，验证顺序无关
    const result = svc.dueCards([futureCard, dueNow], now);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(dueNow);
    expect(result).not.toContain(futureCard);
  });

  it('dueCards 边界：在卡被创建之前的时间点，该卡不应被返回', () => {
    const svc = new SrsService();
    const now = Date.now();
    const card = svc.newCard(now); // 立即到期（due == now）
    // 创建之前：不应到期
    expect(svc.dueCards([card], now - 1000)).toHaveLength(0);
    // 恰好创建时刻：到期
    expect(svc.dueCards([card], now)).toHaveLength(1);
  });
});
