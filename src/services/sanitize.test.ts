import { describe, it, expect } from 'vitest';
import { escapeHtml, safeParseWord, type ParseResult } from './sanitize';
import type { VocabEntry } from '../data/words';

function validWord(overrides: Partial<VocabEntry> = {}): VocabEntry {
  return {
    id: 'analyse',
    term: 'analyse',
    phonetic: '/ˈænəlaɪz/',
    pos: 'v.',
    meaningZh: '分析',
    meaningEn: 'to examine something in detail',
    band: '5',
    collocations: ['analyse data', 'analyse the cause'],
    example: 'We need to analyse the results.',
    exampleZh: '我们需要分析这些结果。',
    ...overrides,
  };
}

describe('escapeHtml（XSS 转义红线）', () => {
  it('转义全部五种危险字符', () => {
    const out = escapeHtml(`<a href="x">&'y</a>`);
    expect(out).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&#39;y&lt;/a&gt;');
  });

  it('XSS 字符串经转义后不再包含 <script>', () => {
    const xss = `<script>alert('xss')</script>`;
    const escaped = escapeHtml(xss);
    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;script&gt;');
    expect(escaped).not.toContain('<');
  });

  it('纯文本保持不变', () => {
    expect(escapeHtml('Hello, world!')).toBe('Hello, world!');
  });
});

describe('safeParseWord（入库前校验红线）', () => {
  it('正常输入返回 ok:true 且 value 与入参结构一致', () => {
    const input = validWord();
    const result = safeParseWord(input) as Extract<ParseResult, { ok: true }>;
    expect(result.ok).toBe(true);
    expect(result.value).toEqual(input);
  });

  it('缺字段返回 ok:false', () => {
    const { meaningZh: _drop, ...rest } = validWord() as VocabEntry;
    const result = safeParseWord(rest) as Extract<ParseResult, { ok: false }>;
    expect(result.ok).toBe(false);
    expect(result.error).toContain('meaningZh');
  });

  it('字段类型错误（band 非字符串枚举）返回 ok:false', () => {
    const bad = validWord({ band: '99' as VocabEntry['band'] });
    const result = safeParseWord(bad);
    expect(result.ok).toBe(false);
  });

  it('collocations 非字符串数组返回 ok:false', () => {
    const bad = { ...validWord(), collocations: ['ok', 123] } as unknown as VocabEntry;
    const result = safeParseWord(bad);
    expect(result.ok).toBe(false);
  });

  it('疑似 <script> 注入返回 ok:false', () => {
    const evil = validWord({ meaningZh: '<script>alert(1)</script>' });
    const result = safeParseWord(evil);
    expect(result.ok).toBe(false);
  });

  it('疑似 onerror 注入返回 ok:false', () => {
    const evil = validWord({ example: '<img src=x onerror=alert(1)>' });
    const result = safeParseWord(evil);
    expect(result.ok).toBe(false);
  });

  it('空输入 / 非对象返回 ok:false', () => {
    expect(safeParseWord(null).ok).toBe(false);
    expect(safeParseWord(42).ok).toBe(false);
    expect(safeParseWord('str').ok).toBe(false);
  });

  it('纯函数：不修改入参，现有数据安全', () => {
    const input = validWord();
    const snapshot = JSON.stringify(input);
    safeParseWord(input);
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});
