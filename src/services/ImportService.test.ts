import { describe, it, expect } from 'vitest';
import type { VocabEntry, Band } from '../data/words';
import type { VocabRepositoryPort, Profile } from '../repository/VocabRepository';
import {
  parseCsv,
  parseAnki,
  importWords,
  importAndStore,
} from './ImportService';

// ── 内存版假实现（不依赖 IndexedDB）──────────────────────────────────────
class FakeRepo implements VocabRepositoryPort {
  private store = new Map<string, VocabEntry>();
  /** 捕获每次 bulkPutWords 入参，用于断言调用次数与内容。 */
  readonly bulkCalls: VocabEntry[][] = [];

  async seedIfEmpty(words: VocabEntry[]): Promise<void> {
    if (this.store.size === 0) for (const w of words) this.store.set(w.id, w);
  }
  async seedOrRefresh(_words: VocabEntry[], _version: string): Promise<void> {
    /* 测试不依赖刷新逻辑，留空 */
  }
  async getAllWords(): Promise<VocabEntry[]> {
    return [...this.store.values()];
  }
  async getWord(id: string): Promise<VocabEntry | undefined> {
    return this.store.get(id);
  }
  async loadCard(): Promise<null> {
    return null;
  }
  async saveCard(): Promise<void> {
    /* no-op */
  }
  async putWord(word: VocabEntry): Promise<void> {
    this.store.set(word.id, word);
  }
  async bulkPutWords(words: VocabEntry[]): Promise<void> {
    this.bulkCalls.push(words);
    for (const w of words) this.store.set(w.id, w);
  }
  async recordStudyDay(): Promise<void> {
    /* no-op */
  }
  async getStudiedDays(): Promise<string[]> {
    return [];
  }
  // ── 多档案接口（测试不依赖，留空）──
  async listProfiles(): Promise<Profile[]> {
    return [];
  }
  async createProfile(_name: string): Promise<Profile> {
    return { id: 'x', name: _name, createdAt: 0 };
  }
  async renameProfile(_id: string, _name: string): Promise<void> {}
  async deleteProfile(_id: string): Promise<void> {}
  async ensureDefaultProfile(): Promise<string> {
    return 'default';
  }
  setActiveProfile(_id: string): void {}
  getActiveProfileId(): string {
    return 'default';
  }
}

// ── CSV fixtures ──────────────────────────────────────────────────────────
const CSV_HEADER =
  'term,phonetic,pos,meaningZh,meaningEn,band,collocations,example,exampleZh';

// 有效 9 列：含一条 Band 8 行 + 一条 Band 5 行（用 '|' 和 ';' 混合分隔搭配）
const CSV_VALID = [
  CSV_HEADER,
  'ubiquitous,/juːˈbɪkwɪtəs/,adj.,无处不在的,present everywhere,8,ubiquitous technology|become ubiquitous,Smartphones are ubiquitous.,智能手机无处不在。',
  'analyse,/ˈænəlaɪz/,v.,分析,to examine in detail,5,analyse data;analyse the cause,We analyse results.,我们分析。',
].join('\n');

// 含注入行（meaningZh 带 <script>）+ 一条正常行
const CSV_INJECTION = [
  CSV_HEADER,
  'evil,/iːvəl/,n.,<script>alert(1)</script>,x,5,col,ex,exz',
  'safe,/seɪf/,adj.,安全的,safe,5,safe place,It is safe.,它是安全的。',
].join('\n');

// band 缺失 / band 非法('10')
const CSV_BAD_BAND = [
  CSV_HEADER,
  'noband,/n/,n.,无分级词,no band,,col,ex,exz', // band 为空
  'badband,/b/,n.,非法分级,invalid,10,col,ex,exz', // band='10'
].join('\n');

// term 缺失
const CSV_MISSING_TERM = [CSV_HEADER, ',/m/,n.,空词,empty,5,col,ex,exz'].join('\n');

