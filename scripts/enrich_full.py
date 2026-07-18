#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
enrich_full.py — 雅思分级词库「全词性 + 完整释义」富化生成器（V2，网络源版）。

数据源（按优先级合并，全部走可靠网络 API，避免大文件慢下载）：
  1. dictionaryapi.dev   —— 全词性结构 + 英文释义 + 原版例句 + IPA 音标（ALL 3816 词）
  2. ECDICT 片段(.enrich/ecdict.csv, 已下到 a–q) —— 这部分词的中文（全词性）
  3. flat.json 基线       —— 主词性 / 例句 / 搭配 / band / 主义项（手写精校中文）
  4. cache.json['dict']   —— 早期 dictionaryapi+MyMemory 结果（约 1052 词含中文）
  5. MyMemory             —— 翻译 r–z 词「次要词性」的英文释义为中文（兜底）

输出（与 enrich_ecdict.py 一致）：
  - src/data/words.ts   （SEED_CORE = flat[0:210]）
  - src/data/seed-bulk.ts（SEED_BULK = flat[210:]，分 16 段避免 TS2590）

用法：
  python scripts/enrich_full.py            # 全量生成（自动增量缓存）
  python scripts/enrich_full.py --dry      # 只打印若干词解析结果，不落盘
"""
import json
import re
import csv
import sys
import os
import time
import subprocess
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENRICH = os.path.join(APP, ".enrich")
ECDICT_PATH = os.path.join(ENRICH, "ecdict.csv")
FLAT_PATH = os.path.join(ENRICH, "flat.json")
CACHE_PATH = os.path.join(ENRICH, "cache.json")
DICTAPI_CACHE = os.path.join(ENRICH, "dictapi_cache.json")
MM_CACHE = os.path.join(ENRICH, "mm_cache.json")
WORDS_OUT = os.path.join(APP, "src", "data", "words.ts")
BULK_OUT = os.path.join(APP, "src", "data", "seed-bulk.ts")

MM_EMAIL = "user@example.com"  # 带邮箱可将 MyMemory 日配额提到 5000
DICTAPI_CONC = 4
MM_CONC = 8

# ----------------------------------------------------------------------------
# POS 归一化
# ----------------------------------------------------------------------------
POS_CANON = {
    "noun": "n.", "n": "n.",
    "verb": "v.", "v": "v.", "modal": "v.", "aux": "v.", "auxiliary": "v.",
    "vt": "vt.", "vi": "vi.",
    "adjective": "adj.", "adj": "adj.", "a": "adj.",
    "adverb": "adv.", "adv": "adv.",
    "preposition": "prep.", "prep": "prep.",
    "conjunction": "conj.", "conj": "conj.",
    "pronoun": "pron.", "pron": "pron.",
    "interjection": "int.", "int": "int.",
    "article": "art.", "art": "art.",
    "numeral": "num.", "num": "num.", "number": "num.",
    "abbreviation": "abbr.", "abbr": "abbr.",
    "determiner": "det.", "det": "det.",
}
POS_RE = re.compile(
    r"^(adj|adverb|adv|prep|preposition|conj|conjunction|pron|pronoun|int|interjection|"
    r"art|article|num|number|abbr|abbreviation|det|aux|auxiliary|modal|n|noun|v|verb|vt|vi|a)\b\.?\s*(.*)$",
    re.IGNORECASE,
)


def canon_pos(raw):
    if not raw:
        return ""
    r = raw.strip().lower().rstrip(".")
    return POS_CANON.get(r, raw.strip())


def clean_tags(s):
    if not s:
        return ""
    s = re.sub(r"\[[^\]]*\]", "", s)
    s = s.replace(",", "；").replace(";", "；")
    s = re.sub(r"\s*；\s*", "；", s)
    s = re.sub(r"；+", "；", s).strip("； ").strip()
    return s


def parse_blocks(field):
    out = []
    if not field:
        return out
    cur = None
    for raw_line in field.split("\\n"):
        line = raw_line.strip()
        if not line:
            continue
        m = POS_RE.match(line)
        if m:
            pos = canon_pos(m.group(1))
            body = clean_tags(m.group(2)).strip()
            cur = {"pos": pos, "def": body}
            out.append(cur)
        else:
            body = clean_tags(line).strip()
            if cur is not None and body:
                if cur["def"]:
                    if body not in cur["def"]:
                        cur["def"] = cur["def"] + "；" + body
                else:
                    cur["def"] = body
    return out


# ----------------------------------------------------------------------------
# 网络 / 缓存
# ----------------------------------------------------------------------------
def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False)


def curl(url, timeout=25):
    try:
        p = subprocess.run(
            ["curl", "-s", "-m", str(timeout), "-A", "Mozilla/5.0", url],
            capture_output=True, text=True, timeout=timeout + 5,
        )
        return p.stdout
    except Exception:
        return ""


def fetch_dictapi(word):
    url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + urllib.parse.quote(word)
    last = None
    for attempt in range(3):
        raw = curl(url, timeout=20)
        if raw:
            try:
                data = json.loads(raw)
                if isinstance(data, dict) and "title" in data:
                    last = None  # API 错误响应（未找到等），视为无数据
                else:
                    return data
            except Exception:
                last = None
        time.sleep(0.3 * (attempt + 1))
    return last


def parse_dictapi(data):
    if not data:
        return {"phonetic": "", "senses": []}
    if isinstance(data, dict) and "title" in data:
        return {"phonetic": "", "senses": []}
    phonetic = ""
    senses = []
    for entry in data:
        if not isinstance(entry, dict):
            continue
        if not phonetic and entry.get("phonetic"):
            phonetic = entry["phonetic"]
        # 也尝试 phonetics[].text
        if not phonetic:
            for ph in entry.get("phonetics", []):
                if isinstance(ph, dict) and ph.get("text"):
                    phonetic = ph["text"]
                    break
        for m in entry.get("meanings", []):
            pos = m.get("partOfSpeech", "")
            for d in m.get("definitions", []):
                senses.append({
                    "pos": pos,
                    "en": clean_text(d.get("definition", "")),
                    "example": clean_text(d.get("example", "")),
                })
    return {"phonetic": phonetic, "senses": senses}


def clean_text(s):
    if not s:
        return ""
    return re.sub(r"\s+", " ", s).strip()


def fetch_mm(en_phrase):
    if not en_phrase:
        return ""
    q = urllib.parse.quote(en_phrase[:500])
    url = f"https://api.mymemory.translated.net/get?q={q}&langpair=en|zh-CN&de={MM_EMAIL}"
    raw = curl(url)
    if not raw:
        return ""
    try:
        d = json.loads(raw)
        t = d.get("responseData", {}).get("translatedText", "")
        if d.get("responseStatus") != 200 or not t:
            return ""
        return t.strip()
    except Exception:
        return ""


# ----------------------------------------------------------------------------
# 载入
# ----------------------------------------------------------------------------
def load_flat():
    return load_json(FLAT_PATH, [])


def load_cache_dict():
    d = load_json(CACHE_PATH, {})
    return d.get("dict", {}) if isinstance(d, dict) else {}


def load_ecdict(targets):
    idx = {}
    total = 0
    if not os.path.exists(ECDICT_PATH):
        return idx, 0
    with open(ECDICT_PATH, encoding="utf-8", errors="replace") as f:
        reader = csv.reader(f)
        for row in reader:
            total += 1
            if len(row) < 4:
                continue
            w = row[0].strip()
            if w in targets:
                idx[w] = {
                    "phonetic": row[1] if len(row) > 1 else "",
                    "definition": row[2] if len(row) > 2 else "",
                    "translation": row[3] if len(row) > 3 else "",
                }
    return idx, total


# ----------------------------------------------------------------------------
# 构建词条
# ----------------------------------------------------------------------------
def build_entry(fe, ec, cd, da):
    term = fe["term"]
    band = fe.get("band", "5")
    flat_pos = (fe.get("pos") or "").strip()
    flat_tokens = [canon_pos(p) for p in re.split(r"[/、]", flat_pos) if p.strip()]
    flat_token_set = set(p for p in flat_tokens if p)
    if not flat_token_set:
        flat_token_set = {canon_pos((da or {}).get("senses", [{}])[0].get("pos", "v.")) or "v."}

    da_senses = (da or {}).get("senses", [])
    da_by_pos = {}
    for s in da_senses:
        p = canon_pos(s["pos"])
        if p:
            da_by_pos.setdefault(p, []).append(s)
    da_phonetic = (da or {}).get("phonetic", "")

    ec_blocks = parse_blocks(ec.get("translation", "")) if ec else []
    ec_zh = {b["pos"]: b["def"] for b in ec_blocks if b["pos"]}

    # cache_dict extras by pos
    cd_by_pos = {}
    if cd:
        for ex in cd.get("extras", []) or []:
            p = canon_pos(ex.get("pos", ""))
            if p:
                cd_by_pos.setdefault(p, []).append(ex)

    primary_pos = flat_tokens[0] if flat_tokens else (next(iter(da_by_pos), None) or "v.")

    senses = []
    used = set()

    # 主 sense
    zh0 = (fe.get("meaningZh") or "").strip()
    en0 = (fe.get("meaningEn") or "").strip()
    ex0 = (fe.get("example") or "").strip()
    exzh0 = (fe.get("exampleZh") or "").strip()
    # 用 dictionaryapi 主词性补 EN/example
    if primary_pos in da_by_pos:
        d0 = da_by_pos[primary_pos][0]
        if not en0 and d0["en"]:
            en0 = d0["en"]
        if not ex0 and d0["example"]:
            ex0 = d0["example"]
    # 用 ECDICT 主词性补中文
    if primary_pos in ec_zh:
        for seg in ec_zh[primary_pos].split("；"):
            seg = seg.strip()
            if seg and seg not in zh0:
                zh0 = (zh0 + "；" + seg) if zh0 else seg
    # 用 cache_dict 主词性补中文（兜底）
    if (not zh0 or not en0) and primary_pos in cd_by_pos:
        c0 = cd_by_pos[primary_pos][0]
        if not zh0 and c0.get("meaningZh"):
            zh0 = c0["meaningZh"]
        if not en0 and c0.get("meaningEn"):
            en0 = c0["meaningEn"]
        if not ex0 and c0.get("example"):
            ex0 = c0["example"]

    used.add(primary_pos)
    senses.append({
        "pos": flat_pos or primary_pos,
        "zh": zh0,
        "en": en0,
        "coll": fe.get("collocations") or [],
        "ex": ex0,
        "exzh": exzh0,
    })

    # 次要词性（来自 dictionaryapi）
    for pos, lst in da_by_pos.items():
        if pos in used:
            continue
        used.add(pos)
        d0 = lst[0]
        zh = ec_zh.get(pos, "")
        if not zh and pos in cd_by_pos:
            zh = cd_by_pos[pos][0].get("meaningZh", "")
        # 仍无中文 → 标记需要 MyMemory（在外部批量翻译后回填）
        if not zh:
            zh = "__NEED_MM__::" + d0["en"]
        senses.append({
            "pos": pos,
            "zh": zh,
            "en": d0["en"],
            "coll": [],
            "ex": d0.get("example", ""),
            "exzh": "",
        })

    # ECDICT 有但 dictionaryapi 没覆盖的词性（罕见）
    for pos, zh in ec_zh.items():
        if pos in used:
            continue
        used.add(pos)
        senses.append({"pos": pos, "zh": zh, "en": "", "coll": [], "ex": "", "exzh": ""})

    # 去重同 pos：保留首个，并把后续同 pos 的非空 en/ex/zh 补全到首个
    _seen = {}
    _dedup = []
    for _s in senses:
        _p = _s["pos"]
        if _p in _seen:
            _f = _seen[_p]
            for _k in ("en", "ex", "zh", "exzh"):
                if not _f.get(_k) and _s.get(_k):
                    _f[_k] = _s[_k]
            continue
        _seen[_p] = _s
        _dedup.append(_s)
    senses = _dedup

    def norm_ipa(p):
        p = (p or "").strip().strip("'").strip()
        if not p:
            return ""
        if not p.startswith("/"):
            p = "/" + p
        if not p.endswith("/"):
            p = p + "/"
        return p

    top = senses[0]
    raw_ph = (da_phonetic or (cd or {}).get("phonetic", "") or fe.get("phonetic", "")
              or (ec or {}).get("phonetic", ""))
    phonetic = norm_ipa(raw_ph)
    return {
        "id": fe["id"], "term": term, "phonetic": phonetic,
        "pos": top["pos"], "meaningZh": top["zh"], "meaningEn": top["en"],
        "band": band, "collocations": top["coll"],
        "example": top["ex"], "exampleZh": top["exzh"],
        "senses": senses,
    }


# ----------------------------------------------------------------------------
# TS 输出
# ----------------------------------------------------------------------------
def jstr(s):
    return json.dumps(s if s is not None else "", ensure_ascii=False)


def emit_sense(s):
    return (
        "    {\n"
        f"    pos: {jstr(s['pos'])}, meaningZh: {jstr(s['zh'])}, "
        f"meaningEn: {jstr(s['en'])}, collocations: {jstr(s['coll'])}, "
        f"example: {jstr(s['ex'])}, exampleZh: {jstr(s['exzh'])} }}"
    )


def emit_entry(e, indent=2):
    sp = " " * indent
    sp2 = " " * (indent + 2)
    head = (
        f"{sp}{{\n"
        f"{sp2}id: {jstr(e['id'])}, term: {jstr(e['term'])}, phonetic: {jstr(e['phonetic'])}, "
        f"pos: {jstr(e['pos'])}, meaningZh: {jstr(e['meaningZh'])}, meaningEn: {jstr(e['meaningEn'])}, "
        f"band: {jstr(e['band'])}, collocations: {jstr(e['collocations'])}, "
        f"example: {jstr(e['example'])}, exampleZh: {jstr(e['exampleZh'])},\n"
        f"{sp2}senses: [\n"
    )
    body = ",\n".join(emit_sense(s) for s in e["senses"])
    tail = f"\n{sp2}]\n{sp}}}"
    return head + body + tail


def build_words_ts(core_entries):
    import subprocess
    # 优先用 git HEAD 的原始 words.ts 作模板（含类型定义/工具函数/导出），
    # 避免当前文件被多次重写后丢失 header（VocabEntry 等）导致恶性循环。
    template = None
    try:
        template = subprocess.check_output(
            ["git", "show", "HEAD:src/data/words.ts"], cwd=APP
        ).decode("utf-8")
    except Exception:
        try:
            with open(WORDS_OUT, encoding="utf-8") as f:
                template = f.read()
        except Exception:
            template = ""
    lines = template.split("\n")
    start = None
    for i, ln in enumerate(lines):
        if ln.strip().startswith("const SEED_CORE"):
            start = i
            break
    if start is None:
        header_lines = lines
        footer_lines = []
    else:
        depth = 0
        end = start
        for i in range(start, len(lines)):
            depth += lines[i].count("[") - lines[i].count("]")
            if depth <= 0 and i > start:
                end = i
                break
        header_lines = lines[:start]
        footer_lines = lines[end + 1:]
    out = list(header_lines)
    out.append("const SEED_CORE: VocabEntry[] = [")
    out.append(",\n".join(emit_entry(e, 2) for e in core_entries))
    out.append("];")
    for ln in footer_lines:
        if ln.strip().startswith("export const SEED_VERSION"):
            out.append("export const SEED_VERSION = '2026-07-17-ecdict-dictapi';")
        else:
            out.append(ln)
    text = "\n".join(out)
    # 注入 VocabSense 接口 + getSenses/primarySense，并扩展 VocabEntry 支持 senses 字段。
    # 幂等：git HEAD 可能已含这些注入（脚本先前已提交），已存在则跳过，避免重复声明。
    if "senses?: VocabSense" not in text:
        text = text.replace(
            "  exampleZh: string;\n}",
            "  exampleZh: string;\n  senses?: VocabSense[];\n}",
            1,
        )
    if "export interface VocabSense" not in text:
        inject = (
            "\n"
            "export interface VocabSense {\n"
            "  pos: string;\n"
            "  meaningZh: string;\n"
            "  meaningEn: string;\n"
            "  collocations: string[];\n"
            "  example: string;\n"
            "  exampleZh: string;\n"
            "}\n\n"
            "export function getSenses(w: VocabEntry): VocabSense[] {\n"
            "  if (w.senses && w.senses.length) return w.senses;\n"
            "  return [{\n"
            "    pos: w.pos,\n"
            "    meaningZh: w.meaningZh,\n"
            "    meaningEn: w.meaningEn,\n"
            "    collocations: w.collocations,\n"
            "    example: w.example,\n"
            "    exampleZh: w.exampleZh,\n"
            "  }];\n"
            "}\n\n"
            "export function primarySense(w: VocabEntry): VocabSense {\n"
            "  return getSenses(w)[0];\n"
            "}\n\n"
        )
        text = text.replace(
            "const SEED_CORE: VocabEntry[] = [",
            inject + "const SEED_CORE: VocabEntry[] = [",
            1,
        )
    return text


def build_bulk_ts(bulk_entries):
    parts = []
    n = len(bulk_entries)
    chunk = (n + 15) // 16
    idx = 0
    for pi in range(16):
        seg = bulk_entries[idx: idx + chunk]
        idx += chunk
        if not seg:
            break
        parts.append("const part_%d: VocabEntry[] = [\n" % (pi + 1) +
                     ",\n".join(emit_entry(e, 2) for e in seg) + "\n];")
    body = "\n\n".join(parts)
    export = "export const SEED_BULK: VocabEntry[] = [\n" + ",\n".join(
        "  ...part_%d" % (pi + 1) for pi in range(len(parts))) + "\n];\n"
    header = ("// AUTO-GENERATED by scripts/enrich_full.py — dictionaryapi.dev + ECDICT + MyMemory 全词性富化版（请勿手改）。\n"
              "import type { VocabEntry } from './words';\n\n")
    return header + body + "\n\n" + export


# ----------------------------------------------------------------------------
# main
# ----------------------------------------------------------------------------
def main():
    dry = "--dry" in sys.argv
    flat = load_flat()
    cache_dict = load_cache_dict()
    targets = set(e["term"] for e in flat)
    ec_idx, ec_total = load_ecdict(targets)
    dictapi_cache = load_json(DICTAPI_CACHE, {})
    mm_cache = load_json(MM_CACHE, {})

    print(f"[info] ECDICT partial rows={ec_total}, matched={len(ec_idx)}/{len(targets)}", file=sys.stderr)

    # ---- Pass 1: 拉取 dictionaryapi（增量缓存：只补拉 senses 为空的） ----
    to_fetch = [e["term"] for e in flat
                if not (dictapi_cache.get(e["term"]) or {}).get("senses")
                and not (dictapi_cache.get(e["term"]) or {}).get("_na")]
    print(f"[info] dictionaryapi 待拉取={len(to_fetch)}（缓存已有 {len(dictapi_cache)}）", file=sys.stderr)

    def fetch_one(w):
        return w, fetch_dictapi(w)

    if to_fetch and not dry:
        done = 0
        with ThreadPoolExecutor(max_workers=DICTAPI_CONC) as ex:
            futs = {ex.submit(fetch_one, w): w for w in to_fetch}
            for fut in as_completed(futs):
                w, data = fut.result()
                if data is None:
                    dictapi_cache[w] = {"phonetic": "", "senses": [], "_na": True}
                else:
                    dictapi_cache[w] = parse_dictapi(data)
                done += 1
                if done % 500 == 0:
                    save_json(DICTAPI_CACHE, dictapi_cache)
                    print(f"[info] dictapi 进度 {done}/{len(to_fetch)}", file=sys.stderr)
        save_json(DICTAPI_CACHE, dictapi_cache)
        print(f"[info] dictapi 拉取完成，缓存 {len(dictapi_cache)} 词", file=sys.stderr)

    # ---- Pass 2: 收集需要 MyMemory 的中文短语 ----
    need_mm = set()
    if not dry:
        for fe in flat:
            term = fe["term"]
            da = dictapi_cache.get(term)
            ec = ec_idx.get(term)
            cd = cache_dict.get(term)
            ent = build_entry(fe, ec, cd, da)
            for s in ent["senses"]:
                if isinstance(s["zh"], str) and s["zh"].startswith("__NEED_MM__::"):
                    en = s["zh"].split("__NEED_MM__::", 1)[1]
                    if en and en not in mm_cache:
                        need_mm.add(en)
        print(f"[info] 需 MyMemory 翻译的短语={len(need_mm)}", file=sys.stderr)

        def mm_one(en):
            return en, fetch_mm(en)

        with ThreadPoolExecutor(max_workers=MM_CONC) as ex:
            futs = {ex.submit(mm_one, en): en for en in need_mm}
            done = 0
            for fut in as_completed(futs):
                en, zh = fut.result()
                mm_cache[en] = zh
                done += 1
                if done % 500 == 0:
                    save_json(MM_CACHE, mm_cache)
                    print(f"[info] MM 进度 {done}/{len(need_mm)}", file=sys.stderr)
        save_json(MM_CACHE, mm_cache)
        print(f"[info] MyMemory 完成，缓存 {len(mm_cache)} 条", file=sys.stderr)

    # ---- Pass 3: 构建并最终回填 MM ----
    def finalize(fe):
        term = fe["term"]
        da = dictapi_cache.get(term)
        ec = ec_idx.get(term)
        cd = cache_dict.get(term)
        ent = build_entry(fe, ec, cd, da)
        for s in ent["senses"]:
            if isinstance(s["zh"], str) and s["zh"].startswith("__NEED_MM__::"):
                en = s["zh"].split("__NEED_MM__::", 1)[1]
                s["zh"] = mm_cache.get(en, "")
        return ent

    core = [finalize(f) for f in flat[:210]]
    bulk = [finalize(f) for f in flat[210:]]

    multi = sum(1 for e in core + bulk if len(e["senses"]) > 1)
    print(f"[info] core={len(core)} bulk={len(bulk)} multi-sense={multi} "
          f"({(multi*100)//(len(core)+len(bulk))}%)", file=sys.stderr)

    if dry:
        for term in ["still", "benefit", "ability", "talk", "technology", "place", "require"]:
            fe = next((x for x in flat if x["term"] == term), None)
            if not fe:
                continue
            e = finalize(fe)
            print(f"\n===== {term} (ec={term in ec_idx}, da={term in dictapi_cache}) =====")
            for s in e["senses"]:
                print(f"  {s['pos']:8} | {s['zh']}  ||  {s['en'][:60]}")
        return

    with open(WORDS_OUT, "w", encoding="utf-8") as f:
        f.write(build_words_ts(core))
    with open(BULK_OUT, "w", encoding="utf-8") as f:
        f.write(build_bulk_ts(bulk))
    print("[ok] wrote", WORDS_OUT, "and", BULK_OUT, file=sys.stderr)


if __name__ == "__main__":
    main()
