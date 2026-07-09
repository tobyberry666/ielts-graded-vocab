// 纯日期工具（零依赖）：本地时区安全的 'YYYY-MM-DD' 与月历网格。
// 一律用 getFullYear/getMonth/getDate，避免 toISOString 的 UTC 偏移把日期算错一天。

/** 本地时区的 'YYYY-MM-DD'（不依赖 toISOString 的 UTC 偏移）。 */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 某年某月的天数（month 为 1-12）。 */
export function daysInMonth(year: number, month: number): number {
  // month 传 1-12，构造「下月第 0 天」即当月最后一天，取 getDate 即得当月天数。
  return new Date(year, month, 0).getDate();
}

/** 当月网格里的单个格子。 */
export interface MonthCell {
  /** 当月日期；不在当月的格子填 null。 */
  day: number | null;
  /** 该格的日期键：null 格用空串。 */
  key: string;
  /** 该格是否等于今天（仅非 null 格可能为 true）。 */
  isToday: boolean;
}

/**
 * 当月网格：6 行 × 7 列共 42 格；不在当月的填 null。
 * @param year  年份（如 2026）
 * @param month 月份 1-12
 * @param today 参照「今天」，默认当前时间
 */
export function buildMonthGrid(
  year: number,
  month: number,
  today: Date = new Date(),
): MonthCell[] {
  const total = daysInMonth(year, month);
  const leading = new Date(year, month - 1, 1).getDay(); // 0=周日..6=周六
  const todayKey = dateKey(today);

  const cells: MonthCell[] = [];
  // 前置 null 格（属于上月）
  for (let i = 0; i < leading; i++) {
    cells.push({ day: null, key: '', isToday: false });
  }
  // 当月格
  for (let d = 1; d <= total; d++) {
    const cellDate = new Date(year, month - 1, d);
    const key = dateKey(cellDate);
    cells.push({ day: d, key, isToday: key === todayKey });
  }
  // 补齐到 42 格（属于下月）
  while (cells.length < 42) {
    cells.push({ day: null, key: '', isToday: false });
  }
  return cells;
}
