// 降级链路测试：有道真人 → 开源真人录音 → 机器 TTS。
// 这是「点发音要等十几秒 / 老是机器音」的根治点，用测试锁住行为。
// 所有浏览器 API 都用桩件替换，跑在 node 环境下，不依赖真实网络。

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

type Behavior = 'ok' | 'error' | 'empty';

/** 记录每次尝试播放的 URL，用来断言主源是否被跳过（熔断）。 */
const attempts: string[] = [];
// 按「第几次播放」指定成功/失败：队列消费完后回落到 defaultBehavior。
// 主源与兜底源共用播放器，必须用队列才能表达「主源失败、兜底成功」。
let behaviorQueue: Behavior[] = [];
let defaultBehavior: Behavior = 'ok';

class FakeAudio {
  preload = '';
  src = '';
  duration = NaN;
  onended: (() => void) | null = null;
  onplaying: (() => void) | null = null;
  onloadedmetadata: (() => void) | null = null;
  onerror: (() => void) | null = null;

  play(): Promise<void> {
    if (this.src) attempts.push(this.src);
    const behavior = behaviorQueue.length > 0 ? behaviorQueue.shift()! : defaultBehavior;
    if (behavior === 'error') {
      queueMicrotask(() => this.onerror?.());
      return Promise.resolve();
    }
    if (behavior === 'empty') {
      this.duration = 0.05;
      queueMicrotask(() => this.onloadedmetadata?.());
      return Promise.resolve();
    }
    queueMicrotask(() => this.onplaying?.());
    return Promise.resolve();
  }

  pause(): void {}
}

const spoken: string[] = [];
const synth = {
  cancel: vi.fn(),
  speak: (u: { text: string }) => void spoken.push(u.text),
  addEventListener: vi.fn(),
  getVoices: () => [],
};

const store = new Map<string, string>();
let fallbackEntries: unknown = [];
let fallbackStatus = 200;

class FakeUtterance {
  text: string;
  lang = '';
  voice: unknown = null;
  rate = 1;
  pitch = 1;
  constructor(text: string) {
    this.text = text;
  }
}

// 必须在 import 被测试模块之前装好桩件：模块顶层会读 window / localStorage。
(globalThis as Record<string, unknown>).window = { speechSynthesis: synth };
(globalThis as Record<string, unknown>).SpeechSynthesisUtterance = FakeUtterance;
(globalThis as Record<string, unknown>).Audio = FakeAudio;
(globalThis as Record<string, unknown>).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
};
(globalThis as Record<string, unknown>).fetch = vi.fn(async () => ({
  status: fallbackStatus,
  ok: fallbackStatus >= 200 && fallbackStatus < 300,
  json: async () => fallbackEntries,
}));

const { playPronunciation } = await import('./PronunciationService');

beforeEach(() => {
  attempts.length = 0;
  spoken.length = 0;
  store.clear();
  behaviorQueue = [];
  defaultBehavior = 'ok';
  fallbackStatus = 200;
  fallbackEntries = [];
  synth.cancel.mockClear();
});

afterEach(() => {
  // 用 clearAllMocks 而非 restoreAllMocks：后者会连 fetch 桩的实现一起清掉，
  // 导致第二个用例起 fetch 返回 undefined。
  vi.clearAllMocks();
});

describe('发音降级链路', () => {
  it('主源可用时直接播有道真人音，且不再去请求兜底源', async () => {
    const sources: string[] = [];

    await playPronunciation('paradigm', { onSource: (s) => sources.push(s) });

    expect(sources).toEqual(['human']);
    expect(attempts).toHaveLength(1);
    expect(attempts[0]).toContain('dict.youdao.com/dictvoice');
    expect(attempts[0]).toContain('type=2'); // 默认英音
    expect(fetch).not.toHaveBeenCalled(); // 主源成功就绝不多发请求
  });

  it('主源失败时降级到开源真人录音，不直接掉机器音', async () => {
    const sources: string[] = [];
    behaviorQueue = ['error', 'ok']; // 主源失败，兜底源成功
    fallbackEntries = [
      { phonetics: [{ audio: 'https://x/media/en/paradigm-uk.mp3' }, { audio: '' }] },
    ];

    await playPronunciation('metaphor', { onSource: (s) => sources.push(s) });

    expect(sources).toEqual(['human']);
    expect(attempts[0]).toContain('dict.youdao.com/dictvoice'); // 先试主源
    expect(attempts[1]).toBe('https://x/media/en/paradigm-uk.mp3'); // 再试兜底
    expect(spoken).toHaveLength(0); // 没掉到机器音
  });

  it('有道返回空音频（无收录）时也算失败并降级', async () => {
    const sources: string[] = [];
    behaviorQueue = ['empty', 'ok'];
    fallbackEntries = [{ phonetics: [{ audio: 'https://x/media/en/eulogy-us.mp3' }] }];

    await playPronunciation('eulogy', { onSource: (s) => sources.push(s) });

    expect(sources).toEqual(['human']);
    expect(attempts[1]).toBe('https://x/media/en/eulogy-us.mp3');
  });

  it('真人音全部拿不到时才用机器 TTS', async () => {
    const sources: string[] = [];
    behaviorQueue = ['error'];
    fallbackStatus = 404; // 开源源也没有该词

    await playPronunciation('zeugma', { onSource: (s) => sources.push(s) });

    expect(sources).toEqual(['tts']);
    expect(spoken).toEqual(['zeugma']);
  });

  // 熔断计数是模块级状态，在本文件内跨用例共享，故放在最后。
  it('主源连续失败后熔断，后续词不再白等主源', async () => {
    defaultBehavior = 'error';
    fallbackStatus = 404;

    await playPronunciation('w1', {});
    await playPronunciation('w2', {});
    await playPronunciation('w3', {});

    // 熔断已触发：后续词应直接跳过主源
    attempts.length = 0;
    spoken.length = 0;
    await playPronunciation('w4', {});

    expect(attempts).toHaveLength(0); // 一次都没碰主源
    expect(spoken).toEqual(['w4']);
  });
});
