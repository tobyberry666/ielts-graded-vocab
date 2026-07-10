// 词表导出工具：CSV（标准 9 列）与 Anki（制表符分隔 正面\t背面）。
// 所有单元格均做转义，避免内容与分隔符冲突；不使用 dangerouslySetInnerHTML。
import type { VocabEntry } from '../data/words';

function csvCell(v: string): string {
  const s = v ?? '';
  // CSV 中若含逗号/引号/换行，必须用双引号包裹，且内部引号翻倍。
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function tsvCell(v: string): string {
  // TSV 用制表符分隔，去掉制表符与换行，避免破坏行结构。
  const s = v ?? '';
  return s.replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
}

export function toCsv(words: VocabEntry[]): string {
  const header = [
    'term',
    'phonetic',
    'pos',
    'meaningZh',
    'meaningEn',
    'band',
    'collocations',
    'example',
    'exampleZh',
  ]
    .map(csvCell)
    .join(',');
  const rows = words.map((w) =>
    [
      w.term,
      w.phonetic,
      w.pos,
      w.meaningZh,
      w.meaningEn,
      w.band,
      (w.collocations || []).join('; '),
      w.example,
      w.exampleZh,
    ]
      .map(csvCell)
      .join(','),
  );
  return [header, ...rows].join('\r\n');
}

export function toAnki(words: VocabEntry[]): string {
  // Anki 文本导入：每行 正面<TAB>背面。
  return words
    .map((w) => {
      const front = tsvCell(w.term);
      const back = tsvCell(
        [w.phonetic, w.pos, w.meaningZh, w.meaningEn, w.example]
          .filter(Boolean)
          .join(' | '),
      );
      return `${front}\t${back}`;
    })
    .join('\r\n');
}

export function downloadFile(filename: string, content: string, mime: string): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
