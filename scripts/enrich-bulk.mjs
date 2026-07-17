// 多义项富化脚本（enrich-bulk.mjs）
// ---------------------------------------------------------------------------
// 目标：给词库里「每一个词」补充多个义项（不同词性 / 不同含义），让闪卡能逐义项展示
//       词性 + 中英释义 + 双语例句，解决「每个词只有一个释义太单一」的问题。
//
// 策略：
//   1. 以 .enrich/flat.json（当前 SEED_WORDS 扁平导出）为基线，每个词已有「顶层单义」。
//   2. 调 dictionaryapi.dev 取该词的多个 partOfSpeech 义项；跳过与「主词性」相同的组，
//      把其余不同词性的义项作为额外 sense（definition + example）。
//   3. 额外 sense 的中文释义用 MyMemory(en→zh-CN) 机翻（best-effort，遇配额停止即跳过）。
//   4. bulk 词原本 phonetic 为空，用 API 返回的音标补全。
//   5. 每个词的「主 sense」= 原顶层单义（保留手写/CSV 的中文释义与例句），确保不退化。
//
// 健壮性：
//   - 结果按 term 缓存到 .enrich/cache.json，中断后重跑只补缺失项，绝不重复刷网络。
//   - 网络错误 / 429 / 404 全部降级为「无额外义项」，绝不阻塞主流程。
//   - 仅重写 seed-bulk.ts（自动生成文件）；words.ts 仅替换 SEED_CORE 数组块，保留类型与工具函数。
//
// 用法：node scripts/enrich-bulk.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'src', 'data');
const ENRICH = join(ROOT, '.enrich');
mkdirSync(ENRICH, { recursive: true });

const DICT_URL = (t) => `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(t.toLowerCase())}`;
const TR_URL = (q) => `https://api.mymemory.translated.net/get?langpair=en|zh-CN&q=${encodeURIComponent(q)}`;

const CONCURRENCY = 10;
const MAX_EXTRA = 3;
const CACHE_FILE = join(ENRICH, 'cache.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const j = (s) => JSON.stringify(s ?? '');

// ---------- 缓存 ----------
let cache = { dict: {}, tr: {} };
if (existsSync(CACHE_FILE)) {
  try { cache = JSON.parse(readFileSync(CACHE_FILE, 'utf8')); } catch { cache = { dict: {}, tr: {} }; }
}
cache.dict ||= {}; cache.tr ||= {};
let dirty = false;
let lastSave = Date.now();
function maybeSave() {
  const now = Date.now();
  if (dirty && now - lastSave > 15000) {
    writeFileSync(CACHE_FILE, JSON.stringify(cache));
    dirty = false;
    lastSave = now;
  }
}

// ---------- 网络（带重试 / 退避）----------
async function fetchJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 12000);
      const r = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
      clearTimeout(to);
      if (r.status === 429) { await sleep(900 * (i + 1)); continue; }
      if (r.status === 404) return null; // 词库未收录
      if (!r.ok) { await sleep(700 * (i + 1)); continue; }
      return await r.json();
    } catch {
      if (i === tries - 1) return null;
      await sleep(700 * (i + 1));
    }
  }
  return null;
}

// 翻译：返回中文或 null（配额耗尽 / 失败均返回 null，调用方降级）
let trStopped = false;
async function translate(text) {
  if (trStopped) return null;
  if (!text) return '';
  if (cache.tr[text] !== undefined) return cache.tr[text];
  const data = await fetchJson(TR_URL(text), 2);
  if (!data) { trStopped = true; return null; }
  if (data.responseStatus && data.responseStatus !== 200) {
    if (data.quotaFinished) trStopped = true;
    cache.tr[text] = null;
    dirty = true;
    return null;
  }
  const t = data?.responseData?.translatedText;
  if (!t || /MYMEMORY WARNING|QUOTA|TRY AGAIN|INVALID/i.test(t)) {
    trStopped = true;
    cache.tr[text] = null;
    dirty = true;
    return null;
  }
  cache.tr[text] = t;
  dirty = true;
  return t;
}

// 词性归一化（比对用，去点，保证 'noun' 与 'n.' 视为同一词性）：
//   normPos('noun') === normPos('n.') === 'n'
function normPos(p) {
  const map = {
    noun: 'n', verb: 'v', adjective: 'adj', adverb: 'adv', pronoun: 'pron',
    preposition: 'prep', conjunction: 'conj', interjection: 'int', determiner: 'det',
    article: 'art',
  };
  const s = (p || '').trim().toLowerCase().replace(/\.+$/, '');
  return map[s] || s;
}

