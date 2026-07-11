import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { List, type RowComponentProps } from 'react-window';
import { SEED_WORDS, SEED_VERSION, type Band, type VocabEntry } from './data/words';
import { SrsService, type Grade } from './services/SrsService';
// 持久层与业务编排（已落地）
import { VocabRepository, type Profile } from './repository/VocabRepository';
import { WordService } from './services/WordService';
import { createSession, currentCard, grade as gradeSession, dismissCurrent as dismissSession, reviewRound as reviewSessionRound, nextRound as nextSessionRound, type SessionState } from './services/SessionService';
import { dateKey } from './utils/date';
import { toCsv, toAnki, downloadFile } from './utils/export';
import Flashcard from './components/Flashcard';
import BandSelector from './components/BandSelector';
import ProgressRing from './components/ProgressRing';
import Calendar from './components/Calendar';
import ImportPanel from './components/ImportPanel';
import ProfileSwitcher from './components/ProfileSwitcher';
import {
  playPronunciation,
  prefetchPronunciation,
  type AudioSource,
} from './services/PronunciationService';
import './styles.css';

// 单例：真实项目里由依赖注入 / context 提供，这里为演示直接实例化。
const repo = new VocabRepository();
const wordService = new WordService(repo);
const srs = new SrsService();

type Theme = 'light' | 'dark' | 'system';

// 每轮批次可选卡片数。
const SESSION_SIZES = [10, 30, 50, 100] as const;

const THEME_KEY = 'ielts-theme';
const THEME_ICON: Record<Theme, string> = {
  light: '☀',
  dark: '☾',
  system: '⚙',
};

// 词库虚拟列表：固定行高（卡片 72 + 间距 16）。
const BANK_ITEM_SIZE = 88;
const BANK_HEIGHT = 460;

function readInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {
    /* localStorage 不可用时回退到 system */
  }
  return 'system';
}

