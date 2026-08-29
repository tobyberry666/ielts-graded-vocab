// PronunciationService.ts
// 发音策略（三级降级，任意一级失败都安全落到下一级）：
//   1. 有道 dictvoice —— 直出 MP3，无需先解析 JSON，点一下 ~0.8s 出声，覆盖率极高；
//   2. dictionaryapi.dev（Wikimedia 真人录音）—— 开源兜底，3s 超时，失败不拖慢；
//   3. 浏览器内置 TTS —— 最后手段，会挑一个优质英文嗓音而不是用默认引擎。
// 设计要点：
//   - 主源 URL 是纯计算出来的，不发任何解析请求，点击即可开始下载音频；
//   - 解析请求有 in-flight 去重 + AbortController 超时，绝不出现「等 15 秒才有声」；
//   - 主源连续失败会熔断，避免整场学习每个词都走一遍失败路径；
//   - 口音偏好（英音/美音）持久化到 localStorage，换设备前一直生效。

export type AudioSource = 'human' | 'tts';

/** 口音偏好：uk = 英音（雅思听力主口音），us = 美音。 */
export type Accent = 'uk' | 'us';

// ---------------- 常量 ----------------
/** 有道发音：type=1 美音，type=2 英音。直出 audio/mpeg，可作为 <audio> src。 */
const YOUDAO_BASE = 'https://dict.youdao.com/dictvoice';
/** 开源兜底源（Wikimedia 真人录音的目录接口）。 */
const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

const CACHE_KEY = 'ielts-audio-cache-v1';
const ACCENT_KEY = 'ielts-accent-pref-v1';
const CACHE_CAP = 3000;
const TTS_SENTINEL = '__tts__';

/** 兜底源的解析超时：超时即放弃，绝不拖慢主流程。 */
const FALLBACK_TIMEOUT_MS = 3000;
/** 主源单次播放的最长等待：既没播放也没报错时强制判定失败。 */
const PLAY_TIMEOUT_MS = 7000;
/** 主源连续失败多少次后熔断（本次会话内不再尝试主源）。 */
const PRIMARY_FAIL_LIMIT = 3;
/** 短于此长度的音频视为「空音频」，判定为失败（有道对无收录词会返回极短片段）。 */
const MIN_AUDIO_SECONDS = 0.2;

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
 * 按偏好口音给某个录音 URL 打分。
 * 偏好分必须严格高于所有基础分（基础分最高 4），否则遇到「us 排在 uk 前面」
 * 这类顺序时，等值不会被严格大于比较替换掉，偏好就失效了。
 */
const PREFERRED_SCORE = 10;

function scoreOf(url: string, preferred: Accent): number {
  const a = accentOf(url);
  if (a === 'any') return 0;
  const target = preferred === 'uk' ? ['uk', 'gb'] : ['us'];
  if (target.includes(a)) return PREFERRED_SCORE;
  return ACCENT_SCORE[a] ?? 0;
}

/**
 * 从一组音标里挑出最合适的一个真人录音 URL。
 * 纯函数，便于单测；无可用录音时返回 null。
 */