// 展示用：已知缩写补回点（'v' → 'v.'），未知词性（如 'transitive verb'）原样保留。
function fmtPos(p) {
  const n = normPos(p);
  const known = ['n', 'v', 'adj', 'adv', 'pron', 'prep', 'conj', 'int', 'det', 'art'];
  return known.includes(n) ? n + '.' : p;
}

// 取一个词的额外义项（不同词性）+ 顶层音标
async function fetchWord(term, primaryPos) {
  if (cache.dict[term] !== undefined) return cache.dict[term];
  const data = await fetchJson(DICT_URL(term));
  let phonetic = '';
  const extras = [];
  if (Array.isArray(data) && data[0]) {
    if (data[0].phonetic) phonetic = data[0].phonetic;
    else if (data[0].phonetics && data[0].phonetics[0]) phonetic = data[0].phonetics[0].text || '';
    // 多义项来自 data[0].meanings（顶层是「词条」数组，meanings 才是「义项」数组）
    const meanings = data[0].meanings || [];
    const seenPos = new Set([normPos(primaryPos)]);
    for (const m of meanings) {
      const posKey = normPos(m.partOfSpeech || '');
      if (!posKey || seenPos.has(posKey)) continue;
      const defObj = (m.definitions || []).find((d) => d && d.definition);
      if (!defObj) continue;
      seenPos.add(posKey);
      extras.push({
        pos: fmtPos(m.partOfSpeech || ''),
        meaningZh: '',
        meaningEn: defObj.definition || '',
        collocations: [],
        example: defObj.example || '',
        exampleZh: '',
      });
      if (extras.length >= MAX_EXTRA) break;
    }
  }
  const result = { phonetic, extras };
  cache.dict[term] = result;
  dirty = true;
  return result;
}

// ---------- 并发池 ----------
async function mapPool(items, worker, concurrency) {
  const iter = items[Symbol.iterator]();
  const results = new Array(items.length);
  let idx = 0;
  async function run() {
    for (let it = iter.next(); !it.done; it = iter.next()) {
      const cur = idx++;
      try { results[cur] = await worker(it.value); }
      catch { results[cur] = it.value; }
    }
  }
  const ps = [];
  for (let k = 0; k < concurrency; k++) ps.push(run());
  await Promise.all(ps);
  return results;
}

// ---------- 序列化 ----------
function emitSense(s) {
  return `{\n    pos: ${j(s.pos)}, meaningZh: ${j(s.meaningZh)}, meaningEn: ${j(s.meaningEn)}, ` +
    `collocations: [${((s.collocations) || []).map(j).join(', ')}], example: ${j(s.example)}, exampleZh: ${j(s.exampleZh)} }`;
}
// 音标归一化：统一成 /.../ 斜杠 IPA 格式（API 偶尔返回 [...] 方括号格式）。
function normalizePhonetic(p) {
  if (!p) return '';
  let s = String(p).trim();
  // 去掉已有的包裹符号（/ 或 [ ]）
  s = s.replace(/^[\/\[]+/, '').replace(/[\/\]]+$/, '').trim();
  if (!s) return '';
  return '/' + s + '/';
}

function emitEntry(e) {
  const senses = (e.senses || []).map(emitSense).join(',\n    ');
  return `  {\n    id: ${j(e.id)}, term: ${j(e.term)}, phonetic: ${j(e.phonetic)}, pos: ${j(e.pos)}, ` +
    `meaningZh: ${j(e.meaningZh)}, meaningEn: ${j(e.meaningEn)}, band: ${j(e.band)}, ` +
    `collocations: [${((e.collocations) || []).map(j).join(', ')}], example: ${j(e.example)}, exampleZh: ${j(e.exampleZh)},\n    senses: [\n    ${senses}\n    ]\n  }`;
}

