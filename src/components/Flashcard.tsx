import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getSenses, primarySense, type VocabEntry } from '../data/words';
import type { Grade } from '../services/SrsService';
import type { AudioSource } from '../services/PronunciationService';

export interface FlashcardProps {
  word: VocabEntry;
  /** 是否已翻到背面（显示释义）。 */
  revealed: boolean;
  /** 当前朗读来源：真人发音 / 机器 TTS；null 表示尚未播放。 */
  audioSource?: AudioSource | null;
  /** 点击正面「显示释义」时触发。 */
  onReveal: () => void;
  /** 在背面打分（again/hard/good/easy）时触发。 */
  onGrade: (grade: Grade) => void;
  /** 点击「会啦！」标记已掌握、从此不再出现时触发。 */
  onMastered: () => void;
  /** 点击朗读按钮时触发原生语音。 */
  onSpeak: () => void;
}

const GRADES: { grade: Grade; label: string; hint: string }[] = [
  { grade: 'again', label: '忘记', hint: 'Again' },
  { grade: 'hard', label: '困难', hint: 'Hard' },
  { grade: 'good', label: '良好', hint: 'Good' },
  { grade: 'easy', label: '简单', hint: 'Easy' },
];

function SpeakButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="fc-speak"
      aria-label="朗读单词"
      title="朗读"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
        <path
          d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </button>
  );
}

function SourcePill({ source }: { source: AudioSource }) {
  const isHuman = source === 'human';
  return (
    <span
      className={`fc-source-pill ${isHuman ? 'is-human' : 'is-tts'}`}
      title={isHuman ? '真人发音' : '机器发音'}
      aria-label={isHuman ? '真人发音' : '机器发音'}
    >
      {isHuman ? '真人' : '机器'}
    </span>
  );
}

/** 单个义项（一个词性 + 释义 + 搭配 + 双语例句）。 */
function SenseBlock({
  sense,
  index,
  total,
}: {
  sense: ReturnType<typeof getSenses>[number];
  index: number;
  total: number;
}) {
  return (
    <article className="fc-sense">
      <div className="fc-sense-head">
        {sense.pos && <span className="fc-pos-badge">{sense.pos}</span>}
        {total > 1 && <span className="fc-sense-index">释义 {index + 1}</span>}
      </div>

      <div className="fc-meaning">
        <span className="fc-meaning-zh">{sense.meaningZh}</span>
        {sense.meaningEn && <span className="fc-meaning-en">{sense.meaningEn}</span>}
      </div>

      {sense.collocations.length > 0 && (
        <div className="fc-block">
          <span className="fc-label">搭配 · Collocations</span>
          <p className="fc-collocations">{sense.collocations.join('；')}</p>
        </div>
      )}

      {sense.example && (
        <div className="fc-block fc-example-block">
          <span className="fc-label">例句 · Example</span>
          <p className="fc-example">{sense.example}</p>
          {sense.exampleZh && <p className="fc-example-zh">{sense.exampleZh}</p>}
        </div>
      )}
    </article>
  );
}

export default function Flashcard({ word, revealed, audioSource, onReveal, onGrade, onMastered, onSpeak }: FlashcardProps) {
  const reduceMotion = useReducedMotion();
  const flipTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

  // 未翻面时把背面整体设为 inert，禁止键盘用户 Tab 到背面打分/「会啦」按钮（a11y）。
  const backRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (backRef.current) backRef.current.inert = !revealed;
  }, [revealed]);

  const senses = getSenses(word);
  const primary = primarySense(word);

  return (
    <div className="fc-scene">
      <motion.div
        className="fc-inner"
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={flipTransition}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 正面：term + phonetic + 主词性 */}
        <button
          type="button"
          className="fc-face fc-front"
          onClick={onReveal}
          aria-label="显示释义"
        >
          <div className="fc-front-top">
            <span className="fc-band-chip">Band {word.band}</span>
            <div className="fc-front-actions">
              {audioSource && <SourcePill source={audioSource} />}
              <SpeakButton onClick={onSpeak} />
            </div>
          </div>
          <h2 className="fc-term">{word.term}</h2>
          {word.phonetic && <p className="fc-phonetic">{word.phonetic}</p>}
          {primary.pos && <span className="fc-pos-badge fc-pos-badge-front">{primary.pos}</span>}
          <span className="fc-reveal-hint">
            {senses.length > 1 ? `点击卡片显示释义（共 ${senses.length} 个义项）` : '点击卡片显示释义'}
          </span>
        </button>

        {/* 背面：逐义项展示（词性 + 释义 + 搭配 + 双语例句），可滚动 */}
        <div className="fc-face fc-back" ref={backRef}>
          <div className="fc-front-top">
            <div className="fc-back-head">
              <h3 className="fc-back-term">{word.term}</h3>
              {primary.pos && <span className="fc-pos-badge">{primary.pos}</span>}
            </div>
            <div className="fc-front-actions">
              {audioSource && <SourcePill source={audioSource} />}
              <SpeakButton onClick={onSpeak} />
            </div>
          </div>

          <div className="fc-body fc-senses">
            {senses.map((sense, i) => (
              <SenseBlock key={i} sense={sense} index={i} total={senses.length} />
            ))}
          </div>

          <button
            type="button"
            className="fc-mastered"
            onClick={onMastered}
            title="我会了，这个词以后不再出现"
          >
            <span className="fc-mastered-emoji" aria-hidden="true">✨</span>
            会啦！
          </button>

          <div className="fc-grades">
            {GRADES.map(({ grade, label, hint }) => (
              <button
                key={grade}
                type="button"
                className={`fc-grade fc-grade-${grade}`}
                onClick={() => onGrade(grade)}
              >
                <span className="fc-grade-label">{label}</span>
                <span className="fc-grade-hint">{hint}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
