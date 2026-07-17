#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
enrich_ecdict.py — 雅思分级词库「全词性 + 完整释义」富化生成器。

数据来源（按优先级合并）：
  1. ECDICT (ecdict.csv)        —— 权威中文 + 全词性来源（translation 字段含全部 POS + 中文）
  2. flat.json (基线)           —— 主词性 / 例句 / 搭配 / band / 主义项（手写精校）
  3. cache.json['dict']          —— dictionaryapi.dev 的英文释义 + 例句（仅补充，约 1052 词有）

目标：让每个单词都拥有「完整词性 + 完整中英释义」，满足
      “词性要全，释义是完整的”（如 still = adv.仍然 + adj.静止）。

输出：
  - src/data/words.ts   （SEED_CORE = flat[0:210] 富化后的 210 个核心词）
  - src/data/seed-bulk.ts（SEED_BULK = flat[210:] 富化后的其余词，分 16 段避免 TS2590）

用法：
  python scripts/enrich_ecdict.py            # 全量生成
  python scripts/enrich_ecdict.py --dry      # 只打印前若干词的解析结果，不落盘
"""
import json
import re
import csv
import sys
import os

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENRICH = os.path.join(APP, ".enrich")
ECDICT_PATH = os.path.join(ENRICH, "ecdict.csv")
FLAT_PATH = os.path.join(ENRICH, "flat.json")
CACHE_PATH = os.path.join(ENRICH, "cache.json")
WORDS_OUT = os.path.join(APP, "src", "data", "words.ts")
BULK_OUT = os.path.join(APP, "src", "data", "seed-bulk.ts")
WORDS_HEADER_END = "const SEED_CORE"   # 头部截止到这一行之前
WORDS_FOOTER_START = "export const SEED_WORDS"

# ----------------------------------------------------------------------------
# POS 归一化：把 ECDICT 缩写 / dictionaryapi 全名 统一成 TS 里用的缩写标签
# ----------------------------------------------------------------------------
POS_CANON = {
    "noun": "n.", "n": "n.",
    "verb": "v.", "v": "v.", "modal": "v.", "aux": "v.", "auxiliary": "v.",
    "vt": "vt.", "vi": "vi.",
    "adjective": "adj.", "adj": "adj.",
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
    r"art|article|num|number|abbr|abbreviation|det|aux|auxiliary|modal|n|noun|v|verb|vt|vi)\b\.?\s*(.*)$",
    re.IGNORECASE,
)


def canon_pos(raw: str) -> str:
    if not raw:
        return ""
    r = raw.strip().lower().rstrip(".")
    return POS_CANON.get(r, raw.strip())


# ----------------------------------------------------------------------------
# ECDICT translation / definition 解析
# ----------------------------------------------------------------------------
def clean_tags(s: str) -> str:
    """去掉 [网络]/[经]/[人名] 等方括号领域标签，并把英文逗号统一成中文分号。"""
    if not s:
        return ""
    # 去掉独立的 [xxx] 标签（在行首或行内）
    s = re.sub(r"\[[^\]]*\]", "", s)
    s = s.replace(",", "；").replace(";", "；")
    s = re.sub(r"\s*；\s*", "；", s)
    s = re.sub(r"；+", "；", s).strip("； ").strip()
    return s


def parse_blocks(field: str):
    """把 translation / definition 字段（字面 \\n 分隔）解析成 [{pos, zh/en}] 列表。"""
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
            # 领域标签行或补充说明，挂到当前块
            body = clean_tags(line).strip()
            if cur is not None and body:
                if cur["def"]:
                    # 避免重复
                    if body not in cur["def"]:
                        cur["def"] = cur["def"] + "；" + body
                else:
                    cur["def"] = body
    return out


# ----------------------------------------------------------------------------
# 载入数据源
# ----------------------------------------------------------------------------
def load_flat():
    with open(FLAT_PATH, encoding="utf-8") as f:
        return json.load(f)


def load_cache():
    try:
        with open(CACHE_PATH, encoding="utf-8") as f:
            d = json.load(f)
        return d.get("dict", {})
    except Exception:
        return {}


def load_ecdict(targets):
    """只保留目标词所在的行，避免把 3M 行全量读进内存。"""
    idx = {}
    total = 0
    with open(ECDICT_PATH, encoding="utf-8", errors="replace") as f:
        reader = csv.reader(f)
        for row in reader:
            total += 1
            if len(row) < 4:
                continue
            word = row[0].strip()
            if word in targets:
                # columns: word, phonetic, definition, translation, pos, collins, oxford, tag, bnc, frq
                idx[word] = {
                    "phonetic": row[1] if len(row) > 1 else "",
                    "definition": row[2] if len(row) > 2 else "",
                    "translation": row[3] if len(row) > 3 else "",
                    "tag": row[7] if len(row) > 7 else "",
                }
    return idx, total


# ----------------------------------------------------------------------------
# 合并逻辑：为核心生成一个词的完整 senses
# ----------------------------------------------------------------------------
def build_entry(flat, ecdict_row, cache_row):
    term = flat["term"]
    band = flat.get("band", "5")
    flat_pos = (flat.get("pos") or "").strip()
    flat_tokens = [canon_pos(p) for p in re.split(r"[/、]", flat_pos) if p.strip()]

    # 收集各来源按 POS 归一的候选义项
    # primary 用 flat 的例句/搭配（精校）
    senses = []

    # 1) ECDICT POS 块
    ec_blocks = parse_blocks(ecdict_row.get("translation", "")) if ecdict_row else []
    ec_en_blocks = parse_blocks(ecdict_row.get("definition", "")) if ecdict_row else []
    ec_en_by_pos = {b["pos"]: b["def"] for b in ec_en_blocks if b["pos"]}

    # 2) cache.json dict extras（英文释义 + 例句）
    cache_by_pos = {}
    if cache_row:
        for ex in cache_row.get("extras", []) or []:
            p = canon_pos(ex.get("pos", ""))
            if p:
                cache_by_pos.setdefault(p, []).append(ex)

    # 主词性集合（flat 顶层，拆成多个 token）
    flat_token_set = set(p for p in flat_tokens if p)
    if not flat_token_set:
        # 顶层没写词性时，用 ECDICT 第一个词性兜底
        fallback = ec_blocks[0]["pos"] if ec_blocks else "v."
        flat_token_set = {fallback}

    # 先构造主 sense（senses[0]）
    primary_pos_label = flat_pos if flat_pos else (ec_blocks[0]["pos"] if ec_blocks else "")
    primary_pos_canon = (flat_tokens[0] if flat_tokens else
                         (ec_blocks[0]["pos"] if ec_blocks else "v."))
    # 主语义的中文：flat 为主，附加上 ECDICT 同词性的额外中文
    zh0 = (flat.get("meaningZh") or "").strip()
    en0 = (flat.get("meaningEn") or "").strip()
    # ECDICT 同词性（命中任一主词性 token）补充中文 + 英文
    for b in ec_blocks:
        if b["pos"] in flat_token_set and b["def"]:
            for seg in b["def"].split("；"):
                seg = seg.strip()
                if seg and seg not in zh0:
                    zh0 = (zh0 + "；" + seg) if zh0 else seg
        if b["pos"] == primary_pos_canon and not en0 and b["pos"] in ec_en_by_pos:
            en0 = ec_en_by_pos[b["pos"]]
    # cache 英文/例句补充（仅当 flat 为空时优先 cache）
    if primary_pos_canon in cache_by_pos:
        cex = cache_by_pos[primary_pos_canon][0]
        if not en0 and cex.get("meaningEn"):
            en0 = cex["meaningEn"]
    # phonetic 优选：cache/dict IPA > flat > ECDICT
    phonetic = (cache_row.get("phonetic") if cache_row else "") or flat.get("phonetic") or (ecdict_row.get("phonetic") if ecdict_row else "") or ""
    # 清洗 ECDICT 非 IPA 音标（含非 ASCII 且不像 IPA 的，尽量保留 IPA /.../ ）
    if phonetic and not phonetic.strip().startswith("/"):
        # ECDICT 音标形如 ә'biliti，保留但放行；若 flat/cache 有 IPA 优先已处理
        pass

    primary = {
        "pos": primary_pos_label or primary_pos_canon,
        "meaningZh": zh0,
        "meaningEn": en0,
        "collocations": flat.get("collocations") or [],
        "example": flat.get("example") or "",
        "exampleZh": flat.get("exampleZh") or "",
    }
    senses.append(primary)

    # 其余 ECDICT 词性 → 附加 sense（跳过已作为主词性的）
    seen = set(flat_token_set)
    for b in ec_blocks:
        p = b["pos"]
        if p in seen or not p:
            continue
        seen.add(p)
        zh = b["def"]
        en = ec_en_by_pos.get(p, "")
        ex_example = ""
        ex_exampleZh = ""
        if p in cache_by_pos:
            cex = cache_by_pos[p][0]
            if not en and cex.get("meaningEn"):
                en = cex["meaningEn"]
            if cex.get("example"):
                ex_example = cex["example"]
            if cex.get("exampleZh"):
                ex_exampleZh = cex["exampleZh"]
        senses.append({
            "pos": p,
            "meaningZh": zh,
            "meaningEn": en,
            "collocations": [],
            "example": ex_example,
            "exampleZh": ex_exampleZh,
        })

    # 若 flat 主词性是 "n. / v." 这类多标签，但 ECDICT 没有拆分，则把主词性的其它
    # 标签也补成独立 sense（避免信息丢失）
    for tok in flat_tokens:
        if tok in seen or not tok:
            continue
        seen.add(tok)
        # 从 cache 找同词性
        en = ""
        ex_example = ex_exampleZh = ""
        if tok in cache_by_pos:
            cex = cache_by_pos[tok][0]
            en = cex.get("meaningEn", "")
            ex_example = cex.get("example", "")
            ex_exampleZh = cex.get("exampleZh", "")
        senses.append({
            "pos": tok,
            "meaningZh": flat.get("meaningZh", ""),
            "meaningEn": en or flat.get("meaningEn", ""),
            "collocations": flat.get("collocations") or [],
            "example": ex_example or flat.get("example", ""),
            "exampleZh": ex_exampleZh or flat.get("exampleZh", ""),
        })

    # 顶字段 = senses[0]（向后兼容）
    top = senses[0]
    return {
        "id": flat["id"],
        "term": term,
        "phonetic": phonetic,
        "pos": top["pos"],
        "meaningZh": top["meaningZh"],
        "meaningEn": top["meaningEn"],
        "band": band,
        "collocations": top["collocations"],
        "example": top["example"],
        "exampleZh": top["exampleZh"],
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
        f"    pos: {jstr(s['pos'])}, meaningZh: {jstr(s['meaningZh'])}, "
        f"meaningEn: {jstr(s['meaningEn'])}, collocations: {jstr(s['collocations'])}, "
        f"example: {jstr(s['example'])}, exampleZh: {jstr(s['exampleZh'])} }}"
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


def build_words_ts(core_entries, footer_lines):
    with open(WORDS_OUT, encoding="utf-8") as f:
        lines = f.readlines()
    # header: 从开头到 "const SEED_CORE" 之前
    header = []
    for i, ln in enumerate(lines):
        if ln.startswith("const SEED_CORE"):
            break
        header.append(ln)
    # footer: 从 "export const SEED_WORDS" 开始
    footer = []
    for i, ln in enumerate(lines):
        if ln.startswith("export const SEED_WORDS"):
            footer = lines[i:]
            break
    # 升级版本号
    new_footer = []
    for ln in footer:
        if ln.strip().startswith("export const SEED_VERSION"):
            new_footer.append('export const SEED_VERSION = \'2026-07-17-ecdict-full\';\n')
        else:
            new_footer.append(ln)
    footer = new_footer

    core_ts = "const SEED_CORE: VocabEntry[] = [\n"
    core_ts += ",\n".join(emit_entry(e, 2) for e in core_entries)
    core_ts += "\n];\n\n"
    return "".join(header) + core_ts + "".join(footer)


def build_bulk_ts(bulk_entries):
    parts = []
    n = len(bulk_entries)
    chunk = (n + 15) // 16  # 16 段
    idx = 0
    for pi in range(16):
        seg = bulk_entries[idx: idx + chunk]
        idx += chunk
        if not seg:
            break
        parts.append(f"const part_{pi+1}: VocabEntry[] = [\n" +
                     ",\n".join(emit_entry(e, 2) for e in seg) + "\n];")
    body = "\n\n".join(parts)
    export = "export const SEED_BULK: VocabEntry[] = [\n" + ",\n".join(f"  ...part_{pi+1}" for pi in range(len(parts))) + "\n];\n"
    header = "// AUTO-GENERATED by scripts/enrich_ecdict.py — ECDICT 全词性富化版（请勿手改）。\nimport type { VocabEntry } from './words';\n\n"
    return header + body + "\n\n" + export


# ----------------------------------------------------------------------------
# main
# ----------------------------------------------------------------------------
def main():
    dry = "--dry" in sys.argv
    flat = load_flat()
    cache = load_cache()
    targets = set(e["term"] for e in flat)
    ecdict_idx, total = load_ecdict(targets)
    print(f"[info] ECDICT rows scanned={total}, matched targets={len(ecdict_idx)} / {len(targets)}", file=sys.stderr)

    core = flat[:210]
    bulk = flat[210:]

    core_entries = [build_entry(f, ecdict_idx.get(f["term"]), cache.get(f["term"])) for f in core]
    bulk_entries = [build_entry(f, ecdict_idx.get(f["term"]), cache.get(f["term"])) for f in bulk]

    # 覆盖率统计
    multi = sum(1 for e in core_entries + bulk_entries if len(e["senses"]) > 1)
    print(f"[info] core={len(core_entries)} bulk={len(bulk_entries)} multi-sense={multi} "
          f"({(multi*100)//(len(core_entries)+len(bulk_entries))}%)", file=sys.stderr)

    if dry:
        for term in ["still", "benefit", "ability", "address", "act"]:
            f = next((x for x in flat if x["term"] == term), None)
            if not f:
                continue
            e = build_entry(f, ecdict_idx.get(term), cache.get(term))
            print(f"\n===== {term} (matched={term in ecdict_idx}) =====")
            for s in e["senses"]:
                print(f"  {s['pos']:8} | {s['meaningZh']}  ||  {s['meaningEn'][:70]}")
        return

    words_ts = build_words_ts(core_entries, None)
    with open(WORDS_OUT, "w", encoding="utf-8") as f:
        f.write(words_ts)
    bulk_ts = build_bulk_ts(bulk_entries)
    with open(BULK_OUT, "w", encoding="utf-8") as f:
        f.write(bulk_ts)
    print("[ok] wrote", WORDS_OUT, "and", BULK_OUT, file=sys.stderr)


if __name__ == "__main__":
    main()
