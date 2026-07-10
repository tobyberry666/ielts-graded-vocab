import { describe, it, expect } from 'vitest';
import { pickAudioUrl } from './PronunciationService';

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
});
