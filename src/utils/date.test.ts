import { describe, it, expect } from 'vitest';
import { dateKey, daysInMonth, buildMonthGrid } from './date';

describe('dateKey', () => {
  it('格式为 ^\\d{4}-\\d{2}-\\d{2}$', () => {
    expect(dateKey(new Date(2026, 0, 5))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('与本地日期一致（不受 UTC 偏移影响）', () => {
    const d = new Date(2026, 1, 3, 23, 30, 0); // 本地 2026-02-03 深夜
    expect(dateKey(d)).toBe('2026-02-03');
  });

  it('跨月边界：1 月 31 日 23:30 不会因 UTC 偏移跳到 2 月', () => {
    const d = new Date(2026, 0, 31, 23, 30, 0);
    expect(dateKey(d)).toBe('2026-01-31');
  });
});

describe('daysInMonth', () => {
  it('2026-02 平年 = 28', () => {
    expect(daysInMonth(2026, 2)).toBe(28);
  });
  it('2024-02 闰年 = 29', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
  });
  it('大月 = 31 / 小月 = 30', () => {
    expect(daysInMonth(2026, 1)).toBe(31);
    expect(daysInMonth(2026, 4)).toBe(30);
  });
});

describe('buildMonthGrid', () => {
  const today = new Date(2026, 1, 14); // 2026-02-14，固定参照日

  it('总是返回 42 格', () => {
    expect(buildMonthGrid(2026, 2, today)).toHaveLength(42);
  });

  it('非 null 格数量恰好等于当月天数', () => {
    const cells = buildMonthGrid(2026, 2, today);
    const nonNull = cells.filter((c) => c.day !== null);
    expect(nonNull).toHaveLength(daysInMonth(2026, 2));
  });

  it('恰好有一格 isToday 为 true，且对应今天', () => {
    const cells = buildMonthGrid(2026, 2, today);
    const todays = cells.filter((c) => c.isToday);
    expect(todays).toHaveLength(1);
    expect(todays[0].day).toBe(14);
    expect(todays[0].key).toBe('2026-02-14');
  });

  it('前后月补位的格子为 null 且 key 为空串', () => {
    const cells = buildMonthGrid(2026, 2, today);
    const nulls = cells.filter((c) => c.day === null);
    expect(nulls.length).toBeGreaterThan(0);
    expect(nulls.every((c) => c.key === '' && c.isToday === false)).toBe(true);
  });

  it('null 格数量 = 42 - 当月天数', () => {
    const cells = buildMonthGrid(2026, 2, today);
    expect(cells.filter((c) => c.day === null)).toHaveLength(42 - daysInMonth(2026, 2));
  });
});