export default function App() {
  // ---------- 主题（light / dark / system） ----------
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* 忽略持久化失败 */
    }
  }, [theme]);

  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  // ---------- 学习会话（SessionService 编排） ----------
  const [band, setBand] = useState<Band>('5');
  const [sessionSize, setSessionSize] = useState<number>(10);
  const [session, setSession] = useState<SessionState | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'due' | 'all'>('due');
  const [bandTotal, setBandTotal] = useState(0);
  const [studiedDays, setStudiedDays] = useState<Set<string>>(new Set());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);

  // ---------- 多档案（本地账号） ----------
  const [profiles, setProfiles] = useState<Profile[]>([]);
  // 初始为空串：门控会话/日历加载，确保档案引导完成后再拉数据，避免错档。
  const [activeProfileId, setActiveProfileId] = useState<string>('');

  // 已掌握（会啦）词集合：驱动「不再出现」与计数展示。
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  // ref 始终保持最新集合，供 buildSession 在闭包中读取而不触发重新构建会话（避免中途重洗）。
  const masteredRef = useRef<Set<string>>(masteredIds);
  masteredRef.current = masteredIds;

  // 构建一次会话：seed → 取学习集合 → 建 session。band / size / mode 变化都会触发。
  async function buildSession(bandVal: Band, size: number, modeVal: 'due' | 'all' = 'due') {
    setLoading(true);
    await repo.seedOrRefresh(SEED_WORDS, SEED_VERSION); // 版本化刷新：内置词随版本自愈，导入词/进度不动
    const all = await wordService.filterByBand(bandVal);
    setBandTotal(all.length);
    const studySet = await wordService.getStudySet(srs, bandVal, Date.now(), modeVal, masteredRef.current);
    setSession(createSession(studySet, size));
    setRevealed(false);
    setLoading(false);
  }

  useEffect(() => {
    if (!activeProfileId) return; // 档案未就绪前不加载会话
    let cancelled = false;
    (async () => {
      setLoading(true);
      await repo.seedOrRefresh(SEED_WORDS, SEED_VERSION);
      const all = await wordService.filterByBand(band);
      if (cancelled) return;
      setBandTotal(all.length);
      const studySet = await wordService.getStudySet(srs, band, Date.now(), mode, masteredRef.current);
      if (cancelled) return;
      setSession(createSession(studySet, sessionSize));
      setRevealed(false);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [band, sessionSize, mode, activeProfileId]);

  // 首次挂载：把已学习过的日期读进日历（带 cancelled 守卫，与旧逻辑一致）。
  useEffect(() => {
    if (!activeProfileId) return; // 档案未就绪前不读取日历
    let cancelled = false;
    (async () => {
      const days = await repo.getStudiedDays();
      if (cancelled) return;
      setStudiedDays(new Set(days));
    })();
    return () => {
      cancelled = true;
    };
  }, [activeProfileId]);

  // 首次挂载：引导档案（首启建默认档案 + 恢复上次激活），再载入档案列表。
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const id = await repo.ensureDefaultProfile();
      if (cancelled) return;
      setActiveProfileId(id);
      setProfiles(await repo.listProfiles());
      setMasteredIds(await repo.getMasteredIds());
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const current = session ? currentCard(session) : null;
  const roundDone = !loading && session?.completed === true;
  const roundChoice = !loading && session?.roundComplete === true && !session.completed;
  const isEmpty = !loading && (session?.initialCount ?? 0) === 0;

  const [audioSource, setAudioSource] = useState<AudioSource | null>(null);

  function speak(term: string) {
    // 优先真人发音，取不到自动回退机器 TTS
    playPronunciation(term, { onSource: setAudioSource });
  }

  // 当前词切换时，后台预取真人发音 URL（命中缓存则跳过），让朗读秒出
  useEffect(() => {
    const term = current?.word.term;
    if (term) {
      setAudioSource(null);
      prefetchPronunciation(term);
    }
  }, [current?.word.term]);

  // ---------- 日历月份导航 ----------
  function stepMonth(delta: number) {
    const d = new Date(calYear, calMonth - 1 + delta, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth() + 1);
  }
  function goPrevMonth() {
    stepMonth(-1);
  }
  function goNextMonth() {
    stepMonth(1);
  }
  function goToday() {
    const d = new Date();
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth() + 1);
  }

  // ---------- 导出词表（CSV / Anki） ----------
  async function exportWords(format: 'csv' | 'anki', scope: 'current' | 'all') {
    const all = await repo.getAllWords();
    const words = scope === 'all' ? all : all.filter((w) => w.band === band);
    if (words.length === 0) return;
    const stamp = new Date().toISOString().slice(0, 10);
    const tag = scope === 'all' ? 'all' : `band${band}`;
    if (format === 'csv') {
      downloadFile(`ielts-vocab-${tag}-${stamp}.csv`, toCsv(words), 'text/csv;charset=utf-8');
    } else {
      downloadFile(`ielts-vocab-${tag}-${stamp}.txt`, toAnki(words), 'text/plain;charset=utf-8');
    }
  }

  async function handleGrade(grade: Grade) {
    const cur = session ? currentCard(session) : null;
    if (!cur) return;
    const nextCard = srs.grade(cur.card, grade);
    await repo.saveCard(cur.word.id, nextCard);
    setSession((prev) => (prev ? gradeSession(prev, grade) : prev));
    setRevealed(false);
    // 打卡：今天背过词 → 记录并即时让日历变紫
    const key = dateKey();
    await repo.recordStudyDay(key);
    setStudiedDays((prev) => {
      if (prev.has(key)) return prev;
      const n = new Set(prev);
      n.add(key);
      return n;
    });
  }

  // 「会啦！」：标记当前词为已掌握 → 从 FSRS 调度彻底移除 + 出队 + 记录今日学习。
  async function handleMastered() {
    const cur = session ? currentCard(session) : null;
    if (!cur) return;
    const wordId = cur.word.id;
    await repo.markMastered(wordId);
    await repo.deleteCard(wordId); // 彻底退出调度，永不再出现
    setSession((prev) => (prev ? dismissSession(prev) : prev));
    setRevealed(false);
    setMasteredIds((prev) => {
      const n = new Set(prev);
      n.add(wordId);
      return n;
    });
    // 打卡：算作今日学习，让日历保持活跃。
    const key = dateKey();
    await repo.recordStudyDay(key);
    setStudiedDays((prev) => {
      if (prev.has(key)) return prev;
      const n = new Set(prev);
      n.add(key);
      return n;
    });
  }

  // 撤销「会啦」：清空当前档案已掌握集合，并把词重新放回复习队列。
  async function handleResetMastered() {
    if (masteredIds.size === 0) return;
    const ok = window.confirm(
      `确定要取消「会啦」标记吗？\n这将把已掌握的 ${masteredIds.size} 个词重新放回复习队列。`,
    );
    if (!ok) return;
    await repo.resetMastered();
    setMasteredIds(new Set());
    await buildSession(band, sessionSize, mode);
  }

  // 一轮（10/30/50）背完后的选择点：「复习本轮回放（未会啦的词）」或「直接下一轮」。
  function handleReviewRound() {
    if (!session) return;
    // 本轮中未点「会啦」的词，重新排成队列复习。
    const unMasteredIds = session.roundCards
      .filter((c) => !masteredRef.current.has(c.word.id))
      .map((c) => c.word.id);
    setSession((prev) => (prev ? reviewSessionRound(prev, unMasteredIds) : prev));
    setRevealed(false);
  }
  function handleNextRound() {
    setSession((prev) => (prev ? nextSessionRound(prev) : prev));
    setRevealed(false);
  }

  // ---------- 多档案（本地账号）操作 ----------
  async function refreshProfiles() {
    setProfiles(await repo.listProfiles());
  }
  async function refreshMastered() {
    setMasteredIds(await repo.getMasteredIds());
  }
  function handleSwitchProfile(id: string) {
    if (id === activeProfileId) return;
    repo.setActiveProfile(id);
    setActiveProfileId(id); // 触发会话 + 日历按新档案重建
    void refreshMastered();
  }
  async function handleCreateProfile(name: string) {
    const p = await repo.createProfile(name);
    repo.setActiveProfile(p.id);
    setActiveProfileId(p.id); // 自动切到新建档案（全新进度）
    await refreshProfiles();
    await refreshMastered();
  }
  async function handleRenameProfile(id: string, name: string) {
    await repo.renameProfile(id, name);
    await refreshProfiles();
  }
  async function handleDeleteProfile(id: string) {
    await repo.deleteProfile(id);
    setActiveProfileId(repo.getActiveProfileId()); // deleteProfile 已回退到默认档案
    await refreshProfiles();
    await refreshMastered();
  }

  // ---------- 导入词表（模态） ----------
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    if (!showImport) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowImport(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showImport]);

  // ---------- 词库（虚拟列表浏览） ----------
  const [showBank, setShowBank] = useState(false);
  const [bankWords, setBankWords] = useState<VocabEntry[]>([]);
  const [bankLoading, setBankLoading] = useState(false);

  async function toggleBank() {
    const next = !showBank;
    setShowBank(next);
    if (next) {
      // 每次打开都重新拉取，确保反映最新导入结果。
      setBankLoading(true);
      try {
        const words = await repo.getAllWords();
        setBankWords(words);
      } finally {
        setBankLoading(false);
      }
    }
  }

  return (
    <div className="app" data-theme={resolvedTheme}>
      <div className="app-shell">
        <div className="app-main">
          <header className="app-header">
            <div>
              <h1 className="app-title">雅思分级背词器</h1>
              <p className="app-subtitle">柯林斯式闪卡 · FSRS 间隔重复 · 原生语音朗读</p>
            </div>
            <div className="header-controls">
              <ProfileSwitcher
                profiles={profiles}
                activeId={activeProfileId}
                onSwitch={handleSwitchProfile}
                onCreate={handleCreateProfile}
                onRename={handleRenameProfile}
                onDelete={handleDeleteProfile}
              />
              <div className="theme-switch" role="group" aria-label="主题切换">
                {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`theme-btn${theme === t ? ' is-active' : ''}`}
                    aria-pressed={theme === t}
                    onClick={() => setTheme(t)}
                  >
                    <span aria-hidden="true">{THEME_ICON[t]}</span>
                    {t === 'light' ? '浅色' : t === 'dark' ? '深色' : '跟随系统'}
                  </button>
                ))}
              </div>
              <div className="app-actions">
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => setShowImport(true)}
                >
                  导入词表
                </button>
                <button
                  type="button"
                  className={`action-btn${showBank ? ' is-active' : ''}`}
                  aria-pressed={showBank}
                  onClick={toggleBank}
                >
                  词库{showBank ? ' ▾' : ''}
                </button>
              </div>
            </div>
          </header>

          <BandSelector
            value={band}
            onChange={(b) => {
              if (b === band) return;
              setBand(b);
            }}
          />

          <div className="mode-switch" role="group" aria-label="学习范围">
            <button
              type="button"
              className={`mode-btn${mode === 'due' ? ' is-active' : ''}`}
              aria-pressed={mode === 'due'}
              onClick={() => setMode('due')}
            >
              仅到期
            </button>
            <button
              type="button"
              className={`mode-btn${mode === 'all' ? ' is-active' : ''}`}
              aria-pressed={mode === 'all'}
              onClick={() => setMode('all')}
            >
              全部本档
            </button>
          </div>
          <p className="mode-hint" aria-live="polite">
            {mode === 'due'
              ? '仅到期：只练习今天按记忆算法应当复习的单词，适合每天巩固已学内容。'
              : '全部本档：练习本档全部单词（含尚未学过的生词），适合集中刷词、扩充词库。'}
          </p>

          {masteredIds.size > 0 && (
            <p className="mastered-counter" aria-live="polite">
              <span aria-hidden="true">✨</span> 已掌握 {masteredIds.size} 词
              <button
                type="button"
                className="mastered-reset"
                onClick={handleResetMastered}
                title="取消所有「会啦」标记，把词重新放回复习队列"
              >
                撤销「会啦」
              </button>
            </p>
          )}

          <div className="size-selector" role="group" aria-label="每轮卡片数量">
            {SESSION_SIZES.map((n) => (
              <button
                key={n}
                type="button"
                className={`size-btn${sessionSize === n ? ' is-active' : ''}`}
                aria-pressed={sessionSize === n}
                onClick={() => setSessionSize(n)}
              >
                {n}
              </button>
            ))}
          </div>

          {!isEmpty && !roundDone && !roundChoice && session && (
            <div className="progress-row">
              <ProgressRing
                value={session.initialCount ? session.studiedTotal / session.initialCount : 0}
                label={`${session.studiedTotal}/${session.initialCount}`}
              />
              <div className="progress-meta">
                <span className="progress-count">
                  第 {session.batchNumber} 轮 · 本轮 {session.size - session.queue.length}/{session.size}
                </span>
                <span className="progress-hint">累计 {session.studiedTotal}/{session.initialCount} · Band {band} 档</span>
              </div>
            </div>
          )}

          {loading && <div className="loading-state">加载到期词队列…</div>}

          {!loading && current && (
            <Flashcard
              word={current.word}
              revealed={revealed}
              audioSource={audioSource}
              onReveal={() => setRevealed(true)}
              onGrade={handleGrade}
              onMastered={handleMastered}
              onSpeak={() => speak(current.word.term)}
            />
          )}

          {roundChoice && session && (
            <div className="round-choice glass" role="group" aria-label="本轮完成 · 选择下一步">
              <div className="rc-emoji" aria-hidden="true">🎯</div>
              <p className="rc-title">第 {session.batchNumber} 轮完成！</p>
              <p className="rc-sub">
                本轮共 {session.roundProcessed} 词
                {' · '}
                其中 {session.roundCards.filter((c) => !masteredIds.has(c.word.id)).length} 个未点「会啦」
              </p>
              <div className="rc-actions">
                <button
                  type="button"
                  className="rc-btn rc-review"
                  onClick={handleReviewRound}
                >
                  🔁 复习本轮回放
                  <span className="rc-btn-hint">
                    {session.roundCards.filter((c) => !masteredIds.has(c.word.id)).length > 0
                      ? `重背未会啦的 ${session.roundCards.filter((c) => !masteredIds.has(c.word.id)).length} 词`
                      : '本轮回放词都会啦了'}
                  </span>
                </button>
                <button
                  type="button"
                  className="rc-btn rc-next"
                  onClick={handleNextRound}
                >
                  下一轮 →
                  <span className="rc-btn-hint">跳过本轮回放，直接背下一批</span>
                </button>
              </div>
            </div>
          )}

          {isEmpty && bandTotal > 0 && mode === 'due' && (
            <div className="empty-state">
              <div className="empty-emoji">🎉</div>
              <p className="empty-title">本档词今天都复习完啦</p>
              <p className="empty-hint">
                它们还没到期，点下面按钮重学全部本档。
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setMode('all')}
              >
                复习全部本档
              </button>
            </div>
          )}

          {isEmpty && bandTotal === 0 && (
            <div className="empty-state">
              <div className="empty-emoji">🌱</div>
              <p className="empty-title">该档位暂无词</p>
              <p className="empty-text">先切到其他档位试试，或导入更多词。</p>
            </div>
          )}

          {isEmpty && mode === 'all' && bandTotal > 0 && (
            <div className="empty-state">
              <div className="empty-emoji">🌱</div>
              <p className="empty-title">本档暂无词</p>
              <p className="empty-text">稍后再来复习，或切到其他档位。</p>
            </div>
          )}

          {roundDone && (
            <div className="empty-state">
              <div className="empty-emoji">🎉</div>
              <p className="empty-title">本轮复习已完成</p>
              <p className="empty-text">
                温故知新，坚持就是胜利。明天再来或切换到其他档位继续。
              </p>
              <button
                type="button"
                className="ip-done"
                onClick={() => buildSession(band, sessionSize, mode)}
              >
                重新开始本档
              </button>
            </div>
          )}

          {showBank && (
            <motion.section
              className="bank-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              aria-label="词库浏览"
            >
              <div className="bank-head">
                <h2 className="bank-title">词库浏览</h2>
                <span className="bank-count">
                  {bankLoading ? '加载中…' : `${bankWords.length} 词`}
                </span>
              </div>
              {bankLoading ? (
                <div className="loading-state">读取词库…</div>
              ) : (
                <List
                  rowCount={bankWords.length}
                  rowHeight={BANK_ITEM_SIZE}
                  rowComponent={WordRow}
                  rowProps={{ words: bankWords }}
                  style={{ height: BANK_HEIGHT, width: '100%' }}
                  overscanCount={6}
                />
              )}
            </motion.section>
          )}
        </div>

        <aside className="app-aside">
          <section className="export glass" aria-label="导出词表">
            <div className="export-head">
              <h2 className="export-title">导出词表</h2>
              <span className="export-sub">当前档 Band {band} · {bandTotal} 词</span>
            </div>
            <div className="export-row">
              <button
                type="button"
                className="export-btn"
                onClick={() => exportWords('csv', 'current')}
              >
                CSV（当前档）
              </button>
              <button
                type="button"
                className="export-btn"
                onClick={() => exportWords('anki', 'current')}
              >
                Anki（当前档）
              </button>
            </div>
            <button
              type="button"
              className="export-btn export-btn-all"
              onClick={() => exportWords('csv', 'all')}
            >
              导出全部档（CSV）
            </button>
          </section>
          <Calendar
            studiedDays={studiedDays}
            year={calYear}
            month={calMonth}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
            onToday={goToday}
          />
        </aside>
      </div>

      {/* 导入词表模态：背景点击 / Esc / 关闭 均可退出 */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            className="modal-backdrop"
            onClick={() => setShowImport(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="presentation"
          >
            <div
              className="modal-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="导入词表"
              onClick={(e) => e.stopPropagation()}
            >
              <ImportPanel repo={repo} onClose={() => setShowImport(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 词库虚拟列表的每一行（react-window v2 的 rowComponent 形态）。
function WordRow({ index, style, words }: RowComponentProps<{ words: VocabEntry[] }>) {
  const w = words[index];
  if (!w) return null;
  return (
    <div style={style}>
      <div className="bank-card">
        <div className="bank-card-main">
          <span className="bank-term">{w.term}</span>
          <span className="bank-meaning">{w.meaningZh}</span>
        </div>
        <span className="fc-band-chip">Band {w.band}</span>
      </div>
    </div>
  );
}