// ---------- 主流程 ----------
async function main() {
  const flat = JSON.parse(readFileSync(join(ENRICH, 'flat.json'), 'utf8'));
  console.log(`载入 ${flat.length} 个词，开始富化（并发 ${CONCURRENCY}，缓存 ${Object.keys(cache.dict).length} 词已命中）…`);

  const enriched = await mapPool(flat, async (w) => {
    const primaryPos = w.pos || '';
    const { phonetic, extras } = await fetchWord(w.term, primaryPos);
    // 翻译额外义项的中文释义（best-effort）
    for (const s of extras) {
      if (s.meaningZh) continue;
      const zh = await translate(s.meaningEn);
      s.meaningZh = zh || '';
    }
    const primary = {
      pos: w.pos,
      meaningZh: w.meaningZh,
      meaningEn: w.meaningEn,
      collocations: w.collocations || [],
      example: w.example,
      exampleZh: w.exampleZh,
    };
    const out = {
      id: w.id,
      term: w.term,
      phonetic: normalizePhonetic(phonetic || w.phonetic || ''),
      pos: w.pos,
      meaningZh: w.meaningZh,
      meaningEn: w.meaningEn,
      band: w.band,
      collocations: w.collocations || [],
      example: w.example,
      exampleZh: w.exampleZh,
      senses: [primary, ...extras],
    };
    maybeSave();
    return out;
  }, CONCURRENCY);

  // 落盘缓存（最终）
  writeFileSync(CACHE_FILE, JSON.stringify(cache));

  // 拆分 core / bulk
  const core = enriched.filter((w) => !w.id.startsWith('bulk-'));
  const bulk = enriched.filter((w) => w.id.startsWith('bulk-'));

  // ---- 重写 seed-bulk.ts（自动生成文件，整文件覆盖）----
  const CHUNK = 300;
  const chunks = [];
  for (let i = 0; i < bulk.length; i += CHUNK) chunks.push(bulk.slice(i, i + CHUNK));
  const partDecls = chunks
    .map((c, ci) => {
      const rows = c.map((e) => emitEntry(e)).join(',\n');
      return `const part_${ci + 1}: VocabEntry[] = [\n${rows}\n];`;
    })
    .join('\n\n');
  const combine = `export const SEED_BULK: VocabEntry[] = [\n${chunks.map((_, ci) => `  ...part_${ci + 1}`).join(',\n')}\n];`;
  const bulkHeader =
    `// AUTO-GENERATED by scripts/enrich-bulk.mjs — 多义项富化版（请勿手改）。\n` +
    `// 每个词含 senses[]：senses[0] 为原 CSV/手写单义，其余为 dictionaryapi.dev 补充的不同词性义项。\n` +
    `import type { VocabEntry } from './words';\n\n`;
  writeFileSync(join(DATA, 'seed-bulk.ts'), bulkHeader + partDecls + '\n\n' + combine + '\n', 'utf8');

  // ---- 仅替换 words.ts 的 SEED_CORE 数组块（保留类型 / 工具函数 / 导出）----
  let wordsSrc = readFileSync(join(DATA, 'words.ts'), 'utf8');
  const newCore = `const SEED_CORE: VocabEntry[] = [\n${core.map((e) => emitEntry(e)).join(',\n')}\n];`;
  const re = /const SEED_CORE: VocabEntry\[\] = \[[\s\S]*?\n\];/;
  if (!re.test(wordsSrc)) {
    console.error('未找到 SEED_CORE 数组块，已中止重写 words.ts（避免破坏类型定义）');
  } else {
    wordsSrc = wordsSrc.replace(re, newCore);
    writeFileSync(join(DATA, 'words.ts'), wordsSrc, 'utf8');
  }

  // ---- 统计 ----
  const multi = enriched.filter((w) => (w.senses || []).length > 1).length;
  const totalSenses = enriched.reduce((a, w) => a + (w.senses ? w.senses.length : 1), 0);
  const withPhoneticAfter = enriched.filter((w) => w.phonetic).length;
  console.log('──────── 富化完成 ────────');
  console.log(`总词数: ${enriched.length}（core=${core.length} bulk=${bulk.length}）`);
  console.log(`多义项词（>1 义项）: ${multi}（占比 ${(multi / enriched.length * 100).toFixed(1)}%）`);
  console.log(`义项总数: ${totalSenses}（平均 ${(totalSenses / enriched.length).toFixed(2)} 个/词）`);
  console.log(`有音标词: ${withPhoneticAfter}/${enriched.length}（bulk 词已补全音标）`);
  console.log(`中文翻译: ${trStopped ? '已触及 MyMemory 配额，部分额外义项仅英文' : '全部完成'}`);
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });
