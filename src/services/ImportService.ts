// 导入管线（Milestone M3）—— 纯 service 层，零 UI 依赖。
//
// 设计红线：
//  - 安全前置：所有字段在进库前都复用 sanitize 的 containsInjection / isValidBand，
//    与 safeParseWord 共用同一套规则，绝不弱化。
//  - 渲染安全：本模块绝不出现 dangerouslySetInnerHTML；React 渲染时自动转义，
//    解析期的注入扫描是兜底安全网。
//  - 纯函数：parse* / importWords 不碰存储、不抛异常；只有 importAndStore 才落库。
import type { Band, VocabEntry } from '../data/words';
import type { VocabRepositoryPort } from '../repository/VocabRepository';
import { containsInjection, isValidBand } from './sanitize';
import * as Papa from 'papaparse';

// 导入安全上限：防止超大/恶意 CSV/TSV 阻塞主线程（papaparse 同步解析）或爆内存。
const MAX_IMPORT_ROWS = 2000;
const FIELD_MAX = 2000;

/** 字段裁剪：超长内容截断，避免异常输入撑爆存储/渲染。 */
function cap(s: string): string {
  return s.length > FIELD_MAX ? s.slice(0, FIELD_MAX) : s;
}

export interface ImportRow {
  term: string;
  phonetic: string;
  pos: string;
  meaningZh: string;
  meaningEn: string;
  band: Band;
  collocations: string[];
  example: string;
  exampleZh: string;
}

export interface RejectedRow {
  index: number;
  reason: string;
  source: Record<string, unknown>;
}

export interface ImportReport {
  accepted: VocabEntry[];
  rejected: RejectedRow[];
  total: number;
}

// ── 解析辅助 ──────────────────────────────────────────────────────────────

