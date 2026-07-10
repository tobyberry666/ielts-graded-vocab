import { motion, useReducedMotion } from 'framer-motion';
import type { VocabEntry } from '../data/words';
import type { Grade } from '../services/SrsService';

export interface FlashcardProps {
  word: VocabEntry;
  /** 是否已翻到背面（显示释义）。 */
  revealed: boolean;
  /** 点击正面「显示释义」时触发。 */
  onReveal: () => void;
  /** 在背面打分（again/hard/good/easy）时触发。 */
  onGrade: (grade: Grade) => void;
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

export default function Flashcard({ word, revealed, onReveal, onGrade, onSpeak }: FlashcardProps) {
  const reduceMotion = useReducedMotion();
  const flipTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

  return (
    <div className="fc-scene">
      <motion.div
        className="fc-inner"
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={flipTransition}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 正面：term + phonetic + pos */}
        <button
          type="button"
          className="fc-face fc-front"
          onClick={onReveal}
          aria-label="显示释义"
        >
          <div className="fc-front-top">
            <span className="fc-band-chip">Band {word.band}</span>
            <SpeakButton onClick={onSpeak} />
          </div>
          <h2 className="fc-term">{word.term}</h2>
          {word.phonetic && <p className="fc-phonetic">{word.phonetic}</p>}
          {word.pos && <span className="fc-pos-badge fc-pos-badge-front">{word.pos}</span>}
          <span className="fc-reveal-hint">点击卡片显示释义</span>
        </button>

        {/* 背面：词性徽章 + 释义 + 搭配 + 中英双语例句，附打分按钮 */}
        <div className="fc-face fc-back">
          <div className="fc-front-top">
            <div className="fc-back-head">
              <h3 className="fc-back-term">{word.term}</h3>
              {word.pos && <span className="fc-pos-badge">{word.pos}</span>}
            </div>
            <SpeakButton onClick={onSpeak} />
          </div>

          <div className="fc-body">
            <div className="fc-meaning">
              <span className="fc-meaning-zh">{word.meaningZh}</span>
              {word.meaningEn && <span className="fc-meaning-en">{word.meaningEn}</span>}
            </div>

            {word.collocations.length > 0 && (
              <div className="fc-block">
                <span className="fc-label">搭配 · Collocations</span>
                <p className="fc-collocations">{word.collocations.join('；')}</p>
              </div>
            )}

            {word.example && (
              <div className="fc-block fc-example-block">
                <span className="fc-label">例句 · Example</span>
                <p className="fc-example">{word.example}</p>
                {word.exampleZh && <p className="fc-example-zh">{word.exampleZh}</p>}
              </div>
            )}

            {!word.pos && !word.example && !word.meaningEn && (
              <p className="fc-note">该词暂仅有中文释义，词性与双语例句将在后续补充。</p>
            )}
          </div>

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
