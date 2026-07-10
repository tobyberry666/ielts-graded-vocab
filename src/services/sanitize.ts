// 安全红线落地：任何外部/用户输入在进库与渲染前都必须经过校验与转义。
// 这一层是纯函数、零依赖、可独立单测 —— 不碰网络、不碰存储。
import type { VocabEntry, Band } from '../data/words';

/** 转义 HTML 特殊字符，防止 XSS。必须按 & 优先于 < > 的顺序处理。 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export type ParseResult =
  | { ok: true; value: VocabEntry }
  | { ok: false; error: string };

const BANDS: Band[] = ['5', '6', '7', '8', '9'];

// 疑似注入的特征：脚本标签、iframe、事件处理器、伪协议。命中即视为不可信输入。
const INJECTION_PATTERNS: RegExp[] = [
  /<\s*script/i,
  /<\s*iframe/i,
  /<\s*img/i,
  /onerror\s*=/i,
  /javascript\s*:/i,
  /<\s*svg/i,
];

function looksLikeInjection(s: string): boolean {
  return containsInjection(s);
}

/**
 * 安全红线对外复用入口：检测一段文本是否疑似含注入内容（<script> / iframe /
 * img / onerror= / javascript: / svg 等）。与 safeParseWord 内部使用的逻辑
 * 完全一致 —— 由 importer 等上层复用，保证安全规则单一来源、不弱化。
 */
export function containsInjection(s: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(s));
}

/** 基于 BANDS 白名单校验 band 合法性。供 importer 复用，避免重复硬编码。 */
export function isValidBand(b: unknown): b is Band {
  return typeof b === 'string' && (BANDS as string[]).includes(b);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.length > 0;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((item) => typeof item === 'string');
}

/**
 * 校验并解析一条词表记录。
 * - 字段缺失 / 类型错误 → { ok: false }
 * - 字段疑似含注入（<script> 等）→ { ok: false }
 * 纯函数：绝不抛异常，绝不修改入参，绝不污染现有数据。
 */
export function safeParseWord(raw: unknown): ParseResult {
  try {
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
      return { ok: false, error: '输入不是对象' };
    }
    const r = raw as Record<string, unknown>;

    const requiredStrings: (keyof VocabEntry)[] = [
      'id',
      'term',
      'phonetic',
      'pos',
      'meaningZh',
      'meaningEn',
      'example',
      'exampleZh',
    ];
    for (const key of requiredStrings) {
      if (!isNonEmptyString(r[key])) {
        return { ok: false, error: `字段缺失或类型错误: ${String(key)}` };
      }
    }

    if (!isStringArray(r.collocations)) {
      return { ok: false, error: 'collocations 必须是字符串数组' };
    }

    if (!BANDS.includes(r.band as Band)) {
      return { ok: false, error: `band 非法: ${String(r.band)}` };
    }

    // 安全扫描：任何字段含疑似注入即拒绝。
    const scanned: string[] = [
      ...requiredStrings.map((k) => r[k] as string),
      ...(r.collocations as string[]),
    ];
    for (const field of scanned) {
      if (looksLikeInjection(field)) {
        return { ok: false, error: '检测到疑似注入内容' };
      }
    }

    // 字段已逐条校验为 string / string[] / Band，此处用断言取出
    // （TS 无法跨 for 循环把 Record<string, unknown> 的索引访问收窄为 string）。
    const s = (k: keyof VocabEntry): string => r[k] as string;
    return {
      ok: true,
      value: {
        id: s('id'),
        term: s('term'),
        phonetic: s('phonetic'),
        pos: s('pos'),
        meaningZh: s('meaningZh'),
        meaningEn: s('meaningEn'),
        example: s('example'),
        exampleZh: s('exampleZh'),
        collocations: r.collocations as string[],
        band: r.band as Band,
      },
    };
  } catch {
    // 理论上不可达；兜底保证「绝不抛异常」。
    return { ok: false, error: '解析时发生未知错误' };
  }
}