export function pickAudioUrl(
  phonetics: PhoneticLike[],
  preferred: Accent = 'us',
): string | null {
  let best: string | null = null;
  let bestScore = -1;
  for (const p of phonetics) {
    const a = p?.audio;
    if (!a || typeof a !== 'string' || a.trim() === '') continue;
    const score = scoreOf(a, preferred);
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return best;
}

/** 有道发音地址。纯字符串拼接，零网络开销。 */
export function youdaoAudioUrl(term: string, accent: Accent): string {
  return `${YOUDAO_BASE}?audio=${encodeURIComponent(term.toLowerCase().trim())}&type=${
    accent === 'uk' ? 2 : 1
  }`;
}

// ---------------- 口音偏好 ----------------
/** 读取口音偏好；localStorage 不可用（SSR / 隐私模式）时回退英音。 */
export function getAccent(): Accent {
  try {
    return localStorage.getItem(ACCENT_KEY) === 'us' ? 'us' : 'uk';
  } catch {
    return 'uk';
  }
}

export function setAccent(accent: Accent): void {
  try {
    localStorage.setItem(ACCENT_KEY, accent);
  } catch {
    /* localStorage 不可用时仅本次会话生效 */
  }
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
  return loadCache()[keyOf(term)];
}

function cacheSet(term: string, value: string): void {
  const map = loadCache();
  map[keyOf(term)] = value;
  saveCache(map);
}

const keyOf = (term: string): string => term.toLowerCase().trim();

// ---------------- 播放控制 ----------------
let currentAudio: HTMLAudioElement | null = null;
/** 主源连续失败计数，达到阈值后熔断。 */
let primaryFailures = 0;

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

// ---------------- 机器 TTS（最后手段，但也要挑个好听的） ----------------
/** 优质英文嗓音关键词，命中即加分，避免用默认引擎的机械音读单词。 */
const VOICE_HINTS = [
  'aria',
  'jenny',
  'sonia',
  'libby',
  'hazel',
  'ryan',
  'google uk english female',
  'google us english',
  'samantha',
  'zira',
  'karen',
  'daniel',
];

// undefined = 尚未挑选（voices 可能还没加载完）；null = 挑过但没有英文嗓音。
let preferredVoice: SpeechSynthesisVoice | null | undefined;

/** 按「口音匹配 > 嗓音质量 > 离线可用」打分挑一个英文嗓音。 */
export function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (preferredVoice !== undefined) return preferredVoice;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    preferredVoice = null;
    return null;
  }
  const voices = window.speechSynthesis.getVoices() ?? [];
  // 首次调用时 voices 常为空数组，此时不落缓存，等 voiceschanged 后再挑。
  if (voices.length === 0) return null;

  const wantLang = getAccent() === 'uk' ? 'en-gb' : 'en-us';
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;

  for (const v of voices) {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    if (!lang.startsWith('en')) continue;
    let score = 1;
    if (lang === wantLang) score += 5;
    else if (lang.startsWith('en-gb')) score += 4;
    else if (lang.startsWith('en-us')) score += 3;
    const name = (v.name || '').toLowerCase();
    if (VOICE_HINTS.some((h) => name.includes(h))) score += 4;
    if (name.includes('female')) score += 1;
    if (v.localService) score += 1; // 离线可用更稳
    if (score > bestScore) {
      bestScore = score;
      best = v;
    }
  }

  preferredVoice = best;
  return best;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // 嗓音列表是异步加载的，加载完要允许重新挑选。
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    preferredVoice = undefined;
  });
}

function playTts(term: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(term);
  u.lang = getAccent() === 'uk' ? 'en-GB' : 'en-US';
  const voice = pickEnglishVoice();
  if (voice) u.voice = voice;
  // 背单词场景下稍慢一点更清楚；默认 1.0 读单词容易含糊。
  u.rate = 0.95;
  u.pitch = 1;
  try {
    synth.cancel();
  } catch {
    /* 忽略 */
  }
  synth.speak(u);
}

/**
 * 播放一个音频 URL。resolve(true) 表示已真正开始出声。
 * 失败（加载错误 / 空音频 / 超时）resolve(false)，交给调用方降级。
 */
function playUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof Audio === 'undefined') {
      resolve(false);
      return;
    }
    const audio = new Audio();
    currentAudio = audio;
    let settled = false;

    const settle = (ok: boolean) => {
      if (settled) return;
      settled = true;
      if (!ok && currentAudio === audio) currentAudio = null;
      resolve(ok);
    };

    audio.preload = 'auto';
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
    };
    audio.onplaying = () => settle(true);
    audio.onloadedmetadata = () => {
      // 空/极短音频视为无收录，降级而不是让用户听到一声「咔」
      const d = audio.duration;
      if (typeof d === 'number' && Number.isFinite(d) && d < MIN_AUDIO_SECONDS) {
        try {
          audio.pause();
        } catch {
          /* 忽略 */
        }
        settle(false);
      }
    };
    audio.onerror = () => settle(false);

    audio.src = url;
    let p: Promise<void> | undefined;
    try {
      p = audio.play() as unknown as Promise<void>;
    } catch {
      settle(false);
      return;
    }
    if (p && typeof p.catch === 'function') {
      p.catch(() => settle(false));
    }
    // 兜底超时：既没 playing 也没 error（例如网络挂住）时强制降级
    setTimeout(() => settle(false), PLAY_TIMEOUT_MS);
  });
}

