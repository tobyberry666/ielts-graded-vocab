import { useState, type ChangeEvent } from 'react';
import {
  parseAnki,
  parseCsv,
  importAndStore,
  type ImportReport,
  type ImportRow,
} from '../services/ImportService';
import type { VocabRepositoryPort } from '../repository/VocabRepository';

export interface ImportPanelProps {
  repo: VocabRepositoryPort;
  onClose: () => void;
}

/**
 * 选择解析器：
 *  - .csv  → parseCsv（papaparse, header:true）
 *  - 其余   → 检测首条非空数据行是否含制表符：含则视为 Anki TSV（parseAnki），
 *            否则同样走 parseAnki（2 列 term⇥meaningZh 形态）。
 */
function pickParser(text: string, filename: string): ImportRow[] {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.csv')) return parseCsv(text);
  const firstLine = text.split(/\r?\n/).find((l) => l.trim() !== '');
  if (firstLine && firstLine.includes('\t')) return parseAnki(text);
  return parseAnki(text);
}

export default function ImportPanel({ repo, onClose }: ImportPanelProps) {
  const [report, setReport] = useState<ImportReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // 清空 value，使同一文件可再次被选择触发 onChange。
    e.target.value = '';
    if (!file) return;

    setBusy(true);
    setError(null);
    try {
      const text = await file.text();
      const rows = pickParser(text, file.name);
      const rep = await importAndStore(rows, repo);
      setReport(rep);
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入失败，请检查文件格式。');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ip-card glass" role="document">
      <div className="ip-head">
        <div>
          <h2 className="ip-title">导入词表</h2>
          <p className="ip-sub">支持 CSV (.csv) 与 Anki 导出 (.txt, 制表符分隔)</p>
        </div>
        <button
          type="button"
          className="ip-close"
          aria-label="关闭"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {!report && !busy && !error && (
        <label className="ip-dropzone" htmlFor="ip-file">
          <input
            id="ip-file"
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            onChange={handleFile}
            className="ip-file-input"
          />
          <span className="ip-dropzone-icon" aria-hidden="true">⬆</span>
          <span className="ip-dropzone-text">点击选择文件开始导入</span>
          <span className="ip-dropzone-hint">CSV 需含表头；Anki 支持 2 列或 9 列</span>
        </label>
      )}

      {busy && <div className="ip-status">解析并写入词库中…</div>}
      {error && <div className="ip-status ip-status-error">{error}</div>}

      {report && (
        <div className="ip-body">
          <div className="ip-summary">
            <div className="ip-stat">
              <span className="ip-stat-value ip-stat-ok">{report.accepted.length}</span>
              <span className="ip-stat-label">已接受</span>
            </div>
            <div className="ip-stat">
              <span className="ip-stat-value ip-stat-bad">{report.rejected.length}</span>
              <span className="ip-stat-label">已拒绝</span>
            </div>
            <div className="ip-stat">
              <span className="ip-stat-value">{report.total}</span>
              <span className="ip-stat-label">总计</span>
            </div>
          </div>

          {report.rejected.length > 0 && (
            <div className="ip-rejected">
              <span className="ip-rejected-title">拒绝明细</span>
              <ul className="ip-rejected-list">
                {report.rejected.map((r) => (
                  <li key={r.index} className="ip-rejected-row">
                    <span className="ip-rejected-term">
                      #{r.index + 1} · {String(r.source.term ?? '(无 term)')}
                    </span>
                    <span className="ip-rejected-reason">{r.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button type="button" className="ip-done" onClick={onClose}>
            完成 / 关闭
          </button>
        </div>
      )}
    </div>
  );
}