function strVal(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * 把任意 band 原值规整为 Band 类型。
 * 合法值原样保留；非法/缺失值也原样保留（如 '' / '9'），交由 importWords
 * 用 isValidBand 拒绝，并能在 reason 中回显原始非法值。
 */
function toBand(raw: unknown): Band {
  return strVal(raw) as Band;
}

/** collocations 单元格按 '|' 或 ';' 拆分，trim 并丢弃空项。 */
function splitCollocations(s: string): string[] {
  if (!s) return [];
  return s
    .split(/[|;]/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
}

/** 一条解析后的记录 → ImportRow（缺失可选字段默认 '' / []）。 */
function recordToRow(rec: Record<string, unknown>): ImportRow {
  return {
    term: cap(strVal(rec.term)),
    phonetic: cap(strVal(rec.phonetic)),
    pos: cap(strVal(rec.pos)),
    meaningZh: cap(strVal(rec.meaningZh)),
    meaningEn: cap(strVal(rec.meaningEn)),
    band: toBand(rec.band),
    collocations: splitCollocations(cap(strVal(rec.collocations))),
    example: cap(strVal(rec.example)),
    exampleZh: cap(strVal(rec.exampleZh)),
  };
}

function rowToSource(row: ImportRow): Record<string, unknown> {
  return {
    term: row.term,
    phonetic: row.phonetic,
    pos: row.pos,
    meaningZh: row.meaningZh,
    meaningEn: row.meaningEn,
    band: row.band,
    collocations: row.collocations,
    example: row.example,
    exampleZh: row.exampleZh,
  };
}

// ── CSV 解析（papaparse, header:true）─────────────────────────────────────
export function parseCsv(text: string): ImportRow[] {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return result.data
    .slice(0, MAX_IMPORT_ROWS)
    .map((rec) => recordToRow(rec as Record<string, unknown>));
}

// ── Anki 解析（TSV）──────────────────────────────────────────────────────
// 支持两种形态：
//  - 9 列：term \t phonetic \t pos \t meaningZh \t meaningEn \t band \t
//           collocations \t example \t exampleZh（全量位置映射）
//  - 2 列：term \t meaningZh（band 默认 '5'）
// 列数异常时不崩溃，产出一个会被 importWords 拒绝的 ImportRow（非法 band）。
export function parseAnki(text: string): ImportRow[] {
  const rows: ImportRow[] = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (line.trim() === '') continue;
    if (rows.length >= MAX_IMPORT_ROWS) break; // 超上限即停，防止超大文件阻塞
    const cols = line.split('\t');

    if (cols.length === 9) {
      rows.push({
        term: cap(cols[0].trim()),
        phonetic: cap(cols[1].trim()),
        pos: cap(cols[2].trim()),
        meaningZh: cap(cols[3].trim()),
        meaningEn: cap(cols[4].trim()),
        band: toBand(cols[5]),
        collocations: splitCollocations(cols[6]),
        example: cap(cols[7].trim()),
        exampleZh: cap(cols[8].trim()),
      });
    } else if (cols.length === 2) {
      rows.push({
        term: cap(cols[0].trim()),
        phonetic: '',
        pos: '',
        meaningZh: cap(cols[1].trim()),
        meaningEn: '',
        band: '5',
        collocations: [],
        example: '',
        exampleZh: '',
      });
    } else {
      // 列数异常：构造一条必然被 importWords 拒绝的行（非法 band）。
      rows.push({
        term: cap(cols[0]?.trim() || 'unexpected'),
        phonetic: '',
        pos: '',
        meaningZh: 'unexpected',
        meaningEn: '',
        band: '' as Band,
        collocations: [],
        example: '',
        exampleZh: '',
      });
    }
  }
  return rows;
}

// ── 纯校验器 importWords ───────────────────────────────────────────────────
// 安全优先：先查必填字段，再查 band 白名单，最后对「每个提供了的非空字符串字段」
// 做注入扫描。与 safeParseWord 共用同一套 sanitize 规则，绝不弱化。
export function importWords(rows: ImportRow[]): ImportReport {
  const accepted: VocabEntry[] = [];
  const rejected: RejectedRow[] = [];

  rows.forEach((row, index) => {
    if (!row.term || row.term.trim().length === 0) {
      rejected.push({ index, reason: '字段缺失: term', source: rowToSource(row) });
      return;
    }
    if (!row.meaningZh || row.meaningZh.trim().length === 0) {
      rejected.push({ index, reason: '字段缺失: meaningZh', source: rowToSource(row) });
      return;
    }
    if (!isValidBand(row.band)) {
      rejected.push({ index, reason: `band 非法: ${String(row.band)}`, source: rowToSource(row) });
      return;
    }

    // 注入扫描：term / phonetic / pos / meaningZh / meaningEn / example /
    // exampleZh 的非空值 + 每个 collocation 条目，逐个过 containsInjection。
    const toScan: string[] = [];
    if (row.term) toScan.push(row.term);
    if (row.phonetic) toScan.push(row.phonetic);
    if (row.pos) toScan.push(row.pos);
    if (row.meaningZh) toScan.push(row.meaningZh);
    if (row.meaningEn) toScan.push(row.meaningEn);
    if (row.example) toScan.push(row.example);
    if (row.exampleZh) toScan.push(row.exampleZh);
    for (const c of row.collocations) toScan.push(c);

    for (const field of toScan) {
      if (containsInjection(field)) {
        rejected.push({ index, reason: '检测到疑似注入内容', source: rowToSource(row) });
        return;
      }
    }

    // 通过全部校验：构建 VocabEntry。
    // 注意：id = 'import:' + term.trim()，加前缀使其永不落在种子词 id 集合内，
    // 避免下次启动被 seedOrRefresh 按「内置种子词」富文本覆盖；用户导入词独立存活。
    // 若多个词 term 相同（trim 后），bulkPut 末值覆盖先前值。
    const term = row.term.trim();
    accepted.push({
      id: 'import:' + term,
      term,
      phonetic: row.phonetic ?? '',
      pos: row.pos ?? '',
      meaningZh: row.meaningZh,
      meaningEn: row.meaningEn ?? '',
      band: row.band,
      collocations: row.collocations ?? [],
      example: row.example ?? '',
      exampleZh: row.exampleZh ?? '',
    });
  });

  return { accepted, rejected, total: rows.length };
}

// ── 落库封装 ──────────────────────────────────────────────────────────────
export async function importAndStore(
  rows: ImportRow[],
  repo: VocabRepositoryPort,
): Promise<ImportReport> {
  const report = importWords(rows);
  await repo.bulkPutWords(report.accepted);
  return report;
}