/**
 * 解析某词的开源真人录音 URL（带缓存与 in-flight 去重）。不播放。
 * - 命中缓存直接返回；
 * - 404（词库无收录）缓存为 TTS_SENTINEL 并返回 null；
 * - 其它网络/服务端错误不缓存，返回 null（允许下次重试）。
 */
const inflight = new Map<string, Promise<string | null>>();

export function resolveAudioUrl(
  term: string,
  accent: Accent = getAccent(),
): Promise<string | null> {
  const key = keyOf(term);
  const cached = cacheGet(key);
  if (cached !== undefined) return Promise.resolve(cached === TTS_SENTINEL ? null : cached);

  const pending = inflight.get(key);
  if (pending) return pending;

  const task = (async (): Promise<string | null> => {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), FALLBACK_TIMEOUT_MS);
      try {
        const res = await fetch(`${API_BASE}/${encodeURIComponent(key)}`, {
          headers: { Accept: 'application/json' },
          signal: ctrl.signal,
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
        const url = pickAudioUrl(phonetics, accent);
        if (url) {
          cacheSet(key, url);
          return url;
        }
        cacheSet(key, TTS_SENTINEL);
        return null;
      } finally {
        clearTimeout(timer);
      }
    } catch {
      // 超时 / 网络异常：不缓存，回退下一级
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, task);
  return task;
}

// ---------------- 预热 ----------------
let preconnected = false;

/** 提前与主源握手（DNS + TLS），省掉首次播放的 RTT。 */
function ensurePreconnect(): void {
  if (preconnected || typeof document === 'undefined') return;
  preconnected = true;
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://dict.youdao.com';
  document.head.appendChild(link);
}

/** 预热池：切词时把音频拉进浏览器 HTTP 缓存，点击时几乎零延迟。 */
const warmPool = new Map<string, HTMLAudioElement>();
const WARM_CAP = 8;

/**
 * 后台预热当前词的发音，让点击朗读时秒出真人音。不播放、不阻塞。
 * 命中预热池则跳过；超出容量时淘汰最早的一个，避免占内存。
 */
export function prefetchPronunciation(term: string): void {
  const key = keyOf(term);
  if (!key || typeof Audio === 'undefined') return;
  ensurePreconnect();
  const url = youdaoAudioUrl(key, getAccent());
  if (warmPool.has(url)) return;
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = url;
  warmPool.set(url, audio);
  if (warmPool.size > WARM_CAP) {
    const oldest = warmPool.keys().next().value;
    if (oldest !== undefined) {
      const old = warmPool.get(oldest);
      if (old) old.src = '';
      warmPool.delete(oldest);
    }
  }
}

/** 切换口音后清掉旧口音的预热音频。 */
export function clearWarmPool(): void {
  warmPool.forEach((a) => {
    a.src = '';
  });
  warmPool.clear();
}

// ---------------- 对外主入口 ----------------
export interface PlayOptions {
  onSource?: (source: AudioSource) => void;
}

/**
 * 播放发音：有道真人 → 开源真人录音 → 机器 TTS。
 * 主源 URL 是本地计算的，点击后立刻开始拉取音频，无需先等一次 JSON 解析。
 */
export async function playPronunciation(
  term: string,
  opts: PlayOptions = {},
): Promise<void> {
  stopAll();
  const key = keyOf(term);
  if (!key) return;
  const accent = getAccent();

  // 1) 主源：有道真人发音（未熔断时）
  if (primaryFailures < PRIMARY_FAIL_LIMIT) {
    ensurePreconnect();
    if (await playUrl(youdaoAudioUrl(key, accent))) {
      primaryFailures = 0;
      opts.onSource?.('human');
      return;
    }
    primaryFailures += 1;
  }

  // 2) 兜底源：开源词典真人录音（3s 超时）
  const url = await resolveAudioUrl(key, accent);
  if (url && (await playUrl(url))) {
    opts.onSource?.('human');
    return;
  }

  // 3) 最后手段：机器 TTS（挑优质英文嗓音）
  opts.onSource?.('tts');
  playTts(term);
}
