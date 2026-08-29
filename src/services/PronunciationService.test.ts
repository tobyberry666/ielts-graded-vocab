import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getAccent,
  pickAudioUrl,
  setAccent,
  youdaoAudioUrl,
} from './PronunciationService';

describe('pickAudioUrl', () => {
  it('按 us > uk > au > ca > any 的口音优先级挑选', () => {
    const phonetics = [
      { audio: 'https://x/media/en/hello-au.mp3' },
      { audio: 'https://x/media/en/hello-uk.mp3' },
      { audio: 'https://x/media/en/hello-us.mp3' },
      { audio: 'https://x/media/en/hello-ca.mp3' },
    ];
    expect(pickAudioUrl(phonetics)).toBe('https://x/media/en/hello-us.mp3');
  });

  it('当只有 au 时选择 au', () => {
    const phonetics = [
      { audio: '' },
      { audio: 'https://x/media/en/word-au.mp3' },
    ];
    expect(pickAudioUrl(phonetics)).toBe('https://x/media/en/word-au.mp3');
  });

  it('跳过空 audio 字段', () => {
    const phonetics = [
      { audio: '' },
      { audio: null },
      { audio: 'https://x/media/en/word-us.mp3' },
    ];
    expect(pickAudioUrl(phonetics)).toBe('https://x/media/en/word-us.mp3');
  });

  it('没有任何录音时返回 null', () => {
    expect(pickAudioUrl([])).toBeNull();
    expect(pickAudioUrl([{ audio: '' }, { audio: null }])).toBeNull();
  });

  it('无口音后缀（如 gstatic）作为最低优先级，仍低于 us', () => {
    const phonetics = [
      { audio: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello.mp3' },
      { audio: 'https://x/media/en/hello-us.mp3' },
    ];
    expect(pickAudioUrl(phonetics)).toBe('https://x/media/en/hello-us.mp3');
  });

  it('只有无后缀音频时仍被选中', () => {
    const phonetics = [
      { audio: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello.mp3' },
    ];
    expect(pickAudioUrl(phonetics)).toBe(
      'https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello.mp3',
    );
  });

  it('偏好英音时 uk/gb 优先于 us', () => {
    const phonetics = [
      { audio: 'https://x/media/en/hello-us.mp3' },
      { audio: 'https://x/media/en/hello-uk.mp3' },
    ];
    expect(pickAudioUrl(phonetics, 'uk')).toBe('https://x/media/en/hello-uk.mp3');
  });

  it('偏好英音时才退而求其次选 us', () => {
    const phonetics = [
      { audio: 'https://x/media/en/hello-us.mp3' },
      { audio: 'https://x/media/en/hello-au.mp3' },
    ];
    expect(pickAudioUrl(phonetics, 'uk')).toBe('https://x/media/en/hello-us.mp3');
  });
});

describe('youdaoAudioUrl', () => {
  it('英音用 type=2，美音用 type=1', () => {
    expect(youdaoAudioUrl('paradigm', 'uk')).toBe(
      'https://dict.youdao.com/dictvoice?audio=paradigm&type=2',
    );
    expect(youdaoAudioUrl('paradigm', 'us')).toBe(
      'https://dict.youdao.com/dictvoice?audio=paradigm&type=1',
    );
  });

  it('统一转小写并去掉首尾空格', () => {
    expect(youdaoAudioUrl('  Abandon  ', 'uk')).toBe(
      'https://dict.youdao.com/dictvoice?audio=abandon&type=2',
    );
  });

  it('对含特殊字符的词做 URL 编码', () => {
    expect(youdaoAudioUrl('well-being', 'us')).toBe(
      'https://dict.youdao.com/dictvoice?audio=well-being&type=1',
    );
    expect(youdaoAudioUrl('a b', 'us')).toContain('audio=a%20b');
  });
});

describe('口音偏好', () => {
  const store = new Map<string, string>();
  const hadLocalStorage = 'localStorage' in globalThis;

  beforeEach(() => {
    store.clear();
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
        removeItem: (k: string) => void store.delete(k),
        clear: () => store.clear(),
      },
    });
  });

  afterEach(() => {
    if (!hadLocalStorage) {
      Reflect.deleteProperty(globalThis, 'localStorage');
    }
  });

  it('默认英音', () => {
    expect(getAccent()).toBe('uk');
  });

  it('切换后能持久化读回', () => {
    setAccent('us');
    expect(getAccent()).toBe('us');
    expect(youdaoAudioUrl('paradigm', getAccent())).toContain('type=1');
    setAccent('uk');
    expect(getAccent()).toBe('uk');
  });

  it('存储里的脏值回退到英音', () => {
    store.set('ielts-accent-pref-v1', 'fr-FR');
    expect(getAccent()).toBe('uk');
  });
});
