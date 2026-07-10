import { motion, useReducedMotion } from 'framer-motion';
import { buildMonthGrid } from '../utils/date';

export interface CalendarProps {
  /** 已学习过的日期键集合（'YYYY-MM-DD'）。 */
  studiedDays: Set<string>;
  /** 年份，如 2026。 */
  year: number;
  /** 月份 1-12。 */
  month: number;
  /** 切到上个月。 */
  onPrev: () => void;
  /** 切到下个月。 */
  onNext: () => void;
  /** 回到当前月。 */
  onToday: () => void;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function Calendar({ studiedDays, year, month, onPrev, onNext, onToday }: CalendarProps) {
  const reduceMotion = useReducedMotion();
  const cells = buildMonthGrid(year, month);
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const studiedThisMonth = [...studiedDays].filter((k) => k.startsWith(prefix)).length;

  return (
    <motion.section
      className="cal glass"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      aria-label="学习日历"
    >
      <div className="cal-head">
        <h2 className="cal-title">学习日历</h2>
        <div className="cal-nav" role="group" aria-label="切换月份">
          <button type="button" className="cal-nav-btn" aria-label="上个月" onClick={onPrev}>
            ‹
          </button>
          <button type="button" className="cal-nav-today" aria-label="回到本月" onClick={onToday}>
            {prefix}
          </button>
          <button type="button" className="cal-nav-btn" aria-label="下个月" onClick={onNext}>
            ›
          </button>
        </div>
      </div>

      <div className="cal-weekdays" role="row" aria-hidden="true">
        {WEEKDAYS.map((w) => (
          <span key={w} className="cal-weekday">
            {w}
          </span>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map((cell, i) => {
          // 不在当月的占位格：不渲染圆点。
          if (cell.day === null) {
            return <span key={`empty-${i}`} className="cal-cell cal-cell-empty" aria-hidden="true" />;
          }
          const isStudied = studiedDays.has(cell.key);
          const label = `${cell.key}${isStudied ? ' 已学习' : ''}${cell.isToday ? ' 今天' : ''}`;
          return (
            <span key={cell.key} className="cal-cell">
              <span
                className={`cal-dot${isStudied ? ' is-studied' : ''}${cell.isToday ? ' is-today' : ''}`}
                role="img"
                aria-label={label}
              />
            </span>
          );
        })}
      </div>

      <p className="cal-summary">本月已背 {studiedThisMonth} 天</p>
    </motion.section>
  );
}
