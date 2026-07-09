// Service 层：封装开源 SRS 引擎 ts-fsrs（FSRS v6，现代 Anki 同款调度算法）。
// 这一层是纯逻辑、可单测，不碰 UI、不碰存储 —— 这是团队定的分层红线。
//
// 版本说明：项目锁定 ts-fsrs v4（v4 API 要点）：
//   - 工厂函数 `fsrs()`（v3 的 `createFSRS` 已移除）
//   - `Rating` 是枚举（Again=1/Hard=2/Good=3/Easy=4）
//   - `Card.due` / `Card.last_review` 在 v4 中是 `Date`（v3 是 number）
import { fsrs, createEmptyCard, type Card, Rating } from 'ts-fsrs';

export type Grade = 'again' | 'hard' | 'good' | 'easy';

// 把业务语义映射到 FSRS 的 Rating 枚举（Again=1, Hard=2, Good=3, Easy=4）。
// 用 Exclude 去掉 Rating.Manual（repeat 返回的 IPreview 不含 Manual 这一档），
// 使 `[RATING[grade]]` 的索引类型与 IPreview 的键对齐。
type ScheduledRating = Exclude<Rating, Rating.Manual>;
const RATING: Record<Grade, ScheduledRating> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

export class SrsService {
  private fsrs: ReturnType<typeof fsrs>;

  constructor(params?: Parameters<typeof fsrs>[0]) {
    // enable_short_term: 新词/答错先进入短期限时复习，符合背单词直觉。
    this.fsrs = fsrs(params ?? { enable_short_term: true });
  }

  /** 创建一张从未复习过的卡，立即到期（进入今日学习队列）。 */
  newCard(now: number = Date.now()): Card {
    return createEmptyCard(new Date(now));
  }

  /** 对一张卡打分，返回重新排期后的卡。 */
  grade(card: Card, grade: Grade, now: number = Date.now()): Card {
    // v4 的 repeat 返回按 Rating 索引的排期记录，取对应档位的卡片。
    return this.fsrs.repeat(card, new Date(now))[RATING[grade]].card;
  }

  /** 卡是否在 `now` 或之前到期。v4 中 due 是 Date，需取时间戳比较。 */
  isDue(card: Card, now: number = Date.now()): boolean {
    return card.due.getTime() <= now;
  }

  /** 从一批卡里筛出当前到期的。 */
  dueCards(cards: Card[], now: number = Date.now()): Card[] {
    return cards.filter((c) => this.isDue(c, now));
  }
}
