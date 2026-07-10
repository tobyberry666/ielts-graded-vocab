// PronunciationService.ts
// 发音策略：优先播放真人录音（来自 dictionaryapi.dev / Wikimedia Commons 的真实发音），
// 取不到（词库未收录 / 网络异常）时回退到浏览器内置的机器 TTS。
// 设计要点：
//  - 真人录音按需拉取并缓存到 localStorage，避免重复请求；
//  - 口音优先级 us > uk > au > ca（用户说英音美音皆可，挑一个稳定口音即可）；
//  - 任何一步失败都安全回退到 TTS，保证「点一下总能听到读音」。

export type AudioSource = 'human' | 'tts';

const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const CACHE_KEY = 'ielts-audio-cache-v1';
const CACHE_CAP = 3000;
const TTS_SENTINEL = '__tts__';

interface PhoneticLike {
  audio?: string | null;
  text?: string | null;
}

interface DictEntry {
  phonetics?: PhoneticLike[];
}

// 口音评分：分数越高越优先。文件名里通常带 -(us|uk|au|ca|nz)- 后缀。
const ACCENT_SCORE: Record<string, number> = {
  us: 4,
  uk: 3,
  gb: 3,
  au: 2,
  ca: 1,
  nz: 1,
};

function accentOf(url: string): string {
  // 匹配形如 word-us.mp3 / word-uk-extra.mp3 中的口音标记
  const m = url.match(/[-/](us|uk|gb|au|ca|nz)(?=\.mp3|-)/i);
  return m ? m[1].toLowerCase() : 'any';
}

/**
 * 从一组音标里挑出最合适的一个真人录音 URL。
 * 纯函数，便于单测；无可用录音时返回 null。
 */
export function pickAudioUrl(phonetics: PhoneticLike[]): string | null {
  let best: string | null = null;
  let bestScore = -1;
  for (const p of phonetics) {
    const a = p?.audio;
    if (!a || typeof a !== 'string' || a.trim() === '') continue;
    const score = ACCENT_SCORE[accentOf(a)] ?? 0;
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return best;
}

// ---------------- 缓存（localStorage + 内存） ----------------
type CacheMap = Record<string, string>; // term(小写) -> 音频URL 或 TTS_SENTINEL

let memCache: CacheMap | null = null;

function loadCache(): CacheMap {
  if (memCache) return memCache;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    memCache = raw ? (JSON.parse(raw) as CacheMap) : {};
  } catch {
    memCache = {};
  }
  return memCache;
}

function saveCache(map: CacheMap): void {
  try {
    // 超过容量则重置，避免无限膨胀挤占配额
    if (Object.keys(map).length > CACHE_CAP) map = {};
    localStorage.setItem(CACHE_KEY, JSON.stringify(map));
  } catch {
    // 配额不足时忽略，不影响播放
  }
}

function cacheGet(term: string): string | undefined {
  return loadCache()[term.toLowerCase().trim()];
}

function cacheSet(term: string, value: string): void {
  const map = loadCache();
  map[term.toLowerCase().trim()] = value;
  saveCache(map);
}

const keyOf = (term: string): string => term.toLowerCase().trim();

// ---------------- 播放控制 ----------------
let currentAudio: HTMLAudioElement | null = null;

function stopAll(): void {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* 忽略 */
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch {
      /* 忽略 */
    }
    currentAudio = null;
  }
}

function playTts(term: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(term);
  u.lang = 'en-GB';
  window.speechSynthesis.speak(u);
}

/**
 * 播放真人录音；若加载/播放失败则回退机器 TTS。
 * 返回 Promise 以便调用方 await（仅用于流程编排，不阻塞 UI）。
 */
function playHuman(url: string, term: string): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio();
    currentAudio = audio;
    audio.src = url;
    let finished = false;
    const finish = () => {
      if (currentAudio === audio) currentAudio = null;
      if (!finished) {
        finished = true;
        resolve();
      }
    };
    audio.onended = finish;
    audio.onerror = () => {
      finish();
      playTts(term);
    };
    const p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        finish();
        playTts(term);
      });
    }
  });
}

/**
 * 解析某词的真人录音 URL（带缓存）。不播放。
 * - 命中缓存直接返回；
 * - 404（词库无收录）缓存为 TTS_SENTINEL 并返回 null；
 * - 其它网络/服务端错误不缓存，返回 null（允许下次重试）。
 */
export async function resolveAudioUrl(term: string): Promise<string | null> {
  const key = keyOf(term);
  const cached = cacheGet(key);
  if (cached !== undefined) return cached === TTS_SENTINEL ? null : cached;

  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(key)}`, {
      headers: { Accept: 'application/json' },
    });
    if (res.status === 404) {
      cacheSet(key, TTS_SENTINEL);
      return null;
    }
    if (!res.ok) {
      // 429 / 5xx 等：本次回退 TTS，但不缓存，下次可重试
      return null;
    }
    const data: unknown = await res.json();
    const entries = (Array.isArray(data) ? data : []) as DictEntry[];
    const phonetics = entries.flatMap((e) => e.phonetics ?? []);
    const url = pickAudioUrl(phonetics);
    if (url) {
      cacheSet(key, url);
      return url;
    }
    cacheSet(key, TTS_SENTINEL);
    return null;
  } catch {
    // 网络异常：不缓存，回退 TTS
    return null;
  }
}

/** 后台预取当前词的发音 URL，让点击朗读时秒出真人音。不播放、不阻塞。 */
export function prefetchPronunciation(term: string): void {
  if (cacheGet(keyOf(term)) !== undefined) return;
  void resolveAudioUrl(term).catch(() => {});
}

export interface PlayOptions {
  onSource?: (source: AudioSource) => void;
}

/**
 * 播放发音：优先真人录音，取不到则机器 TTS。
 */
export async function playPronunciation(
  term: string,
  opts: PlayOptions = {},
): Promise<void> {
  stopAll();
  const key = keyOf(term);
  const cached = cacheGet(key);

  if (cached && cached !== TTS_SENTINEL) {
    opts.onSource?.('human');
    await playHuman(cached, term);
    return;
  }
  if (cached === TTS_SENTINEL) {
    opts.onSource?.('tts');
    playTts(term);
    return;
  }

  const url = await resolveAudioUrl(term);
  if (url) {
    opts.onSource?.('human');
    await playHuman(url, term);
  } else {
    opts.onSource?.('tts');
    playTts(term);
  }
}