describe('parseCsv + importWords (CSV)', () => {
  it('happy path：9 列有效 CSV 全部接受，字段正确，Band 8 端到端', () => {
    const rows = parseCsv(CSV_VALID);
    expect(rows).toHaveLength(2);
    const report = importWords(rows);
    expect(report.accepted).toHaveLength(2);
    expect(report.rejected).toHaveLength(0);
    expect(report.total).toBe(2);

    const ubi = report.accepted.find((w) => w.term === 'ubiquitous')!;
    expect(ubi.band).toBe('8');
    expect(ubi.id).toBe('ubiquitous');
    expect(ubi.collocations).toEqual(['ubiquitous technology', 'become ubiquitous']);

    const ana = report.accepted.find((w) => w.term === 'analyse')!;
    expect(ana.band).toBe('5');
    expect(ana.collocations).toEqual(['analyse data', 'analyse the cause']);
  });

  it('<script> 注入行被拒，其余行仍接受', () => {
    const report = importWords(parseCsv(CSV_INJECTION));
    expect(report.accepted).toHaveLength(1);
    expect(report.accepted[0].term).toBe('safe');
    expect(report.rejected).toHaveLength(1);
    expect(report.rejected[0].reason).toBe('检测到疑似注入内容');
  });

  it('缺失 band 或非法 band(\'9\') 被拒，且原因正确', () => {
    const report = importWords(parseCsv(CSV_BAD_BAND));
    expect(report.accepted).toHaveLength(0);
    expect(report.rejected).toHaveLength(2);
    const reasons = report.rejected.map((r) => r.reason);
    expect(reasons).toContain('band 非法: ');
    expect(reasons).toContain('band 非法: 10');
  });

  it('缺失 term 被拒', () => {
    const report = importWords(parseCsv(CSV_MISSING_TERM));
    expect(report.accepted).toHaveLength(0);
    expect(report.rejected[0].reason).toBe('字段缺失: term');
  });
});

describe('parseAnki + importWords (Anki TSV)', () => {
  it('2 列：term \\t meaningZh，band 默认 5，被接受', () => {
    const text = ['apple\t苹果', 'banana\t香蕉'].join('\n');
    const rows = parseAnki(text);
    expect(rows).toHaveLength(2);
    const report = importWords(rows);
    expect(report.accepted).toHaveLength(2);
    expect(report.rejected).toHaveLength(0);
    expect(report.accepted.every((w) => w.band === '5')).toBe(true);
    expect(report.accepted[0].term).toBe('apple');
    expect(report.accepted[0].meaningZh).toBe('苹果');
  });

  it('9 列全量：字段全部正确，被接受', () => {
    const line = [
      'ubiquitous',
      '/juːˈbɪkwɪtəs/',
      'adj.',
      '无处不在的',
      'present everywhere',
      '8',
      'ubiquitous technology|become ubiquitous',
      'Smartphones are ubiquitous.',
      '智能手机无处不在。',
    ].join('\t');
    const rows = parseAnki(line);
    expect(rows).toHaveLength(1);
    const report = importWords(rows);
    expect(report.accepted).toHaveLength(1);
    expect(report.rejected).toHaveLength(0);
    const w = report.accepted[0];
    expect(w.band).toBe('8');
    expect(w.collocations).toEqual(['ubiquitous technology', 'become ubiquitous']);
    expect(w.exampleZh).toBe('智能手机无处不在。');
  });

  it('异常列数：不崩溃，产出被拒行', () => {
    const text = ['onlyonecol', 'a\tb\tc\td'].join('\n');
    const rows = parseAnki(text);
    const report = importWords(rows);
    expect(report.accepted).toHaveLength(0);
    expect(report.rejected.length).toBe(rows.length);
  });
});

describe('importAndStore', () => {
  it('对 accepted 数组恰好调用一次 repo.bulkPutWords', async () => {
    const repo = new FakeRepo();
    const report = await importAndStore(parseCsv(CSV_VALID), repo);
    expect(repo.bulkCalls).toHaveLength(1);
    expect(repo.bulkCalls[0]).toBe(report.accepted);
    expect(repo.bulkCalls[0]).toHaveLength(2);
    // 落库内容正确：FakeRepo 内部 store 已写入
    expect(await repo.getWord('ubiquitous')).toBeDefined();
    expect((await repo.getWord('ubiquitous'))!.band).toBe('8' as Band);
  });
});
