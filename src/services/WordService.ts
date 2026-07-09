// Service 层：词表相关业务编排（纯逻辑、可单测、不碰 UI / DOM）。
// 依赖「VocabRepositoryPort 抽象」而非具体存储实现，依赖 SrsService 做调度判定。
import type { Band, VocabEntry } from '../data/words';
import type { Card } from 'ts-fsrs';
import type { VocabRepositoryPort } from '../repository/VocabRepository';
import type { SrsService } from './SrsService';

export class WordService {
  constructor(private repo: VocabRepositoryPort) {}

  /** 按 band 过滤出对应分段的词。 */
  async filterByBand(band: Band): Promise<VocabEntry[]> {
    const words = await this.repo.getAllWords();
    return words.filter((w) => w.band === band);
  }

  /**
   * 取某 band 当前到期的「词 + 卡」对，供复习队列使用。
   * - 该 band 的每个词：先从仓库取卡；取不到（新词/无记录）则用 SrsService.newCard(now)
   *   生成一张立即到期的新卡。
   * - 用 SrsService.isDue 判定是否到期，只返回到期项。
   */
  async getDueCards(
    srs: SrsService,
    band: Band,
    now: number = Date.now(),
  ): Promise<{ word: VocabEntry; card: Card }[]> {
    const words = await this.filterByBand(band);
    const due: { word: VocabEntry; card: Card }[] = [];

    for (const word of words) {
      let card = await this.repo.loadCard(word.id);
      if (card === null) {
        card = srs.newCard(now); // 新词立即到期，进入今日学习队列
      }
      if (srs.isDue(card, now)) {
        due.push({ word, card });
      }
    }
    return due;
  }

  /**
   * 取某 band 的学习集合。
   * - mode='due'（默认）：等价于 getDueCards，仅返回当前到期的「词+卡」。
   * - mode='all'（重学模式）：返回本档全部词（含已排期到未来的）；未见过则 newCard。
   */
  async getStudySet(
    srs: SrsService,
    band: Band,
    now: number = Date.now(),
    mode: 'due' | 'all' = 'due',
  ): Promise<{ word: VocabEntry; card: Card }[]> {
    const words = await this.filterByBand(band);
    if (mode === 'all') {
      // 重学模式：返回本档全部词（含已排期到未来的），未见过则 newCard。
      return Promise.all(words.map(async (w) => {
        const card = (await this.repo.loadCard(w.id)) ?? srs.newCard(now);
        return { word: w, card };
      }));
    }
    return this.getDueCards(srs, band, now); // 默认仅到期
  }
}
