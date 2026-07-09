import { describe, it, expect } from 'vitest';
import { SEED_WORDS, type VocabEntry } from './words';

const VALID_BANDS = ['5', '6', '7', '8'] as const;

describe('SEED_WORDS 词表质量与规模', () => {
  it('总词数 ≥ 2000', () => {
    expect(SEED_WORDS.length).toBeGreaterThanOrEqual(2000);
  });

  it('各 band 达到最低词数（5≥1400, 6≥250, 7≥200, 8≥80）', () => {
    const count = (b: string) => SEED_WORDS.filter((w) => w.band === b).length;
    expect(count('5')).toBeGreaterThanOrEqual(1400);
    expect(count('6')).toBeGreaterThanOrEqual(250);
    expect(count('7')).toBeGreaterThanOrEqual(200);
    expect(count('8')).toBeGreaterThanOrEqual(80);
  });

  it('所有 id 全局唯一', () => {
    const ids = SEED_WORDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('核心字段合法（id/term/meaningZh 非空，band 合法，collocations 为数组）', () => {
    const nonEmpty = (s: string) => s && s.trim().length > 0;
    for (const w of SEED_WORDS as VocabEntry[]) {
      expect(nonEmpty(w.id), `id empty: ${w.id}`).toBe(true);
      expect(nonEmpty(w.term), `term empty: ${w.id}`).toBe(true);
      expect(nonEmpty(w.meaningZh), `meaningZh empty: ${w.id}`).toBe(true);
      expect(VALID_BANDS.includes(w.band as (typeof VALID_BANDS)[number]), `band valid: ${w.id}`).toBe(true);
      expect(Array.isArray(w.collocations), `collocations array: ${w.id}`).toBe(true);
      // 有音标时才校验 IPA 格式（批量词允许空音标，由闪卡条件渲染）
      if (w.phonetic) {
        expect(
          w.phonetic.startsWith('/') && w.phonetic.endsWith('/'),
          `phonetic IPA format: ${w.id}`,
        ).toBe(true);
      }
    }
  });
});
